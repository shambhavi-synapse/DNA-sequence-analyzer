"""Trace the approved SeqScope.io raster into its original outlines and colours.

Maintainer-only utility: Pillow, numpy, scipy, contourpy and Inkscape are local
asset-preparation tools, never website or build dependencies. No font is substituted.
The approved upload is WebP despite its supplied .png suffix; its bytes are unchanged; all generated SVGs use its native coordinates.
"""
from pathlib import Path
import subprocess
from PIL import Image
import numpy as np
from scipy.ndimage import label, binary_erosion, gaussian_filter
import contourpy

root=Path(__file__).resolve().parents[2]
source=root/'assets/branding/approved-reference.webp'
im=np.asarray(Image.open(source).convert('RGB')).astype(float)
assert im.shape==(512,1536,3), 'This tracer is calibrated to the attached approved source.'
y,x=np.indices(im.shape[:2])
labels,count=label(im.min(axis=2)<230)
components=[]
for i in range(1,count+1):
 mask=labels==i
 if mask.sum()>20:components.append(mask)
assert len(components)==24, 'Review changed source geometry before regenerating.'
components.sort(key=lambda mask:(np.where(mask)[1].min(),np.where(mask)[0].min()))

def simplify(points,epsilon=.22):
 if len(points)<3:return points
 a,b=points[0],points[-1];v=b-a
 distance=np.linalg.norm(points-a,axis=1) if np.dot(v,v)==0 else np.abs(v[0]*(points[:,1]-a[1])-v[1]*(points[:,0]-a[0]))/np.linalg.norm(v)
 i=int(np.argmax(distance))
 if distance[i]<=epsilon:return points[[0,-1]]
 return np.vstack((simplify(points[:i+1],epsilon)[:-1],simplify(points[i:],epsilon)))

def path(mask,neutral=False):
 result=[]
 field=mask.astype(float)
 if neutral:
  ink=np.median(im[binary_erosion(mask,iterations=2)],axis=0).min()
  field=field*np.clip((249-im.min(axis=2))/(249-ink),0,1)
 for points in contourpy.contour_generator(z=gaussian_filter(field,sigma=.6)).lines(.5):
  if len(points)<8:continue
  points=simplify(points)
  result.append('M'+'L'.join(f'{a:.2f},{b:.2f}' for a,b in points)+'Z')
 return ''.join(result)
def colour(rgb):return '#'+''.join(f'{int(np.clip(round(v),0,255)):02x}' for v in rgb)

layers=[];defs=[]
for i,mask in enumerate(components):
 yy,xx=np.where(mask);inner=binary_erosion(mask,iterations=2)
 if not inner.any():inner=mask
 median=np.median(im[inner],axis=0)
 neutral=(median.max()-median.min()<22 and median.max()<90)
 arc=xx.max()<600 and (yy.max()<202 or yy.min()>290)
 divider=xx.min()>600 and xx.max()<650
 # Gradient colours come from interior source pixels, avoiding white antialias matte.
 axis=x if arc else y
 lo,hi=np.min(axis[inner]),np.max(axis[inner]);stops=[]
 for fraction in np.linspace(0,1,11):
  coordinate=lo+(hi-lo)*fraction
  sample=inner&(np.abs(axis-coordinate)<=max(2,(hi-lo)/22))
  if not sample.any():sample=inner
  stops.append((fraction,colour(np.median(im[sample],axis=0))))
 identifier=f'approved-gradient-{i}'
 if not neutral and not divider:
  direction='x1="0" y1="0" x2="1" y2="0"' if arc else 'x1="0" y1="0" x2="0" y2="1"'
  defs.append(f'<linearGradient id="{identifier}" {direction}>'+''.join(f'<stop offset="{fraction:.2f}" stop-color="{value}"/>' for fraction,value in stops)+'</linearGradient>')
 fill='INK' if neutral else colour(median) if divider else f'url(#{identifier})'
 layers.append({'path':path(mask,neutral),'fill':fill,'flat':colour(median),'symbol':xx.max()<600})

# Only surrounding blank canvas is trimmed; the divider, lettering, emblem and
# all their relative positions remain in the original image coordinate system.
viewbox='270 135 1026 214';symbol_viewbox='270 135 332 214'
def svg(kind,theme='light',flat=False):
 ink='#25262b' if theme=='light' else '#f4f0e8'
 selected=[item for item in layers if kind!='symbol' or item['symbol']]
 body=''.join(f'<path d="{item["path"]}" fill="{ink if item["fill"]=="INK" else item["flat"] if flat else item["fill"]}"/>' for item in selected)
 return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SeqScope.io" fill-rule="evenodd" viewBox="'+(symbol_viewbox if kind=='symbol' else viewbox)+'"><title>SeqScope.io</title>'+('' if flat else '<defs>'+''.join(defs)+'</defs>')+body+'</svg>\n'
for theme in ['light','dark']:
 for kind in ['logo','horizontal','symbol']:
  (root/f'assets/branding/seqscope-{kind}-{theme}.svg').write_text(svg(kind,theme))
(root/'assets/branding/seqscope-logo-print.svg').write_text(svg('logo',flat=True))
symbol_body=svg('symbol').split('</defs>',1)[1].split('</svg>')[0]
favicon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill-rule="evenodd"><title>SeqScope.io</title><rect width="96" height="96" rx="20" fill="#f4f0e8"/><defs>'+''.join(defs)+'</defs><g transform="translate(6 20.93) scale(.253012048) translate(-270 -135)">'+symbol_body+'</g></svg>\n'
(root/'assets/favicon.svg').write_text(favicon)

def render(source,destination,width):
 subprocess.run(['inkscape',str(source),'--export-type=png',f'--export-filename={destination}',f'--export-width={width}'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
for width,name in [(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png')]:render(root/'assets/favicon.svg',root/'assets/branding'/name,width)
render(root/'assets/favicon.svg',root/'.qa/favicon-256.png',256)
Image.open(root/'.qa/favicon-256.png').save(root/'assets/favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64)])
for theme in ['light','dark']:render(root/f'assets/branding/seqscope-logo-{theme}.svg',root/f'assets/branding/seqscope-logo-{theme}.png',1539)
# Existing social-card dimensions; no new decoration or invented tagline.
card='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f4f0e8"/>'+svg('logo').replace('<svg ', '<svg x="90" y="208.6" width="1020" height="212.8" ',1)+'</svg>'
(root/'.qa/seqscope-social.svg').write_text(card)
render(root/'.qa/seqscope-social.svg',root/'assets/branding/seqscope-social.png',1200)
print('Traced 24 connected source shapes, preserved all wordmark holes and original composition.')

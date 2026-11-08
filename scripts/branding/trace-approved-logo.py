"""Trace the owner-approved artwork into vector contours, without inventing geometry.
Development utility only. Pillow/numpy/scipy/contourpy are not runtime dependencies.
"""
from pathlib import Path
from PIL import Image
import numpy as np
from scipy.ndimage import label, binary_erosion
import contourpy
import shutil
root=Path(__file__).resolve().parents[2]
source=root/'assets/branding/approved-reference.png'
im=np.asarray(Image.open(source).convert('RGB')).astype(float)
y,x=np.indices(im.shape[:2]);r,g,b=im.transpose(2,0,1)
foreground=im.min(axis=2)<225
masks={
 'wordmark':foreground&(y>=610)&(y<800),
 'strand':foreground&(im.max(axis=2)<140)&(y>=310)&(y<515),
 'top-arc':foreground&(y>=185)&(y<323)&(x>590)&(x<1000),
 'bottom-arc':foreground&(y>=515)&(y<612)&(x>600)&(x<970)
}
colour=foreground&((r-b)>22)&(y>=330)&(y<502)&(im.max(axis=2)>145)
labels,n=label(colour)
components=[]
for i in range(1,n+1):
 mask=labels==i
 if mask.sum()>80:components.append(mask)
components.sort(key=lambda m:np.where(m)[1].mean())
def simplify(points,epsilon=.55):
 if len(points)<3:return points
 a,b=points[0],points[-1];v=b-a
 if np.dot(v,v)==0:dist=np.linalg.norm(points-a,axis=1)
 else:dist=np.abs(v[0]*(points[:,1]-a[1])-v[1]*(points[:,0]-a[0]))/np.linalg.norm(v)
 i=int(np.argmax(dist))
 if dist[i]<=epsilon:return points[[0,-1]]
 return np.vstack((simplify(points[:i+1],epsilon)[:-1],simplify(points[i:],epsilon)))
def path(mask):
 outlines=contourpy.contour_generator(z=mask.astype(float)).lines(.5)
 result=[]
 for points in outlines:
  if len(points)<10:continue
  points=simplify(points)
  result.append('M'+'L'.join(f'{a:.2f},{b:.2f}' for a,b in points)+'Z')
 return ''.join(result)
def colour_hex(rgb):return '#'+''.join(f'{max(0,min(255,round(v))):02x}' for v in rgb)
defs=['<linearGradient id="arc"><stop stop-color="#b79b8f"/><stop offset=".5" stop-color="#514c49"/><stop offset="1" stop-color="#b79b8f"/></linearGradient>']
marks=[]
for i,m in enumerate(components):
 yy,xx=np.where(m);inner=binary_erosion(m,iterations=2);ys=np.where(inner)[0]
 top=im[inner&(y<=np.percentile(ys,30))].mean(axis=0);bottom=im[inner&(y>=np.percentile(ys,70))].mean(axis=0)
 defs.append(f'<linearGradient id="mark{i}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{colour_hex(top)}"/><stop offset="1" stop-color="{colour_hex(bottom)}"/></linearGradient>')
 marks.append(f'<path d="{path(m)}" fill="url(#mark{i})"/>')
symbol='<path d="'+path(masks['top-arc'])+'" fill="url(#arc)"/><path d="'+path(masks['bottom-arc'])+'" fill="url(#arc)"/><path class="identity-ink" d="'+path(masks['strand'])+'"/>'+''.join(marks)
word='<path class="identity-ink" d="'+path(masks['wordmark'])+'"/>'
for theme,ink in [('light','#202122'),('dark','#f4f0e8')]:
 head='<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SeqScope" fill-rule="evenodd" '
 common='<title>SeqScope</title><defs>'+''.join(defs)+'</defs><style>.identity-ink{fill:'+ink+'}</style>'
 for kind,viewbox,body in [
 ('logo','340 180 855 625',symbol+word),
 ('symbol','425 185 680 435',symbol),
 ('horizontal','0 0 225 48','<g transform="translate(0 1.25) scale(.1) translate(-425 -185)">'+symbol+'</g><g transform="translate(78 8.25) scale(.175) translate(-350 -610)">'+word+'</g>')]:
  body=body.replace('class="identity-ink"',f'fill="{ink}"')
  (root/f'assets/branding/seqscope-{kind}-{theme}.svg').write_text(head+'viewBox="'+viewbox+'">'+common+body+'</svg>\n')
favicon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill-rule="evenodd"><title>SeqScope</title><rect width="96" height="96" rx="20" fill="#f4f0e8"/><defs>'+''.join(defs)+'</defs><g transform="translate(6 21.132353) scale(.123529412) translate(-425 -185)">'+symbol.replace('class="identity-ink"','fill="#202122"')+'</g></svg>'
(root/'assets/favicon.svg').write_text(favicon+'\n')
print('Traced 4 outline layers and',len(components),'coloured sequence marks; wordmark holes preserved with evenodd fill.')
# Solid versions of the same approved colours avoid SVG gradient issues in PDF engines.
import re
s=(root/'assets/branding/seqscope-logo-light.svg').read_text()
gradients={}
for identifier,body in re.findall(r'<linearGradient id="([^"]+)"[^>]*>(.*?)</linearGradient>',s):
 colours=re.findall(r'stop-color="(#[0-9a-f]{6})"',body)
 rgb=np.array([[int(c[j:j+2],16) for j in (1,3,5)] for c in colours])
 gradients[identifier]=colour_hex(rgb.mean(axis=0))
s=re.sub(r'<defs>.*?</defs>','',s)
for identifier,colour in gradients.items():s=s.replace(f'url(#{identifier})',colour)
(root/'assets/branding/seqscope-logo-print.svg').write_text(s)

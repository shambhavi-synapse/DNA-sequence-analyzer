import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {reportModel,reportHTML,initializePrintReport} from '../src/print-report.js';
import {findORFs} from '../src/translation.js';
const example=(sequence='ATGAAATAG',code='1')=>reportModel({record:{header:'Synthetic report',sequence},minimum:6,code,orfs:findORFs(sequence,6,code)},'2026-11-08T00:00:00.000Z');
test('the report includes the approved image, scientific values, all six frames and coordinate rules',()=>{
 const html=reportHTML(example());
 assert.ok(html.includes('src="assets/branding/seqscope-logo-print.svg"'));
 assert.ok(html.includes('DNA Sequence Analysis Report'));assert.ok(html.includes('9 nt'));
 for(const protein of ['MK*','*N','EI','LFH','YF','IS'])assert.ok(html.includes(protein));
 assert.ok(html.includes('1–9'));assert.ok(html.includes('1-based inclusive'));assert.ok(html.includes('computational results'));
});
test('report transcription preserves template orientation and ambiguous-base denominators',()=>{
 const model=example('ATGCNN');assert.equal(model.composition.gc,50);assert.equal(model.composition.ambiguous,2);
 const html=reportHTML(model);assert.ok(html.includes('NNGCAU'));assert.ok(html.includes('AUGCNN'));assert.ok(html.includes('4 unambiguous A/C/G/T'));
});
test('report sequences and proteins are complete beyond the screen tile cap',()=>{
 const model=example('GCT'.repeat(600));const html=reportHTML(model);
 assert.ok(html.includes('GCT'.repeat(600)));assert.ok(html.includes('A'.repeat(600)));
 assert.ok(html.includes('Unavailable'));assert.ok(!html.includes('view capped'));
});
test('report model and labels follow the selected mitochondrial code and show undefined composition honestly',()=>{
 const html=reportHTML(example('ATGTGAAGA','2'));assert.ok(html.includes('MW*'));assert.ok(html.includes('table 2'));assert.ok(html.includes('AGA, AGG'));
 const ambiguous=reportHTML(example('NNNN'));assert.ok(ambiguous.includes('Undefined'));assert.ok(ambiguous.includes('0 unambiguous A/C/G/T'));
});
test('sequence headers are escaped and an empty browser print does not invent an analysis',()=>{
 const model=example();model.record.header='<img src=x onerror=alert(1)>';
 const html=reportHTML(model);assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('&lt;img'));
 const empty=reportHTML(null);assert.ok(empty.includes('Analyze a DNA sequence'));assert.ok(!empty.includes('Candidate open reading frames'));
});
test('native browser printing registers the same preparation used by Print Report',()=>{
 const events={};let calls=0;
 const host={innerHTML:''};const doc={getElementById:id=>id==='print-report'?host:null};
 const prepare=initializePrintReport(()=>{calls++;return null},doc,{addEventListener:(event,fn)=>events[event]=fn});
 prepare();assert.equal(calls,1);events.beforeprint();assert.equal(calls,2);assert.ok(host.innerHTML.includes('DNA Sequence Analysis Report'));
});
test('approved logo variants are self-contained vector assets and all icon sizes are local',()=>{
 for(const kind of ['horizontal','logo','symbol'])for(const theme of ['light','dark']){
  const file=new URL(`../assets/branding/seqscope-${kind}-${theme}.svg`,import.meta.url);const svg=readFileSync(file,'utf8');
  assert.equal([...svg.matchAll(/<svg\b/g)].length,1);assert.ok(!svg.includes('<image'));assert.ok(!/Helix Orbit|Sequence Analysis/.test(svg));
  assert.ok(svg.includes('fill-rule="evenodd"'));
 }
 for(const file of ['assets/branding/apple-touch-icon.png','assets/branding/icon-192.png','assets/branding/icon-512.png','assets/favicon.svg','assets/favicon.ico'])assert.ok(existsSync(new URL('../'+file,import.meta.url)));
 const manifest=JSON.parse(readFileSync(new URL('../site.webmanifest',import.meta.url),'utf8'));assert.equal(manifest.name,'SeqScope');assert.equal(manifest.start_url,'./#analyze');
});
test('portable print identity preserves every approved outline without depending on gradient rendering',()=>{
 const normal=readFileSync(new URL('../assets/branding/seqscope-logo-light.svg',import.meta.url),'utf8');
 const printable=readFileSync(new URL('../assets/branding/seqscope-logo-print.svg',import.meta.url),'utf8');
 const paths=s=>[...s.matchAll(/\bd="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(paths(printable),paths(normal));assert.ok(!printable.includes('url(#'));assert.ok(!printable.includes('linearGradient'));
});

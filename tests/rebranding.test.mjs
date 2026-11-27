import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {findingsText} from '../src/findings.js';
import {analysisCSV} from '../src/csv-export.js';
import {reportHTML,reportModel} from '../src/print-report.js';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const options={record:{header:'Synthetic',sequence:'ATGAAATAG'},minimum:3,gcWindow:3};
test('active text metadata uses exact SeqScope.io identity without moving the public site',()=>{
 const html=read('index.html'),manifest=JSON.parse(read('site.webmanifest'));
 assert.match(html,/<title>SeqScope\.io \| DNA Sequence Analysis<\/title>/);
 assert.match(html,/property="og:title" content="SeqScope\.io \| DNA Sequence Analysis"/);
 assert.match(html,/name="description" content="A Web-Based DNA Sequence Analysis and Molecular Biology Platform"/);
 assert.match(html,/property="og:description" content="A Web-Based DNA Sequence Analysis and Molecular Biology Platform"/);
 assert.equal(manifest.name,'SeqScope.io');assert.equal(manifest.short_name,'SeqScope.io');assert.equal(manifest.start_url,'./#analyze');assert.equal(manifest.scope,'./');
 assert.doesNotMatch(html,/(?:href|src)="https?:\/\/(?:www\.)?seqscope\.io(?:\/|")/i);
 assert.match(html,/https:\/\/shambhavi-synapse.github.io\/DNA-sequence-analyzer\//);
 assert.match(html,/Created by Shambhavi/);assert.doesNotMatch(html,/(?:alt|aria-label)="SeqScope(?: home)?"/);
});
test('generated reports and findings use the new product label and preserve scientific values',()=>{
 const text=findingsText(options),csv=analysisCSV(options),html=reportHTML(reportModel(options,'fixed'));
 assert.match(text,/^SeqScope\.io analysis 2026-11-23\.1/);assert.match(csv,/SeqScope\.io analysis/);assert.match(html,/<strong>SeqScope\.io<\/strong>/);assert.match(html,/alt="SeqScope\.io"/);
 assert.match(text,/Length: 9 nt/);assert.match(html,/MK\*/);assert.match(html,/1–9/);assert.doesNotMatch(text,/SeqScope(?!\.io) analysis/);
});
test('only branded export filenames change; saved preferences and stable asset identifiers persist',()=>{
 const app=read('src/app.js');assert.match(app,/download\('SeqScope\.io-analysis\.csv'/);assert.match(app,/download\('SeqScope\.io-alignment\.csv'/);assert.doesNotMatch(app,/download\('seqscope-(?:analysis|alignment)\.csv'/);
 assert.match(app,/download\('analyzed-sequences\.fasta'/);const theme=read('src/theme.js');assert.match(theme,/const key = 'seqscope-theme'/);assert.match(theme,/localStorage.getItem\('helix-lab-theme'\)/);
 assert.match(read('index.html'),/href="seqscope\.css\?/);assert.doesNotMatch(read('site.webmanifest'),/seqscope\.io\//i);
});
test('approved source and generated identity assets preserve the supplied outlines',()=>{
 const fixture=JSON.parse(read('tests/fixtures/branding-reference.json'));
 const source=readFileSync(new URL('../'+fixture.source,import.meta.url));
 assert.equal(createHash('sha256').update(source).digest('hex'),fixture.sha256);
 assert.equal(source.toString('ascii',0,4),'RIFF');assert.equal(source.toString('ascii',8,12),'WEBP');assert.equal(source.toString('ascii',12,16),'VP8X');
 assert.deepEqual([source.readUIntLE(24,3)+1,source.readUIntLE(27,3)+1],[1536,512]);
 const paths=svg=>[...svg.matchAll(/\bd="([^"]+)"/g)].map(m=>m[1]);
 const normal=read('assets/branding/seqscope-logo-light.svg');
 assert.match(normal,/viewBox="270 135 1026 214"/);
 for(const theme of ['light','dark'])for(const kind of ['logo','horizontal','symbol']){
  const svg=read(`assets/branding/seqscope-${kind}-${theme}.svg`);
  assert.match(svg,/<title>SeqScope\.io<\/title>/);assert.match(svg,/fill-rule="evenodd"/);assert.doesNotMatch(svg,/<image\b|<text\b|font-family/);
  if(kind!=='symbol')assert.deepEqual(paths(svg),paths(normal));
 }
 assert.deepEqual(paths(read('assets/branding/seqscope-logo-print.svg')),paths(normal));
});
test('transparent logo copies and existing icon/social sizes remain locally bundled',()=>{
 for(const theme of ['light','dark']){
  const png=readFileSync(new URL(`../assets/branding/seqscope-logo-${theme}.png`,import.meta.url));
  assert.equal(png.readUInt32BE(16),1539);assert.equal(png[25],6,'RGBA logo');
 }
 for(const [file,width,height] of [['apple-touch-icon.png',180,180],['icon-192.png',192,192],['icon-512.png',512,512],['seqscope-social.png',1200,630]]){
  const png=readFileSync(new URL('../assets/branding/'+file,import.meta.url));assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[width,height]);
 }
 assert.match(read('assets/favicon.svg'),/<title>SeqScope\.io<\/title>/);
});

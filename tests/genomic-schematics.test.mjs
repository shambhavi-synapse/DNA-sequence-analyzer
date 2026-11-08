import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translateCodon} from '../src/translation.js';
const asset=name=>readFileSync(new URL(`../assets/atlas-${name}.svg`,import.meta.url),'utf8');

test('genomic teaching figures use distinct, accessible mechanisms',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 for(const name of ['splicing','introns','phylogeny','population','code']){
  const svg=asset(name);assert.match(svg,/<title id="title">[^<]+<\/title>/);assert.match(svg,/<desc id="desc">[^<]+<\/desc>/);
  assert.ok(html.includes(`assets/atlas-${name}.svg`));
 }
 assert.ok(asset('splicing').includes('Isoform A'));assert.ok(asset('splicing').includes('E3 skipped'));
 assert.ok(asset('splicing').includes('Isoform B'));assert.ok(asset('splicing').includes('E2 skipped'));
 assert.notEqual(asset('introns'),asset('splicing'));
 assert.ok(asset('introns').includes('introns are transcribed before processing'));
 assert.ok(asset('phylogeny').includes('not sufficient evidence for ancestry'));
 assert.ok(asset('population').includes('group labels are abstract'));
});
test('the illustrated UGA reassignment agrees with the independently tested code tables',()=>{
 assert.equal(translateCodon('TGA','1'),'*');assert.equal(translateCodon('TGA','2'),'W');
 const svg=asset('code');assert.ok(svg.includes('Table 1'));assert.ok(svg.includes('Table 2'));
 assert.ok(svg.includes('STOP'));assert.ok(svg.includes('Trp · W'));assert.ok(svg.includes('Vertebrate'));
});

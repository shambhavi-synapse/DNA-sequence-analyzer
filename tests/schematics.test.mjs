import test from 'node:test';
import assert from 'node:assert/strict';
import {SCHEMATIC_EXAMPLES as examples,schematicMarkup} from '../src/schematics.js';
import {complement,transcribeTemplateStrand} from '../src/sequence.js';
import {translateFrame} from '../src/translation.js';
test('pairing schematic has antiparallel complementary bases and correct canonical bond counts',()=>{
 assert.equal(examples.pairing.top,'ATGCA');assert.equal(examples.pairing.bottom,'TACGT');
 assert.equal(complement(examples.pairing.top),examples.pairing.bottom);assert.deepEqual(examples.pairing.bonds,[2,2,3,3,2]);
 const drawing=schematicMarkup('pairing');assert.match(drawing,/Top strand 5′ ATGCA 3′; bottom strand 3′ TACGT 5′/);
});
test('transcription schematic distinguishes displayed 3′→5′ template from input convention',()=>{
 assert.equal(examples.transcription.template,'TACCGAATT');assert.equal(examples.transcription.rna,'AUGGCUUAA');
 assert.equal(complement(examples.transcription.coding),examples.transcription.template);
 assert.equal(transcribeTemplateStrand([...examples.transcription.template].reverse().join('')),examples.transcription.rna);
});
test('all displayed RNA reading frames, residues and incomplete tails agree with standard translation',()=>{
 const expected=['MA*','WL','GL'];
 const dna=examples.transcription.rna.replaceAll('U','T');
 examples.frames.forEach((frame,i)=>{
  assert.equal(translateFrame(dna,frame.offset),expected[i]);
  assert.equal(frame.codons.join('')+frame.tail,examples.transcription.rna.slice(frame.offset));
 });
 assert.deepEqual(examples.frames.map(f=>f.residues),[['Met','Ala','Stop'],['Trp','Leu'],['Gly','Leu']]);
 assert.deepEqual(examples.frames.map(f=>f.tail),['','AA','A']);
});
test('replication schematic separates daughter synthesis from fork movement and identifies primers',()=>{
 const drawing=schematicMarkup('replication');
 // At a right-moving fork, upper fragments extend left; lower leading strand extends right.
 assert.match(drawing,/<line x1="220" y1="118" x2="80" y2="118" class="diagram-new"/);
 assert.match(drawing,/<line x1="442" y1="118" x2="302" y2="118" class="diagram-new"/);
 assert.match(drawing,/<line x1="80" y1="235" x2="500" y2="235" class="diagram-new"/);
 assert.match(drawing,/RNA primers at fragment 5′ ends/);
 assert.match(drawing,/Grey parental templates are antiparallel/);
});
test('all diagrams have accessible unique titles and descriptions; unknown keys are rejected',()=>{
 const all=['pairing','replication','transcription','frames'].map(schematicMarkup).join('');
 const ids=[...all.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 assert.equal([...all.matchAll(/role="img" aria-labelledby=/g)].length,4);
 assert.equal([...all.matchAll(/<desc /g)].length,4);
 assert.throws(()=>schematicMarkup('<script>'),/Unknown/);
});
test('the interactive pairing explorer draws all four selected pairs with correct names and bonds',async()=>{
 const {selectedPairMarkup}=await import('../src/schematics.js');
 for(const [base,name,partner,bonds] of [['A','Adenine','Thymine',2],['T','Thymine','Adenine',2],['G','Guanine','Cytosine',3],['C','Cytosine','Guanine',3]]){
  const markup=selectedPairMarkup(base);assert.ok(markup.includes(`${name} pairs with ${partner}`));assert.ok(markup.includes(`${bonds} hydrogen bonds`));
  assert.equal([...markup.matchAll(/class="diagram-bond"/g)].length,bonds);assert.match(markup,/not chemical structures/);
 }
 assert.throws(()=>selectedPairMarkup('N'),/standard DNA base/);
});
test('the orientation example aligns actual complementary sequences rather than unlabeled base-pair dots',async()=>{
 const {readFileSync}=await import('node:fs');const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.ok(html.includes('<code>5′ ATGC 3′</code><code>3′ TACG 5′</code>'));
 assert.ok(html.includes('<code>5′ GCAT 3′</code>'));
 assert.ok(!html.includes('<b>A · T&nbsp;&nbsp; G · C</b>'));
});

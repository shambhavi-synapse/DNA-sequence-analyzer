import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSequence, countComposition, complement, reverseComplement, transcribeTemplateStrand, slidingGC, parseFasta } from '../src/sequence.js';
import { translateCodon, sixFrames, findORFs } from '../src/translation.js';
import { findMotif } from '../src/motifs.js';
import { alignGlobal } from '../src/compare.js';
import { substituteBase, classifyCodonSubstitution } from '../src/mutation.js';

test('template input 5′→3′ produces antiparallel RNA 5′→3′', () => {
  assert.equal(transcribeTemplateStrand('ATGC'), 'GCAU');
  assert.equal(transcribeTemplateStrand('TAC'), 'GUA');
  assert.equal(transcribeTemplateStrand('ATG'), 'CAU');
  assert.equal(transcribeTemplateStrand('RNY'), 'RNY'.split('').reverse().map(base => ({R:'Y',N:'N',Y:'R'}[base])).join('').replaceAll('T','U'));
});
test('substitution requires exactly one canonical base', () => {
  for (const alt of ['', 'AC', 'N', 'a', 'ATG']) assert.throws(() => substituteBase('ATG', 2, alt), /Substitution base/);
  assert.deepEqual(substituteBase('ATG',2,'C'), {sequence:'ACG',position:2,reference:'T',alternate:'C',changed:true});
  assert.equal(substituteBase('ATG',2,'T').changed, false);
});
test('codon consequences distinguish no change, synonymous, missense and stop events', () => {
  const cases = [
    ['GAG','GAG','unchanged'], ['GCT','GCC','synonymous'],
    ['GAG','GTG','missense'], ['TGG','TAG','nonsense'],
    ['TAA','CAA','stop-loss'], ['TAA','TAG','stop-retained']
  ];
  for (const [reference,alternate,expected] of cases) assert.equal(classifyCodonSubstitution(reference,alternate).consequence, expected);
});
test('composition handles only ambiguities without inventing percentages', () => {
  const allN = countComposition('NNRY');
  assert.equal(allN.length,4);
  assert.equal(allN.known,0);
  assert.equal(allN.gc,null);
  assert.equal(allN.at,null);
  assert.equal(countComposition('GGATN').gc,50);
  assert.throws(() => normalizeSequence('AT-U'), /Invalid character/);
  assert.throws(() => parseFasta('>empty\n'), /no sequence/);
});
test('ambiguous complements and reverse complements retain IUPAC semantics', () => {
  assert.equal(complement('RYSWKMBDHVN'),'YRSWMKVHDBN');
  assert.equal(reverseComplement('ATGC'),'GCAT');
});
test('complete and undersized GC windows, including undefined N-only windows', () => {
  assert.deepEqual(slidingGC('GNC',3),[{start:1,end:3,gc:100}]);
  assert.deepEqual(slidingGC('NNAT',2),[
    {start:1,end:2,gc:null},{start:2,end:3,gc:0},{start:3,end:4,gc:0}
  ]);
  assert.deepEqual(slidingGC('AT',3),[]);
  assert.deepEqual(slidingGC('AT',2),[{start:1,end:2,gc:0}]);
});
test('six-frame offsets and genetic code reassignments have known translations', () => {
  const frames=sixFrames('AATGGCTTAA');
  assert.equal(frames[0].protein,'NGL'); // AAT GGC TTA
  assert.equal(frames[1].protein,'MA*'); // ATG GCT TAA
  assert.equal(translateCodon('GCN'),'A');
  assert.equal(translateCodon('TAR'),'*');
  assert.equal(translateCodon('TGA','1'),'*');
  assert.equal(translateCodon('TGA','2'),'W');
});
test('nested ORFs end at the first in-frame stop and use inclusive coordinates', () => {
  const orfs=findORFs('ATGATGTAA',9);
  assert.deepEqual(orfs.filter(o=>o.strand==='+').map(o=>[o.start,o.end,o.length,o.protein]),
    [[1,9,9,'MM*']]);
  const nested=findORFs('ATGATGTAA',6).filter(o=>o.strand==='+');
  assert.deepEqual(nested.map(o=>[o.start,o.end]),[[1,9],[4,9]]);
  const rev=findORFs('TTATTTCAT',9);
  assert.deepEqual(rev.map(o=>[o.strand,o.start,o.end,o.protein]),[['−',1,9,'MK*']]);
});
test('literal motifs overlap, reverse-strand matches use input coordinates', () => {
  assert.deepEqual(findMotif('AAAA','AA').map(h=>[h.start,h.end]),[[1,2],[2,3],[3,4]]);
  assert.deepEqual(findMotif('AAGCTT','AAG',true).map(h=>[h.start,h.end,h.strand]),[[1,3,'+'],[4,6,'−']]);
});
test('global alignment exact identity, gap penalties and ambiguity literals', () => {
  const same=alignGlobal('ATGC','ATGC');
  assert.equal(same.score,8);
  assert.equal(same.identity,100);
  assert.equal(same.gaps,0);
  const mismatch=alignGlobal('AN','AT');
  assert.equal(mismatch.matches,1);
  assert.equal(mismatch.mismatches,1);
  assert.equal(mismatch.identity,50);
  const gap=alignGlobal('ACT','ACGT');
  assert.equal(gap.identity,75);
  assert.equal(gap.gaps,1);
  assert.throws(()=>alignGlobal('','AT'),/Enter/);
});

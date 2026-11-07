import test from 'node:test';
import assert from 'node:assert/strict';
import { findORFs, translateFrame } from '../src/translation.js';
import { reverseComplement } from '../src/sequence.js';
import { alignGlobal } from '../src/compare.js';

// Independent translation of individual candidate intervals checks that
// frame-level translation caching retains exact peptide and coordinate semantics.
test('nested candidate ORFs retain their translated proteins and coordinates', () => {
  const sequence='CATGATGAAATAGATGAAATGATGA';
  for(const code of ['1','2']) {
    const candidates=findORFs(sequence,6,code);
    assert.ok(candidates.length>0);
    for(const hit of candidates) {
      const oriented=hit.strand==='+'?sequence.slice(hit.start-1,hit.end):
        reverseComplement(sequence.slice(hit.start-1,hit.end));
      assert.equal(hit.protein,translateFrame(oriented,0,code));
      assert.equal(oriented.slice(0,3),'ATG');
      assert.equal(hit.length,oriented.length);
      assert.equal(hit.length%3,0);
    }
  }
});
test('multiple nested starts report each distinct complete candidate',()=>{
  const candidates=findORFs('ATGATGATGTAA',6).filter(o=>o.strand==='+');
  assert.deepEqual(candidates.map(o=>[o.start,o.end,o.protein]),[
    [1,12,'MMM*'],[4,12,'MM*'],[7,12,'M*']
  ]);
});
test('reverse coding orientation correctly maps staggered starts',()=>{
  const sequence=reverseComplement('CCATGATGTAAGG');
  const candidates=findORFs(sequence,6).filter(o=>o.strand==='−');
  assert.deepEqual(candidates.map(o=>[o.start,o.end,o.protein]),[
    [3,8,'M*'],[3,11,'MM*']
  ]);
});
test('alignment validates scores and rejects numeric overflow',()=>{
  assert.throws(()=>alignGlobal('A','A',{match:1.5}),/integers/);
  assert.throws(()=>alignGlobal('A','A',{mismatch:NaN}),/integers/);
  assert.throws(()=>alignGlobal('A','A',{gap:Infinity}),/integers/);
  assert.throws(()=>alignGlobal('A','A',{maxLength:Infinity}),/positive integer/);
  assert.throws(()=>alignGlobal('A','A',{maxLength:0}),/positive integer/);
  assert.throws(()=>alignGlobal('AA','AA',{match:2147483647}),/numeric range/);
  const valid=alignGlobal('ACT','ACGT',{match:2,mismatch:-1,gap:-2});
  assert.equal(valid.identity,75);
  assert.equal(valid.gaps,1);
});

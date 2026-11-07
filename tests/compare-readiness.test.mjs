import test from 'node:test';
import assert from 'node:assert/strict';
import {alignGlobal} from '../src/compare.js';
import {alignmentColumns} from '../src/alignment-view.js';
const cases=[
 ['identical','ACGT','ACGT',4,0,0,8,100],
 ['single substitution','ATGGAG','ATGGTG',5,1,0,9,100*5/6],
 ['multiple substitutions','AACCGG','AATTGG',4,2,0,6,100*4/6],
 ['insertion','ACGT','ACTGT',4,0,1,6,80],
 ['deletion','ACTGT','ACGT',4,0,1,6,80],
 ['different lengths','AA','AAAA',2,0,2,0,50],
 ['literal ambiguity match','AN','AN',2,0,0,4,100],
 ['ambiguity does not expand','AN','AA',1,1,0,1,50]
];
for(const [label,a,b,matches,mismatches,gaps,score,identity] of cases)test(`global alignment: ${label}`,()=>{
 const r=alignGlobal(a,b);assert.deepEqual([r.matches,r.mismatches,r.gaps,r.score],[matches,mismatches,gaps,score]);assert.ok(Math.abs(r.identity-identity)<1e-9);assert.equal(r.alignedA.replaceAll('-',''),a);assert.equal(r.alignedB.replaceAll('-',''),b);const columns=alignmentColumns(r.alignedA,r.alignedB);assert.equal(columns.filter(c=>c.positionA!==null).length,a.length);assert.equal(columns.filter(c=>c.positionB!==null).length,b.length);
});
test('comparison rejects empty, non-DNA and over-limit inputs with useful errors',()=>{
 for(const [a,b] of [['','A'],['A',' '],['AC?','ACG'],['AUG','ATG']])assert.throws(()=>alignGlobal(a,b),/Enter a DNA sequence|Invalid character/);
 assert.throws(()=>alignGlobal('A'.repeat(1501),'A'),/1,500|1500/);
});
test('maximum advertised input length retains exact complete alignment',()=>{
 const s='ACGT'.repeat(375),r=alignGlobal(s,s);assert.equal(r.columns,1500);assert.equal(r.score,3000);assert.equal(r.identity,100);assert.equal(r.alignedA,s);
});

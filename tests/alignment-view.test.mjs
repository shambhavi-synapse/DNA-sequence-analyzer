import test from 'node:test';import assert from 'node:assert/strict';import {alignmentColumns,alignmentCSV} from '../src/alignment-view.js';import {alignGlobal} from '../src/compare.js';
test('gaps do not consume sequence coordinates',()=>{const c=alignmentColumns('A-CG','AT-G');assert.deepEqual(c.map(x=>[x.positionA,x.positionB]),[[1,1],[null,2],[2,null],[3,3]]);assert.deepEqual(c.map(x=>x.kind),['match','gap','gap','match']);});
test('alignment export retains gaps and coordinates',()=>{assert.equal(alignmentCSV(alignmentColumns('A-','AT')),'column,position_A,base_A,position_B,base_B,type\n1,1,A,1,A,match\n2,,-,2,T,gap');});
test('coverage counts paired residues for unequal lengths',()=>{const r=alignGlobal('ACGT','AGT');assert.equal(r.coverageA,75);assert.equal(r.coverageB,100);});
test('invalid alignment lengths rejected',()=>assert.throws(()=>alignmentColumns('AT','A')));

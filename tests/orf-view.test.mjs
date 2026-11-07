import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutORFRows} from '../src/orf-view.js';
test('Nested ORF marks have distinct clickable subtracks without changing input candidates',()=>{
 const orfs=[{frame:'+1',start:1,end:24},{frame:'+1',start:13,end:24},{frame:'+1',start:28,end:39},{frame:'−2',start:4,end:15}];
 const original=JSON.stringify(orfs),layout=layoutORFRows(orfs);
 assert.notEqual(layout.positions[0].y,layout.positions[1].y);
 assert.equal(layout.positions[0].y,layout.positions[2].y);
 assert.equal(layout.rows.find(row=>row.frame==='+1').lanes,2);
 assert.ok(layout.positions[3].y>layout.positions[2].y);
 assert.equal(JSON.stringify(orfs),original);
});
test('ORF lane assignment separates all inclusive interval overlaps and retains six frame labels',()=>{
 const orfs=Array.from({length:250},(_,i)=>({frame:'−3',start:1+i,end:800}));
 const layout=layoutORFRows(orfs);
 assert.equal(new Set(layout.positions.map(p=>p.y)).size,250);
 assert.deepEqual(layout.rows.map(r=>r.frame),['+1','+2','+3','−1','−2','−3']);
 assert.ok(layout.height>layout.positions.at(-1).y);
 const empty=layoutORFRows([]);assert.equal(empty.rows.length,6);assert.deepEqual(empty.positions,[]);
});

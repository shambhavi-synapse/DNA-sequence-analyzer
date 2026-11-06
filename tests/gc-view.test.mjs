import test from 'node:test';import assert from 'node:assert/strict';import {gcSegments,describeGCWindow} from '../src/gc-view.js';
test('undefined GC breaks segments without discarding zero GC',()=>{const p=[{start:1,gc:null},{start:2,gc:0},{start:3,gc:50},{start:4,gc:null},{start:5,gc:100}];assert.deepEqual(gcSegments(p),[[p[1],p[2]],[p[4]]]);});
test('all undefined GC has no plotted measurements',()=>assert.deepEqual(gcSegments([{start:1,gc:null}]),[]));
test('window description uses inclusive coordinates and explicit denominator',()=>assert.equal(describeGCWindow({start:7,gc:50},3),'Positions 7–9: 50.00% GC among unambiguous bases.'));

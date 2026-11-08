import test from 'node:test';
import assert from 'node:assert/strict';
import {initializePrintView} from '../src/print-view.js';
test('print includes closed reading-frame groups and restores the original disclosure state',()=>{
 const forward={open:true,isConnected:true},reverse={open:false,isConnected:true},events={};
 initializePrintView({querySelectorAll:()=>[forward,reverse].filter(g=>!g.open)},{addEventListener:(name,handler)=>events[name]=handler});
 events.beforeprint();assert.ok(forward.open&&reverse.open);events.afterprint();assert.equal(forward.open,true);assert.equal(reverse.open,false);
 events.beforeprint();events.afterprint();assert.equal(reverse.open,false);
});
test('re-rendered disclosure nodes are not changed after printing',()=>{
 const oldGroup={open:false,isConnected:true},events={};initializePrintView({querySelectorAll:()=>[oldGroup]},{addEventListener:(name,handler)=>events[name]=handler});events.beforeprint();oldGroup.isConnected=false;events.afterprint();assert.equal(oldGroup.open,true);
});

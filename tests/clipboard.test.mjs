import test from 'node:test';
import assert from 'node:assert/strict';
import {copyText} from '../src/clipboard.js';
const summary='Sequence: ambiguous_record\nLength: 6 nt\nGC: 50.00%; ambiguous: 2\n';
test('clipboard API receives exact scientific text',async()=>{let received;await copyText(summary,{clipboard:{writeText:async value=>received=value}});assert.equal(received,summary);});
function fallback(allowed=true){let field;const state={removed:false,selected:false,restored:false};const document={activeElement:{focus:()=>state.restored=true},body:{append:value=>field=value},createElement:()=>({style:{},setAttribute:()=>{},select:()=>state.selected=true,remove:()=>state.removed=true}),execCommand:command=>{assert.equal(command,'copy');state.copied=field.value;return allowed;}};return{document,state};}
test('local-preview fallback selects exact text and restores focus',async()=>{const b=fallback();await copyText(summary,{clipboard:{},document:b.document});assert.equal(b.state.copied,summary);assert.ok(b.state.selected&&b.state.removed&&b.state.restored);});
test('denied Clipboard API can fall back without losing text',async()=>{const b=fallback();await copyText(summary,{clipboard:{writeText:async()=>{throw Error('permission')}},document:b.document});assert.equal(b.state.copied,summary);});
test('copy failure is explicit and still removes the temporary field',async()=>{const b=fallback(false);await assert.rejects(copyText(summary,{clipboard:{},document:b.document}),/unavailable/);assert.ok(b.state.removed&&b.state.restored);});

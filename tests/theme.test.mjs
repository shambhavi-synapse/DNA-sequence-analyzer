import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../src/theme.js',import.meta.url),'utf8');
function browser({stored,legacy,dark=false,blocked=false}={}){
 const values=new Map(Object.entries({'seqscope-theme':stored,'helix-lab-theme':legacy}).filter(([,v])=>v!==undefined));
 const root={dataset:{},style:{}},events={},windowEvents={},mediaEvents={};
 const control={value:'system',addEventListener:(event,fn)=>events[event]=fn};
 const meta={setAttribute:(_key,value)=>meta.content=value};
 const media={matches:dark,addEventListener:(event,fn)=>mediaEvents[event]=fn};
 const context={document:{documentElement:root,readyState:'loading',querySelector:selector=>selector==='#theme-select'?control:meta,addEventListener:(event,fn)=>events[event]=fn},window:{addEventListener:(event,fn)=>windowEvents[event]=fn},matchMedia:()=>media,localStorage:{getItem:key=>{if(blocked)throw Error('unavailable');return values.get(key)??null},setItem:(key,value)=>{if(blocked)throw Error('unavailable');values.set(key,value)}}};
 vm.runInNewContext(script,context);
 return{root,meta,control,values,bind:()=>events.DOMContentLoaded(),choose:value=>{control.value=value;events.change()},os:value=>{media.matches=value;mediaEvents.change()},storage:event=>windowEvents.storage(event)};
}
test('first paint follows the operating system before interactive controls bind',()=>{
 for(const dark of [false,true]){const b=browser({dark});assert.equal(b.root.dataset.theme,dark?'dark':'light');assert.equal(b.root.dataset.themePreference,'system');assert.equal(b.root.style.colorScheme,dark?'dark':'light');assert.equal(b.meta.content,dark?'#18191b':'#f4f0e8');b.bind();assert.equal(b.control.value,'system');}
});
test('explicit preferences survive reload and override opposite system settings',()=>{
 for(const preference of ['light','dark']){const b=browser({stored:preference,dark:preference!=='dark'});b.bind();assert.equal(b.root.dataset.theme,preference);assert.equal(b.control.value,preference);b.os(preference==='dark');assert.equal(b.root.dataset.theme,preference);}
});
test('choosing System resumes live OS updates and persists the preference',()=>{
 const b=browser({stored:'light',dark:true});b.bind();b.choose('system');assert.equal(b.root.dataset.theme,'dark');assert.equal(b.values.get('seqscope-theme'),'system');b.os(false);assert.equal(b.root.dataset.theme,'light');b.choose('dark');b.os(false);assert.equal(b.root.dataset.theme,'dark');assert.equal(b.values.get('seqscope-theme'),'dark');
});
test('invalid or blocked storage falls back to System without breaking controls',()=>{
 for(const options of [{stored:'invalid',dark:true},{blocked:true,dark:true}]){const b=browser(options);b.bind();assert.equal(b.control.value,'system');assert.equal(b.root.dataset.theme,'dark');b.choose('light');assert.equal(b.root.dataset.theme,'light');}
});
test('explicit legacy preference is retained until a SeqScope preference is chosen',()=>{
 const b=browser({legacy:'dark'});b.bind();assert.equal(b.control.value,'dark');b.choose('system');const reloaded=browser({stored:b.values.get('seqscope-theme'),legacy:'dark'});assert.equal(reloaded.root.dataset.themePreference,'system');assert.equal(reloaded.root.dataset.theme,'light');
});
test('cross-tab preference changes update the control and all root theme tokens',()=>{
 const b=browser();b.bind();b.storage({key:'unrelated',newValue:'dark'});assert.equal(b.root.dataset.theme,'light');b.storage({key:'seqscope-theme',newValue:'dark'});assert.equal(b.root.dataset.theme,'dark');assert.equal(b.control.value,'dark');b.storage({key:null,newValue:null});assert.equal(b.control.value,'system');assert.equal(b.root.dataset.theme,'light');
});

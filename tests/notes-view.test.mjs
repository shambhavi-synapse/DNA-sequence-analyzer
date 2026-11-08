import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initializeNotesView,notesModeFromHash} from '../src/notes-view.js';
import {routeFromHash} from '../src/navigation.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const articleTags=[...html.matchAll(/<article class="(?:life-card|editorial-card|curious-card)[^"]*"[^>]*>/g)].map(m=>m[0]);
class Element{
 constructor(){this.children=[];this.dataset={};this.attributes={};this.events={};this.hidden=false;}
 append(...children){this.children.push(...children);}
 setAttribute(key,value){this.attributes[key]=value;}
 addEventListener(key,fn){this.events[key]=fn;}
 focus(options){this.focusOptions=options;}
}
function setup(hash='#notes'){
 const tabs=['reading','overview'].map(mode=>Object.assign(new Element(),{dataset:{notesMode:mode}}));
 const reading=new Element(),overview=new Element();
 const articles=articleTags.map(tag=>{
  const article=new Element();article.id=tag.match(/id="([^"]+)"/)[1];article.dataset.summary=tag.match(/data-summary="([^"]+)"/)[1];
  article.querySelector=()=>({textContent:article.id});return article;
 });
 const groups=[articles.slice(0,5),articles.slice(5,17),articles.slice(17)];
 const doc={createElement:()=>new Element(),getElementById:id=>id==='notes-reading-panel'?reading:overview,querySelectorAll:selector=>selector==='[data-notes-mode]'?tabs:selector.startsWith('.life')?groups[0]:selector.startsWith('.note-grid')?groups[1]:groups[2]};
 const pushes=[];const win={location:{hash},history:{pushState:(_a,_b,next)=>{pushes.push(next);win.location.hash=next;}}};
 return {tabs,reading,overview,win,pushes,sync:initializeNotesView({doc,win})};
}
test('all 30 topics have unique stable anchors, concise summaries and Notes routes',()=>{
 assert.equal(articleTags.length,30);
 const ids=articleTags.map(tag=>tag.match(/id="([^"]+)"/)[1]);
 assert.equal(new Set(ids).size,30);
 for(const tag of articleTags){assert.match(tag,/data-summary="[^\"]{35,130}"/);assert.equal(routeFromHash('#'+tag.match(/id="([^"]+)"/)[1]),'notes');}
 for(const id of ['notes-reading','notes-overview'])assert.equal(routeFromHash('#'+id),'notes');
});
test('Reading is default; Overview uses article metadata without copying full prose',()=>{
 const b=setup();assert.equal(b.reading.hidden,false);assert.equal(b.overview.hidden,true);
 assert.equal(b.tabs[0].attributes['aria-selected'],'true');assert.equal(b.tabs[1].tabIndex,-1);
 assert.equal(b.overview.children.length,3);
 const links=b.overview.children.flatMap(group=>group.children[1].children.map(li=>li.children[0]));
 assert.equal(links.length,30);assert.equal(links[0].href,'#note-lactase');assert.equal(links[29].href,'#note-population-data');
 assert.equal(links[0].children[1].children[1].textContent,'Regulatory changes can preserve lactase production into adulthood.');
});
test('mode controls push reproducible hashes, avoid redundant history and do not scroll',()=>{
 const b=setup();b.tabs[1].events.click();b.tabs[1].events.click();
 assert.deepEqual(b.pushes,['#notes-overview']);assert.equal(b.reading.hidden,true);assert.equal(b.overview.hidden,false);
 b.tabs[0].events.click();assert.equal(b.win.location.hash,'#notes-reading');assert.equal(b.reading.hidden,false);
});
test('arrow, Home and End keys move focus and activate the appropriate tab',()=>{
 const b=setup();let prevented=0;
 b.tabs[0].events.keydown({key:'ArrowRight',preventDefault:()=>prevented++});
 assert.equal(b.win.location.hash,'#notes-overview');assert.deepEqual(b.tabs[1].focusOptions,{preventScroll:true});
 b.tabs[1].events.keydown({key:'Home',preventDefault:()=>prevented++});assert.equal(b.reading.hidden,false);
 b.tabs[0].events.keydown({key:'End',preventDefault:()=>prevented++});assert.equal(b.overview.hidden,false);
 b.tabs[1].events.keydown({key:'ArrowLeft',preventDefault:()=>prevented++});assert.equal(b.reading.hidden,false);assert.equal(prevented,4);
});
test('direct links and history restore mode before topic navigation',()=>{
 const b=setup('#notes-overview');assert.equal(b.overview.hidden,false);
 for(const hash of ['#notes','#note-replication','#note-hbb','#notes-reading']){b.sync(hash);assert.equal(b.reading.hidden,false);assert.equal(notesModeFromHash(hash),'reading');}
 b.sync('#notes-overview');assert.equal(b.overview.hidden,false);
 assert.match(html,/role="tablist" aria-label="Molecular Notes view"/);
 assert.match(html,/id="notes-reading-panel" role="tabpanel" aria-labelledby="notes-reading"/);
});
test('Notes mode panels preserve balanced HTML containers and keep every topic in the reading panel',()=>{
 const stack=[],voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 const readingTopics=[];
 for(const match of html.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)){
  const tag=match[1].toLowerCase(),token=match[0];
  if(voids.has(tag)||token.endsWith('/>'))continue;
  if(token.startsWith('</'))assert.equal(stack.pop()?.tag,tag,`unbalanced ${tag}`);
  else{
   if(tag==='article'&&/id="note-/.test(token)){assert.ok(stack.some(x=>x.id==='notes-reading-panel'));readingTopics.push(token);}
   stack.push({tag,id:token.match(/\bid="([^"]+)"/)?.[1]});
  }
 }
 assert.deepEqual(stack,[]);assert.equal(readingTopics.length,30);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const notes=html.slice(html.indexOf('id="view-notes"'),html.indexOf('id="view-explore"'));
const catalogue=JSON.parse(readFileSync(new URL('../docs/INDIAN-SOURCES.json',import.meta.url),'utf8'));

test('Molecular Notes research catalogue has linked, distinct sources and explicit provenance',()=>{
  const urls=new Set();
  for(const [id,source] of Object.entries(catalogue)){
    assert.equal(new URL(source.url).protocol,'https:',id);
    assert.ok(notes.includes(`href="${source.url}"`),`orphan source ${id}`);
    assert.ok(source.institution && source.kind && source.origin,id);
    assert.ok(!urls.has(source.url),`duplicate source ${id}`);urls.add(source.url);
    if(source.kind==='research paper'){
      assert.equal(source.url,`https://doi.org/${source.doi}`);
      assert.ok(source.authors.length && source.affiliation_evidence.length,id);
      assert.ok(Number(source.publication_year)<=2026,id);
    }
  }
  // Count unique documents, not repeated links to the same teaching resource.
  const references=new Set([...notes.matchAll(/href="(https:[^"]+)"/g)].map(m=>m[1]));
  assert.ok([...references].filter(u=>urls.has(u)).length>references.size/2);
});

test('Molecular Notes retains teaching qualifications and excludes confirmed unrelated citations',()=>{
  assert.ok(notes.includes('This preclinical work targets a different locus'));
  assert.ok(notes.includes('Correlation does not by itself establish'));
  assert.ok(notes.includes('does not independently validate the coriander association'));
  assert.ok(notes.indexOf('id="genetics-life"')<notes.indexOf('Essential concepts'));
  for(const unrelated of ['PMC4528411','PMC5774632'])assert.ok(!notes.includes(unrelated));
  assert.ok(notes.includes('https://www.nature.com/articles/nrg3199'));
  assert.ok(notes.includes('https://doi.org/10.1093/nar/gkv862'));
});

test('Creator identity is complete in About and remains abbreviated in the footer',()=>{
  const about=html.slice(html.indexOf('id="view-about"'),html.indexOf('<footer>'));
  assert.ok(about.includes("Hi, I'm Shambhavi Tiwari, a biology student from India."));
  assert.ok(about.includes('<strong>Shambhavi Tiwari</strong>'));
  const footer=html.slice(html.indexOf('<footer>'));
  assert.ok(footer.includes('Created by Shambhavi · India'));
  assert.ok(!footer.includes('Tiwari'));
});

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
  assert.ok(references.size>urls.size); // Shared international foundations remain available.
});

test('Molecular Notes retains teaching qualifications and excludes confirmed unrelated citations',()=>{
  assert.ok(notes.includes('Skin pigmentation is a distinct trait'));
  for(const removed of ['10.1093/emboj/20.11.2977','10.3389/fgene.2022.878134','10.1186/s13287-024-04117-0'])assert.ok(!notes.includes(removed));
  assert.ok(!/Research from India|Indian contribution|research-context/.test(notes));
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

// Regression for the reported 50px paragraph: only the index and title may be
// direct grid items beside the shared reading body.
test('Every standard concept keeps its prose and citations in one reading grid item',()=>{
  const articles=[...notes.matchAll(/<article class="editorial-card"[^>]*>.*?<\/article>/gs)].map(m=>m[0]);
  assert.equal(articles.length,12);
  for(const article of articles){
    assert.match(article,/<\/h3><div class="note-body">/);
    assert.match(article,/<div class="further-reading" role="group"[^>]+>/);
    assert.ok(article.endsWith('</div></div></article>'));
    assert.ok(!article.includes('<aside'));
  }
});

test('Essential Concepts are text-led and retain only small explanatory sequence diagrams',()=>{
 const concepts=notes.slice(notes.indexOf('class="note-grid"'),notes.indexOf('class="foundations"'));
 assert.ok(!/<img\b/.test(concepts));
 assert.equal([...concepts.matchAll(/<figure class="teaching-figure" data-schematic=/g)].length,4);
 assert.ok(!concepts.includes('atlas-process'));
 assert.ok(concepts.includes('href="#base-pairing"'));
 assert.ok(concepts.includes('href="#codon-builder"'));
 assert.ok(notes.includes('assets/chromatin-editorial.webp'));
 assert.ok(concepts.includes('https://www.ncbi.nlm.nih.gov/books/NBK26850/'));
});

test('footer avoids sequence status claims and privacy information is scoped to input',()=>{
 const footer=html.slice(html.indexOf('<footer>'));
 assert.ok(!/No sequence is uploaded|Local calculations/.test(footer));
 const input=html.slice(html.indexOf('id="analysis"'),html.indexOf('id="view-compare"'));
 assert.ok(input.includes('Sequence text and FASTA files are processed on this device'));
});

test('theme bootstrap precedes styles and is loaded once before application modules',()=>{
 assert.ok(html.indexOf('src="src/theme.js')<html.indexOf('rel="stylesheet"'));
 assert.equal([...html.matchAll(/src="src\/theme.js/g)].length,1);
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.ok(!app.includes('initializeTheme'));
});
test('the nucleosome hero has exactly one replacement caption and no old visible caption',()=>{
 const hero=notes.slice(notes.indexOf('class="gallery-intro"'),notes.indexOf('class="notes-view-control"'));
 assert.equal([...hero.matchAll(/<figcaption>/g)].length,1);
 assert.ok(hero.includes('<figcaption>Molecular illustration · Not to scale</figcaption>'));
 assert.ok(!/DNA packaging|AI.generated/.test(hero));
 assert.ok(hero.includes('alt="Conceptual illustration of DNA wrapping around nucleosome-like histone assemblies"'));
});

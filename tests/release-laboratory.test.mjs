import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {restrictionMap,RESTRICTION_ENZYMES} from '../src/restriction.js';
import {inspectSubstitution} from '../src/mutation.js';
import {reverseComplement} from '../src/sequence.js';
import {analysisCSV} from '../src/csv-export.js';
import {reportModel,reportHTML} from '../src/print-report.js';
import {EXAMPLES,HBB_COMPARISON} from '../src/examples.js';
const map=(seq,name)=>restrictionMap(seq).find(e=>e.name===name);
test('NEB palindromic enzyme specifications give both aligned cleavage offsets',()=>{
 const expected=[['EcoRI','GAATTC',1,5],['HindIII','AAGCTT',1,5],['BamHI','GGATCC',1,5],['PstI','CTGCAG',5,1],['NotI','GCGGCCGC',2,6]];
 assert.deepEqual(RESTRICTION_ENZYMES.map(e=>[e.name,e.recognition,e.topOffset,e.bottomOffset]),expected);
 for(const [name,site,top,bottom] of expected){assert.equal(reverseComplement(site),site);assert.deepEqual(map(site,name).sites,[{start:1,end:site.length,topCut:top,bottomCut:bottom}]);assert.deepEqual(map(site,name).fragments.map(f=>f.length),[top,site.length-top]);}
});
test('linear multiple cuts partition the full input strand without duplicated reverse sites',()=>{
 const result=map('GAATTCGAATTC','EcoRI');assert.deepEqual(result.sites,[{start:1,end:6,topCut:1,bottomCut:5},{start:7,end:12,topCut:7,bottomCut:11}]);assert.deepEqual(result.fragments,[{start:1,end:1,length:1},{start:2,end:7,length:6},{start:8,end:12,length:5}]);
});
test('zero, incomplete, and ambiguous sites preserve an uncut input strand',()=>{
 for(const seq of ['A','GAATT','GAANTC','N'.repeat(20)]){const result=map(seq,'EcoRI');assert.equal(result.sites.length,0);assert.deepEqual(result.fragments,[{start:1,end:seq.length,length:seq.length}]);}
 assert.throws(()=>restrictionMap(''),/Enter/);assert.throws(()=>restrictionMap('GAAXTC'),/Invalid/);
});
test('asymmetric PstI offsets and flanks use input boundaries, not site starts',()=>{assert.deepEqual(map('AACTGCAGTT','PstI').sites,[{start:3,end:8,topCut:7,bottomCut:3}]);});
test('lambda EcoRI reference restriction pattern has five sites and six fragments',()=>{
 const result=map(EXAMPLES.lambda.sequence,'EcoRI');assert.equal(result.sites.length,5);assert.deepEqual(result.fragments.map(f=>f.length).sort((a,b)=>b-a),[21226,7421,5804,5643,4878,3530]);
});
test('every curated example restriction partition preserves its complete length',()=>{
 for(const key of ['hbb-cds','telomere','gfp','mt-co1','lambda','lac-operon'])for(const result of restrictionMap(EXAMPLES[key].sequence))assert.equal(result.fragments.reduce((sum,f)=>sum+f.length,0),EXAMPLES[key].sequence.length);
});
test('general mutation lab reproduces the matched full HBB variant',()=>{const r=inspectSubstitution(HBB_COMPARISON.reference,20,'T');assert.equal(r.sequence,HBB_COMPARISON.alternate);assert.equal(r.referenceCodon,'GAG');assert.equal(r.alternateCodon,'GTG');assert.equal(r.referenceAA,'E');assert.equal(r.alternateAA,'V');assert.equal(r.consequence,'missense');assert.deepEqual([r.start,r.end],[19,21]);});
test('mutation classification depends on selected genetic code',()=>{assert.equal(inspectSubstitution('TGG',3,'A','+1','1').consequence,'nonsense');assert.equal(inspectSubstitution('TGG',3,'A','+1','2').consequence,'synonymous');assert.equal(inspectSubstitution('AGA',3,'G','+1','2').consequence,'stop-retained');});
test('mutation lab maps reverse-strand and offset-frame codons to input coordinates',()=>{const r=inspectSubstitution('CTC',2,'A','−1','1');assert.equal(r.referenceCodon,'GAG');assert.equal(r.alternateCodon,'GTG');assert.equal(r.consequence,'missense');assert.deepEqual([r.start,r.end],[1,3]);assert.equal(inspectSubstitution('AGAG',3,'T','+2').alternateCodon,'GTG');assert.equal(inspectSubstitution('CTCT',2,'A','−2').alternateCodon,'GTG');});
test('incomplete and unresolved codons remain neutral; invalid sites reject',()=>{assert.equal(inspectSubstitution('ATGA',4,'C').consequence,'outside a complete codon');assert.equal(inspectSubstitution('ANG',1,'T').consequence,'unresolved codon');assert.equal(inspectSubstitution('GAG',1,'G').consequence,'unchanged');assert.throws(()=>inspectSubstitution('ATG',0,'T'),/outside/);assert.throws(()=>inspectSubstitution('ATG',2.5,'T'),/outside/);assert.throws(()=>inspectSubstitution('ATG',2,'N'),/base must/);assert.throws(()=>inspectSubstitution('ANG',2,'T'),/unambiguous/);});
test('CSV and report include restriction settings, both cuts, complete fragments and counts',()=>{
 const options={record:{header:'cuts',sequence:'GAATTCGAATTC'},minimum:3,gcWindow:3};const csv=analysisCSV(options),html=reportHTML(reportModel(options,'fixed'));
 assert.match(csv,/restriction_topology,linear/);assert.match(csv,/restriction_site,cuts,EcoRI,1\/5/);assert.match(csv,/restriction_site,cuts,EcoRI,7\/11/);assert.equal(csv.split('\r\n').filter(line=>line.startsWith('restriction_fragment,cuts,EcoRI,')).length,3);assert.match(html,/Restriction recognition sites/);assert.match(html,/EcoRI · 2 sites/);assert.match(html,/>7<\/td><td>11/);
});
test('primary selector avoids duplicating curated references in secondary dropdown',()=>{const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');const init=app.slice(app.indexOf('function initializeExamples'),app.indexOf('function loadExample'));assert.doesNotMatch(init,/optgroup label="Curated/);assert.match(init,/filter\(key=>!CURATED_KEYS.includes\(key\)\)/);});
test('results progress from overview and strands to coding, patterns and lab',()=>{const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');let prev=-1;for(const id of ['sequence-overview','sequence-panel','coding-analysis','sequence-features','restriction-mapping','integrated-findings']){const index=html.indexOf(`id="${id}"`);assert.ok(index>prev,id);prev=index;}assert.doesNotMatch(html,/<h3>HBB coding example/);assert.match(html,/id="mutation-code"/);});

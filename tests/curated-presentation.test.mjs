import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {EXAMPLES,CURATED_KEYS,HBB_FRAGMENT,HBB_COMPARISON} from '../src/examples.js';
import {normalizeSequence,countComposition,reverseComplement,parseInput} from '../src/sequence.js';
import {translateFrame,findORFs} from '../src/translation.js';
import {findTandemRepeats,findMotif} from '../src/motifs.js';
import {alignGlobal} from '../src/compare.js';
import {analysisCSV} from '../src/csv-export.js';
import {longestCandidate,rankedCandidates,repeatPresentation,pageInterval} from '../src/presentation.js';
import {findingsText} from '../src/findings.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/curated-references.json',import.meta.url),'utf8'));
const digest=s=>createHash('sha256').update(s).digest('hex');

test('six curated inputs match primary-record snapshots, complete lengths and independent counts',()=>{
  assert.deepEqual(CURATED_KEYS,['hbb-cds','telomere','gfp','mt-co1','lambda','lac-operon']);
  for(const key of CURATED_KEYS){
    const e=EXAMPLES[key],expected=fixture[key];
    assert.equal(normalizeSequence(e.sequence),e.sequence);
    assert.equal(e.sequence.length,expected.length,key);assert.equal(digest(e.sequence),expected.sha256,key);
    const counts=countComposition(e.sequence);assert.equal(counts.ambiguous,0);assert.deepEqual(counts.counts,expected.counts,key);
    assert.equal(parseInput(`>${e.name}\n${e.sequence}`)[0].sequence,e.sequence);
    assert.ok(e.introduction&&e.explore&&e.source&&e.coordinates&&e.orientation);
    assert.equal(e.accession,expected.accession);
  }
  assert.equal(EXAMPLES.lambda.sequence.length,48502);
  assert.equal(EXAMPLES['lac-operon'].sequence.length,6351);
});

test('coding examples and selected lambda/lac CDSs translate to independently published protein annotations',()=>{
  // Expected residues are NCBI GBSeq /translation annotations, never computed by SeqScope.
  for(const key of CURATED_KEYS){
    const e=EXAMPLES[key];
    for(const cds of fixture[key].cds){
      const [location,start,end]=cds.location.match(/(\d+)\.\.(\d+)/),a=Number(start),b=Number(end);
      const input=e.sequence.slice(a-1,b),oriented=cds.location.startsWith('complement')?reverseComplement(input):input;
      const raw=translateFrame(oriented,0,e.code);
      assert.equal(raw.at(-1),'*',`${key} ${cds.gene} terminal stop`);
      assert.equal(raw.slice(0,-1).includes('*'),false,`${key} ${cds.gene} internal stop`);
      assert.equal('M'+raw.slice(1,-1),cds.translation,`${key} ${cds.gene} reference peptide`);
      const candidates=findORFs(e.sequence,30,e.code,e.startRule);
      const candidate=candidates.find(o=>o.start===a&&o.end===b&&o.strand===(cds.location.startsWith('complement')?'−':'+'));
      assert.ok(candidate,`${key} ${cds.gene} interval ${location}`);
      assert.equal(candidate.protein,cds.translation+'*');
    }
  }
});

test('GFP is the natural M62653.1 CDS, with its specific reference protein and exact boundaries',()=>{
  const e=EXAMPLES.gfp;
  assert.equal(e.accession,'M62653.1');assert.equal(e.sequence.length,717);
  assert.match(e.coordinates,/26–742/);assert.equal(e.referenceFeatures[0].proteinId,'AAA27721.1');
  assert.equal(e.referenceFeatures[0].residues,238);assert.match(e.introduction,/natural GFP/);
});

test('MT-CO1 selects table 2 and retains the reference AGA termination convention',()=>{
  const e=EXAMPLES['mt-co1'];assert.equal(e.code,'2');assert.equal(e.biologicalSource,'organellar');
  assert.equal(e.sequence.length,1542);assert.match(e.coordinates,/5904–7445/);
  assert.equal(e.sequence.slice(-3),'AGA');
  assert.equal(translateFrame(e.sequence,0,'2'),fixture['mt-co1'].cds[0].translation+'*');
  assert.notEqual(translateFrame(e.sequence,0,'1'),fixture['mt-co1'].cds[0].translation+'*');
});

test('lac interval, reverse orientation and gene coordinates agree with RefSeq annotations',()=>{
  const e=EXAMPLES['lac-operon'];assert.equal(e.orientation,'−');assert.match(e.coordinates,/361200–367550/);
  assert.equal(e.code,'11');assert.equal(e.startRule,'table');assert.equal(e.biologicalSource,'prokaryotic');
  const genomic={lacI:[366428,367510],lacZ:[363231,366305],lacY:[361926,363179],lacA:[361249,361860]};
  for(const feature of fixture['lac-operon'].cds){
    const [,a,b]=feature.location.match(/(\d+)\.\.(\d+)/);
    assert.deepEqual([367551-Number(b),367551-Number(a)],genomic[feature.gene]);
  }
  assert.equal(findMotif(e.sequence,'AATTGTGAGCGGATAACAATT')[0].start,1208);
  assert.match(e.explore,/lacI has its own transcription unit/);
  // The phage uses its bacterial host's code; a virus is not a prokaryotic cell.
  assert.equal(EXAMPLES.lambda.code,'11');assert.equal(EXAMPLES.lambda.biologicalSource,'unspecified');
});

test('HBB comparison pairs complete matched CDSs and exactly one independently documented c.20A>T change',()=>{
  const {reference,alternate}=HBB_COMPARISON;
  assert.equal(reference.length,444);assert.equal(alternate.length,444);
  assert.equal(reference.slice(0,117),HBB_FRAGMENT);
  assert.equal(reference.slice(18,21),'GAG');assert.equal(alternate.slice(18,21),'GTG');
  assert.deepEqual([...reference].flatMap((base,i)=>base===alternate[i]?[]:[i+1]),[20]);
  const result=alignGlobal(reference,alternate);
  assert.equal(result.matches,443);assert.equal(result.mismatches,1);assert.equal(result.gaps,0);
  const refProtein=translateFrame(reference,0),altProtein=translateFrame(alternate,0);
  assert.equal(refProtein[6],'E');assert.equal(altProtein[6],'V');
  assert.equal(refProtein.slice(0,6)+refProtein.slice(7),altProtein.slice(0,6)+altProtein.slice(7));
});

test('longest candidate is selected from actual results, including ties and empty input',()=>{
  assert.equal(longestCandidate([]),null);
  const candidates=[{length:9,start:1},{length:1203,start:18},{length:1203,start:30}];
  assert.equal(longestCandidate(candidates),candidates[1]);
  assert.deepEqual(rankedCandidates(candidates).map(x=>x.index),[1,2,0]);
  assert.deepEqual(candidates.map(x=>x.start),[1,18,30]);
  const e=EXAMPLES['hbb-cds'],actual=findORFs(e.sequence,30,e.code);
  assert.deepEqual([longestCandidate(actual).length,longestCandidate(actual).frame,longestCandidate(actual).start,longestCandidate(actual).end],[444,'+1',1,444]);
});

test('telomere tract is synthetic and maximal repeats precede every nested/overlapping detection',()=>{
  const e=EXAMPLES.telomere,hits=findTandemRepeats(e.sequence,{minUnit:1,maxUnit:6,minCopies:3}),groups=repeatPresentation(hits);
  assert.equal(e.synthetic,true);assert.equal(e.accession,null);assert.equal(e.sequence,'TTAGGG'.repeat(10));
  assert.deepEqual(groups.primary.map(h=>[h.unit,h.copies,h.start,h.end,h.length]),[['TTAGGG',10,1,60,60]]);
  assert.equal(groups.primary.length+groups.secondary.length,hits.length);
  assert.deepEqual(new Set([...groups.primary,...groups.secondary]),new Set(hits));
  assert.ok(groups.secondary.some(h=>h.unit==='G'&&h.copies===3));
  const homopolymer=findTandemRepeats('A'.repeat(12),{minCopies:3});
  assert.equal(repeatPresentation(homopolymer).primary[0].unit,'A');
});

test('bounded sequence pages reconstruct the full lambda input without truncation or coordinate gaps',()=>{
  const sequence=EXAMPLES.lambda.sequence;
  for(const [size,expectedPages] of [[600,81],[120,405]]){
    let restored='',start=1,pages=0;
    while(start<=sequence.length){
      const page=pageInterval(sequence.length,start,size);restored+=sequence.slice(page.start-1,page.end);pages++;
      assert.ok(page.end-page.start+1<=size);
      if(page.end===sequence.length)break;start=page.next;
    }
    assert.equal(restored,sequence);assert.equal(pages,expectedPages);
  }
  assert.equal(pageInterval(48502,48502).end,48502);
  assert.equal(pageInterval(48502,99999).start,48502);
  assert.throws(()=>pageInterval(0),/positive/);
});

test('all example exports retain complete input, selected rules and coding translations',()=>{
  for(const key of CURATED_KEYS){
    const e=EXAMPLES[key],record={header:e.name,sequence:e.sequence};
    const options={record,code:e.code,startRule:e.startRule,source:e.biologicalSource,sequenceType:e.sequenceType,minimum:e.minimum,gcWindow:e.gcWindow,motif:e.motif};
    const csv=analysisCSV(options);
    assert.ok(csv.includes(e.sequence),`${key}: complete DNA`);
    assert.match(csv,new RegExp(`genetic_code_table,${e.code}`));
    assert.ok(csv.includes(translateFrame(e.sequence,0,e.code)),`${key}: complete +1 protein`);
    assert.match(findingsText(options),/Settings:/);
  }
});

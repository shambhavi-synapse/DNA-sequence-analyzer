import test from 'node:test';
import assert from 'node:assert/strict';
import {translateCodon,translateFrame,findORFs,startCodons} from '../src/translation.js';
import {reverseComplement,countComposition,parseInput} from '../src/sequence.js';
import {sequenceProperties} from '../src/properties.js';
import {codonAtPosition} from '../src/inspection.js';
import {codonUsage} from '../src/codon.js';
import {findMotif} from '../src/motifs.js';
import {findingsModel,findingsText,contextNotes} from '../src/findings.js';
import {analysisCSV} from '../src/csv-export.js';
import {reportModel,reportHTML} from '../src/print-report.js';
import {alignmentColumns,alignmentDifferences,alignmentReportCSV} from '../src/alignment-view.js';
import {alignGlobal} from '../src/compare.js';

// Published NCBI AAs and Starts rows, not derived from the implementation.
// https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG5 and #SG11
const codons=[...'TCAG'].flatMap(a=>[...'TCAG'].flatMap(b=>[...'TCAG'].map(c=>a+b+c)));
const published={
  5:['FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSSSSVVVVAAAADDEEGGGG','---M------**--------------------MMMM---------------M------------'],
  11:['FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG','---M------**--*----M------------MMMM---------------M------------']
};
test('all 64 codons and all permitted starts agree with NCBI tables 5 and 11',()=>{
  for(const [code,[aas,starts]] of Object.entries(published)){
    assert.equal(codons.map(c=>translateCodon(c,code)).join(''),aas);
    assert.deepEqual(startCodons(code,'table'),codons.filter((c,i)=>starts[i]==='M'));
    assert.deepEqual(startCodons(code),['ATG']);
  }
  assert.deepEqual(startCodons('1','table'),['TTG','CTG','ATG']);
  assert.deepEqual(startCodons('2','table'),['ATT','ATC','ATA','ATG','GTG']);
});
test('alternative initiation changes only the first residue of candidate peptides',()=>{
  assert.equal(findORFs('GTGGTGTAA',9,'11').length,0);
  const candidates=findORFs('GTGGTGTAA',9,'11','table');
  assert.deepEqual(candidates.map(o=>[o.start,o.end,o.startCodon,o.protein]),[[1,9,'GTG','MV*']]);
  assert.equal(translateFrame('GTGGTGTAA',0,'11'),'VV*');
  assert.equal(codonUsage('GTGGTGTAA','+1','11').rows.find(r=>r.codon==='GTG').aminoAcid,'V');
  assert.equal(findORFs('ATTATATAA',9,'2','table')[0].protein,'MM*');
  const reverse=findORFs('TTACACCAC',9,'11','table');
  assert.deepEqual(reverse.map(o=>[o.strand,o.frame,o.start,o.end,o.protein]),[['−','−1',1,9,'MV*']]);
});
test('definite ambiguous stops terminate ORFs and uncertain internal codons remain flagged',()=>{
  assert.deepEqual(findORFs('ATGAAATARCCC',3).map(o=>[o.end,o.stopCodon,o.protein]),[[9,'TAR','MK*']]);
  assert.deepEqual(findORFs('TTAYTTCAT',9).map(o=>[o.strand,o.start,o.end,o.protein]),[['−',1,9,'MK*']]);
  assert.equal(findORFs('ATGTRATAA',3,'1')[0].end,6); // TRA expands to TAA/TGA: both stop.
  const uncertain=findORFs('ATGTRATAA',9,'2')[0]; // table 2: stop or Trp.
  assert.equal(uncertain.protein,'MX*');assert.equal(uncertain.unresolvedCodons,1);
  assert.match(contextNotes().join(' '),/X codons may conceal an earlier stop/);
});
test('source contexts distinguish bacteria from archaea and do not guess a code',()=>{
  assert.match(contextNotes({source:'prokaryotic'}).join(' '),/Bacteria.*fMet.*archaea.*unmodified Met/);
  assert.match(contextNotes({source:'eukaryotic',sequenceType:'genomic'}).join(' '),/does not splice exons/);
  assert.match(contextNotes({source:'organellar'}).join(' '),/source alone does not select a code/);
  const record={header:'Fragment',sequence:'ATGATATGATAA'};
  for(const source of ['unspecified','prokaryotic','eukaryotic','organellar']){
    const model=findingsModel({record,source,minimum:3});
    assert.equal(model.settings.code,'1');assert.deepEqual(model.composition,countComposition(record.sequence));
    assert.equal(model.candidates[0].protein,'MI*');
  }
});
test('skew, CpG and all pair counts use hand-counted overlapping linear pairs',()=>{
  const p=sequenceProperties('CCGCGATT');
  assert.equal(p.gcSkew,-1/5);assert.equal(p.atSkew,-1/3);
  assert.deepEqual(p.dinucleotides,{AA:0,AC:0,AG:0,AT:1,CA:0,CC:1,CG:2,CT:0,GA:1,GC:1,GG:0,GT:0,TA:0,TC:0,TG:0,TT:1});
  assert.equal(p.validPairs,7);assert.equal(p.cpgObservedExpected,8/3);assert.equal(p.cpgPercent,200/7);
  const reverse=sequenceProperties(reverseComplement('CCGCGATT'));
  assert.equal(reverse.gcSkew,-p.gcSkew);assert.equal(reverse.atSkew,-p.atSkew);assert.equal(reverse.cpgCount,2);
});
test('ambiguity never bridges pairs or creates an exact CpG O/E value',()=>{
  const p=sequenceProperties('CGNCG');assert.equal(p.cpgCount,2);assert.equal(p.validPairs,2);assert.equal(p.excludedPairs,2);assert.equal(p.cpgObservedExpected,null);
  for(const sequence of ['A','N','NNNN']){
    const p=sequenceProperties(sequence);assert.equal(p.validPairs,0);assert.equal(p.cpgPercent,null);assert.equal(p.cpgObservedExpected,null);assert.equal(p.gcSkew,null);
  }
  assert.equal(sequenceProperties('AAAA').atSkew,1);assert.equal(sequenceProperties('GGGG').gcSkew,1);
});
test('IUPAC motif mode reports guaranteed matches, overlaps and reverse input coordinates',()=>{
  assert.equal(findMotif('AAGAGG','ARG').length,0);
  assert.deepEqual(findMotif('AAGAGG','ARG',false,'iupac').map(h=>[h.start,h.end]),[[1,3],[4,6]]);
  assert.equal(findMotif('ANG','ARG',false,'iupac').length,0); // N could be C/T: not definite.
  assert.equal(findMotif('ARG','ARG',false,'iupac').length,1);
  assert.deepEqual(findMotif('AAGCTT','AAR',true,'iupac').map(h=>[h.start,h.end,h.strand]),[[1,3,'+'],[4,6,'−']]);
  assert.equal(findMotif('AAAA','NN',true,'iupac').length,3); // Palindromic pattern deduplicated.
  assert.throws(()=>findMotif('AAA','A',false,'possible'),/Select/);
});
test('alignment events group contiguous insertions/deletions with correct anchors',()=>{
  const events=alignmentDifferences(alignmentColumns('--ACGTT','TTAC--T'));
  assert.deepEqual(events.map(e=>[e.type,e.startA,e.endA,e.startB,e.endB,e.afterA,e.reference,e.alternate]),[
    ['insertion',null,null,1,2,0,'','TT'],['deletion',3,4,null,null,2,'GT','']
  ]);
  assert.equal(alignmentDifferences(alignmentColumns('AN','AT'))[0].type,'ambiguity');
  assert.equal(alignmentDifferences(alignmentColumns('AC','AG'))[0].type,'substitution');
  assert.equal(alignmentDifferences(alignmentColumns('AN','AN')).length,0);
});
test('alignment export includes actual scoring, identity denominator, gaps and event coordinates',()=>{
  const result=alignGlobal('ACT','ACGT',{match:3,mismatch:-2,gap:-4}),csv=alignmentReportCSV(result);
  assert.match(csv,/difference_relative_to_A/);assert.match(csv,/insertion,3,3,2,2,3,-2,-4,75,4/);
  assert.equal(csv.split('\n').length,5);
});
test('findings, CSV and print preserve selected rules and independently known translation',()=>{
  const options={record:{header:'Alternative start',sequence:'GTGGTGAGG'},code:'5',source:'organellar',sequenceType:'coding',startRule:'table',minimum:6,codonFrame:'+1',gcWindow:3,motif:'GTN',motifMode:'iupac',motifReverse:true};
  const text=findingsText(options),csv=analysisCSV(options),report=reportModel(options,'2026-11-22T00:00:00Z'),html=reportHTML(report);
  assert.match(text,/genetic code table 5/);assert.match(text,/2 motif hits/);assert.match(text,/no complete candidate/i);
  assert.equal(report.frames[0].protein,'VVS');
  for(const output of [csv,html]){
    assert.match(output,/GTGGTGAGG/);assert.match(output,/organellar/);assert.match(output,/coding/);assert.match(output,/VVS/);
    assert.match(output,/Tm deferred|Melting-temperature/);
  }
  assert.match(csv,/analysis_version/);assert.match(csv,/orf_start_rule,table/);assert.match(csv,/definite_iupac_match/);assert.match(csv,/dinucleotide/);
  const withStop={...options,record:{header:'Candidate',sequence:'GTGGTGTAA'},code:'11'};
  assert.equal(reportModel(withStop).orfs[0].protein,'MV*');
  assert.match(analysisCSV(withStop),/candidate,MV\*/);
  assert.match(reportHTML(reportModel(withStop)),/GTG starts|GTG/);
});
test('findings are deterministic and retain honest null denominators for ambiguous input',()=>{
  const options={record:{header:'N-only',sequence:'NNNN'},gcWindow:4};
  assert.equal(findingsText(options),findingsText(options));
  assert.match(findingsText(options),/GC undefined/);assert.match(findingsText(options),/not confirmed genes/);
  assert.match(analysisCSV(options),/cpgObservedExpected,,/);
  assert.throws(()=>analysisCSV({...options,gcWindow:1.5}),/integer/);
});
test('short, coding, noncoding, organellar and long mixed inputs preserve independent totals',()=>{
  for(const raw of ['A','AT','>coding\nATGAAATAA','>noncoding\nCCCCCC','>organelle\nATATGATAA','>ambiguous\nACGTNRY']){
    const record=parseInput(raw)[0],model=findingsModel({record,minimum:3,gcWindow:Math.min(3,record.sequence.length)});
    assert.equal(model.composition.length,record.sequence.length);
  }
  const sequence='ACGTNRY'.repeat(10000),p=sequenceProperties(sequence);
  assert.equal(p.length,70000);assert.equal(p.validPairs,30000);assert.equal(p.excludedPairs,39999);
  assert.equal(p.dinucleotides.AC,10000);assert.equal(p.dinucleotides.CG,10000);assert.equal(p.dinucleotides.GT,10000);
  assert.equal(p.cpgObservedExpected,null);assert.equal(p.gcSkew,0);assert.equal(p.atSkew,0);
});
test('unconditioned temperature is never emitted as an experimental result',()=>{
  for(const sequence of ['ATGC','ACGTACGTACGTAC','N','A'.repeat(1000)])assert.equal(sequenceProperties(sequence).wallaceTmC,null);
});
test('invalid initiation settings are rejected rather than silently substituted',()=>{
  assert.throws(()=>startCodons('99'),/supported/);assert.throws(()=>startCodons('11','guess'),/Select/);
  assert.throws(()=>findORFs('ATGTAA',1.5),/integer/);
});

test('nucleotide inspection follows selected offsets and reverse-strand input coordinates',()=>{
  const sequence='AATGGCTTAA';
  assert.deepEqual(codonAtPosition(sequence,2,'+2'),{frame:'+2',position:2,codon:'ATG',start:2,end:4,aminoAcid:'M'});
  assert.equal(codonAtPosition(sequence,1,'+2').codon,null);
  assert.deepEqual(codonAtPosition(sequence,9,'−1'),{frame:'−1',position:9,codon:'TTA',start:8,end:10,aminoAcid:'L'});
  assert.deepEqual(codonAtPosition(sequence,9,'−2'),{frame:'−2',position:9,codon:'TAA',start:7,end:9,aminoAcid:'*'});
  assert.equal(codonAtPosition(sequence,1,'−3').codon,null);
  assert.throws(()=>codonAtPosition(sequence,0),/within/);
  assert.throws(()=>codonAtPosition(sequence,2,'+4'),/six/);
});

import {countComposition} from './sequence.js';
import {CODE_INFO,startCodons,GENETIC_CODES,findORFs} from './translation.js';
import {sequenceProperties} from './properties.js';
import {codonUsage} from './codon.js';
import {findMotif,findPalindromes,findTandemRepeats} from './motifs.js';

export const ANALYSIS_VERSION='2026-11-22.2';
export function contextNotes({source='unspecified',sequenceType='unknown',code='1',startRule='atg'}={}){
  const starts=startCodons(code,startRule);
  const notes=[`Table ${code}: ${CODE_INFO[code].name}. Candidate starts: ${starts.join(', ')}. The initiation rule determines which start-to-stop intervals are reported.`];
  if(startRule==='table')notes.push('Table-defined initiation codons represent documented starts across taxa; use at a particular site depends on organism and sequence context.');
  if(sequenceType==='genomic')notes.push('Genomic DNA may contain introns, particularly in eukaryotes. This search does not splice exons; a genomic ORF need not be a complete coding sequence.');
  if(sequenceType==='coding')notes.push('Coding sequence is a user-supplied designation. Select the correct strand/frame; splice junctions, completeness and coding status are not verified.');
  if(source==='prokaryotic')notes.push('Bacteria commonly initiate with formylmethionine (fMet); archaea generally use unmodified Met. M is retained in the peptide notation. Internal AUG still encodes Met.');
  else if(source==='eukaryotic')notes.push('Eukaryotic cytoplasmic initiation normally uses Met. Organellar codes and initiation chemistry can differ.');
  else if(source==='organellar')notes.push('Mitochondria and plastids differ in genetic code and initiation chemistry. Many use fMet at initiation; organellar source alone does not select a code.');
  else notes.push('Source is unspecified. Initiation chemistry cannot be determined from sequence alone; M denotes methionine without assigning formylation.');
  if(code==='2')notes.push('Table 2 uses AGA/AGG as stops in this rule-based translation. Some vertebrate mitochondrial termination involves frameshifts or completion of stops by polyadenylation; these are not modeled.');
  notes.push('ORFs are candidates, not confirmed genes. Unresolved internal X codons may conceal an earlier stop. Translation does not establish expression, function or organism identity.');
  return notes;
}
export function findingsModel({record,code='1',source='unspecified',sequenceType='unknown',startRule='atg',minimum=30,codonFrame='+1',gcWindow=30,motif='',motifReverse=false,motifMode='literal',orfs,features}={}){
  const sequence=record.sequence,c=countComposition(sequence),p=sequenceProperties(sequence);
  const candidates=orfs??findORFs(sequence,minimum,code,startRule);
  const usage=codonUsage(sequence,codonFrame,code);
  const hits=motif.trim()?findMotif(sequence,motif,motifReverse,motifMode):[];
  return {version:ANALYSIS_VERSION,composition:c,properties:p,usage,candidates,motifHits:hits,
    settings:{code,source,sequenceType,startRule,minimum,codonFrame,gcWindow,motif,motifReverse,motifMode},
    palindromeCount:(features?.palindromes??findPalindromes(sequence)).length,repeatCount:(features?.repeats??findTandemRepeats(sequence,{minUnit:1,maxUnit:6,minCopies:3})).length,
    notes:contextNotes({source,sequenceType,code,startRule})};
}
const number=(n,digits=3)=>n===null?'undefined':n.toFixed(digits);
export function findingsText(options){
  const model=findingsModel(options),{composition:c,properties:p,settings:s}=model;
  const stops=Object.keys(GENETIC_CODES[s.code]).filter(c=>GENETIC_CODES[s.code][c]==='*');
  const longest=model.candidates.reduce((best,o)=>!best||o.length>best.length?o:best,null);
  return [
    `SeqScope analysis ${model.version} | ${options.record.header}`,
    `Length: ${c.length} nt; A ${c.counts.A}, C ${c.counts.C}, G ${c.counts.G}, T ${c.counts.T}; ambiguous ${c.ambiguous}.`,
    `GC ${number(c.gc,2)}%; AT ${number(c.at,2)}%. Percentage denominator: ${c.known} unambiguous bases.`,
    `GC skew ${number(p.gcSkew)}; AT skew ${number(p.atSkew)} on the input strand. CpG ${p.cpgCount}; O/E ${number(p.cpgObservedExpected)}. Skew measures strand composition imbalance; CpG O/E compares the observed pattern with base-frequency expectation.`,
    `Patterns: ${model.motifHits.length} motif hits (${s.motif||'no pattern'}; ${s.motifMode}; ${s.motifReverse?'both strands':'forward only'}); ${model.palindromeCount} reverse-complement palindrome intervals; ${model.repeatCount} tandem repeat intervals. Intervals retain their input positions and may overlap.`,
    `Candidate ORFs: ${model.candidates.length}; minimum ${s.minimum} nt including stop; ${model.candidates.filter(o=>o.unresolvedCodons).length} with unresolved internal codons; starts ${startCodons(s.code,s.startRule).join('/')}; stops ${stops.join('/')}. ${longest?`Longest: ${longest.frame}, ${longest.start}–${longest.end}, ${longest.length} nt.`:'No complete candidate meets the selected start, stop and minimum-length criteria.'}`,
    `Codon usage: frame ${s.codonFrame}, ${model.usage.total} unambiguous codons (including stops); ${model.usage.ambiguous} excluded. Frequencies characterize codon composition across the selected frame.`,
    `Settings: source ${s.source}; sequence type ${s.sequenceType}; genetic code table ${s.code}; initiation ${s.startRule}; GC window ${s.gcWindow} nt. Coordinates: 1-based inclusive on input; reverse frames read the reverse complement.`,
    ...model.notes,
    'Tm deferred: a supported thermodynamic model with salt and strand concentration is required. CSV includes the full input and analysis settings for reproduction.'
  ].join('\n');
}

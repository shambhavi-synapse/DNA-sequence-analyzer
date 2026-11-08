import {countComposition,complement,reverseComplement,transcribeCodingStrand,transcribeTemplateStrand,slidingGC} from './sequence.js';
import {sixFrames,findORFs} from './translation.js';
import {codonUsage} from './codon.js';
import {findMotif,findPalindromes,findTandemRepeats} from './motifs.js';

export const ANALYSIS_COLUMNS=Object.freeze(['dataset','record','field','value','unit','start_1based','end_1based','strand','frame','codon','amino_acid','count','frequency_percent','length_nt','notes']);

/** Prevent spreadsheet formula execution while retaining the literal user value. */
export function spreadsheetSafe(value){
 const text=String(value??'');
 return /^[\s]*[=+\-@]/.test(text)?`'${text}`:text;
}
export function csvCell(value,{userSupplied=true}={}){
 const text=userSupplied?spreadsheetSafe(value):String(value??'');
 return /[",\r\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text;
}
const row=(dataset,record,field,value='',extra={})=>ANALYSIS_COLUMNS.map(column=>({dataset,record:spreadsheetSafe(record),field,value:field==='sequence_label'?spreadsheetSafe(value):value,...extra})[column]??'');

/** A stable long-form CSV. Dataset names separate unlike result types without truncating values. */
export function analysisCSV({record,code='1',minimum=30,codonFrame='+1',gcWindow=30,motif='',motifReverse=false,orfs=null}){
 const sequence=record.sequence,label=record.header||'Sequence 1';
 const composition=countComposition(sequence),frames=sixFrames(sequence,code);
 const candidates=orfs??findORFs(sequence,minimum,code),usage=codonUsage(sequence,codonFrame,code);
 const windowSize=sequence.length?Math.min(Math.max(1,Number(gcWindow)||1),sequence.length):1;
 const rows=[ANALYSIS_COLUMNS],add=(...args)=>rows.push(row(...args));
 add('metadata',label,'sequence_label',label);
 add('metadata',label,'input_sequence',sequence,{unit:'nt'});
 add('settings',label,'genetic_code_table',String(code),{notes:code==='2'?'vertebrate mitochondrial':'standard'});
 add('settings',label,'minimum_orf_length',minimum,{unit:'nt',notes:'Length includes terminal stop codon'});
 add('settings',label,'codon_usage_frame',codonFrame);
 add('settings',label,'gc_window_size',windowSize,{unit:'nt'});
 add('composition',label,'sequence_length',composition.length,{unit:'nt'});
 for(const base of ['A','C','G','T']){
  add('composition',label,`count_${base}`,composition.counts[base],{unit:'nt'});
  add('composition',label,`percent_${base}`,composition.percentages[base]??'',{unit:'%'});
 }
 add('composition',label,'ambiguous_count',composition.ambiguous,{unit:'nt'});
 const ambiguousCounts=Object.fromEntries([...'RYSWKMBDHVN'].map(symbol=>[symbol,0]));
 for(const base of sequence)if(Object.hasOwn(ambiguousCounts,base))ambiguousCounts[base]++;
 for(const [symbol,count] of Object.entries(ambiguousCounts))add('composition',label,`count_${symbol}`,count,{unit:'nt',notes:'Ambiguous IUPAC symbol'});
 add('settings',label,'percentage_denominator',composition.known,{unit:'nt',notes:'Unambiguous A/C/G/T only; undefined percentages are empty'});
 add('settings',label,'motif_pattern',String(motif).replace(/\s/g,'').toUpperCase(),{notes:'Literal IUPAC symbol matching; overlapping hits retained'});
 add('settings',label,'motif_both_strands',motifReverse);
 add('composition',label,'gc_content',composition.gc??'',{unit:'%'});
 add('composition',label,'at_content',composition.at??'',{unit:'%'});
 add('transformation',label,'complement_3_to_5',complement(sequence),{unit:'nt'});
 add('transformation',label,'reverse_complement_5_to_3',reverseComplement(sequence),{unit:'nt'});
 add('transformation',label,'coding_dna_to_rna_5_to_3',transcribeCodingStrand(sequence),{unit:'nt'});
 add('transformation',label,'template_dna_to_rna_5_to_3',transcribeTemplateStrand(sequence),{unit:'nt'});
 for(const frame of frames)add('translation',label,'protein',frame.protein,{strand:frame.strand,frame:frame.label,notes:`Offset ${frame.offset} nt; incomplete terminal codons omitted`});
 add('summary',label,'orf_candidate_count',candidates.length);
 for(const candidate of candidates)add('orf',label,'candidate',candidate.protein,{start_1based:candidate.start,end_1based:candidate.end,strand:candidate.strand,frame:candidate.frame,length_nt:candidate.length,notes:`${candidate.startCodon} to ${candidate.stopCodon}; length includes terminal stop`});
 for(const entry of usage.rows)add('codon_usage',label,'codon',entry.codon,{strand:usage.strand,frame:usage.frame,codon:entry.codon,amino_acid:entry.aminoAcid,count:entry.count,frequency_percent:entry.frequency*100,notes:`Genetic code table ${usage.codeId}`});
 for(const point of slidingGC(sequence,windowSize))add('gc_profile',label,'window_gc',point.gc??'',{unit:'%',start_1based:point.start,end_1based:point.end,notes:point.gc===null?'No unambiguous bases in window':''});
 if(String(motif).trim())for(const hit of findMotif(sequence,motif,motifReverse))add('motif',label,'exact_symbol_match',hit.motif,{start_1based:hit.start,end_1based:hit.end,strand:hit.strand});
 for(const hit of findPalindromes(sequence))add('palindrome',label,'reverse_complement_palindrome',hit.motif,{start_1based:hit.start,end_1based:hit.end,length_nt:hit.length});
 for(const hit of findTandemRepeats(sequence,{minUnit:1,maxUnit:6,minCopies:3}))add('tandem_repeat',label,'exact_adjacent_repeat',hit.unit,{start_1based:hit.start,end_1based:hit.end,count:hit.copies,length_nt:hit.length,notes:`Unit length ${hit.unit.length} nt; count is adjacent copies`});
 return '\ufeff'+rows.map(values=>values.map(value=>csvCell(value,{userSupplied:false})).join(',')).join('\r\n')+'\r\n';
}

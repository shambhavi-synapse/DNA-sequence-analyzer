import {translateCodon} from './translation.js';
import {codonAtPosition} from './inspection.js';
export function substituteBase(sequence,position,alternate){if(!Number.isInteger(position)||position<1||position>sequence.length)throw new Error('Substitution position is outside the sequence.');if(!/^[ACGT]$/.test(alternate))throw new Error('Substitution base must be A, C, G or T.');const reference=sequence[position-1];if(!'ACGT'.includes(reference))throw new Error('Substitution site must contain an unambiguous reference base.');const changed=sequence.slice(0,position-1)+alternate+sequence.slice(position);return {sequence:changed,position,reference,alternate,changed:reference!==alternate};}
export function classifyCodonSubstitution(referenceCodon,alternateCodon,code='1'){if(!/^[ACGT]{3}$/.test(referenceCodon)||!/^[ACGT]{3}$/.test(alternateCodon))throw new Error('Codon comparison requires unambiguous DNA triplets.');const referenceAA=translateCodon(referenceCodon,code),alternateAA=translateCodon(alternateCodon,code);const consequence=referenceCodon===alternateCodon?'unchanged':referenceAA==='*'&&alternateAA==='*'?'stop-retained':referenceAA==='*'?'stop-loss':alternateAA==='*'?'nonsense':referenceAA===alternateAA?'synonymous':'missense';return {referenceCodon,alternateCodon,referenceAA,alternateAA,consequence};}
export function translateCodonContext(sequence,position,size=6){if(!Number.isInteger(position)||position<1||position>sequence.length)throw new Error('Context position is outside the sequence.');if(!Number.isInteger(size)||size<1)throw new Error('Context size must be a positive integer.');const totalCodons=Math.floor(sequence.length/3),target=Math.floor((position-1)/3),start=Math.max(0,target-Math.floor(size/2));return Array.from({length:Math.min(size,totalCodons-start)},(_,i)=>translateCodon(sequence.slice((start+i)*3,(start+i)*3+3))).join('');}

/** Substitutions use input coordinates even when codons read on the reverse strand. */
export function inspectSubstitution(sequence,position,alternate,frame='+1',code='1'){
 const mutation=substituteBase(sequence,position,alternate);
 const reference=codonAtPosition(sequence,position,frame,code),altered=codonAtPosition(mutation.sequence,position,frame,code);
 const resolved=reference.codon&&/^[ACGT]{3}$/.test(reference.codon)&&/^[ACGT]{3}$/.test(altered.codon);
 const comparison=resolved?classifyCodonSubstitution(reference.codon,altered.codon,code):null;
 return {...mutation,frame,code:String(code),start:reference.start,end:reference.end,referenceCodon:reference.codon,alternateCodon:altered.codon,referenceAA:reference.aminoAcid,alternateAA:altered.aminoAcid,consequence:comparison?.consequence??(reference.codon?'unresolved codon':'outside a complete codon')};
}

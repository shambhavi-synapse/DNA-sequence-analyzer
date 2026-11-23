/** Map a normalized chart horizontal position to the nearest valid window start. */
export function windowAtFraction(fraction,length,windowSize){
  if(!Number.isFinite(fraction)||!Number.isInteger(length)||!Number.isInteger(windowSize)||windowSize<1||length<windowSize) return null;
  return Math.max(1,Math.min(length-windowSize+1,Math.round(Math.max(0,Math.min(1,fraction))*(length-1))+1));
}

import {reverseComplement} from './sequence.js';
import {translateCodon} from './translation.js';
/** Inspect a triplet in any selected frame; intervals stay on the original input. */
export function codonAtPosition(sequence,position,frame='+1',code='1'){
  if(!Number.isInteger(position)||position<1||position>sequence.length)throw new Error('Position must be within the input sequence.');
  if(!/^[+−][123]$/.test(frame))throw new Error('Select one of the six reading frames.');
  const reverse=frame.startsWith('−'),offset=Number(frame.slice(1))-1,index=reverse?sequence.length-position:position-1;
  const from=offset+Math.floor((index-offset)/3)*3;
  if(from<offset||from+3>sequence.length)return {frame,position,codon:null,start:null,end:null,aminoAcid:null};
  const start=reverse?sequence.length-from-2:from+1,end=reverse?sequence.length-from:from+3;
  const input=sequence.slice(start-1,end),codon=reverse?reverseComplement(input):input;
  return {frame,position,codon,start,end,aminoAcid:translateCodon(codon,code)};
}

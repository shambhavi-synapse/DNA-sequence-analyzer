import {normalizeSequence} from './sequence.js';

// NEB recognition-specificity chart, verified 2026-11-23. Offsets count from
// the left edge on input 5′→3′ and aligned complementary 3′→5′ strands.
export const RESTRICTION_SOURCE='https://www.neb.com/tools-and-resources/selection-charts/alphabetized-list-of-recognition-specificities';
export const RESTRICTION_ENZYMES=Object.freeze([
 {name:'EcoRI',recognition:'GAATTC',topOffset:1,bottomOffset:5},
 {name:'HindIII',recognition:'AAGCTT',topOffset:1,bottomOffset:5},
 {name:'BamHI',recognition:'GGATCC',topOffset:1,bottomOffset:5},
 {name:'PstI',recognition:'CTGCAG',topOffset:5,bottomOffset:1},
 {name:'NotI',recognition:'GCGGCCGC',topOffset:2,bottomOffset:6}
].map(Object.freeze));
export const RESTRICTION_METHOD='Linear double-stranded DNA; exact unambiguous sites only. All five recognition sequences are reverse-complement palindromes, so both strands are covered and each interval is counted once. Cut boundaries count input bases to the left (0 to sequence length), on the input strand and its aligned complement. Fragment lengths partition the input strand at its cuts; staggered complementary ends differ. Separate single-enzyme maps, assuming complete cleavage. Methylation, end-flanking requirements, star activity and digestion efficiency are not modeled. Ambiguous input can conceal additional sites.';
export function restrictionMap(input){
 const sequence=normalizeSequence(input),length=sequence.length;
 return RESTRICTION_ENZYMES.map(enzyme=>{
  const sites=[];
  for(let i=sequence.indexOf(enzyme.recognition);i!==-1;i=sequence.indexOf(enzyme.recognition,i+1))sites.push({start:i+1,end:i+enzyme.recognition.length,topCut:i+enzyme.topOffset,bottomCut:i+enzyme.bottomOffset});
  const cuts=[0,...sites.map(site=>site.topCut),length];
  const fragments=cuts.slice(1).map((end,i)=>({start:cuts[i]+1,end,length:end-cuts[i]}));
  return {...enzyme,sites,fragments};
 });
}

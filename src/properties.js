import {countComposition} from './sequence.js';

/** Exact oriented-strand composition. No assay-dependent Tm is inferred. */
export function sequenceProperties(sequence){
  const c=countComposition(sequence),{A,C,G,T}=c.counts;
  const dinucleotides=Object.fromEntries([...'ACGT'].flatMap(a=>[...'ACGT'].map(b=>[a+b,0])));
  let validPairs=0;
  for(let i=0;i+1<sequence.length;i++){
    const pair=sequence.slice(i,i+2);
    if(Object.hasOwn(dinucleotides,pair)){dinucleotides[pair]++;validPairs++;}
  }
  return {length:c.length,gc:c.gc,gcSkew:G+C?(G-C)/(G+C):null,atSkew:A+T?(A-T)/(A+T):null,
    dinucleotides,validPairs,excludedPairs:Math.max(0,sequence.length-1)-validPairs,
    cpgCount:dinucleotides.CG,cpgPercent:validPairs?100*dinucleotides.CG/validPairs:null,
    // Conventional CpG O/E = count(CG) * length / (count(C) * count(G)).
    // With ambiguity there is no exact whole-sequence denominator for this model.
    cpgObservedExpected:!c.ambiguous&&C&&G?dinucleotides.CG*sequence.length/(C*G):null,
    wallaceTmC:null,wallaceApplicable:false};
}

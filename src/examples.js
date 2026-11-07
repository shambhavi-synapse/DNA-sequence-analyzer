export const HBB_FRAGMENT='ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACC';
export const EXAMPLES=Object.freeze({
  synthetic:Object.freeze({name:'Synthetic teaching sequence',sequence:'ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG',source:'Constructed teaching sequence; not a biological record.'}),
  hbb:Object.freeze({name:'Homo sapiens HBB coding fragment, NM_000518.5 coding nt 1-117',sequence:HBB_FRAGMENT,source:'NCBI RefSeq NM_000518.5, Homo sapiens HBB mRNA, transcript positions 51-167 (coding positions 1-117), positive transcript orientation, frame +1. Spliced fragment, not a complete CDS.'}),
  'hbb-mut':Object.freeze({name:'HBB fragment with c.20A>T teaching variant',sequence:HBB_FRAGMENT.slice(0,19)+'T'+HBB_FRAGMENT.slice(20),source:'HBB coding fragment with one introduced teaching substitution at coding position 20.'})
  ,telomere:Object.freeze({name:'Synthetic human telomere repeat tract',sequence:'TTAGGG'.repeat(10),source:'Synthetic 60-nt demonstration based on the canonical human telomeric repeat. Not a genomic reference record.'}),
  'mt-code':Object.freeze({name:'Synthetic vertebrate mitochondrial code demonstration',sequence:'ATGATATGATAA',source:'Synthetic 12-nt teaching sequence. It is not a mitochondrial reference record; it demonstrates table 1 versus table 2 codon assignments.'})
});

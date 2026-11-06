export const HBB_FRAGMENT='ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACC';
export const EXAMPLES=Object.freeze({
  synthetic:Object.freeze({name:'Synthetic teaching sequence',sequence:'ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG',source:'Constructed teaching sequence; not a biological record.'}),
  hbb:Object.freeze({name:'Homo sapiens HBB coding fragment, NM_000518.5 nt 1-117',sequence:HBB_FRAGMENT,source:'NCBI RefSeq NM_000518.5, Homo sapiens HBB mRNA, coding fragment positions 1-117.'}),
  'hbb-mut':Object.freeze({name:'HBB fragment with c.20A>T teaching variant',sequence:HBB_FRAGMENT.slice(0,19)+'T'+HBB_FRAGMENT.slice(20),source:'HBB coding fragment with one introduced teaching substitution at coding position 20.'})
});

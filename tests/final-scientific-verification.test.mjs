import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSequence,parseInput,parseFasta,countComposition,reverseComplement,slidingGC,transcribeTemplateStrand} from '../src/sequence.js';
import {translateCodon,sixFrames,findORFs} from '../src/translation.js';
import {alignGlobal} from '../src/compare.js';
// Independent published expected residues, NCBI / INSDC tables 1 and 2.
// https://www.insdc.org/submitting-standards/genetic-code-tables/
const expected={1:'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG',2:'FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSS**VVVVAAAADDEEGGGG'};
const codons=[...'TCAG'].flatMap(a=>[...'TCAG'].flatMap(b=>[...'TCAG'].map(c=>a+b+c)));
const referenceCode=code=>Object.fromEntries(codons.map((c,i)=>[c,expected[code][i]]));
test('every canonical codon agrees with independently published code tables 1 and 2',()=>{
 for(const code of [1,2])codons.forEach((codon,i)=>assert.equal(translateCodon(codon,String(code)),expected[code][i],`table ${code} ${codon}`));
});
test('a hand-worked nine-base example has the expected six translations and template RNA',()=>{
 assert.deepEqual(sixFrames('ATGAAATAG').map(f=>f.protein),['MK*','*N','EI','LFH','YF','IS']);
 assert.equal(transcribeTemplateStrand('ATGAAATAG'),'CUAUUUCAU');
 for(const sequence of ['A','AT'])assert.ok(sixFrames(sequence).every(f=>f.protein===''));
 assert.deepEqual(sixFrames('ATGAAAAT').map(f=>f.protein),['MK','*K','EN','IF','FS','FH']);
});
function allAlignmentsScore(a,b,i=0,j=0){
 if(i===a.length)return -2*(b.length-j);
 if(j===b.length)return -2*(a.length-i);
 return Math.max((a[i]===b[j]?2:-1)+allAlignmentsScore(a,b,i+1,j+1),-2+allAlignmentsScore(a,b,i+1,j),-2+allAlignmentsScore(a,b,i,j+1));
}
test('global alignment scores match exhaustive enumeration for every short A/C input pair',()=>{
 const strings=[];for(let n=1;n<=3;n++)for(let bits=0;bits<2**n;bits++)strings.push(bits.toString(2).padStart(n,'0').replaceAll('0','A').replaceAll('1','C'));
 for(const a of strings)for(const b of strings){
  const result=alignGlobal(a,b);assert.equal(result.score,allAlignmentsScore(a,b),`${a} / ${b}`);
  assert.equal(result.alignedA.replaceAll('-',''),a);assert.equal(result.alignedB.replaceAll('-',''),b);
  let score=0;for(let i=0;i<result.columns;i++)score+=result.alignedA[i]==='-'||result.alignedB[i]==='-'?-2:result.alignedA[i]===result.alignedB[i]?2:-1;
  assert.equal(score,result.score);assert.equal(result.matches+result.mismatches+result.gaps,result.columns);
 }
});
function enumerateORFs(sequence,minimum,code){
 const table=referenceCode(code),hits=[];
 for(const strand of ['+','−']){
  const oriented=strand==='+'?sequence:reverseComplement(sequence);
  for(let start=0;start+3<=oriented.length;start++){
   if(oriented.slice(start,start+3)!=='ATG')continue;
   let protein='M';
   for(let stop=start+3;stop+3<=oriented.length;stop+=3){
    const codon=oriented.slice(stop,stop+3);protein+=table[codon]??'X';
    if(table[codon]==='*'){
     if(stop+3-start>=minimum)hits.push({strand,frame:strand+(start%3+1),start:strand==='+'?start+1:sequence.length-stop-2,end:strand==='+'?stop+3:sequence.length-start,length:stop+3-start,protein});
     break;
    }
   }
  }
 }
 return hits.sort((a,b)=>a.start-b.start||a.end-b.end||a.strand.localeCompare(b.strand));
}
test('ORF coordinates, nesting, stops and thresholds agree with independent interval enumeration',()=>{
 const sequences=['ATGATGATGTAA','TTATTTCAT','CCATGAAATGATAG','ATGAAANNNTAA','ATGAAA','ATGTGAATGAGATAG'];
 let seed=19;
 for(let n=0;n<80;n++){let sequence='';for(let j=0;j<90;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;sequence+='ACGT'[seed>>>30];}sequences.push('ATG'+sequence+'TAA');}
 for(const code of [1,2])for(const minimum of [3,6,9,30])for(const sequence of sequences){
  const actual=findORFs(sequence,minimum,String(code)).map(({strand,frame,start,end,length,protein})=>({strand,frame,start,end,length,protein}));
  assert.deepEqual(actual,enumerateORFs(sequence,minimum,code),`${sequence}, table ${code}, minimum ${minimum}`);
 }
});
test('large mixed input preserves composition and every GC window uses its own known-base denominator',()=>{
 const sequence=normalizeSequence('acgtn ry\n'.repeat(10000));const c=countComposition(sequence);
 assert.equal(c.length,70000);assert.deepEqual(c.counts,{A:10000,C:10000,G:10000,T:10000});assert.equal(c.ambiguous,30000);assert.equal(c.gc,50);
 const small='NNGNCATNRYACGT';
 for(let width=1;width<=small.length;width++)for(const point of slidingGC(small,width)){
  const window=small.slice(point.start-1,point.end),known=[...window].filter(x=>'ACGT'.includes(x)),gc=known.filter(x=>x==='G'||x==='C').length;
  assert.equal(point.gc,known.length?100*gc/known.length:null);
 }
});
test('repeated parsing is independent, malformed FASTA is rejected and ambiguity remains literal in alignment',()=>{
 assert.equal(parseInput('  acgt\nN ')[0].sequence,'ACGTN');assert.deepEqual(parseInput('>new\nTT'),[{header:'new',sequence:'TT'}]);
 for(const malformed of ['>\nACG','>one\nACG\n>two','ACG\n>one\nTT','>one\nACGU'])assert.throws(()=>parseFasta(malformed));
 for(const bad of ['', ' \n', 'ACGU', 'ACG1'])assert.throws(()=>parseInput(bad));
 const ambiguity=alignGlobal('ANR','ANN');assert.equal(ambiguity.matches,2);assert.equal(ambiguity.mismatches,1);assert.equal(ambiguity.identity,200/3);
 assert.throws(()=>alignGlobal('A'.repeat(1501),'A'),/limited/);
});

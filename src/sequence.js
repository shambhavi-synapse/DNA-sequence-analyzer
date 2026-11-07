export const IUPAC = Object.freeze({A:'A',C:'C',G:'G',T:'T',R:'AG',Y:'CT',S:'GC',W:'AT',K:'GT',M:'AC',B:'CGT',D:'AGT',H:'ACT',V:'ACG',N:'ACGT'});
const COMPLEMENT = Object.freeze({A:'T',T:'A',C:'G',G:'C',R:'Y',Y:'R',S:'S',W:'W',K:'M',M:'K',B:'V',V:'B',D:'H',H:'D',N:'N'});
export function normalizeSequence(input) {
  if (typeof input !== 'string') throw new TypeError('Sequence input must be text.');
  const normalized=input.replace(/\s/g,'').toUpperCase();
  if (!normalized) throw new Error('Enter a DNA sequence or choose a FASTA file.');
  const invalid=[];
  for (let i=0;i<normalized.length;i++) if (!IUPAC[normalized[i]]) invalid.push({symbol:normalized[i],position:i+1});
  if (invalid.length) throw new Error(`Invalid character${invalid.length>1?'s':''}: ${invalid.slice(0,5).map(x=>`${JSON.stringify(x.symbol)} at position ${x.position}`).join(', ')}${invalid.length>5?'…':''}. Use DNA bases or IUPAC ambiguity symbols.`);
  return normalized;
}
export function parseFasta(text) {
  if (typeof text!=='string'||!text.trim()) throw new Error('The FASTA file is empty.');
  const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/); const records=[]; let header=null, chunks=[];
  const finish=()=>{if(header!==null){const sequence=chunks.join('');if(!sequence)throw new Error(`FASTA record "${header}" has no sequence.`);records.push({header,sequence:normalizeSequence(sequence)});}};
  for(let i=0;i<lines.length;i++){const line=lines[i].trim();if(!line)continue;if(line.startsWith('>')){finish();header=line.slice(1).trim();if(!header)throw new Error(`FASTA header on line ${i+1} is empty.`);chunks=[];}else{if(header===null)throw new Error(`Expected a FASTA header (>) before sequence data on line ${i+1}.`);chunks.push(line);}}
  finish(); if(!records.length)throw new Error('No FASTA records were found.'); return records;
}
export function complement(sequence){return [...sequence].map(base=>COMPLEMENT[base]).join('');}
export function reverseComplement(sequence){return [...complement(sequence)].reverse().join('');}
export function transcribeCodingStrand(sequence){return sequence.replaceAll('T','U');}
export function transcribeTemplateStrand(sequence){return reverseComplement(sequence).replaceAll('T','U');}
export function countComposition(sequence){const counts={A:0,C:0,G:0,T:0};let ambiguous=0;for(const b of sequence){if(Object.hasOwn(counts,b))counts[b]++;else ambiguous++;}const known=sequence.length-ambiguous;const pct=n=>known?100*n/known:null;return {length:sequence.length,counts,ambiguous,known,percentages:Object.fromEntries(Object.entries(counts).map(([b,n])=>[b,pct(n)])),gc:known?100*(counts.G+counts.C)/known:null,at:known?100*(counts.A+counts.T)/known:null};}
export function slidingGC(sequence,windowSize){if(!Number.isInteger(windowSize)||windowSize<1)throw new Error('Window length must be a positive integer.');const points=[];let gc=0,known=0;for(let i=0;i<Math.min(windowSize,sequence.length);i++){const b=sequence[i];if(b==='G'||b==='C')gc++,known++;else if(b==='A'||b==='T')known++;}for(let start=0;start+windowSize<=sequence.length;start++){points.push({start:start+1,end:start+windowSize,gc:known?100*gc/known:null});const leaving=sequence[start],entering=sequence[start+windowSize];if(leaving==='G'||leaving==='C')gc--,known--;else if(leaving==='A'||leaving==='T')known--;if(entering==='G'||entering==='C')gc++,known++;else if(entering==='A'||entering==='T')known++;}return points;}
export function parseInput(text, name='Sequence 1') {if(/^\s*>/m.test(text))return parseFasta(text);return [{header:name||'Sequence 1',sequence:normalizeSequence(text)}];}

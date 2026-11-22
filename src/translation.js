import {IUPAC,reverseComplement} from './sequence.js';
const BASES=['T','C','A','G'];
const AA_ROWS=['FFLLSSSSYY**CC*W','LLLLPPPPHHQQRRRR','IIIMTTTTNNKKSSRR','VVVVAAAADDEEGGGG'];
export const STANDARD_CODE=Object.freeze(Object.fromEntries(BASES.flatMap((a,ai)=>BASES.flatMap((b,bi)=>BASES.map((c,ci)=>[a+b+c,AA_ROWS[ai][bi*4+ci]])))));
const mitochondrial={...STANDARD_CODE,TGA:'W',ATA:'M',AGA:'*',AGG:'*'};
export const GENETIC_CODES=Object.freeze({'1':STANDARD_CODE,'2':Object.freeze(mitochondrial),'5':Object.freeze({...mitochondrial,AGA:'S',AGG:'S'}),'11':STANDARD_CODE});
export function translateCodon(codon,codeId='1'){if(codon.length!==3)return null;const code=GENETIC_CODES[String(codeId)];if(!code)throw new Error('Select a supported genetic code table (1, 2, 5 or 11).');if(code[codon])return code[codon];let residues=new Set(['']);for(const symbol of codon){const expanded=IUPAC[symbol];if(!expanded)return 'X';residues=new Set([...residues].flatMap(prefix=>[...expanded].map(base=>prefix+base)));}const aas=new Set([...residues].map(c=>code[c]));return aas.size===1?[...aas][0]:'X';}
export function translateFrame(sequence,offset,codeId='1'){let protein='';for(let i=offset;i+3<=sequence.length;i+=3)protein+=translateCodon(sequence.slice(i,i+3),codeId);return protein;}
export function sixFrames(sequence,codeId='1'){const reverse=reverseComplement(sequence);return [{label:'+1',strand:'+',offset:0,sequence,protein:translateFrame(sequence,0,codeId)},{label:'+2',strand:'+',offset:1,sequence,protein:translateFrame(sequence,1,codeId)},{label:'+3',strand:'+',offset:2,sequence,protein:translateFrame(sequence,2,codeId)},{label:'−1',strand:'−',offset:0,sequence:reverse,protein:translateFrame(reverse,0,codeId)},{label:'−2',strand:'−',offset:1,sequence:reverse,protein:translateFrame(reverse,1,codeId)},{label:'−3',strand:'−',offset:2,sequence:reverse,protein:translateFrame(reverse,2,codeId)}];}
// NCBI tables, checked 2026-11-22: https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi
export const CODE_INFO=Object.freeze({
  '1':{name:'Standard',starts:['TTG','CTG','ATG']},
  '2':{name:'Vertebrate mitochondrial',starts:['ATT','ATC','ATA','ATG','GTG']},
  '5':{name:'Invertebrate mitochondrial',starts:['TTG','ATT','ATC','ATA','ATG','GTG']},
  '11':{name:'Bacterial, archaeal and plant plastid',starts:['TTG','CTG','ATT','ATC','ATA','ATG','GTG']}
});
export function startCodons(codeId='1',startRule='atg'){
  if(!CODE_INFO[String(codeId)])throw new Error('Select a supported genetic code table (1, 2, 5 or 11).');
  if(!['atg','table'].includes(startRule))throw new Error('Select ATG-only or table-defined initiation.');
  return startRule==='table'?CODE_INFO[String(codeId)].starts:['ATG'];
}
/** Complete start-to-stop candidates; X residues flag unresolved internal codons. */
export function findORFs(sequence,minLength=30,codeId='1',startRule='atg'){
  if(!Number.isInteger(minLength)||minLength<1)throw new Error('Minimum ORF length must be a positive integer.');
  const allowedStarts=startCodons(codeId,startRule),results=[];
  for(const strand of ['+','−']){
    const oriented=strand==='+'?sequence:reverseComplement(sequence);
    for(let offset=0;offset<3;offset++){
      let starts=[],translated=null;
      for(let i=offset;i+3<=oriented.length;i+=3){
        const codon=oriented.slice(i,i+3);
        if(allowedStarts.includes(codon))starts.push(i);
        // An ambiguous triplet such as TAR is a definite stop if every expansion stops.
        if(translateCodon(codon,codeId)==='*'){
          for(const start of starts){
            const length=i+3-start;
            if(length<minLength)continue;
            const rawProtein=(translated??=translateFrame(oriented,offset,codeId)).slice((start-offset)/3,(i+3-offset)/3);
            results.push({strand,frame:`${strand}${offset+1}`,
              start:strand==='+'?start+1:sequence.length-i-2,
              end:strand==='+'?i+3:sequence.length-start,length,
              startCodon:oriented.slice(start,start+3),stopCodon:codon,
              // Initiation is Met even for GTG/TTG etc.; internal codons keep normal meanings.
              protein:'M'+rawProtein.slice(1),unresolvedCodons:[...rawProtein].filter(aa=>aa==='X').length});
          }
          starts=[];
        }
      }
    }
  }
  return results.sort((a,b)=>a.start-b.start||a.end-b.end||a.strand.localeCompare(b.strand));
}

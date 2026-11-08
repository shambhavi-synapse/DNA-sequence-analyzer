/** Authored teaching schematics, not experimentally resolved molecular structures.
 * Sequence examples are synthetic; all directions refer to chemical 5′/3′ ends.
 */
export const SCHEMATIC_EXAMPLES = Object.freeze({
  pairing: Object.freeze({top:'ATGCA', bottom:'TACGT', bonds:[2,2,3,3,2]}),
  transcription: Object.freeze({coding:'ATGGCTTAA', template:'TACCGAATT', rna:'AUGGCUUAA'}),
  frames: Object.freeze([
    Object.freeze({offset:0,codons:['AUG','GCU','UAA'],residues:['Met','Ala','Stop'],tail:''}),
    Object.freeze({offset:1,codons:['UGG','CUU'],residues:['Trp','Leu'],tail:'AA'}),
    Object.freeze({offset:2,codons:['GGC','UUA'],residues:['Gly','Leu'],tail:'A'})
  ])
});
const text = (x,y,value,cls='') => `<text x="${x}" y="${y}" class="${cls}">${value}</text>`;
const line = (x1,y1,x2,y2,cls='',extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" ${extra}/>`;
const bases = (sequence,x,y,step=42) => [...sequence].map((base,i)=>text(x+i*step,y,base,`diagram-base base-${base.toLowerCase()}`)).join('');
const arrow = (key,x1,y1,x2,y2,cls='diagram-new') => line(x1,y1,x2,y2,cls,`marker-end="url(#${key}-arrow)"`);
function svg(key,height,title,description,content){
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${height}" role="img" aria-labelledby="${key}-title ${key}-description"><title id="${key}-title">${title}</title><desc id="${key}-description">${description}</desc><defs><marker id="${key}-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0L8 4L0 8Z" class="diagram-arrow diagram-arrow-${key}"/></marker></defs>${content}</svg>`;
}
function pairing(){
 const {top,bottom,bonds}=SCHEMATIC_EXAMPLES.pairing;
 let content=text(24,30,'Antiparallel DNA')+text(24,76,'5′')+text(652,76,'3′')+text(24,182,'3′')+text(652,182,'5′');
 content+=arrow('pairing',70,90,630,90,'diagram-backbone')+arrow('pairing',630,164,70,164,'diagram-backbone');
 content+=bases(top,160,76,95)+bases(bottom,160,190,95);
 bonds.forEach((count,i)=>{for(let j=0;j<count;j++)content+=line(160+i*95+(j-(count-1)/2)*7,108,160+i*95+(j-(count-1)/2)*7,147,'diagram-bond');});
 content+=text(24,230,'Dotted lines: canonical hydrogen bonds (A:T, 2; G:C, 3).','diagram-label');
 return svg('pairing',252,'Complementary, antiparallel DNA strands','Top strand 5′ ATGCA 3′; bottom strand 3′ TACGT 5′. Arrows show each backbone’s 5′ to 3′ direction. Bond counts are schematic, not atomic geometry.',content);
}
function replication(){
 let content=text(24,30,'Lagging strand: discontinuous synthesis')+text(546,30,'Fork movement','diagram-label')+arrow('replication',548,47,680,47);
 content+=`<path d="M40 85H530L600 148H692M40 274H530L600 174H692" class="diagram-template"/>`;
 content+=text(24,73,'5′')+text(692,136,'3′')+text(24,299,'3′')+text(692,199,'5′');
 for(let x=614;x<680;x+=18)content+=line(x,148,x,174,'diagram-bond');
 for(const [left,right] of [[80,220],[302,442]]){
   content+=arrow('replication',right,118,left,118)+line(right-22,118,right,118,'diagram-primer');
   content+=text(left-10,148,'3′','diagram-label')+text(right-10,148,'5′','diagram-label');
 }
 content+=text(24,180,'Short coloured segments: RNA primers at fragment 5′ ends.','diagram-label');
 content+=text(24,211,'Leading strand: continuous synthesis')+arrow('replication',80,235,500,235)+text(70,259,'5′','diagram-label')+text(496,259,'3′','diagram-label');
 return svg('replication',320,'Leading and lagging strands at a right-moving replication fork','Grey parental templates are antiparallel. The lower daughter grows 5′ to 3′ toward the fork continuously. Upper Okazaki fragments grow 5′ to 3′ away from the fork, starting from RNA primers at their right-hand 5′ ends. The leading-strand initiation primer and enzymes are omitted; this is not a molecular-scale drawing.',content);
}
function transcription(){
 const {coding,template,rna}=SCHEMATIC_EXAMPLES.transcription;
 let content=text(24,32,'Coding DNA')+text(24,98,'Template DNA')+text(24,206,'RNA copy');
 for(const [sequence,y,left,right] of [[coding,58,'5′','3′'],[template,124,'3′','5′'],[rna,232,'5′','3′']]){
   content+=text(206,y,left)+bases(sequence,258,y)+text(656,y,right);
 }
 content+=arrow('transcription',250,164,620,164)+text(254,153,'Template read 3′ → 5′','diagram-label');
 content+=arrow('transcription',250,260,620,260)+text(254,287,'RNA synthesized 5′ → 3′','diagram-label');
 return svg('transcription',310,'A DNA template specifies a complementary RNA copy','Synthetic coding strand 5′ ATGGCTTAA 3′; template 3′ TACCGAATT 5′; RNA 5′ AUGGCUUAA 3′. RNA polymerase reads the template 3′ to 5′ and synthesizes RNA 5′ to 3′. RNA processing is not shown.',content);
}
function frames(){
 const sequence=SCHEMATIC_EXAMPLES.transcription.rna;
 let content=text(24,30,'One RNA, three possible groupings')+text(24,65,'5′')+bases(sequence,218,65)+text(620,65,'3′');
 SCHEMATIC_EXAMPLES.frames.forEach((frame,row)=>{
   const y=106+row*87;
   content+=text(24,y+22,`Offset ${frame.offset}`);
   frame.codons.forEach((codon,i)=>{
     const x=197+(frame.offset+3*i)*42;
     content+=`<rect x="${x}" y="${y}" width="126" height="35" rx="5" class="diagram-codon${frame.residues[i]==='Stop'?' diagram-stop':''}"/>`+bases(codon,x+21,y+24);
     content+=text(x+63,y+58,frame.residues[i],'diagram-residue');
   });
   if(frame.tail){
     const x=197+(sequence.length-frame.tail.length)*42;
     content+=`<rect x="${x}" y="${y}" width="${frame.tail.length*42}" height="35" rx="5" class="diagram-tail"/>`+bases(frame.tail,x+21,y+24)+text(x+frame.tail.length*21,y+58,'Partial','diagram-residue');
   }
 });
 content+=text(24,396,'Standard code. Partial triplets are not translated. Stop is a signal, not an amino acid.','diagram-label');
 return svg('frames',420,'Reading frame determines codon grouping','The synthetic RNA AUGGCUUAA gives AUG GCU UAA: methionine, alanine, stop at offset zero. Offset one gives UGG CUU: tryptophan, leucine with AA incomplete. Offset two gives GGC UUA: glycine, leucine with A incomplete. These groupings do not establish biological initiation.',content);
}
const drawings={pairing,replication,transcription,frames};
const captions={pairing:'Complementarity and strand direction · teaching schematic',replication:'Right-moving fork · daughter synthesis is 5′ → 3′; leading-strand initiation primer omitted',transcription:'Synthetic sequence example · RNA processing omitted',frames:'Synthetic RNA · frame offsets are counted from the 5′ end'};
export function schematicMarkup(key){
 if(!Object.hasOwn(drawings,key))throw new Error('Unknown teaching schematic.');
 return drawings[key]();
}
export function selectedPairMarkup(base){
 const pairs={A:['T','Adenine','Thymine','Purine','Pyrimidine',2],T:['A','Thymine','Adenine','Pyrimidine','Purine',2],G:['C','Guanine','Cytosine','Purine','Pyrimidine',3],C:['G','Cytosine','Guanine','Pyrimidine','Purine',3]};
 if(!Object.hasOwn(pairs,base))throw new Error('Choose a standard DNA base.');
 const [partner,name,otherName,kind,otherKind,bonds]=pairs[base];
 const bondLines=Array.from({length:bonds},(_,i)=>line(110,94+(i-(bonds-1)/2)*12,150,94+(i-(bonds-1)/2)*12,'diagram-bond')).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 230" role="img" aria-labelledby="selected-pair-title selected-pair-desc"><title id="selected-pair-title">${name} pairs with ${otherName}</title><desc id="selected-pair-desc">${bonds} canonical Watson-Crick hydrogen bonds connect this purine–pyrimidine pair. Lettered fields identify bases; they are not chemical structures.</desc>${text(130,28,`${bonds} hydrogen bonds`,'pair-center-label')}<rect x="20" y="58" width="90" height="78" rx="10" class="diagram-codon"/><rect x="150" y="58" width="90" height="78" rx="10" class="diagram-codon"/>${text(65,111,base,`pair-letter base-${base.toLowerCase()}`)}${text(195,111,partner,`pair-letter base-${partner.toLowerCase()}`)}${bondLines}${text(65,166,name,'pair-center-label')}${text(195,166,otherName,'pair-center-label')}${text(65,192,kind,'pair-class')}${text(195,192,otherKind,'pair-class')}</svg>`;
}
export function initializeSchematics(doc=document){
 doc.querySelectorAll('[data-schematic]').forEach(figure=>{
   const key=figure.dataset.schematic;
   const viewport=doc.createElement('div');
   viewport.className='schematic-viewport';
   viewport.tabIndex=0;
   viewport.setAttribute('role','region');
   viewport.setAttribute('aria-label',`${key==='frames'?'Reading frames':key} teaching diagram; scroll horizontally if needed`);
   viewport.innerHTML=schematicMarkup(key); // Only authored constants; never user sequence data.
   const caption=doc.createElement('figcaption');caption.textContent=captions[key];
   figure.append(viewport,caption);
 });
}

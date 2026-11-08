import {countComposition,complement,reverseComplement,transcribeCodingStrand,transcribeTemplateStrand} from './sequence.js';
import {sixFrames} from './translation.js';
import {sequenceProperties} from './properties.js';
import {codonUsage} from './codon.js';

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const percent=value=>value===null?'Undefined':value.toFixed(2)+'%';
const sequenceBlock=(title,sequence)=>`<section class="report-sequence"><h3>${escape(title)}</h3><pre>${escape(sequence||'(no complete codons)')}</pre></section>`;
const table=(head,rows)=>`<table><thead><tr>${head.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

/** Uses the established engines; report formatting does not redefine their rules. */
export function reportModel({record,minimum,code,orfs,codonFrame='+1'},preparedAt=new Date().toISOString()){
 return {record,minimum,code:String(code),orfs,preparedAt,composition:countComposition(record.sequence),properties:sequenceProperties(record.sequence),frames:sixFrames(record.sequence,code),usage:codonUsage(record.sequence,codonFrame,code)};
}
export function reportHTML(model){
 const header=`<header class="report-header"><img class="report-logo" src="assets/branding/seqscope-logo-print.svg" width="140" height="102" alt="SeqScope"><div><h1>DNA Sequence Analysis Report</h1><p>Prepared ${escape(model?.preparedAt??new Date().toISOString())}</p></div></header>`;
 if(!model)return header+'<p>Analyze a DNA sequence to generate a report.</p>';
 const {record,composition:c,frames,minimum,code,orfs,usage}=model;
 const stops=code==='2'?'TAA, TAG, AGA, AGG':'TAA, TAG, TGA';
 const rows=Object.entries(c.counts).map(([base,count])=>[base,count,percent(c.percentages[base])]);
 rows.push(['Ambiguous IUPAC symbols',c.ambiguous,'Excluded from known-base percentages']);
 let html=header+`<section class="report-identification"><h2>${escape(record.header)}</h2><p><strong>Length:</strong> ${c.length.toLocaleString()} nt · <strong>Genetic code:</strong> table ${escape(code)} (${code==='2'?'vertebrate mitochondrial':'standard'})</p><p><strong>ORF rules:</strong> ATG start; stops ${stops}; minimum ${minimum} nt including the stop codon. Complete candidates only. Coordinates are 1-based inclusive on the original input.</p><p>Sequences are processed on this device. Candidate ORFs and translated frames are computational results, not evidence of gene function or expression.</p></section>`;
 html+=`<section><h2>Nucleotide composition</h2>${table(['Base or category','Count (nt)','Percentage of A/C/G/T'],rows)}<p><strong>GC:</strong> ${percent(c.gc)} · <strong>AT:</strong> ${percent(c.at)}. Denominator: ${c.known.toLocaleString()} unambiguous A/C/G/T bases; ${c.ambiguous.toLocaleString()} ambiguous symbols remain in the full input.</p></section>`;
 html+=`<p><strong>Short-oligo Wallace-rule Tm estimate:</strong> ${model.properties.wallaceTmC===null?'Unavailable':model.properties.wallaceTmC+' °C'}. Only reported for unambiguous 4–14 nt oligonucleotides. This approximate rule omits salt, concentration and nearest-neighbour effects.</p>`;
 html+=sequenceBlock('Input DNA · 5′ → 3′',record.sequence);
 html+='<section><h2>Strand transformations</h2>'+sequenceBlock('Complement aligned to input · 3′ → 5′',complement(record.sequence))+sequenceBlock('Reverse complement · 5′ → 3′',reverseComplement(record.sequence))+sequenceBlock('Coding-strand RNA substitution · 5′ → 3′',transcribeCodingStrand(record.sequence))+sequenceBlock('RNA from input treated as a 5′ → 3′ template strand',transcribeTemplateStrand(record.sequence))+'</section>';
 html+='<section class="report-gc"><h2>Sliding-window GC profile</h2><p data-report-window></p><div data-report-gc></div><p>Each point is one complete window, advanced by one nucleotide. Ambiguous symbols are excluded from each window’s denominator. GC composition alone does not identify biological function.</p></section>';
 html+='<section><h2>Six-frame translation</h2><p>Each oriented DNA strand is read 5′ → 3′. Reverse frames use the reverse complement; offsets count from that strand’s 5′ end. * denotes a stop signal; X denotes an unresolved amino acid. Incomplete terminal codons are omitted.</p>';
 for(const frame of frames){const trailing=Math.max(0,record.sequence.length-frame.offset)%3;html+=sequenceBlock(`${frame.label} · ${frame.strand==='+'?'forward':'reverse complement'} · offset ${frame.offset} nt · ${trailing} terminal nt omitted`,frame.protein);}
 html+='</section><section class="report-orfs-section"><h2>Candidate open reading frames</h2><p>'+orfs.length.toLocaleString()+' complete candidates at the selected threshold. Lengths include the terminal stop codon; peptides retain its * symbol.</p>';
 html+=orfs.length?`<table class="report-orfs"><thead><tr><th scope="col">Frame</th><th scope="col">Input interval (nt)</th><th scope="col">Length (nt)</th><th scope="col">Translation</th></tr></thead><tbody>${orfs.map(o=>`<tr><td>${escape(o.frame)}</td><td>${o.start}–${o.end}</td><td>${o.length}</td><td><code>${escape(o.protein)}</code></td></tr>`).join('')}</tbody></table>`:'<p>No complete candidates meet these rules. This does not establish that the sequence is noncoding.</p>';
 html+='</section><section><h2>Codon usage · '+escape(usage.frame)+'</h2><p>'+usage.total+' unambiguous codons counted; '+usage.ambiguous+' ambiguous codons excluded from usage frequencies.</p>';
 html+=usage.rows.length?table(['DNA codon','Amino-acid symbol','Count','Frequency of counted codons'],usage.rows.map(r=>[r.codon,r.aminoAcid,r.count,(100*r.frequency).toFixed(2)+'%'])):'<p>No unambiguous complete codons in this frame.</p>';
 html+='</section><section><h2>Motifs and repeated patterns</h2><div data-report-patterns></div></section><p class="report-end"><strong>SeqScope</strong> · Browser-local DNA analysis. Results require biological context and are not a clinical interpretation.</p>';
 return html;
}

export function preparePrintReport(getAnalysis,doc=document){
 const host=doc.getElementById('print-report');
 const analysis=getAnalysis();
 host.innerHTML=reportHTML(analysis?reportModel(analysis):null);
 if(!analysis)return;
 const gc=doc.querySelector('#gc-chart svg');
 if(gc){
  const chart=gc.cloneNode(true);
  // Presentation attributes keep the real computed graph portable to PDF engines.
  const styles=[['.gc-line',{fill:'none',stroke:'#9a3b2c','stroke-width':'2'}],['.axis',{stroke:'#494743','stroke-width':'1'}],['.gridline',{stroke:'#bbb','stroke-dasharray':'3 3'}],['.gc-selection',{fill:'#e8e4df','fill-opacity':'.3'}],['.gc-cursor',{stroke:'#777','stroke-width':'1'}],['circle',{fill:'#9a3b2c'}],['text',{fill:'#202122','font-family':'Manrope, Arial, sans-serif','font-size':'14'}]];
  for(const [selector,attributes] of styles)chart.querySelectorAll(selector).forEach(node=>{for(const [key,value] of Object.entries(attributes))node.setAttribute(key,value);});
  host.querySelector('[data-report-gc]').append(chart);
 }
 else host.querySelector('[data-report-gc]').textContent=doc.querySelector('#gc-chart')?.textContent??'No GC profile available.';
 const windowValue=doc.getElementById('gc-window')?.value;
 host.querySelector('[data-report-window]').textContent=`Window: ${windowValue} nt. Positions on the horizontal axis are window starts in the input.`;
 const patterns=host.querySelector('[data-report-patterns]');
 for(const selector of ['#motif-results','#repeat-results']){
  const original=doc.querySelector(selector);if(!original?.textContent.trim())continue;
  const clone=original.cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
  clone.querySelectorAll('button').forEach(button=>{const text=doc.createElement('span');text.className='report-hit';text.textContent=button.textContent;button.replaceWith(text);});
  patterns.append(clone);
 }
}
export function initializePrintReport(getAnalysis,doc=document,view=window){
 const prepare=()=>preparePrintReport(getAnalysis,doc);
 view.addEventListener('beforeprint',prepare);
 return prepare;
}

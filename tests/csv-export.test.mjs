import test from 'node:test';
import assert from 'node:assert/strict';
import {ANALYSIS_COLUMNS,analysisCSV,csvCell,spreadsheetSafe} from '../src/csv-export.js';

const rows=text=>text.replace(/^\ufeff/,'').trimEnd().split(/\r?\n/);

test('analysis CSV uses a stable long-form schema and exports current scientific results',()=>{
 const csv=analysisCSV({record:{header:'Example, one',sequence:'ATGAAATAGATATAT'},code:'1',minimum:6,codonFrame:'+1',gcWindow:3,motif:'ATG',motifReverse:true});
 const lines=rows(csv);
 assert.equal(lines[0],ANALYSIS_COLUMNS.join(','));
 assert.ok(lines.some(line=>line.startsWith('composition,"Example, one",sequence_length,15,nt')));
 assert.ok(lines.some(line=>line.includes('translation,"Example, one",protein,MK*')));
 assert.ok(lines.some(line=>line.includes('orf,"Example, one",candidate,MK*')));
 assert.ok(lines.some(line=>line.includes('gc_profile,"Example, one",window_gc')));
 assert.ok(lines.some(line=>line.includes('motif,"Example, one",exact_symbol_match,ATG')));
 assert.ok(lines.some(line=>line.includes('tandem_repeat,"Example, one",exact_adjacent_repeat,AT')));
});

test('CSV escaping preserves complete sequences and neutralizes spreadsheet formulas',()=>{
 assert.equal(spreadsheetSafe(' =2+2'),"' =2+2");
 assert.equal(csvCell('a,"b"'),'"a,""b"""');
 const sequence='ACGT'.repeat(800);
 const csv=analysisCSV({record:{header:'=HYPERLINK("bad")',sequence},gcWindow:100});
 assert.ok(csv.includes("'=HYPERLINK("));
 assert.ok(csv.includes(sequence));
 assert.ok(rows(csv).some(line=>line.includes(`metadata,\"'=HYPERLINK(\"\"bad\"\")\",input_sequence,${sequence},nt`)));
});

test('ambiguous composition and profile values remain explicit without invented numbers',()=>{
 const csv=analysisCSV({record:{header:'Ambiguous',sequence:'NNNN'},gcWindow:4});
 assert.ok(csv.includes('composition,Ambiguous,ambiguous_count,4,nt'));
 assert.ok(csv.includes('composition,Ambiguous,gc_content,,%'));
 assert.ok(csv.includes('gc_profile,Ambiguous,window_gc,,%'));
 assert.ok(csv.includes('No unambiguous bases in window'));
});

test('hand-calculated export values preserve exact percentages, frames and inclusive intervals',()=>{
 const csv=analysisCSV({record:{header:'Independent',sequence:'ATGAAATAG'},code:'1',minimum:6,gcWindow:3,motif:'ATG'});
 const data=rows(csv).slice(1).map(line=>Object.fromEntries(line.split(',').map((value,i)=>[ANALYSIS_COLUMNS[i],value])));
 const value=field=>data.find(row=>row.field===field).value;
 assert.equal(value('count_A'),'5');assert.equal(value('count_T'),'2');assert.equal(value('count_G'),'2');assert.equal(value('count_C'),'0');
 assert.equal(Number(value('gc_content')),200/9);assert.equal(value('template_dna_to_rna_5_to_3'),'CUAUUUCAU');
 const orf=data.find(row=>row.dataset==='orf');assert.equal(orf.start_1based,'1');assert.equal(orf.end_1based,'9');assert.equal(orf.length_nt,'9');assert.equal(orf.frame,'+1');assert.equal(orf.value,'MK*');
 const windows=data.filter(row=>row.dataset==='gc_profile');assert.equal(windows.length,7);assert.equal(Number(windows[0].value),100/3);assert.equal(windows[0].start_1based,'1');assert.equal(windows[6].end_1based,'9');
 const translations=data.filter(row=>row.dataset==='translation');assert.deepEqual(translations.map(row=>row.frame),['+1','+2','+3','−1','−2','−3']);
 assert.equal(data.filter(row=>row.dataset==='codon_usage').reduce((sum,row)=>sum+Number(row.count),0),3);
});

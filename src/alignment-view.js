/** Map alignment columns to 1-based input coordinates. Gaps have no coordinate. */
export function alignmentColumns(a,b){if(a.length!==b.length)throw new Error('Aligned strings must have equal lengths.');let pa=0,pb=0;return [...a].map((base,i)=>{const other=b[i];return {column:i+1,a:base,b:other,positionA:base==='-'?null:++pa,positionB:other==='-'?null:++pb,kind:base==='-'||other==='-'?'gap':base===other?'match':'mismatch'};});}
export function alignmentCSV(columns){return 'column,position_A,base_A,position_B,base_B,type\n'+columns.map(c=>[c.column,c.positionA??'',c.a,c.positionB??'',c.b,c.kind].join(',')).join('\n');}

/** Group alignment differences relative to sequence A; coordinates are not HGVS calls. */
export function alignmentDifferences(columns){
  const events=[];let lastA=0,lastB=0;
  for(const c of columns){
    const type=c.a==='-'?'insertion':c.b==='-'?'deletion':c.a===c.b?null:/^[ACGT]{2}$/.test(c.a+c.b)?'substitution':'ambiguity';
    if(type){
      let event=events.at(-1);
      if(!event||event.type!==type||event.columnEnd!==c.column-1){
        event={type,columnStart:c.column,columnEnd:c.column,startA:c.positionA,endA:c.positionA,startB:c.positionB,endB:c.positionB,afterA:lastA,afterB:lastB,reference:'',alternate:''};
        events.push(event);
      }
      event.columnEnd=c.column;
      if(c.positionA!==null){event.startA??=c.positionA;event.endA=c.positionA;event.reference+=c.a;}
      if(c.positionB!==null){event.startB??=c.positionB;event.endB=c.positionB;event.alternate+=c.b;}
    }
    if(c.positionA!==null)lastA=c.positionA;
    if(c.positionB!==null)lastB=c.positionB;
  }
  return events;
}

/** Complete alignment columns with scoring and grouped differences, reproducible without the UI. */
export function alignmentReportCSV(result){
  const columns=alignmentColumns(result.alignedA,result.alignedB),events=alignmentDifferences(columns);
  const eventAt=new Map();for(const event of events)for(let c=event.columnStart;c<=event.columnEnd;c++)eventAt.set(c,event);
  const header=['column','position_A','base_A','position_B','base_B','type','difference_relative_to_A','event_start_column','event_end_column','after_A','after_B','match_score','mismatch_score','gap_score','identity_percent','identity_denominator_columns'];
  return header.join(',')+'\n'+columns.map(c=>{const e=eventAt.get(c.column);return [c.column,c.positionA??'',c.a,c.positionB??'',c.b,c.kind,e?.type??'',e?.columnStart??'',e?.columnEnd??'',e?.afterA??'',e?.afterB??'',result.scoring?.match??2,result.scoring?.mismatch??-1,result.scoring?.gap??-2,result.identity,result.columns].join(',');}).join('\n');
}

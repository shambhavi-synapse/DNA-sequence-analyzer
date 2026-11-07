// Display-only lane allocation. Coordinates and candidate order are never changed.
export function layoutORFRows(orfs) {
  const frames=['+1','+2','+3','−1','−2','−3'];
  const positions=new Array(orfs.length);
  let top=12;
  const rows=frames.map(frame=>{
    const laneEnds=[];
    const candidates=orfs.map((orf,index)=>({orf,index}))
      .filter(item=>item.orf.frame===frame)
      .sort((a,b)=>a.orf.start-b.orf.start || b.orf.end-a.orf.end);
    for(const {orf,index} of candidates){
      let lane=laneEnds.findIndex(end=>end<orf.start);
      if(lane<0)lane=laneEnds.length;
      laneEnds[lane]=orf.end;
      positions[index]={y:top+8+lane*18,lane};
    }
    const row={frame,y:top+8,lanes:Math.max(1,laneEnds.length)};
    top+=row.lanes*18+8;
    return row;
  });
  return {rows,positions,height:top+20};
}

/** Display helpers do not alter calculated candidates or exported hit arrays. */
export function longestCandidate(orfs){
  return orfs.reduce((best,orf)=>!best||orf.length>best.length?orf:best,null);
}
export function rankedCandidates(orfs){
  return orfs.map((orf,index)=>({orf,index})).sort((a,b)=>b.orf.length-a.orf.length||a.index-b.index);
}
const primitive=unit=>{
  for(let width=1;width<unit.length;width++)if(unit.length%width===0&&unit===unit.slice(0,width).repeat(unit.length/width))return false;
  return true;
};
/** Prefer maximal, non-overlapping repeat tracts; retain every other hit in details. */
export function repeatPresentation(hits){
  const ordered=[...hits].sort((a,b)=>b.length-a.length||Number(primitive(b.unit))-Number(primitive(a.unit))||a.unit.length-b.unit.length||a.start-b.start);
  const primary=[],secondary=[];
  for(const hit of ordered){
    const nested=primary.some(other=>hit.start<=other.end&&other.start<=hit.end);
    (nested?secondary:primary).push(hit);
  }
  return {primary:primary.sort((a,b)=>a.start-b.start),secondary:secondary.sort((a,b)=>a.start-b.start||b.length-a.length)};
}
export function pageInterval(length,start=1,size=600){
  if(!Number.isInteger(length)||length<1||!Number.isInteger(size)||size<1)throw new Error('Page length and size must be positive integers.');
  const first=Math.max(1,Math.min(length,Math.trunc(Number(start))||1));
  return {start:first,end:Math.min(length,first+size-1),previous:Math.max(1,first-size),next:Math.min(length,first+size)};
}

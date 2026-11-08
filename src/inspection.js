/** Map a normalized chart horizontal position to the nearest valid window start. */
export function windowAtFraction(fraction,length,windowSize){
  if(!Number.isFinite(fraction)||!Number.isInteger(length)||!Number.isInteger(windowSize)||windowSize<1||length<windowSize) return null;
  return Math.max(1,Math.min(length-windowSize+1,Math.round(Math.max(0,Math.min(1,fraction))*(length-1))+1));
}

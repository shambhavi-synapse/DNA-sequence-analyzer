/** Undefined windows break a plotted line rather than implying measured GC. */
export function gcSegments(points){const segments=[];let current=[];for(const point of points){if(point.gc===null){if(current.length)segments.push(current);current=[];}else current.push(point);}if(current.length)segments.push(current);return segments;}
/** Coordinates are input positions, one-based inclusive. */
export function describeGCWindow(point,size){return `Positions ${point.start}–${point.start+size-1}: ${point.gc===null?'GC undefined (no unambiguous bases)':`${point.gc.toFixed(2)}% GC among unambiguous bases`}.`;}

// Native disclosures stay compact on screen, but every frame belongs in a report.
export function initializePrintView(root=document,view=window){
 let closed=[];
 view.addEventListener('beforeprint',()=>{
  closed=[...root.querySelectorAll('#frames details:not([open])')];
  closed.forEach(group=>{group.open=true;});
 });
 view.addEventListener('afterprint',()=>{
  closed.forEach(group=>{if(group.isConnected)group.open=false;});
  closed=[];
 });
}

/** Copy during a user action, including local HTTP previews without Clipboard API. */
export async function copyText(text,{clipboard=globalThis.navigator?.clipboard,document=globalThis.document}={}) {
  if(clipboard?.writeText){
    try{await clipboard.writeText(text);return;}catch{/* Try the browser's local copy fallback. */}
  }
  if(!document?.execCommand)throw Error('Clipboard copying is unavailable.');
  const previous=document.activeElement,field=document.createElement('textarea');
  field.value=text;field.setAttribute('readonly','');field.style.cssText='position:fixed;left:-9999px;top:0';
  document.body.append(field);
  try{field.select();if(!document.execCommand('copy'))throw Error('Clipboard copying is unavailable.');}
  finally{field.remove();previous?.focus?.({preventScroll:true});}
}

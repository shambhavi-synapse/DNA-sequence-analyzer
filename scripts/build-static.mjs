import {cpSync,existsSync,mkdirSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname,extname,isAbsolute,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const entries=['index.html','styles.css','experience.css','visual.css','seqscope.css','src','assets'];
function filesBelow(root){
 return readdirSync(root,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?filesBelow(join(root,entry.name)):entry.isFile()?[join(root,entry.name)]:[]);
}
function localReferences(text,extension){
 if(extension==='.html'||extension==='.svg')return [...text.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match=>match[1]);
 if(extension==='.css')return [...text.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)].map(match=>match[1]);
 if(extension==='.js')return [...text.matchAll(/(?:from\s*|import\s*\(|import\s*)["'](\.[^"']+)["']/g)].map(match=>match[1]);
 return [];
}
export function validateStaticSite(directory){
 const root=resolve(directory),files=filesBelow(root);
 if(!existsSync(join(root,'index.html')))throw Error('Static output is missing index.html.');
 for(const file of files){
  const extension=extname(file);if(!['.html','.css','.js','.svg'].includes(extension))continue;
  for(const reference of localReferences(readFileSync(file,'utf8'),extension)){
   if(!reference||/^(?:[a-z]+:|\/\/|#)/i.test(reference))continue;
   const path=reference.split(/[?#]/)[0];if(!path)continue;
   const target=resolve(dirname(file),decodeURIComponent(path));
   const rel=relative(root,target);
   if(isAbsolute(path)||rel==='..'||rel.startsWith('..'+sep))throw Error(`Asset escapes the static output: ${relative(root,file)} → ${reference}`);
   if(!existsSync(target))throw Error(`Missing local asset: ${relative(root,file)} → ${reference}`);
  }
 }
 return files;
}
export function buildStaticSite(source=projectRoot,output=join(source,'dist')){
 const root=resolve(source),target=resolve(output),rel=relative(root,target);
 if(target===root||root.startsWith(target+sep)||(!rel.startsWith('..')&&entries.some(entry=>rel===entry||rel.startsWith(entry+sep))))throw Error('Build output must not overwrite project source.');
 for(const entry of entries)if(!existsSync(join(root,entry)))throw Error(`Missing source entry: ${entry}`);
 rmSync(target,{recursive:true,force:true});mkdirSync(target,{recursive:true});
 for(const entry of entries)cpSync(join(root,entry),join(target,entry),{recursive:true});
 const files=validateStaticSite(target).sort();
 const manifest={schema:1,files:Object.fromEntries(files.map(file=>[relative(target,file).split(sep).join('/'),createHash('sha256').update(readFileSync(file)).digest('hex')]))};
 writeFileSync(join(target,'release-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 return {output:target,fileCount:files.length,manifest};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=buildStaticSite();console.log(`Built ${result.fileCount} static application files and release-manifest.json in ${result.output}`);
}

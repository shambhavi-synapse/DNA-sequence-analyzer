import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,rmSync,writeFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {buildStaticSite,validateStaticSite} from '../scripts/build-static.mjs';
const root=new URL('..',import.meta.url).pathname;
test('production build includes local runtime dependencies, exact bytes and reproducible hashes',()=>{
 const temporary=mkdtempSync(join(tmpdir(),'seqscope-build-'));
 try{const result=buildStaticSite(root,join(temporary,'dist'));assert.ok(result.fileCount>=47);for(const [file,hash] of Object.entries(result.manifest.files)){assert.deepEqual(readFileSync(join(result.output,file)),readFileSync(join(root,file)));assert.equal(hash,createHash('sha256').update(readFileSync(join(root,file))).digest('hex'));}for(const excluded of ['.git','docs','tests','preview','.openai'])assert.equal(existsSync(join(result.output,excluded)),false);const second=buildStaticSite(root,join(temporary,'second'));assert.deepEqual(second.manifest,result.manifest);}finally{rmSync(temporary,{recursive:true,force:true});}
});
test('static validation rejects missing assets, broken imports and escaping paths',()=>{
 const temporary=mkdtempSync(join(tmpdir(),'seqscope-assets-'));
 try{for(const reference of ['assets/missing.webp','../outside.txt','/absolute.css']){writeFileSync(join(temporary,'index.html'),`<img src="${reference}">`);assert.throws(()=>validateStaticSite(temporary),/Missing local asset|escapes/);}writeFileSync(join(temporary,'index.html'),'<script type="module" src="app.js"></script>');writeFileSync(join(temporary,'app.js'),"import {x} from './missing.js';");assert.throws(()=>validateStaticSite(temporary),/missing.js/);writeFileSync(join(temporary,'app.js'),'');writeFileSync(join(temporary,'index.html'),'<link rel="stylesheet" href="a.css">');writeFileSync(join(temporary,'a.css'),"@font-face{src:url('missing.woff2')}");assert.throws(()=>validateStaticSite(temporary),/missing.woff2/);}finally{rmSync(temporary,{recursive:true,force:true});}
});
test('build refuses to replace source directories',()=>{
 for(const output of [root,join(root,'src'),join(root,'assets'),join(root,'src/nested')])assert.throws(()=>buildStaticSite(root,output),/overwrite project source/);
});

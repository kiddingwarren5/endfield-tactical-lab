// 从 data.akedata.wiki（终末地解包数据站，公开静态 JSON）拉取指定文件到 sources/raw/akedata。
// 用法：node tools/fetch_akedata.mjs --match chr_0026_lastrite --match wpn_claym_0013 ... [--dir SkillData,BuffData,GameplayConfig] [--table CharacterTable,...]
// 只下载索引里存在的文件，按索引 md5 校验，写 sources/raw/akedata/manifest.json（版本、抓取时间、每个文件的 md5）。
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'); const OUT=path.join(ROOT,'sources/raw/akedata'); const BASE='https://data.akedata.wiki';
const argv=process.argv.slice(2); const opt=(k)=>argv.flatMap((a,i)=>a===k?[argv[i+1]]:[]); const matches=opt('--match'); const dirs=(opt('--dir')[0]||'SkillData,BuffData').split(','); const tables=(opt('--table')[0]||'').split(',').filter(Boolean);
const get=async(url,binary)=>{ const r=await fetch(url,{cache:'no-cache'}); if(!r.ok) throw new Error(`${url}: HTTP ${r.status}`); return binary?Buffer.from(await r.arrayBuffer()):await r.text(); };
const md5=b=>crypto.createHash('md5').update(b).digest('hex');
fs.mkdirSync(path.join(OUT,'index'),{recursive:true});
const manifestPath=path.join(OUT,'manifest.json'); const manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath)):{files:{}};
const root=JSON.parse(await get(`${BASE}/manifest.json`)); const ver=root.versions.find(v=>v.id===root.latest); manifest.version=ver.id; manifest.tableCfgPath=ver.tableCfgPath; manifest.fetchedAt=new Date().toISOString(); manifest.source=BASE;
fs.writeFileSync(path.join(OUT,'index/manifest.json'),JSON.stringify(root,null,1));
const indexText=await get(`${BASE}/asset-sync-index.json`); fs.writeFileSync(path.join(OUT,'index/asset-sync-index.json'),indexText); const index=JSON.parse(indexText); const files=index.datasets.json.files; const jsonRoot=index.datasets.json.root;
const wanted=Object.keys(files).filter(p=>dirs.some(d=>p.startsWith(d+'/'))&&(matches.length===0||matches.some(m=>p.includes(m))));
console.log(`版本 ${ver.id}；匹配 ${wanted.length} 个 Json 文件，${tables.length} 张表`);
let n=0, skipped=0, failed=0; const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const queue=[...wanted]; const workers=Array.from({length:8},async()=>{ while(queue.length){ const p=queue.shift(); const dest=path.join(OUT,'Json',p); const want=files[p].md5; if(fs.existsSync(dest)&&manifest.files[p]?.md5===want){ skipped++; continue; } try{ const buf=await get(`${BASE}/${enc(jsonRoot+'/'+p)}`,true); const got=md5(buf); if(want&&got!==want){ console.log('md5 不一致，不保存：',p); failed++; continue; } fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,buf); manifest.files[p]={md5:got,size:buf.length,version:files[p].version}; n++; }catch(e){ console.log('失败：',p,e.message); failed++; } } }); await Promise.all(workers);
for(const t of tables){ try{ const buf=await get(`${BASE}/${ver.tableCfgPath}/${t}.json`,true); const dest=path.join(OUT,'TableCfg',`${t}.json`); fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,buf); manifest.files[`TableCfg/${t}.json`]={md5:md5(buf),size:buf.length,version:ver.id}; n++; }catch(e){ console.log('表失败：',t,e.message); failed++; } }
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,1));
console.log(`下载 ${n}，跳过（已有且 md5 一致）${skipped}，失败 ${failed}；清单 ${manifestPath}`);

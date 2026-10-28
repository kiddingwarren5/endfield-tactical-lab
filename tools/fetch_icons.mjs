// Download official cover images for operators/weapons/gold+target gear/consumables into dist/assets/icons/<kind>/<itemId>.png (resized to 96px via sips).
import fs from 'node:fs'; import {execSync} from 'node:child_process';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const kinds=[['operators','sources/skland/operators.json',()=>true],['weapons','sources/skland/weapons.json',()=>true],['gear','sources/skland/gear.json',g=>(g.tags['品质']||[]).join().includes('金')||(g.tags['装备套组']||[]).join().includes('天灾防护')],['consumables','sources/skland/consumables.json',()=>true]];
for(const [kind,file,filter] of kinds){ const items=JSON.parse(fs.readFileSync(file)).filter(filter); const dir=`dist/assets/icons/${kind}`; fs.mkdirSync(dir,{recursive:true}); let n=0;
  for(const it of items){ if(!it.cover) { console.log('no cover',kind,it.name); continue; } const out=`${dir}/${it.itemId}.png`; if(fs.existsSync(out)) continue; try{ const r=await fetch(it.cover,{headers:{'User-Agent':'Mozilla/5.0','Referer':'https://wiki.skland.com/'}}); const buf=Buffer.from(await r.arrayBuffer()); const tmp=`${dir}/${it.itemId}.orig`; fs.writeFileSync(tmp,buf); execSync(`sips -s format png -Z 128 "${tmp}" --out "${out}" >/dev/null 2>&1`); fs.unlinkSync(tmp); n++; }catch(e){ console.log('fail',kind,it.name,e.message); } await sleep(120); }
  console.log(kind,'downloaded',n,'of',items.length); }

import {get} from './skland_api.mjs'; import fs from 'node:fs';
const subs=[['1','1','operators'],['1','2','weapons'],['1','4','gear'],['1','7','substrate'],['1','6','items']];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const index={fetchedAt:new Date().toISOString(),subs:{}};
for(const [main,sub,name] of subs){
  const r=await get(`/web/v1/wiki/item/catalog?typeMainId=${main}&typeSubId=${sub}`);
  fs.writeFileSync(`raw/skland/catalog_${main}_${sub}.json`,JSON.stringify(r.json));
  const items=r.json.data.catalog.flatMap(m=>m.typeSub).find(s=>s.id===sub)?.items||[];
  index.subs[name]=items.map(i=>({itemId:i.itemId,name:i.name,tagIds:i.tagIds,cover:i.brief?.cover,publishedAtTs:i.publishedAtTs}));
  console.log(name,items.length);
  fs.mkdirSync(`raw/skland/${name}`,{recursive:true});
  for(const it of items){
    const f=`raw/skland/${name}/${it.itemId}.json`;
    if(fs.existsSync(f)) continue;
    try{ const d=await get(`/web/v1/wiki/item/info?id=${it.itemId}`); if(d.json.code!==0){console.log('ERR',it.itemId,it.name,d.json.message);continue} fs.writeFileSync(f,JSON.stringify(d.json)); }catch(e){console.log('EXC',it.itemId,e.message)}
    await sleep(350);
  }
}
fs.writeFileSync('raw/skland/index.json',JSON.stringify(index,null,1));
console.log('done');

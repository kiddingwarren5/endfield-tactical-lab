import fs from 'node:fs';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const UA={'User-Agent':'Mozilla/5.0'};
async function list(kind){ const h=await (await fetch(`https://warfarin.wiki/cn/${kind}`,{headers:UA})).text(); return [...new Set([...h.matchAll(new RegExp(`href="/cn/${kind}/([^"]+)"`,'g'))].map(m=>m[1]))]; }
fs.mkdirSync('raw/warfarin',{recursive:true});
const index={fetchedAt:new Date().toISOString()};
for(const kind of ['weapons','operators','gear']){
  const slugs=await list(kind); index[kind]=slugs; console.log(kind,slugs.length);
  fs.mkdirSync(`raw/warfarin/${kind}`,{recursive:true});
  for(const s of slugs){ const f=`raw/warfarin/${kind}/${s}.data`; if(fs.existsSync(f))continue;
    try{ const r=await fetch(`https://warfarin.wiki/cn/${kind}/${s}.data`,{headers:UA}); fs.writeFileSync(f,await r.text()); }catch(e){console.log('EXC',s,e.message)}
    await sleep(250);
  }
}
fs.writeFileSync('raw/warfarin/index.json',JSON.stringify(index,null,1)); console.log('done');

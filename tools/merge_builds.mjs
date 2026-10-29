// 把子代理收集的社区配装 JSON 合并进 sources/curated/builds.json，并把 unmapped / notes 写成 sources/curated/builds.report.md。
// 用法：node tools/merge_builds.mjs a.json b.json …
// 规则：只差一件同套同位配件（或只差「·壹型」这类版本后缀）的视为同一套，来源合并（来源更多的写法为准）；每位干员的方案按来源数从多到少排，第 0 套就是入队默认。
import fs from 'node:fs';
const gear=(await import('../dist/data/gear.js')).default; const setOf=n=>gear.find(g=>g.name===n)?.set||n; const strip=n=>String(n).replace(/·[壹贰叁]型$/,'');
const target='sources/curated/builds.json'; const cur=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):{}; const report=[];
const sameScheme=(a,b)=>{ if(a.weapon!==b.weapon||a.gear.length!==4||b.gear.length!==4) return false; let diff=0; for(let i=0;i<4;i++){ if(strip(a.gear[i])===strip(b.gear[i])) continue; if(setOf(a.gear[i])!==setOf(b.gear[i])) return false; diff++; } return diff<=1; };
const norm=s=>({name:s.name,weapon:s.weapon,weaponAlt:s.weaponAlt||[],gear:s.gear,why:s.why||'',sources:s.sources||[]});
const absorb=(into,s)=>{ const before=into.sources.length; const seen=new Set(into.sources.map(x=>x.url||x.title)); for(const x of s.sources||[]) if(!seen.has(x.url||x.title)) into.sources.push(x); for(const w of s.weaponAlt||[]) if(!into.weaponAlt.includes(w)) into.weaponAlt.push(w); if((s.sources||[]).length>before){ into.name=s.name; into.why=s.why||into.why; into.gear=s.gear; } };
for(const f of process.argv.slice(2)){ const data=JSON.parse(fs.readFileSync(f,'utf8'));
  for(const [name,entry] of Object.entries(data)){ const list=cur[name]||(cur[name]=[]); const fixed=list.length; const fresh=[]; let skipped=0;
    for(const s of entry.schemes||[]){ if(!s.weapon||!Array.isArray(s.gear)||s.gear.length!==4||s.gear.some(x=>typeof x!=='string')){ report.push(`- ${name}：方案「${s.name}」不完整（武器或四件缺失），未合并`); continue; }
      const hit=list.find(x=>sameScheme(x,s))||fresh.find(x=>sameScheme(x,s)); if(hit){ absorb(hit,s); skipped++; continue; } fresh.push(norm(s)); }
    list.push(...fresh); list.sort((a,b)=>b.sources.length-a.sources.length); if(!list.length) delete cur[name];
    report.push(`- ${name}：新增 ${fresh.length} 套，并入已有 ${skipped} 套（已有 ${fixed}）${entry.unmapped?.length?`；对照表里没有：${entry.unmapped.join('、')}`:''}${entry.notes?`；备注：${entry.notes}`:''}`); } }
fs.writeFileSync(target,JSON.stringify(cur,null,1)); fs.writeFileSync('sources/curated/builds.report.md','# 社区配装合并报告\n\n'+report.join('\n')+'\n'); console.log(report.map(r=>r.slice(0,60)).join('\n'));

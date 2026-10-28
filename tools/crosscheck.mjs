// Cross-check official (skland) vs datamine (warfarin) values. Writes docs/data-crosscheck.json and prints a summary.
import fs from 'node:fs';
const sk={ops:JSON.parse(fs.readFileSync('sources/skland/operators.json')),wps:JSON.parse(fs.readFileSync('sources/skland/weapons.json')),gear:JSON.parse(fs.readFileSync('sources/skland/gear.json'))};
const wf={ops:JSON.parse(fs.readFileSync('sources/warfarin/operators.json')),wps:JSON.parse(fs.readFileSync('sources/warfarin/weapons.json')),gear:JSON.parse(fs.readFileSync('sources/warfarin/gear.json'))};
const norm=s=>String(s||'').replace(/\s+/g,'');
const num=s=>{ const m=String(s).replace(/[%+,秒]/g,''); return Number(m); };
const report={operators:[],weapons:[],gear:[],unmatched:{}};
// --- operators: attributes at 1/20/40/60/80/90 ; skill tables vs subDesc per level
const ATTR={生命值:1,攻击力:2,力量:39,敏捷:40,智识:41,意志:42};
for(const o of sk.ops){ const w=wf.ops.find(x=>norm(x.name)===norm(o.name)); if(!w){ (report.unmatched.operators??=[]).push(o.name); continue; }
  const r={name:o.name,attrs:[],skills:[]};
  if(o.attributes){ const lv=o.attributes.header.slice(1).map(h=>Number(h.replace('级',''))); for(const [label,code] of Object.entries(ATTR)){ const offs=o.attributes[label]; if(!offs) continue; lv.forEach((L,i)=>{ const row=w.attributes.find(a=>a.level===L); const v=row?.attrs[code]; const ok=v!=null&&Math.floor(v+1e-9)===num(offs[i]); r.attrs.push({label,level:L,official:num(offs[i]),mined:v,ok}); }); } }
  // skills: compare each official row (12 values) to subDesc entries with same name
  const mined=Object.values(w.skills).flat(); // all levels of all skills
  for(const s of o.skills){ for(const [row,vals] of Object.entries(s.table)){ if(row==='header') continue; const name=norm(row); const matches=mined.filter(l=>l.subDesc.some(d=>norm(d.name)===name)); if(!matches.length){ r.skills.push({skill:s.name,row,status:'no-mined-row'}); continue; } const byLevel={}; for(const l of matches){ const d=l.subDesc.find(d=>norm(d.name)===name); (byLevel[l.level]??=new Set()).add(norm(d.desc)); } const cmp=vals.map((v,i)=>{ const set=byLevel[i+1]; return set?set.has(norm(v)):null; }); r.skills.push({skill:s.name,row,ok:cmp.every(x=>x===true),cmp}); } }
  report.operators.push(r); }
// --- weapons: base atk at 6 levels; skill rank texts vs mined description with blackboard substitution
for(const o of sk.wps){ const w=wf.wps.find(x=>norm(x.name)===norm(o.name)); if(!w){ (report.unmatched.weapons??=[]).push(o.name); continue; }
  const r={name:o.name,baseAtk:[],skills:[]};
  if(o.baseAttack){ const lv=o.baseAttack.header.slice(1).map(h=>Number(h.replace('级',''))); const offs=o.baseAttack['基础攻击力']; lv.forEach((L,i)=>{ const m=w.baseAtk.find(x=>x.lv===L)?.atk; r.baseAtk.push({level:L,official:num(offs[i]),mined:m,ok:m===num(offs[i])}); }); }
  for(const s of o.skills){ const idGuess=w.skillIds.map(id=>w.skills[id]).find(sk=>sk&&sk[0]&&norm(sk[0].name)===norm(s.name)); if(!idGuess){ r.skills.push({skill:s.name,status:'no-mined-skill'}); continue; }
    const cmp=s.ranks.map((rk,i)=>{ const L=idGuess[i]; if(!L) return null; const nums=(rk.text.match(/-?\d+(\.\d+)?/g)||[]).map(Number); const bbNums=Object.values(L.blackboard).filter(v=>typeof v==='number'); const bbAll=new Set(bbNums.flatMap(v=>[v,Math.round(v*1000)/10,Math.round(v*100)])); return nums.every(n=>bbAll.has(n)||bbAll.has(Math.round(n*10)/10)); });
    r.skills.push({skill:s.name,ok:cmp.every(Boolean),cmp}); }
  report.weapons.push(r); }
// --- gear: refine arrays
for(const o of sk.gear){ const w=wf.gear.find(x=>norm(x.name)===norm(o.name)); if(!w){ (report.unmatched.gear??=[]).push(o.name); continue; }
  const r={name:o.name,minedId:w.id,attrs:[]}; const mods=w.equip.displayAttrModifiers||[];
  o.refine.forEach((ref,i)=>{ const m=mods[i]; if(!m){ r.attrs.push({name:ref.name,status:'no-mined-attr'}); return; } const minedVals=[m.attrValue,...m.enhancedAttrValues]; const isPct=ref.values[0].includes('%'); const cmp=ref.values.map((v,j)=>{ const ov=num(v); const mv=isPct?minedVals[j]*100:minedVals[j]; return {official:ov,mined:Math.round(mv*10000)/10000,exact:Math.abs(ov-mv)<1e-6,rounded:Math.abs(ov-Math.round(mv*10)/10)<1e-6||Math.abs(ov-Math.round(mv))<1e-6}; }); r.attrs.push({name:ref.name,pack:m.packAttrType,cmp}); });
  report.gear.push(r); }
fs.writeFileSync('docs/data-crosscheck.json',JSON.stringify(report,null,1));
const cnt=(arr,f)=>arr.reduce((a,x)=>a+f(x),0);
console.log('unmatched',JSON.stringify(report.unmatched));
console.log('operators attrs ok/total',cnt(report.operators,r=>r.attrs.filter(a=>a.ok).length),'/',cnt(report.operators,r=>r.attrs.length));
console.log('operators skill rows ok/total',cnt(report.operators,r=>r.skills.filter(a=>a.ok).length),'/',cnt(report.operators,r=>r.skills.length));
for(const r of report.operators){ const bad=r.skills.filter(s=>!s.ok); const badA=r.attrs.filter(a=>!a.ok); if(bad.length||badA.length) console.log(' ',r.name,'attr mismatches',badA.map(a=>a.label+'@'+a.level+':'+a.official+'vs'+a.mined).join(','),'| skill rows not ok:',bad.map(b=>b.skill+'/'+b.row+(b.status?'('+b.status+')':'')).join(', ')); }
console.log('weapons baseAtk ok/total',cnt(report.weapons,r=>r.baseAtk.filter(a=>a.ok).length),'/',cnt(report.weapons,r=>r.baseAtk.length),'| skill ok/total',cnt(report.weapons,r=>r.skills.filter(a=>a.ok).length),'/',cnt(report.weapons,r=>r.skills.length));
for(const r of report.weapons){ const bad=r.skills.filter(s=>!s.ok); const badA=r.baseAtk.filter(a=>!a.ok); if(bad.length||badA.length) console.log(' ',r.name,'atk',badA.map(a=>a.level+':'+a.official+'vs'+a.mined).join(','),'| skills:',bad.map(b=>b.skill+(b.status?'('+b.status+')':'')).join(', ')); }
let ge=0,gr=0,gt=0; for(const r of report.gear) for(const a of r.attrs) for(const c of a.cmp||[]){ gt++; if(c.exact) ge++; else if(c.rounded) gr++; }
console.log('gear refine values: exact',ge,'rounded-only',gr,'total',gt, 'mismatch',gt-ge-gr);
for(const r of report.gear){ const bad=(r.attrs||[]).filter(a=>a.status||a.cmp.some(c=>!c.exact&&!c.rounded)); if(bad.length) console.log(' ',r.name,JSON.stringify(bad).slice(0,300)); }

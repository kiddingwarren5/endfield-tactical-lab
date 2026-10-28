// Compare logged normal-attack hits (zmdlogs) with engine predictions to measure non-main-control decay. Usage: node tools/log_calibrate.mjs <scratch dir>
import fs from 'node:fs'; import path from 'node:path';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js';
import {getStats} from '../dist/engine/stats.js'; import {skillSegments} from '../dist/engine/skills.js'; import {loadWf} from './wf.mjs';
const dir=process.argv[2]; const all=JSON.parse(fs.readFileSync(path.join(dir,'zmd_all.json')));
const data={operators,weapons,gear,sets,effects:[]};
const ELEM={cryst:'cold',fire:'heat',pulse:'electric',natural:'nature',physical:'physical'};
const resOf=key=>{ try{ const r=loadWf(path.join(dir,`eny_${key}.data`)).data.enemyAttributeTemplateTable; return {cold:r.crystResistance||0,heat:r.fireResistance||0,electric:r.pulseResistance||0,nature:r.naturalResistance||0,physical:r.physicalResistance||0,def:100}; }catch{ return null; } };
const rows=[];
for(const [bid,{battle,events}] of Object.entries(all)){
  const res=resOf(battle.bossKey)||{cold:0,heat:0,electric:0,nature:0,physical:0,def:100,assumed:true};
  const members=battle.roster.map(r=>{ const op=operators.find(o=>o.id===r.characterKey); if(!op) return null; const w=weapons.find(x=>x.id===r.weapon?.weaponTemplate); const sk3=r.weapon?.skills?.find(s=>s.skillKey.startsWith('sk_'))?.level??4; const atkS=r.weapon?.skills?.filter(s=>!s.skillKey.startsWith('sk_')).map(s=>s.level)||[9,9];
    const g={armor:null,gloves:null,kit1:null,kit2:null}; let kits=0; for(const e of r.equips||[]){ const item=gear.find(x=>x.id===e.itemId); const refine=[3,3,3]; for(const l of e.enhanceLevels||[]) refine[l.index-1]=l.level; const slot=e.partName==='护甲'?'armor':e.partName==='护手'?'gloves':(kits++===0?'kit1':'kit2'); g[slot]=item?{id:item.id,refine}:null; }
    const skillRanks={normal:12,skill:12,combo:12,ultimate:12}; for(const s of r.skills||[]){ if(/attack1$/.test(s.skillKey)) skillRanks.normal=s.level; if(/normal_skill$/.test(s.skillKey)) skillRanks.skill=s.level; if(/combo_skill$/.test(s.skillKey)) skillRanks.combo=s.level; if(/ultimate_skill$/.test(s.skillKey)) skillRanks.ultimate=s.level; }
    const m={operatorId:op.id,potential:r.characterPotential||0,skillRanks,weapon:w?{id:w.id,potential:(r.weapon.weaponRefine||1)-1,ranks:[atkS[0]??9,atkS[1]??9,sk3]}:{id:null},gear:g,consumables:[]};
    let stats=null; try{ stats=getStats(m,data); }catch(e){ console.log('stats fail',r.characterName,e.message); }
    return {name:r.characterName,op,m,stats,gearMissing:(r.equips||[]).filter(e=>!gear.find(x=>x.id===e.itemId)).map(e=>e.pieceName)}; });
  const byName=Object.fromEntries(members.filter(Boolean).map(m=>[m.name,m]));
  const buffs=events.filter(e=>e.laneType==='buff'&&e.effects?.length).map(e=>({t0:e.tsMsFromStart,t1:e.tsMsFromStart+(e.durationMs||0),target:e.targetCharacterName,enemy:!e.targetCharacterName,effects:e.effects}));
  // group hits by (ts, member, key)
  // group hits of the same (member, segment) that land within 1.2 s into one segment instance (multi-hit segments)
  const groups={}; const hitsSorted=events.filter(e=>/_attack\d$/.test(e.eventKey||'')&&e.value!=null&&!(e.hitContext?.critical?.isCritical)).sort((a,b)=>a.tsMsFromStart-b.tsMsFromStart); const open={}; for(const e of hitsSorted){ const mk=`${e.sourceCharacterName}|${e.eventKey}`; let g=open[mk]; if(!g||e.tsMsFromStart-g.t>1200){ g={t:e.tsMsFromStart,name:e.sourceCharacterName,key:e.eventKey,el:ELEM[e.damageElement]||'physical',sum:0,n:0}; open[mk]=g; groups[`${e.tsMsFromStart}|${mk}`]=g; } g.sum+=e.value; g.n++; g.tLast=e.tsMsFromStart; }
  for(const gph of Object.values(groups)){ const mb=byName[gph.name]; if(!mb?.stats) continue; const segIdx=Number(gph.key.match(/attack(\d)$/)[1])-1; const segs=skillSegments(mb.op,'normal').filter(s=>!/处决|下落/.test(s.label)); const seg=segs[segIdx]; if(!seg) continue; const ratio=seg.ratio[mb.m.skillRanks.normal-1]/100;
    let inc=0,amp=0,frag=0,vuln=0,atk=0; for(const b of buffs){ if(gph.t<b.t0||gph.t>b.t1) continue; for(const ef of b.effects){ const elOk=ef.element==='all'||ELEM[ef.element]===gph.el||(ef.element==='spell'&&gph.el!=='physical'); if(b.enemy){ if(ef.zone==='fragile'&&elOk) frag+=ef.rate; if(ef.zone==='vuln_taken'&&elOk) vuln+=ef.rate; } else if(b.target===gph.name){ if(ef.zone==='dmg_inc'&&elOk) inc+=ef.rate; if(ef.zone==='amp'&&elOk) amp+=ef.rate; if(ef.zone==='atk') atk+=ef.rate; } } }
    // panel bonuses from gear/weapon already in stats; add elemental gear bonus as dmg_inc
    const b=mb.stats.bonuses||{}; const gearInc=((gph.el==='cold'||gph.el==='electric')?(b.coldElecDmg||0):0)+((gph.el==='heat'||gph.el==='nature')?(b.heatNatureDmg||0):0)+(gph.el==='physical'?(b.physicalDmg||0):0)+(gph.el!=='physical'?(b.artsDmg||0):0)+(b.normalDmg||0)+Object.entries(b).filter(([k])=>k.startsWith('elem:')).reduce((a,[k,v])=>a+(({寒冷:'cold',灼热:'heat',电磁:'electric',自然:'nature',物理:'physical'})[k.slice(5)]===gph.el||(k.slice(5)==='法术'&&gph.el!=='physical')?v:0),0);
    const panel=Math.floor(mb.stats.atk.raw*(1+atk));
    const expected=panel*ratio*(1+(gearInc/100)+inc)*(1+amp)*(1+frag)*(1+vuln)*(100/(100+res.def))*(1-(res[gph.el]||0)/100);
    rows.push({bid,boss:battle.bossName,t:gph.t/1000,name:gph.name,key:gph.key.replace(/.*_/,''),hits:gph.n,logged:gph.sum,expected:Math.round(expected),r:gph.sum/expected,inc,amp,frag,vuln,atkBuff:atk,panel,gearMissing:mb.gearMissing}); }
}
fs.writeFileSync(path.join(dir,'calibration.json'),JSON.stringify(rows,null,1));
// summary per member per log
const byKey={}; for(const r of rows){ (byKey[`${r.bid.slice(-6)} ${r.name}`]??=[]).push(r.r); }
const med=a=>{ const s=[...a].sort((x,y)=>x-y); return s[Math.floor(s.length/2)]; };
const hist=a=>{ const bins=[0.25,0.5,0.75,0.9,1.1,1.3,1.6,2,3,99]; const c=new Array(bins.length).fill(0); for(const x of a){ const i=bins.findIndex(b=>x<b); c[i<0?bins.length-1:i]++; } return bins.map((b,i)=>`<${b}:${c[i]}`).join(' '); };
for(const [k,v] of Object.entries(byKey)){ console.log('   hist',hist(v)); const s=[...v].sort((x,y)=>x-y); const q=p=>s[Math.min(s.length-1,Math.floor(p*s.length))]; const near1=v.filter(x=>x>0.9&&x<1.12).length; console.log(k.padEnd(16),'n',String(v.length).padStart(4),'median',med(v).toFixed(3),'p10',q(0.1).toFixed(3),'p90',q(0.9).toFixed(3),'near1',near1,'gearMissing',rows.find(r=>k.endsWith(r.name)&&r.bid.endsWith(k.slice(0,6)))?.gearMissing?.join('/')||''); }

// ---- cross design: δ² = [R(log A, non-control X)/R(log A, control Y)] × [R(log B, non-control Y)/R(log B, control X)]
const medOf=(bid,name)=>{ const v=rows.filter(r=>r.bid.endsWith(bid)&&r.name===name).map(r=>r.r); return v.length?med(v):null; };
const pairs=[['638f80','祀','诀'],['3fd54f','诀','祀']]; // [log, control, non-control]
let prod=1, ok=true; for(const [bid,ctrl,non] of pairs){ const a=medOf(bid,ctrl), b=medOf(bid,non); console.log(`log ${bid}: control ${ctrl} R=${a?.toFixed(3)} (n=${rows.filter(r=>r.bid.endsWith(bid)&&r.name===ctrl).length}), non-control ${non} R=${b?.toFixed(3)} (n=${rows.filter(r=>r.bid.endsWith(bid)&&r.name===non).length}), ratio non/control=${(b/a).toFixed(3)}`); if(!a||!b) ok=false; else prod*=b/a; }
if(ok) console.log('δ² =',prod.toFixed(3),'→ δ ≈',Math.sqrt(prod).toFixed(3));

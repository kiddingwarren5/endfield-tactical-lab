// 社区标答轴 vs 自动排轴：同一编队、同一窗口（标答自然结束的时长）、同样预算。结果写 docs/rotations-community.md。
// 用法：node tools/compare_rotations.mjs [--budget 30000] [--only 队名]
import fs from 'node:fs';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import mechanics from '../dist/data/mechanics.js'; import timing from '../dist/data/timing.js'; import {scenarios} from '../dist/data/rotations.js'; import {DEFAULT_BUILDS} from '../dist/data/builds.js';
import {resolveRotation,autoRotation,buildTeam,sumHits} from '../dist/engine/sim/rotation.js';
const args=process.argv.slice(2); const opt=(k,d)=>{ const i=args.indexOf(k); return i>=0?args[i+1]:d; }; const budget=Number(opt('--budget',30000)); const only=opt('--only',null);
const data={operators,weapons,gear,sets,effects}; const ctx={data,mechanics,timing,enemy:{defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{},attackInterval:4}};
const list=JSON.parse(fs.readFileSync('sources/curated/rotations-community.json','utf8')).filter(r=>!only||r.name===only);
const rows=[]; const fmt=n=>Math.round(n).toLocaleString('zh-CN');
for(const r of list){ const members=r.members.map(n=>{ const b=DEFAULT_BUILDS[n]?.[0]; if(!b) throw new Error(n+' 没有默认配装'); return {op:n,weapon:b.weapon,gear:b.gear,potential:r.potentials?.[n]||0}; });
  const preset={id:'community:'+r.name,name:r.name,team:{members,mainControl:r.mainControl,initial:{sp:200,energy:r.fullEnergy?[400,400,400,400]:[0,0,0,0]}},steps:r.steps.map(s=>({m:s.m,k:s.k,seg:1,why:s.note||'',...(s.wait?{wait:s.wait,waitElement:s.waitElement}:{}),...(s.stage?{stage:s.stage}:{})}))};
  /* 开局能量满的案例（危境再现 Boss）：场景里的 initial 覆盖预设，所以要造一个满能量、不限时的场景 */
  const scenario=r.fullEnergy?{...scenarios[0],id:'target-full',name:'对照靶（开局能量满）',initial:{sp:200,energy:[999,999,999,999]}}:scenarios[0]; const ref=resolveRotation(preset,ctx,scenario,false,null,{maxWait:8}); /* 等 8 s 放不出就跳过：放不出的步骤说明编码或模拟器对不上，记跳过数，不用 30 s 把窗口拉长 */ const mc=ref.input.mainControl; const W=Math.max(30,Math.min(120,Math.ceil(ref.end)));
  const refS=sumHits(ref.main,{until:W,mainControl:mc,guaranteed:true})/W; const team=buildTeam(preset,data); const t0=Date.now(); const auto=autoRotation(team,mc,ctx,scenario,{horizon:W,budgetMs:budget}); const autoS=sumHits(auto.main,{until:W,mainControl:mc,guaranteed:true})/W;
  const unmodeled=[...new Set(ref.main.events.filter(e=>e.type==='note'&&/未建模/.test(e.message)).map(e=>e.message.replace(/（见.*$/,'')))];
  const row={name:r.name,members:r.members.join(' / '),mc:r.mainControl,W,refS,autoS,ratio:autoS/refS,skipped:ref.skipped.length,video:/视频逐帧/.test(r.name),unmodeled,ms:Date.now()-t0,autoUlts:auto.main.events.filter(e=>e.type==='cast'&&e.kind==='ultimate').map(e=>e.who+' '+e.t.toFixed(1)).join('、'),refUlts:ref.main.events.filter(e=>e.type==='cast'&&e.kind==='ultimate').map(e=>e.who+' '+e.t.toFixed(1)).join('、')}; rows.push(row);
  console.log(`${r.name}: 窗口 ${W}s · 标答 ${fmt(refS)}（跳过 ${row.skipped} 步）· 自动 ${fmt(autoS)} · 比值 ${(row.ratio*100).toFixed(1)}% · ${Math.round(row.ms/1000)}s${unmodeled.length?' · 未建模：'+unmodeled.join('；'):''}`); }
const verdict=r=>!r.video?'文字轴，只做结构参考':r.unmodeled.length?'模拟器未建模，比值无效':r.skipped?`标答跳过 ${r.skipped} 步，编码或模拟器对不上`:'可比';
const md=['# 社区标答轴 vs 自动排轴（生成文件：tools/compare_rotations.mjs）','',`预算 ${budget/1000} 秒；窗口 = 标答自然结束时长（等 8 秒放不出的步骤跳过）；指标 = 窗口内保底每秒（主控普攻 + 全员技能）。标答按来源顺序在最早可行时刻解码，配装用默认配装第 0 套，潜能按来源。只有“可比”行的比值有意义。`,'','| 队伍 | 编队 | 主控 | 窗口 | 标答每秒 | 自动每秒 | 比值 | 标答跳过 | 结论 | 标答终结技 | 自动终结技 |','|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map(r=>`| ${r.name} | ${r.members} | ${r.mc} | ${r.W}s | ${fmt(r.refS)} | ${fmt(r.autoS)} | ${(r.ratio*100).toFixed(1)}% | ${r.skipped} | ${verdict(r)}${r.unmodeled.length?'：'+r.unmodeled.join('；'):''} | ${r.refUlts} | ${r.autoUlts} |`)];
fs.writeFileSync('docs/rotations-community.md',md.join('\n')+'\n'); console.log('写入 docs/rotations-community.md');

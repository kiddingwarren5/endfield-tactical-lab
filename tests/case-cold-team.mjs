// 重点编队回归案例（批次 8.4）：别礼 / 汤汤 / 祀 / 诀。输出 docs/cases/regression-cold-team.md。不把任何一条当作预设最优。
import fs from 'node:fs';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js'; import meta from '../dist/data/meta.js';
import {simulate} from '../dist/engine/sim/simulate.js'; import {autoPlan,cycleOf,greedySchedule} from '../dist/engine/sim/plan.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n); const G=n=>gear.find(g=>g.name===n).id; const W=n=>weapons.find(w=>w.name===n).id;
const mk=(name,w,gearNames,pot=0)=>({operatorId:op(name).id,potential:pot,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:W(w),potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:G(gearNames[0]),refine:[3,3,3]},gloves:{id:G(gearNames[1]),refine:[3,3,3]},kit1:{id:G(gearNames[2]),refine:[3,3,3]},kit2:{id:G(gearNames[3]),refine:[3,3,3]}},consumables:[]});
const bieli=mk('别礼','赫拉芬格',['涌浪重装甲','潮涌手甲','悬河供氧栓','生物辅助护板']);
const tang=mk('汤汤','落草',['涌浪重装甲','潮涌手甲','悬河供氧栓','悬河供氧栓']);
const si=mk('祀','玉中身',['长息改装护甲','长息导能护手','长息测距仪','长息重护板'],3);
const jue=mk('诀','四二式·肃阵',['长息改装护甲','长息导能护手','长息测距仪','长息重护板']);
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const base=(team,mainControl=0)=>({team,data,mechanics,timing,enemy,mainControl,initial:{sp:200,energy:[0,0,0,0]}});
const run=(input,timeline,duration)=>{ const r=simulate({...input,timeline,params:{duration}}); const lo=simulate({...input,timeline,params:{duration,damageFactor:0.5,rhythmFactor:0.6}}); const hi=simulate({...input,timeline,params:{duration,damageFactor:1,rhythmFactor:1}}); return {r,lo,hi}; };
const fmt=n=>Math.round(n).toLocaleString('zh-CN');
const lines=[]; const L=x=>lines.push(x);
L(`# 回归案例：别礼 / 汤汤 / 祀 / 诀（寒冷队）\n\n生成：${new Date().toISOString()} · 数据 ${meta.dataVersion} · 由 tests/case-cold-team.mjs 生成（可复现）。\n\n配置：全员 90 级，技能专精 3，别礼/汤汤/诀 0 潜，祀 3 潜；武器 0 潜（第三技能 Rank4）；装备见脚本；对照靶防御 100、抗性 0、不暴击、永不失衡。\n\n**本案例证明的是模型行为（简化时序假设下），不是实战结果。** 误差来源：非主控普攻衰减 δ∈[0.5,1] 与节奏 φ∈[0.6,1]（无实测）、普攻段时长/技能前后摇为假设表、连携窗口 5s 与附着 20s 为单一来源、汤汤涡流返还与祀墨魂未建模。\n`);
// Scenario 1: 别礼 combo immediately at 3 layers vs wait for 4 layers. Layers: 汤汤 skill(1) → 祀 skill(1) → 别礼 skill→heavy phantom(1) → 汤汤 skill again(1)
const teamA=[jue,bieli,tang,si]; // 诀 01号位（GK 祀攻略推荐），主控别礼
const inputA=base(teamA,1);
// 文字轴（顺序）→ 最早可行时刻（greedySchedule）；立即版：3 层即连携；等 4 层版：多一次汤汤战技
const orderImmediate=[{member:2,kind:'skill'},{member:3,kind:'skill'},{member:1,kind:'skill'},{member:1,kind:'combo'},{member:3,kind:'combo'},{member:0,kind:'skill'},{member:0,kind:'combo'}];
const orderWait4=[{member:2,kind:'skill'},{member:3,kind:'skill'},{member:1,kind:'skill'},{member:2,kind:'skill'},{member:1,kind:'combo',waitFor:{attachLayers:{element:'cold',min:4}}},{member:3,kind:'combo'},{member:0,kind:'skill'},{member:0,kind:'combo'}];
const gI=greedySchedule(inputA,orderImmediate), gW=greedySchedule(inputA,orderWait4); const tlImmediate=gI.timeline, tlWait4=gW.timeline;
const s1a=run(inputA,tlImmediate,30), s1b=run(inputA,tlWait4,30);
const layersAt=(sim,t)=>{ const ev=sim.events.filter(e=>e.type==='consume'&&Math.abs(e.t-t)<2); return ev.map(e=>e.layers).join('/')||'—'; };
L(`排程说明：${gI.notes.concat(gW.notes).join('；')||'两条轴均按最早可行时刻安排'}。立即版：${tlImmediate.map(a=>a.t+'s m'+a.member+a.kind).join(' → ')}；等 4 层版：${tlWait4.map(a=>a.t+'s m'+a.member+a.kind).join(' → ')}`);
L(`## 场景 1：别礼连携立即放（3 层）vs 等 4 层\n\n| 轴 | 30s 总伤（δ=0.75,φ=0.8） | 区间 | 别礼连携消耗层数 | 不可执行 |\n|---|---|---|---|---|\n| 立即（${tlImmediate.find(a=>a.member===1&&a.kind==='combo')?.t}s 连携） | ${fmt(s1a.r.summary.total)} | ${fmt(s1a.lo.summary.total)}–${fmt(s1a.hi.summary.total)} | ${layersAt(s1a.r,7)} | ${s1a.r.errors.map(e=>e.message).join('；')||'无'} |\n| 等 4 层（${tlWait4.find(a=>a.member===1&&a.kind==='combo')?.t}s 连携） | ${fmt(s1b.r.summary.total)} | ${fmt(s1b.lo.summary.total)}–${fmt(s1b.hi.summary.total)} | ${layersAt(s1b.r,10)} | ${s1b.r.errors.map(e=>e.message).join('；')||'无'} |\n\n别礼连携能量：40+15×层数（官方）；斩击倍率 160%+240%×层数（专精3，官方）。等第 4 层需要额外一次施加附着的动作（本例为汤汤第二次战技，多花 100 技力）。\n`);
// Scenario 3: auto plan
const t0=Date.now(); const plan=autoPlan(inputA,{beam:8,step:1,horizon:90}); const dt=Date.now()-t0;
const cycEnd=plan.best.score.complete?plan.best.score.until:90; const pr=run(inputA,plan.best.timeline,cycEnd);
L(`## 场景 3：自动排轴（束搜索，束宽 8，步长 1s，时限 90s，耗时 ${dt}ms）\n\n目标：${plan.objective}\n\n最佳轴：${plan.best.timeline.map(a=>`${a.t}s ${operators.find(o=>o.id===teamA[a.member].operatorId).name}${({skill:'战技',combo:'连携',ultimate:'终结技',switch:'切主控'})[a.kind]}`).join(' → ')}\n\n周期：${plan.best.score.complete?plan.best.score.until.toFixed(1)+'s':'未完成'}；周期内 DPS ${fmt(plan.best.score.dps)}；总伤 ${fmt(plan.best.score.total)}；复现区间（至周期末）${fmt(pr.lo.summary.total)}–${fmt(pr.hi.summary.total)}；复现错误：${pr.r.errors.length}\n\n理由：${plan.rationale.join('；')}\n\n对照候选：\n${plan.candidates.map((c,i)=>`- #${i+2} DPS ${fmt(c.score.dps)}：新增 ${c.diff.added.join('、')||'无'}；去掉 ${c.diff.removed.join('、')||'无'}`).join('\n')}\n`);
// Scenario 2: 祀 ult refresh target — same planned rotation, 诀 at 01 vs 别礼 at 01 (member indices remapped)
const remap={0:1,1:0,2:2,3:3}; // teamA=[诀,别礼,汤汤,祀] → teamB=[别礼,诀,汤汤,祀]
const teamB=[bieli,jue,tang,si]; const inputB=base(teamB,0);
const tl2A=plan.best.timeline; const tl2=plan.best.timeline.map(a=>({...a,member:remap[a.member]}));
const s2b=run(inputA,tl2A,cycEnd), s2a=run(inputB,tl2,cycEnd);
const cdrEv=sim=>sim.events.filter(e=>e.type==='cdr'&&e.by).map(e=>`${e.t}s ${e.who} 连携冷却 ${e.before}→${e.after}`).join('；')||'无';
L(`## 场景 2：祀终结技“01 号位连携冷却 −20s”作用对象（同一条轴，调换 01 号位）\n\n| 编队顺序（01 号位） | ${cycEnd.toFixed(1)}s 总伤 | 区间 | 冷却刷新事件 | 不可执行 |\n|---|---|---|---|---|\n| 诀在 01 | ${fmt(s2b.r.summary.total)} | ${fmt(s2b.lo.summary.total)}–${fmt(s2b.hi.summary.total)} | ${cdrEv(s2b.r)} | ${s2b.r.errors.map(e=>e.message).join('；')||'无'} |\n| 别礼在 01 | ${fmt(s2a.r.summary.total)} | ${fmt(s2a.lo.summary.total)}–${fmt(s2a.hi.summary.total)} | ${cdrEv(s2a.r)} | ${s2a.r.errors.map(e=>e.message).join('；')||'无'} |\n\n祀终结技能量 80（潜能 4 可 −15%）；祀 3 潜使增幅 36%→43.2%（修正折叠）。刷新对象不同会改变随后别礼/诀连携的可用时刻；本例同一条轴下的差异即来自此。\n`);
L(`## 守恒检查\n\n- 总伤 = 逐击之和：${[s1a,s1b,s2a,s2b,pr].every(x=>Math.abs(x.r.hits.reduce((a,h)=>a+h.damage,0)-x.r.summary.total)<1e-6)?'通过':'失败'}\n- 占比和 = 100%：${[s1a,s2a,pr].every(x=>Math.abs(Object.values(x.r.summary.perMember).reduce((a,b)=>a+b,0)-x.r.summary.total)<1e-6)?'通过':'失败'}\n- 技力不超过 300、能量不超过上限：${[s1a,s1b,s2a,s2b,pr].every(x=>x.r.samples.every(s=>s.sp<=300+1e-6)&&x.r.events.every(e=>!e.energy||e.energy.every((v,i)=>v<=x.r.summary.energyMax[i]+1e-6)))?'通过':'失败'}\n`);
fs.mkdirSync('docs/cases',{recursive:true}); fs.writeFileSync('docs/cases/regression-cold-team.md',lines.join('\n')); console.log(lines.join('\n').slice(0,3500));

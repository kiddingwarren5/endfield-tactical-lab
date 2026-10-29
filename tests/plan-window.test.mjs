// 排轴目标：固定窗口内的保底伤害 / 窗口；搜索后的整理不降分。
import test from 'node:test'; import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import mechanics from '../dist/data/mechanics.js'; import timing from '../dist/data/timing.js'; import rotations from '../dist/data/rotations.js';
import {evalSequence,polishSequence} from '../dist/engine/sim/plan.js'; import {buildTeam} from '../dist/engine/sim/rotation.js';
const data={operators,weapons,gear,sets,effects}; const team=buildTeam(rotations[0],data); const names=team.map(m=>operators.find(o=>o.id===m.operatorId).name);
const input={team,data,mechanics,timing,enemy:{defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{},attackInterval:4},mainControl:1,initial:{sp:200,energy:[0,0,0,0]},params:{},names};
const seq=[{member:3,kind:'skill'},{member:2,kind:'combo'},{member:1,kind:'skill'},{member:0,kind:'combo'},{member:2,kind:'skill'},{member:1,kind:'combo'},{member:3,kind:'combo'}];
test('评价口径：窗口内保底伤害（主控普攻 + 全员技能）除以窗口长度，不按终结技周期',()=>{
  const W=40; const r=evalSequence(input,seq,{horizon:W}); const dmg=r.sim.hits.filter(h=>h.t<=W+1e-6&&!(h.kind==='normal'&&h.member!==1)).reduce((a,h)=>a+h.damage,0);
  assert.ok(dmg>0); assert.ok(Math.abs(r.sc.dps-dmg/W)<1e-6,`${r.sc.dps} vs ${dmg/W}`); assert.equal(r.sc.until,W);
  const r2=evalSequence(input,seq,{horizon:80}); assert.notEqual(r2.sc.dps,r.sc.dps,'窗口变了分值应变');
});
test('整理：分值不低于整理前；多余的连携（放不出来的）会被删掉',()=>{
  const W=40; const padded=[{member:0,kind:'combo'},...seq,{member:0,kind:'combo'},{member:0,kind:'combo'}]; const before=evalSequence(input,padded,{horizon:W}).score;
  const p=polishSequence(input,padded,{horizon:W,maxEvals:200}); assert.ok(p.score.dps>=before-1e-9,`${p.score.dps} < ${before}`); assert.ok(p.removed>=1,'应至少删掉一个无用动作');
});
test('“等”是动作：等几秒会推迟后面的动作，等层数要等附着叠够',()=>{
  const W=40; const base=evalSequence(input,[{member:3,kind:'skill'},{member:2,kind:'combo'}],{horizon:W}); assert.ok(base.timeline[1].t<base.timeline[0].t+4,'不等的话连携应在 4 秒内放出');
  /* 等 n 秒从上一个动作放出的时刻起算 */
  const waited=evalSequence(input,[{member:3,kind:'skill'},{kind:'wait',seconds:4},{member:2,kind:'combo'}],{horizon:W}); assert.ok(waited.timeline[1].t>=waited.timeline[0].t+4-1e-6,`${waited.timeline[1].t} < ${waited.timeline[0].t+4}`); assert.equal(waited.skipped,0);
  const layered=evalSequence(input,[{member:3,kind:'skill'},{member:2,kind:'skill'},{kind:'wait',layers:2},{member:0,kind:'combo'}],{horizon:W}); const combo=layered.timeline.find(a=>a.member===0&&a.kind==='combo'); const attach2=layered.sim.events.find(e=>e.type==='attach'&&e.layers>=2); assert.ok(combo&&attach2&&combo.t>=attach2.t-1e-6,'连携要在附着到 2 层之后');
});
test('按住：动作带 minT 就不早于那个时刻放，解码仍可执行',()=>{
  const W=40; const base=evalSequence(input,[{member:3,kind:'skill'},{member:2,kind:'combo'}],{horizon:W}); const t0=base.timeline[1].t;
  /* 汤汤连携要在被施加寒冷附着后 5 秒内放，所以只能按住 3 秒 */
  const held=evalSequence(input,[{member:3,kind:'skill'},{member:2,kind:'combo',minT:t0+3}],{horizon:W}); assert.ok(held.timeline[1].t>=t0+3-1e-6,`${held.timeline[1].t} < ${t0+3}`); assert.equal(held.skipped,0); assert.equal(held.timeline[1].idx,1);
});
import {evalPlan,localSearchPlan,anchorsOf} from '../dist/engine/sim/search.js';
test('显式时刻计划：动作在指定时刻放；不可行就顺延，超过上限放弃而不是报错',()=>{
  const W=40; const e=evalPlan(input,[{member:3,kind:'skill',t:0},{member:2,kind:'skill',t:10}],{horizon:W});
  assert.equal(e.executed.length,2); assert.ok(e.executed[1].t>=10-1e-6&&e.executed[1].t<10+6,'战技应在 10 秒后、顺延上限内放出'); assert.equal(e.sim.errors.length,0);
  const bad=evalPlan(input,[{member:1,kind:'ultimate',t:0}],{horizon:W}); assert.equal(bad.executed.length,0); assert.equal(bad.skipped,1); assert.equal(bad.sim.errors.length,0);
  const both=evalPlan(input,[{member:3,kind:'skill',t:5},{member:2,kind:'skill',t:5}],{horizon:W}); assert.equal(both.executed.length,2); assert.ok(Math.abs(both.executed[0].t-both.executed[1].t)<1e-6,'不同成员同一时刻可以同时放');
});
test('事件锚点来自模拟事件，都落在窗口内',()=>{ const e=evalPlan(input,[{member:3,kind:'skill',t:0},{member:2,kind:'combo',t:1}],{horizon:40}); const an=anchorsOf(e.sim,40,{ultimate:3}); assert.ok(an.length>=2); assert.ok(an.every(t=>t>=0&&t<=40)); });
test('迭代局部搜索：结果不低于种子；同一随机种子结果一致；诊断量齐全',()=>{
  const seed=[{member:3,kind:'skill',t:0},{member:2,kind:'combo',t:1},{member:1,kind:'skill',t:1.5}]; const e0=evalPlan(input,seed,{horizon:40}).score;
  const a=localSearchPlan(input,{horizon:40,budgetMs:3000,maxEvals:150,seeds:[seed],seed:3}); const b=localSearchPlan(input,{horizon:40,budgetMs:3000,maxEvals:150,seeds:[seed],seed:3});
  assert.ok(a.score.dps>=e0-1e-9); assert.deepEqual(a.timeline,b.timeline); assert.ok(a.diag.evals>0&&a.diag.legalRatio>=0&&a.diag.ops.moveTime);
});

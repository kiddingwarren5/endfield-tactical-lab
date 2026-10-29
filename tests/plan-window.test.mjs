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
  const p=polishSequence(input,padded,{horizon:W,maxEvals:200}); assert.ok(p.score.dps>=before-1e-9,`${p.score.dps} < ${before}`); assert.ok(p.sequence.length<=padded.length); assert.ok(p.removed>=1,'应至少删掉一个无用动作');
});

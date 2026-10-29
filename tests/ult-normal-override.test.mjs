// 终结技期间强化普攻（通用机制 normalOverride）：伊冯 / 莱万汀 / 庄方宜 只加数据。
import test from 'node:test'; import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import mechanics from '../dist/data/mechanics.js'; import timing from '../dist/data/timing.js';
import {simulate} from '../dist/engine/sim/simulate.js'; import {newMember,applyDefaultBuild} from '../dist/app/state.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n); const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{},attackInterval:0};
const solo=(name,timeline,extra={})=>{ const m=newMember(op(name).id); applyDefaultBuild(m); return simulate({team:[m],data,mechanics,timing,enemy,mainControl:0,initial:{sp:300,energy:[999]},timeline,params:{duration:30},...extra}); };
test('伊冯：终结技 7 秒内普攻打 20% 段；结束时打 300% 重击；无冻结不追加 600%',()=>{
  const r=solo('伊冯',[{t:0.5,member:0,kind:'ultimate'}]); const ult=r.hits.filter(h=>h.kind==='ultimate'); assert.ok(ult.length>=3,'应有多次强化普攻');
  const labels=[...new Set(ult.map(h=>h.label))]; assert.ok(labels.includes('普通攻击伤害倍率')&&labels.includes('强力攻击伤害倍率'),labels.join(','));
  assert.ok(!labels.includes('额外攻击伤害倍率'),'目标未冻结不应追加'); const endT=0.5+3+7; const fh=ult.find(h=>h.label==='强力攻击伤害倍率'); assert.ok(Math.abs(fh.t-endT)<0.2,`重击应在终结技结束时 ${fh.t} vs ${endT}`);
  const plain=r.hits.filter(h=>h.kind==='normal'&&h.t>3.5&&h.t<endT-0.1); assert.equal(plain.length,0,'终结技期间不应再打普通普攻段');
});
test('伊冯：目标冻结时结束重击追加 600% 并消耗冻结',()=>{
  /* 汤汤先挂寒冷，伊冯战技在终结技快结束时冻结目标，结束重击追加 */
  const m1=newMember(op('伊冯').id), m2=newMember(op('汤汤').id); applyDefaultBuild(m1); applyDefaultBuild(m2);
  const r=simulate({team:[m1,m2],data,mechanics,timing,enemy,mainControl:0,initial:{sp:400,energy:[999,0]},timeline:[{t:0.5,member:0,kind:'ultimate'},{t:6,member:1,kind:'skill'},{t:8,member:0,kind:'skill'}],params:{duration:20}}); const frz=r.events.find(e=>e.type==='abnormal'&&e.which==='freeze'); assert.ok(frz,'战技应先施加冻结'); assert.ok(frz.t<10.5,'冻结要在终结技结束前');
  const ex=r.hits.find(h=>h.label==='额外攻击伤害倍率'); assert.ok(ex,'冻结目标应追加'); assert.ok(r.events.some(e=>e.type==='consumeAbnormal'&&e.which==='freeze'),'应消耗冻结');
});
test('莱万汀：强化普攻四段循环，第 3 段施加灼热附着；施放时不再一次性打四段',()=>{
  const r=solo('莱万汀',[{t:0.5,member:0,kind:'ultimate'}]); const ult=r.hits.filter(h=>h.kind==='ultimate'); const seq=ult.slice(0,8).map(h=>h.label); assert.deepEqual(seq.slice(0,4),['强化普攻第一段倍率','强化普攻第二段倍率','强化普攻第三段倍率','强化普攻第四段倍率']);
  const at=r.events.filter(e=>e.type==='attach'&&e.element==='heat'); assert.ok(at.length>=1); assert.ok(Math.abs(at[0].t-ult[2].t)<1e-6,'附着应在第 3 段命中时');
  assert.ok(!ult.some(h=>Math.abs(h.t-(0.5+3*0.8))<1e-3&&ult.filter(x=>Math.abs(x.t-h.t)<1e-3).length>=4),'施放时不应一次性打四段');
});
test('庄方宜：终结技期间普攻三段循环，不在施放时一次性结算',()=>{
  const r=solo('庄方宜',[{t:0.5,member:0,kind:'ultimate'}]); const ult=r.hits.filter(h=>h.kind==='ultimate'); assert.ok(ult.length>=6); const ts=[...new Set(ult.map(h=>h.t))]; assert.ok(ts.length>=6,'应分布在多个时刻');
});

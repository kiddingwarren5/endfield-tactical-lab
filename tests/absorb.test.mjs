// 连携的"吸收"窗口（mechanics.combo.absorb）：墨龙在场时施加到目标的寒冷/灼热附着被吸收，不叠层，计入终击层数；潜能"视为额外 N 层"（layersAddByPotential）。
import {test} from 'node:test'; import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js';
import {simulate} from '../dist/engine/sim/simulate.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n);
const W=n=>weapons.find(w=>w.name===n)?.id;
const mk=(name,potential=0,w=null)=>({operatorId:op(name).id,potential,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:'auto',weapon:{id:w?W(w):null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const run=(team,timeline,o={})=>simulate({team,data,mechanics,timing,enemy,mainControl:0,initial:{sp:900,energy:o.energy||[0,0,0,0]},timeline,params:{duration:o.duration||14,controlUptime:1,mainAutoNormal:false},options:{}});
// 汤汤战技三次 + 祀战技 = 4 层寒冷；别礼连携消耗 4 层 → 祀连携可发动，层数 4
const base=[{t:0,member:1,kind:'skill'},{t:2,member:1,kind:'skill'},{t:4,member:1,kind:'skill'},{t:6,member:0,kind:'skill'},{t:8,member:2,kind:'combo'},{t:8.5,member:0,kind:'combo'}];
const siHit=r=>r.hits.find(h=>h.name==='祀'&&h.skill==='combo');

test('祀连携：终击在施放后 1.63 s，层数 = 最近一次被消耗的层数（4）',()=>{
  const r=run([mk('祀'),mk('汤汤'),mk('别礼')],base); const h=siHit(r); assert.ok(h,'祀连携命中'); assert.ok(Math.abs(h.t-(8.5+1.63))<0.02,`终击时刻 ${h.t}`); assert.equal(Math.round(h.factors.ratio*100),750+100*4); });

test('墨龙在场时施加的寒冷附着被吸收：不叠层、计入终击（4+1）；窗口外照常叠层',()=>{
  const r=run([mk('祀'),mk('汤汤'),mk('别礼')],[...base,{t:9.0,member:1,kind:'skill'}]);
  const ab=r.events.find(e=>e.type==='absorb'); assert.ok(ab&&ab.absorber==='祀'&&ab.layers===1,`吸收事件 ${JSON.stringify(ab)}`);
  assert.ok(!r.events.some(e=>e.type==='attach'&&e.t>9&&e.t<10.2),'窗口内没有叠层');
  assert.equal(Math.round(siHit(r).factors.ratio*100),750+100*5);
  const r2=run([mk('祀'),mk('汤汤'),mk('别礼')],[...base,{t:10.5,member:1,kind:'skill'}]); assert.ok(r2.events.some(e=>e.type==='attach'&&e.t>10.5),'窗口外正常叠层'); assert.equal(Math.round(siHit(r2).factors.ratio*100),750+100*4); });

test('潜能 5 视为额外 1 层',()=>{
  const r=run([mk('祀',5),mk('汤汤'),mk('别礼')],base); assert.equal(Math.round(siHit(r).factors.ratio*100),Math.round((750+100*5)*1.15)); });

test('潜能 2「入木三分」在连携施放时按当时层数触发：攻击力 +(8+3×4)%，连携自身 1.63 s 后的终击吃到',()=>{
  const r=run([mk('祀',2),mk('汤汤'),mk('别礼')],base); const b=r.events.find(e=>e.type==='buffStart'&&e.id==='chr_0036_jsspsi.pot2.atk');
  assert.ok(b&&Math.abs(b.t-8.5)<0.02,`施放时刻触发 ${JSON.stringify(b)}`); assert.equal(Math.round(b.value),20);
  const h0=siHit(run([mk('祀',0),mk('汤汤'),mk('别礼')],base)); const h=siHit(r); assert.ok(h.factors.attack>h0.factors.attack*1.05,`终击攻击力应含潜能 2 加成：潜 0 ${h0.factors.attack} 潜 2 ${h.factors.attack}`); });

test('含吸收的连携条件被吸收点亮：卡缪战技的灼热附着落进墨龙窗口 → 吸收事件为灼热、卡缪连携就绪',()=>{
  const team=[mk('祀'),mk('汤汤'),mk('别礼'),mk('卡缪')]; const r=run(team,[...base,{t:9.0,member:3,kind:'skill'}]);
  const ab=r.events.find(e=>e.type==='absorb'&&e.element==='heat'); assert.ok(ab,`应有灼热吸收事件 ${JSON.stringify(r.events.filter(e=>e.type==='absorb'))}`);
  const ready=r.events.filter(e=>e.type==='comboReady'&&e.who==='卡缪'); assert.ok(ready.length>=1&&Math.abs(ready.at(-1).t-ab.t)<0.02,`卡缪连携应在吸收时刻就绪 ${JSON.stringify(ready)}`);
  assert.ok(!ready.some(e=>e.t<ab.t-0.02),'吸收之前不应就绪'); });

test('玉中身「下个连携技伤害」在终结技后武装、在连携的延迟终击（施放后 1.63 s）上结算并消耗，不是在施放时',()=>{
  const r=run([mk('祀',0,'玉中身'),mk('汤汤'),mk('别礼')],[{t:0.2,member:0,kind:'ultimate'},...base],{energy:[300,0,0,0]});
  const h=siHit(r); assert.ok(h.applied.some(a=>a.id==='wpn_claym_0018.p3'),'终击应计入玉中身 p3');
  const end=r.events.find(e=>e.type==='buffEnd'&&e.id==='wpn_claym_0018.p3'); assert.ok(end&&Math.abs(end.t-h.t)<0.02,`p3 应在终击时刻消耗 ${JSON.stringify(end)} 终击 ${h.t}`); });

test('被吸收的附着仍触发施加者侧"施加附着后"效果（假设，verification-needed 87）：卡缪灯火使命 p2 在墨龙窗口内照常触发',()=>{
  const team=[mk('祀'),mk('汤汤'),mk('别礼'),mk('卡缪',0,'灯火使命')]; const r=run(team,[...base,{t:9.0,member:3,kind:'skill'}]);
  const ab=r.events.find(e=>e.type==='absorb'&&e.element==='heat'); assert.ok(ab,'应有灼热吸收');
  const b=r.events.find(e=>e.type==='buffStart'&&e.id==='wpn_lance_0007.p2'); assert.ok(b&&Math.abs(b.t-ab.t)<0.02,`灯火使命 p2 应在吸收时刻触发 ${JSON.stringify(b)}`);
  assert.ok(!r.events.some(e=>e.type==='attach'&&e.t>9&&e.t<10.2),'目标侧不叠层'); });

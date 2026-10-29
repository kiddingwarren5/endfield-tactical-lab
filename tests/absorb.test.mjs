// 连携的"吸收"窗口（mechanics.combo.absorb）：墨龙在场时施加到目标的寒冷/灼热附着被吸收，不叠层，计入终击层数；潜能"视为额外 N 层"（layersAddByPotential）。
import {test} from 'node:test'; import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js';
import {simulate} from '../dist/engine/sim/simulate.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n);
const mk=(name,potential=0)=>({operatorId:op(name).id,potential,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:'auto',weapon:{id:null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const run=(team,timeline,o={})=>simulate({team,data,mechanics,timing,enemy,mainControl:0,initial:{sp:900,energy:[0,0,0,0]},timeline,params:{duration:o.duration||14,controlUptime:1,mainAutoNormal:false},options:{}});
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

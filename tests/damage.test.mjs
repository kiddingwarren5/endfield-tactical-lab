import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js';
import {getStats} from '../dist/engine/stats.js'; import {calcSegment} from '../dist/engine/damage.js'; import {skillSegments,calcSkill} from '../dist/engine/skills.js';
const data={operators,weapons,gear,sets,effects:[]};
const bieli=operators.find(o=>o.name==='别礼'); const khr=weapons.find(w=>w.name==='赫拉芬格'); const G=n=>gear.find(g=>g.name===n).id;
const member={operatorId:bieli.id,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:khr.id,potential:0,ranks:[9,9,4]},gear:{armor:{id:G('涌浪重装甲'),refine:[3,3,3]},gloves:{id:G('潮涌手甲'),refine:[3,3,3]},kit1:{id:G('悬河供氧栓'),refine:[3,3,3]},kit2:{id:G('生物辅助护板'),refine:[3,3,3]}}};
const stats=getStats(member,data); const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
// Hand-computed: 别礼 连携 斩击 at 4 layers, no buffs except gear cold bonus 69.7667% and weapon 'all skill +32%' (rank4) injected as effect
const skillBonus={effect:{id:'khr.p0',name:'赫拉芬格 · 所有技能伤害',zone:'bonus',applies:{kinds:['skill','combo','ultimate']}},value:32,label:'赫拉芬格 · 所有技能伤害'};
const segs=skillSegments(bieli,'combo'); const slash=segs.find(s=>s.label.includes('斩击基础')); const perLayer=segs.find(s=>s.per==='unit');
const r1=calcSegment({stats,seg:slash,rank:12,enemy,applied:[skillBonus]}); const r2=calcSegment({stats,seg:perLayer,rank:12,enemy,applied:[skillBonus],vars:{layers:4}});
const expectBase=6368*1.60*1*(1+(69.766667+32)/100)*(100/200); assert.ok(Math.abs(r1.damage-expectBase)<1e-6,'slash '+r1.damage+' vs '+expectBase);
const expectLayer=6368*(2.40*4)*(1+(69.766667+32)/100)*0.5; assert.ok(Math.abs(r2.damage-expectLayer)<1e-6);
// Demo regression: demo's eSlash = (160+240*4)% with cold 69.8 → compare against our exact 69.7667 within 0.1% relative
const demoValue=6368*(1.60+2.40*4)*(1+(69.8+32)/100)*0.5; assert.ok(Math.abs((r1.damage+r2.damage)/demoValue-1)<0.001);
// total equals sum of segments
const tot=calcSkill({stats,segments:segs,rank:12,enemy,critMode:'never',appliedFor:()=>[skillBonus],vars:{layers:4}}); assert.ok(Math.abs(tot.total-tot.segments.reduce((a,s)=>a+s.damage,0))<1e-9);
// fragile ×1.5 only when effect carries fragileMultiplier
const frag={effect:{id:'jue.cold',name:'诀终结技 · 寒冷脆弱',zone:'fragile',applies:{elements:['cold']}},value:19.8}; const talent={effect:{id:'bl.t2',name:'低温脆性·二',zone:'other',fragileMultiplier:1.5,applies:{kinds:['ultimate']}},value:0};
const ult=skillSegments(bieli,'ultimate')[0]; const ru=calcSegment({stats,seg:ult,rank:12,enemy,applied:[frag,talent]}); assert.ok(Math.abs(ru.factors.fragile-(1+19.8*1.5/100))<1e-9);
const rc=calcSegment({stats,seg:slash,rank:12,enemy,applied:[frag,talent]}); assert.ok(Math.abs(rc.factors.fragile-(1+19.8/100))<1e-9);
// crit modes
assert.equal(calcSegment({stats,seg:slash,rank:12,enemy,critMode:'always'}).factors.crit,1.5); assert.ok(Math.abs(calcSegment({stats,seg:slash,rank:12,enemy,critMode:'expected'}).factors.crit-(1+0.05*0.5))<1e-9);
// resistance grade and custom
assert.equal(calcSegment({stats,seg:slash,rank:12,enemy:{...enemy,resistances:{...enemy.resistances,cold:'B'}}}).factors.resistance,0.5);
assert.equal(calcSegment({stats,seg:slash,rank:12,enemy:{...enemy,resistances:{...enemy.resistances,cold:'custom'},custom:{cold:-30}}}).factors.resistance,1.3);
console.log('damage tests passed');

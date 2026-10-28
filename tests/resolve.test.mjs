import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js';
import {getStats} from '../dist/engine/stats.js'; import {calcSegment} from '../dist/engine/damage.js'; import {skillSegments} from '../dist/engine/skills.js'; import {candidateEffects,appliedFor} from '../dist/engine/resolve.js';
const data={operators,weapons,gear,sets,effects};
const op=n=>operators.find(o=>o.name===n); const G=n=>gear.find(g=>g.name===n).id;
const bieli={operatorId:op('别礼').id,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:weapons.find(w=>w.name==='赫拉芬格').id,potential:0,ranks:[9,9,4]},gear:{armor:{id:G('涌浪重装甲'),refine:[3,3,3]},gloves:{id:G('潮涌手甲'),refine:[3,3,3]},kit1:{id:G('悬河供氧栓'),refine:[3,3,3]},kit2:{id:G('生物辅助护板'),refine:[3,3,3]}},consumables:[]};
const si={operatorId:op('祀').id,potential:3,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:null},gear:{},consumables:[]};
const team=[bieli,si]; const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const cands=candidateEffects({team,bIdx:0,data,consumablesOf:()=>[],mainControlIdx:0});
const stats=getStats(bieli,data); const ult=skillSegments(op('别礼'),'ultimate')[0];
// 祀 ult amp 36% × 1.2 (潜能3) = 43.2 for 别礼's cold hits (matches demo's 43.2)
const siAmp=cands.find(c=>c.effect.id==='chr_0036_jsspsi.ult.amp.cold'); assert.ok(siAmp,'祀 amp candidate');
const applied=appliedFor({candidates:cands,seg:ult,toggles:{[siAmp.effect.id]:true},data,overrides:{},stacks:{},vars:{layers:4}});
const amp=applied.find(a=>a.effect.id===siAmp.effect.id); assert.ok(Math.abs(amp.value-43.2)<1e-9,'amp '+amp.value);
// 别礼 brittle: in ultimate all cold fragile ×1.5 (own 低温症 4层=16 → 24)
const hypo=cands.find(c=>c.effect.id==='chr_0026_lastrite.talent.hypothermia');
const ap2=appliedFor({candidates:cands,seg:ult,toggles:{[hypo.effect.id]:true},data,overrides:{},stacks:{},vars:{layers:4}});
const r=calcSegment({stats,seg:ult,rank:12,enemy,applied:ap2,vars:{layers:4}}); assert.ok(Math.abs(r.factors.fragile-(1+16*1.5/100))<1e-9,'fragile '+r.factors.fragile);
const slash=skillSegments(op('别礼'),'combo').find(s=>s.label.includes('斩击基础')); const r2=calcSegment({stats,seg:slash,rank:12,enemy,applied:appliedFor({candidates:cands,seg:slash,toggles:{[hypo.effect.id]:true},data,overrides:{},stacks:{},vars:{layers:4}}),vars:{layers:4}}); assert.ok(Math.abs(r2.factors.fragile-1.16)<1e-9);
// auto effects: 潮涌 3 件 +20% and 赫拉芬格 所有技能 +32% present on combo without toggles
const auto=appliedFor({candidates:cands,seg:slash,toggles:{},data,overrides:{},stacks:{},vars:{}}); assert.ok(auto.some(a=>a.effect.owner.id==='suit_burst01'&&a.value===20)); assert.ok(auto.some(a=>a.effect.owner.id==='wpn_claym_0013'&&a.value===32));
// dependency override: 赛希 ult amp depends on her int
const xaihi={operatorId:op('赛希').id,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:null},gear:{},consumables:[]};
const c2=candidateEffects({team:[bieli,xaihi],bIdx:0,data,consumablesOf:()=>[],mainControlIdx:0}); const xa=c2.find(c=>c.effect.id==='chr_0011_seraph.ult.amp.cold'); assert.ok(xa);
const a1=appliedFor({candidates:c2,seg:ult,toggles:{[xa.effect.id]:true},data,overrides:{},stacks:{},vars:{}}).find(a=>a.effect.id===xa.effect.id);
const a2=appliedFor({candidates:c2,seg:ult,toggles:{[xa.effect.id]:true},data,overrides:{[xa.effect.id]:'0'},stacks:{},vars:{}}).find(a=>a.effect.id===xa.effect.id);
assert.equal(a1.dependency.origin,'auto'); assert.equal(a2.dependency.origin,'manual'); assert.equal(a2.dependency.used,0); assert.ok(a1.value>a2.value&&a2.value===24,'xaihi '+a1.value+' '+a2.value);
console.log('resolve tests passed', {siAmp:amp.value, xaihiAuto:a1.value, xaihiInt:a1.dependency.used});

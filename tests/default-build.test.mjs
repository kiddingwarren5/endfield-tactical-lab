// 默认配装：每个可用干员都能得到完整配装；内置表里的四人仍用内置表；通用规则三件同套、两个配件不同。
import test from 'node:test'; import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import mechanics from '../dist/data/mechanics.js';
import {buildGraph} from '../dist/engine/graph.js'; import {defaultBuildFor,rankSets} from '../dist/engine/defaultBuild.js'; import {DEFAULT_BUILDS} from '../dist/data/builds.js';
import {newMember,applyDefaultBuild,hasDefaultBuild,buildStatus,exampleTeam} from '../dist/app/state.js';
const data={operators,weapons,gear,sets,effects,mechanics}; const g=buildGraph(data);
test('每个官方数据已公开的干员都有通用默认配装：武器同类型，三件同套且护甲/护手/配件各一，两个配件不同',()=>{
  for(const op of operators){ if(op.preview) continue; const b=defaultBuildFor(op,data,g); assert.ok(b,op.name);
    assert.equal(b.weapon.type,op.weaponType,op.name+' 武器类型');
    const [armor,gloves,kit1,kit2]=b.gear; assert.equal(armor.slot,'armor'); assert.equal(gloves.slot,'gloves'); assert.equal(kit1.slot,'kit'); assert.equal(kit2.slot,'kit');
    assert.ok(armor.set===b.set&&gloves.set===b.set&&kit1.set===b.set,op.name+' 三件同套'); assert.notEqual(kit1.id,kit2.id,op.name+' 两个配件不同');
    assert.ok(b.gear.every(x=>x.level==='LV.70'),op.name+' 只选最高等级'); }
});
test('套装得分只按百分比类效果，且只算这名干员能触发的',()=>{
  const op=operators.find(o=>o.name==='大潘'); const r=rankSets(op,data,g); const chao=r.find(x=>x.id==='suit_burst01'); // 潮涌：物理干员触发不了 2 层法术附着
  assert.equal(chao.parts.find(p=>p.effect==='suit_burst01.p2').feasibility,0);
  const dian=r.find(x=>x.id==='suit_phy01'); assert.ok(dian.parts.every(p=>p.zone!=='other'),'固定伤害不计分');
});
test('内置表里的四人仍用内置表，其余干员入队即有默认配装',()=>{
  for(const [name,list] of Object.entries(DEFAULT_BUILDS)){ list.forEach((b,k)=>{ const m=newMember(operators.find(o=>o.name===name).id); assert.ok(applyDefaultBuild(m,k),name+' 方案 '+k); assert.equal(weapons.find(w=>w.id===m.weapon.id).name,b.weapon,name); assert.equal(buildStatus(m).kind,'default'); assert.equal(m.buildScheme,k); }); }
  for(const op of operators){ if(op.preview) continue; const m=newMember(op.id); assert.ok(hasDefaultBuild(m),op.name); assert.ok(applyDefaultBuild(m),op.name); assert.ok(m.weapon.id&&m.gear.armor.id&&m.gear.gloves.id&&m.gear.kit1.id&&m.gear.kit2.id,op.name); }
});
test('示例编队四人都有配装，主控是别礼',()=>{ const ex=exampleTeam(); assert.equal(ex.team.length,4); assert.ok(ex.team.every(m=>buildStatus(m).kind==='default')); assert.equal(operators.find(o=>o.id===ex.team[ex.mainControl].operatorId).name,'别礼'); });

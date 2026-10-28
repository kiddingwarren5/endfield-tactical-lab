import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js';
import {getStats} from '../dist/engine/stats.js';
const data={operators,weapons,gear,sets,effects:[
 {id:'chr_0026_lastrite.pot2.str',owner:{kind:'operator',id:'chr_0026_lastrite',potential:2},name:'别礼潜能2 · 力量+20',zone:'ability',stat:'str',unit:'flat',value:{fixed:20},condition:{mode:'auto'}}
]};
const bieli=operators.find(o=>o.name==='别礼'); const khr=weapons.find(w=>w.name==='赫拉芬格'); const G=n=>gear.find(g=>g.name===n).id;
const member={operatorId:bieli.id,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:khr.id,potential:0,ranks:[9,9,4]},gear:{armor:{id:G('涌浪重装甲'),refine:[3,3,3]},gloves:{id:G('潮涌手甲'),refine:[3,3,3]},kit1:{id:G('悬河供氧栓'),refine:[3,3,3]},kit2:{id:G('生物辅助护板'),refine:[3,3,3]}}};
const s=getStats(member,data);
// Regression sample from the handoff demo (user screenshots): main 772, sub 307, panel attack 6368
assert.equal(s.main,772); assert.equal(s.sub,307); assert.equal(s.atk.panel,6368);
assert.equal(s.sets['suit_burst01'],3);
// exact internal cold/elec bonus sums to 69.7667 (game displays 69.8) — replaces old 0.1 calibration
assert.ok(Math.abs(s.bonuses.coldElecDmg-69.766667)<1e-4, 'cold '+s.bonuses.coldElecDmg);
// potential 2: +20 str → main 798, panel 6519 (user's full-potential screenshot had 6519 at 5潜)
const m2={...member,potential:5}; const s2=getStats(m2,data); assert.equal(s2.main,798); assert.equal(s2.atk.panel,6519);
// refinement independence: lowering armor strength refine lowers attack but not cold bonus
const m3=JSON.parse(JSON.stringify(member)); m3.gear.armor.refine=[0,3,3]; const s3=getStats(m3,data); assert.ok(s3.atk.panel<s.atk.panel); assert.ok(Math.abs(s3.bonuses.coldElecDmg-s.bonuses.coldElecDmg)<1e-9);
// weapon potential → slot3 rank only; slot1/2 ranks independent
const m4=JSON.parse(JSON.stringify(member)); m4.weapon.ranks=[1,9,4]; const s4=getStats(m4,data); assert.equal(s4.flatAbilities.str, s.flatAbilities.str-156+20);
// two-attribute gear & other operator smoke: every operator computes with its default weapon-less loadout
for(const o of operators){ const st=getStats({operatorId:o.id,potential:0},data); assert.ok(st.atk.panel>0,o.name); }
console.log('stats tests passed; 别礼 sample:',{main:s.main,sub:s.sub,panel:s.atk.panel,cold:s.bonuses.coldElecDmg});

import assert from 'node:assert/strict';
import {defaultState,calculate,getStats,getEvent,weaponSkillRankFromPotential} from './dist/calc.js';

const s=defaultState();
assert.equal(s.critMode,'never');
assert.equal(weaponSkillRankFromPotential(0),4);
assert.equal(weaponSkillRankFromPotential(5),9);
assert.equal(s.weaponRanks.skill,4);
assert.equal(getStats(s).main,772);
assert.equal(getStats(s).sub,307);
assert.equal(getStats(s).panelAttack,6368);
assert.ok(Math.abs(getStats(s).cold-69.8)<1e-9);
assert.equal(getStats(s).tideCount,3);

s.characterPotential=5;
assert.equal(getStats(s).main,798);
assert.equal(getStats(s).panelAttack,6519); // user's full-potential screenshot
assert.equal(getEvent(s).ratio,(160+240*4)*1.15);
s.event='eSlash';
assert.equal(calculate(s).buckets.bonus.find(x=>x.label.includes('赫拉芬格 · 所有技能')).value,32);
s.weaponPotential=5;
assert.equal(calculate(s).buckets.bonus.find(x=>x.label.includes('赫拉芬格 · 所有技能')).value,56);
s.weaponPotential=0;
s.event='q';
assert.equal(getEvent(s).ratio,320*1.2);
s.characterPotential=0;
assert.equal(getEvent(s).ratio,320);

s.event='normal1';
const normal=calculate(s);
assert.equal(normal.buckets.bonus.some(x=>x.label.includes('所有技能')),false);
s.event='eSlash';
const e=calculate(s);
assert.equal(e.buckets.bonus.some(x=>x.label.includes('所有技能')),true);
s.buffs.siR=true;
assert.ok(calculate(s).damage>e.damage);
s.enemy.resistances.cold='B';
assert.equal(calculate(s).resistance,50);
assert.ok(calculate(s).damage<e.damage);

s.event='crush';s.abnormalLevel=4;
const crush=calculate(s);
assert.equal(crush.ev.ratio,750);
assert.equal(crush.ev.element,'physical');
assert.equal(crush.factors.level,1+89/392);
s.event='artsBurst';
assert.equal(calculate(s).factors.level,1+89/196);

const unrefined=defaultState();
const baseStats=getStats(unrefined);
unrefined.gear.armor.refinements.strength=0;
assert.ok(getStats(unrefined).panelAttack<baseStats.panelAttack);
assert.equal(getStats(unrefined).cold,baseStats.cold);
unrefined.gear.armor.refinements.strength=3;
unrefined.gear.armor.refinements.cold=0;
assert.equal(getStats(unrefined).panelAttack,baseStats.panelAttack);
assert.ok(getStats(unrefined).cold<baseStats.cold);

const talent=defaultState();
talent.event='r1';
talent.buffs={jueRCold:true,ttArts:true,blCold:true};
const ult=calculate(talent);
assert.equal(ult.buckets.fragile.find(x=>x.label.includes('诀终结技')).value,19.8*1.5);
assert.equal(ult.buckets.fragile.find(x=>x.label.includes('法术脆弱')).value,10*1.5);
assert.equal(ult.buckets.fragile.find(x=>x.label.includes('别礼')).value,16*1.5);
talent.event='eSlash';
assert.equal(calculate(talent).buckets.fragile.find(x=>x.label.includes('法术脆弱')).value,10);
console.log('Damage engine checks passed.');

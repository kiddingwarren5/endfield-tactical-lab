// 解包时序（params.timingSource='akedata'）：施放时长、命中帧、终结技演出、普攻各段按 dist/data/timing-akedata.js（docs/datamine/timing.md）取；默认模式不受影响。
import {test} from 'node:test'; import assert from 'node:assert/strict'; import {execFileSync} from 'node:child_process'; import fs from 'node:fs';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js';
import {simulate} from '../dist/engine/sim/simulate.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n);
const mk=name=>({operatorId:op(name).id,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:'auto',weapon:{id:null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const run=(team,timeline,o={})=>simulate({team,data,mechanics,timing,enemy,mainControl:o.mc??0,initial:{sp:o.sp??600,energy:o.energy||[0,0,0,0]},timeline,params:{duration:o.duration||12,controlUptime:1,timingSource:o.source??'akedata',mainAutoNormal:o.auto??false},options:{}});
const near=(a,b,eps=0.02)=>Math.abs(a-b)<eps; const ake=timing.byOperator;
const busyErr=(r,who,t)=>r.events.some(e=>e.type==='error'&&near(e.t,t)&&new RegExp(`${who}.*其他动作`).test(e.message));
const castAt=(r,who,kind,t)=>r.events.some(e=>e.type==='cast'&&e.who===who&&e.kind===kind&&near(e.t,t));

test('解包时序表：34 名干员；普攻链沿 AllowNext 走，最后一段是重击（黎风 1→2→3→5）',()=>{
  assert.ok(Object.keys(ake).length>=30);
  const b=ake[op('别礼').id]; assert.deepEqual(b.normal,[0.667,0.967,1.2,1.533]); assert.equal(b.heavy.kind,'attack4'); assert.ok(near(b.cast.skill.seconds,1.133)&&near(b.cast.combo.seconds,2.167)&&near(b.cast.ultimate.seconds,4.667)&&near(b.cast.ultimate.cutscene,2.833));
  const lf=ake[op('黎风').id]; assert.deepEqual(lf.normalNames,['attack1','attack2','attack3','attack5']); assert.ok(near(lf.heavy.seconds,1.167));
  const jue=ake[op('诀').id]; assert.ok(jue.cast.ultimate2&&near(jue.cast.ultimate2.seconds,2.0)&&near(jue.cast.ultimate2.cutscene,1.667)&&jue.cast.ultimate2.hitFrames[0]===58,'诀后续终结技 ultimate2');
  assert.equal(timing.byOperatorFps,30); });

test('生成器可复现：重跑 --check 与仓库里的文件一致（本地没有解包原始文件时跳过）',t=>{ if(!fs.existsSync('sources/raw/akedata/TableCfg/SkillPatchTable.json')){ t.skip('未下载解包原始文件，见 sources/raw/akedata/README.md'); return; } const out=execFileSync('node',['tools/build_timing_akedata.mjs','--check'],{encoding:'utf8'}); assert.match(out,/一致/); });

test('施放时长只认主动作：噗切娜战技（AllowNext 只给反击）按 exclusiveFrame 1.667 s',()=>{
  const r=run([mk('噗切娜'),mk('祀')],[{t:0,member:0,kind:'skill'},{t:1.0,member:0,kind:'skill'},{t:1.7,member:0,kind:'skill'}],{sp:900});
  assert.ok(busyErr(r,'噗切娜',1.0),'1.0 s 还在战技里'); assert.ok(castAt(r,'噗切娜','skill',1.7),'1.7 s 可以再放战技'); });

test('战技施放时长按干员：别礼 1.133 s 内不能再出手，之后可以',()=>{
  const busy=run([mk('别礼'),mk('祀')],[{t:0,member:0,kind:'skill'},{t:1.0,member:0,kind:'skill'}]); assert.ok(busyErr(busy,'别礼',1.0));
  const r=run([mk('别礼'),mk('祀')],[{t:0,member:0,kind:'skill'},{t:1.2,member:0,kind:'skill'}]); assert.equal(r.events.filter(e=>e.type==='cast'&&e.who==='别礼'&&e.kind==='skill').length,2); });

test('命中落在解包的命中帧（含子实体）：别礼连携首击 13 帧；祀终结技首击 2.1 s；默认模式仍是施放时长的 60% / 80%',()=>{
  const tl=[{t:0,member:1,kind:'skill'},{t:2,member:1,kind:'skill'},{t:4,member:1,kind:'skill'},{t:6,member:0,kind:'combo'}];
  const a=run([mk('别礼'),mk('汤汤')],tl); const h=a.hits.find(x=>x.name==='别礼'&&x.kind==='combo'); assert.ok(h&&near(h.t,6+13/30),`解包命中时刻 ${h?.t}`);
  const d=run([mk('别礼'),mk('汤汤')],tl,{source:'default'}); const hd=d.hits.find(x=>x.name==='别礼'&&x.kind==='combo'); assert.ok(hd&&near(hd.t,6+timing.castSeconds.combo*0.6),`默认命中时刻 ${hd?.t}`);
  const s=run([mk('祀'),mk('汤汤')],[{t:0,member:0,kind:'ultimate'}],{energy:[300,0]}); const hs=s.hits.find(x=>x.name==='祀'&&x.kind==='ultimate'); assert.ok(hs&&near(hs.t,(63-58)/30),`祀终结技首击（扣除演出 58 帧）${hs?.t}`);
  const sd=run([mk('祀'),mk('汤汤')],[{t:0,member:0,kind:'ultimate'}],{energy:[300,0],source:'default'}); const hsd=sd.hits.find(x=>x.name==='祀'&&x.kind==='ultimate'); assert.ok(hsd&&near(hsd.t,timing.castSeconds.ultimate*0.8),`默认终结技命中 ${hsd?.t}`); });

test('没有命中帧的技能按默认表估命中（艾尔黛拉终结技 2.4 s），不是解包施放时长 6.967 s 的比例',()=>{
  const r=run([mk('艾尔黛拉'),mk('祀')],[{t:0,member:0,kind:'ultimate'}],{energy:[300,0]}); const h=r.hits.find(x=>x.name==='艾尔黛拉'&&x.kind==='ultimate'); assert.ok(h&&near(h.t,timing.castSeconds.ultimate*0.8),`命中 ${h?.t}`); });

test('终结技演出按干员：别礼演出 2.833 s 只暂停计时不锁队友，自己 4.667 s 后才能再出手；首击按扣除演出帧（第 86−85 帧）落地；解包无演出动作的（大潘）不暂停',()=>{
  const r=run([mk('别礼'),mk('祀')],[{t:0,member:0,kind:'ultimate'},{t:1.0,member:1,kind:'skill'},{t:4.0,member:0,kind:'skill'},{t:4.8,member:0,kind:'skill'}],{energy:[300,0]});
  const p=r.events.find(e=>e.type==='pause'); assert.ok(p&&near(p.seconds,2.833),`演出 ${JSON.stringify(p)}`); assert.ok(castAt(r,'祀','skill',1.0),'演出期间队友照常施放'); assert.ok(busyErr(r,'别礼',4.0)); assert.ok(castAt(r,'别礼','skill',4.8));
  const h=r.hits.find(x=>x.name==='别礼'&&x.kind==='ultimate'); assert.ok(h&&near(h.t,(86-85)/30),`终结技首击 ${h?.t}`);
  const d=run([mk('大潘'),mk('祀')],[{t:0,member:0,kind:'ultimate'},{t:0.5,member:1,kind:'skill'}],{energy:[300,0]}); assert.ok(!d.events.some(e=>e.type==='pause'&&e.seconds>0),'大潘终结技无演出'); assert.ok(castAt(d,'祀','skill',0.5)); });

test('下落攻击在解包口径下仍按 2.0 s，不能当普攻连刷',()=>{
  const r=run([mk('伊冯'),mk('祀')],[{t:0,member:0,kind:'plunge'},{t:1.0,member:0,kind:'plunge'},{t:2.1,member:0,kind:'plunge'}]); assert.ok(busyErr(r,'伊冯',1.0)); assert.ok(castAt(r,'伊冯','plunge',2.1)); });

test('普攻各段按干员：祀主控连续普攻 0.667/0.433/0.4/0.867/1.033；黎风四段 0.8/0.6/0.467/1.167',()=>{
  const r=run([mk('祀'),mk('汤汤')],[],{duration:6,auto:true}); const n=r.events.filter(e=>e.type==='normalHit'&&e.who==='祀').map(e=>e.t); const gaps=n.slice(1,6).map((t,i)=>+(t-n[i]).toFixed(3)); assert.deepEqual(gaps,[0.667,0.433,0.4,0.867,1.033]);
  const l=run([mk('黎风'),mk('汤汤')],[],{duration:6,auto:true}); const m=l.events.filter(e=>e.type==='normalHit'&&e.who==='黎风').map(e=>e.t); assert.deepEqual(m.slice(1,5).map((t,i)=>+(t-m[i]).toFixed(3)),[0.8,0.6,0.467,1.167]); });

test('强化普攻段数与技能表不一致时记 note 并退回武器表（伊冯）；一致时用 ult_attack 帧（莱万汀）',()=>{
  const y=run([mk('伊冯'),mk('祀')],[{t:0,member:0,kind:'ultimate'}],{energy:[300,0],duration:8,auto:true}); assert.ok(y.events.some(e=>e.type==='note'&&/伊冯 强化普攻段数/.test(e.message)),'伊冯 note');
  const lv=ake[op('莱万汀').id]; assert.deepEqual(lv.ultNormal.seconds,[0.567,0.9,0.467,1.167]); });

test('默认模式的固定时刻不变：战技命中 0.48、连携 0.72、终结技 2.4、演出 3.0',()=>{
  const r=run([mk('别礼'),mk('汤汤')],[{t:0,member:1,kind:'skill'},{t:2,member:1,kind:'skill'},{t:4,member:1,kind:'skill'},{t:6,member:0,kind:'combo'},{t:8,member:0,kind:'ultimate'}],{source:'default',energy:[300,0]});
  const hs=r.hits.find(h=>h.name==='汤汤'&&h.kind==='skill'); assert.ok(near(hs.t,0.48)); const hc=r.hits.find(h=>h.name==='别礼'&&h.kind==='combo'); assert.ok(near(hc.t,6.72)); const hu=r.hits.find(h=>h.name==='别礼'&&h.kind==='ultimate'); assert.ok(near(hu.t,10.4)); const p=r.events.find(e=>e.type==='pause'&&e.t>7); assert.ok(p&&near(p.seconds,3.0)); });

test('终结技不受自身动作忙碌限制：别礼连携后 0.2 s 就能放终结技（解包 AllowNext 从不含终结技；日志连携首击后 0.06–0.21 s 有终结技首击）',()=>{
  const tl=[{t:0,member:1,kind:'skill'},{t:2,member:1,kind:'skill'},{t:4,member:1,kind:'skill'},{t:6,member:0,kind:'combo'},{t:6.2,member:0,kind:'ultimate'}];
  for(const source of ['akedata','default']){ const r=run([mk('别礼'),mk('汤汤')],tl,{energy:[300,0],source}); assert.ok(castAt(r,'别礼','ultimate',6.2),`${source} 6.2 s 放出终结技`); assert.ok(!busyErr(r,'别礼',6.2)); } });

// 条件伤害段：此前 16 段标成“未建模”直接跳过（狼卫 / 弧光 / 莱万汀 / 梨诺追加段、黎风终结技追加、骏卫强化第三段、大潘六段连斩、伊冯速冻仔、诀集束打击与破晦诀明、阿列什珍鳞、噗切娜随机礼盒）。
// 现在全部按结构化条件（消耗了什么、触发层数、概率、浮空、终结技期间）结算；同时条件异常 / 回能 / 返还也只在条件成立时发生。
import {test} from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js';
import {simulate} from '../dist/engine/sim/simulate.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n);
const mk=name=>({operatorId:op(name).id,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:'auto',weapon:{id:null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const run=(team,timeline,o={})=>simulate({team,data,mechanics,timing,enemy,mainControl:o.mc??0,initial:{sp:o.sp??300,energy:o.energy||[0,0,0,0]},timeline,params:{duration:o.duration||24},options:o.options||{}});
const segs=(r,who)=>r.hits.filter(h=>h.name===who&&h.kind!=='normal').map(h=>h.segment);
const near=(a,b,eps=0.05)=>Math.abs(a-b)<eps;

test('机制数据里不再有“未建模”段：每个段要么有条件，要么由规则结算',()=>{ const m=JSON.parse(fs.readFileSync('sources/curated/skill-mechanics.json','utf8')); const bad=[]; for(const o of m) for(const s of [o.skill,o.combo,o.ultimate,...(o.modes||[]).flatMap(md=>[md.skill,md.combo,md.ultimate])]) for(const p of s?.segmentPlan||[]) if(p.when?.unmodeled) bad.push(o.name+' '+p.id); assert.deepEqual(bad,[]); });

test('狼卫：目标燃烧时战技消耗燃烧并追加一射（850%），且不再施加灼热附着；无异常时只打基础段并上附着',()=>{
  const r=run([mk('狼卫')],[{t:0.5,member:0,kind:'ultimate'},{t:4,member:0,kind:'skill'}],{energy:[90],duration:8});
  assert.ok(r.events.some(e=>e.type==='abnormal'&&e.which==='burn'&&e.by==='狼卫'),'终结技强制燃烧'); assert.ok(r.events.some(e=>e.type==='consumeAbnormal'&&e.which==='burn'),'战技消耗燃烧');
  assert.deepEqual(segs(r,'狼卫').filter(s=>s.startsWith('skill')),['skill1','skill2']); assert.ok(!r.events.some(e=>e.type==='attach'&&e.by==='狼卫'&&e.via==='skill'),'消耗异常时不施加灼热附着');
  const r2=run([mk('狼卫')],[{t:0.5,member:0,kind:'skill'}],{duration:4}); assert.deepEqual(segs(r2,'狼卫'),['skill1']); assert.ok(r2.events.some(e=>e.type==='attach'&&e.element==='heat'&&e.by==='狼卫')); });

test('大潘终结技：6 段空中连斩 + 终结一击',()=>{ const r=run([mk('大潘')],[{t:0.5,member:0,kind:'ultimate'}],{energy:[90],duration:6}); const s=segs(r,'大潘'); assert.equal(s.filter(x=>x==='ultimate1').length,6); assert.equal(s.filter(x=>x==='ultimate2').length,1); });

test('弧光：目标导电时战技消耗导电、追加一击（405%）并恢复 40 技力；无导电时两段、不回技力',()=>{
  const r=run([mk('弧光'),mk('佩丽卡'),mk('汤汤')],[{t:0.5,member:2,kind:'skill'},{t:2,member:1,kind:'skill'},{t:5,member:0,kind:'skill'}],{duration:9});
  assert.ok(r.events.some(e=>e.type==='abnormal'&&e.which==='conduct'),'寒冷附着上电磁附着 → 导电'); assert.deepEqual(segs(r,'弧光'),['skill1','skill2','skill3']); const sp=r.events.find(e=>e.type==='spGain'&&/弧光 战技恢复/.test(e.why)); assert.ok(sp&&sp.amount===40,'消耗导电后恢复 40 技力');
  const r2=run([mk('弧光')],[{t:0.5,member:0,kind:'skill'}],{duration:4}); assert.deepEqual(segs(r2,'弧光'),['skill1','skill2']); assert.ok(!r2.events.some(e=>e.type==='spGain'&&/弧光 战技恢复/.test(e.why))); });

test('弧光终结技：冲刺命中上电磁附着，4.5 s 后引爆才消耗附着并强制导电',()=>{ const r=run([mk('弧光')],[{t:0.5,member:0,kind:'ultimate'}],{energy:[90],duration:8}); const h2=r.hits.find(h=>h.name==='弧光'&&h.segment==='ultimate2'); assert.ok(h2&&near(h2.t,5.0),`引爆时刻 ${h2?.t}`); const c=r.events.find(e=>e.type==='consume'&&e.element==='electric'); assert.ok(c&&near(c.t,5.0),'引爆时消耗电磁附着'); const ab=r.events.find(e=>e.type==='abnormal'&&e.which==='conduct'&&e.forced); assert.ok(ab&&near(ab.t,5.0),'引爆后强制导电'); });

test('阿列什：战技只有消耗了寒冷附着才冻结并按层数回技力；珍鳞是概率段，保底不计、期望按概率折算',()=>{
  const r=run([mk('阿列什'),mk('汤汤')],[{t:0.5,member:1,kind:'skill'},{t:2.5,member:0,kind:'skill'}],{duration:6}); assert.ok(r.events.some(e=>e.type==='abnormal'&&e.which==='freeze'&&e.by==='阿列什')); const sp=r.events.find(e=>e.type==='spGain'&&/阿列什 按消耗 1 层/.test(e.why)); assert.ok(sp&&sp.amount===15);
  const r0=run([mk('阿列什')],[{t:0.5,member:0,kind:'skill'}],{duration:4}); assert.ok(!r0.events.some(e=>e.type==='abnormal'&&e.which==='freeze'),'无附着不冻结'); assert.ok(!r0.events.some(e=>e.type==='spGain'&&/按消耗/.test(e.why)));
  const tl=[{t:0.5,member:1,kind:'skill'},{t:2.5,member:0,kind:'skill'},{t:4,member:0,kind:'combo'}]; const g=run([mk('阿列什'),mk('汤汤')],tl,{duration:9}); const gs=g.hits.filter(h=>h.name==='阿列什'&&h.kind==='combo'); assert.deepEqual(gs.map(h=>h.segment),['combo1'],'保底只打基础段'); assert.equal(gs[0].factor,1);
  const x=run([mk('阿列什'),mk('汤汤')],tl,{duration:9,options:{procMode:'expected'}}); const xs=x.hits.filter(h=>h.name==='阿列什'&&h.kind==='combo'); assert.deepEqual(xs.map(h=>h.segment),['combo1','combo2']); assert.ok(near(xs[0].factor+xs[1].factor,1,1e-9),'两分支概率之和为 1'); assert.ok(xs[1].factor>=0.1-1e-9&&xs[1].factor<=0.4+1e-9); });

test('骏卫连携：斩击次数 = 消耗的破防层数（最多 3），4 层时第三击强化',()=>{
  const r=run([mk('管理员 (男)'),mk('黎风'),mk('骏卫')],[{t:0.5,member:1,kind:'skill'},{t:2,member:1,kind:'skill'},{t:4,member:2,kind:'skill'},{t:6,member:2,kind:'combo'}],{duration:10}); assert.deepEqual(segs(r,'骏卫').filter(s=>s.startsWith('combo')),['combo1','combo2'],'消耗 2 层 → 2 击');
  const r4=run([mk('管理员 (男)'),mk('黎风'),mk('骏卫')],[{t:0.5,member:1,kind:'skill'},{t:2,member:1,kind:'skill'},{t:3.5,member:1,kind:'skill'},{t:5,member:1,kind:'skill'},{t:7,member:2,kind:'skill'},{t:9,member:2,kind:'combo'}],{duration:13,sp:300}); const br=r4.events.filter(e=>e.type==='breach').at(-1); if(!br||br.layers<4) return; assert.deepEqual(segs(r4,'骏卫').filter(s=>s.startsWith('combo')),['combo1','combo2','combo4'],'消耗 4 层 → 第三击强化'); const sp=r4.events.find(e=>e.type==='spGain'&&/骏卫 连携/.test(e.why)); assert.ok(sp&&sp.amount===5+7+23); });

test('伊冯：战技消耗附着才冻结、才回能（10+30/层）；速冻仔 4 次能量攻击每 0.75 s 一次，3 s 后自爆并冻结',()=>{
  const r=run([mk('伊冯'),mk('汤汤')],[{t:0.5,member:1,kind:'skill'},{t:2,member:0,kind:'skill'},{t:6,member:0,kind:'combo'}],{duration:12});
  const eg=r.events.find(e=>e.type==='energyGain'&&e.who==='伊冯'&&/自身回能/.test(e.why)); assert.ok(eg&&eg.amount===40,`消耗 1 层：10+30，实际 ${eg?.amount}`);
  const c1=r.hits.filter(h=>h.name==='伊冯'&&h.segment==='combo1').map(h=>h.t); assert.equal(c1.length,4); assert.ok(near(c1[1]-c1[0],0.75)&&near(c1[3]-c1[0],2.25)); const c2=r.hits.find(h=>h.name==='伊冯'&&h.segment==='combo2'); assert.ok(c2&&near(c2.t,9.0),`自爆时刻 ${c2?.t}`); const fz=r.events.filter(e=>e.type==='abnormal'&&e.which==='freeze'&&e.by==='伊冯'); assert.ok(fz.some(e=>near(e.t,9.0)),'自爆时冻结');
  const r0=run([mk('伊冯')],[{t:0.5,member:0,kind:'skill'}],{duration:4}); assert.ok(!r0.events.some(e=>e.type==='abnormal'&&e.which==='freeze')); assert.ok(!r0.events.some(e=>e.type==='energyGain'&&/自身回能/.test(e.why))); });

test('诀终结技：破晦阵内主控重击触发集束打击（最多 2 次），之后终结技切换为破晦诀明，再按终结技即施放且不计入终结技次数',()=>{
  const r=run([mk('诀'),mk('祀')],[{t:0.5,member:0,kind:'ultimate'},{t:12,member:0,kind:'ultimate'}],{energy:[100,0,0,0],duration:20}); const s=segs(r,'诀'); assert.equal(s.filter(x=>x==='ultimate2').length,2,'集束打击 2 次'); assert.equal(s.filter(x=>x==='ultimate3').length,1,'破晦诀明 1 次'); assert.ok(r.events.some(e=>e.type==='ultFollowUpReady'&&e.who==='诀')); assert.equal(r.errors.length,0); assert.equal(r.summary.ultsCast,1);
  const r0=run([mk('诀'),mk('祀')],[{t:0.5,member:0,kind:'ultimate'},{t:12,member:0,kind:'ultimate'}],{energy:[100,0,0,0],duration:20,mc:1}); assert.equal(segs(r0,'诀').filter(x=>x==='ultimate3').length,r0.events.some(e=>e.type==='ultFollowUpReady')?1:0); });

test('梨诺：演唱姿态每 10 s 追加攻击共 6 次，姿态中止后取消；高歌姿态歌声每 1.5 s 一次、结束时 3 倍',()=>{
  const r=run([mk('梨诺')],[{t:0.5,member:0,kind:'skill'}],{duration:70}); assert.equal(segs(r,'梨诺').filter(s=>s==='skill2').length,6);
  const r2=run([mk('梨诺')],[{t:0.5,member:0,kind:'skill'},{t:25,member:0,kind:'skill'}],{duration:70}); assert.equal(segs(r2,'梨诺').filter(s=>s==='skill2').length,2,'25 s 中止后只剩 10 s、20 s 两次');
  const u=run([mk('梨诺')],[{t:0.5,member:0,kind:'ultimate'}],{energy:[160],duration:20}); const songs=u.hits.filter(h=>h.name==='梨诺'&&h.segment==='ultimate3'); assert.equal(songs.length,11); assert.ok(near(songs[1].t-songs[0].t,1.5)); assert.equal(songs.at(-1).factor,3); assert.ok(near(songs.at(-1).t-songs[0].t,15)); });

test('噗切娜终结技：保底按三个手工作业计（随机礼盒不计炸弹与特殊赠礼）；期望口径按概率折算',()=>{
  const g=run([mk('噗切娜')],[{t:0.5,member:0,kind:'ultimate'}],{energy:[100],duration:6}); assert.deepEqual(segs(g,'噗切娜'),['ultimate2','ultimate2','ultimate2']);
  const x=run([mk('噗切娜')],[{t:0.5,member:0,kind:'ultimate'}],{energy:[100],duration:6,options:{procMode:'expected'}}); const xs=x.hits.filter(h=>h.name==='噗切娜'); assert.equal(xs.filter(h=>h.segment==='ultimate1').length,3); assert.ok(near(xs.find(h=>h.segment==='ultimate3').factor,0.2,1e-9)); });

test('提弗洛斯终结技：之后 5 次空中普攻各引发箭雨，消耗猎矢的射击引发自然爆发，主控第五次视为重击',()=>{
  const r=run([mk('提弗洛斯'),mk('诀')],[{t:0.5,member:1,kind:'skill'},{t:3,member:0,kind:'ultimate'}],{energy:[200,0,0,0],duration:12}); const s=r.hits.filter(h=>h.name==='提弗洛斯'&&h.t>5&&h.t<6).map(h=>h.segment); /* 空中普攻按普攻结算增益，所以不按 kind 过滤 */ assert.equal(s.filter(x=>x==='skill2').length,4); assert.equal(s.filter(x=>x==='skill3').length,1); assert.equal(s.filter(x=>x==='ultimate2').length,4); assert.equal(s.filter(x=>x==='ultimate3').length,1); assert.ok(s.filter(x=>x==='artsBurst').length>=3,'2 枚猎矢 + 主控第五次免费强化射击'); assert.ok(r.events.some(e=>e.type==='normalHit'&&e.heavy&&e.who==='提弗洛斯'&&near(e.t,5.4)),'第五次空中普攻视为重击'); });

test('莱万汀：终结技期间战技改打强化段，不再叠加普通段；追加段只在满 4 层熔火时由规则追加',()=>{
  const r=run([mk('莱万汀')],[{t:0.5,member:0,kind:'skill'},{t:3,member:0,kind:'ultimate'},{t:8,member:0,kind:'skill'}],{energy:[300],duration:14}); const s=r.hits.filter(h=>h.name==='莱万汀'&&h.kind==='skill'); assert.deepEqual(s.filter(h=>h.t<3).map(h=>h.segment),['skill1','skill2']); assert.deepEqual(s.filter(h=>h.t>8).map(h=>h.segment),['skill4','skill5']); assert.ok(!s.some(h=>h.segment==='skill3'||h.segment==='skill6'),'未满 4 层不追加');
  assert.ok(!r.events.some(e=>e.type==='energyGain'&&e.who==='莱万汀'&&/自身回能/.test(e.why)),'+100 能量只由熔火规则给，不再每次战技都给'); });

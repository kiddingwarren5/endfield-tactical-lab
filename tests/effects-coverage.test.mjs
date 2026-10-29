// 效果级机制：此前 67 条天赋 / 潜能 / 武器效果在触发表里标成“未建模”从不触发。现在它们按目标状态、资源事件、反击 / 格挡 / 受击、
// 暴击与概率口径、修饰器结算；对照靶上不会发生的（击败、多目标、蓄力）与不影响伤害的（治疗）在触发表里有明确标注，测试里要求不再出现“未建模”。
import {test} from 'node:test'; import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js';
import {simulate} from '../dist/engine/sim/simulate.js'; import {triggerCoverage} from '../dist/engine/sim/triggers.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n);
const mk=(name,pot=0,mode='auto')=>({operatorId:op(name).id,potential:pot,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode,weapon:{id:null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{},attackInterval:4};
const run=(team,timeline,o={})=>simulate({team,data,mechanics,timing,enemy,mainControl:o.mc??0,initial:{sp:o.sp??300,energy:o.energy||[0,0,0,0]},timeline,params:{duration:o.duration||24},critMode:o.critMode||'never',options:o.options||{}});
const segs=(r,who)=>r.hits.filter(h=>h.name===who&&h.kind!=='normal').map(h=>h.segment);
const near=(a,b,eps=0.05)=>Math.abs(a-b)<eps; const sp=(r,re)=>r.events.filter(e=>e.type==='spGain'&&re.test(e.why));

test('触发表：没有“未建模”；例外只有“对照靶上不会发生”和“不影响伤害”两类，且都带理由',()=>{ const rows=triggerCoverage(effects); assert.deepEqual(rows.filter(r=>r.kind==='unmodeled').map(r=>r.id),[]); for(const r of rows) if(r.kind==='scenario'||r.kind==='noDamage') assert.ok(r.reason,r.id+' 缺理由'); assert.ok(rows.filter(r=>r.kind==='scenario').length>=8); });

test('骏卫铁誓：终结技生成 5 点；每次物理异常或自身连携命中消耗 1 点袭扰（100% + 10 技力），最后一点决胜（450% + 40 技力）；后续效果给战术教导',()=>{
  const r=run([mk('管理员 (男)'),mk('黎风'),mk('骏卫')],[{t:0.5,member:2,kind:'ultimate'},{t:3,member:1,kind:'skill'},{t:5,member:1,kind:'skill'},{t:7,member:2,kind:'skill'},{t:9,member:2,kind:'combo'},{t:12,member:0,kind:'skill'},{t:14,member:1,kind:'skill'}],{energy:[0,0,90],duration:20});
  const s=segs(r,'骏卫'); assert.equal(s.filter(x=>x==='ultimate2').length,4,'袭扰 4 次'); assert.equal(s.filter(x=>x==='ultimate3').length,1,'决胜 1 次'); assert.equal(sp(r,/铁誓袭扰/).length,4); assert.equal(sp(r,/铁誓决胜/)[0].amount,40); assert.ok(r.events.some(e=>(e.type==='buffStart'||e.type==='buffStack')&&/pograni.talent2/.test(e.id)),'战术教导士气激昂（每层独立计时）'); });

test('大潘备料：终结技最后一击 +1 层（20 s）；连携命中消耗一层并立即恢复 40% 冷却',()=>{
  const r=run([mk('大潘'),mk('黎风')],[{t:0.5,member:0,kind:'ultimate'},{t:4,member:1,kind:'skill'},{t:6,member:1,kind:'skill'},{t:8,member:1,kind:'skill'},{t:10,member:1,kind:'skill'},{t:12,member:0,kind:'combo'}],{energy:[90,0],duration:16,sp:600});
  assert.ok(r.events.some(e=>e.type==='resourceGain'&&e.who==='大潘'&&e.resource==='prep')); const cd=r.events.find(e=>e.type==='cdr'&&e.who==='大潘'); assert.ok(cd&&cd.unit==='%'&&cd.value===40); assert.ok(r.events.some(e=>e.type==='resourceSpend'&&e.who==='大潘'&&e.resource==='prep')); });

test('伊冯科技连击：战技施加冻结后下一次普攻直接是重击，且该重击 +50%',()=>{
  const r=run([mk('伊冯'),mk('汤汤')],[{t:0.5,member:1,kind:'skill'},{t:2,member:0,kind:'skill'}],{duration:6}); const n=r.events.filter(e=>e.type==='normalHit'&&e.who==='伊冯'&&e.t>2.48); assert.ok(n[0].heavy,'冻结后的第一次普攻就是重击'); const b=r.events.find(e=>e.type==='buffStart'&&/heavyBonus/.test(e.id)); const e=r.events.find(x=>x.type==='buffEnd'&&/heavyBonus/.test(x.id)); assert.ok(b&&e&&near(e.t,n[0].t),'增益在那次重击后结束'); });

test('诀囹圄：智形态连携 4 s 后爆炸；期间自身战技命中则提前爆炸、追加多段伤害并返还 30 技力；意形态 6 s 后爆炸、不提前',()=>{
  const a=run([mk('诀',0,0),mk('祀')],[{t:0.5,member:0,kind:'skill'},{t:2,member:0,kind:'combo'},{t:4,member:0,kind:'skill'}],{duration:12}); const sa=r=>r.hits.filter(h=>h.name==='诀'&&h.kind==='combo').map(h=>h.t+':'+h.segment); assert.deepEqual(sa(a),['2.72:combo1','4.48:combo2','4.48:combo3']); assert.equal(sp(a,/提前结束囹圄/)[0].amount,30);
  const b=run([mk('诀',0,0),mk('祀')],[{t:0.5,member:0,kind:'skill'},{t:2,member:0,kind:'combo'}],{duration:12}); assert.deepEqual(sa(b),['2.72:combo1','6.72:combo2']);
  const c=run([mk('诀',0,1),mk('祀')],[{t:0.5,member:0,kind:'skill'},{t:2,member:0,kind:'combo'},{t:4,member:0,kind:'skill'}],{duration:12}); assert.deepEqual(sa(c),['2.72:combo1','8.72:combo2']); });

test('管理员源石结晶：连携附着结晶；物理异常消耗它并击碎（400%）、本质瓦解生效；终结技消耗它追加 600% 并给潜能 3 能量；战技消耗给潜能 1 返还',()=>{
  const tl=[{t:0.5,member:1,kind:'skill'},{t:2.5,member:1,kind:'skill'},{t:4.5,member:2,kind:'skill'},{t:6.5,member:2,kind:'combo'},{t:8,member:0,kind:'combo'}]; const team=p=>[mk('管理员 (男)',p),mk('黎风'),mk('骏卫')];
  const a=run(team(0),[...tl,{t:10,member:1,kind:'skill'}],{duration:14}); assert.ok(a.events.some(e=>e.type==='targetState'&&e.id==='crystal')); assert.ok(a.events.some(e=>e.type==='crystalConsumed'&&e.by==='黎风')); assert.ok(segs(a,'管理员 (男)').includes('combo2'),'击碎段'); assert.ok(a.events.some(e=>e.type==='buffStart'&&/disintegrate/.test(e.id)));
  const b=run(team(3),[...tl,{t:10,member:0,kind:'ultimate'}],{energy:[80,0,0],duration:14}); assert.ok(segs(b,'管理员 (男)').includes('ultimate2')); assert.ok(b.events.some(e=>e.type==='energyGain'&&/指引者/.test(e.why)&&e.amount===15));
  const c=run(team(1),[...tl,{t:10,member:0,kind:'skill'}],{duration:14}); assert.equal(sp(c,/苏醒/)[0].amount,50); });

test('洛茜：狼之珀只对已破防目标释放并施加爪印斫痕（每秒 30% 攻击力物理伤害、易伤）；连携两次，第二次消耗附着并按层数加伤、击飞、暴击增益、冷却从第二次起算',()=>{
  const r=run([mk('洛茜'),mk('黎风'),mk('汤汤')],[{t:0.5,member:1,kind:'skill'},{t:2,member:0,kind:'skill'},{t:4,member:2,kind:'skill'},{t:6,member:0,kind:'combo'},{t:8,member:0,kind:'combo'}],{duration:16});
  assert.ok(r.events.some(e=>e.type==='targetState'&&e.id==='scar')); const dots=r.hits.filter(h=>h.name==='洛茜'&&h.segment==='dot'); assert.ok(dots.length>=10&&dots[0].damage>0); const cb=r.hits.filter(h=>h.name==='洛茜'&&h.kind==='combo'); assert.deepEqual(cb.map(h=>h.segment),['combo1','combo2','combo3']); assert.ok(r.events.some(e=>e.type==='consume'&&e.by==='洛茜'&&e.element==='cold'),'第二次消耗寒冷附着'); assert.ok(r.events.some(e=>e.type==='buffStart'&&/wulfa.combo.critRate/.test(e.id))); assert.ok(near(r.final.cooldowns[0].combo,6+14,0.01),'冷却从第一次连携起算，第二次不重置');
  const r0=run([mk('洛茜')],[{t:0.5,member:0,kind:'skill'}],{duration:4}); assert.deepEqual(segs(r0,'洛茜').filter(s=>s.startsWith('skill')),['skill1'],'无破防不放狼之珀'); });

test('敌人攻击只打主控：主控立盾才格挡与反击（昼雪每次立盾只反击一次并回能、噗切娜首次格挡回能并返还 20 技力）；主控受击触发以铁还铁',()=>{
  const team=[mk('昼雪'),mk('噗切娜'),mk('余烬')];
  const a=run(team,[{t:0.5,member:0,kind:'skill'}],{mc:0,duration:9}); const c=a.hits.filter(h=>h.name==='昼雪'&&h.segment==='skill1'); assert.equal(c.length,1,'立盾 5 s 内挨两次打也只反击一次'); assert.ok(near(c[0].t,4),'4 s 敌人攻击时反击'); assert.equal(a.events.filter(e=>e.type==='energyGain'&&/救援专家/.test(e.why)&&e.amount===10).length,1);
  const b=run(team,[{t:1.5,member:1,kind:'skill'}],{mc:1,duration:9}); /* 噗切娜立盾只有 3 s（官方），敌人 4 s 攻击要落在窗口内 */ assert.ok(b.events.some(e=>e.type==='energyGain'&&/道歉也来不及/.test(e.why)&&e.amount===10)); assert.ok(b.events.some(e=>e.type==='spGain'&&/首次格挡/.test(e.why)&&e.amount===20),'首次格挡额外返还 20');
  const c2=run(team,[],{mc:2,duration:9}); assert.ok(c2.events.some(e=>e.type==='buffStart'&&/ironForIron/.test(e.id)));
  const d=run(team,[{t:0.5,member:0,kind:'skill'}],{mc:2,duration:9}); assert.equal(d.hits.filter(h=>h.name==='昼雪'&&h.segment==='skill1').length,0,'不是主控不会被攻击，也就不反击');
  const r0=run([mk('昼雪')],[{t:0.5,member:0,kind:'skill'}],{duration:3}); assert.equal(segs(r0,'昼雪').length,0,'未受击不反击'); });

test('护盾：余烬终结技给全队护盾，卡契尔潜能 5 有护盾时战技命中返还 10 技力',()=>{ const r=run([mk('卡契尔',5),mk('余烬')],[{t:0.5,member:1,kind:'ultimate'},{t:4,member:0,kind:'skill'}],{energy:[0,100],duration:12}); assert.ok(r.events.some(e=>e.type==='shield'&&e.by==='余烬')); assert.equal(sp(r,/无悔抉择/)[0].amount,10); });

test('计数与修饰：弧光第三次消耗导电才触发荒野游人；佩丽卡潜能 4 让连携施加的导电易伤 ×1.33；莱万汀潜能 3 让燃烧跳伤 ×1.5；骏卫潜能 5 让连携技力恢复 ×1.2',()=>{
  const a=run([mk('弧光'),mk('佩丽卡'),mk('汤汤')],[0,20,40].flatMap(b=>[{t:b+0.5,member:2,kind:'skill'},{t:b+2,member:1,kind:'skill'},{t:b+4,member:0,kind:'skill'}]),{duration:60}); const w=a.events.filter(e=>e.type==='buffStart'&&/wanderer/.test(e.id)); assert.equal(w.length,1); assert.ok(near(w[0].t,44));
  const vuln=p=>{ const r=run([mk('汤汤'),mk('佩丽卡',p)],[{t:2,member:1,kind:'combo'}],{duration:7}); return r.hits.find(h=>h.name==='汤汤'&&h.applied.some(x=>x.id==='abn.conduct')).applied.find(x=>x.id==='abn.conduct').value; }; assert.equal(vuln(0),12); assert.ok(near(vuln(4),15.96,1e-6));
  const burn=p=>{ const r=run([mk('莱万汀',p)],[0.5,13,26,39,52].map(t=>({t,member:0,kind:'skill'})),{duration:60}); return r.hits.find(h=>h.name==='莱万汀'&&h.segment==='burnTick'); }; assert.equal(burn(0).factor,1); assert.equal(burn(3).factor,1.5);
  const refund=p=>sp(run([mk('管理员 (男)'),mk('黎风'),mk('骏卫',p)],[{t:0.5,member:1,kind:'skill'},{t:2,member:1,kind:'skill'},{t:4,member:2,kind:'skill'},{t:6,member:2,kind:'combo'}],{duration:10}),/骏卫 连携/)[0].amount; assert.equal(refund(0),12); assert.ok(near(refund(5),14.4,1e-9)); });

test('暴击口径：保底（critMode never）不触发暴击类效果；必暴击时洛茜对斫痕目标的技能命中触发沸血（普攻不算），追加的灼热伤害走正常结算',()=>{
  const tl=[{t:0.5,member:1,kind:'skill'},{t:2,member:0,kind:'skill'},{t:5,member:0,kind:'skill'}]; /* 第一次战技上斫痕，第二次战技的暴击命中才触发沸血 */ const a=run([mk('洛茜'),mk('黎风')],tl,{duration:8}); const b=run([mk('洛茜'),mk('黎风')],tl,{duration:8,critMode:'always'}); const bb=r=>r.events.filter(e=>e.type==='extraHit'&&e.who==='洛茜'&&/boilingBlood/.test(e.effect)); assert.equal(bb(a).length,0); const n=bb(b).length; assert.ok(n>=1&&n<=4,`技能命中次数内：${n}`); const hit=b.hits.find(h=>h.name==='洛茜'&&h.segment==='extraHit'); assert.ok(hit&&hit.factors&&hit.factors.defence<1,'额外一击吃防御'); });

test('连击状态：秋栗终结技给全队连击，队友下一次战技 +30% 并消耗',()=>{ const r=run([mk('秋栗'),mk('黎风')],[{t:0.5,member:0,kind:'ultimate'},{t:4,member:1,kind:'skill'},{t:6,member:1,kind:'skill'}],{energy:[120,0],duration:12}); const h=r.hits.filter(x=>x.name==='黎风'&&x.kind==='skill'); assert.ok(near(h.find(x=>x.t>4&&x.t<5).factors.combo,1.3,1e-9)); assert.equal(h.find(x=>x.t>6).factors.combo,1); assert.ok(r.events.some(e=>e.type==='comboConsumed'&&e.who==='黎风')); });

test('艾维文娜高效派送：掷出 / 召回雷枪每次命中 +4 能量，潜能 1 再 +2，不再重复计数',()=>{ const r=run([mk('艾维文娜',1),mk('佩丽卡')],[{t:0.5,member:1,kind:'skill'},{t:3,member:0,kind:'combo'},{t:6,member:0,kind:'skill'}],{duration:12}); const g=r.events.filter(e=>e.type==='energyGain'&&e.who==='艾维文娜'&&/派送|筹码/.test(e.why)); assert.equal(g.filter(e=>/派送/.test(e.why)).length,4,'掷出 1 次 + 召回 3 支'); assert.ok(g.every(e=>e.amount===4||e.amount===2)); assert.ok(!r.events.some(e=>e.type==='energyGain'&&/雷枪$/.test(e.why)),'虚拟资源回能已删'); });

test('洁尔佩塔重力场：力场期间法术脆弱按目标破防层数额外提升（2 层是 1 层的两倍）',()=>{ const val=n=>{ const tl=[]; for(let i=0;i<n;i++) tl.push({t:0.5+i*1.5,member:1,kind:'skill'}); tl.push({t:4,member:0,kind:'ultimate'},{t:8,member:2,kind:'skill'}); const r=run([mk('洁尔佩塔'),mk('黎风'),mk('汤汤')],tl,{energy:[90,0,0],duration:14,mc:2}); const h=r.hits.find(x=>x.name==='汤汤'&&x.kind==='skill'); return h.applied.find(a=>/aglina.ult.fragile.breach/.test(a.id))?.value||0; }; const v1=val(1), v2=val(2); assert.ok(v1>0,'力场内有破防层数就有额外脆弱'); assert.ok(near(v2,2*v1,1e-6),`${v2} vs 2×${v1}`); });

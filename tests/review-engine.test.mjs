// Independent engine review cases (docs/reviews/engine-review-claude.md). Expected values are hand-derived from
// docs/rules.md formulas and raw data-table numbers written as literals below, not from engine output.
import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js';
import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js';
import {getStats} from '../dist/engine/stats.js'; import {calcSegment} from '../dist/engine/damage.js'; import {skillSegments,mechSegments,calcSkill} from '../dist/engine/skills.js';
import {candidateEffects,appliedFor} from '../dist/engine/resolve.js'; import {ownedEffects} from '../dist/engine/effects.js';
import {simulate} from '../dist/engine/sim/simulate.js'; import {autoPlan,chargeThreshold} from '../dist/engine/sim/plan.js';

const data={operators,weapons,gear,sets,effects};
const op=n=>operators.find(o=>o.name===n); const G=n=>gear.find(g=>g.name===n).id; const W=n=>weapons.find(w=>w.name===n).id;
const ranks12={normal:12,skill:12,combo:12,ultimate:12};
const mk=(name,{weapon=null,gearNames=null,pot=0,consumables=[]}={})=>({operatorId:op(name).id,potential:pot,skillRanks:{...ranks12},weapon:weapon||{id:null},gear:gearNames?{armor:{id:G(gearNames[0]),refine:[3,3,3]},gloves:{id:G(gearNames[1]),refine:[3,3,3]},kit1:{id:G(gearNames[2]),refine:[3,3,3]},kit2:{id:G(gearNames[3]),refine:[3,3,3]}}:{},consumables});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const near=(a,b,eps=1e-6,msg='')=>assert.ok(Math.abs(a-b)<=eps,`${msg} got ${a}, expected ${b}`);
const BIELI_GEAR=['涌浪重装甲','潮涌手甲','悬河供氧栓','生物辅助护板'];
const bieliMember=()=>mk('别礼',{weapon:{id:W('赫拉芬格'),potential:0,ranks:[9,9,4]},gearNames:BIELI_GEAR});
const tangMember=()=>mk('汤汤');

let cases=0, failed=0;
function check(name,fn){ cases++; try{ fn(); } catch(e){ failed++; console.log(`FAIL ${name}: ${e.message}`); } }

// ---------------- A. Panel stats (rules B8/B9/D20/D22) ----------------
check('A1 汤汤 落草 R7/R5 + mixed refine + two-attribute kit + sub%', ()=>{
  const m=mk('汤汤',{pot:2,weapon:{id:W('落草'),potential:0,ranks:[7,5,4]}});
  m.gear={armor:{id:G('长息改装护甲'),refine:[2,0,3]},gloves:{id:G('长息导能护手'),refine:[0,3,1]},kit1:{id:G('纾难识别牌·壹型'),refine:[3,0]},kit2:{id:G('拓荒增量供氧栓'),refine:[1,2,3]}};
  const s=getStats(m,data);
  // agi(main) = 179 base + 60 talent + 116 weapon R7 + 55 纾难 r3 + 35 拓荒 r1 + 20 潜能2
  assert.equal(s.abilities.agi,465);
  // str(sub) = floor((123 + 58 + 55) × (1 + 26.91232%))
  assert.equal(s.abilities.str,Math.floor(236*1.2691232)); assert.equal(s.abilities.str,299);
  assert.equal(s.abilities.int,85+104+65+25);
  // ATK = floor((321+505)×(1+21%) × (1+0.005×465+0.002×299)) = floor(999.46×3.923)
  assert.equal(s.atk.panel,Math.floor(826*1.21*(1+465*0.005+299*0.002))); assert.equal(s.atk.panel,3920);
  near(s.bonuses.comboDmg,26.91+37.95+43.2,1e-9,'comboDmg');
  assert.equal(s.sets.suit_usp02,2);
  assert.ok(!ownedEffects(effects,m,data).some(x=>x.effect.owner.id==='suit_usp02'),'2 pieces must not activate a 3-piece set');
});
check('A2 祀 玉中身 substrate ranks + main%/sub% gear + food after/inside', ()=>{
  const m=mk('祀',{pot:3,weapon:{id:W('玉中身'),potential:3,substrate:[4,6,2]}});
  m.gear={armor:{id:G('长息轻护甲·壹型'),refine:[3,3,0]},gloves:{id:G('长息护手'),refine:[1,2,3]},kit1:{id:G('长息测距仪'),refine:[0,0,0]},kit2:{id:G('生物辅助护板'),refine:[3,3,3]}};
  const s=getStats(m,data);
  // int(main) = floor((179+60+116+113+71+32+27) × (1+26.91232%)) ; str(sub) = floor((117+51+21) × (1+10.35089175%))
  assert.equal(s.abilities.int,758); assert.equal(s.abilities.str,208);
  // weapon slot3 rank = 1 + 潜能3 + 基质2 = 6 → 玉中身 p1 atk +32% (byRank[5]) (rules D22)
  assert.equal(s.atk.atkPct,32);
  assert.equal(s.atk.panel,Math.floor(809*1.32*(1+758*0.005+208*0.002))); assert.equal(s.atk.panel,5559);
  near(s.chargeEff,26.69643,1e-9,'chargeEff'); near(s.bonuses['elem:寒冷'],43.3,1e-9,'weapon cold');
  const food=getStats(m,data,{consumables:['item_894']});
  assert.equal(food.atk.panel,Math.floor(809*1.32*5.206+180)); assert.equal(food.critRate,16);
  const inside=getStats(m,data,{consumables:['item_894'],foodFlatMode:'inside'});
  assert.equal(inside.atk.panel,Math.floor((809*1.32+180)*5.206));
});
check('A3 no weapon, potential 0 vs 5', ()=>{
  const s0=getStats(mk('汤汤'),data); assert.equal(s0.atk.weaponBase,0); assert.equal(s0.atk.panel,Math.floor(321*(1+239*0.005+123*0.002)));
  const s5=getStats(mk('汤汤',{pot:5}),data); assert.equal(s5.abilities.agi,259); assert.equal(s5.atk.panel,Math.floor(321*(1+259*0.005+123*0.002)));
});
check('A4 refine boundaries: missing → 3, >3 clamps, 0 is lowest', ()=>{
  const base=mk('汤汤'); base.gear={armor:{id:G('长息改装护甲')}}; const s=getStats(base,data); assert.equal(s.abilities.int,85+113);
  base.gear.armor.refine=[9,9,9]; assert.equal(getStats(base,data).abilities.int,85+113);
  base.gear.armor.refine=[0,0,0]; assert.equal(getStats(base,data).abilities.int,85+87);
});
check('A5 duplicate accessory counts twice (rules D23)', ()=>{
  const m=mk('汤汤'); m.gear={kit1:{id:G('长息测距仪'),refine:[3,3,3]},kit2:{id:G('长息测距仪'),refine:[0,3,3]}};
  const s=getStats(m,data); assert.equal(s.abilities.int,85+41+32); assert.equal(s.sets.suit_usp02,2);
});
check('A6 consumables null/undefined/unknown are ignored', ()=>{
  const ref=getStats(mk('汤汤'),data).atk.panel;
  for(const c of [null,undefined,[],['no_such_item']]) assert.equal(getStats(mk('汤汤'),data,{consumables:c}).atk.panel,ref);
});
check('A7 管理员 男/女 ids each own their 7 catalog effects at 潜能5', ()=>{
  for(const id of ['chr_0003_endminf_m','chr_0003_endminf']){ const m={operatorId:id,potential:5,skillRanks:{...ranks12}}; assert.ok(getStats(m,data).atk.panel>0); assert.equal(ownedEffects(effects,m,data).length,7,id); }
});
check('A8 黎风 天赋 dependsOn int+will → atk% (talent1 0.15/pt, pot3 +0.05/pt)', ()=>{
  const s0=getStats(mk('黎风'),data); near(s0.atk.atkPct,0.15*(115+117),1e-9,'pot0 atk%');
  assert.equal(s0.atk.panel,Math.floor(312*(1+0.15*232/100)*(1+192*0.005+123*0.002)));
  const s3=getStats(mk('黎风',{pot:3}),data); // 潜能2 全能力+15
  near(s3.atk.atkPct,(0.15+0.05)*(130+132),1e-9,'pot3 atk%');
  assert.equal(s3.atk.panel,Math.floor(312*(1+0.2*262/100)*(1+207*0.005+138*0.002)));
});

// ---------------- B. Single-segment damage (rules A1–A6) ----------------
const synth={atk:{panel:4000},critRate:30,critDmg:80,artsStrength:50,bonuses:{coldElecDmg:20,allSkillDmg:10,normalDmg:7},operator:{}};
const coldSkill={id:'s1',label:'test',element:'cold',kind:'skill',skillKey:'skill',ratio:[100,110,120,130,140,150,160,170,180,190,200,250]};
const eff=(id,zone,applies={},extra={})=>({id,name:id,zone,applies,...extra});
check('B1 every zone multiplies; fragile ×1.5 multiplier; custom −20 resistance', ()=>{
  const applied=[{effect:eff('b','bonus',{elements:['cold']}),value:8},{effect:eff('a','amp',{elements:['cold']}),value:15},
    {effect:eff('f1','fragile',{elements:['cold']}),value:10},{effect:eff('f2','fragile',{damageClass:'arts'}),value:5},
    {effect:eff('fm','other',{kinds:['skill']},{fragileMultiplier:1.5}),value:0},{effect:eff('v','vulnerable'),value:12},
    {effect:eff('phys','bonus',{damageClass:'physical'}),value:99},{effect:eff('ult','amp',{kinds:['ultimate']}),value:99}];
  const r=calcSegment({stats:synth,seg:coldSkill,rank:12,enemy:{defence:50,resistances:{cold:'custom'},custom:{cold:-20}},critMode:'expected',applied,options:{reduction:30,stagger:30}});
  const expected=4000*2.5*(1+0.3*0.8)*(1+(20+10+8)/100)*1.15*(1+(10+5)*1.5/100)*1.12*1.3*(100/150)*1.2*0.7;
  near(r.damage,expected,1e-6,'B1'); near(r.factors.fragile,1.225,1e-12); assert.equal(r.factors.level,1); assert.equal(r.factors.artsStrength,1);
});
check('B2 crit boundaries: rate>100 clamps to 100, never=1, always=1+critDmg', ()=>{
  const st={...synth,critRate:150}; near(calcSegment({stats:st,seg:coldSkill,enemy,critMode:'expected'}).factors.crit,1.8,1e-12);
  assert.equal(calcSegment({stats:st,seg:coldSkill,enemy,critMode:'never'}).factors.crit,1);
  near(calcSegment({stats:{...synth,critRate:-5},seg:coldSkill,enemy,critMode:'expected'}).factors.crit,1,1e-12);
  near(calcSegment({stats:synth,seg:coldSkill,enemy,critMode:'always'}).factors.crit,1.8,1e-12);
});
check('B3 defence 0, reduction 100, resistance clamps', ()=>{
  assert.equal(calcSegment({stats:synth,seg:coldSkill,enemy:{...enemy,defence:0}}).factors.defence,1);
  assert.equal(calcSegment({stats:synth,seg:coldSkill,enemy,options:{reduction:100}}).damage,0);
  assert.equal(calcSegment({stats:synth,seg:coldSkill,enemy,options:{reduction:150}}).damage,0);
  assert.equal(calcSegment({stats:synth,seg:coldSkill,enemy:{resistances:{cold:'custom'},custom:{cold:-150}}}).factors.resistance,2);
  assert.equal(calcSegment({stats:synth,seg:coldSkill,enemy:{resistances:{cold:'B'}}}).factors.resistance,0.5);
});
check('B4 skill rank 1 / 12 and out-of-range clamps', ()=>{
  const at=rank=>calcSegment({stats:synth,seg:coldSkill,rank,enemy}).factors.ratio;
  assert.equal(at(1),1); assert.equal(at(12),2.5); assert.equal(at(0),1); assert.equal(at(13),2.5);
});
check('B5 mechanism damage: level factor, arts strength, abnormal level clamp', ()=>{
  const segs=mechSegments('cold'); const pick=id=>segs.filter(s=>s.id===id);
  const freeze=calcSkill({stats:synth,segments:pick('freeze'),rank:12,enemy,critMode:'never',vars:{abnormal:3}});
  // synth panel has coldElecDmg 20 → mechanism cold hits are in the increase zone too (×1.2); physical crush is not
  near(freeze.total,4000*0.8*4*1.2*(1+89/196)*1.5*0.5,1e-6,'freeze L3');
  const crush=calcSkill({stats:synth,segments:pick('crush'),rank:12,enemy,critMode:'never',vars:{abnormal:9}});
  near(crush.total,4000*1.5*5*(1+89/392)*1.5*0.5,1e-6,'crush clamps to L4');
  const burst=calcSkill({stats:synth,segments:pick('artsBurst'),rank:12,enemy,critMode:'never',vars:{abnormal:0}});
  near(burst.total,4000*1.6*1.2*(1+89/196)*1.5*0.5,1e-6,'burst ignores level');
  const lf={...synth,operator:{exact90:{artsLevelFactor:1.45408163265306}}};
  near(calcSkill({stats:lf,segments:pick('freeze'),rank:12,enemy,critMode:'never',vars:{abnormal:1}}).segments[0].factors.level,1.45408163265306,1e-12);
});
check('B6 burn DoT never crits (rules A5)', ()=>{
  const tick=mechSegments('heat').filter(s=>s.id==='burnTick');
  assert.equal(calcSkill({stats:synth,segments:tick,rank:12,enemy,critMode:'always',vars:{abnormal:2}}).segments[0].factors.crit,1);
});
check('B7 total = Σ segments; per-layer segment with 0 layers is 0', ()=>{
  const stats=getStats(bieliMember(),data); const segs=skillSegments(op('别礼'),'combo');
  const r4=calcSkill({stats,segments:segs,rank:12,enemy,critMode:'never',appliedFor:[],vars:{layers:4}});
  near(r4.total,r4.segments.reduce((a,s)=>a+s.damage,0),1e-9);
  const coldBonus=1+stats.bonuses.coldElecDmg/100; // only panel cold bonus applies with no effects
  near(r4.total,6368*(1.6+1.6+2.4*4)*coldBonus*0.5,1e-6,'combo L4');
  const r0=calcSkill({stats,segments:segs,rank:12,enemy,critMode:'never',appliedFor:[],vars:{layers:0}});
  assert.equal(r0.segments[2].damage,0); near(r0.total,6368*3.2*coldBonus*0.5,1e-6,'combo L0');
});

// ---------------- C. Effect resolution ----------------
check('C1 segment trigger: 赫拉芬格 p3 skips first combo hit, applies to later hits', ()=>{
  const team=[bieliMember()]; const cands=candidateEffects({team,bIdx:0,data}); const segs=skillSegments(op('别礼'),'combo');
  const has=(seg,segIndex)=>appliedFor({candidates:cands,seg,segIndex,data,toggles:{}}).find(a=>a.effect.id==='wpn_claym_0013.p3');
  assert.equal(has(segs[0],0),undefined); assert.equal(has(segs[1],1).value,32); assert.equal(has(segs[2],2).value,32);
  assert.equal(has(segs[1],null),undefined,'unknown segment order → user toggle required');
});
check('C2 teamUnique: same weapon on two owners → one copy, highest rank value', ()=>{
  const w=r=>({id:W(weapons.find(x=>x.id==='wpn_funnel_0004').name),potential:0,ranks:[9,9,r]});
  const team=[mk('赛希',{weapon:w(4)}),mk('佩丽卡',{weapon:w(9)}),tangMember()];
  for(const b of [0,2]){ const c=candidateEffects({team,bIdx:b,data}).filter(x=>x.effect.id==='wpn_funnel_0004.p2');
    assert.equal(c.length,1); const v=appliedFor({candidates:c,seg:{...coldSkill,element:'electric'},data,toggles:{'wpn_funnel_0004.p2':true}})[0].value; assert.equal(v,22.4); }
});
check('C3 dependsOn manual override (0 is a valid value) and cap on the attribute part', ()=>{
  const team=[bieliMember(),mk('赛希')]; const c=candidateEffects({team,bIdx:0,data}); const seg=skillSegments(op('别礼'),'ultimate')[0];
  const val=ov=>appliedFor({candidates:c,seg,data,toggles:{'chr_0011_seraph.ult.amp.cold':true},overrides:ov==null?{}:{'chr_0011_seraph.ult.amp.cold':ov}}).find(a=>a.effect.id==='chr_0011_seraph.ult.amp.cold');
  const z=val(0); assert.equal(z.value,24); assert.equal(z.dependency.origin,'manual'); assert.equal(z.dependency.used,0);
  near(val('100').value,27,1e-9); assert.equal(val(5000).value,24+36);
  const auto=val(null); assert.equal(auto.dependency.origin,'auto'); near(auto.value,24+0.03*127,1e-9); near(val('').value,auto.value,1e-12);
});
check('C4 modifier folding: ×1.2 multiplies (潜能≥3 only), +4 adds to same zone', ()=>{
  const seg=skillSegments(op('别礼'),'ultimate')[0];
  const amp=pot=>{ const team=[bieliMember(),mk('祀',{pot})]; const c=candidateEffects({team,bIdx:0,data}); return appliedFor({candidates:c,seg,data,toggles:{'chr_0036_jsspsi.ult.amp.cold':true}}).find(a=>a.effect.id==='chr_0036_jsspsi.ult.amp.cold').value; };
  assert.equal(amp(2),36); near(amp(3),36*1.2,1e-9);
  const elec={...coldSkill,element:'electric'}; const team=[mk('安塔尔',{pot:5})]; const c=candidateEffects({team,bIdx:0,data});
  const f=appliedFor({candidates:c,seg:elec,data,toggles:{'chr_0023_antal.skill.electricFragile':true,'chr_0023_antal.pot5.electricFragile':true}}).find(a=>a.effect.id==='chr_0023_antal.skill.electricFragile');
  assert.equal(f.value,10+4); assert.ok(f.modifiedBy.includes('chr_0023_antal.pot5.electricFragile'));
});

// ---------------- D. Simulator ----------------
const duo=(extra={})=>({team:[bieliMember(),tangMember()],data,mechanics,timing,enemy,mainControl:0,...extra});
const errs=r=>r.errors.map(e=>e.message);
function conservation(r,initialSp,energyMax){
  let prev=initialSp; let prevE=null;
  for(const e of r.events){ if(e.type==='spOverflow') continue; // logged after the pool update; its Δ is counted on the following spGain
    const now=e.sp.real+e.sp.poison; const d=now-prev; const want=e.type==='spGain'?e.amount:e.type==='spSpend'?-e.cost:0;
    assert.ok(Math.abs(d-want)<=2e-3,`SP ${e.type}@${e.t}: Δ${d} vs ${want}`); prev=now;
    e.energy.forEach((v,i)=>assert.ok(v<=energyMax[i]+1e-6,`energy ${v} > ${energyMax[i]}`)); prevE=e.energy; }
  assert.ok(prevE!==undefined);
}
check('D1 feasible timeline: no errors, SP/energy conservation, total = Σ hits', ()=>{
  const r=simulate({...duo(),timeline:[{t:0.5,member:1,kind:'skill'},{t:2.5,member:1,kind:'combo'},{t:4,member:0,kind:'skill'},{t:6,member:1,kind:'skill'},{t:8,member:0,kind:'combo'}],params:{duration:12}});
  assert.deepEqual(errs(r),[]); conservation(r,200,r.summary.energyMax);
  near(r.summary.total,r.hits.reduce((a,h)=>a+h.damage,0),1e-6);
});
check('D2 infeasible timelines report the specific reason and change no resources', ()=>{
  const cases=[
    [{initial:{sp:50}},[{t:0.2,member:1,kind:'skill'}],/^技力不足：需要 100，当前 51\.6$/],
    [{},[{t:1,member:0,kind:'ultimate'}],/^别礼 终结技能量不足：0\/240$/],
    [{},[{t:1,member:0,kind:'combo'}],/^别礼 连携未触发/],
    [{},[{t:0.5,member:1,kind:'skill'},{t:2,member:1,kind:'combo'},{t:3.5,member:1,kind:'skill'},{t:4.5,member:1,kind:'combo'}],/^汤汤 连携冷却中（至 14s）$/],
    [{},[{t:0.5,member:1,kind:'skill'},{t:1,member:1,kind:'combo'}],/^汤汤 正在执行其他动作/]];
  for(const [extra,tl,re] of cases){ const r=simulate({...duo(extra),timeline:tl,params:{duration:6}});
    assert.equal(r.errors.length,1,JSON.stringify(errs(r))); assert.match(r.errors[0].message,re);
    const at=r.errors[0].t; assert.ok(!r.events.some(e=>e.t===at&&(e.type==='spSpend'||(e.type==='cast'&&e.kind===tl.at(-1).kind&&e.who===op(['别礼','汤汤'][tl.at(-1).member]).name))),'failed action must not spend/cast');
    conservation(r,extra.initial?.sp??200,r.summary.energyMax); }
});
check('D3 returned SP is spent first and yields no ultimate energy; non-control heavy hits restore nothing', ()=>{
  const r=simulate({...duo(),timeline:[{t:0.5,member:0,kind:'skill'},{t:1.5,member:1,kind:'skill'}],params:{duration:5}});
  const spend=r.events.find(e=>e.type==='spSpend'&&e.who==='汤汤'); assert.equal(spend.poison,30); assert.equal(spend.real,70);
  const g=r.events.find(e=>e.type==='energyGain'&&e.who==='汤汤'&&/汤汤 战技/.test(e.why)); near(g.amount,6.5*70/100,1e-9);
  assert.ok(r.events.filter(e=>e.type==='spGain'&&/重击/.test(e.why)).every(e=>e.why.startsWith('别礼')),'only main-control heavy hits restore SP');
  assert.ok(r.events.some(e=>e.type==='normalHit'&&e.who==='汤汤'&&e.heavy),'汤汤 did land a heavy hit as non-control');
  assert.ok(r.events.some(e=>e.type==='energyBlocked'&&e.who==='别礼'),'别礼 only gains energy from own skill/combo');
});
check('D4 别礼 combo consumption applies 低温症 (4×layers cold fragile)', ()=>{
  const r=simulate({...duo(),timeline:[{t:0.5,member:1,kind:'skill'},{t:2.5,member:1,kind:'combo'},{t:4,member:0,kind:'skill'},{t:6,member:1,kind:'skill'},{t:8,member:0,kind:'combo'}],params:{duration:12}});
  const b=r.events.find(e=>e.type==='buffStart'&&e.id==='chr_0026_lastrite.talent.hypothermia'); assert.ok(b,'hypothermia never started'); assert.equal(b.value,12);
});
check('D5 赫拉芬格 p3 (combo hit on cold-attached target) applies to later combo hits only', ()=>{
  const r=simulate({...duo(),timeline:[{t:0.5,member:1,kind:'skill'},{t:2.5,member:1,kind:'combo'},{t:4,member:0,kind:'skill'},{t:6,member:1,kind:'skill'},{t:8,member:0,kind:'combo'}],params:{duration:12}});
  const hits=r.hits.filter(h=>h.name==='别礼'&&h.kind==='combo'); assert.equal(hits.length,3);
  assert.deepEqual(hits.map(h=>h.applied.some(a=>a.id==='wpn_claym_0013.p3')),[false,true,true]);
});
check('D6 梨诺 skill costs 25 SP (rules review: not 100, not 0)', ()=>{
  const r=simulate({team:[mk('梨诺')],data,mechanics,timing,enemy,timeline:[{t:1,member:0,kind:'skill'}],params:{duration:2}});
  assert.equal(r.events.find(e=>e.type==='spSpend').cost,25);
});
check('D7 sim modifier folding equals static: 祀 潜能3 amp 36×1.2 in a 4-member team', ()=>{
  const CX=['长息改装护甲','长息导能护手','长息测距仪','长息重护板'];
  const team=[bieliMember(),tangMember(),mk('祀',{pot:3,gearNames:CX}),mk('诀')];
  const r=simulate({team,data,mechanics,timing,enemy,initial:{energy:[0,0,200,0]},timeline:[{t:0.5,member:2,kind:'ultimate'}],params:{duration:6}});
  const a=r.hits.find(h=>h.name==='别礼'&&h.t>1&&h.element==='cold').applied.find(x=>x.id==='chr_0036_jsspsi.ult.amp.cold'); near(a.value,43.2,1e-3);
});
check('D8 teamUnique in sim: two 长息 owners → beneficiary gets +16 once', ()=>{
  const CX=['长息改装护甲','长息导能护手','长息测距仪','长息重护板'];
  const r=simulate({team:[mk('别礼'),mk('祀',{gearNames:CX}),mk('赛希',{gearNames:CX})],data,mechanics,timing,enemy,initial:{sp:300,energy:[0,200,200]},timeline:[{t:0.5,member:1,kind:'ultimate'},{t:0.6,member:2,kind:'ultimate'}],params:{duration:8}});
  assert.equal(r.events.filter(e=>e.type==='buffStart'&&e.id==='suit_usp02.p1').length,2,'both owners triggered');
  const h=r.hits.find(x=>x.name==='别礼'&&x.t>5); assert.equal(h.applied.filter(a=>a.id==='suit_usp02.p1').length,1);
});
check('D9 管理员 combo does not re-arm itself (“其他干员的连携技”)', ()=>{
  const r=simulate({team:[mk('管理员 (女)'),tangMember()],data,mechanics,timing,enemy,timeline:[{t:0.5,member:1,kind:'skill'},{t:2,member:1,kind:'combo'},{t:4,member:0,kind:'combo'}],params:{duration:8}});
  assert.deepEqual(errs(r),[]); assert.ok(!r.events.some(e=>e.type==='comboReady'&&e.who==='管理员 (女)'&&e.t===4));
});
check('D10 别礼 战技 phantom attach fires on the main controller’s heavy hit (control = 汤汤)', ()=>{
  const r=simulate({...duo({mainControl:1}),timeline:[{t:0.5,member:0,kind:'skill'}],params:{duration:4}});
  const heavy=r.events.find(e=>e.type==='normalHit'&&e.who==='汤汤'&&e.heavy&&e.control&&e.t>0.5);
  const att=r.events.find(e=>e.type==='attach'&&e.by==='别礼'&&e.via==='skill'); assert.ok(att,'no phantom attach'); assert.equal(att.t,heavy.t);
});
check('D11 autoPlan best timeline replays in simulate without errors and with the same total', ()=>{
  const input={...duo(),initial:{sp:200,energy:[0,0]}}; const plan=autoPlan(input,{beam:4,step:1,horizon:30});
  const r=simulate({...input,timeline:plan.best.timeline,params:{duration:30}});
  assert.deepEqual(errs(r),[]); assert.deepEqual(plan.best.errors,[]); near(r.summary.total,plan.best.summary.total,1e-6);
  conservation(r,200,r.summary.energyMax);
});
check('D12 chargeThreshold bisection: −1% fails, result and +1% pass (checked at event-log resolution)', ()=>{
  const input={...duo(),initial:{sp:300,energy:[0,60]},timeline:[{t:0.5,member:1,kind:'skill'},{t:3,member:1,kind:'skill'},{t:6,member:1,kind:'skill'}]};
  const th=chargeThreshold(input,[{member:1,t:7}])[0]; assert.ok(th.feasible); const b=th.requiredExtra;
  const energyAt=extra=>{ const x=[]; x[1]=extra; const s=simulate({...input,params:{duration:8,extraChargeEff:x}}); return [...s.events].reverse().find(e=>e.t<=7+1e-6).energy[1]; };
  assert.ok(energyAt(b-1)<90-1e-6,'b−1 should fail'); assert.ok(energyAt(b)>=90-1e-6,'b should pass'); assert.ok(energyAt(b+1)>=90-1e-6,'b+1 should pass');
  // hand check: 汤汤 energy at 7s = 60 + 3 skills × 6.5 × (1+e) ≥ 90  ⇒  e ≥ 30/19.5 − 1 = 53.85%
  assert.ok(b>=53.846-1e-9&&b<=53.846+0.6,`b=${b}`);
});

check('D13 chargeThreshold counts energy gained between the last sample and the deadline', ()=>{
  // 汤汤 starts at 40; skills at 0.5/3/6 s → by 6.3 s energy = 40 + 3×6.5×(1+x) ≥ 90 ⇒ x ≥ 50/19.5 − 1 = 156.41%
  const input={...duo(),initial:{sp:300,energy:[0,40]},timeline:[{t:0.5,member:1,kind:'skill'},{t:3,member:1,kind:'skill'},{t:6,member:1,kind:'skill'}]};
  const th=chargeThreshold(input,[{member:1,t:6.3}])[0]; const exact=(50/19.5-1)*100;
  assert.ok(th.requiredExtra>=exact-1e-9&&th.requiredExtra<=exact+0.6,`requiredExtra ${th.requiredExtra} vs ${exact}`);
});
console.log(`review-engine: ${cases-failed}/${cases} cases passed`);
if(failed) process.exit(1);

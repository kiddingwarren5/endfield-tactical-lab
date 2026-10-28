// 预设排轴 → 可执行时间轴。把 rotations.js 里的顺序轴交给 greedySchedule，并用 simulate 复现，供一图流页面与 tests/rotations.test.mjs 共用。
import {simulate} from './simulate.js';
import {cycleOf} from './plan.js';

const byName=(arr,n)=>arr.find(x=>x.name===n);
// 保底口径：主控普攻 + 全员战技/连携/终结技/机制伤害；不计非主控的自动普攻（实战不保证打出）。
export const isGuaranteedHit=(hit,mainControl)=>!(hit.kind==='normal'&&hit.member!==mainControl);
export function sumHits(sim,{mainControl,until=Infinity,guaranteed=false}={}){ return sim.hits.filter(hh=>hh.t<=until+1e-6&&(!guaranteed||isGuaranteedHit(hh,mainControl))).reduce((a,hh)=>a+hh.damage,0); }
export function buildTeam(preset,data){
  return preset.team.members.map(m=>{ const op=byName(data.operators,m.op), w=byName(data.weapons,m.weapon); const g=m.gear.map(n=>byName(data.gear,n));
    if(!op||!w||g.some(x=>!x)) throw new Error(`预设编队缺少数据：${m.op}/${m.weapon}/${m.gear.join(',')}`);
    return {operatorId:op.id,potential:m.potential||0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:m.mode??'auto',weapon:{id:w.id,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:g[0].id,refine:[3,3,3]},gloves:{id:g[1].id,refine:[3,3,3]},kit1:{id:g[2].id,refine:[3,3,3]},kit2:{id:g[3].id,refine:[3,3,3]}},consumables:[],buffs:{}}; });
}
// teamOverride：用玩家自己的编队/配装跑预设轴（按干员名对应步骤；主控沿用玩家设置）。
export function presetInput(preset,{data,mechanics,timing,enemy,params={}},scenario,teamOverride){
  const team=teamOverride?.team||buildTeam(preset,data); const names=team.map(m=>m?data.operators.find(o=>o.id===m.operatorId)?.name:null);
  const mainControl=teamOverride?teamOverride.mainControl:names.indexOf(preset.team.mainControl);
  return {team,data,mechanics,timing,enemy:{...enemy,...(scenario?.enemy||{})},mainControl,initial:scenario?.initial||preset.team.initial,params,names};
}
export function teamMatchesPreset(preset,team,data){ const names=(team||[]).filter(Boolean).map(m=>data.operators.find(o=>o.id===m.operatorId)?.name).sort(); const want=preset.team.members.map(m=>m.op).sort(); return names.length===want.length&&names.every((n,i)=>n===want[i]); }
// 场景可替换主轴（首个预设）的动作顺序；其余预设只换敌人与初始资源。
export function stepsFor(preset,scenario,isMain){ return (isMain&&scenario?.steps)||preset.steps; }
// 返回：timeline（含步骤序号）、模拟结果（基准与 δ/φ 区间）、周期、每步执行后的资源快照。
export function resolveRotation(preset,ctx,scenario,isMain=true,teamOverride){
  const input=presetInput(preset,ctx,scenario,teamOverride); const names=input.names; const steps=stepsFor(preset,scenario,isMain);
  const ordered=steps.map(s=>({member:names.indexOf(s.m),kind:s.k,...(s.optional?{optional:true}:{}),...(s.minT?{minT:s.minT}:{}),...(s.wait?{waitFor:{attachLayers:{element:'cold',min:s.wait}}}:{})}));
  const dec=simulate({...input,timeline:[],sequence:ordered,params:{...input.params,duration:150,seqMaxWait:30}}); // 顺序解码：一次模拟得到最早可行时刻
  const g={timeline:dec.scheduled.map(a=>({t:a.t,member:a.member,kind:a.kind,idx:a.idx})),notes:dec.events.filter(e=>e.type==='seqSkip').map(e=>`第 ${e.idx+1} 步 ${names[e.member]} ${e.kind}：${e.message}`),skipped:ordered.map((a,i)=>i).filter(i=>!dec.scheduled.some(x=>x.idx===i))};
  const timeline=g.timeline.map(a=>({t:a.t,member:a.member,kind:a.kind,step:a.idx}));
  const last=timeline.at(-1)?.t??0; const duration=Math.ceil(Math.max(last+6,scenario?.timeLimit||0));
  const run=p=>simulate({...input,timeline,params:{...input.params,duration,...p}});
  const main=run({}); const lo=run({damageFactor:ctx.timing.nonControl.damageFactor[0],rhythmFactor:ctx.timing.nonControl.rhythmFactor[0]}); const hi=run({damageFactor:ctx.timing.nonControl.damageFactor[1],rhythmFactor:ctx.timing.nonControl.rhythmFactor[1]});
  const cycle=cycleOf(main,input.team.map((_,i)=>i)); const end=scenario?.timeLimit??(cycle.complete?cycle.end:duration);
  const states=timeline.map(a=>stateAfter(main,a,names[a.member]));
  return {input,names,steps,timeline,notes:g.notes,skipped:g.skipped,main,lo,hi,cycle,end,duration,states,scenario};
}
// 每一步执行后的状态：技力、各人能量（施放瞬间，已扣费）、寒冷层数（本步 1 s 内的附着/消耗结算后）。
function stateAfter(sim,a,who){
  const cast=sim.events.find(e=>e.type==='cast'&&Math.abs(e.t-a.t)<2e-3&&e.who===who);
  const layerEv=[...sim.events].filter(e=>(e.type==='attach'||e.type==='consume')&&e.element==='cold'&&e.t<=a.t+0.6+1e-6).at(-1); // 战技/连携命中在施放后 0.48–0.72 s
  const cold=layerEv?(layerEv.type==='attach'?layerEv.layers:0):0;
  const consumed=a.kind==='combo'?sim.events.find(e=>e.type==='consume'&&Math.abs(e.t-a.t)<2e-3&&(e.by==null||e.by===who))?.layers:undefined;
  const err=sim.errors.find(e=>Math.abs(e.t-a.t)<2e-3&&e.action?.member===a.member&&e.action?.kind===a.kind);
  return {sp:cast?cast.sp.real+cast.sp.poison:null,energy:cast?cast.energy:null,cold,consumed,stage:cast?.stage,error:err?.message};
}
// 文字轴：给人读的一行一步。
export function rotationText(preset,res){
  const KIND={skill:'战技',combo:'连携技',ultimate:'终结技',plunge:'下落攻击',switch:'切主控'};
  return res.timeline.map((a,i)=>{ const s=res.steps[a.step]; const st=res.states[i]; return `${a.t.toFixed(1)}s ${res.names[a.member]} ${KIND[a.kind]}${s.stage?'「'+s.stage+'」':''}${s.wait?`（寒冷 ${s.wait} 层后）`:''} — ${s.why}${st.consumed?`（消耗 ${st.consumed} 层）`:''}`; }).join('\n');
}

// ---------- 任意编队：自动排轴 → 与预设同构的结果（含每步自动说明），形态切换（如诀智/意）逐一搜索取最优 ----------
import {autoPlan,annealSequence,mctsSequence,evalSequence} from './plan.js';
import {effectiveMode} from '../skills.js';
const EL_CN={physical:'物理',cold:'寒冷',heat:'灼热',electric:'电磁',nature:'自然'};
const ABN_CN={burn:'燃烧',conduct:'导电',freeze:'冻结',corrosion:'腐蚀'};
export function explainStep(sim,a,who){
  const nextCast=sim.events.find(e=>e.type==='cast'&&e.who===who&&e.t>a.t+1e-6); const hi=Math.min(a.t+1.0,nextCast?nextCast.t-1e-3:Infinity); const near=e=>e.t>=a.t-1e-6&&e.t<=hi+1e-6; const parts=[]; const cast=sim.events.find(e=>e.type==='cast'&&Math.abs(e.t-a.t)<2e-3&&e.who===who);
  if(cast?.cost!=null) parts.push(`消耗 ${cast.cost} 技力`);
  for(const e of sim.events){ if(!near(e)) continue; if(e.type==='earlyWave'&&e.by===who) parts.push(`提前引爆${e.who}的巨浪`); if(e.type==='inkBurst'&&e.who===who) parts.push(`笔意爆发 ${Math.round(e.damage).toLocaleString('zh-CN')}`); if(e.type==='inkStart'&&e.who===who) parts.push(`笔意开始记录（至 ${(+e.until).toFixed(1)}s）`); if(e.type==='attach'&&e.by===who) parts.push(`施加${EL_CN[e.element]||e.element}附着 → ${e.layers} 层`); if(e.type==='consume'&&Math.abs(e.t-a.t)<2e-3&&a.kind==='combo') parts.push(`消耗 ${e.layers} 层${EL_CN[e.element]||''}附着`); if(e.type==='abnormal'&&e.by===who) parts.push(`触发${ABN_CN[e.which]||e.which} ${e.level} 级`); if(e.type==='buffStart'&&e.owner===who&&e.name) parts.push(`上「${e.name}」${e.value>0?'+'+e.value+'%':''}`); if(e.type==='cdr'&&e.by===who&&e.who) parts.push(`${e.who} 连携冷却 ${(+e.before).toFixed(1)}→${(+e.after).toFixed(1)}s`); if(e.type==='energyGain'&&e.who===who&&/连携回能|自身回能/.test(e.why)) parts.push(`自身 +${Math.round(e.amount)} 能量`); if(e.type==='spGain'&&/返还|恢复/.test(e.why)&&e.why.startsWith(who)) parts.push(`返还 ${Math.round(e.amount)} 技力`); }
  const uniq=[...new Set(parts)]; return uniq.slice(0,5).join('；')||'（事件日志中无额外效果）';
}
// 自动轴分节：终结技簇（相邻终结技间隔 ≤ 8 s）开始时起新节（爆发），簇结束后第一个相隔 ≥ 3 s 的动作再起新节（充能）。
function segmentize(timeline){ let seg=1, lastUlt=-Infinity, inBurst=false; return timeline.map((a,i)=>{ const ult=a.kind==='ultimate'; if(ult){ if(!inBurst&&i>0){ seg++; } inBurst=true; lastUlt=a.t; } else if(inBurst&&a.t-lastUlt>=3){ inBurst=false; seg++; } return seg; }); }
function finish(input,ctx,timeline,scenario,plan,modeNote){
  const names=input.names; const last=timeline.at(-1)?.t??0; const duration=Math.ceil(Math.max(last+6,scenario?.timeLimit||0));
  const run=p=>simulate({...input,timeline,params:{...input.params,duration,...p}});
  const main=run({}); const lo=run({damageFactor:ctx.timing.nonControl.damageFactor[0],rhythmFactor:ctx.timing.nonControl.rhythmFactor[0]}); const hi=run({damageFactor:ctx.timing.nonControl.damageFactor[1],rhythmFactor:ctx.timing.nonControl.rhythmFactor[1]});
  const cycle=cycleOf(main,input.team.map((_,i)=>i).filter(i=>input.team[i])); const end=scenario?.timeLimit??(cycle.complete?cycle.end:duration);
  const segs=segmentize(timeline); const steps=timeline.map((a,i)=>({m:names[a.member],k:a.kind,seg:segs[i],why:explainStep(main,a,names[a.member]),stage:main.events.find(e=>e.type==='cast'&&Math.abs(e.t-a.t)<2e-3&&e.who===names[a.member])?.stage}));
  const tl=timeline.map((a,i)=>({t:a.t,member:a.member,kind:a.kind,step:i})); const states=tl.map(a=>stateAfter(main,a,names[a.member]));
  const slim={team:input.team,mainControl:input.mainControl,enemy:input.enemy,initial:input.initial,names:input.names}; // 结果里不带数据表引用，便于跨线程传递
  return {input:slim,names,steps,timeline:tl,notes:[],skipped:[],main,lo,hi,cycle,end,duration,states,scenario,auto:true,plan,modeNote};
}
export function autoRotation(team,mainControl,ctx,scenario,{beam=6,step=1,horizon=60,onProgress,annealMs=10000,annealEvals=3000,mctsMs=10000,mctsIters=2000}={}){ /* 4.5 s/路线时别礼终结技常被排到第二个（未收敛）；10 s 与 20 s 结果一致 */
  const {data}=ctx; const base={team,data,mechanics:ctx.mechanics,timing:ctx.timing,enemy:{...ctx.enemy,...(scenario?.enemy||{})},mainControl,initial:scenario?.initial||{sp:200,energy:[0,0,0,0]},params:{}};
  base.names=team.map(m=>m?data.operators.find(o=>o.id===m.operatorId)?.name:null);
  // 形态枚举：有 modeVariants 的干员（诀）在“自动”时分别按形态 0/1 搜索
  const modeSlots=team.map((m,i)=>m&&data.operators.find(o=>o.id===m.operatorId)?.skills?.skill?.modeVariants&&typeof m.mode!=='number'?i:null).filter(i=>i!=null);
  const combos=modeSlots.length?modeSlots.reduce((acc,i)=>acc.flatMap(c=>[0,1].map(v=>({...c,[i]:v}))),[{}]):[{}];
  const MODE_CN=['阵诀·智','阵诀·意']; const cands=[]; const sig=tl=>tl.map(a=>`${a.member}${a.kind[0]}`).join('');
  combos.forEach((modes,ci)=>{ const t2=team.map((m,i)=>m&&modes[i]!=null?{...m,mode:modes[i]}:m); const input={...base,team:t2}; const prog=f=>onProgress&&onProgress((ci+f)/combos.length);
    const modeTag=modeSlots.map(i=>`${base.names[i]} ${MODE_CN[modes[i]]}`).join('，');
    // 多条独立路线，各自给出一条候选轴：束搜索热启动 → 退火；MCTS；MCTS → 退火；以及“集中爆发”目标下的退火与 MCTS
    const plan=autoPlan(input,{beam,step,horizon,objective:'guaranteed',onProgress:f=>prog(f*0.15)}); const seq0=[...plan.best.timeline].sort((a,b)=>a.t-b.t); const H=Math.max(horizon,Math.ceil((plan.best.score.until||horizon)+10));
    const routes=[];
    routes.push({name:'均衡 · 退火',objective:'guaranteed',r:annealSequence(input,seq0,{horizon:H,objective:'guaranteed',budgetMs:annealMs,maxEvals:annealEvals,onProgress:f=>prog(0.15+f*0.2),seed:1})});
    const mc=mctsSequence(input,{horizon:H,objective:'guaranteed',budgetMs:mctsMs,maxIters:mctsIters,seedSeq:seq0,onProgress:f=>prog(0.35+f*0.2),seed:7}); routes.push({name:'均衡 · 树搜索',objective:'guaranteed',r:mc});
    routes.push({name:'均衡 · 树搜索+退火',objective:'guaranteed',r:annealSequence(input,mc.sequence.length?mc.sequence:seq0,{horizon:H,objective:'guaranteed',budgetMs:Math.round(annealMs*0.6),maxEvals:Math.round(annealEvals*0.6),onProgress:f=>prog(0.55+f*0.15),seed:3})});
    routes.push({name:'集中爆发 · 退火',objective:'burst',r:annealSequence(input,seq0,{horizon:H,objective:'burst',budgetMs:annealMs,maxEvals:annealEvals,onProgress:f=>prog(0.7+f*0.15),seed:5})});
    routes.push({name:'集中爆发 · 树搜索',objective:'burst',r:mctsSequence(input,{horizon:H,objective:'burst',budgetMs:Math.round(mctsMs*0.8),maxIters:Math.round(mctsIters*0.8),seedSeq:seq0,onProgress:f=>prog(0.85+f*0.15),seed:11})});
    for(const x of routes){ if(!x.r.score||!x.r.timeline.length) continue; const res=finish(input,ctx,x.r.timeline,scenario,{...plan,improved:{method:x.name,evals:x.r.evals||x.r.iters,ms:x.r.ms}},null); const sure=sumHits(res.main,{until:res.end,mainControl,guaranteed:true})/Math.max(1,res.end); cands.push({name:x.name,objective:x.objective,modes,modeTag,res,sure,sig:sig(x.r.timeline)}); } });
  // 去重（动作顺序相同只留一个），按保底每秒排序，最多 4 条候选
  const uniq=[]; for(const c of cands.sort((a,b)=>b.sure-a.sure)){ if(uniq.some(u=>u.sig===c.sig)) continue; uniq.push(c); if(uniq.length>=4) break; }
  const best=uniq[0]; if(!best) throw new Error('没有找到可执行的轴');
  best.res.candidates=uniq.map((c,i)=>({name:`方案 ${i+1}${c.modeTag?' · '+c.modeTag:''}`,method:c.name,sure:Math.round(c.sure),objective:c.objective,res:i===0?null:c.res}));
  if(modeSlots.length){ best.res.modeNote=uniq.map(c=>`${c.modeTag}：保底每秒 ${Math.round(c.sure).toLocaleString('zh-CN')}`).join('；'); best.res.modeChoice=best.modes; }
  return best.res;
}

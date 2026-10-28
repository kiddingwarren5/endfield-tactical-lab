// 预设排轴 → 可执行时间轴。把 rotations.js 里的顺序轴交给 greedySchedule，并用 simulate 复现，供一图流页面与 tests/rotations.test.mjs 共用。
import {simulate} from './simulate.js';
import {greedySchedule,cycleOf} from './plan.js';

const byName=(arr,n)=>arr.find(x=>x.name===n);
// 保底口径：主控普攻 + 全员战技/连携/终结技/机制伤害；不计非主控的自动普攻（实战不保证打出）。
export const isGuaranteedHit=(hit,mainControl)=>!(hit.kind==='normal'&&hit.member!==mainControl);
export function sumHits(sim,{mainControl,until=Infinity,guaranteed=false}={}){ return sim.hits.filter(hh=>hh.t<=until+1e-6&&(!guaranteed||isGuaranteedHit(hh,mainControl))).reduce((a,hh)=>a+hh.damage,0); }
export function buildTeam(preset,data){
  return preset.team.members.map(m=>{ const op=byName(data.operators,m.op), w=byName(data.weapons,m.weapon); const g=m.gear.map(n=>byName(data.gear,n));
    if(!op||!w||g.some(x=>!x)) throw new Error(`预设编队缺少数据：${m.op}/${m.weapon}/${m.gear.join(',')}`);
    return {operatorId:op.id,potential:m.potential||0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:0,weapon:{id:w.id,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:g[0].id,refine:[3,3,3]},gloves:{id:g[1].id,refine:[3,3,3]},kit1:{id:g[2].id,refine:[3,3,3]},kit2:{id:g[3].id,refine:[3,3,3]}},consumables:[],buffs:{}}; });
}
export function presetInput(preset,{data,mechanics,timing,enemy,params={}},scenario){
  const team=buildTeam(preset,data); const names=preset.team.members.map(m=>m.op);
  return {team,data,mechanics,timing,enemy:{...enemy,...(scenario?.enemy||{})},mainControl:names.indexOf(preset.team.mainControl),initial:scenario?.initial||preset.team.initial,params};
}
// 场景可替换主轴（首个预设）的动作顺序；其余预设只换敌人与初始资源。
export function stepsFor(preset,scenario,isMain){ return (isMain&&scenario?.steps)||preset.steps; }
// 返回：timeline（含步骤序号）、模拟结果（基准与 δ/φ 区间）、周期、每步执行后的资源快照。
export function resolveRotation(preset,ctx,scenario,isMain=true){
  const input=presetInput(preset,ctx,scenario); const names=preset.team.members.map(m=>m.op); const steps=stepsFor(preset,scenario,isMain);
  const ordered=steps.map(s=>({member:names.indexOf(s.m),kind:s.k,...(s.minT?{minT:s.minT}:{}),...(s.wait?{waitFor:{attachLayers:{element:'cold',min:s.wait}}}:{})}));
  const g=greedySchedule(input,ordered,{horizon:150,maxGap:30});
  const timeline=g.timeline.map((a,i)=>({...a,step:i}));
  const last=timeline.at(-1)?.t??0; const duration=Math.ceil(Math.max(last+6,scenario?.timeLimit||0));
  const run=p=>simulate({...input,timeline,params:{...input.params,duration,...p}});
  const main=run({}); const lo=run({damageFactor:ctx.timing.nonControl.damageFactor[0],rhythmFactor:ctx.timing.nonControl.rhythmFactor[0]}); const hi=run({damageFactor:ctx.timing.nonControl.damageFactor[1],rhythmFactor:ctx.timing.nonControl.rhythmFactor[1]});
  const cycle=cycleOf(main,input.team.map((_,i)=>i)); const end=scenario?.timeLimit??(cycle.complete?cycle.end:duration);
  const states=timeline.map(a=>stateAfter(main,a,names[a.member]));
  return {input,names,steps,timeline,notes:g.notes,main,lo,hi,cycle,end,duration,states,scenario};
}
// 每一步执行后的状态：技力、各人能量（施放瞬间，已扣费）、寒冷层数（本步 1 s 内的附着/消耗结算后）。
function stateAfter(sim,a,who){
  const cast=sim.events.find(e=>e.type==='cast'&&Math.abs(e.t-a.t)<1e-6&&e.who===who);
  const layerEv=[...sim.events].filter(e=>(e.type==='attach'||e.type==='consume')&&e.element==='cold'&&e.t<=a.t+0.6+1e-6).at(-1); // 战技/连携命中在施放后 0.48–0.72 s
  const cold=layerEv?(layerEv.type==='attach'?layerEv.layers:0):0;
  const consumed=a.kind==='combo'?sim.events.find(e=>e.type==='consume'&&Math.abs(e.t-a.t)<1e-6)?.layers:undefined;
  const err=sim.errors.find(e=>Math.abs(e.t-a.t)<1e-6&&e.action?.member===a.member&&e.action?.kind===a.kind);
  return {sp:cast?cast.sp.real+cast.sp.poison:null,energy:cast?cast.energy:null,cold,consumed,stage:cast?.stage,error:err?.message};
}
// 文字轴：给人读的一行一步。
export function rotationText(preset,res){
  const KIND={skill:'战技',combo:'连携技',ultimate:'终结技'};
  return res.timeline.map((a,i)=>{ const s=res.steps[a.step]; const st=res.states[i]; return `${a.t.toFixed(1)}s ${res.names[a.member]} ${KIND[a.kind]}${s.stage?'「'+s.stage+'」':''}${s.wait?`（寒冷 ${s.wait} 层后）`:''} — ${s.why}${st.consumed?`（消耗 ${st.consumed} 层）`:''}`; }).join('\n');
}

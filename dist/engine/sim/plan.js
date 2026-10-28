// 批次 7：自动排轴（束搜索 + 候选对照）与充能阈值（二分）。以 simulate() 为唯一评估器，不另建资源模型。
import {simulate} from './simulate.js';
const clone=x=>JSON.parse(JSON.stringify(x));
export const PLAN_VERSION='0.1.0';

// 周期口径：所有入队干员至少各放一次终结技；周期结束 = 最后一个用于满足条件的终结技伤害全部结算完。
export function cycleOf(sim,memberIdxs){ const ultHits=sim.hits.filter(h=>h.kind==='ultimate');
  const castByMember={}; for(const e of sim.events) if(e.type==='cast'&&e.kind==='ultimate'){ const m=sim.hits.find(h=>h.name===e.who)?.member; if(m!=null&&castByMember[m]==null) castByMember[m]=e.t; }
  const complete=memberIdxs.every(i=>castByMember[i]!=null); if(!complete) return {complete:false,end:null,castByMember};
  const lastCast=Math.max(...memberIdxs.map(i=>castByMember[i])); const settle=ultHits.filter(h=>h.t>=lastCast).reduce((a,h)=>Math.max(a,h.t),lastCast); return {complete:true,end:settle+0.05,castByMember}; }
export function scoreOf(sim,memberIdxs,horizon){ const cyc=cycleOf(sim,memberIdxs); const until=cyc.complete?cyc.end:horizon; const dmg=sim.hits.filter(h=>h.t<=until).reduce((a,h)=>a+h.damage,0); const dps=dmg/Math.max(1,until); return {dps:cyc.complete?dps:dps*0.5,total:dmg,until,complete:cyc.complete,cycle:cyc}; }

function feasibleActions(sim,members,t,mechanicsById){ // from the simulation state near t (samples + events)
  const s=[...sim.samples].reverse().find(x=>x.t<=t+1e-6)||sim.samples[0]; if(!s) return []; const acts=[]; const spAvail=s.sp;
  const comboReady={}; for(const e of sim.events){ if(e.t>t+1e-6) break; if(e.type==='comboReady') comboReady[e.who]=e.until; if(e.type==='cast'&&e.kind==='combo') comboReady[e.who]=0; }
  const ultCd={},comboCd={}; for(const e of sim.events){ if(e.t>t+1e-6) break; if(e.type==='cast'&&e.kind==='ultimate') ultCd[e.who]=e.cooldownUntil; if(e.type==='cast'&&e.kind==='combo') comboCd[e.who]=e.cooldownUntil; }
  members.forEach((m,k)=>{ if(spAvail>=100-1e-6) acts.push({member:m.idx,kind:'skill'}); if(comboReady[m.name]>t&&!(comboCd[m.name]>t)) acts.push({member:m.idx,kind:'combo'}); if((s.energy[k]||0)>=m.energyMax-1e-6&&!(ultCd[m.name]>t)) acts.push({member:m.idx,kind:'ultimate'}); });
  return acts; }

export function autoPlan(input,{beam=8,step=1.0,horizon=40,onProgress}={}){
  const {team,data}=input; const members=team.map((m,i)=>m?{idx:i,name:data.operators.find(o=>o.id===m.operatorId)?.name}:null).filter(Boolean);
  const memberIdxs=members.map(m=>m.idx);
  const evalTl=tl=>simulate({...input,timeline:tl,params:{...(input.params||{}),duration:horizon}});
  const dry=evalTl([]); members.forEach((m,k)=>{ m.energyMax=dry.summary.energyMax?.[k]??100; });
  let beams=[{tl:[],sim:dry,score:scoreOf(dry,memberIdxs,horizon)}]; const explored=[];
  for(let t=0;t<=horizon;t+=step){ const next=[]; for(const b of beams){ next.push(b); // wait
      const acts=feasibleActions(b.sim,members,t); for(const a of acts){ if(b.tl.some(x=>Math.abs(x.t-t)<step-1e-6&&x.member===a.member)) continue; const tl=[...b.tl,{t:Math.round(t*10)/10,...a}].sort((p,q)=>p.t-q.t); const sim=evalTl(tl); if(sim.errors.some(e=>Math.abs(e.t-t)<1e-6)) continue; next.push({tl,sim,score:scoreOf(sim,memberIdxs,horizon)}); } }
    // de-dup by timeline signature; keep best `beam`
    const seen=new Set(); const uniq=[]; for(const n of next){ const sig=n.tl.map(a=>`${a.t}:${a.member}:${a.kind}`).join('|'); if(seen.has(sig)) continue; seen.add(sig); uniq.push(n); }
    uniq.sort((a,b)=>heuristic(b,t,horizon)-heuristic(a,t,horizon)); beams=uniq.slice(0,beam); if(onProgress) onProgress(t/horizon); if(beams[0]?.score.complete&&t>beams[0].score.until+2) break; }
  const ranked=[...beams].sort((a,b)=>b.score.dps-a.score.dps); const best=ranked[0];
  return {planVersion:PLAN_VERSION,best:{timeline:best.tl,score:best.score,summary:best.sim.summary,errors:best.sim.errors},candidates:ranked.slice(1,5).map(c=>({timeline:c.tl,score:c.score,diff:diffTimelines(best.tl,c.tl)})),objective:'所有干员至少一次终结技的周期内平均每秒伤害（不完整周期按 0.5 折算）',searchSpace:{beam,step,horizon,evaluated:'束搜索：每个决策点展开可行动作（战技/连携/终结技），保留分值前 '+beam+' 条'},rationale:rationaleOf(best)}; }
function heuristic(b,t,horizon){ // damage so far per second + progress bonus for ults cast
  const dmg=b.sim.hits.filter(h=>h.t<=t+1e-6).reduce((a,h)=>a+h.damage,0); const ults=b.sim.events.filter(e=>e.type==='cast'&&e.kind==='ultimate'&&e.t<=t+1e-6).length; return dmg/Math.max(1,t+1)+ults*2000+(b.score.complete?b.score.dps:0); }
function diffTimelines(a,b){ const sa=new Set(a.map(x=>`${x.t}:${x.member}:${x.kind}`)), sb=new Set(b.map(x=>`${x.t}:${x.member}:${x.kind}`)); return {removed:[...sa].filter(x=>!sb.has(x)),added:[...sb].filter(x=>!sa.has(x))}; }
function rationaleOf(b){ const r=[]; const casts=b.sim.events.filter(e=>e.type==='cast'); const ults=casts.filter(e=>e.kind==='ultimate'); if(ults.length) r.push(`终结技时刻：${ults.map(u=>`${u.who} ${u.t}s`).join('、')}`); const over=b.sim.events.filter(e=>e.type==='spOverflow').length; r.push(over?`技力溢出事件 ${over} 次（可考虑提前战技）`:'无技力溢出'); const eo=b.sim.events.filter(e=>e.type==='energyOverflow').length; if(eo) r.push(`终结技能量溢出 ${eo} 次`); r.push(b.score.complete?`周期 ${b.score.until.toFixed(1)}s 内全员终结技各≥1 次`:'在时限内未能让全员各放一次终结技（周期不完整，按 0.5 折算）'); return r; }

// 充能阈值：对固定轴，求使干员 i 在 T 前能量满所需的最低充能效率增量（二分，前提：能量随效率单调不减）。
export function chargeThreshold(input,deadlines,{lo=-100,hi=400,tol=0.5}={}){
  const {team,data}=input; const names=team.map(m=>m?data.operators.find(o=>o.id===m.operatorId)?.name:null);
  const energyAt=(sim,idx,T)=>{ const k=team.slice(0,idx).filter(Boolean).length; const s=[...sim.samples].reverse().find(x=>x.t<=T+1e-6); return s?.energy[k]??0; };
  const results=[]; for(const d of deadlines){ const idx=d.member; const base=simulate({...input,params:{...(input.params||{}),duration:Math.max(d.t+1,input.params?.duration||40)}}); const k=team.slice(0,idx).filter(Boolean).length; const max=base.summary.energyMax?.[k]??0; const cur=energyAt(base,idx,d.t); const curEff=base.summary.chargeEff?.[k]??0;
    const ok=e=>{ const extra=[]; extra[idx]=e; const sim=simulate({...input,params:{...(input.params||{}),duration:Math.max(d.t+1,input.params?.duration||40),extraChargeEff:extra}}); return energyAt(sim,idx,d.t)>=max-1e-6; };
    let res; if(ok(lo)){ res={feasible:true,requiredExtra:lo,note:'即使效率降至下界也满足'}; } else if(!ok(hi)){ res={feasible:false,note:`充能效率增至 +${hi}% 仍无法在 ${d.t}s 前充满（可能需要改变轴或能量来源）`}; } else { let a=lo,b=hi; while(b-a>tol){ const m=(a+b)/2; if(ok(m)) b=m; else a=m; } res={feasible:true,requiredExtra:Math.round(b*10)/10}; }
    results.push({member:idx,name:names[idx],deadline:d.t,energyMax:max,currentEnergyAtDeadline:Math.round(cur*10)/10,currentChargeEff:curEff,...res,requiredTotal:res.requiredExtra!=null?Math.round((curEff+res.requiredExtra)*10)/10:null,premises:['阈值基于当前这条轴；改变动作后需重算','能量来源：战技（真实技力）与连携回能均乘充能效率（规则 B10）；特殊回能按目录标记','舍入：二分精度 '+tol+'%，边界值请在界面两侧各试 1%','非主控普攻不产生能量；毒技力消耗不回能']}); }
  return results; }

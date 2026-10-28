// 批次 7：自动排轴（束搜索 + 候选对照）与充能阈值（二分）。以 simulate() 为唯一评估器，不另建资源模型。
import {simulate} from './simulate.js';
const clone=x=>JSON.parse(JSON.stringify(x));
export const PLAN_VERSION='0.1.0';

// 周期口径：所有入队干员至少各放一次终结技；周期结束 = 最后一个用于满足条件的终结技伤害全部结算完。
export function cycleOf(sim,memberIdxs){ const names=sim.summary.names||[], idxs=sim.summary.memberIdx||[]; const idxOfName=n=>idxs[names.indexOf(n)];
  const castByMember={}; for(const e of sim.events) if(e.type==='cast'&&e.kind==='ultimate'){ const m=idxOfName(e.who); if(m!=null&&castByMember[m]==null) castByMember[m]=e.t; }
  const complete=memberIdxs.every(i=>castByMember[i]!=null); if(!complete) return {complete:false,end:null,castByMember};
  // 周期末 = 最后一个“用于满足条件”的终结技（各成员首次）伤害全部结算完；无伤害终结技按施放时刻；时限内尚未结算 → 不完整
  let end=0; for(const i of memberIdxs){ const t0=castByMember[i]; const name=names[idxs.indexOf(i)]; const laterUlt=sim.events.find(e=>e.type==='cast'&&e.kind==='ultimate'&&e.who===name&&e.t>t0+1e-6); const hitsOf=sim.hits.filter(h=>h.member===i&&h.kind==='ultimate'&&h.t>=t0-1e-6&&(!laterUlt||h.t<laterUlt.t)); if(!hitsOf.length&&(sim.summary.params?.duration??Infinity)<t0+2.5) return {complete:false,end:null,castByMember,note:'终结技伤害未在时限内结算'}; const settle=hitsOf.length?Math.max(...hitsOf.map(h=>h.t)):t0; end=Math.max(end,settle); }
  return {complete:true,end:end+0.05,castByMember}; }
// objective 'guaranteed'：只计主控普攻 + 全员技能（不计副控自动普攻），与页面“保底”口径一致
export function scoreOf(sim,memberIdxs,horizon,objective,mainControl){ const cyc=cycleOf(sim,memberIdxs); const until=cyc.complete?cyc.end:horizon; const keep=h=>objective==='total'||!(h.kind==='normal'&&h.member!==mainControl); const dmg=sim.hits.filter(h=>h.t<=until&&keep(h)).reduce((a,h)=>a+h.damage,0); let dps=dmg/Math.max(1,until);
  // 'burst'：要求全员首次终结技集中释放（首尾间隔 ≤ 12 s，含演出），分散则按比例折扣 —— 对应玩家“攒满后四连开”的打法
  if(objective==='burst'&&cyc.complete){ const ts=Object.values(cyc.castByMember); const spread=Math.max(...ts)-Math.min(...ts); const W=12; if(spread>W) dps*=W/spread;
    // 主控（主C）的终结技收尾：辅助先上增幅/脆弱，主C最后放；主C不是最后则折扣
    const mcT=cyc.castByMember[mainControl]; if(mcT!=null&&ts.some(t=>t>mcT+1e-6)) dps*=0.7; }
  return {dps:cyc.complete?dps:dps*0.5,total:dmg,until,complete:cyc.complete,cycle:cyc}; }

function feasibleActions(sim,members,t,mechanicsById){ // from the simulation state near t (samples + events)
  const s=[...sim.samples].reverse().find(x=>x.t<=t+1e-6)||sim.samples[0]; if(!s) return []; const acts=[]; const spAvail=s.sp;
  const comboReady={}; for(const e of sim.events){ if(e.t>t+1e-6) break; if(e.type==='comboReady') comboReady[e.who]=e.until; if(e.type==='cast'&&e.kind==='combo') comboReady[e.who]=0; }
  const ultCd={},comboCd={}; for(const e of sim.events){ if(e.t>t+1e-6) break; if(e.type==='cast'&&e.kind==='ultimate') ultCd[e.who]=e.cooldownUntil; if(e.type==='cast'&&e.kind==='combo') comboCd[e.who]=e.cooldownUntil; }
  members.forEach((m,k)=>{ const cost=m.skillCost??100; if(spAvail>=cost-1e-6) acts.push({member:m.idx,kind:'skill'}); if(comboReady[m.name]>=t-1e-6&&!(comboCd[m.name]>t+1e-6)) acts.push({member:m.idx,kind:'combo'}); if((s.energy[k]||0)>=m.energyMax-1e-6&&!(ultCd[m.name]>t+1e-6)) acts.push({member:m.idx,kind:'ultimate'}); });
  return acts; }

export function autoPlan(input,{beam=8,step=1.0,horizon=40,onProgress,objective='guaranteed'}={}){ const mc=input.mainControl??0;
  const {team,data}=input; const members=team.map((m,i)=>m?{idx:i,name:data.operators.find(o=>o.id===m.operatorId)?.name}:null).filter(Boolean);
  const memberIdxs=members.map(m=>m.idx);
  const evalTl=tl=>simulate({...input,timeline:tl,params:{...(input.params||{}),duration:horizon}});
  const dry=evalTl([]); members.forEach((m,k)=>{ m.energyMax=dry.summary.energyMax?.[k]??100; const mech=(input.mechanics||[]).find(x=>x.operatorId===team[m.idx].operatorId); const c=mech?.skill?.spCost; m.skillCost=typeof c==='number'?c:(c?.value??c?.byRank?.[11]??100); });
  const keep=h=>objective==='total'||!(h.kind==='normal'&&h.member!==mc); let beams=[{tl:[],sim:dry,keep,score:scoreOf(dry,memberIdxs,horizon,objective,mc)}]; const explored=[];
  for(let t=0;t<=horizon;t+=step){ const next=[]; for(const b of beams){ next.push(b); // wait
      const acts=feasibleActions(b.sim,members,t); for(const a of acts){ if(b.tl.some(x=>Math.abs(x.t-t)<step-1e-6&&x.member===a.member)) continue; const tl=[...b.tl,{t:Math.round(t*10)/10,...a}].sort((p,q)=>p.t-q.t); const sim=evalTl(tl); if(sim.errors.some(e=>Math.abs(e.t-t)<1e-6)) continue; next.push({tl,sim,keep,score:scoreOf(sim,memberIdxs,horizon,objective,mc)}); } }
    // de-dup by timeline signature; keep best `beam`
    const seen=new Set(); const uniq=[]; for(const n of next){ const sig=n.tl.map(a=>`${a.t}:${a.member}:${a.kind}`).join('|'); if(seen.has(sig)) continue; seen.add(sig); uniq.push(n); }
    uniq.sort((a,b)=>heuristic(b,t,horizon)-heuristic(a,t,horizon)); beams=uniq.slice(0,beam); if(onProgress) onProgress(t/horizon); if(beams[0]?.score.complete&&t>beams[0].score.until+2) break; }
  const ranked=[...beams].sort((a,b)=>b.score.dps-a.score.dps); const best=ranked[0];
  return {planVersion:PLAN_VERSION,best:{timeline:best.tl,score:best.score,summary:best.sim.summary,errors:best.sim.errors},candidates:ranked.slice(1,5).map(c=>({timeline:c.tl,score:c.score,diff:diffTimelines(best.tl,c.tl)})),objective:(objective==='guaranteed'?'所有干员至少一次终结技的周期内“保底”每秒伤害（主控普攻 + 全员技能，不计副控普攻；不完整周期按 0.5 折算）':'所有干员至少一次终结技的周期内平均每秒伤害（不完整周期按 0.5 折算）'),searchSpace:{beam,step,horizon,evaluated:'束搜索：每个决策点展开可行动作（战技/连携/终结技），保留分值前 '+beam+' 条'},rationale:rationaleOf(best)}; }
function heuristic(b,t,horizon){ // damage so far per second + progress toward every member's ultimate (energy fraction) + completion
  const dmg=b.sim.hits.filter(h=>h.t<=t+3+1e-6&&(b.keep?b.keep(h):true)).reduce((a,h)=>a+h.damage,0); /* 含 3 s 内落地的技能命中（终结技演出 3 s 后才出伤），否则刚放的终结技会被剪枝 */ const ults=b.sim.events.filter(e=>e.type==='cast'&&e.kind==='ultimate'&&e.t<=t+1e-6).length; const smp=[...b.sim.samples].reverse().find(x=>x.t<=t+1e-6); const maxes=b.sim.summary.energyMax||[]; const prog=smp?smp.energy.reduce((a,v,i)=>a+Math.min(1,v/Math.max(1,maxes[i]||1)),0):0; const base=dmg/Math.max(1,t+1); return base*(1+0.15*prog)+ults*0.1*base+(b.score.complete?b.score.dps:0); }
function diffTimelines(a,b){ const sa=new Set(a.map(x=>`${x.t}:${x.member}:${x.kind}`)), sb=new Set(b.map(x=>`${x.t}:${x.member}:${x.kind}`)); return {removed:[...sa].filter(x=>!sb.has(x)),added:[...sb].filter(x=>!sa.has(x))}; }
function rationaleOf(b){ const r=[]; const casts=b.sim.events.filter(e=>e.type==='cast'); const ults=casts.filter(e=>e.kind==='ultimate'); if(ults.length) r.push(`终结技时刻：${ults.map(u=>`${u.who} ${u.t}s`).join('、')}`); const over=b.sim.events.filter(e=>e.type==='spOverflow').length; r.push(over?`技力溢出事件 ${over} 次（可考虑提前战技）`:'无技力溢出'); const eo=b.sim.events.filter(e=>e.type==='energyOverflow').length; if(eo) r.push(`终结技能量溢出 ${eo} 次`); r.push(b.score.complete?`周期 ${b.score.until.toFixed(1)}s 内全员终结技各≥1 次`:'在时限内未能让全员各放一次终结技（周期不完整，按 0.5 折算）'); return r; }

// 充能阈值：对固定轴，求使干员 i 在 T 前能量满所需的最低充能效率增量（二分，前提：能量随效率单调不减）。
export function chargeThreshold(input,deadlines,{lo=-100,hi=400,tol=0.5}={}){
  const {team,data}=input; const names=team.map(m=>m?data.operators.find(o=>o.id===m.operatorId)?.name:null);
  // read the event log, not samples: samples are ≥0.5 s apart and miss energy gained between the last sample and T
  const energyAt=(sim,idx,T)=>{ const k=team.slice(0,idx).filter(Boolean).length; const ev=[...sim.events].reverse().find(x=>x.t<=T+1e-6); return ev?ev.energy[k]:(input.initial?.energy?.[idx]??0); };
  const results=[]; for(const d of deadlines){ const idx=d.member; const base=simulate({...input,params:{...(input.params||{}),duration:Math.max(d.t+1,input.params?.duration||40)}}); const k=team.slice(0,idx).filter(Boolean).length; const max=base.summary.energyMax?.[k]??0; const cur=energyAt(base,idx,d.t); const curEff=base.summary.chargeEff?.[k]??0;
    // 口径：截止前“到达过满能”（含随后已施放终结技）即满足；能量随效率单调不减，二分有效
    const reached=(sim,T)=>{ const k=team.slice(0,idx).filter(Boolean).length; const name=sim.summary.names?.[k]; return sim.events.some(e=>e.t<=T+1e-6&&((e.energy&&e.energy[k]>=max-1e-6)||(e.type==='cast'&&e.kind==='ultimate'&&e.who===name))); };
    const ok=e=>{ const extra=[]; extra[idx]=e; const sim=simulate({...input,params:{...(input.params||{}),duration:Math.max(d.t+1,input.params?.duration||40),extraChargeEff:extra}}); return reached(sim,d.t); };
    let res; if(reached(base,d.t)){ res={feasible:true,requiredExtra:0,note:'当前配装已在截止前满能'}; } else if(ok(lo)){ res={feasible:true,requiredExtra:lo,note:'即使效率降至下界也满足'}; } else if(!ok(hi)){ res={feasible:false,note:`充能效率增至 +${hi}% 仍无法在 ${d.t}s 前充满（可能需要改变轴或能量来源）`}; } else { let a=lo,b=hi; while(b-a>tol){ const m=(a+b)/2; if(ok(m)) b=m; else a=m; } let r=Math.ceil(b*10)/10; while(!ok(r)) r=Math.round((r+tol)*10)/10; res={feasible:true,requiredExtra:r,replayVerified:true}; } // round up: rounding down could land below the threshold
    results.push({member:idx,name:names[idx],deadline:d.t,energyMax:max,currentEnergyAtDeadline:Math.round(cur*10)/10,currentChargeEff:curEff,...res,requiredTotal:res.requiredExtra!=null?Math.round((curEff+res.requiredExtra)*10)/10:null,premises:['阈值基于当前这条轴；改变动作后需重算','能量来源：战技（真实技力）与连携回能均乘充能效率（规则 B10）；特殊回能按目录标记','舍入：二分精度 '+tol+'%，边界值请在界面两侧各试 1%','非主控普攻不产生能量；毒技力消耗不回能']}); }
  return results; }

// 顺序轴 → 最早可行时刻：按给定动作顺序，逐个向后寻找不报错的最早时刻（步长 step）。用于把“文字轴”变成可执行轴。
export function greedySchedule(input,ordered,{step=0.5,maxGap=20,horizon=120}={}){
  const tl=[]; let cursor=0; const notes=[]; const skipped=[];
  for(const [idx,a] of ordered.entries()){ let placed=false; const gap=a.maxGap??maxGap; const from=Math.max(cursor,a.minT||0); for(let t=from;t<=Math.min(horizon,from+gap)+1e-9;t=Math.round((t+step)*10)/10){ const trial=[...tl,{t,member:a.member,kind:a.kind}]; const sim=simulate({...input,timeline:trial,params:{...(input.params||{}),duration:t+3}}); if(a.waitFor?.attachLayers){ const w=a.waitFor.attachLayers; const smp=[...sim.samples].reverse().find(x=>x.t<=t+1e-6); const layers=smp?.attach?.[w.element]||0; const lastAttach=[...sim.events].reverse().find(e=>e.type==='attach'&&e.element===w.element&&e.t<=t+1e-6); if((lastAttach?.layers||layers)<w.min) continue; } const err=sim.errors.find(e=>Math.abs(e.t-t)<1e-6&&e.action?.member===a.member&&e.action?.kind===a.kind); if(!err){ tl.push({t,member:a.member,kind:a.kind,idx}); cursor=t; placed=true; break; } }
    if(!placed){ if(a.optional) skipped.push(idx); else notes.push(`无法在 ${cursor}s 后 ${maxGap}s 内安排 ${a.kind}（干员 ${a.member}）`); } }
  return {timeline:tl,notes,skipped};
}

// 顺序轴评价：模拟器按顺序在最早可行时刻执行（list scheduling 解码），返回分数与实际时刻。
export function evalSequence(input,seq,{horizon=70,objective='guaranteed'}={}){
  const mc=input.mainControl??0; const memberIdxs=input.team.map((m,i)=>i).filter(i=>input.team[i]);
  const sim=simulate({...input,timeline:[],sequence:seq,params:{...(input.params||{}),duration:horizon}});
  const skipped=sim.events.filter(e=>e.type==='seqSkip').length; const sc=scoreOf(sim,memberIdxs,horizon,objective,mc);
  return {sim,score:sc.dps*(skipped?Math.pow(0.9,skipped):1),sc,timeline:sim.scheduled.map(a=>({t:a.t,member:a.member,kind:a.kind})),skipped};
}
// 模拟退火（顺序空间）：状态 = 动作顺序；邻域 = 交换 / 移动 / 删除 / 插入 / 改类型；目标 = 周期内保底每秒伤害；跳过的步骤按 0.9^n 折算。
export function annealSequence(input,seq0,{horizon=70,objective='guaranteed',budgetMs=8000,maxEvals=1200,onProgress,seed=1}={}){
  const memberIdxs=input.team.map((m,i)=>i).filter(i=>input.team[i]); const kinds=['skill','combo','ultimate'];
  let rs=(seed>>>0)||1; const rnd=()=>{ rs^=rs<<13; rs>>>=0; rs^=rs>>>17; rs^=rs<<5; rs>>>=0; return rs/4294967296; }; const pick=arr=>arr[Math.floor(rnd()*arr.length)];
  const ev=seq=>evalSequence(input,seq,{horizon,objective});
  let cur=seq0.map(a=>({member:a.member,kind:a.kind})); let curE=ev(cur); let best=cur, bestE=curE; const t0=Date.now(); let evals=1, accepted=0; const T0=0.05, T1=0.002;
  const neighbor=seq=>{ const r=rnd(); const s2=[...seq]; const n=s2.length; if(!n||r<0.15){ s2.splice(Math.floor(rnd()*(n+1)),0,{member:pick(memberIdxs),kind:pick(kinds)}); return s2; }
    const i=Math.floor(rnd()*n); if(r<0.45){ const j=Math.floor(rnd()*n); [s2[i],s2[j]]=[s2[j],s2[i]]; return s2; }
    if(r<0.7){ const [a]=s2.splice(i,1); s2.splice(Math.floor(rnd()*(s2.length+1)),0,a); return s2; }
    if(r<0.85){ s2.splice(i,1); return s2; }
    s2[i]={...s2[i],kind:pick(kinds)}; return s2; };
  while(evals<maxEvals&&Date.now()-t0<budgetMs){ const frac=Math.max(evals/maxEvals,(Date.now()-t0)/budgetMs); const temp=T0*Math.pow(T1/T0,frac);
    const cand=neighbor(cur); const e=ev(cand); evals++; const rel=(e.score-curE.score)/Math.max(1,curE.score);
    if(rel>=0||rnd()<Math.exp(rel/temp)){ cur=cand; curE=e; accepted++; if(e.score>bestE.score){ best=cand; bestE=e; } }
    if(onProgress&&evals%20===0) onProgress(frac); }
  return {sequence:best,timeline:bestE.timeline,score:bestE.sc,evals,accepted,ms:Date.now()-t0,skipped:bestE.skipped};
}

// 蒙特卡洛树搜索（顺序空间 UCT）：节点 = 动作前缀；子节点 = 追加一个 (干员, 类型) 或 STOP；rollout = 随机续写到最大长度；
// 评价 = evalSequence（模拟器，最早可行解码）；回传均值，UCT 探索项按当前最优分归一化。记录全程最优 rollout。
export function mctsSequence(input,{horizon=70,objective='guaranteed',budgetMs=8000,maxIters=800,maxLen=36,c=0.7,seedSeq=null,onProgress,seed=7}={}){
  const memberIdxs=input.team.map((m,i)=>i).filter(i=>input.team[i]); const kinds=['skill','combo','ultimate'];
  const acts=[]; for(const m of memberIdxs) for(const k of kinds) acts.push({member:m,kind:k}); const STOP='stop';
  let rs=(seed>>>0)||1; const rnd=()=>{ rs^=rs<<13; rs>>>=0; rs^=rs>>>17; rs^=rs<<5; rs>>>=0; return rs/4294967296; };
  const shuffled=arr=>{ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const randAct=()=>{ const r=rnd(); const kind=r<0.42?'skill':r<0.84?'combo':'ultimate'; return {member:memberIdxs[Math.floor(rnd()*memberIdxs.length)],kind}; };
  const ev=seq=>evalSequence(input,seq,{horizon,objective});
  const mk=seq=>({seq,n:0,w:0,children:new Map(),untried:shuffled([...acts,STOP]),terminal:false});
  const root=mk([]); let best=null, bestScore=-Infinity, iters=0; const t0=Date.now();
  const consider=(seq,e)=>{ if(e.score>bestScore){ bestScore=e.score; best={seq,e}; } };
  if(seedSeq&&seedSeq.length){ const sq=seedSeq.map(a=>({member:a.member,kind:a.kind})); consider(sq,ev(sq)); iters++; }
  while(iters<maxIters&&Date.now()-t0<budgetMs){
    let node=root; const path=[root];
    while(!node.terminal&&node.untried.length===0&&node.children.size){ let pickN=null, pickV=-Infinity; for(const ch of node.children.values()){ const mean=ch.n?ch.w/ch.n:0; const v=mean/Math.max(1,bestScore)+c*Math.sqrt(Math.log(node.n+1)/(ch.n+1e-9)); if(v>pickV){ pickV=v; pickN=ch; } } node=pickN; path.push(node); }
    if(!node.terminal&&node.untried.length&&node.seq.length<maxLen){ const a=node.untried.pop(); const key=a===STOP?STOP:`${a.member}:${a.kind}`; const child=mk(a===STOP?node.seq:[...node.seq,a]); child.terminal=(a===STOP||child.seq.length>=maxLen); node.children.set(key,child); node=child; path.push(child); }
    const seq=[...node.seq]; if(!node.terminal){ const len=node.seq.length+Math.floor(rnd()*(maxLen-node.seq.length+1)); while(seq.length<len) seq.push(randAct()); }
    const e=ev(seq); iters++; consider(seq,e); for(const nd of path){ nd.n++; nd.w+=e.score; }
    if(onProgress&&iters%10===0) onProgress(Math.max(iters/maxIters,(Date.now()-t0)/budgetMs)); }
  return {sequence:best?.seq||[],timeline:best?.e.timeline||[],score:best?.e.sc,iters,ms:Date.now()-t0,skipped:best?.e.skipped||0};
}

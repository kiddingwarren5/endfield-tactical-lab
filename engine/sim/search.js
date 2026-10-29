// 显式时刻计划的搜索层。计划 = [{member,kind,t}]，四个成员各自一条时间线；模拟器按时刻执行，不可行时最多顺延 planRepair 秒。
// 算法：迭代局部搜索（Lourenço, Martin & Stützle 2003）+ 自适应大邻域（Ropke & Pisinger 2006）：
//   邻域 = 单动作挪时刻（含吸附到事件锚点）、成组挪时刻、重插、插入 / 删除 / 换类型、破坏与修复；
//   精英档案保留结构不同的好计划，停滞时从档案扰动重启；最后对精英做由粗到细的时刻精调。
// 事件锚点来自上一次模拟：增益起止、附着变化、连携触发窗口、能量充满、笔意结算、终结技演出结束。
import {simulate} from './simulate.js';
import {scoreOf} from './plan.js';
const KINDS=['skill','combo','ultimate'];
const r1=x=>Math.round(x*10)/10;
const sig=plan=>[...plan].sort((a,b)=>a.t-b.t||a.member-b.member).map(a=>`${a.member}${a.kind[0]}`).join('');
const keyOf=plan=>[...plan].sort((a,b)=>a.t-b.t||a.member-b.member||a.kind.localeCompare(b.kind)).map(a=>`${a.t}:${a.member}:${a.kind}`).join('|');

// 评估：模拟到窗口末尾；分数 = 窗口内保底伤害 / 窗口，放弃的动作每个乘 0.9。executed 是实际执行时刻。
export function evalPlan(input,plan,{horizon=60,objective='guaranteed',repair=6}={}){
  const mc=input.mainControl??0; const memberIdxs=input.team.map((m,i)=>i).filter(i=>input.team[i]);
  const timeline=plan.map((a,i)=>({t:r1(a.t),member:a.member,kind:a.kind,idx:i}));
  const sim=simulate({...input,timeline,params:{...(input.params||{}),duration:horizon,planRepair:repair}});
  const skipped=sim.events.filter(e=>e.type==='planSkip').length; const sc=scoreOf(sim,memberIdxs,horizon,objective,mc);
  return {sim,sc,score:sc.dps*(skipped?Math.pow(0.9,skipped):1),skipped,executed:sim.scheduled.map(a=>({t:a.t,member:a.member,kind:a.kind,idx:a.idx}))};
}

// 事件锚点：值得把动作对齐到的时刻
export function anchorsOf(sim,horizon,castSeconds){
  const ts=new Set(); const add=t=>{ if(t!=null&&isFinite(t)&&t>=0&&t<=horizon) ts.add(r1(t)); };
  for(const e of sim.events){
    if(e.type==='buffStart'||e.type==='attach'||e.type==='consume'||e.type==='enemyAttack'||e.type==='inkStart') add(e.t);
    if(e.type==='buffEnd') add(e.t-0.2);
    if(e.type==='comboReady'){ add(e.t); if(e.until!=null) add(e.until-0.3); }
    if(e.type==='inkStart'&&e.until!=null) add(e.until-0.5);
    if(e.type==='cast'&&e.kind==='ultimate') add(e.t+(castSeconds?.ultimate??3));
  }
  const maxes=sim.summary?.energyMax||[]; const seen=new Set(); for(const s of sim.samples||[]){ (s.energy||[]).forEach((v,k)=>{ if(!seen.has(k)&&v>=(maxes[k]||Infinity)-1e-6){ seen.add(k); add(s.t); } }); }
  add(horizon-1); return [...ts].sort((a,b)=>a-b);
}

export function localSearchPlan(input,{horizon=60,objective='guaranteed',budgetMs=15000,maxEvals=2500,seeds=[],castSeconds={},onProgress,seed=1,repair=6,archiveSize=12,stall=60,refineShare=0.25}={}){
  const memberIdxs=input.team.map((m,i)=>i).filter(i=>input.team[i]); const mcIdx=input.mainControl??0; const W=horizon;
  const actKinds=m=>m===mcIdx?[...KINDS,'plunge']:KINDS;
  let rs=(seed>>>0)||1; const rnd=()=>{ rs^=rs<<13; rs>>>=0; rs^=rs>>>17; rs>>>=0; rs^=rs<<5; rs>>>=0; return rs/4294967296; }; const pick=arr=>arr[Math.floor(rnd()*arr.length)];
  const t0=Date.now(); const cache=new Map(); let evals=0, proposals=0, legal=0; const timeUp=()=>Date.now()-t0>budgetMs||evals>=maxEvals;
  const ev=plan=>{ const k=keyOf(plan); if(cache.has(k)) return cache.get(k); evals++; const e=evalPlan(input,plan,{horizon:W,objective,repair}); if(!e.skipped) legal++; cache.set(k,e); return e; };
  /* 精英档案：按动作结构（谁放什么的顺序）去重，最多 archiveSize 条 */
  const archive=[]; const offer=(plan,e)=>{ const s=sig(e.executed); const same=archive.find(x=>x.sig===s); if(same){ if(e.score>same.e.score){ same.plan=plan; same.e=e; } return; } archive.push({sig:s,plan,e}); archive.sort((a,b)=>b.e.score-a.e.score); if(archive.length>archiveSize) archive.pop(); };
  const best=()=>archive[0];
  /* 起点：传入的种子（时刻按执行后的实际时刻规范化）+ 空计划 */
  const starts=seeds.filter(s=>s&&s.length).map(s=>s.map(a=>({member:a.member,kind:a.kind,t:r1(a.t)}))); starts.push([]);
  for(const p of starts){ const e=ev(p); const norm=e.executed.map(a=>({member:a.member,kind:a.kind,t:r1(a.t)})); if(norm.length){ const e2=ev(norm); offer(norm,e2); } else offer(p,e); }
  // ---- 邻域 ----
  const anchorsFor=e=>anchorsOf(e.sim,W,castSeconds);
  const snap=(plan,i,e)=>{ const an=anchorsFor(e); if(!an.length) return null; const a=pick(an); const cs=castSeconds[plan[i].kind]||1; const t=r1(rnd()<0.5?Math.max(0,a-cs-0.1):a+0.1); return plan.map((x,k)=>k===i?{...x,t}:x); };
  const DELTAS=[0.5,1,2,4]; const shift=(t,d)=>r1(Math.min(W,Math.max(0,t+d)));
  const ops={
    moveTime:(plan,e)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); if(rnd()<0.5) return snap(plan,i,e); const d=pick(DELTAS)*(rnd()<0.5?-1:1); return plan.map((x,k)=>k===i?{...x,t:shift(x.t,d)}:x); },
    groupMove:(plan,e)=>{ if(plan.length<2) return null; const i=Math.floor(rnd()*plan.length); const c=plan[i].t; const win=rnd()<0.5?3:6; const d=pick(DELTAS)*(rnd()<0.5?-1:1); return plan.map(x=>Math.abs(x.t-c)<=win?{...x,t:shift(x.t,d)}:x); },
    reinsert:(plan,e)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); const an=anchorsFor(e); const t=an.length&&rnd()<0.7?pick(an):r1(rnd()*W); return plan.map((x,k)=>k===i?{...x,t}:x); },
    insert:(plan,e)=>{ const m=pick(memberIdxs); const kind=pick(actKinds(m)); const an=anchorsFor(e); const t=an.length&&rnd()<0.7?pick(an):r1(rnd()*W); return [...plan,{member:m,kind,t}]; },
    remove:(plan)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); return plan.filter((_,k)=>k!==i); },
    retype:(plan)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); const ks=actKinds(plan[i].member).filter(k=>k!==plan[i].kind); return plan.map((x,k)=>k===i?{...x,kind:pick(ks)}:x); },
    swapSame:(plan)=>{ const byM={}; plan.forEach((x,k)=>(byM[x.member]=byM[x.member]||[]).push(k)); const grp=Object.values(byM).filter(g=>g.length>=2); if(!grp.length) return null; const g=pick(grp); const i=pick(g), j=pick(g); if(i===j) return null; const out=plan.map(x=>({...x})); [out[i].t,out[j].t]=[out[j].t,out[i].t]; return out; },
    destroyRepair:(plan,e)=>{ const L=3+rnd()*5; const s=rnd()*Math.max(0.1,W-L); const kept=plan.filter(x=>x.t<s||x.t>s+L); const n=1+Math.floor(rnd()*4); const an=anchorsFor(e).filter(t=>t>=s&&t<=s+L); const added=[]; for(let k=0;k<n;k++){ const m=pick(memberIdxs); added.push({member:m,kind:pick(actKinds(m)),t:an.length&&rnd()<0.6?pick(an):r1(s+rnd()*L)}); } return [...kept,...added]; }
  };
  const names=Object.keys(ops); const weight=Object.fromEntries(names.map(n=>[n,1])); const stats=Object.fromEntries(names.map(n=>[n,{tries:0,better:0,accepted:0}]));
  const pickOp=()=>{ const tot=names.reduce((a,n)=>a+weight[n],0); let r=rnd()*tot; for(const n of names){ r-=weight[n]; if(r<=0) return n; } return names.at(-1); };
  const reward=(n,kind)=>{ const g=kind==='global'?3:kind==='better'?1.5:kind==='accepted'?0.5:0; weight[n]=Math.max(0.2,0.9*weight[n]+0.1*(1+g)); };
  // ---- 主循环：迭代局部搜索 ----
  let cur=best(); let curPlan=cur.plan, curE=cur.e; let since=0; const searchBudget=budgetMs*(1-refineShare), searchEvals=Math.round(maxEvals*(1-refineShare));
  while(Date.now()-t0<searchBudget&&evals<searchEvals){
    const n=pickOp(); const cand=ops[n](curPlan,curE); proposals++; if(!cand){ continue; } const k=keyOf(cand); const fresh=!cache.has(k); const e=ev(cand); stats[n].tries++;
    const gBefore=best().e.score;
    if(e.score>curE.score*(1+1e-6)){ curPlan=cand; curE=e; since=0; stats[n].better++; const norm=e.executed.map(a=>({member:a.member,kind:a.kind,t:r1(a.t)})); offer(norm.length?norm:cand,e); reward(n,best().e.score>gBefore*(1+1e-6)?'global':'better'); }
    else if(fresh&&e.score>=curE.score*(1-0.01)&&rnd()<0.3){ curPlan=cand; curE=e; since++; stats[n].accepted++; reward(n,'accepted'); }
    else { since++; reward(n,'none'); }
    if(since>=stall){ /* 停滞：从档案里随机取一条，破坏修复 + 成组挪动后作为新起点 */ since=0; const src=pick(archive); let p=src.plan; const e1=src.e; const a=ops.destroyRepair(p,e1)||p; const b=ops.groupMove(a,e1)||a; curPlan=b; curE=ev(b); }
    if(onProgress&&evals%10===0) onProgress(Math.min(1,Math.max(evals/maxEvals,(Date.now()-t0)/budgetMs))*(1-refineShare));
  }
  // ---- 精调：对前三条精英，逐动作由粗到细挪时刻 ----
  for(const item of archive.slice(0,3)){ let plan=item.plan, e=item.e; for(const step of [2,1,0.5,0.2]){ let improved=true; while(improved&&!timeUp()){ improved=false; for(let i=0;i<plan.length&&!timeUp();i++){ for(const d of [step,-step]){ const cand=plan.map((x,k)=>k===i?{...x,t:shift(x.t,d)}:x); const ce=ev(cand); if(ce.score>e.score*(1+1e-6)){ plan=cand; e=ce; improved=true; } } } } } item.plan=plan; item.e=e; if(onProgress) onProgress(Math.min(1,Math.max(evals/maxEvals,(Date.now()-t0)/budgetMs))); }
  archive.sort((a,b)=>b.e.score-a.e.score);
  const top=best();
  return {plan:top.plan,timeline:top.e.executed.map(({t,member,kind})=>({t,member,kind})),score:top.e.sc,skipped:top.e.skipped,
    elites:archive.map(x=>({plan:x.plan,timeline:x.e.executed.map(({t,member,kind})=>({t,member,kind})),score:x.e.sc,sig:x.sig})),
    diag:{evals,proposals,legalRatio:evals?legal/evals:0,distinctRatio:proposals?evals/proposals:0,ops:stats,ms:Date.now()-t0}};
}

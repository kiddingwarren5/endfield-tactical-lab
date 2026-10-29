// 显式时刻计划的搜索层。计划 = [{member,kind,t}]，四个成员各自一条时间线；模拟器按时刻执行，不可行时最多顺延 repair 秒。
// 算法：迭代局部搜索（Lourenço, Martin & Stützle 2003）+ 自适应大邻域（Ropke & Pisinger 2006）：
//   邻域 = 单动作挪时刻（含吸附到事件锚点）、成组挪时刻、重插、插入 / 删除 / 换类型、破坏与修复；
//   历史最优单独保护；精英档案保留结构不同的好计划供重启；最后对精英轮流做由粗到细的时刻精调。
// 同刻动作：统一按 (时刻, 成员, 类型) 排序后交给模拟器执行，缓存键用同一顺序，两边语义一致（docs/reviews/planner-review-gpt-2.md 第 1 条）。
import {simulate} from './simulate.js';
import {scoreOf} from './plan.js';
const KINDS=['skill','combo','ultimate'];
const r1=x=>Math.round(x*10)/10;
const canon=plan=>[...plan].sort((a,b)=>a.t-b.t||a.member-b.member||a.kind.localeCompare(b.kind));
const keyOf=plan=>canon(plan).map(a=>`${a.t}:${a.member}:${a.kind}`).join('|');
const sigOf=tl=>tl.map(a=>`${a.member}${a.kind[0]}`).join('');

// 评估：模拟到窗口末尾；分数 = 窗口内保底伤害 / 窗口；没执行的请求（顺延超限、窗口截断）每个乘 0.9。executed 是实际执行时刻。
export function evalPlan(input,plan,{horizon=60,objective='guaranteed',repair=6}={}){
  const mc=input.mainControl??0; const memberIdxs=input.team.map((m,i)=>i).filter(i=>input.team[i]);
  const timeline=canon(plan).map((a,i)=>({t:a.t,member:a.member,kind:a.kind,idx:i}));
  const sim=simulate({...input,timeline,params:{...(input.params||{}),duration:horizon,planRepair:repair}});
  const skipped=sim.events.filter(e=>e.type==='planSkip').length; const sc=scoreOf(sim,memberIdxs,horizon,objective,mc);
  return {sim,sc,score:sc.dps*(skipped?Math.pow(0.9,skipped):1),skipped,executed:sim.scheduled.map(a=>({t:a.t,member:a.member,kind:a.kind,idx:a.idx,requested:a.requested}))};
}

// 事件锚点：值得把动作对齐到的时刻；hitOffset[member][kind] 是从这次模拟里量出来的“施放到首次命中”的偏移
export function anchorsOf(sim,horizon){
  const ts=new Set(); const add=t=>{ if(t!=null&&isFinite(t)&&t>=0&&t<=horizon) ts.add(r1(t)); };
  for(const e of sim.events){
    if(e.type==='buffStart'){ add(e.t); if(e.until!=null) add(e.until-0.2); }
    if(e.type==='buffRefresh'&&e.until!=null) add(e.until-0.2);
    if(e.type==='attach'||e.type==='consume'||e.type==='enemyAttack'||e.type==='inkStart') add(e.t);
    if(e.type==='buffEnd') add(e.t-0.2);
    if(e.type==='comboReady'){ add(e.t); if(e.until!=null) add(e.until-0.3); }
    if(e.type==='inkStart'&&e.until!=null) add(e.until-0.5);
    if(e.type==='cast'&&e.kind==='ultimate') add(e.t+3);
  }
  const maxes=sim.summary?.energyMax||[]; let prevE=null, prevSp=null; for(const s of sim.samples||[]){ (s.energy||[]).forEach((v,k)=>{ const was=prevE?prevE[k]:0; if(was<(maxes[k]||Infinity)-1e-6&&v>=(maxes[k]||Infinity)-1e-6) add(s.t); }); if(prevSp!=null&&prevSp<100&&s.sp>=100) add(s.t); prevE=s.energy; prevSp=s.sp; }
  add(horizon-1);
  const hitOffset={}; const casts=sim.events.filter(e=>e.type==='cast'); for(const c of casts){ const h=sim.hits.find(x=>x.name===c.who&&x.kind===c.kind&&x.t>=c.t-1e-6&&x.t<=c.t+4); if(!h) continue; const m=sim.summary.memberIdx?.[sim.summary.names.indexOf(c.who)]; if(m==null) continue; (hitOffset[m]=hitOffset[m]||{})[c.kind]=Math.min(hitOffset[m][c.kind]??Infinity,h.t-c.t); }
  return {times:[...ts].sort((a,b)=>a-b),hitOffset};
}

export function localSearchPlan(input,{horizon=60,objective='guaranteed',budgetMs=15000,maxEvals=2500,seeds=[],onProgress,seed=1,repair=6,archiveSize=12,stall=60,refineShare=0.25,deadline=null}={}){
  const memberIdxs=input.team.map((m,i)=>i).filter(i=>input.team[i]); const mcIdx=input.mainControl??0; const W=horizon;
  const actKinds=m=>m===mcIdx?[...KINDS,'plunge']:KINDS;
  let rs=(seed>>>0)||1; const rnd=()=>{ rs^=rs<<13; rs>>>=0; rs^=rs>>>17; rs>>>=0; rs^=rs<<5; rs>>>=0; return rs/4294967296; }; const pick=arr=>arr[Math.floor(rnd()*arr.length)];
  const t0=Date.now(); const end=Math.min(t0+budgetMs,deadline??Infinity); const cache=new Map(); let evals=0, proposals=0, fresh=0, legal=0;
  const timeUp=()=>Date.now()>=end||evals>=maxEvals;
  /* 历史最优单独保护：每一次真实评估都更新 */
  let inc=null;
  const ev=plan=>{ const k=keyOf(plan); if(cache.has(k)) return cache.get(k); evals++; const e=evalPlan(input,plan,{horizon:W,objective,repair}); if(!e.skipped) legal++; cache.set(k,e); if(!inc||e.score>inc.e.score) inc={plan:canon(plan),e}; return e; };
  /* 精英档案：按动作结构去重，更新后重排 */
  const archive=[]; const offer=(plan,e)=>{ const s=sigOf(e.executed); const i=archive.findIndex(x=>x.sig===s); if(i>=0){ if(e.score>archive[i].e.score){ archive[i].plan=canon(plan); archive[i].e=e; } } else archive.push({sig:s,plan:canon(plan),e}); archive.sort((a,b)=>b.e.score-a.e.score); if(archive.length>archiveSize) archive.pop(); };
  /* 种子里同刻动作按原顺序错开 0.001 s：顺序解码的同刻先后有资源含义，不能被统一排序打乱 */
  const starts=seeds.filter(s=>s&&s.length).map(s=>{ const out=[]; let last=-1, k=0; for(const a of s){ if(Math.abs(a.t-last)<1e-9) k++; else { last=a.t; k=0; } out.push({member:a.member,kind:a.kind,t:a.t+0.001*k}); } return out; }); starts.push([]);
  for(const p of starts){ if(timeUp()&&inc) break; const e=ev(p); offer(p,e); }
  // ---- 邻域 ----
  const anchorsFor=e=>{ if(!e._an) e._an=anchorsOf(e.sim,W); return e._an; };
  const offsetOf=(e,a)=>anchorsFor(e).hitOffset[a.member]?.[a.kind]??0.5;
  const snap=(plan,i,e)=>{ const an=anchorsFor(e).times; if(!an.length) return null; const a=pick(an); const off=offsetOf(e,plan[i]); const t=r1(rnd()<0.6?Math.max(0,a-off-0.05):a+0.1); return plan.map((x,k)=>k===i?{...x,t}:x); };
  const DELTAS=[0.5,1,2,4]; const shift=(t,d)=>r1(Math.min(W,Math.max(0,t+d)));
  const ops={
    moveTime:(plan,e)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); if(rnd()<0.5) return snap(plan,i,e); const d=pick(DELTAS)*(rnd()<0.5?-1:1); return plan.map((x,k)=>k===i?{...x,t:shift(x.t,d)}:x); },
    groupMove:(plan)=>{ if(plan.length<2) return null; const i=Math.floor(rnd()*plan.length); const c=plan[i].t; const win=rnd()<0.5?3:6; const d=pick(DELTAS)*(rnd()<0.5?-1:1); const grp=plan.filter(x=>Math.abs(x.t-c)<=win); const lo=Math.min(...grp.map(x=>x.t)), hi=Math.max(...grp.map(x=>x.t)); const dd=Math.max(-lo,Math.min(W-hi,d)); /* 整组保持相对间隔，不被窗口边界截断 */ return plan.map(x=>Math.abs(x.t-c)<=win?{...x,t:r1(x.t+dd)}:x); },
    reinsert:(plan,e)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); const an=anchorsFor(e).times; const t=an.length&&rnd()<0.7?pick(an):r1(rnd()*W); return plan.map((x,k)=>k===i?{...x,t}:x); },
    insert:(plan,e)=>{ const m=pick(memberIdxs); const kind=pick(actKinds(m)); const an=anchorsFor(e).times; const t=an.length&&rnd()<0.7?pick(an):r1(rnd()*W); return [...plan,{member:m,kind,t}]; },
    remove:(plan)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); return plan.filter((_,k)=>k!==i); },
    retype:(plan)=>{ if(!plan.length) return null; const i=Math.floor(rnd()*plan.length); const ks=actKinds(plan[i].member).filter(k=>k!==plan[i].kind); return plan.map((x,k)=>k===i?{...x,kind:pick(ks)}:x); },
    swapSame:(plan)=>{ const byM={}; plan.forEach((x,k)=>(byM[x.member]=byM[x.member]||[]).push(k)); const grp=Object.values(byM).filter(g=>g.length>=2); if(!grp.length) return null; const g=pick(grp); const i=pick(g), j=pick(g); if(i===j) return null; const out=plan.map(x=>({...x})); [out[i].t,out[j].t]=[out[j].t,out[i].t]; return out; },
    destroyRepair:(plan,e)=>{ const L=3+rnd()*5; const s=rnd()*Math.max(0.1,W-L); const kept=plan.filter(x=>x.t<s||x.t>s+L); const n=1+Math.floor(rnd()*4); const an=anchorsFor(e).times.filter(t=>t>=s&&t<=s+L); const added=[]; for(let k=0;k<n;k++){ const m=pick(memberIdxs); added.push({member:m,kind:pick(actKinds(m)),t:an.length&&rnd()<0.6?pick(an):r1(s+rnd()*L)}); } return [...kept,...added]; }
  };
  const names=Object.keys(ops); const weight=Object.fromEntries(names.map(n=>[n,1])); const stats=Object.fromEntries(names.map(n=>[n,{tries:0,better:0,global:0,accepted:0,gain:0,ms:0}]));
  const EXPLORE=0.15; const pickOp=()=>{ if(rnd()<EXPLORE) return pick(names); const tot=names.reduce((a,n)=>a+weight[n],0); let r=rnd()*tot; for(const n of names){ r-=weight[n]; if(r<=0) return n; } return names.at(-1); };
  /* 自适应权重：按批更新，权重 = 单位耗时带来的相对改善（有下限，保证探索） */
  const batch={}; const flush=()=>{ for(const n of names){ const b=batch[n]; if(!b||!b.ms) continue; weight[n]=0.7*weight[n]+0.3*Math.max(0.1,1+100*b.gain/b.ms); } for(const n of names) batch[n]={gain:0,ms:0}; };
  for(const n of names) batch[n]={gain:0,ms:0};
  // ---- 主循环：扰动 + 接受规则；停滞时从档案重启 ----
  let cur=inc; let curPlan=cur.plan, curE=cur.e; let since=0, loops=0; const searchEnd=t0+(end-t0)*(1-refineShare), searchEvals=Math.round(maxEvals*(1-refineShare));
  while(Date.now()<searchEnd&&evals<searchEvals){
    const n=pickOp(); const cand=ops[n](curPlan,curE); proposals++; if(!cand) continue; const k=keyOf(cand); const isFresh=!cache.has(k); if(isFresh) fresh++; const tS=Date.now(); const before=inc.e.score; const e=ev(cand); const dt=Date.now()-tS; stats[n].tries++; stats[n].ms+=dt; batch[n].ms+=dt;
    if(e.score>curE.score*(1+1e-6)){ const rel=(e.score-curE.score)/Math.max(1,curE.score); curPlan=canon(cand); curE=e; since=0; stats[n].better++; stats[n].gain+=rel; batch[n].gain+=rel; if(inc.e.score>before*(1+1e-6)) stats[n].global++; offer(cand,e); }
    else if(isFresh&&e.score>=curE.score*(1-0.01)&&rnd()<0.3){ curPlan=canon(cand); curE=e; since++; stats[n].accepted++; }
    else since++;
    if(since>=stall){ since=0; const src=pick(archive.length?archive:[inc]); const a=ops.destroyRepair(src.plan,src.e)||src.plan; const b=ops.groupMove(a)||a; curPlan=canon(b); curE=ev(b); offer(b,curE); }
    if(++loops%50===0) flush();
    if(onProgress&&evals%10===0) onProgress(Math.min(1,Math.max(evals/maxEvals,(Date.now()-t0)/(end-t0)))*(1-refineShare));
  }
  // ---- 精调：前三条精英轮流，每条每轮一个步长，逐动作试 ±step；预算共享 ----
  const elites=archive.slice(0,3).map(x=>({plan:x.plan,e:x.e}));
  for(const step of [2,1,0.5,0.2,0.1]){ for(const it of elites){ let improved=true; while(improved&&!timeUp()){ improved=false; for(let i=0;i<it.plan.length;i++){ for(const d of [step,-step]){ if(timeUp()) break; const cand=it.plan.map((x,k)=>k===i?{...x,t:shift(x.t,d)}:x); const ce=ev(cand); if(ce.score>it.e.score*(1+1e-6)){ it.plan=canon(cand); it.e=ce; improved=true; } } } } if(onProgress) onProgress(Math.min(1,Math.max(evals/maxEvals,(Date.now()-t0)/(end-t0)))); } }
  for(const it of elites) offer(it.plan,it.e);
  const top=inc; /* 返回历史最优，不是档案首项 */
  const out=x=>({plan:x.plan,timeline:x.e.executed.map(({t,member,kind})=>({t,member,kind})),score:x.e.sc,skipped:x.e.skipped,sig:sigOf(x.e.executed)});
  return {...out(top),elites:archive.map(out),diag:{evals,proposals,freshRatio:proposals?fresh/proposals:0,legalRatio:evals?legal/evals:0,ops:stats,ms:Date.now()-t0}};
}

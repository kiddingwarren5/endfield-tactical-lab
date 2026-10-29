// 排轴页：只读。自动排轴的候选 → 一图流 + 分节叙述。
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import sets from '../data/sets.js'; import effects from '../data/effects.js'; import timing from '../data/timing.js'; import mechanics from '../data/mechanics.js'; import {scenarios} from '../data/rotations.js';
import {rotationText,sumHits} from '../engine/sim/rotation.js';
import {runJob} from './plan-jobs.js';
import {h,fmt,select,ELEMENT_CN,colorOf,pct} from './ui.js';
import {ensureRot} from './state.js';
const data={operators,weapons,gear,sets,effects};
const KIND_LABEL={skill:'战技',combo:'连携技',ultimate:'终结技',plunge:'下落攻击',switch:'切主控'};
export const KIND_COLOR={skill:'#eb6834',combo:'#2a78d6',ultimate:'#e34948',plunge:'#6b6f6a',switch:'#6b6f6a'};
const CIRCLED='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿';
const clone=x=>JSON.parse(JSON.stringify(x));
// ---- 后台计算：Worker 可用时在 Worker 里跑（页面不冻结，显示进度），否则退回主线程同步计算 ----
const results=new Map(), pending=new Map(), progress=new Map(), startedAt=new Map(); let worker=null, rerender=null, progressEl=null, ticker=null;
function paintProgress(){ if(!progressEl) return; const key=progressEl.dataset.key; const f=progress.get(key); const bar=progressEl.querySelector('.progress'); const i=bar?.querySelector('i'); if(f!=null&&i){ bar.classList.remove('indeterminate'); i.style.width=`${Math.max(2,Math.round(f*100))}%`; progressEl.querySelector('.pct').textContent=`${Math.round(f*100)}%`; const steps=progressEl.querySelectorAll('.calc-step'); steps.forEach((el,k)=>el.classList.toggle('on',f<0.5?k===0:f<1?k===1:k===2)); } const st=startedAt.get(key); const el=progressEl.querySelector('.elapsed'); if(st&&el) el.textContent=`已用 ${Math.round((Date.now()-st)/1000)} 秒`; }
function getWorker(){ if(worker===false) return null; if(worker) return worker; try{ worker=new Worker(new URL('./plan-worker.js',import.meta.url),{type:'module'}); worker.onmessage=e=>{ const {id,type,value}=e.data; if(type==='progress'){ progress.set(id,value); paintProgress(); } else if(type==='done'){ remember(id,value); pending.delete(id); if(rerender) rerender(); } else if(type==='error'){ pending.set(id,{error:value}); if(rerender) rerender(); } }; worker.onerror=ev=>{ console.error('plan-worker 失败，退回主线程',ev.message); worker=false; for(const [id,p] of pending){ if(p?.job){ try{ remember(id,runJob(p.job)); }catch(e){ pending.set(id,{error:e.message}); } } } pending.clear(); if(rerender) rerender(); }; }catch(e){ worker=false; } return worker||null; }
function remember(key,value){ if(results.size>40) results.delete(results.keys().next().value); results.set(key,value); }
// 返回 {ready} / {error} / {pending}
function request(key,job){ if(results.has(key)) return {ready:results.get(key)}; const p=pending.get(key); if(p?.error) return {error:p.error}; if(p) return {pending:true}; const w=getWorker(); if(w){ pending.set(key,{job}); startedAt.set(key,Date.now()); w.postMessage({id:key,job}); return {pending:true}; } try{ const v=runJob(job); remember(key,v); return {ready:v}; }catch(e){ pending.set(key,{error:e.message}); return {error:e.message}; } }

export function onResultReady(fn){ rerender=fn; }
// 当前编队 / 场景的排轴结果：{empty} / {error} / {pending,key} / {res,cands,picked,key,scenario}
export function currentResult(state){ const rot=ensureRot(state); const scenario=scenarios.find(x=>x.id===rot.scenario)||scenarios[0]; const filled=state.team.map((m,i)=>m?i:null).filter(i=>i!=null); if(!filled.length) return {empty:true,scenario};
  const key=jobKey(state,scenario); const r=compute(state,scenario); if(r.error) return {error:r.error,scenario}; if(r.pending) return {pending:true,key,scenario};
  let res=r.ready; const cands=res.candidates||[]; let picked=0; if(cands.length>1){ picked=rot.candidateKey===key?Math.min(rot.candidate||0,cands.length-1):0; if(picked>0&&cands[picked].res) res=cands[picked].res; } return {res,cands,picked,key,scenario}; }
export function waitingPanel(state,key){ const known=progress.get(key); const names=state.team.filter(Boolean).map(m=>operators.find(o=>o.id===m.operatorId));
  progressEl=h('div',{class:'calc-wait',dataset:{key}},
      h('div',{class:'calc-wait-top'},h('div',{class:'calc-wait-title'},h('span',{class:'calc-dot'}),h('b',{},'正在计算中'),h('span',{class:'elapsed'},'已用 0 秒')),h('div',{class:'pct'},known!=null?`${Math.round(known*100)}%`:'0%')),
      h('div',{class:'progress'+(known==null?' indeterminate':'')},h('i',{style:`width:${known!=null?Math.max(2,Math.round(known*100)):30}%`})),
      h('div',{class:'calc-wait-foot'},h('div',{class:'calc-avatars'},...names.map(o=>h('img',{src:o.icon,alt:'',class:'calc-avatar'}))),h('div',{class:'calc-steps'},h('span',{class:'calc-step on'},'生成候选'),h('span',{class:'calc-step'},'比较伤害'),h('span',{class:'calc-step'},'出图'))),
      h('small',{class:'muted'},'算完会自动显示，页面可以继续操作。'));
    clearInterval(ticker); ticker=setInterval(()=>{ if(!document.body.contains(progressEl)){ clearInterval(ticker); return; } paintProgress(); },500); paintProgress(); return h('section',{class:'panel'},progressEl); }
export function candidateTabs(cur,update){ const {cands,picked,key}=cur; if(!(cands.length>1)) return ''; return h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'▣'),h('h2',{},'自动排轴给出的几条轴')),h('div',{class:'preset-tabs'},...cands.map((c,i)=>h('button',{type:'button',class:'preset-tab'+(i===picked?' active':''),onclick:()=>update(s=>{s.rot.candidate=i; s.rot.candidateKey=key;})},`${c.name} · 每秒 ${fmt(c.sure)}`)))); }
export function renderRotation(root,state,update){
  root.innerHTML=''; const left=h('div',{class:'rot-stack'}); left.append(h('a',{href:'#setup',class:'back-link'},'← 改配置')); const host=h('div',{class:'chart-host'}); left.append(host); root.append(h('div',{class:'workspace single chart'},left));
  onResultReady(()=>{ if(document.body.contains(root)) renderRotation(root,state,update); });
  const cur=currentResult(state);
  if(cur.empty){ host.append(h('section',{class:'panel'},h('p',{class:'muted'},'还没有编队。',h('a',{href:'#setup',class:'link'},'去配置页选人')))); return; }
  if(cur.error){ host.append(h('section',{class:'panel'},h('div',{class:'sim-errors'},'排轴失败：'+cur.error))); return; }
  if(cur.pending){ host.append(waitingPanel(state,cur.key)); return; }
  host.append(candidateTabs(cur,update),chartSvg(cur.res),narrative(cur.res,state,update));
}
function jobKey(state,scenario){ const rot=state.rot; return JSON.stringify(['auto',scenario.id,rot.enemy,rot.auto,state.team,state.mainControl]); }
function compute(state,scenario){
  const rot=state.rot; const key=jobKey(state,scenario);
  const job={kind:'auto',team:clone(state.team),mainControl:state.mainControl,enemy:clone(rot.enemy),scenarioId:scenario.id,opts:{beam:rot.auto.beam,step:1,horizon:rot.auto.horizon}};
  return request(key,job);
}


function members(res){ return res.names.map((name,i)=>name?{i,name,op:operators.find(o=>o.name===name)}:null).filter(Boolean); }
function skillName(op,kind,stage){ return stage||op?.skills?.[kind]?.name||KIND_LABEL[kind]; }
function castSeconds(kind){ return timing.castSeconds[kind]||1; }

function chartSvg(res){
  const M=res.main, mem=members(res), main=res.input.mainControl; const T=Math.ceil(res.end+1);
  const W=1180,L=92,R=14,rowH=44,top=46; const rows=[{kind:'normal'},...mem.map(m=>({kind:'member',m})),{kind:'attach'},{kind:'sp'}]; const H=top+rows.length*rowH+28;
  const x=t=>L+(Math.min(t,T)/T)*(W-L-R); const rowY=k=>top+k*rowH;
  const NS='http://www.w3.org/2000/svg'; const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.setAttribute('class','chart-svg'); svg.setAttribute('role','img');
  const el=(tag,attrs,text)=>{ const n=document.createElementNS(NS,tag); for(const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); if(text!=null) n.textContent=text; return n; };
  const segs=[]; res.timeline.forEach(a=>{ const s=res.steps[a.step]; if(!segs[s.seg]) segs[s.seg]={seg:s.seg,start:a.t,ult:false}; if(a.kind==='ultimate') segs[s.seg].ult=true; });
  const segList=segs.filter(Boolean); segList.forEach((s,i)=>{ const end=segList[i+1]?segList[i+1].start:T; const w=x(end)-x(s.start); if(i%2===1) svg.append(el('rect',{x:x(s.start),y:top-20,width:w,height:H-top+20-24,fill:'#f6f1e3'})); if(w>=72) svg.append(el('text',{x:x(s.start)+5,y:top-7,'font-size':11,'font-weight':700,fill:'#8a6b1f'},`第 ${s.seg} 节${s.ult?' · 爆发':' · 充能'}`)); else svg.append(el('text',{x:x(s.start)+3,y:top-7,'font-size':10,'font-weight':700,fill:'#8a6b1f'},`${s.seg}`)); });
  for(const [a,b] of (res.input.enemy?.invulnerable||[])){ svg.append(el('rect',{x:x(a),y:top-2,width:Math.max(1,x(b)-x(a)),height:H-top-22,fill:'#9aa09b',opacity:.18})); svg.append(el('text',{x:x(a)+4,y:top+10,'font-size':10,fill:'#4c5650'},'无敌 / 转阶段')); }
  for(const e of M.events) if(e.type==='stagger'&&e.t<=T){ svg.append(el('rect',{x:x(e.t),y:top-2,width:Math.max(1,x(e.until)-x(e.t)),height:H-top-22,fill:'#d9573d',opacity:.10})); svg.append(el('text',{x:x(e.t)+4,y:top+10,'font-size':10,fill:'#b3261e'},'失衡 +30% 承伤')); }
  for(let t=0;t<=T;t+=5){ svg.append(el('line',{x1:x(t),y1:top-2,x2:x(t),y2:H-24,stroke:'#e4e6e1'})); svg.append(el('text',{x:x(t),y:H-9,'font-size':10,fill:'#68716c','text-anchor':'middle'},`${t}s`)); }
  rows.forEach((r,k)=>{ const y=rowY(k); svg.append(el('line',{x1:L,y1:y+rowH,x2:W-R,y2:y+rowH,stroke:'#edf0eb'})); const label=r.kind==='normal'?'主控普攻':r.kind==='member'?`${String(r.m.i+1).padStart(2,'0')} ${r.m.name}${r.m.i===main?' ★':''}`:r.kind==='attach'?'法术附着':'共享技力'; svg.append(el('text',{x:6,y:y+rowH/2+4,'font-size':11,'font-weight':r.kind==='member'?700:500,fill:'#202522'},label)); });
  { const y=rowY(0); const mc=mem.find(m=>m.i===main); const busy=res.timeline.filter(a=>a.member===main).map(a=>[a.t,a.t+castSeconds(a.kind)]); let cur=0; for(const [b0,b1] of busy.concat([[T,T]])){ if(b0>cur) svg.append(el('rect',{x:x(cur),y:y+16,width:x(b0)-x(cur),height:12,fill:'#dfe5dd'})); cur=Math.max(cur,b1); }
    for(const e of M.events) if(e.type==='normalHit'&&e.control&&e.heavy&&e.t<=T) svg.append(el('rect',{x:x(e.t)-1,y:y+12,width:2,height:20,fill:'#5a6a5c'}));
    const refund=mechanics.find(m=>m.operatorId===mc?.op?.id)?.normal?.heavySpRefund?.value; svg.append(el('text',{x:x(0)+4,y:y+11,'font-size':9,fill:'#68716c'},`${mc?.name||''} 持续普攻，深色刻度 = 重击`)); }
  const blockOf={}; res.timeline.forEach((a,i)=>{ const k=1+mem.findIndex(m=>m.i===a.member); if(k<1) return; const y=rowY(k); const w=Math.max(12,x(a.t+castSeconds(a.kind))-x(a.t)); const s=res.steps[a.step]; const g=el('g',{}); g.append(el('rect',{x:x(a.t),y:y+13,width:w,height:18,rx:2,fill:KIND_COLOR[a.kind]}));
    g.append(el('text',{x:x(a.t)+w/2,y:y+26,'font-size':11,fill:'#fff','text-anchor':'middle','font-weight':700},CIRCLED[i]||String(i+1)));
    const op=mem.find(m=>m.i===a.member)?.op; const label=`${skillName(op,a.kind,s.stage)}${s.wait?`·${s.wait}层`:''}`; const lw=label.length*9.5;
    const prevSame=res.timeline.slice(0,i).filter(b=>b.member===a.member).at(-1); const prev=prevSame&&blockOf[prevSame.step]; const above=!prev||(x(a.t)+w/2-prev.x)>(lw+prev.lw)/2+6||!prev.above; const ly=above?y+9:y+42; blockOf[a.step]={above,lw,x:x(a.t)+w/2,yTop:y+13,yBot:y+31};
    g.append(el('text',{x:x(a.t)+w/2,y:ly,'font-size':9.5,fill:'#303731','text-anchor':'middle'},label)); g.append(el('title',{},`${a.t.toFixed(1)}s ${res.names[a.member]} ${KIND_LABEL[a.kind]}${s.stage?'「'+s.stage+'」':''}\n${s.why}`)); svg.append(g); });
  res.timeline.forEach((a)=>{ if(a.kind!=='combo') return; const who=res.names[a.member]; const ready=[...M.events].filter(e=>e.type==='comboReady'&&e.who===who&&e.t<=a.t+1e-6).at(-1); if(!ready) return; const src=[...M.events].filter(e=>e.type==='cast'&&e.t<=ready.t+1e-6).at(-1); if(!src) return; const srcAct=res.timeline.filter(b=>Math.abs(b.t-src.t)<2e-3&&res.names[b.member]===src.who).at(-1); if(!srcAct||srcAct.step===a.step) return; const A=blockOf[srcAct.step], B=blockOf[a.step]; if(!A||!B) return; const down=B.yTop>A.yBot; const y1=down?A.yBot:A.yTop, y2=down?B.yTop:B.yBot; svg.append(el('path',{d:`M${A.x},${y1} C${A.x},${(y1+y2)/2} ${B.x},${(y1+y2)/2} ${B.x},${y2}`,fill:'none',stroke:'#3288c4','stroke-width':1.2,'stroke-dasharray':'3 3',opacity:.8})); svg.append(el('circle',{cx:B.x,cy:y2,r:2.4,fill:'#3288c4'})); });
  { const k=rows.findIndex(r=>r.kind==='attach'), y=rowY(k); const yy=v=>y+rowH-6-v*(rowH-14)/4; const COL={cold:'#2d7fbf',heat:'#c9542d',electric:'#b58a1c',nature:'#4c8a3a'};
    const els=[...new Set(M.events.filter(e=>e.type==='attach').map(e=>e.element))]; for(const eln of els){ const pts=[[0,0]]; for(const e of M.events){ if(e.t>T) break; if(e.type==='attach'&&e.element===eln) pts.push([e.t,e.layers]); else if((e.type==='consume'||e.type==='attachExpire')&&e.element===eln) pts.push([e.t,0]); else if(e.type==='abnormal'&&e.consumed){ if(pts.at(-1)[1]>0&&e.element!==eln) pts.push([e.t,0]); } } pts.push([T,pts.at(-1)[1]]); let d=''; pts.forEach(([t,v],i)=>{ const px=x(t); if(i===0) d=`M${px},${yy(v)}`; else { d+=` L${px},${yy(pts[i-1][1])} L${px},${yy(v)}`; } }); svg.append(el('path',{d,fill:'none',stroke:COL[eln]||'#888','stroke-width':1.6})); pts.forEach(([t,v],i)=>{ if(i>0&&v>pts[i-1][1]) svg.append(el('text',{x:x(t)+2,y:yy(v)-2,'font-size':9,fill:COL[eln]||'#888'},v)); }); }
    for(const e of M.events) if(e.type==='consume'&&e.t<=T) svg.append(el('text',{x:x(e.t)+2,y:y+rowH-8,'font-size':9,fill:'#d9573d','font-weight':700},`吃${e.layers}层`)); for(const e of M.events) if(e.type==='abnormal'&&e.t<=T) svg.append(el('text',{x:x(e.t)+2,y:y+10,'font-size':9,fill:'#4c5650'},`${({burn:'燃烧',conduct:'导电',freeze:'冻结',corrosion:'腐蚀'})[e.which]||e.which}${e.level}`)); }
  { const k=rows.findIndex(r=>r.kind==='sp'), y=rowY(k); const yy=v=>y+rowH-6-v*(rowH-14)/300; svg.append(el('line',{x1:L,y1:yy(100),x2:W-R,y2:yy(100),stroke:'#e8dcc0','stroke-dasharray':'2 3'})); svg.append(el('text',{x:W-R-2,y:yy(100)-2,'font-size':8.5,fill:'#9a7424','text-anchor':'end'},'100 = 一次战技')); let d=''; M.samples.filter(s=>s.t<=T).forEach((s,i)=>{ d+=(i?' L':'M')+`${x(s.t)},${yy(s.sp)}`; }); svg.append(el('path',{d,fill:'none',stroke:'#9a7424','stroke-width':1.4})); }
  mem.forEach((m,k)=>{ const max=M.summary.energyMax[k]; const first=M.events.find(e=>e.energy&&e.energy[k]>=max-1e-6); if(first&&first.t<=T){ const y=rowY(1+k); svg.append(el('path',{d:`M${x(first.t)},${y+34} l4,7 l-8,0 z`,fill:'#d9573d'})); } });
  const legend=h('div',{class:'chart-legend'},...Object.entries(KIND_LABEL).map(([k,l])=>h('span',{},h('i',{style:`background:${KIND_COLOR[k]}`}),l)),h('span',{},h('i',{style:'background:#dfe5dd'}),'主控普攻'),h('span',{},h('i',{class:'dash'}),'连携触发链'),h('span',{},h('i',{class:'tri'}),'终结技能量充满'),h('span',{},'★ 主控'));
  const title='自动排轴 · 一图流';
  return h('section',{class:'panel chart-panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'02'),h('h2',{},title)),h('div',{class:'chart-scroll'},svg),legend);
}

function narrative(res,state,update){
  const M=res.main, mem=members(res); const end=res.end; const mc=res.input.mainControl;
  const total=sumHits(M,{until:end}), lo=sumHits(res.lo,{until:end}), hi=sumHits(res.hi,{until:end}); const sure=sumHits(M,{until:end,mainControl:mc,guaranteed:true});
  const ults=M.events.filter(e=>e.type==='cast'&&e.kind==='ultimate').map(e=>`${e.who} ${e.t.toFixed(1)}s`).join('、')||'无';
  const groups=[]; res.timeline.forEach((a,i)=>{ const s=res.steps[a.step]; let g=groups.find(x=>x.seg===s.seg); if(!g){ g={seg:s.seg,items:[],ult:false}; groups.push(g); } if(a.kind==='ultimate') g.ult=true; g.items.push({a,i,s,st:res.states[i]}); });
  const stepRow=({a,i,s,st})=>{ const op=mem.find(m=>m.i===a.member)?.op; return h('li',{class:'step'},h('span',{class:'step-no',style:`background:${KIND_COLOR[a.kind]}`},CIRCLED[i]||i+1),h('span',{class:'step-t'},`${a.t.toFixed(1)}s`),h('span',{class:'step-body'},h('b',{},`${res.names[a.member]} · ${KIND_LABEL[a.kind]}「${skillName(op,a.kind,s.stage)}」${s.wait?`（附着 ${s.wait} 层后）`:''}`),h('span',{class:'step-why'},s.why,st.consumed&&!/消耗/.test(s.why)?`（实际消耗 ${st.consumed} 层）`:''),h('span',{class:'step-state muted'},st.sp==null?'':`技力 ${Math.round(st.sp)} · 寒冷 ${st.cold} 层 · 能量 ${st.energy.map(Math.round).join(' / ')}`),st.error?h('span',{class:'warn'},st.error):'')); };
  const text=rotationText({steps:res.steps},res); const copyStatus=h('span',{class:'muted small'},'');
  const copyBtn=h('button',{type:'button',class:'mini-btn',onclick:()=>{ const done=()=>{copyStatus.textContent='已复制文字轴';}; const fb=()=>{ const ta=h('textarea',{class:'export-box',readonly:true},text); document.body.append(ta); ta.select(); try{ document.execCommand('copy'); done(); }catch{ copyStatus.textContent='请从下方文字手动复制'; } ta.remove(); }; if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(fb); else fb(); }},'复制文字轴');
  const warn=[...(res.notes||[]).map(n=>n),...(res.main.errors||[]).map(e=>`${e.t.toFixed(1)}s ${e.message}`)];
  return h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'03'),h('h2',{},'结果与分节叙述')),
    h('div',{class:'chart-stats'},stat('总计战斗时间',`${Math.round(end)} 秒`,''),stat('保底伤害',fmt(sure),`每秒 ${fmt(sure/end)}`),stat('含队友普攻',fmt(total),`每秒 ${fmt(total/end)}`),stat('终结技时刻',ults,'')),

    warn.length?h('div',{class:'sim-errors'},h('b',{},'提示'),...warn.map(w=>h('div',{},w))):'',
    h('div',{class:'chart-team'},...res.input.team.map((m,i)=>{ if(!m) return ''; const op=operators.find(o=>o.id===m.operatorId), w=weapons.find(x=>x.id===m.weapon?.id); return h('div',{class:'team-card'},h('img',{src:op.icon,alt:'',class:'item-thumb'}),h('div',{},h('b',{},`${String(i+1).padStart(2,'0')} ${op.name}${i===mc?' ★主控':''}`),h('small',{},`${w?.name||'未配武器'} · 潜 ${m.potential} · ${[m.gear?.armor,m.gear?.gloves,m.gear?.kit1,m.gear?.kit2].map(g=>gear.find(x=>x.id===g?.id)?.name||'—').join('/')}`))); })),
    ...groups.map(g=>[h('h3',{class:'seg-title'},`第 ${g.seg} 节 · ${g.ult?'爆发':'充能'}`),h('ol',{class:'steps'},...g.items.map(stepRow))]),
    h('div',{class:'result-actions'},copyBtn,copyStatus),
    h('details',{class:'chart-details'},h('summary',{},'文字轴（可全选复制）'),h('pre',{class:'rotation-text'},text)));
}
function stat(label,value,sub){ return h('div',{class:'result-mini stat'},h('span',{},label),h('strong',{},value),sub?h('small',{class:'muted'},sub):''); }

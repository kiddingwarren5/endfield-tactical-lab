// 排轴模拟工作区（批次 6/8）：可编辑时间轴 + 事件模拟 + 资源流水 + 全队逐击汇总。
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import sets from '../data/sets.js'; import consumables from '../data/consumables.js'; import effects from '../data/effects.js'; import timing from '../data/timing.js'; import mechanics from '../data/mechanics.js'; import meta from '../data/meta.js';
import {simulate,SIM_VERSION} from '../engine/sim/simulate.js';
import {autoPlan,chargeThreshold,greedySchedule} from '../engine/sim/plan.js';
import {h,fmt,fmt1,pct,ELEMENT_CN,KIND_CN,colorOf,select,panel,field,download} from './ui.js';
const data={operators,weapons,gear,sets,consumables,effects};
const clone=x=>JSON.parse(JSON.stringify(x));
const KIND_LABEL={skill:'战技',combo:'连携技',ultimate:'终结技',plunge:'下落攻击',switch:'切主控'};
const KIND_COLOR={skill:'#bd9b43',combo:'#3288c4',ultimate:'#d9573d',plunge:'#68716c',switch:'#68716c',normal:'#c9cfc8'};

export function defaultSim(){ return {timeline:[],duration:40,initialSp:200,initialEnergy:[0,0,0,0],damageFactor:0.75,rhythmFactor:0.8,inspectT:0,showNormals:true,plan:{beam:8,step:1,horizon:45,result:null},deadlines:[],thresholds:null}; }

export function runSim(state){ const sim=state.sim||(state.sim=defaultSim()); const team=state.team; if(!team.some(Boolean)) return null;
  const base={team,data,mechanics,timeline:sim.timeline,timing,enemy:state.enemy,critMode:state.critMode,options:state.options,mainControl:state.mainControl,initial:{sp:sim.initialSp,energy:sim.initialEnergy}};
  const main=simulate({...base,params:{duration:sim.duration,damageFactor:sim.damageFactor,rhythmFactor:sim.rhythmFactor}});
  const lo=simulate({...base,params:{duration:sim.duration,damageFactor:timing.nonControl.damageFactor[0],rhythmFactor:timing.nonControl.rhythmFactor[0]}});
  const hi=simulate({...base,params:{duration:sim.duration,damageFactor:timing.nonControl.damageFactor[1],rhythmFactor:timing.nonControl.rhythmFactor[1]}});
  return {main,lo,hi}; }

export function renderTimeline(root,state,update){
  const sim=state.sim||(state.sim=defaultSim()); const res=runSim(state); root.innerHTML='';
  const fold=(id,c)=>{ state.ui.folds[id]=c; };
  const members=state.team.map((m,i)=>m?{i,name:operators.find(o=>o.id===m.operatorId)?.name,op:operators.find(o=>o.id===m.operatorId)}:null).filter(Boolean);
  if(!members.length){ root.append(h('div',{class:'workspace single'},h('section',{class:'panel'},h('p',{},'请先在“伤害计算”页签组建编队。')))); return; }
  const left=h('div',{class:'left-column'}), right=h('div',{class:'right-column wide'});
  // --- controls
  const numField=(label,key,attrs={})=>field(label,h('input',{type:'number',value:sim[key],...attrs,onchange:ev=>update(s=>{s.sim[key]=Number(ev.target.value);})}));
  left.append(panel({id:'simctl',index:'06',title:'模拟设置',folds:state.ui.folds,onFold:fold},
    h('div',{class:'two-col'},numField('模拟时长（秒）','duration',{min:5,max:300,step:1}),field('主控干员',select(members.map(m=>[m.i,m.name]),state.mainControl,v=>update(s=>{s.mainControl=Number(v);}))),numField('初始技力','initialSp',{min:0,max:300,step:10})),
    h('div',{class:'subheading'},'初始终结技能量'),h('div',{class:'two-col'},...members.map(m=>field(m.name,h('input',{type:'number',min:0,max:999,value:sim.initialEnergy[m.i]||0,onchange:ev=>update(s=>{s.sim.initialEnergy[m.i]=Number(ev.target.value);})})))),
    h('div',{class:'subheading'},'队友普攻'),h('div',{class:'two-col'},numField('伤害折扣','damageFactor',{min:0,max:1,step:0.05}),numField('出手频率','rhythmFactor',{min:0.3,max:1,step:0.05}))));
  // --- action editor
  const addRow=h('div',{class:'three-col'},field('干员',select(members.map(m=>[m.i,m.name]),members[0].i,()=>{},{id:'add-member'})),field('动作',select(Object.entries(KIND_LABEL),'skill',()=>{},{id:'add-kind'})),field('时刻（秒）',h('input',{id:'add-t',type:'number',min:0,step:0.1,value:0})));
  const addBtn=h('button',{type:'button',class:'mini-btn',onclick:()=>{ const m=Number(document.getElementById('add-member').value), k=document.getElementById('add-kind').value, t=Number(document.getElementById('add-t').value); update(s=>{ s.sim.timeline.push({t,member:m,kind:k}); s.sim.timeline.sort((a,b)=>a.t-b.t); }); }},'+ 添加动作');
  const rows=[...sim.timeline].map((a,idx)=>h('div',{class:'tl-row'},h('span',{class:'tl-dot',style:`background:${KIND_COLOR[a.kind]}`}),h('input',{type:'number',step:0.1,min:0,value:a.t,class:'tl-t',onchange:ev=>update(s=>{s.sim.timeline[idx].t=Number(ev.target.value);s.sim.timeline.sort((x,y)=>x.t-y.t);})}),h('span',{},`${members.find(m=>m.i===a.member)?.name||'?'} · ${KIND_LABEL[a.kind]}`),h('button',{type:'button',class:'mini-btn danger',onclick:()=>update(s=>{s.sim.timeline.splice(idx,1);})},'删除')));
  const errs=res?.main.errors||[];
  left.append(panel({id:'simplan',index:'06b',title:`动作序列（${sim.timeline.length}）`,folds:state.ui.folds,onFold:fold},addRow,addBtn,h('div',{class:'tl-list'},rows.length?rows:h('div',{class:'muted'},'暂无动作；主控会持续普攻。')),(sim.scheduleNotes?.length?h('div',{class:'sim-errors'},h('b',{},'重排未能安排的动作'),...sim.scheduleNotes.map(n=>h('div',{},n))):''),errs.length?h('div',{class:'sim-errors'},h('b',{},`不可执行 ${errs.length} 项`),...errs.map(e=>h('div',{},`${e.t}s ${KIND_LABEL[e.action?.kind]||''}：${e.message}`))):h('div',{class:'ok-note'},'所有动作均可执行。'),
    h('div',{class:'result-actions'},h('button',{type:'button',class:'mini-btn',title:'保持动作顺序，把每个动作移到最早可执行的时刻',onclick:()=>update(s=>{ const ordered=[...s.sim.timeline].sort((a,b)=>a.t-b.t).map(a=>({member:a.member,kind:a.kind})); const inp={team:s.team,data,mechanics,timing,enemy:s.enemy,critMode:s.critMode,options:s.options,mainControl:s.mainControl,initial:{sp:s.sim.initialSp,energy:s.sim.initialEnergy},params:{damageFactor:s.sim.damageFactor,rhythmFactor:s.sim.rhythmFactor}}; const g=greedySchedule(inp,ordered,{horizon:s.sim.duration,maxGap:s.sim.duration}); s.sim.timeline=g.timeline; s.sim.scheduleNotes=g.notes; })},'按最早可行时刻重排'),h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.sim.timeline=[];})},'清空'),h('button',{type:'button',class:'mini-btn',onclick:()=>res&&download(`sim-${Date.now()}.json`,JSON.stringify(exportReport(state,res),null,1))},'导出模拟报告 JSON'))));
  // --- auto plan (批次 7)
  const planCfg=sim.plan||(sim.plan={beam:8,step:1,horizon:45,result:null});
  const simInput=()=>({team:state.team,data,mechanics,timing,enemy:state.enemy,critMode:state.critMode,options:state.options,mainControl:state.mainControl,initial:{sp:sim.initialSp,energy:sim.initialEnergy},params:{damageFactor:sim.damageFactor,rhythmFactor:sim.rhythmFactor}});
  const planBtn=h('button',{type:'button',class:'mini-btn',onclick:()=>{ planBtn.disabled=true; planBtn.textContent='搜索中…'; setTimeout(()=>{ const r=autoPlan(simInput(),{beam:planCfg.beam,step:planCfg.step,horizon:planCfg.horizon}); update(s=>{ s.sim.plan.result={best:r.best,candidates:r.candidates,rationale:r.rationale,objective:r.objective,searchSpace:r.searchSpace}; }); },30); }},'自动生成');
  const pr=planCfg.result;
  left.append(panel({id:'simplanauto',index:'07',title:'自动排轴',folds:state.ui.folds,onFold:fold},
    h('div',{class:'three-col'},field('搜索宽度',h('input',{type:'number',min:2,max:30,value:planCfg.beam,onchange:ev=>update(s=>{s.sim.plan.beam=Number(ev.target.value);})})),field('决策步长（秒）',h('input',{type:'number',min:0.5,max:3,step:0.5,value:planCfg.step,onchange:ev=>update(s=>{s.sim.plan.step=Number(ev.target.value);})})),field('搜索时限（秒）',h('input',{type:'number',min:10,max:120,value:planCfg.horizon,onchange:ev=>update(s=>{s.sim.plan.horizon=Number(ev.target.value);})}))),
    planBtn,
    pr?[h('div',{class:'ok-note'},`最佳：周期 ${pr.best.score.complete?pr.best.score.until.toFixed(1)+'s':'未完成'} · 周期内 DPS ${fmt(pr.best.score.dps)} · 总伤 ${fmt(pr.best.score.total)}`),h('div',{class:'small'},pr.best.timeline.map(a=>`${a.t}s ${members.find(m=>m.i===a.member)?.name||'?'}${KIND_LABEL[a.kind]}`).join(' → ')),h('ul',{class:'small'},...pr.rationale.map(x=>h('li',{},x))),h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.sim.timeline=clone(pr.best.timeline);})},'采用此轴（可继续手动编辑）'),h('div',{class:'subheading'},'对照候选'),...pr.candidates.map((c,i)=>h('div',{class:'small cand'},`#${i+2} DPS ${fmt(c.score.dps)}：`,c.diff.added.length?`新增 ${c.diff.added.join('、')} `:'',c.diff.removed.length?`去掉 ${c.diff.removed.join('、')}`:'',h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.sim.timeline=clone(c.timeline);})},'采用')))]:''));
  // --- charge deadlines (批次 7.4)
  const dls=sim.deadlines||(sim.deadlines=[]);
  const dlRows=dls.map((d,i)=>h('div',{class:'tl-row'},h('span',{}),h('input',{type:'number',step:0.5,min:0,value:d.t,class:'tl-t',onchange:ev=>update(s=>{s.sim.deadlines[i].t=Number(ev.target.value);})}),h('span',{},`${members.find(m=>m.i===d.member)?.name||'?'} 终结技须充满`),h('button',{type:'button',class:'mini-btn danger',onclick:()=>update(s=>{s.sim.deadlines.splice(i,1);s.sim.thresholds=null;})},'删除')));
  const th=sim.thresholds;
  left.append(panel({id:'simdl',index:'07b',title:'充能截止条件与阈值',folds:state.ui.folds,onFold:fold},
    h('div',{class:'three-col'},field('干员',select(members.map(m=>[m.i,m.name]),members[0].i,()=>{},{id:'dl-member'})),field('截止时刻（秒）',h('input',{id:'dl-t',type:'number',min:0,step:0.5,value:20})),h('button',{type:'button',class:'mini-btn',onclick:()=>{ const m=Number(document.getElementById('dl-member').value), t=Number(document.getElementById('dl-t').value); update(s=>{ s.sim.deadlines.push({member:m,t}); s.sim.thresholds=null; }); }},'+ 添加条件')),
    h('div',{class:'tl-list'},dlRows.length?dlRows:h('div',{class:'muted'},'未设置截止条件。')),
    dls.length?h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{ s.sim.thresholds=chargeThreshold({...simInput(),timeline:s.sim.timeline,params:{duration:s.sim.duration,damageFactor:s.sim.damageFactor,rhythmFactor:s.sim.rhythmFactor}},s.sim.deadlines); })},'按当前轴计算最低充能效率'):'',
    th?h('table',{class:'seg-table'},h('thead',{},h('tr',{},h('th',{},'干员'),h('th',{},'截止'),h('th',{},'截止时能量'),h('th',{},'现有效率'),h('th',{},'所需效率'),h('th',{},'差额'))),h('tbody',{},...th.map(r=>h('tr',{},h('td',{},r.name),h('td',{},`${r.deadline}s`),h('td',{},`${r.currentEnergyAtDeadline}/${r.energyMax}`),h('td',{},`+${r.currentChargeEff}%`),h('td',{},r.feasible?`+${r.requiredTotal}%`:'无解'),h('td',{},r.feasible?(r.requiredExtra>0?h('b',{class:'warn'},`还差 ${r.requiredExtra}%，请重新配装`):'已满足'):r.note))))):'',
    ''));
  if(!res){ root.append(h('div',{class:'workspace'},left,right)); return; }
  const M=res.main;
  // --- timeline visualization (SVG)
  right.append(h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'▦'),h('h2',{},'时间轴'),h('label',{class:'inline-field'},h('input',{type:'checkbox',checked:sim.showNormals,onchange:ev=>update(s=>{s.sim.showNormals=ev.target.checked;})}),' 显示普攻')),timelineSvg(state,update,members,M,sim)));
  // --- summary & shares
  const total=M.summary.total, dur=M.summary.duration||sim.duration; const dps=total/dur;
  const share=(obj)=>{ const entries=Object.entries(obj).sort((a,b)=>b[1]-a[1]); const sum=entries.reduce((a,[,v])=>a+v,0)||1; return h('div',{class:'bars'},...entries.map(([k,v])=>h('div',{class:'bar-row'},h('span',{class:'bar-label'},k),h('span',{class:'bar'},h('i',{style:`width:${(v/sum*100).toFixed(1)}%`})),h('b',{},`${fmt(v)} · ${(v/sum*100).toFixed(1)}%`)))); };
  right.append(h('section',{class:'result-panel'},h('div',{class:'result-top'},h('span',{},'全队总伤'),h('span',{class:'live-pill'},h('i',{}),' 实时')),h('div',{class:'result-number'},fmt(total)),h('div',{class:'result-sub'},`耗时 ${fmt1(dur)} 秒 · 平均每秒 ${fmt(dps)} · 终结技 ${M.summary.ultsCast} 次 · 命中 ${M.hits.length} 次`),h('div',{class:'result-divider'}),
    h('div',{class:'result-mini'},h('span',{},'保底伤害'),h('strong',{},fmt(M.hits.filter(x=>!(x.kind==='normal'&&x.member!==state.mainControl)).reduce((a,x)=>a+x.damage,0)))),h('div',{class:'result-mini'},h('span',{},'队友普攻浮动范围'),h('strong',{},`${fmt(res.lo.summary.total)} – ${fmt(res.hi.summary.total)}`)),h('div',{class:'result-mini'},h('span',{},'周期末技力 / 能量'),h('strong',{},`${fmt(M.final.sp.real)}+${fmt(M.final.sp.poison)}毒 / ${M.final.energy.map(fmt).join(' · ')}`)),h('div',{class:'result-mini'},h('span',{},'周期末冷却'),h('strong',{},M.final.cooldowns.map(c=>`${c.name} 连${fmt1(Math.max(0,c.combo-M.final.t))}s 终${fmt1(Math.max(0,c.ultimate-M.final.t))}s`).join('；'))),
    h('div',{class:'subheading'},'各干员占比'),share(M.summary.perMember),h('div',{class:'subheading'},'各技能占比'),share(M.summary.perSkill)));
  // --- inspector
  const T=Math.min(sim.inspectT,sim.duration); const snap=snapshotAt(M,T);
  right.append(panel({id:'siminspect',index:'⌖',title:'时刻检查',folds:state.ui.folds,onFold:fold},field(`时刻 ${fmt1(T)} 秒`,h('input',{type:'range',min:0,max:sim.duration,step:0.1,value:T,oninput:ev=>update(s=>{s.sim.inspectT=Number(ev.target.value);},{silent:true})})),
    h('div',{class:'two-col'},h('div',{class:'result-mini'},h('span',{},'共享技力'),h('strong',{},`${fmt(snap.sp)}（毒 ${fmt(snap.poison)}）`)),h('div',{class:'result-mini'},h('span',{},'附着'),h('strong',{},Object.entries(snap.attach).map(([k,v])=>`${ELEMENT_CN[k]} ${v} 层`).join('，')||'无'))),
    ...members.map((m,k)=>h('div',{class:'result-mini'},h('span',{},m.name),h('strong',{},`能量 ${fmt(snap.energy[k]||0)}`))),
    h('div',{class:'subheading'},'此刻生效增益'),h('div',{},...snap.buffs.map(b=>h('div',{class:'active-buff'},h('span',{},b.name),h('b',{},`+${fmt1(b.value)}%`))),snap.buffs.length?'':h('span',{class:'muted'},'无')),
    h('div',{class:'subheading'},'事件流水（前后 3 秒）'),h('div',{class:'ledger'},...M.events.filter(e=>Math.abs(e.t-T)<=3).slice(0,60).map(e=>h('div',{class:'ledger-row'},h('span',{},`${e.t}s`),h('span',{},eventName(e.type)),h('span',{},describeEvent(e)),h('span',{class:'muted'},`技力 ${fmt(e.sp.real)}+${fmt(e.sp.poison)} · 能量 ${e.energy.map(fmt).join('/')}`))))));
  // --- hits table
  right.append(panel({id:'simhits',index:'∑',title:`逐击明细（${M.hits.length}）`,folds:state.ui.folds,onFold:fold,defaultCollapsed:true},h('table',{class:'seg-table'},h('thead',{},h('tr',{},h('th',{},'时刻'),h('th',{},'干员'),h('th',{},'技能'),h('th',{},'段'),h('th',{},'伤害'),h('th',{},'计入效果'))),h('tbody',{},...M.hits.map(x=>h('tr',{},h('td',{},x.t),h('td',{},x.name),h('td',{},KIND_CN[x.kind]||x.skill),h('td',{},x.label),h('td',{style:`color:${colorOf(x.element)}`},fmt(x.damage)),h('td',{class:'small muted'},x.applied.map(a=>`${a.name} ${a.value>=0?'+':''}${a.value}`).join('；'))))))));
  root.append(h('div',{class:'workspace sim'},left,right));
}
const EV_CN={normalHit:'普攻',spGain:'回技力',spSpend:'耗技力',spOverflow:'技力溢出',cast:'施放',attach:'附着',consume:'消耗附着',attachExpire:'附着消失',buffStart:'增益开始',buffEnd:'增益结束',buffRefresh:'增益刷新',comboReady:'连携可用',energyGain:'回能',energyOverflow:'能量溢出',energyBlocked:'不回能',abnormal:'异常',burst:'法术爆发',note:'说明',error:'错误',pause:'演出',cdr:'冷却缩减',stagger:'失衡',execute:'处决',switch:'切主控',iceShatter:'碎冰',seqSkip:'跳过'};
export const eventName=t=>EV_CN[t]||t;
function describeEvent(e){ const o={...e}; for(const k of ['t','type','sp','energy','control','id']) delete o[k]; const KIND={skill:'战技',combo:'连携技',ultimate:'终结技'}; return Object.entries(o).map(([k,v])=>{ if(k==='kind') return KIND[v]||v; if(k==='heavy') return v?'重击':''; if(k==='control') return ''; if(typeof v==='object') return JSON.stringify(v); return String(v); }).filter(Boolean).join(' · '); }
function snapshotAt(M,T){ const s=[...M.samples].reverse().find(x=>x.t<=T)||{sp:0,poison:0,energy:[],attach:{}}; const buffs=[]; const started={}; for(const e of M.events){ if(e.t>T) break; if(e.type==='buffStart'||e.type==='buffRefresh'){ started[e.id]={name:e.name||started[e.id]?.name||e.id,value:e.value??started[e.id]?.value,until:e.until}; } if(e.type==='buffEnd') delete started[e.id]; } for(const b of Object.values(started)) if(b.until>=T) buffs.push(b); return {...s,buffs}; }
function timelineSvg(state,update,members,M,sim){
  const W=900,rowH=34,left=70,top=22; const dur=sim.duration; const x=t=>left+(t/dur)*(W-left-10); const H=top+rowH*members.length+40;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.setAttribute('class','tl-svg');
  const el=(tag,attrs,text)=>{ const n=document.createElementNS('http://www.w3.org/2000/svg',tag); for(const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); if(text!=null) n.textContent=text; return n; };
  for(let t=0;t<=dur;t+=5){ svg.append(el('line',{x1:x(t),y1:top-4,x2:x(t),y2:H-30,stroke:'#e4e6e1'})); svg.append(el('text',{x:x(t),y:H-16,'font-size':10,fill:'#68716c','text-anchor':'middle'},`${t}s`)); }
  members.forEach((m,k)=>{ const y=top+k*rowH; svg.append(el('text',{x:4,y:y+20,'font-size':11,fill:'#202522'},m.name)); svg.append(el('line',{x1:left,y1:y+rowH,x2:W-10,y2:y+rowH,stroke:'#edf0eb'}));
    if(sim.showNormals) for(const hit of M.hits) if(hit.member===m.i&&hit.kind==='normal') svg.append(el('rect',{x:x(hit.t)-1,y:y+18,width:2,height:10,fill:KIND_COLOR.normal}));
    // buff windows owned by member
    let bi=0; for(const e of M.events) if(e.type==='buffStart'&&e.owner===m.name){ const r=el('rect',{x:x(e.t),y:y+4+(bi%3)*4,width:Math.max(2,x(Math.min(e.until,dur))-x(e.t)),height:3,fill:'#e8dfc2'}); r.append(el('title',{},`${e.name} +${e.value} ${e.t}→${e.until}s`)); svg.append(r); bi++; }
  });
  // planned actions (draggable)
  sim.timeline.forEach((a,idx)=>{ const k=members.findIndex(m=>m.i===a.member); if(k<0) return; const y=top+k*rowH; const g=el('g',{class:'tl-action',style:'cursor:grab'}); const err=M.errors.find(e=>e.action===a||(e.action?.t===a.t&&e.action?.member===a.member&&e.action?.kind===a.kind));
    g.append(el('rect',{x:x(a.t)-6,y:y+8,width:12,height:18,rx:2,fill:KIND_COLOR[a.kind],stroke:err?'#c0392b':'#fff','stroke-width':err?2:1})); g.append(el('text',{x:x(a.t),y:y+31,'font-size':9,fill:'#303731','text-anchor':'middle'},KIND_LABEL[a.kind][0])); g.append(el('title',{},`${KIND_LABEL[a.kind]} @${a.t}s${err?' · '+err.message:''}（拖动改时间）`));
    let dragging=false; g.addEventListener('pointerdown',ev=>{ dragging=true; g.setPointerCapture(ev.pointerId); }); g.addEventListener('pointermove',ev=>{ if(!dragging) return; const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const p=pt.matrixTransform(svg.getScreenCTM().inverse()); const t=Math.max(0,Math.min(dur,Math.round(((p.x-left)/(W-left-10))*dur*10)/10)); g.querySelector('rect').setAttribute('x',x(t)-6); g.querySelector('text').setAttribute('x',x(t)); g.dataset.t=t; }); g.addEventListener('pointerup',()=>{ if(!dragging) return; dragging=false; const t=Number(g.dataset.t); if(!Number.isNaN(t)&&t!==a.t) update(s=>{ s.sim.timeline[idx].t=t; s.sim.timeline.sort((p,q)=>p.t-q.t); }); });
    svg.append(g); });
  // control switches & ult animations
  for(const e of M.events) if(e.type==='switch') svg.append(el('line',{x1:x(e.t),y1:top-4,x2:x(e.t),y2:H-30,stroke:'#68716c','stroke-dasharray':'3 3'}));
  // inspect cursor
  svg.append(el('line',{x1:x(Math.min(sim.inspectT,dur)),y1:top-6,x2:x(Math.min(sim.inspectT,dur)),y2:H-28,stroke:'#bd9b43','stroke-width':1.5}));
  svg.addEventListener('click',ev=>{ if(ev.target.closest('.tl-action')) return; const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const p=pt.matrixTransform(svg.getScreenCTM().inverse()); const t=Math.max(0,Math.min(dur,((p.x-left)/(W-left-10))*dur)); update(s=>{s.sim.inspectT=Math.round(t*10)/10;}); });
  return svg;
}
export function exportReport(state,res){ const M=res.main; return {simVersion:SIM_VERSION,dataVersion:meta.dataVersion,createdAt:new Date().toISOString(),inputs:{team:state.team,mainControl:state.mainControl,enemy:state.enemy,critMode:state.critMode,options:state.options,sim:state.sim,timing},summary:M.summary,range:{lo:res.lo.summary,hi:res.hi.summary},final:M.final,errors:M.errors,hits:M.hits,events:M.events,evidenceLimits:[]}; }

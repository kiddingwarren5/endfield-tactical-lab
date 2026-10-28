// 排轴一图流：预设主轴 / 备选轴的时间线图（主控普攻带、各人战技/连携/终结技、连携触发链、寒冷层数、技力）+ 分节叙述。
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import sets from '../data/sets.js'; import effects from '../data/effects.js'; import timing from '../data/timing.js'; import mechanics from '../data/mechanics.js'; import rotations,{scenarios} from '../data/rotations.js';
import {resolveRotation,rotationText,sumHits} from '../engine/sim/rotation.js';
import {h,fmt,fmt1,select,field,ELEMENT_CN,colorOf,pct} from './ui.js';
import {defaultSim} from './timeline-ui.js';
const data={operators,weapons,gear,sets,effects};
const ENEMY={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}}; // 对照靶默认值，与案例库一致；页面上可改
const GRADE={D:0,C:20,B:50};
const KIND_LABEL={skill:'战技',combo:'连携技',ultimate:'终结技'};
const KIND_COLOR={skill:'#bd9b43',combo:'#3288c4',ultimate:'#d9573d'};
const CIRCLED='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵';
const cache=new Map();
function resolved(preset,scenario,enemy){ const key=preset.id+'|'+scenario.id+'|'+JSON.stringify(enemy); if(!cache.has(key)) cache.set(key,resolveRotation(preset,{data,mechanics,timing,enemy},scenario,preset===rotations[0])); return cache.get(key); }

export function renderChart(root,state,update){
  root.innerHTML=''; const chart=state.chart||(state.chart={preset:rotations[0].id,scenario:scenarios[0].id}); if(!chart.enemy) chart.enemy=JSON.parse(JSON.stringify(ENEMY)); const enemy=chart.enemy;
  const preset=rotations.find(p=>p.id===chart.preset)||rotations[0]; const scenario=scenarios.find(x=>x.id===chart.scenario)||scenarios[0];
  const tabs=h('div',{class:'preset-tabs'},...rotations.map(p=>h('button',{type:'button',class:'preset-tab'+(p.id===preset.id?' active':''),onclick:()=>update(s=>{s.chart.preset=p.id;})},p.name)));
  const scTabs=h('div',{class:'preset-tabs'},...scenarios.map(x=>h('button',{type:'button',class:'preset-tab scenario'+(x.id===scenario.id?' active':''),onclick:()=>update(s=>{s.chart.scenario=x.id;})},x.name)));
  const isMain=preset===rotations[0]; const scenarioNote=scenario.steps&&!isMain?h('p',{class:'muted small'},'此场景的专用顺序只应用于主轴；备选轴沿用自身顺序，只换敌人与初始资源。'):'';
  // 敌人防御与各属性抗性（可自选；Boss 官方数值未公开，默认对照靶）
  const resRows=h('div',{class:'resistance-list'},...Object.entries(ELEMENT_CN).map(([k,l])=>{ const g=enemy.resistances[k]; const v=g==='custom'?(enemy.custom[k]??0):(GRADE[g]??0); return h('div',{class:'resistance-row'},h('span',{style:`color:${colorOf(k)}`},l),select([['D','D 级 0%'],['C','C 级 20%'],['B','B 级 50%'],['custom','自定义']],g,val=>update(s=>{s.chart.enemy.resistances[k]=val;})),h('output',{},pct(v)),g==='custom'?h('input',{class:'custom-res',type:'number',min:-100,max:100,step:1,value:v,onchange:ev=>update(s=>{s.chart.enemy.custom[k]=Number(ev.target.value);})}):''); }));
  const enemyPanel=h('div',{class:'enemy-box'},h('div',{class:'subheading'},'敌人（可自选）'),h('div',{class:'two-col'},field('防御力',h('input',{type:'number',min:0,max:99999,value:enemy.defence,onchange:ev=>update(s=>{s.chart.enemy.defence=Number(ev.target.value);})})),h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.chart.enemy=JSON.parse(JSON.stringify(ENEMY));})},'恢复对照靶')),resRows,h('p',{class:'muted small'},'抗性档位：D 0% / C 20% / B 50%（B 档实际 35–60% 不固定，请用自定义填具体值）。抗性只改伤害结算，不改动作时刻；腐蚀减抗由模拟器另行叠加。'));
  const host=h('div',{class:'chart-host'},h('p',{class:'muted'},'正在用模拟器排出最早可行时刻…'));
  root.append(h('div',{class:'workspace single chart'},h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'▤'),h('h2',{},'预设排轴'),h('span',{class:'muted small chart-hint'},'时刻 = 模拟器最早可行时刻；不暴击')),tabs,h('p',{class:'chart-summary'},preset.summary),h('div',{class:'subheading'},'Boss / 场景调轴'),scTabs,h('p',{class:'chart-summary'},scenario.desc),h('ul',{class:'tips'},...scenario.tips.map(t=>h('li',{},t))),scenarioNote,enemyPanel),host));
  setTimeout(()=>{ let res; try{ res=resolved(preset,scenario,enemy); }catch(e){ host.innerHTML=''; host.append(h('div',{class:'sim-errors'},'预设无法解析：'+e.message)); return; } host.innerHTML=''; host.append(chartSvg(preset,res),narrative(preset,res,state,update),comparison(preset,scenario,enemy)); },20);
}

function members(res){ return res.names.map((name,i)=>({i,name,op:operators.find(o=>o.name===name)})); }
function skillName(op,kind,stage){ return stage||op.skills?.[kind]?.name||KIND_LABEL[kind]; }
function castSeconds(kind){ return timing.castSeconds[kind]||1; }

function chartSvg(preset,res){
  const M=res.main, mem=members(res), main=res.input.mainControl; const T=Math.ceil(res.end+1);
  const W=1180,L=92,R=14,rowH=44,top=46; const rows=[{kind:'normal'},...mem.map(m=>({kind:'member',m})),{kind:'cold'},{kind:'sp'}]; const H=top+rows.length*rowH+28;
  const x=t=>L+(Math.min(t,T)/T)*(W-L-R); const rowY=k=>top+k*rowH;
  const NS='http://www.w3.org/2000/svg'; const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.setAttribute('class','chart-svg'); svg.setAttribute('role','img'); svg.setAttribute('aria-label',preset.name+' 一图流');
  const el=(tag,attrs,text)=>{ const n=document.createElementNS(NS,tag); for(const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); if(text!=null) n.textContent=text; return n; };
  // 节背景
  const segs=[]; res.timeline.forEach(a=>{ const s=res.steps[a.step]; if(!segs[s.seg]) segs[s.seg]={seg:s.seg,start:a.t,ult:false}; if(a.kind==='ultimate') segs[s.seg].ult=true; });
  const segList=segs.filter(Boolean); segList.forEach((s,i)=>{ const end=segList[i+1]?segList[i+1].start:T; if(i%2===1) svg.append(el('rect',{x:x(s.start),y:top-20,width:x(end)-x(s.start),height:H-top+20-24,fill:'#f6f1e3'})); svg.append(el('text',{x:x(s.start)+5,y:top-7,'font-size':11,'font-weight':700,fill:'#8a6b1f'},`第 ${s.seg} 节${s.ult?' · 爆发':' · 充能'}`)); });
  // 场景窗口：无敌段（灰）、失衡段（红）
  for(const [a,b] of (res.input.enemy?.invulnerable||[])){ svg.append(el('rect',{x:x(a),y:top-2,width:Math.max(1,x(b)-x(a)),height:H-top-22,fill:'#9aa09b',opacity:.18})); svg.append(el('text',{x:x(a)+4,y:top+10,'font-size':10,fill:'#4c5650'},'无敌 / 转阶段（假设）')); }
  for(const e of M.events) if(e.type==='stagger'&&e.t<=T){ svg.append(el('rect',{x:x(e.t),y:top-2,width:Math.max(1,x(e.until)-x(e.t)),height:H-top-22,fill:'#d9573d',opacity:.10})); svg.append(el('text',{x:x(e.t)+4,y:top+10,'font-size':10,fill:'#b3261e'},'失衡 +30% 承伤')); }
  // 时间轴
  for(let t=0;t<=T;t+=5){ svg.append(el('line',{x1:x(t),y1:top-2,x2:x(t),y2:H-24,stroke:'#e4e6e1'})); svg.append(el('text',{x:x(t),y:H-9,'font-size':10,fill:'#68716c','text-anchor':'middle'},`${t}s`)); }
  // 行标签与分隔
  rows.forEach((r,k)=>{ const y=rowY(k); svg.append(el('line',{x1:L,y1:y+rowH,x2:W-R,y2:y+rowH,stroke:'#edf0eb'})); const label=r.kind==='normal'?`主控普攻`:r.kind==='member'?`${String(r.m.i+1).padStart(2,'0')} ${r.m.name}${r.m.i===main?' ★':''}`:r.kind==='cold'?'寒冷附着':'共享技力'; svg.append(el('text',{x:6,y:y+rowH/2+4,'font-size':11,'font-weight':r.kind==='member'?700:500,fill:'#202522'},label)); });
  // 主控普攻带：普攻持续，动作施放期间中断；重击打刻度
  { const y=rowY(0); const busy=res.timeline.filter(a=>a.member===main).map(a=>[a.t,a.t+castSeconds(a.kind)]); let cur=0; for(const [b0,b1] of busy.concat([[T,T]])){ if(b0>cur) svg.append(el('rect',{x:x(cur),y:y+16,width:x(b0)-x(cur),height:12,fill:'#dfe5dd'})); cur=Math.max(cur,b1); }
    for(const e of M.events) if(e.type==='normalHit'&&e.control&&e.heavy&&e.t<=T) svg.append(el('rect',{x:x(e.t)-1,y:y+12,width:2,height:20,fill:'#5a6a5c'}));
    svg.append(el('text',{x:x(0)+4,y:y+11,'font-size':9,fill:'#68716c'},`${mem[main].name} 持续普攻（深色刻度 = 重击，回 ${mechanics.find(m=>m.operatorId===mem[main].op.id)?.normal?.heavySpRefund?.value??'?'} 技力并触发灌注追击）`)); }
  // 动作块
  const blockOf={}; res.timeline.forEach((a,i)=>{ const k=1+a.member, y=rowY(k); const w=Math.max(12,x(a.t+castSeconds(a.kind))-x(a.t)); const s=res.steps[a.step]; const g=el('g',{}); const r=el('rect',{x:x(a.t),y:y+13,width:w,height:18,rx:2,fill:KIND_COLOR[a.kind]}); g.append(r);
    g.append(el('text',{x:x(a.t)+w/2,y:y+26,'font-size':11,fill:'#fff','text-anchor':'middle','font-weight':700},CIRCLED[i]||String(i+1)));
    const label=`${skillName(mem[a.member].op,a.kind,s.stage)}${s.wait?`·${s.wait}层`:''}`; const lw=label.length*9.5; // 同一行相邻标签会撞上时改放到块下方
    const prevSame=res.timeline.slice(0,i).filter(b=>b.member===a.member).at(-1); const prev=prevSame&&blockOf[prevSame.step]; const above=!prev||(x(a.t)+w/2-prev.x)>(lw+prev.lw)/2+6||!prev.above; const ly=above?y+9:y+42; blockOf[a.step]={above,lw,x:x(a.t)+w/2,yTop:y+13,yBot:y+31};
    g.append(el('text',{x:x(a.t)+w/2,y:ly,'font-size':9.5,fill:'#303731','text-anchor':'middle'},label));
    g.append(el('title',{},`${a.t.toFixed(1)}s ${mem[a.member].name} ${KIND_LABEL[a.kind]}${s.stage?'「'+s.stage+'」':''}\n${s.why}`)); svg.append(g); });
  // 连携触发链：触发连携的最近一次动作 → 连携块
  res.timeline.forEach((a,i)=>{ if(a.kind!=='combo') return; const who=mem[a.member].name; const ready=[...M.events].filter(e=>e.type==='comboReady'&&e.who===who&&e.t<=a.t+1e-6).at(-1); if(!ready) return; const src=[...M.events].filter(e=>e.type==='cast'&&e.t<=ready.t+1e-6).at(-1); if(!src) return; const srcAct=res.timeline.filter(b=>Math.abs(b.t-src.t)<1e-6&&mem[b.member].name===src.who).at(-1); if(!srcAct||srcAct.step===a.step) return; const A=blockOf[srcAct.step], B=blockOf[a.step]; if(!A||!B) return; const down=B.yTop>A.yBot; const y1=down?A.yBot:A.yTop, y2=down?B.yTop:B.yBot; const mx=(A.x+B.x)/2; svg.append(el('path',{d:`M${A.x},${y1} C${A.x},${(y1+y2)/2} ${B.x},${(y1+y2)/2} ${B.x},${y2}`,fill:'none',stroke:'#3288c4','stroke-width':1.2,'stroke-dasharray':'3 3',opacity:.8})); svg.append(el('circle',{cx:B.x,cy:y2,r:2.4,fill:'#3288c4'})); });
  // 寒冷层数阶梯
  { const k=rows.findIndex(r=>r.kind==='cold'), y=rowY(k); const pts=[[0,0]]; for(const e of M.events){ if(e.t>T) break; if(e.type==='attach'&&e.element==='cold') pts.push([e.t,e.layers]); else if((e.type==='consume'||e.type==='attachExpire')&&e.element==='cold') pts.push([e.t,0]); else if(e.type==='abnormal'&&e.which!=='freeze') pts.push([e.t,0]); }
    pts.push([T,pts.at(-1)[1]]); const yy=v=>y+rowH-6-v*(rowH-14)/4; let d=''; pts.forEach(([t,v],i)=>{ const px=x(t); if(i===0) d=`M${px},${yy(v)}`; else { const pv=pts[i-1][1]; d+=` L${px},${yy(pv)} L${px},${yy(v)}`; } }); svg.append(el('path',{d,fill:'none',stroke:'#2d7fbf','stroke-width':1.6}));
    pts.forEach(([t,v],i)=>{ if(i>0&&v>pts[i-1][1]) svg.append(el('text',{x:x(t)+2,y:yy(v)-2,'font-size':9,fill:'#2d7fbf'},v)); }); for(const e of M.events) if(e.type==='consume'&&e.element==='cold'&&e.t<=T) svg.append(el('text',{x:x(e.t)+2,y:y+rowH-8,'font-size':9,fill:'#d9573d','font-weight':700},`吃${e.layers}层`)); }
  // 技力折线
  { const k=rows.findIndex(r=>r.kind==='sp'), y=rowY(k); const yy=v=>y+rowH-6-v*(rowH-14)/300; svg.append(el('line',{x1:L,y1:yy(100),x2:W-R,y2:yy(100),stroke:'#e8dcc0','stroke-dasharray':'2 3'})); svg.append(el('text',{x:W-R-2,y:yy(100)-2,'font-size':8.5,fill:'#9a7424','text-anchor':'end'},'100 = 一次战技')); let d=''; M.samples.filter(s=>s.t<=T).forEach((s,i)=>{ d+=(i?' L':'M')+`${x(s.t)},${yy(s.sp)}`; }); svg.append(el('path',{d,fill:'none',stroke:'#9a7424','stroke-width':1.4})); }
  // 满能标记
  mem.forEach((m,k)=>{ const max=M.summary.energyMax[k]; const first=M.events.find(e=>e.energy&&e.energy[k]>=max-1e-6); if(first&&first.t<=T){ const y=rowY(1+m.i); svg.append(el('path',{d:`M${x(first.t)},${y+34} l4,7 l-8,0 z`,fill:'#d9573d'})); svg.append(el('title',{},`${m.name} 终结技能量在 ${first.t.toFixed(1)}s 充满`)); } });
  // 图例
  const legend=h('div',{class:'chart-legend'},...Object.entries(KIND_LABEL).map(([k,l])=>h('span',{},h('i',{style:`background:${KIND_COLOR[k]}`}),l)),h('span',{},h('i',{style:'background:#dfe5dd'}),'主控普攻'),h('span',{},h('i',{class:'dash'}),'连携触发链'),h('span',{},h('i',{class:'tri'}),'终结技能量充满'),h('span',{},'★ 主控'));
  const wrap=h('section',{class:'panel chart-panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'▦'),h('h2',{},`${preset.name} · 一图流`),h('span',{class:'muted small chart-hint'},'横轴为游戏内秒数；悬停色块看说明；截图即可分享')),h('div',{class:'chart-scroll'},svg),legend);
  return wrap;
}

function narrative(preset,res,state,update){
  const M=res.main, mem=members(res); const end=res.end; const mc=res.input.mainControl; const endLabel=res.scenario?.timeLimit?`限时 ${end} s 内`:'周期内'; const total=sumHits(M,{until:end}), lo=sumHits(res.lo,{until:end}), hi=sumHits(res.hi,{until:end}); const sure=sumHits(M,{until:end,mainControl:mc,guaranteed:true});
  const ults=M.events.filter(e=>e.type==='cast'&&e.kind==='ultimate').map(e=>`${e.who} ${e.t.toFixed(1)}s`).join('、');
  const groups=[]; res.timeline.forEach((a,i)=>{ const s=res.steps[a.step]; let g=groups.find(x=>x.seg===s.seg); if(!g){ g={seg:s.seg,items:[],ult:false}; groups.push(g); } if(a.kind==='ultimate') g.ult=true; g.items.push({a,i,s,st:res.states[i]}); });
  const stepRow=({a,i,s,st})=>h('li',{class:'step'},h('span',{class:'step-no',style:`background:${KIND_COLOR[a.kind]}`},CIRCLED[i]||i+1),h('span',{class:'step-t'},`${a.t.toFixed(1)}s`),h('span',{class:'step-body'},h('b',{},`${mem[a.member].name} · ${KIND_LABEL[a.kind]}${s.stage?'「'+s.stage+'」':''}${s.wait?`（寒冷 ${s.wait} 层后）`:''}`),h('span',{class:'step-why'},s.why,st.consumed?`（实际消耗 ${st.consumed} 层）`:''),h('span',{class:'step-state muted'},st.sp==null?'':`技力 ${Math.round(st.sp)} · 寒冷 ${st.cold} 层 · 能量 ${st.energy.map(Math.round).join('/')}`),st.error?h('span',{class:'warn'},st.error):''));
  const text=rotationText(preset,res); const copyStatus=h('span',{class:'muted small'},'');
  const copyBtn=h('button',{type:'button',class:'mini-btn',onclick:()=>{ const done=()=>{copyStatus.textContent='已复制文字轴';}; const fb=()=>{ const ta=h('textarea',{class:'export-box',readonly:true},text); document.body.append(ta); ta.select(); try{ document.execCommand('copy'); done(); }catch{ copyStatus.textContent='请从下方文字手动复制'; } ta.remove(); }; if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(fb); else fb(); }},'复制文字轴');
  const applyBtn=h('button',{type:'button',class:'mini-btn primary',onclick:()=>{ update(s=>{ s.team=JSON.parse(JSON.stringify(res.input.team)); s.active=0; s.mainControl=res.input.mainControl; s.enemy=JSON.parse(JSON.stringify(res.input.enemy)); const sim=s.sim||(s.sim=defaultSim()); sim.timeline=res.timeline.map(({t,member,kind})=>({t,member,kind})); sim.duration=Math.ceil(end+4); sim.initialSp=res.input.initial.sp; sim.initialEnergy=[...res.input.initial.energy]; sim.scheduleNotes=[]; }); location.hash='#timeline'; }},'套用编队并载入排轴模拟（可编辑）');
  return h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'≡'),h('h2',{},'分节叙述')),
    h('div',{class:'chart-stats'},stat(res.scenario?.timeLimit?'限时':'周期',`${end.toFixed(1)} s`,res.scenario?.timeLimit?'场景时限内的伤害':(res.cycle.complete?'全员各放一次终结技':'周期未完成，按模拟时长')),stat(`${endLabel}保底总伤`,fmt(sure),`每秒 ${fmt(sure/end)}；只算主控普攻 + 全员战技/连携/终结技，不计副控自动普攻（实战保证能打出）`),stat(`${endLabel}含副控普攻总伤`,fmt(total),`每秒 ${fmt(total/end)}；基准 δ=${timing.nonControl.default.damageFactor}, φ=${timing.nonControl.default.rhythmFactor}；区间 ${fmt(lo)}–${fmt(hi)}`),stat('终结技时刻',ults,'')),
    h('div',{class:'chart-team'},...res.input.team.map((m,i)=>{ const op=operators.find(o=>o.id===m.operatorId), w=weapons.find(x=>x.id===m.weapon.id); return h('div',{class:'team-card'},h('img',{src:op.icon,alt:'',class:'item-thumb'}),h('div',{},h('b',{},`${String(i+1).padStart(2,'0')} ${op.name}${i===res.input.mainControl?' ★主控':''}`),h('small',{},`${w?.name||''} · 潜 ${m.potential} · ${[m.gear.armor,m.gear.gloves,m.gear.kit1,m.gear.kit2].map(g=>gear.find(x=>x.id===g.id)?.name).join('/')}`))); })),
    ...groups.map(g=>[h('h3',{class:'seg-title'},`第 ${g.seg} 节 · ${g.ult?'爆发':'充能'}`),h('ol',{class:'steps'},...g.items.map(stepRow))]),
    h('div',{class:'result-actions'},applyBtn,copyBtn,copyStatus),
    h('details',{class:'chart-details'},h('summary',{},'文字轴（可全选复制）'),h('pre',{class:'rotation-text'},text)),
    h('div',{class:'chart-notes'},h('b',{},'来源'),h('ul',{},...preset.sources.map(s=>h('li',{},s))),h('b',{},'待实机验证 / 误差来源'),h('ul',{},...preset.verify.map(s=>h('li',{},s)))));
}
function stat(label,value,sub){ return h('div',{class:'result-mini stat'},h('span',{},label),h('strong',{},value),sub?h('small',{class:'muted'},sub):''); }

function comparison(current,scenario,enemy){
  const rows=rotations.map(p=>{ let r; try{ r=resolved(p,scenario,enemy); }catch{ return null; } const end=r.end; const mc=r.input.mainControl; const tot=sumHits(r.main,{until:end}); const sure=sumHits(r.main,{until:end,mainControl:mc,guaranteed:true}); return {p,end,tot,sure,dps:tot/end,lo:sumHits(r.lo,{until:end})/end,hi:sumHits(r.hi,{until:end})/end,errs:r.main.errors.length}; }).filter(Boolean);
  return h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'⇄'),h('h2',{},`主轴与备选对照 · ${scenario.name}`)),
    h('table',{class:'seg-table'},h('thead',{},h('tr',{},h('th',{},'轴'),h('th',{},scenario.timeLimit?'限时':'周期'),h('th',{},'保底总伤'),h('th',{},'保底每秒'),h('th',{},'含副控普攻每秒'),h('th',{},'每秒区间（δ/φ）'),h('th',{},'不可执行'))),h('tbody',{},...rows.map(r=>h('tr',{class:r.p.id===current.id?'current':''},h('td',{},r.p.name),h('td',{},`${r.end.toFixed(1)} s`),h('td',{},fmt(r.sure)),h('td',{},fmt(r.sure/r.end)),h('td',{},fmt(r.dps)),h('td',{},`${fmt(r.lo)}–${fmt(r.hi)}`),h('td',{},r.errs?String(r.errs):'无'))))),
    h('p',{class:'muted small'},'保底 = 主控普攻 + 全员战技/连携/终结技（实战能保证打出的部分）；副控自动普攻另列。模型未计入：汤汤战技吃涡流的技力返还（利于 4 层轴，每节约快 1–3 s）、祀笔意爆发与墨魂伤害、处决回技力。数值差在 5% 以内时不应据此判定优劣，请以实机验证为准（docs/verification-needed.md）。'));
}

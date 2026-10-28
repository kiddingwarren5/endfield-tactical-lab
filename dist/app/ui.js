// Small DOM helpers and shared widgets (no framework).
export const $=id=>document.getElementById(id);
export function h(tag,attrs={},...children){ const el=document.createElement(tag); for(const [k,v] of Object.entries(attrs||{})){ if(v==null||v===false) continue; if(k==='class') el.className=v; else if(k==='html') el.innerHTML=v; else if(k.startsWith('on')) el.addEventListener(k.slice(2),v); else if(k==='dataset') Object.assign(el.dataset,v); else if(k in el&&k!=='list'&&typeof v!=='object') el[k]=v; else el.setAttribute(k,v===true?'':v); } for(const c of children.flat(Infinity)){ if(c==null||c===false) continue; el.append(c instanceof Node?c:document.createTextNode(String(c))); } return el; }
export const fmt=n=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:0}).format(Math.round(n));
export const fmt1=n=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:1}).format(n);
export const pct=n=>`${Number(n).toFixed(1).replace(/\.0$/,'')}%`;
export const pct2=n=>`${Number(n).toFixed(2).replace(/\.?0+$/,'')}%`;
export const ELEMENT_CN={physical:'物理',cold:'寒冷',heat:'灼热',electric:'电磁',nature:'自然'};
export const KIND_CN={normal:'普通攻击',skill:'战技',combo:'连携技',ultimate:'终结技',mech:'机制伤害'};
export const PROF_CN={guard:'近卫',caster:'术师',assault:'突击',vanguard:'先锋',defender:'重装',supporter:'辅助'};
export const WT_CN={sword:'单手剑',arts:'施术单元',greatsword:'双手剑',polearm:'长柄武器',pistol:'手铳'};
export const ABIL_CN={str:'力量',agi:'敏捷',int:'智识',will:'意志',main:'主能力',sub:'副能力',all:'全能力'};
export const colorOf=el=>`var(--${el||'physical'})`;
export function select(opts,value,onChange,attrs={}){ const s=h('select',{onchange:e=>onChange(e.target.value),...attrs}); for(const o of opts){ const [v,label,extra]=Array.isArray(o)?o:[o,o]; const op=h('option',{value:String(v)},label); if(extra?.disabled) op.disabled=true; s.append(op); } s.value=String(value); if(s.value!==String(value)&&s.options.length) s.selectedIndex=0; return s; }
// Icon picker: button showing current choice; opens a searchable list with thumbnails.
export function picker({options,value,placeholder='未选择',onChange,empty=true,emptyLabel='不装备'}){
  const cur=options.find(o=>o.id===value); const wrap=h('div',{class:'picker'});
  const btn=h('button',{type:'button',class:'picker-btn'},cur?[h('img',{class:'item-thumb',src:cur.icon,alt:''}),h('span',{class:'picker-text'},h('strong',{},cur.name),h('small',{},cur.sub||''))]:[h('span',{class:'item-thumb empty'}),h('span',{class:'picker-text'},h('strong',{},placeholder))]);
  btn.addEventListener('click',()=>{ const existing=wrap.querySelector('.picker-pop'); if(existing){existing.remove();return;} const pop=h('div',{class:'picker-pop'}); const q=h('input',{type:'search',placeholder:'搜索…',class:'picker-search'}); const list=h('div',{class:'picker-list'});
    const render=()=>{ list.innerHTML=''; const s=q.value.trim(); if(empty) list.append(h('button',{type:'button',class:'picker-item',onclick:()=>{onChange(null);pop.remove();}},h('span',{class:'item-thumb empty'}),h('span',{},emptyLabel))); for(const o of options){ if(s&&!(o.name+(o.sub||'')).includes(s)) continue; list.append(h('button',{type:'button',class:'picker-item'+(o.id===value?' current':'')+(o.disabled?' disabled':''),disabled:o.disabled,onclick:()=>{onChange(o.id);pop.remove();}},h('img',{class:'item-thumb',src:o.icon,alt:'',loading:'lazy'}),h('span',{},h('strong',{},o.name),h('small',{},o.sub||'')))); } };
    q.addEventListener('input',render); pop.append(q,list); render(); wrap.append(pop); q.focus(); const close=e=>{ if(!wrap.contains(e.target)){ pop.remove(); document.removeEventListener('mousedown',close);} }; setTimeout(()=>document.addEventListener('mousedown',close),0); });
  wrap.append(btn); return wrap;
}
// Numbered collapsible panel. folds[id] = true means collapsed. Collapsing never resets state (content stays in DOM).
export function panel({id,index,title,folds,onFold,defaultCollapsed=false,extra},...children){ const collapsed=folds[id]??defaultCollapsed; const body=h('div',{class:'panel-body',hidden:collapsed},...children);
  const btn=h('button',{type:'button',class:'fold-btn','aria-expanded':String(!collapsed),onclick:()=>{ const c=!body.hidden; body.hidden=c; btn.textContent=c?'展开':'折叠'; btn.setAttribute('aria-expanded',String(!c)); onFold(id,c); }},collapsed?'展开':'折叠');
  return h('section',{class:'panel',id:'panel-'+id},h('div',{class:'panel-heading'},h('span',{class:'index'},index),h('h2',{},title),extra||'',btn),body); }
export function field(label,control,note){ return h('label',{class:'field'},h('span',{},label,note?h('em',{},' '+note):''),control); }
export function download(name,text,type='application/json'){ const a=h('a',{href:URL.createObjectURL(new Blob([text],{type})),download:name}); document.body.append(a); a.click(); a.remove(); }

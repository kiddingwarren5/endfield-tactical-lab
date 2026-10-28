// Boot: tab routing, global state, re-render on change. Persistence: localStorage (best effort).
import {defaultState,STATE_VERSION} from './state.js';
import {renderCalc,snapshotDialog} from './calc-ui.js';
import {renderRotation} from './chart-ui.js';
import {$,h} from './ui.js';
import meta from '../data/meta.js';

let state=load()||defaultState();
function load(){ try{ const raw=localStorage.getItem('endfield-lab-state'); if(!raw) return null; const s=JSON.parse(raw); if(s.version!==STATE_VERSION) return null; delete s.pendingSnapshot; return s; }catch{ return null; } }
function save(){ try{ localStorage.setItem('endfield-lab-state',JSON.stringify(state)); }catch{} }

const tabs={calculator:'伤害计算',rotation:'排轴'};
const ALIAS={chart:'rotation',timeline:'rotation',team:'rotation'};
const tabOf=hash=>{ const t=hash.replace('#',''); return tabs[t]?t:ALIAS[t]||null; };
let currentTab=tabOf(location.hash)||'calculator';

export function update(mutator,{silent=false}={}){ mutator(state); save(); if(silent){ renderLight(); } else render(); }
function renderLight(){ // numeric inputs: re-render result/breakdown only to keep focus
  if(currentTab!=='calculator'){ render(); return; }
  const root=$('calculator'); const res=root.querySelector('.right-column'); if(!res){ render(); return; }
  const tmp=h('div'); renderCalc(tmp,state,update); const fresh=tmp.querySelector('.right-column'); if(fresh) res.replaceWith(fresh);
}
function render(){
  for(const [id,label] of Object.entries(tabs)){ const a=$('tab-'+id); if(a) a.classList.toggle('active',id===currentTab); const sec=$(id); if(sec) sec.hidden=id!==currentTab; }
  const h1=document.querySelector('.hero h1'); if(h1){ h1.childNodes[0].textContent=tabs[currentTab]; }
  if(currentTab==='calculator'){ renderCalc($('calculator'),state,update); }
  else if(currentTab==='rotation'){ renderRotation($('rotation'),state,update); }
  const dlgHost=$('dialog-host'); dlgHost.innerHTML=''; const dlg=snapshotDialog(state,update); if(dlg) dlgHost.append(dlg);
  $('meta-line').textContent=`数据版本 ${meta.dataVersion} · 游戏版本 ${meta.gameVersion} · 官方抓取 ${meta.officialFetchedAt.slice(0,10)} · 干员 ${meta.counts.operators} / 武器 ${meta.counts.weapons} / 装备 ${meta.counts.gear} / 食药 ${meta.counts.consumables}`;
}
window.addEventListener('hashchange',()=>{ const t=tabOf(location.hash); if(t){ currentTab=t; render(); } });
$('reset').addEventListener('click',()=>{ const keep=state.snapshots; state=defaultState(); state.snapshots=keep; save(); render(); });
render();

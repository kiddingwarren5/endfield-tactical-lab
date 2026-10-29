// Boot: tab routing, global state, re-render on change. Persistence: localStorage (best effort).
import {defaultState,ensureBuilds,STATE_VERSION} from './state.js';
import {renderCalc,snapshotDialog} from './calc-ui.js';
import {renderRotation} from './chart-ui.js';
import {renderSetup} from './setup-ui.js';
import {$,h} from './ui.js';

let state=load()||defaultState();
function load(){ try{ const raw=localStorage.getItem('endfield-lab-state'); if(!raw) return null; const s=JSON.parse(raw); if(s.version!==STATE_VERSION) return null; delete s.pendingSnapshot; ensureBuilds(s); return s; }catch{ return null; } }
function save(){ try{ localStorage.setItem('endfield-lab-state',JSON.stringify(state)); }catch{} }

const tabs={setup:'配置',rotation:'排轴',calculator:'伤害计算'};
const ALIAS={chart:'rotation',timeline:'rotation',team:'setup'};
const tabOf=hash=>{ const t=hash.replace('#',''); return tabs[t]?t:ALIAS[t]||null; };
let currentTab=tabOf(location.hash)||'setup';

export function update(mutator,{silent=false}={}){ mutator(state); save(); if(silent){ renderLight(); } else render(); }
function renderLight(){ // numeric inputs: re-render result/breakdown only to keep focus
  if(currentTab!=='calculator'){ render(); return; }
  const root=$('calculator'); const res=root.querySelector('.right-column'); if(!res){ render(); return; }
  const tmp=h('div'); renderCalc(tmp,state,update); const fresh=tmp.querySelector('.right-column'); if(fresh) res.replaceWith(fresh);
}
function render(){
  for(const [id,label] of Object.entries(tabs)){ const a=$('tab-'+id); if(a) a.classList.toggle('active',id===currentTab); const sec=$(id); if(sec) sec.hidden=id!==currentTab; }
  const h1=document.querySelector('.hero h1'); if(h1){ h1.childNodes[0].textContent=tabs[currentTab]; }
  if(currentTab==='setup'){ renderSetup($('setup'),state,update); }
  else if(currentTab==='calculator'){ renderCalc($('calculator'),state,update); }
  else if(currentTab==='rotation'){ renderRotation($('rotation'),state,update); }
  const dlgHost=$('dialog-host'); dlgHost.innerHTML=''; const dlg=snapshotDialog(state,update); if(dlg) dlgHost.append(dlg);
}
window.addEventListener('hashchange',()=>{ const t=tabOf(location.hash); if(t){ currentTab=t; render(); } });
$('reset').addEventListener('click',()=>{ const keep=state.snapshots; state=defaultState(); state.snapshots=keep; save(); render(); });
render();

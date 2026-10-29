// Boot: tab routing, global state, re-render on change. Persistence: localStorage (best effort).
import {defaultState,ensureBuilds,STATE_VERSION} from './state.js';
import {renderRotation} from './chart-ui.js';
import {renderSetup} from './setup-ui.js';
import {renderAttribution} from './attribution-ui.js';
import {$} from './ui.js';

let state=load()||defaultState();
function load(){ try{ const raw=localStorage.getItem('endfield-lab-state'); if(!raw) return null; const s=JSON.parse(raw); if(s.version!==STATE_VERSION) return null; ensureBuilds(s); return s; }catch{ return null; } }
function save(){ try{ localStorage.setItem('endfield-lab-state',JSON.stringify(state)); }catch{} }

const tabs={setup:'配置',rotation:'排轴',attribution:'伤害归因'};
const ALIAS={chart:'rotation',timeline:'rotation',team:'setup',calculator:'attribution'};
const tabOf=hash=>{ const t=hash.replace('#',''); return tabs[t]?t:ALIAS[t]||null; };
let currentTab=tabOf(location.hash)||'setup';

export function update(mutator){ mutator(state); save(); render(); }
function render(){
  for(const id of Object.keys(tabs)){ const a=$('tab-'+id); if(a) a.classList.toggle('active',id===currentTab); const sec=$(id); if(sec) sec.hidden=id!==currentTab; }
  const h1=document.querySelector('.hero h1'); if(h1){ h1.childNodes[0].textContent=tabs[currentTab]; }
  if(currentTab==='setup') renderSetup($('setup'),state,update);
  else if(currentTab==='rotation') renderRotation($('rotation'),state,update);
  else renderAttribution($('attribution'),state,update);
}
window.addEventListener('hashchange',()=>{ const t=tabOf(location.hash); if(t){ currentTab=t; render(); } });
$('reset').addEventListener('click',()=>{ state=defaultState(); save(); render(); });
render();

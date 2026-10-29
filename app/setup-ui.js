// 配置页：编队四个槽位（点谁展开谁的练度、武器、装备、食药）→ 目标 → 完成。所有输入只在这一页，后两页只读。
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import sets from '../data/sets.js'; import consumables from '../data/consumables.js'; import effects from '../data/effects.js'; import {scenarios} from '../data/rotations.js';
import {getStats} from '../engine/stats.js'; import {effectiveMode,MODE_LABEL} from '../engine/skills.js';
import {h,fmt,pct,select,picker,field,ELEMENT_CN,KIND_CN,PROF_CN,WT_CN,ABIL_CN,colorOf} from './ui.js';
import {newMember,clone,rankToWeaponPotential,applyDefaultBuild,buildStatus,ensureRot,exampleTeam,schemesOf,ENEMY_DEFAULT} from './state.js';
const data={operators,weapons,gear,sets,consumables,effects};
const GRADE={D:0,C:20,B:50};
const pad=i=>String(i+1).padStart(2,'0');
const opOf=m=>operators.find(o=>o.id===m.operatorId);
const statsOf=m=>getStats(m,data,{consumables:m.consumables});

export function renderSetup(root,state,update){
  root.innerHTML=''; const rot=ensureRot(state); if(!state.ui) state.ui={folds:{}};
  const count=state.team.filter(Boolean).length; const bare=state.team.filter(m=>m&&buildStatus(m).kind==='none').length;
  root.append(h('div',{class:'setup'},squadPanel(state,update),targetPanel(state,update,rot),
    h('div',{class:'setup-actions'},h('button',{type:'button',class:'done-btn',disabled:!count,onclick:()=>{ location.hash='#rotation'; }},'完成'),h('span',{class:'muted'},count?(bare?`${bare} 人未配装，按裸装计算`:''):'先添加至少一名干员'))));
}

// ---------- 编队 ----------
function squadPanel(state,update){
  const open=state.ui.editSlot; const cards=[0,1,2,3].map(i=>slotCard(state,update,i));
  const editor=open!=null&&state.team[open]?memberEditor(state,update,open):'';
  return h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'01'),h('h2',{},'编队'),savedRow(state,update)),
    h('div',{class:'squad'},...cards),editor);
}
function slotCard(state,update,i){
  const m=state.team[i];
  if(!m){ const taken=new Set(state.team.filter(Boolean).map(x=>x.operatorId)); const opts=operators.filter(o=>!taken.has(o.id)).map(o=>({id:o.id,name:o.name,icon:o.icon,disabled:Boolean(o.preview),sub:`${PROF_CN[o.profession]} · ${ELEMENT_CN[o.element]} · ${WT_CN[o.weaponType]}${o.preview?' · 官方数据未公开':''}`}));
    return h('div',{class:'squad-card empty'},h('div',{class:'slot-no'},`${pad(i)} 号位`),picker({options:opts,value:null,placeholder:'添加干员',empty:false,onChange:id=>update(s=>{ const nm=newMember(id); applyDefaultBuild(nm); s.team[i]=nm; if(!s.team[s.mainControl]) s.mainControl=i; if(!s.team[s.active]) s.active=i; s.ui.editSlot=i; })})); }
  const op=opOf(m), st=statsOf(m), w=st.weapon, status=buildStatus(m), open=state.ui.editSlot===i;
  const mode=op.skills?.skill?.modeVariants?` · ${MODE_LABEL[effectiveMode(op,m,st)]}`:'';
  return h('button',{type:'button',class:'squad-card'+(open?' open':''),'aria-expanded':String(open),style:`--el:${colorOf(op.element)}`,onclick:()=>update(s=>{ s.ui.editSlot=open?null:i; })},
    h('div',{class:'slot-no'},h('span',{},`${pad(i)} 号位`),i===state.mainControl?h('span',{class:'mc-star'},'★ 主控'):''),
    h('div',{class:'squad-id'},h('img',{class:'op-thumb',src:op.icon,alt:''}),h('div',{},h('strong',{},op.name),h('small',{},`${PROF_CN[op.profession]} · ${ELEMENT_CN[op.element]} · 潜 ${m.potential}${mode}`))),
    h('div',{class:'squad-lines'},h('span',{},w?w.name:'未配武器'),h('span',{},gearSummary(st)),status.scheme?h('span',{class:'muted'},status.scheme):''),
    h('span',{class:'build-tag '+status.kind},status.label));
}
function gearSummary(st){ const parts=Object.entries(st.sets).map(([id,n])=>{ const s=sets.find(x=>x.id===id); return `${(s?.name||id).replace('装备组','')} ${n}`; }); return parts.length?parts.join(' + '):'未配装'; }

function savedRow(state,update){
  const saved=state.savedTeams||(state.savedTeams=[]); const name=h('input',{type:'text',placeholder:'方案名',value:state.ui.saveName||''});
  name.addEventListener('input',()=>{ state.ui.saveName=name.value; });
  const count=state.team.filter(Boolean).length;
  return h('div',{class:'saved-row'},
    saved.length?select([['','载入已存方案'],...saved.map((t,k)=>[k,t.name])],'',v=>{ if(v==='') return; update(s=>{ const t=s.savedTeams[Number(v)]; s.team=clone(t.team); s.mainControl=t.mainControl; s.rot=clone(t.rot); s.active=Math.max(0,s.team.findIndex(Boolean)); s.ui.editSlot=null; s.ui.loaded=Number(v); }); }):'',
    name,h('button',{type:'button',class:'mini-btn',disabled:!count,onclick:()=>update(s=>{ const n=(s.ui.saveName||'').trim()||s.team.filter(Boolean).map(m=>opOf(m).name).join(''); const t={name:n,team:clone(s.team),mainControl:s.mainControl,rot:clone(s.rot)}; const k=s.savedTeams.findIndex(x=>x.name===n); if(k>=0) s.savedTeams[k]=t; else s.savedTeams.push(t); s.ui.saveName=''; })},'保存当前'),
    state.ui.loaded!=null&&saved[state.ui.loaded]?h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{ s.savedTeams.splice(s.ui.loaded,1); s.ui.loaded=null; })},`删除「${saved[state.ui.loaded].name}」`):'',
    h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{ const ex=exampleTeam(); s.team=ex.team; s.mainControl=ex.mainControl; s.active=ex.mainControl; s.ui.editSlot=null; s.rot.scenario='target'; })},'示例编队'));
}

// ---------- 单个干员的编辑区 ----------
function memberEditor(state,update,i){
  const m=state.team[i], op=opOf(m), st=statsOf(m), weapon=st.weapon, ranks=m.weapon.ranks;
  const edit=fn=>update(s=>{ fn(s.team[i],s); });
  const custom=fn=>update(s=>{ fn(s.team[i],s); s.team[i].buildSource='custom'; });
  const rankLabel=n=>n<=9?`Rank ${n}`:`专精 ${n-9}`;
  const level=block('练度',
    h('div',{class:'two-col'},field('潜能',select([0,1,2,3,4,5].map(n=>[n,`${n} 潜`]),m.potential,v=>edit(x=>{x.potential=Number(v);}))),
      op.skills?.skill?.modeVariants?field('技能形态',select([['auto',`按面板自动（现在是${MODE_LABEL[effectiveMode(op,m,st)]}）`],...op.skills.skill.modeVariants.map((v,k)=>[k,MODE_LABEL[k]])],typeof m.mode==='number'?m.mode:'auto',v=>edit(x=>{x.mode=v==='auto'?'auto':Number(v);}))):''),
    h('div',{class:'four-col'},...['normal','skill','combo','ultimate'].map(k=>field(KIND_CN[k],select(Array.from({length:12},(_,n)=>[n+1,rankLabel(n+1)]),m.skillRanks[k],v=>edit(x=>{x.skillRanks[k]=Number(v);}))))));
  const wOpts=weapons.filter(w=>w.type===op.weaponType).sort((a,b)=>b.rarity-a.rarity).map(w=>({id:w.id,name:w.name,icon:w.icon,sub:`${w.rarity}★ · 基础攻击 ${w.baseAtk90}`}));
  const weaponBlock=block('武器',picker({options:wOpts,value:m.weapon.id,placeholder:'选择武器',emptyLabel:'不装备武器',onChange:id=>custom(x=>{x.weapon={id,potential:0,substrate:[6,6,3],ranks:[9,9,4]};})}),
    weapon?[h('div',{class:'two-col'},field('武器潜能',select([0,1,2,3,4,5].map(n=>[n,`${n} 潜`]),m.weapon.potential,v=>custom(x=>{const w=x.weapon;w.potential=Number(v);w.ranks[2]=Math.min(9,1+Number(v)+(w.substrate?.[2]??3));}))),
        field(weapon.skills[2]?.name||'被动',select([4,5,6,7,8,9].map(n=>[n,`Rank ${n}`]),ranks[2],v=>custom(x=>{const w=x.weapon;w.ranks[2]=Number(v);w.potential=rankToWeaponPotential(v);w.substrate[2]=3;})))),
      h('div',{class:'two-col'},...[0,1].map(k=>field(`${weapon.skills[k]?.name||'词条'} 基质加级`,select([0,1,2,3,4,5,6].map(n=>[n,`+${n}`]),m.weapon.substrate?.[k]??6,v=>custom(x=>{const w=x.weapon;w.substrate[k]=Number(v);w.ranks[k]=Math.min(9,3+Number(v));}))))),
      h('div',{class:'weapon-passive'},h('b',{},weapon.skills[2]?.name||''),h('span',{},(weapon.skills[2]?.rankTexts?.[ranks[2]-1]||'').replace(/\n/g,' ')))]:'');
  const slots=[['armor','护甲','armor'],['gloves','护手','gloves'],['kit1','配件 1','kit'],['kit2','配件 2','kit']];
  const gearRows=slots.map(([slot,label,type])=>{ const conf=m.gear[slot]; const item=conf.id?gear.find(g=>g.id===conf.id):null; const otherKit=slot==='kit1'?m.gear.kit2.id:slot==='kit2'?m.gear.kit1.id:null;
    const opts=gear.filter(g=>g.slot===type).sort((a,b)=>(a.setName||'').localeCompare(b.setName||'')).map(g=>({id:g.id,name:g.name,icon:g.icon,sub:`${(g.setName||'').replace('装备组','')} · ${g.attrs.map(a=>a.name).join(' / ')}`,disabled:g.id===otherKit}));
    return h('div',{class:'gear-row'},h('div',{class:'gear-head'},h('span',{class:'gear-slot-label'},label),picker({options:opts,value:conf.id,placeholder:'未装备',onChange:id=>custom(x=>{x.gear[slot]={id,refine:[3,3,3]};})})),
      item?h('div',{class:'refine-grid'},...item.attrs.map((a,k)=>{ const r=conf.refine[k]??3; return h('label',{class:'refine-field'},h('span',{},a.name,' ',h('b',{},a.pct?pct(a.display?.[r]??a.values[r]):fmt(a.values[r]))),select([0,1,2,3].map(n=>[n,`精锻 +${n}`]),r,v=>custom(x=>{x.gear[slot].refine[k]=Number(v);}))); })):''); });
  const setLines=Object.entries(st.sets).map(([id,n])=>{ const s=sets.find(x=>x.id===id); const need=s?.pieces||3; return h('div',{class:n>=need?'':'muted'},`${s?.name||id} ${n} / ${need} 件${n>=need?'，套装效果生效':''}`); });
  const schemes=schemesOf(op); const curScheme=m.buildSource==='custom'?'custom':String(m.buildScheme||0);
  const schemeBlock=block('配装方案',select([...schemes.map((s,k)=>[k,s.name]),['custom','自定义']],curScheme,v=>{ if(v==='custom') return; update(s=>{ applyDefaultBuild(s.team[i],Number(v)); }); }),
    h('div',{class:'muted small'},m.buildSource==='custom'?'选一个方案会覆盖当前的武器和装备':[schemes[m.buildScheme||0]?.why||'',schemes[m.buildScheme||0]?.weaponAlt?.length?`备选武器：${schemes[m.buildScheme||0].weaponAlt.join('、')}`:''].filter(Boolean).join('。')));
  const gearBlock=block('装备',...gearRows,h('div',{class:'set-status'},setLines.length?setLines:h('span',{class:'muted'},'未装备套装')));
  const chips=m.consumables.map(id=>{ const c=consumables.find(x=>x.id===id); return h('span',{class:'chip'},h('img',{class:'chip-thumb',src:c?.icon,alt:''}),c?.name||id,h('button',{type:'button',class:'chip-x',onclick:()=>edit(x=>{x.consumables=x.consumables.filter(y=>y!==id);})},'×')); });
  const foodBlock=block('食物与药剂',h('div',{class:'chips'},chips.length?chips:h('span',{class:'muted'},'未使用')),picker({options:consumables.filter(c=>!m.consumables.includes(c.id)).map(c=>({id:c.id,name:c.name,icon:c.icon,sub:c.effectText})),value:null,placeholder:'添加食药',empty:false,onChange:id=>edit(x=>{x.consumables.push(id);})}),
    state.team.filter(Boolean).length>1?h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{ for(const o of s.team) if(o) o.consumables=[...s.team[i].consumables]; })},'全队同样'):'');
  const readout=h('div',{class:'panel-readout'},stat('面板攻击',fmt(st.atk.panel)),stat(`${ABIL_CN[op.mainAttr]} / ${ABIL_CN[op.subAttr]}`,`${st.main} / ${st.sub}`),stat('暴击率 / 暴击伤害',`${pct(st.critRate)} / +${pct(st.critDmg)}`),stat('充能效率',`+${pct(st.chargeEff)}`));
  const actions=h('div',{class:'editor-actions'},
    i!==state.mainControl?h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.mainControl=i;})},'设为主控'):'',
    i>0?h('button',{type:'button',class:'mini-btn',onclick:()=>swapSlots(update,i,i-1)},'左移'):'',
    i<3?h('button',{type:'button',class:'mini-btn',onclick:()=>swapSlots(update,i,i+1)},'右移'):'',
    h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{ s.team[i]=null; s.ui.editSlot=null; if(!s.team[s.mainControl]) s.mainControl=Math.max(0,s.team.findIndex(Boolean)); if(!s.team[s.active]) s.active=Math.max(0,s.team.findIndex(Boolean)); })},'移出编队'),
    h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.ui.editSlot=null;})},'收起'));
  return h('section',{class:'squad-editor',style:`--notch:${i}`},
    h('div',{class:'editor-head'},h('img',{class:'op-thumb',src:op.icon,alt:''}),h('div',{},h('strong',{},op.name),h('small',{class:'muted'},`${pad(i)} 号位 · ${PROF_CN[op.profession]} · ${ELEMENT_CN[op.element]} · ${WT_CN[op.weaponType]}`)),actions),
    h('div',{class:'editor-grid'},h('div',{},level,weaponBlock,foodBlock),h('div',{},schemeBlock,gearBlock)),readout);
}
const block=(title,...children)=>h('div',{class:'editor-block'},h('h3',{},title),...children);
const stat=(label,value)=>h('div',{class:'readout'},h('span',{},label),h('strong',{},value));
// 换号位：两个槽位互换，主控、伤害页选中的人、展开的编辑区跟着走
function swapSlots(update,a,b){ update(s=>{ [s.team[a],s.team[b]]=[s.team[b],s.team[a]]; const mv=x=>x===a?b:x===b?a:x; s.mainControl=mv(s.mainControl); s.active=mv(s.active); s.ui.editSlot=b; }); }

// ---------- 目标 ----------
function targetPanel(state,update,rot){
  const scenario=scenarios.find(x=>x.id===rot.scenario)||scenarios[0]; const enemy=rot.enemy;
  const scTabs=scenarios.map(x=>h('button',{type:'button',class:'preset-tab'+(x.id===scenario.id?' active':''),onclick:()=>update(s=>{s.rot.scenario=x.id;})},x.name));
  const resRows=h('div',{class:'resistance-list'},...Object.entries(ELEMENT_CN).map(([k,l])=>{ const g=enemy.resistances[k]; const v=g==='custom'?(enemy.custom[k]??0):(GRADE[g]??0);
    return h('div',{class:'resistance-row'},h('span',{style:`color:${colorOf(k)}`},l),select([['D','D 级 0%'],['C','C 级 20%'],['B','B 级 50%'],['custom','自定义']],g,val=>update(s=>{s.rot.enemy.resistances[k]=val;})),h('output',{},pct(v)),g==='custom'?h('input',{class:'custom-res',type:'number',min:-100,max:100,step:1,value:v,onchange:ev=>update(s=>{s.rot.enemy.custom[k]=Number(ev.target.value);})}):''); }));
  return h('section',{class:'panel'},h('div',{class:'panel-heading'},h('span',{class:'index'},'02'),h('h2',{},'目标')),
    h('div',{class:'preset-tabs'},...scTabs),h('ul',{class:'facts'},...scenario.facts.map(t=>h('li',{},t))),
    h('div',{class:'three-col'},
      field('排多少秒',scenario.timeLimit?h('output',{class:'fixed-value'},`限时 ${scenario.timeLimit} 秒`):h('input',{type:'number',min:20,max:180,step:5,value:rot.auto.horizon,onchange:ev=>update(s=>{s.rot.auto.horizon=Number(ev.target.value);})})),
      field('敌人防御力',h('input',{type:'number',min:0,max:99999,value:enemy.defence,onchange:ev=>update(s=>{s.rot.enemy.defence=Number(ev.target.value);})})),
      field('敌人每隔几秒打一次主控',h('input',{type:'number',min:0,max:60,step:1,value:enemy.attackInterval??ENEMY_DEFAULT.attackInterval,onchange:ev=>update(s=>{s.rot.enemy.attackInterval=Number(ev.target.value);})}),'0 = 不攻击')),
    h('div',{class:'subheading'},'敌人抗性'),resRows,h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.rot.enemy=clone(ENEMY_DEFAULT);})},'抗性和防御恢复默认'));
}

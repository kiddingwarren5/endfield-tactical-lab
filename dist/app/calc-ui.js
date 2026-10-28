// Damage calculator workspace (批次 1–4). Reads state, calls engine, renders DOM. All numbers come from engine results.
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import sets from '../data/sets.js'; import consumables from '../data/consumables.js'; import effects from '../data/effects.js'; import meta from '../data/meta.js';
import {getStats} from '../engine/stats.js'; import {ENGINE_VERSION,GRADE_RESISTANCE,calcSegment} from '../engine/damage.js'; import {skillSegments,effectiveMode,mechSegments} from '../engine/skills.js'; import {candidateEffects,appliedFor,resolveValue,segmentStatus,splitApplied} from '../engine/resolve.js'; import {effectApplies} from '../engine/damage.js';
import {h,$,fmt,pct,pct2,ELEMENT_CN,KIND_CN,PROF_CN,WT_CN,ABIL_CN,colorOf,select,picker,panel,field,download} from './ui.js';
import {newMember,clone,weaponPotentialToRank,rankToWeaponPotential} from './state.js';

const data={operators,weapons,gear,sets,consumables,effects};
const ZONE_CN={bonus:'增伤',amp:'增幅',fragile:'脆弱',vulnerable:'易伤',ratioMul:'倍率倍增',ratioAdd:'倍率加成',other:'其他/特殊'};
const DAMAGE_ZONES=['bonus','amp','fragile','vulnerable','ratioMul','ratioAdd','other'];
let calcCounter=0;

// ---------- compute ----------
export function compute(state){
  const member=state.team[state.active]; if(!member) return null;
  const op=operators.find(o=>o.id===member.operatorId); const stats=getStats(member,data,{consumables:member.consumables,foodFlatMode:state.options.foodFlatMode});
  const sel=state.selection; let segments=[]; let title='';
  if(sel.kind==='mech'){ const m=mechSegments(state.vars.mechElement).find(s=>s.id===sel.segmentId)||mechSegments(state.vars.mechElement)[0]; const ab=Math.max(1,Math.min(4,state.vars.abnormal||1)); segments=[{...m,element:m.id==='artsBurst'?state.vars.mechElement:m.element,ratio:[m.base*(m.scale?1+ab:1)],skillKey:'mech'}]; title=m.label; }
  else { const segs=skillSegments(op,sel.skillKey,effectiveMode(op,member,stats)); if(sel.kind==='total'){ segments=segs; title=`${op.skills[sel.skillKey]?.name||''} · 总伤`; } else { const s=segs.find(x=>x.id===sel.segmentId)||segs[0]; segments=s?[s]:[]; title=s?.label||''; } }
  const candidates=candidateEffects({team:state.team,bIdx:state.active,data,consumablesOf:i=>state.team[i]?.consumables||[],mainControlIdx:state.mainControl});
  const rank=sel.kind==='mech'?12:(member.skillRanks[sel.skillKey]??12);
  const allSegs=sel.kind==='mech'?[]:skillSegments(op,sel.skillKey,effectiveMode(op,member,stats)); const results=segments.map(seg=>{ const settings=state.buffs.perSegment[seg.id]||state.buffs.unified; const segIndex=allSegs.findIndex(x=>x.id===seg.id); const applied=appliedFor({candidates,seg,segIndex:segIndex<0?null:segIndex,bIdx:state.active,toggles:settings.toggles,data,overrides:settings.overrides,stacks:settings.stacks,vars:state.vars}); const {stat:extraStats,dmg:dmgApplied}=splitApplied(applied.map(a=>({...a,beneficiaryIdx:state.active}))); const selfAuto=new Set(stats.trace.map(t=>t.why)); const extras=extraStats.filter(x=>!selfAuto.has(x.why)); const segStats=extras.length?getStats(member,data,{consumables:member.consumables,foodFlatMode:state.options.foodFlatMode,extraStats:extras}):stats; const r=calcSegment({stats:segStats,seg,rank,enemy:state.enemy,critMode:state.critMode,applied:dmgApplied,vars:state.vars,options:state.options}); return {...r,applied,segIndex,extraStats:extras,panelAtk:segStats.atk.panel,inherited:!state.buffs.perSegment[seg.id]}; });
  const total=results.reduce((a,r)=>a+r.damage,0);
  const trace={calcId:`calc-${Date.now()}-${++calcCounter}`,dataVersion:meta.dataVersion,engineVersion:ENGINE_VERSION,createdAt:new Date().toISOString(),inputs:{team:clone(state.team),active:state.active,mainControl:state.mainControl,enemy:clone(state.enemy),critMode:state.critMode,options:clone(state.options),selection:clone(sel),vars:clone(state.vars),buffs:clone(state.buffs)},stats:{abilities:stats.abilities,main:stats.main,sub:stats.sub,atk:stats.atk,critRate:stats.critRate,critDmg:stats.critDmg,chargeEff:stats.chargeEff,artsStrength:stats.artsStrength,bonuses:stats.bonuses,sets:stats.sets,trace:stats.trace},segments:results.map(r=>({id:r.segmentId,label:r.label,element:r.element,kind:r.kind,rank:r.rank,inherited:r.inherited,applied:r.applied.map(a=>({id:a.effect.id,name:a.label,zone:a.effect.zone,value:a.value,owner:a.ownerIdx,mode:a.mode,dependency:a.dependency})),ratioTrace:r.ratioTrace,factors:r.factors,buckets:r.buckets,damage:r.damage,rounding:r.rounding})),total,title};
  return {member,op,stats,segments,results,total,title,candidates,trace,element:results[0]?.element||op.element};
}

// ---------- render ----------
export function renderCalc(root,state,update){
  const res=compute(state); const member=state.team[state.active];
  root.innerHTML='';
  root.append(teamTabs(state,update));
  const left=h('div',{class:'left-column'}), center=h('div',{class:'center-column'}), right=h('div',{class:'right-column'});
  if(!member){ left.append(h('section',{class:'panel'},h('p',{},'请选择干员。'))); root.append(h('div',{class:'workspace'},left,center,right)); return; }
  const fold=(id,c)=>{ state.ui.folds[id]=c; };
  left.append(operatorPanel(state,update,member,res,fold), gearPanel(state,update,member,res,fold), consumablePanel(state,update,member,fold));
  center.append(hitPanel(state,update,member,res,fold), buffPanel(state,update,member,res,fold), enemyPanel(state,update,fold));
  right.append(resultPanel(state,update,res), breakdownPanel(state,res,fold));
  root.append(h('div',{class:'workspace'},left,center,right), h('div',{class:'workspace single bottom'},snapshotBox(state,update,res,fold), importEntry()));
}

function teamTabs(state,update){
  const tabs=h('div',{class:'team-tabs'});
  state.team.forEach((m,i)=>{ if(!m) return; const op=operators.find(o=>o.id===m.operatorId); tabs.append(h('button',{type:'button',class:'team-tab'+(i===state.active?' active':''),onclick:()=>update(s=>{s.active=i;})},h('img',{class:'tab-thumb',src:op.icon,alt:''}),h('span',{},op.name),state.mainControl===i?h('small',{class:'mc-tag'},'主控'):'',state.team.filter(Boolean).length>1?h('span',{class:'tab-x',title:'移出编队',onclick:e=>{e.stopPropagation();update(s=>{s.team[i]=null;const idx=s.team.findIndex(Boolean);s.active=idx<0?0:idx;if(s.mainControl===i)s.mainControl=s.active;});}},'×'):'')); });
  const count=state.team.filter(Boolean).length; if(count<4){ const taken=new Set(state.team.filter(Boolean).map(m=>m.operatorId)); const opts=operators.filter(o=>!taken.has(o.id)).map(o=>({id:o.id,name:o.name,icon:o.icon,disabled:Boolean(o.preview),sub:`${PROF_CN[o.profession]} · ${ELEMENT_CN[o.element]} · ${WT_CN[o.weaponType]}${o.preview?' · 官方数据未公开，暂不可选':''}`})); tabs.append(h('div',{class:'team-add'},picker({options:opts,value:null,placeholder:`+ 添加干员（${count}/4）`,empty:false,onChange:id=>update(s=>{const slot=s.team.findIndex(x=>!x);s.team[slot]=newMember(id);s.active=slot;})}))); }
  const done=state.ui.teamDone;
  if(done){ // 紧凑模式：只留头像、主控与“编辑编队”，伤害结果一直可见
    tabs.innerHTML=''; tabs.classList.add('compact');
    state.team.forEach((m,i)=>{ if(!m) return; const op=operators.find(o=>o.id===m.operatorId); tabs.append(h('button',{type:'button',class:'team-tab mini'+(i===state.active?' active':''),title:op.name,onclick:()=>update(s=>{s.active=i;})},h('img',{class:'tab-thumb',src:op.icon,alt:op.name}),state.mainControl===i?h('small',{class:'mc-tag'},'主控'):'')); });
    tabs.append(h('div',{class:'bar-right'},h('label',{class:'mc-select'},'主控 ',select(state.team.map((m,i)=>m?[i,operators.find(o=>o.id===m.operatorId).name]:null).filter(Boolean),state.mainControl,v=>update(s=>{s.mainControl=Number(v);}))),h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.ui.teamDone=false;})},'编辑编队'),h('a',{href:'#rotation',class:'mini-btn'},'去排轴 →')));
    return tabs; }
  tabs.append(h('div',{class:'bar-right'},h('label',{class:'mc-select'},'主控 ',select(state.team.map((m,i)=>m?[i,operators.find(o=>o.id===m.operatorId).name]:null).filter(Boolean),state.mainControl,v=>update(s=>{s.mainControl=Number(v);}))),h('button',{type:'button',class:'done-btn',title:'确认编队，留在伤害计算页；要排轴请点顶部“排轴”',onclick:()=>update(s=>{s.ui.teamDone=true;})},'完成')));
  return tabs;
}

function operatorPanel(state,update,member,res,fold){
  const op=res.op; const taken=new Set(state.team.filter(Boolean).map(m=>m.operatorId));
  const opOpts=operators.map(o=>({id:o.id,name:o.name,icon:o.icon,sub:`${PROF_CN[o.profession]} · ${ELEMENT_CN[o.element]} · ${WT_CN[o.weaponType]}${o.preview?' · 官方数据未公开，暂不可选':''}`,disabled:(taken.has(o.id)&&o.id!==op.id)||Boolean(o.preview)}));
  const wOpts=weapons.filter(w=>w.type===op.weaponType).sort((a,b)=>b.rarity-a.rarity).map(w=>({id:w.id,name:w.name,icon:w.icon,sub:`${w.rarity}★ · ${WT_CN[w.type]} · 基础攻击 ${w.baseAtk90}`}));
  const weapon=res.stats.weapon; const ranks=member.weapon.ranks;
  const rankLabel=n=>n<=9?`Rank ${n}`:`专精 ${n-9}`;
  const body=[h('div',{class:'operator-card',style:`border-left-color:${colorOf(op.element)}`},h('img',{class:'op-thumb',src:op.icon,alt:''}),h('div',{},h('span',{class:'eyebrow'},`${PROF_CN[op.profession]} · ${ELEMENT_CN[op.element]} · ${WT_CN[op.weaponType]}`),h('strong',{},op.name),h('small',{},`主能力 ${ABIL_CN[op.mainAttr]} / 副能力 ${ABIL_CN[op.subAttr]} · ${op.rarity}★`)),h('div',{class:'active-tag'},res.stats.weapon?'':'未装备武器')),
    field('更换干员',picker({options:opOpts,value:op.id,empty:false,onChange:id=>update(s=>{const m=newMember(id);s.team[s.active]=m;s.selection={kind:'segment',skillKey:'combo',segmentId:'combo1'};s.buffs.perSegment={};})})),
    h('div',{class:'two-col'},field('干员等级',select([[90,'90 级']],90,()=>{},{disabled:true}),'暂锁定'),field('干员潜能',select([0,1,2,3,4,5].map(i=>[i,`${i} 潜`]),member.potential,v=>update(s=>{s.team[s.active].potential=Number(v);})))),
    op.skills.skill?.modeVariants?field('技能形态',select([['auto',`自动：按面板判定（当前 ${effectiveMode(op,member,res.stats)===0?'阵诀·智':'阵诀·意'}）`],...op.skills.skill.modeVariants.map((v,i)=>[i,v.description.split('\n')[0].slice(0,24)])],typeof member.mode==='number'?member.mode:'auto',v=>update(s=>{s.team[s.active].mode=v==='auto'?'auto':Number(v);}))):'',
    h('div',{class:'subheading'},'技能等级'),
    h('div',{class:'two-col'},...['normal','skill','combo','ultimate'].map(k=>field(KIND_CN[k],select(Array.from({length:12},(_,i)=>[i+1,rankLabel(i+1)]),member.skillRanks[k],v=>update(s=>{s.team[s.active].skillRanks[k]=Number(v);}))))),
    h('div',{class:'locked-note'},'天赋树：已点满（能力值天赋已计入面板）'),
    h('div',{class:'subheading'},'武器'),
    picker({options:wOpts,value:member.weapon.id,placeholder:'选择武器',emptyLabel:'不装备武器',onChange:id=>update(s=>{s.team[s.active].weapon={id,potential:0,substrate:[6,6,3],ranks:[9,9,4]};})}),
    weapon?[h('div',{class:'two-col'},field('武器等级',select([[90,'90 级']],90,()=>{},{disabled:true}),'暂锁定'),field('武器潜能',select([0,1,2,3,4,5].map(i=>[i,`${i} 潜`]),member.weapon.potential,v=>update(s=>{const w=s.team[s.active].weapon;w.potential=Number(v);w.ranks[2]=Math.min(9,1+Number(v)+(w.substrate?.[2]??3));})))),
      h('div',{class:'subheading'},'武器技能等级 ',h('small',{class:'muted'},'前两条：培养3 + 基质加级；第三条：1 + 潜能 + 匹配基质加级（规则 D22）')),
      h('div',{class:'three-col'},...weapon.skills.map((sk,i)=>field(sk.name,select((i===2?[4,5,6,7,8,9]:[1,2,3,4,5,6,7,8,9]).map(n=>[n,`Rank ${n}`]),ranks[i],v=>update(s=>{const w=s.team[s.active].weapon;w.ranks[i]=Number(v);if(i===2){w.potential=rankToWeaponPotential(v);w.substrate[2]=3;} else w.substrate[i]=Math.max(0,Number(v)-3);})))) ),
      h('div',{class:'three-col'},field('基质加级 · 词条一',select([0,1,2,3,4,5,6].map(n=>[n,`+${n}`]),member.weapon.substrate?.[0]??6,v=>update(s=>{const w=s.team[s.active].weapon;w.substrate[0]=Number(v);w.ranks[0]=Math.min(9,3+Number(v));}))),field('基质加级 · 词条二',select([0,1,2,3,4,5,6].map(n=>[n,`+${n}`]),member.weapon.substrate?.[1]??6,v=>update(s=>{const w=s.team[s.active].weapon;w.substrate[1]=Number(v);w.ranks[1]=Math.min(9,3+Number(v));}))),field('基质加级 · 词条三',select([0,1,2,3].map(n=>[n,`+${n}`]),member.weapon.substrate?.[2]??3,v=>update(s=>{const w=s.team[s.active].weapon;w.substrate[2]=Number(v);w.ranks[2]=Math.min(9,1+w.potential+Number(v));})))),
      h('div',{class:'weapon-passive'},h('b',{},weapon.skills[2]?.name||''),h('span',{},(weapon.skills[2]?.rankTexts?.[ranks[2]-1]||'').replace(/\n/g,' ')))]:''];
  return panel({id:'op',index:'01',title:'干员与练度',folds:state.ui.folds,onFold:fold},...body);
}

function gearPanel(state,update,member,res,fold){
  const slots=[['armor','护甲','armor'],['gloves','护手','gloves'],['kit1','配件 · 1','kit'],['kit2','配件 · 2','kit']];
  const rows=slots.map(([slot,label,type])=>{ const conf=member.gear[slot]; const item=conf.id?gear.find(g=>g.id===conf.id):null; const otherKit=slot==='kit1'?member.gear.kit2.id:slot==='kit2'?member.gear.kit1.id:null;
    const opts=gear.filter(g=>g.slot===type).sort((a,b)=>(a.setName||'').localeCompare(b.setName||'')).map(g=>({id:g.id,name:g.name,icon:g.icon,sub:`${g.setName||''} · ${g.quality==='gold'?'金':'紫'} · ${g.attrs.map(a=>a.name).join(' / ')}`,disabled:g.id===otherKit}));
    return h('div',{class:'gear-row'},h('div',{class:'gear-head'},h('span',{class:'gear-slot-label'},label),picker({options:opts,value:conf.id,placeholder:'未装备',onChange:id=>update(s=>{s.team[s.active].gear[slot]={id,refine:[3,3,3]};})})),
      item?h('div',{class:'refine-grid'},...item.attrs.map((a,i)=>{ const r=conf.refine[i]??3; return h('label',{class:'refine-field'},h('span',{},a.name,' ',h('b',{},a.pct?pct2(a.values[r]):fmt(a.values[r])),a.pct&&Math.abs(a.values[r]-a.display[r])>1e-6?h('small',{class:'muted',title:'官方显示值（四舍五入）'},` 显示 ${pct(a.display[r])}`):''),select([0,1,2,3].map(n=>[n,`精锻 +${n}`]),r,v=>update(s=>{s.team[s.active].gear[slot].refine[i]=Number(v);}))); })):'' ); });
  const setLines=Object.entries(res.stats.sets).map(([id,n])=>{ const st=sets.find(s=>s.id===id); return h('div',{},`${st?.name||id} ${n} / ${st?.pieces||3} 件 ${n>=(st?.pieces||3)?'· 套装效果已生效':'· 未生效'}`); });
  return panel({id:'gear',index:'02',title:'装备与精锻',folds:state.ui.folds,onFold:fold},...rows,h('div',{class:'set-status'},setLines.length?setLines:'未装备套装'),h('div',{class:'muted small'},'数值为游戏内部精确值（解包），官方显示为四舍五入；见 docs/data-sources.md'));
}

function consumablePanel(state,update,member,fold){
  const chips=member.consumables.map(id=>{ const c=consumables.find(x=>x.id===id); return h('span',{class:'chip'},h('img',{class:'chip-thumb',src:c?.icon,alt:''}),c?.name||id,h('button',{type:'button',class:'chip-x',onclick:()=>update(s=>{const m=s.team[s.active];m.consumables=m.consumables.filter(x=>x!==id);})},'×')); });
  const opts=consumables.filter(c=>!member.consumables.includes(c.id)).map(c=>({id:c.id,name:c.name,icon:c.icon,sub:c.effectText}));
  return panel({id:'food',index:'02b',title:'食物与药剂',folds:state.ui.folds,onFold:fold},h('div',{class:'chips'},chips.length?chips:h('span',{class:'muted'},'未使用')),picker({options:opts,value:null,placeholder:'+ 添加食药',empty:false,onChange:id=>update(s=>{s.team[s.active].consumables.push(id);})}),h('div',{class:'muted small'},'持续 300 秒；固定攻击力在主副能力乘算后相加（用户实测）。同类叠加规则待确认，当前按勾选全部计入。'),state.team.filter(Boolean).length>1?h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{for(const m of s.team) if(m) m.consumables=[...s.team[s.active].consumables];})},'应用到全队'):'');
}

function hitPanel(state,update,member,res,fold){
  const op=res.op; const sel=state.selection; const groups=[];
  for(const k of ['normal','skill','combo','ultimate']){ const sk=op.skills[k]; if(!sk) continue; const segs=skillSegments(op,k,member.mode); const items=segs.map(s=>[`segment:${k}:${s.id}`,`${s.label}${s.per?'（按层）':''}`]); if(k!=='normal'&&segs.length>1) items.push([`total:${k}:`,`${sk.name} · 总伤`]); groups.push([`${KIND_CN[k]} · ${sk.name}`,items]); }
  groups.push(['机制伤害',mechSegments(state.vars.mechElement).map(m=>[`mech:mech:${m.id}`,m.label])]);
  const value=`${sel.kind}:${sel.kind==='mech'?'mech':sel.skillKey}:${sel.kind==='total'?'':sel.segmentId}`;
  const s=h('select',{onchange:e=>{const [kind,skillKey,segId]=e.target.value.split(':');update(st=>{st.selection={kind,skillKey:kind==='mech'?'mech':skillKey,segmentId:segId||null};});}});
  for(const [g,items] of groups){ const og=h('optgroup',{label:g}); for(const [v,l] of items) og.append(h('option',{value:v},l)); s.append(og); } s.value=value;
  const segs=res.segments; const hasPer=sel.kind!=='mech'&&skillSegments(op,sel.skillKey,effectiveMode(op,member,res.stats)).some(x=>x.per==='unit'); const isMech=sel.kind==='mech';
  const controls=[hasPer?field('消耗层数',select([0,1,2,3,4].map(n=>[n,`${n} 层`]),state.vars.layers,v=>update(st=>{st.vars.layers=Number(v);}))):'',isMech?field('异常等级 / 层数',select([1,2,3,4].map(n=>[n,`${n}`]),state.vars.abnormal,v=>update(st=>{st.vars.abnormal=Number(v);}))):'',isMech&&sel.segmentId==='artsBurst'?field('触发属性',select(['cold','heat','electric','nature'].map(e=>[e,ELEMENT_CN[e]]),state.vars.mechElement,v=>update(st=>{st.vars.mechElement=v;}))):''];
  const readout=h('div',{class:'event-readout',style:`border-left-color:${colorOf(res.element)}`},h('span',{},sel.kind==='total'?'各段倍率':'当前倍率'),h('strong',{style:`color:${colorOf(res.element)}`},sel.kind==='total'?res.results.map(r=>pct(r.factors.ratio*100)).join(' + '):pct((res.results[0]?.factors.ratio||0)*100)));
  const desc=sel.kind!=='mech'?h('p',{class:'skill-desc'},(op.skills[sel.skillKey]?.modeVariants?op.skills[sel.skillKey].modeVariants[member.mode]:op.skills[sel.skillKey])?.description||''):h('p',{class:'skill-desc muted'},'机制伤害倍率沿用交接 Demo，规则校正中（docs/rules.md A5）。');
  return panel({id:'hit',index:'03',title:'选择一段伤害',folds:state.ui.folds,onFold:fold},field('伤害段 / 技能总伤 / 机制伤害',s),h('div',{class:'event-controls'},...controls),readout,desc);
}

function buffPanel(state,update,member,res,fold){
  const sel=state.selection; const segs=res.segments; const tabs=[['unified','统一设置'],...(segs.length>1?segs.map(s=>[s.id,s.label]):[])];
  if(!tabs.some(t=>t[0]===state.buffTab)) state.buffTab='unified';
  const tabBar=h('div',{class:'sub-tabs'},...tabs.map(([id,l])=>h('button',{type:'button',class:'sub-tab'+(state.buffTab===id?' active':'')+(id!=='unified'&&state.buffs.perSegment[id]?' overridden':''),onclick:()=>update(s=>{s.buffTab=id;})},l,id!=='unified'&&state.buffs.perSegment[id]?' ·单独':'')));
  const segForTab=state.buffTab==='unified'?null:segs.find(s=>s.id===state.buffTab);
  const inheriting=segForTab&&!state.buffs.perSegment[segForTab.id];
  const settings=segForTab&&!inheriting?state.buffs.perSegment[segForTab.id]:state.buffs.unified;
  const members=state.team.map((m,i)=>m?[i,operators.find(o=>o.id===m.operatorId).name]:null).filter(Boolean);
  const applicable=res.candidates.filter(c=>segForTab?effectApplies(c.effect,segForTab):segs.some(sg=>effectApplies(c.effect,sg))).filter(c=>DAMAGE_ZONES.includes(c.effect.zone)||['atkPct','atkFlat','ability','critRate','critDmg','chargeEff','artsStrength'].includes(c.effect.zone)&&c.effect.condition?.mode!=='auto');
  const filtered=state.buffFilter===''?applicable:applicable.filter(c=>String(c.ownerIdx)===state.buffFilter);
  const toolbar=h('div',{class:'buff-toolbar'},h('label',{},'施加者 ',select([['','全部'],...members],state.buffFilter,v=>update(s=>{s.buffFilter=v;}))),
    h('button',{type:'button',class:'mini-btn',disabled:inheriting,onclick:()=>update(s=>{const st=segForTab&&!inheriting?s.buffs.perSegment[segForTab.id]:s.buffs.unified;for(const c of filtered) if(c.effect.condition?.mode!=='auto') st.toggles[c.effect.id]=true;})},state.buffFilter===''?'全选':'全选该干员'),
    h('button',{type:'button',class:'mini-btn',disabled:inheriting,onclick:()=>update(s=>{const st=segForTab&&!inheriting?s.buffs.perSegment[segForTab.id]:s.buffs.unified;for(const c of filtered) st.toggles[c.effect.id]=false;})},'取消全选'),
    segForTab?(inheriting?h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.buffs.perSegment[segForTab.id]=clone(s.buffs.unified);})},'单独设置此段'):h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{delete s.buffs.perSegment[segForTab.id];})},'恢复继承统一设置')):'');
  const note=segForTab?h('div',{class:'muted small'},inheriting?'此段继承统一设置（修改统一设置会同步影响）。':'此段已单独设置，不再跟随统一设置。'):h('div',{class:'muted small'},'统一设置作用于所有继承的伤害段。自动生效的效果以“自动”标记，无需勾选。');
  const groups=[...DAMAGE_ZONES,'stat'].map(z=>{ const list=filtered.filter(c=>z==='stat'?!DAMAGE_ZONES.includes(c.effect.zone):c.effect.zone===z); if(!list.length) return ''; return h('div',{class:'buff-group'},h('div',{class:'buff-group-title'},h('span',{},z==='stat'?'属性类（条件触发）':ZONE_CN[z]+'乘区'),h('span',{},z==='stat'?'进面板':'同区相加')),...list.map(c=>buffCard(c,settings,inheriting,segForTab,update,state,segForTab?res.results.find(r=>r.segmentId===segForTab.id)?.segIndex:null))); });
  return panel({id:'buff',index:'04',title:'增益与减益',folds:state.ui.folds,onFold:fold},tabBar,note,toolbar,...groups,filtered.length?'':h('div',{class:'muted'},'当前伤害段没有可用效果。'));
}
function buffCard(c,settings,inheriting,seg,update,state,segIndex){
  const e=c.effect; const segSt=seg?segmentStatus(c,seg,segIndex,state.active):'user'; const auto=(e.condition?.mode||'auto')==='auto'||segSt==='auto'; const disabled=segSt==='disabled'; const on=!disabled&&(auto||Boolean(settings.toggles[e.id]));
  const {value,dependency}=resolveValue(c,{data,overrides:settings.overrides,stacks:settings.stacks,vars:state.vars});
  const owner=operators.find(o=>o.id===c.ownerMember.operatorId)?.name||'';
  const setSetting=(fn)=>update(s=>{ const st=seg&&!inheriting?s.buffs.perSegment[seg.id]:s.buffs.unified; fn(st); });
  const cb=disabled?h('span',{class:'auto-badge off',title:'此段为该技能首段，触发条件在本段之后才满足'},'不可'):auto?h('span',{class:'auto-badge',title:segSt==='auto'?'按段必然触发':'配装即生效'},segSt==='auto'?'必触':'自动'):h('input',{type:'checkbox',checked:on,disabled:inheriting,onchange:ev=>setSetting(st=>{ st.toggles[e.id]=ev.target.checked; if(ev.target.checked&&e.exclusiveGroup){ for(const other of data.effects) if(other.id!==e.id&&other.exclusiveGroup===e.exclusiveGroup) st.toggles[other.id]=false; } })});
  const extras=[];
  if(e.value?.perStack!=null) extras.push(h('label',{class:'inline-field'},'层数 ',select(Array.from({length:(e.value.maxStacks||1)+1},(_,i)=>[i,String(i)]),settings.stacks[e.id]??e.value.maxStacks??1,v=>setSetting(st=>{st.stacks[e.id]=Number(v);}),{disabled:inheriting})));
  if(e.value?.formula&&e.value.vars?.includes('layers')) extras.push(h('span',{class:'muted small'},`按消耗层数 ${state.vars.layers} 计算`));
  if(dependency){ const ov=settings.overrides[e.id]; extras.push(h('div',{class:'dep-row'},h('span',{},`${ABIL_CN[dependency.attr]||dependency.attr}（${owner}）自动值 ${fmt(dependency.auto)} · 采用 ${fmt(dependency.used)} ${dependency.origin==='manual'?'· 手工覆盖':'· 自动'}`),h('input',{type:'number',placeholder:'手工输入',value:ov??'',disabled:inheriting,oninput:ev=>setSetting(st=>{st.overrides[e.id]=ev.target.value;})}),ov!=null&&ov!==''?h('button',{type:'button',class:'mini-btn',onclick:()=>setSetting(st=>{delete st.overrides[e.id];})},'恢复自动'):'')); }
  const badges=[c.teamUniqueCollapsed||e.teamUnique?h('i',{class:'badge'},'全队不叠加'):'',e.condition?.mode==='segment'?h('i',{class:'badge'},segSt==='auto'?'按段触发 · 本段必然生效':segSt==='disabled'?'按段触发 · 本段不可':'按段触发（单段计算需勾选）'):'',e.exclusiveGroup?h('i',{class:'badge'},'互斥'):'',e.uncertain?h('i',{class:'badge warn',title:e.notes||''},'待确认'):''];
  return h('div',{class:'buff-card'+(on?'':' off')+(disabled?' disabled':'')},cb,h('div',{class:'buff-main'},h('strong',{},e.name),h('small',{},`${owner} · ${e.condition?.text||''}${e.duration?' · '+e.duration+'秒':''}${e.stacking&&e.stacking!=='none'?' · '+e.stacking:''}`),h('div',{class:'badges'},...badges),...extras),h('span',{class:'buff-value'},e.zone==='ratioMul'?`×${value}`:`${value>=0?'+':''}${e.unit==='flat'?fmt(value):pct2(value)}`));
}

function enemyPanel(state,update,fold){
  const res=h('div',{class:'resistance-list'},...Object.entries(ELEMENT_CN).map(([k,l])=>{ const g=state.enemy.resistances[k]; const v=g==='custom'?(state.enemy.custom[k]??0):(GRADE_RESISTANCE[g]??0); return h('div',{class:'resistance-row'},h('span',{style:`color:${colorOf(k)}`},l),select([['D','D 级'],['C','C 级'],['B','B 级'],['custom','自定义']],g,val=>update(s=>{s.enemy.resistances[k]=val;})),h('output',{},pct(v)),g==='custom'?h('input',{class:'custom-res',type:'number',min:-100,max:100,step:1,value:v,oninput:ev=>update(s=>{s.enemy.custom[k]=Number(ev.target.value);},{silent:true})}):''); }));
  const num=(label,key,attrs={})=>field(label,h('div',{class:'unit-input'},h('input',{type:'number',step:'0.1',value:state.options[key],oninput:ev=>update(s=>{s.options[key]=Number(ev.target.value)||0;},{silent:true}),...attrs}),h('b',{},'%')));
  return panel({id:'enemy',index:'05',title:'敌人状态',folds:state.ui.folds,onFold:fold},h('div',{class:'two-col'},field('防御力',h('input',{type:'number',min:0,max:99999,value:state.enemy.defence,oninput:ev=>update(s=>{s.enemy.defence=Number(ev.target.value)||0;},{silent:true})})),field('暴击口径',select([['never','不暴击'],['always','必暴击'],['expected','暴击期望']],state.critMode,v=>update(s=>{s.critMode=v;})))),h('div',{class:'subheading'},'属性抗性 ',h('small',{class:'muted'},'评级 → 数值（映射待核，docs/rules.md A3）')),res,h('div',{class:'subheading'},'其它参数'),h('div',{class:'two-col advanced-grid'},num('源石技艺强度（额外）','artsStrength'),num('连击增伤','combo'),num('失衡承伤（失衡时常用 30）','stagger'),num('额外伤害减免','reduction',{max:100}),
      field('连击预设',select([['','手动'],['s1','战技 1层 30%'],['s2','战技 2层 45%'],['s3','战技 3层 60%'],['s4','战技 4层 75%'],['u1','终结技 1层 20%'],['u2','终结技 2层 30%'],['u3','终结技 3层 40%'],['u4','终结技 4层 50%']],'',v=>{ const map={s1:30,s2:45,s3:60,s4:75,u1:20,u2:30,u3:40,u4:50}; if(map[v]!=null) update(s=>{s.options.combo=map[v];}); }),'研究值'),
      field('食药固定攻击位置',select([['after','主副能力乘算后相加（用户实测）'],['inside','括号内，吃能力加成（研究）']],state.options.foodFlatMode||'after',v=>update(s=>{s.options.foodFlatMode=v;})))));
}

function resultPanel(state,update,res){
  const el=res.element; const stats=res.stats;
  const segRows=res.results.length>1?h('table',{class:'seg-table'},h('thead',{},h('tr',{},h('th',{},'伤害段'),h('th',{},'倍率'),h('th',{},'伤害'),h('th',{},'增益'))),h('tbody',{},...res.results.map(r=>h('tr',{},h('td',{},r.label),h('td',{},pct(r.factors.ratio*100)),h('td',{style:`color:${colorOf(r.element)}`},fmt(r.damage)),h('td',{},r.inherited?'继承':'单独'))))):'';
  return h('section',{class:'result-panel','aria-live':'polite'},h('div',{class:'result-top'},h('span',{},'计算结果'),h('span',{class:'live-pill'},h('i',{}),' 实时')),h('div',{class:'result-element',style:`color:${colorOf(el)}`},`${ELEMENT_CN[el]}伤害 · ${res.title}`),h('div',{class:'result-number',style:`color:${colorOf(el)}`},fmt(res.total)),h('div',{class:'result-sub'},`${res.results.length>1?'技能总伤（分段相加）':'单段'} · ${{expected:'暴击期望',never:'不暴击',always:'必暴击'}[state.critMode]}`),segRows,h('div',{class:'result-divider'}),
    h('div',{class:'result-mini'},h('span',{},'面板攻击力'),h('strong',{},fmt(stats.atk.panel))),h('div',{class:'result-mini'},h('span',{},'主 / 副能力'),h('strong',{},`${stats.main} / ${stats.sub}`)),h('div',{class:'result-mini'},h('span',{},'力/敏/智/意'),h('strong',{},`${stats.abilities.str} / ${stats.abilities.agi} / ${stats.abilities.int} / ${stats.abilities.will}`)),h('div',{class:'result-mini'},h('span',{},'暴击率 / 暴伤'),h('strong',{},`${pct(stats.critRate)} / +${pct(stats.critDmg)}`)),h('div',{class:'result-mini'},h('span',{},'终结技充能效率'),h('strong',{},`+${pct2(stats.chargeEff)}`)),h('div',{class:'result-mini'},h('span',{},'目标有效抗性'),h('strong',{},res.results[0]?`${res.results[0].grade==='custom'?'自定义':res.results[0].grade+' 级'} · ${pct(res.results[0].resistance)}`:'—')),
    h('div',{class:'result-actions'},h('button',{type:'button',class:'mini-btn',onclick:()=>update(s=>{s.pendingSnapshot=res.trace;})},'保存快照'),h('button',{type:'button',class:'mini-btn',onclick:()=>download(`${res.trace.calcId}.json`,JSON.stringify(res.trace,null,1))},'导出计算 JSON'),h('span',{class:'muted small'},`计算编号 ${res.trace.calcId} · 数据 ${meta.dataVersion} · 引擎 ${ENGINE_VERSION}`)));
}

function breakdownPanel(state,res,fold){
  const rows=res.results.map(r=>{ const f=r.factors; const fr=(n,v)=>h('div',{class:'factor-row'},h('span',{},n),h('strong',{},v));
    return h('div',{class:'breakdown-seg'},res.results.length>1?h('div',{class:'breakdown-title'},r.label,' · ',fmt(r.damage)):'',fr('攻击力 × 倍率',`${fmt(f.attack)}${r.extraStats?.length?'（含条件属性 '+r.extraStats.map(x=>x.why).join('、')+'）':''} × ${r.ratioTrace.map(t=>typeof t.value==='number'&&t.label===r.label?pct(t.value):`${t.label} ${t.value}`).join(' ')}`),fr('暴击乘区',`× ${f.crit.toFixed(3)}`),fr('增伤乘区',`× ${f.bonus.toFixed(4)}`),fr('增幅乘区',`× ${f.amp.toFixed(4)}`),fr('脆弱乘区',`× ${f.fragile.toFixed(4)}`),fr('易伤乘区',`× ${f.vulnerable.toFixed(4)}`),fr('连击 / 失衡',`× ${(f.combo*f.stagger).toFixed(3)}`),fr('防御 / 抗性 / 减免',`× ${(f.defence*f.resistance*f.reduction).toFixed(4)}`),fr('等级系数 / 技艺',`× ${(f.level*f.artsStrength).toFixed(4)}`),
      h('div',{class:'active-buffs-title'},`本段实际计入 ${Object.values(r.buckets).flat().length} 项`),...Object.entries(r.buckets).flatMap(([z,arr])=>arr.map(x=>h('div',{class:'active-buff'},h('span',{},h('span',{class:'zone-tag'},ZONE_CN[z]),x.label),h('b',{},`+${pct2(x.value)}`)))),...r.mods.ratioMul.map(x=>h('div',{class:'active-buff'},h('span',{},h('span',{class:'zone-tag'},'倍率'),x.label),h('b',{},`×${x.value}`))),h('div',{class:'muted small'},r.rounding)); });
  return panel({id:'breakdown',index:'∑',title:'计算拆解',folds:state.ui.folds,onFold:fold,defaultCollapsed:true},...rows,h('div',{class:'active-buffs-title'},'面板来源'),...res.stats.trace.filter(t=>t.part!=='ignored').slice(0,80).map(t=>h('div',{class:'active-buff'},h('span',{},`${t.part}${t.stat?' '+(ABIL_CN[t.stat]||t.stat):''} · ${t.why}`),h('b',{},typeof t.value==='number'?(t.part==='abilityPct'||t.part==='atkPct'||t.part==='critRate'||t.part==='chargeEff'||t.part==='bonus'?pct2(t.value):fmt(t.value)):String(t.value)))));
}

function describeMember(m){ if(!m) return {}; const op=operators.find(o=>o.id===m.operatorId); const w=weapons.find(x=>x.id===m.weapon?.id); const g=slot=>{const it=gear.find(x=>x.id===m.gear?.[slot]?.id); return it?`${it.name}(+${(m.gear[slot].refine||[]).join('/')})`:'无';}; return {干员:op?.name,潜能:m.potential,技能:Object.values(m.skillRanks||{}).join('/'),武器:w?`${w.name} ${m.potential}潜 R${(m.weapon.ranks||[]).join('/')}`:'无',护甲:g('armor'),护手:g('gloves'),配件一:g('kit1'),配件二:g('kit2'),食药:(m.consumables||[]).map(id=>consumables.find(c=>c.id===id)?.name).join('、')||'无'}; }
function configDiff(snapTrace,curTrace){ const a=describeMember(snapTrace.inputs.team[snapTrace.inputs.active]), b=describeMember(curTrace.inputs.team[curTrace.inputs.active]); const d=[]; for(const k of Object.keys(a)) if(String(a[k])!==String(b[k])) d.push(`${k}: ${a[k]} → ${b[k]}`); if(snapTrace.title!==curTrace.title) d.push(`伤害段: ${snapTrace.title} → ${curTrace.title}`); const na=snapTrace.segments.reduce((x,s)=>x+s.applied.length,0), nb=curTrace.segments.reduce((x,s)=>x+s.applied.length,0); if(na!==nb) d.push(`计入效果数: ${na} → ${nb}`); if(JSON.stringify(snapTrace.inputs.enemy)!==JSON.stringify(curTrace.inputs.enemy)||snapTrace.inputs.critMode!==curTrace.inputs.critMode) d.push('敌人/暴击口径不同'); return d; }
function snapshotBox(state,update,res,fold){
  const items=state.snapshots.map((sn,i)=>{ const diff=res.total-sn.trace.total; const op=operators.find(o=>o.id===sn.trace.inputs.team[sn.trace.inputs.active]?.operatorId);
    return h('div',{class:'snap-row'},h('div',{class:'snap-head'},h('strong',{},`#${i+1} ${sn.name}`),h('small',{},`${op?.name||''} · ${sn.trace.title} · ${new Date(sn.trace.createdAt).toLocaleString('zh-CN')}`)),h('div',{class:'snap-num'},fmt(sn.trace.total)),h('div',{class:'snap-diff '+(diff>=0?'up':'down')},`主区 ${diff>=0?'+':''}${fmt(diff)}（${sn.trace.total?((diff/sn.trace.total)*100).toFixed(1):'—'}%）`,h('div',{class:'muted small'},(configDiff(sn.trace,res.trace).slice(0,4).join('；')||'配置相同'))),h('div',{class:'snap-actions'},h('button',{type:'button',class:'mini-btn',onclick:()=>{const d=h('pre',{class:'snap-detail'},JSON.stringify({选择:sn.trace.title,面板:sn.trace.stats.atk.panel,乘区:sn.trace.segments.map(s=>s.factors),计入效果:sn.trace.segments.map(s=>s.applied.map(a=>a.name+' '+a.value))},null,1)); const row=event.target.closest('.snap-row'); const ex=row.querySelector('.snap-detail'); ex?ex.remove():row.append(d);}},'详情'),h('button',{type:'button',class:'mini-btn',onclick:()=>download(`${sn.trace.calcId}.json`,JSON.stringify(sn.trace,null,1))},'导出'),h('button',{type:'button',class:'mini-btn danger',onclick:()=>update(s=>{s.snapshots.splice(i,1);})},'删除'))); });
  return panel({id:'snap',index:'☰',title:`快照暂存箱（${state.snapshots.length}/10）`,folds:state.ui.folds,onFold:fold,defaultCollapsed:true},items.length?items:h('div',{class:'muted'},'暂无快照。计算完成后点击“保存快照”。'));
}
function importEntry(){ return h('section',{class:'panel disabled-entry'},h('div',{class:'panel-heading'},h('span',{class:'index'},'⇪'),h('h2',{},'识别编队图片导入配置'),h('span',{class:'badge'},'暂未开放')),h('p',{class:'muted small'},'后续版本提供：上传编队截图自动识别干员、武器与装备。本版本不含图片识别。')); }

// Snapshot dialog flow handled by main.js via state.pendingSnapshot
export function snapshotDialog(state,update){
  const trace=state.pendingSnapshot; if(!trace) return null;
  const full=state.snapshots.length>=10;
  const dlg=h('div',{class:'modal-back'}); const name=h('input',{type:'text',value:`${trace.title} ${fmt(trace.total)}`,class:'modal-input'});
  const slotSel=full?select(state.snapshots.map((s,i)=>[i,`替换 #${i+1} ${s.name}`]),0,()=>{}):null;
  const close=()=>update(s=>{delete s.pendingSnapshot;});
  const save=(reset)=>update(s=>{ const sn={name:name.value||trace.title,trace}; if(full){ s.snapshots[Number(slotSel.value)]=sn; } else s.snapshots.push(sn); delete s.pendingSnapshot; s.ui.folds.snap=false; if(reset){ const keep=s.snapshots; const fresh=defaultLike(s); Object.assign(s,fresh); s.snapshots=keep; } });
  dlg.append(h('div',{class:'modal'},h('h3',{},'保存快照'),field('名称',name),full?h('div',{},h('p',{class:'warn'},'暂存箱已满（10/10），请选择要替换的栏位，或先删除旧快照。'),slotSel):'',h('div',{class:'modal-actions'},h('button',{type:'button',class:'mini-btn',onclick:()=>save(false)},'保存并保留当前计算'),h('button',{type:'button',class:'mini-btn',onclick:()=>save(true)},'保存并重置主工作区'),h('button',{type:'button',class:'mini-btn',onclick:close},'取消'))));
  return dlg;
}
import {defaultState} from './state.js';
function defaultLike(s){ const d=defaultState(); d.ui=s.ui; return d; }

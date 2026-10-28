// Panel stats from a member loadout. Pure; returns values + trace lines. Formula references: docs/rules.md §B.
import {ownedEffects,valueOf,setCounts,STAT_ZONES,weaponRanks} from './effects.js';
export {weaponRanks};
const floor=x=>Math.floor(x+1e-9);
const ABIL=['str','agi','int','will'];
export const MAIN_PER_POINT=0.005, SUB_PER_POINT=0.002; // 主能力每点 +0.5% 攻击，副能力每点 +0.2%（规则 B8，待校正）

export function getStats(member,data,opts={}){
  const trace=[]; const op=data.operators.find(o=>o.id===member.operatorId); if(!op) throw new Error('unknown operator '+member.operatorId);
  const weapon=member.weapon?.id?data.weapons.find(w=>w.id===member.weapon.id):null;
  const wr=weaponRanks(member.weapon);
  // --- ability flat sources
  const flat={str:0,agi:0,int:0,will:0}; const pct={str:0,agi:0,int:0,will:0};
  const addFlat=(stat,v,why)=>{ const keys=stat==='main'?[op.mainAttr]:stat==='sub'?[op.subAttr]:stat==='all'?ABIL:[stat]; for(const k of keys){ flat[k]+=v; trace.push({part:'ability',stat:k,value:v,why}); } };
  const addPct=(stat,v,why)=>{ const keys=stat==='main'?[op.mainAttr]:stat==='sub'?[op.subAttr]:stat==='all'?ABIL:[stat]; for(const k of keys){ pct[k]+=v; trace.push({part:'abilityPct',stat:k,value:v,why}); } };
  for(const k of ABIL){ addFlat(k,op.base90[k],`${op.name} 90级基础`); if(op.talentStats?.[k]) addFlat(k,op.talentStats[k],'能力值天赋(满)'); }
  let atkPct=0, atkFlatBefore=0, atkFlatAfter=0, critRate=5, critDmg=50, chargeEff=0, artsStrength=0; const bonuses={};
  const addBonus=(key,v,why)=>{ bonuses[key]=(bonuses[key]||0)+v; trace.push({part:'bonus',stat:key,value:v,why}); };
  if(weapon){ weapon.skills.forEach((s,i)=>{ if(s.kind!=='attr') return; const rank=wr[i]??(i===2?4:9); const v=s.values[Math.max(0,Math.min(s.values.length-1,rank-1))]; const why=`${weapon.name}·${s.name} Rank${rank}`;
      if(['str','agi','int','will','main'].includes(s.stat)) addFlat(s.stat,v,why); else if(s.stat==='atkPct'){ atkPct+=v; trace.push({part:'atkPct',value:v,why}); } else if(s.stat==='critRate'){ critRate+=v; trace.push({part:'critRate',value:v,why}); } else if(s.stat==='artsStrength'){ artsStrength+=v; trace.push({part:'artsStrength',value:v,why}); } else if(s.stat==='chargeEff'){ chargeEff+=v; trace.push({part:'chargeEff',value:v,why}); } else if(s.stat==='dmgBonus'){ addBonus('elem:'+s.element,v,why); } else if(s.stat==='hpPct'||s.stat==='healEff'){ trace.push({part:'ignored',stat:s.stat,value:v,why}); } }); }
  for(const slot of ['armor','gloves','kit1','kit2']){ const g=member.gear?.[slot]; if(!g?.id) continue; const item=data.gear.find(x=>x.id===g.id); if(!item) continue; const refine=g.refine||[3,3,3];
    item.attrs.forEach((a,i)=>{ const r=Math.max(0,Math.min(3,refine[i]??3)); const v=a.values[r]; const why=`${item.name}·${a.name} 精锻+${r}`;
      if(['str','agi','int','will'].includes(a.stat)) addFlat(a.stat,v,why); else if(a.stat==='main'||a.stat==='sub'||a.stat==='all'){ a.pct?addPct(a.stat,v,why):addFlat(a.stat,v,why); } else if(a.stat==='atkFlat'){ atkFlatBefore+=v; trace.push({part:'atkFlat',value:v,why}); } else if(a.stat==='critRate'){ critRate+=v; trace.push({part:'critRate',value:v,why}); } else if(a.stat==='chargeEff'){ chargeEff+=v; trace.push({part:'chargeEff',value:v,why}); } else if(a.stat==='artsStrength'){ artsStrength+=v; trace.push({part:'artsStrength',value:v,why}); } else if(a.stat) addBonus(a.stat,v,why); }); }
  // --- auto stat effects from catalog (potentials, set auto stats, consumables)
  const catalog=data.effects||[]; const owned=ownedEffects(catalog,member,data,opts);
  const deferred=[]; // dependsOn stat effects read the owner's final abilities (e.g. 黎风「顿悟」智识+意志→攻击%), so they are applied after abilities are floored
  const applyOwned=(e,v)=>{ const why=e.name;
    if(e.zone==='ability'){ if(e.stat==='hpPct'||e.stat==='hp'){ trace.push({part:'ignored',stat:e.stat,value:v,why}); } else e.unit==='%'?addPct(e.stat,v,why):addFlat(e.stat,v,why); } else if(e.zone==='atkPct'){ atkPct+=v; trace.push({part:'atkPct',value:v,why}); } else if(e.zone==='atkFlat'){ if(e.owner?.kind==='consumable'){ atkFlatAfter+=v; trace.push({part:'atkFlatAfter',value:v,why}); } else { atkFlatBefore+=v; trace.push({part:'atkFlat',value:v,why}); } } else if(e.zone==='critRate'){ critRate+=v; trace.push({part:'critRate',value:v,why}); } else if(e.zone==='critDmg'){ critDmg+=v; trace.push({part:'critDmg',value:v,why}); } else if(e.zone==='chargeEff'){ chargeEff+=v; trace.push({part:'chargeEff',value:v,why}); } else if(e.zone==='artsStrength'){ artsStrength+=v; trace.push({part:'artsStrength',value:v,why}); } };
  for(const {effect:e,rank} of owned){ if(e.condition?.mode&&e.condition.mode!=='auto') continue; if(!STAT_ZONES.has(e.zone)) continue; if(e.value?.dependsOn&&e.zone!=='ability'){ deferred.push({e,rank}); continue; } applyOwned(e,valueOf(e,{rank})); }
  // --- conditional / teammate-provided stat effects already resolved by the caller (per segment or per hit)
  for(const x of opts.extraStats||[]){ const v=x.value, why=x.why||x.label||x.id; if(x.zone==='ability'){ if(x.stat==='hpPct'||x.stat==='hp') continue; x.unit==='%'?addPct(x.stat,v,why):addFlat(x.stat,v,why); } else if(x.zone==='atkPct'){ atkPct+=v; trace.push({part:'atkPct',value:v,why}); } else if(x.zone==='atkFlat'){ atkFlatBefore+=v; trace.push({part:'atkFlat',value:v,why}); } else if(x.zone==='critRate'){ critRate+=v; trace.push({part:'critRate',value:v,why}); } else if(x.zone==='critDmg'){ critDmg+=v; trace.push({part:'critDmg',value:v,why}); } else if(x.zone==='chargeEff'){ chargeEff+=v; trace.push({part:'chargeEff',value:v,why}); } else if(x.zone==='artsStrength'){ artsStrength+=v; trace.push({part:'artsStrength',value:v,why}); } }
  // --- finalize abilities: floor((flat)*(1+pct%)) per ability (面板取整，见 rules B9)
  const abilities={}; for(const k of ABIL) abilities[k]=floor(flat[k]*(1+pct[k]/100));
  for(const {e,rank} of deferred) applyOwned(e,valueOf(e,{rank,ownerAttrs:abilities}));
  const main=abilities[op.mainAttr], sub=abilities[op.subAttr];
  const charBase=op.base90.atk, weaponBase=weapon?.baseAtk90??0;
  const abilityMul=1+main*MAIN_PER_POINT+sub*SUB_PER_POINT;
  // rules B8: [(角色基础+武器基础)×(1+攻击%)+装备固定攻击]×(1+0.005主+0.002副) + 食药固定攻击（用户实测：主副能力乘算后再加）
  const foodInside=opts.foodFlatMode==='inside'; // 研究（封测实测）认为食药固定攻击也在括号内；用户实测为乘算后相加（默认）
  const atkRaw=((charBase+weaponBase)*(1+atkPct/100)+atkFlatBefore+(foodInside?atkFlatAfter:0))*abilityMul+(foodInside?0:atkFlatAfter);
  const sets=setCounts(member,data);
  return {operator:op,weapon,abilities,main,sub,flatAbilities:flat,pctAbilities:pct,atk:{charBase,weaponBase,atkPct,abilityMul,atkFlatBefore,atkFlatAfter,foodFlatMode:foodInside?'inside':'after',raw:atkRaw,panel:floor(atkRaw)},critRate,critDmg,chargeEff,artsStrength,bonuses,sets,trace};
}

// Team-aware effect resolution: which catalog effects can apply to a beneficiary member's segment, with values from the actual owner's loadout.
import {ownedEffects,valueOf} from './effects.js';
import {getStats} from './stats.js';
import {effectApplies} from './damage.js';

// candidates for beneficiary `bIdx` in team: own effects + teammates' effects with beneficiary team/others/mainControl/target
export function candidateEffects({team,bIdx,data,consumablesOf=()=>[],mainControlIdx=0}){
  const out=[];
  team.forEach((owner,oIdx)=>{ if(!owner?.operatorId) return; const owned=ownedEffects(data.effects||[],owner,data,{consumables:consumablesOf(oIdx)});
    for(const {effect:e,rank,setCount} of owned){ const b=e.beneficiary||'self'; const self=oIdx===bIdx; let ok=false;
      if(b==='self') ok=self; else if(b==='team') ok=true; else if(b==='others') ok=!self; else if(b==='mainControl') ok=bIdx===mainControlIdx; else if(b==='target') ok=true; // debuff on enemy benefits all attackers
      if(!ok) continue; out.push({effect:e,ownerIdx:oIdx,ownerMember:owner,rank,setCount}); } });
  // teamUnique: same effect id from several owners → keep the one with highest value (证据待定，见 rules D21)
  const byId={}; const result=[];
  for(const c of out){ if(c.effect.teamUnique){ const key=c.effect.id; const v=valueOf(c.effect,{rank:c.rank}); if(!byId[key]||v>byId[key].v){ byId[key]={c,v}; } } else result.push(c); }
  for(const {c} of Object.values(byId)) result.push({...c,teamUniqueCollapsed:true});
  return result;
}
// resolve numeric value for a candidate, honoring overrides {attr:value} and stacks
export function resolveValue(c,{data,overrides={},stacks={},vars={}}){
  const e=c.effect; const ctx={rank:c.rank,stacks:stacks[e.id],vars};
  if(e.value?.dependsOn){ const d=e.value.dependsOn; const ov=overrides[e.id]; let attrVal, origin;
    if(ov!=null&&ov!==''){ attrVal=Number(ov); origin='manual'; } else { const st=getStats(c.ownerMember,data); attrVal=st.abilities?.[d.attr]??0; origin='auto'; }
    ctx.ownerAttrs={[d.attr]:attrVal}; const autoStats=getStats(c.ownerMember,data); const autoVal=autoStats.abilities?.[d.attr];
    return {value:valueOf(e,ctx),dependency:{attr:d.attr,used:attrVal,auto:autoVal,origin}}; }
  return {value:valueOf(e,ctx)};
}
// Build the applied list for a segment given user toggles. toggles: {effectId:bool}; auto effects always on.
const isOn=(e,toggles)=>((e.condition?.mode||'auto')==='auto')||Boolean(toggles[e.id]);
// Segment-triggered effects (mode 'segment'): "造成连携技伤害后 …" cannot apply to the first hit of that skill, and necessarily applies to later hits.
export function triggerKindOf(e){ const t=(e.condition?.text||'')+(e.condition?.trigger||''); if(/连携技|combo/i.test(t)) return 'combo'; if(/终结技|ultimate/i.test(t)) return 'ultimate'; if(/战技|skill/i.test(t)) return 'skill'; if(/重击|普通攻击|normal/i.test(t)) return 'normal'; return null; }
export function segmentStatus(c,seg,segIndex,bIdx){ const e=c.effect; if((e.condition?.mode||'auto')!=='segment') return 'user'; if(c.ownerIdx!==bIdx) return 'user'; const k=triggerKindOf(e); if(!k||seg.skillKey!==k||segIndex==null) return 'user'; return segIndex===0?'disabled':'auto'; }
// Modifier effects (`modifies:[ids]`): zone 'other' with a multiplier (“视为/提升至原本的N倍”) multiplies the target value;
// same-zone modifiers (“脆弱效果+8%”) add to it. Duration/stack-only modifiers are informational.
function applyModifiers(applied,candidates,toggles,ctx){
  for(const c of candidates){ const m=c.effect; if(!Array.isArray(m.modifies)||!m.modifies.length) continue; if(!isOn(m,toggles)) continue; if(m.fragileMultiplier) continue;
    for(const target of applied){ if(!m.modifies.includes(target.effect.id)) continue; const {value:mv}=resolveValue(c,ctx);
      if(m.zone==='other'&&(m.unit==='x'||/倍/.test(m.literal||''))&&mv>0){ target.value=target.value*mv; target.label=`${target.label} ×${mv}（${m.owner?.ref||m.name}）`; target.modifiedBy=[...(target.modifiedBy||[]),m.id]; }
      else if(m.zone===target.effect.zone&&typeof mv==='number'){ target.value=target.value+mv; target.label=`${target.label} +${mv}（${m.owner?.ref||m.name}）`; target.modifiedBy=[...(target.modifiedBy||[]),m.id]; } } }
}
export function appliedFor({candidates,seg,segIndex=null,bIdx=0,toggles={},data,overrides,stacks,vars,memberModes={}}){
  const applied=[]; const ctx={data,overrides,stacks,vars};
  for(const c of candidates){ const e=c.effect; if(!effectApplies(e,seg)) continue; if(Array.isArray(e.modifies)&&e.modifies.length&&!e.fragileMultiplier) continue; // modifiers are folded into their targets
    const st=segmentStatus(c,seg,segIndex,bIdx); if(st==='disabled') continue; if(st!=='auto'&&!isOn(e,toggles)) continue; const {value,dependency}=resolveValue(c,ctx); applied.push({effect:e,value,label:e.name,ownerIdx:c.ownerIdx,dependency,mode:st==='auto'?'segment-auto':(e.condition?.mode||'auto')}); }
  applyModifiers(applied,candidates,toggles,ctx);
  return applied;
}

export const STAT_ZONE_SET=new Set(['ability','atkPct','atkFlat','critRate','critDmg','chargeEff','artsStrength']);
export function splitApplied(applied){ const stat=[],dmg=[]; for(const a of applied){ const e=a.effect; if(STAT_ZONE_SET.has(e.zone)){ if((e.condition?.mode||'auto')==='auto'&&a.ownerIdx===a.beneficiaryIdx) continue; stat.push({zone:e.zone,stat:e.stat,unit:e.unit,value:a.value,why:a.label,id:e.id}); } else dmg.push(a); } return {stat,dmg}; }

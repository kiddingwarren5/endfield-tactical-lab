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
export function appliedFor({candidates,seg,toggles={},data,overrides,stacks,vars,memberModes={}}){
  const applied=[];
  for(const c of candidates){ const e=c.effect; if(!effectApplies(e,seg)) continue; const mode=e.condition?.mode||'auto';
    const on=mode==='auto'?true:Boolean(toggles[e.id]); if(!on) continue;
    const {value,dependency}=resolveValue(c,{data,overrides,stacks,vars}); applied.push({effect:e,value,label:e.name,ownerIdx:c.ownerIdx,dependency,mode}); }
  return applied;
}

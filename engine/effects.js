// Effect catalog access + resolution helpers (pure). Catalog entries follow docs/effect-schema.md.
export const STAT_ZONES=new Set(['ability','atkPct','atkFlat','critRate','critDmg','chargeEff','artsStrength']);
export const DAMAGE_ZONES=new Set(['bonus','amp','fragile','vulnerable','ratioMul','ratioAdd','other']);

export function valueOf(effect,ctx={}){
  const v=effect.value||{}; const r=ctx.rank; // rank: 1-based index into byRank
  if(v.fixed!=null) return v.fixed;
  if(v.byRank){ const i=Math.max(0,Math.min(v.byRank.length-1,(r??v.byRank.length)-1)); const x=v.byRank[i]; if(x&&typeof x==='object') return valueOf({value:x},ctx); return x; }
  if(v.perStack!=null){ const s=Math.min(ctx.stacks??v.maxStacks??1,v.maxStacks??Infinity); return v.perStack*s; }
  if(v.dependsOn){ const d=v.dependsOn; const n=x=>(x&&typeof x==='object')?valueOf({value:x},ctx):(x??0); const base=n(d.base), per=n(d.per), cap=d.cap!=null?n(d.cap):null; const attr=ctx.ownerAttrs?.[d.attr]??0; const raw=base+per*attr; return cap!=null?Math.min(raw,base+cap):raw; }
  if(v.formula){ try{ const vars=Object.assign({},ctx.vars||{}); const f=new Function(...Object.keys(vars),`return (${v.formula});`); return f(...Object.values(vars)); }catch{ return 0; } }
  return 0;
}

// Which catalog entries are "owned" by a member's loadout, with the rank context for byRank values.
export function ownedEffects(catalog,member,data,opts={}){
  const out=[]; const op=data.operators.find(o=>o.id===member.operatorId); if(!op) return out;
  for(const e of catalog){ const o=e.owner||{};
    if(o.kind==='operator'||o.kind==='talent'||o.kind==='potential'){ if(o.id!==op.id) continue; if(o.potential!=null&&o.potential>(member.potential??0)) continue; const rank=e.rankType==='skill12'?(member.skillRanks?.[e.owner?.skill||e.applies?.skill||'ultimate']??12):undefined; out.push({effect:e,rank}); }
    else if(o.kind==='weapon'){ if(!member.weapon||o.id!==member.weapon.id) continue; out.push({effect:e,rank:member.weapon.ranks?.[2]??4}); }
    else if(o.kind==='gearSet'){ const count=setCounts(member,data)[o.id]||0; const need=e.pieces??3; if(count<need) continue; out.push({effect:e,rank:undefined,setCount:count}); }
    else if(o.kind==='consumable'){ if(!(opts.consumables||[]).includes(o.id)) continue; out.push({effect:e}); }
  }
  return out;
}
export function setCounts(member,data){ const c={}; for(const slot of ['armor','gloves','kit1','kit2']){ const g=member.gear?.[slot]; if(!g?.id) continue; const item=data.gear.find(x=>x.id===g.id); if(item?.set) c[item.set]=(c[item.set]||0)+1; } return c; }

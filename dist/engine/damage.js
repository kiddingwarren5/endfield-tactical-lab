// Single-segment damage with multiplier zones and a full trace. Formula status: docs/rules.md §A (current implementation inherited from demo; marked where unverified).
export const ENGINE_VERSION='0.2.0';
export const GRADE_RESISTANCE={D:0,C:20,B:50}; // 评级→抗性%，待规则核对（rules A3）
const sum=a=>a.reduce((x,y)=>x+y,0);
const clamp=(x,lo,hi)=>Math.min(hi,Math.max(lo,Number.isFinite(Number(x))?Number(x):lo));
export const isArts=el=>el!=='physical';

// Gear/weapon panel bonuses that apply to this segment (increase zone, additive)
export function panelBonusItems(stats,seg){
  const items=[]; const b=stats.bonuses||{}; const el=seg.element, kind=seg.kind;
  const push=(k,label,cond)=>{ if(b[k]&&cond) items.push({label,value:b[k],source:'panel'}); };
  push('coldElecDmg','装备 · 寒冷和电磁伤害加成',el==='cold'||el==='electric');
  push('heatNatureDmg','装备 · 灼热和自然伤害加成',el==='heat'||el==='nature');
  push('physicalDmg','装备 · 物理伤害加成',el==='physical');
  push('artsDmg','装备 · 法术伤害加成',isArts(el));
  push('allSkillDmg','装备 · 所有技能伤害加成',['skill','combo','ultimate'].includes(kind));
  push('skillDmg','装备 · 战技伤害加成',kind==='skill'); push('comboDmg','装备 · 连携技伤害加成',kind==='combo'); push('ultDmg','装备 · 终结技伤害加成',kind==='ultimate'); push('normalDmg','装备 · 普通攻击伤害加成',kind==='normal');
  for(const [k,v] of Object.entries(b)) if(k.startsWith('elem:')){ const e={寒冷:'cold',灼热:'heat',电磁:'electric',自然:'nature',物理:'physical'}[k.slice(5)]||k.slice(5); if(e==='法术'?isArts(el):e===el) items.push({label:`武器 · ${k.slice(5)}伤害提升`,value:v,source:'panel'}); }
  return items;
}
export function effectApplies(e,seg){
  const a=e.applies||{}; if(a.elements?.length&&!a.elements.includes(seg.element)&&!a.elements.includes('any')) return false;
  if(a.kinds?.length&&!a.kinds.includes(seg.kind)) return false;
  if(a.damageClass==='arts'&&!isArts(seg.element)) return false; if(a.damageClass==='physical'&&seg.element!=='physical') return false;
  if(a.skills?.length&&seg.skillKey&&!a.skills.includes(seg.skillKey)) return false;
  if(a.segments?.length&&seg.id&&!a.segments.includes(seg.id)) return false;
  if(a.anomaly?.length&&seg.kind!=='mech') return false;
  return true;
}
// applied: [{effect, value, label, zone}] already resolved by the caller (effects.js / skills.js)
export function calcSegment({stats,seg,rank=12,enemy,critMode='never',applied=[],vars={},options={}}){
  const buckets={bonus:[],amp:[],fragile:[],vulnerable:[]}; const mods={ratioMul:[],ratioAdd:[],fragileMul:[],other:[]};
  for(const it of panelBonusItems(stats,seg)) buckets.bonus.push(it);
  for(const ap of applied){ const e=ap.effect; if(!effectApplies(e,seg)) continue; const item={label:ap.label||e.name,value:ap.value,source:e.id};
    if(buckets[e.zone]) buckets[e.zone].push(item); else if(e.zone==='ratioMul') mods.ratioMul.push(item); else if(e.zone==='ratioAdd') mods.ratioAdd.push(item); else if(e.fragileMultiplier) mods.fragileMul.push({...item,value:e.fragileMultiplier}); else mods.other.push(item); }
  if(mods.fragileMul.length){ const m=mods.fragileMul.reduce((a,b)=>a*b.value,1); buckets.fragile=buckets.fragile.map(x=>({...x,label:`${x.label} · 脆弱×${m}`,value:x.value*m,base:x.value})); }
  // ratio
  const rIdx=Math.max(0,Math.min(seg.ratio.length-1,rank-1)); let ratio=seg.ratio[rIdx]; const ratioTrace=[{label:seg.label,value:ratio}];
  if(seg.per==='unit'){ const n=vars.layers??vars.units??0; ratioTrace.push({label:`×${n} 层`,value:n}); ratio=ratio*n; }
  for(const m of mods.ratioAdd){ ratio+=m.value; ratioTrace.push({label:m.label,value:'+'+m.value}); }
  for(const m of mods.ratioMul){ ratio*=m.value; ratioTrace.push({label:m.label,value:'×'+m.value}); }
  // noCrit: burn DoT cannot crit (rules A5)
  const crit=critMode==='never'||seg.noCrit?1:critMode==='always'?1+stats.critDmg/100:1+(clamp(stats.critRate,0,100)/100)*(stats.critDmg/100);
  const def=clamp(enemy?.defence??100,0,99999); const grade=enemy?.resistances?.[seg.element]??'D';
  const resistance=grade==='custom'?clamp(enemy?.custom?.[seg.element]??0,-100,100):(GRADE_RESISTANCE[grade]??0);
  const mech=seg.kind==='mech'; // 机制伤害：等级系数与技艺强度，沿用 demo（rules A5/A6 待核）
  const lf=stats.operator?.exact90; const levelFactor=mech?(isArts(seg.element)?(lf?.artsLevelFactor??1+89/196):(lf?.physicalLevelFactor??1+89/392)):1; // rules A5：法术 1+(l-1)/196，物理 1+(l-1)/392（解包 attr 49/25 一致）
  const artsFactor=mech?1+clamp(stats.artsStrength,0,9999)/100:1;
  const factors={attack:stats.atk.panel,ratio:ratio/100,crit,bonus:1+sum(buckets.bonus.map(x=>x.value))/100,amp:1+sum(buckets.amp.map(x=>x.value))/100,fragile:1+sum(buckets.fragile.map(x=>x.value))/100,vulnerable:1+sum(buckets.vulnerable.map(x=>x.value))/100,combo:1+clamp(options.combo??0,0,999)/100,stagger:1+clamp(options.stagger??0,0,999)/100,defence:100/(100+def),resistance:1-resistance/100,reduction:1-clamp(options.reduction??0,0,100)/100,level:levelFactor,artsStrength:artsFactor};
  const damage=Object.values(factors).reduce((a,b)=>a*b,1);
  return {segmentId:seg.id,label:seg.label,element:seg.element,kind:seg.kind,rank,damage,factors,buckets,mods,ratioTrace,resistance,grade,defence:def,rounding:'引擎不取整；界面显示四舍五入到整数'};
}

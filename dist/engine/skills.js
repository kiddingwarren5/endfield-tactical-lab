// Skill-level calculation: per-segment results + total (= sum of segments). Also exposes total definitions.
import {calcSegment} from './damage.js';
export function skillSegments(op,skillKey,mode){ const sk=op.skills[skillKey]; if(!sk) return []; const src=(mode!=null&&sk.modeVariants)?sk.modeVariants[mode]:sk; return (src.segments||[]).map(s=>({...s,skillKey})); }
export function mechSegments(element){ // 机制伤害：倍率沿用 demo（rules A5 待核；异常等级 1–4 作为 vars.abnormal）
  const mk=(id,label,el,base,scale)=>({id,label,element:el,kind:'mech',ratio:[base],base,scale});
  return [mk('artsBurst','法术爆发',element,160,0),{...mk('iceShatter','碎冰','physical',120,1),levelClass:'arts'},mk('burn','燃烧 · 初始','heat',80,1),{...mk('burnTick','燃烧 · 每秒','heat',12,1),noCrit:true},mk('conduct','导电','electric',80,1),mk('corrosion','腐蚀 · 初始','nature',80,1),mk('freeze','冻结','cold',80,1),mk('knockup','击飞','physical',120,0),mk('knockdown','倒地','physical',120,0),mk('crush','猛击','physical',150,1),mk('armorBreak','碎甲','physical',50,1)];
}
export function calcSkill({stats,segments,rank,enemy,critMode,appliedFor,vars,options}){
  const results=segments.map(seg=>{ const applied=typeof appliedFor==='function'?appliedFor(seg):(appliedFor||[]); let s=seg; if(seg.kind==='mech'){ const ab=Math.max(1,Math.min(4,vars?.abnormal??1)); s={...seg,ratio:[seg.base*(seg.scale?1+ab:1)]}; } return calcSegment({stats,seg:s,rank,enemy,critMode,applied,vars,options}); });
  return {segments:results,total:results.reduce((a,r)=>a+r.damage,0)};
}

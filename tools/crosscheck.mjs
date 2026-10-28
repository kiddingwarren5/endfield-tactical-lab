// Cross-check official (skland) vs datamine (warfarin) values. Writes docs/data-crosscheck.json and prints a summary.
// Usage: node tools/crosscheck.mjs
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(p));
const sk={ops:load('sources/skland/operators.json'),wps:load('sources/skland/weapons.json'),gear:load('sources/skland/gear.json')};
const wf={ops:load('sources/warfarin/operators.json'),wps:load('sources/warfarin/weapons.json'),gear:load('sources/warfarin/gear.json')};

// NFKC folds full-width punctuation (！（）) so "大鳞，上钩!" and "大鳞，上钩！" compare equal.
const norm=s=>String(s??'').normalize('NFKC').replace(/\s+/g,'');
const num=s=>Number(String(s).replace(/[%+,秒]/g,''));
// Official page names that differ from the game table; each checked by hand against the raw pages (docs/data-sources.md).
const NAME_ALIAS={'管理员(男)':'管理员','管理员(女)':'管理员','拓荒护甲·叄型':'拓荒护甲·叁型','集成实训突袭刺刀':'集成实训突袭刺刃'};
const findMined=(list,name)=>{ const n=norm(name); const target=NAME_ALIAS[n]??n; return list.find(x=>norm(x.name)===target); };

// Game display rounding is half-up; toPrecision strips binary noise such as 0.192*100=19.200000000000003.
const roundHalfUp=(x,dec)=>{ const p=10**dec; return Math.round(Number((x*p).toPrecision(12)))/p; };
function formatValue(v,fmt){
  if(!fmt) return String(v);
  const pct=fmt.endsWith('%'); const body=pct?fmt.slice(0,-1):fmt; const frac=body.split('.')[1]||'';
  let s=roundHalfUp(pct?v*100:v,frac.length).toFixed(frac.length);
  if(frac.includes('#')) s=s.replace(/\.?0+$/,'');
  return s+(pct?'%':'');
}
// Placeholders may be arithmetic over blackboard keys, e.g. {1-dmg_taken_down:0%} or {spell_dmg_up2*max_stack:0.0%}.
function evalPlaceholder(expr,bb){
  const toks=expr.replace(/\s+/g,'').match(/\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/]/g)||[];
  const val=t=>/^[A-Za-z_]/.test(t)?bb[t]:Number(t);
  if(toks.some(t=>/^[A-Za-z_]/.test(t)&&typeof bb[t]!=='number')) return undefined;
  if(toks[0]==='-') toks.splice(0,2,String(-val(toks[1])));
  const terms=[]; let ops=[];
  for(let i=0;i<toks.length;i+=2){ let v=val(toks[i]); while(toks[i+1]==='*'||toks[i+1]==='/'){ const r=val(toks[i+2]); v=toks[i+1]==='*'?v*r:v/r; i+=2; } terms.push(v); if(toks[i+1]) ops.push(toks[i+1]); }
  return terms.reduce((acc,v,i)=>i===0?v:ops[i-1]==='+'?acc+v:acc-v,0);
}
// Fill a game description template ("攻击力+{atk:0.0%}") from its blackboard and drop rich-text tags.
function renderTemplate(tpl,bb){
  return String(tpl).replace(/<[@#][^>]*>|<\/>/g,'').replace(/\{([^{}:]+)(?::([^{}]*))?\}/g,(m,expr,fmt)=>{
    const key=expr.trim(); if(typeof bb[key]==='string') return bb[key];
    const v=evalPlaceholder(key,bb); return v==null||Number.isNaN(v)?m:formatValue(v,fmt); });
}
const numbersIn=s=>(String(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
const sameNumbers=(a,b)=>{ const x=numbersIn(a),y=numbersIn(b); return x.length===y.length&&x.every((v,i)=>v===y[i]); };

const report={generatedAt:new Date().toISOString(),operators:[],weapons:[],gear:[],sets:[],unmatched:{},summary:{}};
const unmatched=(kind,name)=>(report.unmatched[kind]??=[]).push(name);

// ---------------- operators ----------------
const ATTR={生命值:1,攻击力:2,力量:39,敏捷:40,智识:41,意志:42};
const GROUP_TYPE={普通攻击:0,战技:1,终结技:2,连携技:3};
// 诀 has two official tables per skill; the first description line names the active stance, matching subDesc cond suffixes.
const STANCE={'阵诀·智生效':'_wisd','阵诀·意生效':'_will'};
const SP_ROWS=['技力消耗','消耗技力'], ENERGY_ROWS=['所需终结技能量','消耗能量'], CD_ROWS=['冷却时间'];
// Labels that differ only by 的/第/(秒) are the same row; anything else needs a close character match.
const looseLabel=s=>norm(s).replace(/[的第]/g,'').replace(/\(秒\)/g,'');
function bigramDice(a,b){ const g=s=>{ const out=[]; for(let i=0;i<s.length-1;i++) out.push(s.slice(i,i+2)); return out; }; const A=g(a),B=g(b); if(!A.length||!B.length) return 0; let hit=0; const pool=[...B]; for(const x of A){ const j=pool.indexOf(x); if(j>=0){ hit++; pool.splice(j,1); } } return 2*hit/(A.length+B.length); }

function matchLabel(row,labels){
  const n=norm(row); if(labels.includes(n)) return {label:n,how:'exact'};
  const loose=labels.find(l=>looseLabel(l)===looseLabel(row)); if(loose) return {label:loose,how:'label-variant'};
  const scored=labels.map(l=>({l,s:bigramDice(n,l)})).sort((a,b)=>b.s-a.s);
  if(scored[0]&&scored[0].s>=0.6&&(!scored[1]||scored[1].s<scored[0].s)) return {label:scored[0].l,how:'label-variant'};
  return null;
}

// Normal-attack blackboards name the shown multiplier differently per operator; multi-hit segments may show per-hit atk_scale instead of the total.
const SCALE_KEYS=['display_atk_scale','atk_scale_display','atk_scale'];
function normalAttackVsBlackboard(official,bb){
  const dec=(String(official).replace('%','').split('.')[1]||'').length;
  const matchedKey=SCALE_KEYS.find(k=>typeof bb[k]==='number'&&roundHalfUp(bb[k]*100,dec)===num(official));
  return {...Object.fromEntries(SCALE_KEYS.filter(k=>k in bb).map(k=>[k,bb[k]])),matchedKey,ok:!!matchedKey};
}

// Stance-only cooldown changes live in talent effects (skillParamModifier paramType 2 = coolDown, as the potentials' "冷却时间{coolDown}" texts show).
function stanceCooldownDelta(w,skillId,stance){
  if(!stance) return 0;
  const vals=new Set(Object.values(w.potentialEffects||{}).flatMap(e=>e.dataList||[])
    .filter(d=>d.activeCondition?.some(c=>c.endsWith(stance))&&d.skillParamModifier?.skillId===skillId&&d.skillParamModifier.paramType===2&&d.skillParamModifier.modifyType===1)
    .map(d=>d.skillParamModifier.paramValue));
  return vals.size===1?[...vals][0]:vals.size?NaN:0;
}

function checkOperatorAttrs(o,w){
  const out=[]; if(!o.attributes) return out;
  const levels=o.attributes.header.slice(1).map(h=>Number(h.replace('级','')));
  for(const [label,code] of Object.entries(ATTR)){ const vals=o.attributes[label]; if(!vals) continue;
    levels.forEach((L,i)=>{ const v=w.attributes.find(a=>a.level===L)?.attrs[code]; const official=num(vals[i]);
      out.push({label,level:L,official,mined:v,ok:v!=null&&Math.floor(v+1e-9)===official,roundWouldFail:v!=null&&Math.round(v)!==official}); }); }
  return out;
}

function checkOperatorSkill(o,s,w){
  const groups=Object.values(w.skillGroupMap);
  const g=groups.find(x=>norm(x.name)===norm(s.name))??groups.find(x=>x.skillGroupType===GROUP_TYPE[s.type]);
  if(!g) return [{skill:s.name,row:'*',status:'no-mined-group'}];
  const nameNote=norm(g.name)===norm(s.name)?undefined:`官方技能名“${norm(s.name)}”/解包“${g.name}”`;
  const stance=Object.entries(STANCE).find(([k])=>s.description.includes(k))?.[1]??null;
  const condOk=c=>!c||!stance||c.endsWith(stance);
  const ids=g.skillIdList.filter(id=>w.skills[id]); const lead=w.skills[ids[0]];
  const labels=[...new Set(ids.flatMap(id=>w.skills[id].flatMap(l=>l.subDesc.filter(d=>condOk(d.cond)).map(d=>norm(d.name)))))];
  const used=new Set(); const out=[];
  for(const [row,vals] of Object.entries(s.table)){ if(row==='header') continue;
    const base={skill:norm(s.name),type:s.type,stance,row:norm(row),nameNote};
    const scalar=(kind,pick)=>{ const cmp=vals.map((v,i)=>{ const m=lead[i]?pick(lead[i]):null; return {official:num(v),mined:m,ok:m!=null&&m===num(v)}; }); return {...base,kind,minedSkill:ids[0],ok:cmp.every(c=>c.ok),cmp}; };
    if(SP_ROWS.includes(norm(row))){ out.push(scalar('sp-cost',l=>l.cost.value)); continue; }
    if(ENERGY_ROWS.includes(norm(row))){ out.push(scalar('ult-energy',l=>l.cost.value)); continue; }
    if(CD_ROWS.includes(norm(row))){ const delta=stanceCooldownDelta(w,ids[0],stance); out.push({...scalar('cooldown',l=>l.coolDown+delta),stanceDelta:delta||undefined}); continue; }
    const m=matchLabel(row,labels.filter(l=>!used.has(l)));
    if(!m){ out.push({...base,kind:'subDesc',status:'no-mined-row'}); continue; }
    used.add(m.label);
    const cmp=vals.map((v,i)=>{
      for(const id of ids){ const L=w.skills[id][i]; const ds=(L?.subDesc||[]).filter(d=>norm(d.name)===m.label&&condOk(d.cond)); if(!ds.length) continue;
        const same=d=>norm(v)===norm(d.desc)||num(v)===num(d.desc); const d=ds.find(same)??ds[0];
        const c={official:v,mined:d.desc,ok:same(d),skillId:id,...(ds.length>1?{minedOccurrences:ds.map(x=>x.desc)}:{})};
        if(g.skillGroupType===0) c.bb=normalAttackVsBlackboard(v,L.blackboard);
        return c; }
      return {official:v,mined:null,ok:false}; });
    out.push({...base,kind:'subDesc',minedLabel:m.how==='exact'?undefined:m.label,ok:cmp.every(c=>c.ok),bbOk:g.skillGroupType===0?cmp.every(c=>c.bb?.ok):undefined,cmp});
  }
  return out;
}

for(const o of sk.ops){ const w=findMined(wf.ops,o.name); if(!w){ unmatched('operators',o.name); continue; }
  report.operators.push({name:o.name,minedId:w.id,attrs:checkOperatorAttrs(o,w),skills:o.skills.flatMap(s=>checkOperatorSkill(o,s,w))}); }

// ---------------- weapons ----------------
for(const o of sk.wps){ const w=findMined(wf.wps,o.name); if(!w){ unmatched('weapons',o.name); continue; }
  const r={name:o.name,minedId:w.id,baseAtk:[],skills:[]};
  if(o.baseAttack){ const levels=o.baseAttack.header.slice(1).map(h=>Number(h.replace('级',''))); const vals=o.baseAttack['基础攻击力'];
    levels.forEach((L,i)=>{ const m=w.baseAtk.find(x=>x.lv===L)?.atk; r.baseAtk.push({level:L,official:num(vals[i]),mined:m,ok:m===num(vals[i])}); }); }
  // Official skill columns follow weaponSkillList order, so pair by position and report name differences separately.
  o.skills.forEach((s,i)=>{ const id=w.skillIds[i]; const levels=w.skills[id];
    if(!levels){ r.skills.push({slot:i+1,skill:s.name,status:'no-mined-skill'}); return; }
    const minedName=levels[0].name; const cmp=s.ranks.map((rk,j)=>{ const L=levels[j]; if(!L) return {rank:j+1,ok:false,mined:null};
      const rendered=renderTemplate(L.description,L.blackboard); const ok=norm(rendered)===norm(rk.text);
      return {rank:j+1,ok,numbersOk:ok||sameNumbers(rendered,rk.text),official:ok?undefined:rk.text,mined:ok?undefined:rendered}; });
    r.skills.push({slot:i+1,skill:s.name,minedId:id,minedName:norm(minedName)===norm(s.name)?undefined:minedName,ok:cmp.every(c=>c.ok),cmp}); });
  report.weapons.push(r); }

// ---------------- gear ----------------
// Candidate display rules; each value records every rule that reproduces the official number from the internal one.
const RULES={
  exact:(m,o)=>Math.abs(m-o)<1e-9,
  round1:(m,o)=>roundHalfUp(m,1)===o,
  floor1:(m,o)=>Math.floor(Number((m*10).toPrecision(12)))/10===o,
  round0:(m,o)=>roundHalfUp(m,0)===o,
  floor0:(m,o)=>Math.floor(Number(m.toPrecision(12)))===o,
};
// AllDamageTakenScalar is stored as the damage multiplier taken (1−reduction).
const toDisplayUnits=(pack,v,isPct)=>!isPct?v:pack==='AllDamageTakenScalar'?(1-v)*100:v*100;
const rulesFor=(pack,mined,official,isPct)=>{ const m=toDisplayUnits(pack,mined,isPct); return Object.entries(RULES).filter(([,f])=>f(m,official)).map(([k])=>k); };

const setSeen=new Map();
for(const o of sk.gear){ const w=findMined(wf.gear,o.name); if(!w){ unmatched('gear',o.name); continue; }
  const mods=w.equip.displayAttrModifiers||[]; const r={name:o.name,minedId:w.id,attrCount:mods.length,base:null,attrs:[]};
  const def=o.attrs.find(a=>a.name==='防御力'); const baseMod=w.equip.displayBaseAttrModifier;
  if(def&&baseMod){ const rules=rulesFor('',baseMod.attrValue,num(def.value),false); r.base={official:num(def.value),mined:baseMod.attrValue,rules,ok:rules.length>0}; }
  o.refine.forEach((ref,i)=>{ const m=mods[i]; if(!m){ r.attrs.push({name:ref.name,status:'no-mined-attr'}); return; }
    const isPct=ref.values[0].includes('%'); const mined=[m.attrValue,...m.enhancedAttrValues];
    const cmp=ref.values.map((v,j)=>{ const rules=rulesFor(m.packAttrType,mined[j],num(v),isPct); return {official:num(v),mined:mined[j],display:Number(toDisplayUnits(m.packAttrType,mined[j],isPct).toPrecision(12)),rules,ok:rules.length>0}; });
    r.attrs.push({name:ref.name,pack:m.packAttrType,isPct,ok:cmp.every(c=>c.ok),cmp}); });
  report.gear.push(r);
  if(o.set){ const sid=w.suit?.skillID; const L=sid&&w.suitSkill[sid]?.[0];
    const rendered=L?renderTemplate(L.description,L.blackboard):null; const key=norm(o.set.name)+'|'+norm(o.set.description);
    const noSet=!L&&norm(o.set.description)==='无套组技能。';
    if(!setSeen.has(key)){ const ok=noSet||rendered!=null&&norm(rendered)===norm(o.set.description);
      const e={set:o.set.name,suitID:w.suit?.suitID,skillId:sid,items:[],ok,numbersOk:ok||rendered!=null&&sameNumbers(rendered,o.set.description),official:o.set.description,mined:rendered};
      if(e.ok){ delete e.official; delete e.mined; } setSeen.set(key,e); report.sets.push(e); }
    setSeen.get(key).items.push(o.name); }
}

// ---------------- summary ----------------
const tally=(list)=>({ok:list.filter(x=>x.ok).length,total:list.length});
const opAttrs=report.operators.flatMap(r=>r.attrs), opRows=report.operators.flatMap(r=>r.skills);
const opCells=opRows.flatMap(r=>r.cmp||[{ok:false}]);
const naRows=opRows.filter(r=>r.bbOk!==undefined);
const wpSkills=report.weapons.flatMap(r=>r.skills), wpRanks=wpSkills.flatMap(s=>s.cmp||[{ok:false}]);
const gearVals=report.gear.flatMap(r=>r.attrs.flatMap(a=>a.cmp||[{ok:false}]));
// Per attribute type, the rule explaining the most values is taken as the display rule; values explained only by another rule are rounding exceptions, values explained by none are conflicts.
const packRules={}; const packValues=[...report.gear.flatMap(r=>r.base?[{pack:'Def(基础防御力)',name:'防御力',c:r.base,item:r.name}]:[]),...report.gear.flatMap(r=>r.attrs.flatMap(a=>(a.cmp||[]).map(c=>({pack:a.pack,name:a.name,c,item:r.name}))))];
for(const {pack,name,c} of packValues){ const p=(packRules[pack]??={names:new Set(),n:0,counts:{}}); p.names.add(name); p.n++; for(const k of c.rules) p.counts[k]=(p.counts[k]||0)+1; }
for(const p of Object.values(packRules)) p.dominant=Object.keys(RULES).reduce((best,k)=>(p.counts[k]||0)>(p.counts[best]||0)?k:best,'exact');
for(const {pack,c,item} of packValues){ const p=packRules[pack]; c.dominantOk=c.rules.includes(p.dominant); if(!c.dominantOk) (c.rules.length?(p.exceptions??=[]):(p.conflicts??=[])).push(`${item}:${c.official}/${c.display??c.mined}`); }
report.summary={
  operatorAttrs:{...tally(opAttrs),roundWouldFail:opAttrs.filter(a=>a.roundWouldFail).length},
  operatorSkillRows:{...tally(opRows),byKind:Object.fromEntries(['sp-cost','ult-energy','cooldown','subDesc'].map(k=>[k,tally(opRows.filter(r=>r.kind===k))])),noMinedRow:opRows.filter(r=>r.status).length,labelVariants:opRows.filter(r=>r.minedLabel).length},
  operatorSkillCells:tally(opCells),
  normalAttackVsBlackboard:{ok:naRows.filter(r=>r.bbOk).length,total:naRows.length},
  weaponBaseAtk:tally(report.weapons.flatMap(r=>r.baseAtk)),
  weaponSkills:{...tally(wpSkills),nameDiffs:wpSkills.filter(s=>s.minedName).length},
  weaponSkillRanks:{...tally(wpRanks),numbersOnlyOk:wpRanks.filter(c=>!c.ok&&c.numbersOk).length},
  gearBaseDef:tally(report.gear.filter(r=>r.base).map(r=>r.base)),
  gearAttrValues:{...tally(gearVals),exact:gearVals.filter(c=>c.rules?.includes('exact')).length},
  gearTwoAttr:report.gear.filter(r=>r.attrCount===2).map(r=>r.name),
  gearRulesByPack:Object.fromEntries(Object.entries(packRules).map(([k,p])=>[k,{names:[...p.names],values:p.n,dominant:p.dominant,ruleHits:p.counts,roundingExceptions:p.exceptions||[],conflicts:p.conflicts||[]}])),
  setEffects:{...tally(report.sets),numbersOnlyOk:report.sets.filter(s=>!s.ok&&s.numbersOk).length},
  unmatched:report.unmatched,
};
fs.writeFileSync('docs/data-crosscheck.json',JSON.stringify(report,null,1));

const S=report.summary; const fr=t=>`${t.ok}/${t.total}`;
console.log('unmatched',JSON.stringify(report.unmatched));
console.log('operator attrs',fr(S.operatorAttrs),'| values where Math.round would disagree:',S.operatorAttrs.roundWouldFail);
console.log('operator skill rows',fr(S.operatorSkillRows),JSON.stringify(Object.fromEntries(Object.entries(S.operatorSkillRows.byKind).map(([k,v])=>[k,fr(v)]))),'no-mined-row',S.operatorSkillRows.noMinedRow,'label-variants',S.operatorSkillRows.labelVariants);
console.log('operator skill cells',fr(S.operatorSkillCells),'| normal-attack rows vs blackboard',fr(S.normalAttackVsBlackboard));
for(const r of report.operators) for(const s of r.skills) if(!s.ok) console.log('  ',r.name,s.skill+(s.stance?`[${s.stance}]`:''),s.row,s.status||'',s.cmp?s.cmp.map(c=>c.ok?'·':`${c.official}≠${c.mined}`).join(' '):'');
for(const r of report.operators) for(const s of r.skills) if(s.bbOk===false) console.log('   blackboard',r.name,s.skill,s.row,s.cmp.map(c=>c.bb.ok?'·':`${c.official}≠${JSON.stringify(c.bb)}`).join(' '));
for(const r of report.operators) for(const s of r.skills) if(s.bbOk&&s.cmp.some(c=>c.bb.matchedKey==='atk_scale'&&('display_atk_scale' in c.bb||'atk_scale_display' in c.bb))) console.log('   per-hit display',r.name,s.skill,s.row,JSON.stringify(s.cmp[0].bb));
for(const r of report.operators) for(const s of r.skills) if(s.minedLabel||s.nameNote) console.log('   label',r.name,s.skill,s.row,'->',s.minedLabel||'',s.nameNote||'');
console.log('weapon baseAtk',fr(S.weaponBaseAtk),'| skills',fr(S.weaponSkills),'name diffs',S.weaponSkills.nameDiffs,'| ranks',fr(S.weaponSkillRanks),'numbers-only ok',S.weaponSkillRanks.numbersOnlyOk);
for(const r of report.weapons){ for(const a of r.baseAtk) if(!a.ok) console.log('  ',r.name,'baseAtk',a.level,a.official,'≠',a.mined);
  for(const s of r.skills){ if(s.minedName) console.log('   name',r.name,'slot',s.slot,s.skill,'->',s.minedName); const bad=(s.cmp||[]).filter(c=>!c.ok); if(!bad.length) continue;
    console.log('  ',r.name,s.skill,'ranks',bad.map(c=>c.rank+(c.numbersOk?'':'*')).join(','),'(* = numbers differ)','\n     官方:',norm(bad[0].official),'\n     解包:',norm(bad[0].mined)); } }
console.log('gear base DEF',fr(S.gearBaseDef),'| attr values',fr(S.gearAttrValues),'exact',S.gearAttrValues.exact,'| two-attr gear',S.gearTwoAttr.length);
for(const [k,p] of Object.entries(S.gearRulesByPack)) console.log('  ',k.padEnd(34),p.names.join('/'),'n='+p.values,'rule='+p.dominant,JSON.stringify(p.ruleHits),p.roundingExceptions.length?'exceptions '+p.roundingExceptions.join(' '):'',p.conflicts.length?'CONFLICTS '+p.conflicts.join(' '):'');
for(const r of report.gear) for(const a of r.attrs) if(a.status) console.log('  ',r.name,a.name,a.status);
console.log('set effects',fr(S.setEffects),'numbers-only ok',S.setEffects.numbersOnlyOk);
for(const s of report.sets) if(!s.ok) console.log('  ',s.set,s.numbersOk?'(numbers equal)':'(numbers differ)','\n     官方:',norm(s.official),'\n     解包:',norm(s.mined));

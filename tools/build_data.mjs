// Build dist/data/*.js from sources/ (official skland parse + warfarin mined values). Do not hand-edit outputs.
import fs from 'node:fs';
const sk={ops:JSON.parse(fs.readFileSync('sources/skland/operators.json')),wps:JSON.parse(fs.readFileSync('sources/skland/weapons.json')),gear:JSON.parse(fs.readFileSync('sources/skland/gear.json')),cons:JSON.parse(fs.readFileSync('sources/skland/consumables.json'))};
const wf={ops:JSON.parse(fs.readFileSync('sources/warfarin/operators.json')),wps:JSON.parse(fs.readFileSync('sources/warfarin/weapons.json')),gear:JSON.parse(fs.readFileSync('sources/warfarin/gear.json'))};
const skIndex=JSON.parse(fs.readFileSync('sources/raw/skland/index.json'));
const corrections=JSON.parse(fs.readFileSync('sources/curated/official-corrections.json'));
const appliedCorrections=[];
const norm=s=>String(s||'').replace(/\s+/g,'');
const num=s=>{ if(s==null) return null; const m=String(s).replace(/[,，%+秒]/g,'').match(/-?\d+(\.\d+)?/); return m?Number(m[0]):null; };
const PROF={近卫:'guard',术师:'caster',突击:'assault',先锋:'vanguard',重装:'defender',辅助:'supporter'};
const ELEM={灼热:'heat',电磁:'electric',寒冷:'cold',自然:'nature',物理:'physical'};
const WT={单手剑:'sword',施术单元:'arts',双手剑:'greatsword',长柄武器:'polearm',手铳:'pistol'};
const ABIL={力量:'str',敏捷:'agi',智识:'int',意志:'will'};
const report={rows:{},unmapped:[],ambiguousElement:[]};

// ---------- skill table row classification ----------
function classifyRow(name,values){
  const n=norm(name); const isPct=values.some(v=>String(v).includes('%'));
  if(/冷却时间/.test(n)) return {kind:'param',key:'cooldown'};
  if(/^(技力消耗|消耗技力)$/.test(n)) return {kind:'param',key:'spCost'};
  if(/所需终结技能量|消耗能量/.test(n)) return {kind:'param',key:'energyCost'};
  if(/(返还|恢复)技力|技力(返还|恢复)/.test(n)&&!/上限/.test(n)) return {kind:'param',key:'spRefund',sub:n};
  if(/终结技能量/.test(n)) return {kind:'param',key:'energyGain',sub:n};
  if(/失衡值/.test(n)) return {kind:'param',key:'poise',sub:n};
  if(/持续时间|时长|间隔|存在时间|冷却/.test(n)) return {kind:'param',key:'duration',sub:n};
  if(/治疗|护盾|庇护/.test(n)) return {kind:'param',key:'heal',sub:n};
  if(/脆弱|增幅|虚弱|缓速|攻击力提升|暴击|伤害提升|伤害提高|提高倍率|伤害额外提升|伤害记录比例|概率|数量|次数|层数|范围|比例|加速/.test(n)) return {kind:'param',key:'modifier',sub:n};
  if(/倍率|伤害/.test(n)&&isPct) return {kind:'segment',per:/每层|每消耗|每级|每处|每次|每点|消耗每/.test(n)?'unit':undefined};
  return {kind:'unknown'};
}
const STD_NORMAL=[/普攻第一段倍率/,/普攻第二段倍率/,/普攻第三段倍率/,/普攻第四段倍率/,/普攻第五段倍率/,/处决攻击倍率/,/下落攻击倍率/];
const ELEM_RE=/(寒冷|灼热|电磁|自然|物理)(?:属性)?伤害/g;
function inferElements(desc){ const found=[]; for(const m of (desc||'').matchAll(ELEM_RE)){ const e=ELEM[m[1]]; if(!found.includes(e)) found.push(e); } return found; }
function buildSkill(s,sType,opElem,opName){
  const table=s.table||{}; const segments=[],params={},rawRows=[];
  const mentioned=inferElements(s.description); const skillElem=mentioned.length===1?mentioned[0]:(mentioned.length?null:opElem); const elemOrigin=mentioned.length===1?'description':(mentioned.length?'ambiguous':'operator');
  if(mentioned.length>1) report.ambiguousElement.push(`${sType}:${s.name}:${mentioned.join('/')}`);
  for(const [row,vals] of Object.entries(table)){ if(row==='header') continue; const c=classifyRow(row,vals); report.rows[norm(row)]=c.kind+(c.key?':'+c.key:''); const nums=vals.map(num); for(const cr of corrections.operatorSkillRows){ if(cr.operator===opName&&cr.skillType===s.type&&norm(cr.row)===norm(row)&&nums[cr.index]===cr.official){ nums[cr.index]=cr.corrected; appliedCorrections.push(`${opName}/${s.name}/${row}[${cr.index}] ${cr.official}→${cr.corrected}`); } }
    if(c.kind==='segment'){ let el=skillElem, eo=elemOrigin; if(mentioned.length>1){ const lab=row; const hit=Object.entries(ELEM).find(([cn])=>lab.includes(cn)); if(hit){ el=hit[1]; eo='label'; } else { el=mentioned[0]; eo='ambiguous'; } } if(!el){ el=opElem; eo='operator'; } segments.push({id:'',label:row.replace(/\s+/g,''),ratio:nums,element:el,elementOrigin:eo,kind:sType,...(c.per?{per:c.per}:{})}); }
    else if(c.kind==='param'){ (params[c.key]??=[]).push({label:row.replace(/\s+/g,''),values:nums,raw:vals}); }
    else { rawRows.push({label:row,values:vals}); report.unmapped.push(sType+':'+row); } }
  segments.forEach((seg,i)=>seg.id=`${sType}${i+1}`);
  return {name:s.name?.trim(),type:s.type,description:s.description,segments,params,rawRows};
}
const TYPEMAP={普通攻击:'normal',战技:'skill',连携技:'combo',终结技:'ultimate'};
const operators=[];
for(const o of sk.ops){ const alias=corrections.nameAliases[o.name]; const w=wf.ops.find(x=>norm(x.name)===norm(o.name)||(alias&&x.slug===alias)); const elem=ELEM[(o.tags['属性']||[])[0]]; if(!o.attributes||!o.skills.length){ report.unmapped.push('operator-no-data:'+o.name); continue; }
  const a90=w?.attributes.find(a=>a.level===90)?.attrs; const idx=o.attributes.header.indexOf('90级');
  const base90={hp:num(o.attributes['生命值'][idx-1]),atk:num(o.attributes['攻击力'][idx-1]),str:num(o.attributes['力量'][idx-1]),agi:num(o.attributes['敏捷'][idx-1]),int:num(o.attributes['智识'][idx-1]),will:num(o.attributes['意志'][idx-1])};
  const exact90=a90?{hp:a90[1],atk:a90[2],str:a90[39],agi:a90[40],int:a90[41],will:a90[42],critRate:a90[9],critDmg:a90[49],extra:{25:a90[25],12:a90[12],90:a90[90],15:a90[15]}}:null;
  // talent stat boosts (能力值提升) sum per ability
  const talentStats={}; for(const t of o.talents.filter(t=>t.category==='能力值提升')) for(const st of t.stages){ const m=st.description.match(/干员(.+?)能力值提升(\d+)/); if(m){ const abil=m[1].split(/和|、/).map(x=>ABIL[x.trim()]).filter(Boolean); for(const ab of abil) talentStats[ab]=(talentStats[ab]||0)+Number(m[2]); } }
  // skills: group by type; multiple same-type = modes (e.g. 诀)
  const byType={}; for(const s of o.skills){ const t=TYPEMAP[s.type]; if(!t){ report.unmapped.push('skilltype:'+o.name+':'+s.type); continue; } (byType[t]??=[]).push(buildSkill(s,t,elem,o.name)); }
  const skills={}, modes=[]; for(const [t,arr] of Object.entries(byType)){ skills[t]={...arr[0]}; if(arr.length>1){ skills[t].modeVariants=arr.map(a=>({...a})); } }
  operators.push({id:w?.id||('official_'+o.itemId),itemId:o.itemId,name:o.name,rarity:num((o.tags['星级']||[])[0]),profession:PROF[(o.tags['干员职业']||[])[0]],element:elem,weaponType:WT[(o.tags['武器']||[])[0]],mainAttr:ABIL[(o.tags['主能力']||[])[0]],subAttr:ABIL[(o.tags['副能力']||[])[0]],icon:`./assets/icons/operators/${o.itemId}.png`,base90,exact90,talentStats,skills,talents:o.talents.filter(t=>t.category==='干员天赋'||t.category===undefined&&t.name!=='装备适配').map(t=>({name:t.name,stages:t.stages})),potentials:o.potentials,source:{official:{itemId:o.itemId,url:`https://wiki.skland.com/endfield/detail?mainTypeId=1&subTypeId=1&gameEntryId=${o.itemId}&header=0`,fetchedAt:skIndex.fetchedAt},mined:w?{id:w.id,version:w.version,slug:w.slug}:null}});
}
// ---------- weapons ----------
function parseAttrText(t){ const s=norm(t); let m; if((m=s.match(/^(力量|敏捷|智识|意志)\+(\d+)$/))) return {stat:ABIL[m[1]],value:Number(m[2]),pct:false}; if((m=s.match(/^主能力值\+(\d+)$/))) return {stat:'main',value:Number(m[1]),pct:false}; if((m=s.match(/^攻击力\+([\d.]+)%$/))) return {stat:'atkPct',value:Number(m[1]),pct:true}; if((m=s.match(/^暴击率\+([\d.]+)%$/))) return {stat:'critRate',value:Number(m[1]),pct:true}; if((m=s.match(/^源石技艺强度\+(\d+)$/))) return {stat:'artsStrength',value:Number(m[1]),pct:false}; if((m=s.match(/^最大生命值\+([\d.]+)%$/))) return {stat:'hpPct',value:Number(m[1]),pct:true}; if((m=s.match(/^(寒冷|灼热|电磁|自然|物理|法术)伤害\+([\d.]+)%$/))) return {stat:'dmgBonus',element:m[1],value:Number(m[2]),pct:true}; if((m=s.match(/^治疗效率\+([\d.]+)%$/))) return {stat:'healEff',value:Number(m[1]),pct:true}; if((m=s.match(/^终结技充能效率\+([\d.]+)%$/))) return {stat:'chargeEff',value:Number(m[1]),pct:true}; return null; }
const weapons=[];
for(const o of sk.wps){ const w=wf.wps.find(x=>norm(x.name)===norm(o.name)); const atkIdx=o.baseAttack?.header.indexOf('90级'); const baseAtk90=o.baseAttack?num(o.baseAttack['基础攻击力'][atkIdx-1]):null; const mined90=w?.baseAtk.find(x=>x.lv===90)?.atk;
  const skills=o.skills.map((s,i)=>{ const ranks=s.ranks.map(r=>r.text); const attrs=ranks.map(parseAttrText); if(attrs.every(Boolean)&&attrs.every(a=>a.stat===attrs[0].stat)){ const values=attrs.map(a=>a.value); for(const cr of corrections.weaponAttrValues){ if(cr.weapon===o.name&&cr.skill===s.name&&values[cr.rank-1]===cr.official){ values[cr.rank-1]=cr.corrected; appliedCorrections.push(`${o.name}/${s.name} R${cr.rank} ${cr.official}→${cr.corrected}`); } } return {slot:i+1,name:s.name,kind:'attr',stat:attrs[0].stat,element:attrs[0].element,values}; } return {slot:i+1,name:s.name,kind:'passive',rankTexts:ranks,rankNumbers:ranks.map(t=>(t.match(/-?\d+(\.\d+)?/g)||[]).map(Number)),minedId:w?.skillIds?.[i]||null}; });
  if(mined90!=null&&baseAtk90!=null&&mined90!==baseAtk90) appliedCorrections.push(`${o.name}/基础攻击90 ${baseAtk90}→${mined90}`);
  weapons.push({id:w?.id||('official_'+o.itemId),itemId:o.itemId,name:o.name,type:WT[o.info['类型']]||WT[(o.tags['武器']||[])[0]],rarity:num((o.tags['星级']||[])[0]),icon:`./assets/icons/weapons/${o.itemId}.png`,baseAtk90:mined90??baseAtk90,baseAtk90Official:baseAtk90,baseAtk90Mined:mined90??null,skills,source:{official:{itemId:o.itemId,url:`https://wiki.skland.com/endfield/detail?mainTypeId=1&subTypeId=2&gameEntryId=${o.itemId}&header=0`,fetchedAt:skIndex.fetchedAt},mined:w?{id:w.id,version:w.version}:null}});
}
// ---------- gear (gold + 天灾防护 purple) ----------
const PACK={Str:'str',Agi:'agi',Wisd:'int',Will:'will',Main:'main',Sub:'sub',Atk:'atkFlat',MaxHp:'hp',CriticalRate:'critRate',AllDamageTakenScalar:'dmgTaken',NormalSkillDamageIncrease:'skillDmg',ComboSkillDamageIncrease:'comboDmg',UltimateSkillDamageIncrease:'ultDmg',AllSkillDamageIncrease:'allSkillDmg',NormalAttackDamageIncrease:'normalDmg',PhysicalDamageIncrease:'physicalDmg',SpellDamageIncrease:'artsDmg',CrystAndPulseDamageIncrease:'coldElecDmg',FireAndNaturalDamageIncrease:'heatNatureDmg',UltimateSpGainScalar:'chargeEff',DamageToBrokenUnitIncrease:'brokenDmg',PhysicalAndSpellInflictionEnhance:'artsStrength',HealOutputIncrease:'healEff'};
const SLOT={0:'armor',1:'gloves',2:'kit'}; const SLOTCN={护甲:'armor',护手:'gloves',配件:'kit'};
const gear=[]; const sets={}; const setIdByName={}; for(const x of wf.gear){ if(x.suit?.suitID&&x.suit?.suitName) setIdByName[norm(x.suit.suitName)]=x.suit.suitID; }
for(const o of sk.gear){ const q=(o.tags['品质']||[]).join(''); const setName=(o.tags['装备套组']||[])[0]||''; if(!(q.includes('金')||setName.includes('天灾防护'))) continue; const w=wf.gear.find(x=>norm(x.name)===norm(o.name));
  const attrs=o.refine.map((ref,i)=>{ const m=w?.equip?.displayAttrModifiers?.[i]; const isPct=ref.values[0].includes('%'); const display=ref.values.map(num); let values=display, origin='official'; if(m){ const mv=[m.attrValue,...m.enhancedAttrValues].map(v=>isPct?v*100:v); if(m.packAttrType==='AllDamageTakenScalar') values=mv.map(v=>100-v); else values=mv; origin='mined'; } return {name:ref.name,stat:m?PACK[m.packAttrType]||m.packAttrType:null,pct:isPct,values,display,origin}; });
  const setId=w?.equip?.suitID||setIdByName[norm(setName).replace('装备组','')]||('set_'+norm(setName)); if(o.set&&!sets[setId]) sets[setId]={id:setId,name:o.set.name.trim(),icon:o.set.icon,description:o.set.description,pieces:w?.suit?.equipCnt||3,quality:q.includes('金')?'gold':'purple'};
  let defv=num(o.attrs.find(a=>a.name==='防御力')?.value); const gd=corrections.gearDef.find(c=>c.gear===o.name&&c.official===defv); if(gd){ defv=gd.corrected; appliedCorrections.push(`${o.name}/防御 ${gd.official}→${gd.corrected}`); }
  gear.push({id:w?.id||('official_'+o.itemId),itemId:o.itemId,name:o.name,slot:w?SLOT[w.equip.partType]:SLOTCN[(o.tags['部位']||[])[0]],set:setId,setName:o.set?.name?.trim(),quality:q.includes('金')?'gold':'purple',level:o.level,def:defv,attrs,icon:`./assets/icons/gear/${o.itemId}.png`,source:{official:{itemId:o.itemId,url:`https://wiki.skland.com/endfield/detail?mainTypeId=1&subTypeId=4&gameEntryId=${o.itemId}&header=0`,fetchedAt:skIndex.fetchedAt},mined:w?{id:w.id,version:w.version}:null}}); }
// ---------- consumables (output-related) ----------
const consumables=sk.cons.filter(c=>c.effects.some(e=>/攻击力|伤害|暴击|充能|能力/.test(e)&&!/受到.*伤害降低|回复.*生命|恢复.*生命/.test(e))).map(c=>({id:'item_'+c.itemId,itemId:c.itemId,name:c.name,quality:c.quality,category:c.category,icon:`./assets/icons/consumables/${c.itemId}.png`,effectText:c.effects.filter(e=>!/自动|支援主控|恢复次数|不可作为|缘缘庄/.test(e)).join(' '),source:{official:{itemId:c.itemId,url:`https://wiki.skland.com/endfield/detail?mainTypeId=1&subTypeId=6&gameEntryId=${c.itemId}&header=0`,fetchedAt:skIndex.fetchedAt}}}));
fs.mkdirSync('dist/data',{recursive:true});
const meta={corrections:appliedCorrections,dataVersion:'2026-10-28.2',gameVersion:'1.6',officialFetchedAt:skIndex.fetchedAt,minedVersion:'1.6 (warfarin.wiki 2026-10-15)',counts:{operators:operators.length,weapons:weapons.length,gear:gear.length,sets:Object.keys(sets).length,consumables:consumables.length}};
const write=(name,val)=>fs.writeFileSync(`dist/data/${name}.js`,`// Generated by tools/build_data.mjs — do not edit.\nexport default ${JSON.stringify(val,null,0)};\n`);
write('operators',operators); write('weapons',weapons); write('gear',gear); write('sets',Object.values(sets)); write('consumables',consumables); write('meta',meta);
fs.writeFileSync('docs/build-report.json',JSON.stringify(report,null,1));
console.log(JSON.stringify(meta)); console.log('unmapped rows:',report.unmapped.length, report.unmapped.slice(0,40).join(' | ')); console.log('ambiguous element skills:',report.ambiguousElement.length, report.ambiguousElement.join(' | '));

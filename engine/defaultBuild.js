// 默认配装兜底：没有手选配装的干员用。套装按“这名干员能触发多少套装效果、效果多大”选，
// 件数按主副属性和元素词条选，武器按同类型最高星、词条对得上主副属性选。规则只看数据，不按角色名。
import {buildGraph} from './graph.js';
import {specFor} from './sim/triggers.js';
/* 只按百分比类效果计分；固定伤害、技力数这类不同量纲的不比大小 */
const ZONE_WEIGHT={bonus:1,atkPct:0.9,critRate:2,artsStrength:0.6,chargeEff:0.4,cdr:0.5,poise:0.15};
const ELEMENT_DMG={cold:'coldElecDmg',electric:'coldElecDmg',heat:'heatNatureDmg',nature:'heatNatureDmg',physical:'physicalDmg'};
/* 叠层效果按平均叠到六成算，不按满层 */
function magnitude(v){ if(!v) return 0; if(v.fixed!=null) return Math.abs(v.fixed); if(v.perStack!=null) return v.perStack*(v.maxStacks||1)*0.6; return 10; }
/* 效果对这名干员的可用度：常驻 1；自己能触发 0.8；全队任何人都能触发 0.6；靠异色附着才触发 0.5；只能靠队友触发 0.4；触发条件模拟器没建模 0.2；没人能触发 0 */
function feasibility(g,eff,op){
  const n=g.node('effect:'+eff.id); if(!n) return 0; if(!n.dynamic) return 1;
  const code=eff.condition?.trigger; const spec=code?specFor(code):null; if(spec?.specs?.some(s=>s.unmodeled)) return 0.2;
  const en=g.effectEnablers(eff.id,{wearer:op.id}); if(en.unknown) return 0.2; if(!en.enablers.length) return 0;
  const self=en.enablers.filter(p=>p.operator===op.id); if(self.some(p=>!p.derived)) return 0.8; if(en.enablers.some(p=>p.anyone)) return 0.6; if(self.length) return 0.5; return 0.4;
}
function setScore(g,op,setId,effects){ const parts=[]; for(const e of effects){ if(e.owner?.kind!=='gearSet'||e.owner.id!==setId) continue; const w=ZONE_WEIGHT[e.zone]||0; if(!w||(e.zone==='artsStrength'&&op.element==='physical')) continue; const f=feasibility(g,e,op); parts.push({effect:e.id,zone:e.zone,feasibility:f,score:w*magnitude(e.value)*f}); } return {score:parts.reduce((a,x)=>a+x.score,0),parts}; }
/* 每个套装对这名干员的得分（从高到低），给默认配装和核对用 */
export function rankSets(op,data,graph){ const g=graph||buildGraph(data); const ids=[...new Set(data.gear.map(x=>x.set))]; return ids.map(id=>({id,...setScore(g,op,id,data.effects)})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)); }
function attrWeights(op){ const arts=op.element!=='physical'; return {[op.mainAttr]:3,[op.subAttr]:1,main:3,sub:1,critRate:2,allSkillDmg:1.5,skillDmg:1,comboDmg:1,ultDmg:1,normalDmg:0.6,artsDmg:arts?1.2:0,physicalDmg:arts?0:1.5,[ELEMENT_DMG[op.element]]:1.5,artsStrength:arts?0.8:0,chargeEff:0.5,brokenDmg:0.3}; }
const byName=(a,b)=>a.name.localeCompare(b.name,'zh');
/* 同名装备有低阶版本，只在最高等级里选 */
function topTier(gear){ const lv=x=>Number(String(x.level||'').replace(/\D/g,''))||0; const max=Math.max(...gear.map(lv)); return gear.filter(x=>lv(x)===max); }
export function defaultBuildFor(op,data,graph){
  const g=graph||buildGraph(data); const {weapons,effects}=data; const gear=topTier(data.gear); const core=new Set([op.mainAttr,op.subAttr]);
  const weapon=weapons.filter(w=>w.type===op.weaponType).map(w=>({w,match:w.skills.filter(s=>s.kind==='attr'&&core.has(s.stat)).length})).sort((a,b)=>b.w.rarity-a.w.rarity||b.match-a.match||(b.w.baseAtk90||0)-(a.w.baseAtk90||0)||byName(a.w,b.w))[0]?.w||null;
  const wts=attrWeights(op); const score=it=>it.attrs.reduce((s,a)=>s+(wts[a.stat]||0),0); const best=items=>[...items].sort((a,b)=>score(b)-score(a)||byName(a,b))[0]||null;
  const bySet={}; for(const it of gear){ const s=bySet[it.set]||(bySet[it.set]={armor:[],gloves:[],kit:[]}); if(s[it.slot]) s[it.slot].push(it); }
  const ranked=rankSets(op,{gear,effects},g); const pick=ranked.map(r=>({...r,s:bySet[r.id]})).find(r=>r.s&&r.s.armor.length&&r.s.gloves.length&&r.s.kit.length);
  if(!pick||!weapon) return null;
  const kit1=best(pick.s.kit); const kit2=best(gear.filter(it=>it.slot==='kit'&&it.id!==kit1.id));
  return {weapon,gear:[best(pick.s.armor),best(pick.s.gloves),kit1,kit2],set:pick.id};
}

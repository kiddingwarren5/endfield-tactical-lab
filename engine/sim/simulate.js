// Discrete-event combat simulator (批次 6). Pure function: simulate(input) → {events, hits, errors, summary, samples}.
// Uses the phase-1 damage core for every hit. Resource/attachment rules: docs/rules.md §C; timing assumptions: dist/data/timing.js.
import {getStats} from '../stats.js';
import {calcSegment} from '../damage.js';
import {skillSegments,mechSegments,effectiveMode} from '../skills.js';
import {candidateEffects,resolveValue,triggerKindOf} from '../resolve.js';
import {effectApplies} from '../damage.js';
import {valueOf} from '../effects.js';
import {splitApplied,applyModifiers} from '../resolve.js';
import {specFor} from './triggers.js';
import {ownedEffects} from '../effects.js';

export const SIM_VERSION='0.1.0';
const EPS=1e-6;
const ABN={heat:'burn',electric:'conduct',cold:'freeze',nature:'corrosion'};
const ABN_MECH={burn:'burn',conduct:'conduct',freeze:'freeze',corrosion:'corrosion'};
const num=(x,rank)=>{ if(x==null) return null; if(typeof x==='number') return x; if(x.byRank) return x.byRank[Math.max(0,Math.min(x.byRank.length-1,(rank??12)-1))]; if(x.value!=null) return num(x.value,rank); if(x.fixed!=null) return x.fixed; if(x.self!=null) return num(x.self,rank); return null; };
const fml=(x,vars)=>{ if(x==null) return 0; if(typeof x==='number') return x; if(x.formula){ try{ return new Function(...Object.keys(vars),`return (${x.formula});`)(...Object.values(vars)); }catch{ return 0; } } return num(x)??0; };

// ---------- trigger matching: catalog condition text → sim event predicate (heuristic, see docs/sim-design.md) ----------
export function triggerSpecText(e){
  const t=(e.condition?.text||'')+' '+(e.condition?.trigger||''); const kind=triggerKindOf(e); const el=(t.match(/(寒冷|灼热|电磁|自然)/)||[])[1]; const elem={寒冷:'cold',灼热:'heat',电磁:'electric',自然:'nature'}[el];
  if(/配装即生效|3件套激活$|常驻/.test(t)&&!/后|时/.test(t)) return {on:'always'};
  if(/施放终结技|释放终结技/.test(t)) return {on:'cast',kind:'ultimate'};
  if(/施放连携技|释放连携技/.test(t)) return {on:'cast',kind:'combo'};
  if(/施放战技|释放战技/.test(t)&&!/附着/.test(t)) return {on:'cast',kind:'skill'};
  if(/造成连携技伤害|连携技命中|连携技.*命中/.test(t)) return {on:'hit',kind:'combo',targetHas:elem?{attach:elem}:null};
  if(/战技.*施加.*附着|通过战技施加/.test(t)) return {on:'attach',by:'skill',element:elem};
  if(/达到2层及以上法术附着|2层及以上/.test(t)) return {on:'attachLayers',min:2};
  if(/施加(导电|燃烧|冻结|腐蚀)/.test(t)) return {on:'abnormal',which:{导电:'conduct',燃烧:'burn',冻结:'freeze',腐蚀:'corrosion'}[t.match(/施加(导电|燃烧|冻结|腐蚀)/)[1]]};
  if(/消耗.*附着|消耗任何法术附着/.test(t)) return {on:'consume'};
  if(/重击/.test(t)) return {on:'heavy'};
  if(/施加增幅|施加.*脆弱|施加.*虚弱|施加.*庇护/.test(t)) return {on:'applyDebuffCategory'};
  if(/恢复技力|返还技力/.test(t)) return {on:'spGain'};
  if(/暴击/.test(t)) return {on:'crit'};
  return {on:'manual',kind};
}
// 效果的触发规格：优先用目录里的触发代码查触发表；没有代码的效果退回文本启发式
export function triggerSpec(e){ const s=specFor(e.condition?.trigger); if(s&&!s.unknown) return s.specs[0]; return triggerSpecText(e); }
export function specsOf(e){ const s=specFor(e.condition?.trigger); if(s&&!s.unknown) return {specs:s.specs,modeGate:s.modeGate,coded:true}; return {specs:[triggerSpecText(e)],modeGate:null,coded:false}; }

export function simulate(input){
  const {team,data,mechanics,timeline=[],timing,params={},enemy,critMode='never',options={},mainControl=0,initial={}}=input;
  const log=[],hits=[],errors=[],samples=[];
  const T=timing; const P={damageFactor:T.nonControl.default.damageFactor,rhythmFactor:T.nonControl.default.rhythmFactor,mainAutoNormal:true,duration:60,defaultHeavySpRefund:20,...params};
  const members=team.map((m,i)=>{ if(!m) return null; const op=data.operators.find(o=>o.id===m.operatorId); const base=mechanics.find(x=>x.operatorId===op.id)||{}; const stats0=getStats(m,data,{consumables:m.consumables,foodFlatMode:options.foodFlatMode}); const mode=effectiveMode(op,m,stats0); const modeMech=mode!=null?base.modes?.[mode]:null; const mech=modeMech?{...base,...Object.fromEntries(Object.entries(modeMech).filter(([k])=>['skill','combo','ultimate','normal'].includes(k)))}:base; /* 形态（如诀 智/意）覆盖技能机制 */ const stats=stats0; const restricted=(mech.ultimate?.buffs||[]).some(id=>/energySource/.test(id)); return {idx:i,member:{...m,mode},op,mech,stats,mode,energy:initial.energy?.[i]??0,energyMax:ultCost(op,m,data),cd:{combo:0,ultimate:0},busyUntil:0,normalIdx:0,nextNormalAt:0,skillStage:0,skillStageUntil:0,energySources:restricted?['ownSkill','ownCombo']:null}; });
  const alive=members.filter(Boolean);
  const S={notedCond:new Set(),t:0,sp:{real:initial.sp??T.spInitial,poison:initial.poisonSp??0},control:mainControl,attach:{},abnormal:{},buffs:[],comboReady:{},paused:false,pausedUntil:0};
  const cands=alive.map(mb=>candidateEffects({team,bIdx:mb.idx,data,consumablesOf:i=>team[i]?.consumables||[],mainControlIdx:mainControl}));
  const ownCands=alive.map(mb=>ownedEffects(data.effects||[],team[mb.idx],data,{consumables:team[mb.idx]?.consumables||[]}).map(o=>({effect:o.effect,ownerIdx:mb.idx,ownerMember:team[mb.idx],rank:o.rank,setCount:o.setCount})));
  const evq=[]; const push=(t,type,payload)=>{ evq.push({t,type,...payload}); };
  const addLog=(type,detail)=>{ log.push({t:round(S.t),type,...detail,sp:{real:round(S.sp.real),poison:round(S.sp.poison)},energy:alive.map(m=>round(m.energy)),control:S.control}); };
  // ---------- resources ----------
  function gainSp(amount,why,kind='real',meta=null){ const before=S.sp.real+S.sp.poison; const room=T.spMax-before; const g=Math.max(0,Math.min(amount,room)); if(kind==='poison') S.sp.poison+=g; else S.sp.real+=g; if(g<amount) addLog('spOverflow',{why,wasted:round(amount-g)}); addLog('spGain',{why,amount:round(g),kind}); if(meta?.source&&meta.who!=null) fireTrigger({on:'spGain',who:meta.who,source:meta.source,recover:meta.recover!==false,amount:g}); }
  function spendSp(cost,who){ const total=S.sp.real+S.sp.poison; if(total+EPS<cost) return null; let fromPoison=Math.min(S.sp.poison,cost); S.sp.poison-=fromPoison; let fromReal=cost-fromPoison; S.sp.real-=fromReal; addLog('spSpend',{who:who.op.name,cost,real:round(fromReal),poison:round(fromPoison)}); return {real:fromReal,poison:fromPoison}; }
  const PROF_CN={guard:'近卫',caster:'术师',assault:'突击',vanguard:'先锋',defender:'重装',supporter:'辅助'};
  // 接收者口径：自身面板效率 + 队友提供的充能效率（beneficiary team/others，含原文职业限定，如洁尔佩塔“近卫、术师和辅助”）+ 额外（阈值求解用）
  function chargeEff(mb){ let team=0; const k=alive.indexOf(mb); for(const c of cands[k]||[]){ const e=c.effect; if(e.zone!=='chargeEff'||e.beneficiary==='self'||c.ownerIdx===mb.idx||(e.condition?.mode||'auto')!=='auto') continue; const t=e.condition?.text||''; const profs=Object.values(PROF_CN).filter(p=>t.includes(p)); if(profs.length&&!profs.includes(PROF_CN[mb.op.profession])) continue; team+=valueOf(e,{rank:c.rank})||0; } return 1+((mb.stats.chargeEff||0)+team+(P.extraChargeEff?.[mb.idx]||0))/100; }
  function gainEnergy(mb,base,why,{affectedByEff=true,source}={}){ if(mb.energySources&&source&&!mb.energySources.includes(source)){ addLog('energyBlocked',{who:mb.op.name,why,base}); return; } const g=base*(affectedByEff?chargeEff(mb):1); const before=mb.energy; mb.energy=Math.min(mb.energyMax,mb.energy+g); if(before+g>mb.energyMax+EPS) addLog('energyOverflow',{who:mb.op.name,wasted:round(before+g-mb.energyMax)}); addLog('energyGain',{who:mb.op.name,why,amount:round(mb.energy-before)}); }
  // ---------- buffs ----------
  function activeBuffsFor(mb,seg,vars={}){ const out=[]; const activeIds={}; for(const b of S.buffs){ if(b.until<S.t-EPS) continue; const c=b.cand; activeIds[c.effect.id]=true; if(b.beneficiaryIdx!=null&&b.beneficiaryIdx!==mb.idx) continue; if(c.effect.beneficiary==='others'&&b.ownerIdx===mb.idx) continue; if(!effectApplies(c.effect,seg)) continue; if(Array.isArray(c.effect.modifies)&&c.effect.modifies.length&&!c.effect.fragileMultiplier) continue; out.push({effect:c.effect,value:b.value,label:c.effect.name,ownerIdx:b.ownerIdx,mode:'sim'}); }
    // 状态型效果（目录触发代码映射为 state）：结算时按当前状态判定，不走增益列表
    for(const c of cands[alive.indexOf(mb)]){ const e=c.effect; if((e.condition?.mode||'auto')==='auto') continue; const {specs,modeGate}=specsOf(e); const st=specs.find(sp=>sp.state&&!sp.on); if(!st) continue; if(activeIds[e.id]) continue; if(modeGate!=null&&members[c.ownerIdx]?.mode!==modeGate) continue; if(!modeOk(e,c.ownerIdx)) continue; if(!statePred(st,c.ownerIdx)) continue; if(Array.isArray(e.modifies)&&e.modifies.length&&!e.fragileMultiplier){ activeIds[e.id]=true; continue; } if(!effectApplies(e,seg)) continue; const {value}=resolveValue(c,{data,overrides:{},stacks:{},vars:{enemies:1,hits:1,...vars}}); activeIds[e.id]=true; out.push({effect:e,value,label:e.name,ownerIdx:c.ownerIdx,mode:'sim-state'}); }
    // teamUnique (长息/拓荒…): copies from several owners do not stack — keep the highest, as candidateEffects does for the static calculator
    const top={}; for(const a of out) if(a.effect.teamUnique&&!(top[a.effect.id]?.value>=a.value)) top[a.effect.id]=a; const kept=out.filter(a=>!a.effect.teamUnique||top[a.effect.id]===a);
    // a team-wide modifier sits in every member's candidate list; fold each (effect, owner) once
    const k=alive.indexOf(mb); const seen=new Set(); const pool=cands[k].concat(...alive.map((o,j)=>j===k?[]:cands[j])).filter(c=>{ const key=c.effect.id+'|'+c.ownerIdx; if(seen.has(key)) return false; seen.add(key); return true; });
    applyModifiers(kept,pool,activeIds,{data,overrides:{},stacks:{},vars:{}});
    const best={}; for(const a of kept){ const g=a.effect.exclusiveGroup; if(g&&!(best[g]?.value>=a.value)) best[g]=a; } return kept.filter(a=>!a.effect.exclusiveGroup||best[a.effect.exclusiveGroup]===a); /* 互斥组取最大（审核 #2） */ }
  const ONE=x=>Array.isArray(x)?x:[x];
  const ARTS_SET=['cold','heat','electric','nature'];
  function modeOkMech(){ return true; } // 形态专属的 mechanics 已由 modes[] 覆盖
  function modeOk(e,ownerIdx){ const t=(e.condition?.text||'')+' '+(e.literal||''); const want=/阵诀·智/.test(t)?0:/阵诀·意/.test(t)?1:null; if(want==null) return true; const owner=members[ownerIdx]; return owner?.mode==null||owner.mode===want; }
  // 演出暂停假设：演出期间新建的增益/附着/异常从演出结束起计时
  function t0(){ return T.ultimatePausesTimers?Math.max(S.t,S.pausedUntil||0):S.t; }
  // 形态门槛：代码前缀 intGeWill& / willGtInt& 按装备者面板智识/意志比较（审核：只有诀有 mode，其他装备者不能看 mode）
  function gateOk(gate,ownerIdx){ if(gate==null) return true; const ab=members[ownerIdx]?.stats?.abilities||{}; return gate===0?(ab.int??0)>=(ab.will??0):(ab.will??0)>(ab.int??0); }
  function targetHasFragile(element){ return S.buffs.some(b=>b.until>=S.t-EPS&&b.cand.effect.zone==='fragile'&&(b.beneficiaryIdx==null)&&(!element||(b.cand.effect.applies?.elements||[]).includes(element)||(element!=='physical'&&b.cand.effect.applies?.damageClass==='arts')||(element==='physical'&&b.cand.effect.applies?.damageClass==='physical'))); }
  // 状态型条件（结算时判定）
  function statePred(spec,ownerIdx,snap){ const name=typeof spec==='string'?spec:spec.state; const att=snap||S.attach; const frozen=snap?!!(snap.__abnormal?.freeze):!!(S.abnormal.freeze&&S.abnormal.freeze.until>=S.t-EPS); const cold=(att.cold?.layers||0)>0;
    switch(name){ case 'duringUltimate': { const u=members[ownerIdx]?.ultActiveUntil; return u!=null&&u>=S.t-EPS; } case 'targetFrozen': return frozen; case 'targetColdAttached': return cold&&!frozen; case 'targetColdOrFrozen': return cold||frozen; case 'targetStaggered': return !!staggered(); case 'modeInt': return members[ownerIdx]?.mode===0;
      case 'targetFragile': return targetHasFragile(spec.element); case 'targetAttached': return (S.attach[spec.element]?.layers||0)>0; case 'targetHpBelow': return S.t>=(P.targetHpBelowFrom??Infinity); case 'always': return true; case 'never': return false; default: return false; } }
  function specMatches(spec,ev,c){ if(!spec.on||spec.on!==ev.on) return false; const has=(v,x)=>v==null||ONE(v).includes(x);
    if(!has(spec.kind,ev.kind)) return false; if(spec.kinds&&!spec.kinds.includes(ev.kind)) return false;
    if(spec.element&&!(spec.element===ev.element||(ev.elements||[]).includes(spec.element))) return false; if(spec.elementIn&&!(spec.elementIn.includes(ev.element)||(ev.elements||[]).some(x=>spec.elementIn.includes(x)))) return false;
    if(spec.damageClass&&!(ev.damageClass===spec.damageClass||(spec.damageClass==='arts'&&(ev.elements||[]).some(x=>ARTS_SET.includes(x)))||(spec.damageClass==='physical'&&(ev.elements||[]).includes('physical')))) return false;
    if(spec.which&&spec.which!==ev.which) return false; if(spec.whichIn&&!spec.whichIn.includes(ev.which)) return false;
    if(spec.by&&spec.by!==ev.by) return false; if(spec.byIn&&!spec.byIn.includes(ev.by)) return false;
    if(spec.zone&&spec.zone!==ev.zone) return false; if(spec.zoneIn&&!spec.zoneIn.includes(ev.zone)) return false;
    if(spec.source&&spec.source!==ev.source) return false; if(spec.recover&&ev.recover===false) return false;
    if(spec.heavy&&!ev.heavy) return false; if(spec.infused&&!ev.infused) return false; if(spec.stage!=null&&ev.stage!==spec.stage) return false;
    if(spec.min&&!((ev.layers??ev.count??0)>=spec.min)) return false; if(spec.max!=null&&((ev.layers??ev.count??0)>spec.max)) return false;
    if(spec.targetHas?.attach&&!((ev.targetAttach||S.attach)[spec.targetHas.attach]?.layers>0)) return false;
    if(spec.targetHad?.abnormal&&!(ev.targetHad?.[spec.targetHad.abnormal])) return false;
    if(spec.toOthers&&!(ev.beneficiary==='team'||ev.beneficiary==='others')) return false;
    if(spec.receivedByOwner&&!(ev.beneficiary==='team'||(ev.beneficiary==='others'&&ev.applier!==c.ownerIdx)||(ev.beneficiary==='mainControl'&&S.control===c.ownerIdx)||ev.benIdx===c.ownerIdx)) return false;
    if(spec.state&&!statePred(spec,c.ownerIdx,ev.targetAttach?{...ev.targetAttach,__abnormal:ev.targetHad}:null)) return false;
    if(spec.ownerRecent){ const lc=S.lastCast[c.ownerIdx]?.[spec.ownerRecent.kind]; if(lc==null||S.t-lc>spec.ownerRecent.within+EPS) return false; }
    return true; }
  // 触发：遍历每名受益者的候选效果；匹配后按 once / 冷却 / 每次施放上限 / 累计阈值 / 延迟 处理，再开启增益（或即时效果）
  function fireTrigger(ev){ // ev: {on, kind, by, element(s), which, zone, source, who(idx), layers/count, heavy, control, targetAttach, targetHad, anyone, stage, beneficiary, applier, chain}
    alive.forEach((owner,k)=>{ for(const c of ownCands[k]){ const e=c.effect; if((e.condition?.mode||'auto')==='auto') continue; if(ev.chain?.includes(e.id)) continue; const {specs,modeGate}=specsOf(e); const spec=specs.find(sp=>specMatches(sp,ev,c)); if(!spec) continue;
        if(!gateOk(modeGate,c.ownerIdx)) continue; if(!modeOk(e,c.ownerIdx)) continue;
        const anyone=ev.anyone||spec.anyone; if(!anyone&&c.ownerIdx!==ev.who) continue; // 默认只认装备者/本人的动作；例外由规格 anyone 表达
        const key=e.id+'|'+c.ownerIdx;
        if(spec.once||e.oncePerBattle){ S.onceFired=S.onceFired||new Set(); if(S.onceFired.has(key)) continue; S.onceFired.add(key); }
        const cdn=spec.cooldown??e.cooldown; if(cdn){ const last=S.lastFire[key]; if(last!=null&&S.t-last<cdn-EPS) continue; S.lastFire[key]=S.t; }
        if(spec.maxPerCast){ const pk=c.ownerIdx+'|'+(spec.ownerRecent?.kind||'skill'); const m=S.perCast[pk]=S.perCast[pk]||{}; m[key]=(m[key]||0)+1; if(m[key]>spec.maxPerCast) continue; }
        if(spec.per){ const acc=S.accum[key]=(S.accum[key]||0)+(ev.amount||0); const n=Math.floor(acc/spec.per); if(n<1) continue; S.accum[key]=acc-n*spec.per; for(let i=0;i<n;i++) startBuff(c,null,ev,spec); continue; }
        if(spec.delay){ push(S.t+spec.delay,'delayedBuff',{cand:c,ben:null,ev,spec}); continue; }
        startBuff(c,null,ev,spec); } });
    // endOn：匹配到结束事件后立即移除（如梨诺姿态中止）
    S.buffs=S.buffs.filter(b=>{ const sp=b.spec; if(!sp?.endOn) return true; const hitEnd=ONE(sp.endOn).some(x=>specMatches(x,ev,b.cand)&&(ev.anyone||b.ownerIdx===ev.who)); if(hitEnd) addLog('buffEnd',{id:b.cand.effect.id,why:'endOn'}); return !hitEnd; });
  }
  // consumeOn：“下一次 X”类增益在该类技能全部段结算完后消耗（since<S.t 避免同刻触发同刻消耗）
  function consumeAfterHits(kind,ownerIdx){ S.buffs=S.buffs.filter(b=>{ const sp=b.spec; if(!sp?.consumeOn) return true; const hit=ONE(sp.consumeOn).some(x=>x.on==='cast'&&ONE(x.kind).includes(kind))&&(b.ownerIdx===ownerIdx||b.beneficiaryIdx===ownerIdx)&&b.since<S.t-EPS; if(hit) addLog('buffEnd',{id:b.cand.effect.id,why:'consumed'}); return !hit; }); }
  const INSTANT={spRefund:true,energyGain:true,cdr:true,poise:true};
  function startBuff(c,_ben,ev,spec){ const e=c.effect; const stacked=e.stacking==='stack'||e.stacking==='independent'||e.value?.perStack!=null; let {value}=resolveValue(c,{data,overrides:{},stacks:stacked?{[e.id]:1}:{},vars:{layers:ev?.layers??0,enemies:1,hits:ev?.hits??1}}); if(spec?.controlMul&&ev?.control) value*=spec.controlMul;
    if(INSTANT[e.zone]){ // 即时效果区：触发即结算，不作为增益挂起（审核 X10）
      const v=value||0; const owner=members[c.ownerIdx]; if(e.zone==='spRefund'&&v>0){ const recover=/恢复/.test((e.literal||'')+(e.name||'')); gainSp(v,`${owner?.op.name||''} ${e.name}`,recover?'real':'poison',{who:c.ownerIdx,source:'effect',recover}); }
      else if(e.zone==='energyGain'&&v>0){ const tg=e.beneficiary==='self'?[owner]:alive; for(const o of tg) if(o) gainEnergy(o,v,`${e.name}`,{affectedByEff:false,source:'effect'}); }
      else if(e.zone==='cdr'&&owner){ if(e.unit==='%') owner.cd.combo=S.t+Math.max(0,(owner.cd.combo-S.t)*(1-v/100)); else owner.cd.combo=Math.max(S.t,owner.cd.combo-v); addLog('cdr',{who:owner.op.name,effect:e.id,value:v,unit:e.unit}); }
      else if(e.zone==='poise'&&v>0) addPoise(v,e.name);
      addLog('instant',{id:e.id,name:e.name,value:round(value)}); return; }
    const dur=spec?.duration??e.duration??e.window??15; const base=t0(); const ben=e.beneficiary==='self'?c.ownerIdx:e.beneficiary==='target'||e.beneficiary==='team'||e.beneficiary==='others'?null:e.beneficiary==='mainControl'?S.control:c.ownerIdx;
    const addStacks=spec?.stacks||1; const maxSt=e.value?.maxStacks;
    const same=S.buffs.filter(b=>b.cand.effect.id===e.id&&b.ownerIdx===c.ownerIdx&&b.beneficiaryIdx===ben);
    if(e.stacking==='independent'&&maxSt){ // 每层独立计时：每层一条记录，满层顶掉最早的
      for(let i=0;i<addStacks;i++){ const cur=S.buffs.filter(b=>b.cand.effect.id===e.id&&b.ownerIdx===c.ownerIdx&&b.beneficiaryIdx===ben); if(cur.length>=maxSt){ const oldest=cur.reduce((a,b)=>a.until<=b.until?a:b); S.buffs.splice(S.buffs.indexOf(oldest),1); } S.buffs.push({cand:c,ownerIdx:c.ownerIdx,beneficiaryIdx:ben,value,stacks:1,until:base+dur,since:S.t,spec}); }
      addLog('buffStack',{id:e.id,name:e.name,layers:Math.min(maxSt,same.length+addStacks)}); emitApplied(e,c,ev,ben); return; }
    const existing=same[0];
    if(existing){ if(stacked){ existing.stacks=Math.min((maxSt||99),existing.stacks+addStacks); existing.value=valueOf(e,{rank:c.rank,stacks:existing.stacks}); if(spec?.controlMul&&ev?.control) existing.value*=spec.controlMul; } else existing.value=Math.max(existing.value,value); existing.until=base+dur; existing.spec=spec; addLog('buffRefresh',{id:e.id,until:round(existing.until),stacks:existing.stacks}); emitApplied(e,c,ev,ben); return; }
    const st=Math.min(maxSt||99,addStacks); S.buffs.push({cand:c,ownerIdx:c.ownerIdx,beneficiaryIdx:ben,value:stacked&&st>1?valueOf(e,{rank:c.rank,stacks:st}):value,stacks:st,until:base+dur,since:S.t,spec}); addLog('buffStart',{id:e.id,name:e.name,value:round(value),until:round(base+dur),owner:c.ownerMember&&data.operators.find(o=>o.id===c.ownerMember.operatorId)?.name}); emitApplied(e,c,ev,ben); }
  // 施加增幅/脆弱/易伤后的二级触发：带属性、伤害类别、受益者信息（审核 X3）
  function emitApplied(e,c,ev,ben){ if(e.zone==='amp'||e.zone==='fragile'||e.zone==='vulnerable') fireTrigger({on:'applyDebuffCategory',who:c.ownerIdx,applier:c.ownerIdx,zone:e.zone,by:ev?.by||ev?.kind,elements:e.applies?.elements||[],damageClass:e.applies?.damageClass,beneficiary:e.beneficiary,benIdx:ben,chain:[...(ev?.chain||[]),e.id]}); }
  function permanentBuffs(){ const seen=new Set(); alive.forEach((mb,k)=>{ for(const c of cands[k]){ const e=c.effect; if((e.condition?.mode||'auto')!=='auto') continue; if(!modeOk(e,c.ownerIdx)) continue; const key=e.id+'|'+c.ownerIdx; if(seen.has(key)) continue; seen.add(key); if(Array.isArray(e.modifies)&&e.modifies.length&&!e.fragileMultiplier) continue; const {value}=resolveValue(c,{data,overrides:{},stacks:{},vars:{}}); S.buffs.push({cand:c,ownerIdx:c.ownerIdx,beneficiaryIdx:e.beneficiary==='self'?c.ownerIdx:null,value,stacks:1,until:Infinity,since:0}); } }); }
  // ---------- attachments / abnormal ----------
  const ARTS=['cold','heat','electric','nature'];
  function applyAttach(element,layers,byIdx,viaKind){ const mb=members[byIdx];
    if(!ARTS.includes(element)&&element!=='same'){ // 破防 / 源石结晶不是法术附着：破防计层并发事件；结晶未建模
      if(element==='breach'){ const before=S.breach||0; S.breach=Math.min(4,before+(layers||1)); addLog('breach',{layers:S.breach,by:mb.op.name,via:viaKind}); fireTrigger({on:'breach',who:byIdx,layers:S.breach,by:viaKind}); checkCombos({type:'breach'}); return; }
      if(!S.notedCond.has('attach:'+element)){ S.notedCond.add('attach:'+element); addLog('note',{message:`${mb.op.name} 施加“${element}”：非法术附着，未建模`}); } return; }
    if(element==='same'){ /* “再次施加该法术附着”：沿用目标身上现有的法术附着属性 */ const cur=Object.entries(S.attach).filter(([,a])=>a.layers>0).sort((a,b)=>b[1].layers-a[1].layers)[0]; if(!cur){ addLog('note',{message:`${mb.op.name} 再次施加附着：目标无法术附着，未生效`}); return; } element=cur[0]; } const cur=S.attach[element]; const others=Object.keys(S.attach).filter(k=>k!==element&&S.attach[k].layers>0);
    if(others.length){ const consumed=others.reduce((a,k)=>a+S.attach[k].layers,0); for(const k of others) delete S.attach[k]; const level=Math.min(4,consumed); const abn=ABN[element]; S.abnormal[abn]={level,since:S.t,until:S.t+(abn==='burn'?10:abn==='corrosion'?15:abn==='conduct'?[12,18,24,30][level-1]:[5.75,6.75,7.75,8.75][level-1])}; addLog('abnormal',{which:abn,level,by:mb.op.name,consumed}); mechHit(byIdx,ABN_MECH[abn],level,element); if(abn==='burn'){ for(let i=1;i<=10;i++) push(S.t+i,'burnTick',{by:byIdx,level}); } fireTrigger({on:'abnormal',which:abn,who:byIdx,by:viaKind}); fireTrigger({on:'consume',who:byIdx,layers:consumed,by:viaKind}); S.lastConsumed={layers:consumed,t:S.t}; checkCombos({type:'abnormal',which:abn}); for(const k of others) checkCombos({type:'attachConsumed',element:k,layers:consumed}); }
    const before=cur?.layers||0; const after=Math.min(4,before+layers); S.attach[element]={layers:after,until:t0()+T.attachDurationSeconds}; addLog('attach',{element,layers:after,by:mb.op.name,via:viaKind});
    if(before>0){ push(S.t+T.burstDelaySeconds,'burst',{element,by:byIdx,via:viaKind}); }
    fireTrigger({on:'attach',by:viaKind,element,who:byIdx}); fireTrigger({on:'attachLayers',layers:after,who:byIdx,element});
    checkCombos({type:'attachApplied',element,layers:after}); }
  function consumeAttach(element,all=true,n=0){ const cur=S.attach[element]; if(!cur||cur.layers<=0) return 0; const c=all?cur.layers:Math.min(n,cur.layers); cur.layers-=c; if(cur.layers<=0) delete S.attach[element]; addLog('consume',{element,layers:c}); S.lastConsumed={layers:Math.max(c,(S.lastConsumed&&S.t-S.lastConsumed.t<0.01)?S.lastConsumed.layers:0),t:S.t}; checkCombos({type:'attachConsumed',element,layers:c}); return c; }
  function mechHit(byIdx,mechId,level,element){ const mb=members[byIdx]; const m=mechSegments(element).find(x=>x.id===mechId); if(!m) return; const seg={...m,element:mechId==='artsBurst'?element:m.element,ratio:[m.base*(m.scale?1+level:1)],skillKey:'mech'}; doHit(mb,seg,12,{abnormal:level},'mech'); }
  // ---------- hits ----------
  const statCache=new Map();
  const ABN_VULN=[12,16,20,24], COR_INIT=[3.6,4.8,6,7.2], COR_RATE=[0.84,1.12,1.4,1.68], COR_CAP=[12,16,20,24]; // rules A5/A6（研究）
  function abnormalApplied(seg){ const out=[]; const c=S.abnormal.conduct; if(c&&c.until>=S.t-EPS&&seg.element!=='physical') out.push({effect:{id:'abn.conduct',name:`导电 ${c.level} 级 · 法术易伤`,zone:'vulnerable',applies:{damageClass:'arts'}},value:ABN_VULN[c.level-1],label:`导电 ${c.level} 级 · 法术易伤`,mode:'sim'}); const a=S.abnormal.armorBreak; if(a&&a.until>=S.t-EPS&&seg.element==='physical') out.push({effect:{id:'abn.armorBreak',name:`碎甲 ${a.level} 级 · 物理易伤`,zone:'vulnerable'},value:ABN_VULN[a.level-1],label:`碎甲 ${a.level} 级 · 物理易伤`,mode:'sim'}); return out; }
  function corrosionReduction(){ const c=S.abnormal.corrosion; if(!c||c.until<S.t-EPS) return 0; const lv=c.level-1; return Math.min(COR_CAP[lv],COR_INIT[lv]+COR_RATE[lv]*Math.max(0,S.t-(c.since??S.t))); }
  // 失衡/处决（可选，默认关闭：对照靶永不失衡）。enemy.staggerThreshold（失衡值上限）、enemy.staggerWindow（硬直秒，默认 6）、enemy.tier（处决回技力档）
  S.poise=0; S.staggerUntil=0; S.pendingExecute=false;
  function addPoise(v,why){ if(!enemy?.staggerThreshold||v<=0) return; if(S.staggerUntil>=S.t-EPS) return; S.poise+=v; if(S.poise>=enemy.staggerThreshold-EPS){ S.poise=0; S.staggerUntil=S.t+(enemy.staggerWindow??6); S.pendingExecute=true; addLog('stagger',{until:round(S.staggerUntil),why}); checkCombos({type:'stagger'}); } }
  function staggered(){ return enemy?.staggerThreshold&&S.staggerUntil>=S.t-EPS; }
  function enemyFor(seg){ const red=corrosionReduction(); if(!red) return enemy; const g=enemy?.resistances?.[seg.element]??'D'; const base=g==='custom'?(enemy?.custom?.[seg.element]??0):({D:0,C:20,B:50}[g]??0); return {...enemy,resistances:{...enemy.resistances,[seg.element]:'custom'},custom:{...(enemy.custom||{}),[seg.element]:base-red},corrosion:red}; }
  // 场景：敌人无敌/转阶段窗口（enemy.invulnerable=[[t0,t1],…]）内不结算伤害，但资源与增益照常
  function immuneNow(){ return (enemy?.invulnerable||[]).some(([a,b])=>S.t>=a-EPS&&S.t<=b+EPS); }
  function doHit(mb,seg,rank,vars,kindLabel,extraFactor=1){ if(immuneNow()){ if(!S.immuneNoted){ S.immuneNoted=true; addLog('note',{message:'敌人无敌窗口内的命中不计伤害（场景设定）'}); } return; } const all=activeBuffsFor(mb,seg,vars).concat(abnormalApplied(seg)); const {stat,dmg:applied}=splitApplied(all.map(a=>({...a,beneficiaryIdx:mb.idx}))); const selfAuto=new Set(mb.stats.trace.map(t=>t.why)); const extras=stat.filter(x=>!selfAuto.has(x.why)); let st=mb.stats; if(extras.length){ const key=mb.idx+'|'+extras.map(x=>x.id+':'+x.value).sort().join(','); st=statCache.get(key); if(!st){ st=getStats(mb.member,data,{consumables:mb.member.consumables,foodFlatMode:options.foodFlatMode,extraStats:extras}); statCache.set(key,st); } } const en=enemyFor(seg); const opt=staggered()?{...options,stagger:Math.max(options.stagger??0,(T.staggerMultiplier-1)*100)}:options; const r=calcSegment({stats:st,seg,rank,enemy:en,critMode,applied,vars,options:opt}); const dmg=r.damage*extraFactor;
    // 碎冰：对冻结目标造成物理伤害（施加破防/物理异常）→ 由打碎者触发碎冰（研究：倍率 120%×(1+冻结等级)，法术等级系数，物理伤害）
    if(seg.kind!=='mech'&&seg.element==='physical'&&S.abnormal.freeze&&S.abnormal.freeze.until>=S.t-EPS){ const lv=S.abnormal.freeze.level; delete S.abnormal.freeze; addLog('iceShatter',{by:mb.op.name,level:lv}); mechHit(mb.idx,'iceShatter',lv,'physical'); fireTrigger({on:'iceShatter',who:mb.idx}); } hits.push({t:round(S.t),member:mb.idx,name:mb.op.name,skill:seg.skillKey,segment:seg.id,label:seg.label,element:seg.element,kind:seg.kind,damage:dmg,factor:extraFactor,applied:applied.map(a=>({id:a.effect.id,name:a.label,value:round(a.value),zone:a.effect.zone,owner:a.ownerIdx})),factors:r.factors,buckets:r.buckets,attach:JSON.parse(JSON.stringify(S.attach)),sp:{real:round(S.sp.real),poison:round(S.sp.poison)},energy:alive.map(m=>round(m.energy))}); return dmg; }
  // ---------- combos ----------
  function trMet(tr,ev){ if(!tr) return false; const elOk=el=>!tr.element||tr.element==='any'||(Array.isArray(tr.element)?tr.element.includes(el):tr.element===el); switch(tr.type){ case 'attachLayers': { if(tr.element==='otherArts'){ /* 诀“2层及以上其他法术附着”：自然以外的法术附着 */ return ['cold','heat','electric'].some(el=>(S.attach[el]?.layers||0)>=(tr.min||1)); } return (S.attach[tr.element]?.layers||0)>=(tr.min||1); } case 'attachApplied': return ev?.type==='attachApplied'&&elOk(ev.element); case 'anyAttachApplied': return ev?.type==='attachApplied'; case 'attachConsumed': return ev?.type==='attachConsumed'&&elOk(ev.element); case 'burst': return ev?.type==='burst'; case 'abnormal': return ev?.type==='abnormal'; case 'heavyHit': return ev?.type==='heavyHit'; case 'allyCombo': return ev?.type==='allyCombo';
      case 'skillState': return ev?.type==='ownSkillCast'&&ev.who===tr._owner; /* 近似：自身战技施放后进入可连携状态（支援晶体/启示等状态机未建模） */
      case 'custom': { if(tr.event==='stagger') return ev?.type==='stagger'; if(tr.event==='abnormalConsumed') return ev?.type==='abnormalConsumed'||ev?.type==='iceShatter'; if(tr.requires){ if(ev?.type!=='attachApplied'&&ev?.type!=='breach') return false; return (!tr.requires.includes('breach')||(S.breach||0)>0)&&(!tr.requires.includes('anyArtsAttach')||Object.keys(S.attach).some(k=>ARTS_SET.includes(k)&&S.attach[k].layers>0)); } return false; /* controlledHit / enemyCharging / crystalConsumed：对照靶不攻击、不蓄力、无结晶 */ }
      default: return false; } }
  function comboTriggerMet(mb,ev){ const tr=mb.mech?.combo?.trigger; if(!tr) return false; tr._owner=mb.idx; for(const o of tr.or||[]) o._owner=mb.idx; if(ev?.type==='allyCombo'&&ev.who===mb.idx) return false; if(trMet(tr,ev)) return true; for(const o of tr.or||[]) if(trMet(o,ev)) return true; return false; } function _unused(tr){ switch(tr.type){ case 'attachLayers': return (S.attach[tr.element]?.layers||0)>=(tr.min||1); case 'attachApplied': return ev?.type==='attachApplied'&&(!tr.element||ev.element===tr.element); case 'anyAttachApplied': return ev?.type==='attachApplied'; case 'attachConsumed': return ev?.type==='attachConsumed'&&(!tr.element||tr.elements?.includes(ev.element)||ev.element===tr.element); case 'burst': return ev?.type==='burst'; case 'abnormal': return ev?.type==='abnormal'; case 'heavyHit': return ev?.type==='heavyHit'; case 'allyCombo': return ev?.type==='allyCombo'&&ev.who!==mb.idx; default: return false; } }
  function checkCombos(ev){ for(const mb of alive){ if(comboTriggerMet(mb,ev)){ const prev=S.comboReady[mb.idx]; S.comboReady[mb.idx]={until:S.t+T.comboWindowSeconds}; if(!prev||prev.until<S.t) addLog('comboReady',{who:mb.op.name,until:round(S.t+T.comboWindowSeconds)}); } } }
  // ---------- actions ----------
  function rankOf(mb,k){ return mb.member.skillRanks?.[k]??12; }
  // 条件伤害段：按标签判定（冻结/非冻结、终结技期间）；其余条件段（强化/追加/提前降下/集束打击/诀明等）默认不执行并记 note（技能状态机缺口，sim-design §5）
  const COND_RE=/强化|追加|额外(?!伤害倍率)|终结技期间|对冻结|对非冻结|破晦诀明|集束打击|空中|起跳|下落|处决|能量伤害|强力攻击|炸弹|手工作业|代言人/;
  function filterConditionalSegs(mb,segs){ const out=[]; const frozen=S.abnormal.freeze&&S.abnormal.freeze.until>=S.t-EPS; const ultOn=(mb.ultActiveUntil||0)>=S.t-EPS; for(const sg of segs){ if(sg.per){ out.push(sg); continue; } const L=sg.label||''; if(!COND_RE.test(L)){ out.push(sg); continue; } if(/对冻结/.test(L)){ if(frozen) out.push(sg); continue; } if(/对非冻结/.test(L)){ if(!frozen) out.push(sg); continue; } if(/终结技期间/.test(L)){ if(ultOn) out.push(sg); continue; } const key=mb.idx+'|'+L; if(!S.notedCond.has(key)){ S.notedCond.add(key); addLog('note',{message:`${mb.op.name} 条件伤害段“${L}”未建模，按不触发计（见 docs/sim-design.md §5）`}); } } return out; }
  // 终结技演出全队独占：演出期间任何人不能施放技能/连携/终结技（规则：演出暂停计时，timing.ultimatePausesTimers）
  function inUltAnimation(){ return T.ultimatePausesTimers&&S.pausedUntil>S.t+EPS; }
  function castSkill(mb,planned,probe=false){ const nope=msg=>probe?false:fail(planned,msg); if(inUltAnimation()) return nope(`终结技演出中（至 ${round(S.pausedUntil)}s）`); const mech=mb.mech.skill||{}; const rawChain=mech.replaces?.chain;
    // 祀/弭弗 chains start with the base skill (chain[0].next set); 梨诺/噗切娜 list only the replacement → prepend the base cast so the first cast pays the base cost
    const chain=rawChain&&!rawChain[0]?.next?[{name:mb.op.skills.skill?.name,spCost:mech.spCost,next:rawChain[0].name},...rawChain]:rawChain; if(chain&&S.t>mb.skillStageUntil) mb.skillStage=0; const stage=chain?chain[mb.skillStage%chain.length]:null; const cost=stage?(num(stage.spCost,rankOf(mb,'skill'))??100):(num(mech.spCost,rankOf(mb,'skill'))??mb.op.skills.skill?.params?.spCost?.[0]?.values?.[rankOf(mb,'skill')-1]??100); if(S.t<mb.busyUntil-EPS){ return nope(`${mb.op.name} 正在执行其他动作（至 ${round(mb.busyUntil)}s）`); } if(S.sp.real+S.sp.poison+EPS<cost) return nope(`技力不足：需要 ${cost}，当前 ${round(S.sp.real+S.sp.poison)}`); if(probe) return true;
    const paid=spendSp(cost,mb); if(!paid) return fail(planned,`技力不足：需要 ${cost}，当前 ${round(S.sp.real+S.sp.poison)}`);
    mb.busyUntil=S.t+T.castSeconds.skill; addLog('cast',{who:mb.op.name,kind:'skill',cost,stage:stage?.name,stageIndex:chain?chain.indexOf(stage):0}); S.lastCast[mb.idx]=S.lastCast[mb.idx]||{}; S.lastCast[mb.idx].skill=S.t; S.perCast[mb.idx+'|skill']={};
    runConsumes(mb,mech.consumes,'skill'); if(chain){ mb.skillStage=stage?.next?mb.skillStage+1:0; mb.skillStageUntil=S.t+(num(mech.replaces?.window)||20); }
    // 返还技力（毒技力）
    const refund=mech.spRefund?.per?0:(num(mech.spRefund?.value??mech.spRefund,rankOf(mb,'skill'))||0); if(refund&&!stage||refund&&stage&&mb.skillStage===1) gainSp(refund,`${mb.op.name} 战技${/恢复|recover/.test(mech.spRefund?.kind||'')?'恢复':'返还'}`,/恢复|recover/.test(mech.spRefund?.kind||'')?'real':'poison',{who:mb.idx,source:'selfSkill',recover:/恢复|recover/.test(mech.spRefund?.kind||'')});
    // 涡流（汤汤）：战技消耗场上涡流，每处返还技力并多形成一个水龙卷；水龙卷数量触发“形成 N 个水龙卷”
    let tornadoes=0; if(mech.spRefund?.per==='vortexConsumed'){ const vs=(S.vortex[mb.idx]||[]).filter(t=>t>=S.t-EPS); S.vortex[mb.idx]=[]; tornadoes=1+vs.length; if(vs.length){ let per=num(mech.spRefund.value,rankOf(mb,'skill'))||0; for(const c of cands[alive.indexOf(mb)]){ const e=c.effect; if(c.ownerIdx===mb.idx&&e.condition?.trigger==='skillConsumeVortex'&&e.zone==='spRefund'){ const v=e.value?.perStack??e.value?.fixed; if(typeof v==='number') per+=v; } } gainSp(per*vs.length,`${mb.op.name} 战技消耗 ${vs.length} 处涡流返还`,'poison',{who:mb.idx,source:'selfSkill',recover:false}); } push(S.t+T.castSeconds.skill*0.6+0.01,'tornado',{who:mb.idx,count:tornadoes,by:'skill'}); }
    if((mech.applies||[]).includes('root')) fireTrigger({on:'root',who:mb.idx,by:'skill'});
    { const k=alive.indexOf(mb); for(const c of cands[k]){ const e=c.effect; if(e.zone!=='spRefund'||c.ownerIdx!==mb.idx||e.owner?.potential==null||(e.condition?.mode||'auto')!=='auto') continue; if(!/战技/.test((e.condition?.text||'')+(e.literal||''))) continue; const v=e.value?.fixed; if(typeof v!=='number'||e.unit==='x'||e.unit==='%') continue; gainSp(v,`${mb.op.name} ${e.name}`,/恢复/.test(e.literal||'')?'real':'poison'); } }
    // 全队终结技能量：按真实消耗
    const base=T.skillEnergyPer100RealSp*paid.real/100; for(const o of alive) gainEnergy(o,base,`${mb.op.name} 战技（真实技力 ${round(paid.real)}）`,{source:'anySkill'}); const selfGain=num(mech.energyGain?.self?.value??mech.energyGain?.self,rankOf(mb,'skill')); if(selfGain) gainEnergy(mb,selfGain,`${mb.op.name} 战技自身回能`,{source:'ownSkill'});
    checkCombos({type:'ownSkillCast',who:mb.idx}); fireTrigger({on:'cast',kind:'skill',who:mb.idx,stage:chain?chain.indexOf(stage):0}); if(mech.recoverSp) gainSp(num(mech.recoverSp,rankOf(mb,'skill')),`${mb.op.name} 战技恢复技力`,'real');
    // hits at cast end
    let segs=filterConditionalSegs(mb,skillSegments(mb.op,'skill',mb.member.mode).filter(s=>!s.per));
    if(chain){ const names=chain.map(c=>c.name).filter(Boolean); const idx=chain.indexOf(stage); if(idx>0){ segs=segs.filter(sg=>stage.name&&sg.label.includes(stage.name)); } else { segs=segs.filter(sg=>!names.slice(1).some(n=>n&&sg.label.includes(n))); } }
    const atts=Array.isArray(mech.attach)?mech.attach:(mech.attach?[mech.attach]:[]); const primary=atts.find(a=>!/01号位|改为/.test(a.when||''))||atts[0]; const heavyBound=primary&&(/重击/.test(primary.when||'')||primary.when==='heavy');
    if(mech.extraSegmentPerConsumed&&tornadoes>1){ const s2=segs.find(x=>x.id===mech.extraSegmentPerConsumed); if(s2){ const extra=[]; for(let i=1;i<tornadoes;i++) extra.push(s2); push(S.t+T.castSeconds.skill*0.6+0.02,'skillHit',{who:mb.idx,kind:'skill',segs:extra,mech}); } }
    if(!heavyBound) push(S.t+T.castSeconds.skill*0.6,'skillHit',{who:mb.idx,kind:'skill',segs,mech});
    if(primary){ if(heavyBound) mb.pendingHeavyAttach={...primary,segs,until:S.t+(num(mech.duration)||15)}; else if(!stage||mb.skillStage===1) push(S.t+T.castSeconds.skill*0.6,'attach',{who:mb.idx,element:primary.element,layers:primary.layers||1,via:'skill'}); }
    return true; }
  // mechanics.consumes：战技/终结技消耗目标的法术附着（element）或法术异常（abnormal）
  function runConsumes(mb,cons,by){ for(const c of (Array.isArray(cons)?cons:(cons?[cons]:[]))){ if(c.element&&c.element!=='breach'&&c.element!=='originiumCrystal'){ const els=Array.isArray(c.element)?c.element:[c.element]; for(const el of els){ const n=consumeAttach(el,c.all!==false,c.layers||0); if(n>0) fireTrigger({on:'consume',who:mb.idx,layers:n,element:el,by}); } }
      if(c.abnormal){ for(const which of (Array.isArray(c.abnormal)?c.abnormal:[c.abnormal])){ const ab=S.abnormal[which]; if(ab&&ab.until>=S.t-EPS){ delete S.abnormal[which]; addLog('consumeAbnormal',{which,by:mb.op.name,via:by}); fireTrigger({on:'consumeAbnormal',who:mb.idx,which,by}); checkCombos({type:'abnormalConsumed',which}); } } } } }
  function castCombo(mb,planned,probe=false){ const nope=msg=>probe?false:fail(planned,msg); if(inUltAnimation()) return nope(`终结技演出中（至 ${round(S.pausedUntil)}s）`); const mech=mb.mech.combo||{}; const ready=S.comboReady[mb.idx]; if(!ready||ready.until<S.t-EPS) return nope(`${mb.op.name} 连携未触发（条件未满足或窗口已过）`); if(mb.cd.combo>S.t+EPS) return nope(`${mb.op.name} 连携冷却中（至 ${round(mb.cd.combo)}s）`); if(S.t<mb.busyUntil-EPS) return nope(`${mb.op.name} 正在执行其他动作`); if(probe) return true;
    delete S.comboReady[mb.idx]; let cd=num(mech.cooldown,rankOf(mb,'combo'))??mb.op.skills.combo?.params?.cooldown?.[0]?.values?.[rankOf(mb,'combo')-1]??15; const k=alive.indexOf(mb); for(const c of cands[k]){ const e=c.effect; if(e.zone!=='cdr'||c.ownerIdx!==mb.idx||(e.condition?.mode||'auto')!=='auto') continue; const v=valueOf(e,{rank:c.rank}); if(e.unit==='%') cd=cd*(1-v/100); else if(e.unit==='x') cd=cd/v; else cd=Math.max(0,cd-v); addLog('cdr',{who:mb.op.name,effect:e.id,value:v,unit:e.unit}); } mb.cd.combo=S.t+cd; mb.busyUntil=S.t+T.castSeconds.combo; addLog('cast',{who:mb.op.name,kind:'combo',cooldownUntil:round(mb.cd.combo)}); S.lastCast[mb.idx]=S.lastCast[mb.idx]||{}; S.lastCast[mb.idx].combo=S.t;
    { const sr=mech.spRefund; if(sr&&!sr.condition){ let v=0; if(Array.isArray(sr.perHit)) v=sr.perHit.reduce((a,b)=>a+b,0); else if(sr.perHit&&sr.hits) v=(num(sr.value)||0)*sr.hits; else v=num(sr.value??sr,rankOf(mb,'combo'))||0; if(v>0){ const recover=/恢复/.test(sr.kind||''); gainSp(v,`${mb.op.name} 连携${recover?'恢复':'返还'}技力`,recover?'real':'poison',{who:mb.idx,source:'selfSkill',recover}); } } } if(mech.creates?.resource==='涡流'){ const vs=(S.vortex[mb.idx]||[]).filter(t=>t>=S.t-EPS); vs.push(t0()+(mech.creates.duration||30)); S.vortex[mb.idx]=vs.slice(-(mech.creates.max||2)); addLog('vortex',{who:mb.op.name,count:S.vortex[mb.idx].length}); }
    fireTrigger({on:'cast',kind:'combo',who:mb.idx});
    const attachAtCast=Object.fromEntries(Object.entries(S.attach).map(([el,a])=>[el,{layers:a.layers}])); const abnormalAtCast=Object.fromEntries(Object.entries(S.abnormal).filter(([,a])=>a.until>=S.t-EPS).map(([k])=>[k,true])); // the sim consumes at cast; hit triggers (“命中寒冷附着的敌人”) must see the pre-consumption target
    let layers=0; const cons=Array.isArray(mech.consumes)?mech.consumes:(mech.consumes?[mech.consumes]:[]); for(const c of cons){ if(!c.element) continue; layers+=consumeAttach(c.element,c.all!==false,c.layers||0); }
    if(layers>0) fireTrigger({on:'consume',who:mb.idx,layers,element:cons[0]?.element,by:'combo'});
    if(layers===0&&mech.trigger?.type==='attachConsumed'&&S.lastConsumed&&S.t-S.lastConsumed.t<=T.comboWindowSeconds+EPS) layers=S.lastConsumed.layers; // 祀：按最近一次被消耗/吸收的最高层数
    const segs=filterConditionalSegs(mb,skillSegments(mb.op,'combo',mb.member.mode)); push(S.t+T.castSeconds.combo*0.6,'skillHit',{who:mb.idx,kind:'combo',segs,mech,layers,attachAtCast,abnormalAtCast});
    const gain=mech.energyGain?.self; const g=gain?.formula?fml(gain,{layers}):num(gain?.value??gain,rankOf(mb,'combo')); if(g) gainEnergy(mb,g,`${mb.op.name} 连携回能`,{source:'ownCombo'});
    const catt=Array.isArray(mech.attach)?mech.attach[0]:mech.attach; if(catt&&catt.element) push(S.t+T.castSeconds.combo*0.6,'attach',{who:mb.idx,element:catt.element,layers:catt.layers||1,via:'combo'});
    for(const o of alive) if(o.idx!==mb.idx) checkCombos({type:'allyCombo',who:mb.idx});
    return true; }
  function castUlt(mb,planned,probe=false){ const nope=msg=>probe?false:fail(planned,msg); if(inUltAnimation()) return nope(`终结技演出中（至 ${round(S.pausedUntil)}s）`); const mech=mb.mech.ultimate||{}; if(mb.energy+EPS<mb.energyMax) return nope(`${mb.op.name} 终结技能量不足：${round(mb.energy)}/${mb.energyMax}`); if(mb.cd.ultimate>S.t+EPS) return nope(`${mb.op.name} 终结技冷却中（至 ${round(mb.cd.ultimate)}s）`); if(S.t<mb.busyUntil-EPS) return nope(`${mb.op.name} 正在执行其他动作`); if(probe) return true;
    mb.energy=0; const cd=num(mech.cooldown,rankOf(mb,'ultimate'))??20; S.lastCast[mb.idx]=S.lastCast[mb.idx]||{}; S.lastCast[mb.idx].ultimate=S.t; mb.cd.ultimate=S.t+cd; mb.busyUntil=S.t+T.castSeconds.ultimate; if(T.ultimatePausesTimers){ const pause=Math.max(0,S.t+T.castSeconds.ultimate-Math.max(S.pausedUntil,S.t)); S.pausedUntil=Math.max(S.pausedUntil,S.t+T.castSeconds.ultimate); // 假设：演出期间增益/附着/异常/冷却/连携窗口计时全部暂停（timing.js ultimatePausesTimers）
      for(const b of S.buffs) if(isFinite(b.until)) b.until+=pause; for(const k of Object.keys(S.attach)) S.attach[k].until+=pause; for(const k of Object.keys(S.abnormal)){ S.abnormal[k].until+=pause; if(S.abnormal[k].since!=null) S.abnormal[k].since+=pause; } for(const k of Object.keys(S.comboReady)) S.comboReady[k].until+=pause; for(const o of alive){ if(o.cd.combo>S.t) o.cd.combo+=pause; if(o!==mb&&o.cd.ultimate>S.t) o.cd.ultimate+=pause; } addLog('pause',{seconds:round(pause),why:'终结技演出（假设）'}); } addLog('cast',{who:mb.op.name,kind:'ultimate',cooldownUntil:round(mb.cd.ultimate)});
    fireTrigger({on:'cast',kind:'ultimate',who:mb.idx});
    { const k=alive.indexOf(mb); for(const c of cands[k]){ const e=c.effect; if(e.zone!=='cdr'||c.ownerIdx!==mb.idx) continue; const t=e.condition?.text||''; if(!/施放终结技|终结技.*后/.test(t)) continue; const v=valueOf(e,{rank:c.rank}); let targets=[]; if(/01号位/.test(t)) targets=[members[0]].filter(Boolean); else if(e.beneficiary==='self') targets=[mb]; else targets=alive; for(const tg of targets){ if(!tg) continue; const before=tg.cd.combo; if(e.unit==='%') tg.cd.combo=S.t+Math.max(0,(tg.cd.combo-S.t)*(1-v/100)); else tg.cd.combo=Math.max(S.t,tg.cd.combo-v); addLog('cdr',{who:tg.op.name,by:mb.op.name,effect:e.id,before:round(before),after:round(tg.cd.combo)}); } } }
    { const pd0=mb.op.skills.ultimate?.params?.duration?.[0]?.values?.[rankOf(mb,'ultimate')-1]; mb.ultActiveUntil=S.t+T.castSeconds.ultimate+(num(mech.duration)||(typeof pd0==='number'?pd0:12)); }
    { const sr=mech.spRefund; if(sr&&!sr.condition&&!sr.perHarass){ const v=num(sr.value??sr,rankOf(mb,'ultimate'))||0; if(v>0){ const recover=/恢复/.test(sr.kind||''); gainSp(v,`${mb.op.name} 终结技${recover?'恢复':'返还'}技力`,recover?'real':'poison',{who:mb.idx,source:'selfSkill',recover}); } } }
    for(const ab of (Array.isArray(mech.abnormal)?mech.abnormal:[])){ if(!ab.forced||!ABN_MECH[ab.type]) continue; if(!modeOkMech(mb,ab)) continue; const level=1; S.abnormal[ab.type]={level,since:S.t,until:S.t+(ab.duration||(ab.type==='burn'?10:ab.type==='corrosion'?15:ab.type==='conduct'?12:5.75))}; addLog('abnormal',{which:ab.type,level,by:mb.op.name,forced:true}); fireTrigger({on:'abnormal',which:ab.type,who:mb.idx,by:'ultimate'}); checkCombos({type:'abnormal'}); }
    runConsumes(mb,mech.consumes,'ultimate');
    for(const c of ownCands[alive.indexOf(mb)]){ const e=c.effect; if((e.condition?.mode||'auto')==='auto') continue; const {specs}=specsOf(e); if(!specs.some(sp=>sp.state==='duringUltimate')) continue; if(!modeOk(e,mb.idx)) continue; emitApplied(e,c,{by:'ultimate',kind:'ultimate'},e.beneficiary==='self'?mb.idx:null); } push(mb.ultActiveUntil,'ultimateEnd',{who:mb.idx}); if((mech.applies||[]).includes('root')) fireTrigger({on:'root',who:mb.idx,by:'ultimate'}); let segs=filterConditionalSegs(mb,skillSegments(mb.op,'ultimate',mb.member.mode)); const pd=mech.plungeDuringUlt; if(pd?.delayedSegment){ const late=segs.find(x=>x.id===pd.delayedSegment); segs=segs.filter(x=>x.id!==pd.delayedSegment&&x.id!==pd.earlyWaveSegment); if(late) push(mb.ultActiveUntil,'lateHit',{who:mb.idx,kind:'ultimate',segs:[late],mech}); } push(S.t+T.castSeconds.ultimate*0.8,'skillHit',{who:mb.idx,kind:'ultimate',segs,mech});
    const uatt=Array.isArray(mech.attach)?mech.attach[0]:mech.attach; if(uatt&&uatt.element) push(S.t+T.castSeconds.ultimate*0.8,'attach',{who:mb.idx,element:uatt.element,layers:uatt.layers||1,via:'ultimate'});
    if(mech.switchesControl) S.control=mb.idx; return true; }
  // 下落攻击（主控）：普攻段“下落攻击倍率”；若有队友终结技正在演化且定义了 plungeDuringUlt（汤汤呼风唤浪），则提前引爆：补附着、水龙卷伤害、巨浪改为提前版
  function castPlunge(mb,planned,probe=false){ const nope=msg=>probe?false:fail(planned,msg); if(inUltAnimation()) return nope(`终结技演出中（至 ${round(S.pausedUntil)}s）`); if(mb.idx!==S.control) return nope(`${mb.op.name} 不是主控，不能下落攻击`); if(S.t<mb.busyUntil-EPS) return nope(`${mb.op.name} 正在执行其他动作`); if(probe) return true;
    mb.busyUntil=S.t+T.castSeconds.plunge; mb.nextNormalAt=mb.busyUntil; addLog('cast',{who:mb.op.name,kind:'plunge'}); const pl=skillSegments(mb.op,'normal').find(x=>/下落/.test(x.label)); if(pl) doHit(mb,{...pl,skillKey:'normal'},rankOf(mb,'normal'),{},'normal');
    for(const o of alive){ const pd=o.mech.ultimate?.plungeDuringUlt; if(!pd||!((o.ultActiveUntil||0)>=S.t-EPS)) continue; o.ultActiveUntil=S.t; addLog('earlyWave',{who:o.op.name,by:mb.op.name}); if(pd.attach) push(S.t+0.3,'attach',{who:o.idx,element:pd.attach.element,layers:pd.attach.layers||1,via:'plunge'}); const segs=skillSegments(o.op,'skill',o.mode); fireTrigger({on:'earlyWave',who:o.idx}); const vs=(S.vortex[o.idx]||[]).filter(t=>t>=S.t-EPS); S.vortex[o.idx]=[]; const cnt=1+vs.length; fireTrigger({on:'tornado',who:o.idx,count:cnt}); const tor=segs.find(x=>x.id===pd.tornadoSegment); if(tor) for(let i=0;i<cnt;i++){ doHit(o,{...tor,skillKey:'skill'},rankOf(o,'skill'),{},'skill'); fireTrigger({on:'hit',kind:'skill',who:o.idx}); } const u=skillSegments(o.op,'ultimate',o.mode); const early=u.find(x=>x.id===pd.earlyWaveSegment); if(early){ doHit(o,{...early,skillKey:'ultimate'},rankOf(o,'ultimate'),{},'ultimate'); fireTrigger({on:'hit',kind:'ultimate',who:o.idx}); } evq.splice(0,evq.length,...evq.filter(e=>!((e.type==='lateHit'||e.type==='ultimateEnd')&&e.who===o.idx))); fireTrigger({on:'ultimateEnd',who:o.idx}); }
    return true; }
  function fail(planned,msg){ errors.push({t:round(S.t),action:planned,message:msg}); addLog('error',{message:msg}); return false; }
  // ---------- normal attacks ----------
  function normalSegs(mb){ return skillSegments(mb.op,'normal').filter(s=>!/处决|下落/.test(s.label)); }
  function normalHit(mb,isControl){ if(isControl&&S.pendingExecute&&staggered()){ S.pendingExecute=false; const ex=skillSegments(mb.op,'normal').find(x=>/处决/.test(x.label)); if(ex){ doHit(mb,ex,rankOf(mb,'normal'),{},'normal'); const tier=enemy?.tier||'normal'; const sp=mb.mech?.normal?.executeSp?.byEnemyTier?.[tier]??25; gainSp(sp,`${mb.op.name} 处决回技力（${tier}）`,'real',{who:mb.idx,source:'execute'}); addLog('execute',{who:mb.op.name,sp}); mb.nextNormalAt=S.t+T.castSeconds.execute; return; } }
    const segs=normalSegs(mb); if(!segs.length) return; const i=mb.normalIdx%segs.length; const seg=segs[i]; const heavy=i===segs.length-1; const factor=isControl?1:P.damageFactor;
    const temp=[]; if(heavy&&isControl) for(const o of alive){ if(!o.pendingHeavyAttach) continue; for(const c of cands[alive.indexOf(mb)]){ const e=c.effect; if(c.ownerIdx!==o.idx||e.condition?.trigger!=='infusedHeavyHit') continue; const {value}=resolveValue(c,{data,overrides:{},stacks:{},vars:{}}); const b={cand:c,ownerIdx:c.ownerIdx,beneficiaryIdx:mb.idx,value,stacks:1,until:S.t,since:S.t,temp:true}; S.buffs.push(b); temp.push(b); } }
    doHit(mb,seg,rankOf(mb,'normal'),{},'normal',factor); if(temp.length) S.buffs=S.buffs.filter(b=>!temp.includes(b)); addLog('normalHit',{who:mb.op.name,segment:seg.label,heavy,control:isControl}); fireTrigger({on:'hit',kind:'normal',who:mb.idx,heavy});
    if(heavy&&isControl) addPoise(mb.mech?.normal?.heavyPoise?.value||0,`${mb.op.name} 重击`);
    if(heavy) fireTrigger({on:'heavy',who:mb.idx,control:isControl});
    if(heavy&&isControl){ const hr=mb.mech?.normal?.heavySpRefund; const tbl=T.heavySpRefundByName?.values?.[mb.op.name]; const refund=hr?.value??tbl??P.defaultHeavySpRefund; if(refund) gainSp(refund,`${mb.op.name} 重击回技力`,'real',{who:mb.idx,source:'heavy'}); checkCombos({type:'heavyHit',who:mb.idx}); for(const o of alive) if(o.pendingHeavyAttach){ const a=o.pendingHeavyAttach; o.pendingHeavyAttach=null; if(a.until!=null&&a.until<S.t-EPS){ addLog('note',{message:`${o.op.name} 战技灌注已过期（${round(a.until)}s），本次重击未触发追击`}); continue; } for(const sg of a.segs||[]){ doHit(o,{...sg,skillKey:'skill'},rankOf(o,'skill'),{},'skill'); fireTrigger({on:'hit',kind:'skill',who:o.idx}); } applyAttach(a.element,a.layers||1,o.idx,'skill'); } } // “主控下次重击”: any main controller's heavy hit; credited to the skill's caster
    const durs=T.normalSegmentSeconds[mb.op.weaponType]||T.normalSegmentSeconds.sword; const d=(durs[i]??0.6)/(isControl?1:P.rhythmFactor); mb.normalIdx=(i+1)%segs.length; mb.nextNormalAt=S.t+d; }
  // ---------- main loop ----------
  S.vortex={}; S.lastCast={}; S.perCast={}; S.lastFire={}; S.accum={}; S.breach=0; permanentBuffs(); fireTrigger({on:'battleStart',anyone:true});
  const plan=[...timeline].sort((a,b)=>a.t-b.t); for(const a of plan) push(a.t,'planned',{action:a});
  // 顺序轴模式（input.sequence）：按顺序在“最早可行时刻”执行；支持 waitFor.attachLayers / minT / optional；等待超过 seqMaxWait 的步骤跳过（可选步静默，否则记 seqSkip）
  const SEQ=Array.isArray(input.sequence)?input.sequence:null; let seqIdx=0, seqWaitFrom=0; const scheduled=[]; const seqMaxWait=P.seqMaxWait??30;
  function seqFeasible(a){ const mb=members[a.member]; if(!mb) return false; if(a.minT!=null&&S.t<a.minT-EPS) return false; if(a.waitFor?.attachLayers){ const w=a.waitFor.attachLayers; if((S.attach[w.element]?.layers||0)<w.min) return false; } if(a.kind==='skill') return castSkill(mb,null,true); if(a.kind==='combo') return castCombo(mb,null,true); if(a.kind==='ultimate') return castUlt(mb,null,true); if(a.kind==='plunge') return castPlunge(mb,null,true); if(a.kind==='switch') return S.t>=mb.busyUntil-EPS; return false; }
  function trySequence(){ if(!SEQ) return; while(seqIdx<SEQ.length){ const a=SEQ[seqIdx]; if(seqFeasible(a)){ const mb=members[a.member]; const act={t:S.t,member:a.member,kind:a.kind,idx:seqIdx}; /* 精确时刻（不舍入）：回放时同一时刻先结算状态事件和普攻再执行计划动作，与解码一致 */ let ok=false; if(a.kind==='skill') ok=castSkill(mb,act); else if(a.kind==='combo') ok=castCombo(mb,act); else if(a.kind==='ultimate') ok=castUlt(mb,act); else if(a.kind==='plunge') ok=castPlunge(mb,act); else if(a.kind==='switch'){ S.control=a.member; mb.busyUntil=Math.max(mb.busyUntil,S.t+T.castSeconds.switch); addLog('switch',{to:mb.op.name}); ok=true; } if(ok) scheduled.push(act); seqIdx++; seqWaitFrom=S.t; continue; } if(S.t-seqWaitFrom>seqMaxWait-EPS){ if(!a.optional) addLog('seqSkip',{idx:seqIdx,member:a.member,kind:a.kind,message:`等待 ${seqMaxWait}s 仍不可执行，跳过`}); seqIdx++; seqWaitFrom=S.t; continue; } break; } }
  const horizon=P.duration; let lastT=0;
  while(true){
    // next event: planned/queued events or next normal attack
    let nextT=Infinity; for(const e of evq) nextT=Math.min(nextT,e.t); for(const mb of alive){ if(mb.busyUntil>S.t+EPS) nextT=Math.min(nextT,mb.busyUntil); else nextT=Math.min(nextT,Math.max(mb.nextNormalAt,S.t)); } if(SEQ&&seqIdx<SEQ.length) nextT=Math.min(nextT,S.t+(P.seqTick??0.1)); /* 顺序轴：按 0.1 s 网格尝试下一步 */
    if(nextT>horizon||!isFinite(nextT)) break;
    // advance time: SP regen (paused during ultimate animation)
    const dt=Math.max(0,nextT-S.t); if(dt>0){ const pausedFrom=Math.min(S.pausedUntil,nextT); const activeDt=Math.max(0,nextT-Math.max(S.t,pausedFrom)); const regenDt=S.t>=S.pausedUntil?dt:Math.max(0,nextT-S.pausedUntil); if(regenDt>0){ gainSp(T.spRegenPerSecond*regenDt,'自然回复','real'); } S.t=nextT; }
    // expire
    for(const k of Object.keys(S.attach)) if(S.attach[k].until<S.t-EPS){ delete S.attach[k]; addLog('attachExpire',{element:k}); }
    S.buffs=S.buffs.filter(b=>{ if(b.until<S.t-EPS){ addLog('buffEnd',{id:b.cand.effect.id}); return false; } return true; });
    for(const k of Object.keys(S.abnormal)) if(S.abnormal[k].until<S.t-EPS) delete S.abnormal[k];
    // process queued events at this time
    const dueAll=evq.filter(e=>e.t<=S.t+EPS).sort((a,b)=>a.t-b.t); const due=dueAll.filter(e=>e.type!=='planned'); const duePlanned=dueAll.filter(e=>e.type==='planned'); /* 同一时刻：先结算命中/附着等状态事件和普攻，再执行计划动作（与顺序轴解码一致） */ for(const e of due) evq.splice(evq.indexOf(e),1);
    for(const e of due){ const mb=members[e.who??e.action?.member]; switch(e.type){
      case 'lateHit': { for(const seg of e.segs){ doHit(mb,{...seg,skillKey:e.kind},rankOf(mb,e.kind),{},e.kind); fireTrigger({on:'hit',kind:e.kind,who:mb.idx}); } break; }
      case 'skillHit': { { const pr=mb.op.skills[e.kind]?.params?.poise?.[0]?.values?.[rankOf(mb,e.kind)-1]; if(pr) addPoise(pr,`${mb.op.name} ${e.kind}`); } for(const seg of e.segs){ const vars={layers:e.layers??0}; doHit(mb,{...seg,skillKey:e.kind},rankOf(mb,e.kind),vars,e.kind); fireTrigger({on:'hit',kind:e.kind,who:mb.idx,layers:e.layers??0,targetAttach:e.attachAtCast,targetHad:e.abnormalAtCast}); } consumeAfterHits(e.kind,mb.idx); break; } /* 每一段命中各触发一次（“每次命中”类效果按段叠层） */
      case 'tornado': { if(e.who!=null) fireTrigger({on:'tornado',who:e.who,count:e.count,by:e.by}); break; }
      case 'delayedBuff': { startBuff(e.cand,e.ben,e.ev,{...e.spec,delay:0}); break; }
      case 'ultimateEnd': { fireTrigger({on:'ultimateEnd',who:e.who}); break; }
      case 'attach': applyAttach(e.element,e.layers,e.who,e.via); break;
      case 'burnTick': { const b=S.abnormal.burn; if(b&&b.until>=S.t-EPS) mechHit(e.by,'burnTick',e.level,'heat'); break; }
      case 'burst': mechHit(e.by,'artsBurst',1,e.element); fireTrigger({on:'burst',who:e.by,element:e.element,by:e.via}); checkCombos({type:'burst'}); break;
    } }
    // normal attacks
    for(const mb of alive){ if(mb.busyUntil>S.t+EPS) continue; if(mb.nextNormalAt>S.t+EPS) continue; const isControl=mb.idx===S.control; if(isControl&&!P.mainAutoNormal){ mb.nextNormalAt=S.t+0.5; continue; } if(S.pausedUntil>S.t+EPS&&!isControl){ mb.nextNormalAt=S.pausedUntil; continue; } normalHit(mb,isControl); }
    for(const e of duePlanned){ evq.splice(evq.indexOf(e),1); const a=e.action; const m=members[a.member]; if(!m){ fail(a,'未知干员'); continue; } if(a.kind==='skill') castSkill(m,a); else if(a.kind==='combo') castCombo(m,a); else if(a.kind==='ultimate') castUlt(m,a); else if(a.kind==='plunge') castPlunge(m,a); else if(a.kind==='switch'){ S.control=a.member; m.busyUntil=Math.max(m.busyUntil,S.t+T.castSeconds.switch); addLog('switch',{to:m.op.name}); } else fail(a,'未知动作 '+a.kind); }
    trySequence();
    if(S.t-lastT>=0.5){ samples.push({t:round(S.t),sp:round(S.sp.real+S.sp.poison),poison:round(S.sp.poison),energy:alive.map(m=>round(m.energy)),attach:Object.fromEntries(Object.entries(S.attach).map(([k,v])=>[k,v.layers]))}); lastT=S.t; }
  }
  const total=hits.reduce((a,h)=>a+h.damage,0); const lastHit=hits.length?Math.max(...hits.map(h=>h.t)):0; const duration=P.duration;
  const perMember={}, perSkill={}; for(const h of hits){ perMember[h.name]=(perMember[h.name]||0)+h.damage; const k=`${h.name}·${h.skill}`; perSkill[k]=(perSkill[k]||0)+h.damage; }
  return {simVersion:SIM_VERSION,events:log,hits,errors,samples,scheduled,summary:{total,duration,lastHit,names:alive.map(m=>m.op.name),memberIdx:alive.map(m=>m.idx),dps:duration>0?total/duration:0,perMember,perSkill,ultsCast:log.filter(e=>e.type==='cast'&&e.kind==='ultimate').length,params:P,energyMax:alive.map(m=>m.energyMax),chargeEff:alive.map(m=>round((m.stats.chargeEff||0)+(P.extraChargeEff?.[m.idx]||0)))},final:{t:round(S.t),sp:S.sp,energy:alive.map(m=>round(m.energy)),control:S.control,cooldowns:alive.map(m=>({name:m.op.name,combo:round(m.cd.combo),ultimate:round(m.cd.ultimate)}))}};
  function ultCost(op,m,data){ const base=op.skills.ultimate?.params?.energyCost?.[0]?.values?.[(m.skillRanks?.ultimate??12)-1]??100; const red=(data.effects||[]).filter(e=>e.owner?.id===op.id&&e.zone==='energyCost'&&(e.owner.potential==null||e.owner.potential<=(m.potential||0))).reduce((a,e)=>a+(valueOf(e,{})||0),0); return Math.round(base*(1+red/100)); }
}
const round=x=>Math.round(x*1000)/1000;

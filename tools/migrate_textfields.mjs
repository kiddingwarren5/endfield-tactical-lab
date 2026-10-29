// 一次性数据迁移：把引擎里曾靠文本正则判断的信息写成数据字段。可重复运行（幂等）。
import fs from 'node:fs';
import operators from '../dist/data/operators.js'; import {skillSegments} from '../dist/engine/skills.js';
const COND_RE=/强化|追加|额外(?!伤害倍率)|终结技期间|对冻结|对非冻结|破晦诀明|集束打击|空中|起跳|下落|处决|能量伤害|强力攻击|炸弹|手工作业|代言人/;
const mj=JSON.parse(fs.readFileSync('sources/curated/skill-mechanics.json','utf8'));
const kindMap={'恢复':'recover','返还':'refund'};
const fixRefund=sr=>{ if(sr&&typeof sr==='object'&&sr.kind&&kindMap[sr.kind]) sr.kind=kindMap[sr.kind]; };
const planFor=(op,kind,mode)=>{ const segs=skillSegments(op,kind,mode); const plan=[]; for(const sg of segs){ const L=sg.label||''; if(sg.per){ plan.push({id:sg.id,times:1}); continue; } if(!COND_RE.test(L)){ plan.push({id:sg.id,times:1}); continue; } if(/对冻结/.test(L)) plan.push({id:sg.id,times:1,when:{targetFrozen:true}}); else if(/对非冻结/.test(L)) plan.push({id:sg.id,times:1,when:{targetFrozen:false}}); else if(/终结技期间/.test(L)) plan.push({id:sg.id,times:1,when:{duringUltimate:true}}); else plan.push({id:sg.id,times:0,when:{unmodeled:L}}); } return plan; };
let n=0;
for(const m of mj){ const op=operators.find(o=>o.id===m.operatorId); if(!op) continue;
  const visit=(def,kind)=>{ if(!def) return; for(const a of (Array.isArray(def.attach)?def.attach:(def.attach?[def.attach]:[]))){ if(a.bind) continue; if(/重击/.test(a.when||'')) a.bind='controlHeavy'; else if(/01号位|改为/.test(a.when||'')){ a.bind='slot1Element'; a.ifSlot1Element=a.element; } else a.bind='hit'; n++; } fixRefund(def.spRefund); fixRefund(def.heavySpRefund); for(const st of def.replaces?.chain||[]) fixRefund(st.spRefund); for(const r of (Array.isArray(def.replaces?.skill)?def.replaces.skill:[])) fixRefund(r.spRefund); };
  for(const kind of ['normal','skill','combo','ultimate']) visit(m[kind],kind); for(const md of m.modes||[]) for(const kind of ['skill','combo','ultimate']) visit(md[kind],kind);
  for(const kind of ['skill','combo','ultimate']){ if(!m[kind]) continue; if(!m[kind].segmentPlan||/^由原按标签/.test(m[kind].segmentPlanNote||'')){ m[kind].segmentPlan=planFor(op,kind,null); m[kind].segmentPlanNote='由原按标签判定的条件段规则迁移生成（2026-10-29）；times 0 + when.unmodeled 表示该段条件未建模、不执行'; } (m.modes||[]).forEach((md,i)=>{ if(md[kind]&&(!md[kind].segmentPlan||/^由原按标签/.test(md[kind].segmentPlanNote||''))){ md[kind].segmentPlan=planFor(op,kind,i); md[kind].segmentPlanNote='由原按标签判定的条件段规则迁移生成（2026-10-29）'; } }); }
  if(m.name==='祀'&&m.skill.ink&&!m.skill.ink.burstPoise) m.skill.ink.burstPoise={value:5,origin:'official',note:'参数表「笔意爆发失衡值」'};
}
fs.writeFileSync('sources/curated/skill-mechanics.json',JSON.stringify(mj,null,1)); console.log('mechanics: attach bind 标注',n);
let c=0; for(const f of fs.readdirSync('sources/curated').filter(x=>/^effects-.*\.json$/.test(x))){ const arr=JSON.parse(fs.readFileSync('sources/curated/'+f,'utf8')); for(const e of arr){ const t=(e.condition?.text||'')+' '+(e.literal||''); if(/阵诀·智/.test(t)&&e.condition.form!=='智'){ e.condition.form='智'; c++; } else if(/阵诀·意/.test(t)&&e.condition.form!=='意'){ e.condition.form='意'; c++; } if(e.zone==='spRefund'&&!e.spKind){ e.spKind=/恢复/.test((e.literal||'')+(e.name||''))?'recover':'refund'; c++; }
    if(e.id==='chr_0026_lastrite.pot5.spRefund'&&!e.condition.trigger){ e.condition.trigger='onSkillCast'; e.condition.mode='user'; c++; } if((e.id==='chr_0029_pograni.pot5.comboSp'||e.id==='chr_0033_camille.pot3.spMul')&&!e.condition.trigger){ e.condition.trigger='spRefundMultiplier'; e.condition.mode='user'; c++; } if(e.id==='chr_0036_jsspsi.talent1.comboCd'&&!e.condition.trigger){ e.condition.trigger='afterUltimateCast'; e.condition.mode='user'; c++; } }
  fs.writeFileSync('sources/curated/'+f,JSON.stringify(arr,null,1)); }
console.log('effects: 字段补充',c);

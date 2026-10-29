// 从解包 SkillData 生成每个干员的时序表 dist/data/timing-akedata.js 与 docs/datamine/timing.md（30 帧/秒）。
// 口径见生成的 docs/datamine/timing.md。用法：node tools/build_timing_akedata.mjs [--check]（--check 只比对，不一致时退出码 1）
import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'); const RAW=path.join(ROOT,'sources/raw/akedata'); const FPS=30;
const operators=(await import(ROOT+'/dist/data/operators.js')).default; const manifest=JSON.parse(fs.readFileSync(path.join(RAW,'manifest.json'))); const patch=JSON.parse(fs.readFileSync(path.join(RAW,'TableCfg/SkillPatchTable.json')));
const cache=new Map(); const skillFile=id=>{ if(cache.has(id)) return cache.get(id); const p=path.join(RAW,'Json/SkillData',id+'.json'); const d=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):null; cache.set(id,d); return d; };
// 文件名变体（弭弗 normalskill_1 / powerattack，洛茜 combo_1_skill，汤汤 ultimate_skill_1 等）；管理员 (男) 的文件是 chr_0002_endminm
const VARIANTS={normal_skill:['normal_skill','normalskill_1','normal_skill_1'],combo_skill:['combo_skill','combo_1_skill'],ultimate_skill:['ultimate_skill','ultimate_skill_1'],ultimate_skill2:['ultimate_skill2'],plunging_attack_end:['plunging_attack_end']};
const dataId=op=>op.id==='chr_0003_endminf_m'?'chr_0002_endminm':op.id;
const findSkill=(id,name)=>{ for(const v of VARIANTS[name]||[name]){ const d=skillFile(`${id}_${v}`); if(d) return {d,id:`${id}_${v}`}; } return null; };
const T=o=>String(o?.$type||'').split(',')[0].split('.').pop().split('+')[0];
function* walk(o,frame){ if(Array.isArray(o)){ for(const v of o) yield* walk(v,frame); return; } if(!o||typeof o!=='object') return; if('_startFrame' in o) frame={start:o._startFrame,end:o._endFrame}; const t=T(o); if(t) yield {t,o,frame}; for(const v of Object.values(o)) yield* walk(v,frame); }
const sec=f=>+(f/FPS).toFixed(3);
// 命中帧：本文件 DamageAction（Hp 单元）的起始帧，加上它生成的子技能（SpawnAbilityEntity.abilityEntitySkillId、LaunchProjectile 的 onHit/onReach 技能）里的命中帧（相对生成帧），最多跟两层
function hitFrames(d,depth=0){ const s=new Set(); for(const {t,o,frame} of walk(d.actionGroupData)){ if(!frame) continue; if(t==='DamageAction'&&(o.damageUnits||[]).some(u=>u.damageAttributeType==='Hp')) s.add(frame.start); if(depth<2){ const subs=[]; if(t==='SpawnAbilityEntity'&&o.abilityEntitySkillId) subs.push(o.abilityEntitySkillId); if(t==='LaunchProjectile'){ if(o.castSkillOnHit&&o.projectileSkillId) subs.push(o.projectileSkillId); if(o.castSkillOnReach&&o.skillIdOnReach) subs.push(o.skillIdOnReach); } for(const id of subs){ const sd=skillFile(id); if(sd) for(const f of hitFrames(sd,depth+1)) s.add(frame.start+f); } } } return [...s].sort((a,b)=>a-b); }
// 允许接下一动作的最早帧：只认"主动作"（普攻段、战技、连携、终结技），反击 / 阶段二 / 浮空之类的分支不算；不早于本文件首个命中帧；第 0 帧视为无
function allowFrame(d,id,pred){ const main=new RegExp(`^${id}_(attack\\d|normal_skill|normalskill_1|combo_skill|combo_1_skill|ultimate_skill|ultimate_skill_1|ultimate_skill2)$`); const own=hitFrames({actionGroupData:d.actionGroupData}); const floor=own.length?own[0]:0; let best=null; for(const {t,o,frame} of walk(d.actionGroupData)){ if(t!=='AllowNextSkillAction'||!frame||frame.start<=0||frame.start<floor) continue; const list=(o.allowedSkillIdList||[]).filter(x=>main.test(x)); if(!list.length||(pred&&!list.some(pred))) continue; if(best==null||frame.start<best) best=frame.start; } return best; }
function cutscene(d){ let end=null; for(const {t,frame} of walk(d.actionGroupData)) if(t==='UltimateTimeAction'&&frame) end=Math.max(end??0,frame.end); return end; }
function patchTop(id){ const b=patch[id]?.SkillPatchDataBundle; if(!b?.length) return null; const top=b[b.length-1]; return {level:top.level,costType:top.costType,costValue:top.costValue,coolDown:top.coolDown,blackboard:Object.fromEntries(top.blackboard.map(x=>[x.key,x.value]))}; }
// 普攻链：从 attack1 起沿 AllowNext 走（黎风是 1→2→3→5），每段时长 = 允许下一段的最早帧；最后一段 = 重击
function chain(id,prefix){ const first=skillFile(`${id}_${prefix}1`); if(!first) return null; const stages=[{name:`${prefix}1`,d:first}]; const seen=new Set([`${id}_${prefix}1`]); for(let guard=0;guard<8;guard++){ const cur=stages.at(-1); let next=null; for(const {t,o} of walk(cur.d.actionGroupData)){ if(t!=='AllowNextSkillAction') continue; const cand=(o.allowedSkillIdList||[]).find(x=>new RegExp(`^${id}_${prefix}\\d(_\\d)?$`).test(x)&&!seen.has(x)); if(cand){ next=cand; break; } } if(!next||!skillFile(next)) break; seen.add(next); stages.push({name:next.slice(id.length+1),d:skillFile(next)}); }
  const seconds=stages.map((s,i)=>{ const nextId=i+1<stages.length?`${id}_${stages[i+1].name}`:`${id}_${prefix}1`; const f=allowFrame(s.d,id,x=>x===nextId)??allowFrame(s.d,id); return sec(f??s.d.exclusiveFrame); }); return {names:stages.map(s=>s.name),seconds,hitFrames:stages.map(s=>hitFrames(s.d))}; }
const out={}; const rows=[];
for(const op of operators){ const id=dataId(op); const normal=chain(id,'attack'); if(!normal) continue;
  const castOf=name=>{ const f=findSkill(id,name); if(!f) return null; const d=f.d; const a=allowFrame(d,id); return {skillId:f.id,seconds:sec(a??d.exclusiveFrame),via:a!=null?'allowNext':'exclusive',exclusive:sec(d.exclusiveFrame),hitFrames:hitFrames(d),cutscene:cutscene(d)==null?null:sec(cutscene(d)),patch:patchTop(f.id)}; };
  const cast={skill:castOf('normal_skill'),combo:castOf('combo_skill'),ultimate:castOf('ultimate_skill'),ultimate2:castOf('ultimate_skill2'),plunge:castOf('plunging_attack_end')}; for(const k of Object.keys(cast)) if(!cast[k]) delete cast[k];
  // 终结技期间的强化普攻（莱万汀 ult_attackN、伊冯 ult_attackN_1、庄方宜 attackN_ult）
  let ultNormal=null; for(const pre of ['ult_attack','attack']){ const st=[]; for(let n=1;n<=6;n++){ const cands=pre==='ult_attack'?[`${id}_ult_attack${n}`,`${id}_ult_attack${n}_1`]:[`${id}_attack${n}_ult`]; const hit=cands.find(c=>skillFile(c)); if(!hit) break; st.push({name:hit.slice(id.length+1),d:skillFile(hit)}); } if(st.length){ ultNormal={names:st.map(s=>s.name),seconds:st.map(s=>sec(allowFrame(s.d,id)??s.d.exclusiveFrame)),hitFrames:st.map(s=>hitFrames(s.d))}; break; } }
  out[op.id]={name:op.name,weaponType:op.weaponType,normal:normal.seconds,normalNames:normal.names,normalHitFrames:normal.hitFrames,heavy:{kind:normal.names.at(-1),seconds:normal.seconds.at(-1)},ultNormal,cast};
  rows.push(`| ${op.name} | ${op.weaponType} | ${normal.names.map((n,i)=>`${n.replace('attack','')}:${normal.seconds[i]}`).join(' / ')} | ${cast.skill?`${cast.skill.seconds}${cast.skill.via==='exclusive'?'*':''}`:'-'} | ${cast.combo?`${cast.combo.seconds}${cast.combo.via==='exclusive'?'*':''}`:'-'} | ${cast.ultimate?`${cast.ultimate.seconds}${cast.ultimate.via==='exclusive'?'*':''}（演出 ${cast.ultimate.cutscene??'无'}）`:'-'} | ${cast.ultimate?(cast.ultimate.hitFrames.length?sec(cast.ultimate.hitFrames[0]):'无'):'-'} | ${ultNormal?ultNormal.seconds.join('/'):'-'} |`); }
const body='export default '+JSON.stringify({origin:'akedata',version:manifest.version,fps:FPS,byOperator:out},null,0)+';\n';
const header=`// 由 tools/build_timing_akedata.mjs 生成，勿手改。来源 ${manifest.source} 版本 ${manifest.version}（抓取 ${manifest.fetchedAt.slice(0,10)}）。口径见 docs/datamine/timing.md。\n`;
const md=[`# 解包时序表（${manifest.version}）`,`由 tools/build_timing_akedata.mjs 生成（勿手改）。单位秒，30 帧/秒。模拟器参数 \`timingSource:'akedata'\` 时启用，默认仍是 timing.js 的武器假设表。`,'',
'## 口径',
'- 普攻链：从 attack1 起沿 AllowNextSkillAction 走到下一段（黎风是 1→2→3→5），每段时长 = 允许下一段的最早帧；最后一段就是重击。`power_attack` 是蓄力重击变体，所有干员都有，不进链。',
'- 战技 / 连携 / 终结技的施放时长 = 允许接任一"主动作"（普攻段、战技、连携、终结技）的最早帧；只允许接反击 / 阶段二 / 浮空等分支的帧不算；没有则取 exclusiveFrame（表中带 *）。',
'- 命中帧 = 本文件伤害动作的起始帧，加上生成的子技能（区域实体、弹道）里的命中帧（相对生成帧，最多两层）；仍没有命中帧的技能，模拟器按默认表的比例估（战技 / 连携 60%，终结技 80%，基数是默认表施放时长）。',
'- 终结技演出 = UltimateTimeAction 结束帧；解包里没有这个动作的终结技，解包口径下不暂停全队（待验证，verification-needed）。',
'- 下落攻击：解包只有落地段（plunging_attack_start 是 50 s 的悬停态），模拟器仍按默认 2.0 s，防止把下落攻击当普攻连刷。',
'- 阶段链（弭弗三段、祀起墨 / 收笔、洛茜第二三段、梨诺收尾）仍按第一段时长；后续终结技（诀破晦诀明）用 ultimate2。强化普攻（ult_attack）段数与技能表不一致时退回武器表并记一条 note。',
'- 这些是配置帧，不含攻速加成、输入延迟、弹道飞行。',
'','| 干员 | 武器 | 普攻各段（段:秒） | 战技 | 连携 | 终结技（演出） | 终结技首个命中 | 强化普攻 |','|---|---|---|---|---|---|---|---|',...rows].join('\n')+'\n';
const outJs=path.join(ROOT,'dist/data/timing-akedata.js'), outMd=path.join(ROOT,'docs/datamine/timing.md');
if(process.argv.includes('--check')){ const same=fs.existsSync(outJs)&&fs.readFileSync(outJs,'utf8').split('\n').slice(1).join('\n')===body&&fs.existsSync(outMd)&&fs.readFileSync(outMd,'utf8')===md; console.log(same?'一致':'不一致'); process.exit(same?0:1); }
fs.mkdirSync(path.dirname(outMd),{recursive:true}); fs.writeFileSync(outJs,header+body); fs.writeFileSync(outMd,md);
console.log(`生成 ${Object.keys(out).length} 个干员 → dist/data/timing-akedata.js, docs/datamine/timing.md`);

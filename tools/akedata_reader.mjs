// 把解包的 SkillData / BuffData 摊平成可读的动作清单（markdown），供人工核对机制目录。
// 用法：node tools/akedata_reader.mjs <id前缀...> [--out docs/datamine]   例：node tools/akedata_reader.mjs chr_0026_lastrite wpn_claym_0013
// 原则：每个动作都出现在清单里（不认识的类型只打类型名），黑板键后面括号里是 SkillPatchTable 最高等级的值。
import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'); const RAW=path.join(ROOT,'sources/raw/akedata');
const argv=process.argv.slice(2); const outDir=argv.includes('--out')?argv[argv.indexOf('--out')+1]:null; const prefixes=argv.filter((a,i)=>!a.startsWith('--')&&argv[i-1]!=='--out');
const manifest=JSON.parse(fs.readFileSync(path.join(RAW,'manifest.json'))); const patch=JSON.parse(fs.readFileSync(path.join(RAW,'TableCfg/SkillPatchTable.json')));
const list=d=>fs.existsSync(path.join(RAW,'Json',d))?fs.readdirSync(path.join(RAW,'Json',d)).filter(f=>f.endsWith('.json')):[];
const load=(d,f)=>JSON.parse(fs.readFileSync(path.join(RAW,'Json',d,f)));
const T=o=>String(o?.$type||'').split(',')[0].split('.').pop().split('+')[0];
const num=v=>typeof v==='number'?+v.toFixed(4):v;
let patchBB={}; // 当前技能最高等级黑板
const bb=v=>{ if(v&&typeof v==='object'&&'useBlackboardKey' in v){ if(v.useBlackboardKey){ const k=v.blackboardKey; return k in patchBB?`@${k}(${num(patchBB[k])})`:`@${k}`; } return num(v.value); } return v; };
const tgt=t=>t?`${t.targetSource}${t.targetGroupKey?':'+t.targetGroupKey:''}`:'';
const assign=items=>(items||[]).map(a=>`${a.targetKey}=${a.useDirectValue?(a.directValueType==='Numeric'?a.numericValue:a.stringValue):'@'+a.inputValueKey}`).join(',');
const buffSel=s=>s?(s.checkType==='Tag'?`tag${JSON.stringify((s.tagQuery?.tags||[]).map(t=>t.tagId))}`:(s.buffIdList||[]).join('|')):'';
function line(a){ const t=T(a); switch(t){
  case 'DamageAction': return `Damage${a.alwaysNext?'':''} target=${tgt(a.targetSettings)} units=[`+(a.damageUnits||[]).map(u=>{ const calc=u.atkCalculation; const c=calc?.$type?`${T(calc)}(${bb(calc.atkScale)||bb(calc.value)||''})`:''; const procs=(u.damageProcessors||[]).map(p=>{ const m=p.modifier; return m?`${T(p)}:${p.modifyTargetSide||''} ${m.attributeType} ${m.formulaItem} ${bb(m.param)}`:`${T(p)} ${p.zoneName||''} ${bb(p.addition)??''}`.trim(); }); return `${u.damageType}/${u.damageAttributeType} scale=${bb(u.atkScale)}${c?' calc='+c:''}${u.simpleCalculation===false?' nonSimple':''} mask=${u.damageDecorateMask}${u.gainCost?' gainCost':''}${procs.length?' procs=['+procs.join('; ')+']':''}`; }).join(' | ')+']';
  case 'CreateBuffAction': return `CreateBuff [${(a.buffs||[]).map(b=>(b.readIdFromBlackboard?'@'+b.buffIdKey:b.buffId)+(b.assignItems?.length?'{'+assign(b.assignItems)+'}':'')).join(', ')}] → ${tgt(a.targetSettings)} count=${bb(a.count)}${a.asChildBuff?' child':''}`;
  case 'ObtainCostAction': return `ObtainCost ${a.costType} ${a.atbGainMethod||''} value=${bb(a.costValue)}×${bb(a.coefficient)} src=${a.atbSourceType||''}${a.atbOnlyMainChar?' onlyMain':''}${a.isPercentValue?' pct':''} → ${tgt(a.target)}`;
  case 'SpellInfliction': return `SpellInfliction ${a.inflictionType} → ${tgt(a.target)}${a.isExtra?' extra':''}`;
  case 'VulnerableAction': return `Vulnerable ${a.subType||''} rate=${bb(a.rate)} dur=${bb(a.duration)} child=${a.childBuffId||''} → ${tgt(a.target)}`;
  case 'SimpleCalcBBAction': return `BB ${a.key} = ${bb(a.value1)} ${a.operation} ${bb(a.value2)}`;
  case 'ModifyDynamicBlackboard': return `BB ${a.key} ${a.operation} ${a.directValue?bb(a.value):bb(a.value)} on ${tgt(a.calculationTarget)}`;
  case 'GetTargetBuffBBAdvanced': return `BB ${a.blackboardKey} ← ${buffSel(a.buffSettings)}.${a.desiredKey} of ${tgt(a.targetSettings)}`;
  case 'CheckBuffStackNumAdvanced': return `?BuffStack ${buffSel(a.buffSettings)} ${a.buffStackNumType||''} ${a.compareType} ${bb(a.value)} on ${tgt(a.checkTarget)}`;
  case 'CompareFloat': return `?${bb(a.valueA)} ${a.compare} ${bb(a.valueB)}`;
  case 'CheckMainCharacterCondition': return `?isMainChar ${tgt(a.checkTarget)}`;
  case 'CheckDamageDecorateMask': return `?decorateMask ${a.checkType} ${a.mask}`;
  case 'CheckTagMatch': return `?tag ${JSON.stringify(a)?.slice(0,80)}`;
  case 'SpawnAbilityEntity': return `Spawn ${a.abilityEntityId}${a.abilityEntitySkillId?' skill='+a.abilityEntitySkillId:''}${a.assignPairs?.length?' {'+assign(a.assignPairs)+'}':''}${a.overrideDuration?' dur='+bb(a.duration):''}`;
  case 'LaunchProjectile': return `Projectile ${a.projectileId}${a.castSkillOnHit?' onHit='+a.projectileSkillId:''}${a.castSkillOnReach?' onReach='+a.skillIdOnReach:''}${a.assignPairs?.length?' {'+assign(a.assignPairs)+'}':''}`;
  case 'AllowNextSkillAction': return `AllowNext [${(a.allowedSkillIdList||[]).join(',')}]`;
  case 'ComboCacheAction': return `ComboCache [${(a.mappingDataList||[]).map(m=>m.cmdType+'→'+m.skillId).join(',')}]`;
  case 'FinishBuffAdvanced': return `FinishBuff ${buffSel(a.buffSettings)}${a.finishAll?' all':''}${a.finishLayerCnt?' layers='+bb(a.finishLayerCnt):''}${a.isAbsorbed?' absorbed':''} on ${tgt(a.buffOwner)}`;
  case 'TimeDilationAction': return `TimeDilation ${a.layer} dur=${bb(a.duration)}${a.useCurveKey?' curve='+a.curveKey:''}`;
  case 'ChannelingAction': return `Channeling every ${a.triggerInterval}s max/target=${a.maxCountPerTarget}`;
  case 'AddTagAction': return `AddTag ${JSON.stringify(a.tags||a.tag||'').slice(0,60)}`;
  case 'InterruptAction': return `Interrupt → ${tgt(a.defender)}`;
  case 'PlayAnimationAction': return `Anim ${a.animName} dur=${a.duration}`;
  case 'RaiseTrainLevelEvent': return `TrainEvent ${bb(a.eventKey)}`;
  default: return t; } }
const PASSIVE=new Set(['EffectAction','PlaySoundAction','CameraImpulseAction','CharWeaponVisibleAction','HitStopAction','SelfRotateAction','VoiceTriggerAction','ShowHideActorAction','CustomRootMotionAction','EnemyHurtAnimAction','CharHurtAnimAction','DebugPrintAction','OverrideCameraFollowAction','CharWeaponAnimationAction','RayCastEffectAction','EnemyWarningAction','SetSuperArmorAction','NotifyCharPassiveUIAction','AddDynamicCcsAction','GetAITransDataAction','SendBattleSignalToLevel','MoveToAction','TeleportAction','BlowOffCharacterAction']);
function emit(actions,depth,out,frame){ let skipped={}; for(const a of actions||[]){ const t=T(a); if(PASSIVE.has(t)){ skipped[t]=(skipped[t]||0)+1; continue; } const pad='  '.repeat(depth);
  if(t==='IfElseAction'){ out.push(`${pad}${frame}If [${(a.conditionAction?.actionData||[]).map(line).join(' && ')}]`); emit(a.succeedActions?.actionData||a.succeedActions,depth+1,out,''); if((a.failActions?.actionData||a.failActions||[]).length){ out.push(`${pad}  else`); emit(a.failActions?.actionData||a.failActions,depth+1,out,''); } continue; }
  out.push(`${pad}${frame}${line(a)}`); frame='';
  for(const k of ['actionOnTick','succeedActions','failActions','onEndAction','actions']){ const sub=a[k]?.actionData||(Array.isArray(a[k])?a[k]:null); if(sub) emit(sub,depth+1,out,''); }
  if(a.damageUnits) for(const u of a.damageUnits) for(const k of ['onHitActions','hitActions']) if(u[k]?.actionData) emit(u[k].actionData,depth+1,out,''); }
  const s=Object.entries(skipped).map(([k,v])=>`${k}×${v}`).join(' '); if(s) out.push(`${'  '.repeat(depth)}${frame}(表现类: ${s})`); }
function skillDoc(f){ const d=load('SkillData',f); const id=d.skillId; const p=patch[id]?.SkillPatchDataBundle; patchBB={}; let lv=''; if(p){ const top=p[p.length-1], lo=p[0]; for(const x of top.blackboard) patchBB[x.key]=x.value; lv=`\n- 等级表 L${top.level}: cost ${['UltSp','Atb'][top.costType]??top.costType} ${top.costValue}, cd ${top.coolDown}, 黑板 ${JSON.stringify(Object.fromEntries(top.blackboard.map(x=>[x.key,num(x.value)])))}; L${lo.level} 黑板 ${JSON.stringify(Object.fromEntries(lo.blackboard.map(x=>[x.key,num(x.value)])))}`; }
  for(const x of d.blackboard||[]) if(!(x.key in patchBB)&&!x.isDynamic) patchBB[x.key]=x.valueDouble;
  const out=[`### ${id}`,`- 文件黑板: ${JSON.stringify(Object.fromEntries((d.blackboard||[]).map(x=>[x.key,x.isDynamic?'dyn':num(x.valueDouble)])))}; cast cost ${d.castData?.costData?.costType} ${d.castData?.costData?.costValue}; cd ${d.castData?.cooldownTime}; durationFrame ${d.durationFrame} (${(d.durationFrame/30).toFixed(2)}s), exclusiveFrame ${d.exclusiveFrame} (${(d.exclusiveFrame/30).toFixed(2)}s)${lv}`,'```'];
  for(const ta of d.actionGroupData?.timelineActions||[]) emit(ta._sequenceActionData?.actionData,0,out,`f${ta._startFrame}-${ta._endFrame} `);
  out.push('```'); return out.join('\n'); }
function buffDoc(f){ const b=load('BuffData',f); patchBB={}; for(const x of b.blackboard||[]) patchBB[x.key]=x.valueDouble; const s=b.stackingSettings||{};
  const am=(b.attributeModifier?.attributeModifiers||[]).map(m=>`${m.attributeType} ${m.formulaItem} ${bb(m.param)}`).join('; ');
  const dm=(b.damageModifier||[]).map(m=>`${m.enableSide}: ${(m.damageProcessors||[]).map(p=>`${T(p)} ${p.zoneName||''} ${p.damageScaleSide??''} ${bb(p.addition)??''}`.trim()).join('; ')}${m.condition?.actionData?.length?' cond=['+m.condition.actionData.map(line).join(' && ')+']':''}`).join(' || ');
  const out=[`### ${b.id}`,`- life ${b.lifeType}, dur ${bb(b.duration)}, stacking ${s.stackingType}${s.priorityKey?' by '+s.priorityKey:''}${s.stackingKey?' key='+s.stackingKey:''} max ${s.useMaxStackCntKey?'@'+s.maxStackCntKey:s.maxStackCnt}; 黑板默认 ${JSON.stringify(Object.fromEntries((b.blackboard||[]).map(x=>[x.key,num(x.valueDouble)])))}${b.applyTags?.length?'; tags '+JSON.stringify(b.applyTags).slice(0,80):''}`,
    `- 属性修正: ${am||'无'}`,`- 伤害修正: ${dm||'无'}`,'```'];
  for(const ev of b.buffEventAction||[]) { out.push(`on ${ev.buffEvent}:`); for(const grp of ev.actions||[]) emit(grp.actionData,1,out,''); }
  for(const ev of b.abilityEventAction||[]) { out.push(`on ability ${ev.abilityEvent}:`); for(const grp of ev.actions||[]) emit(grp.actionData,1,out,''); }
  for(const ta of b.timelineActions||[]) emit(ta._sequenceActionData?.actionData,0,out,`f${ta._startFrame}-${ta._endFrame} `);
  out.push('```'); return out.join('\n'); }
for(const pre of prefixes){ const skills=list('SkillData').filter(f=>f.includes(pre)).sort(), buffs=list('BuffData').filter(f=>f.includes(pre)).sort();
  const doc=[`# 解包清单：${pre}`,`来源 ${manifest.source} 版本 ${manifest.version}（抓取 ${manifest.fetchedAt.slice(0,10)}），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。`,`\n## 技能（${skills.length}）`,...skills.map(skillDoc),`\n## 增益（${buffs.length}）`,...buffs.map(buffDoc)].join('\n\n');
  if(outDir){ fs.mkdirSync(path.join(ROOT,outDir),{recursive:true}); fs.writeFileSync(path.join(ROOT,outDir,`${pre}.md`),doc); console.log(`写入 ${outDir}/${pre}.md（技能 ${skills.length}，增益 ${buffs.length}）`); } else console.log(doc); }

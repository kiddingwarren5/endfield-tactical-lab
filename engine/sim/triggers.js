// 触发表：效果目录 condition.trigger 代码 → 模拟器事件 / 状态 / 未建模说明。
// 新干员：在目录里给效果标好代码，再在此表加一行即可；tests/triggers.test.mjs 保证每个代码都有归属。
// 规格：
//   {on:'cast',kind|kinds,anyone?,once?,duration?}          施放战技/连携/终结技时（anyone：小队任意干员；once：每场一次）
//   {on:'hit',kind|kinds,heavy?,state?,targetHas?}           技能/普攻命中时；state 为命中时的附加状态条件
//   {on:'attach',by?|byIn?,element?|elementIn?,anyone?}       施加法术附着（by = skill/combo/ultimate/plunge）
//   {on:'attachLayers',min}                                   目标法术附着达到 N 层
//   {on:'consume',element?,by?}                               消耗法术附着
//   {on:'abnormal',which|whichIn,anyone?}                     施加法术异常（burn/conduct/freeze/corrosion）
//   {on:'burst',by?,elementIn?}                               造成法术爆发
//   {on:'heavy'} {on:'root'} {on:'tornado',min} {on:'earlyWave'} {on:'ultimateEnd'} {on:'iceShatter'} {on:'battleStart'}
//   {on:'applyDebuffCategory',zone?|zoneIn?}                  施加增幅/脆弱/易伤/庇护/虚弱类效果后
//   {on:'spGain',source}                                      通过自身技能恢复/返还技力后
//   {state:'duringUltimate'|'targetFrozen'|'targetColdAttached'|'targetColdOrFrozen'|'targetStaggered'|'always'|'never'}  状态型：结算时判定
//   {handled:'…'}  引擎在别处已处理   {unmodeled:'…'}  明确未建模（原因）
//   可以用数组表示“任一满足”。前缀 intGeWill& / willGtInt& 表示形态门槛（智识≥意志 / 意志>智识）。
const ARTS=['heat','cold','electric','nature'];
const cast=(kind,extra={})=>({on:'cast',kind,...extra});
const hit=(kind,extra={})=>({on:'hit',kind,...extra});
const U=reason=>({unmodeled:reason});
const PHYS=['knockup','knockdown','crush','armorBreak'];
const HEAL=U('治疗未建模');
const CRIT=U('模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模');
const CRYSTAL=U('源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着');

export const TRIGGERS={
  // ---- 通用：施放 / 命中 ----
  duringUltimate:{state:'duringUltimate'},
  afterComboHit:hit('combo'), afterComboDamage:hit('combo'), afterCombo2:hit('combo'),
  skillHit:hit('skill'), anySkillHit:hit(['skill','combo','ultimate']), skillHitSingle:hit('skill'), skillSingleHit:hit('skill'), skillHit2Plus:U('对照靶只有一个目标：多目标条件不成立'), comboHitOtherTargetNearby:U('对照靶只有一个目标：多目标条件不成立'),
  ultimateHit:hit('ultimate'), ultimateFinalHit:hit('ultimate'), onSkillOrUltimateHit:hit(['skill','ultimate']), skillOrUltHit:hit(['skill','ultimate']),
  skillFinalHitNoBreach:hit('skill'), skillFinalHitBreachLe2:hit('skill'),
  duringUltimateNormalHit:hit('normal',{state:'duringUltimate'}),
  afterUltimateCast:cast('ultimate'), ultCast:cast('ultimate'), afterUltimate:cast('ultimate'),
  comboCast:cast('combo'), afterComboCast:cast('combo'), onComboCast:cast('combo'), comboCastNextSkill:cast('combo',{consumeOn:cast('skill')}), comboHitLayers:hit('combo'), afterComboCastCd45:cast('combo',{cooldown:45}), afterComboNextSkill:cast('combo',{consumeOn:cast('skill'),duration:30}),
  onSkillCast:cast('skill'), skillCast:cast('skill'), firstSkillInBattle:cast('skill',{once:true}),
  skillOrComboCast:cast(['skill','combo']), teamSkillCast:cast('skill',{anyone:true}),
  afterUltimateEnd:{on:'ultimateEnd'}, battleStart:{on:'battleStart'},
  // “X 后 N 秒内的下次技能期间”：按施放事件触发，持续到下次该类技能（近似为原文时长）
  comboThenNextSkill:cast('combo',{duration:30,consumeOn:cast('skill')}), rootOrUltThenNextCombo:[{on:'root',duration:20,consumeOn:cast('combo')},cast('ultimate',{duration:20,consumeOn:cast('combo')})],
  knockUpThenNextUlt:{on:'abnormal',which:'knockup',consumeOn:cast('ultimate')}, applyBreachThenNextUlt:{on:'breach',consumeOn:cast('ultimate')}, crystalOrFreezeThenNextSkillOrUlt:[{on:'abnormal',which:'freeze',duration:20,consumeOn:cast(['skill','ultimate'])}],
  firstSkillDuringUltimate:U('终结技期间首次战技免技力费用未建模（技力消耗由 mechanics 决定）'),
  // ---- 附着 / 层数 / 消耗 ----
  skillApplyColdAttach:{on:'attach',by:'skill',element:'cold'}, skillApplyNatureAttach:{on:'attach',by:'skill',element:'nature'}, targetNatureAttachedCount:{state:'targetAttached',element:'nature'},
  selfSkillApplyHeatAttach:{on:'attach',element:'heat'}, skillApplyColdOrHeatAttach:{on:'attach',by:'skill',elementIn:['cold','heat']},
  skillOrUltApplyColdAttach:{on:'attach',byIn:['skill','ultimate','plunge'],element:'cold'},
  comboApplyElectricAttach:{on:'attach',by:'combo',element:'electric'},
  comboApplyArtsFragileOrAttach:[{on:'attach',by:'combo',elementIn:ARTS},{on:'applyDebuffCategory',zone:'fragile',by:'combo',damageClass:'arts'}],
  'intGeWill&selfSkillApplyArtsAttach':{on:'attach',elementIn:ARTS},
  targetArtsAttach2Plus:{on:'attachLayers',min:2}, enemyColdOrNatureAttach:{on:'attach',elementIn:['cold','nature'],anyone:true},
  targetColdAttached:{state:'targetColdAttached'}, targetFrozen:{state:'targetFrozen'}, targetColdOrFrozen:{state:'targetColdOrFrozen'},
  enemyFrozenOrCrystal:{on:'abnormal',which:'freeze',anyone:true,cooldown:3}, enemyFrozen:{on:'abnormal',which:'freeze',anyone:true}, selfFreeze:{on:'abnormal',which:'freeze'},
  comboHitFrozen:hit('combo',{targetHad:{abnormal:'freeze'}}), comboHitColdOrFrozen:hit('combo',{state:'targetColdOrFrozen'}), comboHitColdAttached:hit('combo',{targetHas:{attach:'cold'}}),
  consumeArtsAttach:{on:'consume'}, skillConsumeColdAttach:{on:'consume',element:'cold',by:'skill'}, comboAttachLayers:{state:'always'},
  // ---- 异常 / 爆发 ----
  afterApplyBurn:{on:'abnormal',which:'burn'}, applyBurnOrConduct:{on:'abnormal',whichIn:['burn','conduct']},
  afterApplyElectrify:{on:'abnormal',which:'conduct'}, applyConduct:{on:'abnormal',which:'conduct'}, afterApplyConduct:{on:'abnormal',which:'conduct'},
  afterApplyFreeze:{on:'abnormal',which:'freeze'}, skillApplyFreeze:{on:'abnormal',which:'freeze',by:'skill'}, afterApplyCorrosion:{on:'abnormal',which:'corrosion'},
  applyArtsAnomaly:{on:'abnormal',whichIn:['burn','conduct','freeze','corrosion']}, skillApplyArtsAnomaly:{on:'abnormal',by:'skill',whichIn:['burn','conduct','freeze','corrosion']},
  enemyFreezeOrCorrode:{on:'abnormal',whichIn:['freeze','corrosion'],anyone:true}, enemyBurnOrCorrode:{on:'abnormal',whichIn:['burn','corrosion'],anyone:true},
  artsBurst:{on:'burst',elementIn:ARTS}, onNatureOrColdBurst:{on:'burst',elementIn:['nature','cold']}, comboArtsBurstOrBurn:[{on:'burst',by:'combo',elementIn:ARTS},{on:'abnormal',which:'burn',by:'combo'}],
  comboArtsBurstOrPhysAnomaly:{on:'burst',by:'combo',elementIn:ARTS}, 'willGtInt&selfSkillArtsBurst':{on:'burst',elementIn:ARTS},
  artsBurstWithWindStack:U('身形如风层数未建模'), artsBurstStacks4:U('苦难的尽头层数未建模'),
  afterShatter:{on:'iceShatter',anyone:true},
  // 消耗法术异常（战技消耗燃烧/导电/腐蚀/冻结）：模拟器只建模了附着消耗，异常消耗尚未建模
  skillConsumeArtsAnomaly:{on:'consumeAbnormal',by:'skill',whichIn:['burn','conduct']}, skillConsumeArtsAnomalyWhileFang:U('灼热獠牙状态叠加未建模'), consumeArtsAnomaly:[{on:'consumeAbnormal'},{on:'iceShatter'}],
  skillConsumeCorrosion:{on:'consumeAbnormal',by:'skill',which:'corrosion'}, skillConsumeCorrosionOtherCorroded:U('对照靶只有一个目标：附近其他腐蚀目标不成立'), skillConsumeConduct:{on:'consumeAbnormal',by:'skill',which:'conduct'}, skillConsumeConduct3:U('3 次消耗导电计数未建模'),
  'consume_燃烧':{on:'consumeAbnormal',which:'burn'}, 'consume_导电':{on:'consumeAbnormal',which:'conduct'}, 'consume_冻结':[{on:'consumeAbnormal',which:'freeze'},{on:'iceShatter'}], 'consume_腐蚀':{on:'consumeAbnormal',which:'corrosion'},
  consumeFreeze:[{on:'consumeAbnormal',which:'freeze'},{on:'iceShatter'}], consumeCorrode:{on:'consumeAbnormal',which:'corrosion'}, afterConsumeElectrifyOrCorrosion:{on:'consumeAbnormal',whichIn:['conduct','corrosion']},
  // ---- 增益类施加 / 技力 ----
  afterApplyAmpProtectFragileWeaken:{on:'applyDebuffCategory',zoneIn:['amp','fragile']}, applyArtsAmpToOthers:{on:'applyDebuffCategory',zone:'amp',toOthers:true,damageClass:'arts'}, gainElectricAmp:{on:'applyDebuffCategory',zone:'amp',element:'electric',anyone:true,receivedByOwner:true},
  'intGeWill&selfSkillApplyArtsFragile':{on:'applyDebuffCategory',zone:'fragile',damageClass:'arts'}, 'willGtInt&selfSkillApplyArtsFragile':{on:'applyDebuffCategory',zone:'fragile',damageClass:'arts'},
  skillOrUltApplyArtsFragile:{on:'applyDebuffCategory',zone:'fragile',byIn:['skill','ultimate'],damageClass:'arts'}, selfSkillApplyHeatFragile:{on:'applyDebuffCategory',zone:'fragile',element:'heat'},
  skillApplyPhysFragile:{on:'applyDebuffCategory',zone:'fragile',by:'skill',element:'physical'}, applyPhysFragile:{on:'applyDebuffCategory',zone:'fragile',element:'physical'},
  spRecoverBySelfSkill:{on:'spGain',source:'selfSkill',recover:true}, afterSkillSpRecover:{on:'spGain',source:'selfSkill',recover:true}, afterSelfSkillSpRecover80:{on:'spGain',source:'selfSkill',recover:true,per:80}, spRecoverOrComboState:{on:'spGain',source:'selfSkill',recover:true},
  // ---- 重击 / 定身 / 水龙卷 ----
  heavyHit:{on:'heavy'}, heavyHitControlDouble:{on:'heavy',controlMul:2}, heavyHitAsMainControl:{on:'heavy',control:true}, infusedHeavyHit:{handled:'灌注重击结算时由 normalHit 临时计入（只作用于该次重击）'},
  applyRoot:{on:'root'},
  tornadoCount2:{on:'tornado',min:2,max:2}, tornadoCount3:{on:'tornado',min:3}, tornadoCount2Plus:{on:'tornado',min:2},
  ultimateEarlyTornado:{on:'earlyWave',duration:1}, skillConsumeVortex:{handled:'战技每消耗一处涡流返还技力：mechanics 20 + 潜能 1 的 5，由 castSkill 按涡流数结算'},
  // ---- 形态 ----
  intMode:{state:'modeInt'}, afterUltimate2:U('终结技二段破晦诀明未建模'), skillHitImprisoned:U('囹圄状态未建模'), ultimateFieldSpawn:{handled:'阵诀·智终结技的强制腐蚀由 mechanics 的 forced abnormal 结算'},
  // ---- 梨诺姿态：演唱姿态 = 战技（第 0 阶段）后 60 s，姿态中止（第 1 阶段）或终结技结束它；高歌姿态 = 终结技期间 ----
  singingStance:cast('skill',{stage:0,duration:60,endOn:[cast('skill',{stage:1}),cast('ultimate')]}), highSingingStance:{state:'duringUltimate'}, singingOrHighStance:[cast('skill',{stage:0,duration:60,endOn:cast('skill',{stage:1})}),{state:'duringUltimate'}],
  // ---- 对照靶上恒真 / 恒假 ----
  hpAbove80:{state:'always'}, targetHpBelow50:{state:'targetHpBelow'},
  // ---- 失衡 ----
  targetStaggered:{state:'targetStaggered'}, targetPhysFragileOrStagger:[{state:'targetStaggered'},{state:'targetFragile',element:'physical'}],
  // ---- 未建模机制（逐条注明原因）----
  afterSelfSkillHeal:hit('combo',{stacks:2}), selfSkillHeal:HEAL, selfSkillHealOthers:HEAL, comboHeal:HEAL, comboHealOthers:HEAL, crystalHealAtFullHp:{on:'heavy',anyone:true,ownerRecent:{kind:'skill',within:20},maxPerCast:2},
  afterCrit:CRIT, critAtkStacksFull:CRIT, critHit:CRIT, wolfBlood16:CRIT, skillOrComboCrit:CRIT, critOnScarredTarget:CRIT, artsImmuneProc:U('免疫法术概率触发未建模'),
  crystalConsumed:CRYSTAL, skillConsumeCrystal:CRYSTAL, ultimateConsumeCrystal:CRYSTAL, afterCrystalConsumed:CRYSTAL, targetCrystal:CRYSTAL, targetHasCrystal:CRYSTAL,
  onKnockdown:{on:'abnormal',which:'knockdown'}, comboKnockUp:{on:'abnormal',which:'knockup',by:'combo'}, onSmashOrArmorBreak:{on:'abnormal',whichIn:['crush','armorBreak']}, slamConsumeBreach:{on:'consume',element:'breach'}, consumeBreachLayers:{on:'consume',element:'breach'}, afterApplyBreach:{on:'breach'}, targetBreach4:{state:'targetBreach4'},
  applyBreachOnZero:{on:'breach',min:1,max:1}, targetBreached:{state:'targetBreached'}, skillApplyBreach:{on:'breach',by:'skill'}, afterPhysicalAnomaly:{on:'abnormal',whichIn:PHYS}, physAnomaly:{on:'abnormal',whichIn:PHYS}, comboHitBroken:hit('combo',{state:'targetBreached'}), consumeBreak:{on:'consume',element:'breach'}, comboSlam:{on:'abnormal',which:'crush',by:'combo'},
  stageChainRefund:{handled:'阶段链第一段的返还技力由 castSkill 按 chain.spRefund 结算'}, energySourceRestricted:{handled:'别礼终结技能量只来自自身战技与连携（simulate gainEnergy 按 energySource 屏蔽外部来源）'}, interruptCharge:U('敌人蓄力 / 打断未建模'),
  skillAmberHit:U('爪印斫痕（需命中破防目标）未建模'), boilingBloodTargetBurning:U('沸血机制未建模'), comboRareFish:U('珍鳞概率未建模'),
  lanceHit:U('雷枪掷出/召回命中未建模'), targetElectricFragile:{state:'targetFragile',element:'electric'},
  skillCounter:U('格挡反击未建模（对照靶不攻击）'), skillFirstBlock:U('格挡未建模（对照靶不攻击）'), takeDamage:U('承伤未建模（对照靶不攻击）'), hasUltimateShield:cast('ultimate'), onSkillHitWithShield:U('护盾未建模'),
  targetFocused:hit('skill'), focused20s:hit('skill',{delay:20,duration:40}), focusedKilled:U('击败事件未建模（对照靶无限血）'),
  ultimateKill:U('击败事件未建模（对照靶无限血）'), killDuringUltimate:U('击败事件未建模（对照靶无限血）'),
  moltenStacks4:U('熔火层数未建模'), skillFollowupHit:U('焚灭追加攻击未建模'), skillBurn:U('战技燃烧伤害倍率单独加成未建模'),
  comboConduct:U('导电来源区分未建模'), comboHitWithPrep:U('备料层数未建模'), afterUltimateFollowup:U('盾卫旗队后续效果未建模（物理异常分支）'),
  ultimateMaxStacks:U('模拟按不暴击计算，暴击率层数不影响伤害'), nextHeavyAfterSkillFreeze:U('下一次普攻改重击未建模'),
  inGravityField:cast('ultimate'), inGravityFieldBreach:U('重力场（终结技领域内）未建模'),
  wingHovering:hit('skill'), comboHitWingTarget:U('“连击”乘区未建模'),
  inArrowField:U('箭阵持续时间官方未给出'), enhancedShot:U('猎矢强化射击未建模'), enhancedShotConsumeAttach:U('猎矢强化射击未建模'), airborne:cast('skill',{duration:1.5}),
  specialGiftHit:U('代言人特殊赠礼概率未建模'), inkMarked:{handled:'笔意：河山共影命中后按参数表比例记录目标所受伤害，笔意时长结束或收笔时以固定伤害爆发（simulate inkBurst）'},
  ultimateDetonateBomb:U('自制炸弹未建模'), targetSlowed:U('缓速持续时间官方未给出'), skillLastStrike:U('雷击逐次命中未建模'), skillFirstTarget:{state:'always'},
  targetColdFragile:{handled:'别礼二天赋：终结技享受的脆弱 ×1.5，由 fragileMultiplier 结算'},
};

const PREFIX={'intGeWill&':0,'willGtInt&':1};
// 返回 {specs:[...], modeGate, code} 或 null（无代码）
export function specFor(code){
  if(!code||code==='always') return null;
  let gate=null, key=code; for(const [p,m] of Object.entries(PREFIX)){ if(code.startsWith(p)){ gate=m; break; } }
  let raw=TRIGGERS[key]; if(raw===undefined&&gate!=null){ raw=TRIGGERS[key.slice(key.indexOf('&')+1)]; }
  if(raw===undefined) return {code,specs:null,modeGate:gate,unknown:true};
  const specs=Array.isArray(raw)?raw:[raw];
  return {code,specs,modeGate:gate};
}
export function triggerCoverage(effects){
  const rows=[]; for(const e of effects){ const code=e.condition?.trigger; if(!code||code==='always') continue; const s=specFor(code); let kind=!s||s.unknown?'unknown':s.specs.some(x=>x.on)?'event':s.specs.some(x=>x.state)?'state':s.specs.some(x=>x.handled)?'handled':'unmodeled'; if((kind==='event'||kind==='state')&&e.zone==='other') kind='event-noop'; /* “其他”区的效果触发了也不进伤害/资源结算 */ rows.push({id:e.id,code,kind,reason:s?.specs?.find(x=>x.unmodeled)?.unmodeled||''}); }
  return rows;
}

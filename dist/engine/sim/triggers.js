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
const cast=(kind,extra={})=>({on:'cast',kind,...extra});
const hit=(kind,extra={})=>({on:'hit',kind,...extra});
const U=reason=>({unmodeled:reason});
const BREACH=U('破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模');
const HEAL=U('治疗未建模');
const CRIT=U('模拟按不暴击计算，暴击触发未建模');
const CRYSTAL=U('源石结晶（管理员机制）未建模');

export const TRIGGERS={
  // ---- 通用：施放 / 命中 ----
  duringUltimate:{state:'duringUltimate'},
  afterComboHit:hit('combo'), afterComboDamage:hit('combo'), afterCombo2:hit('combo'),
  skillHit:hit('skill'), skillHitSingle:hit('skill'), skillSingleHit:hit('skill'), skillHit2Plus:U('对照靶只有一个目标：多目标条件不成立'), comboHitOtherTargetNearby:U('对照靶只有一个目标：多目标条件不成立'),
  ultimateHit:hit('ultimate'), ultimateFinalHit:hit('ultimate'), onSkillOrUltimateHit:hit(['skill','ultimate']), skillOrUltHit:hit(['skill','ultimate']),
  skillFinalHitNoBreach:hit('skill'), skillFinalHitBreachLe2:hit('skill'),
  duringUltimateNormalHit:hit('normal',{state:'duringUltimate'}),
  afterUltimateCast:cast('ultimate'), ultCast:cast('ultimate'), afterUltimate:cast('ultimate'), ultimateFieldSpawn:cast('ultimate'),
  comboCast:cast('combo'), afterComboCast:cast('combo'), onComboCast:cast('combo'),
  onSkillCast:cast('skill'), skillCast:cast('skill'), firstSkillInBattle:cast('skill',{once:true}),
  skillOrComboCast:cast(['skill','combo']), teamSkillCast:cast('skill',{anyone:true}),
  afterUltimateEnd:{on:'ultimateEnd'}, battleStart:{on:'battleStart'},
  // “X 后 N 秒内的下次技能期间”：按施放事件触发，持续到下次该类技能（近似为原文时长）
  comboThenNextSkill:cast('combo',{duration:30}), rootOrUltThenNextCombo:[{on:'root',duration:20},cast('ultimate',{duration:20})],
  knockUpThenNextUlt:BREACH, applyBreachThenNextUlt:BREACH, crystalOrFreezeThenNextSkillOrUlt:[{on:'abnormal',which:'freeze',duration:20}],
  // ---- 附着 / 层数 / 消耗 ----
  skillApplyColdAttach:{on:'attach',by:'skill',element:'cold'}, skillApplyNatureAttach:{on:'attach',by:'skill',element:'nature'},
  selfSkillApplyHeatAttach:{on:'attach',element:'heat'}, skillApplyColdOrHeatAttach:{on:'attach',by:'skill',elementIn:['cold','heat']},
  skillOrUltApplyColdAttach:{on:'attach',byIn:['skill','ultimate','plunge'],element:'cold'},
  comboApplyElectricAttach:{on:'attach',by:'combo',element:'electric'},
  comboApplyArtsFragileOrAttach:[{on:'attach',by:'combo'},{on:'applyDebuffCategory',zone:'fragile',by:'combo'}],
  'intGeWill&selfSkillApplyArtsAttach':{on:'attach'},
  targetArtsAttach2Plus:{on:'attachLayers',min:2}, enemyColdOrNatureAttach:{on:'attach',elementIn:['cold','nature'],anyone:true},
  targetColdAttached:{state:'targetColdAttached'}, targetFrozen:{state:'targetFrozen'}, targetColdOrFrozen:{state:'targetColdOrFrozen'},
  enemyFrozenOrCrystal:{state:'targetFrozen'}, enemyFrozen:{on:'abnormal',which:'freeze',anyone:true}, selfFreeze:{on:'abnormal',which:'freeze'},
  comboHitFrozen:hit('combo',{state:'targetFrozen'}), comboHitColdOrFrozen:hit('combo',{state:'targetColdOrFrozen'}), comboHitColdAttached:hit('combo',{targetHas:{attach:'cold'}}),
  consumeArtsAttach:{on:'consume'}, skillConsumeColdAttach:{on:'consume',element:'cold',by:'skill'}, comboAttachLayers:{handled:'按消耗层数的倍率加成由 layers 变量结算'},
  // ---- 异常 / 爆发 ----
  afterApplyBurn:{on:'abnormal',which:'burn'}, applyBurnOrConduct:{on:'abnormal',whichIn:['burn','conduct']},
  afterApplyElectrify:{on:'abnormal',which:'conduct'}, applyConduct:{on:'abnormal',which:'conduct'}, afterApplyConduct:{on:'abnormal',which:'conduct'},
  afterApplyFreeze:{on:'abnormal',which:'freeze'}, skillApplyFreeze:{on:'abnormal',which:'freeze'}, afterApplyCorrosion:{on:'abnormal',which:'corrosion'},
  applyArtsAnomaly:{on:'abnormal'}, skillApplyArtsAnomaly:{on:'abnormal'},
  enemyFreezeOrCorrode:{on:'abnormal',whichIn:['freeze','corrosion'],anyone:true}, enemyBurnOrCorrode:{on:'abnormal',whichIn:['burn','corrosion'],anyone:true},
  artsBurst:{on:'burst'}, onNatureOrColdBurst:{on:'burst',elementIn:['nature','cold']}, comboArtsBurstOrBurn:[{on:'burst',by:'combo'},{on:'abnormal',which:'burn'}],
  comboArtsBurstOrPhysAnomaly:{on:'burst',by:'combo'}, 'willGtInt&selfSkillArtsBurst':{on:'burst'},
  artsBurstWithWindStack:U('身形如风层数未建模'), artsBurstStacks4:U('苦难的尽头层数未建模'),
  afterShatter:{on:'iceShatter'},
  // 消耗法术异常（战技消耗燃烧/导电/腐蚀/冻结）：模拟器只建模了附着消耗，异常消耗尚未建模
  skillConsumeArtsAnomaly:U('法术异常的消耗未建模'), skillConsumeArtsAnomalyWhileFang:U('法术异常的消耗未建模'), consumeArtsAnomaly:U('法术异常的消耗未建模'),
  skillConsumeCorrosion:U('法术异常的消耗未建模'), skillConsumeCorrosionOtherCorroded:U('法术异常的消耗未建模'), skillConsumeConduct:U('法术异常的消耗未建模'), skillConsumeConduct3:U('法术异常的消耗未建模'),
  'consume_燃烧':U('法术异常的消耗未建模'), 'consume_导电':U('法术异常的消耗未建模'), 'consume_冻结':U('法术异常的消耗未建模'), 'consume_腐蚀':U('法术异常的消耗未建模'),
  consumeFreeze:U('法术异常的消耗未建模'), consumeCorrode:U('法术异常的消耗未建模'), afterConsumeElectrifyOrCorrosion:U('法术异常的消耗未建模'),
  // ---- 增益类施加 / 技力 ----
  afterApplyAmpProtectFragileWeaken:{on:'applyDebuffCategory'}, applyArtsAmpToOthers:{on:'applyDebuffCategory',zone:'amp'}, gainElectricAmp:{on:'applyDebuffCategory',zone:'amp'},
  'intGeWill&selfSkillApplyArtsFragile':{on:'applyDebuffCategory',zone:'fragile'}, 'willGtInt&selfSkillApplyArtsFragile':{on:'applyDebuffCategory',zone:'fragile'},
  skillOrUltApplyArtsFragile:{on:'applyDebuffCategory',zone:'fragile'}, selfSkillApplyHeatFragile:{on:'applyDebuffCategory',zone:'fragile'},
  skillApplyPhysFragile:{on:'applyDebuffCategory',zone:'fragile'}, applyPhysFragile:{on:'applyDebuffCategory',zone:'fragile'},
  spRecoverBySelfSkill:{on:'spGain',source:'selfSkill'}, afterSkillSpRecover:{on:'spGain',source:'selfSkill'}, afterSelfSkillSpRecover80:{on:'spGain',source:'selfSkill'}, spRecoverOrComboState:{on:'spGain',source:'selfSkill'},
  // ---- 重击 / 定身 / 水龙卷 ----
  heavyHit:{on:'heavy'}, heavyHitAsMainControl:{on:'heavy'}, infusedHeavyHit:{on:'heavy',infused:true},
  applyRoot:{on:'root'},
  tornadoCount2:{on:'tornado',min:2}, tornadoCount3:{on:'tornado',min:3}, tornadoCount2Plus:{on:'tornado',min:2},
  ultimateEarlyTornado:{on:'earlyWave',duration:1}, skillConsumeVortex:{handled:'战技每消耗一处涡流返还技力，由 castSkill 按涡流数结算'},
  // ---- 形态 ----
  intMode:{state:'modeInt'}, afterUltimate2:U('终结技二段破晦诀明未建模'), skillHitImprisoned:U('囹圄状态未建模'),
  // ---- 梨诺姿态：演唱姿态 = 战技后 60 s，高歌姿态 = 终结技期间 ----
  singingStance:cast('skill',{duration:60}), highSingingStance:{state:'duringUltimate'}, singingOrHighStance:[cast('skill',{duration:60}),{state:'duringUltimate'}],
  // ---- 对照靶上恒真 / 恒假 ----
  hpAbove80:{state:'always'}, targetHpBelow50:{state:'never'},
  // ---- 失衡 ----
  targetStaggered:{state:'targetStaggered'}, targetPhysFragileOrStagger:{state:'targetStaggered'},
  // ---- 未建模机制（逐条注明原因）----
  afterSelfSkillHeal:HEAL, selfSkillHeal:HEAL, selfSkillHealOthers:HEAL, comboHeal:HEAL, comboHealOthers:HEAL, crystalHealAtFullHp:HEAL,
  afterCrit:CRIT, critAtkStacksFull:CRIT, critHit:CRIT, wolfBlood16:CRIT, skillOrComboCrit:CRIT, critOnScarredTarget:CRIT, artsImmuneProc:U('免疫法术概率触发未建模'),
  crystalConsumed:CRYSTAL, skillConsumeCrystal:CRYSTAL, ultimateConsumeCrystal:CRYSTAL, afterCrystalConsumed:CRYSTAL, targetCrystal:CRYSTAL, targetHasCrystal:CRYSTAL,
  onKnockdown:BREACH, comboKnockUp:BREACH, onSmashOrArmorBreak:BREACH, slamConsumeBreach:BREACH, consumeBreachLayers:BREACH, afterApplyBreach:BREACH, targetBreach4:BREACH,
  applyBreachOnZero:BREACH, targetBreached:BREACH, skillApplyBreach:BREACH, afterPhysicalAnomaly:BREACH, physAnomaly:BREACH, comboHitBroken:BREACH, consumeBreak:BREACH, comboSlam:BREACH, interruptCharge:BREACH,
  skillAmberHit:U('爪印斫痕（需命中破防目标）未建模'), boilingBloodTargetBurning:U('沸血机制未建模'), comboRareFish:U('珍鳞概率未建模'),
  lanceHit:U('雷枪掷出/召回命中未建模'), targetElectricFragile:U('目标电磁脆弱状态判定未建模'),
  skillCounter:U('格挡反击未建模'), skillFirstBlock:U('格挡未建模'), takeDamage:U('承伤未建模'), hasUltimateShield:U('护盾未建模'), onSkillHitWithShield:U('护盾未建模'),
  targetFocused:U('研究对象聚焦未建模'), focused20s:U('研究对象聚焦未建模'), focusedKilled:U('击败事件未建模（对照靶无限血）'),
  ultimateKill:U('击败事件未建模（对照靶无限血）'), killDuringUltimate:U('击败事件未建模（对照靶无限血）'),
  moltenStacks4:U('熔火层数未建模'), skillFollowupHit:U('焚灭追加攻击未建模'), skillBurn:U('战技燃烧伤害倍率单独加成未建模'),
  comboConduct:U('导电来源区分未建模'), comboHitWithPrep:U('备料层数未建模'), afterUltimateFollowup:U('盾卫旗队后续效果未建模'),
  ultimateMaxStacks:U('冷冻射手层数未建模'), nextHeavyAfterSkillFreeze:U('下一次普攻改重击未建模'),
  inGravityField:U('重力紊乱区域未建模'), inGravityFieldBreach:U('重力紊乱区域未建模'),
  wingHovering:U('衔火血翼盘桓未建模'), comboHitWingTarget:U('衔火血翼盘桓未建模'),
  inArrowField:U('箭阵未建模'), enhancedShot:U('猎矢强化射击未建模'), enhancedShotConsumeAttach:U('猎矢强化射击未建模'), airborne:U('浮空状态未建模'),
  specialGiftHit:U('代言人特殊赠礼概率未建模'), inkMarked:U('笔意伤害记录与爆发未建模'),
  ultimateDetonateBomb:U('自制炸弹未建模'), targetSlowed:U('缓速状态未建模'), skillLastStrike:U('雷击逐次命中未建模'), skillFirstTarget:U('首个命中目标区分未建模'),
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
  const rows=[]; for(const e of effects){ const code=e.condition?.trigger; if(!code||code==='always') continue; const s=specFor(code); const kind=!s||s.unknown?'unknown':s.specs.some(x=>x.on)?'event':s.specs.some(x=>x.state)?'state':s.specs.some(x=>x.handled)?'handled':'unmodeled'; rows.push({id:e.id,code,kind,reason:s?.specs?.find(x=>x.unmodeled)?.unmodeled||''}); }
  return rows;
}

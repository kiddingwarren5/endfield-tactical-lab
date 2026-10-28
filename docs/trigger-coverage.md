# 触发覆盖（由 tests/triggers.test.mjs 生成）

生成：2026-10-28T19:26:23.194Z

| 归属 | 效果数 |
|---|---|
| event | 169 |
| unmodeled | 94 |
| handled | 5 |
| state | 26 |
| event-noop | 8 |

## 未建模原因汇总

- 破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常）（24）：chr_0004_pelica.talent.bounce、chr_0018_dapan.combo.slamDmg、chr_0018_dapan.talent.thicken、chr_0015_lifeng.talent2.knockdown、chr_0015_lifeng.pot5.knockdown、chr_0013_aglina.ult.fragile.breach、chr_0013_aglina.pot2.fragile、suit_phy01.p2 …
- 源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着（10）：official_89.talent.disintegrate、official_89.talent.stasis、official_89.pot1.spRefund、official_89.pot2.othersAtk、official_89.pot3.energy、chr_0003_endminf.talent1.atk、chr_0003_endminf.talent2.physVuln、chr_0003_endminf.pot1.spRefund …
- 模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模（6）：chr_0028_wulfa.talent.boilingBlood、suit_criti01.p2、suit_criti01.p3、wpn_pistol_0010.p2、wpn_sword_0022.p2、wpn_sword_0022.p3
- 治疗未建模（5）：wpn_funnel_0010.p1、wpn_lance_0014.p2、wpn_lance_0016.p2、wpn_sword_0023.p2、wpn_sword_0023.p3
- 击败事件未建模（对照靶无限血）（3）：chr_0016_laevat.pot5.ultExtend、chr_0018_dapan.pot1.physDmg、chr_0023_antal.pot3.spRefund
- 爪印斫痕（需命中破防目标）未建模（3）：chr_0028_wulfa.talent.scarVuln、chr_0028_wulfa.talent.scarDot、chr_0028_wulfa.pot1.spRefund
- 猎矢强化射击未建模（3）：chr_0034_typhoea.skill.burstMul、chr_0034_typhoea.talent1.arrowMul、chr_0034_typhoea.pot5.burstMul
- 雷枪掷出/召回命中未建模（2）：chr_0012_avywen.talent.delivery、chr_0012_avywen.pot1.delivery
- 格挡反击未建模（对照靶不攻击）（2）：chr_0014_aurora.talent.counterEnergy、chr_0014_aurora.pot5.spRefund
- 盾卫旗队后续效果未建模（物理异常分支）（2）：chr_0029_pograni.talent2.atk、chr_0029_pograni.talent2.arts
- 对照靶只有一个目标：多目标条件不成立（2）：chr_0029_pograni.pot1.spRefund、chr_0011_seraph.pot3.bounce
- 箭阵持续时间官方未给出（2）：chr_0034_typhoea.combo.burstVuln、chr_0034_typhoea.pot3.burstVuln
- 格挡未建模（对照靶不攻击）（2）：chr_0038_purrche.talent1.energy、chr_0038_purrche.talent1.giftChance
- 笔意伤害记录与爆发未建模（2）：chr_0036_jsspsi.skill.inkRecord、chr_0036_jsspsi.pot1.inkRecord
- 灼热獠牙状态叠加未建模（1）：chr_0006_wolfgd.pot3.teamFang
- 导电来源区分未建模（1）：chr_0004_pelica.pot4.conductMul
- 熔火层数未建模（1）：chr_0016_laevat.talent.resIgnore
- 焚灭追加攻击未建模（1）：chr_0016_laevat.pot1.spRefund
- 战技燃烧伤害倍率单独加成未建模（1）：chr_0016_laevat.pot3.burnDmg
- 沸血机制未建模（1）：chr_0028_wulfa.talent.boilingBurn
- 对照靶只有一个目标：附近其他腐蚀目标不成立（1）：chr_0025_ardelia.talent.mountainSurf
- 敌人蓄力 / 打断未建模（1）：chr_0005_chen.talent.poise
- 备料层数未建模（1）：chr_0018_dapan.talent.prep
- 承伤未建模（对照靶不攻击）（1）：chr_0009_azrila.talent.ironForIron
- 3 次消耗导电计数未建模（1）：chr_0007_ikut.talent.wanderer
- 珍鳞概率未建模（1）：chr_0024_deepfin.pot3.teamAtk
- 自制炸弹未建模（1）：chr_0022_bounda.ult.bombDmg
- 缓速持续时间官方未给出（1）：chr_0022_bounda.talent.slowedTarget
- 免疫法术概率触发未建模（1）：chr_0022_bounda.talent.elusive
- 护盾未建模（1）：chr_0020_meurs.pot5.spRefund
- 模拟按不暴击计算，暴击率层数不影响伤害（1）：chr_0017_yvonne.ult.critDmg
- 下一次普攻改重击未建模（1）：chr_0017_yvonne.talent1.heavyBonus
- 雷击逐次命中未建模（1）：chr_0030_zhuangfy.skill.lastStrike
- 终结技期间首次战技免技力费用未建模（技力消耗由 mechanics 决定）（1）：chr_0030_zhuangfy.ult.freeSkill
- “连击”乘区未建模（1）：chr_0033_camille.talent1.combo
- 囹圄状态未建模（1）：chr_0032_lizhiyan.pot1.int.spRefund
- 终结技二段破晦诀明未建模（1）：chr_0032_lizhiyan.pot5.will.comboCd
- 代言人特殊赠礼概率未建模（1）：chr_0038_purrche.ult.artsFragile
- 身形如风层数未建模（1）：wpn_funnel_0019.p3
- 苦难的尽头层数未建模（1）：wpn_funnel_0020.p3

## 逐条

| 效果 | 代码 | 归属 |
|---|---|---|
| chr_0006_wolfgd.talent.fang | afterApplyBurn | event |
| chr_0006_wolfgd.talent.temperance | skillConsumeArtsAnomaly | event |
| chr_0006_wolfgd.pot2.spRefund | skillConsumeArtsAnomaly | event |
| chr_0006_wolfgd.pot3.teamFang | skillConsumeArtsAnomalyWhileFang | unmodeled：灼热獠牙状态叠加未建模 |
| chr_0006_wolfgd.pot5.comboReset | afterUltimate | event |
| chr_0026_lastrite.talent.hypothermia | consumeArtsAttach | event |
| chr_0026_lastrite.talent.brittle | targetColdFragile | handled |
| chr_0026_lastrite.pot1.heavyExtra | infusedHeavyHit | handled |
| chr_0026_lastrite.pot1.heavyPoise | infusedHeavyHit | handled |
| chr_0004_pelica.talent.annihilate | targetStaggered | state |
| chr_0004_pelica.talent.bounce | comboHitBroken | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| chr_0004_pelica.pot3.atk | afterApplyConduct | event |
| chr_0004_pelica.pot4.conductMul | comboConduct | unmodeled：导电来源区分未建模 |
| chr_0016_laevat.talent.resIgnore | moltenStacks4 | unmodeled：熔火层数未建模 |
| chr_0016_laevat.pot1.spRefund | skillFollowupHit | unmodeled：焚灭追加攻击未建模 |
| chr_0016_laevat.pot3.burnDmg | skillBurn | unmodeled：战技燃烧伤害倍率单独加成未建模 |
| chr_0016_laevat.pot5.ultExtend | killDuringUltimate | unmodeled：击败事件未建模（对照靶无限血） |
| chr_0028_wulfa.combo.critRate | afterCombo2 | event |
| chr_0028_wulfa.combo.critDmg | afterCombo2 | event |
| chr_0028_wulfa.talent.scarVuln | skillAmberHit | unmodeled：爪印斫痕（需命中破防目标）未建模 |
| chr_0028_wulfa.talent.scarDot | skillAmberHit | unmodeled：爪印斫痕（需命中破防目标）未建模 |
| chr_0028_wulfa.talent.boilingBlood | critOnScarredTarget | unmodeled：模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模 |
| chr_0028_wulfa.talent.boilingBurn | boilingBloodTargetBurning | unmodeled：沸血机制未建模 |
| chr_0028_wulfa.pot1.spRefund | skillAmberHit | unmodeled：爪印斫痕（需命中破防目标）未建模 |
| chr_0025_ardelia.skill.physFragile | skillConsumeCorrosion | event |
| chr_0025_ardelia.skill.artsFragile | skillConsumeCorrosion | event |
| chr_0025_ardelia.talent.mountainSurf | skillConsumeCorrosionOtherCorroded | unmodeled：对照靶只有一个目标：附近其他腐蚀目标不成立 |
| chr_0025_ardelia.pot1.physFragile | skillConsumeCorrosion | event |
| chr_0025_ardelia.pot1.artsFragile | skillConsumeCorrosion | event |
| chr_0005_chen.talent.edge | anySkillHit | event |
| chr_0005_chen.talent.poise | interruptCharge | unmodeled：敌人蓄力 / 打断未建模 |
| chr_0005_chen.pot1.lowHp | targetHpBelow50 | state |
| chr_0018_dapan.combo.slamDmg | comboSlam | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| chr_0018_dapan.talent.thicken | consumeBreak | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| chr_0018_dapan.talent.prep | comboHitWithPrep | unmodeled：备料层数未建模 |
| chr_0018_dapan.pot1.physDmg | ultimateKill | unmodeled：击败事件未建模（对照靶无限血） |
| chr_0018_dapan.pot5.extraBreak | skillSingleHit | event-noop |
| chr_0009_azrila.talent.ironForIron | takeDamage | unmodeled：承伤未建模（对照靶不攻击） |
| chr_0009_azrila.pot5.shieldAtk | hasUltimateShield | event |
| chr_0007_ikut.talent.wanderer | skillConsumeConduct3 | unmodeled：3 次消耗导电计数未建模 |
| chr_0007_ikut.pot1.spRefund | skillConsumeConduct | event |
| chr_0024_deepfin.talent.freezeEnergy | enemyFrozenOrCrystal | event |
| chr_0024_deepfin.talent.freezeEnergyOwn | selfFreeze | event |
| chr_0024_deepfin.pot1.spRefund | skillConsumeColdAttach | event |
| chr_0024_deepfin.pot3.teamAtk | comboRareFish | unmodeled：珍鳞概率未建模 |
| chr_0024_deepfin.pot5.ultRatio | targetHpBelow50 | state |
| chr_0012_avywen.talent.delivery | lanceHit | unmodeled：雷枪掷出/召回命中未建模 |
| chr_0012_avywen.talent.electricFragile | ultimateHit | event |
| chr_0012_avywen.pot1.delivery | lanceHit | unmodeled：雷枪掷出/召回命中未建模 |
| chr_0012_avywen.pot5.recallRatio | targetElectricFragile | state |
| official_89.talent.disintegrate | crystalConsumed | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| official_89.talent.stasis | targetCrystal | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| official_89.pot1.spRefund | skillConsumeCrystal | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| official_89.pot2.othersAtk | crystalConsumed | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| official_89.pot3.energy | ultimateConsumeCrystal | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| chr_0014_aurora.talent.counterEnergy | skillCounter | unmodeled：格挡反击未建模（对照靶不攻击） |
| chr_0014_aurora.pot5.spRefund | skillCounter | unmodeled：格挡反击未建模（对照靶不攻击） |
| chr_0023_antal.skill.electricFragile | targetFocused | event |
| chr_0023_antal.skill.heatFragile | targetFocused | event |
| chr_0023_antal.ult.electricAmp | afterUltimate | event |
| chr_0023_antal.ult.heatAmp | afterUltimate | event |
| chr_0023_antal.pot3.spRefund | focusedKilled | unmodeled：击败事件未建模（对照靶无限血） |
| chr_0023_antal.pot5.electricFragile | focused20s | event |
| chr_0023_antal.pot5.heatFragile | focused20s | event |
| chr_0022_bounda.ult.bombDmg | ultimateDetonateBomb | unmodeled：自制炸弹未建模 |
| chr_0022_bounda.talent.slowedTarget | targetSlowed | unmodeled：缓速持续时间官方未给出 |
| chr_0022_bounda.talent.elusive | artsImmuneProc | unmodeled：免疫法术概率触发未建模 |
| chr_0022_bounda.pot5.comboCdr | enemyColdOrNatureAttach | event |
| chr_0021_whiten.combo.physFragile | comboHitFrozen | event |
| chr_0021_whiten.talent.shatterRefund | afterShatter | event |
| chr_0021_whiten.pot3.firstHit | skillFirstTarget | state |
| chr_0021_whiten.pot5.freezeEnergy | enemyFrozen | event |
| chr_0020_meurs.talent2.shockwave | ultimateFinalHit | event-noop |
| chr_0020_meurs.pot1.extraHit | onSkillOrUltimateHit | event-noop |
| chr_0020_meurs.pot5.spRefund | onSkillHitWithShield | unmodeled：护盾未建模 |
| chr_0019_karin.talent2.combo | duringUltimate | event-noop |
| chr_0019_karin.pot1.atk | afterSkillSpRecover | event |
| chr_0019_karin.pot3.teamAtk | duringUltimate | state |
| chr_0019_karin.pot5.comboExtend | afterUltimateEnd | event-noop |
| chr_0015_lifeng.skill.physFragile | skillFinalHitNoBreach | event |
| chr_0015_lifeng.combo.comboState | afterComboCast | event-noop |
| chr_0015_lifeng.talent2.knockdown | onKnockdown | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| chr_0015_lifeng.pot1.fragile | skillFinalHitBreachLe2 | event |
| chr_0015_lifeng.pot5.knockdown | onKnockdown | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| chr_0029_pograni.talent1.atk | afterSelfSkillSpRecover80 | event |
| chr_0029_pograni.talent1.arts | afterSelfSkillSpRecover80 | event |
| chr_0029_pograni.talent2.atk | afterUltimateFollowup | unmodeled：盾卫旗队后续效果未建模（物理异常分支） |
| chr_0029_pograni.talent2.arts | afterUltimateFollowup | unmodeled：盾卫旗队后续效果未建模（物理异常分支） |
| chr_0029_pograni.pot1.spRefund | skillHit2Plus | unmodeled：对照靶只有一个目标：多目标条件不成立 |
| chr_0011_seraph.skill.artsAmp | crystalHealAtFullHp | event |
| chr_0011_seraph.ult.amp.cold | afterUltimateCast | event |
| chr_0011_seraph.ult.amp.nature | afterUltimateCast | event |
| chr_0011_seraph.talent1.coldVuln | comboHitColdOrFrozen | event |
| chr_0011_seraph.pot1.artsAmp | crystalHealAtFullHp | event |
| chr_0011_seraph.pot3.bounce | comboHitOtherTargetNearby | unmodeled：对照靶只有一个目标：多目标条件不成立 |
| chr_0003_endminf.talent1.atk | afterCrystalConsumed | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| chr_0003_endminf.talent2.physVuln | targetHasCrystal | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| chr_0003_endminf.pot1.spRefund | skillConsumeCrystal | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| chr_0003_endminf.pot2.othersAtk | afterCrystalConsumed | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| chr_0003_endminf.pot3.energy | ultimateConsumeCrystal | unmodeled：源石结晶（管理员机制）未建模：结晶附着被忽略，不进入法术附着 |
| chr_0017_yvonne.ult.critRate | duringUltimateNormalHit | event |
| chr_0017_yvonne.ult.critDmg | ultimateMaxStacks | unmodeled：模拟按不暴击计算，暴击率层数不影响伤害 |
| chr_0017_yvonne.talent1.heavyBonus | nextHeavyAfterSkillFreeze | unmodeled：下一次普攻改重击未建模 |
| chr_0017_yvonne.talent2.critDmg.cold | targetColdAttached | state |
| chr_0017_yvonne.talent2.critDmg.frozen | targetFrozen | state |
| chr_0017_yvonne.pot1.energy | afterComboDamage | event |
| chr_0017_yvonne.pot3.bonus.cold | targetColdAttached | state |
| chr_0017_yvonne.pot3.bonus.frozen | targetFrozen | state |
| chr_0017_yvonne.pot4.spRefund | skillHitSingle | event |
| chr_0017_yvonne.pot5.atk | duringUltimate | state |
| chr_0017_yvonne.pot5.critDmg | duringUltimate | state |
| chr_0013_aglina.ult.fragile.base | inGravityField | event |
| chr_0013_aglina.ult.fragile.breach | inGravityFieldBreach | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| chr_0013_aglina.pot2.fragile | inGravityFieldBreach | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| chr_0027_tangtang.skill.fragile2 | tornadoCount2 | event |
| chr_0027_tangtang.skill.fragile3 | tornadoCount3 | event |
| chr_0027_tangtang.talent2.tornadoBonus | ultimateEarlyTornado | event |
| chr_0027_tangtang.pot1.spRefund | skillConsumeVortex | handled |
| chr_0027_tangtang.pot3.fragile | tornadoCount2Plus | event |
| chr_0027_tangtang.pot5.tornadoBonus | ultimateEarlyTornado | event |
| chr_0030_zhuangfy.skill.lastStrike | skillLastStrike | unmodeled：雷击逐次命中未建模 |
| chr_0030_zhuangfy.ult.comboCdSpeed | duringUltimate | state |
| chr_0030_zhuangfy.ult.freeSkill | firstSkillDuringUltimate | unmodeled：终结技期间首次战技免技力费用未建模（技力消耗由 mechanics 决定） |
| chr_0030_zhuangfy.talent1.elecAmp | onSkillCast | event |
| chr_0030_zhuangfy.pot1.extraSword | firstSkillInBattle | event-noop |
| chr_0030_zhuangfy.pot3.spRefund | skillConsumeConduct | event |
| chr_0030_zhuangfy.pot5.resIgnore | duringUltimate | event-noop |
| chr_0033_camille.skill.heatFragile | wingHovering | event |
| chr_0033_camille.talent1.combo | comboHitWingTarget | unmodeled：“连击”乘区未建模 |
| chr_0033_camille.talent2.heatBonus | afterSelfSkillHeal | event |
| chr_0033_camille.talent2.heatBonusOthers | afterSelfSkillHeal | event |
| chr_0033_camille.pot1.fragile | wingHovering | event |
| chr_0033_camille.pot5.heatBonus | afterSelfSkillHeal | event |
| chr_0033_camille.pot5.heatBonusOthers | afterSelfSkillHeal | event |
| chr_0031_mifu.skill.duanyunRefund | onSkillCast | event |
| chr_0031_mifu.combo.physFragile | afterComboHit | event |
| chr_0031_mifu.talent1.kaitianMul | targetPhysFragileOrStagger | state |
| chr_0031_mifu.pot1.fragile | afterComboHit | event |
| chr_0031_mifu.pot3.atk | afterComboCastCd45 | event |
| chr_0032_lizhiyan.combo.int.natureFragile | afterComboHit | event |
| chr_0032_lizhiyan.combo.int.coldFragile | afterComboHit | event |
| chr_0032_lizhiyan.combo.will.natureFragile | afterComboHit | event |
| chr_0032_lizhiyan.combo.will.coldFragile | afterComboHit | event |
| chr_0032_lizhiyan.ult.int.corrosion | ultimateFieldSpawn | handled |
| chr_0032_lizhiyan.talent1.int.artsAmp | duringUltimate | state |
| chr_0032_lizhiyan.talent1.will.natureFragile | ultimateHit | event |
| chr_0032_lizhiyan.talent1.will.coldFragile | ultimateHit | event |
| chr_0032_lizhiyan.pot1.int.spRefund | skillHitImprisoned | unmodeled：囹圄状态未建模 |
| chr_0032_lizhiyan.pot1.will.natureFragile | afterComboHit | event |
| chr_0032_lizhiyan.pot1.will.coldFragile | afterComboHit | event |
| chr_0032_lizhiyan.pot5.int.artsAmp | duringUltimate | state |
| chr_0032_lizhiyan.pot5.int.ultMul | intMode | state |
| chr_0032_lizhiyan.pot5.will.natureFragile | ultimateHit | event |
| chr_0032_lizhiyan.pot5.will.coldFragile | ultimateHit | event |
| chr_0032_lizhiyan.pot5.will.comboCd | afterUltimate2 | unmodeled：终结技二段破晦诀明未建模 |
| chr_0035_liino.skill.teamAtk | singingStance | event |
| chr_0035_liino.ult.teamAtk | highSingingStance | state |
| chr_0035_liino.ult.amp.electric | highSingingStance | state |
| chr_0035_liino.ult.amp.nature | highSingingStance | state |
| chr_0035_liino.talent2.spRefund | afterComboNextSkill | event |
| chr_0035_liino.pot1.spRefund | firstSkillInBattle | event |
| chr_0035_liino.pot1.teamAtk | singingOrHighStance | event |
| chr_0034_typhoea.skill.burstMul | enhancedShotConsumeAttach | unmodeled：猎矢强化射击未建模 |
| chr_0034_typhoea.combo.burstVuln | inArrowField | unmodeled：箭阵持续时间官方未给出 |
| chr_0034_typhoea.talent1.arrowMul | enhancedShot | unmodeled：猎矢强化射击未建模 |
| chr_0034_typhoea.pot1.atk | airborne | event |
| chr_0034_typhoea.pot3.burstVuln | inArrowField | unmodeled：箭阵持续时间官方未给出 |
| chr_0034_typhoea.pot5.burstMul | enhancedShot | unmodeled：猎矢强化射击未建模 |
| chr_0038_purrche.ult.artsFragile | specialGiftHit | unmodeled：代言人特殊赠礼概率未建模 |
| chr_0038_purrche.talent1.energy | skillFirstBlock | unmodeled：格挡未建模（对照靶不攻击） |
| chr_0038_purrche.talent1.giftChance | skillFirstBlock | unmodeled：格挡未建模（对照靶不攻击） |
| chr_0036_jsspsi.skill.inkRecord | inkMarked | unmodeled：笔意伤害记录与爆发未建模 |
| chr_0036_jsspsi.combo.perLayer | comboAttachLayers | state |
| chr_0036_jsspsi.ult.amp.cold | afterUltimateCast | event |
| chr_0036_jsspsi.ult.amp.heat | afterUltimateCast | event |
| chr_0036_jsspsi.talent1.comboCd | afterUltimateCast | event |
| chr_0036_jsspsi.pot1.inkRecord | inkMarked | unmodeled：笔意伤害记录与爆发未建模 |
| chr_0036_jsspsi.pot2.atk | comboHitLayers | event |
| suit_usp01.p2 | firstSkillInBattle | event |
| suit_phy01.p2 | afterPhysicalAnomaly | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| suit_attri01.p2 | comboCastNextSkill | event |
| suit_pulse_cryst01.p2 | afterApplyElectrify | event |
| suit_pulse_cryst01.p3 | afterApplyFreeze | event |
| suit_atb01.p2 | afterSkillSpRecover | event |
| suit_poise01.p2 | afterApplyBreach | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| suit_poise01.p3 | targetBreach4 | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| suit_fire_natr01.p2 | afterApplyBurn | event |
| suit_fire_natr01.p3 | afterApplyCorrosion | event |
| suit_criti01.p2 | afterCrit | unmodeled：模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模 |
| suit_criti01.p3 | critAtkStacksFull | unmodeled：模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模 |
| suit_atk02.p2 | teamSkillCast | event |
| suit_burst01.p2 | targetArtsAttach2Plus | event |
| suit_usp02.p1 | afterApplyAmpProtectFragileWeaken | event |
| suit_expend_spell01.p2 | afterConsumeElectrifyOrCorrosion | event |
| suit_combo_cd01.p2 | onComboCast | event |
| suit_crush_fracture.p2 | onSmashOrArmorBreak | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| suit_spellburst.p2 | onNatureOrColdBurst | event |
| wpn_sword_0008.p1 | skillHit | event |
| wpn_sword_0009.p1 | comboCast | event |
| wpn_sword_0005.p2 | physAnomaly | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_sword_0020.p2 | skillApplyFreeze | event |
| wpn_sword_0018.p2 | consumeArtsAnomaly | event |
| wpn_sword_0019.p2 | spRecoverBySelfSkill | event |
| wpn_sword_0015.p2 | knockUpThenNextUlt | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_sword_0021_ink.p2 | crystalOrFreezeThenNextSkillOrUlt | event |
| wpn_sword_0016.p2 | spRecoverBySelfSkill | event |
| wpn_sword_0016.p3 | spRecoverBySelfSkill | event |
| wpn_sword_0006.p2 | ultCast | event |
| wpn_sword_0010.p2 | enemyBurnOrCorrode | event |
| wpn_sword_0011.p2 | targetStaggered | state |
| wpn_sword_0012.p2 | spRecoverOrComboState | event |
| wpn_sword_0013.p2 | consumeBreachLayers | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_sword_0013.p3 | consumeBreachLayers | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_sword_0014.p2 | applyBurnOrConduct | event |
| wpn_sword_0014.p3 | applyBurnOrConduct | event |
| wpn_claym_0003.p1 | skillHit | event |
| wpn_claym_0009.p1 | heavyHit | event |
| wpn_claym_0011.p2 | artsBurst | event |
| wpn_claym_0014.p2 | consumeBreachLayers | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_claym_0013.p2 | skillApplyColdAttach | event |
| wpn_claym_0013.p3 | comboHitColdAttached | event |
| wpn_claym_0004.p2 | skillOrUltHit | event |
| wpn_claym_0008.p1 | heavyHitControlDouble | event |
| wpn_claym_0008.p2 | heavyHitAsMainControl | event |
| wpn_lance_0003.p1 | hpAbove80 | state |
| wpn_lance_0008.p1 | skillHit | event |
| wpn_lance_0004.p2 | applyBreachOnZero | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_lance_0013.p1 | targetColdOrFrozen | state |
| wpn_lance_0013.p2 | consumeFreeze | event |
| wpn_lance_0006.p2 | comboThenNextSkill | event |
| wpn_lance_0012.p1 | targetBreached | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_lance_0012.p2 | skillApplyBreach | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_lance_0012.p3 | skillApplyPhysFragile | event |
| wpn_lance_0010.p2 | physAnomaly | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_lance_0011.p2 | skillCast | event |
| wpn_lance_0011.p3 | comboCast | event |
| wpn_pistol_0002.p1 | skillHit | event |
| wpn_pistol_0003.p1 | comboCast | event |
| wpn_pistol_0006.p2 | applyArtsAnomaly | event |
| wpn_pistol_0012.p2 | consumeArtsAttach | event |
| wpn_pistol_0004.p2 | comboArtsBurstOrBurn | event |
| wpn_pistol_0010.p2 | skillOrComboCrit | unmodeled：模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模 |
| wpn_pistol_0005.p2 | enemyFreezeOrCorrode | event |
| wpn_pistol_0005.p3 | enemyFreezeOrCorrode | event |
| wpn_pistol_0008.p2 | skillCast | event |
| wpn_pistol_0008.p3 | skillApplyArtsAnomaly | event |
| wpn_pistol_0009.p2.heat | consume_燃烧 | event |
| wpn_pistol_0009.p2.electric | consume_导电 | event |
| wpn_pistol_0009.p2.cold | consume_冻结 | event |
| wpn_pistol_0009.p2.nature | consume_腐蚀 | event |
| wpn_funnel_0001.p1 | hpAbove80 | state |
| wpn_funnel_0003.p1 | skillHit | event |
| wpn_funnel_0005.p2 | ultCast | event |
| wpn_funnel_0004.p2 | applyConduct | event |
| wpn_funnel_0014.p2 | comboArtsBurstOrPhysAnomaly | event |
| wpn_funnel_0011.p2 | comboKnockUp | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_funnel_0011.p3 | comboKnockUp | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_funnel_0013.p2 | consumeCorrode | event |
| wpn_funnel_0006.p2 | skillApplyNatureAttach | event |
| wpn_funnel_0006.p3 | targetNatureAttachedCount | state |
| wpn_funnel_0008.p2 | artsBurst | event |
| wpn_funnel_0009.p2 | ultCast | event |
| wpn_funnel_0009.p3 | comboCast | event |
| wpn_funnel_0010.p1 | selfSkillHeal | unmodeled：治疗未建模 |
| wpn_sword_0017.p2 | applyBreachThenNextUlt | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_pistol_0007.p2 | comboCast | event |
| wpn_pistol_0011.p2 | skillOrUltApplyColdAttach | event |
| wpn_pistol_0011.p3 | skillOrUltApplyArtsFragile | event |
| wpn_sword_0022.p2 | critHit | unmodeled：模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模 |
| wpn_sword_0022.p3 | wolfBlood16 | unmodeled：模拟按不暴击计算时不会触发；选择必暴击/期望时同样未建模 |
| wpn_funnel_0015.p2 | skillConsumeArtsAnomaly | event |
| wpn_funnel_0015.p3 | ultCast | event |
| wpn_funnel_0017.p2 | gainElectricAmp | event |
| wpn_claym_0017.p2 | applyPhysFragile | event |
| wpn_claym_0017.p3 | slamConsumeBreach | unmodeled：破防 / 物理异常（击飞、倒地、猛击、碎甲）系统未建模（破防仅计层，不结算异常） |
| wpn_lance_0015.p2 | spRecoverBySelfSkill | event |
| wpn_lance_0015.p3 | selfSkillApplyHeatAttach | event |
| wpn_claym_0016.p2 | skillOrComboCast | event |
| wpn_lance_0007.p2 | selfSkillApplyHeatAttach | event |
| wpn_lance_0007.p3 | selfSkillApplyHeatFragile | event |
| wpn_funnel_0016.p2 | intGeWill&selfSkillApplyArtsAttach | event |
| wpn_funnel_0016.p3 | intGeWill&selfSkillApplyArtsFragile | event |
| wpn_funnel_0016.p4 | willGtInt&selfSkillArtsBurst | event |
| wpn_funnel_0016.p5 | willGtInt&selfSkillApplyArtsFragile | event |
| wpn_funnel_0018.p2 | comboApplyArtsFragileOrAttach | event |
| wpn_funnel_0018.p3 | comboApplyArtsFragileOrAttach | event |
| wpn_lance_0014.p2 | selfSkillHealOthers | unmodeled：治疗未建模 |
| wpn_sword_0026.p1 | battleStart | event |
| wpn_sword_0026.p2 | battleStart | event |
| wpn_lance_0016.p2 | comboHealOthers | unmodeled：治疗未建模 |
| wpn_funnel_0019.p2 | skillCast | event |
| wpn_funnel_0019.p3 | artsBurstWithWindStack | unmodeled：身形如风层数未建模 |
| wpn_funnel_0020.p2 | artsBurst | event |
| wpn_funnel_0020.p3 | artsBurstStacks4 | unmodeled：苦难的尽头层数未建模 |
| wpn_sword_0023.p2 | comboHeal | unmodeled：治疗未建模 |
| wpn_sword_0023.p3 | comboHeal | unmodeled：治疗未建模 |
| wpn_claym_0018.p2 | applyRoot | event |
| wpn_claym_0018.p3 | rootOrUltThenNextCombo | event |
| wpn_claym_0019.p2 | skillApplyColdOrHeatAttach | event |
| wpn_claym_0019.p3 | applyArtsAmpToOthers | event |
| wpn_sword_0024.p2 | comboApplyElectricAttach | event |
| wpn_sword_0024.p3 | comboApplyElectricAttach | event |
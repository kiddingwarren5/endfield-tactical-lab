# 触发表独立审核（Claude）

## 1. 版本与方法

- **审核对象**
  - `dist/engine/sim/triggers.js`：未入库，sha1 `3506e69`。
  - 对照实现 `dist/engine/sim/simulate.js`：工作区已修改，sha1 `12e44d9`。
  - 效果目录 `dist/data/effects.js`：sha1 `d112c67`。
  - `dist/data/mechanics.js`：sha1 `431e21d`。
  - 开始审核时 git HEAD 为 `4e99ec9`，这两个文件当时还在工作区。成文时它们已由并行会话提交进 `595a264`，内容与上述 sha1 一致。
- **审核期间的并行修改**：
  - `triggers.js` 新增了 `comboHitOtherTargetNearby`。
  - `simulate.js` 把 `hit` 事件改为每段命中各发一次。
  - 下文结论和实验均按上面列出的最终版本。
- **方法**
  1. 用脚本把 578 条效果按 `condition.trigger` 分组。逐码对照以下文本：
     - `condition.text` 与 `evidence.text`；
     - `operators.js` 中的技能、天赋、潜能原文；
     - 武器和套装原文；
     - 官方术语表（解包 `sources/raw/warfarin/operators/yvonne.data` 中的“脆弱/增幅/碎冰/连击”等定义）。
  2. 阅读 `simulate.js` 中 `fireTrigger`、`specMatches`、`statePred`、`startBuff` 和各事件的发出点，确认每种事件实际带哪些字段、何时发出。
  3. 对每个疑点，用 `simulate()` 跑最小算例（附录 A）。全程只读，未修改任何源文件。
- **判定口径**
  - **正确**：事件或状态类型、过滤字段都与原文一致，且模拟器确实会发出能匹配的事件。乘区或数值问题另列。
  - **有误**：满足以下任一条：
    - 类型或过滤字段与原文不符；
    - `handled` 不成立；
    - 映射在模拟器里永远不会触发，或会被错误触发。
  - **存疑**：语义基本对，但符合以下任一条：
    - 依赖未决的读法；
    - 被模拟器的其他实现（时长、消耗、冷却）明显扭曲。
  - **未建模·合理 / 不合理**：看 `U(...)` 的理由是否成立，即模拟器是否确实缺少所需机制，且无法用现有事件或状态表达。

## 2. 概要

| 项 | 代码数 | 涉及效果条数 |
|---|---|---|
| 触发表代码总数 | 196 | 302（带码、非 always） |
| 正确 | 57 | 100 |
| 有误 | 32 | 50 |
| 存疑 | 14 | 26 |
| 未建模·理由成立 | 81 | 107 |
| 未建模·理由不成立 | 12 | 19 |

影响最大的问题（按对伤害结果的影响排序）：

1. **“通过技能恢复技力”类 4 个码，触发来源接反了。**
   - 现状：
     - `spGain` 只在战技“返还”时发出，例如别礼、昼雪、卡契尔、噗切娜，以及汤汤涡流。
     - 连携技和终结技的真实“恢复”（卡缪、秋栗、弧光、阿列什、骏卫）不发事件。
   - 后果：拓荒、镀红祝福、不知归、O.B.J.轻芒、秋栗潜能1、骏卫天赋都被错误触发或永不触发。
   - 依据：rules C12、D21 已写明“返还技力不算恢复技力”，实现与之相反（R1、R2）。
2. **“施加增幅/脆弱后”类 10 个码缺少属性或受益者过滤。**
   - 原因：`applyDebuffCategory` 事件只带 `zone/by/who`。
   - 后果：
     - 物理脆弱会触发“施加法术脆弱”；
     - 任意脆弱会触发“施加灼热脆弱”；
     - 给自己的增幅会触发“对其他干员施加增幅”；
     - 雾中微光的“获得电磁增幅”被实现成“自己施加任意增幅”（R11）。
3. **两条 `handled` 实际没有处理，另有一处重复计算。**
   - 祀连携“每层附着提高倍率”从未生效（R9）。
   - 汤汤潜能1 的每处涡流 +5 技力从未加上（R8）。
   - 汤汤提前水龙卷的 +60% 被计了两次：既作为 ×1.6 的乘子，又作为 +60% 增伤（R7）。
4. **形态前缀 `intGeWill&`/`willGtInt&` 判断的对象错了。**
   - 现状：前缀比较的是干员技能形态，只有诀有形态。
   - 后果：四二式·肃阵在诀以外的任何人身上都永不触发（R6）。
5. **两条“命中时”的映射因执行顺序或主控限制永不生效。**
   - 埃特拉连携：物理命中先触发碎冰并删掉冻结，之后才判定“目标冻结”，所以物理脆弱永不施加（R3）。
   - 别礼潜能1：别礼不是主控时永不触发；触发时又变成 15 s 的普攻增伤（R5）。
6. **汤汤水龙卷脆弱与梨诺姿态的触发错误。**
   - 汤汤形成 3 个水龙卷时，两档法术脆弱同时生效：5% + 10%，应为 10%（R8）。
   - 梨诺的“姿态中止”会把演唱姿态延长 60 s，而不是结束它（R10）。
7. **12 个“未建模”其实可以用现有事件表达。**
   - 安塔尔聚焦、洁尔佩塔重力场、卡缪血翼盘桓、余烬护盾：单靶下都等价于“某技能后 N 秒”。
   - “消耗冻结”：模拟器里的碎冰就是消耗冻结（官方术语：“碎冰……消耗目标的冻结状态”）。
   - 其中安塔尔的电磁/灼热脆弱、洁尔佩塔的法术脆弱是核心增益，目前完全缺失。
8. **以下几项不在触发表内，但直接决定多条映射的结果（详见 §5）。**
   - 狼卫潜能5 的效果被标成 `mode=auto`，绕过了触发表，连携冷却恒为 0（R4）。
   - 破防和源石结晶被当作“法术附着”参与爆发与异常，污染了 attach、burst、consume、abnormal 四类事件（R12）。

## 3. 有误 / 存疑 / 未建模不合理 明细

下表“建议映射”里的约定：

- `ARTS` 代表 `['heat','cold','electric','nature']`。
- 标“新字段”的规格，`specMatches` 目前不支持。字段语义与模拟器侧需要的改动见 §6。

| 代码 | 效果示例 id | 官方原文摘录 | 当前映射 | 结论 | 建议映射或理由 |
|---|---|---|---|---|---|
| skillHit | chr_0005_chen.talent.edge（另 5 把武器共用） | 陈千语「斩锋」：“技能每次命中敌人时，攻击力+8%……最多叠加5层”；武器：“装备者的战技命中敌人时” | `hit('skill')` | 有误（共用码） | 陈千语的“技能”指战技、连携、终结技（目录 notes 同此理解），应另起码：`hit(['skill','combo','ultimate'])`。武器保持 `hit('skill')`。 |
| onComboCast | chr_0036_jsspsi.pot2.atk | “施放连携技成竹在胸时，攻击力+[8%+3%×消耗或吸收的最高附着层数]” | `cast('combo')` | 有误 | cast 事件在 `castCombo` 算出层数之前发出，且不带 `layers`，所以数值恒为 8（R9：消耗 3 层后 value=8）。建议祀潜能2 改用 `hit('combo')`，并让 skillHit 的 `hit` 事件携带 `layers`。同码的碾骨见 X5。 |
| onSkillCast | suit_usp01.p2 | “装备者释放战技时返还50点技力，此效果每场战斗最多触发一次” | `cast('skill')` | 有误（共用码） | 缺“每场一次”。改用 `firstSkillInBattle`，或让 `fireTrigger` 读取 `e.oncePerBattle`。同码的庄方宜天赋1 公式变量 `hits` 未提供，实测值为 0（R11d，见 X7）。 |
| comboApplyArtsFragileOrAttach | wpn_funnel_0018.p2/p3 | “装备者通过连携技施加法术脆弱或法术附着时” | `[{on:'attach',by:'combo'},{on:'applyDebuffCategory',zone:'fragile',by:'combo'}]` | 有误 | 脆弱分支不分属性，物理脆弱（弭弗、埃特拉连携）也会触发。附着分支会被伪附着触发：洛茜连携的 breach、管理员连携的 originiumCrystal。建议 `[{on:'attach',by:'combo',elementIn:ARTS},{on:'applyDebuffCategory',zone:'fragile',by:'combo',damageClass:'arts'}]`（damageClass 为新字段）。 |
| intGeWill&selfSkillApplyArtsAttach | wpn_funnel_0016.p2 | “装备者智识值≥意志值：装备者通过自身技能施加法术附着时” | `{on:'attach'}`，门槛=形态 0 | 有误 | 门槛按 `members[owner].mode` 判定，只有诀有 mode，其他装备者为 undefined，永不触发（R6）。前缀应比较装备者面板的智识与意志。另加 `elementIn:ARTS`。 |
| willGtInt&selfSkillArtsBurst | wpn_funnel_0016.p4 | “装备者意志值>智识值：……通过自身技能施加法术爆发时” | `{on:'burst'}`，门槛=形态 1 | 有误 | 门槛问题同上。另加 `elementIn:ARTS`，排除 breach 伪爆发（R12a）。 |
| intGeWill&selfSkillApplyArtsFragile | wpn_funnel_0016.p3 | “……智识值≥意志值：……通过自身技能施加法术脆弱时” | `{on:'applyDebuffCategory',zone:'fragile'}`，门槛 0 | 有误 | 门槛问题同上，且物理脆弱也会触发。建议 `{on:'applyDebuffCategory',zone:'fragile',damageClass:'arts'}`，门槛改为比较面板属性。 |
| willGtInt&selfSkillApplyArtsFragile | wpn_funnel_0016.p5 | 同上（意志>智识） | 同上，门槛 1 | 有误 | 同上。 |
| enemyFrozenOrCrystal | chr_0024_deepfin.talent.freezeEnergy | “附近有敌人被冻结或被附着源石结晶时，自身获得4点终结技能量……每3秒内最多触发一次” | `{state:'targetFrozen'}` | 有误 | 原文是“被冻结时”这一事件，不是状态，且不限施加者。建议 `{on:'abnormal',which:'freeze',anyone:true}`；结晶分支未建模；“每 3 秒一次”需要 `cooldown`（新字段）。energyGain 区目前不被消费，见 X10。 |
| comboHitFrozen | chr_0021_whiten.combo.physFragile | “如果命中处于冻结状态的敌人，还会造成额外伤害并施加物理脆弱” | `hit('combo',{state:'targetFrozen'})` | 有误 | 埃特拉连携是物理伤害。`doHit` 内先触发碎冰并删除冻结，之后 `fireTrigger` 判定时目标已不冻结，所以永不施加（R3：“对冻结敌人伤害倍率”段命中、碎冰发生，但无 physFragile）。建议 `hit('combo',{targetHad:{abnormal:'freeze'}})`（新字段，用施放时快照；模拟器的 `attachAtCast` 需同时记录 `S.abnormal`）。 |
| skillConsumeColdAttach | chr_0024_deepfin.pot1.spRefund | “战技非常规路亚触发恢复技力效果时，额外恢复10点技力” | `{on:'consume',element:'cold',by:'skill'}` | 有误（死映射） | `castSkill` 从不执行 `mech.skill.consumes`；异常路径发出的 consume 事件不带 `element`。所以永远匹配不上。应改为 `U('战技消耗附着未建模')`；或在 `castSkill` 实现 consumes，并发出 `{on:'consume',element,by:'skill',layers}`。 |
| comboAttachLayers | chr_0036_jsspsi.combo.perLayer | “伤害根据消耗或吸收附着的最高层数获得提升”［每层 +44%…100%］ | `{handled:'按消耗层数的倍率加成由 layers 变量结算'}` | 有误（handled 不成立） | handled 型既不进事件分支也不进状态分支，这条 ratioAdd 从未进入 applied。R9：消耗 3 层后祀连携倍率 = 750%×1.15 = 8.625，没有 +300%。建议改 `{state:'always'}`，并让 `activeBuffsFor` 的状态分支用当前段的 `vars.layers` 求值。 |
| skillApplyFreeze | wpn_sword_0020.p2 | “装备者通过战技施加冻结时” | `{on:'abnormal',which:'freeze'}` | 有误 | 缺 `by`，连携、终结技造成的冻结也会触发。建议 `{on:'abnormal',which:'freeze',by:'skill'}`。 |
| skillApplyArtsAnomaly | wpn_pistol_0008.p3 | “装备者通过自身战技施加法术异常时” | `{on:'abnormal'}` | 有误 | 缺 `by:'skill'`；另需排除结晶造成的 which=undefined 伪异常（R12b）。建议 `{on:'abnormal',by:'skill',whichIn:['burn','conduct','freeze','corrosion']}`。 |
| comboArtsBurstOrBurn | wpn_pistol_0004.p2 | “装备者通过连携技造成法术爆发或施加燃烧时” | `[{on:'burst',by:'combo'},{on:'abnormal',which:'burn'}]` | 有误 | 燃烧分支缺 `by:'combo'`。建议 `[{on:'burst',by:'combo'},{on:'abnormal',which:'burn',by:'combo'}]`。 |
| applyArtsAmpToOthers | wpn_claym_0019.p3 | “装备者对小队内其他干员施加法术增幅后” | `{on:'applyDebuffCategory',zone:'amp'}` | 有误 | 不分受益者：只给自己的增幅也会触发（R11d：庄方宜“对自身施加电磁增幅”即触发）。建议 `{on:'applyDebuffCategory',zone:'amp',toOthers:true,damageClass:'arts'}`（新字段）。 |
| gainElectricAmp | wpn_funnel_0017.p2 | “装备者获得电磁增幅时” | `{on:'applyDebuffCategory',zone:'amp'}` | 有误（方向相反） | 现映射等于“装备者施加任意增幅”。R11b：赛希自施寒冷增幅就触发；R11c：安塔尔给全队电磁增幅，持有者不触发。建议 `{on:'applyDebuffCategory',zone:'amp',element:'electric',anyone:true,receivedByOwner:true}`（新字段）。 |
| skillOrUltApplyArtsFragile | wpn_pistol_0011.p3 | “装备者通过战技或终结技施加法术脆弱时” | `{on:'applyDebuffCategory',zone:'fragile'}` | 有误 | 缺施放来源和法术属性过滤。建议 `{on:'applyDebuffCategory',zone:'fragile',byIn:['skill','ultimate'],damageClass:'arts'}`。 |
| selfSkillApplyHeatFragile | wpn_lance_0007.p3 | “装备者通过自身技能施加灼热脆弱时” | 同上 | 有误 | 任何脆弱都会触发：汤汤的法术脆弱就触发了灯火使命 p3（R13）。建议 `{on:'applyDebuffCategory',zone:'fragile',element:'heat'}`。 |
| skillApplyPhysFragile | wpn_lance_0012.p3 | “装备者通过自身战技施加物理脆弱时” | 同上 | 有误 | 建议 `{on:'applyDebuffCategory',zone:'fragile',by:'skill',element:'physical'}`。 |
| applyPhysFragile | wpn_claym_0017.p2 | “装备者施加物理脆弱时” | 同上 | 有误 | 建议 `{on:'applyDebuffCategory',zone:'fragile',element:'physical'}`。 |
| spRecoverBySelfSkill | wpn_sword_0019.p2、wpn_sword_0016.p2/p3、wpn_lance_0015.p2 | “装备者通过自身技能恢复技力后” | `{on:'spGain',source:'selfSkill'}` | 有误 | 详见 X2：会被“返还”触发（别礼、昼雪、卡契尔、噗切娜、汤汤涡流），而真正的“恢复”（卡缪、秋栗、弧光连携、阿列什、骏卫）不发事件（R1、R2）。建议 `{on:'spGain',source:'selfSkill',recover:true}`，并在模拟器侧补全恢复来源。 |
| afterSkillSpRecover | suit_atb01.p2、chr_0019_karin.pot1.atk | 拓荒：“装备者通过技能恢复技力后，全队造成的伤害+16%”；秋栗潜能1：“通过技能恢复技力时” | 同上 | 有误 | 同上。rules D21 写明“别礼/汤汤等返还型战技不会触发拓荒”，实现正好相反（R1）。秋栗的恢复都来自连携和终结技，目前永不触发。 |
| afterSelfSkillSpRecover80 | chr_0029_pograni.talent1.atk/arts | “通过自身技能每恢复80点技力后，获得持续20秒的士气激昂” | 同上 | 有误 | 缺累计阈值：每 80 点一层，潜能3 起 60 点。建议 `{on:'spGain',source:'selfSkill',recover:true,per:80}`（新字段 `per`）。骏卫的恢复来自战技、连携、终结技，目前都不发事件。 |
| spRecoverOrComboState | wpn_sword_0012.p2 | “装备者通过自身技能恢复技力或获得连击状态后” | 同上 | 有误 | 来源问题同上，并缺“获得连击”分支（黎风连携、秋栗终结技、卡缪天赋1）。建议 `[{on:'spGain',source:'selfSkill',recover:true},{on:'comboState'}]`（新事件）。 |
| heavyHit | wpn_claym_0009.p1、wpn_claym_0008.p1 | “装备者对敌人造成重击时”；破碎君王另有“若装备者为主控干员，攻击力提升的数值翻倍” | `{on:'heavy'}` | 有误 | heavy 事件只在主控重击时发出。破碎君王写了“主控时翻倍”，说明非主控也能触发。建议 `hit('normal',{heavy:true})`，模拟器已对非主控普攻的最后一段标 `heavy:true`。“主控翻倍”目前也没有实现。 |
| infusedHeavyHit | chr_0026_lastrite.pot1.heavyExtra/heavyPoise | “受到低温灌注的主控干员，重击命中敌人时额外造成20%伤害和5点失衡” | `{on:'heavy',infused:true}` | 有误 | 有两处错：<br>① 事件的 who 是主控，别礼不是主控时被“只认本人”滤掉，永不触发（R5）。<br>② 触发后变成给主控所有普攻的 15 s 增伤，而原文只作用于那一次灌注重击。<br>建议改为状态型 `{state:'ownerInfusedHeavy'}`（新状态：当前段是主控重击，且待结算灌注属于该效果拥有者时为真），或在 `normalHit` 的灌注结算处直接处理并标 handled。 |
| tornadoCount2 | chr_0027_tangtang.skill.fragile2 | 参数：“两个水龙卷法术脆弱 3%…5%；三个水龙卷法术脆弱 6%…10%” | `{on:'tornado',min:2}` | 有误 | 3 个水龙卷时 fragile2 与 fragile3 同时生效（R8：5% + 10%，应为 10%）。建议 `{on:'tornado',min:2,max:2}`（新字段 `max`）。 |
| ultimateEarlyTornado | chr_0027_tangtang.talent2.tornadoBonus | “此次形成的水龙卷效果同战技……造成的伤害+60%” | `{on:'earlyWave',duration:1}` | 有误（重复计算） | `castPlunge` 已用 mechanics 的 `plungeDuringUlt.tornadoBonus=0.6` 把伤害乘 1.6，本触发又加了 +60% 增伤（R7：factor=1.6，applied 含 tornadoBonus:60）。建议保留本映射（潜能5 的 +80% 只经效果目录生效），把 mechanics 里的 `tornadoBonus` 置 0。 |
| skillConsumeVortex | chr_0027_tangtang.pot1.spRefund | “战技踏潮卷浪！每消耗一处涡流形成水龙卷，额外返还5点技力” | `{handled:'……由 castSkill 按涡流数结算'}` | 有误（handled 不成立） | `castSkill` 只用 mechanics 的 20 技力/处，不读潜能1（R8：潜能1、2 处涡流只返还 40，应为 50）。另外 mechanics 写的是 kind=返还，`castSkill` 却按真实技力记账，与 C12 不符。 |
| singingStance | chr_0035_liino.skill.teamAtk | “持续期间战技替换为姿态中止，施放将提前结束演唱姿态”；高歌姿态“代替演唱姿态” | `cast('skill',{duration:60})` | 有误 | 有两处错：<br>① 第二次施放（姿态中止，0 技力）把姿态刷新到 65 s，而不是结束它（R10）。<br>② 高歌期间演唱姿态的 buff 仍在，两份攻击力叠加，而原文是互斥的。<br>建议 `cast('skill',{stage:0,duration:60,endOn:[cast('skill',{stage:1}),cast('ultimate')]})`（新字段；cast 事件需带链阶段号）。 |
| targetPhysFragileOrStagger | chr_0031_mifu.talent1.kaitianMul | “战技开天命中时，若目标处于物理脆弱或失衡状态，伤害倍率提升至原本的1.2倍” | `{state:'targetStaggered'}` | 有误 | 漏了“物理脆弱”分支。弭弗自己的连携就施加 16–20 s 物理脆弱，放开天时常常满足。建议 `[{state:'targetStaggered'},{state:'targetFragile',element:'physical'}]`（新状态）。 |
| duringUltimate | chr_0017_yvonne.pot5.atk、chr_0030_zhuangfy.ult.freeSkill | 伊冯：“终结技冷冻射手持续期间”（参数 7 秒）；庄方宜：天理合真（参数 25 秒）；“首次施放战技惊霆诀不消耗技力” | `{state:'duringUltimate'}` | 存疑 | 语义正确，但持续时间算错，另有一条效果误用了状态型：<br>① 时长：`statePred` 用 `ultActiveUntil` = 施放 + 3 s + `(mech.duration‖12)`，而 mechanics 里所有干员的 `ultimate.duration` 都缺省，所以一律算成 15 s（伊冯应 7 s，庄方宜 25 s，诀 20 s，洁尔佩塔 5 s）。应读取 `skills.ultimate.params.duration`。<br>② freeSkill 原文是“状态内首次施放战技”，属于事件型，应另起码。 |
| duringUltimateNormalHit | chr_0017_yvonne.ult.critRate | “每次普通攻击都会增加自己的暴击率” | `hit('normal',{state:'duringUltimate'})` | 存疑 | 时长问题同上：7 s 被算成 15 s，层数偏多。默认不暴击时对伤害无影响。 |
| ultimateFieldSpawn | chr_0032_lizhiyan.ult.int.corrosion | “破晦阵生成时，还会对区域内的敌人强制施加腐蚀” | `cast('ultimate')` | 存疑 | 触发时机对，但效果是 `zone=other` 的空 buff：不会设置 `S.abnormal.corrosion`，腐蚀减抗不生效，也不发 abnormal 事件，所以领航者、黯色火炬、动火用都不会被触发。应在 mechanics 中给诀·智终结技加强制腐蚀（无初始伤害），再把本码标 handled。 |
| afterComboCast | chr_0031_mifu.pot3.atk | 怒意留心：“施放连携技后获得……护盾……该效果每60秒最多触发一次”；潜能3：“护盾触发间隔-15秒，每次触发时额外获得攻击力+6%” | `cast('combo')` | 存疑（共用码） | 缺 45 s 内置冷却；弭弗连携冷却 17–19 s，会多算。同码的梨诺天赋2 是“下一次战技、仅电磁/自然受益者、触发后结束”，语义不同。建议弭弗用 `cast('combo',{cooldown:45})`（新字段）。 |
| teamSkillCast | suit_atk02.p2 | “当小队内任意干员施放战技时，装备者获得一层应龙之锐，使得该干员下一次连携技伤害+20%” | `cast('skill',{anyone:true})` | 存疑 | 触发正确。但 duration=null，被缺省成 15 s 后过期，也不会在下一次连携后消耗（X5）。“该干员”指谁仍未定（目录已注明）。 |
| comboThenNextSkill | wpn_lance_0006.p2 | “装备者施放连携技后，30秒内的下次战技期间造成的电磁伤害+10%” | `cast('combo',{duration:30})` | 存疑 | 表头注释说“持续到下次该类技能”，但实现并不会在下次战技后结束：30 s 内所有战技都吃加成。建议 `cast('combo',{duration:30,consumeOn:cast('skill')})`（新字段）。 |
| rootOrUltThenNextCombo | wpn_claym_0018.p3 | “装备者对敌人施加定身或施放终结技后，20秒内的下个连携技造成的伤害+25%” | `[{on:'root',duration:20},cast('ultimate',{duration:20})]` | 存疑 | 同上，缺 `consumeOn:cast('combo')`。 |
| crystalOrFreezeThenNextSkillOrUlt | wpn_sword_0021_ink.p2 | “装备者施加源石结晶或冻结时，20秒内的下次战技或终结技期间，造成的物理伤害+36%” | `[{on:'abnormal',which:'freeze',duration:20}]` | 存疑 | 同上，缺 `consumeOn`。结晶分支缺失，但结晶本身未建模，这一点理由成立。 |
| skillApplyNatureAttach | wpn_funnel_0006.p3 | “每有一个被自然附着的敌人，小队内其他干员获得法术伤害额外+2.0%，最多+6.0%” | 与 p2 共用 `{on:'attach',by:'skill',element:'nature'}` | 存疑（共用码） | p3 实际是“p2 生效期间按被自然附着的敌人数计算”的状态，且公式变量 `enemies` 未提供，值恒为 0。建议 p3 改为 `{state:'targetAttached',element:'nature'}`（新状态），单靶下取 enemies=1。 |
| targetColdOrFrozen | wpn_lance_0013.p1 | “对处于寒冷附着和冻结状态的敌人造成的伤害+8%” | `{state:'targetColdOrFrozen'}` | 存疑 | “和”可读作“或”（现实现），也可读作“同时满足”，目录 notes 已标需实测。保持现状，记为未决。 |
| afterShatter | chr_0021_whiten.talent.shatterRefund | “每当触发碎冰效果后，下一次战技凝声会返还15技力” | `{on:'iceShatter'}` | 存疑 | 原文没有限定由埃特拉触发，现实现只认埃特拉自己打出的碎冰。倾向改为 `{on:'iceShatter',anyone:true}`，需实测。spRefund 区目前不被消费（X10）。 |
| afterApplyAmpProtectFragileWeaken | suit_usp02.p1 | “装备者施加增幅、庇护、脆弱、虚弱后，使其他队友造成的伤害+16%” | `{on:'applyDebuffCategory'}` | 存疑 | 有三点：<br>① 事件在 `zone=vulnerable`（“受到的伤害+”类）时也会发出，而原文没有列“易伤”（R11a：玉中身“使目标受到的伤害+”就触发了长息）。但官方术语表把“法术脆弱”定义为“目标受到的法术伤害提高”，“受到X伤害+”算不算脆弱仍未定。<br>② 再次施加（buffRefresh）时不发事件，长息不会刷新。<br>③ 状态型增幅（如诀·智终结技 24%）永远不发事件。<br>建议 `zoneIn:['amp','fragile']`，vulnerable 待定；并让刷新也发事件。 |
| targetHpBelow50 | chr_0005_chen.pot1.lowHp、chr_0024_deepfin.pot5.ultRatio | “对生命值少于50%的敌人造成的伤害+20%” | `{state:'never'}` | 存疑 | “对照靶无限血”是假设；真实战斗中约后一半时间满足。建议做成可配置项（如从第几秒起满足），至少在结果中标注。 |
| skillFirstTarget | chr_0021_whiten.pot3.firstHit | “对首个命中敌人的伤害+40%” | `U('首个命中目标区分未建模')` | 存疑 | 该效果 `mode=auto`，模拟器经 `permanentBuffs` 让它恒定生效（单靶即首个目标，目录也注明“默认生效”），触发表和 `docs/trigger-coverage.md` 却记为“未建模”，两边口径矛盾。建议改 `{state:'always'}`。 |
| consume_冻结 | wpn_pistol_0009.p2.cold | “装备者消耗法术异常后，使目标敌人受到对应属性的伤害+10.0%” | `U('法术异常的消耗未建模')` | 未建模不合理 | 官方术语：“碎冰：对处于冻结状态的敌人施加破防或物理异常时触发，消耗目标的冻结状态”。模拟器已实现碎冰：删除冻结并发出 iceShatter，who 为打碎者。建议 `{on:'iceShatter'}`。 |
| consumeFreeze | wpn_lance_0013.p2 | “消耗冻结后，攻击力+12.0%，持续15秒” | 同上 | 未建模不合理 | 同上，建议 `{on:'iceShatter'}`。 |
| consumeArtsAnomaly | wpn_sword_0018.p2 | “装备者消耗法术异常后，攻击力+7.5%” | 同上 | 未建模不合理（部分） | 冻结分支可先用 `[{on:'iceShatter'}]`。燃烧、导电、腐蚀分支要等 `castSkill`/`castUlt` 执行 mechanics 中已有的 `consumes:{abnormal}` 后再补。 |
| afterSelfSkillHeal | chr_0033_camille.talent2.heatBonus（共 4 条） | “每当通过技能回复自身生命值时……如果自身生命值已满，每次触发可获得2层效果” | HEAL | 未建模不合理 | 卡缪自身回复的唯一来源是天赋「追罪之人」：连携命中被血翼盘桓的敌人（或施放追猎）。这里只需要事件，不需要治疗数值。建议 `hit('combo')`（近似：血翼 45 s，长于连携冷却 18 s），并按 hpAbove80 同一满血假设每次 +2 层。 |
| crystalHealAtFullHp | chr_0011_seraph.skill.artsAmp、pot1.artsAmp | “当主控干员对敌人造成重击时支援晶体为其回复生命值，该效果最多可触发2次……若触发回复时主控干员生命值已满，则额外对其施加一段时间的法术增幅” | HEAL | 未建模不合理 | 同样不需要治疗数值。在 hpAbove80 = always 的满血假设下，条件就是“赛希战技后 20 s 内主控重击，最多 2 次”。建议 `{on:'heavy',anyone:true,ownerRecent:{kind:'skill',within:20},maxPerCast:2}`（新字段）。 |
| targetElectricFragile | chr_0012_avywen.pot5.recallRatio | “召回的雷枪、强雷枪命中处于电磁脆弱状态的敌人时，伤害倍率提升至原本的1.15倍” | U | 未建模不合理 | 电磁脆弱就是 `S.buffs` 里的普通效果（艾维文娜天赋、安塔尔战技），可以直接判定。建议 `{state:'targetFragile',element:'electric'}`，与 targetPhysFragileOrStagger 共用新状态。 |
| hasUltimateShield | chr_0009_azrila.pot5.shieldAtk | 终结技：“使全队获得基于余烬最大生命值的护盾”（持续 10 秒）；潜能5：“该护盾存在期间持有者攻击力+10%” | `U('护盾未建模')` | 未建模不合理 | 对照靶不攻击，护盾不会被打破，等价于“终结技后 10 s 全队”。建议 `cast('ultimate')`，效果已录 duration=10、ben=team。 |
| targetFocused | chr_0023_antal.skill.electricFragile/heatFragile | “对敌人施加长时间聚焦……被聚焦的敌人受到电磁脆弱和灼热脆弱，同时最多聚焦1个敌人”（持续 60 秒） | U | 未建模不合理 | 单靶下“被聚焦”就是战技命中后 60 s。建议 `hit('skill')`，持续取效果的 60。影响很大：安塔尔的核心增益目前完全缺失。 |
| focused20s | chr_0023_antal.pot5.electricFragile/heatFragile | “聚焦同一个目标20秒以后，电磁脆弱和灼热脆弱效果会提高4%” | U | 未建模不合理 | 同上，但要延迟 20 s 起效。建议 `hit('skill',{delay:20,duration:40})`（新字段 `delay`）。 |
| inGravityField | chr_0013_aglina.ult.fragile.base | “处于重力紊乱区域中的目标被施加缓速和法术脆弱”（力场持续 5 秒） | U | 未建模不合理 | 单靶位置固定，终结技后 5 s 内一直在区域中。建议 `cast('ultimate')`，效果已录 duration=5。 |
| wingHovering | chr_0033_camille.skill.heatFragile、pot1.fragile | “随后衔火血翼将在目标周围盘桓一段时间，期间对目标施加虚弱和灼热脆弱”（持续 45 秒） | U | 未建模不合理 | 单靶下等于战技命中后 45 s。建议 `hit('skill')`，效果已录 duration=45；潜能1 的 +15 s 另需处理。 |
| airborne | chr_0034_typhoea.pot1.atk | 战技：“跃入空中进入短暂浮空状态，期间可施放5次空中普通攻击”；潜能1：“处于浮空状态时，攻击力+18%” | `U('浮空状态未建模')` | 未建模不合理 | 模拟器把空中攻击当作战技段结算，这些段都发生在浮空期间。建议 `cast('skill',{duration:<覆盖战技各段>})`；浮空时长需实测。 |

## 4. 同一代码被多个效果共用、语义却不同

| 代码 | 共用效果 | 语义差异 | 处理 |
|---|---|---|---|
| skillHit | 陈千语「斩锋」与 5 把“战技命中”武器 | “技能”与“战技”范围不同 | 陈千语另起码（§3） |
| onComboCast | 祀潜能2、碾骨、清波 | 祀潜能2 需要消耗层数；碾骨是“下一次战技”，用后消耗；清波是 15 s、每层独立计时 | 祀潜能2 改 `hit('combo')`；碾骨补 `consumeOn` |
| onSkillCast | 天灾防护、庄方宜天赋1、弭弗断云返还（auto） | 天灾防护每场一次；庄方宜每次施放重置并随雷击递增 | 天灾防护改 `firstSkillInBattle` |
| afterComboCast | 黎风连击、弭弗潜能3、梨诺天赋2 | 弭弗有 45 s 内置冷却；梨诺是“下一次战技、限属性受益者、触发后结束” | 分码 |
| skillApplyNatureAttach | 蚀迹 p2、p3 | p2 是事件；p3 是“按自然附着敌人数”的状态 | p3 改状态型（§3） |
| comboKnockUp | 使命必达 p2、p3 | 同上（事件 + 按敌人数的状态）；两条目前都未建模 | 将来建模时分码 |
| duringUltimate | 9 条 | 庄方宜 freeSkill 是“状态内首次施放战技”的事件 | freeSkill 另起码 |

另外有一批**同义多码**，语义相同、只是名字不同，可以在拆完上表后合并：

- `afterApplyConduct` / `applyConduct` / `afterApplyElectrify`
- `skillCast` / `onSkillCast`（拆分后）
- `comboCast` / `afterComboCast` / `onComboCast`（拆分后）
- `afterUltimateCast` / `ultCast` / `afterUltimate`
- `skillHitSingle` / `skillSingleHit`
- `spRecoverBySelfSkill` / `afterSkillSpRecover`

## 5. 横向问题（模拟器实现影响多条映射）

这些问题不能只靠改触发表解决，但会让上面判为“正确”的映射在结果里出错，或者永远不生效。

- **X1 伪附着（R12）。** mechanics 把两种非法术附着写成了 attach 元素：
  - 破防：卡契尔战技、洛茜连携的 `attach.element='breach'`；
  - 源石结晶：管理员连携的 `'originiumCrystal'`。

  `applyAttach` 把它们当法术附着处理，于是：
  - 同元素再施加，产生“法术爆发 breach”；
  - 寒冷施加到 breach 上，触发冻结并消耗 breach 层；
  - 结晶施加到寒冷附着上，产生 which=undefined 的异常。

  受污染的映射：`intGeWill&selfSkillApplyArtsAttach`、`comboApplyArtsFragileOrAttach`、`targetArtsAttach2Plus`、`artsBurst`、`willGtInt&selfSkillArtsBurst`、`consumeArtsAttach`、`applyArtsAnomaly`。

  另外，卡契尔“立盾期间受到攻击才反击施加破防”被无条件施加：`castSkill` 只识别“01号位/改为/重击”这几种 `when` 条件。

  因此 CRYSTAL、BREACH 两组 `U()` 写的“未建模”并不完全准确：它们已经以错误的方式进入了状态。建议在模拟器侧排除这两类元素；触发表侧把相关码都加上 `elementIn:ARTS` / `whichIn` 作为防线。
- **X2 spGain 来源语义（R1、R2）。**
  - `gainSp(..., {source:'selfSkill'})` 只在 `castSkill` 的 spRefund 和汤汤涡流处调用，不区分 kind=返还/恢复。
  - `castCombo`、`castUlt` 完全不处理 mechanics 中的 spRefund：卡缪连携 16–20、终结技 32–40；秋栗终结技 58–80；弧光连携；阿列什；骏卫。
  - 阿列什战技的 `byLayers` 被 `num()` 解析为 0。
  - 结果：所有“恢复技力”触发都被返还驱动，真实的恢复事件一个也没有。
- **X3 `applyDebuffCategory` 事件信息不足。**
  - 事件只带 `zone/by/who`，没有属性（`e.applies.elements`）、伤害类别（`damageClass`）、受益者。
  - 只在 `startBuff` 新建时发出，刷新时不发。
  - 只有事件触发的效果会发出；状态型和常驻效果都不发。
  - §3 中 10 个有误码的根源都在这里。
- **X4 终结技持续时间。** 见 §3 duringUltimate：`mech.duration` 全部缺省，所有终结技都按 12 s（加 3 s 演出）计算。
- **X5 “下一次 X”类效果不会被消耗。**
  - duration=null 被 `startBuff` 缺省成 15 s。
  - 没有任何机制在下一次技能后结束这些 buff。
  - 涉及：50式应龙、碾骨、向心之引、玉中身 p3、宏愿、埃特拉天赋、梨诺天赋2。
- **X6 冷却与次数限制未执行。** `fireTrigger` 只看 `spec.once`，以下三类都不执行：
  - `e.oncePerBattle`；
  - `e.cooldown`；
  - 原文的“每 N 秒最多触发一次”。

  影响结果的有弭弗潜能3（45 s）。天灾防护（每场一次）属于 spRefund 区，目前不被消费。
- **X7 公式变量缺失时求值为 0。**
  - `startBuff` 和状态分支只提供 `layers`，而且 cast 时 `layers` 还没有算出来。
  - 受影响：庄方宜天赋1（`hits`，实测 value=0）、蚀迹 p3 与使命必达 p3（`enemies`）、卡契尔潜能1（`def`）、祀潜能2（layers=0）。
- **X8 带码但 `mode=auto` 的 4 条效果绕过了触发表。**
  - **狼卫潜能5 comboReset（afterUltimate）**：`castCombo` 把 auto 的 cdr 当常驻，100% 冷却缩减让连携冷却恒为 0（R4：未放终结技，两次连携都是 cooldownUntil = 施放时刻）。这是高影响 bug，`condition.mode` 应改为 user。
  - 别礼低温脆性：结果正确，handled 成立（实测终结技脆弱 12%×1.5 → 1.18）。
  - 埃特拉潜能3：见 §3。
  - 弭弗断云返还：spRefund 区；返还由 mechanics 链处理，这条效果本身不生效，无害。
- **X9 部分连携触发条件不被支持。**
  - `trMet` 不支持 `custom` / `skillState` / `execute` 类型，因此赛希、洛茜、余烬、昼雪、卡契尔、秋栗、阿列什、提弗洛斯、噗切娜的连携在模拟中永远不会就绪。
  - 后果：`comboHitColdOrFrozen`（赛希天赋1）、`afterCombo2`（洛茜）等映射虽然正确，却不可能触发。
  - `targetCondition` 被忽略：伊冯、艾尔黛拉、艾维文娜、黎风、庄方宜、安塔尔的连携不检查目标状态。
- **X10 触发后不生效的效果区。** 共 24 条映射为事件或状态的效果落在模拟器不消费的效果区：
  - spRefund 6 条、energyGain 4 条、cdr 2 条、other 10 条、poise 2 条；
  - 祀天赋1 的 cdr 由 `castUlt` 单独处理，不计入。

  这些映射对不对，在结果里看不出来。例如伊冯潜能1/4、埃特拉天赋/潜能5、阿列什天赋、梨诺天赋2/潜能1、天灾防护、萤石潜能5、庄方宜终结技冷却 4 倍速、诀·智强制腐蚀。

## 6. 建议新增的规格字段

| 字段 / 状态 | 用途 | 模拟器侧需要的改动 |
|---|---|---|
| `damageClass`、`element`、`elementIn`（用于 applyDebuffCategory） | 区分法术、物理脆弱，以及属性脆弱和增幅 | `startBuff` 发事件时附上 `e.applies.elements`、`e.applies.damageClass` |
| `toOthers`、`receivedByOwner` | 悠久传承“对其他干员施加”、雾中微光“获得” | 事件附上受益者集合（由 `beneficiary` 与 slot 推出） |
| `recover:true`、`per:N` | 区分恢复与返还；骏卫“每恢复 80 点” | 返还不发或标 `recover:false`；补连携、终结技的恢复；按 (效果, 拥有者) 累计 |
| `max` | 汤汤“恰好 2 个水龙卷” | `specMatches` 增加上限判断 |
| `stage`、`endOn` | 梨诺姿态中止、高歌替代 | cast 事件带链阶段号；增加结束 buff 的事件钩子 |
| `consumeOn` | “下一次战技/连携/终结技”类 | 被匹配的事件发生后移除 buff |
| `cooldown`、`maxPerCast`、`delay`、`ownerRecent` | 内置冷却、赛希晶体 2 次、安塔尔 20 s 后、晶体 20 s 窗口 | 记录 (效果, 拥有者) 的上次触发时间与来源技能时间 |
| `targetHad:{abnormal}` | 埃特拉连携“命中冻结” | `attachAtCast` 快照同时记录 `S.abnormal` |
| 状态 `targetFragile:{element}`、`targetAttached:{element}`、`ownerInfusedHeavy` | 弭弗开天、艾维文娜潜能5、蚀迹 p3、别礼潜能1 | `statePred` 扫描 `S.buffs` / `S.attach` / `pendingHeavyAttach` |
| 前缀 `intGeWill&` / `willGtInt&` 的语义 | 四二式·肃阵 | 比较装备者 `stats.abilities.int/will`，不再看 `member.mode` |

## 7. 目录有代码但触发表缺失

- **比对方法**：
  1. 取 `effects.js` 中所有 `condition.trigger`，排除 `always`。
  2. 用 `specFor()` 判定；结果为 `unknown` 即为缺失。
  3. 反向检查表中有、目录中没有的悬空代码。
- **审核开始时**（triggers.js 修改前）缺 1 个：
  - `comboHitOtherTargetNearby`，对应 `chr_0011_seraph.pot3.bounce`，赛希潜能3：“连携技压力测试命中目标后，对周围1个其他目标弹射1次”。
  - 审核期间作者已补为 `U('对照靶只有一个目标：多目标条件不成立')`，理由成立。另外赛希连携在模拟中本来就无法就绪（X9）。
- **当前版本**（sha1 `3506e69`）：缺失 0 个，悬空 0 个。
- **相关情况**：
  - 4 条效果带码但 `mode=auto`，不经过触发表（X8）。
  - `mode` 为 user/segment 却没有代码的效果：0 条。
  - 代码为 `always` 但 `mode` 不是 auto 的效果：0 条。

## 8. 判为“未建模·合理”、但理由文字需要修正的条目

- **CRYSTAL 组（6 个）、BREACH 组（16 个，加上 knockUpThenNextUlt、applyBreachThenNextUlt）**：理由成立，但应注明“已以伪附着形式进入状态”（X1），否则读者会以为这些机制与模拟完全无关。
- **interruptCharge**：真正的原因是“敌人蓄力 / 打断未建模”，与破防无关。
- **CRIT 组（6 个）**：理由只在 `critMode='never'` 时成立。`simulate()` 接受 `critMode` 输入，选 `always` 或期望模式时这些触发仍不会发生，应在理由中注明。
- **comboHitWingTarget**：真正的阻碍是“连击”乘区未建模（效果区为 other）。血翼盘桓本身可按 §3 建模。
- **ultimateMaxStacks**：暴击率层数其实已由 buff 的 stacks 记录；真正的原因是默认不暴击。
- **inArrowField、targetSlowed**：真正的原因是官方参数里没有箭阵或缓速的持续时间。
- **afterUltimateFollowup**：可以部分建模。终结技原文写明“骏卫的连携技伤害”会召唤盾卫发动袭扰，所以“骏卫终结技期间他自己的连携命中”可以作为触发；物理异常分支未建模。
- **法术异常消耗组（11 个，不含 §3 的 3 个）**：mechanics 中已有数据——狼卫、弧光、艾尔黛拉、庄方宜的战技 `consumes:{abnormal}`，以及伊冯终结技消耗冻结——只是 `castSkill`/`castUlt` 没有执行。理由准确，修复方向应写成“实现 consumes”。

## 附录 A　复现

脚本放在任意临时目录，从项目根目录外以绝对路径导入；在审核版本上逐条运行，输出见各行。

```js
// h.mjs
const root='<项目>/dist';
const operators=(await import(root+'/data/operators.js')).default, weapons=(await import(root+'/data/weapons.js')).default, gear=(await import(root+'/data/gear.js')).default, sets=(await import(root+'/data/sets.js')).default, effects=(await import(root+'/data/effects.js')).default, timing=(await import(root+'/data/timing.js')).default, mechanics=(await import(root+'/data/mechanics.js')).default;
const {simulate}=await import(root+'/engine/sim/simulate.js');
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n);
export const mk=(name,w,pot=0)=>({operatorId:op(name).id,potential:pot,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:w?weapons.find(x=>x.name.trim()===w).id:null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{},consumables:[]});
export const setGear=(m,setName)=>{ const s=sets.find(x=>x.name===setName); const by={}; for(const g of gear.filter(g=>g.set===s.id)) (by[g.slot]=by[g.slot]||[]).push(g); m.gear={armor:{id:by.armor[0].id,refine:[0,0,0]},gloves:{id:by.gloves[0].id,refine:[0,0,0]},kit1:{id:by.kit[0].id,refine:[0,0,0]}}; return m; };
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
export const run=(team,o={})=>simulate({team,data,mechanics,timing:o.timing||timing,enemy,mainControl:o.main??0,initial:{sp:o.sp??300,energy:o.energy??[0,0,0,0]},timeline:o.timeline||[],sequence:o.sequence,params:{duration:o.duration??30,...(o.params||{})}});
```

| # | 调用（`run(team, opts)`） | 关键输出 |
|---|---|---|
| R1 | `[setGear(mk('别礼','赫拉芬格'),'拓荒装备组'),mk('汤汤')]`，`timeline:[{t:1,member:0,kind:'skill'}]` | `1s spGain 别礼 战技返还 30 kind=poison` → `1s buffStart suit_atb01.p2` |
| R2 | `[setGear(mk('卡缪'),'拓荒装备组'),mk('洁尔佩塔')]`，`main:1`，卡缪战技 1 s、洁尔佩塔战技 3 s、卡缪连携 4.5 s | 卡缪连携施放后无 spGain、无拓荒 buffStart |
| R3 | `[mk('埃特拉'),mk('洁尔佩塔')]`，普攻段时长改 50 s、`mainAutoNormal:false`，洁尔佩塔战技 1 s、埃特拉战技 3 s、连携 3.9 s | 3.48 s 冻结；4.62 s 命中“对冻结敌人伤害倍率”，同刻 iceShatter；无 `combo.physFragile` |
| R4 | `[mk('狼卫',null,5),mk('洁尔佩塔')]`，`main:1`，连携 2.5 s 与 5.5 s，不放终结技 | 两次 `cdr comboReset 100%`，`cooldownUntil` 等于施放时刻 |
| R5 | `[mk('汤汤'),mk('别礼',null,1)]`，别礼战技 1 s；`main:0` / `main:1` | main=汤汤：灌注重击后无 heavyExtra；main=别礼：heavyExtra 持续到 17.6 s（15 s） |
| R6 | `[mk('洁尔佩塔','四二式·肃阵'),mk('汤汤')]` 对比 `mk('诀','四二式·肃阵')`，战技 1 s | 洁尔佩塔：只有 attach；诀：`buffStart wpn_funnel_0016.p2` |
| R7 | `[mk('别礼'),mk('汤汤')]`，`energy:[0,999]`，汤汤终结技 1 s，别礼下落攻击 5 s | 水龙卷段 `factor 1.6`，applied 含 `tornadoBonus:60` |
| R8 | `[mk('别礼'),mk('汤汤',null,1),mk('祀')]`，`sequence:[祀战技, 汤汤连携, 别礼战技(minT 12), 汤汤连携, 汤汤战技]` | `spGain 消耗 2 处涡流返还 40 kind=real`；fragile2（5）与 fragile3（10）同时 buffStart |
| R9 | `[mk('别礼','赫拉芬格'),mk('汤汤','落草'),mk('祀','玉中身',5),mk('诀','四二式·肃阵')]`，`sequence:[汤汤战技, 祀战技, 别礼战技, 别礼连携, 祀连携]` | `consume cold 3`；`pot2.atk value 8`；祀连携 ratio 8.625，applied 无 `combo.perLayer` |
| R10 | `[mk('梨诺'),mk('汤汤')]`，战技 1 s、5 s | 5 s“姿态中止”后 `buffRefresh teamAtk until 65` |
| R11a | `[setGear(mk('汤汤','玉中身'),'长息装备组'),mk('别礼')]`，终结技 1 s | 玉中身 p2（vulnerable）后 `buffStart suit_usp02.p1` |
| R11b / c | 赛希持雾中微光放终结技 / 洁尔佩塔持雾中微光，安塔尔放终结技 | b：触发 `wpn_funnel_0017.p2`；c：不触发 |
| R11d | `[mk('庄方宜','悠久传承'),mk('别礼')]`，战技 1 s | `talent1.elecAmp value 0`，并触发 `wpn_claym_0019.p3` |
| R12a | `[mk('卡契尔'),mk('别礼')]`，`main:1`，卡契尔战技 1 s、4 s，别礼战技 7 s | `attach breach 1→2`；4.78 s“法术爆发 breach”；9.35 s `abnormal freeze level 2 consumed 2` |
| R12b | `[mk('管理员 (女)'),mk('汤汤')]`，`main:1`，汤汤战技 1 s、连携 2.2 s，管理员连携 3.2 s | `abnormal {level:1, consumed:1}`（无 which），`attach originiumCrystal` |
| R13 | `[mk('汤汤','灯火使命'),mk('别礼'),mk('祀')]`，`main:1`，`sequence:[祀战技, 汤汤连携, 别礼战技(minT 12), 汤汤连携, 汤汤战技]` | 16.93 s `buffStart tangtang.skill.fragile2`（法术脆弱）同刻 `buffStart wpn_lance_0007.p3`（“施加灼热脆弱后”） |

## 附录 B　判为正确或未建模·合理的代码清单

- **正确（57 个）**：
  - afterComboHit、afterComboDamage、afterCombo2、skillHitSingle、skillSingleHit、ultimateHit、ultimateFinalHit、onSkillOrUltimateHit、skillOrUltHit、skillFinalHitNoBreach、skillFinalHitBreachLe2
  - afterUltimateCast、ultCast、afterUltimate、comboCast、skillCast、firstSkillInBattle、skillOrComboCast、afterUltimateEnd、battleStart
  - skillApplyColdAttach、selfSkillApplyHeatAttach、skillApplyColdOrHeatAttach、skillOrUltApplyColdAttach、comboApplyElectricAttach、targetArtsAttach2Plus*、enemyColdOrNatureAttach
  - targetColdAttached、targetFrozen、enemyFrozen、selfFreeze、comboHitColdOrFrozen、comboHitColdAttached、consumeArtsAttach*
  - afterApplyBurn、applyBurnOrConduct、afterApplyElectrify、applyConduct、afterApplyConduct、afterApplyFreeze、afterApplyCorrosion、applyArtsAnomaly*、enemyFreezeOrCorrode、enemyBurnOrCorrode、artsBurst*、onNatureOrColdBurst、comboArtsBurstOrPhysAnomaly
  - heavyHitAsMainControl、applyRoot、tornadoCount3、tornadoCount2Plus、intMode、highSingingStance、singingOrHighStance、hpAbove80、targetStaggered、targetColdFragile（handled 成立）
  - 带 * 的 4 个映射本身正确，但会被 X1 的伪附着误触发，建议加 `elementIn:ARTS` / `whichIn` 防线。
- **未建模·合理（81 个）**：
  - 多目标：skillHit2Plus、comboHitOtherTargetNearby。
  - 下一次终结技：knockUpThenNextUlt、applyBreachThenNextUlt。
  - 武器层数：artsBurstWithWindStack、artsBurstStacks4。
  - 法术异常消耗组 11 个：skillConsumeArtsAnomaly、skillConsumeArtsAnomalyWhileFang、skillConsumeCorrosion、skillConsumeCorrosionOtherCorroded、skillConsumeConduct、skillConsumeConduct3、consume_燃烧、consume_导电、consume_腐蚀、consumeCorrode、afterConsumeElectrifyOrCorrosion。
  - 诀：afterUltimate2、skillHitImprisoned。
  - 依赖装备者的治疗：selfSkillHeal、selfSkillHealOthers、comboHeal、comboHealOthers。
  - CRIT 组 6 个：afterCrit、critAtkStacksFull、critHit、wolfBlood16、skillOrComboCrit、critOnScarredTarget。
  - artsImmuneProc。
  - CRYSTAL 组 6 个：crystalConsumed、skillConsumeCrystal、ultimateConsumeCrystal、afterCrystalConsumed、targetCrystal、targetHasCrystal。
  - BREACH 组 16 个：onKnockdown、comboKnockUp、onSmashOrArmorBreak、slamConsumeBreach、consumeBreachLayers、afterApplyBreach、targetBreach4、applyBreachOnZero、targetBreached、skillApplyBreach、afterPhysicalAnomaly、physAnomaly、comboHitBroken、consumeBreak、comboSlam、interruptCharge。
  - 其他：skillAmberHit、boilingBloodTargetBurning、comboRareFish、lanceHit、skillCounter、skillFirstBlock、takeDamage、onSkillHitWithShield、focusedKilled、ultimateKill、killDuringUltimate、moltenStacks4、skillFollowupHit、skillBurn、comboConduct、comboHitWithPrep、afterUltimateFollowup、ultimateMaxStacks、nextHeavyAfterSkillFreeze、inGravityFieldBreach、comboHitWingTarget、inArrowField、enhancedShot、enhancedShotConsumeAttach、specialGiftHit、inkMarked、ultimateDetonateBomb、targetSlowed、skillLastStrike。

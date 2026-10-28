# 《明日方舟：终末地》基础规则独立审核报告

审核对象：[docs/rules.md](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/rules.md)，v0.3，2026-10-28。全程只读，未修改文件。

**结论：规则框架可继续使用，但目前不能视为已验证的完整计算规范。** 有可直接核实的错误，也有将局部证据推广为通则的问题。应优先修正：B 级抗性映射、腐蚀乘区、别礼返还潜能编号、战技消耗例外、处决条件、减伤精锻公式，以及莱万汀计时文本的引用。

食药固定攻击的位置、别礼天赋是否放大法术脆弱，目前应保留为**待复核的用户报告或模型假设**，不能标成已独立确认的机制。

## 审核方法与证据口径

先读取 rules.md，独立检索游戏教学、干员技能、装备和敌人数据，形成主要判断后，才对照 `docs/research/` 下两份报告及本地数据、回归用例。

本报告区分以下证据：

- **游戏文本**：游戏教学、技能描述及参数表。通过华法琳读取时，标为“游戏文本镜像”，不把网站本身称为官方站点。华法琳明确声明是非官方粉丝项目。[站点声明](https://warfarin.wiki/cn/tutorials)
- **解包数据**：可以支持字段、参数和数值关系；仅凭字段名，不能证明完整运行时行为。
- **玩家研究**：可以支持暂行计算模型，但必须注明版本与适用范围。
- **实测**：应有配置、版本、操作步骤及原始观测。代码回归结果与继承说明本身不构成新的游戏实测。

下文“正确”表示在注明的范围和证据等级内成立；“证据不足”不等于已经证明相反结论。

## 一、独立整理的三段规则

### 1. 面板攻击力公式

对于没有特殊属性转换的常规情况，我采用以下**研究模型**描述攻击力：

\[
T=1+0.005P+0.002S
\]

\[
A_{\mathrm{internal}}
=\big[(A_{\mathrm{角色基础}}+A_{\mathrm{武器基础}})
(1+\Sigma a)+F_{\mathrm{能力前}}\big]T
+F_{\mathrm{能力后}}
\]

其中，\(P,S\) 是参与计算的主、副能力，\(a\) 是相应攻击力百分比加成。固定攻击应按实际修饰阶段进入对应位置；不能仅凭“装备”或“食物”来源类别决定。底层属性系统存在多个加算、乘算阶段，简化式需限定适用对象。[属性修饰研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md)

面板显示与内部计算值应分开保存。现有资料支持多项属性显示向下取整，但不足以证明每个中间步骤都必须提前取整。

**与 B8 的差异：**我不把“食药固定攻击必定在能力乘算之后”作为已确认结论。现有两个截图回归用例均没有食药，无法区分两种顺序。若固定加攻为180，两种模型分别增加 \(180T\) 或180；需要同一配置食用前后的面板记录才能判断。[现有回归用例](/Users/serika/Developer/temp/endfield-demo-handoff-v3/tests/stats.test.mjs)

### 2. 单段伤害公式

先确定每个伤害事件的基础值与适用标签，再计算乘区：

\[
D_j=B_j\times C_j\times G_j\times A_j\times V_j\times I_j
\times L_j\times Z_j\times E_j
\times Q_{\mathrm{def},j}\times Q_{\mathrm{res},j}
\times Q_{\mathrm{reduction},j}\times Q_{\mathrm{special},j}
\]

这里依次表示基础伤害、暴击、增伤、增幅、脆弱、易伤、连击、失衡、处决、防御、抗性、减伤与特殊修正。**这是计算组织方式，不是官方公布的一条万能公式。**

普通攻击力倍率伤害可以取 \(B_j=A_{\mathrm{internal}}M_j\)，但并非所有伤害如此。例如卡契尔潜能1的额外伤害以“固定值＋防御力倍率”为基础；祀的记录伤害也需要独立处理。[卡契尔](https://warfarin.wiki/cn/operators/catcher)、[祀](https://warfarin.wiki/cn/operators/si)

机制伤害则另外读取触发者、异常等级、等级系数和源石技艺强度。伤害属性、异常类别和触发技能类别必须分别记录，不能因为由战技触发，就自动继承所有战技伤害加成。腐蚀改变有效抗性，应进入抗性计算。[腐蚀教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_corrode)

**与 A1 的差异：**增加非攻击力基础、处决与特殊结算路径；不把全部效果都归入“同区相加”；明确减伤、异常、技能标签和取值时点。

### 3. 技力／终结技能量规则

技力是队伍共享资源；战技消耗应逐技能读取，不能统一写死100。梨诺初始战技消耗25，祀的替换战技具有不同消耗。主控重击具有恢复技力和累积失衡值的通用效果。[梨诺](https://warfarin.wiki/cn/operators/liino)、[祀](https://warfarin.wiki/cn/operators/si)、[重击教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_heavy_attack)

返还技力需要单独记账：**返还不属于恢复，不触发“恢复技力”效果；返还部分再次消耗时不产生终结技能量。**这两点有教学明文；“优先消耗返还部分”则仍是玩家研究结论。[返还技力教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_return)

普通战技回能可暂按研究模型，将有效的非返还技力消耗 \(c\) 对应为各成员的基础回能 \(0.065c\)，再按**接收者**的充能效率和来源规则处理。具体到账事件、特殊回能与不能被加成的来源必须覆盖通则。连携通常给施放者回能；终结技还涉及冷却、实际能量需求和强化期间的回能限制。[终结技教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_ultimite_skill)、[管理员](https://warfarin.wiki/cn/operators/endministrator)

**与 C11—C15 的差异：**明确返还与恢复的事件区别、非100消耗、接收者效率、特殊回能及终结技冷却；不把“扣费、命中、返还、回能”合并成一个瞬时动作。

## 二、逐条审核

同一编号内有不同性质的结论时拆行，避免正确部分掩盖错误部分。

### A. 伤害公式与乘区

| 条目编号 | 判断 | 依据与链接 | 修改建议 |
|---|---|---|---|
| A1：通用单段公式 | **有误** | 作为常规攻击力倍率伤害的框架可用，但不能覆盖所有单段伤害。卡契尔潜能1明确存在防御力参与的基础伤害；祀存在记录伤害。[卡契尔](https://warfarin.wiki/cn/operators/catcher)、[祀](https://warfarin.wiki/cn/operators/si) | 将 `ATK×M` 改为可按伤害事件定义的基础值；补充固定伤害、其他属性倍率、记录伤害、处决和特殊倍率路径。 |
| A1：同区加算、关键词归区 | **证据不足** | 研究模型支持常见增伤区划分，但“受到伤害提高”等自然语言不能独自证明内部归区。庇护明确同类取最高，说明必须按效果规则结算。[庇护教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_guard)、[属性修饰研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md) | 建立“具体效果→字段／乘区→叠加规则”映射；不要把关键词分类当作充分证据。明确 `Q_reduction` 的组成。 |
| A1：“所有技能伤害”不含普攻 | **证据不足** | 两个字段独立存在，只能证明可分别修改，不能单独证明适用集合互斥。需要技能标签、筛选逻辑或对照实测。[数据导论](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md) | 可保留为暂行结论，但证据链应补到实际适用标签；当前“解包＋推导”标注比“官方”恰当。 |
| A2：暴击 | **正确** | 基础数值与所引研究、属性数据相符；期望式是二项概率的直接推导。[机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md) | 限定于可暴击伤害，使用有效暴击率；燃烧持续伤害等例外不能套期望暴击。 |
| A3：防御、抗性公式 | **正确** | 在文中限定的非负防御及常规抗性范围内，与研究模型相符。敌人页面也明确百分数是承伤倍率。[机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)、[罗丹数据](https://warfarin.wiki/cn/enemies/eny_0051_rodin) | 保留“研究”类别；补充有效抗性如何经过腐蚀、抗性忽视等效果计算。不要扩展到未验证的极端范围。 |
| A3：评级映射 | **有误** | 蚀影应龙尖兵电磁抗性显示 **B、承伤65%**，对应抗性35%，直接反驳固定 `B=50`。[敌人数据](https://warfarin.wiki/cn/enemies/eny_0122_kltdbud) | 评级只能用于展示或近似预设；计算使用具体敌人、具体属性数值。不要只把 A/S 列为缺口。 |
| A4：归属表 | **正确** | 作为常见术语的摘要基本成立；教学明确脆弱、增幅分别存在及其同类规则。[脆弱](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_vulnerable)、[增幅](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_enhance) | 表前增加“常见效果摘要，具体效果以字段与叠加规则为准”；补充腐蚀属于减抗，避免与 A6 冲突。 |
| A5：倍率、等级系数表 | **证据不足** | 数值与所引机制研究基本一致，未找到足以逐项推翻它们的证据；但本次没有完成 v1.6 逐项游戏实测。等级字段吻合不等于整条伤害公式已被验证。[机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md) | 保留为版本化研究参数表；分别列倍率、伤害类型、等级系数、可否暴击、取值时点及归属证据。 |
| A5：统一定义 `n=本次消耗层数` | **有误** | 同属性法术爆发不是消耗原附着的通用路径；击飞、倒地可增加破防；碎冰读取冻结状态等级，不能统一解释为碎冰瞬间消耗附着。[法术爆发](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_fire_outbreak)、[破防](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_break_defence)、[冻结](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_freeze) | 按机制定义 `n`。注明碎冰造成物理伤害；直接施加冻结等强制异常不一定产生通常的初始伤害。 |
| A6：技艺强度 | **有误** | 将腐蚀写为“易伤效果”与教学冲突：腐蚀逐渐降低抗性。研究还讨论了技艺强度对击飞、倒地失衡量的影响，文中遗漏。[腐蚀教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_corrode)、[机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md) | 将导电／碎甲的承伤增强与腐蚀减抗拆开；补列失衡量研究项。系数和适用范围继续标“研究”，不要作为通用法伤加成。 |
| A7：取整 | **证据不足** | 1224项对照支持特定静态数据的显示关系，不能证明所有战斗中间值的取整位置。长息装甲技艺内部为20.7，而显示为20，说明显示整数不代表内部整数。[长息装甲](https://warfarin.wiki/cn/gear/item_equip_t4_suit_usp02_body_01)、[本地数据说明](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/data-sources.md) | 分开写“数据内部值、面板显示、计算阶段取整、伤害跳字”。现有伤害跳字未确认的声明应保留；百分比显示边界也不宜一概视为已证。 |

### B. 属性与攻击力

| 条目编号 | 判断 | 依据与链接 | 修改建议 |
|---|---|---|---|
| B8：攻击力总式 | **证据不足** | 常规主体与研究模型一致；但底层有多个修饰阶段，两个无食药回归点不能确认所有固定攻击的位置。[属性修饰研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md)、[回归用例](/Users/serika/Developer/temp/endfield-demo-handoff-v3/tests/stats.test.mjs) | 标明适用配置；将装备固定攻击、食药固定攻击的实际阶段分别验证，不宣称统一完备。 |
| B8：食药最后加算 | **证据不足** | 当前目录可见的回归用例没有食药；玩家旧测试另有“食物加攻受能力放大”的报告，但也不足以代替当前版本复测。[原始讨论](https://forum.gamer.com.tw/C.php?bsn=74604&snA=1805)、[回归用例](/Users/serika/Developer/temp/endfield-demo-handoff-v3/tests/stats.test.mjs) | 改标“用户报告，原始记录待补”。补同配置食用前后面板与版本；不能用6368／6519证明食药顺序。 |
| B9：四能力总式 | **证据不足** | “90级基础”是当前配置范围，不是通用规则；静态显示值与内部值也可能不同。完整公式还需覆盖特殊属性转换和修饰阶段。[属性修饰研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md) | 基础值参数化为等级、精英阶段；说明天赋累计规则，分别保存内部值和显示值。772／798只能证明对应样本。 |
| B9：力量、敏捷、智识、意志作用 | **正确** | 与现有机制研究一致，来源标为研究合理。[机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md) | 明确这里的抗性换算是干员能力衍生效果，不是敌人评级映射；百分比单位写清。 |
| B10：充能效率 | **正确** | 对可受加成来源使用效率乘算合理；管理员特定潜能结晶明确不能被加成。[管理员](https://warfarin.wiki/cn/operators/endministrator) | 按回能来源配置是否受加成，按接收者读取效率；能量需求降低与充能效率增加必须分开。 |

### C. 资源与技能系统

| 条目编号 | 判断 | 依据与链接 | 修改建议 |
|---|---|---|---|
| C11：技力 | **正确** | 共享资源、主控重击恢复有教学支持；300／200、8点每秒等是研究参数，当前没有冒称官方。[技力教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_sp)、[重击教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_heavy_attack) | 区分通用机制与研究数值；200为脱战稳定值／默认起始值，不应等同于所有关卡必然初始值。注明自然恢复采用的时间口径。 |
| C12：返还语义 | **正确** | 再消耗返还技力不回能有教学明文；另有重要明文：返还不触发恢复技力效果。[返还教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_return) | 将“不回能”升级标为游戏教学文本；补“返还≠恢复”，影响恢复技力触发的装备效果。 |
| C12：优先消耗 | **证据不足** | 教学没有说明消费优先级；现有依据为玩家测试帖，本次未独立复现。[所引测试帖](https://forum.gamer.com.tw/Co.php?bsn=74604&sn=19507) | 与官方语义拆开，标“研究／待复测”；尤其验证混合技力、连续返还和溢出情形。 |
| C12：返还来源表 | **有误** | 别礼额外返还5点属于**潜能5**。昼雪、卡契尔基础战技各有30点返还，不能只列潜能5的额外10点。[别礼](https://warfarin.wiki/cn/operators/last-rite)、[昼雪](https://warfarin.wiki/cn/operators/snowshine)、[卡契尔](https://warfarin.wiki/cn/operators/catcher) | 更正潜能编号；分别记录基础返还、额外返还、条件与发生时点。 |
| C13：终结技能量主体规则 | **正确** | 战技给队伍回能、连携给自身回能、终结技消耗全部能量及部分强化状态限制，与教学吻合。[终结技教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_ultimite_skill) | 将“6.5／100”等定量参数单独标研究；补终结技冷却及潜能修改后的实际需求，不要只引用基础 `energyCost`。 |
| C13：回能事件及例外完整性 | **证据不足** | “施放即获得”不能覆盖全部回能事件。莱万汀有命中条件和按命中目标数分档的连携回能；别礼也有独立来源限制。[莱万汀](https://warfarin.wiki/cn/operators/laevatain)、[别礼](https://warfarin.wiki/cn/operators/last-rite) | 按“施放／命中／追加攻击／消耗附着”等事件处理；不能将基础队伍回能与特殊回能无条件叠加。 |
| C14：连携技 | **正确** | 按角色触发、存在冷却、01号位不同于主控均有依据；“约5秒”仍只应视为早期研究。[连携教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_combo)、[祀](https://warfarin.wiki/cn/operators/si) | 补充连携不消耗技力；窗口不设为无条件统一常数，另记录减冷却及刷新效果。 |
| C15：战技消耗 | **有误** | 梨诺初始战技消耗25，已经构成“普通战技均100”的反例。[梨诺技能表](https://warfarin.wiki/cn/operators/liino) | 改为“多数战技100，实际按技能与形态读取”。祀100→15→0可作为例子保留。 |
| C16：附着与异常 | **正确** | 常规附着反应流程与教学一致。[法术爆发](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_fire_outbreak)、[冻结](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_freeze)、[腐蚀](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_corrode) | 明确只描述通常的附着反应；补直接施加异常、状态刷新、冻结被打碎等路径。自然消退时间保持未确认。 |
| C17：非主控贡献 | **有误** | AI伤害频率未知，不代表通用重击资源规则也未知；教学把恢复技力、累积失衡限定在主控重击。[重击教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_heavy_attack) | 将AI普攻伤害估算与资源事件资格分开。不能把非主控普通重击的通用回技力也按主控的某个比例估算；特殊天赋另判。 |
| C18：普攻与处决 | **有误** | 处决教学包含失衡后的第一次攻击条件；当前简写易被实现为整个失衡期间反复处决。敌人还有独立处决倍率、返还技力参数。[处决教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_execute)、[罗丹数据](https://warfarin.wiki/cn/enemies/eny_0051_rodin) | 补处决资格及消耗状态；逐敌人读取处决修正和技力恢复。多段拆分保持待核合理。 |
| C19：失衡 | **正确** | 1.3作为研究参数、条件增伤另算的处理合理；但教学另有快速失衡后的失衡累积衰减机制。[失衡教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_poise) | 补失衡节点、再失衡惩罚、处决参数。永不失衡明确标为对照靶设置，不是游戏机制。 |

### D. 装备与武器

| 条目编号 | 判断 | 依据与链接 | 修改建议 |
|---|---|---|---|
| D20：精锻总式 | **有误** | 全伤害减免不适用显示百分比直接乘1.1。纾难识别牌显示17.8%→19.2%→20.6%→21.9%。[装备表](https://warfarin.wiki/cn/gear/item_equip_t4_parts_wuling01_edc_01) | 单列减伤内部标量转换，见下文；“整数属性”须按内部类型定义，不能按界面显示整数判断。 |
| D20：独立精锻与两条属性装备 | **正确** | 属性独立精锻、按实际可精锻条目处理，与教学及数据一致。[精锻教学](https://warfarin.wiki/cn/tutorials/wiki_tut_sys_equip_enhance) | 保留；基础防御等不可精锻条目不要因出现在属性列表中而纳入。 |
| D21：套装 | **正确** | 所核长息、拓荒均为3件效果，文本有不可叠加限制。[长息](https://warfarin.wiki/cn/gear/item_equip_t4_suit_usp02_body_01)、[拓荒](https://warfarin.wiki/cn/gear/item_equip_t4_suit_atb01_body_04) | “其他队友”要按接收者计算：双携带者之间也可能互相获得效果。最高值、刷新策略继续标假设；不同套装不要因同为16%而自动互斥。 |
| D22：潜能与基质 | **正确** | 在培养完成、对应词条存在且匹配满基质的前提下，前两条9级、第三条随潜能变化的关系成立。[联结点](https://warfarin.wiki/cn/weapons/junction-point)、[基质教学](https://warfarin.wiki/cn/tutorials/wiki_tut_sys_weapon_gem) | 明写培养阶段及词条数量前提。9／9／4是默认最终技能等级，不是基质自身提供的等级。 |
| D23：同名配件重复 | **正确** | 所引真实上传记录确实展示汤汤两个配件槽均为碾骨面具·贰型，支持允许两个实例。[战斗记录](https://zmdlogs.com/battle/btl_upload_c9aa96638f80?metric=dps) | 保留“实战记录”来源类别；两个实例的精锻值独立保存，不要误作同一实例重复引用。 |

D20 的具体修正为：若内部减伤标量为 \(x=1/(1+d)\)，精锻系数 \(k=1+0.1r\)，则应计算

\[
x_r=\frac{1}{1+(1/x_0-1)k},
\qquad
\text{显示减伤率}=1-x_r
\]

我以只读方式重新计算了本地1581个精锻值：**包含这一特殊转换后全部吻合**。因此“1581值吻合”支持的是包含例外的算法，并不支持 rules.md 当前省略例外的总式。[本地校验逻辑](/Users/serika/Developer/temp/endfield-demo-handoff-v3/tools/crosscheck.mjs)

### E、F、H及缺口清单

| 条目编号 | 判断 | 依据与链接 | 修改建议 |
|---|---|---|---|
| E：汤的数值与时长 | **正确** | 清炖兽排参须汤当前镜像为攻击180、暴击率11%、300秒；本地森空岛快照也一致。[物品文本](https://warfarin.wiki/cn/items/item_corp3_animal_1)、[本地物品快照](/Users/serika/Developer/temp/endfield-demo-handoff-v3/sources/skland/items.json) | 保留当前值。300秒应逐物品读取，不推广到所有食药。 |
| E：“旧BWIKI已过时” | **证据不足** | 当前来源冲突可以确认，但仅凭冲突不能判断旧值一定由版本更新造成，也可能是录入错误。 | 改为“旧来源为200／13，与当前文本冲突；采用当前文本”，除非补到更新记录。 |
| E：全部勾选叠加 | **证据不足** | 文中已经承认互斥与覆盖未知，因此全叠加只是模型选择。 | 明标“假设组合”，不要展示为已验证游戏可实现配置；按组验证覆盖、互斥、同类和异类叠加。 |
| F：资源、归属、计时拆分 | **正确** | 分开处理返还资源、伤害归属、主控和01号位，与教学及技能条件一致。[返还教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_return)、[祀](https://warfarin.wiki/cn/operators/si) | 补清楚事件先后：扣费、回能、返还、增益生效、命中、异常触发。 |
| F：莱万汀暂停计时依据 | **有误** | 技能文本说的是：施放自己的战技／连携期间，黄昏持续时间不减少。它不能直接证明“终结技演出暂停部分效果计时”这个更广的命题。[莱万汀终结技](https://warfarin.wiki/cn/operators/laevatain) | 准确保留这条角色特例；一般演出对增益、敌方状态、技力恢复的影响另列研究或待测项。 |
| H3：武器联动 | **正确** | 在 D22 的默认培养、基质条件下成立。[武器示例](https://warfarin.wiki/cn/weapons/junction-point) | 明确这是默认配置规则，不是任何武器状态下都成立的等级等式。 |
| H4：别礼寒冷与法术脆弱均×1.5 | **证据不足** | 天赋文本只明确放大寒冷脆弱；低阶为1.2，高阶为1.5，没有明写法术脆弱。本地注释提到用户实测，但没有附可复核记录。[别礼天赋](https://warfarin.wiki/cn/operators/last-rite)、[实现注释](/Users/serika/Developer/temp/endfield-demo-handoff-v3/tools/build_effects.mjs:12) | 官方文本部分与用户报告部分拆开。若寒冷、法术脆弱均适用，文本支持的最低限度模型为 `1＋1.5×寒冷脆弱＋法术脆弱`；扩大范围需要独立实测。 |
| H5：食药加攻顺序 | **证据不足** | 与 B8 相同。继承任务要求可以规定模拟器行为，但不能证明游戏实际结算。[回归用例](/Users/serika/Developer/temp/endfield-demo-handoff-v3/tests/stats.test.mjs) | 标“继承配置／用户报告待复核”，避免与机制事实混列。 |
| H6：默认不暴击、防御100、抗性0 | **正确** | 作为统一对照条件合理，且与部分敌人基础参数对应。[罗丹](https://warfarin.wiki/cn/enemies/eny_0051_rodin) | 明确“不暴击”是计算模式，不是把角色基础暴击率设为0。 |
| 缺口清单 | **有误** | 现有清单没有覆盖上文已由文本、数据确认的重要缺项，尤其是非攻击力伤害、处决、返还不触发恢复、非100消耗和减伤精锻。 | 将“已知机制尚未实现”和“机制本身未知”拆成两份清单，并纳入上述项目。 |

## 三、最重要的遗漏

建议优先补齐以下规则，而不是只继续增加倍率数据：

1. **伤害事件类型与取值时点。** 区分普通倍率、固定加值、其他属性倍率、记录伤害、异常、持续伤害；明确动态读取还是生成时取值。
2. **连击的状态消费规则。** 当前 A1 只有一个乘数，缺少作用于后续战技／终结技、消费层数及层数收益规则。[连击教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_combohint)
3. **腐蚀与抗性忽视。** 腐蚀的逐渐减抗、刷新保留进度及上限不能用一个固定易伤替代；角色抗性忽视还需按元素和来源过滤。[腐蚀教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_corrode)
4. **处决和失衡状态机。** 处决资格、敌人处决倍率、返还技力、失衡节点及快速再次失衡的惩罚，都会改变伤害与排轴。[处决](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_execute)、[失衡](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_poise)
5. **回能来源、触发事件与需求变化。** 不能把所有回能归为“施放就给”，也不能把潜能降低终结技需求误作效率提升。[终结技教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_ultimite_skill)

## 四、最后与现有研究报告对照

| 对照项 | 结果 |
|---|---|
| 别礼返还潜能 | `gpt-mechanics.md` 中存在潜能1误写；`claude-mechanics.md` 已写潜能5。rules.md 继承了错误版本。游戏文本可以直接裁决。 |
| 梨诺战技消耗 | Claude报告已列出25技力，但 rules.md 汇总时仍写普通战技100，属于遗漏已知例外。 |
| 抗性评级 | Claude报告已经提示 B 对应多个数值；本次独立核到了 B／65%承伤反例。规则不应只保留 B=50。 |
| 食药攻击顺序 | 两份报告并不一致，GPT报告对修饰阶段更谨慎。现有无食药回归样本无法解决争议，不能将汇总结论升级为已证实。 |
| 技艺强度与腐蚀 | 研究报告中有减抗与其他异常效果的区分，rules.md 将其压缩成“腐蚀易伤”，造成概念错误。 |
| 莱万汀计时 | 研究中的具体技能暂停规则被汇总成更广泛的终结技演出规则，超出了所引文本。 |
| 1224／1581项对照 | 这是静态数据与算法一致性证据，不能自动扩展为战斗全过程实测。本次1581项重算也证明必须保留减伤转换例外。 |

对照文件：[Claude报告](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/research/claude-mechanics.md)、[GPT报告](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/research/gpt-mechanics.md)、[数据来源说明](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/data-sources.md)。

**建议修订原则：每条规则分别写清“游戏说了什么、研究推导了什么、模拟器暂时选择了什么”。** 尤其 H4、H5 可以保留用户指定行为，但必须与已确认的游戏机制分开。

访问限制：森空岛实时页面未返回可读正文，随后浏览器权限门因目标站点网络访问未获授权而拒绝访问。本次使用了可读游戏文本镜像及已有森空岛本地快照，未完成森空岛实时直核；部分网络缓存页版本较旧，也未据此声称完成全部 v1.6 实测。
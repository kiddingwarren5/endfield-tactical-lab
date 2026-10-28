结论：**这张图目前适合作为目录索引，不足以直接作为配装或排轴规划器的可靠先验。** 主要风险是连携来源漏报、误报，以及把“找到候选提供者”误写成“条件可满足”。

全程未修改文件。当前 578 条效果、34 份机制数据构图成功，校验为 **0 错误、2 警告**；现有 6 条测试全部通过，报告与重新生成的内容一致。测试中的报告写入已在内存中拦截。下述反例说明，这些通过结果尚不能证明语义正确。

数据文件是单行生成文件，以下用文件位置加对象 ID/字段定位：[effects.js:2](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/data/effects.js:2)、[mechanics.js:2](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/data/mechanics.js:2)、[operators.js:2](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/data/operators.js:2)。

**1. [P1] 连携匹配存在确定的字段错误，并系统性遗漏派生事件**

位置：[graph.js:27](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:27)、[graph.js:37](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:37)、[graph.js:71](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:71)。

三个直接错误：

- `elMatch` 只把需求端转成数组，提供端仍按标量比较。伊冯战技的 `consumes.element=['cold','nature']` 因此匹配不上祀的寒冷消耗需求。
- `have==='trigger'` 无条件匹配所有具体元素，甚至匹配 `breach`。萤石只能重复寒冷/自然附着，却被列为破防来源。
- 弧光条件使用单数 `anomaly:'conduct'`；构图只复制复数 `anomalies`，查询遂把它当成“不限异常种类”。

此外，构图只读取显式 `attach/consumes/abnormal`，没有派生“异色附着消耗旧附着并产生异常”“击飞/倒地增加破防”“猛击/碎甲消耗破防”。这些规则已有本地依据：[rules.md:111](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/rules.md:111)；异色附着消耗也已在 [simulate.js:144](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/sim/simulate.js:144) 实现。

逐项抽查如下，表中来源均应理解为**附带前提的候选**：

| 干员／报告位置 | 实际条件与审核结果 |
|---|---|
| 弧光，[183](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:183) | 施加导电或消耗导电。消耗分支错列艾尔黛拉战技、伊冯终结技，二者分别消耗腐蚀、冻结。 |
| 祀，[215](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:215) | 消耗/吸收寒冷或灼热。漏伊冯战技；也漏佩丽卡战技等“对寒冷/灼热目标施加异色附着”的来源。 |
| 卡缪，[207](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:207) | 消耗/吸收灼热。只列洛茜；漏对灼热目标施加异色附着的技能，例如佩丽卡战技。 |
| 陈千语，[180](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:180) | 进入破防。错列萤石连携/终结技；漏自身战技、大潘战技等击飞来源。只含陈千语、佩丽卡的队伍被查询判为陈千语 `satisfiable:false`。 |
| 大潘，[181](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:181) | 达到 4 层破防。同样错列萤石、漏物理异常来源；列表还不能表达如何累计到 4 层。 |
| 弭弗，[208](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:208) | 达到 3 层破防。与上项相同；不能从“存在一条 +1 层来源”推出条件可满足。 |
| 骏卫，[198](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:198) | 消耗破防。仅列自身战技，漏大潘连携、管理员战技及弭弗追形等猛击路径。 |
| 阿列什，[185](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:185) | 异常或结晶被消耗。结晶分支写“无”，但男女管理员终结技明确声明消耗 `originiumCrystal`。 |
| 汤汤，[203](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:203) | 寒冷附着或法术爆发。爆发查询反而只搜 `event:attach`，漏掉已构成 `event:burst` 的提弗洛斯强化射击；普通附着来源还必须带“目标已有同色附着”前提。 |
| 莱万汀，[177](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:177) | 燃烧/腐蚀。只列显式异常，漏秋栗战技等通过异色附着触发燃烧的路径。 |
| 埃特拉，[193](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:193) | 冻结。漏别礼、祀等对异色附着目标施加寒冷而产生冻结的路径。 |
| 诀，[209](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:209) | 智形态中 `otherArts` 排除自然是正确的；但 `trigger` 的复制前提未保留，意形态条件整体缺失，见问题 2。 |
| 佩丽卡，[176](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/graph-report.md:176) | 主控重击，列 `actor:mainControl` 合理。 |

建议：统一元素集合、`anomaly/anomalies`；给复制附着绑定允许元素和前置条件。分别输出显式事件、规则派生事件及其守卫条件；直接爆发必须查询 `event:burst`。不能把 `trigger` 当成无条件万能来源。

**2. [P1] 形态与替换阶段只有摘要，没有进入实际依赖图**

位置：[graph.js:35](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:35)、[graph.js:45](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:45)、[graph.js:57](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:57)。

证据：

- 诀只保留形态名称和数量，构图始终使用顶层机制，即智形态。意形态的“任意法术附着即可开连携”、连携/终结技重复 `same` 附着均未进入图；顶层智形态腐蚀却会被无条件列为来源。
- `specFor` 返回的 `modeGate` 没有写入关系。“四二式·肃阵”的智识/意志门槛在查询中消失。
- `chains` 只是技能指向自己的名称列表。噗切娜替换战技的自然附着、弭弗追形的猛击不构成事件边。
- 祀三个阶段的费用 **100→15→0**、弭弗进入开天的“消耗至少 3 层破防”、卡缪追猎的 `countsAs:'combo'` 均不可通过图查询。

建议：至少以“形态、动作阶段、守卫条件”区分机制分支；遍历阶段内的事件和资源变化。无需把所有字段都做成节点，但查询必须保留这些分支。

**3. [P1] 硬软标签分开了，但 `teamDependencies` 的逻辑不足以供规划器使用**

位置：[graph.js:48](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:48)、[graph.js:83](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:83)、[graph.js:87](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:87)、[graph.js:91](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:91)。

`requires.kind='hard'` 与 `triggersOn.kind='soft'` 确实分离，没有直接把所有软条件作为硬约束。但是：

- 洛茜的 `breach AND anyArtsAttach` 被展平成一个提供者数组，`satisfiable` 只检查数组非空。
- 梨诺的演唱姿态前提只留在第一个 OR 分支，异常消耗分支没有继承；异常分支的匹配本身也不检查姿态。
- 昼雪 `hpBelow:0.6`、卡契尔 `hpBelow:0.4` 虽进入边的元数据，却没有进入查询返回值。
- 赛希、提弗洛斯的自身状态直接以“自身连携技能”为提供者，因此单人查询也返回 `satisfiable:true`，没有说明晶体耗尽、启示积累的来源。
- 单独查询庄方宜，重击和处决两个分支均为 `true`，即使队内没有电磁附着来源。
- `soft` 只枚举干员自身的 `eventDriven` 效果，遗漏装备、套装、状态型条件；`buffs` 不含敌方脆弱等团队受益减益，也不返回强度、作用技能或目标位置。

建议：保留 AND/OR 结构和共同前提；把当前布尔值改为 `hasCandidateProvider`，另返回未满足/未知条件。以实际编队配置为输入，至少包括潜能、装备、形态、位置和场景。软条件继续仅用于排序，不用于裁剪可行解。

当前图还没有接入自动规划器；[plan.js:19](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/sim/plan.js:19) 仍从模拟结果生成可行动作。因此这里是报告及未来接入风险，并非已经证明线上排轴被这些查询改变。

**4. [P1] `effectEnablers` 混淆本人触发与队友触发，还漏查多种事件**

位置：[graph.js:97](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:97)。

证据：

- 所有者限制只用于 `cast/hit`，附着、消耗、异常分支不检查 `ownerOp` 或 `sp.anyone`。狼卫自身消耗异常返技力，竟列出艾尔黛拉、弧光、庄方宜。
- 消耗异常边保存的是 `meta.abnormal`，筛选却读取 `meta.which`。由于后者不存在，种类检查被跳过。艾尔黛拉“消耗腐蚀”因此也匹配狼卫、弧光、庄方宜。
- 武器没有装备者上下文，也未按武器类型过滤。赫拉芬格查询列出埃特拉、祀等不能装备该大剑的干员。
- 没有处理 `burst/heavy/applyDebuffCategory/spGain` 等事件：探骊、淬火者、长息的触发者均为空。
- 汤汤提前巨浪连的是 `enables`，查询只找 `emits`，对应天赋返回空列表。
- `stage/min/targetHas/modeGate` 等限制没有随结果返回。

模拟器明确规定默认只认本人事件，见 [simulate.js:104](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/sim/simulate.js:104)，因此前两项是确定的语义不一致。

建议：规范化事件载荷，统一使用者与事件匹配规则；装备查询增加装备者上下文。未支持的事件返回“未知/未实现”，不能用空数组冒充“没有来源”。

**5. [P1] `classifyEffect` 把效果分区当成了实现状态，`other` 被错误视为无伤害意义**

位置：[graph.js:7](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:7)、[ontology.md:44](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/ontology.md:44)。

下面实际核对了 **17 条效果**；全部位于前述 `effects.js:2`，ID 可直接定位：

| 效果 ID | 当前分类 | 独立判断 |
|---|---|---|
| `suit_usp01.p1` | static | 对，套装激活后的常驻充能效率。 |
| `wpn_sword_0003.p1` | static | 对，`always` 的固定攻击。 |
| `wpn_claym_0013.p1` | static | 对，`always` 的技能增伤。 |
| `wpn_sword_0008.p1` | eventDriven | 对，`segment`，战技命中后触发。 |
| `wpn_sword_0009.p1` | eventDriven | 对，`segment`，连携施放触发。 |
| `wpn_claym_0013.p3` | eventDriven | 对，但仍需寒冷附着及段序条件。 |
| `chr_0012_avywen.talent.electricFragile` | eventDriven | 对，终结技命中后施加脆弱。 |
| `chr_0030_zhuangfy.talent1.elecAmp` | eventDriven | 大类对，但逐次命中递增的 `hits` 依赖未表达。 |
| `chr_0018_dapan.combo.slamDmg` | unmodeled | 符合当前触发表的实现状态；语义上仍是段触发增伤。 |
| `chr_0017_yvonne.talent2.critDmg.cold` | stateDriven | 对，目标寒冷附着且非冻结。 |
| `chr_0035_liino.pot1.teamAtk` | eventDriven | 不完整：规格包含事件分支和终结技期间状态分支。 |
| `chr_0026_lastrite.talent.brittle` | informational | 错，`fragileMultiplier:1.5` 实际参与伤害计算。 |
| `chr_0036_jsspsi.skill.inkRecord` | informational | 错，笔意记录并爆发伤害，触发表明确为 handled。 |
| `chr_0032_lizhiyan.ult.int.corrosion` | informational | 错，强制腐蚀由机制处理，应保留 handled/机制依赖。 |
| `chr_0036_jsspsi.pot3.ampMul` | informational | 错，`modifies` 将两条增幅乘以 1.2，实际参与结算。 |
| `chr_0030_zhuangfy.ult.freeSkill` | informational | 掩盖缺口：这是未建模的免技力机制，直接影响排轴。 |
| `chr_0020_meurs.pot1.extraHit` | informational | 掩盖缺口：`300+5*def` 追加伤害尚未结算，不是纯说明。 |

伤害证据：[damage.js:36](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/damage.js:36)、[resolve.js:40](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/resolve.js:40)、[simulate.js:166](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/sim/simulate.js:166)。

另外，**当前全部 21 条 `segment` 中，没有一条被分成 static；68 条 `trigger='always'` 均为 static，当前数据对此是合理的。** 不应把“代码未检查 mode”直接说成已有 21 条误分类。不过无代码时直接返回 static，确实会放过以后新增的未编码 `user/segment` 条件。

建议：将“生效方式”和“实现状态”拆成两个维度；`other` 只表示效果分区，不能代表“不计算”。显式识别 handled、倍率修饰器和未实现效果。

**6. [P1] “全 static 就不必重排”这一结论不成立**

位置：[graph.js:69](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:69)、[ontology.md:51](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/ontology.md:51)。

直接反例：`itemSensitivity('set:suit_generaltype')` 返回两个 static、`rotationSensitive:false`，但其中 `suit_generaltype.p2` 是终结技充能效率。充能变化会改变终结技可施放时间。

同理，目录中的常驻 `energyCost/cdr/spRefund` 会改变可行轴；常驻主副属性也可能改变诀的形态门槛。反过来，骑士精神仅含 unmodeled 效果，也返回 `false`，这个值无法区分“确定不敏感”和“尚不知道”。

建议：将字段改为“是否具有已建模动态条件”；另标资源、冷却、形态门槛影响及未知状态。删除“固定轴边际收益就是准的”保证。

**7. [P2] 仍有一批直接影响配装和排轴的信息只藏在 `ref`，没有形成可消费的结构**

位置：[graph.js:34](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:34)、[graph.js:51](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:51)、[graph.js:55](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:55)。

这里不是说原字段被删除：多数仍在 `ref`。问题是图查询不能表达或利用它们。

| 有用的缺项 | 数据证据与影响 | 建议 |
|---|---|---|
| 主副属性与装备匹配 | 干员有 `mainAttr/subAttr`，武器有 `stat:main/sub`；图只有孤立 stat 节点和 gives 边。 | 提供属性角色映射与武器兼容查询；不必展开所有装备组合。 |
| 潜能、培养和套装激活条件 | 228 条效果含 `owner.potential`，仅保留在 hasEffect 元数据；查询不筛选。Rank、套装件数也未用于查询。 | 根据实际配置返回已启用效果及其数值。 |
| 作用技能和段 | 102 条效果含 `applies.skills`；图只连 `applies.elements`，忽略 kinds、skills、segments、damageClass。 | 将效果作用范围返回给候选动作排序。 |
| 01 号位 | 祀 `talent1.comboCd.condition.slot=1`，查询只报 `beneficiary:'team'`；战技寒冷/灼热替换也仅保留自由文本。 | 增加队伍位置目标和位置条件，区别于主控。 |
| 时间、次数和叠层 | 226 条有 duration，29 条有 cooldown，5 条 oncePerBattle；查询不返回这些限制。 | 保留时长、内置冷却、次数、独立层和消费窗口。 |
| 数值依赖 | `value.dependsOn`、公式变量、天赋阶段没有依赖关系。 | 表达“依赖谁的哪项属性/层数”，避免配装收益脱离施加者。 |
| 场景前提 | 受击、蓄力、血量、敌人数、失衡均影响是否有来源；目前 actor 节点默认可用。 | 输入场景能力，输出 external/unknown 前提。 |

其中形态和阶段问题已在问题 2 单独列为 P1。

**8. [P2] 校验器会放过大量真实坏数据，且坏类型可能使校验前直接崩溃**

位置：[graph.js:107](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:107)、[graph.js:124](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:124)。

我对数据做内存副本修改，以下反例全部得到 **零错误，且没有新增警告**：

- 重复效果 ID；
- 不存在的 `applies.skills`、`applies.segments`；
- 删除效果 `value`；
- duration=-5、cooldown=-1；
- 潜能等级 99；
- 连携 element 写成不存在的枚举、min=-3；
- 干员主副属性写成非法值；
- 形态分支附着写成非法元素；
- 删除一个非预览干员的 combo 机制；
- mechanics.buffs 引用不存在的效果；
- 孤立 mechanics.operatorId；
- atkPct 效果使用非法 stat。

另把 `condition.trigger` 改为对象，会在 [triggers.js:115](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/sim/triggers.js:115) 抛出 `code.startsWith is not a function`，来不及输出结构化校验错误。当前原始数据没有触发此异常。

建议：先做输入结构校验，再构图；增加 ID 唯一性、完整引用、数值范围、分支递归检查。图层再检查边端点和关系类型；不需要让静态校验器承担完整战斗可行性证明。

**9. [P2] 受控词表与既有合法数据/规范不一致，会误拒未来合理数据**

位置：[vocab.js:5](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/data/vocab.js:5)、[vocab.js:12](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/data/vocab.js:12)。

- 诀意形态已有 `element:'same'`，模拟器也明确支持它；词表不包含 `same`。它现在因为 modes 未被遍历而逃过校验；放到顶层后，实际报“附着目标：诀 combo same”。
- [effect-schema.md:39](/Users/serika/Developer/temp/endfield-demo-handoff-v3/docs/effect-schema.md:39) 明确允许 `spRegen`，词表未收录；将恢复技力效果归入该区会被判错。
- “所有枚举唯一出处”尚未成立：触发表和模拟器仍各自维护元素、事件等定义。

建议：先统一 `same/trigger` 的精确定义，再递归校验。对 `spRegen` 明确选择支持或废弃，并同步规范和消费者。当前没有发现其他已确认的合理原始数据被错误报为 error；两个单成员互斥组目前只是警告，不宜据此强行补成员。

**10. [P2] 已有重复事件边和资源边失真，现有测试捕获不了**

位置：[graph.js:18](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:18)、[graph.js:39](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:39)、[graph.js:46](/Users/serika/Developer/temp/endfield-demo-handoff-v3/dist/engine/graph.js:46)。

证据：

- 当前图有一组完全重复边：黎风终结技 → `event:abnormal`，`which:'knockdown',forced:false`。源数据分别为第一段、第二段，但 emits 丢了 `when`，使两个不同事件变成无法区分的重复记录。
- 卡缪战技、祀战技在部分 providers 中重复出现。报告按标签去重掩盖了这一点，但 API 消费者仍可能重复计权。
- 7 条回技力 gains 边的 `meta.value` 为 undefined：代码只读 `.value`，漏掉 `byRank` 等结构。
- `kind!=='combo'` 使弧光、阿列什、秋栗、骏卫等连携回技力不进入 gains；全队回能、费用、条件、每击计量也未完整保留。

建议：按阶段/条件区分事件；查询对同一提供者聚合“满足路径”，不要简单重复。资源边统一承载固定值、Rank、公式、每击及前提。

[tests/graph.test.mjs:7](/Users/serika/Developer/temp/endfield-demo-handoff-v3/tests/graph.test.mjs:7) 之后主要检查正向存在性，所以错列额外来源、漏掉其他来源、非法输入放行均不会失败。应优先补上述反例，而不是继续增加“包含某个正确提供者”的断言。此次未发现当前原始图存在悬空边，也未复现索引异常。

**可以直接采纳：** 修复数组/伪附着/单复数异常字段匹配；恢复形态、阶段及位置条件；修复本人触发限制和异常载荷；补直接爆发、结晶消耗等已有明确数据路径；取消 `satisfiable` 和“static 无需重排”的过强承诺；增加结构校验及负向行为测试；修复重复边和资源值丢失。

**需要裁定：** 图表达完整游戏规则还是当前模拟器能力，二者应如何分别标注；派生反应做到什么深度；采用怎样的条件表达式与配置上下文；是否将条件性、实现状态、排轴影响拆成独立维度。冻结消耗/碎冰、尚未实现的物理异常等路径应保留规则来源和实现状态，不能通过删掉合理来源来换取“零错误”。
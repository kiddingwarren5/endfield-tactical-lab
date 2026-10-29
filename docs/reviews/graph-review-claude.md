# 图谱审核（Claude 子代理，独立上下文）与逐条处置

审核对象：docs/ontology.md、dist/data/vocab.js、dist/engine/graph.js（重写后版本）、docs/graph-report.md，并用模拟器做了最小实验。原始报告见本文件末尾；这里先给处置表。状态：已修 = 代码与测试已改；已建模 = 引擎新增机制；待建 = 明确列入下一批，附做法；裁定 = 需要用户定。

## 处置表

| 编号 | 问题 | 状态 | 处置 |
|---|---|---|---|
| H1 | 图的硬依赖与模拟器判定不一致：破防层数读错、数组元素永不匹配、异常不看种类、目标前提被忽略、物理异常未建模 | 已修 / 已建模 | simulate trMet 重写：层数按元素集合（含 breach、数组、otherArts）；异常按种类；目标前提按机制数据里的结构化 targetRequires 判定（艾尔黛拉、艾维文娜、安塔尔、黎风、伊冯、庄方宜）；物理异常系统（击飞 / 倒地加破防与失衡、猛击 / 碎甲消耗破防并结算机制伤害、碎甲物理易伤）；处决事件进连携条件；触发表 19 个破防类代码接到真实事件。tests/combo-triggers.test.mjs 5 例。一致性检查工具 tools/check_graph_sim.mjs → docs/graph-sim-consistency.md |
| H2 | 派生来源把“再次施加”当异常源；缺“队里要有另一种元素”前提 | 已修 | 派生异常 / 消耗只认具体元素的附着；提供者带 requiresOtherArts，teamDependencies 按队伍已有法术元素裁定 |
| H3 | 自己的连携 / 再次施加被列为自己的来源 | 已修 | skillsEmitting 排除本人连携与本人再次施加 |
| H4 | 诀形态过滤错、死代码 | 已修 | 有形态的干员只用形态变体；查询按形态过滤；死代码删除 |
| H5 | enabledEffects 用 includes(mode) 匹配 | 已修 | 按“阵诀·X”整词；teamDependencies 按潜能、形态过滤 soft / buffs |
| H6 | 软条件匹配规则与硬依赖不一致；增幅类只给占位；漏汤汤战技水龙卷 | 已修 | effectEnablers 复用派生规则（异常 / 爆发 / 消耗）；“施加增幅类效果后”通过机制 buffs 的 grants 边解析；涡流战技发水龙卷事件 |
| M1 | 实现状态误判（hits 当修饰器；other 区非倍率修饰；别礼能量来源、祀阶段费用、弭弗断云返还） | 已修 | 修饰器只认倍率类；别礼 energySource、弭弗 duanyunRefund 改为 handled 触发码；祀起墨 / 收笔费用标 informational |
| M2 | 能量获取边丢失（公式 / 按命中） | 已修 | numOf 保留对象 |
| M3 | 多属性依赖生成错误节点 | 已修 | 逐属性建边 |
| M4 | 前提是纯文本；敌人行为当作可满足 | 已修 | 目标前提结构化并给候选提供者；敌人行为类提供者标 scenario，不计入 hasCandidateProvider，输出 needsScenario；提弗洛斯 / 赛希的自身状态标 dependsOn（自然附着 / 主控重击） |
| M5 | 碎冰没算异常被消耗 | 已修 | 异常被消耗的候选加“对冻结目标造成物理伤害（碎冰）” |
| M6 | 校验放过：applies.segments / anomaly、requires 条目、auto 带触发码、名称空格、词表缺防御力 / 无视抗性 / 秒 | 已修（部分待建） | 前四项已加校验，大潘 slam→crush 已改，武器名已去空格；防御力 / 无视抗性两个区：已建模（resIgnore 区进抗性因子；ability/def 进面板；extraHit 追加固定伤害） |
| M7 | 未进图的结构：机制 buffs、技能费用 / 冷却、重击 / 处决回技力、职业 / 元素限制、替换关系、场景、天赋阶段 | 已修（部分待建） | grants 边、技能节点属性（费用、冷却、持续、切主控、重击回技力、处决回技力）、职业 / 元素限制属性、替换关系（含卡缪追猎视为连携与时间窗）已进图；场景节点已进图（scenario:*，supports 边标明支持失衡 / 重击 / 处决）；天赋阶段只在 ref 里，不单独建节点 |
| M8 | 恒真状态当动态；低温脆性当事件；修饰器 static | 已修 | 恒真状态按 static；handled 且以 target 开头按 state；修饰器继承被修饰效果的生效方式 |
| 低 | 提供者重复、触发表重复键、占位节点异常、武器适配抬高、文档表格 | 已修 | 去重保留多条守卫；重复键删除；缺 ref 时返回 unknown；主 / 副能力词条单独计 genericMatch；表格补 actor:slot1、grants、appliesToSkill、dependsOn、replaces |
| 裁定 | 互斥组多成员（诀终结技脆弱 vs 连携脆弱） | 裁定 | verification-needed 32 / 37 |

## 下一批建模（审核提出、尚未完成）
1. 已做：无视抗性区、防御力与卡契尔追加伤害、场景节点、一致性检查分级（可检 / 有守卫 / 未检），一致性测试 tests/graph-sim.test.mjs 要求可检项全部点亮。
2. 已做：通用资源状态机（docs/ontology.md §7），七种资源全部按规则接入：熔火、启示 / 猎矢、支援晶体、雷枪 / 强雷枪、自制炸弹、连击、青霆剑（tests/resources.test.mjs）。
3. 待做：一致性检查器对带守卫的提供者先满足守卫再判（现在只列出）。


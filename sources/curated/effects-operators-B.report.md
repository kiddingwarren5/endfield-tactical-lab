# 干员效果目录 B（operators.js 索引 17–33）

总条数：192；uncertain：14。规范：docs/effect-schema.md。

| 干员 | 条数 | uncertain | 备注 |
|---|---|---|---|
| 卡契尔（chr_0020_meurs） | 7 | 2：talent2.shockwave、pot1.extraHit | 未录入：战技庇护、连携技护盾、终结技虚弱（降低敌人伤害）、潜能3护盾持续时间。 |
| 秋栗（chr_0019_karin） | 8 | 0 | 技能资源（终结技恢复技力、连携技恢复技力/能量）已在 params 中，未重复录入。 |
| 黎风（chr_0015_lifeng） | 9 | 1：talent2.knockdown |  |
| 骏卫（chr_0029_pograni） | 11 | 0 | 技力恢复（战技按破防层数、连携技各段、终结技袭扰/决胜）已在 params 中。 |
| 赛希（chr_0011_seraph） | 8 | 0 | 未录入：战技治疗、天赋协议冻结（净化）、潜能3弹射（多目标）、潜能4治疗效率。 |
| 管理员 (女)（chr_0003_endminf） | 7 | 0 | 潜能5原文为“？？？”，未录入。 |
| 伊冯（chr_0017_yvonne） | 14 | 0 | 战技/连携技终结技能量获得已在 params 中。 |
| 洁尔佩塔（chr_0013_aglina） | 8 | 1：pot2.fragile | 未录入：终结技缓速、天赋迟来的回信（治疗）、潜能1作用范围。 |
| 汤汤（chr_0027_tangtang） | 13 | 0 | 未录入：终结技定身、天赋肝胆相照（加速/缓速）。战技“水龙卷伤害视为战技伤害”已体现在分段 kind=skill。 |
| 庄方宜（chr_0030_zhuangfy） | 11 | 1：skill.lastStrike | 未录入：天赋承天之佑（免伤/治疗）。战技/连携技倍率提高、终结技期间强化普攻已体现在分段（skill3/4、combo2、ultimate1–3）。 |
| 卡缪（chr_0033_camille） | 13 | 1：pot5.heatBonusOthers | 未录入：战技虚弱、天赋追罪之人回复生命。追猎“视为连携技”已体现在分段 combo2（kind=combo）。 |
| 弭弗（chr_0031_mifu） | 12 | 0 | 未录入：天赋怒意留心（护盾/抗打断）。数据问题：战技 params 无技力消耗（文本：断云100/追形50/开天50）；skill3 开天 kind 应视为猛击。 |
| 诀（chr_0032_lizhiyan） | 23 | 4：combo.will.natureFragile、combo.will.coldFragile、talent1.will.natureFragile、talent1.will.coldFragile | 各阵诀的倍率差异已体现在 modeVariants 分段。未录入：囹圄（减速）、阵诀·意牵引、终结技（意）再次施加附着。 |
| 梨诺（chr_0035_liino） | 13 | 2：ult.amp.electric、ult.amp.nature | 未录入：战技/连携技/终结技治疗、天赋偶像领域（受治疗/减伤）、潜能2治疗效率。 |
| 提弗洛斯（chr_0034_typhoea） | 12 | 1：talent1.arrowMul | 未录入：连携技缓速、天赋猎手的专注（减伤护罩）。启示/猎矢资源未录入。 |
| 噗切娜（chr_0038_purrche） | 10 | 0 | 未录入：战技庇护、连携技治疗、天赋代言人的职责（减伤）。 |
| 祀（chr_0036_jsspsi） | 13 | 1：combo.perLayer | 未录入：战技定身、天赋丹青不渝（加速）。 |

## 录入约定（本文件）

- 技能参数取 12 级数组 `value: {byRank:[…12]}`（Rank1–9、专精1–3），并在效果顶层写 `rankType: "skill12"`（与 effects-operators-A 一致）；perStack/dependsOn 的 base/per/cap 随等级变化时同样写成 `{byRank:[…]}`。
- 沿用 effects-operators-A 的补充字段：`owner.source`（talent/potential/skill）、`owner.ref`、`owner.skill`；`modifies` 指向被加值/倍乘的效果 id。
- `ratioMul` 及各类“提升至原本的N倍”：`value.fixed` 为乘数，`unit` 填 `flat`（A 文件同类条目填的是 `%`，合并时需统一）。非伤害区的乘数（增幅/脆弱/概率/腐蚀倍率）归 `other` 并用 `modifies` 关联。
- 冷却“-N秒”：`zone: cdr`、`unit: flat`（秒），value 为正数；所需终结技能量 `energyCost` 为负百分比。
- `applies.skills` 可写技能（normal/skill/combo/ultimate）或段 id（如 skill3、ultimate3）；自然爆发等异常伤害用 `kinds:["mech"]` + `skills:["artsBurst"]`（对应 dist/engine/skills.js 的机制段 id）。
- `condition` 额外字段：`professions`（洁尔佩塔）、`elements`（梨诺天赋受益者属性）、`slot`（祀天赋01号位），沿用 effects-sets 的 `pieces` 先例。
- 诀的阵诀·智/意分别录入，`condition.text` 以“阵诀·智生效（智识≥意志）”/“阵诀·意生效（意志>智识）”开头；evidence.where 指向对应 modeVariants。
- 防御力类效果（卡契尔、噗切娜）schema 无 def 属性，归 `other`。“连击”状态归 `other`（value.fixed=1 表示获得状态，乘区数值由规则定义）。
- 追加伤害实例（卡契尔全局思维/潜能1、黎风伏魔/潜能5）归 `other`，value 为攻击力百分比或公式。

## 发现但未修改（数据疑点）

- 录入期间 dist/data/operators.js 被重建（05:55）：管理员 (男)（索引12）与管理员 (女)（索引22）现在**共用 id `chr_0003_endminf`**（旧 id 分别为 official_89 / official_156），两者技能/天赋/潜能文本完全相同。本文件 owner.id 用当前的 `chr_0003_endminf`，并加 `owner.itemId: "156"` 区分；effects-operators-A 仍用旧 id `official_89`。合并时同一 owner.id 只能保留一套，否则会重复计算。
- 弭弗战技 params 无技力消耗（文本：断云消耗100返还50、追形50、开天50）；开天段 skill3 在数据中 kind=skill，原文写明“不属于战技伤害，视为猛击伤害”（已录入 other 条 `skill.kaitianAsCrush`）。
- 祀战技“起墨：消耗15技力”只在文本中，params 未列。
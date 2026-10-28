# 装备套装 / 食药 效果目录报告

数据来源：dist/data/sets.js、dist/data/consumables.js；编写规范：docs/effect-schema.md。

- effects-sets.json：35 条，uncertain 3 条
- effects-consumables.json：32 条，uncertain 2 条

## 装备套装

| 实体 | 条数 | uncertain | 备注 |
|---|---|---|---|
| 天灾防护装备组（suit_usp01） | 2 | 0 | — |
| 点剑装备组（suit_phy01） | 2 | 1 | suit_phy01.p2：uncertain：追加伤害实例（250%攻击力物理），无对应乘区记 other；是否作为独立伤害段待定 |
| 生物辅助装备组（suit_heal01） | 0 | 0 | 未录入：治疗效率+20%、被治疗目标受到伤害-15%/-30%（均为治疗/减伤，与输出无关） |
| 碾骨装备组（suit_attri01） | 2 | 1 | suit_attri01.p2：uncertain：2层碾骨重压是下一次战技一次性+60%，还是逐次各消耗1层+30% |
| 脉冲式装备组（suit_pulse_cryst01） | 3 | 0 | — |
| 拓荒装备组（suit_atb01） | 2 | 0 | 重复项已去重（舍弃 set_拓荒装备组）；suit_atb01.p2：全队+无法叠加，teamUnique=true；同队多人携带是否取最高/只计一次：待规则确认 |
| 轻超域装备组（suit_poise01） | 3 | 0 | — |
| 动火用装备组（suit_fire_natr01） | 3 | 0 | — |
| M.I.警用装备组（suit_criti01） | 3 | 0 | — |
| 50式应龙装备组（suit_atk02） | 2 | 1 | suit_atk02.p2：uncertain：“该干员”指装备者还是施放战技的干员；多层是否一次吃满 |
| 潮涌装备组（suit_burst01） | 2 | 0 | — |
| 长息装备组（suit_usp02） | 1 | 0 | suit_usp02.p1：beneficiary=others，teamUnique=true；同队多人携带是否取最高/只计一次：待规则确认 |
| 壤流装备组（suit_expend_spell01） | 2 | 0 | — |
| 清波装备组（suit_combo_cd01） | 2 | 0 | — |
| 旧锋装备组（suit_crush_fracture） | 2 | 0 | suit_crush_fracture.p2：formula 6*layers×(1.5 若目标物理脆弱/失衡/源石结晶)；1.5倍判定时机待确认 |
| 集成实训装备组（suit_generaltype） | 2 | 0 | 重复项已去重（舍弃 set_集成实训装备组） |
| 险关装备组（suit_spellburst） | 2 | 0 | — |
| 纾难装备组（set_纾难装备组） | 0 | 0 | 无套组技能，未录入 |
| 涉渊装备组（set_涉渊装备组） | 0 | 0 | 无套组技能，未录入 |

## 食药

| 实体 | 条数 | uncertain | 备注 |
|---|---|---|---|
| 意乱药剂（item_44） | 1 | 0 | — |
| 开工日肉汤（item_135） | 1 | 0 | — |
| 塞什卡风肉排（item_519） | 1 | 0 | — |
| 速食骨汤（item_520） | 0 | 0 | 未录入：纯治疗（全队回复生命值） |
| 软骨饼干（item_523） | 0 | 0 | 未录入：纯治疗（全队持续回复生命值） |
| 可食用巢雕（item_524） | 3 | 0 | — |
| 附术瓶（item_535） | 1 | 0 | — |
| 约翰老爹汉堡（item_537） | 1 | 0 | — |
| 附术铁瓶（item_585） | 1 | 0 | — |
| 正本补元汤剂（item_595） | 2 | 0 | — |
| 清炖息壤球（item_770） | 1 | 0 | — |
| 清炖兽排参须汤（item_894） | 2 | 0 | 含固定加攻（atkFlat，主副能力乘算后再加） |
| 雅各布的遗产（item_895） | 1 | 0 | — |
| 小糖画（item_924） | 2 | 0 | — |
| 竹笋炒肉（item_1070） | 1 | 0 | 未录入：受治疗效率加成+35% |
| 陈皮拌笋（item_1599） | 2 | 1 | “降低防御力”作用对象不明，记为 other |
| 蓄石秘剂（item_1870） | 1 | 0 | — |
| 酥麻炸虫蛹（item_2675） | 3 | 0 | — |
| 大碗碎茶（item_2702） | 1 | 0 | — |
| 玉米汁（item_2703） | 1 | 0 | — |
| 瓶装脆蔗汁（item_2704） | 1 | 0 | — |
| 梨花香茶（item_2748） | 1 | 0 | — |
| 游人酒（item_2749） | 2 | 1 | “降低防御力”作用对象不明，记为 other |
| 瓶装霞莓饮（item_2750） | 1 | 0 | — |
| 陈酿葡萄露（item_2803） | 1 | 0 | — |

## 通用约定与待确认

- 套装：所有记录 condition.pieces=3；配装即生效的记 mode=auto（condition.text=“3件套激活”），触发类记 mode=user 并在 condition.text 追加触发描述。
- 食药：所有记录 duration=300、mode=auto、beneficiary=self（原文未写“全队”，按使用者本人录入）；exclusiveGroup 留空，同类/跨类叠加与覆盖规则待规则确认（每条 notes 已注明）。
- teamUnique：长息（others）与拓荒（team）原文均为“…该效果无法叠加”，同按 teamUnique=true 处理；同队多人携带是否取最高/只计一次待规则确认。
- “所有技能伤害”（潮涌、清波）按战技/连携技/终结技录入，不含普通攻击。
- 未录入的非输出效果：生物辅助全部效果、长息“生命值+1000”、集成实训“受到的所有类型伤害-10%”、竹笋炒肉“受治疗效率”、速食骨汤与软骨饼干（纯治疗）。

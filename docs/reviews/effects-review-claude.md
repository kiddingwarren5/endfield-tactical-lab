# 效果目录独立审核（Claude）

## 审核版本

- 审核开始时 HEAD：`b9a76be`。审核期间其他提交把 HEAD 推进到 `560f831`。`git diff b9a76be 560f831` 显示 `sources/curated/*.json` 与 `docs/effect-schema.md` 在这两个提交之间**没有变化**，所以本报告对两个版本都有效。
- 修改分两轮：
  - **第一轮**：下文 #1–#31。协调方已在 `814535b` 中把它和其他改动一起提交。
  - **第二轮**：处理 GPT 审核报告（docs/reviews/effects-review-gpt.md）以及本报告原先的部分未决项，见文末“对 GPT 报告逐条处理结果”。这一轮基于 `814535b`，留在工作区，尚未提交。
- 引擎行为只核对到 2026-10-28 06:10（`dist/engine` 在审核期间也被别人改过）。引擎相关结论以当时的代码为准。

## 审核范围与方法

| 文件 | 条数 | 原文来源 | 覆盖 |
|---|---|---|---|
| effects-weapons.json | 170 | weapons.js `skills[].rankTexts` | 84 把武器全部核对（要求为 15 把） |
| effects-operators-A.json | 140 | operators.js 技能描述/params/天赋/潜能 | 13 名干员全部核对 |
| effects-operators-B.json | 192 | 同上 | 21 名干员全部核对（合计 34 名，要求为 10 名） |
| effects-sets.json | 35 | sets.js `description` | 19 个套装全部核对 |
| effects-consumables.json | 32 | consumables.js `effectText` | 25 个食药全部核对 |

方法：

1. **数值（脚本，全量）**：武器 `byRank` 的 9 个 Rank，逐个与 `rankTexts[i]` 抽出的数字比对；公式条目逐 Rank 与 `[a%+b%×层数]` 原文比对。干员 `byRank` 与 params 的 12 级原始值逐个比对，嵌套在 `dependsOn.base/per/cap` 里的 `byRank` 人工比对。`fixed` 值核对是否出现在 `evidence.text` 中；`evidence.text` 核对是否为原文子串。结果是 569 条中没有发现数值抄错。
2. **数值能否被引擎算出（脚本）**：用 `dist/engine/effects.js` 的 `valueOf` 实际计算可疑的取值结构。发现 3 条算出 NaN、3 条恒为 0（见下文问题表）。
3. **归区、受益者、属性/技能类型（人工逐条，并用脚本做关键词复核）**：每个实体的原文和条目并排生成对照表，逐条阅读（对照表生成脚本在审核者的临时目录，未入库）。另外用关键词规则全量扫了一遍：“受到的…伤害+”必须归 vulnerable 且受益者为 target，“脆弱/增幅”对应 fragile/amp，“全队/其他干员”对应 team/others，“所有技能”不得包含普攻，“X伤害+”的 elements 要与 X 一致。扫描命中的条目经人工复核都属于合理拆分，**归区、受益者、元素筛选、技能类型筛选没有发现错误**。
4. **结构与一致性**：检查 `modifies` 的目标是否存在、归区是否兼容；`applies.skills` 填的值是否属于技能键；`condition.mode` 与引擎的 segment 推断规则是否匹配；`teamUnique` 写法；`ratioMul` 是否写成倍数（35 条 ratioMul 的取值范围为 1.1–6，全部是倍数）。
5. **原始页抽查**：用 `tools/item2md.mjs` 查看 领航者(113)、四二式·肃阵(1649)、祀(2338)、伊冯(157) 的官方原文，与 dist 数据一致。唤月(2501) 与 明河(2503) 的官方页只有预告，没有技能文本，因此没有可录入的内容（与 docs/data-sources.md 的记录一致）。

## 结论摘要

- 审核 569 条，发现问题 **40 项**：
  - 已修 31 项，涉及 29 条：
    - 6 项是引擎会算出 NaN 或 0 的取值结构；
    - 4 项是 `modifies` 用错，导致效果被吞掉或被错误合并；
    - 2 项是 `condition.mode` 用错；
    - 2 项是异常专属倍率没有限定到异常段；
    - 17 项是 `applies.skills` 里填了分段 id，导致效果永远匹配不上。
  - 未决 9 项，需要定规则，或需要引擎配合。第二轮又解决了其中的 U1、U4（大部分）、U6、U8（部分）、U9（unit 部分），剩余未决见下表“状态”列。
- 第二轮按 GPT 报告和协调方要求：
  - 补录 6 条；
  - 同类相食 1 条按属性拆成 4 条；
  - 修改 75 条已有条目的结构字段：武器 maxStacks、等待窗口 window、倍数 unit "x"、食药 stacking "unknown" 等。
  - 目录条数从 569 变为 **578**，uncertain 从 31 变为 35。
- 另记录引擎侧发现 6 项（不在本次修改范围）。其中 E1、E2 直接影响这份目录能否发挥作用，建议优先处理。
- 原文数值、归区、受益者、元素与技能类型筛选方面**没有发现错误**。录入质量很高，问题集中在“数据结构能不能被引擎正确消费”。

## 逐条问题表（已修）

### A. 取值结构导致引擎算出 NaN 或 0

| # | 条目 id | 问题 | 原文 | 修改前 | 修改后 |
|---|---|---|---|---|---|
| 1 | wpn_funnel_0011.p3 | 公式里的裸 `min()` 在 `new Function` 中未定义，抛异常后被吞掉，结果恒为 0 | “每有一个被击飞的敌人，全队造成的法术伤害额外+3.5%，最多+10.5%” | `min(3.5*enemies,10.5)`（9 个 Rank 同理） | `Math.min(3.5*enemies,10.5)`。R9、2 个敌人时 = 19.6，已验证 |
| 2 | wpn_funnel_0006.p3 | 同上 | “每有一个被自然附着的敌人，小队内其他干员获得法术伤害额外+2.0%，最多+6.0%” | `min(2.0*enemies,6.0)` … | `Math.min(2.0*enemies,6.0)` … |
| 3 | chr_0017_yvonne.ult.critRate | `perStack` 写成了对象 `{byRank}`，`valueOf` 计算 `对象×层数` 得到 NaN | params「每层暴击率增加 3%」（12 级同值）、「最大叠加层数 10」 | `{"perStack":{"byRank":[3×12]},"maxStacks":10}` | `{"perStack":3,"maxStacks":10}`（12 级同值，可直接用标量，界面的层数选择器也能显示） |
| 4 | chr_0013_aglina.ult.fragile.breach | 同 #3，结果为 NaN | “法术脆弱效果会随破防层数额外提升”；params「每层破防提升法术脆弱 1.8%/2.2%/2.6%/3%」 | `{"perStack":{"byRank":[…]},"maxStacks":4}` | `{"byRank":[{"formula":"1.8*Math.min(layers,4)","vars":["layers"]},…]}`，`layers` 与潜能2 条目用的是同一个变量 |
| 5 | chr_0013_aglina.pot2.fragile | 公式引用了 `per`（它不是变量，而是 value 的兄弟字段）和裸 `min`，结果恒为 0 | “每层破防状态对法术脆弱的提升效果加倍，且结算时视为目标额外拥有1层破防（不超过4层）” | `{"formula":"per*(2*min(layers+1,4)-layers)","per":{"byRank":[…]}}` | `{"byRank":[{"formula":"1.8*(2*Math.min(layers+1,4)-layers)",…},…]}`，语义不变。12 级、2 层时为 12，加上 #4 的 6 共 18 = 3×2×3 ✓ |
| 6 | chr_0036_jsspsi.combo.perLayer | 同 #3。这条是 ratioAdd，勾选后会让该段倍率变成 NaN，伤害也随之变成 NaN | params「每消耗或吸收1层提高倍率 44%…100%」 | `{"perStack":{"byRank":[44,…,100]},"maxStacks":null}` | `{"byRank":[{"formula":"44*layers","vars":["layers"]},…]}`，与同干员潜能2 `8+3*layers` 写法一致 |

### B. `modifies` 用错，效果被吞掉或被错误合并

引擎规则（resolve.js `appliedFor`/`applyModifiers`）：带 `modifies` 的条目不会单独计入。只有两种情况会被并入目标：自身为 `other` 且是倍数时，与目标相乘；与目标同区时，与目标相加。其他组合会被直接丢弃。

| # | 条目 id | 问题 | 原文 | 修改前 | 修改后 |
|---|---|---|---|---|---|
| 7 | chr_0017_yvonne.pot3.bonus.cold | 本条是 bonus，指向的冰点条目是 critDmg，区不同，结果 +10% 增伤被丢弃 | 潜能3 “天赋冰点效果加强：对处于寒冷附着状态的敌人造成的伤害额外+10%” | `modifies:[talent2.critDmg.cold]` | 删除 `modifies`，作为独立增伤条目，notes 中说明原因 |
| 8 | chr_0017_yvonne.pot3.bonus.frozen | 同上（+20%） | “对处于冻结状态的敌人效果同样加倍” | `modifies:[talent2.critDmg.frozen]` | 删除 `modifies` |
| 9 | chr_0003_endminf.pot2.othersAtk | 受益者是 others，却并进了 self 的天赋条目：自身攻击力多加 15%，队友反而拿不到 | 潜能2 “自身获得攻击力提升时，其他友方干员获得一半的攻击力提升效果” | `modifies:[talent1.atk]` | 删除 `modifies`，与男主版 official_89.pot2.othersAtk 的写法保持一致 |
| 10 | chr_0034_typhoea.pot5.burstMul | ratioMul 并入 ratioMul 时引擎按“同区相加”处理：1.3+1.1=2.4，正确应为 1.3×1.1=1.43 | 潜能5 “强化射击造成的自然爆发伤害倍率提升至原本的1.1倍” | `modifies:[skill.burstMul]` | 删除 `modifies`，作为独立 ratioMul，引擎会把各 ratioMul 相乘 |

### C. `condition.mode` 用错

| # | 条目 id | 问题 | 原文 | 修改前 | 修改后 |
|---|---|---|---|---|---|
| 11 | chr_0030_zhuangfy.skill.lastStrike | segment 模式的含义是“触发后对本技能后续各段必然生效”，引擎（triggerKindOf=skill）会把 ×6 自动加到所有后续战技段上。原文说的是“最后一次雷击”这一下，不符合 segment 的定义 | “最后一次雷击造成6倍伤害” | `mode:"segment"` | `mode:"user"`（保留 uncertain） |
| 12 | chr_0032_lizhiyan.pot5.int.ultMul | 这是只在阵诀·智下生效的效果，却设为 auto（配装即生效）；同干员其他阵诀·智条目都是 user | “阵诀·智：…终结技二段破晦诀明的伤害倍率提升至原本的1.3倍” | `mode:"auto"`，text “配装即生效” | `mode:"user"`，text “阵诀·智生效（智识≥意志）” |

### D. 异常专属倍率没有限定到异常段

| # | 条目 id | 问题 | 原文 | 修改前 | 修改后 |
|---|---|---|---|---|---|
| 13 | chr_0016_laevat.pot3.burnDmg | `kinds:null` 匹配所有段；引擎不认 `anomaly` 字段，勾选后会让莱万汀所有灼热技能段 ×1.5 | “燃烧的伤害提升至原本的1.5倍” | `kinds:null` | `kinds:["mech"]`，`skills:["mech"]`，`segments:["burn","burnTick"]`（保留 anomaly） |
| 14 | chr_0018_dapan.combo.slamDmg | 同上，会加到物理技能段上 | “本次猛击的伤害获得额外提升” | `kinds:null` | `kinds:["mech"]`，`skills:["mech"]`，`segments:["crush"]` |

### E. `applies.skills` 里填了分段 id（B 文件与 A 文件写法不一致）

引擎 `effectApplies` 用 `applies.skills` 和段的 `skillKey`（normal/skill/combo/ultimate/mech）比对。B 文件有 19 条在 `skills` 里写了分段 id（如 `skill3`、`artsBurst`），这些条目**永远匹配不上任何段**；其中 6 条是 auto 模式的伤害倍率，等于被静默丢掉。A 文件的写法是“`skills` 填技能键，`segments` 填分段 id”。B 统一改成 A 的写法，其中 #11、#12 已在上表计入，下表列其余 17 条。

| # | 条目 id | 区/模式 | 修改前 | 修改后 |
|---|---|---|---|---|
| 15 | chr_0017_yvonne.pot1.extraCasts | other/auto | skills ["combo1"] | skills ["combo"] + segments ["combo1"] |
| 16 | chr_0027_tangtang.talent2.tornadoBonus | bonus/user | skills ["skill2"] | skills ["skill"] + segments ["skill2"] |
| 17 | chr_0027_tangtang.pot5.tornadoBonus | bonus/user | skills ["skill2"] | skills ["skill"] + segments ["skill2"] |
| 18 | chr_0033_camille.pot3.comboMul | ratioMul/auto | skills ["combo1","combo2"] | skills ["combo"] + segments ["combo1","combo2"] |
| 19 | chr_0031_mifu.skill.duanyunRefund | spRefund/auto | skills ["skill1"] | skills ["skill"] + segments ["skill1"] |
| 20 | chr_0031_mifu.skill.kaitianAsCrush | other/auto | skills ["skill3"] | skills ["skill"] + segments ["skill3"] |
| 21 | chr_0031_mifu.talent1.kaitianMul | ratioMul/user | skills ["skill3"] | skills ["skill"] + segments ["skill3"] |
| 22 | chr_0031_mifu.pot5.skillMul | ratioMul/auto | skills ["skill1","skill2","skill3"] | skills ["skill"] + segments ["skill1","skill2","skill3"] |
| 23 | chr_0034_typhoea.skill.burstMul | ratioMul/user | skills ["artsBurst"] | skills ["mech"] + segments ["artsBurst"] |
| 24 | chr_0034_typhoea.combo.burstVuln | vulnerable/user | skills ["artsBurst"] | skills ["mech"] + segments ["artsBurst"] |
| 25 | chr_0034_typhoea.talent1.arrowMul | ratioMul/user | skills ["skill2","skill3"] | skills ["skill"] + segments ["skill2","skill3"] |
| 26 | chr_0034_typhoea.pot1.airMul | ratioMul/auto | skills ["skill2","skill3"] | skills ["skill"] + segments ["skill2","skill3"] |
| 27 | chr_0034_typhoea.pot3.burstVuln | vulnerable/user | skills ["artsBurst"] | skills ["mech"] + segments ["artsBurst"] |
| 28 | chr_0034_typhoea.pot5.burstMul | ratioMul/user | skills ["artsBurst"] | skills ["mech"] + segments ["artsBurst"] |
| 29 | chr_0038_purrche.pot3.bombMul | ratioMul/auto | skills ["combo1"] | skills ["combo"] + segments ["combo1"] |
| 30 | chr_0038_purrche.pot5.giftMul | ratioMul/auto | skills ["ultimate3"] | skills ["ultimate"] + segments ["ultimate3"] |
| 31 | chr_0036_jsspsi.combo.perLayer | ratioAdd/user | skills ["combo1"] | skills ["combo"] + segments ["combo1"] |

> 注意：当前引擎不读 `applies.segments`（见引擎侧 E1）。统一写法之后，有 3 条 auto 条目从“永远不生效”变成了“对同技能的其他段也生效”：typhoea.pot1.airMul 会多乘到 skill1，purrche.pot3.bombMul 会多乘到 combo2，purrche.pot5.giftMul 会多乘到 ultimate1/2。A 文件原有的 chr_0016_laevat.pot1.followupRatio 也有同样的问题。修好 E1 后这些都会自动正确。

## 修改清单

| 文件 | 改动条目 |
|---|---|
| sources/curated/effects-weapons.json | wpn_funnel_0011.p3、wpn_funnel_0006.p3 |
| sources/curated/effects-operators-A.json | chr_0016_laevat.pot3.burnDmg、chr_0018_dapan.combo.slamDmg |
| sources/curated/effects-operators-B.json | 上表 #3–#12、#15–#31 涉及的 25 条 |
| effects-sets.json / effects-consumables.json | 无改动 |

共改动 29 条，没有增删条目（总数仍为 569）。JSON 保持原有缩进与结尾换行，未改动条目的文本没有变化（已逐条对比修改前后的 JSON）。

验证：

- `node tools/build_effects.mjs` 输出 `effects 569 uncertain 31 problems 0`
- `node tests/stats.test.mjs`、`node tests/damage.test.mjs`、`node tests/resolve.test.mjs` 全部通过
- 用 `valueOf` 实算 #1–#6，均得到预期数值

## 未决问题清单（需要定规则或做设计决定）

状态说明（第二轮后）：

- **U1 已处理**：24 条都在 `value` 顶层补了 `maxStacks`（方案②的数据部分）。引擎的 byRank 分支仍然只按 1 层计算，还需要引擎和界面支持。
- **U4 已处理**：3 条都改为 `unit:"x"`。
- **U6 已处理**：来源分层，见 GPT-2。
- **U8 部分处理**：已补录赛希潜能3、艾尔黛拉山顶冲浪；艾维文娜潜能2、昼雪潜能3、萤石潜能3 仍未录入。
- **U9 部分处理**：倍数类 `other` 已统一 `unit:"x"`。
- U2、U3、U5、U7 仍然未决。

| # | 条目 | 问题 | 读法/方案 ① | 读法/方案 ② |
|---|---|---|---|---|
| U1 | 24 条武器叠层效果：wpn_sword_0005.p2(2)、0018.p2(2)、0019.p2(3)、0015.p2(3)、0016.p2/p3(5)、0010.p2(2)、0012.p2(2)、0017.p2(3)、0022.p2(16)；wpn_claym_0011.p2(3)、0004.p2(3)、0016.p2(3)；wpn_lance_0006.p2(3)、0014.p2(4)；wpn_pistol_0006.p2(2)、0010.p2(3)、0007.p2(2)；wpn_funnel_0015.p2(2)、0017.p2(3)、0018.p2/p3(2)、0019.p3(4)、0020.p2(4) | 原文写明“最多叠加N层”，但结构化数据只有每层数值，最大层数只出现在 notes 里；引擎因此永远只算 1 层。干员和套装的同类效果都用 `perStack+maxStacks` 表示，写法不一致 | 改为 `byRank:[{perStack:x,maxStacks:N},…]`。引擎现在就能算，但界面的层数选择器只读顶层 `perStack`，结果会默认取满层 | 在 `value` 顶层加 `maxStacks`，由引擎/界面配合支持“byRank + maxStacks”（推荐） |
| U2 | wpn_claym_0008.p1；wpn_pistol_0005.p2/p3 | 原文“若装备者为主控干员，攻击力提升的数值翻倍”“若由装备者触发该效果，提升的数值翻倍”。现在的数值是翻倍前的值，notes 写着“引擎按主控×2 / 自身触发×2”，但**引擎并没有实现**，notes 与实际不符 | 各加一条同值的附加条目，条件为“装备者为主控 / 由装备者触发”，由用户勾选 | 在 schema 中新增“条件倍数”字段（如 `doubleWhen`），由引擎实现 |
| U3 | chr_0015_lifeng.talent1.atk、chr_0015_lifeng.pot3.atk | `dependsOn.attr` 写成数组 `["int","will"]`，超出 schema（单属性），引擎取到 `abilities["int,will"]`，结果恒为 0 | 每条拆成 int、will 两条，per 相同（0.15 和 0.05），相加即等价；pot3 的 `modifies` 也要相应拆开 | schema 允许 attr 为数组（取和），由引擎实现 |
| U4 | chr_0029_pograni.pot5.comboSp(×1.2)、chr_0033_camille.pot3.spMul(×1.15)、chr_0030_zhuangfy.ult.comboCdSpeed(×4 倍速) | 放在 spRefund/cdr 区，值却是“倍数”；同区其他条目都是点数或秒数/百分比，消费方很可能按加法处理 | 单位改为 `"x"`，并在 schema 中明确“倍数型资源效果” | 改为 `zone:"other"` 作为说明性条目，不参与资源计算 |
| U5 | chr_0032_lizhiyan.pot3.corrosion | `value:20(%)` 通过 `modifies` 指向天赋厉兵 `value:1.1(倍)`，同区相加得 21.1。由于没有抗性区，目前不影响伤害 | “额外提升原本的20%”理解为倍数 +0.2，总计 ×1.3，值应写 0.2 | 理解为再 ×1.2，总计 ×1.32，应改为 `other` 倍数 1.2 |
| U6 | chr_0026_lastrite.talent.brittle | 原文“将其寒冷脆弱的效果视为原本的1.5倍”，`modifies` 只指向自己的低温症；notes 又写“不限来源；用户实测法术脆弱也按此倍率” | 只放大别礼自己施加的寒冷脆弱（目前写法） | 放大目标身上全部寒冷脆弱（实测还包括法术脆弱），需要引擎的 `fragileMultiplier` 机制配合 |
| U7 | “施放X时”触发的 segment 模式条目（如 wpn_sword_0009.p1、wpn_lance_0011.p2/p3、wpn_funnel_0009.p2/p3、wpn_claym_0016.p2、wpn_funnel_0019.p2、wpn_pistol_0008.p2） | 引擎规定 segment 条目对该技能第 1 段无效。对“命中后/造成伤害后”触发的效果这是对的；但“施放时”获得的 buff 是否覆盖第一击，原文没有写 | 施放时立即生效，第 1 段也吃到 | 与“命中后”同样处理，第 1 段不吃 |
| U8 | 覆盖性小缺口 | 下列与输出或节奏有关的效果没有录入，notes 里也没有提：赛希 潜能3（连携技弹射1次）、艾尔黛拉 天赋山顶冲浪（对其他腐蚀敌人再发动一次战技）、艾维文娜 潜能2（雷枪存在时间+20秒）、昼雪 潜能3（冻结持续+2秒）、萤石 潜能3（缓速扩散） | 补录为 `other` 说明条目（与佩丽卡“循环协议”写法一致） | 维持不录（单体计算不受影响），只在 notes 中注明 |
| U9 | 跨文件格式（低优先级） | ① ratioMul 和倍数型 `other` 的 unit：A 写 `"%"`，B 写 `"flat"`（构建时 ratioMul 会统一成 `x`，`other` 不会）；② `stages` 格式：A 写完整 `{dependsOn:{…}}`，B 写 `{per,cap}`、`{duration}`，没有 value；③ evidence：B 在原文后拼接了 `[参数]…`；④ 资源类效果：A 用 `applies.skills` 表示所属技能，B 用 `applies.kinds` | 在 schema 中补充规定并统一修改 | 维持现状（目前不影响伤害） |

## 引擎侧发现（不在本次修改范围，供维护者参考）

| # | 位置 | 现象 | 影响 | 建议 |
|---|---|---|---|---|
| E1 | damage.js `effectApplies` | 不识别 `applies.segments` 和 `applies.anomaly` | 分段专属的倍率会作用到同技能的所有段：auto 条目 laevat.pot1.followupRatio、typhoea.pot1.airMul、purrche.pot3.bombMul、purrche.pot5.giftMul 已经多乘；user 条目在勾选后也会多乘 | 加一行：`if(a.segments?.length&&seg.id&&!a.segments.includes(seg.id)) return false;` |
| E2 | damage.js `calcSegment` / stats.js `getStats` | stat 区（atkPct/atkFlat/critRate/critDmg/artsStrength/ability）的效果只有“自身、auto”的才进面板。user/segment 模式的条目进入 calcSegment 后落到 `mods.other`，不参与计算；队友给的 stat buff（beneficiary=team/others）也不进面板 | 目录里大部分条件攻击力和暴击 buff，以及全部队友攻击力 buff，勾选后**都不影响伤害** | 先把已启用的 stat 区效果汇总回面板计算，再算各段伤害 |
| E3 | resolve.js `applyModifiers` | 修饰条目只检查是否开启，不检查自身的 `applies` | 例如别礼“低温脆性”只应作用于终结技伤害，但勾选后在任何段都会把低温症 ×1.5 | 折叠前先对修饰条目本身调用 `effectApplies(m,seg)` |
| E4 | 界面变量与层数选择器 | 界面的 `state.vars` 没有 `enemies`，所以 wpn_funnel_0011.p3 / 0006.p3 在界面上仍然是 0；层数选择器只认顶层 `value.perStack` | 公式类条目要靠全局 `vars.layers`，而“消耗层数”控件只在段带 `per:'unit'` 时才显示 | 让条目声明的 `vars` 自动生成输入控件 |
| E5 | resolve.js `triggerKindOf` | 只取第一个命中的关键词：“战技和终结技”(wpn_claym_0004.p2) 只认为是终结技，“战技或连携技”(wpn_claym_0016.p2) 只认为是连携技 | 另一类技能的后续段不会自动生效 | 返回一个集合 |
| E6 | tools/build_effects.mjs | 不检查：`perStack` 是否为数字；公式能否求值；`modifies` 的区是否兼容；`applies.skills` 的值是否属于技能键 | 本报告 A、B、E 类问题都能通过构建 | 增加这几项校验，可以防止这类问题再次出现 |

## 覆盖性结论

- 武器 84/84：除唤月（官方没有技能文本）外，所有与伤害、属性、资源有关的被动都已录入。没有录入的只有治疗、护盾、防御类效果，且大多在 notes 中有说明。大雷斑、昔日精品的第三技能全部是护盾或治疗，因此没有条目。
- 干员 34/34：天赋、潜能、技能中的增益、易伤、脆弱、增幅、倍率、资源效果覆盖完整，只有 U8 所列的少数多目标或排轴类效果缺失。
- 套装 19/19、食药 25/25：完整。生物辅助装备组和两种回血食物只有治疗或减伤效果，正确地没有录入。

## 对 GPT 报告逐条处理结果（第二轮）

GPT 报告：docs/reviews/effects-review-gpt.md（抽样 182 条，只读）。它的数值结论（未发现抄错）与本报告一致。下表的“处理”是第二轮改动，均在 `814535b` 之上的工作区中。

### 漏录

| # | GPT 指出 | 处理 | 新增/修改条目 |
|---|---|---|---|
| GPT-M1 | 艾尔黛拉天赋“山顶冲浪”未录 | **已补录**。`other`，value=1（追加施放次数），user 条件为“战技消耗腐蚀后附近有其他腐蚀敌人；每次主动施放只触发一次” | 新增 chr_0025_ardelia.talent.mountainSurf |
| GPT-M2 | 赛希潜能3“对周围1个其他目标弹射1次”未录 | **已补录**。写法与佩丽卡“循环协议”一致 | 新增 chr_0011_seraph.pot3.bounce |
| GPT-M3 | 洛茜“沸血”燃烧时 ×1.5 只写在条件文字里 | **已补录为独立修饰条目**：`other`，1.5，`unit:"x"`，`modifies:[talent.boilingBlood]`；同时从沸血的条件文字中删去“燃烧时1.5倍”。满阶 24%→36%，潜能3 后 32%→48% | 新增 chr_0028_wulfa.talent.boilingBurn；修改 talent.boilingBlood 的条件文字和 notes |
| GPT-M4 | 庄方宜潜能3“青霆剑存在时间+10秒”未录 | **已补录**。`other` 10 秒，auto，标注“仅排轴使用（36→46 秒）” | 新增 chr_0030_zhuangfy.pot3.swordDuration；修改 pot3.spRefund 的 notes |
| GPT-M5 | 祀战技替换阶段费用（起墨15、收笔0）未结构化 | **已补录为两条说明性 `other` 条目** | 新增 chr_0036_jsspsi.skill.qimoCost(15)、skill.shoubiCost(0)；修改 skill.inkRecord 的 notes |
| GPT-M6 | 祀“丹青不渝”30%加速未录 | **未改，列为未决**。原文没有说明“加速”是否只指移动速度，汤汤“肝胆相照”的加速也同样没有录入；建议在规则里统一定义“加速”后再决定 | — |
| GPT-M7 | 别礼/伊冯/庄方宜技能 params 中的基础资源（返还技力、终结技能量）没有目录条目 | **不改**。schema 规定目录只录入“效果”，基础参数由 operators.js 的 params 提供，模拟器也直接读 params。建议在 schema 中写明这一分工 | — |

### 结构化与问题表

| # | GPT 指出 | 处理 | 涉及条目 |
|---|---|---|---|
| GPT-1 | 同类相食 `elements` 列出了全部法术属性，应按被消耗的属性生效 | **已拆条**。按 燃烧/导电/冻结/腐蚀 拆成 4 条，每条只含一个元素、各自 25 秒冷却；原 `wpn_pistol_0009.p2` 删除（全仓库检索过，没有代码引用该 id） | 新增 wpn_pistol_0009.p2.heat / .electric / .cold / .nature |
| GPT-2 | 别礼低温脆性被扩展到法术脆弱，超出官方原文 | **来源分层**。`evidence.text` 保留官方原文（只写寒冷脆弱）；`evidence.category` 改为 `"official+user"`；notes 中单独写用户实测扩展，并说明该扩展由 build_effects 在构建时写入 `fragileMultiplier`；条件文字保留官方措辞；unit 改为 `"x"`。没有改动 build_effects | chr_0026_lastrite.talent.brittle |
| GPT-3 | 倍数类 `other` 的 unit 写成 `%` 或 `flat`，量纲不一致 | **统一为 `unit:"x"`**。资源类的倍数条目同时处理（本报告 U4） | 低温脆性、佩丽卡 pot4.conductMul、弧光 pot3.wandererMul、安塔尔 pot1.ampMul、赛希 pot5.ampMul、梨诺 pot5.ampMul、噗切娜 pot1.giftChance / pot5.fragileMul、祀 pot3.ampMul、诀 talent2.corrosion、骏卫 pot5.comboSp、卡缪 pot3.spMul；新增的 boilingBurn 也用 x |
| GPT-4 | 每层单独计时的武器效果，叠层上限没有结构化 | **在 `value` 顶层补 `maxStacks`**，覆盖 GPT 点名的 7 条和其余 17 条，共 24 条；最大层数逐条从原文正则抽取。引擎的 byRank 分支目前忽略这个字段，计算结果不变，需要引擎配合（见 U1） | 见 U1 列表 |
| GPT-5 | 等待窗口与生效持续时间混用 | **新增 `window` 字段（秒）**，`duration` 改为 null，表示“只在下一次该技能期间生效，结束后消耗”，notes 同步改写。注意：模拟器 simulate.js 在 duration 为 null 时默认按 15 秒计，需要模拟器改读 `window` | wpn_sword_0015.p2(30)、wpn_sword_0021_ink.p2(20)、wpn_lance_0006.p2(30)、wpn_sword_0017.p2(30)、wpn_claym_0018.p3(20) |
| GPT-6 | “X期间造成的伤害”被限制为技能 kinds，依据不足 | **标记 `uncertain:true`**。两种读法已在 notes 中：①只算该技能的伤害；②该技能持续期间内的全部伤害 | 上表除 claym_0018.p3 以外的 4 条 |
| GPT-7 | 伊冯满层暴伤的 `duration=7` 起点不清 | **已修**：duration 改为 null，notes 写明“满层后生效，至本次终结技结束时失效，不从满层时重新计 7 秒” | chr_0017_yvonne.ult.critDmg |
| GPT-8 | 伊冯“此次重击”、别礼潜能1 低温灌注重击只靠文字约束 | **未改，列为未决**。现有段数据只有普攻第1–N段，没有“重击”段可以筛选；需要先在 operators.js 中标出重击段（或者由模拟器按事件处理），再补 `applies.segments` 和单次消耗字段 | chr_0017_yvonne.talent1.heavyBonus、chr_0026_lastrite.pot1.heavyExtra / heavyPoise |
| GPT-9 | 伊冯“每次普通攻击”叠暴击率，应按击数叠加 | **未改**。数据已表达为每层 3%、最多 10 层（第一轮已修好 NaN），按击数叠加属于模拟器的事件逻辑；手动计算时用层数选择器 | chr_0017_yvonne.ult.critRate |
| GPT-10 | 冷却“恢复速度×4”的量纲不明 | **已修**：仍用 `zone:"cdr"`，unit 改为 `"x"` | chr_0030_zhuangfy.ult.comboCdSpeed |
| GPT-11 | 食药 `stacking:"none"` 没有原文依据 | **已修**：32 条全部改为 `"unknown"`，保留 notes 中的“待规则确认”。注意：界面 buff 卡片会把 stacking 原样显示为 “· unknown” | 全部 item_*.p* |
| GPT-12 | 十二问等条目的 `stat:"sub"` 不在 schema 枚举中 | **不改数据**。stats.js 已支持 sub（按副能力处理），建议在 docs/effect-schema.md 的 stat 枚举中补上 `sub`。本次按要求不改 schema | wpn_sword_0018.p1、wpn_sword_0019.p1、wpn_claym_0012.p1、wpn_claym_0015.p1、wpn_funnel_0013.p1、wpn_funnel_0008.p1 |

### 第二轮修改清单与验证

| 文件 | 新增 | 修改 | 删除 |
|---|---|---|---|
| effects-weapons.json | 4（同类相食拆条） | 26（24 条 maxStacks；5 条 window，其中 3 条与 maxStacks 重叠；4 条 uncertain） | 1（wpn_pistol_0009.p2） |
| effects-operators-A.json | 2（mountainSurf、boilingBurn） | 5（boilingBlood、brittle 及 3 条 unit） | 0 |
| effects-operators-B.json | 4（seraph.pot3.bounce、zhuangfy.pot3.swordDuration、jsspsi.skill.qimoCost / shoubiCost） | 12（unit "x" 9 条，含 zhuangfy.ult.comboCdSpeed；yvonne.ult.critDmg；notes 更新 2 条：zhuangfy.pot3.spRefund、jsspsi.skill.inkRecord） | 0 |
| effects-consumables.json | 0 | 32（stacking unknown） | 0 |

验证：

- `node tools/build_effects.mjs` 输出 `effects 578 uncertain 35 problems 0`
- stats、damage、resolve 三项测试通过；`tests/sim.smoke.mjs` 可以运行，输出中“别礼终结技能量不足”属于模拟排轴提示，与本次修改的条目无关
- 新增与拆分的条目已用 `valueOf` 实算：同类相食·冻结 R4=16，沸血燃烧倍率=1.5，钢铁余音 p2 R4=12（maxStacks 没有改变单层值）

## 总体结论

这份效果目录**忠实于官方原文**：569 条的数值、归区、受益者、元素与技能类型筛选，没有发现与原文不符的地方，31 条 uncertain 的两种读法也都写清楚了。

问题主要出在“数据结构能否被引擎正确消费”，本次已修 31 项、涉及 29 条：

- 6 条会被算成 NaN 或 0；
- 4 条 `modifies` 用错，导致效果被吞或被错误合并；
- B 文件 19 条把分段 id 写进 `skills`，导致永远匹配不上；
- 若干条模式或筛选范围有误。

第二轮处理 GPT 报告后，补齐了 6 处明确漏录，并把等待窗口、叠层上限、倍数量纲、食药叠加规则、同类相食的属性范围、低温脆性的来源分层都写进了结构化字段，目录现为 578 条。

建议维护者接下来按以下顺序处理：

1. 引擎 E1（segments 筛选，1 行代码）和 E2（条件 stat buff 进面板）；
2. 引擎、界面、模拟器改读新字段：武器 `value.maxStacks`、`window`、`unit:"x"`；
3. 决定 U2（“翻倍”条件）、U3（多属性 dependsOn）、GPT-8（重击段）、GPT-M6（“加速”的定义）；
4. 在 build_effects 中加入 E6 的结构校验，并在 schema 中补上 `sub`、`window`、`unknown`、`x`。

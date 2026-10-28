# 本体与知识图谱（ontology / knowledge graph）

把散在数据与引擎里的结构抽成一张图：有什么实体、靠什么关系、哪些约束必须成立。图只回答“有什么、靠什么、冲突什么”；伤害和轴的结论永远由模拟器算。

- 词表（分类法）：`dist/data/vocab.js`，所有枚举的唯一出处。
- 构图、查询、校验：`dist/engine/graph.js`（`buildGraph`、`validateGraph`、`comboRequirements`、`teamDependencies`、`itemSensitivity`、`teamUniqueConflicts`、`effectEnablers`）。
- 校验与报告：`node tools/validate_graph.mjs` → `docs/graph-report.md`；`tests/graph.test.mjs` 要求错误为零。

## 1. 实体（节点）

| 类型 | id 前缀 | 来源 | 主要属性 |
|---|---|---|---|
| 干员 operator | `op:` | operators.js | 元素、职业、武器类型、形态数（诀 2）、是否官方未公开 |
| 技能 skill | `skill:<干员>:<normal/skill/combo/ultimate>` | operators.js + mechanics.js | 名称、阶段链（河山共影 → 起墨 → 收笔）、形态差异 |
| 效果 effect | `effect:` | effects.js（目录） | 区、受益者、全队唯一、条件性（§3） |
| 触发代码 trigger | `trigger:` | effects.condition.trigger | 由触发表解析到事件 / 状态 / 已处理 / 未建模 |
| 事件 event | `event:` | vocab.EVENT_FAMILIES、CUSTOM_EVENTS | 施放、命中、重击、附着、达到层数、消耗、异常、爆发、定身、水龙卷、提前巨浪、终结技结束、碎冰、施加增幅类、技力恢复、处决、队友连携；自定义：主控受击、异常被消耗、晶体被消耗、敌人蓄力、失衡 |
| 状态 state | `state:` | vocab.STATES + 机制里的自身状态 | 终结技期间、目标冻结/寒冷/脆弱/失衡/低血、形态智、自身状态（启示已满、晶体耗尽、演唱姿态） |
| 资源 resource | `resource:` | vocab.RESOURCES | 技力、返还技力、能量、附着层、破防层、涡流、笔意、熔火、雷枪、炸弹、连击、晶体、猎矢、启示、姿态 |
| 元素 / 异常 | `element:` `abnormal:` | vocab | 五元素；法术异常四种、物理异常四种；伪异常 trigger / artsBurst |
| 武器 / 装备 / 套装 / 食药 | `weapon:` `gear:` `set:` `consumable:` | 各数据文件 | 武器类型、槽位、套装件数、是否无套组技能、全队唯一（由效果推出） |
| 角色 actor | `actor:mainControl` `actor:enemy` `actor:ally` | 固定 | 主控重击/处决、敌人行为、队友连携这类“不是某个技能”的提供者 |

## 2. 关系（边）

| 关系 | 从 → 到 | 含义 | 硬/软 |
|---|---|---|---|
| hasSkill / hasEffect / hasElement | 干员 → 技能；来源 → 效果 | 归属 | |
| emits | 技能 → 事件 | 这个动作会产生该事件（附着带元素与层数，异常带种类，消耗带元素） | |
| applies / inflicts / creates / consumes / gains | 技能 → 元素、异常、资源 | 施加附着、施加异常、生成资源（涡流、笔意）、消耗资源、回技力/能量 | |
| chains | 技能 → 自身 | 阶段链（替换段名列表） | |
| requires | 连携技 → 事件 / 状态 | **发动条件**：不满足就放不出来（模拟器强制） | 硬 |
| triggersOn → resolvesTo | 效果 → 触发代码 → 事件 / 状态 / handled / unmodeled | **效果条件**：满足了伤害或资源更好，不满足只是没这条加成 | 软 |
| appliesTo / benefits / affects | 效果 → 元素 / 队友 / 主控 / 敌人 | 效果作用范围 | |
| inExclusiveGroup / modifies | 效果 → 互斥组 / 效果 | 同组取最大；潜能修改天赋 | |
| inSet / gives | 装备 → 套装；装备、武器 → 属性 | 配装分析用 | |

硬和软分开是原则：规划器把硬依赖交给模拟器判可行，把软条件只当搜索先验（排序、候选生成），绝不当约束。强行满足所有软条件会把最优解挤成次优；方向是“尽量多满足”，由模拟伤害裁决。

## 3. 效果的两个维度

生效方式（activation，看什么才生效）与实现状态（status，引擎算不算）分开记，互不代替。

| activation | 含义 | 判定 |
|---|---|---|
| static | 配装即生效 | 无触发代码或 always |
| event | 取决于轴里发生了什么事件 | 触发代码解析到事件 |
| state | 取决于结算时目标或自身的状态 | 触发代码只解析到状态 |
| segment | 同一技能内按段顺序必然触发 | 条件模式 segment |

| status | 含义 | 判定 |
|---|---|---|
| modeled | 引擎按目录数值结算（含 modifies / 脆弱倍率这类修饰器） | 触发有事件或状态归属；或无触发且区不是 other |
| handled | 引擎在机制里结算（笔意、强制异常等） | 触发表标 handled |
| unmodeled | 引擎不算 | 触发表标 unmodeled、代码未知、或区为 other 且不是修饰器 |
| informational | 明确标为只记录 | effect.informational |

“区为 other”只表示归区，不代表不算：别礼低温症的脆弱倍率、祀笔意记录、潜能对增幅的乘法修饰都参与结算。

一件装备 / 武器 / 套装要不要重排（`itemSensitivity`）：有已建模的 event / state / segment 效果，或有常驻的资源类效果（充能、能量消耗、冷却、技力）都要重排，因为它们改变可行轴；只剩 unmodeled 效果时结论是“未知”，不是“不敏感”。没有“固定轴边际收益就是准的”这种保证。

## 4. 约束（校验器 errors，必须为零）

- 所有枚举值在词表内：元素、职业、武器类型、槽位、区、受益者、叠加方式、条件模式、单位、属性名、异常、附着目标、连携条件类型、自定义事件。
- 引用都能解析：效果来源、装备所属套装、modifies 指向的效果。
- 每个触发代码在触发表有归属；触发表用到的事件族与状态在词表内。
- 每个非预览干员有机制数据、三个技能分支与连携发动条件；技能形态数与机制形态数一致；套装不得同时“无套组技能”又有效果条目。
- 结构：效果 id 唯一；非说明性效果必须有数值；持续时间、冷却非负；潜能 0–5；连携层数为正整数；机制引用的效果存在；机制指向的干员存在；形态分支与阶段链递归按同一规则检查。

待裁定（warnings，写进报告由人定）：装备词条未识别、套装没有效果条目、互斥组只有一个成员、干员自带效果标了全队唯一、资源名未登记、连携条件无人能满足。

## 5. 查询

- `comboRequirements(干员, {mode})`：连携发动条件，按候选（顶层条件与每个“或”分支）列出；候选内多个条件是“同时”。每个条件给候选提供者：explicit 显式事件、derived 规则派生（异色附着引发异常并消耗原附着、同色再施加引发法术爆发、击飞/倒地加破防、猛击/碎甲消耗破防，都带守卫条件）、actor 主控/敌人、self 自身状态。只给 `hasCandidateProvider`，不承诺“可满足”；前提（目标状态、血量、姿态）单独列出。
- `teamDependencies(编队)`：输入干员 id 或 {operatorId, mode, weaponId, setIds}；输出 `hard`（硬依赖，队内候选提供者与外部前提）、`soft`（已建模的动态效果及其触发者，含武器与套装）、`buffs`（给队友、主控、01 号位、敌方减益的效果）、`conflicts`（全队唯一撞车）。软条件只用于排序和候选生成，不裁剪可行解。
- `effectEnablers(效果, {wearer})`：软条件的触发者。默认只认效果所有者自己的事件（与模拟器一致），触发表写 anyone 才放开；武器 / 套装效果需要装备者。返回触发限制（阶段、层数、形态门槛、每场一次、内置冷却）与时长。
- `itemSensitivity(物品)`：见 §3。
- `weaponCompatible(干员)` / `gearMatch(干员, 装备)`：武器类型与主副属性是否对得上；`enabledEffects(干员, {potential, mode, sets})`：当前潜能、形态、套装件数下哪些效果启用。
- `teamUniqueConflicts([物品])`。

形态（诀智/意）与阶段链（河山共影 → 起墨 → 收笔、断云 → 追形 → 开天、替换战技）作为技能的变体进入 emits / requires 边的 mode / stage 字段，查询按形态过滤。

## 6. 新干员接入清单

1. operators.js（官方）→ 校验器会要求 mechanics.js 有对应条目。
2. mechanics.js：战技 / 连携 / 终结技的附着、消耗、异常、资源、阶段链、连携发动条件（类型必须在词表）。
3. effects 目录：每条效果标触发代码；新代码在触发表加一行（覆盖测试强制）。
4. `node tools/validate_graph.mjs` 零错误；报告里的待裁定项逐条处理或记入 verification-needed。

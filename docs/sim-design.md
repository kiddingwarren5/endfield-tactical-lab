# 排轴模拟与自动排轴设计（批次 5–8）

> 目标：把“排轴”当作一个有证据支撑的离散事件模拟 + 受约束调度优化问题来做。输出可执行的轴、备选轴、明确的误差来源与预估区间，而不是单一“最优”数字。
> 规则证据：docs/rules.md §C/§F；研究报告 docs/research/*.md；案例 docs/cases/。

## 1. 问题形式化

### 1.1 状态 S(t)
- 全局：战斗时间 t（游戏内时间，终结技演出暂停见 1.5）、共享技力 SP ∈ [0,300]，分为真实技力 SP_r 与返还技力 SP_p（毒技力），初始 SP_r=200, SP_p=0；主控 c(t)；敌人附着 {元素: 层数 ≤4, 到期时刻}、异常状态（等级、到期）、失衡值（默认对照靶不失衡）。
- 每干员 i：终结技能量 U_i ∈ [0, U_i^max]（初始 0）；战技/连携/终结技冷却；普攻串位置与下一次出手时刻；个人增益（名称、值、层数、到期）；技能内部状态（别礼低温灌注、祀笔意等）。

### 1.2 动作 A
- 主控：普攻段（按攻击串顺序，含重击）、下落攻击、处决（目标失衡时）、切换主控；
- 任意干员：战技（消耗 SP；替换型战技逐段）、连携技（条件满足且冷却就绪，窗口内）、终结技（U_i ≥ U_i^max，冷却就绪）；
- 非主控：自动普攻（AI 节奏，衰减系数 δ ∈ [δ_lo, δ_hi]，见 1.4）。

### 1.3 事件结算顺序（同一时刻）
1. 技能消耗（扣真实/返还技力：返还优先；记录“真实消耗量”）→ 2. 施放时触发的效果（施放即生效的增益、返还技力）→ 3. 命中：逐段伤害结算（调用第一阶段伤害核心，使用命中时刻的状态快照）→ 4. 命中后状态施加（附着层数、异常、脆弱/易伤、层数消耗）→ 5. 资源回复（战技：全队 +6.5×真实消耗/100×(1+充能效率_i)；连携：施放者 +自身值×(1+效率)；特殊回能）→ 6. 被动/天赋触发（如“连携命中寒冷后”武器增益）→ 7. 到期清理。
   依据：rules C12/C13（研究 + 官方教学）；无明确证据的顺序标注为假设并在日志中可见。

### 1.4 误差来源（必须随结果输出）
| 项目 | 处理 | 区间来源 |
|---|---|---|
| 非主控自动普攻衰减 δ 与出手频率 | 参数化：δ 默认区间 [0.5, 1.0]，频率 = 主控攻击串节奏 × φ, φ∈[0.6,1.0] | 无实测（rules C17）；结果给出 δ=lo/hi 两端的总伤区间 |
| 普攻段时长 | 按武器类型的默认帧时长表（假设），可按干员覆盖 | 待实测；影响 DPS 分母 |
| 技能前后摇、取消点 | 默认固定值（战技 0.8s、连携 1.2s、终结技演出 3s 且暂停计时） | 假设；案例视频校准 |
| 连携触发窗口 | 5 s（单一来源） | 研究 |
| 附着持续 | 20 s（单一来源） | 研究 |
| 返还技力消耗顺序 | 返还优先 | 研究（GK），未实测 |
| 食药互斥 | 单一生效、后吃覆盖（单一来源） | 研究 |
结果报告形式：总伤/DPS 给“基准值 + [下界, 上界]”，并列出每项误差源的贡献（分别取两端重算）。

### 1.5 时间口径
- 模拟时钟 = 游戏内战斗时间；终结技演出期间：自然回技力暂停、部分增益计时暂停（莱万汀官方说明）；默认把演出时长计入“实际耗时”但不计入“增益计时”。两种口径（含/不含演出）都输出。

## 2. 优化目标与搜索范围（批次 7）

### 2.1 目标
默认目标：最大化平均每秒伤害 DPS = D_total / T_cycle，约束：所有入队干员至少各释放一次终结技；周期结束 = 最后一个用于满足约束的终结技全部伤害结算完（无直接伤害的终结技按生效时刻）。可选目标：固定时长总伤、首个终结技最早时刻、指定截止条件（充能阈值）。

### 2.2 形式化（受约束的离散事件调度）
- 决策变量：动作序列 a_1..a_n 及其时刻；可行性由模拟器判定（技力、能量、冷却、窗口、动作冲突）。
- 这是带资源约束与时间窗的调度问题（RCPSP/TSP-TW 的变体，NP-hard）。我们不追求全局最优证明，而是：
  1. **基线**：规则驱动的贪心（“增益最齐全时放高伤技能”“有价值的第二次终结技不放弃”“避免技力溢出”）。
  2. **束搜索（beam search）**：在离散决策点（每次技力/能量/冷却状态变化处）展开候选动作，按启发式分值（未来 Δt 内可达的预期伤害 + 资源价值）保留前 B 条分支；B=20–50，深度到周期结束。
  3. **局部改进**：对束搜索结果做邻域扰动（交换两次技能顺序、推迟/提前连携等待层数、换终结技目标），接受改进（简单爬山/模拟退火）。
  4. **候选对照**：固定输出“立即放连携 vs 等 4 层”“祀终结技刷新对象 A/B”“终结技 1 次 vs 2 次”等成对比较的伤害与资源曲线。
- 理论依据：带时间窗的资源约束调度常用的启发式 + 束搜索 + 局部搜索框架（文献：RCPSP 启发式综述；beam search for scheduling）。我们的状态空间小（4 人、≤12 动作类型、周期 30–90 s），束搜索足以覆盖主要分支；误差来源（1.4）比搜索不完全带来的损失更大，因此以“可解释的较优解 + 对照候选”为交付。

### 2.3 剪枝规则（有证据的）
- 技力溢出（SP 达 300 且仍自然回复）→ 惩罚；
- 终结技能量满且无意义等待 → 惩罚；
- 连携可发动但窗口即将关闭 → 强制决策点；
- 同一干员动作互斥（施法中不可再施法）。

### 2.4 充能阈值（批次 7.4）
对固定轴与截止条件集合 {(干员 i, 时刻 T_k)}：以充能效率 e_i 为变量，单调性：能量累计随 e_i 单调不减 → 用二分法在 [现有值−100%, +300%] 搜索满足 U_i(T_k) ≥ U_i^max 的最小 e_i；输出：阈值、现有值、差额、适用前提（该轴、δ 取值、舍入边界）；若上界仍不满足 → “无解”。各来源是否受效率影响按 rules B10 标记。

## 3. 验证（批次 6/7/8 验收）
- 构造可行/不可行轴：技力不足、能量未满、冷却未到、连携未触发、动作冲突、增益落空 → 模拟器必须报具体错误。
- 守恒检查：每个事件前后 SP_r + SP_p 变化 = 回复 − 消耗；能量变化可追溯；总伤 = Σ逐击；占比和 = 1。
- 案例比对：docs/cases 中有文字轴的案例 → 重放，比较资源曲线与终结技时刻；说明能证明的是“模型复现”而非“实战验证”。

## 4. 数据接口
- 需要新增的数据：各干员普攻段时长（假设表）、重击回技力表（部分已知）、连携触发条件的可机读表（由技能描述整理）、终结技演出时长（假设）。全部放 dist/data/timing.js 并带 origin 标记。

## 5. 已知限制（2026-10-30 更新）
下面带删除线的是 2026-10-28 评审列出、现已解决的；其余仍是简化：
- ~~条件伤害段无条件执行；所有段压在同一命中时刻~~ → 段计划按条件词表判定，延迟 / 重复段按时刻结算（见 §8）。
- 技能的多段命中仍压在同一时刻（除显式 delay / every 的段）；提弗洛斯 5 次空中普攻、大潘 6 段连斩都在一个事件里结算，对“每次命中”类效果的时序是近似。
- 敌人只做两件事：每 4 s 攻击主控、挨打。不蓄力、不移动、无限血、单目标；触发表里 scenario 类效果因此不发生（docs/trigger-coverage.md）。
- 暴击口径：保底（critMode never）下暴击类效果不触发；期望 / 必暴击口径下按每次命中都暴击触发，是上界。
- 概率口径：保底下概率段与概率效果不发生；options.procMode=expected 按概率折算段伤害，但概率效果（珍鳞攻击力、特殊赠礼脆弱）一旦发生按全额算，是上界。
- 连击状态的乘区（战技 +30% / 终结技 +20% 每层，施放时消耗）按研究值，消费规则没有实测（verification-needed 60）。
- 替换型战技各阶段共用基础伤害段（祀起墨/收笔、弭弗三段）。
- 异常状态的后续效果（导电/碎甲易伤、腐蚀减抗、燃烧跳伤、碎冰）未完整进入伤害流程。
- 终结技演出暂停只作用于技力回复与非主控普攻，增益到期与冷却未暂停。
- 回能效率按接收者初始面板，不含条件/职业天赋的动态效率。
- 连携触发事件对异常/反应消费的派发不完整；目标条件（如伊冯需冻结目标）未检查。
- 搜索候选的可行性判定（技力≥100 固定）与模拟器不完全一致；周期判定与阈值二分在“截止前已施放终结技”情形下需改为“到达满能时刻 ≤ 截止”口径。

## 补充（2026-10-29）：终结技演出独占与顺序轴模式
- 终结技演出（castSeconds.ultimate=3 s，timing.ultimatePausesTimers）期间，任何干员不能施放战技/连携/终结技（实机：演出全局暂停）。此前允许重叠，导致搜索利用“先放别礼、再放祀增幅、别礼伤害在增幅内结算”的模型漏洞。
- 同一时刻的事件顺序：状态事件（命中、附着、爆发）→ 普攻 → 计划动作；与 `sequence` 模式解码一致，保证“解码出的时刻回放时可执行”。
- `input.sequence`：顺序轴模式，每 0.5 s 或任一事件后尝试执行下一步；输出 `sim.scheduled`（精确时刻）。

## 触发系统（2026-10-29 重写）
- 以前：按条件文本正则猜测触发（十几种说法），其余效果在模拟中永不触发（约 170 条静默）。
- 现在：以效果目录 `condition.trigger` 代码为唯一依据，查 `dist/engine/sim/triggers.js`：
  - 事件型 `{on:…}`：施放（cast）、命中（hit，按段）、附着（attach）、层数（attachLayers）、消耗（consume）、异常（abnormal）、爆发（burst）、重击（heavy）、定身（root）、水龙卷数量（tornado）、提前引爆（earlyWave）、终结技结束（ultimateEnd）、碎冰（iceShatter）、战斗开始（battleStart）、施加增幅/脆弱/易伤类（applyDebuffCategory）、自身技能回技力（spGain）。过滤字段：kind/by/element/which/zone/source/min/heavy/infused/targetHas/state/anyone/once/duration。
  - 状态型 `{state:…}`：结算时判定（终结技期间、目标冻结/寒冷附着/失衡、智形态、恒真/恒假）。
  - `{handled}`：引擎别处已处理（别礼脆弱 ×1.5、祀按层倍率、汤汤涡流返还）。
  - `{unmodeled:原因}`：明确未建模（治疗、暴击、破防/物理异常、源石结晶、法术异常消耗、各类专属状态），原因列在 docs/trigger-coverage.md。
- 形态门槛：代码前缀 `intGeWill&` / `willGtInt&`，以及文本“阵诀·智/意”，按干员当前形态（面板自动判定）门控。
- 新机制：汤汤涡流（连携生成、战技/提前引爆消耗，每处返还 20 技力、多一个水龙卷）、定身事件（祀战技、汤汤终结技）、终结技结束事件、主控下落攻击。
- 覆盖测试：tests/triggers.test.mjs 要求目录里每个代码都在表中有归属，并生成 docs/trigger-coverage.md。

## 8. 条件词表与状态机（2026-10-30）
机制数据不再允许“未建模”：每个伤害段、机制异常、附着、回能、返还要么无条件，要么带一个结构化条件；触发表不再允许 {unmodeled}，只允许 {scenario} 与 {noDamage} 两类带理由的例外（tests/triggers.test.mjs 与 tests/segment-conditions.test.mjs 断言）。

条件词表（simulate.js planOk，对象里每个键都要成立）：duringUltimate、targetFrozen、consumedAbnormal（true / false / 异常列表）、consumedAttach（true / false / 属性列表 / {min}）、consumedBreach{min}、consumedCrystal、resourceSpent（资源 id）、triggerLayers{min,max}（连携触发时的层数）、stage（阶段链 / 两段连携的第几次）、proc（概率名；保底口径只打 not 分支）、targetFragile、targetBreach{min}、targetAttached、targetAbnormal、airborne。施放上下文记在 S.perCast[成员|技能类]：abnormalAtCast、consumedAbnormal、consumedAttach / consumedAttachEls、consumedBreach、consumedCrystal、resSpent、triggerLayers、stageIndex、comboMul。

段计划字段：times、timesFrom（资源数 / consumed:异常）、lastMul、delay（从施放时刻起）、every（重复间隔，从首次命中起）、from（取别的技能类的段，如终结技后的空中普攻）、asHeavy（主控视为重击）、factor、when。when.fires=rule 表示该段由资源 / 触发 / 目标状态规则打出（熔火追加、连击追加、铁誓袭扰 / 决胜、集束打击、囹圄爆炸、反击段、击碎结晶）。

新事件：crit（仅暴击口径）、proc（仅期望口径）、counter / block / enemyAttack（对照靶每 4 s 攻击主控；立盾干员格挡、带反击段的反击）、crystalConsumed、targetState / targetStateEnd、ultFollowup（铁誓后续效果）、ultFollowUp（后续终结技，如破晦诀明）。新状态：targetState(id)、targetScarred / targetSlowed / targetImprisoned / targetCrystal / inArrowField / inGravityField、selfShielded、targetBurning、buffStacks(id,min)。修饰器规格 {modifier}：conductVuln（导电易伤 ×）、burnMul（燃烧跳伤 ×）、spRefundMul（技力返还 ×）。

目标状态（mechanics.<kind>.targetStates=[{id,duration,onSegment?,cond?,endSegment?,earlyEnd?}]）：命中时施加；endSegment 在到期时打出（囹圄爆炸）；earlyEnd.by=ownSkillHit 时自身战技命中提前结束并打出 segments、返还技力、刷新脆弱（诀智）。源石结晶是 id=crystal 的目标状态：物理异常 / 破防 / 终结技消耗它，施加者打出 crystal.breakSegment。

资源事件（resources[].spend[].on=physicalAbnormal | comboHit，带 segment / finaleSegment / sp / finaleSp / event）：铁誓按事件逐点消耗，最后一点打决胜段。备料：gains.on=ultimateHit（按段）、spend.on=comboHit，冷却效果走效果目录的 resourceSpend 触发。

其他：nextNormalHeavy（战技条件成立后下一次普攻直接重击）、combo.casts=2 + castWindow（两段连携，冷却从最后一次起算，段 / 消耗 / 异常按 stage 条件）、ultimate.triggered + followUp（领域内主控重击 / 处决触发段，达次数后终结技切换为后续技，不耗能量）、skill.counterSegment + blocks（立盾反击段只在受击时打出）、shield{self|team|other,duration,cooldown}、procs{name:{base,perInt,stacksEffect,perStack,mul}}、airborneSeconds / resetsAirAttacks（浮空与重置空中普攻）、effect.grants=comboState（授予连击状态）。

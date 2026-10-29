# 进度记录（跨模型 / 跨会话接续用）

> 更新时间：2026-10-28（会话 1，Claude Fable 5.1 主导；GPT-6 Astra 通过 `codex exec` 做独立研究与审核；多个独立 Claude subagent 做数据整理与审核）。
> 代码版本：git `main`（本目录），每批次有提交；`node tests/*.mjs` 为数值检查；`node test.mjs` 为交接基线（仍可运行）。

## 0. 工作方式约定
- 官方数据（wiki.skland.com，经 zonai.skland.com 接口抓取）为准；华法琳 wiki（游戏表解包）作独立交叉核对源；两源逐值核对结果与 32 处真实冲突见 docs/data-sources.md（官方笔误处采用解包值并在 dist/data/meta.js `corrections` 列出）。
- 规则（docs/rules.md）由两份独立研究（docs/research/*.md）支撑，并经 GPT 与 Claude 独立审核（docs/reviews/rules-review-*.md）。
- 效果目录（dist/data/effects.js，578 条）由 4 个独立 subagent 整理，Claude 全量审核修正 + GPT 抽样审核（docs/reviews/effects-review-*.md）。
- 未实际执行的验证不得声称完成；本文件每项只写“已做/进行中/未做/阻塞”，并给证据位置。
- 原始抓取数据在 sources/raw/（可重放：tools/scrape_*.mjs → tools/parse_*.mjs → tools/crosscheck.mjs → tools/build_data.mjs / build_effects.mjs / build_mechanics.mjs）。

## 1. 批次状态

| 批次 | 内容 | 状态 | 证据 / 备注 |
|---|---|---|---|
| 0 | 接手、基线、规则与数据结构 | 已做 | 基线通过；架构 docs/architecture.md；效果规范 docs/effect-schema.md；数据来源与交叉核对 docs/data-sources.md |
| 1 | 全武器、指定装备、通用属性计算 | 已做（待最终回归） | 84 武器（含潜能↔Rank 联动、基质加级、第三技能被动 Rank1–9）；191 件装备（全部金装 + 天灾防护紫装），逐属性精锻用解包内部值，官方显示值并列；套装件数/激活；全队不叠加（长息/拓荒）按只计一次取最高（假设，规则 D21） |
| 2 | 全干员、1–4 人编队、全部伤害与增益 | 已做（35/35 接入；明河以“官方数据未公开”占位，不可选） | 34 干员（明河官方页为预告无技能表→未接入）；编队页签、不可重复；每人独立练度/武器/装备/食药/增益；施加者/受益者区分；依赖属性（赛希智识等）按施加者实际配装 + 手工覆盖（空=自动，0 有效）；机制伤害段 |
| 3 | 技能总伤、分段增益、结算顺序 | 已做 | 总伤=分段之和（tests/damage.test.mjs）；统一设置/按段覆盖/恢复继承；按段必然触发（连携首段不吃“连携命中后”，后段自动）；别礼二天赋仅终结技 |
| 4 | 食药、10 格快照、界面收尾 | 已做 | 25 项输出相关食药；快照箱（保留/重置、满 10 替换、对比差值与配置差异、详情/导出）；图片导入入口（暂未开放）；编号框折叠、计算拆解默认折叠、其它参数直显 |
| 5 | 排轴规则与案例证据 | 已做（v0.5） | 规则 docs/rules.md v0.5（两份研究 + 两份独立审核）；案例库 docs/cases（13 案例、10 份战斗日志，数值交叉核对一致）；docs/verification-needed.md |
| 6 | 事件模拟器与可编辑时间轴 | 已做（v0.1） | dist/engine/sim/simulate.js：真实/返还技力、能量（充能效率、别礼来源限制）、附着/爆发/异常、连携触发窗口、触发式增益、终结技演出暂停；时间轴拖动编辑、不可执行提示、时刻检查、事件流水；tests/sim.*.mjs |
| 7 | 自动排轴与充能阈值 | 已做（v0.1） | dist/engine/sim/plan.js：束搜索 + 候选对照 + 理由；充能截止条件二分阈值（前提/舍入列出）；UI 已接入 |
| 8 | 逐击全队伤害、可视化、完整回归 | 已做（v0.1） | 全队总伤/占比/逐击表/区间；重点编队回归 docs/cases/regression-cold-team.md（可复现）；独立审核两份；报告 docs/final-report.md |
| 9 | 排轴一图流（主轴 + 备选，分节叙述，可载入模拟） | 已做 | dist/app/chart-ui.js、dist/data/rotations.js、dist/engine/sim/rotation.js；tests/rotations.test.mjs 生成 docs/rotations.md；顺序轴来自案例 06/07 共识，时刻由 greedySchedule 给出；模拟器修正：诀连携“2 层及以上其他法术附着”触发（原按 otherArts 字面匹配永不触发） |
| 9b | Boss/场景调轴、保底口径、可自选抗性 | 已做 | 场景（对照靶 / 短战 / 阶段转换 / 可失衡）在 rotations.js `scenarios`；保底 = 主控普攻 + 全员技能（不计副控自动普攻）；敌人防御/抗性页面可选；模拟器新增 enemy.invulnerable 窗口；greedySchedule 支持 minT。视频关键帧核对见 docs/cases/case-06（新增 verification 17–20） |
| 发布 2 | GitHub Pages 独立网址（随 9c/9d 重新发布） | 已做 | https://kiddingwarren5.github.io/endfield-tactical-lab/ （仓库 https://github.com/kiddingwarren5/endfield-tactical-lab ，gh-pages 分支 = dist/）。更新：`sh tools/deploy_pages.sh endfield-tactical-lab` |
| 9c | 页面合并为“伤害计算 / 排轴”两块；排轴 = 选阵容 → 自动排轴（任意编队）或推荐轴（重点编队）→ 一图流 + 分节叙述 → 标答对照；高级编辑折叠在最后 | 已做 | dist/app/chart-ui.js（renderRotation）；dist/engine/sim/rotation.js autoRotation（形态枚举 + 束搜索 + 局部优化 improvePlan，目标=保底每秒）；tests/rotations.test.mjs “自动排轴 vs 标答”（当前 103.9%，门槛 ≥85%） |
| 9d | 形态切换修正：诀智/意按面板自动判定（可手动），意形态连携/终结技“再次施加该法术附着”（+1 层）接入模拟器；形态专属效果按形态门控 | 已做 | dist/engine/skills.js effectiveMode；simulate.js modeOk/applyAttach('same')；预设轴改为视频核对顺序（祀战技→汤汤连携→别礼战技重击→诀连携→汤汤战技→别礼 4 层连携→祀连携→起墨/收笔，三充一爆） |
| 10 | 自动排轴算法升级：顺序表示 + 最早可行解码（simulate 的 sequence 模式）；束搜索热启动 → 模拟退火 与 MCTS（UCT）两条路线取优；模拟器修正：终结技演出全队独占、同一时刻先结算状态事件/普攻再执行计划动作 | 已做 | dist/engine/sim/plan.js（evalSequence / annealSequence / mctsSequence）、rotation.js autoRotation；预设轴也改为顺序解码（一次模拟）。标答对照：自动 123.8% vs 主轴（模型口径），见 docs/rotations.md |
| 11 | 触发系统重写并经两份独立审核修正：触发表 `dist/engine/sim/triggers.js`（196 代码：事件 / 状态 / 已处理 / 未建模）、模拟器按代码触发（战技/终结技/普攻按段命中、附着/消耗/异常/爆发/重击/定身/水龙卷/提前引爆/终结技结束/碎冰/战斗开始/增益施加/技力恢复），互斥组取最大、叠层首层起算与独立计时、演出暂停计时、终结技时长取官方参数、形态门槛按面板、资源区效果即时结算、“下一次 X”消耗、冷却与每场一次 | 已做 | 审核：docs/reviews/triggers-review-claude.md（58 条）、engine-trigger-review-claude.md（24 条），全部采纳；tests/triggers.test.mjs（覆盖）、tests/triggers-behavior.test.mjs（11 条行为算例）；覆盖表 docs/trigger-coverage.md |
| 发布 | 当前账号副本公开发布 | 已做 | https://claude.ai/artifact/MA9QgAZesaHBqEia9BdCwg（版本 7）；分享权限已在页面 Share 菜单设为“知道链接的任何人”（无需 Claude 账号即可打开）。备选：`gh auth login` 后 `sh tools/deploy_pages.sh` 发布到 GitHub Pages |

| 配置页 | 第一页规范 + 社区默认配装多方案（2026-10-29） | 已做 | docs/spec-page-1-setup.md；sources/curated/builds.json → tools/build_builds.mjs；docs/cases/case-17；验证清单 44–46 |

| 排轴 / 归因 | 目标改固定窗口 + 整理步骤；排轴页只读；伤害归因页替代计算器（2026-10-29） | 已做 | HANDOFF “排轴目标改固定窗口”一节；tests/plan-window.test.mjs |

| 排轴搜索 | 两段式：顺序退火找结构 → 显式时刻局部搜索（2026-10-30） | 已做 | docs/reviews/planner-benchmark.md（基准）、planner-ideas-gpt.md（独立评审）；tests/plan-window.test.mjs |

## 2. 需求覆盖矩阵（NEXT_STEPS.md 逐条对账）
状态：☐ 未做 / ◐ 进行中 / ☑ 已做并验证 / ✗ 阻塞

| # | 要求 | 状态 | 证据 |
|---|---|---|---|
| G1 | Claude 与 GPT 配合、独立 subagent 核对 | ☑ | docs/research/{claude,gpt}-mechanics.md；docs/reviews/* |
| G2 | 数据交叉验算 | ☑ | tools/crosscheck.mjs；docs/data-sources.md（~17,200 值） |
| G3 | rules / data-sources / progress / reviews / cases | ◐ | cases 进行中 |
| G4 | 规则 subagent 校正；计算代码 subagent 审核 | ☑ | 规则：GPT + Claude 审核并入 v0.5；代码：Claude 审核修正（32 算例）+ GPT 审核，处理状态见 §5 |
| G5 | 每次计算留痕、导出 JSON | ☑ | 计算编号/数据版本/引擎版本/输入/覆盖/逐段效果与乘区；模拟报告 JSON |
| G6 | 区分来源类别；不编造 | ☑ | 数据 origin/evidence.category；规则逐条标注 |
| G7 | 批次版本；独立手算样例 | ☑ | git；tests/*.mjs 手算样例与不变量 |
| G8 | 付费先问 | ☑ | 无付费操作 |
| H1–H10 | 继承规则 | ☑ | H4 官方仅寒冷脆弱，用户实测法术脆弱扩展单独标注；H5 食药位置可切换（默认用户实测） |
| 1.1–1.6 | 武器/装备/精锻/套装 | ☑ | 见批次 1 |
| 2.1–2.7 | 全干员/编队/增益/依赖属性/手工覆盖/全部伤害类型 | ☑（明河除外） | 见批次 2 |
| 3.1–3.5 | 总伤/分段/触发/追溯 | ☑ | 见批次 3 |
| 4.1–4.7 | 食药/快照/入口/收尾 | ☑ | 见批次 4 |
| 5.1–5.6 | 排轴规则/案例 | ◐ | 非主控衰减未知→区间输出；案例进行中 |
| 6.1–6.7 | 模拟器/时间轴/诊断/时刻检查/默认初始 | ☑（v0.1） | 事件时间结算，无 fill |
| 7.1–7.7 | 自动轴/目标/候选/截止阈值/效率合计/依赖轴/扩展接口 | ☑（v0.1） | 推荐配装未实现（按任务书留接口） |
| 8.1–8.6 | 逐击/占比/追溯/重点编队/失衡预留/报告 | ◐ | 占比与逐击已做；重点编队回归与独立代码审核待做 |

## 3. 已知缺口 / 假设（影响范围）
- 非主控自动普攻衰减与频率：无实测 → 模拟输出 δ∈[0.5,1]、φ∈[0.6,1] 区间（timing.js）。
- 普攻段时长、技能前后摇、终结技演出 3s：假设表（timing.js），待案例视频校准。
- 连携窗口 5s、附着 20s：单一来源。
- 汤汤涡流/祀墨魂/弭弗段链等复杂机制：模拟器部分建模（日志中以 note 标明未建模项）。
- 抗性评级：B 档不固定（35–60），计算请用具体敌人数值。
- 明河、唤月：官方无数据。

## 4. 下一步（下一会话）
0. 一图流主轴的视频逐帧核对（案例 06/07 仅 AI 字幕；主轴顺序与“每节 4 层”待对视频画面确认）。
1. 实机验证清单 docs/verification-needed.md 前三项（非主控衰减、演出暂停、食药位置），回填 timing.js / rules.md。
2. 模拟器未修项：条件伤害段与替换战技阶段的技能状态机；处决/失衡状态机；燃烧跳伤/碎冰流程。
3. 用 docs/cases 的日志（逐击时间）校准普攻段时长与技能前后摇。
4. 推荐配装（按充能阈值差额搜索装备）——接口已预留。

## 5. 审核问题处理状态（2026-10-28 晚）
### 计算代码（docs/reviews/engine-review-gpt.md、engine-review-claude.md）
| 问题 | 状态 |
|---|---|
| 模拟器修正按队员数重复折叠（43.2%→51.84%） | 已修（Claude 审核修正，tests/review-engine.test.mjs） |
| 全队唯一在模拟器失效 | 已修 |
| 首次叠层默认满层 | 已修 |
| 武器 Rank 两处口径不一致 | 已修（统一 weaponRanks） |
| 依赖属性遗漏施加者食药 | 已修 |
| 互斥组在解析层 | 已修 |
| 装备“对失衡目标伤害加成”遗漏 | 已修（失衡承伤>0 时计入） |
| 燃烧持续伤害可暴击 | 已修（noCrit） |
| 碎冰属性/等级系数 | 已修（物理属性 + 法术等级系数） |
| 替换战技初始阶段（梨诺 0 费） | 已修 |
| 别礼追击与主控重击脱节 | 已修（任意主控重击触发；追击伤害与附着随重击结算，15 s 过期） |
| 资源类目录效果（别礼潜 5 +5）未执行 | 已修（潜能类固定值 spRefund 接入） |
| 异常后续效果（导电/碎甲易伤、腐蚀减抗） | 已修（导电/碎甲 12–24% 易伤；腐蚀按研究值逐秒减抗至上限） |
| 连携触发事件漏发（异常/消耗） | 已修（反应触发 abnormal / attachConsumed 事件；祀按最近消耗层数） |
| DPS 分母/时长口径 | 已修（固定时长 duration；lastHit 另给） |
| 周期判定与阈值口径 | 已修（按成员首次终结技结算完；阈值 = 截止前到达过满能；二分后重放验证）tests/plan.cycle.test.mjs |
| 搜索候选可行性与模拟器一致 | 部分（战技费用按干员、窗口端点含等号；仍用 0.5 s 采样） |
| 条件伤害段无条件执行；替换战技各阶段共用伤害段 | 已修（冻结/非冻结/终结技期间按状态判定，其余条件段默认不触发并记 note；替换链各阶段按名称匹配伤害段） |
| 回能只读初始个人效率（队友条件效率） | 已修（按接收者计入队友提供的充能效率，含职业限定） |
| 终结技演出暂停只部分实现 | 已修（增益/附着/异常/冷却/连携窗口随演出顺延；仍为假设，timing.js 可关闭） |
| 处决/失衡状态机 | 已做（可选：设置 enemy.staggerThreshold 后累计失衡值→失衡窗口 ×1.3→主控处决并按敌人档回技力；默认关闭，对照靶永不失衡） |
| 燃烧跳伤、冻结打碎等异常流程 | 已做（燃烧每秒跳伤 10 s 不暴击；对冻结目标的物理伤害触发碎冰，归属打碎者） |
| 祀笔意（记录 → 固定伤害爆发）、汤汤巨浪提前引爆守卫、搜索预算 | 已做（2026-10-29：参数表 20 s / 8–13% 记录比例，收笔提前爆发；修复开局 0 s 下落白拿巨浪；默认预算 10 s/路线；案例 14–16 新来源） |
| 本体与知识图谱（词表、构图、硬/软依赖、条件性、校验器） | 已做（2026-10-29：vocab.js、engine/graph.js、tools/validate_graph.mjs、tests/graph.test.mjs；校验零错误；发现并修正两件装备词条未映射） |
| 两份图谱审核（Codex、Claude）的处置：模拟器连携条件修正、物理异常系统、图谱重写、一致性检查 | 已做（2026-10-29 晚：tests/combo-triggers.test.mjs 5 例、tests/graph.test.mjs 12 例；未完成项列在 docs/reviews/graph-review-claude.md 处置表） |

### 规则（docs/reviews/rules-review-gpt.md）→ rules v0.4 已并入；Claude 审核待并入。
### 效果目录（docs/reviews/effects-review-*.md）→ 578 条，31 修正，9 未决（见报告）。

### 覆盖补全（2026-10-30）
| 项 | 状态 |
|---|---|
| 16 个“未建模”伤害段全部按条件接通（狼卫 / 弧光 / 莱万汀 / 梨诺追加、黎风终结技追加、骏卫强化第三段、大潘六段、伊冯速冻仔、诀集束打击与破晦诀明、阿列什珍鳞、噗切娜礼盒） | 已做：tests/segment-conditions.test.mjs 13 例 |
| 67 条“未建模”效果全部落到事件 / 状态 / 修饰器 / 已处理 / scenario / noDamage | 已做：tests/effects-coverage.test.mjs 14 例；tests/triggers 断言不再有未建模 |
| 条件回能 / 返还 / 异常的重复与无条件计数（莱万汀 +100、庄方宜、提弗洛斯、伊冯冻结、阿列什冻结、艾维文娜雷枪） | 已修 |
| 搜索可复现：算子权重按评估次数而不是毫秒 | 已修 |
| 两名独立审核（引擎 15 条、数据对官方原文 49 条） | 已照改 / 记录（docs/reviews/coverage-review-2026-10-30.md），复核进行中 |
| 对照表重跑（无大招循环平铺、下落攻击 2.0 s）：案例 20 / 22 无大招循环 177% / 155%，无跳过步 | 已做；剩余差距是技力经济理想化，下一步用视频动作间隔校准 |
| 技力经济实测（案例 20 / 22 视频按 0.25 s 读技力条；案例 19 的播放器卡住未读完）：自然回复 6.4–8.4/s、总收入 8–10/s、重击回技力 2.6–3.8/s → 主控出手比例 0.5（verification-needed 78）；下落攻击只在有机制意义时可排（80）；同刻动作 0.002 s 容差（79） | 已做；对照比值 150–166%，差距转到增益覆盖对齐 |

## 2026-10-30 战斗日志逐击校准
- 新增 `tools/log_replay.mjs` 与 sources/raw/zmdlogs（9 场日志 + 敌人表）；158 击已映射。干净场祀战技 / 汤汤连携误差 ≤4%；别礼终结引擎低 27–30%、别礼连携低 10%、诀破晦阵低 9%，幻影追击引擎偏高且随场次变。详见 docs/calibration-logs.md。

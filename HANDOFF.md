# 交接说明（v4，2026-10-28）

本包是《明日方舟：终末地》伤害计算器与排轴工具的完整源码、数据与文档。接续开发请先读 docs/progress.md（批次状态、覆盖矩阵、缺口），再读 docs/rules.md 与 docs/architecture.md。

## 运行
- 本地预览：`python3 -m http.server 8765 --directory dist`，打开 http://127.0.0.1:8765/
- 数值检查：`node tests/stats.test.mjs && node tests/damage.test.mjs && node tests/resolve.test.mjs && node tests/review-engine.test.mjs`（若存在）；模拟器：`node tests/sim.four.mjs`、`node tests/plan.smoke.mjs`；回归案例生成：`node tests/case-cold-team.mjs`
- 交接基线（旧 Demo 引擎，仍保留）：`node test.mjs`
- 公开副本：claude.ai Artifact（见 docs/progress.md“发布”），入口文件 dist/artifact.html（与 dist/index.html 同内容，去掉文档骨架）

## 目录
- dist/app：界面（state / ui / calc-ui / timeline-ui / main）
- dist/engine：纯函数计算核心（stats / damage / skills / effects / resolve / sim/simulate / sim/plan）
- dist/data：生成数据（operators / weapons / gear / sets / consumables / effects / mechanics / timing / meta），**不要手改**
- sources/raw：官方（skland）与华法琳原始抓取；sources/skland、sources/warfarin：解析结果；sources/curated：人工/subagent 整理（效果目录、技能机制、官方笔误修正）
- tools：抓取、解析、交叉核对、构建脚本（可重放）
- docs：rules / data-sources / architecture / effect-schema / sim-design / progress / research / reviews / cases

## 数据重放
```
node tools/scrape_skland.mjs            # 官方接口（匿名 token + 签名，与网页客户端一致）
node tools/scrape_warfarin.mjs          # 华法琳 .data（turbo-stream）
node tools/parse_skland.mjs sources/raw/skland sources/skland
node tools/parse_warfarin.mjs sources/raw/warfarin sources/warfarin
node tools/crosscheck.mjs               # docs/data-crosscheck.json
node tools/build_data.mjs && node tools/build_effects.mjs && node tools/build_mechanics.mjs
```

## 工作约定（必须延续）
- 官方数据为准；两源交叉核对；官方笔误采用解包值并记录在 sources/curated/official-corrections.json。
- 规则与计算代码的变更需独立 subagent / GPT 审核，记录在 docs/reviews/。
- 未实际执行的验证不得声称完成；假设用 origin/evidence.category 标注。

## 实机测量回填
把游戏内测得的数值填入 sources/curated/measurements.json（每项附录屏/截图与日期），运行 `node tools/build_measurements.mjs`，再重新发布 dist/。空值不会覆盖默认假设；docs/verification-needed.md 列出每项的测试方法。明河/唤月数据公开后：`node tools/scrape_skland.mjs && node tools/parse_skland.mjs sources/raw/skland sources/skland && node tools/build_data.mjs` 即可接入（明河占位项会自动替换为正式数据）。


## 排轴一图流（2026-10-28 晚）
- 预设轴在 `dist/data/rotations.js`（只写动作顺序与目的，不写死时刻）；`dist/engine/sim/rotation.js` 用 greedySchedule 排出最早可行时刻；页面 `dist/app/chart-ui.js`（页签“排轴一图流”）。
- 改动预设后运行 `node --test tests/rotations.test.mjs`：断言每步可执行、周期完整、别礼连携吃到指定层数，并重新生成 `docs/rotations.md`。

## 公开网址（2026-10-28 晚）
- GitHub Pages：https://kiddingwarren5.github.io/endfield-tactical-lab/ （每次改 dist/ 后运行 `sh tools/deploy_pages.sh endfield-tactical-lab` 重新发布；需 `gh auth login`）
- claude.ai artifact：https://claude.ai/artifact/MA9QgAZesaHBqEia9BdCwg

## 排轴页（2026-10-28 深夜合并后）
- 入口 `dist/app/chart-ui.js` → `renderRotation`：编队槽位（与伤害计算页共用 state.team）→ 排轴来源（自动 / 命中重点编队时的预设）→ Boss 场景 + 敌人防御抗性 → 一图流 → 分节叙述 → 标答对照 → 折叠的高级编辑（原 timeline-ui）。
- 自动排轴 `autoRotation`（rotation.js）：形态枚举（诀智/意，member.mode='auto' 时）× autoPlan 束搜索（目标 guaranteed）→ improvePlan 局部优化 → 每步说明由事件日志生成（explainStep）。
- 回归：`node --test tests/rotations.test.mjs` 会跑预设 × 场景与“自动 vs 标答”，并重写 docs/rotations.md。

## 自动排轴算法（2026-10-29 凌晨）
- 表示：动作顺序（不含时刻）；解码：`simulate({sequence})` 按顺序在最早可行时刻执行（支持 waitFor / minT / optional，等待超过 seqMaxWait 跳过）。
- 搜索：`autoPlan`（束搜索，热启动）→ `annealSequence`（模拟退火：交换/移动/增删/改类型，Metropolis，温度 5%→0.2%）与 `mctsSequence`（UCT，随机 rollout，均值回传）→ 再对 MCTS 最优退火 → 三条路线取保底每秒最高。
- 评价全部由模拟器给出；不可执行的轴直接拒绝；跳过的步骤按 0.9^n 折算。
- 回归：tests/rotations.test.mjs “自动排轴 vs 标答”（门槛 ≥85%）。

## 2026-10-29 下午：祀笔意、巨浪守卫、搜索预算、视频来源
- 引擎：祀笔意（`mechanics.skill.ink`：参数表 20 s、记录比例 8–13%）在 `simulate.js` 的 `skillHit`（河山共影命中开始记录）/ `doHit`（按比例记录）/ `inkBurst`（笔意结束或收笔时以固定伤害爆发，段 id `ink`，元素 `fixed`）结算；笔意结束后战技链回到河山共影；定身只来自链式战技第一段。
- 修复：开局 0 s 主控下落攻击曾在汤汤没放终结技时“提前引爆巨浪”白拿一段终结技伤害（`castPlunge` 现在要求古老图形确实在场）；连携的“消耗 N 层”标签只认本人（consume 事件带 `by`）。
- 搜索预算：`autoRotation` 默认 10 s/路线（4.5 s 时四人队的别礼终结技常被排到第二个，未收敛；10 s 与 20 s 结构一致）。四人队含诀两形态约 100 s。
- 来源：docs/cases/case-14（GameKee 别礼文字轴）、case-15（吃我无痕 别汤赛诀：别礼终结技两种放法、充能阈值）、case-16（GameKee 祀、毛巾欧尼酱、TapTap）。浏览器插件断开，未能逐帧看视频；B 站只拿到简介与评论文字。
- 待办（docs/verification-needed.md 29–31）：固定伤害是否吃增益；周期定义改为玩家式稳态循环（诀每个别礼周期两次终结技）；两种别礼终结技放法在模型里只差 2–5%，需实测裁定。

## 2026-10-29 晚：配置页、本体与知识图谱
- 三页结构：配置（setup-ui.js，所有输入）→ 排轴（chart-ui.js，只读结果）→ 伤害计算（calc-ui.js，待改成伤害归因）。内置默认配装在 data/builds.js（目前四人），state.js 的 applyDefaultBuild / buildStatus。
- 本体：docs/ontology.md；词表 data/vocab.js；图 engine/graph.js（buildGraph / validateGraph / comboRequirements / teamDependencies / itemSensitivity / teamUniqueConflicts / effectEnablers）；校验 `node tools/validate_graph.mjs` 写 docs/graph-report.md；tests/graph.test.mjs 要求零错误。
- 原则：硬依赖（连携发动条件）由模拟器强制；软条件（效果触发）只作搜索先验，绝不当约束。图不算伤害。
- 修正：解包里没有的装备（拓荒护甲·叄型、集成实训突袭刺刀）词条属性按官方名称映射（build_data.mjs ATTR_NAME_STAT）。
- 待裁定：docs/verification-needed.md 32–33。

## 2026-10-29 深夜：两份图谱审核的处置
- 模拟器：连携发动条件重写（trMet：元素集合、破防层数、异常种类、结构化目标前提 targetRequires）；物理异常系统（applyPhysicalAnomaly / applyMechAbnormals，异常改为命中时统一施加）；终结技声明的附着现在真的会施加；'trigger' 再次施加按连携条件元素；处决事件进连携条件；新增 resIgnore 区（无视抗性）、ability/def（防御力）、extraHit（追加固定伤害）。
- 图谱：形态 / 阶段变体、派生反应（带守卫）、硬 / 软分离、结构化前提、grants 边、场景节点；tools/check_graph_sim.mjs 检查图与模拟器一致性（docs/graph-sim-consistency.md）。
- 处置表：docs/reviews/graph-review-claude.md；Codex 报告 docs/reviews/graph-review-gpt.md。待做：通用资源状态机（提弗洛斯、赛希、莱万汀先做）。
- 资源状态机（mechanics.resources，docs/ontology.md §7）：熔火、启示 / 猎矢、支援晶体已接入；显式段计划（mechanics.<kind>.segmentPlan）优先于按标签猜条件段，提弗洛斯三技能已写计划。tests/resources.test.mjs。

## 2026-10-29 深夜：去特判整理
- 金标准回归 tools/golden.mjs（tests/golden.json，43 组：三条预设轴、每个干员单人固定时间线、六个小队）；tests/golden.test.mjs 要求一致；有意改动必须重写快照并在提交说明里写原因。
- 引擎不再按技能文本做正则判断：触发只认触发代码（删除文本猜测后备）；形态门槛用 effect.condition.form；返还 / 恢复用 effect.spKind 与 mechanics spRefund.kind（recover / refund）；附着绑定用 attach.bind（hit / controlHeavy / slot1Element）；阶段链按 stage.segment 选段；处决 / 下落按 normal.segmentIds；条件伤害段只认 mechanics.<kind>.segmentPlan（校验器要求每个干员三技能都有计划，times 0 + when.unmodeled 表示未建模）；终结技后减冷却走即时区并按受益者 / 01 号位结算。
- 迁移脚本 tools/migrate_textfields.mjs（幂等）把以上字段写进 curated 数据。
- 随之修正的三处行为：祀终结技减冷却只给 01 号位；大潘“备料”减冷却不再被“终结技…后”的文本误判成终结技后触发；噗切娜“我没有睡着！”立盾不打伤害、头槌只在替换段。

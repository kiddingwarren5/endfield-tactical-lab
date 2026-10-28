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

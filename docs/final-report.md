# 交付报告（2026-10-28，会话 1）

## 1. 成品
- 副本（claude.ai Artifact 版本 4；默认私有，需在页面 Share 菜单设为公开）：https://claude.ai/artifact/MA9QgAZesaHBqEia9BdCwg
- 源码与数据：本目录（git `main`）。运行与重放见 HANDOFF.md。
- 功能：34 干员（明河无官方数据）、84 武器、191 件装备（全部金装 + 天灾防护紫装）、25 项输出相关食药；1–4 人编队；单段/技能总伤；统一与分段增益；施加者/受益者与依赖属性手工覆盖；10 格快照；计算留痕导出；事件模拟器与可编辑时间轴；自动排轴（束搜索）与充能阈值；全队逐击与占比。

## 2. 数据与规则可信度
- 官方（skland）与解包（warfarin）两源逐值核对约 17,200 项；32 处真实冲突（31 处官方笔误）已按解包值修正并记录（docs/data-sources.md、dist/data/meta.js corrections）。
- 效果目录 578 条：全量 Claude 审核修正 + GPT 抽样审核（docs/reviews/effects-review-*.md）；35 条标注 uncertain。
- 规则 docs/rules.md v0.5：两份独立研究 + GPT 与 Claude 两份独立审核（65 条逐条判断）并入。
- 计算代码：Claude 审核（含独立算例测试 tests/review-engine.test.mjs）与 GPT 审核（docs/reviews/engine-review-*.md）；修复状态见 docs/progress.md。
- 案例库 docs/cases：13 个案例（10 份战斗日志、8 个视频、1 篇文字轴），日志数值与数据表交叉核对一致（祀 43.2%、玉中身 21%/12%、诀 18%/11.7%/19.8% 等）。

## 3. 备选方案（排轴）
- 别礼连携“3 层立即放”vs“等 4 层”：同条件模拟（docs/cases/regression-cold-team.md）等 4 层总伤更高，但多耗一次施加附着的战技；是否值得取决于技力预算与周期。
- 01 号位：榜一日志把诀放 01（祀终结技刷新诀连携冷却），月咒视频把祀放 1 号位；工具可同一条轴换位比较。
- 自动排轴输出最佳轴 + 对照候选（差异与 DPS），不声称全局最优；周期口径与误差区间随结果输出。

## 4. 需实机验证
见 docs/verification-needed.md（16 项，含测试方法）。最重要的三项：非主控自动普攻衰减/频率、终结技演出是否暂停计时、食药固定攻击位置。

## 5. 明确未完成 / 限制
- 明河、唤月无官方数据；自动推荐配装未实现（接口预留：chargeThreshold 返回差额）。
- 模拟器 v0.1 限制见 docs/sim-design.md §5；排轴结果为“模型在假设下的结论”，不是实战验证。
- 抗性评级为预设，B 档实际 35–60，请用自定义数值。

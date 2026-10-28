# 独立审核记录索引

| 文件 | 审核者 | 对象 | 性质 | 结果摘要 |
|---|---|---|---|---|
| effects-review-claude.md | Claude subagent（独立上下文） | 效果目录 569→578 条（全量） | 审核并修正 | 40 个问题：31 修正、9 未决；补 6 条漏录；GPT 报告逐条处理 |
| effects-review-gpt.md | GPT-6 Astra（codex，只读） | 效果目录抽样 182 条 | 审核 | 数值抄录通过；语义/结构问题 12 项、漏录 5 项（已由 Claude 修正） |
| rules-review-gpt.md | GPT-6 Astra（codex，只读，联网） | docs/rules.md v0.3 | 审核 | 有误 11 条、证据不足 10 条；主要修正已并入 rules v0.4 |
| rules-review-claude.md | Claude subagent（独立检索） | docs/rules.md v0.3 | 审核 | 见文件 |
| engine-review-gpt.md | GPT-6 Astra（codex，只读） | dist/engine/* | 审核 | 3 个独立手算例通过；模拟器/规划器 14 项高影响问题（修复状态见 docs/progress.md） |
| engine-review-claude.md | Claude subagent | dist/engine/* | 审核并修正（含 tests/review-engine.test.mjs） | 见文件 |
| ../data-sources.md | Claude subagent（数据审计） | 官方 vs 解包 ~17,200 值 | 审核并修正解析器 | 32 处真实冲突，取整规律 |

审核约定：审核者不读实现者的自述作为依据；审核报告必须包含审核版本（git hash）、独立算例与复现方法；修正后的复核由修正者在报告中补记，再由后续会话抽查。

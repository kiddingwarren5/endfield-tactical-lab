# 解包时序 + 吸收模型两轮独立审核的处置（2026-10-30）

两位审核子代理用中立提问（"沿调用链找没接通、没约定、没测试锁定的行为"）审 `dist/engine/sim/simulate.js`、`tools/build_timing_akedata.mjs`、`sources/curated/skill-mechanics.json`。逐条处置如下，未处理的写明原因。

## 第一轮
| 项 | 处置 |
|---|---|
| H1 AllowNext 把分支动作（反击、站桩）当成可接动作 | 只认主动作正则；噗切娜战技按 exclusiveFrame（测试锁定） |
| H2 下落攻击在解包口径下当普攻连刷 | 固定 2.0 s（测试） |
| M1 没有命中帧的技能按施放时长比例取命中 | 退回默认表并记 note（艾尔黛拉终结技 2.4 s，verification-needed 82） |
| M2 无演出动作的终结技也暂停计时 | 解包无 UltimateTimeAction 的不暂停（大潘，测试） |
| M4 终结技强化普攻段数 | 与技能表不一致退回武器表并记 note（伊冯），一致用 ult_attack 帧（莱万汀） |
| M5 普攻链按编号扫描漏段 | 沿 AllowNext 走（黎风 1→2→3→5，测试） |

## 第二轮
| 项 | 处置 |
|---|---|
| 高1 空占位命中事件也触发"命中后消耗附着" | 只在有伤害段的事件上消耗，且每次施放一次（`S.consumedAfterAt`）；金标准重生成 |
| 高2 庄方宜终结技普攻段 | 提交 682aee9 |
| 中1 吸收窗口无来源标注；祀潜能 2 在命中时才触发 | mechanics 里标"仅日志反推（verification-needed 87）"；潜能 2 改为施放时按当时层数触发（`comboCastLayers`，测试）。金标准里三条寒冷预设祀伤害 +15%（预设祀潜能 3）来自这一条 |
| 中2 吸收的副作用没裁定 | 裁定写进 verification-needed 87：不设上限、不反应 / 不爆发、不触发"被施加附着"效果、只点亮含吸收的连携（卡缪，测试） |
| 中3 接续窗口不分下一动作种类 | 生成器输出 `allow:{attack,skill,combo}`，模拟器按种类取（骏卫，测试）。未列出的种类沿用最早可接主动作帧，见 verification-needed 89 |
| 中低4 强化普攻链按编号猜 | 沿 AllowNext 走（伊冯 1_1→2_1→2_2→3_1→3_2，测试） |
| 中低5 JSON 缩进被改 | 恢复 indent 1 |
| 低 吸收事件没有中文标签 | 应用里没有事件标签表（chart-ui 只画 consume / stagger / normalHit 等固定几类），不适用 |
| 低 后续终结技（ultimate2）的演出不暂停计时 | 未实现，docs/datamine/timing.md 表头已注明 |

## 这轮自己发现的
- 调度器死循环：`nextT` 只看 `busyUntil`，普攻被 `allowAt.attack` 挡住时时间不推进（骏卫战技 1.5 对 1.6）。已修并由骏卫测试覆盖。
- 未列出种类退回 exclusiveFrame 是错的：日志 3fd54f 别礼战技→战技 2.73 s，exclusiveFrame 12.43 s 是灌注状态时长（verification-needed 89）。

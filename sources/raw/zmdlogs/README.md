# zmdlogs 战斗日志原始数据

- `zmd_all.json`：9 场战斗（docs/cases 案例 01–05、10、11 及同账号系列），2026-10-28 从 https://zmdlogs.com/battle/<id> 页面的 Next.js RSC 数据中提取 `battle`（含 roster 配装、词条、潜能、武器精炼、技能等级）与 `timelineEvents`（逐击伤害、暴击标记、增益乘区/数值/起止）。
- `eny_*.data`：对应 Boss 的解包属性表（抗性、防御），来自 warfarin 数据站的 turbo-stream 页面，用 `tools/wf.mjs` 解码。白刃穿水的 `eny_0105_wgslime2_race001` 没拿到属性表，复现时按防御 100、抗性 0 处理。
- 用途：`node tools/log_replay.mjs` 把每一击按引擎公式重算，和日志对照（见 docs/calibration-logs.md）。日志不含技力、能量、普攻与非“重要”事件。

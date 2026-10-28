# skill-mechanics 录入报告

输出 `skill-mechanics.json`：34 位干员。未知项共 **68** 个（origin:"unknown" 34 个 + 终结技 pausesTimers:"unknown" 34 个）。
数值由脚本从 `dist/data/operators.js` params 直接读取（不手抄）；只有原文才有的数值写 `origin:"official"`，研究值写 `origin:"research"` 并附 note。

## 约定（相对任务示例的补充）
- `attach` / `consumes` / `abnormal` 一律为数组或 null（一个技能常有多个条件分支）。
- 元素：heat/cold/electric/nature；`breach`=破防层；`originiumCrystal`=管理员源石结晶；`trigger`=沿用触发连携的那种附着/异常；`anyArts`/`otherArts` 见字面。
- 异常 type：burn/conduct/freeze/corrosion/artsBurst（法术）与 knockup/knockdown/crush/armorBreak（物理，与 engine/skills.js id 一致）；`forced` 对应原文“强制”。
- 资源取值形如 `{value|byRank|byLayers|formula, origin, kind, condition}`；`kind` 区分“返还”（返还技力，消耗时不产能量，C12）与“恢复”。params 原值且无条件时直接写数字或 `{byRank}`。
- 战技 `energyGain.team` 统一为研究通则 `6.5*realSpConsumed/100`（C13）；`self` 只写原文/params 给出的额外自身能量。连携 `energyGain.self` 取 params。
- `trigger.or`：并列的其他触发条件；`targetCondition`/`requires`：附加前提；`custom.event` 取 controlledHit/enemyCharging/stagger/abnormalConsumed/crystalConsumed。
- `normal.segmentIds` 给出重击/下落/处决对应的 segment id（祀的下落/处决顺序与他人相反）；`executeSp` 为研究的按敌人档次恢复值；重击技力只在主控时获得（研究 C17）。
- `buffs` 列出 effects-operators-A/B 中 owner.source=skill 的同技能条目 id。
- `switchesControl`：原文写“切换为主控”才为 true，未写记 false。`pausesTimers` 除莱万汀外均为 "unknown"。

| 干员 | 连携触发类型 | 未知项 | 备注 |
|---|---|---|---|
| 狼卫 | anyAttachApplied | pausesTimers×1 | 战技遇燃烧/导电改为消耗该异常（不再附着） |
| 别礼 | attachLayers | pausesTimers×1 | 战技返还30；连携能量 40+15×层；战技 team 回能按通则推断（与示例 team:null 不同） |
| 佩丽卡 | heavyHit | pausesTimers×1 | 连携强制导电 5s |
| 莱万汀 | abnormal | normal.heavySpRefund | 熔火4层→强制燃烧+自身100能量；终结技切主控；唯一 pausesTimers 有官方依据（仅自身强化状态） |
| 洛茜 | custom | normal.heavySpRefund；pausesTimers×1 | 连携两次施放各10能量；第二次消耗全部法术附着+击飞，精准衔接+1破防 |
| 艾尔黛拉 | heavyHit | normal.heavySpRefund；pausesTimers×1 | 战技消耗腐蚀；连携强制腐蚀 7s |
| 陈千语 | attachLayers | normal.heavySpRefund；pausesTimers×1 | “进入破防”按 breach≥1 层表示 |
| 大潘 | attachLayers | normal.heavySpRefund；pausesTimers×1 | 终结技强制击飞+强制倒地 |
| 余烬 | custom | normal.heavySpRefund；pausesTimers×1 |  |
| 弧光 | abnormal / custom | normal.heavySpRefund；pausesTimers×1 | 战技/连携技力为“恢复”；连携 or 导电被消耗 |
| 阿列什 | custom / custom | normal.heavySpRefund；pausesTimers×1 | 战技按消耗寒冷层数恢复技力（byLayers）；连携珍鳞额外恢复；终结技恢复+击杀额外 |
| 艾维文娜 | heavyHit | normal.heavySpRefund；pausesTimers×1 | 强雷枪召回时施加电磁附着 |
| 管理员 (男) | allyCombo | pausesTimers×1 | 源石结晶记为 attach element originiumCrystal（非法术附着） |
| 昼雪 | custom | normal.heavySpRefund；pausesTimers×1 | 战技返还30；终结技强制冻结的延迟时长未知（仅文本） |
| 安塔尔 | anyAttachApplied / abnormal | normal.heavySpRefund；combo.energyGain；pausesTimers×1 | 连携 params 无能量行；再次施加触发的附着/物理异常（element/type=trigger） |
| 萤石 | attachLayers | combo.energyGain；pausesTimers×1 | 连携 params 无能量行；附着为触发元素（寒冷或自然） |
| 埃特拉 | abnormal | normal.heavySpRefund；pausesTimers×1 | 连携/终结技强制击飞 |
| 卡契尔 | custom / custom | normal.heavySpRefund；combo.energyGain；pausesTimers×1 | 战技返还30，反击施加1层破防；连携 params 无能量行 |
| 秋栗 | custom | normal.heavySpRefund；pausesTimers×1 | 终结技“恢复技力”是否每发未确认（3发）；研究称连携每段5能量，取 params 10 |
| 黎风 | heavyHit | pausesTimers×1 | 终结技消耗自身连击 |
| 骏卫 | attachConsumed | normal.heavySpRefund；pausesTimers×1 | 战技/连携/终结技技力均为“恢复”，按破防层数/段数/铁誓 |
| 赛希 | skillState | normal.heavySpRefund；pausesTimers×1 | 连携触发 skillState（支援晶体2次回复耗尽） |
| 管理员 (女) | allyCombo | pausesTimers×1 | 同管理员（男） |
| 伊冯 | heavyHit | normal.heavySpRefund；pausesTimers×1 | 战技能量 10+30×层；终结技切主控并消耗冻结 |
| 洁尔佩塔 | abnormal | normal.heavySpRefund；pausesTimers×1 |  |
| 汤汤 | attachApplied / burst | normal.heavySpRefund；pausesTimers×1 | 战技每处涡流返还20（最多2处） |
| 庄方宜 | heavyHit / execute | normal.heavySpRefund；pausesTimers×1 | 战技每次雷击+6能量；终结技首次战技0技力；原文未写切主控 |
| 卡缪 | attachConsumed | normal.heavySpRefund；pausesTimers×1 | 终结技把下一次战技替换为追猎（0技力、视为连携），追猎回能未知 |
| 弭弗 | attachLayers | normal.heavySpRefund；skill.replaces.window；pausesTimers×1 | 断云100返50→追形50（猛击≥3破防）→开天50；连携/终结技也切到追形；替换窗口未知 |
| 诀 | 智:attachApplied / attachLayers；意:anyAttachApplied | normal.heavySpRefund；pausesTimers×2 | pausesTimers 智/意各计1；modes 智/意，顶层=智。智：战技命中囹圄返还28/30；意：连携冷却更长、再次施加附着 |
| 梨诺 | abnormal / custom | normal.heavySpRefund；pausesTimers×1 | 战技25技力，替换为姿态中止(0)；连携需演唱姿态，高歌是否算在内未知 |
| 提弗洛斯 | skillState | normal.heavySpRefund；pausesTimers×1 | 空中普攻每次消耗1层自然附着+12能量；强化射击强制自然爆发 |
| 噗切娜 | custom | normal.heavySpRefund；skill.replaces.chain.0.spCost；skill.replaces.window；pausesTimers×1 | 战技返还20+格挡再20；替换段头槌技力与窗口未知 |
| 祀 | attachConsumed | normal.heavySpRefund；skill.replaces.window；pausesTimers×1 | 100→起墨15→收笔0；01号位灼热时改灼热附着；替换窗口未知 |

## 研究来源的重击技力
别礼 30、管理员（男/女）20、狼卫 18、黎风 21、佩丽卡 15（rules C11）；萤石 15（claude-mechanics Q11，WG 单一来源）。其余 27 位为 null + unknown（研究范围 15–30）。

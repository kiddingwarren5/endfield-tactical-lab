# 效果目录（Effect Catalog）编写规范

每条效果是一个 JSON 对象，放入对应文件的数组中。只录入**与伤害/属性/资源/输出节奏有关**的效果；纯治疗/护盾/移动速度/后勤效果不录（但可在 `notes` 提一句“未录入：治疗”）。

```json
{
  "id": "wpn_claym_0013.p1",                 // 稳定 id：<实体id>.<短名>；同一实体多条用 p1/p2 或语义名
  "owner": {"kind": "weapon", "id": "wpn_claym_0013", "name": "赫拉芬格"},
  "name": "赫拉芬格 · 战技施加寒冷附着后",     // 界面显示名（中文，带来源前缀）
  "literal": "寒冷伤害+{v}%",                // 原文的效果类型短语，保留原措辞（用于日后重新归区）
  "zone": "bonus",                           // 见下表
  "stat": null,                              // zone 为 stat 类时填 str/agi/int/will/main/all/atkPct/atkFlat/critRate/critDmg/chargeEff/artsStrength/hpPct
  "value": {"byRank": [10,12,14,16,18,20,22,24,28]},   // 或 {"fixed": 16} / {"perStack": 8, "maxStacks": 4} / {"formula": "8+3*layers", "vars": ["layers"]} / {"dependsOn": {"attr": "int", "of": "owner", "base": 24, "per": 0.03, "cap": 36}}
  "unit": "%",                               // "%" 或 "flat"
  "beneficiary": "self",                     // self | team | others(队友不含自己) | mainControl | target(作用于敌人的减益)
  "applies": {"elements": ["cold"], "kinds": ["normal","skill","combo","ultimate","mech"], "damageClass": "any"},
  "condition": {"text": "装备者通过战技施加寒冷附着时", "trigger": "afterSkillAttach", "mode": "user"},
  "duration": 15, "stacking": "none",        // none(无法叠加/刷新) | stack | highest | independent(每层单独计时)
  "exclusiveGroup": null, "teamUnique": false, "oncePerBattle": false, "cooldown": null,
  "evidence": {"text": "装备者通过战技施加寒冷附着时，获得寒冷伤害+10.0%，持续15秒。", "category": "official", "where": "weapons.json skills[2].rankTexts"},
  "notes": "两种效果独立生效"
}
```

## zone 取值与判定规则（按原文措辞）
| zone | 原文典型措辞 | 说明 |
|---|---|---|
| `bonus` | “X伤害+N%”“所有技能伤害+N%”“战技/连携技/终结技/普通攻击伤害+N%”“造成的伤害+N%”“物理/法术伤害+N%”“对失衡/破防目标伤害+N%” | 增伤区，同区加算。`literal` 保留原措辞以便区分子类 |
| `amp` | 明确写“增幅”（寒冷增幅/法术增幅/灼热增幅…） | 增幅区 |
| `fragile` | 明确写“脆弱”（寒冷脆弱/法术脆弱/物理脆弱…，施加在敌人身上） | 脆弱区，beneficiary=target |
| `vulnerable` | “使目标受到的伤害+N%”“受到的X伤害+N%”（未写脆弱/增幅） | 易伤区，beneficiary=target |
| `atkPct` / `atkFlat` | “攻击力+N%” / “攻击力+N” | stat 类，进面板攻击 |
| `ability` | “力量+20”“全能力+22.4%”“主能力值+132” | stat=str/agi/int/will/main/all；unit=% 或 flat |
| `critRate` / `critDmg` | “暴击率+N%”“暴击伤害+N%” | |
| `chargeEff` | “终结技充能效率+N%” | |
| `artsStrength` | “源石技艺强度+N” | |
| `ratioMul` | “伤害倍率提升至原本的1.15倍”“伤害提升至原本的1.2倍” | value.fixed=1.15；applies.skills 写明哪个技能/段 |
| `ratioAdd` | “伤害倍率+N%”（直接加倍率） | |
| `spRefund` / `spRegen` | “返还N点技力”“恢复技力” | 资源 |
| `energyCost` | “所需终结技能量-15%” | value 为负百分比 |
| `energyGain` | “获得终结技能量+N” | |
| `cdr` | “冷却时间-2秒”“冷却缩减+15%” | |
| `poise` | 失衡值相关 | 只记录，不进伤害 |
| `resIgnore` | “无视敌人 N 点 X 抗性” | 无视抗性区：按 applies.elements 从目标抗性里扣 N 点，进抗性因子 |
| `extraHit` | “额外造成一次 [公式] 伤害” | 触发时追加一次固定伤害，value 用 formula（vars 可用 def 等面板量） |
| `ability` 的 `stat: def` | “防御力+N” | 防御力进面板（装备 def 之和 + 效果），供 extraHit 公式使用 |
| `other` | 无法归类 | notes 写明 |

## 其他规则
- `value.byRank`：武器第三技能 9 个 Rank 各一个值（从 rankTexts 逐 Rank 提取，不要用公式推算）。
- 干员天赋按最高阶（满天赋）录入，但 `stages` 字段可附各阶数值：`"stages": [{"stage":"·一","value":2},{"stage":"·二","value":4}]`。
- 潜能逐条录入，`owner.potential: 2` 标明潜能等级；界面按潜能等级启用。
- 一段原文含多个效果 → 拆成多条，id 加后缀。
- 条件 `mode`：`auto`（配装即生效，如“所有技能伤害+56%”）、`user`（需用户勾选的命中条件）、`segment`（计算中按段顺序必然触发，如“连携技命中寒冷附着的敌人后”对该技能后续段生效）。
- `teamUnique: true` 仅当原文写明“其他队友”“全队”且语义为同名不叠加（如长息）。
- 依赖施加者属性的（赛希终结技智识）用 `dependsOn`，并写明 `of: "owner"`。
- 不确定的归区，写入 `uncertain: true` 并在 notes 说明两种可能；不要猜数值。

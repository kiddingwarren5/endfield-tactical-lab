# 架构与数据模型（批次 0 设计）

目标：无构建的 ES Module 静态站，保留可验证的纯函数计算核心；数据、界面状态、计算核心三者边界清晰；每次计算可追溯并可导出 JSON。

## 1. 目录

```
dist/
  index.html            顶部页签：伤害计算 / 排轴模拟 / 排轴联算
  style.css             白底、金色等高线、顶部页签（沿用）
  app/                  界面层（只读 state，调用 engine，渲染 DOM）
    main.js             启动、页签路由、全局 state
    calc-ui.js          伤害计算工作区（批次 1–4）
    timeline-ui.js      排轴工作区（批次 6–8）
    snapshots.js        10 格快照暂存箱
    ui.js               通用组件：带图标下拉、折叠面板、数字格式
  engine/               纯函数，可在 node 中直接测试
    stats.js            由配装求面板：攻击力、四能力、暴击、充能效率、各类加成属性
    effects.js          效果目录解析：条件判断、受益者过滤、叠层/互斥/覆盖、队伍去重
    damage.js           单段伤害：乘区、取整、追溯记录
    skills.js           技能分段/总伤、段间触发、分段增益继承与覆盖
    trace.js            计算编号、版本戳、JSON 导出
    sim/                事件模拟器（批次 6）、自动排轴（批次 7）、全队汇总（批次 8）
  data/                 由 tools/build_data.mjs 从 sources/ 生成，禁止手改
    operators.js weapons.js gear.js sets.js consumables.js enemies.js effects.js meta.js
  assets/icons/         官方缩略图（128px PNG）
sources/                原始抓取与解析结果（见 docs/data-sources.md）
tools/                  抓取、解析、交叉核对、构建脚本
tests/                  node 测试：手算样例、边界、数据不变量
docs/                   rules / data-sources / progress / reviews / cases / architecture
```

## 2. 数据模型

所有实体都带 `source`：`{official:{itemId,url,fetchedAt}, mined:{id,version}}`，数值字段带 `origin` 标记：`official`（官方显示值）/ `mined`（解包内部值）/ `user`（用户实测）/ `derived`（程序推导）/ `assumed`（暂定假设）。

### 2.1 干员 Operator
```
{ id:'chr_0026_lastrite', itemId:'4', name:'别礼', rarity:6,
  profession:'assault', element:'cold', weaponType:'greatsword', mainAttr:'str', subAttr:'will',
  base90:{hp,atk,str,agi,int,will},      // 90 级，官方=floor(解包)，存解包精确值
  talentStats:{str:60},                   // 能力值天赋（锤炼等）四段合计，默认满
  skills:{normal:Skill, skill:Skill, combo:Skill, ultimate:Skill}, modes?:[...]  // 诀：阵诀·智/意 两套
  talents:[Talent], potentials:[Potential], effects:[effectId...] }
Skill { name, type, description, cost:{sp}|{energy}, cooldown, refund:{sp}, gain:{energy},
  segments:[{ id, label, element, kind:'normal'|'skill'|'combo'|'ultimate', ratio:[12 ranks], hits, extra:{perLayer:[12],...} }],
  totals:[{id,label,segmentIds}] }
```
技能表的每一行映射为 segment 或参数（冷却、技力、能量）；映射规则表见 tools/build_data.mjs 的 `rowMap`，未识别的行保留在 `rawRows` 并在界面显示为“未接入参数”。

### 2.2 武器 Weapon
```
{ id, itemId, name, type, rarity, baseAtk90, skills:[
   {slot:1, name:'力量提升·大', kind:'attr', stat:'str', values:[9 ranks]},
   {slot:2, name:'攻击提升·大', kind:'attr', stat:'atkPct', values:[...]},
   {slot:3, name:'迸发·切骨之寒', kind:'passive', effects:[effectId...], rankValues:{key:[9 ranks]}} ],
  potential:{rankOfSlot3:p=>4+p} }
```
0 潜=第三技能 Rank4，满潜 Rank9，双向联动（继承规则）。基质：在武器配置中选择，影响最终等级（接入方式见 rules.md D22；无证据前不默认启用）。

### 2.3 装备 Gear / 套装 GearSet
```
Gear { id, itemId, name, slot:'armor'|'gloves'|'kit', set:'suit_burst01', quality:'gold'|'purple', def,
  attrs:[{stat:'str', values:[base,r1,r2,r3], origin:'mined', display:[官方四值]}], // 2 或 3 条
}
GearSet { id, name, pieces:3, effects:[effectId...], teamUnique?:true }
```
槽位：甲 / 手 / 配件一 / 配件二；配件可否重复：按 rules.md D23 的证据处理（默认不允许同一件重复，待证）。

### 2.4 食药 Consumable
`{ id, name, quality, duration:300, effects:[effectId...] }`；固定加攻走 `atkFlatAfter` 乘区（主副能力乘算后再加，用户实测）。

### 2.5 效果 Effect（统一目录，批次 2/3 的核心）
```
{ id:'khravengger.afterSkill', name:'赫拉芬格 · 战技施加寒冷后',
  source:{kind:'weapon'|'operator'|'talent'|'potential'|'gearSet'|'consumable', ownerRef:'self'},
  beneficiary:'self'|'team'|'others'|'mainControl'|'target',   // 受益者 / 作用对象
  zone:'bonus'|'amp'|'fragile'|'vulnerable'|'atkPct'|'atkFlat'|'atkFlatAfter'|'ability'|'crit'|'critDmg'|'chargeEff'|'spRefund'|'ratioMul'|'skillDmg'|'artsStrength'|'cdr',
  value: number | {byRank:[...]} | {perStack:number,maxStacks:n} | {formula:'8+3*layers'} | {dependsOn:{attr:'int',of:'owner',per:0.0003,base:0.24,cap:0.36}},
  applies:{elements:['cold'], kinds:['skill','combo','ultimate'], damageClass:'arts'|'physical'|'any'},
  condition:{text:'…', mode:'auto'|'user'|'segment', trigger:'afterSkillAttach'|'comboHitAttached'|…},
  duration:15, stacking:'none'|'stack'|'refresh'|'highest', exclusiveGroup?, teamUnique?:true,
  evidence:{official:'…原文…', mined:{skillId,bbKey}, category:'official'|'research'|'user'|'assumed'} }
```
- 施加者/受益者分离：依赖属性的效果（赛希终结技看赛希智识）按施加者实际配装计算；同时提供手工覆盖输入（空=自动，0 有效）。
- 全队唯一（长息）：`teamUnique` 时同队多件只计一次，取最高值（证据见 rules.md）。
- 互斥：`exclusiveGroup` 内取用户选中的一个（如诀寒冷脆弱 vs 诀终结技寒冷脆弱）。
- 段间触发：`condition.mode:'segment'` 的效果由 skills.js 按段顺序自动置入（如别礼连携第一段不吃“连携命中寒冷后”，第二段必吃）。

### 2.6 敌人 Enemy
`{ defence:100, resistances:{physical:'D',...}, custom:{}, stagger:false, grade map 来自 rules.md }`。失衡仅预留结构（批次 8.5）。

## 3. 计算核心接口

```
getStats(loadout, teamContext) → {atk, panelAtk, str, agi, int, will, crit, critDmg, chargeEff, bonus:{...}, trace}
resolveEffects(ctx) → [{effect, value, zone, reason}]      // ctx: 施加者/受益者/段/用户选择/自动触发
calcSegment(ctx) → {damage, factors, buckets, rounding, trace}
calcSkill(skillCtx) → {segments:[...], total, trace}          // 总伤=分段之和
```
乘区（现版本，待 rules.md 校正后更新）：
`攻击 × 倍率 × 暴击 × (1+Σ增伤) × (1+Σ增幅) × (1+Σ脆弱) × (1+Σ易伤) × 连击 × 失衡 × 防御 × 抗性 × 减免 × 等级系数 × 技艺`。

追溯记录（trace）：`{calcId, dataVersion, engineVersion, inputs, overrides, perSegment:[{state, effectsApplied, factors, resources, rounding, result}], result}`，可导出 JSON；快照保存该记录的副本。

## 4. 界面状态

```
state = { team:[Member×1..4], activeMember, enemy, critMode, damageSelection:{memberIdx, segmentId|totalId},
          buffSettings:{unified:{...}, perSegment:{[segId]:{...}|inherit}}, overrides:{[effectId]:{attr:value}},
          consumables:[...], snapshots:[≤10], uiFolds:{} }
Member = { operatorId, potential, skillRanks:{normal,skill,combo,ultimate}, weapon:{id,potential,ranks:[r1,r2,r3],substrate?},
           gear:{armor:{id,refine:[...]}, gloves:{...}, kit1:{...}, kit2:{...}}, buffs:{[effectId]:bool}, mode? }
```
切换干员保存各自状态；队伍共享条件（敌人、食药、队友施加的效果）与各人独立选择不互相覆盖。

## 5. 第二阶段（排轴）接口预留

```
simulate(team, timeline, options) → {events:[...], resources:{sp, poisonSp, energy[]}, damageLog:[...], errors:[...]}
autoPlan(team, options) → {timeline, candidates:[...], rationale}
chargeThreshold(team, timeline, deadlines) → {perDeadline:{required, current, gap, premises, bounds}}
```
事件类型：normalHit / heavyHit / skillCast / comboCast / ultCast / switchControl / buffStart / buffEnd / resourceChange / attachChange。

## 6. 验证策略

- tests/：手算样例（别礼回归样例保留）、边界（0 潜、2 条属性装备、精锻 0/3、抗性自定义 ±）、数据不变量（总伤=分段和；占比和=1；官方显示值=内部值取整）。
- 独立审核：docs/reviews/ 记录 subagent / GPT 审核版本、问题与复核。

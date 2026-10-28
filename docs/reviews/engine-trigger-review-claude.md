# 效果触发机制独立审核（Claude）

- 审核对象：`dist/engine/sim/simulate.js`、`dist/engine/sim/triggers.js`，以及它们调用的 `resolve.js` / `effects.js` / `damage.js`、`dist/data/effects.js`、`dist/data/mechanics.js`。
- 审核版本：`53192c9`（两个文件最后修改于 `595a264`“WIP: 触发表驱动的效果触发…”）。审核开始时这部分代码还没提交，当时命中事件改成了每次施放只发一次，D5 因此失败；`595a264` 改回按段发出后，D5 通过。下文行号都以 `53192c9` 为准。
- 审核者：Claude subagent，独立上下文。没有修改任何源文件。
- 成文时的并行改动：报告写完时，工作区里已经有另一个会话未提交的数据改动，不属于本次审核的版本。具体是：
  - `skill-mechanics.json` 里汤汤的 `plungeDuringUlt.tornadoBonus` 从 0.6 改成了 0。这在数据侧消除了第 1 条的重复加成，但 simulate.js:176 里那段乘法代码还在，建议照第 1 条一并删掉。
  - 6 条效果改用了新的触发代码：`anySkillHit`、`firstSkillDuringUltimate`、`afterComboCastCd45`、`afterComboNextSkill`、`comboHitLayers`、`targetNatureAttachedCount`。这些代码在 `53192c9` 的 triggers.js 里还没有条目，`specFor` 会返回 unknown，于是退回到文本启发式匹配，triggers.test 的“每个触发代码都有归属”也会失败。
  - 其中 `afterComboCastCd45` 用代码名表达冷却，这和第 14 条“读取目录 cooldown 字段”是两种做法，建议二选一。
  - 稍后 simulate.js 也出现了未提交的改动，其中终结技时长改为取 `params.duration[0]`。第 5 条已经提醒过这个做法的问题：梨诺第一项是“歌声间隔时间 1.5 s”，这样取的话，高歌姿态只持续 3+1.5=4.5 s，而原文是 15 s。建议改成在数据里显式写出时长。
  - 本文的结论与证据都以 `53192c9` 为准。
- 证据标记：【实测】表示用合成输入调用真实的 `simulate()` 复现过；【代码】表示沿调用链读代码得出，没有单独复现；【待裁定】表示规则还没定，需要先定契约。
- 现有测试（`53192c9`）：`review-engine` 32/32，`triggers.test` 2/2，`rotations.test` 9/9，`sim.four` 和 `plan.smoke` 正常。下文第 1–13 条没有一条被现有测试覆盖。
- 修复验证：以下建议代码我打到仓库外的临时副本里试过：第 1–4、6–10 条，第 11 条的事件改动和 skillApplyPhysFragile / applyPhysFragile / 长息三条规格，第 12–14 条，第 19 条，第 20 条中“所有重击都发 heavy”这一部分。打完后现有测试仍然全部通过（32/32、2/2、9/9，`sim.four` 和 `plan.smoke` 正常），对应的探针也都变成了期望值。其余各条（第 5、15–18、21–24 条，以及第 11、20 条的其余部分）只给了方案，没有验证。

## 总表（按严重程度排序）

| # | 级别 | 问题 | 主要位置 | 证据 | 偏差方向 |
|---|---|---|---|---|---|
| 1 | 严重 | 下落提前引爆形成的水龙卷，伤害被加成了两次 | simulate.js:176 | 实测 | 高估 ×1.6 |
| 2 | 严重 | `exclusiveGroup` 没有实现：汤汤 2/3 个水龙卷的脆弱同时生效；梨诺演唱/高歌两种姿态的攻击力叠加 | simulate.js:59–66，triggers.js:77 | 实测 | 高估 |
| 3 | 严重 | 返还技力触发了“恢复技力”类效果；汤汤涡流返还被记成真实技力 | simulate.js:52/138/140 | 实测 | 高估 |
| 4 | 严重 | 叠层效果第一次触发就是满层，再触发反而降层；“每层独立计时”没有实现 | simulate.js:91–92 | 实测 | 先高估后跳变 |
| 5 | 严重 | 所有终结技持续时间一律按 12 s 算（汤汤巨浪晚 8 s，提前引爆窗口变成 12 s） | simulate.js:170 | 实测 | 窗口错误 |
| 6 | 高 | `intGeWill&` / `willGtInt&` 前缀按“诀的技能形态”判定，四二式·肃阵装在其他干员身上永远不触发 | simulate.js:61/85 | 实测 | 低估 |
| 7 | 高 | 状态型的修饰效果不折叠（诀潜能5 的 +16% 法术增幅丢失） | simulate.js:61 | 实测 | 低估 |
| 8 | 高 | teamUnique 在候选表阶段就折叠，吞掉了第二位穿戴者的触发 | simulate.js:48/84，resolve.js:13–16 | 实测 | 低估 |
| 9 | 高 | 别礼潜能1 的“主控重击”：别礼不是主控时永不触发；触发后作用到此后 15 s 的普攻，而不是这一次重击 | simulate.js:86/182–184 | 实测 | 两个方向都有 |
| 10 | 高 | 重击灌注的追击、下落路径上的水龙卷和巨浪都不发 hit 事件 | simulate.js:176/184 | 实测 | 低估 |
| 11 | 高 | applyDebuffCategory 匹配过宽；刷新时不重发；状态型增幅从不发出 | simulate.js:92–93，triggers.js:69–72 | 实测 | 两个方向都有 |
| 12 | 高·待裁定 | 终结技演出暂停对“演出中才开始计时”的增益不起作用 | simulate.js:91–93/166–170 | 实测 | 少 3 s |
| 13 | 中 | `duringUltimate` 在 t=0 恒为真 | simulate.js:70 | 实测 | 高估 |
| 14 | 中 | 目录的 `cooldown` / `oncePerBattle` 没有接入 | simulate.js:82–90 | 代码 | 高估 |
| 15 | 中 | “X 后的下一次 Y”这类效果按固定窗口持续，没有在下一次 Y 之后消耗掉 | triggers.js:39–40 | 代码 | 高估 |
| 16 | 中 | consume / abnormal / tornado 事件或规格缺字段，有一条规格永远匹配不上，另有几条过宽 | simulate.js:99/140/210，triggers.js:52/56–59 | 代码 | 两个方向都有 |
| 17 | 中 | 汤汤潜能1“每处涡流额外返还 5”标成了 handled，实际没有结算 | triggers.js:78，simulate.js:140 | 实测 | 低估 |
| 18 | 中 | 战技形成多个水龙卷时，水龙卷伤害只结算一次 | simulate.js:140/147–150 | 实测 | 低估 |
| 19 | 中 | 提前引爆以后，原来排好的 ultimateEnd 仍在原时刻发出 | simulate.js:176 | 代码 | 时刻错误 |
| 20 | 中 | heavy 事件只对主控发出；wpn_claym_0008 的主控翻倍没有实现 | simulate.js:184，triggers.js:75 | 代码 | 低估 |
| 21 | 中 | 25 条资源区/其他区的触发效果在模拟里不起作用，覆盖表却算作 event | simulate.js:91–93，triggers.js:120 | 代码 | 低估且覆盖率虚高 |
| 22 | 中 | hit 规格里 `state` 读当前目标状态，`targetHas` 读施放时的快照，口径不一致 | simulate.js:79–80 | 代码 | 小 |
| 23 | 低 | 触发主体和形态仍依赖中文文本正则；涡流和下落是只给一个角色写的代码路径 | simulate.js:86/94/140/154/176 | 代码 | 可维护性 |
| 24 | 低 | 杂项（过期的 note、不可达分支、没用到的参数、测试写文件） | 见正文 | 代码 | 可维护性 |

---

## 详细问题

### 1【严重】下落提前引爆的水龙卷伤害被加成两次【实测】
- **位置**：simulate.js:176 `doHit(o,{...tor,…},…,'skill',1+(pd.tornadoBonus||0))`；sources/curated/skill-mechanics.json:3460 `"tornadoBonus": 0.6`；triggers.js:78 `ultimateEarlyTornado:{on:'earlyWave',duration:1}`。
- **现象**：同一次提前引爆，既触发了目录效果 `chr_0027_tangtang.talent2.tornadoBonus`（增伤区 +60%，潜能5 再 +80%），又在 `doHit` 上额外乘了 `extraFactor=1.6`。
- **证据**：别礼当主控，汤汤（潜能0）在 0.5 s 放终结技，别礼 4 s 下落。水龙卷那次命中的 `factor=1.6`、`bonus=1.6`，伤害 3007；去掉 extraFactor 后是 1879（=3007/1.6）。潜能5 时是 5379 对 3362。
- **影响**：每次提前引爆的水龙卷伤害都虚高 ×1.6。自动排轴会偏好“汤汤终结技 + 下落”。
- **建议**：保留目录效果这条通用路径，删掉硬编码的系数；mechanics 里的 `tornadoBonus` 也删掉（或者只作说明，不参与计算）。
```js
// simulate.js:176
if(tor) for(let i=0;i<cnt;i++) doHit(o,{...tor,skillKey:'skill'},rankOf(o,'skill'),{},'skill');
```

### 2【严重】`exclusiveGroup` 没有实现，互斥的效果被同时计入【实测】
- **位置**：simulate.js:59–66（activeBuffsFor 不读 `exclusiveGroup`，整个引擎都没有读这个字段；目录里有 14 条效果带这个字段）；triggers.js:77 `tornadoCount2:{on:'tornado',min:2}` 在形成 3 个水龙卷时也会匹配。
- **现象 a（汤汤）**：形成 3 个水龙卷时，`skill.fragile2`（R12 时 5%）和 `skill.fragile3`（10%）同时生效。潜能3 的 `pot3.fragile` 同时修饰这两条，各加 5，合计 25%。原文“两个水龙卷法术脆弱 / 三个水龙卷法术脆弱”是二选一，正确值是 10%（潜能3 时 15%）。
- **现象 b（梨诺）**：战技演唱姿态的攻击力（10%）和终结技高歌姿态的攻击力（10%）同时生效，合计 +20%。原文写的是“高歌姿态代替演唱姿态”，目录 notes 也写明两者互斥（组名 `liino_stance_atk`）。
- **证据**：别礼+汤汤用顺序轴：别礼战技 → 汤汤连携 → 别礼战技（minT 12）→ 汤汤连携 → 汤汤战技。汤汤 16.1 s 的战技消耗了 2 处涡流，此后别礼命中的 `factor.fragile=1.15`（潜能3 时 1.25）。另一组：别礼+梨诺，梨诺 0.5 s 战技、2 s 终结技。别礼 2.25 s 以后的命中，属性附加里同时有 `skill.teamAtk:10` 和 `ult.teamAtk:10`。
- **影响**：汤汤队全队的法术脆弱区多出 5–10 个百分点；梨诺队攻击力多出 10%。
- **建议**：一是让触发规格支持上限，2 个水龙卷的规格只匹配恰好 2 个；二是在 activeBuffsFor 里，修饰折叠完成之后按 `exclusiveGroup` 取最大值。
```js
// triggers.js:77
tornadoCount2:{on:'tornado',min:2,max:2}, tornadoCount3:{on:'tornado',min:3}, tornadoCount2Plus:{on:'tornado',min:2},
// simulate.js:78（specMatches 中，紧接 spec.min 那一行之后）
if(spec.max!=null&&!((ev.layers??ev.count??0)<=spec.max)) return false;
// simulate.js:66（activeBuffsFor 结尾，替换 `return kept;`）
const best={}; for(const a of kept){ const g=a.effect.exclusiveGroup; if(g&&!(best[g]?.value>=a.value)) best[g]=a; }
return kept.filter(a=>!a.effect.exclusiveGroup||best[a.effect.exclusiveGroup]===a);
```
- 【待裁定】“取最大”和“后施加的覆盖先施加的”在某些情况下结果不同：比如先 3 个后 2 个水龙卷，游戏里可能降到 5%。取最大是保守的上界。另外，数据里诀的 `lizhiyan_*_ult_vs_combo` 和 `lizhiyan_combo_*` 组名不一样，notes 说两者互斥，组名却没对上，需要在数据侧核对。

### 3【严重】返还技力被当作“恢复技力”触发；汤汤涡流返还被记成真实技力【实测】
- **位置**：simulate.js:52（gainSp 不管 kind 是什么都发 spGain）；:138（别礼这类“返还”的 kind=poison，仍然带着 `{source:'selfSkill'}`）；:140（涡流返还硬编码成 `'real'`，没看 mechanics 里的 `kind:"返还"`）。
- **规则**：rules C12 写明“返还技力不算恢复技力（不触发恢复技力类效果），消耗时不获得终结技能量”；D21 写明“返还技力不算恢复技力，别礼/汤汤等返还型战技不会触发拓荒”。
- **证据**：别礼穿 3 件拓荒，0.5 s 放战技。日志里有 `spGain 别礼 战技返还 poison 30`，同一时刻出现 `buffStart suit_atb01.p2`（全队 +16%，15 s）。汤汤穿拓荒，先连携、3 s 再放战技：`spGain … kind=real 20`，拓荒同样被触发。
- **影响**：有 9 条“恢复技力后”类效果会被返还型战技错误触发，包括拓荒、秋栗潜能1、骏卫天赋、wpn_sword_0016/0019/0012、wpn_lance_0015。汤汤的返还按真实技力记账，下一次消耗时会多给全队终结技能量（每处涡流每人约 1.3 点）。
- **建议**：
```js
// simulate.js:52：只有真实恢复、并且实际入账了，才发事件
if(kind==='real'&&g>0&&meta?.source&&meta.who!=null) fireTrigger({on:'spGain',who:meta.who,source:meta.source,amount:g});
// simulate.js:140：按数据里的 kind 记账
gainSp((num(mech.spRefund.value,rankOf(mb,'skill'))||0)*vs.length,`${mb.op.name} 战技消耗 ${vs.length} 处涡流返还`,/恢复|recover/.test(mech.spRefund.kind||'')?'real':'poison',{who:mb.idx,source:'selfSkill'});
```
- **相关问题**：弧光战技的 `spRefund.kind:"恢复"` 有前提条件“目标处于导电、消耗导电后”，但 :138 不看条件就发放 40，并且会触发 spGain（【实测】：没有导电时，0.5 s 就出现 `spGain real 40`）。阿列什和骏卫的 `byLayers` 返还，在 `num()` 里解析成 null，结果是 0，所以永远不会触发。这两项属于战技状态机的缺口；修好之前，这几名干员的“恢复技力”类触发都不可信。

### 4【严重】叠层效果第一次触发就是满层，再触发反而降层；“每层独立计时”没有实现【实测】
- **位置**：simulate.js:91 `resolveValue(c,{…stacks:{}…})` 进入 effects.js:12–13，`ctx.stacks` 缺省时会取 `maxStacks`。simulate.js:92 只有 `stacking==='stack'||perStack` 时才叠层；`independent` 走的是刷新路径；刷新时也不更新数值。
- **证据**：陈千语天赋“技能每次命中 +8% 攻击，最多 5 层”。第一次战技命中后面板攻击从 702 变成 984（+40%，也就是直接 5 层），第二次命中后变成 815（+16%，2 层）。wpn_claym_0016.p2（每层 15.4，最多 3 层，每层独立计时）第一次触发就是 46.2。
- **影响**：目录里有 25 条触发型叠层效果（清单见附录 B），其中 19 条是独立计时。它们在战斗前段被高估，之后数值跳变；独立计时的那些一直停在第一次触发时的值。低温症（`4*layers`，无法叠加）第二次以更多层数施加时，仍然保留旧值。
- **建议**：
```js
// simulate.js:91：首次触发按 1 层算
const {value}=resolveValue(c,{data,overrides:{},stacks:{[e.id]:1},vars:{layers:ev.layers??0}});
// simulate.js:92：替换查找 existing 的那一段
// 独立计时：每层一条记录，满层时顶掉最早的一条；无法叠加：刷新时取较大的值
const same=S.buffs.filter(b=>b.cand.effect.id===e.id&&b.ownerIdx===c.ownerIdx&&b.beneficiaryIdx===ben); const maxSt=e.value?.maxStacks;
if(e.stacking==='independent'&&maxSt&&same.length>0){ if(same.length>=maxSt){ const oldest=same.reduce((a,b)=>a.until<=b.until?a:b); S.buffs.splice(S.buffs.indexOf(oldest),1); }
  S.buffs.push({cand:c,ownerIdx:c.ownerIdx,beneficiaryIdx:ben,value,stacks:1,until:t0+dur,since:S.t}); addLog('buffStack',{id:e.id,layers:Math.min(maxSt,same.length+1)}); return; }
const existing=same[0];
if(existing){ if(!(e.stacking==='stack'||e.value?.perStack!=null)) existing.value=Math.max(existing.value,value); /* 下面原有的叠层/刷新逻辑不变 */ …
```
`t0` 见第 12 条；不采纳第 12 条的话，这里用 `S.t`。独立计时的多条记录在 activeBuffsFor 里各自入列、同一乘区内加算，activeBuffsFor 不需要改。但 teamUnique 的 `top` 只保留一条，如果以后出现“独立计时 + teamUnique”的效果，需要另行处理（目前目录里没有）。

### 5【严重】所有终结技持续时间一律按 12 s 算【实测】
- **位置**：simulate.js:170 `mb.ultActiveUntil=S.t+T.castSeconds.ultimate+(num(mech.duration)||12)`。mechanics 里所有干员都没有 `ultimate.duration`；干员表 `skills.ultimate.params.duration` 有值，但代码没读。
- **证据**：汤汤 0.5 s 放终结技、不下落，巨浪（ultimate2，lateHit）在 15.5 s 结算。按官方“古老图形持续时间 4 s”加 3 s 演出，应该是 7.5 s。提前引爆窗口也因此变成 3.5–15.5 s，而不是 3.5–7.5 s。
- **受影响的“终结技期间”状态**：伊冯（实际 7 s，模拟 12 s）、庄方宜（25 s 对 12 s）、诀（破晦阵 20 s 对 12 s）、汤汤（4 s 对 12 s）。梨诺（15 s）、祀/赛希（12 s）碰巧接近。
- **影响**：13 条 duringUltimate 类效果的窗口都不对；汤汤的巨浪推迟 8 s；搜索可以在错误的 12 s 窗口里安排下落。
- **建议**：在 skill-mechanics.json 里给每个终结技显式写上 `ultimate.duration`。不能直接取 `params.duration` 的第一项，因为梨诺的第一项是“歌声间隔 1.5 s”。同时让缺数据的情况在日志里看得见：
```js
// simulate.js:170
const ultDur=num(mech.duration,rankOf(mb,'ultimate')); if(ultDur==null) addLog('note',{message:`${mb.op.name} 终结技持续时间缺数据，按 12 s 计`});
mb.ultActiveUntil=S.t+T.castSeconds.ultimate+(ultDur??12);
```
再加一条数据测试：目录里凡是有 duringUltimate / afterUltimateEnd / plungeDuringUlt 的干员，mechanics 里必须有 `ultimate.duration`。

### 6【高】`intGeWill&` / `willGtInt&` 前缀按技能形态判定，四二式·肃阵装在其他干员身上永远不触发【实测】
- **位置**：simulate.js:61 和 :85 `members[c.ownerIdx]?.mode!==modeGate`。triggers.js:16 和 :109 的注释、docs/sim-design.md 的“形态门槛”一段，都把这个前缀描述成“形态门槛”。
- **规则**：用这个前缀的只有 wpn_funnel_0016.p2–p5，原文是“装备者智识值≥意志值：…”。条件看的是装备者的面板能力值，不是技能形态。`mode` 只有带 modeVariants 的干员才有值（目前只有诀），其他干员都是 undefined。
- **证据**：佩丽卡（智识 377 / 意志 113）和洁尔佩塔（283/231）装备四二式·肃阵放战技，附着事件各 1 次，p2 都触发 0 次；诀触发 1 次。
- **建议**：
```js
// simulate.js:94 之前新增：0 表示装备者面板智识≥意志
function attrGate(ownerIdx){ const a=members[ownerIdx]?.stats?.abilities||{}; return (a.int??0)>=(a.will??0)?0:1; }
// simulate.js:61 和 :85 两处
if(modeGate!=null&&attrGate(c.ownerIdx)!==modeGate) continue;
```
原文限定“只受等级、天赋、潜能、装备和武器影响”，而 `getStats` 里含食药。如果有食药会加智识或意志，就需要取不含食药的值（【待核】）。

### 7【高】状态型修饰效果不折叠，诀潜能5“终结技期间额外 +16% 法术增幅”丢失【实测】
- **位置**：simulate.js:61。状态分支遇到带 modifies 的效果时先 `continue` 掉了，没有写入 `activeIds`；于是 applyModifiers（resolve.js:38 的 `isOn(m,toggles)`）把它当成关闭。
- **证据**：诀潜能5、阵诀·智，0.5 s 放终结技之后的命中里，`talent1.int.artsAmp=24`，应为 40。梨诺潜能1 的 `singingOrHighStance` 也一样：只开了高歌、60 s 内没放过战技时，不折叠。
- **建议**：在 simulate.js:61 把 modifies 的判断提到 effectApplies 之前，并标记为激活。
```js
if(Array.isArray(e.modifies)&&e.modifies.length&&!e.fragileMultiplier){ activeIds[e.id]=true; continue; }
if(!effectApplies(e,seg)) continue;
```

### 8【高】teamUnique 在受益者候选表阶段就折叠，吞掉了第二位穿戴者的触发【实测】
- **位置**：simulate.js:48 用 candidateEffects 建候选表，resolve.js:13–16 对 teamUnique 效果只保留一个所有者；fireTrigger（:84）遍历的正是这张折叠后的表。
- **证据**：陈千语和弧光都穿拓荒，弧光战技恢复技力，拓荒不触发；陈千语不穿时，拓荒正常触发（owner=弧光）。长息的受益者是 others，每个人的表里保留的恰好是对方那份，所以没受影响（D8 也通过了）。
- **影响**：凡是 teamUnique、且受益者是 team 或 target 的触发效果，两人同穿或同持时只认排在前面那个人的动作。涉及拓荒、wpn_lance_0015.p2、wpn_lance_0007.p3、wpn_funnel_0014.p2、wpn_claym_0019.p3、wpn_sword_0026 等。
- **建议**：触发时按“所有者自己拥有的效果”遍历，不经过受益者折叠；teamUnique 只在结算端（activeBuffsFor:63）处理。这样一来 `fired` 去重也不需要了，受益者为 mainControl 的效果也不再依赖初始主控的候选表。
```js
// simulate.js 顶部
import {ownedEffects} from '../effects.js';
// simulate.js:49 之前
const ownCands=alive.map(mb=>ownedEffects(data.effects||[],team[mb.idx],data,{consumables:team[mb.idx]?.consumables||[]}).map(o=>({effect:o.effect,ownerIdx:mb.idx,ownerMember:team[mb.idx],rank:o.rank,setCount:o.setCount})));
// simulate.js:84
alive.forEach((mb,k)=>{ for(const c of ownCands[k]){ …
```

### 9【高】别礼潜能1“受到低温灌注的主控干员重击”：别礼不是主控时永不触发；触发后作用到此后 15 s 的普攻，而不是这一次重击【实测】
- **位置**：simulate.js:86 默认只认 `c.ownerIdx===ev.who`，而这个事件的 who 是主控；:182–184 的 `heavy` 事件在这次重击的 doHit 之后才发出，`infused` 也在过期判断之前就算好了；triggers.js:75。
- **证据**：主控是汤汤，别礼 0.5 s 放战技，汤汤 1.75 s 重击消耗了灌注，`heavyExtra` 触发 0 次。主控换成别礼时，2.85 s 那一下灌注重击本身没吃到 +20%，3.85–11.8 s 的所有普攻反而都吃到了。
- **规则**：原文“受到低温灌注的主控干员，重击命中敌人时额外造成20%伤害和5点失衡”，作用对象是这一次重击。目录 notes 列了两种解释（增伤 20%，或者追加一段 20%），【待裁定】。
- **建议**：灌注重击单独作为一个事件，who 设为灌注者，在这次重击 doHit 之前发出，持续 0 s（只作用于这一下）。
```js
// triggers.js:75
heavyHit:{on:'heavy'}, heavyHitAsMainControl:{on:'heavy',control:true}, infusedHeavyHit:{on:'infusedHeavy',duration:0},
// simulate.js:182，在 doHit 之前
if(heavy&&isControl) for(const o of alive){ const a=o.pendingHeavyAttach; if(a&&!(a.until!=null&&a.until<S.t-EPS)) fireTrigger({on:'infusedHeavy',who:o.idx}); }
// simulate.js:182，在原有的 hit 事件之后：所有重击都发 heavy，并带上 control 标记（同时解决第 20 条）
if(heavy) fireTrigger({on:'heavy',who:mb.idx,control:isControl});
// simulate.js:184：删掉原来的 fireTrigger({on:'heavy',who:mb.idx,infused:…})
// specMatches（:73 之后）
if(spec.control!=null&&!!ev.control!==spec.control) return false;
```
`duration:0` 时 until 等于 S.t，activeBuffsFor 的 `until<S.t-EPS` 判定让它只对当刻的命中生效。验证结果：改完之后，主控为汤汤时 1.75 s 正常触发；+20% 只出现在 2.85 s 那一下重击上。

### 10【高】部分命中不发 hit 事件【实测】
- **位置**：simulate.js:184，灌注追击 doHit 之后不发 hit；:175–176，下落本身、提前引爆的水龙卷和巨浪都直接 doHit，不发 hit。
- **证据**：别礼装备 wpn_claym_0003（“装备者的战技命中敌人时 攻击+”）或 wpn_claym_0004，2.85 s 有别礼的战技命中，但 buffStart 0 次。
- **影响**：别礼，以及任何 `attach.when` 为重击的战技，永远触发不了“战技命中”类的武器和天赋。汤汤提前引爆的水龙卷（视为战技伤害）和巨浪，也触发不了“战技/终结技命中”类效果。
- **建议**：
```js
// simulate.js:184
for(const sg of a.segs||[]){ doHit(o,{...sg,skillKey:'skill'},rankOf(o,'skill'),{},'skill'); fireTrigger({on:'hit',kind:'skill',who:o.idx}); }
// simulate.js:176
if(tor) for(let i=0;i<cnt;i++){ doHit(o,{...tor,skillKey:'skill'},rankOf(o,'skill'),{},'skill'); fireTrigger({on:'hit',kind:'skill',who:o.idx}); }
if(early){ doHit(o,{...early,skillKey:'ultimate'},rankOf(o,'ultimate'),{},'ultimate'); fireTrigger({on:'hit',kind:'ultimate',who:o.idx}); }
```
更稳妥的做法是给 doHit 加一个“同时发出 hit 事件”的参数，统一在一处发出，以后新加路径时就不会再漏。

### 11【高】applyDebuffCategory：规格过宽、刷新时不重发、状态型增幅从不发出【实测】
- **位置**：simulate.js:93 只在新建增益时发出，事件里只有 zone 和 by，没有属性；:92 刷新时直接 return；triggers.js:69–72。
- **现象 a（规格过宽）**：
  - `skillApplyPhysFragile`“通过自身战技施加物理脆弱”、`applyPhysFragile`“施加物理脆弱”、`selfSkillApplyHeatFragile`“施加灼热脆弱”、`skillOrUltApplyArtsFragile`“通过战技或终结技施加法术脆弱”都只写了 `zone:'fragile'`，任何脆弱都会触发它们。
  - `gainElectricAmp` 原文是“装备者获得电磁增幅时”，规格却写成“装备者施加任意增幅”，方向相反。
  - 长息原文是“施加增幅、庇护、脆弱、虚弱”，规格没有排除易伤区。易伤算不算在内，【待裁定】。
  - 证据：别礼装备 wpn_claym_0017（“施加物理脆弱时 源石技艺强度+”），整场只施加了寒冷脆弱（低温症），2.48 s 仍然触发了 p2。
- **现象 b（刷新不重发）**：别礼第二次连携（15.56 s）把低温症刷新到 30.56 s，但长息没有重新触发，在 17.44 s 就结束了。
- **现象 c（状态型不发出）**：梨诺高歌姿态、诀智形态的增幅等都走状态分支，从不发出 applyDebuffCategory，所以梨诺穿长息时不会触发。
- **建议**：事件带上属性列表；新建和刷新都发出；加一层级联保护，防止“由这个事件触发的减益又触发自己”形成死循环；规格补齐 element 和 by。
```js
// simulate.js:93：把末尾的 fireTrigger 换成 debuffApplied(c,ev)；:92 打出 buffRefresh 日志之后也调用一次。新增：
function debuffApplied(c,ev){ const e=c.effect; if(!['amp','fragile','vulnerable'].includes(e.zone)) return; const a=e.applies||{};
  const elements=a.elements?.length?a.elements:[a.damageClass==='physical'?'physical':'arts'];
  fireTrigger({on:'applyDebuffCategory',who:c.ownerIdx,zone:e.zone,by:ev?.by||ev?.kind,elements,chain:[...(ev?.chain||[]),e.id]}); }
// fireTrigger 循环内（:86 之前）
if(ev.chain?.includes(e.id)) continue;
// specMatches :73：同时接受单个属性和属性列表
const evEls=ev.elements||(ev.element!=null?[ev.element]:[]);
if(spec.element&&!evEls.includes(spec.element)) return false; if(spec.elementIn&&!spec.elementIn.some(x=>evEls.includes(x))) return false;
// triggers.js:69–72（示例）
afterApplyAmpProtectFragileWeaken:{on:'applyDebuffCategory',zoneIn:['amp','fragile']},
skillApplyPhysFragile:{on:'applyDebuffCategory',zone:'fragile',by:'skill',element:'physical'}, applyPhysFragile:{on:'applyDebuffCategory',zone:'fragile',element:'physical'},
selfSkillApplyHeatFragile:{on:'applyDebuffCategory',zone:'fragile',element:'heat'},
skillOrUltApplyArtsFragile:{on:'applyDebuffCategory',zone:'fragile',byIn:['skill','ultimate'],elementIn:['arts','cold','heat','electric','nature']},
gainElectricAmp:{on:'applyDebuffCategory',zone:'amp',element:'electric',anyone:true}, // 近似：任意来源施加含电磁的增幅；还需判断这个增幅的受益者包含装备者
```
- “法术脆弱”是否包含寒冷、灼热等元素脆弱，需要先裁定，再定 elementIn。
- 状态型增幅的发出点：建议在状态从假变真的时刻（例如 castUlt 设置 ultActiveUntil 之后），对该干员的状态型 amp/fragile 效果调用一次 debuffApplied。

### 12【高·待裁定】终结技演出暂停对“演出中才开始计时”的增益不起作用【实测】
- **位置**：simulate.js:166–167 只把施放前已经存在的计时延长 3 s。:168 的施放触发、:170 的定身触发、2.4 s 时终结技命中引起的触发，都是在暂停之后才新建的，仍按 `S.t+dur` 计时。
- **证据**：祀在 2 s 放终结技，`ult.amp.cold until=14`；同一时刻已经存在的增益都被延长了 3 s。按 timing.js:7 的假设（演出期间增益计时暂停），这个增幅应该到 17 s；ultActiveUntil 也是按 17 s（3+12）算的，两者对不上。
- **影响**：祀、赛希、安塔尔的终结技增幅，以及 `rootOrUltThenNextCombo` 等，实际窗口都少了 3 s。同一个假设下并存两种口径。
- **建议**（如果维持“演出期间暂停计时”这个假设）：
```js
// simulate.js:91，算出 dur 之后
const t0=T.ultimatePausesTimers?Math.max(S.t,S.pausedUntil):S.t;
// :92 和 :93 里所有的 S.t+dur 都改成 t0+dur
```
附着（:100）、异常（:99）、涡流（:154）也有同样的问题，建议共用同一个算 `t0` 的帮助函数。另外还需要决定：终结技自身的增幅是“施放时开始”还是“演出结束后开始”，官方文本没有写。

### 13【中】`duringUltimate` 在 t=0 恒为真【实测】
- **位置**：simulate.js:70 `(members[ownerIdx]?.ultActiveUntil||0)>=S.t-EPS`。还没放过终结技时，0 ≥ −1e-6 成立。
- **证据**：别礼+梨诺，0 s 的第一次普攻，属性附加里有 `chr_0035_liino.ult.teamAtk:10`。
- **建议**：
```js
case 'duringUltimate': { const u=members[ownerIdx]?.ultActiveUntil; return u!=null&&u>=S.t-EPS; }
```

### 14【中】目录的 `cooldown` / `oncePerBattle` 没有接入【代码】
- **位置**：simulate.js:82–90。目录中有 34 条非常驻效果带 `cooldown` 或 `oncePerBattle`，其中 21 条的触发已经建模。例如弭弗潜能3“施放连携技后攻击+，20 s，每 45 s 最多一次”；wpn_claym_0004.p2 有 0.1 s 内置冷却，现在按段命中，会在同一时刻叠满。
- **影响**：弭弗潜能3 的覆盖时间被高估，因为每次连携都会刷新；带 0.1 s 冷却的命中叠层效果，在多段同时命中时叠得过快。
- **建议**（fireTrigger :88 处）：
```js
if(spec.once||e.oncePerBattle){ S.onceFired=S.onceFired||new Set(); if(S.onceFired.has(key)) continue; S.onceFired.add(key); }
if(e.cooldown){ S.lastFired=S.lastFired||{}; if(S.lastFired[key]!=null&&S.t-S.lastFired[key]<e.cooldown-EPS) continue; S.lastFired[key]=S.t; }
```

### 15【中】“X 后的下一次 Y”效果按固定窗口持续，没有在下一次 Y 之后消耗【代码】
- **位置**：triggers.js:39–40，包括 comboThenNextSkill（30 s）、rootOrUltThenNextCombo（20 s）、crystalOrFreezeThenNextSkillOrUlt（20 s）。
- **影响**：窗口里的每一次 Y 都吃到加成，例如 wpn_lance_0006.p2 让 30 s 内的所有战技都吃到；窗口内其他种类的技能，只要符合 applies，也会吃到。
- **建议**：规格加一个 `consumeOn` 字段，在对应技能的最后一段命中之后移除。
```js
// triggers.js:39
comboThenNextSkill:cast('combo',{duration:30,consumeOn:'skill'}),
rootOrUltThenNextCombo:[{on:'root',duration:20,consumeOn:'combo'},cast('ultimate',{duration:20,consumeOn:'combo'})],
// startBuff 新建时记录：S.buffs.push({...,consumeOn:spec?.consumeOn})
// skillHit 处理（:209）在所有段结算完之后。since<S.t 是为了避免同一时刻触发又同一时刻被消耗
S.buffs=S.buffs.filter(b=>!(b.consumeOn===e.kind&&b.ownerIdx===mb.idx&&b.since<S.t-EPS));
```

### 16【中】事件字段和规格不全：有一条规格永远匹配不上，另有几条过宽【代码】
- **consume**：
  - :99 是异常反应分支，那里的 consume 事件没有 element。
  - castSkill 完全不处理 `mech.consumes`，所以阿列什、伊冯战技消耗寒冷/自然附着这件事不会发生。
  - 结果：`skillConsumeColdAttach`（`{element:'cold',by:'skill'}`）在任何输入下都匹配不上，“消耗附着”类效果在战技路径上永远不会触发。
- **abnormal 规格缺 by**：`skillApplyFreeze`“通过战技施加冻结”、`skillApplyArtsAnomaly`“通过自身战技施加法术异常”、`comboArtsBurstOrBurn` 的燃烧分支（原文“通过连携技…施加燃烧”）都没写 by，连携或终结技造成的异常也会触发它们。事件里本来就有 by 字段，只是规格没用。
- **tornado 事件没有 by**：汤汤的水龙卷脆弱经 debuffApplied 传出去时 by 是空的，`by:'skill'` 一类的规格匹配不上。
- **建议**：
```js
// simulate.js:99
fireTrigger({on:'consume',who:byIdx,layers:consumed,by:viaKind,elements:others});
// simulate.js:140 和 :210
push(S.t+T.castSeconds.skill*0.6,'tornado',{who:mb.idx,count:tornadoes,by:'skill'});
fireTrigger({on:'tornado',who:e.who,count:e.count,by:e.by});
// triggers.js:56–59
skillApplyFreeze:{on:'abnormal',which:'freeze',by:'skill'}, skillApplyArtsAnomaly:{on:'abnormal',by:'skill'},
comboArtsBurstOrBurn:[{on:'burst',by:'combo'},{on:'abnormal',which:'burn',by:'combo'}],
```
战技消耗附着需要在 castSkill 里按 `mech.consumes`（element 型）实现，并在命中时刻发出 `{on:'consume',by:'skill',elements,layers}`。实现之前，应该先把 `skillConsumeColdAttach` 改标成 unmodeled，免得覆盖报告虚报。

### 17【中】汤汤潜能1“每处涡流额外返还 5”标成了 handled，实际没有结算【实测】
- **位置**：triggers.js:78 `skillConsumeVortex:{handled:…}`。simulate.js:140 只用了 `mech.spRefund.value`；:142 的潜能返还循环只收 mode=auto 的效果，而这条是 mode=user。
- **证据**：汤汤潜能0 和潜能1 消耗 1 处涡流，返还都是 20。
- **建议**：用第 8 条的 `ownCands`，按触发代码叠加，不按效果 id 写特判。
```js
// simulate.js:140
const extra=ownCands[alive.indexOf(mb)].filter(c=>c.effect.condition?.trigger==='skillConsumeVortex').reduce((a,c)=>a+(c.effect.value?.perStack||0),0);
gainSp(((num(mech.spRefund.value,rankOf(mb,'skill'))||0)+extra)*vs.length, …);
```

### 18【中】战技形成多个水龙卷时，水龙卷伤害只结算一次【实测】
- **位置**：simulate.js:140 和 :147–150。`tornadoes` 只用来给事件计数；skillHit 的段列表里，skill2（单个水龙卷）只有一次。而下落路径（:176）是按 cnt 次结算的。
- **证据**：形成 3 个水龙卷的那次战技（16.1 s），skill1 和 skill2 各只命中一次。
- **规则**：原文“消耗附近所有涡流使其形成额外的水龙卷”“水龙卷…持续造成寒冷伤害”，参数表写的是“单个水龙卷伤害倍率”。
- **建议**：用数据声明“每消耗一个资源追加哪一段”，castSkill 按数量复制这一段，和下落路径共用同一条规则。
```js
// mechanics：skill.spRefund 旁边加 "extraSegmentPerConsumed":"skill2"
// simulate.js:148 之后、:150 push 之前
const extraSeg=mech.extraSegmentPerConsumed; if(extraSeg&&tornadoes>1){ const s2=segs.find(x=>x.id===extraSeg); if(s2) for(let i=1;i<tornadoes;i++) segs.push(s2); }
```
顺序上建议“射击段 → tornado 事件 → 水龙卷段”，避免射击段吃到这次水龙卷才施加的脆弱。现在 tornado 事件比 skillHit 先入队，所以射击段也吃到了（【代码】）。

### 19【中】提前引爆以后，原来排好的 ultimateEnd 仍在原时刻发出【代码；已在补丁中验证】
- **位置**：simulate.js:176 只从队列里移除了 lateHit。
- **建议**：
```js
evq.splice(0,evq.length,...evq.filter(e=>!((e.type==='lateHit'||e.type==='ultimateEnd')&&e.who===o.idx)));
fireTrigger({on:'ultimateEnd',who:o.idx});
```
- **附带问题**：:166–167 的暂停没有平移队列里的事件（lateHit、ultimateEnd、burnTick、burst、tornado），也没有平移其他干员的 ultActiveUntil。这与“计时全部暂停”的假设不一致（【代码】，影响小）。

### 20【中】heavy 事件只对主控发出；wpn_claym_0008 的主控翻倍没有实现【代码】
- `heavyHit` 原文是“装备者对敌人造成重击时”，不限主控，但 :184 只在主控重击时发出。对照之下，`heavyHitAsMainControl` 的原文才明确限定主控。非主控的自动普攻里也有重击（D3 已确认），这些重击现在不会触发。
- wpn_claym_0008.p1 的 notes 写着“引擎按主控×2”，但模拟器里没有任何翻倍逻辑。又因为 heavy 只在主控时发出，这条效果实际上应该一直按翻倍值算。
- **建议**：发出方式见第 9 条（所有重击都发 heavy 并带 control 标记，`heavyHitAsMainControl` 规格加 `control:true`）。翻倍用规格字段表达，例如 `{on:'heavy',controlMul:2}`，在 startBuff 里 `if(spec.controlMul&&ev.control) value*=spec.controlMul`，不要按效果 id 写特判。

### 21【中】25 条资源区/其他区的触发效果在模拟里不起作用，覆盖表却算作“事件已建模”【代码】
- **位置**：startBuff 把 spRefund、energyGain、cdr、poise、other 区的效果也建成了增益；calcSegment 不读这些区；triggers.js:120 把它们统计为 event。
- **清单（部分）**：埃特拉碎冰返还，伊冯潜能1 回能和潜能4 返还，阿列什冻结回能，萤石潜能5 连携冷却，梨诺天赋2 和潜能1 的返还，庄方宜终结技期间的冷却加速和免费战技，祀天赋1（:169 另有专门处理），套装 usp01 返还等。完整清单见附录 B。
- **影响**：docs/trigger-coverage.md 里的“event 146”高估了实际生效的触发数。这些效果对技力、能量、冷却的作用全部缺失，方向上是低估了这些干员。
- **建议**：triggerCoverage 增加一类 `event-noop`（zone 不在伤害区或属性区、且没有专门处理），在测试里单独列出；资源类效果按需要在 startBuff 里分派到 gainSp、gainEnergy 或冷却。

### 22【中】hit 规格里 `state` 读当前目标状态，`targetHas` 读施放时的快照【代码】
- **位置**：simulate.js:79–80。`comboHitColdOrFrozen`（赛希天赋“连携技命中已处于寒冷附着或冻结状态的敌人”）用 state 判定，读的是命中时刻、也就是连携已经消耗附着之后的状态；而 `comboHitColdAttached` 用的是施放时的快照。
- **建议**：statePred 接受一个可选的附着快照参数，调用处写 `statePred(spec.state,c.ownerIdx,ev.targetAttach)`，函数内部用 `const att=snap||S.attach` 判断附着。

### 23【低】触发主体和形态仍依赖中文文本正则；涡流和下落是只给一个角色写的代码路径
- **文本正则**：
  - :86 判断 `anyone` 的正则、:94 `modeOk` 判断“阵诀·智/意”的正则，读的都是条件文本。
  - 目前目录里被这个正则命中的有 7 条，其中 6 条事件型效果的规格本身已经写了 `anyone:true`，另外 1 条是未建模，所以这个正则已经没有必要。
  - 像“主控干员”这样的触发主体，也只能写在规格里表达（第 9 条）。
  - 建议：删掉正则，触发主体统一写进规格（用 `anyone` 或新事件），形态用代码前缀表达。
- **角色专用代码**：`mech.creates.resource==='涡流'`、`spRefund.per==='vortexConsumed'`、`plungeDuringUlt.tornadoSegment` / `earlyWaveSegment` / `tornadoBonus`，都是专门为汤汤一个人写的路径。
  - 建议抽象成通用的资源模型：`creates:{resource,max,duration}` / `consumes:{resource,all}` / `perConsumed:{refund:{value,kind},extraSegment,event}` / `earlyTrigger:{by:'plunge',…}`，全部由数据驱动，模拟器代码里不出现角色名或资源名。

### 24【低】杂项
- simulate.js:128 的 `COND_RE` 里含“提前降下”，于是每次汤汤放终结技都会记一条“条件伤害段未建模”的 note；但这一段现在已经由下落路径建模了。
- simulate.js:207 的 `case 'planned'` 不可达（:205 已经把 planned 事件分出去了），而且不含 plunge。建议删除。
- simulate.js:91 `startBuff` 的 `beneficiaryIdx` 参数没有用到。
- tests/triggers.test.mjs 在测试过程中写 docs/trigger-coverage.md，文件里含时间戳，每跑一次就产生一次差异。建议拆成单独的工具脚本。

---

## 逐问回答

### 问 1：各类事件的发出时刻和字段

| 事件 | 发出位置 | 字段 | 结论 |
|---|---|---|---|
| cast | castSkill:145、castCombo:155、castUlt:168 | kind, who | 时刻正确。下落攻击不发 cast，目前也没有规格需要 |
| hit | skillHit:209（按段发出，连携带 targetAttach）、lateHit:208、normalHit:182 | kind, who, heavy, targetAttach | 漏发：灌注追击（:184）、下落路径上的水龙卷/巨浪/下落本身（:175–176），见第 10 条。state 判定没有用 targetAttach，见第 22 条 |
| attach | applyAttach:102 | by（skill/combo/ultimate/plunge）, element, who | 正确 |
| attachLayers | :102 | layers, element, who | 正确 |
| consume | :99（异常反应，缺 element）、:158（连携，element 取 cons[0]） | who, layers, by, element | 战技消耗没有实现，`skillConsumeColdAttach` 不可达（第 16 条） |
| abnormal | :99 | which, who, by | 字段齐全；但有三条规格没用 by（第 16 条） |
| burst | :214（附着后 burstDelay） | element, by（=via）, who | 正确 |
| heavy | :184 | who, infused | 只对主控发出；infused 在过期判断之前计算；受益者不是本人（第 9、20 条） |
| root | castSkill:141、castUlt:170 | who, by | 在施放时刻发出，比命中早 0.48 s 或 2.4 s，可以接受 |
| tornado | 战技路径 :210（延后 0.48 s）、下落路径 :176（即时） | who, count | 缺 by；min 规格让 2 个和 3 个的规格同时命中（第 2、16 条） |
| earlyWave | :176 | who | 和 extraFactor 重复加成（第 1 条） |
| ultimateEnd | :211（在 :170 入队） | who | 时刻依赖错误的 12 s 默认值；提前引爆后不撤销（第 5、19 条） |
| iceShatter | doHit:120 | who | 正确 |
| battleStart | :187 | anyone | 正确，只发一次 |
| applyDebuffCategory | startBuff:93 | who, zone, by | 只在新建时发出；缺属性；状态型增幅不发出（第 11 条） |
| spGain | gainSp:52 | who, source, amount | 返还技力也发、入账为 0 也发；`recoverSp`（:145）和潜能返还（:142）不带 meta，所以不发（第 3 条） |

- 声明了、但在任何输入下都匹配不上的：`skillConsumeColdAttach`。
- 在常见配置下匹配不上的：四二式·肃阵的四条（装备者不是诀时），`infusedHeavyHit`（别礼不是主控时），别礼身上的“战技命中”类效果。

### 问 2：状态型效果
- **判定对象**：duringUltimate 取所有者自己的终结技，目标类状态取全局目标，modeInt 取所有者的形态。这部分正确。
- **与增益列表重复计算**：同一 id 的增益存在时，状态副本会跳过（靠 activeIds），没发现同一 id 重复计算；但不同 id 的互斥效果会重复（第 2 条）。
- **teamUnique**：结算端 :63 正确（D8 通过）；触发端被提前折叠（第 8 条）。
- **modifies 折叠**：增益型的修饰正确（D7 通过）；状态型的修饰丢失（第 7 条）。
- **形态门槛**：modeOk 对诀自己的效果判定正确；modeGate 判定的对象错了（第 6 条）。
- 另外还有 t=0 的误判（第 13 条）和终结技时长缺数据（第 5 条）。

### 问 3：“只认本人动作”的默认规则与去重
- **默认规则**：我逐条看了 144 条事件型效果里条件主体不是“装备者”的 79 条条件文本（脚本见附录 A）。只有别礼潜能1 的两条，主体是“主控干员”而规格没有表达出来（第 9 条）。受益者为全队或目标的效果，触发主体仍然是所有者本人，默认规则对它们是对的。
- **去重**：同一次事件对同一（效果，所有者）只启动一次，是为了消除“团队效果在每个受益者的候选表里各出现一次”带来的重复。现在命中按段发出，“每次命中叠一层”不会因为去重而丢层。需要按次数叠层的事件（水龙卷数量、涡流数）目前都是单值事件，没有发现漏层。真正的叠层问题是第 4 条（初值和独立计时）和第 14 条（内置冷却）。
- 采纳第 8 条（按所有者遍历）之后，这层去重可以删掉。

### 问 4：startBuff
- **持续时间**：取值顺序是 `spec.duration ?? e.duration ?? e.window ?? 15`。没有发现永不过期的增益：所有触发增益都是有限时长，暂停也只延长有限值。问题在于演出暂停的口径（第 12 条）和“下一次”类效果不消耗（第 15 条）。`duration:null` 的资源类效果按 15 s 算，但它们本身没有作用（第 21 条）。
- **叠层和刷新**：见第 4 条。
- **spec.duration 覆盖**：用法合理（earlyWave 1 s、姿态 60 s）。建议支持 0，表示只作用于当刻（第 9 条）。
- **once**：`firstSkillInBattle` 的实现正确，键是“效果+所有者”，跨事件保存在 S.onceFired 里。目录的 `oncePerBattle` 没有接入（第 14 条）。

### 问 5：新机制和顺序轴
- **涡流**：生成正确（连携施放时生成，持续 30 s，上限 2，超出时丢掉最早的）。问题有三处：消耗返还的记账类型错（第 3 条）；潜能1 漏算（第 17 条）；计时不受演出暂停影响（第 12 条附注）。下落消耗涡流时不返还技力，原文没写，【待核】。
- **水龙卷计数**：数量正确（1+涡流数）。问题是 2 个和 3 个的脆弱同时生效（第 2 条），战技路径只算一次伤害（第 18 条）。
- **定身**：在施放时刻发出（祀战技、汤汤终结技），可以接受；终结技路径上的定身增益受第 12 条影响。
- **提前引爆**：重复加成（第 1 条）；命中不发事件（第 10 条）；ultimateEnd 不撤销（第 19 条）；窗口长度错（第 5 条）。
- **终结技结束**：时刻依赖 12 s 默认值（第 5 条）。
- **下落攻击**：只有主控能用，演出中禁止，这部分正确；下落本身不发 hit 事件（可以和第 10 条一起补）。
- **巨浪延后**：在 ultActiveUntil 时刻结算，提前引爆时移除，逻辑正确；只是时刻错（第 5 条）。
- **顺序轴**：
  - seqFeasible 的探测调用，除了原来就有的 `skillStage` 复位，没有别的副作用。
  - plunge 的可行性判断是“是主控且不在演出中”。
  - 同一时刻的顺序（状态事件 → 普攻 → 计划动作/顺序动作）在新事件上依然成立。
  - 没有发现解码结果和回放结果不一致。但第 5 条让搜索能在 12 s 的窗口里安排下落，第 1–4 条的误差也会被搜索放大（见下一节）。

### 问 6：重复计算、永不过期、同一时刻重复发出
- **重复计算**：第 1、2 条，都已复现；第 4 条的首发满层也属于高估。
- **永不过期**：没有发现。
- **同一时刻重复发出**：没有发现预期之外的重复；提前引爆之后的 ultimateEnd 属于“已过期的事件仍然发出”（第 19 条）。

---

## 对“广义排轴优化”的影响
- 自动排轴（束搜索、退火、MCTS）只看模拟器给出的分数，模型误差会被当成“技巧”放大。sim-design.md 已经记录过一次这样的情况（终结技演出重叠的漏洞）。本次各条问题的偏差方向：
  - **高估，会被搜索偏好的**：提前引爆下落（第 1、5 条）；凑满涡流再放战技（第 2 条）；别礼/汤汤战技配拓荒（第 3 条）；叠层武器（第 4 条，首发满层）；梨诺先战技后终结技（第 2 条）。
  - **低估，会被搜索回避的**：别礼不当主控时的潜能1 灌注、别礼的“战技命中”类武器（第 9、10 条）；诀潜能5（第 7 条）；四二式·肃阵（第 6 条）；资源类触发（第 21 条）。
- 修复方式应保持通用：规则写进触发表和 mechanics 数据，模拟器不按角色名或资源名分支（第 23 条）。
- 回归测试用规则推导出的期望值，不拿预设轴（包括月咒等攻略轴）的数值或动作顺序当判据。现有 rotations.test 的“自动排轴不低于标答 85%”是一个质量下限，可以保留，但不能代替下面这些机制测试。

---

## 建议补充的测试算例

通用输入：敌人防御 100、各元素抗性 D，技能等级都是 12，`mainControl` 未注明时为 0；“无武器/无配装”表示用空配置，只装测试需要的那一件。期望值都来自原文或 rules，不来自引擎输出。

| # | 输入 | 期望 | 依据 |
|---|---|---|---|
| T1 | [别礼(3 件拓荒), 汤汤]；别礼 0.5 s 战技；duration 3 | 0.5 s 有 `spGain` kind=poison 30；没有 `suit_atb01.p2` 的 buffStart | rules C12、D21 |
| T2 | [汤汤]，初始技力 300；0.5 战技、1.6 连携、3 战技；分别跑潜能0 和潜能1 | 3 s 返还 kind=poison，数额 20（潜能1 为 25）；下一次战技的 spSpend.poison ≥ 返还量，全队回能 = 6.5×real/100 | C12；汤汤潜能1 原文 |
| T3 | [陈千语, 汤汤]；陈千语 0.5 s、3 s 各放一次战技 | 第一次命中后为 1 层（+8% 攻击），第二次命中后为 2 层（+16%）；之后的普攻面板 = 无增益面板按 +16% 重算 | 天赋原文“每次命中…最多 5 层” |
| T4 | 别礼装备 wpn_claym_0016（R9：每层 15.4%，3 层，独立计时 20 s）；战技在 0.5/4/8/12 s | 每次施放后的层数依次为 1、2、3、3；12 s 时顶掉 0.5 s 那一层；24 s 后剩 2 层 | 武器原文“每层单独计算持续时间” |
| T5 | 别礼+汤汤（潜能0/3），用第 2 条的顺序轴凑出 3 个水龙卷；另做一组 2 个水龙卷 | 3 个：目标脆弱合计 10%（潜能3 为 15%）；2 个：5%（潜能3 为 10%） | 汤汤战技参数表 |
| T6 | [别礼主控, 汤汤(能量满)]；汤汤 0.5 s 终结技，别礼 4 s 下落 | 水龙卷命中 factor=1，增伤区只含一次 tornadoBonus 60（潜能5 为 140）；ultimate3 一次，不结算 ultimate2；ultimateEnd 在 4 s 发出 | 天赋“呼风唤浪”原文 |
| T7 | 同 T6，但不下落；另一组改在 8 s 下落 | ultimate2 在 7.5 s 结算（3+4）；8 s 下落时没有 earlyWave | 古老图形持续 4 s；timing castSeconds.ultimate=3 |
| T8 | [别礼, 梨诺]，不放终结技 | 0 s 的命中不含梨诺任何终结技效果 | duringUltimate 定义 |
| T9 | [别礼, 梨诺]；梨诺 0.5 s 战技、2 s 终结技 | 2.25 s 以后，别礼的攻击附加里只有一条 10%（不是两条合计 20%） | 原文“高歌姿态代替演唱姿态” |
| T10 | [诀(潜能5, 智形态)]；0.5 s 终结技 | 终结技期间的命中，`talent1.int.artsAmp` = 40 | 诀潜能5 原文 |
| T11 | 佩丽卡装备四二式·肃阵，放战技；再换一名意志>智识的法术武器干员 | 佩丽卡触发 p2；后者不触发 p2/p3，满足条件时可以触发 p4/p5 | 武器原文“装备者智识值≥意志值” |
| T12 | 两人都穿拓荒，只有第二人“通过技能恢复技力”（例如处于导电时的弧光） | 拓荒触发，owner=第二人；全队只计一份 16% | 拓荒原文；D21 |
| T13 | [别礼(潜能1), 汤汤]，主控=汤汤；别礼 0.5 s 战技 | 汤汤消耗灌注的那一下主控重击吃到 +20%（或者追加一段 20%，看裁定结果）；此后的普攻不受影响。主控=别礼时同理 | 别礼潜能1 原文 |
| T14 | 别礼装备 wpn_claym_0003；0.5 s 战技 | 幻影追击命中的时刻（主控重击时）启动 p1 | 武器原文“战技命中敌人时” |
| T15 | 别礼穿长息，两次连携相隔约 13 s，每次消耗 3 层寒冷 | 长息的结束时刻 = 第二次连携时刻 + 15 s | 长息原文“施加…脆弱后” |
| T16 | 别礼装备 wpn_claym_0017，整场只施加寒冷脆弱 | p2 不触发 | 武器原文“施加物理脆弱时” |
| T17 | 祀 2 s 放终结技（演出暂停的口径裁定后再锁定） | 如果采纳“演出中计时暂停”：增幅在 17 s 结束 | timing.js:7 的假设 |
| T18 | 弭弗潜能3，两次连携相隔不到 45 s | `pot3.atk` 只启动一次 | 原文“每 45 秒最多一次” |
| T19 | 战技消耗实现以后：阿列什战技消耗 3 层寒冷 | 发出 `{on:'consume',by:'skill',elements:['cold'],layers:3}`；潜能1 触发。实现之前，覆盖表应把它标成 unmodeled | 阿列什战技、潜能1 原文 |
| T20 | 覆盖测试改进 | 资源区效果单独列为 `event-noop`；凡是 event 类效果，都要在至少一个合成场景里实际启动过（可达性回归），列表之外的必须显式豁免 | 第 16、21 条 |

以下算例已在打过补丁的临时副本上按上述输入跑过，结果与“期望”一栏一致：T1，T3–T5，T6（不含 ultimateEnd 时刻），T8–T10，T11（佩丽卡部分），T12（用陈千语+弧光），T13–T16，以及 T17（按采纳暂停口径）。T2 的潜能1 部分需要先实现第 17 条，T7 需要先补第 5 条的数据，T18–T20 需要先实现对应的功能，都还没有跑。

---

## 附录 A：复现脚手架

在仓库根目录新建一个临时 `.mjs` 文件，或者在 node REPL 里执行：

```js
import operators from './dist/data/operators.js'; import weapons from './dist/data/weapons.js'; import gear from './dist/data/gear.js';
import sets from './dist/data/sets.js'; import effects from './dist/data/effects.js'; import timing from './dist/data/timing.js'; import mechanics from './dist/data/mechanics.js';
import {simulate} from './dist/engine/sim/simulate.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n); const G=n=>gear.find(g=>g.name===n).id;
const mk=(name,{weapon,gearNames,pot=0,mode}={})=>({operatorId:op(name).id,potential:pot,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},
  weapon:weapon?{id:weapon,potential:5,ranks:[9,9,9]}:{id:null},gear:gearNames?Object.fromEntries(['armor','gloves','kit1','kit2'].map((s,i)=>[s,{id:G(gearNames[i]),refine:[3,3,3]}])):{},consumables:[],...(mode!=null?{mode}:{})});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
const run=(team,extra)=>simulate({team,data,mechanics,timing,enemy,mainControl:0,...extra});
// 例：第 3 条
const TUOHUANG=['拓荒护甲','拓荒纤维手套','拓荒通信器','拓荒增量供氧栓'];
const r=run([mk('别礼',{gearNames:TUOHUANG}),mk('汤汤')],{timeline:[{t:0.5,member:0,kind:'skill'}],params:{duration:3}});
console.log(r.events.filter(e=>e.type==='buffStart'&&e.id==='suit_atb01.p2'));   // 53192c9：0.5 s 出现 → 错误
// 例：第 1 条
const r2=run([mk('别礼'),mk('汤汤')],{initial:{sp:300,energy:[0,200]},timeline:[{t:0.5,member:1,kind:'ultimate'},{t:4,member:0,kind:'plunge'}],params:{duration:10}});
console.log(r2.hits.filter(h=>h.segment==='skill2').map(h=>[h.factor,h.factors.bonus]));   // 53192c9：[1.6, 1.6] → 双重加成
```
属性附加类效果（atkPct 等）不出现在 `hit.applied` 里，要看 `hit.factors.attack`。

## 附录 B：受影响效果清单
- **触发型叠层效果（第 4 条，共 25 条；标 * 的 19 条为独立计时）**：chr_0004_pelica.pot3.atk、chr_0005_chen.talent.edge、chr_0019_karin.pot1.atk、chr_0029_pograni.talent1.atk*、chr_0029_pograni.talent1.arts*、chr_0017_yvonne.ult.critRate、suit_attri01.p2、suit_atk02.p2、suit_combo_cd01.p2*、suit_spellburst.p2*、wpn_sword_0019.p2*、wpn_sword_0016.p2*、wpn_sword_0016.p3*、wpn_sword_0010.p2*、wpn_sword_0012.p2*、wpn_claym_0011.p2*、wpn_claym_0004.p2*、wpn_lance_0006.p2*、wpn_pistol_0006.p2*、wpn_pistol_0007.p2*、wpn_funnel_0017.p2*、wpn_claym_0016.p2*、wpn_funnel_0018.p2*、wpn_funnel_0018.p3*、wpn_funnel_0020.p2*。
- **触发了但在模拟里不起作用的资源区/其他区效果（第 21 条，共 25 条）**：chr_0026_lastrite.pot1.heavyPoise、chr_0018_dapan.pot5.extraBreak、chr_0024_deepfin.talent.freezeEnergy、chr_0024_deepfin.talent.freezeEnergyOwn、chr_0024_deepfin.pot1.spRefund、chr_0022_bounda.pot5.comboCdr、chr_0021_whiten.talent.shatterRefund、chr_0021_whiten.pot5.freezeEnergy、chr_0020_meurs.talent2.shockwave、chr_0020_meurs.pot1.extraHit、chr_0019_karin.talent2.combo、chr_0019_karin.pot5.comboExtend、chr_0015_lifeng.combo.comboState、chr_0017_yvonne.pot1.energy、chr_0017_yvonne.pot4.spRefund、chr_0030_zhuangfy.ult.comboCdSpeed、chr_0030_zhuangfy.ult.freeSkill、chr_0030_zhuangfy.pot1.extraSword、chr_0030_zhuangfy.pot5.resIgnore、chr_0032_lizhiyan.ult.int.corrosion、chr_0035_liino.talent2.spRefund、chr_0035_liino.pot1.spRefund、chr_0036_jsspsi.talent1.comboCd（:169 另有处理）、suit_usp01.p2、wpn_claym_0008.p2。

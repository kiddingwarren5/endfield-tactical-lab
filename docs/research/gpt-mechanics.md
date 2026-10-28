# 《明日方舟：终末地》战斗机制查证报告

研究范围：`docs/research-questions.md` 全部26题。检索截至 **2026年10月28日**，目标版本为 **v1.6**。

**证据说明：**

- **官方数据〔转录〕**：社区 Wiki 展示的游戏教学、技能描述和数据表。华法琳 Wiki 明确声明其为粉丝项目，不能把它等同于官方运营的网站。
- **玩家研究**：机制测试、数据解析、攻略及战斗日志。早期研究没有找到 v1.6 复测的，会保留版本限制。
- **实测视频**：本次部分 B 站页面只能读取标题、简介，未逐帧观看；不会把视频标题当成已验证的数值证据。
- **推测**：依据已知机制推导，尚未直接实测。
- **未确认**：证据不足、页面参数未解析，或不同来源存在冲突。

本次访问[森空岛官方 Wiki](https://wiki.skland.com/endfield)未取得可引用的正文；NGA 部分原帖访问受限。因此，以下主要采用游戏文本转录、研究者原文及授权镜像，并明确区分来源性质。

---

## A. 伤害公式

### 1. 单次伤害公式与乘区

**结论：普通攻击与技能直伤可以整理为以下框架，但不存在已经查证、能无条件覆盖所有特殊伤害的单一公式。**

\[
D=(A\times M+B)
\times C\times G\times E\times F\times V
\times L\times S\times Q_{\rm DEF}\times Q_{\rm RES}
\times Q_{\rm reduction}\times Q_{\rm special}
\]

其中：

| 项目 | 含义及合并规则 |
|---|---|
| \(A\) | 结算攻击力 |
| \(M\) | 本次命中的技能倍率；多段分别结算 |
| \(B\) | 技能明确规定的额外基础伤害；不能把“固定伤害”一概放进这里 |
| \(C\) | 未暴击为1；暴击为 \(1+\text{暴击伤害}\) |
| \(G\) | 增伤区：\(1+\sum适用伤害加成\) |
| \(E\) | 增幅区：\(1+\sum适用增幅\) |
| \(F\) | 脆弱区：\(1+\sum适用脆弱\) |
| \(V\) | 易伤区：\(1+\sum适用易伤\) |
| \(L\) | 连击效果，作用于符合条件的下一次战技或终结技 |
| \(S\) | 敌人失衡产生的承伤倍率 |
| \(Q_{\rm DEF},Q_{\rm RES}\) | 防御、抗性倍率，见第3题 |
| \(Q_{\rm reduction}\) | 减免、虚弱、庇护等各自规则 |
| \(Q_{\rm special}\) | 技能独立倍率、特定目标机制等 |

**不同乘区相乘；同一加成区通常加算，但必须先执行“不叠加、取最高、层数上限”等效果自身规则。** 普攻增伤、对应元素增伤、全伤害加成，满足条件时通常进入同一个增伤区。

减益不能全部做成一个加算池：研究资料把伤害减免、虚弱、庇护分别处理；庇护取有效效果中的最大值。

源石技艺强度与异常等级**不普遍乘在普通元素技能伤害上**，其适用范围见第5、6题。

**来源类别：玩家研究。** [灰机 Wiki：伤害](https://endfield.huijiwiki.com/wiki/伤害)、[NagiYume：终末地数据导论](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md)。

**未确认：** v1.6 全部特殊伤害——尤其伤害记录后再次结算、固定伤害、召唤物继承——是否遵循相同流程。需要逐技能配置或控制变量测试。

### 2. 默认暴击率、暴击倍率与暴伤属性

- 通常干员基础暴击率为 **5%**。
- 基础暴击伤害为 **50%**，因此暴击造成 **1.5倍**伤害。
- 存在暴击伤害属性；不能把“暴击伤害50%”解释为总倍率0.5。
- 数据表中的底层属性默认值与干员最终基础面板不是同一概念，例如底层 `CriticalRate` 默认0，并不能推翻干员面板的5%。

**来源类别：玩家研究／官方数据〔社区数据表转录〕。** [伤害机制研究](https://www.gamekee.com/zmd/691878.html)、[BWIKI：数值范围](https://wiki.biligame.com/zmd/数值范围)。

### 3. 防御公式、敌人防御、抗性评级与负抗性

防御非负时：

\[
Q_{\rm DEF}=\frac{100}{100+\mathrm{DEF}_{有效}}
\]

例如防御100对应伤害倍率0.5，防御300对应0.25。

[罗丹](https://warfarin.wiki/cn/enemies/eny_0051_rodin)与[碾骨劫掠者](https://warfarin.wiki/cn/enemies/eny_0029_lbmob)的基础数据均有 **100防御**。但阶段机制、区域词条等可能改变防御，不能推广为“所有敌人始终100防御”。

抗性的一般结算为：

\[
Q_{\rm RES}=1-\frac{\mathrm{有效抗性}}{100}
\]

| 评级 | 查到的对应数据 | 判断 |
|---|---:|---|
| D | 0 | 有资料支持 |
| C | 常见20；也有30仍显示C的研究记录 | 不能把C唯一映射成20 |
| B | 常见50 | 有资料支持，完整区间未确认 |
| A | 未确认 | 缺评级阈值表及当前敌人原始数据 |
| S | 未确认 | 同上 |

**有效负抗性存在于玩家研究的结算模型中**；例如有效抗性降至−20，倍率为1.2。没有找到“负抗性收益减半”的依据。

**来源类别：官方数据〔敌人数据转录〕、玩家研究。** [灰机：伤害](https://endfield.huijiwiki.com/wiki/伤害)、[666bj机制研究授权镜像](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)。

**未确认：** A/S完整映射、负抗性下限，以及上述旧研究在v1.6的边界复测。

### 4. 脆弱、易伤、增幅与增伤的区别

| 名称 | 典型来源 | 归属 |
|---|---|---|
| 脆弱 | 寒冷脆弱、法术脆弱、物理脆弱 | 脆弱区 |
| 易伤 | 导电的法术承伤增加、碎甲的物理承伤增加 | 易伤区 |
| 增幅 | 明确标记为寒冷增幅、灼热增幅、法术增幅等 | 增幅区 |
| 增伤 | 全伤害、元素伤害、战技伤害、对失衡目标伤害等加成 | 对应条件下的增伤区 |

**祀终结技明确提供寒冷增幅与灼热增幅**，应进入增幅区。长息套装的“伤害提升”属于增伤，不能因为同为百分比就与祀的增幅相加。

寒冷伤害同时满足“寒冷脆弱”和“法术脆弱”的类型条件；是否能同时生效，还需检查具体效果的叠加限制。

**来源类别：官方数据〔转录〕、玩家研究。** [祀](https://warfarin.wiki/cn/operators/si)、[别礼](https://warfarin.wiki/cn/operators/last-rite)、[长息轻护甲](https://warfarin.wiki/cn/gear/item_equip_t4_suit_usp02_body_01)、[伤害乘区说明](https://endfield.huijiwiki.com/wiki/伤害)。

### 5. 机制伤害倍率、异常等级、等级系数、暴击与归属

以下是查到的**玩家研究数值**，不等同于官方公布的完整公式，也未找到全部项目的v1.6重新实测。

令：

- \(n\)：触发时消耗的附着或破防层数，通常为1～4。
- \(l\)：反应触发者等级。
- 法术等级系数：\(K_a=1+(l-1)/196\)。
- 物理等级系数：\(K_p=1+(l-1)/392\)。

90级时，分别约为 **1.45408**、**1.22704**。

| 机制 | 基础攻击倍率，不含等级系数及其他乘区 | 附带效果／说明 |
|---|---:|---|
| 同属性法术爆发 | 160% | 不随现有附着层数线性增加 |
| 燃烧初始伤害 | \(80\%(1+n)\) | 1～4级为160/240/320/400% |
| 燃烧持续伤害 | 每秒 \(12\%(1+n)\) | 24/36/48/60%，通常持续10秒 |
| 导电初始伤害 | \(80\%(1+n)\) | 法术易伤12/16/20/24%；持续12/18/24/30秒 |
| 腐蚀初始伤害 | \(80\%(1+n)\) | 全属性减抗逐渐增加 |
| 冻结初始伤害 | \(80\%(1+n)\) | 普通可冻结敌人的基础持续时间6/7/8/9秒 |
| 碎冰 | \(120\%(1+n)\) | 240/360/480/600%；物理伤害，但研究使用法术等级系数 |
| 击飞、倒地 | 120% | 使用物理等级系数；另有失衡与破防效果 |
| 猛击 | \(150\%(1+n)\) | 300/450/600/750%，使用物理等级系数 |
| 碎甲 | \(50\%(1+n)\) | 100/150/200/250%；物理易伤12/16/20/24%，持续12/18/24/30秒 |

腐蚀的研究数据：

| 异常等级 | 初始减抗 | 每秒增加 | 10秒后上限 |
|---|---:|---:|---:|
| 1 | 3.6个百分点 | 0.84个百分点 | 12个百分点 |
| 2 | 4.8个百分点 | 1.12个百分点 | 16个百分点 |
| 3 | 6个百分点 | 1.4个百分点 | 20个百分点 |
| 4 | 7.2个百分点 | 1.68个百分点 | 24个百分点 |

基础持续时间为15秒。**强制施加异常**可能只有状态，没有上述反应初始伤害，必须按技能描述分别处理。

其他判断：

- 机制伤害吃适用的伤害类型增伤、防御、抗性等乘区；不能自动视为触发它的战技伤害。
- 即时异常伤害的研究公式包含暴击区；燃烧持续伤害不暴击。
- 一般按**触发反应者**的攻击力、等级、技艺强度结算；碎冰归属打碎冻结的干员，而非施加冻结者。
- 特殊技能对异常的覆盖、继承或强制施加，要单独验证。

**来源类别：玩家研究。** [GameKee机制研究](https://www.gamekee.com/zmd/691878.html)、[灰机：异常状态](https://endfield.huijiwiki.com/wiki/异常状态)、[666bj机制研究及后续修订](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)。

**未确认：** v1.6逐项暴击测试、持续伤害快照/动态更新、多人同时触发时的精确归属顺序。缺少当前版本控制变量录像或配置对应。

### 6. 源石技艺强度具体加成什么

令技艺强度为 \(s\)，研究给出的主要效果为：

| 对象 | 加成 |
|---|---|
| 法术爆发、法术异常伤害、物理异常伤害 | 乘以 \(1+s/100\) |
| 击飞、倒地附带的异常失衡效果 | 研究系数为 \(1+0.005s\) |
| 导电、碎甲、腐蚀的易伤／减抗效果 | 乘以 \(1+\frac{2s}{s+300}\) |
| 普通元素普攻、普通元素技能直伤 | 不因“属于法术伤害”就自动获得加成 |
| 异常持续时间 | 未找到通用加成依据 |

因此，**技艺强度不是通用法伤加成**，也不能只理解成“元素反应伤害加成”，因为它还影响部分物理异常。

**来源类别：玩家研究／社区数据解析。** [666bj机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)、[BWIKI数值范围中的异常增益属性](https://wiki.biligame.com/zmd/数值范围)。

### 7. 数值取整与截断

**结论：存在隐藏小数，显示值不能直接当作全部内部结算值。**

- 装备属性可保留小数，界面显示整数；例如精锻后的数值不一定等于“显示值×1.1后四舍五入”。
- 玩家研究指出，部分能力值在派生攻击力、抗性、生命值等计算时会取整。
- 面板攻击显示与内部属性修改流程不能混为一谈。
- **伤害跳字究竟统一向下取整、四舍五入，还是不同伤害路径分别处理：未确认。** 检索到的资料在文字与例子之间存在矛盾。

**来源类别：玩家研究。** [数据机制导论](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)、[底层属性修改流程解析](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md)。

缺少证据：构造小数部分跨越0.5的伤害样本，比较实际扣血与跳字，逐结算阶段反推。

---

## B. 属性与攻击力

### 8. 面板攻击力公式及固定攻击力的位置

常见计算器采用的简化式为：

\[
A\approx
\left[(A_{\rm 角色基础}+A_{\rm 武器基础})(1+\sum攻击力\%)+A_{\rm 固定}\right]
(1+0.005P+0.002S)
\]

其中 \(P\) 为主能力，\(S\) 为副能力。

**主能力每点0.5%、副能力每点0.2%的换算有研究支持。**

但这只能作为简化模型。底层解析存在多级 `baseAddition`、`baseFinalAddition`、`addition`、`finalAddition` 等修饰阶段。**“装备固定攻击”和“食物固定攻击”是否必定落在同一位置，未确认。** 仅凭中文“攻击力+100”不能决定它是否吃攻击力百分比。

**来源类别：玩家研究。** [机制导论](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)、[属性修饰器解析](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据导论.md)。

缺少证据：对应装备和食物的属性修饰字段，或装备/卸下攻击百分比来源后的面板对照。

### 9. 四种能力、全能力与主能力百分比

| 能力 | 通用效果 |
|---|---|
| 力量 | 每点增加5点生命值 |
| 敏捷 | 提供物理抗性，研究公式 \(100-100/(1+0.001\times敏捷)\) |
| 智识 | 提供法术抗性，形式与敏捷相同 |
| 意志 | 每点增加0.1%受治疗效果 |

主、副能力由**具体干员**指定，不是单凭职业固定。例如黎风为敏捷/力量，狼卫为力量/敏捷，佩丽卡为智识/意志。

- **全能力+15**：力量、敏捷、智识、意志分别+15。
- 不计额外天赋，其主副能力攻击系数合计增加 \(15×0.5\%+15×0.2\%=10.5\) 个百分点。
- **主能力+百分比**：先改变该干员的主能力数值，再进入攻击换算；不是等量攻击力百分比。
- 黎风等干员另有能力转攻击天赋，必须额外计入。

**来源类别：玩家研究、官方数据〔转录〕。** [能力研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)、[黎风](https://warfarin.wiki/cn/operators/lifeng)、[狼卫](https://warfarin.wiki/cn/operators/wulfgard)、[佩丽卡](https://warfarin.wiki/cn/operators/perlica)。

**未确认：** 所有“主能力%”来源在底层是否采用完全相同的加算基底。

### 10. 终结技充能效率

普通可加成能量来源可表达为：

\[
\Delta U=\Delta U_{\rm 基础}\times(1+\sum充能效率加成)
\]

- 普通战技耗用真实技力带来的能量、连携技自身能量，是主要适用来源。
- 普通普攻命中、普通受击，不是全干员共有的终结技能量来源。
- 特殊天赋可以例外：例如昼雪成功格挡后额外获得能量。
- **不能认为所有来源都吃充能效率。** 管理员特定潜能的结晶回能明确写有“无法被加成”。
- 标准充能效率加成按同属性加算理解；**硬上限未确认**，查到的属性表未提供可据此认定的上限。

**来源类别：官方数据〔转录〕、玩家研究。** [终结技教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_ultimite_skill)、[管理员](https://warfarin.wiki/cn/operators/endministrator)、[昼雪](https://warfarin.wiki/cn/operators/snowshine)、[数值范围](https://wiki.biligame.com/zmd/数值范围)。

---

## C. 资源与技能系统

### 11. 技力上限、初始值、普攻与闪避回复

**队伍共享技力上限是300，通常脱战稳定值为200。不能把200写成上限。**

玩家研究记录：

- 战斗中自然恢复约 **8点/秒**。
- 普攻不是每段固定回技力；主要由**主控重击**回复。
- 重击回技力数值按干员区分，不能只按武器种类套一个常量。
- 精准闪避约回复 **7.5点**；研究还记录了短暂自然回复停顿。
- 普通受击没有查到通用的技力回复规则。

早期研究的重击回复样本：管理员20、狼卫18、佩丽卡15、黎风21、别礼30。**这些是技力回复数值，不能与技能页面的“重击失衡值”混用。**

**来源类别：玩家研究。** [666bj资源机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)。共享三格、普通战技消耗一格亦见[新手战斗指南](https://www.gamersky.com/handbook/202601/2079602.shtml)。

**未确认：** v1.6所有新干员重击回技力表，以及精准闪避小数值的当前版本复测。关卡词条也可能修改自然恢复。

### 12. 返还技力／假技力

**结论：返还技力与正常恢复技力需要分开记账。**

- 返还部分会被**优先消耗**。
- 消耗返还部分，不产生通常的“消耗技力→全队终结技能量”收益。
- 不能将先锋的“恢复技力”一律归为返还技力。

玩家测试举例：一次100技力战技中若有50点来自返还技力，普通全队回能为：

\[
6.5\times50/100=3.25
\]

而非6.5。

已核到的返还来源包括：

| 来源 | 数值／条件 |
|---|---|
| 别礼战技 | 返还30；潜能1额外+5 |
| 管理员潜能1 | 对应结晶消耗条件下返还50 |
| 昼雪潜能5 | 战技成功反击后返还10 |
| 卡契尔潜能5 | 有护盾时，战技命中后返还10 |
| 汤汤、诀部分技能 | 有返还机制，需按技能分支、等级及条件建模 |

**来源类别：玩家研究、官方数据〔转录〕。** [巴哈姆特实际回能测试](https://forum.gamer.com.tw/Co.php?bsn=74604&sn=19507)、[别礼](https://warfarin.wiki/cn/operators/last-rite)、[管理员](https://warfarin.wiki/cn/operators/endministrator)、[昼雪](https://warfarin.wiki/cn/operators/snowshine)、[卡契尔](https://warfarin.wiki/cn/operators/catcher)、[汤汤](https://warfarin.wiki/cn/operators/tangtang)、[诀](https://warfarin.wiki/cn/operators/arcane)。

**未确认：** 全部返还来源的穷举，以及所有特殊战技对真假技力的处理是否完全相同。

### 13. 终结技能量获取、各干员需求与溢出

通用教学确认：

- 施放战技，全队获得终结技能量。
- 施放连携技，施放者自己获得终结技能量。
- 施放终结技消耗全部能量。
- 部分强化状态期间不能获得能量。

玩家研究的普通战技基准是：**消耗100点真实技力，全队各获得6.5点基础能量**。连携不能统一写成10点，角色存在明显例外。

| 来源／干员 | 查到的基础能量 |
|---|---:|
| 多数普通连携 | 10 |
| 弧光连携 | 5 |
| 梨诺连携 | 20 |
| 洛茜连携 | 分段各10 |
| 别礼战技 | 自身16 |
| 别礼连携 | \(40+15n\)，消耗4层时100 |
| 莱万汀连携 | 随命中敌人数为25/30/35 |
| 莱万汀战技特定条件 | 额外100 |

**别礼只从自身战技、连携技获得能量**，不能给她套普通全队6.5回能。提弗洛斯又有强化空中攻击相关回能，因此“所有普攻绝不回能”也过于绝对。

下表为当前页面列出的**基础终结技能量需求**，未扣潜能或其他效果：

| 需求 | 干员及来源 |
|---:|---|
| 70 | [陈千语](https://warfarin.wiki/cn/operators/chen-qianyu)、[埃特拉](https://warfarin.wiki/cn/operators/estella) |
| 80 | [祀](https://warfarin.wiki/cn/operators/si)、[管理员](https://warfarin.wiki/cn/operators/endministrator)、[弭弗](https://warfarin.wiki/cn/operators/mifu)、[昼雪](https://warfarin.wiki/cn/operators/snowshine)、[赛希](https://warfarin.wiki/cn/operators/xaihi)、[佩丽卡](https://warfarin.wiki/cn/operators/perlica)、[卡契尔](https://warfarin.wiki/cn/operators/catcher) |
| 90 | [黎风](https://warfarin.wiki/cn/operators/lifeng)、[洁尔佩塔](https://warfarin.wiki/cn/operators/gilberta)、[艾尔黛拉](https://warfarin.wiki/cn/operators/ardelia)、[汤汤](https://warfarin.wiki/cn/operators/tangtang)、[骏卫](https://warfarin.wiki/cn/operators/pogranichnik)、[狼卫](https://warfarin.wiki/cn/operators/wulfgard)、[弧光](https://warfarin.wiki/cn/operators/arclight)、[大潘](https://warfarin.wiki/cn/operators/da-pan) |
| 100 | [余烬](https://warfarin.wiki/cn/operators/ember)、[诀](https://warfarin.wiki/cn/operators/arcane)、[噗切娜](https://warfarin.wiki/cn/operators/purrchena)、[阿列什](https://warfarin.wiki/cn/operators/alesh)、[艾维文娜](https://warfarin.wiki/cn/operators/avywenna)、[安塔尔](https://warfarin.wiki/cn/operators/antal)、[萤石](https://warfarin.wiki/cn/operators/fluorite) |
| 110 | [洛茜](https://warfarin.wiki/cn/operators/rossi) |
| 120 | [秋栗](https://warfarin.wiki/cn/operators/akekuri) |
| 130 | [卡缪](https://warfarin.wiki/cn/operators/camille) |
| 160 | [梨诺](https://warfarin.wiki/cn/operators/liino) |
| 200 | [提弗洛斯](https://warfarin.wiki/cn/operators/typhoeus) |
| 220 | [伊冯](https://warfarin.wiki/cn/operators/yvonne) |
| 240 | [别礼](https://warfarin.wiki/cn/operators/last-rite)、[庄方宜](https://warfarin.wiki/cn/operators/zhuang-fangyi) |
| 300 | [莱万汀](https://warfarin.wiki/cn/operators/laevatain) |

**来源类别：官方数据〔上述干员页与教学转录〕、玩家研究。** [终结技教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_ultimite_skill)、[真实技力回能测试](https://forum.gamer.com.tw/Co.php?bsn=74604&sn=19507)。

**未确认：** 是否存在隐藏溢出储存及其边界。本次没有找到支持“满能量后继续保存额外能量供下一轮使用”的可靠证据；模拟器不应默认提供这种功能。

### 14. 连携触发条件、窗口、冷却与切主控

连携条件按干员独立定义，例如：

| 干员 | 触发条件 | 基础冷却→专精3 |
|---|---|---:|
| 狼卫 | 敌人被施加法术附着 | 20→19秒 |
| 佩丽卡 | 主控干员造成重击 | 20→19秒 |
| 别礼 | 敌人进入至少3层寒冷附着 | 9→8秒 |
| 祀 | 寒冷或灼热附着被消耗／吸收 | 16→15秒 |
| 管理员 | 其他队员连携造成伤害 | 16→15秒 |

早期教程攻略记录通常有 **5秒可发动窗口**。冷却、触发窗口、状态持续时间是三个不同计时器。

多个角色可以分别满足条件，不存在已查证的“全队只有一次公共连携名额”。但是否保留旧目标、切主控是否改变已亮起的提示、同一帧触发顺序，**未确认**，需要操作录像。

“主控”与“编队01号位”也必须区别：祀部分效果明确读取01号位，不能随切主控自动替换。

**来源类别：官方数据〔转录〕、玩家研究。** [狼卫](https://warfarin.wiki/cn/operators/wulfgard)、[佩丽卡](https://warfarin.wiki/cn/operators/perlica)、[别礼](https://warfarin.wiki/cn/operators/last-rite)、[祀](https://warfarin.wiki/cn/operators/si)、[连携窗口说明](https://www.gamersky.com/handbook/202601/2079602.shtml)。

### 15. 战技冷却、消耗与多段施放

- 普通战技通常消耗 **100技力**。
- 通常没有类似连携的独立长冷却；动画、角色状态和动作衔接仍限制施放。
- 多段或替换型战技必须逐段读取消耗，不能每次按键都扣100。

明确例子：**祀战技初次100，替换为“起墨”后消耗15，再替换为“收笔”后消耗0。**

**来源类别：官方数据〔转录〕、玩家研究。** [祀技能表](https://warfarin.wiki/cn/operators/si)、[普通战技规则](https://www.gamersky.com/handbook/202601/2079602.shtml)。

**未确认：** 所有战技的动作锁、取消窗口、最短连续施放间隔；需要逐角色逐帧数据。

### 16. 法术附着、互斥、法术爆发与异常等级

**官方教学转录明确：**

- 常规法术附着最多 **4层**。
- 已有同属性附着，再施加同属性附着，会触发对应**法术爆发**。
- 不需要等到4层才爆发。
- 已有其他属性附着，再施加新属性，会触发由后施加属性决定的异常：
  - 灼热→燃烧；
  - 电磁→导电；
  - 寒冷→冻结；
  - 自然→腐蚀。
- 常规不同属性附着不是四套独立层数并存；反应会消耗原附着。
- 异常等级等于消耗的附着或破防层数，最高4级。

需要区分“附着”和“异常状态”：已有燃烧等状态，并不意味着不能再施加附着。

**来源类别：官方数据〔教学转录〕。** [灼热附着](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_fire)、[自然附着](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_nature)、[异常等级](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_statuslevel)。

**未确认：** 常规敌人附着的统一自然消退时间、刷新计时方式。不能拿燃烧10秒、冻结持续时间代替附着持续时间。

### 17. 主控与非主控

**非主控干员会自动攻击。** 官方更新说明中有对非主控狼卫普攻表现的修复，可以直接支持这一点。

但以下数值**未确认**：

- 非主控普攻是否统一乘固定输出衰减；
- 若存在衰减，具体比例；
- 自动攻击频率、停顿及是否完整执行攻击串；
- 全部角色是否采用同一AI规则。

尤其不能把“非主控受到的伤害减少”解释为“非主控造成的伤害减少”。

资源方面：

- 主控重击是一般技力回复路径，不能默认所有AI普攻都按主控重击回技力。
- 非主控仍能获得符合条件的战技全队回能、自己的连携回能。
- 特殊干员限制仍然适用，例如别礼。

**来源类别：官方数据、官方数据〔转录〕。** [官方“春晓时”更新说明](https://www.bilibili.com/opus/1192064737057177641)、[终结技教学](https://warfarin.wiki/cn/tutorials/wiki_tut_bat_ultimite_skill)。

### 18. 普攻攻击串、重击、下落攻击与处决

**普攻段数由干员决定，不能按武器类型固定。** 下列为技能Rank1页面倍率：

| 武器／干员 | 段数 | 逐段倍率 |
|---|---:|---|
| 单手剑／管理员 | 5 | 23%、27%、30%、35%、40% |
| 单手剑／弧光 | 5 | 10%、13%、26%、36%、48% |
| 双手剑／别礼 | 4 | 30%、55%、68%、90% |
| 双手剑／昼雪 | 3 | 55%、59%、100% |
| 长柄武器／黎风 | 4 | 24%、29%、35%、68% |
| 手铳／狼卫 | 4 | 30%、35%、56%、68% |
| 法术单元／佩丽卡 | 4 | 25%、30%、37%、57% |

这些是技能表“段倍率”，不意味着每段只有一个命中事件。多弹、多斩、协同攻击的逐命中拆分，需要额外配置。

- 重击通常是完整普通攻击串的末段，不能统一定义为“蓄力攻击”或“第四段”。
- 空中使用普攻触发下落攻击。
- 附近敌人**失衡**时普攻触发处决；“倒地”不等同于“失衡”。
- 上述样本下落攻击为Rank1的80%、专精3的180%；处决为400%→900%，伤害类型随角色而异。

**来源类别：官方数据〔转录〕。** [管理员](https://warfarin.wiki/cn/operators/endministrator)、[弧光](https://warfarin.wiki/cn/operators/arclight)、[别礼](https://warfarin.wiki/cn/operators/last-rite)、[昼雪](https://warfarin.wiki/cn/operators/snowshine)、[黎风](https://warfarin.wiki/cn/operators/lifeng)、[狼卫](https://warfarin.wiki/cn/operators/wulfgard)、[佩丽卡](https://warfarin.wiki/cn/operators/perlica)。

### 19. 失衡机制与窗口

- 重击、技能等积累失衡值，到达阈值使敌人失衡；部分敌人有中间失衡节点。
- 上限与失衡持续时间属于**敌人参数**，不能统一写成固定秒数。
- 玩家研究常用基础失衡承伤倍率 **1.3**。
- “对失衡目标伤害+X%”是角色条件增伤，应与基础失衡承伤倍率分开。

例如佩丽卡天赋对失衡目标伤害+20%，升级后+30%，不能直接把基础1.3改成1.6而忽略其他增伤。

旧研究记录过普通敌人6秒、罗丹10秒等样本；**这些具体窗口是否在v1.6所有模式保持不变，未确认**。同名Boss的不同关卡、阶段也应分别记录。

**来源类别：玩家研究、官方数据〔转录〕。** [失衡机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)、[佩丽卡天赋](https://warfarin.wiki/cn/operators/perlica)。

---

## D. 装备与武器

### 20. 装备精锻规则

已核到的常见规律是：每条可精锻属性独立0～3级，对应原始数值约：

\[
1,\quad1.1,\quad1.2,\quad1.3
\]

**不是每级乘1.1的复利。** 应从原始隐藏精度计算，再按显示规则处理。

长息轻护甲样本：

| 属性 | 0级 | 1级 | 2级 | 3级 |
|---|---:|---:|---:|---:|
| 意志 | 87 | 95 | 104 | 113 |
| 智识 | 58 | 63 | 69 | 75 |
| 技艺强度 | 20 | 22 | 24 | 26 |
| 护甲防御 | 56 | 56 | 56 | 56 |

充能效率等百分比属性也可以精锻。长息配件数据中有 **24.64%、27.11%、29.57%、32.04%** 的成长列。

只有两条可精锻属性的装备，应只记录实际存在的两条；不能为统一界面伪造第三条。

**来源类别：官方数据〔社区转录〕。** [长息轻护甲](https://warfarin.wiki/cn/gear/item_equip_t4_suit_usp02_body_01)、[长息配件精确数值表](https://end.canmoe.com/zh-CN/wiki/equipment/item_equip_t4_suit_usp02_edc_03)。

**未确认：** 是否所有特殊装备都严格使用同一线性规则；缺少全装备原始表核对。

### 21. 套装件数、长息与多人叠加

查到的标准套装机制是 **3件激活**；没有支持“通用2件小效果＋3件大效果”的依据。

长息当前页面效果为：

- 装备者生命值+1000。
- 装备者施加增幅、庇护、脆弱或虚弱后，使**其他队员伤害+16%，持续15秒**。
- 同名效果不可叠加。

因此多人穿长息不能直接算成32%、48%。但“不可叠加”只证明不能相加，**不自动证明它始终取最高值，也不证明重触发如何刷新持续时间**；这些覆盖细节未确认。

**来源类别：官方数据〔转录〕。** [长息套装文本](https://warfarin.wiki/cn/gear/item_equip_t4_suit_usp02_body_01)。[近期实战日志](https://zmdlogs.com/battle/btl_upload_c9aa96638f80?metric=dps)也显示长息增伤为16%，来源类别为玩家实战记录。

### 22. 武器潜能、基质与技能等级

**“0潜=Rank4”不是无条件规则。**

第三技能通常可按以下方式理解：

\[
R_3=1+\text{潜能增加等级}+\text{匹配基质增加等级}
\]

潜能最高额外增加5级，第三词条基质最高增加3级。因此：

| 配置 | 第三技能等级 |
|---|---:|
| 0潜、无基质加级 | 1 |
| 0潜、匹配基质+3 | 4 |
| 满潜、无基质加级 | 6 |
| 满潜、匹配基质+3 | 9 |

前两条属性与第三条的成长来源不同：武器培养后自身通常达到3级，再由匹配基质最高+6，达到9级。基质只有**对应词条匹配**才加级，不能把“基质总等级”同时加到所有技能上。

**来源类别：玩家研究、官方数据〔技能成长表转录〕。** [基质系统详解](https://www.gamersky.com/handbook/202602/2092299.shtml)、[联结点技能等级表](https://wiki.biligame.com/zmd/联结点)。

### 23. 配件能否重复装备

**可以在两个配件槽装备同名配件的两个实例。** 不等于同一个物品实例占两个槽。

近期实战记录中，汤汤同时装备两件“碾骨面具·贰型”，可作为实际配装证据。

**来源类别：玩家研究／玩家实战记录。** [装备养成说明](https://www.gamersky.com/handbook/202601/2076722.shtml)、[双同名配件实战记录](https://zmdlogs.com/battle/btl_upload_c9aa96638f80?metric=dps)。

---

## E. 食物与药剂

### 24. 战斗相关食物、药剂、持续时间与覆盖规则

**本题只能部分确认。** 已核到下列具体物品及描述，但“所有模式均可在战斗中手动使用”“全部同类覆盖关系”“全物品无遗漏清单”均缺少完整证据。需要区分背包消耗品与装备后按条件自动使用的战术物品。

下表来源类别均为 **官方数据〔华法琳物品描述转录〕**；每个名称直接链接对应数据页。

#### 输出、能力与充能增益

以下页面列出的增益持续时间均为 **300秒**。

| 物品 | 效果 |
|---|---|
| [附术铁瓶](https://warfarin.wiki/cn/items/item_bottled_insec2_2) | 全伤害+25% |
| [意乱药剂](https://warfarin.wiki/cn/items/item_bottled_moss_1_2_1) | 终结技充能效率+24% |
| [塞什卡风肉排](https://warfarin.wiki/cn/items/item_lbmob_1_dog_1_moss_1_1) | 全能力+15 |
| [开工日肉汤](https://warfarin.wiki/cn/items/item_mimicw_1_moss_1_moss_2_1) | 攻击力+12% |
| [可食用巢雕](https://warfarin.wiki/cn/items/item_firebat_1_agrange_1_1) | 攻击力+7%、暴击率+3%、全伤害+7% |
| [约翰老爹汉堡](https://warfarin.wiki/cn/items/item_lbshield_1_slimeml_1_dog_1_1) | 物理伤害+21% |
| [竹笋炒肉](https://warfarin.wiki/cn/items/item_hsmob_1_dog_1_1) | 充能效率+21%、受治疗效果+35% |
| [小糖画](https://warfarin.wiki/cn/items/item_wgshoal_1_grass_1_grass_2_1) | 攻击力+18%、暴击率+9% |
| [雅各布的遗产](https://warfarin.wiki/cn/items/item_agrange_1_erhound_1_sp_1_1) | 攻击力+27% |
| [正本补元汤剂](https://warfarin.wiki/cn/items/item_corp3_grass1_1) | 暴击率+9%、全伤害+18% |
| [清炖息壤球](https://warfarin.wiki/cn/items/item_hsfly_1_slimeml_1_hsmob_1_1) | 暴击率+21% |
| [陈皮拌笋](https://warfarin.wiki/cn/items/item_jzmonk_1_hsmob_1_1) | 暴击率+25%；附带防御下降，下降数值未解析 |
| [蓄石秘剂](https://warfarin.wiki/cn/items/item_klcreatures_1_wgthorns_1_1) | 充能效率+49% |
| [酥麻炸虫蛹](https://warfarin.wiki/cn/items/item_inkkirin_1_hscrane_1_1) | 攻击力+12%、暴击率+6%、全伤害+12% |
| [大碗碎茶](https://warfarin.wiki/cn/items/item_inn_drink_1) | 全伤害+13% |
| [玉米汁](https://warfarin.wiki/cn/items/item_inn_drink_3) | 暴击率+9% |
| [瓶装脆蔗汁](https://warfarin.wiki/cn/items/item_inn_drink_4) | 充能效率+21% |
| [梨花香茶](https://warfarin.wiki/cn/items/item_inn_drink_5) | 全能力+27 |
| [游人酒](https://warfarin.wiki/cn/items/item_inn_drink_6) | 暴击率+14%；防御下降数值未解析 |
| [陈酿葡萄露](https://warfarin.wiki/cn/items/item_inn_drink_8) | 物理伤害+33% |
| [瓶装霞莓饮](https://warfarin.wiki/cn/items/item_inn_drink_10) | 攻击力+29% |

**固定攻击力食物存在来源冲突：**

[清炖兽排参须汤](https://warfarin.wiki/cn/items/item_corp3_animal_1)的当前华法琳页面为**攻击力+180、暴击率+11%**，检索到的旧BWIKI资料为**+200、+13%**。因此，本报告把当前精确数值判为 **未确认**；需要v1.6游戏内截图或更新说明裁定。

#### 防御、治疗及尚未解析的增益

以下也是300秒增益；“未解析”不是0。

| 物品 | 查到的效果 |
|---|---|
| [瓶装兽奶](https://warfarin.wiki/cn/items/item_inn_drink_2) | 防御力+19% |
| [手工怪味酸糖](https://warfarin.wiki/cn/items/item_agrange_1_moss_2_lbmob_1_1) | 防御力+18% |
| [爆辣焗烤源石虫](https://warfarin.wiki/cn/items/item_agmelee_1_sp_2_slimeml_1_1) | 防御力+30% |
| [武陵炒饭](https://warfarin.wiki/cn/items/item_corp4_animal_1) | 防御力+68% |
| [神秘气泡饮料](https://warfarin.wiki/cn/items/item_wgslime_1_wgthorns_1_1) | 防御力+18%、治疗效果+12%；减伤数值未解析 |
| [洗灾秘剂](https://warfarin.wiki/cn/items/item_klbuds_1_hsfly_1_1) | 防御力+31%；减伤数值未解析 |
| [武陵乱炒](https://warfarin.wiki/cn/items/item_hshog_1_hsmob_1_slimeml_1_1) | 防御力+43；减伤数值未解析 |
| [瓶装优质兽奶](https://warfarin.wiki/cn/items/item_inn_drink_7)、[回响秘剂](https://warfarin.wiki/cn/items/item_ethillu_1_wgslime_1_wgthorns_1_1) | 连携冷却相关效果，精确数值未确认 |
| [雾火之花](https://warfarin.wiki/cn/items/item_erhound_1_agmelee_1_moss_1_1)、[油爆双脆](https://warfarin.wiki/cn/items/item_wgthorns_1_hshog_1_hsmob_1_1)、[潮前龙井](https://warfarin.wiki/cn/items/item_inn_drink_9)、[简易镇痛药膏](https://warfarin.wiki/cn/items/item_agrange_1_lbshamman_bottled_1) | 减伤相关效果，精确数值未确认 |

#### 即时终结技能量与复活

| 物品 | 效果 |
|---|---|
| [炖肉会议](https://warfarin.wiki/cn/items/item_dog_1_slimeml_1_1) | 自身恢复20%终结技能量 |
| [小蜜虫布丁](https://warfarin.wiki/cn/items/item_slimeml_1_agrange_1_moss_2_1) | 全队恢复8%终结技能量 |
| [草本清凉饮](https://warfarin.wiki/cn/items/item_inkbiter_1_wgshoal_1_1) | 自身恢复40%终结技能量 |
| [罗德岛特制口粮](https://warfarin.wiki/cn/items/item_corp4_spc) | 自身恢复40%终结技能量 |
| [刻术瓶](https://warfarin.wiki/cn/items/item_bottled_insec1_1) | 复活目标并恢复10%生命 |
| [刻术铁瓶](https://warfarin.wiki/cn/items/item_bottled_insec1_2) | 复活目标并恢复30%生命 |

回能战术物品描述包含低于50%能量时自动使用、不能获得能量时不自动使用等条件。因此不能直接用于绕开别礼的回能限制。**百分比回能是否再乘充能效率，未确认。**

没有查到可可靠确认为“直接恢复共享技力”的食物或药剂，不能把上述终结技能量食物记成技力食物。

#### 治疗类补充清单

这里 \(H\) 表示目标最大生命值。以下为已核到的部分治疗物品，不能据此宣称全物品穷举完成。

| 物品 | 治疗效果 |
|---|---|
| [荞花粉末](https://warfarin.wiki/cn/items/item_plant_moss_powder_1)／[锦草粉末](https://warfarin.wiki/cn/items/item_plant_grass_powder_1) | 即时352／874 |
| [荞愈胶囊](https://warfarin.wiki/cn/items/item_bottled_rec_hp_1)／[优质](https://warfarin.wiki/cn/items/item_bottled_rec_hp_2)／[精选](https://warfarin.wiki/cn/items/item_bottled_rec_hp_3) | 即时470／655／891 |
| [锦草软饮](https://warfarin.wiki/cn/items/item_bottled_food_4)／[优质](https://warfarin.wiki/cn/items/item_bottled_food_5) | 即时1278／1564 |
| [荞愈药粉](https://warfarin.wiki/cn/items/item_plant_moss_spc_powder_1) | \(20\%H+470\) |
| [蓬茸锦草粉末](https://warfarin.wiki/cn/items/item_plant_grass_spc_powder_1) | \(20\%H+1278\) |
| [怪味肉酱](https://warfarin.wiki/cn/items/item_bottled_moss_2_animal_1) | \(20\%H+891\) |
| [谷地馅饼](https://warfarin.wiki/cn/items/item_corp1_animal_1) | \(20\%H+975\) |
| [锦素炒饭](https://warfarin.wiki/cn/items/item_corp4_grass2_1) | \(20\%H+1312\) |
| [潘师傅蛋羹](https://warfarin.wiki/cn/items/item_hscrane_1_hsmob_1_grass_1_1) | \(20\%H+1480\) |
| [田家特色烂肉面](https://warfarin.wiki/cn/items/item_dog_hsmob_corp_1) | 全队各 \(8\%H+592\) |
| [柑实粉末](https://warfarin.wiki/cn/items/item_plant_moss_powder_2)／[芽针粉末](https://warfarin.wiki/cn/items/item_plant_grass_powder_2) | 每秒88／218，持续6秒 |
| [星融果冻](https://warfarin.wiki/cn/items/item_agfly_1_agmelee_1_moss_2_1) | 每秒 \(5\%H+202\)，持续6秒 |
| [炝炒时蔬](https://warfarin.wiki/cn/items/item_hsmob_1_grass_2_1) | 每秒 \(5\%H+370\)，持续6秒 |
| [辣炒肉丁](https://warfarin.wiki/cn/items/item_corp2_animal_1) | 净化并治疗 \(10\%H+975\) |
| [香焗兽肝](https://warfarin.wiki/cn/items/item_slwood_1_hshog_1_1) | 净化并治疗 \(10\%H+1480\) |

**同类互斥／覆盖：未确认。** 没有找到足够可靠的分类表，不能认定所有食物能叠加，也不能认定一律后吃覆盖前吃。需要至少验证攻击食物＋攻击药剂、不同属性食物、同名重复使用，以及高低数值互相覆盖四组情况。

---

## F. 排轴相关

### 25. 高效循环原则与文字轴

**可以总结有机制支持的原则，但“社区公认唯一最优轴”未确认。**

1. **分别预算真实技力与返还技力。** 战技次数相同，不代表全队回能相同。
2. **避免技力溢出，同时为关键施法保留预算。**
3. **把主伤害放进增幅、脆弱、易伤及失衡的重叠窗口。**
4. **连携有触发窗口与冷却，附着层数还可能被队友消耗。**
5. **连击应由收益最高的合适战技／终结技消耗。**
6. **01号位、当前主控、伤害归属者分别记录。**

这些属于基于已知机制的研究归纳，不应脱离敌人、潜能、武器与初始资源直接宣布最优。

**有公开文字支持的物理队轴：**

> 黎风战技施加物理脆弱并建立破防  
> → 陈千语连携追加破防  
> → 管理员连携放置结晶  
> → 主控重击触发黎风连携，取得连击  
> → 管理员战技消耗破防／结晶并使用连击  
> → 骏卫连携恢复技力，进入下一轮。

具体破防层数与是否插入陈千语战技，应按敌人和所需爆发调整。

**来源类别：玩家研究。** [TapTap物理队循环说明](https://www.taptap.cn/moment/769233679384839957)、[真实技力回能测试](https://forum.gamer.com.tw/Co.php?bsn=74604&sn=19507)。

**关于“别礼／汤汤／祀／诀”：**

- 已找到2026年10月16日的[巴晓白配队与操作视频](https://www.bilibili.com/video/BV1fPJS6HEb4/)。**来源类别：实测视频／攻略视频；本次只核到页面信息，未逐帧复核。**
- 已找到10月22日的[四人队实战日志](https://zmdlogs.com/battle/btl_upload_c9aa96638f80?metric=dps)，记录通关时长 **1分14.845秒**。这是特定配装与潜能的实战样本，不能视为普遍循环时长。
- 祀终结技天赋可以减少**01号位干员连携剩余冷却20秒**，并非对所有连携无条件“重置”。

可以给出的**机制推导示例，来源类别为推测**：

> 别礼放01号位  
> → 建立寒冷附着  
> → 别礼连携消耗附着  
> → 触发祀连携  
> → 祀终结技减少别礼连携剩余冷却并提供增幅  
> → 重建寒冷附着，安排下一次别礼连携  
> → 将诀的对应增益和终结技窗口覆盖主要爆发。

这不是已验证的逐秒最优轴。**汤汤、诀各分支的精确插入时点、真假技力余额、每轮终结技是否齐备，未确认**；缺完整操作录像、初始资源和逐事件时间戳。

### 26. 视频战斗时间口径、终结技演出与命中停顿

**未找到可以覆盖所有模式与角色的统一计时规则。** 至少要区分：

| 时间口径 | 含义 |
|---|---|
| 录像时间 | 视频实际播放经过的时间 |
| 关卡计时 | 游戏内关卡或结算界面显示的时间 |
| 战斗日志时间 | 日志工具定义的事件时间轴 |
| 效果计时 | 增益、异常、技能冷却及强化状态各自的计时 |

已确认的证据：

- 官方说明明确提到，莱万汀部分技能演出会暂停其**终结技强化状态持续时间**。这只能证明该效果计时会暂停，不能推导所有Buff、关卡倒计时都暂停。  
  **来源类别：官方数据。** [官方更新说明](https://www.bilibili.com/opus/1192064737057177641)。
- 玩家机制研究记录了终结技演出期间技力自然恢复暂停的现象。  
  **来源类别：玩家研究。** [资源与计时机制研究](https://github.com/NagiYume/AKEDatabase/blob/main/public/CH/research/终末地数据机制导论.md)。
- 战斗日志将示例时长标为“官方计时窗口”，并按自己的统一战斗时间排序事件。  
  **来源类别：玩家实战记录。** [日志说明及样本](https://zmdlogs.com/battle/btl_upload_c9aa96638f80?metric=dps)。

**仍未确认：** 命中停顿对关卡时间、自然回技力、连携冷却、附着消退及各种增益时间是否分别暂停；不同终结技演出是否完全一致。

要得到可信的逐秒排轴，应同时记录**视频帧号、游戏计时、资源数值、Buff/冷却剩余时间**。不能直接用视频长度减去所有终结技动画长度，当作通用战斗时间。
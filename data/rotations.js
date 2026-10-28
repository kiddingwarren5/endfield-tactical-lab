// 预设排轴（一图流）。动作顺序来自社区共识案例（docs/cases 06/07：“三充一爆”、每节凑 4 层再让别礼连携吃）与规则推导；
// 具体时刻不在此写死：界面与 tests/rotations.test.mjs 用 greedySchedule 把顺序轴放到模拟器里最早可行的时刻，保证每一步可执行。
// 字段：m 干员名；k skill/combo/ultimate；stage 战技替换阶段名（仅说明）；wait 等到寒冷附着达到的层数；seg 节序号；why 这一步的目的。
const COLD_TEAM={
  // 编队顺序 = 01–04 号位（祀终结技“01 号位连携冷却 −20s”作用于 01 号位）。
  members:[
    {op:'诀',weapon:'四二式·肃阵',gear:['长息改装护甲','长息导能护手','长息测距仪','长息重护板'],potential:0},
    {op:'别礼',weapon:'赫拉芬格',gear:['涌浪重装甲','潮涌手甲','悬河供氧栓','生物辅助护板'],potential:0},
    {op:'汤汤',weapon:'落草',gear:['涌浪重装甲','潮涌手甲','悬河供氧栓','悬河供氧栓'],potential:0},
    {op:'祀',weapon:'玉中身',gear:['长息改装护甲','长息导能护手','长息测距仪','长息重护板'],potential:3}
  ],
  mainControl:'别礼',
  initial:{sp:200,energy:[0,0,0,0]}
};
// 一节“充能”：三次 100 技力战技 + 起墨 15 技力，凑满 4 层寒冷后别礼连携吃层。
const chargeSegment=seg=>[
  {m:'汤汤',k:'skill',seg,why:'水龙卷施加寒冷附着第 1 层；消耗 100 真实技力，全队各回能'},
  {m:'祀',k:'skill',stage:'河山共影',seg,why:'寒冷附着第 2 层；开启笔意（20 s 内记录伤害）'},
  {m:'汤汤',k:'combo',seg,why:'“被施加寒冷附着”后 5 s 内可发动；生成涡流，自身 +10 能量'},
  {m:'诀',k:'combo',seg,why:'“2 层及以上其他法术附着”后可发动；施加寒冷脆弱 + 自然脆弱（囹圄 4 s）'},
  {m:'别礼',k:'skill',seg,why:'低温灌注：主控别礼的下一次重击触发幻影追击，施加第 3 层；返还 30 技力'},
  {m:'祀',k:'skill',stage:'起墨',seg,why:'15 技力拉出墨魂（持续到笔意结束）'},
  {m:'汤汤',k:'skill',seg,why:'第 4 层（吃掉涡流可返还技力，模拟按 0 计，偏保守）'},
  {m:'别礼',k:'combo',wait:4,seg,why:'消耗 4 层：斩击倍率 160%+240%×4；别礼 +100 能量；低温症寒冷脆弱 16%'},
  {m:'祀',k:'combo',seg,why:'“附着被消耗”后可发动；伤害按消耗的 4 层加成'},
  {m:'祀',k:'skill',stage:'收笔',seg,why:'0 技力；提前结束墨魂、结算笔意爆发，让下一节的战技回到“河山共影”'}
];
// 爆发节：先上增幅/脆弱，再让别礼 4 层连携 + 终结技收尾。
const burstSegment=seg=>[
  {m:'汤汤',k:'skill',seg,why:'寒冷第 1 层'},
  {m:'祀',k:'skill',stage:'河山共影',seg,why:'寒冷第 2 层；笔意开始记录爆发伤害'},
  {m:'汤汤',k:'combo',seg,why:'涡流 + 回能'},
  {m:'诀',k:'combo',seg,why:'寒冷脆弱 + 自然脆弱'},
  {m:'别礼',k:'skill',seg,why:'灌注 → 重击幻影追击：第 3 层'},
  {m:'祀',k:'skill',stage:'起墨',seg,why:'墨魂'},
  {m:'汤汤',k:'skill',seg,why:'第 4 层'},
  {m:'祀',k:'ultimate',seg,why:'全队增幅 43.2%（潜 3）12 s；01 号位（诀）连携冷却 −20 s'},
  {m:'诀',k:'ultimate',seg,why:'破晦阵 20 s：强制腐蚀；终结技脆弱 19.8%（意志形态）'},
  {m:'汤汤',k:'ultimate',seg,why:'巨浪定身 + 持续伤害；法术脆弱'},
  {m:'别礼',k:'combo',wait:4,seg,why:'在增幅与脆弱覆盖内消耗 4 层斩击'},
  {m:'别礼',k:'ultimate',seg,why:'临终别礼三段 400/400/800%；二天赋：终结技享受的脆弱 ×1.5'},
  {m:'祀',k:'combo',seg,why:'吃层后的成竹在胸'},
  {m:'祀',k:'skill',stage:'收笔',seg,why:'结算笔意（记录了整个爆发节的伤害）'}
];
export default [
  {
    id:'cold-3charge-1burst', name:'主轴 · 三充一爆', team:COLD_TEAM,
    summary:'主控别礼全程普攻，重击回技力并触发幻影追击。每节用汤汤→祀→别礼→汤汤四次战技凑满 4 层寒冷，别礼连携吃层、祀连携跟上。前两节只充能；第三节先照常凑层（社区所说的第三次“充”），等别礼能量到 240 后依次开祀、诀、汤汤终结技，再让别礼 4 层连携 + 终结技收尾。',
    steps:[...chargeSegment(1),...chargeSegment(2),...burstSegment(3)],
    sources:['docs/cases/case-06-bili-yuezhou-lazy.md（YZ-月咒：三充一爆、每轮凑 4 层后别礼连携）','docs/cases/case-07-bili-tanggui-94.md（唐傀：每节附着预算≈4 层）','docs/cases/case-01…04（zmdlogs 榜单日志：诀 01 号位、祀增幅后别礼终结技）','docs/rules.md v0.5 §C 资源规则'],
    verify:['非主控（诀/汤汤/祀）自动普攻的伤害衰减 δ 未实测，总伤给区间','别礼重击回技力 30（单一来源）决定每节时长','汤汤战技吃涡流返还技力未建模（实战每节可快 1–3 s）','祀笔意爆发、墨魂伤害未建模（实战总伤更高）','终结技演出期间增益计时暂停为假设（timing.js 可关闭）']
  },
  {
    id:'cold-ult-asap', name:'备选 A · 终结技就绪即放', team:COLD_TEAM,
    summary:'节结构与主轴相同，但每个人的终结技一充满就放：祀、诀在第二节，汤汤、别礼在第三节各自就绪时释放。能量不溢出、增幅更早上线，代价是别礼终结技吃不到祀增幅与诀终结技脆弱的全覆盖。',
    steps:[...chargeSegment(1),
      ...chargeSegment(2).flatMap(s=>s.k==='combo'&&s.m==='祀'?[s,{m:'祀',k:'ultimate',seg:2,why:'第二节充满即放：增幅 43.2% 12 s；01 号位（诀）连携冷却 −20 s'},{m:'诀',k:'ultimate',seg:2,why:'第二节充满即放：破晦阵 + 终结技脆弱'}]:[s]),
      ...chargeSegment(3).flatMap(s=>s.k==='combo'&&s.m==='诀'?[s,{m:'汤汤',k:'ultimate',seg:3,why:'充满即放：定身 + 持续伤害'}]:s.k==='combo'&&s.m==='别礼'?[s,{m:'别礼',k:'ultimate',seg:3,why:'充满即放（此时祀增幅已过期，只吃诀/汤汤/自身脆弱）'}]:[s])],
    sources:['docs/cases/case-02-zmd-dusk-si-boss.md（有阶段转换时别礼终结技可不等增幅）'],
    verify:['与主轴同']
  },
  {
    id:'cold-3layer-fast', name:'备选 B · 3 层即连携（快节奏）', team:COLD_TEAM,
    summary:'省掉每节第二次汤汤战技，寒冷到 3 层（汤汤 + 祀 + 别礼幻影追击）就让别礼连携。每节少花 100 技力、周期更短，但别礼连携倍率、回能与低温症脆弱都按 3 层计。',
    steps:[1,2,3].flatMap(seg=>[
      {m:'汤汤',k:'skill',seg,why:'寒冷第 1 层'},{m:'祀',k:'skill',stage:'河山共影',seg,why:'寒冷第 2 层；笔意'},{m:'汤汤',k:'combo',seg,why:'涡流 + 回能'},{m:'诀',k:'combo',seg,why:'寒冷脆弱 + 自然脆弱'},
      {m:'别礼',k:'skill',seg,why:'灌注 → 重击幻影追击：第 3 层'},{m:'别礼',k:'combo',wait:3,seg,why:'3 层即吃：160%+240%×3，+85 能量，脆弱 12%'},{m:'祀',k:'combo',seg,why:'吃层后的成竹在胸'},{m:'祀',k:'skill',stage:'起墨',seg,why:'墨魂'},{m:'祀',k:'skill',stage:'收笔',seg,why:'结算笔意'}
    ]).concat([
      {m:'汤汤',k:'skill',seg:4,why:'寒冷第 1 层'},{m:'祀',k:'skill',stage:'河山共影',seg:4,why:'寒冷第 2 层'},{m:'汤汤',k:'combo',seg:4,why:'涡流 + 回能'},{m:'诀',k:'combo',seg:4,why:'脆弱'},{m:'别礼',k:'skill',seg:4,why:'第 3 层'},
      {m:'祀',k:'ultimate',seg:4,why:'增幅 43.2%'},{m:'诀',k:'ultimate',seg:4,why:'破晦阵 + 脆弱'},{m:'汤汤',k:'ultimate',seg:4,why:'定身 + 持续伤害'},{m:'别礼',k:'combo',wait:3,seg:4,why:'3 层斩击'},{m:'别礼',k:'ultimate',seg:4,why:'终结技收尾（脆弱 ×1.5）'},{m:'祀',k:'combo',seg:4,why:'成竹在胸'},{m:'祀',k:'skill',stage:'收笔',seg:4,why:'结算笔意'}
    ]),
    sources:['docs/cases/regression-cold-team.md 场景 1（3 层 vs 4 层同条件对比）'],
    verify:['与主轴同；另需实测 3 层时别礼连携的真实回能（官方：40+15×层数）']
  }
];

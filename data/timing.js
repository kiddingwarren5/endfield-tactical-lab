// Timing assumptions for the event simulator. Every value is an ASSUMPTION unless origin says otherwise (docs/sim-design.md §1.4).
export default {
  origin:'assumed',
  // seconds per normal-attack segment by weapon type (last segment = heavy hit). Calibrate against docs/cases videos.
  normalSegmentSeconds:{sword:[0.45,0.45,0.5,0.55,0.7],greatsword:[0.7,0.75,0.8,1.0,1.1],polearm:[0.5,0.55,0.6,0.8,0.9],pistol:[0.4,0.4,0.45,0.5,0.6],arts:[0.5,0.5,0.55,0.6,0.7]},
  castSeconds:{skill:0.8,combo:1.2,ultimate:3.0,switch:0.3,plunge:0.9,execute:1.5},
  ultimatePausesTimers:true,      // 终结技演出期间：自然回技力暂停、增益/冷却计时暂停（部分官方说明，rules F）
  heavySpRefundByName:{origin:'research (666bj/NGA 重击技力表)',values:{'别礼':30,'余烬':28,'昼雪':25,'卡契尔':25,'大潘':21,'黎风':21,'管理员 (男)':20,'管理员 (女)':20,'莱万汀':20,'骏卫':20,'秋栗':19,'埃特拉':19,'阿列什':19,'艾维文娜':19,'狼卫':18,'陈千语':18,'艾尔黛拉':18,'弧光':17,'伊冯':17,'洁尔佩塔':16,'佩丽卡':15,'赛希':15,'安塔尔':15,'萤石':15}},
  spRegenPerSecond:8,             // research
  spMax:300, spInitial:200,       // research
  skillEnergyPer100RealSp:6.5,    // research（战技：每 100 真实技力全队各 +6.5）
  comboWindowSeconds:5,           // research（单一来源）
  attachDurationSeconds:20,       // research（单一来源）
  nonControl:{damageFactor:[0.5,1.0],rhythmFactor:[0.6,1.0],default:{damageFactor:0.75,rhythmFactor:0.8},
    measured:{origin:'zmdlogs 白刃穿水 74.8s（docs/cases/README.md 末节）',rhythm:{'诀(非主控)':'24 次重击/67.8s，攻击串周期≈2.8s，与主控祀(25/71.8s)相当 → φ≈0.98','别礼(非主控)':'38s 内 1 次重击，长时间不普攻（施法/AI 停顿）','汤汤(非主控)':'仅记录第3/4段，节奏不可判'},damage:'日志跨账号/跨副本的绝对校准不一致（含未知副本加成），衰减 δ 未能测得，保持区间'}}, // 节奏已有一例日志测量；衰减未知
  staggerMultiplier:1.3,          // research（默认对照靶不失衡，不启用）
  burstDelaySeconds:0.3,          // 法术爆发短暂延迟（研究：“短暂延迟后造成伤害”）
  enemyAttackInterval:4,          // 敌人攻击主控的默认间隔（秒）：假设值，场景 enemy.attackInterval 可改，0 = 不攻击（纯木桩）
  counterWindowSeconds:5          // 立盾类战技的反击窗口（秒）：假设值，mechanics 可用 counterWindow 覆盖
};

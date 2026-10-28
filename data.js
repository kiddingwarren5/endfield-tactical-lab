export const gear = {
  armor: {name:'涌浪重装甲', set:'潮涌', image:'./assets/armor.webp', strength:[87,95,104,113], will:[58,63,69,75], cold:[11.5,12.7,13.8,14.9]},
  gloves: {name:'潮涌手甲', set:'潮涌', image:'./assets/gloves.webp', strength:[65,71,78,84], will:[43,47,51,55], cold:[19.2,21.1,23.0,24.9]},
  kit1: {name:'悬河供氧栓', set:'潮涌', image:'./assets/kit1.webp', strength:[32,35,38,41], will:[21,23,25,27], cold:[23.0,25.3,27.6,29.9]},
  kit2: {name:'生物辅助护板', set:'生物辅助', image:'./assets/kit2.webp', strength:[0,0,0,0], will:[32,35,38,41], wisdom:[21,23,25,27], main:[20.7,22.8,24.8,26.9]}
};

export const weapon = {name:'赫拉芬格', image:'./assets/weapon.webp'};

export const weaponRanks = {
  strength:[20,36,52,68,84,100,116,132,156],
  attack:[5,9,13,17,21,25,29,33,39],
  skill:[20,24,28,32,36,40,44,48,56],
  afterQ:[10,12,14,16,18,20,22,24,28],
  afterE:[20,24,28,32,36,40,44,48,56]
};

// Rank 1–9, then 专精 1–3. All values are percentages from the official operator table.
export const skills = {
  normal1:[30,33,36,39,42,45,48,51,54,58,62,68],
  normal2:[55,61,66,72,77,83,88,94,99,106,114,124],
  normal3:[68,75,82,88,95,102,109,116,122,131,141,153],
  normal4:[90,99,108,117,126,135,144,153,162,173,187,203],
  plunge:[80,88,96,104,112,120,128,136,144,154,166,180],
  execute:[400,440,480,520,560,600,640,680,720,770,830,900],
  q:[142,156,171,185,199,213,228,242,256,274,295,320],
  eIce:[71,78,85,92,99,107,114,121,128,137,147,160],
  eBase:[71,78,85,92,99,107,114,121,128,137,147,160],
  eLayer:[107,117,128,139,149,160,171,181,192,205,221,240],
  r1:[178,196,213,231,249,267,284,302,320,342,369,400],
  r2:[178,196,213,231,249,267,284,302,320,342,369,400],
  r3:[356,391,427,462,498,533,569,604,640,684,738,800]
};

export const events = [
  {id:'normal1', label:'普攻 · 第一段', group:'别礼攻击', kind:'normal', element:'cold'},
  {id:'normal2', label:'普攻 · 第二段', group:'别礼攻击', kind:'normal', element:'cold'},
  {id:'normal3', label:'普攻 · 第三段', group:'别礼攻击', kind:'normal', element:'cold'},
  {id:'normal4', label:'普攻 · 第四段 / 重击', group:'别礼攻击', kind:'normal', element:'cold'},
  {id:'plunge', label:'下落攻击', group:'别礼攻击', kind:'normal', element:'cold'},
  {id:'execute', label:'处决攻击', group:'别礼攻击', kind:'normal', element:'cold'},
  {id:'q', label:'战技 · 幻影追击', group:'别礼技能', kind:'skill', element:'cold'},
  {id:'eIce', label:'连携技 · 冰刺', group:'别礼技能', kind:'skill', element:'cold'},
  {id:'eSlash', label:'连携技 · 斩击', group:'别礼技能', kind:'skill', element:'cold'},
  {id:'r1', label:'终结技 · 第一段', group:'别礼技能', kind:'skill', element:'cold'},
  {id:'r2', label:'终结技 · 第二段', group:'别礼技能', kind:'skill', element:'cold'},
  {id:'r3', label:'终结技 · 第三段', group:'别礼技能', kind:'skill', element:'cold'},
  {id:'artsBurst', label:'法术爆发', group:'机制伤害', kind:'arts', element:'cold'},
  {id:'knockup', label:'击飞', group:'机制伤害', kind:'physical', element:'physical'},
  {id:'knockdown', label:'倒地', group:'机制伤害', kind:'physical', element:'physical'},
  {id:'crush', label:'猛击', group:'机制伤害', kind:'physical', element:'physical'},
  {id:'armorBreak', label:'碎甲伤害', group:'机制伤害', kind:'physical', element:'physical'},
  {id:'burn', label:'燃烧 · 初始', group:'机制伤害', kind:'arts', element:'heat'},
  {id:'burnTick', label:'燃烧 · 每秒', group:'机制伤害', kind:'arts', element:'heat'},
  {id:'conduct', label:'导电', group:'机制伤害', kind:'arts', element:'electric'},
  {id:'corrosion', label:'腐蚀 · 初始', group:'机制伤害', kind:'arts', element:'nature'},
  {id:'freeze', label:'冻结', group:'机制伤害', kind:'arts', element:'cold'},
  {id:'iceShatter', label:'碎冰', group:'机制伤害', kind:'arts', element:'cold'}
];

export const elements = {
  physical:'物理', cold:'寒冷', heat:'灼热', electric:'电磁', nature:'自然'
};
export const gradeResistance = {D:0,C:20,B:50};

export const buffDefs = [
  {id:'weaponQ', name:'赫拉芬格 · 战技施加寒冷后', zone:'增伤', source:'别礼武器', applies:'寒冷伤害'},
  {id:'weaponE', name:'赫拉芬格 · 连携技命中寒冷后', zone:'增伤', source:'别礼武器', applies:'寒冷伤害'},
  {id:'tide2', name:'潮涌 · 本人叠至 2 层后', zone:'增伤', source:'别礼装备', applies:'法术伤害'},
  {id:'jueSet', name:'长息 · 诀施加负面状态后', zone:'增伤', source:'诀装备', applies:'队友伤害', value:16},
  {id:'siR', name:'祀终结技 · 队友增幅', zone:'增幅', source:'祀终结技', applies:'别礼伤害', value:43.2},
  {id:'jueCold', name:'诀 · 寒冷脆弱', zone:'脆弱', source:'诀', applies:'寒冷伤害', value:18},
  {id:'jueRCold', name:'诀终结技 · 寒冷脆弱', zone:'脆弱', source:'诀终结技', applies:'寒冷伤害', value:19.8, exclusive:'jueCold'},
  {id:'ttArts', name:'汤汤 · 法术脆弱', zone:'脆弱', source:'汤汤', applies:'法术伤害', value:10},
  {id:'blCold', name:'别礼 · 寒冷脆弱（4 层）', zone:'脆弱', source:'别礼天赋', applies:'寒冷伤害', value:16},
  {id:'siWeapon', name:'玉中身 · 定身易伤', zone:'易伤', source:'祀武器', applies:'全部伤害', value:21},
  {id:'jueWeaponFrag', name:'42 式肃阵 · 施加脆弱', zone:'易伤', source:'诀武器', applies:'全部伤害', value:16.8},
  {id:'jueWeaponBurst', name:'42 式肃阵 · 触发法术爆发', zone:'易伤', source:'诀武器', applies:'全部伤害', value:16.8},
  {id:'ttWeapon', name:'落草 · 施加法术脆弱', zone:'易伤', source:'汤汤武器', applies:'全部伤害', value:16.8}
];

// 受控词表（分类法）：数据文件、引擎、校验器共用的枚举。改这里要同步 docs/ontology.md；校验器（engine/graph.js validateGraph）按这里检查所有数据。
export const ELEMENTS=['physical','cold','heat','electric','nature'];
export const ARTS=['cold','heat','electric','nature'];
// 伪附着目标：破防层、源石结晶、“再次施加触发本次连携的附着”、任意法术、其他法术（诀）
export const ATTACH_TARGETS=[...ELEMENTS,'breach','originiumCrystal','trigger','same','anyArts','otherArts']; // same = 再次施加目标身上已有的法术附着（诀·意）
export const DAMAGE_KINDS=['normal','skill','combo','ultimate','mech'];
export const ACTION_KINDS=['skill','combo','ultimate','plunge','switch','execute'];
export const DAMAGE_CLASSES=['any','arts','physical'];
export const ABNORMALS={arts:['burn','conduct','freeze','corrosion'],physical:['knockup','knockdown','crush','armorBreak']};
// 伪异常：trigger = 再次施加触发本次连携的异常；artsBurst = 该动作直接造成法术爆发
export const ABNORMAL_PSEUDO=['trigger','artsBurst'];
export const ZONES={damage:['bonus','amp','fragile','vulnerable','ratioMul','ratioAdd','resIgnore'],stat:['atkPct','atkFlat','ability','critRate','critDmg','chargeEff','artsStrength'],resource:['spRefund','spRegen','energyCost','energyGain','cdr'],mechanic:['extraHit'],other:['poise','other']}; // resIgnore：无视目标 N 点抗性（按元素）；extraHit：触发时追加一次固定伤害（公式）
export const STATS=['str','agi','int','will','main','sub','all','atkPct','atkFlat','critRate','critDmg','chargeEff','artsStrength','hpPct','dmgBonus','healEff','def'];
export const GEAR_STATS=['str','agi','int','will','main','sub','chargeEff','artsStrength','critRate','hp','comboDmg','physicalDmg','skillDmg','coldElecDmg','heatNatureDmg','ultDmg','allSkillDmg','normalDmg','artsDmg','healEff','dmgTaken','brokenDmg'];
export const BENEFICIARIES=['self','team','others','mainControl','target'];
export const STACKING=['none','stack','highest','independent','unknown'];
export const CONDITION_MODES=['auto','user','segment'];
export const UNITS=['%','flat','x'];
export const OWNER_KINDS=['operator','weapon','gearSet','consumable'];
// 模拟器事件族（触发表 on:）与状态（触发表 state:）
export const EVENT_FAMILIES=['battleStart','cast','hit','heavy','attach','attachLayers','consume','abnormal','consumeAbnormal','burst','breach','root','tornado','earlyWave','ultimateEnd','iceShatter','applyDebuffCategory','spGain','execute','allyCombo','resourceGain','resourceSpend','resourceExhausted'];
export const STATES=['always','never','duringUltimate','modeInt','targetAttached','targetColdAttached','targetFrozen','targetColdOrFrozen','targetFragile','targetStaggered','targetHpBelow','targetBreached','targetBreach4','resourceAtLeast','airborne'];
// 连携技发动条件类型（mechanics combo.trigger.type）与自定义事件
export const COMBO_TRIGGER_TYPES=['attachApplied','anyAttachApplied','attachLayers','attachConsumed','abnormal','burst','heavyHit','execute','allyCombo','skillState','resource','custom'];
export const CUSTOM_EVENTS=['controlledHit','abnormalConsumed','crystalConsumed','enemyCharging','stagger'];
export const RESOURCES=[{id:'sp',name:'技力'},{id:'poisonSp',name:'返还技力'},{id:'energy',name:'终结技能量'},{id:'attach',name:'法术附着层'},{id:'breach',name:'破防层'},{id:'vortex',name:'涡流'},{id:'ink',name:'笔意 / 墨魂'},{id:'molten',name:'熔火'},{id:'lance',name:'雷枪'},{id:'strongLance',name:'强雷枪'},{id:'sword',name:'青霆剑（剑数）'},{id:'bomb',name:'自制炸弹'},{id:'comboCount',name:'连击'},{id:'crystal',name:'支援晶体'},{id:'arrow',name:'猎矢'},{id:'revelation',name:'启示'},{id:'stance',name:'姿态'}];
// 资源规则（mechanics.resources）：gains/spend 的 on ∈ skillHit | comboHit | skillCast | comboCast | ultimateCast | heavy | burst
export const RESOURCE_RULE_EVENTS=['skillHit','comboHit','skillCast','comboCast','ultimateCast','heavy','burst'];
// 段计划条目：{id, times?, timesFrom?('资源 id' 或 'consumed:异常'), lastMul?, delay?, when?}
export const RESOURCE_ALIASES={'涡流':'vortex','熔火':'molten','雷枪/强雷枪':'lance','雷枪':'lance','强雷枪':'strongLance','自制炸弹':'bomb','连击':'comboCount','支援晶体':'crystal','猎矢':'arrow','启示':'revelation','青霆剑':'sword','剑数':'sword'};
// 效果的条件性：static 配装即生效（看面板就能算）；eventDriven / stateDriven / handled 取决于轴里做了什么；unmodeled 引擎不算；informational 只记录不进伤害
// 效果两个维度：生效方式（看什么才生效）与实现状态（引擎算不算）
export const ACTIVATION=['static','event','state','segment'];
export const STATUS=['modeled','handled','unmodeled','informational'];
export const CORE_ATTRS=['str','agi','int','will'];
export const SKILL_KEYS=['normal','skill','combo','ultimate'];
// 只有治疗/减伤效果的套装：按效果目录规范不录入，校验器不再提示“无效果条目”
export const SETS_WITHOUT_DAMAGE_EFFECTS={suit_heal01:'治疗效率与受治疗后减伤，不进伤害计算'};
export const WEAPON_TYPES=['sword','arts','greatsword','polearm','pistol'];
export const PROFESSIONS=['guard','caster','assault','vanguard','defender','supporter'];
export const GEAR_SLOTS=['armor','gloves','kit'];

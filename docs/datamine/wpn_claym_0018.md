# 解包清单：wpn_claym_0018

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（1）

### sk_wpn_claym_0018
- 文件黑板: {"atk_up":0.12,"dmg_taken_up":0.1,"duration":5,"duration_combo":5,"max_stack":3,"combo_dmg_up":0.5,"combo_stack":"dyn","combo_dmg_up_final":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
- 等级表 L9: cost UltSp 0, cd 0, 黑板 {"atk_up":0.448,"dmg_taken_up":0.21,"duration":30,"duration_combo":20,"combo_dmg_up":0.7,"max_stack":1}; L1 黑板 {"atk_up":0.16,"dmg_taken_up":0.075,"duration":30,"duration_combo":20,"combo_dmg_up":0.25,"max_stack":1}
```
```


## 增益（6）

### buff_wpn_claym_0018_comboimbue
- life Infinity, dur 0, stacking Unique max 1; 黑板默认 {"combo_dmg_up":0}
- 属性修正: PhysicalEnhancedDmgIncrease BaseAddition @combo_dmg_up(0); FireEnhancedDmgIncrease BaseAddition @combo_dmg_up(0); PulseEnhancedDmgIncrease BaseAddition @combo_dmg_up(0); CrystEnhancedDmgIncrease BaseAddition @combo_dmg_up(0); NaturalEnhancedDmgIncrease BaseAddition @combo_dmg_up(0); EtherEnhancedDmgIncrease BaseAddition @combo_dmg_up(0)
- 伤害修正: 无
```
on OnBuffFinish:
  FinishBuff buff_wpn_claym_0018_comboready all layers=1 on Owner
```

### buff_wpn_claym_0018_comboready
- life Limited, dur @duration(0), stacking Stack max @max_stack; 黑板默认 {"duration":0,"max_stack":3}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up] → Owner count=1
```

### buff_wpn_claym_0018_enemyvul
- life Limited, dur @duration(0), stacking HighPriorityWithMaxStack by dmg_taken_up max 1; 黑板默认 {"dmg_taken_up":0,"duration":0}
- 属性修正: 无
- 伤害修正: Defender: DamageScaleProcessor NormalCalcZone  @dmg_taken_up(0)
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down] → Owner count=1
```

### buff_wpn_claym_0018_normal_skill_comboimbue
- life Infinity, dur -1, stacking Unlimited by imbue_scale max 4; 黑板默认 {"combo_dmg_up":0,"duration":0,"imbue_scale":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_wpn_claym_0018_normal_skill_comboimbue_atk{imbue_scale=@imbue_scale}] → Owner count=1
  SkillAffixAction
```

### buff_wpn_claym_0018_normal_skill_comboimbue_atk
- life Infinity, dur -1, stacking Unlimited by imbue_scale max 4; 黑板默认 {"count":0,"combo_dmg_up":0,"imbue_scale":0}
- 属性修正: 无
- 伤害修正: Attacker: DamageScaleProcessor NormalCalcZone  @imbue_scale(0) cond=[CheckSkillCastId && ?decorateMask HasAll 8192]
```
on DuringBuffEnable:
  SkillAffixAction
```

### buff_wpn_claym_0018_normal_skill_trigger
- life Limited, dur @duration(0), stacking Stack by imbue_scale max @max_stack; 黑板默认 {"combo_dmg_up":0,"max_stack":0,"duration":0,"imbue_scale":0,"count":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnBeforeCastSkill:
  CheckSkillType
  SaveBuffStackNum
  BB imbue_scale = @combo_dmg_up(0) Multiply @count(0)
  CreateBuff [buff_wpn_claym_0018_normal_skill_comboimbue{imbue_scale=@imbue_scale}] → Owner count=1
  FinishBuff buff_wpn_claym_0018_normal_skill_trigger all layers=1 on Owner
```
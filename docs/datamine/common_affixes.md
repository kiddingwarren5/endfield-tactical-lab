# 解包清单：common_affixes

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（0）


## 增益（43）

### buff_common_affixes_combo_trigger
- life Infinity, dur 15, stacking Unlimited by imbue_scale max 99; 黑板默认 {"imbue_scale":0,"count":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1)
on ability OnBeforeCastSkill:
  CheckSkillType
  SaveBuffStackNum
  ReadSkillSettingData
  CreateBuff [buff_common_affixes_skillimbue{imbue_scale=@imbue_scale}] → Owner count=1
  FinishGlobalBuffAction
```

### buff_common_affixes_enhance_all
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-1748167886},{"tagId":486772476},{"tagId":342438932},{"tagId":19147786
- 属性修正: PhysicalEnhancedDmgIncrease BaseAddition @rate(0.2); FireEnhancedDmgIncrease BaseAddition @rate(0.2); PulseEnhancedDmgIncrease BaseAddition @rate(0.2); CrystEnhancedDmgIncrease BaseAddition @rate(0.2); NaturalEnhancedDmgIncrease BaseAddition @rate(0.2); EtherEnhancedDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_enhance_all_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_enhance_crystal
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":191477865}]
- 属性修正: CrystEnhancedDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_enhance_crystal_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_enhance_fire
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-1920931676}]
- 属性修正: FireEnhancedDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_enhance_fire_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_enhance_natural
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":895316857}]
- 属性修正: NaturalEnhancedDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_enhance_natural_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_enhance_physical
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-1748167886},{"tagId":342438932}]
- 属性修正: PhysicalEnhancedDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_enhance_physical_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_enhance_pulse
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-1046270741}]
- 属性修正: PulseEnhancedDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_enhance_pulse_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_enhance_pulse_zhuangfy_talent1_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_enhance_spell
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-1748167886},{"tagId":486772476},{"tagId":-1920931676},{"tagId":191477
- 属性修正: FireEnhancedDmgIncrease BaseAddition @rate(0.2); PulseEnhancedDmgIncrease BaseAddition @rate(0.2); CrystEnhancedDmgIncrease BaseAddition @rate(0.2); NaturalEnhancedDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_enhance_spell_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_shelter
- life Limited, dur @duration(0.8), stacking HighPriority by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-1957150384}]
- 属性修正: ShelterDmgScalar BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_shelter_default_child
- life Limited, dur @duration(0), stacking HighPriority by rate max 0; 黑板默认 {"rate":-0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_def_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_skillimbue
- life Infinity, dur -1, stacking Unlimited by imbue_scale max 4; 黑板默认 {"imbue_scale":0.3,"duration":0}; tags [{"tagId":949770213}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_affixes_skillimbue_atk{imbue_scale=@imbue_scale}] → Owner count=1
  SkillAffixAction
```

### buff_common_affixes_skillimbue_atk
- life Infinity, dur -1, stacking Unlimited by imbue_scale max 4; 黑板默认 {"imbue_scale":0,"count":0,"real_imbue_scale":0}
- 属性修正: 无
- 伤害修正: Attacker: DamageScaleProcessor ComboCalcZone  @real_imbue_scale(0) cond=[CheckSkillCastId && ?decorateMask HasAny 768 && IfElseAction]
```
on DuringBuffEnable:
  SkillAffixAction
```

### buff_common_affixes_slow
- life Limited, dur @duration(0), stacking HighPriority by rate max 1; 黑板默认 {"rate":0,"duration":0,"child_buff_id":0}; tags [{"tagId":1925762097}]
- 属性修正: SlowActionSpeedScalar Addition @rate(0)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_slow_default_child
- life Limited, dur @duration(0), stacking HighPriority by rate max 1; 黑板默认 {"rate":0,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_speed_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_speedup
- life Limited, dur @duration(0), stacking Unlimited by rate max 1; 黑板默认 {"rate":0,"duration":0,"child_buff_id":0}; tags [{"tagId":-1589682655}]
- 属性修正: KeywordSpeedUpScalar BaseAddition @rate(0)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1
```

### buff_common_affixes_speedup_default_child
- life Limited, dur @duration(0), stacking HighPriority by rate max 1; 黑板默认 {"rate":0,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_speed_up{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_all
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-881002460},{"tagId":1427729990},{"tagId":1066759270},{"tagId":4580379
- 属性修正: PhysicalVulnerableDmgIncrease BaseAddition @rate(0.2); FireVulnerableDmgIncrease BaseAddition @rate(0.2); PulseVulnerableDmgIncrease BaseAddition @rate(0.2); CrystVulnerableDmgIncrease BaseAddition @rate(0.2); NaturalVulnerableDmgIncrease BaseAddition @rate(0.2); EtherVulnerableDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_vulnerable_all_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_all_jsspsi_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_crystal
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-881002460},{"tagId":1427729990},{"tagId":1425735059}]
- 属性修正: CrystVulnerableDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_vulnerable_crystal_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_crystal_lizhiyan_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_fire
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-881002460},{"tagId":1427729990},{"tagId":458037917}]
- 属性修正: FireVulnerableDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_vulnerable_fire_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_natural
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-881002460},{"tagId":1427729990},{"tagId":-575106878}]
- 属性修正: NaturalVulnerableDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_vulnerable_natural_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_natural_lizhiyan_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_physical
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-881002460},{"tagId":1066759270}]
- 属性修正: PhysicalVulnerableDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_vulnerable_physical_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_pulse
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-881002460},{"tagId":1427729990},{"tagId":-1640994543}]
- 属性修正: PulseVulnerableDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_vulnerable_pulse_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_vulnerable_spell
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":-881002460},{"tagId":1427729990},{"tagId":458037917},{"tagId":14257350
- 属性修正: FireVulnerableDmgIncrease BaseAddition @rate(0.2); PulseVulnerableDmgIncrease BaseAddition @rate(0.2); CrystVulnerableDmgIncrease BaseAddition @rate(0.2); NaturalVulnerableDmgIncrease BaseAddition @rate(0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_vulnerable_spell_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down{duration=@duration}] → Owner count=1
```

### buff_common_affixes_weak
- life Limited, dur @duration(0.8), stacking Unlimited by rate max 0; 黑板默认 {"rate":-0.2,"duration":0.8,"child_buff_id":0}; tags [{"tagId":2029588776}]
- 属性修正: WeaknessDmgScalar FinalMultiplier @rate(-0.2)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [@child_buff_id{rate=@rate,duration=@duration}] → Owner count=1 child
```

### buff_common_affixes_weak_default_child
- life Limited, dur @duration(0), stacking Unlimited by rate max 0; 黑板默认 {"rate":-0.2,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_atk_down{duration=@duration}] → Owner count=1
```
# 解包清单：wpn_funnel_0016

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（1）

### sk_wpn_funnel_0016
- 文件黑板: {"atk_up":0.16,"spell_dmg_up":0,"duration":0.5,"atk_up2":30,"duration2":2,"spell_dmg_taken_up":0,"duration3":20,"spell_dmg_taken_up2":0,"duration4":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
- 等级表 L9: cost UltSp 0, cd 0, 黑板 {"atk_up":0.448,"spell_dmg_up":0.56,"duration":20,"atk_up2":0.56,"duration2":20,"spell_dmg_taken_up":0.168,"duration3":25,"spell_dmg_taken_up2":0.168,"duration4":25}; L1 黑板 {"atk_up":0.16,"spell_dmg_up":0.2,"duration":20,"atk_up2":0.2,"duration2":20,"spell_dmg_taken_up":0.06,"duration3":25,"spell_dmg_taken_up2":0.06,"duration4":25}
```
```


## 增益（8）

### buff_wpn_funnel_0016
- life Infinity, dur @duration(0), stacking Unique max 0; 黑板默认 {"spell_dmg_up":0,"duration":0,"atk_up2":0,"duration2":0,"spell_dmg_taken_up":0,"duration3":0,"spell_dmg_taken_up2":0,"duration4":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  If [CompareDeckAttr]
    FinishBuff buff_wpn_funnel_0016_will all layers=1 on Owner
    CreateBuff [buff_wpn_funnel_0016_wisd{spell_dmg_up=@spell_dmg_up,duration=@duration,atk_up2=@atk_up2,duration2=@duration2}] → Owner count=1 child
    else
    FinishBuff buff_wpn_funnel_0016_wisd all layers=1 on Owner
    CreateBuff [buff_wpn_funnel_0016_will{spell_dmg_taken_up=@spell_dmg_taken_up,duration3=@duration3,spell_dmg_taken_up2=@spell_dmg_taken_up2,duration4=@duration4}] → Owner count=1 child
```

### buff_wpn_funnel_0016_will
- life Infinity, dur @duration3(0), stacking Unique max 0; 黑板默认 {"spell_dmg_taken_up":0,"duration3":0,"spell_dmg_taken_up2":0,"duration4":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnCharBeforeOutputSpellBurst:
  CheckOriginSkillType
  CreateBuff [buff_wpn_funnel_0016_will_atk{spell_dmg_taken_up=@spell_dmg_taken_up,duration3=@duration3}] → Target count=1 child
on ability OnBeforeOutputBuff:
  CheckBuffIdInContextAdvanced
  CheckOriginSkillType
  CreateBuff [buff_wpn_funnel_0016_will_dmg{spell_dmg_taken_up2=@spell_dmg_taken_up2,duration4=@duration4}] → Target count=1 child
```

### buff_wpn_funnel_0016_will_atk
- life Limited, dur @duration3(0), stacking HighPriority by spell_dmg_taken_up max 0; 黑板默认 {"spell_dmg_taken_up":0,"duration3":0,"duration_dynamic":0}
- 属性修正: 无
- 伤害修正: Defender: DamageScaleProcessor NormalCalcZone  @spell_dmg_taken_up(0) cond=[CheckDamageTypeMask]
```
on DuringBuffEnable:
  SaveBuffLifeTime
  CreateBuff [buff_wpn_funnel_0016_will_icon{duration=@duration3,duration_dynamic=@duration_dynamic}] → Owner count=1 child
```

### buff_wpn_funnel_0016_will_dmg
- life Limited, dur @duration4(0), stacking HighPriority by spell_dmg_taken_up2 max 0; 黑板默认 {"spell_dmg_taken_up2":0,"duration4":0,"duration_dynamic":0}
- 属性修正: 无
- 伤害修正: Defender: DamageScaleProcessor NormalCalcZone  @spell_dmg_taken_up2(0) cond=[CheckDamageTypeMask]
```
on DuringBuffEnable:
  SaveBuffLifeTime
  CreateBuff [buff_wpn_funnel_0016_will_icon{duration=@duration4,duration_dynamic=@duration_dynamic}] → Owner count=1 child
```

### buff_wpn_funnel_0016_will_icon
- life Limited, dur @duration(0), stacking Stack max 99; 黑板默认 {"duration":0,"duration_dynamic":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  SetBuffDurationAction
```

### buff_wpn_funnel_0016_wisd
- life Infinity, dur @duration(0), stacking Unique max 0; 黑板默认 {"spell_dmg_up":0,"duration":0,"atk_up2":0,"duration2":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnCharBeforeOutputSpellInfliction:
  CheckOriginSkillType
  CreateBuff [buff_wpn_funnel_0016_wisd_natureup{spell_dmg_up=@spell_dmg_up,duration=@duration}] → Owner count=1 child
on ability OnBeforeOutputBuff:
  CheckBuffIdInContextAdvanced
  CheckOriginSkillType
  CreateBuff [buff_wpn_funnel_0016_wisd_atkup{atk_up2=@atk_up2,duration2=@duration2}] → Owner count=1 child
```

### buff_wpn_funnel_0016_wisd_atkup
- life Limited, dur @duration2(0), stacking Refresh max 0; 黑板默认 {"atk_up2":0,"duration2":0}
- 属性修正: Atk BaseMultiplier @atk_up2(0)
- 伤害修正: 无
```
```

### buff_wpn_funnel_0016_wisd_natureup
- life Limited, dur @duration(0), stacking Refresh max 0; 黑板默认 {"spell_dmg_up":0,"duration":0}
- 属性修正: NaturalDamageIncrease BaseAddition @spell_dmg_up(0); CrystDamageIncrease BaseAddition @spell_dmg_up(0); PulseDamageIncrease BaseAddition @spell_dmg_up(0); FireDamageIncrease BaseAddition @spell_dmg_up(0)
- 伤害修正: 无
```
```
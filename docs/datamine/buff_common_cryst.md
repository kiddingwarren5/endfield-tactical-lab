# 解包清单：buff_common_cryst

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（0）


## 增益（13）

### buff_common_cryst_cryst_frozen_triggered
- life Limited, dur 3, stacking Unlimited key=cryst_triggered max 1; 黑板默认 {"count":1,"duration":0,"consumed_type":2,"consumed_layer":0,"extra_duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  ReadSkillSettingData
  BB duration Add @extra_duration(0) on Owner
  CreateBuff [buff_common_cryst_cryst_frozen_triggered_do{count=@count,duration=@duration,consumed_type=@consumed_type,consumed_layer=@consumed_layer}] → Owner count=1
```

### buff_common_cryst_cryst_frozen_triggered_do
- life Limited, dur @duration(5), stacking Stack key=cryst_triggered max 1; 黑板默认 {"duration":5,"phy_dmg_up":0.2,"final_phy_dmg_up":0,"count":1}; tags [{"tagId":1535684437}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CheckSuperArmor
  CreateBuff [buff_common_frozen{duration=@duration}] → Owner count=1
  (表现类: PlaySoundAction×1)
  If [CheckSuperArmor]
    (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_start] → Owner count=1
on OnBuffStart:
  StoreAttributeValue
  CreateBuff [buff_common_cryst_triggered_fx] → Owner count=1
on OnBuffStart:
  OnSpellAbnormalStartFinish
on OnBuffFinish:
  OnSpellAbnormalStartFinish
```

### buff_common_cryst_cryst_triggered
- life Limited, dur 5, stacking Unlimited max 0; 黑板默认 {"duration":20,"atk_scale":0}; tags [{"tagId":-1355740998}]
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  IgniteBuffTextAction
  (表现类: EffectAction×1 PlaySoundAction×1)
on OnBuffTrigger:
  TriggerSpellBurstEventAction
  ReadSkillSettingData
  Damage target=Owner units=[Cryst/Hp scale=50 calc=AtkScaleCalculation(@atk_scale(0)) nonSimple mask=8388608]
  (表现类: EnemyHurtAnimAction×1 EffectAction×1 CameraImpulseAction×1 HitStopAction×1 PlaySoundAction×1)
on OnBuffStart:
  OnSpellAbnormalStartFinish
on OnBuffFinish:
  OnSpellAbnormalStartFinish
```

### buff_common_cryst_cryst_triggered_infinity_lv008
- life Limited, dur 3600, stacking Stack key=cryst_triggered max 1; 黑板默认 {"duration":20,"count":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CheckSuperArmor
  CreateBuff [buff_common_frozen{duration=3600}] → Owner count=1
  (表现类: PlaySoundAction×1)
  (表现类: EffectAction×1)
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_start] → Owner count=1
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_fx] → Owner count=1
  Damage target=Owner units=[Cryst/Hp scale=50 calc=AtkScaleCalculation(1) nonSimple mask=0]
```

### buff_common_cryst_cryst_triggered_infinity_rdg003
- life Limited, dur 3600, stacking Stack key=cryst_triggered max 1; 黑板默认 {"duration":20,"count":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CheckSuperArmor
  CreateBuff [buff_common_frozen{duration=3600}] → Owner count=1
  (表现类: PlaySoundAction×1)
  If [CheckSuperArmor]
    (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_start] → Owner count=1
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_fx] → Owner count=1
  Damage target=Owner units=[Cryst/Hp scale=50 calc=AtkScaleCalculation(1) nonSimple mask=0]
on OnBuffStart:
  OnSpellAbnormalStartFinish
on OnBuffFinish:
  OnSpellAbnormalStartFinish
```

### buff_common_cryst_cryst_triggered_infinity_train
- life Limited, dur 3600, stacking Stack key=cryst_triggered max 1; 黑板默认 {"duration":20,"count":0}; tags [{"tagId":1535684437}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CheckSuperArmor
  CreateBuff [buff_common_frozen{duration=3600}] → Owner count=1
  (表现类: PlaySoundAction×1)
  If [CheckSuperArmor]
    (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_start] → Owner count=1
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_fx] → Owner count=1
  Damage target=Owner units=[Cryst/Hp scale=50 calc=AtkScaleCalculation(1) nonSimple mask=32]
on OnBuffStart:
  OnSpellAbnormalStartFinish
on OnBuffFinish:
  OnSpellAbnormalStartFinish
```

### buff_common_cryst_fire_triggered
- life Limited, dur @duration(5), stacking Stack key=cryst_triggered max 1; 黑板默认 {"duration":5,"phy_dmg_up":0.2,"final_phy_dmg_up":0,"count":0,"atk_scale":0,"shatter_dmg":0,"consumed_layer":0}; tags [{"tagId":1535684437}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  CheckSuperArmor
  CreateBuff [buff_common_frozen{duration=@duration}] → Owner count=1
  (表现类: PlaySoundAction×1)
  If [CheckSuperArmor]
    (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_start] → Owner count=1
on OnBuffStart:
  StoreAttributeValue
  Damage target=Owner units=[Cryst/Hp scale=50 calc=AtkScaleCalculation(@atk_scale(0)) nonSimple mask=32]
  CreateBuff [buff_common_cryst_triggered_fx] → Owner count=1
on OnBuffStart:
  OnSpellAbnormalStartFinish
on OnBuffFinish:
  OnSpellAbnormalStartFinish
```

### buff_common_cryst_natural_triggered
- life Limited, dur @duration(5), stacking Stack key=cryst_triggered max 1; 黑板默认 {"duration":5,"phy_dmg_up":0.22,"final_phy_dmg_up":0,"shatter_dmg":0,"atk_scale":0,"count":0,"consumed_layer":0}; tags [{"tagId":1535684437}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  If [CheckSuperArmor]
    (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
  CheckSuperArmor
  CreateBuff [buff_common_frozen{duration=@duration}] → Owner count=1
  (表现类: PlaySoundAction×1)
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_start] → Owner count=1
on OnBuffStart:
  StoreAttributeValue
  Damage target=Owner units=[Cryst/Hp scale=50 calc=AtkScaleCalculation(@atk_scale(0)) nonSimple mask=32]
  CreateBuff [buff_common_cryst_triggered_fx] → Owner count=1
on OnBuffStart:
  OnSpellAbnormalStartFinish
on OnBuffFinish:
  OnSpellAbnormalStartFinish
```

### buff_common_cryst_pulse_triggered
- life Limited, dur @duration(5), stacking Stack key=cryst_triggered max 1; 黑板默认 {"duration":5,"phy_dmg_up":0.2,"final_phy_dmg_up":0,"atk_scale":0,"shatter_dmg":0,"count":0,"consumed_layer":0}; tags [{"tagId":1535684437}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  If [CheckSuperArmor]
    (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
  CheckSuperArmor
  CreateBuff [buff_common_frozen{duration=@duration}] → Owner count=1
  (表现类: PlaySoundAction×1)
on OnBuffStart:
  CreateBuff [buff_common_cryst_triggered_start] → Owner count=1
on OnBuffStart:
  StoreAttributeValue
  CreateBuff [buff_common_cryst_triggered_fx] → Owner count=1
  Damage target=Owner units=[Cryst/Hp scale=50 calc=AtkScaleCalculation(@atk_scale(0)) nonSimple mask=32]
on OnBuffStart:
  OnSpellAbnormalStartFinish
on OnBuffFinish:
  OnSpellAbnormalStartFinish
```

### buff_common_cryst_triggered
- life Limited, dur 5, stacking Unlimited max 0; 黑板默认 {"duration":20}
- 属性修正: PhysicalDmgResistScalar BaseAddition 0.2
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_frozen{duration=5}] → Owner count=1
on OnBuffStart:
  Damage target=Owner units=[Cryst/Hp scale=50 calc=PrimaryAttrCalculation() nonSimple mask=32]
  FlowTextAction
```

### buff_common_cryst_triggered_fx
- life Limited, dur 5, stacking Unlimited max 0; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  (表现类: EnemyHurtAnimAction×1 EffectAction×1 CameraImpulseAction×1 HitStopAction×1 PlaySoundAction×1)
```

### buff_common_cryst_triggered_physical_break
- life Limited, dur 5, stacking Unlimited max 0; 黑板默认 {"atk_scale":0}; tags [{"tagId":-615023885}]
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  Damage target=Owner units=[Physical/Hp scale=50 calc=AtkScaleCalculation(@atk_scale(0)) nonSimple mask=134217728]
  IgniteBuffTextAction
  (表现类: EffectAction×1 PlaySoundAction×1)
```

### buff_common_cryst_triggered_start
- life Limited, dur 3, stacking Unlimited key=cryst_triggered max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  IgniteBuffTextAction
```
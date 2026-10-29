# 解包清单：chr_0027_tangtang

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（30）

### chr_0027_tangtang_attack1
- 文件黑板: {"atk_scale":0.25,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 90 (3.00s), exclusiveFrame 15 (0.50s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.51,"atb":0}; L1 黑板 {"atk_scale":0.23,"atb":0}
```
f0-90 Anim Attack01 dur=3
f0-6 (表现类: SelfRotateAction×1)
f0-90 (表现类: CustomRootMotionAction×1)
f0-2 CheckEntityNum
SnapToTargetWithRangeAction
f3-21 (表现类: EffectAction×1)
f3-3 Projectile projectile_chr_0027_tangtang_attack1 onHit=chr_0027_tangtang_attack1_projhit
f0-15 (表现类: SetSuperArmorAction×1)
f36-61 (表现类: EffectAction×1)
f0-90 (表现类: CharWeaponVisibleAction×1)
f0-90 (表现类: CharWeaponVisibleAction×1)
f3-41 (表现类: VoiceTriggerAction×1)
f3-48 (表现类: PlaySoundAction×1)
f39-72 (表现类: PlaySoundAction×1)
f34-44 (表现类: PlaySoundAction×1)
f0-30 ComboCache [Attack→chr_0027_tangtang_attack2]
f7-30 AllowNext [chr_0027_tangtang_attack2]
```

### chr_0027_tangtang_attack1_projhit
- 文件黑板: {"atk_scale":0.1,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-3 Damage target=Target units=[Cryst/Hp scale=@atk_scale(0.1) mask=128]
If [CheckEntityNum]
If [?isMainChar Source && CheckEntityNum]
  (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
```

### chr_0027_tangtang_attack2
- 文件黑板: {"atk_scale_1":0,"atb":0,"atk_scale_2":0}; cast cost UltimateSp 0; cd 0; durationFrame 117 (3.90s), exclusiveFrame 18 (0.60s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale_1":0.23,"atk_scale_2":0.34,"display_atk_scale":0.56,"atb":0}; L1 黑板 {"atk_scale_1":0.1,"atk_scale_2":0.15,"display_atk_scale":0.25,"atb":0}
```
f0-117 Anim Attack02 dur=3.9
f0-6 (表现类: SelfRotateAction×1)
f0-117 (表现类: CustomRootMotionAction×1)
f11-23 (表现类: EffectAction×1)
f6-24 (表现类: EffectAction×1)
f6-6 Projectile projectile_chr_0027_tangtang_attack2 onHit=chr_0027_tangtang_attack2_projhit
f10-10 Projectile projectile_chr_0027_tangtang_attack2_2 onHit=chr_0027_tangtang_attack2_02_projhit
f0-18 (表现类: SetSuperArmorAction×1)
f10-31 (表现类: EffectAction×1)
f10-19 (表现类: EffectAction×1)
f0-117 (表现类: CharWeaponVisibleAction×1)
f0-117 (表现类: CharWeaponVisibleAction×1)
f0-38 (表现类: VoiceTriggerAction×1)
f6-34 (表现类: PlaySoundAction×1)
f10-54 (表现类: PlaySoundAction×1)
f68-91 (表现类: PlaySoundAction×1)
f0-39 ComboCache [Attack→chr_0027_tangtang_attack3]
f18-39 AllowNext [chr_0027_tangtang_attack3]
```

### chr_0027_tangtang_attack2_02_projhit
- 文件黑板: {"atk_scale_2":0.09,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-3 Damage target=Target units=[Cryst/Hp scale=@atk_scale_2(0.09) mask=128]
If [CheckEntityNum]
If [?isMainChar Source && CheckEntityNum]
  ObtainCost Atb Gain value=@atb(0)×0.5 src=NormalAttack onlyMain → Source
  (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
```

### chr_0027_tangtang_attack2_projhit
- 文件黑板: {"atk_scale_1":0.09,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-3 Damage target=Target units=[Cryst/Hp scale=@atk_scale_1(0.09) mask=128]
If [CheckEntityNum]
If [?isMainChar Source && CheckEntityNum]
  (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
```

### chr_0027_tangtang_attack3
- 文件黑板: {"atk_scale_1":0,"atb":0,"atk_scale_2":0}; cast cost UltimateSp 0; cd 0; durationFrame 115 (3.83s), exclusiveFrame 30 (1.00s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale_1":0.11,"atk_scale_2":0.06,"display_atk_scale":0.79,"atb":0}; L1 黑板 {"atk_scale_1":0.05,"atk_scale_2":0.03,"display_atk_scale":0.35,"atb":0}
```
f0-115 Anim Attack03 dur=3.83333325
f0-1 (表现类: SelfRotateAction×1)
f13-16 (表现类: SelfRotateAction×1)
f0-115 (表现类: CustomRootMotionAction×1)
f1-7 CheckEntityNum
SnapToTargetWithRangeAction
f5-13 ContinuousFindTargetAction
f5-13 Channeling every 0.06s max/target=-1
  Damage target=Target units=[Cryst/Hp scale=@atk_scale_1(0.11) mask=128]
  If [?isMainChar Source:tar]
    (表现类: CameraImpulseAction×1 HitStopAction×1)
  (表现类: EnemyHurtAnimAction×1)
f17-17 Projectile projectile_chr_0027_tangtang_attack3 onHit=chr_0027_tangtang_attack3_projhit
f17-17 Projectile projectile_chr_0027_tangtang_attack3 onHit=chr_0027_tangtang_attack3_projhit
f18-18 Projectile projectile_chr_0027_tangtang_attack3 onHit=chr_0027_tangtang_attack3_projhit
f18-18 Projectile projectile_chr_0027_tangtang_attack3 onHit=chr_0027_tangtang_attack3_projhit
f13-54 (表现类: EffectAction×1)
f2-43 (表现类: EffectAction×1)
f13-54 (表现类: EffectAction×1)
f16-57 (表现类: EffectAction×1)
f4-45 (表现类: EffectAction×1)
f0-18 (表现类: EffectAction×1)
f2-41 (表现类: EffectAction×1)
f3-21 (表现类: EffectAction×1)
f4-22 (表现类: EffectAction×1)
f0-30 (表现类: SetSuperArmorAction×1)
f24-69 (表现类: EffectAction×1)
f0-115 (表现类: CharWeaponVisibleAction×1)
f0-115 (表现类: CharWeaponVisibleAction×1)
f2-40 (表现类: VoiceTriggerAction×1)
f0-53 (表现类: PlaySoundAction×1)
f16-65 (表现类: PlaySoundAction×1)
f3-44 (表现类: PlaySoundAction×1)
f57-83 (表现类: PlaySoundAction×1)
f16-53 (表现类: PlaySoundAction×1)
f0-43 ComboCache [Attack→chr_0027_tangtang_attack4]
f26-43 AllowNext [chr_0027_tangtang_attack4]
```

### chr_0027_tangtang_attack3_projhit
- 文件黑板: {"atk_scale_2":0,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-3 Damage target=Target units=[Cryst/Hp scale=@atk_scale_2(0) mask=128]
If [?isMainChar Source && CheckEntityNum]
  (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
```

### chr_0027_tangtang_attack4
- 文件黑板: {"atk_scale_1":0.15,"atb":0,"atk_scale_2":0}; cast cost UltimateSp 0; cd 0; durationFrame 143 (4.77s), exclusiveFrame 28 (0.93s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale_1":0.18,"atk_scale_2":0.46,"display_atk_scale":0.82,"atb":0}; L1 黑板 {"atk_scale_1":0.08,"atk_scale_2":0.21,"display_atk_scale":0.37,"atb":0}
```
f0-143 Anim Attack04 dur=4.766667
f0-5 (表现类: SelfRotateAction×1)
f12-15 (表现类: SelfRotateAction×1)
f17-20 (表现类: SelfRotateAction×1)
f0-143 (表现类: CustomRootMotionAction×1)
f2-7 CheckEntityNum
SnapToTargetWithRangeAction
f6-8 FindTargetAction
f10-12 FindTargetAction
f23-28 FindTargetAction
f6-8 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale_1(0.18) mask=128]
If [?isMainChar Source:tar]
  (表现类: CameraImpulseAction×1 HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f10-12 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale_1(0.18) mask=128]
If [?isMainChar Source:tar]
  (表现类: CameraImpulseAction×1 HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f23-28 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale_2(0.46) mask=128]
If [?isMainChar Source:tar]
  (表现类: CameraImpulseAction×1 HitStopAction×2)
(表现类: EnemyHurtAnimAction×1 EffectAction×1)
f0-28 (表现类: SetSuperArmorAction×1)
f21-68 (表现类: EffectAction×1)
f2-15 (表现类: EffectAction×1)
f0-56 (表现类: EffectAction×1)
f0-56 (表现类: EffectAction×1)
f4-22 (表现类: EffectAction×1)
f10-28 (表现类: EffectAction×1)
f10-28 (表现类: EffectAction×1)
f13-31 (表现类: EffectAction×1)
f7-55 (表现类: EffectAction×1)
f11-59 (表现类: EffectAction×1)
f0-143 (表现类: CharWeaponVisibleAction×1)
f0-143 (表现类: CharWeaponVisibleAction×1)
f2-40 (表现类: VoiceTriggerAction×1)
f0-46 (表现类: PlaySoundAction×1)
f4-45 (表现类: PlaySoundAction×1)
f18-69 (表现类: PlaySoundAction×1)
f11-52 (表现类: PlaySoundAction×1)
f63-117 (表现类: PlaySoundAction×1)
f0-50 ComboCache [Attack→chr_0027_tangtang_attack5]
f24-50 AllowNext [chr_0027_tangtang_attack5]
```

### chr_0027_tangtang_attack4_projhit
- 文件黑板: {"atk_scale":0,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-3 Damage target=Target units=[Cryst/Hp scale=@atk_scale(0) mask=128]
If [?isMainChar Source && CheckEntityNum]
  ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack onlyMain → Source
  (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f0-3 If [CheckEntityNum]
f0-3 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_attack5
- 文件黑板: {"atk_scale":0.25,"poise":20,"cnt":"dyn","atb":8}; cast cost UltimateSp 0; cd 0; durationFrame 190 (6.33s), exclusiveFrame 36 (1.20s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":1.13,"poise":18,"atb":18}; L1 黑板 {"atk_scale":0.5,"poise":18,"atb":18}
```
f0-190 PlayAnimationWithStep
f0-12 (表现类: SelfRotateAction×1)
f12-21 (表现类: SelfRotateAction×1)
f0-23 (表现类: CustomRootMotionAction×1)
f23-190 (表现类: CustomRootMotionAction×1)
f22-22 Projectile projectile_chr_0027_tangtang_attack5 onHit=chr_0027_tangtang_attack5_projhit
f22-25 If [?isMainChar Source:tar]
  (表现类: CameraImpulseAction×1)
f22-187 (表现类: EffectAction×1)
f22-187 (表现类: EffectAction×1)
f0-36 (表现类: SetSuperArmorAction×1)
f1-22 (表现类: AddDynamicCcsAction×1)
f22-33 (表现类: AddDynamicCcsAction×1)
f11-86 (表现类: EffectAction×1)
f22-82 (表现类: EffectAction×1)
f22-82 (表现类: EffectAction×1)
f33-70 (表现类: EffectAction×1)
f2-18 (表现类: EffectAction×1)
f2-13 (表现类: EffectAction×1)
f9-84 (表现类: EffectAction×1)
f38-49 (表现类: EffectAction×1)
f38-49 (表现类: EffectAction×1)
f22-31 (表现类: EffectAction×1)
f0-190 (表现类: CharWeaponVisibleAction×1)
f0-190 (表现类: CharWeaponVisibleAction×1)
f0-26 (表现类: PlaySoundAction×1)
f20-114 (表现类: PlaySoundAction×1)
f38-180 (表现类: PlaySoundAction×1)
f4-19 (表现类: VoiceTriggerAction×1)
f0-77 ComboCache [Attack→chr_0027_tangtang_attack1]
f36-77 AllowNext [chr_0027_tangtang_attack1]
```

### chr_0027_tangtang_attack5_projhit
- 文件黑板: {"atk_scale":0,"poise":0,"atb":0,"cnt":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-3 Damage target=Target units=[Cryst/Hp scale=@atk_scale(0) mask=2097280]
If [CheckEntityNum]
If [?isMainChar Source && CheckEntityNum]
  Damage target=Target units=[Cryst/Poise scale=0 mask=0]
  ?@EntityBB_atk05_cnt LT 1
  ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack → Source
  BB EntityBB_atk05_cnt Add 1 on Owner
  (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
```

### chr_0027_tangtang_combo_skill
- 文件黑板: {"duration":3,"poise":0,"usp":0,"talent1_speed":"dyn","atk_scale":0.8,"ratio_speed":0,"duration_talent1buff":"dyn","duration_water":"dyn","ratio_speedreduction":"dyn","range_talent1buff":"dyn","potential1":"dyn","potential5":"dyn","max_stack":"dyn","dmg_up_water_ult":"dyn","talent2":"dyn","potential3_duration":"dyn","potential5_dmg_up_water_ult":"dyn","cam_angle2":"dyn","cam_duration2":"dyn","input_angle2":"dyn","owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","tar_cnt":"dyn","combowater_cnt":"dyn"}; cast cost UltimateSp 0; cd 10; durationFrame 200 (6.67s), exclusiveFrame 41 (1.37s)
- 等级表 L12: cost UltSp 0, cd 12, 黑板 {"atk_scale":2.4,"usp":10,"duration_water":30,"poise":10}; L1 黑板 {"atk_scale":1.067,"usp":10,"duration_water":30,"poise":10}
```
f0-200 Anim ComboSkill dur=6.66666651
f0-1 FindTargetAction
FindTargetAction
ConvertToTargetContext
If [?isMainChar Source]
  else
  TeleportPosSelectAction
  (表现类: TeleportAction×1 SelfRotateAction×1 EffectAction×1)
f0-3 (表现类: SelfRotateAction×1)
f11-16 (表现类: SelfRotateAction×1)
f0-92 (表现类: CustomRootMotionAction×1)
f26-29 FindTargetAction
f26-29 CheckEntityNum
If [?@combowater_cnt LE 0]
  BB combowater_cnt Assign 1 on Owner
  TargetPostProcessorAction
  If [?BuffStack buff_chr_0027_tangtang_water BuffCount GT 0 on Source]
    FindTargetAction
    If [CheckTimedMarkerCondition]
      If [CheckTimedMarkerCondition]
        Projectile projectile_chr_0027_tangtang_water
        else
        Projectile projectile_chr_0027_tangtang_water
      else
      If [CheckTimedMarkerCondition]
        Projectile projectile_chr_0027_tangtang_water
        else
        Projectile projectile_chr_0027_tangtang_water
    else
    Projectile projectile_chr_0027_tangtang_water
Interrupt → Context:tar
Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(2.4) mask=12288]
Damage target=Context:tar units=[Cryst/Poise scale=0 mask=0]
If [?@tar_cnt LE 0]
  ObtainCost UltimateSp Gain value=@usp(10)×1 src=Default → Source
  BB tar_cnt Assign 1 on Owner
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1 HitStopAction×2)
f26-29 If [?isMainChar Source:tar]
f26-29 (表现类: CameraImpulseAction×1)
f0-26 If [?isMainChar Source:tar]
  (表现类: AddDynamicCcsAction×1 OverrideCameraFollowAction×1)
f24-99 (表现类: EffectAction×1)
f23-71 (表现类: EffectAction×1)
f3-30 (表现类: EffectAction×1)
f10-72 (表现类: EffectAction×1)
f10-72 (表现类: EffectAction×1)
f1-30 (表现类: EffectAction×1)
f0-15 If [CheckEntityNum && ?isMainChar Owner]
  SaveTwoDirectionAngle
  CurveEvaluateFloat
  CurveEvaluateFloat
  CameraRotateAction
f0-23 TimeDilation Global dur=0.867 curve=ComboSkill
f0-22 If [?isMainChar Owner]
  else
  FindTargetAction
  SaveTargetDistanceAction
  If [CheckComboSkillCameraAlphaSetting]
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
    else
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
f0-23 If [?isMainChar Owner]
  else
  TemporaryUnlockAction
f0-23 (表现类: OverrideCameraFollowAction×1)
f0-41 (表现类: SetSuperArmorAction×1)
f0-5 TimeDilation Entity dur=0.15 curve=ComboSkill
f0-93 ComboCache [NormalSkill→chr_0027_tangtang_normal_skill]
f31-93 AllowNext [chr_0027_tangtang_normal_skill]
f0-200 (表现类: CharWeaponVisibleAction×1)
f0-200 (表现类: CharWeaponVisibleAction×1)
f0-97 (表现类: PlaySoundAction×1)
f22-116 (表现类: PlaySoundAction×1)
f83-165 (表现类: PlaySoundAction×1)
f12-67 (表现类: PlaySoundAction×1)
f5-20 (表现类: VoiceTriggerAction×1)
```

### chr_0027_tangtang_combo_skill_water
- 文件黑板: {"atk_scale_water":1,"talent1_speed":"dyn","ratio_speed":"dyn","duration_talent1buff":"dyn","ratio_speedreduction":"dyn","tornado_atk_scale01":"dyn","tornado_atk_scale02":"dyn","tornado_atk_scale03":"dyn","max_stack":"dyn","potential1":"dyn","potential5":"dyn","talent2_ultskill":"dyn","range_talent1buff":"dyn","potential5_dmg_up_water_ult":"dyn","potential3_duration":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 1550 (51.67s), exclusiveFrame 1550 (51.67s)
```
f1500-1501 FindTargetAction
FindTargetAction
If [CheckTimedMarkerCondition]
  Projectile projectile_chr_0027_tangtang_waterwake01
  else
  If [CheckTimedMarkerCondition]
    Projectile projectile_chr_0027_tangtang_waterwake01
    else
    Projectile projectile_chr_0027_tangtang_waterwake01
FinishBuff buff_chr_0027_tangtang_water layers=1 on Source
f1515-1516 FindTargetAction
FindTargetAction
If [CheckDistanceCondition && CheckEntityNum]
  If [CheckTimedMarkerCondition]
    Projectile projectile_chr_0027_tangtang_waterwake01
    else
    If [CheckTimedMarkerCondition]
      Projectile projectile_chr_0027_tangtang_waterwake01
      else
      Projectile projectile_chr_0027_tangtang_waterwake01
  FinishBuff buff_chr_0027_tangtang_water layers=1 on Source
f0-1500 (表现类: EffectAction×1)
f0-71 (表现类: EffectAction×1)
f0-71 (表现类: EffectAction×1)
f0-1500 JumpToAction
f0-1500 JumpToAction
f1500-1501 FinishOwnerAction
f1515-1516 FinishOwnerAction
f900-901 FinishOwnerAction
FinishBuff buff_chr_0027_tangtang_water layers=1 on Source
(表现类: EffectAction×1)
f1500-1501 FinishOwnerAction
f1515-1516 FinishOwnerAction
f0-1500 ?@talent1_speed GE 1
AuraAction
AuraAction
(表现类: EffectAction×1)
f0-705 (表现类: PlaySoundAction×1)
f0-1503 (表现类: PlaySoundAction×1)
f1500-1503 (表现类: PlaySoundAction×1)
f1515-1518 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_combo_skill_water_gene
- 文件黑板: {"radius":4,"potential1":0,"duration_water":30}; cast cost UltimateSp 0; cd 0; durationFrame 900 (30.00s), exclusiveFrame 900 (30.00s)
```
f0-1 If [?BuffStack buff_chr_0027_tangtang_water BuffCount GT 0 on Source]
  Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water {=@}
  CreateBuff [buff_chr_0027_tangtang_water{duration_water=@duration_water}] → Source count=1
  FindTargetAction
  If [CheckTimedMarkerCondition]
    If [CheckTimedMarkerCondition]
      CreateTimedMarker
      else
      CreateTimedMarker
    else
    CreateTimedMarker
  else
  Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water
  CreateBuff [buff_chr_0027_tangtang_water{duration_water=@duration_water}] → Source count=1
  CreateTimedMarker
```

### chr_0027_tangtang_dodge
- 文件黑板: {}; cast cost UltimateSp 0; cd 0; durationFrame 135 (4.50s), exclusiveFrame 12 (0.40s)
```
f0-135 Anim Dodge dur=4.5
f0-3 (表现类: SelfRotateAction×1)
f0-80 (表现类: CustomRootMotionAction×1)
f0-13 If [CheckBuffStackNum]
  ComboCache [Attack→chr_0017_yvonne_ult_attack2_1]
  else
  ComboCache [Attack→chr_0017_yvonne_dash_attack]
f9-13 AllowNext [chr_0017_yvonne_attack1,chr_0017_yvonne_attack2,chr_0017_yvonne_attack3,chr_0017_yvonne_attack4,chr_0017_yvonne_attack5,chr_0017_yvonne_ult_attack1_1,chr_0017_yvonne_ult_attack1_2,chr_0017_yvonne_ult_attack2_1,chr_0017_yvonne_ult_attack2_2,chr_0017_yvonne_ult_attack3_1,chr_0017_yvonne_ult_attack3_2]
f0-10 (表现类: EffectAction×1)
f0-29 (表现类: EffectAction×1)
f0-29 (表现类: EffectAction×1)
f0-3 FinishBuffAction
f0-135 (表现类: CharWeaponVisibleAction×1)
f0-135 (表现类: CharWeaponVisibleAction×1)
f0-29 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_normal_skill
- 文件黑板: {"atk_scale_1":0.15,"poise1":0,"input_angle":"dyn","cam_duration":"dyn","potential3":"dyn","potential5":"dyn","atb_return":"dyn","atk_scale_02":0,"water_cnt":"dyn","poise_tornado":0,"hit_duration":5,"duration":5,"hit_cnt":4,"hit_cntmax":10,"tornado_atk_scale01":"dyn","tornado_atk_scale02":"dyn","tornado_atk_scale03":"dyn","cam_angle":"dyn","tornado_usp_01":0,"tornado_usp_02":0,"normalskillwatermove_cnt":"dyn","potential_5_CrystDamageIncrease":"dyn","potential5_duration":"dyn","max_stack":"dyn","duration_spellvulnerable":"dyn","rate_spellvulnerable":"dyn","atb_return_02":"dyn","rate_spellvulnerable_02":"dyn","talent2_ultskill":"dyn","talent2":"dyn","duration_tornado":3}; cast cost Atb 40; cd 0; durationFrame 136 (4.53s), exclusiveFrame 50 (1.67s)
- 等级表 L12: cost Atb 100, cd 0, 黑板 {"atk_scale_1":0.36,"display_atk_scale1":1.8,"display_atk_scale2":3,"poise1":2,"poise_tornado":0,"display_poise":10,"atb_return":20,"atb_return_02":40,"rate_spellvulnerable":0.05,"rate_spellvulnerable_02":0.1,"duration_spellvulnerable":15,"duration_tornado":3}; L1 黑板 {"atk_scale_1":0.16,"display_atk_scale1":0.8,"display_atk_scale2":1.33,"poise1":2,"poise_tornado":0,"display_poise":10,"atb_return":20,"atb_return_02":40,"rate_spellvulnerable":0.03,"rate_spellvulnerable_02":0.06,"duration_spellvulnerable":15,"duration_tornado":3}
```
f0-136 Anim Skill01 dur=4.5333333
f0-2 FindTargetAction
FindTargetAction
If [?isMainChar Source]
  else
  TeleportPosSelectAction
  CheckDistanceCondition
  (表现类: TeleportAction×1)
f0-2 If [CheckEntityNum]
  (表现类: SelfRotateAction×1)
  else
  (表现类: SelfRotateAction×1)
f13-22 CheckEntityNum
SnapToTargetWithRangeAction
f0-13 (表现类: CustomRootMotionAction×1)
f26-136 (表现类: CustomRootMotionAction×1)
f13-26 (表现类: CustomRootMotionAction×1)
f27-39 FindTargetAction
f27-39 Channeling every 0.033s max/target=5
  Damage target=Target units=[Cryst/Hp scale=@atk_scale_1(0.36) mask=4352 | Physical/Poise scale=0 mask=0]
  If [?isMainChar Source:tar]
  DoOnceAction
  (表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1 HitStopAction×2)
f25-37 If [?isMainChar Source:tar]
f25-37 (表现类: CameraImpulseAction×1)
f0-13 (表现类: SetSuperArmorAction×1)
f13-26 (表现类: SetSuperArmorAction×1)
f26-38 (表现类: SetSuperArmorAction×1)
f38-50 (表现类: SetSuperArmorAction×1)
f13-38 If [?isMainChar Owner]
  (表现类: AddDynamicCcsAction×1)
  else
  SaveTwoDirectionAngle
  If [?@input_angle LT 0]
    If [CheckDistanceCondition]
      AddCameraControlStateAction
      else
      If [CheckDistanceCondition]
        AddCameraControlStateAction
        else
        AddCameraControlStateAction
    else
    If [CheckDistanceCondition]
      AddCameraControlStateAction
      else
      If [CheckDistanceCondition]
        AddCameraControlStateAction
        else
        AddCameraControlStateAction
f13-25 If [?isMainChar Source]
  AddCameraControlStateAction
f0-16 If [CheckEntityNum && NotNextCheckAction && ?isMainChar Owner]
  SaveTwoDirectionAngle
  CurveEvaluateFloat
  CurveEvaluateFloat
  CameraRotateAction
f11-11 FindTargetAction
BB tornado_atk_scale01 Assign @EntityBB_abilityentity_water01 on Owner
BB tornado_atk_scale02 Assign @EntityBB_abilityentity_water02 on Owner
BB tornado_atk_scale03 Assign @EntityBB_abilityentity_water03 on Owner
If [CheckEntityNum]
  ForEachAction
  If [?@water_cnt Equals 1]
    ObtainCost Atb Return value=@atb_return(20)×1 src=Skill → Source
    else
    If [?@water_cnt Equals 2]
      ObtainCost Atb Return value=@atb_return(20)×2 src=Skill → Source
  Spawn abilityentity_chr_0027_tangtang_normal_skill_move skill=chr_0027_tangtang_normal_skill_abilityentitymove
  CreateBuff [buff_chr_0027_tangtang_normalskill_abilityentity_1] → Context:normalskill_watermove count=1
  else
  Spawn abilityentity_chr_0027_tangtang_normal_skill_move skill=chr_0027_tangtang_normal_skill_abilityentitymove
  CreateBuff [buff_chr_0027_tangtang_normalskill_abilityentity_1] → Context:normalskill_watermove_1 count=1
f44-45 FindTargetAction
CheckEntityNum
ForEachAction
f0-76 ComboCache [NormalSkill→chr_0027_tangtang_normal_skill]
f50-76 AllowNext [chr_0027_tangtang_normal_skill]
f30-65 (表现类: EffectAction×1)
f1-24 CreateBuff [buff_chr_0027_tangtang_skillappear] → Owner count=1
f11-38 (表现类: EffectAction×1)
f23-50 (表现类: EffectAction×1)
f30-55 (表现类: EffectAction×1)
f30-55 (表现类: EffectAction×1)
f27-54 (表现类: EffectAction×1)
f28-55 (表现类: EffectAction×1)
f29-56 (表现类: EffectAction×1)
f30-57 (表现类: EffectAction×1)
f33-60 (表现类: EffectAction×1)
f37-64 (表现类: EffectAction×1)
f12-47 (表现类: EffectAction×1)
f1-65 (表现类: VoiceTriggerAction×1)
f0-60 (表现类: PlaySoundAction×1)
f24-135 (表现类: PlaySoundAction×1)
f27-83 (表现类: PlaySoundAction×1)
f0-179 (表现类: CharWeaponVisibleAction×1)
f0-179 (表现类: CharWeaponVisibleAction×1)
```

### chr_0027_tangtang_normal_skill_abilityentitymove
- 文件黑板: {"atk_scale":0.1,"poise":5,"hit_cnt":4,"poise_tornado":0,"duration":5,"hit_cntmax":10,"hit_duration":5,"water_cnt":"dyn","atk_scale_03":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 300 (10.00s), exclusiveFrame 300 (10.00s)
```
f12-12 If [?@water_cnt GT 0]
  If [?@water_cnt GE 2]
    Spawn abilityentity_chr_0027_tangtang_normal_skill_03 skill=chr_0027_tangtang_normal_skill_water_projhit_2
    Spawn abilityentity_chr_0027_tangtang_normal_skill_03_02 skill=chr_0027_tangtang_normal_skill_water_projhit_2
    Spawn abilityentity_chr_0027_tangtang_normal_skill_03_03 skill=chr_0027_tangtang_normal_skill_water_projhit_2
    BB water_cnt Assign 0 on Owner
    else
    Spawn abilityentity_chr_0027_tangtang_normal_skill_02 skill=chr_0027_tangtang_normal_skill_water_projhit_1
    Spawn abilityentity_chr_0027_tangtang_normal_skill_02_02 skill=chr_0027_tangtang_normal_skill_water_projhit_1
    BB water_cnt Assign 0 on Owner
  else
  Spawn abilityentity_chr_0027_tangtang_normal_skill skill=chr_0027_tangtang_normal_skill_water_projhit
  BB water_cnt Assign 0 on Owner
f298-298 FinishOwnerAction
f0-0 CreateBuff [buff_chr_0027_tangtang_normalskill_abilityentity_1] → Owner:normalskill_watermove count=1
```

### chr_0027_tangtang_normal_skill_projhit
- 文件黑板: {"atk_scale":0.1,"poise":5}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-0 FindTargetAction
If [CheckEntityNum]
Damage target=Context:tar units=[Cryst/Hp scale=2.85 calc=AtkScaleCalculation(@atk_scale(0.1)) nonSimple mask=256 | Cryst/Poise scale=@atk_scale(0.1) mask=0]
CreateBuff [buff_common_obtain_ultimate_sp] → Source count=1
?BuffStack buff_chr_0027_tangtang_comboskill_hit BuffCount GE 5 on Context:tar
Interrupt → Context:tar
SpellInfliction Cryst → Context:tar
FinishBuff buff_chr_0027_tangtang_comboskill_hit layers=5 on Context:tar
(表现类: EnemyHurtAnimAction×1)
```

### chr_0027_tangtang_normal_skill_water_projhit
- 文件黑板: {"atk_scale_1":0,"atb":0,"atk_scale_2":0,"hit_duration":5,"hit_cntmax":10,"duration":5,"hit_cnt":4,"poise_tornado":0,"hit_spelllnflictionmax_01":1,"atk_water":0,"tornado_atk_scale01":"dyn","potential5":"dyn","potential3":"dyn","talent2":"dyn","dmg_up_water_ult":"dyn","talent2_ultskill":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 95 (3.17s), exclusiveFrame 95 (3.17s)
```
f0-90 ContinuousFindTargetAction
f0-90 DoOnceAction
Channeling every 0.26s max/target=-1
  If [?BuffStack buff_chr_0027_tangtang_comboskill_spelllnfliction BuffCount LT @hit_spelllnflictionmax_01(1) on Target:tar]
    SpellInfliction Cryst → Target:tar
    CreateBuff [buff_chr_0027_tangtang_comboskill_spelllnfliction] → Target:tar count=1
  If [?@talent2_ultskill GE 1]
    Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 calc=MultiplyAttributeCalculation() mask=4352 procs=[DamageScaleProcessor NormalCalcZone @dmg_up_water_ult] | Physical/Poise scale=0 mask=0]
    If [CheckEntityNum]
      If [?isMainChar Source]
        (表现类: CameraImpulseAction×1)
        else
        (表现类: CameraImpulseAction×1)
      (表现类: EnemyHurtAnimAction×1)
    else
    Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 mask=4352 | Physical/Poise scale=0 mask=0]
    If [CheckEntityNum]
      If [?isMainChar Source]
        (表现类: CameraImpulseAction×1)
        else
        (表现类: CameraImpulseAction×1)
      (表现类: EnemyHurtAnimAction×1)
f0-85 (表现类: EffectAction×1)
f85-140 (表现类: EffectAction×1)
f90-90 FinishOwnerAction
f0-139 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_normal_skill_water_projhit_1
- 文件黑板: {"atk_scale_1":0,"atb":0,"atk_scale_2":0.2,"hit_duration":3,"hit_cntmax":10,"duration":5,"hit_cnt":4,"poise_tornado":0,"hit_spelllnflictionmax02":1,"tornado_atk_scale02":"dyn","potential3":"dyn","potential5":"dyn","duration_spellvulnerable":"dyn","rate_spellvulnerable":"dyn","tornado_atk_scale01":"dyn","tornado_atk_scale03":"dyn","talent2_ultskill":"dyn","dmg_up_water_ult":"dyn","hit_spellvulnerablemax":1}; cast cost UltimateSp 0; cd 0; durationFrame 95 (3.17s), exclusiveFrame 95 (3.17s)
```
f0-90 ContinuousFindTargetAction
f0-90 DoOnceAction
Channeling every 0.26s max/target=-1
  If [?BuffStack buff_chr_0027_tangtang_comboskill_spelllnfliction BuffCount LT @hit_spelllnflictionmax02(1) on Target]
    SpellInfliction Cryst → Target:tar
    CreateBuff [buff_chr_0027_tangtang_comboskill_spelllnfliction] → Target:tar count=1
  If [?BuffStack buff_chr_0027_tangtang_normalskill_spellvulnerable BuffCount LT @hit_spellvulnerablemax(1) on Target]
    CreateBuff [buff_chr_0027_tangtang_normalskill_spellvulnerable{duration_spellvulnerable=@duration_spellvulnerable,rate_spellvulnerable=@rate_spellvulnerable}] → Target:tar count=1
  If [?@talent2_ultskill GE 1]
    Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 calc=MultiplyAttributeCalculation() mask=4352 procs=[DamageScaleProcessor NormalCalcZone @dmg_up_water_ult] | Physical/Poise scale=0 mask=0]
    If [CheckEntityNum]
      If [?isMainChar Source]
        (表现类: CameraImpulseAction×1)
        else
        (表现类: CameraImpulseAction×1)
      (表现类: EnemyHurtAnimAction×1)
    else
    Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 mask=4352 | Physical/Poise scale=0 mask=0]
    If [CheckEntityNum]
      If [?isMainChar Source]
        (表现类: CameraImpulseAction×1)
        else
        (表现类: CameraImpulseAction×1)
      (表现类: EnemyHurtAnimAction×1)
f0-85 (表现类: EffectAction×1)
f85-119 (表现类: EffectAction×1)
f90-90 FinishOwnerAction
f0-90 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_normal_skill_water_projhit_2
- 文件黑板: {"atk_scale_1":0,"atb":0,"atk_scale_2":0,"hit_duration":3,"hit_cntmax":10,"duration":5,"hit_cnt":4,"poise_tornado":0,"hit_spelllnflictionmax02":1,"tornado_atk_scale03":"dyn","potential3":"dyn","potential5":"dyn","tornado_atk_scale02":"dyn","tornado_atk_scale01":"dyn","duration_spellvulnerable":"dyn","rate_spellvulnerable":"dyn","rate_spellvulnerable_02":"dyn","talent2_ultskill":"dyn","dmg_up_water_ult":"dyn","hit_spellvulnerablemax":1}; cast cost UltimateSp 0; cd 0; durationFrame 95 (3.17s), exclusiveFrame 95 (3.17s)
```
f0-90 ContinuousFindTargetAction
f0-90 DoOnceAction
Channeling every 0.26s max/target=-1
  If [?BuffStack buff_chr_0027_tangtang_comboskill_spelllnfliction BuffCount LT @hit_spelllnflictionmax02(1) on Target]
    SpellInfliction Cryst → Target:tar
    CreateBuff [buff_chr_0027_tangtang_comboskill_spelllnfliction] → Target:tar count=1
  If [?BuffStack buff_chr_0027_tangtang_normalskill_spellvulnerable BuffCount LT @hit_spellvulnerablemax(1) on Target]
    CreateBuff [buff_chr_0027_tangtang_normalskill_spellvulnerable{duration_spellvulnerable=@duration_spellvulnerable,rate_spellvulnerable=@rate_spellvulnerable_02}] → Context:tar count=1
  If [?@talent2_ultskill GE 1]
    Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 calc=MultiplyAttributeCalculation() mask=4352 procs=[DamageScaleProcessor NormalCalcZone @dmg_up_water_ult] | Physical/Poise scale=0 mask=0]
    If [CheckEntityNum]
      If [?isMainChar Source]
        (表现类: CameraImpulseAction×1)
        else
        (表现类: CameraImpulseAction×1)
      (表现类: EnemyHurtAnimAction×1)
    else
    Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 mask=4352 | Physical/Poise scale=0 mask=0]
    If [CheckEntityNum]
      If [?isMainChar Source]
        (表现类: CameraImpulseAction×1)
        else
        (表现类: CameraImpulseAction×1)
      (表现类: EnemyHurtAnimAction×1)
f0-89 (表现类: EffectAction×1)
f89-124 (表现类: EffectAction×1)
f90-90 FinishOwnerAction
f0-90 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_normal_skill_water_projhit_damage
- 文件黑板: {"atk_scale_1":0,"atb":0,"atk_scale_2":0,"hit_duration":3,"hit_cntmax":20,"duration":10,"hit_cnt":"dyn","poise_tornado":0,"tornado_atk_scale01":"dyn","tornado_atk_scale02":"dyn","tornado_atk_scale03":"dyn","talent2_ultskill":"dyn","hit_spelllnflictionmax_01":1,"dmg_up_water_ult":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 60 (2.00s), exclusiveFrame 60 (2.00s)
```
f0-60 Interrupt → Target:tar
If [?BuffStack buff_chr_0027_tangtang_comboskill_spelllnfliction BuffCount LT @hit_spelllnflictionmax_01(1) on Target]
  If [?BuffStack buff_chr_0027_tangtang_comboskill_hit BuffCount GE @hit_cnt on Target:tar]
    SpellInfliction Cryst → Target:tar
    CreateBuff [buff_chr_0027_tangtang_comboskill_spelllnfliction] → Target count=1
If [?@talent2_ultskill GE 1]
  Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 calc=MultiplyAttributeCalculation() mask=4352 procs=[DamageScaleProcessor NormalCalcZone @dmg_up_water_ult] | Physical/Poise scale=0 mask=0]
  If [CheckEntityNum]
    If [?isMainChar Source]
      (表现类: CameraImpulseAction×1)
      else
      (表现类: CameraImpulseAction×1)
    (表现类: EnemyHurtAnimAction×1)
  else
  Damage target=Target:tar units=[Cryst/Hp scale=@tornado_atk_scale01 mask=4352 | Physical/Poise scale=0 mask=0]
  If [CheckEntityNum]
    If [?isMainChar Source]
      (表现类: CameraImpulseAction×1)
      else
      (表现类: CameraImpulseAction×1)
    (表现类: EnemyHurtAnimAction×1)
```

### chr_0027_tangtang_passive_0
- 文件黑板: {"normalskill_atk_scale01":0,"normalskill_atk_scale02":0,"normalskill_atk_scale03":0,"atk_scale_water_ult":"dyn","talent2":"dyn","rate_spellvulnerable":0,"rate_spellvulnerable_02":0,"duration_spellvulnerable":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 22 (0.73s)
- 等级表 L12: cost Atb 0, cd 0, 黑板 {"normalskill_atk_scale01":0.25,"rate_spellvulnerable":0.05,"rate_spellvulnerable_02":0.1,"duration_spellvulnerable":15}; L1 黑板 {"normalskill_atk_scale01":0.111,"rate_spellvulnerable":0.03,"rate_spellvulnerable_02":0.06,"duration_spellvulnerable":15}
```
```

### chr_0027_tangtang_plunging_attack_end
- 文件黑板: {"atk_scale":0.33,"prob":0.5,"cd":15,"dmg_scale":2.5,"poise":5,"atb":0,"hit_cnt":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 118 (3.93s), exclusiveFrame 15 (0.50s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.45,"display_atk_scale":1.8,"atb":0}; L1 黑板 {"atk_scale":0.2,"display_atk_scale":0.8,"atb":0}
```
f0-118 Anim PlungingAttackEnd dur=3.9333334
f0-60 (表现类: CustomRootMotionAction×1)
f3-11 ContinuousFindTargetAction
f3-11 TickIntervalAction
  Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0.45) mask=1152]
  If [?@hit_cnt LT 1]
  PushBackAction
  If [?isMainChar Source:tar]
    If [CheckEntityNum]
    (表现类: CameraImpulseAction×1)
  BB hit_cnt Assign 1 on Owner
  (表现类: EnemyHurtAnimAction×1)
f3-11 Damage target=Context:tar units=[]
f2-6 If [?isMainChar Source:tar]
  (表现类: CameraImpulseAction×1)
f0-15 (表现类: SetSuperArmorAction×1)
f4-22 (表现类: EffectAction×1)
f4-22 (表现类: EffectAction×1)
f4-22 (表现类: EffectAction×1)
f4-22 (表现类: EffectAction×1)
f0-118 (表现类: CharWeaponVisibleAction×1)
f0-118 (表现类: CharWeaponVisibleAction×1)
f0-46 (表现类: PlaySoundAction×1)
f45-122 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_plunging_attack_start
- 文件黑板: {"atk_scale":0.25}; cast cost UltimateSp 0; cd 0; durationFrame 1500 (50.00s), exclusiveFrame 1500 (50.00s)
```
f0-32 Anim PlungingAttackStart dur=1.06666672
f32-1500 Anim PlungingAttackLoop dur=48.9333344
f0-1500 (表现类: SetSuperArmorAction×1)
f3-45 (表现类: EffectAction×1)
f0-6 (表现类: CharWeaponVisibleAction×1)
f6-1500 (表现类: CharWeaponVisibleAction×1)
f0-6 (表现类: CharWeaponVisibleAction×1)
f6-1500 (表现类: CharWeaponVisibleAction×1)
f0-86 (表现类: PlaySoundAction×1)
f1-16 (表现类: VoiceTriggerAction×1)
```

### chr_0027_tangtang_power_attack
- 文件黑板: {"atk_scale":0.8,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 121 (4.03s), exclusiveFrame 47 (1.57s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":9}; L1 黑板 {"atk_scale":4}
```
f0-121 Anim PowerAttack dur=4.0333333
f0-1 (表现类: SelfRotateAction×1)
f12-18 (表现类: SelfRotateAction×1)
f0-121 (表现类: CustomRootMotionAction×1)
f2-8 (表现类: SelfRotateAction×1)
f2-9 CheckEntityNum
If [CheckDistanceCondition]
  SnapToTargetWithRangeAction
  else
  SnapToTargetWithRangeAction
f9-9 Damage target=Target:tar units=[Cryst/Hp scale=4 calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
If [?isMainChar Owner]
  If [CheckEnemyRank]
    LaunchUpwardAction
    else
    If [CheckEnemyRank]
      LaunchUpwardAction
      else
      If [CheckEnemyRank]
        (表现类: EnemyHurtAnimAction×1)
If [CheckEntityNum]
  (表现类: HitStopAction×2)
(表现类: CameraImpulseAction×1)
f21-21 GainBreakingAttackAtb
Damage target=Target:tar units=[Cryst/Hp scale=1 calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
If [CheckEnemyRank]
  BlowOffAction
  (表现类: CameraImpulseAction×1)
  else
  If [CheckEnemyRank]
    BlowOffAction
    (表现类: CameraImpulseAction×1)
    else
    If [CheckEnemyRank]
      (表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
(表现类: HitStopAction×2)
f0-9 (表现类: AddDynamicCcsAction×1)
f9-23 (表现类: AddDynamicCcsAction×1)
f23-38 (表现类: AddDynamicCcsAction×1)
f9-23 ?isMainChar Source
CheckEntityNum
If [CheckTwoDirectionAngle]
  LockCameraAimAction
  else
  LockCameraAimAction
(表现类: OverrideCameraFollowAction×1)
f23-38 ?isMainChar Source
CheckEntityNum
If [CheckTwoDirectionAngle]
  LockCameraAimAction
  else
  LockCameraAimAction
(表现类: OverrideCameraFollowAction×1)
f19-50 (表现类: EffectAction×1)
f0-75 (表现类: EffectAction×1)
f9-39 (表现类: EffectAction×1)
f9-94 (表现类: EffectAction×1)
f20-51 (表现类: EffectAction×1)
f20-51 (表现类: EffectAction×1)
f3-18 (表现类: EffectAction×1)
f41-51 (表现类: EffectAction×1)
f61-101 (表现类: EffectAction×1)
f70-110 (表现类: EffectAction×1)
f0-47 (表现类: SetSuperArmorAction×1)
f0-47 CreateBuff [buff_common_full_immune_medium] → Owner count=1
f0-33 CreateBuff [buff_common_power_attack_disable_cast_skill] → Owner count=1
f0-103 (表现类: CharWeaponVisibleAction×1)
f0-103 (表现类: CharWeaponVisibleAction×1)
f5-42 (表现类: VoiceTriggerAction×1)
f20-50 (表现类: PlaySoundAction×1)
f0-46 (表现类: PlaySoundAction×1)
f20-77 (表现类: PlaySoundAction×1)
f20-61 (表现类: PlaySoundAction×1)
f58-91 (表现类: PlaySoundAction×1)
```

### chr_0027_tangtang_power_attack_projhit
- 文件黑板: {"atk_scale":0}; cast cost UltimateSp 0; cd 0; durationFrame 60 (2.00s), exclusiveFrame 60 (2.00s)
```
f6-6 Damage target=Target:tar units=[Cryst/Hp scale=1 calc=BreakingAttackCalculation(@atk_scale(0)) nonSimple mask=132]
If [CheckEnemyRank]
  BlowOffAction
  (表现类: CameraImpulseAction×1)
  else
  If [CheckEnemyRank]
    BlowOffAction
    (表现类: CameraImpulseAction×1)
    else
    If [CheckEnemyRank]
      (表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
(表现类: HitStopAction×2)
```

### chr_0027_tangtang_ult_skill_abilityentitymove
- 文件黑板: {"atk_scale":0.1,"poise":5,"hit_cnt":4,"poise_tornado":0,"duration":5,"hit_cntmax":10,"hit_duration":5,"water_cnt":"dyn","dmg_up_water_ult":"dyn","talent2_ultskill":"dyn","talent2":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 151 (5.03s), exclusiveFrame 151 (5.03s)
```
f18-18 If [?@water_cnt GT 0]
  If [?@water_cnt GE 2]
    Spawn abilityentity_chr_0027_tangtang_normal_skill_03 skill=chr_0027_tangtang_normal_skill_water_projhit_2
    Spawn abilityentity_chr_0027_tangtang_normal_skill_03_02 skill=chr_0027_tangtang_normal_skill_water_projhit_2
    Spawn abilityentity_chr_0027_tangtang_normal_skill_03_03 skill=chr_0027_tangtang_normal_skill_water_projhit_2
    BB water_cnt Assign 0 on Owner
    else
    Spawn abilityentity_chr_0027_tangtang_normal_skill_02 skill=chr_0027_tangtang_normal_skill_water_projhit_1
    Spawn abilityentity_chr_0027_tangtang_normal_skill_02_02 skill=chr_0027_tangtang_normal_skill_water_projhit_1
    BB water_cnt Assign 0 on Owner
  else
  Spawn abilityentity_chr_0027_tangtang_normal_skill skill=chr_0027_tangtang_normal_skill_water_projhit
  BB water_cnt Assign 0 on Owner
f150-150 FinishOwnerAction
```

### chr_0027_tangtang_ultimate_skill
- 文件黑板: {"atk_scale_1":0,"atk_scale_2":0,"atk_scale_3":0,"duration":12,"potential1":"dyn","potential4":"dyn","potential5":"dyn","talent2":"dyn","poise1":0,"poise2":0,"poise3":0,"tornado_atk_scale01":"dyn","tornado_atk_scale02":"dyn","tornado_atk_scale03":"dyn","duration_talent1buff":3,"ratio_speed":0.2,"ratio_speedreduction":0.8,"talent1_speed":"dyn","rate_vul_base":"dyn","rate_spellvulnerable":"dyn","potential3_rate_spellvulnerable":"dyn","duration_spellvulnerable":"dyn","talent2_ultskill":"dyn","dmg_up_water_ult":"dyn","rate_spellvulnerable_02":"dyn"}; cast cost UltimateSp 100; cd 0; durationFrame 202 (6.73s), exclusiveFrame 84 (2.80s)
- 等级表 L12: cost UltSp 90, cd 20, 黑板 {"atk_scale_1":0.4,"atk_scale_2":4,"atk_scale_3":7,"display_atk_scale":3.2,"poise2":15,"poise3":20,"display_duration":4}; L1 黑板 {"atk_scale_1":0.178,"atk_scale_2":1.778,"atk_scale_3":3.111,"display_atk_scale":1.42,"poise2":15,"poise3":20,"display_duration":4}
```
f0-202 Anim UltimateSkill dur=6.733333
f0-3 TimeDilation Entity dur=1 curve=RESETto1
f0-1 CheckEntityNum
If [?isMainChar Owner]
  FindTargetAction
  FindTargetAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
  else
  FindTargetAction
  FindTargetAction
  FindTargetAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
f0-0 FinishBuff buff_chr_0027_tangtang_ultskill_vfx all layers=1 on Source
f0-77 If [?isMainChar Owner]
  AnimatedCameraAction
  else
  AnimatedCameraAction
f0-84 CreateBuff [buff_common_damage_immune_ult_skill] → Source count=1
f0-75 ModifyWeaponMountPoint
ModifyWeaponMountPoint
f0-82 HideUIAction
f0-82 UltimateTimeAction
f0-75 UltimateShowAction
f0-82 ChannelingCastingAction
f82-174 ComboCache [Attack→chr_0027_tangtang_attack1,NormalSkill→chr_0027_tangtang_normal_skill,ComboSkill→chr_0027_tangtang_combo_skill]
f76-76 BB tornado_atk_scale01 Assign @EntityBB_abilityentity_water01 on Owner
BB tornado_atk_scale02 Assign @EntityBB_abilityentity_water02 on Owner
BB tornado_atk_scale03 Assign @EntityBB_abilityentity_water03 on Owner
BB rate_spellvulnerable Add @EntityBB_abilityentity_rate_spellvulnerable on Owner
BB rate_spellvulnerable_02 Add @EntityBB_abilityentity_rate_spellvulnerable_02 on Owner
BB duration_spellvulnerable Assign @EntityBB_abilityentity_duration_spellvulnerable on Owner
If [?@talent2 GE 1]
  BB talent2_ultskill Assign 1 on Owner
  Spawn abilityentity_chr_0027_tangtang_ultskill skill=chr_0027_tangtang_ultimate_skill_1
  else
  Spawn abilityentity_chr_0027_tangtang_ultskill skill=chr_0027_tangtang_ultimate_skill_1
f0-77 AddTag [{"tagId":1072336889}]
f0-202 (表现类: CharWeaponVisibleAction×1)
f0-202 (表现类: CharWeaponVisibleAction×1)
f1-202 (表现类: VoiceTriggerAction×1)
f0-202 (表现类: PlaySoundAction×1)
f0-108 (表现类: EffectAction×1)
f0-84 (表现类: EffectAction×1)
f0-165 (表现类: EffectAction×1)
f4-165 (表现类: EffectAction×1)
f0-165 (表现类: EffectAction×1)
f0-165 (表现类: EffectAction×1)
f0-165 (表现类: EffectAction×1)
f27-165 (表现类: EffectAction×1)
f41-171 (表现类: EffectAction×1)
f44-165 (表现类: EffectAction×1)
f68-81 (表现类: EffectAction×1)
f68-81 (表现类: EffectAction×1)
f21-138 (表现类: EffectAction×1)
f22-139 (表现类: EffectAction×1)
f22-139 (表现类: EffectAction×1)
f19-136 (表现类: EffectAction×1)
f19-136 (表现类: EffectAction×1)
```

### chr_0027_tangtang_ultimate_skill_1
- 文件黑板: {"atk_scale_1":0,"atk_scale_2":0,"duration":12,"potential4":"dyn","atk_scale_3":0,"water_cnt":"dyn","potential5":"dyn","poise1":0,"poise2":0,"poise3":0,"talent2":"dyn","tomado_atk_scale01":"dyn","tomado_atk_scale02":"dyn","tomado_atk_scale03":"dyn","ratio_speedreduction":0.8,"ratio_speed":0,"duration_talent1buff":3,"talent1_speed":"dyn","rate_vul_base":"dyn","potential1":"dyn","potential_5_CrystDamageIncrease":"dyn","potential5_duration":"dyn","max_stack":"dyn","rate_spellvulnerable":"dyn","potential3_rate_spellvulnerable":"dyn","duration_spellvulnerable":"dyn","rate_spellvulnerable_02":"dyn","talent2_ultskill":"dyn","dmg_up_water_ult":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 210 (7.00s), exclusiveFrame 210 (7.00s)
```
f0-120 ContinuousFindTargetAction
f120-123 FindTargetAction
f133-136 FindTargetAction
f0-120 Channeling every 0.033s max/target=8
  Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale_1(0) mask=4608]
  DoOnceAction
  (表现类: EffectAction×1)
f120-123 Interrupt → Context:tar2
Damage target=Context:tar2 units=[Cryst/Hp scale=@atk_scale_2(0) mask=4608 | Physical/Poise scale=0 mask=0]
If [?isMainChar Source:tar]
If [CheckEntityNum]
(表现类: EnemyHurtAnimAction×1)
f133-136 If [?@talent2 GE 1]
f133-136 Interrupt → Context:tar2
Damage target=Context:tar2 units=[Cryst/Hp scale=@atk_scale_3(0) mask=4608 | Physical/Poise scale=0 mask=0]
If [?isMainChar Source:tar]
(表现类: EnemyHurtAnimAction×1 HitStopAction×2)
f0-121 CreateTimedMarker
AuraAction
AuraAction
f128-136 If [?@potential3 GE 1]
  BB potential3_rate_spellvulnerable = @potential3_rate_spellvulnerable Add @rate_vul_base
  AuraAction
  else
  AuraAction
f120-121 (表现类: CameraImpulseAction×1)
f133-136 (表现类: CameraImpulseAction×1)
f128-128 ?@talent2 GE 1
CreateBuff [buff_chr_0027_tangtang_ultskill_waterwake{talent2_ultskill=@talent2_ultskill,dmg_up_water_ult=@dmg_up_water_ult,rate_spellvulnerable=@rate_spellvulnerable,rate_spellvulnerable_02=@rate_spellvulnerable_02,duration_spellvulnerable=@duration_spellvulnerable}] → Source:water count=1
f127-128 InterruptCurSkillAction
f0-119 EventListenerAction
f0-135 (表现类: EffectAction×1)
f0-123 CreateBuffAttachingSkill
f0-0 (表现类: CameraImpulseAction×1)
f127-128 FinishOwnerAction
f156-157 FinishOwnerAction
f132-247 (表现类: PlaySoundAction×1)
f0-210 (表现类: PlaySoundAction×1)
f120-211 (表现类: PlaySoundAction×1)
f0-135 (表现类: EffectAction×1)
f0-135 (表现类: EffectAction×1)
f128-201 (表现类: EffectAction×1)
f128-190 (表现类: EffectAction×1)
f0-135 (表现类: EffectAction×1)
f0-135 (表现类: EffectAction×1)
f117-210 (表现类: EffectAction×1)
f117-182 (表现类: EffectAction×1)
f128-208 (表现类: EffectAction×1)
f117-196 (表现类: EffectAction×1)
```


## 增益（37）

### buff_chr_0027_tangtang_chrdg_addusp
- life Limited, dur 0.1, stacking Unlimited max @hit_cntmax; 黑板默认 {"ultimate_sp":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffEnable:
  StoreAttributeValue
  ObtainCost UltimateSp Gain value=@ultimate_sp(0)×1 src=Default → Owner
```

### buff_chr_0027_tangtang_chrdg_addwater
- life Infinity, dur 30, stacking Stack max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnBeforeAddedBuff:
  CheckBuffIdInContextAdvanced
  Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water
  Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water
```

### buff_chr_0027_tangtang_chrdg_usp_recoverspeed
- life Infinity, dur 0.1, stacking Stack max 1; 黑板默认 {"ultimate_sp":0,"tick":0.2,"usp_recoverspeed":0.01}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffTrigger:
  StoreAttributeValue
  ObtainCost UltimateSp Gain value=@ultimate_sp(0)×@usp_recoverspeed(0.01) src=Default → Owner
```

### buff_chr_0027_tangtang_comboskill_hit
- life Limited, dur @hit_duration(5), stacking Unlimited max @hit_cntmax; 黑板默认 {"hit_duration":5}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0027_tangtang_comboskill_hitspelllnfliction
- life Limited, dur 5, stacking Refresh max @water_stack; 黑板默认 {"duration":10,"hit_cnt":4}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
on ability OnOutputDamage:
  ?BuffStack buff_chr_0027_tangtang_comboskill_hit BuffCount GE @hit_cnt(4) on Owner
  SpellInfliction Cryst → Owner
  FinishBuff buff_chr_0027_tangtang_comboskill_hit layers=@hit_cnt(4) on Owner
```

### buff_chr_0027_tangtang_comboskill_spelllnfliction
- life Limited, dur @hit_spellduration(6), stacking Unlimited max @hit_spelllnflictionmax; 黑板默认 {"hit_spellduration":6,"hit_spelllnflictionmax":2}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0027_tangtang_comboskill_waterbuff
- life Limited, dur @duration_waterbuff(30), stacking HighPriority by ratio_speed max 1; 黑板默认 {"ratio_speed":0.1,"duration_waterbuff":30}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SpeedupAction
on OnBuffStart:
  FinishBuff buff_chr_0027_tangtang_comboskill_waterbuff_outaura all layers=1 on Owner
on OnBuffStart:
  CreateBuff [buff_chr_0027_tangtang_comboskill_waterbuff_vfx] → Owner count=1
```

### buff_chr_0027_tangtang_comboskill_waterbuff_outaura
- life Limited, dur @duration_talent1buff(3), stacking HighPriority by ratio_speed max 1; 黑板默认 {"duration_talent1buff":3,"ratio_speed":0.2}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  ?BuffStack buff_chr_0027_tangtang_comboskill_waterbuff BuffCount LE 0 on Owner
  SpeedupAction
```

### buff_chr_0027_tangtang_comboskill_waterbuff_vfx
- life Limited, dur 1, stacking Enhance max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  (表现类: EffectAction×1)
```

### buff_chr_0027_tangtang_comboskill_waterdebuff
- life Limited, dur @duration_waterdebuff(30), stacking HighPriority max 1; 黑板默认 {"duration_waterdebuff":30,"ratio_speedreduction":0.7}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SlowAction
```

### buff_chr_0027_tangtang_comboskill_waterdebuff_outaura
- life Limited, dur @duration_talent1buff(3), stacking HighPriority max 1; 黑板默认 {"duration_talent1buff":3,"ratio_speedreduction":0.7}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SlowAction
```

### buff_chr_0027_tangtang_normalskill_abilityentity_1
- life Limited, dur @duration(10), stacking Stack max 1; 黑板默认 {"duration":10,"duration_move":1}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: MoveToAction×1)
```

### buff_chr_0027_tangtang_normalskill_abilityentity_2
- life Limited, dur @duration(3), stacking Stack max 1; 黑板默认 {"duration":3,"speed":5,"duration_move":3,"trigger":0.1}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  If [CheckEntityNum]
    FindTargetAction
    else
    FindTargetAction
  (表现类: MoveToAction×1)
on OnBuffEnable:
  FinishBuff buff_chr_0027_tangtang_normalskill_abilityentity_1 all layers=1 on Owner
```

### buff_chr_0027_tangtang_normalskill_spellvulnerable
- life Limited, dur @duration_spellvulnerable(10), stacking HighPriority by rate_spellvulnerable max @cntmax; 黑板默认 {"duration_spellvulnerable":10,"rate_spellvulnerable":0.05,"cntmax":1,"rate_vul_base":0,"real_duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SaveBuffLifeTime
  Vulnerable Spell rate=@rate_spellvulnerable(0.05) dur=@real_duration(0) child=[object Object] → Owner
```

### buff_chr_0027_tangtang_passive_0
- life Infinity, dur -1, stacking Stack max 1; 黑板默认 {"normalskill_atk_scale01":0,"normalskill_atk_scale02":0,"normalskill_atk_scale03":0,"rate_spellvulnerable":0,"rate_spellvulnerable_02":0,"duration_spellvulnerable":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnBeforeCastSkill:
  BB EntityBB_abilityentity_water01 Assign @normalskill_atk_scale01(0) on Owner
  BB EntityBB_abilityentity_water02 Assign @normalskill_atk_scale02(0) on Owner
  BB EntityBB_abilityentity_water03 Assign @normalskill_atk_scale03(0) on Owner
  BB EntityBB_abilityentity_rate_spellvulnerable Assign @rate_spellvulnerable(0) on Owner
  BB EntityBB_abilityentity_rate_spellvulnerable_02 Assign @rate_spellvulnerable_02(0) on Owner
  BB EntityBB_abilityentity_duration_spellvulnerable Assign @duration_spellvulnerable(0) on Owner
```

### buff_chr_0027_tangtang_potential5_crystdamagelncrease
- life Limited, dur @potential5_duration(20), stacking EnhanceAndRefresh max @max_stack; 黑板默认 {"potential_5_CrystDamageIncrease":0.08,"potential5_duration":20,"max_stack":4}
- 属性修正: CrystDamageIncrease BaseAddition @potential_5_CrystDamageIncrease(0.08)
- 伤害修正: 无
```
```

### buff_chr_0027_tangtang_potential_5_effect
- life Infinity, dur 10, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: ShowHideActorAction×1 EffectAction×2)
```

### buff_chr_0027_tangtang_skillappear
- life Limited, dur -1, stacking Stack max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  CreateBuff [buff_chr_0027_tangtang_skillappear_effect] → Owner count=1
on OnBuffFinish:
  FindTargetAction
  ForEachAction
```

### buff_chr_0027_tangtang_skillappear_effect
- life Limited, dur 1, stacking Stack max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1)
```

### buff_chr_0027_tangtang_traindung_water_gene
- life Limited, dur 0.1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  FindTargetAction
  ForEachAction
  FinishBuff buff_chr_0027_tangtang_water all layers=1 on Owner
on OnBuffEnable:
  If [?BuffStack buff_chr_0027_tangtang_water BuffCount GT 0 on Owner]
    Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water
    FindTargetAction
    If [CheckTimedMarkerCondition]
      CreateTimedMarker
      else
      CreateTimedMarker
    else
    Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water
    CreateTimedMarker
  CreateBuff [buff_chr_0027_tangtang_water] → Owner count=1
  If [?BuffStack buff_chr_0027_tangtang_water BuffCount GT 0 on Owner]
    Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water
    FindTargetAction
    If [CheckTimedMarkerCondition]
      CreateTimedMarker
      else
      CreateTimedMarker
    else
    Spawn abilityentity_chr_0027_tangtang_comboskill_water skill=chr_0027_tangtang_combo_skill_water
    CreateTimedMarker
  CreateBuff [buff_chr_0027_tangtang_water] → Owner count=1
```

### buff_chr_0027_tangtang_ultskill_abilityentity_1
- life Limited, dur @duration(10), stacking Stack max 1; 黑板默认 {"duration":10,"duration_move":1}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  FindTargetAction
  (表现类: MoveToAction×1)
```

### buff_chr_0027_tangtang_ultskill_abilityentity_2
- life Limited, dur @duration(3), stacking Stack max 1; 黑板默认 {"duration":3,"speed":8,"duration_move":3,"trigger":0.1}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  FindTargetAction
  (表现类: MoveToAction×1)
on OnBuffEnable:
  FinishBuff buff_chr_0027_tangtang_normalskill_abilityentity_1 all layers=1 on Owner
```

### buff_chr_0027_tangtang_ultskill_buff
- life Limited, dur @duration(5), stacking Refresh max 1; 黑板默认 {"duration":5}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnOutputDamage:
  ?isMainChar Owner
  ?decorateMask HasAll 1024
  ?BuffStack buff_chr_0027_tangtang_ultskill_debuff BuffCount GE 1 on Target
  CreateBuff [buff_chr_0027_tangtang_ultskill_buff_damage] → MainCharacter:tar count=1
on ability OnBeforeDamageAction:
  CheckOriginSkillType
  ?decorateMask HasAll 1024
  ?BuffStack buff_chr_0027_tangtang_ultskill_debuff BuffCount GE 1 on Target
  CreateBuff [buff_chr_0027_tangtang_ultskill_buff_damage] → MainCharacter:tar count=1
on ability OnOwnerHpZero:
```

### buff_chr_0027_tangtang_ultskill_buff_damage
- life Limited, dur @duration(1), stacking Stack max 1; 黑板默认 {"duration":1}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0027_tangtang_ultskill_crystal_vulnerable
- life Limited, dur @duration(10), stacking EnhanceAndRefresh max @cntmax; 黑板默认 {"duration":10,"rate":0.1,"cntmax":1}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  Vulnerable Crystal rate=@rate(0.1) dur=@duration(10) child=[object Object] → Owner
```

### buff_chr_0027_tangtang_ultskill_debuff
- life Limited, dur @ultskill_debuff_duration(4), stacking Stack max 1; 黑板默认 {"ultskill_debuff_duration":4,"timedilation_duration":-1}; tags [{"tagId":-1065936627}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×2)
  ?BuffStack tag[188749032] BuffCount LT 1 on Owner
  TimeDilation Entity dur=@timedilation_duration(-1)
```

### buff_chr_0027_tangtang_ultskill_natural_vulnerable
- life Limited, dur @duration(10), stacking EnhanceAndRefresh max @cntmax; 黑板默认 {"duration":10,"rate":0.1,"cntmax":1}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  Vulnerable Natural rate=@rate(0.1) dur=@duration(10) child=[object Object] → Owner
```

### buff_chr_0027_tangtang_ultskill_spellvulnerable
- life Limited, dur @duration_spellvulnerable(10), stacking EnhanceAndRefresh max @cntmax; 黑板默认 {"duration_spellvulnerable":10,"rate_spellvulnerable":0.1,"cntmax":1,"rate_vul_base":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  Vulnerable Spell rate=@rate_spellvulnerable(0.1) dur=@duration_spellvulnerable(10) child=[object Object] → Owner
```

### buff_chr_0027_tangtang_ultskill_vfx
- life Limited, dur 6, stacking Stack max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×3)
```

### buff_chr_0027_tangtang_ultskill_waterwake
- life Limited, dur 1, stacking Unlimited max 1; 黑板默认 {"hit_duration":5,"water_cnt":0,"poise_tomado":0,"duration":5,"hit_cnt":4,"hit_cntmax":10,"tornado_atk_scale01":0,"tornado_atk_scale02":0,"tornado_atk_scale03":0,"dmg_up_water_ult":0,"talent2_ultskill":0,"rate_spellvulnerable":0,"rate_spellvulnerable_02":0,"duration_spellvulnerable":0}
- 属性修正: 无
- 伤害修正: 无
```
f0-1 FindTargetAction
FindTargetAction
BB tornado_atk_scale01 Assign @EntityBB_abilityentity_water01 on Owner
BB tornado_atk_scale02 Assign @EntityBB_abilityentity_water02 on Owner
BB tornado_atk_scale03 Assign @EntityBB_abilityentity_water03 on Owner
If [CheckEntityNum]
  ForEachAction
  Spawn abilityentity_chr_0027_tangtang_normal_skill_move skill=chr_0027_tangtang_ult_skill_abilityentitymove
  CreateBuff [buff_chr_0027_tangtang_ultskill_abilityentity_1] → Context:ultskill_watermove count=1
  else
  Spawn abilityentity_chr_0027_tangtang_normal_skill_move skill=chr_0027_tangtang_ult_skill_abilityentitymove
  CreateBuff [buff_chr_0027_tangtang_ultskill_abilityentity_1] → Context:ultskill_watermove count=1
f12-13 FindTargetAction
CheckEntityNum
ForEachAction
```

### buff_chr_0027_tangtang_water
- life Limited, dur @duration_water(30), stacking Stack max @water_stack; 黑板默认 {"water_stack":2,"duration_water":30}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0027_tangtang_water_call
- life Limited, dur 1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffEnable:
  Projectile projectile_chr_0027_tangtang_water
```

### buff_chr_0027_tangtang_water_iceballstack
- life Limited, dur 60, stacking Stack max @water_stack; 黑板默认 {"water_stack":2}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0027_tangtang_water_icon
- life Limited, dur @duration(0), stacking HighPriority by rate max 1; 黑板默认 {"rate":0,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1)
```

### buff_chr_0027_tangtang_water_passiveui
- life Infinity, dur 30, stacking Stack max 1; 黑板默认 {"water_num":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnAbilityEntitySpawned:
  ?tag {"$type":"Beyond.Gameplay.Core.Conditions.CheckTagMatch+Data, Gameplay.Beyond","
  BB water_num Add 1 on Owner
  (表现类: NotifyCharPassiveUIAction×1)
on ability OnAbilityEntityFinished:
  ?tag {"$type":"Beyond.Gameplay.Core.Conditions.CheckTagMatch+Data, Gameplay.Beyond","
  BB water_num Add -1 on Owner
  (表现类: NotifyCharPassiveUIAction×1)
```

### buff_chr_0027_tangtang_water_ultskillwake
- life Limited, dur 0.1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0027_tangtang_water_wake
- life Limited, dur 0.1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```
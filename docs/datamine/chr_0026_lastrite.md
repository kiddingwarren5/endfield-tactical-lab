# 解包清单：chr_0026_lastrite

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（12）

### chr_0026_lastrite_attack1
- 文件黑板: {"atk_scale":0.42,"env_dmg":20,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 171 (5.70s), exclusiveFrame 25 (0.83s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.68,"atb":0}; L1 黑板 {"atk_scale":0.3,"atb":0}
```
f0-57 Anim Attack01 dur=1.9
f57-171 Anim Attack01End dur=3.8
f0-6 (表现类: SelfRotateAction×1)
f0-57 (表现类: MoveToAction×1)
f57-171 (表现类: MoveToAction×1)
f0-6 CheckEntityNum
SnapToTargetWithRangeAction
f12-13 FindTargetAction
f12-13 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0.68) calc=AtkScaleCalculation(@atk_scale(0.68)) nonSimple mask=128]
If [?isMainChar Owner]
  If [CheckEntityNum]
    ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack onlyMain → Source
    (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f12-15 If [?isMainChar Owner]
  If [CheckEntityNum]
    (表现类: CameraImpulseAction×1)
f7-36 (表现类: EffectAction×1)
f0-25 (表现类: SetSuperArmorAction×1)
f0-171 (表现类: CharWeaponVisibleAction×1)
f0-171 (表现类: CharWeaponVisibleAction×1)
f5-40 (表现类: VoiceTriggerAction×1)
f0-39 (表现类: PlaySoundAction×1)
f62-116 (表现类: PlaySoundAction×1)
f0-35 ComboCache [Attack→chr_0026_lastrite_attack2]
f20-35 AllowNext [chr_0026_lastrite_attack2]
f7-51 (表现类: EffectAction×1)
```

### chr_0026_lastrite_attack2
- 文件黑板: {"atk_scale":0.42,"atb":0,"env_dmg":12.5}; cast cost UltimateSp 0; cd 0; durationFrame 175 (5.83s), exclusiveFrame 34 (1.13s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.62,"display_atk_scale":1.24,"atb":0}; L1 黑板 {"atk_scale":0.28,"display_atk_scale":0.55,"atb":0}
```
f0-175 Anim Attack02 dur=5.83333349
f0-6 (表现类: SelfRotateAction×1)
f0-175 (表现类: CustomRootMotionAction×1)
f10-11 FindTargetAction
f24-25 FindTargetAction
f10-11 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0.62) mask=128]
If [?isMainChar Owner]
  If [CheckEntityNum]
    ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack → Source
    (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f24-25 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0.62) mask=128]
If [?isMainChar Owner]
  If [CheckEntityNum]
    ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack → Source
    (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f7-51 (表现类: EffectAction×1)
f20-64 (表现类: EffectAction×1)
f0-6 CheckEntityNum
SnapToTargetWithRangeAction
f0-30 (表现类: AddDynamicCcsAction×1)
f0-34 (表现类: SetSuperArmorAction×1)
f0-175 (表现类: CharWeaponVisibleAction×1)
f0-175 (表现类: CharWeaponVisibleAction×1)
f5-39 (表现类: VoiceTriggerAction×1)
f0-50 (表现类: PlaySoundAction×1)
f65-128 (表现类: PlaySoundAction×1)
f0-44 ComboCache [Attack→chr_0026_lastrite_attack3]
f29-44 AllowNext [chr_0026_lastrite_attack3]
f7-51 (表现类: EffectAction×1)
f20-64 (表现类: EffectAction×1)
```

### chr_0026_lastrite_attack3
- 文件黑板: {"atk_scale":0.42,"atb":0,"env_dmg":10}; cast cost UltimateSp 0; cd 0; durationFrame 230 (7.67s), exclusiveFrame 47 (1.57s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.77,"display_atk_scale":1.53,"atb":0}; L1 黑板 {"atk_scale":0.34,"display_atk_scale":0.68,"atb":0}
```
f0-230 Anim Attack03 dur=7.66666651
f0-6 (表现类: SelfRotateAction×1)
f0-230 (表现类: CustomRootMotionAction×1)
f9-10 FindTargetAction
f26-27 FindTargetAction
f9-10 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0.77) mask=128]
If [?isMainChar Owner]
  If [CheckEntityNum]
    ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack → Source
    (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f27-28 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0.77) mask=128]
If [?isMainChar Owner]
  (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f28-30 If [?isMainChar Owner]
  (表现类: CameraImpulseAction×1)
f26-28 If [?isMainChar Owner]
  If [CheckEntityNum]
    (表现类: HitStopAction×1)
f5-49 (表现类: EffectAction×1)
f25-69 (表现类: EffectAction×1)
f0-6 CheckEntityNum
SnapToTargetWithRangeAction
f22-27 If [CheckEntityNum]
  SnapToTargetWithRangeAction
f28-42 (表现类: AddDynamicCcsAction×1)
f0-47 (表现类: SetSuperArmorAction×1)
f0-230 (表现类: CharWeaponVisibleAction×1)
f0-230 (表现类: CharWeaponVisibleAction×1)
f0-43 (表现类: PlaySoundAction×1)
f22-61 (表现类: PlaySoundAction×1)
f25-85 (表现类: PlaySoundAction×1)
f66-176 (表现类: PlaySoundAction×1)
f4-19 (表现类: VoiceTriggerAction×1)
f0-48 ComboCache [Attack→chr_0026_lastrite_attack4]
f36-48 AllowNext [chr_0026_lastrite_attack4]
f5-49 (表现类: EffectAction×1)
f25-69 (表现类: EffectAction×1)
f27-71 (表现类: EffectAction×1)
```

### chr_0026_lastrite_attack4
- 文件黑板: {"atk_scale":0.42,"atb":0,"env_dmg":35,"poise":0,"atk_scale2":0.2,"isBuffed":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 182 (6.07s), exclusiveFrame 54 (1.80s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":2.03,"poise":25,"atb":30}; L1 黑板 {"atk_scale":0.9,"poise":25,"atb":30}
```
f0-182 Anim Attack04 dur=6.0666666
f0-1 If [?BuffStack buff_chr_0026_lastrite_normal_skill BuffCount GE 1 on Owner && ?isMainChar Owner]
  BB isBuffed Assign 1 on Owner
f17-18 If [?BuffStack buff_chr_0026_lastrite_normal_skill BuffCount GE 1 on Owner && ?isMainChar Owner]
  BB isBuffed Assign 1 on Owner
f0-6 (表现类: SelfRotateAction×1)
f0-182 (表现类: CustomRootMotionAction×1)
f21-22 FindTargetAction
f21-22 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(2.03) mask=2097280 | Physical/Poise scale=0 mask=0]
If [?isMainChar Owner]
  If [CheckEntityNum]
    If [?@isBuffed Equals 1]
    ObtainCost Atb Gain value=@atb(30)×1 src=NormalAttack → Source
    (表现类: CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f22-23 If [?isMainChar Owner]
  If [CheckEntityNum]
    (表现类: HitStopAction×1)
f1-17 (表现类: AddDynamicCcsAction×1)
f17-29 (表现类: AddDynamicCcsAction×1)
f17-21 If [CheckEntityNum]
  SnapToTargetWithRangeAction
f16-45 (表现类: EffectAction×1)
f0-63 (表现类: EffectAction×1)
f0-54 (表现类: SetSuperArmorAction×1)
f0-100 (表现类: CharWeaponVisibleAction×1)
f100-182 (表现类: CharWeaponVisibleAction×1)
f0-182 (表现类: CharWeaponVisibleAction×1)
f0-21 (表现类: PlaySoundAction×1)
f19-67 (表现类: PlaySoundAction×1)
f44-56 (表现类: PlaySoundAction×1)
f35-110 (表现类: PlaySoundAction×1)
f11-26 (表现类: VoiceTriggerAction×1)
f0-54 ComboCache [Attack→chr_0026_lastrite_attack1]
f46-54 AllowNext [chr_0026_lastrite_attack1]
f17-75 If [?@isBuffed Equals 1]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
f17-61 If [?@isBuffed Equals 1]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
f0-61 If [?@isBuffed Equals 1]
  (表现类: EffectAction×1)
f17-75 If [?@isBuffed Equals 1]
  else
  (表现类: EffectAction×1)
f18-107 (表现类: EffectAction×1)
```

### chr_0026_lastrite_combo_skill
- 文件黑板: {"select_radius":4,"atk_scale3":8,"count":"dyn","input_angle":"dyn","cam_angle":"dyn","cam_duration":"dyn","poise":0,"usp":25,"atb":0,"duration":5,"infliction_num":"dyn","atk_scale2":0.5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","final_combo_atkscale":"dyn","atk_scale":1,"usp_base":0,"recover_usp":"dyn","infliction_num_total":"dyn"}; cast cost UltimateSp 0; cd 35; durationFrame 216 (7.20s), exclusiveFrame 90 (3.00s)
- 等级表 L12: cost UltSp 0, cd 8, 黑板 {"atk_scale":1.6,"atk_scale2":1.6,"atk_scale3":2.4,"poise":15,"usp":15,"usp_base":40,"count":3}; L1 黑板 {"atk_scale":0.71,"atk_scale2":0.71,"atk_scale3":1.07,"poise":15,"usp":15,"usp_base":40,"count":3}
```
f0-216 Anim ComboSkill dur=7.2
f0-1 If [?isMainChar Owner]
  If [CheckEntityNum]
    (表现类: ShowHideActorAction×1 MoveToAction×1 SelfRotateAction×1)
  else
  TeleportPosSelectAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
f2-3 FindTargetAction
f13-13 SaveBuffStackNumByTag
Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(1.6) calc=DefiniteValueCalculation(@atk_scale(1.6)) mask=8192]
ObtainCost UltimateSp Gain value=@usp_base(40)×1 src=Default → Source
If [CheckHp]
  ObtainCost UltimateSp Gain value=@usp(15)×@infliction_num src=Default → Source
  BB recover_usp Assign 1 on Owner
(表现类: EnemyHurtAnimAction×1)
f63-63 FindTargetAction
ForEachAction
f2-3 If [CheckEntityNum]
  CreateBuff [buff_chr_0026_lastrite_combo_skill_hitstop] → Context:tar count=1
f63-63 If [?@recover_usp Equals 0]
  If [?@infliction_num_total GE 4]
    ObtainCost UltimateSp Gain value=@usp(15)×4 src=Default → Source
    else
    ObtainCost UltimateSp Gain value=@usp(15)×@infliction_num_total src=Default → Source
f64-64 If [CheckEntityNum]
  (表现类: HitStopAction×1)
f13-15 (表现类: CameraImpulseAction×1)
f61-64 (表现类: CameraImpulseAction×1)
f12-13 CreateBuff [buff_chr_0026_lastrite_combo_skill_sound] → Source count=1
f0-18 (表现类: EffectAction×1)
f0-37 (表现类: AddDynamicCcsAction×1)
f37-61 (表现类: AddDynamicCcsAction×1)
f61-73 (表现类: AddDynamicCcsAction×1)
f0-73 If [?isMainChar Source]
  CheckEntityNum
  If [CheckTwoDirectionAngle]
    LockCameraAimAction
    (表现类: AddDynamicCcsAction×1)
    else
    LockCameraAimAction
    (表现类: AddDynamicCcsAction×1)
  (表现类: OverrideCameraFollowAction×1)
f1-216 (表现类: CustomRootMotionAction×1)
f0-15 TimeDilation Global dur=0.6 curve=ComboSkill
f0-54 If [?isMainChar Owner]
  else
  FindTargetAction
  SaveTargetDistanceAction
  If [CheckComboSkillCameraAlphaSetting]
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
    else
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
f0-55 If [?isMainChar Owner]
  else
  TemporaryUnlockAction
f0-63 (表现类: OverrideCameraFollowAction×1)
f0-90 (表现类: SetSuperArmorAction×1)
f36-91 ComboCache [NormalSkill→chr_0026_lastrite_normal_skill]
f65-91 AllowNext [chr_0026_lastrite_normal_skill]
f0-3 AddTag [{"tagId":707405956}]
f1-60 (表现类: EffectAction×1)
f11-85 (表现类: EffectAction×1)
f36-110 (表现类: EffectAction×1)
f13-87 (表现类: EffectAction×1)
f43-117 (表现类: EffectAction×1)
f11-100 (表现类: EffectAction×1)
f36-125 (表现类: EffectAction×1)
f6-97 (表现类: EffectAction×1)
f62-97 (表现类: EffectAction×1)
f0-27 (表现类: PlaySoundAction×1)
f0-49 (表现类: PlaySoundAction×1)
f35-82 (表现类: PlaySoundAction×1)
f63-130 (表现类: PlaySoundAction×1)
f2-17 (表现类: VoiceTriggerAction×1)
f0-77 (表现类: CharWeaponVisibleAction×1)
f77-216 (表现类: CharWeaponVisibleAction×1)
f0-216 (表现类: CharWeaponVisibleAction×1)
f0-216 (表现类: CharWeaponVisibleAction×1)
f0-216 (表现类: CharWeaponVisibleAction×1)
f0-216 (表现类: CharWeaponVisibleAction×1)
```

### chr_0026_lastrite_normal_skill
- 文件黑板: {"atk_scale":"dyn","atk_scale_2":0,"consume_cnt":0,"select_radius":10,"input_angle":"dyn","cam_duration":"dyn","cam_angle":"dyn","gained_atb":"dyn","poise":5,"duration":12,"atb":30,"atk_up":0.2,"potential_1":0,"usp":10}; cast cost Atb 40; cd 0; durationFrame 429 (14.30s), exclusiveFrame 373 (12.43s)
- 等级表 L12: cost Atb 100, cd 0, 黑板 {"atk_scale":3.2,"atb":30,"duration":15,"usp":16}; L1 黑板 {"atk_scale":1.42,"atb":30,"duration":15,"usp":16}
```
f0-188 Anim NormalSkill01 dur=6.266667
f300-429 Anim NormalSkill02 dur=4.3
f0-1 BB atk_scale Multiply 0.5 on Owner
BB EntityBB_ns_atkscale1 Assign @atk_scale(3.2) on Owner
BB EntityBB_ns_atkscale2 Assign @atk_scale(3.2) on Owner
BB EntityBB_ns_atb Assign @atb(30) on Owner
f0-2 JumpToAction
f51-52 MarkCanInterrupt
f187-188 JumpToAction
f300-301 FindTargetAction
FindTargetAction
If [?isMainChar Source]
  else
  If [CheckEntityNum]
    TeleportPosSelectAction
    CheckDistanceCondition
    (表现类: TeleportAction×1 SelfRotateAction×1)
    else
    TeleportPosSelectAction
    CheckDistanceCondition
    (表现类: TeleportAction×1 SelfRotateAction×1)
f6-7 CreateBuff [buff_chr_0026_lastrite_normal_skill_main_start{atk_scale=@atk_scale,duration=@duration,atb=@atb,atk_up=@atk_up,potential_1=@potential_1,usp=@usp}] → Source count=1
f302-330 (表现类: SelfRotateAction×1)
f0-51 (表现类: SetSuperArmorAction×1)
f300-373 (表现类: SetSuperArmorAction×1)
f0-188 (表现类: CustomRootMotionAction×1)
f300-429 (表现类: CustomRootMotionAction×1)
f0-28 (表现类: AddDynamicCcsAction×1)
f300-301 Projectile projectile_chr_0026_lastrite_normal_skill onReach=chr_0026_lastrite_normal_skill_projhit
f27-42 (表现类: CameraImpulseAction×1)
f34-51 AllowNext [chr_0026_lastrite_attack1,chr_0026_lastrite_attack2,chr_0026_lastrite_attack3,chr_0026_lastrite_attack4]
f300-301 FindTargetAction
FinishBuffAction
CreateBuff [buff_chr_0026_lastrite_normal_skill_self{atk_scale=@atk_scale,duration=@duration,atb=@atb,atk_up=@atk_up,potential_1=@potential_1,poise=@poise}] → Source:team count=1
CheckSquadInFight
CreateBuff [buff_common_obtain_ultimate_sp] → Owner count=1
ObtainCost UltimateSp Gain value=@usp(16)×1 src=Default → Source
(表现类: EffectAction×1)
f0-265 (表现类: PlaySoundAction×1)
f73-262 (表现类: PlaySoundAction×1)
f300-425 (表现类: PlaySoundAction×1)
f0-44 (表现类: VoiceTriggerAction×1)
f303-347 (表现类: VoiceTriggerAction×1)
f28-117 (表现类: EffectAction×1)
f300-389 (表现类: EffectAction×1)
f28-117 (表现类: EffectAction×1)
f300-395 (表现类: EffectAction×1)
f300-399 (表现类: EffectAction×1)
f300-399 (表现类: EffectAction×1)
f302-364 (表现类: EffectAction×1)
f0-300 (表现类: CharWeaponVisibleAction×1)
f300-429 (表现类: CharWeaponVisibleAction×1)
f0-429 (表现类: CharWeaponVisibleAction×1)
f353-429 (表现类: PlaySoundAction×1)
```

### chr_0026_lastrite_normal_skill_projhit
- 文件黑板: {"atk_scale":0,"duration":0}; cast cost UltimateSp 0; cd 0; durationFrame 30 (1.00s), exclusiveFrame 30 (1.00s)
```
f0-10 (表现类: EffectAction×1)
f0-10 (表现类: PlaySoundAction×1)
```

### chr_0026_lastrite_passive
- 文件黑板: {}; cast cost UltimateSp 0; cd 0; durationFrame 53 (1.77s), exclusiveFrame 22 (0.73s)
```
```

### chr_0026_lastrite_plunging_attack_end
- 文件黑板: {"atk_scale":0.42,"env_dmg":20,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 133 (4.43s), exclusiveFrame 20 (0.67s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":1.8,"atb":0}; L1 黑板 {"atk_scale":0.8,"atb":0}
```
f0-133 Anim PlungingAttackEnd dur=4.4333334
f2-3 FindTargetAction
f2-3 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(1.8) mask=1152]
PushBackAction
ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack onlyMain → Source
(表现类: EnemyHurtAnimAction×1)
f1-4 (表现类: CameraImpulseAction×1)
f0-133 (表现类: CustomRootMotionAction×1)
f0-20 (表现类: SetSuperArmorAction×1)
f1-45 (表现类: EffectAction×1)
f0-8 (表现类: CharWeaponVisibleAction×1)
f8-133 (表现类: CharWeaponVisibleAction×1)
f0-75 (表现类: CharWeaponVisibleAction×1)
f0-33 (表现类: PlaySoundAction×1)
f30-57 (表现类: PlaySoundAction×1)
```

### chr_0026_lastrite_plunging_attack_start
- 文件黑板: {"atk_scale":0.42}; cast cost UltimateSp 0; cd 0; durationFrame 1500 (50.00s), exclusiveFrame 1500 (50.00s)
```
f0-32 Anim PlungingAttackStart dur=1.06666672
f32-1500 Anim PlungingAttackLoop dur=48.9333344
f0-15 (表现类: SelfRotateAction×1)
f0-32 (表现类: CustomRootMotionAction×1)
f0-1500 (表现类: SetSuperArmorAction×1)
f21-1500 (表现类: EffectAction×1)
f0-9 (表现类: CharWeaponVisibleAction×1)
f9-1500 (表现类: CharWeaponVisibleAction×1)
f0-60 (表现类: VoiceTriggerAction×1)
f0-46 (表现类: PlaySoundAction×1)
```

### chr_0026_lastrite_power_attack
- 文件黑板: {"atk_scale":0.35}; cast cost UltimateSp 0; cd 0; durationFrame 176 (5.87s), exclusiveFrame 58 (1.93s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":9}; L1 黑板 {"atk_scale":4}
```
f0-176 Anim PowerAttack dur=5.866667
f0-2 (表现类: SelfRotateAction×1)
f2-23 (表现类: SelfRotateAction×1)
f0-176 (表现类: CustomRootMotionAction×1)
f0-45 (表现类: AddDynamicCcsAction×1)
f0-45 ?isMainChar Source
CheckEntityNum
If [CheckTwoDirectionAngle]
  LockCameraAimAction
  else
  LockCameraAimAction
f12-41 (表现类: CameraImpulseAction×1)
f0-5 CheckEntityNum
If [CheckDistanceCondition]
  SnapToTargetWithRangeAction
  else
  SnapToTargetWithRangeAction
f41-42 If [?isMainChar Owner]
  (表现类: HitStopAction×1)
f40-40 Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
GainBreakingAttackAtb
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f0-59 (表现类: EffectAction×1)
f0-89 (表现类: EffectAction×1)
f7-51 (表现类: EffectAction×1)
f39-98 (表现类: EffectAction×1)
f45-134 (表现类: EffectAction×1)
f0-40 CreateBuff [buff_common_power_attack_disable_cast_skill] → Owner count=1
f0-58 (表现类: SetSuperArmorAction×1)
f0-58 CreateBuff [buff_common_full_immune_medium] → Owner count=1
f0-58 ComboCache [NormalSkill→chr_0026_lastrite_normal_skill,ComboSkill→chr_0026_lastrite_combo_skill]
f40-58 AllowNext [chr_0026_lastrite_normal_skill,chr_0026_lastrite_combo_skill]
f0-73 (表现类: CharWeaponVisibleAction×1)
f73-176 (表现类: CharWeaponVisibleAction×1)
f0-29 (表现类: PlaySoundAction×1)
f33-54 (表现类: PlaySoundAction×1)
f70-106 (表现类: PlaySoundAction×1)
f8-23 (表现类: VoiceTriggerAction×1)
```

### chr_0026_lastrite_ultimate_skill
- 文件黑板: {"atk_scale":1.5,"rate":0,"atk_scale2":3,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","talent_2":0,"poise1":5,"poise2":10}; cast cost Atb 40; cd 0; durationFrame 360 (12.00s), exclusiveFrame 170 (5.67s)
- 等级表 L12: cost UltSp 240, cd 20, 黑板 {"atk_scale":4,"atk_scale2":8,"poise1":5,"poise2":10,"usp":10}; L1 黑板 {"atk_scale":1.78,"atk_scale2":3.56,"poise1":5,"poise2":10,"usp":10}
```
f0-360 Anim UltimateSkill dur=12
f0-3 TimeDilation Entity dur=1 curve=RESETto1
f0-1 FindTargetAction
FindTargetAction
FindTargetAction
If [?isMainChar Source]
  (表现类: MoveToAction×1 SelfRotateAction×1)
  else
  If [CheckEntityNum]
    FindTargetAction
    (表现类: TeleportAction×1 SelfRotateAction×1)
    else
    FindTargetAction
    (表现类: TeleportAction×1 SelfRotateAction×1)
f0-85 UltimateTimeAction
f0-85 UltimateShowAction
f0-85 HideUIAction
f0-85 (表现类: EffectAction×1)
f0-85 If [?isMainChar Source]
  else
  AnimatedCameraAction
f0-180 If [?isMainChar Source]
  AnimatedCameraAction
f0-172 CreateBuff [buff_common_damage_immune_ult_skill] → Owner count=1
f1-89 (表现类: CustomRootMotionAction×1)
f89-108 (表现类: CustomRootMotionAction×1)
f108-134 (表现类: CustomRootMotionAction×1)
f134-360 (表现类: CustomRootMotionAction×1)
f20-180 (表现类: ShowHideActorAction×1)
f82-134 (表现类: SelfRotateAction×1)
f86-87 FindTargetAction
f87-88 FindTargetAction
f88-89 FindTargetAction
f105-106 FindTargetAction
f106-107 FindTargetAction
f107-108 FindTargetAction
f134-135 FindTargetAction
f135-136 FindTargetAction
f136-137 FindTargetAction
f86-89 Channeling every 0.033s max/target=1
  Interrupt → Target
  If [?@talent_2(0) Equals 1]
    Damage target=Target units=[Cryst/Hp scale=@atk_scale(4) mask=4608 procs=[InstantModifyAttribute:Defender CrystVulnerableDmgIncrease BaseFinalMultiplier @rate(0)] | Physical/Poise scale=0 mask=0]
    else
    Damage target=Target units=[Cryst/Hp scale=@atk_scale(4) mask=4608 | Physical/Poise scale=0 mask=0]
  If [CheckEnemyRank]
    (表现类: HitStopAction×1)
  (表现类: EnemyHurtAnimAction×1)
f105-108 Channeling every 0.033s max/target=1
  Interrupt → Target
  If [?@talent_2(0) Equals 1]
    Damage target=Target units=[Cryst/Hp scale=@atk_scale(4) mask=4608 procs=[InstantModifyAttribute:Defender CrystVulnerableDmgIncrease BaseFinalMultiplier @rate(0)] | Physical/Poise scale=0 mask=0]
    else
    Damage target=Target units=[Cryst/Hp scale=@atk_scale(4) mask=4608 | Physical/Poise scale=0 mask=0]
  If [CheckEnemyRank]
    (表现类: HitStopAction×1)
  (表现类: EnemyHurtAnimAction×1)
f134-137 Channeling every 0.033s max/target=1
  Interrupt → Target
  If [?@talent_2(0) Equals 1]
    Damage target=Target units=[Cryst/Hp scale=@atk_scale2(8) mask=4608 procs=[InstantModifyAttribute:Defender CrystVulnerableDmgIncrease BaseFinalMultiplier @rate(0)] | Physical/Poise scale=0 mask=0]
    else
    Damage target=Target units=[Cryst/Hp scale=@atk_scale2(8) mask=4608 | Physical/Poise scale=0 mask=0]
  BlowOffAction
f86-86 TimeDilation Global dur=0.1 curve=ComboSkill
f86-138 If [?isMainChar Owner]
  else
  FindTargetAction
  SaveTargetDistanceAction
  If [CheckComboSkillCameraAlphaSetting]
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
    else
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
f86-138 If [?isMainChar Owner]
  else
  TemporaryUnlockAction
f86-170 (表现类: OverrideCameraFollowAction×1)
f0-170 ChannelingCastingAction
f86-170 ComboCache [NormalSkill→chr_0026_lastrite_normal_skill,Attack→chr_0026_lastrite_combo_skill]
f140-170 AllowNext [chr_0026_lastrite_normal_skill,chr_0026_lastrite_combo_skill]
f85-145 TimeDilation Entity dur=2 curve=RESETto1
f86-89 If [?isMainChar Owner]
  else
  (表现类: CameraImpulseAction×1)
f105-108 If [?isMainChar Owner]
  else
  (表现类: CameraImpulseAction×1)
f134-137 If [?isMainChar Owner]
  else
  (表现类: CameraImpulseAction×1)
f0-360 (表现类: CharWeaponVisibleAction×1)
f0-254 (表现类: CharWeaponVisibleAction×1)
f0-360 (表现类: PlaySoundAction×1)
f167-360 (表现类: PlaySoundAction×1)
f10-360 (表现类: VoiceTriggerAction×1)
f21-200 (表现类: EffectAction×1)
f21-200 (表现类: EffectAction×1)
f1-225 (表现类: EffectAction×1)
f1-225 (表现类: EffectAction×1)
f0-104 (表现类: EffectAction×1)
f18-122 (表现类: EffectAction×1)
f0-104 (表现类: EffectAction×1)
f0-59 (表现类: EffectAction×1)
f0-104 (表现类: EffectAction×1)
f64-123 (表现类: EffectAction×1)
f85-144 (表现类: EffectAction×1)
f85-144 (表现类: EffectAction×1)
f104-163 (表现类: EffectAction×1)
f104-163 (表现类: EffectAction×1)
f133-192 (表现类: EffectAction×1)
f133-192 (表现类: EffectAction×1)
f107-166 (表现类: EffectAction×1)
f180-239 (表现类: EffectAction×1)
f85-174 (表现类: EffectAction×1)
f56-145 (表现类: EffectAction×1)
f85-189 (表现类: EffectAction×1)
```


## 增益（13）

### buff_chr_0026_lastrite_combo_skill_hitstop
- life Limited, dur 2, stacking Stack max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  TimeDilation Entity dur=-1
```

### buff_chr_0026_lastrite_combo_skill_sound
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffTrigger:
  (表现类: PlaySoundAction×1)
on OnBuffStart:
  FindTargetAction
```

### buff_chr_0026_lastrite_normal_skill
- life Limited, dur @duration(15), stacking Stack max 1; 黑板默认 {"duration":15,"atk_scale":3,"atb":30,"atk_up":0,"poise":0,"potential_1":0}
- 属性修正: 无
- 伤害修正: Attacker: DamageScaleProcessor NormalCalcZone  @atk_up(0) cond=[?isMainChar Owner && ?decorateMask HasAny 2097152 && ?@potential_1(0) Equals 1]
```
on DuringBuffEnable:
  (表现类: EffectAction×1)
on ability OnBeforeOutputDamage:
  CheckHp
  ?decorateMask HasAny 2097152
  ?isMainChar Owner
  ?@potential_1(0) Equals 1
  Damage target=Target units=[Physical/Poise scale=0 mask=0]
  CheckHp
  CheckTimedMarkerCondition
  ?decorateMask HasAny 2097152
  ?isMainChar Owner
  If [?tag {"$type":"Beyond.Gameplay.Core.Conditions.CheckTagMatch+Data, Gameplay.Beyond","]
    CreateBuff [buff_chr_0026_lastrite_normal_skill_phantom_main{atk_scale1=@atk_scale}] → InstantSearch count=1
    CreateBuff [buff_chr_0026_lastrite_normal_skill_tag] → Source count=1
    (表现类: PlaySoundAction×1)
    else
    CreateBuff [buff_chr_0026_lastrite_normal_skill_phantom{atk_scale=@atk_scale}] → InstantSearch count=1
    CreateBuff [buff_chr_0026_lastrite_normal_skill_tag] → Source count=1
  CreateTimedMarker
```

### buff_chr_0026_lastrite_normal_skill_inattack
- life Limited, dur 1, stacking Stack max 1; 黑板默认 {"atk_scale":0,"duration":0,"atb":0,"atk_up":0,"poise":0,"potential_1":0,"usp":0}; tags [{"tagId":-1486085048}]
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB atk_scale Multiply 0.5 on Owner
  FindTargetAction
  FinishBuff buff_chr_0026_lastrite_normal_skill all layers=1 on Context:team
  CreateBuff [buff_chr_0026_lastrite_normal_skill_self{atk_scale=@atk_scale,duration=@duration,atb=@atb,atk_up=@atk_up,poise=@poise,potential_1=@potential_1}] → Source:team count=1
  (表现类: EffectAction×1 PlaySoundAction×1)
  CheckSquadInFight
  CreateBuff [buff_common_obtain_ultimate_sp] → Owner count=1
  ObtainCost UltimateSp Gain value=@usp(0)×1 src=Default → Source
```

### buff_chr_0026_lastrite_normal_skill_main_start
- life Limited, dur 1.5, stacking Stack max 1; 黑板默认 {"atk_scale":0,"duration":0,"atb":0,"atk_up":0,"potential_1":0,"usp":0}
- 属性修正: 无
- 伤害修正: 无
```
f26-27 FindTargetAction
FinishBuffAction
CreateBuff [buff_chr_0026_lastrite_normal_skill_self{atk_scale=@atk_scale,duration=@duration,atb=@atb,atk_up=@atk_up,potential_1=@potential_1}] → Source:team count=1
CheckSquadInFight
CreateBuff [buff_common_obtain_ultimate_sp] → Owner count=1
ObtainCost UltimateSp Gain value=@usp(0)×1 src=Default → Source
```

### buff_chr_0026_lastrite_normal_skill_phantom
- life Limited, dur 3, stacking Unlimited max 2; 黑板默认 {"atk_scale":0}
- 属性修正: 无
- 伤害修正: 无
```
f0-1 FindTargetAction
f0-1 FindTargetAction
f9-10 Interrupt → Context:tar
SpellInfliction Cryst → Context:tar
Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0) mask=4352]
(表现类: CameraImpulseAction×1 HitStopAction×2 EffectAction×1 EnemyHurtAnimAction×1)
f9-10 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0) mask=4352]
(表现类: EnemyHurtAnimAction×1 EffectAction×1)
f0-89 (表现类: EffectAction×1)
f0-89 (表现类: EffectAction×1)
f0-89 (表现类: EffectAction×1)
f0-89 (表现类: EffectAction×1)
f0-44 (表现类: EffectAction×1)
f0-44 (表现类: EffectAction×1)
f0-30 (表现类: PlaySoundAction×1)
```

### buff_chr_0026_lastrite_normal_skill_phantom_main
- life Limited, dur 3, stacking Unlimited max 2; 黑板默认 {"atk_scale1":0,"atk_scale2":0}
- 属性修正: 无
- 伤害修正: 无
```
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f11-64 (表现类: EffectAction×1)
f11-64 (表现类: EffectAction×1)
f0-1 FindTargetAction
f21-22 Interrupt → Context:tar
SpellInfliction Cryst → Context:tar
Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale1(0) mask=4352]
(表现类: CameraImpulseAction×1 HitStopAction×2 EffectAction×1 EnemyHurtAnimAction×1)
f21-22 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale1(0) mask=4352]
(表现类: EffectAction×1)
```

### buff_chr_0026_lastrite_normal_skill_self
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"atk_scale":0,"duration":0,"atb":0,"atk_up":0,"poise":0,"potential_1":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  CreateBuff [buff_chr_0026_lastrite_normal_skill{duration=@duration,atk_scale=@atk_scale,atb=@atb,poise=@poise,atk_up=@atk_up,potential_1=@potential_1}] → InstantSearch count=1
  ObtainCost Atb Return value=@atb(0)×1 src=Skill → Source
```

### buff_chr_0026_lastrite_normal_skill_tag
- life Infinity, dur 1, stacking Stack max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnAddedBuff:
  CheckBuffStackNum
  FindTargetAction
  FinishBuffAction
  FinishBuffAction
```

### buff_chr_0026_lastrite_passive
- life Infinity, dur 1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  RefrainObtainUsp
```

### buff_chr_0026_lastrite_potential5_vfx
- life Infinity, dur 1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×4 ShowHideActorAction×1)
```

### buff_chr_0026_lastrite_talent_1
- life Infinity, dur 1, stacking Unique max 1; 黑板默认 {"infliction_num":0,"crystal_up":0,"crystal_vul":0,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnConsumeBuff:
  CheckBuffIdInContextAdvanced
  CheckConsumeBuffLayer
  BB crystal_vul = @infliction_num(0) Multiply @crystal_up(0)
  CreateBuff [buff_chr_0026_lastrite_talent_1_vul{crystal_vul=@crystal_vul,duration=@duration}] → Target count=1
```

### buff_chr_0026_lastrite_talent_1_vul
- life Limited, dur @duration(0), stacking HighPriority by crystal_vul max 1; 黑板默认 {"crystal_vul":0,"duration":0,"real_duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SaveBuffLifeTime
  Vulnerable Crystal rate=@crystal_vul(0) dur=@real_duration(0) child=[object Object] → Owner
```
# 解包清单：chr_0032_lizhiyan

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（24）

### chr_0032_lizhiyan_attack1
- 文件黑板: {"atk_scale":0.45,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 224 (7.47s), exclusiveFrame 30 (1.00s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.14,"display_atk_scale":0.42,"atb":0}; L1 黑板 {"atk_scale":0.062,"display_atk_scale":0.19,"atb":0}
```
f0-224 Anim Attack01 dur=7.4666667
f0-6 (表现类: SelfRotateAction×1)
f0-224 (表现类: CustomRootMotionAction×1)
f4-7 CheckEntityNum
CheckDistanceCondition
(表现类: MoveToAction×1)
f0-30 (表现类: SetSuperArmorAction×1)
f10-11 FindTargetAction
f10-11 FindTargetAction
f10-11 FindTargetAction
f10-12 Channeling every 0.033s max/target=1
  If [CheckTargetsEqual]
    Damage target=Target units=[Natural/Hp scale=@atk_scale(0.14) mask=128]
    If [?BuffStack buff_chr_0032_lizhiyan_combo_skill_seal BuffCount GE 1 on Target]
      (表现类: EffectAction×1)
    (表现类: PlaySoundAction×1 EnemyHurtAnimAction×1)
    else
    Damage target=Target units=[Natural/Hp scale=@atk_scale(0.14) mask=128]
    If [?BuffStack buff_chr_0032_lizhiyan_combo_skill_seal BuffCount GE 1 on Target]
      (表现类: EffectAction×1)
    (表现类: PlaySoundAction×1 EnemyHurtAnimAction×1)
f10-12 Channeling every 0.033s max/target=1
  Damage target=Target units=[Natural/Hp scale=@atk_scale(0.14) mask=128]
  If [CheckTargetContains]
    else
    (表现类: PlaySoundAction×1 EnemyHurtAnimAction×1)
Channeling every 0.033s max/target=1
  Damage target=Target units=[Natural/Hp scale=@atk_scale(0.14) mask=128]
  If [CheckTargetContains]
    else
    If [CheckTargetContains]
      else
      (表现类: PlaySoundAction×1 EnemyHurtAnimAction×1)
f7-17 (表现类: EffectAction×1)
f7-17 (表现类: EffectAction×1)
f7-17 (表现类: EffectAction×1)
f10-20 (表现类: EffectAction×1)
f10-20 (表现类: EffectAction×1)
f10-20 (表现类: EffectAction×1)
f10-20 (表现类: EffectAction×1)
f10-20 (表现类: EffectAction×1)
f10-20 (表现类: EffectAction×1)
f0-20 (表现类: EffectAction×1)
f0-20 (表现类: EffectAction×1)
f0-20 (表现类: EffectAction×1)
f6-26 (表现类: EffectAction×1)
f5-28 (表现类: VoiceTriggerAction×1)
f0-29 (表现类: PlaySoundAction×1)
f26-128 (表现类: PlaySoundAction×1)
f0-3 (表现类: CharWeaponVisibleAction×1)
f3-224 (表现类: CharWeaponVisibleAction×1)
f0-3 (表现类: CharWeaponVisibleAction×1)
f3-224 (表现类: CharWeaponVisibleAction×1)
f0-3 (表现类: CharWeaponVisibleAction×1)
f3-224 (表现类: CharWeaponVisibleAction×1)
f0-3 (表现类: CharWeaponVisibleAction×1)
f3-224 (表现类: CharWeaponVisibleAction×1)
f0-3 (表现类: CharWeaponVisibleAction×1)
f3-224 (表现类: CharWeaponVisibleAction×1)
f0-3 (表现类: CharWeaponVisibleAction×1)
f3-224 (表现类: CharWeaponVisibleAction×1)
f8-28 (表现类: EffectAction×1)
f8-28 (表现类: EffectAction×1)
f8-28 (表现类: EffectAction×1)
f8-40 (表现类: CharWeaponAnimationAction×1)
f8-40 (表现类: CharWeaponAnimationAction×1)
f8-40 (表现类: CharWeaponAnimationAction×1)
f0-5 (表现类: CharWeaponVisibleAction×1)
f5-24 (表现类: CharWeaponVisibleAction×1)
f24-224 (表现类: CharWeaponVisibleAction×1)
f5-25 (表现类: CharWeaponAnimationAction×1)
f5-30 (表现类: EffectAction×1)
f5-30 (表现类: EffectAction×1)
f5-30 (表现类: EffectAction×1)
f10-35 (表现类: EffectAction×1)
f10-35 (表现类: EffectAction×1)
f5-24 (表现类: EffectAction×1)
f3-30 ComboCache [Attack→chr_0032_lizhiyan_attack2]
f10-30 AllowNext [chr_0032_lizhiyan_attack2]
f47-122 (表现类: EffectAction×1)
f47-75 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_attack1_projhit
- 文件黑板: {"atk_scale":0,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
f0-3 Damage target=Target units=[Natural/Hp scale=@atk_scale(0) mask=128]
If [?isMainChar Source && CheckEntityNum]
  ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack onlyMain → Source
(表现类: EnemyHurtAnimAction×1)
```

### chr_0032_lizhiyan_attack2
- 文件黑板: {"atk_scale":0.52,"atb":0,"poise":0,"rand_scale":"dyn","rand_offset_x":"dyn","rand_offset_y":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 215 (7.17s), exclusiveFrame 30 (1.00s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.16,"display_atk_scale":0.48,"atb":0}; L1 黑板 {"atk_scale":0.071,"display_atk_scale":0.21,"atb":0}
```
f0-215 Anim Attack02 dur=7.16666651
f0-30 (表现类: SetSuperArmorAction×1)
f0-8 (表现类: SelfRotateAction×1)
f0-118 (表现类: CustomRootMotionAction×1)
f11-12 FindTargetAction
f12-13 FindTargetAction
f13-14 FindTargetAction
f11-12 ForEachAction
If [?isMainChar Owner]
  (表现类: CameraImpulseAction×1 HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f12-13 ForEachAction
If [?isMainChar Owner]
  ObtainCost Atb Gain value=@atb(0)×0.167 src=NormalAttack → Source
  (表现类: CameraImpulseAction×1 HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f13-14 ForEachAction
If [?isMainChar Owner]
  ObtainCost Atb Gain value=@atb(0)×0.167 src=NormalAttack → Source
  (表现类: CameraImpulseAction×1 HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f1-7 CheckEntityNum
SnapToTargetWithRangeAction
f11-12 Damage target=Context:tar units=[]
f12-13 Damage target=Context:tar units=[]
f13-14 Damage target=Context:tar units=[]
f10-27 (表现类: AddDynamicCcsAction×1)
f10-45 (表现类: EffectAction×1)
f9-44 (表现类: EffectAction×1)
f11-46 (表现类: EffectAction×1)
f12-47 (表现类: EffectAction×1)
f13-48 (表现类: EffectAction×1)
f14-49 (表现类: EffectAction×1)
f9-44 (表现类: EffectAction×1)
f0-17 (表现类: CharWeaponVisibleAction×1)
f17-215 (表现类: CharWeaponVisibleAction×1)
f0-17 (表现类: CharWeaponVisibleAction×1)
f17-215 (表现类: CharWeaponVisibleAction×1)
f0-16 (表现类: CharWeaponVisibleAction×1)
f16-215 (表现类: CharWeaponVisibleAction×1)
f0-16 (表现类: CharWeaponVisibleAction×1)
f16-215 (表现类: CharWeaponVisibleAction×1)
f0-18 (表现类: CharWeaponVisibleAction×1)
f18-215 (表现类: CharWeaponVisibleAction×1)
f0-18 (表现类: CharWeaponVisibleAction×1)
f18-215 (表现类: CharWeaponVisibleAction×1)
f0-25 (表现类: EffectAction×1)
f35-55 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f35-55 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f35-55 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f35-55 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f35-55 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f35-55 (表现类: EffectAction×1)
f0-22 (表现类: CharWeaponVisibleAction×1)
f22-215 (表现类: CharWeaponVisibleAction×1)
f0-28 (表现类: CharWeaponAnimationAction×1)
f0-25 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f11-36 (表现类: EffectAction×1)
f2-27 (表现类: EffectAction×1)
f8-68 (表现类: VoiceTriggerAction×1)
f0-42 (表现类: PlaySoundAction×1)
f30-163 (表现类: PlaySoundAction×1)
f0-32 ComboCache [Attack→chr_0032_lizhiyan_attack3]
f14-32 AllowNext [chr_0032_lizhiyan_attack3]
f35-120 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_attack3
- 文件黑板: {"atk_scale":0.33,"atb":0,"poise":0}; cast cost UltimateSp 0; cd 0; durationFrame 235 (7.83s), exclusiveFrame 30 (1.00s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.38,"display_atk_scale":0.75,"atb":0}; L1 黑板 {"atk_scale":0.17,"display_atk_scale":0.33,"atb":0}
```
f0-235 Anim Attack03 dur=7.83333349
f0-5 (表现类: SelfRotateAction×1)
f7-13 (表现类: SelfRotateAction×1)
f17-25 (表现类: SelfRotateAction×1)
f0-5 If [CheckEntityNum]
  If [CheckDistanceCondition]
    (表现类: MoveToAction×1)
    else
    (表现类: MoveToAction×1)
  else
  (表现类: MoveToAction×1)
f5-235 (表现类: CustomRootMotionAction×1)
f5-8 FindTargetAction
f13-16 FindTargetAction
f5-6 ForEachAction
If [?isMainChar Owner]
  ObtainCost Atb Gain value=@atb(0)×0.167 src=NormalAttack → Source
  (表现类: CameraImpulseAction×1 HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f13-14 ForEachAction
If [?isMainChar Owner]
  ObtainCost Atb Gain value=@atb(0)×0.167 src=NormalAttack → Source
  (表现类: CameraImpulseAction×1 HitStopAction×1)
(表现类: EnemyHurtAnimAction×1)
f5-6 Damage target=Context:tar units=[]
f13-14 Damage target=Context:tar units=[]
f5-8 If [CheckEntityNum]
  else
  (表现类: EffectAction×1)
f13-16 If [CheckEntityNum]
  else
  (表现类: EffectAction×1)
f5-6 ?isMainChar Source
(表现类: CameraImpulseAction×2)
f13-14 ?isMainChar Source
(表现类: CameraImpulseAction×2)
f0-30 (表现类: SetSuperArmorAction×1)
f3-71 (表现类: EffectAction×1)
f7-75 (表现类: EffectAction×1)
f10-78 (表现类: EffectAction×1)
f0-68 (表现类: EffectAction×1)
f0-242 (表现类: CharWeaponVisibleAction×1)
f0-242 (表现类: CharWeaponVisibleAction×1)
f0-242 (表现类: CharWeaponVisibleAction×1)
f0-25 (表现类: CharWeaponVisibleAction×1)
f25-46 (表现类: CharWeaponVisibleAction×1)
f46-242 (表现类: CharWeaponVisibleAction×1)
f0-25 (表现类: CharWeaponVisibleAction×1)
f25-46 (表现类: CharWeaponVisibleAction×1)
f46-242 (表现类: CharWeaponVisibleAction×1)
f0-25 (表现类: CharWeaponVisibleAction×1)
f25-242 (表现类: CharWeaponVisibleAction×1)
f0-26 (表现类: VoiceTriggerAction×1)
f0-8 (表现类: PlaySoundAction×1)
f5-44 (表现类: PlaySoundAction×1)
f7-21 (表现类: PlaySoundAction×1)
f13-52 (表现类: PlaySoundAction×1)
f26-168 (表现类: PlaySoundAction×1)
f0-39 ComboCache [Attack→chr_0032_lizhiyan_attack4]
f22-39 AllowNext [chr_0032_lizhiyan_attack4]
f20-85 (表现类: EffectAction×1)
f81-91 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_attack4
- 文件黑板: {"atk_scale":0.33,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 230 (7.67s), exclusiveFrame 26 (0.87s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.1,"display_atk_scale":0.8,"poise":0,"atb":0}; L1 黑板 {"atk_scale":0.045,"display_atk_scale":0.36,"poise":0,"atb":0}
```
f0-230 Anim Attack04 dur=7.66666651
f0-7 (表现类: SelfRotateAction×1)
f0-230 (表现类: CustomRootMotionAction×1)
f0-230 (表现类: CustomRootMotionAction×1)
f0-26 (表现类: SetSuperArmorAction×1)
f0-20 (表现类: AddDynamicCcsAction×1)
f2-30 (表现类: RayCastEffectAction×1)
f2-30 (表现类: RayCastEffectAction×1)
f2-18 (表现类: RayCastEffectAction×1)
f2-30 (表现类: RayCastEffectAction×1)
f2-30 (表现类: RayCastEffectAction×1)
f2-18 (表现类: RayCastEffectAction×1)
f2-3 MergeTargetAction
Damage target=Context:tar1 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f5-6 MergeTargetAction
Damage target=Context:tar1 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f8-9 MergeTargetAction
Damage target=Context:tar1 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f11-12 MergeTargetAction
Damage target=Context:tar1 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f2-3 MergeTargetAction
Damage target=Context:tar2 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f5-6 MergeTargetAction
Damage target=Context:tar2 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f8-9 MergeTargetAction
Damage target=Context:tar2 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f11-12 MergeTargetAction
Damage target=Context:tar2 units=[Natural/Hp scale=@atk_scale(0.1) mask=128]
(表现类: EnemyHurtAnimAction×1)
f2-18 (表现类: CameraImpulseAction×1)
f2-64 (表现类: EffectAction×1)
f2-64 (表现类: EffectAction×1)
f4-66 (表现类: EffectAction×1)
f4-36 (表现类: EffectAction×1)
f4-36 ForEachAction
f0-44 (表现类: CharWeaponVisibleAction×1)
f44-230 (表现类: CharWeaponVisibleAction×1)
f0-44 (表现类: CharWeaponVisibleAction×1)
f44-230 (表现类: CharWeaponVisibleAction×1)
f0-230 (表现类: CharWeaponVisibleAction×1)
f0-51 (表现类: CharWeaponVisibleAction×1)
f51-230 (表现类: CharWeaponVisibleAction×1)
f0-51 (表现类: CharWeaponVisibleAction×1)
f51-230 (表现类: CharWeaponVisibleAction×1)
f0-230 (表现类: CharWeaponVisibleAction×1)
f2-34 (表现类: CharWeaponAnimationAction×1)
f2-34 (表现类: CharWeaponAnimationAction×1)
f0-60 (表现类: EffectAction×1)
f0-60 (表现类: EffectAction×1)
f0-60 (表现类: EffectAction×1)
f0-60 (表现类: EffectAction×1)
f37-93 (表现类: EffectAction×1)
f37-93 (表现类: EffectAction×1)
f37-97 (表现类: EffectAction×1)
f37-97 (表现类: EffectAction×1)
f39-98 (表现类: EffectAction×1)
f39-98 (表现类: EffectAction×1)
f0-22 (表现类: CharWeaponVisibleAction×1)
f22-230 (表现类: CharWeaponVisibleAction×1)
f0-28 (表现类: CharWeaponAnimationAction×1)
f2-14 (表现类: EffectAction×1)
f2-14 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f0-25 (表现类: EffectAction×1)
f16-45 CreateBuff [buff_chr_0032_lizhiyan_attack4_effect] → Owner count=1
f14-39 (表现类: EffectAction×1)
f0-44 (表现类: PlaySoundAction×1)
f3-29 (表现类: PlaySoundAction×1)
f4-38 (表现类: PlaySoundAction×1)
f18-126 (表现类: PlaySoundAction×1)
f1-16 (表现类: VoiceTriggerAction×1)
f0-39 ComboCache [Attack→chr_0032_lizhiyan_attack5]
f18-39 AllowNext [chr_0032_lizhiyan_attack5]
f35-60 (表现类: EffectAction×1)
f57-67 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_attack5
- 文件黑板: {"atk_scale":0.8,"atb":20,"poise":10,"isHitbyMain":"dyn","start_angle1":60,"finish_angle1":20,"start_angle2":120,"finish_angle2":160}; cast cost UltimateSp 0; cd 0; durationFrame 300 (10.00s), exclusiveFrame 41 (1.37s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":1.06,"display_atk_scale":1.06,"poise":17,"atb":17}; L1 黑板 {"atk_scale":0.47,"display_atk_scale":0.47,"poise":17,"atb":17}
```
f0-300 Anim Attack05 dur=10
f0-15 (表现类: SelfRotateAction×1)
f22-25 FindTargetAction
f22-25 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale(1.06) mask=2097280 | Physical/Poise scale=0 mask=0]
If [?isMainChar Source:tar]
  If [CheckEntityNum]
    BB isHitbyMain Assign 1 on Owner
  ObtainCost Atb Gain value=@atb(17)×1 src=NormalAttack → Source
(表现类: EnemyHurtAnimAction×1)
f22-25 (表现类: CameraImpulseAction×1)
f23-25 If [?@isHitbyMain GE 1]
  (表现类: HitStopAction×1)
f0-23 (表现类: CustomRootMotionAction×1)
f23-35 (表现类: MoveToAction×1)
f35-300 (表现类: MoveToAction×1)
f0-41 (表现类: SetSuperArmorAction×1)
f0-22 (表现类: AddDynamicCcsAction×1)
f22-33 (表现类: AddDynamicCcsAction×1)
f22-25 If [?isMainChar Owner]
  ForEachAction
  If [CheckEntityNum]
    If [?isMainChar Source && ?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_listener_owner BuffCount GE 1 on Source]
      (表现类: EffectAction×1)
      else
      If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_listener BuffCount GE 1 on Source]
        (表现类: EffectAction×1)
        else
        (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  else
  ForEachAction
  If [CheckEntityNum]
    If [?isMainChar Source && ?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_listener_owner BuffCount GE 1 on Source]
      (表现类: EffectAction×1)
      else
      If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_listener BuffCount GE 1 on Source]
        (表现类: EffectAction×1)
        else
        (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
f0-48 (表现类: EffectAction×1)
f0-48 (表现类: EffectAction×1)
f0-48 (表现类: EffectAction×1)
f2-50 (表现类: EffectAction×1)
f33-71 (表现类: EffectAction×1)
f18-66 (表现类: EffectAction×1)
f18-36 (表现类: EffectAction×1)
f18-36 (表现类: EffectAction×1)
f18-36 (表现类: EffectAction×1)
f18-36 (表现类: EffectAction×1)
f18-66 (表现类: EffectAction×1)
f0-18 (表现类: CharWeaponVisibleAction×1)
f18-32 (表现类: CharWeaponVisibleAction×1)
f32-251 (表现类: CharWeaponVisibleAction×1)
f251-300 (表现类: CharWeaponVisibleAction×1)
f0-32 (表现类: CharWeaponVisibleAction×1)
f32-251 (表现类: CharWeaponVisibleAction×1)
f251-300 (表现类: CharWeaponVisibleAction×1)
f0-2 (表现类: CharWeaponVisibleAction×1)
f2-22 (表现类: CharWeaponVisibleAction×1)
f22-64 (表现类: CharWeaponVisibleAction×1)
f64-180 (表现类: CharWeaponVisibleAction×1)
f180-251 (表现类: CharWeaponVisibleAction×1)
f251-300 (表现类: CharWeaponVisibleAction×1)
f0-32 (表现类: CharWeaponVisibleAction×1)
f32-243 (表现类: CharWeaponVisibleAction×1)
f243-300 (表现类: CharWeaponVisibleAction×1)
f0-32 (表现类: CharWeaponVisibleAction×1)
f32-243 (表现类: CharWeaponVisibleAction×1)
f243-300 (表现类: CharWeaponVisibleAction×1)
f0-2 (表现类: CharWeaponVisibleAction×1)
f2-32 (表现类: CharWeaponVisibleAction×1)
f32-56 (表现类: CharWeaponVisibleAction×1)
f56-184 (表现类: CharWeaponVisibleAction×1)
f184-243 (表现类: CharWeaponVisibleAction×1)
f243-300 (表现类: CharWeaponVisibleAction×1)
f0-48 (表现类: EffectAction×1)
f56-104 (表现类: EffectAction×1)
f175-223 (表现类: EffectAction×1)
f243-291 (表现类: EffectAction×1)
f4-52 (表现类: EffectAction×1)
f173-221 (表现类: EffectAction×1)
f243-291 (表现类: EffectAction×1)
f4-52 (表现类: EffectAction×1)
f243-291 (表现类: EffectAction×1)
f4-52 (表现类: EffectAction×1)
f4-52 (表现类: EffectAction×1)
f4-52 (表现类: EffectAction×1)
f19-67 (表现类: EffectAction×1)
f26-74 (表现类: EffectAction×1)
f26-74 (表现类: EffectAction×1)
f13-78 (表现类: VoiceTriggerAction×1)
f0-40 (表现类: PlaySoundAction×1)
f18-54 (表现类: PlaySoundAction×1)
f23-52 (表现类: PlaySoundAction×1)
f23-221 (表现类: PlaySoundAction×1)
f0-50 ComboCache [Attack→chr_0032_lizhiyan_attack1]
f40-50 AllowNext [chr_0032_lizhiyan_attack1]
```

### chr_0032_lizhiyan_combo_skill
- 文件黑板: {"atk_scale_boom":2.85,"atk_scale_touch":1,"radius":5.67,"usp":10,"poise_boom":5,"poise_touch":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","consumed_layer":"dyn","consumed_type":"dyn","duration":"dyn","duration_pre":0.633,"duration_final":"dyn","duration_effect":"dyn","trigger_time":"dyn","atk_scale_wisd_ratio":5,"duration_extra":6,"cd_reduce":0,"rate":0.4,"rate_pre":0.1,"atk_scale_laser1":1,"atk_scale_laser2":2,"poise_laser":5,"duration_seal2":"dyn","rate_final":"dyn","spell_vul_per_will":"dyn","max_spell_vul_will":"dyn","will":"dyn","atb_return_wisd":10,"duration_will":5,"duration_total":"dyn"}; cast cost UltimateSp 0; cd 10; durationFrame 122 (4.07s), exclusiveFrame 23 (0.77s)
- 等级表 L12: cost UltSp 0, cd 18, 黑板 {"atk_scale_touch":0.8,"atk_scale_boom":1.2,"atk_scale_laser1":0.6,"atk_scale_laser2":2.6,"display_atk_scale_laser_wisd":5,"usp":10,"poise_touch":5,"poise_boom":5,"poise_laser":0,"duration_will":6,"duration":4,"duration_wisd":2,"spell_vul_per_will":0.0001,"rate_pre":0.04,"atb_return_wisd":30,"max_spell_vul_will":0.08,"display_max_spell_vul_will":640}; L1 黑板 {"atk_scale_touch":0.35,"atk_scale_boom":0.53,"atk_scale_laser1":0.27,"atk_scale_laser2":1.15,"display_atk_scale_laser_wisd":2.22,"usp":10,"poise_touch":5,"poise_boom":5,"poise_laser":0,"duration_will":6,"duration":4,"duration_wisd":2,"spell_vul_per_will":0.0001,"rate_pre":0.04,"atb_return_wisd":28,"max_spell_vul_will":0.07,"display_max_spell_vul_will":560}
```
f0-12 Anim ComboSkill dur=0.4
f12-122 Anim ComboSkill04 dur=3.66666675
f0-3 If [?@EntityBB_wisd_greater_will GE 1]
  BB duration_final = @duration_pre(0.633) Add @duration(4)
  BB trigger_time = @duration_final Add -0.5
  If [?@EntityBB_wisd_greater_will GE 1]
    BB rate_final Assign @rate_pre(0.04) on Owner
    else
    If [?BuffStack buff_chr_0032_lizhiyan_talent2 BuffCount LT 1 on Source]
    StoreAttributeValue
    BB rate_final = @spell_vul_per_will(0.0001) Multiply @will
    If [?@rate_final LE @max_spell_vul_will(0.08)]
      BB rate_final = @rate_final Add @rate_pre(0.04)
      else
      BB rate_final = @max_spell_vul_will(0.08) Multiply 1
      BB rate_final = @rate_final Add @rate_pre(0.04)
  else
  BB duration = 0 Add @duration_will(6)
  BB duration_final = @duration_pre(0.633) Add @duration(4)
  BB trigger_time = @duration_final Add -0.5
  If [?@EntityBB_wisd_greater_will GE 1]
    BB rate_final Assign @rate_pre(0.04) on Owner
    else
    If [?BuffStack buff_chr_0032_lizhiyan_talent2 BuffCount LT 1 on Source]
    StoreAttributeValue
    BB rate_final = @spell_vul_per_will(0.0001) Multiply @will
    If [?@rate_final LE @max_spell_vul_will(0.08)]
      BB rate_final = @rate_final Add @rate_pre(0.04)
      else
      BB rate_final = @max_spell_vul_will(0.08) Multiply 1
      BB rate_final = @rate_final Add @rate_pre(0.04)
f0-5 IgnoreModelIntervalCheck
f0-0 If [CheckEntityNum && CheckDistanceCondition]
  MergeTargetAction
  else
  If [CheckEntityNum && CheckDistanceCondition]
    MergeTargetAction
    else
    FindTargetAction
    FindTargetAction
f9-10 TimeDilation Global dur=0.033 curve=RESETto1
f9-10 CheckEntityNum
FindTargetAction
FindTargetAction
FindTargetAction
FindTargetAction
Spawn abilityentity_chr_0032_lizhiyan_combo_skill skill=chr_032_lizhiyan_combo_skill_abilityentity_seal {EntityBB_wisd_greater_will=@EntityBB_wisd_greater_will} dur=40
Spawn abilityentity_chr_0032_lizhiyan_combo_skill skill=chr_032_lizhiyan_combo_skill_abilityentity_seal {EntityBB_wisd_greater_will=@EntityBB_wisd_greater_will} dur=40
Spawn abilityentity_chr_0032_lizhiyan_combo_skill skill=chr_032_lizhiyan_combo_skill_abilityentity_seal {EntityBB_wisd_greater_will=@EntityBB_wisd_greater_will} dur=40
Spawn abilityentity_chr_0032_lizhiyan_combo_skill skill=chr_032_lizhiyan_combo_skill_abilityentity_seal {EntityBB_wisd_greater_will=@EntityBB_wisd_greater_will} dur=40
SetAbilityEntityDuration
SetAbilityEntityDuration
SetAbilityEntityDuration
SetAbilityEntityDuration
f9-12 If [CheckEntityNum]
  SetAbilityEntityDuration
  SetAbilityEntityDuration
  SetAbilityEntityDuration
  SetAbilityEntityDuration
f0-3 If [?isMainChar Source]
  (表现类: SelfRotateAction×1)
  else
  TeleportPosSelectAction
  (表现类: TeleportAction×1 SelfRotateAction×1 EffectAction×1)
f0-11 (表现类: SelfRotateAction×1)
f0-12 (表现类: CustomRootMotionAction×1)
f12-122 (表现类: CustomRootMotionAction×1)
f0-13 (表现类: SetSuperArmorAction×1)
f13-23 (表现类: SetSuperArmorAction×1)
f0-11 CreateBuff [buff_chr_0032_lizhiyan_combo_skill_precheck] → Context:trigger count=1
f0-6 TimeDilation Entity dur=0.25
f9-12 BB duration_total = @duration_final Add 0.067
f9-30 CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_total{duration_total=@duration_total,duration_final=@duration_final,rate_final=@rate_final,trigger_time=@trigger_time,isWisd=@EntityBB_wisd_greater_will,atk_scale_boom=@atk_scale_boom,poise_boom=@poise_boom,radius=@radius,duration_seal2=@duration,rate_pre=@rate_pre,atk_scale_touch=@atk_scale_touch,poise_touch=@poise_touch,usp=@usp,atb_return_wisd=@atb_return_wisd}] → Source count=1
f0-15 TimeDilation Global dur=0.6 curve=ComboSkill
f0-15 If [?isMainChar Owner]
  else
  FindTargetAction
  SaveTargetDistanceAction
  If [CheckComboSkillCameraAlphaSetting]
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
    else
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
f0-16 If [?isMainChar Owner]
  else
  TemporaryUnlockAction
f0-18 (表现类: OverrideCameraFollowAction×1)
f16-39 AllowNext [chr_0032_lizhiyan_normal_skill]
f0-49 (表现类: EffectAction×1)
f9-58 If [CheckEntityNum]
  If [?@EntityBB_wisd_greater_will GE 1]
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
  else
  If [?@EntityBB_wisd_greater_will GE 1]
    (表现类: EffectAction×1)
  (表现类: EffectAction×1)
f0-58 (表现类: EffectAction×1)
f0-57 (表现类: EffectAction×1)
f0-19 (表现类: VoiceTriggerAction×1)
f0-31 (表现类: PlaySoundAction×1)
f76-114 (表现类: PlaySoundAction×1)
f0-84 (表现类: CharWeaponVisibleAction×1)
f84-122 (表现类: CharWeaponVisibleAction×1)
f0-84 (表现类: CharWeaponVisibleAction×1)
f84-122 (表现类: CharWeaponVisibleAction×1)
f0-84 (表现类: CharWeaponVisibleAction×1)
f84-122 (表现类: CharWeaponVisibleAction×1)
f0-76 (表现类: CharWeaponVisibleAction×1)
f76-122 (表现类: CharWeaponVisibleAction×1)
f0-76 (表现类: CharWeaponVisibleAction×1)
f76-122 (表现类: CharWeaponVisibleAction×1)
f0-76 (表现类: CharWeaponVisibleAction×1)
f76-122 (表现类: CharWeaponVisibleAction×1)
f0-122 (表现类: CharWeaponVisibleAction×1)
f76-124 (表现类: EffectAction×1)
f76-124 (表现类: EffectAction×1)
f76-124 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_combo_skill_abilityentity_death_move
- 文件黑板: {"atk_scale_final":1,"atb_final":50,"minAngle":"dyn","number":0,"radius":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise_final":0}; cast cost UltimateSp 0; cd 0; durationFrame 200 (6.67s), exclusiveFrame 150 (5.00s)
```
f0-30 (表现类: MoveToAction×1)
```

### chr_0032_lizhiyan_combo_skill_abilityentity_end
- 文件黑板: {"atk_scale_boom":1,"atb_final":50,"minAngle":"dyn","number":0,"radius":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise_boom":5,"atb_return_wisd":0}; cast cost UltimateSp 0; cd 0; durationFrame 45 (1.50s), exclusiveFrame 22 (0.73s)
```
f0-45 Anim RopeAttack dur=1.5
f0-6 SetAnimatorParamAction
f9-12 FinishBuff buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect|buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line all layers=1 on Owner
f21-22 TriggerCustomAbilityEvent
f44-45 FinishOwnerAction
f15-44 (表现类: ShowHideActorAction×1)
f0-15 ChannelingActionV2
  If [CheckEntityNum]
    FindTargetAction
f10-14 (表现类: MoveToAction×1)
f0-14 CheckTimedMarkerCondition
?@EntityBB_wisd_greater_will GE 1
CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener{atk_scale_early_finish=@atk_scale_boom,poise_early_finish=@poise_boom,atb_return_wisd=@atb_return_wisd}] → Target count=1
CreateTimedMarker
f14-17 If [CheckEntityNum]
  FindTargetAction
  else
  FindTargetAction
f14-20 If [CheckEntityNum]
  If [CheckTimedMarkerCondition]
    Interrupt → Context:tar
    Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_boom(1) mask=12288 | Physical/Poise scale=0 mask=0]
    TakeDownAction
    CreateTimedMarker
    (表现类: EffectAction×1 PlaySoundAction×1 EnemyHurtAnimAction×1)
  (表现类: HitStopAction×1)
  else
  ?BuffStack buff_chr_0032_lizhiyan_combo_skill_seal_self_dead BuffCount Equals 0 on Target
  CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_self_dead] → Target count=1
  Interrupt → Context:tar
  Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_boom(1) mask=12288 | Physical/Poise scale=0 mask=0]
  TakeDownAction
  CreateTimedMarker
  (表现类: EffectAction×1 PlaySoundAction×1 EnemyHurtAnimAction×1)
f0-3 CreateTimedMarker
f14-17 ForEachAction
f14-18 (表现类: CameraImpulseAction×1)
f10-30 (表现类: EffectAction×1)
f9-45 (表现类: PlaySoundAction×1)
```

### chr_0032_lizhiyan_combo_skill_abilityentity_seal_again
- 文件黑板: {"atk_scale_laser1":6,"atk_scale_laser2":2,"atb_final":"dyn","minAngle":"dyn","number":0,"radius":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise_laser":5,"rate_final":0.3,"duration_vul":2,"atk_scale_wisd_ratio":0,"duration_extra":0,"duration_calc":"dyn","atk_scale_calc":"dyn","isWisd":"dyn","cd_reduce":3,"atb_return_wisd":10,"radius_early_finish":5.67}; cast cost UltimateSp 0; cd 0; durationFrame 243 (8.10s), exclusiveFrame 22 (0.73s)
```
f0-243 Anim RopeAgain dur=8.1
f0-6 SetAnimatorParamAction
f0-3 FinishBuff buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line all layers=1 on Owner
f0-24 (表现类: MoveToAction×1)
f23-241 (表现类: ShowHideActorAction×1)
f0-3 If [?@EntityBB_wisd_greater_will GE 1]
  BB isWisd Assign 1 on Owner
  BB atk_scale_calc = @atk_scale_laser1(6) Multiply 1
  BB duration_calc = @duration_vul(2) Add 0
  else
  BB isWisd Assign 0 on Owner
  BB atk_scale_calc = @atk_scale_laser2(2) Multiply 1
  BB duration_calc = @duration_vul(2) Add @duration_extra(0)
f41-44 If [?@isWisd GE 1]
  If [CheckTimedMarkerCondition && ?BuffStack buff_chr_0032_lizhiyan_combo_skill_seal_finish_count BuffCount LT 1 on Source && ?BuffStack buff_chr_0032_lizhiyan_combo_skill_seal_finish_self_dead BuffCount LT 1 on Target]
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_finish_self_dead] → Target count=1
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_finish_count] → Source count=1
    Spawn abilityentity_chr_0032_lizhiyan_combo_skill_death skill=chr_0032_lizhiyan_combo_skill_abilityentity_death_move
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd{atk_scale_laser1=@atk_scale_laser1,atk_scale_laser2=@atk_scale_laser2,poise_final=@poise_laser,isWisd=@isWisd,cd_reduce=@cd_reduce,atb_return_wisd=@atb_return_wisd}] → Context:death count=1
    JumpToAction
    else
    JumpToAction
f23-26 FinishBuff buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect all layers=1 on Owner
f239-239 CheckTimedMarkerCondition
If [?@isWisd GE 1]
  else
  CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_finisher{atk_scale_laser2=@atk_scale_laser2,poise_final=@poise_laser,isWisd=@isWisd}] → Target count=1
  CreateTimedMarker
f240-243 FinishOwnerAction
f0-240 CheckTimedMarkerCondition
If [?@EntityBB_wisd_greater_will GE 1]
  CreateTimedMarker
  CreateBuff [buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable{rate=@rate_final,duration_vul=@duration_calc,atk_scale_calc=@atk_scale_calc,poise_final=@poise_laser,isWisd=@isWisd,atk_scale_laser1=@atk_scale_laser1,atk_scale_laser2=@atk_scale_laser2}] → InstantSearch count=1
  else
  CreateTimedMarker
  CreateBuff [buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable{rate=@rate_final,duration_vul=@duration_calc,atk_scale_calc=@atk_scale_calc,poise_final=@poise_laser,isWisd=@isWisd,atk_scale_laser1=@atk_scale_laser1,atk_scale_laser2=@atk_scale_laser2}] → InstantSearch count=1
f21-55 (表现类: EffectAction×1)
f0-55 (表现类: PlaySoundAction×1)
```

### chr_0032_lizhiyan_combo_skill_abilityentity_seal_finisher
- 文件黑板: {"atk_scale_final":6,"atb_final":50,"minAngle":"dyn","number":0,"radius":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise_final":5,"rate":0.3,"duration_vul":6,"atk_scale_wisd_ratio":0,"duration_extra":0,"duration_calc":"dyn","atk_scale_calc":"dyn","isWisd":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 19 (0.63s), exclusiveFrame 19 (0.63s)
```
f0-19 Anim SealFinish dur=0.6333333
f0-6 SetAnimatorParamAction
f18-19 FinishOwnerAction
```

### chr_0032_lizhiyan_normal_skill
- 文件黑板: {"atk_scale":2.85,"poise":10,"consume_cnt":0,"input_angle":"dyn","cam_duration":"dyn","cam_angle":"dyn","duration":6,"radius":5,"atk_scale_wisd_ratio":1.5,"atk_scale_will":3,"atk_scale_wisd":4.5}; cast cost Atb 40; cd 30; durationFrame 225 (7.50s), exclusiveFrame 32 (1.07s)
- 等级表 L12: cost Atb 100, cd 0, 黑板 {"atk_scale_will":3,"atk_scale_wisd":5,"poise":10}; L1 黑板 {"atk_scale_will":1.33,"atk_scale_wisd":2.22,"poise":10}
```
f0-225 Anim Skill dur=7.5
f0-2 FindTargetAction
FindTargetAction
If [?isMainChar Source]
  else
  TeleportPosSelectAction
  CheckDistanceCondition
  (表现类: TeleportAction×1)
f0-3 If [?@EntityBB_wisd_greater_will GE 1]
  If [CheckEntityNum]
    MergeTargetAction
    else
    MergeTargetAction
  else
  MergeTargetAction
f0-2 If [CheckEntityNum]
  (表现类: SelfRotateAction×1)
  else
  (表现类: SelfRotateAction×1)
f0-3 FindTargetAction
f0-2 Spawn abilityentity_chr_0032_lizhiyan_normal_skill skill=chr_0032_lizhiyan_normal_skill_abilityrange2 {EntityBB_wisd_greater_will=@EntityBB_wisd_greater_will} dur=7
f0-16 If [CheckEntityNum && NotNextCheckAction && ?isMainChar Owner]
  SaveTwoDirectionAngle
  CurveEvaluateFloat
  CurveEvaluateFloat
  CameraRotateAction
f0-15 If [CheckDistanceCondition]
  If [CheckEntityNum]
    (表现类: MoveToAction×1)
    else
    (表现类: MoveToAction×1)
  else
  (表现类: MoveToAction×1)
f0-32 (表现类: SetSuperArmorAction×1)
f10-58 (表现类: EffectAction×1)
f10-58 (表现类: EffectAction×1)
f10-58 (表现类: EffectAction×1)
f0-48 (表现类: EffectAction×1)
f0-48 (表现类: EffectAction×1)
f24-56 AllowNext [chr_0032_lizhiyan_combo_skill]
f0-64 (表现类: VoiceTriggerAction×1)
f0-48 (表现类: PlaySoundAction×1)
f11-64 (表现类: PlaySoundAction×1)
f0-225 (表现类: CharWeaponVisibleAction×1)
f0-225 (表现类: CharWeaponVisibleAction×1)
f0-225 (表现类: CharWeaponVisibleAction×1)
f0-225 (表现类: CharWeaponVisibleAction×1)
f0-225 (表现类: CharWeaponVisibleAction×1)
```

### chr_0032_lizhiyan_normal_skill_abilityrange
- 文件黑板: {"radius":5,"duration":6,"atk_scale":0,"isJumped":"dyn","poise":0}; cast cost UltimateSp 0; cd 0; durationFrame 240 (8.00s), exclusiveFrame 180 (6.00s)
```
f21-180 AuraAction
f21-180 EventListenerAction
f20-20 FindTargetAction
f186-186 FindTargetAction
f187-190 FinishOwnerAction
f20-23 ForEachAction
Damage target=Context:tar units=[Natural/Hp scale=@atk_scale(0) mask=256 | Natural/Poise scale=0 mask=0]
InverseSpellInfliction
(表现类: EnemyHurtAnimAction×1)
f186-189 ForEachAction
Damage target=Context:tar units=[Natural/Hp scale=@atk_scale(0) mask=256 | Natural/Poise scale=0 mask=0]
?@isJumped GE 1
InverseSpellInfliction
(表现类: EnemyHurtAnimAction×1)
f20-23 (表现类: CameraImpulseAction×1)
f186-189 (表现类: CameraImpulseAction×1)
f0-186 (表现类: EffectAction×1)
f0-186 (表现类: EffectAction×1)
f0-186 (表现类: EffectAction×1)
f0-186 (表现类: EffectAction×1)
f186-366 (表现类: EffectAction×1)
f186-487 (表现类: PlaySoundAction×1)
f0-180 (表现类: PlaySoundAction×1)
```

### chr_0032_lizhiyan_normal_skill_abilityrange2
- 文件黑板: {"radius":"dyn","duration":6,"atk_scale":0,"isJumped":"dyn","poise":0,"atk_scale_wisd_ratio":1.5,"atk_scale_final":"dyn","atb_return_dynamic":"dyn","has_returned":"dyn","atk_scale_will":1,"atk_scale_wisd":1,"effect_count":"dyn","max_effect_count":3}; cast cost UltimateSp 0; cd 0; durationFrame 240 (8.00s), exclusiveFrame 180 (6.00s)
```
f0-3 BB radius Add 0.67 on Owner
f20-20 FindTargetAction
f20-22 ForEachAction
Interrupt → Context:tar
SpellInfliction Natural → Context:tar
If [?@EntityBB_wisd_greater_will GE 1]
  Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_wisd(1) mask=4352 | Natural/Poise scale=0 mask=0]
  else
  ConvertToTargetContext
  PullAction
  Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_will(1) mask=4352 | Natural/Poise scale=0 mask=0]
(表现类: EnemyHurtAnimAction×1 HitStopAction×1)
f19-22 (表现类: CameraImpulseAction×1)
f20-23 If [CheckEntityNum]
  CreateBuff [buff_common_obtain_ultimate_sp] → Source count=1
f22-25 FinishOwnerAction
f0-186 If [?@EntityBB_wisd_greater_will GE 1]
  (表现类: EffectAction×3)
  else
  (表现类: EffectAction×3)
f16-19 If [?@EntityBB_wisd_greater_will GE 1]
  else
  (表现类: EffectAction×1)
f19-22 If [?@EntityBB_wisd_greater_will GE 1]
  (表现类: EffectAction×1)
f19-22 If [?@EntityBB_wisd_greater_will GE 1]
  (表现类: PlaySoundAction×1)
  else
  (表现类: PlaySoundAction×1)
```

### chr_0032_lizhiyan_passive
- 文件黑板: {}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
```

### chr_0032_lizhiyan_plunging_attack_end
- 文件黑板: {"atk_scale":0.7,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 120 (4.00s), exclusiveFrame 12 (0.40s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":1.8,"atb":0}; L1 黑板 {"atk_scale":0.8,"atb":0}
```
f0-120 Anim PlungingAttackEnd dur=4
f1-5 FindTargetAction
f1-6 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale(1.8) mask=1152]
PushBackAction
If [?isMainChar Source:tar]
  ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack onlyMain → Source
If [CheckEntityNum]
  (表现类: PlaySoundAction×1)
(表现类: EnemyHurtAnimAction×1)
f1-6 If [?isMainChar Source:tar]
  (表现类: CameraImpulseAction×1)
f0-12 (表现类: SetSuperArmorAction×1)
f1-31 (表现类: EffectAction×1)
f1-71 (表现类: EffectAction×1)
f20-50 (表现类: EffectAction×1)
f20-50 (表现类: EffectAction×1)
f20-50 (表现类: EffectAction×1)
f20-50 (表现类: EffectAction×1)
f20-50 (表现类: EffectAction×1)
f20-50 (表现类: EffectAction×1)
f0-34 (表现类: PlaySoundAction×1)
f0-24 (表现类: CharWeaponVisibleAction×1)
f24-120 (表现类: CharWeaponVisibleAction×1)
f0-24 (表现类: CharWeaponVisibleAction×1)
f24-120 (表现类: CharWeaponVisibleAction×1)
f0-24 (表现类: CharWeaponVisibleAction×1)
f24-120 (表现类: CharWeaponVisibleAction×1)
f0-29 (表现类: CharWeaponVisibleAction×1)
f29-120 (表现类: CharWeaponVisibleAction×1)
f0-29 (表现类: CharWeaponVisibleAction×1)
f29-120 (表现类: CharWeaponVisibleAction×1)
f0-29 (表现类: CharWeaponVisibleAction×1)
f29-120 (表现类: CharWeaponVisibleAction×1)
```

### chr_0032_lizhiyan_plunging_attack_start
- 文件黑板: {"atk_scale":0.25}; cast cost UltimateSp 0; cd 0; durationFrame 1500 (50.00s), exclusiveFrame 1500 (50.00s)
```
f0-32 Anim PlungingAttackStart dur=1.06666672
f32-1513 Anim PlungingAttackLoop dur=49.3666649
f0-1500 (表现类: SetSuperArmorAction×1)
f0-600 (表现类: EffectAction×1)
f0-600 (表现类: EffectAction×1)
f0-600 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f9-62 (表现类: EffectAction×1)
f10-598 (表现类: EffectAction×1)
f10-598 (表现类: EffectAction×1)
f10-598 (表现类: EffectAction×1)
f7-24 (表现类: VoiceTriggerAction×1)
f0-31 (表现类: PlaySoundAction×1)
f0-1500 (表现类: CharWeaponVisibleAction×1)
f0-1500 (表现类: CharWeaponVisibleAction×1)
f0-1500 (表现类: CharWeaponVisibleAction×1)
f0-1500 (表现类: CharWeaponVisibleAction×1)
f0-1500 (表现类: CharWeaponVisibleAction×1)
f0-1500 (表现类: CharWeaponVisibleAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
f0-53 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_power_attack
- 文件黑板: {"atk_scale":"dyn","poise":20,"cnt":"dyn","atb":8,"dmg_up":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 163 (5.43s), exclusiveFrame 51 (1.70s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":9}; L1 黑板 {"atk_scale":4}
```
f0-163 Anim PowerAttack dur=5.4333334
f0-3 (表现类: SelfRotateAction×1)
f0-11 (表现类: MoveToAction×1)
f11-163 (表现类: CustomRootMotionAction×1)
f7-8 Damage target=Target units=[Natural/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f10-11 Damage target=Target units=[Natural/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f13-14 Damage target=Target units=[Natural/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f15-18 MergeTargetAction
f7-8 (表现类: HitStopAction×1)
f10-11 (表现类: HitStopAction×1)
f13-14 (表现类: HitStopAction×1)
f7-8 (表现类: CameraImpulseAction×1)
f10-11 (表现类: CameraImpulseAction×1)
f13-14 (表现类: CameraImpulseAction×1)
f6-29 (表现类: EffectAction×1)
f36-39 Damage target=Target:myTar units=[Natural/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
GainBreakingAttackAtb
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1 HitStopAction×1 DebugPrintAction×1)
f31-39 (表现类: RayCastEffectAction×1)
f31-39 (表现类: RayCastEffectAction×1)
f31-39 (表现类: RayCastEffectAction×1)
f31-37 (表现类: RayCastEffectAction×1)
f32-35 Channeling every 0.033s max/target=2
  Damage target=Target units=[Natural/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
  (表现类: EnemyHurtAnimAction×1)
f7-37 CreateTimedMarker
f32-62 (表现类: EffectAction×1)
f32-62 (表现类: EffectAction×1)
f0-32 (表现类: AddDynamicCcsAction×1)
f32-48 (表现类: AddDynamicCcsAction×1)
f0-48 ?isMainChar Source
CheckEntityNum
If [CheckTwoDirectionAngle]
  LockCameraAimAction
  else
  LockCameraAimAction
(表现类: OverrideCameraFollowAction×1)
f32-48 ?isMainChar Source
CheckEntityNum
If [CheckTwoDirectionAngle]
  LockCameraAimAction
  else
  LockCameraAimAction
(表现类: OverrideCameraFollowAction×1)
f0-51 (表现类: SetSuperArmorAction×1)
f0-51 CreateBuff [buff_common_full_immune_medium] → Owner count=1
f0-37 CreateBuff [buff_common_power_attack_disable_cast_skill] → Owner count=1
f6-103 (表现类: EffectAction×1)
f6-97 (表现类: EffectAction×1)
f2-90 (表现类: EffectAction×1)
f2-84 (表现类: EffectAction×1)
f10-97 (表现类: EffectAction×1)
f10-90 (表现类: EffectAction×1)
f2-14 (表现类: EffectAction×1)
f2-14 (表现类: EffectAction×1)
f12-27 (表现类: EffectAction×1)
f12-22 (表现类: EffectAction×1)
f30-90 (表现类: EffectAction×1)
f30-122 (表现类: EffectAction×1)
f30-125 (表现类: EffectAction×1)
f30-124 (表现类: EffectAction×1)
f28-120 (表现类: EffectAction×1)
f28-120 (表现类: EffectAction×1)
f28-120 (表现类: EffectAction×1)
f0-52 (表现类: CharWeaponVisibleAction×1)
f52-70 (表现类: CharWeaponVisibleAction×1)
f70-158 (表现类: CharWeaponVisibleAction×1)
f0-52 (表现类: CharWeaponVisibleAction×1)
f52-70 (表现类: CharWeaponVisibleAction×1)
f70-158 (表现类: CharWeaponVisibleAction×1)
f0-52 (表现类: CharWeaponVisibleAction×1)
f52-70 (表现类: CharWeaponVisibleAction×1)
f70-158 (表现类: CharWeaponVisibleAction×1)
f0-59 (表现类: CharWeaponVisibleAction×1)
f59-70 (表现类: CharWeaponVisibleAction×1)
f70-158 (表现类: CharWeaponVisibleAction×1)
f0-59 (表现类: CharWeaponVisibleAction×1)
f59-70 (表现类: CharWeaponVisibleAction×1)
f70-158 (表现类: CharWeaponVisibleAction×1)
f0-59 (表现类: CharWeaponVisibleAction×1)
f59-70 (表现类: CharWeaponVisibleAction×1)
f70-158 (表现类: CharWeaponVisibleAction×1)
f0-59 (表现类: CharWeaponAnimationAction×1)
f0-59 (表现类: CharWeaponAnimationAction×1)
f0-59 (表现类: CharWeaponAnimationAction×1)
f0-40 (表现类: EffectAction×1)
f47-59 (表现类: EffectAction×1)
f70-118 (表现类: EffectAction×1)
f0-40 (表现类: EffectAction×1)
f47-59 (表现类: EffectAction×1)
f70-118 (表现类: EffectAction×1)
f0-40 (表现类: EffectAction×1)
f47-59 (表现类: EffectAction×1)
f70-118 (表现类: EffectAction×1)
f6-26 (表现类: EffectAction×1)
f47-59 (表现类: EffectAction×1)
f70-118 (表现类: EffectAction×1)
f2-22 (表现类: EffectAction×1)
f47-59 (表现类: EffectAction×1)
f70-118 (表现类: EffectAction×1)
f15-35 (表现类: EffectAction×1)
f47-59 (表现类: EffectAction×1)
f70-118 (表现类: EffectAction×1)
f30-46 (表现类: EffectAction×1)
f30-46 (表现类: EffectAction×1)
f30-46 (表现类: EffectAction×1)
f0-61 (表现类: PlaySoundAction×1)
f7-23 (表现类: PlaySoundAction×1)
f30-52 (表现类: PlaySoundAction×1)
f63-145 (表现类: PlaySoundAction×1)
f3-18 (表现类: VoiceTriggerAction×1)
f0-51 ComboCache [NormalSkill→chr_0017_yvonne_normal_skill,ComboSkill→chr_0017_yvonne_combo_skill]
f34-51 AllowNext [chr_0032_lizhiyan_normal_skill,chr_0032_lizhiyan_combo_skill]
```

### chr_0032_lizhiyan_talent1
- 文件黑板: {"lv":1,"enhance_rate":0.2,"spell_vul_rate":0.1,"duration":10,"spell_vul_rate_per_will":0.0002,"spell_vul_rate_potential":0}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
```

### chr_0032_lizhiyan_talent2
- 文件黑板: {"lv":1,"duration_add":10,"corrupt_rate":0.2}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
```
```

### chr_0032_lizhiyan_ultimate_skill
- 文件黑板: {"select_radius":10,"radius":30,"atk_scale":8,"duration":20,"poise":10,"duration2":15,"count":1,"atk_scale_laser":0.5,"isWisd":"dyn","atk_scale_laser_will":0.3,"lv":"dyn","spell_vul_rate":"dyn","duration_vul":"dyn","spell_vul_rate_per_will":"dyn","will":"dyn","spell_vul_rate_calc":"dyn","spell_vul_rate_potential":"dyn","duration_aura":60}; cast cost UltimateSp 100; cd 0; durationFrame 308 (10.27s), exclusiveFrame 72 (2.40s)
- 等级表 L12: cost UltSp 100, cd 20, 黑板 {"atk_scale":1.8,"poise":10,"atk_scale_laser":0.45,"laser_count":8,"display_atk_scale_laser":3.6,"atk_scale_laser_will":0.45,"display_atk_scale_laser_will":3.6,"duration2":15,"duration":20}; L1 黑板 {"atk_scale":0.8,"poise":10,"atk_scale_laser":0.2,"laser_count":8,"display_atk_scale_laser":1.6,"atk_scale_laser_will":0.2,"display_atk_scale_laser_will":1.6,"duration2":15,"duration":20}
```
f0-308 Anim UltimateSkill dur=10.2666664
f0-3 TimeDilation Entity dur=1 curve=RESETto1
f0-41 UltimateShowAction
f0-0 If [CheckEntityNum]
  ConvertToTargetContext
  FindTargetAction
  else
  FindTargetAction
  FindTargetAction
  FindTargetAction
f0-10 If [?isMainChar Source]
  CheckEntityNum
  CheckDistanceCondition
  FindTargetAction
  (表现类: TeleportAction×1)
  else
  TeleportPosSelectAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
f0-1 (表现类: SelfRotateAction×1)
f0-44 CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener] → Source count=1
f0-75 If [?isMainChar Owner]
  AnimatedCameraAction
  (表现类: EffectAction×1)
f0-44 If [?isMainChar Owner]
  else
  AnimatedCameraAction
  (表现类: EffectAction×1)
f0-47 HideUIAction
f0-47 UltimateTimeAction
f40-55 IgnoreModelIntervalCheck
f0-3 FinishBuff buff_chr_0032_lizhiyan_ultimate_skill_listener|buff_chr_0032_lizhiyan_ultimate_skill_layer all layers=1 on Source
f41-55 BB isWisd Assign @EntityBB_wisd_greater_will on Owner
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill skill=chr_0032_lizhiyan_ultimate_skill_abilityrange dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=0} dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=1} dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=2} dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=3} dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=4} dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=5} dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=6} dur=@duration_aura(60)
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_place {EntityBB_index=7} dur=@duration_aura(60)
SetIgnoreGlobalTimeScaleAction
f0-3 FinishOwnerAction
f47-50 CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_listener_owner{duration=@duration,isWisd=@EntityBB_wisd_greater_will}] → Source count=1
f0-47 RefrainObtainUsp
f47-47 FindTargetAction
Interrupt → Context:targets
If [?@EntityBB_wisd_greater_will GE 1]
  CreateBuff [buff_common_natural_natural_corrupt_triggered{count=@count,duration=@duration2}] → Context:targets count=1
  else
  ForEachAction
If [?@EntityBB_wisd_greater_will GE 1]
  else
  ?BuffStack buff_chr_0032_lizhiyan_talent1 BuffCount GE 1 on Source
  BB spell_vul_rate ← buff_chr_0032_lizhiyan_talent1.spell_vul_rate of Source
  BB spell_vul_rate_potential ← buff_chr_0032_lizhiyan_talent1.spell_vul_rate_potential of Source
  BB spell_vul_rate_calc = @spell_vul_rate Add @spell_vul_rate_potential
  ?@spell_vul_rate_calc GT 0
  BB duration_vul ← buff_chr_0032_lizhiyan_talent1.duration of Source
  BB spell_vul_rate_per_will ← buff_chr_0032_lizhiyan_talent1.spell_vul_rate_per_will of Source
  StoreAttributeValue
  BB spell_vul_rate_calc = @will Multiply @spell_vul_rate_per_will
  If [?@spell_vul_rate_calc LE @spell_vul_rate]
    BB spell_vul_rate_calc Add @spell_vul_rate_potential on Owner
    CreateBuff [buff_chr_0032_lizhiyan_talent1_vulnerable{rate=@spell_vul_rate_calc,duration=@duration_vul}] → Context:targets count=1
    else
    BB spell_vul_rate Add @spell_vul_rate_potential on Owner
    CreateBuff [buff_chr_0032_lizhiyan_talent1_vulnerable{rate=@spell_vul_rate,duration=@duration_vul}] → Context:targets count=1
Damage target=Context:targets units=[Natural/Hp scale=@atk_scale(1.8) mask=4608 | Natural/Poise scale=0 calc=DefiniteValueCalculation(1) nonSimple mask=0]
(表现类: EnemyHurtAnimAction×1)
f46-49 (表现类: CameraImpulseAction×1)
f46-49 (表现类: CameraImpulseAction×1)
f0-72 CreateBuff [buff_common_damage_immune_ult_skill] → Owner count=1
f0-72 (表现类: SetSuperArmorAction×1)
f48-79 AllowNext [chr_0032_lizhiyan_combo_skill,chr_0032_lizhiyan_normal_skill]
f48-79 MarkCanDash
f0-41 (表现类: ShowHideActorAction×1)
f0-48 ChannelingCastingAction
f0-41 If [?isMainChar Source]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
f46-106 If [?isMainChar Source]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
f40-100 If [?isMainChar Source]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
f3-96 (表现类: VoiceTriggerAction×1)
f0-56 (表现类: PlaySoundAction×1)
f46-130 (表现类: PlaySoundAction×1)
f0-41 (表现类: EffectAction×1)
f0-41 (表现类: EffectAction×1)
f0-41 (表现类: EffectAction×1)
f0-41 (表现类: EffectAction×1)
f0-41 (表现类: EffectAction×1)
f37-44 (表现类: EffectAction×1)
f19-73 (表现类: EffectAction×1)
f41-101 (表现类: EffectAction×1)
f41-101 (表现类: EffectAction×1)
f0-41 (表现类: EffectAction×1)
f32-92 (表现类: EffectAction×1)
f42-102 (表现类: EffectAction×1)
f130-243 (表现类: EffectAction×1)
f240-300 (表现类: EffectAction×1)
f0-308 (表现类: CharWeaponVisibleAction×1)
f0-308 (表现类: CharWeaponVisibleAction×1)
f0-308 (表现类: CharWeaponVisibleAction×1)
f0-308 (表现类: CharWeaponVisibleAction×1)
f0-308 (表现类: CharWeaponVisibleAction×1)
f0-308 (表现类: CharWeaponVisibleAction×1)
f0-41 (表现类: CharWeaponVisibleAction×1)
f41-308 (表现类: CharWeaponVisibleAction×1)
f0-41 (表现类: CharWeaponAnimationAction×1)
f0-41 (表现类: EffectAction×8)
f0-41 (表现类: EffectAction×8)
f0-41 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_ultimate_skill2
- 文件黑板: {"select_radius":13,"radius":5,"atk_scale":8,"poise":0,"lv":"dyn","enhance_rate":"dyn","atk_scale_will":1,"rand_x":"dyn","rand_y":"dyn","rand_z":"dyn","spell_vul_rate":"dyn","duration_vul":"dyn","spell_vul_rate_per_will":"dyn","will":"dyn","spell_vul_rate_calc":"dyn","cd_minus":0,"spell_vul_rate_potential":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 287 (9.57s), exclusiveFrame 75 (2.50s)
- 等级表 L12: cost UltSp 100, cd 10, 黑板 {"atk_scale":14.4,"atk_scale_will":3.6,"poise":10}; L1 黑板 {"atk_scale":6.4,"atk_scale_will":1.6,"poise":10}
```
f0-287 Anim UltimateSkill02 dur=9.566667
f0-50 UltimateShowAction
f0-287 If [?BuffStack buff_chr_0032_lizhiyan_talent1 BuffCount GE 1 on Source]
  BB enhance_rate ← buff_chr_0032_lizhiyan_talent1.enhance_rate of Source
  BB spell_vul_rate ← buff_chr_0032_lizhiyan_talent1.spell_vul_rate of Source
  BB lv ← buff_chr_0032_lizhiyan_talent1.lv of Source
  BB spell_vul_rate_potential ← buff_chr_0032_lizhiyan_talent1.spell_vul_rate_potential of Source
  BB spell_vul_rate_calc = @spell_vul_rate Add @spell_vul_rate_potential
  If [?@EntityBB_wisd_greater_will GE 1]
    ?@enhance_rate GT 0
    CreateBuff [buff_chr_0032_lizhiyan_talent1_enhance{enhance_rate=@enhance_rate}] → Source count=1 child
    else
    ?@spell_vul_rate_calc GT 0
    BB duration_vul ← buff_chr_0032_lizhiyan_talent1.duration of Source
    BB spell_vul_rate_per_will ← buff_chr_0032_lizhiyan_talent1.spell_vul_rate_per_will of Source
    StoreAttributeValue
    BB spell_vul_rate_calc = @will Multiply @spell_vul_rate_per_will
    If [?@spell_vul_rate_calc LE @spell_vul_rate]
      BB spell_vul_rate Assign @spell_vul_rate_calc on Owner
      BB spell_vul_rate Add @spell_vul_rate_potential on Owner
      else
      BB spell_vul_rate Add @spell_vul_rate_potential on Owner
f0-0 If [CheckEntityNum]
  ConvertToTargetContext
  FindTargetAction
  else
  FindTargetAction
  FindTargetAction
  FindTargetAction
f0-10 If [?isMainChar Source]
  If [CheckEntityNum]
    If [CheckDistanceCondition]
      FindTargetAction
      (表现类: TeleportAction×1 SelfRotateAction×1)
      else
      If [CheckDistanceCondition]
        FindTargetAction
        (表现类: TeleportAction×1 SelfRotateAction×1)
    else
    (表现类: SelfRotateAction×1)
  else
  TeleportPosSelectAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
f0-3 TimeDilation Entity dur=1 curve=RESETto1
f0-50 CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener] → Source count=1
f0-50 If [?isMainChar Owner]
  AnimatedCameraAction
  (表现类: EffectAction×1)
  else
  AnimatedCameraAction
  (表现类: EffectAction×1)
f43-76 (表现类: OverrideCameraFollowAction×1)
f43-76 TemporaryUnlockAction
f43-76 AddCameraControlStateAction
f0-3 FinishBuff buff_chr_0032_lizhiyan_ultimate_skill_listener|buff_chr_0032_lizhiyan_ultimate_skill_layer all layers=1 on Source
f57-58 FindTargetAction
FinishOwnerAction
f0-3 ChangeSkillAction
f58-61 FindTargetAction
f58-61 If [CheckEntityNum && ?isMainChar Owner]
  (表现类: EffectAction×1)
f58-58 Interrupt → Context:targets
If [?@EntityBB_wisd_greater_will Equals 0]
  If [?@spell_vul_rate GT 0]
    CreateBuff [buff_chr_0032_lizhiyan_talent1_vulnerable{rate=@spell_vul_rate,duration=@duration_vul}] → Context:targets count=1
  Damage target=Context:targets units=[Natural/Hp scale=@atk_scale_will(3.6) mask=4608 | Natural/Poise scale=0 calc=DefiniteValueCalculation(1) nonSimple mask=0]
  (表现类: EnemyHurtAnimAction×1)
  else
  Damage target=Context:targets units=[Natural/Hp scale=@atk_scale(14.4) mask=4608 | Natural/Poise scale=0 calc=DefiniteValueCalculation(1) nonSimple mask=0]
  (表现类: EnemyHurtAnimAction×1)
f58-59 MergeTargetAction
ForEachAction
f60-63 CheckEntityNum
(表现类: HitStopAction×1)
f57-58 (表现类: CameraImpulseAction×2)
f0-3 If [?@EntityBB_wisd_greater_will Equals 0 && ?@cd_minus(0) GT 0]
  SetSkillCdAtOnce
f0-50 HideUIAction
f0-50 UltimateTimeAction
f0-59 CreateBuff [buff_common_damage_immune_ult_skill] → Owner count=1
f59-75 CreateBuff [buff_common_damage_immune_medium] → Owner count=1
f0-59 (表现类: SetSuperArmorAction×1)
f59-75 (表现类: SetSuperArmorAction×1)
f0-91 ComboCache [NormalSkill→chr_0013_aglina_normal_skill,ComboSkill→chr_0013_aglina_combo_skill]
f60-91 AllowNext [chr_0032_lizhiyan_normal_skill,chr_0032_lizhiyan_combo_skill]
f0-63 ChannelingCastingAction
f0-50 (表现类: EffectAction×1)
f0-40 (表现类: EffectAction×1)
f0-48 (表现类: EffectAction×1)
f0-48 (表现类: EffectAction×1)
f0-40 (表现类: EffectAction×1)
f22-50 (表现类: EffectAction×1)
f25-50 (表现类: EffectAction×1)
f0-50 (表现类: EffectAction×1)
f0-50 (表现类: EffectAction×1)
f53-82 (表现类: EffectAction×1)
f56-85 (表现类: EffectAction×1)
f50-79 (表现类: EffectAction×1)
f50-79 (表现类: EffectAction×1)
f0-79 (表现类: PlaySoundAction×1)
f50-132 (表现类: PlaySoundAction×1)
f78-159 (表现类: PlaySoundAction×1)
f0-15 (表现类: VoiceTriggerAction×1)
f0-83 (表现类: CharWeaponVisibleAction×1)
f83-287 (表现类: CharWeaponVisibleAction×1)
f0-83 (表现类: CharWeaponVisibleAction×1)
f83-287 (表现类: CharWeaponVisibleAction×1)
f0-83 (表现类: CharWeaponVisibleAction×1)
f83-287 (表现类: CharWeaponVisibleAction×1)
f0-86 (表现类: CharWeaponVisibleAction×1)
f86-287 (表现类: CharWeaponVisibleAction×1)
f0-86 (表现类: CharWeaponVisibleAction×1)
f86-287 (表现类: CharWeaponVisibleAction×1)
f0-86 (表现类: CharWeaponVisibleAction×1)
f86-287 (表现类: CharWeaponVisibleAction×1)
f0-287 (表现类: CharWeaponAnimationAction×1)
f0-287 (表现类: CharWeaponAnimationAction×1)
f0-287 (表现类: CharWeaponAnimationAction×1)
f77-125 (表现类: EffectAction×1)
f77-125 (表现类: EffectAction×1)
f77-125 (表现类: EffectAction×1)
f0-95 (表现类: CharWeaponVisibleAction×1)
f95-200 (表现类: CharWeaponVisibleAction×1)
f200-287 (表现类: CharWeaponVisibleAction×1)
f95-287 (表现类: CharWeaponAnimationAction×1)
f95-198 (表现类: EffectAction×1)
f198-277 (表现类: EffectAction×1)
f95-198 (表现类: EffectAction×1)
f95-198 (表现类: EffectAction×1)
f96-198 (表现类: EffectAction×1)
```

### chr_0032_lizhiyan_ultimate_skill_abilityrange
- 文件黑板: {"radius":5,"duration":0,"atk_scale_laser":0.5,"isWisd":0,"atk_scale_laser_will":0.2}; cast cost UltimateSp 0; cd 0; durationFrame 1800 (60.00s), exclusiveFrame 900 (30.00s)
```
f0-1800 CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity] → Owner count=1 child
f0-1800 If [?@isWisd(0) GE 1]
  AuraAction
  else
  AuraAction
f5-1800 (表现类: EffectAction×1)
f11-161 (表现类: EffectAction×8)
f11-906 (表现类: EffectAction×8)
f9-1800 (表现类: EffectAction×1)
f14-1800 (表现类: EffectAction×8)
f25-1800 (表现类: EffectAction×8)
f0-1800 (表现类: PlaySoundAction×1)
```

### chr_0032_lizhiyan_ultimate_skill_laser
- 文件黑板: {"radius":5.67,"duration":0,"atk_scale_laser":1}; cast cost UltimateSp 0; cd 0; durationFrame 90 (3.00s), exclusiveFrame 90 (3.00s)
```
f0-90 (表现类: RayCastEffectAction×1)
f12-28 (表现类: RayCastEffectAction×1)
f12-28 FindTargetAction
If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount Equals 2 on Source]
Interrupt → Context:tar
Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_laser(1) mask=4608]
(表现类: EnemyHurtAnimAction×1 HitStopAction×1)
f12-28 (表现类: CameraImpulseAction×1)
f13-45 If [CheckTimedMarkerCondition]
  CreateTimedMarker
  (表现类: EffectAction×1)
  else
  If [CheckTimedMarkerCondition]
    CreateTimedMarker
    (表现类: EffectAction×1)
    else
    If [CheckTimedMarkerCondition]
      CreateTimedMarker
      (表现类: EffectAction×1)
      else
      CheckTimedMarkerCondition
      (表现类: EffectAction×1)
f10-33 (表现类: PlaySoundAction×1)
```


## 增益（46）

### buff_chr_0032_lizhiyan_attack1_weapon
- life Infinity, dur 1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: CharWeaponVisibleAction×1 CharWeaponAnimationAction×1)
```

### buff_chr_0032_lizhiyan_attack4_effect
- life Limited, dur 0.21, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: CharWeaponVisibleAction×1)
on OnBuffTrigger:
  (表现类: EffectAction×2)
```

### buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect
- life Infinity, dur 2, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×3)
on OnBuffStart:
  (表现类: EffectAction×1)
```

### buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line
- life Infinity, dur 2, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1)
```

### buff_chr_0032_lizhiyan_combo_skill_interruptcheck
- life Limited, dur 0.3333, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnSkillEnd:
  CheckSkillId
  FindTargetAction
  FinishOwnerAction
```

### buff_chr_0032_lizhiyan_combo_skill_precheck
- life Infinity, dur @duration, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnOwnerDead:
  FindTargetAction
  ForEachAction
on ability OnBeforePartDisable:
  CheckTargetsEqual
  FindTargetAction
  ForEachAction
on ability OnSoulDisabled:
  SaveTransferredSource
  CheckTargetsEqual
  FindTargetAction
  ForEachAction
```

### buff_chr_0032_lizhiyan_combo_skill_seal
- life Limited, dur @duration(5), stacking Unlimited max 1; 黑板默认 {"duration":5,"trigger_time":0,"rate_pre":0.1,"isWisd":0,"has_finished":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  If [?@isWisd(0) GE 1]
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre{duration_vul=@duration,rate=@rate_pre}] → InstantSearch count=1 child
    else
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre{duration_vul=@duration,rate=@rate_pre}] → InstantSearch count=1 child
  (表现类: EffectAction×1)
  ForEachAction
  If [?@isWisd(0) GE 1]
    SealAction
    else
    SealAction
on OnBuffTrigger:
  ?@has_finished(0) Equals 0
  FindTargetAction
  ForEachAction
  BB has_finished Assign 1 on Owner
on ability OnOwnerDead:
  ?@has_finished(0) Equals 0
  CheckTimedMarkerCondition
  FindTargetAction
  ForEachAction
  BB has_finished Assign 1 on Owner
on ability OnBeforePartDisable:
  ?@has_finished(0) Equals 0
  CheckTimedMarkerCondition
  CheckTargetsEqual
  FindTargetAction
  ForEachAction
  BB has_finished Assign 1 on Owner
on ability OnSoulDisabled:
  ?@has_finished(0) Equals 0
  SaveTransferredSource
  CheckTargetsEqual
  FindTargetAction
  ForEachAction
  BB has_finished Assign 1 on Owner
```

### buff_chr_0032_lizhiyan_combo_skill_seal2
- life Limited, dur @duration(5), stacking Unlimited max 1; 黑板默认 {"duration":5,"trigger_time":0,"isWisd":1,"rate_pre":0.1,"radius_early_finish":5.67,"atk_scale_early_finish":1,"poise_early_finish":1,"atb_return_wisd":0}; tags [{"tagId":162143970}]
- 属性修正: 无
- 伤害修正: 无
```
on ability OnBeforeTakeDamage:
  ?@isWisd(1) GE 1
  ?decorateMask HasAll 256
  CheckTargetsEqual
  ObtainCost Atb Return value=@atb_return_wisd(0)×1 src=Default → Source
  FindTargetAction
  Interrupt → Context:tar
  Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_early_finish(1) mask=12288 | Natural/Poise scale=0 mask=0]
  CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_atb] → Owner count=1
  FinishBuff buff_chr_0032_lizhiyan_combo_skill_seal|buff_chr_0032_lizhiyan_combo_skill_seal_effect all layers=1 on Owner
  FinishBuff  all layers=1 on Owner
```

### buff_chr_0032_lizhiyan_combo_skill_seal_atb
- life Limited, dur 0.1, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener
- life Infinity, dur 99, stacking Unique max 1; 黑板默认 {"atk_scale_early_finish":1,"poise_early_finish":1,"radius_early_finish":5.67,"atb_return_wisd":10}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnBeforeTakeDamage:
  ?BuffStack buff_chr_0032_lizhiyan_combo_skill_seal2 BuffCount LT 1 on Owner
  ?BuffStack buff_chr_0032_lizhiyan_combo_skill_seal_atb BuffCount LT 1 on Owner
  CheckTargetsEqual
  ?decorateMask HasAll 256
  ObtainCost Atb Return value=@atb_return_wisd(10)×1 src=Default → Source
  FindTargetAction
  Interrupt → Context:tar
  Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_early_finish(1) mask=12288 | Natural/Poise scale=0 mask=0]
  CreateTimedMarker
  FinishBuff  all layers=1 on Owner
```

### buff_chr_0032_lizhiyan_combo_skill_seal_effect
- life Limited, dur @duration(5), stacking Unlimited max 1; 黑板默认 {"duration":5,"isWisd":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  If [?@isWisd(0) GE 1]
    (表现类: EffectAction×1)
    else
    (表现类: EffectAction×1)
  (表现类: EffectAction×2)
```

### buff_chr_0032_lizhiyan_combo_skill_seal_effect_again
- life Limited, dur @duration(6), stacking Unlimited max 1; 黑板默认 {"duration":6,"wisd_greater_will":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  If [?@wisd_greater_will(0) GE 1]
    (表现类: EffectAction×1 PlaySoundAction×1)
    else
    (表现类: EffectAction×2)
on ability OnOwnerDead:
  FinishBuff  all layers=1 on Owner
```

### buff_chr_0032_lizhiyan_combo_skill_seal_finish_count
- life Limited, dur 1, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0032_lizhiyan_combo_skill_seal_finish_self_dead
- life Limited, dur 0.1, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0032_lizhiyan_combo_skill_seal_finisher
- life Limited, dur 5, stacking Unlimited max 1; 黑板默认 {"radius":5,"poise_final":10,"isWisd":0,"cd_reduce":7,"atk_scale_laser2":0}
- 属性修正: 无
- 伤害修正: 无
```
f0-4 FindTargetAction
f0-6 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_laser2(0) mask=12288 | Physical/Poise scale=0 mask=0]
Interrupt → Context:tar
TakeDownAction
CreateTimedMarker
(表现类: EnemyHurtAnimAction×1)
f1-4 FindTargetAction
(表现类: HitStopAction×2)
f0-3 ForEachAction
f0-4 (表现类: CameraImpulseAction×1)
f0-4 (表现类: CameraImpulseAction×1)
f0-30 If [?@isWisd(0) GE 1]
  (表现类: EffectAction×3)
  else
  (表现类: EffectAction×2)
```

### buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd
- life Limited, dur 3, stacking Unlimited max 1; 黑板默认 {"radius":5.67,"atk_scale_laser1":0.5,"atk_scale_laser2":3,"poise_final":10,"isWisd":0,"cd_reduce":7,"atb_return_wisd":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  TriggerCustomAbilityEvent
on OnBuffStart:
  CreateTimedMarker
f0-3 FindTargetAction
Spawn abilityentity_chr_0032_lizhiyan_combo_skill_place dur=2
f0-90 (表现类: RayCastEffectAction×1)
f0-90 (表现类: RayCastEffectAction×1)
f3-90 (表现类: RayCastEffectAction×1)
f6-90 (表现类: RayCastEffectAction×1)
f9-90 (表现类: RayCastEffectAction×1)
f4-90 (表现类: RayCastEffectAction×1)
f4-90 (表现类: RayCastEffectAction×1)
f7-90 (表现类: RayCastEffectAction×1)
f10-90 (表现类: RayCastEffectAction×1)
f13-90 (表现类: RayCastEffectAction×1)
f2-4 FindTargetAction
f5-7 FindTargetAction
f8-10 FindTargetAction
f11-13 FindTargetAction
f2-4 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_laser1(0.5) mask=12288]
Interrupt → Context:tar
(表现类: EnemyHurtAnimAction×1)
f5-7 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_laser1(0.5) mask=12288]
Interrupt → Context:tar
(表现类: EnemyHurtAnimAction×1)
f8-10 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_laser1(0.5) mask=12288]
Interrupt → Context:tar
(表现类: EnemyHurtAnimAction×1)
f11-13 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_laser1(0.5) mask=12288]
Interrupt → Context:tar
(表现类: EnemyHurtAnimAction×1)
f17-21 FindTargetAction
f17-23 Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_laser2(3) mask=12288 | Physical/Poise scale=0 mask=0]
Interrupt → Context:tar
TakeDownAction
CreateTimedMarker
(表现类: EnemyHurtAnimAction×1)
f11-14 FindTargetAction
(表现类: HitStopAction×1)
f18-21 FindTargetAction
(表现类: HitStopAction×2)
f17-20 ForEachAction
f2-4 (表现类: CameraImpulseAction×1)
f5-7 (表现类: CameraImpulseAction×1)
f8-10 (表现类: CameraImpulseAction×1)
f11-13 (表现类: CameraImpulseAction×1)
f17-21 (表现类: CameraImpulseAction×1)
f2-4 (表现类: CameraImpulseAction×1)
f5-7 (表现类: CameraImpulseAction×1)
f8-10 (表现类: CameraImpulseAction×1)
f11-13 (表现类: CameraImpulseAction×1)
f17-21 (表现类: CameraImpulseAction×1)
f17-47 If [?@isWisd(0) GE 1]
  (表现类: EffectAction×3)
  else
  (表现类: EffectAction×2)
f17-34 (表现类: PlaySoundAction×1)
f2-4 (表现类: PlaySoundAction×1)
f5-7 (表现类: PlaySoundAction×1)
f8-10 (表现类: PlaySoundAction×1)
f11-13 (表现类: PlaySoundAction×1)
```

### buff_chr_0032_lizhiyan_combo_skill_seal_listener
- life Limited, dur @duration(5), stacking Unlimited max 1; 黑板默认 {"duration":5,"atk_scale_early_finish":5,"radius_early_finish":5.67,"radius":5.67,"poise_early_finish":5,"duration_extra":0,"atk_scale_wisd_ratio":0,"wisd_greater_will":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnBuffEndsEarly:
  CheckBuffIdInContextAdvanced
  FindTargetAction
  ForEachAction
  FindTargetAction
  Interrupt → Context:tar
  Damage target=Context:tar units=[Natural/Hp scale=@atk_scale_early_finish(5) mask=12288 | Natural/Poise scale=0 mask=0]
  If [?@wisd_greater_will(0) GE 1]
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_effect_again{wisd_greater_will=@wisd_greater_will,duration=2.3}] → Owner count=1
    else
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_effect_again{wisd_greater_will=@wisd_greater_will,duration=12}] → Owner count=1
  FinishBuff  all layers=1 on Owner
  (表现类: EffectAction×1)
```

### buff_chr_0032_lizhiyan_combo_skill_seal_self_dead
- life Limited, dur 0.1, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0032_lizhiyan_combo_skill_seal_total
- life Limited, dur @duration_total(5), stacking Unlimited max 1; 黑板默认 {"duration_total":5,"duration_final":0,"rate_final":0,"trigger_time":0.1,"isWisd":0,"atk_scale_boom":0,"poise_boom":0,"radius":5.67,"duration_seal2":0,"rate_pre":0,"atk_scale_touch":0,"poise_touch":0,"usp":0,"duration_effect":0,"atb_return_wisd":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnSquadRepatriate:
  FinishOwnerAction
f2-21 CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal{duration=@duration_final,rate_pre=@rate_final,trigger_time=@trigger_time,isWisd=@EntityBB_wisd_greater_will}] → Context:trigger count=1
CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_listener{duration=@duration_final,wisd_greater_will=@EntityBB_wisd_greater_will,atk_scale_early_finish=@atk_scale_boom,poise_early_finish=@poise_boom}] → Context:trigger count=1
f0-2 CreateBuff [buff_chr_0032_lizhiyan_combo_skill_precheck] → Context:trigger count=1
f6-9 If [CheckEntityNum]
  FindTargetAction
  If [?@EntityBB_wisd_greater_will LT 1]
    SwitchAction
  Interrupt → Context:tar
  CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal2{duration=@duration_seal2,isWisd=@EntityBB_wisd_greater_will,rate_pre=@rate_pre,atk_scale_early_finish=@atk_scale_boom,poise_early_finish=@poise_boom,atb_return_wisd=@atb_return_wisd}] → Context:trigger count=1
  ForEachAction
  If [CheckEntityNum]
    ObtainCost UltimateSp Gain value=@usp(0)×1 src=Default → Source
  If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener BuffCount GE 1 on Source]
    else
    (表现类: HitStopAction×1)
  (表现类: CameraImpulseAction×1)
  else
  MergeTargetAction
  If [?@EntityBB_wisd_greater_will LT 1]
    SwitchAction
  Interrupt → Context:tar
  CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal2{duration=@duration_seal2,isWisd=@EntityBB_wisd_greater_will,rate_pre=@rate_pre,atk_scale_early_finish=@atk_scale_boom,poise_early_finish=@poise_boom,atb_return_wisd=@atb_return_wisd}] → Context:trigger count=1
  ForEachAction
  If [CheckEntityNum]
    ObtainCost UltimateSp Gain value=@usp(0)×1 src=Default → Source
  If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener BuffCount GE 1 on Source]
    else
    (表现类: HitStopAction×1)
  (表现类: CameraImpulseAction×1)
f2-5 If [CheckEntityNum]
  FindTargetAction
  If [?@EntityBB_wisd_greater_will LT 1]
    ConvertToTargetContext
    PullAction
    (表现类: EnemyHurtAnimAction×1)
    else
    (表现类: EnemyHurtAnimAction×1)
f0-3 BB duration_effect = @duration_final(0) Add -0.2
CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_effect{duration=@duration_effect,isWisd=@EntityBB_wisd_greater_will}] → Context:trigger count=1
```

### buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable
- life Limited, dur @duration_vul(6), stacking Stack max 1; 黑板默认 {"rate":0.2,"duration_vul":6,"atk_scale_calc":0,"poise_final":0,"isWisd":0,"cd_reduce":7,"atk_scale_laser1":0,"atk_scale_laser2":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  Vulnerable Spell rate=@rate(0.2) dur=@duration_vul(6) child=[object Object] → Owner
  Vulnerable Natural rate=@rate(0.2) dur=@duration_vul(6) child=[object Object] → Owner
  Vulnerable Crystal rate=@rate(0.2) dur=@duration_vul(6) child=[object Object] → Owner
on ability OnOwnerHpZero:
  CheckTimedMarkerCondition
  CreateTimedMarker
  Spawn abilityentity_chr_0032_lizhiyan_combo_skill_death
  If [?@isWisd(0) GE 1]
    CheckTimedMarkerCondition
    CreateBuff [buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd{atk_scale_laser1=@atk_scale_laser1,atk_scale_laser2=@atk_scale_laser2,poise_final=@poise_final,isWisd=@isWisd,cd_reduce=@cd_reduce}] → Context:death count=1
```

### buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre
- life Limited, dur @duration_vul(6), stacking Stack max 1; 黑板默认 {"rate":0.2,"duration_vul":6,"isWisd":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  Vulnerable Spell rate=@rate(0.2) dur=@duration_vul(6) child=[object Object] → Owner
  Vulnerable Natural rate=@rate(0.2) dur=@duration_vul(6) child=[object Object] → Owner
  Vulnerable Crystal rate=@rate(0.2) dur=@duration_vul(6) child=[object Object] → Owner
```

### buff_chr_0032_lizhiyan_normal_skill
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SkillAffixAction
on ability OnCharBeforeOutputSpellBurst:
  CheckSkillCastId
  SpellInfliction Natural → Source
  FinishBuff  all layers=1 on Owner
```

### buff_chr_0032_lizhiyan_normal_skill_aura
- life Infinity, dur 2, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnEnemyBeforeTakeSpellInfliction:
  CreateBuff [buff_chr_0032_lizhiyan_normal_skill_listener] → Source count=1
```

### buff_chr_0032_lizhiyan_normal_skill_listener
- life Limited, dur 0.5, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0032_lizhiyan_passive
- life Infinity, dur @duration, stacking Unique max 3; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  If [CompareDeckAttr]
    BB EntityBB_wisd_greater_will Assign 1 on Owner
    else
    BB EntityBB_wisd_greater_will Assign 0 on Owner
on DuringBuffEnable:
  TagQueryListenerAction
```

### buff_chr_0032_lizhiyan_potential_5_effect
- life Infinity, dur 10, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: ShowHideActorAction×1)
  (表现类: EffectAction×1)
```

### buff_chr_0032_lizhiyan_talent1
- life Infinity, dur @duration(10), stacking Unique max 3; 黑板默认 {"lv":2,"enhance_rate":0.1,"spell_vul_rate":0.1,"duration":10,"spell_vul_rate_per_will":0,"spell_vul_rate_potential":0}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0032_lizhiyan_talent1_enhance
- life Infinity, dur 30, stacking Stack max 1; 黑板默认 {"enhance_rate":0.1}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  EnhancedAction
```

### buff_chr_0032_lizhiyan_talent1_vulnerable
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"rate":0,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  Vulnerable Spell rate=@rate(0) dur=@duration(0) child=[object Object] → Owner
  Vulnerable Natural rate=@rate(0) dur=@duration(0) child=[object Object] → Owner
  Vulnerable Crystal rate=@rate(0) dur=@duration(0) child=[object Object] → Owner
```

### buff_chr_0032_lizhiyan_talent2
- life Infinity, dur @duration, stacking Unique max 3; 黑板默认 {"lv":1,"duration_add":5,"corrupt_rate":0.1,"final_corrupt_rate":0,"duration_dynamic":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnCollectOutputBuffBbValue:
  CheckBuffIdInContextAdvanced
  SaveCollectedBuffBbValue
  If [?@duration_dynamic(0) GT 0]
    ModifyCollectedBuffBbValue
    BB final_corrupt_rate = @corrupt_rate(0.1) Add 1
    ModifyCollectedBuffBbValue
    else
    BB final_corrupt_rate = @corrupt_rate(0.1) Add 1
    ModifyCollectedBuffBbValue
```

### buff_chr_0032_lizhiyan_train_combo_normal_end
- life Infinity, dur 100, stacking Unlimited max 4; 黑板默认 {"duration":5,"skillId":0,"succEvent":0,"failEvent":0,"inSkill":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffTrigger:
  ?@inSkill(0) Equals 0
  TrainEvent @failEvent(0)
  FinishBuff  all layers=1 on Owner
on ability OnBeforeCastSkill:
  If [CheckSkillId]
    BB inSkill Assign 1 on Owner
on ability OnCustomAbilityEvent:
  CheckCustomAbilityEvent
  TrainEvent @succEvent(0)
  FinishBuff  all layers=1 on Owner
```

### buff_chr_0032_lizhiyan_train_combo_wisd_check
- life Infinity, dur 0, stacking Unlimited max 1; 黑板默认 {"failEvent":0,"succEvent":0,"times":3}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SkillAffixAction
on OnBuffFinish:
  ?@times(3) GT 0
  TrainEvent @failEvent(0)
  FinishBuff  all layers=1 on Owner
on ability OnOutputDamage:
  ?decorateMask HasAll 8192
  BB times Add -1 on Owner
  ?@times(3) LE 0
  TrainEvent @succEvent(0)
  FinishBuff  all layers=1 on Owner
on ability OnCustomAbilityEvent:
  CheckCustomAbilityEvent
  TrainEvent @succEvent(0)
  FinishBuff  all layers=1 on Owner
```

### buff_chr_0032_lizhiyan_train_combo_wisd_end
- life Infinity, dur 100, stacking Unlimited max 4; 黑板默认 {"duration":5,"skillId":0,"succEvent":0,"failEvent":0,"inSkill":0,"times":6}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffTrigger:
  ?@inSkill(0) Equals 0
  TrainEvent @failEvent(0)
  FinishBuff  all layers=1 on Owner
on ability OnBeforeCastSkill:
  CheckSkillId
  CreateBuff [buff_chr_0032_lizhiyan_train_combo_wisd_check{times=@times,failEvent=@failEvent,succEvent=@succEvent}] → Owner count=1
  FinishBuff  all layers=1 on Owner
```

### buff_chr_0032_lizhiyan_train_showhp
- life Infinity, dur -1, stacking Unique max 1; 黑板默认 {}; tags [{"tagId":351294767},{"tagId":-1394338415}]
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self
- life Limited, dur 1.5, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  FinishOwnerAction
```

### buff_chr_0032_lizhiyan_ultimate_skill_inaura
- life Infinity, dur 30, stacking Unique max 1; 黑板默认 {"is_power_attacked":0,"atk_scale_laser":0.5,"usp_step":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  StoreAttributeValue
  BB usp_step = @usp_step(0) Divide 2
on ability OnBeforeTakeDamage:
  CheckTargetsEqual
  CheckDistanceCondition
  ?decorateMask HasAny 2097152
  Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_death dur=0.2
  CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_target_mark{atk_scale_laser=@atk_scale_laser,usp_step=@usp_step}] → Context:ult_death count=1
  CheckTargetsEqual
  CheckDistanceCondition
  ?decorateMask HasAny 4
  ?@is_power_attacked(0) Equals 0
  CheckTimedMarkerCondition
  CreateTimedMarker
  BB is_power_attacked Assign 1 on Owner
  FindTargetAction
  If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount LE 0 on Source]
    Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target
    CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1{atk_scale_laser=@atk_scale_laser}] → Context:laser_target1 count=1
    ObtainCost UltimateSp Gain value=@usp_step(0)×1 src=Default → Source
    else
    If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount LE 1 on Source]
      Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target
      CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2{atk_scale_laser=@atk_scale_laser}] → Context:laser_target2 count=1
      ObtainCost UltimateSp Gain value=@usp_step(0)×1 src=Default → Source
      else
      If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount LE 2 on Source]
        Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target
        CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser3{atk_scale_laser=@atk_scale_laser}] → Context:laser_target3 count=1
        ObtainCost UltimateSp Gain value=@usp_step(0)×1 src=Default → Source
  CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_layer] → Source count=1
on ability OnPoiseZero:
  BB is_power_attacked Assign 0 on Owner
```

### buff_chr_0032_lizhiyan_ultimate_skill_inaura_attack
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {"atk_scale_laser":3,"poise_laser":5}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  (表现类: EffectAction×2)
on OnBuffTrigger:
  FindTargetAction
  Interrupt → Context:ult_hit
  If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount Equals 2 on Source]
    SpellInfliction Natural → Context:ult_hit
  Damage target=Context:ult_hit units=[Natural/Hp scale=@atk_scale_laser(3) mask=4608 | Natural/Poise scale=0 mask=0]
```

### buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {"trigger_time":0,"atk_scale_laser":10}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  FindTargetAction
f0-3 FindTargetAction
f0-3 MergeTargetAction
MergeTargetAction
MergeTargetAction
MergeTargetAction
MergeTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
f0-3 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f4-7 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f8-11 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f12-15 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
```

### buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {"trigger_time":0,"atk_scale_laser":10}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  FindTargetAction
f0-3 FindTargetAction
f0-3 MergeTargetAction
MergeTargetAction
MergeTargetAction
MergeTargetAction
MergeTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
f0-3 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f4-7 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f8-11 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f12-15 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
```

### buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser3
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {"trigger_time":0,"atk_scale_laser":10}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  FindTargetAction
f0-3 FindTargetAction
f0-3 PickTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
PickTargetAction
f0-3 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f5-8 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
f10-13 Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser skill=chr_0032_lizhiyan_ultimate_skill_laser
```

### buff_chr_0032_lizhiyan_ultimate_skill_layer
- life Infinity, dur @duration, stacking Enhance max 3; 黑板默认 {"count":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffEnhanceChanged:
  SaveBuffStackNumAdvanced
  (表现类: NotifyCharPassiveUIAction×1)
on OnBuffStart:
  (表现类: NotifyCharPassiveUIAction×1)
on OnBuffFinish:
  (表现类: NotifyCharPassiveUIAction×1)
```

### buff_chr_0032_lizhiyan_ultimate_skill_listener
- life Limited, dur @duration(10), stacking Unique max 1; 黑板默认 {"duration":10,"lv":0,"enhance_rate":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  ChangeSkillAction
  RefrainObtainUsp
  (表现类: EffectAction×3)
on OnBuffFinish:
  FinishBuff buff_chr_0032_lizhiyan_ultimate_skill_layer all layers=1 on Owner
  ObtainCost UltimateSp Gain value=-999×1 src=Default → Source
  (表现类: NotifyCharPassiveUIAction×1)
on OnBuffStart:
  FinishBuff buff_chr_0032_lizhiyan_ultimate_skill_listener_owner all layers=1 on Owner
  ObtainCost UltimateSp Gain value=1×1 src=Default pct → Source
  ?@EntityBB_wisd_greater_will GE 1
  ?BuffStack buff_chr_0032_lizhiyan_talent1 BuffCount GE 1 on Source
  BB enhance_rate ← buff_chr_0032_lizhiyan_talent1.enhance_rate of Source
  ?@enhance_rate(0) GT 0
  CreateBuff [buff_chr_0032_lizhiyan_talent1_enhance{enhance_rate=@enhance_rate}] → Source count=1 child
  (表现类: NotifyCharPassiveUIAction×1)
```

### buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity
- life Infinity, dur @duration, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  FinishBuff buff_chr_0032_lizhiyan_ultimate_skill_layer all layers=1 on Source
  FinishOwnerAction
```

### buff_chr_0032_lizhiyan_ultimate_skill_listener_owner
- life Limited, dur @duration(30), stacking Refresh max 1; 黑板默认 {"duration":30,"lv":0,"enhance_rate":0,"isWisd":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  (表现类: NotifyCharPassiveUIAction×1)
  ?@isWisd(0) GE 1
  ?BuffStack buff_chr_0032_lizhiyan_talent1 BuffCount GE 1 on Source
  BB enhance_rate ← buff_chr_0032_lizhiyan_talent1.enhance_rate of Source
  ?@enhance_rate(0) GT 0
  CreateBuff [buff_chr_0032_lizhiyan_talent1_enhance{enhance_rate=@enhance_rate}] → Source count=1 child
on DuringBuffEnable:
  ChangeSkillAction
  RefrainObtainUsp
  AddCameraControlStateAction
  (表现类: AddDynamicCcsAction×2)
  IgnoreModelIntervalCheck
on OnBuffFinish:
  If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount GE 2 on Source]
    else
    ObtainCost UltimateSp Gain value=-999×1 src=Default → Source
    (表现类: NotifyCharPassiveUIAction×1)
  FindTargetAction
  CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self] → Context:ult_aura count=1
on ability OnAddedBuff:
  If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount GE 2 on Owner]
    CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_listener] → Source count=1
    FinishBuff  all layers=1 on Owner
on ability OnOwnerDead:
  FinishOwnerAction
```

### buff_chr_0032_lizhiyan_ultimate_skill_target_mark
- life Limited, dur 0.1, stacking Stack max 1; 黑板默认 {"atk_scale_laser":0,"usp_step":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffTrigger:
  ?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_listener_owner BuffCount GE 1 on Source
  CheckTimedMarkerCondition
  CreateTimedMarker
  FindTargetAction
  If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount LE 0 on Source]
    Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target
    CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1{atk_scale_laser=@atk_scale_laser}] → Context:laser_target1 count=1
    ObtainCost UltimateSp Gain value=@usp_step(0)×1 src=Default → Source
    else
    If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount LE 1 on Source]
      Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target
      CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2{atk_scale_laser=@atk_scale_laser}] → Context:laser_target2 count=1
      ObtainCost UltimateSp Gain value=@usp_step(0)×1 src=Default → Source
      else
      If [?BuffStack buff_chr_0032_lizhiyan_ultimate_skill_layer BuffCount LE 2 on Source]
        Spawn abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target
        CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser3{atk_scale_laser=@atk_scale_laser}] → Context:laser_target3 count=1
        ObtainCost UltimateSp Gain value=@usp_step(0)×1 src=Default → Source
  CreateBuff [buff_chr_0032_lizhiyan_ultimate_skill_layer] → Source count=1
```

### buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener
- life Infinity, dur @duration, stacking Unique max 3; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```
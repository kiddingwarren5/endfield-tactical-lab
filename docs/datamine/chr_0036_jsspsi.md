# 解包清单：chr_0036_jsspsi

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（27）

### chr_0036_jsspsi_attack1
- 文件黑板: {"atk_scale1":0.42,"atk_scale2":0.4,"hitstopcount":"dyn","hitstopcount1":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 170 (5.67s), exclusiveFrame 21 (0.70s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale1":0.23,"atk_scale2":0.23,"display_atk_scale":0.45,"atb":0}; L1 黑板 {"atk_scale1":0.1,"atk_scale2":0.1,"display_atk_scale":0.2,"atb":0}
```
f0-170 Anim Attack01 dur=5.66666651
f0-6 (表现类: SelfRotateAction×1)
f0-44 (表现类: CustomRootMotionAction×1)
f0-21 (表现类: SetSuperArmorAction×1)
f6-9 ContinuousFindTargetAction
f15-18 ContinuousFindTargetAction
f6-9 Channeling every 0.033s max/target=1
  Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale1(0.23) calc=AtkScaleCalculation() mask=128]
  If [?isMainChar Source]
    If [?@hitstopcount GE 1]
      else
      BB hitstopcount Assign 1 on Owner
      (表现类: HitStopAction×1 CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1)
f15-18 Channeling every 0.033s max/target=1
  Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale2(0.23) mask=128]
  If [?isMainChar Source]
    If [?@hitstopcount1 GE 1]
      else
      BB hitstopcount1 Assign 1 on Owner
      (表现类: HitStopAction×1 CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1)
f4-49 (表现类: EffectAction×1)
f10-40 (表现类: EffectAction×1)
f12-57 (表现类: EffectAction×1)
f60-90 (表现类: EffectAction×1)
f2-34 (表现类: EffectAction×1)
f6-36 (表现类: EffectAction×1)
f40-115 (表现类: EffectAction×1)
f0-1 (表现类: CharWeaponVisibleAction×1)
f1-20 (表现类: CharWeaponVisibleAction×1)
f20-130 (表现类: CharWeaponVisibleAction×1)
f0-83 (表现类: CharWeaponVisibleAction×1)
f83-170 (表现类: CharWeaponVisibleAction×1)
f0-25 (表现类: VoiceTriggerAction×1)
f0-44 (表现类: PlaySoundAction×1)
f26-152 (表现类: PlaySoundAction×1)
f0-25 ComboCache [Attack→chr_0036_jsspsi_attack2]
f20-25 AllowNext [chr_0036_jsspsi_attack2]
```

### chr_0036_jsspsi_attack2
- 文件黑板: {"atk_scale":0.5,"poise":0,"atb":0,"hitstopcount":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 205 (6.83s), exclusiveFrame 35 (1.17s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.72,"atb":0}; L1 黑板 {"atk_scale":0.32,"atb":0}
```
f0-205 Anim Attack02 dur=6.83333349
f0-5 (表现类: SelfRotateAction×1)
f0-205 (表现类: CustomRootMotionAction×1)
f5-6 FindTargetAction
f6-7 FindTargetAction
f7-8 FindTargetAction
f8-9 FindTargetAction
f5-9 Channeling every 0.033s max/target=1
  Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(0.72) mask=128]
  If [?isMainChar Source]
    If [?@hitstopcount GE 1]
      else
      BB hitstopcount Assign 1 on Owner
      (表现类: HitStopAction×1 CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1)
f0-35 (表现类: SetSuperArmorAction×1)
f3-48 (表现类: EffectAction×1)
f0-45 (表现类: EffectAction×1)
f24-84 (表现类: EffectAction×1)
f2-32 (表现类: EffectAction×1)
f65-125 (表现类: EffectAction×1)
f65-125 (表现类: EffectAction×1)
f0-2 (表现类: CharWeaponVisibleAction×1)
f2-18 (表现类: CharWeaponVisibleAction×1)
f18-205 (表现类: CharWeaponVisibleAction×1)
f0-104 (表现类: CharWeaponVisibleAction×1)
f104-217 (表现类: CharWeaponVisibleAction×1)
f3-48 (表现类: VoiceTriggerAction×1)
f0-46 (表现类: PlaySoundAction×1)
f22-185 (表现类: PlaySoundAction×1)
f0-28 ComboCache [Attack→chr_0036_jsspsi_attack3]
f13-28 AllowNext [chr_0036_jsspsi_attack3]
```

### chr_0036_jsspsi_attack3
- 文件黑板: {"atk_scale":0.56,"atb":0,"poise":0,"hitstopcount":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 160 (5.33s), exclusiveFrame 22 (0.73s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.66,"atb":0}; L1 黑板 {"atk_scale":0.29,"atb":0}
```
f0-160 Anim Attack03 dur=5.33333349
f0-2 (表现类: SelfRotateAction×1)
f0-161 (表现类: CustomRootMotionAction×1)
f9-10 FindTargetAction
f10-11 FindTargetAction
f11-12 FindTargetAction
f9-12 Channeling every 0.033s max/target=1
  Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(0.66) mask=128]
  If [?isMainChar Source]
    If [?@hitstopcount GE 1]
      else
      BB hitstopcount Assign 1 on Owner
      (表现类: HitStopAction×1 CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1)
f4-34 (表现类: EffectAction×1)
f7-52 (表现类: EffectAction×1)
f7-52 (表现类: EffectAction×1)
f7-12 (表现类: AddDynamicCcsAction×1)
f0-22 (表现类: SetSuperArmorAction×1)
f20-80 (表现类: EffectAction×1)
f72-117 (表现类: EffectAction×1)
f72-117 (表现类: EffectAction×1)
f6-31 (表现类: EffectAction×1)
f85-115 (表现类: EffectAction×1)
f0-1 (表现类: CharWeaponVisibleAction×1)
f1-11 (表现类: CharWeaponVisibleAction×1)
f11-85 (表现类: CharWeaponVisibleAction×1)
f85-160 (表现类: CharWeaponVisibleAction×1)
f0-160 (表现类: CharWeaponVisibleAction×1)
f1-37 (表现类: VoiceTriggerAction×1)
f0-55 (表现类: PlaySoundAction×1)
f22-32 (表现类: PlaySoundAction×1)
f0-33 ComboCache [Attack→chr_0036_jsspsi_attack4]
f12-33 AllowNext [chr_0036_jsspsi_attack4]
```

### chr_0036_jsspsi_attack4
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 552 (18.40s), exclusiveFrame 34 (1.13s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":0.09,"display_atk_scale":0.54,"atb":0}; L1 黑板 {"atk_scale":0.04,"display_atk_scale":0.24,"atb":0}
```
f0-72 Anim Attack04_start dur=2.4
f70-410 Anim Attack04_loop dur=11.333333
f408-552 Anim Attack04 dur=4.8
f0-1 (表现类: SelfRotateAction×1)
f0-236 (表现类: CustomRootMotionAction×1)
f9-30 TogglableAction
f0-34 (表现类: SetSuperArmorAction×1)
f3-6 FindTargetAction
f3-6 If [CheckEntityNum]
  FindTargetAction
  else
  FindTargetAction
f5-40 ContinuousFindTargetAction
f5-40 Channeling every 0.033s max/target=6
  Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(0.09) mask=128]
  If [?isMainChar Target]
    (表现类: CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1 HitStopAction×1)
(表现类: DebugPrintAction×1)
f3-47 (表现类: EffectAction×1)
f7-51 (表现类: EffectAction×1)
f11-55 (表现类: EffectAction×1)
f40-444 (表现类: EffectAction×1)
f0-552 (表现类: CharWeaponVisibleAction×1)
f0-454 (表现类: CharWeaponVisibleAction×1)
f454-672 (表现类: CharWeaponVisibleAction×1)
f0-26 (表现类: VoiceTriggerAction×1)
f0-42 (表现类: PlaySoundAction×1)
f8-81 (表现类: PlaySoundAction×1)
f30-497 (表现类: PlaySoundAction×1)
f0-34 ComboCache [Attack→chr_0036_jsspsi_attack5]
f26-34 AllowNext [chr_0036_jsspsi_attack5]
```

### chr_0036_jsspsi_attack4_abilityrange
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":0}; cast cost UltimateSp 0; cd 0; durationFrame 127 (4.23s), exclusiveFrame 34 (1.13s)
```
f0-3 FindTargetAction
f2-37 ContinuousFindTargetAction
f2-37 Channeling every 0.033s max/target=6
  Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0.32) mask=128]
  If [?isMainChar Target]
    (表现类: CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1 HitStopAction×1)
f0-44 (表现类: EffectAction×1)
f4-48 (表现类: EffectAction×1)
f8-52 (表现类: EffectAction×1)
```

### chr_0036_jsspsi_attack5
- 文件黑板: {"atk_scale":0.7,"poise":17,"atb":17,"isHitbyMain":"dyn","hitstopcount":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 189 (6.30s), exclusiveFrame 31 (1.03s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":1.44,"poise":18,"atb":20}; L1 黑板 {"atk_scale":0.64,"poise":18,"atb":20}
```
f0-190 Anim Attack05 dur=6.33333349
f0-12 (表现类: SelfRotateAction×1)
f0-189 (表现类: CustomRootMotionAction×1)
f0-23 TogglableAction
f25-28 If [CheckEntityNum]
  FindTargetAction
  Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(1.44) mask=2097280 | Cryst/Poise scale=0 mask=0]
  If [?isMainChar Source]
    If [?@hitstopcount GE 1]
      else
      ObtainCost Atb Gain value=@atb(20)×1 src=Default → Source
      BB hitstopcount Assign 1 on Owner
      (表现类: HitStopAction×1 CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1)
  else
  FindTargetAction
  Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(1.44) mask=2097280 | Cryst/Poise scale=0 mask=0]
  If [?isMainChar Source]
    If [?@hitstopcount GE 1]
      else
      ObtainCost Atb Gain value=@atb(20)×1 src=Default → Source
      BB hitstopcount Assign 1 on Owner
      (表现类: HitStopAction×1 CameraImpulseAction×1)
  (表现类: EnemyHurtAnimAction×1)
f0-24 (表现类: AddDynamicCcsAction×1)
f24-28 (表现类: AddDynamicCcsAction×1)
f0-30 (表现类: SetSuperArmorAction×1)
f8-36 (表现类: EffectAction×1)
f20-48 (表现类: EffectAction×1)
f23-112 (表现类: EffectAction×1)
f0-30 (表现类: EffectAction×1)
f76-136 (表现类: EffectAction×1)
f91-151 (表现类: EffectAction×1)
f106-166 (表现类: EffectAction×1)
f129-189 (表现类: EffectAction×1)
f167-197 (表现类: EffectAction×1)
f0-167 (表现类: CharWeaponVisibleAction×1)
f167-189 (表现类: CharWeaponVisibleAction×1)
f0-189 (表现类: CharWeaponVisibleAction×1)
f0-36 (表现类: VoiceTriggerAction×1)
f21-101 (表现类: PlaySoundAction×1)
f0-71 (表现类: PlaySoundAction×1)
f30-201 (表现类: PlaySoundAction×1)
f0-52 ComboCache [Attack→chr_0036_jsspsi_attack1]
f31-52 AllowNext [chr_0036_jsspsi_attack1]
```

### chr_0036_jsspsi_combo_skill
- 文件黑板: {"atk_scale_ink":0,"ink_duration":5,"atk_scale":0.5,"spellstatus":"dyn","abnormal_level":"dyn","skillcount":"dyn","duration_vul":0,"rate":0,"rate_max":0,"qizi_duration":0,"poise":0,"atk_scale_qizi":0,"poise_qizi":0,"usp":0,"qizi_count":"dyn","atk_scale_1":0,"atk_scale_2":0,"atk_scale_3":0,"atk_scale2":0,"atk_scale2_1":0,"atk_scale2_2":0,"atk_scale2_3":0,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","potential5":0,"potential2_base":0,"potential2_enhance":0,"potential2_duration":0}; cast cost Atb 40; cd 30; durationFrame 228 (7.60s), exclusiveFrame 35 (1.17s)
- 等级表 L12: cost Atb 0, cd 15, 黑板 {"atk_scale":0.4,"display_atk_scale":7.5,"poise":10,"usp":10,"atk_scale2":3.5,"atk_scale2_1":1,"potential2_base":0,"potential2_enhance":0,"potential2_display":0,"potential2_duration":0}; L1 黑板 {"atk_scale":0.178,"display_atk_scale":3.33,"poise":10,"usp":10,"atk_scale2":1.556,"atk_scale2_1":0.44,"potential2_base":0,"potential2_enhance":0,"potential2_display":0,"potential2_duration":0}
```
f0-228 Anim ComboSkill dur=7.6
f0-1 If [CheckEntityNum]
  FindTargetAction
  Spawn abilityentity_chr_0036_jsspsi_normal_skill skill=chr_0036_jsspsi_combo_skill_abilityrange {EntityBB_combo_count=@EntityBB_combo_count,EntityBB_atk_scale=@atk_scale,EntityBB_usp=@usp,EntityBB_poise=@poise,EntityBB_atk_scale2=@atk_scale2,EntityBB_atk_scale2_1=@atk_scale2_1,EntityBB_potential5=@potential5,EntityBB_potential2_base=@potential2_base,EntityBB_potential2_enhance=@potential2_enhance,EntityBB_potential2_duration=@potential2_duration}
  FindTargetAction
  Spawn abilityentity_chr_0036_jsspsi_ultimate_skill_inklong01 skill=chr_0036_jsspsi_combo_skill_abilityrange_1
  BB EntityBB_combo_count Assign 0 on Owner
  BB EntityBB_qizi_absorb Assign 0 on Owner
  else
  If [?isMainChar Source]
    FindTargetAction
    FindTargetAction
    Spawn abilityentity_chr_0036_jsspsi_normal_skill skill=chr_0036_jsspsi_combo_skill_abilityrange {EntityBB_combo_count=@EntityBB_combo_count,EntityBB_atk_scale=@atk_scale,EntityBB_usp=@usp,EntityBB_poise=@poise,EntityBB_atk_scale2=@atk_scale2,EntityBB_atk_scale2_1=@atk_scale2_1,EntityBB_potential5=@potential5,EntityBB_potential2_base=@potential2_base,EntityBB_potential2_enhance=@potential2_enhance,EntityBB_potential2_duration=@potential2_duration}
    FindTargetAction
    Spawn abilityentity_chr_0036_jsspsi_ultimate_skill_inklong01 skill=chr_0036_jsspsi_combo_skill_abilityrange_1
    BB EntityBB_combo_count Assign 0 on Owner
    BB EntityBB_qizi_absorb Assign 0 on Owner
    else
    FindTargetAction
    FindTargetAction
    Spawn abilityentity_chr_0036_jsspsi_normal_skill skill=chr_0036_jsspsi_combo_skill_abilityrange {EntityBB_combo_count=@EntityBB_combo_count,EntityBB_atk_scale=@atk_scale,EntityBB_usp=@usp,EntityBB_poise=@poise,EntityBB_atk_scale2=@atk_scale2,EntityBB_atk_scale2_1=@atk_scale2_1,EntityBB_potential5=@potential5,EntityBB_potential2_base=@potential2_base,EntityBB_potential2_enhance=@potential2_enhance,EntityBB_potential2_duration=@potential2_duration}
    FindTargetAction
    Spawn abilityentity_chr_0036_jsspsi_ultimate_skill_inklong01 skill=chr_0036_jsspsi_combo_skill_abilityrange_1
    BB EntityBB_combo_count Assign 0 on Owner
    BB EntityBB_qizi_absorb Assign 0 on Owner
f0-228 (表现类: CustomRootMotionAction×1)
f0-11 If [?isMainChar Source]
f0-11 LockCameraAimAction
FindTargetAction
(表现类: MoveToAction×1)
f0-1 If [?isMainChar Source]
  else
  FindTargetAction
  TeleportPosSelectAction
  (表现类: TeleportAction×1)
f0-1 (表现类: SelfRotateAction×1)
f0-2 (表现类: SelfRotateAction×1)
f0-5 CheckSquadInFight
CreateBuff [buff_common_obtain_ultimate_sp{ratio=1}] → Source count=1
f0-24 (表现类: AddDynamicCcsAction×1)
f0-60 (表现类: AddDynamicCcsAction×1)
f5-29 CameraRotateAction
f0-59 (表现类: EffectAction×1)
f0-134 (表现类: EffectAction×1)
f0-21 TimeDilation Global dur=0.8 curve=ComboSkill
f0-24 If [?isMainChar Owner]
  else
  FindTargetAction
  SaveTargetDistanceAction
  If [CheckComboSkillCameraAlphaSetting]
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
    else
    CurveEvaluateFloat
    (表现类: OverrideCameraFollowAction×1)
f0-24 If [?isMainChar Owner]
  else
  TemporaryUnlockAction
f0-28 (表现类: OverrideCameraFollowAction×1)
f58-63 (表现类: AddDynamicCcsAction×1)
f0-81 (表现类: SetSuperArmorAction×1)
f0-81 ComboCache [NormalSkill→chr_0036_jsspsi_attack4]
f20-81 AllowNext [chr_0036_jsspsi_normal_skill,chr_0036_jsspsi_normal_skill_1]
f0-37 (表现类: PlaySoundAction×1)
f0-15 (表现类: VoiceTriggerAction×1)
f0-228 (表现类: CharWeaponVisibleAction×1)
f0-58 (表现类: CharWeaponVisibleAction×1)
f58-228 (表现类: CharWeaponVisibleAction×1)
f0-228 (表现类: CharWeaponAnimationAction×1)
```

### chr_0036_jsspsi_combo_skill_abilityrange
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":0,"qizi_buff_duration":"dyn","qizi":"dyn","qizi_cal":"dyn","atk_scale_count":"dyn","combolayer_count":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 127 (4.23s), exclusiveFrame 34 (1.13s)
```
f14-58 (表现类: EffectAction×1)
f50-109 (表现类: EffectAction×1)
f14-16 FindTargetAction
f17-19 FindTargetAction
f20-22 FindTargetAction
f23-25 FindTargetAction
f26-28 FindTargetAction
f29-31 FindTargetAction
f32-34 FindTargetAction
f35-37 FindTargetAction
f38-40 FindTargetAction
f41-43 FindTargetAction
f49-51 FindTargetAction
f0-1 If [?@EntityBB_potential2_duration GT 0]
  If [?@EntityBB_potential5 GE 1]
    BB combolayer_count = @EntityBB_combo_count Add 1
    BB combolayer_count = @combolayer_count Multiply @EntityBB_potential2_enhance
    BB combolayer_count = @combolayer_count Add @EntityBB_potential2_base
    CreateBuff [buff_chr_0036_jsspsi_combo_potential2{potential2_duration=@EntityBB_potential2_duration,potential2_base=@EntityBB_potential2_base,potential2_enhance=@EntityBB_potential2_enhance,potential2_count=@combolayer_count}] → Source:tar count=1
    else
    BB combolayer_count = @EntityBB_combo_count Multiply @EntityBB_potential2_enhance
    BB combolayer_count = @combolayer_count Add @EntityBB_potential2_base
    CreateBuff [buff_chr_0036_jsspsi_combo_potential2{potential2_duration=@EntityBB_potential2_duration,potential2_base=@EntityBB_potential2_base,potential2_enhance=@EntityBB_potential2_enhance,potential2_count=@combolayer_count}] → Source:tar count=1
f14-16 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
ObtainCost UltimateSp Gain value=@EntityBB_usp×1 src=Default → Source
(表现类: EnemyHurtAnimAction×1)
f17-19 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f20-22 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f23-25 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f26-28 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f29-31 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f32-34 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f35-37 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f38-40 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f41-43 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=12288]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f49-51 If [?@EntityBB_potential5 GE 1]
  BB EntityBB_combo_count Add 1 on Owner
  BB combolayer_count = @EntityBB_combo_count Add 0
  BB atk_scale_count = @combolayer_count Multiply @EntityBB_atk_scale2_1
  BB atk_scale_count = @atk_scale_count Add @EntityBB_atk_scale2
  Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale_count mask=12288 | Cryst/Poise scale=0 mask=0]
  If [?isMainChar Source]
    (表现类: HitStopAction×1)
  ObtainCost UltimateSp Gain value=@EntityBB_usp×1 src=Default → Source
  (表现类: DebugPrintAction×2 EnemyHurtAnimAction×1 CameraImpulseAction×1)
  else
  BB combolayer_count = @EntityBB_combo_count Add 0
  BB atk_scale_count = @combolayer_count Multiply @EntityBB_atk_scale2_1
  BB atk_scale_count = @atk_scale_count Add @EntityBB_atk_scale2
  Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale_count mask=12288 | Cryst/Poise scale=0 mask=0]
  If [?isMainChar Source]
    (表现类: HitStopAction×1)
  ObtainCost UltimateSp Gain value=@EntityBB_usp×1 src=Default → Source
  (表现类: DebugPrintAction×2 EnemyHurtAnimAction×1 CameraImpulseAction×1)
f14-72 (表现类: PlaySoundAction×1)
f0-55 (表现类: PlaySoundAction×1)
f50-127 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_combo_skill_abilityrange_1
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":0,"qizi_buff_duration":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 127 (4.23s), exclusiveFrame 34 (1.13s)
```
f0-3 SetAnimatorParamAction
f85-88 (表现类: ShowHideActorAction×1)
f0-89 (表现类: EffectAction×1)
f0-89 (表现类: EffectAction×1)
f0-74 (表现类: EffectAction×1)
f0-74 (表现类: EffectAction×1)
f0-89 (表现类: EffectAction×1)
f0-96 (表现类: EffectAction×1)
```

### chr_0036_jsspsi_normal_skill
- 文件黑板: {"atk_scale":2.85,"ink_duration":15,"atk_scale_ink":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise":0,"usp":0,"duration":0,"ink_damage_rate":0,"ink_boom_poise":0,"spellinflicttype":"dyn","soulbufftime":"dyn","static_duration":0,"ink_boom_range":0,"input_angle":"dyn","cam_angle":"dyn","cam_duration":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 168 (5.60s), exclusiveFrame 35 (1.17s)
- 等级表 L12: cost Atb 100, cd 0, 黑板 {"atk_scale":1,"display_atk_scale":1,"poise":5,"duration":20,"ink_damage_rate":0.13,"ink_boom_poise":5,"static_duration":1,"ink_boom_range":0}; L1 黑板 {"atk_scale":0.44,"display_atk_scale":0.44,"poise":5,"duration":20,"ink_damage_rate":0.08,"ink_boom_poise":5,"static_duration":1,"ink_boom_range":0}
```
f0-168 Anim NormalSkill dur=5.6
f0-0 BB EntityBB_ink_damage Assign 0 on Owner
BB EntityBB_ink_boom_poise Assign @ink_boom_poise(5) on Owner
BB EntityBB_havesoul Assign 0 on Owner
BB EntityBB_issoulfinish Assign 0 on Owner
BB EntityBB_ink_boom_range Assign @ink_boom_range(0) on Owner
BB EntityBB_ink_damage_rate Assign @ink_damage_rate(0.13) on Owner
f0-15 (表现类: AddDynamicCcsAction×1)
f0-15 If [CheckEntityNum && NotNextCheckAction && ?isMainChar Owner]
  SaveTwoDirectionAngle
  CurveEvaluateFloat
  CurveEvaluateFloat
  CameraRotateAction
f15-24 (表现类: AddDynamicCcsAction×1)
f0-3 If [?isMainChar Source]
  (表现类: ShowHideActorAction×1 MoveToAction×1 SelfRotateAction×1)
  else
  FindTargetAction
  (表现类: TeleportAction×1)
f0-3 (表现类: SelfRotateAction×1)
f0-168 (表现类: CustomRootMotionAction×1)
f9-10 FindTargetAction
Spawn abilityentity_chr_0036_jsspsi_normal_skill_1 skill=chr_0036_jsspsi_normal_skill_abilityrange_1 {EntityBB_atk_scale=@atk_scale,EntityBB_duration=@duration,EntityBB_static_duration=@static_duration,EntityBB_ink_damage_rate=@ink_damage_rate,EntityBB_poise=@poise}
f0-45 (表现类: SetSuperArmorAction×1)
f0-53 ComboCache [NormalSkill→chr_0004_pelica_normal_skill]
f34-53 AllowNext [chr_0036_jsspsi_normal_skill_1]
f9-69 (表现类: EffectAction×1)
f9-69 (表现类: EffectAction×1)
f27-69 (表现类: EffectAction×1)
f0-65 (表现类: PlaySoundAction×1)
f0-15 (表现类: VoiceTriggerAction×1)
f81-111 (表现类: EffectAction×1)
f0-81 (表现类: CharWeaponVisibleAction×1)
f81-168 (表现类: CharWeaponVisibleAction×1)
f0-168 (表现类: CharWeaponVisibleAction×1)
```

### chr_0036_jsspsi_normal_skill_1
- 文件黑板: {"atk_scale":2.85,"ink_duration":15,"atk_scale_ink":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise":0,"usp":0,"duration":"dyn","soul_distance":"dyn","soul_hpmax":"dyn","soulbufftime":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 178 (5.93s), exclusiveFrame 30 (1.00s)
- 等级表 L12: cost Atb 15, cd 0, 黑板 {}; L1 黑板 {}
```
f0-178 Anim NormalSkill_1 dur=5.9333334
f0-1 FindTargetAction
BB EntityBB_issoulfinish Assign 1 on Owner
BB EntityBB_normal_skill_id Assign 2 on Owner
f1-3 FindTargetAction
If [CheckEntityNum]
  SaveTargetDistanceAction
  FindTargetAction
  else
  ChangeSkillAction
  FinishBuff buff_chr_0036_jsspsi_normal_skill_check all layers=1 on Owner
f0-1 Spawn abilityentity_chr_0036_jsspsi_combo_skill skill=chr_0036_jsspsi_normal_skill_abilityrange {EntityBB_soul_hp=@soul_hpmax,EntityBB_bufftime=@soulbufftime}
BB EntityBB_havesoul Assign 1 on Owner
ChangeSkillAction
CreateBuff [buff_common_obtain_ultimate_sp] → Source count=1
f0-3 (表现类: SelfRotateAction×1)
f0-3 If [?isMainChar Source]
  (表现类: ShowHideActorAction×1 MoveToAction×1 SelfRotateAction×1)
  else
  FindTargetAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
f0-3 (表现类: SelfRotateAction×1)
f0-178 (表现类: CustomRootMotionAction×1)
f0-40 (表现类: EffectAction×1)
f5-45 (表现类: EffectAction×1)
f5-45 (表现类: EffectAction×1)
f0-41 (表现类: AddDynamicCcsAction×1)
f0-31 (表现类: SetSuperArmorAction×1)
f0-41 ComboCache [NormalSkill→chr_0004_pelica_normal_skill]
f22-41 AllowNext [chr_0036_jsspsi_normal_skill_2]
f0-65 (表现类: PlaySoundAction×1)
f3-18 (表现类: VoiceTriggerAction×1)
f63-93 (表现类: EffectAction×1)
f0-63 (表现类: CharWeaponVisibleAction×1)
f63-178 (表现类: CharWeaponVisibleAction×1)
f0-178 (表现类: CharWeaponVisibleAction×1)
```

### chr_0036_jsspsi_normal_skill_2
- 文件黑板: {"atk_scale":2.85,"ink_duration":15,"atk_scale_ink":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise":0,"usp":0,"duration":0}; cast cost UltimateSp 0; cd 0; durationFrame 168 (5.60s), exclusiveFrame 45 (1.50s)
- 等级表 L12: cost Atb 0, cd 0, 黑板 {}; L1 黑板 {}
```
f0-168 Anim NormalSkill_2 dur=5.6
f0-1 FindTargetAction
ChangeSkillAction
CreateBuff [buff_chr_0036_jsspsi_xianjing_inkboom_camera] → Owner count=1
FinishBuff buff_chr_0036_jsspsi_normal_skill_check all layers=1 on Owner
f12-14 CreateBuff [buff_chr_0036_jsspsi_xianjing_inkboom] → Owner count=1
f0-3 (表现类: SelfRotateAction×1)
f0-3 If [?isMainChar Source]
  (表现类: ShowHideActorAction×1 MoveToAction×1 SelfRotateAction×1)
  else
  FindTargetAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
f0-3 (表现类: SelfRotateAction×1)
f0-23 (表现类: CustomRootMotionAction×1)
f0-35 (表现类: SetSuperArmorAction×1)
f0-38 ComboCache [NormalSkill→chr_0004_pelica_normal_skill]
f9-38 AllowNext []
f0-202 (表现类: CharWeaponVisibleAction×1)
f0-202 (表现类: CharWeaponVisibleAction×1)
```

### chr_0036_jsspsi_normal_skill_abilityrange
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":0,"soulbufftime":"dyn","soul_hpmax":"dyn","soul_distance":"dyn","spellinficttype":"dyn","havesoul":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 127 (4.23s), exclusiveFrame 34 (1.13s)
```
f0-25 SetIgnoreGlobalTimeScaleAction
f8-9 MergeTargetAction
MergeTargetAction
BB havesoul ← buff_chr_0036_jsspsi_normal_skill_check.EntityBB_havesoul of Source
?@havesoul Equals 0
FindTargetAction
TargetPostProcessorAction
CheckObjectTypeMatch
If [CheckEntityNum]
  SaveTargetDistanceAction
  FindTargetAction
  SaveBuffLifeTime
  BB soulbufftime = @soulbufftime Multiply 1.2
  StoreAttributeValue
  Spawn abilityentity_chr_0036_jsspsi_combo_skill_inkphantom skill=chr_0036_jsspsi_normal_skill_inkmove_1 {EntityBB_soul_hp=@soul_hpmax,EntityBB_duration=@soulbufftime}
  Spawn abilityentity_chr_0036_jsspsi_combo_skill_inkphantom_2 skill=chr_0036_jsspsi_normal_skill_inkmove_1 {EntityBB_soul_hp=@soul_hpmax,EntityBB_duration=@soulbufftime}
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom{duration=@soulbufftime}] → Context:moying1 count=1
  SaveBuffLifeTime
  BB soulbufftime = @soulbufftime Multiply 0.98
  CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline{duration=@soulbufftime,ink_damage_rate=@EntityBB_ink_damage_rate}] → Context:moying count=1
  (表现类: ShowHideActorAction×2)
f20-23 CheckEntityNum
CheckEntityNum
CastSkill
CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom_canbehit] → Source count=1
(表现类: ShowHideActorAction×1)
f20-23 CheckEntityNum
CheckEntityNum
CheckEntityNum
SaveBuffLifeTime
BB soulbufftime = @soulbufftime Multiply 0.98
CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline{duration=@soulbufftime,ink_damage_rate=@EntityBB_ink_damage_rate}] → Context:moying count=1
CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline_1{duration=@soulbufftime}] → Context:moying count=1
f0-10 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_normal_skill_abilityrange_1
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":0,"soulbufftime":"dyn","soul_hpmax":"dyn","soul_distance":"dyn","spellinficttype":"dyn","havesoul":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 30 (1.00s), exclusiveFrame 30 (1.00s)
```
f0-25 SetIgnoreGlobalTimeScaleAction
f6-7 FindTargetAction
CreateBuff [buff_common_obtain_ultimate_sp] → Owner count=1
TargetPostProcessorAction
CheckEntityNum
CheckObjectTypeMatch
BB soulbufftime = @EntityBB_duration Add 0
CreateBuff [buff_chr_0036_jsspsi_xianjing_inkhurteffect{duration=@soulbufftime,ink_damage_rate=@EntityBB_ink_damage_rate}] → Context:soul_target count=1
CreateBuff [buff_chr_0036_jsspsi_normal_skill_soul_timedisplay{duration=@soulbufftime}] → Context:soul_target count=1
CreateBuff [buff_chr_0036_jsspsi_normal_skill_modifysoucebb] → Source count=1
CreateBuff [buff_chr_0036_jsspsi_normal_skill_check] → Source count=1
(表现类: EnemyHurtAnimAction×1)
f6-7 SaveCharTypeIdToIntBySquadSlot
FindTargetAction
If [?@spellinficttype Equals 0]
  SpellInfliction Fire → Target
  CheckEntityNum
  ForceTargetInFightAction
  Damage target=Target:smart_target units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4352 | Cryst/Poise scale=0 mask=0]
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_hitstop{duration=@EntityBB_static_duration}] → Target count=1
  CreateBuff [buff_common_obtain_ultimate_sp] → Source count=1
  (表现类: CameraImpulseAction×1 HitStopAction×1)
  else
  SpellInfliction Cryst → Target
  CheckEntityNum
  ForceTargetInFightAction
  Damage target=Target:smart_target units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4352 | Cryst/Poise scale=0 mask=0]
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_hitstop{duration=@EntityBB_static_duration}] → Target count=1
  CreateBuff [buff_common_obtain_ultimate_sp] → Source count=1
  (表现类: CameraImpulseAction×1 HitStopAction×1)
f2-61 (表现类: EffectAction×1)
```

### chr_0036_jsspsi_normal_skill_born
- 文件黑板: {"atk_scale":2.85,"ink_duration":15,"atk_scale_ink":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise":0,"usp":0,"duration":0}; cast cost UltimateSp 0; cd 0; durationFrame 9 (0.30s), exclusiveFrame 9 (0.30s)
```
f0-0 SetAnimatorParamAction
CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom_canbehit] → Source count=1
```

### chr_0036_jsspsi_normal_skill_inboom_projhit
- 文件黑板: {}; cast cost UltimateSp 0; cd 0; durationFrame 122 (4.07s), exclusiveFrame 0 (0.00s)
```
f1-2 FindTargetAction
f0-1 (表现类: ShowHideActorAction×1)
f1-2 If [?@EntityBB_ink_damage Equals 0]
  BB EntityBB_ink_damage Assign 1 on Owner
  If [?@EntityBB_ink_boom_range LE 0]
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 CameraImpulseAction×1 EnemyHurtAnimAction×1)
    else
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 CameraImpulseAction×1 EnemyHurtAnimAction×1)
  else
  If [?@EntityBB_ink_boom_range LE 0]
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 CameraImpulseAction×1 EnemyHurtAnimAction×1)
    else
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 CameraImpulseAction×1 EnemyHurtAnimAction×1)
f0-1 If [?@EntityBB_ink_boom_range LE 0]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
f0-11 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_normal_skill_inkhurt_front
- 文件黑板: {"atk_scale":2.85,"ink_duration":15,"atk_scale_ink":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise":0,"usp":0,"duration":0}; cast cost UltimateSp 0; cd 0; durationFrame 24 (0.80s), exclusiveFrame 45 (1.50s)
```
f0-24 AnimatorAimOffsetAction
f0-0 SetAnimatorParamAction
```

### chr_0036_jsspsi_normal_skill_inkmark_projhit
- 文件黑板: {}; cast cost UltimateSp 0; cd 0; durationFrame 32 (1.07s), exclusiveFrame 0 (0.00s)
```
f0-1 (表现类: ShowHideActorAction×1)
f14-15 If [?@EntityBB_ink_damage Equals 0]
  BB EntityBB_ink_damage Assign 1 on Owner
  If [?@EntityBB_ink_boom_range LE 0]
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 EnemyHurtAnimAction×1 CameraImpulseAction×1)
    else
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 EnemyHurtAnimAction×1 CameraImpulseAction×1)
  else
  If [?@EntityBB_ink_boom_range LE 0]
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 EnemyHurtAnimAction×1 CameraImpulseAction×1)
    else
    FindTargetAction
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    BB EntityBB_ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: NotifyCharPassiveUIAction×1 EnemyHurtAnimAction×1 CameraImpulseAction×1)
f0-1 If [?@EntityBB_ink_boom_range LE 0]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
f0-32 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_normal_skill_inkmove_1
- 文件黑板: {"atk_scale":2.85,"ink_duration":15,"atk_scale_ink":5,"owner_mainchar_distance":"dyn","owner_mainchar_alpha":"dyn","poise":0,"usp":0,"duration":0}; cast cost UltimateSp 0; cd 0; durationFrame 9 (0.30s), exclusiveFrame 9 (0.30s)
```
f0-9 SetIgnoreGlobalTimeScaleAction
f0-9 FindTargetAction
FindTargetAction
DisableMoveColliderAction
(表现类: MoveToAction×1)
f0-9 (表现类: SetSuperArmorAction×1)
f0-9 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_normal_skill_inkmove_2
- 文件黑板: {"ink_damage":"dyn","ink_poise":"dyn","ink_boom_range":"dyn","distancecount":"dyn","cam_angle":"dyn","backdistance":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 30 (1.00s), exclusiveFrame 30 (1.00s)
```
f0-1 SaveTargetDistanceAction
BB backdistance = @backdistance Add 1.2
f0-20 (表现类: SelfRotateAction×1)
f0-1 BB EntityBB_soulback Assign 1 on Owner
If [CheckDistanceCondition]
  BB distancecount Assign 1 on Owner
  else
  BB distancecount Assign 2 on Owner
f0-20 If [CheckSkillType]
  else
  If [CheckTargetInScreen]
    SaveTwoDirectionAngle
    CameraRotateAction
    else
    SaveTwoDirectionAngle
    CameraRotateAction
f0-6 CreateBuff [buff_chr_0036_jsspsi_normal_skill_finish_immune{duration=0.2}] → Owner count=1
f0-21 SetIgnoreGlobalTimeScaleAction
f0-6 FindTargetAction
DisableMoveColliderAction
(表现类: MoveToAction×1)
f6-20 SwitchAction
f0-1 ForceHideHeadBarAction
SetAnimatorParamAction
f19-20 ?@distancecount Equals 2
BB ink_boom_range ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.EntityBB_ink_boom_range of Source
If [?@ink_boom_range LE 0]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
(表现类: ShowHideActorAction×1)
f0-1 FinishBuff buff_chr_0036_jsspsi_normal_skill_inkphantom all layers=1 on Owner
(表现类: ShowHideActorAction×1)
f20-21 CreateBuff [buff_chr_0036_jsspsi_normal_skill_boomrevert] → Source count=1
?@distancecount Equals 2
BB ink_boom_range ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.EntityBB_ink_boom_range of Source
If [?@ink_boom_range LE 0]
  FindTargetAction
  BB ink_damage ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_damage of Source
  If [?@ink_damage Equals 0]
    BB ink_damage Assign 1 on Owner
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
    else
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
  (表现类: NotifyCharPassiveUIAction×1)
  else
  FindTargetAction
  BB ink_damage ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_damage of Source
  If [?@ink_damage Equals 0]
    BB ink_damage Assign 1 on Owner
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
    else
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
  (表现类: NotifyCharPassiveUIAction×1)
f20-21 ?@distancecount Equals 2
FinishOwnerAction
f12-13 ?@distancecount Equals 1
BB ink_boom_range ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.EntityBB_ink_boom_range of Source
If [?@ink_boom_range LE 0]
  (表现类: EffectAction×1)
  else
  (表现类: EffectAction×1)
(表现类: ShowHideActorAction×1)
f13-14 ?@distancecount Equals 1
CreateBuff [buff_chr_0036_jsspsi_normal_skill_boomrevert] → Source count=1
BB ink_boom_range ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.EntityBB_ink_boom_range of Source
If [?@ink_boom_range LE 0]
  FindTargetAction
  BB ink_damage ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_damage of Source
  If [?@ink_damage Equals 0]
    BB ink_damage Assign 1 on Owner
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    FinishOwnerAction
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
    else
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    FinishOwnerAction
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
  (表现类: NotifyCharPassiveUIAction×1)
  else
  FindTargetAction
  BB ink_damage ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_damage of Source
  If [?@ink_damage Equals 0]
    BB ink_damage Assign 1 on Owner
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    FinishOwnerAction
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
    else
    BB ink_poise ← buff_chr_0036_jsspsi_normal_skill_inkphantom_damage.ink_poise of Source
    Damage target=Context:tar units=[Fixed/Hp scale=0 calc=DefiniteValueCalculation(@ink_damage) nonSimple mask=4352 | Cryst/Poise scale=0 mask=0]
    FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1 all layers=1 on Context:tar
    BB ink_damage Assign 0 on Owner
    If [?isMainChar Source]
      (表现类: HitStopAction×1)
      else
      (表现类: HitStopAction×1)
    FinishOwnerAction
    (表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 DebugPrintAction×1)
  (表现类: NotifyCharPassiveUIAction×1)
f12-23 (表现类: PlaySoundAction×1)
f0-10 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_perfect_dodge
- 文件黑板: {}; cast cost UltimateSp 0; cd 0; durationFrame 15 (0.50s), exclusiveFrame 15 (0.50s)
```
f0-3 PlayPerfectDodgeAnim
f0-15 (表现类: CharWeaponVisibleAction×1)
f0-12 (表现类: VoiceTriggerAction×1)
```

### chr_0036_jsspsi_plunging_attack_end
- 文件黑板: {"atk_scale":0.7,"atb":0,"ayao_pos1":"dyn","ayao_pos2":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 175 (5.83s), exclusiveFrame 20 (0.67s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":1.8,"display_atk_scale":1.8,"atb":0}; L1 黑板 {"atk_scale":0.8,"display_atk_scale":0.8,"atb":0}
```
f0-175 Anim PlungingAttackEnd dur=5.83333349
f0-122 (表现类: CustomRootMotionAction×1)
f0-34 (表现类: EffectAction×1)
f1-5 FindTargetAction
f1-6 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(1.8) mask=1152]
ObtainCost Atb Gain value=@atb(0)×1 src=NormalAttack onlyMain → Source
(表现类: EnemyHurtAnimAction×1)
f0-5 If [?isMainChar Source:tar]
  (表现类: CameraImpulseAction×1)
f0-20 (表现类: SetSuperArmorAction×1)
f1-4 FindTargetAction
FindTargetAction
FindTargetAction
FindTargetAction
Spawn abilityentity_chr_0036_jsspsi_plunging_attack_ayao
Spawn abilityentity_chr_0036_jsspsi_plunging_attack_ayao
Spawn abilityentity_chr_0036_jsspsi_plunging_attack_ayao
RandomAction
RandomAction
SwitchAction
f9-20 AllowNext [chr_0036_jsspsi_attack1]
f0-9 (表现类: CharWeaponVisibleAction×1)
f9-69 (表现类: CharWeaponVisibleAction×1)
f69-174 (表现类: CharWeaponVisibleAction×1)
f0-30 (表现类: EffectAction×1)
f69-99 (表现类: EffectAction×1)
f0-34 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_plunging_attack_start
- 文件黑板: {"atk_scale":0.25}; cast cost UltimateSp 0; cd 0; durationFrame 1500 (50.00s), exclusiveFrame 1500 (50.00s)
```
f0-19 Anim PlungingAttackStart dur=0.6333333
f19-1500 Anim PlungingAttackLoop dur=49.3666649
f17-1500 (表现类: EffectAction×1)
f0-1500 (表现类: SetSuperArmorAction×1)
f13-43 (表现类: EffectAction×1)
f0-13 (表现类: CharWeaponVisibleAction×1)
f13-1497 (表现类: CharWeaponVisibleAction×1)
f0-2984 (表现类: CharWeaponVisibleAction×1)
f0-13 (表现类: VoiceTriggerAction×1)
f0-99 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_power_attack
- 文件黑板: {"atk_scale":0.35}; cast cost UltimateSp 0; cd 0; durationFrame 207 (6.90s), exclusiveFrame 50 (1.67s)
- 等级表 L12: cost UltSp 0, cd 0, 黑板 {"atk_scale":9}; L1 黑板 {"atk_scale":4}
```
f0-207 Anim PowerAttack dur=6.9
f0-5 (表现类: SelfRotateAction×1)
f0-29 (表现类: CustomRootMotionAction×1)
f0-2 FindTargetAction
f3-5 Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
If [?isMainChar Owner]
  (表现类: EnemyHurtAnimAction×1 HitStopAction×1 CameraImpulseAction×1)
f12-14 Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
If [?isMainChar Owner]
  (表现类: EnemyHurtAnimAction×1 HitStopAction×1 CameraImpulseAction×1)
f21-23 Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
If [?isMainChar Owner]
  (表现类: EnemyHurtAnimAction×1 HitStopAction×1 CameraImpulseAction×1)
f37-39 Damage target=Target:tar units=[Cryst/Hp scale=@atk_scale(9) calc=BreakingAttackCalculation(@atk_scale(9)) nonSimple mask=132]
If [?isMainChar Owner]
  GainBreakingAttackAtb
  (表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1 HitStopAction×1)
f2-94 (表现类: EffectAction×1)
f2-34 (表现类: EffectAction×1)
f10-40 (表现类: EffectAction×1)
f18-56 (表现类: EffectAction×1)
f34-78 (表现类: EffectAction×1)
f34-78 (表现类: EffectAction×1)
f0-50 (表现类: SetSuperArmorAction×1)
f0-50 CreateBuff [buff_common_full_immune_medium] → Owner count=1
f0-50 CreateBuff [buff_common_power_attack_disable_cast_skill] → Owner count=1
f0-50 ComboCache [NormalSkill→chr_0005_chen_normal_skill,ComboSkill→chr_0005_chen_combo_skill]
f39-50 AllowNext [chr_0036_jsspsi_normal_skill,chr_0036_jsspsi_combo_skill]
f0-34 CheckEntityNum
If [CheckTwoDirectionAngle]
  LockCameraAimAction
  else
  LockCameraAimAction
(表现类: OverrideCameraFollowAction×1 AddDynamicCcsAction×1)
f34-70 If [CheckTwoDirectionAngle]
f34-70 (表现类: OverrideCameraFollowAction×1 AddDynamicCcsAction×1)
f170-200 (表现类: EffectAction×1)
f0-170 (表现类: CharWeaponVisibleAction×1)
f170-207 (表现类: CharWeaponVisibleAction×1)
f0-207 (表现类: CharWeaponVisibleAction×1)
f0-52 (表现类: VoiceTriggerAction×1)
f0-167 (表现类: PlaySoundAction×1)
f34-130 (表现类: PlaySoundAction×1)
f63-160 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_ultimate_skill
- 文件黑板: {"atk_scale":8,"select_radius":10,"radius":4,"atk_scale_2":0,"poise":0,"crit":0,"atk_up":0.3,"duration":15,"enhance_final":0,"enhance_duration":0,"poise_2":0}; cast cost UltimateSp 100; cd 30; durationFrame 214 (7.13s), exclusiveFrame 85 (2.83s)
- 等级表 L12: cost UltSp 80, cd 30, 黑板 {"atk_scale":0.4,"poise":0,"atk_scale_2":1.8,"poise_2":20,"display_atk_scale":5,"display_poise":0,"enhance_final":0.36,"enhance_duration":12}; L1 黑板 {"atk_scale":0.18,"poise":0,"atk_scale_2":0.8,"poise_2":20,"display_atk_scale":2.22,"display_poise":0,"enhance_final":0.2,"enhance_duration":12}
```
f0-214 Anim UltimateSkill dur=7.133333
f0-1 FindTargetAction
FindTargetAction
If [?isMainChar Source]
  else
  TeleportPosSelectAction
  (表现类: TeleportAction×1 SelfRotateAction×1)
f0-214 (表现类: MoveToAction×1)
f0-0 If [?isMainChar Source]
  Spawn abilityentity_chr_0036_jsspsi_ultimate_skill skill=chr_0036_jsspsi_ultimate_skill_abilityrange {EntityBB_enhance_final=@enhance_final,EntityBB_enhance_duration=@enhance_duration,EntityBB_atk_scale=@atk_scale,EntityBB_poise=@poise,EntityBB_atk_scale_2=@atk_scale_2,EntityBB_poise_2=@poise_2}
  else
  Spawn abilityentity_chr_0036_jsspsi_ultimate_skill skill=chr_0036_jsspsi_ultimate_skill_abilityrange_1 {EntityBB_enhance_final=@enhance_final,EntityBB_enhance_duration=@enhance_duration,EntityBB_atk_scale=@atk_scale,EntityBB_poise=@poise,EntityBB_atk_scale_2=@atk_scale_2,EntityBB_poise_2=@poise_2}
f0-58 UltimateTimeAction
f0-59 HideUIAction
f0-57 HideUIAction
f0-180 If [?isMainChar Source]
  AnimatedCameraAction
  else
  AnimatedCameraAction
f0-214 (表现类: CharWeaponAnimationAction×1)
f0-85 CreateBuff [buff_common_damage_immune_ult_skill] → Owner count=1
f0-85 ComboCache [NormalSkill→chr_0004_pelica_normal_skill,ComboSkill→chr_0004_pelica_combo_skill]
f64-85 AllowNext [chr_0036_jsspsi_normal_skill,chr_0036_jsspsi_combo_skill,chr_0036_jsspsi_normal_skill_1]
f0-60 If [?isMainChar Source]
  UltimateShowAction
f0-57 If [?isMainChar Source]
  else
  UltimateShowAction
f0-60 (表现类: EffectAction×1)
f0-60 (表现类: EffectAction×1)
f8-52 (表现类: EffectAction×1)
f23-56 (表现类: EffectAction×1)
f28-56 (表现类: EffectAction×1)
f0-60 (表现类: EffectAction×1)
f0-56 (表现类: EffectAction×1)
f0-57 (表现类: EffectAction×1)
f0-57 (表现类: EffectAction×1)
f0-59 (表现类: EffectAction×1)
f0-278 (表现类: CharWeaponVisibleAction×1)
f0-278 (表现类: CharWeaponVisibleAction×1)
f0-278 (表现类: CharWeaponVisibleAction×1)
f0-278 (表现类: CharWeaponVisibleAction×1)
f213-243 (表现类: EffectAction×1)
f0-198 (表现类: CharWeaponVisibleAction×1)
f198-257 (表现类: CharWeaponVisibleAction×1)
f0-145 (表现类: PlaySoundAction×1)
f0-15 (表现类: VoiceTriggerAction×1)
```

### chr_0036_jsspsi_ultimate_skill_abilityrange
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":0,"bufftime1":"dyn","bufftime2":"dyn","bufftime3":"dyn","talent_combo_reduce":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 306 (10.20s), exclusiveFrame 85 (2.83s)
```
f0-18 (表现类: SelfRotateAction×1)
f38-41 FindTargetAction
Spawn abilityentity_chr_0036_jsspsi_ultimate_skill_inklong02
f58-61 FindTargetAction
Spawn abilityentity_chr_0036_jsspsi_ultimate_skill_inklong01
f81-82 FinishOwnerAction
(表现类: ShowHideActorAction×1)
f59-60 FinishOwnerAction
(表现类: ShowHideActorAction×1)
f63-64 FindTargetAction
f66-67 FindTargetAction
f70-71 FindTargetAction
f73-74 FindTargetAction
f77-78 FindTargetAction
f80-81 FindTargetAction
f84-85 FindTargetAction
f88-89 FindTargetAction
f100-101 FindTargetAction
f63-64 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f66-67 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f70-71 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f73-74 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f77-78 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f80-81 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f84-85 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f88-89 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f100-101 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale_2 mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1 CameraImpulseAction×1)
(表现类: EnemyHurtAnimAction×1)
f62-63 GetCharBySquadSlot
If [?BuffStack buff_chr_0036_jsspsi_talent2_1 BuffCount GE 1 on Source]
  BB talent_combo_reduce ← buff_chr_0036_jsspsi_talent2_1.coolDown of Source
  BB talent_combo_reduce = @talent_combo_reduce Multiply -1
  SetSkillCdAtOnce
  FindTargetAction
  CreateBuff [buff_chr_0036_jsspsi_atk_buff_2{enhance_final=@EntityBB_enhance_final,duration=@EntityBB_enhance_duration}] → Context:tar1 count=1
  else
  If [?BuffStack buff_chr_0036_jsspsi_talent2_2 BuffCount GE 1 on Source]
    BB talent_combo_reduce ← buff_chr_0036_jsspsi_talent2_2.coolDown of Source
    BB talent_combo_reduce = @talent_combo_reduce Multiply -1
    SetSkillCdAtOnce
    FindTargetAction
    CreateBuff [buff_chr_0036_jsspsi_atk_buff_2{enhance_final=@EntityBB_enhance_final,duration=@EntityBB_enhance_duration}] → Context:tar1 count=1
    else
    FindTargetAction
    CreateBuff [buff_chr_0036_jsspsi_atk_buff_2{enhance_final=@EntityBB_enhance_final,duration=@EntityBB_enhance_duration}] → Context:tar1 count=1
f100-103 FindTargetAction
CreateBuff [buff_chr_0036_jsspsi_ultimate_skill_heal] → Context:tar1 count=1
f18-19 FindTargetAction
f97-165 (表现类: EffectAction×1)
f97-195 (表现类: EffectAction×1)
f97-195 (表现类: EffectAction×1)
f97-100 BB bufftime1 = 0 Add @EntityBB_enhance_duration
CreateBuff [buff_chr_0036_jsspsi_ult_effect_1{duration=@bufftime1}] → Source count=1
BB bufftime2 = 0.5 Add @EntityBB_enhance_duration
CreateBuff [buff_chr_0036_jsspsi_ult_effect_2{duration=@bufftime2}] → Source count=1
BB bufftime3 = 1 Add @EntityBB_enhance_duration
CreateBuff [buff_chr_0036_jsspsi_ult_effect_3{duration=@bufftime3}] → Source count=1
f57-143 (表现类: EffectAction×1)
f57-143 (表现类: EffectAction×1)
f60-179 (表现类: EffectAction×1)
f60-186 (表现类: PlaySoundAction×1)
```

### chr_0036_jsspsi_ultimate_skill_abilityrange_1
- 文件黑板: {"atk_scale":0.32,"poise":0,"atb":0,"bufftime1":"dyn","bufftime2":"dyn","bufftime3":"dyn","talent_combo_reduce":"dyn"}; cast cost UltimateSp 0; cd 0; durationFrame 228 (7.60s), exclusiveFrame 85 (2.83s)
```
f0-18 (表现类: SelfRotateAction×1)
f38-41 FindTargetAction
Spawn abilityentity_chr_0036_jsspsi_ultimate_skill_inklong02
f55-58 FindTargetAction
Spawn abilityentity_chr_0036_jsspsi_ultimate_skill_inklong01
f81-82 FinishOwnerAction
(表现类: ShowHideActorAction×1)
f57-58 FinishOwnerAction
(表现类: ShowHideActorAction×1)
f63-64 FindTargetAction
f66-67 FindTargetAction
f70-71 FindTargetAction
f73-74 FindTargetAction
f77-78 FindTargetAction
f80-81 FindTargetAction
f84-85 FindTargetAction
f88-89 FindTargetAction
f100-101 FindTargetAction
f63-64 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f66-67 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f70-71 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f73-74 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f77-78 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f80-81 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f84-85 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f88-89 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f100-101 Damage target=Context:tar units=[Cryst/Hp scale=@EntityBB_atk_scale_2 mask=4608 | Cryst/Poise scale=0 mask=0]
If [?isMainChar Source]
  (表现类: HitStopAction×1)
(表现类: EnemyHurtAnimAction×1 CameraImpulseAction×1)
f62-63 GetCharBySquadSlot
If [?BuffStack buff_chr_0036_jsspsi_talent2_1 BuffCount GE 1 on Source]
  BB talent_combo_reduce ← buff_chr_0036_jsspsi_talent2_1.coolDown of Source
  BB talent_combo_reduce = @talent_combo_reduce Multiply -1
  SetSkillCdAtOnce
  FindTargetAction
  CreateBuff [buff_chr_0036_jsspsi_atk_buff_2{enhance_final=@EntityBB_enhance_final,duration=@EntityBB_enhance_duration}] → Context:tar1 count=1
  else
  If [?BuffStack buff_chr_0036_jsspsi_talent2_2 BuffCount GE 1 on Source]
    BB talent_combo_reduce ← buff_chr_0036_jsspsi_talent2_2.coolDown of Source
    BB talent_combo_reduce = @talent_combo_reduce Multiply -1
    SetSkillCdAtOnce
    FindTargetAction
    CreateBuff [buff_chr_0036_jsspsi_atk_buff_2{enhance_final=@EntityBB_enhance_final,duration=@EntityBB_enhance_duration}] → Context:tar1 count=1
    else
    FindTargetAction
    CreateBuff [buff_chr_0036_jsspsi_atk_buff_2{enhance_final=@EntityBB_enhance_final,duration=@EntityBB_enhance_duration}] → Context:tar1 count=1
f100-103 FindTargetAction
CreateBuff [buff_chr_0036_jsspsi_ultimate_skill_heal] → Context:tar1 count=1
f97-165 (表现类: EffectAction×1)
f97-195 (表现类: EffectAction×1)
f97-195 (表现类: EffectAction×1)
f97-100 BB bufftime1 = 0 Add @EntityBB_enhance_duration
CreateBuff [buff_chr_0036_jsspsi_ult_effect_1{duration=@bufftime1}] → Source count=1
BB bufftime2 = 0.5 Add @EntityBB_enhance_duration
CreateBuff [buff_chr_0036_jsspsi_ult_effect_2{duration=@bufftime2}] → Source count=1
BB bufftime3 = 1 Add @EntityBB_enhance_duration
CreateBuff [buff_chr_0036_jsspsi_ult_effect_3{duration=@bufftime3}] → Source count=1
f58-144 (表现类: EffectAction×1)
f58-144 (表现类: EffectAction×1)
f60-179 (表现类: EffectAction×1)
f18-19 FindTargetAction
f60-184 (表现类: PlaySoundAction×1)
```


## 增益（57）

### buff_chr_0036_jsspsi_atk_buff
- life Limited, dur @duration(10), stacking Stack max 1; 黑板默认 {"duration":10,"spellstatus":0,"abnormal_level":0,"enhance_final":0,"enhance_base":0.025}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB enhance_final = @abnormal_level(0) Multiply @enhance_base(0.025)
  SwitchAction
on DuringBuffEnable:
  (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_atk_buff_2
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"enhance_final":0,"heal_value":0,"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  EnhancedAction
  EnhancedAction
  EnhancedAction
  (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_ayao_attack_listener
- life Infinity, dur @duration, stacking Unlimited max 1; 黑板默认 {"ayao_cd":0.3,"ayao_big_cd":0.3}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnOutputDamage:
  ?isMainChar Owner
  ?decorateMask ExceptAny 2097152
  NotNextCheckAction
  CheckDamageTag
  CheckTimedMarkerCondition
  FindTargetAction
  CreateBuff [buff_chr_0036_jsspsi_ayao_attack_mark] → Context:ayaos count=1
  CreateTimedMarker
on ability OnOutputDamage:
  ?isMainChar Owner
  ?decorateMask HasAll 2097152
  NotNextCheckAction
  CheckDamageTag
  CheckTimedMarkerCondition
  FindTargetAction
  CreateBuff [buff_chr_0036_jsspsi_ayao_big_attack_logic] → Source:ayaos count=1
  CreateBuff [buff_chr_0036_jsspsi_ayao_big_attack_mark] → Context:ayaos count=1
  CreateTimedMarker
  BB EntityBB_ayao_big_cnt Add 1 on Owner
  ?@EntityBB_ayao_big_cnt GE @EntityBB_ayao_big_limit
  FinishGlobalBuffAction
```

### buff_chr_0036_jsspsi_ayao_attack_mark
- life Limited, dur 0.1, stacking Stack max 1; 黑板默认 {"atk_scale":1}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  SetAnimatorParamAction
  Projectile projectile_chr_0036_jsspsi_ayao_attack onHit=chr_0036_jsspsi_ayao_attack_projhit
```

### buff_chr_0036_jsspsi_ayao_big_attack_logic
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {"cd_redece":15,"atk_scale":1,"poise":5}
- 属性修正: 无
- 伤害修正: 无
```
f0-60 (表现类: EffectAction×1)
f4-60 (表现类: EffectAction×1)
f6-9 FindTargetAction
f6-9 Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(1) mask=256 | Cryst/Poise scale=0 mask=0]
SetSkillCdAtOnce
TriggerCustomAbilityEvent
(表现类: EnemyHurtAnimAction×1)
```

### buff_chr_0036_jsspsi_ayao_big_attack_mark
- life Limited, dur 1, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  TeleportPosSelectAction
  SetAnimatorParamAction
  (表现类: TeleportAction×1)
```

### buff_chr_0036_jsspsi_combo_potential2
- life Limited, dur @potential2_duration(0), stacking Stack max 1; 黑板默认 {"potential2_duration":0,"potential2_enhance":0,"potential2_base":0,"potential2_count":0}
- 属性修正: Atk BaseMultiplier @potential2_count(0)
- 伤害修正: 无
```
on DuringBuffEnable:
  BB potential2_count = @EntityBB_combo_count Multiply @potential2_enhance(0)
  BB potential2_count = @potential2_count(0) Add @potential2_base(0)
  RefreshBuffAttrModifierValue
```

### buff_chr_0036_jsspsi_combo_skill_layercount
- life Limited, dur @combo_ui_duration(0), stacking Unique max 0; 黑板默认 {"combo_ui_duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  BB EntityBB_combo_count Assign 0 on Owner
```

### buff_chr_0036_jsspsi_ink_mark
- life Limited, dur @duration(15), stacking Stack max 1; 黑板默认 {"duration":15,"atk_scale_ink":0,"trigger_limit":1,"trigger_cnt":0}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnEnemyAfterTakeSpellInfliction:
  ?@trigger_cnt(0) LT @trigger_limit(1)
  CheckSpellInflictionType
  CreateBuff [buff_chr_0036_jsspsi_ink_triggered{atk_scale=@atk_scale_ink}] → Owner count=1
  BB trigger_cnt Add 1 on Owner
  ?@trigger_cnt(0) GE @trigger_limit(1)
  FinishBuff buff_chr_0036_jsspsi_ink_mark all layers=1 on Owner
```

### buff_chr_0036_jsspsi_ink_triggered
- life Limited, dur 2, stacking Unlimited max 1; 黑板默认 {"atk_scale":0}
- 属性修正: 无
- 伤害修正: 无
```
f0-20 (表现类: EffectAction×1)
f18-48 (表现类: EffectAction×1)
f23-26 FindTargetAction
f23-26 SpellInfliction Cryst → Context:tar
Damage target=Context:tar units=[Cryst/Hp scale=@atk_scale(0) mask=8192]
(表现类: CameraImpulseAction×1 EnemyHurtAnimAction×1 HitStopAction×1)
```

### buff_chr_0036_jsspsi_normal_skill
- life Limited, dur @duration_vul(10), stacking Stack max 4; 黑板默认 {"rate":0.025,"duration_vul":10,"atk_scale_calc":0,"poise_final":0,"isWisd":0,"cd_reduce":7,"atk_scale_laser1":0,"atk_scale_laser2":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  Vulnerable Natural rate=@rate(0.025) dur=@duration_vul(10) child=[object Object] → Owner
  Vulnerable Crystal rate=@rate(0.025) dur=@duration_vul(10) child=[object Object] → Owner
  Vulnerable Fire rate=@rate(0.025) dur=@duration_vul(10) child=[object Object] → Owner
  Vulnerable Pulse rate=@rate(0.025) dur=@duration_vul(10) child=[object Object] → Owner
  Vulnerable Physical rate=@rate(0.025) dur=@duration_vul(10) child=[object Object] → Owner
```

### buff_chr_0036_jsspsi_normal_skill_boomrevert
- life Limited, dur @duration(0.1), stacking Unique max 0; 黑板默认 {"duration":0.1}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB EntityBB_normal_skill_id Assign 0 on Owner
  BB EntityBB_soulback Assign 0 on Owner
```

### buff_chr_0036_jsspsi_normal_skill_check
- life Limited, dur 99, stacking Stack max 1; 黑板默认 {"skill_id_cur":3,"have_delay":0,"exit_fight_delay":2}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffTrigger:
  If [?@skill_id_cur(3) Equals @EntityBB_normal_skill_id]
    else
    SwitchAction
    BB skill_id_cur Assign @EntityBB_normal_skill_id on Owner
on OnBuffFinish:
  ?@have_delay(0) Equals 1
  FindTargetAction
  BB EntityBB_normal_skill_id Assign 0 on Owner
  ChangeSkillAction
  FinishBuff buff_chr_0036_jsspsi_normal_skill_soul_timedisplay_jsspsiself all layers=1 on Owner:soultarget
  BB EntityBB_inkmark_will_boom Assign 0 on Owner
  FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect all layers=1 on Context:soultarget
  FinishBuff buff_chr_0036_jsspsi_normal_skill_soul_timedisplay all layers=1 on Context:soultarget
  FindTargetAction
  If [?@EntityBB_soulback Equals 0]
    FinishOwnerAction
    (表现类: EffectAction×1 ShowHideActorAction×1)
  FindTargetAction
  FinishOwnerAction
  FindTargetAction
  FinishOwnerAction
  FinishBuff buff_chr_0036_jsspsi_normal_skill_check all layers=1 on Owner
  (表现类: EffectAction×1 ShowHideActorAction×1 NotifyCharPassiveUIAction×1)
on ability OnOwnerHpZero:
  FindTargetAction
  FindTargetAction
  FinishOwnerAction
  BB EntityBB_inkmark_will_boom Assign 0 on Owner
  (表现类: ShowHideActorAction×1)
  FindTargetAction
  FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_xianjing_inkhurteffect_1|buff_chr_0036_jsspsi_normal_skill_soul_timedisplay all layers=1 on Context:soul_target
  FindTargetAction
  FinishOwnerAction
  (表现类: ShowHideActorAction×1)
  FindTargetAction
  FinishOwnerAction
  (表现类: ShowHideActorAction×1)
  (表现类: NotifyCharPassiveUIAction×1)
on ability OnExitFight:
  ?@have_delay(0) Equals 0
  SetBuffDurationAction
  BB have_delay Assign 1 on Owner
  RefreshBuffAttrModifierValue
```

### buff_chr_0036_jsspsi_normal_skill_check_isfight
- life Limited, dur 2, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  If [CheckSquadInFight]
    else
    FinishOwnerAction
    BB EntityBB_normal_skill_id Assign 0 on Owner
    (表现类: EffectAction×1 ShowHideActorAction×1)
```

### buff_chr_0036_jsspsi_normal_skill_check_unmarkable
- life Infinity, dur -1, stacking Unique max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  FindTargetAction
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_check_unmarkable_soul] → Context:soul1 count=1
```

### buff_chr_0036_jsspsi_normal_skill_check_unmarkable_soul
- life Infinity, dur -1, stacking Unlimited max 1; 黑板默认 {}; tags [{"tagId":1717826765},{"tagId":335590812}]
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_normal_skill_finish_immune
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"duration":0}; tags [{"tagId":335590812},{"tagId":-1706530655},{"tagId":-279045144},{"tagId":-808036
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_normal_skill_hitstop
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"duration":0}; tags [{"tagId":-1065936627}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  ?BuffStack tag[188749032] BuffCount LT 1 on Owner
  TimeDilation Entity dur=-1
```

### buff_chr_0036_jsspsi_normal_skill_in_combo
- life Limited, dur 0.1, stacking Unique max 0; 黑板默认 {"ayao_duration":15,"x1":-1.5,"y1":0.5,"z1":0,"x2":1,"y2":1.2,"z2":1,"x3":1.5,"y3":0.6,"z3":-0.5,"ayao_cd":0,"ayao_big_cd":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB EntityBB_ayao_big_cnt Assign 0 on Owner
  CreateGlobalBuffAction
  Spawn abilityentity_chr_0036_jsspsi_ayao skill=chr_0036_jsspsi_ayao_idle {EntityBB_x=@x1,EntityBB_y=@y1,EntityBB_z=@z1}
  Spawn abilityentity_chr_0036_jsspsi_ayao skill=chr_0036_jsspsi_ayao_idle {EntityBB_x=@x2,EntityBB_y=@y2,EntityBB_z=@z2}
  Spawn abilityentity_chr_0036_jsspsi_ayao skill=chr_0036_jsspsi_ayao_idle {EntityBB_x=@x3,EntityBB_y=@y3,EntityBB_z=@z3}
```

### buff_chr_0036_jsspsi_normal_skill_inkphantom
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1 PlaySoundAction×1)
  DisableMoveColliderAction
```

### buff_chr_0036_jsspsi_normal_skill_inkphantom_canbehit
- life Limited, dur 0.1, stacking Stack max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB EntityBB_issoulfinish Assign 0 on Owner
```

### buff_chr_0036_jsspsi_normal_skill_inkphantom_damage
- life Limited, dur 2, stacking Stack max 1; 黑板默认 {"duration":0,"ink_damage":0,"ink_poise":0}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_normal_skill_modifysoucebb
- life Limited, dur @duration(0.1), stacking Unique max 0; 黑板默认 {"duration":0.1}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB EntityBB_normal_skill_id Assign 1 on Owner
  BB EntityBB_inkmark_will_boom Assign 1 on Owner
```

### buff_chr_0036_jsspsi_normal_skill_soul
- life Limited, dur @duration_vul(0), stacking Stack max 4; 黑板默认 {"rate":0,"duration_vul":0,"rate_max":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_soul_max{rate=@rate,rate_max=@rate_max,duration_vul=@duration_vul}] → Owner count=1
on OnBuffFinish:
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_soul_max] → Owner count=1
```

### buff_chr_0036_jsspsi_normal_skill_soul_max
- life Limited, dur @duration_vul(0), stacking Stack max 1; 黑板默认 {"rate":0,"duration_vul":0,"rate_max":0,"rate_cal":0,"count":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffTrigger:
  If [?BuffStack buff_chr_0036_jsspsi_normal_skill_soul BuffCount LT 4 on Owner]
    If [?BuffStack buff_chr_0036_jsspsi_normal_skill_soul BuffCount GT 0 on Owner]
      SaveBuffStackNumAdvanced
      RefreshBuffAttrModifierValue
      BB rate_cal = @count(0) Multiply @rate(0)
      RefreshBuffAttrModifierValue
      Vulnerable All rate=@rate_cal(0) dur=@duration_vul(0) child=[object Object] → Owner
      else
      FinishBuff buff_chr_0036_jsspsi_normal_skill_soul_max all layers=1 on Owner
    else
    BB rate_cal = 4 Multiply @rate_max(0)
    RefreshBuffAttrModifierValue
    Vulnerable All rate=@rate_cal(0) dur=@duration_vul(0) child=[object Object] → Owner
```

### buff_chr_0036_jsspsi_normal_skill_soul_timedisplay
- life Limited, dur @duration(15), stacking Stack max 1; 黑板默认 {"duration":15}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_soul_timedisplay_jsspsiself{duration=@duration}] → Source count=1 child
```

### buff_chr_0036_jsspsi_normal_skill_soul_timedisplay_jsspsiself
- life Limited, dur @duration(15), stacking Unique max 1; 黑板默认 {"duration":15}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_plunging_attack_ayao
- life Limited, dur @duration(0.9), stacking Stack max 1; 黑板默认 {"duration":0.9,"ayaopos":1}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  SwitchAction
  (表现类: EffectAction×3)
on OnBuffFinish:
  FinishOwnerAction
f21-27 (表现类: ShowHideActorAction×1)
```

### buff_chr_0036_jsspsi_potential5vfx
- life Infinity, dur 0, stacking Unique max 0; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  TogglableAction
  (表现类: ShowHideActorAction×1)
  (表现类: EffectAction×2)
```

### buff_chr_0036_jsspsi_qizi_count
- life Limited, dur @duration(0.1), stacking Unlimited max 1; 黑板默认 {"duration":0.1,"qizi_count":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB EntityBB_qizi_countnow Assign @qizi_count(0) on Owner
```

### buff_chr_0036_jsspsi_talent1_1
- life Infinity, dur @duration, stacking Unique max 1; 黑板默认 {"ratio_speed":0,"duration_speedup":0}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_talent1_2
- life Infinity, dur @duration, stacking Unique max 1; 黑板默认 {"ratio_speed":0,"duration_speedup":0}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_talent1_speedup
- life Limited, dur @duration_speedup(0), stacking HighPriority by ratio_speed max 1; 黑板默认 {"ratio_speed":0,"duration_speedup":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  SpeedupAction
on OnBuffStart:
  CreateBuff [buff_chr_0027_tangtang_comboskill_waterbuff_vfx] → Owner count=1 child
```

### buff_chr_0036_jsspsi_talent2_1
- life Infinity, dur @duration, stacking Unique max 1; 黑板默认 {"coolDown":0}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_talent2_2
- life Infinity, dur @duration, stacking Unique max 1; 黑板默认 {"coolDown":0}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_train_inksoultarget
- life Infinity, dur @duration_speedup, stacking Stack by ratio_speed max 1; 黑板默认 {"succEvent1":0,"failEvent1":0,"succEvent2":0,"failEvent2":0,"succEvent3":0,"failEvent3":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  If [?@EntityBB_havesoul Equals 1]
    TrainEvent @succEvent1(0)
    else
    TrainEvent @failEvent1(0)
on ability OnTakeDamage:
  If [CheckDamageTransferredSource]
    TrainEvent @succEvent2(0)
    else
    TrainEvent @failEvent2(0)
on ability OnEnemyAfterTakeSpellInfliction:
  If [CheckDamageTransferredSource]
    TrainEvent @succEvent3(0)
    else
    TrainEvent @failEvent3(0)
```

### buff_chr_0036_jsspsi_ult_effect_1
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1 PlaySoundAction×1)
```

### buff_chr_0036_jsspsi_ult_effect_2
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_ult_effect_3
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"duration":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_ultimate_skill_heal
- life Limited, dur 0.1, stacking Unique max 0; 黑板默认 {"heal_scale":50,"heal_static_value":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  CheckObjectTypeMatch
  HealAction
  (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_xianjing_inkboom
- life Limited, dur @duration(2), stacking Unique max 1; 黑板默认 {"duration":2,"ink_hitcd":0.5,"qizi_damage":0,"qizi_poise":0,"ratio_speed":0,"duration_speedup":0}
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  ?@EntityBB_issoulfinish Equals 0
  If [FindTargetAction && FindTargetAction && FindTargetAction && FindTargetAction && ?BuffStack buff_chr_0036_jsspsi_xianjing_inkhurteffect BuffCount GE 1 on Context:benti && SetAbilityEntityDuration && CastSkill && BB EntityBB_soulback Assign 1 on Owner && FinishOwnerAction && BB EntityBB_issoulfinish Assign 1 on Owner && CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom_damage{ink_damage=@EntityBB_ink_damage,ink_poise=@EntityBB_ink_boom_poise}] → Source:soul count=1 && BB EntityBB_ink_damage Assign 0 on Owner && FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect all layers=1 on Context:benti && FinishBuff buff_chr_0036_jsspsi_normal_skill_soul_timedisplay all layers=1 on Context:benti && IfElseAction]
    else
    FindTargetAction
    Projectile projectile_chr_0036_jsspsi_normal_skill_inkboom {EntityBB_ink_damage=@EntityBB_ink_damage,EntityBB_ink_boom_poise=@EntityBB_ink_boom_poise,EntityBB_ink_boom_range=@EntityBB_ink_boom_range}
    FinishOwnerAction
    BB EntityBB_normal_skill_id Assign 0 on Owner
    (表现类: ShowHideActorAction×1)
  BB EntityBB_normal_skill_id Assign 0 on Owner
```

### buff_chr_0036_jsspsi_xianjing_inkboom_camera
- life Limited, dur @duration(3), stacking Stack max 1; 黑板默认 {"duration":3,"ink_hitcd":0.5,"qizi_damage":0,"qizi_poise":0,"souldistance":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  FindTargetAction
  FindTargetAction
  SaveTargetDistanceAction
  BB souldistance = @souldistance(0) Divide 2
  FindTargetAction
```

### buff_chr_0036_jsspsi_xianjing_inkboomqizi
- life Limited, dur @duration(0.1), stacking Unlimited max 1; 黑板默认 {"duration":0.1,"ink_hitcd":0.5,"qizi_damage":0,"qizi_poise":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  FindTargetAction
  CheckEntityNum
  CreateBuff [buff_chr_0036_jsspsi_xianjing_inkboomqizi_1] → Context:qizi count=1
  Projectile projectile_chr_0036_jsspsi_combo_skill_qiziboom {EntityBB_qizi_damage=@EntityBB_atk_scale_qizi,EntityBB_qizi_poise=@EntityBB_poise_qizi}
  (表现类: DebugPrintAction×2)
```

### buff_chr_0036_jsspsi_xianjing_inkboomqizi_1
- life Limited, dur @duration(0.1), stacking Unlimited max 1; 黑板默认 {"duration":0.1,"ink_hitcd":0.5,"qizi_damage":0,"qizi_poise":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  Projectile projectile_chr_0036_jsspsi_combo_skill_qiziboom {EntityBB_qizi_damage=@EntityBB_atk_scale_qizi,EntityBB_qizi_poise=@EntityBB_poise_qizi}
```

### buff_chr_0036_jsspsi_xianjing_inkdamage
- life Limited, dur @duration(0.1), stacking Unlimited max 1; 黑板默认 {"duration":0.1,"ink_hitcd":0.5,"ink_damage":0,"ink_damage2":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB ink_damage Assign @EntityBB_ink_damage on Owner
  Damage target=Owner units=[Cryst/Hp scale=@ink_damage(0) calc=DefiniteValueCalculation(@EntityBB_ink_damage) nonSimple mask=4608]
  BB EntityBB_ink_damage Assign 0 on Owner
  BB ink_damage Assign 0 on Owner
```

### buff_chr_0036_jsspsi_xianjing_inkdamage_marker
- life Infinity, dur @duration, stacking Enhance max 999; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
```

### buff_chr_0036_jsspsi_xianjing_inkhurteffect
- life Limited, dur @duration(15), stacking Unlimited max 1; 黑板默认 {"duration":15,"ink_hitcd":0.5,"ink_damage":0,"ink_damage2":0,"coefficient":0.001,"stack":0,"curduration":0,"soul_hp":999999999999,"ink_damage_rate":0,"spellinfliction":6,"ink_damage_display":0,"soulbufftime":0,"curcounttime":0,"kill_damage":0,"hp_zero":0}; tags [{"tagId":-1530986851}]
- 属性修正: 无
- 伤害修正: 无
```
on DuringBuffEnable:
  TagQueryListenerAction
  TagQueryListenerAction
on OnBuffTrigger:
  TagQueryListenerAction
on OnBuffStart:
  CreateBuff [buff_chr_0036_jsspsi_xianjing_inkhurteffect_1{duration=@duration}] → Owner count=1 child
  CreateBuff [buff_chr_0036_jsspsi_train_inksoultarget] → Owner count=1 child
  (表现类: EffectAction×1)
on OnBuffFinish:
  ?@EntityBB_inkmark_will_boom Equals 1
  FindTargetAction
  ?@EntityBB_havesoul Equals 0
  BB EntityBB_normal_skill_id Assign 0 on Owner
  Projectile projectile_chr_0036_jsspsi_normal_skill_inkboom {EntityBB_ink_damage=@EntityBB_ink_damage,EntityBB_ink_boom_poise=@EntityBB_ink_boom_poise,EntityBB_ink_boom_range=@EntityBB_ink_boom_range}
  BB EntityBB_ink_damage Assign 0 on Owner
on DuringBuffEnable:
  ChannelingActionV2
    BB ink_damage_display = @EntityBB_ink_damage Divide 10000
    BB ink_damage_display Floor @ink_damage_display(0) on Owner
    If [?@ink_damage_display(0) LT 1]
      (表现类: NotifyCharPassiveUIAction×1)
      else
      If [?@ink_damage_display(0) GT 999]
        BB ink_damage_display Assign 999 on Owner
        RefreshBuffAttrModifierValue
      (表现类: NotifyCharPassiveUIAction×1)
  (表现类: EffectAction×2 PlaySoundAction×1)
on OnBuffReleased:
  If [CheckSquadInFight]
    else
    BB EntityBB_normal_skill_id Assign 0 on Owner
    FindTargetAction
    If [?@EntityBB_soulback Equals 0]
      FinishOwnerAction
      (表现类: EffectAction×1 ShowHideActorAction×1)
  FindTargetAction
  FinishOwnerAction
  If [?@hp_zero(0) Equals 0]
    BB EntityBB_normal_skill_id Assign 0 on Owner
on ability OnTakeDamage:
  CheckObjectTypeMatch
  SaveDamageContext
  BB ink_damage2 = @ink_damage(0) Multiply @ink_damage_rate(0)
  BB EntityBB_ink_damage = @EntityBB_ink_damage Add @ink_damage2(0)
  CheckDamageTransferredSource
  CheckGlobalCDTimerAction
  TriggerCustomAbilityEvent
  ?BuffStack buff_chr_0036_jsspsi_xianjing_linkline_2 BuffCount LT 1 on Context:moying1
  CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline_2] → Context:moying1 count=1
  ?@EntityBB_issoulfinish LE 0
  FindTargetAction
  CastSkill
  AddGlobalCDTimer
  (表现类: EffectAction×3)
on ability OnExitFight:
  FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect all layers=1 on Owner
on ability OnOwnerHpZero:
  BB hp_zero Assign 1 on Owner
  RefreshBuffAttrModifierValue
  SaveBuffLifeTime
  BB EntityBB_soulbufftime Assign @soulbufftime(0) on Owner
  BB kill_damage = @ink_damage_rate(0) Multiply @kill_damage(0)
  BB EntityBB_ink_damage = @EntityBB_ink_damage Add @kill_damage(0)
  ?@EntityBB_havesoul Equals 0
  FindTargetAction
  If [CheckSquadInFight]
    BB soulbufftime = @EntityBB_soulbufftime Add 1
    FindTargetAction
    Spawn abilityentity_chr_0036_jsspsi_combo_skill_inkphantom_1 {EntityBB_soul_hp=@soul_hp,EntityBB_duration=@soulbufftime}
    SaveBuffLifeTime
    CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline{duration=@duration,ink_damage_rate=@ink_damage_rate,iswaitenemy=1,curcounttime=@soulbufftime}] → Context:moying count=1
    CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom{duration=@duration,ink_damage_rate=@ink_damage_rate,iswaitenemy=1,curcounttime=@soulbufftime}] → Context:moying count=1
    CreateBuff [buff_chr_0036_jsspsi_normal_skill_check_isfight{duration=@duration,ink_damage_rate=@ink_damage_rate,iswaitenemy=1,curcounttime=@soulbufftime}] → Context:moying count=1
    BB EntityBB_normal_skill_id Assign 2 on Owner
    BB EntityBB_havesoul Assign 1 on Owner
    (表现类: ShowHideActorAction×1)
    else
    BB EntityBB_normal_skill_id Assign 2 on Owner
  BB ink_damage_display = @EntityBB_ink_damage Divide 10000
  If [?@ink_damage_display(0) LT 1]
    (表现类: NotifyCharPassiveUIAction×1)
    else
    If [?@ink_damage_display(0) GT 999]
      BB ink_damage_display Assign 999 on Owner
    (表现类: NotifyCharPassiveUIAction×1)
on ability OnBeforeTakeDamage:
  If [CheckObjectTypeMatch]
    StoreEntityProperty
    else
    BB kill_damage Assign 0 on Owner
f0-9999 (表现类: EffectAction×3)
```

### buff_chr_0036_jsspsi_xianjing_inkhurteffect_1
- life Limited, dur @duration(15), stacking Unlimited max 1; 黑板默认 {"duration":15,"ink_hitcd":0.5,"ink_damage":0,"ink_damage2":0,"coefficient":0.001,"stack":0,"curduration":0,"soul_hp":999999999999,"ink_damage_rate":0,"spellinfliction":6}; tags [{"tagId":-1530986851}]
- 属性修正: 无
- 伤害修正: 无
```
on ability OnEnemyAfterTakeSpellInfliction:
  CheckGlobalCDTimerAction
  CheckSpellInflictionType
  SwitchAction
  AddGlobalCDTimer
```

### buff_chr_0036_jsspsi_xianjing_linkboom
- life Limited, dur @duration, stacking Unlimited max 1; 黑板默认 {}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnAddedBuff:
  If [?tag {"$type":"Beyond.Gameplay.Core.Conditions.CheckTagMatch+Data, Gameplay.Beyond","]
    CreateBuff [buff_chr_0036_jsspsi_normal_skill_soul] → Owner count=1
    else
    CreateBuff [buff_chr_0036_jsspsi_normal_skill] → Owner count=1
  FinishBuff buff_chr_0036_jsspsi_xianjing_linkboom all layers=1 on Owner
```

### buff_chr_0036_jsspsi_xianjing_linkboom_ex
- life Limited, dur @duration(2), stacking Unlimited max 1; 黑板默认 {"duration":2}
- 属性修正: 无
- 伤害修正: 无
```
f8-60 (表现类: EffectAction×1)
f10-12 Damage target=Owner units=[Cryst/Hp scale=0.2 mask=4352]
f30-30 FinishBuff buff_chr_0036_jsspsi_xianjing_linkboom_ex all layers=1 on Owner
```

### buff_chr_0036_jsspsi_xianjing_linkline
- life Limited, dur @duration(0), stacking Unlimited max 1; 黑板默认 {"duration":0,"ink_maxhp":0,"ink_damage":0,"cal1":0,"posy1":0,"curduration":0,"soul_hp":999999999,"qizi_damage":0,"qizi_posie":0,"ink_damage_rate":0,"hurteffect_cd":0.5,"soulbufftime":0,"ratio_speed":0,"duration_speedup":0,"iswaitenemy":0,"inksoultime":0,"curcounttime":0}; tags [{"tagId":335590812}]
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  BB EntityBB_havesoul Assign 1 on Owner
  If [?@curcounttime(0) GT 0]
    SetBuffDurationAction
  StoreDetectedShapeToBlackboard
  StoreDetectedShapeToBlackboard
  If [?@range GT 1]
    If [?@range LT 2]
      BB cal1 = @range Multiply -1
      BB posy1 = 0.3 Add @cal1(0)
      else
      BB range Assign 2 on Owner
      BB posy1 Assign -1 on Owner
    (表现类: DebugPrintAction×1)
    else
    BB range Assign 1 on Owner
    BB posy1 Assign 0.3 on Owner
on OnBuffFinish:
  ?@iswaitenemy(0) Equals 0
  BB EntityBB_normal_skill_id Assign 0 on Owner
  FinishBuff buff_chr_0036_jsspsi_normal_skill_check all layers=1 on Source
  FindTargetAction
  FindTargetAction
  CheckEntityNum
  BB EntityBB_issoulfinish Assign 1 on Owner
  FindTargetAction
  SetAbilityEntityDuration
  CastSkill
  BB EntityBB_soulback Assign 1 on Owner
  FinishBuff buff_chr_0036_jsspsi_xianjing_inkhurteffect|buff_chr_0036_jsspsi_normal_skill_soul_timedisplay all layers=1 on Context:soul_target1
  FinishOwnerAction
  CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom_damage{ink_damage=@EntityBB_ink_damage,ink_poise=@EntityBB_ink_boom_poise}] → Source count=1
  BB EntityBB_ink_damage Assign 0 on Owner
  CreateBuff [buff_chr_0036_jsspsi_xianjing_inkboom_camera] → Source count=1
  If [?BuffStack buff_chr_0036_jsspsi_talent1_1 BuffCount GE 1 on Source]
    BB ratio_speed ← buff_chr_0036_jsspsi_talent1_1.ratio_speed of Source
    BB duration_speedup ← buff_chr_0036_jsspsi_talent1_1.duration_speedup of Source
    FindTargetAction
    CreateBuff [buff_chr_0036_jsspsi_talent1_speedup{ratio_speed=@ratio_speed,duration_speedup=@duration_speedup}] → Context:chrteam count=1
    else
    If [?BuffStack buff_chr_0036_jsspsi_talent1_2 BuffCount GE 1 on Source]
      BB ratio_speed ← buff_chr_0036_jsspsi_talent1_2.ratio_speed of Source
      BB duration_speedup ← buff_chr_0036_jsspsi_talent1_2.duration_speedup of Source
      FindTargetAction
      CreateBuff [buff_chr_0036_jsspsi_talent1_speedup{ratio_speed=@ratio_speed,duration_speedup=@duration_speedup}] → Context:chrteam count=1
  ?@iswaitenemy(0) Equals 1
  BB EntityBB_normal_skill_id Assign 0 on Owner
  FinishOwnerAction
  (表现类: NotifyCharPassiveUIAction×1 EffectAction×1 ShowHideActorAction×1)
on OnBuffTrigger:
  If [?@iswaitenemy(0) Equals 1]
    If [CheckSquadInFight]
      FindTargetAction
      If [CheckEntityNum]
        SaveBuffLifeTime
        BB inksoultime = @soulbufftime(0) Add 2
        Spawn abilityentity_chr_0036_jsspsi_combo_skill_inkphantom {EntityBB_soul_hp=@soul_hp,EntityBB_duration=@inksoultime}
        Spawn abilityentity_chr_0036_jsspsi_combo_skill_inkphantom_2 {EntityBB_soul_hp=@soul_hp,EntityBB_duration=@inksoultime}
        CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline{duration=@duration,ink_damage_rate=@ink_damage_rate,curcounttime=@soulbufftime}] → Context:moying count=1
        CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline_1{duration=@soulbufftime}] → Context:moying count=1
        CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom{duration=@duration}] → Context:moying1 count=1
        BB soulbufftime = @soulbufftime(0) Add 1
        CreateBuff [buff_chr_0036_jsspsi_xianjing_inkhurteffect{duration=@soulbufftime,ink_damage_rate=@ink_damage_rate}] → Context:soul_target1 count=1
        CreateBuff [buff_chr_0036_jsspsi_normal_skill_soul_timedisplay{duration=@soulbufftime}] → Context:soul_target1 count=1
        FinishOwnerAction
        BB EntityBB_normal_skill_id Assign 2 on Owner
        (表现类: DebugPrintAction×1 ShowHideActorAction×3)
      else
      CreateBuff [buff_chr_0036_jsspsi_normal_skill_check_isfight] → Owner count=1
    else
    If [CheckSquadInFight]
      else
      FinishOwnerAction
      BB EntityBB_normal_skill_id Assign 0 on Owner
      FindTargetAction
      FinishOwnerAction
      (表现类: ShowHideActorAction×2)
on ability OnAbilityEntitySelfFinished:
  If [CheckAbilityEntityFinishReason && ?@iswaitenemy(0) Equals 0]
    CheckAbilityEntityCurDuration
    FindTargetAction
    CheckEntityNum
    ?BuffStack buff_chr_0036_jsspsi_xianjing_inkboom BuffCount LT 1 on Context:zhuren
    FindTargetAction
    If [CheckEntityNum]
      FinishOwnerAction
      If [?@EntityBB_soulbufftime LE 0.7]
        BB EntityBB_soulbufftime Assign 0.7 on Owner
      BB soulbufftime = @EntityBB_soulbufftime Add 1
      Spawn abilityentity_chr_0036_jsspsi_combo_skill_inkphantom {EntityBB_soul_hp=@soul_hp,EntityBB_duration=@soulbufftime}
      FindTargetAction
      SetAbilityEntityDuration
      CreateBuff [buff_chr_0036_jsspsi_xianjing_inkhurteffect{duration=@EntityBB_soulbufftime,ink_damage_rate=@EntityBB_ink_damage_rate}] → Context:soul_target1 count=1
      BB soulbufftime = @EntityBB_soulbufftime Multiply 0.95
      CreateBuff [buff_chr_0036_jsspsi_normal_skill_inkphantom{duration=@duration}] → Context:moying1 count=1
      CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline{duration=@duration,ink_damage_rate=@ink_damage_rate,curcounttime=@soulbufftime}] → Context:moying count=1
      CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline_1{duration=@duration}] → Context:moying count=1
      CreateBuff [buff_chr_0036_jsspsi_normal_skill_soul_timedisplay{duration=@EntityBB_soulbufftime}] → Context:soul_target1 count=1
      (表现类: ShowHideActorAction×3 DebugPrintAction×1)
      else
      If [CheckSquadInFight]
        BB soulbufftime = @EntityBB_soulbufftime Add 1
        Spawn abilityentity_chr_0036_jsspsi_combo_skill_inkphantom_1 {EntityBB_soul_hp=@soul_hp,EntityBB_duration=@soulbufftime}
        FindTargetAction
        FinishOwnerAction
        SaveBuffLifeTime
        CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline{duration=@duration,ink_damage_rate=@ink_damage_rate,iswaitenemy=1,curcounttime=@soulbufftime}, buff_chr_0036_jsspsi_normal_skill_inkphantom{duration=@soulbufftime}] → Context:moying count=1
        (表现类: ShowHideActorAction×2)
        else
        FindTargetAction
        FinishOwnerAction
        (表现类: ShowHideActorAction×2)
    (表现类: DebugPrintAction×3)
f0-9999 (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_xianjing_linkline_1
- life Limited, dur @duration(0), stacking Unlimited max 1; 黑板默认 {"duration":0,"ink_maxhp":0,"ink_damage":0}; tags [{"tagId":335590812}]
- 属性修正: 无
- 伤害修正: 无
```
on ability OnCustomAbilityEvent:
  CheckCustomAbilityEvent
  FinishCurBuff
f5-99999 (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_xianjing_linkline_2
- life Limited, dur @duration(0.5), stacking Unlimited max 1; 黑板默认 {"duration":0.5,"ink_maxhp":0,"ink_damage":0}; tags [{"tagId":335590812}]
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffStart:
  ConvertToTargetContext
on OnBuffFinish:
  CreateBuff [buff_chr_0036_jsspsi_xianjing_linkline_3] → Owner count=1
f0-60 (表现类: EffectAction×1 DebugPrintAction×1)
```

### buff_chr_0036_jsspsi_xianjing_linkline_3
- life Limited, dur @duration(15), stacking Unlimited max 1; 黑板默认 {"duration":15,"ink_maxhp":0,"ink_damage":0}; tags [{"tagId":335590812}]
- 属性修正: 无
- 伤害修正: 无
```
on ability OnCustomAbilityEvent:
  CheckCustomAbilityEvent
  FinishCurBuff
f0-450 (表现类: EffectAction×1)
```

### buff_chr_0036_jsspsi_xianjing_listener
- life Limited, dur @duration(12), stacking Unlimited max 1; 黑板默认 {"duration":12,"rate":0,"rate_max":0,"duration_vul":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  CastSkill
on OnBuffTrigger:
  FindTargetAction
  ?BuffStack buff_chr_0036_jsspsi_xianjing_listener_self BuffCount LT 1 on Context:normalskillabentity
  FindTargetAction
  CheckEntityNum
  FinishBuff buff_chr_0036_jsspsi_xianjing_listener all layers=1 on Owner
on DuringBuffEnable:
  AuraAction
on ability OnAbilityEntitySelfFinished:
  CastSkill
```

### buff_chr_0036_jsspsi_xianjing_listener_1
- life Limited, dur @duration(12), stacking Unlimited max 1; 黑板默认 {"duration":12,"rate":0,"rate_max":0,"duration_vul":0}
- 属性修正: 无
- 伤害修正: 无
```
on OnBuffFinish:
  CastSkill
on OnBuffTrigger:
  FindTargetAction
  ?BuffStack buff_chr_0036_jsspsi_xianjing_listener_self BuffCount LT 1 on Context:normalskillabentity
  FindTargetAction
  CheckEntityNum
  FinishBuff buff_chr_0036_jsspsi_xianjing_listener_1 all layers=1 on Owner
on DuringBuffEnable:
  AuraAction
on ability OnAbilityEntitySelfFinished:
  CastSkill
```

### buff_chr_0036_jsspsi_xianjing_listener_self
- life Limited, dur @duration(3), stacking Unlimited max 1; 黑板默认 {"duration":3}
- 属性修正: 无
- 伤害修正: 无
```
```
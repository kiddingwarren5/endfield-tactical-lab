# 解包清单：wpn_pistol_0011

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（1）

### sk_wpn_pistol_0011
- 文件黑板: {"cryst_dmg_up":0.16,"cryst_dmg_up2":0.05,"duration":30,"cd":0.1,"spell_dmg_taken_up":0.12,"duration2":15}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
- 等级表 L9: cost UltSp 0, cd 0, 黑板 {"cryst_dmg_up":0.448,"cryst_dmg_up2":0.56,"spell_damage_taken_up":0.168,"duration":20,"duration2":20}; L1 黑板 {"cryst_dmg_up":0.16,"cryst_dmg_up2":0.2,"spell_damage_taken_up":0.06,"duration":20,"duration2":20}
```
```


## 增益（2）

### buff_wpn_pistol_0011_valid
- life Limited, dur @duration(0), stacking Stack max 1; 黑板默认 {"cryst_dmg_up2":0,"duration":0}
- 属性修正: CrystDamageIncrease BaseAddition @cryst_dmg_up2(0)
- 伤害修正: 无
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up] → Owner count=1 child
```

### buff_wpn_pistol_0011_valid2
- life Limited, dur @duration2(10), stacking HighPriority max @1; 黑板默认 {"spell_damage_taken_up":0.1,"duration2":10}
- 属性修正: 无
- 伤害修正: Defender: DamageScaleProcessor NormalCalcZone  @spell_damage_taken_up(0.1) cond=[CheckDamageTypeMask]
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_eny_def_down] → Owner count=1 child
```
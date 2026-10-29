# 解包清单：wpn_claym_0013

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（1）

### sk_wpn_claym_0013
- 文件黑板: {"dmg_up":0.1,"cryst_dmg_up":0.1,"cryst_dmg_up2":0.05,"duration":15,"duration2":15}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
- 等级表 L9: cost UltSp 0, cd 0, 黑板 {"dmg_up":0.56,"cryst_dmg_up":0.28,"cryst_dmg_up2":0.56,"duration":15,"duration2":15}; L1 黑板 {"dmg_up":0.2,"cryst_dmg_up":0.1,"cryst_dmg_up2":0.2,"duration":15,"duration2":15}
```
```


## 增益（3）

### buff_wpn_claym_0013
- life Infinity, dur 0, stacking Unique max @max_stack; 黑板默认 {"cryst_up_layer":0,"count":0,"cryst_up_final":0}
- 属性修正: 无
- 伤害修正: Attacker: DamageScaleProcessor NormalCalcZone  @cryst_up_final(0) cond=[SaveBuffStackNumAdvanced && BB cryst_up_final Assign @cryst_up_layer(0) on Owner && BB cryst_up_final Multiply @count(0) on Owner]
```
```

### buff_wpn_claym_0013_combo_skill
- life Limited, dur @duration2(0), stacking Refresh max @max_stack; 黑板默认 {"cryst_dmg_up2":0,"duration2":0}
- 属性修正: CrystDamageIncrease BaseAddition @cryst_dmg_up2(0)
- 伤害修正: 无
```
```

### buff_wpn_claym_0013_normal_skill
- life Limited, dur @duration(0), stacking Refresh max @max_stack; 黑板默认 {"cryst_dmg_up":0,"duration":0}
- 属性修正: CrystDamageIncrease BaseAddition @cryst_dmg_up(0)
- 伤害修正: 无
```
```
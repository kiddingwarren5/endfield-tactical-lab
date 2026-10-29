# 解包清单：equipsuit_usp_02

来源 https://data.akedata.wiki 版本 1.6.4@11343132-9（抓取 2026-10-29），由 tools/akedata_reader.mjs 生成。帧率 30。表现类动作（特效/音效/镜头）只计数。


## 技能（1）

### passive_equipsuit_usp_02
- 文件黑板: {"hp_up":0.2,"dmg_up":0.2,"duration":30}; cast cost UltimateSp 0; cd 0; durationFrame 0 (0.00s), exclusiveFrame 0 (0.00s)
- 等级表 L1: cost UltSp 0, cd 0, 黑板 {"hp_up":1000,"dmg_up":0.16,"duration":15}; L1 黑板 {"hp_up":1000,"dmg_up":0.16,"duration":15}
```
```


## 增益（2）

### buff_equipsuit_usp_02
- life Infinity, dur 0, stacking Unlimited max 0; 黑板默认 {"hp_up":1000,"dmg_up":0.25,"duration":15}
- 属性修正: 无
- 伤害修正: 无
```
on ability OnOutputBuff:
  CheckBuffIdInContext
  CreateBuff [buff_equipsuit_usp_02_AddAttack{dmg_up=@dmg_up,duration=@duration}] → InstantSearch count=1
```

### buff_equipsuit_usp_02_AddAttack
- life Limited, dur @duration(15), stacking Stack max 1; 黑板默认 {"hp_up":1000,"dmg_up":0.25,"duration":15}
- 属性修正: 无
- 伤害修正: Attacker: DamageScaleProcessor NormalCalcZone  @dmg_up(0.25)
```
on DuringBuffEnable:
  CreateBuff [buff_common_vfx_char_atk_up] → Owner count=1 child
```
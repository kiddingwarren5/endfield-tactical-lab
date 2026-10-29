# 解包数据（data.akedata.wiki）

来源：https://data.akedata.wiki （终末地解包数据站，公开静态 JSON；版本见 manifest.json 的 `version`）。
原始文件体积大（全部干员 SkillData 约 150 MB、全部 BuffData 约 70 MB），**不入库**；入库的只有 `manifest.json`（每个已下载文件的路径、md5、资源版本）和 `index/manifest.json`（站点版本清单）。

恢复本地副本（按需）：
```
node tools/fetch_akedata.mjs --match chr_ --dir SkillData                 # 全部干员技能（时序表的输入）
node tools/fetch_akedata.mjs --dir BuffData                               # 全部 buff
node tools/fetch_akedata.mjs --dir GameplayConfig
node tools/fetch_akedata.mjs --table CharacterTable,SkillPatchTable,CharacterPotentialTable,EquipTable,WeaponBasicTable,EnemyTable,PotentialTalentEffectTable,EquipSuitTable,WeaponTalentTemplateTable,CharGrowthTable,CharLevelUpTable,EnemyAttributeTemplateTable,GemTable,AttributeShowConfigTable,DungeonTable,WeaponUpgradeTemplateTable,EquipItemTable,CharProfessionTable
```
工具按索引 md5 校验，不一致不保存；重跑只补缺。生成物（dist/data/timing-akedata.js、docs/datamine/*.md）入库，`node tools/build_timing_akedata.mjs --check` 可在有原始文件时核对一致。

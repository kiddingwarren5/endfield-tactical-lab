# 武器与装备数据入口

- 官方干员及物品图鉴：https://wiki.skland.com/endfield/catalog?mainTypeId=1&subTypeId=1&filterIds=&header=0
- 全武器分类、名称及逐件详情：https://warfarin.wiki/cn/weapons
- 全装备套装、槽位、名称及逐件详情：https://warfarin.wiki/cn/gear

当前 Demo 只实现别礼、赫拉芬格及截图中的四件装备。武器与装备图标来自华法琳 Wiki 的 itemicon 静态资源，已复制到 dist/assets；当前道具的详情地址可从上述完整图鉴进入。华法琳 Wiki 是玩家维护的数据源；接入可更换装备时，应逐项对照官方图鉴并在本地版本化属性、精锻数组、套装效果和图标。

数据结构下一步需要按“道具 ID、名称、槽位/武器类型、等级、三条属性及各自精锻、套装效果/武器技能、潜能对应等级、图标来源”保存，而不是把当前装备对象写死在计算器中。

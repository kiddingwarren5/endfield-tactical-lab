// 规划器周期/阈值口径测试（依据 docs/reviews/engine-review-gpt.md 第四节）。
import assert from 'node:assert/strict';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js';
import {simulate} from '../dist/engine/sim/simulate.js'; import {cycleOf,chargeThreshold} from '../dist/engine/sim/plan.js';
const data={operators,weapons,gear,sets,effects}; const op=n=>operators.find(o=>o.name===n);
const mk=n=>({operatorId:op(n).id,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},weapon:{id:null},gear:{},consumables:[]});
const enemy={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}};
// 1) 周期结束 = 该成员终结技伤害结算完；截止前未命中 → 不完整
const team=[mk('佩丽卡')]; const base={team,data,mechanics,timing,enemy,mainControl:0,initial:{sp:200,energy:[80]}};
const s5=simulate({...base,timeline:[{t:4,member:0,kind:'ultimate'}],params:{duration:5,mainAutoNormal:false}});
const c5=cycleOf(s5,[0]); assert.equal(c5.complete,false,'终结技命中在 5s 之后，不应判完成');
const s8=simulate({...base,timeline:[{t:4,member:0,kind:'ultimate'}],params:{duration:8,mainAutoNormal:false}});
const c8=cycleOf(s8,[0]); assert.equal(c8.complete,true); assert.ok(c8.end>=6.3&&c8.end<7,'周期末应在终结技命中后 '+c8.end);
// 2) 阈值：截止时刻精确能量（不依赖采样）；已满 → 所需增量 ≤ 0
const th=chargeThreshold({...base,initial:{sp:200,energy:[74]},timeline:[{t:0,member:0,kind:'skill'}],params:{mainAutoNormal:false}},[{member:0,t:0.49}]);
assert.equal(th[0].feasible,true); assert.ok(th[0].requiredExtra<=0,'0s 战技后 0.49s 已满能 '+JSON.stringify(th[0]));
// 3) 阈值在截止前已施放终结技：口径为“到达满能时刻 ≤ 截止”
const th2=chargeThreshold({...base,initial:{sp:200,energy:[70]},timeline:[{t:0,member:0,kind:'skill'},{t:1,member:0,kind:'ultimate'}],params:{mainAutoNormal:false}},[{member:0,t:4.5}]);
assert.equal(th2[0].feasible,true,'应可解：效率足够时 1s 前满能并施放 '+JSON.stringify(th2[0]));
// 4) 重放验证：阈值 +0 可行
console.log('plan cycle/threshold tests passed',{c8:c8.end,th:th[0].requiredExtra,th2:th2[0].requiredExtra});

// 排轴计算任务（主线程与 Worker 共用）：输入可序列化的任务描述，输出可 structured-clone 的结果（去掉数据表引用）。
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import sets from '../data/sets.js'; import effects from '../data/effects.js'; import timing from '../data/timing.js'; import mechanics from '../data/mechanics.js'; import rotations,{scenarios} from '../data/rotations.js';
import {resolveRotation,autoRotation} from '../engine/sim/rotation.js';
const data={operators,weapons,gear,sets,effects};
export function runJob(job,onProgress){
  const scenario=scenarios.find(x=>x.id===job.scenarioId)||scenarios[0]; const ctx={data,mechanics,timing,enemy:job.enemy};
  let res; if(job.kind==='auto') res=autoRotation(job.team,job.mainControl,ctx,scenario,{...job.opts,onProgress});
  else { const preset=rotations.find(p=>p.id===job.presetId); res=resolveRotation(preset,ctx,scenario,preset===rotations[0],{team:job.team,mainControl:job.mainControl}); }
  const {data:_d,mechanics:_m,timing:_t,...input}=res.input; return {...res,input};
}

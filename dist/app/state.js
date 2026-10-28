// UI state: defaults, member factory, (de)serialization. Engine never reads DOM; UI never computes damage itself.
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js';
export const STATE_VERSION=3;
const byName=(arr,n)=>arr.find(x=>x.name===n);
export function newMember(operatorId){ const op=operators.find(o=>o.id===operatorId); return {operatorId,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:0,weapon:{id:null,potential:0,ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}}; }
export function regressionMember(){ // 别礼样例（交接 Demo）
  const m=newMember(byName(operators,'别礼').id); m.weapon.id=byName(weapons,'赫拉芬格').id;
  m.gear.armor.id=byName(gear,'涌浪重装甲').id; m.gear.gloves.id=byName(gear,'潮涌手甲').id; m.gear.kit1.id=byName(gear,'悬河供氧栓').id; m.gear.kit2.id=byName(gear,'生物辅助护板').id; return m; }
export function defaultState(){ return {version:STATE_VERSION,team:[regressionMember(),null,null,null],active:0,mainControl:0,
  enemy:{defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}},critMode:'never',options:{artsStrength:0,combo:0,stagger:0,reduction:0},
  selection:{kind:'segment',skillKey:'combo',segmentId:'combo2'},vars:{layers:4,abnormal:1,mechElement:'cold'},
  buffs:{unified:{toggles:{},stacks:{},overrides:{}},perSegment:{}},buffTab:'unified',buffFilter:'',snapshots:[],ui:{folds:{}}}; }
export const clone=x=>JSON.parse(JSON.stringify(x));
export function weaponPotentialToRank(p){ return 4+Math.max(0,Math.min(5,Number(p)||0)); }
export function rankToWeaponPotential(r){ return Math.max(0,Math.min(5,(Number(r)||4)-4)); }

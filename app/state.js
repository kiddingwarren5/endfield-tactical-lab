// UI state: defaults, member factory, (de)serialization. Engine never reads DOM; UI never computes damage itself.
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import {DEFAULT_BUILDS} from '../data/builds.js';
export const STATE_VERSION=4;
const byName=(arr,n)=>arr.find(x=>x.name===n);
export function newMember(operatorId){ const op=operators.find(o=>o.id===operatorId); return {operatorId,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:'auto',weapon:{id:null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}}; }
export function regressionMember(){ // 别礼样例（交接 Demo）
  const m=newMember(byName(operators,'别礼').id); m.weapon.id=byName(weapons,'赫拉芬格').id;
  applyDefaultBuild(m); return m; }
export const ENEMY_DEFAULT={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{},attackInterval:4}; // 对照靶默认值；attackInterval 敌人每隔几秒攻击主控（0 = 不攻击）
export function defaultRot(){ return {scenario:'target',enemy:clone(ENEMY_DEFAULT),auto:{beam:6,horizon:60},advanced:false}; }
export function ensureRot(s){ if(!s.rot) s.rot=defaultRot(); if(!s.rot.enemy) s.rot.enemy=clone(ENEMY_DEFAULT); if(!s.rot.auto) s.rot.auto={beam:6,horizon:60}; if(!s.rot.scenario) s.rot.scenario='target'; return s.rot; }
export function hasDefaultBuild(member){ const op=operators.find(o=>o.id===member?.operatorId); return Boolean(op&&DEFAULT_BUILDS[op.name]); }
export function applyDefaultBuild(member){ const op=operators.find(o=>o.id===member.operatorId); const b=op&&DEFAULT_BUILDS[op.name]; if(!b) return false; const w=byName(weapons,b.weapon); const g=b.gear.map(n=>byName(gear,n)); if(!w||g.some(x=>!x)) return false;
  member.weapon={id:w.id,potential:0,substrate:[6,6,3],ranks:[9,9,4]}; member.gear={armor:{id:g[0].id,refine:[3,3,3]},gloves:{id:g[1].id,refine:[3,3,3]},kit1:{id:g[2].id,refine:[3,3,3]},kit2:{id:g[3].id,refine:[3,3,3]}}; member.buildSource='default'; return true; }
export function buildStatus(member){ const any=member.weapon?.id||Object.values(member.gear||{}).some(x=>x?.id); if(!any) return {kind:'none',label:'未配装'}; return member.buildSource==='default'?{kind:'default',label:'默认配装'}:{kind:'custom',label:'已自定义'}; }
export function defaultState(){ return {version:STATE_VERSION,team:[regressionMember(),null,null,null],active:0,mainControl:0,rot:defaultRot(),savedTeams:[],
  enemy:{defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}},critMode:'never',options:{artsStrength:0,combo:0,stagger:0,reduction:0},
  selection:{kind:'segment',skillKey:'combo',segmentId:'combo2'},vars:{layers:4,abnormal:1,mechElement:'cold'},
  buffs:{unified:{toggles:{},stacks:{},overrides:{}},perSegment:{}},buffTab:'unified',buffFilter:'',snapshots:[],ui:{folds:{}}}; }
export const clone=x=>JSON.parse(JSON.stringify(x));
export function weaponPotentialToRank(p){ return 4+Math.max(0,Math.min(5,Number(p)||0)); }
export function rankToWeaponPotential(r){ return Math.max(0,Math.min(5,(Number(r)||4)-4)); }

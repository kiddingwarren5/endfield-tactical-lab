// UI state: defaults, member factory, (de)serialization. Engine never reads DOM; UI never computes damage itself.
import operators from '../data/operators.js'; import weapons from '../data/weapons.js'; import gear from '../data/gear.js'; import sets from '../data/sets.js'; import effects from '../data/effects.js'; import mechanics from '../data/mechanics.js'; import rotations from '../data/rotations.js'; import {DEFAULT_BUILDS} from '../data/builds.js';
import {buildGraph} from '../engine/graph.js'; import {defaultBuildFor} from '../engine/defaultBuild.js';
export const STATE_VERSION=4;
const byName=(arr,n)=>arr.find(x=>x.name===n);
export function newMember(operatorId){ const op=operators.find(o=>o.id===operatorId); return {operatorId,potential:0,skillRanks:{normal:12,skill:12,combo:12,ultimate:12},mode:'auto',weapon:{id:null,potential:0,substrate:[6,6,3],ranks:[9,9,4]},gear:{armor:{id:null,refine:[3,3,3]},gloves:{id:null,refine:[3,3,3]},kit1:{id:null,refine:[3,3,3]},kit2:{id:null,refine:[3,3,3]}},consumables:[],buffs:{}}; }
export function regressionMember(){ // 别礼样例（交接 Demo）
  const m=newMember(byName(operators,'别礼').id); m.weapon.id=byName(weapons,'赫拉芬格').id;
  applyDefaultBuild(m); return m; }
export const ENEMY_DEFAULT={defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{},attackInterval:4}; // 对照靶默认值；attackInterval 敌人每隔几秒攻击主控（0 = 不攻击）
export function defaultRot(){ return {scenario:'target',enemy:clone(ENEMY_DEFAULT),auto:{beam:6,horizon:60},advanced:false}; }
export function ensureRot(s){ if(!s.rot) s.rot=defaultRot(); if(!s.rot.enemy) s.rot.enemy=clone(ENEMY_DEFAULT); if(!s.rot.auto) s.rot.auto={beam:6,horizon:60}; if(!s.rot.scenario) s.rot.scenario='target'; if(s.rot.enemy.attackInterval==null) s.rot.enemy.attackInterval=ENEMY_DEFAULT.attackInterval; return s.rot; }
let graph=null; const graphOf=()=>graph||(graph=buildGraph({operators,weapons,gear,sets,effects,mechanics}));
// 配装方案：内置表里有的按表（可多套，第 0 套默认），没有的只有一套“通用规则”（engine/defaultBuild.js）
export function schemesOf(op){ const list=DEFAULT_BUILDS[op?.name]||[]; return list.length?list:[{name:'通用规则',generic:true}]; }
function defaultPieces(op,k=0){ const list=schemesOf(op); const s=list[k]||list[0]; if(s.generic) return defaultBuildFor(op,{weapons,gear,effects},graphOf()); const w=byName(weapons,s.weapon); const g=s.gear.map(n=>byName(gear,n)); return w&&!g.some(x=>!x)?{weapon:w,gear:g}:null; }
export function hasDefaultBuild(member){ const op=operators.find(o=>o.id===member?.operatorId); return Boolean(op&&defaultPieces(op)); }
export function applyDefaultBuild(member,k=0){ const op=operators.find(o=>o.id===member.operatorId); const b=op&&defaultPieces(op,k); if(!b) return false; const w=b.weapon, g=b.gear;
  member.weapon={id:w.id,potential:0,substrate:[6,6,3],ranks:[9,9,4]}; member.gear={armor:{id:g[0].id,refine:[3,3,3]},gloves:{id:g[1].id,refine:[3,3,3]},kit1:{id:g[2].id,refine:[3,3,3]},kit2:{id:g[3].id,refine:[3,3,3]}}; member.buildSource='default'; member.buildScheme=k; return true; }
// 旧版本存下来的队员可能没配装也没标“已自定义”，补上默认配装
export function ensureBuilds(state){ for(const m of state.team||[]){ if(m&&m.buildSource!=='custom'&&!m.weapon?.id&&!Object.values(m.gear||{}).some(x=>x?.id)) applyDefaultBuild(m); } }
export function exampleTeam(){ const t=rotations[0].team; const team=t.members.map(m=>{ const nm=newMember(byName(operators,m.op).id); applyDefaultBuild(nm); nm.potential=m.potential||0; return nm; }); return {team,mainControl:Math.max(0,t.members.findIndex(m=>m.op===t.mainControl))}; }
export function buildStatus(member){ const any=member.weapon?.id||Object.values(member.gear||{}).some(x=>x?.id); if(!any) return {kind:'none',label:'未配装'}; if(member.buildSource!=='default') return {kind:'custom',label:'已自定义'}; const list=schemesOf(operators.find(o=>o.id===member.operatorId)); const s=list[member.buildScheme||0]; return {kind:'default',label:'默认配装',scheme:list.length>1&&s?s.name:''}; }
export function defaultState(){ const ex=exampleTeam(); return {version:STATE_VERSION,team:ex.team,active:ex.mainControl,mainControl:ex.mainControl,rot:defaultRot(),savedTeams:[],ui:{folds:{}}}; }
export const clone=x=>JSON.parse(JSON.stringify(x));
export function weaponPotentialToRank(p){ return 4+Math.max(0,Math.min(5,Number(p)||0)); }
export function rankToWeaponPotential(r){ return Math.max(0,Math.min(5,(Number(r)||4)-4)); }

// 整条轴复现：把一场 zmdlogs 日志的施放序列喂给模拟器（解包时序），按干员、按技能种类、按每次施放对比技能伤害。
// 用法：node tools/log_sim_replay.mjs <日志id后6位> [--sp 300] [--energy 300] [--default-timing]
import {loadData,loadLogs,enemyOf,memberOf,norm} from './zmd_common.mjs';
const argv=process.argv.slice(2); const want=argv.find(a=>!a.startsWith('--'))||'ed2ab0'; const opt=k=>argv.includes(k)?argv[argv.indexOf(k)+1]:null;
const data=await loadData(); const {simulate}=await import('../dist/engine/sim/simulate.js'); const logs=loadLogs();
const [bid,{battle,events}]=Object.entries(logs).find(([k])=>k.endsWith(want)); const enemy=await enemyOf(battle.bossKey);
const members=battle.roster.map(r=>memberOf(r,data)); if(members.some(m=>!m)) throw new Error('roster 有未知干员');
const idx=Object.fromEntries(members.map((m,i)=>[m.name,i]));
// 主控：重击（attack5 / power_attack / attack4）带失衡值最多的人
const heavy={}; for(const e of events) if(/_(attack5|power_attack|attack4)$/.test(e.eventKey||'')&&e.poiseDamage) heavy[e.sourceCharacterName]=(heavy[e.sourceCharacterName]||0)+1;
const mainName=Object.entries(heavy).sort((a,b)=>b[1]-a[1])[0]?.[0]; const mainControl=mainName?idx[mainName]:0;
// 每次施放：同一干员、同一种类的命中按时间聚类（间隔 >1.5 s 分开）；机制伤害（buff_*、笔意爆发）不算施放
const kindOf=k=>/ultimate_skill/.test(k)?'ultimate':/combo_skill/.test(k)?'combo':/normal_skill/.test(k)?'skill':null;
const isMech=k=>/cryst_triggered/.test(k); /* 寒冷爆发是机制伤害；笔意爆发（inkmove）、幻影追击（phantom）、囹圄爆炸（seal_total）按来源技能归类 */
const kindOfKey=k=>/phantom|inkmove|inkmark|inboom|normal_skill/.test(k)?'skill':/seal_total|combo_skill/.test(k)?'combo':/ultimate_skill/.test(k)?'ultimate':null;
const hits=events.filter(e=>e.laneType==='skill'&&e.value!=null).sort((a,b)=>a.tsMsFromStart-b.tsMsFromStart);
const casts=[]; for(const e of hits){ if(isMech(e.eventKey)) continue; const kind=kindOfKey(e.eventKey); if(!kind) continue; const m=idx[e.sourceCharacterName]; if(m==null) continue; const t=e.tsMsFromStart/1000; const tick=/projhit|inkmove|inkmark|inboom|seal_total|phantom|laser/.test(e.eventKey); /* 子实体的跳伤（水龙卷、墨龙、笔意爆发等）并回最近一次同种类施放，不另起一次 */ let c=casts.find(c=>c.member===m&&c.kind===kind&&(tick?t-c.first<=25:t-c.last<=1.5)); if(!c){ c={member:m,name:e.sourceCharacterName,kind,first:t,last:t,sum:0,n:0,keys:new Set()}; casts.push(c); } c.last=t; c.sum+=norm(e); c.n++; c.keys.add(e.eventKey.replace(/^chr_\d+_[a-z]+_/,'')); }
const markers=events.filter(e=>e.laneType==='skill'&&e.value==null).map(e=>({t:e.tsMsFromStart/1000,member:idx[e.sourceCharacterName],kind:kindOf(e.eventKey)}));
const ake=data.timing.byOperator||{}; const useAke=!argv.includes('--default-timing');
const hitDelay=(m,kind)=>{ const c=useAke?ake[members[m].op.id]?.cast?.[kind]:null; if(c?.hitFrames?.length) return c.hitFrames[0]/30; const cs=c?.seconds??data.timing.castSeconds[kind]; return cs*(kind==='ultimate'?0.8:0.6); };
for(const c of casts){ const mk=markers.find(x=>x.member===c.member&&x.kind===c.kind&&x.t<=c.first+0.05&&x.t>=c.first-4); c.t=mk?mk.t:+(c.first-hitDelay(c.member,c.kind)).toFixed(3); c.from=mk?'标记':'首击回推'; }
casts.sort((a,b)=>a.t-b.t);
const timeline=casts.map(c=>({t:Math.max(0,c.t),member:c.member,kind:c.kind}));
const sp=+(opt('--sp')??300), energy=+(opt('--energy')??300); const duration=Math.ceil(battle.durationMs/1000)+1;
const r=simulate({team:members.map(m=>m.member),data,mechanics:data.mechanics,timing:data.timing,enemy,mainControl,initial:{sp,energy:members.map(()=>energy)},timeline,params:{duration,controlUptime:1,timingSource:useAke?'akedata':undefined,mainAutoNormal:true,planRepair:+(opt('--repair')??6)},options:{}});
console.log(`== ${bid} ${battle.bossName} ${battle.durationMs/1000}s 主控 ${mainName||members[0].name} 敌人 def${enemy.defence} ${JSON.stringify(enemy.custom)}${enemy.assumed?'（敌人表缺失）':''} 时序 ${useAke?'解包':'默认'} 初始 sp${sp} 能量${energy}`);
const errs=r.events.filter(e=>e.type==='error'||e.type==='planSkip'); console.log(`施放 ${timeline.length} 次（不可行时最多顺延 ${+(opt('--repair')??6)} s），报错/放弃 ${errs.length}：`); for(const e of errs) console.log(`   ${e.t.toFixed(2)}s ${e.type} ${e.message||JSON.stringify(e).slice(0,120)}`);
const castEv=r.events.filter(e=>e.type==='cast'); const actualT=(m,kind,t0)=>castEv.find(e=>e.who===members[m].name&&e.kind===kind&&e.t>=t0-0.01)?.t;
if(argv.includes('--dump-sim')){ const cats={}; for(const h of r.hits){ const k=`${h.name} skill=${h.skill} kind=${h.kind} seg=${h.segment}`; cats[k]=(cats[k]||0)+1; } console.log('模拟命中类别：'); for(const [k,v] of Object.entries(cats)) console.log('   ',k,v); }
// 每次施放对比：模拟器里该干员该种类、施放时刻之后首个命中簇
const simHits=r.hits.filter(h=>['skill','combo','ultimate'].includes(h.skill)); const simMech=r.hits.filter(h=>h.skill==='mech'||h.kind==='mech');
console.log('\n时刻 | 干员 | 种类 | 来源 | 日志命中数 日志合计 | 模拟命中数 模拟合计 | 模拟/日志');
let totLog=0,totSim=0; const perMember={};
for(const c of casts){ c.actual=actualT(c.member,c.kind,c.t); const nextC=casts.find(x=>x.member===c.member&&x.kind===c.kind&&x.t>c.t); const next=nextC?(actualT(nextC.member,nextC.kind,nextC.t)??nextC.t):Infinity; const t0=c.actual??c.t; const sh=simHits.filter(h=>h.member===c.member&&h.skill===c.kind&&h.t>=t0-0.01&&h.t<next); const s=sh.reduce((a,h)=>a+h.damage,0); totLog+=c.sum; totSim+=s; const pm=perMember[c.name]??={log:0,sim:0}; pm.log+=c.sum; pm.sim+=s;
  console.log(`${c.t.toFixed(2).padStart(6)}${c.actual!=null&&Math.abs(c.actual-c.t)>0.05?'→'+c.actual.toFixed(2):'      '} | ${c.name.padEnd(3)} | ${c.kind.padEnd(8)} | ${c.from} | ${String(c.n).padStart(3)} ${Math.round(c.sum).toString().padStart(8)} | ${String(sh.length).padStart(3)} ${Math.round(s).toString().padStart(8)} | ${s?(s/c.sum).toFixed(3):'-'}  [${[...c.keys].join(',')}]`); }
console.log('\n按干员（技能伤害，不含普攻与机制）：'); for(const [n,v] of Object.entries(perMember)) console.log(`   ${n.padEnd(3)} 日志 ${Math.round(v.log).toString().padStart(8)} 模拟 ${Math.round(v.sim).toString().padStart(8)} 模拟/日志 ${(v.sim/v.log).toFixed(3)}`);
console.log(`   合计 日志 ${Math.round(totLog)} 模拟 ${Math.round(totSim)} 模拟/日志 ${(totSim/totLog).toFixed(3)}`);
const logMech=hits.filter(e=>/cryst_triggered/.test(e.eventKey)).reduce((a,e)=>a+norm(e),0); console.log(`   寒冷爆发 日志 ${Math.round(logMech)}（${hits.filter(e=>/cryst_triggered/.test(e.eventKey)).length} 次） 模拟 ${Math.round(simMech.reduce((a,h)=>a+h.damage,0))}（${simMech.length} 次）`);
const simNormal=r.hits.filter(h=>h.kind==='normal'); console.log(`   模拟普攻 ${simNormal.length} 次 ${Math.round(simNormal.reduce((a,h)=>a+h.damage,0))}（日志只记部分普攻，不比）`);

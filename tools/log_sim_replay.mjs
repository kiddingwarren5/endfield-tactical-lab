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
const casts=[]; for(const e of hits){ if(isMech(e.eventKey)) continue; const kind=kindOfKey(e.eventKey); if(!kind) continue; const m=idx[e.sourceCharacterName]; if(m==null) continue; const t=e.tsMsFromStart/1000; const k=e.eventKey; const tickWin=/inkmove|inkmark|inboom/.test(k)?25:/phantom/.test(k)?16:/projhit|laser/.test(k)?8:/seal_total/.test(k)?8:0; /* 只用于把子实体的跳伤归到它的施放，不是模拟参数。窗口取解包里该子实体的最长存活：笔意 20 s（SkillPatch duration）+ 弹道 → 25；幻影 15 s 灌注窗（normal_skill duration 15）→ 16；水龙卷 3 s（water_projhit 90 帧）+ 施放 → 8；囹圄 4/6 s → 8 */ let c=casts.find(c=>c.member===m&&c.kind===kind&&(tickWin?t-c.first<=tickWin:t-c.last<=1.5)); /* 1.5 s：同一次施放内相邻命中的最大间隔，解包里多段技能的段间最长是别礼终结技 29 帧 0.97 s */ if(!c){ c={member:m,name:e.sourceCharacterName,kind,first:t,last:t,sum:0,n:0,keys:new Set()}; casts.push(c); } c.last=t; c.sum+=norm(e); c.n++; c.keys.add(e.eventKey.replace(/^chr_\d+_[a-z]+_/,'')); }
const markers=events.filter(e=>e.laneType==='skill'&&e.value==null).map(e=>({t:e.tsMsFromStart/1000,member:idx[e.sourceCharacterName],kind:kindOf(e.eventKey)}));
const ake=data.timing.byOperator||{}; const useAke=!argv.includes('--default-timing');
const hitDelay=(m,kind)=>{ const c=useAke?ake[members[m].op.id]?.cast?.[kind]:null; if(c?.hitFrames?.length) return c.hitFrames[0]/30; const cs=c?.seconds??data.timing.castSeconds[kind]; return cs*(kind==='ultimate'?0.8:0.6); };
// 没有命中的施放标记（起墨 / 收笔、未记录命中的技能）也算一次施放
for(const m of markers){ if(m.kind==null||m.member==null) continue; const hit=casts.some(c=>c.member===m.member&&c.kind===m.kind&&m.t<=c.first+0.05&&m.t>=c.first-4); if(!hit) casts.push({member:m.member,name:members[m.member].name,kind:m.kind,first:m.t,last:m.t,sum:0,n:0,keys:new Set(['（无命中）']),markerOnly:true}); }
for(const c of casts){ const mk=markers.find(x=>x.member===c.member&&x.kind===c.kind&&x.t<=c.first+0.05&&x.t>=c.first-4); /* 施放标记在首击前 4 s 内才认：解包里施放到首击最长的是祀终结技（63 帧 2.1 s）与别礼终结技（86 帧 2.87 s），留出切人余量 */ c.t=mk?mk.t:+(c.first-hitDelay(c.member,c.kind)).toFixed(3); c.from=mk?'标记':'首击回推'; }
casts.sort((a,b)=>a.t-b.t);
// 祀战技三段：日志标记只有 normal_skill 一个键。有 abilityrange_1 命中的是河山共影；没有命中、1.5 s 内跟着笔意爆发（inkmove）的是收笔（解包：爆发只在收笔或笔意自然结束时发生）；起墨没有记录，按解包 normal_skill_1 的独占时长 1.0 s 放在收笔前。
const inferred=[]; for(const c of casts){ if(c.name!=='祀'||c.kind!=='skill') continue; const hasHit=[...c.keys].some(k=>/abilityrange_1/.test(k)); const burstSoon=hits.some(e=>e.sourceCharacterName==='祀'&&/inkmove/.test(e.eventKey)&&e.tsMsFromStart/1000>c.t&&e.tsMsFromStart/1000<=c.t+1.5); if(!hasHit&&burstSoon){ c.stage='收笔'; inferred.push({member:c.member,kind:'skill',t:+(c.t-1.0).toFixed(3),name:'祀',stage:'起墨（推断）',from:'推断',first:c.t-1.0,sum:0,n:0,keys:new Set(['起墨']),inferred:true}); } else if(hasHit) c.stage='河山共影'; }
for(const x of inferred) casts.push(x); casts.sort((a,b)=>a.t-b.t);
// 日志时间 → 模拟时间：日志的计时在终结技演出（时停）期间不走（证据：别礼连携首击后 0.06 s 就有终结技首击，而解包终结技首击在演出结束后一帧；祀终结技标记到首跳 0.10–0.28 s = 首跳帧 63 − 演出 58 帧）。模拟器里演出占真实时间，所以每放一次终结技，之后的施放时刻都要加上该终结技的演出时长。
const cutOf=m=>{ const c=useAke?ake[members[m].op.id]?.cast?.ultimate:null; return c?(c.cutscene??0):data.timing.castSeconds.ultimate; };
let shift=0; const timeline=[]; for(const c of casts){ timeline.push({t:Math.max(0,c.t+shift),member:c.member,kind:c.kind}); c.simT=Math.max(0,c.t+shift); if(c.kind==='ultimate') shift+=cutOf(c.member); }
const duration=Math.ceil(battle.durationMs/1000+shift)+2; /* 模拟时长 = 日志时长 + 全部演出位移 + 余量 */
const sp=+(opt('--sp')??300), energy=+(opt('--energy')??300);
const r=simulate({team:members.map(m=>m.member),data,mechanics:data.mechanics,timing:data.timing,enemy,mainControl,initial:{sp,energy:members.map(()=>energy)},timeline,params:{duration,controlUptime:1,timingSource:useAke?'akedata':undefined,mainAutoNormal:true,planRepair:+(opt('--repair')??6)},options:{}});
console.log(`== ${bid} ${battle.bossName} ${battle.durationMs/1000}s 主控 ${mainName||members[0].name} 敌人 def${enemy.defence} ${JSON.stringify(enemy.custom)}${enemy.assumed?'（敌人表缺失）':''} 时序 ${useAke?'解包':'默认'} 初始 sp${sp} 能量${energy}`);
const errs=r.events.filter(e=>e.type==='error'||e.type==='planSkip'); console.log(`施放 ${timeline.length} 次（不可行时最多顺延 ${+(opt('--repair')??6)} s），报错/放弃 ${errs.length}：`); for(const e of errs) console.log(`   ${e.t.toFixed(2)}s ${e.type} ${e.message||JSON.stringify(e).slice(0,120)}`);
const castEv=r.events.filter(e=>e.type==='cast'); const actualT=(m,kind,t0)=>castEv.find(e=>e.who===members[m].name&&e.kind===kind&&e.t>=t0-0.01)?.t;
if(argv.includes('--events')){ for(const e of r.events.filter(e=>['attach','consumeAttach','comboReady','burst','abnormal','planSkip','cast'].includes(e.type))) console.log(`   ${e.t.toFixed(2)} ${e.type} ${e.who||''} ${e.kind||''} ${e.element||''} ${e.layers??''} ${e.via||e.by||''} ${e.message||''}`); }
if(argv.includes('--dump-hits')){ const [who,kind]=argv[argv.indexOf('--dump-hits')+1].split(':'); for(const h of r.hits.filter(h=>h.name===who&&(!kind||h.skill===kind))) console.log(`   ${h.t.toFixed(2)} ${h.skill}/${h.segment} ${Math.round(h.damage)} 倍率${(h.factors?.ratio*100).toFixed(0)} 攻${h.factors?.attack} 增${h.factors?.bonus?.toFixed(2)} 幅${h.factors?.amp?.toFixed(2)} 脆${h.factors?.fragile?.toFixed(2)} 易${h.factors?.vulnerable?.toFixed(2)} vars=${JSON.stringify(h.vars||'')} 应用=${(h.applied||[]).map(a=>a.id||a.label).join('|').slice(0,160)}`); }
if(argv.includes('--dump-sim')){ const cats={}; for(const h of r.hits){ const k=`${h.name} skill=${h.skill} kind=${h.kind} seg=${h.segment}`; cats[k]=(cats[k]||0)+1; } console.log('模拟命中类别：'); for(const [k,v] of Object.entries(cats)) console.log('   ',k,v); }
// 每次施放对比：两侧都按"施放簇"归并后按顺序配对（模拟侧施放时刻可能被顺延）
const simCasts=castEv.filter(e=>['skill','combo','ultimate'].includes(e.kind)).map(e=>({member:idx[e.who],kind:e.kind,t:e.t,hits:[]}));
for(const h of r.hits.filter(h=>['skill','combo','ultimate'].includes(h.skill))){ const cands=simCasts.filter(c=>c.member===h.member&&c.kind===h.skill&&c.t<=h.t+0.001); let c=cands.at(-1); if(h.segment==='ink'){ c=cands.find(c=>h.t-c.t<=25)||c; } if(c) c.hits.push(h); }
const simTotal=r.hits.filter(h=>['skill','combo','ultimate'].includes(h.skill)).length, simAssigned=simCasts.reduce((a,c)=>a+c.hits.length,0); if(simAssigned!==simTotal) console.log(`注意：模拟命中 ${simTotal} 个，归到施放的 ${simAssigned} 个`);
const simHits=r.hits.filter(h=>['skill','combo','ultimate'].includes(h.skill)); const simMech=r.hits.filter(h=>h.skill==='mech'||h.kind==='mech');
console.log('\n时刻 | 干员 | 种类 | 来源 | 日志命中数 日志合计 | 模拟命中数 模拟合计 | 模拟/日志');
let totLog=0,totSim=0; const perMember={};
const used=new Set(); /* 配对按顺序；表里的时刻是日志时间，→ 后是模拟器实际施放时刻（含演出位移）与计划不符时才显示 */ for(const c of casts){ const ord=casts.filter(x=>x.member===c.member&&x.kind===c.kind).indexOf(c); const sc=simCasts.filter(x=>x.member===c.member&&x.kind===c.kind)[ord]; c.actual=sc?.t; if(sc) used.add(sc); const sh=sc?sc.hits:[]; const s=sh.reduce((a,h)=>a+h.damage,0); totLog+=c.sum; totSim+=s; const pm=perMember[c.name]??={log:0,sim:0}; pm.log+=c.sum; pm.sim+=s;
  console.log(`${c.t.toFixed(2).padStart(6)}${c.actual!=null&&Math.abs(c.actual-c.simT)>0.05?'→'+c.actual.toFixed(2):'      '} | ${c.name.padEnd(3)} | ${(c.kind+(c.stage?'·'+c.stage:'')).padEnd(12)} | ${c.from} | ${String(c.n).padStart(3)} ${Math.round(c.sum).toString().padStart(8)} | ${String(sh.length).padStart(3)} ${Math.round(s).toString().padStart(8)} | ${s?(s/c.sum).toFixed(3):'-'}  [${[...c.keys].join(',')}]`); }
console.log('\n按干员（技能伤害，不含普攻与机制）：'); for(const [n,v] of Object.entries(perMember)) console.log(`   ${n.padEnd(3)} 日志 ${Math.round(v.log).toString().padStart(8)} 模拟 ${Math.round(v.sim).toString().padStart(8)} 模拟/日志 ${(v.sim/v.log).toFixed(3)}`);
console.log(`   合计 日志 ${Math.round(totLog)} 模拟 ${Math.round(totSim)} 模拟/日志 ${(totSim/totLog).toFixed(3)}`);
const logMech=hits.filter(e=>/cryst_triggered/.test(e.eventKey)).reduce((a,e)=>a+norm(e),0); const extra=simCasts.filter(c=>!used.has(c)&&c.hits.length); if(extra.length) console.log('模拟里多出的施放（日志无对应）：'+extra.map(c=>`${members[c.member].name} ${c.kind}@${c.t.toFixed(2)} ${Math.round(c.hits.reduce((a,h)=>a+h.damage,0))}`).join('；'));
console.log(`   寒冷爆发 日志 ${Math.round(logMech)}（${hits.filter(e=>/cryst_triggered/.test(e.eventKey)).length} 次） 模拟 ${Math.round(simMech.reduce((a,h)=>a+h.damage,0))}（${simMech.length} 次）`);
const simNormal=r.hits.filter(h=>h.kind==='normal'); console.log(`   模拟普攻 ${simNormal.length} 次 ${Math.round(simNormal.reduce((a,h)=>a+h.damage,0))}（日志只记部分普攻，不比）`);

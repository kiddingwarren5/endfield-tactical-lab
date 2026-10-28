// 预设排轴（一图流）回归：每条预设都能在模拟器里按最早可行时刻排出、无不可执行动作、周期完整；主轴每次别礼连携都吃 4 层。同时生成 docs/rotations.md。
import {test} from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js'; import meta from '../dist/data/meta.js';
import rotations,{scenarios} from '../dist/data/rotations.js'; import {resolveRotation,rotationText,sumHits} from '../dist/engine/sim/rotation.js';
const ctx={data:{operators,weapons,gear,sets,effects},mechanics,timing,enemy:{defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}}};
const fmt=n=>Math.round(n).toLocaleString('zh-CN');
const results={}; const scen={};
for(const preset of rotations){
  test(`预设 ${preset.name}`,()=>{ const t0=Date.now(); const r=resolveRotation(preset,ctx); r.ms=Date.now()-t0; results[preset.id]=r;
    if(preset===rotations[0]) assert.deepEqual(r.notes,[],'主轴所有步骤都应能安排'); else if(r.notes.length) console.log(`[提示] ${preset.name}：${r.notes.join('；')}`);
    assert.equal(r.timeline.length+r.skipped.length,preset.steps.length);
    assert.deepEqual(r.main.errors,[],'复现时不应有不可执行动作');
    assert.ok(r.cycle.complete,'周期应完整（全员各放一次终结技）');
    const consumes=r.main.events.filter(e=>e.type==='consume');
    for(const a of r.timeline){ const s=preset.steps[a.step]; if(s.wait){ const c=consumes.find(e=>Math.abs(e.t-a.t)<2e-3); assert.ok(c&&c.layers>=s.wait,`${a.t}s ${s.m} 连携应消耗 ≥${s.wait} 层`); } }
    assert.ok(Math.abs(r.main.hits.reduce((a,h)=>a+h.damage,0)-r.main.summary.total)<1e-6);
  });
}
for(const sc of scenarios){
  test(`主轴 × 场景 ${sc.name}`,()=>{ const r=resolveRotation(rotations[0],ctx,sc,true); scen[sc.id]=r; if(sc===scenarios[0]) assert.deepEqual(r.notes,[]); else if(r.notes.length) console.log(`[提示] ${sc.name}：${r.notes.join('；')}`); assert.deepEqual(r.main.errors,[]); assert.equal(r.timeline.length+r.skipped.length,r.steps.length); if(!sc.timeLimit) assert.ok(r.cycle.complete); });
}
test('写出 docs/rotations.md',()=>{
  const KIND={skill:'战技',combo:'连携技',ultimate:'终结技'}; const L=[];
  L.push(`# 预设排轴（一图流文字版）\n\n生成：${new Date().toISOString()} · 数据 ${meta.dataVersion} · 由 tests/rotations.test.mjs 生成（可复现）。网页版见“排轴一图流”页签。\n\n对照靶：防御 100、抗性 0、不暴击、永不失衡；全员 90 级、技能专精 3；基准 δ=${timing.nonControl.default.damageFactor}、φ=${timing.nonControl.default.rhythmFactor}，区间为 δ∈[${timing.nonControl.damageFactor}]、φ∈[${timing.nonControl.rhythmFactor}]。时刻 = 模拟器给出的最早可行时刻（greedySchedule），不是实机录制。\n`);
  for(const preset of rotations){ const r=results[preset.id]; if(!r) continue; const end=r.cycle.end; const mc=r.input.mainControl; const total=sumHits(r.main,{until:end}), lo=sumHits(r.lo,{until:end}), hi=sumHits(r.hi,{until:end}), sure=sumHits(r.main,{until:end,mainControl:mc,guaranteed:true});
    L.push(`## ${preset.name}\n\n${preset.summary}\n\n编队（01–04 号位）：${preset.team.members.map(m=>`${m.op}（${m.weapon}，潜 ${m.potential}）`).join(' / ')}；主控 ${preset.team.mainControl}；初始技力 ${preset.team.initial.sp}。\n\n周期 ${end.toFixed(1)} s（全员各一次终结技）· **保底总伤 ${fmt(sure)}（每秒 ${fmt(sure/end)}）**：主控普攻 + 全员战技/连携/终结技，不计副控自动普攻 · 含副控普攻 ${fmt(total)}（每秒 ${fmt(total/end)}，区间 ${fmt(lo)}–${fmt(hi)}）· 排程耗时 ${r.ms} ms\n`);
    L.push('| # | 时刻 | 节 | 干员 | 动作 | 目的 | 技力 | 寒冷层 | 能量（诀/别礼/汤汤/祀） |\n|---|---|---|---|---|---|---|---|---|');
    r.timeline.forEach((a,i)=>{ const s=r.steps[a.step], st=r.states[i]; L.push(`| ${i+1} | ${a.t.toFixed(1)}s | ${s.seg} | ${r.names[a.member]} | ${KIND[a.kind]}${s.stage?'「'+s.stage+'」':''}${s.wait?`（等 ${s.wait} 层）`:''} | ${s.why}${st.consumed?`（实际消耗 ${st.consumed} 层）`:''} | ${st.sp==null?'':Math.round(st.sp)} | ${st.cold} | ${st.energy?st.energy.map(Math.round).join('/'):''} |`); });
    L.push(`\n来源：${preset.sources.join('；')}\n\n待实机验证：${preset.verify.join('；')}\n`);
  }
  L.push('## Boss / 场景调轴（主轴）\n\n| 场景 | 口径 | 保底总伤 | 保底每秒 | 含副控普攻每秒 | 顺序 |\n|---|---|---|---|---|---|');
  for(const sc of scenarios){ const r=scen[sc.id]; if(!r) continue; const end=r.end; const sure=sumHits(r.main,{until:end,mainControl:r.input.mainControl,guaranteed:true}), tot=sumHits(r.main,{until:end}); L.push(`| ${sc.name} | ${sc.timeLimit?`限时 ${end} s`:`周期 ${end.toFixed(1)} s`} | ${fmt(sure)} | ${fmt(sure/end)} | ${fmt(tot/end)} | ${r.timeline.map(a=>`${a.t}s ${r.names[a.member]}${({skill:'战技',combo:'连携',ultimate:'终结技'})[a.kind]}`).join(' → ')} |`); L.push(`\n${sc.desc} 要点：${sc.tips.join('；')}\n`); }
  fs.writeFileSync('docs/rotations.md',L.join('\n'));
});

// 标答对照：自动排轴（任意编队同一流程）在重点编队上不应明显低于推荐主轴；比值写入 docs/rotations.md 末尾
import {autoRotation,buildTeam} from '../dist/engine/sim/rotation.js';
test('自动排轴 vs 标答（重点编队）',()=>{
  const team=buildTeam(rotations[0],ctx.data); const mc=1; const t0=Date.now();
  const auto=autoRotation(team,mc,ctx,scenarios[0],{beam:6,step:1,horizon:80}); const ms=Date.now()-t0;
  const ref=results[rotations[0].id]; const refS=sumHits(ref.main,{until:ref.end,mainControl:mc,guaranteed:true})/ref.end; const autoS=sumHits(auto.main,{until:auto.end,mainControl:mc,guaranteed:true})/auto.end;
  assert.deepEqual(auto.main.errors,[]); assert.ok(auto.cycle.complete,'自动轴周期应完整');
  const ratio=autoS/refS; fs.appendFileSync('docs/rotations.md',`\n## 标答对照（自动排轴 vs 推荐主轴，常规对照靶）\n\n自动排轴（束搜索热启动 → 模拟退火 / MCTS→退火 两条路线取优，${auto.plan?.improved?.method||''}，${ms} ms）：周期 ${auto.end.toFixed(1)} s，保底每秒 ${fmt(autoS)}；推荐主轴保底每秒 ${fmt(refS)}；比值 ${(ratio*100).toFixed(1)}%。\n\n自动轴：${auto.timeline.map(a=>`${a.t}s ${auto.names[a.member]}${({skill:'战技',combo:'连携',ultimate:'终结技'})[a.kind]}`).join(' → ')}\n`);
  assert.ok(ratio>0.85,`自动排轴保底每秒应不低于标答的 85%，实际 ${(ratio*100).toFixed(1)}%`);
});

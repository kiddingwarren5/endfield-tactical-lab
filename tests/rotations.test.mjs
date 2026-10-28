// 预设排轴（一图流）回归：每条预设都能在模拟器里按最早可行时刻排出、无不可执行动作、周期完整；主轴每次别礼连携都吃 4 层。同时生成 docs/rotations.md。
import {test} from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
import operators from '../dist/data/operators.js'; import weapons from '../dist/data/weapons.js'; import gear from '../dist/data/gear.js'; import sets from '../dist/data/sets.js'; import effects from '../dist/data/effects.js'; import timing from '../dist/data/timing.js'; import mechanics from '../dist/data/mechanics.js'; import meta from '../dist/data/meta.js';
import rotations from '../dist/data/rotations.js'; import {resolveRotation,rotationText} from '../dist/engine/sim/rotation.js';
const ctx={data:{operators,weapons,gear,sets,effects},mechanics,timing,enemy:{defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}}};
const fmt=n=>Math.round(n).toLocaleString('zh-CN');
const results={};
for(const preset of rotations){
  test(`预设 ${preset.name}`,()=>{ const t0=Date.now(); const r=resolveRotation(preset,ctx); r.ms=Date.now()-t0; results[preset.id]=r;
    assert.deepEqual(r.notes,[],'所有步骤都应能安排');
    assert.equal(r.timeline.length,preset.steps.length);
    assert.deepEqual(r.main.errors,[],'复现时不应有不可执行动作');
    assert.ok(r.cycle.complete,'周期应完整（全员各放一次终结技）');
    const consumes=r.main.events.filter(e=>e.type==='consume');
    for(const a of r.timeline){ const s=preset.steps[a.step]; if(s.wait){ const c=consumes.find(e=>Math.abs(e.t-a.t)<1e-6); assert.ok(c&&c.layers>=s.wait,`${a.t}s ${s.m} 连携应消耗 ≥${s.wait} 层`); } }
    assert.ok(Math.abs(r.main.hits.reduce((a,h)=>a+h.damage,0)-r.main.summary.total)<1e-6);
  });
}
test('写出 docs/rotations.md',()=>{
  const KIND={skill:'战技',combo:'连携技',ultimate:'终结技'}; const L=[];
  L.push(`# 预设排轴（一图流文字版）\n\n生成：${new Date().toISOString()} · 数据 ${meta.dataVersion} · 由 tests/rotations.test.mjs 生成（可复现）。网页版见“排轴一图流”页签。\n\n对照靶：防御 100、抗性 0、不暴击、永不失衡；全员 90 级、技能专精 3；基准 δ=${timing.nonControl.default.damageFactor}、φ=${timing.nonControl.default.rhythmFactor}，区间为 δ∈[${timing.nonControl.damageFactor}]、φ∈[${timing.nonControl.rhythmFactor}]。时刻 = 模拟器给出的最早可行时刻（greedySchedule），不是实机录制。\n`);
  for(const preset of rotations){ const r=results[preset.id]; if(!r) continue; const end=r.cycle.end; const until=h=>h.t<=end+1e-6; const total=r.main.hits.filter(until).reduce((a,h)=>a+h.damage,0), lo=r.lo.hits.filter(until).reduce((a,h)=>a+h.damage,0), hi=r.hi.hits.filter(until).reduce((a,h)=>a+h.damage,0);
    L.push(`## ${preset.name}\n\n${preset.summary}\n\n编队（01–04 号位）：${preset.team.members.map(m=>`${m.op}（${m.weapon}，潜 ${m.potential}）`).join(' / ')}；主控 ${preset.team.mainControl}；初始技力 ${preset.team.initial.sp}。\n\n周期 ${end.toFixed(1)} s（全员各一次终结技）· 周期内总伤 ${fmt(total)}（区间 ${fmt(lo)}–${fmt(hi)}）· 平均每秒 ${fmt(total/end)} · 排程耗时 ${r.ms} ms\n`);
    L.push('| # | 时刻 | 节 | 干员 | 动作 | 目的 | 技力 | 寒冷层 | 能量（诀/别礼/汤汤/祀） |\n|---|---|---|---|---|---|---|---|---|');
    r.timeline.forEach((a,i)=>{ const s=preset.steps[a.step], st=r.states[i]; L.push(`| ${i+1} | ${a.t.toFixed(1)}s | ${s.seg} | ${r.names[a.member]} | ${KIND[a.kind]}${s.stage?'「'+s.stage+'」':''}${s.wait?`（等 ${s.wait} 层）`:''} | ${s.why}${st.consumed?`（实际消耗 ${st.consumed} 层）`:''} | ${st.sp==null?'':Math.round(st.sp)} | ${st.cold} | ${st.energy?st.energy.map(Math.round).join('/'):''} |`); });
    L.push(`\n来源：${preset.sources.join('；')}\n\n待实机验证：${preset.verify.join('；')}\n`);
  }
  fs.writeFileSync('docs/rotations.md',L.join('\n'));
});

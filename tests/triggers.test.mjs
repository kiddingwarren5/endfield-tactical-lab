// 触发覆盖：效果目录里每个带触发代码的效果都必须在触发表里有归属（事件 / 状态 / 已处理 / 明确未建模），并生成 docs/trigger-coverage.md。
import {test} from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
import effects from '../dist/data/effects.js'; import {triggerCoverage,TRIGGERS} from '../dist/engine/sim/triggers.js';
test('每个触发代码都有归属',()=>{ const rows=triggerCoverage(effects); const unknown=rows.filter(r=>r.kind==='unknown'); assert.deepEqual([...new Set(unknown.map(r=>r.code))],[],'触发表缺失代码');
  assert.deepEqual(rows.filter(r=>r.kind==='unmodeled').map(r=>r.id),[],'不允许“未建模”：每条效果要么执行，要么标明对照靶上不会发生 / 不影响伤害'); const cnt={}; for(const r of rows) cnt[r.kind]=(cnt[r.kind]||0)+1;
  const byReason={}; for(const r of rows) if(r.reason) (byReason[r.reason]=byReason[r.reason]||[]).push(r.id);
  const L=[`# 触发覆盖（由 tests/triggers.test.mjs 生成）\n\n生成：${new Date().toISOString()}\n\n| 归属 | 效果数 |\n|---|---|`,...Object.entries(cnt).map(([k,v])=>`| ${k} | ${v} |`),`\n## 例外与说明汇总（scenario = 对照靶上不会发生；noDamage = 不影响伤害；其余为口径说明）\n`,...Object.entries(byReason).sort((a,b)=>b[1].length-a[1].length).map(([k,v])=>`- ${k}（${v.length}）：${v.slice(0,8).join('、')}${v.length>8?' …':''}`),`\n## 逐条\n\n| 效果 | 代码 | 归属 |\n|---|---|---|`,...rows.map(r=>`| ${r.id} | ${r.code} | ${r.kind}${r.reason?'：'+r.reason:''} |`)];
  fs.writeFileSync('docs/trigger-coverage.md',L.join('\n')); });
test('触发表里没有悬空代码（表有、目录无）',()=>{ const used=new Set(effects.map(e=>e.condition?.trigger).filter(Boolean)); const dangling=Object.keys(TRIGGERS).filter(k=>!used.has(k)&&!used.has('intGeWill&'+k)&&!used.has('willGtInt&'+k)); assert.deepEqual(dangling,[]); });

// 图与模拟器一致性：图里“显式、无前置”的连携来源，在模拟器里必须真的能点亮连携；写出 docs/graph-sim-consistency.md。
import {test} from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
import {buildGraph} from '../dist/engine/graph.js'; import {DATA} from '../tools/validate_graph.mjs'; import {checkGraphSim,consistencyReport} from '../tools/check_graph_sim.mjs';
test('图中无前置的显式连携来源在模拟器里都能点亮',()=>{ const rows=checkGraphSim(buildGraph(DATA)); fs.writeFileSync('docs/graph-sim-consistency.md',consistencyReport(rows)); const bad=rows.filter(r=>r.result==='未点亮'); assert.deepEqual(bad.map(r=>`${r.op} ${r.cond} ← ${r.provider}`),[]); });

// 金标准回归：模拟结果必须与 tests/golden.json 一致（有意改动要重写快照并说明原因）。
import {test} from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
import {goldenRun,goldenDiff} from '../tools/golden.mjs';
test('模拟结果与金标准快照一致',()=>{ const base=JSON.parse(fs.readFileSync('tests/golden.json','utf8')); const d=goldenDiff(base,goldenRun()); assert.deepEqual(d,[]); });

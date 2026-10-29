// 把子代理收集的社区轴 JSON 合并进 sources/curated/rotations-community.json，并校验干员名与动作类型。
// 用法：node tools/merge_rotations.mjs a.json b.json …
import fs from 'node:fs';
const operators=(await import('../dist/data/operators.js')).default; const KINDS=new Set(['skill','combo','ultimate','plunge','switch']);
const target='sources/curated/rotations-community.json'; const cur=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):[]; const errors=[]; const report=[];
for(const f of process.argv.slice(2)){ const arr=JSON.parse(fs.readFileSync(f,'utf8')); for(const r of arr){ const bad=(r.members||[]).filter(n=>!operators.find(o=>o.name===n)); if(bad.length){ errors.push(`${r.name}：干员不存在 ${bad.join('、')}`); continue; } if(!r.members.includes(r.mainControl)){ errors.push(`${r.name}：主控不在编队里`); continue; }
    /* 普攻 / 重击由主控自动打，不是可排的动作：丢掉这类步骤，记进 caveats */
    const auto=(r.steps||[]).filter(s=>s&&['basic','heavy','normal'].includes(s.k)).length; if(auto) r.caveats=(r.caveats?r.caveats+' ':'')+`原文有 ${auto} 步普攻/重击，按主控自动普攻处理未列为动作。`;
    const steps=(r.steps||[]).filter(s=>s&&s.m&&s.k&&!['basic','heavy','normal'].includes(s.k)); const badK=steps.filter(s=>!KINDS.has(s.k)||!r.members.includes(s.m)); if(badK.length){ errors.push(`${r.name}：动作不合法 ${badK.map(s=>s.m+'/'+s.k).join('、')}`); continue; } if(steps.length<4){ errors.push(`${r.name}：轴太短（${steps.length} 步）`); continue; }
    if(cur.some(x=>x.name===r.name)){ report.push(`- ${r.name}：已存在，跳过`); continue; } cur.push({...r,steps}); report.push(`- ${r.name}：${r.members.join('/')}，主控 ${r.mainControl}，${steps.length} 步，来源 ${(r.sources||[]).length}`); } }
if(errors.length) console.error('未合并：\n'+errors.map(e=>' - '+e).join('\n'));
fs.writeFileSync(target,JSON.stringify(cur,null,1)); console.log(report.join('\n')||'（无新增）');

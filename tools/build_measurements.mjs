// Apply user in-game measurements (sources/curated/measurements.json) onto dist/data/timing.js defaults. Null values leave defaults untouched.
import fs from 'node:fs';
const m=JSON.parse(fs.readFileSync('sources/curated/measurements.json','utf8'));
let s=fs.readFileSync('dist/data/timing.js','utf8');
const applied=[];
const set=(re,val,label)=>{ if(val==null) return; if(!re.test(s)) return; s=s.replace(re,val); applied.push(label); };
if(m.nonControl?.damageFactor?.value!=null) set(/default:\{damageFactor:[0-9.]+/,`default:{damageFactor:${m.nonControl.damageFactor.value}`,'nonControl.damageFactor');
if(m.nonControl?.rhythmFactor?.value!=null) set(/rhythmFactor:[0-9.]+\}\}/,`rhythmFactor:${m.nonControl.rhythmFactor.value}}}`,'nonControl.rhythmFactor');
if(m.ultimatePausesTimers?.value!=null) set(/ultimatePausesTimers:(true|false)/,`ultimatePausesTimers:${m.ultimatePausesTimers.value}`,'ultimatePausesTimers');
if(m.comboWindowSeconds?.value!=null) set(/comboWindowSeconds:[0-9.]+/,`comboWindowSeconds:${m.comboWindowSeconds.value}`,'comboWindowSeconds');
if(m.attachDurationSeconds?.value!=null) set(/attachDurationSeconds:[0-9.]+/,`attachDurationSeconds:${m.attachDurationSeconds.value}`,'attachDurationSeconds');
if(m.heavySpRefund?.values&&Object.keys(m.heavySpRefund.values).length){ s=s.replace(/heavySpRefundByName:\{origin:'([^']*)',values:(\{[^}]*\})\}/,(_,o,v)=>{ const obj=Object.assign(JSON.parse(v.replace(/'/g,'"')),m.heavySpRefund.values); applied.push('heavySpRefund'); return `heavySpRefundByName:{origin:'${o} + 用户实测',values:${JSON.stringify(obj)}}`; }); }
if(applied.length){ s=s.replace("origin:'assumed'","origin:'assumed + user measurements ('+"+JSON.stringify(applied.join(','))+"+')'"); fs.writeFileSync('dist/data/timing.js',s); }
console.log('applied measurements:',applied.length?applied.join(', '):'none (all null)');

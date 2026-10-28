// Decoder for Remix single-fetch turbo-stream payloads (first line = loader data).
import fs from 'node:fs';
export function decodeTurbo(text){
  const line=text.split('\n')[0]; const arr=JSON.parse(line);
  const cache=new Map();
  const rec=i=>{ if(typeof i!=='number') return i; if(i<0) return ({'-1':undefined,'-2':undefined,'-3':NaN,'-4':Infinity,'-5':undefined,'-6':-0})[String(i)]; if(cache.has(i)) return cache.get(i);
    const v=arr[i];
    if(v===null||typeof v!=='object'){cache.set(i,v);return v}
    if(Array.isArray(v)){ if(typeof v[0]==='string'&&v.length>=2&&/^[A-Za-z]$/.test(v[0])){ const tag=v[0]; if(tag==='D'){const d=new Date(rec(v[1]));cache.set(i,d);return d} if(tag==='N'){const o={};cache.set(i,o);const src=arr[v[1]];for(const [k,val] of Object.entries(src)){o[k.startsWith('_')?rec(Number(k.slice(1))):k]=rec(val)}return o} const out=v.slice(1).map(rec);cache.set(i,out);return out } const out=[];cache.set(i,out);for(const x of v)out.push(rec(x));return out }
    const out={};cache.set(i,out);for(const [k,val] of Object.entries(v)){const key=k.startsWith('_')?rec(Number(k.slice(1))):k;out[key]=rec(val)}return out };
  return rec(0);
}
if(process.argv[1]&&process.argv[1].endsWith('turbo.mjs')){ const d=decodeTurbo(fs.readFileSync(process.argv[2],'utf8')); const ld=d.loaderData||d; const route=Object.keys(ld).find(k=>k.includes('$slug'))||Object.keys(ld)[0]; const resp=ld[route]?.response||ld[route]; console.log(JSON.stringify(resp,null,1).slice(0,parseInt(process.argv[3]||'3000'))); }

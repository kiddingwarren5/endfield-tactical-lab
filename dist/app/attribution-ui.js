// 伤害归因页：只读。读排轴页选中的那条轴，把总计战斗时间内的保底伤害按人、按技能类型、按时间、按增益来源拆开。
import {h,fmt,pct} from './ui.js';
import {currentResult,waitingPanel,candidateTabs,onResultReady} from './chart-ui.js';
const HIT_KINDS=[['normal','普攻'],['skill','战技'],['combo','连携技'],['ultimate','终结技'],['mech','追加伤害']];
const COLOR={normal:'#1baf7a',skill:'#eb6834',combo:'#2a78d6',ultimate:'#e34948',mech:'#eda100'};
const SERIES='#2a78d6', INK='#202522', MUTED='#68716c', GRID='#e4e6e1', BURST='#f6f1e3';
const ZONE_CN={bonus:'伤害加成',amp:'增幅',fragile:'脆弱',vulnerable:'易伤',crit:'暴击',artsStrength:'源石技艺强度',combo:'连携系数',stagger:'失衡',level:'等级差',defence:'敌人防御',resistance:'敌人抗性',reduction:'敌人减伤'};
const NS='http://www.w3.org/2000/svg';
const el=(tag,attrs,text)=>{ const n=document.createElementNS(NS,tag); for(const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); if(text!=null) n.textContent=text; return n; };
const svgOf=(w,ht)=>el('svg',{viewBox:`0 0 ${w} ${ht}`,class:'viz-svg',role:'img'});
const heading=(idx,title)=>h('div',{class:'panel-heading'},h('span',{class:'index'},idx),h('h2',{},title));
const kindLabel=k=>HIT_KINDS.find(x=>x[0]===k)?.[1]||k;
/* 保底口径与排轴页一致：窗口内的主控普攻 + 全员技能，不计队友普攻 */
const guaranteedHits=res=>{ const mc=res.input.mainControl; return res.main.hits.filter(x=>x.t<=res.end+1e-6&&x.damage>0&&!(x.kind==='normal'&&x.member!==mc)); };
function hover(node,tip,text){
  node.addEventListener('mouseenter',()=>{ tip.textContent=text(); tip.hidden=false; });
  node.addEventListener('mousemove',e=>{ const r=tip.parentElement.getBoundingClientRect(); tip.style.left=`${e.clientX-r.left+14}px`; tip.style.top=`${e.clientY-r.top+14}px`; });
  node.addEventListener('mouseleave',()=>{ tip.hidden=true; });
}

export function renderAttribution(root,state,update){
  root.innerHTML=''; const stack=h('div',{class:'rot-stack'}); stack.append(h('a',{href:'#rotation',class:'back-link'},'← 看轴'));
  const host=h('div',{class:'chart-host'}); stack.append(host); root.append(h('div',{class:'workspace single chart'},stack));
  onResultReady(()=>{ if(document.body.contains(root)) renderAttribution(root,state,update); });
  const cur=currentResult(state);
  if(cur.empty){ host.append(h('section',{class:'panel'},h('p',{class:'muted'},'还没有编队。',h('a',{href:'#setup',class:'link'},'去配置页选人')))); return; }
  if(cur.error){ host.append(h('section',{class:'panel'},h('div',{class:'sim-errors'},'排轴失败：'+cur.error))); return; }
  if(cur.pending){ host.append(waitingPanel(state,cur.key)); return; }
  const res=cur.res; const hits=guaranteedHits(res); const total=hits.reduce((a,x)=>a+x.damage,0); const W=res.end;
  const tip=h('div',{class:'viz-tip',hidden:true}); host.append(tip);
  host.append(candidateTabs(cur,update),overview(res,hits,total,W),byMember(res,hits,total,tip),byTime(res,hits,total,W,tip),byZone(hits,total,tip),topHits(hits));
}

function overview(res,hits,total,W){
  const top=[...hits].sort((a,b)=>b.damage-a.damage)[0];
  const stat=(label,value,sub)=>h('div',{class:'result-mini stat'},h('span',{},label),h('strong',{},value),sub?h('small',{class:'muted'},sub):'');
  return h('section',{class:'panel'},heading('01','总览'),h('div',{class:'chart-stats'},stat('总计战斗时间',`${Math.round(W)} 秒`,''),stat('保底伤害',fmt(total),`每秒 ${fmt(total/Math.max(1,W))}`),stat('单次最高',top?fmt(top.damage):'—',top?`${top.t.toFixed(1)}s ${top.name} ${kindLabel(top.kind)}`:'')));
}

// 各干员伤害占比：每人一条横向堆叠条，段 = 技能类型；条尾直接标数值和占比，段内够宽时标占比
function byMember(res,hits,total,tip){
  const mc=res.input.mainControl; const rows={};
  for(const x of hits){ const r=rows[x.member]||(rows[x.member]={member:x.member,name:x.name,total:0,kinds:{}}); r.total+=x.damage; r.kinds[x.kind]=(r.kinds[x.kind]||0)+x.damage; }
  const list=Object.values(rows).sort((a,b)=>b.total-a.total); const max=list[0]?.total||1;
  const W=760,L=96,R=150,rowH=38,barH=20,top=6; const H=top+list.length*rowH+4; const svg=svgOf(W,H); const x=v=>L+(v/max)*(W-L-R);
  list.forEach((r,i)=>{ const y=top+i*rowH+(rowH-barH)/2;
    svg.append(el('text',{x:L-8,y:y+barH/2+4,'font-size':12,'font-weight':700,fill:INK,'text-anchor':'end'},`${r.name}${r.member===mc?' ★':''}`));
    let cx=L; const kinds=HIT_KINDS.filter(([k])=>r.kinds[k]>0);
    kinds.forEach(([k,l],j)=>{ const v=r.kinds[k]; const w=x(v)-L; const last=j===kinds.length-1; const rect=el('rect',{x:cx,y,width:Math.max(0,w-(last?0:2)),height:barH,fill:COLOR[k],rx:last?3:0}); hover(rect,tip,()=>`${r.name} · ${l}\n${fmt(v)} · 占总伤 ${pct(v/total*100)}`); svg.append(rect);
      if(w>=56) svg.append(el('text',{x:cx+w/2-1,y:y+barH/2+4,'font-size':11,fill:'#fff','text-anchor':'middle'},pct(v/total*100))); cx+=w; });
    svg.append(el('text',{x:x(r.total)+6,y:y+barH/2+4,'font-size':12,fill:INK},`${fmt(r.total)} · ${pct(r.total/total*100)}`)); });
  const legend=h('div',{class:'chart-legend'},...HIT_KINDS.map(([k,l])=>h('span',{},h('i',{style:`background:${COLOR[k]}`}),l)));
  const table=h('details',{class:'viz-table'},h('summary',{},'表格'),h('table',{},h('thead',{},h('tr',{},h('th',{},'干员'),...HIT_KINDS.map(([,l])=>h('th',{},l)),h('th',{},'合计'),h('th',{},'占比'))),
    h('tbody',{},...list.map(r=>h('tr',{},h('td',{},r.name),...HIT_KINDS.map(([k])=>h('td',{},r.kinds[k]?fmt(r.kinds[k]):'—')),h('td',{},fmt(r.total)),h('td',{},pct(r.total/total*100)))))));
  return h('section',{class:'panel'},heading('02','各干员伤害占比'),legend,h('div',{class:'chart-scroll'},svg),table);
}

// 伤害时间分布：每 5 秒一根柱，爆发节底色标出；只给最高的三根标数值
function byTime(res,hits,total,W,tip){
  const bin=5, n=Math.max(1,Math.ceil(W/bin)); const vals=Array(n).fill(0); for(const x of hits){ vals[Math.min(n-1,Math.floor(x.t/bin))]+=x.damage; } const max=Math.max(...vals,1)*1.25; /* 留出顶部空间给数值标签 */
  const segs={}; res.timeline.forEach(a=>{ const s=res.steps[a.step]; const g=segs[s.seg]||(segs[s.seg]={start:a.t,ult:false}); if(a.kind==='ultimate') g.ult=true; }); const segList=Object.values(segs);
  const Wd=760,L=14,R=14,top=18,bottom=24,ph=150; const H=top+ph+bottom; const svg=svgOf(Wd,H); const x=t=>L+(t/W)*(Wd-L-R); const y=v=>top+ph-(v/max)*ph;
  segList.forEach((g,i)=>{ if(!g.ult) return; const end=segList[i+1]?segList[i+1].start:W; svg.append(el('rect',{x:x(g.start),y:top-14,width:Math.max(1,x(end)-x(g.start)),height:ph+14,fill:BURST})); svg.append(el('text',{x:x(g.start)+4,y:top-3,'font-size':10,'font-weight':700,fill:'#8a6b1f'},'爆发')); });
  /* 相邻两根柱都要标数值时，标签放在各自柱顶，柱间留 2px，顶部 25% 留白保证不碰到节名 */
  for(let t=0;t<=W;t+=10){ svg.append(el('line',{x1:x(t),y1:top,x2:x(t),y2:top+ph,stroke:GRID})); svg.append(el('text',{x:x(t),y:H-7,'font-size':10,fill:MUTED,'text-anchor':'middle'},`${t}s`)); }
  svg.append(el('line',{x1:L,y1:top+ph,x2:Wd-R,y2:top+ph,stroke:'#bfc8c0'}));
  const labelIdx=new Set(vals.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).slice(0,3).map(p=>p[1]));
  vals.forEach((v,i)=>{ const x0=x(i*bin)+1, w=Math.max(1,x((i+1)*bin)-x(i*bin)-2); const rect=el('rect',{x:x0,y:y(v),width:w,height:Math.max(0,top+ph-y(v)),fill:SERIES,rx:3}); hover(rect,tip,()=>`${i*bin}–${Math.min(W,(i+1)*bin)} 秒\n${fmt(v)} · 占总伤 ${pct(v/total*100)}`); svg.append(rect);
    if(labelIdx.has(i)&&v>0) svg.append(el('text',{x:x0+w/2,y:y(v)-4,'font-size':11,fill:INK,'text-anchor':'middle'},fmt(v))); });
  const table=h('details',{class:'viz-table'},h('summary',{},'表格'),h('table',{},h('thead',{},h('tr',{},h('th',{},'时段'),h('th',{},'伤害'),h('th',{},'占比'))),h('tbody',{},...vals.map((v,i)=>h('tr',{},h('td',{},`${i*bin}–${Math.min(W,(i+1)*bin)} 秒`),h('td',{},fmt(v)),h('td',{},pct(v/total*100)))))));
  return h('section',{class:'panel'},heading('03','伤害时间分布'),h('div',{class:'chart-scroll'},svg),table);
}

// 增益构成：每个乘区按“拿掉它这一下会少多少”折成伤害，再按来源在乘区里的数值占比分到具体效果
function byZone(hits,total,tip){
  const gain={}, loss={}, src={};
  for(const x of hits){ for(const [z,f] of Object.entries(x.factors||{})){ if(z==='attack'||z==='ratio'||!(f>0)||Math.abs(f-1)<1e-9) continue;
      if(f>1){ const a=x.damage*(1-1/f); gain[z]=(gain[z]||0)+a; const b=x.buckets?.[z]||[]; const sum=b.reduce((s,e)=>s+Math.abs(e.value||0),0); if(sum>0) for(const e of b){ const key=`${z}|${e.label}`; src[key]=(src[key]||0)+a*Math.abs(e.value||0)/sum; } }
      else loss[z]=(loss[z]||0)+x.damage*(1/f-1); } }
  const gainRows=Object.entries(gain).sort((a,b)=>b[1]-a[1]); const lossRows=Object.entries(loss).sort((a,b)=>b[1]-a[1]); const max=Math.max(gainRows[0]?.[1]||1,lossRows[0]?.[1]||1);
  const row=(z,v,positive)=>{ const sources=Object.entries(src).filter(([k])=>k.startsWith(z+'|')).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,s])=>`${k.split('|')[1]} ${pct(s/total*100)}`);
    const bar=h('div',{class:'zone-bar',style:`width:calc((100% - 180px) * ${Math.max(0.02,v/max).toFixed(4)});background:${positive?SERIES:'#9aa09b'}`}); /* 条最长留 180px 给右侧文字 */ hover(bar,tip,()=>`${ZONE_CN[z]||z}\n${positive?'提供了':'减少了'} ${fmt(v)}`);
    return h('div',{class:'zone-row'},h('div',{class:'zone-name'},ZONE_CN[z]||z),h('div',{},h('div',{class:'zone-track'},bar,h('span',{class:'zone-val'},`${positive?'提供了':'减少了'} ${pct(v/total*100)}`)),positive&&sources.length?h('div',{class:'zone-src'},sources.join(' · ')):'')); };
  return h('section',{class:'panel'},heading('04','增益构成'),h('div',{class:'zone-rows'},...gainRows.map(([z,v])=>row(z,v,true)),...lossRows.map(([z,v])=>row(z,v,false))));
}

// 单次最高伤害：时刻、谁、哪一段、伤害、乘区链
function topHits(hits){
  const top=[...hits].sort((a,b)=>b.damage-a.damage).slice(0,10);
  const chain=x=>{ const f=x.factors||{}; if(!f.attack) return '固定伤害'; const parts=[`攻击 ${fmt(f.attack)} × 倍率 ${Number(f.ratio||0).toFixed(2)}`]; for(const z of ['bonus','amp','fragile','vulnerable','crit','artsStrength','combo','stagger','level','defence','resistance','reduction']){ const v=f[z]; if(v!=null&&Math.abs(v-1)>1e-6) parts.push(`${ZONE_CN[z]} ×${Number(v).toFixed(2)}`); } return parts.join(' × '); };
  return h('section',{class:'panel'},heading('05','单次最高伤害'),h('div',{class:'chart-scroll'},h('table',{class:'top-hits'},h('thead',{},h('tr',{},h('th',{},'时刻'),h('th',{},'干员'),h('th',{},'技能'),h('th',{class:'num'},'伤害'),h('th',{},'计算过程'))),
    h('tbody',{},...top.map(x=>h('tr',{},h('td',{class:'num'},`${x.t.toFixed(1)}s`),h('td',{},x.name),h('td',{},`${kindLabel(x.kind)}${x.label&&x.label!=='伤害倍率'?' · '+x.label:''}`),h('td',{class:'num'},fmt(x.damage)),h('td',{class:'chain'},chain(x))))))));
}

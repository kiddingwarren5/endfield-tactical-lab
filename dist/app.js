import {gear,events,elements,buffDefs,gradeResistance,weaponRanks} from './data.js';
import {defaultState,calculate,weaponSkillRankFromPotential} from './calc.js';

let state=defaultState();
const $=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:0}).format(Math.round(n));
const pct=n=>`${Number(n).toFixed(1).replace(/\.0$/,'')}%`;
const colors={physical:'var(--physical)',cold:'var(--cold)',heat:'var(--heat)',electric:'var(--electric)',nature:'var(--nature)'};
const rankLabel=n=>n<=9?`Rank ${n}`:`专精 ${n-9}`;

function addOptions(el,arr,value){el.innerHTML=arr.map(([v,label])=>`<option value="${v}">${label}</option>`).join('');el.value=String(value)}
function bootSelects(){
  addOptions($('characterPotential'),Array.from({length:6},(_,i)=>[i,`${i} 潜`]),0);
  addOptions($('weaponPotential'),Array.from({length:6},(_,i)=>[i,`${i} 潜`]),0);
  for(const id of ['weaponStrengthRank','weaponAttackRank'])addOptions($(id),Array.from({length:9},(_,i)=>[i+1,`Rank ${i+1}`]),9);
  addOptions($('weaponSkillRank'),Array.from({length:6},(_,i)=>[i+4,`Rank ${i+4}`]),4);
  for(const id of ['normalRank','qRank','eRank','rRank'])addOptions($(id),Array.from({length:12},(_,i)=>[i+1,rankLabel(i+1)]),12);
  const groups=[...new Set(events.map(e=>e.group))];
  $('event').innerHTML=groups.map(group=>`<optgroup label="${group}">${events.filter(e=>e.group===group).map(e=>`<option value="${e.id}">${e.label}</option>`).join('')}</optgroup>`).join('');
  $('event').value=state.event;
}
function renderGear(){
  const slots={armor:'护甲',gloves:'护手',kit1:'配件 · 1',kit2:'配件 · 2'};
  $('gear-list').innerHTML=Object.entries(gear).map(([key,item])=>{
    const conf=state.gear[key];
    const fields=key==='kit2'?[['will','意志'],['wisdom','智识'],['main','主能力']]:[['strength','力量'],['will','意志'],['cold','寒冷／电磁伤害']];
    return `<div class="gear-row ${conf.on?'':'off'}"><div class="gear-head"><img class="item-thumb" src="${item.image}" alt=""><div><span class="gear-name">${item.name}</span><span class="gear-slot">${slots[key]} · ${item.set}</span></div><label class="gear-toggle"><input type="checkbox" data-gear="${key}" ${conf.on?'checked':''}> 装备</label></div><div class="refine-grid">${fields.map(([field,label])=>`<label class="refine-field"><span>${label} <b>${item[field][conf.refinements[field]]}${field==='cold'||field==='main'?'%':''}</b></span><select aria-label="${item.name}${label}精锻" data-refine="${key}:${field}" ${conf.on?'':'disabled'}>${[0,1,2,3].map(n=>`<option value="${n}" ${n===conf.refinements[field]?'selected':''}>精锻 +${n}</option>`).join('')}</select></label>`).join('')}</div></div>`
  }).join('');
}
function buffApplicable(def,ev,stats){
  if(def.id==='tide2'&&stats.tideCount<3)return false;
  if(['weaponQ','weaponE','jueCold','jueRCold','blCold'].includes(def.id)&&ev.element!=='cold')return false;
  if(def.id==='ttArts'&&ev.element==='physical')return false;
  if(def.id==='tide2'&&ev.element==='physical')return false;
  return true;
}
function renderBuffs(ev,stats){
  const groups=['增伤','增幅','脆弱','易伤'];
  $('buff-list').innerHTML=groups.map(zone=>`<div class="buff-group"><div class="buff-group-title"><span>${zone}乘区</span><span>同区相加</span></div>${buffDefs.filter(b=>b.zone===zone).map(def=>{
    const enabled=buffApplicable(def,ev,stats);
    const weaponRank=weaponSkillRankFromPotential(state.weaponPotential)-1;
    const value=def.id==='weaponQ'?weaponRanks.afterQ[weaponRank]:def.id==='weaponE'?weaponRanks.afterE[weaponRank]:def.id==='tide2'?35:def.value;
    return `<label class="buff-card ${enabled?'':'inactive'}"><input type="checkbox" data-buff="${def.id}" ${state.buffs[def.id]?'checked':''} ${enabled?'':'disabled'}><span><strong>${def.name}</strong><small>${def.source} · ${def.applies}</small></span><span class="buff-value">+${pct(value)}</span></label>`;
  }).join('')}</div>`).join('');
  const applicable=buffDefs.filter(def=>buffApplicable(def,ev,stats)&&def.id!=='jueCold');
  const selected=applicable.filter(def=>def.id==='jueRCold'?(state.buffs.jueRCold||state.buffs.jueCold):state.buffs[def.id]).length;
  $('buffAll').checked=selected===applicable.length;
  $('buffAll').indeterminate=selected>0&&selected<applicable.length;
}
function eventControls(ev){
  const showLayers=ev.id==='eSlash';
  const showAbnormal=ev.group==='机制伤害'&&ev.id!=='artsBurst'&&ev.id!=='knockup'&&ev.id!=='knockdown';
  const showElement=ev.id==='artsBurst';
  $('event-controls').innerHTML=[
    showLayers?`<label class="field"><span>消耗寒冷层数</span><select id="coldLayers">${[0,1,2,3,4].map(n=>`<option value="${n}" ${n===state.coldLayers?'selected':''}>${n} 层</option>`).join('')}</select></label>`:'',
    showAbnormal?`<label class="field"><span>${['crush','armorBreak'].includes(ev.id)?'消耗破防层数':'异常等级'}</span><select id="abnormalLevel">${[1,2,3,4].map(n=>`<option value="${n}" ${n===state.abnormalLevel?'selected':''}>${n} 级 / 层</option>`).join('')}</select></label>`:'',
    showElement?`<label class="field"><span>触发属性</span><select id="burstElement">${['cold','heat','electric','nature'].map(e=>`<option value="${e}" ${e===state.burstElement?'selected':''}>${elements[e]}</option>`).join('')}</select></label>`:''
  ].join('');
}
function renderResistance(){
  $('resistance-list').innerHTML=Object.entries(elements).map(([key,label])=>{
    const grade=state.enemy.resistances[key];const value=grade==='custom'?state.enemy.custom[key]??0:gradeResistance[grade];
    return `<div class="resistance-row"><span style="color:${colors[key]}">${label}</span><select aria-label="${label}抗性评级" data-resistance="${key}">${['D','C','B','custom'].map(g=>`<option value="${g}" ${g===grade?'selected':''}>${g==='custom'?'自定义':`${g} 级`}</option>`).join('')}</select><output>${pct(value)}</output>${grade==='custom'?`<input class="custom-res" type="number" min="-100" max="100" step="1" data-custom="${key}" aria-label="${label}自定义抗性" value="${value}">`:''}</div>`;
  }).join('');
}
function factorRow(name,value){return `<div class="factor-row"><span>${name}</span><strong>${value}</strong></div>`}
function renderResult(out){
  const {ev,stats,factors,buckets}=out;
  $('ratio').textContent=pct(ev.ratio);
  $('event-detail').textContent='';
  $('result-element').textContent=`${elements[ev.element]}伤害`;
  $('result-element').style.color=colors[ev.element];
  $('result-number').textContent=fmt(out.damage);
  $('result-number').style.color=colors[ev.element];
  $('crit-caption').textContent={expected:'暴击期望',never:'不暴击',always:'必暴击'}[state.critMode];
  $('panel-attack').textContent=fmt(stats.panelAttack);
  $('abilities').textContent=`${stats.main} / ${stats.sub}`;
  $('active-resistance').textContent=`${out.grade==='custom'?'自定义':out.grade+' 级'} · ${pct(out.resistance)}`;
  $('gear-set-status').textContent=`潮涌 ${stats.tideCount} / 3 件　${stats.tideCount>=3?'套装效果已生效':'套装效果未生效'}`;
  $('factors').innerHTML=[
    factorRow('攻击力 × 技能倍率',`${fmt(stats.panelAttack)} × ${pct(ev.ratio)}`),
    factorRow('暴击乘区',`× ${factors.crit.toFixed(3)}`),
    factorRow('增伤乘区',`× ${factors.bonus.toFixed(3)}`),
    factorRow('增幅乘区',`× ${factors.amp.toFixed(3)}`),
    factorRow('脆弱乘区',`× ${factors.fragile.toFixed(3)}`),
    factorRow('易伤乘区',`× ${factors.vulnerable.toFixed(3)}`),
    factorRow('连击 / 失衡',`× ${(factors.combo*factors.stagger).toFixed(3)}`),
    factorRow('防御 / 抗性 / 减免',`× ${(factors.defence*factors.resistance*factors.reduction).toFixed(3)}`),
    factorRow('异常等级 / 技艺',`× ${(factors.level*factors.artsStrength).toFixed(3)}`)
  ].join('');
  const active=Object.entries(buckets).flatMap(([key,arr])=>arr.map(x=>`<div class="active-buff"><span><span class="zone-tag">${{bonus:'增伤',amp:'增幅',fragile:'脆弱',vulnerable:'易伤'}[key]}</span>${x.label}</span><b>+${pct(x.value)}</b></div>`));
  $('active-buffs').innerHTML=`<div class="active-buffs-title">本次实际计入 ${active.length} 项</div>${active.length?active.join(''):'<div class="active-buff">无额外增益</div>'}`;
}
function refresh({structure=false}={}){
  const result=calculate(state);
  if(structure){renderGear();eventControls(result.ev);renderResistance();}
  renderBuffs(result.ev,result.stats);
  renderResult(result);
}
function syncStatic(){
  for(const [id,value] of Object.entries({characterPotential:state.characterPotential,weaponPotential:state.weaponPotential,weaponStrengthRank:state.weaponRanks.strength,weaponAttackRank:state.weaponRanks.attack,weaponSkillRank:state.weaponRanks.skill,normalRank:state.skillRanks.normal,qRank:state.skillRanks.q,eRank:state.skillRanks.e,rRank:state.skillRanks.r,event:state.event,defence:state.enemy.defence,critMode:state.critMode,artsStrength:state.artsStrength,combo:state.combo,stagger:state.stagger,reduction:state.reduction}))$(id).value=String(value);
}
function updateInput(target){
  const id=target.id;const val=target.value;
  if(id==='characterPotential')state.characterPotential=Number(val);
  else if(id==='weaponPotential'){state.weaponPotential=Number(val);state.weaponRanks.skill=weaponSkillRankFromPotential(val);$('weaponSkillRank').value=String(state.weaponRanks.skill)}
  else if(id==='weaponStrengthRank')state.weaponRanks.strength=Number(val);
  else if(id==='weaponAttackRank')state.weaponRanks.attack=Number(val);
  else if(id==='weaponSkillRank'){state.weaponRanks.skill=Number(val);state.weaponPotential=Number(val)-4;$('weaponPotential').value=String(state.weaponPotential)}
  else if(['normalRank','qRank','eRank','rRank'].includes(id))state.skillRanks[id.replace('Rank','')]=Number(val);
  else if(id==='event')state.event=val;
  else if(id==='coldLayers')state.coldLayers=Number(val);
  else if(id==='abnormalLevel')state.abnormalLevel=Number(val);
  else if(id==='burstElement')state.burstElement=val;
  else if(id==='defence')state.enemy.defence=Number(val);
  else if(id==='critMode')state.critMode=val;
  else if(['artsStrength','combo','stagger','reduction'].includes(id))state[id]=Number(val);
  else if(target.dataset.gear)state.gear[target.dataset.gear].on=target.checked;
  else if(target.dataset.refine){const [slot,field]=target.dataset.refine.split(':');state.gear[slot].refinements[field]=Number(val)}
  else if(id==='buffAll'){
    const {ev,stats}=calculate(state);
    for(const def of buffDefs)state.buffs[def.id]=target.checked&&buffApplicable(def,ev,stats)&&def.id!=='jueCold';
  }
  else if(target.dataset.buff){
    state.buffs[target.dataset.buff]=target.checked;
    if(target.checked&&target.dataset.buff==='jueCold')state.buffs.jueRCold=false;
    if(target.checked&&target.dataset.buff==='jueRCold')state.buffs.jueCold=false;
  }
  else if(target.dataset.resistance)state.enemy.resistances[target.dataset.resistance]=val;
  else if(target.dataset.custom){state.enemy.custom[target.dataset.custom]=Number(val);target.previousElementSibling.textContent=pct(val);}
  refresh({structure:id==='event'||id==='burstElement'||Boolean(target.dataset.gear)||Boolean(target.dataset.refine)||Boolean(target.dataset.resistance)});
}
bootSelects();syncStatic();refresh({structure:true});
document.addEventListener('change',e=>{if(e.target.matches('select,input'))updateInput(e.target)});
document.addEventListener('input',e=>{if(e.target.matches('input[type=number]'))updateInput(e.target)});
$('reset').addEventListener('click',()=>{state=defaultState();syncStatic();refresh({structure:true})});

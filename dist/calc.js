import {gear, weaponRanks, skills, events, gradeResistance, buffDefs} from './data.js';

export const defaultState = () => ({
  characterPotential:0, weaponPotential:0,
  weaponRanks:{strength:9,attack:9,skill:4},
  skillRanks:{normal:12,q:12,e:12,r:12},
  gear:{
    armor:{on:true,refinements:{strength:3,will:3,cold:3}},
    gloves:{on:true,refinements:{strength:3,will:3,cold:3}},
    kit1:{on:true,refinements:{strength:3,will:3,cold:3}},
    kit2:{on:true,refinements:{will:3,wisdom:3,main:3}}
  },
  event:'eSlash', coldLayers:4, abnormalLevel:1, burstElement:'cold',
  buffs:{}, enemy:{defence:100,resistances:{physical:'D',cold:'D',heat:'D',electric:'D',nature:'D'},custom:{}},
  critMode:'never', artsStrength:0, combo:0, stagger:0, reduction:0
});

const sum = values => values.reduce((a,b)=>a+b,0);
const clamp=(x,min,max)=>Math.min(max,Math.max(min,Number.isFinite(Number(x))?Number(x):min));
const rank=(value,max)=>Math.round(clamp(value,1,max))-1;
const getGear=(state,key)=>state.gear[key]?.on?gear[key]:null;
export const weaponSkillRankFromPotential=potential=>4+Math.round(clamp(potential,0,5));
const refineFor=(state,key,field)=>Math.round(clamp(state.gear[key]?.refinements?.[field]??0,0,3));
const gearValue=(state,field)=>sum(Object.keys(gear).map(key=>{
  const piece=getGear(state,key);
  return piece ? (piece[field]?.[refineFor(state,key,field)] ?? 0):0;
}))+(field==='cold'&&['armor','gloves','kit1'].every(k=>state.gear[k]?.on&&refineFor(state,k,'cold')===3)?0.1:0);
// The game's displayed aggregate is 69.8%, while three independently rounded gear rows sum to 69.7%.
// Calibrate the screenshot-matched default; other refinements use the published one-decimal rows.

export function getStats(state){
  const wr=state.weaponRanks;
  const mainRaw=155+60+(state.characterPotential>=2?20:0)+gearValue(state,'strength')+weaponRanks.strength[rank(wr.strength,9)];
  const main=Math.floor(mainRaw*(1+gearValue(state,'main')/100)+1e-9);
  const sub=109+gearValue(state,'will');
  const atkPercent=weaponRanks.attack[rank(wr.attack,9)];
  const attack=(332+505)*(1+atkPercent/100)*(1+main*.005+sub*.002);
  const cold=gearValue(state,'cold')+(state.characterPotential>=2?10:0);
  const tideCount=Object.keys(gear).filter(k=>getGear(state,k)?.set==='潮涌').length;
  return {main,sub,attack,panelAttack:Math.floor(attack+1e-9),atkPercent,cold,tideCount,gearStrength:gearValue(state,'strength'),gearWill:gearValue(state,'will'),gearMain:gearValue(state,'main')};
}

export function getEvent(state){
  const entry=events.find(e=>e.id===state.event)||events[0];
  const skillRank=state.skillRanks[entry.id.startsWith('normal')||['plunge','execute'].includes(entry.id)?'normal':entry.id==='q'?'q':entry.id.startsWith('e')?'e':'r'];
  const ix=rank(skillRank||12,12);
  const layers=Math.round(clamp(state.coldLayers,0,4));
  const abnormal=Math.round(clamp(state.abnormalLevel,1,4));
  let ratio=0;
  if(entry.id==='eSlash') ratio=skills.eBase[ix]+skills.eLayer[ix]*layers;
  else if(skills[entry.id]) ratio=skills[entry.id][ix];
  else if(entry.id==='artsBurst') ratio=160;
  else if(['knockup','knockdown'].includes(entry.id)) ratio=120;
  else if(entry.id==='crush') ratio=150*(1+abnormal);
  else if(entry.id==='armorBreak') ratio=50*(1+abnormal);
  else if(entry.id==='iceShatter') ratio=120*(1+abnormal);
  else if(entry.id==='burnTick') ratio=12*(1+abnormal);
  else ratio=80*(1+abnormal);
  if(state.characterPotential>=3 && (entry.id.startsWith('e')||entry.id.startsWith('r')))ratio*=1.15;
  if(state.characterPotential>=5 && entry.id==='q')ratio*=1.2;
  return {...entry, ratio, element:entry.id==='artsBurst'?state.burstElement:entry.element};
}

export function calculate(state){
  const stats=getStats(state), ev=getEvent(state);
  const isArts=ev.element!=='physical';
  const isSkill=ev.kind==='skill';
  const buckets={bonus:[],amp:[],fragile:[],vulnerable:[]};
  const add=(bucket,label,value)=>{if(value) buckets[bucket].push({label,value})};
  if(['cold','electric'].includes(ev.element))add('bonus','装备 · 对应属性伤害',gearValue(state,'cold'));
  if(ev.element==='cold'&&state.characterPotential>=2)add('bonus','别礼潜能 2 · 寒冷伤害',10);
  if(isSkill){
    if(stats.tideCount>=3)add('bonus','潮涌 3 件 · 技能伤害',20);
    add('bonus','赫拉芬格 · 所有技能伤害',weaponRanks.skill[rank(weaponSkillRankFromPotential(state.weaponPotential),9)]);
  }
  for(const def of buffDefs){
    if(!state.buffs[def.id])continue;
    if(def.id==='jueCold'&&state.buffs.jueRCold)continue;
    if(def.id==='weaponQ'&&ev.element!=='cold')continue;
    if(def.id==='weaponE'&&ev.element!=='cold')continue;
    if(def.id==='tide2'&&(!isArts||stats.tideCount<3))continue;
    if(['jueCold','jueRCold','blCold'].includes(def.id)&&ev.element!=='cold')continue;
    if(def.id==='ttArts'&&!isArts)continue;
    const weaponRank=rank(weaponSkillRankFromPotential(state.weaponPotential),9);
    const value=def.id==='weaponQ'?weaponRanks.afterQ[weaponRank]:def.id==='weaponE'?weaponRanks.afterE[weaponRank]:def.id==='tide2'?35:def.value;
    const mapped={增伤:'bonus',增幅:'amp',脆弱:'fragile',易伤:'vulnerable'}[def.zone];
    add(mapped,def.name,value);
  }
  if(ev.id.startsWith('r')){
    buckets.fragile=buckets.fragile.map(item=>({label:`${item.label} · 二天赋 ×1.5`,value:item.value*1.5}));
  }
  const bucketSum=key=>sum(buckets[key].map(x=>x.value));
  const crit=state.critMode==='never'?1:state.critMode==='always'?1.5:1+.05*.5;
  const levelFactor=ev.kind==='arts'?1+89/196:ev.kind==='physical'?1+89/392:1;
  const artsFactor=['arts','physical'].includes(ev.kind)?1+clamp(state.artsStrength,0,999)/100:1;
  const defence=clamp(state.enemy.defence,0,99999);
  const grade=state.enemy.resistances[ev.element]??'D';
  const resistance=grade==='custom'?clamp(state.enemy.custom[ev.element]??0,-100,100):gradeResistance[grade]??0;
  const factors={
    attack:stats.panelAttack,ratio:ev.ratio/100,crit,
    bonus:1+bucketSum('bonus')/100,amp:1+bucketSum('amp')/100,
    fragile:1+bucketSum('fragile')/100,vulnerable:1+bucketSum('vulnerable')/100,
    combo:1+clamp(state.combo,0,999)/100,stagger:1+clamp(state.stagger,0,999)/100,
    defence:100/(100+defence),resistance:1-resistance/100,
    reduction:1-clamp(state.reduction,0,100)/100,
    level:levelFactor,artsStrength:artsFactor
  };
  const damage=Object.values(factors).reduce((a,b)=>a*b,1);
  return {damage,ev,stats,buckets,factors,defence,resistance,grade};
}

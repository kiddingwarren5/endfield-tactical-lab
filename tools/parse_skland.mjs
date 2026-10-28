// Parse raw skland wiki item JSON (block documents) into structured "official" JSON.
// Usage: node tools/parse_skland.mjs <rawDir> <outDir>
import fs from 'node:fs'; import path from 'node:path';
import {inlineText} from './doc2md.mjs';
const [rawDir,outDir]=process.argv.slice(2);

function docBlocks(doc){
  const out=[]; const visit=(id)=>{ const b=doc.blockMap[id]; if(!b) return;
    if(b.kind==='text'){ const t=inlineText(b.text).trim(); const k=b.text?.kind||'body'; if(t) out.push({kind:k.startsWith('heading')?'heading':'text',text:t}); }
    else if(b.kind==='table'){ const tb=b.table; const rows=tb.rowIds.map(rid=>tb.columnIds.map(cid=>{ const cell=tb.cellMap?.[`${rid}_${cid}`]; const ids=cell?.childIds||[]; return ids.map(x=>cellText(doc,x)).join('\n').trim(); })); out.push({kind:'table',rows}); }
    else if(b.kind==='image'){ out.push({kind:'image',url:b.image?.url||''}); }
    else if(b.kind==='list'){ const L=b.list; for(const iid of L.itemIds||[]){ const ids=L.itemMap?.[iid]?.childIds||[]; const t=ids.map(x=>cellText(doc,x)).join(' ').trim(); if(t) out.push({kind:'text',text:'- '+t}); } }
    else { const ids=b.childIds||b[b.kind]?.childIds||Object.values(doc.blockMap).filter(x=>x.parentId===id).map(x=>x.id); ids.forEach(visit); }
  };
  doc.blockIds.forEach(visit); return out;
}
function cellText(doc,id){ const b=doc.blockMap[id]; if(!b) return ''; if(b.kind==='text') return inlineText(b.text); if(b.kind==='image') return `[image ${b.image?.url||''}]`; if(b.kind==='list'){ const L=b.list; return (L.itemIds||[]).map(iid=>'- '+(L.itemMap?.[iid]?.childIds||[]).map(x=>cellText(doc,x)).join(' ')).join('\n'); } const ids=b.childIds||b[b.kind]?.childIds||Object.values(doc.blockMap).filter(x=>x.parentId===id).map(x=>x.id); return ids.map(x=>cellText(doc,x)).join('\n'); }
function docText(doc){ return docBlocks(doc).filter(b=>b.kind==='text'||b.kind==='heading').map(b=>b.text).join('\n'); }

function walkItem(item){
  const dm=item.document.documentMap, wm=item.document.widgetCommonMap||{}; const chapters=[];
  for(const ch of item.document.chapterGroup||[]){ const widgets=[];
    for(const w of ch.widgets||[]){ const wd=wm[w.id]; const tabs=[]; const tabList=wd?.tabList?.length?wd.tabList:[{tabId:'default',title:''}];
      for(const t of tabList){ const td=wd?.tabDataMap?.[t.tabId]; if(!td) continue; const intro=td.intro&&typeof td.intro==='object'?{...td.intro}:td.intro; if(intro&&intro.description&&dm[intro.description]) intro.descriptionText=docText(dm[intro.description]); tabs.push({title:t.title||'',intro,blocks:td.content&&dm[td.content]?docBlocks(dm[td.content]):[]}); }
      widgets.push({title:w.title,type:wd?.type,tableList:wd?.tableList||[],tabs}); }
    chapters.push({title:ch.title,widgets}); }
  return chapters;
}
function tagMap(catalogFile,subId){ const cat=JSON.parse(fs.readFileSync(catalogFile)).data.catalog[0].typeSub.find(s=>s.id===subId); const m={}; const walk=(n,p)=>{ m[n.id]={group:p,name:n.name,value:n.value}; (n.children||[]).forEach(c=>walk(c,p||n.name)); }; cat.filterTagTree.forEach(f=>{ m[f.id]={group:f.name,name:f.name}; f.children.forEach(c=>walk(c,f.name)); }); return {map:m,items:cat.items}; }
function tagsOf(item,tm){ const out={}; for(const t of item.tagIds||[]){ const e=tm.map[t]; if(!e) continue; (out[e.group]??=[]).push(e.name); } return out; }
const findWidget=(chapters,title)=>chapters.flatMap(c=>c.widgets).find(w=>w.title===title);
const tableAfterHeading=(blocks,heading)=>{ const i=blocks.findIndex(b=>b.kind==='heading'&&b.text===heading); if(i<0) return null; const t=blocks.slice(i+1).find(b=>b.kind==='table'); return t?t.rows:null; };
const rowsToSeries=rows=>{ const o={header:rows[0]}; for(const r of rows.slice(1)) o[r[0]]=r.slice(1); return o; };

function parseOperator(item,tm){
  const ch=walkItem(item); const tags=tagsOf(item,tm);
  const info=Object.fromEntries((findWidget(ch,'干员信息')?.tableList||[]).map(r=>[r.label,r.value]));
  const elite=findWidget(ch,'精英化')?.tabs[0]?.blocks||[]; const attrRows=tableAfterHeading(elite,'干员属性');
  const skills=(findWidget(ch,'战斗技能')?.tabs||[]).map(t=>({name:t.intro?.name,type:t.intro?.type,description:t.intro?.descriptionText||'',table:rowsToSeries(tableAfterHeading(t.blocks,'技能数据')||[[]])}));
  const talents=(findWidget(ch,'天赋阵列')?.tabs||[]).map(t=>{ const h=t.blocks.find(b=>b.kind==='heading'); const cat=t.blocks.find(b=>b.kind==='text'); const tbl=t.blocks.find(b=>b.kind==='table'); return {name:h?.text,category:cat?.text,stages:(tbl?.rows||[]).slice(1).map(r=>({stage:r[0],description:r[1],unlock:r[2]}))}; });
  const potentials=(findWidget(ch,'干员潜能')?.tabs||[]).map((t,i)=>({level:i+1,name:t.blocks.find(b=>b.kind==='heading')?.text,description:t.blocks.filter(b=>b.kind==='text').map(b=>b.text).join('\n')}));
  return {itemId:item.itemId,name:item.name,cover:item.brief?.cover,tags,info,attributes:attrRows?rowsToSeries(attrRows):null,skills,talents,potentials,publishedAtTs:item.publishedAtTs};
}
function parseWeapon(item,tm){
  const ch=walkItem(item); const tags=tagsOf(item,tm);
  const info=Object.fromEntries((findWidget(ch,'武器资料')?.tableList||[]).map(r=>[r.label,r.value]));
  const wb=findWidget(ch,'武器信息')?.tabs[0]?.blocks||[]; const base=tableAfterHeading(wb,'基础信息'); const bt=tableAfterHeading(wb,'突破总览');
  const sk=findWidget(ch,'武器技能')?.tabs[0]?.blocks.find(b=>b.kind==='table')?.rows||[];
  const skillNames=sk[0]?.slice(1)||[]; const skills=skillNames.map((n,i)=>({name:n,ranks:sk.slice(1).map(r=>({rank:r[0],text:r[i+1]}))}));
  return {itemId:item.itemId,name:item.name,cover:item.brief?.cover,tags,info,baseAttack:base?rowsToSeries(base):null,breakthrough:bt,skills,publishedAtTs:item.publishedAtTs};
}
function parseGear(item,tm){
  const ch=walkItem(item); const tags=tagsOf(item,tm);
  const lvW=ch.flatMap(c=>c.widgets).find(w=>w.title.startsWith('装备等级')); const level=lvW?.title.replace('装备等级','').trim();
  const attrTable=tableAfterHeading(lvW?.tabs[0]?.blocks||[],'装备属性')||[]; const attrs=[]; for(const r of attrTable) for(let i=0;i+1<r.length;i+=2) if(r[i]) attrs.push({name:r[i],value:r[i+1]});
  const refineChapter=ch.find(c=>c.title==='装备精锻'); const rb=refineChapter?.widgets[0]?.tabs[0]?.blocks||[]; const rt=rb.find(b=>b.kind==='table')?.rows||[];
  const refine=rt.slice(1).map(r=>({name:r[0],values:r.slice(1)}));
  const setCh=ch.find(c=>c.title==='装备套组效果'); const st=setCh?.widgets[0]?.tabs[0]; const set=st?.intro?{name:st.intro.name,icon:st.intro.imgUrl,description:st.intro.descriptionText}:null;
  const obtain=(lvW?.tabs[0]?.blocks||[]).filter(b=>b.kind==='text').map(b=>b.text).find(t=>t.includes('获取'));
  return {itemId:item.itemId,name:item.name,cover:item.brief?.cover,tags,level,attrs,refine,set,obtain,publishedAtTs:item.publishedAtTs};
}
function parseItem(item,tm){ const ch=walkItem(item); const tags=tagsOf(item,tm); const info=Object.fromEntries((ch.flatMap(c=>c.widgets).find(w=>w.type==='table')?.tableList||[]).map(r=>[r.label,r.value])); const texts=ch.map(c=>({chapter:c.title,widgets:c.widgets.map(w=>({title:w.title,tabs:w.tabs.map(t=>({title:t.title,intro:t.intro,text:t.blocks.filter(b=>b.kind!=='image').map(b=>b.kind==='table'?b.rows.map(r=>r.join(' | ')).join('\n'):b.text).join('\n')}))}))})); return {itemId:item.itemId,name:item.name,cover:item.brief?.cover,tags,info,texts,publishedAtTs:item.publishedAtTs}; }

const kinds=[['operators','1','1',parseOperator],['weapons','1','2',parseWeapon],['gear','1','4',parseGear],['items','1','6',parseItem],['substrate','1','7',parseItem]];
fs.mkdirSync(outDir,{recursive:true});
for(const [kind,main,sub,fn] of kinds){ const dir=path.join(rawDir,kind); if(!fs.existsSync(dir)) continue; const tm=tagMap(path.join(rawDir,`catalog_${main}_${sub}.json`),sub); const out=[];
  for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.json'))){ try{ const item=JSON.parse(fs.readFileSync(path.join(dir,f))).data.item; out.push(fn(item,tm)); }catch(e){ console.error('fail',kind,f,e.message); } }
  out.sort((a,b)=>Number(a.itemId)-Number(b.itemId)); fs.writeFileSync(path.join(outDir,`${kind}.json`),JSON.stringify(out,null,1)); console.log(kind,out.length); }

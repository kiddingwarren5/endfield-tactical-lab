import fs from 'node:fs'; import {docToMd,inlineText} from './doc2md.mjs';
export function itemToStructuredMd(item){
  const out=[`# ${item.name} (itemId ${item.itemId}) tags=${(item.tagIds||[]).join(',')}`];
  const dm=item.document.documentMap, wm=item.document.widgetCommonMap||{};
  const seen=new Set();
  for(const ch of item.document.chapterGroup||[]){
    out.push(`\n# 章节: ${ch.title}`);
    for(const w of ch.widgets||[]){
      const wd=wm[w.id]; out.push(`\n## 组件: ${w.title} [${wd?.type}]`);
      if(wd?.tableList?.length) for(const r of wd.tableList) out.push(`- ${r.label}: ${typeof r.value==='string'?r.value:JSON.stringify(r.value)}`);
      const tabs=wd?.tabList?.length?wd.tabList:[{tabId:'default',title:''}];
      for(const t of tabs){ const td=wd?.tabDataMap?.[t.tabId]; if(!td) continue; out.push(`\n### 页签: ${t.title||t.tabId}`); if(td.intro){ out.push('intro: '+(typeof td.intro==='string'?td.intro:JSON.stringify(td.intro).slice(0,300))); const d=td.intro?.description; if(d&&dm[d]){ seen.add(d); out.push('描述:\n'+docToMd(dm[d])); } }
        if(td.content&&dm[td.content]){ seen.add(td.content); out.push(docToMd(dm[td.content])); } else if(td.content) out.push('(content not in documentMap: '+td.content+')');
        for(const [k,v] of Object.entries(td)) if(!['intro','content','audioList'].includes(k)&&v&&JSON.stringify(v)!=='[]') out.push(`${k}: ${JSON.stringify(v).slice(0,400)}`);
      }
    }
  }
  const rest=Object.keys(dm).filter(k=>!seen.has(k)); if(rest.length){ out.push(`\n# 未归类文档 ${rest.length}`); for(const k of rest){ out.push(`\n## DOC ${k}`); out.push(docToMd(dm[k])); } }
  return out.join('\n');
}
if(process.argv[1].endsWith('item2md.mjs')){ const item=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).data.item; console.log(itemToStructuredMd(item)); }

// Convert skland wiki block documents to markdown-ish text for inspection and parsing.
import fs from 'node:fs';
export function loadItem(file){ return JSON.parse(fs.readFileSync(file,'utf8')).data.item; }
export function inlineText(t){ if(!t) return ''; return (t.inlineElements||[]).map(e=>{ if(e.kind==='text') return e.text?.text??''; if(e.kind==='link') return inlineText(e.link?.text)||e.link?.url||''; if(e.kind==='image') return `[img:${e.image?.url||''}]`; if(e.kind==='icon'||e.kind==='emoji') return `[${e.kind}]`; return e[e.kind]?.text?.text?`${e[e.kind].text.text}`:`[${e.kind}]`; }).join(''); }
export function blockToMd(doc,id,depth=0){
  const b=doc.blockMap[id]; if(!b) return '';
  const pad='  '.repeat(depth);
  switch(b.kind){
    case 'text': { const t=inlineText(b.text); const k=b.text?.kind||''; const h=k.startsWith('heading')?'#'.repeat(Number(k.replace(/\D/g,'')||1))+' ':''; return pad+h+t+'\n'; }
    case 'heading': return pad+'# '+inlineText(b.heading?.text||b.text)+'\n';
    case 'table': { const tb=b.table; const rows=tb.rowIds.map(rid=>'| '+tb.columnIds.map(cid=>{ const cell=tb.cellMap?.[`${rid}_${cid}`]; const cellId=cell?.id||`${rid}_${cid}`; const ids=cell?.childIds||Object.values(doc.blockMap).filter(x=>x.parentId===cellId).map(x=>x.id); const kids=ids.map(x=>blockToMd(doc,x,0).trim()).join(' '); return kids.replace(/\|/g,'/'); }).join(' | ')+' |'); return pad+rows.join('\n')+'\n'; }
    case 'image': return pad+`[image ${b.image?.url||''}]\n`;
    case 'divider': return pad+'---\n';
    case 'list': { const L=b.list; return (L.itemIds||[]).map(iid=>{ const ids=L.itemMap?.[iid]?.childIds||[]; return pad+'- '+ids.map(x=>blockToMd(doc,x,0).trim()).join(' ')+'\n'; }).join(''); }
    default: { const ids=b.childIds||b[b.kind]?.childIds||Object.values(doc.blockMap).filter(x=>x.parentId===id).map(x=>x.id); const kids=ids.map(x=>blockToMd(doc,x,depth+1)).join(''); return pad+`[${b.kind}]\n`+kids; }
  }
}
export function docToMd(doc){ return doc.blockIds.map(id=>blockToMd(doc,id)).join(''); }
export function itemToMd(item){
  const out=[]; const dm=item.document?.documentMap||{};
  const tabs=item.document?.tabs||item.tabs||item.document?.tabList||null;
  out.push(`# ITEM ${item.itemId} ${item.name||''}`);
  out.push('top keys: '+Object.keys(item).join(','));
  out.push('document keys: '+Object.keys(item.document||{}).join(','));
  if(tabs) out.push('tabs: '+JSON.stringify(tabs).slice(0,600));
  for(const [docId,doc] of Object.entries(dm)){ out.push(`\n## DOC ${docId}\n`); out.push(docToMd(doc)); }
  return out.join('\n');
}
if(process.argv[1].endsWith('doc2md.mjs')){ const item=loadItem(process.argv[2]); console.log(itemToMd(item)); }

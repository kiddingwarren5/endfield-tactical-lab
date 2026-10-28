import crypto from 'node:crypto';
const HOST='https://zonai.skland.com';
let token='';
function sign(path,query,headers,secret){
  let c=path+(query||'')+headers.timestamp+JSON.stringify({platform:headers.platform,timestamp:headers.timestamp,dId:headers.dId??'',vName:headers.vName});
  const h=crypto.createHmac('sha256',secret).update(c).digest('hex');
  return crypto.createHash('md5').update(h).digest('hex');
}
export async function get(pathWithQuery,{retry=1}={}){
  const [path,query]=pathWithQuery.split('?');
  const headers={platform:'3',vName:'1.0.0',timestamp:Math.floor(Date.now()/1000).toString(),dId:''};
  headers.sign=sign(path,query,headers,token);
  const res=await fetch(HOST+pathWithQuery,{headers:{...headers,'User-Agent':'Mozilla/5.0','Origin':'https://wiki.skland.com','Referer':'https://wiki.skland.com/'}});
  const j=await res.json();
  if(res.status===401&&(j.code===10000||j.code===10003)&&retry>0){
    await refresh(); return get(pathWithQuery,{retry:retry-1});
  }
  return {status:res.status,json:j};
}
async function refresh(){
  token='';
  const r=await get('/web/v1/auth/refresh',{retry:0});
  if(r.json.code===0&&r.json.data?.token){token=r.json.data.token;return true}
  throw new Error('refresh failed '+JSON.stringify(r).slice(0,200));
}
if(process.argv[1].endsWith('skland_api.mjs')){
  const r=await get(process.argv[2]||'/web/v1/wiki/item/info?id=4');
  console.log(r.status, JSON.stringify(r.json).slice(0,parseInt(process.argv[3]||'1500')));
}

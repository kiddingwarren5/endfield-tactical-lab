// Web Worker：在后台跑排轴计算，主线程只收进度与结果，页面不冻结。
import {runJob} from './plan-jobs.js';
self.onmessage=e=>{ const {id,job}=e.data; try{ const value=runJob(job,f=>self.postMessage({id,type:'progress',value:f})); self.postMessage({id,type:'done',value}); }catch(err){ self.postMessage({id,type:'error',value:String(err?.message||err)}); } };

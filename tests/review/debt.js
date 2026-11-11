const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
(async()=>{const b=await chromium.launch();const out=[];
 await Promise.all(['NL','NL','NL','DE','US','JP'].map(async cc=>{const p=await b.newPage();
 await p.addInitScript(`(()=>{const k=8;const st=window.setTimeout;window.setTimeout=(f,ms,...a)=>st(f,(ms||0)/k,...a)})()`);
 await p.goto('http://localhost:8765/');await p.addScriptTag({content:AUTO});
 const r=await p.evaluate(async(cc)=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));randomize();CF.country=cc;CF.city=COUNTRIES[cc].cities[0];startCreated();await AUTO(20000);
  const o=[];let rn=0,g=0;while(S.alive&&g++<95){const ll=S.log.length;document.querySelector('#t-age').click();await sl(10);await AUTO(30000);
   const nw=S.log.slice(ll).map(x=>x.t||x[0]||'').join(' ');if(/rente/i.test(nw))rn++;
   if(ageY()%10===0&&S.eco)o.push(ageY()+':'+Math.round(S.eco.debt))}
  return cc+' debt '+o.join(' ')+' · jaren met rentenieuws '+rn+'/'+g+' · dood '+ageY()},cc);out.push(r);await p.close()}));
 console.log(out.join('\n'));await b.close()})();

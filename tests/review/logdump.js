const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:797}});
 await p.addInitScript(`(()=>{const k=6;const st=window.setTimeout;window.setTimeout=(f,ms,...a)=>st(f,(ms||0)/k,...a)})();`);
 await p.goto('http://localhost:8765/');await p.addScriptTag({content:AUTO});
 console.log(await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));randomize();CF.country='NL';CF.city='Eindhoven';CF.g='m';CF.first='Thijmen';CF.last='Jansen';startCreated();await sl(20);await AUTO(5000);
  for(let i=0;i<34&&S.alive;i++){document.querySelector('#t-age').click();await sl(10);await AUTO(30000);let k=0;while(S.alive&&Q.length&&k++<20){document.querySelector('#t-age').click();await sl(10);await AUTO(30000)}}
  return S.log.map(l=>`[${l.a}${l.c?' '+l.c:''}] ${l.t}`).join('\n')}));await b.close()})();

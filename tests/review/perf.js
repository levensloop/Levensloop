const { chromium, devices } = require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
 const cdp=await ctx.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:3}); // ruwweg een oudere telefoon
 const mk=JSON.parse(fs.readFileSync('monkey.json','utf8'));
 const t0=Date.now();await p.goto('http://localhost:8765/');await p.waitForFunction(()=>typeof STORE!=='undefined');const load=Date.now()-t0;
 const r=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const T=f=>{const t=performance.now();f();return Math.round(performance.now()-t)};const o={};
  newLife({first:'P',last:'Q',g:'m',country:'NL',city:'Eindhoven',by:1990,mode:'year',chaos:1});closeModal();show('game');
  // snel 45 jaar ouder zonder popups
  let adv=0;const ta=performance.now();for(let i=0;i<45&&S.alive;i++){advance();Q=[];adv++}o.advanceMs=Math.round((performance.now()-ta)/adv);
  o.age=ageY();o.log=S.log.length;o.lifeKB=Math.round(JSON.stringify(S).length/1024);
  o.render=T(()=>render());o.save1=T(()=>saveLife());
  // 6 levens in de opslag
  for(let i=0;i<5;i++){const c=JSON.parse(JSON.stringify(S));c.id='kopie'+i;STORE.lives[c.id]=c}
  o.save6=T(()=>saveLife());o.storeKB=Math.round(JSON.stringify(STORE).length/1024);
  o.sheetAct=T(()=>openSheet('Activiteiten',sheetAct));closeSheet();o.sheetRel=T(()=>openSheet('Relaties',sheetRel));closeSheet();o.sheetAssets=T(()=>openSheet('Bezit',sheetAssets));closeSheet();
  o.ageTap=T(()=>{advance();render();saveLife()});Q=[];closeModal();
  // quotum: hoeveel levens passen er?
  let n=6,err=null;try{while(n<40){const c=JSON.parse(JSON.stringify(S));c.id='q'+n;STORE.lives[c.id]=c;localStorage.setItem('levensloop.v1',JSON.stringify(STORE));n++}}catch(e){err=e.name}
  o.quota={levens:n,err,KB:Math.round(JSON.stringify(STORE).length/1024)};
  // wat doet het spel bij een volle opslag?
  const before=localStorage.getItem('levensloop.v1').length;S.money=123456;saveLife();const st=JSON.parse(localStorage.getItem('levensloop.v1'));o.naVol={opgeslagen:st.lives[S.id]&&st.lives[S.id].money===123456,snapsAndere:Object.values(st.lives).filter(l=>l.id!==S.id&&(l.snaps||[]).length).length,levens:Object.keys(st.lives).length};
  o.dom=document.querySelectorAll('*').length;return o});
 console.log('laadtijd ms',load,JSON.stringify(r));
 const m=await p.evaluate(()=>performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd);console.log('DOMContentLoaded',Math.round(m));await b.close()})();

// Fase 18: welke activiteiten staan aan op jonge leeftijd, en wat kosten ze? Opent elk activiteitenscherm en één niveau dieper.
const {chromium,devices}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13']});
await c.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1');localStorage.setItem('levensloop.uitleg','1')}catch(e){}});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.env.URL||'http://localhost:8767/');await p.waitForTimeout(500);
const res=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const out=[];
 const rowsNow=()=>[...document.querySelectorAll('.sheet .mrow, #sheet .mrow')].map(b=>({t:b.textContent.replace(/\s+/g,' ').trim().slice(0,140),dis:b.disabled,b}));
 for(const age of [3,6,9,11,13,15,17]){randomize();CF.country='NL';CF.city='Utrecht';startCreated();closeModal();Q.length=0;S.m=age*12+2;S.money=50;render();
  for(const A of ACTS){const min=typeof A[4]==='function'?0:A[4]||0;if(age<min)continue;try{A[5]()}catch(e){out.push({age,a:A[2],err:e.message});continue}await sl(15);
   const top=rowsNow();for(const r of top){if(r.dis)continue;
     const bad=/€|kost|betaal/i.test(r.t)&&age<12?'kost geld':/casino|gokken|bar\b|kroeg|club|rijles|rijbewijs|auto kopen|loterij|lot\b|tatoeage|piercing|plastisch|bier|wijn|sigaret|dating|daten|scharrel|seks|naar bed/i.test(r.t)&&age<16?'volwassen onderwerp':'';
     if(bad)out.push({age,a:A[2],row:r.t,why:bad})}
   closeSheet();await sl(5)}}
 return out});
fs.writeFileSync(process.argv[2]||'real18b.json',JSON.stringify(res,null,1));console.log('meldingen',res.length,'fouten',errs.slice(0,3));await b.close()})();

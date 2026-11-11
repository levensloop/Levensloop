const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:797},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1')}catch(e){}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));let n=50;
 const shot=async(name)=>{await p.waitForTimeout(350);await p.screenshot({path:`shots/${++n}-${name}.png`})};const ev=(f,a)=>p.evaluate(f,a);
 await p.goto('http://localhost:8765/');await p.addScriptTag({content:AUTO});
 await ev(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));newLife({first:'Thijmen',last:'de Vries',g:'m',country:'NL',city:'Eindhoven',by:1990,mode:'year',chaos:1});closeModal();show('game');S.m=30*12;S.money=400000;S.edu.stage='klaar';S.edu.lvl='hbo';render()});
 // solliciteren via menu
 const info=await ev(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const o=[];for(let t=0;t<12&&!S.job;t++){document.querySelector('#t-job').click();await sl(20);const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/^Banen/.test(((x.querySelector('b')||x).textContent||'').trim()));r.click();await sl(20);const rows=[...document.querySelectorAll('#sheet-b .mrow:not([disabled])')];const j=rows[t%rows.length];o.push(j.textContent.slice(0,30));j.click();await sl(30);if(t===0)window.__m1=document.querySelector('#modal').textContent.slice(0,300);await AUTO(20000);closeSheet()}return {tries:o.length,job:S.job&&(S.job.t||S.job.id),m1:window.__m1}});console.log('JOB',JSON.stringify(info).slice(0,500));
 await p.click('#t-job');await shot('beroep-met-baan');await ev(()=>{const r=document.querySelector('#sheet-b .mrow');r&&r.click()});await shot('mijn-baan');
 await ev(()=>{const s=document.querySelector('#sheet-b');s.scrollTop=s.scrollHeight});await shot('mijn-baan-eind');await ev(()=>closeSheet());
 // partner + persoon
 await ev(async()=>{if(!partner())addPartner();closeModal()});await p.click('#t-rel');await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/Vriend|Partner|Verloofd|Echtgeno/.test(x.textContent));r&&r.click()});await shot('partner');
 await ev(()=>{const s=document.querySelector('#sheet-b');s.scrollTop=s.scrollHeight});await shot('partner-eind');await ev(()=>closeSheet());
 // huis kopen-scherm, auto-model
 await p.click('#t-assets');await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/^Huizen/.test(((x.querySelector('b')||x).textContent||'').trim()));r.click()});await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/^Kopen/.test(((x.querySelector('b')||x).textContent||'').trim()));r&&r.click()});await shot('huis-kopen');
 await ev(()=>{const r=document.querySelector('#sheet-b .mrow:not([disabled])');r&&r.click()});await shot('huis-detail');await ev(()=>{closeModal();closeSheet()});
 await p.click('#t-assets');await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/^Auto/.test(((x.querySelector('b')||x).textContent||'').trim()));r.click()});await ev(()=>{const r=document.querySelector('#sheet-b .mrow:not([disabled])');r&&r.click()});await shot('auto-merk');await ev(()=>{const r=document.querySelector('#sheet-b .mrow:not([disabled])');r&&r.click()});await shot('auto-model');await ev(()=>{closeModal();closeSheet()});
 // bedrijf starten
 await p.click('#t-job');await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/Speciale/.test(x.textContent));r.click()});await shot('speciale-carrieres');await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/Ondernemer/.test(x.textContent));r&&r.click()});await shot('ondernemer');await ev(()=>{closeModal();closeSheet()});
 // defensie
 await ev(()=>{S.mil={br:'land',route:'off',spec:'inf',rank:2,st:'act',opl:0,perf:60,yrs:6,ryrs:2,sel:{},past:[],since:year()-6,med:['herinn','herinn','leeuw'],mis_n:2};milInit2();S.job=null;openSheet('Defensie',sheetMil,true)});await shot('defensie');await ev(()=>{const s=document.querySelector('#sheet-b');s.scrollTop=s.scrollHeight});await shot('defensie-eind');await ev(()=>{closeSheet();S.mil=null});
 // politiek als kamerlid
 await ev(()=>{polW();S.pol=mkPol(ptys()[2].id);S.pol.lvl='kamer';S.pol.pop=55;S.pol.steun=60;openSheet('Politiek',sheetPol,true)});await shot('politiek-kamerlid');await ev(()=>{const s=document.querySelector('#sheet-b');s.scrollTop=700});await shot('politiek-kamerlid-2');await ev(()=>closeSheet());
 // gevangenis
 await ev(()=>{jail(36,'inbraak');closeModal();render()});await shot('gevangenis-hoofd');await p.click('#t-act');await shot('gevangenis-activiteiten');await ev(()=>closeSheet());
 console.log('ERR',errs.slice(0,6));await b.close()})();

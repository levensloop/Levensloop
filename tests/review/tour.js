const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:797},deviceScaleFactor:1,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'});
 await ctx.addInitScript(()=>{Object.defineProperty(navigator,'standalone',{get:()=>true});try{localStorage.setItem('levensloop.hint','1')}catch(e){}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));let n=0;const notes=[];
 const shot=async(name)=>{await p.waitForTimeout(350);const f=`shots/${String(++n).padStart(2,'0')}-${name}.png`;await p.screenshot({path:f});notes.push(f)};
 const ev=(f,a)=>p.evaluate(f,a);
 await p.goto('http://localhost:8765/');await p.addScriptTag({content:AUTO});await shot('start-leeg');
 await p.click('#btn-new');await shot('nieuw-leven');await ev(()=>{document.querySelector('#cbody').scrollTop=9999});await shot('nieuw-leven-onder');
 await ev(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));CF.country='NL';CF.city='Eindhoven';CF.g='m';CF.first='Thijmen';CF.last='de Vries';startCreated();await sl(50)});await shot('geboorte-modal');
 await ev(async()=>{await AUTO(5000)});await shot('spel-baby');
 // opgroeien tot 9
 await ev(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<9;i++){document.querySelector('#t-age').click();await sl(20);await AUTO(20000)}});await shot('spel-kind');
 await p.click('#t-job');await shot('beroep-kind');await ev(()=>closeSheet());
 await p.click('#t-act');await shot('activiteiten-kind');await ev(()=>closeSheet());
 // gebeurtenis-modal vangen
 await ev(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<12;i++){document.querySelector('#t-age').click();await sl(60);if(!document.querySelector('#modal').hidden&&document.querySelectorAll('#modal .btn').length>=2)return;await AUTO(20000)}});await shot('gebeurtenis-keuze');
 await ev(async()=>{const bs=[...document.querySelectorAll('#modal .btn')];bs[0]&&bs[0].click();await new Promise(r=>setTimeout(r,100))});await shot('gebeurtenis-uitslag');
 await ev(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));await AUTO(20000);while(ageY()<30&&S.alive){document.querySelector('#t-age').click();await sl(20);await AUTO(30000)}});
 await ev(()=>{S.money=180000;if(!S.job&&typeof JOBS!=='undefined'){}render()});await shot('spel-30');
 await ev(()=>{const l=document.querySelector('#log');l.scrollTop=0});await shot('spel-30-log-boven');
 for(const [id,nm] of [['#t-job','beroep'],['#t-assets','bezit'],['#t-rel','relaties'],['#t-act','activiteiten'],['#h-menu','hoofdmenu']]){await p.click(id);await shot(nm);
   const h=await ev(()=>{const s=document.querySelector('#sheet-b');return [s.scrollHeight,s.clientHeight]});if(h[0]>h[1]+80){await ev(()=>{const s=document.querySelector('#sheet-b');s.scrollTop=s.clientHeight-60});await shot(nm+'-2')}
   if(h[0]>h[1]*2+80){await ev(()=>{const s=document.querySelector('#sheet-b');s.scrollTop=s.scrollHeight});await shot(nm+'-eind')}
   await ev(()=>closeSheet())}
 await p.click('#stats');await shot('profiel');await ev(()=>{closeModal();closeSheet()});
 const sheets=[['Financiën','sheetFinance'],['Wereld en economie','sheetWorld'],['Politiek','sheetPol'],['Prestaties','sheetAch'],['Tijdmachine','sheetRewind']];
 for(const [t,f] of sheets){const ok=await ev(([t,f])=>{if(typeof window[f]!=='function'&&!eval('typeof '+f+'==="function"'))return false;openSheet(t,eval(f),true);return true},[t,f]).catch(e=>String(e));await shot('sheet-'+f);
   const h=await ev(()=>{const s=document.querySelector('#sheet-b');return [s.scrollHeight,s.clientHeight]});if(h[0]>h[1]+80){await ev(()=>{const s=document.querySelector('#sheet-b');s.scrollTop=s.scrollHeight});await shot('sheet-'+f+'-eind')}await ev(()=>closeSheet())}
 // persoon, baan zoeken, winkel
 await p.click('#t-rel');await ev(()=>{const r=document.querySelector('#sheet-b .mrow');r&&r.click()});await shot('persoon');await ev(()=>closeSheet());
 await p.click('#t-job');await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/Banen|Vacatures/.test(x.textContent));r&&r.click()});await shot('banen');await ev(()=>closeSheet());
 await p.click('#t-assets');await ev(()=>{const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/Winkelen|Auto|Kopen/.test(x.textContent));r&&r.click()});await shot('winkel');await ev(()=>closeSheet());
 // minigames
 await ev(()=>{mgTap('Training','Tik zo snel als je kunt.',()=>{})});await shot('mg-tik');await ev(()=>closeModal());
 await ev(()=>{polW();S.pol=mkPol(ptys()[0].id);mgDebate('Debat',()=>{})});await shot('mg-debat');await ev(()=>closeModal());
 await ev(()=>{mgDodge({title:'Rijden',desc:'Ontwijk',em:'🚙',me:'🚙',obs:['🕳️','🪨'],secs:12,hard:1},()=>{})});await p.waitForTimeout(1500);await shot('mg-ontwijk');await ev(()=>closeModal());
 // dood
 await ev(()=>{die('een hartaanval')});await p.waitForTimeout(400);await ev(()=>{closeModal()});await shot('dood');
 await ev(()=>{const d=document.querySelector('#death');d.scrollTop=9999;const s=document.querySelector('#scr-death .scroll');if(s)s.scrollTop=9999});await shot('dood-onder');
 fs.writeFileSync('shots/notes.json',JSON.stringify({notes,errs}));console.log(notes.length,'shots',errs.slice(0,5));await b.close()})();

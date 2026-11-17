// Schermafbeeldingen van de schermen uit fase 5 op 375 en 430 punten breed. Gebruik: OUT=map node tour5.js
const { chromium, devices } = require('playwright');const OUT=process.env.OUT||'.';
(async()=>{const b=await chromium.launch();const errs=[];
 for(const [dev,w] of [['iPhone SE',375],['iPhone 14 Pro Max',430]]){const ctx=await b.newContext({...devices[dev],deviceScaleFactor:1});await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1')}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/');
  const shot=async n=>{await p.waitForTimeout(400);await p.screenshot({path:`${OUT}/${w}-${n}.png`})};
  await p.evaluate(()=>{randomize();CF.country='NL';CF.city='Eindhoven';CF.first='Maximiliaan-Alexander';CF.last='van den Heuvel-Oosterhout';startCreated()});await shot('uitleg');
  await p.evaluate(()=>{closeModal();for(let i=0;i<42;i++){S.st.health=90;Q.length=0;advance();Q.length=0}if(typeof ensureBigFam==='function')ensureBigFam();render();saveLife()});
  await shot('spel');
  await p.evaluate(()=>openSheet('Relaties',sheetRel));await shot('relaties');
  await p.evaluate(()=>{closeSheet();openSheet('Activiteiten',sheetAct)});await shot('activiteiten');
  await p.evaluate(()=>{closeSheet();openSheet('Wereld en economie',el=>{})});await shot('lange-titel');
  await p.evaluate(()=>{closeSheet();randomize();CF.country='BE';CF.city=COUNTRIES.BE.cities[0];startCreated();closeModal();for(let i=0;i<5;i++){Q.length=0;advance();Q.length=0}saveLife();const id=Object.keys(STORE.lives)[0];loadLife(id);saveLife();renderStart();show('start')});await shot('start');
  await p.evaluate(()=>{loadLife(STORE.last);S.st.health=0;die('een test');showDeath()});await p.waitForTimeout(300);await p.evaluate(()=>closeModal());await shot('dood');
  await p.evaluate(()=>{const s=document.querySelector('#scr-death .scroll')||document.querySelector('#scr-death');s.scrollTop=99999});await shot('dood-onder');
  await ctx.close()}
 console.log(errs.length?'JS-fouten: '+errs.join(' | '):'geen JS-fouten');await b.close()})();

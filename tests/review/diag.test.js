// Test van het meetscherm en de indeling (verbeterplan 2.1).
// Meetscherm opent via 5 tikken op de versie; app, startscherm en doodscherm vullen het hele venster (stand B).
const { chromium, devices } = require('playwright');
const SHOTS=process.env.SHOTS||'';
(async()=>{const b=await chromium.launch();let fail=0;const errs=[];const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
  for(const dev of ['iPhone 13','iPhone SE','iPhone 14 Pro Max']){
    const ctx=await b.newContext({...devices[dev]});await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1')}catch(e){}});
    const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/');
    const fill=async scr=>{const r=await p.evaluate(()=>{const ih=innerHeight,a=document.querySelector('#app').getBoundingClientRect();const s=[...document.querySelectorAll('#app>.screen')].find(x=>!x.hidden);const sb=s.getBoundingClientRect();
      const last=s.id==='scr-game'?document.querySelector('#scr-game .bottom2').getBoundingClientRect().bottom:sb.bottom;return {ih,top:a.top,bot:a.bottom,last}});
      ok(Math.abs(r.bot-r.ih)<1&&Math.abs(r.top)<1&&Math.abs(r.last-r.ih)<1,`${dev} ${scr}: app ${r.top}–${Math.round(r.bot)}, onderste deel tot ${Math.round(r.last)}, venster ${r.ih}`);
      if(SHOTS)await p.screenshot({path:`${SHOTS}/${dev.replace(/ /g,'')}-${scr}.png`})};
    await fill('startscherm');
    await p.evaluate(()=>{randomize();CF.country='NL';CF.city=COUNTRIES.NL.cities[0];startCreated();closeModal();saveLife()});await p.waitForTimeout(200);
    await fill('spel');
    if(dev==='iPhone 13'){
      await p.click('#h-menu');await p.waitForTimeout(400);
      const v=p.locator('.verline');ok(await v.count()===1,'versieregel in het menu: '+await v.textContent());
      for(let i=0;i<5;i++)await v.click();await p.waitForTimeout(100);
      ok(await p.locator('#diag').count()===1,'meetscherm opent na 5 tikken');
      const txt=await p.locator('#diag').textContent();ok(/innerHeight/.test(txt)&&/safe-area/.test(txt)&&/100vh/.test(txt),'maten staan erin');
      await p.click('#diag [data-g]');await p.click('#diag [data-x]');
      ok(await p.locator('#diag').count()===0&&await p.locator('#diag-guides').count()===1,'sluiten werkt, hulplijnen aan');
      await p.reload();await p.waitForTimeout(300);ok(await p.locator('#diag-guides').count()===1,'hulplijnen blijven bewaard');
      await p.evaluate(()=>{localStorage.removeItem('levensloop.guides');applyGuides()})}
    await p.evaluate(()=>{const id=STORE.last;if(!S||S.id!==id)loadLife(id);S.st.health=0;die('een test');showDeath();});await p.waitForTimeout(300);await p.evaluate(()=>closeModal());
    await fill('doodscherm');
    await ctx.close()}
  ok(!errs.length,'geen JS-fouten'+(errs.length?': '+[...new Set(errs)].join(' | '):''));
  await b.close();process.exit(fail?1:0)})();

// Test van het meetscherm (2.1): openen via 5 tikken op de versie, standen wisselen, hulplijnen, testapp met eigen opslag.
const { chromium, devices } = require('playwright');const fs=require('fs');
const SHOTS=process.env.SHOTS||'';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];
  await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1')}catch(e){}});p.on('pageerror',e=>errs.push(e.message));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
  await p.goto('http://localhost:8765/');
  await p.evaluate(()=>{localStorage.setItem('levensloop.hint','1');randomize();CF.country='NL';CF.city=COUNTRIES.NL.cities[0];startCreated();closeModal();saveLife()});
  await p.click('#h-menu');await p.waitForTimeout(400);
  const v=p.locator('.verline');ok(await v.count()===1,'versieregel in het menu: '+await v.textContent());
  for(let i=0;i<5;i++)await v.click();await p.waitForTimeout(100);
  ok(await p.locator('#diag').count()===1,'meetscherm opent na 5 tikken');
  const txt=await p.locator('#diag').textContent();ok(/innerHeight/.test(txt)&&/safe-area/.test(txt)&&/100vh/.test(txt),'maten staan erin');
  if(SHOTS)await p.screenshot({path:SHOTS+'/diag.png'});
  for(const k of ['B','C','D','E','A']){await p.click(`#diag [data-l="${k}"]`);await p.waitForTimeout(120);
    const st=await p.evaluate(()=>({lay:curLayout(),css:document.getElementById('lay-css').textContent.length,app:document.querySelector('#app').getBoundingClientRect().height,tab:document.querySelector('.tabbar').getBoundingClientRect().bottom,ih:innerHeight}));
    ok(st.lay===k,`stand ${k}: #app ${Math.round(st.app)} hoog, tabbalk onderkant ${Math.round(st.tab)}, venster ${st.ih}`)}
  await p.click('#diag [data-l="D"]');await p.click('#diag [data-g]');await p.click('#diag [data-x]');
  ok(await p.locator('#diag').count()===0,'sluiten werkt');ok(await p.locator('#diag-guides').count()===1,'hulplijnen aan');
  await p.evaluate(()=>closeSheet());if(SHOTS)await p.screenshot({path:SHOTS+'/game-D-guides.png'});
  await p.reload();await p.waitForTimeout(300);
  ok(await p.evaluate(()=>curLayout())==='D'&&await p.locator('#diag-guides').count()===1,'stand en hulplijnen blijven bewaard na herstart');
  await p.evaluate(()=>{localStorage.removeItem('levensloop.layout');localStorage.removeItem('levensloop.guides')});
  const before=await p.evaluate(()=>localStorage.getItem('levensloop.v1'));
  // testapp
  const t=await ctx.newPage();t.on('pageerror',e=>errs.push('test: '+e.message));await t.goto('http://localhost:8765/test.html');await t.waitForTimeout(300);
  const tt=await t.evaluate(()=>({key:LS_KEY,lives:Object.keys(STORE.lives).length,test:!!window.LEVENSLOOP_TEST,sb:document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').content,ver:document.title}));
  ok(tt.key==='levensloop.test.v1'&&tt.lives===0&&tt.sb==='black-translucent','testapp: eigen opslag, geen echte levens, statusbalk '+tt.sb);
  await t.evaluate(()=>{randomize();CF.country='NL';CF.city=COUNTRIES.NL.cities[0];startCreated();closeModal();saveLife()});
  ok(await p.evaluate(()=>localStorage.getItem('levensloop.v1'))===before,'testapp laat de echte opslag ongemoeid');
  ok(!errs.length,'geen JS-fouten'+(errs.length?': '+errs.join(' | '):''));
  await b.close();process.exit(fail?1:0)})();

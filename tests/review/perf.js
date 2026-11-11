// Snelheid en opslag: met 3× vertraagde processor (ruwweg een oudere telefoon).
// Meet laden, ouder worden, opslaan, en hoeveel lopende levens van 60 jaar in de opslag passen (doel: 30).
// Eindigt met foutcode 1 als er minder dan MIN (standaard 30) levens passen.
const { chromium, devices } = require('playwright');
const MIN=+process.env.MIN||30;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1')}catch(e){}});const p=await ctx.newPage();
 const cdp=await ctx.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:3});
 const t0=Date.now();await p.goto(process.env.URL||'http://localhost:8765/');await p.waitForFunction(()=>typeof STORE!=='undefined');const load=Date.now()-t0;
 const r=await p.evaluate(async()=>{const T=f=>{const t=performance.now();f();return Math.round(performance.now()-t)};const o={};
  newLife({first:'P',last:'Q',g:'m',country:'NL',city:'Eindhoven',by:1990,mode:'year',chaos:1});closeModal();show('game');
  let adv=0;const ta=performance.now();for(let i=0;i<60&&S.alive;i++){advance();Q=[];S.st.health=Math.max(S.st.health,60);adv++}o.ouderWordenMs=Math.round((performance.now()-ta)/adv);
  o.leeftijd=ageY();o.render=T(()=>render());o.opslaan1=T(()=>saveLife());
  o.ouderWordenTikMs=T(()=>{advance();render();saveLife()});Q=[];closeModal();
  const kb=()=>{let n=0;for(const k of Object.keys(localStorage))n+=localStorage.getItem(k).length;return Math.round(n/1024)};
  o.levenKB=kb();
  // hoeveel lopende levens van 60 jaar passen er?
  const base=JSON.stringify(S);let n=1;
  for(;n<45;n++){const c=JSON.parse(base);c.id='kopie'+n;STORE.lives[c.id]=c;if(!lsSave()||LSFULL){STORE.lives[c.id]&&delete STORE.lives[c.id];break}}
  closeModal();o.passen=n;o.opslagKB=kb();o.opslaanAllesMs=T(()=>lsSave());
  return o});
 console.log('laadtijd ms',load,JSON.stringify(r));
 // en opnieuw laden met al die levens
 const t1=Date.now();await p.reload();await p.waitForFunction(()=>typeof STORE!=='undefined');const n2=await p.evaluate(()=>Object.keys(STORE.lives).length);
 console.log(`herladen met ${n2} levens: ${Date.now()-t1} ms`);
 await b.close();const ok=r.passen>=MIN;console.log(ok?`✓ ${r.passen} levens van ${r.leeftijd} jaar passen (doel ${MIN})`:`✗ maar ${r.passen} levens passen (doel ${MIN})`);process.exit(ok?0:1)})();

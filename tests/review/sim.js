// Monkey-simulatie: speelt volledige levens via de echte knoppen en verzamelt fouten en statistieken
const { chromium, devices } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8').replace("const q=s=>m.querySelector(s);","const q=s=>m.querySelector(s);if(q('#tb')){if(!q('#tb').disabled)q('#tb').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true}));await sl(12);continue}if(q('#amt')&&/Maximaal -|Maximaal [^0-9]*0$/.test(m.textContent.slice(0,200))){window.__NEG=(window.__NEG||[]);window.__NEG.push(m.textContent.slice(0,90));closeModal();await sl(20);continue}");
const WARP=+process.env.WARP||6, LIVES=+process.env.LIVES||2, PAR=+process.env.PAR||4, MONKEY=process.env.MONKEY!=='0';
const CC=(process.env.CC||'NL,US,DE,UK,FR,BE,JP,BR,MA,TR,ES,IT,CA,AU,MX,ZA,ID').split(',');
const OUT=process.env.OUT||'sim.json';
const warp=`(()=>{const k=${WARP};const st=window.setTimeout,si=window.setInterval;window.setTimeout=(f,ms,...a)=>st(f,(ms||0)/k,...a);window.setInterval=(f,ms,...a)=>si(f,Math.max(4,(ms||0)/k),...a);
 const p0=performance.now(),d0=Date.now();const pn=performance.now.bind(performance),dn=Date.now.bind(Date);performance.now=()=>p0+(pn()-p0)*k;Date.now=()=>Math.round(d0+(dn()-d0)*k);
 const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>raf(t=>f(performance.now()))})();`;
async function life(b,cc,idx){const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push({m:e.message,s:(e.stack||'').split('\n').slice(1,3).join(' | ').slice(0,260)}));p.on('console',m=>{if(m.type()==='error'&&!/fonts|Failed to load resource|net::/.test(m.text()))errs.push({m:'console: '+m.text().slice(0,200)})});
  if(WARP>1)await p.addInitScript(warp);
  await p.goto('http://localhost:8765/');await p.addScriptTag({content:AUTO});
  const r=await p.evaluate(async({cc,MONKEY})=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const $=s=>document.querySelector(s);
    const res={cc,years:[],ev:{},stuck:[],acts:{},sizes:[],t0:performance.now()};
    try{localStorage.setItem('levensloop.hint','1')}catch(e){}
    const c=COUNTRIES[cc];const g=pick(['m','v','x']);randomize();CF.country=cc;CF.city=pick(c.cities);CF.g=g;CF.chaos=1;startCreated();await sl(30);
    const bad=/verwijder|hoofdmenu|opnieuw beginnen|nieuw leven|afsluiten|stoppen met dit leven|geef je over|tempo|tijdmachine|lopende levens|terugspoelen|begraafplaats|mijn levens/i;
    const auto=async(tag)=>{const lg=await AUTO(45000);for(const t of lg){if(t==='TIMEOUT'){res.stuck.push({tag,age:ageY(),t:(($('#modal .ptitle')||$('#modal h3')||{}).textContent||'').slice(0,60),txt:$('#modal').textContent.slice(0,160)});closeModal()}else if(tag==='age'&&t){const k=t;res.ev[k]=(res.ev[k]||0)+1}}return lg};
    await auto('start');
    let guard=0;
    while(S&&S.alive&&guard++<140){
      // monkey: acties via de echte menu's
      if(MONKEY&&ageY()>=4){const n=Math.random()<.65?1+Math.floor(Math.random()*3):0;
        for(let i=0;i<n&&S.alive;i++){const tab=pick(['#t-job','#t-assets','#t-rel','#t-act','#t-act','#h-menu']);$(tab).click();await sl(15);
          for(let d=0;d<4;d++){if(!$('#modal').hidden){await auto('act');continue}if($('#sheet').hidden)break;const rows=[...document.querySelectorAll('#sheet-b .mrow:not([disabled]),#sheet-b .btn:not([disabled]),#sheet-b button.tile')].filter(x=>!bad.test(x.textContent)&&x.offsetParent);if(!rows.length)break;
            const rw=pick(rows);const lbl=($('#sheet-t')||{}).textContent||tab;res.acts[lbl]=(res.acts[lbl]||0)+1;try{rw.click()}catch(e){}await sl(20);if(!$('#modal').hidden)await auto('act')}
          closeModal();closeSheet();await sl(10)}}
      if(!S.alive)break;
      const before=S.log.length;$('#t-age').click();await sl(15);await auto('age');
      let n=0;while(S.alive&&Q.length&&n++<30){$('#t-age').click();await sl(15);await auto('age')}
      if(Q.length&&S.alive){res.stuck.push({tag:'queue',age:ageY(),t:Q.map(q=>q.id).join(',')});Q.length=0}
      const a=ageY();res.years.push({a,mo:Math.round(S.money),nw:Math.round(netWorth()),hp:S.st.happy,he:S.st.health,job:S.job?S.job.t||S.job.id:(S.pol&&S.pol.lvl!=='lid'?'pol:'+S.pol.lvl:S.mil?'mil':S.biz&&S.biz.length?'biz':''),log:S.log.length-before,fame:Math.round(S.fame||0),edu:S.edu&&S.edu.stage,jail:!!(S.crim&&S.crim.jail),cc:S.p.country});
      if(a%20===0){const j=JSON.stringify(S);res.sizes.push({a,kb:Math.round(j.length/1024),snaps:Math.round(JSON.stringify(S.snaps||[]).length/1024),log:S.log.length})}}
    res.dead=S?{age:S.died??ageY(),cause:S.cause,alive:S.alive}:null;res.ms=Math.round(performance.now()-res.t0);
    res.neg=window.__NEG||[];res.ach=(S.ach||[]).length;res.fin={pol:S.pex?S.pex.t:(S.pol?S.pol.lvl:''),mil:!!(S.mil||S.pmil),kids:(S.rel||[]).filter(p=>p.role==='kind').length,partner:!!(S.rel||[]).find(p=>p.role==='partner'),biz:(S.biz||[]).length,props:(S.props||[]).length,dict:!!S.dict,jobs:(S.jobs||[]).length,deg:(S.edu.deg||[]).length,ill:(S.ill||[]).length};res.store=Math.round(JSON.stringify(STORE).length/1024);res.screen=curScreen;res.deathTxt=($('#death')||{}).textContent?$('#death').textContent.slice(0,200):'';
    const t1=performance.now();saveLife();res.saveMs=Math.round(performance.now()-t1);return res},{cc,MONKEY}).catch(e=>({cc,crash:String(e).slice(0,300)}));
  r.errs=errs.slice(0,30);r.nerr=errs.length;await ctx.close();return r}
(async()=>{const b=await chromium.launch();const jobs=[];for(let i=0;i<LIVES;i++)for(const cc of CC)jobs.push([cc,i]);const out=[];let k=0;
  const worker=async()=>{while(k<jobs.length){const [cc,i]=jobs[k++];const t=Date.now();const r=await life(b,cc,i);out.push(r);fs.writeFileSync(OUT,JSON.stringify(out));
    console.log(`${cc}#${i} ${r.crash?'CRASH '+r.crash:`dood ${r.dead&&r.dead.age} (${r.dead&&r.dead.cause}) · jaren ${r.years.length} · fouten ${r.nerr} · vast ${r.stuck.length} · ${Math.round((Date.now()-t)/1000)}s`}`)}};
  await Promise.all(Array.from({length:PAR},worker));await b.close()})();

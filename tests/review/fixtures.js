// Maakt testlevens met de HUIDIGE versie en bewaart de ruwe localStorage in tests/fixtures/.
// Draai dit alleen opnieuw als je bewust nieuwe fixtures wilt; de bestaande zijn gemaakt met versie 20261105-2229.
// Gebruik: (testserver op :8765 draaien) node fixtures.js
const { chromium, devices } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
const DIR=path.join(__dirname,'..','fixtures');fs.mkdirSync(DIR,{recursive:true});
const URL=process.env.URL||'http://localhost:8765/';
const WARP=6;
const warp=`(()=>{const k=${WARP};const st=window.setTimeout,si=window.setInterval;window.setTimeout=(f,ms,...a)=>st(f,(ms||0)/k,...a);window.setInterval=(f,ms,...a)=>si(f,Math.max(4,(ms||0)/k),...a);
 const p0=performance.now(),d0=Date.now();const pn=performance.now.bind(performance),dn=Date.now.bind(Date);performance.now=()=>p0+(pn()-p0)*k;Date.now=()=>Math.round(d0+(dn()-d0)*k);
 const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>raf(t=>f(performance.now()))})();`;

// Speelt één leven in de pagina. sc = scenario.
async function play(p,sc){return p.evaluate(async(sc)=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const $=s=>document.querySelector(s);
  const auto=async()=>{const lg=await AUTO(45000);if(lg.includes('TIMEOUT'))closeModal()};
  const clickBtn=async re=>{const b=[...document.querySelectorAll('#modal .btn')].find(x=>re.test(x.textContent));if(b){b.click();await sl(40)}await auto()};
  const bad=/verwijder|hoofdmenu|opnieuw beginnen|nieuw leven|afsluiten|stoppen met dit leven|geef je over|tempo|tijdmachine|lopende levens|terugspoelen|begraafplaats|mijn levens|emigr|ontslag|opzeggen|scheiden|uit elkaar/i;
  const monkey=async()=>{const n=Math.random()<.6?1+Math.floor(Math.random()*2):0;
    for(let i=0;i<n&&S.alive;i++){const tab=['#t-job','#t-assets','#t-rel','#t-act','#t-act'][Math.floor(Math.random()*5)];$(tab).click();await sl(15);
      for(let d=0;d<4;d++){if(!$('#modal').hidden){await auto();continue}if($('#sheet').hidden)break;const rows=[...document.querySelectorAll('#sheet-b .mrow:not([disabled]),#sheet-b .btn:not([disabled]),#sheet-b button.tile')].filter(x=>!bad.test(x.textContent)&&x.offsetParent);if(!rows.length)break;
        try{rows[Math.floor(Math.random()*rows.length)].click()}catch(e){}await sl(20);if(!$('#modal').hidden)await auto()}
      closeModal();closeSheet();await sl(10)}};
  const c=COUNTRIES[sc.cc];randomize();CF.country=sc.cc;CF.city=c.cities[0];CF.g=sc.g;CF.first=sc.first;CF.chaos=1;startCreated();await sl(30);await auto();
  let guard=0;
  while(S&&S.alive&&ageY()<sc.to&&guard++<120){
    if(sc.monkey&&ageY()>=6)await monkey();
    if(sc.keepAlive)S.st.health=Math.max(S.st.health,55);
    const a=ageY();
    if(sc.job&&a>=sc.job&&!S.job&&!S.pol?.lvl?.match(/kamer|minister|premier/)){setJob(sc.jobId,1);L('(testlevens) baan gekregen')}
    if(sc.party&&a===sc.party&&!(S.pol&&S.pol.party)){joinParty(ptys()[0].id);await sl(30);await clickBtn(/Lid worden/)}
    if(sc.house&&a===sc.house&&!(S.props||[]).length){cash(Math.max(0,600000-S.money));const h=market().slice().sort((x,y)=>x.price-y.price)[0];doBuy(h,h.price,0);await sl(30);await auto();closeSheet()}
    $('#t-age').click();await sl(15);await auto();let n=0;while(S.alive&&Q.length&&n++<30){$('#t-age').click();await sl(15);await auto()}
  }
  if(sc.retire&&S.alive&&S.job)retire();
  if(sc.die&&S.alive){S.st.health=0;let n=0;while(S.alive&&n++<40){$('#t-age').click();await sl(15);await auto()}}
  if(sc.inherit&&!S.alive){const k=living('kind').find(k=>pAge(k)>=1);if(k){inherit(k.id);await sl(30);await auto()}}
  closeModal();closeSheet();saveLife();
  return {name:S.p.first+' '+S.p.last,age:ageY(),alive:S.alive,job:S.job&&S.job.id,pol:S.pol&&(S.pol.lvl+' '+S.pol.party),props:(S.props||[]).length,money:Math.round(S.money),gen:S.gen,lives:Object.keys(STORE.lives).length}},sc)}

const SC={
  kind:{cc:'NL',g:'v',first:'Fixkind',to:9},
  werkende:{cc:'NL',g:'m',first:'Fixwerk',to:40,job:22,jobId:'dev',keepAlive:true,monkey:true},
  gepensioneerde:{cc:'NL',g:'v',first:'Fixpensioen',to:68,job:24,jobId:'leraar',party:30,house:35,retire:true,keepAlive:true,monkey:true},
  overleden:{cc:'US',g:'m',first:'Fixdood',to:62,die:true,inherit:true,keepAlive:true,monkey:true},
};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(warp);await p.goto(URL);await p.addScriptTag({content:AUTO});
  const ver=await p.evaluate(()=>typeof APP_VERSION!=='undefined'?APP_VERSION:'?');
  await p.evaluate(()=>{try{localStorage.setItem('levensloop.hint','1')}catch(e){}});
  const dump=()=>p.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o});
  const ids={};
  for(const [k,sc] of Object.entries(SC)){const before=await p.evaluate(()=>Object.keys(STORE.lives));
    let r,tries=0;
    for(;;){r=await play(p,sc);const after=await p.evaluate(()=>Object.keys(STORE.lives));ids[k]=after.filter(x=>!before.includes(x));
      // het overleden-scenario moet een afgesloten leven (begraafplaats) plus een erfgenaam opleveren; anders opnieuw
      if(!sc.inherit||ids[k].length>1||++tries>=6)break;
      console.log(k,'geen kind om mee verder te spelen, opnieuw');await p.evaluate(ids=>{for(const id of ids)delete STORE.lives[id];lsSave()},ids[k])}
    console.log(k,JSON.stringify(r),'nieuwe sleutels:',ids[k].length);
    await p.evaluate(()=>{renderStart();show('start')});}
  const all=await dump();const store=JSON.parse(all['levensloop.v1']);
  const write=(name,ls,lives)=>{fs.writeFileSync(path.join(DIR,name+'.json'),JSON.stringify({version:ver,made:new Date().toISOString().slice(0,10),lives,localStorage:ls}));
    console.log(name+'.json',Math.round(JSON.stringify(ls).length/1024)+' KB')};
  for(const k of Object.keys(SC)){const sub={lives:{},meta:store.meta};for(const id of ids[k])sub.lives[id]=store.lives[id];sub.last=ids[k].find(id=>!sub.lives[id].done)||ids[k][0];
    write(k,Object.assign({},all,{'levensloop.v1':JSON.stringify(sub)}),ids[k].length)}
  write('alles',all,Object.keys(store.lives).length);
  console.log('versie',ver,'· JS-fouten tijdens maken:',errs.length,errs.slice(0,5));
  await b.close()})();

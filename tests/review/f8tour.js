// Fase 8: klikt in elke nieuwe situatie door alle rijen van de nieuwe schermen en speelt elke nieuwe gebeurtenis
// een paar keer met willekeurige keuzes. Faalt bij JS-fouten of fouten die het vangnet opving.
// Gebruik: (testserver op :8765) node f8tour.js
const { chromium, devices } = require('playwright');const fs=require('fs'),path=require('path');
const URL=process.env.URL||'http://localhost:8765/';
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8').replace("const q=s=>m.querySelector(s);","const q=s=>m.querySelector(s);if(q('#tb')){if(!q('#tb').disabled)q('#tb').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true}));await sl(12);continue}if(q('.memb')){const bs=[...m.querySelectorAll('.memb:not([disabled])')];if(bs.length)bs[Math.floor(Math.random()*bs.length)].click();await sl(60);continue}");
// [naam, land, afkomst, opzet (in de pagina), schermen [[titel, functienaam, extra argument-code]], gebeurtenis-voorvoegsels]
const SC=[
 ['koningshuis','NL','kon',`S.m=22*12;`,[['Koninklijk huis','sheetRoyal']],['roy_']],
 ['vorst','UK','kon',`S.m=40*12;S.roy.mon='me';S.roy.reign=year()-5;S.rel.push(mkPerson('kind','v',S.m-20*12,{rel:80}));`,[['Koninklijk huis','sheetRoyal']],['roy_']],
 ['adel','FR','adel',`S.m=30*12;S.adel.lg=1;S.adel.lgOwn=1;`,[['Adel','sheetAdel']],['adel_']],
 ['astronaut','US','',`S.m=30*12;S.st.health=95;S.st.smarts=90;S.edu.deg.push({ty:'wo',f:'techniek'});S.ast={st:'act',rank:2,yrs:4,mis:[],fit:80,ag:astAg(),y0:year()};`,[['Ruimtevaart','sheetAst'],['Speciale carrières','sheetSpecial']],['ast_']],
 ['agent','NL','',`S.m=30*12;S.st.smarts=80;S.spy={st:'act',rank:1,yrs:2,perf:60,heat:20,mis:1,cover:'Vertaler bij een vertaalbureau'};S.rel.push(mkPerson('partner','v',S.m-30*12,{st:'relatie',rel:70}));`,[['Inlichtingendienst','sheetSpy']],['spy_']],
 ['sekte','NL','',`S.m=35*12;S.money=3e6;S.sekte={n:'De Laatste Getijde',ty:4,em:'🔮',mem:120,loy:60,insp:40,don:1,yrs:2,lg:0};`,[['Beweging','sheetSekte']],['sek_']],
 ['straat','NL','',`S.m=22*12;S.str={st:'act',lvl:2,rep:40,turf:1,crew:2,yrs:2};S.home={k:'ouders'};`,[['Straathandel','sheetStr']],['str_']],
 ['school','NL','',`S.m=14*12;S.edu.stage='middel';S.edu.lvl='havo';S.edu.len=5;S.edu.yrs=1;sch().cl=[{id:'band',yrs:1,r:0}];`,[['Schoolleven','sheetSchoolLife'],['School','sheetSchool']],['scl_']],
 ['identiteit','NL','',`S.m=20*12;S.flags.pref=S.p.g==='v'?'vrouwen':'mannen';for(let i=0;i<2;i++)addFriend();`,[['Identiteit','sheetIdentity']],['idn_']],
 ['identiteit-MA','MA','',`S.m=20*12;S.flags.pref='beide';addFriend();`,[['Identiteit','sheetIdentity']],['idn_']],
 ['erfstukken','NL','',`S.m=40*12;S.money=200000;const C_=coll();C_.it.push(mkErf(3),mkErf(1));C_.fam.push(Object.assign(mkErf(2),{hold:living('moeder')[0].id}));collAdd('munt',0);collAdd('munt',1);collAdd('munt',1);S.items.push({id:uid(),em:'⌚',ico:['horloges','x','y','Nieuw'],name:'Testhorloge',variant:'Nieuw',buy:5000,value:4000,cond:100,ap:.02,vol:.03,up:0,yr:year()});S.rel.push(mkPerson('kind','m',S.m-20*12,{rel:70}));`,[['Verzamelingen','sheetColl'],['Postzegels','sheetSet',"'postz'"],['Munten','sheetSet',"'munt'"]],['erf_']],
 ['spookhuis','NL','',`S.m=40*12;S.money=3e6;const h=mkListing(5);h.ghost={g:2,lvl:2,rel:40,clue:2,rest:0};const p=buyHouse(h,false);S.home={k:'eigen',pid:p.id};window.__p=p;addFriend();`,[['Huis','sheetProp','__p']],['spk_']],
 ['exotisch','US','',`S.m=30*12;S.money=200000;const h=mkListing(6);const p=buyHouse(h,false);S.home={k:'eigen',pid:p.id};const q=addPet('tijger','Sultan',{k:15000,life:[15,20],br:'Tijger'});q.exo=1;q.ill=1;window.__p=q;`,[['Huisdieren','sheetPets'],['Sultan','sheetPerson','__p']],['exo_']],
 ['god','NL','',`S.m=30*12;S.settings.god=1;window.__p=living('moeder')[0];`,[['Moeder','sheetPerson','__p'],['Hoofdmenu','sheetMain']],[]],
];
const sl=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();let fail=0;
  for(const [nm,cc,afk,setup,sheets,pre] of SC){const ctx=await b.newContext({...devices['iPhone 13']});await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1');localStorage.setItem('levensloop.uitleg','1')}catch(e){}});
    const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(URL);await p.addScriptTag({content:AUTO});
    const r=await p.evaluate(async({cc,afk,setup,sheets,pre})=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));
      randomize();CF.country=cc;CF.city=COUNTRIES[cc].cities[0];CF.chaos=1;CF.afk=afk;startCreated();await AUTO(8000);Q.length=0;eval(setup);saveLife();
      const snap=JSON.stringify(S);let rows=0,evs=0;
      for(const [t,fn,arg] of sheets){for(let i=0;i<30;i++){S=JSON.parse(snap);if(arg&&arg.startsWith('__'))window[arg]=arg==='__p'?(S.props.find(x=>x.id===window.__p.id)||S.rel.find(x=>x.id===window.__p.id)):null;
          closeSheet();closeModal();Q.length=0;openSheet(t,el=>window[fn](el,arg?eval(arg):undefined));await sl(20);const rs=[...document.querySelectorAll('#sheet-b .mrow:not([disabled]),#sheet-b .mfoot:not([disabled])')].filter(x=>!/Opgeven|Tijdmachine|Startscherm|Reservekopie|Andere levens|Nieuw leven/.test(x.textContent));if(i>=rs.length)break;
          rs[i].click();rows++;await sl(30);await AUTO(6000);for(let k=0;k<3&&Q.length;k++){processQ();await AUTO(5000)}}}
      const ids=Object.keys(EV).filter(id=>pre.some(x=>id.startsWith(x)));
      for(const id of ids)for(let k=0;k<3;k++){S=JSON.parse(snap);closeSheet();closeModal();Q.length=0;const e=EV[id];let c={};try{c=e.ctx?e.ctx()||{}:{}}catch(x){c={}}
        if(id==='erf_erfstuk')c={x:mkErf(2)};if(/^exo_/.test(id))c={id:living('huisdier').find(x=>x.exo)?.id};if(id==='roy_abdicatie'){const M=living(['moeder','vader'])[0];S.roy.mon=M.id;c={id:M.id}}if(id==='roy_toestemming'||id==='idn_trouwen'||id==='idn_tijd'){const pt=partner()||(()=>{const x=mkPerson('partner','v',S.m-25*12,{st:'verloofd',rel:70});S.rel.push(x);return x})();pt.st='verloofd';c={id:id==='idn_tijd'?living(['moeder','vader'])[0].id:pt.id}}
        if(id==='ast_lancering'||id==='ast_missie'){S.ast.next='station';c={k:'station'}}if(id==='spy_gevangen')c={cc:'TR'};if(id==='sek_profetie')S.sekte.eind=year();
        Q.push({id,c});processQ();evs++;await AUTO(6000);for(let j=0;j<3&&Q.length;j++){processQ();await AUTO(5000)}}
      return {rows,evs,errs:(typeof errList==='function'?errList():[]).map(e=>e.m||e.msg||JSON.stringify(e)).slice(0,5)}},{cc,afk,setup,sheets,pre});
    const bad=errs.concat(r.errs);if(bad.length)fail++;console.log(`${bad.length?'✗':'✓'} ${nm}: ${r.rows} rijen, ${r.evs} gebeurtenissen${bad.length?' · FOUT: '+[...new Set(bad)].slice(0,4).join(' | '):''}`);await ctx.close()}
  await b.close();console.log(fail?`f8-rondgang: ${fail} met fouten`:'f8-rondgang: alles in orde');process.exit(fail?1:0)})();

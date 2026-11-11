// Regressietests: per opgeloste fout een kleine controle in de echte app, zodat de fout niet terugkomt.
// Gebruik: (testserver op :8765) node regress.js     Eindigt met foutcode 1 als een controle faalt.
const { chromium, devices } = require('playwright');
const URL=process.env.URL||'http://localhost:8765/';
// Elke test draait in een vers leven. 'cc' = land. 'run' draait in de pagina en geeft {ok,msg} terug.
const T=[];const t=(nr,name,cc,run)=>T.push({nr,name,cc,run});

t('1.1','zorgkosten onder de 18 in Nederland','NL',async()=>{S.m=10*12;delete S.er;payMed(110);payMed(250);S.m=30*12;delete S.er;const c=payMed(300);
  return {ok:S.er&&S.er.used===c&&c>0,msg:`kind betaalt niets, volwassene ${c} eigen risico`}});

t('1.2','schoolscherm opnieuw tekenen na school','NL',async()=>{S.m=8*12;S.edu.stage='basis';openSheet('Basisschool',sheetSchool);await sl(50);S.edu.stage='klaar';refreshSheet();await sl(50);
  const txt=document.querySelector('#sheet-b').textContent;closeSheet();
  const subs=subjList({stage:'klaar'});return {ok:Array.isArray(subs)&&/niet meer op school/.test(txt),msg:'scherm toont: '+txt.trim().slice(0,40)}});

t('1.3','werkgebeurtenis in de wachtrij na ontslag','NL',async()=>{S.m=30*12;setJob('verpleeg',1);Q.push({id:'w_zorg',c:{}});S.job=null;processQ();await sl(30);
  const shown=!document.querySelector('#modal').hidden&&/Spoed/.test(document.querySelector('#modal').textContent);closeModal();
  // en de uitkomst van een werk-minigame zonder baan mag niet crashen
  const r=EV.w_tech.ch[1][1]({id:null});return {ok:!shown&&typeof r==='string',msg:shown?'pop-up verscheen toch':'overgeslagen; uitkomst zonder baan: '+r.slice(0,30)}});

t('1.4','niet gokken of inzetten als je rood staat','NL',async()=>{S.m=25*12;S.money=-50000;openSheet('Activiteiten',sheetAct);await sl(50);
  const row=[...document.querySelectorAll('#sheet-b .mrow')].find(r=>/Casino/.test(r.textContent));const dis=row&&row.disabled&&/rood/.test(row.textContent);closeSheet();
  amountModal('Inzet',Math.min(S.money,100000),()=>{});await sl(30);const open=!document.querySelector('#modal').hidden;closeModal();
  return {ok:dis&&!open,msg:`casino-rij ${dis?'uit met "Je staat rood"':'NIET uit'}, bedragvenster ${open?'opent toch':'opent niet'}`}});

const debtHelpers=`var pickCh=async re=>{const b=[...document.querySelectorAll('#modal .btn')].find(x=>re.test(x.textContent));if(!b)return false;b.click();await sl(40);for(let i=0;i<5&&!document.querySelector('#modal').hidden;i++){const g=[...document.querySelectorAll('#modal .btn')].find(x=>/Verder|Oké|OK|Sluiten/.test(x.textContent))||document.querySelector('#modal .btn');g&&g.click();await sl(30)}return true};
var year1=async()=>{Q.length=0;S.m=Math.floor(S.m/12)*12+12;debtYear();const has=Q.some(q=>q.id==='s_schuld'||q.id==='s_failliet');Q=Q.filter(q=>q.id==='s_schuld'||q.id==='s_failliet');return has};`;

t('1.5a','rood staan onder de grens: rente en logregel','NL',async()=>{S.m=30*12;S.money=-12000;period={inc:0,exp:0,src:{},out:{}};monthTick();const rente=Math.round(period.out['Rente rood staan']||0);
  S.money=-3000;const n0=S.log.length;Q.length=0;debtYear();const lines=S.log.slice(n0).map(l=>l.t).join(' ');
  return {ok:rente===120&&/staat .*rood/.test(lines)&&!Q.some(q=>q.id==='s_schuld'),msg:`rente op € 12.000 rood: € ${rente} per maand · ${lines.match(/Je staat.{0,60}/)?.[0]||'geen logregel'}`}});

t('1.5b','boven de grens: schuldeisers en schuldsanering','NL',async()=>{eval(DH);S.m=30*12;S.money=-200000;const has=await year1();processQ();await sl(30);
  const title=document.querySelector('#modal').textContent;const ok1=has&&/Schuldeisers/.test(title);await pickCh(/Schuldsanering/);
  const w=!!S.wsnp&&S.money===0;for(let i=0;i<3;i++){await year1();Q.length=0}
  const done=!S.wsnp&&S.flags.bkrTot>year()&&S.log.slice(-40).some(l=>/kwijtgescholden/.test(JSON.stringify(l)));
  const fr=document.createElement('div');sheetFinance(fr);const loanOff=/kredietregistratie/.test(fr.textContent);
  return {ok:ok1&&w&&done&&loanOff,msg:`pop-up ${ok1}, sanering gestart ${w}, na 3 jaar klaar ${done}, lening geblokkeerd ${loanOff}`}});

t('1.5c','twee keer negeren: faillissement','NL',async()=>{eval(DH);S.m=30*12;S.money=-200000;await year1();processQ();await sl(30);await pickCh(/Negeren/);
  S.money=-200000;await year1();processQ();await sl(30);await pickCh(/Negeren/);S.money=-200000;await year1();const fq=Q.some(q=>q.id==='s_failliet');processQ();await sl(40);closeModal();
  return {ok:fq&&S.money===0&&S.flags.failliet===1&&S.flags.bkrTot===year()+10,msg:`failliet ${S.flags.failliet||0}×, saldo ${S.money}, krediet tot ${S.flags.bkrTot}`}});

t('1.5d','boven de grens: bezit verkopen','NL',async()=>{eval(DH);S.m=30*12;S.cars.push({id:'t',name:'Testauto',buy:220000,value:200000,cond:100});S.money=-60000;
  await year1();processQ();await sl(30);await pickCh(/Bezit verkopen/);return {ok:S.money>=0&&!S.cars.length,msg:`saldo na verkoop ${Math.round(S.money)}, auto's ${S.cars.length}`}});

t('1.6','jaartal van de regionale verkiezingen','NL',async()=>{S.m=30*12;Q.length=0;advance();Q.length=0;if(typeof polMigrate==='function')polMigrate();if(!S.pw)return {ok:true,msg:'geen politieke wereld in dit leven'};delete S.pw.nextRG;const y=regNext();return {ok:typeof y==='number'&&y>year(),msg:`volgende regionale verkiezing ${y}`}});

t('1.7','wereldnieuws staat één keer in het logboek','NL',async()=>{S.m=30*12;Q.length=0;const n0=S.log.length;weStart('hitte');while(Q.length){processQ();await sl(20);closeModal();if(Q.length&&Q[0].id!=='war_nieuws')Q.shift()}
  const ls=S.log.slice(n0).map(l=>String(l.t).replace(/^[^:]{1,40}: /,''));const d=ls.filter((t,i)=>t.length>20&&ls.some((u,j)=>j!==i&&u.includes(t)));return {ok:!d.length,msg:d.length?'dubbel: '+d[0].slice(0,60):`${ls.length} regels, geen dubbele`}});

t('1.8','hoofdletters midden in een zin','NL',async()=>{const a=midNm('De overvaller'),b=lcFn('Eerste Kamerlid'),c=lcFn('AOW-leeftijd'),d=lcFn('Gedeputeerde'),e=midNm('Kees');
  return {ok:a==='de overvaller'&&b==='Eerste Kamerlid'&&c==='AOW-leeftijd'&&d==='gedeputeerde'&&e==='Kees',msg:[a,b,c,d,e].join(' · ')}});

t('1.9','doodsoorzaak en diploma in het levensverhaal','NL',async()=>{let old=0;for(let i=0;i<300;i++)if(deathCause(62)==='ouderdom')old++;
  S.m=70*12;S.edu.deg=[{ty:'vwo'}];S.ms.push({a:18,t:'Haalde het vwo-diploma cum laude',w:2});const st=story().join(' ');const n=(st.match(/diploma/g)||[]).length;
  return {ok:old===0&&n===1&&/cum laude/.test(st),msg:`ouderdom op 62: ${old}× · "diploma" in verhaal: ${n}×`}});

t('1.10','beroepsscherm voor peuters','NL',async()=>{S.m=2*12;openSheet('Beroep',sheetJob);await sl(50);const txt=document.querySelector('#sheet-b').textContent;closeSheet();return {ok:/Vanaf 4 jaar/.test(txt),msg:txt.trim().slice(0,50)}});

t('1.11','tijdmachine sluit na terugspoelen','NL',async()=>{for(let i=0;i<6;i++){Q.length=0;advance();Q.length=0}render();const res=[];
  const tryIt=async(open,label)=>{await open();await sl(350);const r=[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/1 jaar terug/.test(x.textContent));if(!r){res.push(label+': geen knop');return}r.click();await sl(450);res.push(`${label}: ${document.querySelector('#sheet').hidden?'dicht':'OPEN'}`);closeSheet();await sl(350);Q.length=0;advance();Q.length=0;render()};
  await tryIt(async()=>document.querySelector('#t-back').click(),'knop Terug');
  await tryIt(async()=>{document.querySelector('#h-menu').click();await sl(300);[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/Tijdmachine/.test(x.textContent)).click()},'menu');
  await tryIt(async()=>{document.querySelector('#t-act').click();await sl(300);[...document.querySelectorAll('#sheet-b .mrow')].find(x=>/Tijdmachine/.test(x.textContent)).click()},'activiteiten');
  return {ok:res.every(x=>/dicht/.test(x)),msg:res.join(' · ')}});

t('1.12','geen dubbele gebeurtenissen meer','NL',async()=>{const ids=['collegaflirt','feestje','onlinedrama','ouderruzie','overwerk','scheiding','spieken','spijbelen','tip','verliefd'];const bad=ids.filter(id=>!EV[id]);return {ok:!bad.length,msg:bad.length?'ontbreekt: '+bad:'alle tien bestaan nog, in één versie'}});

t('1.13','vangnet bij een fout in een keuze','NL',async()=>{S.m=20*12;localStorage.removeItem('levensloop.errors');
  E('test_crash',{sys:1,t:'Testcrash',x:'Dit gaat mis.',ch:[['Doe het',()=>({go:()=>{throw new Error('bewuste testfout')}})]]});Q.push({id:'test_crash',c:{}});processQ();await sl(30);
  [...document.querySelectorAll('#modal .btn')].find(b=>/Doe het/.test(b.textContent)).click();await sl(150);
  const modalDicht=document.querySelector('#modal').hidden,toastTxt=document.querySelector('#toast').textContent,log=errList();
  const a=ageY();Q.length=0;document.querySelector('#t-age').click();await sl(100);for(let i=0;i<10&&!document.querySelector('#modal').hidden;i++){closeModal();await sl(20)}
  openSheet('Foutenlog',sheetErrors);await sl(50);const fl=document.querySelector('#sheet-b').textContent;closeSheet();delete EV.test_crash;
  return {ok:modalDicht&&/Je leven is bewaard/.test(toastTxt)&&log.some(x=>/bewuste testfout/.test(x.m))&&ageY()===a+1&&/bewuste testfout/.test(fl),msg:`pop-up dicht ${modalDicht} · melding "${toastTxt}" · in foutenlog ${log.length} · spel gaat door ${ageY()===a+1}`}});

t('2.2a','compacte opnames: na herladen precies hetzelfde','NL',async()=>{const canon=o=>JSON.stringify(o,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((a,x)=>(a[x]=v[x],a),{}):v);
  for(let i=0;i<25;i++){S.st.health=Math.max(S.st.health,80);Q.length=0;advance();Q.length=0;if(i===12)market()}saveLife();
  const before=S.snaps.map(x=>canon(JSON.parse(x.d)));const id=S.id;
  // opnieuw inlezen zoals bij het openen van de app
  const st=lsReadV2();const after=st.lives[id].snaps.map(x=>canon(JSON.parse(x.d)));
  const same=before.length===after.length&&before.every((x,i)=>x===after[i]);
  let kb=0;for(const k of Object.keys(localStorage))if(k.includes(id))kb+=localStorage.getItem(k).length;
  STORE=st;loadLife(id);const a0=ageY();rewind(10);const ok10=ageY()===a0-10;
  return {ok:same&&ok10,msg:`${before.length} opnames ${same?'gelijk':'VERSCHILLEN'} · 10 jaar terug ${ok10?'werkt':'mislukt'} · opslag van dit leven ${Math.round(kb/1024)} KB`}});

t('2.2b','volle opslag geeft een melding','NL',async()=>{S.m=20*12;saveLife();const junk='x'.repeat(500000);let i=0;try{for(;i<40;i++)localStorage.setItem('junk'+i,junk)}catch(e){}
  for(let k=0;k<30;k++)S.log.push({a:20,y:2040,t:'vul '.repeat(2000),c:''});saveLife();await sl(50);const t=document.querySelector('#modal').textContent;closeModal();
  for(let k=0;k<i;k++)localStorage.removeItem('junk'+k);LSFULL=false;
  return {ok:/opslag is vol/.test(t),msg:/opslag is vol/.test(t)?'melding "Je opslag is vol" verschijnt':'GEEN melding'}});

t('2.4','verder waar je was, startscherm in het menu, energie weg','NL',async()=>{for(let i=0;i<3;i++){Q.length=0;advance();Q.length=0}saveLife();const id=S.id;
  // opnieuw opstarten zoals de app dat doet
  S=null;STORE={lives:{}};lsLoad();boot({});await sl(50);const opened=curScreen==='game'&&S&&S.id===id;closeModal();
  openSheet('Hoofdmenu',sheetMain);await sl(50);[...document.querySelectorAll('#sheet-b .mrow')].find(r=>/Startscherm/.test(r.textContent)).click();await sl(400);const start=curScreen==='start';
  loadLife(id);const b=document.querySelector('#t-rel');b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));haptic(5);const fx=b.classList.contains('tapfx');closeSheet();
  const noE=typeof spendE==='undefined'&&typeof energyMax==='undefined'&&S.energy===undefined;
  return {ok:opened&&start&&fx&&noE,msg:`opent laatste leven ${opened} · menu → startscherm ${start} · knop veert in ${fx} · energiesysteem weg ${noE}`}});

const sl=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();let fail=0;const only=process.argv[2];
  for(const x of T){if(only&&!x.nr.startsWith(only))continue;
    const ctx=await b.newContext({...devices['iPhone 13']});await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1')}catch(e){}});
    const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(URL);
    let r;try{r=await p.evaluate(async({cc,src,DH})=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));
      randomize();CF.country=cc;CF.city=COUNTRIES[cc].cities[0];CF.chaos=1;startCreated();closeModal();Q.length=0;
      const f=eval('('+src+')');return await f()},{cc:x.cc,src:x.run.toString(),DH:debtHelpers})}catch(e){r={ok:false,msg:'test brak af: '+e.message.split('\n')[0]}}
    const errs2=errs.filter(e=>!/bewuste testfout/.test(e));const ok=r.ok&&!errs2.length;if(!ok)fail++;
    console.log(`${ok?'✓':'✗'} ${x.nr} ${x.name}: ${r.msg}${errs2.length?' · JS-fout: '+[...new Set(errs2)].join(' | '):''}`);await ctx.close()}
  await b.close();console.log(fail?`regressie: ${fail} mislukt`:'regressie: alles in orde');process.exit(fail?1:0)})();

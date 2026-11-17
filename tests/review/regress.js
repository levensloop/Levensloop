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
  /* sinds fase 5 staat de tijdmachine niet meer onder Activiteiten */
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

t('3.4','gebeurtenissen alleen voor wie ze passen','NL',async()=>{S.m=25*12;S.sport={id:Object.keys(SPORTS)[0],st:'club',sk:40,seasons:[],yrs:0};Q.length=0;for(let i=0;i<200;i++)dopeYear();const dope=Q.filter(q=>q.id==='sp_dope').length;Q.length=0;
  S.fame=30;const h30=!!EV.c_herkend.need();S.fame=45;const h45=!!EV.c_herkend.need();S.fame=0;
  delete S.sm;const v0=!!EV.viraal.c();
  return {ok:dope===0&&!h30&&h45&&!v0&&EV.quiz.cd>=20,msg:`doping bij amateur ${dope}× · herkend bij roem 30 ${h30}, bij 45 ${h45} · viraal zonder account ${v0} · tv-quiz afkoeltijd ${EV.quiz.cd} jaar`}});

t('3.6','staatsschuld blijft rond het normale niveau en rentenieuws is zeldzaam','NL',async()=>{const E_=ecoW();const d0=E_.d0;const n0=S.log.length;
  for(let i=0;i<45;i++){S.st.health=90;Q.length=0;advance();Q.length=0}
  const ds=E_.hist.map(h=>h.debt);const max=Math.max(...ds),min=Math.min(...ds);const rn=S.log.slice(n0).filter(l=>/centrale bank/.test(l.t)).length;
  const jp=(()=>{const o=E_.d0;E_.d0=ECO_D0.JP;const r=rating(ECO_D0.JP)[1];E_.d0=o;return r})();
  return {ok:d0===45&&max<=d0+40&&min>=d0-30&&rn<=Math.ceil(45/3)+1&&jp!=='Junk',msg:`NL begint op ${d0}%, schuld over 45 jaar ${min}–${max}% · rentenieuws ${rn}× · Japan (${ECO_D0.JP}%) krijgt rating ${jp}`}});

t('4.1','verkiezingen: één pop-up voor gewone burgers, instelling werkt','NL',async()=>{S.m=30*12;const W=polW();Q.length=0;W.nextTK=year();polYear(30);const ask=Q.filter(q=>/^pol_/.test(q.id)).map(q=>q.id+(q.c&&q.c.run?'+uitslag':''));
  Q.length=0;S.settings.vote='none';W.nextTK=year();const n0=S.log.length;polYear(30);const none=Q.filter(q=>/^pol_/.test(q.id)).length;const logged=S.log.slice(n0).some(l=>/Je stemt niet/.test(l.t));Q.length=0;S.settings.vote='ask';
  return {ok:ask.length===1&&ask[0]==='pol_stem+uitslag'&&none===0&&logged,msg:`vragen: ${ask.join(', ')} · niet stemmen: ${none} pop-ups, logregel ${logged}`}});

t('4.4','willekeurige gebeurtenis hooguit 3 keer per leven','NL',async()=>{S.m=40*12;S.evN={griep:3};S.evLast={};let hits=0;for(let i=0;i<400;i++){const e=rollEvent();if(e&&e.id==='griep')hits++}
  return {ok:hits===0,msg:`griep na 3 keer: ${hits}× opnieuw gekozen`}});

t('5.1-5.3','relaties op volgorde, geen dubbele ingangen, opgeven in het menu','NL',async()=>{for(let i=0;i<20;i++){S.st.health=90;Q.length=0;advance();Q.length=0}
  openSheet('Relaties',sheetRel);await sl(50);const secs=[...document.querySelectorAll('#sheet-b .shead')].map(x=>x.textContent.trim()).filter(Boolean);closeSheet();
  const li=secs.findIndex(x=>/Liefde/i.test(x)),oi=secs.findIndex(x=>/Ouders/i.test(x));
  openSheet('Activiteiten',sheetAct);await sl(50);const act=document.querySelector('#sheet-b').textContent;closeSheet();
  openSheet('Hoofdmenu',sheetMain);await sl(50);const menu=document.querySelector('#sheet-b').textContent;closeSheet();
  const dup=/Tijdmachine|Winkelen|Financiën|Opgeven/.test(act);
  return {ok:li>=0&&(oi<0||li<oi)&&!dup&&/Opgeven/.test(menu),msg:`volgorde: ${secs.slice(0,5).join(' > ')} · dubbel in Activiteiten: ${dup} · Opgeven in menu: ${/Opgeven/.test(menu)}`}});

t('6','buitenland: geen Nederlandse termen, Nederland onveranderd','US',async()=>{const t='Het kabinet verhoogt de AOW-leeftijd. Je hebt je vwo-diploma. Popconcert in de Ziggo Dome.';const us=locText(t);
  const nlBad=/kabinet|AOW|vwo|Ziggo/.test(us);const q=quizPool('Wereldoriëntatie').some(x=>/Nederland/.test(x[0]));const st=festList()[0][1]+', '+teamList()[0]+', '+MBR.land.k;
  const o=S.p.country;S.p.country='NL';const nl=locText(t)===t&&MBR.land.k==='Koninklijke Landmacht';S.p.country=o;
  return {ok:!nlBad&&!q&&nl,msg:`VS: "${us}" · ${st} · NL ongewijzigd ${nl}`}});

t('8.0','social media: gebeurtenis met een influencer die intussen weg is','NL',async()=>{S.m=25*12;smInit();const ps=smPeers();const id=ps[0].id;S.sm.peers=S.sm.peers.filter(p=>p.id!==id);Q.length=0;Q.push({id:'sm_beef',c:{id}});processQ();await sl(30);
  const shown=!document.querySelector('#modal').hidden;closeModal();const n=errList().filter(e=>/reading/.test(JSON.stringify(e))).length;return {ok:!shown&&n===0,msg:shown?'pop-up verscheen toch':'netjes overgeslagen'}});
t('8.0b','buren: gebeurtenis na een verhuizing (buren zijn nieuw)','NL',async()=>{S.m=30*12;S.home={k:'huur',name:'Appartement',rent:12000};const ps=nbPpl();const id=ps[0].id;S.nb.key='anders';nbPpl();Q.length=0;Q.push({id:'nb_feest',c:{id}});processQ();await sl(30);
  const shown=!document.querySelector('#modal').hidden;closeModal();return {ok:!shown,msg:shown?'pop-up verscheen toch':'netjes overgeslagen'}});
/* ---------------- fase 8: nieuwe onderdelen ---------------- */
const F8T=(nr,name,cc,afk,run)=>T.push({nr,name,cc,afk,run});
F8T('8.1a','koningshuis: geboren als prins(es), troonopvolging bij overlijden','NL','kon',async()=>{const R_=S.roy;if(!R_)return {ok:false,msg:'geen S.roy'};
  const pos0=royPos();const par=living(['moeder','vader']).find(p=>p.job&&/koning|prins/.test(p.job))||living('moeder')[0];
  S.rel=S.rel.filter(p=>!['broer','zus'].includes(p.role));R_.mon=par.id;R_.gp=null;R_.rp=null;R_.jr=0;S.m=20*12;par.alive=false;Q.length=0;f8Year(20);
  const crowned=R_.mon==='me'&&Q.some(q=>q.id==='roy_kroning');const inc=f8Inc().find(x=>x[0]==='Toelage koninklijk huis');
  openSheet('Koninklijk huis',sheetRoyal);await sl(40);const txt=document.querySelector('#sheet-b').textContent;closeSheet();
  return {ok:pos0>=1&&crowned&&inc&&inc[1]>500000&&/Populariteit/.test(txt)&&/Koning|Vorst/.test(subtitle()),msg:`plek bij geboorte ${pos0}, gekroond ${crowned}, toelage ${inc&&inc[1]}, ondertitel "${subtitle()}"`}});
F8T('8.1b','koningshuis: huwelijk zonder toestemming kost je plek, politiek geblokkeerd','UK','kon',async()=>{const R_=S.roy;S.m=25*12;R_.mon='gp';R_.gp={first:'Edmund',g:'m',by:year()-60};R_.rp=null;R_.jr=0;R_.out=0;
  const pt=mkPerson('partner','v',S.m-25*12,{st:'verloofd',rel:80});S.rel.push(pt);Q.length=0;f8Year(25);const asked=Q.some(q=>q.id==='roy_toestemming');
  pt.st='getrouwd';Q.length=0;f8Year(25);const out=!!R_.out&&royPos()===0;R_.out=0;const el=document.createElement('div');sheetPol(el);const blocked=/Geen partijpolitiek/.test(el.textContent);
  return {ok:asked&&out&&blocked,msg:`toestemming gevraagd ${asked}, plek kwijt na huwelijk ${out}, politiek geblokkeerd ${blocked}`}});
F8T('8.1c','koningshuis: oudste kind volgt je op als vorst; adel erft de titel','BE','kon',async()=>{S.m=60*12;S.roy.mon='me';S.roy.reign=year()-20;S.adel={t:'Graaf',tt:['Graaf','Gravin'],fam:'de Hautmont'};
  const k1=mkPerson('kind','v',S.m-30*12,{rel:80}),k2=mkPerson('kind','m',S.m-25*12,{rel:80});S.rel.push(k1,k2);die('ouderdom');const old=S;inherit(k1.id);closeModal();
  const ok=S!==old&&S.roy&&S.roy.mon==='me'&&S.adel&&S.adel.t==='Gravin';return {ok,msg:`nieuw leven vorst ${S.roy&&S.roy.mon}, titel ${S.adel&&S.adel.t}, ondertitel "${subtitle()}"`}});
F8T('8.1d','adel: titel voor je naam en een bal','DE','adel',async()=>{const ok1=!!S.adel&&/^(Freiherr|Freifrau|Graf|Gräfin) $/.test(f8Pre());S.m=17*12;const el=document.createElement('div');sheetAdel(el);
  return {ok:ok1&&/Naar een bal/.test(el.textContent),msg:`titel "${f8Pre()}", familie ${S.adel&&S.adel.fam}`}});
F8T('8.2a','astronaut: opleiding, lancering en terugkeer','US','',async()=>{S.m=30*12;S.ast={st:'opl',rank:0,yrs:0,mis:[],fit:80,ag:astAg(),y0:year()};f8Year(30);f8Year(31);const act=S.ast.st==='act'&&S.ast.rank===1;
  S.ast.next='station';Q.length=0;f8Year(32);const launch=Q.some(q=>q.id==='ast_lancering');const r0=ASTM.station.risk;ASTM.station.risk=0;const t=EV.ast_lancering.ch[0][1]({k:'station'});ASTM.station.risk=r0;
  const mis=Q.some(q=>q.id==='ast_missie');astBack('station',.8);checkAch();const inc=incomeParts().some(([k])=>k==='Ruimtevaart');
  return {ok:act&&launch&&mis&&S.ast.mis.length===1&&(S.ach||[]).includes('ruimte')&&inc&&S.alive,msg:`astronaut na 2 jaar ${act}, lancering ${launch}, missie ${mis}, salaris ${inc}, ${t.slice(0,40)}`}});
F8T('8.2b','geheim agent: dekmantel, salaris, geen gewone baan ernaast','NL','',async()=>{S.m=30*12;S.spy={st:'act',rank:0,yrs:0,perf:80,heat:0,mis:2,cover:'Consultant bij een adviesbureau'};
  const sub=subtitle();const offers=spyOffers().length;const inc=incomeParts().some(([k])=>k==='Inlichtingendienst');const ub=incomeParts().some(([k])=>k==='Uitkering');
  hire(JOBS.find(j=>j.id==='kassa')||JOBS[0]);const noJob=!S.job;S.spy.heat=100;Q.length=0;f8Year(31);const burn=Q.some(q=>q.id==='spy_ontmaskerd');
  return {ok:sub==='Consultant bij een adviesbureau'&&offers===3&&inc&&!ub&&noJob&&burn,msg:`ondertitel "${sub}", ${offers} operaties, salaris ${inc}, uitkering ${ub}, baan geblokkeerd ${noJob}, ontmaskerd ${burn}`}});
F8T('8.2c','sekteleider: leden, donaties en onderzoek','NL','',async()=>{S.m=35*12;S.sekte={n:'De Sterrenpoort',ty:1,em:'🛸',mem:200,loy:70,insp:85,don:1,yrs:0,lg:0};const inc=f8Inc().find(x=>/Donaties/.test(x[0]));
  Q.length=0;for(let i=0;i<6&&!Q.some(q=>q.id==='sek_inval');i++)f8Year(35);const inv=Q.some(q=>q.id==='sek_inval');const r=EV.sek_inval.ch[0][1]({});
  const el=document.createElement('div');sheetSekte(el);return {ok:inc&&inc[1]>0&&inv&&S.sekte.don===0&&/Een preek houden/.test(el.textContent),msg:`donaties ${inc&&inc[1]}, onderzoek ${inv}, na meewerken bijdrage ${S.sekte.don}`}});
F8T('8.2d','straathandel: zwart geld, politie, rechtszaak','NL','',async()=>{S.m=20*12;S.str={st:'act',lvl:1,rep:20,turf:1,crew:0,yrs:0};const d0=S.crim.dirty||0;Q.length=0;f8Year(20);const d1=S.crim.dirty||0;
  Q.length=0;const t=EV.str_inval.ch[2][1]({});const trial=Q.some(q=>q.id==='s_trial');
  openSheet('Activiteiten',sheetAct);await sl(40);const row=/Straathandel/.test(document.querySelector('#sheet-b').textContent);closeSheet();
  return {ok:d1>d0&&trial&&S.str.st==='gestopt'&&row,msg:`zwart geld ${d0} → ${d1}, rechtszaak ${trial}, rij bij Activiteiten ${row}`}});
F8T('8.3','schoolleven: populariteit, groep, clubs, jaarboek','NL','',async()=>{S.m=13*12;S.edu.stage='middel';S.edu.lvl='havo';S.edu.len=5;S.edu.yrs=0;const X=sch();X.kl='nerd';X.cl=[{id:'schaak',yrs:0,r:0},{id:'band',yrs:0,r:0}];
  const el=document.createElement('div');sheetSchool(el);const row=/Schoolleven/.test(el.textContent)&&!/Naschoolse club/.test(el.textContent);
  const el2=document.createElement('div');sheetSchoolLife(el2);const life=/Populariteit/.test(el2.textContent)&&/Schaakclub/.test(el2.textContent);
  Q.length=0;f8Year(13);const yrs=X.cl[0].yrs===1;S.edu.yrs=4;Q.length=0;f8Year(17);const jb=Q.some(q=>q.id==='scl_jaarboek');S.edu.stage='klaar';f8Year(18);
  return {ok:row&&life&&yrs&&jb&&!X.cl.length,msg:`rij op schoolscherm ${row}, scherm ${life}, clubjaar ${yrs}, jaarboek ${jb}, clubs leeg na school ${!X.cl.length}`}});
F8T('8.4','identiteit: uit de kast, genderidentiteit, paspoort, trouwen per land','NL','',async()=>{S.m=20*12;S.p.g='m';S.flags.pref='mannen';
  const el=document.createElement('div');sheetIdentity(el);const rows=/Uit de kast komen/.test(el.textContent)&&/Genderidentiteit/.test(el.textContent);
  outFam();await sl(30);closeModal();const out=!!idn().out.fam;idn().gi='v';const el2=document.createElement('div');sheetIdentity(el2);const leg=/paspoort aanpassen/.test(el2.textContent);
  S.p.country='IT';const pt=mkPerson('partner','m',S.m-24*12,{st:'verloofd',rel:80});S.rel.push(pt);S.p.g='m';Q.length=0;f8Year(20);const tr=Q.some(q=>q.id==='idn_trouwen');S.p.country='NL';
  return {ok:rows&&out&&leg&&tr&&orient()==='homo',msg:`rijen ${rows}, uit de kast bij ouders ${out}, paspoortrij ${leg}, trouwvraag in Italië ${tr}, ${orient()}`}});
F8T('8.6','erfstukken en verzamelingen','NL','',async()=>{S.m=30*12;const C_=coll();C_.fam=[];const mom=living('moeder')[0];const e0=Object.assign(mkErf(3),{hold:mom.id});C_.fam.push(e0);mom.alive=false;Q.length=0;f8Year(30);
  const q=Q.find(x=>x.id==='erf_erfstuk');EV.erf_erfstuk.ch[0][1](q.c);const got=C_.it.some(x=>x.k==='erf');
  for(let i=0;i<SETS.steen[2].length;i++)collAdd('steen',i);const done=!!C_.done.steen;const nw=collVal()>0;
  const k=mkPerson('kind','v',S.m-20*12,{rel:80});S.rel.push(k);die('ouderdom');inherit(k.id);closeModal();const gen=S.coll&&S.coll.it.find(x=>x.k==='erf'&&x.n===e0.n);
  return {ok:got&&done&&nw&&gen&&gen.gen===4&&!S.coll.it.some(x=>x.k==='steen'),msg:`erfstuk geërfd ${got}, set compleet ${done}, waarde ${nw}, generatie na erven ${gen&&gen.gen}`}});
F8T('8.7a','spookhuis: kopen, spoken, rust vinden; met Rustig een nuchtere verklaring','NL','',async()=>{S.m=40*12;S.money=2e6;const h=mkListing(5);h.ghost={g:0,lvl:1,rel:30,clue:2,rest:0};const p=buyHouse(h,false);S.home={k:'eigen',pid:p.id};
  S.settings.chaos=1;Q.length=0;f8Year(40);f8Year(41);const ev=Q.some(q=>/^spk_/.test(q.id));const el=document.createElement('div');sheetProp(el,p);const rows=/Een medium inhuren/.test(el.textContent);
  S.settings.chaos=0;p.ghost.nu=0;Q.length=0;f8Year(42);const nu=Q.some(q=>q.id==='spk_nuchter');EV.spk_nuchter.ch[0][1]({});
  return {ok:!!p.ghost&&ev&&rows&&nu&&p.ghost.rest===1,msg:`spook bij koop ${!!p.ghost}, gebeurtenis ${ev}, acties ${rows}, nuchter met Rustig ${nu}`}});
F8T('8.7b','exotische huisdieren: legaal, vergunning, verboden','NL','',async()=>{S.m=30*12;S.money=50000;const el=document.createElement('div');exoRows(el);const t=el.textContent;
  const law=/Verboden in dit land/.test(t)&&/vergunning/.test(t);const p=addPet('tijger','Sultan',{k:15000,life:[15,20],br:'Tijger'});p.exo=1;p.ill=1;
  const face=faceOf(p)==='🐅';Q.length=0;let conf=false;for(let i=0;i<40&&!conf;i++){f8Year(30);conf=Q.some(q=>q.id==='exo_inbeslag');Q.length=conf?Q.length:0}
  return {ok:law&&face&&conf,msg:`regels per land ${law}, icoon ${face}, inbeslagname ${conf}`}});
F8T('8.8','editor en God-modus','NL','',async()=>{randomize();CF.country='NL';CF.city='Utrecht';CF.wealth='arm';CF.sibs=0;CF.momN='Truus';CF.afk='';startCreated();closeModal();Q.length=0;
  const ed=S.flags.wealth==='arm'&&living('moeder')[0].first==='Truus'&&!people(['broer','zus']).length;
  openSheet('Hoofdmenu',sheetMain);await sl(40);const menu=/God-modus/.test(document.querySelector('#sheet-b').textContent);closeSheet();
  S.settings.god=1;const mom=living('moeder')[0];const el=document.createElement('div');sheetPerson(el,mom);const sec=/Eigenschappen aanpassen/.test(el.textContent);
  godSelf();await sl(20);document.querySelector('#gsave').click();await sl(20);const star=S.god===1;const el2=document.createElement('div');sheetAch(el2);
  return {ok:ed&&menu&&sec&&star&&/God-modus gebruikt/.test(el2.textContent),msg:`editor ${ed}, menu ${menu}, personen ${sec}, ster ${star}`}});

const sl=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();let fail=0;const only=process.argv[2];
  for(const x of T){if(only&&!x.nr.startsWith(only))continue;
    const ctx=await b.newContext({...devices['iPhone 13']});await ctx.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1');localStorage.setItem('levensloop.uitleg','1')}catch(e){}});
    const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(URL);
    let r;try{r=await p.evaluate(async({cc,afk,src,DH})=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));
      randomize();CF.country=cc;CF.city=COUNTRIES[cc].cities[0];CF.chaos=1;CF.afk=afk||'';startCreated();closeModal();Q.length=0;
      const f=eval('('+src+')');return await f()},{cc:x.cc,afk:x.afk,src:x.run.toString(),DH:debtHelpers})}catch(e){r={ok:false,msg:'test brak af: '+e.message.split('\n')[0]}}
    const errs2=errs.filter(e=>!/bewuste testfout/.test(e));const ok=r.ok&&!errs2.length;if(!ok)fail++;
    console.log(`${ok?'✓':'✗'} ${x.nr} ${x.name}: ${r.msg}${errs2.length?' · JS-fout: '+[...new Set(errs2)].join(' | '):''}`);await ctx.close()}
  await b.close();console.log(fail?`regressie: ${fail} mislukt`:'regressie: alles in orde');process.exit(fail?1:0)})();

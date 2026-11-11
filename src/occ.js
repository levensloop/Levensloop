/* ================= OORLOG (fase 4): bezetting, verzet, collaboratie, bevrijding ================= */
const OCCT=[['DE',32],['NL',26],['BE',26],['FR',18],['IT',16],['ES',8],['UK',6]];
const occW=()=>{const W=warW();return W.occ||(W.occ={})};
const occHere=()=>!!(S.war&&S.war.occ&&S.war.occ[S.p.country]);
const occMe=()=>occHere()&&!(S.pol&&S.pol.exile)&&!(S.mil&&(S.mil.exile||S.mil.pow));
function occP(){return S.occ||(S.occ={rz:0,col:0,risk:0,hide:0,grp:[],ond:0,arb:0,bon:0})}
function occYear(){const W=warW(),O=occW(),y=year();
  if(W.lvl>=3){for(const [c,t] of OCCT){if(!O[c]&&W.front<=t&&chance(.5))occStart(c);else if(O[c]&&W.front>=t+28&&chance(.6))occLib(c,'win')}}
  if(W.occEnd&&y>=W.occEnd){W.occEnd=0;for(const c of Object.keys(O))occLib(c,'collapse')}
  if(!occMe())return;const P=occP();P.y=(P.y||0)+1;
  // leven onder bezetting
  S.econ.s='recessie';S.econ.y=0;if(S.money>0)S.money=Math.round(S.money*.93);
  if(S.job&&!inJail()&&chance(.18)){const t=jobTitle();endJob();L(`Je bedrijf moet sluiten door de bezetting. Je bent je baan als ${t.toLowerCase()} kwijt.`,'bad')}
  if(P.ond){hap(-6);P.risk+=6;if(S.job)endJob();if(chance(.12)){Q.push({id:'occ_arrest'});return}}
  if(P.hide){P.risk+=6*P.hide;kar(1)}
  if(P.colJob){P.col=clamp(P.col+10)}
  if(P.arb){P.arb=0;L('Je komt terug van de gedwongen arbeid, mager en uitgeput.','sys')}
  P.risk=Math.max(0,P.risk-8);if(P.risk>=20&&chance(P.risk/260))Q.push({id:'occ_arrest'});
  if(P.grp.some(p=>p.trait==='verrader')&&P.grp.length&&chance(.1))Q.push({id:'occ_verraad'});
  if(!P.honger&&P.y>=2&&chance(.4)){P.honger=1;Q.push({id:'occ_honger'})}
  const pool=Object.keys(EV).filter(k=>EV[k].oev&&!Q.some(q=>q.id===k)&&(S.evLast[k]==null||S.m-S.evLast[k]>=12)&&safe(()=>EV[k].c()));
  for(let i=0;i<2&&pool.length;i++){const k=pool.splice(ri(0,pool.length-1),1)[0];S.evLast[k]=S.m;Q.push({id:k})}}
function occStart(c){const O=occW();O[c]=year();const nm=COUNTRIES[c].n;
  if(c!==S.p.country){L(`${cap(warW().foe)} heeft ${nm} bezet.`,'bad');return}
  L(`${cap(warW().foe)} valt ${nm} binnen. Na dagen van zware gevechten capituleert het leger. Het land is bezet.`,'bad big');MS('Maakte de bezetting van het land mee',2);hap(-15);occP().since=year();
  Q.push({id:'war_nieuws',c:{t:'Bezet',txt:`Tanks rijden door de straten van ${S.p.city}. Op het stadhuis hangt een vreemde vlag. De regering is gevlucht. Vanaf vandaag geldt een avondklok.`}});
  if(S.mil&&!S.mil.pow&&!S.mil.exile)Q.push({id:'occ_invasie'});
  if(S.pol&&!['lid'].includes(S.pol.lvl))Q.push({id:'occ_pol'})}
function occLib(c,how){const O=occW();if(!O[c])return;delete O[c];if(c!==S.p.country){L(`${COUNTRIES[c].n} is bevrijd!`,'good');return}
  const P=occP();const yrs=year()-(P.since||year());
  L(`BEVRIJD! Na ${yrs||1} jaar bezetting rijden geallieerde tanks ${S.p.city} binnen. Mensen dansen op straat.`,'good big');MS('Beleefde de bevrijding',3);S.flags.bevrijd=1;hap(20);
  const out=[how==='collapse'?'Het bezettingsregime stort in. De bezetter trekt zich terug.':'De geallieerden bevrijden het land.'];
  if(P.ond){P.ond=0;out.push('Je komt na lange tijd uit je onderduikadres. Het daglicht doet pijn aan je ogen.')}
  {const r=(S.crim.rec||[]).slice(-1)[0];if(inJail()&&r&&/bezett|dienstweigering|verzet/.test(r.w)&&!/collaboratie/.test(r.w)){S.crim.jail=null;S.crim.rec.pop();out.push('De kampen worden bevrijd. Je bent vrij! Je strafblad wordt gewist.')}}
  if(S.mil&&S.mil.pow){S.mil.pow=0;out.push('Je wordt bevrijd uit krijgsgevangenschap.')}
  if(S.mil&&S.mil.exile){S.mil.exile=0;S.mil.perf=clamp(S.mil.perf+10);out.push('Je trekt met de bevrijders je eigen land binnen.')}
  if(S.pol&&S.pol.exile){S.pol.exile=0;S.pol.pop=clamp(S.pol.pop+20);out.push('De regering keert terug uit Londen. Je wordt als held ontvangen.')}
  if(P.rz>=40){S.flags.vhk=1;S.fame=clamp(S.fame+Math.round(P.rz/8));MS('Kreeg het Verzetsherdenkingskruis',3);out.push('Voor je werk in het verzet krijg je het Verzetsherdenkingskruis.');if(P.rz>=75){S.flags.verzetsheld=1;MS(`Er werd een straat naar ${S.p.g==='v'?'haar':'hem'} vernoemd`,3);out.push(`De gemeente vernoemt later een straat naar je: de ${S.p.first} ${S.p.last}straat.`)}}
  if(P.hide)out.push(`De ${P.hide} onderduikers die je verborg, overleven de oorlog. Ze vergeten het je nooit.`);
  P.hide=0;P.colJob=0;P.grp=[];
  if(P.col>=25){S.flags.fout=1;Q.push({id:'occ_tribunaal',c:{m:Math.round(P.col/100*48)+3}});out.push('Maar niet iedereen viert feest. Er wordt gezocht naar wie met de bezetter samenwerkte.')}
  for(const p of S.rel)if(p.alive&&P.col>=40&&['moeder','vader','broer','zus','kind'].includes(p.role))p.rel=clamp(p.rel-15);
  Q.push({id:'war_nieuws',c:{t:'Bevrijding',txt:out.join(' ')}});P.done=1}
/* ---------- gebeurtenissen ---------- */
const OE=(id,o)=>E(id,Object.assign({sys:1,oev:1},o));
const occIn=()=>occMe()&&!inJail()&&!occP().arb;
E('occ_invasie',{sys:1,need:()=>!!S.mil,t:'De invasie',x:'De vijand trekt de grens over. Jouw eenheid krijgt de opdracht de linie te houden. Het is hopeloos.',ch:[
 ['⚔️ Vechten tot het einde',()=>{const M=S.mil;if(chance(.1)){die('gevechten tijdens de invasie');return 'Je sneuvelt bij de verdediging van je land. Je naam staat later op het monument.'}if(chance(.3)){heroMedal(chance(.15)?3:2)}if(chance(.55)){M.pow=1;return 'Jullie houden twee dagen stand. Dan is de munitie op. Je wordt krijgsgevangen gemaakt.'}M.exile=1;return 'Je ontsnapt in de chaos en bereikt per vissersboot Engeland.'}],
 ['🚢 Uitwijken naar Engeland',()=>{S.mil.exile=1;return 'Je eenheid wordt geëvacueerd. Vanuit Engeland ga je door met de strijd.'}],
 ['🏳️ De wapens neerleggen',()=>{S.mil.pow=1;return 'Je geeft je over. Je wordt afgevoerd naar een krijgsgevangenenkamp.'}]]});
E('occ_pol',{sys:1,need:()=>!!(S.pol&&S.pol.lvl!=='lid'),t:'De regering valt',x:()=>`Als ${polTl(S.pol.lvl)} moet je kiezen. De bezetter zoekt bestuurders die meewerken.`,ch:[
 ['✈️ Naar Londen: regering in ballingschap',()=>{const P=S.pol;P.exile=1;P.pop=clamp(P.pop+10);return 'Je vlucht op de laatste boot naar Engeland. Via de radio spreek je het bezette land moed in.'}],
 ['🤝 Aanblijven onder de bezetter',()=>{const O=occP();O.col=clamp(O.col+45);S.pol.pop=clamp(S.pol.pop-30);return 'Je blijft op je post. "Om erger te voorkomen," zeg je. Niet iedereen gelooft dat.'}],
 ['🕳️ Aftreden en onderduiken',()=>{loseOffice('Je treedt af en verdwijnt.');const O=occP();O.ond=1;O.rz=clamp(O.rz+10);return 'Je verdwijnt naar een onderduikadres op het platteland.'}]]});
OE('occ_razzia',{c:()=>occIn()&&ageY()>=18&&ageY()<=45&&!occP().ond&&S.p.g!=='v'&&!S.mil,t:'Razzia!',x:'Soldaten gaan huis aan huis. Alle mannen van 18 tot 45 moeten zich melden voor de "arbeidsinzet" in fabrieken van de bezetter.',ch:[
 ['🚂 Gaan',()=>{const O=occP();O.arb=1;hap(-12);hea(-10);if(S.job)endJob();return 'Je wordt in een trein gezet. Een jaar lang werk je twaalf uur per dag in een fabriek, ver van huis.'}],
 ['🕳️ Onderduiken',()=>{const O=occP();O.ond=1;if(S.job)endJob();return 'Je verstopt je onder de vloer van een boerderij. Vanaf nu leef je in het geheim.'}],
 ['🪪 Valse papieren regelen',()=>{const O=occP();if(chance(.5+O.rz/200)){O.rz=clamp(O.rz+3);return 'Via het verzet krijg je een vals persoonsbewijs. Je mag blijven.'}O.arb=1;hap(-10);hea(-8);return 'De vervalsing valt op. Je wordt alsnog afgevoerd.'}]]});
OE('occ_controle',{c:occIn,t:'Controle',x:'Op straat word je staande gehouden. "Papiere!"',ch:[
 ['🙂 Rustig blijven',()=>{const O=occP();if(O.risk>40&&chance(.3)){O.risk+=15;return 'Ze bekijken je papieren heel lang. Je naam wordt genoteerd.'}return 'Na een eindeloze minuut mag je doorlopen.'}],
 ['🏃 Wegrennen',()=>{const O=occP();if(chance(.6)){O.risk+=10;return 'Je verdwijnt in een steegje. Het was op het nippertje.'}jail(ri(3,9),'verzet tegen de bezetter');return 'Je wordt gepakt en afgevoerd.'}]]});
OE('occ_onderduiker',{c:()=>occIn()&&ageY()>=18&&S.home.k!=='ouders'&&!occP().ond,t:'Een klop op de deur',x:'Laat op de avond staat er een jong stel voor je deur. Ze worden gezocht. "Alstublieft, alleen voor een paar nachten."',ch:[
 ['🏠 Ze binnenlaten',()=>{const O=occP();O.hide++;O.rz=clamp(O.rz+8);kar(5);return 'Je maakt een schuilplaats achter een kast op zolder. Het worden geen nachten, het worden jaren.'}],
 ['🚪 Nee, het is te gevaarlijk',()=>{kar(-2);hap(-3);return 'Je doet de deur dicht. Je hoort hun voetstappen weggaan. Je vergeet het nooit.'}]]});
OE('occ_buurman',{c:()=>occIn()&&(occP().hide>0||occP().rz>=20),t:'De buurman',x:'Je buurman kijkt je de laatste tijd raar aan. Hij heeft gezien dat je veel boodschappen haalt.',ch:[
 ['🎁 Hem iets toestoppen',()=>{cash(-Math.round(500*(S.cpi||1)));if(chance(.7))return 'Hij knikt en zegt niets meer.';occP().risk+=25;return 'Hij neemt het aan, en praat toch.'}],
 ['🚚 Alles verplaatsen',()=>{const O=occP();O.risk=Math.max(0,O.risk-10);hap(-3);return 'In één nacht brengen jullie de onderduikers naar een ander adres.'}],
 ['🤞 Afwachten',()=>{const O=occP();if(chance(.4)){O.risk+=30;return 'Twee dagen later staat er een auto voor de deur...'}return 'Er gebeurt niets. Misschien zag hij niks.'}]]});
OE('occ_bedrijf',{c:()=>occIn()&&S.biz.some(b=>b.ceo!==false),t:'De bezetter',x:()=>`Een officier van de bezetter staat in je kantoor. ${S.biz[0].name} moet voortaan leveren aan het bezettingsleger.`,ch:[
 ['🤝 Meewerken',()=>{const O=occP();O.col=clamp(O.col+20);for(const b of S.biz)b.cash+=Math.round((b.rev||0)*.2);return 'De orders stromen binnen. Je verdient goed. Op straat kijken mensen je anders aan.'}],
 ['🙅 Weigeren',()=>{const b=S.biz[0];if(chance(.5)){b.value=Math.round((b.value||0)*.5);b.demand*=.6;return `Ze nemen een deel van ${b.name} in beslag. De rest mag je houden.`}b.ceo=false;b.sal=0;return `Je wordt uit je eigen bedrijf gezet. Een "Verwalter" neemt ${b.name} over.`}],
 ['🛠️ Meewerken, maar saboteren',()=>{const O=occP();O.rz=clamp(O.rz+10);O.risk+=15;return 'Je levert, maar alles wat de fabriek verlaat, gaat binnen een week kapot.'}]]});
OE('occ_avondklok',{c:occIn,t:'Avondklok',x:'Een vriend geeft een verjaardagsfeestje. Het loopt uit tot na de avondklok.',ch:[
 ['🛌 Blijven slapen',()=>{hap(3);return 'Jullie slapen met z\'n tienen in de woonkamer. Het is de gezelligste avond in maanden.'}],
 ['🌙 Toch naar huis sluipen',()=>{if(chance(.75))return 'Je sluipt door de donkere straten. Je hart bonkt, maar je komt thuis.';cash(-Math.round(200*(S.cpi||1)));occP().risk+=10;return 'Een patrouille ziet je. Je krijgt een boete en je naam wordt genoteerd.'}]]});
OE('occ_radio',{c:occIn,t:'Radio Oranje',x:'Radio\'s moeten worden ingeleverd. Maar \'s avonds luistert iedereen stiekem naar de zender uit Londen.',ch:[
 ['📻 Je radio verstoppen',()=>{hap(3);occP().risk+=4;return 'Elke avond om negen uur luister je onder een deken. "Hier is Radio Oranje."'}],
 ['📤 Netjes inleveren',()=>{hap(-2);return 'Je levert je radio in. Nu hoor je alleen nog de propaganda.'}]]});
E('occ_honger',{sys:1,t:'Hongerwinter',x:'De winter is streng en het eten is op. In de stad wordt soep van suikerbieten gekookt. Mensen lopen kilometers voor een zak aardappelen.',ch:[
 ['🚲 Een hongertocht naar het platteland',()=>{hea(-ri(6,12));const O=occP();if(O.bon)hea(4);occHungerDeaths();return 'Je fietst op houten banden naar Friesland en ruilt je trouwring voor aardappelen en spek.'}],
 ['🍲 Delen met je buren',()=>{hea(-ri(10,18));kar(5);occHungerDeaths();return 'Je verdeelt wat je hebt. Iedereen heeft honger, maar niemand staat er alleen voor.'}],
 ['🥷 Voedsel stelen',()=>{hea(-ri(4,8));if(chance(.3)){jail(ri(3,9),'diefstal tijdens de bezetting');return 'Je wordt betrapt bij een opslagplaats van de bezetter.'}occHungerDeaths();return 'Je haalt \'s nachts zakken graan uit een opslag van de bezetter.'}]]});
function occHungerDeaths(){for(const p of living(['moeder','vader','opa','oma'].filter(Boolean)))if(pAge(p)>=72&&chance(.18)){p.alive=false;p.died=pAge(p);onDeath(p)}}
E('occ_arrest',{sys:1,t:'Gearresteerd',x:'Om vier uur \'s nachts wordt er op de deur gebonsd. Ze weten wie je bent.',ch:[
 ['🤐 Zwijgen in het verhoor',()=>{const O=occP();kar(8);hea(-ri(10,20));if(O.rz>=50&&chance(.12)){die('een executie door de bezetter');return 'Je zegt geen woord. Bij het ochtendgloren word je gefusilleerd. Na de oorlog wordt je naam in steen gebeiteld.'}O.risk=0;O.hide=0;O.ond=0;jail(ri(12,30),'verzet tegen de bezetter');return 'Je zegt niets, dagen lang. Je wordt afgevoerd naar een kamp.'}],
 ['🗣️ Namen noemen',()=>{const O=occP();O.col=clamp(O.col+35);O.risk=0;kar(-12);hap(-15);const n=O.grp.length;O.grp=[];O.rz=Math.max(0,O.rz-30);return `Je breekt. Je noemt namen. ${n?`${n} mensen uit je groep worden opgepakt.`:''} Jij mag naar huis. Je kunt jezelf niet meer aankijken.`}],
 ['🏃 Proberen te vluchten',()=>{const O=occP();if(chance(.35)){O.ond=1;O.risk=10;return 'In een onbewaakt moment spring je door een raam. Je duikt onder.'}hea(-15);jail(ri(18,36),'verzet tegen de bezetter');return 'Je komt niet ver. Ze zijn nu extra hard voor je.'}]]});
E('occ_verraad',{sys:1,t:'Verraad',x:'Een overval van je groep loopt in een hinderlaag. Iemand heeft gepraat.',ch:[
 ['🔍 De verrader zoeken',()=>{const O=occP();const v=O.grp.find(p=>p.trait==='verrader');if(v&&chance(.6)){O.grp=O.grp.filter(p=>p!==v);return `Het is ${v.first}. Jullie zetten ${v.g==='v'?'haar':'hem'} uit de groep en wisselen van schuiladres.`}O.risk+=20;return 'Je vindt niets. Het wantrouwen in de groep groeit.'}],
 ['🕳️ Iedereen tijdelijk onderduiken',()=>{const O=occP();O.risk=Math.max(0,O.risk-20);O.rz=clamp(O.rz-5);return 'De groep valt maanden stil. Veilig, maar er gebeurt ook niets.'}]]});
E('occ_tribunaal',{sys:1,t:'Bijzondere rechtspleging',x:c=>`Je moet voor het tribunaal verschijnen wegens samenwerking met de bezetter. De aanklager eist ${c.m>=12?Math.round(c.m/12)+' jaar':c.m+' maanden'}.`,ch:[
 ['🙏 Schuld bekennen',c=>{const m=Math.max(1,Math.round(c.m*.6));jail(m,'collaboratie');S.flags.fout=1;MS('Werd veroordeeld wegens collaboratie',1);return `Je krijgt ${m} maanden. Je naam is voor altijd besmet.`}],
 ['🤥 Alles ontkennen',c=>{if(chance(.3)){hap(-5);return 'Er is te weinig bewijs. Je wordt vrijgesproken, maar iedereen in de straat weet het.'}jail(c.m,'collaboratie');MS('Werd veroordeeld wegens collaboratie',1);return `Getuigen spreken je tegen. Je krijgt de volle ${c.m>=12?Math.round(c.m/12)+' jaar':c.m+' maanden'}.`}],
 ['🧳 Naar het buitenland vluchten',c=>{if(chance(.5)){S.flags.gevlucht=1;hap(-10);return 'Je vlucht met valse papieren naar Zuid-Amerika. Je ziet je familie nooit meer terug.'}jail(Math.round(c.m*1.3),'collaboratie en vluchtpoging');return 'Je wordt gepakt aan de grens. De straf valt extra hoog uit.'}]]});
Object.assign(EVMETA,{occ_invasie:['Bezetting','⚔️'],occ_pol:['Bezetting','🏛️'],occ_razzia:['Bezetting','🚛'],occ_controle:['Bezetting','🪪'],occ_onderduiker:['Bezetting','🚪'],occ_buurman:['Bezetting','👀'],occ_bedrijf:['Bezetting','🏭'],occ_avondklok:['Bezetting','🌙'],occ_radio:['Bezetting','📻'],occ_honger:['Bezetting','🥣'],occ_arrest:['Bezetting','🚨'],occ_verraad:['Verzet','🐍'],occ_tribunaal:['Bevrijding','⚖️']});
/* ---------- het verzet ---------- */
function sheetOcc(el){const O=occP(),a=ageY();if(!occMe()){empty(el,'Het land is niet (meer) bezet.');return}
  card(el,`<h3>🕯️ Bezetting, jaar ${O.y||1}</h3><span class="muted">${cap(warW().foe)} heeft het land in handen. Avondklok, rantsoenbonnen en controles.${O.ond?' Je bent ondergedoken.':''}${O.hide?` Je verbergt ${O.hide} onderduiker${O.hide>1?'s':''}.`:''}</span><div class="stat"><span>Verzet</span><span></span><span class="v">${Math.round(O.rz)}%</span>${bar(O.rz,'var(--good)')}</div><div class="stat"><span>Meewerken</span><span></span><span class="v">${Math.round(O.col)}%</span>${bar(O.col,'var(--bad)')}</div><div class="stat"><span>Kans op ontdekking</span><span></span><span class="v">${Math.min(100,Math.round(O.risk))}%</span>${bar(Math.min(100,O.risk),'var(--warn)')}</div>`);
  if(a<14){empty(el,'Je bent nog te jong om in het verzet te gaan.');return}
  const s=sec(el,'Verzet');const V=(ic,t,sub,go)=>row(s,{ic,t,s:sub,dots:true,on:go});
  const act=(t,ic,fn)=>doAct(t,()=>{const r=fn();return r},true,ic);
  V('📰','Een illegale krant verspreiden','Minigame · riskant',()=>mgTap('Drukpers','Draai de stencilmachine zo snel als je kunt.',sc=>act('Illegale krant','📰',()=>{use('ok');O.rz=clamp(O.rz+Math.round(2+sc*4));O.risk+=6;return sc>.6?`${ri(400,900)} exemplaren van "Het Vrije Woord" gaan door de brievenbussen.`:'De machine loopt vast. Maar een stapeltje komt er toch uit.'})));
  V('🎫','Voedselbonnen stelen','Een distributiekantoor overvallen',()=>mgCode({title:'Kluis van het distributiekantoor',desc:'Onthoud de code en open de kluis voordat de bewaker terug is.',em:'🎫',len:4},(g,l)=>act('Bonnen','🎫',()=>{use('ob');if(g===l){O.bon=(O.bon||0)+1;O.rz=clamp(O.rz+6);O.risk+=10;return 'Je hebt bonnen voor honderden onderduikers. Een geweldige slag.'}O.risk+=18;return 'De kluis gaat niet open. Jullie vluchten met lege handen.'})));
  V('🚂','Sabotage','Een spoorlijn of opslag opblazen',()=>mgCode({title:'Sabotage',desc:'Onthoud de volgorde van de draden.',em:'🧨',len:5},(g,l)=>act('Sabotage','🚂',()=>{use('os');if(g>=l-1){O.rz=clamp(O.rz+10);O.risk+=16;warW().op+=2;return 'Een trein met munitie voor het front ontspoort. Niemand gewond. De bezetter is woedend.'}O.risk+=22;if(chance(.2))hea(-15);return 'Het mislukt. De lading gaat te vroeg af.'})));
  V('📡','Inlichtingen doorseinen','Minigame · zenden naar Londen',()=>mgReact({title:'Morse',desc:'Sein alleen als de kust veilig is.',em:'📡',idle:'🔴',go:'🟢',fake:'🚗',goTxt:'Veilig: seinen!',btn:'Sein',rounds:3},(h,n)=>act('Inlichtingen','📡',()=>{use('oi');O.rz=clamp(O.rz+Math.round(2+h*2));O.risk+=h===n?5:12;warW().op+=h===n?1:0;return h===n?'Londen bevestigt: je informatie over troepenbewegingen is goud waard.':'Een peilwagen komt de straat in. Je stopt halverwege.'})));
  V('🪂','Een neergestorte piloot helpen','Via de pilotenlijn naar Spanje',()=>act('Pilotenlijn','🪂',()=>{use('op');O.rz=clamp(O.rz+8);O.risk+=10;kar(3);return `Een Canadese piloot zit drie weken op je zolder. Dan brengen jullie hem in vermomming naar België.`}));
  if(S.home.k!=='ouders')V('🏠','Onderduikers in huis nemen',O.hide?`Nu ${O.hide} onderduiker${O.hide>1?'s':''}`:'Een schuilplaats achter de kast',()=>act('Onderduikers','🏠',()=>{O.hide++;O.rz=clamp(O.rz+6);kar(4);return 'Je bouwt een geheime ruimte. Er komt een nieuwe onderduiker bij.'}));
  if(!O.ond)V('🕳️','Zelf onderduiken','Verdwijnen van de straat',()=>ask('Onderduiken?','Je laat je hele leven achter. Geen baan, geen vrijheid, wel veiliger.','Onderduiken',()=>act('Onderduiken','🕳️',()=>{O.ond=1;if(S.job)endJob();O.risk=Math.max(0,O.risk-15);return 'Je pakt één tas en verdwijnt naar een boerderij in de Achterhoek.'}),'go'));
  // groep
  const g=sec(el,'Je verzetsgroep');
  for(const p of O.grp)row(g,{ic:faceOf(p),t:`${p.first} ${p.last}`,role:p.sk,bar:{l:'Vertrouwen',v:p.rel,c:barCol(p.rel)}});
  row(g,{ic:'🤝',t:'Iemand werven',s:O.grp.length>=6?'Je groep is groot genoeg':'Hoe groter de groep, hoe meer je kunt, maar ook meer risico',dis:O.grp.length>=6||!!S.acts.ow,dots:true,on:()=>doAct('Werven',()=>{S.acts.ow=1;if(chance(.65)){const p=mkPerson('polit',pick(['m','v']),S.m-ri(18,50)*12,{rel:ri(40,75)});p.kind='verzet';p.role='verzetsstrijder';p.sk=pick(['koerierster','vervalser','radioman','chauffeur','schutter','arts']);if(chance(.15))p.trait='verrader';O.grp.push(p);O.rz=clamp(O.rz+3);O.risk+=3;return `${p.first} sluit zich aan als ${p.sk}.`}O.risk+=6;return 'Je benadert iemand, maar die schrikt en wil er niets mee te maken hebben. Hopelijk houdt die z\'n mond.'},true,'🤝')});
  if(O.grp.length>=4)row(g,{ic:'🔓',t:'Een gevangenis overvallen',s:'Gearresteerde verzetsmensen bevrijden',dots:true,dis:!!S.acts.ogv,on:()=>doAct('Overval',()=>{S.acts.ogv=1;if(chance(.35+O.grp.length*.05)){O.rz=clamp(O.rz+18);O.risk+=20;MS('Bevrijdde gevangenen bij een overval op een gevangenis',3);return 'In politie-uniformen lopen jullie de gevangenis binnen. Twintig minuten later staan 30 gevangenen buiten.'}O.risk+=35;const lost=O.grp.splice(0,ri(1,2));return `Het loopt mis. ${lost.map(p=>p.first).join(' en ')} ${lost.length>1?'worden':'wordt'} opgepakt.`},true,'🔓')});
  // meewerken
  const c=sec(el,'Meewerken met de bezetter');
  row(c,{ic:'🏭',t:O.colJob?'Stoppen met werk voor de bezetter':'Werken voor de bezetter',s:O.colJob?'':'Goed betaald, maar je wordt "fout"',dots:true,on:()=>doAct('Werk',()=>{if(O.colJob){O.colJob=0;return 'Je stopt. Te laat om het ongedaan te maken, maar het is iets.'}O.colJob=1;O.col=clamp(O.col+15);if(S.job)endJob();return 'Je gaat werken voor het bezettingsbestuur. Het salaris is goed, de blikken op straat niet.'},true,'🏭')});
  row(c,{ic:'🐍',t:'Iemand aangeven voor een beloning',s:'Kopgeld',dots:true,on:()=>ask('Iemand aangeven?','Je geeft een onderduikadres door aan de bezetter.','Aangeven',()=>doAct('Verraad',()=>{const k=Math.round(ri(2,6)*1000*(S.cpi||1));cash(k);O.col=clamp(O.col+30);kar(-20);hap(-8);return `Je krijgt ${fmt(k)}. 's Nachts hoor je de vrachtwagen voorrijden.`},true,'🐍'),'bad')});
  row(c,{ic:'🧺',t:'Zwarte handel',s:'Kopen bij de bezetter, verkopen aan wie honger heeft',on:()=>doAct('Zwarte handel',()=>{use('oz');const k=Math.round(ri(1,4)*1000*(S.cpi||1));cash(k);O.col=clamp(O.col+5);kar(-3);return `Je verkoopt boter en sigaretten tegen woekerprijzen. Winst: ${fmt(k)}.`},true,'🧺')})}
function occInc(){const O=S.occ;if(!O||!O.colJob||!occHere()||inJail())return[];return [['Werk voor de bezetter',Math.round(42000*(S.cpi||1))]]}
function occStory(Hij){const O=S.occ;if(!O||!O.since)return '';const hij=Hij.toLowerCase();
  if(S.flags.verzetsheld)return `Tijdens de bezetting was ${hij} een held van het verzet. Er is een straat naar ${S.p.g==='v'?'haar':'hem'} vernoemd.`;
  if(S.flags.vhk)return `Tijdens de bezetting zat ${hij} in het verzet en kreeg daarvoor het Verzetsherdenkingskruis.`;
  if(S.flags.fout)return `Tijdens de bezetting werkte ${hij} met de bezetter samen. Dat zou ${hij} de rest van ${S.p.g==='v'?'haar':'zijn'} leven achtervolgen.`;
  if(O.rz>=30)return `Tijdens de bezetting zat ${hij} in het verzet.`;
  if(O.ond)return `${Hij} overleefde de bezetting als onderduiker.`;return `${Hij} overleefde de bezetting.`}

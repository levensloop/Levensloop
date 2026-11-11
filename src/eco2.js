/* ================= WERELD & ECONOMIE (fase 2): wereldgebeurtenissen met politieke keuzes ================= */
// per gebeurtenis: naam, duur, startkans per jaar, bevoegd ministerie, beleidsopties [key, titel, uitleg, effect]
const WEV={
 pan:{n:'Pandemie',em:'🦠',dur:[2,3],p:.006,port:'Volksgezondheid',cd:40,
  pol:[['streng','Strenge lockdown','Horeca, sportscholen en scholen dicht. Minder doden, veel economische schade',{g:-3.5,u:1.4,lock:2,dth:.45,def:5}],
       ['licht','Lichte maatregelen','Afstand houden, mondkapjes, beperkte openingstijden',{g:-2,u:.8,lock:1,dth:1,def:3}],
       ['open','Alles open houden','De economie blijft draaien, maar het virus verspreidt zich vrij',{g:-.9,u:.3,lock:0,dth:2.3,def:1}]],npc:{l:'streng',m:'licht',r:'licht'}},
 bank:{n:'Bankencrisis',em:'🏦',dur:[2,2],p:.012,port:'Financiën',cd:20,
  pol:[['redden','De banken redden met belastinggeld','Spaargeld veilig, maar de staatsschuld schiet omhoog',{g:-1.2,def:9,save:1}],
       ['failliet','De bank failliet laten gaan','Geen belastinggeld, maar spaarders boven de garantie verliezen geld',{g:-3,save:0,dep:.4}],
       ['nat','De bank nationaliseren','De staat wordt eigenaar. Spaargeld veilig',{g:-1.6,def:6,save:1}]],npc:{l:'nat',m:'redden',r:'redden'}},
 bub:{n:'Beursbubbel',em:'🫧',dur:[3,5],p:.03,port:'Financiën',cd:12,
  pol:[['regels','Ingrijpen met strenge regels','Minder snelle groei, maar een kleinere klap als het knapt',{mild:1}],
       ['laten','De markt laten werken','Iedereen verdient, tot het misgaat',{mild:0}]],npc:{l:'regels',m:'laten',r:'laten'}},
 ai:{n:'AI-revolutie',em:'🤖',dur:[8,14],p:.07,port:'Economische Zaken',cd:999,minY:2026,
  pol:[['regels','AI streng reguleren','Langzamer, minder banen weg, minder groei',{aiF:.5,g:-.2}],
       ['omscholing','Een omscholingsfonds','Wie zijn baan verliest, kan gratis omscholen',{aiF:1,def:1.5,ww:1}],
       ['belasting','Een AI-belasting','Bedrijven betalen mee aan de gevolgen',{aiF:.8,def:-1,g:-.3}],
       ['vrij','Vrij baan geven','Maximale groei, maar veel banen verdwijnen',{aiF:1.4,g:.6}]],npc:{l:'omscholing',m:'belasting',r:'vrij'}},
 vloed:{n:'Overstroming',em:'🌊',dur:[1,1],p:.012,port:'Infrastructuur',cd:15,
  pol:[['dijken','Investeren in dijken en waterbeheer','Duur, maar volgende keer veel minder schade',{def:2.5,dyke:1}],
       ['herstel','Alleen de schade herstellen','Goedkoper nu, maar het kan opnieuw gebeuren',{def:1}]],npc:{l:'dijken',m:'dijken',r:'herstel'}},
 hitte:{n:'Hittegolf en droogte',em:'🔥',dur:[1,1],p:.06,port:'Klimaat en Energie',cd:4,
  pol:[['plan','Een hitteplan en strenge klimaatdoelen','Minder slachtoffers, kost wat groei',{g:-.3,clim:1}],
       ['niets','Niets extra doen','Het is maar één zomer',{}]],npc:{l:'plan',m:'plan',r:'niets'}},
 energie:{n:'Energiecrisis',em:'⚡',dur:[1,3],p:.012,port:'Klimaat en Energie',cd:10,
  pol:[['plafond','Een prijsplafond voor energie','Rekeningen blijven betaalbaar, de staat betaalt',{def:5,bill:.4,inf:-1.5}],
       ['toeslag','Een energietoeslag voor lage inkomens','Gericht helpen, goedkoper',{def:2,bill:.8}],
       ['kern','Kerncentrales bouwen','Nu geen hulp, maar over tien jaar onafhankelijk',{def:3,bill:1,nuc:1}],
       ['niets','Niets doen','De markt lost het op',{bill:1}]],npc:{l:'plafond',m:'toeslag',r:'kern'}},
 handel:{n:'Handelsoorlog',em:'🚢',dur:[2,4],p:.015,port:'Economische Zaken',cd:12,
  pol:[['terug','Terugslaan met heffingen','Stoer, maar alles wordt duurder',{inf:1,g:-.6}],
       ['praten','Onderhandelen','Kans dat het conflict eerder stopt',{end:.4}],
       ['steun','Exporteurs steunen','Bedrijven overeind houden met subsidie',{def:2,g:.3}]],npc:{l:'steun',m:'praten',r:'terug'}}};
const weList=()=>ecoW().wev||(ecoW().wev=[]);
const weOpt=(ev)=>WEV[ev.id].pol.find(o=>o[0]===ev.pol)||WEV[ev.id].pol[0];
const weX=ev=>weOpt(ev)[3];
// wie beslist? jij als premier, als vakminister, of als dictator
function weIsMine(id){const P=S.pol;if(!P||!P.lvl)return false;if(P.lvl==='dict')return true;return P.lvl==='mp'||(P.lvl==='min'&&P.port===WEV[id].port)}
function weNpc(id){const W=S.pw;let lr=50;if(W&&W.gov&&W.gov.length){const tot=seatSum(W.gov,W.seats)||1;lr=W.gov.reduce((s,g)=>s+(PTY(g)?PTY(g).lr*W.seats[g]/tot:0),0)}const n=WEV[id].npc;return lr<45?n.l:lr>58?n.r:n.m}
function weStart(id){const D=WEV[id],E_=ecoW();const ev={id,y:0,dur:ri(D.dur[0],D.dur[1]),pol:null,by:null,st:{}};weList().push(ev);E_.wlast=E_.wlast||{};E_.wlast[id]=year();
  const txt={pan:'Een nieuw virus verspreidt zich razendsnel over de wereld. De WHO spreekt van een pandemie.',bank:'Een grote bank wankelt. Mensen staan in rijen bij de pinautomaat. Een bankencrisis dreigt.',bub:`Een nieuwe hype op de beurs: ${pick(['AI-aandelen','crypto','tech-aandelen','groene energie-aandelen'])} schieten omhoog. Iedereen wil meedoen.`,
   ai:'Een doorbraak in kunstmatige intelligentie verandert alles. Bedrijven zetten massaal AI in.',vloed:'Na dagen van extreme regen breken de dijken op meerdere plekken. Duizenden huizen staan onder water.',hitte:'Een ongekende hittegolf: weken boven de 35 graden. Rivieren staan droog.',energie:'De gas- en olieprijzen exploderen. Energierekeningen verdrievoudigen.',handel:'Een grote handelsoorlog breekt uit. Landen heffen hoge importtarieven op elkaars producten.'}[id];
  ecoNews(txt,1);if(id==='bub')ev.kind=/crypto/.test(txt)?'crypto':'tech';
  if(weIsMine(id))Q.push({id:'we_beleid',c:{ev:id}});else{ev.pol=weNpc(id);ev.by='npc';ecoNews(`Het kabinet kiest: ${weOpt(ev)[1].toLowerCase()}.`,1)}
  Q.push({id:'war_nieuws',c:{t:D.n,txt:txt+(ev.pol?` Het kabinet kiest: ${weOpt(ev)[1].toLowerCase()}.`:'')}})}
E('we_beleid',{sys:1,t:'Jij beslist',x:c=>{const D=WEV[c.ev];return `${D.em} ${D.n}. Als ${S.pol.lvl==='dict'?'leider van het land':polTl(S.pol.lvl)} moet jij kiezen hoe het land hierop reageert.`},ch:[]});
Object.defineProperty(EV.we_beleid,'ch',{get(){const out=[];for(const id of Object.keys(WEV))for(const o of WEV[id].pol)out.push([`${o[1]}`,c=>{const ev=weList().find(e=>e.id===c.ev&&!e.pol);if(ev){ev.pol=o[0];ev.by='me'}ecoNews(`Jouw besluit: ${o[1].toLowerCase()}.`,1);return `${o[2]}.`},c=>c.ev===id]);return out}});
EVMETA.we_beleid=['Crisis','🏛️'];
/* ---------- het jaarlijkse verloop ---------- */
function weYear(E_){const sh=E_.sh;E_.def=0;const y=year();E_.wlast=E_.wlast||{};const L_=weList();
  // nieuwe gebeurtenissen
  if(L_.length<2)for(const id of Object.keys(WEV)){const D=WEV[id];if(L_.some(e=>e.id===id))continue;if(D.minY&&y<D.minY)continue;if(E_.wlast[id]&&y-E_.wlast[id]<D.cd)continue;
    let p=D.p;if(id==='bank'&&(E_.ph==='hoog'||E_.bubCrash))p*=3;if(id==='energie'&&typeof warW==='function'&&warW().lvl>=2)p*=3;if(id==='energie'&&E_.nuc)p*=.5;if(id==='vloed'&&E_.dyke)p*=.35;if(id==='hitte'&&E_.clim)p*=.7;
    if(chance(p)){weStart(id);break}}
  E_.bubCrash=0;
  for(const ev of L_.slice()){if(!ev.pol&&ev.y===0&&weIsMine(ev.id))continue;if(!ev.pol){ev.pol=weNpc(ev.id);ev.by='npc'}const x=weX(ev);ev.y++;
    sh.g+=x.g||0;sh.u+=x.u||0;sh.inf+=x.inf||0;E_.def+=x.def||0;
    if(ev.id==='pan'){if(ev.y===1&&x.lock>=1)E_.force='recessie';E_.lock=ev.y<=Math.max(1,ev.dur-1)?x.lock:0;if(ev.y===1&&chance(.6))Q.push({id:'pe_pan_ziek',c:{d:x.dth}});if(E_.lock>=1&&S.job&&['kantoor','tech','onderwijs'].includes(jobGroup(S.job.id)))Q.push({id:'pe_pan_thuis'});if(E_.lock===2&&!partner())Q.push({id:'pe_pan_eenzaam'});if(ev.y===2)Q.push({id:'pe_vaccin'});
      for(const p of living(['moeder','vader','opa','oma','partner','broer','zus']))if(pAge(p)>=75&&chance(.035*x.dth)){p.alive=false;p.died=pAge(p);onDeath(p);L(`${p.first} is overleden aan het virus.`,'bad')}
      if(ageY()>=75&&chance(.02*x.dth*(S.st.health<50?2:1)*(S.flags.vax?.3:1))){die('het virus');return}}
    if(ev.id==='bank'&&ev.y===1){sh.ret-=.25;sh.hpg-=.06;E_.force=x.dep&&chance(x.dep)?'depressie':'recessie';const sav=S.money+(S.inv.spaar||0),gar=100000*(S.cpi||1);
      if(sav>gar){if(x.save)Q.push({id:'war_nieuws',c:{t:'Je spaargeld',txt:`Jouw bank is een van de banken in problemen. Dankzij de reddingsoperatie blijft al je geld veilig.`}});else{const loss=Math.round((sav-gar)*.4);const fromS=Math.min(S.inv.spaar||0,loss);S.inv.spaar-=fromS;S.money-=loss-fromS;hap(-12);MS(`Verloor ${fmt(loss)} bij een bankfaillissement`,1);Q.push({id:'war_nieuws',c:{t:'Je bank is failliet',txt:`Jouw bank gaat failliet. Alles boven de garantie van ${fmt(gar)} is voor 40% weg. Je verliest ${fmt(loss)}.`}})}}}
    if(ev.id==='bub'){const crash=ev.y>=ev.dur;if(!crash){sh.ret+=x.mild?.08:.18;sh.crypto+=ev.kind==='crypto'?(x.mild?.35:.9):0;sh.hpg+=.02;if(ev.y===1)Q.push({id:'pe_bubbel',c:{k:ev.kind}})}else{sh.ret-=x.mild?.15:.38;sh.crypto-=ev.kind==='crypto'?(x.mild?.4:.75):.1;sh.g-=x.mild?.8:2;E_.bubCrash=1;ecoNews(`De bubbel knapt! ${ev.kind==='crypto'?'Crypto':'De beurs'} stort in.`,1)}}
    if(ev.id==='ai'){const f=x.aiF;sh.g+=ev.y>=3?.5*f:0;sh.ret+=.04*f;if(S.job&&!inJail()){const gpp=jobGroup(S.job.id);if(gpp==='kantoor'&&chance(.12*f))Q.push({id:'pe_ai_baan'});if(gpp==='tech'&&!S.flags.aiTech){S.flags.aiTech=1;S.job.mult*=1.12;L('Door de AI-revolutie zijn mensen zoals jij gewild. Je krijgt 12% loonsverhoging.','good')}}}
    if(ev.id==='vloed'&&ev.y===1){sh.g-=.4;if(S.home.k==='eigen'&&chance(E_.dyke?.12:.35))Q.push({id:'pe_vloed'})}
    if(ev.id==='hitte'&&ev.y===1){if(ageY()>=70&&!x.clim)hea(-ri(3,8));for(const p of living(['moeder','vader','opa','oma']))if(pAge(p)>=80&&chance(x.clim?.02:.06)){p.alive=false;p.died=pAge(p);onDeath(p)}}
    if(ev.id==='energie'){sh.oil+=ev.y===1?1:.4;if(ageY()>=18&&S.home.k!=='ouders')Q.push({id:'pe_energie',c:{b:x.bill}})}
    if(ev.id==='handel'&&x.end&&chance(x.end))ev.dur=Math.min(ev.dur,ev.y);
    for(const k of ['dyke','clim','nuc'])if(x[k])E_[k]=1;
    if(ev.y>=ev.dur)weEnd(ev)}
  if(!L_.some(e=>e.id==='pan'))E_.lock=0}
function weEnd(ev){const E_=ecoW();E_.wev=weList().filter(e=>e!==ev);const D=WEV[ev.id];
  // hoe goed was de aanpak?
  const good={pan:{streng:1,licht:1,open:-1},bank:{redden:0,failliet:-1,nat:1},bub:{regels:1,laten:-1},ai:{regels:0,omscholing:1,belasting:0,vrij:0},vloed:{dijken:1,herstel:-1},hitte:{plan:1,niets:-1},energie:{plafond:1,toeslag:1,kern:0,niets:-1},handel:{terug:-1,praten:1,steun:0}}[ev.id][ev.pol]??0;
  const sc=good+(chance(.5)?1:0)-(chance(.3)?1:0);
  ecoNews(`${D.n}: de crisis is voorbij.`,1);
  if(ev.by==='me'&&S.pol){const P=S.pol;if(sc>=1){P.pop=clamp(P.pop+6);MS(`Loodste het land door de ${D.n.toLowerCase()}`,2);L(`Je aanpak van de ${D.n.toLowerCase()} wordt alom geprezen.`,'good')}else if(sc<=-1){P.pop=clamp(P.pop-10);L(`Je aanpak van de ${D.n.toLowerCase()} wordt zwaar bekritiseerd.`,'bad');if(S.pex&&chance(.4))S.pex.enq=year()+ri(1,2)}}}
/* ---------- persoonlijke gebeurtenissen ---------- */
E('pe_pan_ziek',{sys:1,t:'Besmet',x:'Je hebt het virus te pakken. Koorts, hoesten, je proeft niets meer.',ch:[
 ['🛏️ Thuisblijven en uitzieken',c=>{hea(-ri(3,8));if(S.job)S.job.perf=clamp(S.job.perf-3);return 'Twee weken later ben je er weer bovenop.'}],
 ['💼 Gewoon doorwerken',c=>{hea(-ri(8,16));if(chance(.3)){kar(-3);return 'Je steekt drie collega\'s aan. Niet je beste moment.'}return 'Je sleept je door de weken heen. Je blijft nog maanden moe.'}]]});
E('pe_pan_thuis',{sys:1,t:'Thuiswerken',x:'Je kantoor is dicht. Je werkt vanaf je keukentafel.',ch:[
 ['🏠 Heerlijk, nooit meer files',()=>{hap(4);return 'Je werkt in je joggingbroek en hebt eindelijk tijd om te koken.'}],
 ['😩 Ik mis mijn collega\'s',()=>{hap(-3);if(S.job)S.job.perf=clamp(S.job.perf-2);return 'De dagen lopen in elkaar over. Videobellen is niet hetzelfde.'}]]});
E('pe_pan_eenzaam',{sys:1,t:'Alleen',x:'De lockdown duurt maar en duurt maar. Je hebt al weken niemand in het echt gezien.',ch:[
 ['📱 Elke avond videobellen met vrienden',()=>{hap(2);for(const p of living('vriend').slice(0,3))p.rel=clamp(p.rel+5);return 'Jullie spelen online spelletjes tot diep in de nacht.'}],
 ['🚶 Lange wandelingen maken',()=>{hea(2);hap(1);return 'Je kent nu elk paadje in de buurt.'}]]});
E('pe_vaccin',{sys:1,t:'Het vaccin',x:'Er is een vaccin. Je krijgt een uitnodiging voor een prik.',ch:[
 ['💉 Prik halen',()=>{S.flags.vax=1;return 'Een pijnlijke arm, een dag moe, en dan een gevoel van opluchting.'}],
 ['🙅 Niet doen',()=>{S.flags.vax=0;return 'Je wacht liever af.'}]]});
E('pe_bubbel',{sys:1,t:'Iedereen wordt rijk',x:c=>`Je buurman vertelt dat hij met ${c.k==='crypto'?'crypto':'tech-aandelen'} al verdubbeld is. Op verjaardagen gaat het nergens anders over.`,ch:[
 ['🚀 Instappen met een flink bedrag',c=>{const v=Math.round(Math.max(0,S.money)*.25);if(v<100)return 'Je hebt er eigenlijk het geld niet voor.';cash(-v);if(c.k==='crypto')S.inv.crypto=(S.inv.crypto||0)+v;else S.inv.index=(S.inv.index||0)+v;return `Je stopt ${fmt(v)} in de hype. Wat kan er misgaan?`}],
 ['🧘 Niet meedoen',()=>'Je laat het aan je voorbijgaan. Je buurman noemt je ouderwets.']]});
E('pe_ai_baan',{sys:1,need:()=>!!S.job,t:'AI neemt het over',x:()=>`Je werkgever voert een AI-systeem in dat een groot deel van jouw werk als ${jobTitle().toLowerCase()} overneemt.`,ch:[
 ['📚 Omscholen',()=>{const k=Math.round(3000*(S.cpi||1));cash(-k);sma(3);S.job.perf=clamp(S.job.perf+10);return `Je volgt een cursus om met de AI te werken (${fmt(k)}). Je bent nu juist onmisbaar.`}],
 ['🤞 Afwachten',()=>{if(chance(.5)){const amt=Math.round(Math.min(salary()*.7,62000*(S.cpi||1)));const t=jobTitle();endJob();S.ww={left:weList().some(e=>e.id==='ai'&&e.pol==='omscholing')?3:2,amt};hap(-10);MS(`Verloor zijn baan aan AI (${t.toLowerCase()})`.replace('zijn',S.p.g==='v'?'haar':'zijn'),1);return 'Je functie verdwijnt. Je krijgt WW.'}return 'Je mag blijven. Voorlopig.'}],
 ['🤖 De AI omarmen',()=>{S.job.perf=clamp(S.job.perf+6);sk('tech',3);return 'Je wordt de AI-expert van je afdeling.'}]]});
E('pe_vloed',{sys:1,t:'Water in huis',x:'Het water staat een meter hoog in je woonkamer.',ch:[
 ['🧹 Alles laten herstellen',()=>{const h=S.props.find(p=>p.id===S.home.pid);const k=Math.round((h?h.value:250000)*.08);cash(-Math.round(k*.5));hap(-8);return `De schade is ${fmt(k)}. De verzekering betaalt de helft. Jij betaalt ${fmt(Math.round(k*.5))}.`}],
 ['🏠 Zelf opknappen',()=>{const h=S.props.find(p=>p.id===S.home.pid);const k=Math.round((h?h.value:250000)*.04);cash(-k);hea(-3);hap(-5);return `Je staat weken te sjouwen. Het kost je ${fmt(k)}.`}]]});
E('pe_energie',{sys:1,t:'De energierekening',x:c=>`Je energierekening is dit jaar ${fmt(Math.round(2600*(S.cpi||1)*c.b))} hoger.${c.b<1?' Dankzij het overheidsbeleid valt het nog mee.':''}`,ch:[
 ['🧥 Verwarming laag, trui aan',c=>{cash(-Math.round(1300*(S.cpi||1)*c.b));hap(-2);return 'Je zit met een dekentje op de bank. Het scheelt de helft.'}],
 ['💸 Gewoon betalen',c=>{cash(-Math.round(2600*(S.cpi||1)*c.b));return 'Au.'}]]});
Object.assign(EVMETA,{pe_pan_ziek:['Pandemie','🤒'],pe_pan_thuis:['Pandemie','🏠'],pe_pan_eenzaam:['Pandemie','😔'],pe_vaccin:['Pandemie','💉'],pe_bubbel:['Beurs','🫧'],pe_ai_baan:['AI','🤖'],pe_vloed:['Overstroming','🌊'],pe_energie:['Energie','⚡']});
/* ---------- invloed vanuit de Kamer en als burger ---------- */
function weMotie(){const L_=weList().filter(e=>!e.done);if(!L_.length)return;modal({title:'Motie over de crisis',em:'📋',cat:'Tweede Kamer',text:'Welk beleid wil je afdwingen?',choices:opts(L_.flatMap(ev=>WEV[ev.id].pol.filter(o=>o[0]!==ev.pol).map(o=>({t:`${WEV[ev.id].em} ${o[1]}`,s:WEV[ev.id].n,on:()=>{closeModal();doAct('Motie',()=>{S.acts.wmot=1;const P=S.pol;if(chance(.3+(S.pw.gov.includes(P.party)?.25:0)+(P.steun-50)/300)){ev.pol=o[0];ev.by='kamer';P.pop=clamp(P.pop+3);ecoNews(`De Kamer dwingt af: ${o[1].toLowerCase()}.`,1);return `Je motie wordt aangenomen! Het kabinet moet het beleid aanpassen: ${o[1].toLowerCase()}.`}P.pop=clamp(P.pop+1);return 'Je motie wordt verworpen, maar je hebt wel van je laten horen.'},true,'📋')}}))))})}
function weActie(){const L_=weList();if(!L_.length)return;modal({title:'Actievoeren',em:'📣',cat:'Burger',text:'Waar kom je voor op?',choices:opts(L_.flatMap(ev=>WEV[ev.id].pol.filter(o=>o[0]!==ev.pol).map(o=>({t:`${WEV[ev.id].em} Voor: ${o[1].toLowerCase()}`,on:()=>{closeModal();doAct('Actie',()=>{S.acts.wact=1;hap(2);sk('sociaal',1);if(ev.by!=='me'&&chance(.04+S.fame/400)){ev.pol=o[0];ev.by='volk';ecoNews(`Na grote protesten draait de regering bij: ${o[1].toLowerCase()}.`,1);return 'De protesten groeien uit tot een landelijke beweging. De regering draait bij!'}return pick(['Je loopt mee met tienduizenden mensen op het Malieveld.','Je plakt posters in de hele stad.','Je spreekt een menigte toe met een megafoon.'])},true,'📣')}}))))})}
/* ---------- landen in de wereld ---------- */
function cntLbl(k){const E_=ecoW();const v=(E_.cs||{})[k]??60;const occ=S.war&&S.war.occ&&S.war.occ[k];const dic=E_.dict&&E_.dict[k];const cq=E_.conq&&E_.conq[k];return occ?'⛔ Bezet':cq?`🏴 Veroverd door het regime van ${cq}`:dic?`🔒 Dictatuur onder ${dic}`:v>=70?'🟢 Bloeiende economie':v>=50?'🟡 Stabiel':v>=30?'🟠 Economische problemen':'🔴 Diepe crisis'}
function worldStates(){const E_=ecoW();E_.cs=E_.cs||{};for(const k of Object.keys(COUNTRIES)){if(k===S.p.country)continue;let v=E_.cs[k]??ri(40,75);v=clamp(Math.round(v+(60-v)*.15+gauss()*8));E_.cs[k]=v}
  if(typeof cntDict==='function')cntDict()}
function sheetWorldEvents(el){const L_=weList();if(L_.length){const s=sec(el,'Lopende crises');for(const ev of L_){const D=WEV[ev.id];row(s,{ic:D.em,t:D.n,s:`Jaar ${Math.min(ev.y+1,ev.dur)} van ${ev.dur} · beleid: ${weOpt(ev)[1].toLowerCase()}${ev.by==='me'?' (jouw besluit)':''}`})}}
  const E_=ecoW();if(!E_.cs)worldStates();const c=sec(el,'Landen');
  for(const [k,v] of Object.entries(E_.cs).sort((a,b)=>b[1]-a[1])){const occ=S.war&&S.war.occ&&S.war.occ[k];const dic=E_.dict&&E_.dict[k];row(c,{ic:flag(k),t:COUNTRIES[k].n,s:cntLbl(k)})}}

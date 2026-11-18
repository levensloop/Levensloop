/* ================= FASE 19: liefde en daten =================
   Keuzes Thijmen: datingapp, relatiefases (met ring kopen en alles rond verloven en trouwen), ruzie en uit elkaar.
   Je partner neemt zelf initiatief (aanzoek, vreemdgaan via f9_ptvreemd, het uitmaken via s_weg), net als in het echt.
   19.1 datingapp (S.dapp): profielen, vegen, superlike, matches, berichtjes, afspreken (dateGame)
   19.2 ring kopen (S.ring) en aanzoek met plek; partner doet zelf een aanzoek (l19_aanzoek)
   19.3 bruiloft plannen (locatie, gasten, kleding, ringen, huwelijksreis), trouwdag als moment (p.wed)
   19.4 ruzie (l19_ruzie), scheiding: huis verdelen en partneralimentatie (S.alim) */

// ---------- 19.1 datingapp ----------
const HOB19=['koken','hardlopen','reizen','gamen','festivals','lezen','fotografie','yoga','voetbal','wandelen','musea','dansen','boulderen','series kijken','tuinieren','paardrijden','muziek maken','wijn proeven','honden','bakken','surfen','schaken'];
const BIO19=['Op zoek naar iemand die net zo hard lacht om slechte grappen.','Eerste date? Koffie. Tweede date? Jij mag kiezen.','Kan heel goed pasta maken. Verder weinig talenten.','Liever een weekendje weg dan een avond in de kroeg.','Mijn moeder vindt me een topper. Bewijs haar gelijk.','Niet op zoek naar iets kortstondigs.','Swipe naar rechts als je ook ananas op pizza durft.','Avontuurlijk, behalve met eten.','Introvert, maar wel met een goede playlist.','Op zondag vind je mij op de markt of in bed.'];
const OPEN19=[['😂','Grappig','"Ik heb een fout gemaakt. Ik swipete per ongeluk naar rechts. Grapje, expres."',['Grappig','Extravert','Avontuurlijk']],
  ['😊','Lief','"Wat een leuke foto\'s! Waar is die met de berg genomen?"',['Lief','Zorgzaam','Verlegen']],
  ['😏','Direct','"Zin om zaterdag iets te drinken?"',['Ambitieus','Zelfverzekerd','Eigenwijs']],
  ['🙄','Gewoon "hoi"','"Hoi."',[]]];
function dapp(){const D=S.dapp||(S.dapp={m:[],y:year(),sw:0,sl:0,prem:0});if(D.y!==year()){D.y=year();D.sw=0;D.sl=0;D.m=D.m.filter(m=>year()-m.y<2)}return D}
const dappMax=()=>dapp().prem?30:12;
function dprof(){const c=candidate();c.hob=[...HOB19].sort(()=>R()-.5).slice(0,3);c.bio=pick(BIO19);c.km=ri(1,25);return c}
const datingTeen=dating;// onder de 18: iemand van school mee uit vragen (de oude manier)
dating=function(){if(inJail()){toast('Daten kan niet vanuit de gevangenis');return}if(ageY()<18)return datingTeen();
  if(!S.flags.pref)return datingTeen();// eerst vragen op wie je valt
  const D=dapp();if(D.sw>=dappMax()){toast(D.prem?'Je hebt dit jaar genoeg geswiped':'Je gratis swipes zijn op voor dit jaar. Premium geeft er meer.');return}
  const next=()=>{if(D.sw>=dappMax()){closeModal();toast('Dat waren je swipes voor dit jaar');refreshSheet();return}const c=dprof();
    modal({title:`${c.first}, ${pAge(c)}`,em:faceOf(c),cat:'Datingapp',text:`${cap(c.job)} · ${c.km} km verderop`,html:`<p style="margin:.2em 0 .6em;font-style:italic">“${he(c.bio)}”</p><div class="pstats"><span>Uiterlijk</span><i><b style="width:${c.looks}%;background:var(--good)"></b></i></div><p class="muted" style="margin:.4em 0 0">❤️ ${c.hob.join(' · ')}</p>`,choices:[
      {t:'❤️ Leuk',cls:'go',on:()=>{D.sw++;swipe(c,0);next()}},
      {t:'⭐ Superlike',s:D.sl?'Al gebruikt dit jaar':'Eén per jaar · grotere kans',dis:!!D.sl,on:()=>{D.sw++;D.sl=1;swipe(c,.2);next()}},
      {t:'✖️ Volgende',on:()=>{D.sw++;next()}},{t:'Stoppen',cls:'ghost',on:()=>{closeModal();refreshSheet()}}]})};next()};
function swipe(c,bonus){const p=clamp(.35+(S.st.looks-c.looks)/150+(S.st.happy-50)/300+S.fame/300+(S.money>50000*(S.cpi||1)?.05:0)+bonus,.05,.9);
  if(chance(p)){const D=dapp();if(D.m.length>=6)D.m.shift();D.m.push({p:c,y:year(),w:0,msg:0});toast(`💞 Het is een match met ${c.first}!`)}}
function openMatch(m){const c=m.p;const D=dapp();const drop=()=>{D.m=D.m.filter(x=>x!==m);refreshSheet()};
  if(!m.msg){modal({title:c.first,em:faceOf(c),cat:'Match',text:`Jullie hebben een match! ${c.first} houdt van ${c.hob.join(', ')}. Wat stuur je als eerste berichtje?`,choices:opts(OPEN19.map(([e,t,q,likes])=>({t:`${e} ${t}`,s:q,on:()=>{closeModal();m.msg=1;
      const good=likes.includes(ktOf(c))||(t==='Lief'&&chance(.35))||(t==='Grappig'&&chance(.3));const bad=t==='Gewoon "hoi"'&&chance(.6);
      if(bad){drop();doAct('Datingapp',()=>`👻 ${c.first} leest je berichtje en reageert nooit meer.`,false,'👻');return}
      m.w+=good?2:1;doAct('Datingapp',()=>good?`${c.first} stuurt meteen terug, met drie lachende smileys. Het gesprek loopt lekker.`:`${c.first} reageert na een paar uur: "Haha, hoi!" Het begin is er.`,false,good?'💬':'📱')}})))});return}
  modal({title:c.first,em:faceOf(c),cat:'Match',text:`Jullie kletsen al een tijdje.${m.w>=3?' Het klikt duidelijk.':''}`,choices:opts([
    {t:'☕ Afspreken',cls:'go',s:'Een eerste date',on:()=>{closeModal();drop();if(chance(clamp(.45+m.w*.12,.3,.95)))dateGame(c);else doAct('Daten',()=>{hap(-2);return `${c.first} zegt de date op het laatste moment af en reageert daarna niet meer.`},false,'💔')}},
    {t:'💬 Nog wat kletsen',on:()=>{closeModal();m.w++;doAct('Datingapp',()=>pick([`Jullie appen tot diep in de nacht.`,`${c.first} stuurt een foto van ${c.hob[0]==='koken'?'een zelfgemaakte lasagne':'een zonsondergang'}.`,'Jullie ontdekken dat jullie allebei een hekel hebben aan koriander.']),false,'💬')}},
    {t:'✂️ Ontmatchen',on:()=>{closeModal();drop()}}])})}
sheetLove=(f=>function(el){const r=f.apply(this,arguments);const a=ageY();if(a<10||partner())return r;const D=dapp();const B=dateBand(),P=datePref();
  const s=sec(el,a<18?'Verkering zoeken':'Datingapp');row(s,{ic:'🎂',t:'Leeftijd',s:B?`${P[0]}–${P[1]===99?'99+':P[1]} jaar${S.flags.dage?'':' (iedereen in je groep)'}`:'',dots:true,on:dageMenu});if(a>=18)row(s,{ic:'📱',t:D.prem?'Premium':'Premium nemen',s:D.prem?'30 swipes per jaar':`${fmt(Math.round(180*(S.cpi||1)))} per jaar · 30 swipes in plaats van 12`,dis:!!D.prem,on:()=>doAct('Premium',()=>{cash(-Math.round(180*(S.cpi||1)));D.prem=1;return 'Je hebt nu Premium. Meer swipes, meer kansen.'},true,'📱')});
  row(s,{ic:'💘',t:'Swipes over',s:`${Math.max(0,dappMax()-D.sw)} van ${dappMax()} dit jaar`});
  for(const m of D.m)row(s,{ic:faceOf(m.p),t:`${m.p.first}, ${pAge(m.p)}`,s:m.msg?(m.w>=3?'Het klikt · afspreken?':'Jullie kletsen'):'Nieuwe match · stuur een berichtje',dots:true,on:()=>openMatch(m)});
  return r})(sheetLove);

// ---------- 19.2 ring en aanzoek ----------
const RINGS=[['💍','Zilveren ring',250,0],['💍','Gouden ring',1200,1],['💎','Ring met een diamant',4500,2],['💎','Grote diamant',20000,3]];
const PLACE19=[['🕯️','Thuis, bij kaarslicht',.05,0],['🍷','In een chique restaurant',.05,0],['🌅','Op het strand bij zonsondergang',.08,0],['⛰️','Op een bergtop',.06,0],['🏟️','In het stadion, op het grote scherm',0,1],['💞','Op de plek waar jullie elkaar ontmoetten',.1,0]];
function ringShop(after){const cp=S.cpi||1;modal({title:'De juwelier',em:'💍',cat:'Liefde',text:'Welke ring koop je?',choices:opts(RINGS.map(([e,t,k,lv])=>({t:`${e} ${t}`,s:fmt(Math.round(k*cp)),dis:S.money<k*cp,on:()=>{closeModal();doAct('Ring gekocht',()=>{cash(-Math.round(k*cp));S.ring={t,lv,k:Math.round(k*cp)};return `Je koopt een ${t.toLowerCase()}. Nu nog het goede moment.`},true,e);after&&setTimeout(after,0)}})))})}
function proposeFlow(p){if(ageY()<18){toast('Vanaf 18 jaar');return}if(!S.ring){ringShop(()=>{});return}
  modal({title:'Het aanzoek',em:'💍',cat:'Liefde',person:p,text:`Je hebt een ${S.ring.t.toLowerCase()}. Waar vraag je ${p.first} ten huwelijk?`,choices:opts(PLACE19.map(([e,t,b,pub])=>({t:`${e} ${t}`,on:()=>{closeModal();doAct('Het aanzoek',()=>{
    const kt=ktOf(p);const exp=clamp(Math.floor(Math.log10(Math.max(100,(p.money||0)/(S.cpi||1)))-2),0,3);let ch=p.rel/110+(p.rel>70?.15:0)+b+(S.ring.lv-exp)*.05;
    if(pub)ch+=['Extravert','Grappig','Avontuurlijk'].includes(kt)?.1:kt==='Verlegen'?-.3:-.05;ch=clamp(ch,.05,.97);
    if(chance(ch)){p.st='verloofd';p.engY=year();p.ring=S.ring.t;S.ring=null;p.rel=clamp(p.rel+8);hap(12);MS(`Verloofde zich met ${p.first}`,2);
      return pub?`Het hele stadion houdt de adem in. ${p.first} knikt, en 40.000 mensen juichen. JA!`:`${p.first} slaat de handen voor de mond, krijgt tranen in de ogen en zegt: "Ja! Natuurlijk ja!"`}
    p.rel=clamp(p.rel-15);hap(pub?-15:-10);return pub?`${p.first} schudt het hoofd en loopt weg. Op het grote scherm. Het filmpje gaat de hele wereld over. De ring houd je.`:`${p.first} kijkt je lang aan en zegt zacht: "Nog niet." De ring gaat terug in je zak.`},true,e)}})))})}
// ook zonder partner kun je een ring kopen of terugbrengen
E('l19_aanzoek',{sys:1,need:c=>{const p=partner();return !!p&&p.id===c.id&&p.st==='relatie'&&!inJail()},t:'Een aanzoek!',x:c=>{const p=P(c.id);return `${p.first} gaat ineens op één knie, met een doosje in de hand. "Wil je met me trouwen?"`},ch:[
  ['💍 Ja!',c=>{const p=P(c.id);p.st='verloofd';p.engY=year();p.ring=pick(['Gouden ring','Ring met een diamant','Zilveren ring']);p.rel=clamp(p.rel+10);hap(14);MS(`Verloofde zich met ${p.first}`,2);return `Je zegt ja! ${p.first} schuift de ring om je vinger. Jullie zijn verloofd.`}],
  ['⏳ Nog niet',c=>{const p=P(c.id);p.rel=clamp(p.rel-6);hap(-2);return `${p.first} slikt even, maar begrijpt het. "Dan vraag ik het later nog een keer."`}],
  ['🙅 Nee',c=>{const p=P(c.id);p.rel=clamp(p.rel-22);hap(-6);if(chance(.35)){breakUp();return `${p.first} kan het niet aan en maakt het uit.`}return `Het blijft lang stil. ${p.first} is diep gekwetst.`}]]});
EVMETA.l19_aanzoek=['Liefde','💍'];

// ---------- 19.3 bruiloft plannen ----------
const WLOC=[['🏛️','Gemeentehuis',1500],['⛪','Kerk',3500],['🏖️','Op het strand',9000],['🏰','Kasteel',25000],['🎰','Las Vegas',2500]];
const WGST=[['👫','Alleen getuigen',4],['👨‍👩‍👧','50 gasten',50],['🎉','120 gasten',120],['🥂','250 gasten',250]];
const WCLO=[['👔','Eenvoudig',400],['👗','Mooi en op maat',2000],['✨','Designer',9000]];
const WRNG=[['💍','Eenvoudige ringen',500],['💍','Gouden ringen',1800],['💎','Platina met diamantjes',6000]];
const WHON=[['🏠','Geen huwelijksreis',0],['🇮🇹','Een week Italië',2500],['🏝️','Verre reis (Bali of de Malediven)',8000],['🌍','Wereldreis van drie maanden',25000]];
function canMarry(p){if(typeof sameSex==='function'&&sameSex(p)&&typeof idc==='function'&&['nee','strafbaar','partner'].includes(idc()[1]))return false;return true}
function weddingPlan(p){if(!canMarry(p)){if(!Q.some(q=>q.id==='idn_trouwen'))Q.push({id:'idn_trouwen',c:{id:p.id}});closeSheet();processQ();return}
  const cp=S.cpi||1,W={};const steps=[['loc','Waar trouwen jullie?',WLOC],['g','Hoeveel gasten?',WGST],['c','Wat trek je aan?',WCLO],['r','Welke trouwringen?',WRNG],['h','En de huwelijksreis?',WHON]];
  const cost=()=>Math.round(((W.loc?W.loc[2]:0)+(W.g?(W.loc&&W.loc[1]==='Las Vegas'?0:W.g[2]*85):0)+(W.c?W.c[2]:0)+(W.r?W.r[2]:0)+(W.h?W.h[2]:0))*cp);
  const step=i=>{if(i>=steps.length)return confirm_();const [k,q,L_]=steps[i];let list=L_;if(k==='g'&&W.loc&&W.loc[1]==='Las Vegas')list=[L_[0]];
    modal({title:'De bruiloft plannen',em:'💒',cat:`Stap ${i+1} van ${steps.length} · tot nu toe ${fmt(cost())}`,text:q,choices:opts(list.map(o=>({t:`${o[0]} ${o[1]}`,s:k==='g'?(o[2]>4?`ongeveer ${fmt(Math.round(o[2]*85*cp))}`:'bijna gratis'):o[2]?fmt(Math.round(o[2]*cp)):'gratis',on:()=>{W[k]=o;step(i+1)}})))})};
  const confirm_=()=>{const k=cost();modal({title:'Jullie bruiloft',em:'💒',cat:'Liefde',person:p,text:`${W.loc[1]} · ${W.g[1].toLowerCase()} · ${W.c[1].toLowerCase()} · ${W.r[1].toLowerCase()} · ${W.h[1].toLowerCase()}.`,html:`<p style="margin:.4em 0 0;font-weight:700">Totaal: ${fmt(k)}</p>`,choices:opts([
    {t:'💒 Trouwen!',cls:'go',dis:S.money<k,s:S.money<k?`Je hebt ${fmt(S.money)}`:'',on:()=>{closeModal();doAct('Getrouwd!',()=>wedDay(p,W,k),true,'💒')}},
    {t:'🔁 Opnieuw plannen',on:()=>{for(const x in W)delete W[x];step(0)}}])})};step(0)}
function wedDay(p,W,k){cash(-k);p.st='getrouwd';p.since=p.since??ageY();p.wed={y:year(),loc:W.loc[1],g:W.g[2]};p.rel=clamp(p.rel+10);S.flags.getrouwd=1;
  const big=W.g[2]>=120,lux=W.loc[2]>=9000;hap(12+(big?4:0)+(lux?3:0));MS(`Trouwde met ${p.first} (${W.loc[1].toLowerCase()})`,3);if(S.home.k==='ouders')setRent('Appartement',Math.round(16500*(S.cpi||1)));
  if(W.g[2]>=50)for(const q of living(['moeder','vader','broer','zus','vriend','opa','oma']))q.rel=clamp(q.rel+3);
  const fun=pick([`Je getuige houdt een speech die net iets te lang duurt, maar iedereen huilt van het lachen.`,`Het begint precies tijdens het jawoord te regenen. De foto's worden er alleen maar mooier van.`,`De taart kantelt bijna, maar de kok vangt hem op. Applaus.`,`Je ${living('oma').length?'oma':'moeder'} danst de hele avond alsof ze twintig is.`,`De dj draait jullie nummer en de hele zaal zingt mee.`,`${p.first} verspreekt zich bij de geloften. Iedereen lacht, jullie het hardst.`]);
  let hon='';if(W.h[2]){p.rel=clamp(p.rel+6);hap(5);hon=` Daarna: ${W.h[1].toLowerCase()}.`}
  return `Je bent getrouwd met ${p.first}! ${fun}${hon}`}

// ---------- 19.4 ruzie en scheiding ----------
const RUZ19=[['💶','geld','Jullie krijgen ruzie over geld. "Waarom heb je dát nou weer gekocht?"'],['🧺','het huishouden','De afwas staat er al drie dagen. Er valt een heel verkeerd woord.'],['👵','de schoonfamilie','Na een verjaardag bij de schoonfamilie barst de bom.'],['💼','het werk','"Je bent er nooit," zegt %n. "Je werk gaat altijd voor."'],['📱','de telefoon','%n vindt dat je de hele avond op je telefoon zit.'],['🧒','een kinderwens','Jullie willen niet hetzelfde als het om kinderen gaat.']];
E('l19_ruzie',{sys:1,need:c=>!!partner()&&!inJail(),t:'Ruzie',ctx:()=>({k:ri(0,RUZ19.length-1)}),x:c=>{const p=partner();const r=RUZ19[c.k]||RUZ19[0];return r[2].replace('%n',p.first)},ch:[
  ['💬 Rustig uitpraten',()=>{const p=partner();if(chance(.45+S.sk.sociaal/200)){p.rel=clamp(p.rel+ri(4,9));sk('sociaal',1);return 'Jullie praten tot diep in de nacht. Daarna voelt het beter dan ooit.'}p.rel=clamp(p.rel-3);return 'Het gesprek loopt vast. Jullie gaan zwijgend naar bed.'}],
  ['🤝 Toegeven',()=>{const p=partner();p.rel=clamp(p.rel+4);hap(-2);return `Je geeft ${p.first} gelijk. De vrede keert terug, al knaagt het een beetje.`}],
  ['🚪 Boos weglopen',()=>{const p=partner();p.rel=clamp(p.rel-ri(6,12));hap(-3);return 'Je slaat de deur hard dicht en loopt een rondje. Het lost niets op.'}]]});
EVMETA.l19_ruzie=['Liefde','💢'];
// scheiding: het huis verdelen en partneralimentatie (boven op de bestaande verdeling van het saldo)
breakUp=(f=>function(){const p=partner();const wasM=p&&p.st==='getrouwd';const pren=p&&p.prenup;const yrs=p&&p.since!=null?ageY()-p.since:0;const name=p&&p.first;
  const r=f.apply(this,arguments);if(!wasM||pren)return r;
  // het huis waar jullie samen wonen
  const h=S.home&&S.home.k==='eigen'&&S.props.find(x=>x.id===S.home.pid);if(h){const eq=Math.max(0,Math.round((h.value||0)-(h.mort||0)));const half=Math.round(eq/2);
    if(half>0){if(S.money>=half){cash(-half);L(`🏠 Je houdt het huis en koopt ${name} uit voor ${fmt(half)}.`,'bad')}else{L(`🏠 Je kunt ${name} niet uitkopen. Jullie verkopen het huis; ${name} krijgt de helft van de overwaarde (${fmt(half)}).`,'bad');S.props=S.props.filter(x=>x!==h);cash(eq-half);safe(()=>setRent('Appartement',Math.round(14000*(S.cpi||1))))}}}
  // partneralimentatie: als jij veel meer verdient, max 5 jaar (en niet langer dan de helft van het huwelijk)
  const mine=salary(),theirs=p.job&&!['student','scholier','werkloos'].includes(p.job)?Math.round(32000*(S.cpi||1)):0;const amt=Math.round(Math.max(0,(mine-theirs)*.25));const n=Math.min(5,Math.floor(yrs/2));
  if(amt>=1000&&n>=1){S.alim={n:name,amt,until:year()+n};L(`⚖️ Je betaalt ${name} de komende ${n} jaar partneralimentatie: ${fmt(amt)} per jaar.`,'bad')}
  return r})(breakUp);
F8.year.push(a=>{if(!S.alive)return;const p=partner();
  // alimentatie
  if(S.alim){if(year()>S.alim.until){L(`⚖️ Je laatste partneralimentatie aan ${S.alim.n} is betaald.`,'good');S.alim=null}else{cash(-S.alim.amt);if(period&&period.out){period.out['Partneralimentatie']=(period.out['Partneralimentatie']||0)+S.alim.amt;period.exp+=S.alim.amt}}}
  if(!p||inJail()||Q.some(q=>/^(l19_|s_weg|f9_pt)/.test(q.id)))return;
  // partner doet een aanzoek
  const yrs=p.since!=null?a-p.since:0;if(p.st==='relatie'&&yrs>=2&&a>=20&&p.rel>=75&&!S.ring&&chance(.18)){Q.push({id:'l19_aanzoek',c:{id:p.id}});return}
  // ruzie
  if(p.rel>=25&&p.rel<=65&&chance(.1)&&(typeof fmFree!=='function'||fmFree()))Q.push({id:'l19_ruzie'})});
// in het scherm van je partner: ring en aanzoek, bruiloft plannen, getrouwd-sinds
F8.person.push((el,p)=>{if(p.role!=='partner'||!p.alive)return;if(p.wed||p.ring){const bits=[];if(p.ring)bits.push(`${p.st==='getrouwd'?'Verlovingsring':'Ring'}: ${p.ring.toLowerCase()}`);if(p.wed)bits.push(`Getrouwd in ${p.wed.y} · ${p.wed.loc.toLowerCase()} · ${p.wed.g} gasten`);card(el,`<span class="muted">💍 ${bits.join(' · ')}</span>`)}});

// ---------- 19.5 leeftijd bij daten (keuze Thijmen, 18 nov 22:00) ----------
// Je datet binnen je eigen leeftijdsgroep: 10–14, 14–16, 16–30, 30+ (op een grensleeftijd hoor je bij beide groepen).
// Minderjarigen daten alleen met minderjarigen, volwassenen alleen met volwassenen. In de app kies je zelf een leeftijd binnen je groep.
const DBANDS=[[10,14],[14,16],[16,30],[30,99]];
function dateBand(a){a=a??ageY();const bs=DBANDS.filter(([lo,hi])=>a>=lo&&a<=hi);if(!bs.length)return null;let lo=Math.min(...bs.map(b=>b[0])),hi=Math.max(...bs.map(b=>b[1]));if(a<18)hi=Math.min(hi,17);else lo=Math.max(lo,18);return [lo,hi]}
function datePref(){const B=dateBand();if(!B)return null;const P=S.flags.dage;if(!P)return B;const lo=Math.max(B[0],P[0]),hi=Math.min(B[1],P[1]);return lo<=hi?[lo,hi]:B}
candidate=(f=>function(o){const p=f.apply(this,arguments);const a=ageY();const B=(o&&o.app)?datePref():dateBand();if(!B)return p;
  // in de app: alles binnen je gekozen leeftijden; ergens anders tegenkomen: meestal iemand rond je eigen leeftijd (binnen je groep)
  const age=(o&&o.app)?ri(B[0],B[1]):clamp(a+ri(-6,6),B[0],B[1]);p.born=S.m-age*12-ri(0,11);
  if(age<18)p.job='scholier';else if(age<22&&p.job!=='student'&&chance(.6))p.job='student';else if(age>=22&&(p.job==='scholier'||p.job==='student'))p.job=pick(KIDJOBS);
  if(age>=67&&chance(.8))p.job='gepensioneerd';return p})(candidate);
function dageMenu(){const B=dateBand();if(!B){toast('Daten kan vanaf 10 jaar');return}const w=B[1]-B[0];const st=w<=4?1:w<=8?2:w<=14?4:10;const ch=[{t:`Iedereen in je groep (${B[0]}–${B[1]===99?'99+':B[1]})`,cls:!S.flags.dage?'go':'',on:()=>{closeModal();S.flags.dage=null;refreshSheet()}}];
  for(let lo=B[0];lo<=B[1];lo+=st){const hi=Math.min(B[1],lo+st-1);const cur=S.flags.dage&&S.flags.dage[0]===lo&&S.flags.dage[1]===hi;ch.push({t:lo===hi?`${lo} jaar`:`${lo}–${hi===99?'99+':hi} jaar`,cls:cur?'go':'',on:()=>{closeModal();S.flags.dage=[lo,hi];refreshSheet()}})}
  modal({title:'Leeftijd',em:'🎂',cat:'Datingapp',text:'Tussen welke leeftijden zoek je?',choices:opts(ch)})}
const KBIO19=['Houdt van games en pizza.','Zit op voetbal en is altijd te laat.','Kan heel goed tekenen.','Zoekt iemand om samen mee naar de film te gaan.','Altijd in voor een grap.','Heeft een hond die Bob heet.'];
const KHOB19=['gamen','voetbal','tekenen','dansen','muziek','zwemmen','skaten','lezen','paardrijden','films','turnen','knutselen'];
dprof=function(){const c=candidate({app:1});const kid=pAge(c)<18;c.hob=[...(kid?KHOB19:HOB19)].sort(()=>R()-.5).slice(0,3);c.bio=pick(kid?KBIO19:BIO19);c.km=ri(1,kid?8:25);return c};
dating=(f=>function(){if(inJail()){toast('Daten kan niet vanuit de gevangenis');return}if(ageY()<10){toast('Daten kan vanaf 10 jaar');return}if(!S.flags.pref)return datingTeen();return f.apply(this,arguments)})(
  function(){const D=dapp();if(D.sw>=dappMax()){toast(D.prem?'Je hebt dit jaar genoeg geswiped':'Je swipes zijn op voor dit jaar'+(ageY()>=18?'. Premium geeft er meer.':'.'));return}
    const next=()=>{if(D.sw>=dappMax()){closeModal();toast('Dat waren je swipes voor dit jaar');refreshSheet();return}const c=dprof();
      modal({title:`${c.first}, ${pAge(c)}`,em:faceOf(c),cat:ageY()<18?'Verkering zoeken':'Datingapp',text:`${cap(c.job)} · ${c.km} km verderop`,html:`<p style="margin:.2em 0 .6em;font-style:italic">“${he(c.bio)}”</p><div class="pstats"><span>Uiterlijk</span><i><b style="width:${c.looks}%;background:var(--good)"></b></i></div><p class="muted" style="margin:.4em 0 0">❤️ ${c.hob.join(' · ')}</p>`,choices:[
        {t:'❤️ Leuk',cls:'go',on:()=>{D.sw++;swipe(c,0);next()}},
        {t:'⭐ Superlike',s:D.sl?'Al gebruikt dit jaar':'Eén per jaar · grotere kans',dis:!!D.sl,on:()=>{D.sw++;D.sl=1;swipe(c,.2);next()}},
        {t:'✖️ Volgende',on:()=>{D.sw++;next()}},{t:'Stoppen',cls:'ghost',on:()=>{closeModal();refreshSheet()}}]})};next()});
// openingszinnen voor kinderen en tieners
const OPEN19K=[['😂','Grappig','"Ik heb gehoord dat je goed bent in ' + 'Mario Kart. Durf je het tegen mij op te nemen?"',['Grappig','Extravert','Avontuurlijk']],['😊','Lief','"Leuk dat we een match hebben! Wat is je lievelingsfilm?"',['Lief','Zorgzaam','Verlegen']],['😏','Direct','"Zin om zaterdag samen naar de film te gaan?"',['Ambitieus','Zelfverzekerd','Eigenwijs']],['🙄','Gewoon "hoi"','"Hoi."',[]]];
openMatch=(f=>function(m){if(ageY()>=18||m.msg)return f.apply(this,arguments);const keep=OPEN19.slice();OPEN19.splice(0,OPEN19.length,...OPEN19K);try{return f.apply(this,arguments)}finally{OPEN19.splice(0,OPEN19.length,...keep)}})(openMatch);

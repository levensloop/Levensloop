/* ================= SPORT ================= */
const SPORTS={
voetbal:{n:'Voetbal',em:'⚽',c:'voetbalclub',nn:'voetballer',team:1,sal:[30,150,1200,9000],car:[17,35],stat:['doelpunten',14],win:'Je scoort de winnende goal in de laatste minuut!'},
basketbal:{n:'Basketbal',em:'🏀',c:'basketbalclub',nn:'basketballer',team:1,sal:[30,200,2500,25000],car:[18,35],stat:['punten gemiddeld per wedstrijd',18],win:'Je maakt de beslissende driepunter op de zoemer!'},
americanfootball:{n:'American football',em:'🏈',c:'footballclub',nn:'footballspeler',team:1,sal:[20,700,3500,20000],car:[18,32],stat:['touchdowns',9],win:'Je vangt de winnende touchdown in de laatste seconde!'},
honkbal:{n:'Honkbal',em:'⚾',c:'honkbalclub',nn:'honkballer',team:1,sal:[20,400,3000,20000],car:[18,37],stat:['homeruns',22],win:'Je slaat een homerun in de laatste inning!'},
ijshockey:{n:'IJshockey',em:'🏒',c:'ijshockeyclub',nn:'ijshockeyer',team:1,sal:[25,500,2500,8000],car:[18,35],stat:['goals',25],win:'Je scoort in de verlenging!'},
hockey:{n:'Hockey',em:'🏑',c:'hockeyclub',nn:'hockeyer',team:1,sal:[10,40,120,300],car:[17,33],stat:['doelpunten',14],win:'Je maakt de winnende strafcorner!'},
volleybal:{n:'Volleybal',em:'🏐',c:'volleybalclub',nn:'volleyballer',team:1,sal:[15,60,250,800],car:[18,34],stat:['punten',220],win:'Je slaat de beslissende smash!'},
rugby:{n:'Rugby',em:'🏉',c:'rugbyclub',nn:'rugbyspeler',team:1,sal:[15,90,400,1200],car:[18,33],stat:['tries',9],win:'Je duikt over de lijn voor de winnende try!'},
cricket:{n:'Cricket',em:'🏏',c:'cricketclub',nn:'cricketspeler',team:1,sal:[15,80,600,3000],car:[18,37],stat:['runs',550],win:'Je slaat de winnende six!'},
tennis:{n:'Tennis',em:'🎾',c:'tennisclub',nn:'tennisser',team:0,sal:[10,150,2000,15000],car:[16,34],stat:['toernooizeges',3],win:'Je wint de finale in een zinderende tiebreak!'},
wielrennen:{n:'Wielrennen',em:'🚴',c:'wielerclub',nn:'wielrenner',team:0,sal:[15,60,600,5000],car:[18,37],stat:['overwinningen',4],win:'Je wint de sprint met een bandbreedte verschil!'},
schaatsen:{n:'Schaatsen',em:'⛸️',c:'ijsclub',nn:'schaatser',team:0,sal:[10,40,200,600],car:[17,34],stat:['medailles',3],win:'Je rijdt een baanrecord!'},
atletiek:{n:'Atletiek',em:'🏃',c:'atletiekvereniging',nn:'atleet',team:0,sal:[10,40,400,3000],car:[17,34],stat:['overwinningen',5],win:'Je loopt een persoonlijk record en wint!'},
zwemmen:{n:'Zwemmen',em:'🏊',c:'zwemvereniging',nn:'zwemmer',team:0,sal:[10,40,300,2000],car:[16,30],stat:['medailles',4],win:'Je tikt als eerste aan, met een honderdste voorsprong!'},
golf:{n:'Golf',em:'⛳',c:'golfclub',nn:'golfer',team:0,sal:[10,150,2000,20000],car:[18,45],stat:['toernooizeges',2],win:'Je slaat een hole-in-one op de laatste hole!'},
badminton:{n:'Badminton',em:'🏸',c:'badmintonclub',nn:'badmintonner',team:0,sal:[10,40,250,1500],car:[17,33],stat:['toernooizeges',3],win:'Je wint de beslissende game met 21-19!'}
};
const SPOP={
NL:{voetbal:95,hockey:75,schaatsen:80,wielrennen:70,tennis:50,volleybal:45,atletiek:45,zwemmen:45,basketbal:25,golf:25,badminton:20,honkbal:15,ijshockey:12,rugby:10,americanfootball:5,cricket:5},
BE:{voetbal:90,wielrennen:95,hockey:60,tennis:55,atletiek:40,basketbal:35,volleybal:40,zwemmen:30,golf:20,badminton:15,schaatsen:20,rugby:10,ijshockey:10},
DE:{voetbal:100,ijshockey:45,basketbal:35,tennis:50,wielrennen:40,schaatsen:30,atletiek:45,zwemmen:40,volleybal:30,golf:20,hockey:25,badminton:20,rugby:10,americanfootball:15},
UK:{voetbal:100,cricket:70,rugby:75,tennis:60,golf:55,wielrennen:45,atletiek:50,zwemmen:40,hockey:35,basketbal:20,badminton:20,americanfootball:10},
US:{americanfootball:100,basketbal:95,honkbal:85,ijshockey:60,golf:60,zwemmen:55,tennis:50,atletiek:50,voetbal:45,volleybal:35,wielrennen:15,schaatsen:15,rugby:10,hockey:10,badminton:5},
CA:{ijshockey:100,basketbal:60,americanfootball:55,honkbal:45,voetbal:40,golf:40,tennis:35,schaatsen:40,zwemmen:35,atletiek:35,volleybal:25,rugby:15,cricket:10},
FR:{voetbal:95,rugby:70,wielrennen:75,tennis:60,basketbal:40,atletiek:40,zwemmen:40,volleybal:35,golf:25,badminton:20,ijshockey:15},
IT:{voetbal:100,wielrennen:70,volleybal:60,tennis:55,basketbal:45,zwemmen:40,atletiek:35,rugby:25,golf:20,schaatsen:20},
ES:{voetbal:100,basketbal:60,tennis:65,wielrennen:55,golf:35,zwemmen:30,atletiek:35,volleybal:25,badminton:20},
AU:{cricket:85,rugby:85,zwemmen:75,tennis:70,voetbal:50,golf:50,basketbal:45,atletiek:45,wielrennen:35,hockey:30,volleybal:20},
JP:{honkbal:95,voetbal:65,volleybal:55,golf:50,zwemmen:50,schaatsen:50,tennis:45,basketbal:45,atletiek:45,badminton:50,rugby:35},
BR:{voetbal:100,volleybal:80,basketbal:40,zwemmen:40,atletiek:30,tennis:30,wielrennen:15},
MX:{voetbal:95,honkbal:55,basketbal:35,americanfootball:30,tennis:25,atletiek:25,golf:20},
ZA:{rugby:95,cricket:85,voetbal:75,golf:55,atletiek:45,zwemmen:40,tennis:30,hockey:30},
TR:{voetbal:95,basketbal:70,volleybal:65,atletiek:30,tennis:25},
MA:{voetbal:95,atletiek:60,tennis:25,basketbal:20},
ID:{badminton:95,voetbal:80,volleybal:40,basketbal:30,atletiek:25}
};
const US_UNIS=['Westbrook University','Lakeshore State','Pine Valley College','Redwood University','Clearwater State','Silver Creek University','Northgate College'];
const sportPop=(id,c)=>((SPOP[c||S.p.country]||{})[id]??15);
const popStars=v=>{const n=Math.max(1,Math.min(5,Math.round(v/20)));return '★'.repeat(n)+'☆'.repeat(5-n)};
const bestCountry=id=>Object.keys(COUNTRIES).sort((a,b)=>sportPop(id,b)-sportPop(id,a))[0];
const topCountries=id=>{const mx=sportPop(id,bestCountry(id));return Object.keys(COUNTRIES).filter(k=>sportPop(id,k)>=mx-5)};
JOBS.push({id:'prosport',lad:['Semi-prof','Prof','Topspeler','Wereldster'],sal:[1,1,1,1],req:{age:[99,99]},fame:1,hide:1});
const STAGE={club:'Amateurclub',school:'Schoolteam',academie:'Jeugdopleiding',uni:'Universiteitsteam',pro:'Prof',gestopt:'Gestopt'};
function sportTitle(){const P=S.sport;if(!P)return'';const nn=SPORTS[P.id].nn;return [`Semi-prof ${nn}`,`Prof${nn}`,`Top${nn}`,`Wereldberoemde ${nn}`][P.lvl||0]}
function stageLabel(){const P=S.sport;if(!P)return'';return P.st==='pro'?sportTitle():STAGE[P.st]}
function sportSalaryK(lvl,id,c){return Math.max(5,Math.round(SPORTS[id].sal[lvl]*(.3+sportPop(id,c)*.009)))}
function proClub(id,cn){const D=SPORTS[id];const city=pick(COUNTRIES[cn].cities);if(!D.team)return pick(['Team Velocity','Team Orion','Polaris Pro','Atlas Racing','Team Noordster','Lumen Sports']);return id==='voetbal'?pick([`FC ${city}`,`${city} United`,`Sporting ${city}`,`${city} City`]):`${city} ${pick(['Hawks','Giants','Lions','Wolves','Titans','Stars','Eagles'])}`}
function joinSport(id){const D=SPORTS[id];S.sport={id,sk:clamp(Math.round(S.sk.sport*.5+ri(5,18))),st:'club',team:`${cap(D.c)} ${S.p.city}`,lvl:0,yrs:0,inj:0,seasons:[],best:0};L(`Je bent lid geworden van ${S.sport.team}.`,'good');MS(`Begon met ${D.n.toLowerCase()}`,0);return S.sport}
function relocate(k){const o=C(),n=COUNTRIES[k];if(k===S.p.country)return;const f=(o.k/o.rate)/(n.k/n.rate);const m=x=>Math.round(x*f);
  S.money=m(S.money);S.debt=m(S.debt);S.loan=m(S.loan);for(const i in S.inv)S.inv[i]=m(S.inv[i]);if(S.invIn)for(const i in S.invIn)S.invIn[i]=m(S.invIn[i]);
  for(const p of S.re||[]){p.value=m(p.value);p.mort=m(p.mort);p.buy=m(p.buy);if(p.uRent)p.uRent=m(p.uRent);if(p.ten)p.ten.rent=m(p.ten.rent)}for(const p of S.props){p.value=m(p.value);p.mort=m(p.mort);p.mort0=m(p.mort0);p.buy=m(p.buy);for(const d of p.def||[])d.cost=m(d.cost)}for(const c of S.cars){c.value=m(c.value);if(c.buy!=null)c.buy=m(c.buy)}for(const it of S.items){it.value=m(it.value);if(it.buy!=null)it.buy=m(it.buy)}
  for(const x of S.angel||[]){x.v=m(x.v);x.in=m(x.in)}for(const b of S.biz){for(const p of b.emp||[])p.wage=m(p.wage);if(b.sal)b.sal=m(b.sal);b.cash=m(b.cash);b.value=m(b.value);b.demand=m(b.demand);if(b.buy!=null)b.buy=m(b.buy)}if(S.pension)S.pension=m(S.pension);
  if(typeof polEmig==='function')polEmig(k);S.p.bc=S.p.bc||o0bc();S.p.country=k;S.p.city=pick(n.cities);S.home={k:'huur',name:'Appartement',rent:16500};S.flags.mk=null;S.flags.wereld=1;L(`Je verhuist voor je carrière naar ${S.p.city}, ${n.n}.`,'big');MS(`Verhuisde naar ${n.n} voor de sport`,2)}
function signPro(lvl,cn,team,k){const P=S.sport;if(cn&&cn!==S.p.country)relocate(cn);k=k||sportSalaryK(lvl,P.id,S.p.country);if(S.job)endJob();if(S.edu.cur&&P.st==='uni'){L(`Je stopt met ${S.edu.cur.name} om prof te worden.`);S.edu.cur=null}
  S.job={id:'prosport',lvl,perf:60,yrs:0,lyrs:0,mult:k,co:team,part:false};P.st='pro';P.lvl=lvl;P.team=team;P.retAsk=0;collectCareer('prosport');
  L(`Je tekent bij ${team}: ${fmt(k*1000*(S.cpi||1))} per jaar.`,'good big');MS(`Werd ${sportTitle().toLowerCase()} bij ${team}`,3);if(lvl===3)S.flags.top=1;S.hist.topJob=sportTitle();hap(15)}
function retireSport(){const P=S.sport;if(!P)return;const t=P.st==='pro'?sportTitle():'';if(S.job&&S.job.id==='prosport')endJob();P.st='gestopt';L(t?`Je neemt afscheid als ${t.toLowerCase()}.`:`Je stopt met ${SPORTS[P.id].n.toLowerCase()}.`,'big');if(t)MS(`Stopte als ${t.toLowerCase()}`,2)}
function offerFor(lvl){const P=S.sport,home=S.p.country,tops=topCountries(P.id);const homeTop=tops.includes(home);const cn=lvl>=3?(homeTop&&chance(.4)?home:pick(tops)):(lvl>=2||sportPop(P.id,home)<40)&&chance(.7)?pick(tops):home;return{lvl,cn,team:proClub(P.id,cn),k:sportSalaryK(lvl,P.id,cn)}}
function sportYear(a){const P=S.sport;if(!P||P.st==='gestopt'||inJail())return;if(typeof dopeYear==='function'&&dopeYear())return;const D=SPORTS[P.id],pop=sportPop(P.id),did=S.lastActs||{};
  if(P.st==='school'&&S.edu.stage!=='middel')P.st='club';
  if(P.st==='uni'&&!S.edu.cur){P.st='club';P.team=`${cap(D.c)} ${S.p.city}`}
  const tr=Math.min(4,did.train||0);
  let g=((a<20?ri(0,3):a<27?ri(0,2):0)+tr*.7+(['academie','uni','pro'].includes(P.st)?1:0)+(S.st.health-60)/30)*Math.max(.15,1-P.sk/120)-(a>=31?ri(1,4):a>=28?ri(0,1):0);
  if(P.inj>0){P.inj--;g=-ri(2,6);L(`Je seizoen valt grotendeels in het water door je blessure.`,'bad')}
  P.sk=clamp(Math.round(P.sk+g*(S.talent==='sport'?1.5:1)));
  const need={club:30,school:40,academie:52,uni:58,pro:62+(P.lvl||0)*9}[P.st]||30;
  const perf=clamp(Math.round(50+(P.sk-need)*1.6+ri(-14,14)+tr*2+(P.big||0)*5+(P.boost||0)));P.big=0;P.boost=0;
  const num=Math.max(0,Math.round(D.stat[1]*perf/70*(.7+R()*.6)));
  const lvlF=P.st==='pro'?(P.lvl+2):P.st==='uni'?1.2:P.st==='academie'?.8:.3;
  S.fame=Math.round(clamp(S.fame+pop/100*perf/25*lvlF));if(P.st==='pro'&&S.job)S.job.perf=perf;
  P.seasons.push({a,st:P.st,team:P.team,perf,num});if(P.seasons.length>40)P.seasons.shift();P.best=Math.max(P.best||0,perf);P.yrs++;
  L(`${D.em} Seizoen bij ${P.team}: ${num} ${D.stat[0]}. ${perf>=80?'Je was de grote uitblinker.':perf>=60?'Een sterk seizoen.':perf>=40?'Een degelijk seizoen.':'Een teleurstellend seizoen.'}`,perf>=60?'good':perf<40?'bad':'');
  if(!P.inj&&chance(P.st==='pro'?.1:.05))Q.push({id:'sp_injury',c:{w:pick(['een gescheurde kruisband','een gebroken enkel','een hamstringblessure','een hernia','een ontwrichte schouder'])}});
  if(['club','school'].includes(P.st)&&a>=11&&a<=16&&!P.acadAsk&&P.sk>=52&&pop>=45&&chance(.25+pop/400)){P.acadAsk=1;Q.push({id:'sp_academy',c:{club:proClub(P.id,S.p.country)}})}
  if(['club','school','academie'].includes(P.st)&&a>=17&&a<=19&&!P.nextAsk&&P.sk>=45&&(S.edu.stage==='klaar'||a>=18)){P.nextAsk=1;Q.push({id:'sp_next',c:{us:P.sk>=56||(P.st==='school'&&perf>=70),loc:true,pro:(P.st==='academie'&&P.sk>=64)||P.sk>=74}})}
  if(P.st==='uni'&&P.sk>=60&&perf>=55&&!P.draftAsk&&(P.yrs>=2||a>=21)){P.draftAsk=1;Q.push({id:'sp_draft',c:offerFor(P.sk>=80?1:0)})}
  if(P.st==='club'&&a>=18&&a<=27&&P.sk>=60&&!P.trialAsk&&chance(.3)){P.trialAsk=1;Q.push({id:'sp_draft',c:offerFor(0)})}
  if(P.st==='pro'){if(perf>=75&&P.lvl<3&&chance(.35+(perf-75)/60))Q.push({id:'sp_offer',c:offerFor(P.lvl+1)});
    else if(perf<30&&chance(.5)){if(P.lvl>0){P.lvl--;S.job.lvl=P.lvl;S.job.mult=sportSalaryK(P.lvl,P.id,S.p.country);P.team=proClub(P.id,S.p.country);L(`Je wordt verkocht aan ${P.team}, een stap terug.`,'bad')}else Q.push({id:'sp_cut'})}
    if(a>=D.car[1]+(P.sk>80?2:0)&&!P.retAsk){P.retAsk=1;Q.push({id:'sp_retire'})}}}
const offerTxt=c=>`${c.team} (${COUNTRIES[c.cn].n}) biedt je een ${['semi-prof','prof','top','wereldtop'][c.lvl]}contract van ${fmt(c.k*1000*(S.cpi||1))} per jaar.${c.cn!==S.p.country?' Je moet er wel voor verhuizen.':''}`;
function chooseStudy(us){const opts_=[['bedrijfskunde','wo'],['communicatie','wo'],['psychologie','wo'],['economie','wo'],['informatica','wo'],['sport','hbo']];
  modal({title:us?'Sportbeurs in de VS':'Studeren en sporten',em:'🎓',cat:SPORTS[S.sport.id].n,text:us?'De universiteit betaalt je hele studie. Wat ga je studeren?':'Welke studie kies je? Je speelt dan in het universiteitsteam.',choices:opts_.map(([f,ty])=>({t:STUDIES.find(x=>x.id===f).t,on:()=>{closeModal();const P=S.sport;if(!S.edu.cur)enroll(ty,f,us?'beurs':'lening');P.st='uni';P.yrs=0;P.team=us?`${pick(US_UNIS)} (VS)`:`Universiteitsteam ${S.p.city}`;
    if(us){L(`Je vertrekt met een volledige sportbeurs naar ${P.team}.`,'good big');MS(`Kreeg een sportbeurs bij ${P.team}`,3);hap(12)}else L(`Je speelt nu voor het ${P.team}.`,'good');processQ()}}))})}
E('sp_academy',{sys:1,need:()=>!!S.sport,t:'Scout van een profclub',x:c=>`Een scout van ${c.club} heeft je zien spelen. Ze willen je in hun jeugdopleiding.`,ch:[
 ['Ja, naar de jeugdopleiding',c=>{const P=S.sport;P.st='academie';P.team=`Jeugd ${c.club}`;S.edu.perf=clamp(S.edu.perf-5);hap(10);MS(`Kwam in de jeugdopleiding van ${c.club}`,2);return 'Je traint nu vier keer per week bij een profclub. School wordt wel zwaarder.'}],
 ['Nee, school gaat voor',()=>{S.edu.perf=clamp(S.edu.perf+3);return 'Je blijft bij je eigen club.'}]]});
E('sp_next',{sys:1,need:()=>!!S.sport,t:'Wat nu met je sport?',x:c=>`Je school zit erop. ${S.sport.sk>=70?`Je bent een groot talent in het ${SPORTS[S.sport.id].n.toLowerCase()}.`:`Je bent een ${S.sport.sk>=55?'goede':'redelijke'} ${SPORTS[S.sport.id].nn}.`} Hoe ga je verder?`,ch:[
 ['🎓 Sportbeurs in de VS aannemen',c=>({go:()=>chooseStudy(true)}),c=>c.us],
 ['🏫 Hier studeren en in het universiteitsteam spelen',c=>({go:()=>chooseStudy(false)}),c=>c.loc],
 ['✍️ Meteen prof worden',c=>{const o=offerFor(0);signPro(0,o.cn,o.team,o.k);return `Je tekent een contract bij ${o.team}.`},c=>c.pro],
 ['⚽ Gewoon als amateur doorgaan',()=>{S.sport.st='club';return 'Je blijft lekker bij je club spelen.'}],
 ['🛑 Stoppen met de sport',()=>{retireSport();return 'Je hangt je schoenen aan de wilgen.'}]]});
const proCh=[['✍️ Tekenen',c=>{signPro(c.lvl,c.cn,c.team,c.k);return `Welkom bij ${c.team}!`}],
 ['💬 Onderhandelen',c=>{if(chance(.4+S.sk.sociaal/300)){const k=Math.round(c.k*1.25);signPro(c.lvl,c.cn,c.team,k);return `Ze gaan akkoord met 25% meer: ${fmt(k*1000*(S.cpi||1))} per jaar.`}return 'Ze trekken het bod in.'}],
 ['❌ Afslaan',()=>'Je slaat het aanbod af.']];
E('sp_draft',{sys:1,t:'Profclubs melden zich',x:c=>offerTxt(c),ch:proCh});
E('sp_offer',{sys:1,t:'Transferbod',x:c=>`Je seizoen valt op. ${offerTxt(c)}`,ch:proCh});
E('sp_cut',{sys:1,need:()=>!!S.sport,t:'Contract niet verlengd',x:()=>`${S.sport.team} verlengt je contract niet.`,ch:[
 ['Een nieuwe club zoeken',()=>{if(chance(S.sport.sk/110)){const o=offerFor(0);signPro(0,o.cn,o.team,o.k);return `${o.team} geeft je een nieuwe kans.`}retireSport();return 'Niemand wil je meer hebben. Je carrière is voorbij.'}],
 ['Stoppen',()=>{retireSport();return 'Je zet er een punt achter.'}]]});
E('sp_retire',{sys:1,need:()=>!!S.sport,t:'Afscheid?',x:()=>`Je lichaam begint te protesteren. Wordt dit je laatste seizoen als ${sportTitle().toLowerCase()}?`,ch:[
 ['Afscheid nemen',()=>{retireSport();return 'Een staande ovatie bij je laatste wedstrijd.'}],
 ['Nog één seizoen',()=>{S.sport.retAsk=0;S.sport.sk=clamp(S.sport.sk-4);return 'Je gaat nog één jaar door.'}]]});
E('sp_injury',{sys:1,need:()=>!!S.sport,t:'Blessure!',x:c=>`Je raakt zwaar geblesseerd: ${c.w}.`,ch:[
 ['Rustig revalideren',()=>{S.sport.inj=1;S.sport.sk=clamp(S.sport.sk-ri(2,6));hea(-5);return 'Je mist een groot deel van het seizoen, maar herstelt goed.'}],
 ['Zo snel mogelijk terug',()=>{if(chance(.4)){S.sport.inj=2;S.sport.sk=clamp(S.sport.sk-ri(8,15));hea(-10);return 'Je komt te vroeg terug en raakt opnieuw geblesseerd. Dat kost je bijna twee seizoenen.'}S.sport.sk=clamp(S.sport.sk-ri(1,3));return 'Je bent verrassend snel terug.'}],
 ['Topspecialist inschakelen',()=>{cash(-25000);S.sport.inj=0;S.sport.sk=clamp(S.sport.sk-ri(0,2));return `Een topspecialist kost ${fmt(25000)}, maar je bent snel terug.`},()=>S.money>=25000]]});

function sheetSport(el){const a=ageY(),P=S.sport;
  if(!P||P.st==='gestopt'){if(P)card(el,`<h3>${SPORTS[P.id].em} Gestopt met ${SPORTS[P.id].n.toLowerCase()}</h3><span class="muted">${P.yrs} seizoenen · beste seizoen ${P.best}%</span>`);
    const s=sec(el,`Kies een sport · populariteit in ${C().n}`);const ids=Object.keys(SPORTS).sort((x,y)=>sportPop(y)-sportPop(x));
    for(const id of ids){const D=SPORTS[id],pp=sportPop(id);row(s,{ic:D.em,t:D.n,s:`${popStars(pp)} · ${pp>=70?'enorm populair hier':pp>=40?'redelijk populair':'weinig aandacht hier'} · prof tot ${fmt(sportSalaryK(3,id,S.p.country)*1000)}`,dis:a<5,dots:true,on:()=>modal({title:D.n,em:D.em,cat:'Sport',text:`Lid worden van een ${D.c} in ${S.p.city}? Contributie: ${fmt(250)} per jaar.${P&&P.st==='gestopt'?' Je begint niet helemaal opnieuw: je algemene sportiviteit telt mee.':''}`,choices:opts([{t:'Lid worden',cls:'go',on:()=>{closeModal();doAct('Nieuwe sport',()=>{if(a>=18)cash(-250);joinSport(id);return `Je traint voortaan bij ${S.sport.team}.`},true,D.em)}}])})})}return}
  const D=SPORTS[P.id],pp=sportPop(P.id);const last=P.seasons[P.seasons.length-1];
  card(el,`<h3>${D.em} ${D.n} · ${he(stageLabel())}</h3><span class="muted">${he(P.team)} · populariteit in ${C().n} ${popStars(pp)}${P.inj?' · geblesseerd':''}</span><div class="stat"><span>Niveau</span><span></span><span class="v">${P.sk}%</span>${bar(P.sk,'var(--brand)')}</div>${last?kv([['Vorig seizoen',`${last.num} ${D.stat[0]}`],['Prestatie',`${last.perf}%`],['Seizoenen',P.yrs]]):'<span class="muted">Je eerste seizoen moet nog beginnen.</span>'}`);
  if(banned())card(el,`<span style="color:var(--bad);font-weight:700">💉 Geschorst voor doping · nog ${Math.ceil((P.ban-S.m)/12)} jaar</span>`);
  circRow(el,'sport');
  let s=sec(el,'Training en wedstrijden');
  row(s,{ic:'🏋️',t:'Extra trainen',s:'Minigame · hoe meer je traint, hoe beter je wordt',dots:true,on:()=>mgTap('Training','Tik zo snel als je kunt. Elke tik is een herhaling.',(sc,n)=>doAct('Training',()=>{use('train');const gain=Math.max(sc>.3?1:0,Math.round((sc*2+(a<22?.6:0))*Math.max(.2,1-P.sk/120)));P.sk=clamp(P.sk+gain);hea(1);sk('sport',2);return `${n} herhalingen. Je niveau stijgt met ${gain}.`},true,'🏋️'))});
  row(s,{ic:'🏟️',t:'Belangrijke wedstrijd',s:S.acts.big?'Al gespeeld dit jaar':'Minigame · scouts kijken mee',dis:!!S.acts.big||!!P.inj||banned(),dots:true,on:()=>mgTiming('Wedstrijd','Stop de balk in het groene vak op de beslissende momenten.',3,h=>doAct('Wedstrijd',()=>{S.acts.big=1;P.big=h;S.fame=Math.round(clamp(S.fame+pp/100*h*2));if(h===3){P.sk=clamp(P.sk+2);hap(8);return D.win}if(h===2){hap(3);return 'Je speelt een goede wedstrijd.'}hap(-1);return 'Niet jouw dag. Je hoort gefluit van de tribune.'},true,D.em))});
  if(P.st==='club'&&S.edu.stage==='middel')row(s,{ic:'🎯',t:'Proberen voor het schoolteam',s:'Minigame · laat zien wat je kunt',dis:!!S.acts.tryout,dots:true,on:()=>mgTiming('Selectie schoolteam','De coach kijkt mee. Timing is alles.',3,h=>doAct('Schoolteam',()=>{S.acts.tryout=1;if(h+P.sk/30>=3){P.st='school';P.team=`Schoolteam ${S.p.city}`;hap(8);MS(`Kwam in het schoolteam (${D.n.toLowerCase()})`,1);return 'Je bent geselecteerd voor het schoolteam!'}hap(-2);return 'Net niet. Volgend jaar beter.'},true,'🎯'))});
  if(S.edu.cur&&['hbo','wo','master'].includes(S.edu.cur.ty)&&!['uni','pro'].includes(P.st))row(s,{ic:'🏫',t:'Aanmelden bij het universiteitsteam',s:'Minigame',dis:!!S.acts.tryout,dots:true,on:()=>mgTiming('Selectie universiteitsteam','Laat de coach zien wat je kunt.',3,h=>doAct('Universiteitsteam',()=>{S.acts.tryout=1;if(h+P.sk/30>=3.5){P.st='uni';P.yrs=0;P.team=`Universiteitsteam ${S.p.city}`;hap(8);return 'Je zit in het universiteitsteam!'}return 'Je wordt niet geselecteerd.'},true,'🏫'))});
  if(a>=18&&a<=30&&['club','uni'].includes(P.st))row(s,{ic:'📝',t:'Proefspelen bij een profclub',s:P.sk<55?'Je niveau is nog te laag':'Minigame · grote kans, grote druk',dis:P.sk<55||!!S.acts.trial||banned(),dots:true,on:()=>mgTiming('Proefspelen','Vier momenten om te overtuigen.',4,h=>doAct('Proefspelen',()=>{S.acts.trial=1;if(h+P.sk/25>=5.2){const o=offerFor(0);afterModal=()=>{Q.push({id:'sp_draft',c:o});processQ()};return 'Ze zijn onder de indruk!'}hap(-2);return 'Bedankt voor je komst, maar het is niet genoeg.'},true,'📝'))});
  if(P.st==='pro'){const p2=sec(el,'Profcarrière');row(p2,{ic:'💰',t:'Contract openbreken',s:S.acts.ctr?'Al geprobeerd dit jaar':'Vraag meer salaris',dis:!!S.acts.ctr,dots:true,on:()=>doAct('Contract',()=>{S.acts.ctr=1;const last=P.seasons[P.seasons.length-1];if(last&&last.perf>=65&&chance(.6)){S.job.mult=Math.round(S.job.mult*1.2);return `De club gaat akkoord: ${fmt(salary())} per jaar.`}return 'De club weigert. Eerst presteren.'},true,'💰')});
    row(p2,{ic:'🌍',t:'Transfer aanvragen',s:`Grootste markt: ${COUNTRIES[bestCountry(P.id)].n}`,dis:!!S.acts.tr,dots:true,on:()=>{S.acts.tr=1;const last=P.seasons[P.seasons.length-1];if(last&&last.perf>=55&&chance(.55)){closeSheet();Q.push({id:'sp_offer',c:offerFor(Math.min(3,P.lvl+(last.perf>=75?1:0)))});processQ()}else toast('Geen enkele club meldt zich')}})}
  if(a>=15){const d=sec(el,'Riskant');row(d,{ic:'💉',t:'Doping gebruiken',s:banned()?`Geschorst: nog ${Math.ceil((P.ban-S.m)/12)} jaar`:S.acts.dope?'Dit jaar al gedaan':inBlood()?`Nog ${Math.max(1,Math.ceil((48-(S.m-P.dopeM))/12))} jaar aantoonbaar in je bloed`:'Beter presteren, maar 4 jaar aantoonbaar',dis:banned()||!!S.acts.dope,dots:true,on:dopeMenu})}
  const o=sec(el,'Overig');
  if(P.st!=='pro')row(o,{ic:'🔄',t:'Andere sport kiezen',dots:true,on:()=>ask('Andere sport?','Je stopt met je huidige sport en kiest een nieuwe.','Wisselen',()=>{P.st='gestopt';refreshSheet()},'go','🔄')});
  row(o,{ic:'🛑',t:P.st==='pro'?'Carrière beëindigen':'Stoppen met sporten',dots:true,on:()=>ask('Stoppen?','Je stopt met je sport.','Stoppen',()=>{retireSport();refreshSheet();render();saveLife()})});
  if(P.seasons.length){const h=sec(el,'Seizoenen');for(const x of P.seasons.slice().reverse().slice(0,12))row(h,{ic:D.em,t:`${x.a} jaar · ${x.team}`,s:`${x.num} ${D.stat[0]} · prestatie ${x.perf}%`})}
}

/* ================= SCHOOL ================= */
const SUBJ={basis:['Rekenen','Taal','Wereldoriëntatie','Gym'],middel:['Wiskunde','Nederlands','Engels','Biologie','Geschiedenis','Gym']};
const SUBEM={Rekenen:'🔢',Wiskunde:'📐',Taal:'✏️',Nederlands:'📖',Engels:'🇬🇧',Wereldoriëntatie:'🌍',Biologie:'🧬',Geschiedenis:'🏰',Gym:'🤸'};
const QB={
Taal:[['Welke zin is goed gespeld?',['Hij wordt groot.','Hij word groot.','Hij wort groot.','Hij wordt grood.']],['Wat is het meervoud van "kind"?',['kinderen','kinds','kinden','kinderens']],['Welk woord is een werkwoord?',['lopen','tafel','groen','snel']],['Wat is het tegenovergestelde van "warm"?',['koud','heet','lauw','zacht']],['Welke zin heeft de juiste hoofdletters?',['Ik woon in Utrecht.','ik woon in Utrecht.','Ik woon in utrecht.','ik woon in utrecht.']],['Wat is een synoniem van "blij"?',['vrolijk','boos','moe','stil']],['Welk woord is een bijvoeglijk naamwoord?',['mooi','fiets','zingen','onder']]],
Wereldoriëntatie:[['Wat is de hoofdstad van Nederland?',['Amsterdam','Den Haag','Rotterdam','Utrecht']],['Hoeveel provincies heeft Nederland?',['12','10','11','14']],['Welk dier is een zoogdier?',['Walvis','Haai','Pinguïn','Krokodil']],['Welke planeet staat het dichtst bij de zon?',['Mercurius','Venus','Mars','Aarde']],['Wie schilderde De Nachtwacht?',['Rembrandt','Van Gogh','Vermeer','Mondriaan']],['Welke rivier stroomt door Rotterdam?',['De Maas','De Rijn','De Schelde','De IJssel']],['Wat is het grootste continent?',['Azië','Afrika','Europa','Amerika']]],
Nederlands:[['Welke zin is goed?',['Ik vind het leuker dan jij.','Ik vind het leuker als jij.','Ik vind het leuk dan jij.','Ik vind het leuker als dat jij.']],['"Hij ... gisteren naar huis." Welke vorm?',['fietste','fietsten','fietsde','fietstte']],['Wat is een metafoor?',['Beeldspraak zonder het woord "als"','Een overdrijving','Een tegenstelling','Een herhaling']],['Wie schreef "Max Havelaar"?',['Multatuli','Vondel','Hella Haasse','Harry Mulisch']],['Wat is het onderwerp in "De hond blaft hard"?',['De hond','blaft','hard','De']],['Welke vorm is goed?',['Wordt je morgen opgehaald?','Word je morgen opgehaald?','Wort je morgen opgehaald?','Worde je morgen opgehaald?']]],
Engels:[['Vertaal: "verjaardag"',['birthday','anniversary','birthtime','yearday']],['Welke zin is goed?',['She doesn\'t like coffee.','She don\'t like coffee.','She not likes coffee.','She doesn\'t likes coffee.']],['Vertaal: "eventually"',['uiteindelijk','eventueel','misschien','gebeurtenis']],['Verleden tijd van "to go"?',['went','goed','gone','goes']],['Vertaal: "actually"',['eigenlijk','actueel','nu','actief']],['Welke zin is goed?',['I have lived here for five years.','I live here since five years.','I am living here since five years.','I lived here since five years.']]],
Biologie:[['Waar vindt fotosynthese plaats?',['In de bladgroenkorrels','In de wortels','In de mitochondriën','In de celkern']],['Hoeveel chromosomen heeft een menselijke lichaamscel?',['46','23','44','48']],['Welk orgaan zuivert het bloed?',['De nieren','De longen','De maag','Het hart']],['Wat is DNA?',['Erfelijk materiaal','Een eiwit','Een hormoon','Een vitamine']],['Welke bloedcellen bestrijden ziekteverwekkers?',['Witte bloedcellen','Rode bloedcellen','Bloedplaatjes','Plasma']],['Wat geven planten overdag vooral af?',['Zuurstof','Koolstofdioxide','Stikstof','Waterstof']]],
Geschiedenis:[['In welk jaar eindigde de Tweede Wereldoorlog?',['1945','1940','1918','1950']],['Wie was Willem van Oranje?',['Leider van de Opstand tegen Spanje','De eerste koning van Nederland','Een ontdekkingsreiziger','Een schilder']],['Wat was de VOC?',['Een handelscompagnie','Een politieke partij','Een leger','Een kerk']],['In welk jaar viel de Berlijnse Muur?',['1989','1961','1991','1979']],['Welke periode komt het eerst?',['Middeleeuwen','Renaissance','Verlichting','Industriële Revolutie']],['Wie zette als eerste voet op de maan?',['Neil Armstrong','Buzz Aldrin','Joeri Gagarin','John Glenn']]]};
const nl1=v=>(+v).toLocaleString('nl-NL',{minimumFractionDigits:1,maximumFractionDigits:1});
const clampG=v=>Math.max(1,Math.min(10,Math.round(v*10)/10));
const gradeAvg=()=>{const v=Object.values(S.edu.gr||{});return v.length?v.reduce((x,y)=>x+y,0)/v.length:6};
const gradesPerf=()=>clamp(Math.round((gradeAvg()-1)/9*100));
function mgQuiz(title,qs,cb,free){if(!free){if(!spendE(1))return;PREPAID=1}let i=0,ok=0,left=0,tk=0;
  const step=()=>{clearInterval(tk);if(i>=qs.length){closeModal();cb(ok/qs.length);return}const [q,ans]=qs[i];const right=ans[0];left=12;
    modal({title,em:'📝',cat:`Vraag ${i+1} van ${qs.length}`,text:q,html:'<div class="timer"><i id="qt" style="width:100%;transition:width 1s linear"></i></div>',choices:ans.slice().sort(()=>R()-.5).map(a=>({t:a,on:()=>{if(a===right){ok++;toast('Goed!')}else toast(`Fout, het was: ${right}`);i++;step()}}))});
    tk=setInterval(()=>{if(!$('#qt')){clearInterval(tk);return}left--;const t=$('#qt');if(t)t.style.width=(left/12*100)+'%';if(left<=0){toast(`Te laat! Het was: ${right}`);i++;step()}},1000)};step()}
const pickQs=(sub,n)=>(QB[sub]||[]).slice().sort(()=>R()-.5).slice(0,n);
E('eindexamen',{sys:1,t:'Eindexamens',x:c=>`Het is examentijd voor je ${c.l}-diploma. Je staat gemiddeld een ${nl1(gradeAvg())}.`,ch:[
 ['📝 Examens maken',c=>({go:()=>finalExam(c.l)})],
 ['🕵️ Een spiekbriefje meenemen',c=>{if(chance(.35)){const E=S.edu;E.exF=(E.exF||0)+1;hap(-15);kar(-5);if(E.exF>=3||ageY()>=21){E.stage='klaar';MS('Verliet school zonder diploma',1);return 'Betrapt! Je examen wordt ongeldig verklaard. Je verlaat school zonder diploma.'}E.yrs=E.len-1;return 'Betrapt! Je examen wordt ongeldig verklaard. Je moet het jaar overdoen.'}kar(-3);return{go:()=>finalExam(c.l,1.25)}}]]});

/* ================= WERK ================= */
const JGROUP={zorg:['verpleeg','arts','psycholoog'],horeca:['kok','bedien','afwas','hotel'],tech:['dev','ingenieur','elektro','monteur','designer','architect'],kantoor:['sales','marketing','accountant','hr','consultant','bankier','call','makelaar','journalist','advocaat','rechter'],onderwijs:['leraar','wetensch','oppas'],fame:['muzikant','acteur','model','schrijver'],politiek:['politiek']};
const jobGroup=id=>Object.keys(JGROUP).find(g=>JGROUP[g].includes(id))||'handwerk';
const WORKQ=[
 ['Je baas mailt om 17:55 met een "spoedklus".',[['Even bellen om te vragen wat echt vandaag moet',2],['Tot 23:00 doorwerken',1],['De mail negeren tot morgen',0]]],
 ['Een collega neemt de eer voor jouw idee.',[['Het rustig rechtzetten in het volgende overleg',2],['Er niks van zeggen',1],['Hem publiekelijk uitschelden',0]]],
 ['Je maakt een fout die nog niemand heeft gezien.',[['Meteen melden en een oplossing voorstellen',2],['Stilletjes zelf herstellen',1],['De schuld bij een stagiair leggen',0]]],
 ['Er begint een nieuwe collega.',[['Een middag helpen met inwerken',2],['Een handleiding doorsturen',1],['Laten zwemmen',0]]],
 ['Je hebt drie deadlines op dezelfde dag.',[['Prioriteren en er één in overleg verschuiven',2],['Alles half afmaken',1],['Je ziek melden',0]]],
 ['In de vergadering vraagt je baas om ideeën.',[['Een goed voorbereid voorstel doen',2],['Instemmen met de rest',1],['Stiekem op je telefoon zitten',0]]],
 ['Een collega zit duidelijk niet lekker in zijn vel.',[['Vragen of hij even koffie wil drinken',2],['Het aan HR doorgeven',1],['Er grappen over maken',0]]]];
const WORKG={
 zorg:[['Twee patiënten bellen tegelijk.',[['Eerst de ernstigste helpen',2],['Wie het eerst belde',1],['Even pauze nemen',0]]],['Een voorgeschreven dosis lijkt je vreemd.',[['Navragen bij de arts',2],['Een collega laten beslissen',1],['Gewoon geven',0]]]],
 horeca:[['Het is druk en een gerecht gaat terug.',[['Excuses en snel een nieuw bord',2],['Een gratis drankje aanbieden',1],['Uitleggen dat het zo hoort',0]]],['Een gast klaagt luid over de wachttijd.',[['Rustig blijven en iets extra\'s aanbieden',2],['Sorry zeggen',1],['Terug snauwen',0]]]],
 tech:[['Alles ligt plat, vrijdag om 16:00.',[['Rustig de logs bekijken en terugdraaien',2],['Het tot maandag laten liggen',1],['Snel live iets aanpassen',0]]],['Het werk van een collega zit vol fouten.',[['Vriendelijke feedback met tips',2],['Stiekem zelf herschrijven',1],['Afkraken in de groepschat',0]]]],
 kantoor:[['Een klant wil 20% korting.',[['Waarde benadrukken en een klein extraatje bieden',2],['Meteen 20% geven',1],['Weigeren en ophangen',0]]],['Je cijfers kloppen niet, vlak voor de deadline.',[['Uitzoeken en eerlijk melden dat het later wordt',2],['Een collega om hulp vragen',1],['Insturen en hopen',0]]]],
 onderwijs:[['Een leerling verstoort de les.',[['Na de les een gesprek',2],['Uit de klas sturen',1],['Terugschreeuwen',0]]],['Ouders zijn boos over een cijfer.',[['Uitleggen hoe het cijfer tot stand kwam',2],['Doorsturen naar de leiding',1],['Het cijfer maar aanpassen',0]]]],
 handwerk:[['Je ziet een onveilige situatie.',[['Meteen stilleggen en melden',2],['Zelf voorzichtig doorgaan',1],['Negeren',0]]],['Je collega is te laat en jij doet zijn werk.',[['Hem later rustig aanspreken',2],['Gewoon doen',1],['Bij de baas klikken',0]]]],
 fame:[['Een journalist stelt een gemene vraag.',[['Met humor pareren',2],['"Geen commentaar"',1],['Boos weglopen',0]]],['Een fan wil een selfie terwijl je eet.',[['Vriendelijk na het eten',2],['Snel een foto',1],['Wegsturen',0]]]],
 politiek:[['Een journalist duikt in een oude tweet van je.',[['Excuses en uitleggen wat je nu vindt',2],['Ontkennen',0],['Een woordvoerder laten reageren',1]]],['Je partij wil dat je tegen je eigen plan stemt.',[['In gesprek gaan en een compromis zoeken',2],['Tegenstemmen',1],['Uit protest de zaal verlaten',0]]]]};
const SIG={zorg:['🩺','Extra dienst draaien','Meer geld, maar zwaar'],horeca:['🍳','Iets nieuws bedenken','Een nieuw gerecht of idee voor de gasten'],tech:['🐞','Een lastig probleem oplossen','Een minigame van je brein'],kantoor:['📞','Klanten bellen','Kans op een bonus'],onderwijs:['📝','Lessen goed voorbereiden','Betere lessen, tevreden leiding'],handwerk:['🧰','Overuren maken','Extra geld'],fame:['🎤','Jezelf in de kijker spelen','Meer bekendheid'],politiek:['🗳️','Campagne voeren','De kiezers overtuigen']};
function mgWork(cb){if(!spendE(1))return;PREPAID=1;const pool=WORKQ.concat(WORKG[jobGroup(S.job.id)]||[]).sort(()=>R()-.5).slice(0,4);let i=0,pts=0;
  const step=()=>{if(i>=pool.length){closeModal();cb(pts/(pool.length*2));return}const [q,ans]=pool[i];modal({title:'Werkdag',em:jobEm(S.job.id),cat:`Situatie ${i+1} van ${pool.length}`,text:q,choices:ans.slice().sort(()=>R()-.5).map(([a,p])=>({t:a,on:()=>{pts+=p;i++;toast(p===2?'Sterk!':p===1?'Kan beter':'Oei');step()}}))})};step()}
function workDay(){mgWork(sc=>doAct('Werkdag',()=>{const m_=use('werk');let d=Math.round((sc-.5)*18);if(d>0)d=Math.round(d*m_);(S.job&&(S.job.perf=clamp(S.job.perf+d)));hap(sc>=.75?2:sc<.4?-2:0);return sc>=.75?`Je hebt alles goed opgelost. Je baas is onder de indruk (prestaties +${d}).`:sc>=.5?`Een prima werkdag (prestaties ${d>=0?'+':''}${d}).`:`Een rommelige dag. Je baas heeft het gemerkt (prestaties ${d}).`},true,jobEm(S.job.id)))}
function sigAction(){const g=jobGroup(S.job.id),[e,t]=SIG[g];
  if(g==='tech')return mgMemory(t,'Onthoud de stappen van de oplossing.',5,ok=>doAct(t,()=>{use('werk');if(ok){(S.job&&(S.job.perf=clamp(S.job.perf+8)));sk('tech',3);return 'Opgelost! Het hele team is je dankbaar.'}(S.job&&(S.job.perf=clamp(S.job.perf-2)));return 'Je komt er niet uit. Een collega lost het uiteindelijk op.'},true,e));
  doAct(t,()=>{const m=use('sig');
    if(g==='zorg'||g==='handwerk'){const k=Math.round(salary()/40*m);cash(k);(S.job&&(S.job.perf=clamp(S.job.perf+3*m)));return `Je draait extra uren en verdient ${fmt(k)} bij.`}
    if(g==='horeca'){const sc=(S.sk.koken+S.sk.sociaal)/2;if(chance(.3+sc/150)){(S.job&&(S.job.perf=clamp(S.job.perf+7*m)));sk('koken',2);return 'Je idee slaat aan. De gasten zijn er lyrisch over.'}(S.job&&(S.job.perf=clamp(S.job.perf-2)));return 'Je idee valt helemaal verkeerd.'}
    if(g==='kantoor'){if(chance(.25+S.sk.sociaal/200)){const k=Math.round(salary()*ri(2,6)/100*m);cash(k);(S.job&&(S.job.perf=clamp(S.job.perf+5*m)));sk('sociaal',2);return `Je sluit een grote deal. Bonus: ${fmt(k)}.`}return 'Niemand neemt op. Volgende keer beter.'}
    if(g==='onderwijs'){(S.job&&(S.job.perf=clamp(S.job.perf+5*m)));return 'Je lessen lopen gesmeerd.'}
    if(g==='fame'){S.fame=Math.round(clamp(S.fame+ri(1,4)*m));S.foll+=ri(100,2000);return 'Je staat weer even in de schijnwerpers.'}
    if(g==='politiek'){(S.job&&(S.job.perf=clamp(S.job.perf+5*m)));S.fame=Math.round(clamp(S.fame+1));return 'Je flyert, debatteert en schudt duizend handen.'}
    return 'Je werkt hard.'},true,e)}
E('w_review',{sys:1,need:()=>!!S.job,t:'Functioneringsgesprek',x:()=>`Je jaarlijkse gesprek met je leidinggevende. Je prestaties staan op ${Math.round(S.job.perf)}%.`,ch:[
 ['💶 Om opslag vragen',()=>{if(chance(S.job.perf/120)){const p=ri(3,9);S.job.mult*=1+p/100;hap(4);return `Je krijgt ${p}% opslag.`}(S.job&&(S.job.perf=clamp(S.job.perf-3)));return pickF('opsl',['Je baas vindt dat je daar nog niet aan toe bent.','"Het budget is op dit jaar," zegt je baas.','Je baas wil eerst betere cijfers zien.','Je baas belooft er volgend jaar op terug te komen.'])}],
 ['📚 Om een cursus vragen',()=>{const j=JOB(S.job.id);if(j.sk)sk(j.sk,ri(4,8));(S.job&&(S.job.perf=clamp(S.job.perf+4)));return 'Je mag op cursus, op kosten van de baas.'}],
 ['📈 Om meer verantwoordelijkheid vragen',()=>{if(S.job.perf>=65){(S.job&&(S.job.perf=clamp(S.job.perf+6)));S.job.lyrs++;return 'Je krijgt een eigen project. Dat telt mee voor promotie.'}(S.job&&(S.job.perf=clamp(S.job.perf-2)));return pickF('verant',['Eerst je huidige werk op orde.','Je baas wil eerst zien dat je je eigen taken onder controle hebt.','"Misschien volgend jaar," zegt je leidinggevende.'])}],
 ['🕐 Om minder uren vragen',()=>{S.job.mult*=.85;hap(6);(S.job&&(S.job.perf=clamp(S.job.perf-3)));return 'Je gaat vier dagen werken. Minder geld, meer leven.'}],
 ['🤐 Niks vragen',()=>'Een kort en gezellig gesprek.']]});
E('w_conflict',{a:[18,70],need:()=>!!S.job,c:()=>S.job&&!S.job.part&&S.job.id!=='prosport',t:'Conflict op werk',ctx:()=>({n:rname()}),x:c=>`Je collega ${c.n} zit je al weken dwars en praat achter je rug.`,ch:[
 ['Het uitpraten',c=>{if(chance(.5+S.sk.sociaal/200)){(S.job&&(S.job.perf=clamp(S.job.perf+3)));return `Het blijkt een misverstand. ${c.n} en jij kunnen weer door één deur.`}hap(-1);return 'Het gesprek loopt uit op een ruzie.'}],
 ['Naar je leidinggevende',()=>{(S.job&&(S.job.perf=clamp(S.job.perf-2)));return 'Je baas gaat ermee aan de slag, maar de sfeer is verpest.'}],
 ['Negeren en hard werken',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+2)));return 'Je laat je werk spreken.'}]]});
E('w_ziek',{a:[18,67],need:()=>!!S.job,c:()=>S.job&&!S.job.part&&S.job.id!=='prosport',t:'Iedereen ziek',x:'De halve afdeling ligt met griep op bed. Je baas vraagt of jij de gaten wilt vullen.',ch:[
 ['Ja, ik val in',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+7)));return 'Twee weken van 60 uur. Je baas zal het niet vergeten.'}],
 ['Een paar extra uurtjes',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+3)));return 'Je doet wat redelijk is.'}],
 ['Nee, ik heb al genoeg',()=>{(S.job&&(S.job.perf=clamp(S.job.perf-4)));hap(2);return 'Je bewaakt je grenzen.'}]]});

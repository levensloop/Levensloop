/* ================= RELATIES: grote familie, liefde, opvoeden, stamboom ================= */
const BIGR={opa:'Grootouders',oma:'Grootouders',oom:'Ooms en tantes',tante:'Ooms en tantes',neef:'Neven en nichten',nicht:'Neven en nichten',neefje:'Neefjes en nichtjes',nichtje:'Neefjes en nichtjes',
  schoonmoeder:'Schoonfamilie',schoonvader:'Schoonfamilie',zwager:'Schoonfamilie',schoonzus:'Schoonfamilie',stiefvader:'Stieffamilie',stiefmoeder:'Stieffamilie',stiefbroer:'Stieffamilie',stiefzus:'Stieffamilie'};
const bigOn=()=>!!(S&&S.settings&&S.settings.bigFam);
const gRole=(g,m,v)=>g==='v'?v:m;
// grootouders, ooms, tantes en neven/nichten op basis van je ouders
function ensureBigFam(){if(!bigOn()||S.flags.bigGen)return;S.flags.bigGen=1;const me=S.m;
  const lifeEnd=()=>ri(68,96);
  for(const par of people(['moeder','vader'])){const side=par.role==='moeder'?'v':'m';
    for(const g of ['m','v']){const age=pAge(par)+ri(22,36);const born=S.m-age*12-ri(0,11);const end=lifeEnd();const p=mkPerson(gRole(g,'opa','oma'),g,born,{ap:apMix(apOf(par),null,g),last:g==='m'?par.last:pick(NAMES[C().r].l),rel:ri(55,88),side,money:ri(5,120)*1000*(S.cpi||1)});
      if(age>=end){p.alive=false;p.died=ageY()-(age-end)}S.rel.push(p)}
    for(let i=ri(0,3);i>0;i--){const g=pick(['m','v']);const born=par.born+ri(-10,10)*12;const u=mkPerson(gRole(g,'oom','tante'),g,born,{ap:apMix(apOf(par),null,g),last:g==='m'||chance(.5)?par.last:pick(NAMES[C().r].l),rel:ri(40,75),side});S.rel.push(u);
      for(let k=ri(0,3);k>0;k--){const g2=pick(['m','v']);S.rel.push(mkPerson(gRole(g2,'neef','nicht'),g2,me+ri(-8,10)*12+ri(0,11),{ap:apMix(apOf(u),null,g2),last:u.g==='m'?u.last:pick(NAMES[C().r].l),rel:ri(35,70),par:u.id}))}}}}
function famYear(a){if(!bigOn())return;ensureBigFam();
  // broers en zussen krijgen kinderen
  for(const s of living(['broer','zus'])){const sa=pAge(s);if(sa>=24&&sa<=42&&chance(.1)&&people(['neefje','nichtje']).filter(x=>x.par===s.id).length<3){const g=pick(['m','v']);const k=mkPerson(gRole(g,'neefje','nichtje'),g,S.m,{ap:apMix(apOf(s),null,g),last:s.g==='m'?s.last:pick(NAMES[C().r].l),rel:ri(50,80),par:s.id});S.rel.push(k);L(`Je ${relWord(s)} ${s.first} heeft een ${g==='v'?'dochter':'zoon'} gekregen: ${k.first}. Je bent ${S.p.g==='v'?'tante':'oom'}!`,'good');hap(3)}}
  // schoonfamilie zodra je getrouwd bent
  const pt=partner();if(pt&&pt.st==='getrouwd'&&!pt.inlaws){pt.inlaws=1;const pa=pAge(pt);for(const g of ['m','v']){const age=pa+ri(22,34);if(age>95)continue;S.rel.push(mkPerson(gRole(g,'schoonvader','schoonmoeder'),g,S.m-age*12,{ap:apMix(apOf(pt),null,g),last:g==='m'?pt.last:pick(NAMES[C().r].l),rel:ri(40,75),of:pt.id}))}
    for(let i=ri(0,2);i>0;i--){const g=pick(['m','v']);S.rel.push(mkPerson(gRole(g,'zwager','schoonzus'),g,pt.born+ri(-6,6)*12,{ap:apMix(apOf(pt),null,g),last:pt.last,rel:ri(40,70),of:pt.id}))}
    L(`Je hebt nu ook een schoonfamilie: de familie ${pt.last}.`,'sys')}
  // ouders gaan scheiden, later komt er een stiefouder bij
  const mom=living('moeder')[0],dad=living('vader')[0];
  if(mom&&dad&&a>=3&&a<=17&&!S.flags.oudersSch&&chance(.025)){S.flags.oudersSch=1;Q.push({id:'f_scheiding',c:{}})}
  if(S.flags.oudersSch&&!S.flags.stief&&chance(.3)){const par=pick([mom,dad].filter(Boolean));if(par){S.flags.stief=1;const g=par.role==='moeder'?'m':'v';const sp=mkPerson(gRole(g,'stiefvader','stiefmoeder'),g,par.born+ri(-6,6)*12,{rel:ri(30,60)});S.rel.push(sp);
    L(`Je ${relWord(par)} heeft een nieuwe partner: ${sp.first}. Je hebt nu een ${relWord(sp)}.`,'sys');for(let i=ri(0,2);i>0;i--){const g2=pick(['m','v']);S.rel.push(mkPerson(gRole(g2,'stiefbroer','stiefzus'),g2,S.m+ri(-6,6)*12,{last:sp.last,rel:ri(30,60)}))}}}}
function famOnDeath(p){if((p.role==='opa'||p.role==='oma')&&p.money>0&&chance(.55)){const k=Math.round(p.money*ri(10,35)/100);cash(k);L(`Je ${relWord(p)} heeft je ${fmt(k)} nagelaten.`,'good')}}
E('f_scheiding',{sys:1,t:'Je ouders gaan scheiden',x:()=>`${living('moeder')[0]?.first||'Je moeder'} en ${living('vader')[0]?.first||'je vader'} vertellen je aan de keukentafel dat ze uit elkaar gaan.`,ch:[
 ['🏠 Bij je moeder wonen',()=>{relAdj('moeder',8);relAdj('vader',-8);hap(-5);return 'Je verhuist met je moeder mee. Je vader zie je om het weekend.'}],
 ['🏠 Bij je vader wonen',()=>{relAdj('vader',8);relAdj('moeder',-8);hap(-5);return 'Je blijft bij je vader wonen. Je moeder zie je om het weekend.'}],
 ['🔁 Om en om',()=>{hap(-3);return 'Je woont de ene week hier, de andere week daar. Wennen.'}]]});
// ---- het relatiescherm (zelfde opbouw, uitgebreid) ----
function sheetRel(el){if(bigOn())ensureBigFam();
  const top=sec(el,'');row(top,{ic:'🌳',t:'Stamboom',s:`Generatie ${S.gen} · bekijk je hele familie`,on:()=>openSheet('Stamboom',sheetTree,true)});
  const groups=[['',['moeder','vader']],['Broers en zussen',['broer','zus']],['Kinderen',['kind']],['Kleinkinderen',['kleinkind']],['Vrienden',['vriend']],['Vijanden',['vijand']]];
  if(bigOn())groups.splice(2,0,['Grootouders',['opa','oma']],['Stieffamilie',['stiefvader','stiefmoeder','stiefbroer','stiefzus']],['Ooms en tantes',['oom','tante']],['Neven en nichten',['neef','nicht']],['Neefjes en nichtjes',['neefje','nichtje']],['Schoonfamilie',['schoonmoeder','schoonvader','zwager','schoonzus']]);
  for(const [n,r] of groups){const ps=living(r);if(!ps.length)continue;const s=sec(el,n);if(r[0]==='kind'&&ps.some(k=>pAge(k)<18))row(s,{ic:'🧸',t:'Opvoeding',s:`${PSTY[S.par?.style||'liefdevol'][0]} · zakgeld ${fmt((S.par?.pocket||0)*(S.cpi||1))} per week`,on:()=>openSheet('Opvoeding',sheetParenting,true)});for(const p of ps)personRow(s,p)}
  const love=sec(el,'Liefde');const pt=partner();if(pt)personRow(love,pt);
  for(const p of living('minnaar'))personRow(love,p);
  if(S.preg)row(love,{ic:'🤰',t:'Baby onderweg',s:`Uitgerekend over ${Math.max(0,S.preg.due-S.m)} maanden`});
  if(ageY()>=18&&!inJail())row(love,{ic:'💋',t:pt?'Vreemdgaan':'Een scharrel zoeken',s:pt?`Riskant: ${pt.first} kan erachter komen`:'Iets kort en vrijblijvends',dots:true,on:fling});
  const exes=people('ex');row(love,{ic:'💔',t:'Exen',s:exes.length?`${exes.length} ex${exes.length>1?'en':''}`:'Bekijk je exen',dis:!exes.length,on:()=>openSheet('Exen',el=>{const s=sec(el,'');for(const p of exes)personRow(s,p)},true)});
  const pets=living('huisdier');if(pets.length){const s=sec(el,'Huisdieren');for(const p of pets)personRow(s,p)}
  const dead=people().filter(p=>!p.alive&&!p.gone&&!['huisdier','vijand','minnaar'].includes(p.role)&&(p.role!=='ex'||p.lost)&&(p.died==null||p.died>=0)&&(bigOn()||!BIGR[p.role]));if(dead.length){const s=sec(el,'Overleden familie en vrienden');for(const p of dead)personRow(s,p)}
  const dpets=people('huisdier').filter(p=>!p.alive&&!p.gone);if(dpets.length){const s=sec(el,'Overleden huisdieren');for(const p of dpets)personRow(s,p)}
  foot(el,'🕰️','Tijd met iedereen...',()=>doAct('Tijd met iedereen',()=>{const ps=living().filter(p=>!['ex','vijand','minnaar'].includes(p.role)&&(bigOn()||!BIGR[p.role]));if(!ps.length)return 'Er is niemand om tijd mee door te brengen.';const m=use('allen');for(const p of ps)p.rel=clamp(p.rel+Math.round(ri(1,5)*m));hap(3);return `Je brengt tijd door met ${ps.length} ${ps.length===1?'persoon':'mensen'}. Iedereen waardeert het.`},true,'🕰️'),inJail())}
// ---- liefdesleven ----
function fling(){const pt=partner();const c=candidate();c.role='minnaar';c.affair=pt?1:0;
  modal({title:pt?'Vreemdgaan':'Een scharrel',em:'💋',cat:'Liefde',text:`${c.first} (${pAge(c)}) ziet het wel zitten.${pt?` Als ${pt.first} erachter komt, is het foute boel.`:''}`,choices:opts([
    {t:'Ervoor gaan',cls:'go',on:()=>{closeModal();doAct(pt?'Vreemdgaan':'Scharrel',()=>{use('fling');hap(4);if(!pt){if(chance(.25)){S.rel.push(c);c.rel=60;return `Het blijft niet bij één keer. ${c.first} wordt je scharrel.`}return pick([`Een spannende nacht met ${c.first}.`,`Je ziet ${c.first} een paar keer. Daarna verwatert het.`])}
      kar(-5);S.rel.push(c);c.rel=60;S.flags.affairs=(S.flags.affairs||0)+1;return `Je begint een geheime affaire met ${c.first}.`},true,'💋')}}])})}
E('f_betrapt',{sys:1,need:c=>!!partner()&&!!P(c.id)&&P(c.id).alive,t:'Betrapt!',x:c=>{const pt=partner(),x=P(c.id);if(x.guardOf)return `${pt.first} hoort tijdens het bezoekuur van een medegevangene dat je iets hebt met bewaker ${x.first}.`;if(inJail())return pick([`${x.first} komt je opzoeken in de gevangenis, precies op het moment dat ${pt.first} er ook is.`,`${pt.first} vindt thuis een stapel liefdesbrieven van ${x.first} aan jou.`,`${x.first} belt ${pt.first} en vertelt alles over jullie affaire.`])+` ${pt.first} weet nu alles.`;return `${pt.first} heeft berichten van ${x.first} op je telefoon gevonden en weet van je affaire.`},ch:[
 ['🙏 Sorry zeggen en de affaire beëindigen',c=>{const pt=partner(),x=P(c.id);if(x.guardOf&&inJail()){const t=guardRevenge(JL(),x,'');pt.rel=clamp(pt.rel-30);return `Je belooft ${pt.first} dat het voorbij is.${t}`}x.alive=false;x.gone=1;pt.rel=clamp(pt.rel-30);if(pt.rel<15||chance(.35)){breakUp();return `${pt.first} kan het je niet vergeven en maakt het uit.`}return `Je beëindigt het met ${x.first}. ${pt.first} geeft je nog één kans, maar het vertrouwen is weg.`}],
 ['🤥 Alles ontkennen',c=>{const pt=partner();if(chance(.3)){pt.rel=clamp(pt.rel-10);return `${pt.first} twijfelt, maar gelooft je uiteindelijk.`}pt.rel=clamp(pt.rel-45);if(chance(.6)){breakUp();return 'Je liegt slecht. Het is uit.'}return 'Je liegt slecht. De sfeer thuis is ijskoud.'}],
 ['💘 Kiezen voor je minnaar',c=>{const x=P(c.id);breakUp();x.role='partner';x.st='relatie';x.affair=0;x.since=ageY();return `Je kiest voor ${x.first}. Jullie gaan officieel samen verder.`}]]});
E('f_jaloers',{sys:1,need:()=>!!partner(),t:'Jaloezie',ctx:()=>({w:inJail()?pick(['je celgenoot','een medegevangene die je brieven schrijft','iemand die je vaak opbelt']):pick(['je collega','je beste vriend(in)','je ex','iemand van je sportclub'])}),x:c=>`${partner().first} is jaloers op ${c.w} en denkt dat er meer speelt.`,ch:[
 ['💬 Geruststellen',()=>{const pt=partner();if(chance(.6)){pt.rel=clamp(pt.rel+5);return `Jullie praten het uit. ${pt.first} is gerustgesteld.`}pt.rel=clamp(pt.rel-5);return `${pt.first} blijft wantrouwig.`}],
 ['😤 Boos worden',()=>{const pt=partner();pt.rel=clamp(pt.rel-12);return 'Het wordt een flinke ruzie.'}],
 ['🤷 Het negeren',()=>{const pt=partner();pt.rel=clamp(pt.rel-6);return `${pt.first} voelt zich niet serieus genomen.`}]]});
function loveYear(){const pt=partner();if(!pt)return;const aff=living('minnaar').filter(x=>x.affair);
  if(aff.length&&chance(.22+aff.length*.08))Q.push({id:'f_betrapt',c:{id:pick(aff).id}});
  else if(pt.rel<60&&chance(.12))Q.push({id:'f_jaloers',c:EV.f_jaloers.ctx()})}
// ---- samen naar bed (en relatiebezoek in de gevangenis) ----
const INTIM=['partner','minnaar','ex','vriend'];
function canIntim(p){return p&&p.alive&&INTIM.includes(p.role)&&ageY()>=18&&pAge(p)>=18&&!(p.jail&&p.jail.until>S.m)}
function intimacy(p,o={}){const pt=partner();const cheat=pt&&pt!==p;const yes=p.role==='partner'?p.rel/90+.25:p.role==='minnaar'?.85:p.role==='ex'?p.rel/160+(p.flame?.2:0):p.rel/220+(S.st.looks-p.looks)/300+.08;
  modal({title:o.title||'Samen naar bed',em:'🔥',cat:roleLabel(p),person:p,text:`${o.intro||`Je stelt ${p.first} voor om samen naar bed te gaan.`}${cheat?` Let op: je hebt een relatie met ${pt.first}.`:''}`,choices:opts([
    {t:'🛡️ Met condoom',on:()=>{closeModal();go(false)}},{t:'🎲 Zonder bescherming',s:'Kans op een zwangerschap',on:()=>{closeModal();go(true)}}])});
  function go(raw){doAct(o.title||'Samen naar bed',()=>{use('intim'+p.id);if(!o.sure&&!chance(clamp(yes,.05,.97))){p.rel=clamp(p.rel-6);return pick([`${p.first} kijkt je ongemakkelijk aan: "Liever niet."`,`${p.first} lacht het weg. Ongemakkelijk.`])}
    p.rel=clamp(p.rel+ri(5,12));hap(ri(4,8));let t=pick(['Jullie brengen een romantische nacht samen door.','De rest van de avond gaat de deur op slot.','Het wordt een nacht om niet snel te vergeten.']);
    if(cheat){if(p.role!=='minnaar'){p.role='minnaar';p.affair=1;p.st='relatie';t+=` Je hebt nu een affaire met ${p.first}.`}kar(-4);S.flags.affairs=(S.flags.affairs||0)+1;if(chance(.12))Q.push({id:'f_betrapt',c:{id:p.id}})}
    else if(p.role==='ex'){p.flame=1;if(chance(.3)){p.role='partner';p.st='relatie';p.since=ageY();t+=` Het vuur is terug: jullie zijn weer samen!`}}
    else if(p.role==='vriend'&&!p.fwb){p.fwb=1;t+=' Jullie spreken af dat het tussen jullie niets verandert. Toch?'}
    if(raw&&!S.preg&&S.p.g!==p.g&&S.p.g!=='x'&&p.g!=='x'){const fa=S.p.g==='v'?ageY():pAge(p);const f=(fa<30?.25:fa<35?.18:fa<40?.1:fa<45?.03:0)*Math.min(1.5,.4+(S.fert??65)/100*1.1);if(chance(f)){S.preg={due:S.m+9,twins:chance(.03),op:p.id};t+=S.p.g==='v'?' Een paar weken later: je bent zwanger!':` Een paar weken later belt ${p.first}: ${p.g==='v'?'ze':'hij'} is zwanger!`}}
    return t},true,'🔥')}}
// ---- extra acties per persoon ----
function personExtra(el,p){const r=p.role,a=pAge(p),my=ageY();if(r==='huisdier'||!p.alive)return;const s=sec(el,'Meer');
  const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,dots:o.dots,on:()=>doAct(t,fn,true,ic)});const cp=S.cpi||1;
  if(canIntim(p)&&!inJail())row(s,{ic:'🔥',t:'Samen naar bed',s:r==='partner'||r==='minnaar'?'Een romantische avond':'Voorstellen om met elkaar naar bed te gaan',dots:true,on:()=>intimacy(p)});
  if(r==='partner'&&p.st==='relatie'&&!p.live&&my>=18)A('🏡','Samenwonen',()=>{if(chance(p.rel/100+.1)){p.live=1;p.rel=clamp(p.rel+8);hap(5);if(S.home.k==='ouders')setRent('Appartement',Math.round(16500*cp));return `Jullie gaan samenwonen! Vanaf nu delen jullie de vaste lasten.`}p.rel=clamp(p.rel-4);return `${p.first} vindt het nog te vroeg.`});
  if(r==='partner'&&p.st==='verloofd'&&p.prenup==null)A('📜','Huwelijkse voorwaarden voorstellen',()=>{if(chance(.55)){p.prenup=1;return `${p.first} tekent. Bij een scheiding houd je je eigen geld.`}p.prenup=0;p.rel=clamp(p.rel-12);return `${p.first} voelt zich gekwetst: "Denk je nu al aan scheiden?"`},{s:'Bij een scheiding houd je je eigen geld'});
  if(r==='minnaar'){A('✂️',p.affair?'De affaire beëindigen':'Het beëindigen',()=>{p.alive=false;p.gone=1;backSheet();return `Je stopt met ${p.first}.`});
    if(p.affair)A('💘',`Kiezen voor ${p.first}`,()=>{breakUp();p.role='partner';p.st='relatie';p.affair=0;p.since=my;return `Je verlaat je partner voor ${p.first}.`});
    else if(!partner())A('💑','Een echte relatie beginnen',()=>{if(chance(p.rel/100)){p.role='partner';p.st='relatie';p.since=my;return `${p.first} wil ook graag. Jullie hebben een relatie!`}return `${p.first} wil het liever vrijblijvend houden.`})}
  if(['opa','oma'].includes(r))A('💶','Om geld vragen',()=>{if(use('og'+p.id)<.5)return `${p.first}: "Nu niet, lieverd."`;if(chance(p.rel/90)){const g=Math.round(Math.min(Math.max(10,(p.money||0)*.01),my<12?20:my<18?100:2000)*cp);cash(g);p.money=Math.max(0,(p.money||0)-g);return `${p.first} stopt je stiekem ${fmt(g)} toe.`}return `${p.first} zegt dat je zuinig moet zijn.`});
  A('🎬','Naar de film',()=>{if(my>=16)cash(-Math.round(26*cp));const m=use('film'+p.id);p.rel=clamp(p.rel+Math.round(ri(3,7)*m));hap(Math.round(2*m));return pick(['Een spannende thriller.','Een romantische komedie. Jullie lachen veel.','Een film waar jullie het na afloop niet over eens zijn.'])},{dis:my<6||a<6});
  if(my>=18&&a>=12)A('🏖️','Samen op vakantie',()=>{const k=Math.round(ri(8,30)*100*cp);cash(-k);S.acts['vak'+p.id]=1;p.rel=clamp(p.rel+ri(10,18));hap(6);return `Jullie gaan samen ${pick(['naar Italië','naar een hutje in Noorwegen','op stedentrip naar Barcelona','naar de Griekse eilanden','op wintersport'])}. Kosten: ${fmt(k)}.`},{dis:!!S.acts['vak'+p.id]||S.money<800*cp,s:S.acts['vak'+p.id]?'Dit jaar al geweest':'Kost geld'});
  A('🤡','Een grap uithalen',()=>{use('grap'+p.id);if(chance(.6)){hap(2);p.rel=clamp(p.rel+2);return pick([`${p.first} schrikt zich rot en moet daarna keihard lachen.`,`Je verstopt de schoenen van ${p.first}. Een klassieker.`])}p.rel=clamp(p.rel-ri(6,12));return `${p.first} kan er helemaal niet om lachen.`},{dis:a<4});
  if(my>=18&&a>=18&&(p.money||0)>1000&&!p.lent&&!['kind','kleinkind','neefje','nichtje'].includes(r))row(s,{ic:'🤲',t:'Geld lenen',s:'Je moet het wel terugbetalen',dots:true,on:()=>{if(p.rel<50){toast(`${p.first} vertrouwt je niet genoeg`);return}const max=Math.round(Math.min(p.money*.3,50000*cp));amountModal(`Lenen van ${p.first}`,max,x=>doAct('Lenen',()=>{if(!chance(p.rel/110))return `${p.first} wil je geen geld lenen.`;cash(x);p.money-=x;p.lent=x;p.lentY=year();return `${p.first} leent je ${fmt(x)}. Vergeet het niet terug te betalen.`},true,'🤲'))}});
  if(p.lent)A('✅',`${fmt(p.lent)} terugbetalen`,()=>{cash(-p.lent);p.money=(p.money||0)+p.lent;p.lent=0;p.rel=clamp(p.rel+5);return `Je betaalt ${p.first} terug. Netjes.`},{dis:S.money<p.lent});
  if(my>=6&&a>=6&&a<90)row(s,{ic:'👊',t:'Vechten',s:'Je kiest zelf je aanvallen',dots:true,on:()=>fightFlow({foe:{first:p.first,sk:clamp(Math.round((a<14?10:a>65?8:25)+ri(0,30))),hp:ri(60,95)},title:`Gevecht met ${p.first}`,cat:roleLabel(p),kill:()=>{p.alive=false;p.died=my},end:res=>{p.rel=clamp(p.rel-35);kar(-6);if(my>=18&&chance(.25)){const k=Math.round(900*cp);cash(-k);return (res==='win'?`Je wint van ${p.first}`:`${p.first} is sterker`)+`. ${p.first} doet aangifte: je krijgt een boete van ${fmt(k)}.`}return res==='win'?`Je wint het gevecht. ${p.first} praat voorlopig niet meer met je.`:res==='flee'?'Je loopt weg.':`${p.first} wint. Jullie relatie is flink beschadigd.`}})});
  if(r==='kind'&&my>=18)A(p.disown?'🤝':'🚫',p.disown?'Weer opnemen in je testament':'Onterven',()=>{p.disown=p.disown?0:1;p.rel=clamp(p.rel+(p.disown?-40:15));if(S.flags.heir===p.id&&p.disown)S.flags.heir=null;return p.disown?`Je onterft ${p.first}. ${p.first} krijgt niets als je overlijdt.`:`${p.first} staat weer in je testament.`});
  if(r==='kind'&&a<18&&a>=4){A('💶','Zakgeld geven',()=>{const k=Math.round(5*cp*(a<12?1:3));cash(-k);p.money=(p.money||0)+k;const m=use('zak'+p.id);p.rel=clamp(p.rel+Math.round(3*m));return `${p.first} is blij met ${fmt(k)}.`});
    A('⚽','Samen sporten',()=>{const m=use('ksport'+p.id);p.rel=clamp(p.rel+Math.round(5*m));hea(1);return `Je speelt een middag ${pick(['voetbal','basketbal','badminton','tennis'])} met ${p.first}.`})}}
// ---- opvoeden ----
const PSTY={liefdevol:['Liefdevol','Warm en betrokken: een sterke band'],streng:['Streng','Duidelijke regels: meer discipline en betere cijfers, maar minder band'],vrij:['Vrij','Veel vrijheid: een leuke band, maar weinig discipline'],beschermend:['Beschermend','Altijd erbovenop: veilig, maar ze worden minder zelfstandig']};
function sheetParenting(el){const P_=S.par=S.par||{style:'liefdevol',pocket:0};const kids=living('kind').filter(k=>pAge(k)<18);
  card(el,`<h3>🧸 Opvoeding</h3><span class="muted">Je opvoedstijl bepaalt elk jaar hoe je kinderen zich ontwikkelen. Zakgeld kost elke week geld, maar je kinderen waarderen het.</span>`);
  const s=sec(el,'Opvoedstijl');for(const [k,[t,d]] of Object.entries(PSTY))row(s,{ic:P_.style===k?'✅':'⚪',t,s:d,on:()=>{P_.style=k;refreshSheet();toast(`Opvoedstijl: ${t.toLowerCase()}`)}});
  const z=sec(el,'Zakgeld per week');for(const v of [0,5,10,25])row(z,{ic:P_.pocket===v?'✅':'⚪',t:v?fmt(v*(S.cpi||1)):'Geen zakgeld',s:v?`${fmt(v*(S.cpi||1)*52*kids.length)} per jaar voor ${kids.length} ${kids.length===1?'kind':'kinderen'}`:'',on:()=>{P_.pocket=v;refreshSheet()}});
  if(S.cust)card(el,`<span class="muted">Na je scheiding: ${{co:'co-ouderschap, de kinderen wonen om en om bij jullie',ik:'de kinderen wonen bij jou',ex:'de kinderen wonen bij je ex, jij betaalt kinderalimentatie'}[S.cust]}.</span>`)}
function kidYear(){const P_=S.par||{style:'liefdevol',pocket:0};const kids=living('kind').filter(k=>pAge(k)<18&&pAge(k)>=1);if(!kids.length)return;
  for(const k of kids){k.disc=k.disc??50;const st=P_.style;
    if(st==='streng'){k.disc=clamp(k.disc+3);k.rel=clamp(k.rel-1);k.smarts=clamp(k.smarts+ri(0,2))}else if(st==='liefdevol'){k.rel=clamp(k.rel+2);k.disc=clamp(k.disc+1)}else if(st==='vrij'){k.rel=clamp(k.rel+1);k.disc=clamp(k.disc-2)}else{k.rel=clamp(k.rel+1);k.disc=clamp(k.disc+1)}
    if(P_.pocket){k.rel=clamp(k.rel+1);k.money=(k.money||0)+P_.pocket*52*(S.cpi||1)}
    if(S.cust==='ex')k.rel=clamp(k.rel-2)}
  if(P_.pocket){const t=Math.round(P_.pocket*52*kids.length*(S.cpi||1));cash(-t);L(`Zakgeld voor je ${kids.length===1?'kind':'kinderen'}: ${fmt(t)} dit jaar.`,'sys')}
  const old=kids.filter(k=>pAge(k)>=8);if(old.length&&!inJail()){const k=pick(old);if(chance(.12+(50-(k.disc??50))/220))Q.push({id:'f_kattenkwaad',c:{id:k.id,w:pick(['heeft gespijbeld','is betrapt op roken','heeft gevochten op school','komt om 3 uur \'s nachts thuis','heeft een onvoldoende verstopt','heeft geld uit je portemonnee gepakt'])}})}
  for(const k of living('kind').filter(k=>pAge(k)===18&&!k.studyAsk)){k.studyAsk=1;Q.push({id:'f_studie',c:{id:k.id}})}}
E('f_kattenkwaad',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Kattenkwaad',x:c=>`${P(c.id).first} (${pAge(P(c.id))}) ${c.w}.`,ch:[
 ['🏠 Huisarrest',c=>{const k=P(c.id);k.disc=clamp((k.disc??50)+8);k.rel=clamp(k.rel-5);return `${k.first} mag twee weken nergens heen. Er wordt veel met deuren geslagen.`}],
 ['📱 Telefoon afpakken',c=>{const k=P(c.id);k.disc=clamp((k.disc??50)+5);k.rel=clamp(k.rel-3);return `${k.first} is woest, maar leert ervan.`}],
 ['💬 Rustig praten',c=>{const k=P(c.id);if(chance(.6)){k.disc=clamp((k.disc??50)+4);k.rel=clamp(k.rel+4);return `${k.first} snapt het en belooft het niet meer te doen.`}k.rel=clamp(k.rel+1);return `${k.first} knikt, maar luistert eigenlijk niet.`}],
 ['🤷 Niets doen',c=>{const k=P(c.id);k.disc=clamp((k.disc??50)-6);k.rel=clamp(k.rel+1);return `${k.first} heeft door dat het allemaal wel kan.`}],
 ['😠 Flink tekeergaan',c=>{const k=P(c.id);k.disc=clamp((k.disc??50)+6);k.rel=clamp(k.rel-12);kar(-2);return `${k.first} schrikt, maar jullie band krijgt een deuk.`}]]});
E('f_studie',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Studeren',x:c=>{const k=P(c.id);return `${k.first} is 18 en wil gaan studeren. Een studie kost ongeveer ${fmt(36000*(S.cpi||1))} voor vier jaar.`},ch:[
 ['🎓 Alles betalen',c=>{const k=P(c.id);const t=Math.round(36000*(S.cpi||1));cash(-t);k.study=2;k.rel=clamp(k.rel+12);k.smarts=clamp(k.smarts+5);return `Je betaalt de hele studie. ${k.first} begint zonder schuld.`},()=>S.money>=36000*(S.cpi||1)],
 ['🤝 De helft betalen',c=>{const k=P(c.id);const t=Math.round(18000*(S.cpi||1));cash(-t);k.study=1;k.rel=clamp(k.rel+5);return `Je betaalt de helft. De rest leent ${k.first} zelf.`},()=>S.money>=18000*(S.cpi||1)],
 ['🙅 Zelf laten regelen',c=>{const k=P(c.id);k.study=chance(k.smarts/120)?1:0;k.rel=clamp(k.rel-5);return k.study?`${k.first} regelt het zelf met een studielening.`:`${k.first} gaat liever meteen werken.`}]]});
const GOODJOBS=['advocaat','huisarts','developer','consultant','accountant','ingenieur','journalist','ondernemer'];
// voogdij na een scheiding met jonge kinderen
E('f_voogdij',{sys:1,need:()=>living('kind').some(k=>pAge(k)<18),t:'Voogdij',x:()=>'Jullie gaan uit elkaar en er zijn kinderen. Waar gaan ze wonen?',ch:[
 ['🔁 Co-ouderschap',()=>{S.cust='co';for(const k of living('kind').filter(k=>pAge(k)<18))k.rel=clamp(k.rel-5);return 'De kinderen wonen om en om bij jullie. Niet ideaal, maar het werkt.'}],
 ['⚖️ Volledige voogdij aanvragen',()=>{const t=Math.round(8000*(S.cpi||1));cash(-t);if(chance(.45+(S.karma-50)/200)){S.cust='ik';for(const k of living('kind').filter(k=>pAge(k)<18))k.rel=clamp(k.rel+4);return `De rechter wijst de kinderen aan jou toe. Advocaatkosten: ${fmt(t)}.`}S.cust='ex';for(const k of living('kind').filter(k=>pAge(k)<18))k.rel=clamp(k.rel-10);return `De rechter kiest voor je ex. Jij betaalt kinderalimentatie. Advocaatkosten: ${fmt(t)}.`},()=>S.money>=8000*(S.cpi||1)],
 ['🏠 Bij je ex laten wonen',()=>{S.cust='ex';for(const k of living('kind').filter(k=>pAge(k)<18))k.rel=clamp(k.rel-15);return 'De kinderen gaan bij je ex wonen. Jij betaalt kinderalimentatie en ziet ze om het weekend.'}]]});
// ---- stamboom ----
function sheetTree(el){const gens=S.gens||[];
  card(el,`<span class="muted">Familie ${he(S.p.last)} · ${gens.length+1} generatie${gens.length?'s':''}</span>`);
  if(!gens.length){const anc=sec(el,'Voorouders');let n=0;for(const p of people(['opa','oma']).concat(people(['moeder','vader'])))if(p.alive!==undefined){n++;row(anc,{ic:p.alive?faceOf(p):'💀',t:`${p.first} ${p.last||''}`,role:roleLabel(p),s:p.alive?`${pAge(p)} jaar`:'Overleden'})}if(!n)empty(anc,'Geen gegevens over je voorouders.')}
  gens.forEach((g,i)=>{const s=sec(el,`Generatie ${i+1}`);row(s,{ic:g.ap?avatarSvg(g.ap,Math.min(g.age||60,70),g.g||'m',{head:1}):'👤',t:g.name,s:`${g.by}–${g.by+(g.age||0)} · ${g.age} jaar${g.job?' · '+g.job:''}${g.partner?` · met ${g.partner}`:''}${g.kids?` · ${g.kids} ${g.kids===1?'kind':'kinderen'}`:''}`})});
  const me=sec(el,`Generatie ${gens.length+1} · jij`);row(me,{ic:playerFace(),t:`${S.p.first} ${S.p.last}`,s:`Geboren ${S.p.by} · ${ageY()} jaar${S.job?' · '+jobTitle():''}`});
  const pt=partner();if(pt)row(me,{ic:faceOf(pt),t:`${pt.first} ${pt.last||''}`,role:cap(partnerWord(pt))});
  for(const p of living(['broer','zus']))row(me,{ic:faceOf(p),t:`${p.first} ${p.last||''}`,role:roleLabel(p),s:`${pAge(p)} jaar`});
  const kids=people('kind');if(kids.length){const k=sec(el,`Generatie ${gens.length+2} · je kinderen`);for(const p of kids)row(k,{ic:p.alive?faceOf(p):'💀',t:`${p.first} ${p.last||''}`,role:roleLabel(p),s:p.alive?`${pAge(p)} jaar${p.job?' · '+p.job:''}${p.disown?' · onterfd':''}`:'Overleden'})}
  const gk=people('kleinkind');if(gk.length){const k=sec(el,`Generatie ${gens.length+3} · je kleinkinderen`);for(const p of gk)row(k,{ic:p.alive?faceOf(p):'💀',t:`${p.first} ${p.last||''}`,role:roleLabel(p),s:p.alive?`${pAge(p)} jaar`:'Overleden'})}}

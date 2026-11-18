/* ================= FASE 10: werk en school =================
   10.1 je leidinggevende (uit de kring Collega's) telt mee; 10.2 werkdag: meestal een logregel, soms een situatie uit je beroep;
   10.3 jaargesprek; 10.4 nieuwe beroepen en studies (vervoer, zorg en dieren, overheid en veiligheid, ambacht en buiten);
   10.5 werktijden, burn-out, ouderschapsverlof, sabbatical; 10.6 docenten met een naam, een klas overslaan; 10.7 stage en buitenlandsemester. */

// ---------- 10.4 nieuwe studies en beroepen ----------
Object.assign(SECN,{vervoer:'Vervoer',overheid:'Overheid',buiten:'Ambacht en buiten'});
for(const st of [{id:'luchtvaart',t:'Pilotenopleiding',ty:['hbo'],sk:'tech',sm:55},{id:'tandheelkunde',t:'Tandheelkunde',ty:['wo'],len:6,sm:60},{id:'farmacie',t:'Farmacie',ty:['wo'],sm:56},
  {id:'diergeneeskunde',t:'Diergeneeskunde',ty:['wo'],len:6,sm:60},{id:'bestuurskunde',t:'Bestuurskunde',ty:['hbo','wo'],sk:'sociaal'},{id:'agrarisch',t:'Agrarische opleiding',ty:['mbo','hbo']},
  {id:'installatie',t:'Installatietechniek',ty:['mbo'],sk:'tech'},{id:'timmer',t:'Timmeropleiding',ty:['mbo'],sk:'tech'}])if(!STUDIES.some(x=>x.id===st.id))STUDIES.push(st);
Object.assign(STUDYSEC,{luchtvaart:'vervoer',tandheelkunde:'zorg',farmacie:'zorg',diergeneeskunde:'zorg',bestuurskunde:'overheid',agrarisch:'buiten',installatie:'buiten',timmer:'buiten'});
for(const s of STUDIES)s.sec=STUDYSEC[s.id]||'algemeen';
{const pol=STUDIES.find(s=>s.id==='politie');if(pol&&!pol.ty.includes('hbo'))pol.ty.push('hbo')}
const JOBS10=[
 {id:'piloot',lad:['Tweede officier','Eerste officier','Gezagvoerder','Chief pilot'],sal:[48,75,130,180],req:{age:[20,99],clean:1},np:1,sk:'tech',em:'✈️',g:'vervoer'},
 {id:'cabine',lad:['Cabinemedewerker','Senior purser','Hoofd cabinepersoneel'],sal:[26,38,55],req:{age:[18,99]},sk:'sociaal',em:'🛫',g:'vervoer'},
 {id:'buschauffeur',lad:['Buschauffeur','Touringcarchauffeur','Planner openbaar vervoer'],sal:[30,34,44],req:{age:[21,99]},em:'🚌',g:'vervoer'},
 {id:'machinist',lad:['Machinist in opleiding','Machinist','Hoofdmachinist'],sal:[32,46,58],req:{age:[18,99]},sk:'tech',em:'🚆',g:'vervoer'},
 {id:'tandarts',lad:['Tandarts','Tandarts met eigen praktijk'],sal:[75,140],req:{age:[22,99]},np:1,em:'🦷',g:'zorg'},
 {id:'apotheker',lad:['Apotheker','Beherend apotheker'],sal:[62,90],req:{age:[22,99]},np:1,em:'💊',g:'zorg'},
 {id:'dierenarts',lad:['Dierenarts','Dierenarts met eigen kliniek'],sal:[48,85],req:{age:[22,99]},np:1,em:'🐾',g:'zorg'},
 {id:'ambulance',lad:['Ambulancechauffeur','Ambulanceverpleegkundige','Teamleider ambulancedienst'],sal:[34,46,60],req:{age:[20,99]},np:1,em:'🚑',g:'zorg'},
 {id:'ambtenaar',lad:['Beleidsmedewerker','Senior beleidsadviseur','Afdelingshoofd','Secretaris-generaal'],sal:[38,55,75,160],req:{age:[20,99]},np:1,sk:'sociaal',em:'🏛️',g:'kantoor'},
 {id:'brandweer',lad:['Manschap brandweer','Bevelvoerder','Officier van dienst','Brandweercommandant'],sal:[32,42,58,95],req:{age:[18,99]},sk:'sport',em:'🚒',g:'veilig'},
 {id:'recherche',lad:['Rechercheur','Senior rechercheur','Teamleider recherche','Hoofd recherche'],sal:[42,55,68,95],req:{age:[21,99],clean:1},np:1,em:'🔎',g:'veilig'},
 {id:'douane',lad:['Douanier','Senior douanier','Teamleider douane'],sal:[34,44,58],req:{age:[18,99],clean:1},np:1,em:'🛃',g:'veilig'},
 {id:'boer',lad:['Boerenknecht','Bedrijfsleider boerderij','Eigen boerderij'],sal:[26,38,62],req:{age:[16,99]},em:'🚜',g:'buiten'},
 {id:'hovenier',lad:['Hovenier','Voorman hoveniers','Eigen hoveniersbedrijf'],sal:[27,34,55],req:{age:[16,99]},em:'🌳',g:'buiten'},
 {id:'timmerman',lad:['Leerling-timmerman','Timmerman','Meestertimmerman','Eigen timmerbedrijf'],sal:[24,34,42,65],req:{age:[16,99]},sk:'tech',em:'🪚',g:'buiten'},
 {id:'loodgieter',lad:['Leerling-loodgieter','Loodgieter','Eigen installatiebedrijf'],sal:[24,38,70],req:{age:[16,99]},sk:'tech',em:'🔧',g:'buiten'}];
Object.assign(JGROUP,{vervoer:[],veilig:['politie','beveil'],buiten:['bouw']});
for(const g of ['vervoer','veilig','buiten'])for(const k of Object.keys(JGROUP))if(k!==g)JGROUP[k]=JGROUP[k].filter(x=>!JGROUP[g].includes(x)||k===g);
for(const j of JOBS10){if(JOB(j.id))continue;JOBS.splice(JOBS.findIndex(x=>x.id==='politiek'),0,j);JOBEM[j.id]=j.em;if(JGROUP[j.g])JGROUP[j.g].push(j.id)}
Object.assign(JOBSEC,{piloot:'vervoer',cabine:'vervoer',buschauffeur:'vervoer',machinist:'vervoer',tandarts:'zorg',apotheker:'zorg',dierenarts:'zorg',ambulance:'zorg',ambtenaar:'overheid',brandweer:'veiligheid',recherche:'veiligheid',douane:'veiligheid',boer:'buiten',hovenier:'buiten',timmerman:'buiten',loodgieter:'buiten'});
Object.assign(PATHS,{luchtvaart:{hbo:[['piloot',0],['cabine',1]]},tandheelkunde:{wo:[['tandarts',0]]},farmacie:{wo:[['apotheker',0],['lab',1]]},diergeneeskunde:{wo:[['dierenarts',0]]},
  bestuurskunde:{hbo:[['ambtenaar',0]],wo:[['ambtenaar',1],['consultant',0]]},agrarisch:{mbo:[['boer',0],['hovenier',0]],hbo:[['boer',1],['milieu',0]]},installatie:{mbo:[['loodgieter',1],['elektro',0]]},timmer:{mbo:[['timmerman',1],['bouw',1]]}});
PATHS.verpleeg.mbo.push(['ambulance',0]);PATHS.verpleeg.hbo.push(['ambulance',1]);PATHS.politie.mbo.push(['douane',0]);PATHS.politie.hbo=[['recherche',0],['politie',1],['douane',1]];PATHS.rechten.wo.push(['recherche',1]);
for(const j of JOBS){j.sec=JOBSEC[j.id]||'algemeen';const via=[];for(const f in PATHS)for(const ty in PATHS[f])for(const [id] of PATHS[f][ty])if(id===j.id)via.push([f,ty]);j.via=via;
  if(via.length&&(j.req.f||j.np)){j.np=1;j.minTy=Math.min(...via.map(([,ty])=>TYR[ty]))}}
Object.assign(SIG,{vervoer:['🧭','Extra diensten rijden','Meer geld, minder vrije tijd'],veilig:['🚨','Een extra dienst draaien','Meer geld, en je baas ziet het'],buiten:['🧰','Een klus erbij aannemen','Extra geld, zwaar werk']});

// ---------- 10.2 werkdag: situaties per beroep ----------
// [situatie, [[keuze, score 0-2]]], zoals de bestaande WORKQ/WORKG
Object.assign(WORKG,{
 vervoer:[['Er is vertraging en de passagiers worden boos.',[['Rustig uitleggen wat er aan de hand is',2],['Omroepen dat je er niets aan kunt doen',1],['De microfoon uitzetten',0]]],['Je merkt een technisch probleem vlak voor vertrek.',[['Melden en het laten nakijken',2],['Een collega laten beslissen',1],['Toch vertrekken',0]]],['Iemand wordt onwel onderweg.',[['Meteen stoppen en hulp regelen',2],['Doorgaan naar de volgende halte',1],['Niets doen',0]]]],
 veilig:[['Een melding komt binnen terwijl je net pauze hebt.',[['Meteen gaan',2],['Een collega vragen',1],['Eerst je broodje opeten',0]]],['Een verdachte begint tegen je te schreeuwen.',[['Kalm blijven en de-escaleren',2],['Hard terugpraten',1],['Duwen',0]]],['Je collega overtreedt een regel.',[['Er later met hem over praten',2],['Wegkijken',1],['Meedoen',0]]]],
 buiten:[['Het regent pijpenstelen en de klus moet vandaag af.',[['Regenpak aan en doorwerken',2],['Een dag uitstellen in overleg',1],['Naar huis gaan zonder te bellen',0]]],['Een klant wil het anders dan afgesproken.',[['Meedenken en een eerlijke prijs geven',2],['Het gewoon doen',1],['Weigeren en vertrekken',0]]],['Je gereedschap is gestolen uit je bus.',[['Aangifte doen en snel nieuw regelen',2],['Lenen van een collega',1],['De dag maar afschrijven',0]]]]});
WORKG.zorg.push(['Een familielid is boos op de afdeling.',[['Rustig luisteren en uitleggen',2],['Doorverwijzen naar de arts',1],['Wegsturen',0]]]);
WORKG.kantoor.push(['Een collega vraagt of jij zijn presentatie wilt overnemen.',[['Helpen, maar afspreken dat hij het volgende keer terugdoet',2],['Ja zeggen en balen',1],['Nee en verder niks',0]]]);
WORKG.horeca.push(['Je collega komt niet opdagen op zaterdagavond.',[['Schuiven en het samen oplossen',2],['De keuken zo goed mogelijk draaiende houden',1],['Ook naar huis gaan',0]]]);
WORKG.tech.push(['De klant wil een nieuwe functie, maar de deadline is morgen.',[['Eerlijk zeggen wat haalbaar is',2],['Beloven en het halve werk leveren',1],['Niet reageren',0]]]);
WORKG.onderwijs.push(['Een leerling vertelt je in vertrouwen dat het thuis niet goed gaat.',[['Luisteren en met de zorgcoördinator overleggen',2],['Zeggen dat het wel goedkomt',1],['Doorgaan met de les',0]]]);
WORKG.handwerk.push(['Je baas vraagt of je zaterdag kunt werken.',[['Ja, als je er een vrije dag voor terugkrijgt',2],['Met tegenzin ja',1],['Nee, zonder reden',0]]]);
const WDTXT={zorg:['Een drukke dienst, maar iedereen is goed geholpen.','Je hebt een rustige dag en tijd voor een praatje met de patiënten.'],horeca:['Volle bak, maar alles loopt op rolletjes.','Een rustige dienst. Je maakt de keuken eens goed schoon.'],tech:['Je lost drie storingen op voor de lunch.','Een dag vol overleg. Code schrijven komt er niet van.'],kantoor:['Je mailbox is eindelijk leeg.','Vergadering na vergadering. Je komt nergens aan toe.'],onderwijs:['De klas luistert vandaag echt.','Een chaotische dag met een brandoefening halverwege.'],handwerk:['Je klus is eerder af dan gepland.','Een zware dag. Je rug voelt het.'],vervoer:['Alles op tijd vandaag. Bijna een record.','Vertraging na vertraging, maar je blijft vriendelijk.'],veilig:['Een rustige dienst zonder bijzonderheden.','Een spannende melding, maar alles loopt goed af.'],buiten:['Je werkt de hele dag in de zon. Heerlijk.','Modder tot aan je knieën, maar het werk is af.'],fame:['Een dag vol interviews en fotoshoots.','Repetities, repetities, repetities.'],politiek:['Je schudt honderd handen.','Een lange dag in de vergaderzaal.']};
const perfAdd=d=>{if(S.job)S.job.perf=clamp(S.job.perf+d)};
const boss=()=>{const c=typeof circle==='function'&&S.job?circle('work'):null;return c?circPpl(c).find(p=>p.lead):null};
workDay=(f=>function(){if(!S.job)return;const g=jobGroup(S.job.id);const pool=(WORKG[g]||[]).concat(WORKQ);
  if(chance(.35)&&pool.length){const [q,op]=pick(pool);const b=boss();
    modal({title:'Op je werk',em:jobEm(S.job.id),cat:jobTitle(),text:q,choices:op.slice().sort(()=>R()-.5).map(([t,sc])=>({t,on:()=>{closeModal();doAct('Werkdag',()=>{use('werk');const d=[-6,2,7][sc];perfAdd(d);if(b)b.rel=clamp(b.rel+[-5,0,4][sc]);hap(sc===2?2:sc===0?-1:0);if(sc===0&&chance(.15))kar(-1);
      return sc===2?`Goed opgelost. ${b?b.first+' knikt tevreden.':'Je baas is tevreden.'} (prestaties +${d})`:sc===1?`Het loopt met een sisser af. (prestaties +${d})`:`Dat viel niet goed. ${b?b.first+' roept je even apart.':'Je baas is niet blij.'} (prestaties ${d})`},true,jobEm(S.job.id))}}))});return}
  doAct('Werkdag',()=>{const m=use('werk');const sk=S.sk[(JOB(S.job.id)||{}).sk]||30;const sc=clamp((S.st.smarts+sk)/200+gauss()*.18,0,1);let d=Math.round((sc-.45)*12);if(d>0)d=Math.round(d*m);perfAdd(d);hap(sc>.7?1:0);
    return `${pick(WDTXT[g]||WDTXT.kantoor)} (prestaties ${d>=0?'+':''}${d})`},true,jobEm(S.job.id))})(workDay);
// extra actie voor de nieuwe groepen
sigAction=(f=>function(){const g=S.job&&jobGroup(S.job.id);if(!['vervoer','veilig','buiten'].includes(g))return f.apply(this,arguments);const [e,t]=SIG[g];
  doAct(t,()=>{const m=use('sig');const k=Math.round(salary()/40*m);cash(k);perfAdd(3*m);hea(g==='buiten'?-1:0);return `Je draait extra uren en verdient ${fmt(k)} bij.`},true,e)})(sigAction);

// ---------- 10.1 / 10.3 / 10.5 jouw werk ----------
const WL={normaal:['⏱️','Gewone uren','Zoals afgesproken in je contract'],over:['🔥','Veel overuren','10% meer geld en betere prestaties, maar zwaar'],part:['🌿','Parttime','60% van je salaris, meer tijd voor jezelf en je gezin'],thuis:['🏠','Vaak thuiswerken','Rustiger, maar je ziet je collega\'s minder']};
const canHome=()=>S.job&&['kantoor','tech','onderwijs'].includes(jobGroup(S.job.id));
salary=(f=>function(){const s=f.apply(this,arguments);const w=S&&S.job&&S.job.wl;return w==='part'?s*.6:w==='over'?s*1.1:s})(salary);
const perfWord=v=>v>=80?'uitstekend':v>=65?'goed':v>=50?'voldoende':v>=35?'matig':'onvoldoende';
function jaargesprek(){const j=S.job,b=boss();const bn=b?`${b.first}${b.kt?` (${(KTXT[ktOf(b)]||'').split(',')[0]})`:''}`:'je leidinggevende';const pr=j.perf,br=b?b.rel:50;
  const done=()=>{S.acts.jg=1;j.jg=year()};
  modal({title:'Jaargesprek',em:'📋',cat:jobTitle(),text:`Je zit tegenover ${bn}. Je beoordeling dit jaar: ${perfWord(pr)} (${Math.round(pr)}%). Wat wil je bespreken?`,choices:opts([
    {t:'💶 Om opslag vragen',on:()=>{closeModal();doAct('Jaargesprek',()=>{done();if(chance(clamp(pr/120+(br-50)/250,.05,.9))){const p=ri(3,9);j.mult*=1+p/100;hap(4);if(b)b.rel=clamp(b.rel+1);return `"Dat heb je verdiend." Je krijgt ${p}% opslag.`}if(b)b.rel=clamp(b.rel-2);hap(-1);return '"Daar is dit jaar geen ruimte voor."'},true,'💶')}},
    {t:'📈 Promotie bespreken',dis:j.lvl>=JOB(j.id).lad.length-1,on:()=>{closeModal();doAct('Jaargesprek',()=>{done();if(j.lyrs>=1&&chance(clamp((pr-55)/60+(br-50)/200,.03,.8))){const fl=promoTxt(j.id);promote();return `${fl} Je bent nu ${jobTitle().toLowerCase()}!`}j.perf=clamp(j.perf+2);return `"Nog niet, maar je bent op de goede weg." Je spreekt af wat je moet laten zien.`},true,'📈')}},
    {t:'🚪 Dreigen te vertrekken',on:()=>{closeModal();doAct('Jaargesprek',()=>{done();if(pr>=70&&chance(.6)){const p=ri(8,15);j.mult*=1+p/100;if(b)b.rel=clamp(b.rel-4);return `Ze willen je niet kwijt. Je krijgt ${p}% opslag.`}if(b)b.rel=clamp(b.rel-12);if(pr<50&&chance(.3)){const t=jobTitle().toLowerCase();endJob();hap(-8);MS(`Vertrok als ${t}`,0);return '"Dan ga je toch." Je moet je spullen pakken.'}return `${b?b.first:'Je baas'} haalt de schouders op. Dat was geen slimme zet.`},true,'🚪')}},
    {t:'🙂 Tevreden zijn',on:()=>{closeModal();doAct('Jaargesprek',()=>{done();if(b)b.rel=clamp(b.rel+4);hap(1);return 'Een prettig gesprek. Jullie spreken af zo door te gaan.'},true,'🙂')}}])})}
function wlMenu(){const cur=S.job.wl||'normaal';modal({title:'Werktijden',em:'⏱️',cat:jobTitle(),text:'Hoe wil je werken?',choices:opts(Object.entries(WL).filter(([k])=>k!=='thuis'||canHome()).map(([k,[e,n,d]])=>({t:`${e} ${n}`,s:d,cls:cur===k?'go':'',on:()=>{closeModal();S.job.wl=k;if(k!=='over')S.job.ot=0;toast(`Werktijden: ${n.toLowerCase()}`);refreshSheet();render()}})))})}
function f10JobRows(el){const j=S.job;if(!j||j.id==='prosport'||inJail())return;const s=sec(el,'Jouw werk');const b=boss();
  if(b)row(s,{ic:'🧑‍💼',t:`Je leidinggevende: ${b.first}`,s:`${TREM[ktOf(b)]||''} ${cap(KTXT[ktOf(b)]||'')} · jullie band: ${Math.round(b.rel)}%`,on:()=>openSheet(b.first,el=>sheetCircP(el,'work',b),true)});
  row(s,{ic:'📋',t:'Jaargesprek',s:S.acts.jg||j.jg===year()?'Dit jaar al gehad':j.yrs<1?'Na je eerste jaar':'Beoordeling, opslag, promotie',dis:!!S.acts.jg||j.jg===year()||j.yrs<1,dots:true,on:jaargesprek});
  const w=WL[j.wl||'normaal'];row(s,{ic:w[0],t:'Werktijden',s:`${w[1]} · tik om te wisselen`,dots:true,on:wlMenu});
  if(living('kind').some(k=>pAge(k)<1))row(s,{ic:'👶',t:'Ouderschapsverlof',s:S.acts.ov?'Dit jaar al opgenomen':'Een paar maanden thuis bij je baby',dis:!!S.acts.ov,on:()=>doAct('Ouderschapsverlof',()=>{S.acts.ov=1;const k=living('kind').find(k=>pAge(k)<1);cash(-Math.round(salary()*.08));k.rel=clamp(k.rel+10);const pt=partner();if(pt)pt.rel=clamp(pt.rel+6);hap(5);j.perf=clamp(j.perf-5);return `Drie maanden thuis met ${k.first}. Luiers, wandelingen en heel weinig slaap.`},true,'👶')});
  if(j.yrs>=5)row(s,{ic:'🌴',t:'Sabbatical',s:S.flags.sab10&&year()-S.flags.sab10<8?`Weer mogelijk in ${S.flags.sab10+8}`:'Een half jaar onbetaald vrij',dis:!!(S.flags.sab10&&year()-S.flags.sab10<8),dots:true,on:()=>ask('Sabbatical?',`Je neemt een half jaar onbetaald verlof. Dat kost je ongeveer ${fmt(Math.round(salary()*.5))}.`,'Doen',()=>doAct('Sabbatical',()=>{S.flags.sab10=year();cash(-Math.round(salary()*.5));hap(12);hea(5);j.perf=clamp(j.perf-8);MS('Nam een sabbatical',1);return pick(['Je reist een half jaar door Zuid-Amerika.','Je leert surfen in Portugal.','Je knapt eindelijk dat huisje op en leest dertig boeken.'])},true,'🌴'),'go')})}
circRow=(f=>function(el,slot){const r=f.apply(this,arguments);if(slot==='work')safe(()=>f10JobRows(el));return r})(circRow);
function workYear(){const j=S.job;if(!j||j.id==='prosport'||inJail())return;const b=boss();
  if(b){j.perf=clamp(j.perf+Math.round((b.rel-50)/20));const kt=ktOf(b);if(kt==='Chagrijnig')j.perf=clamp(j.perf-1);else if(kt==='Lief'||kt==='Zorgzaam')hap(1)}
  const w=j.wl||'normaal';const fam=()=>[partner(),...living('kind').filter(k=>pAge(k)<18)].filter(Boolean);
  if(w==='over'){j.perf=clamp(j.perf+5);hap(-2);hea(-1);for(const p of fam())p.rel=clamp(p.rel-1);j.ot=(j.ot||0)+1;if(j.ot>=3&&chance(.25)&&typeof fmFree==='function'&&fmFree()){fmTake();Q.push({id:'w10_burnout',c:{}})}}
  else if(w==='part'){hap(2);j.perf=clamp(j.perf-1);for(const p of fam())p.rel=clamp(p.rel+1)}
  else if(w==='thuis'){hap(1);const c=circle('work');if(c)for(const p of circPpl(c))p.rel=clamp(p.rel-1)}
  // stage: na je studie kun je bij je stagebedrijf beginnen
}
E('w10_burnout',{sys:1,need:()=>!!S.job,t:'Op',x:'Je slaapt slecht, vergeet dingen en huilt in de auto. Je huisarts noemt het een burn-out.',ch:[
 ['🛌 Je ziek melden en herstellen',()=>{S.job.wl='normaal';S.job.ot=0;perfAdd(-15);hap(4);hea(3);MS('Herstelde van een burn-out',1);return 'Je blijft drie maanden thuis. Wandelen, slapen, praten. Langzaam komt je energie terug.'}],
 ['🌿 Parttime gaan werken',()=>{S.job.wl='part';S.job.ot=0;perfAdd(-8);hap(5);return 'Je gaat minder werken. Het geld is minder, de rust is groter.'}],
 ['💪 Gewoon doorgaan',()=>{hea(-6);hap(-6);perfAdd(-5);return 'Je bijt door. Het voelt alsof je door stroop loopt.'}]]});
EVMETA.w10_burnout=['Werk','🪫'];

// ---------- 10.6 school: docenten met een naam, een klas overslaan ----------
function docOf(s){const E=S.edu;E.doc=E.doc||{};if(!E.doc[s]){const g=pick(['m','v']);E.doc[s]={n:`${g==='v'?'mevrouw':'meneer'} ${pick(NAMES[C().r].l)}`,kt:pick(['Lief','Grappig','Chagrijnig','Eigenwijs','Zorgzaam','Ambitieus'])}}return E.doc[s]}
function sheetDocs(el){const E=S.edu;if(typeof ensureGrades==='function')ensureGrades();const gr=E.gr||{};if(!Object.keys(gr).length){empty(el,'Nog geen vakken met een cijfer.');return}const s=sec(el,'Je docenten');
  for(const v of Object.keys(gr)){const d=docOf(v);const k='uitl'+v;row(s,{ic:SUBEM[v]||'📘',t:`${subjName(v)}: ${d.n}`,s:`${TREM[d.kt]||''} ${KTXT[d.kt]||''} · cijfer ${nl1(gr[v])}${S.acts[k]?' · al extra uitleg gehad':''}`,dis:!!S.acts[k],on:()=>doAct('Extra uitleg',()=>{S.acts[k]=1;E.xtra=E.xtra||{};E.xtra[v]=1;const nice=['Lief','Zorgzaam','Grappig'].includes(d.kt);return nice?`${cap(d.n)} neemt er rustig de tijd voor. Het kwartje valt.`:d.kt==='Chagrijnig'?`${cap(d.n)} zucht, maar legt het toch uit.`:`${cap(d.n)} geeft je een stapel extra opgaven mee.`},true,'👩‍🏫')})}}
schoolLifeRow=(f=>function(o){const r=f.apply(this,arguments);if(S.edu.stage==='middel'||S.edu.stage==='basis')row(o,{ic:'👩‍🏫',t:S.edu.stage==='basis'?'Je juf of meester':'Je docenten',s:'Wie geeft welk vak · extra uitleg vragen',on:()=>openSheet('Docenten',sheetDocs,true)});return r})(schoolLifeRow);
gradesYear=(f=>function(E){const x=E.xtra||{};const r=f.apply(this,arguments);for(const v of Object.keys(x))if(E.gr&&E.gr[v]!=null)E.gr[v]=clampG(E.gr[v]+.35);E.xtra={};return r})(gradesYear);
function schoolYear10(){const E=S.edu;if(E.stage!=='middel'||!E.gr||E.skip||inJail())return;const v=Object.values(E.gr);if(!v.length)return;const avg=v.reduce((a,b)=>a+b,0)/v.length;
  if(avg>=8.4&&S.st.smarts>=82&&E.yrs>=1&&E.yrs<E.len-2&&chance(.5)&&typeof fmFree==='function'&&fmFree()){fmTake();Q.push({id:'w10_overslaan',c:{}})}}
E('w10_overslaan',{sys:1,need:()=>S.edu.stage==='middel'&&!S.edu.skip,t:'Een klas overslaan?',x:'Je mentor vindt dat je je verveelt in de klas. De school stelt voor dat je een jaar overslaat.',ch:[
 ['🚀 Ja, overslaan',()=>{const E=S.edu;E.skip=1;E.yrs++;sma(2);hap(2);MS('Sloeg een klas over',1);return 'Je zit ineens bij oudere leerlingen. Even wennen, maar het gaat goed.'}],
 ['🙂 Liever bij je vrienden blijven',()=>{S.edu.skip=1;hap(2);return 'Je blijft in je eigen klas. Je mentor geeft je wat extra uitdaging.'}]]});
EVMETA.w10_overslaan=['School','🚀'];

// ---------- 10.7 studie: stage en een semester in het buitenland ----------
function f10StudyRows(el,c){if(!c||!c.f||inJail())return;const s=sec(el,'Verder in je studie');const cp=S.cpi||1;
  if(c.y>=1&&!c.stage){const p=pathOf(c.f,c.ty)[0];row(s,{ic:'🧑‍💼',t:'Stage lopen',s:p?`Bij een ${JOB(p[0]).lad[0].toLowerCase()} in de praktijk`:'Ervaring opdoen in de praktijk',on:()=>doAct('Stage',()=>{c.stage=1;c.perf=clamp(c.perf+4);sk('sociaal',2);if(p&&chance(.45)){S.flags.stage10={id:p[0],lvl:p[1],co:company()};return `Een leerzame stage bij ${S.flags.stage10.co}. Aan het eind zeggen ze: "Kom na je diploma maar bij ons werken."`}return 'Een leerzame stage. Je weet nu beter wat je later wilt.'},true,'🧑‍💼')})}
  if(c.y>=1&&!c.abroad){const k=Math.round(3000*cp);row(s,{ic:'🌍',t:'Een semester in het buitenland',s:`Ongeveer ${fmt(k)} extra`,dis:S.money<k,on:()=>doAct('Buitenland',()=>{c.abroad=1;cash(-k);hap(7);sma(2);sk('sociaal',3);if(chance(.35))addFriend();return `Een half jaar in ${pick(['Barcelona','Stockholm','Lissabon','Praag','Montréal','Melbourne'])}. Je leert een nieuwe taal en een hoop nieuwe mensen kennen.`},true,'🌍')})}}
studyRows=(f=>function(el,c){const r=f.apply(this,arguments);safe(()=>f10StudyRows(el,c));return r})(studyRows);
function stageYear(){const st=S.flags.stage10;if(!st||S.edu.cur||inJail())return;if(!S.job&&ageY()<35&&JOB(st.id)){setJob(st.id,Math.min(st.lvl||0,JOB(st.id).lad.length-1),st.co);L(`🧑‍💼 Je stagebedrijf ${st.co} neemt je aan als ${jobTitle().toLowerCase()}.`,'good');hap(5)}S.flags.stage10=null}

F8.year.push(()=>{if(!S.alive)return;workYear();schoolYear10();stageYear()});

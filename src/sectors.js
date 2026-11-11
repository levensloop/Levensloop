/* ---------- vakgebieden: elke opleiding leidt naar een eigen soort werk ---------- */
const SECN={ict:'ICT',techniek:'Techniek',bouw:'Bouw',zakelijk:'Zakelijk',juridisch:'Juridisch',zorg:'Zorg',horeca:'Horeca',onderwijs:'Onderwijs',creatief:'Creatief',media:'Media',veiligheid:'Veiligheid',sport:'Sport',wetenschap:'Wetenschap',algemeen:'Algemeen'};
const STUDYSEC={informatica:'ict',techniek:'techniek',elektro:'techniek',bouwkunde:'bouw',bedrijfskunde:'zakelijk',economie:'zakelijk',rechten:'juridisch',verpleeg:'zorg',geneeskunde:'zorg',psychologie:'zorg',hotel:'horeca',koken:'horeca',leraar:'onderwijs',kunst:'creatief',kapper:'creatief',muziek:'creatief',communicatie:'media',journalistiek:'media',politie:'veiligheid',sport:'sport',biologie:'wetenschap'};
for(const s of STUDIES)s.sec=STUDYSEC[s.id]||'algemeen';

// nieuwe banen (np = alleen bereikbaar via een passende opleiding of ervaring)
const NEWJOBS=[
 {id:'sysbeheer',lad:['Servicedesk-medewerker','Systeembeheerder','ICT-manager'],sal:[30,42,68],req:{age:[18,99]},np:1,sk:'tech',em:'🖥️',g:'tech'},
 {id:'bouwteken',lad:['Bouwkundig tekenaar','Werkvoorbereider','Hoofd werkvoorbereiding'],sal:[32,40,55],req:{age:[18,99]},np:1,sk:'tech',em:'📐',g:'tech'},
 {id:'projbouw',lad:['Assistent-projectleider','Projectleider bouw','Senior projectleider','Directeur bouwbedrijf'],sal:[40,55,72,120],req:{age:[21,99]},np:1,sk:'zaken',em:'👷',g:'kantoor'},
 {id:'admin',lad:['Administratief medewerker','Office manager','Hoofd administratie'],sal:[28,38,52],req:{age:[18,99]},np:1,em:'🗂️',g:'kantoor'},
 {id:'jurist',lad:['Juridisch medewerker','Bedrijfsjurist','Senior bedrijfsjurist','Juridisch directeur'],sal:[34,52,70,120],req:{age:[20,99],clean:1},np:1,sk:'sociaal',em:'📑',g:'kantoor'},
 {id:'notaris',lad:['Notarisklerk','Kandidaat-notaris','Notaris'],sal:[36,60,140],req:{age:[20,99],clean:1},np:1,em:'🖋️',g:'kantoor'},
 {id:'ggz',lad:['Ggz-begeleider','Ggz-agoog','Teamleider ggz'],sal:[32,40,55],req:{age:[20,99]},np:1,sk:'sociaal',em:'🫂',g:'zorg'},
 {id:'banket',lad:['Banketbakker','Chef-patissier','Eigenaar patisserie'],sal:[27,40,58],req:{age:[18,99]},np:1,sk:'koken',em:'🧁',g:'horeca'},
 {id:'bijles',lad:['Bijlesdocent','Eigenaar bijlesinstituut'],sal:[30,58],req:{age:[20,99]},np:1,sk:'sociaal',em:'📖',g:'onderwijs'},
 {id:'fotograaf',lad:['Fotograaf','Bekend fotograaf'],sal:[28,70],req:{age:[18,99]},np:1,sk:'kunst',em:'📷',g:'tech'},
 {id:'visagist',lad:['Visagist','Hoofd visagie'],sal:[26,40],req:{age:[18,99]},np:1,sk:'kunst',em:'💄'},
 {id:'muziekdocent',lad:['Muziekdocent','Hoofd muziekschool'],sal:[36,55],req:{age:[20,99]},np:1,sk:'muziek',em:'🎼',g:'onderwijs'},
 {id:'orkest',lad:['Orkestmusicus','Concertmeester','Dirigent'],sal:[40,55,95],req:{age:[20,99]},np:1,sk:'muziek',em:'🎻'},
 {id:'socialmedia',lad:['Social media-medewerker','Contentmanager','Hoofd online'],sal:[28,40,62],req:{age:[18,99]},np:1,sk:'kunst',em:'📲',g:'kantoor'},
 {id:'woordvoerder',lad:['Woordvoerder','Hoofd communicatie','Communicatiedirecteur'],sal:[45,65,115],req:{age:[21,99]},np:1,sk:'sociaal',em:'🎙️',g:'kantoor'},
 {id:'pt',lad:['Sportinstructeur','Personal trainer','Eigenaar sportschool'],sal:[26,38,60],req:{age:[18,99]},np:1,sk:'sport',em:'🏋️'},
 {id:'gymdocent',lad:['Gymdocent','Sectieleider LO'],sal:[40,52],req:{age:[21,99]},np:1,sk:'sport',em:'🤸',g:'onderwijs'},
 {id:'coach',lad:['Sportcoach','Hoofdtrainer','Bondscoach'],sal:[38,58,140],req:{age:[21,99]},np:1,sk:'sport',em:'📋',g:'onderwijs'},
 {id:'lab',lad:['Laborant','Onderzoeker','Senior onderzoeker','Labmanager'],sal:[34,48,62,80],req:{age:[20,99]},np:1,em:'🧪',g:'tech'},
 {id:'milieu',lad:['Milieuadviseur','Senior milieuadviseur','Directeur milieudienst'],sal:[40,55,90],req:{age:[21,99]},np:1,em:'🌿',g:'kantoor'}];
for(const j of NEWJOBS){JOBS.splice(JOBS.findIndex(x=>x.id==='politiek'),0,j);if(j.g&&JGROUP[j.g])JGROUP[j.g].push(j.id)}
// ingenieur krijgt een junior-trede, zodat hbo en universiteit verschillend instromen
{const ing=JOB('ingenieur');if(ing.lad[0]!=='Junior ingenieur'){ing.lad.unshift('Junior ingenieur');ing.sal.unshift(42);ing.req.e=5}}

const JOBSEC={krant:'algemeen',oppas:'algemeen',vakken:'algemeen',kassa:'algemeen',afwas:'algemeen',bezorg:'algemeen',bedien:'algemeen',schoon:'algemeen',magazijn:'algemeen',call:'algemeen',bouw:'algemeen',beveil:'algemeen',taxi:'algemeen',vracht:'algemeen',
 kok:'horeca',hotel:'horeca',soldaat:'veiligheid',politie:'veiligheid',sales:'zakelijk',makelaar:'zakelijk',marketing:'zakelijk',accountant:'zakelijk',hr:'zakelijk',consultant:'zakelijk',bankier:'zakelijk',
 verpleeg:'zorg',arts:'zorg',psycholoog:'zorg',elektro:'techniek',monteur:'techniek',ingenieur:'techniek',kapper:'creatief',designer:'creatief',leraar:'onderwijs',dev:'ict',journalist:'media',architect:'bouw',advocaat:'juridisch',rechter:'juridisch',
 wetensch:'wetenschap',politiek:'algemeen',muzikant:'creatief',acteur:'creatief',model:'creatief',voetbal:'sport',schrijver:'creatief',
 sysbeheer:'ict',bouwteken:'bouw',projbouw:'bouw',admin:'zakelijk',jurist:'juridisch',notaris:'juridisch',ggz:'zorg',banket:'horeca',bijles:'onderwijs',fotograaf:'creatief',visagist:'creatief',muziekdocent:'creatief',orkest:'creatief',socialmedia:'media',woordvoerder:'media',pt:'sport',gymdocent:'sport',coach:'sport',lab:'wetenschap',milieu:'wetenschap'};
for(const j of JOBS)j.sec=JOBSEC[j.id]||'algemeen';

// studie → niveau → [baan, startniveau]. Eén bron voor: toegang, startpositie en "Leidt tot".
const PATHS={
 informatica:{mbo:[['sysbeheer',0],['dev',0]],hbo:[['dev',0],['sysbeheer',1]],wo:[['dev',1],['consultant',0],['sysbeheer',1]]},
 techniek:{mbo:[['monteur',0],['elektro',0]],hbo:[['ingenieur',0],['monteur',1]],wo:[['ingenieur',1],['consultant',0]]},
 elektro:{mbo:[['elektro',0],['monteur',0]],hbo:[['ingenieur',0],['elektro',1]]},
 bouwkunde:{mbo:[['bouwteken',0],['bouw',1]],hbo:[['architect',0],['projbouw',0],['bouwteken',1]],wo:[['architect',1],['projbouw',1]]},
 bedrijfskunde:{mbo:[['admin',0],['sales',0]],hbo:[['marketing',0],['accountant',0],['hr',0],['sales',1],['admin',1]],wo:[['consultant',0],['bankier',0],['marketing',1],['accountant',1],['hr',0]]},
 economie:{hbo:[['accountant',0],['marketing',0],['sales',1],['admin',1]],wo:[['consultant',0],['bankier',0],['accountant',1]]},
 rechten:{hbo:[['jurist',0],['notaris',0]],wo:[['advocaat',0],['jurist',1],['notaris',1],['consultant',0]],master:[['rechter',0],['advocaat',1],['notaris',1]]},
 verpleeg:{mbo:[['verpleeg',0],['ggz',0]],hbo:[['verpleeg',1],['ggz',1]]},
 geneeskunde:{wo:[['arts',0],['lab',1]]},
 psychologie:{hbo:[['hr',0],['ggz',0]],wo:[['psycholoog',0],['hr',0],['ggz',1]]},
 hotel:{mbo:[['hotel',0],['kok',0]],hbo:[['hotel',2],['sales',1]]},
 koken:{mbo:[['kok',1],['banket',0]]},
 leraar:{hbo:[['leraar',0],['bijles',0]]},
 kunst:{hbo:[['designer',0],['fotograaf',0]]},
 kapper:{mbo:[['kapper',0],['visagist',0]]},
 muziek:{hbo:[['muziekdocent',0],['orkest',0],['muzikant',1]]},
 communicatie:{mbo:[['socialmedia',0],['sales',0]],hbo:[['marketing',0],['journalist',0],['woordvoerder',0],['designer',0],['socialmedia',1]],wo:[['marketing',1],['journalist',1],['woordvoerder',0]]},
 journalistiek:{hbo:[['journalist',0],['woordvoerder',0]]},
 politie:{mbo:[['politie',0],['beveil',1]]},
 sport:{mbo:[['pt',0],['beveil',0]],hbo:[['gymdocent',0],['coach',0],['pt',1]]},
 biologie:{wo:[['lab',0],['milieu',0]],master:[['lab',1],['milieu',1]],phd:[['wetensch',0],['lab',2]]}};
const TYR={mbo:4,hbo:5,wo:6,master:7,phd:8};
// banen die je via een diploma bereikt, per niveau; master/promotie vallen terug op het niveau eronder (+1)
function pathOf(f,ty){const P=PATHS[f];if(!P)return [];if(P[ty])return P[ty];if(ty==='master'&&P.wo)return P.wo.map(([j,l])=>[j,l+1]);if(ty==='phd')return pathOf(f,'master');return []}
// de opleiding geeft automatisch toegang: oude f-eisen worden vervangen door de paden
for(const j of JOBS){const via=[];for(const f in PATHS)for(const ty in PATHS[f])for(const [id] of PATHS[f][ty])if(id===j.id)via.push([f,ty]);j.via=via;
  if(via.length&&(j.req.f||j.np)){j.np=1;j.minTy=Math.min(...via.map(([,ty])=>TYR[ty]))}}
const secOfStudy=f=>STUDYSEC[f]||'algemeen';
function mySectors(){return [...new Set(S.edu.deg.filter(d=>d.f).map(d=>secOfStudy(d.f)))]}
// jaren ervaring per sector (ook uit oude saves: afgeleid van de functietitels)
function expYears(sec){let y=0;for(const h of S.jobs||[]){const j=JOBS.find(x=>x.lad.includes(h.t));if(j&&j.sec===sec&&!j.part)y+=h.y||0}if(S.job&&S.job.id!=='prosport'){const j=JOB(S.job.id);if(j&&j.sec===sec&&!j.part)y+=S.job.yrs}return y}
const expSectors=()=>Object.keys(SECN).filter(s=>s!=='algemeen'&&expYears(s)>=5);
// via een eigen diploma bereikbaar (ook als die baan formeel in een andere sector valt)
const viaDeg=j=>S.edu.deg.some(d=>d.f&&pathOf(d.f,d.ty).some(([id])=>id===j.id));
const degSec=j=>viaDeg(j)||(j.sec!=='algemeen'&&mySectors().includes(j.sec));
const inMySector=j=>degSec(j)||(j.sec!=='algemeen'&&expSectors().includes(j.sec));
// beste startpositie voor een baan: {lvl, why} of null
function startFor(j){let best=null;
  for(const d of S.edu.deg){if(!d.f)continue;for(const [id,l] of pathOf(d.f,d.ty))if(id===j.id){const lvl=Math.min(l,j.lad.length-1);if(!best||lvl>best.lvl)best={lvl,d}}}
  if(best){const st=STUDIES.find(s=>s.id===best.d.f);best.why=`je ${ENAME[best.d.ty]||best.d.ty}-diploma ${st?st.t:''}`.trim();return best}
  if(j.np&&j.minTy<=5&&expYears(j.sec)>=5)return {lvl:0,why:`${expYears(j.sec)} jaar ervaring in ${SECN[j.sec].toLowerCase()}`,exp:1};
  if(j.np&&j.alt&&S.sk[j.alt[0]]>=j.alt[1])return {lvl:0,why:`je ${SKN[j.alt[0]].toLowerCase()}-vaardigheid`};
  return null}
function pathNeed(j){const by={};for(const [f,ty] of j.via)(by[ty]=by[ty]||[]).push(STUDIES.find(s=>s.id===f).t);const ty=Object.keys(by).sort((a,b)=>TYR[a]-TYR[b])[0];
  return `${{mbo:'mbo',hbo:'hbo',wo:'universitair',master:'master',phd:'promotie'}[ty]}-diploma ${[...new Set(by[ty])].slice(0,3).join(' of ')}`}
// "Leidt tot" voor het studiekeuzescherm
function leadsTo(f,ty){const p=pathOf(f,ty).map(([id,l])=>{const j=JOB(id);const lv=Math.min(l,j.lad.length-1);return {j,lv,s:j.sal[lv]}});if(!p.length)return '';
  const first=p[0],ttl=[first.j.lad[first.lv]];if(first.j.lad.length-1>first.lv)ttl.push(first.j.lad[first.j.lad.length-1]);
  const rest=p.slice(1,3).map(x=>x.j.lad[x.lv]);const sal=p.map(x=>x.s);
  const c=S.cpi||1;return `Leidt tot: ${ttl.join(' → ')}${rest.length?', '+rest.join(', '):''} · start ${fmt(Math.min(...sal)*1000*c)}–${fmt(Math.max(...sal)*1000*c)}`}
const NJEM=Object.fromEntries(NEWJOBS.map(j=>[j.id,j.em]));
// sollicitatievragen per sector
const SECQ={
 ict:[['Een collega pusht code zonder test. Wat doe je?',[['Ik vraag of we samen tests schrijven.',2],['Ik draai het stilletjes terug.',0],['Niks, niet mijn probleem.',1]]]],
 techniek:[['Een machine valt uit tijdens een spoedklus. Wat doe je?',[['Eerst veilig stilzetten, dan de oorzaak zoeken.',2],['Er hard op slaan.',0],['De monteur van dienst bellen en wachten.',1]]]],
 bouw:[['De planning loopt een week uit. Wat doe je?',[['Ik overleg met de opdrachtgever en pas de planning aan.',2],['Gewoon harder doorwerken en niks zeggen.',0],['Ik geef de leverancier de schuld.',1]]]],
 zakelijk:[['Een klant dreigt weg te gaan. Wat doe je?',[['Ik bel en vraag wat er beter kan.',2],['Ik bied meteen 50% korting.',0],['Ik laat het aan mijn manager.',1]]]],
 juridisch:[['Een cliënt wil dat je iets weglaat in een dossier. Wat doe je?',[['Ik leg uit dat ik dat niet mag en waarom.',2],['Dat doe ik, de klant is koning.',0],['Ik doe of ik het niet hoorde.',1]]]],
 zorg:[['Een patiënt weigert zijn medicijnen. Wat doe je?',[['Ik vraag rustig waarom en overleg met de arts.',2],['Ik stop ze door zijn eten.',0],['Ik noteer het en ga door.',1]]]],
 horeca:[['Er komt een bord terug: "koud". Wat doe je?',[['Excuses, direct een nieuw bord en iets extra\'s.',2],['Even in de magnetron.',0],['Ik zeg dat het zo hoort.',1]]]],
 onderwijs:[['Een leerling verstoort steeds de les. Wat doe je?',[['Na de les een gesprek: wat is er aan de hand?',2],['De gang op, elke les weer.',1],['Ik negeer het.',0]]]],
 creatief:[['Een klant vindt je ontwerp lelijk. Wat doe je?',[['Ik vraag wat er niet werkt en maak twee nieuwe versies.',2],['Ik leg uit dat hij geen smaak heeft.',0],['Ik doe precies wat hij zegt.',1]]]],
 media:[['Je krijgt een sappige tip, maar maar één bron. Wat doe je?',[['Eerst een tweede bron zoeken.',2],['Meteen publiceren, wie eerst komt...',0],['Ik vraag mijn chef.',1]]]],
 veiligheid:[['Iemand wordt agressief bij de ingang. Wat doe je?',[['Rustig blijven praten en afstand houden.',2],['Meteen terugduwen.',0],['Collega\'s roepen en wachten.',1]]]],
 sport:[['Een sporter wil met een blessure toch spelen. Wat doe je?',[['Eerst de fysio laten kijken.',2],['Laten spelen, het is een finale.',0],['Hem zelf laten kiezen.',1]]]],
 wetenschap:[['Je meting klopt niet met je hypothese. Wat doe je?',[['Opnieuw meten en het eerlijk rapporteren.',2],['De meting een beetje aanpassen.',0],['De proef laten voor wat hij is.',1]]]]};

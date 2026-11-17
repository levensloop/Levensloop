/* ================= FASE 8.7: SPOOKHUIZEN EN EXOTISCHE HUISDIEREN =================
   Sommige oude huizen op de markt zijn goedkoop omdat "de vorige bewoners halsoverkop vertrokken".
   Woon je er, dan gebeuren er rare dingen. Je kunt de geest verjagen of helpen rust te vinden.
   Met Chaos op "Rustig" blijkt er altijd een nuchtere verklaring te zijn.
   p.ghost = {g:<index in GHOSTS>, lvl:1-3, rel:0-100, clue:0-3, rest:0|1|2 (1 = verjaagd, 2 = in vrede), nu:1 = nuchter verklaard} */
const GHOSTS=[
  {n:'Kapitein Elias',d:'een kapitein die in 1887 niet terugkwam van zee',w:'zijn kompas',it:['🧭','Het kompas van kapitein Elias'],sign:'Er hangt een geur van zout water in de gang, en de deur van de kelder klapt steeds open.'},
  {n:'Adelheid',d:'een pianolerares die hier tot 1923 lesgaf',w:'haar muziekdoosje',it:['🎼','De muziekdoos van Adelheid'],sign:'\'s Nachts hoor je pianomuziek, terwijl er geen piano in huis staat.'},
  {n:'De kleine Pim',d:'een jongetje dat hier rond 1910 woonde',w:'zijn houten tol',it:['🪀','De houten tol van Pim'],sign:'Je vindt knikkers op de trap die er gisteren nog niet lagen.'},
  {n:'Bertus de bakker',d:'de bakker die hier tot 1952 zijn bakkerij had',w:'zijn geheime recept',it:['📜','Het broodrecept van Bertus'],sign:'Om vier uur \'s nachts ruikt het hele huis naar vers brood.'},
  {n:'Mathilde',d:'een bruid die verdween op de avond van haar bruiloft in 1898',w:'haar trouwring',it:['💍','De trouwring van Mathilde'],sign:'In de spiegel op de overloop zie je soms een witte sluier.'}];
const ghostOf=p=>p&&p.ghost&&GHOSTS[p.ghost.g];
const homeProp=()=>S.home.k==='eigen'?pp(S.home.pid):null;
const hauntedHome=()=>{const h=homeProp();return h&&h.ghost&&!h.ghost.rest?h:null};
// spookhuizen op de huizenmarkt
if(typeof mkListing==='function'){mkListing=(f=>function(ci){const h=f(ci);if(!h||HCAT[h.cat]&&HCAT[h.cat][5])return h;const pr=h.yr<1930?.12:h.yr<1970?.05:.015;
  if(chance(pr)){h.ghost={g:ri(0,GHOSTS.length-1),lvl:ri(1,3),rel:30,clue:0,rest:0};h.price=Math.round(h.price*.8/1000)*1000;h.feat=h.feat.concat(['De vorige bewoners vertrokken halsoverkop'])}return h})(mkListing)}
if(typeof buyHouse==='function'){buyHouse=(f=>function(h,mort){const p=f(h,mort);if(p&&h.ghost)p.ghost=Object.assign({},h.ghost);return p})(buyHouse)}
if(typeof sheetProp==='function'){sheetProp=(f=>function(el,p){f(el,p);if(S.props.includes(p)&&p.ghost&&!p.ghost.nu)safe(()=>ghostRows(el,p))})(sheetProp)}
function ghostRows(el,p){const G=ghostOf(p),X=p.ghost,home=S.home.pid===p.id;
  if(X.rest){card(el,`<span class="muted">${X.rest===2?`👻 ${he(G.n)} heeft rust gevonden. Soms ruikt het nog heel even naar ${X.g===3?'brood':X.g===0?'zee':'vroeger'}.`:'👻 De geest is verjaagd. Het is stil in huis. Bijna te stil.'}</span>`);return}
  card(el,`<h3>👻 Het spookt hier</h3><p class="muted" style="margin:0 0 6px">${X.clue>=1?`De geest is ${he(G.n)}, ${he(G.d)}.`:'Je weet nog niet wie het is.'}${X.clue>=2?` ${cap(f8Hij(X.g===1||X.g===4?'v':'m'))} zoekt ${he(G.w)}.`:''}</p><div class="stat"><span>Hoe de geest over je denkt</span><span></span><span class="v">${Math.round(X.rel)}%</span>${bar(X.rel)}</div>`);
  if(!home){empty(sec(el,''),'Je woont hier niet zelf. De huurders klagen soms over geluiden.');return}
  const s=sec(el,'Spoken');const cp=S.cpi||1;
  row(s,{ic:'🔮',t:'Een medium inhuren',s:S.acts.gmed?'Dit jaar al gedaan':fmt(Math.round(400*cp)),dis:!!S.acts.gmed||S.money<400*cp,on:()=>doAct('Medium',()=>{S.acts.gmed=1;cash(-Math.round(400*cp));X.clue=Math.min(3,X.clue+1);X.rel=clamp(X.rel+5);
    return X.clue===1?`Het medium sluit haar ogen. "Er is hier iemand. ${G.n}. ${cap(G.d)}."`:X.clue===2?`Het medium fluistert: "${G.n} is iets kwijt. ${cap(G.w)}. Zolang dat zoek is, blijft ${f8Hij(X.g===1||X.g===4?'v':'m')} hier."`:'Het medium voelt dat de geest je begint te vertrouwen.'},true,'🔮')});
  row(s,{ic:'🕯️',t:'Met de geest praten',s:'Een seance bij kaarslicht',dis:!!S.acts.gsea,on:()=>doAct('Seance',()=>{S.acts.gsea=1;if(chance(.55+S.karma/400)){X.rel=clamp(X.rel+12);if(X.clue<1)X.clue=1;return pick(['De kaarsen flakkeren. Op de beslagen spiegel verschijnt één woord: "dank".','Je hoort een zachte zucht. Het voelt niet eng, eerder verdrietig.'])}X.rel=clamp(X.rel-6);hap(-3);return 'Alle kaarsen gaan tegelijk uit. Je slaapt die nacht bij de buren.'},true,'🕯️')});
  if(X.clue>=2)row(s,{ic:'🔦',t:`Zoeken naar ${G.w}`,s:'Minigame · helpt de geest rust te vinden',dis:!!S.acts.gzoek,dots:true,on:()=>mgMemory('Zoektocht',`Onthoud de volgorde van de plekken waar ${G.n} je naartoe leidt.`,4+X.lvl,ok=>doAct('Zoektocht',()=>{S.acts.gzoek=1;if(!ok&&X.rel<70){X.rel=clamp(X.rel+4);return 'Je zoekt de hele zolder af. Niets. Maar je voelt dat de geest blij is dat je het probeert.'}
    X.rest=2;p.value=Math.round(p.value*1.15);kar(8);hap(10);if(typeof coll==='function')coll().it.push({id:uid(),k:'erf',t:'spook',n:G.it[1],em:G.it[0],v:ri(800,6000),known:0,gen:1,from:`gevonden in je huis aan de ${p.addr}, waar ${G.n} rondwaarde`,y:year()});
    MS(`Hielp de geest van ${G.n} rust te vinden`,2);S.flags.spookrust=1;return `Onder een losse plank vind je ${G.w}. Je legt het op tafel. Er waait een warme wind door het huis, en dan is het stil. ${G.n} heeft rust gevonden.${typeof coll==='function'?' Je bewaart het als erfstuk.':''}`},true,'🔦'))});
  row(s,{ic:'🧹',t:'Spokenjagers inhuren',s:fmt(Math.round(2500*cp)),dis:S.money<2500*cp||!!S.acts.gjag,dots:true,on:()=>doAct('Spokenjagers',()=>{S.acts.gjag=1;cash(-Math.round(2500*cp));if(chance(.75-X.lvl*.15)){X.rest=1;p.value=Math.round(p.value*1.1);S.flags.spookjager=1;MS('Liet een spook verjagen',1);return 'Drie mannen in overalls lopen met piepende kastjes door je huis. Na een flits en een harde knal is het stil. Voorgoed.'}X.rel=clamp(X.rel-20);X.lvl=Math.min(3,X.lvl+1);return 'De spokenjagers rennen na tien minuten gillend naar buiten. De geest is nu boos.'},true,'🧹')});
  row(s,{ic:'🎟️',t:'Spookrondleidingen geven',s:'Geld verdienen aan je spook',dis:!!S.acts.gtour,on:()=>doAct('Rondleiding',()=>{S.acts.gtour=1;const g=Math.round(ri(400,2500)*X.lvl*cp);cash(g);X.rel=clamp(X.rel-10);S.fame=clamp(S.fame+1);return `Dertig mensen met zaklampen schuifelen door je huis. Kassa: ${fmt(g)}. De geest vindt het niet leuk.`},true,'🎟️')})}
F8.year.push(a=>{const h=hauntedHome();if(!h||inJail())return;const X=h.ghost;
  if(S.settings.chaos===0&&!X.nu&&!Q.some(q=>q.id==='spk_nuchter')){Q.push({id:'spk_nuchter'});return}
  hap(-ri(0,2));if(X.rel>=80&&chance(.3)){hap(3);L(`${ghostOf(h).n} legt een bloemetje op je kussen. Een vreemde huisgenoot, maar een lieve.`,'sys')}
  if(chance(.65)&&!Q.some(q=>/^spk_/.test(q.id)))Q.push({id:pick(['spk_teken','spk_verschijning','spk_bezoek'])})});
E('spk_nuchter',{sys:1,need:()=>!!hauntedHome(),t:'Rare geluiden',x:()=>`${GHOSTS[hauntedHome().ghost.g].sign} De buren zeggen dat het spookt.`,
  ch:[['🔦 Zelf op onderzoek',()=>{const h=hauntedHome();h.ghost.nu=1;h.ghost.rest=1;return pick(['Op zolder woont een familie marters. Een ongediertebestrijder lost het op.','Het blijkt de cv-ketel. Een monteur zet hem goed en het is stil.','Een kapotte dakpan laat de wind fluiten. Een dakdekker repareert het.'])}]]});
E('spk_teken',{sys:1,need:()=>!!hauntedHome(),t:'Er spookt iets',x:()=>GHOSTS[hauntedHome().ghost.g].sign,
  ch:[['👋 Vriendelijk "goedenavond" zeggen',()=>{const X=hauntedHome().ghost;X.rel=clamp(X.rel+8);return 'Het wordt even stil. Dan klinkt er zacht gekraak, bijna als een antwoord.'}],
   ['😱 Wegrennen',()=>{hap(-4);return 'Je slaapt in de auto. Om drie uur \'s nachts hoor je toch weer iets.'}],
   ['📸 Filmen',()=>{if(chance(.4)){S.fame=clamp(S.fame+4);return 'Op de beelden zie je een schim. Het filmpje gaat viraal.'}return 'Op de beelden zie je alleen jezelf in pyjama.'}]]});
E('spk_verschijning',{sys:1,need:()=>!!hauntedHome(),t:'Een verschijning',x:()=>{const X=hauntedHome().ghost;return `Aan het voeteneind van je bed staat ${X.clue>=1?GHOSTS[X.g].n:'een doorschijnende gestalte'}. ${X.rel>=60?'Het lijkt te glimlachen.':'Het kijkt je strak aan.'}`},
  ch:[['💬 Vragen wat er nodig is',()=>{const X=hauntedHome().ghost;if(chance(.4+X.rel/200)){X.clue=Math.min(3,X.clue+1);return X.clue>=2?`Een stem fluistert: "${GHOSTS[X.g].w}..."`:`Een stem fluistert een naam: "${GHOSTS[X.g].n}".`}return 'Het verdwijnt zonder iets te zeggen.'}],
   ['🙈 Onder de dekens',()=>{hap(-3);return 'Je telt tot duizend. Als je weer kijkt, is het weg.'}]]});
E('spk_bezoek',{sys:1,need:()=>!!hauntedHome()&&living(['vriend','partner','moeder','vader']).length>0,ctx:()=>ctxP(pick(living(['vriend','partner','moeder','vader']))),t:'Een logé',x:c=>`${Pe(c).first} blijft logeren. Midden in de nacht staat ${f8Hij(Pe(c).g)} lijkbleek in je slaapkamer.`,
  ch:[['😅 Lachen dat het "gewoon het huis" is',c=>{rel_(Pe(c),-3);return `${Pe(c).first} vertrekt voor het ontbijt en komt nooit meer logeren.`}],
   ['👻 Eerlijk vertellen dat het spookt',c=>{if(chance(.5)){rel_(Pe(c),6);return `${Pe(c).first} vindt het geweldig en wil de volgende keer een seance.`}rel_(Pe(c),-6);return `${Pe(c).first} kijkt je aan alsof je gek bent.`}]]});

/* ---------- exotische huisdieren ---------- */
const EU_=['NL','BE','DE','FR','IT','ES'];
// [soort, icoon, naam, prijs, levensduur, gevaar 0-3, regel per land: 'vrij' | 'verg' (vergunning) | 'verboden', groot dier (tuin nodig)]
const EXO=[['koningspython','🐍','Koningspython',300,[20,30],0,()=>'vrij'],['leguaan','🦎','Groene leguaan',250,[12,20],0,()=>'vrij'],['vogelspin','🕷️','Vogelspin',80,[10,20],1,()=>'vrij'],
  ['uil','🦉','Uil',1500,[15,25],1,()=>'verg'],['alpaca','🦙','Alpaca',2500,[15,20],0,()=>'vrij',1],['flamingo','🦩','Flamingo',2500,[25,40],0,()=>'verg',1],['wasbeer','🦝','Wasbeer',1500,[10,15],1,cc=>EU_.includes(cc)?'verboden':'verg'],
  ['wallaby','🦘','Wallaby',4000,[12,15],1,()=>'verg',1],['stinkdier','🦨','Stinkdier',900,[8,12],1,cc=>['NL','BE'].includes(cc)?'verboden':'verg'],['luiaard','🦥','Luiaard',7000,[20,30],0,()=>'verg'],
  ['doodshoofdaapje','🐒','Doodshoofdaapje',6000,[15,20],2,cc=>EU_.includes(cc)||cc==='UK'?'verboden':'verg'],['krokodil','🐊','Krokodil',5000,[40,60],3,cc=>['US','ZA','AU'].includes(cc)?'verg':'verboden',1],
  ['pinguin','🐧','Pinguïn',9000,[15,25],0,()=>'verboden',1],['tijger','🐅','Tijger',15000,[15,20],3,cc=>['US','MX'].includes(cc)?'verg':'verboden',1]];
for(const x of EXO)PETEM[x[0]]=x[1];
const exoOf=sp=>EXO.find(x=>x[0]===sp);
const exoLaw=x=>x[6](S.p.country);
const hasGarden=()=>{const h=homeProp();return !!h&&(htOf(h.name).tuin||['Boerderij','Villa','Landgoed','Vrijstaande woning','Twee-onder-een-kap'].includes(h.name))};
function exoRows(el){const a=ageY();const s=sec(el,'Exotische dieren');if(a<18){empty(s,'Exotische dieren kun je vanaf 18 jaar kopen.');return}
  for(const x of EXO){const law=exoLaw(x),pr=Math.round(x[3]*(S.cpi||1)),big=x[7]&&!hasGarden(),perm=S.flags['verg_'+x[0]];
    row(s,{ic:x[1],t:x[2],s:big?'Je hebt een huis met tuin nodig':law==='vrij'?`${fmt(pr)}${x[5]>=2?' · gevaarlijk':''}`:law==='verg'?(perm?`${fmt(pr)} · vergunning in orde`:'Eerst een vergunning aanvragen'):'Verboden in dit land · alleen via de zwarte markt',dis:big,dots:true,on:()=>exoBuy(x)})}}
function exoBuy(x){const law=exoLaw(x),pr=Math.round(x[3]*(S.cpi||1));
  if(law==='verg'&&!S.flags['verg_'+x[0]]){const k=Math.round(500*(S.cpi||1));modal({title:'Vergunning aanvragen',em:'📋',cat:x[2],text:`Voor een ${x[2].toLowerCase()} heb je een vergunning nodig. Aanvragen kost ${fmt(k)}. Een inspecteur komt kijken of je het dier goed kunt houden.`,choices:opts([{t:'📋 Aanvragen',cls:'go',dis:S.money<k,on:()=>{closeModal();doAct('Vergunning',()=>{if(S.acts['vg'+x[0]])return 'Je aanvraag ligt nog bij de gemeente.';S.acts['vg'+x[0]]=1;cash(-k);if(chance(hasGarden()?.75:.45)){S.flags['verg_'+x[0]]=1;return `De vergunning is rond. Je mag een ${x[2].toLowerCase()} houden.`}return 'De inspecteur vindt je huis niet geschikt. Afgewezen.'},true,'📋')}}])});return}
  if(law==='verboden'){modal({title:'De zwarte markt',em:'🕶️',cat:x[2],text:`Een ${x[2].toLowerCase()} is in ${COUNTRIES[S.p.country].n} verboden. Via een louche handelaar kan het toch, voor ${fmt(pr*2)}. Als het uitkomt, wordt het dier afgepakt en krijg je een boete.`,choices:opts([{t:'🕶️ Toch kopen',cls:'bad',dis:S.money<pr*2,on:()=>{closeModal();exoName(x,pr*2,true)}}])});return}
  exoName(x,pr,false)}
function exoName(x,pr,ill){const n=pick(['Koning','Sissi','Diesel','Prinses','Mango','Bonzo','Zorro','Pluis','Kiki','Rambo','Sultan','Toffee']);
  modal({title:'Hoe heet je dier?',em:x[1],cat:x[2],text:fmt(pr),html:`<input class="inp" id="exn" maxlength="20" value="${he(n)}">`,choices:opts([{t:'Meenemen',cls:'go',on:()=>{const nm=$('#exn').value.trim()||n;closeModal();doAct('Nieuw huisdier',()=>{cash(-pr);const p=addPet(x[0],nm,{k:pr,life:x[4],br:x[2]});p.exo=1;if(ill){p.ill=1;kar(-6)}hap(8);if(f8Once('exo'))MS(`Nam een ${x[2].toLowerCase()} als huisdier`,1);S.flags.exo=(S.flags.exo||0)+1;
    return `Welkom thuis, ${nm}! ${x[5]>=3?'De buren hebben hun kinderen binnen gehaald.':x[5]>=2?'Je buren kijken bezorgd over de schutting.':'Iedereen wil komen kijken.'}`},true,x[1])}}])})}
const exoPets=()=>living('huisdier').filter(p=>p.exo);
F8.person.push((el,p)=>{if(p.role!=='huisdier'||!p.exo||!p.alive||inJail())return;const x=exoOf(p.sp);if(!x)return;const s=sec(el,'Exotisch');
  row(s,{ic:'📹',t:'Een filmpje maken',s:'Voor social media',on:()=>doAct('Filmpje',()=>{use('exf'+p.id);if(chance(.25)){S.fame=clamp(S.fame+5);S.foll=Math.round((S.foll||0)+ri(2000,40000));return `Het filmpje van ${p.first} gaat viraal. Mensen willen meer!`}return `${p.first} doet niks bijzonders op camera. Typisch.`},true,'📹')});
  if(x[5]>=1)row(s,{ic:'🤗',t:'Knuffelen',s:x[5]>=3?'Levensgevaarlijk':'Niet zonder risico',on:()=>doAct('Knuffelen',()=>{if(chance(x[5]*.12)){hea(-ri(3,8)*x[5]);hap(-4);return `${p.first} vindt het niet leuk en bijt. Je moet naar de eerste hulp.`}p.rel=clamp(p.rel+8);hap(3);return `${p.first} laat het toe. Een bijzonder moment.`},true,'🤗')})});
F8.year.push(()=>{const ps=exoPets();if(!ps.length||inJail())return;const p=pick(ps),x=exoOf(p.sp);if(!x)return;
  if(p.ill&&chance(.22)){Q.push({id:'exo_inbeslag',c:{id:p.id}});return}
  if(chance(.12+x[5]*.06))Q.push({id:pick(['exo_ontsnapt','exo_beet','exo_dierenarts']),c:{id:p.id}})});
E('exo_ontsnapt',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Ontsnapt!',x:c=>{const p=P(c.id),x=exoOf(p.sp);return `${p.first} de ${x?x[2].toLowerCase():p.sp} is ontsnapt. ${x&&x[5]>=2?'Op het nieuws waarschuwen ze dat mensen binnen moeten blijven.':'De buurvrouw vond hem in haar wasmand.'}`},
  ch:[['🔦 Zelf gaan zoeken',c=>{const p=P(c.id),x=exoOf(p.sp);if(chance(.6)){p.rel=clamp(p.rel+5);return `Je vindt ${p.first} in de tuin van de buren. Iedereen opgelucht.`}p.alive=false;p.died=ageY();hap(-6);return `${p.first} wordt nooit meer gevonden.${x&&x[5]>=2?' Je krijgt een boete van de gemeente.':''}`}],
   ['📞 De dierenambulance bellen',c=>{const p=P(c.id),x=exoOf(p.sp);const k=Math.round((x&&x[5]>=2?3000:300)*(S.cpi||1));cash(-k);return `Met een net en een busje vangen ze ${p.first}. Kosten: ${fmt(k)}.`}]]});
E('exo_beet',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Au!',x:c=>`${P(c.id).first} is chagrijnig vandaag en valt je aan bij het voeren.`,
  ch:[['🩹 Zelf verbinden',c=>{const x=exoOf(P(c.id).sp);hea(-ri(1,4)*(x?x[5]+1:1));return 'Het bloedt flink, maar je redt het met een pleister en een vloek.'}],
   ['🏥 Naar de eerste hulp',c=>{const x=exoOf(P(c.id).sp);hea(-ri(0,2));cash(-Math.round(250*(S.cpi||1)));return `De arts kijkt naar de wond en vraagt: "Een ${x?x[2].toLowerCase():'dier'}? Thuis?"`}],
   ['🏠 Een opvang voor het dier zoeken',c=>{const p=P(c.id);p.alive=false;p.gone=1;kar(2);hap(-3);return `${p.first} gaat naar een opvang waar ze weten hoe je met zo\'n dier omgaat.`}]]});
E('exo_dierenarts',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Een speciale dierenarts',x:c=>`${P(c.id).first} eet niet meer. Een gewone dierenarts weet niet wat het is. Een specialist kost veel geld.`,
  ch:[['💶 Naar de specialist',c=>{const k=Math.round(ri(800,3000)*(S.cpi||1));cash(-k);P(c.id).life++;return `De specialist (${fmt(k)}) vindt het probleem. ${P(c.id).first} eet weer als vanouds.`}],
   ['🤞 Afwachten',c=>{const p=P(c.id);if(chance(.5))return `Na een week begint ${p.first} weer te eten.`;p.alive=false;p.died=ageY();hap(-8);return `${p.first} overleeft het niet.`}]]});
E('exo_inbeslag',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Inbeslagname',x:c=>`Er staat een inspecteur met twee agenten voor de deur. Ze weten van ${P(c.id).first}.`,
  ch:[['🙏 Meewerken',c=>{const p=P(c.id);p.alive=false;p.gone=1;const f=Math.round(ri(2,6)*1000*(S.cpi||1));cash(-f);hap(-8);return `${p.first} wordt meegenomen naar een opvang. Je krijgt een boete van ${fmt(f)}.`}],
   ['🏃 Het dier verstoppen',c=>{const p=P(c.id);if(chance(.35))return `Ze vinden ${p.first} niet. Voor nu.`;p.alive=false;p.gone=1;const f=Math.round(ri(6,15)*1000*(S.cpi||1));cash(-f);S.crim.rec.push({w:'illegaal houden van een beschermd dier',a:ageY()});hap(-10);return `Ze vinden ${p.first} in de schuur. Boete: ${fmt(f)}, en een aantekening op je strafblad.`}]]});
F8.ach.push(add=>{if(S.flags.spookrust)add('spookrust');if(S.flags.spookjager)add('spookjager');if((S.flags.exo||0)>=1)add('exoot')});
ACH.push(['spookrust','Rust in vrede','Help een geest om rust te vinden'],['spookjager','Spokenjager','Laat een spook verjagen'],['exoot','Wilde huisgenoot','Neem een exotisch huisdier']);
Object.assign(EVMETA,{spk_nuchter:['Spookhuis','🔦'],spk_teken:['Spookhuis','👻'],spk_verschijning:['Spookhuis','👻'],spk_bezoek:['Spookhuis','😱'],exo_ontsnapt:['Exotisch huisdier','🚨'],exo_beet:['Exotisch huisdier','🩹'],exo_dierenarts:['Exotisch huisdier','🩺'],exo_inbeslag:['Exotisch huisdier','🚔']});

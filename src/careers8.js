/* ================= FASE 8.2: BIJZONDERE LOOPBANEN =================
   Astronaut (S.ast), geheim agent (S.spy), sekteleider (S.sekte) en straathandel (S.str).
   Straathandel en de sekte zijn bewust abstract gehouden: risico, geld en aanzien, geen echte werkwijzen. */
// astronaut en geheim agent zijn fulltime: geen gewone baan ernaast. Een sekte kun je naast je werk leiden.
const f8Career=()=>!!((S.ast&&['opl','act'].includes(S.ast.st))||(S.spy&&S.spy.st==='act'));
if(typeof hire==='function'){hire=(f=>function(...a){if(f8Career()){toast('Stop eerst met je huidige loopbaan');return}return f(...a)})(hire)}
const cleanRec=()=>!(S.crim.rec||[]).length&&!S.crim.wanted;
const hasDeg=(tys,fs)=>S.edu.deg.some(d=>tys.includes(d.ty)&&(!fs||fs.includes(d.f)));

/* ================= ASTRONAUT ================= */
const ASTR=['Astronaut in opleiding','Astronaut','Ervaren astronaut','Missiecommandant','Hoofd astronautenkorps'];
const ASTSAL=[62,92,118,145,170];
const astAg=()=>({US:'NASA',CA:'CSA',JP:'JAXA',NL:'ESA',BE:'ESA',DE:'ESA',FR:'ESA',IT:'ESA',ES:'ESA',UK:'ESA'})[S.p.country]||'het nationale ruimtevaartagentschap';
const ASTM={station:{n:'het ruimtestation',em:'🛰️',risk:.004,mo:6,fame:12},maan:{n:'de maan',em:'🌕',risk:.012,mo:2,fame:30,y:2030,r:2},mars:{n:'Mars',em:'🔴',risk:.035,mo:30,fame:55,y:2045,r:3}};
function astReq(){const a=ageY(),out=[];
  if(a<25||a>45)out.push('Tussen 25 en 45 jaar');
  if(!(hasDeg(['wo','master','phd'],['informatica','techniek','geneeskunde','biologie','economie'])||hasDeg(['hbo'],['techniek','elektro','informatica'])&&(S.mil||S.pmil)||(S.mil&&S.mil.route==='off')))out.push('Een technische of medische universitaire studie (of officier bij Defensie)');
  if(S.st.health<70)out.push('Gezondheid minstens 70%');if(S.st.smarts<60)out.push('Slimheid minstens 60%');if(!cleanRec())out.push('Een schoon strafblad');return out}
function astApply(){const miss=astReq();if(miss.length){modal({title:'Nog niet geschikt',em:'🧑‍🚀',cat:'Ruimtevaart',text:`Om astronaut te worden heb je nodig: ${miss.join('; ').toLowerCase()}.`,choices:[{t:'OK',cls:'go',on:closeModal}]});return}
  if(S.flags.astSel&&year()-S.flags.astSel<2){toast('De volgende selectieronde is over '+(2-(year()-S.flags.astSel))+' jaar');return}S.flags.astSel=year();
  let pts=0;const step3=()=>modal({title:'Gesprek met de psycholoog',em:'🧠',cat:'Selectie · ronde 3 van 3',text:'"Je zit een half jaar met vijf mensen in een ruimte zo groot als een bus. Eén van hen kauwt hard. Wat doe je?"',choices:[
    {t:'💬 Het rustig bespreken',on:()=>{pts+=1;closeModal();astDone(pts)}},{t:'🎧 Koptelefoon op',on:()=>{pts+=.6;closeModal();astDone(pts)}},{t:'😤 Er iets van zeggen bij het ontbijt',on:()=>{pts+=.1;closeModal();astDone(pts)}}]});
  const step2=()=>mgTap('Fysieke test','Tik zo snel als je kunt: de fietstest op de hometrainer.',sc=>{pts+=sc;step3()});
  modal({title:'Selectie voor astronaut',em:'🧑‍🚀',cat:astAg(),text:'Duizenden mensen solliciteren. Je moet door drie rondes: een kennistoets, een fysieke test en een gesprek met de psycholoog.',choices:[{t:'🚀 Beginnen',cls:'go',on:()=>{closeModal();mgQuiz('Kennistoets',[mathQ(),mathQ(),...pickQs(pick(['Natuurkunde','Biologie','Engels']),2)],sc=>{pts+=sc;step2()})}},{t:'Annuleren',cls:'ghost',on:closeModal}]})}
function astDone(pts){const p=clamp(pts/3*.7+(S.st.smarts-60)/200+(S.st.health-70)/250+S.sk.sport/500,.03,.85);
  doAct('Selectie',()=>{if(!chance(p)){hap(-6);return `Je komt tot de laatste dertig, maar valt af. "Probeer het over twee jaar nog eens," zegt de brief.`}
    if(S.job)endJob();if(S.mil&&typeof milLeave==='function')milLeave('Je verlaat Defensie om astronaut te worden.');
    S.ast={st:'opl',rank:0,yrs:0,mis:[],fit:60,ag:astAg(),y0:year()};hap(15);S.fame=clamp(S.fame+10);MS(`Werd geselecteerd als astronaut bij ${astAg()}`,3);
    return `Je bent aangenomen! Over twee jaar ben je astronaut. Je ouders bellen iedereen die ze kennen.`},true,'🚀')}
function sheetAst(el){const A=S.ast;
  card(el,`<h3>🧑‍🚀 ${ASTR[A.rank]}</h3><span class="muted">${he(A.ag)} · ${A.st==='opl'?`opleiding, jaar ${A.yrs+1} van 2`:A.st==='gestopt'?'gestopt':`${A.yrs} jaar in dienst`}</span><div class="stat"><span>Conditie</span><span></span><span class="v">${Math.round(A.fit)}%</span>${bar(A.fit)}</div>${kv([['Salaris',A.st==='gestopt'?'—':fmt(ASTSAL[A.rank]*1000*(S.cpi||1))+' per jaar'],['Missies',A.mis.length?A.mis.map(m=>ASTM[m.k].em+' '+m.y).join(', '):'nog geen'],...(A.next?[['Volgende missie',`${ASTM[A.next].em} Naar ${ASTM[A.next].n}`]]:[])])}`);
  if(A.st==='gestopt'){empty(sec(el,''),'Je bent gestopt als astronaut. Je kijkt nog elke avond naar de sterren.');return}
  const s=sec(el,'Training');const fit=d=>{A.fit=clamp(A.fit+d)};
  row(s,{ic:'🌀',t:'Centrifuge',s:'Acht keer je eigen gewicht',on:()=>doAct('Centrifuge',()=>{const m=use('astc');fit(Math.round(6*m));if(chance(.2)){hea(-1);return 'Je valt even weg bij 7G. De arts kijkt bezorgd, maar je mag door.'}return 'Je wangen trekken naar achteren. Je houdt het vol.'},true,'🌀')});
  row(s,{ic:'🛸',t:'Simulator',s:'Minigame · ontwijk ruimtepuin',on:()=>mgDodge({title:'Simulator',desc:'Stuur de capsule langs het ruimtepuin.',em:'🛸'},sc=>doAct('Simulator',()=>{use('asts');fit(Math.round(sc*8));return sc>=.6?'Perfecte koppeling met het station. De instructeur knikt.':'Je capsule tolt als een wasmachine. Nog een keer.'},true,'🛸'))});
  row(s,{ic:'🏊',t:'Ruimtewandeling oefenen',s:'In een enorm zwembad, in een ruimtepak',on:()=>doAct('Zwembad',()=>{const m=use('astz');fit(Math.round(4*m));sk('sport',1);return 'Zes uur onder water in een pak van honderd kilo. Je bent kapot.'},true,'🏊')});
  row(s,{ic:'🏫',t:'Voorlichting op scholen',s:'Vertel kinderen over de ruimte',on:()=>doAct('Voorlichting',()=>{use('astv');S.fame=clamp(S.fame+2);sk('sociaal',1);kar(1);return pick(['Een meisje van acht vraagt hoe je in de ruimte naar de wc gaat. Het hele gesprek gaat daarover.','De klas wil weten of je aliens hebt gezien. Je zegt: "Nog niet."'])},true,'🏫')});
  if(A.st==='act'&&!A.next)row(s,{ic:'🙋',t:'Je opgeven voor een missie',s:S.acts.astm?'Dit jaar al geprobeerd':'Wordt gekozen op conditie en ervaring',dis:!!S.acts.astm,dots:true,on:()=>{const ks=Object.keys(ASTM).filter(k=>(!ASTM[k].y||year()>=ASTM[k].y)&&(!ASTM[k].r||A.rank>=ASTM[k].r));
    modal({title:'Missie',em:'🚀',cat:A.ag,text:'Voor welke missie geef je je op?',choices:opts(ks.map(k=>({t:`${ASTM[k].em} ${cap(ASTM[k].n)}`,s:`${ASTM[k].mo>=12?Math.round(ASTM[k].mo/12)+' jaar':ASTM[k].mo+' maanden'} weg`,on:()=>{closeModal();doAct('Opgegeven',()=>{S.acts.astm=1;if(chance(clamp(.25+A.fit/250+A.rank*.08,.1,.85))){A.next=k;return `Je bent gekozen voor de missie naar ${ASTM[k].n}! Volgend jaar is de lancering.`}return 'Je staat op de reservelijst. Volgend jaar weer kansen.'},true,'🙋')}})))})}});
  row(sec(el,''),{ic:'🚪',t:'Stoppen als astronaut',dots:true,on:()=>ask('Stoppen?','Je verlaat het astronautenkorps.','Stoppen',()=>{astStop('Je neemt afscheid van het astronautenkorps.');refreshSheet();render()})})}
function astStop(t){const A=S.ast;if(!A)return;S.jobs.push({t:ASTR[A.rank],co:A.ag,y:A.yrs});A.st='gestopt';A.next=null;L(t,'big')}
function astYear(a){const A=S.ast;if(!A||A.st==='gestopt')return;if(inJail()){astStop('Na je veroordeling word je ontslagen bij het astronautenkorps.');return}A.yrs++;A.fit=clamp(A.fit-ri(2,6));
  if(A.st==='opl'&&A.yrs>=2){A.st='act';A.rank=1;L('Je opleiding zit erop: je bent nu officieel astronaut!','good big');MS('Werd astronaut',2)}
  if(A.next)Q.push({id:'ast_lancering',c:{k:A.next}});
  if(A.st==='act'&&A.rank<4&&A.mis.length>=[0,0,1,3,5][A.rank+1]&&A.yrs>=A.rank*3&&chance(.5)){A.rank++;L(`Je bent nu ${ASTR[A.rank].toLowerCase()}.`,'good');MS(`Werd ${ASTR[A.rank].toLowerCase()}`,1)}
  if(a>=58||S.st.health<45)astStop(a>=58?'Je gaat met pensioen als astronaut.':'Je wordt medisch afgekeurd voor ruimtevluchten.')}
E('ast_lancering',{sys:1,need:c=>S.ast&&S.ast.next===c.k,t:'Lancering',x:c=>`Het aftellen begint. Over tien minuten vertrek je naar ${ASTM[c.k].n}. Je familie kijkt vanaf de tribune.`,
  ch:[['🚀 Klaar voor de start',c=>{const M=ASTM[c.k];const A=S.ast;A.next=null;if(chance(M.risk*(A.fit<40?2:1))){die(`een ongeluk tijdens de lancering naar ${M.n}`);return 'Er gaat iets mis bij de lancering.'}
     Q.unshift({id:'ast_missie',c:{k:c.k}});hap(10);return `Drie, twee, één... Je wordt in je stoel gedrukt. Acht minuten later zweef je. De aarde is blauwer dan op elke foto.`}],
   ['😰 Je terugtrekken',c=>{S.ast.next=null;hap(-8);S.fame=clamp(S.fame-3);return 'Je stapt op het laatste moment uit. Een reserve neemt je plek in. Je schaamt je, maar je leeft.'}]]});
E('ast_missie',{sys:1,need:()=>!!S.ast,t:'In de ruimte',x:c=>`Je bent bij ${ASTM[c.k].n}. ${c.k==='station'?'Er moet een zonnepaneel gerepareerd worden.':c.k==='maan'?'Je mag als eerste uit de lander.':'Na maanden reizen zie je de rode planeet.'}`,
  ch:[['👨‍🚀 Naar buiten 🎮',c=>evMg('Ruimtewandeling','👨‍🚀','Ruimtevaart',f=>mgDodge({title:'Ruimtewandeling',desc:'Ontwijk ronddrijvend gereedschap en micrometeorieten.',em:'👨‍🚀'},f),sc=>astBack(c.k,sc))],
   ['🔬 Experimenten doen',c=>astBack(c.k,.6)]]});
function astBack(k,sc){const A=S.ast,M=ASTM[k];A.mis.push({k,y:year()});hea(-ri(1,4));S.fame=clamp(S.fame+M.fame);sma(2);hap(12);
  if(M.mo>=12){for(const p of living(['partner','kind']))p.rel=clamp(p.rel-10)}
  if(k==='station')MS('Ging de ruimte in',3);if(k==='maan'){MS('Liep op de maan',3);S.flags.maan=1}if(k==='mars'){MS('Zette als een van de eersten voet op Mars',3);S.flags.mars=1}S.flags.ruimte=1;
  return sc>=.6?`Alles gaat volgens plan. Na ${M.mo>=12?Math.round(M.mo/12)+' jaar':M.mo+' maanden'} land je weer op aarde, als held.`:`Een stuk gereedschap drijft weg en wordt ruimtepuin. Verder gaat alles goed en je landt veilig.`}
E('ast_heimwee',{a:[25,60],w:()=>S.ast&&S.ast.st==='act'?6:0,cd:4,c:()=>!!(S.ast&&S.ast.st==='act'&&(partner()||living('kind').length)),t:'Thuis',x:'Je kind vraagt waarom je nooit thuis bent bij de voetbalwedstrijden.',
  ch:[['🤗 Een jaar geen missies',()=>{for(const p of living(['partner','kind']))p.rel=clamp(p.rel+8);S.ast.next=null;return 'Je staat elke zaterdag langs de lijn. Je kind scoort en wijst naar jou.'}],
   ['🌌 Uitleggen waarom het belangrijk is',()=>{for(const p of living('kind'))p.rel=clamp(p.rel+2);return 'Je neemt je kind mee naar het trainingscentrum. Het wil nu ook astronaut worden.'}]]});

/* ================= GEHEIM AGENT ================= */
const SPYR=['Analist in opleiding','Veldagent','Senior agent','Hoofd operaties','Directeur'];
const SPYSAL=[46,62,82,108,150];
const SPYCOV=['Beleidsmedewerker bij een ministerie','Consultant bij een adviesbureau','Attaché op een ambassade','Exportmanager van een machinefabriek','Vertaler bij een vertaalbureau'];
const SPYM=[['🕵️','Een informant werven','sociaal'],['📸','Geheime documenten fotograferen','mem'],['🚗','Een verdachte schaduwen','tap'],['🎧','Afluisterapparatuur plaatsen','dodge'],['🛂','Een overloper over de grens helpen','dodge'],['💻','Een hackersgroep ontmaskeren','quiz']];
function spyReq(){const a=ageY(),o=[];if(a<21||a>45)o.push('Tussen 21 en 45 jaar');if(!cleanRec())o.push('Een schoon strafblad');if(S.st.smarts<55)o.push('Slimheid minstens 55%');if(!hasDeg(['hbo','wo','master','phd'])&&!S.mil&&!S.pmil)o.push('Een hbo- of universitair diploma, of ervaring bij Defensie');if(S.fame>=40)o.push('Je bent te bekend om onopvallend te werken');return o}
function spyApply(){const miss=spyReq();if(miss.length){modal({title:'Afgewezen',em:'🕶️',cat:'Inlichtingendienst',text:`De dienst neemt je niet aan. Nodig: ${miss.join('; ').toLowerCase()}.`,choices:[{t:'OK',cls:'go',on:closeModal}]});return}
  if(S.flags.spySel===year()){toast('Je hebt dit jaar al gesolliciteerd');return}S.flags.spySel=year();
  modal({title:'Een sollicitatie zonder vacature',em:'🕶️',cat:'Inlichtingendienst',text:'Je stuurt een brief naar een postbusnummer. Twee weken later word je gebeld door iemand die zijn naam niet noemt. Eerst een geheugentest.',choices:[{t:'🧠 Beginnen',cls:'go',on:()=>{closeModal();mgMemory('Geheugentest','Onthoud de volgorde van de symbolen.',6,ok=>spyIntake(ok))}},{t:'Annuleren',cls:'ghost',on:closeModal}]})}
function spyIntake(ok){modal({title:'Het gesprek',em:'🕶️',cat:'Inlichtingendienst',text:'"Je beste vriend vraagt wat je voor werk doet. Wat zeg je?"',choices:[
  {t:'"Ik werk bij een ministerie, saai hoor."',on:()=>{closeModal();spyHire(ok?.7:.35)}},{t:'"Dat mag ik niet zeggen."',on:()=>{closeModal();spyHire(ok?.3:.1)}},{t:'"Ik ben geheim agent, haha."',on:()=>{closeModal();spyHire(ok?.15:.05)}}]})}
function spyHire(p){doAct('Inlichtingendienst',()=>{if(!chance(p)){return 'Je hoort nooit meer iets. Ook geen afwijzing. Dat is ook een antwoord.'}if(S.job)endJob();if(S.mil&&typeof milLeave==='function')milLeave('Je verlaat Defensie voor een functie die je niet mag noemen.');
  S.spy={st:'act',rank:0,yrs:0,perf:50,heat:0,mis:0,cover:pick(SPYCOV)};MS('Werd aangenomen bij de inlichtingendienst',2);hap(10);return `Je bent aangenomen. Voor de buitenwereld ben je voortaan "${S.spy.cover.toLowerCase()}".`},true,'🕶️')}
function spyOffers(){const X=S.spy;if(!X.off||X.off.y!==year())X.off={y:year(),l:SPYM.slice().sort(()=>R()-.5).slice(0,3).map(m=>({k:m[1],em:m[0],ty:m[2],cc:pick(Object.keys(COUNTRIES).filter(k=>k!==S.p.country)),d:ri(1,3)}))};return X.off.l}
function sheetSpy(el){const X=S.spy;
  card(el,`<h3>🕶️ ${SPYR[X.rank]}</h3><span class="muted">Dekmantel: ${he(X.cover.toLowerCase())} · ${X.yrs} jaar in dienst</span><div class="stat"><span>Prestaties</span><span></span><span class="v">${Math.round(X.perf)}%</span>${bar(X.perf)}</div><div class="stat"><span>Risico op ontmaskering</span><span></span><span class="v">${Math.round(X.heat)}%</span>${bar(X.heat,X.heat>60?'var(--bad)':X.heat>30?'var(--warn)':'var(--good)')}</div>${kv([['Salaris',X.st==='act'?fmt(SPYSAL[X.rank]*1000*(S.cpi||1))+' per jaar':'—'],['Geslaagde operaties',X.mis]])}`);
  if(X.st!=='act'){empty(sec(el,''),X.st==='ontmaskerd'?'Je dekmantel is opgeblazen. Je werkt niet meer voor de dienst.':'Je bent gestopt bij de dienst. Officieel heb je er nooit gewerkt.');return}
  const s=sec(el,`Operaties (nog ${Math.max(0,2-(S.acts.spym||0))} dit jaar)`);
  for(const o of spyOffers())row(s,{ic:o.em,t:o.k,s:`${flag(o.cc)} ${COUNTRIES[o.cc].n} · ${'★'.repeat(o.d)}${'☆'.repeat(3-o.d)}`,dis:(S.acts.spym||0)>=2||o.done,dots:true,on:()=>spyMission(o)});
  const t=sec(el,'Op kantoor');
  row(t,{ic:'📁',t:'Dossiers analyseren',s:'Veilig, maar saai',on:()=>doAct('Dossiers',()=>{const m=use('spyd');X.perf=clamp(X.perf+Math.round(4*m));sma(1);return pick(['Je vindt een verband tussen twee bedrijven op Cyprus. Je baas fronst tevreden.','Duizend pagina\'s afgetapte telefoongesprekken over voetbal. Eén zin is interessant.'])},true,'📁')});
  row(t,{ic:'🧘',t:'Onderduiken en afkoelen',s:'Lager risico, minder prestaties',dis:!!S.acts.spyk,on:()=>doAct('Afkoelen',()=>{S.acts.spyk=1;X.heat=clamp(X.heat-20);X.perf=clamp(X.perf-4);return 'Je doet een paar maanden gewoon je dekmanteltaak. Niemand let nog op je.'},true,'🧘')});
  row(sec(el,''),{ic:'🚪',t:'Stoppen bij de dienst',dots:true,on:()=>ask('Stoppen?','Je verlaat de dienst. Over wat je hebt gedaan mag je nooit praten.','Stoppen',()=>{spyStop('Je verlaat de inlichtingendienst. Op je afscheid zijn zes mensen, allemaal met zonnebril.','gestopt');refreshSheet();render()})})}
function spyStop(t,st){const X=S.spy;S.jobs.push({t:X.cover,co:'(dekmantel)',y:X.yrs});X.st=st;L(t,'big')}
function spyMission(o){modal({title:o.k,em:o.em,cat:`Operatie in ${COUNTRIES[o.cc].n}`,text:'Hoe pak je het aan?',choices:opts([
  {t:'🐢 Voorzichtig',s:'Minder risico, kleinere klapper',on:()=>{closeModal();spyRun(o,0)}},{t:'🐺 Brutaal',s:'Groot resultaat of grote problemen',on:()=>{closeModal();spyRun(o,1)}}])})}
function spyRun(o,bold){const X=S.spy;const fin=sc=>doAct(o.k,()=>{S.acts.spym=(S.acts.spym||0)+1;o.done=1;const p=clamp(.35+sc*.45+X.rank*.04-o.d*.06+(bold?-.08:.08),.08,.95);
    if(chance(p)){X.mis++;X.perf=clamp(X.perf+o.d*(bold?9:6));X.heat=clamp(X.heat+(bold?6:2));if(f8Once('spy1'))MS('Voerde een eerste geheime operatie uit',1);hap(4);
      return pickF('spyok',[`De operatie in ${COUNTRIES[o.cc].n} slaagt. Niemand zal er ooit iets over lezen.`,`Je bent binnen en weer buiten voordat de bewaker zijn koffie op heeft.`,`De informatie die je meeneemt, voorkomt iets groots. Je mag niet zeggen wat.`])}
    X.heat=clamp(X.heat+o.d*(bold?16:9));X.perf=clamp(X.perf-6);hap(-4);
    if(bold&&chance(.25)){Q.push({id:'spy_gevangen',c:{cc:o.cc}});return `Het gaat mis. Een politieauto stopt naast je in ${COUNTRIES[o.cc].n}.`}
    return pick(['Je moet afbreken: iemand heeft je gezien. Je vliegt met een valse naam naar huis.','Het doelwit komt niet opdagen. Je wacht zes uur in een gehuurde auto.'])},true,o.em);
  if(o.ty==='mem')mgMemory(o.k,'Onthoud de volgorde van de dossiers in de kluis.',5,ok=>fin(ok?.9:.3));
  else if(o.ty==='tap')mgTap(o.k,'Tik snel om de verdachte bij te houden in de drukte.',fin);
  else if(o.ty==='dodge')mgDodge({title:o.k,desc:'Ontwijk camera\'s en bewakers.',em:o.em},fin);
  else if(o.ty==='quiz')mgQuiz(o.k,[mathQ(),mathQ(),mathQ()],fin);
  else fin(clamp((S.sk.sociaal+S.st.looks)/160+R()*.3,0,1))}
function spyYear(a){const X=S.spy;if(!X||X.st!=='act')return;if(inJail()&&!S.crim.jail.spy){spyStop('Na je veroordeling zet de dienst je op straat. Officieel heb je er nooit gewerkt.','gestopt');return}if(X.heat>=100&&!Q.some(q=>q.id==='spy_ontmaskerd'))Q.push({id:'spy_ontmaskerd'});X.yrs++;X.heat=clamp(X.heat-8);X.perf=clamp(X.perf-3);
  if(X.rank<4&&X.perf>=70&&X.yrs>=X.rank*2+1&&X.mis>=X.rank*2&&chance(.55)){X.rank++;X.perf=55;L(`Je wordt bevorderd tot ${SPYR[X.rank].toLowerCase()}. Op je loonstrook staat nog steeds "${X.cover.toLowerCase()}".`,'good');MS(`Werd ${SPYR[X.rank].toLowerCase()} bij de inlichtingendienst`,X.rank>=4?3:1);if(X.rank>=4)S.flags.spyBaas=1}
  if(a>=62)spyStop('Je gaat met pensioen bij de dienst. Je krijgt een horloge zonder inscriptie.','gestopt')}
E('spy_werving',{a:[22,40],w:()=>S.spy||!cleanRec()||S.st.smarts<60||S.fame>=40?0:2,once:1,c:()=>!S.spy&&!f8Career(),t:'Een vreemde ontmoeting',x:'Na een lange dag spreekt een vrouw in een grijze jas je aan. "We volgen je al een tijdje. Je bent slim en je kunt zwijgen. Heb je interesse in werk voor je land?"',
  ch:[['🕶️ Ja, vertel meer',()=>({go:()=>{closeModal();spyIntake(true)}})],['🙅 Nee, dank je',()=>'Ze knikt, geeft je geen kaartje en verdwijnt in de menigte.']]});
E('spy_gevangen',{sys:1,need:()=>S.spy&&S.spy.st==='act',t:'Opgepakt',x:c=>`De politie van ${COUNTRIES[c.cc].n} houdt je vast op verdenking van spionage. Je ambassade zegt je niet te kennen.`,
  ch:[['🤐 Zwijgen',c=>{const m=ri(10,30);jail(m,'spionage in het buitenland');S.crim.jail.spy=1;S.spy.heat=60;S.spy.perf=clamp(S.spy.perf+10);return `Je zegt niets. Na ${Math.round(m/12*10)/10} jaar word je uitgewisseld op een brug in de mist. De dienst neemt je terug.`}],
   ['🗣️ Alles vertellen',c=>{spyStop('Je bekent alles. Je wordt het land uitgezet en je dienst wil niets meer met je te maken hebben.','ontmaskerd');S.fame=clamp(S.fame+20);hap(-10);return 'Je praat. Na een maand mag je naar huis. Je carrière is voorbij en je naam staat in alle kranten.'}]]});
E('spy_ontmaskerd',{sys:1,need:()=>S.spy&&S.spy.st==='act',t:'Ontmaskerd',x:()=>`Een buitenlandse krant publiceert je foto: "${S.p.first} ${S.p.last}, geen ${S.spy.cover.toLowerCase()} maar spion." Je kunt niet meer in het veld werken.`,
  ch:[['📚 Een bureaubaan bij de dienst',()=>{S.spy.heat=40;S.spy.perf=clamp(S.spy.perf-15);S.fame=clamp(S.fame+15);return 'Je verhuist naar een kamer zonder ramen. Veilig, maar nooit meer spannend.'}],
   ['🚪 Stoppen en een boek schrijven',()=>{spyStop('Na je ontmaskering verlaat je de dienst.','ontmaskerd');S.fame=clamp(S.fame+25);const g=Math.round(ri(80,400)*1000*(S.cpi||1));cash(g);return `Je memoires worden een bestseller (${fmt(g)}). De dienst heeft de helft van de hoofdstukken zwart gemaakt.`}]]});
E('spy_partner',{a:[22,65],w:()=>S.spy&&S.spy.st==='act'&&partner()?6:0,cd:5,c:()=>!!(S.spy&&S.spy.st==='act'&&partner()),ctx:()=>ctxP(partner()),t:'Geheimen',x:c=>`${Pe(c).first} vindt een paspoort met jouw foto en een andere naam. "Wie ben jij eigenlijk?"`,
  ch:[['🤥 Een smoes verzinnen',c=>{if(chance(.5)){return `"Een grap van collega's," zeg je. ${Pe(c).first} kijkt je lang aan, maar laat het gaan.`}rel_(Pe(c),-15);return `${Pe(c).first} gelooft er niets van en slaapt een week bij een vriendin.`}],
   ['💬 De waarheid vertellen',c=>{rel_(Pe(c),8);S.spy.heat=clamp(S.spy.heat+15);return `Je vertelt alles. ${Pe(c).first} is stil en zegt dan: "Dat verklaart de rare zondagen."`}]]});
E('spy_dubbel',{a:[25,60],w:()=>S.spy&&S.spy.st==='act'&&S.spy.rank>=1?4:0,once:1,c:()=>!!(S.spy&&S.spy.st==='act'),t:'Een aanbod',x:'In een café in het buitenland schuift een man je een envelop toe. "Wij betalen beter. Je hoeft alleen af en toe iets te vertellen."',
  ch:[['📞 Melden bij je baas',()=>{S.spy.perf=clamp(S.spy.perf+15);kar(4);return 'Je baas is blij. De man wordt een week later het land uitgezet.'}],
   ['💰 Aannemen',()=>{const g=Math.round(ri(40,150)*1000*(S.cpi||1));dirtyIn(g,true);S.spy.heat=clamp(S.spy.heat+35);kar(-15);S.spy.dbl=1;return `In de envelop zit ${fmt(g)}. Vanaf nu heb je twee bazen. En twee keer zoveel kans om gepakt te worden.`}],
   ['🚶 Weglopen',()=>'Je laat de envelop liggen en betaalt je koffie.']]});

/* ================= SEKTELEIDER ================= */
const SEKT=[['🌞','Kinderen van de Zon','Een spirituele leefgemeenschap rond zonsopgangen'],['🛸','De Sterrenpoort','Wachten op contact met buitenaards leven'],['🌿','Terug naar de Aarde','Een natuurbeweging zonder telefoons'],['💎','Het Innerlijk Kristal','Zelfhulp met dure kristallen'],['🔮','De Laatste Getijde','Een beweging die het einde der tijden verwacht']];
const DONL=[['Vrijwillig',250,'Leden geven wat ze willen'],['Een tiende van het inkomen',1400,'Leden geven 10% van hun loon'],['Alles afstaan',4500,'Leden geven hun bezit aan de beweging']];
const charisma=()=>clamp(Math.round(S.sk.sociaal*.5+S.st.looks*.25+S.fame*.25));
function sekteStart(){const a=ageY();if(a<21){toast('Vanaf 21 jaar');return}
  modal({title:'Een beweging oprichten',em:'🕯️',cat:'Speciale carrières',text:'Waar gaat jouw beweging over?',choices:opts(SEKT.map(([em,n,d],i)=>({t:`${em} ${n}`,s:d,on:()=>{closeModal();
    modal({title:'De naam',em,cat:'Een beweging oprichten',html:`<input class="inp" id="skn" maxlength="30" value="${he(n)}">`,choices:opts([{t:'Oprichten',cls:'go',on:()=>{const nm=$('#skn').value.trim()||n;closeModal();doAct('Oprichting',()=>{
      const m=Math.max(2,Math.round(2+charisma()/9+ri(0,4)));S.sekte={n:nm,ty:i,em,mem:m,loy:60,insp:5,don:0,yrs:0,lg:0};MS(`Richtte de beweging ${nm} op`,2);
      return `${nm} is opgericht. Bij de eerste bijeenkomst in je woonkamer zijn ${m} mensen. Iemand heeft wierook meegenomen.`},true,em)}}])})}})))})}
function sheetSekte(el){const X=S.sekte;const inc=Math.round(X.mem*DONL[X.don][1]*(S.cpi||1));
  card(el,`<h3>${X.em} ${he(X.n)}</h3><span class="muted">${SEKT[X.ty][2]} · ${X.yrs} jaar oud</span>${kv([['Volgelingen',X.mem.toLocaleString('nl-NL')],['Bijdrage',DONL[X.don][0]],['Inkomsten',fmt(inc)+' per jaar'],...(X.lg?[['Landgoed','De beweging woont samen op het platteland']]:[]),...(X.eind?[['Voorspeld einde der tijden',X.eind]]:[])])}<div class="stat"><span>Toewijding</span><span></span><span class="v">${Math.round(X.loy)}%</span>${bar(X.loy)}</div><div class="stat"><span>Aandacht van pers en justitie</span><span></span><span class="v">${Math.round(X.insp)}%</span>${bar(X.insp,X.insp>60?'var(--bad)':X.insp>30?'var(--warn)':'var(--good)')}</div>`);
  if(X.end){empty(sec(el,''),'De beweging bestaat niet meer.');return}
  const s=sec(el,'Leiden');const c=charisma();
  row(s,{ic:'🎤',t:'Een preek houden',s:'Minigame · houd het ritme',on:()=>mgRhythm({title:'De preek',desc:'Spreek in het ritme van de muziek.',em:'🎤',notes:['✨','🙏'],btn:'Amen!'},sc=>doAct('Preek',()=>{const m=use('skp');X.loy=clamp(X.loy+Math.round(sc*8*m));const g=Math.round(X.mem*sc*.08*m+(sc>.6?ri(1,3):0));X.mem+=g;return sc>=.6?`De zaal hangt aan je lippen. ${g} nieuwe mensen willen lid worden.`:'Halverwege valt de microfoon uit. Je praat door, maar een paar mensen gaan koffie halen.'},true,'🎤'))});
  row(s,{ic:'📣',t:'Wervingsactie op straat',s:'Meer leden, maar ook meer aandacht',on:()=>doAct('Werving',()=>{const m=use('skw');const g=Math.round((2+c/12+X.mem*.03)*m*(.5+R()));X.mem+=g;X.insp=clamp(X.insp+2);return `Je deelt flyers uit op het station. ${g} mensen komen naar de volgende bijeenkomst.`},true,'📣')});
  row(s,{ic:'🏕️',t:'Een retraite organiseren',s:S.acts.skr?'Dit jaar al gedaan':`Kost ${fmt(Math.round((2000+X.mem*40)*(S.cpi||1)))}`,dis:!!S.acts.skr||S.money<(2000+X.mem*40)*(S.cpi||1),on:()=>doAct('Retraite',()=>{S.acts.skr=1;cash(-Math.round((2000+X.mem*40)*(S.cpi||1)));X.loy=clamp(X.loy+12);hap(3);return 'Een week samen in een bos. Iedereen huilt bij het kampvuur. Ook jij een beetje.'},true,'🏕️')});
  row(s,{ic:'💶',t:'Bijdrage van de leden',s:DONL[X.don][0],dots:true,on:()=>modal({title:'Bijdrage',em:'💶',cat:X.n,text:'Wat vraag je van je volgelingen?',choices:opts(DONL.map(([t,k,d],i)=>({t,s:`${d} · ${fmt(k*(S.cpi||1))} per lid per jaar`,cls:X.don===i?'go':'',on:()=>{closeModal();if(i>X.don){X.loy=clamp(X.loy-10*(i-X.don));X.insp=clamp(X.insp+8*(i-X.don));kar(-4*(i-X.don))}else if(i<X.don){X.loy=clamp(X.loy+5);X.insp=clamp(X.insp-4)}X.don=i;L(`${X.n}: de bijdrage is nu "${t.toLowerCase()}".`);refreshSheet();saveLife()}})))})});
  if(!X.lg)row(s,{ic:'🏡',t:'Een landgoed kopen',s:`${fmt(Math.round(1.2e6*(S.cpi||1)))} · iedereen woont samen`,dis:S.money<1.2e6*(S.cpi||1),on:()=>doAct('Landgoed',()=>{cash(-Math.round(1.2e6*(S.cpi||1)));X.lg=1;X.loy=clamp(X.loy+15);X.insp=clamp(X.insp+12);return 'De beweging trekt in een oude boerderij met zestig hectare grond. De buren zijn niet blij.'},true,'🏡')});
  if(!X.boek)row(s,{ic:'📕',t:'Een boek schrijven',s:'Je leer op papier',on:()=>doAct('Boek',()=>{X.boek=1;const g=Math.round((5000+X.mem*60)*(S.cpi||1));cash(g);S.fame=clamp(S.fame+6);X.mem+=Math.round(X.mem*.1);return `Je boek "${pick(['Het licht in jou','Voorbij de sterren','De stille weg','Wakker worden'])}" verkoopt goed: ${fmt(g)}.`},true,'📕')});
  row(s,{ic:'📰',t:'Openheid geven aan de pers',s:'Minder argwaan, maar sommige leden haken af',dis:!!S.acts.sko,on:()=>doAct('Openheid',()=>{S.acts.sko=1;X.insp=clamp(X.insp-18);const l=Math.round(X.mem*.06);X.mem=Math.max(1,X.mem-l);return `Een journalist mag een week meekijken. Het artikel is mild. ${l} leden vonden het verraad.`},true,'📰')});
  if(X.ty===4&&!X.eind)row(s,{ic:'🔮',t:'Het einde der tijden voorspellen',s:'Veel nieuwe leden, maar wat als het niet gebeurt?',dots:true,on:()=>ask('Een voorspelling?','Je noemt een jaartal. Tot die tijd groeit de beweging hard.','Voorspellen',()=>doAct('Profetie',()=>{X.eind=year()+ri(2,5);X.mem+=Math.round(X.mem*.4)+5;X.insp=clamp(X.insp+10);return `Je kondigt aan dat de wereld in ${X.eind} vergaat. De kranten smullen ervan.`},true,'🔮'),'go','🔮')});
  row(sec(el,''),{ic:'🚪',t:'De beweging opheffen',dots:true,on:()=>ask('Opheffen?',`${X.n} houdt op te bestaan. Je volgelingen moeten verder zonder jou.`,'Opheffen',()=>{sekteEnd('Je heft '+X.n+' op. Sommige volgelingen zijn opgelucht, anderen huilen.');kar(3);refreshSheet();render()},'bad','🚪')})}
function sekteEnd(t){const X=S.sekte;X.end=1;S.jobs.push({t:'Leider van '+X.n,co:X.n,y:X.yrs});L(t,'big')}
function sekteYear(a){const X=S.sekte;if(!X||X.end)return;if(inJail()){X.loy=clamp(X.loy-15);X.mem=Math.round(X.mem*.8)}X.yrs++;const c=charisma();
  const grow=Math.round(X.mem*(X.loy-50)/300+c/15*(R()+.3));const lost=X.loy<40?Math.round(X.mem*(40-X.loy)/100):0;X.mem=Math.max(1,X.mem+grow-lost);
  X.loy=clamp(Math.round(X.loy+(55-X.loy)/8-X.don*3+(X.lg?3:0)));X.insp=clamp(Math.round(X.insp-3+X.don*4+(X.mem>300?3:0)+(X.mem>3000?4:0)+(X.lg?2:0)));
  if(X.don>=1)kar(-X.don);S.fame=clamp(Math.max(S.fame,Math.round(Math.log10(X.mem+1)*14)));
  if(X.mem>=1000&&f8Once('sek1000')){MS(`${X.n} kreeg duizend volgelingen`,2);S.flags.sekte=1}
  if(X.eind&&year()>=X.eind&&!X.eindDone)Q.push({id:'sek_profetie'});
  if(X.insp>=80&&chance((X.insp-70)/60))Q.push({id:'sek_inval'})}
F8.inc.push(()=>{const X=S.sekte;if(!X||X.end||inJail())return [];return [['Donaties van volgelingen',Math.round(X.mem*DONL[X.don][1]*(S.cpi||1)*(X.loy/100+.3))]]});
E('sek_overloper',{a:[22,90],w:()=>S.sekte&&!S.sekte.end?6:0,cd:3,c:()=>!!(S.sekte&&!S.sekte.end&&S.sekte.mem>=10),t:'Een overloper',x:()=>`Een oud-lid van ${S.sekte.n} vertelt op tv dat de bijeenkomsten "verplichte knuffelsessies van zes uur" zijn.`,
  ch:[['📺 Zelf in de uitzending reageren',()=>{if(chance(.4+charisma()/250)){S.sekte.mem+=ri(5,30);return 'Je bent zo rustig en vriendelijk dat er na de uitzending juist nieuwe leden bellen.'}S.sekte.insp=clamp(S.sekte.insp+12);return 'Je wordt boos in de uitzending. Dat helpt niet.'}],
   ['🤐 Niet reageren',()=>{S.sekte.insp=clamp(S.sekte.insp+6);S.sekte.mem=Math.max(1,Math.round(S.sekte.mem*.93));return 'Het verhaal gaat rond. Een paar leden blijven weg.'}],
   ['🤝 Het oud-lid excuses aanbieden',()=>{kar(4);S.sekte.insp=clamp(S.sekte.insp-5);S.sekte.loy=clamp(S.sekte.loy-4);return 'Je biedt excuses aan. Het oud-lid had dat niet verwacht.'}]]});
E('sek_ouders',{a:[22,90],w:()=>S.sekte&&!S.sekte.end?5:0,cd:3,c:()=>!!(S.sekte&&!S.sekte.end),t:'Bezorgde ouders',x:'De ouders van een jong lid staan voor de deur. Ze willen hun dochter spreken. Zij wil hen niet zien.',
  ch:[['🚪 Haar aanmoedigen om met hen te praten',()=>{kar(5);if(chance(.5)){S.sekte.mem=Math.max(1,S.sekte.mem-1);return 'Ze praten urenlang. Ze gaat met haar ouders mee naar huis. Het voelt goed.'}return 'Ze praat met haar ouders en besluit te blijven. Iedereen gaat wat rustiger naar huis.'}],
   ['🙅 De deur dichthouden',()=>{kar(-6);S.sekte.insp=clamp(S.sekte.insp+12);return 'De ouders gaan naar de krant. "Ze houden ons kind vast," staat er de volgende dag.'}]]});
E('sek_beroemd',{a:[22,90],w:()=>S.sekte&&!S.sekte.end&&S.sekte.mem>=50?3:0,once:1,c:()=>!!(S.sekte&&!S.sekte.end),t:'Een beroemd lid',x:'Een bekende zanger komt naar een bijeenkomst en wil lid worden.',
  ch:[['🤗 Welkom heten',()=>{S.sekte.mem+=ri(50,300);S.fame=clamp(S.fame+10);S.sekte.insp=clamp(S.sekte.insp+8);return 'De zanger post een foto met jou. Je telefoon ontploft.'}],
   ['🤫 Discreet houden',()=>{S.sekte.mem+=ri(5,20);return 'De zanger komt elke week, met een pet op. Niemand weet het.'}]]});
E('sek_profetie',{sys:1,need:()=>!!(S.sekte&&!S.sekte.end&&S.sekte.eind),t:'Het einde der tijden',x:()=>`Het is ${S.sekte.eind}. Je volgelingen staan in witte gewaden op een heuvel te wachten. De zon komt gewoon op.`,
  ch:[['📅 Een nieuwe datum noemen',()=>{const X=S.sekte;X.eind=year()+ri(3,7);X.mem=Math.max(1,Math.round(X.mem*.6));X.loy=clamp(X.loy-15);return `Je rekent opnieuw: het wordt ${X.eind}. Veertig procent van je volgelingen gaat naar huis.`}],
   ['🙏 "Onze gebeden hebben de wereld gered!"',()=>{const X=S.sekte;X.eindDone=1;X.eind=null;if(chance(.5)){X.loy=clamp(X.loy+10);return 'Je volgelingen juichen. Het werkt. Ongelooflijk, maar het werkt.'}X.mem=Math.max(1,Math.round(X.mem*.7));return 'Een deel van je volgelingen gelooft je. De rest niet.'}],
   ['😔 Toegeven dat je je vergiste',()=>{const X=S.sekte;X.eindDone=1;X.eind=null;kar(5);X.mem=Math.max(1,Math.round(X.mem*.5));X.insp=clamp(X.insp-20);return 'Je zegt dat je het mis had. De helft blijft, omdat je eerlijk was.'}]]});
E('sek_inval',{sys:1,need:()=>!!(S.sekte&&!S.sekte.end),t:'Onderzoek door justitie',x:()=>`Justitie doet onderzoek naar ${S.sekte.n}: naar de geldstromen en naar wat er op de bijeenkomsten gebeurt.`,
  ch:[['🤝 Volledig meewerken',()=>{const X=S.sekte;const f=Math.round(X.mem*DONL[X.don][1]*.5*(S.cpi||1));cash(-f);X.don=0;X.insp=25;X.mem=Math.max(1,Math.round(X.mem*.7));return `Je opent de boeken. Je krijgt een boete van ${fmt(f)} en de bijdrage moet vrijwillig worden. De beweging overleeft, kleiner.`}],
   ['🚪 De beweging opheffen',()=>{sekteEnd(`${S.sekte.n} wordt opgeheven terwijl justitie onderzoek doet.`);return 'Je heft de beweging op. Het onderzoek wordt gestaakt.'}],
   ['🏃 Met het geld naar het buitenland',()=>{const X=S.sekte;sekteEnd(`Je vlucht met de kas van ${X.n}.`);kar(-20);S.crim.wanted=true;S.crim.heat=100;return 'Je stapt met een koffer vol geld op een vliegtuig. Je bent nu voortvluchtig.'}]]});

/* ================= STRAATHANDEL ================= */
const STRR=['Loopjongen','Straathandelaar','Wijkbaas','Groothandelaar','Netwerkbaas'];
function sheetStr(el){const X=S.str,a=ageY();if(a<16){empty(el,'Vanaf 16 jaar.');return}
  if(!X||X.st==='gestopt'){card(el,`<h3>📦 Straathandel</h3><p class="muted" style="margin:0">Handel in spullen die niet in de winkel liggen. Snel geld, maar elke ronde kan je laatste zijn: de politie, rivalen en je eigen mensen.</p>`);
    row(sec(el,''),{ic:'🤝',t:X?'Weer beginnen':'Beginnen als loopjongen',s:'Je werkt voor iemand anders',dots:true,on:()=>ask('Beginnen?','Je gaat de straat op voor een handelaar uit de buurt. Dit is misdaad: het gaat ten koste van je karma en je kunt de cel in draaien.','Beginnen',()=>{S.str=Object.assign(X||{},{st:'act',lvl:X?Math.max(0,X.lvl-1):0,rep:X?X.rep:10,turf:X?Math.max(0,X.turf-1):0,crew:0,yrs:X?X.yrs:0});kar(-5);L('Je begint in de straathandel.','bad');refreshSheet();saveLife()},'bad','🤝')});return}
  card(el,`<h3>📦 ${STRR[X.lvl]}</h3>${kv([['Gebied',X.turf?`${X.turf} ${X.turf===1?'blok':'blokken'}`:'Geen eigen gebied'],['Mensen onder je',X.crew],['Zwart geld',fmt(S.crim.dirty||0)]])}<div class="stat"><span>Naam op straat</span><span></span><span class="v">${Math.round(X.rep)}%</span>${bar(X.rep,'var(--brand)')}</div><div class="stat"><span>Aandacht van de politie</span><span></span><span class="v">${Math.round(S.crim.heat||0)}%</span>${bar(S.crim.heat||0,(S.crim.heat||0)>60?'var(--bad)':(S.crim.heat||0)>30?'var(--warn)':'var(--good)')}</div>`);
  if(inJail()){empty(sec(el,''),'Vanuit de cel kun je niets doen.');return}
  const s=sec(el,'Op straat');
  row(s,{ic:'🏃',t:'Een ronde doen',s:'Minigame · ontwijk de politie',dis:(S.acts.strr||0)>=3,on:()=>mgDodge({title:'Een ronde',desc:'Lever af zonder dat een politieauto je ziet.',em:'🏃'},sc=>doAct('Ronde',()=>{S.acts.strr=(S.acts.strr||0)+1;kar(-2);
    const g=Math.round(ri(4,9)*100*(1+X.lvl*1.6)*(1+X.turf*.3)*(.4+sc)*(S.cpi||1));dirtyIn(g,true);X.rep=clamp(X.rep+Math.round(2+sc*3));S.crim.heat=clamp((S.crim.heat||0)+Math.round(12-sc*8));
    if(sc<.25&&chance(.35)){Q.push({id:'str_inval'});return `Je verdient ${fmt(g)}, maar een agent heeft je gezien.`}return `Je verdient ${fmt(g)} zwart geld.`},true,'🏃'))});
  if(X.lvl>=1)row(s,{ic:'🗺️',t:'Je gebied uitbreiden',s:'Een rivaal moet wijken',dis:!!S.acts.strg,on:()=>doAct('Uitbreiden',()=>{S.acts.strg=1;const p=clamp(.3+X.rep/200+X.crew*.04+S.sk.sport/400,.1,.85);if(chance(p)){X.turf++;X.rep=clamp(X.rep+8);return 'De rivaal trekt zich terug. Het blok is nu van jou.'}hea(-ri(3,10));X.rep=clamp(X.rep-6);return 'Het loopt uit op een vechtpartij. Je verliest, en je hebt een gebroken neus.'},true,'🗺️')});
  if(X.lvl>=2)row(s,{ic:'🧑‍🤝‍🧑',t:'Iemand aannemen',s:`Meer inkomsten, meer kans op een verklikker · ${X.crew} nu`,dis:X.crew>=8,on:()=>doAct('Personeel',()=>{X.crew++;return pick(['Een jongen uit de buurt wil wel. Hij is zestien en heel snel.','Een oude bekende uit de cel komt voor je werken.'])},true,'🧑‍🤝‍🧑')});
  row(s,{ic:'🧊',t:'Rustig aan doen',s:'Minder aandacht van de politie',dis:!!S.acts.strk,on:()=>doAct('Rustig aan',()=>{S.acts.strk=1;S.crim.heat=clamp((S.crim.heat||0)-20);X.rep=clamp(X.rep-3);return 'Je houdt je een paar maanden gedeisd.'},true,'🧊')});
  row(sec(el,''),{ic:'🚪',t:'Stoppen',s:X.lvl>=2?'Niet iedereen zal dat leuk vinden':'',dots:true,on:()=>ask('Stoppen?','Je stapt uit de straathandel.','Stoppen',()=>{if(X.lvl>=2)Q.push({id:'str_stoppen'});else{X.st='gestopt';L('Je stopt met de straathandel.')}refreshSheet();render();processQ()},'go','🚪')})}
function strYear(a){const X=S.str;if(!X||X.st!=='act')return;if(inJail()){X.lvl=Math.max(0,X.lvl-1);X.crew=0;X.turf=Math.max(0,X.turf-1);X.st='gestopt';L('Terwijl jij vastzit, nemen anderen je plek op straat in.');return}
  X.yrs++;kar(-2);if(X.lvl>=1){const g=Math.round(ri(3,8)*1000*X.lvl*(1+X.turf*.5)*(1+X.crew*.4)*(S.cpi||1));dirtyIn(g,true);L(`De straathandel leverde dit jaar ${fmt(g)} zwart geld op.`,'sys')}
  S.crim.heat=clamp((S.crim.heat||0)+5+X.crew*2+X.turf*2);
  if(X.lvl<4&&X.rep>=[30,50,70,88][X.lvl]&&X.yrs>=X.lvl+1){X.lvl++;L(`Op straat ben je nu ${STRR[X.lvl].toLowerCase()}.`,'bad');if(X.lvl===4){S.flags.str4=1;MS('Werd netwerkbaas in de straathandel',2)}}
  if(chance((S.crim.heat||0)/260+X.crew*.012))Q.push({id:'str_inval'});else if(X.crew>=2&&chance(.12))Q.push({id:'str_tip'})}
E('str_inval',{sys:1,need:()=>!!(S.str&&S.str.st==='act'&&!inJail()),t:'Politie!',x:'De politie valt binnen in het pand waar je voorraad ligt. Je hoort ze de trap op stormen.',
  ch:[['🏃 Vluchten over de daken 🎮',()=>evMg('Vluchten','🏃','Straathandel',f=>mgDodge({title:'Over de daken',desc:'Spring over de daken zonder te vallen.',em:'🏃'},f),sc=>{if(sc>=.5){S.crim.heat=clamp((S.crim.heat||0)+10);S.str.turf=Math.max(0,S.str.turf-1);return 'Je ontkomt. Je voorraad en een blok ben je kwijt.'}Q.push({id:'s_trial',c:{w:'straathandel en verzet bij arrestatie',m:ri(24,60)}});S.str.st='gestopt';return 'Je glijdt uit. Twee agenten liggen boven op je.'})],
   ['🚽 Alles door de wc spoelen',()=>{if(chance(.45)){S.crim.heat=clamp((S.crim.heat||0)-10);return 'Ze vinden niets. Ze weten het, jij weet het, maar bewijs is er niet.'}Q.push({id:'s_trial',c:{w:'straathandel',m:ri(12,36)}});S.str.st='gestopt';return 'Je bent te laat. De helft ligt nog op tafel.'}],
   ['🙌 Je overgeven',()=>{Q.push({id:'s_trial',c:{w:'straathandel',m:ri(8,24)}});S.str.st='gestopt';S.str.rep=clamp(S.str.rep-20);return 'Je gaat op je knieën. Je straf valt lager uit, maar op straat ben je je naam kwijt.'}]]});
E('str_tip',{sys:1,need:()=>!!(S.str&&S.str.st==='act'&&S.str.crew>0),t:'Een verklikker',x:'Een van je mensen is opgepakt en praat met de politie. Je hoort het van een neef van een buurman.',
  ch:[['🧳 Alles verplaatsen',()=>{S.str.crew=Math.max(0,S.str.crew-1);S.crim.heat=clamp((S.crim.heat||0)+10);return 'Je verhuist je voorraad in één nacht. De inval een week later vindt een lege kamer.'}],
   ['🤷 Afwachten',()=>{if(chance(.5)){Q.push({id:'str_inval'});return 'Dat was een vergissing.'}S.str.crew=Math.max(0,S.str.crew-1);return 'De verklikker weet minder dan je dacht.'}]]});
E('str_familie',{a:[16,40],w:()=>S.str&&S.str.st==='act'&&S.home.k==='ouders'?8:0,once:1,c:()=>!!(S.str&&S.str.st==='act'&&living(['moeder','vader']).length),t:'Je moeder vindt iets',x:'Je moeder vindt een rugzak vol geld onder je bed.',
  ch:[['🙏 Beloven te stoppen',()=>{relAdj('moeder',-5);S.str.st='gestopt';kar(4);return 'Je belooft te stoppen. Je moeder huilt en houdt je heel lang vast.'}],
   ['🤥 Liegen',()=>{relAdj('moeder',-15);relAdj('vader',-10);return '"Van een bijbaantje," zeg je. Ze gelooft er niets van.'}]]});
E('str_stoppen',{sys:1,need:()=>!!(S.str&&S.str.st==='act'),t:'Eruit stappen',x:'Je baas hoort dat je wilt stoppen. "Niemand stopt zomaar," zegt hij.',
  ch:[['💶 Jezelf uitkopen',()=>{const k=Math.round(20000*S.str.lvl*(S.cpi||1));cash(-k);S.str.st='gestopt';kar(5);return `Het kost je ${fmt(k)}, maar je bent eruit.`}],
   ['🚚 Verhuizen naar een andere stad',()=>{S.str.st='gestopt';hap(-5);L('Je verhuist naar een andere stad om uit de handel te stappen.');S.p.city=pick(C().cities.filter(c=>c!==S.p.city))||S.p.city;return `Je begint opnieuw in ${S.p.city}. Niemand kent je hier.`}],
   ['🙅 Toch blijven',()=>'Je blijft. Voorlopig.']]});

/* ================= aanmelden bij de rest van het spel ================= */
F8.year.push(a=>{astYear(a);spyYear(a);sekteYear(a);strYear(a)});
F8.inc.push(()=>{const o=[];if(inJail())return o;const c=S.cpi||1;
  if(S.ast&&['opl','act'].includes(S.ast.st))o.push(['Ruimtevaart',Math.round(ASTSAL[S.ast.rank]*1000*c)]);
  if(S.spy&&S.spy.st==='act')o.push(['Inlichtingendienst',Math.round(SPYSAL[S.spy.rank]*1000*c)]);return o});
F8.busy.push(()=>f8Career()||!!(S.sekte&&!S.sekte.end));
F8.sub.push(()=>{if(S.ast&&['opl','act'].includes(S.ast.st))return `${ASTR[S.ast.rank]} · ${S.ast.ag}`;if(S.spy&&S.spy.st==='act')return S.spy.cover;if(S.sekte&&!S.sekte.end)return `Leider van ${S.sekte.n}`;return ''});
F8.job.push(el=>{let any=false;
  if(S.ast&&S.ast.st!=='gestopt'){any=true;row(el,{ic:'🧑‍🚀',t:ASTR[S.ast.rank],s:`${S.ast.ag} · ${fmt(ASTSAL[S.ast.rank]*1000*(S.cpi||1))} per jaar`,cls:'cur',on:()=>openSheet('Ruimtevaart',sheetAst,true)})}
  if(S.spy&&S.spy.st==='act'){any=true;row(el,{ic:'🕶️',t:SPYR[S.spy.rank],s:`Officieel: ${S.spy.cover.toLowerCase()}`,cls:'cur',on:()=>openSheet('Inlichtingendienst',sheetSpy,true)})}
  if(S.sekte&&!S.sekte.end){any=true;row(el,{ic:S.sekte.em,t:S.sekte.n,s:`${S.sekte.mem.toLocaleString('nl-NL')} volgelingen`,cls:'cur',on:()=>openSheet(S.sekte.n,sheetSekte,true)})}
  return any});
F8.special.push((el,a)=>{
  row(el,{ic:'🧑‍🚀',t:'Astronaut',s:a<25?'Vanaf 25 jaar':S.ast&&S.ast.st!=='gestopt'?ASTR[S.ast.rank]:'Selectie bij '+astAg(),dis:a<25,cls:'special',on:()=>S.ast&&S.ast.st!=='gestopt'?openSheet('Ruimtevaart',sheetAst,true):astApply()});
  row(el,{ic:'🕶️',t:'Inlichtingendienst',s:a<21?'Vanaf 21 jaar':S.spy&&S.spy.st==='act'?SPYR[S.spy.rank]:S.spy?'Je hebt hier gewerkt':'Solliciteren bij een dienst die niet bestaat',dis:a<21||!!(S.spy&&S.spy.st!=='act'),cls:'special',on:()=>S.spy&&S.spy.st==='act'?openSheet('Inlichtingendienst',sheetSpy,true):spyApply()});
  row(el,{ic:'🕯️',t:'Spirituele beweging',s:a<21?'Vanaf 21 jaar':S.sekte&&!S.sekte.end?`${S.sekte.n} · ${S.sekte.mem} volgelingen`:'Word goeroe van je eigen beweging',dis:a<21,cls:'special',on:()=>S.sekte&&!S.sekte.end?openSheet(S.sekte.n,sheetSekte,true):sekteStart()})});
ACTS.push(['straat','📦','Straathandel',()=>S.str&&S.str.st==='act'?`${STRR[S.str.lvl]} · ${S.str.turf} blokken`:'Handel in spullen die niet in de winkel liggen',16,OS('Straathandel',el=>sheetStr(el)),4]);
F8.ach.push(add=>{const f=S.flags;if(f.ruimte)add('ruimte');if(f.maan)add('maan');if(f.mars)add('mars');if(f.spyBaas)add('spionbaas');if(f.sekte)add('goeroe');if(f.str4)add('netwerkbaas')});
ACH.push(['ruimte','Gewichtloos','Ga de ruimte in'],['maan','Kleine stap','Loop op de maan'],['mars','De rode planeet','Zet voet op Mars'],['spionbaas','M','Word directeur van de inlichtingendienst'],['goeroe','Goeroe','Krijg duizend volgelingen'],['netwerkbaas','Netwerkbaas','Bereik de top van de straathandel']);
Object.assign(EVMETA,{ast_lancering:['Ruimtevaart','🚀'],ast_missie:['Ruimtevaart','🧑‍🚀'],ast_heimwee:['Ruimtevaart','🏠'],spy_werving:['Inlichtingendienst','🕶️'],spy_gevangen:['Inlichtingendienst','🚔'],spy_ontmaskerd:['Inlichtingendienst','📰'],spy_partner:['Inlichtingendienst','🛂'],spy_dubbel:['Inlichtingendienst','✉️'],sek_overloper:['Beweging','📺'],sek_ouders:['Beweging','👪'],sek_beroemd:['Beweging','🎤'],sek_profetie:['Beweging','🔮'],sek_inval:['Beweging','⚖️'],str_inval:['Straathandel','🚔'],str_tip:['Straathandel','🐀'],str_familie:['Straathandel','🎒'],str_stoppen:['Straathandel','🚪']});

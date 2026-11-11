/* ================= DEFENSIE (fase 1): krijgsmachtdelen, rangen, keuring, selectie ================= */
const MBR={
 land:{n:'Landmacht',k:'Koninklijke Landmacht',em:'🪖',school:'KMA'},
 marine:{n:'Marine',k:'Koninklijke Marine',em:'⚓',school:'KIM'},
 lucht:{n:'Luchtmacht',k:'Koninklijke Luchtmacht',em:'✈️',school:'KMA'},
 kmar:{n:'Marechaussee',k:'Koninklijke Marechaussee',em:'🛂',school:'KMA'}};
const MRANKS={
 man:{land:['Soldaat','Korporaal','Sergeant','Sergeant-majoor','Adjudant'],lucht:['Soldaat','Korporaal','Sergeant','Sergeant-majoor','Adjudant'],marine:['Matroos','Korporaal','Sergeant','Sergeant-majoor','Adjudant'],kmar:['Marechaussee','Wachtmeester','Opperwachtmeester','Adjudant']},
 off:{land:['Tweede luitenant','Eerste luitenant','Kapitein','Majoor','Luitenant-kolonel','Kolonel','Brigadegeneraal','Generaal-majoor','Luitenant-generaal','Generaal'],
  lucht:['Tweede luitenant','Eerste luitenant','Kapitein','Majoor','Luitenant-kolonel','Kolonel','Commodore','Generaal-majoor','Luitenant-generaal','Generaal'],
  marine:['Luitenant ter zee 3e klasse','Luitenant ter zee 2e klasse','Luitenant ter zee 1e klasse','Kapitein-luitenant ter zee','Kapitein ter zee','Commandeur','Schout-bij-nacht','Vice-admiraal','Luitenant-admiraal'],
  kmar:['Tweede luitenant','Eerste luitenant','Kapitein','Majoor','Luitenant-kolonel','Kolonel','Brigadegeneraal','Generaal-majoor','Luitenant-generaal']}};
const MSAL={man:[27,31,37,47,56],off:[40,48,60,72,85,98,118,138,162,192]};
const MYRS={man:[1,2,3,4,99],off:[2,2,3,4,4,4,3,3,3,99]};
// specialisaties: sel = selectie nodig (moeilijkheid 0-1), off = alleen officieren, sm = minimale slimheid, sp = minimale sportvaardigheid, pay = toeslag
const MSPECS=[
 {id:'inf',br:'land',n:'Infanterie',em:'🪖',d:'De basis van de landmacht: lopen, schieten, beschermen',base:1},
 {id:'cav',br:'land',n:'Cavalerie',em:'🛡️',d:'Tanks en pantservoertuigen'},
 {id:'art',br:'land',n:'Artillerie',em:'💥',d:'Zwaar geschut op grote afstand'},
 {id:'genie',br:'land',n:'Genie',em:'🌉',d:'Bruggen bouwen, wegen aanleggen, explosieven ruimen'},
 {id:'medic',br:'land',n:'Geneeskundige troepen',em:'⛑️',d:'Gewonden verzorgen in het veld',sm:50},
 {id:'luchtm',br:'land',n:'Luchtmobiel',em:'🪂',d:'Rode baret: parachutisten van 11 Luchtmobiele Brigade',sel:.45,sp:35,pay:1.06},
 {id:'kct',br:'land',n:'Korps Commandotroepen',em:'🗡️',d:'Groene baret: de zwaarste selectie van Nederland',sel:.85,sp:55,pay:1.15},
 {id:'cyber',br:'land',n:'Defensie Cyber Commando',em:'💻',d:'Digitale verdediging en aanval',sm:68,pay:1.08},
 {id:'mivd',br:'land',n:'Inlichtingen (MIVD)',em:'🕵️',d:'Informatie verzamelen, geheim werk',sm:70,off:1,pay:1.1},
 {id:'vloot',br:'marine',n:'Vloot',em:'🚢',d:'Aan boord van een fregat of patrouilleschip',base:1},
 {id:'mijn',br:'marine',n:'Mijnenbestrijding',em:'💣',d:'Zeemijnen opsporen en onschadelijk maken',sm:45},
 {id:'duik',br:'marine',n:'Duikdienst',em:'🤿',d:'Onderwaterwerk onder zware omstandigheden',sel:.5,sp:40,pay:1.08},
 {id:'onderzee',br:'marine',n:'Onderzeedienst',em:'🫧',d:'Weken onder water in een stalen buis',sel:.4,sm:55,pay:1.1},
 {id:'mar',br:'marine',n:'Korps Mariniers',em:'⚔️',d:'Blauwe baret: elite-infanterie van de marine',sel:.75,sp:50,pay:1.12},
 {id:'grond',br:'lucht',n:'Grondpersoneel',em:'🔧',d:'Vliegtuigen onderhouden en vliegbases draaiend houden',base:1},
 {id:'luchtv',br:'lucht',n:'Luchtverdediging',em:'📡',d:'Radar en luchtafweer: het luchtruim bewaken',sm:50},
 {id:'heli',br:'lucht',n:'Helikopterpiloot',em:'🚁',d:'Chinook, Apache of NH90 vliegen',sel:.65,sm:60,off:1,pay:1.15},
 {id:'f35',br:'lucht',n:'Gevechtspiloot',em:'🛩️',d:'De F-35: de felst begeerde plek van Defensie',sel:.92,sm:68,off:1,pay:1.28},
 {id:'grens',br:'kmar',n:'Grens- en luchthavenbewaking',em:'🛂',d:'Schiphol, de grenzen en het paspoortonderzoek',base:1},
 {id:'mil_pol',br:'kmar',n:'Militaire politie',em:'🚓',d:'Politie voor en binnen de krijgsmacht'},
 {id:'koning',br:'kmar',n:'Beveiliging Koninklijk Huis',em:'👑',d:'Paleizen en de koninklijke familie beschermen',sel:.4,pay:1.05},
 {id:'bsb',br:'kmar',n:'Brigade Speciale Beveiligingsopdrachten',em:'🎯',d:'De BSB: bewapende beveiliging en arrestatieteams',sel:.7,sp:45,pay:1.12}];
const MSPEC=id=>MSPECS.find(s=>s.id===id);
const milRanks=()=>MRANKS[S.mil.route][S.mil.br];
function milTitle(){const M=S.mil;if(!M)return'';if(M.cds)return'Commandant der Strijdkrachten';if(M.st==='opl')return M.route==='off'?`Cadet ${MBR[M.br].school}`:'Rekruut';const r=milRanks()[M.rank];return M.spec==='mar'&&M.route==='man'&&M.rank===0?'Marinier':r}
function milSal(){const M=S.mil;if(!M||inJail()||M.pow)return 0;let s=M.st==='opl'?(M.route==='off'?19:22):M.cds?235:MSAL[M.route][Math.min(M.rank,MSAL[M.route].length-1)];return Math.round(s*1000*(MSPEC(M.spec).pay||1)*(S.cpi||1)*(typeof law==='function'&&LAWS.defb?[.95,1,1.08][lawIdx('defb')]:1))}
function milFameT(){const M=S.mil;if(!M||inJail())return 0;if(M.cds)return 55;if(M.route==='off'&&M.rank>=6)return 15+(M.rank-6)*8;return 0}
const hasOffEdu=()=>S.edu.deg.some(d=>['havo','vwo','mbo','hbo','wo','master','phd'].includes(d.ty));
/* ---------- intreden ---------- */
function milJoinMenu(br){const a=ageY(),b=MBR[br];const offOk=hasOffEdu()&&a<=30,manOk=a<=35;
  modal({title:b.k,em:b.em,cat:'Defensie',text:`Hoe wil je bij de ${b.n.toLowerCase()} beginnen?`,choices:opts([
   {t:'🎖️ Als manschap',s:manOk?`Snel aan de slag als ${MRANKS.man[br][0].toLowerCase()} · ${fmt(MSAL.man[0]*1000*(S.cpi||1))} per jaar`:'Tot 35 jaar',dis:!manOk,on:()=>{closeModal();milKeuring(br,'man')}},
   {t:`🎓 Als officier via de ${b.school}`,s:offOk?'Eerst twee jaar opleiding, daarna een veel hoger plafond':a>30?'Tot 30 jaar':'Je hebt minstens een havo-, vwo- of mbo-diploma nodig',dis:!offOk,on:()=>{closeModal();milKeuring(br,'off')}}])})}
function milKeuring(br,route){if((S.crim.rec||[]).length){result('Afgekeurd','Met een strafblad kom je niet door de veiligheidsscreening.','',null,{em:'📋',cat:'Keuring'});return}
  if(S.st.health<35){result('Afgekeurd','De arts keurt je af op je gezondheid. Misschien later nog eens proberen.','',null,{em:'🩺',cat:'Keuring'});return}
  mgTap('Sportproef','Keuring: tik zo snel als je kunt. Push-ups, sit-ups en de shuttle run.',(sc,n)=>{const tot=sc*.6+S.sk.sport/250+S.st.health/400;
    doAct('Keuring',()=>{if(tot<.45){hap(-4);return `${n} herhalingen. Net niet genoeg: je bent afgekeurd voor de sportproef. Volgend jaar mag je het opnieuw proberen.`}
      if(S.job){L(`Je stopt als ${jobTitle().toLowerCase()}.`);endJob()}const sp=MSPECS.find(s=>s.br===br&&s.base).id;
      S.mil={br,route,spec:sp,rank:0,st:route==='off'?'opl':'act',opl:route==='off'?2:0,perf:55,yrs:0,ryrs:0,sel:{},past:[],since:year()};S.flags.mil=1;
      MS(route==='off'?`Begon aan de officiersopleiding (${MBR[br].school})`:`Ging bij de ${MBR[br].n.toLowerCase()}`,2);hap(6);
      return route==='off'?`Goedgekeurd! Je begint als cadet aan de ${MBR[br].school==='KIM'?'Koninklijk Instituut voor de Marine':'Koninklijke Militaire Academie'} in ${MBR[br].school==='KIM'?'Den Helder':'Breda'}.`:`Goedgekeurd! Na de algemene militaire opleiding ben je ${milTitle().toLowerCase()} bij de ${MBR[br].n.toLowerCase()}, onderdeel ${MSPEC(sp).n.toLowerCase()}.`},true,'📋')})}
/* ---------- selectie ---------- */
function milSelect(sid){const M=S.mil,sp=MSPEC(sid);if(M.sel[sid]===year()){toast('Je hebt dit jaar al een selectie gedaan.');return}M.sel[sid]=year();
  const stages=sid==='f35'||sid==='heli'?[['react','Reactietest','Reageer bliksemsnel als het lampje groen wordt.'],['dodge','Vliegsimulator','Ontwijk alles in de simulator.'],['aim','Doelen aanvliegen','Raak het doel.']]
   :sid==='onderzee'?[['tap','Druktest','Hou het vol in de drukkamer.'],['react','Sonar','Reageer zodra je het signaal hoort.']]
   :[['tap','Mars','40 kilometer met bepakking. Blijf tikken.'],['dodge','Hindernisbaan','Door de modder, onder het prikkeldraad.'],['aim','Schietproef','Raak het doel, ook als je kapot bent.']];
  let score=0,i=0;
  const next=()=>{if(i>=stages.length)return done();const [k,t,d]=stages[i];const go=v=>{score+=v;i++;if(i<stages.length&&i===Math.floor(stages.length/2)+0&&stages.length>2)midQuit();else next()};
    if(k==='tap')mgTap(t,d,(sc)=>go(sc));else if(k==='dodge')mgDodge({title:t,desc:d,em:sp.em,me:sid==='f35'?'🛩️':sid==='heli'?'🚁':'🏃',obs:sid==='f35'||sid==='heli'?['🌩️','🛸','🏔️']:['🪵','🧱','🚧','💧'],secs:12,hard:sp.sel},(h,tot)=>go(h/tot));
    else if(k==='aim')mgAim({title:t,desc:d,em:'🎯',n:3},(p,mx)=>go(p/mx));else mgReact({title:t,desc:d,em:sp.em,idle:'🔴',go:'🟢',fake:'🟠',goTxt:'NU!',btn:'Reageer',rounds:3},(h,n)=>go(h/n))};
  const midQuit=()=>modal({title:'Dag 4',em:'🌧️',cat:'Selectie',text:'Je hebt drie nachten nauwelijks geslapen. Het regent, je voeten zitten onder de blaren. De instructeur vraagt: "Wil je stoppen? Dan zit je vanavond in een warm bed."',choices:[{t:'💪 Doorgaan',cls:'go',on:()=>{closeModal();next()}},{t:'🛏️ Opgeven',on:()=>{closeModal();doAct('Selectie',()=>{hap(-6);return `Je trekt aan de bel. Het voelt als een opluchting en een nederlaag tegelijk. Je blijft bij de ${MSPEC(M.spec).n.toLowerCase()}.`},true,sp.em)}}]});
  const done=()=>doAct('Selectie',()=>{const avg=score/stages.length;const p=clamp(avg*.55+S.sk.sport/220+(S.st.health-50)/250+(S.st.smarts-50)/(sid==='f35'||sid==='heli'||sid==='onderzee'?150:400)+(1-sp.sel)*.55-.35,.02,.95);
    if(chance(p)){M.spec=sid;M.perf=clamp(M.perf+8);hap(15);sk('sport',4);S.flags['mil_'+sid]=1;MS(sid==='kct'?'Haalde de groene baret':sid==='mar'?'Haalde de blauwe baret':sid==='luchtm'?'Haalde de rode baret':sid==='f35'?'Werd gevechtspiloot':`Kwam door de selectie: ${sp.n.toLowerCase()}`,3);
      return sid==='kct'?'Je hebt het gehaald. Op de laatste dag krijg je de groene baret opgezet. Je handen trillen.':sid==='f35'?'Van de honderd kandidaten zijn er vier over. Jij bent er één van. Op naar de vliegopleiding in de Verenigde Staten!':`Gehaald! Je hoort nu bij de ${sp.n.toLowerCase()}.`}
    hap(-8);sk('sport',2);return `Afgevallen. ${pick(['Je enkel geeft het op tijdens de mars.','Je haalt de tijdslimiet net niet.','De psycholoog vindt je nog niet klaar.','Bij de laatste proef gaat het mis.'])} Volgend jaar mag je het opnieuw proberen.`},true,sp.em);
  modal({title:sp.n,em:sp.em,cat:'Selectie',text:`${sp.d}. De selectie bestaat uit ${stages.length} zware proeven. ${sp.sel>.8?'Minder dan één op de tien haalt het.':sp.sel>.6?'De meesten vallen af.':'Een flink deel valt af.'}`,choices:opts([{t:'Beginnen',cls:'go',on:()=>{closeModal();next()}}])})}
/* ---------- jaarlijks ---------- */
function milMigrate(){if(S.job&&S.job.id==='soldaat'){const map=[['man',0],['man',2],['off',1],['off',5],['off',9]][S.job.lvl]||['man',0];S.mil={br:'land',route:map[0],spec:'inf',rank:map[1],st:'act',opl:0,perf:S.job.perf||55,yrs:S.job.yrs,ryrs:S.job.lyrs||0,sel:{},past:[],since:year()-S.job.yrs};S.job=null;L('Je loopbaan bij Defensie gaat verder bij de landmacht.','sys')}}
function milYear(a){milMigrate();const M=S.mil;if(!M||inJail())return;if(M.pow){M.yrs++;hap(-5);hea(-2);return}M.yrs++;
  if(M.st==='opl'){M.opl--;sma(2);sk('sport',2);if(M.opl<=0){M.st='act';M.rank=0;M.ryrs=0;hap(10);MS(`Werd beëdigd als ${milRanks()[0].toLowerCase()}`,2);L(`Je bent afgestudeerd aan de ${MBR[M.br].school}! Je bent nu ${milRanks()[0].toLowerCase()}.`,'good big')}return}
  M.ryrs++;const hard=(S.lastActs||{}).mtrain||0;M.perf=clamp(M.perf+(58-M.perf)*.25+ri(-5,5)+Math.min(6,hard*2)+(S.sk.sport-40)/40+(S.st.smarts-50)/50+(S.st.happy<25?-4:0));sk('sport',ri(0,2));
  const R_=milRanks();
  if(!M.cds&&M.rank<R_.length-1&&M.ryrs>=MYRS[M.route][M.rank]){const top=M.route==='off'&&M.rank>=5;const ch=top?(M.perf-72)/70:(M.perf-55)/50+.25;if(chance(clamp(ch,0,top?.45:.85))){M.rank++;M.ryrs=0;M.perf=clamp(M.perf-6);hap(8);const t=R_[M.rank];L(`Bevorderd! Je bent nu ${t.toLowerCase()}.`,'good big');MS(`Werd bevorderd tot ${t.toLowerCase()}`,M.rank>=6&&M.route==='off'?3:1);if(M.route==='off'&&M.rank>=6)S.flags.generaal=1}}
  if(!M.cds&&M.route==='off'&&M.rank===R_.length-1&&M.ryrs>=2&&M.perf>=78&&chance(.3))Q.push({id:'mil_cds'});
  if(M.perf<15&&chance(.4)){milLeave('Je contract wordt niet verlengd wegens slechte beoordelingen.','bad');return}
  const ret=M.route==='off'?62:58;if(a>=ret){milLeave(`Je gaat met functioneel leeftijdsontslag. Na ${M.yrs} jaar trek je je uniform voor het laatst uit.`,'big');return}
  if(M.cds&&M.cdsY&&year()-M.cdsY>=4){M.cds=0;milLeave('Je termijn als Commandant der Strijdkrachten zit erop. Je gaat met pensioen.','big')}}
function milLeave(why,c){const M=S.mil;if(!M)return;S.jobs.push({t:milTitle(),co:MBR[M.br].k,y:M.yrs,mil:1});const w=why||'';S.pmil={br:M.br,t:milTitle(),spec:M.spec,yrs:M.yrs,route:M.route,rank:M.rank,cds:M.cds||M.wasCds,sal:milSal(),med:(M.med||[]).slice(),mis_n:(M.mis_n||0)+((S.pmil&&S.pmil.mis_n)||0),tr:M.tr||0,vet:(M.mis_n||0)>0||!!M.warS||!!(S.pmil&&S.pmil.vet),fpu:/leeftijdsontslag/.test(w),inv:/medisch/.test(w)};if(S.pmil.vet)S.flags.veteraan=1;S.mil=null;L(why||'Je verlaat Defensie.',c||'');}
E('mil_cds',{sys:1,need:()=>!!S.mil,t:'Commandant der Strijdkrachten',x:'De minister van Defensie belt. Het kabinet wil jou benoemen tot Commandant der Strijdkrachten: de hoogste militair van Nederland.',ch:[
 ['🫡 Ja, ik neem het aan',()=>{const M=S.mil;M.cds=1;M.wasCds=1;M.cdsY=year();S.flags.cds=1;S.fame=clamp(S.fame+15);hap(15);MS('Werd Commandant der Strijdkrachten',3);return 'Je wordt beëdigd. Vanaf nu ben jij de hoogste militair van het land.'}],
 ['🙅 Nee, ik blijf waar ik ben',()=>'Je bedankt voor de eer.']]});
EVMETA.mil_cds=['Defensie','🎖️'];
/* ---------- scherm ---------- */
function sheetMil(el){milMigrate();const a=ageY(),M=S.mil;
  if(!M){card(el,`<h3>🪖 Defensie</h3><span class="muted">Kies een krijgsmachtdeel. Begin als manschap of word officier via de militaire academie. Voor commando's, mariniers en piloten volgt later een zware selectie.</span>`);
    if(a<17){empty(el,'Bij Defensie kun je vanaf 17 jaar.');return}
    if(warW().lvl)warCard(el);vetSec(el);
    const s=sec(el,'Krijgsmachtdelen');for(const k in MBR){const b=MBR[k];row(s,{ic:b.em,t:b.k,s:MSPECS.filter(x=>x.br===k).map(x=>x.n).slice(0,4).join(', ')+'…',dis:a>35,on:()=>milJoinMenu(k)})}return}
  const sp=MSPEC(M.spec),R_=milRanks();if(warW().lvl)warCard(el);
  if(M.pow){card(el,`<h3>⛓️ Krijgsgevangen</h3><span class="muted">Je zit als ${he(milTitle().toLowerCase())} in een krijgsgevangenenkamp. Je komt pas vrij bij de bevrijding.</span>`);return}
  card(el,`<h3>${sp.em} ${he(milTitle())}</h3><span class="muted">${he(MBR[M.br].k)} · ${he(sp.n)} · ${M.yrs} jaar in dienst</span>${kv([['Salaris',fmt(milSal())+' per jaar'],...(M.st==='opl'?[['Opleiding',`Nog ${M.opl} jaar aan de ${MBR[M.br].school}`]]:[['Rang',M.cds?'Hoogste militair van Nederland':`${M.rank+1} van ${R_.length}`],['Volgende rang',M.cds||M.rank>=R_.length-1?'—':R_[M.rank+1]],...(M.cds||M.rank>=R_.length-1?[]:[['In deze rang',`${M.ryrs} ${M.ryrs===1?'jaar':'jaar'} · bevordering kan na ${MYRS[M.route][M.rank]} jaar`]])])])}<div class="stat"><span>Beoordeling</span><span></span><span class="v">${Math.round(M.perf)}%</span>${bar(M.perf)}</div>${M.st==='opl'?'':milBars()}`);
  const s=sec(el,M.st==='opl'?'Opleiding':'Dienst');const D=(t,fn,ic)=>()=>doAct(t,fn,true,ic);
  if(M.st==='opl'){row(s,{ic:'📚',t:'Studeren',s:'Krijgsgeschiedenis, tactiek, leiderschap',on:D('Studeren',()=>{const m=use('mstudy');M.perf=clamp(M.perf+Math.round(5*m));sma(Math.round(2*m));return pick(['Je schrijft een essay over de Slag om Arnhem.','Je leert kaartlezen en tactiek tot diep in de nacht.','Je oefent leidinggeven in het veld.'])},'📚')});
    row(s,{ic:'🏃',t:'Conditietraining',s:'Minigame',dots:true,on:()=>mgTap('Conditietraining','Hardlopen met bepakking.',sc=>doAct('Training',()=>{use('mtrain');M.perf=clamp(M.perf+Math.round(sc*6));sk('sport',Math.round(1+sc*3));hea(1);return sc>.6?'Je loopt de hele groep eruit.':'Je hijgt, maar je haalt het.'},true,'🏃'))})}
  else{row(s,{ic:'🏋️',t:'Extra trainen',s:'Sterker en fitter worden',on:D('Training',()=>{const m=use('mtrain');sk('sport',Math.round(3*m));hea(1);M.perf=clamp(M.perf+Math.round(3*m));return pick(['Je traint in de kazernegym tot je armen trillen.','Je loopt 15 kilometer met 20 kilo op je rug.','Je doet mee aan de ochtendtraining van 5 uur.'])},'🏋️')});
    row(s,{ic:'🎯',t:'Naar de schietbaan',s:'Minigame',dots:true,on:()=>mgAim({title:'Schietbaan',desc:'Raak de schijf zo vaak mogelijk.',em:'🎯',n:3},(p,mx)=>doAct('Schietbaan',()=>{use('mshoot');const sc=p/mx;M.perf=clamp(M.perf+Math.round((sc-.4)*10));return sc>=.8?'Scherpschutter! Je instructeur kijkt twee keer naar de schijf.':sc>=.5?'Een degelijk resultaat.':'Je mist meer dan je raakt.'},true,'🎯'))});
    row(s,{ic:'📘',t:'Cursus volgen',s:M.route==='off'?'Stafcursus, leiderschap':'Vakopleiding, leiderschap',on:D('Cursus',()=>{const m=use('mcurs');M.perf=clamp(M.perf+Math.round(4*m));sma(1);return `Je volgt de cursus ${pick(M.route==='off'?['Hogere Defensievorming','tactiek voor compagniescommandanten','internationale operaties']:['groepscommandant','EHBO in het veld','rijbewijs voor militaire voertuigen'])}.`},'📘')})}
  if(M.st!=='opl'){const o=sec(el,'Loopbaan');
    for(const x of MSPECS.filter(x=>x.br===M.br&&x.id!==M.spec&&x.sel)){const why=x.off&&M.route!=='off'?'Alleen voor officieren':x.sm&&S.st.smarts<x.sm?`Slimheid minimaal ${x.sm}%`:M.yrs<1?'Na je eerste jaar':M.sel[x.id]===year()?'Volgend jaar opnieuw':a>32?'Tot 32 jaar':'';
      row(o,{ic:x.em,t:`Selectie: ${x.n}`,s:why||x.d,dis:!!why,dots:true,on:()=>milSelect(x.id)})}
    const free=MSPECS.filter(x=>x.br===M.br&&x.id!==M.spec&&!x.sel&&(!x.off||M.route==='off'));
    if(free.length)row(o,{ic:'🔁',t:'Overplaatsing aanvragen',s:'Naar een ander onderdeel zonder selectie',dots:true,dis:!!S.acts.mover,on:()=>modal({title:'Overplaatsing',em:'🔁',cat:'Defensie',text:'Naar welk onderdeel wil je?',choices:opts(free.map(x=>({t:`${x.em} ${x.n}`,s:x.sm&&S.st.smarts<x.sm?`Slimheid minimaal ${x.sm}%`:x.d,dis:!!(x.sm&&S.st.smarts<x.sm),on:()=>{closeModal();doAct('Overplaatsing',()=>{S.acts.mover=1;M.past.push(MSPEC(M.spec).n);M.spec=x.id;return `Je wordt overgeplaatst naar ${x.n.toLowerCase()}.`},true,x.em)}})))})});
    if(M.route==='man'&&M.rank>=2&&a<40)row(o,{ic:'🎓',t:'Doorstromen naar officier',s:'Verkorte officiersopleiding',dots:true,on:()=>ask('Officier worden?',`Je volgt een jaar de verkorte opleiding aan de ${MBR[M.br].school}. Daarna begin je als ${MRANKS.off[M.br][0].toLowerCase()}.`,'Doen',()=>doAct('Doorstromen',()=>{M.route='off';M.st='opl';M.opl=1;M.rank=0;M.ryrs=0;MS('Stroomde door naar de officiersopleiding',1);return 'Je begint aan de officiersopleiding. Je oude maten noemen je nu "meneer".'},true,'🎓'),'go')});}
  milMore(el);warCmdSec(el);if(typeof coupRow==='function')coupRow(el);
  const x=sec(el,'');row(x,{ic:'🚪',t:'Ontslag nemen',dots:true,on:()=>ask('Uit dienst?','Je verlaat Defensie.','Ontslag nemen',()=>{milLeave('Je neemt ontslag bij Defensie.');refreshSheet();render();saveLife()})})}
{const j=JOBS.find(x=>x.id==='soldaat');if(j)j.hide=1}

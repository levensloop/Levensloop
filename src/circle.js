/* ---------- collega's, klasgenoten, teamgenoten en tegenstanders ---------- */
// S.circ = {work:{k,ppl},school:{k,ppl},sport:{k,ppl}} · vrienden/partners worden {ref:id} naar S.rel
const CIRC={
  work:{n:'Collega\'s',em:'👥',auth:'HR',lead:'leidinggevende',mate:'collega'},
  school:{n:'Klasgenoten',em:'🎒',auth:'de schoolleiding',lead:'mentor',mate:'klasgenoot'},
  study:{n:'Studiegenoten',em:'🎒',auth:'de opleiding',lead:'docent',mate:'studiegenoot'},
  team:{n:'Teamgenoten',em:'🤾',auth:'de club',lead:'coach',mate:'teamgenoot'},
  solo:{n:'Tegenstanders',em:'🥇',auth:'de bond',lead:'coach',mate:'tegenstander'}};
function circKind(slot){if(slot==='work')return S.job&&S.job.id!=='prosport'?'work':null;
  if(slot==='school')return S.edu.stage==='basis'||S.edu.stage==='middel'?'school':S.edu.cur?'study':null;
  if(slot==='sport'){const P=S.sport;if(!P||P.st==='gestopt')return null;return SPORTS[P.id].team?'team':'solo'}return null}
function circKey(slot){const E=S.edu,P=S.sport;
  return slot==='work'?(S.job?S.job.id+'|'+S.job.co:''):slot==='school'?(E.cur?'c|'+E.cur.name:E.stage+'|'+(E.lvl||'')):(P?P.id+'|'+P.st+'|'+(P.team||''):'')}
function circMk(kind,lead){const a=ageY(),K=CIRC[kind];let age;
  if(lead)age=kind==='work'?ri(Math.max(28,a+3),Math.max(40,a+20)):ri(30,60);
  else if(kind==='school')age=a+ri(-1,1);else if(kind==='study')age=a+ri(-1,3);
  else if(kind==='work')age=clamp(a+ri(-10,14),18,66);else age=clamp(a+ri(-4,4),Math.min(a,12),45);
  const p=mkPerson(lead?K.lead:K.mate,pick(['m','v']),S.m-Math.max(0,age)*12-ri(0,11),{rel:ri(35,60),cx:kind});
  if(kind==='solo'&&!lead)p.sk=clamp((S.sport?S.sport.sk:40)+ri(-15,15));if(kind==='team'&&!lead)p.sk=clamp((S.sport?S.sport.sk:40)+ri(-12,12));
  if(lead)p.lead=1;return p}
function circle(slot){const kind=circKind(slot);if(!kind)return null;S.circ=S.circ||{};const k=circKey(slot);let c=S.circ[slot];
  if(!c||c.k!==k||c.kind!==kind){const n=kind==='work'?ri(4,6):kind==='solo'?ri(3,5):ri(5,7);
    c=S.circ[slot]={k,kind,ppl:[circMk(kind,1)].concat(Array.from({length:n},()=>circMk(kind,0)))}}
  return c}
const circPpl=c=>c.ppl.map(x=>x.ref?P(x.ref):x).filter(p=>p&&p.alive!==false);
function circRow(el,slot){const c=circle(slot);if(!c)return;const K=CIRC[c.kind];const s=sec(el,'');
  row(s,{ic:K.em,t:K.n,s:`${circPpl(c).length} personen · ${K.lead==='coach'?'met je coach':'met je '+K.lead}`,on:()=>openSheet(K.n,el=>sheetCirc(el,slot),true)})}
function circRole(p,kind){const K=CIRC[kind];const r=p.role;if(r==='partner')return cap(partnerWord(p))+' · '+(p.lead?K.lead:K.mate);if(r==='vriend'||r==='vijand')return cap(relWord(p))+' · '+(p.lead?K.lead:K.mate);return cap(p.lead?K.lead:K.mate)}
function sheetCirc(el,slot){const c=circle(slot);if(!c){empty(el,'Hier ben je niet meer.');return}const K=CIRC[c.kind],ps=circPpl(c);
  const st=circStrikes(slot);if(st>0)card(el,`<span class="muted">Meldingen bij ${K.auth}: <b style="color:${st>=3?'var(--bad)':'inherit'}">${st}</b>${st>=3?' · nog één keer te ver en het gaat mis':''}</span>`);
  const lead=ps.filter(p=>p.lead),rest=ps.filter(p=>!p.lead);
  for(const [lab,list] of [[cap(K.lead),lead],[K.n,rest]]){if(!list.length)continue;const s=sec(el,lab);
    for(const p of list)row(s,{ic:faceOf(p),t:`${p.first} ${p.last||''}`.trim(),role:circRole(p,c.kind),bar:{l:'Relatie',v:p.rel,c:statCol(p.rel)},on:()=>openSheet(p.first,el=>sheetCircP(el,slot,p),true)})}}
// meldingen: werk → HR, school → schoolleiding, sport → club/bond
function circStrikes(slot){return slot==='work'?(S.job&&S.job.hr)||0:slot==='school'?S.edu.strk||0:(S.sport&&S.sport.strk)||0}
function report(slot,sev,why){const c=circle(slot);if(!c)return '';const K=CIRC[c.kind];let n;
  if(slot==='work'){S.job.hr=(S.job.hr||0)+sev;n=S.job.hr;
    if(sev>=5||n>=5){const t=jobTitle().toLowerCase();endJob();hap(-10);MS(`Werd ontslagen als ${t}`,1);return ` ${why} HR grijpt in: je bent op staande voet ontslagen.`}
    if(n>=4){(S.job&&(S.job.perf=clamp(S.job.perf-12)));return ` ${why} Laatste waarschuwing van HR: nog één keer en je ligt eruit.`}
    if(n>=3){(S.job&&(S.job.perf=clamp(S.job.perf-10)));return ` ${why} Je krijgt een officiële waarschuwing van HR.`}
    (S.job&&(S.job.perf=clamp(S.job.perf-4)));return ` ${why} Je moet op gesprek bij HR.`}
  if(slot==='school'){const E=S.edu;E.strk=(E.strk||0)+sev;n=E.strk;
    if(E.cur&&(sev>=5||n>=5)){const nm=E.cur.name;E.cur=null;hap(-8);MS(`Werd van ${nm} gestuurd`,1);return ` ${why} Je wordt van je opleiding gestuurd.`}
    if(!E.cur&&(sev>=5||n>=5)){E.strk=1;for(const k in (E.gr||{}))E.gr[k]=clampG(E.gr[k]-.5);if(typeof gradesPerf==='function')E.perf=gradesPerf();relAdj('moeder',-10);relAdj('vader',-10);hap(-5);S.circ.school=null;return ` ${why} Je wordt van school gestuurd en moet naar een andere school. Je ouders zijn woedend.`}
    if(n>=3){if(E.cur)E.cur.perf=clamp(E.cur.perf-8);else{for(const k in (E.gr||{}))E.gr[k]=clampG(E.gr[k]-.3);if(typeof gradesPerf==='function')E.perf=gradesPerf();relAdj('moeder',-5);relAdj('vader',-5)}return ` ${why} Je wordt een week geschorst.`}
    return ` ${why} Je moet bij ${E.cur?'de opleidingsmanager':'de directeur'} komen${E.cur?'':' en je ouders worden gebeld'}.`}
  const Pp=S.sport;Pp.strk=(Pp.strk||0)+sev;n=Pp.strk;
  if(sev>=5||n>=5){if(Pp.st==='pro'&&S.job){const f=Math.round(salary()*.15);cash(-f);(S.job&&(S.job.perf=clamp(S.job.perf-15)));Pp.strk=2;return ` ${why} ${cap(K.auth)} schorst je voor een halve competitie en je krijgt een boete van ${fmt(f)}.`}
    Pp.sk=clamp(Pp.sk-5);Pp.strk=2;return ` ${why} Je wordt voor de rest van het seizoen geschorst.`}
  if(n>=3){if(S.job&&Pp.st==='pro')(S.job&&(S.job.perf=clamp(S.job.perf-6)));return ` ${why} Je wordt een paar wedstrijden geschorst.`}
  return ` ${why} ${K.lead==='coach'?'Je coach':cap(K.auth)} neemt je apart voor een stevig gesprek.`}
function circYear(){if(S.job&&S.job.hr)S.job.hr=Math.max(0,S.job.hr-1);if(S.edu.strk)S.edu.strk=Math.max(0,S.edu.strk-1);if(S.sport&&S.sport.strk)S.sport.strk=Math.max(0,S.sport.strk-1);
  if(!S.circ)return;const w=S.circ.work;if(w&&S.job&&w.k===circKey('work')){for(const p of w.ppl){if(p.ref||p.lead)continue;p.rel=clamp(p.rel-ri(0,2))}
    if(chance(.25)){const i=w.ppl.findIndex(p=>!p.ref&&!p.lead);if(i>=0){const old=w.ppl[i];w.ppl[i]=circMk('work',0);L(`Je collega ${old.first} is vertrokken. ${w.ppl[i].first} komt erbij.`,'sys')}}}}
// acties met één persoon
function sheetCircP(el,slot,p){const c=circle(slot);if(!c){empty(el,'Hier ben je niet meer.');return}const kind=c.kind,K=CIRC[kind],a=pAge(p),my=ageY(),lead=!!p.lead;
  card(el,`<h3>${faceOf(p)} ${he(p.first+' '+(p.last||''))}</h3><span class="muted">${circRole(p,kind)} · ${a} jaar</span><div class="stat"><span>Relatie</span><span></span><span class="v">${Math.round(p.rel)}%</span>${bar(p.rel)}</div><div class="stat"><span>Slimheid</span><span></span><span class="v">${Math.round(p.smarts)}%</span>${bar(p.smarts,'var(--brand)')}</div><div class="stat"><span>Uiterlijk</span><span></span><span class="v">${Math.round(p.looks)}%</span>${bar(p.looks,'var(--brand)')}</div>`);
  const s=sec(el,'Acties');const done=()=>{refreshSheet();render()};
  const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,dots:o.dots,on:()=>doAct(t,fn,true,ic)});
  const bump=(k,lo,hi)=>{const m=use(k+p.id);p.rel=clamp(p.rel+Math.round(ri(lo,hi)*m));return m};
  row(s,{ic:'💬',t:'Gesprek voeren',s:'Kies een onderwerp',dots:true,on:()=>talk(p)});
  A('🌹','Compliment geven',()=>{bump('comp',2,6);kar(1);return `${p.first} waardeert het.`});
  A('☕',kind==='work'?'Samen lunchen':kind==='solo'?'Sportief feliciteren':kind==='team'?'Na de training wat drinken':'Samen pauze houden',()=>{bump('pauze',3,8);hap(1);return kind==='solo'?`Je feliciteert ${p.first} met de laatste wedstrijd. Er ontstaat wederzijds respect.`:`Je kletst gezellig met ${p.first}.`});
  // rol-specifiek
  if(kind==='work'&&!lead)A('🤝','Samenwerken aan een project',()=>{const m=bump('samen',2,6);(S.job&&(S.job.perf=clamp(S.job.perf+Math.round((p.smarts>60?5:3)*m))));return p.smarts>60?`${p.first} is slim: samen leveren jullie iets moois af.`:`Het project loopt, al moet jij veel uitleggen aan ${p.first}.`});
  if(kind==='work'&&lead)A('🍏','Slijmen',()=>{const m=bump('slijm',2,6);(S.job&&(S.job.perf=clamp(S.job.perf+Math.round(3*m))));return chance(.3)?`${p.first} prikt er doorheen, maar vindt het stiekem wel leuk.`:`${p.first} lacht om je grapjes. Dat kan geen kwaad.`});
  if((kind==='school'||kind==='study')&&!lead)A('📚','Samen huiswerk maken',()=>{const m=bump('hw',2,6);const g=(p.smarts>60?.3:.15)*m;if(kind==='study'&&S.edu.cur)S.edu.cur.perf=clamp(S.edu.cur.perf+g*15);else{for(const k in (S.edu.gr||{}))S.edu.gr[k]=clampG(S.edu.gr[k]+g);if(typeof gradesPerf==='function')S.edu.perf=gradesPerf()}return p.smarts>60?`${p.first} legt alles haarfijn uit.`:`Jullie kletsen meer dan dat jullie leren.`});
  if((kind==='school'||kind==='study')&&lead)A('🙋','Om hulp vragen',()=>{const m=bump('hulp',2,5);if(kind==='study'&&S.edu.cur)S.edu.cur.perf=clamp(S.edu.cur.perf+4*m);else{for(const k in (S.edu.gr||{}))S.edu.gr[k]=clampG(S.edu.gr[k]+.25*m);if(typeof gradesPerf==='function')S.edu.perf=gradesPerf()}sma(Math.round(1*m));return `${p.first} neemt de tijd voor je.`});
  if((kind==='school'||kind==='study')&&!lead)A('👀','Spieken bij '+p.first,()=>{use('spiek');if(chance(.3)){p.rel=clamp(p.rel-8);kar(-2);return `Je wordt betrapt.`+report('school',1,`${p.first} wordt er ook op aangesproken.`)}const g=p.smarts>55?.4:-.2;for(const k in (S.edu.gr||{}))S.edu.gr[k]=clampG(S.edu.gr[k]+g);if(S.edu.cur)S.edu.cur.perf=clamp(S.edu.cur.perf+g*10);if(typeof gradesPerf==='function'&&!S.edu.cur)S.edu.perf=gradesPerf();return g>0?`Niemand ziet het. ${p.first} had alles goed.`:`Niemand ziet het, maar ${p.first} had alles fout.`},{dots:true});
  if(kind==='team'&&!lead)A('🏋️','Samen extra trainen',()=>{const m=bump('tr',2,6);S.sport.sk=clamp(S.sport.sk+(p.sk>S.sport.sk?2:1)*m);return p.sk>S.sport.sk?`${p.first} is beter dan jij. Je leert veel.`:`Je helpt ${p.first} vooruit en blijft zelf scherp.`});
  if((kind==='team'||kind==='solo')&&lead)A('📋','Om advies vragen',()=>{const m=bump('adv',2,5);S.sport.sk=clamp(S.sport.sk+Math.round(2*m));return `${p.first} geeft je een paar gouden tips.`});
  if(kind==='solo'&&!lead)A('⚔️','Uitdagen voor een oefenpartij',()=>{use('duel'+p.id);const win=S.sport.sk+ri(-15,15)>=p.sk;if(win){hap(3);S.sport.sk=clamp(S.sport.sk+1);p.rel=clamp(p.rel-2);return `Je wint van ${p.first}!`}hap(-1);p.rel=clamp(p.rel+2);return `${p.first} is te sterk vandaag.`},{dots:true});
  // vriendschap en liefde
  if(p.role!=='vriend'&&p.role!=='partner')A('🫶','Vrienden worden',()=>{if(living('vriend').length>=8)return 'Je hebt al genoeg vrienden.';if(chance(p.rel/100)){circFriend(slot,p);return `${p.first} wil graag bevriend raken. Een nieuwe vriend!`}p.rel=clamp(p.rel-3);return `${p.first} houdt het liever professioneel.`},{dis:p.rel<40,s:p.rel<40?'Eerst een betere band nodig':''});
  const ageOk=(my>=18&&a>=18&&Math.abs(my-a)<=15)||(my>=14&&my<18&&a>=14&&a<18);
  if(ageOk&&p.role!=='partner'){
    A('😏','Flirten',()=>{const cnt=(p.fl=(p.fl||0)+1);const into=p.rel/100*.6+(S.st.looks-p.looks)/200+.15;if(chance(into)){p.rel=clamp(p.rel+ri(3,8));p.into=1;const pt=partner();if(pt&&chance(.25)){pt.rel=clamp(pt.rel-15);return `${p.first} flirt terug. Helaas ziet ${pt.first} het gebeuren en is woedend.`}return `${p.first} flirt terug.`}p.rel=clamp(p.rel-ri(5,12));
      if(cnt>=2||lead||kind==='work')if(chance(lead?.6:cnt>=2?.5:.2))return `${p.first} voelt zich ongemakkelijk.`+report(slotOf(kind),cnt>=3?3:2,`${p.first} dient een klacht in over ongewenst gedrag.`);return `${p.first} reageert ongemakkelijk.`},{dots:true});
    A('💘','Mee uit vragen',()=>{if(partner())return 'Je hebt al een relatie.';const p0=p.into?.7:p.rel/130;if(chance(p0)){circLove(slot,p);return `${p.first} zegt ja! Jullie hebben een relatie.`+(kind==='work'&&lead?' Of HR dat leuk vindt...':'')}p.rel=clamp(p.rel-10);if(lead&&chance(.5))return `${p.first} wijst je af.`+report(slotOf(kind),2,'Dit wordt gemeld.');return `${p.first} wijst je beleefd af.`},{dis:p.rel<45,s:p.rel<45?'Eerst een betere band nodig':''})}
  // de verkeerde kant op
  A('🙄','Roddelen over '+p.first,()=>{use('rod');hap(1);if(chance(.35)){p.rel=clamp(p.rel-ri(10,20));kar(-2);return `${p.first} komt erachter.`+(chance(.4)?report(slotOf(kind),1,`${p.first} stapt naar ${K.auth}.`):'')}return 'Je collega\'s liggen dubbel. Niemand vertelt het door.'.replace('collega\'s',kind==='work'?'collega\'s':kind==='team'||kind==='solo'?'teamgenoten':'klasgenoten')});
  A('🤡','Een grap uithalen',()=>{use('grap');if(chance(.5)){hap(2);p.rel=clamp(p.rel+(chance(.5)?3:-5));return pick([`Je verstopt de spullen van ${p.first}. Iedereen moet lachen.`,`Je zet een scheetkussen op de stoel van ${p.first}.`])}p.rel=clamp(p.rel-ri(8,15));return `${p.first} kan er niet om lachen.`+report(slotOf(kind),1,'Er wordt over geklaagd.')},{dots:true});
  A('🤬','Beledigen',()=>{p.rel=clamp(p.rel-ri(10,25));kar(-3);if(p.rel<=5&&p.role!=='partner')p.foe=1;const risk=(lead?.65:.3)+(kind==='solo'?-.1:0);return `${p.first} is diep gekwetst.`+(chance(risk)?report(slotOf(kind),lead?2:1,`${p.first} meldt het bij ${K.auth}.`):'')},{dots:true});
  row(s,{ic:'👊',t:'Aanvallen',s:'Je kiest zelf je aanvallen · grote kans op ernstige gevolgen',dots:true,on:()=>{const fsk=p.sk!=null?Math.round(p.sk*.6):lead?ri(20,50):ri(10,45);
    fightFlow({foe:{first:p.first,sk:fsk,hp:ri(70,100)},title:`Gevecht met ${p.first}`,cat:K.n,kill:()=>{p.alive=false;p.died=ageY()},end:res=>{p.rel=clamp(p.rel-40);kar(-6);const w=res==='win'?`Je wint het gevecht van ${p.first}.`:res==='flee'?`Je rent weg voor ${p.first}.`:`${p.first} is sterker dan je dacht.`;return w+report(slotOf(kind),res==='flee'?3:5,'Er waren getuigen.')}})}});
}
const slotOf=kind=>kind==='work'?'work':kind==='school'||kind==='study'?'school':'sport';
function circSlot(c,p){const i=c.ppl.indexOf(p);if(i>=0)c.ppl[i]={ref:p.id}}
function circFriend(slot,p){const c=circle(slot);p.role='vriend';p.rel=Math.max(p.rel,55);if(!S.rel.includes(p))S.rel.push(p);circSlot(c,p);L(`Je bent bevriend geraakt met ${p.first}.`,'good')}
function circLove(slot,p){const c=circle(slot);p.role='partner';p.st='relatie';p.since=ageY();p.rel=Math.max(p.rel,60);p.job=p.job||(slot==='work'?jobTitle():slot==='school'?'scholier':'');if(!S.rel.includes(p))S.rel.push(p);circSlot(c,p);L(`Je hebt een relatie met ${p.first} ${p.last}.`,'good');MS(`Kreeg een relatie met ${p.first}`,1);hap(6)}

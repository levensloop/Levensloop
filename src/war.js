/* ================= OORLOG (defensie fase 3): wereldspanning, oorlog, economie, dienstplicht, bevel ================= */
Object.assign(LAWS,{
 defb:{t:'Defensiebudget',em:'🛡️',v:[.015,.02,.035],d:1,ax:'pc',up:1,pp:0,port:'Defensie',f:v=>pc_(v)+' van het bbp',w:['verlaagt','verhoogt']},
 dienst:{t:'Dienstplicht',em:'🪖',v:[0,1],d:0,ax:'pc',up:1,pp:-6,port:'Defensie',f:v=>v?'actief':'opgeschort',w:['schort de dienstplicht op','voert de dienstplicht in'],war:1}});
const lawOk=k=>!LAWS[k].war||warW().lvl>=3||!!(S.dict&&S.dict.wars&&S.dict.wars.length);
const WLVL=['Vrede','Spanning','Regionaal conflict','NAVO-oorlog','Wereldoorlog'];
const FOES=['de Oostelijke Federatie','het Rode Pact','de Kaspische Alliantie','het Noordelijk Verbond'];
function warW(){if(!S.war)S.war={lvl:0,ten:ri(8,22),y:0,front:50,foe:pick(FOES),cas:0,reb:0,n:0,push:0,op:0,arms:0,hist:[]};return S.war}
const warLvl=()=>[0,0,.5,1.5,3][warW().lvl];
function warEcon(){const l=warW().lvl;return {infl:[0,0,.012,.04,.075][l],stk:[0,.02,.06,.16,.26][l],house:[0,0,.01,.05,.1][l],biz:[0,0,.04,.1,.18][l]}}
function warSet(l,txt,big){const W=warW();const old=W.lvl;W.lvl=l;W.y=0;if(l>=3&&old<3){W.front=50;W.n++;W.start=year()}L(txt,big?'bad big':'sys')}
function warYear(){const W=warW(),y=year(),a=ageY();W.y++;const P=S.pol;
  W.ten=clamp(Math.round(W.ten+ri(-6,6)+(20-W.ten)*.12+(chance(.05)?ri(15,35):0)+W.push+(W.lvl===1||W.lvl===2?1:0)-(W.lvl>=3?4:0)+(lawIdx('defb')===2&&W.lvl<2?-1:0)));
  const pushed=W.push;W.push=0;
  if(W.lvl===0&&W.ten>=40){warSet(1,`Wereldnieuws: de spanningen tussen de NAVO en ${W.foe} lopen hoog op.`);if(pushed>=8)W.blameY=y}
  else if(W.lvl===1){if(W.ten>=60&&chance(.4)){warSet(2,`Oorlog! ${cap(W.foe)} valt een buurland aan. Europa houdt de adem in.`,1);Q.push({id:'war_nieuws',c:{t:'Oorlog in de buurt',txt:`${cap(W.foe)} is een buurland binnengevallen. De NAVO stuurt troepen naar de grens. De beurs stort in, de energieprijzen schieten omhoog.`}});if(pushed>=8)W.blameY=y}else if(W.ten<25)warSet(0,'De spanningen in de wereld zijn weer afgenomen.')}
  else if(W.lvl===2){if(W.ten>=70&&chance(.45)){warSet(3,`Een NAVO-land is aangevallen. Artikel 5 wordt ingeroepen: Nederland is in oorlog met ${W.foe}.`,1);Q.push({id:'war_nieuws',c:{t:'Nederland in oorlog',txt:`Een NAVO-bondgenoot is aangevallen. De regering kondigt aan dat Nederland meevecht. Op televisie spreekt de koning het land toe.`}});if(pushed>=8)W.blameY=y}else if(W.ten<40||chance(.12)){W.ten=Math.min(W.ten,40);warSet(1,'Er is een staakt-het-vuren gesloten. Het conflict is voorbij, maar de spanning blijft.');}}
  else if(W.lvl>=3){const P2=S.pol;W.front=clamp(Math.round(W.front+gauss()*6+(lawIdx('defb')-1)*3+1+W.op+W.arms-(lawIdx('dienst')?0:(W.lvl===4?2:0))));W.op=0;W.arms=0;
    W.cas+=W.lvl===4?ri(1500,9000):ri(60,450);
    if(W.lvl===3){if((W.front<=35&&chance(.45))||chance(.12)){W.lvl=4;W.y=0;L('De oorlog breidt zich uit over de hele wereld. Het is een wereldoorlog.','bad big');Q.push({id:'war_nieuws',c:{t:'Wereldoorlog',txt:'Andere grootmachten mengen zich in de strijd. Van Azië tot de Atlantische Oceaan wordt gevochten. Het is een wereldoorlog.'}})}
      else if(W.front>=75||W.ten<40||chance(.15+W.y*.07))warEnd(W.front>=60?'win':W.front<=35?'lost':'deal')}
    else if(W.y>=3){if(W.front>=80)warEnd('win');else if(W.front<=12)warEnd('lost');else if(W.y>=6||chance(.3))warEnd(W.front>=60?'win':W.front<=30?'lost':'deal')}
    if(W.lvl>=3)L(`Oorlog, jaar ${y-W.start+1}: ${W.front>=60?'de NAVO wint terrein':W.front<=40?'het front staat onder zware druk':'het front staat stil'}. Al ${nf(W.cas)} Nederlandse militairen gesneuveld.`,'sys');
    if(W.lvl>=3&&!lawIdx('dienst')&&(W.lvl===4||W.front<45)&&!(P&&P.lvl==='mp')){setLaw('dienst',1);L('Het kabinet voert de dienstplicht weer in. Iedereen tussen 18 en 35 kan worden opgeroepen.','bad big')}}
  if(W.reb>0)W.reb--;
  // economie
  if(W.lvl>=3||(W.lvl===2&&chance(.5))){S.econ.s='recessie';S.econ.y=0}else if(W.reb>0){S.econ.s='groei';S.econ.y=0}
  // persoonlijk
  if(W.lvl>=3&&lawIdx('dienst')&&a>=18&&a<=35&&!S.mil&&!inJail()&&W.dp!==W.n&&!(P&&['min','mp'].includes(P.lvl)))Q.push({id:'war_oproep'});
  if(S.mil&&W.lvl>=3&&S.mil.st!=='opl'&&!S.mil.mis&&S.mil.br!=='kmar'&&chance(.6))Q.push({id:'war_inzet'});
  if(W.lvl>=2&&chance(.7)){const pool=Object.keys(EV).filter(k=>EV[k].wev&&safe(()=>EV[k].c())&&!Q.some(q=>q.id===k));if(pool.length)Q.push({id:pick(pool)})}
  if(W.lvl===4&&chance(.003)){die('een bombardement');return}
  if(W.lvl>=3&&lawIdx('dienst'))warFam();
  if(typeof occYear==='function')occYear()}
function warFam(){const W=warW();const fam=living(['broer','zus','kind','partner','vriend']).filter(p=>{const x=pAge(p);return x>=18&&x<=35&&!p.dp});if(!fam.length||!chance(.35))return;const p=pick(fam);p.dp=W.n;Q.push({id:'war_famop',c:{id:p.id}})}
function warEnd(how){const W=warW(),P=S.pol,M=S.mil;const yrs=W.start?year()-W.start:0;
  const txt=how==='win'?`De oorlog is voorbij! ${cap(W.foe)} capituleert na ${yrs||1} jaar. Overal in het land wordt feest gevierd.`:how==='deal'?`Na ${yrs||1} jaar oorlog wordt er een vredesakkoord getekend met ${W.foe}. Het land haalt opgelucht adem.`:`De NAVO moet een bittere vrede accepteren. ${cap(W.foe)} houdt grote delen van Oost-Europa. In Nederland heerst verslagenheid.`;
  W.hist.push({y:W.start,e:year(),how,cas:W.cas,wo:W.lvl===4});W.lvl=0;W.ten=how==='lost'?45:20;W.y=0;W.reb=how==='lost'?1:ri(3,5);setLaw('dienst',-1);W.cas=0;
  if(typeof occW==='function'&&Object.keys(occW()).length){if(how==='lost')W.occEnd=year()+ri(2,5);else for(const c of Object.keys(occW()))occLib(c,'win')}
  L(txt,'good big');MS(how==='lost'?'Maakte het bittere einde van een oorlog mee':'Vierde het einde van de oorlog',2);hap(how==='lost'?-6:12);
  if(M&&M.warS){S.flags.oorlogsvet=1}
  if(M&&M.dp){milLeave('Je zwaait af als dienstplichtige. Je mag naar huis.','good')}
  // verantwoordelijkheid
  if(P&&['min','mp'].includes(P.lvl)&&W.blameY&&year()-W.blameY<=8){if(how==='lost'){loseOffice(`Jij lokte deze oorlog mede uit en hij is verloren. Je moet aftreden als ${polTl(P.lvl)}.`);P.pop=clamp(P.pop-30);if(S.pex)S.pex.enq=year()+1;MS('Werd verantwoordelijk gehouden voor een verloren oorlog',1)}else P.pop=clamp(P.pop+(how==='win'?10:0))}
  if(P&&P.lvl==='mp'&&how==='win'){P.pop=clamp(P.pop+15);MS('Leidde het land als premier door een gewonnen oorlog',3)}
  if(M&&M.route==='off'&&M.rank>=6){if(how==='win'&&(M.opsW||0)>=2){S.flags.oorlogsheld=1;if(chance(.4))heroMedal(3);MS('Leidde troepen naar de overwinning',3)}if(how==='lost'&&(M.opsL||0)>=2){Q.push({id:'war_krijgsraad'})}}
  W.blameY=0;Q.push({id:'war_nieuws',c:{t:how==='lost'?'Een bittere vrede':'Bevrijdingsdag',txt}})}
E('war_nieuws',{sys:1,t:'Wereldnieuws',f:c=>c.txt});
/* ---------- dienstplicht ---------- */
E('war_oproep',{sys:1,t:'Opgeroepen!',x:'Er ligt een brief van het ministerie van Defensie op de mat. Je bent opgeroepen voor de dienstplicht. Over drie weken moet je je melden.',ch:[
 ['🪖 Opkomen',()=>{warW().dp=warW().n;warEnlist();return 'Je meldt je bij de kazerne. Je krijgt een uniform, een geweer en een stoomcursus van acht weken.'}],
 ['🕊️ Gewetensbezwaar aantekenen',()=>{warW().dp=warW().n;if(chance(.6)){S.flags.gwb=1;hap(-3);kar(2);return 'Je bezwaar wordt erkend. Je doet vervangende dienst in een ziekenhuis: patiënten tillen, bedden verschonen. Zwaar, maar zinvol.'}warEnlist();return 'Je bezwaar wordt afgewezen. Je moet toch opkomen.'}],
 ['🏃 Onderduiken',()=>{warW().dp=warW().n;if(chance(.5)){jail(ri(6,18),'dienstweigering');return 'De marechaussee staat na twee maanden voor de deur. Je wordt veroordeeld voor dienstweigering.'}hap(-10);S.flags.dienstweigeraar=1;return 'Je verstopt je bij een vriend op het platteland. Elke keer dat er een auto stopt, schrik je.'}]]});
function warEnlist(){if(S.job){endJob()}S.mil={br:'land',route:'man',spec:'inf',rank:0,st:'act',opl:0,perf:50,yrs:0,ryrs:0,sel:{},past:[],since:year(),dp:1,warS:1};milInit2();MS('Werd opgeroepen voor de dienstplicht',2)}
E('war_famop',{sys:1,t:'Opgeroepen',x:c=>{const p=findAny(c.id);return `${p?p.first:'Iemand'} is opgeroepen voor de dienstplicht en moet over twee weken naar de kazerne.`},ch:[
 ['🫂 Steunen en uitzwaaien',c=>{const p=findAny(c.id);if(p)p.rel=clamp(p.rel+6);hap(-3);if(p&&chance(.06)){p.alive=false;p.died=pAge(p);onDeath(p);return `Maanden later staan er twee officieren voor de deur. ${p.first} is gesneuveld.`}return `Je zwaait ${p?p.first:'hem'} uit op het station. Je houdt contact via brieven.`}],
 ['🏠 Helpen onderduiken',c=>{const p=findAny(c.id);if(p)p.rel=clamp(p.rel+12);if(chance(.3)){jail(ri(3,9),'hulp bij dienstweigering');return 'Het wordt ontdekt. Jullie worden allebei opgepakt.'}kar(-1);return `${p?p.first:'Hij'} verdwijnt naar een zolderkamer bij kennissen.`}]]});
/* ---------- militairen in oorlog ---------- */
MISSIONS.push({id:'front',n:'Frontinzet aan de oostgrens',em:'🔥',br:['land','marine','lucht'],risk:3,mo:6,d:'Echte oorlog: verdedigen, terugdringen, overleven',war:3});
const misAvail=()=>{const M=S.mil;return MISSIONS.filter(m=>m.br.includes(M.br)&&(!m.spec||m.spec.includes(M.spec))&&(!m.war||warW().lvl>=m.war))};
E('war_inzet',{sys:1,need:()=>!!S.mil,t:'Naar het front',x:()=>`Je eenheid wordt ingezet in de oorlog tegen ${warW().foe}.`,ch:[
 ['🫡 Gaan',()=>{const M=S.mil;M.mis={id:'front',y:year()-1};M.warS=1;return 'Je pakt je spullen. Thuis wordt het heel stil.'}],
 ['🚫 Weigeren',()=>{if(chance(.7)){milLeave('Je weigert uit te rukken. Je wordt oneervol ontslagen.','bad');jail(ri(6,24),'desertie');return 'Desertie in oorlogstijd. De krijgsraad is streng.'}S.mil.perf=clamp(S.mil.perf-20);return 'Je commandant laat je achter in de kazerne, maar je naam is besmet.'}]]});
for(const k of ['mis_hinderlaag','mis_patrouille','mis_maatgewond','mis_thuisfront','mis_burgers'])if(EV[k]){const c0=EV[k].c;EV[k].c=()=>(S.mil&&S.mil.onmis==='front')||c0()}
const ME2=(id,o)=>E(id,Object.assign({sys:1,mis:1,need:()=>!!S.mil},o));
ME2('mis_beschieting',{c:()=>S.mil&&S.mil.onmis==='front',t:'Artillerievuur',x:'Granaten slaan in rond je stelling. De grond trilt.',ch:[
 ['🕳️ In de schuilplaats blijven',()=>{S.mil.misR.tr+=12;return 'Uren zit je in het donker. Als het stil wordt, kruip je naar buiten. Je leeft.'}],
 ['🏃 Gewonden ophalen',()=>{const M=S.mil;M.misR.tr+=15;if(chance(.5)){M.misR.hero=Math.max(M.misR.hero,chance(.15)?3:2);return 'Je haalt drie gewonden uit een ingestorte loopgraaf. Een van hen leeft dankzij jou.'}M.misR.inj+=2;return 'Een granaat ontploft vlakbij. Je wordt geraakt.'}]]});
ME2('mis_dorp',{c:()=>S.mil&&S.mil.onmis==='front',t:'Een dorp heroveren',x:'Jullie moeten een dorp terugveroveren. Er zitten nog burgers.',ch:[
 ['🐢 Voorzichtig, huis voor huis',()=>{S.mil.misR.tr+=8;warW().op+=1;return 'Het duurt drie dagen. Alle burgers komen er levend uit.'}],
 ['⚡ Snel en hard',()=>{const M=S.mil;M.misR.tr+=14;warW().op+=2;if(chance(.3)){M.misR.inj+=1;return 'Het dorp is snel in handen, maar je raakt gewond.'}return 'Het dorp is in een paar uur heroverd. Je commandant is tevreden.'}]]});
Object.assign(EVMETA,{war_nieuws:['Wereld','🌍'],war_oproep:['Dienstplicht','✉️'],war_famop:['Dienstplicht','🪖'],war_inzet:['Oorlog','🔥'],mis_beschieting:['Oorlog','💥'],mis_dorp:['Oorlog','🏘️']});
/* ---------- bevelvoering (generaals) ---------- */
function warCmdSec(el){const M=S.mil,W=warW();if(!M||M.route!=='off'||!(M.rank>=6||M.cds)||W.lvl<2)return;const s=sec(el,'Bevelvoering');
  row(s,{ic:'🗣️',t:'Het kabinet adviseren',s:lawIdx('defb')<2?'Pleiten voor een hoger defensiebudget':'Het budget is al hoog',dis:!!S.acts.wadv||lawIdx('defb')>=2,on:()=>doAct('Advies',()=>{S.acts.wadv=1;if(chance(.3+M.perf/300+(M.cds?.2:0))){setLaw('defb',1);return `Het kabinet volgt je advies: het defensiebudget gaat naar ${LAWS.defb.f(law('defb'))}.`}return 'Het kabinet bedankt je voor je advies en doet er weinig mee.'},true,'🗣️')});
  if(W.lvl>=3)row(s,{ic:'🗺️',t:'Een operatie plannen',s:S.acts.wop?'Je hebt dit jaar al een operatie geleid':'Jij beslist. Jij bent verantwoordelijk.',dis:!!S.acts.wop,dots:true,on:()=>modal({title:'Operatie',em:'🗺️',cat:'Bevelvoering',text:`Het front staat op ${W.front}%. Welke strategie kies je?`,choices:opts([
    {t:'🐢 Voorzichtig',s:'Weinig verliezen, langzame winst',on:()=>{closeModal();warOp(0)}},{t:'⚡ Gedurfd',s:'Grote doorbraak of zware verliezen',on:()=>{closeModal();warOp(1)}},{t:'🛡️ Verdedigend',s:'Het front houden',on:()=>{closeModal();warOp(2)}}])})});
  if(M.cas)card(s,`<span class="muted">Onder jouw bevel: ${M.ops?M.ops.length:0} operaties · ${nf(M.cas)} gesneuvelde militairen</span>`)}
function warOp(k){const M=S.mil,W=warW();doAct('Operatie',()=>{S.acts.wop=1;const sk=(M.perf-50)/25+(S.st.smarts-50)/30;let d,cas;
  if(k===0){d=Math.round(ri(0,5)+sk);cas=ri(40,160)}else if(k===1){d=Math.round(ri(-12,15)+sk*1.5);cas=ri(200,900)}else{d=Math.round(ri(-3,3)+sk*.5);cas=ri(20,90)}
  if(W.lvl===4)cas*=4;W.op+=d;M.cas=(M.cas||0)+cas;M.ops=M.ops||[];M.ops.push({y:year(),k,d,cas});W.cas+=cas;
  const nm=pick(['Operatie Noorderlicht','Operatie IJzeren Vuist','Operatie Wilhelmus','Operatie Dageraad','Operatie Polderstorm','Operatie Zeeleeuw']);
  if(d>=8){M.opsW=(M.opsW||0)+1;M.perf=clamp(M.perf+10);S.fame=clamp(S.fame+5);if(chance(.15))heroMedal(2);return `${nm} is een groot succes! Het front schuift flink op. Verliezen: ${nf(cas)} militairen.`}
  if(d<=-6){M.opsL=(M.opsL||0)+1;M.perf=clamp(M.perf-15);hap(-8);if(k===1&&chance(.45))Q.push({id:'war_krijgsraad'});return `${nm} loopt uit op een ramp. Het front wijkt en ${nf(cas)} militairen sneuvelen. De kranten willen weten wie verantwoordelijk is.`}
  M.perf=clamp(M.perf+2);return `${nm}: ${d>0?'beperkte winst':d<0?'een klein verlies':'het front houdt stand'}. Verliezen: ${nf(cas)} militairen.`},true,'🗺️')}
E('war_krijgsraad',{sys:1,t:'Onderzoek naar je bevel',x:()=>`Er komt een onderzoek naar jouw rol bij ${S.mil&&S.mil.ops&&S.mil.ops.length?'je laatste operatie':'het verloop van de oorlog'}. Er zijn veel militairen omgekomen.`,ch:[
 ['📜 Volledige verantwoording afleggen',()=>{if(chance(.6)){kar(3);return 'De commissie oordeelt dat je redelijke keuzes maakte onder onmogelijke omstandigheden. Je wordt vrijgesproken.'}if(S.mil)milLeave('Je wordt van je commando ontheven en eervol ontslagen.','bad');return 'De commissie is hard: je inschatting was verkeerd. Je carrière is voorbij.'}],
 ['👉 De politiek de schuld geven',()=>{if(chance(.4)){if(S.mil)S.mil.perf=clamp(S.mil.perf-5);return 'Er blijkt veel politieke druk te zijn geweest. Je komt er redelijk vanaf.'}if(S.mil)milLeave('Je wordt oneervol ontslagen.','bad');if(chance(.3))Q.push({id:'s_trial',c:{w:'Plichtsverzuim in oorlogstijd',m:ri(6,30)}});return 'Niemand pikt het. Je wordt oneervol ontslagen en mogelijk vervolgd.'}]]});
E('war_bevel',{sys:1,need:()=>!!S.mil,t:'Een riskant bevel',x:'De regering wil dat jij binnen een week een groot offensief begint. Jij denkt dat het te vroeg is en veel levens gaat kosten.',ch:[
 ['🫡 Uitvoeren',()=>{const W=warW(),M=S.mil;const d=ri(-10,14);W.op+=d;const cas=ri(300,1500)*(W.lvl===4?3:1);M.cas=(M.cas||0)+cas;W.cas+=cas;if(d<0)M.opsL=(M.opsL||0)+1;else M.opsW=(M.opsW||0)+1;return d>0?`Het offensief slaagt, tegen jouw verwachting in. Verliezen: ${nf(cas)}.`:`Precies wat je vreesde: het offensief mislukt. ${nf(cas)} militairen sneuvelen.`}],
 ['✋ Weigeren',()=>{kar(5);if(chance(.5)){if(S.mil)milLeave('Je weigert het bevel. De minister ontslaat je op staande voet.','bad');return 'Je bent ontslagen, maar veel militairen zijn je dankbaar.'}return 'De regering zwicht. Het offensief wordt uitgesteld tot de troepen klaar zijn.'}]]});
EVMETA.war_krijgsraad=['Oorlog','⚖️'];EVMETA.war_bevel=['Oorlog','📜'];
/* ---------- politiek: escaleren en de-escaleren ---------- */
function warPolSec(el,P){const W=warW();if(!(P.lvl==='mp'||(P.lvl==='min'&&['Defensie','Buitenlandse Zaken'].includes(P.port))))return;const s=sec(el,'Internationaal');
  card(s,`<span class="muted">Wereldsituatie: <b>${WLVL[W.lvl]}</b> · spanning ${W.ten}%${W.lvl>=3?` · front ${W.front}%`:''}</span>`);
  const A=(ic,t,sub,fn,o={})=>row(s,{ic,t,s:sub,dis:o.dis,dots:true,on:()=>doAct(t,fn,true,ic)});
  A('🪖','Troepen naar de grens sturen','Escaleren · afschrikking',()=>{use('wesc');W.push+=12;P.pop=clamp(P.pop+2);if(W.lvl>=3)W.op+=2;return 'Duizenden militairen en tanks rollen richting de NAVO-grens. De vijand reageert woedend.'},{dis:!!S.acts.wesc});
  A('⏱️','Een ultimatum stellen','Escaleren · alles of niets',()=>{S.acts.wesc=1;if(chance(.35)){W.ten=clamp(W.ten-20);P.pop=clamp(P.pop+8);return `${cap(W.foe)} geeft toe! Jouw harde lijn werkt. De spanning zakt.`}W.push+=18;return `${cap(W.foe)} lacht om je ultimatum en mobiliseert het leger.`},{dis:!!S.acts.wesc});
  if(W.lvl>=1&&W.lvl<=3)A('🎯','Een preventieve aanval steunen','Zwaar escaleren',()=>{S.acts.wesc=1;W.push+=15;W.blameY=year();P.pop=clamp(P.pop+(chance(.5)?4:-6));if(chance(.75)){if(W.lvl===1){warSet(2,`De NAVO valt aan. Er is oorlog met ${W.foe}.`,1);W.ten=Math.max(W.ten,72)}else if(W.lvl===2){warSet(3,`De preventieve aanval loopt uit op een openlijke oorlog. Nederland vecht mee tegen ${W.foe}.`,1);W.ten=Math.max(W.ten,80)}else W.op+=4}return 'Je steunt een preventieve aanval in de NAVO. Er is geen weg terug meer.'},{dis:!!S.acts.wesc});
  A('🤝','Diplomatie','De-escaleren · praten, praten, praten',()=>{const m=use('wdip');W.push-=Math.round(6*m);return pick(['Je reist naar Genève voor overleg. Er wordt gepraat, de toon wordt milder.','Je belt urenlang met andere regeringsleiders.','Je organiseert een topontmoeting achter gesloten deuren.'])});
  A('🕵️','Geheime gesprekken','De-escaleren · riskant als het uitlekt',()=>{S.acts.wgeh=1;W.push-=12;if(chance(.25)){P.pop=clamp(P.pop-8);return 'Het lekt uit. "Onderhandelen met de vijand!" schreeuwen de kranten.'}return 'Via een Scandinavisch kanaal praat je in het geheim met de tegenpartij. Er is vooruitgang.'},{dis:!!S.acts.wgeh});
  A('🚫','Sancties instellen','De middenweg',()=>{use('wsan');W.push-=3;P.pop=clamp(P.pop+1);return 'De EU stelt op jouw voorstel strenge sancties in. Het treft hun economie, en een beetje de onze.'});
  if(W.lvl>=2)A('🕊️','Een vredesconferentie leiden','Een kans om de oorlog te stoppen',()=>{if(S.acts.wvc)return 'Je hebt dit jaar al een conferentie geleid.';S.acts.wvc=1;if(chance(clamp(.12+P.pop/400+(W.lvl===2?.1:0)-(W.lvl===4?.08:0),.03,.5))){if(W.lvl>=3)warEnd('deal');else{W.lvl=1;W.ten=35;L('Dankzij de vredesconferentie is er een staakt-het-vuren.','good big')}S.flags.vrede=1;P.pop=clamp(P.pop+15);MS('Bracht vrede met een vredesconferentie',3);if(chance(.3)){S.flags.nobel=1;MS('Won de Nobelprijs voor de Vrede',3);return 'Er wordt een akkoord getekend in Den Haag! Maanden later hoor je dat je de Nobelprijs voor de Vrede krijgt.'}return 'Er wordt een akkoord getekend in Den Haag. De wereld is je dankbaar.'}W.push-=4;return 'De conferentie loopt vast, maar er wordt in elk geval gepraat.'});
  if(W.lvl>=3){A('📦','Wapens leveren aan bondgenoten','Het front versterken',()=>{use('warm');W.arms+=4;W.push+=2;return 'Een nieuw pakket tanks, munitie en luchtafweer vertrekt naar het front.'});
    A('🏠','Vluchtelingen opvangen','Duizenden mensen op de vlucht',()=>{use('wvl');kar(3);P.pop=clamp(P.pop+(chance(.5)?3:-3));return 'Nederland vangt tienduizenden vluchtelingen op in sporthallen en vakantieparken.'})}}
/* ---------- burgers in oorlogstijd ---------- */
const WE=(id,o)=>E(id,Object.assign({sys:1,wev:1},o));
WE('war_hamster',{c:()=>warW().lvl>=2,t:'Lege schappen',x:'In de supermarkt zijn de schappen leeg. Mensen hamsteren pasta, wc-papier en blikvoer.',ch:[
 ['🛒 Ook inslaan',()=>{cash(-Math.round(300*(S.cpi||1)));return 'Je zolder ligt vol blikken soep. Voor de zekerheid.'}],['🙂 Rustig blijven',()=>{kar(1);return 'Je koopt wat je nodig hebt. Het komt goed.'}]]});
WE('war_energie',{c:()=>warW().lvl>=2&&ageY()>=18,t:'Energiecrisis',x:()=>`De gasprijs is verviervoudigd door de oorlog. Je energierekening is ${fmt(Math.round(1800*(S.cpi||1)))} hoger dit jaar.`,ch:[
 ['🧥 De verwarming laag, een trui aan',()=>{cash(-Math.round(900*(S.cpi||1)));hap(-2);return 'Je zit met een dekentje op de bank. Het scheelt de helft.'}],['💸 Gewoon betalen',()=>{cash(-Math.round(1800*(S.cpi||1)));return 'Au.'}]]});
WE('war_vluchteling',{c:()=>warW().lvl>=2&&ageY()>=21&&S.home.k!=='ouders',t:'Vluchtelingen',x:'Een gezin dat de oorlog is ontvlucht zoekt onderdak. De gemeente vraagt of jij een kamer hebt.',ch:[
 ['🏠 Ze in huis nemen',()=>{kar(6);hap(3);cash(-Math.round(1500*(S.cpi||1)));return 'Een moeder met twee kinderen trekt bij je in. De kinderen leren je hun taal, jij leert ze Nederlands.'}],['🙅 Daar heb ik geen ruimte voor',()=>'Je zegt nee. Ze vinden een plek in een opvanglocatie.']]});
WE('war_luchtalarm',{c:()=>warW().lvl>=3,t:'Luchtalarm',x:'Midden in de nacht gaan de sirenes. Dit is geen eerste maandag van de maand.',ch:[
 ['🏃 Naar de schuilkelder',()=>{hap(-3);return 'Je zit uren in een kelder met je buren. Het blijkt vals alarm.'}],['🛏️ Blijven liggen',()=>{if(chance(.92))return 'Het blijkt vals alarm. Gelukkig.';hea(-15);return 'Er slaat iets in, twee straten verderop. Je wordt geraakt door glas.'}]]});
WE('war_rantsoen',{c:()=>warW().lvl===4,t:'Rantsoenering',x:'De regering voert voedselbonnen in. Vlees, suiker en boter zijn op de bon.',ch:[
 ['🥔 Zuinig leven',()=>{hea(-2);hap(-3);return 'Je eet veel aardappelen en kool. Je leert creatief koken.'}],['💰 Zwarte markt',()=>{cash(-Math.round(2500*(S.cpi||1)));if(chance(.15)){cash(-Math.round(1000*(S.cpi||1)));return 'Je wordt betrapt en krijgt een flinke boete.'}return 'Je koopt boter en koffie voor woekerprijzen. Het smaakt naar vroeger.'}]]});
WE('war_vrijwilliger',{c:()=>warW().lvl>=3&&ageY()>=14,t:'Vrijwilligers gezocht',x:'Het Rode Kruis zoekt vrijwilligers voor de opvang van gewonde militairen.',ch:[
 ['🩹 Meehelpen',()=>{kar(4);hap(2);sk('sociaal',2);return 'Je helpt elke zaterdag in een noodhospitaal. De verhalen vergeet je nooit.'}],['🏠 Ik heb het al druk',()=>'Je doneert wat geld.']]});
Object.assign(EVMETA,{war_hamster:['Oorlog','🛒'],war_energie:['Oorlog','🔥'],war_vluchteling:['Oorlog','🏠'],war_luchtalarm:['Oorlog','🚨'],war_rantsoen:['Oorlog','🎫'],war_vrijwilliger:['Oorlog','🩹']});
function warCard(el){const W=warW();const col=W.lvl===0?'var(--good)':W.lvl===1?'var(--warn)':'var(--bad)';
  card(el,`<h3>🌍 Wereldsituatie: ${WLVL[W.lvl]}</h3><span class="muted">${W.lvl===0?'Het is rustig in de wereld.':W.lvl===1?`De NAVO en ${he(W.foe)} staan tegenover elkaar.`:W.lvl===2?`${he(cap(W.foe))} voert oorlog met een buurland.`:`Nederland is in oorlog met ${he(W.foe)}.`}${W.reb?' Wederopbouw: de economie groeit hard.':''}</span><div class="stat"><span>Spanning</span><span></span><span class="v">${W.ten}%</span>${bar(W.ten,col)}</div>${W.occ&&Object.keys(W.occ).length?`<span class="muted">Bezet: ${Object.keys(W.occ).map(c=>COUNTRIES[c].n).join(', ')}</span>`:''}${W.lvl>=3?`<div class="stat"><span>Front (NAVO)</span><span></span><span class="v">${W.front}%</span>${bar(W.front)}</div><span class="muted">Gesneuvelde Nederlandse militairen: ${nf(W.cas)}</span>`:''}`)}
/* ---------- na de dienst ---------- */
function postMilInc(){const X=S.pmil;if(!X||inJail())return[];const o=[];if(X.inv)o.push(['Invaliditeitspensioen',Math.round(X.sal*.7)]);else if(X.fpu&&ageY()<aowAge())o.push(['Militaire uitkering',Math.round(X.sal*.7)]);return o}
function vetSec(el){const X=S.pmil;if(!X)return;const a=ageY();const vet=X.vet;
  card(el,`<span class="muted">Je diende ${X.yrs} jaar bij de ${he(MBR[X.br].k)} en eindigde als ${he(X.t.toLowerCase())}.${vet?' Je bent veteraan.':''}${X.med&&X.med.length?' Onderscheidingen: '+medTxt(X.med)+'.':''}</span>`);
  const s=sec(el,'Na de dienst');
  if(a<60&&!X.inv){row(s,{ic:'👮',t:'Bij de politie',s:'Je ervaring telt mee',dots:true,on:()=>doAct('Politie',()=>{setJob('politie',X.rank>=2||X.route==='off'?1:0);return `Je begint als ${jobTitle().toLowerCase()} bij de politie.`},true,'👮')});
    row(s,{ic:'🛡️',t:'In de beveiliging',dots:true,on:()=>doAct('Beveiliging',()=>{setJob('beveil',X.rank>=2?1:0);return `Je begint als ${jobTitle().toLowerCase()}.`},true,'🛡️')});
    if(X.route==='off'&&X.rank>=3)row(s,{ic:'🏭',t:'Adviseur in de defensie-industrie',s:'Goed betaald, je kent iedereen',dots:true,on:()=>doAct('Defensie-industrie',()=>{setJob('consultant',2,pick(['Thales Nederland','Damen Naval','Fokker Defense','een raketbouwer']));return `Je wordt ${jobTitle().toLowerCase()} bij ${S.job.co}.`},true,'🏭')})}
  if((X.tr||0)>=15)row(s,{ic:'🫶',t:'Hulp zoeken bij het Veteraneninstituut',s:'Voor wie zware ervaringen meeneemt',on:()=>doAct('Veteraneninstituut',()=>{const k=use('vet');X.tr=Math.max(0,Math.round(X.tr-18*k));hap(Math.round(4*k));return X.tr>20?'Je praat met andere veteranen die hetzelfde meemaakten. Je bent niet de enige.':'Het gaat steeds beter. Je slaapt weer door.'},true,'🫶')})}
function vetYear(){const X=S.pmil;if(!X)return;if((X.tr||0)>=25){hap(-Math.min(4,Math.round(X.tr/15)))}X.tr=Math.max(0,(X.tr||0)-3)}
E('vet_dag',{c:()=>S.pmil&&S.pmil.vet&&!S.mil&&!inJail(),cd:4,t:'Veteranendag',x:'Het is Veteranendag. Je bent uitgenodigd voor het defilé in Den Haag.',ch:[
 ['🎖️ Met je medailles meelopen',()=>{hap(6);if(S.pmil)S.pmil.tr=Math.max(0,(S.pmil.tr||0)-5);return 'Langs de kant staan duizenden mensen te klappen. Een kind geeft je een bloem.'}],['🏠 Thuis kijken',()=>{hap(1);return 'Je kijkt op televisie. Je ziet een oude maat voorbijlopen.'}]]});
EVMETA.vet_dag=['Veteraan','🎖️'];
function milStory(Hij){const X=S.mil||S.pmil;if(!X)return '';const t=S.mil?milTitle():X.t;const sp=MSPEC(X.spec);const br=MBR[X.br];const hij=Hij.toLowerCase();
  let s=`${Hij} diende ${X.yrs} jaar bij de ${br.k.replace('Koninklijke ','')}${sp&&!sp.base?` (${sp.n.toLowerCase()})`:''} en bracht het tot ${(X.cds||X.wasCds)?'Commandant der Strijdkrachten':t.toLowerCase()}`;
  const ex=[];const med=X.med||[];if(X.mis_n)ex.push(`${X.mis_n} ${X.mis_n===1?'uitzending':'uitzendingen'}`);if(med.includes('mwo'))ex.push('ridder in de Militaire Willems-Orde');else if(med.includes('leeuw'))ex.push('de Bronzen Leeuw');if(S.flags.oorlogsvet)ex.push('vocht in een oorlog');
  return s+(ex.length?` (${ex.join(', ')})`:'')+'.'}

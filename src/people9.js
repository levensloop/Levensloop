/* ================= FASE 9: mensen met een eigen leven =================
   9.1 geheugen (p.mem), 9.2 karakter voor iedereen (p.kt, uit god.js), 9.3 eigen levensloop (p.lf),
   9.4 berichten van anderen (S.inbox), wonen in het buitenland (p.cc), verder spelen als kleinkind.
   Nieuwe velden zijn allemaal optioneel: oude levens krijgen ze via f9Migrate of pas als ze nodig zijn. */

// ---------- 9.2 karakter ----------
GTRAITS.push('Zorgzaam','Gul','Gierig','Eigenwijs');Object.assign(TREM,{Zorgzaam:'🤗',Gul:'🎁',Gierig:'💰',Eigenwijs:'🐂'});
const KTXT={Lief:'lief en hartelijk',Grappig:'altijd in voor een grap',Ambitieus:'ambitieus',Avontuurlijk:'avontuurlijk',Verlegen:'verlegen',Jaloers:'snel jaloers',Lui:'een beetje lui',Chagrijnig:'vaak chagrijnig',Zorgzaam:'zorgzaam',Gul:'gul',Gierig:'zuinig, om niet te zeggen gierig',Eigenwijs:'eigenwijs'};
const isHuman=p=>!!p&&p.role!=='huisdier';
const ktOf=p=>{if(!isHuman(p))return null;if(!p.kt)p.kt=pick(GTRAITS);return p.kt};
mkPerson=(f=>function(role,g,born,o){const p=f(role,g,born,o);if(role!=='huisdier'&&!p.kt)p.kt=pick(GTRAITS);return p})(mkPerson);
const who=p=>`je ${roleLabel(p).toLowerCase()} ${p.first}`;
const Who=p=>cap(who(p));
const hem=g=>g==='v'?'haar':g==='m'?'hem':'hen';
const landN=cc=>(COUNTRIES[cc]||{}).n||cc;

// ---------- 9.1 geheugen ----------
// [icoon, tekst vanuit jou gezien, gewicht]. {zijn} {hem} {hij} {x} worden ingevuld.
const MEMT={
 'verj+':['🎂','Je kwam naar {zijn} {x}e verjaardag',3],'verj-':['🎂','Je kwam niet naar {zijn} {x}e verjaardag',-4],
 'bruil+':['💒','Je was erbij op {zijn} bruiloft',5],'bruil-':['💒','Je sloeg {zijn} bruiloft over',-8],
 'speech+':['🎤','Je hield een prachtige speech op {zijn} bruiloft',6],'speech-':['🎤','Je speech op {zijn} bruiloft ging helemaal mis',-3],'bijdr+':['💶','Je betaalde mee aan {zijn} bruiloft',5],
 'hulp+':['🤝','Je hielp {hem} toen {hij} je nodig had',5],'hulp-':['🤝','Je liet {hem} zitten toen {hij} om hulp vroeg',-5],
 'geld+':['💶','Je leende {hem} geld toen {hij} krap zat',4],'geld-':['💶','Je weigerde {hem} geld te lenen',-3],
 'schuld+':['✅','Je betaalde het geleende geld netjes terug',3],'schuld-':['💸','Je betaalde het geleende geld nooit terug',-7],
 'ziek+':['💐','Je stond voor {hem} klaar toen {hij} ziek was',6],'ziek-':['🏥','Je kwam niet langs toen {hij} ziek was',-5],
 'vak+':['🏖️','Jullie gingen samen op vakantie',4],'bel-':['🤬','Je hebt {hem} beledigd',-4],'vecht-':['👊','Jullie hebben met elkaar gevochten',-8],
 'studie+':['🎓','Je betaalde {zijn} studie',6],'studie-':['🎓','Je liet {hem} de studie zelf regelen',-2],
 'trouw+':['💍','Jullie zijn getrouwd',6],'baby+':['👶','Jullie kregen samen een kind',6],'vreemd-':['💔','Je ging vreemd',-10],'onterf-':['🚫','Je hebt {hem} onterfd',-10],
 'diner+':['🍽️','Jullie hadden een gezellig familiediner',2],'diner-':['🍽️','Het familiediner liep uit op ruzie',-3],
 'bezoek+':['✈️','Je kwam {hem} opzoeken in {x}',4],'huis+':['🏡','Je hielp {hem} aan {zijn} eerste huis',6],'oppas+':['🧸','Je paste op de kleinkinderen',3],
 'jub+':['🥂','Jullie vierden jullie {x}-jarig huwelijk',4],'jub-':['🥂','Je vergat jullie {x}-jarig huwelijk',-5],'reunie+':['🎓','Jullie zagen elkaar terug op de reünie',3],
 'feest+':['🎉','Je organiseerde het feest voor {zijn} jubileum',4],'droom+':['🌠','Je steunde {zijn} grote droom',6],'droom-':['🌠','Je hield {zijn} grote droom tegen',-6],
 'rijles+':['🚗','Je betaalde {zijn} rijlessen',3],'trots+':['🌟','Je was trots op {zijn} rapport',2],'streng-':['😠','Je was streng over {zijn} rapport',-1],'groep+':['👯','Jullie hadden een topavond met de hele groep',2]};
function memTxt(m,p){const t=MEMT[m[0]];if(!t)return'';return t[1].replace(/\{zijn\}/g,f8Zijn(p.g)).replace(/\{hem\}/g,hem(p.g)).replace(/\{hij\}/g,f8Hij(p.g)).replace(/\{x\}/g,m[2]==null?'':m[2])}
function memAdd(p,code,arg){if(!isHuman(p)||!MEMT[code])return;p.mem=p.mem||[];p.mem.push(arg!=null?[code,year(),arg]:[code,year()]);if(p.mem.length>8)p.mem.shift()}
// stemming: optelsom van herinneringen; een herinnering vervaagt in 15 jaar
function mood(p){let s=0;const y=year();for(const m of p.mem||[]){const t=MEMT[m[0]];if(t)s+=t[2]*Math.max(0,1-(y-m[1])/15)}return s}
// "Weet je nog...": soms in gesprekken
function memRemind(p){const ms=(p.mem||[]).filter(m=>MEMT[m[0]]&&year()-m[1]<=12);if(!ms.length||!chance(.25))return '';const m=pick(ms);const t=MEMT[m[0]];
  if(t[2]>0){p.rel=clamp(p.rel+2);return ` ${p.first} begint erover: "Weet je nog? ${memTxt(m,p).replace(/^Je /,'Jij ').replace(/^Jullie /,'Wij ')}." Jullie lachen erom.`}
  p.rel=clamp(p.rel-2);return ` Halverwege zegt ${p.first}: "Ik ben trouwens nog steeds niet vergeten dat ${memTxt(m,p).replace(/^Je /,'je ').replace(/^Jullie /,'we ')}."`}

// ---------- wonen: in het buitenland ----------
// p.cc = land waar iemand woont (leeg = waar jij woont). Partner, kinderen onder 18 en huisdieren verhuizen met je mee.
const abroad=p=>!!(p&&p.cc&&p.cc!==S.p.country);
emigrate=(f=>function(k){const old=S.p.country;for(const p of S.rel){if(!p.alive||p.role==='huisdier')continue;const moves=(p.role==='partner'&&p.live!==0)||(p.role==='kind'&&pAge(p)<18);if(moves){if(p.cc&&p.cc!==k)delete p.cc;continue}if(!p.cc)p.cc=old}
  const r=f.apply(this,arguments);for(const p of S.rel)if(p.cc===S.p.country)delete p.cc;return r})(emigrate);

// ---------- 9.3 eigen levensloop ----------
const FULLR=['moeder','vader','broer','zus','kind','kleinkind','partner','vriend','schoonzoon','schoondochter'];
const CLOSE=['moeder','vader','broer','zus','kind','partner'];
function fullLife(p){if(!p||!p.alive||!isHuman(p)||p.born>S.m||p.gone)return false;if(p.role==='vriend')return p.rel>=50||S.bff===p.id;return FULLR.includes(p.role)}
const isClose=p=>CLOSE.includes(p.role)||S.bff===p.id;
const lf=p=>p.lf||(p.lf={ev:[]});
function lfLog(p,t){const x=lf(p);x.ev.push([year(),t]);if(x.ev.length>10)x.ev.shift()}
const SPN=g=>g==='v'?'vriendin':'vriend';
const EDN={mbo:'mbo',hbo:'hbo',wo:'universiteit'};
// verzonnen partner (alleen naam) voor iemand die geen eigen persoon nodig heeft
function mkPs(p){const pa=pAge(p);const g=chance(.06)?p.g:(p.g==='v'?'m':'v');return{n:f8Name(g),g,st:'relatie',y:year(),a:clamp(pa+ri(-4,4),18,99)}}
// begintoestand voor oude levens en voor volwassenen die er al zijn
function lfInit(p){const x=lf(p);if(x.v)return x;x.v=1;const pa=pAge(p),r=p.role;
  if(['kind','kleinkind','broer','zus','vriend'].includes(r)&&pa>=18){
    if(pa>=22&&!x.ed){const sm=p.smarts||50;x.ed=p.study||sm>=66?'wo':sm>=48?'hbo':'mbo';x.done=1}
    const roll=R();if(pa>=24&&!x.ps){const ps=mkPs(p);ps.st=roll<(pa>=30?.55:.3)?'getrouwd':roll<.7?'samen':roll<.85?'relatie':null;if(ps.st){ps.y=year()-ri(1,Math.max(1,Math.min(12,pa-22)));x.ps=ps;if(ps.st==='getrouwd')f9Inlaw(p,ps)}}
    if(x.ps&&x.ps.st!=='relatie'&&pa>=28&&r!=='kind'&&r!=='kleinkind'&&!(r!=='vriend'&&bigOn()))x.nk=ri(0,3)}
  return x}
// een getrouwde partner van je kind (of van je broer/zus met grote familie) wordt een echte persoon
function f9Inlaw(p,ps){const r=p.role;let role=null;if(r==='kind')role=ps.g==='v'?'schoondochter':'schoonzoon';else if((r==='broer'||r==='zus')&&bigOn())role=ps.g==='v'?'schoonzus':'zwager';
  if(!role||S.rel.some(x=>x.of===p.id&&x.role===role&&x.alive))return null;const q=mkPerson(role,ps.g,S.m-(ps.a||pAge(p))*12-ri(0,11),{first:ps.n,last:pick(NAMES[C().r].l),rel:ri(45,75),of:p.id,job:pick(KIDJOBS)});S.rel.push(q);ps.pid=q.id;return q}
function f9DropInlaw(p){S.rel=S.rel.filter(x=>!(x.of===p.id&&['schoonzoon','schoondochter'].includes(x.role)||x.of===p.id&&['zwager','schoonzus'].includes(x.role)&&(p.role==='broer'||p.role==='zus')))}
function lifeOne(p){const pa=pAge(p),r=p.role,x=lfInit(p),cp=S.cpi||1,kt=ktOf(p);const close=isClose(p);
  const say=(t,c)=>{if(close)L(t,c||'sys')};
  // opleiding (eigen kinderen, kleinkinderen, broers en zussen)
  if(['kind','kleinkind','broer','zus'].includes(r)){
    if(pa===18&&!x.ed){const go=r==='kind'?!!p.study:chance(clamp(((p.smarts||50)-20)/70,.1,.9));if(go){const sm=p.smarts||50;x.ed=sm>=66?'wo':sm>=48?'hbo':'mbo';const st=pick(STUDIES.filter(s=>s.ty.includes(x.ed)))||STUDIES[0];x.st=st.t;x.end=18+(x.ed==='mbo'?3:x.ed==='hbo'?4:5);lfLog(p,`Begon aan ${x.ed==='wo'?'de universiteit':x.ed==='hbo'?'de hogeschool':'een vakopleiding'}: ${st.t.toLowerCase()}`);p.job='student'}}
    if(x.end&&pa===x.end&&!x.done){x.done=1;if(chance(.85)){lfLog(p,`Haalde ${f8Zijn(p.g)} diploma ${(x.st||'').toLowerCase()}`);if(r==='kind'){L(`🎓 ${Who(p)} heeft ${f8Zijn(p.g)} diploma ${(x.st||'').toLowerCase()} gehaald!`,'good');hap(3)}}else{lfLog(p,'Stopte met de studie');x.ed=null}if(p.job==='student')p.job=''}}
  // werk
  const studying=x.end&&pa<x.end&&!x.done;
  if(pa>=18&&pa<67&&!studying&&(!p.job||/^(student|scholier|werkzoekend)$/.test(p.job))&&r!=='partner'&&chance(pa<22?.35:.5)){p.job=x.ed==='wo'||x.ed==='hbo'?pick(GOODJOBS):pick(KIDJOBS);lfLog(p,`Begon als ${p.job}`)}
  if(r==='partner'&&!p.job&&pa>=20&&pa<67&&chance(.45)){p.job=pick(KIDJOBS);p.inc=null;lfLog(p,`Vond een nieuwe baan als ${p.job}`);say(`${Who(p)} heeft een nieuwe baan als ${p.job}.`,'good')}
  if(p.job&&!/^(student|scholier|werkzoekend|gepensioneerd)/.test(p.job)&&pa<67){
    if(chance(kt==='Ambitieus'?.13:kt==='Lui'?.03:.07)&&(p.jl||0)<4){p.jl=(p.jl||0)+1;if(p.inc)p.inc=Math.round(p.inc*1.12);lfLog(p,`Kreeg promotie als ${p.job}`)}
    else if(chance(kt==='Lui'?.05:.022)){lfLog(p,`Werd ontslagen als ${p.job}`);if(r==='partner'||r==='kind')say(`${Who(p)} is ontslagen.`,'bad');p.job='';p.jl=0;if(r==='partner')p.inc=0}
    if(r!=='partner')p.money=Math.round((p.money||0)+ri(2,8)*1000*cp*(1+(p.jl||0)*.25))}
  if(pa>=67&&p.job&&!/^gepensioneerd/.test(p.job)&&!['student','scholier'].includes(p.job)){x.wj=p.job;p.job='gepensioneerd';if(r==='partner'&&p.inc)p.inc=Math.round(p.inc*.6);lfLog(p,`Ging met pensioen na een leven als ${x.wj}`);if(close)say(`${Who(p)} gaat met pensioen.`)}
  // liefde (niet voor je eigen partner, en ouders zijn met elkaar getrouwd)
  const parentsTogether=(r==='moeder'||r==='vader')&&living(['moeder','vader']).length===2&&!S.flags.oudersSch;
  if(r!=='partner'&&pa>=18&&!parentsTogether&&!(r==='moeder'||r==='vader')||((r==='moeder'||r==='vader')&&!parentsTogether&&pa<80)){
    const ps=x.ps;
    if(!ps){const c=pa<30?.16:pa<45?.1:pa<65?.05:.02;if(chance(c)){x.ps=mkPs(p);lfLog(p,`Kreeg verkering met ${x.ps.n}`);if(r==='kind'&&pa<30)L(`💘 ${Who(p)} heeft verkering met ${x.ps.n}.`,'sys')}}
    else{const yrs=year()-(ps.y||year());
      if(ps.st==='relatie'&&chance(.12)){lfLog(p,`Het ging uit met ${ps.n}`);x.ps=null}
      else if(ps.st==='samen'&&chance(.05)){lfLog(p,`Ging uit elkaar met ${ps.n}`);say(`${Who(p)} en ${ps.n} gaan uit elkaar.`,'bad');x.ps=null}
      else if(ps.st==='getrouwd'&&chance(kt==='Jaloers'?.025:.014)){lfLog(p,`Scheidde van ${ps.n}`);say(`${Who(p)} gaat scheiden van ${ps.n}.`,'bad');f9DropInlaw(p);x.ps=null}
      else if(ps.st==='relatie'&&yrs>=1&&chance(.25)){ps.st='samen';ps.y=year();lfLog(p,`Ging samenwonen met ${ps.n}`)}
      else if(ps.st==='samen'&&yrs>=1&&pa>=21&&chance(.16)){ps.st='getrouwd';ps.y=year();lfLog(p,`Trouwde met ${ps.n}`);f9Inlaw(p,ps);if(typeof f9Wedding==='function')f9Wedding(p)}
      // kinderen
      if(x.ps&&x.ps.st!=='relatie'&&pa>=24&&pa<=42&&chance(.13)){const n=r==='kind'?people('kleinkind').filter(k=>k.par===p.id).length:(x.nk||0)+people(['neefje','nichtje']).filter(k=>k.par===p.id).length;
        if(n<4){if(r==='kind'){if(!Q.some(q=>q.id==='kleinkind'))Q.push({id:'kleinkind',c:{id:p.id}})}
          else if((r==='broer'||r==='zus')&&bigOn()){const g=pick(['m','v']);const k=mkPerson(gRole(g,'neefje','nichtje'),g,S.m,{ap:apMix(apOf(p),null,g),last:p.g==='m'?p.last:pick(NAMES[C().r].l),rel:ri(50,80),par:p.id});S.rel.push(k);lfLog(p,`Kreeg een ${g==='v'?'dochter':'zoon'}: ${k.first}`);L(`👶 ${Who(p)} heeft een ${g==='v'?'dochter':'zoon'} gekregen: ${k.first}. Je bent ${S.p.g==='v'?'tante':'oom'}!`,'good');hap(3)}
          else{x.nk=(x.nk||0)+1;const g=pick(['m','v']);lfLog(p,`Kreeg een ${g==='v'?'dochter':'zoon'}: ${f8Name(g)}`);if(S.bff===p.id)L(`👶 Je beste ${SPN(p.g)} ${p.first} heeft een ${g==='v'?'dochter':'zoon'} gekregen!`,'good')}}}}}
  // verhuizen en emigreren
  const kidHome=(r==='kind'||r==='kleinkind')&&pa<18;
  if(!kidHome&&r!=='partner'&&pa>=19){const cc=p.cc||S.p.country;
    if(chance(.05)){const c=pick(COUNTRIES[cc].cities);if(c&&c!==x.ci){x.ci=c;lfLog(p,`Verhuisde naar ${c}`)}}
    if(!p.cc||p.cc===S.p.country){const emi=(pa>=22&&pa<=45&&chance(kt==='Avontuurlijk'?.025:.01))||(pa>=66&&pa<=76&&chance(.007));
      if(emi){const ccs=pa>=66?['ES','IT','FR'].filter(k=>k!==S.p.country):Object.keys(COUNTRIES).filter(k=>k!==S.p.country);const to=pick(ccs);if(to){x.oc=S.p.country;p.cc=to;x.ci=pick(COUNTRIES[to].cities);lfLog(p,`Emigreerde naar ${landN(to)}`);if(close)L(`✈️ ${Who(p)} verhuist naar ${landN(to)}. Langsgaan wordt een reis, maar bellen kan altijd.`,'sys')}}}
    else if(chance(.07)){const back=x.oc&&COUNTRIES[x.oc]?x.oc:S.p.country;lfLog(p,`Kwam terug naar ${landN(back)}`);if(back===S.p.country)delete p.cc;else p.cc=back;if(close&&back===S.p.country)L(`🏠 ${Who(p)} komt terug naar ${landN(back)}.`,'good')}}
  // ziek worden en herstellen
  if(p.ill&&!p.chr){if(chance(.35)){lfLog(p,`Herstelde van ${p.ill}`);if(close)L(`💚 ${Who(p)} is hersteld.`,'good');delete p.ill;p.hl=Math.max(p.hl??70,65)}}
  else if(!p.ill&&pa>=40&&chance(.012+Math.max(0,pa-45)*.0013)){const ill=pick(typeof ILLO!=='undefined'?ILLO:['een longontsteking']);p.ill=ill;p.chr=CHRON.includes(ill)?1:0;p.hl=Math.min(p.hl??70,ill==='kanker'?ri(30,45):p.chr?ri(45,60):ri(40,60));lfLog(p,p.chr?`Kreeg ${ill}`:`Werd ziek: ${ill}`);if(close||p.rel>=60){if(close)L(`🏥 ${Who(p)} heeft ${ill}.`,'bad');ibAdd(p,'ziek',ill)}}
}
const PHASE9=1;
const CHRON=['diabetes','hartfalen','artrose','COPD','hoge bloeddruk','Alzheimer','Parkinson'];
function lifeYear(){for(const p of S.rel.slice())if(fullLife(p))safe(()=>lifeOne(p))}

// ---------- 9.4 berichten (S.inbox) ----------
// Mensen nemen zelf initiatief. Dat is geen pop-up: er komt een regel in het logboek en een bericht bij Relaties.
// Wat je laat liggen, verloopt op je volgende verjaardag (en dat merken ze).
const IBX={
 verj:{em:'🎂',t:(p,a)=>`${Who(p)} nodigt je uit voor ${f8Zijn(p.g)} ${a}e verjaardag`,yes:'🎉 Gaan',no:'🙅 Afzeggen',
   ok:(p,a)=>{const k=giftCost(20,60);if(k)cash(-k);p.rel=clamp(p.rel+ri(5,9));hap(2);memAdd(p,'verj+',a);return `Je gaat naar het feest van ${p.first} en ${k?`neemt een cadeau mee (${fmt(k)})`:ageY()<18?'geeft een zelfgemaakt cadeau':'neemt een zelfgemaakte kaart mee'}. ${pick(['Het wordt laat.','Er wordt veel gelachen.','Je danst zelfs even.'])}`},
   nee:p=>{p.rel=clamp(p.rel-2);return `Je zegt af. ${p.first} begrijpt het, zegt ${f8Hij(p.g)}.`},skip:(p,a)=>{p.rel=clamp(p.rel-4);memAdd(p,'verj-',a)}},
 bruil:{em:'💒',t:(p,a)=>`${Who(p)} gaat trouwen met ${a} en nodigt je uit voor de bruiloft`,yes:'💒 Gaan',no:'🙅 Afzeggen',
   ok:p=>{const k=giftCost(100,300);if(k)cash(-k);p.rel=clamp(p.rel+ri(7,11));hap(4);memAdd(p,'bruil+');return `Wat een dag! ${k?`Je geeft ${fmt(k)} als cadeau`:ageY()<18?'Je geeft een zelfgemaakt cadeau':'Je schrijft een mooie kaart'} en danst tot het einde.`},
   nee:p=>{p.rel=clamp(p.rel-6);memAdd(p,'bruil-');return `Je zegt af. ${p.first} is er stil van.`},skip:p=>{p.rel=clamp(p.rel-8);memAdd(p,'bruil-')}},
 geld:{em:'💶',t:(p,a)=>`${Who(p)} zit krap en vraagt of je ${fmt(a)} kunt lenen`,yes:'💶 Lenen',no:'🙅 Weigeren',can:(p,a)=>S.money>=a,
   ok:(p,a)=>{cash(-a);p.owe=(p.owe||0)+a;p.oweY=year();p.rel=clamp(p.rel+ri(6,10));memAdd(p,'geld+');return `Je maakt ${fmt(a)} over. ${p.first} belooft het terug te betalen.`},
   nee:p=>{p.rel=clamp(p.rel-4);memAdd(p,'geld-');return `Je zegt nee. ${p.first} zegt dat ${f8Hij(p.g)} het begrijpt, maar klinkt teleurgesteld.`},skip:p=>{p.rel=clamp(p.rel-3);memAdd(p,'geld-')}},
 hulp:{em:'📦',t:(p,a)=>`${Who(p)} vraagt of je komt helpen met ${a}`,yes:'💪 Helpen',no:'🙅 Geen tijd',
   ok:(p,a)=>{p.rel=clamp(p.rel+ri(6,10));hap(-1);memAdd(p,'hulp+');return `Je helpt een hele zaterdag met ${a}. ${p.first} is je dankbaar.`},
   nee:p=>{p.rel=clamp(p.rel-3);return `Je hebt geen tijd. ${p.first} vraagt iemand anders.`},skip:p=>{p.rel=clamp(p.rel-4);memAdd(p,'hulp-')}},
 ziek:{em:'💐',t:(p,a)=>p.role==='partner'?`${Who(p)} heeft ${a} en heeft je zorg nodig`:`${Who(p)} heeft ${a} en zou het fijn vinden als je langskomt`,yes:p=>abroad(p)?'✈️ Erheen reizen':'💐 Langsgaan',no:'🙅 Er niet aan toekomen',
   ok:p=>{let t='';if(abroad(p)){const k=Math.round(ri(400,1400)*(S.cpi||1));cash(-k);t=` De reis kost ${fmt(k)}.`}p.rel=clamp(p.rel+ri(7,12));hap(-1);memAdd(p,'ziek+');p.hl=Math.min(90,(p.hl??60)+5);return `Je zorgt een tijd goed voor ${p.first}. Het doet ${hem(p.g)} zichtbaar goed.${t}`},
   can:p=>!abroad(p)||S.money>=400*(S.cpi||1),nee:p=>{p.rel=clamp(p.rel-5);memAdd(p,'ziek-');return `Je komt er niet aan toe. ${p.first} merkt het.`},skip:p=>{p.rel=clamp(p.rel-5);memAdd(p,'ziek-')}},
 bezoek:{em:'✈️',t:p=>`${Who(p)} woont in ${landN(p.cc)} en vraagt of je eens langskomt`,yes:'✈️ Op bezoek',no:'🙅 Nu niet',can:()=>S.money>=500*(S.cpi||1),
   ok:p=>{const k=Math.round(ri(500,1600)*(S.cpi||1));cash(-k);p.rel=clamp(p.rel+ri(9,14));hap(5);memAdd(p,'bezoek+',landN(p.cc));return `Je vliegt naar ${landN(p.cc)} (${fmt(k)}). ${p.first} laat je ${pick(['de mooiste plekjes','de lokale markt','het strand','de beste restaurants'])} zien.`},
   nee:p=>{p.rel=clamp(p.rel-1);return `Misschien volgend jaar, zeg je. ${p.first} houdt je eraan.`},skip:p=>{p.rel=clamp(p.rel-2)}}};
// cadeau: kinderen en tieners maken zelf iets; zonder geld wordt het een kaart
function giftCost(lo,hi){if(ageY()<18)return 0;const k=Math.round(ri(lo,hi)*(S.cpi||1));return Math.max(0,Math.min(k,Math.floor(S.money||0)))}
const HULPW=['verhuizen','het schilderen van de woonkamer','het leeghalen van de zolder','de tuin','een nieuwe keuken in elkaar zetten'];
function ibAdd(p,k,a){S.inbox=S.inbox||[];const me=ageY();
  if(me<12){if((k==='verj'||k==='bruil')&&p.alive){p.rel=clamp(p.rel+2);L(k==='verj'?`🎂 Je viert de ${a}e verjaardag van ${who(p)} mee.`:`💒 Je bent erbij als ${p.first} trouwt.`,'sys')}return false}
  if(me<18&&(k==='geld'||k==='bezoek'||k==='ziek'&&abroad(p)))return false;if(S.inbox.length>=5||S.inbox.some(i=>i.p===p.id&&i.k===k))return false;S.inbox.push({i:uid(),p:p.id,k,y:year(),a});const d=IBX[k];L(`📨 ${d.t(p,a)}. Je vindt het bericht bij Relaties.`,'sys');return true}
function ibOpen(it){const p=P(it.p),d=IBX[it.k];if(!p||!p.alive||!d){S.inbox=S.inbox.filter(x=>x!==it);refreshSheet();render();return}
  const yes=typeof d.yes==='function'?d.yes(p):d.yes;const can=!d.can||d.can(p,it.a);
  modal({title:'Bericht',em:d.em,cat:roleLabel(p),person:p,text:d.t(p,it.a)+'.',choices:[{t:yes,cls:'go',dis:!can,on:()=>{closeModal();doAct('Bericht',()=>{const r=d.ok(p,it.a);S.inbox=S.inbox.filter(x=>x!==it);return r},true,d.em)}},{t:d.no,on:()=>{closeModal();doAct('Bericht',()=>{const r=d.nee(p,it.a);S.inbox=S.inbox.filter(x=>x!==it);return r},true,d.em)}},{t:'Later',cls:'ghost',on:closeModal}]})}
function ibYear(){S.inbox=S.inbox||[];if(ageY()<13)S.inbox=S.inbox.filter(i=>i.y>=year());// een kind wordt niets kwalijk genomen

  // wat blijft liggen, verloopt
  for(const it of S.inbox.filter(i=>i.y<year())){const p=P(it.p),d=IBX[it.k];if(p&&p.alive&&d&&d.skip)safe(()=>d.skip(p,it.a))}
  S.inbox=S.inbox.filter(i=>i.y>=year());if(inJail())return;
  // geleend geld komt (meestal) terug
  for(const p of living().filter(p=>p.owe)){const kt=ktOf(p);if(chance(kt==='Gierig'||kt==='Lui'?.2:.45)){cash(p.owe);L(`💶 ${Who(p)} betaalt de ${fmt(p.owe)} terug die je leende.`,'good');p.owe=0}else if(year()-(p.oweY||year())>=5){L(`💸 ${Who(p)} heeft de ${fmt(p.owe)} nooit terugbetaald. Je laat het maar zo.`,'sys');p.owe=0;p.rel=clamp(p.rel-3)}}
  // jij leende geld van iemand en betaalt niet terug
  for(const p of living().filter(p=>p.lent&&p.lentY&&year()-p.lentY>=3&&!(p.mem||[]).some(m=>m[0]==='schuld-')))memAdd(p,'schuld-');
  // nieuwe berichten: hooguit twee per jaar
  const cands=[];for(const p of living()){if(!isHuman(p)||p.gone||!['moeder','vader','broer','zus','kind','kleinkind','vriend','opa','oma','oom','tante'].includes(p.role))continue;const pa=pAge(p);if(pa<18&&p.role!=='kind')continue;const close=isClose(p);
    if(pa>=20&&pa%10===0&&p.rel>=35&&chance(close?.7:.35))cands.push([p,'verj',pa]);
    if(pa>=20&&pa<70&&(p.money||0)<5000*(S.cpi||1)&&ktOf(p)!=='Gierig'&&chance(.025)&&p.role!=='opa'&&p.role!=='oma')cands.push([p,'geld',Math.round(ri(3,25)*100*(S.cpi||1))]);
    if(pa>=20&&pa<80&&!abroad(p)&&chance(ktOf(p)==='Lui'?.04:.025))cands.push([p,'hulp',pick(HULPW)]);
    if(abroad(p)&&p.rel>=40&&chance(.22))cands.push([p,'bezoek'])}
  for(const [p,k,a] of cands.sort(()=>R()-.5).slice(0,2))ibAdd(p,k,a)}
// zorgzame en gulle mensen doen soms zomaar iets
function ktYear(){for(const p of living()){if(!fullLife(p)||!isClose(p))continue;const kt=ktOf(p);
  if(kt==='Zorgzaam'&&chance(.08)){p.rel=clamp(p.rel+2);L(`📞 ${Who(p)} belt even om te vragen hoe het met je gaat.`,'sys')}
  else if(kt==='Gul'&&(p.money||0)>20000*(S.cpi||1)&&chance(.08)&&p.role!=='partner'){const k=Math.round(ri(1,5)*100*(S.cpi||1));cash(k);p.money-=k;L(`🎁 ${Who(p)} stopt je zomaar ${fmt(k)} toe.`,'good')}}}

// ---------- schermen ----------
// regel in de kaart bovenaan het scherm van een persoon
function f9Card(p){if(!isHuman(p)||!p.alive)return'';const kt=ktOf(p);const x=p.lf||{};const bits=[];const pa=pAge(p);
  if(abroad(p))bits.push(`woont in ${x.ci?x.ci+', ':''}${landN(p.cc)}`);else if(x.ci&&p.role!=='partner')bits.push(`woont in ${x.ci}`);
  if(x.ps&&p.role!=='partner')bits.push(x.ps.st==='getrouwd'?`getrouwd met ${x.ps.n}`:x.ps.st==='samen'?`woont samen met ${x.ps.n}`:`verkering met ${x.ps.n}`);
  const nk=(p.role==='kind'?people('kleinkind').filter(k=>k.par===p.id&&k.alive).length:people(['neefje','nichtje']).filter(k=>k.par===p.id&&k.alive).length)+(x.nk||0);if(nk)bits.push(`${nk} ${nk===1?'kind':'kinderen'}`);
  if(p.ill)bits.push(p.chr?`heeft ${p.ill}`:`ziek: ${p.ill}`);if(x.st&&x.end&&pa<x.end&&!x.done)bits.push(`studeert ${x.st.toLowerCase()}`);
  return `<div class="muted" style="margin-top:6px">${TREM[kt]||''} ${cap(KTXT[kt]||kt.toLowerCase())}${S.bff===p.id?' · ⭐ je beste '+SPN(p.g):''}${bits.length?'<br>'+he(cap(bits.join(' · '))):''}</div>`}
// achter de rol in lijsten
function f9Tag(p){if(!p.alive)return'';const t=[];if(S.bff===p.id)t.push('⭐');if(abroad(p))t.push(flag(p.cc));if(p.ill)t.push('🤒');return t.length?' '+t.join(' '):''}
F8.person.push((el,p)=>{if(!isHuman(p)||!p.alive)return;
  // in het buitenland: bellen en op bezoek
  if(abroad(p)&&!inJail()){const s=sec(el,`${flag(p.cc)} Woont in ${landN(p.cc)}`);
    row(s,{ic:'📞',t:'Videobellen',s:S.acts['vb'+p.id]?'Dit jaar al gedaan':'Even bijpraten',dis:!!S.acts['vb'+p.id],on:()=>doAct('Videobellen',()=>{S.acts['vb'+p.id]=1;p.rel=clamp(p.rel+ri(3,6));hap(1);return `Jullie bellen een uur. ${p.first} laat ${pick(['het uitzicht','het nieuwe huis','de buurt'])} zien.`},true,'📞')});
    const k=Math.round(900*(S.cpi||1));row(s,{ic:'✈️',t:'Op bezoek gaan',s:S.acts['bz'+p.id]?'Dit jaar al geweest':`Ongeveer ${fmt(k)} voor de reis`,dis:!!S.acts['bz'+p.id]||S.money<k,on:()=>doAct('Op bezoek',()=>{S.acts['bz'+p.id]=1;const c=Math.round(ri(500,1400)*(S.cpi||1));cash(-c);p.rel=clamp(p.rel+ri(9,14));hap(5);memAdd(p,'bezoek+',landN(p.cc));return `Je vliegt naar ${landN(p.cc)} (${fmt(c)}) en logeert een week bij ${p.first}.`},true,'✈️')})}
  // beste vriend(in)
  if(p.role==='vriend'){const s=sec(el,'Vriendschap');if(S.bff===p.id)row(s,{ic:'⭐',t:`Je beste ${SPN(p.g)}`,s:'Tik om dat niet meer te zijn',dots:true,on:()=>{S.bff=null;refreshSheet();render()}});
    else row(s,{ic:'⭐',t:`Je beste ${SPN(p.g)} maken`,s:p.rel>=60?'Jullie zijn er klaar voor':'Kan vanaf een relatie van 60%',dis:p.rel<60,on:()=>{S.bff=p.id;p.rel=clamp(p.rel+5);L(`⭐ ${p.first} is je beste ${SPN(p.g)}.`,'good');refreshSheet();render()}})}
  // leven van ... (tijdlijn)
  const ev=(p.lf&&p.lf.ev)||[];if(ev.length){const s=sec(el,`📖 Het leven van ${p.first}`);for(const [y,t] of ev.slice().reverse())row(s,{ic:'•',t,s:String(y)})}
  // samen meegemaakt
  const ms=(p.mem||[]).filter(m=>MEMT[m[0]]);if(ms.length){const s=sec(el,'Samen meegemaakt');for(const m of ms.slice().reverse())row(s,{ic:MEMT[m[0]][0],t:memTxt(m,p),s:`${m[1]}${MEMT[m[0]][2]>0?'':' · daar denkt '+f8Hij(p.g)+' nog aan'}`})}});
// het scherm van een persoon onthoudt wie het is (voor herinneringen en het buitenland)
let curP=null;
sheetPerson=(f=>function(el,p){curP=p;return f.apply(this,arguments)})(sheetPerson);
drawSheet=(f=>function(){curP=null;return f.apply(this,arguments)})(drawSheet);
// acties op het scherm van een persoon die een herinnering worden; bij iemand in het buitenland kan dit niet in het echt
const MEMACT={'Samen op vakantie':p=>'vak+','Beledigen':p=>'bel-','Getrouwd!':p=>{p.wy=year();return 'trouw+'},'Onterven':p=>p.disown?'onterf-':null};
const AWAY=['Tijd samen doorbrengen','Samen uitgaan','Naar de film','Samen sporten','Op date gaan','Een grap uithalen','Voorlezen','Helpen met huiswerk','Samen naar bed','Zakgeld geven','Spelen','Voeden','Troosten'];
doAct=(f=>function(title,fn,logIt,em){const p=curP;
  if(p&&abroad(p)&&AWAY.includes(title)){toast(`${p.first} woont in ${landN(p.cc)}. Bel of ga op bezoek.`);return}
  if(p&&(MEMACT[title]||/terugbetalen$/.test(title)||title==='Gesprek')){const fn0=fn;fn=function(){const r=fn0.apply(this,arguments);if(r!=null){if(title==='Gesprek'&&typeof r==='string')return r+memRemind(p);const c=/terugbetalen$/.test(title)?'schuld+':MEMACT[title](p);if(c)memAdd(p,c)}return r}}
  return f.call(this,title,fn,logIt,em)})(doAct);
fightFlow=(f=>function(o){const p=curP;if(p&&o&&/^Gevecht met/.test(o.title||'')&&o.end){const e=o.end;o.end=function(){memAdd(p,'vecht-');return e.apply(this,arguments)}}return f.apply(this,arguments)})(fightFlow);
birthChild=(f=>function(){const pt=S.preg&&S.preg.op?P(S.preg.op):partner();const r=f.apply(this,arguments);if(pt&&pt.alive)memAdd(pt,'baby+');return r})(birthChild);
// studie betalen, betrapt op vreemdgaan
{const w=(id,i,code,whoF)=>{const ch=EV[id]&&EV[id].ch&&EV[id].ch[i];if(!ch)return;const fn=ch[1];ch[1]=function(c){const p=whoF(c);const r=fn.apply(this,arguments);if(p)memAdd(p,code);return r}};
  w('f_studie',0,'studie+',c=>P(c.id));w('f_studie',1,'studie+',c=>P(c.id));w('f_studie',2,'studie-',c=>P(c.id));
  for(const i of [0,1])w('f_betrapt',i,'vreemd-',()=>partner())}
// berichten bovenaan Relaties, en een teller op het tabblad
function f9RelTop(el){const its=(S.inbox||[]).filter(i=>{const p=P(i.p);return p&&p.alive});if(!its.length)return;const s=sec(el,'📨 Berichten');
  for(const it of its){const p=P(it.p),d=IBX[it.k];row(s,{ic:d.em,t:d.t(p,it.a),s:'Verloopt op je volgende verjaardag',dots:true,on:()=>ibOpen(it)})}}
// 9.10: getrouwd (of al samenwonend) = samen wonen, ook na het kopen of huren van een ander huis
function f9Samen(){if(!S||!S.alive||!S.home)return;const pt=partner();if(!pt||inJail()||abroad(pt)||S.home.k==='ouders')return;
  if(pt.st==='getrouwd'||pt.live||S.home.samen===pt.id){if(S.home.samen!==pt.id)S.home.samen=pt.id;pt.live=1}}
render=(f=>function(){safe(f9Samen);const r=f.apply(this,arguments);try{const b=$('#t-rel');if(b&&S){const n=(S.inbox||[]).filter(i=>{const p=P(i.p);return p&&p.alive}).length;let d=b.querySelector('.ib9');if(n&&!inJail()){if(!d){d=document.createElement('span');d.className='ib9';b.appendChild(d)}d.textContent=n}else if(d)d.remove()}}catch(e){}return r})(render);

// ---------- jaarlijks ----------
F8.year.push(()=>{if(!S.alive)return;lifeYear();ibYear();ktYear()});
// kleinkinderen komen voortaan uit het leven van je kinderen (fase 9.3), niet meer willekeurig
if(EV.kleinkind)EV.kleinkind.w=0;

// ---------- verder spelen ----------
F8.inherit.push((old,n,ch,age)=>{for(const p of n.rel){p.mem=[];delete p.owe;delete p.lent}
  // de partner van je erfgenaam wordt jouw partner
  const sp=old.rel.find(p=>p.of===ch.id&&['schoonzoon','schoondochter'].includes(p.role)&&p.alive);const x=ch.lf||{};
  if(sp)n.rel.push(Object.assign({},sp,{id:uid(),role:'partner',st:'getrouwd',since:Math.max(0,Math.floor(n.m/12)-Math.max(1,year()-((x.ps&&x.ps.y)||year()))),wy:(x.ps&&x.ps.y)||year(),live:1,of:undefined,rel:ri(65,90),mem:[]}));
  else if(x.ps&&age>=18){const ps=x.ps;const q=mkPerson('partner',ps.g,n.m-(ps.a||age)*12,{first:ps.n,st:ps.st==='getrouwd'?'getrouwd':'relatie',since:Math.floor(n.m/12)-Math.max(0,year()-(ps.y||year())),rel:ri(60,85),live:ps.st==='relatie'?0:1});if(ps.st==='getrouwd')q.wy=ps.y;n.rel.push(q)}
  // woonde je erfgenaam in het buitenland, dan komt die terug (je erfenis staat in de munt van je land)
  for(const p of n.rel)if(p.cc===n.p.country)delete p.cc;
  n.inbox=[];n.bff=null});

// verder als kleinkind (alleen als er geen kind meer leeft): de familie schuift een generatie op
function f9GKRel(old,n,ch,sh){const dd=o=>o.alive?undefined:(o.died!=null?o.died-Math.floor(ch.born/12):undefined);const cp=(o,x)=>Object.assign({},o,{id:uid(),born:sh(o.born),mem:[]},x);
  n.rel.push({id:uid(),ap:old.ap,role:old.p.g==='v'?'oma':'opa',g:old.p.g==='v'?'v':'m',first:old.p.first,last:old.p.last,born:sh(0),rel:ch.rel,alive:false,died:Math.floor((old.m-ch.born)/12),looks:old.st.looks,smarts:old.st.smarts,money:0,job:''});
  const gp=old.rel.find(p=>p.role==='partner'&&p.alive);if(gp)n.rel.push(cp(gp,{role:gp.g==='v'?'oma':'opa',st:'',rel:ri(55,85)}));
  const par=old.rel.find(p=>p.id===ch.par);if(par)n.rel.push(cp(par,{role:par.g==='v'?'moeder':'vader',rel:par.alive?ri(55,85):ch.rel,died:dd(par)}));
  const op=par&&old.rel.find(p=>p.of===par.id&&['schoonzoon','schoondochter'].includes(p.role));if(op)n.rel.push(cp(op,{role:op.g==='v'?'moeder':'vader',of:undefined,rel:ri(55,85)}));
  for(const o of old.rel.filter(p=>p.role==='kleinkind'&&p.par===ch.par&&p.id!==ch.id))n.rel.push(cp(o,{role:o.g==='v'?'zus':'broer',rel:ri(45,80),par:undefined}));
  if(old.settings.bigFam){n.flags.bigGen=1;for(const o of old.rel.filter(p=>p.role==='kind'&&p.id!==ch.par))n.rel.push(cp(o,{role:o.g==='v'?'tante':'oom',rel:ri(40,75),died:dd(o)}));
    for(const o of old.rel.filter(p=>p.role==='kleinkind'&&p.par!==ch.par&&p.alive))n.rel.push(cp(o,{role:o.g==='v'?'nicht':'neef',rel:ri(35,70)}))}}
// ---------- oude levens ----------
function f9Migrate(s){if(!s||!s.rel)return;for(const p of s.rel){if(p.role==='huisdier')continue;if(!p.kt)p.kt=pick(GTRAITS);if(p.role==='vriend'&&!p.grp)p.grp='oud';
    if(p.role==='partner'&&p.st==='getrouwd'&&p.wy==null){const y=s.p.by+Math.floor((s.p.bm-1+s.m)/12);p.wy=y-Math.max(1,Math.floor(s.m/12)-(p.since??Math.floor(s.m/12))-1)}}
  s.inbox=s.inbox||[];s.flags=s.flags||{};s.flags.p9=1}
migrate=(f=>function(s){f.apply(this,arguments);safe(()=>f9Migrate(s))})(migrate);

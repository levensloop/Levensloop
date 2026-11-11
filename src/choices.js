/* ---------- keuzes binnen keuzes: huisdieren, uitgaan, vakantie, autokleur ---------- */
// per soort: rassen [naam, prijs, levensduur, kleuren] of alleen kleuren
const PETBR={
 hond:{q:'Welk ras?',l:[['Asielhond (vuilnisbakkie)',250,[10,16],['bruin','zwart','gevlekt','zandkleurig']],['Labrador',1200,[10,13],['blond','zwart','chocoladebruin']],['Golden retriever',1400,[10,12],['goud','crème','donkergoud']],['Duitse herder',1300,[9,12],['zwart met bruin','helemaal zwart','grijs']],['Franse bulldog',2200,[8,11],['fawn','gestroomd','crème','blauwgrijs']],['Border collie',1000,[12,15],['zwart-wit','bruin-wit','merle']],['Teckel',900,[12,16],['rood','zwart met bruin','gestroomd']],['Jack Russell',800,[13,16],['wit met bruin','wit met zwart','driekleur']],['Poedel',1100,[12,15],['wit','zwart','abrikoos','grijs']],['Husky',1300,[12,14],['grijs-wit','zwart-wit','rood-wit']],['Chihuahua',1000,[14,18],['crème','zwart','chocolade','fawn']]]},
 kat:{q:'Welk ras?',l:[['Asielkat',90,[13,19],['cyper','rood','zwart','lapjes','zwart-wit','schildpad']],['Brits korthaar',900,[12,17],['blauwgrijs','crème','zilver']],['Maine coon',1200,[12,15],['bruin getijgerd','zilver','rood']],['Siamees',800,[13,18],['seal point','blue point','lilac point']],['Ragdoll',1100,[12,17],['seal colorpoint','blue mitted','lilac']],['Sphynx',1800,[9,15],['roze','grijs','gevlekt']]]},
 konijn:{c:['wit','zwart','bruin','grijs','gevlekt','wildkleur']},
 hamster:{c:['goudbruin','wit','grijs','zwart-wit']},
 papegaai:{q:'Welke soort?',l:[['Grasparkiet',40,[7,12],['groen','blauw','geel']],['Valkparkiet',120,[15,22],['grijs','wit','parelgrijs']],['Grijze roodstaart',1500,[40,60],null],['Ara',3500,[45,65],['blauw-geel','rood-groen']],['Kaketoe',2200,[35,60],['wit','roze']]]},
 paard:{q:'Welk ras?',l:[['Shetlandpony',1500,[25,35],['bont','vos','zwart']],['Haflinger',4500,[25,30],null],['Fries',8000,[16,22],null],['KWPN-sportpaard',12000,[22,28],['bruin','vos','schimmel']],['Arabier',9000,[25,33],['schimmel','vos','bruin']]]},
 schildpad:{q:'Welke soort?',l:[['Griekse landschildpad',150,[50,90],null],['Russische landschildpad',120,[40,60],null],['Roodwangschildpad',40,[20,40],null]]}};
function petDesc(p){const b=p.br||p.sp||'huisdier';return p.col?`${b} (${p.col})`:b}
function randPet(sp){const d=PETBR[sp];if(!d)return {};if(d.l){const b=chance(.5)?d.l[0]:pick(d.l);return {br:b[0],k:b[1],life:b[2],col:b[3]?pick(b[3]):''}}return {col:pick(d.c)}}
function addPet(sp,name,o={}){const d=PETS.find(x=>x[0]===sp);const lf=o.life||d[2];
  const p=mkPerson('huisdier','m',S.m,{sp,br:o.br||'',col:o.col||'',first:name||pick(PETNAMES),last:'',life:ri(lf[0],lf[1]),cost:o.k||d[1],rel:80});
  S.rel.push(p);S.flags.pets=(S.flags.pets||0)+1;L(`Je hebt een ${o.br?o.br.toLowerCase().replace(/ \(.*\)/,''):sp}: ${p.first}.`,'good');return p}
function parentPet(sp){const ps=living(['moeder','vader']);const avg=ps.length?ps.reduce((a,p)=>a+p.rel,0)/ps.length:50;
  if(chance(avg>65?.7:.3)){const o=randPet(sp);const p=addPet(sp,null,o);hap(10);return `Je ouders zeggen ja! Welkom, ${p.first}${o.br?`, een ${o.br.toLowerCase().replace(/ \(.*\)/,'')}`:` de ${sp}`}${o.col?` (${o.col})`:''}.`}
  hap(-2);return 'Je ouders zeggen nee. Je mokt de hele dag.'}
function sheetPets(el){const a=ageY();const s=sec(el,'Dierenasiel en fokkers');
  for(const [sp,k] of PETS){const d=PETBR[sp]||{};const lo=d.l?Math.min(...d.l.map(x=>x[1])):k;
    row(s,{ic:icPet(sp),t:cap(sp),s:d.l?`${d.l.length} ${d.q==='Welk ras?'?'rassen':'soorten'}`:`${d.c.length} kleuren`,r:`${d.l?'vanaf ':''}${fmt(d.l?lo:k)}`,dis:a>=18&&S.money<lo,dots:true,on:()=>d.l?petBreed(sp):petColor(sp,{k},d.c)})}}
function petBreed(sp){const d=PETBR[sp],a=ageY();
  modal({title:`Een ${sp}`,em:icPet(sp),cat:'Huisdieren',text:d.q,choices:opts(d.l.map(([b,k,life,cols])=>({t:b,ic:icPet(sp,b),s:`${fmt(k)} · wordt ${life[0]} tot ${life[1]} jaar`,dis:a>=18&&S.money<k,on:()=>{closeModal();const o={br:b,k,life};cols&&cols.length>1?petColor(sp,o,cols):(o.col=cols?cols[0]:'',petName(sp,o))}})))})}
function petColor(sp,o,cols){const b=o.br?o.br.replace(/ \(.*\)/,''):sp;
  modal({title:cap(b),em:icPet(sp,o.br),cat:'Huisdieren',text:'Welke kleur?',choices:opts(cols.map(c=>({t:cap(c),ic:icPet(sp,o.br,c),on:()=>{closeModal();petName(sp,Object.assign({},o,{col:c}))}})))})}
function petName(sp,o){const a=ageY(),k=o.k||PETS.find(x=>x[0]===sp)[1];const n=pick(PETNAMES);
  modal({title:'Hoe heet je huisdier?',em:icPet(sp,o.br,o.col),cat:'Huisdieren',text:`${cap(petDesc({sp,br:o.br,col:o.col}))}${a>=18?` · ${fmt(k)}`:''}`,html:`<input class="inp" id="ptn" maxlength="20" value="${he(n)}">`,choices:opts([{t:'Meenemen',cls:'go',on:()=>{const nm=$('#ptn').value.trim()||n;closeModal();
    if(a<18&&!chance(.5)){toast('Je ouders zeggen nee');return}doAct('Nieuw huisdier',()=>{if(a>=18)cash(-k);addPet(sp,nm,o);hap(8);return `Welkom thuis, ${nm}!`},true,icPet(sp,o.br,o.col))}}])})}

/* ---- uitgaan ---- */
// lo = kans om iemand te ontmoeten, vr = kans op een nieuwe vriend, door = minimaal uiterlijk+sociaal voor de portier
const CLUBS=[
 {n:'De Plakvloer',em:'🍺',d:'Kelder, goedkoop bier, studenten tot sluitingstijd',k:[15,40],a:16,vr:.3,lo:.1,hap:5,hea:-2},
 {n:'Club Fluweel',em:'🥂',d:'Dresscode, flessenservice en een strenge portier',k:[90,260],a:21,door:75,lo:.15,hap:6},
 {n:'Het Zweetkot',em:'🔊',d:'Techno tot de zon opkomt, niemand praat',k:[25,60],a:18,vr:.12,lo:.06,hap:7,hea:-4},
 {n:'Zeven Hemel',em:'🌇',d:'Cocktails op een dakterras, zakenmensen en uitzicht',k:[60,150],a:21,lo:.08,vr:.12,net:1,hap:4},
 {n:'De Laatste Ronde',em:'🎤',d:'Bruin café met karaoke en stamgasten van 70',k:[10,30],a:18,vr:.35,lo:.04,hap:4},
 {n:'De Hooiberg',em:'🤠',d:'Feestschuur buiten de stad, schlagers en bier uit emmers',k:[15,45],a:16,vr:.25,lo:.12,hap:6,hea:-2},
 {n:'Heupwiegen',em:'💃',d:'Salsa en bachata, iedereen danst met iedereen',k:[15,35],a:18,vr:.15,lo:.22,hap:5,dance:1}];
function nightlife(){const a=ageY();
  modal({title:'Uitgaan',em:'👯',cat:'Vrije tijd',text:'Waar ga je vanavond heen?',surprise:true,choices:CLUBS.map(c=>({t:`${c.em} ${c.n}`,s:a<c.a?`Vanaf ${c.a} jaar`:`${c.d} · ${fmt(c.k[0])} tot ${fmt(c.k[1])}`,dis:a<c.a||(a>=18&&S.money<c.k[0]),on:()=>{closeModal();clubDoor(c)}})).concat([{t:'🛋️ Ik blijf liever thuis',cls:'ghost',on:()=>{closeModal();doAct('Thuisblijven',()=>{hap(1);return 'Bank, dekentje, serie. Ook prima.'},true,'🛋️')}}])})}
function clubDoor(c){if(c.door&&S.fame<40&&S.st.looks+S.sk.sociaal/2+ri(-20,20)<c.door){doAct('Uitgaan',()=>{use('uit');hap(-1);return `De portier van ${c.n} kijkt je van top tot teen aan. "Vanavond niet." Je staat buiten.`},true,'🚫');return}
  const pa=partner();const rel=pa&&pa.st!=='ex';
  modal({title:c.n,em:c.em,cat:'Uitgaan',text:`${c.d}. Wat doe je?`,surprise:true,choices:[
    {t:'🪩 Dansen',s:(c.dance?'Hier draait alles om dansen':'Losgaan op de dansvloer')+' · minigame',on:()=>{closeModal();mgRhythm({title:'Dansen',desc:'Beweeg op de beat van de dj.',em:'🪩',notes:['🎵','🔊','✨'],btn:'Dansen!'},sc=>{c.sc=sc;clubNight(c,'dans')})}},
    {t:'🍸 Aan de bar hangen',s:c.net?'Hier staan mensen met interessante banen':'Kletsen met wie er maar staat',on:()=>{closeModal();clubNight(c,'bar')}},
    {t:'😏 Iemand versieren',s:rel?'Je hebt een relatie. Dit kan misgaan':'Kijken of er iemand leuk is',on:()=>{closeModal();clubNight(c,'flirt')}}]})}
function clubNight(c,what){doAct('Uitgaan',()=>{const m=use('uit');if(ageY()>=16)addUp('alcohol',what==='bar'?4:2);const a=ageY();if(a>=18)cash(-ri(c.k[0],c.k[1]));hap(Math.round(c.hap*m*(what==='dans'&&c.sc!=null?.6+c.sc*.8:1)));if(c.hea&&chance(.4))hea(c.hea);
  const pa=partner(),rel=pa&&pa.st!=='ex';
  if(what==='dans'){sk('sport',1);if(chance(c.lo*(c.dance?1.6:.8))&&!rel){addPartner();return `Je danst de hele avond met dezelfde persoon in ${c.n}. Het klikt!`}return pick(c.dance?['Na drie nummers ken je de basispassen.','Je wordt rondgedraaid tot je duizelig bent.']:['Je danst tot de lichten aangaan.','De DJ draait al je favorieten.','Je ontdekt spieren waarvan je niet wist dat je ze had.'])}
  if(what==='bar'){if(c.net&&S.job&&chance(.35)){S.job.perf=clamp(S.job.perf+4);sk('sociaal',2);return 'Je raakt aan de praat met iemand uit jouw vak. Een handig contact.'}if(chance(c.vr||.15)){const f=addFriend();if(f)return `Je raakt aan de praat met ${f.first}. Jullie wisselen nummers uit.`}if(chance(.15)){hea(-2);return 'Eén drankje werden er zeven. Morgen wordt zwaar.'}return pick(['Je hoort drie levensverhalen van mensen die je nooit meer ziet.','Je wint een potje darts van een vreemde.','De barman geeft je er eentje van het huis.'])}
  const sc=(S.st.looks+S.sk.sociaal)/200;
  if(rel&&chance(.3)){pa.rel=clamp(pa.rel-30);hap(-6);return `Iemand maakt een foto van jou en een onbekende. ${pa.first} krijgt hem doorgestuurd.`}
  if(chance(c.lo*1.5+sc*.4)){if(rel){pa.rel=clamp(pa.rel-10);kar(-3);return 'Je wisselt nummers uit met iemand. Spannend, maar je voelt je schuldig.'}addPartner();return `Je versiert iemand in ${c.n}. Jullie spreken af voor een date.`}
  hap(-1);return pick(['Je openingszin valt slecht. Heel slecht.','Je wordt beleefd afgewezen.','Je praat een uur met iemand die alleen over crypto wil praten.'])},true,c.em)}

/* ---- vakantie ---- */
const TRIPS=[['🌲','Weekendje Ardennen',400,4],['🏖️','Zon in Spanje',1200,7],['🗽','Stedentrip New York',3000,9],['🗾','Rondreis Japan',6000,12],['🏝️','Malediven',9000,14],['🌏','Wereldreis van een jaar',30000,20]];
const TIERS=[['🎒 Budget','Camping, hostel of een gedeelde kamer',.55,.75,.3],['🏨 Comfort','Een net hotel met ontbijt',1,1,.1],['🌴 Luxe','Vijf sterren, roomservice en een privéstrand',2.2,1.3,.03]];
function sheetVacation(el){const s=sec(el,'Bestemmingen');
  for(const [ic,t,k,h] of TRIPS)row(s,{ic,t,s:`vanaf ${fmt(k*.55)}`,dis:S.money<k*.55,dots:true,on:()=>modal({title:t,em:ic,cat:'Vakantie',text:'Hoe wil je reizen?',choices:opts(TIERS.map(([tt,sub,f,hf,risk])=>({t:`${tt} · ${fmt(k*f)}`,s:sub,dis:S.money<k*f,on:()=>{closeModal();doAct(t,()=>{cash(-Math.round(k*f));const m=use('vak');hap(Math.round(h*hf*m));hea(1);if(f>2)loo(1);
    if(t.startsWith('Wereld')&&S.job){endJob();return 'Een jaar lang de wereld rond. Je hebt je baan opgezegd.'}
    if(chance(risk)){const r=R();if(r<.33){hea(-3);return 'Voedselvergiftiging op dag twee. Je ziet vooral het hotelplafond.'}if(r<.66){const v=Math.round(k*.15);cash(-v);return `Je tas wordt gestolen, met ${fmt(v)} aan spullen erin.`}hap(-1);return 'Het regent de hele week en je kamer ruikt naar natte hond.'}
    return f>2?pick(['Je wordt elke ochtend gewekt met verse jus.','Zo kan het leven dus ook zijn.']):pick(['Je komt bruin en uitgerust terug.','Onvergetelijk. Je hebt 900 foto\'s.','Prachtig, al regende het drie dagen.'])},true,ic)}})))})})}

/* ---- autokleur ---- */
const CARCOL=[['Zwart',1,'zwarte'],['Wit',1,'witte'],['Zilvergrijs',1,'zilvergrijze'],['Donkerblauw',1,'donkerblauwe'],['Rood',1,'rode'],['Racegroen',1.01,'racegroene'],['Matgrijs',1.04,'matgrijze']];
function carColor(k,b,m,v,p){modal({title:`${b} ${m[0]}`,em:icCar(`${b} ${m[0]}`),cat:"Auto's",text:'Welke kleur?',choices:opts(CARCOL.map(([c,f,adj])=>{const pr=Math.round(p*f);return{t:c,s:f>1?`Speciale lak · ${fmt(pr)}`:fmt(pr),ic:icCar(`${b} ${m[0]}`,c),dis:S.money<pr,on:()=>{closeModal();buyCat(k,b,m,v,pr,c,adj)}}}))})}

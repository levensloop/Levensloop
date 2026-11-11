/* ================= DEFENSIE (fase 2): dagelijks leven, kameraden, uitzendingen, medailles ================= */
const MEDALS={herinn:['🎗️','Herinneringsmedaille Vredesoperaties','de'],inzet:['🏅','Herinneringsmedaille Multinationale Operaties','de'],verd:['✳️','Kruis van Verdienste','het'],bkruis:['✠','Bronzen Kruis','het'],leeuw:['🦁','Bronzen Leeuw','de'],mwo:['🎖️','Militaire Willems-Orde','de']};
const MISSIONS=[
 {id:'balt',n:'NAVO-versterking in Litouwen',em:'🇱🇹',br:['land'],risk:1,mo:6,d:'Oefenen en afschrikken aan de oostgrens van de NAVO'},
 {id:'vn',n:'VN-vredesmissie in Afrika',em:'🇺🇳',br:['land','kmar'],risk:2,mo:6,d:'Een kwetsbaar vredesakkoord bewaken'},
 {id:'stab',n:'Stabilisatiemissie in het Midden-Oosten',em:'🏜️',br:['land'],risk:3,mo:6,d:'Gevaarlijk gebied: patrouilles, bermbommen, hinderlagen',spec:['inf','kct','cav','genie','medic','luchtm','mar','art']},
 {id:'irak',n:'Trainingsmissie in Irak',em:'🎯',br:['land','lucht'],risk:2,mo:5,d:'Lokale troepen opleiden'},
 {id:'piraat',n:'Anti-piraterij in de Golf van Aden',em:'🏴‍☠️',br:['marine'],risk:2,mo:5,d:'Koopvaardijschepen beschermen tegen piraten'},
 {id:'middel',n:'NAVO-vlootverband in de Middellandse Zee',em:'🌊',br:['marine'],risk:1,mo:4,d:'Varen, oefenen, de zee bewaken'},
 {id:'lucht',n:'Luchtpolitie boven Oost-Europa',em:'🛩️',br:['lucht'],risk:1,mo:4,d:'Onbekende toestellen onderscheppen',spec:['f35','grond','luchtv']},
 {id:'heli',n:'Helikoptersteun bij een VN-missie',em:'🚁',br:['lucht'],risk:2,mo:5,d:'Troepen en gewonden vervoeren',spec:['heli','grond']},
 {id:'ramp',n:'Noodhulp na een orkaan in het Caribisch gebied',em:'🌀',br:['land','marine','lucht','kmar'],risk:1,mo:3,d:'Puin ruimen, water uitdelen, mensen redden'},
 {id:'frontex',n:'Frontex-grensbewaking in Griekenland',em:'🛥️',br:['kmar'],risk:1,mo:4,d:'De buitengrenzen van Europa bewaken'}];
const MIS=id=>MISSIONS.find(m=>m.id===id);
function milInit2(){const M=S.mil;if(!M)return;if(M.fys==null)M.fys=clamp(Math.round(S.sk.sport*.6+S.st.health*.4));if(M.mor==null)M.mor=60;if(M.tr==null)M.tr=0;M.med=M.med||[];M.mis_n=M.mis_n||0;
  if(!M.medfix){M.medfix=1;const k=M.med.includes('herinn')?'herinn':M.med.includes('inzet')?'inzet':null;const miss=M.mis_n-M.med.filter(x=>x==='herinn'||x==='inzet').length;if(k)for(let i=0;i<miss;i++)M.med.push(k)}
  milPpl()}
function milPpl(){const M=S.mil;M.ppl=(M.ppl||[]).filter(p=>p.alive!==false);
  const mk=(k)=>{const age=k==='cmdt'?ri(30,50):clamp(ageY()+ri(-3,4),18,45);const p=mkPerson('polit',pick(['m','v']),S.m-age*12-ri(0,11),{rel:k==='cmdt'?ri(35,55):ri(45,65)});p.kind=k;p.role=k==='cmdt'?'commandant':'maat';p.mt=pick(['grappenmaker','stille kracht','sportfanaat','de vader van de groep','eeuwige klager','durfal']);return p};
  while(M.ppl.filter(p=>p.kind==='maat').length<2)M.ppl.push(mk('maat'));if(!M.ppl.some(p=>p.kind==='cmdt'))M.ppl.push(mk('cmdt'));return M.ppl}
const milP=id=>S.mil&&(S.mil.ppl||[]).find(p=>p.id===id);
function milBars(){const M=S.mil;milInit2();return `<div class="stat"><span>Fysiek</span><span></span><span class="v">${Math.round(M.fys)}%</span>${bar(M.fys,'var(--brand)')}</div><div class="stat"><span>Moreel</span><span></span><span class="v">${Math.round(M.mor)}%</span>${bar(M.mor)}</div>`}
/* ---------- extra acties ---------- */
function milMore(el){const M=S.mil;milInit2();if(M.st==='opl')return;const s=sec(el,'Oefenen');const D=(t,fn,ic)=>()=>doAct(t,fn,true,ic);
  row(s,{ic:'🧗',t:'Hindernisbaan',s:'Minigame',dots:true,on:()=>mgDodge({title:'Hindernisbaan',desc:'Onder het net door, over de muur, door de modder.',em:'🧗',me:'🏃',obs:['🧱','🪵','💧','🚧'],secs:12},(h,tot)=>doAct('Hindernisbaan',()=>{use('mhind');const sc=h/tot;M.fys=clamp(M.fys+Math.round(1+sc*4));M.perf=clamp(M.perf+Math.round((sc-.4)*8));return sc>=.99?'Foutloos! Je zet een nieuwe tijd neer.':sc>=.6?'Je komt modderig maar trots over de finish.':'Je valt twee keer in de sloot.'},true,'🧗'))});
  const SA={f35:['🛩️','Vliegsimulator','dodge'],heli:['🚁','Vliegsimulator','dodge'],onderzee:['🫧','Sonaroefening','react'],luchtv:['📡','Radaroefening','react'],cyber:['💻','Hackoefening','code'],mivd:['🕵️','Codes kraken','code'],genie:['💣','Explosief ruimen','code'],mijn:['💣','Mijn onschadelijk maken','code'],medic:['⛑️','Gewondenoefening','react'],duik:['🤿','Duikoefening','dodge'],bsb:['🎯','Arrestatietraining','react'],koning:['👑','Beveiligingsdrill','react']}[M.spec];
  if(SA){const [ic,t,k]=SA;const cb=sc=>doAct(t,()=>{use('mspec');M.perf=clamp(M.perf+Math.round((sc-.45)*12));sk(['cyber','mivd'].includes(M.spec)?'tech':'sport',1);return sc>=.7?'Uitstekend. Je instructeur noteert je naam.':sc>=.4?'Voldoende. Er valt nog wat te leren.':'Dat ging mis. In het echt was het slecht afgelopen.'},true,ic);
    row(s,{ic,t,s:'Minigame · vakoefening',dots:true,on:()=>k==='dodge'?mgDodge({title:t,desc:'Ontwijk alles.',em:ic,me:ic,obs:['🌩️','🏔️','🛸','🪨'],secs:12},(h,n)=>cb(h/n)):k==='code'?mgCode({title:t,desc:'Onthoud de code en voer hem foutloos in.',em:ic,len:5},(g,l)=>cb(g/l)):mgReact({title:t,desc:'Reageer zodra het signaal komt.',em:ic,idle:'🔴',go:'🟢',fake:'🟠',goTxt:'NU!',btn:'Actie',rounds:3},(h,n)=>cb(h/n))})}
  row(s,{ic:'🏔️',t:'Grote oefening',s:S.acts.mgro?'Al op oefening geweest dit jaar':'Weken in het veld, in binnen- of buitenland',dis:!!S.acts.mgro,dots:true,on:()=>{const loc=M.br==='marine'?['de Noordzee','de Noorse fjorden','de Middellandse Zee']:M.br==='lucht'?['Arizona','Noorwegen','Spanje']:['Noorwegen (winter)','Duitsland','Frankrijk','Polen'];
    modal({title:'Grote oefening',em:'🏔️',cat:'Defensie',text:'Waar ga je naartoe?',choices:opts(loc.map(l=>({t:l,on:()=>{closeModal();doAct('Oefening',()=>{S.acts.mgro=1;M.fys=clamp(M.fys+3);M.perf=clamp(M.perf+4);for(const p of M.ppl)p.rel=clamp(p.rel+4);M.mor=clamp(M.mor+(chance(.7)?4:-3));const pt=partner();if(pt)pt.rel=clamp(pt.rel-2);
      return /winter/.test(l)?'Drie weken bij min 25 graden in een sneeuwhol. Je hebt nog nooit zo veel koude pasta gegeten. Maar wat een ervaring.':`Weken oefenen in ${l}. Je komt moe, bruin en een stuk beter terug.`},true,'🏔️')}})))})}});
  const m=sec(el,'Uitzending');
  if(M.mis)card(m,`<span class="muted">${MIS(M.mis.id).em} Je vertrekt binnenkort: ${he(MIS(M.mis.id).n)}. Bij je volgende verjaardag ben je op missie.</span>`);
  else row(m,{ic:'🌍',t:'Aanmelden voor een uitzending',s:M.yrs<1?'Na je eerste jaar':M.ry===year()?'Je bent net terug':'Kies een missie',dis:M.yrs<1||M.ry===year(),dots:true,on:misMenu});
  row(m,{ic:'🛋️',t:'Praten met een maatschappelijk werker',s:M.tr>=20?'Helpt bij zware ervaringen':'Even je hart luchten',on:D('Gesprek',()=>{const k=use('mpsy');M.tr=Math.max(0,Math.round(M.tr-15*k));M.mor=clamp(M.mor+Math.round(3*k));hap(Math.round(2*k));return M.tr>30?'Het is zwaar om erover te praten, maar het lucht op. Je spreekt af om terug te komen.':'Een goed gesprek. Je merkt dat het je goed doet.'},'🛋️')});
  if(M.med.length){const md=sec(el,'Onderscheidingen');for(const [k,n] of medCount(M.med))row(md,{ic:MEDALS[k][0],t:MEDALS[k][1],s:medSub(k,n),r:n>1?`${n}×`:''})}
  const pp=sec(el,'Kameraden');for(const p of milPpl())row(pp,{ic:faceOf(p),t:`${p.first} ${p.last}`,role:p.role,bar:{l:'Relatie',v:p.rel,c:barCol(p.rel)},on:()=>openSheet(p.first,el=>sheetMilP(el,p),true)})}
function sheetMilP(el,p){const M=S.mil;if(!M||!milP(p.id)){empty(el,`${p.first} is niet meer je kameraad.`);return}
  card(el,`<h3>${faceOf(p)} ${he(p.first+' '+p.last)}</h3><span class="muted">${cap(p.role)} · ${pAge(p)} jaar · ${he(p.mt)}</span><div class="stat"><span>Relatie</span><span></span><span class="v">${Math.round(p.rel)}%</span>${bar(p.rel)}</div>`);
  const s=sec(el,'Acties');const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,on:()=>doAct(t,fn,true,ic)});const rel=d=>{p.rel=clamp(p.rel+d)};
  if(p.kind==='maat'){A('🏋️','Samen trainen',()=>{const k=use('mt'+p.id);rel(Math.round(5*k));M.fys=clamp(M.fys+Math.round(2*k));return `${p.first} jaagt je op tijdens de duurloop. Je haalt een persoonlijk record.`});
    A('🍻','Stappen in de stad',()=>{const k=use('ms'+p.id);rel(Math.round(7*k));M.mor=clamp(M.mor+Math.round(4*k));hap(3);return pick([`Jullie gaan uit in ${pick(['Assen','Den Helder','Ermelo','Oirschot','Leeuwarden'])}. Het wordt laat.`,`${p.first} vertelt de hele avond verhalen over de opleiding. Je ligt dubbel.`])});
    A('🤡','Een grap uithalen',()=>{use('mg'+p.id);if(chance(.6)){rel(4);M.mor=clamp(M.mor+3);return `Jullie vullen het bed van een collega met piepschuim. Iedereen lacht, behalve hij.`}M.perf=clamp(M.perf-6);rel(2);return 'De sergeant-majoor vindt het niet grappig. Jullie mogen allebei een weekend de wacht lopen.'});
    A('🫂','Er voor elkaar zijn',()=>{use('mh'+p.id);rel(6);M.mor=clamp(M.mor+2);M.tr=Math.max(0,M.tr-3);return `Je praat met ${p.first} over thuis, over de missie, over alles. Dat doet jullie allebei goed.`})}
  else{A('📋','Om feedback vragen',()=>{const k=use('mf'+p.id);rel(Math.round(3*k));M.perf=clamp(M.perf+Math.round(3*k));return `${p.first} geeft je drie concrete tips. Je neemt ze ter harte.`});
    A('🫡','Een goede indruk maken',()=>{const k=use('mi'+p.id);rel(Math.round(5*k));return 'Je bent als eerste klaar bij de appèl, tot in de puntjes verzorgd.'});
    A('😤','Klagen over je taken',()=>{use('mk'+p.id);rel(-8);M.mor=clamp(M.mor+1);return `"Klagen kun je bij de vakbond doen," zegt ${p.first} droog.`})}}
/* ---------- uitzendingen ---------- */
function misMenu(){const M=S.mil;const list=misAvail();const rk=['','laag risico','middel risico','hoog risico'];
  modal({title:'Uitzending',em:'🌍',cat:'Defensie',text:'Voor welke missie meld je je aan?',choices:opts(list.map(m=>({t:`${m.em} ${m.n}`,s:`${m.mo} maanden · ${rk[m.risk]} · ${m.d}`,on:()=>{closeModal();doAct('Uitzending',()=>{M.mis={id:m.id,y:year()};const pt=partner();return `Je bent geselecteerd! Over een paar weken vertrek je naar ${m.n.replace(/^.*? (in|in de|boven|bij|na) /,'')}.${pt?` ${pt.first} slikt even als je het vertelt.`:''}`},true,m.em)}})))})}
const misOn=(...ids)=>()=>S.mil&&S.mil.onmis&&(!ids.length||ids.includes(S.mil.onmis));
function misRun(){const M=S.mil;const m=MIS(M.mis.id);M.onmis=m.id;M.mis=null;M.misR={hero:0,inj:0,tr:0};L(`Je vertrekt voor ${m.mo} maanden: ${m.n}.`,'big');
  const pool=Object.keys(EV).filter(k=>EV[k].mis&&safe(()=>EV[k].c()));const n=m.risk>=2?3:2;for(const id of pool.sort(()=>R()-.5).slice(0,n))Q.push({id});Q.push({id:'mis_einde'})}
function heroMedal(lvl){const M=S.mil;if(!M)return '';M.med=M.med||[];const k=lvl>=3?'mwo':lvl===2?'leeuw':lvl===1?'bkruis':'verd';const had=M.med.filter(x=>x===k).length;M.med.push(k);MS(`Kreeg ${had?'opnieuw ':''}${MEDALS[k][2]} ${MEDALS[k][1]}${had?` (${had+1}×)`:''}`,k==='mwo'?3:2);S.flags['med_'+k]=1;return `${MEDALS[k][2]} ${MEDALS[k][1]}${had?` (al voor de ${had+1}e keer)`:''}`}
// onderscheidingen tellen: [[sleutel, aantal]] in volgorde van de eerste keer
function medCount(a){const o=[];for(const k of a||[]){const x=o.find(y=>y[0]===k);if(x)x[1]++;else o.push([k,1])}return o}
const medSub=(k,n)=>n<2?'':['herinn','inzet'].includes(k)?`${n} keer uitgereikt · met ${n-1} ${n-1===1?'gesp':'gespen'}`:`${n} keer uitgereikt`;
const medTxt=a=>medCount(a).map(([k,n])=>MEDALS[k][1]+(n>1?` (${n}×)`:'')).join(', ');
const ME=(id,o)=>E(id,Object.assign({sys:1,mis:1,need:()=>!!S.mil},o));
ME('mis_patrouille',{c:misOn('vn','stab','irak','balt'),t:'Patrouille',x:'Tijdens een patrouille staat er een verdacht voertuig langs de weg. Niemand te zien.',ch:[
 ['🔄 Voorzichtig omrijden',()=>{S.mil.perf=clamp(S.mil.perf+2);return 'Je kiest de veilige route. Later blijkt het een verlaten auto te zijn.'}],
 ['🔎 Zelf gaan kijken',()=>{const M=S.mil;if(chance(.7)){M.perf=clamp(M.perf+5);return 'Je vindt een verstopte wapenvoorraad. Je commandant is onder de indruk.'}M.misR.inj+=1;return 'Er klinkt een knal. Je wordt door rondvliegend glas geraakt.'}],
 ['📡 Experts laten komen',()=>{S.mil.mor=clamp(S.mil.mor-2);return 'Je wacht twee uur in de hitte op het explosievenopruimingsteam. Niets aan de hand.'}]]});
ME('mis_hinderlaag',{c:()=>misOn('stab','vn')()&&MIS(S.mil.onmis).risk>=2,t:'Hinderlaag',x:'Je konvooi wordt beschoten. Een maat ligt gewond in het open veld.',ch:[
 ['🏃 Je maat onder vuur weghalen',()=>{const M=S.mil;M.misR.tr+=15;if(chance(.55)){M.misR.hero=Math.max(M.misR.hero,chance(.12)?3:chance(.4)?2:1);M.perf=clamp(M.perf+10);return 'Je rent, je sleept, je duikt. Jullie halen het allebei. Iedereen heeft het gezien.'}M.misR.inj+=2;return 'Je haalt je maat, maar je wordt zelf geraakt.'}],
 ['🛡️ Dekking zoeken en terugvuren',()=>{const M=S.mil;M.misR.tr+=10;M.perf=clamp(M.perf+3);if(chance(.25))M.misR.inj+=1;return 'Na twintig minuten trekt de vijand zich terug. De medic haalt je maat op.'}],
 ['📻 Luchtsteun oproepen',()=>{const M=S.mil;M.misR.tr+=8;if(chance(.8))return 'Twee F-35\'s vliegen over. Het vuren stopt direct.';M.misR.tr+=10;return 'De luchtsteun komt te laat. Het is een lange, zware nacht.'}]]});
ME('mis_bermbom',{c:()=>misOn('stab','irak')()&&['genie','inf','cav'].includes(S.mil.spec),t:'Bermbom',x:'Langs de route ligt een verdacht pakket. Iemand moet het onschadelijk maken.',ch:[
 ['💣 Ik doe het',()=>({go:()=>mgCode({title:'Bermbom',desc:'Onthoud de draden en knip ze in de goede volgorde.',em:'💣',len:5},(g,l)=>{const M=S.mil;let t;if(g===l){M.misR.hero=Math.max(M.misR.hero,1);M.perf=clamp(M.perf+8);t='Klik. Het is veilig. Je handen trillen pas als het voorbij is.'}else if(g>=l-1){M.misR.tr+=8;t='Op het laatste moment zie je je fout. Je begint opnieuw. Het lukt.'}else{M.misR.inj+=2;M.misR.tr+=15;t='Er gaat iets mis. Een kleine ontploffing. Je wordt afgevoerd naar het veldhospitaal.'}L(t);result('Bermbom',t,'',processQ,{em:'💣',cat:'Uitzending'})})})],
 ['🚧 Gebied afzetten en wachten',()=>'Het opruimingsteam regelt het. Je route is een dag dicht.']]});
ME('mis_burgers',{c:misOn(),t:'Lokale bevolking',x:'Een groep kinderen loopt naar je toe. Ze vragen om water en snoep.',ch:[
 ['🍬 Delen wat je hebt',()=>{kar(3);S.mil.mor=clamp(S.mil.mor+4);return 'Ze rennen lachend weg. Een moeder zwaait naar je.'}],
 ['🙅 Doorlopen, het is te riskant',()=>'Je houdt afstand. Volgens de regels.']]});
ME('mis_piraten',{c:misOn('piraat'),t:'Piraten!',x:'Een snel bootje met gewapende mannen vaart op een vrachtschip af.',ch:[
 ['🔫 Waarschuwingsschoten',()=>{S.mil.perf=clamp(S.mil.perf+4);return 'Het bootje draait direct om. Het vrachtschip toetert dankbaar.'}],
 ['🚤 Enteren met het boardingteam',()=>{const M=S.mil;if(chance(.7)){M.misR.hero=Math.max(M.misR.hero,1);M.perf=clamp(M.perf+8);return 'Jullie nemen zes piraten zonder een schot gevangen.'}M.misR.inj+=1;M.misR.tr+=6;return 'Er wordt geschoten. Je raakt lichtgewond.'}]]});
ME('mis_onderschep',{c:misOn('lucht'),t:'Scramble!',x:'Alarm: een onbekend toestel vliegt zonder transponder richting het NAVO-luchtruim.',ch:[
 ['🛩️ Escorteren tot het wegdraait',()=>{S.mil.perf=clamp(S.mil.perf+5);return 'Je vliegt vleugel aan vleugel tot het toestel afbuigt. De piloot zwaait.'}],
 ['📡 Afstand houden en melden',()=>'Je volgt het toestel op afstand. Netjes volgens het boekje.']]});
ME('mis_storm',{c:misOn('ramp'),t:'Reddingsactie',x:'Een familie zit vast op het dak van een ingestort huis. Het water stijgt.',ch:[
 ['🛟 Erheen, nu',()=>{const M=S.mil;if(chance(.75)){if(chance(.25))M.misR.hero=Math.max(M.misR.hero,1);M.perf=clamp(M.perf+6);kar(4);return 'Je haalt ze er alle vijf af. De kleinste klemt zich de hele weg aan je vast.'}M.misR.inj+=1;return 'Het lukt, maar je wordt door puin geraakt.'}],
 ['📋 Wachten op de helikopter',()=>'Twee uur later haalt de helikopter ze op. Het liep goed af.']]});
ME('mis_thuisfront',{c:misOn(),t:'Thuisfront',x:()=>{const pt=partner(),k=living('kind');return pt?`${pt.first} klinkt moe aan de telefoon.${k.length?' De kinderen vragen elke avond wanneer je thuiskomt.':''}`:'Je moeder belt. Ze slaapt slecht sinds je weg bent.'},ch:[
 ['📱 Elke dag videobellen',()=>{const pt=partner();if(pt)pt.rel=clamp(pt.rel+5);hap(2);return 'Het slechte internet maakt je gezicht blokkerig, maar het helpt.'}],
 ['✉️ Een lange brief schrijven',()=>{const pt=partner();if(pt)pt.rel=clamp(pt.rel+3);kar(1);return 'Weken later krijg je een brief terug, met tekeningen.'}],
 ['🎯 Focussen op de missie',()=>{S.mil.perf=clamp(S.mil.perf+3);const pt=partner();if(pt)pt.rel=clamp(pt.rel-6);return 'Je zet thuis even uit je hoofd. Dat werkt, voor jou.'}]]});
ME('mis_maatgewond',{c:()=>misOn('stab','vn','heli')(),t:'Zwaar nieuws',x:()=>`Een collega van een ander peloton is ${pick(['gewond geraakt','omgekomen'])} bij een aanslag.`,ch:[
 ['🕯️ De herdenking bijwonen',()=>{S.mil.misR.tr+=10;S.mil.mor=clamp(S.mil.mor-6);return 'Het hele kamp staat stil. Je vergeet dat moment nooit.'}],
 ['💪 Doorgaan, er is werk te doen',()=>{S.mil.misR.tr+=14;S.mil.perf=clamp(S.mil.perf+2);return 'Je stopt het weg. Voorlopig.'}]]});
E('mis_einde',{sys:1,need:()=>!!S.mil,t:'Terug naar huis',f:()=>{const M=S.mil;const m=MIS(M.onmis),r=M.misR||{hero:0,inj:0,tr:0};M.onmis=null;M.misR=null;M.ry=year();M.mis_n++;const out=[];
  const dr=[0,.0006,.004,.012][m.risk]*(1+(typeof warLvl==='function'?warLvl():0))*(1.3-M.fys/200);
  if(chance(dr)){die('verwondingen tijdens een uitzending');return `Tijdens de missie ${m.n.toLowerCase()} kom je om het leven. Je naam wordt voorgelezen op de Nationale Dodenherdenking.`}
  const inj=r.inj+(chance([0,.03,.08,.16][m.risk])?1:0);
  if(inj){const d=ri(5,10)*Math.min(3,inj);hea(-d);M.fys=clamp(M.fys-Math.round(d*.8));out.push(inj>=3?'Je bent zwaargewond geraakt. De revalidatie duurt maanden.':'Je bent gewond geraakt, maar je herstelt.');if(inj>=4&&chance(.5)){out.push('De artsen keuren je af voor verdere dienst.');S.flags.invalide=1}}
  M.tr=clamp(M.tr+Math.round(r.tr*.7)+[0,1,4,8][m.risk]);if(M.tr>=40)out.push('Thuis slaap je slecht. Harde geluiden laten je schrikken.');
  {const mk=m.risk>=2?'herinn':'inzet';const had=M.med.filter(x=>x===mk).length;M.med.push(mk);out.push(had?`Je krijgt een extra gesp op je ${MEDALS[mk][1]}. Je hebt hem nu ${had+1} keer gekregen.`:`Je krijgt de ${MEDALS[mk][1]}.`)}
  if(r.hero){const nm=heroMedal(r.hero>=3&&chance(.35)?3:r.hero>=2?2:1);out.push(`Voor je moed krijg je ${nm}!`);S.fame=clamp(S.fame+(r.hero>=2?6:2))}
  const bonus=Math.round(m.mo*1100*(S.cpi||1)*(1+m.risk*.4));cash(bonus);M.perf=clamp(M.perf+4);M.mor=clamp(M.mor+(M.tr>=40?-10:5));for(const p of M.ppl||[])p.rel=clamp(p.rel+8);
  const pt=partner();if(pt)pt.rel=clamp(pt.rel-ri(2,6));for(const k of living('kind'))k.rel=clamp(k.rel-ri(1,4));hap(M.tr>=40?-4:6);MS(`Diende ${m.mo} maanden op missie: ${m.n}`,2);
  if(S.flags.invalide&&!S.mil.invOut){milLeave('Je wordt medisch afgekeurd en verlaat Defensie.','bad');}
  return `Na ${m.mo} maanden kom je thuis van ${m.n}. Missietoelage: ${fmt(bonus)}. ${out.join(' ')}`}});
/* ---------- kazerne-gebeurtenissen ---------- */
const milIn=()=>S.mil&&S.mil.st!=='opl'&&!S.mil.onmis&&!inJail();
const KE=(id,o)=>E(id,Object.assign({sys:1,mev:1,need:()=>!!S.mil},o));
KE('mk_nachtalarm',{c:milIn,t:'Nachtalarm!',x:'Om 03:12 gaan de lichten aan. "IN DE BENEN! Over tien minuten volledig bepakt buiten!"',ch:[
 ['⚡ Binnen vijf minuten klaarstaan',()=>{const M=S.mil;if(chance(.4+M.fys/250)){M.perf=clamp(M.perf+5);return 'Je staat als eerste buiten. De sergeant knikt. Dat is het hoogste compliment.'}M.perf=clamp(M.perf-2);return 'Je vergeet je helm. Twintig push-ups in de regen.'}],
 ['😴 Nog één minuutje...',()=>{S.mil.perf=clamp(S.mil.perf-5);return 'De hele groep moet extra rondjes lopen. Door jou. Ze zijn niet blij.'}]]});
KE('mk_sergeant',{c:milIn,t:'Strenge sergeant',x:'De nieuwe sergeant-majoor heeft het op jou gemunt. Je kast is "een zwijnenstal", je laarzen "een schande".',ch:[
 ['🫡 Ja, sergeant-majoor!',()=>{S.mil.perf=clamp(S.mil.perf+3);S.mil.mor=clamp(S.mil.mor-3);return 'Je poetst je laarzen tot je jezelf erin ziet. Na een maand laat hij je met rust.'}],
 ['🗯️ Terugpraten',()=>{if(chance(.3)){S.mil.mor=clamp(S.mil.mor+4);return 'Hij grijnst. "Eindelijk iemand met lef." Vanaf nu respecteert hij je.'}S.mil.perf=clamp(S.mil.perf-8);return 'Je krijgt een week kazernearrest.'}]]});
KE('mk_wapen',{c:milIn,t:'Kwijt!',x:'Bij de wapencontrole mis je een magazijn. Dat is heel, heel ernstig.',ch:[
 ['🔦 De hele nacht zoeken',()=>{if(chance(.7)){S.mil.mor=clamp(S.mil.mor-2);return 'Om 4 uur vind je het, onder de bank van de vrachtwagen. Pfoe.'}S.mil.perf=clamp(S.mil.perf-12);return 'Niet gevonden. Er volgt een officieel onderzoek en een aantekening in je dossier.'}],
 ['📢 Direct melden',()=>{S.mil.perf=clamp(S.mil.perf-4);return 'Eerlijk melden wordt gewaardeerd. De hele compagnie zoekt mee en het wordt gevonden.'}]]});
KE('mk_blessure',{c:milIn,t:'Blessure',x:'Tijdens een mars voel je iets knappen in je knie.',ch:[
 ['🦵 Doorlopen',()=>{const M=S.mil;if(chance(.5)){M.perf=clamp(M.perf+3);return 'Je haalt de finish. Achteraf blijkt het mee te vallen.'}hea(-8);M.fys=clamp(M.fys-12);return 'Het wordt erger. Je ligt zes weken uit.'}],
 ['🚑 Stoppen en laten nakijken',()=>{S.mil.fys=clamp(S.mil.fys-3);return 'Een overbelaste pees. Twee weken rust en je bent weer fit.'}]]});
KE('mk_maat',{c:()=>milIn()&&(S.mil.ppl||[]).some(p=>p.kind==='maat'),ctx:()=>{const p=pick(S.mil.ppl.filter(p=>p.kind==='maat'));return {id:p.id}},t:'Een maat in de knel',x:c=>`${(milP(c.id)||{first:'Je maat'}).first} heeft schulden en durft het niemand te vertellen. Behalve jou.`,ch:[
 ['💶 Geld lenen',c=>{const p=milP(c.id);const k=Math.round(1500*(S.cpi||1));cash(-k);if(p)p.rel=clamp(p.rel+15);return `Je leent ${fmt(k)}. ${p?p.first:'Je maat'} vergeet het je nooit.`}],
 ['🧭 Doorverwijzen naar hulp',c=>{const p=milP(c.id);if(p)p.rel=clamp(p.rel+6);return 'Je gaat mee naar de bedrijfsmaatschappelijk werker. Er komt een plan.'}],
 ['🤐 Er buiten blijven',c=>{const p=milP(c.id);if(p)p.rel=clamp(p.rel-10);return 'Je zegt dat het niet jouw probleem is. Het wordt stil tussen jullie.'}]]});
KE('mk_parade',{c:milIn,t:'Veteranendag',x:'Je loopt mee in het defilé op Veteranendag in Den Haag.',ch:[
 ['🎖️ Trots meelopen',()=>{S.mil.mor=clamp(S.mil.mor+6);hap(4);return 'Mensen klappen langs de kant. Een oude veteraan salueert naar je.'}]]});
KE('mk_dubieus',{c:()=>milIn()&&S.mil.route==='off'&&S.mil.rank>=2,t:'Een twijfelachtig bevel',x:'Een hogere officier wil dat je een ongeluk tijdens een oefening "niet te uitgebreid" rapporteert.',ch:[
 ['📝 Gewoon alles rapporteren',()=>{if(chance(.6)){kar(4);S.mil.perf=clamp(S.mil.perf+2);return 'Er komt een onderzoek. Jij krijgt achteraf gelijk.'}S.mil.perf=clamp(S.mil.perf-8);kar(4);return 'Je wordt gezien als lastig. Je volgende bevordering laat op zich wachten.'}],
 ['🤫 Het bevel opvolgen',()=>{kar(-4);S.mil.perf=clamp(S.mil.perf+4);if(chance(.2)){S.mil.perf=clamp(S.mil.perf-20);return 'Het komt toch uit. Je naam staat in het rapport.'}return 'Het rapport wordt kort. Niemand vraagt ernaar.'}]]});
KE('mk_uitzendvraag',{c:()=>milIn()&&!S.mil.mis&&S.mil.yrs>=2&&S.mil.ry!==year(),t:'Je eenheid gaat op missie',x:'Je eenheid wordt uitgezonden. Je commandant vraagt of je meegaat.',ch:[
 ['🌍 Ja, ik ga mee',()=>{const M=S.mil;const m=pick(misAvail());M.mis={id:m.id,y:year()};return `Je gaat mee: ${m.n}.`}],
 ['🏠 Nee, deze keer niet',()=>{S.mil.perf=clamp(S.mil.perf-3);return 'Je blijft achter in de kazerne. Een beetje jaloers zie je ze vertrekken.'}]]});
Object.assign(EVMETA,{mis_patrouille:['Uitzending','🚙'],mis_hinderlaag:['Uitzending','💥'],mis_bermbom:['Uitzending','💣'],mis_burgers:['Uitzending','🧒'],mis_piraten:['Uitzending','🏴‍☠️'],mis_onderschep:['Uitzending','🛩️'],mis_storm:['Uitzending','🌀'],mis_thuisfront:['Uitzending','📱'],mis_maatgewond:['Uitzending','🕯️'],mis_einde:['Uitzending','🏠'],
 mk_nachtalarm:['Defensie','🚨'],mk_sergeant:['Defensie','😤'],mk_wapen:['Defensie','🔫'],mk_blessure:['Defensie','🦵'],mk_maat:['Defensie','🤝'],mk_parade:['Defensie','🎖️'],mk_dubieus:['Defensie','📝'],mk_uitzendvraag:['Defensie','🌍']});
function milYear2(){const M=S.mil;if(!M||M.pow)return;milInit2();if(M.st==='opl')return;
  const tgt=S.sk.sport*.55+S.st.health*.45;M.fys=clamp(Math.round(M.fys+(tgt-M.fys)*.25+((S.lastActs||{}).mtrain?2:-1)));
  const kam=(M.ppl||[]).reduce((s,p)=>s+p.rel,0)/Math.max(1,(M.ppl||[]).length);M.mor=clamp(Math.round(M.mor+(50+(kam-50)*.4-M.tr*.3-M.mor)*.25+ri(-3,3)));
  M.perf=clamp(M.perf+(M.fys-50)/25+(M.mor-50)/35);if(M.tr>=25)hap(-Math.min(5,Math.round(M.tr/15)));M.tr=Math.max(0,M.tr-5);
  if(M.mis&&M.mis.y<year()){misRun();return}
  // kazerne-event
  const pool=Object.keys(EV).filter(k=>EV[k].mev&&!Q.some(q=>q.id===k)&&(S.evLast[k]==null||S.m-S.evLast[k]>=24)&&safe(()=>EV[k].c()));
  if(pool.length&&chance(.75)){const id=pick(pool);const e=EV[id];const c=e.ctx?safe(()=>e.ctx()):{};if(c){S.evLast[id]=S.m;Q.push({id,c})}}}

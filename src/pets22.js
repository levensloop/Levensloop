/* ================= FASE 22: huisdieren =================
   Keuzes Thijmen: verzorging, karakter en trucjes, meer soorten, jongen en afscheid.
   Bestond al: 7 soorten met rassen (PETBR), asiel, spelen/uitlaten/dierenarts/weggeven, ziek (dierziek), weglopen, exotische dieren (haunt.js).
   22.1 verzorging: p.hl (gezondheid) en p.rel (band); voer, borstelen, trimsalon; verwaarlozing maakt ziek of zwak
   22.2 karakter (p.pkt) en trucjes (p.tr22), shows en wedstrijden (p.cups)
   22.3 meer soorten: cavia, vissen, fret, rat, kip, geit, ezel (kip/geit/ezel alleen met eigen huis)
   22.4 jongen (p.pg geslacht, p.fix gesteriliseerd), senior en afscheid (p22_oud, p22_afscheid) */

// ---------- 22.3 meer soorten ----------
PETS.push(['cavia',40,[5,8]],['vissen',80,[3,10]],['fret',150,[6,10]],['rat',20,[2,3]],['kip',25,[6,10]],['geit',300,[12,18]],['ezel',1500,[25,40]]);
Object.assign(PETBR,{cavia:{c:['wit','bruin','driekleur','zwart','rosette']},vissen:{q:'Welk aquarium?',l:[['Klein aquarium met guppy\'s',80,[3,6],null],['Tropisch aquarium',450,[6,10],null],['Koivijver',2500,[20,35],null]]},
  fret:{c:['iltis','albino','zilver','zwart']},rat:{c:['wit','zwart-wit','beige','grijs']},kip:{q:'Welk ras?',l:[['Gewone legkip',25,[6,10],['bruin','wit','zwart']],['Krielkip',35,[7,10],['goud','zilver']],['Zijdehoen',60,[7,9],['wit','zwart','buff']]]},
  geit:{q:'Welk ras?',l:[['Dwerggeit',300,[12,16],['wit','bruin','bont']],['Nubische geit',700,[12,18],['bruin','zwart','gevlekt']]]},ezel:{c:['grijs','bruin','zwart']}});
Object.assign(PETEM,{cavia:'🐹',vissen:'🐠',fret:'🦦',rat:'🐀',kip:'🐔',geit:'🐐',ezel:'🫏'});
const TUIN22=['kip','geit','ezel','paard'];
const needTuin=sp=>TUIN22.includes(sp)&&S.home.k!=='eigen'&&!(sp==='paard');
// in de dierenwinkel: kip/geit/ezel alleen met een eigen huis (een paard staat in een stal)
petBreed=(f=>function(sp){if(needTuin(sp)&&ageY()>=18){toast('Daarvoor heb je een eigen huis met tuin nodig');return}return f.apply(this,arguments)})(petBreed);
petColor=(f=>function(sp){if(needTuin(sp)&&ageY()>=18){toast('Daarvoor heb je een eigen huis met tuin nodig');return}return f.apply(this,arguments)})(petColor);

// ---------- 22.2 karakter ----------
const PKT={Speels:'wil altijd spelen',Lui:'ligt het liefst op de bank',Slim:'leert snel',Eigenwijs:'doet waar het zelf zin in heeft',Knuffelig:'kruipt graag bij je op schoot',Angstig:'schrikt van alles',Ondeugend:'haalt graag kattenkwaad uit',Trouw:'wijkt niet van je zijde'};
const pkt=p=>{if(!p.pkt){let h=0;for(const c of String(p.id))h=(h*31+c.charCodeAt(0))>>>0;p.pkt=Object.keys(PKT)[h%8]}return p.pkt};
const pg=p=>{if(!p.pg){let h=7;for(const c of String(p.id))h=(h*17+c.charCodeAt(0))>>>0;p.pg=h%2?'v':'m'}return p.pg};
addPet=(f=>function(sp,name,o={}){const p=f.apply(this,arguments);p.pkt=pick(Object.keys(PKT));p.pg=pick(['m','v']);p.hl=90;p.tr22=[];return p})(addPet);
const TRICK={hond:['Zit','Poot geven','Liggen','Rollen','Dood spelen','Apporteren','Op de achterpoten','Door een hoepel springen'],kat:['Zit','High five','Komen als je roept','Door een hoepel'],papegaai:['"Hallo" zeggen','Je naam zeggen','Fluiten als een telefoon','Een liedje zingen'],
  paard:['Buigen','Spaanse pas','Springen over een hindernis','Achteruit lopen'],konijn:['Over een hekje springen','Een rondje draaien','Op commando komen'],rat:['Door een doolhof','Een balletje rollen'],fret:['Rollen','Door een tunnel']};
const SHOW={hond:['Hondenshow','🏆'],kat:['Kattenshow','🏆'],paard:['Concours','🏇'],konijn:['Konijnenhoppen','🐇'],papegaai:['Vogelshow','🦜'],kip:['Pluimveeshow','🐔']};
const lifeOf=p=>p.life||10,senior=p=>p.born!=null&&pAge(p)>=Math.max(2,Math.round(lifeOf(p)*.75));

// ---------- in het scherm van het dier ----------
function pet22Rows(el,p){if(p.role!=='huisdier'||!p.alive)return;pkt(p);pg(p);p.hl=p.hl??85;const a=pAge(p);const cp=S.cpi||1,my=ageY();
  card(el,`<div class="pstats"><span>Gezondheid</span><i><b style="width:${p.hl}%;background:${statCol(p.hl)}"></b></i><span>Jullie band</span><i><b style="width:${Math.round(p.rel)}%;background:${statCol(p.rel)}"></b></i></div><p class="muted" style="margin:.5em 0 0">${pg(p)==='v'?'♀':'♂'} · ${p.pkt.toLowerCase()}: ${PKT[p.pkt]}${senior(p)?' · senior':''}${(p.tr22||[]).length?` · kan: ${p.tr22.join(', ').toLowerCase()}`:''}${(p.cups||[]).length?` · 🏆 ${p.cups.length}×`:''}</p>`);
  const s=sec(el,'Verzorgen');const kid=my<12;
  row(s,{ic:'🥣',t:'Voer kopen',s:p.voer?`Nu: ${['goedkoop','goed','premium'][p.voer-1]} voer`:'Goed voer houdt je dier gezond',dots:true,on:()=>modal({title:'Voer',em:'🥣',cat:p.first,text:'Welk voer koop je voor dit jaar?',choices:opts([['Goedkoop',.3,1],['Goed',.7,2],['Premium',1.4,3]].map(([t,f,v])=>({t,s:fmt(Math.round((p.cost||300)*f*.25*cp)),on:()=>{closeModal();doAct('Voer',()=>{if(!kid)cash(-Math.round((p.cost||300)*f*.25*cp));p.voer=v;p.cy=year();p.hl=clamp(p.hl+(v-1)*4);return v===3?`${p.first} eet als een koning.`:v===2?`${p.first} smult.`:`${p.first} eet het, maar kijkt je verwijtend aan.`},true,'🥣')}})))})});
  if(['hond','kat','konijn','cavia','paard','ezel','geit','fret'].includes(p.sp))row(s,{ic:'🪮',t:p.sp==='paard'||p.sp==='ezel'?'Poetsen':'Borstelen',on:()=>doAct('Verzorgen',()=>{const m=use('bors'+p.id);p.cy=year();p.rel=clamp(p.rel+Math.round(ri(2,6)*m));p.hl=clamp(p.hl+Math.round(2*m));return p.pkt==='Eigenwijs'&&chance(.4)?`${p.first} loopt na drie halen weg. Volgende keer beter.`:`${p.first} glanst weer helemaal.`},true,'🪮')});
  if(['hond','kat'].includes(p.sp)&&my>=12)row(s,{ic:'✂️',t:'Naar de trimsalon',s:fmt(Math.round(60*cp)),dis:S.money<60*cp,on:()=>doAct('Trimsalon',()=>{cash(-Math.round(60*cp));p.cy=year();p.hl=clamp(p.hl+4);p.rel=clamp(p.rel+(p.pkt==='Angstig'?-3:2));return p.pkt==='Angstig'?`${p.first} trilt de hele tijd, maar ziet er daarna prachtig uit.`:`${p.first} komt terug met een strikje.`},true,'✂️')});
  if(!p.fix&&['hond','kat','konijn','cavia','fret','rat'].includes(p.sp)&&my>=16)row(s,{ic:'💉',t:pg(p)==='v'?'Laten steriliseren':'Laten castreren',s:`${fmt(Math.round(150*cp))} · geen ongeplande jongen`,dis:S.money<150*cp,on:()=>doAct('Dierenarts',()=>{cash(-Math.round(150*cp));p.fix=1;return `${p.first} is na een dagje een beetje suf, maar alles is goed gegaan.`},true,'💉')});
  // trucjes en shows
  const T=TRICK[p.sp];if(T){const left=T.filter(x=>!(p.tr22||[]).includes(x));const s2=sec(el,'Trucjes en wedstrijden');
    row(s2,{ic:'🎓',t:'Een trucje leren',s:left.length?`Volgende: ${left[0].toLowerCase()}`:'Kan alle trucjes!',dis:!left.length||a<1||senior(p)&&chance(0),on:()=>doAct('Trainen',()=>{const m=use('truc'+p.id);p.cy=year();if(!m)return `${p.first} heeft er vandaag geen zin meer in.`;
      const c=(.45+(p.pkt==='Slim'?.25:p.pkt==='Eigenwijs'?-.2:p.pkt==='Lui'?-.15:0)+p.rel/400-(senior(p)?.2:0))*m;if(chance(c)){p.tr22=(p.tr22||[]).concat(left[0]);p.rel=clamp(p.rel+3);hap(2);return `${p.first} kan nu: ${left[0].toLowerCase()}! 🎉`}return pick([`${p.first} kijkt je aan alsof je gek bent.`,`Bijna! Nog een paar keer oefenen.`,`${p.first} eet alle snoepjes op en doet niets.`])},true,'🎓')})}
  const SH=SHOW[p.sp];if(SH&&a>=1&&!senior(p)){const k=Math.round(45*cp);row(sec(el,T?'':'Wedstrijden'),{ic:SH[1],t:`Meedoen aan een ${SH[0].toLowerCase()}`,s:S.acts['show'+p.id]?'Dit jaar al meegedaan':`Inschrijven: ${fmt(k)}`,dis:!!S.acts['show'+p.id]||(my>=12&&S.money<k),dots:true,on:()=>petShow(p,SH,k)})}
  // jongen
  if(!p.fix&&pg(p)==='v'&&['hond','kat','konijn','cavia','kip','geit'].includes(p.sp)&&a>=1&&a<=Math.max(2,lifeOf(p)*.5)&&my>=16)row(sec(el,'Jongen'),{ic:'🍼',t:p.sp==='kip'?'Eieren laten uitbroeden':'Een nestje laten krijgen',s:p.sp==='kip'?'Kuikens!':`Je zoekt een ${p.sp==='hond'?'dekreu':'partner'} · ${fmt(Math.round(100*cp))}`,dis:!!S.acts['nest'+p.id]||S.money<100*cp,dots:true,on:()=>{S.acts['nest'+p.id]=1;cash(-Math.round(100*cp));Q.push({id:'p22_nest',c:{id:p.id}});closeSheet();processQ()}})}
sheetPerson=(f=>function(el,p){const r=f.apply(this,arguments);if(p&&p.role==='huisdier')safe(()=>pet22Rows(el,p));return r})(sheetPerson);
function petShow(p,SH,k){const my=ageY();doAct(SH[0],()=>{S.acts['show'+p.id]=1;if(my>=12)cash(-k);const ras=p.br&&!/Asiel|Gewone/.test(p.br);
  const sc=(p.tr22||[]).length*6+p.hl*.25+p.rel*.2+(ras?10:0)+(p.pkt==='Angstig'?-15:p.pkt==='Speels'?5:0)+ri(-15,25);const pl=sc>=75?1:sc>=62?2:sc>=50?3:0;
  if(!pl){hap(-1);return pick([`${p.first} doet het prima, maar valt buiten de prijzen. Jij bent toch trots.`,`${p.first} besluit midden in de ring te gaan liggen. Het publiek vindt het schattig.`])}
  p.cups=(p.cups||[]).concat([[year(),pl,SH[0]]]);const prize=Math.round([0,250,100,50][pl]*(S.cpi||1));cash(prize);hap(4+(3-pl)*2);p.rel=clamp(p.rel+4);if(pl===1)S.fame=clamp((S.fame||0)+.5);
  return `${['','🥇 Eerste','🥈 Tweede','🥉 Derde'][pl]} plaats voor ${p.first}! Je wint ${fmt(prize)} en een beker.`},true,SH[1])}

// ---------- 22.4 jongen ----------
const LITTER={hond:[3,7],kat:[3,5],konijn:[4,8],cavia:[2,4],kip:[4,8],geit:[1,3]};
E('p22_nest',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Jongen!',ctx:c=>c,x:c=>{const p=P(c.id);c.n=c.n||ri(...(LITTER[p.sp]||[2,4]));return `${p.first} heeft ${c.n} ${p.sp==='kip'?'kuikens':p.sp==='hond'?'puppy\'s':p.sp==='kat'?'kittens':'jongen'}! Ze zijn piepklein en schattig. Wat doe je ermee?`},ch:[
  ['🏠 Er één houden, de rest weggeven',c=>{const p=P(c.id);const o={br:p.br,col:p.col};const k=addPet(p.sp,null,o);k.cost=p.cost;for(const f of living(['vriend','broer','zus']).slice(0,2))f.rel=clamp(f.rel+4);hap(8);return `Je houdt er één: ${k.first}. De anderen gaan naar vrienden en familie, die er dolblij mee zijn.`}],
  ['💶 Verkopen',c=>{const p=P(c.id);const ras=p.br&&!/Asiel|Gewone/.test(p.br);const per=Math.round((ras?(p.cost||300)*.6:p.sp==='kip'?5:40)*(S.cpi||1));const n=c.n||3;cash(per*n);hap(3);return `Je verkoopt ze allemaal, voor ${fmt(per)} per stuk (${fmt(per*n)}).`}],
  ['🎁 Allemaal weggeven',c=>{hap(4);kar(2);for(const f of living(['vriend','broer','zus']).slice(0,3))f.rel=clamp(f.rel+5);return 'Je geeft ze allemaal aan goede baasjes. De foto\'s die je terugkrijgt zijn hartverwarmend.'}]]});
// ongepland nestje: twee onvoorzichtige dieren van dezelfde soort
F8.year.push(a=>{if(!S.alive)return;const pets=living('huisdier');const now=year();
  for(const p of pets){pkt(p);pg(p);p.hl=p.hl??85;
    // verzorging vorig jaar
    const L_=S.lastActs||{};const cared=p.cy===now-1||p.cy===now||L_['spel'+p.id]||L_['zorg'+p.id]||L_['bors'+p.id];const sen=senior(p);
    let d=cared?2:-ri(4,9);if(p.voer===3)d+=2;else if(p.voer===1)d-=1;if(sen)d-=ri(2,5);if(ageY()<12&&living(['moeder','vader']).length)d=Math.max(d,0);// je ouders zorgen mee
    p.hl=clamp(Math.round(p.hl+d));if(!cared&&ageY()>=12)p.rel=clamp(p.rel-ri(3,7));
    if(p.hl<30&&!sen&&chance(.25)&&!Q.some(q=>q.id==='dierziek'))Q.push({id:'dierziek',c:{id:p.id}});
    if(p.hl<15&&!sen){p.life=Math.max(pAge(p)+1,lifeOf(p)-1)}// verwaarlozing kost levensjaren
    // senior: één keer een moment, als het einde nadert
    if(sen&&!p.old22&&pAge(p)>=lifeOf(p)-1){p.old22=1;if(!Q.some(q=>/^p22_/.test(q.id)))Q.push({id:'p22_oud',c:{id:p.id}})}
    if(p.pkt==='Ondeugend'&&chance(.12))L(`🐾 ${p.first} ${pick(['heeft je bank aangevreten','heeft een hele taart van het aanrecht gestolen','heeft je schoenen verstopt','heeft de kerstboom omgegooid'])}.`)}
  const unfixed=pets.filter(p=>!p.fix&&['kat','konijn','cavia','rat'].includes(p.sp));
  for(const p of unfixed)if(pg(p)==='v'&&unfixed.some(q=>q!==p&&q.sp===p.sp&&pg(q)==='m')&&chance(.35)&&!Q.some(q=>q.id==='p22_nest')){Q.push({id:'p22_nest',c:{id:p.id}});L(`🐾 Oeps. ${p.first} is zwanger. Dat was niet de bedoeling.`);break}
  // afscheid van een dier dat net is overleden
  for(const p of S.rel)if(p.role==='huisdier'&&p.alive===false&&!p.gone&&!p.afs&&p.died!=null&&ageY()-p.died<=1){p.afs=1;if(!Q.some(q=>q.id==='p22_afscheid'))Q.push({id:'p22_afscheid',c:{id:p.id}});break}});
E('p22_oud',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive,t:'Oud geworden',x:c=>{const p=P(c.id);return `${p.first} is oud geworden. Ze ${p.sp==='vissen'?'zwemmen':'loopt'} langzamer en slaapt veel. De dierenarts zegt dat het niet lang meer duurt.`},ch:[
  ['🌳 Er nog een mooie tijd van maken',c=>{const p=P(c.id);p.rel=clamp(p.rel+10);hap(3);return `Je neemt ${p.first} mee naar ${pick(['het strand','het bos','het park waar jullie altijd kwamen'])} en verwent ${p.sp==='kip'?'haar':'het dier'} met lekkers. Een gouden tijd.`}],
  ['💊 Alles doen bij de dierenarts',c=>{const p=P(c.id);const k=Math.round(ri(4,12)*100*(S.cpi||1));if(ageY()>=18)cash(-k);p.life=lifeOf(p)+1;p.hl=clamp(p.hl+15);return `Met medicijnen krijgt ${p.first} nog een extra jaar.${ageY()>=18?` Kosten: ${fmt(k)}.`:''}`}]]});
E('p22_afscheid',{sys:1,need:c=>!!P(c.id),t:'Afscheid',x:c=>{const p=P(c.id);return `${p.first} is er niet meer. ${pAge(p)>=lifeOf(p)-1?'Na een lang en fijn leven.':''} Hoe neem je afscheid?`},ch:[
  ['🌷 Begraven in de tuin',c=>{const p=P(c.id);hap(2);return `Je begraaft ${p.first} onder ${pick(['de appelboom','de rozen','het favoriete plekje in de zon'])}. Er komt een steentje met de naam erop.`},c=>S.home.k==='eigen'||S.home.k==='ouders'],
  ['🕯️ Laten cremeren',c=>{const p=P(c.id);if(ageY()>=18)cash(-Math.round(150*(S.cpi||1)));hap(2);return `De as van ${p.first} krijgt een mooi plekje in een klein urntje op de kast.`}],
  ['🖼️ Een foto inlijsten',c=>{const p=P(c.id);hap(1);return `De mooiste foto van ${p.first} hangt nu in de gang. Elke keer dat je erlangs loopt, glimlach je even.`}]]});
Object.assign(EVMETA,{p22_nest:['Huisdieren','🍼'],p22_oud:['Huisdieren','🐾'],p22_afscheid:['Huisdieren','🕯️']});

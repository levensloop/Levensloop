/* ================= FASE 12: activiteiten =================
   12.1 een activiteit is een moment met een keuze (met een knop "Snel" voor wie alleen het resultaat wil)
   12.2 samen doen: kies wie er meegaat (telt voor jullie band en wordt soms een herinnering)
   12.3 hobby's met een doel: exposeren of optreden, er je beroep van maken
   12.4 reizen: 30 bestemmingen, een reisgenoot, iets onderweg, souvenirs (S.souv)
   12.5 uitgaan: met wie, en hoeveel je drinkt
   12.6 nieuw: cultuur, buiten (met volkstuin), sport kijken, leren (talen, cursussen, geloof) */
Object.assign(MEMT,{'uit+':['🎟️','Jullie gingen samen naar {x}',2],'reis+':['🧳','Jullie reisden samen naar {x}',4],'kamp+':['⛺','Jullie gingen samen kamperen',3],'stad+':['🏟️','Jullie zagen samen {x} spelen',2]});
const cpX=k=>Math.round(k*(S.cpi||1));
// ---------- 12.2 met wie ----------
function buddies(minAge){return living(['partner','kind','vriend','broer','zus','moeder','vader','kleinkind']).filter(p=>!p.gone&&pAge(p)>=(minAge||4)&&!(typeof abroad==='function'&&abroad(p))&&!(p.jail&&p.jail.until>S.m)).sort((a,b)=>b.rel-a.rel).slice(0,6)}
function withWho(title,em,cb,o={}){if(inJail()){toast('Niet vanuit de gevangenis');return}const ps=buddies(o.min);
  modal({title,em,cat:o.cat||'Activiteit',text:'Met wie ga je?',choices:[{t:'⚡ Snel',s:'Meteen, zonder keuzes',on:()=>{closeModal();cb(null,true)}},{t:'🙋 Alleen',on:()=>{closeModal();cb(null,false)}},...ps.map(p=>({t:p.first,ic:faceOf(p),s:roleLabel(p),on:()=>{closeModal();cb(p,false)}})),{t:'Annuleren',cls:'ghost',on:closeModal}]})}
function withFx(p,code,arg){if(!p)return '';p.rel=clamp(p.rel+ri(4,9));hap(1);if(code&&chance(.3)&&typeof memAdd==='function')memAdd(p,code,arg);return ''}
// een keuze-moment na "met wie": [label, fn(p) → tekst]
function scene(title,em,text,opts_,p){modal({title,em,cat:p?`Met ${p.first}`:'Alleen',person:p||undefined,text,choices:opts_.map(([t,fn,dis])=>({t,dis:!!dis,on:()=>{closeModal();doAct(title,()=>fn(p),true,em)}}))})}

// ---------- 12.1 bioscoop, dierentuin, pretpark ----------
const FILMS=[['💥','Actiefilm','Veel explosies, weinig verhaal.'],['😂','Komedie','Je lacht zo hard dat je popcorn morst.'],['👻','Horrorfilm','Je slaapt vannacht met het licht aan.'],['💕','Romantische film','Je pinkt een traantje weg.'],['🧸','Animatiefilm','Leuker dan verwacht.'],['📽️','Arthousefilm','Je snapt er niks van, maar voelt je cultureel.']];
sheetMovies=function(el){const s=sec(el,'Wat draait er?');for(const [ic,t,txt] of FILMS)row(s,{ic,t,s:fmt(cpX(13)),dis:S.money<13&&ageY()>=18,dots:true,on:()=>withWho(t,ic,(p,quick)=>{
  const pay=()=>{if(ageY()>=18)cash(-cpX(13)*(p?2:1))};const base=()=>{const m=use('film');hap(ri(2,5)*m);return txt};
  if(quick)return doAct(t,()=>{pay();return base()},true,ic);
  scene(t,ic,'De aftiteling loopt. Wat vond je ervan?',[['⭐⭐⭐⭐⭐ Geweldig',q=>{pay();const r=base();withFx(q,'uit+','de film');hap(1);return `${r} ${q?(chance(.6)?`${q.first} vond hem ook fantastisch.`:`${q.first} vond er niks aan. Jullie discussiëren de hele weg naar huis.`):''}`}],['⭐⭐⭐ Prima',q=>{pay();const r=base();withFx(q);return r}],['⭐ Niks aan',q=>{pay();hap(-1);withFx(q);return `Twee uur van je leven die je nooit terugkrijgt.${q?` ${q.first} slaapt halverwege in.`:''}`}]],p)},{cat:'Bioscoop'})})};
zoo=function(){withWho('Dierentuin','🦓',(p,quick)=>{const pay=()=>{if(ageY()>=18)cash(-cpX(28)*(p?2:1))};
  if(quick)return doAct('Dierentuin',()=>{pay();const k=use('zoo');hap(3*k);return pick(['De pinguïns zijn je favoriet.','Een aap gooit iets naar je. Je wil niet weten wat.','De leeuw kijkt je recht in de ogen.'])},true,'🦓');
  scene('Dierentuin','🦓','Waar ga je eerst heen?',[['🐧 De pinguïns',q=>{pay();hap(3);withFx(q,'uit+','de dierentuin');return 'Net op tijd voor het voeren. Een pinguïn glijdt op zijn buik het water in.'}],['🦁 De leeuwen',q=>{pay();hap(3);withFx(q,'uit+','de dierentuin');return 'De leeuw brult. Iedereen schrikt, en een kind laat zijn ijsje vallen.'}],['🐒 De apen',q=>{pay();hap(3);withFx(q,'uit+','de dierentuin');return pick(['Een aap pikt de zonnebril van een toerist.','De apen kijken net zo naar jou als jij naar hen.'])}],['🦒 De giraffen',q=>{pay();hap(3);withFx(q,'uit+','de dierentuin');return 'Je mag een giraffe voeren. Haar tong is blauw en eindeloos lang.'}]],p)},{cat:'Dagje uit'})};
function pretpark(){withWho('Pretpark','🎢',(p,quick)=>{const pay=()=>{if(ageY()>=16)cash(-cpX(45)*(p?2:1))};
  if(quick)return doAct('Pretpark',()=>{pay();const m=use('pret');hap(Math.round(5*m));return pick(['De achtbaan is zo hard dat je je stem kwijt bent.','Je staat twee uur in de rij voor één minuut plezier. Toch de moeite waard.'])},true,'🎢');
  scene('Pretpark','🎢','Waar begin je?',[['🎢 De wildste achtbaan',q=>{pay();use('pret');if(chance(.15)){hap(1);return 'Je wordt misselijk en ziet de rest van de dag groen.'}hap(6);withFx(q,'uit+','het pretpark');return 'Drie loopings. Je gilt, je lacht, je wilt meteen nog een keer.'}],['🎠 Rustige attracties',q=>{pay();use('pret');hap(4);withFx(q,'uit+','het pretpark');return 'Draaimolen, sprookjesbos, botsauto\'s. Ontspannen en gezellig.'}],['🍟 Vooral eten',q=>{pay();use('pret');hap(3);hea(-1);cash(-cpX(25));withFx(q);return 'Churros, friet, een suikerspin zo groot als je hoofd.'}]],p)},{cat:'Dagje uit'})}

// ---------- 12.4 reizen ----------
const DEST=[
 ['Europa',[['🗼','Parijs',700],['🏛️','Rome',750],['🏖️','Barcelona',700],['💂','Londen',650],['🏰','Praag',550],['🚋','Lissabon',650],['🏝️','De Griekse eilanden',900],['🌋','IJsland',1400],['🏔️','De fjorden van Noorwegen',1300],['⛵','Kroatië',850]]],
 ['Azië',[['🗾','Tokio',2600],['🌺','Bali',2200],['🐘','Thailand',2000],['🍜','Vietnam',2100],['🏙️','Dubai',1600],['🕌','Rajasthan, India',2000]]],
 ['Amerika',[['🗽','New York',1900],['🌉','Californië',2400],['🌮','Mexico',2000],['🦙','Machu Picchu, Peru',2800],['🎭','Rio de Janeiro',2400],['🍁','De Rocky Mountains',2300],['🚗','Cuba',1900]]],
 ['Afrika',[['🕌','Marrakech',600],['🦁','Safari in Kenia',3200],['🐧','Kaapstad',2500],['🐫','De piramides van Egypte',1300]]],
 ['Oceanië',[['🦘','Australië',3500],['🥝','Nieuw-Zeeland',3800]]]];
const REISEV=[
 ['Je vlucht heeft zes uur vertraging.',[['⏳ Wachten met een boek',()=>'Je leest een heel boek uit op het vliegveld.'],['🃏 Kaarten met andere reizigers',()=>{hap(1);return 'Je leert drie Australiërs pesten. Een topbegin.'}]]],
 ['Je koffer is niet meegekomen.',[['🛍️ Nieuwe kleren kopen',()=>{cash(-cpX(250));return 'Je koopt een complete nieuwe garderobe. Twee dagen later is je koffer er alsnog.'}],['😤 Wachten in je reiskleren',()=>{hap(-1);return 'Twee dagen in dezelfde broek. Dan is je koffer er.'}]]],
 ['De lokale markt is overweldigend.',[['🤝 Afdingen',()=>{hap(1);return 'Je dingt af tot de helft. De verkoper lacht: hij had nog meer gerekend.'}],['💶 Gewoon betalen',()=>'Je koopt een prachtig kleed. Veel te duur, maar wat maakt het uit.']]],
 ['Het weer is fantastisch.',[['🏖️ Naar het strand',()=>{hap(2);loo(1);return 'Je ligt een week in de zon. Bruin en uitgerust.'}],['🥾 Een excursie',()=>{hap(2);sma(1);return 'Je ziet een plek die je nooit meer vergeet.'}]]],
 ['Je eet iets op straat dat er heerlijk uitziet.',[['😋 Nog een portie',()=>{if(chance(.4)){hea(-3);return 'Twee dagen met buikpijn in je hotelkamer. Achteraf toch niet zo heerlijk.'}hap(2);return 'Het lekkerste dat je ooit at.'}],['🙅 Toch maar niet',()=>'Je houdt het bij het hotelontbijt.']]],
 ['In het hostel ontmoet je iemand heel leuks.',[['💬 Contact houden',()=>{if(typeof addFriend==='function'){const f=addFriend();if(f)f.grp='reis'}return 'Jullie wisselen nummers uit. Je hebt er een vriend bij.'}],['👋 Gezellig, maar dat was het',()=>'Een leuke avond. Morgen reizen jullie verder.']]]];
GRPN.reis='Vrienden van je reizen';GRPN.geloof='Vrienden van je geloofsgemeenschap';
function trip(e,n,k){withWho(n,e,(p,quick)=>{const cost=cpX(k)*(p?1.8:1);if(S.money<cost){toast('Daar heb je niet genoeg geld voor');return}
  const fin=(extra,q)=>{cash(-Math.round(cost));const m=use('reis');hap(Math.round(6*m+2));hea(1);S.souv=S.souv||[];if(!S.souv.some(x=>x[1]===n))S.souv.push([e,n,year(),q?q.first:'']);if(S.souv.length>40)S.souv.shift();withFx(q,'reis+',n);if(q)q.rel=clamp(q.rel+4);
    if(k>=2000&&!(S.flags.verre||0)){S.flags.verre=1;MS(`Reisde naar ${n}`,1)}return `${extra}${q?` Met ${q.first}. `:' '}Je neemt een souvenir mee uit ${n}.`};
  if(quick)return doAct(n,()=>fin(`${pick(['Een onvergetelijke reis.','Een heerlijke vakantie.','Je komt uitgerust terug.'])}`,null),true,e);
  const [x,ch]=pick(REISEV.filter((r,i)=>i!==5||ageY()>=16));modal({title:n,em:e,cat:p?`Met ${p.first}`:'Alleen op reis',person:p||undefined,text:x,choices:ch.map(([t,fn])=>({t,on:()=>{closeModal();doAct(n,()=>fin(fn()+' ',p),true,e)}}))})},{cat:'Reizen'})}
function sheetDest(el){for(const [w,ds] of DEST){const s=sec(el,w);for(const [e,n,k] of ds)row(s,{ic:e,t:n,s:`Vanaf ${fmt(cpX(k))}${(S.souv||[]).some(x=>x[1]===n)?' · al geweest':''}`,dis:S.money<cpX(k)||ageY()<16,dots:true,on:()=>trip(e,n,k)})}}
function sheetSouv(el){const sv=(S.souv||[]).slice().reverse();if(!sv.length){empty(el,'Nog geen souvenirs.');return}const s=sec(el,`${sv.length} ${sv.length===1?'bestemming':'bestemmingen'}`);for(const [e,n,y,w] of sv)row(s,{ic:e,t:n,s:`${y}${w?' · met '+w:''}`})}
sheetTravel=function(el){const s=sec(el,'');const a=ageY();
  row(s,{ic:'🌍',t:'Op reis',s:a<16?'Vanaf 16 jaar':'30 bestemmingen over de hele wereld',dis:a<16,on:()=>openSheet('Op reis',sheetDest,true)});
  row(s,{ic:'🌴',t:'Pakketreis',s:'Van Ardennen tot wereldreis',on:()=>openSheet('Vakantie',sheetVacation,true)});
  row(s,{ic:'⛷️',t:'Een dagje skiën',s:'Minigame · ontwijk de bomen',dis:a<6,dots:true,on:()=>withWho('Skiën','⛷️',p=>mgDodge({title:'Skiën',desc:'Suis de berg af en ontwijk bomen en andere skiërs.',em:'⛷️',me:'⛷️',obs:['🌲','⛄','🪨','🏂'],secs:12},(l,t)=>doAct('Skiën',()=>{if(ageY()>=16)cash(-cpX(70)*(p?2:1));const m=use('ski');hap(Math.round((2+l)*m));withFx(p,'uit+','de piste');if(l===0){hea(-ri(5,15));return 'Je slaat over de kop en ligt een dag op de bank met een gekneusde knie.'}return l===t?'Foutloos naar beneden. Je voelt je een prof.':'Een paar keer gevallen, maar wat een dag!'},true,'⛷️')),{cat:'Dagje uit'})});
  row(s,{ic:'🎢',t:'Pretpark',s:fmt(cpX(45)),dis:a<4,dots:true,on:pretpark});
  const n=(S.souv||[]).length;if(n)row(s,{ic:'🧳',t:'Je souvenirs',s:`${n} ${n===1?'bestemming':'bestemmingen'}`,on:()=>openSheet('Souvenirs',sheetSouv,true)})};

// ---------- 12.5 uitgaan: met wie en hoeveel je drinkt ----------
clubDoor=(f=>function(c){const go=()=>f.call(this,c);if(ageY()<16)return go();
  withWho(c.n,c.em,(p,quick)=>{if(quick)return go();if(p){p.rel=clamp(p.rel+ri(3,7));if(chance(.25)&&typeof memAdd==='function')memAdd(p,'uit+',c.n)}
    modal({title:c.n,em:'🍸',cat:p?`Met ${p.first}`:'Uitgaan',text:'Hoeveel drink je vanavond?',choices:[
      {t:'💧 Niks, ik rijd',on:()=>{closeModal();go()}},
      {t:'🍺 Een paar',on:()=>{closeModal();if(typeof addUp==='function')addUp('alcohol',1);hap(1);go()}},
      {t:'🍾 Flink',on:()=>{closeModal();if(typeof addUp==='function')addUp('alcohol',4);hap(2);hea(-2);if(chance(.35))L('🥴 De volgende ochtend: een kater van jewelste. Nooit meer, zweer je.','sys');go()}}]})},{cat:'Uitgaan',min:16})})(clubDoor);

// ---------- 12.6 cultuur ----------
const CULT=[['🖼️','Museum',20,'Wat doe je in het museum?',[['🎧 Een rondleiding volgen',()=>{sma(2);return 'De gids vertelt geweldige verhalen bij elk schilderij.'}],['🚶 Zelf rondlopen',()=>{sma(1);hap(1);return 'Je blijft een kwartier staan bij één schilderij. Je weet zelf niet waarom.'}],['☕ Vooral het museumcafé',()=>{hap(2);return 'De appeltaart is het echte kunstwerk.'}]]],
 ['🎭','Theater',35,'Het doek gaat op. Hoe ervaar je het?',[['😢 Je wordt geraakt',()=>{hap(3);return 'Je zit er nog een uur na de voorstelling stil van.'}],['😴 Je dommelt weg',()=>'Je wordt wakker van het applaus. Je klapt hard mee.'],['🌹 Je gooit een roos naar de acteurs',()=>{hap(2);return 'De hoofdrolspeler vangt hem en knipoogt.'}]]],
 ['🎵','Musical',70,'Het slotnummer begint. Wat doe je?',[['🎤 Meezingen',()=>{hap(4);return 'De mensen naast je zingen mee. Kippenvel.'}],['👏 Staande ovatie',()=>{hap(3);return 'De hele zaal staat. De cast buigt drie keer.'}],['📱 Stiekem filmen',()=>{if(chance(.4)){hap(-1);return 'Een suppoost tikt je op de schouder.'}hap(2);return 'Je hebt het hele slotnummer op film.'}]]],
 ['🎙️','Cabaret',30,'De cabaretier kijkt de zaal in en zoekt iemand.',[['🙋 Oogcontact maken',()=>{if(chance(.5)){hap(4);return 'Je wordt het onderwerp van de hele voorstelling. Iedereen lacht, jij het hardst.'}hap(-1);return 'Je wordt flink voor gek gezet. Gelukkig kent niemand je.'}],['🙈 Wegkijken',()=>{hap(3);return 'Je ontsnapt. Je buurman niet. Heerlijk.'}],['😂 Gewoon genieten',()=>{hap(3);return 'Je lacht tot je buikpijn hebt.'}]]]];
function sheetCulture(el){const s=sec(el,'');const a=ageY();for(const [e,n,k,q,ch] of CULT)row(s,{ic:e,t:n,s:`${fmt(cpX(k))}${a<10?' · vanaf 10 jaar':''}`,dis:a<10||(a>=16&&S.money<cpX(k)),dots:true,on:()=>withWho(n,e,(p,quick)=>{const pay=()=>{if(ageY()>=16)cash(-cpX(k)*(p?2:1))};
  if(quick)return doAct(n,()=>{pay();use('cult');hap(3);return 'Een mooie avond uit.'},true,e);scene(n,e,q,ch.map(([t,fn])=>[t,pp=>{pay();use('cult');const r=fn();withFx(pp,'uit+',n.toLowerCase()==='museum'?'het museum':'de '+n.toLowerCase());return r}]),p)},{cat:'Cultuur',min:8})})}

// ---------- 12.6 buiten ----------
function sheetOut(el){const s=sec(el,'');const a=ageY();const cp=S.cpi||1;
  row(s,{ic:'⛺',t:'Kamperen',s:`Een weekend in de natuur · ${fmt(cpX(80))}`,dis:a<6,dots:true,on:()=>withWho('Kamperen','⛺',(p,quick)=>{const pay=()=>{if(ageY()>=16)cash(-cpX(80))};const rain=chance(.35);
    if(quick)return doAct('Kamperen',()=>{pay();hap(rain?1:4);hea(1);withFx(p,'kamp+');return rain?'Het regent het hele weekend. Je tent lekt.':'Sterren, een kampvuur en marshmallows.'},true,'⛺');
    scene('Kamperen','⛺',rain?'Het begint te regenen en je tent lekt.':'Het is een prachtige avond.',rain?[['🛠️ De tent repareren',q=>{pay();hap(2);hea(1);withFx(q,'kamp+');return 'Met tape en een vuilniszak houd je het droog. Je voelt je een echte overlever.'}],['🏨 Toch een hotel nemen',q=>{pay();cash(-cpX(90));hap(2);withFx(q);return 'Een warme douche en een echt bed. Kamperen is ook maar een woord.'}]]:[['🔥 Kampvuur maken',q=>{pay();hap(4);hea(1);withFx(q,'kamp+');return 'Jullie roosteren marshmallows en vertellen spookverhalen.'}],['🌌 Sterren kijken',q=>{pay();hap(4);sma(1);withFx(q,'kamp+');return 'Je ziet drie vallende sterren. Je doet drie wensen.'}]],p)},{cat:'Buiten'})});
  row(s,{ic:'🥕',t:S.tuin?'Je volkstuin':'Een volkstuin huren',s:S.tuin?'Elk jaar groente en rust · tik om op te zeggen':`${fmt(cpX(150))} per jaar · groente, rust en buren`,dis:a<16,dots:true,on:()=>{S.tuin=S.tuin?0:1;toast(S.tuin?'Je hebt een volkstuin!':'Je zegt je volkstuin op');refreshSheet()}});
  row(s,{ic:'🥾',t:'Een wandeltocht',s:'Kies zelf hoe ver',dis:a<6,dots:true,on:()=>modal({title:'Wandeltocht',em:'🥾',cat:'Buiten',text:'Hoe ver loop je?',choices:opts([10,25,40].map(km=>({t:`${km} kilometer`,on:()=>{closeModal();doAct('Wandeltocht',()=>{use('wandel');const hard=km/(20+(S.fit??50)/2);hea(km>=25?2:1);hap(2);S.fit=clamp((S.fit??50)+Math.round(km/10));if(hard>1.2&&chance(.5)){hap(-2);return `Na ${Math.round(km*.7)} kilometer heb je blaren op blaren. Je haalt de finish strompelend.`}return km>=40?'Je loopt de hele 40 kilometer. Je krijgt een medaille en kunt morgen niet lopen.':`Een mooie tocht van ${km} kilometer.`},true,'🥾')}})))})});
  row(s,{ic:'🎣',t:'Vissen',s:'Rust aan de waterkant',dis:a<6,on:()=>doAct('Vissen',()=>{use('vis');hap(2);const r=R();return r<.4?'Niks gevangen. Wel een mooie zonsondergang.':r<.85?pick(['Een mooie snoek!','Drie baarsjes. Je zet ze terug.','Een karper van zeker tien kilo.']):'Je vangt een oude laars. En dan nog een.'},true,'🎣')})}
function tuinYear(){if(!S.tuin||inJail())return;cash(-cpX(150));hap(2);hea(1);if(chance(.35))L(`🥕 Je volkstuin levert ${pick(['emmers vol tomaten','meer courgettes dan je kunt opeten','prachtige dahlia\'s','aardappels voor een hele winter'])} op.`,'good')}

// ---------- 12.6 sport kijken ----------
function sheetWatch(el){const s=sec(el,'');const a=ageY();const cl=(loc('clubs')||['de stadsclub']);
  if(S.fav)card(el,`<span class="muted">Jouw club: <b>${he(S.fav)}</b></span>`);
  row(s,{ic:'🏟️',t:'Naar het stadion',s:`${S.fav||'Kies een club'} · ${fmt(cpX(45))}`,dis:a<6||(a>=16&&S.money<cpX(45)),dots:true,on:()=>{const go=()=>withWho('Stadion','🏟️',(p,quick)=>doAct('Stadion',()=>{if(ageY()>=16)cash(-cpX(45)*(p?2:1));use('stad');const r=R();withFx(p,'stad+',S.fav);if(r<.45){hap(5);return `${S.fav} wint! Het hele stadion zingt.${p?` Je valt ${p.first} in de armen.`:''}`}if(r<.7){hap(1);return `Gelijkspel. ${S.fav} had moeten winnen.`}hap(-2);return `${S.fav} verliest. De terugweg is stil.`},true,'🏟️'),{cat:'Sport kijken'});
    if(!S.fav)modal({title:'Jouw club',em:'⚽',cat:'Sport kijken',text:'Voor welke club ben je?',choices:opts(cl.map(c=>({t:c,on:()=>{closeModal();S.fav=c;go()}})))});else go()}});
  row(s,{ic:'🍻',t:'Kijken in de kroeg',s:'Met vrienden, bier en veel geschreeuw',dis:a<16,on:()=>doAct('Kroeg',()=>{cash(-cpX(20));use('kroeg');if(typeof addUp==='function')addUp('alcohol',1);hap(3);for(const f of living('vriend').filter(f=>!f.gone).slice(0,3))f.rel=clamp(f.rel+2);return pick(['De kroeg ontploft bij de winnende goal.','Je hebt de hele wedstrijd naar het scherm geschreeuwd. Je stem is weg.','Penalty\'s! Je kunt niet kijken.'])},true,'🍻')});
  if(S.fav)row(s,{ic:'🔁',t:'Andere club kiezen',dots:true,on:()=>{S.fav=null;refreshSheet()}})}

// ---------- 12.6 leren ----------
const TALEN=['Engels','Spaans','Frans','Duits','Italiaans','Portugees','Japans','Chinees','Arabisch','Turks'];
const CURS=[['🏺','Pottenbakken','kunst'],['💻','Programmeren','tech'],['🍝','Italiaans koken','koken'],['💃','Salsa','sport'],['📊','Boekhouden','zaken'],['🎭','Improvisatietheater','sociaal'],['🎹','Pianoles','muziek']];
const GELOOF={christendom:['⛪','Christendom','de kerk'],islam:['🕌','Islam','de moskee'],jodendom:['🕍','Jodendom','de synagoge'],hindoeisme:['🛕','Hindoeïsme','de tempel'],boeddhisme:['☸️','Boeddhisme','de tempel']};
function sheetLearn(el){const a=ageY(),cp=S.cpi||1;S.lang=S.lang||{};
  const t=sec(el,'Een taal leren');for(const l of TALEN){const v=S.lang[l]||0;row(t,{ic:v>=100?'🗣️':'📖',t:l,s:v>=100?'Vloeiend':v?`Niveau ${v}%${S.acts['taal'+l]?' · dit jaar al geoefend':''}`:`Les · ${fmt(cpX(200))}`,dis:v>=100||!!S.acts['taal'+l]||S.money<cpX(200)&&a>=18,on:()=>doAct(l,()=>{S.acts['taal'+l]=1;if(a>=18)cash(-cpX(200));const g=Math.round(ri(10,18)*(S.st.smarts>=70?1.3:1));S.lang[l]=Math.min(100,v+g);sma(1);if(S.lang[l]>=100){MS(`Spreekt vloeiend ${l}`,1);hap(4);return `Je spreekt vloeiend ${l}!`}return `Je ${l} gaat vooruit (${S.lang[l]}%).`},true,'📖')})}
  const c=sec(el,'Een cursus voor je plezier');for(const [e,n,k] of CURS)row(c,{ic:e,t:n,s:S.acts['cur'+n]?'Dit jaar al gedaan':`${fmt(cpX(150))} · ${SKN[k]||''}`,dis:a<12||!!S.acts['cur'+n]||(a>=18&&S.money<cpX(150)),on:()=>doAct(n,()=>{S.acts['cur'+n]=1;if(a>=18)cash(-cpX(150));sk(k,ri(4,8));hap(2);if(chance(.25)&&typeof addFriend==='function')addFriend();return pick([`Tien avonden ${n.toLowerCase()}. Je bent er beter in dan je dacht.`,`Je ${n.toLowerCase()}-cursus is gezellig. Je gaat volgend jaar weer.`])},true,e)});
  const g=sec(el,'Geloof');const F=S.faith||{};
  if(!F.g)row(g,{ic:'🙏',t:'Een geloof kiezen',s:'Of geen: dat is ook prima',dots:true,on:()=>modal({title:'Geloof',em:'🙏',cat:'Leren',text:'Welk geloof past bij jou?',choices:opts(Object.entries(GELOOF).map(([k,[e,n]])=>({t:`${e} ${n}`,on:()=>{closeModal();S.faith={g:k,w:0};L(`${e} Je voelt je thuis in ${n==='Islam'?'de islam':'het '+n.toLowerCase()}.`,'sys');refreshSheet()}})))})});
  else{const [e,n,pl]=GELOOF[F.g];row(g,{ic:e,t:F.w?`Elke week naar ${pl}`:`Naar ${pl} gaan`,s:F.w?'Tik om te stoppen':'Rust, gemeenschap en nieuwe mensen',dots:true,on:()=>{F.w=F.w?0:1;toast(F.w?`Je gaat elke week naar ${pl}`:`Je gaat niet meer elke week`);refreshSheet()}});
    row(g,{ic:'🔄',t:'Een ander geloof, of geen',dots:true,on:()=>{S.faith=null;refreshSheet()}})}}
function faithYear(){const F=S.faith;if(!F||!F.w||inJail())return;hap(2);kar(1);if(chance(.2)&&typeof addFriend==='function'){const f=addFriend();if(f)f.grp='geloof'}}

// ---------- 12.3 hobby's met een doel ----------
const HOBJOB={schilderen:'designer',fotografie:'fotograaf',tuinieren:'hovenier',koken:'kok',zingen:'muzikant',schrijven:'schrijver'};
sheetHobby=(f=>function(el,k){const r=f.apply(this,arguments);const l=hobLvl(k);const [ic,t]=HOBBY[k];const s=sec(el,'Verder met je hobby');const kk='exp'+k;
  row(s,{ic:'🖼️',t:['zingen','dansen'].includes(k)?'Optreden':'Je werk laten zien',s:l<60?'Vanaf 60% niveau':S.acts[kk]?'Dit jaar al gedaan':'Een expositie, optreden of demonstratie',dis:l<60||!!S.acts[kk],on:()=>doAct(t,()=>{S.acts[kk]=1;hap(5);S.fame=clamp((S.fame||0)+1);const g=cpX(Math.round(l*8));cash(g);return `${pick(['Een zaal vol mensen','Een lokale krant','Je familie en vrienden'])} ziet wat je kunt. Je verdient ${fmt(g)}.`},true,'🖼️')});
  const jid=HOBJOB[k];if(jid&&JOB(jid))row(s,{ic:'💼',t:'Er je beroep van maken',s:l<75?'Vanaf 75% niveau':S.job&&S.job.id===jid?'Dit is al je beroep':`Begin als ${JOB(jid).lad[0].toLowerCase()}`,dis:l<75||ageY()<18||(S.job&&S.job.id===jid),dots:true,on:()=>ask('Je beroep ervan maken?',`Je wordt ${JOB(jid).lad[0].toLowerCase()}.${S.job?' Je stopt met je huidige baan.':''}`,'Doen',()=>doAct('Nieuw beroep',()=>{if(S.job)endJob();setJob(jid,0);hap(6);MS(`Maakte van ${t.toLowerCase()} zijn beroep`.replace('zijn',S.p.g==='v'?'haar':'zijn'),1);return `Je maakt van je hobby je werk: je bent nu ${jobTitle().toLowerCase()}!`},true,'💼'),'go')});return r})(sheetHobby);

// ---------- nieuwe activiteiten in het menu ----------
ACTS.push(['cultuur','🎭','Cultuur','Museum, theater, musical, cabaret',8,OS('Cultuur',el=>sheetCulture(el)),1],
  ['buiten','🏕️','Buiten','Kamperen, volkstuin, wandelen, vissen',6,OS('Buiten',el=>sheetOut(el)),1],
  ['kijk','🏟️','Sport kijken','In het stadion of in de kroeg',6,OS('Sport kijken',el=>sheetWatch(el)),1],
  ['leren','📚','Leren','Een taal, een cursus, geloof',10,OS('Leren',el=>sheetLearn(el)),6]);
ACH.push(['wereldreiziger','Wereldreiziger','Bezoek 10 verschillende bestemmingen'],['polyglot','Polyglot','Spreek 3 talen vloeiend']);
F8.ach.push(add=>{if((S.souv||[]).length>=10)add('wereldreiziger');if(Object.values(S.lang||{}).filter(v=>v>=100).length>=3)add('polyglot')});
F8.year.push(()=>{if(!S.alive)return;tuinYear();faithYear()});

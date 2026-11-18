/* ================= FASE 21: minigames =================
   Keuzes Thijmen: rijexamen, sollicitatiegesprek, sportwedstrijd, examens per vak; minigames in het hoofdmenu aan en uit te zetten.
   21.1 instelling S.settings.mg (aan = standaard). Uit: elke vaardigheids-minigame geeft meteen een uitslag op basis van je vaardigheid.
   21.2 rijexamen: theorie (verkeersborden, voorrang) en praktijk (rijden + inparkeren); herkansen is goedkoper
   21.3 sollicitatiegesprek: vier vragen, reacties van de interviewer, slotvraag
   21.4 sportwedstrijd per sport (penalty's, timing, sprint, mikken) via het sportscherm
   21.5 examens per vak: meer vragen, moeilijkere op havo/vwo/hoger (QB21H) */

// ---------- 21.1 aan / uit ----------
const mgOn=()=>!(S&&S.settings&&S.settings.mg===0);
const mgSkill=k=>{const s=S.st||{},K=S.sk||{};const v=k==='brain'?(s.smarts||50)*.8+(K.sociaal||30)*.2:k==='talk'?(s.smarts||50)*.5+(K.sociaal||30)*.5:(K.sport||30)*.5+(s.smarts||50)*.2+(s.health||70)*.3;return clamp(Math.round(v))};
const mgP=k=>Math.max(0,Math.min(1,.2+mgSkill(k)/130+gauss()*.14));
const mgLater=f=>setTimeout(f,0);
// elke minigame krijgt een automatische uitslag als de minigames uit staan
const MGAUTO={
  mgDodge:(a,k)=>{const o=a[0]||{},cb=a[1],L_=o.lives||3;mgLater(()=>cb(Math.round(L_*mgP(k)),L_))},
  mgRhythm:(a,k)=>{const cb=a[1];mgLater(()=>cb(mgP(k)))},
  mgReact:(a,k)=>{const o=a[0]||{},cb=a[1],n=o.rounds||3;mgLater(()=>cb(Math.round(n*mgP(k)),n))},
  mgDial:(a,k)=>{const o=a[0]||{},cb=a[1],n=o.rounds||3;mgLater(()=>cb(Math.round(n*mgP(k)),n))},
  mgCode:(a,k)=>{const o=a[0]||{},cb=a[1],n=o.len||4;mgLater(()=>cb(Math.round(n*mgP('brain')),n))},
  mgAim:(a,k)=>{const o=a[0]||{},cb=a[1],n=o.n||3;mgLater(()=>cb(Math.round(n*10*mgP(k)),n*10))},
  mgTap:(a,k)=>{const cb=a[2];mgLater(()=>cb(mgP(k)))},
  mgMemory:(a,k)=>{const cb=a[3];const p=mgP('brain');mgLater(()=>cb(p>=.85,p))},
  mgTiming:(a,k)=>{const n=a[2]||3,cb=a[3];mgLater(()=>cb(Math.round(n*mgP(k))))},
  mgExam:(a)=>{const cb=a[0];mgLater(()=>cb(Math.round(6*mgP('brain'))/6))},
  mgInterview:(a)=>{const cb=a[1];mgLater(()=>cb(mgP('talk')))},
  mgQuiz:(a)=>{const qs=a[1]||[],cb=a[2];mgLater(()=>cb(qs.length?Math.round(qs.length*mgP('brain'))/qs.length:mgP('brain')))},
  mgWork:(a)=>{const cb=a[0];mgLater(()=>cb(mgP('talk')))},
  mgDebate:(a)=>{const cb=a[1];mgLater(()=>cb(mgP('talk')))},
  mgPenalty:(a,k)=>{const o=a[0]||{},cb=a[1],n=o.n||5;mgLater(()=>cb(Math.round(n*mgP(k)),n))}};
function mgW(n,f,k){return function(){if(mgOn())return f.apply(this,arguments);return MGAUTO[n](arguments,k)}}
function mgToggle(){S.settings.mg=mgOn()?0:1;toast(mgOn()?'Minigames staan aan':'Minigames staan uit: het spel bepaalt de uitslag op basis van je vaardigheid');refreshSheet();saveLife()}

// ---------- 21.2 rijexamen ----------
const TRAFQ=[['Wat betekent een rood, rond bord met een witte horizontale balk?',['Inrijden verboden','Doodlopende weg','Parkeerverbod','Einde voorrangsweg']],
  ['Een driehoekig bord met de punt naar beneden betekent:',['Voorrang verlenen','Voorrangsweg','Gevaarlijke bocht','Stoppen voor een school']],
  ['Je komt bij een gelijkwaardige kruising. Wie gaat voor?',['Verkeer van rechts','Verkeer van links','Wie het eerst komt','Het grootste voertuig']],
  ['Hoe hard mag je meestal binnen de bebouwde kom?',['50 km per uur','30 km per uur','70 km per uur','80 km per uur']],
  ['Een oranje ruitvormig bord betekent:',['Je rijdt op een voorrangsweg','Einde voorrangsweg','Werk in uitvoering','Rotonde']],
  ['Wanneer gebruik je je grote lichten (grootlicht)?',['Op een donkere weg zonder tegenliggers','Altijd in het donker','In de mist','In de stad']],
  ['Wat moet je doen bij een zebrapad waar iemand wil oversteken?',['Stoppen en laten oversteken','Toeteren en doorrijden','Harder rijden','Alleen afremmen als het kind is']],
  ['Hoeveel afstand houd je minstens tot je voorganger?',['Twee seconden','Eén autolengte','Een halve seconde','Tien meter, altijd']],
  ['Een blauw rond bord met een witte fiets betekent:',['Verplicht fietspad','Fietsen verboden','Fietsenstalling','Fietsstraat eindigt']],
  ['Je wilt van rijstrook wisselen. Wat doe je eerst?',['Spiegels, dode hoek, richting aangeven','Gas geven','Toeteren','Remmen']],
  ['Wat geldt bij een stoplicht dat op oranje springt?',['Stoppen als dat veilig kan','Altijd gas geven','Toeteren','Je mag altijd nog door']],
  ['Op een rotonde heeft verkeer op de rotonde meestal...',['Voorrang','Geen voorrang','Voorrang als het een vrachtwagen is','Voorrang op zondag']]];
function drivingExam(){const a=ageY(),F=S.flags,cp=S.cpi||1;if(S.lic||a<17)return;const first=!F.rijles;const k=Math.round((first?2600:F.theorie?300:40)*cp);
  if(S.money<k){toast(`Je hebt ${fmt(k)} nodig`);return}cash(-k);F.rijles=1;
  if(!F.theorie){mgQuiz('Theorie-examen',TRAFQ.slice().sort(()=>R()-.5).slice(0,5),sc=>{if(sc>=.8){F.theorie=1;doAct('Theorie-examen',()=>{hap(3);return `Geslaagd voor je theorie (${Math.round(sc*5)} van 5 goed)! Tik nog een keer op Rijbewijs voor je praktijkexamen.`},true,'📗')}else doAct('Theorie-examen',()=>{hap(-2);return `Gezakt voor je theorie: ${Math.round(sc*5)} van de 5 goed, je had er 4 nodig. Herkansen kost ${fmt(40*cp)}.`},true,'📕')});return}
  mgDodge({title:'Praktijkexamen',desc:'Rijd veilig door het verkeer. Je mag maximaal één fout maken.',em:'🚗',me:'🚗',obs:['🚙','🚲','🚸','🚧'],secs:14,speed:.9},(h)=>{
    setTimeout(()=>mgTiming('Inparkeren','Tik precies op het moment dat de auto recht in het vak staat.',3,hits=>doAct('Rijexamen',()=>{if(h>=2&&hits>=2){S.lic=true;hap(8);MS('Haalde het rijbewijs',1);return pick(['Geslaagd! De examinator schudt je de hand. Je hebt je rijbewijs.','Geslaagd! Zelfs het inparkeren ging in één keer.'])}
      hap(-3);return h<2?`Gezakt: te veel fouten in het verkeer. Herkansen kost ${fmt(300*cp)}.`:`Gezakt bij het inparkeren. De stoeprand was niet onder de indruk. Herkansen kost ${fmt(300*cp)}.`},true,'🚗')),350)})}

// ---------- 21.3 sollicitatiegesprek ----------
const INT21=[['Waarom wil je juist bij ons werken?',[['Ik heb me goed verdiept in jullie bedrijf en het past bij wat ik wil leren.',2],['Jullie betalen goed.',0],['Het leek me wel leuk.',1],['Mijn moeder zei dat ik moest solliciteren.',-1]]],
  ['Wat is je grootste zwakte?',[['Ik ben soms te kritisch op mezelf, maar ik leer om dat te begrenzen.',2],['Ik heb geen zwaktes.',-1],['Ik kom vaak te laat.',-1],['Ik ben ongeduldig, maar ik werk eraan.',1]]],
  ['Vertel eens over een moment dat iets misging.',[['Een project liep uit; ik nam het initiatief en we leverden het alsnog op.',2],['Het was niet mijn schuld.',-1],['Daar praat ik liever niet over.',0],['Ik vergat een deadline en heb daarvan geleerd.',1]]],
  ['Waar zie je jezelf over vijf jaar?',[['Gegroeid in deze rol, met meer verantwoordelijkheid.',2],['Op uw stoel.',1],['Op een tropisch eiland.',0],['Geen idee.',0]]],
  ['Hoe ga je om met stress?',[['Ik maak een planning en pak de belangrijkste dingen eerst aan.',2],['Ik raak snel in paniek.',-1],['Ik ga sporten om mijn hoofd leeg te maken.',1],['Stress? Wat is dat?',0]]],
  ['Werk je liever alleen of in een team?',[['Allebei: ik kan zelfstandig werken, maar haal energie uit een goed team.',2],['Alleen, mensen zijn vervelend.',-1],['In een team.',1],['Dat maakt me niet uit.',1]]]];
const INTEND=[['Heb jij nog vragen voor ons?',[['Hoe ziet een gewone werkdag eruit in dit team?',2],['Hoeveel vakantiedagen krijg ik?',0],['Nee hoor.',0],['Wanneer hoor ik of ik het geworden ben?',1]]]];
mgInterview=function(t,cb,sec){const pool=(SECQ[sec]||[]).slice(0,2).concat(INTERVIEW,INT21).sort(()=>R()-.5);const qs=pool.slice(0,3).concat(INTEND);let i=0,pts=0;const who=pick(['Mevrouw De Vries','Meneer Bakker','Mevrouw Jansen','Meneer El Amrani','Mevrouw Smit']);
  const step=()=>{if(i>=qs.length){closeModal();cb(clamp(pts/(qs.length*2)*100)/100);return}const [q,ans]=qs[i];
    modal({title:q,em:'🤝',cat:`${t?t+' · ':''}vraag ${i+1} van ${qs.length}`,text:i===0?`${who} kijkt je vriendelijk aan.`:'',choices:ans.slice().sort(()=>R()-.5).map(([a,p])=>({t:a,on:()=>{pts+=Math.max(0,p);if(p<0)pts=Math.max(0,pts-1);i++;toast(p>=2?`${who} knikt enthousiast`:p===1?`${who} schrijft iets op`:`${who} fronst even`);step()}}))})};step()};

// ---------- 21.4 sportwedstrijd ----------
function mgPenalty(o,cb){const n=o.n||5;let i=0,goals=0;const hist=[];const sk=o.sk??mgSkill('body');
  const step=()=>{if(i>=n){closeModal();cb(goals,n);return}
    modal({title:o.title||"Penalty's",em:o.em||'⚽',cat:`Schot ${i+1} van ${n} · ${goals} raak`,text:'Waar schiet je hem?',choices:[['↖️ Linksboven','L'],['⬇️ Door het midden','M'],['↗️ Rechtsboven','R'],['↙️ Linksonder','L'],['↘️ Rechtsonder','R']].map(([t,d])=>({t,on:()=>{
      const last=hist.slice(-2);const guess=last.length===2&&last[0]===last[1]&&chance(.6)?last[0]:pick(['L','M','R','L','R']);hist.push(d);i++;
      const hi=/boven/.test(t);const miss=chance(hi?.18-sk/800:.06);let txt;if(miss){txt='Over! Net naast.'}else if(guess===d&&chance(hi?.35:.7)){txt='Gestopt! De keeper zat in de goede hoek.'}else{goals++;txt=pick(['GOAL!','Raak!','In de kruising!','Keeper kansloos!'])}toast(txt);setTimeout(step,250)}}))})};step()}
const SPORTMG={voetbal:'pen',hockey:'pen',ijshockey:'pen',americanfootball:'pen',rugby:'pen',tennis:'time',badminton:'time',volleybal:'time',honkbal:'time',cricket:'time',atletiek:'tap',zwemmen:'tap',schaatsen:'tap',wielrennen:'tap',golf:'aim',basketbal:'aim'};
function sportMatch(){const P=S.sport;if(!P||P.st==='gestopt')return;const D=SPORTS[P.id];const kind=SPORTMG[P.id]||'time';
  const done=sc=>doAct('Wedstrijd',()=>{S.acts.wed21=1;const d=Math.round((sc-.45)*8);P.sk=clamp((P.sk||40)+d);hap(Math.round(sc*5));if(P.st==='pro'&&sc>=.8)S.fame=clamp((S.fame||0)+1);
    return sc>=.8?pick([`Wat een wedstrijd! Je bent de beste van het veld.`,`Je wint, en het publiek scandeert je naam.`]):sc>=.5?pick(['Een degelijke wedstrijd. Je trainer is tevreden.','Gewonnen, al was het spannend tot het eind.']):pick(['Niet je dag. Je trainer zegt dat je morgen extra moet trainen.','Verloren. In de kleedkamer is het stil.'])},true,D.em);
  if(kind==='pen')mgPenalty({title:`${D.n}: strafschoppen`,em:D.em},(g,n)=>done(g/n));
  else if(kind==='time')mgTiming(`${D.n}: de wedstrijd`,'Sla precies op het juiste moment.',5,h=>done(h/5));
  else if(kind==='tap')mgTap(`${D.n}: de finale`,'Tik zo snel als je kunt!',sc=>done(sc));
  else mgAim({title:`${D.n}: de beslissende worp`,desc:'Mik zo goed mogelijk.',em:D.em,n:3},(p,m)=>done(p/m))}
sheetSport=(f=>function(el){const r=f.apply(this,arguments);const P=S.sport;if(!P||P.st==='gestopt'||inJail())return r;
  row(sec(el,'Wedstrijd'),{ic:'🎮',t:'Een wedstrijd spelen',s:S.acts.wed21?'Dit jaar al gespeeld':mgOn()?'Minigame · je vorm gaat omhoog als je goed speelt':'Je speelt automatisch (minigames staan uit)',dis:!!S.acts.wed21,dots:true,on:sportMatch});return r})(sheetSport);

// ---------- 21.5 examens per vak: meer vragen en moeilijkere op havo/vwo/hoger ----------
const QB21={Taal:[['Wat is het meervoud van "kind"?',['kinderen','kinds','kinden','kindjes']],['Welk woord is een werkwoord?',['lopen','tafel','groen','snel']],['Wat is het tegenovergestelde van "oud"?',['jong','klein','nieuw-oud','zwak']],['Hoe schrijf je het goed?',['Hij wordt','Hij wort','Hij werdt','Hij wordd']],['Welk woord rijmt op "huis"?',['muis','hond','boom','fiets']]],
  'Wereldoriëntatie':[['Hoeveel continenten zijn er?',['Zeven','Vijf','Negen','Drie']],['Welk dier is een zoogdier?',['Walvis','Haai','Pinguïn','Krokodil']],['Wat heeft een plant nodig om te groeien?',['Licht, water en lucht','Alleen suiker','Alleen zand','Niets']],['Hoe heet de dichtstbijzijnde ster?',['De zon','De maan','Mars','De Poolster']],['Wat meet een thermometer?',['Temperatuur','Gewicht','Lengte','Tijd']]],
  Nederlands:[['Wat is een synoniem van "blij"?',['vrolijk','boos','moe','traag']],['Welke zin is goed?',['Ik heb het boek gelezen.','Ik heb het boek geleest.','Ik heb het boek gelees.','Ik heb het boek leesde.']],['Wat is een metafoor?',['Een vergelijking zonder "als"','Een rijmwoord','Een spreekwoord','Een vraag zonder antwoord']],['Wat is de stam van "werken"?',['werk','werke','werkt','gewerkt']],['Welk woord is een bijvoeglijk naamwoord?',['mooi','rennen','stoel','gisteren']]],
  Engels:[['What is the past tense of "go"?',['went','goed','gone','goes']],['Which is correct?',['She doesn\'t like coffee.','She don\'t like coffee.','She not like coffee.','She doesn\'t likes coffee.']],['What does "however" mean?',['echter','daarom','omdat','tenzij']],['Choose the plural of "mouse":',['mice','mouses','mices','mouse']],['"I have lived here ___ 2010."',['since','for','from','during']]],
  Biologie:[['Waar vindt de fotosynthese plaats?',['In de bladgroenkorrels','In de wortels','In de bloem','In de stengel']],['Hoeveel chromosomen heeft een menselijke cel?',['46','23','48','12']],['Welk orgaan pompt bloed?',['Het hart','De lever','De longen','De nieren']],['Wat is DNA?',['Erfelijk materiaal','Een eiwit uit spieren','Een soort suiker','Een vitamine']],['Welk bloedvat voert bloed van het hart weg?',['Slagader','Ader','Haarvat','Lymfevat']]],
  Geschiedenis:[['Wanneer begon de Eerste Wereldoorlog?',['1914','1939','1870','1918']],['Wie was de eerste mens op de maan?',['Neil Armstrong','Joeri Gagarin','Buzz Aldrin','John Glenn']],['Welke muur viel in 1989?',['De Berlijnse Muur','De Chinese Muur','De Muur van Hadrianus','De Klaagmuur']],['Wat was de Renaissance?',['Een periode van herleving van kunst en wetenschap','Een oorlog in de middeleeuwen','Een Romeinse keizer','Een religie']],['In welk jaar eindigde de Tweede Wereldoorlog?',['1945','1944','1950','1940']]],
  Natuurkunde:[['Wat is de eenheid van energie?',['joule','newton','volt','ampère']],['Wat valt sneller in vacuüm: een veer of een hamer?',['Even snel','De hamer','De veer','Hangt af van de kleur']],['Wat is de formule voor snelheid?',['afstand gedeeld door tijd','tijd gedeeld door afstand','massa keer versnelling','kracht keer afstand']],['Bij welke temperatuur kookt water op zeeniveau?',['100 °C','90 °C','120 °C','80 °C']],['Wat geleidt stroom het best?',['Koper','Hout','Plastic','Glas']]],
  Scheikunde:[['Wat is het symbool van goud?',['Au','Go','Ag','Gd']],['Wat is een zuur?',['Een stof met een pH onder 7','Een stof met een pH boven 7','Altijd een gas','Een metaal']],['Wat is de formule van keukenzout?',['NaCl','KCl','NaOH','HCl']],['Hoeveel elektronen kunnen er in de eerste schil?',['2','8','18','4']],['Wat ontstaat er bij roesten van ijzer?',['IJzeroxide','Koolstof','Waterstof','Zout']]],
  Economie:[['Wat is een monopolie?',['Eén aanbieder op een markt','Veel kleine aanbieders','Een soort belasting','Een bordspel, verder niets']],['Wat gebeurt er met de rente als de centrale bank inflatie wil remmen?',['De rente gaat omhoog','De rente gaat omlaag','Niets','De rente verdwijnt']],['Wat is het bruto binnenlands product?',['De waarde van alles wat een land in een jaar produceert','Het geld op de bank','De staatsschuld','De export']],['Wat zijn vaste kosten?',['Kosten die niet veranderen met de productie','Kosten per product','Belasting','Winst']],['Wat betekent "vraag en aanbod"?',['De prijs ontstaat waar kopers en verkopers elkaar vinden','De overheid bepaalt alle prijzen','Alles kost evenveel','Alleen aanbod telt']]],
  Frans:[['Wat betekent "bonjour"?',['goedendag','tot ziens','dank je','alsjeblieft']],['Hoe vervoeg je "être" bij "nous"?',['nous sommes','nous êtes','nous sont','nous suis']],['Wat is "de kat" in het Frans?',['le chat','le chien','la chatte noire','le chapeau']],['Wat betekent "merci beaucoup"?',['heel erg bedankt','tot morgen','goed gedaan','veel plezier']],['Welk lidwoord hoort bij "maison"?',['la','le','les','un']]],
  Kunst:[['Wie schilderde de Mona Lisa?',['Leonardo da Vinci','Michelangelo','Van Gogh','Picasso']],['Welke kunststroming hoort bij Picasso?',['Kubisme','Impressionisme','Barok','Romantiek']],['Wat zijn de drie primaire kleuren?',['Rood, geel en blauw','Rood, groen en paars','Zwart, wit en grijs','Oranje, groen en paars']],['Wie schreef de opera "Die Zauberflöte"?',['Mozart','Beethoven','Bach','Verdi']],['Wat is een fresco?',['Een schildering op natte kalk','Een beeld van marmer','Een soort foto','Een glas-in-loodraam']]]};
const QB21H={Nederlands:[['Wat is een retorische vraag?',['Een vraag waarop geen antwoord wordt verwacht','Een vraag met twee antwoorden','Een vraag in de verleden tijd','Een open vraag']],['Wat is de functie van een signaalwoord als "dus"?',['Het geeft een conclusie aan','Het geeft een tegenstelling aan','Het geeft een opsomming aan','Het geeft een tijd aan']]],
  Engels:[['Choose the correct conditional: "If I ___ rich, I would travel."',['were','am','will be','had']],['What is a synonym of "reluctant"?',['unwilling','eager','happy','quick']]],
  Biologie:[['Wat is homeostase?',['Het in evenwicht houden van het interne milieu','Celdeling','Voortplanting','Fotosynthese']],['Welk organel maakt ATP?',['Mitochondrium','Ribosoom','Celkern','Vacuole']]],
  Natuurkunde:[['Wat zegt de wet van Ohm?',['U = I · R','F = m · a','E = m · c²','P = U / I']],['Wat is de eenheid van frequentie?',['hertz','tesla','watt','coulomb']]],
  Scheikunde:[['Wat is een katalysator?',['Een stof die een reactie versnelt zonder zelf te verbruiken','Een stof die altijd ontploft','Een zuur','Een edelgas']],['Wat is het molgetal (Avogadro) ongeveer?',['6,0 · 10²³','3,0 · 10⁸','9,8','1,6 · 10⁻¹⁹']]],
  Economie:[['Wat is elasticiteit van de vraag?',['Hoe sterk de vraag reageert op een prijsverandering','Hoe snel een product slijt','De groei van de economie','De rente op leningen']],['Wat is een begrotingstekort?',['De overheid geeft meer uit dan ze ontvangt','De export is groter dan de import','Bedrijven maken verlies','Er is te weinig geld gedrukt']]],
  Geschiedenis:[['Wat was de Koude Oorlog?',['Een spanning tussen de VS en de Sovjet-Unie zonder directe oorlog','Een oorlog in Siberië','Een oorlog in de ijstijd','Een handelsconflict met Canada']],['Wat was de Verlichting?',['Een stroming die rede en wetenschap centraal zette','De uitvinding van de gloeilamp','Een religieuze oorlog','Een Romeinse wet']]],
  Frans:[['Welke tijd is "j\'avais"?',['imparfait','passé composé','futur','présent']],['Wat betekent "néanmoins"?',['toch, niettemin','daarom','omdat','misschien']]]};
for(const k of Object.keys(QB21))QB[k]=(QB[k]||[]).concat(QB21[k]);
quizPool=(f=>function(sub){const base=f.apply(this,arguments);const E=S&&S.edu;const hard=E&&((E.stage==='middel'&&['havo','vwo'].includes(E.lvl))||!!E.cur);return hard&&QB21H[sub]?base.concat(QB21H[sub]):base})(quizPool);

// alle vaardigheids-minigames omwikkelen (aan/uit-knop)
mgDodge=mgW('mgDodge',mgDodge,'body');mgRhythm=mgW('mgRhythm',mgRhythm,'body');mgReact=mgW('mgReact',mgReact,'body');mgDial=mgW('mgDial',mgDial,'body');mgCode=mgW('mgCode',mgCode,'brain');mgAim=mgW('mgAim',mgAim,'body');
mgTap=mgW('mgTap',mgTap,'body');mgMemory=mgW('mgMemory',mgMemory,'brain');mgTiming=mgW('mgTiming',mgTiming,'body');mgExam=mgW('mgExam',mgExam,'brain');mgInterview=mgW('mgInterview',mgInterview,'talk');
mgQuiz=mgW('mgQuiz',mgQuiz,'brain');mgWork=mgW('mgWork',mgWork,'talk');mgDebate=mgW('mgDebate',mgDebate,'talk');mgPenalty=mgW('mgPenalty',mgPenalty,'body');

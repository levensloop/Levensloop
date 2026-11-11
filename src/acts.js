/* ================= ACTIVITEITEN: in groepen, met 5 eigen favorieten ================= */
const ACTG=['Gezondheid en lichaam','Uitgaan en vrije tijd','Liefde en familie','Gokken en geluk','Misdaad','Geld en status','Overig'];
// [sleutel, icoon, naam, uitleg (tekst of functie), vanaf leeftijd, actie, groep, extra voorwaarde ()=>[ok, uitleg]]
const OS=(t,f)=>()=>openSheet(t,f,true);
const ACTS=[
 ['mind','🧘','Geest & lichaam','Sporten, lezen, mediteren, een instrument',0,OS('Geest & lichaam',el=>sheetMind(el)),0],
 ['sport','🏆','Sport',()=>S.sport&&S.sport.st!=='gestopt'?`${SPORTS[S.sport.id].em} ${SPORTS[S.sport.id].n} · ${stageLabel()}`:'Begin met een sport',5,OS('Sport',el=>sheetSport(el)),0],
 ['vecht','🥋','Vechtsportschool',()=>fightSub(),6,OS('Vechtsport',el=>sheetFight(el)),0],
 ['dokter','👨‍⚕️','Dokter',()=>S.ill.length?`Je klachten: ${S.ill.map(i=>i.n).join(', ')}`:'Huisarts, specialisten, check-up',0,OS('Dokter',el=>sheetDoctor(el)),0],
 ['ther','🛋️','Therapie','Psycholoog, relatietherapie, mindfulness',8,OS('Therapie',el=>sheetTherapy(el)),0],
 ['afkick','🌱','Afkicken',()=>Object.keys(ADD).some(k=>addLvl(k)>=50)?'Je bent ergens aan verslaafd':'Verslavingen aanpakken',12,OS('Afkicken',el=>sheetRehab(el)),0],
 ['spa','💆','Salon & spa','Kapper, spa, nagels',12,OS('Salon & spa',el=>sheetSpa(el)),0],
 ['chir','✂️','Cosmetische chirurgie','Laat iets aan jezelf doen',18,OS('Cosmetische chirurgie',el=>sheetSurgery(el)),0],
 ['nacht','🍸','Nachtleven','Clubs, bars en kroegen',16,()=>nightlife(),1],
 ['fest','🎪','Festivals','Pinkpop, Lowlands, Tomorrowland',16,OS('Festivals',el=>sheetFestivals(el)),1],
 ['conc','🎤','Concerten','Van jazzclub tot stadion',10,OS('Concerten',el=>sheetConcerts(el)),1],
 ['resto','🍽️','Uit eten','Van snackbar tot sterrenrestaurant',6,OS('Uit eten',el=>sheetRestaurants(el)),1],
 ['quiz','🍻','Pubquiz','Test je kennis met vrienden',16,()=>pubquiz(),1],
 ['hobby','🎨','Hobby\'s','Word beter in iets wat je leuk vindt',6,OS('Hobby\'s',el=>sheetHobbies(el)),1],
 ['reis','🌍','Reizen en uitjes','Vakantie, skiën, pretpark',4,OS('Reizen en uitjes',el=>sheetTravel(el)),1],
 ['bios','🎭','Bioscoop','Ga naar de film',4,OS('Bioscoop',el=>sheetMovies(el)),1],
 ['zoo','🦓','Dierentuin','Een dagje uit',0,()=>zoo(),1],
 ['kart','🏎️','Racebaan','Karten · minigame',8,()=>karting(),1],
 ['liefde','❤️','Liefde','Daten, vrienden maken, speeddaten',6,OS('Liefde',el=>sheetLove(el)),2],
 ['dier','🐕','Huisdieren','Neem een huisdier',8,OS('Huisdieren',el=>sheetPets(el)),2],
 ['adopt','🧸','Adoptie','Adopteer een kind',21,()=>adoptPopup(),2],
 ['vrucht','🧬','Vruchtbaarheid','Vruchtbaarheidskliniek',18,()=>fertility(),2,()=>[ageY()<=50,'Tot 50 jaar']],
 ['vrij','🤲','Vrijwilligerswerk','Help anderen',12,()=>volunteer(),2],
 ['will','📝','Testament','Regel je nalatenschap',18,()=>will(),2],
 ['casino','🎰','Casino','Blackjack, roulette, poker, dobbelen, gokkast',18,OS('Casino',el=>sheetCasino(el)),3],
 ['bet','⚽','Sportweddenschappen','Wed op voetbalwedstrijden',18,()=>sportsBet(),3],
 ['paard','🏇','Paardenrennen','Ga naar de renbaan',18,()=>horses(),3],
 ['gevbet','🥊','Gevechten wedden','Wed op een kooigevecht',18,()=>fightBet(),3],
 ['lot','💰','Loterij','Speel mee met de loterij',18,()=>lottery(),3],
 ['kras','🎟️','Kraslot','Kras drie vakjes',18,()=>scratch(),3],
 ['win','🎁','Winactie','Doe mee aan een winactie',18,()=>sweep(),3],
 ['bid','🙏','Bidden','Tot de makers van dit spel',0,()=>pray(),3],
 ['crime','👺','Misdrijven','Van winkeldiefstal tot smokkel',10,OS('Misdaad',el=>sheetCrime(el)),4],
 ['org','🕶️','Onderwereld',()=>S.crim.org?(S.crim.org.type==='bende'?S.crim.org.name:`${S.crim.org.name} · ${MRANK[S.crim.org.rank]}`):'Een eigen bende of de maffia',16,OS('Onderwereld',el=>sheetOrg(el)),4],
 ['heist','🗺️','Overval plannen','Doelwit, crew en uitrusting',18,OS('Overval plannen',el=>sheetHeist(el,(S.crim.plan||{}).t||'juwelier')),4],
 ['wit','🧼','Witwassen',()=>S.crim.dirty>0?`${fmt(S.crim.dirty)} zwart geld`:'Je hebt geen zwart geld',16,OS('Witwassen',el=>sheetLaunder(el)),4],
 ['shop','🛍️','Winkelen','Huizen, auto\'s, jachten, horloges en meer',12,OS('Bezit',el=>sheetAssets(el)),5],
 ['fin','💸','Financiën','Beleggen, lenen, startups',18,OS('Financiën',el=>sheetFinance(el)),5],
 ['roem','⭐','Roem',()=>S.fame>0?`${Math.round(S.fame)}% roem · ${Math.round(S.foll).toLocaleString('nl-NL')} volgers`:'Word eerst bekend',0,OS('Roem',el=>sheetFame(el)),5,()=>[S.fame>0,'Word eerst bekend']],
 ['social','👥','Social media','Beheer je online identiteit',13,OS('Social media',el=>sheetSocial(el)),5],
 ['recht','⚖️','Rechtszaak','Klaag iemand aan',18,()=>lawsuit(),5],
 ['emig','🌍','Emigreren','Verhuis naar een ander land',18,OS('Emigreren',el=>sheetEmigrate(el)),6],
 ['id','👤','Identiteit','Bepaal wie je bent',18,OS('Identiteit',el=>sheetIdentity(el)),6],
 ['rijb','🚗','Rijbewijzen','Auto, motor en boot · minigame',16,OS('Rijbewijzen',el=>sheetLic(el)),6],
 ['tijd','🌪️','Tijdmachine','Reis terug in de tijd',0,OS('Tijdmachine',el=>sheetRewind(el)),6]];
const FAVDEF=['mind','sport','vecht','liefde','nacht'];
const favs=()=>{const f=S.settings.favs;return Array.isArray(f)?f.filter(k=>ACTS.some(x=>x[0]===k)):FAVDEF};
const BANDX=['nacht','fest','conc','reis','emig','quiz','casino'];
const GAMBLE=['casino','bet','paard','gevbet','lot','kras'];
function actRow(s,x){const [k,ic,t,sub,min,on,g,ex]=x;const a=ageY();const e=typeof bandOn==='function'&&bandOn()&&BANDX.includes(k)?[false,'Niet met een enkelband']:GAMBLE.includes(k)&&a>=min&&S.money<=0?[false,S.money<0?'Je staat rood':'Je hebt geen geld']:ex?ex():[true];const ok=a>=min&&e[0];const st=typeof sub==='function'?safe(()=>sub())||'':sub;
  row(s,{ic,t,s:a<min?`Vanaf ${min} jaar`:!e[0]?e[1]:st,dis:!ok,on})}
function sheetAct(el){if(inJail())return jailActs(el);
  const f=sec(el,'⭐ Favorieten');for(const k of favs()){const x=ACTS.find(y=>y[0]===k);if(x)actRow(f,x)}
  row(f,{ic:'✏️',t:'Favorieten aanpassen',s:'Kies je eigen 5',on:()=>openSheet('Favorieten',sheetFavs,true)});
  if(typeof postRows==='function')postRows(el);
  ACTG.forEach((g,i)=>{const s=sec(el,g);for(const x of ACTS.filter(x=>x[6]===i))actRow(s,x)});
  foot(el,'🏳️','Opgeven...',()=>ask('Opgeven?','Je leven eindigt hier. Je kunt daarna nog terugspoelen of verder als je kind.','Opgeven',()=>{closeSheet();die('opgegeven');afterQ()},'bad','🏳️'))}
function sheetFavs(el){const cur=favs();card(el,`<span class="muted">Kies maximaal 5 activiteiten die bovenaan staan. Tik nog een keer om er een weg te halen.</span>`);
  ACTG.forEach((g,i)=>{const s=sec(el,g);for(const [k,ic,t] of ACTS.filter(x=>x[6]===i)){const on=cur.includes(k);row(s,{ic,t,r:on?'⭐':'☆',s:on?`Favoriet ${cur.indexOf(k)+1} van 5`:'',on:()=>{let f=favs().slice();if(f.includes(k))f=f.filter(x=>x!==k);else{if(f.length>=5){toast('Je hebt al 5 favorieten. Haal er eerst een weg.');return}f.push(k)}S.settings.favs=f;saveLife();refreshSheet()}})}})}

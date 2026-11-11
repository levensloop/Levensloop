/* ================= EVENTS ================= */
const EV={};
function E(id,o){o.id=id;EV[id]=o}
const kid=()=>ageY()<18;
function grade(){const s=S.st.smarts+ri(-25,25);if(s>60){sma(2);hap(4);S.edu.perf=clamp(S.edu.perf+5);return `Je krijgt een ${ri(8,10)}! De klas klapt.`}hap(-3);return `Een ${ri(4,6)}. Je stond te hakkelen.`}
const bizCtx=f=>()=>{const b=S.biz.filter(f||(()=>1));return b.length?{bid:pick(b).id}:null};
const B=c=>S.biz.find(b=>b.id===c.bid);

/* --- jeugd --- */
E('woordje',{a:[1,2],once:1,w:3,t:'Je eerste woordje',x:'Iedereen staat om je heen. Je zegt je allereerste woordje...',ch:[
 ['"Mama"',()=>{relAdj('moeder',8);hap(3);return 'Je moeder smelt helemaal.'}],
 ['"Papa"',()=>{relAdj('vader',8);hap(3);return 'Je vader filmt het en stuurt het naar de hele familie.'}],
 ['"Pizza"',()=>{hap(5);return 'Niemand weet waar je het vandaan hebt, maar het is een hit.'}]]});
E('bijten',{a:[2,5],t:'Op de opvang',x:'Een kind op de opvang bijt je in je arm.',ch:[
 ['Terugbijten',()=>{kar(-3);hap(3);return 'Jullie worden allebei apart gezet.'}],
 ['Huilen',()=>{hap(-2);return 'De leidster troost je met een koekje.'}],
 ['Naar de leidster',()=>{kar(2);return 'Het andere kind moet sorry zeggen.'}]]});
E('waterpokken',{a:[2,10],once:1,t:'Waterpokken',x:'Je zit onder de rode, jeukende vlekjes.',ch:[
 ['Niet krabben',()=>{hea(-2);return 'Zwaar, maar het geneest netjes.'}],
 ['Lekker krabben',()=>{hea(-4);loo(-2);return 'Je houdt er een paar littekentjes aan over.'}]]});
E('verdwaald',{a:[3,7],once:1,t:'Kwijt in de supermarkt',x:'Je bent je ouders kwijt in de supermarkt.',ch:[
 ['Hard huilen',()=>{hap(-2);return 'Een vriendelijke mevrouw brengt je terug.'}],
 ['Naar de kassa lopen',()=>{sma(2);return 'Ze roepen je ouders om. Slim gedaan.'}],
 ['Snoep eten',()=>{hap(4);kar(-1);return 'Je wordt gevonden bij de snoepschappen, met chocola op je gezicht.'}]]});
E('tand',{a:[5,8],once:1,t:'De tandenfee',f:()=>{cash(2);hap(2);return 'Je eerste tand is eruit. De tandenfee legt geld onder je kussen.'}});
E('huisdiervragen',{a:[5,12],once:1,c:()=>!living('huisdier').length&&S.home.k==='ouders',t:'Een huisdier?',x:'Je wilt dolgraag een huisdier. Wat vraag je aan je ouders?',ch:[
 ['Een hond',()=>parentPet('hond')],['Een kat',()=>parentPet('kat')],['Een konijn',()=>parentPet('konijn')],['Laat maar',()=>'Misschien later.']]});
E('spreekbeurt',{a:[8,12],t:'Spreekbeurt',x:'Je moet een spreekbeurt houden. Waarover?',ch:[['Dinosaurussen',grade],['De ruimte',grade],['Je favoriete game',grade]]});
E('sportclub',{a:[6,13],once:1,t:'Sportclub',x:'Je ouders willen dat je gaat sporten. Welke club kies je?',ch:[
 ['Voetbal',()=>{if(!S.sport)joinSport('voetbal');sk('sport',9);hap(3);S.flags.club='voetbal';return 'Je gaat op voetbal en blijkt een fanatieke spits.'}],
 ['Hockey',()=>{if(!S.sport)joinSport('hockey');sk('sport',8);sk('sociaal',3);hap(3);return 'Je hockeyteam wordt je tweede familie.'}],
 ['Turnen',()=>{if(!S.sport)joinSport('atletiek');sk('sport',7);loo(2);return 'Je kunt binnen een jaar een flikflak.'}],
 ['Geen zin',()=>{hap(1);return 'Je blijft lekker thuis gamen.'}]]});
E('muziekles',{a:[7,14],once:1,t:'Muziekles',x:'Mag je op muziekles? Welk instrument?',ch:[
 ['Piano',()=>{sk('muziek',10);sma(1);return 'Je oefent elke dag na school.'}],
 ['Gitaar',()=>{sk('muziek',10);loo(1);return 'Je eerste nummer is Wonderwall, natuurlijk.'}],
 ['Drums',()=>{sk('muziek',9);relAdj('vader',-3);return 'De buren zijn minder enthousiast.'}],
 ['Nee, dank je',()=>'Muziek is niks voor jou.']]});
E('rekenwedstrijd',{a:[8,12],t:'Rekenwedstrijd',x:'Je school doet mee aan een landelijke rekenwedstrijd.',ch:[
 ['Meedoen',()=>{if(chance(S.st.smarts/140)){hap(8);sma(3);MS('Won een landelijke rekenwedstrijd',2);return 'Je wint de eerste prijs!'}hap(-1);return 'Je eindigt in de middenmoot.'}],
 ['Liever niet',()=>'Je kijkt vanaf de zijlijn toe.']]});
/* --- tieners --- */
E('puistjes',{a:[13,16],once:1,t:'Puistjes',x:'Je gezicht zit ineens vol puistjes.',ch:[
 ['Naar de huisarts',()=>{loo(2);return 'Met een crème wordt het snel beter.'}],
 ['Uitknijpen',()=>{loo(-3);return 'Dat maakt het alleen maar erger.'}],
 ['Accepteren',()=>{hap(1);return 'Het hoort erbij.'}]]});
E('schoolreis',{a:[12,17],once:1,c:()=>S.edu.stage==='middel',t:'Schoolreis naar Parijs',x:'Je gaat met school een week naar Parijs.',ch:[
 ['Volop genieten',()=>{hap(7);addFriend();return 'Je komt terug met een nieuwe vriend.'}],
 ['\'s Nachts wegsluipen',()=>{if(chance(.4)){S.edu.perf=clamp(S.edu.perf-5);hap(-3);return 'Betrapt door de mentor. Je moet een dag eerder naar huis.'}hap(9);return 'De Eiffeltoren om 3 uur \'s nachts. Onvergetelijk.'}]]});
E('scout',{a:[14,21],c:()=>false&&S.sk.sport>=58&&(!S.job||S.job.id!=='voetbal')&&!S.flags.jeugd,t:'Een scout',x:'Een scout van een profclub heeft je zien spelen en nodigt je uit voor een proeftraining.',ch:[
 ['Proeftraining doen',()=>{if(chance(.25+(S.sk.sport-58)/60)){if(ageY()<16){S.flags.jeugd=1;hap(10);MS('Kreeg een jeugdcontract bij een profclub',2);return 'Je krijgt een jeugdcontract! Op je 16e word je prof.'}setJob('voetbal',0);hap(12);return 'Je krijgt een profcontract!'}hap(-6);return 'Net niet goed genoeg.'}],
 ['Nee, school gaat voor',()=>{S.edu.perf=clamp(S.edu.perf+3);return 'Je kiest voor zekerheid.'}]]});
E('modellen',{a:[15,28],once:1,c:()=>S.st.looks>=82&&!S.job,t:'Modellenbureau',x:'Een scout van een modellenbureau spreekt je aan op straat.',ch:[
 ['Tekenen',()=>{setJob('model',0);hap(8);return 'Je eerste shoot is al volgende week.'}],
 ['Nee, dank je',()=>'Je loopt door.']]});
E('talentenjacht',{a:[12,45],cd:6,c:()=>S.sk.muziek>45||S.sk.kunst>55,t:'Talentenjacht',x:'Je kunt auditie doen voor een talentenjacht op tv.',ch:[
 ['Auditie doen',()=>{const s=(S.sk.muziek+S.st.looks)/2+ri(-20,20);if(s>68){S.fame=clamp(S.fame+15);S.foll+=ri(10,80)*1000;hap(12);MS('Haalde de finale van een talentenjacht op tv',3);return 'Je haalt de finale! Het hele land kent je nu.'}hap(-6);return 'De jury is genadeloos.'}],
 ['Durf niet',()=>'Volgend jaar misschien.']]});
/* --- volwassen --- */
E('vereniging',{a:[18,21],once:1,c:()=>S.edu.cur&&['hbo','wo'].includes(S.edu.cur.ty),t:'Studentenvereniging',x:'Je kunt lid worden van een studentenvereniging.',ch:[
 ['Lid worden',()=>{hap(6);sk('sociaal',8);S.edu.cur.perf=clamp(S.edu.cur.perf-6);cash(-400);addFriend();return 'Je overleeft de ontgroening en hebt meteen een vriendengroep.'}],
 ['Liever niet',()=>{S.edu.cur.perf=clamp(S.edu.cur.perf+3);return 'Meer tijd voor je studie.'}]]});
E('huisgenoot',{a:[18,32],c:()=>S.home.k==='huur',t:'Huisgenoot',x:'Je huisgenoot laat al een week de afwas staan.',ch:[
 ['Aanspreken',()=>{if(chance(.6)){hap(2);return 'Hij schrikt en ruimt alles op.'}hap(-3);return 'Hij wordt boos. Sfeer in huis is ver te zoeken.'}],
 ['Briefje op de koelkast',()=>{hap(-1);return 'Hij schrijft er een gemeen briefje onder.'}],
 ['Zelf afwassen',()=>{kar(1);hap(-2);return 'Je bent de afwasheld van het huis.'}]]});
E('reorganisatie',{a:[20,66],w:()=>econ()==='recessie'?2.2:econ()==='groei'?.2:.5,c:()=>S.job&&!S.job.part&&!JOB(S.job.id).fame,t:'Reorganisatie',x:'Je werkgever gaat reorganiseren. Er vallen ontslagen.',f:()=>{if(chance(.35-S.job.perf/400)){const sev=Math.round(salary()*.25);endJob();cash(sev);hap(-10);MS('Werd wegbezuinigd bij een reorganisatie',0);return `Je baan vervalt. Je krijgt ${fmt(sev)} transitievergoeding.`}hap(-2);return 'Je mag blijven. Opgelucht.'}});
E('headhunter',{a:[22,62],c:()=>S.job&&S.job.perf>60&&!S.job.part&&S.job.co,t:'Een headhunter belt',ctx:()=>({co:company()}),x:c=>`Een headhunter biedt je dezelfde functie aan bij ${c.co}, voor 20% meer salaris.`,ch:[
 ['Overstappen',c=>{S.job.mult*=1.2;S.job.co=c.co;S.job.perf=55;hap(4);return `Je werkt nu bij ${c.co}.`}],
 ['Blijven',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+3)));return 'Je blijft loyaal.'}],
 ['Gebruiken voor opslag',()=>{if(chance(.5)){S.job.mult*=1.1;return 'Je baas geeft je 10% opslag om je te houden.'}(S.job&&(S.job.perf=clamp(S.job.perf-8)));return 'Je baas voelt zich gechanteerd.'}]]});
E('burnout',{a:[22,65],c:()=>S.job&&S.st.happy<35&&!S.job.part,t:'Op je tandvlees',x:'Je slaapt slecht en ziet tegen werk op. De bedrijfsarts denkt aan een burn-out.',ch:[
 ['Ziekmelden en herstellen',()=>{hap(8);hea(4);(S.job&&(S.job.perf=clamp(S.job.perf-10)));return 'Na een paar maanden rust ben je weer de oude.'}],
 ['Doorwerken',()=>{hea(-8);hap(-6);return 'Het gaat steeds slechter met je.'}],
 ['Ontslag nemen',()=>{endJob();hap(10);return 'Je neemt ontslag. Er valt een last van je schouders.'}]]});
E('bekeuring',{a:[18,90],c:()=>S.cars.length&&S.lic,t:'Geflitst',f:()=>{const b=ri(1,4)*100;cash(-b);hap(-2);return `Je bent geflitst op de snelweg. Boete: ${fmt(b)}.`}});
E('ongeluk',{a:[18,90],w:.35,c:()=>S.cars.length,t:'Auto-ongeluk',f:()=>{const c=S.cars[0];c.value=Math.round(c.value*.7);const h=ri(3,20);hea(-h);return h>12?`Je krijgt een aanrijding met je ${c.name} en ligt een week in het ziekenhuis.`:`Een kop-staartbotsing. Whiplash en schade aan je ${c.name}.`}});
E('lekkage',{a:[20,95],c:()=>S.props.length,t:'Lekkage',x:'Het dak van je huis lekt.',ch:[
 ['Vakman inschakelen',()=>{const k=ri(15,60)*100;cash(-k);return `De reparatie kost ${fmt(k)}.`}],
 ['Zelf repareren',()=>{if(chance(.4+S.sk.tech/200)){hap(3);sk('tech',3);return 'Gelukt! Je bent best handig.'}const k=ri(30,100)*100;cash(-k);hea(-3);return `Mislukt. Het wordt erger en kost uiteindelijk ${fmt(k)}.`}]]});
E('belasting',{a:[19,90],c:()=>S.job,t:'Blauwe envelop',f:()=>{if(chance(.6)){const k=ri(2,20)*50;cash(k);hap(2);return `De Belastingdienst stort ${fmt(k)} terug!`}const k=ri(2,30)*50;cash(-k);hap(-2);return `Je moet ${fmt(k)} belasting bijbetalen.`}});
E('buren',{a:[18,90],c:()=>S.home.k!=='ouders',t:'De buren',x:'Je buren geven elke vrijdag een feest tot 3 uur \'s nachts.',ch:[
 ['Aanbellen',()=>{if(chance(.5)){hap(2);return 'Ze bieden excuses aan en zetten de muziek zachter.'}hap(-3);return 'Ze doen de deur niet open.'}],
 ['Klacht bij de gemeente',()=>{kar(-1);hap(1);return 'Er komt een handhaver langs. De buren groeten je niet meer.'}],
 ['Gewoon meefeesten',()=>{hap(5);hea(-2);addFriend();return 'Nieuwe vrienden gemaakt!'}]]});
E('lenen',{a:[18,80],c:()=>S.money>2000,ctx:()=>{const f=pickLiving(['vriend','broer','zus']);return f&&{id:f.id,a:Math.min(5000,Math.round(S.money*.2))}},t:'Geld lenen',x:c=>`${P(c.id).first} vraagt of je ${fmt(c.a)} wilt lenen.`,ch:[
 ['Lenen',c=>{const p=P(c.id);cash(-c.a);p.rel=clamp(p.rel+12);kar(2);S.flags.loanTo={id:p.id,a:c.a};return `${p.first} belooft het snel terug te betalen.`}],
 ['Weigeren',c=>{P(c.id).rel=clamp(P(c.id).rel-10);return 'Het wordt even ongemakkelijk.'}]]});
E('terugbetaald',{a:[18,90],c:()=>S.flags.loanTo,cd:1,t:'Een geleend bedrag',f:()=>{const l=S.flags.loanTo;S.flags.loanTo=null;const p=P(l.id);if(p&&p.alive&&chance(.6)){cash(l.a);p.rel=clamp(p.rel+5);return `${p.first} betaalt de ${fmt(l.a)} netjes terug.`}if(p)p.rel=clamp(p.rel-15);hap(-4);return `${p?p.first:'Je vriend'} betaalt het geld nooit terug.`}});
E('bruiloft',{a:[22,60],ctx:()=>{const f=pickLiving(['vriend','broer','zus']);return f&&pAge(f)>=20?{id:f.id}:null},t:'Een bruiloft',x:c=>`${P(c.id).first} gaat trouwen en nodigt je uit.`,ch:[
 ['Gaan',c=>{cash(-150);hap(5);P(c.id).rel=clamp(P(c.id).rel+8);if(!partner()&&ageY()>=18&&chance(.25)){addPartner();return 'Je danst de hele avond met iemand die je daar ontmoet. Het klikt!'}return 'Je danst tot de laatste plaat.'}],
 ['Afzeggen',c=>{P(c.id).rel=clamp(P(c.id).rel-10);return 'Dat neemt die je kwalijk.'}]]});
E('kinderwens',{a:[24,44],c:()=>partner()&&partner().st==='getrouwd'&&!living('kind').length&&!S.preg&&!S.flags.nokids,t:'Kinderwens',x:()=>`${partner().first} wil graag een kindje.`,ch:[
 ['Ja, laten we het proberen',()=>tryBaby()],
 ['Nog niet',()=>{partner().rel=clamp(partner().rel-5);return 'Jullie wachten nog even.'}],
 ['Ik wil geen kinderen',()=>{partner().rel=clamp(partner().rel-15);S.flags.nokids=1;hap(-3);return 'Dat valt zwaar.'}]]});
E('vreemdgaan',{a:[18,80],w:.4,c:()=>partner()&&partner().rel<45,t:'Verdacht',x:()=>`Je ontdekt berichten op de telefoon van ${partner().first}. Er is iemand anders.`,ch:[
 ['Vergeven',()=>{hap(-6);partner().rel=clamp(partner().rel+5);return 'Jullie gaan in relatietherapie.'}],
 ['Uit elkaar',()=>{breakUp();return 'Je zet er een punt achter.'}]]});
E('verrassing',{a:[18,90],c:()=>partner()&&partner().rel>65,t:'Verrassing',f:()=>{hap(8);partner().rel=clamp(partner().rel+3);return `${partner().first} verrast je met een weekendje weg. Heerlijk.`}});
E('griep',{a:[0,100],w:1.4,t:'Griep',x:'Je hebt hoge koorts en ligt een week op bed.',ch:[
 ['Uitzieken',()=>{hea(-3);return 'Na een week ben je er weer.'}],
 ['Naar de huisarts',()=>{hea(-1);if(!kid())cash(-30);return 'Rust, veel drinken en paracetamol. Je knapt snel op.'}]]});
E('gevallen',{a:[5,75],w:.6,t:'Gevallen',x:'Je valt van je fiets en je pols doet erg pijn.',ch:[
 ['Naar de Spoedeisende Hulp',()=>{hea(-3);return 'Gebroken. Zes weken gips.'}],
 ['Afwachten',()=>{if(chance(.5)){hea(-1);return 'Valt mee, het is een kneuzing.'}hea(-8);return 'Hij blijkt gebroken en groeit scheef aan elkaar.'}]]});
E('midlife',{a:[40,55],once:1,t:'Midlifecrisis',x:'Je voelt je ineens oud. Tijd voor iets wilds?',ch:[
 ['Sportauto kopen',()=>{S.cars.push({id:uid(),name:'Porsche 911',buy:165000,value:150000,cond:100});cash(-165000);hap(12);return 'Je rijdt nu in een Porsche 911.'},()=>S.money>=165000],
 ['Wereldreis maken',()=>{cash(-20000);hap(15);endJob();return 'Zes maanden backpacken. Je baan zeg je op.'},()=>S.money>=20000],
 ['Tattoo laten zetten',()=>{cash(-350);hap(5);return 'Een adelaar op je onderarm.'}],
 ['Gewoon doorgaan',()=>{hap(-2);return 'Het gaat vanzelf weer over.'}]]});
E('kleinkind',{a:[38,105],w:.9,ctx:()=>{const k=living('kind').filter(p=>pAge(p)>=24&&pAge(p)<=42);return k.length?{id:pick(k).id}:null},t:'Er komt een kleinkind',x:c=>`${P(c.id).first} krijgt een baby!`,f:c=>{const k=P(c.id);const g=pick(['m','v']);const b=mkPerson('kleinkind',g,S.m,{ap:apMix(apOf(k),null,g),last:k.last,par:k.id,rel:85});S.rel.push(b);hap(10);MS(`Werd ${S.p.g==='v'?'oma':'opa'} van ${b.first}`,2);return `Je ${relWord(b)} heet ${b.first}.`}});
E('reunie',{a:[28,65],cd:10,t:'Reünie',x:'Je middelbare school organiseert een reünie.',ch:[
 ['Gaan',()=>{hap(4);if(chance(.35))addFriend();return 'Leuk om iedereen terug te zien. Sommigen zijn erg veranderd.'}],
 ['Overslaan',()=>'Je kijkt de foto\'s later online.']]});
E('oplichter',{a:[16,100],w:.7,t:'Telefoontje van "de bank"',x:'Iemand belt namens je bank. Je moet je pincode geven om je rekening te beveiligen.',ch:[
 ['Pincode geven',()=>{const l=Math.round(Math.max(0,S.money)*.5);cash(-l);hap(-10);return `Oplichting! Je bent ${fmt(l)} kwijt.`}],
 ['Ophangen',()=>{sma(1);return 'Goed gedaan. Een bank vraagt nooit om je pincode.'}]]});
E('dierziek',{a:[0,100],ctx:()=>{const p=pickLiving('huisdier');return p&&{id:p.id}},t:'Ziek huisdier',x:c=>`Je ${P(c.id).sp} ${P(c.id).first} eet niet meer en ligt de hele dag in de mand.`,ch:[
 ['Naar de dierenarts',c=>{cash(-ri(2,8)*100);if(chance(.85)){P(c.id).rel=clamp(P(c.id).rel+5);return `${P(c.id).first} knapt weer op.`}P(c.id).alive=false;hap(-8);return `Helaas, ${P(c.id).first} is niet meer te redden.`}],
 ['Afwachten',c=>{if(chance(.5))return 'Het gaat vanzelf beter.';P(c.id).alive=false;hap(-10);kar(-3);return `${P(c.id).first} is overleden.`}]]});
E('kindschool',{a:[25,70],ctx:()=>{const k=living('kind').filter(p=>pAge(p)>=8&&pAge(p)<=17);return k.length?{id:pick(k).id}:null},t:'Gesprek op school',x:c=>`De mentor belt: ${P(c.id).first} spijbelt al weken.`,ch:[
 ['Streng toespreken',c=>{P(c.id).rel=clamp(P(c.id).rel-6);return `${P(c.id).first} gaat weer naar school, maar praat een week niet tegen je.`}],
 ['Rustig het gesprek aangaan',c=>{P(c.id).rel=clamp(P(c.id).rel+6);return `Het blijkt dat ${P(c.id).first} gepest wordt. Jullie lossen het samen op.`}],
 ['Laat maar',c=>{P(c.id).smarts=clamp(P(c.id).smarts-5);return 'Het komt vanzelf goed. Toch?'}]]});
E('kindgeld',{a:[40,100],c:()=>S.money>20000,ctx:()=>{const k=living('kind').filter(p=>pAge(p)>=20);return k.length?{id:pick(k).id,a:Math.round(Math.min(50000,S.money*.15))}:null},t:'Een vraag van je kind',x:c=>`${P(c.id).first} vraagt ${fmt(c.a)} voor de aanbetaling van een eigen huis.`,ch:[
 ['Geven',c=>{cash(-c.a);P(c.id).rel=clamp(P(c.id).rel+15);kar(2);return 'Je kind is je ontzettend dankbaar.'}],
 ['Weigeren',c=>{P(c.id).rel=clamp(P(c.id).rel-10);return 'Teleurgesteld vertrekt je kind.'}]]});
E('mantelzorg',{a:[30,80],ctx:()=>{const p=living(['moeder','vader']).filter(p=>pAge(p)>=76);return p.length?{id:pick(p).id}:null},cd:8,t:'Zorg voor je ouder',x:c=>`Je ${relWord(P(c.id))} ${P(c.id).first} kan niet meer goed alleen wonen.`,ch:[
 ['Mantelzorger worden',c=>{hap(-4);kar(5);P(c.id).rel=clamp(P(c.id).rel+15);if(S.job)S.job.perf=clamp(S.job.perf-5);return 'Je zorgt elke week voor je ouder. Zwaar, maar waardevol.'}],
 ['Verpleeghuis regelen',c=>{P(c.id).rel=clamp(P(c.id).rel-5);return 'Er is gelukkig een plekje vrij.'}],
 ['Bij je in huis nemen',c=>{hap(-6);kar(6);P(c.id).rel=clamp(P(c.id).rel+25);return 'Je ouder trekt bij je in.'},()=>S.home.k!=='ouders']]});
E('lastminute',{a:[18,85],c:()=>S.money>1500,t:'Last-minute aanbieding',x:'Een week Griekenland voor de helft van de prijs. Vertrek overmorgen.',ch:[
 ['Boeken',()=>{cash(-650);hap(8);hea(1);return 'Zon, gyros en blauwe zee.'}],['Nee',()=>'Je blijft thuis.']]});
E('vrijwilliger',{a:[14,90],t:'Vrijwilligers gezocht',x:'De voedselbank in je buurt zoekt vrijwilligers.',ch:[
 ['Aanmelden',()=>{kar(5);hap(3);sk('sociaal',2);return 'Elke zaterdag help je pakketten inpakken.'}],['Geen tijd',()=>{kar(-1);return 'Misschien later.'}]]});
E('portemonnee',{a:[8,90],t:'Gevonden portemonnee',ctx:()=>({a:ri(4,40)*10}),x:c=>`Je vindt een portemonnee met ${fmt(c.a)} erin.`,ch:[
 ['Inleveren bij de politie',c=>{kar(6);if(chance(.3)){cash(Math.round(c.a/2));return 'De eigenaar geeft je een vindersloon!'}return 'Je voelt je goed.'}],
 ['Geld houden',c=>{cash(c.a);kar(-6);return 'Niemand zag het.'}]]});
E('daklozen',{a:[12,95],t:'Op straat',x:'Iemand vraagt je om wat geld voor een warme maaltijd.',ch:[
 ['Geld geven',()=>{cash(-10);kar(3);return 'Je krijgt een dankbare glimlach.'}],
 ['Eten kopen',()=>{cash(-8);kar(4);hap(1);return 'Jullie eten samen een broodje.'}],
 ['Doorlopen',()=>{kar(-2);return 'Je loopt snel door.'}]]});
/* --- bedrijf --- */
E('investeerder',{a:[18,90],ctx:bizCtx(b=>BIZ[b.type].inv&&b.eq>20),t:'Investeerder',x:c=>{const b=B(c);const pct=ri(10,30);c.pct=pct;c.amt=Math.round(Math.max(50000,b.value)*pct/100*(.8+R()*.6));return `Een investeerder wil ${pct}% van ${b.name} kopen voor ${fmt(c.amt)}.`},ch:[
 ['Accepteren',c=>{const b=B(c);b.cash+=c.amt;b.eq=Math.round(b.eq*(1-c.pct/100)*10)/10;b.demand*=1.15;MS(`Haalde ${fmt(c.amt)} investering op voor ${b.name}`,2);return `Deal! ${b.name} heeft nu ${fmt(b.cash)} in kas. Jij bezit nog ${b.eq}%.`}],
 ['Hoger bod vragen',c=>{const b=B(c);if(chance(.45)){const amt=Math.round(c.amt*1.3);b.cash+=amt;b.eq=Math.round(b.eq*(1-c.pct/100)*10)/10;return `Ze gaan akkoord met ${fmt(amt)}!`}return 'De investeerder haakt af.'}],
 ['Weigeren',()=>'Je houdt alle zeggenschap.']]});
E('grotklant',{a:[18,90],ctx:bizCtx(),t:'Grote klant',x:c=>`Een grote klant wil zaken doen met ${B(c).name}.`,f:c=>{const b=B(c);b.demand*=1.3;b.rep=clamp(b.rep+5);hap(4);return `De vraag naar ${b.name} stijgt flink.`}});
E('rechtszaakbiz',{a:[18,90],w:.6,ctx:bizCtx(),t:'Aangeklaagd',x:c=>`Een ontevreden klant klaagt ${B(c).name} aan.`,ch:[
 ['Schikken',c=>{const k=Math.round(5000+B(c).rev*.03);B(c).cash-=k;return `Je schikt voor ${fmt(k)}.`}],
 ['Procederen',c=>{const b=B(c);if(chance(.55)){b.rep=clamp(b.rep+3);return 'Je wint de zaak!'}const k=Math.round(15000+b.rev*.08);b.cash-=k;b.rep=clamp(b.rep-8);return `Je verliest en moet ${fmt(k)} betalen.`}]]});
E('concurrent',{a:[18,90],ctx:bizCtx(),t:'Concurrentie',x:c=>`Er opent een concurrent vlak bij ${B(c).name}.`,ch:[
 ['Prijzen verlagen',c=>{B(c).demand*=1.05;B(c).rep=clamp(B(c).rep-2);return 'Klanten blijven, maar je marges krimpen.'}],
 ['Investeren in kwaliteit',c=>{B(c).cash-=8000;B(c).rep=clamp(B(c).rep+8);return 'Je onderscheidt je met kwaliteit.'}],
 ['Niks doen',c=>{B(c).demand*=.85;return 'Je verliest klanten.'}]]});
E('steelt',{a:[18,90],ctx:bizCtx(b=>b.staff>0),t:'Diefstal',x:c=>`Een medewerker van ${B(c).name} blijkt geld weg te sluizen.`,ch:[
 ['Ontslaan',c=>{B(c).staff--;return 'Op staande voet ontslagen.'}],
 ['Aangifte doen',c=>{B(c).staff--;B(c).cash+=2000;return 'Je krijgt een deel van het geld terug.'}],
 ['Tweede kans geven',c=>{kar(4);if(chance(.5))return 'De medewerker is je eeuwig dankbaar en werkt harder dan ooit.';B(c).cash-=5000;return 'Het gebeurt opnieuw.'}]]});
/* --- chaos --- */
E('oom',{chaos:1,a:[12,100],once:1,w:.6,t:'Een verre erfenis',ctx:()=>({l:pick(['Canada','Argentinië','Nieuw-Zeeland','Zwitserland','Friesland','Zeeland']),w:pick(['achteroom','oudtante','verre neef','oudoom']),a:Math.round((chance(.02)?ri(100,400)*1000:ri(2,25)*1000)*(S.cpi||1))}),x:c=>`Een notaris belt. Je ${c.w} uit ${c.l}, die je nauwelijks kende, is overleden en heeft je iets nagelaten.`,f:c=>{hap(c.a>50000?10:4);if(c.a>50000)MS(`Erfde ${fmt(c.a)} van een verre ${c.w}`,2);if(ageY()<18){S.trust=(S.trust||0)+c.a;return `Je erft ${fmt(c.a)}. Het geld staat vast tot je 18 bent.`}cash(c.a);return c.a>50000?`Je erft ${fmt(c.a)}! Daar had niemand op gerekend.`:`Je erft ${fmt(c.a)}. Een mooi extraatje.`}});
E('viraal',{chaos:1,a:[12,90],cd:20,t:'Viraal!',x:'Een filmpje waarin je over een duif struikelt gaat de hele wereld over.',ch:[
 ['Er munt uit slaan',()=>{S.foll+=ri(5,60)*1000;S.fame=clamp(S.fame+6);hap(6);MS('Ging viraal met een duivenfilmpje',2);return 'Je verkoopt merchandise met duiven erop.'}],
 ['Je kapot schamen',()=>{hap(-6);S.foll+=ri(1,8)*1000;return 'Je gaat een maand niet de deur uit.'}]]});
E('eendjes',{chaos:1,a:[16,90],once:1,t:'Verkeerd pakket',x:'De bezorger levert 400 rubberen eendjes bij je af. Niemand weet van wie ze zijn.',ch:[
 ['Houden',()=>{hap(5);return 'Je badkamer is nu een eendjesmuseum.'}],
 ['Online verkopen',()=>{cash(1200);sk('zaken',3);return 'Je verkoopt ze per stuk. Wat een handel.'}],
 ['Terugsturen',()=>{kar(2);return 'Als bedankje stuurt de webshop... nog 50 eendjes.'}]]});
E('raket',{chaos:1,a:[10,90],once:1,t:'De buurman',x:'Je buurman bouwt in zijn achtertuin een raket en vraagt of je wilt helpen.',ch:[
 ['Helpen',()=>{sk('tech',8);if(chance(.15)){S.fame=clamp(S.fame+20);MS('Hielp de buurman een raket lanceren',2);return 'De raket stijgt echt op! Jullie halen het journaal.'}if(chance(.35)){hea(-8);return 'Ontploffing. Je wenkbrauwen zijn weg.'}return 'Hij komt niet verder dan drie meter. Wel gezellig.'}],
 ['De politie bellen',()=>{kar(-1);return 'De buurman krijgt een boete. Hij zwaait niet meer.'}]]});
E('tijdreiziger',{chaos:1,a:[16,90],once:1,t:'Een vreemde bezoeker',x:'Een man in een zilveren pak staat voor de deur. Hij zegt dat hij je achterkleinkind is, uit 2147.',ch:[
 ['Binnenlaten',()=>{if(chance(.5)){sma(5);return 'Hij geeft je één tip: "Investeer in zonnepanelen." Dan is hij weg.'}cash(-200);return 'Hij eet je koelkast leeg en verdwijnt.'}],
 ['Deur dichtdoen',()=>'Je hoort nooit meer iets van hem.']]});
E('ikea',{chaos:1,a:[16,90],once:1,t:'Verdwaald',f:()=>{hap(-3);hea(-1);cash(-35);return 'Je raakt de weg kwijt in de IKEA. Na negen uur vind je de uitgang, met 14 pakken theelichtjes.'}});
E('quiz',{chaos:1,a:[16,85],cd:8,t:'Tv-quiz',x:'Je wordt gevraagd als kandidaat voor een quiz op tv.',ch:[
 ['Meedoen',()=>{if(chance(S.st.smarts/140)){const w=ri(5,50)*1000;cash(w);S.fame=clamp(S.fame+8);MS(`Won ${fmt(w)} in een tv-quiz`,2);return `Je wint ${fmt(w)}!`}hap(-4);return 'Je gaat bij de eerste vraag al onderuit.'}],
 ['Nee, spannend',()=>'Je kijkt vanaf de bank.']]});
E('schatkaart',{chaos:1,a:[8,80],once:1,t:'Schatkaart',x:'Op zolder vind je een oude kaart met een kruisje bij het bos verderop.',ch:[
 ['Gaan graven',()=>{const r=R();if(r<.15){const w=ri(20,300)*1000;cash(w);hap(12);MS(`Vond een kist met oude munten, ${fmt(w)} waard`,3);return `Je vindt een kist met oude munten, ${fmt(w)} waard!`}if(r<.5){hea(-2);return 'Je vindt alleen een roestig blikje.'}return 'Een boswachter jaagt je weg.'}],
 ['Weggooien',()=>'Waarschijnlijk niks.']]});
E('duif',{chaos:1,a:[6,90],t:'Geluk?',x:'Een duif poept op je hoofd. Ze zeggen dat dat geluk brengt.',ch:[
 ['Een lot kopen',()=>{cash(-3);if(chance(.08)){const w=ri(1,25)*1000;cash(w);hap(8);return `Het werkt! Je wint ${fmt(w)}.`}return 'Niks gewonnen. Wel nog poep in je haar.'},()=>ageY()>=18],
 ['Haren wassen',()=>'Je wast drie keer.']]});
E('reality',{chaos:1,a:[18,45],once:1,t:'Realityshow',x:'Je wordt gevraagd voor een datingprogramma op een tropisch eiland.',ch:[
 ['Meedoen',()=>{S.fame=clamp(S.fame+12);S.foll+=ri(20,150)*1000;MS('Deed mee aan een realityshow',2);if(!partner()&&chance(.4)){addPartner();return 'Je vindt er de liefde!'}hap(4);return 'Je bent een week het gesprek van de dag.'}],
 ['Nee',()=>'Je privacy is je lief.']]});
E('bijen',{chaos:1,a:[14,90],once:1,t:'Bijen',x:'Een zwerm bijen heeft zich op je balkon gevestigd.',ch:[
 ['Imker worden',()=>{hap(5);cash(ri(3,12)*100);sk('zaken',2);return 'Je verkoopt potjes honing aan de buren.'}],
 ['Bestrijder bellen',()=>{cash(-150);return 'Weg zijn ze.'}]]});
E('krant',{chaos:1,a:[30,95],once:1,t:'Overleden?',x:'In de krant staat je eigen overlijdensbericht. Een verwisseling.',ch:[
 ['Rectificatie eisen',()=>{cash(500);return 'De krant betaalt een schadevergoeding.'}],
 ['Naar je eigen afscheid gaan',()=>{hap(8);S.fame=clamp(S.fame+5);return 'Je hoort allemaal mooie dingen over jezelf.'}]]});
E('burgemeester',{chaos:1,a:[8,95],once:1,ctx:()=>{const p=living('huisdier').find(x=>['kat','hond'].includes(x.sp));return p&&{id:p.id}},t:'Ereburgemeester',f:c=>{S.fame=clamp(S.fame+6);S.foll+=ri(2,15)*1000;hap(8);MS(`Had een ${P(c.id).sp} die ereburgemeester werd`,2);return `Je ${P(c.id).sp} ${P(c.id).first} wordt bij een grap verkozen tot ereburgemeester van het dorp.`}});
E('meteoriet',{chaos:1,a:[16,95],once:1,w:.3,t:'Uit de lucht',x:'Er slaat een klein meteorietje in je tuin.',ch:[
 ['Verkopen aan een museum',()=>{const w=ri(2,8)*1000;cash(w);return `Een museum betaalt ${fmt(w)}.`}],
 ['Houden als verzamelstuk',()=>{hap(3);S.items.push({id:uid(),em:'☄️',name:'Meteoriet',variant:'Uit je eigen tuin',buy:0,value:ri(3,9)*1000,cond:100,ap:.05,vol:.08});return 'De meteoriet staat nu bij je bezittingen en wordt waarschijnlijk elk jaar iets meer waard.'}]]});
E('s_zkh',{sys:1,t:'Ziekenhuis',x:c=>c.n>=2?'Je bent opnieuw met spoed opgenomen. De artsen zeggen dat je lichaam dit niet nog vaak volhoudt.':'Je bent onwel geworden en met spoed opgenomen. Na een paar weken mag je naar huis, maar de artsen zijn duidelijk: zo kan het niet verder.',ch:[
 ['🏋️ Beloven dat je gaat sporten',()=>({go:()=>{afterModal=()=>openSheet('Geest & lichaam',sheetMind);processQ()}})],
 ['👨‍⚕️ Naar de dokter voor een check',()=>({go:()=>{afterModal=()=>openSheet('Dokter',sheetDoctor);processQ()}})],
 ['Oké',()=>'']]});
E('s_gezond',{sys:1,t:'Je voelt je slecht',x:c=>c.l<=20?`Je gezondheid is nog maar ${Math.round(S.st.health)}%. Je bent vaak moe en ziek. Als dit zo doorgaat, beland je in het ziekenhuis.`:`Je gezondheid is gezakt naar ${Math.round(S.st.health)}%. Ga sporten, eet gezonder of ga naar de dokter.`,ch:[
 ['🏋️ Naar de sportschool',()=>({go:()=>{afterModal=()=>openSheet('Geest & lichaam',sheetMind);processQ()}})],
 ['👨‍⚕️ Naar de dokter',()=>({go:()=>{afterModal=()=>openSheet('Dokter',sheetDoctor);processQ()}})],
 ['Later',()=>'']]});
E('s_geluk',{sys:1,t:'Je zit niet lekker in je vel',x:()=>{const has=happyParts().filter(([v])=>v>0).map(([,t])=>t.toLowerCase());const miss=['Een fijne relatie','Goede vrienden','Een huisdier','Een goede gezondheid'].filter(t=>!happyParts().some(([,x])=>x===t));return `Je geluk is gezakt naar ${Math.round(S.st.happy)}%. Iets leuks doen helpt meteen: een vakantie, een avond uit of tijd met familie en vrienden.${miss.length?` Op de lange termijn helpen ook: ${miss.slice(0,3).join(', ').toLowerCase()}.`:''}`},ch:[
 ['🌴 Vakantie plannen',()=>({go:()=>{afterModal=()=>openSheet('Vakantie',sheetVacation);processQ()}})],
 ['🍸 Een avond uit',()=>({go:()=>{afterModal=nightlife;processQ()}})],
 ['❤️ Tijd met familie en vrienden',()=>({go:()=>{afterModal=()=>openSheet('Relaties',sheetRel);processQ()}})],
 ['Later',()=>'']]});
E('kraslot',{chaos:1,a:[18,95],once:1,w:.3,t:'Een kraslot',f:()=>{if(chance(.25)){const w=ri(50,1000)*1000;cash(w);S.flags.jackpot=1;MS(`Won ${fmt(w)} met een gevonden kraslot`,3);return `Je vindt een kraslot op straat. Je wint ${fmt(w)}!`}return 'Je vindt een kraslot op straat. Niks gewonnen.'}});
E('dubbelganger',{chaos:1,a:[16,90],once:1,t:'Dubbelganger',x:'Iemand die precies op jou lijkt is opgepakt voor fietsendiefstal. De politie belt jou.',ch:[
 ['Alibi geven',()=>'Opgelost. Je bent onschuldig.'],
 ['Op onderzoek uit',()=>{hap(4);sma(2);addFriend();return 'Je vindt je dubbelganger. Jullie worden vrienden.'}]]});
E('lottowin',{chaos:1,a:[18,95],w:.05,once:1,c:()=>S.flags.lotto,t:'De Staatsloterij',f:()=>{const w=ri(1,30)*1e6;cash(w);S.flags.jackpot=1;hap(25);MS(`Won ${fmt(w)} in de loterij`,4);return `Je lot valt in de prijzen. Je wint ${fmt(w)}!`}});

/* --- systeem --- */
E('s_18',{sys:1,t:'Je bent 18!',x:'Je bent officieel volwassen. Ga je op jezelf wonen?',ch:[
 ['Thuis blijven wonen',()=>'Lekker goedkoop.'],
 ['Op kamers',()=>{setRent('Studentenkamer',6500);hap(5);return 'Je huurt een studentenkamer.'}],
 ['Eigen studio huren',()=>{setRent('Studio',11500);hap(6);return 'Je eigen plek!'}]]});
E('s_klaar',{sys:1,t:'Geslaagd!',x:c=>`Je hebt je ${c.l}-diploma op zak. Wat ga je doen?`,ch:[
 ['Verder studeren',()=>{afterModal=()=>openStudy();return 'Kies een opleiding.'}],
 ['Gaan werken',()=>'Bekijk de vacatures bij Beroep.'],
 ['Tussenjaar',()=>{hap(10);sk('sociaal',4);S.flags.gap=1;return 'Je reist een jaar door Zuid-Amerika.'}]]});
E('s_stage',{sys:1,need:()=>!!S.edu.cur,t:'Stage',x:c=>`Je laatste studiejaar begint met een stage als ${JOB(c.job).lad[c.lvl].toLowerCase()} bij ${c.co}. Hoe pak je het aan?`,ch:[
 ['💪 Hard werken en veel vragen stellen',c=>{const E=S.edu.cur;E.perf=clamp(E.perf+4);sk(JOB(c.job).sk||'sociaal',2);if(chance(.5+S.st.smarts/400+E.perf/500)){E.offer=c;hap(5);return `Je begeleider is enthousiast. ${c.co} wil je na je afstuderen graag aannemen.`}return 'Je leert veel, maar er is na je stage geen plek voor je.'}],
 ['🤝 Netwerken bij elke borrel',c=>{const E=S.edu.cur;sk('sociaal',3);hap(3);if(chance(.3+S.sk.sociaal/200)){E.offer=c;return `Iedereen kent je naam. ${c.co} houdt een plek voor je vrij.`}E.perf=clamp(E.perf-2);return 'Gezellig, maar je werk blijft liggen.'}],
 ['😴 Het rustig aan doen',()=>{hap(3);S.edu.cur.perf=clamp(S.edu.cur.perf-3);return 'Je haalt je stage, maar niemand onthoudt je naam.'}]]});
E('s_aanbod',{sys:1,need:()=>!(S.job&&S.job.id==='prosport')&&!S.edu.cur,t:'Een baanaanbod',x:c=>`${c.co}, waar je stage liep, biedt je een baan aan als ${JOB(c.job).lad[c.lvl].toLowerCase()} voor ${fmt(jsal(JOB(c.job),c.lvl))} per jaar.`,ch:[
 ['🤝 Aannemen',c=>{if(S.job)endJob();setJob(c.job,c.lvl,c.co);(S.job&&(S.job.perf=clamp(S.job.perf+8)));hap(8);return 'Je eerste echte baan, meteen na je diploma!'}],
 ['Nee, ik kijk verder',()=>'Je wilt eerst rondkijken.']]});
E('s_master',{sys:1,t:'Bachelor gehaald',x:c=>`Ga je door voor een master ${STUDIES.find(s=>s.id===c.f).t}?`,ch:[
 ['Master doen',c=>{enroll('master',c.f,c.fund);return 'Je schrijft je in voor de master.'}],
 ['Gaan werken',()=>'Bekijk de vacatures bij Beroep.']]});
E('s_phd',{sys:1,t:'Master gehaald',x:'Je begeleider vraagt of je wilt promoveren. Je krijgt een kleine beurs.',ch:[
 ['Promoveren',c=>{if(S.st.smarts<60)return 'Helaas, je cijfers zijn niet hoog genoeg.';enroll('phd',c.f,'beurs');return 'Vier jaar onderzoek. Spannend!'}],
 ['Gaan werken',()=>'Bekijk de vacatures bij Beroep.']]});
E('s_pensioen',{sys:1,t:'Pensioen',x:()=>`Je bent ${ageY()}. Je hebt de AOW-leeftijd bereikt. Tijd om met pensioen te gaan?`,ch:[
 ['Met pensioen',()=>{retire();return `Je krijgt ${fmt(S.pension)} per jaar.`}],
 ['Nog even doorwerken',()=>'Je kunt het later altijd nog doen via Beroep.']]});
E('s_bizcash',{sys:1,t:'Bedrijf staat rood',x:c=>{const b=B(c);return b?`${b.name} heeft een tekort van ${fmt(-b.cash)}. Wat doe je?`:'Je bedrijf bestaat niet meer.'},ch:[
 ['Bijstorten uit eigen zak',c=>{const b=B(c);if(!b)return'';cash(b.cash);b.cash=0;return 'Je legt het tekort zelf bij.'},c=>{const b=B(c);return !b||S.money>=-b.cash}],
 ['Bankkrediet',c=>{const b=B(c);if(!b)return'';S.loan+=-b.cash;b.cash=0;return 'De bank leent je het geld, tegen 6% rente.'},c=>{const b=B(c);return !b||S.loan<Math.max(50000*(S.cpi||1),b.rev*1.5)}],
 ['Faillissement aanvragen',c=>{const b=B(c);if(!b)return'';S.biz=S.biz.filter(x=>x!==b);hap(-15);MS(`Ging failliet met ${b.name}`,2);return `${b.name} is failliet.`}]]});


/* --- politie en rechtbank --- */
function arrested(c,mult){const a=ageY();
  if(c.minor){S.crim.rec.push({w:c.w,a});const n=S.crim.rec.filter(r=>r.w===c.w).length;
    if(a<18){relAdj('moeder',-10);relAdj('vader',-10);hap(-6);if(n>=3){jail(ri(3,9),c.w+' (jeugdinrichting)');return 'Je bent nu vaker gepakt. De kinderrechter stuurt je naar een jeugdinrichting.'}return 'De politie brengt je naar huis. Je krijgt een HALT-straf en je ouders zijn woedend.'}
    const f=c.fine*n;cash(-f);hap(-5);if(n>=3){Q.push({id:'s_trial',c:{w:c.w,m:ri(1,3)*Math.min(n,4)}});return 'Je bent een veelpleger. Je moet voor de rechter verschijnen.'}return `Je krijgt een boete van ${fmt(f)} en een aantekening op je strafblad.`}
  const m=Math.max(1,Math.round(c.m*mult));if(a<18)return(jail(Math.max(2,Math.round(m/2)),c.w+' (jeugdinrichting)'),'Je bent minderjarig. Je gaat naar een jeugdinrichting.');
  Q.push({id:'s_trial',c:{w:c.w,m}});return 'Je wordt geboeid afgevoerd naar het politiebureau.'}
E('s_arrest',{sys:1,t:'Politie!',x:c=>c.minor?`Een beveiliger heeft je gezien bij ${c.w.toLowerCase()}. Hij houdt je vast tot de politie er is.`:`Een agent betrapt je op ${c.w.toLowerCase()}. "Blijf staan!"`,ch:[
 ['Overgeven',c=>{kar(1);return arrested(c,1)}],
 ['Wegrennen',c=>{if(chance(.22+S.sk.sport/220)){S.crim.heat=Math.min(100,(S.crim.heat||0)+20);if(!c.minor)S.crim.open.push({w:c.w,m:c.m,a:ageY()});hap(3);return 'Je verdwijnt in een steegje. Ontsnapt, maar de politie zoekt verder.'}hea(-ri(2,8));const r=arrested(c,1.35);return 'Na een korte achtervolging word je getackeld. Verzet bij aanhouding komt erbij. '+r}],
 ['Agent omkopen',c=>{const k=Math.max(1500,Math.round((c.m||1)*500));if(S.money<k){return 'Je hebt niet genoeg geld bij je. '+arrested(c,1.2)}if(chance(.35)){cash(-k);S.crim.heat=Math.min(100,(S.crim.heat||0)+10);return `De agent kijkt even de andere kant op. Dat kost je ${fmt(k)}.`}const r=arrested({...c,m:(c.m||2)+6,minor:false},1);return 'De agent is niet om te kopen. Poging tot omkoping komt erbij. '+r},()=>ageY()>=16]]});
E('s_caught',{sys:1,t:'Politie aan de deur',x:c=>`Rechercheurs staan voor je deur. Ze hebben nieuw bewijs gevonden in een oude zaak: ${c.w.toLowerCase()}.`,ch:[
 ['Meewerken',c=>{kar(2);Q.push({id:'s_trial',c:{w:c.w,m:Math.max(1,Math.round(c.m*.8))}});return 'Je gaat mee naar het bureau en legt een verklaring af.'}],
 ['Zwijgen en advocaat bellen',c=>{if(chance(.25)){return 'Het bewijs blijkt te zwak. Je staat weer buiten.'}Q.push({id:'s_trial',c:{w:c.w,m:c.m}});return 'Het OM zet de zaak door.'}],
 ['Vluchten via de achterdeur',c=>{if(chance(.3)){S.crim.wanted=true;S.crim.heat=100;hap(-4);return 'Je ontsnapt. Je bent nu voortvluchtig.'}Q.push({id:'s_trial',c:{w:c.w,m:Math.round(c.m*1.3)}});return 'De achterdeur wordt ook bewaakt.'}]]});
E('s_trial',{sys:1,t:'Rechtszaak',x:c=>`Je staat terecht voor ${c.w.toLowerCase()}. De officier van justitie eist ${c.m>=12?(c.m/12).toLocaleString('nl-NL',{maximumFractionDigits:1})+' jaar':c.m+' maanden'}.`,ch:[
 ['Topadvocaat inhuren',c=>{const k=5000+c.m*700;cash(-k);if(chance(.35)){hap(10);return `Vrijgesproken! De advocaat kostte ${fmt(k)}.`}const m=Math.max(1,Math.round(c.m*.65));jail(m,c.w);return `Strafvermindering, maar je krijgt toch ${m} maanden. Advocaat: ${fmt(k)}.`}],
 ['Pro-deoadvocaat',c=>{if(chance(.12)){hap(10);return 'Vrijgesproken!'}jail(c.m,c.w);return `Je krijgt ${c.m} maanden.`}],
 ['Schuld bekennen',c=>{const m=Math.max(1,Math.round(c.m*.7));jail(m,c.w);kar(2);return `Strafvermindering voor je bekentenis: ${m} maanden.`}],
 ['Taakstraf vragen',c=>{if(chance(.6)){S.crim.rec.push({w:c.w+' (taakstraf)',a:ageY()});hap(-4);if(S.job)S.job.perf=clamp(S.job.perf-10);return 'De rechter geeft je 240 uur taakstraf. Je ruimt een jaar lang zwerfafval op.'}jail(c.m,c.w);return `De rechter wil er niets van weten: ${c.m} maanden.`},c=>c.m<=8]]});
/* --- gevangenis --- */
const JL=()=>S.crim.jail;
E('j_cel',{jail:1,c:()=>!JL().cell,w:3,t:'Nieuwe celgenoot',ctx:()=>({n:rname(),w:pick(['autodiefstal','fraude','een overval','een vechtpartij','heling','inbraak'])}),x:c=>`${c.n} wordt je celgenoot. Zit hier voor ${c.w}.`,ch:[
 ['Jezelf netjes voorstellen',c=>{JL().cell={first:c.n,w:c.w,rel:60,ap:randAp('m')};return `${c.n} knikt. Jullie kunnen het goed vinden.`}],
 ['Meteen grenzen stellen',c=>{JL().cell={first:c.n,w:c.w,rel:35,ap:randAp('m')};JL().resp+=8;return `${c.n} snapt dat je niet over je heen laat lopen.`}],
 ['Negeren',c=>{JL().cell={first:c.n,w:c.w,rel:20,ap:randAp('m')};return 'Het blijft ongemakkelijk stil in de cel.'}]]});
E('j_bende',{jail:1,c:()=>!JL().gang,cd:2,t:'Een bende',ctx:()=>({g:pick(['De Noorderlingen','Club 13','De Havenjongens','Los Lobos','De IJzeren Vuist'])}),x:c=>`${c.g} wil dat je bij ze komt. Bescherming in ruil voor loyaliteit.`,ch:[
 ['Aansluiten',c=>{JL().gang=c.g;JL().resp+=15;JL().gb-=10;kar(-3);return `Je hoort nu bij ${c.g}. Niemand valt je meer lastig.`}],
 ['Beleefd weigeren',()=>{if(chance(.4)){hea(-ri(5,15));JL().resp-=4;return 'Ze nemen het niet. Je wordt in de douche in elkaar geslagen.'}JL().resp+=3;return 'Ze laten je voorlopig met rust.'}]]});
E('j_yard',{jail:1,w:1.4,t:'Op de luchtplaats',ctx:()=>({n:rname()}),x:c=>`${c.n} duwt je opzij bij de halterbank en daagt je uit.`,ch:[
 ['Terugvechten',c=>{if(chance(.3+S.sk.sport/150+(JL().gang?.15:0))){JL().resp+=12;hap(3);return `Je wint. ${c.n} kijkt je niet meer aan.`}hea(-ri(8,20));JL().resp-=5;JL().gb-=5;if(chance(.4)){JL().left+=ri(1,4);return 'Je verliest en krijgt ook nog extra straf voor vechten.'}return 'Je ligt een week in de ziekenboeg.'}],
 ['Weglopen',()=>{JL().resp-=6;return 'Je loopt weg. Er wordt gelachen.'}],
 ['Een bewaker roepen',()=>{JL().resp-=12;JL().gb+=4;return 'Je staat nu bekend als verklikker. Dat is gevaarlijk hier.'}]]});
E('j_inspectie',{jail:1,t:'Celinspectie',f:()=>{if(JL().contra){JL().contra=0;JL().left+=ri(2,6);JL().gb-=12;return 'De bewakers vinden je smokkelwaar. Je straf wordt verlengd.'}JL().gb+=2;return 'De bewakers halen je cel overhoop, maar vinden niets.'}});
E('j_smokkel',{jail:1,t:'Een telefoon verstoppen',x:'Een medegevangene vraagt of je een telefoon in je cel wilt verstoppen. Je krijgt er 500 voor.',ch:[
 ['Doen',()=>{cash(500);JL().contra=1;JL().resp+=5;return 'De telefoon zit in je matras.'}],['Weigeren',()=>{JL().gb+=2;return 'Je houdt je erbuiten.'}]]});
E('j_rel',{jail:1,w:.6,t:'Een rel',x:'Er breekt een rel uit in jouw vleugel.',ch:[
 ['Meedoen',()=>{JL().resp+=10;JL().gb-=15;if(chance(.4)){JL().left+=ri(3,12);return 'Je staat op de camerabeelden. Extra straf.'}hea(-ri(0,8));return 'Chaos. Niemand weet wie wat deed.'}],
 ['In je cel blijven',()=>'Je wacht af tot het voorbij is.'],
 ['De bewakers helpen',()=>{JL().gb+=15;JL().resp-=10;kar(3);return 'De directie waardeert het. Je medegevangenen niet.'}]]});
E('j_bezoek',{jail:1,ctx:()=>{const p=pickLiving(['moeder','vader','partner','kind','broer','zus','vriend']);return p&&{id:p.id}},t:'Bezoekuur',x:c=>`${P(c.id).first} komt op bezoek.`,ch:[
 ['Bijpraten',c=>{hap(8);P(c.id).rel=clamp(P(c.id).rel+5);return 'Een uur lang voelt het even normaal.'}],
 ['Om geld vragen',c=>{const g=ri(1,5)*100;if(chance(P(c.id).rel/120)){cash(g);return `${P(c.id).first} stort ${fmt(g)} op je rekening.`}P(c.id).rel=clamp(P(c.id).rel-6);return 'Ze zijn teleurgesteld dat je daarom vraagt.'}],
 ['Weigeren te zien',c=>{P(c.id).rel=clamp(P(c.id).rel-10);hap(-3);return 'Je schaamt je te veel.'}]]});
E('j_eten',{jail:1,t:'Gevangeniseten',f:()=>{hea(-ri(2,6));return pick(['Het vlees van vandaag was grijs. Je bent twee dagen ziek.','Voedselvergiftiging in de hele vleugel.'])}});
E('j_plan',{jail:1,c:()=>JL().cell&&JL().cell.rel>=55&&JL().tunnel<50,once:1,t:'Een plan',x:()=>`${JL().cell.first} fluistert: "Ik weet hoe we hier uitkomen. Doe je mee?"`,ch:[
 ['Meedoen',()=>{JL().tunnel=Math.max(JL().tunnel,40);return 'Jullie beginnen elke nacht aan een gat achter de wc. Verder graven kan via Activiteiten.'}],['Niet doen',()=>'Je zit je straf liever gewoon uit.']]});
E('j_cursus',{jail:1,c:()=>!JL().study,t:'Opleiding in de bajes',x:'De gevangenis biedt een mbo-opleiding aan.',ch:[
 ['Inschrijven',()=>{JL().study=1;return 'Je kunt nu studeren via Activiteiten.'}],['Nee',()=>'Misschien later.']]});
E('j_brief',{jail:1,ctx:()=>{const p=pickLiving(['moeder','vader','partner','kind']);return p&&{id:p.id}},t:'Een brief',x:c=>`Je krijgt een brief van ${P(c.id).first}.`,ch:[
 ['Terugschrijven',c=>{P(c.id).rel=clamp(P(c.id).rel+6);hap(4);return 'Je schrijft drie kantjes vol.'}],['Niet openen',c=>{P(c.id).rel=clamp(P(c.id).rel-4);return 'De brief blijft dicht.'}]]});

/* --- bedrijf en beurs --- */
E('b_plan',{sys:1,t:'Jaarplan',x:c=>{const b=B(c);return b?`${b.name} draaide ${fmt(b.rev)} omzet en ${b.profit>=0?'maakte':'leed'} ${fmt(Math.abs(b.profit))} ${b.profit>=0?'winst':'verlies'}. ${b.util>1.1?'Je kunt de vraag niet aan. ':b.util<.6?'Er is te weinig vraag voor je capaciteit. ':''}Welke koers kies je voor volgend jaar?`:'Je bedrijf bestaat niet meer.'},ch:[
 ['🚀 Agressief groeien',c=>{const b=B(c);if(!b)return'';const k=Math.round(Math.max(3000,b.rev*.1));b.cash-=k;b.mkt+=.15;bizAddStaff(b,1);return `Je steekt ${fmt(k)} in marketing en neemt iemand aan. Spannend.`}],
 ['💶 Prijzen verhogen',c=>{const b=B(c);if(!b)return'';if(prOf(b)>=2)return 'Je zit al op premium. Hoger kan niet.';setPr(b,1);b.rep=clamp(b.rep-1);return `Je gaat naar ${PRL[b.pr][0].toLowerCase()}. Hogere marges, minder klanten.`}],
 ['🏷️ Prijzen verlagen',c=>{const b=B(c);if(!b)return'';if(prOf(b)<=0)return 'Goedkoper dan dit kan niet.';setPr(b,-1);return `Je gaat naar ${PRL[b.pr][0].toLowerCase()}. Meer klanten, minder per klant.`}],
 ['✂️ Kosten snijden',c=>{const b=B(c);if(!b)return'';const w=bizCut(b);b.rep=clamp(b.rep-4);return w?`Je ontslaat ${w.first}. De kwaliteit lijdt eronder.`:b.staff>=0?'Je bespaart op personeel. De kwaliteit lijdt eronder.':'Je bespaart waar het kan.'}],
 ['⚖️ Rustig doorgaan',()=>pickF('koers',['Je houdt de koers vast.','Geen grote stappen dit jaar. Rust in de tent.','Je kiest voor stabiliteit.','Je focust op wat al goed gaat.'])]]});
function crashDrop(){S.inv.index=Math.round(S.inv.index*.72);S.inv.aandelen=Math.round(S.inv.aandelen*.62);S.inv.crypto=Math.round(S.inv.crypto*.45)}
E('crash',{a:[18,100],w:()=>econ()==='recessie'?2.5:.5,cd:5,c:()=>S.inv.index+S.inv.aandelen+S.inv.crypto>3000,t:'Beurscrash!',x:()=>`De beurzen kelderen. Je ${fmt(S.inv.index+S.inv.aandelen+S.inv.crypto)} aan beleggingen dreigt een kwart tot de helft waard te verliezen. Wat doe je?`,ch:[
 ['📉 Alles verkopen',()=>{crashDrop();const x=S.inv.index+S.inv.aandelen+S.inv.crypto;cash(x);S.inv.index=S.inv.aandelen=S.inv.crypto=0;if(S.invIn){S.invIn.index=S.invIn.aandelen=S.invIn.crypto=0}hap(-6);return `Je verkoopt in paniek voor ${fmt(x)}. Het verlies staat vast.`}],
 ['🧘 Vasthouden',()=>{crashDrop();S.flags.rebound=1;hap(-4);return 'Je kijkt niet meer naar je app en houdt je zenuwen in bedwang.'}],
 ['🛒 Bijkopen',()=>{crashDrop();const x=Math.round(Math.max(0,S.money)*.25);cash(-x);S.invIn=S.invIn||{};S.invIn.index=(S.invIn.index??S.inv.index)+x;S.inv.index+=x;S.flags.rebound=1;return `Je koopt voor ${fmt(x)} bij tegen bodemprijzen.`},()=>S.money>2000]]});
/* --- tegenvallers --- */
E('wasmachine',{a:[18,100],c:()=>S.home.k!=='ouders',t:'Kapot',ctx:()=>({d:pick(['wasmachine','koelkast','cv-ketel','vaatwasser'])}),x:c=>`Je ${c.d} begeeft het.`,ch:[
 ['Nieuwe kopen',c=>{const k=c.d==='cv-ketel'?2400:ri(5,9)*100;cash(-k);return `Een nieuwe ${c.d} kost ${fmt(k)}.`}],
 ['Tweedehands',c=>{cash(-250);if(chance(.4)){cash(-250);return 'Hij gaat na drie maanden ook kapot. Weer betalen.'}return 'Hij doet het prima.'}],
 ['Zelf repareren',c=>{if(chance(.25+S.sk.tech/150)){sk('tech',3);hap(3);return 'Met een YouTube-filmpje lukt het je!'}const k=ri(6,12)*100;cash(-k);return `Je maakt het erger. Uiteindelijk kost het ${fmt(k)}.`}]]});
E('apk',{a:[18,100],c:()=>S.cars.length,t:'APK afgekeurd',ctx:()=>({id:S.cars[0].id}),x:c=>{const car=S.cars.find(x=>x.id===c.id);return car?`Je ${car.name} is afgekeurd bij de APK.`:'Je auto is afgekeurd.'},ch:[
 ['Laten repareren',c=>{const car=S.cars.find(x=>x.id===c.id);const k=Math.round(300+(100-(car?.cond??80))*25);cash(-k);if(car)car.cond=Math.min(100,(car.cond??80)+20);return `De garage rekent ${fmt(k)}.`}],
 ['Auto wegdoen',c=>{const car=S.cars.find(x=>x.id===c.id);if(!car)return'';const v=Math.round(car.value*.3);cash(v);S.cars=S.cars.filter(x=>x!==car);return `Je verkoopt hem aan een opkoper voor ${fmt(v)}.`}]]});
E('tandarts',{a:[18,100],t:'De tandarts',f:()=>{const k=ri(2,15)*100;cash(-k);hea(-1);return `Je hebt drie gaatjes en een wortelkanaalbehandeling nodig. De rekening: ${fmt(k)}.`}});
E('huurverhoging',{a:[19,100],c:()=>S.home.k==='huur',t:'Huurverhoging',x:()=>`Je verhuurder verhoogt de huur met 7%.`,ch:[
 ['Accepteren',()=>{S.home.rent=Math.round(S.home.rent*1.07);return 'Je betaalt voortaan meer.'}],
 ['Naar de Huurcommissie',()=>{cash(-50);if(chance(.4)){return 'De Huurcommissie geeft je gelijk. De verhoging gaat niet door.'}S.home.rent=Math.round(S.home.rent*1.07);return 'Je krijgt geen gelijk. De verhoging gaat toch door.'}],
 ['Verhuizen',()=>{afterModal=()=>openSheet('Huren',sheetRent);return 'Je gaat op zoek naar iets anders.'}]]});
E('inbraakthuis',{a:[16,100],w:.5,c:()=>S.home.k!=='ouders'&&(S.items.length||S.money>500),t:'Ingebroken!',f:()=>{if(S.items.length&&chance(.6)){const it=pick(S.items);S.items=S.items.filter(x=>x!==it);hap(-8);return `Er is ingebroken. Je ${it.name} is gestolen.`}const k=Math.min(Math.max(0,S.money),ri(2,10)*100);cash(-k);hap(-6);return `Er is ingebroken. Ze nemen ${fmt(k)} aan contant geld en spullen mee.`}});
E('energie',{a:[18,100],c:()=>S.home.k!=='ouders',t:'Energierekening',f:()=>{if(chance(.4)){const k=ri(1,6)*100;cash(k);return `Je jaarafrekening valt mee: je krijgt ${fmt(k)} terug.`}const k=ri(4,15)*100;cash(-k);hap(-2);return `Na een koude winter moet je ${fmt(k)} bijbetalen.`}});
E('s_weg',{sys:1,t:'Het gaat niet meer',x:c=>{const p=P(c.id);return p?`${p.first} zegt dat ${p.g==='v'?'ze':'hij'} zich al lang niet meer gezien voelt en wil stoppen.`:''},ch:[
 ['Vechten voor de relatie',c=>{const p=P(c.id);if(!p||p.role!=='partner')return'';if(chance(.35+S.sk.sociaal/200)){p.rel=clamp(p.rel+25);hap(-2);return `Jullie praten de hele nacht. ${p.first} geeft je nog één kans.`}breakUp();return `${p.first} heeft de knoop al doorgehakt.`}],
 ['Relatietherapie voorstellen',c=>{const p=P(c.id);if(!p||p.role!=='partner')return'';cash(-1200);if(chance(.55)){p.rel=clamp(p.rel+30);return 'Na tien sessies gaat het weer echt beter tussen jullie.'}breakUp();return 'De therapie helpt niet meer.'},()=>S.money>=1200],
 ['Laten gaan',c=>{const p=P(c.id);if(p&&p.role==='partner')breakUp();return 'Jullie gaan uit elkaar.'}]]});

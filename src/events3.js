/* ================= NIEUWE GEBEURTENISSEN (verbeterplan 4.6) =================
   Voor 30 tot 60 jaar en 60-plus, waar het aanbod het dunst was. Elke gebeurtenis komt hooguit 3 keer per leven
   (zie rollEvent). Bedragen schalen mee met het prijspeil. */
const K3=n=>Math.round(n*(S.cpi||1)/10)*10;
// ---------- 30 tot 60 ----------
E('m3_marathon',{a:[30,55],t:'Een marathon?',x:'Een collega daagt je uit om over een half jaar een marathon te lopen.',ch:[
 ['🏃 Uitdaging aangenomen',()=>{if(S.st.health>=60&&chance(.7)){hea(4);hap(8);MS('Liep een marathon',1);return 'Na 42 kilometer en vier uur lijden kom je over de finish. Je huilt een beetje.'}hea(-2);hap(-2);return 'Bij kilometer 28 gaat je knie op slot. Je neemt de bezemwagen.'}],
 ['🛋️ Ik kijk wel vanaf de bank',()=>'Je juicht vanaf de bank. Ook een sport.']]});
E('m3_cursus',{a:[30,60],t:'Avondcursus',ctx:()=>({k:K3(350)}),x:c=>`Het buurthuis biedt een avondcursus aan. Tien lessen voor ${fmt(c.k)}.`,ch:[
 ['🍳 Italiaans koken',c=>{cash(-c.k);hap(5);return 'Je maakt nu verse pasta. Iedereen wil bij je eten.'},c=>S.money>=c.k],
 ['🗣️ Spaans',c=>{cash(-c.k);sma(2);hap(3);return '¡Ya puedes pedir una cerveza! Meer dan dat nog niet.'},c=>S.money>=c.k],
 ['🏺 Pottenbakken',c=>{cash(-c.k);hap(6);return 'Je eerste vaas is scheef. Je tweede ook. Je bent er trots op.'},c=>S.money>=c.k],
 ['🙅 Geen tijd',()=>'Misschien volgend jaar.']]});
E('m3_midlife',{a:[40,52],t:'Midlifecrisis?',x:'Je kijkt in de spiegel en denkt: was dit het nou?',ch:[
 ['🏍️ Een motor kopen',()=>{const k=K3(9000);if(S.money<k){hap(-2);return 'Je bekijkt motoren online, maar je bankrekening is het niet met je eens.'}cash(-k);hap(10);return `Voor ${fmt(k)} rijd je nu op een glimmende motor. Je partner rolt met de ogen.`}],
 ['🎸 Een band oprichten',()=>{hap(7);return 'Je speelt elke donderdag met drie andere veertigers in een garage. Jullie zijn verschrikkelijk en het is geweldig.'}],
 ['🧘 Het gewoon voelen',()=>{hap(3);sma(1);return 'Je praat erover met een vriend. Het lucht op. Het leven is best goed.'}]]});
E('m3_ouderavond',{a:[30,55],c:()=>living('kind').some(k=>pAge(k)>=5&&pAge(k)<=16),t:'Ouderavond',ctx:()=>ctxP(pick(living('kind').filter(k=>pAge(k)>=5&&pAge(k)<=16))),x:c=>`De leraar van ${Pe(c).first} wil je spreken.`,ch:[
 ['🙂 Gezellig gaan',c=>{const k=Pe(c);if(chance(.6)){k.rel=clamp(k.rel+3);return `Goed nieuws: ${k.first} doet het prima en is erg behulpzaam in de klas.`}k.rel=clamp(k.rel-2);return `${k.first} praat volgens de leraar 'iets te veel'. Thuis volgt een gesprek.`}],
 ['🙈 Smoesje verzinnen',c=>{const k=Pe(c);k.rel=clamp(k.rel-3);return 'Je komt niet. De leraar stuurt een lange e-mail.'}]]});
E('m3_reorganisatie',{a:[30,62],c:()=>!!S.job&&!S.job.part&&S.job.id!=='prosport',t:'Reorganisatie',x:'Er hangt een reorganisatie in de lucht. Op de gang wordt gefluisterd.',ch:[
 ['💪 Extra hard werken',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+8)));hap(-3);return 'Je bent de eerste die komt en de laatste die gaat. Je baan lijkt veilig.'}],
 ['🤝 Netwerken met de nieuwe baas',()=>{if(chance(.55)){(S.job&&(S.job.perf=clamp(S.job.perf+5)));return 'De nieuwe baas vindt je sympathiek. Je hoort bij het nieuwe team.'}return 'Je grap over de vorige baas valt verkeerd. Pijnlijke stilte.'}],
 ['😌 Afwachten',()=>'Uiteindelijk verandert er vooral van naam wie wat doet.']]});
E('m3_klusjes',{a:[30,70],c:()=>S.home.k==='eigen',t:'Klussen',ctx:()=>({k:K3(1800)}),x:'De badkamer is aan vervanging toe.',ch:[
 ['🔨 Zelf doen',()=>{if(chance(.5)){hap(6);return 'Na drie weekenden is hij klaar. Bijna recht.'}const k=K3(2500);cash(-k);hap(-4);return `Je boort door een waterleiding. De loodgieter kost ${fmt(k)}.`}],
 ['👷 Een vakman inhuren',c=>{cash(-c.k*3);hap(3);return `Een mooie nieuwe badkamer voor ${fmt(c.k*3)}.`},c=>S.money>=c.k*3],
 ['🛁 Laten zoals het is',()=>'De tegels uit de jaren tachtig blijven. Retro is weer in.']]});
E('m3_schoonouders',{a:[30,65],c:()=>{const p=partner();return !!p},t:'Schoonfamilie',x:()=>`Je schoonouders komen een week logeren.`,ch:[
 ['🤗 Gezellig',()=>{const p=partner();if(p)p.rel=clamp(p.rel+4);hap(-1);return 'Je houdt het een week gezellig. Je partner is je dankbaar.'}],
 ['🏨 Zeggen dat er een hotel om de hoek is',()=>{const p=partner();if(p)p.rel=clamp(p.rel-6);return 'Dat valt niet goed. Het wordt een koude week.'}]]});
E('m3_loterijcollega',{a:[25,65],c:()=>!!S.job,t:'De loterij op kantoor',ctx:()=>({k:K3(20)}),x:c=>`Je collega's doen samen mee met de loterij. Inleg: ${fmt(c.k)}.`,ch:[
 ['🎟️ Meedoen',c=>{cash(-c.k);if(chance(.02)){const w=K3(ri(20,200)*1000);cash(w);hap(15);MS('Won met collega\'s de loterij',2);return `Jullie winnen! Jouw deel: ${fmt(w)}.`}return 'Geen prijs. Wel gezellig.'},c=>S.money>=c.k],
 ['🙅 Niet meedoen',()=>{if(chance(.05)){hap(-10);return 'Jullie... nee, zíj winnen. Jij niet. Je zegt een week lang niets.'}return 'Ze winnen niets. Jij hebt gelijk gekregen.'}]]});
E('m3_huisdierweg',{a:[20,80],c:()=>living('huisdier').length>0,t:'Weggelopen',ctx:()=>ctxP(pick(living('huisdier'))),x:c=>`${Pe(c).first} is al een dag niet thuisgekomen.`,ch:[
 ['📄 Posters ophangen',c=>{const p=Pe(c);if(chance(.8)){hap(4);return `Een buurvrouw belt: ${p.first} zit bij haar in de schuur. Wat een opluchting.`}hap(-8);return `${p.first} komt niet meer terug. Je hoopt dat het ergens goed terecht is gekomen.`}],
 ['⏳ Afwachten',c=>{const p=Pe(c);if(chance(.6))return `Na drie dagen staat ${p.first} gewoon weer voor de deur, alsof er niets gebeurd is.`;hap(-8);return `${p.first} komt niet meer terug.`}]]});
E('m3_verjaardag',{a:[30,70],t:'Je verjaardag',x:()=>`Je wordt ${ageY()}. Hoe vier je het?`,ch:[
 ['🎉 Groot feest',()=>{const k=K3(600);if(S.money<k)return 'Je wilt een groot feest, maar je houdt het bij taart.';cash(-k);hap(6);return 'Je hele familie en al je vrienden zijn er. Het wordt laat.'}],
 ['🍽️ Uit eten met je liefste mensen',()=>{hap(4);return 'Een klein, fijn etentje. Precies goed.'}],
 ['🙈 Doen alsof het niet zo is',()=>{hap(-1);return 'Je collega\'s komen er toch achter. Er hangen ballonnen aan je bureau.'}]]});
E('m3_rug',{a:[35,70],t:'Je rug',x:'Je bukt om een sok op te rapen en voelt een scheut in je onderrug.',ch:[
 ['🧑‍⚕️ Naar de fysiotherapeut',()=>{payMed(250);hea(2);return 'Zes behandelingen en een velletje oefeningen later gaat het een stuk beter.'}],
 ['💊 Pijnstillers en doorgaan',()=>{hea(-2);return 'Het trekt na een paar weken weg. Je bukt nu voorzichtiger.'}]]});
E('m3_ruzieburen',{a:[30,80],c:()=>S.home.k!=='ouders',t:'De schutting',x:'Je buurman wil een nieuwe schutting en vindt dat jij de helft moet betalen.',ch:[
 ['🤝 Samen betalen',()=>{const k=K3(700);cash(-k);hap(1);return `Het kost je ${fmt(k)}, maar de vrede blijft bewaard.`},()=>S.money>=K3(700)],
 ['📏 Het is niet eens jouw grond',()=>{if(chance(.5)){hap(2);return 'Je pakt de kadasterkaart erbij. De buurman betaalt zelf.'}hap(-4);return 'Hij praat al een jaar niet meer tegen je.'}],
 ['🌳 Een heg voorstellen',()=>{hap(3);return 'Een heg! Goedkoper, groener, en er komen merels in.'}]]});
E('m3_volksfeest',{a:[30,85],t:'Straatfeest',x:'De straat organiseert een straatfeest. Iedereen neemt iets mee.',ch:[
 ['🥗 Een salade maken',()=>{hap(4);return 'Je salade is in tien minuten op. Je krijgt drie keer de vraag om het recept.'}],
 ['🎵 De muziek regelen',()=>{hap(5);return 'Je draait de hele middag hits van vroeger. De straat danst.'}],
 ['🚪 Thuisblijven',()=>'Je hoort het feest door het raam. Gezellig klinkt het wel.']]});
E('m3_oudmaatje',{a:[35,75],t:'Een oude bekende',x:'In de supermarkt staat ineens iemand die je al twintig jaar niet hebt gezien.',ch:[
 ['☕ Koffie drinken',()=>{hap(5);return 'Jullie praten drie uur. Je spreekt af om het vaker te doen.'}],
 ['👋 Kort groeten',()=>'Een snelle "hoe is het", en jullie lopen weer verder.'],
 ['🫣 Snel een ander pad in',()=>{hap(-1);return 'Je duikt weg achter de pindakaas. Gered.'}]]});
E('m3_dierenasiel',{a:[25,75],c:()=>S.home.k!=='ouders'&&!living('huisdier').length,t:'Het asiel',x:'Je loopt langs het dierenasiel. Een hond kijkt je door het hek aan.',ch:[
 ['🐕 Meenemen',()=>{if(typeof addPet==='function'){addPet('hond','Bram');hap(8);return 'Hij heet nu Bram. Hij slaapt op je voeten.'}hap(4);return 'Je gaat elke week wandelen met de asielhonden.'}],
 ['🚶 Doorlopen',()=>'Je denkt er de hele dag nog aan.']]});
E('m3_reis',{a:[30,75],c:()=>S.money>K3(3000),t:'Een verre reis',ctx:()=>({k:K3(ri(25,60)*100),w:pick(['Japan','Peru','Zuid-Afrika','IJsland','Vietnam','Canada'])}),x:c=>`Een vriend stelt voor om samen naar ${c.w} te gaan. Kosten: ${fmt(c.k)}.`,ch:[
 ['✈️ Ja!',c=>{cash(-c.k);hap(10);MS(`Reisde naar ${c.w}`,0);return `${c.w} is overweldigend. Je komt terug met duizend foto's en een nieuwe kijk op dingen.`},c=>S.money>=c.k],
 ['🏡 Te duur, te ver',()=>'Je kijkt een documentaire over het land. Bijna hetzelfde.']]});
E('m3_snurken',{a:[35,80],c:()=>!!partner(),t:'Gesnurk',x:'Je partner klaagt dat je snurkt als een kettingzaag.',ch:[
 ['😴 Naar de huisarts',()=>{payMed(60);hea(1);return 'Een neusspray en een ander kussen. Het helpt.'}],
 ['🛏️ Aparte slaapkamers',()=>{const p=partner();if(p)p.rel=clamp(p.rel-3);return 'Jullie slapen beter. Het voelt wel een beetje als opgeven.'}],
 ['🙄 Ontkennen',()=>{const p=partner();if(p)p.rel=clamp(p.rel-2);return 'Je partner neemt je op met de telefoon. Er valt niets meer te ontkennen.'}]]});
E('m3_bril',{a:[40,60],cd:30,t:'Kleine lettertjes',x:'Je houdt je telefoon steeds verder van je af om iets te kunnen lezen.',ch:[
 ['👓 Een leesbril halen',()=>{cash(-K3(80));return 'Je kunt weer lezen. Je ziet er ineens erg wijs uit.'}],
 ['📱 De letters groter zetten',()=>'Je telefoon toont nu vier woorden per scherm. Werkt prima.']]});
E('m3_vrijwilligerbrand',{a:[25,60],t:'Brandweer zoekt mensen',x:'De vrijwillige brandweer in je dorp zoekt nieuwe mensen.',ch:[
 ['🚒 Aanmelden',()=>{if(S.st.health<50)return 'Je haalt de keuring niet. Jammer.';kar(4);hap(6);hea(2);MS('Werd vrijwillig brandweerman',1);return 'Na de opleiding rijd je mee. Je eerste uitruk: een kat in een boom. Het blijft een klassieker.'}],
 ['🙅 Niet voor mij',()=>'Je doneert wel aan hun jaarlijkse actie.']]});
E('m3_erfstukzolder',{a:[30,75],t:'Op zolder',x:'Bij het opruimen van de zolder vind je een oude doos met spullen van vroeger.',ch:[
 ['📸 Foto\'s bekijken',()=>{hap(5);return 'Je vindt foto\'s van je jeugd. Je stuurt er een paar naar je familie. De groepsapp ontploft.'}],
 ['💰 Op een veiling zetten',()=>{const k=K3(ri(2,40)*10);cash(k);return `Een oud speelgoedautootje blijkt ${fmt(k)} waard. Niet slecht.`}],
 ['🗑️ Alles weggooien',()=>{hap(-2);return 'Opgeruimd. Een dag later heb je er spijt van.'}]]});
E('m3_kookwedstrijd',{a:[25,70],t:'Kookwedstrijd',x:'De buurt houdt een kookwedstrijd. Thema: oma\'s recept.',ch:[
 ['👩‍🍳 Meedoen',()=>{if(chance(.3+S.st.smarts/400)){hap(8);return 'Je stoofpot wint! Je krijgt een gouden pollepel.'}hap(1);return 'Je eindigt als vierde. De jury vond het "iets te zout".'}],
 ['🍴 Alleen komen proeven',()=>{hap(3);return 'Je eet van elk gerecht. Je bent de grote winnaar van de avond.'}]]});
E('m3_wifi',{a:[30,80],c:()=>S.home.k!=='ouders',t:'Geen internet',x:'Je internet ligt al twee dagen plat.',ch:[
 ['📞 De helpdesk bellen',()=>{hap(-3);return 'Na 47 minuten in de wacht vraagt iemand of je het modem al uit en aan hebt gezet. Dat werkt.'}],
 ['📚 Een boek lezen',()=>{hap(3);sma(1);return 'Je leest een heel boek uit. Het internet komt vanzelf terug. Je mist het eerlijk gezegd niet.'}]]});
E('m3_jubileum',{a:[30,65],c:()=>!!S.job&&S.job.lyrs>=10,t:'Jubileum',x:()=>`Je werkt alweer ${S.job.lyrs} jaar bij dit bedrijf. Er staat taart.`,ch:[
 ['🎂 Een speech houden',()=>{hap(5);(S.job&&(S.job.perf=clamp(S.job.perf+3)));return 'Je bedankt iedereen. Iemand pinkt een traantje weg.'}],
 ['🍰 Gewoon taart eten',()=>{hap(3);return 'Lekkere taart. En een bos bloemen. Fijn.'}]]});
E('m3_opa_oma_oppas',{a:[50,80],c:()=>living('kleinkind').length>0,t:'Oppassen',ctx:()=>ctxP(pick(living('kleinkind'))),x:c=>`Of je dit weekend op ${Pe(c).first} wilt passen.`,ch:[
 ['🧸 Natuurlijk!',c=>{const k=Pe(c);k.rel=clamp(k.rel+6);hap(6);return `Jullie bakken pannenkoeken en kijken drie keer dezelfde film. ${k.first} wil nooit meer naar huis.`}],
 ['😴 Even niet',c=>{const k=Pe(c);k.rel=clamp(k.rel-2);return 'Je hebt dit weekend rust nodig. Volgende keer.'}]]});
// ---------- 60-plus ----------
E('o_pensioenfeest',{a:[60,70],c:()=>!S.job&&ageY()>=62,cd:30,t:'Eindelijk vrij',x:'Je hoeft niet meer elke ochtend de wekker te zetten. Wat ga je doen met al die tijd?',ch:[
 ['🌍 Reizen',()=>{hap(8);return 'Je koopt een wereldkaart en prikt er spelden in. De eerste reis is al geboekt.'}],
 ['🌱 Een volkstuin',()=>{hap(6);hea(2);return 'Je kweekt tomaten, courgettes en vriendschappen met de andere tuinders.'}],
 ['🤝 Vrijwilligerswerk',()=>{hap(5);kar(3);return 'Je leest drie ochtenden per week voor op de basisschool.'}]]});
E('o_kleinkindbel',{a:[60,95],c:()=>living('kleinkind').some(k=>pAge(k)>=12),t:'Een telefoontje',ctx:()=>ctxP(pick(living('kleinkind').filter(k=>pAge(k)>=12))),x:c=>`${Pe(c).first} belt. Gewoon, om te vragen hoe het met je gaat.`,ch:[
 ['📞 Lekker kletsen',c=>{const k=Pe(c);k.rel=clamp(k.rel+5);hap(6);return 'Jullie praten een uur. Je loopt de rest van de dag te glimlachen.'}],
 ['📖 Een verhaal van vroeger vertellen',c=>{const k=Pe(c);k.rel=clamp(k.rel+4);hap(4);return `${k.first} vindt het prachtig en vraagt of je het wilt opschrijven.`}]]});
E('o_computerles',{a:[62,90],t:'De tablet',x:'Je hebt een tablet gekregen, maar je snapt er niets van.',ch:[
 ['🧑‍🏫 Les nemen in de bibliotheek',()=>{sma(2);hap(4);return 'Na vier lessen videobel je met je familie. Je bent de held van de cursus.'}],
 ['👦 Een kleinkind vragen',()=>{hap(3);return 'Je kleinkind legt het in vijf minuten uit, met veel zuchten. Het werkt.'}],
 ['📦 In de kast leggen',()=>'Hij ligt er nog. In de doos.']]});
E('o_reunieklas',{a:[60,85],cd:20,t:'Klassenreünie',x:'Er is een reünie van je oude klas. Vijftig jaar na dato.',ch:[
 ['🎉 Gaan',()=>{hap(7);return 'Je herkent de helft niet meer. De andere helft is precies hetzelfde gebleven. Wat een avond.'}],
 ['🏠 Thuisblijven',()=>'Je kijkt later de foto\'s. Iedereen is zo oud geworden. Jij natuurlijk niet.']]});
E('o_valpartij',{a:[65,100],t:'Uitgegleden',x:'Je glijdt uit in de badkamer.',ch:[
 ['🚑 Laten nakijken',()=>{payMed(400);if(chance(.3)){hea(-6);return 'Je pols is gebroken. Zes weken gips. Je laat een handgreep in de badkamer zetten.'}hea(-1);return 'Een flinke blauwe plek, verder niets. Gelukkig.'}],
 ['😤 Het gaat wel',()=>{if(chance(.4)){hea(-8);return 'Het gaat niet. Na drie dagen blijkt je heup gekneusd.'}hea(-2);return 'Het trekt bij. Je loopt wel voorzichtiger.'}]]});
E('o_bingo',{a:[60,100],t:'Bingoavond',x:'In het buurthuis is elke dinsdag bingo.',ch:[
 ['🎱 Meespelen',()=>{hap(4);if(chance(.15)){const k=K3(50);cash(k);return `BINGO! Je wint een fruitmand en ${fmt(k)}.`}return 'Je mist steeds één nummer. Volgende week beter.'}],
 ['🙅 Niets voor mij',()=>'Je kijkt liever een quiz op tv.']]});
E('o_rijbewijs',{a:[75,100],c:()=>S.cars.length>0,cd:40,t:'Het rijbewijs',x:'Je moet een medische keuring doen om je rijbewijs te verlengen.',ch:[
 ['🩺 Keuring doen',()=>{if(S.st.health>=45)return 'Goedgekeurd. Je mag nog vijf jaar.';hap(-6);return 'Afgekeurd. Je auto blijft voortaan staan. Je neemt de bus.'}],
 ['🔑 Zelf stoppen met rijden',()=>{hap(-2);kar(1);return 'Je geeft de sleutels aan je familie. Een moeilijk moment, maar wel verstandig.'}]]});
E('o_moestuin',{a:[60,90],c:()=>S.home.k!=='ouders',t:'Groene vingers',x:'Je tomatenplanten doen het dit jaar fantastisch.',ch:[
 ['🍅 Uitdelen aan de buren',()=>{hap(5);kar(1);return 'De hele straat eet jouw tomaten. Je bent een buurtberoemdheid.'}],
 ['🏆 Meedoen aan de oogstwedstrijd',()=>{if(chance(.35)){hap(8);return 'Je tomaat wint de prijs voor de mooiste van de streek.'}hap(1);return 'Een eervolle vermelding. De tomaat van de winnaar was "duidelijk gekocht", vind je.'}]]});
E('o_memoires',{a:[65,95],cd:30,t:'Je memoires',x:'Je kleinkinderen vragen of je je levensverhaal wilt opschrijven.',ch:[
 ['✍️ Beginnen',()=>{hap(6);sma(1);MS('Schreef memoires',1);return 'Het wordt een dik schrift vol verhalen. Sommige zijn zelfs waar.'}],
 ['🎙️ Inspreken',()=>{hap(4);return 'Je vertelt een avond lang. Je kleinkind neemt alles op.'}],
 ['🤐 Sommige dingen kun je beter vergeten',()=>'Je glimlacht geheimzinnig.']]});
E('o_dansles',{a:[60,90],t:'Dansles',x:'In het buurthuis begint een cursus stijldansen voor 60-plussers.',ch:[
 ['💃 Aanmelden',()=>{hap(7);hea(2);return 'De wals gaat je goed af. De tango iets minder. Je hebt de tijd van je leven.'}],
 ['🪑 Liever toekijken',()=>'Je kijkt vanaf de zijkant en tikt mee met je voet.']]});
E('o_oplichter',{a:[65,100],t:'Een vreemd telefoontje',x:'Iemand belt die zegt dat hij je kleinzoon is. Hij zit in de problemen en heeft snel geld nodig.',ch:[
 ['💸 Geld overmaken',()=>{const k=K3(ri(10,40)*100);if(S.money<k)return 'Je hebt het geld niet. Achteraf maar goed ook: het blijkt een oplichter.';cash(-k);hap(-10);return `Je maakt ${fmt(k)} over. Je echte kleinzoon blijkt gewoon thuis te zitten. Het was een oplichter.`}],
 ['🕵️ Terugbellen op het oude nummer',()=>{hap(2);kar(1);return 'Je echte kleinzoon neemt op en weet van niets. Je meldt het bij de politie.'}]]});
E('o_wandelclub',{a:[60,90],t:'De wandelclub',x:'Een buurvrouw vraagt of je mee wilt met haar wandelclub.',ch:[
 ['🥾 Mee!',()=>{hea(3);hap(5);return 'Elke zaterdag tien kilometer en daarna appeltaart. Je voelt je fitter dan in jaren.'}],
 ['🙅 Te vroeg op zaterdag',()=>'Je slaapt uit. Ook gezond.']]});
E('o_verhuizen',{a:[70,95],c:()=>S.home.k==='eigen',cd:30,t:'Te groot huis',x:'De trap wordt steeds zwaarder en het huis voelt groot.',ch:[
 ['🏢 Een appartement zoeken',()=>{hap(2);return 'Je bekijkt een paar gelijkvloerse appartementen. Er is er een met een balkon op het zuiden. Je denkt erover na.'}],
 ['🏡 Blijven waar ik ben',()=>{hap(1);return 'Hier liggen al je herinneringen. Je laat een traplift plaatsen.'}]]});
E('o_honderd',{a:[90,110],cd:5,t:'Een kaart van de burgemeester',x:()=>`Je bent ${ageY()} geworden. De burgemeester stuurt een kaart.`,ch:[
 ['🎂 Een klein feestje',()=>{hap(6);return 'De hele familie komt langs. Vier generaties op één foto.'}],
 ['🛋️ Rustig aan',()=>{hap(3);return 'Een kopje thee en een gebakje. Meer hoeft niet.'}]]});
Object.assign(EVMETA,{m3_marathon:['Sport','🏃'],m3_cursus:['Vrije tijd','🎓'],m3_midlife:['Leven','🪞'],m3_ouderavond:['Familie','🏫'],m3_reorganisatie:['Werk','🏢'],m3_klusjes:['Huis','🔨'],m3_schoonouders:['Familie','🧳'],m3_loterijcollega:['Werk','🎟️'],m3_huisdierweg:['Huisdier','🐾'],m3_verjaardag:['Leven','🎂'],m3_rug:['Gezondheid','🦴'],m3_ruzieburen:['Buren','🪵'],m3_volksfeest:['Buren','🎪'],m3_oudmaatje:['Vrienden','👋'],m3_dierenasiel:['Huisdier','🐕'],m3_reis:['Vrije tijd','✈️'],m3_snurken:['Relatie','😴'],m3_bril:['Gezondheid','👓'],m3_vrijwilligerbrand:['Vrije tijd','🚒'],m3_erfstukzolder:['Huis','📦'],m3_kookwedstrijd:['Vrije tijd','🍲'],m3_wifi:['Huis','📶'],m3_jubileum:['Werk','🎂'],m3_opa_oma_oppas:['Familie','🧸'],
 o_pensioenfeest:['Pensioen','🌅'],o_kleinkindbel:['Familie','📞'],o_computerles:['Vrije tijd','📱'],o_reunieklas:['Vrienden','🎓'],o_valpartij:['Gezondheid','🩹'],o_bingo:['Vrije tijd','🎱'],o_rijbewijs:['Pensioen','🚗'],o_moestuin:['Vrije tijd','🍅'],o_memoires:['Pensioen','✍️'],o_dansles:['Vrije tijd','💃'],o_oplichter:['Geld','☎️'],o_wandelclub:['Vrije tijd','🥾'],o_verhuizen:['Huis','🏢'],o_honderd:['Leven','💌']});

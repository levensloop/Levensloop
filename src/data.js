document.documentElement.lang='nl';
/* ================= DATA ================= */
const NAMES={
nl:{m:['Daan','Sem','Luuk','Milan','Levi','Noah','Thijs','Jesse','Bram','Lars','Ruben','Finn','Sven','Jens','Stijn','Teun','Max','Joep','Koen','Siem'],v:['Emma','Julia','Sophie','Tess','Zoë','Lotte','Sara','Eva','Fleur','Anna','Noor','Lieke','Iris','Femke','Roos','Sanne','Mila','Isa','Fenna','Liv'],l:['de Jong','Jansen','de Vries','van den Berg','Bakker','Visser','Smit','Meijer','de Boer','Mulder','Bos','Vos','Peters','Hendriks','Dekker','van Dijk','Kok','Verhoeven','Janssens','Willems','van Leeuwen','Brouwer','de Graaf','Kuipers']},
en:{m:['James','Oliver','Jack','Harry','Noah','Liam','Ethan','Lucas','Mason','Logan','Henry','Leo','Charlie','Theo'],v:['Olivia','Emma','Ava','Sophia','Isla','Mia','Grace','Chloe','Lily','Ella','Amelia','Zoe','Ruby','Freya'],l:['Smith','Johnson','Williams','Brown','Taylor','Davies','Wilson','Evans','Miller','Clarke','Walker','Wright','Hughes','Turner']},
de:{m:['Lukas','Leon','Felix','Paul','Jonas','Maximilian','Ben','Elias','Finn','Moritz'],v:['Mia','Hannah','Lena','Lea','Marie','Laura','Lina','Clara','Emilia','Johanna'],l:['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Hoffmann','Koch']},
fr:{m:['Lucas','Hugo','Louis','Gabriel','Arthur','Jules','Raphaël','Léo','Nathan','Théo'],v:['Léa','Chloé','Manon','Camille','Inès','Jade','Louise','Alice','Lina','Zoé'],l:['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau']},
it:{m:['Leonardo','Francesco','Alessandro','Lorenzo','Mattia','Andrea','Gabriele','Matteo','Tommaso','Riccardo'],v:['Sofia','Giulia','Aurora','Alice','Ginevra','Emma','Giorgia','Greta','Beatrice','Chiara'],l:['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco']},
es:{m:['Hugo','Mateo','Martín','Lucas','Leo','Daniel','Alejandro','Pablo','Manuel','Diego'],v:['Lucía','Sofía','Martina','María','Julia','Paula','Valeria','Emma','Daniela','Carla'],l:['García','Fernández','González','Rodríguez','López','Martínez','Sánchez','Pérez','Gómez','Ruiz']},
pt:{m:['Miguel','Arthur','Gael','Heitor','Theo','Davi','Gabriel','Bernardo','Samuel','João'],v:['Helena','Alice','Laura','Maria','Valentina','Heloísa','Manuela','Júlia','Sophia','Isabella'],l:['Silva','Santos','Oliveira','Souza','Rodrigues','Ferreira','Alves','Pereira','Lima','Gomes']},
jp:{m:['Haruto','Sota','Yuto','Riku','Ren','Hinata','Takumi','Kaito','Yamato','Sora'],v:['Yui','Hina','Sakura','Mei','Aoi','Rin','Yuna','Koharu','Mio','Akari'],l:['Sato','Suzuki','Takahashi','Tanaka','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi','Kato']},
tr:{m:['Yusuf','Eymen','Ömer','Mustafa','Emir','Ali','Kerem','Mehmet','Ahmet','Can'],v:['Zeynep','Elif','Defne','Ecrin','Asel','Azra','Ela','Nehir','Meryem','Ayşe'],l:['Yılmaz','Kaya','Demir','Şahin','Çelik','Yıldız','Öztürk','Aydın','Arslan','Doğan']},
ar:{m:['Mohamed','Youssef','Adam','Amine','Rayan','Omar','Ilyas','Hamza','Karim','Mehdi'],v:['Fatima','Yasmine','Salma','Aya','Inès','Nour','Sara','Lina','Malak','Imane'],l:['El Amrani','Benali','Alaoui','Idrissi','Bennani','Tazi','Chraibi','El Fassi','Berrada','Lahlou']},
id:{m:['Budi','Agus','Rizky','Dimas','Fajar','Arif','Bayu','Eko','Joko','Putra'],v:['Siti','Dewi','Putri','Ayu','Rina','Sri','Nur','Indah','Wulan','Maya'],l:['Santoso','Wijaya','Saputra','Pratama','Hidayat','Kusuma','Setiawan','Nugroho','Lestari','Gunawan']}
};
// k = weergavefactor (lokale valuta per "NL-euro" koopkracht), rate = echte wisselkoers t.o.v. euro
const COUNTRIES={
NL:{n:'Nederland',r:'nl',cur:'€',k:1,rate:1,cities:['Amsterdam','Rotterdam','Den Haag','Utrecht','Eindhoven','Groningen','Maastricht','Breda','Zwolle','Nijmegen','Haarlem','Tilburg']},
BE:{n:'België',r:'nl',cur:'€',k:.95,rate:1,cities:['Antwerpen','Gent','Brussel','Leuven','Brugge','Hasselt']},
DE:{n:'Duitsland',r:'de',cur:'€',k:1,rate:1,cities:['Berlijn','München','Hamburg','Keulen','Düsseldorf','Aken']},
UK:{n:'Verenigd Koninkrijk',r:'en',cur:'£',k:.86,rate:.86,cities:['Londen','Manchester','Liverpool','Edinburgh','Bristol']},
US:{n:'Verenigde Staten',r:'en',cur:'$',k:1.3,rate:1.1,cities:['New York','Los Angeles','Chicago','Miami','Austin','Seattle']},
CA:{n:'Canada',r:'en',cur:'C$',k:1.5,rate:1.5,cities:['Toronto','Vancouver','Montreal','Calgary']},
FR:{n:'Frankrijk',r:'fr',cur:'€',k:.9,rate:1,cities:['Parijs','Lyon','Marseille','Nice','Bordeaux']},
IT:{n:'Italië',r:'it',cur:'€',k:.75,rate:1,cities:['Rome','Milaan','Napels','Florence','Bologna','Ancona']},
ES:{n:'Spanje',r:'es',cur:'€',k:.7,rate:1,cities:['Madrid','Barcelona','Valencia','Sevilla','Málaga']},
AU:{n:'Australië',r:'en',cur:'A$',k:1.7,rate:1.65,cities:['Sydney','Melbourne','Brisbane','Perth']},
JP:{n:'Japan',r:'jp',cur:'¥',k:110,rate:160,cities:['Tokio','Osaka','Kyoto','Sapporo','Fukuoka']},
BR:{n:'Brazilië',r:'pt',cur:'R$',k:1.6,rate:6,cities:['São Paulo','Rio de Janeiro','Salvador','Brasília']},
MX:{n:'Mexico',r:'es',cur:'MX$',k:5,rate:20,cities:['Mexico-Stad','Guadalajara','Monterrey','Cancún']},
ZA:{n:'Zuid-Afrika',r:'en',cur:'R',k:6,rate:20,cities:['Kaapstad','Johannesburg','Durban']},
TR:{n:'Turkije',r:'tr',cur:'₺',k:12,rate:38,cities:['Istanbul','Ankara','Izmir','Antalya']},
MA:{n:'Marokko',r:'ar',cur:'DH',k:3.5,rate:11,cities:['Casablanca','Marrakech','Rabat','Tanger']},
ID:{n:'Indonesië',r:'id',cur:'Rp',k:4500,rate:17000,cities:['Jakarta','Denpasar','Surabaya','Bandung']}
};
const ERANK={none:0,basis:1,vmbo:2,havo:3,vwo:3,mbo:4,hbo:5,wo:6,master:7,phd:8};
const ENAME={vmbo:'vmbo',havo:'havo',vwo:'vwo',mbo:'mbo',hbo:'hbo',wo:'universitaire bachelor',master:'master',phd:'promotie'};
const STUDIES=[
{id:'informatica',t:'Informatica',ty:['mbo','hbo','wo'],sk:'tech'},
{id:'bedrijfskunde',t:'Bedrijfskunde',ty:['mbo','hbo','wo'],sk:'zaken'},
{id:'economie',t:'Economie',ty:['hbo','wo'],sk:'zaken'},
{id:'rechten',t:'Rechten',ty:['hbo','wo'],sk:'sociaal'},
{id:'geneeskunde',t:'Geneeskunde',ty:['wo'],len:6,sm:62},
{id:'psychologie',t:'Psychologie',ty:['hbo','wo'],sk:'sociaal'},
{id:'verpleeg',t:'Verpleegkunde',ty:['mbo','hbo']},
{id:'hotel',t:'Hotelmanagement',ty:['mbo','hbo'],sk:'sociaal'},
{id:'communicatie',t:'Communicatie',ty:['mbo','hbo','wo'],sk:'sociaal'},
{id:'techniek',t:'Werktuigbouwkunde',ty:['mbo','hbo','wo'],sk:'tech'},
{id:'bouwkunde',t:'Bouwkunde',ty:['mbo','hbo','wo']},
{id:'leraar',t:'Lerarenopleiding',ty:['hbo']},
{id:'kunst',t:'Kunstacademie',ty:['hbo'],sk:'kunst'},
{id:'journalistiek',t:'Journalistiek',ty:['hbo']},
{id:'biologie',t:'Biologie',ty:['wo']},
{id:'koken',t:'Koksopleiding',ty:['mbo'],sk:'koken'},
{id:'elektro',t:'Elektrotechniek',ty:['mbo','hbo'],sk:'tech'},
{id:'kapper',t:'Kappersopleiding',ty:['mbo'],sk:'kunst'},
{id:'politie',t:'Politieacademie',ty:['mbo'],clean:1},
{id:'sport',t:'Sportkunde',ty:['mbo','hbo'],sk:'sport'},
{id:'muziek',t:'Conservatorium',ty:['hbo'],sk:'muziek'}
];
const SKN={sport:'Sport',muziek:'Muziek',koken:'Koken',tech:'Techniek',zaken:'Ondernemen',kunst:'Creativiteit',sociaal:'Sociaal'};
/* req: e = min opleidingsniveau, f = vereiste studierichting, sm/lk = slimheid/uiterlijk, sk=[skill,min], alt=[skill,min] omzeilt e/f, clean = geen strafblad, lic = rijbewijs */
const JOBS=[
{id:'krant',lad:['Krantenbezorger'],sal:[2],req:{age:[12,99]},part:1},
{id:'oppas',lad:['Oppas'],sal:[3.5],req:{age:[13,99]},part:1},
{id:'vakken',lad:['Vakkenvuller','Teamleider winkel'],sal:[6,8],req:{age:[15,99]},part:1},
{id:'kassa',lad:['Kassamedewerker'],sal:[6],req:{age:[15,99]},part:1},
{id:'afwas',lad:['Afwasser','Hulpkok'],sal:[6,8],req:{age:[15,99]},part:1,sk:'koken'},
{id:'bezorg',lad:['Maaltijdbezorger'],sal:[7],req:{age:[16,99]},part:1},
{id:'bedien',lad:['Bediening','Shiftleider'],sal:[8,10],req:{age:[16,99]},part:1,sk:'sociaal'},
{id:'schoon',lad:['Schoonmaker','Teamleider schoonmaak','Facilitair manager'],sal:[23,30,48],req:{age:[18,99]}},
{id:'magazijn',lad:['Magazijnmedewerker','Heftruckchauffeur','Teamleider logistiek','Logistiek manager'],sal:[25,29,38,56],req:{age:[18,99]}},
{id:'call',lad:['Klantenservicemedewerker','Teamcoach','Manager klantenservice'],sal:[25,33,52],req:{age:[18,99],e:2},sk:'sociaal'},
{id:'bouw',lad:['Bouwvakker','Voorman','Uitvoerder','Projectleider bouw'],sal:[31,38,50,70],req:{age:[18,99]},sk:'sport'},
{id:'kok',lad:['Hulpkok','Kok','Souschef','Chef-kok','Sterrenchef'],sal:[25,31,40,58,115],req:{age:[18,99]},sk:'koken',bonus:['koken']},
{id:'beveil',lad:['Beveiliger','Senior beveiliger','Hoofd beveiliging'],sal:[28,34,52],req:{age:[18,99],clean:1},sk:'sport'},
{id:'hotel',lad:['Receptionist','Reserveringsmedewerker','Front office manager','Hotelmanager','Regiodirecteur hotels'],sal:[27,31,42,75,135],req:{age:[18,99],e:2},sk:'sociaal',bonus:['hotel']},
{id:'taxi',lad:['Taxichauffeur','Privéchauffeur'],sal:[30,42],req:{age:[21,99],lic:1}},
{id:'vracht',lad:['Vrachtwagenchauffeur','Planner transport','Transportmanager'],sal:[36,45,62],req:{age:[21,99],lic:1}},
{id:'soldaat',lad:['Soldaat','Sergeant','Luitenant','Kolonel','Generaal'],sal:[28,36,50,85,150],req:{age:[18,40],e:2,clean:1},sk:'sport'},
{id:'sales',lad:['Accountmanager','Senior accountmanager','Salesmanager','Sales director'],sal:[38,52,75,155],req:{age:[18,99],e:2,sm:40},sk:'sociaal',bonus:['bedrijfskunde','economie','communicatie']},
{id:'makelaar',lad:['Makelaar','Senior makelaar','Kantoorhouder'],sal:[40,60,115],req:{age:[20,99],e:4},sk:'sociaal'},
{id:'verpleeg',lad:['Verzorgende','Verpleegkundige','Senior verpleegkundige','Teamleider zorg'],sal:[30,38,48,62],req:{age:[18,99],e:4,f:['verpleeg']}},
{id:'elektro',lad:['Elektricien','Senior elektricien','Installatiemanager'],sal:[33,42,60],req:{age:[18,99],e:4,f:['elektro','techniek']},sk:'tech'},
{id:'monteur',lad:['Automonteur','Eerste monteur','Werkplaatschef'],sal:[30,38,50],req:{age:[18,99],e:4,f:['techniek','elektro']},sk:'tech'},
{id:'kapper',lad:['Kapper','Senior stylist','Salonmanager'],sal:[24,32,42],req:{age:[18,99],e:4,f:['kapper']},sk:'kunst'},
{id:'politie',lad:['Agent','Brigadier','Inspecteur','Hoofdcommissaris'],sal:[35,45,62,125],req:{age:[18,60],e:4,f:['politie'],clean:1,sm:40}},
{id:'leraar',lad:['Docent','Senior docent','Teamleider','Rector'],sal:[42,52,62,98],req:{age:[21,99],e:5,f:['leraar']},sk:'sociaal'},
{id:'marketing',lad:['Marketingmedewerker','Marketeer','Marketingmanager','CMO'],sal:[36,48,72,145],req:{age:[20,99],e:5,f:['communicatie','bedrijfskunde','economie']},sk:'kunst'},
{id:'accountant',lad:['Assistent-accountant','Accountant','Senior accountant','Partner accountantskantoor'],sal:[40,55,82,230],req:{age:[21,99],e:5,f:['economie','bedrijfskunde'],sm:55}},
{id:'dev',lad:['Junior developer','Developer','Senior developer','Lead developer','CTO'],sal:[40,55,72,95,165],req:{age:[18,99],e:5,f:['informatica']},alt:['tech',65],sk:'tech'},
{id:'designer',lad:['Junior designer','Designer','Art director','Creative director'],sal:[34,45,65,115],req:{age:[18,99],e:5,f:['kunst','communicatie']},alt:['kunst',70],sk:'kunst'},
{id:'journalist',lad:['Verslaggever','Journalist','Hoofdredacteur'],sal:[33,48,98],req:{age:[20,99],e:5,f:['journalistiek','communicatie']}},
{id:'hr',lad:['HR-adviseur','HR-manager','HR-directeur'],sal:[40,64,125],req:{age:[21,99],e:5,f:['psychologie','bedrijfskunde']},sk:'sociaal'},
{id:'architect',lad:['Junior architect','Architect','Partner architectenbureau'],sal:[42,62,145],req:{age:[22,99],e:5,f:['bouwkunde']},sk:'kunst'},
{id:'ingenieur',lad:['Ingenieur','Senior ingenieur','Technisch directeur'],sal:[50,72,145],req:{age:[21,99],e:6,f:['techniek','elektro']},sk:'tech'},
{id:'advocaat',lad:['Advocaat-stagiair','Advocaat','Senior advocaat','Partner advocatenkantoor'],sal:[52,78,125,360],req:{age:[22,99],e:6,f:['rechten'],clean:1,sm:60},sk:'sociaal'},
{id:'rechter',lad:['Rechter-plaatsvervanger','Rechter','President van de rechtbank'],sal:[78,112,175],req:{age:[30,70],e:7,f:['rechten'],clean:1,sm:70}},
{id:'arts',lad:['Arts-assistent','Huisarts','Medisch specialist','Chirurg'],sal:[62,115,185,270],req:{age:[23,99],e:7,f:['geneeskunde'],clean:1,sm:65}},
{id:'psycholoog',lad:['Psycholoog','GZ-psycholoog','Klinisch psycholoog'],sal:[45,63,88],req:{age:[22,99],e:7,f:['psychologie']},sk:'sociaal'},
{id:'consultant',lad:['Business analyst','Consultant','Manager','Partner consultancy'],sal:[55,76,125,310],req:{age:[21,99],e:6,f:['bedrijfskunde','economie','rechten','techniek','informatica'],sm:62},sk:'zaken'},
{id:'bankier',lad:['Analist','Investment banker','Managing director'],sal:[72,145,480],req:{age:[21,99],e:6,f:['economie','bedrijfskunde'],sm:70},sk:'zaken'},
{id:'wetensch',lad:['Postdoc','Universitair docent','Universitair hoofddocent','Hoogleraar'],sal:[52,68,85,125],req:{age:[24,99],e:8,sm:65}},
{id:'politiek',lad:['Gemeenteraadslid','Wethouder','Tweede Kamerlid','Minister','Minister-president'],sal:[22,98,128,178,198],req:{age:[21,99],e:5,clean:1,sm:55},sk:'sociaal',pol:1},
{id:'muzikant',lad:['Straatmuzikant','Sessiemuzikant','Bekende artiest','Wereldster'],sal:[8,32,260,3200],req:{age:[14,99],sk:['muziek',40]},sk:'muziek',fame:1},
{id:'acteur',lad:['Figurant','Acteur','Filmster'],sal:[12,58,1600],req:{age:[10,99],lk:60},sk:'kunst',fame:1},
{id:'model',lad:['Model','Topmodel'],sal:[30,650],req:{age:[16,35],lk:82},fame:1},
{id:'voetbal',lad:['Profvoetballer (Eerste Divisie)','Profvoetballer (Eredivisie)','Topspeler (Champions League)'],sal:[45,380,8500],req:{age:[16,30],sk:['sport',72]},sk:'sport',fame:1},
{id:'schrijver',lad:['Schrijver','Bestsellerauteur'],sal:[15,320],req:{age:[18,99],sk:['kunst',50],sm:55},sk:'kunst',fame:1}
];
const JOB=id=>JOBS.find(j=>j.id===id);
const BIZ={
foodtruck:{t:'Foodtruck',start:25000,fixed:9000,cogs:.35,rev0:45000,s0:0,cap:80000,wage:30000,g:.04,vol:.15,mult:.6,sk:'koken'},
restaurant:{t:'Restaurant',start:110000,fixed:60000,cogs:.3,rev0:260000,s0:4,cap:75000,wage:28000,g:.03,vol:.14,mult:.7,sk:'koken'},
cafe:{t:'Café',start:80000,fixed:45000,cogs:.3,rev0:200000,s0:3,cap:75000,wage:30000,g:.02,vol:.12,mult:.7,sk:'sociaal'},
webshop:{t:'Webshop',start:6000,fixed:4000,cogs:.55,rev0:25000,s0:0,cap:180000,wage:36000,g:.12,vol:.35,mult:1,sk:'tech'},
saas:{t:'Softwarebedrijf (SaaS)',start:12000,fixed:14000,cogs:.12,rev0:9000,s0:0,cap:170000,wage:62000,g:.75,vol:.7,mult:6,sk:'tech',inv:1},
bouwbedrijf:{t:'Bouwbedrijf',start:45000,fixed:25000,cogs:.55,rev0:180000,s0:2,cap:110000,wage:42000,g:.04,vol:.16,mult:.6,sk:'tech'},
kapsalon:{t:'Kapsalon',start:30000,fixed:22000,cogs:.12,rev0:95000,s0:1,cap:65000,wage:28000,g:.03,vol:.1,mult:.6,sk:'kunst'},
consultancy:{t:'Adviesbureau',start:3000,fixed:6000,cogs:.08,rev0:70000,s0:0,cap:150000,wage:65000,g:.06,vol:.2,mult:1,sk:'zaken'},
hotel:{t:'Boutique hotel',start:2500000,fixed:220000,cogs:.25,rev0:850000,s0:12,cap:70000,wage:32000,g:.03,vol:.12,mult:1.3,sk:'sociaal'},
app:{t:'App-startup',start:8000,fixed:9000,cogs:.1,rev0:2000,s0:0,cap:200000,wage:65000,g:1.2,vol:1.1,mult:8,sk:'tech',inv:1}
};
const BIZPRE=['Noorder','Zuid','Atlas','Nova','Stads','Hollands','Gouden','Blauwe','Tulp','Delta','Polder','Kade','Vonk','Lumen','Brug'];
const BIZSUF={foodtruck:['Bites','Wagen','Smaak'],restaurant:['Keuken','Tafel','Bistro'],cafe:['Kroeg','Hoek','Lokaal'],webshop:['Store','Shop','Goods'],saas:['Labs','Cloud','Soft'],bouwbedrijf:['Bouw','Werken','Bouwgroep'],kapsalon:['Hairstudio','Kapsalon','Knip'],consultancy:['Advies','Partners','Consult'],hotel:['Hotel','Huys','Logement'],app:['App','.io','Mobile']};
const HOUSES=[['Studio',175000],['Starterswoning',245000],['Appartement',310000],['Benedenwoning',360000],['Rijtjeshuis',395000],['Twee-onder-een-kap',540000],['Vrijstaande woning',780000],['Penthouse',1350000],['Boerderij',820000],['Villa',1600000],['Grachtenpand',2100000],['Landgoed',4800000]];
const STREETS=['Lindelaan','Kerkstraat','Molenweg','Stationsstraat','Dorpsstraat','Parklaan','Havenkade','Beukenlaan','Julianastraat','Zonnebloemstraat','Prinsengracht','Bosweg'];
const RENTALS=[['Studentenkamer',6500,'Gedeelde keuken, kleine kamer'],['Studio',11500,'Eigen keuken en badkamer'],['Appartement',16500,'Twee slaapkamers'],['Eengezinswoning',22000,'Met tuin, voor een gezin'],['Luxe penthouse',52000,'Uitzicht over de stad']];
const CARS=[['Tweedehands Fiat Panda',3500],['Volkswagen Golf',33000],['Toyota RAV4 hybride',46000],['Tesla Model 3',44000],['BMW 5-serie',76000],['Range Rover Sport',120000],['Porsche 911',165000],['Ferrari Roma',260000],['Oldtimer Fiat 500',16000,1],['Klassieke Mercedes SL',85000,1]];
const PETS=[['hond',800,[10,15]],['kat',150,[13,19]],['konijn',60,[7,10]],['hamster',25,[2,3]],['papegaai',1200,[30,55]],['paard',6500,[24,30]],['schildpad',90,[40,80]]];
const PETNAMES=['Bobby','Luna','Max','Pip','Kees','Snuffie','Bella','Rocky','Olaf','Mimi','Tijger','Koekie','Bram','Sjakie','Nala','Diesel'];
const COMPANIES=['Van Dijk Groep','Nova Solutions','Hollandia B.V.','Atlas & Partners','Delta Logistiek','Brightway','Noordzee Holding','De Vries & Zn','Tulp Media','Polaris','Stadsbank','Meridian','Kade Groep','Orion Tech'];
const PJOBS={arm:['schoonmaker','vakkenvuller','werkzoekend','magazijnmedewerker','buschauffeur','thuiszorgmedewerker'],midden:['leraar','verpleegkundige','boekhouder','monteur','kok','ambtenaar','IT-er','winkeleigenaar','politieagent'],rijk:['advocaat','chirurg','ondernemer','bankier','notaris','directeur','tandarts']};
const KIDJOBS=['leraar','verpleegkundige','developer','accountant','kok','marketeer','advocaat','huisarts','ondernemer','elektricien','journalist','consultant','kapper','agent','muzikant','architect'];
const INV={spaar:['Spaarrekening',.02,.004],index:['Indexfonds',.07,.15],aandelen:['Losse aandelen',.08,.3],crypto:['Crypto',.14,.8]};
const CRIMES=[
{id:'winkel',t:'Winkeldiefstal',s:'Kleine buit, maar camera\'s hangen overal',a:10,p:.3,gain:[10,250],jail:[0,0],heat:5},
{id:'zak',t:'Zakkenrollen',s:'Snelle handen nodig',a:14,p:.35,gain:[40,900],jail:[1,6],heat:8},
{id:'inbraak',t:'Inbreken',s:'Een huis in een rijke wijk',a:16,p:.4,gain:[600,18000],jail:[6,30],heat:15},
{id:'auto',t:'Auto stelen',s:'Van oud barrel tot sportwagen',a:16,p:.45,gain:[3000,35000],jail:[8,36],heat:18},
{id:'fraude',t:'Belastingfraude',s:'Inkomen verzwijgen',a:18,p:.3,gain:[8000,220000],jail:[12,60],heat:12,c:()=>S.job||S.biz.length},
{id:'bank',t:'Bankoverval',s:'Het grote werk',a:18,p:.55,gain:[25000,600000],jail:[48,144],heat:40}
];
/* plan: [emoji, titel, risico (getal of functie), buit-factor, voorwaarde, minigame] */
const CRIMEPLAN={
winkel:[['🧥','Iets in je jaszak stoppen',1,1],['🛍️','Een grote tas vullen',1.7,3],['🤝','Een vriend leidt het personeel af',.75,1.2,()=>living('vriend').length>0]],
zak:[['🚉','Een toerist op het station',1,1],['🚋','Een zakenman in de tram',1.3,2.2],['🎪','Op een druk festival',.9,1.3]],
inbraak:[['🚪','Overdag via de achterdeur',1,1],['🌙','\'s Nachts met een breekijzer',1.25,1.6,null,1],['🔌','Eerst het alarm uitschakelen (Techniek)',()=>Math.max(.5,1.3-S.sk.tech/100),2,null,1]],
auto:[['🚙','Een oude Golf openbreken',.8,.5],['🏎️','Een sportwagen kortsluiten',1.3,2.2,null,1],['🔑','De sleutel uit een huis vissen',1,1.4]],
fraude:[['💶','Zwart laten betalen',1,1],['🧾','Valse facturen maken',1.35,2.5],['🏝️','Offshore-constructie (Ondernemen 40+)',.8,3,()=>S.sk.zaken>=40]],
bank:[['🔫','Met een nepwapen naar de balie',1.15,.6],['🔐','\'s Nachts de kluis kraken',1,2,null,1],['👥','Met een crew (vriend nodig)',.85,1.3,()=>living('vriend').length>0,1]]
};
/* catalogus: categorie > merk > model [naam, prijs, waardeontwikkeling per jaar] > variant [naam, prijsfactor] */
const CATALOG={
horloges:{n:'Horloges',em:'⌚',lux:1,min:16,ap:-.08,vol:.04,brands:{
 'Casio':[['G-Shock DW-5600',129,-.1],['F-91W',25,-.05],['Edifice',220,-.12]],
 'Seiko':[['Presage Cocktail Time',650],['Prospex Diver',900],['Grand Seiko Snowflake',7200,.01]],
 'TAG Heuer':[['Aquaracer',3400],['Carrera',5900],['Monaco',7200]],
 'Omega':[['Seamaster Diver 300M',6200,-.02],['Speedmaster Moonwatch',7800,.02],['Constellation',7100,-.03]],
 'Rolex':[['Oyster Perpetual',6800,.04],['Datejust',9500,.03],['Submariner',10500,.05],['GMT-Master II',11000,.05],['Daytona',15500,.07],['Day-Date',39000,.04]],
 'Audemars Piguet':[['Code 11.59',32000,-.02],['Royal Oak',38000,.06],['Royal Oak Offshore',45000,.03]],
 'Patek Philippe':[['Calatrava',32000,.03],['Aquanaut',45000,.06],['Nautilus',120000,.08]],
 'Richard Mille':[['RM 035',250000,.05],['RM 11-03',300000,.06]]},
 vars:b=>['Casio','Seiko'].includes(b)?[['Zwart',1],['Zilverkleurig',1.1],['Goudkleurig',1.2]]:[['Staal',1],['Bicolor (staal en goud)',1.45],['Geelgoud',2.4],['Platina',3.6]]},
tassen:{n:'Tassen',em:'👜',lux:1,min:16,ap:-.1,vol:.04,brands:{
 'Michael Kors':[['Jet Set',300],['Mercer',420]],'Gucci':[['GG Marmont',2300],['Dionysus',3100],['Jackie 1961',3400]],
 'Louis Vuitton':[['Speedy 30',1500],['Neverfull MM',1900],['Capucines',6800,.01]],'Chanel':[['Boy Bag',7000,.02],['Classic Flap',10000,.05]],'Hermès':[['Kelly 28',12000,.06],['Birkin 30',25000,.08]]},
 vars:b=>['Chanel','Hermès'].includes(b)?[['Zwart leer',1],['Gold leer',1.05],['Krokodillenleer',4.2]]:[['Zwart',1],['Bruin',1],['Rood',1.05]]},
sieraden:{n:'Sieraden',em:'💍',lux:1,min:16,ap:-.05,vol:.03,brands:{
 'Pandora':[['Bedelarmband',120],['Ring',90]],'Tiffany & Co.':[['Return to Tiffany-ketting',450],['Solitaire-ring',1800],['T-armband',2500]],
 'Cartier':[['Trinity-ring',1900],['Love-armband',7000,.02],['Juste un Clou',8000,.02]],'Van Cleef & Arpels':[['Alhambra-ketting',5500,.03]],'Graff':[['Diamanten oorbellen',45000,.02],['Diamanten halsketting',250000,.02]]},
 vars:b=>b==='Pandora'?[['Zilver',1],['Roségoud',1.6]]:[['Geelgoud',1],['Witgoud',1.1],['Met extra diamanten',2.6]]},
elektronica:{n:'Elektronica',em:'📱',min:10,ap:-.3,vol:.02,brands:{
 'Apple':[['iPhone',1100],['iPad',600],['MacBook Air',1300],['MacBook Pro',2600],['Apple Watch',450],['AirPods Pro',280]],
 'Samsung':[['Galaxy S',1000],['OLED-tv 65 inch',2200]],'Sony':[['PlayStation',550],['Noise-cancelling koptelefoon',350]],'Nintendo':[['Switch',350]]},
 vars:()=>[['Standaard',1],['Meer opslag of groter',1.3]]},
autos:{n:"Auto's",em:'🚗',min:18,brands:{
 'Fiat':[['Panda',16000],['500e',30000]],'Volkswagen':[['Polo',24000],['Golf',33000],['ID.4',45000]],'Toyota':[['Yaris',24000],['RAV4 Hybrid',46000],['Land Cruiser',90000]],
 'Tesla':[['Model 3',44000],['Model Y',50000],['Model S Plaid',115000]],'BMW':[['3-serie',52000],['X5',95000],['M4',110000]],'Mercedes-Benz':[['C-Klasse',55000],['S-Klasse',130000],['G-Klasse',180000]],
 'Audi':[['A4',50000],['RS 6',150000]],'Porsche':[['Macan',85000],['911 Carrera',165000],['911 GT3 RS',290000,.02]],'Ferrari':[['Roma',260000],['SF90 Stradale',480000,.01]],'Lamborghini':[['Huracán',290000],['Revuelto',600000,.01]],
 'Klassiekers':[['Fiat 500L (1971)',16000,.04],['Mercedes 280 SL (1969)',85000,.05],['Porsche 911 (1973)',140000,.06]]},
 vars:b=>b==='Klassiekers'?[['Rijdbaar',1],['Concourstaat',1.6]]:[['Tweedehands',.6],['Nieuw',1],['Volledig uitgerust',1.25]]},
boten:{n:'Boten',em:'🚤',lux:1,min:18,ap:-.08,up:.06,brands:{'Interboat':[['Sloep 6.5',45000]],'Riva':[['Aquarama (klassiek)',400000,.03],['Iseo',650000]],'Beneteau':[['Oceanis 46',380000]],'Feadship':[['Superjacht van 60 meter',90000000]]},vars:()=>[['Tweedehands',.65],['Nieuw',1]]},
vliegtuigen:{n:'Vliegtuigen',em:'✈️',lux:1,min:18,ap:-.06,up:.08,brands:{'Robinson':[['R44 helikopter',500000]],'Cessna':[['172 Skyhawk',450000]],'Pilatus':[['PC-12',5500000]],'Gulfstream':[['G650',60000000]]},vars:()=>[['Tweedehands',.6],['Nieuw',1]]},
kunst:{n:'Kunst',em:'🖼️',lux:1,min:18,ap:.05,vol:.2,brands:{'Galerie om de hoek':[['Schilderij van een lokale kunstenaar',800]],'Veilinghuis':[['Schilderij van een gerenommeerde schilder',60000],['Ets van Rembrandt',350000],['Werk van een moderne meester',2000000]]},vars:()=>[['Origineel',1]]}
};

const ACH=[
['miljonair','Miljonair','Bezit 1 miljoen'],['multi','Multimiljonair','Bezit 10 miljoen'],['eeuw','Eeuweling','Word 100 jaar'],['negentig','Taai','Word 90 jaar'],
['getrouwd','Ja, ik wil','Trouw met je grote liefde'],['gezin','Groot gezin','Krijg 4 of meer kinderen'],['opa','Grootouder','Krijg een kleinkind'],
['top','Aan de top','Bereik het hoogste niveau in een beroep'],['arts','Dokter','Word arts'],['premier','Het Torentje','Word minister-president'],['kamerlid','Volksvertegenwoordiger','Word gekozen in het parlement of het Congres'],['wetgever','Wetgever','Krijg een eigen wet aangenomen'],['eigenpartij','Eigen koers','Haal zetels met je eigen partij'],['premier3','Drie kabinetten','Word drie keer minister-president'],['overleefd','Overlevingskunstenaar','Overleef een motie van wantrouwen'],['burgemeester','Ambtsketen','Word burgemeester'],['draaideur','Draaideur','Word lobbyist na de politiek'],['commando','Groene baret','Haal de commandoselectie'],['piloot','Top Gun','Word gevechtspiloot'],['generaal','Sterren op je schouders','Word generaal of admiraal'],['cds','Hoogste militair','Word Commandant der Strijdkrachten'],['willemsorde','Ridder MWO','Ontvang de Militaire Willems-Orde'],['veteraan','Veteraan','Ga op uitzending'],['oorlogsvet','Oorlogsveteraan','Vecht mee in een oorlog'],['vredestichter','Vredestichter','Beëindig een oorlog met diplomatie'],['verzet','Verzetsheld','Krijg het Verzetsherdenkingskruis'],['bevrijd','Bevrijd','Overleef een bezetting en beleef de bevrijding'],['dictator','Dictator','Grijp de macht in een staatsgreep'],['dynastie','Dynastie','Erf de macht van je ouder'],['aanslag','Onverwoestbaar','Overleef een aanslag of paleiscoup'],['vreedzaam','Vreedzame overdracht','Geef de macht vrijwillig op'],['gevlucht','Met de noorderzon','Vlucht met de schatkist naar het buitenland'],['veroveraar','Veroveraar','Neem als dictator een ander land over'],['wereldrijk','Wereldrijk','Heers over drie veroverde landen'],['uspres','Leider van de vrije wereld','Word president van de Verenigde Staten'],['pres2','Vier jaar extra','Word herkozen als president van de VS'],['ussen','Senator','Word senator in de VS'],['usgov','Gouverneur','Word gouverneur van een Amerikaanse staat'],['ecwin','Het kiescollege','Win het presidentschap met minder stemmen dan je tegenstander'],['impeach','Impeachment','Krijg een impeachmentprocedure tegen je'],['afgezet','Afgezet','Word als president afgezet door de Senaat'],['wpres','Het presidentschap','Win een presidentsverkiezing buiten de VS'],['ster','Wereldster','Word wereldster als muzikant'],
['ondernemer','Ondernemer','Start een bedrijf'],['exit','Exit','Verkoop een bedrijf voor 1 miljoen of meer'],['beroemd','Beroemd','Bereik 1 miljoen volgers'],
['academicus','Academicus','Haal een universitair diploma'],['doctor','Doctor','Promoveer'],['huis','Huizenbezitter','Koop een huis'],['vastgoed','Vastgoedmagnaat','Bezit 5 panden tegelijk'],
['wereld','Wereldburger','Emigreer naar een ander land'],['bajes','Achter de tralies','Beland in de gevangenis'],['ontsnapt','Ontsnapt','Ontsnap uit de gevangenis'],
['jackpot','Jackpot','Win de hoofdprijs in de loterij'],['heilig','Goed mens','Sluit je leven af met heel veel karma'],['dieren','Dierenvriend','Heb 3 of meer huisdieren gehad'],['dynastie','Dynastie','Speel 3 generaties']
];
const INTERVIEW=[
['Waarom wil je hier werken?',[['Ik geloof in wat jullie doen en wil hier groeien.',2],['Ik heb gewoon geld nodig.',0],['Het leek me wel wat.',1]]],
['Wat is je grootste zwakte?',[['Ik wil alles zelf doen, maar ik leer te delegeren.',2],['Ik kom vaak te laat.',0],['Daar heb ik eigenlijk geen last van.',1]]],
['Waar zie je jezelf over vijf jaar?',[['In een rol met meer verantwoordelijkheid, hier.',2],['Op uw stoel.',1],['Op een strand op Bali.',0]]],
['Vertel eens over een conflict met een collega.',[['Ik zocht het gesprek en we vonden samen een oplossing.',2],['Ik heb hem overal geblokkeerd.',0],['Ik ga conflicten liever uit de weg.',1]]],
['Wat weet je van ons bedrijf?',[['Ik heb jullie jaarverslag en het laatste nieuws gelezen.',2],['Jullie hebben een mooie website.',1],['Wat doen jullie ook alweer?',0]]],
['Wat zijn je salariswensen?',[['Marktconform, passend bij mijn ervaring.',2],['Het dubbele van wat jullie bieden.',0],['Maakt me niet zoveel uit.',1]]],
['Waarom zouden we jou aannemen?',[['Ik combineer de juiste ervaring met veel inzet.',2],['Omdat ik het verdien.',1],['Mijn moeder zegt dat ik geweldig ben.',0]]],
['Hoe ga je om met stress?',[['Ik plan vooruit en neem bewust rust.',2],['Ik huil op de wc.',0],['Ik werk gewoon nog harder.',1]]],
['Wat doe je als je een fout maakt?',[['Ik meld het meteen en los het op.',2],['Ik hoop dat niemand het merkt.',0],['Ik schuif het door naar een collega.',0]]]
];
const MONTHS=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

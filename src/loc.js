/* ================= BUITENLAND (verbeterplan 6) =================
   LOC[land] bevat wat per land anders heet. loc(sleutel) zoekt eerst in het land van de speler,
   valt in Nederland terug op LOC.NL (de oorspronkelijke teksten) en elders op LOC._ (internationaal).
   Interne waarden (zoals 'vmbo' als niveau) blijven hetzelfde; alleen wat de speler leest verandert. */
const LOC={
 NL:{lang:'Nederlands',lvl:{vmbo:'vmbo',havo:'havo',vwo:'vwo',mbo:'mbo',hbo:'hbo',wo:'universiteit'},toets:'Eindtoets',
   pens:'AOW-leeftijd',zorgEig:'eigen risico in de zorg',gov:'kabinet',
   fest:[['🎸','Pinkpop','Rock en pop'],['🌾','Lowlands','Alternatief en indie'],['🪩','Mysteryland','Dance en techno']],zaal:'de Ziggo Dome',
   clubs:['Feyenoord','Ajax','PSV','FC Utrecht','AZ','FC Twente'],
   army:{land:'Koninklijke Landmacht',zee:'Koninklijke Marine',lucht:'Koninklijke Luchtmacht',mp:'Koninklijke Marechaussee'}},
 _:{lang:'de landstaal',lvl:{vmbo:'vakschool',havo:'algemene school',vwo:'gymnasium',mbo:'beroepsopleiding',hbo:'hogeschool',wo:'universiteit'},toets:'Schooltoets',
   pens:'pensioenleeftijd',zorgEig:'eigen bijdrage in de zorg',gov:'regering',
   fest:[['🎸','Een groot rockfestival','Rock en pop'],['🌾','Een indiefestival','Alternatief en indie'],['🪩','Een dancefestival','Dance en techno']],zaal:'het nationale stadion',
   clubs:['de stadsclub','de rivaal uit de hoofdstad','de kampioen','de promovendus'],
   army:{land:'Landmacht',zee:'Marine',lucht:'Luchtmacht',mp:'Militaire politie'}},
 US:{lang:'Engels',lang2:'Spaans',lvl:{vmbo:'vocational high school',havo:'high school',vwo:'honors high school',mbo:'community college',hbo:'college',wo:'universiteit'},toets:'Toets',
   pens:'pensioenleeftijd',gov:'regering',fest:[['🎸','Lollapalooza','Rock en pop'],['🌵','Coachella','Pop, indie en hiphop'],['🪩','Ultra Miami','Dance en techno']],zaal:'Madison Square Garden',
   clubs:['New York Yankees','Boston Red Sox','Los Angeles Dodgers','Chicago Cubs'],army:{land:'US Army',zee:'US Navy',lucht:'US Air Force',mp:'Military Police'}},
 UK:{lang:'Engels',lang2:'Frans',lvl:{vmbo:'vocational school',havo:'GCSE',vwo:'A-levels',mbo:'college',hbo:'polytechnic',wo:'universiteit'},
   fest:[['🎸','Glastonbury','Rock en pop'],['📖','Reading Festival','Alternatief en indie'],['🪩','Creamfields','Dance en techno']],zaal:'Wembley',
   clubs:['Manchester United','Liverpool','Arsenal','Chelsea'],army:{land:'British Army',zee:'Royal Navy',lucht:'Royal Air Force',mp:'Royal Military Police'}},
 DE:{lang:'Duits',lvl:{vmbo:'Hauptschule',havo:'Realschule',vwo:'Gymnasium',mbo:'Berufsschule',hbo:'Fachhochschule',wo:'universiteit'},
   fest:[['🎸','Rock am Ring','Rock en pop'],['🤘','Wacken Open Air','Metal'],['🪩','Love Parade','Dance en techno']],zaal:'de Lanxess Arena',
   clubs:['Bayern München','Borussia Dortmund','RB Leipzig','Bayer Leverkusen'],army:{land:'Heer',zee:'Marine',lucht:'Luftwaffe',mp:'Feldjäger'}},
 BE:{lang:'Nederlands',lang2:'Frans',lvl:{vmbo:'bso',havo:'tso',vwo:'aso',mbo:'HBO5',hbo:'hogeschool',wo:'universiteit'},
   fest:[['🎸','Rock Werchter','Rock en pop'],['🌾','Pukkelpop','Alternatief en indie'],['🪩','Tomorrowland','Dance en techno']],zaal:'het Sportpaleis',
   clubs:['Club Brugge','RSC Anderlecht','KRC Genk','Standard Luik'],army:{land:'Landcomponent',zee:'Marinecomponent',lucht:'Luchtcomponent',mp:'Militaire politie'}},
 FR:{lang:'Frans',lvl:{vmbo:'lycée professionnel',havo:'lycée technologique',vwo:'lycée général',mbo:'BTS',hbo:'IUT',wo:'université'},
   fest:[['🎸','Les Vieilles Charrues','Rock en pop'],['🌾','Rock en Seine','Alternatief en indie'],['🪩','Solidays','Pop en dance']],zaal:'het Stade de France',
   clubs:['Paris Saint-Germain','Olympique Marseille','Olympique Lyon','AS Monaco'],army:{land:'Armée de terre',zee:'Marine nationale',lucht:'Armée de l\'air',mp:'Gendarmerie'}},
 ES:{lang:'Spaans',lvl:{vmbo:'FP básica',havo:'ESO',vwo:'bachillerato',mbo:'FP grado medio',hbo:'FP grado superior',wo:'universiteit'},
   fest:[['🎸','Mad Cool','Rock en pop'],['🌾','Primavera Sound','Alternatief en indie'],['🪩','Sónar','Dance en techno']],zaal:'het Santiago Bernabéu',
   clubs:['Real Madrid','FC Barcelona','Atlético Madrid','Sevilla'],army:{land:'Ejército de Tierra',zee:'Armada',lucht:'Ejército del Aire',mp:'Guardia Civil'}},
 IT:{lang:'Italiaans',clubs:['Juventus','Inter','AC Milan','AS Roma'],zaal:'de Arena di Verona'},
 JP:{lang:'Japans',clubs:['Yomiuri Giants','Hanshin Tigers','Urawa Reds','Kashima Antlers'],zaal:'de Tokyo Dome',army:{land:'Landzelfverdedigingsmacht',zee:'Maritieme zelfverdedigingsmacht',lucht:'Luchtzelfverdedigingsmacht',mp:'Militaire politie'}},
 BR:{lang:'Portugees',clubs:['Flamengo','Corinthians','Palmeiras','São Paulo'],zaal:'het Maracanã'},
 MX:{lang:'Spaans',clubs:['Club América','Chivas','Cruz Azul','Pumas'],zaal:'het Estadio Azteca'},
 CA:{lang:'Engels',lang2:'Frans',clubs:['Toronto Maple Leafs','Montreal Canadiens','Edmonton Oilers','Vancouver Canucks'],zaal:'de Scotiabank Arena'},
 AU:{lang:'Engels',lang2:'Japans',clubs:['Collingwood','Richmond','Sydney Swans','West Coast Eagles'],zaal:'de Melbourne Cricket Ground'},
 ZA:{lang:'Engels',lang2:'Afrikaans',clubs:['Kaizer Chiefs','Orlando Pirates','Mamelodi Sundowns','SuperSport United'],zaal:'het FNB Stadium'},
 TR:{lang:'Turks',clubs:['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor'],zaal:'het Atatürk Olympisch Stadion'},
 MA:{lang:'Arabisch',lang2:'Frans',clubs:['Raja Casablanca','Wydad Casablanca','FAR Rabat','RS Berkane'],zaal:'het Stade Mohammed V'},
 ID:{lang:'Indonesisch',clubs:['Persija Jakarta','Persib Bandung','Arema','Bali United'],zaal:'het Gelora Bung Karno'}};
const ADJ={BE:'Belgische',DE:'Duitse',FR:'Franse',ES:'Spaanse',US:'Amerikaanse',UK:'Britse',IT:'Italiaanse',JP:'Japanse',BR:'Braziliaanse',MX:'Mexicaanse',CA:'Canadese',AU:'Australische',ZA:'Zuid-Afrikaanse',TR:'Turkse',MA:'Marokkaanse',ID:'Indonesische'};
const locCC=()=>(S&&S.p&&S.p.country)||'NL';
function loc(k){const cc=locCC(),L=LOC[cc];if(L&&k in L)return L[k];return cc==='NL'?LOC.NL[k]:LOC._[k]}
// naam van een schoolniveau of opleiding in het land van de speler
function lvlN(x){if(!x)return x;const t=loc('lvl')||{};return t[x]||x}
// naam van een vak: 'Nederlands' wordt de landstaal; is dat Engels, dan wordt 'Engels' de tweede taal
function subjName(k){if(locCC()==='NL')return k;const lang=loc('lang');if(k==='Nederlands')return lang==='de landstaal'?'Taal':lang;if(k==='Engels'&&lang==='Engels')return loc('lang2')||'Frans';return k}
// typisch Nederlandse quizvragen buiten Nederland weglaten en aanvullen met algemene vragen
const NLQ=/Nederland|Willem van Oranje|\bVOC\b|provincie|Den Haag|Amsterdam|Rotterdam|Utrecht|Elfsteden|Afsluitdijk|Deltawerken|Sinterklaas|Koningsdag/;
const QBW={Wereldoriëntatie:[['Wat is de grootste oceaan?',['De Grote Oceaan','De Atlantische Oceaan','De Indische Oceaan','De Noordelijke IJszee']],['Op welk continent ligt Egypte?',['Afrika','Azië','Europa','Zuid-Amerika']],['Wat is de hoofdstad van Japan?',['Tokio','Osaka','Kyoto','Seoul']],['Welke rivier is de langste van de wereld?',['De Nijl','De Rijn','De Donau','De Theems']],['Hoeveel continenten zijn er?',['7','5','6','8']],['Wat is de hoogste berg ter wereld?',['De Mount Everest','De Mont Blanc','De Kilimanjaro','De Matterhorn']],['Welk land heeft de meeste inwoners?',['India','Rusland','Brazilië','Canada']],['Waar ligt de Sahara?',['In Afrika','In Australië','In Azië','In Zuid-Amerika']]],
 Geschiedenis:[['Wie was de eerste mens op de maan?',['Neil Armstrong','Joeri Gagarin','Buzz Aldrin','John Glenn']],['Welke muur viel in 1989?',['De Berlijnse Muur','De Chinese Muur','De Muur van Hadrianus','De Klaagmuur']],['Wie schilderde de Mona Lisa?',['Leonardo da Vinci','Michelangelo','Rembrandt','Picasso']],['In welk land stonden de piramiden van Gizeh?',['Egypte','Mexico','Griekenland','Irak']],['Wie ontdekte in 1492 Amerika voor Europa?',['Columbus','Magellaan','Vasco da Gama','Cook']],['Wat was de Koude Oorlog?',['Een spanning tussen de VS en de Sovjet-Unie','Een oorlog op de Noordpool','Een winteroorlog in Finland','Een handelsconflict met China']],['Welk rijk bouwde de Colosseum?',['Het Romeinse Rijk','Het Griekse Rijk','Het Ottomaanse Rijk','Het Perzische Rijk']]]};
function quizPool(sub){const pool=QB[sub]||[];if(locCC()==='NL')return pool;return pool.filter(q=>!NLQ.test(q[0]+' '+q[1].join(' '))).concat(QBW[sub]||[])}
// militaire onderdelen
function armyN(k){const a=loc('army')||LOC._.army;return a[k]||LOC._.army[k]}

// tekstfilter voor alles wat de speler leest (logboek, pop-ups, rijen en kaarten): buiten Nederland neutrale termen
const LOCREP=[[/\bHet nieuwe kabinet\b/g,'De nieuwe regering'],[/\bhet nieuwe kabinet\b/g,'de nieuwe regering'],[/\bHet kabinet\b/g,'De regering'],[/\bhet kabinet\b/g,'de regering'],[/\bKabinet\b/g,'Regering'],[/\bkabinet\b/g,'regering'],
 [/AOW-leeftijd/g,'pensioenleeftijd'],[/\bAOW\b/g,'staatspensioen'],[/eigen risico/g,'eigen bijdrage'],[/Prinsjesdag/g,'Begrotingsdag'],[/\bgroep 8\b/g,'het laatste jaar van de basisschool'],[/Ziggo Dome/g,()=>loc('zaal').replace(/^(de|het) /,'')],
 [/Mbo, hbo of universiteit/g,()=>cap(`${lvlN('mbo')}, ${lvlN('hbo')} of ${lvlN('wo')}`)],[/Mbo, hbo, universiteit/g,()=>cap(`${lvlN('mbo')}, ${lvlN('hbo')}, ${lvlN('wo')}`)],
 [/\bNederlandse\b/g,()=>ADJ[locCC()]||'nationale'],[/\bNederlands\b/g,()=>{const l=loc('lang');return l==='de landstaal'?'de taal':l}],[/\bin Den Haag\b/g,'in de hoofdstad'],[/\bDen Haag\b/g,'de hoofdstad'],[/\bNederland\b/g,()=>COUNTRIES[locCC()]?COUNTRIES[locCC()].n:'het land'],[/\b(vmbo|havo|vwo|mbo|hbo)\b/g,m=>lvlN(m)],[/\b(Vmbo|Havo|Vwo|Mbo|Hbo)\b/g,m=>cap(lvlN(m.toLowerCase()))],[/De eindtoets/g,'De grote toets'],[/Eindtoets/g,()=>loc('toets')],[/eindtoets/g,'toets'],[/Pinkpop, Lowlands, Tomorrowland/g,()=>festSub()],
 [/Hollandia B\.V\./g,'Highland Group'],[/ B\.V\./g,' Ltd.'],[/Noordzee Holding/g,'Northsea Holding'],[/De Vries & Zn/g,'Vries & Sons'],[/Tulp Media/g,'Tulip Media'],[/Van Dijk Groep/g,'Van Dyke Group'],[/Kade Groep/g,'Quay Group'],[/Delta Logistiek/g,'Delta Logistics']];
function locText(t){if(typeof t!=='string'||!t||locCC()==='NL')return t;for(const [re,v] of LOCREP)t=t.replace(re,v);return t}
// instellingen die pas kunnen als alle bestanden geladen zijn (vanuit boot.js)
function locPatch(){
  if(typeof MBR!=='undefined'){const map={land:'land',marine:'zee',lucht:'lucht',kmar:'mp'};for(const [k,b] of Object.entries(MBR)){const nl={k:b.k,n:b.n,school:b.school};
    Object.defineProperty(b,'k',{configurable:true,get(){return locCC()==='NL'?nl.k:armyN(map[k])}});
    Object.defineProperty(b,'n',{configurable:true,get(){return locCC()==='NL'||k!=='kmar'?nl.n:'Militaire politie'}});
    Object.defineProperty(b,'school',{configurable:true,get(){return locCC()==='NL'?nl.school:'de militaire academie'}})}}
}
function festSub(){const f=LOC[locCC()]&&LOC[locCC()].fest;return f?f.map(x=>x[1]).join(', ')+', Tomorrowland':'Rock, indie, dance en Tomorrowland'}
// festivals, voetbalclubs en aandelen per land
function festList(){if(locCC()==='NL')return FESTS;const f=loc('fest');return FESTS.map((x,i)=>i<3&&f[i]?[f[i][0],f[i][1],f[i][2],x[3],x[4]]:x)}
function teamList(){if(locCC()==='NL')return TEAMS;return [...new Set([...loc('clubs'),'Real Madrid','FC Barcelona','Bayern München','Manchester City','Liverpool','Inter'])]}
const NLSTK=['asml','heineken','philips','adyen','ahold'];
const stkHere=id=>locCC()==='NL'||!NLSTK.includes(id)||!!(S.stk&&S.stk[id]);

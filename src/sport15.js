/* ================= FASE 15: sport =================
   Keuze Thijmen: echte namen waar het kan (clubs, competities, toernooien); spelers blijven verzonnen. Alle 16 sporten.
   15.1 competitie en eindstand (ploegsporten) of wereldranglijst (individueel); 15.2 grote momenten: finale, kampioenschap,
   EK/WK en Olympische Spelen, het nationale team; 15.3 zaakwaarnemer; 15.4 na je carrière: trainer, analist of een eigen sportschool;
   15.5 toernooien met echte namen voor individuele sporten. */

// ---------- echte clubs en competities ----------
const RCLUB={
 voetbal:{NL:['Ajax','PSV','Feyenoord','AZ','FC Twente','FC Utrecht','sc Heerenveen','Vitesse'],BE:['Club Brugge','RSC Anderlecht','KRC Genk','Standard Luik','Royal Antwerp','AA Gent'],DE:['Bayern München','Borussia Dortmund','RB Leipzig','Bayer Leverkusen','VfB Stuttgart','Eintracht Frankfurt'],
  UK:['Manchester United','Liverpool','Arsenal','Chelsea','Manchester City','Tottenham Hotspur','Newcastle United'],US:['LA Galaxy','Inter Miami','Seattle Sounders','Atlanta United','New York Red Bulls'],CA:['Toronto FC','CF Montréal','Vancouver Whitecaps'],
  FR:['Paris Saint-Germain','Olympique Marseille','Olympique Lyon','AS Monaco','LOSC Lille'],IT:['Juventus','Inter','AC Milan','AS Roma','SSC Napoli','Lazio'],ES:['Real Madrid','FC Barcelona','Atlético Madrid','Sevilla','Real Sociedad','Valencia'],
  AU:['Sydney FC','Melbourne Victory','Western Sydney Wanderers'],JP:['Urawa Reds','Kashima Antlers','Yokohama F. Marinos','Kawasaki Frontale'],BR:['Flamengo','Corinthians','Palmeiras','São Paulo','Santos'],MX:['Club América','Chivas','Cruz Azul','Tigres UANL'],
  ZA:['Kaizer Chiefs','Orlando Pirates','Mamelodi Sundowns'],TR:['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor'],MA:['Raja Casablanca','Wydad Casablanca','FAR Rabat'],ID:['Persija Jakarta','Persib Bandung','Bali United']},
 basketbal:{US:['Los Angeles Lakers','Boston Celtics','Golden State Warriors','Chicago Bulls','Miami Heat','New York Knicks'],ES:['Real Madrid','FC Barcelona','Baskonia'],TR:['Fenerbahçe','Anadolu Efes'],CA:['Toronto Raptors']},
 americanfootball:{US:['Kansas City Chiefs','Dallas Cowboys','Green Bay Packers','New England Patriots','San Francisco 49ers','Philadelphia Eagles']},
 honkbal:{US:['New York Yankees','Boston Red Sox','Los Angeles Dodgers','Chicago Cubs','San Francisco Giants'],JP:['Yomiuri Giants','Hanshin Tigers','Fukuoka SoftBank Hawks'],MX:['Diablos Rojos del México','Sultanes de Monterrey']},
 ijshockey:{CA:['Toronto Maple Leafs','Montreal Canadiens','Edmonton Oilers','Vancouver Canucks'],US:['New York Rangers','Chicago Blackhawks','Boston Bruins','Detroit Red Wings']},
 hockey:{NL:['Amsterdam','Bloemendaal','Kampong','HC Den Bosch','Oranje-Rood','SV Kampong'],BE:['Royal Léopold','KHC Dragons','Waterloo Ducks']},
 rugby:{UK:['Leicester Tigers','Saracens','Bath Rugby','Harlequins'],FR:['Stade Toulousain','RC Toulon','Stade Français'],ZA:['Stormers','Bulls','Sharks'],AU:['NSW Waratahs','Queensland Reds','Brumbies']},
 cricket:{UK:['Surrey','Yorkshire','Lancashire'],AU:['New South Wales','Victoria','Western Australia'],ZA:['Titans','Lions','Western Province']},
 volleybal:{IT:['Sir Safety Perugia','Itas Trentino','Lube Civitanova'],BR:['Minas Tênis Clube','Sada Cruzeiro'],TR:['Halkbank Ankara','Fenerbahçe']},
 wielrennen:{_:['Visma | Lease a Bike','UAE Team Emirates','INEOS Grenadiers','Soudal Quick-Step','Lidl-Trek','Alpecin-Deceuninck']}};
const LEAGUE={voetbal:{NL:'de Eredivisie',BE:'de Jupiler Pro League',DE:'de Bundesliga',UK:'de Premier League',US:'de MLS',CA:'de MLS',FR:'de Ligue 1',IT:'de Serie A',ES:'LaLiga',AU:'de A-League',JP:'de J1 League',BR:'de Série A',MX:'de Liga MX',ZA:'de Premiership',TR:'de Süper Lig',MA:'de Botola Pro',ID:'de Liga 1'},
 basketbal:{US:'de NBA',CA:'de NBA',_:'de nationale competitie'},americanfootball:{US:'de NFL',_:'de nationale competitie'},honkbal:{US:'de MLB',JP:'de NPB',_:'de nationale competitie'},ijshockey:{CA:'de NHL',US:'de NHL',_:'de nationale competitie'},
 hockey:{NL:'de Hoofdklasse',BE:'de Belgische Hoofdklasse',_:'de nationale competitie'},rugby:{UK:'de Premiership Rugby',FR:'de Top 14',ZA:'de United Rugby Championship',AU:'de Super Rugby',_:'de nationale competitie'},cricket:{_:'het nationale kampioenschap'},volleybal:{IT:'de SuperLega',_:'de nationale competitie'}};
const TOURN={tennis:['de Australian Open','Roland Garros','Wimbledon','de US Open'],golf:['The Masters','het PGA Championship','de US Open','The Open'],wielrennen:['de Tour de France','de Giro d\'Italia','de Vuelta','Parijs-Roubaix','de Ronde van Vlaanderen'],
  schaatsen:['het WK allround','het WK afstanden','de wereldbeker'],atletiek:['de Diamond League','het WK atletiek'],zwemmen:['het WK zwemmen','het EK zwemmen'],badminton:['de All England','het WK badminton']};
const RANKN={tennis:'de wereldranglijst (ATP/WTA)',golf:'de wereldranglijst',wielrennen:'de UCI-ranglijst',schaatsen:'de wereldbekerstand',atletiek:'de wereldranglijst',zwemmen:'de wereldranglijst',badminton:'de BWF-wereldranglijst'};
proClub=(f=>function(id,cn){const L=RCLUB[id]&&(RCLUB[id][cn]||RCLUB[id]._);return L?pick(L):f.apply(this,arguments)})(proClub);
const leagueN=(id,cc)=>{const t=LEAGUE[id];return t?(t[cc||S.p.country]||t._||'de nationale competitie'):'de nationale competitie'};

// ---------- 15.1 eindstand en ranglijst ----------
function sportSeason(){const P=S.sport;if(!P||P.st!=='pro'||inJail())return;const D=SPORTS[P.id],se=P.seasons[P.seasons.length-1];if(!se||se.a!==ageY())return;const perf=se.perf;
  if(D.team){const n=P.id==='voetbal'?18:16;const pos=clamp(Math.round(n+1-(perf/100)*n*(.6+P.lvl*.15)+ri(-3,3)),1,n);se.pos=pos;P.lg=leagueN(P.id);
    L(`${D.em} ${P.team} eindigt als ${pos}e in ${P.lg}.${pos===1?' Kampioen!':pos>=n-1?' Degradatie dreigt.':''}`,pos<=3?'good':pos>=n-1?'bad':'sys');
    if(pos===1){P.titles=(P.titles||0)+1;hap(10);S.fame=clamp(S.fame+4);MS(`Werd kampioen van ${P.lg} met ${P.team}`,2)}}
  else{const r=clamp(Math.round(300/(1+(perf/20)*(P.lvl+1))+ri(-3,3)),1,500);se.rank=r;P.rank=r;P.bestRank=Math.min(P.bestRank||999,r);
    const T=TOURN[P.id];let won=null;if(T&&perf>=78&&chance((perf-70)/60+P.lvl*.05)){won=pick(T);P.majors=(P.majors||[]);P.majors.push([year(),won]);hap(10);S.fame=clamp(S.fame+5);MS(`Won ${won}`,2)}
    L(`${D.em} Je staat ${r}e op ${RANKN[P.id]||'de wereldranglijst'}.${won?` En je wint ${won}!`:''}`,r<=10||won?'good':'sys')}
  // nationale ploeg
  if(P.lvl>=2&&perf>=68&&!P.nat){P.nat=1;L(`🇺🇳 Je wordt geselecteerd voor het nationale team van ${COUNTRIES[S.p.country].n}!`.replace('🇺🇳',flag(S.p.country)),'good');MS('Werd international',2);hap(6)}
  // grote toernooien: hooguit één groot moment per jaar
  const y=year();const big=P.nat&&(y%2===0)&&typeof fmFree==='function'&&fmFree()&&chance(.7);
  if(big){fmTake();const ol=(y%4===0&&!['voetbal','americanfootball','honkbal','ijshockey','cricket','rugby'].includes(P.id))||(y%4===2&&['schaatsen','ijshockey'].includes(P.id));
    Q.push({id:'s15_toernooi',c:{n:ol?'de Olympische Spelen':P.id==='voetbal'?(y%4===2?'het WK':'het EK'):`het WK ${D.n.toLowerCase()}`,ol:ol?1:0}})}
  else if(D.team&&se.pos&&se.pos<=4&&chance(.35)&&typeof fmFree==='function'&&fmFree()){fmTake();Q.push({id:'s15_finale',c:{t:P.team}})}}
E('s15_toernooi',{sys:1,need:()=>!!S.sport&&S.sport.st==='pro'&&!inJail(),t:'Een groot toernooi',x:c=>`Je speelt voor ${COUNTRIES[S.p.country].n} op ${c.n}. ${c.ol?'De hele wereld kijkt mee.':'Het hele land staat in het oranje… of welke kleur dan ook.'.replace('in het oranje… of welke kleur dan ook',S.p.country==='NL'?'in het oranje':'achter je')}`,ch:[
 ['🔥 Alles geven',c=>{const P=S.sport;const p=clamp((P.sk-50)/60+P.lvl*.08,.05,.7);const r=R();if(r<p){hap(15);S.fame=clamp(S.fame+8);MS(`Won goud op ${c.n}`,3);P.gold=(P.gold||0)+1;return `GOUD! Je wint ${c.n}. Je staat op het podium en het volkslied klinkt.`}if(r<p+.2){hap(8);S.fame=clamp(S.fame+4);MS(`Won een medaille op ${c.n}`,2);return `Je wint ${pick(['zilver','brons'])} op ${c.n}!`}if(chance(.12)){P.inj=1;hea(-10);return 'Je geeft alles en blesseert je in de halve finale.'}hap(-3);return `Je strandt in de ${pick(['kwartfinale','halve finale','groepsfase'])}. Volgende keer beter.`}],
 ['🧠 Slim en tactisch spelen',c=>{const P=S.sport;const p=clamp((P.sk-55)/70+P.lvl*.06,.04,.55);if(chance(p)){hap(14);S.fame=clamp(S.fame+7);MS(`Won goud op ${c.n}`,3);P.gold=(P.gold||0)+1;return `Met een slim plan win je ${c.n}. Goud!`}if(chance(.4)){hap(6);MS(`Won een medaille op ${c.n}`,2);return `Een medaille! ${pick(['Zilver','Brons'])} op ${c.n}.`}return `Je haalt de ${pick(['kwartfinale','halve finale'])}. Netjes.`}]]});
E('s15_finale',{sys:1,need:()=>!!S.sport&&S.sport.st==='pro'&&!inJail(),t:'De bekerfinale',x:c=>`${c.t} staat in de bekerfinale. Het stadion is uitverkocht. ${SPORTS[S.sport.id].team?'In de laatste minuut krijg jij de kans.':''}`,ch:[
 ['🎯 Zelf de beslissing zoeken',()=>{const P=S.sport;if(chance(clamp((P.sk-40)/70,.15,.75))){hap(12);S.fame=clamp(S.fame+5);MS(`Won de bekerfinale met ${P.team}`,2);P.cups=(P.cups||0)+1;return SPORTS[P.id].win}hap(-4);return 'Je mist. De tegenstander wint de beker. Je zit nog lang op het veld.'}],
 ['🤝 De bal afgeven aan een ploeggenoot',()=>{const P=S.sport;if(chance(.5)){hap(9);P.cups=(P.cups||0)+1;MS(`Won de bekerfinale met ${P.team}`,2);return 'Je ploeggenoot scoort na jouw assist. De beker is van jullie!'}hap(-2);return 'Het gaat net mis. Verlies in de laatste minuut.'}]]});
Object.assign(EVMETA,{s15_toernooi:['Sport','🏅'],s15_finale:['Sport','🏆']});

// ---------- 15.3 zaakwaarnemer ----------
// ---------- 15.4 na je carrière ----------
retireSport=(f=>function(){const P=S.sport;const wasPro=P&&P.st==='pro';const r=f.apply(this,arguments);if(wasPro&&ageY()<70&&!inJail())Q.push({id:'s15_nacarriere',c:{}});return r})(retireSport);
E('s15_nacarriere',{sys:1,need:()=>!inJail(),t:'En nu?',x:'Je sportcarrière is voorbij. Wat ga je doen?',ch:[
 ['📋 Trainer worden',()=>{if(JOB('coach')){setJob('coach',Math.min(2,(S.sport&&S.sport.lvl)||0));return `Je wordt ${jobTitle().toLowerCase()}. Nu sta jij langs de lijn te schreeuwen.`}return 'Je gaat jonge spelers trainen.'}],
 ['🎙️ Analist op tv',()=>{if(JOB('presentator')){setJob('presentator',1);S.fame=clamp(S.fame+3);return 'Je schuift elke week aan als analist. Je uitspraken worden memes.'}return 'Je wordt analist op tv.'}],
 ['🏋️ Een eigen sportschool',()=>{const k=Math.round(60000*(S.cpi||1));if(S.money<k)return 'Daar heb je net niet genoeg geld voor. Misschien later.';cash(-k);if(JOB('pt'))setJob('pt',2);MS('Begon een eigen sportschool',1);return 'Je opent een sportschool met jouw naam op de gevel. De eerste maand staan er rijen.'}],
 ['🌴 Even helemaal niks',()=>{hap(5);return 'Je slaapt uit, reist en eet eindelijk wat je wilt.'}]]});
EVMETA.s15_nacarriere=['Sport','🏁'];
// ---------- in het sportscherm ----------
sheetSport=(f=>function(el){const r=f.apply(this,arguments);const P=S.sport;if(!P||P.st==='gestopt')return r;const D=SPORTS[P.id];const bits=[];
  if(P.st==='pro'&&D.team&&P.lg){const se=P.seasons[P.seasons.length-1];if(se&&se.pos)bits.push(`Vorig seizoen: ${se.pos}e in ${P.lg}`)}
  if(P.rank)bits.push(`Wereldranglijst: ${P.rank}e (beste ${P.bestRank}e)`);if(P.titles)bits.push(`${P.titles}× kampioen`);if(P.cups)bits.push(`${P.cups}× beker`);if(P.gold)bits.push(`${P.gold}× goud`);if(P.nat)bits.push('International');
  if((P.majors||[]).length)bits.push(`Gewonnen: ${f8List([...new Set(P.majors.map(m=>m[1]))])}`);
  if(bits.length)card(el,`<h3>🏅 Erelijst</h3><span class="muted">${he(bits.join(' · '))}</span>`);
  if(P.st==='pro'){const s=sec(el,'Zaakwaarnemer');row(s,{ic:'🤝',t:P.agent?'Je zaakwaarnemer':'Een zaakwaarnemer nemen',s:P.agent?'Regelt betere contracten · tik om te ontslaan':'Onderhandelt een beter contract, ook na zijn deel van 8% houd je meer over',dots:true,on:()=>{P.agent=P.agent?0:1;if(S.job)S.job.mult=Math.round(S.job.mult*(P.agent?1.04:1/1.04)*100)/100;toast(P.agent?'Je hebt een zaakwaarnemer':'Je zaakwaarnemer vertrekt');refreshSheet()}})}
  return r})(sheetSport);
F8.year.push(()=>{if(!S.alive)return;sportSeason()});
ACH.push(['kampioen','Kampioen!','Word landskampioen met je club'],['goud','Goud!','Win goud op een groot toernooi']);
F8.ach.push(add=>{const P=S.sport;if(P&&P.titles)add('kampioen');if(P&&P.gold)add('goud')});

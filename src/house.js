/* ---------- wonen: kopen, bezitten, verbouwen, verhuren, verkopen ---------- */
// wijk: [naam, sfeer, extra waardegroei per jaar, prijsfactor, geluk per jaar als je er woont]
const WIJK=[
 ['Het Centrum','Bruisend en duur, en nergens een parkeerplek',.012,1.25,1],
 ['De Oude Haven','Scheve vloeren, kroegen om de hoek en veel karakter',.01,1.1,1],
 ['Nieuwbouw De Akkers','Rustig en kindvriendelijk, alle huizen hetzelfde',0,.95,0],
 ['De Rafelrand','Nog wat rauw, maar elke maand een nieuwe koffiebar',.028,.8,0],
 ['Villapark Groenoord','Groen, stil en strakke hagen',.008,1.2,1],
 ['Het Dorpse Eind','Weilanden, één bakker en heel veel rust',-.004,.85,0],
 ['Achter het Spoor','Goedkoop, maar je hoort elke trein',-.008,.75,-2]];
const HT={Studio:{m2:[24,40],yr:[1930,2022]},Appartement:{m2:[55,95],yr:[1960,2023]},Benedenwoning:{m2:[70,115],yr:[1900,1990],tuin:1},Rijtjeshuis:{m2:[95,135],yr:[1950,2023],tuin:1,dak:1},'Twee-onder-een-kap':{m2:[125,175],yr:[1930,2023],tuin:1,dak:1},'Vrijstaande woning':{m2:[150,250],yr:[1920,2023],tuin:1,dak:1,big:1,wk:[2,3,4,5]},Penthouse:{m2:[120,220],yr:[2000,2024],wk:[0,1,2,3]},Boerderij:{m2:[180,320],yr:[1850,1960],tuin:1,dak:1,big:1,wk:[5]},Villa:{m2:[240,420],yr:[1910,2024],tuin:1,dak:1,big:1,wk:[0,4,5]},Grachtenpand:{m2:[170,320],yr:[1620,1890],dak:1,wk:[0,1]},Landgoed:{m2:[480,1100],yr:[1750,1930],tuin:1,dak:1,big:1,wk:[4,5]},Bovenwoning:{m2:[60,110],yr:[1900,2000],dak:1},Hoekwoning:{m2:[110,150],yr:[1960,2023],tuin:1,dak:1,wk:[2,3,5]},Herenhuis:{m2:[160,280],yr:[1880,1940],tuin:1,dak:1,wk:[0,1,4]},Landhuis:{m2:[250,480],yr:[1900,2020],tuin:1,dak:1,big:1,wk:[4,5]},Kasteel:{m2:[900,3200],yr:[1300,1800],tuin:1,dak:1,big:1,wk:[5]},Kustvilla:{m2:[400,1200],yr:[1990,2025],tuin:1,dak:1,big:1},Wereldpenthouse:{m2:[400,1500],yr:[2008,2025]},Megamansion:{m2:[1500,5000],yr:[2000,2025],tuin:1,dak:1,big:1},'Privé-eiland':{m2:[2000,8000],yr:[1980,2025],tuin:1,dak:1,big:1}};
const HICON={Studio:'🛏️',Appartement:'🏢',Benedenwoning:'🏘️',Rijtjeshuis:'🏘️','Twee-onder-een-kap':'🏡','Vrijstaande woning':'🏡',Penthouse:'🌆',Boerderij:'🚜',Villa:'🏝️',Grachtenpand:'🏛️',Landgoed:'🏰'};
const htOf=n=>n==='Starterswoning'?{m2:[60,85],yr:[1965,2021],tuin:1,dak:1,wk:[2,3,5,6]}:HT[n]||{m2:[70,120],yr:[1950,2010],tuin:1,dak:1};
const HALIAS={Starterswoning:'Rijtjeshuis',Bovenwoning:'Benedenwoning',Hoekwoning:'Rijtjeshuis',Herenhuis:'Grachtenpand',Landhuis:'Vrijstaande woning',Kasteel:'Landgoed',Kustvilla:'Villa',Wereldpenthouse:'Penthouse',Megamansion:'Villa','Privé-eiland':'Villa'};
const hIcon=n=>icHouse(HALIAS[n]||n);
const DEFS=[['fund','Funderingsproblemen','Er lopen scheuren door de gevel die elk jaar groter worden.',[25000,80000]],['schim','Schimmel in de kruipruimte','Zodra je het luik opent, ruikt het muf.',[3000,9000]],['asb','Asbest in het dak','De dakplaten blijken asbest te bevatten.',[8000,22000]],['elek','Verouderde elektra','De stoppenkast komt nog van voor de oorlog.',[4000,11000]],['rot','Houtrot in de kozijnen','Je duim gaat zo door het kozijn heen.',[3000,9000]],['dak','Een lekkend dak','Na elke regenbui staat er een emmer op zolder.',[5000,14000]]];
const HINT={fund:'scheurtjes in de gevel',schim:'een muffe geur bij de trap',asb:'golfplaten op de schuur',elek:'een stoppenkast met porseleinen zekeringen',rot:'verf die van de kozijnen bladdert',dak:'een bruine kring op het zolderplafond'};
const LBL='ABCDEFG';
const defN=k=>(DEFS.find(d=>d[0]===k)||[,'Een gebrek'])[1];
const lblOf=p=>LBL[clamp(Math.round(p.lbl??3),0,6)];
const condTxt=c=>`${Math.round(c)}% · ${c>=85?'uitstekend':c>=65?'goed':c>=45?'redelijk':c>=25?'slecht':'bouwval'}`;
const condCol=c=>c>=65?'var(--good)':c>=40?'var(--warn)':'var(--bad)';
const pp=id=>S.props.find(x=>x.id===id);
const hcpi=()=>(S.cpi||1)*(S.eco?S.eco.hreal:1);
function lblFor(yr){return yr>=year()-2?0:yr<1950?ri(4,6):yr<1990?ri(3,5):yr<2012?ri(1,3):ri(0,1)}
// oude saves aanvullen
function ph(p){if(p.cond==null){const t=htOf(p.name);p.cond=ri(55,80);p.m2=ri(t.m2[0],t.m2[1]);p.yr=ri(t.yr[0],t.yr[1]);p.lbl=lblFor(p.yr);p.w=ri(0,WIJK.length-1)}
  p.def=p.def||[];p.reno=p.reno||[];if(p.boughtY==null)p.boughtY=year();
  if(p.rentOut&&!p.ten&&!p.air)p.ten=mkTenant(TKIND[1]);p.rentOut=!!(p.ten||p.air);return p}
function setCond(p,d){const o=p.cond;p.cond=clamp(Math.round(o+d));p.value=Math.round(p.value*(1+(p.cond-o)*.001))}
function pRent(p){return p.air?p.value*.075*(.6+p.cond/250):p.ten?p.value*p.ten.rate:0}

/* ---- aanbod ---- */
function feats(cond,lbl,t){const g=['Een nieuwe keuken','Net geschilderd','Vloerverwarming','Een lichte woonkamer','Een badkamer met inloopdouche'],b=['Een badkamer uit de jaren 70','Bloemetjesbehang','Enkel glas','Bruine tegels','Een keuken met een oud gasfornuis'];
  const o=[pick(cond>65?g:b)];if(lbl<=1)o.push('Zonnepanelen op het dak');o.push(pick(t.tuin?['Een tuin op het zuiden','Een tuin vol onkruid','Een diepe achtertuin','Een kleine stadstuin']:['Een balkon','Een gedeelde fietsenkelder','Uitzicht over de daken','Een lift die het meestal doet']));return o}
// 15 prijsklassen: [icoon, naam, soorten, prijs van, prijs tot, plaatsen (alleen voor de top)]
const HCAT=[
 ['🛏️',"Studio's en kamers",['Studio'],95000,185000],
 ['🏠','Starterswoningen',['Starterswoning','Appartement'],180000,270000],
 ['🏢','Appartementen',['Appartement','Bovenwoning'],250000,360000],
 ['🏘️','Rijtjeshuizen',['Rijtjeshuis','Benedenwoning'],320000,460000],
 ['🏘️','Hoekwoningen en herenhuizen',['Hoekwoning','Herenhuis'],420000,640000],
 ['🏡','Twee-onder-een-kap',['Twee-onder-een-kap'],520000,800000],
 ['🏡','Vrijstaande woningen',['Vrijstaande woning'],700000,1250000],
 ['🌆','Penthouses',['Penthouse'],1000000,2600000],
 ['🚜','Boerderijen en landhuizen',['Boerderij','Landhuis'],900000,2900000],
 ['🏝️',"Villa's",['Villa'],1800000,4800000],
 ['🏛️','Grachtenpanden',['Grachtenpand'],2500000,7500000],
 ['🏰','Landgoederen en kastelen',['Landgoed','Kasteel'],5000000,16000000],
 ['🌊',"Kustvilla's",['Kustvilla'],12000000,38000000,['de Côte d\'Azur','Marbella','Malibu','het Comomeer','Mykonos','Ibiza','Sardinië']],
 ['🗽','Toplocaties in de wereld',['Wereldpenthouse'],30000000,95000000,['Monaco','Manhattan, New York','Mayfair, Londen','Hongkong','Dubai Marina','Singapore']],
 ['💎','Megamansions en privé-eilanden',['Megamansion','Privé-eiland'],100000000,450000000,['Beverly Hills','Bel Air','Palm Jumeirah, Dubai','de Hamptons','Saint-Tropez']]];
const ISLE=['de Bahama\'s','de Malediven','de Caraïben','Fiji','de Seychellen'];
function mkListing(ci){if(ci===true||ci==null)ci=ri(0,ci===true?3:9);const C_=HCAT[ci];const n=pick(C_[2]);const t=htOf(n);const top=!!C_[5];const w=top?0:t.wk?pick(t.wk):ri(0,WIJK.length-1),W=WIJK[w];
  const yr=ri(t.yr[0],t.yr[1]);const nieuw=yr>=year()-2;const cond=top?ri(80,100):nieuw?ri(92,100):ri(20,98);const lbl=lblFor(yr);
  const m2=ri(t.m2[0],t.m2[1]);const mid=(t.m2[0]+t.m2[1])/2;
  const lo=C_[3],hi=C_[4];const f=Math.pow(R(),1.6);const price=Math.round(Math.min(hi,Math.max(lo,(lo+(hi-lo)*f)*(top?1:(W[3]*.35+.65))*(.9+cond/1000)))*hcpi()/1000)*1000;
  let nd=top?0:cond<35?ri(1,3):cond<65?(chance(.55)?1:0):(chance(.12)?1:0);if(!top&&yr<1930&&chance(.35))nd++;
  const pool=DEFS.filter(d=>!(d[0]==='fund'&&yr>1975)&&!(d[0]==='asb'&&(yr<1945||yr>1994))).sort(()=>R()-.5);
  const def=pool.slice(0,nd).map(d=>({k:d[0],cost:Math.round(ri(d[3][0],d[3][1])*hcpi()*Math.max(1,price/600000)**.5/100)*100,seen:false,fixed:false}));
  const e=econ();const hot=Math.max(0,ri(0,4)+(e==='groei'?3:e==='recessie'?-2:0)+(ci<=4?2:ci>=12?-2:0)+(cond>80?1:0));
  const place=top?(n==='Privé-eiland'?pick(ISLE):pick(C_[5])):S.p.city;
  return {name:n,cat:ci,price,addr:n==='Privé-eiland'?`Een eigen eiland, ${place}`:`${pick(STREETS)} ${ri(1,180)}, ${place}`,w,m2,yr,lbl,cond,def,hot,need:.95+hot*.028+gauss()*.025,feat:top?pick([['Een eigen bioscoop','Een wijnkelder voor 5.000 flessen','Een helikopterplatform'],['Een infinity pool met uitzicht op zee','Personeelsverblijven','Een garage voor twaalf auto\'s'],['Een eigen haven met ligplaats voor je jacht','Een spa met hamam','Een tennisbaan']]):feats(cond,lbl,t),viewed:0,insp:0,bid:0}}
function market(){const y=year();let m=S.flags.mk;if(!m||m.y!==y||!m.v2){m=S.flags.mk={y,v2:1,l:[]}}
  for(let ci=0;ci<HCAT.length;ci++){let n=m.l.filter(h=>h.cat===ci).length;while(n<5){m.l.push(mkListing(ci));n++}}return m.l}
const canCash=pr=>S.money>=pr*1.03,canMort=pr=>S.money>=pr*.05&&maxMortgage()>=pr&&!bkr(),canFin=pr=>canCash(pr)||canMort(pr);

function sheetMarket(el){const mm=maxMortgage();const l=market();
  card(el,kv([['Saldo',fmt(S.money)],['Maximale hypotheek',fmt(mm)],['Hypotheekrente',`± ${pct(rente())}`],['Woningmarkt',econLabel()]])+'<span class="muted">Er staan altijd 5 woningen per prijsklasse te koop. Bezichtig eerst: pas dan zie je gebreken en hoeveel andere kijkers er zijn. Met een hypotheek leen je de hele koopsom (tot 5× je inkomen, inclusief dat van je partner). Zelf betaal je 5% kosten koper.</span>');
  const s=sec(el,'Prijsklassen');
  HCAT.forEach(([ic,n,,lo,hi],ci)=>{const hs=l.filter(h=>h.cat===ci);const cheap=Math.min(...hs.map(h=>h.price));const ok=hs.some(h=>canFin(h.price*.9));
    row(s,{ic,t:n,s:`${fmt(lo*hcpi())} – ${fmt(hi*hcpi())} · ${hs.length} te koop${ok?'':' · te duur voor je'}`,r:`vanaf ${fmt(cheap)}`,on:()=>openSheet(n,el=>sheetCat(el,ci),true)})})}
function sheetCat(el,ci){const s=sec(el,`Te koop · ${HCAT[ci][1]}`);
  for(const h of market().filter(x=>x.cat===ci)){const W=WIJK[h.w];const top=!!HCAT[ci][5];row(s,{ic:hIcon(h.name),t:h.name,s:`${top?h.addr.split(', ').slice(1).join(', '):W[0]} · ${nfR(h.m2)} m²${top?'':` · label ${LBL[h.lbl]}`}${h.viewed?` · ${h.hot} andere kijkers`:''}${canFin(h.price*.9)?'':' · te duur'}`,r:fmt(h.price),on:()=>openSheet(h.name,el=>sheetListing(el,h),true)})}}
function sheetListing(el,h){if(!market().includes(h)){empty(el,'Dit huis is niet meer te koop.');return}const W=WIJK[h.w];const seen=h.def.filter(d=>d.seen);
  const insp=h.insp?(seen.length?seen.map(d=>`${defN(d.k)} (± ${fmt(d.cost)})`).join('<br>'):'Geen gebreken gevonden'):h.viewed?(seen.length?seen.map(d=>`Je zag ${HINT[d.k]}`).join('<br>'):'Je zag niets vreemds'):'Nog niet bezichtigd';
  card(el,`<h3>${hIcon(h.name)} ${he(h.name)}</h3><span class="muted">${he(h.addr)}</span>${kv([['Vraagprijs',fmt(h.price)],(HCAT[h.cat]&&HCAT[h.cat][5]?['Locatie',he(h.addr.split(', ').slice(1).join(', '))]:['Wijk',`${he(W[0])}<br><small class="muted">${he(W[1])}</small>`]),['Oppervlakte',`${h.m2} m²`],['Bouwjaar',h.yr],['Energielabel',LBL[h.lbl]],['Staat',condTxt(h.cond)],['Kenmerken',h.feat.map(he).join('<br>')],['Inspectie',insp],['Interesse',h.viewed?`${h.hot} andere kijker${h.hot===1?'':'s'}`:'Onbekend']])}`);
  const s=sec(el,'Acties');
  row(s,{ic:'👀',t:'Bezichtigen',s:h.viewed?'Al bezichtigd':'Kijk rond en let op de details',dis:!!h.viewed,dots:true,on:()=>doAct('Bezichtiging',()=>{h.viewed=1;const f=[];for(const d of h.def)if(!d.seen&&chance(.45+S.sk.tech/250)){d.seen=true;f.push(HINT[d.k])}
    return `Je loopt rond${h.hot?` tussen ${h.hot} andere kijkers`:' en bent de enige kijker'}. ${f.length?`Je ziet ${f.join(' en ')}.`:'Je ziet niks vreemds, maar je bent ook geen bouwkundige.'}${h.hot>=5?' Dit wordt overbieden.':''}`},true,'👀')});
  row(s,{ic:'🔍',t:'Bouwkundige keuring',s:h.insp?'Gedaan':`${fmt(450)} · vindt alle gebreken`,dis:!!h.insp||S.money<450,dots:true,on:()=>doAct('Keuring',()=>{cash(-450);h.insp=1;h.viewed=1;for(const d of h.def)d.seen=true;const tot=h.def.reduce((a,d)=>a+d.cost,0);
    return h.def.length?`De keurder vindt: ${h.def.map(d=>defN(d.k).toLowerCase()).join(', ')}. Herstel kost ongeveer ${fmt(tot)}. Daar kun je je bod op aanpassen.`:'De keurder vindt niks. Een degelijk huis.'},true,'🔍')});
  row(s,{ic:'✍️',t:'Bod uitbrengen',s:h.bid?'De verkoper heeft je bod afgewezen':canFin(h.price*.9)?'Kies hoeveel je biedt':'Je kunt dit huis niet financieren',dis:!!h.bid||!canFin(h.price*.9),dots:true,on:()=>bidModal(h)})}
function bidModal(h){const ps=[-.1,-.05,0,.05,.1,.15];
  modal({title:'Bod uitbrengen',em:'✍️',cat:h.name,text:`Vraagprijs ${fmt(h.price)}.${h.viewed?` Er waren ${h.hot} andere kijkers.`:' Je weet niet hoeveel concurrentie er is.'} Hoeveel bied je?`,
    choices:opts(ps.map(f=>{const b=Math.round(h.price*(1+f)/1000)*1000;return{t:`${fmt(b)}`,s:f===0?'De vraagprijs':`${f>0?'+':''}${Math.round(f*100)}% ${f>0?'boven':'onder'} de vraagprijs`,dis:!canFin(b),on:()=>{closeModal();placeBid(h,b)}}}))})}
function placeBid(h,b){const need=Math.round(h.price*h.need/1000)*1000;
  if(b>=need)return finModal(h,b,`De verkoper accepteert je bod van ${fmt(b)}!`);
  if(b>=need*.96)return modal({title:'Tegenbod',em:'🤝',cat:h.name,text:`De verkoper vindt ${fmt(b)} te weinig, maar wil wel voor ${fmt(need)}.`,choices:[{t:`Akkoord voor ${fmt(need)}`,cls:'go',dis:!canFin(need),on:()=>{closeModal();finModal(h,need,'Deal!')}},{t:'Nee, te duur',cls:'ghost',on:()=>{closeModal();h.bid=1;refreshSheet()}}]});
  h.bid=1;const win=Math.round(need*(1+R()*.04)/1000)*1000;S.flags.mk.l=S.flags.mk.l.filter(x=>x!==h);
  result('Overboden',`Iemand anders bood ${fmt(win)} en krijgt het huis.${b<h.price?' Onder de vraagprijs bieden werkt niet als er veel kijkers zijn.':''}`,'',()=>backSheet(),{em:'😞',cat:h.name})}
function finModal(h,pr,msg){modal({title:'Financiering',em:'🏦',cat:h.name,text:`${msg} Hoe betaal je ${fmt(pr)}?`,choices:[
  {t:'Contant',s:`${fmt(pr*1.03)} inclusief kosten koper`,cls:'go',dis:!canCash(pr),on:()=>{closeModal();doBuy(h,pr,false)}},
  {t:'Met een hypotheek',s:`${fmt(pr*.05)} kosten koper zelf, de koopsom leen je · rente nu ± ${pct(rente())}`,dis:!canMort(pr),on:()=>{closeModal();mortPick(pr,o=>doBuy(h,pr,o))}},
  {t:'Toch afzien van de koop',cls:'ghost',on:()=>{closeModal();h.bid=1;refreshSheet()}}]})}
function doBuy(h,pr,m){S.flags.mk.l=S.flags.mk.l.filter(x=>x!==h);h.price=pr;
  doAct('Gekocht!',()=>{const p=buyHouse(h,m);hap(10);if(S.home.k!=='eigen'){S.home={k:'eigen',pid:p.id};return `Gefeliciteerd! Je woont nu aan de ${h.addr}.`}return 'Gefeliciteerd met je nieuwe pand!'},true,'🔑');closeSheetLevel()}
function buyHouse(h,mort){const price=h.price;const p={id:uid(),name:h.name,addr:h.addr,value:price,buy:price,mort:0,mort0:0,rentOut:false,w:h.w,m2:h.m2,yr:h.yr,lbl:h.lbl,cond:h.cond,def:(h.def||[]).map(d=>Object.assign({},d)),reno:[],boughtY:year()};
  if(mort){cash(-Math.round(price*.05));p.mort=p.mort0=price;Object.assign(p,mortTerms(typeof mort==='object'?mort:null))}else cash(-Math.round(price*1.03));
  S.props.push(ph(p));S.flags.huis=1;L(`Je hebt een ${h.name.toLowerCase()} gekocht aan de ${h.addr} voor ${fmt(price)}.`,'good big');MS(`Kocht een ${h.name.toLowerCase()} aan de ${h.addr}`,1);if(S.props.length>=5)S.flags.vastgoed=1;return p}

/* ---- overzicht ---- */
function sheetHousing(el){const h=S.home;const hp=h.k==='eigen'?pp(h.pid):null;
  const cur=h.k==='ouders'?'Bij je ouders':h.k==='huur'?`${h.name} (huur)`:hp?hp.name:'Eigen huis';
  let s=sec(el,'Je woning');row(s,{ic:h.k==='ouders'?'👪':h.k==='huur'?'🏢':hIcon(hp&&hp.name),t:cur,s:h.k==='huur'?`${h.wijk?h.wijk+' · ':''}${fmt(h.rent/12)} per maand`:hp?`${hp.addr} · staat ${Math.round(ph(hp).cond)}%`:'Gratis, maar niet altijd gezellig',on:hp?()=>openSheet(hp.name,el=>sheetProp(el,hp),true):null});
  if(typeof homeRows==='function')homeRows(el);
  s=sec(el,'Woningmarkt');
  row(s,{ic:'🔑',t:'Huren',s:'Vind een huurwoning',on:()=>openSheet('Huren',sheetRent,true)});
  row(s,{ic:'🏘️',t:'Kopen',s:'Bezichtigen, bieden en onderhandelen',on:()=>openSheet('Woningaanbod',sheetMarket,true)});
  if(h.k!=='ouders'&&living(['moeder','vader']).length&&ageY()<40)row(s,{ic:'👪',t:'Terug naar je ouders',dots:true,on:()=>doAct('Verhuizen',()=>{S.home={k:'ouders'};return 'Je trekt weer in je oude kamer.'},true,'👪')});
  s=sec(el,'Je panden');if(!S.props.length)empty(s,'Je hebt nog geen huizen.');
  for(const p of S.props){ph(p);const st=S.home.pid===p.id?'je woont hier':p.ten?`verhuurd aan ${p.ten.n}`:p.air?'kortverhuur':'staat leeg';
    row(s,{ic:hIcon(p.name),t:p.name,bar:{l:`${p.addr.split(',')[0]} · ${st}`,v:p.cond,c:condCol(p.cond)},r:fmt(p.value),on:()=>openSheet(p.name,el=>sheetProp(el,p),true)})}
  if(typeof reRows==='function')reRows(el)}
function sheetRent(el){const s=sec(el,'Aanbod');const em=RENTALS.map(([n])=>rentIcon(n));
  RENTALS.forEach(([n,r,d],i)=>{if(n==='Studentenkamer'&&!S.edu.cur&&ageY()>27)return;
    row(s,{ic:em[i],t:n,s:`${d} · vanaf ${fmt(r*.75/12)} per maand`,dots:true,on:()=>{const ws=[...WIJK.keys()].sort(()=>R()-.5).slice(0,3);
      modal({title:n,em:em[i],cat:'Huren',text:'Er zijn drie woningen vrij. Welke wijk kies je?',choices:opts(ws.map(w=>{const W=WIJK[w],k=Math.round(r*W[3]/120)*120;return{t:`${W[0]} · ${fmt(k/12)} p/m`,s:W[1],ic:em[i],dis:ageY()>=18&&S.money<k/6,on:()=>{closeModal();doAct('Verhuisd',()=>{setRent(n,k);S.home.wijk=W[0];S.home.w=w;hap(4+W[4]);return `Je woont nu in een ${n.toLowerCase()} in ${W[0]}.`},true,em[i]);closeSheetLevel()}}}))})}})})}

/* ---- je eigen pand ---- */
function sheetProp(el,p){if(!S.props.includes(p)){empty(el,'Verkocht.');return}ph(p);const W=WIJK[p.w]||WIJK[2];const home=S.home.pid===p.id;
  const known=p.def.filter(d=>d.seen&&!d.fixed);const ren=p.reno.map(r=>(RENO.find(x=>x.k===r.k)||{t:r.k}).t+(r.s?` (${r.s.toLowerCase()})`:'')+` · ${r.y}`);
  card(el,`<h3>${hIcon(p.name)} ${he(p.name)}</h3><span class="muted">${he(p.addr)} · ${he(W[0])}</span><div class="stat"><span>Staat</span><span></span><span class="v">${Math.round(p.cond)}%</span>${bar(p.cond,condCol(p.cond))}</div>${p.mort>p.value?`<div class="bizwarn"><b>🌊 Je huis staat onder water</b><span>Je hypotheek is ${fmt(p.mort-p.value)} hoger dan de waarde. Bij verkoop houd je een restschuld over.</span></div>`:''}${kv([['Waarde',fmt(p.value)],['Gekocht voor',`${fmt(p.buy)} (${p.boughtY})`],['Hypotheek',p.mort>0?(mFix(p),`${fmt(p.mort)} · ${pct(p.rate)} ${MTYPE[p.mt][0].toLowerCase()}${p.mt!=='var'&&p.fixUntil?` tot ${p.fixUntil}`:''}${p.af==='mix'?' · half aflossingsvrij':''}<br><small class="muted">± ${fmt(mMonth(p))} per maand</small>`):'Geen'],['Oppervlakte',`${p.m2} m²`],['Energielabel',lblOf(p)],['Bekende gebreken',known.length?known.map(d=>he(defN(d.k))).join('<br>'):'Geen'],['Verbouwingen',ren.length?ren.map(he).join('<br>'):'Nog niks'],['Bewoning',home?'Je woont hier':p.ten?`${p.ten.em} ${he(p.ten.n)} (${he(p.ten.kind.toLowerCase())})<br>${fmt(pRent(p)/12)} per maand · tevredenheid ${Math.round(p.ten.happy)}%`:p.air?`Kortverhuur · ongeveer ${fmt(pRent(p)/12)} per maand`:'Leeg']])}`);
  let s=sec(el,'Onderhoud en verbouwen');
  row(s,{ic:'🛠️',t:'Verbouwen',s:'Keuken, badkamer, zonnepanelen, uitbouw en meer',on:()=>openSheet('Verbouwen',el=>sheetReno(el,p),true)});
  const ok=Math.round(Math.max(1500*hcpi(),p.value*.02)/100)*100;
  row(s,{ic:'🧰',t:'Groot onderhoud',s:S.acts['go'+p.id]?'Dit jaar al gedaan':`${fmt(ok)} · staat +30`,dis:!!S.acts['go'+p.id]||p.cond>=95||S.money<ok,dots:true,on:()=>doAct('Groot onderhoud',()=>{S.acts['go'+p.id]=1;cash(-ok);setCond(p,30);if(p.ten)p.ten.happy=clamp(p.ten.happy+12);return 'Dakgoten, kozijnen, cv-ketel: alles is weer bij.'},true,'🧰')});
  for(const d of known)row(s,{ic:'⚠️',t:`Herstellen: ${defN(d.k).toLowerCase()}`,s:'Wordt elk jaar duurder als je wacht',r:fmt(d.cost),dis:S.money<d.cost,dots:true,on:()=>doAct('Herstel',()=>{cash(-d.cost);d.fixed=true;setCond(p,6);return `${defN(d.k)} is verholpen. Weer een zorg minder.`},true,'🛠️')});
  if(!home){s=sec(el,'Verhuur');
    if(!p.ten&&!p.air){row(s,{ic:'🛋️',t:'Hier gaan wonen',dots:true,on:()=>doAct('Verhuisd',()=>{S.home={k:'eigen',pid:p.id};hap(3);return `Je woont nu aan de ${p.addr}.`},true,'🛋️')});
      row(s,{ic:'🔑',t:'Huurders zoeken',s:`Marktconform: ongeveer ${fmt(p.value*.045/12)} per maand`,dots:true,on:()=>findTenant(p)});
      row(s,{ic:'🧳',t:'Kortverhuur aan toeristen',s:`Ongeveer ${fmt(p.value*.075*(.6+p.cond/250)/12)} per maand, maar meer slijtage en gedoe`,dots:true,on:()=>doAct('Kortverhuur',()=>{p.air=1;p.rentOut=true;return 'Je pand staat online. De eerste toeristen hebben al geboekt.'},true,'🧳')})}
    if(p.ten){const t=p.ten;
      row(s,{ic:'📈',t:'Huur verhogen',s:S.acts['hv'+p.id]?'Dit jaar al gedaan':`Nu ${fmt(pRent(p)/12)} per maand`,dis:!!S.acts['hv'+p.id],dots:true,on:()=>raiseRent(p)});
      row(s,{ic:'☕',t:`Langsgaan bij ${t.n}`,s:'Vraag hoe het gaat',dis:!!S.acts['tb'+p.id],dots:true,on:()=>doAct('Langsgaan',()=>{S.acts['tb'+p.id]=1;t.happy=clamp(t.happy+8);sk('sociaal',1);return t.happy>70?`${t.n} zet koffie en vertelt dat het huis bevalt.`:`${t.n} heeft een lijstje klachten klaarliggen, maar waardeert dat je komt.`},true,'☕')});
      const buyout=t.yrs<1?0:Math.round(pRent(p)/2);
      row(s,{ic:'🚪',t:'Huurcontract opzeggen',s:buyout?`Huurbescherming: uitkopen kost ${fmt(buyout)}`:'Nog in de proeftijd, dus kosteloos',dots:true,on:()=>ask('Opzeggen?',buyout?`${t.n} heeft huurbescherming. Je moet zes maanden huur betalen om de huurder eruit te krijgen: ${fmt(buyout)}.`:`${t.n} zit nog in de proeftijd en moet binnen een maand weg.`,'Opzeggen',()=>doAct('Verhuur',()=>{cash(-buyout);p.ten=null;p.rentOut=false;kar(-1);return `${t.n} pakt de spullen en vertrekt. Het pand staat leeg.`},true,'🚪'))})}
    if(p.air)row(s,{ic:'🛑',t:'Stoppen met kortverhuur',dots:true,on:()=>doAct('Verhuur',()=>{p.air=0;p.rentOut=false;return 'De advertentie staat offline.'},true,'🛑')})}
  s=sec(el,'Financieel');
  if(p.mort>0)row(s,{ic:'🔄',t:'Hypotheek oversluiten',s:`Nu ${pct(mFix(p).rate)} · marktrente ${pct(rente())}`,dots:true,on:()=>refi(p)});
  if(p.mort>0)row(s,{ic:'🏦',t:'Hypotheek aflossen',dis:S.money<=0,dots:true,on:()=>amountModal('Aflossen',Math.min(S.money,p.mort),x=>doAct('Afgelost',()=>{cash(-x);p.mort-=x;p.mort0=Math.max(p.mort,p.mort0-x);return `${fmt(x)} afgelost.`},true,'🏦'))});
  row(s,{ic:'🏷️',t:'Verkopen',s:S.acts['vk'+p.id]?'Stond dit jaar al te koop':`Kies een makelaar en een vraagprijs`,dis:!!S.acts['vk'+p.id],dots:true,on:()=>sellFlow(p)})}

/* ---- verbouwen ---- */
const RENO=[
 {k:'keuken',em:'🍳',t:'Nieuwe keuken',st:[['Budget, uit het woonwarenhuis',9000,.6],['Middenklasse met vaatwasser',18000,.75],['Luxe met kookeiland',38000,.85]],diy:1,again:15,hap:3,cond:4},
 {k:'bad',em:'🛁',t:'Nieuwe badkamer',st:[['Simpel en wit',8000,.6],['Inloopdouche met regendouche',16000,.75],['Spa met vrijstaand bad',30000,.8]],diy:1,again:15,hap:3,cond:4},
 {k:'verf',em:'🎨',t:'Schilderen en opknappen',cost:p=>Math.max(2500,p.m2*40),diy:1,again:3,cond:22,hap:2},
 {k:'tuin',em:'🌳',t:'Tuin laten aanleggen',st:[['Strak en onderhoudsvrij',5000,.5],['Bloementuin met vijver',9000,.6],['Moestuin met kippenhok',4000,.45]],diy:1,again:12,hap:3,ok:t=>t.tuin},
 {k:'zon',em:'☀️',t:'Zonnepanelen',cost:()=>7500,lbl:1,va:.75,ok:t=>t.dak},
 {k:'iso',em:'🧱',t:'Isoleren (dak, vloer en spouw)',cost:p=>p.m2*110,lbl:2,va:.7},
 {k:'wp',em:'🌡️',t:'Warmtepomp',cost:()=>14000,lbl:1,va:.6},
 {k:'dakkapel',em:'🪟',t:'Dakkapel (+6 m²)',cost:()=>11000,m2:6,ok:t=>t.dak},
 {k:'uitbouw',em:'🏗️',t:'Uitbouw (+15 m²)',cost:()=>45000,m2:15,ok:t=>t.tuin},
 {k:'zwembad',em:'🏊',t:'Zwembad in de tuin',cost:()=>55000,va:.55,hap:6,ok:t=>t.big}];
const renoCost=(p,R,s)=>Math.round((s?s[1]:R.cost(p))*hcpi()/100)*100;
function sheetReno(el,p){if(!S.props.includes(p)){empty(el,'Verkocht.');return}const t=htOf(p.name);
  card(el,kv([['Saldo',fmt(S.money)],['Energielabel',lblOf(p)],['Staat',condTxt(p.cond)]])+'<span class="muted">Zelf klussen is goedkoop maar riskant. Een aannemer gaat soms over budget. Een topbedrijf is duur maar levert strak werk.</span>');
  const s=sec(el,'Projecten');
  for(const R of RENO){if(R.ok&&!R.ok(t))continue;const last=p.reno.filter(r=>r.k===R.k).pop();const wait=last?(R.again?R.again-(year()-last.y):99):0;
    const from=R.st?renoCost(p,R,R.st[0]):renoCost(p,R);
    row(s,{ic:R.em,t:R.t,s:wait>0?(R.again?`Kan weer over ${wait} jaar`:'Al gedaan'):R.lbl&&p.lbl<=0?'Je hebt al label A':R.lbl?`Label ${lblOf(p)} → ${LBL[Math.max(0,p.lbl-R.lbl)]}, lagere energierekening`:R.m2?'Meer woonruimte, meer waarde':R.cond?'Staat flink omhoog':'Meer woonplezier',r:`${R.st?'vanaf ':''}${fmt(from)}`,dis:wait>0||(R.lbl&&p.lbl<=0)||S.money<from*(R.diy?.4:1),dots:true,on:()=>R.st?renoStyle(p,R):renoExec(p,R,null)})}}
function renoStyle(p,R){modal({title:R.t,em:R.em,cat:'Verbouwen',text:'Welke uitvoering kies je?',choices:opts(R.st.map(st=>{const c=renoCost(p,R,st);return{t:st[0],s:fmt(c),dis:S.money<c*(R.diy?.4:1),on:()=>{closeModal();renoExec(p,R,st)}}}))})}
function renoExec(p,R,st){const c=renoCost(p,R,st);const ch=[];
  if(R.diy)ch.push({t:'🔨 Zelf klussen',s:`${fmt(c*.4)} aan materiaal · minigame`,dis:S.money<c*.4,on:()=>{closeModal();mgTiming('Klussen','Stop op het juiste moment: meten, zagen en vastzetten.',3,hits=>doAct(R.t,()=>{cash(-Math.round(c*.4));const q=hits/3*.75+S.sk.tech/400;const f=q>=.6?1:q>=.35?.6:.25;sk('tech',1+hits);
    let x=applyReno(p,R,st,c,f);if(f<.3&&chance(.4)){hea(-6);x+=' Je valt ook nog van de trap.'}return f>=1?`Strak gedaan! Niemand ziet dat je het zelf hebt gedaan.${x}`:f>=.6?`Het is af, maar de voegen lopen scheef.${x}`:`Dat ging mis. Er moet nog veel over.${x}`},true,R.em))}});
  ch.push({t:'👷 Aannemer',s:`${fmt(c)} · kans op uitloop`,dis:S.money<c,on:()=>{closeModal();doAct(R.t,()=>{let k=c,ex='';if(chance(.25)){const o=ri(10,30);k=Math.round(c*(1+o/100));ex+=` De aannemer gaat ${o}% over budget.`}if(chance(.15)){hap(-2);ex+=' Het duurt maanden langer dan beloofd en je leeft in het stof.'}cash(-k);return `Klaar.${ex}${applyReno(p,R,st,c,1)}`},true,R.em)}});
  ch.push({t:'⭐ Topbedrijf',s:`${fmt(c*1.3)} · strak, op tijd en garantie`,dis:S.money<c*1.3,on:()=>{closeModal();doAct(R.t,()=>{cash(-Math.round(c*1.3));return `Strak, op tijd en zonder gedoe.${applyReno(p,R,st,c,1.1)}`},true,R.em)}});
  modal({title:R.t,em:R.em,cat:'Verbouwen',text:st?`${st[0]}. Wie gaat het doen?`:'Wie gaat het doen?',choices:opts(ch)})}
function applyReno(p,R,st,c,f){let va=st?c*st[2]:R.va?c*R.va:0;let x='';
  if(R.m2){va+=R.m2*(p.value/p.m2)*.85*Math.min(1,f);p.m2+=Math.round(R.m2*Math.min(1,f>=.6?1:.5))}
  if(R.k==='wp'&&p.lbl>2){va*=.3;hap(-1);x=' Je huis is slecht geïsoleerd, dus de warmtepomp krijgt het niet warm. Had eerst geïsoleerd.'}
  const v0=p.value;p.value=Math.round(p.value+va*f);if(R.cond)setCond(p,R.cond*f);if(R.lbl&&f>=.6)p.lbl=Math.max(0,p.lbl-R.lbl);
  if(R.hap&&S.home.pid===p.id)hap(Math.round(R.hap*f));if(p.ten)p.ten.happy=clamp(p.ten.happy+10);
  p.reno.push({k:R.k,y:year(),s:st?st[0]:''});return `${x} Waarde ${p.value>=v0?'+':''}${fmt(p.value-v0)}${R.lbl&&f>=.6?`, energielabel nu ${lblOf(p)}`:''}.`}

/* ---- verhuren ---- */
// [soort, icoon, huurfactor, referenties, betrouwbaarheid]
const TKIND=[['Student','🧑‍🎓',.92,'matig',[.35,.75]],['Jong stel','💑',1,'goed',[.6,.9]],['Gezin met kinderen','👨‍👩‍👧',1.02,'goed',[.65,.92]],['Expat','🧳',1.18,'onbekend',[.4,.95]],["Zzp'er met een hond",'🐕',.97,'matig',[.5,.85]],['Gepensioneerd stel','👵',.95,'uitstekend',[.85,.99]]];
function mkTenant(k){return {n:rname(),kind:k[0],em:k[1],rate:+(.045*k[2]*(.94+R()*.12)).toFixed(4),rel:ri(k[4][0]*100,k[4][1]*100)/100,ref:k[3],yrs:0,happy:70}}
function findTenant(p){if(!p.cand||p.cand.y!==year())p.cand={y:year(),l:[0,1,2].map(()=>mkTenant(pick(TKIND)))};
  if(!p.cand.l.length){toast('Dit jaar reageert niemand meer op je advertentie');return}
  modal({title:'Kandidaat-huurders',em:'🔑',cat:p.name,text:`Er reageren ${p.cand.l.length} mensen op je advertentie. Marktconform is ongeveer ${fmt(p.value*.045/12)} per maand.`,
    choices:opts(p.cand.l.map(t=>({t:`${t.em} ${t.n}, ${t.kind.toLowerCase()}`,s:`Biedt ${fmt(p.value*t.rate/12)} per maand · referenties: ${t.ref}`,on:()=>{closeModal();rentTerms(p,t)}})))})}
function rentTerms(p,t){modal({title:'Huurcontract',em:'📝',cat:p.name,text:`${t.n} wil graag huren voor ${fmt(p.value*t.rate/12)} per maand. Wat doe je?`,choices:opts([
  {t:'Akkoord',s:'Zoals geboden',cls:'go',on:()=>{closeModal();signTenant(p,t,'')}},
  {t:'10% meer vragen',s:'Meer geld, maar misschien haakt de huurder af',on:()=>{closeModal();if(chance(.45)){t.rate*=1.1;t.happy=55;signTenant(p,t,`${t.n} slikt even, maar gaat akkoord.`)}else{p.cand.l=p.cand.l.filter(x=>x!==t);result('Afgehaakt',`${t.n} vindt het te duur en zoekt verder.`,'',refreshSheet,{em:'🚪',cat:p.name})}}},
  {t:'5% korting geven',s:'Een tevreden huurder klaagt minder en blijft langer',on:()=>{closeModal();t.rate*=.95;t.happy=90;signTenant(p,t,`${t.n} is je dankbaar.`)}}])})}
function signTenant(p,t,pre){doAct('Huurder gevonden',()=>{p.ten=t;p.cand=null;p.rentOut=true;return `${pre?pre+' ':''}${t.n} huurt nu je ${p.name.toLowerCase()} voor ${fmt(p.value*t.rate/12)} per maand.`},true,'🔑')}
function raiseRent(p){const t=p.ten;modal({title:'Huur verhogen',em:'📈',cat:p.name,text:`${t.n} betaalt nu ${fmt(pRent(p)/12)} per maand. Hoeveel erbij?`,choices:opts([
  {t:'+3%',s:'Netjes volgens de inflatie',on:()=>{closeModal();doAct('Huurverhoging',()=>{S.acts['hv'+p.id]=1;t.rate*=1.03;t.happy=clamp(t.happy-4);return `${t.n} moppert, maar betaalt.`},true,'📈')}},
  {t:'+10%',s:'Lekker veel, als het lukt',on:()=>{closeModal();doAct('Huurverhoging',()=>{S.acts['hv'+p.id]=1;t.happy=clamp(t.happy-20);if(chance(.25))return `${t.n} stapt naar de Huurcommissie. De verhoging is niet redelijk en gaat niet door.`;if(t.happy<35&&chance(.5)){p.ten=null;p.rentOut=false;return `${t.n} pikt het niet en zegt de huur op. Je pand staat leeg.`}t.rate*=1.1;return `${t.n} is woedend, maar betaalt.`},true,'📈')}}])})}

/* ---- verkopen ---- */
function sellFlow(p){modal({title:'Verkopen',em:'🏷️',cat:p.name,text:`Geschatte waarde: ${fmt(p.value)}. Hoe wil je verkopen?`,choices:opts([
  {t:'🤵 Via een makelaar',s:'1,5% courtage, maar meer kijkers en betere biedingen',on:()=>{closeModal();askPrice(p,true)}},
  {t:'💻 Zelf verkopen via internet',s:'Geen kosten, minder kijkers',on:()=>{closeModal();askPrice(p,false)}}])})}
function askPrice(p,mak){modal({title:'Vraagprijs',em:'🏷️',cat:p.name,text:'Welke vraagprijs zet je erop?',choices:opts([[.95,'Scherp geprijsd','Veel kijkers, kans op een biedoorlog'],[1,'Marktwaarde','Wat de makelaar adviseert'],[1.1,'Hoog inzetten','Minder kijkers, misschien een gek']].map(([f,t,s])=>({t:`${t}: ${fmt(Math.round(p.value*f/1000)*1000)}`,s,on:()=>{closeModal();S.acts['vk'+p.id]=1;showOffers(p,mak,offersFor(p,mak,f))}})))})}
const BUYERS=['Een jong stel','Een gezin uit de buurt','Een belegger','Een starter','Een gepensioneerd stel','Een expat','Een gescheiden vader','Een projectontwikkelaar'];
function offersFor(p,mak,f){const e=econ();let n=ri(0,2)+(mak?2:0)+(e==='groei'?2:e==='recessie'?-1:0)+(f<1?2:f>1?-2:0)+(p.cond>70?1:p.cond<35?-1:0);n=clamp(n,0,6);
  const pen=p.def.filter(d=>!d.fixed).reduce((a,d)=>a+d.cost,0)*.9,ten=p.ten?.9:1,out=[],who=BUYERS.slice().sort(()=>R()-.5);
  for(let i=0;i<n;i++){const a=p.value*f*(.9+R()*.1+(e==='groei'?.04:e==='recessie'?-.05:0)+(f<1?n*.012:0)+(mak?.02:0))*ten-pen;out.push({n:who[i],a:Math.max(1000,Math.round(a/1000)*1000),vb:chance(.3)})}
  return out.sort((a,b)=>b.a-a.a)}
function showOffers(p,mak,offs,note){const pen=p.def.some(d=>!d.fixed);
  if(!offs.length){result('Geen biedingen',`${note?note+' ':''}Er kwamen wat kijkers, maar niemand bood. Probeer het volgend jaar opnieuw, met een lagere vraagprijs${pen?' of na het herstellen van de gebreken':''}.`,'',refreshSheet,{em:'🦗',cat:p.name});return}
  const fee=a=>mak?Math.round(a*.015):0;
  const ch=offs.slice(0,4).map(o=>({t:`${o.n}: ${fmt(o.a)}`,s:o.vb?'Onder voorbehoud van financiering':'Zonder voorbehoud',on:()=>{closeModal();if(o.vb&&chance(.25)){offs.splice(offs.indexOf(o),1);return showOffers(p,mak,offs,`${o.n} krijgt de hypotheek niet rond. Die koop gaat niet door.`)}sellProp(p,o.a,fee(o.a))}}));
  if(!offs.ct)ch.push({t:'↩️ Tegenbod op het hoogste bod',s:'Vraag 2 tot 5% meer. Misschien haakt de koper af',on:()=>{closeModal();offs.ct=1;const o=offs[0];if(chance(.5)){o.a=Math.round(o.a*(1+ri(2,5)/100)/1000)*1000;showOffers(p,mak,offs,`${o.n} gaat akkoord met ${fmt(o.a)}.`)}else{offs.shift();showOffers(p,mak,offs,`${o.n} haakt af.`)}}});
  ch.push({t:'Toch niet verkopen',cls:'ghost',on:()=>{closeModal();refreshSheet()}});
  modal({title:`${offs.length} bieding${offs.length===1?'':'en'}`,em:'📬',cat:p.name,text:`${note?note+' ':''}Geschatte waarde: ${fmt(p.value)}.${pen?' Kopers lieten een keuring doen en trekken de gebreken van hun bod af.':''}${p.ten?' Verhuurd verkopen drukt de prijs.':''}${mak?' De makelaar rekent 1,5% bij verkoop.':''}`,choices:ch})}
function sellProp(p,amt,fee){doAct('Verkocht',()=>{const get=Math.round(amt-fee-p.mort);if(get<0)S.loan+=-get;else cash(get);const home=S.home.pid===p.id;S.props=S.props.filter(x=>x!==p);
  if(home)S.home=living(['moeder','vader']).length&&ageY()<30?{k:'ouders'}:{k:'huur',name:'Appartement',rent:16500};const w=amt-p.buy;
  return `Je ${p.name.toLowerCase()} aan de ${p.addr.split(',')[0]} is verkocht voor ${fmt(amt)}${fee?`, min ${fmt(fee)} courtage`:''}${p.mort>0?` en ${fmt(p.mort)} hypotheek`:''}. ${get>=0?`Je houdt ${fmt(get)} over.`:`Je huis stond onder water: ${fmt(-get)} restschuld komt bij je leningen.`} ${w>=0?`Winst op je aankoop: ${fmt(w)}.`:`Verlies op je aankoop: ${fmt(-w)}.`}`},true,'🏷️');closeSheetLevel()}

/* ---- jaarlijks ---- */
function houseYear(){let ev=0;
  for(const p of S.props.slice()){ph(p);const W=WIJK[p.w]||WIJK[2];
    setCond(p,-ri(1,4)*(p.air?2:1)*(p.ten&&p.ten.kind==='Student'?1.4:1));p.value=Math.round(p.value*(1+W[2]));
    for(const d of p.def)if(d.seen&&!d.fixed&&chance(.25)){d.cost=Math.round(d.cost*1.25/100)*100;setCond(p,-4);L(`${defN(d.k)} aan de ${p.addr.split(',')[0]} wordt erger. Herstel kost nu ${fmt(d.cost)}.`,'bad')}
    if(!ev){const lat=p.def.find(d=>!d.seen);if(lat&&chance(.22)){ev=1;Q.push({id:'h_gebrek',c:{pid:p.id,k:lat.k}})}}
    if(S.home.pid===p.id){if(p.cond<30){L('Je huis valt langzaam uit elkaar. Tijd voor onderhoud.','bad')}if(W[4])hap(W[4]);if(p.reno.some(r=>r.k==='zwembad'||r.k==='tuin'))hap(1)}
    if(p.ten){const t=p.ten;t.yrs++;t.happy=clamp(t.happy+(p.cond-55)/6+ri(-6,4));
      if(t.happy<25&&chance(.5)){L(`${t.n} zegt de huur op: ${p.cond<45?'het huis is te slecht onderhouden':'niet blij met de verhuurder'}. Je pand staat leeg.`,'bad');p.ten=null;p.rentOut=false;continue}
      if(t.yrs>1&&chance(.07)){L(`${t.n} gaat verhuizen en zegt de huur op. Je ${p.name.toLowerCase()} staat leeg.`);p.ten=null;p.rentOut=false;continue}
      if(!ev&&chance(.35)){ev=1;const r=R();const id=r<(1-t.rel)*.8?'h_laat':p.cond<55&&r<.7?'h_klacht':r<.85?'h_schade':'h_koop';Q.push({id,c:{pid:p.id,a:Math.round(p.value*(.93+R()*.12)/1000)*1000}})}}
    if(p.air&&!ev&&chance(.4)){ev=1;Q.push({id:'h_air',c:{pid:p.id}})}}}
const hasTen=c=>{const p=pp(c.pid);return !!(p&&p.ten)};
E('h_gebrek',{sys:1,need:c=>{const p=pp(c.pid);return !!(p&&p.def.some(d=>d.k===c.k&&!d.seen))},t:'Verborgen gebrek',x:c=>{const p=pp(c.pid),d=DEFS.find(x=>x[0]===c.k);return `${d[2]} In je ${p.name.toLowerCase()} aan de ${p.addr.split(',')[0]}: ${d[1].toLowerCase()}. Herstel kost ${fmt(p.def.find(x=>x.k===c.k).cost)}.`},ch:[
 ['🛠️ Meteen laten herstellen',c=>{const p=pp(c.pid),d=p.def.find(x=>x.k===c.k);cash(-d.cost);d.seen=d.fixed=true;setCond(p,4);return 'Pijnlijk voor je spaarrekening, maar het is opgelost.'}],
 ['⚖️ De vorige eigenaar aansprakelijk stellen',c=>{const p=pp(c.pid),d=p.def.find(x=>x.k===c.k);d.seen=true;const k=Math.round(1500*hcpi());cash(-k);const lang=year()-(p.boughtY??0)>3;if(!lang&&chance(.4)){cash(d.cost);return `De rechter vindt dat de verkoper het had moeten melden. Je krijgt ${fmt(d.cost)}.`}hap(-1);return `Je verliest de zaak en ${fmt(k)} aan advocaatkosten.${lang?' Het is te lang geleden dat je het huis kocht.':''}`}],
 ['🙈 Voorlopig laten zitten',c=>{const p=pp(c.pid);p.def.find(x=>x.k===c.k).seen=true;return 'Het gebrek blijft. Het wordt er niet beter op.'}]]});
E('h_laat',{sys:1,need:hasTen,t:'Huur te laat',x:c=>{const p=pp(c.pid);return `${p.ten.n}, je huurder aan de ${p.addr.split(',')[0]}, heeft al twee maanden geen huur betaald.`},ch:[
 ['💬 Vriendelijk aanmanen',c=>{const p=pp(c.pid),t=p.ten;if(chance(t.rel)){t.happy=clamp(t.happy+5);return `${t.n} biedt excuses aan en betaalt alles terug.`}const k=Math.round(pRent(p)/6);cash(-k);return `${t.n} belooft beterschap, maar je ziet ${fmt(k)} nooit meer terug.`}],
 ['📨 Incassobureau inschakelen',c=>{const p=pp(c.pid),t=p.ten;const k=Math.round(600*hcpi());cash(-k);t.happy=clamp(t.happy-20);return `Het incassobureau haalt het geld binnen, min ${fmt(k)} kosten. ${t.n} is wel boos.`}],
 ['🚪 Huurder eruit laten zetten',c=>{const p=pp(c.pid),t=p.ten;const k=Math.round(2500*hcpi()+pRent(p)/3);cash(-k);p.ten=null;p.rentOut=false;return `Na een rechtszaak van maanden is ${t.n} weg. Kosten en gemiste huur: ${fmt(k)}.`}]]});
E('h_klacht',{sys:1,need:hasTen,t:'Klacht van je huurder',x:c=>{const p=pp(c.pid);return `${p.ten.n} belt: ${pick(['er zit schimmel in de badkamer','de cv-ketel doet het niet meer','het lekt bij het slaapkamerraam','de voordeur klemt en gaat niet meer op slot'])}.`},ch:[
 ['👷 Meteen een vakman sturen',c=>{const p=pp(c.pid),t=p.ten;const k=ri(4,15)*100*hcpi();cash(-k);setCond(p,6);t.happy=clamp(t.happy+15);return `Binnen twee dagen opgelost voor ${fmt(k)}. ${t.n} is blij.`}],
 ['🔧 Zelf langsgaan met je gereedschap',c=>{const p=pp(c.pid),t=p.ten;if(chance(.4+S.sk.tech/200)){setCond(p,4);t.happy=clamp(t.happy+8);sk('tech',2);return 'Je fikst het zelf. Scheelt weer een vakman.'}const k=ri(6,20)*100*hcpi();cash(-k);t.happy=clamp(t.happy-10);return `Je maakt het erger. Er moet alsnog een vakman komen: ${fmt(k)}.`}],
 ['🙉 Negeren',c=>{const p=pp(c.pid),t=p.ten;t.happy=clamp(t.happy-25);if(chance(.35)){t.rate*=.8;return `${t.n} stapt naar de Huurcommissie. De huur gaat 20% omlaag.`}return `${t.n} is woedend.`}]]});
E('h_schade',{sys:1,need:hasTen,t:'Schade aan je pand',x:c=>{const p=pp(c.pid);return `Bij een controle zie je dat ${p.ten.n} ${pick(['een gat in de muur heeft gemaakt','de houten vloer heeft verpest','de tuin compleet heeft laten verwilderen','alle deuren heeft laten openkrabben door een kat'])}.`},ch:[
 ['💰 Laten betalen uit de borg',c=>{const p=pp(c.pid),t=p.ten;setCond(p,-2);t.happy=clamp(t.happy-20);return chance(t.rel)?`${t.n} gaat akkoord. De schade is gedekt.`:(cash(-ri(5,20)*100*hcpi()),`${t.n} weigert en dreigt met een advocaat. Je betaalt het maar zelf.`)}],
 ['🤷 Zelf betalen voor de lieve vrede',c=>{const p=pp(c.pid);const k=ri(5,25)*100*hcpi();cash(-k);t_(p,10);return `Het kost je ${fmt(k)}, maar de relatie blijft goed.`}],
 ['📝 Een officiële waarschuwing',c=>{const p=pp(c.pid);setCond(p,-6);t_(p,-15);return 'De huurder belooft het beter te doen. De schade blijft voorlopig zitten.'}]]});
const t_=(p,d)=>{if(p.ten)p.ten.happy=clamp(p.ten.happy+d)};
E('h_koop',{sys:1,need:hasTen,t:'Je huurder wil kopen',x:c=>{const p=pp(c.pid);return `${p.ten.n} woont met plezier aan de ${p.addr.split(',')[0]} en wil het pand kopen voor ${fmt(c.a)}. De geschatte waarde is ${fmt(p.value)}.`},ch:[
 ['🤝 Verkopen',c=>{const p=pp(c.pid);const get=Math.round(c.a-p.mort);cash(get);S.props=S.props.filter(x=>x!==p);L(`Je hebt je ${p.name.toLowerCase()} aan je huurder verkocht.`,'good');return `Verkocht! Na aflossing van de hypotheek hou je ${fmt(get)} over.`}],
 ['🙅 Nee, ik houd het',c=>{t_(pp(c.pid),-5);return 'Je houdt het pand. Je huurder is een beetje teleurgesteld.'}]]});
E('h_air',{sys:1,need:c=>{const p=pp(c.pid);return !!(p&&p.air)},t:'Kortverhuur',f:c=>{const p=pp(c.pid);const r=R(),cen=p.w<=1;
  if(r<(cen?.35:.15)){const k=ri(5,20)*1000*hcpi();cash(-k);hap(-2);return `De gemeente betrapt je op te veel verhuurnachten. Boete: ${fmt(k)}.`}
  if(r<.55){const k=ri(5,30)*100*hcpi();cash(-k);setCond(p,-8);return `Een groep toeristen houdt een feest in je ${p.name.toLowerCase()}. Schade: ${fmt(k)}.`}
  if(r<.8){const k=Math.round(pRent(p)*.15);cash(k);return `Je pand krijgt alleen maar vijf sterren. Door extra boekingen verdien je ${fmt(k)} bij.`}
  hap(-1);return 'De buren klagen over rolkoffers om drie uur \'s nachts.'}});

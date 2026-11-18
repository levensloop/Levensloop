/* ================= FASE 20: wonen =================
   Keuzes Thijmen: inrichten en verbouwen, buren als personen, verhuizen naar een andere stad (dichtbij: op en neer reizen of thuiswerken), studentenhuis.
   Bestond al: verbouwen (house.js sheetReno), buren met naam en karakter (realty.js nbPpl), studentenkamer als huurwoning.
   20.1 steden: ligging en prijsniveau (CITY20); huizen en huur kosten per stad iets anders
   20.2 verhuizen naar een andere stad (moveCity): baan (forenzen / thuiswerken / ontslag), huis (verkopen / houden), vrienden en partner; reizen (S.cmt)
   20.3 thuiswerken (S.job.rem) en inrichten (S.home.inr)
   20.4 buren: schutting, oppassen, buurtapp
   20.5 studentenhuis: hospiteeravond, schoonmaakrooster, huisfeest, huisoudste (S.sth) */

// ---------- 20.1 steden ----------
const CITY20={Amsterdam:[52.37,4.90,1.6],Rotterdam:[51.92,4.48,1.15],'Den Haag':[52.08,4.30,1.25],Utrecht:[52.09,5.12,1.35],Eindhoven:[51.44,5.48,1.1],Groningen:[53.22,6.57,.9],Maastricht:[50.85,5.69,.95],Breda:[51.59,4.78,1],Zwolle:[52.51,6.09,.95],Nijmegen:[51.84,5.86,1],Haarlem:[52.38,4.64,1.4],Tilburg:[51.56,5.09,.95],
  Antwerpen:[51.22,4.40,1.1],Gent:[51.05,3.72,1.1],Brussel:[50.85,4.35,1.2],Leuven:[50.88,4.70,1.15],Brugge:[51.21,3.22,1],Hasselt:[50.93,5.34,.9],
  Berlijn:[52.52,13.40,1.2],'München':[48.14,11.58,1.6],Hamburg:[53.55,9.99,1.3],Keulen:[50.94,6.96,1.1],'Düsseldorf':[51.23,6.77,1.15],Aken:[50.78,6.08,.9],
  Londen:[51.51,-.13,1.8],Manchester:[53.48,-2.24,1],Liverpool:[53.41,-2.98,.85],Edinburgh:[55.95,-3.19,1.1],Bristol:[51.45,-2.59,1.15],
  'New York':[40.71,-74,1.9],'Los Angeles':[34.05,-118.24,1.7],Chicago:[41.88,-87.63,1.1],Miami:[25.76,-80.19,1.3],Austin:[30.27,-97.74,1.1],Seattle:[47.61,-122.33,1.5],
  Toronto:[43.65,-79.38,1.4],Vancouver:[49.28,-123.12,1.6],Montreal:[45.5,-73.57,1],Calgary:[51.05,-114.07,.95],
  Parijs:[48.86,2.35,1.8],Lyon:[45.76,4.84,1.1],Marseille:[43.3,5.37,.95],Nice:[43.7,7.27,1.3],Bordeaux:[44.84,-.58,1.1],
  Rome:[41.9,12.5,1.3],Milaan:[45.46,9.19,1.5],Napels:[40.85,14.27,.85],Florence:[43.77,11.26,1.25],Bologna:[44.49,11.34,1.1],Ancona:[43.62,13.52,.85],
  Madrid:[40.42,-3.7,1.3],Barcelona:[41.39,2.17,1.4],Valencia:[39.47,-.38,.95],Sevilla:[37.39,-5.98,.85],'Málaga':[36.72,-4.42,1.05],
  Sydney:[-33.87,151.21,1.6],Melbourne:[-37.81,144.96,1.3],Brisbane:[-27.47,153.03,1.05],Perth:[-31.95,115.86,.95],
  Tokio:[35.68,139.69,1.6],Osaka:[34.69,135.5,1.1],Kyoto:[35.01,135.77,1.05],Sapporo:[43.06,141.35,.8],Fukuoka:[33.59,130.4,.85],
  'São Paulo':[-23.55,-46.63,1.3],'Rio de Janeiro':[-22.91,-43.17,1.2],Salvador:[-12.97,-38.5,.75],'Brasília':[-15.79,-47.88,1],
  'Mexico-Stad':[19.43,-99.13,1.2],Guadalajara:[20.66,-103.35,.95],Monterrey:[25.69,-100.32,1.05],'Cancún':[21.16,-86.85,1.1],
  Kaapstad:[-33.92,18.42,1.3],Johannesburg:[-26.2,28.05,1],Durban:[-29.86,31.02,.85],
  Istanbul:[41.01,28.98,1.4],Ankara:[39.93,32.86,.9],Izmir:[38.42,27.14,1],Antalya:[36.9,30.71,.95],
  Casablanca:[33.57,-7.59,1.2],Marrakech:[31.63,-8.01,1],Rabat:[34.02,-6.84,1.1],Tanger:[35.76,-5.83,.9],
  Jakarta:[-6.21,106.85,1.3],Denpasar:[-8.65,115.22,1.1],Surabaya:[-7.25,112.75,.9],Bandung:[-6.91,107.61,.85]};
function cityKm(a,b){const A=CITY20[a],B=CITY20[b];if(!A||!B)return 150;const r=Math.PI/180,dl=(B[0]-A[0])*r,dg=(B[1]-A[1])*r;const h=Math.sin(dl/2)**2+Math.cos(A[0]*r)*Math.cos(B[0]*r)*Math.sin(dg/2)**2;return Math.round(6371*2*Math.asin(Math.sqrt(h))*1.25)}// ×1,25: over de weg
function cityIdx(c){c=c||(S&&S.p&&S.p.city);const L=((COUNTRIES[S.p.country]||{}).cities||[]).filter(x=>CITY20[x]);if(!CITY20[c]||!L.length)return 1;return CITY20[c][2]/(L.reduce((t,x)=>t+CITY20[x][2],0)/L.length)}
const idxTxt=k=>k>=1.08?`wonen ${Math.round((k-1)*100)}% duurder`:k<=.92?`wonen ${Math.round((1-k)*100)}% goedkoper`:'wonen ongeveer even duur';
mkListing=(f=>function(ci){const h=f.apply(this,arguments);if(h&&HCAT[h.cat]&&!HCAT[h.cat][5]){const k=cityIdx();if(k!==1){h.price=Math.round(h.price*k/1000)*1000;for(const d of h.def||[])d.cost=Math.round(d.cost*Math.sqrt(k)/100)*100}}return h})(mkListing);
sheetRent=(f=>function(el){const k=cityIdx();if(k===1)return f.apply(this,arguments);const keep=RENTALS.map(r=>r[1]);RENTALS.forEach(r=>{r[1]=Math.round(r[1]*k/120)*120});try{return f.apply(this,arguments)}finally{RENTALS.forEach((r,i)=>{r[1]=keep[i]})}})(sheetRent);

// ---------- 20.2 verhuizen naar een andere stad ----------
const REMOTEJ=['dev','designer','architect','ingenieur','journalist','marketeer','accountant','consultant'];
const canRemote=()=>!!S.job&&(jobGroup(S.job.id)==='kantoor'||REMOTEJ.includes(S.job.id));
const cmtMin=km=>Math.round(15+km*.68);// minuten enkele reis
const cmtCost=km=>Math.round(km*2*.19*214*(S.cpi||1)/10)*10;// per jaar
function moveCity(){if(inJail()){toast('Niet vanuit de gevangenis');return}if(ageY()<18){toast('Vanaf 18 jaar');return}
  const cs=((COUNTRIES[S.p.country]||{}).cities||[]).filter(c=>c!==S.p.city).map(c=>[c,cityKm(S.p.city,c)]).sort((a,b)=>a[1]-b[1]);if(!cs.length){toast('Er is geen andere stad');return}
  modal({title:'Verhuizen',em:'🚚',cat:`Nu: ${S.p.city}`,text:'Naar welke stad verhuis je?',choices:opts(cs.map(([c,km])=>({t:c,s:`${km} km · ${idxTxt(cityIdx(c))}`,on:()=>{closeModal();moveJob(c,km)}})))})}
function moveJob(c,km){const W={c,km};if(!S.job){return moveHouse(W)}const ch=[];
  if(km<=110)ch.push({t:'🚆 Blijven werken en op en neer reizen',s:`Ongeveer ${cmtMin(km)} minuten enkele reis · ${fmt(cmtCost(km))} per jaar`,on:()=>{closeModal();W.job='reis';moveHouse(W)}});
  if(canRemote())ch.push({t:'💻 Thuiswerken',s:km<=110?'Eén dag per week naar kantoor':'Een paar keer per maand naar kantoor',on:()=>{closeModal();W.job='thuis';moveHouse(W)}});
  ch.push({t:'👋 Ontslag nemen',s:`Je zoekt nieuw werk in ${c}`,on:()=>{closeModal();W.job='stop';moveHouse(W)}});
  modal({title:'En je werk?',em:'💼',cat:`Naar ${c} · ${km} km`,text:`Je werkt nu als ${jobTitle().toLowerCase()}.${km>110&&!canRemote()?' Dat is te ver om elke dag op en neer te reizen.':''}`,choices:opts(ch)})}
function moveHouse(W){const h=S.home;const hp=h.k==='eigen'?pp(h.pid):null;if(!hp)return moveGo(W);
  const net=Math.round((hp.value||0)*.98-(hp.mort||0));
  modal({title:'En je huis?',em:hIcon(hp.name),cat:`Naar ${W.c}`,text:`Je woont nu in je eigen ${hp.name.toLowerCase()}.`,choices:opts([
    {t:'💰 Verkopen',s:`Je houdt ongeveer ${fmt(Math.max(0,net))} over`,on:()=>{closeModal();W.house='sell';moveGo(W)}},
    {t:'🔑 Houden en verhuren',s:'Je kunt het later verhuren of verkopen',on:()=>{closeModal();W.house='keep';moveGo(W)}}])})}
function moveGo(W){doAct('Verhuisd!',()=>{const from=S.p.city,c=W.c,km=W.km,cp=S.cpi||1;const out=[];
  if(W.house==='sell'){const hp=pp(S.home.pid);if(hp){const net=Math.round((hp.value||0)*.98-(hp.mort||0));S.props=S.props.filter(x=>x!==hp);if(net>=0)cash(net);else S.loan+=-net;out.push(`Je verkoopt je huis${net>0?` (je houdt ${fmt(net)} over)`:''}.`)}}
  if(W.job==='stop'){out.push(`Je neemt ontslag als ${jobTitle().toLowerCase()}.`);endJob();S.cmt=null}else if(W.job==='reis'){S.cmt={km,from};S.job.rem=0;out.push(`Je reist voortaan ${cmtMin(km)} minuten naar je werk in ${from}.`)}else if(W.job==='thuis'){S.cmt={km,from};S.job.rem=1;out.push(`Je werkt voortaan vooral thuis.`)}
  S.p.city=c;S.flags.mk=null;S.nb=null;const rent=Math.round(16500*cp*cityIdx(c)/120)*120;S.home={k:'huur',name:'Appartement',rent};
  const pt=partner();if(pt&&!pt.live&&km>40){pt.rel=clamp(pt.rel-8);out.push(`Met ${pt.first} heb je nu een relatie op afstand.`)}
  if(km>40){let n=0;for(const v of living('vriend')){v.rel=clamp(v.rel-ri(3,8));n++}if(n)out.push(`Je vrienden zie je minder vaak.`)}
  hap(3);MS(`Verhuisde van ${from} naar ${c}`,1);return `Je verhuist naar ${c} en huurt een appartement voor ${fmt(rent/12)} per maand. ${out.join(' ')}`},true,'🚚')}
sheetHousing=(f=>function(el){const r=f.apply(this,arguments);const a=ageY();if(a<18||inJail())return r;const s=sec(el,'Verhuizen en inrichten');
  row(s,{ic:'🚚',t:'Verhuizen naar een andere stad',s:`Je woont in ${S.p.city} · ${idxTxt(cityIdx())}`,dots:true,on:moveCity});
  if(S.home.k!=='ouders'){const I=S.home.inr;row(s,{ic:'🛋️',t:I?'Opnieuw inrichten':'Inrichten',s:I?`${I.st} · ${['basis','mooi','designer'][I.lvl]}`:'Kies een stijl voor je huis',dots:true,on:inrMenu})}
  return r})(sheetHousing);
// reizen en thuiswerken: elk jaar
setJob=(f=>function(){const r=f.apply(this,arguments);S.cmt=null;if(S.job)S.job.rem=0;return r})(setJob);
F8.year.push(a=>{if(!S.alive||inJail())return;if(!S.job){S.cmt=null;return}const C_=S.cmt;
  if(C_&&!S.job.rem){const k=cmtCost(C_.km);cash(-k);if(period&&period.out){period.out['Reiskosten']=(period.out['Reiskosten']||0)+k;period.exp+=k}if(C_.km>40)hap(-2);else if(C_.km>15)hap(-1);if(C_.km>60&&chance(.15))L(`🚆 Weer vertraging op weg naar ${C_.from}. Je kent de conducteur inmiddels bij naam.`)}
  else if(S.job.rem){if(C_){const k=Math.round(cmtCost(C_.km)/5);cash(-k)}hap(1);if(chance(.1))L(pick(['💻 Je werkt in je joggingbroek. Niemand die het ziet.','💻 Je kat loopt over je toetsenbord tijdens een belangrijke videocall.','💻 Je mist de koffieautomaat een beetje. De roddels nog meer.']))}
  // een gezellig ingericht huis
  const I=S.home&&S.home.inr;if(I&&I.lvl>=1&&chance(.5))hap(1)});
// in het werkscherm: thuiswerken en reizen
circRow=(f=>function(el,slot){const r=f.apply(this,arguments);if(slot==='work'&&S.job&&!['fame','politiek'].includes(jobGroup(S.job.id)))safe(()=>{const s=sec(el,'Waar werk je?');
  if(S.cmt)row(s,{ic:'🚆',t:`Reizen naar ${S.cmt.from}`,s:S.job.rem?`${S.cmt.km} km · je werkt vooral thuis`:`${S.cmt.km} km · ${cmtMin(S.cmt.km)} minuten enkele reis · ${fmt(cmtCost(S.cmt.km))} per jaar`});
  if(canRemote())row(s,{ic:'💻',t:S.job.rem?'Weer naar kantoor':'Thuiswerken',s:S.job.rem?'Je werkt nu vooral thuis':'Vraag je baas of je vaker thuis mag werken',dots:true,on:()=>doAct('Thuiswerken',()=>{if(S.job.rem){S.job.rem=0;return 'Je gaat weer elke dag naar kantoor. De collega\'s zijn blij je te zien.'}if(chance(.75)){S.job.rem=1;return 'Je baas vindt het prima, zolang je werk af komt.'}return '"Liever niet," zegt je baas. "We zien je graag op kantoor."'},true,'💻')});
  else row(s,{ic:'🏢',t:'Thuiswerken',s:'Kan niet in jouw vak',dis:true})});return r})(circRow);

// ---------- 20.3 inrichten ----------
const STY20=[['🪴','Scandinavisch'],['🏭','Industrieel'],['🌾','Landelijk'],['🛋️','Modern'],['✨','Luxe en chic'],['🎨','Kleurrijk en gek']];
function inrMenu(){const cp=S.cpi||1;modal({title:'Inrichten',em:'🛋️',cat:'Wonen',text:'Welke stijl kies je?',choices:opts(STY20.map(([e,st])=>({t:`${e} ${st}`,on:()=>{closeModal();
  modal({title:st,em:e,cat:'Inrichten',text:'Hoeveel geef je uit?',choices:opts([['Basis (bouwmarkt en tweedehands)',1500,0],['Mooi (nieuwe meubels)',6000,1],['Designer (alles van topmerken)',25000,2]].map(([t,k,lv])=>({t,s:fmt(Math.round(k*cp)),dis:S.money<k*cp,on:()=>{closeModal();doAct('Ingericht',()=>{cash(-Math.round(k*cp));S.home.inr={st,lvl:lv,y:year()};hap(3+lv*3);
    return lv===0?`Na drie weekenden schroeven staat alles. Je huis is ${st.toLowerCase()} en echt van jou.`:lv===1?`Je huis is helemaal ${st.toLowerCase()} ingericht. Visite zegt: "Wauw."`:`Een interieurstylist richt alles ${st.toLowerCase()} in. Het lijkt wel een tijdschrift.`},true,e)}})))})}})))})}

// ---------- 20.4 buren ----------
E('nb_schutting',{need:c=>!!NB(c),a:[20,100],cd:6,w:.6,c:()=>S.home.k==='eigen',t:'De schutting',ctx:nbCtx(),x:c=>`${NB(c).first} wil een nieuwe schutting tussen jullie tuinen. "We delen de kosten toch?"`,ch:[
  ['🤝 Samen betalen',c=>{const p=NB(c);const k=Math.round(ri(3,8)*100*(S.cpi||1));cash(-k);p.rel=clamp(p.rel+8);return `Jullie zetten hem samen neer, met een biertje erbij. Jouw deel: ${fmt(k)}.`}],
  ['🙅 Weigeren',c=>{const p=NB(c);p.rel=clamp(p.rel-15);return `${p.first} zet hem dan zelf neer. Twintig centimeter op jouw grond. De oorlog is begonnen.`}],
  ['🌳 Liever een heg',c=>{const p=NB(c);p.rel=clamp(p.rel+(chance(.5)?5:-5));hap(1);return chance(.5)?`${p.first} vindt het een mooi idee. Over drie jaar is hij hoog genoeg.`:`${p.first} moppert over "al dat groen", maar gaat akkoord.`}]]});
E('nb_oppas',{need:c=>!!NB(c),a:[12,100],cd:7,w:.35,t:'Oppassen',ctx:nbCtx(p=>p.rel>=40),x:c=>`${NB(c).first} gaat twee weken op vakantie en vraagt of jij op ${pick(['de kat','de planten','de vissen','de konijnen'])} wilt passen.`,ch:[
  ['🔑 Natuurlijk',c=>{const p=NB(c);p.rel=clamp(p.rel+10);if(chance(.15)){p.rel=clamp(p.rel-6);return `Alles gaat goed, tot je de laatste dag vergeet de deur dicht te doen. ${p.first} lacht er gelukkig om.`}if(ageY()<18)cash(ri(2,5)*10);return `Je doet het netjes. ${p.first} neemt een fles ${pick(['wijn','olijfolie','limoncello'])} voor je mee.`}],
  ['🙅 Geen tijd',c=>{const p=NB(c);p.rel=clamp(p.rel-4);return `${p.first} vraagt de overburen.`}]]});
E('nb_app',{need:c=>!!NB(c),a:[16,100],cd:5,w:.5,t:'De buurtapp',ctx:nbCtx(),x:c=>`In de buurtapp klaagt ${NB(c).first} dat ${pick(['jouw kliko al drie dagen aan de straat staat','er iemand verkeerd parkeert, met een foto van jouw auto','er iemand elke ochtend om zes uur stofzuigt'])}.`,ch:[
  ['😂 Grappig reageren',c=>{const p=NB(c);if(chance(.6)){p.rel=clamp(p.rel+4);sk('sociaal',1);return 'Je reactie krijgt 14 duimpjes. Zelfs '+p.first+' moet lachen.'}p.rel=clamp(p.rel-6);return `${p.first} vindt het niet grappig. Een ander buur ook niet.`}],
  ['🙏 Sorry zeggen',c=>{const p=NB(c);p.rel=clamp(p.rel+3);return 'Je biedt je excuses aan. Het wordt een rustige week in de app.'}],
  ['🔕 De app dempen',()=>{hap(1);return 'Je zet de buurtapp op stil. Wat een rust.'}]]});
Object.assign(EVMETA,{nb_schutting:['Buren','🪵'],nb_oppas:['Buren','🔑'],nb_app:['Buren','📱']});

// ---------- 20.5 studentenhuis ----------
const inSth=()=>S.home&&S.home.k==='huur'&&/Studentenkamer/.test(S.home.name||'');
const STH=()=>S.sth||(S.sth={y:year(),old:0});
setRent=(f=>function(name,rent){const was=inSth();const r=f.apply(this,arguments);if(/Studentenkamer/.test(name)&&!was&&!inJail()){S.sth={y:year(),old:0};if(!Q.some(q=>q.id==='st20_hospi'))Q.push({id:'st20_hospi'})}else if(!/Studentenkamer/.test(name))S.sth=null;return r})(setRent);
E('st20_hospi',{sys:1,need:()=>inSth(),t:'Hospiteeravond',x:'Voordat je de kamer krijgt, moet je op hospiteeravond. Twaalf studenten op de bank, één plek. Hoe pak je het aan?',ch:[
  ['😂 Grappen maken',()=>{if(chance(.5+S.sk.sociaal/250)){hap(4);return 'Je verhaal over je eerste kookpoging valt goed. Een uur later: "Welkom in huize Chaos!"'}return 'Het valt een beetje stil. Toch krijg je de kamer, omdat niemand anders hem wilde.'}],
  ['🍺 Een krat bier meenemen',()=>{cash(-Math.round(18*(S.cpi||1)));hap(3);return 'Dat werkt altijd. Je hebt de kamer.'}],
  ['🙂 Gewoon jezelf zijn',()=>{hap(2);return 'Je bent eerlijk en een beetje zenuwachtig. Ze kiezen voor jou.'}]]});
E('st20_afwas',{a:[17,30],c:()=>inSth(),cd:3,w:.9,t:'De afwas',x:'De keuken van je studentenhuis is een slagveld. Er staat iets in de koelkast dat beweegt.',ch:[
  ['📋 Een schoonmaakrooster maken',()=>{if(chance(.6)){sk('sociaal',1);for(const p of nbPpl())p.rel=clamp(p.rel+3);return 'Iedereen tekent. Na twee weken houdt de helft zich eraan. Een wonder.'}for(const p of nbPpl())p.rel=clamp(p.rel-3);return 'Je rooster hangt een maand aan de koelkast. Iemand heeft er een snor op getekend.'}],
  ['🧽 Zelf alles doen',()=>{hap(-2);for(const p of nbPpl())p.rel=clamp(p.rel+2);return 'Drie uur schrobben. Je huisgenoten noemen je voortaan "de held".'}],
  ['🚪 Het negeren',()=>{hea(-1);return 'Je eet een week bij de snackbar. De keuken blijft wat hij was.'}]]});
E('st20_feest',{a:[17,30],c:()=>inSth(),cd:3,w:.8,t:'Huisfeest',x:'Je huisgenoten willen zaterdag een groot huisfeest geven. Thema: foute jaren 90.',ch:[
  ['🎉 Meedoen en mee organiseren',()=>{cash(-Math.round(40*(S.cpi||1)));hap(6);if(chance(.25)&&!partner()&&ageY()>=18){addPartner();return 'Het feest is legendarisch. En je danst de hele avond met iemand die je nog niet kende...'}if(chance(.2)){const f=addFriend();return f?`Legendarisch feest. Je raakt bevriend met ${f.first}.`:'Legendarisch feest.'}return 'Om vier uur komt de politie vragen of het wat zachter kan. Legendarisch.'}],
  ['📚 Naar de bibliotheek',()=>{sma(1);return 'Je studeert in alle rust. Als je thuiskomt, ligt er iemand die je niet kent op de bank te slapen.'}],
  ['😴 Oordopjes in',()=>{hap(-1);return 'Je slaapt er doorheen. Bijna.'}]]});
E('st20_oudste',{sys:1,need:()=>inSth(),t:'Huisoudste',x:'Jij woont nu het langst in huis. Je bent de nieuwe huisoudste! Er komt een kamer vrij. Wie kiezen jullie op de hospiteeravond?',ch:[
  ['🎸 De muzikant',()=>{STH().old=1;hap(3);return 'Hij speelt elke avond gitaar. Prachtig, behalve om twee uur \'s nachts.'}],
  ['📚 De serieuze student',()=>{STH().old=1;hap(1);sma(1);return 'Rustig, netjes, doet altijd de afwas. Saai, maar heerlijk.'}],
  ['🥳 De feestbeest',()=>{STH().old=1;hap(4);hea(-1);return 'Het huis wordt nooit meer stil. Je weet niet of dat goed of slecht is.'}]]});
Object.assign(EVMETA,{st20_hospi:['Studentenhuis','🛋️'],st20_afwas:['Studentenhuis','🍝'],st20_feest:['Studentenhuis','🎉'],st20_oudste:['Studentenhuis','👑']});
F8.year.push(()=>{if(!S.alive||!inSth())return;const H=STH();if(!H.old&&year()-H.y>=2&&chance(.6)&&!Q.some(q=>q.id==='st20_oudste'))Q.push({id:'st20_oudste'})});

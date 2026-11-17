/* ================= FASE 8.6: ERFSTUKKEN EN VERZAMELINGEN =================
   Erfstukken gaan altijd mee naar je erfgenaam (ze worden nooit verkocht bij je dood) en worden
   met elke generatie waardevoller. Verzamelingen bouw je stuk voor stuk op; een complete set is meer waard.
   S.coll = {it:[{id,k:'erf'|<set>,n,em,r,v,known,gen,from,y,sp:<set-stuk-index>,mus:1 = uitgeleend}], fam:[{...,hold:<persoon-id>}], done:{<set>:1}} */
const ERF=[['zakhorloge','⌚','Gouden zakhorloge',[800,6000]],['ring','💍','Familiering met een wapen',[1500,12000]],['bijbel','📖','Familiebijbel met stamboom',[200,3000]],['portret','🖼️','Portret van een voorouder',[2000,90000]],
  ['medaille','🎖️','Oorlogsmedaille',[300,5000]],['servies','🍽️','Antiek theeservies',[400,8000]],['viool','🎻','Oude viool',[1000,60000]],['broche','🧷','Art-decobroche',[500,15000]],['klok','🕰️','Staande klok',[1500,20000]],
  ['dagboek','📔','Dagboek van je overgrootmoeder',[50,2000]],['zwaard','🗡️','Ceremonieel zwaard',[800,30000]],['kaart','🗺️','Oude zeekaart',[600,25000]]];
const ERFFROM=['die het kreeg op de dag dat de oorlog voorbij was','die het altijd in een sok onder het bed bewaarde','die het won bij een weddenschap in een havencafé','die het meenam toen ze naar de stad verhuisde','die het van een kapitein kreeg','die er nooit over wilde praten'];
const SETS={
  postz:['✉️','Postzegels',[['Kerstzegel uit 1950',0],['Bloemenserie',0],['Zeilschepen',0],['Koningszegel met watermerk',0],['Luchtpostzegel',1],['Zegel met drukfout',1],['Driehoekige zegel',1],['Omgekeerd vliegtuigje',2]]],
  munt:['🪙','Munten',[['Oud dubbeltje',0],['Rijksdaalder',0],['Herdenkingsmunt',0],['Zilveren gulden',0],['Romeinse munt',1],['Gouden tientje',1],['Muntslagfout',1],['Gouden dukaat',2]]],
  vinyl:['💿','Vinylplaten',[['De Zingende Zusjes · Live',0],['Discokoorts 1978',0],['Herman en de Harmonica\'s',0],['Nachtvlucht · Single',0],['Eerste persing van Zilverstraat',1],['Gesigneerde hoes',1],['Testpersing in rood vinyl',1],['De verboden hoes',2]]],
  strip:['📚','Stripboeken',[['Kapitein Komeet 12',0],['De Bende van Bob',0],['Ridder Rommel',0],['Superslak deel 1',0],['Kapitein Komeet 1',1],['Fout gedrukte uitgave',1],['Gesigneerd door de tekenaar',1],['De allereerste Superslak',2]]],
  steen:['💎','Mineralen',[['Rozenkwarts',0],['Amethist',0],['Pyriet',0],['Malachiet',1],['Opaal',1],['Meteorietsplinter',2]]],
  auto:['🚗','Speelgoedauto\'s',[['Rode brandweerwagen',0],['Politie-Kever',0],['Gele taxi',0],['Racewagen nummer 7',0],['Melkwagen',0],['Doos met zes uit 1962',1],['Prototype zonder wielen',1],['Gouden jubileumauto',2]]],
  voetbal:['⚽','Voetbalplaatjes',[['Keeper van de kampioen',0],['Spits met snor',0],['Het hele elftal',0],['Trainer',0],['Mascotte',0],['Glimmend plaatje',1],['Debuut van een legende',1],['Plaatje met drukfout',1],['Gesigneerd door de aanvoerder',1],['Wereldkampioen in jeugdtenue',2]]]};
const RVAL=[[20,80],[150,600],[1500,15000]];
const RNM=['Gewoon','Zeldzaam','Heel zeldzaam'];
const coll=()=>S.coll||(S.coll={it:[],fam:[],done:{}});
const collV=x=>Math.round(x.v*(S.cpi||1));
function collVal(){if(!S.coll)return 0;let n=0;for(const x of S.coll.it)if(x.k!=='erf')n+=collV(x)*(S.coll.done[x.k]?1.5:1);return Math.round(n)}
const erfVal=()=>S.coll?S.coll.it.filter(x=>x.k==='erf').reduce((a,x)=>a+collV(x),0):0;
function mkErf(gen,from){const E_=pick(ERF);return {id:uid(),k:'erf',t:E_[0],n:E_[2],em:E_[1],v:ri(E_[3][0],E_[3][1]),known:0,gen,from:from||pick(ERFFROM),y:year()}}
// bij de geboorte: soms heeft de familie al een erfstuk, in bezit van een ouder
F8.birth.push((o,mom,dad)=>{const C_=coll();const n=(S.flags.wealth==='rijk'||o.afk)?ri(1,2):chance(.45)?1:0;for(let i=0;i<n;i++){const h=chance(.5)?mom:dad;const x=mkErf(ri(2,4),`van je ${pick(['overgrootvader','overgrootmoeder','betovergrootvader','oudoom'])}, ${pick(ERFFROM)}`);x.hold=h.id;C_.fam.push(x)}
  if(S.roy){const x={id:uid(),k:'erf',t:'tiara',n:'Diamanten tiara',em:'👑',v:ri(400,1500)*1000,known:1,gen:6,from:'van een verre voorouder op de troon',y:year(),hold:(P(S.roy.rp)||P(S.roy.mon)||mom).id};C_.fam.push(x)}});
F8.year.push(a=>{const C_=S.coll;if(!C_)return;
  // waardeverandering: zeldzame stukken stijgen harder
  for(const x of C_.it){const g=x.k==='erf'?.02+.004*Math.min(8,x.gen||1):[.005,.03,.05][x.r||0];x.v=Math.max(5,Math.round(x.v*(1+g+gauss()*.03)))}
  // erfstuk van een overleden ouder
  for(const x of C_.fam.slice()){const h=P(x.hold);if(!h||!h.alive){C_.fam=C_.fam.filter(y=>y!==x);if(!Q.some(q=>q.id==='erf_erfstuk'))Q.push({id:'erf_erfstuk',c:{x}})}}
  // museum: een kleine vergoeding
  const mus=C_.it.filter(x=>x.mus);if(mus.length){const g=Math.round(mus.reduce((s,x)=>s+collV(x),0)*.01);if(g>0)cash(g)}});
F8.inherit.push((old,n,ch,age)=>{const O=old.coll;if(!O)return;const keep=O.it.filter(x=>x.k==='erf').map(x=>Object.assign({},x,{gen:(x.gen||1)+1,mus:x.mus}));
  n.coll={it:keep,fam:[],done:{}};if(keep.length)L(`Je erft ${keep.length===1?'het erfstuk':'de erfstukken'} van de familie: ${f8List(keep.map(x=>x.n.toLowerCase()))}.`,'good');
  const sold=O.it.filter(x=>x.k!=='erf');if(sold.length)L(`De verzameling${Object.keys(O.done||{}).length?'en':''} van ${old.p.first} ${sold.length>1?'zijn':'is'} verkocht en verdeeld.`,'sys')});
function collRow(g){const C_=S.coll;const n=C_?C_.it.length:0;if(ageY()<8&&!n)return;row(g,{ic:'🏺',t:'Erfstukken en verzamelingen',s:n?`${C_.it.filter(x=>x.k==='erf').length} erfstukken · ${Object.keys(SETS).filter(k=>C_.it.some(x=>x.k===k)).length} verzamelingen`:'Begin een verzameling',on:()=>openSheet('Verzamelingen',sheetColl,true)})}
function sheetColl(el){const C_=coll(),a=ageY();
  card(el,kv([['Waarde verzamelingen',fmt(collVal())],['Geschatte waarde erfstukken',C_.it.some(x=>x.k==='erf'&&!x.known)?'deels onbekend':fmt(erfVal())]]));
  const e=sec(el,'Erfstukken');const ers=C_.it.filter(x=>x.k==='erf');
  for(const x of ers)row(e,{ic:x.em,t:x.n,s:`${x.gen>1?`${x.gen} generaties in de familie`:'Begint bij jou'} · ${x.known?fmt(collV(x)):'waarde onbekend'}${x.mus?' · in een museum':''}`,on:()=>openSheet(x.n,el2=>sheetErf(el2,x),true)});
  for(const x of C_.fam){const h=P(x.hold);if(h&&h.alive)row(e,{ic:x.em,t:x.n,s:`Nog bij je ${relWord(h)} ${h.first}`,dis:true})}
  if(!ers.length&&!C_.fam.length)empty(e,'Je hebt (nog) geen erfstukken.');
  if(a>=18){const el_=owned().filter(x=>['horloges','sieraden','kunst','verzamel','instrumenten'].includes(catOf(x)));if(el_.length)row(e,{ic:'✨',t:'Een bezitting tot erfstuk maken',s:'Gaat dan altijd mee naar je erfgenaam',dots:true,on:()=>modal({title:'Tot erfstuk maken',em:'✨',cat:'Erfstukken',text:'Welke bezitting wordt een familie-erfstuk? Je kunt het daarna nog steeds verkopen.',choices:opts(el_.slice(0,8).map(it=>({t:it.name,s:fmt(it.value),on:()=>{closeModal();S.items=S.items.filter(y=>y!==it);S.cars=S.cars.filter(y=>y!==it);C_.it.push({id:uid(),k:'erf',t:'eigen',n:it.name,em:it.em||'✨',v:Math.round(it.value/(S.cpi||1)),known:1,gen:1,from:`gekocht door ${S.p.first} in ${year()}`,y:year()});L(`${it.name} is vanaf nu een familie-erfstuk.`);refreshSheet();saveLife()}})))})})}
  const v=sec(el,'Verzamelingen');
  for(const [k,[em,nm,ps]] of Object.entries(SETS)){const have=new Set(C_.it.filter(x=>x.k===k).map(x=>x.sp));if(!have.size&&a<8)continue;
    row(v,{ic:em,t:nm,s:have.size?`${have.size} van ${ps.length}${C_.done[k]?' · compleet!':''}`:'Nog niet begonnen',cls:C_.done[k]?'cur':'',on:()=>openSheet(nm,el2=>sheetSet(el2,k),true)})}}
function sheetErf(el,x){const C_=coll();if(!C_.it.includes(x)){empty(el,'Dit erfstuk heb je niet meer.');return}
  card(el,`<h3>${x.em} ${he(x.n)}</h3><p class="muted" style="margin:0 0 6px">${he(cap(x.from||''))}.</p>${kv([['In de familie',x.gen>1?`${x.gen} generaties`:'sinds jou'],['Waarde',x.known?fmt(collV(x)):'Onbekend: laat het taxeren']])}`);
  const s=sec(el,'');
  if(!x.known)row(s,{ic:'🔍',t:'Laten taxeren',s:`Kost ${fmt(Math.round(150*(S.cpi||1)))}`,on:()=>doAct('Taxatie',()=>{cash(-Math.round(150*(S.cpi||1)));x.known=1;return erfReveal(x)},true,'🔍')});
  if(!x.mus)row(s,{ic:'🏛️',t:'Uitlenen aan een museum',s:'Goed voor je karma, je krijgt een kleine vergoeding',on:()=>doAct('Museum',()=>{x.mus=1;kar(3);return `Het museum zet ${x.n.toLowerCase()} in een vitrine, met een bordje met jullie familienaam.`},true,'🏛️')});
  else row(s,{ic:'🏠',t:'Terughalen uit het museum',on:()=>doAct('Museum',()=>{x.mus=0;return 'Het erfstuk staat weer thuis.'},true,'🏠')});
  const ks=living('kind').filter(k=>pAge(k)>=18);if(ks.length)row(s,{ic:'🎁',t:'Nu al aan een kind geven',dots:true,on:()=>modal({title:'Doorgeven',em:'🎁',cat:x.n,text:'Aan wie geef je het?',choices:opts(ks.map(k=>({t:k.first,on:()=>{closeModal();C_.it=C_.it.filter(y=>y!==x);k.rel=clamp(k.rel+12);hap(3);L(`Je geeft ${x.n.toLowerCase()} aan ${k.first}.`,'good');backSheet();saveLife()}})))})});
  row(s,{ic:'🏷️',t:'Verkopen',s:x.known?`Ongeveer ${fmt(collV(x))}`:'Zonder taxatie krijg je minder',dots:true,on:()=>ask('Verkopen?',`Een erfstuk dat ${x.gen>1?x.gen+' generaties':'jaren'} in de familie was. Weg is weg.`,'Verkopen',()=>doAct('Verkocht',()=>{const g=Math.round(collV(x)*(x.known?ri(85,110)/100:ri(30,60)/100));cash(g);C_.it=C_.it.filter(y=>y!==x);if(x.gen>=3){hap(-4);for(const p of living(['moeder','vader','broer','zus']))p.rel=clamp(p.rel-6)}return `Je verkoopt ${x.n.toLowerCase()} voor ${fmt(g)}.${x.gen>=3?' Je familie is er niet blij mee.':''}`},true,'🏷️'),'bad','🏷️')})}
function erfReveal(x){const r=R();
  if(r<.12){x.v=Math.round(x.v*ri(8,25));MS(`Ontdekte dat ${x.n.toLowerCase()} een fortuin waard is`,2);return `De taxateur wordt stil. Dit is ${pick(['het werk van een beroemde meester','een uniek stuk dat in boeken staat','een van de laatste drie die er nog zijn'])}. Waarde: ${fmt(collV(x))}!`}
  if(r<.27){x.v=Math.max(20,Math.round(x.v/ri(6,15)));return `Helaas: het is een namaakstuk uit de jaren 70. Waarde: ${fmt(collV(x))}. Maar het verhaal blijft mooi.`}
  return `De taxateur schat de waarde op ${fmt(collV(x))}. ${pick(['Een mooi stuk in goede staat.','Netjes bewaard door je familie.'])}`}
function sheetSet(el,k){const C_=coll(),[em,nm,ps]=SETS[k],a=ageY();const mine=C_.it.filter(x=>x.k===k);const have=new Set(mine.map(x=>x.sp));
  card(el,`<h3>${em} ${nm}</h3>${kv([['Compleet',`${have.size} van ${ps.length}`],['Waarde',fmt(mine.reduce((s,x)=>s+collV(x),0)*(C_.done[k]?1.5:1))],...(C_.done[k]?[['Bonus','Complete set: 50% meer waard']]:[])])}`);
  const st=sec(el,'De set');
  ps.forEach(([n,r],i)=>{const own=mine.filter(x=>x.sp===i);row(st,{ic:own.length?em:'🔒',t:n,s:`${RNM[r]}${own.length?` · ${fmt(collV(own[0]))}${own.length>1?` · ${own.length} stuks`:''}`:''}`,dis:!own.length,dots:own.length>1,on:own.length>1?()=>doAct('Dubbele verkocht',()=>{const x=own[1];const g=Math.round(collV(x)*ri(80,105)/100);cash(g);C_.it=C_.it.filter(y=>y!==x);return `Je verkoopt een dubbele ${n.toLowerCase()} voor ${fmt(g)}.`},true,em):null})});
  const s=sec(el,'Verzamelen');const cp=S.cpi||1;
  row(s,{ic:'🧺',t:'Naar de rommelmarkt',s:`${fmt(Math.round(25*cp))} · nog ${Math.max(0,3-(S.acts['rm'+k]||0))} keer dit jaar`,dis:(S.acts['rm'+k]||0)>=3||S.money<25*cp,on:()=>doAct('Rommelmarkt',()=>{S.acts['rm'+k]=(S.acts['rm'+k]||0)+1;cash(-Math.round(25*cp));const r=R()<.05?2:R()<.22?1:0;const opts_=ps.map((p,i)=>[p,i]).filter(([p])=>p[1]===r);const [p,i]=pick(opts_);collAdd(k,i);
    return `${r===2?'Ongelooflijk: tussen de rommel ligt ':r===1?'Wat een vondst: ':'Je vindt '}${p[0].toLowerCase()}${r?` (${RNM[r].toLowerCase()})`:''}. ${have.has(i)?'Die had je al: een dubbele.':''}`},true,'🧺')});
  const miss=ps.map((p,i)=>[p,i]).filter(([p,i])=>!have.has(i));
  if(miss.length&&a>=14)row(s,{ic:'🔨',t:'Op een veiling kopen',s:'Gericht een ontbrekend stuk kopen',dots:true,on:()=>modal({title:'Veiling',em:'🔨',cat:nm,text:'Welk stuk wil je hebben?',choices:opts(miss.map(([p,i])=>{const pr=Math.round(ri(RVAL[p[1]][0],RVAL[p[1]][1])*1.3*cp);return {t:p[0],s:`${RNM[p[1]]} · ${fmt(pr)}`,dis:S.money<pr,on:()=>{closeModal();doAct('Veiling',()=>{if(chance(.25))return 'Iemand aan de telefoon biedt steeds net iets meer. Je verliest de veiling.';cash(-pr);collAdd(k,i,pr/cp);return `De hamer valt. ${p[0]} is van jou voor ${fmt(pr)}.`},true,'🔨')}}}))})});
  if(mine.length)row(s,{ic:'💰',t:'De hele verzameling verkopen',s:`Aan een verzamelaar · ongeveer ${fmt(mine.reduce((s2,x)=>s2+collV(x),0)*(C_.done[k]?1.5:1))}`,dots:true,on:()=>ask('Alles verkopen?',`Je verkoopt al je ${nm.toLowerCase()}.`,'Verkopen',()=>doAct('Verkocht',()=>{const g=Math.round(mine.reduce((s2,x)=>s2+collV(x),0)*(C_.done[k]?1.5:1)*ri(90,105)/100);cash(g);C_.it=C_.it.filter(x=>x.k!==k);delete C_.done[k];return `Een verzamelaar koopt alles voor ${fmt(g)}.`},true,'💰'),'bad','💰')})}
function collAdd(k,i,v){const C_=coll(),[em,nm,ps]=SETS[k],p=ps[i];C_.it.push({id:uid(),k,sp:i,n:p[0],em,r:p[1],v:Math.round(v||ri(RVAL[p[1]][0],RVAL[p[1]][1])),y:year()});
  if(!C_.done[k]&&ps.every((_,j)=>C_.it.some(x=>x.k===k&&x.sp===j))){C_.done[k]=1;S.flags.setDone=1;MS(`Maakte de verzameling ${nm.toLowerCase()} compleet`,1);L(`Je verzameling ${nm.toLowerCase()} is compleet! Als set is hij veel meer waard.`,'good big')}}
E('erf_erfstuk',{sys:1,t:'Een erfstuk',x:c=>`${cap(c.x.n)} van je familie, ${c.x.from}, komt nu bij jou terecht.${living(['broer','zus']).length?' Je broers en zussen hadden het ook graag gehad.':''}`,
  ch:[['🏺 Bewaren',c=>{coll().it.push(c.x);c.x.hold=null;hap(2);if(living(['broer','zus']).length)for(const p of living(['broer','zus']))p.rel=clamp(p.rel-4);return `${cap(c.x.n)} krijgt een ereplaats in je huis.`}],
   ['🎁 Aan een broer of zus geven',c=>{const p=living(['broer','zus']).sort((a,b)=>b.rel-a.rel)[0];if(p){p.rel=clamp(p.rel+15);kar(3)}return `Je geeft het aan ${p?p.first:'je familie'}. Daar zijn ze je heel dankbaar voor.`},()=>living(['broer','zus']).length>0],
   ['🏷️ Verkopen en het geld delen',c=>{const g=Math.round(collV(c.x)*ri(40,90)/100);const n=1+living(['broer','zus']).length;cash(Math.round(g/n));return `Het erfstuk wordt verkocht voor ${fmt(g)}. Jouw deel: ${fmt(Math.round(g/n))}.`}]]});
E('erf_tv',{a:[25,90],w:()=>S.coll&&S.coll.it.some(x=>x.k==='erf'&&!x.known)?4:0,cd:10,c:()=>!!(S.coll&&S.coll.it.some(x=>x.k==='erf')),ctx:()=>{const xs=S.coll.it.filter(x=>x.k==='erf');const x=xs.find(y=>!y.known)||pick(xs);return {id:x.id}},t:'Op tv met je erfstuk',x:c=>{const x=S.coll.it.find(y=>y.id===c.id);return `Een tv-programma met taxateurs komt naar je stad. Je staat met ${x?x.n.toLowerCase():'je erfstuk'} in de rij.`},
  ch:[['📺 Laten zien op tv',c=>{const x=S.coll.it.find(y=>y.id===c.id);if(!x)return 'Je bent het erfstuk thuis vergeten.';x.known=1;S.fame=clamp(S.fame+2);return erfReveal(x)}],['🚪 Toch maar niet',()=>'De rij is te lang. Je gaat naar huis.']]});
E('erf_vondst',{a:[25,85],once:1,w:.7,c:()=>S.home.k!=='ouders',t:'Een doos op zolder',x:'Op zolder vind je een stoffige doos met de naam van een overgrootouder erop.',
  ch:[['📦 Openmaken',()=>{const x=mkErf(ri(3,5),`van een overgrootouder, die het verstopte op zolder`);coll().it.push(x);hap(4);return `In de doos zit ${x.n.toLowerCase()}, in een doek gewikkeld. Een stuk familiegeschiedenis.`}]]});
E('erf_inbraak',{a:[20,90],w:()=>S.coll&&S.coll.it.some(x=>x.k==='erf'&&!x.mus&&collV(x)>5000)?1.2:0,cd:12,c:()=>!!(S.coll&&S.coll.it.some(x=>x.k==='erf'&&!x.mus&&collV(x)>5000)),ctx:()=>({id:pick(S.coll.it.filter(x=>x.k==='erf'&&!x.mus&&collV(x)>5000)).id}),t:'Inbraak',x:c=>{const x=S.coll.it.find(y=>y.id===c.id);return `Er is ingebroken. ${x?cap(x.n):'Je erfstuk'} is weg.`},
  ch:[['🚓 Aangifte doen',c=>{const x=S.coll.it.find(y=>y.id===c.id);if(chance(.3))return 'Drie maanden later vindt de politie het terug bij een heler. Het staat weer thuis.';if(x)S.coll.it=S.coll.it.filter(y=>y!==x);hap(-6);return 'De politie vindt niets. Het erfstuk is voorgoed weg.'}],
   ['🕵️ Een privédetective inhuren',c=>{const k=Math.round(5000*(S.cpi||1));cash(-k);const x=S.coll.it.find(y=>y.id===c.id);if(chance(.65))return `De detective (${fmt(k)}) vindt het terug op een veilingsite in het buitenland.`;if(x)S.coll.it=S.coll.it.filter(y=>y!==x);hap(-6);return `De detective (${fmt(k)}) vindt niets.`}]]});
F8.ach.push(add=>{if(S.flags.setDone)add('verzamelaar');if(S.coll&&S.coll.it.some(x=>x.k==='erf'&&(x.gen||1)>=4))add('familieschat')});
ACH.push(['verzamelaar','Verzamelaar','Maak een verzameling compleet'],['familieschat','Familieschat','Bezit een erfstuk dat al 4 generaties in de familie is']);
Object.assign(EVMETA,{erf_erfstuk:['Erfstuk','🏺'],erf_tv:['Erfstuk','📺'],erf_vondst:['Erfstuk','📦'],erf_inbraak:['Erfstuk','🚨']});

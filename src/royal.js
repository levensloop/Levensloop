/* ================= FASE 8.1: KONINGSHUIS EN ADEL =================
   Verzonnen koningshuizen (nooit echte personen) in de vier monarchieën van het spel waar je
   als prins of prinses kunt worden geboren, plus adellijke families in zeven landen.
   S.roy = {cc,h,pop,sc,y0,mon:'me'|'gp'|<persoon-id>,gp:{first,g,by}|null,rp:<id ouder-erfgenaam>|null,
            jr:<aantal onbekende mensen vóór je in de lijn>,nk:<kinderen van de vorst die vóór je gaan>,
            out:1 = buiten de lijn, ab:1 = zelf afgetreden, ex:1 = monarchie afgeschaft, reign:<jaar troon>,
            tw:{<partner-id>:1|-1} toestemming voor een huwelijk, lp:<laatste plek in de lijn>, cut:1 = lagere toelage}
   S.adel = {t:'Jonkheer'|..., fam:'Van Lindeborgh', lg:1 = landgoed in de familie} */
const ROYH={
  NL:{h:'Van Lindenhorst',huis:'het Huis Van Lindenhorst',pal:'Paleis Wildervoort',heir:['Prins van Wildervoort','Prinses van Wildervoort','Erfopvolger van Wildervoort']},
  BE:{h:'Van Rozendael',huis:'het Huis Van Rozendael',pal:'Kasteel Ter Leie',heir:['Hertog van Hageland','Hertogin van Hageland','Erfopvolger van Hageland']},
  UK:{h:'Ashbourne',huis:'het Huis Ashbourne',pal:'Fairhaven Palace',heir:['Prins van Wessmoor','Prinses van Wessmoor','Erfopvolger van Wessmoor']},
  ES:{h:'Valderrama',huis:'het Huis Valderrama',pal:'Palacio de Altamira',heir:['Prins van Altamira','Prinses van Altamira','Erfopvolger van Altamira']}};
const royLand=cc=>!!ROYH[cc||(S&&S.p.country)];
// adel per land: titels [man, vrouw] en verzonnen familienamen
const ADEL={
  NL:{t:[['Jonkheer','Jonkvrouw'],['Baron','Barones'],['Graaf','Gravin']],f:['Van Lindeborgh','Van Ravensteyn tot Oud','Van Wassenhove','Duyfhuys van Asch','Van Hoogh-Ameland']},
  BE:{t:[['Jonkheer','Jonkvrouw'],['Baron','Barones'],['Graaf','Gravin']],f:['de Hautmont','van Ter Elst','d\'Olvenne','van Kerckhove-Lys','de Spontin-Aa']},
  UK:{t:[['Sir','Lady'],['Baron','Barones'],['Graaf','Gravin']],f:['Fairleigh','Hollingworth','Ashcombe','Thistlewood','Brackenridge']},
  ES:{t:[['Conde','Condesa'],['Marqués','Marquesa'],['Duque','Duquesa']],f:['de Valdecruz','de Montearagón','de la Peñalta','de Villasol']},
  DE:{t:[['Freiherr','Freifrau'],['Graf','Gräfin']],f:['von Falkenried','von Ehrenstein','von Lindenau-Hohe','von Rabenhorst']},
  FR:{t:[['Comte','Comtesse'],['Marquis','Marquise']],f:['de Montclair','de Saint-Aubrac','de Vaulignac','de Roquefière']},
  IT:{t:[['Conte','Contessa'],['Marchese','Marchesa']],f:['di Valfonda','della Rocca Serena','di Montelusa','Albrizzi di Corte']}};
const adelLand=cc=>!!ADEL[cc||(S&&S.p.country)];
const gi=g=>g==='v'?1:g==='m'?0:2;

/* ---------- lijn van troonopvolging ---------- */
function roySibs(){return [{me:1,born:0},...living(['broer','zus']).filter(p=>!p.royOut)].sort((a,b)=>a.born-b.born)}
function royLine(){const R_=S.roy;if(!R_||R_.ex)return {list:[],off:0};let list=[],off=0;
  if(R_.mon==='me'){list=living('kind').filter(k=>!k.royOut&&!k.disown).sort((a,b)=>a.born-b.born).concat(living(['broer','zus']).filter(p=>!p.royOut).sort((a,b)=>a.born-b.born));return {list,off}}
  if(R_.mon==='gp'){const rp=R_.rp&&P(R_.rp);if(rp&&rp.alive&&!rp.royOut)list.push(rp);list=list.concat(roySibs());off=R_.jr||0}
  else{const M=P(R_.mon);
    if(M&&['moeder','vader'].includes(M.role))list=roySibs();
    else{for(let i=0;i<(R_.nk||0);i++)list.push({ab:1,nm:`${['Eerste','Tweede','Derde','Vierde'][i]||'Volgende'} kind van ${M?M.first:'de vorst'}`});
      if(M&&M.role==='kind')list=list.concat(living('kind').filter(k=>k!==M&&!k.royOut).sort((a,b)=>a.born-b.born));
      else list=list.concat(roySibs().filter(x=>x!==M))}}
  if(R_.ab||R_.out)list=list.filter(x=>!x.me);
  return {list,off}}
function royPos(){const R_=S.roy;if(!R_||R_.ex||R_.out||R_.ab||R_.mon==='me')return 0;const {list,off}=royLine();const i=list.findIndex(x=>x.me);return i<0?0:i+1+off}
function royRank(){const R_=S.roy;if(!R_)return '';if(R_.ex)return 'ex';if(R_.mon==='me')return 'mon';if(R_.out||R_.ab)return 'out';return royPos()===1?'heir':'line'}
const monT=g=>['Koning','Koningin','Vorst'][gi(g)];
function royTitle(){const R_=S.roy,g=S.p.g,r=royRank();if(!R_)return '';
  if(r==='mon')return `${monT(g)} van ${COUNTRIES[R_.cc].n}`;
  if(r==='heir')return ROYH[R_.cc].heir[gi(g)];
  if(r==='ex')return ['Voormalig prins','Voormalig prinses','Voormalig lid van het vorstenhuis'][gi(g)];
  return ['Prins','Prinses','Hoogheid'][gi(g)]}
function monName(){const R_=S.roy;if(!R_)return '';if(R_.mon==='me')return 'jij';if(R_.mon==='gp')return R_.gp?`${monT(R_.gp.g).toLowerCase()} ${R_.gp.first}`:'de vorst';const M=P(R_.mon);return M?`${monT(M.g).toLowerCase()} ${M.first}`:'de vorst'}
const royOn=()=>!!(S.roy&&!S.roy.ex);
const royHigh=()=>royOn()&&['mon','heir'].includes(royRank());

/* ---------- geboorte ---------- */
F8.birth.push((o,mom,dad)=>{const cc=o.country;
  if(o.afk==='kon'&&royLand(cc)){const H=ROYH[cc];S.flags.wealth='rijk';
    for(const p of [mom,dad])p.money=Math.round(ri(8,30)*1e6*(S.cpi||1));
    const rp=chance(.5)?mom:dad,sp=rp===mom?dad:mom;const r=R();
    S.roy={cc,h:H.h,pop:ri(58,74),sc:0,y0:year(),mon:'gp',gp:null,rp:null,jr:0,nk:0,tw:{}};
    if(r<.4){S.roy.mon=rp.id;rp.job=monT(rp.g).toLowerCase();sp.job=rp.g==='v'?'prins-gemaal':'koningin-gemalin'}
    else if(r<.8){const gg=pick(['m','v']);S.roy.gp={first:f8Name(gg),g:gg,by:year()-ri(58,76)};S.roy.rp=rp.id;rp.job=ROYH[cc].heir[gi(rp.g)].toLowerCase();sp.job='lid van het koninklijk huis'}
    else{const gg=pick(['m','v']);S.roy.gp={first:f8Name(gg),g:gg,by:year()-ri(40,58)};S.roy.jr=ri(4,9);rp.job=rp.g==='v'?'prinses':'prins';sp.job='lid van het koninklijk huis'}
    S.fame=Math.max(S.fame||0,35);
    Q.push({id:'roy_geboren'});return}
  if((o.afk==='adel'||o.afk==='kon')&&adelLand(cc)){const A=ADEL[cc];const t=pick(A.t);S.adel={t:t[gi(o.g)===1?1:0],tt:t,fam:pick(A.f),lg:chance(.45)?1:0};
    if(S.flags.wealth==='arm')S.flags.wealth='midden';for(const p of [mom,dad])p.money=Math.max(p.money,Math.round(ri(400,4000)*1000*(S.cpi||1)));
    Q.push({id:'adel_geboren'})}});
E('roy_geboren',{sys:1,t:'Een koninklijke geboorte',x:()=>{const R_=S.roy,H=ROYH[R_.cc];const pos=royPos();return `Je bent geboren in ${H.huis}. In ${H.pal} wordt de vlag gehesen en op het plein klinken 21 saluutschoten. ${R_.mon==='gp'?`${cap(monName())} regeert het land.`:`Je ${P(R_.mon)?relWord(P(R_.mon)):'ouder'} is ${monName()}.`} Jij staat op plek ${pos} in de lijn van troonopvolging.`},
  ch:[['👑 Zwaaien vanaf het balkon',()=>{S.roy.pop=clamp(S.roy.pop+3);hap(2);return 'Je ouders tillen je op het balkon. Het hele land ziet een slapende baby in een kanten jurkje.'}],
   ['😴 Doorslapen',()=>'Je slaapt door het hele protocol heen. Een goed begin.']]});
E('adel_geboren',{sys:1,t:'Van adel',x:()=>`Je bent geboren in de adellijke familie ${S.adel.fam}. Je draagt de titel ${S.adel.t.toLowerCase()}.${S.adel.lg?' De familie bezit al eeuwen een landgoed met een tochtig kasteel.':''}`,
  ch:[['🎩 Netjes',()=>'In het familieregister komt een nieuwe naam onder twintig generaties voorouders.']]});
F8.pre.push(()=>S.adel&&!S.roy?S.adel.t+' ':'');
F8.sub.push(()=>{if(!royOn())return '';const r=royRank();if(r==='mon'||r==='heir')return royTitle();if(r==='line'&&ageY()<18)return `${royTitle()} · nummer ${royPos()} voor de troon`;if(['line','out'].includes(r)&&!S.job&&!S.edu.cur&&!S.biz.length&&!(S.pol&&S.pol.lvl!=='lid')&&!S.mil&&!(typeof f8Career==='function'&&f8Career()))return r==='line'?`${royTitle()} · nummer ${royPos()} voor de troon`:royTitle();return ''});

/* ---------- jaarlijks ---------- */
function royNext(oldNm,why){const R_=S.roy;const {list,off}=royLine();
  if(off>0||!list.length){// iemand die je niet kent wordt vorst
    const g=pick(['m','v']);R_.gp={first:f8Name(g),g,by:year()-ri(30,55)};R_.mon='gp';R_.rp=null;R_.jr=Math.max(1,off-1+ri(0,2));R_.nk=0;
    L(`${oldNm} ${why}. ${R_.gp.first} wordt de nieuwe ${monT(g).toLowerCase()}. Jij staat nu op plek ${royPos()} in de lijn.`,'big');return}
  const nx=list[0];
  if(nx.me){royCrown(oldNm,why);return}
  if(nx.ab){const g=pick(['m','v']);R_.gp={first:f8Name(g),g,by:year()-ri(18,35)};R_.mon='gp';R_.rp=null;R_.jr=Math.max(0,(R_.nk||1)-1)+ri(0,1);R_.nk=0;
    L(`${oldNm} ${why}. ${nx.nm.replace(/^\w/,c=>c.toLowerCase())}, ${R_.gp.first}, wordt ${monT(g).toLowerCase()}.`,'big');return}
  R_.mon=nx.id;R_.gp=null;if(R_.rp===nx.id)R_.rp=null;R_.nk=nx.role==='moeder'||nx.role==='vader'?0:(pAge(nx)>=26?ri(0,2):0);
  nx.job=monT(nx.g).toLowerCase();L(`${oldNm} ${why}. Je ${relWord(nx)} ${nx.first} wordt ${monT(nx.g).toLowerCase()}.`,'big')}
function royCrown(oldNm,why){const R_=S.roy;R_.mon='me';R_.reign=year();R_.gp=null;R_.rp=null;R_.jr=0;R_.nk=0;
  L(`${oldNm} ${why}. Jij bent nu ${monT(S.p.g).toLowerCase()} van ${COUNTRIES[R_.cc].n}!${ageY()<18?' Tot je 18e regeert een regent namens jou.':''}`,'big good');
  MS(`Werd ${monT(S.p.g).toLowerCase()} van ${COUNTRIES[R_.cc].n}`,3);S.flags.kroon=1;Q.push({id:'roy_kroning'})}
function royYear(a){const R_=S.roy;if(!R_||R_.ex)return;
  // de vorst die je niet kent: sterfte en aftreden
  if(R_.mon==='gp'&&R_.gp){const ma=year()-R_.gp.by;const pd=ma<65?.008:ma<75?.025:ma<85?.07:ma<95?.18:.4;const nm=`${cap(monT(R_.gp.g).toLowerCase())} ${R_.gp.first}`;
    if(chance(pd))royNext(nm,'is overleden. Het land is in rouw');
    else if(ma>=72&&chance(R_.jr?.06:.1))royNext(nm,'treedt af na een lange regeerperiode')}
  else if(R_.mon!=='me'){const M=P(R_.mon);
    if(!M||!M.alive)royNext(M?`${cap(monT(M.g).toLowerCase())} ${M.first}`:'De vorst','is overleden. Het land is in rouw');
    else{const ma=pAge(M);if(ma>=26&&ma<=44&&M.role!=='moeder'&&M.role!=='vader'&&chance(.1))R_.nk=Math.min(4,(R_.nk||0)+1);
      if(['moeder','vader'].includes(M.role)&&ma>=68&&chance(.09)){const {list}=royLine();const h=list[0];if(h&&(h.me?a>=18:pAge(h)>=18))Q.push({id:'roy_abdicatie',c:{id:M.id}})}}}
  if(R_.mon==='me'&&R_.reign&&year()-R_.reign===25)Q.push({id:'roy_jubileum'});
  // plek in de lijn
  const pos=royPos();if(R_.lp!=null&&pos&&pos!==R_.lp){if(pos===1){L(`Je bent nu de eerste in de lijn van troonopvolging: ${royTitle().toLowerCase()}.`,'big');MS(`Werd ${royTitle().toLowerCase()}`,2)}else L(`Je staat nu op plek ${pos} in de lijn van troonopvolging.`,'sys')}R_.lp=pos;
  // populariteit drijft naar een basis die van je karma en schandalen afhangt
  const base=52+(S.karma-50)*.35-Math.min(20,(R_.sc||0)*4)+(R_.cut?6:0);R_.pop=clamp(Math.round(R_.pop+(base-R_.pop)/7+gauss()*2));R_.sc=Math.max(0,(R_.sc||0)-.4);
  // bekendheid hoort bij de rol
  const fl={mon:85,heir:70,line:40,out:25}[royRank()]||0;if(S.fame<fl)S.fame=Math.round(S.fame+(fl-S.fame)*.5);
  // huwelijk: toestemming van het parlement
  const pt=partner();if(pt&&['mon','heir','line'].includes(royRank())&&royPos()<=8||pt&&R_.mon==='me'){R_.tw=R_.tw||{};
    if(pt.st==='verloofd'&&R_.tw[pt.id]==null&&!Q.some(q=>q.id==='roy_toestemming'))Q.push({id:'roy_toestemming',c:{id:pt.id}});
    if(pt.st==='getrouwd'&&R_.tw[pt.id]==null&&R_.mon!=='me'){R_.tw[pt.id]=-1;R_.out=1;R_.pop=clamp(R_.pop-6);L(`Je bent getrouwd zonder toestemming van het parlement. Daarmee verlies je je plek in de lijn van troonopvolging.`,'bad big');MS('Verloor de plek in de troonopvolging door een huwelijk zonder toestemming',2)}}
  if(['mon','heir'].includes(royRank())&&a>=18&&R_.pop<20&&chance(.3)&&!Q.some(q=>q.id==='roy_referendum'))Q.push({id:'roy_referendum'})}
function adelYear(a){const A=S.adel;if(!A)return;if(A.lg&&a>=30&&S.home.k!=='ouders'&&!living(['moeder','vader']).length&&!A.lgOwn&&!Q.some(q=>q.id==='adel_landgoed'))Q.push({id:'adel_landgoed'})}
F8.year.push(a=>{royYear(a);adelYear(a)});
// toelage van de staat (onbelast)
F8.inc.push(()=>{if(!royOn()||inJail()||ageY()<18)return [];const r=royRank(),c=S.cpi||1,f=S.roy.cut?.75:1;
  if(r==='mon')return [['Toelage koninklijk huis',Math.round(950000*c*f)]];if(r==='heir')return [['Toelage koninklijk huis',Math.round(280000*c*f)]];
  // de andere prinsen en prinsessen leven van het familievermogen
  if(['line','out'].includes(r)&&!S.job)return [['Toelage van de familie',Math.round(60000*c)]];return []});
F8.busy.push(()=>royOn()&&ageY()>=18&&royRank()!=='ex');
F8.ach.push(add=>{if(S.flags.kroon)add('kroon');if(S.roy&&S.roy.ex&&S.flags.laatste)add('laatstevorst');if(S.adel)add('adel')});
ACH.push(['kroon','Lang leve de vorst','Word koning of koningin'],['laatstevorst','De laatste vorst','Zie de monarchie afgeschaft worden'],['adel','Blauw bloed','Word geboren in een adellijke familie']);

/* ---------- erven: titels en troon gaan mee naar je kind ---------- */
F8.inherit.push((old,n,ch,age)=>{
  if(old.adel){const t=old.adel.tt||[old.adel.t,old.adel.t];n.adel={t:t[gi(ch.g)===1?1:0],tt:t,fam:old.adel.fam,lg:old.adel.lg};L(`Je erft de familietitel: ${n.adel.t.toLowerCase()}.`)}
  if(!old.roy||old.roy.ex){if(old.roy&&old.roy.ex)n.roy=Object.assign({},old.roy);return}
  const R0=old.roy;const R_=n.roy={cc:R0.cc,h:R0.h,pop:clamp(Math.round(R0.pop*.6+25)),sc:0,y0:year(),mon:'gp',gp:null,rp:null,jr:0,nk:0,tw:{}};
  const kids=old.rel.filter(p=>p.role==='kind'&&p.alive&&!p.royOut&&!p.disown).sort((a,b)=>a.born-b.born);const first=kids[0];
  if(R0.mon==='me'&&first&&first.id===ch.id){R_.reign=year();R_.mon='me';n.flags.kroon=1;L(`Je ${old.p.g==='v'?'moeder':'vader'} is overleden. Jij volgt ${old.p.g==='v'?'haar':'hem'} op als ${monT(ch.g).toLowerCase()} van ${COUNTRIES[R0.cc].n}.${age<18?' Tot je 18e regeert een regent.':''}`,'big good');MS(`Werd ${monT(ch.g).toLowerCase()} van ${COUNTRIES[R0.cc].n}`,3);Q.push({id:'roy_kroning'});return}
  if(R0.mon==='me'&&first){const sib=n.rel.find(p=>p.first===first.first&&['broer','zus'].includes(p.role)&&Math.abs(p.born-(first.born-ch.born))<2);if(sib){R_.mon=sib.id;sib.job=monT(sib.g).toLowerCase();L(`Je ${relWord(sib)} ${sib.first} wordt ${monT(sib.g).toLowerCase()}. Jij bent ${['prins','prinses','lid van het vorstenhuis'][gi(ch.g)]}.`,'big')}return}
  // de speler was geen vorst: de vorst blijft wie het was, jij staat iets verder in de lijn
  if(R0.mon==='gp'&&R0.gp){R_.gp=R0.gp;R_.jr=(R0.jr||0)+(R0.rp?1:0)}else{const g=pick(['m','v']);R_.gp={first:f8Name(g),g,by:year()-ri(30,60)};R_.jr=1+(R0.nk||0)}
  if(R0.out||R0.ab)R_.out=1});

/* ---------- het scherm ---------- */
F8.job.push(el=>{if(!S.roy&&!S.adel)return false;if(S.roy){row(el,{ic:'👑',t:royTitle(),s:S.roy.ex?'De monarchie is afgeschaft':royRank()==='mon'?`Populariteit ${S.roy.pop}%`:royPos()?`Nummer ${royPos()} in de lijn van troonopvolging`:'Buiten de lijn van troonopvolging',cls:'cur',on:()=>openSheet('Koninklijk huis',sheetRoyal,true)});return true}
  if(ageY()>=12){row(el,{ic:'🎩',t:`${S.adel.t} ${S.p.first}`,s:`Familie ${S.adel.fam}`,cls:'cur',on:()=>openSheet('Adel',sheetAdel,true)});return true}return false});
function sheetRoyal(el){const R_=S.roy,a=ageY(),r=royRank(),H=ROYH[R_.cc];
  card(el,`<h3>👑 ${he(royTitle())}</h3><span class="muted">${he(cap(H.huis))} · ${he(H.pal)}${r==='mon'&&R_.reign?` · op de troon sinds ${R_.reign}`:''}</span>${R_.ex?'':`<div class="stat"><span>Populariteit</span><span></span><span class="v">${R_.pop}%</span>${bar(R_.pop)}</div>`}${kv([['Vorst',r==='mon'?'Jij':cap(monName())],...(r!=='mon'&&!R_.ex?[['Jouw plek',royPos()?`nummer ${royPos()}`:'buiten de lijn']]:[]),...(f8Inc().filter(x=>x[0]==='Toelage koninklijk huis').map(x=>['Toelage',fmt(x[1])+' per jaar']))])}`);
  if(R_.ex){empty(sec(el,''),'De monarchie is afgeschaft. Je bent nu een gewone burger met een bijzondere achternaam.');return}
  const {list,off}=royLine();const ls=sec(el,'Lijn van troonopvolging');let i=1+off;if(off)row(ls,{ic:'…',t:`${off} ${off===1?'persoon':'personen'} uit andere takken van de familie`,dis:true});
  for(const x of list.slice(0,6)){row(ls,{ic:x.me?'⭐':x.ab?'👶':faceOf(x),t:`${i}. ${x.me?'Jij':x.ab?x.nm:x.first}`,s:x.me?royTitle():x.ab?'':cap(relWord(x)),dis:!!x.ab,on:x.me||x.ab?null:()=>openSheet(x.first,el2=>sheetPerson(el2,x),true)});i++}
  if(!list.length&&!off)empty(ls,'Er staat niemand in de lijn.');
  if(a<8){empty(sec(el,''),'Voorlopig mag je vooral zwaaien.');return}
  const s=sec(el,'Plichten');const pop=d=>{R_.pop=clamp(R_.pop+d)};
  row(s,{ic:'🏭',t:'Werkbezoek afleggen',s:'Een fabriek, een school of een buurthuis',on:()=>doAct('Werkbezoek',()=>{const m=use('roywb');pop(Math.round(3*m));hap(m>0?1:-1);return pickF('roywb',['Je draagt een veiligheidsbril en knikt geïnteresseerd bij een machine die schroeven sorteert.','Groep 5 zingt een lied over jou. Je pinkt een traantje weg.','Je proeft de soep van het buurthuis. "Heerlijk," zeg je. Je meent het.','Je drukt honderd handen. Je rechterhand is een week stijf.','Een kleuter vraagt waar je kroon is. Iedereen lacht.'])},true,'🏭')});
  row(s,{ic:'✂️',t:'Een opening verrichten',s:'Lint doorknippen, hand schudden, foto',on:()=>doAct('Opening',()=>{const m=use('royopen');if(chance(.15))return pickF('royschaar',['De schaar is bot. Je zaagt een minuut aan het lint. Het filmpje gaat de wereld over.','Het lint blijkt aan de deur vastgeplakt. Je opent de brug met een ruk.']);pop(Math.round(2*m));return pick(['Je knipt het lint van een nieuwe brug door. Applaus.','Je opent een ziekenhuisvleugel en praat lang met de verpleegkundigen.','Je onthult een plaquette met je eigen naam erop.'])},true,'✂️')});
  if(a>=12)row(s,{ic:'🎤',t:'Een toespraak houden',s:'Minigame · onthoud je tekst',dots:true,on:()=>mgMemory('Toespraak','Onthoud de volgorde van je spiekbriefjes.',5,ok=>doAct('Toespraak',()=>{if(ok){pop(5);sk('sociaal',2);return 'Je spreekt zonder papiertje. Zelfs de critici zijn onder de indruk.'}pop(-2);return 'Je slaat een hele pagina over en bedankt de verkeerde burgemeester. Ongemakkelijk.'},true,'🎤'))});
  if(a>=16)row(s,{ic:'🥂',t:'Liefdadigheidsgala organiseren',s:S.acts.roygala?'Dit jaar al gedaan':`Kost ${fmt(Math.round(25000*(S.cpi||1)))} · goed voor je karma`,dis:!!S.acts.roygala||S.money<25000*(S.cpi||1),on:()=>doAct('Gala',()=>{S.acts.roygala=1;cash(-Math.round(25000*(S.cpi||1)));kar(4);pop(4);const g=Math.round(ri(200,900)*1000*(S.cpi||1));return `Het gala haalt ${fmt(g)} op voor ${pick(GOED)}. Je danst met een oud-wereldkampioen.`},true,'🥂')});
  if(a>=18&&['mon','heir'].includes(r))row(s,{ic:'✈️',t:'Staatsbezoek',s:S.acts.roystaat?'Dit jaar al gedaan':'Breng een officieel bezoek aan een ander land',dis:!!S.acts.roystaat,dots:true,on:royStateVisit});
  if(a>=16)row(s,{ic:'🎙️',t:'Een interview geven',s:'Riskant: je zegt soms meer dan je wilt',dis:!!S.acts.royint,on:()=>doAct('Interview',()=>{S.acts.royint=1;const ok=chance(.45+S.sk.sociaal/250);if(ok){pop(6);S.fame=clamp(S.fame+3);return pick(['Je vertelt eerlijk over de druk van je leven. Het land ziet een mens.','Je maakt een grap over jezelf. De fragmenten gaan viraal, op de goede manier.'])}pop(-5);R_.sc=(R_.sc||0)+1;return pick(['Je zegt dat je "nog nooit in een supermarkt bent geweest". Dat blijft hangen.','Je klaagt over de hoogte van je toelage. Slecht moment.'])},true,'🎙️')});
  if(r==='mon'&&a>=18){const m=sec(el,'Als vorst');
    row(m,{ic:'📜',t:'De jaarlijkse toespraak',s:S.acts.roytr?'Dit jaar al gedaan':'Spreek het land toe',dis:!!S.acts.roytr,on:()=>mgMemory('Toespraak aan het land','Onthoud de volgorde van de kernpunten.',6,ok=>doAct('Toespraak',()=>{S.acts.roytr=1;if(ok){pop(6);return 'Je toespraak raakt een snaar. "Eindelijk iemand die zegt wat we voelen," schrijft een krant.'}pop(-1);return 'Je leest de tekst voor die de regering schreef. Keurig en een beetje saai.'},true,'📜'))});
    row(m,{ic:'🕊️',t:'Gratie verlenen',s:S.acts.roygr?'Dit jaar al gedaan':'Een veroordeelde een tweede kans geven',dis:!!S.acts.roygr,on:()=>doAct('Gratie',()=>{S.acts.roygr=1;kar(3);if(chance(.8)){pop(2);return 'Je verleent gratie aan een vrouw die haar gewelddadige man ontvluchtte. Het land knikt.'}pop(-6);R_.sc=(R_.sc||0)+1;return 'De man aan wie je gratie verleent, wordt een maand later weer opgepakt. Ongemakkelijke vragen in het parlement.'},true,'🕊️')});
    row(m,{ic:'🎖️',t:'Een onderscheiding uitreiken',s:'Aan een vriend of familielid',dis:!!S.acts.roylint,dots:true,on:()=>{const ps=living(['vriend','broer','zus','moeder','vader','kind','partner']);if(!ps.length){toast('Er is niemand om te onderscheiden');return}modal({title:'Onderscheiding',em:'🎖️',cat:'Koninklijk huis',text:'Wie krijgt een lintje?',choices:opts(ps.slice(0,8).map(p=>({t:`${p.first} (${relWord(p)})`,on:()=>{closeModal();doAct('Onderscheiding',()=>{S.acts.roylint=1;p.rel=clamp(p.rel+12);if(['vriend'].includes(p.role)&&chance(.3)){pop(-3);return `${p.first} krijgt een lintje. Een krant vraagt waarom jouw vrienden altijd in de prijzen vallen.`}return `${p.first} krijgt een lintje en huilt van trots.`},true,'🎖️')}})))})}});
    row(m,{ic:'🗯️',t:'Je mening geven over de politiek',s:'Een vorst hoort neutraal te zijn',dots:true,on:()=>ask('Je mening geven?','Een vorst blijft buiten de politiek. Als je toch iets zegt, kan het land boos worden, of juist blij.','Toch doen',()=>doAct('Politiek',()=>{if(chance(.35)){pop(5);return 'Je pleit voor betere zorg voor ouderen. Een meerderheid is het met je eens. De premier zucht.'}pop(-10);R_.sc=(R_.sc||0)+2;return 'Je kritiek op de regering leidt tot een crisis. "De vorst moet zwijgen," zegt het parlement. Republikeinen juichen.'},true,'🗯️'),'bad','🗯️')});
    const {list:l2}=royLine();const h=l2[0];if(h&&!h.ab&&pAge(h)>=18)row(m,{ic:'🪑',t:'Aftreden',s:`${h.first} wordt dan ${monT(h.g).toLowerCase()}`,dots:true,on:()=>ask('Aftreden?',`Je doet afstand van de troon. Je ${relWord(h)} ${h.first} volgt je op en jij krijgt geen toelage meer.`,'Aftreden',()=>{R_.mon=h.id;R_.ab=1;R_.nk=pAge(h)>=26?ri(0,2):0;h.job=monT(h.g).toLowerCase();hap(6);L(`Je treedt af. ${h.first} is nu ${monT(h.g).toLowerCase()}.`,'big');MS(`Trad af ten gunste van ${h.first}`,2);refreshSheet();render();saveLife()},'go','🪑')})}
  if(r!=='mon'&&!R_.out&&!R_.ab&&a>=18)row(sec(el,''),{ic:'🚪',t:'Afstand doen van je plek in de lijn',s:'Vrij leven, maar voorgoed buiten de troonopvolging',dots:true,on:()=>ask('Afstand doen?','Je stapt uit de lijn van troonopvolging. Je titel blijft, maar je wordt nooit vorst. Je toelage stopt.','Afstand doen',()=>{R_.out=1;hap(8);L('Je doet afstand van je plek in de lijn van troonopvolging. Je voelt je vrij.','big');MS('Deed afstand van de troonopvolging',2);refreshSheet();render();saveLife()},'go','🚪')})}
function royStateVisit(){const ks=Object.keys(COUNTRIES).filter(k=>k!==S.p.country);const pk=ks.sort(()=>R()-.5).slice(0,4);
  modal({title:'Staatsbezoek',em:'✈️',cat:'Koninklijk huis',text:'Naar welk land ga je?',choices:opts(pk.map(k=>({t:`${flag(k)} ${COUNTRIES[k].n}`,on:()=>{closeModal();doAct('Staatsbezoek',()=>{S.acts.roystaat=1;const R_=S.roy;if(f8Once('staatsbezoek'))MS(`Bracht een staatsbezoek aan ${COUNTRIES[k].n}`,1);
    if(chance(.18)){R_.pop=clamp(R_.pop-4);return pick([`Bij het staatsbanket in ${COUNTRIES[k].n} toost je met de verkeerde hand. Daar is dat een belediging. Diplomaten werken overuren.`,`Je noemt de president van ${COUNTRIES[k].n} per ongeluk bij de naam van de vorige. Iedereen glimlacht stijfjes.`])}
    R_.pop=clamp(R_.pop+5);sk('sociaal',2);return pick([`Drie dagen ${COUNTRIES[k].n}: een handelsmissie, een staatsbanket en een bezoek aan een universiteit. Er worden contracten getekend.`,`In ${COUNTRIES[k].n} spreek je een paar zinnen in de landstaal. Het publiek is ontroerd.`])},true,'✈️')}})))})}
function sheetAdel(el){const A=S.adel;card(el,`<h3>🎩 ${he(A.t)} ${he(S.p.first)} ${he(S.p.last)}</h3><span class="muted">Uit de familie ${he(A.fam)}${A.lg?' · familielandgoed':''}</span>`);
  const s=sec(el,'Adellijk leven');const a=ageY();
  if(a>=16)row(s,{ic:'💃',t:'Naar een bal',s:'Dansen, netwerken, roddels',on:()=>doAct('Bal',()=>{const m=use('adbal');hap(Math.round(4*m));sk('sociaal',2);if(chance(.2)&&!partner()&&a>=18){addPartner();return 'Op het bal ontmoet je iemand met een even lange naam als jij. Het klikt.'}return pick(['Je walst de hele avond. Je voeten tellen niet meer mee.','Een tante van je vertelt drie uur over de stamboom.'])},true,'💃')});
  row(s,{ic:'📜',t:'De stamboom bekijken',s:'Twintig generaties voorouders',on:()=>doAct('Stamboom',()=>{use('adstam');sma(1);return pick(['Een voorouder van je was hofdame. Een ander werd verbannen wegens een duel. Leuke familie.','Je vindt een voorouder die een heel dorp verloor met kaarten.','Volgens de stamboom ben je verre familie van half Europa.'])},true,'📜')});
  if(a>=18)row(s,{ic:'🏰',t:A.lgOwn?'Je landgoed':'Het familielandgoed',s:A.lg?(A.lgOwn?'Onderhoud, bezoekers en jachtpartijen':'Is nog van je ouders'):'Je familie heeft geen landgoed meer',dis:!A.lg||!A.lgOwn,on:()=>doAct('Landgoed',()=>{use('adlg');const k=Math.round(ri(20,60)*1000*(S.cpi||1));if(chance(.5)){cash(Math.round(k*.6));return `Je opent de tuinen voor publiek. Bezoekers betalen ${fmt(Math.round(k*.6))} aan entree en thee.`}cash(-k);return `Het dak van de oostvleugel lekt. Reparatie: ${fmt(k)}.`},true,'🏰')})}
// ---- politiek is niets voor een vorst of erfopvolger ----
if(typeof sheetPol==='function'){sheetPol=(f=>function(el){if(royOn()&&['mon','heir','line'].includes(royRank())&&!(S.pol)){card(el,`<h3>👑 Geen partijpolitiek</h3><p class="muted" style="margin:0">Als lid van het koninklijk huis in de lijn van troonopvolging blijf je buiten de partijpolitiek. Doe eerst afstand van je plek in de lijn (Beroep → ${he(royTitle())}).</p>`);return}return f(el)})(sheetPol)}

// bij je verloofde: meteen toestemming kunnen vragen, vóór de bruiloft
F8.person.push((el,p)=>{if(!royOn()||p.role!=='partner'||p.st!=='verloofd'||!p.alive)return;const R_=S.roy;R_.tw=R_.tw||{};if(R_.tw[p.id]!=null||!['mon','heir','line'].includes(royRank()))return;
  row(sec(el,'👑 Koninklijk huis'),{ic:'📨',t:'Toestemming vragen aan het parlement',s:'Trouw je zonder, dan verlies je je plek in de lijn',dots:true,on:()=>{if(!Q.some(q=>q.id==='roy_toestemming'))Q.push({id:'roy_toestemming',c:{id:p.id}});closeSheet();processQ()}})});
/* ---------- gebeurtenissen ---------- */
const RW=n=>()=>royOn()?n:0;
const rpop=d=>{if(S.roy)S.roy.pop=clamp(S.roy.pop+d)};const rsc=d=>{if(S.roy)S.roy.sc=(S.roy.sc||0)+d};
E('roy_kroning',{sys:1,t:'De inhuldiging',x:()=>`Vandaag word je ingehuldigd als ${monT(S.p.g).toLowerCase()} van ${COUNTRIES[S.roy.cc].n}. Het land kijkt mee. Hoe wil je het?`,
  ch:[['🎺 Groots, met een rijtoer door de stad',()=>{rpop(6);hap(8);S.fame=clamp(S.fame+5);return 'Honderdduizenden mensen zwaaien. In de gouden koets zwaai jij terug tot je arm verkrampt.'}],
   ['🤝 Sober, met een volksfeest',()=>{rpop(9);kar(3);hap(5);return 'Je schrapt de koets en betaalt een feest op elk dorpsplein. "Een vorst van het volk," schrijven de kranten.'}],
   ['🎤 Met een persoonlijke toespraak',()=>({go:()=>mgMemory('Inhuldigingsrede','Onthoud de volgorde van je belofte.',6,ok=>{const t=ok?(rpop(10),'Je spreekt vanuit het hart. Mensen huilen op het plein.'):(rpop(2),'Je struikelt over een zin, lacht erom en gaat door. Het maakt je menselijk.');L(`Inhuldiging: ${t}`);result('Inhuldiging',t,'',processQ,{em:'👑',cat:'Koninklijk huis'})})})]]});
E('roy_jubileum',{sys:1,t:'Zilveren jubileum',x:'Je bent 25 jaar vorst. Het land wil een feest.',ch:[['🎉 Een groot feest',()=>{rpop(6);hap(8);return 'Vuurwerk boven het paleis. Je krijgt een zilveren postzegel met je hoofd erop.'}],['💝 Geen feest, geld naar het goede doel',()=>{rpop(9);kar(5);return 'In plaats van een feest gaat er geld naar de voedselbanken. Het land is ontroerd.'}]]});
E('roy_abdicatie',{sys:1,need:c=>royOn()&&S.roy.mon===c.id&&P(c.id)&&P(c.id).alive,t:'Aftreden',x:c=>{const M=P(c.id),{list}=royLine(),h=list[0];return `Je ${relWord(M)} ${M.first} kondigt aan af te treden. ${h&&h.me?`Jij wordt ${monT(S.p.g).toLowerCase()}.`:`${h?h.first:'De erfopvolger'} wordt ${h?monT(h.g).toLowerCase():'vorst'}.`}`},
  ch:[['👑 De troon aanvaarden',c=>{const M=P(c.id);const {list}=royLine();const h=list[0];if(h&&h.me){royCrown(`${cap(monT(M.g).toLowerCase())} ${M.first}`,'treedt af');M.job='prins'+(M.g==='v'?'es':'');return 'Je ouder kust je op je voorhoofd en geeft je de sleutels van het paleis. Letterlijk.'}royNext(`${cap(monT(M.g).toLowerCase())} ${M.first}`,'treedt af');return 'Er is een ceremonie in de hoofdstad. Jij staat op de tweede rij.'},c=>{const {list}=royLine();return !!(list[0]&&list[0].me)}],
   ['🙅 Weigeren en afstand doen',c=>{const M=P(c.id);S.roy.out=1;royNext(`${cap(monT(M.g).toLowerCase())} ${M.first}`,'treedt af');hap(4);MS('Weigerde de troon',2);return 'Je weigert de kroon. Het land is geschokt, jij bent opgelucht.'},c=>{const {list}=royLine();return !!(list[0]&&list[0].me)}],
   ['🎉 Feliciteren',c=>{const M=P(c.id);royNext(`${cap(monT(M.g).toLowerCase())} ${M.first}`,'treedt af');return 'Er is een ceremonie in de hoofdstad. Jij staat op de tweede rij en applaudisseert.'},c=>{const {list}=royLine();return !(list[0]&&list[0].me)}]]});
E('roy_toestemming',{sys:1,need:c=>royOn()&&P(c.id)&&P(c.id).alive&&P(c.id).role==='partner',t:'Toestemming van het parlement',x:c=>`Je bent verloofd met ${P(c.id).first}. Leden van het koninklijk huis in de lijn van troonopvolging hebben voor een huwelijk toestemming van het parlement nodig. Anders verlies je je plek.`,
  ch:[['📨 Toestemming vragen',c=>{const p=P(c.id);const ok=chance(clamp(.82-(S.roy.sc||0)*.06+(p.smarts-50)/400,.3,.95));S.roy.tw[p.id]=ok?1:-2;if(ok){rpop(6);return `Het parlement stemt in. Het land is verliefd op ${p.first}. De bruiloft wordt een staatsgebeurtenis.`}rpop(-2);return `Het parlement weigert. Er is iets in het verleden van ${p.first} dat ze niet bevalt. Als je toch trouwt, verlies je je plek.`}],
   ['💍 Gewoon trouwen, plek of geen plek',c=>{S.roy.tw[c.id]=-1;if(S.roy.mon!=='me'){S.roy.out=1;MS('Koos voor de liefde in plaats van de troon',2);return 'Je kiest voor de liefde. Je plek in de lijn van troonopvolging ben je kwijt, je titel houd je.'}rpop(-10);rsc(2);return 'Je trouwt zonder toestemming. Als vorst kan dat niet zomaar: er volgt een staatsrechtelijke crisis.'}],
   ['💔 De verloving verbreken',c=>{const p=P(c.id);if(p){p.st='relatie';p.rel=clamp(p.rel-30)}hap(-10);return 'Je verbreekt de verloving. De roddelbladen hebben maandenlang voer.'}]]});
E('roy_referendum',{sys:1,need:()=>royHigh(),t:'Referendum over de monarchie',x:()=>`Je populariteit is ${S.roy.pop}%. Het parlement besluit tot een referendum: monarchie of republiek?`,
  ch:[['📣 Campagne voeren',()=>{const ok=chance(clamp(.3+S.roy.pop/100+S.sk.sociaal/400,.1,.85));if(ok){S.roy.pop=55;return 'Een krappe meerderheid kiest voor de monarchie. Je hebt een tweede kans.'}royEnd();return 'Een meerderheid kiest voor de republiek. De monarchie wordt afgeschaft.'}],
   ['🪑 Aftreden voor een frisse start',()=>{const {list}=royLine();const h=list[0];if(S.roy.mon==='me'&&h&&!h.ab){S.roy.mon=h.id;S.roy.ab=1;S.roy.pop=60;return `Je treedt af. Met ${h.first} op de troon wint de monarchie het referendum ruim.`}S.roy.out=1;S.roy.pop=55;return 'Je doet afstand van je plek. De monarchie overleeft het referendum zonder jou.'}],
   ['🤐 Afwachten',()=>{if(chance(.4)){S.roy.pop=45;return 'Het land kiest nipt voor de monarchie. Pfoe.'}royEnd();return 'De republiek wint. Je verhuist uit het paleis.'}]]});
function royEnd(){S.roy.ex=1;S.flags.laatste=S.roy.mon==='me'?1:0;hap(-15);L(`De monarchie in ${COUNTRIES[S.roy.cc].n} is afgeschaft.`,'bad big');MS('Zag de monarchie afgeschaft worden',2);if(S.home&&S.home.k==='ouders'){}}
E('roy_paparazzi',{a:[12,95],w:RW(6),cd:3,c:()=>royOn(),t:'Paparazzi',x:'Een fotograaf ligt in de bosjes bij je vakantiehuis. Je ziet de lens glinsteren.',
  ch:[['👋 Lachen en zwaaien',()=>{rpop(2);S.fame=clamp(S.fame+2);return 'De foto van jou die zwaait staat op elke voorpagina. Sympathiek.'}],
   ['⚖️ Een rechtszaak aanspannen',()=>{const k=Math.round(30000*(S.cpi||1));cash(-k);if(chance(.6)){rpop(1);return `Je wint de zaak (${fmt(k)} aan advocaten). Het blad moet de foto's vernietigen.`}rpop(-3);return `Je verliest de zaak (${fmt(k)} aan advocaten). Nu staan de foto's overal.`}],
   ['🏃 Boos wegrennen',()=>{rpop(-3);return 'Je rent met een handdoek over je hoofd naar binnen. Die foto wordt een meme.'}]]});
E('roy_feest',{a:[16,32],w:RW(5),cd:4,c:()=>royOn(),t:'Foto\'s van een feest',x:'Op een roddelsite staan foto\'s van jou op een wild studentenfeest, met een kroon van bierdopjes op je hoofd.',
  ch:[['🙏 Excuses aanbieden',()=>{rpop(-2);kar(1);return 'Je zegt dat je ook maar een mens bent. Het meeste land vindt dat prima.'}],
   ['🤥 Ontkennen',()=>{if(chance(.4))return 'Het paleis noemt de foto\'s "bewerkt". Het verhaal sterft een stille dood.';rpop(-7);rsc(1);return 'Er duikt een filmpje op. Ontkennen was een slecht idee.'}],
   ['😂 Er een grap over maken',()=>{if(chance(.6)){rpop(4);return 'Je post zelf een foto met een kroon van bierdopjes. Het land lacht mee.'}rpop(-4);return 'Niet iedereen kan erom lachen. "Weinig respect voor het ambt," schrijft een columnist.'}]]});
E('roy_vakantie',{a:[18,95],w:()=>royOn()?(econ()==='recessie'?8:3):0,cd:4,c:()=>royOn()&&!S.roy.out,t:'Een dure vakantievilla',x:'Een krant onthult dat je een villa aan zee laat bouwen. Het land zit in een moeilijke tijd.',
  ch:[['🏷️ De villa verkopen',()=>{rpop(7);kar(2);return 'Je verkoopt de villa. "Goed gebaar," schrijven de kranten.'}],
   ['🏖️ Gewoon gaan bouwen',()=>{rpop(-8);rsc(1);hap(3);return 'De villa wordt prachtig. Je populariteit niet.'}],
   ['📉 Een kleinere versie',()=>{rpop(-2);return 'Je schrapt de helikopterplatform. Een compromis waar niemand blij van wordt.'}]]});
E('roy_boek',{a:[25,95],w:RW(3),cd:8,c:()=>royHigh(),t:'Een onthullingsboek',x:'Een oud-medewerker van het paleis schrijft een boek over jouw "humeurige ochtenden".',
  ch:[['🤐 Zwijgen',()=>{rpop(-3);return 'Het boek verkoopt goed. Na een paar maanden is iedereen het vergeten.'}],
   ['📺 In een interview reageren',()=>{if(chance(.5)){rpop(4);return 'Je geeft toe dat je \'s ochtends onuitstaanbaar bent zonder koffie. Het land herkent zich erin.'}rpop(-5);rsc(1);return 'Je reageert geïrriteerd. Daarmee bevestig je precies wat in het boek staat.'}],
   ['⚖️ Het boek laten verbieden',()=>{cash(-Math.round(50000*(S.cpi||1)));if(chance(.3))return 'De rechter verbiedt het boek. Het is dan al uitverkocht.';rpop(-6);rsc(1);return 'De rechter weigert. Het boek gaat nu twee keer zo hard.'}]]});
E('roy_belasting',{a:[25,95],w:RW(3),cd:10,c:()=>royHigh()&&ageY()>=18,t:'Belastingvragen',x:'Een krant vraagt of het koninklijk huis wel genoeg belasting betaalt over het privévermogen.',
  ch:[['💶 Vrijwillig belasting betalen',()=>{const k=Math.round(Math.max(0,S.money)*.08);cash(-k);rpop(8);kar(2);return `Je kondigt aan voortaan vrijwillig belasting te betalen. Dit jaar ${fmt(k)}. Applaus.`}],
   ['📋 Uitleggen hoe het zit',()=>{rpop(-1);return 'Je legt uit dat het in de grondwet staat. Juridisch klopt het. Het voelt alleen niet zo.'}],
   ['🙈 Negeren',()=>{rpop(-5);return 'Het onderwerp blijft terugkomen in elke talkshow.'}]]});
E('roy_republiek',{a:[18,95],w:()=>royHigh()&&S.roy.pop<45?6:0,cd:4,c:()=>royHigh(),t:'Republikeinse demonstratie',x:'Duizenden mensen demonstreren voor een republiek. Op de borden staat: "Kroon eraf".',
  ch:[['🗣️ Het gesprek aangaan',()=>{if(chance(.6)){rpop(6);return 'Je nodigt de organisatoren uit op het paleis. Ze vinden je nog steeds overbodig, maar wel aardig.'}rpop(-2);return 'Het gesprek eindigt in een schreeuwpartij die naar buiten lekt.'}],
   ['✂️ Je eigen toelage verlagen',()=>{S.roy.cut=1;rpop(9);return 'Je verlaagt je eigen toelage met een kwart. Dat had niemand verwacht.'}],
   ['🙈 Negeren',()=>{rpop(-3);return 'De demonstratie wordt volgend jaar groter.'}]]});
E('roy_familie',{a:[18,95],w:RW(3),cd:6,c:()=>royOn()&&living(['broer','zus']).length>0,ctx:()=>ctxP(pick(living(['broer','zus']))),t:'Een familieschandaal',x:c=>`Je ${relWord(Pe(c))} ${Pe(c).first} komt in opspraak door zakendeals met een dubieuze miljardair.`,
  ch:[['🛡️ Verdedigen',c=>{rel_(Pe(c),8);rpop(-4);rsc(1);return `Je staat achter ${Pe(c).first}. Familie is familie, maar het kost je krediet.`}],
   ['↔️ Afstand nemen',c=>{rel_(Pe(c),-12);rpop(3);return `Je laat weten dat ${Pe(c).first} "privé handelde". ${Pe(c).first} belt je niet meer terug.`}],
   ['🚪 Uit het koninklijk huis zetten',c=>{const p=Pe(c);p.royOut=1;rel_(p,-30);rpop(6);return `${p.first} hoort niet langer bij het koninklijk huis en verliest de plek in de lijn van troonopvolging.`},()=>S.roy.mon==='me']]});
E('roy_dienst',{a:[18,18],once:1,w:RW(20),c:()=>royOn()&&!S.roy.out,t:'Een koninklijke traditie',x:'In je familie gaan erfgenamen na school een jaar naar de militaire academie. Je ouders verwachten het van je.',
  ch:[['🪖 Gaan',()=>{sk('sport',6);S.disc=clamp((S.disc??50)+8);rpop(4);return 'Je kruipt door modder, schiet op schijven en leert salueren. Het staat goed op de foto\'s.'}],
   ['🌍 Liever vrijwilligerswerk in het buitenland',()=>{kar(5);rpop(3);sk('sociaal',3);return 'Je bouwt een jaar lang scholen. De kranten zijn onder de indruk.'}],
   ['🙅 Weigeren',()=>{rpop(-3);hap(3);relAdj('moeder',-6);relAdj('vader',-6);return 'Je ouders zijn teleurgesteld. Jij gaat op wereldreis.'}]]});
E('roy_school',{a:[6,12],once:1,w:RW(15),c:()=>royOn(),t:'De nieuwe klasgenoot',x:'Op je eerste schooldag staat er een beveiliger achter in de klas. Iedereen staart.',
  ch:[['🙂 Gewoon doen',()=>{sk('sociaal',3);hap(2);return 'Na een week is iedereen eraan gewend. Na een maand ben je gewoon die met de beveiliger.'}],
   ['🙏 De beveiliger op de gang laten wachten',()=>{hap(4);return 'De beveiliger zit voortaan op de gang. Jij kunt eindelijk briefjes doorgeven.'}],
   ['😎 Opscheppen',()=>{hap(1);kar(-2);return 'Je vertelt dat je later koning wordt van de hele speelplaats. Niemand wil naast je zitten.'}]]});
E('roy_relatie',{a:[18,45],w:RW(4),cd:6,c:()=>royOn()&&!!partner(),ctx:()=>ctxP(partner()),t:'Je partner onder een vergrootglas',x:c=>`Journalisten graven in het verleden van ${Pe(c).first}. Er duiken oude berichten op.`,
  ch:[['🛡️ Je partner verdedigen',c=>{rel_(Pe(c),10);rpop(-2);return `${Pe(c).first} is je dankbaar. Een deel van het land vindt dat je de kritiek wegwuift.`}],
   ['🎙️ Samen een interview geven',c=>{if(chance(.55)){rpop(5);rel_(Pe(c),6);return 'Jullie laten zien hoe jullie elkaar vonden. Het land smelt.'}rpop(-3);return 'Het interview is houterig. "Gescript," schrijven de recensenten.'}],
   ['↔️ Afstand nemen',c=>{rel_(Pe(c),-15);return `${Pe(c).first} voelt zich in de steek gelaten.`}]]});
E('roy_kroonjuweel',{chaos:1,a:[16,95],w:RW(2),once:1,c:()=>royOn(),t:'Zoek: de kroon',x:'Bij het afstoffen ontdekt een bediende dat de kroon weg is. In de vitrine ligt een plastic exemplaar uit een feestwinkel.',
  ch:[['🕵️ Zelf op onderzoek',()=>{if(chance(.6)){rpop(3);return 'De kroon ligt in de kast van de hofnar, die het een goede grap vond. Hij is ontslagen.'}return 'De kroon blijft weg. Bij de volgende ceremonie draag je het plastic exemplaar. Niemand ziet het.'}],
   ['🤫 Het stilhouden',()=>{rsc(1);return 'Je zegt niets. Een week later staat het in alle kranten.'}]]});
E('adel_bal',{a:[17,19],once:1,w:()=>S.adel?20:0,c:()=>!!S.adel,t:'Het debutantenbal',x:'Je familie verwacht dat je dit jaar debuteert op het grote bal in de hoofdstad. Witte handschoenen, een wals en honderd ogen.',
  ch:[['💃 Stralend debuteren',()=>{hap(6);sk('sociaal',4);if(chance(.3))addFriend();return 'Je wals is vlekkeloos. Je oma noemt het de mooiste avond van haar leven.'}],
   ['🙅 Weigeren',()=>{relAdj('moeder',-5);relAdj('vader',-5);hap(2);return 'Je gaat naar een festival. Je familie spreekt er nog jaren schande van.'}]]});
E('adel_landgoed',{sys:1,need:()=>!!(S.adel&&S.adel.lg&&!S.adel.lgOwn),t:'Het familielandgoed',x:()=>`Het landgoed van de familie ${S.adel.fam} komt in jouw handen. Het kasteel is prachtig en lekt aan alle kanten. Onderhoud kost elk jaar een fortuin.`,
  ch:[['🏰 Houden en zelf bewonen',()=>{S.adel.lgOwn=1;const v=Math.round(ri(18,45)*100000*(S.cpi||1));S.props.push({id:uid(),name:'Landgoed',addr:`Kasteel ${S.adel.fam}`,value:v,buy:0,mort:0,mort0:0,rentOut:false,w:0,m2:ri(900,2200),yr:ri(1550,1790),lbl:6,cond:ri(35,60),def:[]});MS('Erfde het familiekasteel',2);return `Het kasteel (waarde ${fmt(v)}) is nu van jou, met zeventien kamers zonder verwarming.`}],
   ['🎫 Openstellen voor publiek',()=>{S.adel.lgOwn=1;const v=Math.round(ri(18,45)*100000*(S.cpi||1));S.props.push({id:uid(),name:'Landgoed',addr:`Kasteel ${S.adel.fam}`,value:v,buy:0,mort:0,mort0:0,rentOut:true,ten:{n:'Bezoekers',kind:'Museum',em:'🎫',rate:.02,rel:.9,ref:'goed',yrs:0,happy:70},w:0,m2:ri(900,2200),yr:ri(1550,1790),lbl:6,cond:ri(35,60),def:[]});return 'Toeristen lopen door de grote zaal. De entree betaalt het dak.'}],
   ['🏷️ Verkopen aan een hotelketen',()=>{S.adel.lg=0;const v=Math.round(ri(15,40)*100000*(S.cpi||1));cash(v);kar(-2);return `Je verkoopt het landgoed voor ${fmt(v)}. Je tantes spreken je nooit meer aan.`}]]});
E('adel_huwelijk',{a:[20,45],once:1,w:()=>S.adel&&partner()?10:0,c:()=>!!S.adel&&!!partner(),ctx:()=>ctxP(partner()),t:'Niet van stand',x:c=>`Je familie vindt ${Pe(c).first} "niet van stand". Bij het kerstdiner krijgt ${Pe(c).first} een plekje aan het eind van de tafel.`,
  ch:[['🛡️ Partij kiezen voor je partner',c=>{rel_(Pe(c),12);relAdj('moeder',-6);relAdj('vader',-6);return `Je zet ${Pe(c).first} naast je. Oma zwijgt de rest van de avond, dat is winst.`}],
   ['🤐 Niks zeggen',c=>{rel_(Pe(c),-10);return `${Pe(c).first} rijdt na het dessert zwijgend naar huis.`}]]});
Object.assign(EVMETA,{roy_geboren:['Koninklijk huis','👑'],adel_geboren:['Adel','🎩'],roy_kroning:['Koninklijk huis','👑'],roy_jubileum:['Koninklijk huis','🎉'],roy_abdicatie:['Koninklijk huis','🪑'],roy_toestemming:['Koninklijk huis','💍'],roy_referendum:['Koninklijk huis','🗳️'],roy_paparazzi:['Koninklijk huis','📸'],roy_feest:['Koninklijk huis','🍾'],roy_vakantie:['Koninklijk huis','🏖️'],roy_boek:['Koninklijk huis','📕'],roy_belasting:['Koninklijk huis','💶'],roy_republiek:['Koninklijk huis','✊'],roy_familie:['Koninklijk huis','📰'],roy_dienst:['Koninklijk huis','🪖'],roy_school:['Koninklijk huis','🏫'],roy_relatie:['Koninklijk huis','💑'],roy_kroonjuweel:['Koninklijk huis','👑'],adel_bal:['Adel','💃'],adel_landgoed:['Adel','🏰'],adel_huwelijk:['Adel','🎩']});

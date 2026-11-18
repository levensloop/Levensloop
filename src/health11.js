/* ================= FASE 11: gezondheid en ouderdom (mild) =================
   Keuze Thijmen: ziektes mild (de meeste gaan over), geen dementie, geen keuzes over het levenseinde.
   11.1 klachten eerst, de dokter stelt de ziekte vast; extra milde ziektes; Alzheimer niet meer in nieuwe ziektes
   11.2 leefstijl telt (S.ls); 11.3 het ziekenhuis als groot moment bij een ernstige ziekte; 11.4 steun bij mentale klachten
   11.5 ouder worden: seniorenwoning, zorgcentrum, mantelzorg, je kinderen helpen jou, opa en oma zijn; 11.6 fitheid (S.fit) */

// ---------- 11.1 ziektes ----------
{const i=ILLO.indexOf('Alzheimer');if(i>=0)ILLO.splice(i,1)}
Object.assign(ILLS,{'een oorontsteking':[1,0,'huisarts',.8],'eczeem':[1,0,'dermatoloog',.5,1],'hooikoorts':[1,0,'huisarts',.4,1],'een gebroken pols':[2,0,'orthopeed',.85],
  'reuma':[3,0,'internist',.2,1],'glaucoom':[2,0,'oogarts',.3,1],'gehoorverlies':[2,0,'huisarts',.2,1],'jicht':[2,0,'internist',.6],'galstenen':[3,0,'internist',.75],
  'slapeloosheid':[2,0,'huisarts',.5,0,1],'een blaasontsteking':[1,0,'huisarts',.9],'spataderen':[1,0,'dermatoloog',.7]});
for(const n of ['een oorontsteking','eczeem','hooikoorts','een gebroken pols','slapeloosheid','een blaasontsteking'])if(!ILLY.includes(n))ILLY.push(n);
for(const n of ['reuma','glaucoom','gehoorverlies','jicht','galstenen','spataderen'])if(!ILLO.includes(n))ILLO.push(n);
// klachten voordat je weet wat het is
const SYM={'migraine':'bonzende hoofdpijn','een hernia':'pijn onder in je rug','astma':'kortademigheid','de ziekte van Pfeiffer':'moeheid en keelpijn','de ziekte van Lyme':'een rode kring op je been en moeheid','long covid':'moeheid die niet overgaat',
  'diabetes':'veel dorst en vaak plassen','artrose':'stijve en pijnlijke knieën','hoge bloeddruk':'hoofdpijn en duizeligheid','staar':'wazig zien','een oorontsteking':'oorpijn','eczeem':'jeukende rode plekken','hooikoorts':'niezen en tranende ogen',
  'reuma':'pijnlijke, gezwollen handen','glaucoom':'een vlek in je zicht','gehoorverlies':'moeite met verstaan','jicht':'een dikke, pijnlijke grote teen','galstenen':'pijn rechts in je buik','slapeloosheid':'slecht slapen','een blaasontsteking':'een branderig gevoel bij het plassen','spataderen':'zware benen','een angststoornis':'onrust en hartkloppingen','een depressie':'somberheid','een burn-out':'uitputting'};
const symOf=il=>SYM[il.n]||'vage klachten';
const illNm=il=>il.und?`klachten: ${symOf(il)}`:il.n;
// nieuwe ziektes: lichte ziektes beginnen als klachten
illYear=(f=>function(a){const before=new Set(S.ill);const n0=S.log.length;const r=f.apply(this,arguments);
  for(const il of S.ill)if(!before.has(il)){const I=illInfo(il);
    if(!I.l&&SYM[il.n]&&chance(.55)){il.und=1;for(let i=S.log.length-1;i>=n0;i--){const t=S.log[i];const tx=typeof t==='string'?t:t&&t.t;if(tx&&tx.includes(il.n)){const nt=`Je hebt al een tijdje last van ${symOf(il)}. Misschien eens naar de dokter?`;if(typeof t==='string')S.log[i]=nt;else t.t=nt;break}}}
    else if(I.l&&typeof fmFree==='function'&&fmFree()&&!inJail()){fmTake();Q.push({id:'h11_zkh',c:{n:il.n}})}}
  // klachten zonder diagnose: gaan vaak vanzelf over
  for(const il of S.ill.slice())if(il.und&&before.has(il)){if(chance(.4)){S.ill=S.ill.filter(x=>x!==il);L(`Je last van ${symOf(il)} is vanzelf overgegaan.`,'good')}else{hea(-2);if(chance(.35)){il.und=0;L(`Je klachten worden erger. De huisarts stelt vast dat je ${il.n} hebt.`,'bad')}}}
  return r})(illYear);
// mild: behandelingen werken vaker
treat=(f=>function(il,sp,o){o=Object.assign({},o||{});if(il&&!illInfo(il).chron)o.bonus=(o.bonus||0)+.12;if(il&&il.und){il.und=0;const r=f.call(this,il,sp,o);return `De dokter ontdekt wat het is: ${il.n}. ${r}`}return f.call(this,il,sp,o)})(treat);

// ---------- 11.3 ernstige ziekte: het behandelplan ----------
E('h11_zkh',{sys:1,need:c=>S.ill.some(i=>i.n===c.n)&&!inJail(),t:'Het behandelplan',x:c=>`De specialist bespreekt met je wat er moet gebeuren. Je hebt ${c.n}. "We gaan er alles aan doen," zegt ze.`,ch:[
 ['🏥 Het ziekenhuis in de buurt',c=>{const il=S.ill.find(i=>i.n===c.n);payMed(2000);const r=treat(il,illInfo(il).sp,{bonus:.12,what:'De behandeling'});return r+zkhVisit()}],
 ['🎓 Een academisch ziekenhuis',c=>{const il=S.ill.find(i=>i.n===c.n);payMed(5000);cash(-Math.round(300*(S.cpi||1)));const r=treat(il,illInfo(il).sp,{bonus:.25,what:'De behandeling in het academisch ziekenhuis'});return r+zkhVisit()},()=>S.money>=Math.max(medCost(5000),0)+300*(S.cpi||1)],
 ['⏳ Eerst afwachten',c=>{if(chance(.5)){hea(-8);return 'Je wacht af. Het wordt helaas niet beter.'}return 'Je wacht af. De klachten blijven gelukkig gelijk.'}]]});
EVMETA.h11_zkh=['Gezondheid','🏥'];
function zkhVisit(){const ps=living(['partner','kind','moeder','vader','broer','zus','vriend']).filter(p=>p.rel>=55&&!(typeof abroad==='function'&&abroad(p))&&pAge(p)>=12).slice(0,3);if(!ps.length)return ' Er komt niemand op bezoek. Het voelt eenzaam.';for(const p of ps){p.rel=clamp(p.rel+3)}hap(4);return ` ${f8List(ps.map(p=>p.first))} ${ps.length>1?'komen':'komt'} op bezoek met bloemen en tijdschriften.`}

// ---------- 11.2 leefstijl en 11.6 fitheid ----------
function lsYear(){const A=S.lastActs||{},a=ageY();let s=50;const sp=['gym','run','klim'].filter(k=>A[k]).length+(S.sport&&S.sport.st&&S.sport.st!=='gestopt'?1:0);
  s+=sp*9+(A.eten?8:0)+(A.med?4:0)-(addLvl('roken')>=50?25:0)-(addLvl('alcohol')>=50?15:0)-(addLvl('drugs')>=50?20:0)-(S.job&&S.job.wl==='over'?8:0);S.ls=clamp(Math.round(s));
  // fitheid: sporten maakt fitter; zonder sport zak je langzaam naar een normale basis (die met de jaren iets lager ligt)
  const base=a<40?45:a<60?40:a<75?35:30;let f=S.fit??(a<30?55:45);if(sp)f+=sp*4;else if(f>base)f-=2;else if(f<base)f+=1;S.fit=clamp(Math.round(f+(S.ls-50)/25));
  if(a>=12){const d=(S.ls-50)/30+(S.fit-base)/50;hea(d>=.8?1:d<=-.8?-1:0)}}
function lsTips(){const t=[],A=S.lastActs||{};if(!['gym','run','klim'].some(k=>A[k]))t.push('meer bewegen (Geest & lichaam)');if(!A.eten)t.push('gezonder eten');if(addLvl('roken')>=50)t.push('stoppen met roken');if(addLvl('alcohol')>=50)t.push('minder drinken');if(S.job&&S.job.wl==='over')t.push('minder overuren');return t}
sheetDoctor=(f=>function(el){const r=f.apply(this,arguments);const ls=S.ls??50,fit=S.fit??50;const t=lsTips();
  card(el,`<h3>🍎 Je leefstijl</h3><div class="stat"><span>Leefstijl</span><span></span><span class="v">${ls}%</span>${bar(ls)}</div><div class="stat"><span>Fitheid</span><span></span><span class="v">${fit}%</span>${bar(fit,'var(--brand)')}</div><span class="muted">${t.length?'Tip: '+he(f8List(t))+'.':'Goed bezig! Zo blijf je langer gezond.'}</span>`);return r})(sheetDoctor);
// namen van klachten op de juiste plek tonen
{const a=ACTS.find(x=>x[0]==='dokter');if(a)a[3]=()=>S.ill.length?`Je klachten: ${S.ill.map(illNm).join(', ')}`:'Huisarts, specialisten, check-up'}
illMenu=(f=>function(il){if(il&&il.und){const sp=SPEC.huisarts;modal({title:cap(symOf(il)),em:'🤔',cat:'Gezondheid',text:'Je weet nog niet wat het is. De huisarts kan het uitzoeken.',choices:opts([{t:'Naar de huisarts',s:fmt(medCost(sp[2])),ic:sp[0],on:()=>{closeModal();doAct('Huisarts',()=>{payMed(sp[2]);return treat(il,'huisarts',{what:'De huisarts'})},true,sp[0])}}])});return}return f.apply(this,arguments)})(illMenu);

// ---------- 11.4 steun bij mentale klachten ----------
function mentYear(){const m=S.ill.filter(i=>!i.und&&illInfo(i).ment);if(!m.length)return;const sup=[partner(),S.bff&&P(S.bff)].filter(p=>p&&p.alive&&p.rel>=55);
  if(sup.length&&chance(.35)){const p=pick(sup);hap(3);p.rel=clamp(p.rel+2);L(`💛 ${Who(p)} is er voor je. Dat helpt.`,'good');if(chance(.3)){const il=pick(m);S.ill=S.ill.filter(x=>x!==il);L(`Je voelt je beter. Je bent hersteld van ${il.n}.`,'good');hap(5)}}}

// ---------- 11.5 ouder worden ----------
const SENIOR=9600,ZORGC=24000;
sheetHousing=(f=>function(el){const r=f.apply(this,arguments);const a=ageY(),cp=S.cpi||1;if(a<65||inJail())return r;const s=sec(el,'Ouder worden');
  const h=S.home;if(h.k!=='eigen'&&h.name!=='Seniorenwoning'&&h.name!=='Zorgcentrum')row(s,{ic:'🏡',t:'Naar een seniorenwoning',s:`Gelijkvloers, met buren van je leeftijd · ${fmt(SENIOR*cp/12)} per maand`,dots:true,on:()=>ask('Verhuizen?','Je gaat in een seniorenwoning wonen.','Verhuizen',()=>doAct('Verhuizen',()=>{setRent('Seniorenwoning',Math.round(SENIOR*cp));hap(3);return 'Je verhuist naar een seniorenwoning. Geen trappen meer, en de buurvrouw komt meteen koffie drinken.'},true,'🏡'),'go')});
  else if(h.k==='eigen')card(s,'<span class="muted">Wil je kleiner gaan wonen? Verkoop eerst je huis bij Bezit.</span>');
  if(a>=75&&h.name!=='Zorgcentrum')row(s,{ic:'🏥',t:'Naar een zorgcentrum',s:S.st.health<45?`Zorg dichtbij · ${fmt(ZORGC*cp/12)} per maand`:'Pas als je gezondheid minder wordt',dis:S.st.health>=45||h.k==='eigen',dots:true,on:()=>ask('Naar een zorgcentrum?','Je krijgt elke dag hulp en er is altijd iemand in de buurt.','Verhuizen',()=>doAct('Verhuizen',()=>{setRent('Zorgcentrum',Math.round(ZORGC*cp));hea(5);return 'Je verhuist naar een zorgcentrum. Elke dag verse koffie, en op donderdag bingo.'},true,'🏥'),'go')});return r})(sheetHousing);
F8.person.push((el,p)=>{if(!p.alive||inJail()||(typeof abroad==='function'&&abroad(p)))return;const pa=pAge(p),my=ageY();
  if(['moeder','vader','opa','oma','partner'].includes(p.role)&&my>=18&&(pa>=75||p.ill)){const s=sec(el,'Zorg');const k='mz'+p.id;
    row(s,{ic:'🤲',t:'Mantelzorg geven',s:S.acts[k]?'Dit jaar al gedaan':'Boodschappen, de was, mee naar de dokter',dis:!!S.acts[k],on:()=>doAct('Mantelzorg',()=>{S.acts[k]=1;p.rel=clamp(p.rel+8);p.hl=Math.min(90,(p.hl??60)+5);hap(-1);hea(-1);if(typeof memAdd==='function'&&p.ill)memAdd(p,'ziek+');return `Je helpt ${p.first} een paar maanden met van alles. Zwaar, maar ${f8Hij(p.g)} is je ontzettend dankbaar.`},true,'🤲')})}
  if(p.role==='kleinkind'&&pa<12&&my>=40){const s=sec(el,'Opa en oma zijn'.replace('Opa en oma',S.p.g==='v'?'Oma':'Opa'));const k='vw'+p.id;
    row(s,{ic:'🍦',t:'Verwennen',s:S.acts[k]?'Dit jaar al gedaan':'IJsjes, cadeautjes en te laat naar bed',dis:!!S.acts[k],on:()=>doAct('Verwennen',()=>{S.acts[k]=1;cash(-Math.round(25*(S.cpi||1)));p.rel=clamp(p.rel+8);hap(3);return pick([`Je neemt ${p.first} mee naar de speeltuin en daarna voor een ijsje met drie bolletjes.`,`${p.first} mag bij jou alles. Ook om 10 uur nog chips eten.`,`Jullie bakken pannenkoeken. De keuken is een slagveld.`])},true,'🍦')})}});
function oldYear(){const a=ageY();if(a<75||inJail())return;
  if(S.st.health<50&&chance(.4)){const ks=living('kind').filter(k=>k.rel>=55&&pAge(k)>=18&&!(typeof abroad==='function'&&abroad(k)));if(ks.length){const k=pick(ks);hap(2);k.rel=clamp(k.rel+1);L(`🛒 ${Who(k)} doet je boodschappen en blijft koffie drinken.`,'good')}}
  if(a>=80&&S.st.health<40&&S.home&&S.home.name!=='Zorgcentrum'&&!S.flags.zc11){S.flags.zc11=1;L('Alles gaat wat moeizamer. Een zorgcentrum is misschien iets voor je (zie Bezit → Wonen).','sys')}}

F8.year.push(()=>{if(!S.alive)return;lsYear();mentYear();oldYear()});

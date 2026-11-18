/* ================= FASE 23: eigen bedrijf =================
   Keuzes Thijmen: personeel als personen, concurrenten en crises, nieuwe producten, rechtszaken en overnames.
   Bestond al (biz.js): medewerkers als personen met eigen momenten (be_*), inspectie, rechtszaak, overnamebod, schandaal, staking,
   viraal, grote klant, franchise en beursgang. Hier komt bij:
   23.1 een vaste concurrent per bedrijf (b.rv: naam, sterkte); zijn zetten (b23_rival); aanklagen, verslaan (failliet) of overnemen
   23.2 nieuwe producten lanceren (b.prods): testen of meteen lanceren; hit of flop het jaar erna
   23.3 medewerker van het jaar
   Het effect op klanten loopt via b.mkt (biz.js gebruikt die als extra vraag in bizYear). */

// ---------- 23.1 de concurrent ----------
function rvName(b){let n='';for(let i=0;i<5&&(!n||n===b.name);i++)n=pick(BIZPRE)+' '+pick((BIZSUF&&BIZSUF[b.type])||['& Co','Groep','Company']);return n}
const RVMOVE={prijs:['💸','begint een prijzenoorlog: alles 20% goedkoper'],reclame:['📣','plakt de hele stad vol met reclame'],personeel:['🧲','probeert je beste mensen weg te lokken'],filiaal:['🏪','opent een vestiging recht tegenover die van jou'],nep:['⭐','krijgt verdacht veel vijfsterrenrecensies']};
E('b23_rival',{sys:1,need:c=>{const b=S.biz.find(x=>x.id===c.id);return !!(b&&b.rv)&&!inJail()},t:'De concurrent',x:c=>{const b=S.biz.find(x=>x.id===c.id);const m=RVMOVE[c.k]||RVMOVE.prijs;return `${m[0]} ${b.rv.n} ${m[1]}. Wat doe je met ${b.name}?`},ch:[
  ['🛡️ Terugvechten met een campagne',c=>{const b=S.biz.find(x=>x.id===c.id);const k=Math.round(Math.max(3000*cpi_(),(b.rev||0)*.04));if(b.cash>=k)b.cash-=k;else cash(-k);const win=chance(.45+(S.sk.zaken||30)/250);if(win){b.rv.str=clamp(b.rv.str-ri(12,22));b.mkt=(b.mkt||0)+.06;return `Je campagne (${fmt(k)}) slaat aan. ${b.rv.n} verliest terrein.`}b.rv.str=clamp(b.rv.str+4);return `Je campagne (${fmt(k)}) valt weg in het geweld. ${b.rv.n} houdt stand.`}],
  ['⭐ Inzetten op kwaliteit',c=>{const b=S.biz.find(x=>x.id===c.id);b.rep=clamp(b.rep+ri(2,6));b.rv.str=clamp(b.rv.str-ri(3,8));return 'Je klanten merken het verschil. De trouwe klanten blijven.'}],
  ['⚖️ Een advocaat inschakelen',c=>{const b=S.biz.find(x=>x.id===c.id);const k=Math.round(12000*cpi_());cash(-k);if(c.k==='nep'||c.k==='personeel'?chance(.6):chance(.3)){const w=Math.round(ri(20,80)*1000*cpi_());cash(w);b.rv.str=clamp(b.rv.str-20);return `De rechter geeft je gelijk. ${b.rv.n} moet ${fmt(w)} betalen.`}return `De rechter ziet er niets onrechtmatigs in. Kosten: ${fmt(k)}.`},c=>c.k==='nep'||c.k==='personeel'||c.k==='prijs'],
  ['🤷 Negeren',c=>{const b=S.biz.find(x=>x.id===c.id);b.rv.str=clamp(b.rv.str+ri(6,12));return `Je laat het gaan. ${b.rv.n} groeit gestaag.`}]]});
EVMETA.b23_rival=['Ondernemen','🥊'];
function rvPrice(b){return Math.round(Math.max(20000*cpi_(),(b.value||0)*(.15+b.rv.str/180))/1000)*1000}
function buyRival(b){const k=rvPrice(b);const own=b.cash>=k;ask(`${b.rv.n} overnemen?`,`De eigenaren vragen ${fmt(k)}. ${own?'Je betaalt het uit de kas van je bedrijf.':'Je betaalt het zelf.'} Hun klanten komen naar jou.`,'Overnemen',()=>{
  if(!own&&S.money<k){toast(`Je hebt ${fmt(k)} nodig`);return}doAct('Overname',()=>{if(own)b.cash-=k;else cash(-k);const n=b.rv.n,str=b.rv.str;b.rv=null;b.rvY=year();b.mkt=(b.mkt||0)+.1+str/400;b.rep=clamp(b.rep+4);b.value=Math.round((b.value||0)+k*.8);sk('zaken',3);MS(`Nam de concurrent ${n} over`,2);
    return `${n} is van jou. De bordjes worden vervangen en hun klanten komen voortaan bij ${b.name}.`},true,'🤝')})}

// ---------- 23.2 nieuwe producten ----------
const PROD23={restaurant:['een nieuw seizoensmenu','een vegan kaart','een tafel van de chef'],cafe:['een eigen huisbier','een ontbijtkaart','een pubquizavond'],foodtruck:['een signature burger','een dessertmenu'],bakkerij:['een zuurdesemlijn','taarten op bestelling','een koffiehoek'],
  webshop:['een eigen merk','een abonnement','razendsnelle bezorging'],saas:['een AI-functie','een gratis versie','een mobiele app'],app:['een premium abonnement','een nieuwe versie','een sociaal netwerk-functie'],kledingmerk:['een zomercollectie','een samenwerking met een influencer','een duurzame lijn'],
  brouwerij:['een alcoholvrij bier','een seizoensbier','een speciaalbier op vat'],kapsalon:['een barbershop-hoek','haarproducten van eigen merk'],hotel:['een spa','een rooftopbar','arrangementen'],sportschool:['groepslessen','een app met trainingen','24 uur open'],
  consultancy:['een duurzaamheidsadvies','een online cursus'],bouwbedrijf:['duurzame tiny houses','verduurzamen van woningen'],escaperoom:['een horrorkamer','een kamer voor kinderen'],nachtclub:['een vaste dj-avond','een vip-lounge'],platenlabel:['een festival','een podcast']};
function prodIdeas(b){return (PROD23[b.type]||['een nieuw product','een premium versie','een goedkope variant']).concat(['iets compleet nieuws'])}
function launchMenu(b){if(S.acts['prod'+b.id]){toast('Je lanceert dit jaar al iets');return}const base=Math.max(4000*cpi_(),(b.rev||0)*.06);
  modal({title:'Iets nieuws lanceren',em:'🚀',cat:b.name,text:'Waar ga je mee komen?',choices:opts(prodIdeas(b).map(t=>({t:cap(t),on:()=>{closeModal();
    modal({title:cap(t),em:'🚀',cat:b.name,text:'Test je het eerst met klanten, of lanceer je meteen?',choices:opts([
      {t:'🧪 Eerst testen',s:`${fmt(Math.round(base*1.5))} · minder risico`,on:()=>{closeModal();doLaunch(b,t,Math.round(base*1.5),.15)}},
      {t:'🚀 Meteen lanceren',s:`${fmt(Math.round(base))} · snel, maar gokken`,on:()=>{closeModal();doLaunch(b,t,Math.round(base),0)}}])})}})))})}
function doLaunch(b,t,k,safe_){doAct('Lancering',()=>{S.acts['prod'+b.id]=1;if(b.cash>=k)b.cash-=k;else cash(-k);b.prods=(b.prods||[]).concat([{t,y:year(),s:safe_,r:null}]);return `${cap(t)} komt eraan. Kosten: ${fmt(k)}. Volgend jaar weet je of het aanslaat.`},true,'🚀')}
function prodResolve(b){for(const p of b.prods||[]){if(p.r||year()-p.y<1)continue;const q=(b.rep-50)/200+((S.sk.zaken||30)-40)/300+(p.s||0);const r=R()+q;
  if(r>=.78){p.r='hit';b.mkt=(b.mkt||0)+.22;b.rep=clamp(b.rep+8);hap(6);MS(`Had een hit met ${p.t} (${b.name})`,1);L(`🚀 ${cap(p.t)} van ${b.name} is een HIT! De klanten staan in de rij.`,'good big')}
  else if(r>=.38){p.r='ok';b.mkt=(b.mkt||0)+.06;L(`🚀 ${cap(p.t)} van ${b.name} doet het netjes.`,'good')}
  else{p.r='flop';b.rep=clamp(b.rep-6);hap(-3);L(`🚀 ${cap(p.t)} van ${b.name} flopt. ${pick(['De recensies zijn genadeloos.','Niemand snapt wat het is.','Je haalt het na drie maanden weer uit de schappen.'])}`,'bad')}}}

// ---------- 23.3 medewerker van het jaar ----------
function empOfYear(b){ensureEmp(b);const w=b.emp.filter(p=>p.alive!==false);if(!w.length){toast('Je hebt nog geen medewerkers met een naam');return}
  modal({title:'Medewerker van het jaar',em:'🏅',cat:b.name,text:'Wie verdient het dit jaar?',choices:opts(w.slice(0,8).map(p=>({t:`${p.first} ${p.last||''}`,s:p.job||p.fn||'',on:()=>{closeModal();doAct('Medewerker van het jaar',()=>{S.acts['eoy'+b.id]=1;p.rel=clamp((p.rel||50)+15);for(const q of w)if(q!==p)q.rel=clamp((q.rel||50)+(chance(.3)?-3:1));b.rep=clamp(b.rep+1);return `${p.first} krijgt de prijs en een weekendje weg. ${pick(['Er wordt gejuicht op de werkvloer.','Een paar collega\'s kijken een beetje jaloers.','Er komen tranen bij de speech.'])}`},true,'🏅')}})))})}

// ---------- in het scherm van je bedrijf ----------
sheetBiz=(f=>function(el,b){const r=f.apply(this,arguments);if(!S.biz.includes(b)||inJail())return r;const s=sec(el,'Markt en concurrentie');
  if(b.rv)row(s,{ic:'🥊',t:b.rv.n,s:`Je concurrent · ${b.rv.str>=70?'heel sterk':b.rv.str>=45?'sterk':b.rv.str>=25?'aan het wankelen':'bijna failliet'} (${Math.round(b.rv.str)}%)`,bar:{l:'Sterkte',v:b.rv.str,c:b.rv.str>=60?'var(--bad)':'var(--warn,#e0a020)'}});
  if(b.rv)row(s,{ic:'🤝',t:'De concurrent overnemen',s:`Ongeveer ${fmt(rvPrice(b))}`,dots:true,on:()=>buyRival(b)});
  row(s,{ic:'🚀',t:'Iets nieuws lanceren',s:S.acts['prod'+b.id]?'Dit jaar al gedaan':'Een nieuw product of nieuwe dienst',dis:!!S.acts['prod'+b.id],dots:true,on:()=>launchMenu(b)});
  const done=(b.prods||[]).filter(p=>p.r).slice(-3);if(done.length)row(s,{ic:'📦',t:'Eerdere lanceringen',s:done.map(p=>`${p.t} (${p.r==='hit'?'hit':p.r==='ok'?'prima':'flop'})`).join(' · ')});
  if((b.emp||[]).length)row(s,{ic:'🏅',t:'Medewerker van het jaar',s:S.acts['eoy'+b.id]?'Dit jaar al gekozen':'Een prijs voor je beste kracht',dis:!!S.acts['eoy'+b.id],dots:true,on:()=>empOfYear(b)});
  return r})(sheetBiz);

// ---------- elk jaar ----------
F8.year.push(()=>{if(!S.alive||!S.biz||!S.biz.length)return;let asked=false;
  for(const b of S.biz){prodResolve(b);
    if(!b.rv&&(b.age||0)>=1&&(!b.rvY||year()-b.rvY>=4)&&chance(.3)){b.rv={n:rvName(b),str:ri(30,60),y:year()};L(`🥊 Er is een nieuwe concurrent voor ${b.name}: ${b.rv.n}.`,'bad');continue}
    if(!b.rv)continue;const R_=b.rv;R_.str=clamp(R_.str+ri(-4,5)+((b.rep||50)<45?3:0)-((b.rep||50)>75?3:0));if(b.demand)b.demand=Math.max(800,Math.round(b.demand*(1-R_.str/700)));
    if(R_.str<12&&chance(.6)){L(`🥊 ${R_.n} gaat failliet! Hun klanten komen naar ${b.name}.`,'good big');b.mkt=(b.mkt||0)+.12;b.rv=null;b.rvY=year();MS(`Versloeg de concurrent ${R_.n}`,1);continue}
    if(!asked&&chance(.22)&&!Q.some(q=>q.id==='b23_rival')){asked=true;Q.push({id:'b23_rival',c:{id:b.id,k:pick(Object.keys(RVMOVE))}})}}});

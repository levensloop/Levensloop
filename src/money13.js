/* ================= FASE 13: geld, bezit en auto's =================
   Keuze Thijmen: geen (nieuwe) verzekeringen; ongeveer 20 bedrijven op de beurs.
   13.1 auto's: APK, onderhoud, drinken en rijden; ligplaats voor een boot
   13.2 beurs: 8 bedrijven erbij (20 in totaal)
   13.3 belastingaangifte: netjes, slim aftrekken of sjoemelen
   13.5 rijk leven: personeel, een eigen stichting
   13.6 pensioen opbouwen met een lijfrente */

// ---------- 13.2 beurs ----------
Object.assign(HOLD,{unilever:['Unilever','🧴',.05,.16,.035,'aandelen'],ing:['ING','🦁',.06,.28,.06,'aandelen'],booking:['Booking','🏨',.1,.32,0,'aandelen'],toyota:['Toyota','🚗',.06,.22,.025,'aandelen'],
  samsung:['Samsung','📱',.08,.3,.02,'aandelen'],nike:['Nike','👟',.07,.27,.012,'aandelen'],lvmh:['LVMH','👜',.08,.26,.018,'aandelen'],novo:['Novo Nordisk','💉',.11,.3,.012,'aandelen']});
if(typeof NLSTK!=='undefined'&&!NLSTK.includes('ing'))NLSTK.push('ing');

// ---------- 13.1 auto's ----------
function carYear(){const cp=S.cpi||1;for(const c of S.cars){if(c.kind==='motoren'&&!c.yr)continue;const age=c.yr!=null?year()-c.yr:4;
  if(age>=3&&!inJail()){if((c.cond??100)<35){c.apk=0;L(`🔧 Je ${c.name} is afgekeurd bij de APK. Laat hem repareren (onderhoud) voordat je weer rijdt.`,'bad')}else{const k=Math.round(60*cp);cash(-k);c.apk=1}}}
  // boot: ligplaats
  const boats=(S.items||[]).filter(x=>catOf(x)==='boten');if(boats.length){const k=Math.round(boats.reduce((a,b)=>a+Math.max(800*cp,b.value*.015),0));cash(-k);if(period&&period.out){period.out['Ligplaats']=(period.out['Ligplaats']||0)+k;period.exp+=k}}
  // drinken en rijden
  if(S.cars.length&&S.lic&&typeof addLvl==='function'&&addLvl('alcohol')>=60&&chance(.12)&&!inJail()){const c=S.cars[0];c.cond=Math.max(0,(c.cond??100)-ri(20,50));hea(-ri(3,12));const b=Math.round(ri(5,15)*100*cp);cash(-b);kar(-3);S.crim=S.crim||{};L(`🚔 Je rijdt met te veel op en raakt een vangrail. Je ${c.name} is zwaar beschadigd en je krijgt een boete van ${fmt(b)}.`,'bad')}}
sheetOwned=(f=>function(el,x){const r=f.apply(this,arguments);if(!ownById(x.id))return r;const veh=S.cars.includes(x);const cp=S.cpi||1;
  if(veh||['boten','vliegtuigen','helikopters'].includes(catOf(x))){const s=sec(el,'Onderhoud');const cond=x.cond??100;const k=Math.round(Math.max(150*cp,x.value*.03));
    row(s,{ic:'🔧',t:'Onderhoud laten doen',s:cond>=95?'Hij is in topconditie':`${fmt(k)} · conditie naar 100%${x.apk===0?' · nodig voor de APK':''}`,dis:cond>=95||S.money<k,on:()=>doAct('Onderhoud',()=>{cash(-k);x.cond=100;x.apk=1;return `Je ${x.name} glimt weer. De monteur zegt dat hij nog jaren meekan.`},true,'🔧')})}
  return r})(sheetOwned);

// ---------- 13.3 belastingaangifte ----------
function aangifte(){const g=taxable(),t=taxOn(g);if(!g){toast('Je hebt dit jaar geen inkomen om aangifte over te doen');return}const home=S.home&&S.home.k==='eigen';
  modal({title:'Belastingaangifte',em:'📋',cat:'Financiën',text:`Je belastbaar inkomen dit jaar: ${fmt(g)}. Je betaalt ongeveer ${fmt(t)} belasting. Hoe vul je het in?`,choices:opts([
    {t:'✅ Netjes invullen',on:()=>{closeModal();doAct('Aangifte',()=>{S.acts.ib=1;kar(1);return 'Je vult alles eerlijk in. Een paar weken later: "Uw aangifte is akkoord."'},true,'✅')}},
    {t:'🧮 Slim aftrekken',s:home?'Hypotheekrente, giften en studiekosten':'Giften en studiekosten',on:()=>{closeModal();doAct('Aangifte',()=>{S.acts.ib=1;const k=Math.round(t*(home?ri(3,6):ri(1,3))/100);cash(k);return `Je zoekt alle aftrekposten uit. Je krijgt ${fmt(k)} terug.`},true,'🧮')}},
    {t:'🤫 Sjoemelen',s:'Meer terug, maar met een kans op controle',on:()=>{closeModal();doAct('Aangifte',()=>{S.acts.ib=1;kar(-3);if(chance(.22)){const b=Math.round(t*ri(10,20)/100);cash(-b);S.flags.fiscus=(S.flags.fiscus||0)+1;return `De belastingdienst controleert je aangifte. Je moet terugbetalen plus een boete: ${fmt(b)}.`}const k=Math.round(t*ri(5,9)/100);cash(k);return `Niemand die het merkt. Je krijgt ${fmt(k)} terug.`},true,'🤫')}}])})}

// ---------- 13.5 en 13.6 ----------
const STAFF={kok:['👨‍🍳','Een eigen kok',60000,'Elke dag gezond en lekker eten'],chauffeur:['🚘','Een chauffeur',55000,'Nooit meer zelf rijden'],tuin:['🌳','Een tuinman',40000,'Je tuin is altijd perfect'],huis:['🧹','Een huishoudster',45000,'Je huis is altijd schoon']};
function staffMenu(){S.staff=S.staff||{};const cp=S.cpi||1;modal({title:'Personeel',em:'🤵',cat:'Rijk leven',text:'Wie neem je in dienst? Tik nog een keer om iemand te laten gaan.',choices:opts(Object.entries(STAFF).map(([k,[e,n,c,d]])=>({t:`${e} ${n}${S.staff[k]?' ✓':''}`,s:`${d} · ${fmt(c*cp)} per jaar`,on:()=>{closeModal();S.staff[k]=S.staff[k]?0:1;toast(S.staff[k]?`${n} begint morgen`:`${n} vertrekt`);refreshSheet()}})))})}
function staffYear(){const st=S.staff||{};const cp=S.cpi||1;let k=0;for(const id of Object.keys(st))if(st[id])k+=STAFF[id][2]*cp;if(!k)return;cash(-Math.round(k));if(period&&period.out){period.out['Personeel']=(period.out['Personeel']||0)+Math.round(k);period.exp+=Math.round(k)}
  if(st.kok)hea(2);if(st.huis||st.tuin)hap(1);if(st.chauffeur){hap(1);for(const c of S.cars)c.cond=Math.min(100,(c.cond??100)+5)}if(S.money<0&&chance(.5)){S.staff={};L('Je kunt je personeel niet meer betalen. Iedereen vertrekt.','bad')}}
function stichting(){const cp=S.cpi||1;const k=Math.round(250000*cp);modal({title:'Een eigen stichting',em:'🕊️',cat:'Rijk leven',text:`Met ${fmt(k)} richt je een stichting op. Elk jaar gaat er 5% van je vermogen naar het goede doel. Waarvoor?`,choices:opts(['Kinderen in armoede','Onderzoek naar kanker','Natuur en dieren','Onderwijs in ontwikkelingslanden','Kunst en cultuur'].map(d=>({t:d,on:()=>{closeModal();doAct('Stichting',()=>{cash(-k);S.found={d,y:year(),n:`Stichting ${S.p.last}`};kar(8);S.fame=clamp((S.fame||0)+3);hap(6);MS(`Richtte de Stichting ${S.p.last} op voor ${d.toLowerCase()}`,2);return `De Stichting ${S.p.last} is opgericht. Je eerste project: ${d.toLowerCase()}.`},true,'🕊️')}})))})}
function foundYear(){const F=S.found;if(!F||inJail())return;const g=Math.round(Math.max(0,netWorth())*.05);if(g<1000)return;cash(-g);kar(2);hap(1);if(chance(.25))L(`🕊️ De ${F.n} helpt dit jaar ${pick(['honderden gezinnen','een ziekenhuis in Ghana','een natuurgebied','drie scholen','jonge kunstenaars'])} (${fmt(g)}).`,'good')}
// lijfrente: elk jaar een vast deel van je salaris opzij, met rendement; bij je pensioen wordt het extra pensioen
function lijfMenu(){const cur=S.lijf?S.lijf.pct:0;modal({title:'Lijfrente',em:'🏦',cat:'Pensioen',text:`Zet elk jaar een deel van je salaris opzij voor later. Je spaarpot: ${fmt(S.lijf?S.lijf.v:0)}.`,choices:opts([0,5,10,15].map(p=>({t:p?`${p}% van je salaris`:'Niets (stoppen)',cls:cur===p?'go':'',on:()=>{closeModal();S.lijf=S.lijf||{v:0,pct:0};S.lijf.pct=p;toast(p?`Je legt ${p}% opzij`:'Je stopt met inleggen');refreshSheet()}})))})}
function lijfYear(){const Lf=S.lijf;if(!Lf)return;Lf.v=Math.round(Lf.v*(1.04+gauss()*.03));if(Lf.pct&&S.job&&ageY()<aowAge()){const k=Math.round(salary()*Lf.pct/100);cash(-k);Lf.v+=k}
  if(ageY()>=aowAge()&&Lf.v>0&&S.pension){const add=Math.round(Lf.v/18);S.pension+=add;L(`🏦 Je lijfrente gaat in: ${fmt(add)} per jaar extra pensioen.`,'good');Lf.v=0;Lf.pct=0}}
const _nw13=netWorth;netWorth=function(){return _nw13.apply(this,arguments)+((S&&S.lijf&&S.lijf.v)||0)};

// ---------- in Financiën ----------
sheetFinance=(f=>function(el){const r=f.apply(this,arguments);const a=ageY();if(a<18)return r;const s=sec(el,'Belasting, pensioen en meer');const cp=S.cpi||1;
  row(s,{ic:'📋',t:'Belastingaangifte',s:S.acts.ib?'Dit jaar al gedaan':'Netjes, slim of sjoemelen',dis:!!S.acts.ib||inJail(),dots:true,on:aangifte});
  row(s,{ic:'🏦',t:'Lijfrente',s:S.lijf&&S.lijf.pct?`${S.lijf.pct}% van je salaris · spaarpot ${fmt(S.lijf.v)}`:S.lijf&&S.lijf.v?`Spaarpot ${fmt(S.lijf.v)}`:'Extra pensioen opbouwen',dis:a>=aowAge(),dots:true,on:lijfMenu});
  const nw=netWorth();if(nw>=2e6*cp||S.staff&&Object.values(S.staff).some(Boolean))row(s,{ic:'🤵',t:'Personeel',s:Object.keys(S.staff||{}).filter(k=>S.staff[k]).map(k=>STAFF[k][1].toLowerCase()).join(', ')||'Kok, chauffeur, tuinman, huishoudster',dots:true,on:staffMenu});
  if(S.found)row(s,{ic:'🕊️',t:S.found.n,s:`Sinds ${S.found.y} · ${S.found.d.toLowerCase()}`});else if(nw>=1e6*cp)row(s,{ic:'🕊️',t:'Een eigen stichting oprichten',s:`${fmt(250000*cp)} · elk jaar 5% van je vermogen naar het goede doel`,dis:S.money<250000*cp,dots:true,on:stichting});
  return r})(sheetFinance);
// een stichting die je niet meer kunt betalen, stopt
F8.year.push(()=>{if(!S.alive)return;carYear();staffYear();foundYear();lijfYear();if(S.found&&S.money<0){L(`De ${S.found.n} stopt: er is geen geld meer.`,'bad');S.found=null}});

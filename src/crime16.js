/* ================= FASE 16: misdaad en gevangenis =================
   Keuze Thijmen: milder (meer kans om weg te komen, iets lagere straffen); moord en huurmoord erbij, zoals in BitLife:
   alleen als spelregel, zonder echte methodes. Doelwit: iedereen uit je leven vanaf 16 jaar (bij familie is de pakkans hoger).
   16.1 opsporing en verhoor; 16.2 rechtszaak met schikking; 16.3 hacken, afpersing, heling; 16.4 een nieuwe start; 16.5 slachtoffer: aangifte doen */

// ---------- milder ----------
const CRIMEMILD=.8;
jail=(f=>function(m,w){if(!/moord/i.test(w||''))m=Math.max(1,Math.round(m*.85));return f.call(this,m,w)})(jail);

// ---------- 16.3 meer misdrijven ----------
CRIMES.push({id:'hacken',t:'Hacken',s:'Inbreken in computersystemen (Techniek 30+)',a:16,p:.32,gain:[2000,90000],jail:[10,40],heat:14,c:()=>S.sk.tech>=30},
  {id:'afpersing',t:'Afpersing',s:'Iemand onder druk zetten',a:18,p:.42,gain:[3000,60000],jail:[12,48],heat:20},
  {id:'heling',t:'Heling',s:'Gestolen spullen doorverkopen',a:16,p:.3,gain:[500,15000],jail:[3,18],heat:9});
Object.assign(CRIMEPLAN,{hacken:[['💻','Een webwinkel hacken',1,1],['🏦','Een bank proberen te hacken',1.5,3],['🎣','Mensen nepmails sturen',.8,.7]],
  afpersing:[['📸','Met gênante foto\'s dreigen',1,1],['🏪','Een winkeleigenaar onder druk zetten',1.2,1.4],['🕴️','Een rijke zakenman benaderen',1.5,2.8]],
  heling:[['📱','Telefoons doorverkopen',1,1],['🚲','Fietsen op een markt',.8,.6],['💎','Sieraden aan een opkoper',1.3,2.2]]});
Object.assign(CRMG,{hacken:'cijfers',heling:'straat'});

// na een keuze haalt processQ het huidige item weg: het volgende item moet dus op plek 2
const qNext=it=>Q.splice(1,0,it);
// ---------- 16.1 verhoor (voor elke rechtszaak) ----------
E('c16_verhoor',{sys:1,t:'Het verhoor',x:c=>`Je zit in een kale verhoorkamer. Twee rechercheurs willen weten wat er gebeurd is: ${c.w.toLowerCase()}.`,ch:[
 ['🤐 Zwijgen',c=>{if(chance(.22)){S.crim.heat=clamp((S.crim.heat||0)-10);return 'Je zegt geen woord. Na 48 uur moeten ze je laten gaan: te weinig bewijs.'}qNext({id:'s_trial',c:Object.assign({},c,{vh:1})});return 'Je zegt geen woord. Het OM zet de zaak toch door.'}],
 ['🗣️ Bekennen',c=>{kar(2);qNext({id:'s_trial',c:Object.assign({},c,{vh:1,m:Math.max(1,Math.round(c.m*.7))})});return 'Je vertelt alles. De rechercheurs knikken. Dat scheelt straks in je straf.'}],
 ['🤥 Een verhaal verzinnen',c=>{if(chance(.4)){S.crim.heat=clamp((S.crim.heat||0)+5);return 'Je verhaal klopt precies. Ze moeten je laten gaan.'}qNext({id:'s_trial',c:Object.assign({},c,{vh:1,m:Math.round(c.m*1.25)})});return 'Je verhaal rammelt aan alle kanten. Dat maakt het erger.'}],
 ['🧑‍⚖️ Eerst je advocaat bellen',c=>{const k=Math.round(1500*(S.cpi||1));cash(-Math.min(k,Math.max(0,S.money)));if(chance(.3))return 'Je advocaat vindt een vormfout. Je staat binnen een uur weer buiten.';qNext({id:'s_trial',c:Object.assign({},c,{vh:1,m:Math.max(1,Math.round(c.m*.9))})});return 'Je advocaat zit naast je. De zaak gaat door, maar je staat sterker.'}]]});
EVMETA.c16_verhoor=['Misdaad','🕵️'];
processQ=(f=>function(){if(Q.length&&Q[0].id==='s_trial'&&!(Q[0].c&&Q[0].c.vh)&&!inJail()){const q=Q.shift();qNext({id:'c16_verhoor',c:Object.assign({},q.c||{})})}return f.apply(this,arguments)})(processQ);

// ---------- 16.2 rechtszaak: schikking, jury ----------
if(EV.s_trial){const x0=EV.s_trial.x;EV.s_trial.x=c=>(typeof x0==='function'?x0(c):x0)+(S.p.country==='US'?' Een jury van twaalf burgers beslist.':'');
  EV.s_trial.ch.push(['🤝 Een schikking voorstellen',c=>{const k=Math.round((2500+c.m*900)*(S.cpi||1));cash(-Math.min(k,Math.max(0,S.money)));if(chance(.55)){S.crim.rec.push({w:c.w+' (schikking)',a:ageY()});hap(-2);return `Het OM gaat akkoord met een schikking van ${fmt(k)}. Geen gevangenis, wel een aantekening.`}jail(c.m,c.w);return `Het OM wil niet schikken. Je krijgt ${c.m} maanden.`},c=>c.m<=36&&!/moord/i.test(c.w)]);}

// ---------- moord en huurmoord (spelregel, geen details) ----------
const killable=()=>living().filter(p=>isHuman(p)&&!p.gone&&pAge(p)>=16&&!(typeof abroad==='function'&&abroad(p))&&!['influencer','celgenoot'].includes(p.role));
const FAMR=['moeder','vader','partner','kind','broer','zus','opa','oma','kleinkind','schoonzoon','schoondochter'];
function murderMenu(){if(ageY()<18||inJail())return;const ps=killable().sort((a,b)=>a.rel-b.rel).slice(0,12);if(!ps.length){toast('Er is niemand');return}
  modal({title:'Iemand uit de weg ruimen',em:'🔪',cat:'Misdaad',text:'Wie? Dit kun je niet terugdraaien.',choices:opts(ps.map(p=>({t:p.first+' '+(p.last||''),ic:faceOf(p),s:`${roleLabel(p)} · relatie ${Math.round(p.rel)}%`,on:()=>{closeModal();murderHow(p)}})))})}
function murderHow(p){const k=Math.round(ri(20,60)*1000*(S.cpi||1));
  modal({title:'Hoe?',em:'🔪',cat:p.first,person:p,text:'Je denkt na over een plan.',choices:opts([
    {t:'🧩 Een plan waarbij het op een ongeluk lijkt',on:()=>{closeModal();murderGo(p,'plan',0)}},
    {t:'😤 Het zelf doen, in een opwelling',on:()=>{closeModal();murderGo(p,'zelf',0)}},
    {t:`🕶️ Een huurmoordenaar inhuren (${fmt(k)})`,dis:S.money<k,on:()=>{closeModal();murderGo(p,'huur',k)}}])})}
function murderGo(p,how,k){doAct(how==='huur'?'Huurmoord':'Moord',()=>{if(k)cash(-k);const fam=FAMR.includes(p.role);kar(-40);
  const ok=chance(how==='huur'?.7:how==='plan'?.6:.5);
  if(!ok){p.role=p.role==='partner'?'ex':p.role;if(p.role==='ex'){p.st='';p.live=0}p.rel=0;if(['vriend','ex'].includes(p.role))p.role='vijand';hap(-6);
    if(chance(.55)){Q.push({id:'s_trial',c:{w:'poging tot moord',m:ri(60,120)}});return `Het mislukt. ${p.first} overleeft en gaat naar de politie.`}return `Het mislukt. ${p.first} overleeft, maar weet niet dat jij erachter zat. Voorlopig.`}
  p.alive=false;p.died=ageY();p.murd=1;hap(-12);S.crim.heat=clamp((S.crim.heat||0)+(how==='huur'?30:55));S.flags.moord=(S.flags.moord||0)+1;
  S.crim.moord=S.crim.moord||[];S.crim.moord.push({w:'moord op '+p.first,a:ageY(),fam:fam?1:0,h:how});safe(()=>onDeath(p));
  return how==='huur'?`De klus wordt geklaard. Niemand kan jou ermee in verband brengen, hoop je.`:`Het is gebeurd. ${p.first} leeft niet meer. Je slaapt slecht.`},true,'🕯️')}
// de recherche onderzoekt een moord: bij familie of een opwelling sneller
function murderYear(){const M=S.crim&&S.crim.moord;if(!M||!M.length||inJail())return;for(const o of M.slice()){const yrs=ageY()-o.a;if(yrs>30){M.splice(M.indexOf(o),1);continue}
  const p=(o.fam?.22:.08)+(o.h==='zelf'?.12:o.h==='huur'?-.03:0)+(S.crim.heat||0)/500-yrs*.006;if(chance(Math.max(.02,p))){M.splice(M.indexOf(o),1);Q.push({id:'c16_moordzaak',c:{w:o.w,m:(S.flags.moord||1)>=2?600:ri(144,264)}});break}}}
E('c16_moordzaak',{sys:1,t:'De recherche',x:c=>`Twee rechercheurs staan voor je deur. Ze hebben nieuw bewijs in de zaak: ${c.w}.`,ch:[
 ['🚔 Meegaan',c=>{qNext({id:'s_trial',c:{w:c.w,m:c.m,vh:0}});return 'Je gaat mee naar het bureau.'}],
 ['🏃 Vluchten',c=>{if(chance(.25)){S.crim.wanted=true;S.crim.heat=100;return 'Je ontsnapt via de tuin. Je bent nu voortvluchtig.'}qNext({id:'s_trial',c:{w:c.w,m:Math.round(c.m*1.2),vh:0}});return 'Je komt niet ver.'}]]});
EVMETA.c16_moordzaak=['Misdaad','🕵️'];

// ---------- 16.4 een nieuwe start ----------
function newStart(){doAct('Een nieuwe start',()=>{S.flags.ns16=ageY();S.crim.heat=0;kar(10);hap(4);if(S.crim.org&&S.crim.org.type==='bende')S.crim.org=null;
  return pick(['Je verbreekt het contact met je oude vrienden uit het milieu en zoekt hulp bij de reclassering.','Je schrijft je in voor een opleiding en begint met een schone lei.','Je vertelt je familie eerlijk over je verleden. Het lucht op.'])},true,'🌱')}
// ---------- 16.5 slachtoffer ----------
E('c16_slachtoffer',{a:[16,90],w:.35,cd:12,t:'Bestolen',x:()=>pick(['Er is ingebroken in je schuur. Je fiets en gereedschap zijn weg.','Iemand heeft met jouw gegevens online spullen gekocht.','Je portemonnee is gerold in de trein.']),ch:[
 ['📝 Aangifte doen',()=>{if(chance(.35)){const k=Math.round(ri(2,8)*100*(S.cpi||1));cash(k);hap(3);return `De dader wordt gepakt. Je krijgt ${fmt(k)} schadevergoeding.`}return 'Je doet aangifte. Je hoort er nooit meer iets van.'}],
 ['🔎 Zelf speuren',()=>{if(chance(.2)){hap(4);return 'Je vindt je spullen terug op een tweedehandssite. De politie haalt ze op.'}hap(-1);return 'Je speurt dagenlang. Niks.'}],
 ['🤷 Het laten gaan',()=>{hap(-2);return 'Je baalt, maar gaat door met je leven.'}]]});
EVMETA.c16_slachtoffer=['Misdaad','🧾'];

// ---------- in het misdaadscherm ----------
sheetCrime=(f=>function(el){const r=f.apply(this,arguments);const a=ageY();const s=sec(el,'Zwaar');
  row(s,{ic:'🔪',t:'Iemand uit de weg ruimen',s:a<18?'Vanaf 18 jaar':'Moord of huurmoord · met zware gevolgen als je gepakt wordt',dis:a<18||inJail(),dots:true,on:murderMenu});
  if((S.crim.rec.length||S.flags.moord)&&!inJail())row(s,{ic:'🌱',t:'Een nieuwe start maken',s:S.flags.ns16&&ageY()-S.flags.ns16<5?'Je bent net opnieuw begonnen':'Stoppen met het criminele leven',dis:!!(S.flags.ns16&&ageY()-S.flags.ns16<5),dots:true,on:newStart});return r})(sheetCrime);
F8.year.push(()=>{if(!S.alive)return;murderYear()});
ACH.push(['nieuwestart','Een nieuwe start','Stop met het criminele leven']);F8.ach.push(add=>{if(S.flags.ns16)add('nieuwestart')});

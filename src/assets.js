/* ================= BEZIT (zoals BitLife) ================= */
// ---- extra winkels ----
Object.assign(CATALOG.boten.brands,{'Zodiac':[['Rubberboot met buitenboordmotor',8000]],'Bayliner':[['VR5 speedboot',45000]],'Hallberg-Rassy':[['Zeiljacht 40',650000,-.04]],'Sunseeker':[['Predator 60',2500000]],'Azimut':[['Grande 27M',9000000]],'Benetti':[['Oasis 40M',22000000]],'Lürssen':[['Gigajacht van 120 meter',250000000]]});
CATALOG.vliegtuigen.n='Vliegtuigen';
Object.assign(CATALOG.vliegtuigen.brands,{'Cirrus':[['Vision SF50 jet',3200000]],'Embraer':[['Phenom 300E',10500000]],'Bombardier':[['Global 7500',75000000]],'Boeing':[['BBJ 737 (vliegende villa)',100000000]]});
CATALOG.vliegtuigen.brands['Gulfstream'].push(['G700',78000000]);
Object.assign(CATALOG,{
motoren:{n:'Motoren',em:'🏍️',min:16,ap:-.12,brands:{'Vespa':[['Primavera scooter',5200]],'Honda':[['CB500F',7200],['Africa Twin',17000]],'Yamaha':[['MT-07',8300],['R1',22000]],'Kawasaki':[['Ninja 650',9100],['Ninja H2',33000]],'BMW':[['R 1250 GS',22000]],'Ducati':[['Monster',13500],['Panigale V4',31000]],'Harley-Davidson':[['Fat Boy',28000,-.06]],'Klassiekers':[['Triumph Bonneville (1969)',14000,.05]]},vars:b=>b==='Klassiekers'?[['Rijdbaar',1],['Concourstaat',1.6]]:[['Tweedehands',.6],['Nieuw',1]]},
helikopters:{n:'Helikopters',em:'🚁',lux:1,min:18,ap:-.07,up:.08,brands:{'Robinson':[['R22',320000],['R66',1100000]],'Bell':[['505 Jet Ranger X',1400000]],'Airbus':[['H125',3500000],['H145',9500000]],'Leonardo':[['AW169 VIP',14000000]]},vars:()=>[['Tweedehands',.6],['Nieuw',1]]},
mode:{n:'Mode',em:'👗',min:12,ap:-.45,vol:.03,brands:{'Nike':[['Air Max sneakers',160],['Tech Fleece pak',220]],'The North Face':[['Nuptse donsjas',350]],'Moncler':[['Maya donsjas',1700]],'Prada':[['Leren loafers',950]],'Balenciaga':[['Hoodie',950],['Triple S sneakers',1100]],'Gucci':[['Maatpak',3600]],'Dior':[['Avondjurk',7500]]},vars:()=>[['Zwart',1],['Wit',1],['Limited edition',1.8]]},
instrumenten:{n:'Instrumenten',em:'🎸',min:6,ap:-.08,vol:.03,sk:'muziek',brands:{'Yamaha':[['Keyboard',350],['Akoestische gitaar',300]],'Fender':[['Stratocaster',1900]],'Gibson':[['Les Paul',3200,.02]],'Pearl':[['Drumstel',1600]],'Steinway & Sons':[['Vleugel Model D',180000,.02]],'Veilinghuis':[['Stradivarius-viool (1715)',12000000,.04]]},vars:()=>[['Nieuw',1]]},
fietsen:{n:'Fietsen',em:'🚲',min:6,ap:-.15,brands:{'Gazelle':[['Stadsfiets',900]],'Cortina':[['Transportfiets',1100]],'Babboe':[['Bakfiets',2900]],'VanMoof':[['E-bike',3000]],'Canyon':[['Racefiets',4200]],'Specialized':[['Mountainbike',5200]]},vars:()=>[['Tweedehands',.55],['Nieuw',1]]},
campers:{n:'Campers en caravans',em:'🚐',min:18,ap:-.08,up:.02,brands:{'Kip':[['Caravan',25000]],'Volkswagen':[['California',82000]],'Hymer':[['Integraal camper',140000]],'Airstream':[['Classic caravan',160000,-.02]]},vars:()=>[['Tweedehands',.6],['Nieuw',1]]},
verzamel:{n:'Verzamelobjecten',em:'🧸',min:8,ap:.03,vol:.18,brands:{'Pokémon':[['Booster box',160,.06],['Eerste-editie Charizard',250000,.07]],'LEGO':[['Millennium Falcon UCS',850,.07]],'Sneakers':[['Air Jordan 1 (1985)',25000,.05]],'Strips':[['Kuifje eerste druk',8000,.04]],'Voetbal':[['Gesigneerd WK-shirt',3000,.03]],'Wijn':[['Kist Bordeaux grand cru',6000,.05],['Fles Romanée-Conti',25000,.07]],'Postzegels':[['Zeldzame postzegel',40000,.04]],'Speelgoed':[['Originele Gameboy in doos',1200,.06]]},vars:()=>[['Origineel',1]]},
goud:{n:'Goud en zilver',em:'🥇',min:16,ap:.045,vol:.12,brands:{'Zilver':[['Zilverbaar 1 kilo',950,.03]],'Goud':[['Gouden munt (1 ounce)',2300],['Goudbaar 100 gram',7600],['Goudbaar 1 kilo',76000]]},vars:()=>[['Origineel',1]]}});
Object.assign(CATALOG.kunst.brands,{'Galerie om de hoek':[['Schilderij van een lokale kunstenaar',800],['Fotoprint in beperkte oplage',2500]],'Veilinghuis':[['Schilderij van een gerenommeerde schilder',60000],['Bronzen beeld',120000],['Ets van Rembrandt',350000],['Werk van een moderne meester',2000000],['Impressionistisch landschap',15000000,.06]]});
const SHOPS=[['autos',"Auto's"],['motoren','Motoren'],['boten','Boten en jachten'],['vliegtuigen','Vliegtuigen en jets'],['helikopters','Helikopters'],['campers','Campers en caravans'],['fietsen','Fietsen'],['horloges','Horloges'],['sieraden','Sieraden'],['tassen','Tassen'],['mode','Mode'],['elektronica','Elektronica'],['instrumenten','Instrumenten'],['kunst','Kunst'],['verzamel','Verzamelobjecten'],['goud','Goud en zilver']];
const VEH=['autos','motoren'];
const catOf=it=>it.kind||(it.ico&&it.ico[0])||(it.art?'kunst':'overig');
const vIcon=x=>x.kind==='motoren'?'🏍️':S.cars.includes(x)?carIcon(x):itemIcon(x);
const owned=()=>[...S.cars,...(S.items||[])];
const ownById=id=>owned().find(x=>x.id===id);
// ---- het tabblad ----
function sheetAssets(el){const a=ageY();
  card(el,kv([['Saldo',fmt(S.money)],['Netto vermogen',fmt(netWorth())]]));
  const own=sec(el,'Je bezit');let n=0;
  for(const p of S.props){n++;row(own,{ic:hIcon(p.name),t:p.name,s:`${S.home.pid===p.id?'Je woont hier · ':''}waarde ${fmt(p.value)}`,on:()=>openSheet(p.name,el=>sheetProp(el,p),true)})}
  for(const x of owned()){n++;const c=x.cond??100;row(own,{ic:vIcon(x),t:x.name,s:`Waarde ${fmt(x.value)}${x.ins?' · verzekerd':''}${x.classic?' · klassieker':''}`,r:`<span class="minibar" style="width:56px;display:block"><i style="width:${c}%;background:${statCol(c)}"></i></span>`,on:()=>openSheet(x.name,el=>sheetOwned(el,x),true)})}
  if(!n)empty(own,a<12?'Je hebt nog niets. Vanaf 12 jaar kun je winkelen.':'Je hebt nog niets gekocht.');
  const g=sec(el,'Geld');
  row(g,{ic:'💰',t:'Financiën',s:a<18?'Je saldo en zakgeld':'Sparen, beleggen, automatisch beleggen, startups en leningen',on:()=>openSheet('Financiën',sheetFinance,true)});
  if(S.biz.length)row(g,{ic:'🏢',t:'Bedrijven',s:`${S.biz.length} ${S.biz.length>1?'bedrijven':'bedrijf'}`,on:()=>openSheet('Ondernemen',sheetBizList,true)});
  row(g,{ic:'👥',t:'Social media',s:a<13?'Vanaf 13 jaar':`${Math.round(S.foll).toLocaleString('nl-NL')} volgers`,dis:a<13,on:()=>openSheet('Social media',sheetSocial,true)});
  if(inJail()){empty(el,'Winkelen kan pas weer als je vrij bent.');return}
  const sh=sec(el,'Winkelen');
  row(sh,{ic:'🏡',t:'Huizen',s:a<18?'Vanaf 18 jaar':'Kopen, huren, verhuren en verbouwen',dis:a<18,on:()=>openSheet('Panden',sheetHousing,true)});
  for(const [k,t] of SHOPS){const c=CATALOG[k];if(!c)continue;const min=c.min||0;row(sh,{ic:catIcon(k),t,s:a<min?`Vanaf ${min} jaar`:`${Object.keys(c.brands).length} merken · vanaf ${fmt(Math.min(...Object.entries(c.brands).flatMap(([b,ms])=>ms.map(m=>m[1]*Math.min(...c.vars(b).map(v=>v[1]))))))}`,dis:a<min,on:()=>openSheet(t,el=>sheetBrands(el,k),true)})}}
// ---- kopen ----
function buyCat(k,b,m,v,p,col,adj){if(inJail()){toast('Winkelen kan niet vanuit de gevangenis');return}const c=CATALOG[k];const name=['kunst','verzamel','goud'].includes(k)?m[0]:`${b} ${m[0]}`;const used=v==='Tweedehands';
  doAct('Gekocht!',()=>{cash(-p);
    if(VEH.includes(k)){const cls=b==='Klassiekers';S.cars.push({id:uid(),kind:k,name:col?`${name} (${col.toLowerCase()})`:name,col,buy:p,value:Math.round(p*(used?.95:.82)),cond:used?ri(55,80):100,old:cls,classic:cls?1:0,yr:cls?+((m[0].match(/\((\d{4})\)/)||[])[1]||1970):year()-(used?ri(2,8):0),ap:m[2]??(cls?.04:(c.ap??-.14)),tune:[]});hap(p>100000?10:6);if(p>=150000)MS(`Kocht een ${name}`,1);
      const lic=k==='motoren'?S.flags.motor:S.lic;return `Je hebt een ${adj?adj+' ':''}${name} (${v.toLowerCase()}) gekocht.${lic?'':` Je hebt nog geen ${k==='motoren'?'motorrijbewijs':'rijbewijs'}, dus hij staat vooral mooi te zijn.`}`}
    S.items.push({id:uid(),em:c.em,ico:[k,b,m[0],v],name,variant:v,buy:p,value:Math.round(p*(c.ap>0?.92:.82)),cond:used?ri(60,85):100,ap:m[2]??c.ap??-.1,vol:c.vol??.03,up:c.up||0,yr:year()});
    hap(p>100000?10:p>5000?6:3);if(c.sk&&!S.flags['sk_'+m[0]]){S.flags['sk_'+m[0]]=1;sk(c.sk,3)}if(k==='elektronica'&&m[0].includes('Mac'))sk('tech',3);if(p>=1e6)MS(`Kocht een ${name}`,2);
    return `Gekocht: ${name}${v!=='Origineel'&&v!=='Nieuw'?` (${v.toLowerCase()})`:''}.${c.up?` Onderhoud kost ongeveer ${fmt(p*c.up)} per jaar.`:''}`},true,VEH.includes(k)?(k==='motoren'?'🏍️':icCar(name,col)):icShop(k,b,m[0],v))}
// ---- één bezitting: gebruiken, onderhoud, verzekeren, tunen, verkopen ----
const INSR={autos:.035,motoren:.05,boten:.02,vliegtuigen:.015,helikopters:.02,campers:.02,horloges:.015,sieraden:.015,tassen:.015,kunst:.01,verzamel:.01,goud:.005,instrumenten:.015,elektronica:.06,fietsen:.06,mode:.04};
const insPrem=x=>Math.round(x.value*(INSR[catOf(x)]||.02)*(x.insUp||1));
const AUCT=['kunst','verzamel','horloges','sieraden','tassen','goud','instrumenten'];
function sheetOwned(el,x){if(!ownById(x.id)){empty(el,'Dit heb je niet meer.');return}const k=catOf(x),veh=S.cars.includes(x),cond=x.cond??100,age=x.yr!=null?year()-x.yr:null;
  card(el,`<h3>${vIcon(x)} ${he(x.name)}</h3>${kv([['Gekocht voor',boughtFor(x)],['Waarde nu',fmt(x.value)],...plRow(x.value,x.buy),...(age!=null?[[veh?'Bouwjaar':'In je bezit sinds',veh?String(x.yr):String(x.yr)]]:[]),['Verzekering',x.ins?`Ja · ${fmt(insPrem(x))} per jaar`:'Niet verzekerd'],...(x.tune&&x.tune.length?[['Aangepast',x.tune.map(t=>TUNE.find(z=>z[0]===t)[1].toLowerCase()).join(', ')]]:[]),...(x.classic?[['Status','Klassieker: wordt meer waard']]:[])])}<div class="stat"><span>Conditie</span><span></span><span class="v">${Math.round(cond)}%</span>${bar(cond)}</div>`);
  const s=sec(el,'Acties');const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,dots:o.dots,on:()=>doAct(t,fn,true,ic)});
  if(veh){const lic=k==='motoren'?S.flags.motor:S.lic;A(k==='motoren'?'🏍️':'🛣️','Een ritje maken',()=>{const m=use('rit');hap(Math.round(3*m));if(chance(cond<40?.12:.04)){x.cond=Math.max(0,cond-ri(10,30));hea(-ri(0,5));return 'Je rijdt een paaltje aan. Schade aan je '+x.name+'.'}x.cond=Math.max(0,cond-1);return pick(['Je rijdt met de ramen open langs de kust.','Een rondje door de stad. Mensen kijken je na.','Je neemt de mooie route naar huis.'])},{dis:!lic||cond<=0,s:!lic?`Je hebt geen ${k==='motoren'?'motorrijbewijs':'rijbewijs'}`:cond<=0?'Total loss':''})}
  else if(['boten'].includes(k))A('🌊','Een dagje varen',()=>{const m=use('vaar');hap(Math.round(5*m));for(const p of living().filter(p=>p.role!=='ex'&&p.role!=='vijand').slice(0,3))p.rel=clamp(p.rel+Math.round(3*m));return 'Je neemt vrienden en familie mee het water op.'});
  else if(['vliegtuigen','helikopters'].includes(k))A(k==='helikopters'?'🚁':'✈️','Een vlucht maken',()=>{const m=use('vlucht');hap(Math.round(6*m));return pick(['Je piloot vliegt je naar Ibiza voor een lunch.','Je vliegt over de stad bij zonsondergang.','Je neemt je vrienden mee naar Parijs. Gewoon omdat het kan.'])});
  else if(['horloges','sieraden','tassen','mode'].includes(k))A('✨','Dragen',()=>{const m=use('draag'+x.id);loo(Math.round(1*m));hap(Math.round(2*m));x.cond=Math.max(0,cond-1);return 'Je wordt er overal op aangesproken.'});
  else if(k==='instrumenten')A('🎶','Spelen',()=>{const m=use('speel');sk('muziek',Math.round(2*m));hap(Math.round(2*m));return 'Je oefent een uur. Het klinkt steeds beter.'});
  else if(k==='kunst')A('🏛️','Uitlenen aan een museum',()=>{x.loan=1;kar(3);S.fame=clamp(S.fame+1);hap(2);return 'Het museum hangt je werk op een ereplek, met jouw naam op het bordje.'},{dis:!!x.loan,s:x.loan?'Hangt al in een museum':''});
  else if(['fietsen'].includes(k))A('🚴','Een rondje fietsen',()=>{const m=use('fiets');hea(Math.round(2*m));hap(Math.round(1*m));return 'Lekker even buiten.'});
  else if(k==='elektronica')A('🎮','Gebruiken',()=>{const m=use('elek');hap(Math.round(2*m));return 'Je vermaakt je prima.'});
  const rep=Math.round((100-cond)*x.value*.004+(veh?80:20));
  if(!['goud','verzamel'].includes(k))A('🔧',veh?'Naar de garage':'Laten onderhouden',()=>{cash(-rep);x.cond=100;return `Je ${x.name} is weer als nieuw.`},{dis:cond>=98||S.money<rep,s:cond>=98?'In topconditie':fmt(rep)});
  row(s,{ic:'🛡️',t:x.ins?'Verzekering opzeggen':'Verzekeren',s:x.ins?`Je betaalt ${fmt(insPrem(x))} per jaar`:`${fmt(insPrem(x))} per jaar · vergoedt diefstal en schade`,dots:true,on:()=>doAct(x.ins?'Verzekering':'Verzekerd',()=>{x.ins=x.ins?0:1;return x.ins?`Je ${x.name} is verzekerd.`:'Je zegt de verzekering op.'},true,'🛡️')});
  if(veh&&k==='autos'&&!x.classic)row(s,{ic:'🏁',t:'Tunen',s:'Motor, uitlaat, velgen, wrap, bodykit, geluid',dots:true,on:()=>tuneMenu(x)});
  if(veh&&k==='motoren')row(s,{ic:'🏁',t:'Tunen',s:'Motor opvoeren, sportuitlaat, wrap',dots:true,on:()=>tuneMenu(x)});
  row(s,{ic:'🏷️',t:'Verkopen',s:`Ongeveer ${fmt(salePrice(x,'part'))}`,dots:true,on:()=>sellMenu(x)});}
const TUNE=[['motor','Motor opvoeren','🔧',.08,6000,.05,'Je hebt nu een stuk meer pk. Het optrekken is bizar.'],['uitlaat','Sportuitlaat','💨',.02,2500,-.02,'De hele straat hoort je aankomen.'],['velgen','Lichtmetalen velgen','🛞',.025,3000,.01,'Hij staat er een stuk strakker op.'],['wrap','Wrap in een nieuwe kleur','🎨',.025,3500,0,''],['bodykit','Verlagen en bodykit','🏁',.05,6000,-.05,'Hij ligt nu bijna op de grond.'],['audio','Geluidsinstallatie','🔊',.015,2000,-.01,'De bas laat je spiegels trillen.']];
function tuneMenu(x){const moto=x.kind==='motoren';const list=TUNE.filter(t=>!moto||['motor','uitlaat','wrap'].includes(t[0]));
  modal({title:'Tunen',em:'🏁',cat:x.name,text:'Wat laat je aanpassen? Sommige aanpassingen maken je voertuig meer waard, andere juist minder.',choices:opts(list.map(([id,t,ic,f,min,dv,txt])=>{const k=Math.round(Math.max(min*(S.cpi||1),x.value*f)/50)*50;const done=(x.tune||[]).includes(id)&&id!=='wrap';
    return {t,ic,s:done?'Al gedaan':`${fmt(k)} · waarde ${dv>0?'+':dv<0?'−':'±'}${Math.abs(Math.round(dv*100))}%`,dis:done||S.money<k,on:()=>{closeModal();if(id==='wrap'){modal({title:'Nieuwe kleur',em:'🎨',cat:x.name,choices:opts(['Matzwart','Satijn wit','Racegroen','Babyblauw','Chroom','Felroze','Camouflage'].map(c=>({t:c,on:()=>{closeModal();doAct('Tunen',()=>{cash(-k);x.name=x.name.replace(/ \([^)]*\)$/,'')+` (${c.toLowerCase()})`;x.col=c;(x.tune=x.tune||[]).includes('wrap')||x.tune.push('wrap');hap(2);return `Je ${x.name.replace(/ \(.*/,'')} is nu ${c.toLowerCase()}.`},true,'🎨')}})))});return}
      doAct('Tunen',()=>{cash(-k);(x.tune=x.tune||[]).push(id);x.value=Math.round(x.value*(1+dv));hap(3);return txt},true,ic)}}}))})}
function salePrice(x,how){const cond=x.cond??100,k=catOf(x);const cf=['goud','verzamel','kunst'].includes(k)?1:.5+cond/200;return Math.round(x.value*cf*(how==='dealer'?.75:how==='veiling'?1:.95))}
function sellMenu(x){const k=catOf(x);const veh=S.cars.includes(x);
  const done=(sale,how)=>doAct('Verkocht',()=>{cash(sale);if(veh)S.cars=S.cars.filter(y=>y!==x);else S.items=S.items.filter(y=>y!==x);backSheet();return `Je ${x.name} is ${how} verkocht voor ${fmt(sale)}.${soldTxt(sale,x.buy)}`},true,'🏷️');
  modal({title:'Verkopen',em:'🏷️',cat:x.name,text:`Waarde: ${fmt(x.value)}. Hoe wil je het verkopen?`,choices:opts([
    {t:'Aan een handelaar',s:`Direct ${fmt(salePrice(x,'dealer'))}`,on:()=>{closeModal();done(salePrice(x,'dealer'),'aan een handelaar')}},
    {t:'Zelf verkopen',s:`Rond de ${fmt(salePrice(x,'part'))} · hangt af van de koper`,on:()=>{closeModal();done(Math.round(salePrice(x,'part')*(.88+R()*.2)),'aan een particulier')}},
    ...(AUCT.includes(k)||x.classic?[{t:'Op een veiling',s:'Gokje: van veel minder tot veel meer',on:()=>{closeModal();const f=Math.max(.45,Math.min(2.2,.6+R()*R()*1.6+R()*.3));done(Math.round(salePrice(x,'veiling')*f),f>=1.2?'op een veiling na een biedoorlog':f<.8?'op een veiling, voor een tegenvallend bedrag,':'op een veiling')}}]:[])])})}
// ---- elk jaar: klassiekers, diefstal, ongelukken ----
const CLASSICB=['Porsche','Ferrari','Lamborghini','Mercedes-Benz','BMW','Harley-Davidson','Ducati','Land Cruiser'];
function ownYear(){const a=ageY();
  for(const c of S.cars){if(!c.classic&&c.yr!=null&&year()-c.yr>=25&&(c.cond??100)>=50&&CLASSICB.some(b=>c.name.includes(b))){c.classic=1;c.ap=.04+R()*.03;L(`Je ${c.name} is nu ${year()-c.yr} jaar oud en officieel een klassieker. Hij wordt weer meer waard!`,'good')}
    if(c.classic&&(c.tune||[]).length&&!c.tunePen){c.tunePen=1;c.value=Math.round(c.value*.9)}}
  if(inJail())return;
  // ongeluk
  const risk=S.cars.filter(c=>(c.cond??100)>0).map(c=>[c,(c.kind==='motoren'?.07:.035)+((c.cond??100)<40?.03:0)+((c.tune||[]).includes('motor')?.02:0)]).concat((S.items||[]).filter(i=>['boten','vliegtuigen','helikopters'].includes(catOf(i))).map(i=>[i,.012]));
  for(const [x,p] of risk.sort(()=>R()-.5))if(chance(p)){const dmg=ri(20,85);x.cond=Math.max(0,(x.cond??100)-dmg);const hurt=ri(0,dmg>60?25:10);hea(-hurt);Q.push({id:'a_ongeluk',c:{id:x.id,dmg,hurt,other:S.cars.includes(x)&&chance(.5)}});break}
  // diefstal
  const tr={autos:.015,motoren:.03,horloges:.025,sieraden:.02,tassen:.02,elektronica:.03,fietsen:.06,kunst:.006,boten:.01,mode:.01,instrumenten:.01,goud:.01,verzamel:.008};
  const f=(S.fame>=50?1.5:1)*(S.flags.bg?.5:1);
  for(const x of owned().sort(()=>R()-.5)){const p=(tr[catOf(x)]||0)*f;if(x.value>=150&&chance(p)){Q.push({id:'a_diefstal',c:{id:x.id}});break}}}
const insPay=x=>Math.round(x.value*.9);
function lose(x){if(S.cars.includes(x))S.cars=S.cars.filter(y=>y!==x);else S.items=S.items.filter(y=>y!==x)}
E('a_ongeluk',{sys:1,need:c=>!!ownById(c.id),t:'Ongeluk!',x:c=>{const x=ownById(c.id),k=catOf(x);const t=k==='boten'?`Je ${x.name} loopt op een zandbank.`:['vliegtuigen','helikopters'].includes(k)?`Je ${x.name} maakt een harde noodlanding.`:c.other?`Je botst met je ${x.name} op een andere auto.`:`Je verliest de macht over je ${x.name} en raakt een vangrail.`;return `${t}${c.hurt>=10?' Je raakt zelf ook gewond.':''}${(x.cond??0)<=0?' Total loss.':` De schade is flink (conditie nog ${x.cond}%).`}`},ch:[
 ['📋 De verzekering inschakelen',c=>{const x=ownById(c.id);x.insUp=(x.insUp||1)*1.2;if((x.cond??0)<=0){const p=insPay(x);cash(p);lose(x);return `De verzekering keert ${fmt(p)} uit. Je premie gaat wel omhoog.`}x.cond=95;return 'De verzekering betaalt de reparatie. Je premie gaat wel omhoog.'},c=>!!ownById(c.id)?.ins],
 ['🔧 Zelf laten repareren',c=>{const x=ownById(c.id);const k=Math.round(x.value*c.dmg/100*.5+300);cash(-k);x.cond=95;return `De reparatie kost ${fmt(k)}.`},c=>(ownById(c.id)?.cond??0)>0],
 ['🗑️ Als schadegeval verkopen',c=>{const x=ownById(c.id);const k=Math.round(x.value*.2);cash(k);lose(x);return `Een schadebedrijf geeft je ${fmt(k)} voor wat er nog van over is.`}],
 ['🏃 Doorrijden',c=>{kar(-8);if(chance(.35)){const k=Math.round(4000*(S.cpi||1));cash(-k);S.lic=false;return `Een getuige heeft je kenteken genoteerd. Je krijgt een boete van ${fmt(k)} en je rijbewijs wordt ingenomen.`}return 'Je rijdt snel weg. Niemand heeft je gezien. Je voelt je er niet goed over.'},c=>c.other]]});
E('a_diefstal',{sys:1,need:c=>!!ownById(c.id),t:'Gestolen!',x:c=>{const x=ownById(c.id);return S.cars.includes(x)?`Je ${x.name} is vannacht gestolen. De plek waar hij stond is leeg.`:pick([`Er is ingebroken. Je ${x.name} is weg.`,`Je ${x.name} wordt uit je tas gerold terwijl je in de trein zit.`,`Iemand heeft je ${x.name} gestolen.`])+(x.ins?' Gelukkig ben je verzekerd.':' Je bent niet verzekerd.')},ch:[
 ['👮 Aangifte doen',c=>{const x=ownById(c.id);if(chance(.2))return `De politie vindt je ${x.name} terug!`;lose(x);if(x.ins){const p=insPay(x);cash(p);return `Hij komt niet terug. De verzekering keert ${fmt(p)} uit.`}hap(-3);return 'Hij komt niet meer terug.'}],
 ['🕵️ Een privédetective inhuren',c=>{const x=ownById(c.id);const k=Math.round(Math.max(1500*(S.cpi||1),x.value*.04));cash(-k);if(chance(.5))return `De detective (${fmt(k)}) vindt je ${x.name} terug bij een heler.`;lose(x);if(x.ins){const p=insPay(x);cash(p);return `Zelfs de detective vindt niets. De verzekering keert ${fmt(p)} uit.`}hap(-3);return `De detective kost je ${fmt(k)} en vindt niets.`},c=>{const x=ownById(c.id);return x&&S.money>=Math.max(1500*(S.cpi||1),x.value*.04)}],
 ['🤷 Er niets aan doen',c=>{const x=ownById(c.id);lose(x);if(x.ins){const p=insPay(x);cash(p);return `De verzekering keert ${fmt(p)} uit.`}hap(-2);return 'Weg is weg.'}]]});

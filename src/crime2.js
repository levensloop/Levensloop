/* ================= MISDAAD (uitgebreid) ================= */
CRIMES.push(
 {id:'graffiti',t:'Graffiti spuiten',s:'Je naam op een treinstel',a:11,p:.25,gain:[0,0],jail:[0,0],heat:3},
 {id:'dealen',t:'Drugs dealen',s:'Snel geld, gevaarlijke klanten',a:16,p:.35,gain:[800,12000],jail:[6,36],heat:14,dirty:1},
 {id:'online',t:'Online oplichting',s:'Een nepwebshop (Techniek 25+)',a:16,p:.3,gain:[1500,40000],jail:[6,30],heat:10,dirty:1,c:()=>S.sk.tech>=25},
 {id:'smokkel',t:'Smokkelen',s:'Een pakketje over de grens',a:18,p:.4,gain:[5000,60000],jail:[12,60],heat:18,dirty:1});
for(const c of CRIMES)if(['fraude','bank'].includes(c.id))c.dirty=1;
Object.assign(CRIMEPLAN,{
 graffiti:[['🧱','Een muur in de buurt',1,1],['🚆','Een trein op het rangeerterrein',1.5,1],['🌉','Een brug boven de snelweg',1.3,1]],
 dealen:[['🏫','Bij de uitgang van een club',1,1],['📱','Via een anonieme app',.8,.8],['🎪','Op een groot festival',1.3,2]],
 online:[['🛒','Een nepwebshop met sneakers',1,1],['🎟️','Valse festivaltickets',1.1,1.3],['💎','Een nep-investeringsplatform',1.4,3]],
 smokkel:[['🚗','In de deur van je auto',1,1],['🧳','In een koffer met dubbele bodem',1.2,1.5],['🚢','Via een container in de haven',1.4,3]]});
// welk spelletje past bij welk plan
const CRMG={winkel:'bewaker',zak:'zak',inbraak:['','slot','alarm'],auto:['slot','slot','vis'],fraude:'cijfers',dealen:'straat',online:'cijfers',smokkel:'douane',graffiti:'bewaker',bank:'heist'};
const MGS={
 bewaker:f=>mgReact({title:'Niet gezien worden',desc:'Wacht tot de bewaker wegkijkt en sla dan toe.',em:'👮',idle:'👀',go:'🙈',fake:'😐',goTxt:'Hij kijkt weg!',btn:'Pakken!'},(h,n)=>f(h/n)),
 zak:f=>mgReact({title:'Zakkenrollen',desc:'Pak de portemonnee op het moment dat je doelwit wordt afgeleid.',em:'👛',idle:'🧍',go:'📱',fake:'🤨',goTxt:'Afgeleid!',btn:'Graaien!',win:550},(h,n)=>f(h/n)),
 slot:f=>mgDial({title:'Slot openpeuteren',desc:'Zet de pinnetjes vast als de naald in het groene stuk staat.',em:'🔓',mid:'🗝️',btn:'Pin zetten'},(h,n)=>f(h/n)),
 alarm:f=>mgCode({title:'Alarm uitschakelen',desc:'Je ziet de code even op het scherm van de bewaker. Onthoud hem.',em:'🔌',len:4},(h,n)=>f(h/n)),
 vis:f=>mgReact({title:'Sleutel vissen',desc:'Haal de sleutel door de brievenbus zodra hij aan je haakje hangt.',em:'🔑',idle:'🪝',go:'🔑',goTxt:'Beet!',btn:'Trekken!'},(h,n)=>f(h/n)),
 cijfers:f=>mgCode({title:'Cijfers vervalsen',desc:'Onthoud de juiste rekeningnummers en vul ze in.',em:'🧾',len:5},(h,n)=>f(h/n)),
 straat:f=>mgReact({title:'Dealen',desc:'Wacht tot de straat leeg is en geef dan het pakketje.',em:'🌃',idle:'🚓',go:'🌙',fake:'🚶',goTxt:'De straat is leeg',btn:'Geven'},(h,n)=>f(h/n)),
 douane:f=>mgDodge({title:'Langs de douane',desc:'Rijd langs de controles zonder tegengehouden te worden.',em:'🛃',me:'🚙',obs:['🚧','👮','🐕'],secs:12},(l,t)=>f(l/t)),
 vlucht:(f,hard)=>mgDodge({title:'Vluchten!',desc:'De politie zit achter je aan. Ontwijk alles op de weg.',em:'🚨',me:'🏎️',obs:['🚓','🚧','🚗','🛢️'],secs:14,hard:hard||1,speed:1.15},(l,t)=>f(l/t)),
 kluis:(f,len)=>mgCode({title:'De kluis kraken',desc:'Je kraker ziet de code heel even. Onthoud hem en tik hem in.',em:'🔐',len:len||5},(h,n)=>f(h/n))};
const toHits=f=>f>=.85?3:f>=.5?2:f>0?1:0;
function crime(cr,em){if(cr.id==='bank'){openSheet('Overval plannen',el=>sheetHeist(el,'bank'),true);return}const plans=CRIMEPLAN[cr.id];const h=Math.round(S.crim.heat||0);
  modal({title:cr.t,em,cat:'Misdaad',text:`Hoe pak je het aan?${h>30?` De politie houdt je al in de gaten (${h}%).`:''}`,choices:opts(plans.map((pl,i)=>{const g=Array.isArray(CRMG[cr.id])?CRMG[cr.id][i]:CRMG[cr.id];
    return {t:`${pl[0]} ${pl[1]}`,s:g?'Minigame':'',dis:!!(pl[4]&&!pl[4]()),on:()=>{closeModal();if(g&&MGS[g])MGS[g](f=>resolveCrime(cr,pl,toHits(f),em));else resolveCrime(cr,pl,null,em)}}}))})}
function resolveCrime(cr,pl,hits,em){const a=ageY();use('crime');kar(-ri(3,8));
  const risk=(typeof pl[2]==='function'?pl[2]():pl[2])*(S.talent==='misdaad'?.65:1);
  let p=cr.p*risk*(1+(S.crim.heat||0)/90)*(1+S.crim.rec.length*.12)*(1-S.sk.sport/400);
  if(hits!=null)p*=hits>=3?.55:hits===2?.9:1.5;p=clamp(p,.08,.95);
  if(chance(p)){const m=Math.max(1,Math.round(ri(cr.jail[0],cr.jail[1])*(1+S.crim.rec.length*.25)*risk));const minor=cr.jail[1]===0;
    closeSheet();L(`Betrapt tijdens ${cr.t.toLowerCase()}.`,'bad');Q.push({id:'s_arrest',c:{w:cr.t,m,minor,fine:ri(1,5)*100}});processQ();return}
  if(hits!=null&&hits<2&&chance(.5)){doAct(cr.t,()=>{S.crim.heat=Math.min(100,(S.crim.heat||0)+Math.round(cr.heat/2));hap(-1);return 'Het gaat mis. Je gaat er met lege handen vandoor, maar niemand heeft je gezien.'},true,'😬');return}
  doAct(cr.t,()=>{S.crim.heat=Math.min(100,(S.crim.heat||0)+cr.heat);if(cr.jail[1]>=6)S.crim.open.push({w:cr.t,m:ri(cr.jail[0],cr.jail[1]),a});hap(3);if(cr.id==='graffiti'){sk('kunst',2);return pick(['Je tag staat er. Groot en kleurrijk.','Een meesterwerk, al zal de gemeente het anders zien.'])}
    const g=Math.round(ri(cr.gain[0],cr.gain[1])*pl[3]*(hits===3?1.15:1)*(cr.id==='dealen'&&law('wiet')?.7:1));dirtyIn(g,cr.dirty);
    return `Gelukt. Je buit: ${fmt(g)}${cr.dirty||g>=20000?' (zwart geld)':''}.${S.crim.heat>60?' De politie zit je op de hielen.':S.crim.heat>30?' De politie is alert.':''}`},true,em)}
// ---- zwart geld en witwassen ----
function dirtyIn(g,force){if(force||g>=20000){S.crim.dirty=(S.crim.dirty||0)+g}else cash(g)}
const LAUNDER=[['🏢','Via je eigen bedrijf','Het geld als omzet boeken',.1,.05,()=>S.biz.length>0,'Je hebt een bedrijf nodig'],['🎰','Via het casino','Fiches kopen, later "winst" uitbetalen',.15,.1,()=>true,''],
  ['🪙','Crypto en offshore','Via buitenlandse rekeningen (Ondernemen 30+)',.2,.06,()=>S.sk.zaken>=30,'Ondernemen 30+'],['🕴️','Een witwasser inhuren','Iemand die het voor je regelt',.3,.12,()=>true,'']];
function sheetLaunder(el){const d=Math.round(S.crim.dirty||0);card(el,`<h3>🧼 Witwassen</h3>${kv([['Zwart geld',fmt(d)]])}<span class="muted">Zwart geld kun je niet zomaar uitgeven. Witwassen kost een deel van het geld en er is altijd een kans dat de FIOD je op het spoor komt.</span>`);
  const s=sec(el,'Hoe was je het wit?');
  for(const [ic,t,sub,fee,risk,ok,why] of LAUNDER)row(s,{ic,t,s:!ok()?why:`${sub} · kost ${Math.round(fee*100)}% · risico ${risk>=.1?'gemiddeld':'laag'}`,dis:!ok()||d<100,dots:true,on:()=>amountModal(t,d,x=>doAct('Witwassen',()=>{S.crim.dirty-=x;if(ic==='🏢')S.crim.dirtyWash=(S.crim.dirtyWash||0)+x;const got=Math.round(x*(1-fee));cash(got);if(chance(risk*(x>200000?1.6:1)))Q.push({id:'c_fiod',c:{}});S.crim.heat=Math.min(100,(S.crim.heat||0)+3);return `Je wast ${fmt(x)} wit. Er komt ${fmt(got)} schoon op je rekening.`},true,ic))});
  row(s,{ic:'💵',t:'Contant uitgeven',s:'Geen kosten, maar het valt op',dis:d<100,dots:true,on:()=>amountModal('Contant uitgeven',d,x=>doAct('Witwassen',()=>{S.crim.dirty-=x;cash(x);S.crim.heat=Math.min(100,(S.crim.heat||0)+8);if(chance(.12+x/1e6))Q.push({id:'c_fiod',c:{}});return `Je geeft ${fmt(x)} contant uit. Niet heel slim.`},true,'💵'))})}
E('c_fiod',{sys:1,t:'De FIOD staat voor de deur',x:()=>`Rechercheurs van de FIOD onderzoeken waar je geld vandaan komt.${S.crim.dirty>0?` Je hebt nog ${fmt(S.crim.dirty)} zwart geld liggen.`:''}`,ch:[
 ['⚖️ Een topadvocaat nemen',()=>{const k=Math.round(25000*(S.cpi||1));cash(-k);if(chance(.55))return `Je advocaat (${fmt(k)}) vindt fouten in het onderzoek. De zaak wordt geseponeerd.`;const c=Math.round(S.crim.dirty||0);S.crim.dirty=0;const f=Math.round(Math.max(10000,c*.5));cash(-f);return `Je advocaat (${fmt(k)}) kan het niet tegenhouden. Je zwarte geld wordt in beslag genomen en je krijgt een boete van ${fmt(f)}.`}],
 ['🤝 Meewerken',()=>{const c=Math.round(S.crim.dirty||0);S.crim.dirty=0;const f=Math.round(Math.max(5000,c*.3));cash(-f);if(c>250000&&chance(.5)){Q.push({id:'s_trial',c:{w:'witwassen',m:ri(12,48)}});return `Je zwarte geld wordt in beslag genomen, je krijgt een boete van ${fmt(f)} en het OM vervolgt je voor witwassen.`}return `Je zwarte geld (${fmt(c)}) wordt in beslag genomen en je krijgt een boete van ${fmt(f)}.`}],
 ['🤥 Alles ontkennen',()=>{if(chance(.35))return 'Ze kunnen niets bewijzen. Voorlopig.';const c=Math.round(S.crim.dirty||0);S.crim.dirty=0;Q.push({id:'s_trial',c:{w:'witwassen',m:ri(18,60)}});return `Ze vinden genoeg. Alles wordt in beslag genomen (${fmt(c)}) en je moet voor de rechter verschijnen.`}]]});
// ---- overvallen plannen met een crew ----
// zonder crew geen overval; hoe groter de klus, hoe meer rollen. Elk crewlid pakt een deel van de buit, afhankelijk van zijn prestige.
const HEISTS={juwelier:{t:'Juwelier',em:'💎',a:18,loot:[40000,250000],d:1,len:4,jail:[24,72],need:['rijden','kracht']},
  transport:{t:'Geldtransport',em:'🚚',a:21,loot:[150000,900000],d:2,len:5,jail:[36,108],need:['rijden','kracht','oplet']},
  bank:{t:'Bank',em:'🏦',a:18,loot:[250000,1800000],d:3,len:6,jail:[48,144],need:['rijden','kraken','kracht','oplet']},
  casino:{t:'Casino',em:'🎰',a:21,loot:[400000,2500000],d:3,len:6,jail:[48,144],need:['rijden','kraken','kracht','oplet','hack']},
  museum:{t:'Kunstmuseum',em:'🖼️',a:21,loot:[600000,5000000],d:4,len:6,jail:[48,144],need:['rijden','kraken','kracht','oplet','hack','binnen']}};
const ROLES=[['rijden','Chauffeur','🚗','rijdt de vluchtauto'],['kraken','Kraker','🔓','kraakt de kluis'],['kracht','Spierballen','💪','houdt iedereen rustig'],['oplet','Uitkijk','👀','let op de politie'],['hack','Hacker','💻','zet camera\'s en alarm uit'],['binnen','Infiltrant','🎭','komt binnen als personeel']];
function crewSk(p){const k=p.csk=p.csk||{};for(const [r] of ROLES)if(k[r]==null)k[r]=ri(15,85);return k}
const PRESTN=['Beginner','Bekend','Ervaren','Topcrimineel','Legende'];
function prest(p){if(p.prest==null){const k=crewSk(p);p.prest=clamp(Math.round(Object.values(k).reduce((a,b)=>a+b,0)/ROLES.length+ri(-12,12)))}return p.prest}
const prestLvl=p=>{const v=prest(p);return v<35?0:v<55?1:v<70?2:v<85?3:4};
const prestTxt=p=>`${'★'.repeat(prestLvl(p)+1)} ${PRESTN[prestLvl(p)]}`;
// procent van de buit dat iemand vraagt: ~4% voor een nobody, tot ~12% voor een legende. Vrienden doen het iets goedkoper, je eigen bende/familie nog goedkoper.
function cutPct(x){return Math.max(2,Math.round((2+prest(x.p)*.1)*(x.src==='vriend'?.8:x.src==='huur'?1:.6)))}
const srcTxt=s=>s==='vriend'?'vriend':s==='huur'?'beroeps':s==='maffia'?'familie':'bendelid';
function crewPool(){const free=p=>p&&p.alive!==false&&!(p.jail&&p.jail.until>S.m);const out=living('vriend').filter(free).map(p=>({p,src:'vriend'}));const org=S.crim.org;if(org&&org.mem)for(const m of org.mem)if(free(m))out.push({p:m,src:org.type});for(const h of (S.crim.pros||[]))out.push({p:h,src:'huur'});return out}
function prosGen(){S.crim.prosY=year();S.crim.pros=Array.from({length:8},(_,i)=>{const t=[30,40,50,60,70,78,86,93][i]+ri(-6,6);const p=mkPerson('crimineel',pick(['m','v','m']),S.m-ri(22,55)*12);p.csk={};for(const [r] of ROLES)p.csk[r]=clamp(ri(t-18,t+8),5,99);p.prest=clamp(t+ri(-5,5));return p})}
function heistCalc(tk){const pl=S.crim.plan,H=HEISTS[tk],pool=crewPool();const mem=r=>pool.find(x=>x.p.id===pl.crew[r]);const filled=H.need.filter(r=>mem(r));
  const mates=filled.map(r=>({...mem(r),r}));const q=filled.length?Math.round(filled.reduce((s,r)=>s+crewSk(mem(r).p)[r],0)/filled.length):0;const crewPct=mates.reduce((s,x)=>s+cutPct(x),0);
  return {pl,H,pool,mem,filled,mates,q,crewPct,open:H.need.length-filled.length}}
const diffTxt=q=>q>=80?'Makkelijk':q>=60?'Te doen':q>=40?'Lastig':'Heel zwaar';
function sheetHeist(el,tk){const pl=S.crim.plan=S.crim.plan&&S.crim.plan.t===tk?S.crim.plan:{t:tk,crew:{},gear:0};const H=HEISTS[tk];const a=ageY();
  if(!S.crim.pros||S.crim.prosY!==year()||S.crim.pros.length<8)prosGen();
  for(const r of Object.keys(pl.crew))if(!H.need.includes(r))delete pl.crew[r];
  const tg=sec(el,'Doelwit');for(const [k,x] of Object.entries(HEISTS))row(tg,{ic:x.em,t:x.t,s:a<x.a?`Vanaf ${x.a} jaar`:`Buit ${fmt(x.loot[0])} – ${fmt(x.loot[1])} · ${'★'.repeat(x.d)} · ${x.need.length} man crew nodig`,cls:k===tk?'cur':'',dis:a<x.a,on:()=>{S.crim.plan={t:k,crew:{},gear:0};backSheet();openSheet('Overval plannen',el=>sheetHeist(el,k),true)}});
  const C=heistCalc(tk);const c=sec(el,`Je crew (${C.filled.length}/${H.need.length})`);
  for(const k of H.need){const [,n,ic,d]=ROLES.find(r=>r[0]===k);const m=C.mem(k);row(c,{ic:m?faceOf(m.p):ic,t:`${n}: ${m?m.p.first:'nog niemand'}`,s:m?`${n.toLowerCase()} ${crewSk(m.p)[k]}% · ${prestTxt(m.p)} · wil ${cutPct(m)}% van de buit`:d,dots:true,on:()=>pickCrew(tk,k)})}
  const g=sec(el,'Uitrusting');const GEAR=[['Basis',0,'Bivakmutsen en een oude bus'],['Goed',15000,'Stille gereedschappen, portofoons'],['Professioneel',60000,'Snelle auto, stoorzenders, nep-uniformen']];
  GEAR.forEach(([t,k,d],i)=>row(g,{ic:pl.gear===i?'✅':'⚪',t:`${t}${k?' · '+fmt(k*(S.cpi||1)):''}`,s:d,on:()=>{pl.gear=i;refreshSheet()}}));
  const gk=GEAR[pl.gear][1]*(S.cpi||1);
  if(C.filled.length)card(el,kv([['Crew-kwaliteit',`${C.q}% · ${diffTxt(C.q)}`],['Deel voor de crew',C.crewPct+'%'],['Jouw deel',(100-C.crewPct)+'%']]));
  const go=sec(el,'');row(go,{ic:H.em,t:`${H.t} overvallen`,s:C.open?`Je hebt nog ${C.open} ${C.open===1?'crewlid':'crewleden'} nodig. Alleen kun je dit niet.`:`Kosten vooraf ${fmt(gk)} · minigames: kluis en vlucht`,cls:'special',dis:!!C.open||S.money<gk,dots:true,on:()=>runHeist(tk,gk)})}
function pickCrew(tk,role){const pl=S.crim.plan;const pool=crewPool().filter(x=>!Object.entries(pl.crew).some(([r,id])=>r!==role&&id===x.p.id));const R_=ROLES.find(r=>r[0]===role);
  modal({title:R_[1],em:R_[2],cat:'Overval plannen',text:`Wie ${R_[3]}? Hoe beter iemand is, hoe makkelijker de klus, maar hoe groter het deel van de buit dat hij wil.`,choices:opts([...pool.sort((x,y)=>crewSk(y.p)[role]-crewSk(x.p)[role]).slice(0,10).map(x=>({t:`${x.p.first} ${x.p.last||''}`.trim(),ic:faceOf(x.p),s:`${R_[1].toLowerCase()} ${crewSk(x.p)[role]}% · ${prestTxt(x.p)} · ${srcTxt(x.src)} · wil ${cutPct(x)}%`,on:()=>{pl.crew[role]=x.p.id;closeModal();refreshSheet()}})),...(pl.crew[role]?[{t:'Rol leegmaken',on:()=>{pl.crew[role]=null;closeModal();refreshSheet()}}]:[])])})}
function runHeist(tk,cost){const C=heistCalc(tk);const {pl,H,mem,q,mates}=C;if(C.open){toast('Je crew is nog niet compleet');return}
  const sk_=r=>H.need.includes(r)?crewSk(mem(r).p)[r]:q;const kr=H.need.includes('kraken')?mem('kraken').p:null,dr=mem('rijden').p;
  cash(-cost);closeSheet();const kq=sk_('kraken'),dq=sk_('rijden');
  const len=clamp(H.len+1-Math.floor(kq/25),3,8),show=Math.round((700+len*350)*(1+kq/100));
  mgCode({title:'De kluis kraken',desc:`${kr?kr.first+' ziet':'Jullie zien'} de code heel even. Onthoud hem en tik hem in.`,em:'🔐',len,show},(h,n)=>{const fk=h/n;
  mgDodge({title:'Vluchten!',desc:`${dr.first} zit achter het stuur. Ontwijk alles op de weg.`,em:'🚨',me:'🏎️',obs:['🚓','🚧','🚗','🛢️'],secs:Math.max(8,Math.round(10+H.d*1.5-dq/30)),lives:dq>=80?4:3,hard:Math.max(0,H.d*1.2*(1.3-dq/100)),speed:1.15},(l,t)=>{const fv=l/t;
    const extra=(H.need.includes('hack')?sk_('hack')/1000:0)+sk_('oplet')/1000;
    const caught=chance(clamp(.8-fk*.4-fv*.35-q/100*.3-pl.gear*.05-extra-(S.talent==='misdaad'?.1:0)+H.d*.05+(S.crim.heat||0)/250,.05,.9));
    if(caught){L(`De overval op de ${H.t.toLowerCase()} mislukt.`,'bad');for(const m of mates)if(m.src==='vriend')m.p.rel=clamp(m.p.rel-15);Q.push({id:'s_arrest',c:{w:`overval op een ${H.t.toLowerCase()}`,m:ri(H.jail[0],H.jail[1]),minor:false,fine:0}});processQ();return}
    doAct('Overval',()=>{const tot=Math.round(ri(H.loot[0],H.loot[1])*(fk>=.8?1:fk>=.5?.6:.3)*(S.cpi||1));const crewG=Math.round(tot*C.crewPct/100);const mine=tot-crewG;dirtyIn(mine,1);S.crim.heat=Math.min(100,(S.crim.heat||0)+25+H.d*8);
      for(const m of mates){if(m.src==='vriend')m.p.rel=clamp(m.p.rel+10);m.p.prest=clamp(prest(m.p)+2)}S.crim.open.push({w:`overval op een ${H.t.toLowerCase()}`,m:ri(H.jail[0],H.jail[1]),a:ageY()});S.crim.heists=(S.crim.heists||0)+1;MS(`Pleegde een overval op een ${H.t.toLowerCase()}`,2);hap(8);
      if(S.crim.heists>=1&&!S.crim.org&&chance(.4))Q.push({id:'c_maffia',c:EV.c_maffia.ctx()});
      return `${fk>=.8?'De kluis gaat open.':fk>=.5?'Je krijgt de kluis maar half open.':'De kluis blijft grotendeels dicht.'} ${fv>=.67?'Jullie ontkomen zonder kleerscheuren.':'Het was nipt, maar jullie ontkomen.'} Totale buit ${fmt(tot)}. Je crew krijgt ${fmt(crewG)} (${C.crewPct}%), jouw deel: ${fmt(mine)} zwart geld.`},true,H.em)})})}
// ---- organisaties: eigen bende of de maffia ----
const MRANK=['Associate','Soldaat','Caporegime','Consigliere','Onderbaas','Baas van de familie'];const MRESP=[0,30,70,130,220,350];
function sheetOrg(el){const o=S.crim.org,a=ageY();
  if(!o){card(el,`<h3>🕶️ De onderwereld</h3><span class="muted">Begin je eigen bende of klim op in de maffia. Hoe groter je naam, hoe meer geld, maar ook hoe meer politie.</span>`);const s=sec(el,'');
    row(s,{ic:'🏴',t:'Een eigen bende oprichten',s:a<16?'Vanaf 16 jaar':`Kost ${fmt(2500)} · je hebt minstens één misdrijf nodig op je naam`,dis:a<16||S.money<2500||(!S.crim.rec.length&&!(S.crim.open||[]).length),dots:true,on:()=>modal({title:'Je bende',em:'🏴',cat:'Onderwereld',html:`<input class="inp" id="gn" maxlength="24" value="${he(pick(['De Schaduwen','Noorderlicht','De Wolven','Kraaiennest','Zwarte Roos','De Havenjongens']))}">`,choices:opts([{t:'Oprichten',cls:'go',on:()=>{const n=$('#gn').value.trim()||'Naamloos';closeModal();doAct('Bende',()=>{cash(-2500);S.crim.org={type:'bende',name:n,rep:10,turf:1,mem:[]};for(let i=0;i<2;i++)gangRecruit();MS(`Richtte de bende ${n} op`,2);return `${n} is opgericht. Jij bent de leider.`},true,'🏴')}}])})});
    row(s,{ic:'🤵',t:'De maffia',s:'Daar word je voor uitgenodigd. Laat eerst zien wat je kunt.',dis:true});return}
  if(o.type==='bende'){card(el,`<h3>🏴 ${he(o.name)}</h3>${kv([['Leden',o.mem.length],['Gebieden',o.turf],['Reputatie',Math.round(o.rep)+'%'],['Zwart geld',fmt(S.crim.dirty||0)]])}`);const s=sec(el,'Acties');
    const A=(ic,t,sub,fn,o_={})=>row(s,{ic,t,s:sub,dis:o_.dis,dots:o_.dots,on:fn});
    A('🧑‍🤝‍🧑','Leden werven','Nieuwe mensen voor je bende',()=>doAct('Werven',()=>{if(o.mem.length>=12)return 'Je bende is al groot genoeg.';const m=use('werf');if(!m||!chance(.4+o.rep/200))return 'Niemand durft zich aan te sluiten.';const p=gangRecruit();return `${p.first} sluit zich aan bij ${o.name}.`},true,'🧑‍🤝‍🧑'));
    A('💰','Protectiegeld innen','Winkeliers in je gebied betalen',()=>doAct('Protectiegeld',()=>{const m=use('prot');const g=Math.round(o.turf*ri(400,1500)*m*(S.cpi||1));dirtyIn(g,1);S.crim.heat=Math.min(100,(S.crim.heat||0)+6);o.rep=clamp(o.rep+2*m);kar(-3);return `Je haalt ${fmt(g)} op.`},true,'💰'));
    A('⚔️','Een gebied overnemen','Vecht tegen de leider van een rivaliserende bende',()=>{if(S.acts.turf){toast('Dit jaar al gedaan');return}S.acts.turf=1;const foe={first:pick(['"Bullet" Ramon','Dikke Gerrit','"De Slang"','Kleine Mo','Sven "Ijzer"']),sk:clamp(30+o.turf*6+ri(0,25)),hp:ri(80,100)};
      fightFlow({foe,title:'Strijd om de buurt',cat:o.name,kill:()=>{S.crim.heat=Math.min(100,(S.crim.heat||0)+20)},end:res=>{if(res==='win'){o.turf++;o.rep=clamp(o.rep+10);return `Je verslaat ${foe.first}. De buurt is nu van ${o.name}.`}o.rep=clamp(o.rep-6);if(o.mem.length&&chance(.3)){const x=o.mem.splice(ri(0,o.mem.length-1),1)[0];return `${foe.first} wint. Je bendelid ${x.first} verlaat de bende.`}return `${foe.first} wint. Je naam heeft een deuk.`}})},{dots:true});
    A('🎯','Een lid op klus sturen','Zij doen het vuile werk, jij krijgt een deel',()=>{if(!o.mem.length){toast('Je hebt nog geen leden');return}modal({title:'Wie stuur je?',em:'🎯',cat:o.name,choices:opts(o.mem.map(p=>({t:p.first,ic:faceOf(p),s:`kracht ${crewSk(p).kracht}% · rijden ${crewSk(p).rijden}%`,on:()=>{closeModal();doAct('Klus',()=>{use('klus');const k=crewSk(p);if(chance((k.kracht+k.oplet)/220)){const g=Math.round(ri(2,15)*1000*(S.cpi||1));dirtyIn(Math.round(g*.6),1);o.rep=clamp(o.rep+3);return `${p.first} komt terug met ${fmt(g)}. Jouw deel: ${fmt(Math.round(g*.6))}.`}o.mem=o.mem.filter(x=>x!==p);S.crim.heat=Math.min(100,(S.crim.heat||0)+10);if(chance(.3)){Q.push({id:'s_caught',c:{w:'leiding geven aan een criminele organisatie',m:ri(24,60)}});return `${p.first} wordt opgepakt en praat over jou.`}return `${p.first} wordt opgepakt, maar houdt zijn mond.`},true,'🎯')}})))})},{dots:true});
    A('🧼','Witwassen','Je zwarte geld schoon krijgen',()=>openSheet('Witwassen',sheetLaunder,true));
    A('🏳️','De bende opheffen','',()=>ask('Opheffen?',`${o.name} houdt op te bestaan.`,'Opheffen',()=>{S.crim.org=null;refreshSheet();render()}),{dots:true});
    if(o.mem.length){const m=sec(el,'Leden');for(const p of o.mem)row(m,{ic:faceOf(p),t:`${p.first} ${p.last}`,s:`rijden ${crewSk(p).rijden}% · kraken ${crewSk(p).kraken}% · kracht ${crewSk(p).kracht}%`})}return}
  // maffia
  card(el,`<h3>🤵 ${he(o.name)}</h3>${kv([['Jouw rang',MRANK[o.rank]],['Respect',Math.round(o.resp)],['Volgende rang',o.rank<MRANK.length-1?`${MRANK[o.rank+1]} bij ${MRESP[o.rank+1]} respect`:'Je bent de baas'],['Zwart geld',fmt(S.crim.dirty||0)]])}`);
  const s=sec(el,'Klussen voor de familie');
  for(const [id,ic,t,sub] of [['incasseren','💪','Geld incasseren','Iemand is de familie geld schuldig · gevecht'],['bezorgen','📦','Een pakketje bezorgen','Zonder de politie tegen te komen · uitwijken'],['afluisteren','🎧','Iemand schaduwen','Op het juiste moment een foto maken · reactie'],['boekhouding','📒','De boekhouding doen','Cijfers onthouden · code']])
    row(s,{ic,t,s:S.acts['mf'+id]?'Dit jaar al gedaan':sub,dis:!!S.acts['mf'+id],dots:true,on:()=>mafiaJob(id)});
  const o2=sec(el,'');
  row(o2,{ic:'📈',t:'Promotie vragen',s:o.rank>=MRANK.length-1?'Hoger kan niet':o.resp>=MRESP[o.rank+1]?`Klaar voor ${MRANK[o.rank+1]}`:`Nog ${MRESP[o.rank+1]-Math.round(o.resp)} respect nodig`,dis:o.rank>=MRANK.length-1||o.resp<MRESP[o.rank+1],dots:true,on:()=>doAct('Promotie',()=>{o.rank++;hap(6);MS(`Werd ${MRANK[o.rank].toLowerCase()} in ${o.name}`,2);return `Je wordt ${MRANK[o.rank]}. ${o.rank>=4?'Mensen buigen als je binnenkomt.':'De familie vertrouwt je meer.'}`},true,'📈')});
  row(o2,{ic:'🧼',t:'Witwassen',s:'Je zwarte geld schoon krijgen',on:()=>openSheet('Witwassen',sheetLaunder,true)});
  row(o2,{ic:'🚪',t:'Uit de familie stappen',s:'Uit de maffia stap je niet zomaar',dots:true,on:()=>ask('Uitstappen?','De familie vergeet niet.','Uitstappen',()=>{S.crim.org=null;if(chance(.4)){hea(-ri(20,45));hap(-10);L('Een paar weken later word je in een steegje opgewacht. Je overleeft het maar net.','bad big')}else L('Je stapt uit de familie. Voorlopig laten ze je met rust.','sys');refreshSheet();render()})})}
function gangRecruit(){const o=S.crim.org;const p=mkPerson('bendelid',pick(['m','m','v']),S.m-ri(16,35)*12);crewSk(p);o.mem.push(p);return p}
function mafiaJob(id){const o=S.crim.org;S.acts['mf'+id]=1;const pay=f=>{const g=Math.round(ri(3,10)*1000*(1+o.rank*.8)*(S.cpi||1)*(.4+f*.6));const r=Math.round(ri(8,15)*(.5+f));return [g,r]};
  const done=(f,txt)=>doAct('Klus',()=>{if(f<.34){o.resp=Math.max(0,o.resp-5);S.crim.heat=Math.min(100,(S.crim.heat||0)+8);return `${txt} Het gaat mis. De familie is niet blij.`}const [g,r]=pay(f);dirtyIn(g,1);o.resp+=r;kar(-4);S.crim.heat=Math.min(100,(S.crim.heat||0)+5);return `${txt} Klus geklaard: ${fmt(g)} zwart geld en ${r} respect.`},true,'🤵');
  if(id==='incasseren')fightFlow({foe:{first:pick(['de wanbetaler','een nerveuze zakenman','de eigenaar van de pizzeria']),sk:ri(15,50),hp:ri(60,90)},title:'Geld incasseren',cat:o.name,end:res=>{const f=res==='win'?1:res==='flee'?0:.2;const [g,r]=pay(f);if(f>.3){dirtyIn(g,1);o.resp+=r}return res==='win'?`Hij betaalt. ${fmt(g)} en ${r} respect.`:'Hij betaalt niet. De familie is teleurgesteld.'}});
  if(id==='bezorgen')mgDodge({title:'Pakketje bezorgen',desc:'Rijd naar het adres zonder de politie tegen te komen.',em:'📦',me:'🚐',obs:['🚓','🚧','🚔'],secs:12,hard:1},(l,t)=>done(l/t,'Je levert het pakketje af.'));
  if(id==='afluisteren')mgReact({title:'Schaduwen',desc:'Maak een foto op het moment dat de man zijn gezicht laat zien.',em:'🎧',idle:'🧥',go:'🧔',fake:'🧢',goTxt:'Nu!',btn:'📸 Foto'},(h,n)=>done(h/n,'Je bezorgt de foto\'s bij de familie.'));
  if(id==='boekhouding')mgCode({title:'De boekhouding',desc:'Onthoud de rekeningnummers. Geen fouten.',em:'📒',len:6},(h,n)=>done(h/n,'De boeken kloppen weer, op papier.'))}
E('c_maffia',{sys:1,need:()=>!S.crim.org&&ageY()>=18&&!inJail(),t:'Een aanbod dat je niet kunt weigeren',ctx:()=>({f:pick(['Moretti','De Luca','Romano','Vitale'])}),x:c=>`Een man in een duur pak spreekt je aan. "De familie ${c.f||'Moretti'} heeft over je gehoord. We kunnen iemand zoals jij gebruiken."`,ch:[
 ['🤝 Aannemen',c=>{S.crim.org={type:'maffia',name:`De familie ${c.f||'Moretti'}`,rank:0,resp:0,mem:Array.from({length:3},()=>{const p=mkPerson('familielid','m',S.m-ri(25,55)*12);crewSk(p);return p})};MS(`Trad toe tot ${S.crim.org.name}`,2);return 'Welkom in de familie. Vanaf nu ben je een associate.'}],
 ['🙅 Beleefd weigeren',()=>{if(chance(.2)){hea(-ri(5,15));return 'Ze nemen geen nee. Je krijgt een "waarschuwing" die je nog weken voelt.'}return 'De man knikt en verdwijnt. "Als je van gedachten verandert..."'}]]});
E('c_bende',{sys:1,need:()=>S.crim.org&&S.crim.org.type==='bende',t:'Aanval op je bende',x:()=>`Een rivaliserende bende valt jullie aan in ${S.p.city}.`,ch:[
 ['⚔️ Terugvechten',()=>({go:()=>fightFlow({foe:{first:'De rivaal',sk:ri(30,70),hp:ri(80,100)},title:'Bendeoorlog',cat:S.crim.org.name,next:processQ,end:res=>{const o=S.crim.org;if(!o)return '';if(res==='win'){o.rep=clamp(o.rep+8);return 'Jullie slaan de aanval af. Iedereen weet nu wie de baas is.'}o.turf=Math.max(0,o.turf-1);o.rep=clamp(o.rep-8);return 'Jullie verliezen een gebied.'}})})],
 ['💶 Onderhandelen',()=>{const k=Math.round(ri(5,20)*1000*(S.cpi||1));if(S.money>=k){cash(-k);return `Je koopt de vrede voor ${fmt(k)}.`}S.crim.org.turf=Math.max(0,S.crim.org.turf-1);return 'Je hebt niet genoeg geld. Je verliest een gebied.'}],
 ['🏃 Terugtrekken',()=>{const o=S.crim.org;o.turf=Math.max(0,o.turf-1);o.rep=clamp(o.rep-10);return 'Je laat ze hun gang gaan. Je reputatie krijgt een flinke deuk.'}]]});
function orgYear(){const o=S.crim.org;if(!o&&!inJail()&&ageY()>=18&&S.crim.rec.length+(S.crim.heists||0)>=3&&!S.flags.mafAsk&&chance(.2)){S.flags.mafAsk=1;Q.push({id:'c_maffia',c:EV.c_maffia.ctx()})}if(!o||inJail())return;
  if(o.type==='bende'){const g=Math.round(o.turf*ri(2,5)*1000*(S.cpi||1));dirtyIn(g,1);S.crim.heat=Math.min(100,(S.crim.heat||0)+o.turf*2);L(`${o.name} levert dit jaar ${fmt(g)} zwart geld op.`,'sys');if(chance(.2+o.turf*.04))Q.push({id:'c_bende',c:{}})}
  else{const g=Math.round(ri(5,15)*1000*o.rank*o.rank*(S.cpi||1));if(g){dirtyIn(g,1);L(`Jouw deel van de familiezaken dit jaar: ${fmt(g)} zwart geld.`,'sys')}S.crim.heat=Math.min(100,(S.crim.heat||0)+3+o.rank*2)}
  if((S.crim.dirty||0)>20000&&chance(Math.min(.25,(S.crim.dirty||0)/2e6+.03)))Q.push({id:'c_fiod',c:{}})}
// ---- het misdaadscherm ----
function sheetCrime(el){const h=Math.round(S.crim.heat||0),open=(S.crim.open||[]).length,o=S.crim.org;
  card(el,`<h3>👺 Misdaad</h3><div class="stat"><span>Aandacht van de politie</span><span></span><span class="v">${h}%</span>${bar(h,h>60?'var(--bad)':h>30?'var(--warn)':'var(--good)')}</div>${kv([['Zwart geld',fmt(S.crim.dirty||0)],['Strafblad',`${S.crim.rec.length} aantekening${S.crim.rec.length===1?'':'en'}`],['Onopgeloste zaken',open],...(o?[[o.type==='bende'?'Je bende':'Familie',o.type==='bende'?o.name:`${o.name} · ${MRANK[o.rank]}`]]:[])])}`);
  const t=sec(el,'');row(t,{ic:o?.type==='maffia'?'🤵':'🏴',t:o?(o.type==='bende'?o.name:o.name):'De onderwereld',s:o?(o.type==='bende'?`${o.mem.length} leden · ${o.turf} gebieden`:MRANK[o.rank]):'Een eigen bende of de maffia',dis:ageY()<16,on:()=>openSheet('Onderwereld',sheetOrg,true)});
  row(t,{ic:'🗺️',t:'Overval plannen',s:ageY()<18?'Vanaf 18 jaar':'Kies een doelwit, stel een crew samen',dis:ageY()<18,on:()=>openSheet('Overval plannen',el=>sheetHeist(el,(S.crim.plan||{}).t||'juwelier'),true)});
  row(t,{ic:'🧼',t:'Witwassen',s:S.crim.dirty>0?`${fmt(S.crim.dirty)} zwart geld`:'Je hebt geen zwart geld',dis:!(S.crim.dirty>0),on:()=>openSheet('Witwassen',sheetLaunder,true)});
  const s=sec(el,'Misdrijven');const em={winkel:'🛍️',zak:'👛',inbraak:'🏚️',auto:'🚘',fraude:'🧾',bank:'🏦',graffiti:'🎨',dealen:'💊',online:'💻',smokkel:'🧳'};
  for(const cr of CRIMES)row(s,{ic:em[cr.id]||'👺',t:cr.t,s:ageY()<cr.a?`Vanaf ${cr.a} jaar`:cr.id==='bank'?'Plan het met een crew':cr.s,dis:ageY()<cr.a||(cr.c&&!cr.c()),dots:true,on:()=>crime(cr,em[cr.id]||'👺')})}

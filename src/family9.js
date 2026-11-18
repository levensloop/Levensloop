/* ================= FASE 9: kinderen, partner, vrienden en grote familiemomenten =================
   9.5 acties per leeftijd van je kind, cijfers en schoolniveau van je kinderen
   9.6 samen beslissen met je partner, jubilea, de droom of de affaire van je partner
   9.7 beste vriend(in), vriendengroepen, uit beeld raken, reünie
   9.8 hooguit één groot familiemoment per jaar (S.fmY) */

// ---------- 9.5 kinderen ----------
const CLB={voetbal:['⚽','Voetbal'],zwemmen:['🏊','Zwemmen'],muziek:['🎹','Muziekles'],dans:['💃','Dansles'],scouting:['⛺','Scouting'],tekenen:['🎨','Tekenles'],schaken:['♟️','Schaakclub'],judo:['🥋','Judo']};
const HR={streng:['Streng','Vroeg thuis, telefoon weg bij het eten'],normaal:['Normaal','Afspraken maken, soms onderhandelen'],vrij:['Vrij','Ze bepalen het grotendeels zelf']};
const kidCost=()=>Math.round(300*(S.cpi||1)),opvCost=()=>Math.round(3500*(S.cpi||1));
function kidSchool(){for(const k of living('kind')){const a=pAge(k);if(a<1||a>17)continue;const x=lf(k);
  if(k.opv&&a>=1&&a<=4){cash(-opvCost());k.smarts=clamp(k.smarts+1);k.disc=clamp((k.disc??50)+1)}if(k.opv&&a>4)k.opv=0;
  if(k.club&&a>=6){cash(-kidCost());k.rel=clamp(k.rel+1);if(['voetbal','zwemmen','dans','judo'].includes(k.club))k.looks=clamp(k.looks+1);else k.smarts=clamp(k.smarts+1)}
  if(a>=12&&k.hr==='streng'){k.disc=clamp((k.disc??50)+2);k.rel=clamp(k.rel-1)}else if(a>=12&&k.hr==='vrij'){k.disc=clamp((k.disc??50)-2);k.rel=clamp(k.rel+1)}
  if(a>=6){const hw=(S.lastActs||{})['hw'+k.id]?.4:0;k.gr=Math.round(clamp((3.3+k.smarts/22+((k.disc??50)-50)/45+hw+(R()-.5)*1.2)*10,30,98))/10}
  if(a>=12&&!x.lvl){x.lvl=k.smarts>=66&&(k.gr||6)>=6.6?'vwo':k.smarts>=46?'havo':'vmbo';x.len={vmbo:4,havo:5,vwo:6}[x.lvl];lfLog(k,`Ging naar de middelbare school: ${lvlN(x.lvl)}`)}
  if(x.lvl&&!x.sch&&a===12+x.len){x.sch=1;if((k.gr||6)>=5.5||chance(.6))lfLog(k,`Slaagde voor ${lvlN(x.lvl)}`);else lfLog(k,`Zakte voor ${lvlN(x.lvl)} en deed het jaar over`)}}}
function rapport(p){const g=p.gr||6;const good=g>=7,bad=g<5.5;
  modal({title:`Het rapport van ${p.first}`,em:'📒',cat:roleLabel(p),person:p,text:`Gemiddeld een ${nl1(g)}. ${good?'Een prima rapport.':bad?'Er staan een paar onvoldoendes op.':'Niet slecht, niet heel goed.'} ${p.first} kijkt je afwachtend aan.`,choices:opts([
    {t:'🌟 Trots zijn',on:()=>{closeModal();doAct('Rapport',()=>{S.acts['rap'+p.id]=1;p.rel=clamp(p.rel+(good?6:3));if(good)memAdd(p,'trots+');if(bad)p.disc=clamp((p.disc??50)-2);return good?`${p.first} straalt. Het rapport krijgt een plekje op de koelkast.`:`${p.first} is opgelucht. "Volgend jaar beter," belooft ${f8Hij(p.g)}.`},true,'🌟')}},
    {t:'📚 Aansporen om harder te werken',on:()=>{closeModal();doAct('Rapport',()=>{S.acts['rap'+p.id]=1;p.disc=clamp((p.disc??50)+4);p.rel=clamp(p.rel-1);return `Jullie maken samen een planning voor het huiswerk. ${p.first} zucht, maar doet mee.`},true,'📚')}},
    {t:'😠 Streng zijn',on:()=>{closeModal();doAct('Rapport',()=>{S.acts['rap'+p.id]=1;p.disc=clamp((p.disc??50)+6);p.rel=clamp(p.rel-6);if(!good)memAdd(p,'streng-');return `Je bent flink boos. ${p.first} rent huilend naar boven.`},true,'😠')}},
    {t:`🎁 Een beloning (${fmt(Math.round(50*(S.cpi||1)))})`,dis:S.money<50*(S.cpi||1),on:()=>{closeModal();doAct('Rapport',()=>{S.acts['rap'+p.id]=1;cash(-Math.round(50*(S.cpi||1)));p.rel=clamp(p.rel+6);return `${p.first} mag iets uitzoeken. Het wordt ${pick(['een spel','een boek','sneakers','een dagje pretpark'])}.`},true,'🎁')}}])})}
function clubMenu(p){modal({title:'Een club',em:'🏅',cat:p.first,person:p,text:`Wat gaat ${p.first} doen? Een club kost ${fmt(kidCost())} per jaar.`,choices:opts(Object.entries(CLB).map(([k,[e,n]])=>({t:`${e} ${n}`,cls:p.club===k?'go':'',on:()=>{closeModal();p.club=k;lfLog(p,`Ging op ${n.toLowerCase()}`);p.rel=clamp(p.rel+3);toast(`${p.first} gaat op ${n.toLowerCase()}`);refreshSheet()}})).concat(p.club?[{t:'🛑 Stoppen met de club',on:()=>{closeModal();p.club=null;refreshSheet()}}]:[]))})}
function rulesMenu(p){modal({title:'Huisregels',em:'🏠',cat:p.first,person:p,text:`Hoe streng ben je voor ${p.first}?`,choices:opts(Object.entries(HR).map(([k,[n,d]])=>({t:n,s:d,cls:(p.hr||'normaal')===k?'go':'',on:()=>{closeModal();p.hr=k;refreshSheet();toast(`Huisregels: ${n.toLowerCase()}`)}})))})}
F8.person.push((el,p)=>{if(p.role!=='kind'||!p.alive||inJail()||abroad(p))return;const a=pAge(p),cp=S.cpi||1;const s=sec(el,a<18?'🧸 Opvoeden':'👪 Je volwassen kind');
  const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,on:()=>doAct(t,fn,true,ic)});
  if(a<=1){A('🍼','Voeden',()=>{const m=use('voed'+p.id);p.rel=clamp(p.rel+Math.round(4*m));hap(1);return pick([`${p.first} drinkt de fles leeg en laat een flinke boer.`,`${p.first} eet voor het eerst groente. Het meeste zit op je trui.`,`${p.first} valt halverwege de fles in slaap.`])});
    A('🤗','Troosten',()=>{const m=use('troost'+p.id);p.rel=clamp(p.rel+Math.round(5*m));hap(2);return `${p.first} huilt, maar valt in je armen in slaap.`})}
  if(a>=1&&a<=4){A('🧩','Spelen',()=>{const m=use('kspel'+p.id);p.rel=clamp(p.rel+Math.round(5*m));if(m>0)p.smarts=clamp(p.smarts+1);return pick([`Jullie bouwen een toren van blokken. ${p.first} gooit hem om en lacht.`,`Verstoppertje. ${p.first} verstopt zich steeds achter hetzelfde gordijn.`,`Jullie maken een tekening. Het is een paard, zegt ${p.first}.`])});
    row(s,{ic:'🏫',t:p.opv?'Van de opvang halen':'Naar de opvang',s:p.opv?`Gaat nu naar de opvang · ${fmt(opvCost())} per jaar`:`Spelen met andere kinderen · ${fmt(opvCost())} per jaar`,dots:true,on:()=>{p.opv=p.opv?0:1;toast(p.opv?`${p.first} gaat naar de opvang`:`${p.first} blijft thuis`);refreshSheet()}})}
  if(a>=6&&a<=17&&p.gr!=null)row(s,{ic:'📒',t:'Rapport bekijken',s:S.acts['rap'+p.id]?'Dit jaar al besproken':`Gemiddeld een ${nl1(p.gr)}${p.lf&&p.lf.lvl?' · '+lvlN(p.lf.lvl):''}`,dis:!!S.acts['rap'+p.id],dots:true,on:()=>rapport(p)});
  if(a>=4&&a<=17)A('🏫','Naar de ouderavond',()=>{S.acts['oa'+p.id]=1;p.disc=clamp((p.disc??50)+2);p.rel=clamp(p.rel+2);const g=p.gr||6.5;return `De ${a<12?'juf':'mentor'} vertelt dat ${p.first} ${g>=7?'goed meedoet en behulpzaam is':g<5.5?'moeite heeft met opletten':'het prima doet, maar meer kan'}. ${pick(['Je krijgt koffie uit een plastic bekertje.','Er hangen tekeningen aan de muur.','Je zit op een veel te klein stoeltje.'])}`},{dis:!!S.acts['oa'+p.id],s:S.acts['oa'+p.id]?'Dit jaar al geweest':'Hoor hoe het echt gaat'});
  if(a>=5&&a<=17)row(s,{ic:p.club?CLB[p.club][0]:'🏅',t:p.club?`Club: ${CLB[p.club][1]}`:'Een club kiezen',s:p.club?'Tik om te wisselen of te stoppen':`Sport, muziek, scouting · ${fmt(kidCost())} per jaar`,dots:true,on:()=>clubMenu(p)});
  if(a>=12&&a<=17)row(s,{ic:'🏠',t:'Huisregels',s:`${HR[p.hr||'normaal'][0]}: ${HR[p.hr||'normaal'][1].toLowerCase()}`,dots:true,on:()=>rulesMenu(p)});
  if(a>=13&&a<=17&&p.lf&&p.lf.ps)A('💬','Praten over de liefde',()=>{use('liefde'+p.id);const ok=chance(p.rel/110);p.rel=clamp(p.rel+(ok?5:-2));return ok?`${p.first} vertelt over ${p.lf.ps.n}. Met rode wangen, maar toch.`:`"Mam/pap, dat gaat je echt niks aan." De deur gaat dicht.`.replace('Mam/pap',S.p.g==='v'?'Mam':'Pap')});
  if(a>=16&&a<=19&&!p.rij){const k=Math.round(2500*cp);A('🚗','Rijlessen betalen',()=>{cash(-k);p.rij=1;p.rel=clamp(p.rel+6);memAdd(p,'rijles+');lfLog(p,'Haalde het rijbewijs');return `Je betaalt de rijlessen (${fmt(k)}). ${p.first} slaagt ${chance(.6)?'in één keer':'de tweede keer'}!`},{dis:S.money<k,s:`${fmt(k)} voor lessen en examen`})}
  if(a>=23&&!p.huis){const k=Math.round(clamp(S.money*.1,5000*cp,40000*cp));A('🏡','Helpen met een eerste huis',()=>{cash(-k);p.money=(p.money||0)+k;p.huis=1;p.rel=clamp(p.rel+10);memAdd(p,'huis+');lfLog(p,'Kocht een eerste huis');return `Je geeft ${p.first} ${fmt(k)} voor de aanbetaling. ${cap(f8Hij(p.g))} koopt een ${pick(['appartement','rijtjeshuis','benedenwoning'])}.`},{dis:S.money<k*1.5,s:`${fmt(k)} schenken voor de aanbetaling`})}
  const gk=living('kleinkind').filter(k=>k.par===p.id&&pAge(k)<12);if(a>=18&&gk.length)A('🧸','Oppassen op de kleinkinderen',()=>{S.acts['opp'+p.id]=1;p.rel=clamp(p.rel+6);for(const k of gk)k.rel=clamp(k.rel+6);hap(3);hea(-1);memAdd(p,'oppas+');return `Een weekend met ${f8List(gk.map(k=>k.first))}. Uitgeput, maar gelukkig.`},{dis:!!S.acts['opp'+p.id],s:S.acts['opp'+p.id]?'Dit jaar al gedaan':`${f8List(gk.map(k=>k.first))}`})});

// ---------- 9.6 partner ----------
const HH={eerlijk:['⚖️','Eerlijk verdelen'],ik:['🙋','Jij doet het meeste'],jij:['🛋️',`Je partner doet het meeste`]};
function kwOf(p){if(p.kw==null){const kt=ktOf(p);p.kw=chance(kt==='Lief'||kt==='Zorgzaam'?.8:kt==='Ambitieus'||kt==='Avontuurlijk'?.45:.65)?1:0}return p.kw}
function decide(p){const cp=S.cpi||1;const done=k=>!!S.acts['bs'+k];
  modal({title:'Samen beslissen',em:'🗳️',cat:roleLabel(p),person:p,text:`Waar wil je het met ${p.first} over hebben?`,choices:opts([
    {t:'🏡 Verhuizen naar een andere stad',s:done('vh')?'Dit jaar al besproken':S.home.k==='eigen'?'Verkoop eerst je huis':`Verhuiskosten ${fmt(Math.round(3000*cp))}`,dis:done('vh')||S.home.k==='eigen'||S.money<3000*cp||inJail(),on:()=>{closeModal();const cs=COUNTRIES[S.p.country].cities.filter(c=>c!==S.p.city).sort(()=>R()-.5).slice(0,3);
      modal({title:'Waarheen?',em:'🏡',cat:p.first,person:p,text:`${p.first} wil ${pick(['wel eens iets anders','dichter bij familie wonen','meer ruimte','een nieuwe start'])}. Waar gaan jullie wonen?`,choices:opts(cs.map(c=>({t:c,on:()=>{closeModal();doAct('Verhuizen',()=>{S.acts.bsvh=1;cash(-Math.round(3000*cp));const old=S.p.city;S.p.city=c;p.rel=clamp(p.rel+(ktOf(p)==='Avontuurlijk'?7:4));hap(3);MS(`Verhuisde naar ${c}`,1);return `Jullie verhuizen van ${old} naar ${c}. Dozen, dozen en nog eens dozen.`},true,'🏡')}})))})}},
    {t:'👶 Kinderwens bespreken',s:done('kw')?'Dit jaar al besproken':p.kwK?`${p.first} ${kwOf(p)?'wil graag kinderen':'wil geen kinderen'}`:'Wil je partner kinderen?',dis:done('kw'),on:()=>{closeModal();doAct('Kinderwens',()=>{S.acts.bskw=1;const w=kwOf(p);p.kwK=1;const have=living('kind').length;
      if(w){p.rel=clamp(p.rel+3);return have?`${p.first} zou ${pick(['nog wel een kindje','er nog eentje bij'])} willen. Jullie lachen erom.`:`${p.first} wil graag kinderen met je. Bij ${hem(p.g)} staat "Kind proberen te krijgen" klaar.`}
      p.rel=clamp(p.rel-(have?0:4));return have?`${p.first} vindt het zo goed, zegt ${f8Hij(p.g)}. Genoeg luiers gezien.`:`${p.first} wil eigenlijk geen kinderen. Een lastig gesprek.`},true,'👶')}},
    {t:'🧹 Het huishouden verdelen',s:done('hh')?'Dit jaar al besproken':`Nu: ${HH[p.hh||'eerlijk'][1].toLowerCase()}`,dis:done('hh'),on:()=>{closeModal();modal({title:'Het huishouden',em:'🧹',cat:p.first,person:p,text:'Wie doet de afwas, de was en de boodschappen?',choices:opts(Object.entries(HH).map(([k,[e,n]])=>({t:`${e} ${n}`,on:()=>{closeModal();doAct('Huishouden',()=>{S.acts.bshh=1;p.hh=k;return k==='eerlijk'?'Jullie maken een schema voor op de koelkast.':k==='ik'?`Jij neemt het meeste op je. ${p.first} is blij.`:`${p.first} doet voortaan het meeste. ${cap(f8Hij(p.g))} zegt er nog niks van.`},true,e)}})))})}}])})}
F8.person.push((el,p)=>{if(p.role!=='partner'||!p.alive||inJail())return;const s=sec(el,'💑 Samen');
  row(s,{ic:'🗳️',t:'Samen beslissen',s:'Verhuizen, kinderwens, huishouden',dots:true,on:()=>decide(p)});
  if(p.st==='getrouwd'&&p.wy)row(s,{ic:'💍',t:`${year()-p.wy} jaar getrouwd`,s:`Sinds ${p.wy}`})});
function partnerYear(){const p=partner();if(!p)return;
  if(p.hh==='eerlijk')p.rel=clamp(p.rel+1);else if(p.hh==='ik'){p.rel=clamp(p.rel+1);hap(-1)}else if(p.hh==='jij'){p.rel=clamp(p.rel-2)}}

// ---------- 9.7 vrienden ----------
const GRPN={basis:'Vrienden van de basisschool',middel:'Vrienden van de middelbare school',studie:'Studievrienden',werk:'Vrienden van je werk',buurt:'Vrienden uit de buurt',oud:'Oude vrienden'};
addFriend=(f=>function(){const p=f.apply(this,arguments);if(p&&!p.grp){const a=ageY();p.grp=a<12?'basis':a<18?'middel':S.edu&&S.edu.cur?'studie':S.job?'werk':'buurt'}return p})(addFriend);
function f9FriendRows(el){const fr=living('vriend').filter(p=>!p.gone);const by={};for(const p of fr){const g=p.grp||'oud';(by[g]=by[g]||[]).push(p)}
  const gs=Object.entries(by).filter(([,ps])=>ps.length>=2);if(!gs.length||inJail())return;const s=sec(el,'👯 Vriendengroepen');
  for(const [g,ps] of gs){const k='grp'+g;row(s,{ic:'👯',t:GRPN[g]||'Vrienden',s:S.acts[k]?'Dit jaar al afgesproken':`Afspreken met ${f8List(ps.map(p=>p.first))}`,dis:!!S.acts[k]||ageY()<6,on:()=>doAct('Vriendengroep',()=>{S.acts[k]=1;const c=Math.round((ageY()<16?10:45)*(S.cpi||1));cash(-c);for(const p of ps){p.rel=clamp(p.rel+ri(4,8));if(chance(.3))memAdd(p,'groep+')}hap(4);
      return pick([`Jullie gaan ${ageY()<16?'naar het zwembad':'eten bij de Griek'} en praten tot sluitingstijd.`,`Een avond spelletjes met ${f8List(ps.map(p=>p.first))}. Er wordt vals gespeeld.`,`Jullie halen herinneringen op. ${pick(ps).first} vertelt voor de honderdste keer hetzelfde verhaal.`])},true,'👯')})}}
function friendsYear(){for(const p of living('vriend')){if(S.bff===p.id||p.gone)continue;const met=Object.keys(S.lastActs||{}).some(k=>k.endsWith(p.id));
  if(p.rel<12&&!met&&chance(.35)){S.oldF=S.oldF||[];S.oldF.push({first:p.first,last:p.last,g:p.g,grp:p.grp||'oud',born:p.born,ap:p.ap,kt:p.kt});if(S.oldF.length>10)S.oldF.shift();S.rel=S.rel.filter(x=>x!==p);L(`Je bent uit beeld geraakt met ${p.first}. Jullie spreken elkaar niet meer.`,'sys')}}
  if(S.bff&&!P(S.bff)?.alive)S.bff=null}

// ---------- 9.8 grote familiemomenten (hooguit één per jaar) ----------
const fmFree=()=>S.fmY!==year();
const fmTake=()=>{S.fmY=year()};
// de bruiloft van iemand uit je leven (aangeroepen vanuit het leven van die persoon, fase 9.3)
function f9Wedding(p){const n=(p.lf&&p.lf.ps&&p.lf.ps.n)||'de liefde van '+f8Zijn(p.g)+' leven';if(inJail())return;
  if(p.role==='kind'&&fmFree()){fmTake();Q.push({id:'f9_trouwkind',c:{id:p.id}});return}
  if(['kind','broer','zus','kleinkind','moeder','vader'].includes(p.role)||p.rel>=45)ibAdd(p,'bruil',n);
  if(isClose(p))L(`💒 ${Who(p)} gaat trouwen met ${n}!`,'good')}
const psN=c=>{const p=P(c.id);return (p&&p.lf&&p.lf.ps&&p.lf.ps.n)||'de liefde van haar leven'};
E('f9_trouwkind',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive&&!inJail(),t:'De bruiloft van je kind',x:c=>`${Who(P(c.id))} trouwt met ${psN(c)}! Het wordt een groot feest met ${ri(60,180)} gasten.`,ch:[
 ['💶 Meebetalen aan de bruiloft',c=>{const p=P(c.id);const k=Math.round(8000*(S.cpi||1));cash(-k);p.rel=clamp(p.rel+12);hap(6);memAdd(p,'bijdr+');return `Je betaalt ${fmt(k)} mee. ${p.first} omhelst je: "Dit vergeet ik nooit."`},()=>S.money>=8000*(S.cpi||1)],
 ['🎤 Een speech houden',c=>{const p=P(c.id);if(chance(.45+(S.sk.sociaal||0)/200)){p.rel=clamp(p.rel+10);hap(7);memAdd(p,'speech+');return `Je vertelt over de eerste stapjes van ${p.first}, de puberteit en de dag dat ${f8Hij(p.g)} ${psN(c)} mee naar huis nam. Niemand houdt het droog.`}
   p.rel=clamp(p.rel-2);hap(-3);memAdd(p,'speech-');return `Je bent je papiertje kwijt en vertelt een gênant verhaal over een ex. Het wordt heel stil in de zaal.`}],
 ['🥂 Genieten als gast',c=>{const p=P(c.id);p.rel=clamp(p.rel+6);hap(5);memAdd(p,'bruil+');return 'Je danst, je huilt een beetje en je eet veel te veel taart.'}],
 ['🙅 Niet gaan',c=>{const p=P(c.id);p.rel=clamp(p.rel-25);hap(-4);memAdd(p,'bruil-');return `Je komt niet. ${p.first} zal het je lang kwalijk nemen.`}]]});
// het familiediner: gezellig, of ruzie met de dwarsligger van de familie
E('f9_diner',{sys:1,need:c=>!!P(c.id)&&P(c.id).alive&&!inJail(),t:'Het familiediner',x:c=>{const p=P(c.id);return `De hele familie schuift aan. Bij het toetje begint ${who(p)} over ${c.w}. Iedereen kijkt naar jou.`},ch:[
 ['🍷 Het gezellig houden',c=>{const fam=living(['moeder','vader','broer','zus','kind','partner','opa','oma']).filter(x=>!abroad(x));for(const x of fam)x.rel=clamp(x.rel+2);const p=P(c.id);memAdd(p,'diner+');hap(2);return 'Je verandert handig van onderwerp. Het wordt nog een gezellige avond.'}],
 ['🗣️ De discussie aangaan',c=>{const p=P(c.id);if(chance(.4)){p.rel=clamp(p.rel+3);kar(1);return `Je blijft rustig en hebt goede argumenten. ${p.first} geeft je zowaar gelijk.`}p.rel=clamp(p.rel-10);hap(-3);memAdd(p,'diner-');return `Het loopt uit de hand. ${p.first} staat op en vertrekt zonder koffie.`}],
 ['🚪 Vroeg naar huis',c=>{const p=P(c.id);p.rel=clamp(p.rel-3);hap(-1);return 'Je zegt dat je morgen vroeg op moet. Niemand gelooft het.'}]]});
const DINW=['politiek','geld','de erfenis van opa','jouw baan','opvoeding','het klimaat','wie er de vorige keer had moeten afwassen'];
E('f9_jubileum',{sys:1,need:c=>!!partner()&&partner().st==='getrouwd'&&!inJail(),t:'Jullie trouwdag',x:c=>`${partner().first} en jij zijn vandaag ${c.n} jaar getrouwd.`,ch:[
 ['🎉 Een groot feest geven',c=>{const p=partner();const k=Math.round(5000*(S.cpi||1));cash(-k);p.rel=clamp(p.rel+10);hap(6);memAdd(p,'jub+',c.n);for(const x of living(['kind','moeder','vader','broer','zus','vriend']).filter(x=>!abroad(x)))x.rel=clamp(x.rel+2);return `Een feest met familie en vrienden (${fmt(k)}). De kinderen houden een speech.`},()=>S.money>=5000*(S.cpi||1)],
 ['🍽️ Samen uit eten',c=>{const p=partner();const k=Math.round(180*(S.cpi||1));cash(-k);p.rel=clamp(p.rel+6);hap(3);memAdd(p,'jub+',c.n);return `Een etentje in het restaurant van jullie eerste date (${fmt(k)}).`}],
 ['🛋️ Er niet veel van maken',c=>{const p=partner();if(chance(.5)){p.rel=clamp(p.rel-1);return 'Een avond op de bank met afhaalchinees. Ook goed.'}p.rel=clamp(p.rel-9);memAdd(p,'jub-',c.n);hap(-2);return `${p.first} had meer verwacht. De sfeer is ijzig.`}]]});
E('f9_ouders40',{sys:1,need:()=>living(['moeder','vader']).length===2&&!inJail(),t:'Robijnen bruiloft',x:()=>`${living('moeder')[0].first} en ${living('vader')[0].first} zijn 40 jaar getrouwd.`,ch:[
 ['🎉 Een feest organiseren',()=>{const k=Math.round(2500*(S.cpi||1));cash(-k);for(const p of living(['moeder','vader'])){p.rel=clamp(p.rel+12);memAdd(p,'feest+')}for(const p of living(['broer','zus']))p.rel=clamp(p.rel+3);hap(5);return `Je regelt een zaal, een band en een fotoshow (${fmt(k)}). Je ${S.p.g==='v'?'vader':'moeder'} pinkt een traantje weg.`},()=>S.money>=2500*(S.cpi||1)],
 ['🎁 Een cadeau geven',()=>{const k=Math.round(300*(S.cpi||1));cash(-k);for(const p of living(['moeder','vader']))p.rel=clamp(p.rel+6);hap(2);return `Je geeft ze een weekendje weg (${fmt(k)}).`}],
 ['☕ Even langsgaan',()=>{for(const p of living(['moeder','vader']))p.rel=clamp(p.rel+2);return 'Je drinkt koffie met taart. Ze zijn blij dat je er bent.'}]]});
E('f9_reunie',{sys:1,need:()=>(S.oldF||[]).length>0&&!inJail(),t:'Reünie',x:c=>`Er is een reünie van je ${(GRPN[c.g]||'oude vrienden').toLowerCase().replace(/^vrienden van /,'')}. Misschien zie je oude vrienden terug.`,ch:[
 ['🎓 Gaan',c=>{const pool=(S.oldF||[]).filter(o=>o.grp===c.g);const o=pick(pool.length?pool:S.oldF);S.oldF=S.oldF.filter(x=>x!==o);const p=mkPerson('vriend',o.g,o.born,{first:o.first,last:o.last,ap:o.ap,kt:o.kt,rel:ri(50,65)});p.grp=o.grp;S.rel.push(p);memAdd(p,'reunie+');hap(4);return `Je ziet ${o.first} na jaren terug. Het voelt alsof jullie elkaar gisteren nog spraken. Jullie zijn weer vrienden.`}],
 ['🙅 Niet gaan',()=>'Je kijkt de foto\'s later online. Iedereen is grijs geworden.']]});
E('f9_ptvreemd',{sys:1,need:c=>!!partner()&&!inJail(),t:'Een affaire',x:c=>`Je ontdekt dat ${partner().first} een affaire heeft met ${c.n}.`,ch:[
 ['💬 Praten en nog een kans geven',c=>{const p=partner();if(chance(.55)){p.rel=clamp(p.rel-8);hap(-6);return `${p.first} huilt en zegt dat het voorbij is. Jullie gaan in relatietherapie. Het vertrouwen moet terugkomen.`}hap(-8);breakUp();return `Het gesprek maakt alles duidelijk: ${p.first} kiest voor ${c.n}.`}],
 ['💔 Het uitmaken',c=>{const p=partner();hap(-8);breakUp();return `Je pakt een tas in voor ${p.first}. Het is voorbij.`}],
 ['🤐 Doen alsof je niets weet',c=>{const p=partner();hap(-10);p.rel=clamp(p.rel-5);return 'Je zegt niets. Het knaagt elke dag.'}]]});
const DROOM={emigreren:p=>`${p.first} wil al jaren in het buitenland wonen en vraagt of je mee wilt`,zaak:p=>`${p.first} wil ${f8Zijn(p.g)} baan opzeggen en een eigen zaak beginnen. Daar is ${fmt(Math.round(15000*(S.cpi||1)))} van jullie spaargeld voor nodig`,studie:p=>`${p.first} wil op ${f8Zijn(p.g)} leeftijd nog gaan studeren. Dat betekent een paar jaar minder geld`};
E('f9_ptdroom',{sys:1,need:()=>!!partner()&&!inJail(),t:'Een grote droom',x:c=>DROOM[c.k](partner())+'.',ch:[
 ['🌠 Steunen',c=>{const p=partner();memAdd(p,'droom+');p.rel=clamp(p.rel+10);
   if(c.k==='emigreren'){const to=c.cc;emigrate(to);hap(4);MS(`Verhuisde met ${p.first} naar ${landN(to)}`,2);return `Jullie verkopen alles en vertrekken naar ${landN(to)}. Een nieuw avontuur.`}
   if(c.k==='zaak'){const k=Math.round(15000*(S.cpi||1));cash(-k);if(chance(.55)){p.inc=Math.round((partnerInc(p)||30000)*1.4/(S.cpi||1));p.job='ondernemer';lfLog(p,'Begon een eigen zaak');return `${p.first} begint een eigen zaak. Na een zwaar eerste jaar loopt het goed!`}p.job='';p.inc=0;lfLog(p,'Begon een eigen zaak, maar die ging failliet');return `${p.first} begint een eigen zaak. Na een jaar gaat het mis: het geld is weg.`}
   p.job='student';p.inc=0;const x=lf(p);x.st=pick(STUDIES).t;x.end=pAge(p)+3;x.done=0;lfLog(p,`Begon aan een studie ${x.st.toLowerCase()}`);return `${p.first} gaat ${x.st.toLowerCase()} studeren. Jullie leven een paar jaar zuinig.`},c=>c.k!=='zaak'||S.money>=15000*(S.cpi||1)],
 ['🙅 Liever niet',c=>{const p=partner();memAdd(p,'droom-');p.rel=clamp(p.rel-10);hap(-2);return `${p.first} legt zich erbij neer. Voorlopig.`}]]});
Object.assign(EVMETA,{f9_trouwkind:['Familie','💒'],f9_diner:['Familie','🍽️'],f9_jubileum:['Liefde','💍'],f9_ouders40:['Familie','🎉'],f9_reunie:['Vrienden','🎓'],f9_ptvreemd:['Liefde','💔'],f9_ptdroom:['Liefde','🌠']});
function momentsYear(){if(!fmFree()||inJail()||!S.alive)return;const a=ageY(),pt=partner();const c=[];
  if(pt&&pt.st==='getrouwd'&&pt.wy){const n=year()-pt.wy;if([5,10,25,40,50,60].includes(n))c.push(['f9_jubileum',{n},1])}
  const mom=living('moeder')[0],dad=living('vader')[0];if(mom&&dad&&!S.flags.oudersSch&&!S.flags.p9o40&&a>=16&&pAge(mom)>=62&&pAge(mom)<=68&&chance(.35)){S.flags.p9o40=1;c.push(['f9_ouders40',{},.9])}
  if((S.oldF||[]).length&&a>=30&&a%10===5&&chance(.6))c.push(['f9_reunie',{g:pick(S.oldF).grp},.7]);
  if(pt&&a>=20&&chance(.006+(pt.rel<50?.025:0)+(ktOf(pt)==='Avontuurlijk'?.004:0)))c.push(['f9_ptvreemd',{n:f8Name(pref2(pt))},.8]);
  if(pt&&pt.live&&a>=25&&a<=65&&pt.since!=null&&a-pt.since>=3&&chance(.012)){const k=pick(['emigreren','zaak','studie']);c.push(['f9_ptdroom',{k,cc:pick(Object.keys(COUNTRIES).filter(x=>x!==S.p.country))},.6])}
  const fam=living(['moeder','vader','broer','zus','kind','opa','oma','oom','tante']).filter(p=>pAge(p)>=16&&!abroad(p));
  if(fam.length>=3&&a>=14&&chance(.035)){const dw=fam.filter(p=>['Chagrijnig','Eigenwijs','Jaloers'].includes(ktOf(p)));c.push(['f9_diner',{id:pick(dw.length?dw:fam).id,w:pick(DINW)},.5])}
  if(!c.length)return;c.sort((x,y)=>y[2]-x[2]);const [id,ctx]=c[0];fmTake();Q.push({id,c:ctx})}
const pref2=pt=>pt.g==='v'?(chance(.9)?'m':'v'):(chance(.9)?'v':'m');

// minder dubbel: deze willekeurige gebeurtenissen komen nu vooral uit het leven van de mensen zelf
for(const [id,w] of [['bruiloft',.35],['r_verhuizen',.35],['lenen',.4],['reunie',.3],['r_ouderziek',.4]])if(EV[id])EV[id].w=w;

F8.year.push(()=>{if(!S.alive)return;kidSchool();partnerYear();friendsYear();momentsYear()});

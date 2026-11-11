/* ================= GEZONDHEID: ziektes, specialisten, therapie, verslaving ================= */
// naam: [ernst, dodelijk, specialist, kans op genezing per behandeling, chronisch, mentaal]
const ILLS={
 'migraine':[2,0,'neuroloog',.5],'een hernia':[3,0,'orthopeed',.6],'astma':[2,0,'longarts',.35,1],'een burn-out':[3,0,'psycholoog',.5,0,1],'de ziekte van Pfeiffer':[4,0,'huisarts',.7],
 'een depressie':[3,0,'psycholoog',.45,0,1],'een angststoornis':[2,0,'psycholoog',.5,0,1],'de ziekte van Lyme':[3,0,'huisarts',.65],'diabetes type 1':[3,0,'internist',0,1],'long covid':[3,0,'huisarts',.3],
 'een gebroken been':[3,0,'orthopeed',.85],'een longontsteking':[5,1,'longarts',.75],
 'diabetes':[4,0,'internist',.1,1],'hartfalen':[7,1,'cardioloog',.35],'artrose':[2,0,'orthopeed',.4,1],'COPD':[6,1,'longarts',.15,1],'hoge bloeddruk':[3,0,'cardioloog',.5],'kanker':[9,1,'oncoloog',.4],
 'Alzheimer':[6,1,'neuroloog',0,1],'Parkinson':[5,0,'neuroloog',.05,1],'staar':[1,0,'oogarts',.9],'een hartinfarct':[8,1,'cardioloog',.55]};
const SPEC={huisarts:['🩺','Huisarts',60],internist:['🧪','Internist',900],neuroloog:['🧠','Neuroloog',1100],orthopeed:['🦴','Orthopeed',1000],longarts:['🫁','Longarts',1000],cardioloog:['❤️','Cardioloog',1400],oncoloog:['🎗️','Oncoloog',2500],oogarts:['👁️','Oogarts',800],psycholoog:['🛋️','Psycholoog',110],dermatoloog:['🧴','Dermatoloog',700]};
const ILLY=['migraine','een hernia','astma','een burn-out','de ziekte van Pfeiffer','een depressie','een angststoornis','de ziekte van Lyme','diabetes type 1','long covid','een longontsteking'];
const ILLO=['diabetes','hartfalen','artrose','COPD','hoge bloeddruk','kanker','Alzheimer','Parkinson','staar','een hartinfarct','een longontsteking'];
const illInfo=il=>{const d=ILLS[il.n]||[il.sev,il.l,'huisarts',.4];return {sev:il.sev??d[0],l:il.l??d[1],sp:d[2],cure:d[3],chron:!!d[4],ment:!!d[5]}};
function illYear(a){
  for(const il of S.ill.slice()){const I=illInfo(il);if(!I.l&&!I.chron&&chance(I.ment?(S.flags.ther?.35:.15):.3)){S.ill=S.ill.filter(x=>x!==il);L(`Je bent hersteld van ${il.n}.`,'good');hap(5)}}
  S.flags.ther=0;
  if(S.ill.length<2&&chance((a>55?.09:a>35?.045:.02)*(S.st.health>70?.6:S.st.health<35?1.4:1)*(addLvl('roken')>=50||addLvl('alcohol')>=50?1.4:1))){
    const pool=(a>55?ILLO:a>35?ILLY.concat(['hoge bloeddruk','diabetes','kanker']):ILLY).filter(n=>!S.ill.some(i=>i.n===n)&&(n!=='Alzheimer'||a>=65));const n=pick(pool);const d=ILLS[n];S.ill.push({n,sev:d[0],l:d[1]});L(`De dokter stelt vast dat je ${n} hebt.`,'bad');hap(-6)}}
// eigen risico in Nederland, elders betaal je de volle prijs
function medCost(k){const cp=S.cpi||1;if(ageY()<18)return 0;if(S.p.country==='NL'){const E=S.er&&S.er.y===year()?S.er:(S.er={y:year(),used:0});return Math.round(Math.max(0,Math.min(k*cp,385*cp-E.used)))}return Math.round(k*cp)}
function payMed(k){const c=medCost(k);cash(-c);if(S.p.country==='NL'&&c>0){if(!S.er||S.er.y!==year())S.er={y:year(),used:0};S.er.used+=c}return c}
function treat(il,sp,o={}){const I=illInfo(il);let p=I.cure*(sp===I.sp?1:sp==='huisarts'?.35:.15)+(il.ref?.15:0)+(o.bonus||0);if(I.chron&&I.cure<.1)p=0;
  if(chance(p)){S.ill=S.ill.filter(x=>x!==il);hea(10);hap(6);return `${o.what||'De behandeling'} werkt. Je bent genezen van ${il.n}!`}
  if(I.chron&&sp===I.sp){il.sev=Math.max(1,il.sev-1);hea(4);return `${il.n} is niet te genezen, maar met de juiste medicijnen gaat het een stuk beter.`}
  if(sp==='huisarts'&&I.sp!=='huisarts'){il.ref=1;return `De huisarts verwijst je door naar de ${SPEC[I.sp][1].toLowerCase()}.`}
  il.sev=Math.max(1,il.sev-1);return `${o.what||'De behandeling'} helpt een beetje, maar je bent nog niet beter.`}
function sheetDoctor(el){const a=ageY();
  card(el,`<h3>👨‍⚕️ Gezondheid</h3>${kv([['Gezondheid',Math.round(S.st.health)+'%'],['Klachten',S.ill.length?S.ill.map(i=>i.n).join(', '):'Geen'],...(S.p.country==='NL'&&a>=18?[['Eigen risico dit jaar',`${fmt(S.er&&S.er.y===year()?S.er.used:0)} van ${fmt(385*(S.cpi||1))}`]]:[])])}`);
  if(S.ill.length){const k=sec(el,'Je klachten');for(const il of S.ill){const I=illInfo(il);row(k,{ic:I.l?'⚠️':I.ment?'🧠':'🤒',t:cap(il.n),s:`${I.l?'Ernstig · ':''}${I.chron?'Chronisch · ':''}behandeld door de ${SPEC[I.sp][1].toLowerCase()}${il.ref?' · je hebt een verwijzing':''}`,dots:true,on:()=>illMenu(il)})}}
  const s=sec(el,'Naar de dokter');
  for(const [k,[ic,t,pr]] of Object.entries(SPEC)){if(k==='psycholoog')continue;const c=medCost(pr);row(s,{ic,t,s:c?fmt(c):'Gratis'+(S.p.country==='NL'&&a>=18&&pr>60?' (eigen risico al op)':''),dis:S.money<c,dots:true,on:()=>doAct(t,()=>{payMed(pr);use('dok');if(!S.ill.length){hea(2);return pick(['Je bent kerngezond.','Alles ziet er prima uit.','Een routinecheck. Niets aan de hand.'])}const il=S.ill.find(i=>illInfo(i).sp===k)||S.ill[0];return treat(il,k,{what:`De ${t.toLowerCase()}`})},true,ic)})}
  const o=sec(el,'Overig');
  row(o,{ic:'🦷',t:'Tandarts',s:fmt(a<18?0:Math.round(80*(S.cpi||1))),on:()=>doAct('Tandarts',()=>{if(a>=18)cash(-Math.round(80*(S.cpi||1)));use('tand');loo(1);return chance(.7)?'Geen gaatjes!':'Eén klein gaatje. Even doorbijten.'},true,'🦷')});
  row(o,{ic:'🌿',t:'Alternatieve genezer',s:fmt(250*(S.cpi||1))+' · kruiden en goede bedoelingen',dis:S.money<250,on:()=>doAct('Genezer',()=>{cash(-Math.round(250*(S.cpi||1)));if(S.ill.length&&chance(.08)){const il=S.ill[0];S.ill.shift();return `Wonder boven wonder: je ${il.n} verdwijnt.`}hap(1);return 'Het ruikt lekker, maar je voelt geen verschil.'},true,'🌿')});
  row(o,{ic:'🧪',t:'Check-up',s:'Laat je helemaal nakijken',on:()=>doAct('Check-up',()=>{payMed(250);use('check');hea(3);if(chance(.15)&&a>=30){const n=pick(a>55?['hoge bloeddruk','diabetes','staar']:['hoge bloeddruk','astma']);if(!S.ill.some(i=>i.n===n)){S.ill.push({n,sev:ILLS[n][0],l:ILLS[n][1],ref:1});return `Goed dat je kwam: ze ontdekken ${n}. Je krijgt meteen een verwijzing.`}}return 'Alles ziet er goed uit.'},true,'🧪')})}
function illMenu(il){const I=illInfo(il),S_=SPEC[I.sp];const cp=S.cpi||1;
  modal({title:cap(il.n),em:I.ment?'🧠':'🤒',cat:'Gezondheid',text:`${I.l?'Dit is ernstig. ':''}${I.chron?'Dit gaat niet vanzelf over. ':''}De juiste specialist is de ${S_[1].toLowerCase()}.`,choices:opts([
    {t:`Naar de ${S_[1].toLowerCase()}`,s:fmt(medCost(S_[2])),ic:S_[0],dis:S.money<medCost(S_[2]),on:()=>{closeModal();doAct(S_[1],()=>{payMed(S_[2]);return treat(il,I.sp,{what:`De ${S_[1].toLowerCase()}`})},true,S_[0])}},
    ...(['orthopeed','cardioloog','oncoloog','oogarts','longarts'].includes(I.sp)&&!I.ment?[{t:'Operatie in het ziekenhuis',s:`${fmt(medCost(8000))} · grotere kans, maar zwaar`,ic:'🏥',dis:S.money<medCost(8000),on:()=>{closeModal();doAct('Operatie',()=>{payMed(8000);hea(-ri(5,12));if(chance(.04)){hea(-25);return 'Er gaat iets mis tijdens de operatie. Je moet lang herstellen.'}return treat(il,I.sp,{bonus:.25,what:'De operatie'})},true,'🏥')}}]:[]),
    ...(I.l?[{t:'Experimentele behandeling in het buitenland',s:`${fmt(80000*cp)} · niet vergoed`,ic:'✈️',dis:S.money<80000*cp,on:()=>{closeModal();doAct('Kliniek',()=>{cash(-Math.round(80000*cp));return treat(il,I.sp,{bonus:.3,what:'De experimentele behandeling'})},true,'✈️')}}]:[])])})}
// ---- therapie ----
function sheetTherapy(el){const a=ageY();const ment=S.ill.filter(i=>illInfo(i).ment);
  card(el,`<h3>🛋️ Therapie</h3><span class="muted">${ment.length?`Je hebt ${ment.map(i=>i.n).join(' en ')}. Therapie helpt je sneller herstellen.`:'Ook zonder klachten kan praten helpen: beter in je vel en minder kans op terugval bij een verslaving.'}</span>`);
  const s=sec(el,'');
  row(s,{ic:'🛋️',t:'Psycholoog',s:fmt(medCost(110))+' per sessie',dis:a<8||S.money<medCost(110),on:()=>doAct('Therapie',()=>{payMed(110);const m=use('ther');hap(Math.round(ri(3,7)*m));S.flags.ther=1;for(const k in (S.add||{}))if(S.add[k]>0)S.add[k]=Math.max(0,S.add[k]-Math.round(4*m));const il=ment[0];if(il&&chance(.3*m))return treat(il,'psycholoog',{bonus:.1,what:'De therapie'});return pick(['Je praat een uur over je jeugd. Je voelt je lichter.','Je leert een nieuwe manier om met stress om te gaan.','Je psycholoog stelt precies de goede vraag.'])},true,'🛋️')});
  const pt=partner();row(s,{ic:'💞',t:'Relatietherapie',s:pt?`Met ${pt.first} · ${fmt(150*(S.cpi||1))}`:'Je hebt geen partner',dis:!pt||a<18,on:()=>doAct('Relatietherapie',()=>{cash(-Math.round(150*(S.cpi||1)));const m=use('rther');pt.rel=clamp(pt.rel+Math.round(ri(5,12)*m));return `Jij en ${pt.first} leren beter naar elkaar te luisteren.`},true,'💞')});
  row(s,{ic:'🧘',t:'Mindfulnesstraining',s:fmt(60*(S.cpi||1)),dis:a<12,on:()=>doAct('Mindfulness',()=>{if(a>=18)cash(-Math.round(60*(S.cpi||1)));const m=use('mind');hap(Math.round(3*m));S.flags.ther=1;return 'Je ademt. Je bent hier. Het werkt beter dan je dacht.'},true,'🧘')})}
// ---- verslaving ----
const ADD={alcohol:['🍺','Alcohol'],roken:['🚬','Roken'],drugs:['💊','Drugs'],gokken:['🎰','Gokken']};
const addLvl=k=>(S.add&&S.add[k])||0;
function addUp(k,n){S.add=S.add||{};const was=addLvl(k);S.add[k]=clamp(was+n);if(was<50&&S.add[k]>=50){L(`Je bent verslaafd geraakt aan ${ADD[k][1].toLowerCase()}.`,'bad');MS(`Raakte verslaafd aan ${ADD[k][1].toLowerCase()}`,1)}}
function addYear(){if(!S.add)return;const cp=S.cpi||1;
  for(const [k,[em,n]] of Object.entries(ADD)){const v=addLvl(k);if(v<=0)continue;
    if(v>=50&&!inJail()){const cost={alcohol:1500,roken:1100,drugs:6000,gokken:0}[k]*cp;if(cost)cash(-cost);if(k==='gokken'){const l=Math.round(Math.min(Math.max(0,S.money)*.12,25000*cp));cash(-l);if(l>0)L(`Je gokverslaving kost je dit jaar ${fmt(l)}.`,'bad')}
      hea(-({alcohol:3,roken:2,drugs:6,gokken:0}[k]));hap(-2);const pt=partner();if(pt)pt.rel=clamp(pt.rel-3);if(k!=='gokken')L(`${em} Je ${k==='roken'?'rookt':k==='alcohol'?'drinkt':'gebruikt'} te veel. Het kost je ${fmt(cost)} en je gezondheid gaat achteruit.`,'bad');
      if(k==='drugs'&&chance(.06)){hea(-30);L('Je gaat op een avond knock-out en belandt op de spoedeisende hulp.','bad big')}
      if(chance(.25))Q.push({id:'h_hulp',c:{k}})}
    S.add[k]=Math.max(0,v-(v>=50?1:4))}}
E('h_hulp',{sys:1,need:c=>addLvl(c.k)>=50,t:'Iemand maakt zich zorgen',x:c=>{const p=partner()||living(['moeder','vader','vriend'])[0];return `${p?p.first:'Een vriend'} maakt zich zorgen om je ${ADD[c.k][1].toLowerCase()==='roken'?'roken':ADD[c.k][1].toLowerCase()==='gokken'?'gokken':ADD[c.k][1].toLowerCase()+'gebruik'} en vraagt of je hulp wilt zoeken.`},ch:[
 ['🙏 Ja, ik zoek hulp',c=>({go:()=>{afterModal=()=>openSheet('Afkicken',sheetRehab);processQ()}})],
 ['🙄 Er is niks aan de hand',c=>{const p=partner();if(p)p.rel=clamp(p.rel-6);return 'Je wuift het weg. De zorgen blijven.'}]]});
function sheetRehab(el){const any=Object.keys(ADD).filter(k=>addLvl(k)>0);const cp=S.cpi||1;
  card(el,`<h3>🌱 Afkicken</h3>${any.length?any.map(k=>`<div class="stat"><span>${ADD[k][0]} ${ADD[k][1]}</span><span></span><span class="v">${addLvl(k)>=50?'verslaafd':'gewoonte'}</span>${bar(addLvl(k),addLvl(k)>=50?'var(--bad)':'var(--warn)')}</div>`).join(''):'<span class="muted">Je bent nergens aan verslaafd. Goed bezig.</span>'}`);
  if(!any.length)return;const s=sec(el,'Hoe pak je het aan?');
  const stop=(k,p,txt)=>{if(chance(p)){S.add[k]=Math.min(addLvl(k),10);hap(6);hea(4);MS(`Kickte af van ${ADD[k][1].toLowerCase()}`,1);return txt}S.add[k]=Math.max(0,addLvl(k)-10);hap(-2);return 'Het lukt nog niet. Je valt terug, maar je bent wel dichterbij.'};
  for(const k of any){const [em,n]=ADD[k];
    row(s,{ic:'💪',t:`Zelf stoppen met ${n.toLowerCase()}`,s:'Kans hangt af van je discipline',dots:true,on:()=>doAct('Afkicken',()=>{use('stop'+k);return stop(k,.15+(S.disc??50)/300+(S.flags.ther?.1:0),`Het is je gelukt om te stoppen met ${n.toLowerCase()}!`)},true,'💪')});
    row(s,{ic:'🤝',t:`Zelfhulpgroep (${n.toLowerCase()})`,s:'Gratis · lotgenoten helpen elkaar',dots:true,on:()=>doAct('Zelfhulpgroep',()=>{use('zhg'+k);sk('sociaal',1);return stop(k,.35+(S.flags.ther?.1:0),'De groep sleept je erdoorheen. Je bent clean.')},true,'🤝')});
    row(s,{ic:'🏥',t:`Afkickkliniek (${n.toLowerCase()})`,s:`${fmt(medCost(15000))} · grootste kans`,dis:S.money<medCost(15000),dots:true,on:()=>doAct('Afkickkliniek',()=>{payMed(15000);if(S.job&&!S.job.part)(S.job&&(S.job.perf=clamp(S.job.perf-8)));return stop(k,.8,`Na zes weken in de kliniek kom je er als een ander mens uit.`)},true,'🏥')})}}
E('h_sigaret',{a:[13,19],w:.6,once:1,c:()=>addLvl('roken')<10,t:'Een sigaret?',x:'Een vriend biedt je achter de fietsenstalling een sigaret aan.',ch:[
 ['🚬 Er een opsteken',()=>{addUp('roken',25);hap(1);return 'Je hoest je longen eruit, maar je voelt je stoer.'}],
 ['🙅 Nee, dank je',()=>{kar(1);return 'Je loopt door. Goed zo.'}]]});

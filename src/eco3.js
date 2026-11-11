/* ================= WERELD & ECONOMIE (fase 3): begroting en staatsfinanciën ================= */
const BPOST=[['zorg','Zorg','🏥',1],['onderwijs','Onderwijs','🎓',.6],['defensie','Defensie','🛡️',.5],['sociaal','Sociale zekerheid','🤝',.9],['infra','Infrastructuur','🛣️',.5]];
const BLVL=['Flink bezuinigen','Bezuinigen','Gelijk houden','Meer geld','Veel meer geld'];
const RATES=[[60,'AAA',0],[80,'AA',.2],[100,'A',.5],[120,'BBB',1],[150,'BB',2],[999,'Junk',4]];
function budW(){const E_=ecoW();if(!E_.bud)E_.bud={zorg:2,onderwijs:2,defensie:2,sociaal:2,infra:2};if(E_.eduAcc==null)E_.eduAcc=0;return E_.bud}
const rating=d=>RATES.find(r=>d<r[0]);
const ratePrem=()=>S.eco?rating(S.eco.debt)[2]:0;
function budSpend(b){return BPOST.reduce((s,[k,,,w])=>s+(b[k]-2)*w,0)}
function budTax(){return -((lawIdx('ib')-2)*.7+(lawIdx('vpb')-2)*.4+(lawIdx('verm')-2)*.3+(lawIdx('aow')-2)*.35)}
function budInt(E_){return .9+E_.debt*(E_.r+ratePrem())/100*.5}
function setDefb(l){const W=polW();W.law=W.law||{};W.law.defb=clamp(l-1,0,2)}
const budMine=()=>{const P=S.pol;return !!(P&&(P.lvl==='dict'||P.lvl==='mp'||(P.lvl==='min'&&P.port==='Financiën')))};
const bijstandF=()=>S.eco&&S.eco.bud?1+(S.eco.bud.sociaal-2)*.08:1;
function budYear(E_){const b=budW(),sh=E_.sh;const y=year();
  b.defensie=clamp(lawIdx('defb')+1,0,4);
  // kabinet past de begroting aan als jij het niet bent
  if(!budMine()){const W=S.pw;let lr=50;if(W&&W.gov&&W.gov.length){const tot=seatSum(W.gov,W.seats)||1;lr=W.gov.reduce((s,g)=>s+(PTY(g)?PTY(g).lr*W.seats[g]/tot:0),0)}
    if(E_.debt>95){const k=pick(['zorg','sociaal','infra','onderwijs'].filter(k=>b[k]>0));if(k){b[k]--;ecoNews(`De staatsschuld is te hoog. Het kabinet bezuinigt op ${BPOST.find(p=>p[0]===k)[1].toLowerCase()}.`,1)}}
    else if(chance(.45)){const up=lr<45?pick(['sociaal','zorg','onderwijs']):lr>58?pick(['defensie','infra']):pick(['zorg','onderwijs','infra']);const dn=lr<45?null:lr>58?'sociaal':null;
      if(b[up]<4&&budSpend(b)<4){b[up]++;ecoNews(`Prinsjesdag: het kabinet trekt extra geld uit voor ${BPOST.find(p=>p[0]===up)[1].toLowerCase()}.`)}if(dn&&b[dn]>1&&chance(.4)){b[dn]--;ecoNews(`Prinsjesdag: het kabinet bezuinigt op ${BPOST.find(p=>p[0]===dn)[1].toLowerCase()}.`)}}
    setDefb(b.defensie)}
  else if(!S.acts.bud&&!Q.some(q=>q.id==='bud_prinsjes'))Q.push({id:'bud_prinsjes'});
  E_.bdef=Math.round((budSpend(b)+budTax())*10)/10;
  E_.eduAcc=E_.eduAcc*.9+(b.onderwijs-2)*.06;sh.g+=(b.infra-2)*.15+E_.eduAcc-((lawIdx('ib')-2)*.1+(lawIdx('vpb')-2)*.1);sh.u+=-(b.sociaal-2)*.15;
  // persoonlijk
  if(b.zorg!==2&&chance(.5))hea(b.zorg>2?1:-1);for(const k of living('kind'))if(pAge(k)<18&&b.onderwijs!==2&&chance(.5))k.smarts=clamp((k.smarts||50)+(b.onderwijs>2?1:-1));
  // kredietwaardigheid
  const r=rating(E_.debt)[1];if(E_.rate&&E_.rate!==r)ecoNews(`Kredietbeoordelaars ${RATES.findIndex(x=>x[1]===r)>RATES.findIndex(x=>x[1]===E_.rate)?'verlagen':'verhogen'} de kredietwaardigheid van het land naar ${r}.`,1);E_.rate=r;
  if(E_.debt>=150&&!E_.imf){E_.imf=y;if(budMine())Q.push({id:'bud_imf'});else{for(const [k] of BPOST)if(k!=='defensie'&&b[k]>0)b[k]--;setLaw('ib',1);ecoNews('Het IMF grijpt in. Het land moet hard bezuinigen en de belastingen verhogen.',1)}}
  if(E_.imf&&E_.debt<110)E_.imf=0}
/* ---------- Prinsjesdag ---------- */
E('bud_prinsjes',{sys:1,need:budMine,t:'Prinsjesdag',x:()=>{const E_=ecoW();return `${isPres()?'Het is tijd om je begroting naar het Congres te sturen.':S.p.country==='NL'?'Het is Prinsjesdag. Jij presenteert de begroting.':`Je presenteert de begroting in ${PT().kamer}.`} Staatsschuld: ${E_.debt.toLocaleString('nl-NL')}% van de economie, kredietwaardigheid ${rating(E_.debt)[1]}.`},ch:[
 ['📊 Zelf de begroting maken',()=>({go:()=>{S.budDraft=Object.assign({},budW());openSheet('Begroting',sheetBudget);processQ()}})],
 ['💰 Investeren: meer voor zorg en onderwijs',()=>{const b=budW();S.budPrev=Object.assign({},b);b.zorg=Math.min(4,b.zorg+1);b.onderwijs=Math.min(4,b.onderwijs+1);S.acts.bud=1;return budVote(b,'Investeringsbegroting')}],
 ['✂️ Bezuinigen: de schuld omlaag',()=>{const b=budW();S.budPrev=Object.assign({},b);for(const k of ['zorg','sociaal','infra'])b[k]=Math.max(0,b[k]-1);S.acts.bud=1;return budVote(b,'Bezuinigingsbegroting')}],
 ['➖ Alles laten zoals het is',()=>{S.acts.bud=1;return 'Een saaie begroting. Niemand protesteert, niemand juicht.'}]]});
function budVote(b,nm){const W=S.pw,P=S.pol;if(P&&P.lvl==='dict')return `${nm} wordt per decreet ingevoerd.`;if(isPres()&&typeof presBudVote==='function')return presBudVote(b,nm);const def=budSpend(b)+budTax();let n=0;
  for(const pid of Object.keys(W.seats)){if(!W.seats[pid]||!PTY(pid))continue;const p=PTY(pid),left=(50-p.lr)/50,cons=(p.pc-50)/50;
    const s=(b.sociaal-2)*left+(b.zorg-2)*left*.7+(b.onderwijs-2)*(left*.5+.3)+(b.defensie-2)*(cons-left*.3)+(b.infra-2)*(.3-left*.2)-Math.max(0,def)*(p.lr/100)*.25;
    if(chance(clamp(.5+s*.12+(W.gov.includes(pid)?.3:-.12),.03,.97)))n+=W.seats[pid]}
  if(n>=hneed()){S.pol.pop=clamp(S.pol.pop+(def>2?-2:1));ecoNews(`Prinsjesdag: de ${nm.toLowerCase()} wordt aangenomen.`,1);return `De Kamer stemt in met ${n} zetels. De ${nm.toLowerCase()} is aangenomen.`}
  if(S.budPrev)Object.assign(b,S.budPrev);S.budPrev=null;setDefb(b.defensie);S.pol.pop=clamp(S.pol.pop-5);ecoNews(`De Kamer stemt de begroting weg.`,1);if(P.lvl==='mp'&&chance(.25)&&typeof cabFall==='function'){const t=cabFall();return `De Kamer stemt tegen (${n} zetels). ${t}`}
  return `De Kamer stemt tegen (${n} zetels voor). Je moet terug naar de tekentafel. Alles blijft voorlopig zoals het was.`}
E('bud_imf',{sys:1,need:budMine,t:'Het IMF belt',x:'De staatsschuld is onhoudbaar. Banken willen het land geen geld meer lenen. Het Internationaal Monetair Fonds biedt een noodlening aan, maar stelt harde eisen.',ch:[
 ['🤝 Akkoord met het IMF',()=>{const b=budW();for(const [k] of BPOST)if(k!=='defensie'&&b[k]>0)b[k]--;setLaw('ib',1);S.pol.pop=clamp(S.pol.pop-15);ecoW().debt-=10;return 'Je tekent. Er volgen jaren van bezuinigingen. Op het Malieveld wordt fel gedemonstreerd.'}],
 ['🚫 Weigeren: het land gaat bankroet',()=>{const E_=ecoW();E_.ph='depressie';E_.py=0;E_.debt=Math.round(E_.debt*.6);const loss=Math.round(Math.max(0,S.inv.spaar||0)*.3);S.inv.spaar-=loss;S.pol.pop=clamp(S.pol.pop-25);MS('Liet het land failliet gaan',2);ecoNews('Het land is failliet. Een diepe depressie volgt.',1);return `Het land kan zijn schulden niet meer betalen. Spaarders verliezen geld${loss?` (jij ${fmt(loss)})`:''}, de economie stort in.`}]]});
Object.defineProperty(EV.bud_prinsjes,'t',{get(){return S.p.country==='NL'?'Prinsjesdag':'De begroting'},configurable:true});
Object.assign(EVMETA,{bud_prinsjes:['Begroting','👜'],bud_imf:['Begroting','🆘']});
/* ---------- begroting maken ---------- */
function sheetBudget(el){const E_=ecoW(),b=S.budDraft||(S.budDraft=Object.assign({},budW()));const def=Math.round((budSpend(b)+budTax())*10)/10;const tot=Math.round((budInt(E_)-E_.g*.5+def+(E_.def||0))*10)/10;
  card(el,`<h3>👜 Begroting ${year()+1}</h3>${kv([['Staatsschuld',`${E_.debt.toLocaleString('nl-NL')}% van het bbp`],['Kredietwaardigheid',rating(E_.debt)[1]],['Verwacht tekort',`${tot.toLocaleString('nl-NL')}% van het bbp`],['Rente op de schuld',`${budInt(E_).toFixed(1).replace('.',',')}% van het bbp`]])}<span class="muted">${tot>3?'Een tekort boven de 3% mag eigenlijk niet van de EU.':tot<0?'Een overschot: de schuld daalt.':'Een gezond tekort.'}</span>`);
  const s=sec(el,'Uitgaven');for(const [k,n,ic,w] of BPOST)row(s,{ic,t:n,s:BLVL[b[k]],r:b[k]===2?'':`${b[k]>2?'+':''}${((b[k]-2)*w).toFixed(1).replace('.',',')}%`,dots:true,on:()=>modal({title:n,em:ic,cat:'Begroting',text:{zorg:'Meer geld: kortere wachtlijsten en een gezondere bevolking. Minder: wachtlijsten en boze zorgmedewerkers.',onderwijs:'Meer geld werkt jaren later door in de economie en in slimmere kinderen.',defensie:'Bepaalt het defensiebudget: sterker leger, hogere salarissen, meer afschrikking.',sociaal:'Hogere of lagere uitkeringen. Minder werkloosheid door begeleiding, of juist armoede.',infra:'Wegen, spoor en internet. Meer geld geeft meer groei.'}[k],choices:opts(BLVL.map((t,i)=>({t:`${i===b[k]?'✓ ':''}${t}`,s:i===2?'':`tekort ${i>2?'+':''}${((i-2)*w).toFixed(1).replace('.',',')}% van het bbp`,on:()=>{closeModal();b[k]=i;refreshSheet()}})))})});
  const t=sec(el,'Belastingen (via wetten)');for(const k of ['ib','vpb','verm','aow'])row(t,{ic:LAWS[k].em,t:LAWS[k].t,s:LAWS[k].f(law(k))});
  const go=sec(el,'');row(go,{ic:'🏛️',t:'Begroting indienen bij de Kamer',s:S.acts.bud?'Al ingediend dit jaar':'De Kamer stemt erover',dis:!!S.acts.bud,dots:true,on:()=>doAct('Begroting',()=>{S.acts.bud=1;S.budPrev=Object.assign({},budW());const B=budW();Object.assign(B,b);setDefb(B.defensie);S.budDraft=null;return budVote(B,'Begroting')},true,'🏛️')});
  row(go,{ic:'↩️',t:'Opnieuw beginnen',on:()=>{S.budDraft=Object.assign({},budW());refreshSheet()}})}
function budWorldSec(el){const E_=ecoW(),b=budW();const s=sec(el,'Overheidsfinanciën');
  row(s,{ic:'🏛️',t:`Kredietwaardigheid ${rating(E_.debt)[1]}`,s:`Staatsschuld ${E_.debt.toLocaleString('nl-NL')}% · tekort ${((E_.bdef||0)+budInt(E_)-E_.g*.5+(E_.def||0)).toFixed(1).replace('.',',')}%${E_.imf?' · het IMF houdt toezicht':''}`});
  row(s,{ic:'👜',t:'Begroting',s:BPOST.map(([k,n])=>`${n.split(' ')[0]}: ${['−−','−','=','+','++'][b[k]]}`).join(' · '),on:budMine()?()=>{S.budDraft=Object.assign({},budW());openSheet('Begroting',sheetBudget,true)}:null})}

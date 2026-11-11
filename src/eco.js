/* ================= WERELD & ECONOMIE (fase 1): de economische motor ================= */
const EPH={hoog:{n:'Hoogconjunctuur',em:'🚀',g:3.8,u:3.2,inf:3.6,ret:.16},groei:{n:'Groei',em:'📈',g:2.4,u:3.9,inf:2.4,ret:.12},stabiel:{n:'Stabiel',em:'➖',g:1.2,u:4.6,inf:2,ret:.08},
 recessie:{n:'Recessie',em:'📉',g:-1.6,u:6.8,inf:1.4,ret:-.1},depressie:{n:'Depressie',em:'🕳️',g:-5,u:11.5,inf:-.6,ret:-.2},hyper:{n:'Hyperinflatie',em:'💸',g:-3,u:9,inf:80,ret:-.1}};
const EDUR={groei:[2,6],hoog:[1,3],stabiel:[1,4],recessie:[1,2],depressie:[2,4],hyper:[1,3]};
const ETR={groei:[['hoog',.3],['stabiel',.5],['recessie',.2]],hoog:[['stabiel',.45],['recessie',.55]],stabiel:[['groei',.6],['recessie',.4]],recessie:[['stabiel',.5],['groei',.42],['depressie',.08]],depressie:[['recessie',.55],['stabiel',.45]],hyper:[['recessie',1]]};
const wpick=arr=>{let t=arr.reduce((s,x)=>s+x[1],0),r=R()*t;for(const [k,w] of arr){r-=w;if(r<=0)return k}return arr[arr.length-1][0]};
function ecoW(){if(!S.eco){const ph=S.econ&&S.econ.s==='groei'?'groei':S.econ&&S.econ.s==='recessie'?'recessie':'stabiel';const T=EPH[ph];
  S.eco={ph,py:0,g:T.g,u:T.u,inf:2.2,r:2.5,hp:100,hreal:1,idx:1000,oil:80,debt:48,wr:1,ret:0,hpg:0,news:[],hist:[]}}return S.eco}
const ecoPhase=()=>EPH[ecoW().ph];
function ecoNews(t,big){const E_=ecoW();E_.news.unshift({y:year(),t});if(E_.news.length>12)E_.news.pop();if(big)L(t,'sys')}
function ecoYear(){const E_=ecoW(),W=typeof warW==='function'?warW():{lvl:0,reb:0},WE=typeof warEcon==='function'?warEcon():{infl:0,stk:0,house:0};const occ=typeof occHere==='function'&&occHere();
  const prev={g:E_.g,u:E_.u,inf:E_.inf,r:E_.r,ph:E_.ph};E_.py++;
  // conjunctuurfase
  let ph=E_.ph;const d=EDUR[ph];
  if(E_.py>=d[0]&&(E_.py>=d[1]||chance(.45))){let o=ETR[ph].map(x=>x.slice());if(ph==='recessie'&&(E_.debt>100||W.lvl>=3))o=o.map(([k,w])=>[k,k==='depressie'?w*3:w]);ph=ph==='depressie'&&E_.debt>130&&chance(.15)?'hyper':wpick(o)}
  if(W.lvl>=3||occ){if(!['recessie','depressie','hyper'].includes(ph))ph=(W.lvl===4||occ)&&chance(.4)?'depressie':'recessie'}
  else if(W.reb>0&&!['hoog','groei'].includes(ph))ph=chance(.5)?'hoog':'groei';
  E_.sh={g:0,u:0,inf:0,ret:0,hpg:0,oil:0,crypto:0};E_.force=null;if(typeof weYear==='function'){weYear(E_);worldStates()}if(typeof budYear==='function')budYear(E_);if(typeof dictEco==='function')dictEco(E_);
  if(E_.force&&!['depressie','hyper'].includes(ph)&&(E_.force==='depressie'||ph!=='recessie'))ph=E_.force;const sh=E_.sh;
  if(ph!==E_.ph){E_.ph=ph;E_.py=0;ecoNews({hoog:'De economie draait op volle toeren: hoogconjunctuur.',groei:'De economie groeit weer.',stabiel:'De economie stabiliseert.',recessie:'De economie is in een recessie beland. Bedrijven schrappen banen.',depressie:'Diepe crisis: de economie krimpt hard. Het woord "depressie" valt.',hyper:'Hyperinflatie! Het geld wordt met de week minder waard.'}[ph],1)}
  const T=EPH[ph];
  // olie, groei, werkloosheid, inflatie
  E_.oil=Math.round(clamp((E_.oil*Math.exp(gauss()*.14)+(80-E_.oil)*.15+(W.lvl>=2?14:0))*(1+sh.oil),25,300));
  E_.g=Math.round((T.g+gauss()*.7-(E_.oil>110?.6:0)+sh.g)*10)/10;
  E_.u=Math.round(clamp(E_.u+(T.u+sh.u-E_.u)*.5+gauss()*.3,2,25)*10)/10;
  E_.inf=Math.round((ph==='hyper'?ri(40,220):T.inf+gauss()*.5+(E_.oil-80)/45+WE.infl*100+sh.inf)*10)/10;
  // centrale bank
  const tR=clamp(2+1.5*(E_.inf-2)+.4*(E_.g-1.5),0,ph==='hyper'?45:12);E_.r=Math.max(0,Math.round((E_.r+(tR-E_.r)*.5)*4)/4);
  // beurs en huizen
  E_.ret=Math.round((T.ret+gauss()*.09-(E_.r-prev.r)*.03-WE.stk+sh.ret)*1000)/1000;E_.idx=Math.max(50,Math.round(E_.idx*(1+E_.ret)));
  E_.hpg=Math.round(clamp((E_.g*.9+2.1-(E_.r-2.5)*1.3+(E_.inf-2)*.3)/100+gauss()*.015-WE.house+sh.hpg,-.25,.2)*1000)/1000;E_.hp=Math.round(E_.hp*(1+E_.hpg)*10)/10;E_.hreal=clamp(E_.hreal*(1+E_.hpg)/(1+E_.inf/100),.4,3);
  // lonen (cao) lopen soms achter op de inflatie
  const cao=ph==='hyper'?E_.inf*.6:E_.inf+({hoog:1,groei:.5,stabiel:.2,recessie:-.6,depressie:-1.5}[ph]||0)+gauss()*.3;E_.wr=clamp(E_.wr*(1+cao/100)/(1+E_.inf/100),.75,1.3);
  // staatsschuld
  const def=(typeof budInt==='function'?budInt(E_):2)-E_.g*.5+(W.lvl>=3?6:0)+(ph==='depressie'?3:0)+(E_.def||0)+(E_.bdef||0);E_.debt=Math.round(clamp(E_.debt*(1-(E_.g+Math.max(0,E_.inf))/100)+def,8,260)*10)/10;
  // econ() koppelen aan de rest van het spel
  S.econ.s=['hoog','groei'].includes(ph)?'groei':ph==='stabiel'?'normaal':'recessie';S.econ.y=E_.py;
  // nieuws
  const pc=v=>v.toLocaleString('nl-NL',{maximumFractionDigits:2})+'%';
  if(Math.abs(E_.r-prev.r)>=.5)ecoNews(`De centrale bank ${E_.r>prev.r?'verhoogt':'verlaagt'} de rente naar ${pc(E_.r)}.`,1);
  if(Math.abs(E_.u-prev.u)>=1)ecoNews(`De werkloosheid ${E_.u>prev.u?'stijgt':'daalt'} naar ${pc(E_.u)}.`,E_.u>prev.u);
  if(E_.inf>=5&&ph!=='hyper')ecoNews(`De inflatie loopt op tot ${pc(E_.inf)}. Boodschappen worden flink duurder.`,1);
  if(E_.ret<=-.18)ecoNews(`Beurskrach: de beurs verliest ${Math.round(-E_.ret*100)}% in een jaar.`,1);else if(E_.ret>=.22)ecoNews(`De beurs stijgt ${Math.round(E_.ret*100)}% en breekt records.`);
  if(E_.hpg>=.08)ecoNews(`De huizenprijzen stijgen ${Math.round(E_.hpg*100)}%.`);else if(E_.hpg<=-.05)ecoNews(`De huizenprijzen dalen ${Math.round(-E_.hpg*100)}%.`,1);
  if(E_.oil>=130&&prev.inf!==E_.inf)ecoNews(`De olieprijs schiet naar $${E_.oil} per vat.`);
  if(E_.debt>=90&&(E_.hist.slice(-1)[0]||{debt:0}).debt<90)ecoNews('De staatsschuld gaat over de 90% van de economie.',1);
  E_.hist.push({y:year(),g:E_.g,u:E_.u,inf:E_.inf,r:E_.r,hp:E_.hp,idx:E_.idx,oil:E_.oil,debt:E_.debt,ph});if(E_.hist.length>40)E_.hist.shift();
  ecoPersonal()}
/* ---------- persoonlijke gevolgen ---------- */
const JBETA={horeca:1.5,handwerk:1.3,tech:1.1,kantoor:1,fame:1,zorg:.3,onderwijs:.3,politiek:0};
function ecoPersonal(){const E_=S.eco;if(S.ww&&S.ww.left>0){S.ww.left--;if(S.job||!S.ww.left){if(!S.job)L('Je WW-uitkering is afgelopen.','bad');S.ww=null}}
  if(S.job&&!S.job.part&&!inJail()&&S.job.id!=='prosport'&&E_.u>5.5){const b=JBETA[typeof jobGroup==='function'?jobGroup(S.job.id):'kantoor']??1;if(chance((E_.u-5)/55*b))Q.push({id:'eco_ontslag'})}}
E('eco_ontslag',{sys:1,need:()=>!!S.job,t:'Reorganisatie',x:()=>`${S.job.co?S.job.co:'Je werkgever'} moet bezuinigen door de slechte economie. Jouw functie als ${jobTitle().toLowerCase()} verdwijnt.`,ch:[
 ['📄 Ontslag accepteren',()=>{const amt=Math.round(Math.min(salary()*.7,62000*(S.cpi||1)));const t=jobTitle();endJob();S.ww={left:2,amt};hap(-10);MS(`Werd ontslagen bij een reorganisatie (${t.toLowerCase()})`,1);return `Je krijgt twee jaar WW: ${fmt(amt)} per jaar.`}],
 ['🤝 Onderhandelen over een vertrekregeling',()=>{const v=Math.round(salary()*(.3+R()*.5));const amt=Math.round(Math.min(salary()*.7,62000*(S.cpi||1)));endJob();cash(v);S.ww={left:2,amt};hap(-6);return `Je krijgt een vertrekpremie van ${fmt(v)} en daarna WW.`}],
 ['🙏 Vragen of je mag blijven voor minder salaris',()=>{if(chance(.45)){S.job.mult*=.85;hap(-3);return 'Je mag blijven, maar je levert 15% salaris in.'}const amt=Math.round(Math.min(salary()*.7,62000*(S.cpi||1)));endJob();S.ww={left:2,amt};hap(-10);return 'Het antwoord is nee. Je krijgt twee jaar WW.'}]]});
EVMETA.eco_ontslag=['Economie','📉'];
const wwInc=()=>S.ww&&S.ww.left>0&&!S.job&&!inJail()?[['WW-uitkering',S.ww.amt]]:[];
// gevoeligheid van bedrijven voor de conjunctuur
const BBETA={foodtruck:1.3,restaurant:1.5,cafe:1.4,hotel:1.6,nachtclub:1.5,bouwbedrijf:1.7,makelaar:1.7,webshop:1,saas:1.1,app:1.2,kapsalon:.7,kinderopvang:.4,schoonmaak:.6,garage:.7,bakkerij:.5,consultancy:1.3,uitzend:1.5,sportschool:1,platenlabel:1.1,kleding:1.2};
function bizCyc(b){if(!S.eco)return econ()==='recessie'?(-.17-(prOf(b)===2?.06:0)):econ()==='groei'?.05:0;const E_=S.eco,be=BBETA[b.type]??1;return (E_.g-1.2)*.045*be-(E_.g<0&&prOf(b)===2?.06:0)-(E_.lock&&be>=1.3?E_.lock*.15:0)}
/* ---------- het scherm ---------- */
function ecoSpark(vals,col){if(vals.length<2)return '';const mn=Math.min(...vals),mx=Math.max(...vals),r=mx-mn||1;const pts=vals.map((v,i)=>`${(i/(vals.length-1)*100).toFixed(1)},${(26-(v-mn)/r*24).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="${col||'var(--brand)'}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`}
function sheetWorld(el){const E_=ecoW(),T=EPH[E_.ph];const H=E_.hist.slice(-20);const pc=v=>v.toLocaleString('nl-NL',{maximumFractionDigits:2})+'%';
  card(el,`<h3>${T.em} ${T.n}</h3><span class="muted">${E_.py?`Al ${E_.py+1} jaar`:'Sinds dit jaar'} · ${{hoog:'Banen genoeg, lonen stijgen, alles is duur.',groei:'Het gaat goed met de economie.',stabiel:'Rustig vaarwater.',recessie:'Bedrijven schrappen banen en de beurs daalt.',depressie:'Een diepe crisis. Veel mensen verliezen hun baan.',hyper:'Prijzen verdubbelen in maanden. Spaargeld verdampt.'}[E_.ph]}</span>`);
  const ind=[['📊','Economische groei','g',pc(E_.g),v=>v],['👷','Werkloosheid','u',pc(E_.u),v=>v],['🛒','Inflatie','inf',pc(E_.inf),v=>v],['🏦','Rente centrale bank','r',pc(E_.r),v=>v],['🏠','Huizenprijzen','hp',`index ${Math.round(E_.hp)}`,v=>v],['📈','Beursindex','idx',nf(E_.idx),v=>v],['🛢️','Olieprijs','oil',`$${E_.oil} per vat`,v=>v],['🏛️','Staatsschuld','debt',`${pc(E_.debt)} van het bbp`,v=>v]];
  const s=sec(el,'De cijfers');for(const [ic,t,k,v] of ind){const vals=H.map(h=>h[k]);const last=vals.length>1?vals[vals.length-1]-vals[vals.length-2]:0;
    const r=row(s,{ic,t,s:v,r:vals.length>1?ecoSpark(vals,(['u','inf','debt'].includes(k)?last>0:last<0)?'var(--bad)':'var(--good)'):''});r.classList.add('ecorow')}
  if(typeof budWorldSec==='function')budWorldSec(el);
  const me=sec(el,'Wat het voor jou betekent');const items=[];
  items.push(['🏦',`Hypotheekrente nu ${pct(rente())}`,S.props.some(p=>p.mort>0)?'Geldt bij oversluiten of een variabele hypotheek':'Voor als je een huis koopt']);
  items.push(['💰',`Spaarrente ${pc(Math.max(0,E_.r-.8))}`,E_.inf>Math.max(0,E_.r-.8)?'Lager dan de inflatie: je spaargeld wordt minder waard':'Hoger dan de inflatie: sparen loont']);
  items.push(['🧾',`Koopkracht ${E_.wr>=1?'+':''}${Math.round((E_.wr-1)*100)}%`,E_.wr>=1?'Lonen stegen sneller dan de prijzen':'Lonen liepen achter op de prijzen']);
  items.push(['👔','Kans op een baan',E_.u<4?'Groot: werkgevers staan te springen':E_.u<6?'Normaal':E_.u<9?'Klein: veel concurrentie':'Heel klein: massawerkloosheid']);
  if(S.ww)items.push(['📄',`WW-uitkering ${fmt(S.ww.amt)} per jaar`,`Nog ${S.ww.left} jaar`]);
  for(const [ic,t,sub] of items)row(me,{ic,t,s:sub});
  if(typeof sheetWorldEvents==='function')sheetWorldEvents(el);
  if(typeof warCard==='function')warCard(sec(el,'Wereld'));
  const n=sec(el,'Economisch nieuws');if(!E_.news.length)empty(n,'Nog geen nieuws.');for(const x of E_.news.slice(0,8))row(n,{ic:'📰',t:x.t,s:String(x.y)})}

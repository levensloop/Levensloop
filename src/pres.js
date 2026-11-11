/* ================= POLITIEK PER LAND: Verenigde Staten (presidentieel stelsel) ================= */
const US_PARTIES=[
 {id:'dem',n:'Democratische Partij',k:'D',em:'🫏',c:'#1f5fd6',lr:36,pc:24,b:48,lbl:'centrumlinks · progressief',d:'Zorg voor iedereen, klimaat, vakbonden en burgerrechten'},
 {id:'rep',n:'Republikeinse Partij',k:'R',em:'🐘',c:'#d22d2d',lr:74,pc:78,b:48,lbl:'rechts · conservatief',d:'Lage belastingen, wapenbezit, een strenge grens en traditie'},
 {id:'lbt',n:'Libertarische Partij',k:'L',em:'🗽',c:'#e0aa00',lr:84,pc:20,b:2.5,lbl:'rechts · libertair',d:'Zo weinig mogelijk overheid, op elk gebied'},
 {id:'gpus',n:'Green Party',k:'G',em:'🌻',c:'#2fa84f',lr:12,pc:12,b:1.5,lbl:'links · groen',d:'Klimaat, vrede en eerlijk delen'}];
// [naam, afkorting, kiesmannen, voorsprong Democraten in procentpunten, regio, sluitingstijd stembureaus]
const US_ST=[
 ['Alabama','AL',9,-15,'z',2],['Alaska','AK',3,-6,'w',7],['Arizona','AZ',11,-2,'w',4],['Arkansas','AR',6,-16,'z',3],['Californië','CA',54,13,'w',6],
 ['Colorado','CO',10,4,'w',4],['Connecticut','CT',7,8,'ne',2],['Delaware','DE',3,7,'ne',2],['Washington D.C.','DC',3,43,'ne',2],['Florida','FL',30,-5,'z',2],
 ['Georgia','GA',16,-1,'z',0],['Hawaï','HI',4,14,'w',6],['Idaho','ID',4,-19,'w',6],['Illinois','IL',19,7,'mw',2],['Indiana','IN',11,-10,'mw',0],
 ['Iowa','IA',6,-6,'mw',5],['Kansas','KS',6,-10,'mw',4],['Kentucky','KY',8,-16,'z',0],['Louisiana','LA',8,-12,'z',4],['Maine','ME',4,2,'ne',2],
 ['Maryland','MD',10,15,'ne',2],['Massachusetts','MA',11,15,'ne',2],['Michigan','MI',15,-1,'mw',4],['Minnesota','MN',10,1,'mw',4],['Mississippi','MS',6,-10,'z',2],
 ['Missouri','MO',10,-10,'mw',2],['Montana','MT',4,-11,'w',5],['Nebraska','NE',5,-9,'mw',4],['Nevada','NV',6,-1,'w',5],['New Hampshire','NH',4,1,'ne',2],
 ['New Jersey','NJ',14,4,'ne',2],['New Mexico','NM',5,3,'w',4],['New York','NY',28,8,'ne',4],['North Carolina','NC',16,-2,'z',1],['North Dakota','ND',3,-20,'mw',4],
 ['Ohio','OH',17,-6,'mw',1],['Oklahoma','OK',7,-20,'z',2],['Oregon','OR',8,6,'w',6],['Pennsylvania','PA',19,-1,'ne',2],['Rhode Island','RI',4,8,'ne',2],
 ['South Carolina','SC',9,-8,'z',0],['South Dakota','SD',3,-16,'mw',4],['Tennessee','TN',11,-14,'z',2],['Texas','TX',40,-5,'z',4],['Utah','UT',6,-11,'w',5],
 ['Vermont','VT',3,16,'ne',0],['Virginia','VA',13,3,'z',0],['Washington','WA',12,8,'w',6],['West Virginia','WV',4,-22,'z',1],['Wisconsin','WI',10,-1,'mw',4],['Wyoming','WY',3,-23,'w',4]];
const US_REG={ne:'het noordoosten',z:'het zuiden',mw:'het Midwesten',w:'het westen'};
const US_CLOSE=['19:00','19:30','20:00','20:30','21:00','22:00','23:00','01:00'];
// stad → [staat, voorsprong Democraten in de stad zelf]
const US_CITY={'New York':['NY',30],'Los Angeles':['CA',30],'Chicago':['IL',35],'Miami':['FL',2],'Austin':['TX',24],'Seattle':['WA',40]};
const US_STELL=[
 ['De belasting voor miljonairs moet omhoog.','lr',-1],['Iedere Amerikaan moet een publieke zorgverzekering kunnen krijgen.','lr',-1],['Het federale minimumloon moet naar 15 dollar.','lr',-1],
 ['Bedrijven moeten van veel federale regels af.','lr',1],['De overheid moet bezuinigen, ook op sociale programma\'s.','lr',1],['Studieschulden moeten worden kwijtgescholden.','lr',-1],
 ['Vakbonden moeten meer macht krijgen.','lr',-1],['De winstbelasting voor bedrijven moet verder omlaag.','lr',1],['Er moeten veel strengere regels komen voor wapenbezit.','pc',-1],
 ['De grens met Mexico moet veel strenger bewaakt worden.','pc',1],['Amerika moet zo snel mogelijk van olie en gas af.','pc',-1],['Wiet moet in het hele land legaal worden.','pc',-1],
 ['De politie moet meer geld krijgen.','pc',1],['Het leger moet nog groter worden.','pc',1],['Het kiescollege moet worden afgeschaft.','pc',-1],
 ['De doodstraf moet blijven bestaan.','pc',1],['Het land heeft meer traditionele waarden nodig.','pc',1],['Er moeten meer vluchtelingen worden opgevangen.','pc',-1]];
const US_PORT={'Financiën':'Treasury','Buitenlandse Zaken':'State','Defensie':'Defense','Justitie en Veiligheid':'Justice','Volksgezondheid':'Health','Onderwijs':'Education','Klimaat en Energie':'Energy','Sociale Zaken':'Labor','Economische Zaken':'Commerce','Wonen':'Housing','Infrastructuur':'Transportation','Landbouw':'Agriculture'};
PSYS.US={type:'pres',parties:US_PARTIES,stell:US_STELL,portL:US_PORT,pt:{kamer:'het Congres',kl:'Congreslid',mp:'President'},
 off:{raad:{t:'Gemeenteraadslid',sal:60,fame:6,ft:0,r:1},burg:{t:'Burgemeester',sal:150,fame:28,ft:1,r:3},stl:{t:'Lid van het staatsparlement',sal:35,fame:5,ft:0,r:2},
  kamer:{t:'Congreslid',sal:134,fame:30,ft:1,r:3},ek:{t:'Senator',sal:134,fame:50,ft:1,r:4},gov:{t:'Gouverneur',sal:125,fame:55,ft:1,r:4},
  min:{t:'Minister',sal:192,fame:62,ft:1,r:4},vp:{t:'Vicepresident',sal:181,fame:75,ft:1,r:4},mp:{t:'President',sal:308,fame:100,ft:1,r:6},cdk:{t:'Ambassadeur',sal:150,fame:22,ft:1,r:3},vn:{t:'VN-ambassadeur',sal:160,fame:40,ft:1,r:4}}};
const US_TERM={raad:4,burg:4,stl:2,kamer:2,ek:6,gov:4,mp:4,vp:4};
const US_NEED={raad:20000,burg:200000,stl:40000,kamer:1.5e6,ek:8e6,gov:1e7,mp:3e8};// campagnekas die "genoeg" is
const US_MULT={raad:.2,burg:1.5,stl:.4,kamer:10,ek:60,gov:60,mp:1500};
const US_AGE={raad:18,burg:21,stl:18,kamer:25,ek:30,gov:30,mp:35};
const isUS=()=>S.p.country==='US';
const usSt=ab=>US_ST.find(s=>s[1]===ab);
const usMy=()=>{const c=US_CITY[S.p.city]||['NY',20];return {st:usSt(c[0]),cl:c[1]}};
const usOther=p=>p==='dem'?'rep':p==='rep'?'dem':'rep';
const usSgn=p=>p==='dem'?1:p==='rep'?-1:0;
const usPty=p=>PTY(p)?PTY(p).k:'?';
const pm1=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(1).replace('.',',');
function usNextFor(o,y){y=(y??year())+1;const ok=v=>o==='raad'||o==='burg'?v%4===1:o==='gov'?v%4===2:o==='mp'||o==='vp'?v%4===0:v%2===0;while(!ok(y))y++;return y}
const kasPts=(o,kas)=>{const n=US_NEED[o]*(S.cpi||1);return 10*kas/(kas+n)};
const usNatBorn=()=>(S.p.bc||(S.flags.wereld?null:S.p.country))==='US';
/* ---------- de wereld ---------- */
function usHouse(m){const d=clamp(Math.round(217.5+m*4.6+gauss()*5),165,275);return {dem:d,rep:435-d,lbt:0,gpus:0}}
function usSenClass(m,n){const d=Math.round(n*clamp(.5+m*.016+gauss()*.04,.25,.75));return {dem:d,rep:n-d}}
function usSenSum(){const W=S.pw,o={dem:0,rep:0,lbt:0,gpus:0};for(const c of W.senC)for(const k in c)o[k]=(o[k]||0)+c[k];W.sen=o;return o}
function usWorld(old){const sh={},base={},lead={};for(const p of US_PARTIES){base[p.id]=p.b;sh[p.id]=p.b*Math.exp(gauss()*.05);lead[p.id]=lnm()}
  const W=S.pw={cc:'US',sys:'us',sh,base,lead,seats:{},sen:{},senC:[],gov:[],pm:null,vpn:null,own:null,scotus:{c:6,l:3},nom:null,
    nextTK:usNextFor('kamer'),nextGR:usNextFor('raad'),nextEK:9999,nextEP:9999,hist:[],phist:[],law:(old&&old.law)||{}};
  normSh();const m=sh.dem-sh.rep;W.seats=usHouse(m);for(const n of [33,33,34])W.senC.push(usSenClass(m-2,n));usSenSum();
  const pp=chance(.5)?'dem':'rep';W.gov=[pp];W.pm={n:lnm(),p:pp,y0:year()-ri(0,3),t:ri(1,2)};W.vpn={n:lnm(),p:pp};W.stGov={n:lnm(),p:usMy().st[3]+gauss()*6>0?'dem':'rep'};return W}
// een oude save (of een politicus die hier al zat): omzetten naar het Amerikaanse stelsel
function usMigrate(old){usWorld(old);const W=S.pw,P=S.pol;if(!P)return;
  if(P.party==='own'&&old&&old.own){W.own=old.own;W.sh.own=1.5;W.base.own=1.5;W.lead.own=myName();normSh()}
  else if(!US_PARTIES.some(p=>p.id===P.party)){const op=PARTIES.find(p=>p.id===P.party);P.party=op&&op.lr<50?'dem':'rep'}
  const l={weth:'raad',ep:'lid',ek:'ek'}[P.lvl]||P.lvl;P.lvl=POLO[l]?l:'lid';P.cand={};if(P.party!=='own')P.lead=0;P.port=P.lvl==='min'?P.port:P.lvl==='cdk'?'Canada':P.port;
  if(US_TERM[P.lvl])P.t=usNextFor(P.lvl==='ek'?'kamer':P.lvl,year()-1)+(P.lvl==='ek'?4:0);
  if(POLO[P.lvl].r>=3)P.pop=Math.max(P.pop,P.lvl==='mp'?48:35);
  if(P.lvl==='mp'){W.gov=[P.party];W.pm={n:myName(),p:P.party,y0:year(),t:1};W.vpn={n:lnm(),p:P.party};P.terms=1}
  if(P.lvl==='kamer')usDist(1);
  L(`De politiek werkt in de VS anders. Je bent nu ${P.lvl==='lid'?'lid':polTl(P.lvl)} van de ${PTY(P.party).n}.`,'sys')}
function usDist(auto){const P=S.pol;if(P.dist)return P.dist;const {st,cl}=usMy();const lean=Math.round(cl*.45+st[3]*.4+gauss()*13);P.dist={n:`${st[1]}-${ri(1,Math.max(2,Math.round(st[2]/2)))}`,lean};return P.dist}
const usLean=o=>{const {st,cl}=usMy(),P=S.pol;return o==='raad'||o==='burg'?cl:o==='stl'?Math.round(cl*.5+st[3]*.5):o==='kamer'?(P&&P.dist?P.dist.lean:cl):o==='mp'||o==='vp'?0:st[3]};
function usDrift(){const W=S.pw,P=S.pol;for(const k in W.sh){let s=W.sh[k]*Math.exp(gauss()*.035);s+=(W.base[k]-s)*.15;
    if(W.gov.includes(k))s*=.99-(['recessie','depressie'].includes(ecoW().ph)?.02:0);
    if(P&&P.party===k&&P.lvl==='mp')s*=1+(P.pop-48)/900;W.sh[k]=Math.max(.2,s)}normSh()}
const usNatM=()=>{const W=S.pw;return W.sh.dem-W.sh.rep};
const usEcoE=()=>({hoog:2.5,groei:1.5,stabiel:0,recessie:-3,depressie:-6,hyper:-5})[ecoW().ph]||0;
/* ---------- jaarlijks ---------- */
function presYear(a){const W=polW(),y=year(),P=S.pol;if(S.dict&&P&&P.lvl!=='dict')P.lvl='dict';
  const frozen=(typeof occHere==='function'&&occHere())||S.dict;usDrift();
  if(P){P.yrs++;if(P.lvl!=='lid')P.oy++;
    if(P.lvl==='mp'){const wl=typeof warW==='function'?warW().lvl:0;const tgt=clamp(46+usEcoE()*3+(wl>=3?4:0)-(P.oy>5?4:0)-(P.risk||0)/8);P.pop=clamp(Math.round(P.pop+(tgt-P.pop)*.3+ri(-4,4)))}
    else{const tgt=Math.max(P.lead?22:10,POLO[P.lvl].fame*.8+S.fame*.2);P.pop=clamp(Math.round(P.pop+(tgt-P.pop)*.2+ri(-3,3)))}
    if(P.party!=='own')P.steun=clamp(Math.round(P.steun+(50-P.steun)*.06+ri(-2,3)+(P.lvl!=='lid'?1:0)))}
  if(frozen){W.nextTK=Math.max(W.nextTK,y+1);W.nextGR=Math.max(W.nextGR,y+1)}
  else{
    if(P&&P.lvl==='vp'&&W.pm&&W.pm.n!==myName()&&chance(.015))Q.push({id:'us_succ'});
    if(P&&P.lvl==='mp'&&(P.risk||0)>=40&&usHouseMaj()!==P.party&&(!P.imp||y-P.imp>=4)&&chance(.45))Q.push({id:'us_impeach'});
    if(P&&P.lvl==='mp'&&chance(.18))Q.push({id:'us_scotus'});
    if(P&&P.lvl==='mp'&&chance(usTrif()&&usTrif()!==P.party?.6:usTrif()?.45:.2)){const c=usBillCtx();if(c)Q.push({id:'us_bill',c})}
    // gemeenteraad en burgemeester (oneven jaren)
    if(y>=W.nextGR){W.nextGR=usNextFor('raad',y);if(P)for(const o of ['raad','burg'])usQueueRace(o,y)}
    if(y>=W.nextTK){W.nextTK=usNextFor('kamer',y);usFedYear(a,y)}}
  if(P&&a>=16)polEvents();
  pol3Year()}
function usQueueRace(o,y){const P=S.pol;if(!P)return;const run=P.run&&P.run.o===o&&P.run.y===y;const inc=P.lvl===o&&P.t===y&&!P.noRun&&!(P.run&&P.run.y===y&&P.run.o!==o);
  if(run||inc)Q.push({id:'us_race',c:{o}});
  else if(P.lvl===o&&P.t&&y>=P.t)loseOffice(`Je termijn als ${polTl(o)} zit erop.`)}
function usFedYear(a,y){const W=S.pw,P=S.pol;const pres=y%4===0;
  if(pres){usNoms(y);
    if(P&&P.lvl==='mp'&&W.pm&&W.pm.n===myName()){if((P.terms||1)>=2){P.lame=1}else if(!P.noRun){P.nom=y;P.run={o:'mp',y,vp:W.vpn};if(P.pop<32&&chance(.5))P.run.chal=1}}
    if(P&&P.lvl==='mp'&&W.pm&&W.pm.n===myName()&&P.noRun)P.lame=1;
    if(P&&P.run&&P.run.o==='mp'&&P.run.y===y){if(!['dem','rep'].includes(P.party)){if(P.steun>=40||P.party==='own'){P.nom=y;W.nom[usOther(P.party)]=W.nom.rep}else{P.run=null;L('Je partij kiest iemand anders als presidentskandidaat.')}}
      if(P.run){if(P.nom!==y||P.run.chal)Q.push({id:'us_prim'});Q.push({id:'us_vp'});Q.push({id:'us_gen'})}}
    else if(P&&['dem','rep'].includes(P.party)&&['kamer','ek','gov','min'].includes(P.lvl)&&(P.pop>=45||S.fame>=55)&&chance(.3))Q.push({id:'us_vpoffer'})}
  if(a>=18&&!inJail())Q.push({id:'us_stem'});
  if(pres){Q.push({id:'us_night'});Q.push({id:'us_pnpc'})}
  Q.push({id:'us_cong'});
  if(P){for(const o of ['stl','kamer','ek','gov'])usQueueRace(o,y)}}
// kandidaten van beide grote partijen (als jij niet meedoet)
function usNoms(y){const W=S.pw,P=S.pol;const n={};for(const p of ['dem','rep']){const inc=W.pm&&W.pm.p===p&&W.pm.n!==myName()&&W.pm.t<2&&!W.pm.out;
    n[p]=inc?{n:W.pm.n,s:ri(50,64)+(usEcoE()*2),inc:1,vp:W.vpn&&W.vpn.n}:{n:lnm(),s:ri(42,68),role:usRole(),vp:lnm()}}
  W.nom=n}
function usRole(){const st=pick(US_ST);return pick([`gouverneur van ${st[0]}`,`senator uit ${st[0]}`,`oud-gouverneur van ${st[0]}`,'zakenman uit New York','voormalig minister','vicepresident',`burgemeester van ${pick(['Houston','Philadelphia','Denver','Atlanta','Phoenix','Detroit'])}`,`congreslid uit ${st[0]}`,'oud-generaal','tv-presentator'])}
const usHouseMaj=()=>{const W=S.pw;return (W.seats.dem||0)>=218?'dem':(W.seats.rep||0)>=218?'rep':null};
const usSenMaj=()=>{const W=S.pw,d=W.sen.dem||0,r=W.sen.rep||0;const vp=W.vpn?W.vpn.p:W.gov[0];return d>=51||(d===50&&vp==='dem')?'dem':r>=51||(r===50&&vp==='rep')?'rep':null};
const usTrif=()=>{const h=usHouseMaj();return h&&h===usSenMaj()?h:null};
/* ---------- een eigen race (alles behalve president) ---------- */
const US_ONM={raad:'de gemeenteraad',burg:'het burgemeesterschap',stl:'het staatsparlement',kamer:'het Huis van Afgevaardigden',ek:'de Senaat',gov:'het gouverneurschap'};
function usRaceName(o){const {st}=usMy();return o==='raad'?`de gemeenteraad van ${S.p.city}`:o==='burg'?`burgemeester van ${S.p.city}`:o==='stl'?`het staatsparlement van ${st[0]}`:o==='kamer'?`het Huis van Afgevaardigden (district ${usDist().n})`:o==='ek'?`senator voor ${st[0]}`:o==='gov'?`gouverneur van ${st[0]}`:o}
function usRace(o){const P=S.pol,W=S.pw;const inc=P.lvl===o;const k=kasPts(o,P.kas||0);const out={};
  const major=['dem','rep'].includes(P.party);
  // voorverkiezing binnen de partij
  if(major&&!inc){const ps=P.steun*.45+P.pop*.35+k*2+Math.min(14,P.oy*1.4)+(S.st.smarts-50)*.08+(POLO[P.lvl].r||0)*3+(P.camp||0)*.6;const riv=48+ri(-8,14)+(US_NEED[o]>1e6?6:0);
    out.pv=Math.round(clamp(50+(ps-riv)*1.3+gauss()*6,18,82));out.prim=out.pv>50;if(!out.prim)return out}
  else out.prim=true;
  // de echte verkiezing
  let m;const lean=usLean(o);const nat=usNatM()*.6;
  if(major){const sg=usSgn(P.party);m=lean*sg+nat*sg+(P.pop-40)*.22+(k-5)*.6+(inc?5:0)+(P.camp||0)*.3+(o==='burg'||o==='raad'?3:0)+gauss()*5;
    const mid=year()%4===2&&W.gov[0]===P.party?-2:0;m+=mid}
  else m=-28+P.pop*.45+k*.8+(inc?14:0)+(P.camp||0)*.4+gauss()*6;
  out.m=Math.round(m*10)/10;out.win=m>0;out.pct=Math.round(clamp(50+m/2,8,92));return out}
E('us_race',{sys:1,t:'Verkiezingsavond',x:c=>`De stembussen zijn dicht. Het gaat om ${usRaceName(c.o)}.`,need:c=>S.pol&&!S.dict,f:c=>{const P=S.pol,o=c.o,y=year();const r=usRace(o);const nm=usRaceName(o);const was=P.lvl;const out=[];
  if(!r.prim){out.push(`Je verliest de voorverkiezing van de ${PTY(P.party).n} met ${r.pv}% van de stemmen.`);hap(-5);P.steun=clamp(P.steun-4)}
  else{if(r.pv)out.push(`Je wint de voorverkiezing met ${r.pv}%.`);
    if(r.win){out.push(was===o?`Je bent herkozen als ${polTl(o)} met ${r.pct}% van de stemmen.`:o==='raad'?`Je bent gekozen in de gemeenteraad met ${r.pct}% van de stemmen!`:`Je wint met ${r.pct}% van de stemmen. Je bent de nieuwe ${polTl(o)}!`);
      if(was!==o){setOffice(o);MS(`Werd gekozen tot ${polTl(o)}${o==='kamer'?' in het Amerikaanse Congres':o==='ek'?` voor ${usMy().st[0]}`:''}`,o==='ek'||o==='gov'?3:2);hap(10)}else hap(4);
      P.t=y+US_TERM[o];if(o==='ek')S.flags.ussen=1;if(o==='gov'){S.pw.stGov={n:myName(),p:P.party}}P.pop=clamp(P.pop+3)}
    else{out.push(`Je verliest van je tegenstander. Je haalt ${r.pct}% van de stemmen.`);hap(-8)}}
  if(!r.prim||!r.win){if(was===o)loseOffice(`Je bent je zetel als ${polTl(o)} kwijt.`);else if(was!=='lid'&&P.t&&P.t<=y&&POLO[was]&&US_TERM[was])loseOffice()}
  if(P.run&&P.run.o===o)P.run=null;P.camp=0;P.kas=Math.round((P.kas||0)*.15);return out.join(' ')}});
/* ---------- Congres en gouverneur (landelijk) ---------- */
E('us_cong',{sys:1,t:'Verkiezingen voor het Congres',f:()=>{const W=S.pw,y=year(),P=S.pol;const pres=y%4===0;
  let m=clamp(usNatM(),-9,9)+gauss()*2;if(!pres&&W.gov[0])m+=W.gov[0]==='dem'?-2.5:2.5;if(pres&&W.lastPM!=null)m=m*.6+W.lastPM*.4;
  const oldH=Object.assign({},W.seats);W.seats=usHouse(m);
  if(P&&P.lvl==='kamer'&&!['dem','rep'].includes(P.party)){W.seats[P.party]=(W.seats[P.party]||0)+1;W.seats.rep--}
  const ci=(y/2)%3;W.senC[ci]=usSenClass(m-1.5,W.senC[ci].dem+W.senC[ci].rep+(W.senC[ci].lbt||0)+(W.senC[ci].gpus||0));usSenSum();
  if(P&&P.lvl==='ek'&&!['dem','rep'].includes(P.party)&&!W.sen[P.party]){W.senC[ci][P.party]=1;W.senC[ci].rep--;usSenSum()}
  W.lastHM=m;W.hist.push({y,s:Object.assign({},W.seats)});if(W.hist.length>8)W.hist.shift();
  const hm=usHouseMaj(),sm=usSenMaj();const t=[`Huis van Afgevaardigden: ${W.seats.dem} Democraten, ${W.seats.rep} Republikeinen${hm?` (meerderheid ${usPty(hm)})`:''}.`,`Senaat: ${W.sen.dem}–${W.sen.rep}${sm?` (meerderheid ${usPty(sm)})`:''}.`];
  if(y%4===2){const {st}=usMy();const g=st[3]+m*.6+gauss()*6;if(!(P&&P.lvl==='gov')){const gp=g>0?'dem':'rep';const was=W.stGov&&W.stGov.p;W.stGov={n:lnm(),p:gp};t.push(`${st[0]} krijgt een ${gp==='dem'?'Democratische':'Republikeinse'} gouverneur${was&&was!==gp?' (de staat wisselt van kleur)':''}.`)}}
  if(!pres&&W.gov[0]&&oldH[W.gov[0]]>W.seats[W.gov[0]])t.push(`Zoals zo vaak verliest de partij van de president bij de tussentijdse verkiezingen.`);
  const tf=usTrif();if(tf&&W.gov[0]===tf&&!(P&&P.lvl==='mp')&&chance(.7)){const c=usBillCtx();if(c){const L_=LAWS[c.k];setLaw(c.k,c.d);t.push(`De ${PTY(tf).n} heeft nu het Witte Huis en het hele Congres in handen. ${L_.t}: voortaan ${L_.f(law(c.k))}.`)}}
  return t.join(' ')}});
/* ---------- stemmen ---------- */
E('us_stem',{sys:1,need:()=>!S.dict,t:'Verkiezingsdag',x:()=>year()%4===0?'Het is de eerste dinsdag van november. Op wie stem je voor president?':'Tussentijdse verkiezingen voor het Congres. Op welke partij stem je?',ch:[]});
Object.defineProperty(EV.us_stem,'ch',{get(){const W=S.pw;if(!W||!W.nom&&year()%4===0)return [['🛋️ Niet stemmen',()=>'']];
  if(year()%4===0){const P=S.pol;const o=[];for(const p of ['dem','rep']){const me=P&&P.nom===year()&&P.party===p;const n=me?myName():W.nom[p].n;o.push([`${PTY(p).em} ${me?'Op jezelf':n} (${PTY(p).k})`,()=>{W.vote=p;return me?'Je stemt op jezelf. Een vreemd gevoel.':`Je stemt op ${n}.`}])}
    o.push(['🌻 Een kleine partij',()=>{W.vote='gpus';return 'Je stemt op een kleine partij. "Een weggegooide stem," zegt je buurman.'}]);o.push(['🛋️ Niet stemmen',()=>'Je blijft thuis. De rij was ook wel erg lang.']);return o}
  return US_PARTIES.map(p=>[`${p.em} ${p.n}`,()=>{W.vote=p.id;return `Je stemt op de ${p.n}.`}]).concat([['🛋️ Niet stemmen',()=>'']])}});
/* ---------- voorverkiezingen voor het presidentschap ---------- */
const US_PRIM=[['Iowa','🌽','De eerste caucus. Klein, maar het hele land kijkt mee.',.012],['New Hampshire','🍁','De eerste echte voorverkiezing.',.01],['Nevada en South Carolina','🌵','Het westen en het zuiden stemmen.',.03],['Super Tuesday','🗳️','Vijftien staten op één dag, waaronder Californië en Texas.',.36],['Maart','🌷','Florida, Illinois, Ohio en Arizona.',.22],['April en mei','🗽','New York, Pennsylvania en de rest van het oosten.',.22],['Juni','☀️','De laatste staten, waaronder New Jersey.',.148]];
function usMyS(){const P=S.pol;return 22+P.pop*.35+P.steun*.15+kasPts('mp',P.kas||0)*1.6+({gov:8,ek:6,vp:12,mp:22,min:5,kamer:2,burg:3}[P.lvl]||0)+Math.min(10,P.oy*.7)+(S.fame-40)*.06+(P.prim||0)}
const usTbl=rows=>`<div class="plist">${rows.map(r=>`<div class="prow${r.me?' gov':''}"><span>${r.ic||(r.me?'⭐':'👤')}</span><b>${he(r.n)}${r.sub?` <small class="muted">${he(r.sub)}</small>`:''}</b><em>${r.v}</em></div>`).join('')}</div>`;
function usPrimFlow(done){const P=S.pol,W=S.pw;const tot=P.party==='dem'?3950:2429;const need=Math.floor(tot/2)+1;const inc=P.lvl==='mp';const cp=S.cpi||1;
  const C=[{n:myName(),me:1,s:usMyS()+(inc?25:0),d:0,mom:0,in:1}];const me=C[0];
  const nr=inc?1:ri(3,5);for(let i=0;i<nr;i++)C.push({n:lnm(),role:usRole(),s:inc?ri(25,40):ri(32,62)+(i===0?6:0),d:0,mom:0,in:1});
  let i=0;const alive=()=>C.filter(c=>c.in);
  const stand=()=>usTbl(C.filter(c=>c.in||c.d).sort((a,b)=>b.d-a.d).map(c=>({n:c.n,me:c.me,sub:c.me?'':c.role,v:`${nf(c.d)}${c.in?'':' · gestopt'}`})));
  const debate=(t,nx)=>mgDebate(t,sc=>{me.s+=(sc-.5)*14;toast(sc>=.75?'De peilers vinden dat jij het debat wint!':sc>=.5?'Een degelijk optreden.':'Dat debat ging niet goed.');nx()});
  const intro=()=>modal({title:'De voorverkiezingen',em:'🗳️',cat:PTY(P.party).n,text:inc?`Je bent president, maar ${C[1].n} daagt je uit binnen je eigen partij. Je hebt ${nf(need)} gedelegeerden nodig.`:`Zes maanden lang trek je van staat naar staat. Wie ${nf(need)} van de ${nf(tot)} gedelegeerden haalt, wordt de presidentskandidaat van de ${PTY(P.party).n}.`,html:usTbl(C.map(c=>({n:c.n,me:c.me,sub:c.me?'':c.role,v:c.me?'jij':''}))),choices:[{t:'🎤 Naar het eerste debat',cls:'go',on:()=>{closeModal();debate('Het eerste debat',strat)}}]});
  const strat=()=>{const st=US_PRIM[i];const lead=alive().filter(c=>!c.me).sort((a,b)=>b.s-a.s)[0];const kas=P.kas||0;const spend=Math.round(Math.min(kas,kas*.3+US_NEED.mp*cp*.02));
    modal({title:st[0],em:st[1],cat:`Voorverkiezingen · ronde ${i+1} van ${US_PRIM.length}`,text:`${st[2]} Hoe pak je het aan?`,html:stand(),choices:[
     {t:'🚌 Met de campagnebus het land in',s:'Handen schudden in diners en sporthallen',on:()=>{closeModal();me.s+=2.5;run()}},
     {t:'📺 Tv-spots inkopen',s:kas>0?`Kost ${fmt(spend)} uit je campagnekas`:'Je campagnekas is leeg',dis:!(kas>0),on:()=>{closeModal();P.kas-=spend;me.s+=1.5+5*Math.min(1,spend/(US_NEED.mp*cp*.06));run()}},
     ...(lead&&lead.s>me.s-4?[{t:`🗡️ ${lead.n} aanvallen`,s:'Kan ook jezelf raken',on:()=>{closeModal();if(chance(.62)){lead.s-=ri(3,8);toast(`Je aanval op ${lead.n} komt hard aan.`)}else{me.s-=4;toast('Je aanval valt slecht. Kiezers vinden het gemeen.')}run()}}]:[]),
     {t:'🤝 Steun zoeken bij partijprominenten',s:'Gouverneurs en senatoren die zich achter je scharen',on:()=>{closeModal();if(chance(.35+P.steun/220)){me.s+=4;P.steun=clamp(P.steun+3);toast('Een bekende senator steunt je openlijk!')}else toast('De prominenten wachten liever af.');run()}},
     ...(i>=2&&!inc?[{t:'🏳️ Uit de race stappen',cls:'ghost',on:()=>{closeModal();me.in=0;quit()}}]:[])]})};
  const run=()=>{const st=US_PRIM[i];const al=alive();const w=al.map(c=>Math.exp((c.s+c.mom)/9+gauss()*.18));const tw=w.reduce((a,b)=>a+b,0);
    const sh=al.map((c,j)=>w[j]/tw);const dl=Math.round(tot*st[3]);const ok=sh.map(x=>x>=.12?x:0);const to=ok.reduce((a,b)=>a+b,0)||1;
    al.forEach((c,j)=>{c.last=Math.round(sh[j]*100);c.d+=Math.round(dl*ok[j]/to);c.mom=0});const win=al[sh.indexOf(Math.max(...sh))];win.mom=3;
    const rows=al.slice().sort((a,b)=>b.last-a.last).map(c=>({n:c.n,me:c.me,sub:c.me?'':c.role,v:`${c.last}%`}));const news=[];
    if(i>=1)for(const c of al.filter(c=>!c.me&&c.last<9)){c.in=0;const to2=pick(alive().filter(x=>x!==c));if(to2){to2.s+=c.s*.12;news.push(`${c.n} stapt uit de race en steunt ${to2.me?'jou':to2.n}.`)}}
    const top=C.slice().sort((a,b)=>b.d-a.d)[0];
    modal({title:`Uitslag: ${st[0]}`,em:st[1],cat:win.me?'Jij wint!':`${win.n} wint`,text:`${win.me?'Jij wint':win.n+' wint'} ${st[0]} met ${win.last}%.${news.length?' '+news.join(' '):''}`,html:usTbl(rows)+`<p class="muted" style="margin:8px 0 0;font-size:13px">Gedelegeerden: jij ${nf(me.d)} · ${top.me?'jij leidt':`${he(top.n)} leidt met ${nf(top.d)}`} · nodig ${nf(need)}</p>`,choices:[{t:'Verder',cls:'go',on:()=>{closeModal();
      if(alive().length===1){const w=alive()[0];w.d=Math.max(w.d,need+ri(50,400));w.solo=1;return fin(w)}if(top.d>=need||i>=US_PRIM.length-1)return fin(top);i++;if(i===3&&!inc)debate('Debat voor Super Tuesday',strat);else strat()}}]})};
  const quit=()=>{const lead=alive().sort((a,b)=>b.s-a.s)[0];P.steun=clamp(P.steun+4);fin(lead,1)};
  const fin=(w,q)=>{const t=w.me?`Het is binnen!${w.solo?' Al je rivalen zijn uit de race gestapt.':''} Jij hebt ${nf(w.d)} gedelegeerden en wordt de presidentskandidaat van de ${PTY(P.party).n}. Op naar de partijconventie.`:`${w.n} wordt de presidentskandidaat van de ${PTY(P.party).n}.${q?' Jij stapt uit de race en steunt de winnaar.':' Jij grijpt ernaast.'}`;
    if(w.me){P.nom=year();MS(`Werd presidentskandidaat van de ${PTY(P.party).n}`,3);hap(12);P.pop=clamp(P.pop+5)}
    else{P.run=null;W.nom[P.party]={n:w.n,s:w.s,role:w.role,vp:lnm()};hap(q?-2:-8);if(inc){P.lame=1;W.pm.out=1}else if(me.d>=need*.3&&chance(.45))Q.unshift({id:'us_vpoffer'})}
    L(t,w.me?'good big':'');result(w.me?'Presidentskandidaat!':'De race is voorbij',t,'',done,{em:w.me?'🎉':'🏁',cat:'Voorverkiezingen'})};
  intro()}
E('us_prim',{sys:1,need:()=>S.pol&&S.pol.run&&S.pol.run.o==='mp'&&!S.dict,t:'Voorverkiezingen',x:()=>S.pol.lvl==='mp'?'Je wilt herkozen worden, maar je krijgt een uitdager uit je eigen partij.':'Het verkiezingsjaar begint. De voorverkiezingen staan voor de deur.',ch:[['🗳️ Beginnen',()=>({go:()=>usPrimFlow(processQ)})]]});
/* ---------- running mate ---------- */
const US_TR={ervaren:['Ervaren','sterk in debatten, saai op tv'],populair:['Populair','trekt kiezers in de eigen regio'],jong:['Jong en fris','enthousiasme bij jonge kiezers'],risico:['Onvoorspelbaar','groot bereik, maar riskant']};
function usVpOpts(){const P=S.pol;if(P.run.vpo)return P.run.vpo;const o=[];const trs=Object.keys(US_TR).sort(()=>R()-.5);const sts=US_ST.filter(s=>Math.abs(s[3])<=6&&s[1]!==usMy().st[1]).sort(()=>R()-.5);
  for(let i=0;i<3;i++){const st=sts[i]||pick(US_ST);const g=pick(['m','v']);o.push({n:`${rname(g)} ${pick(NAMES[C().r].l)}`,g,st:st[1],stn:st[0],reg:st[4],tr:trs[i],role:pick(['senator','gouverneur','congreslid','oud-generaal','burgemeester'])})}return P.run.vpo=o}
E('us_vp',{sys:1,need:()=>S.pol&&S.pol.nom===year()&&S.pol.run&&!S.pol.run.vp&&!S.dict,t:'Een running mate kiezen',x:'De partijconventie staat voor de deur. Wie wordt jouw kandidaat voor het vicepresidentschap?',ch:[]});
Object.defineProperty(EV.us_vp,'ch',{get(){const P=S.pol;if(!P||!P.run)return [];return usVpOpts().map(v=>[`${v.g==='v'?'👩':'👨'} ${v.n}, ${v.role} uit ${v.stn}`,()=>{P.run.vp=v;const t=US_TR[v.tr];MS(`Koos ${v.n} als running mate`,1);
  return `Op de conventie stel je ${v.n} voor aan het land. ${t[0]}: ${t[1]}. De zaal ontploft. Ballonnen, confetti en een kwartier lang "USA! USA!".`}])}});
/* ---------- campagne voor het presidentschap ---------- */
function usBaseM(opp){const P=S.pol,W=S.pw;const my=P.party;const maj=['dem','rep'].includes(my);
  let m=maj?(W.sh[my]-W.sh[usOther(my)])*.7:-30+P.pop*.4;m+=(P.pop-50)*.12+(usMyS()-opp.s)*.06;
  const e=usEcoE();m+=W.gov[0]===my?e:-e;if(P.lvl==='mp')m+=1.5;if(opp.inc)m-=1.5;if(W.gov[0]===my&&P.lvl!=='mp'&&W.pm&&year()-W.pm.y0>=7)m-=1.5;
  m+=(kasPts('mp',P.kas||0)-5)*.3;return Math.round(m*10)/10}
function usStM(s,G,noise){const P=S.pol,sg=usSgn(P.party),v=P.run&&P.run.vp||{};const home=usMy().st[1];
  return s[3]*sg+G.m+(G.vis[s[1]]||0)*.6+(v.reg===s[4]?1.2:0)+(v.st===s[1]?3:0)+(home===s[1]?3:0)+(noise?gauss()*2.5:0)}
function usGenFlow(done){const P=S.pol,W=S.pw;const my=P.party,op=usOther(my);const opp=W.nom[op];const cp=S.cpi||1;
  const G=P.gen={m:usBaseM(opp),vis:{},y:year()};const RN=['September','Oktober','De laatste week'];let r=0;
  const proj=()=>US_ST.map(s=>({s,mm:usStM(s,G,0)}));
  const swing=()=>proj().sort((a,b)=>Math.abs(a.mm)-Math.abs(b.mm)).slice(0,6);
  const pcard=()=>{let a=0,b=0;for(const x of proj()){if(x.mm>0)a+=x.s[2];else b+=x.s[2]}return `<div class="hemi"><i style="flex:${a};background:${PTY(my).c}"></i><i style="flex:${b};background:${PTY(op).c}"></i></div><p class="muted" style="margin:6px 0 4px;font-size:13px">Landelijke peiling: jij ${pm1(G.m)} · verwachte kiesmannen: jij ${a}, ${he(opp.n)} ${b} · 270 nodig</p>${usTbl(swing().map(x=>({ic:x.mm>0?'🟢':'🔴',n:x.s[0],sub:`${x.s[2]} kiesmannen`,v:pm1(x.mm)})))}`};
  const round=()=>modal({title:RN[r],em:'🗺️',cat:`Campagne tegen ${opp.n}`,text:'In welke swing state voer je deze maand campagne?',html:pcard(),choices:swing().map(x=>({t:`${x.s[0]} · ${x.s[2]} kiesmannen`,s:`Peiling ${pm1(x.mm)}`,on:()=>{closeModal();G.vis[x.s[1]]=(G.vis[x.s[1]]||0)+2.2;how(x.s)}}))});
  const how=st=>{const kas=P.kas||0;const spend=Math.round(kas*.35);modal({title:st[0],em:'📣',cat:RN[r],text:`Je bent in ${st[0]}. Waar zet je op in?`,choices:[
    {t:'🏟️ Een grote rally',s:'Energie en beelden voor het journaal',on:()=>{closeModal();G.m+=.5;nxt()}},
    {t:'🚪 Deur aan deur met vrijwilligers',s:`Extra sterk in ${st[0]}`,on:()=>{closeModal();G.vis[st[1]]+=2;nxt()}},
    {t:'📺 Een groot reclameoffensief',s:kas>0?`Kost ${fmt(spend)}`:'Je campagnekas is leeg',dis:!(kas>0),on:()=>{closeModal();P.kas-=spend;G.m+=.4+1.6*Math.min(1,spend/(US_NEED.mp*cp*.25));nxt()}},
    {t:`🗡️ Negatieve spotjes over ${opp.n}`,s:'Werkt vaak, maar niet altijd',on:()=>{closeModal();if(chance(.6)){G.m+=1.2;toast('De spotjes doen pijn.')}else{G.m-=1;toast('Kiezers vinden het smerig.')}nxt()}}]})};
  const deb=(t,nx)=>mgDebate(t,sc=>{G.m+=(sc-.5)*5;result(t,sc>=.75?`De snelpeiling is duidelijk: jij wint het debat van ${opp.n}.`:sc>=.5?'Geen knock-out, maar ook geen blunders.':`${opp.n} wint het debat. Je staat te hakkelen.`,'',nx,{em:'🎤',cat:'Campagne'})});
  const vpdeb=()=>{const v=P.run.vp||{n:'Je running mate',tr:'ervaren'};const d=v.tr==='ervaren'?.8:v.tr==='risico'?(chance(.5)?1.5:-1.5):gauss()*.6;G.m+=d;
    result('Het vicepresidentsdebat',`${v.n} debatteert tegen ${opp.vp||'de running mate van je tegenstander'}. ${d>.3?'Een sterk optreden!':d<-.3?'Er valt een pijnlijke stilte na een lastige vraag.':'Een gelijkspel, vinden de kijkers.'}`,'',()=>{r=1;round()},{em:'🎙️',cat:'Campagne'})};
  const OS=[
   ['Een oude opname','📼','Er lekt een opname uit waarin je iets ongepasts zegt over een groep kiezers.',[['🙏 Excuses aanbieden',()=>{G.m-=.6;return 'Je biedt je excuses aan. De schade blijft beperkt.'}],['🤷 Afdoen als een grapje',()=>{if(chance(.5)){G.m-=.2;return 'Je achterban vergeeft het je snel.'}G.m-=2;return 'Het blijft dagenlang in het nieuws.'}]]],
   ['Een orkaan','🌀','Een zware orkaan treft de kust van Florida.',[['🚁 Erheen gaan en helpen',()=>{G.vis.FL=(G.vis.FL||0)+2;G.m+=.6;return 'Je staat tussen de puinhopen met een schep in je hand. Sterke beelden.'}],['📞 Op afstand blijven',()=>{G.m-=.4;return 'Kiezers vinden dat je je niet laat zien.'}]]],
   ['De beurs crasht','📉','De beurs zakt in een week 12%. Kiezers zijn bang.',[['📋 Met een plan komen',()=>{const d=gauss()*1.2+.3;G.m+=d;return d>0?'Je plan klinkt geloofwaardig.':'Economen schieten je plan af.'}],['👉 De regering de schuld geven',()=>{const inc=W.gov[0]===my;G.m+=inc?-1:1;return inc?'Maar jouw partij is de regering. Dat werkt niet.':'Het werkt: kiezers geven de regering de schuld.'}]]],
   ['Een schandaal','🗞️',`Een krant onthult dat ${opp.n} jarenlang belasting heeft ontweken.`,[['📣 Er hard op inspelen',()=>{const d=chance(.65)?1.5:-.3;G.m+=d;return d>0?'Je spotjes gaan over niets anders meer. Het werkt.':'Kiezers worden het moddergooien zat.'}],['😌 Er boven staan',()=>{G.m+=.8;return 'Je laat de kranten het werk doen. Kiezers vinden je presidentieel.'}]]]];
  const surp=()=>{if(!chance(.55)){r=2;return round()}const o=pick(OS);modal({title:'October surprise: '+o[0].toLowerCase(),em:o[1],cat:'Campagne',text:o[2],choices:o[3].map(([t,f])=>({t,on:()=>{closeModal();result(o[0],f(),'',()=>{r=2;round()},{em:o[1],cat:'October surprise'})}}))})};
  const end=()=>{const t=`De campagne zit erop. Je laatste peiling: ${pm1(G.m)}. Nu is het aan de kiezers.`;result('Klaar voor de verkiezingsdag',t,'',done,{em:'🇺🇸',cat:'Campagne'})};
  const nxt=()=>[()=>deb('Het eerste presidentsdebat',vpdeb),()=>deb('Het tweede presidentsdebat',surp),end][r]();
  modal({title:'De campagne begint',em:'🇺🇸',cat:`Jij tegen ${opp.n}`,text:`Je tegenstander is ${opp.n}${opp.inc?', de zittende president':opp.role?`, ${opp.role}`:''}. Het draait om een handvol swing states. In de rest van het land ligt de uitslag al zo goed als vast.`,html:pcard(),choices:[{t:'🚀 Aan de slag',cls:'go',on:()=>{closeModal();round()}}]})}
E('us_gen',{sys:1,need:()=>S.pol&&S.pol.nom===year()&&!S.dict,t:'De campagne',x:()=>`Twee maanden tot de verkiezingen. Jij tegen ${S.pw.nom[usOther(S.pol.party)].n}.`,ch:[['🇺🇸 Campagne voeren',()=>({go:()=>usGenFlow(processQ)})]]});
/* ---------- de verkiezingsnacht ---------- */
function usNight(){const P=S.pol,W=S.pw;const G=P.gen&&P.gen.y===year()?P.gen:{m:usBaseM(W.nom[usOther(P.party)]),vis:{}};const my=P.party,op=usOther(my),opp=W.nom[op];
  G.m+=gauss()*2;const res=US_ST.map(s=>({s,mm:usStM(s,G,1)}));let a=0,b=0,i=0,called=0;const pv=Math.round(clamp(50+G.m/2-1.6,15,80)*10)/10;
  const bar_=()=>`<div class="hemi"><i style="flex:${a||.01};background:${PTY(my).c}"></i><i style="flex:${538-a-b};background:#d8dde4"></i><i style="flex:${b||.01};background:${PTY(op).c}"></i></div><p class="muted" style="margin:6px 0 4px;font-size:13px">Jij ${a} · ${he(opp.n)} ${b} · 270 nodig</p>`;
  const step=()=>{const grp=res.filter(x=>x.s[5]===i).sort((x,y)=>y.s[2]-x.s[2]);for(const x of grp){if(x.mm>0)a+=x.s[2];else b+=x.s[2]}
    const done=a>=270||b>=270||i>=7;if(done&&!called){called=a>=270?1:b>=270?2:3}
    const won=grp.filter(x=>x.mm>0),lost=grp.filter(x=>x.mm<=0);const close=grp.filter(x=>Math.abs(x.mm)<2).map(x=>x.s[0]);
    modal({title:`${US_CLOSE[i]} uur`,em:'📺',cat:'Verkiezingsnacht',text:`${grp.length?`De stembureaus sluiten in ${grp.map(x=>x.s[0]).slice(0,4).join(', ')}${grp.length>4?` en ${grp.length-4} andere staten`:''}.`:''}${close.length?` Spannend in ${close.join(', ')}: het duurt uren voor de media de staat toekennen.`:''}`,
      html:bar_()+usTbl(grp.slice(0,8).map(x=>({ic:x.mm>0?'🟢':'🔴',n:x.s[0],sub:`${x.s[2]} kiesmannen`,v:x.mm>0?'jij':opp.n.split(' ').pop()})))+(grp.length>8?`<p class="muted" style="font-size:13px">En nog ${grp.length-8} kleinere staten: ${won.length} voor jou, ${lost.length} voor ${he(opp.n)} in totaal.</p>`:''),
      choices:[{t:done?'De uitslag':'Verder',cls:'go',on:()=>{closeModal();if(done)fin();else{i++;step()}}}]})};
  const fin=()=>{for(;i<7;){i++;for(const x of res.filter(x=>x.s[5]===i)){if(x.mm>0)a+=x.s[2];else b+=x.s[2]}}
    let win=a>b;let tie='';if(a===b){win=usHouseMaj()===my;tie=' Het is 269 tegen 269! Het Huis van Afgevaardigden beslist, en daar heeft '+(win?'jouw':'de andere')+' partij de meeste staten.'}
    W.lastPM=G.m*usSgn(my);const inc=P.lvl==='mp';let t;
    if(win){const ec=pv<50-.4;if(ec)S.flags.ecwin=1;
      if(inc){P.terms=(P.terms||1)+1;if(S.pex)S.pex.pmN=(S.pex.pmN||0)+1;S.flags.pres2=1;W.pm.t=P.terms;MS('Werd herkozen als president van de Verenigde Staten',3);t=`${a} kiesmannen! Je bent herkozen. Nog vier jaar in het Witte Huis.`}
      else{setOffice('mp');P.terms=1;W.pm={n:myName(),p:my,y0:year()+1,t:1};MS('Werd gekozen tot president van de Verenigde Staten',3);t=`${a} kiesmannen! Om 02:14 uur roepen de televisiezenders het uit: jij bent de nieuwe president van de Verenigde Staten. Je tegenstander belt om je te feliciteren.`}
      W.gov=[my];W.vpn={n:(P.run&&P.run.vp&&P.run.vp.n)||(W.vpn&&W.vpn.n)||lnm(),p:my};P.t=year()+4;P.pop=clamp(Math.max(P.pop,52+Math.round(G.m)));hap(22);S.fame=clamp(S.fame+10);
      t+=` Jij haalt ${String(pv).replace('.',',')}% van de stemmen.${ec?' Opvallend: je haalt minder stemmen dan je tegenstander, maar wint wel het kiescollege.':''}${tie}`}
    else{t=`${opp.n} wint met ${b} kiesmannen tegen jouw ${a}. Jij haalt ${String(pv).replace('.',',')}% van de stemmen.${tie}`;hap(-15);
      W.pm={n:opp.n,p:op,y0:year()+1,t:opp.inc&&W.pm?W.pm.t+1:1};W.vpn={n:opp.vp||lnm(),p:op};W.gov=[op];
      if(inc)loseOffice('Je verliest het Witte Huis. Op 20 januari draag je de macht over.');else if(P.lvl==='vp')loseOffice('Je termijn als vicepresident zit erop.');P.pop=clamp(P.pop-8);P.steun=clamp(P.steun-6)}
    W.pdone=year();P.run=null;P.nom=0;P.gen=null;P.kas=Math.round((P.kas||0)*.1);P.prim=0;L(t,win?'good big':'bad');usAfterPres(win?my:op);
    result(win?'Je hebt gewonnen!':'Verloren',t,'',processQ,{em:win?'🇺🇸':'😞',cat:'Verkiezingsnacht'})};
  step()}
E('us_night',{sys:1,need:()=>S.pol&&S.pol.nom===year()&&!S.dict,t:'De verkiezingsnacht',x:'Het is dinsdagavond. Je zit met je familie en je team in een hotelsuite. Alle televisies staan aan.',ch:[['📺 De uitslagen volgen',()=>({go:usNight})]]});
// verkiezingen zonder jou als kandidaat
E('us_pnpc',{sys:1,need:()=>!(S.pol&&S.pol.nom===year())&&S.pw.pdone!==year()&&!S.dict,t:'Presidentsverkiezingen',f:()=>{const W=S.pw,P=S.pol,y=year();if(!W.nom)usNoms(y);const n=W.nom;
  let m=(W.sh.dem-W.sh.rep)*.7+(n.dem.s-n.rep.s)*.08+gauss()*3;const e=usEcoE();m+=W.gov[0]==='dem'?e:-e;if(n.dem.inc)m+=1.5;if(n.rep.inc)m-=1.5;
  if(P&&P.vpOf===y)m+=usSgn(P.party)*(P.pop-45)*.05;
  let a=0;for(const s of US_ST)if(s[3]+m+gauss()*2.5>0)a+=s[2];const w=a>269?'dem':a<269?'rep':usHouseMaj()||'rep';const N=n[w];const ev=w==='dem'?a:538-a;
  const re=!!(W.pm&&W.pm.n===N.n);W.pm={n:N.n,p:w,y0:y+1,t:re?(W.pm.t||1)+1:1};W.vpn={n:N.vp||lnm(),p:w};W.gov=[w];W.lastPM=m;
  const pv=Math.round(clamp(50+Math.abs(m)/2-1.5,40,70)*10)/10;const t=[`${N.n} (${usPty(w)}) ${re?'wordt herkozen':'wint de presidentsverkiezingen'} met ${ev} kiesmannen en ${String(pv).replace('.',',')}% van de stemmen.`];
  if(P){if(P.lvl==='mp'){P.lame=0;if(S.pex)S.pex.expres=1;loseOffice(`Na ${P.terms>=2?'twee termijnen':'je presidentschap'} verlaat je het Witte Huis. ${N.n} volgt je op.`)}
    else if(P.vpOf===y){if(w===P.party){setOffice('vp');W.vpn={n:myName(),p:w};P.t=y+4;S.fame=clamp(S.fame+8);MS('Werd vicepresident van de Verenigde Staten',3);t.push('Jij wordt de nieuwe vicepresident!')}else t.push('Jullie verliezen. Jij wordt geen vicepresident.')}
    else if(P.lvl==='vp'){if(re&&w===P.party){P.t=y+4;W.vpn={n:myName(),p:w};t.push('Jij blijft vicepresident.')}else loseOffice('Je termijn als vicepresident zit erop.')}
    P.vpOf=0;usAfterPres(w)}
  return t.join(' ')}});
function usAfterPres(w){const P=S.pol,W=S.pw;if(!P)return;const meP=P.lvl==='mp';
  if(P.lvl==='min'&&(!meP)){const keep=W.gov[0]===P.party&&W.pm.t>1;if(!keep)loseOffice('Er komt een nieuwe president. Je ministerschap zit erop.')}
  if(!meP&&W.gov[0]===P.party&&['kamer','ek','gov','burg','lid'].includes(P.lvl)&&(P.steun>=58||S.fame>=55)&&(POLO[P.lvl].r>=3||S.fame>=55)&&chance(.4))Q.push({id:'us_cab',c:{port:pick(Object.keys(US_PORT))}});
}
/* ---------- functies in het Witte Huis ---------- */
E('us_vpoffer',{sys:1,need:()=>S.pol&&S.pw.nom&&S.pw.nom[S.pol.party]&&!S.dict,t:'Running mate?',x:()=>`${S.pw.nom[S.pol.party].n}, de presidentskandidaat van jouw partij, belt. "Ik wil dat jij mijn vicepresident wordt."`,ch:[
 ['🤝 Ja, ik doe mee',()=>{const P=S.pol;P.vpOf=year();S.pw.nom[P.party].vp=myName();P.pop=clamp(P.pop+5);S.fame=clamp(S.fame+5);MS('Werd gevraagd als running mate voor het vicepresidentschap',2);return 'Op de conventie sta je naast de kandidaat op het podium. Je bent nu landelijk bekend.'}],
 ['🙅 Nee, bedankt',()=>{S.pol.steun=clamp(S.pol.steun-3);return 'Je houdt je eigen koers. De kandidaat kiest iemand anders.'}]]});
E('us_cab',{sys:1,need:c=>S.pol&&!['mp','vp','min'].includes(S.pol.lvl)&&S.pw.gov[0]===S.pol.party&&!S.dict,t:'Een plek in het kabinet?',x:c=>`De nieuwe president, ${S.pw.pm.n}, belt. Wil jij minister van ${c.port} (${US_PORT[c.port]}) worden? De Senaat moet je benoeming wel goedkeuren.`,ch:[
 ['✅ Ja, graag',c=>{const P=S.pol;const ok=chance(usSenMaj()===P.party?.92:.45);if(!ok){P.pop=clamp(P.pop-4);return 'De hoorzitting in de Senaat gaat slecht. Je benoeming wordt weggestemd.'}setOffice('min',c.port);P.t=null;hap(12);MS(`Werd minister van ${c.port} van de Verenigde Staten`,3);return `De Senaat keurt je benoeming goed. Je wordt beëdigd als minister van ${c.port}.`}],
 ['🙅 Nee, bedankt',()=>'Je blijft liever waar je bent.']]});
E('us_succ',{sys:1,need:()=>S.pol&&S.pol.lvl==='vp'&&!S.dict,t:'Het telefoontje',x:()=>`Om 03:12 uur gaat je telefoon. President ${S.pw.pm.n} is ${pick(['overleden aan een hartaanval','afgetreden na een zwaar schandaal','na een ernstig ongeluk niet meer in staat om te regeren'])}.`,ch:[
 ['🤚 De eed afleggen',()=>{const P=S.pol,W=S.pw;const left=Math.max(0,usNextFor('mp',year()-1)-year());setOffice('mp');P.terms=left>2?1:0;W.pm={n:myName(),p:P.party,y0:year(),t:1};W.vpn={n:lnm(),p:P.party};W.gov=[P.party];P.t=usNextFor('mp',year()-1);P.pop=clamp(P.pop+15);S.fame=clamp(S.fame+15);MS('Werd president van de Verenigde Staten na de dood of het vertrek van de president',3);
  return 'In een kleine kamer, met je hand op een bijbel, leg je de eed af. Je bent de president van de Verenigde Staten.'}]]});
E('us_impeach',{sys:1,need:()=>S.pol&&S.pol.lvl==='mp'&&!S.dict,t:'Impeachment',x:()=>`Het Huis van Afgevaardigden, waar de ${PTY(usHouseMaj()||usOther(S.pol.party)).n} de meerderheid heeft, start een impeachmentprocedure tegen je. ${pick(['Je zou een buitenlandse regering onder druk hebben gezet.','Je zou het Congres hebben voorgelogen.','Je zou overheidsgeld naar je eigen bedrijven hebben gesluisd.'])}`,ch:[
 ['✊ Vechten: dit is een heksenjacht',()=>usImpeach(0)],['🙏 Fouten toegeven en excuses aanbieden',()=>usImpeach(1)],
 ['🚪 Aftreden voordat het zover komt',()=>{const W=S.pw,P=S.pol;W.pm={n:W.vpn.n,p:P.party,y0:year(),t:1};W.vpn={n:lnm(),p:P.party};loseOffice('Je treedt af als president.');P.pop=clamp(P.pop-10);MS('Trad af als president om een impeachment te voorkomen',3);return 'Je houdt een korte toespraak in de Oval Office en stapt de volgende dag in een helikopter. Je vicepresident neemt het over.'}]]});
function usImpeach(apol){const P=S.pol,W=S.pw;P.imp=year();S.flags.impeach=1;const r=P.risk||0;
  if(!chance(apol?.6:.85)){P.pop=clamp(P.pop+(apol?3:1));return 'Het Huis stemt net niet in. De procedure strandt, maar het was op het nippertje.'}
  const own=W.sen[P.party]||0,opp=100-own;const def=Math.round(own*clamp((r-40)/160+(45-P.pop)/150+(apol?.04:0),0,.6));const votes=opp+def;
  if(votes>=67){const vp=W.vpn.n;W.pm={n:vp,p:P.party,y0:year(),t:1};W.vpn={n:lnm(),p:P.party};loseOffice('De Senaat zet je af als president.');S.flags.afgezet=1;P.pop=clamp(P.pop-20);P.steun=clamp(P.steun-25);MS('Werd door de Senaat afgezet als president',3);hap(-25);
    return `Het Huis stemt voor impeachment. In de Senaat stemmen ${votes} senatoren voor afzetting, er waren er 67 nodig. Je bent afgezet. ${vp} wordt president.`}
  P.risk=Math.round(r*.4);if(apol){P.pop=clamp(P.pop+2);P.steun=clamp(P.steun-4)}else{P.steun=clamp(P.steun+8);P.pop=clamp(P.pop-3)}MS('Overleefde een impeachmentprocedure',2);
  return `Het Huis stemt voor impeachment, maar in de Senaat stemmen maar ${votes} senatoren voor afzetting. Er waren er 67 nodig. Je blijft president.`}
E('us_scotus',{sys:1,need:()=>S.pol&&S.pol.lvl==='mp'&&!S.dict,t:'Een plek in het Hooggerechtshof',x:()=>{const W=S.pw;return `Een rechter van het Hooggerechtshof ${pick(['gaat met pensioen','is overleden'])}. Nu: ${W.scotus.c} conservatieve en ${W.scotus.l} progressieve rechters. Jij mag een nieuwe rechter voordragen, voor het leven.`},ch:[
 [`⚖️ Een uitgesproken rechter van jouw kant`,()=>usJudge(1)],['🧑‍⚖️ Een gematigde rechter',()=>usJudge(0)]]});
function usJudge(hard){const P=S.pol,W=S.pw,J=W.scotus;const mine=PTY(P.party).pc>=50?'c':'l';const ok=chance(usSenMaj()===P.party?(hard?.88:.95):(hard?.2:.6));
  if(!ok){P.pop=clamp(P.pop-3);return 'De Senaat wijst je kandidaat af na dagenlange hoorzittingen. De plek blijft voorlopig leeg.'}
  const out=chance(J.c/(J.c+J.l))?'c':'l';J[out]--;const nw=hard||chance(.5)?mine:(mine==='c'?'l':'c');J[nw]++;
  if(hard){P.steun=clamp(P.steun+6);P.pop=clamp(P.pop-1)}else{P.steun=clamp(P.steun-3);P.pop=clamp(P.pop+2)}MS('Benoemde een rechter in het Hooggerechtshof',2);
  return `De Senaat keurt je kandidaat goed. Het Hooggerechtshof telt nu ${J.c} conservatieve en ${J.l} progressieve rechters.`}
// het Congres stuurt een wet naar het Witte Huis
E('us_bill',{sys:1,need:c=>S.pol&&S.pol.lvl==='mp'&&!S.dict&&c.k&&LAWS[c.k],t:'Een wet op je bureau',x:c=>`Het Congres heeft een wet aangenomen. ${usLawD(c.k,c.d)} Teken je hem, of gebruik je je veto?`,ch:[
 ['✍️ Ondertekenen',c=>{const P=S.pol,L_=LAWS[c.k];const fit=(PTY(P.party)[L_.ax]-50)*L_.up*c.d>=0;setLaw(c.k,c.d);P.pop=clamp(P.pop+Math.round(L_.pp*c.d)+1);P.steun=clamp(P.steun+(fit?3:-6));return `Je zet je handtekening in de Oval Office. ${L_.t}: nu ${L_.f(law(c.k))}.${fit?'':' Je eigen partij is er niet blij mee.'}`}],
 ['🚫 Veto',c=>{const P=S.pol,W=S.pw;const opp=usOther(P.party);const over=(W.seats[opp]||0)>=290&&(W.sen[opp]||0)>=67;const L_=LAWS[c.k];const fit=(PTY(P.party)[L_.ax]-50)*L_.up*c.d>=0;
   if(over){setLaw(c.k,c.d);P.pop=clamp(P.pop-3);return 'Je spreekt je veto uit, maar het Congres overstemt je met een tweederdemeerderheid. De wet komt er toch.'}
   P.steun=clamp(P.steun+(fit?-3:4));return 'Je spreekt je veto uit. Het Congres haalt de tweederdemeerderheid niet om je te overstemmen. De wet is van tafel.'}]]});
function usBillCtx(){const W=S.pw;const t=usTrif()||usHouseMaj()||pick(['dem','rep']);const p=PTY(t);const ks=Object.keys(LAWS).filter(lawOk).sort(()=>R()-.5);
  for(const k of ks){const L_=LAWS[k];const d=Math.sign((p[L_.ax]-50)*L_.up)||1;const i=lawIdx(k)+d;if(i>=0&&i<L_.v.length)return {k,d}}return null}
Object.assign(EVMETA,{us_race:['Verkiezingen','🗳️'],us_cong:['Verkiezingen','🏛️'],us_stem:['Verkiezingen','🗳️'],us_prim:['Verkiezingen','🗳️'],us_vp:['Verkiezingen','🤝'],us_gen:['Verkiezingen','🇺🇸'],us_night:['Verkiezingen','📺'],us_pnpc:['Verkiezingen','🇺🇸'],
 us_vpoffer:['Politiek','🤝'],us_cab:['Politiek','🏛️'],us_succ:['Politiek','🤚'],us_impeach:['Politiek','⚖️'],us_scotus:['Politiek','⚖️'],us_bill:['Politiek','✍️']});
/* ---------- wetten via het Congres ---------- */
const usLawD=(k,d)=>{const L_=LAWS[k];return L_.v.length===2?`De wet ${lawTxt(k,d)}.`:`${L_.t}: van ${L_.f(law(k))} naar ${L_.f(L_.v[lawIdx(k)+d])}.`};
const US_RECON=['ib','verm','vpb','erf'];// belastingwetten: via de begroting, geen filibuster
const senNeed=k=>US_RECON.includes(k)?51:60;
function usChamber(seats,k,dir,o,noise){let y=0;for(const pid in seats){const n=seats[pid]||0;if(!n||!PTY(pid))continue;let pr=lawProb(k,dir,pid,o);const P=S.pol;if(P&&P.lvl==='mp'&&pid!==P.party)pr=clamp(pr+((P.cong||40)-40)/400,0,1);y+=noise?Math.round(n*clamp(pr+gauss()*.07,0,1)):n*pr}return Math.round(y)}
function usPresSigns(k,dir){const P=S.pol,W=S.pw;if(P&&P.lvl==='mp')return 1;return lawProb(k,dir,W.pm.p,{})}
function presLawPlan(k,dir,o={}){const P=S.pol,W=S.pw;const h=usChamber(W.seats,k,dir,o),s=usChamber(W.sen,k,dir,o);const sn=senNeed(k);const ps=usPresSigns(k,dir);
  modal({title:'Naar het Congres',em:'🏛️',cat:'Wetsvoorstel',text:`Je voorstel: ${usLawD(k,dir)} Verwachte steun: ${h} van 435 in het Huis (218 nodig) en ${s} van 100 in de Senaat (${sn} nodig${sn===60?', anders blokkeert een filibuster het':', als begrotingswet'}).${P.lvl==='mp'?'':` Daarna moet president ${W.pm.n} nog tekenen: ${ps>.6?'dat doet die waarschijnlijk':ps>.35?'dat is onzeker':'grote kans op een veto'}.`}`,choices:opts([
    {t:'🗳️ In stemming brengen',cls:'go',on:()=>{closeModal();presLawVote(k,dir,o)}},
    {t:'🤝 Eerst steun zoeken aan de andere kant',s:o.lob?'Al gedaan':'Kost wat steun in je eigen partij',dis:!!o.lob,on:()=>{closeModal();P.steun=clamp(P.steun-4);o.lob=1;toast('Je belt, luncht en ruilt een week lang gunsten.');presLawPlan(k,dir,o)}}])})}
function presLawVote(k,dir,o){const P=S.pol,W=S.pw;S.acts.wet=1;const L_=LAWS[k];const h=usChamber(W.seats,k,dir,o,1),s0=usChamber(W.sen,k,dir,o,1);const sn=senNeed(k);
  let s=s0,tb='';if(s===50&&sn===51){const vp=W.vpn&&W.vpn.p;const yes=vp&&lawProb(k,dir,vp,o)>.5;if(yes){s=51;tb=' De vicepresident brengt de beslissende stem uit.'}}
  const fits=(PTY(P.party)[L_.ax]-50)*L_.up*dir>=0;let txt=`Huis: ${h} voor, ${435-h} tegen. Senaat: ${s0} voor, ${100-s0} tegen.${tb} `;let ok=h>=218&&s>=sn;
  if(ok&&P.lvl!=='mp'){if(!chance(usPresSigns(k,dir))){const over=h>=290&&s>=67;txt+=`President ${W.pm.n} spreekt een veto uit.`;if(over)txt+=' Maar het Congres overstemt het veto met een tweederdemeerderheid!';else{txt+=' Er is geen tweederdemeerderheid om het veto te breken.';ok=false}}}
  else if(!ok&&h>=218&&s>=51&&s<sn)txt+='Een filibuster in de Senaat blokkeert je wet: er waren 60 stemmen nodig. ';
  if(ok){setLaw(k,dir);P.laws=(P.laws||0)+1;P.pop=clamp(P.pop+Math.round(L_.pp*dir)+2);P.steun=clamp(P.steun+(fits?6:-8));hap(6);
    txt+=`${P.lvl==='mp'?'Je tekent de wet in de Rozentuin.':'De wet is aangenomen!'} Vanaf nu: ${L_.t.toLowerCase()} ${L_.f(law(k))}.${fits?'':' Je eigen achterban is er niet blij mee.'}`;L(`Jouw wet is aangenomen: ${L_.t} → ${L_.f(law(k))}.`,'good big');S.flags.wet=1;S.pex&&(S.pex.laws=(S.pex.laws||0)+1);if(P.laws===1)MS(`Kreeg een eigen wet door het Congres (${L_.t.toLowerCase()})`,2)}
  else{P.pop=clamp(P.pop-2);P.steun=clamp(P.steun-2);hap(-3);txt+='Je wet haalt het niet.';L(`Je wetsvoorstel over ${L_.t.toLowerCase()} haalt het niet.`,'bad')}
  result(ok?'Aangenomen!':'Verworpen',txt.trim(),'',()=>{refreshSheet();render();saveLife()},{em:ok?'✅':'❌',cat:'Het Congres'})}
function presBudVote(b,nm){const W=S.pw,P=S.pol;const def=budSpend(b)+budTax();let ok=1;const cnt={};
  for(const [ch,seats,need] of [['h',W.seats,218],['s',W.sen,51]]){let n=0;for(const pid of Object.keys(seats)){if(!seats[pid]||!PTY(pid))continue;const p=PTY(pid),left=(50-p.lr)/50,cons=(p.pc-50)/50;
      const sc=(b.sociaal-2)*left+(b.zorg-2)*left*.7+(b.onderwijs-2)*(left*.5+.3)+(b.defensie-2)*(cons-left*.3)+(b.infra-2)*(.3-left*.2)-Math.max(0,def)*(p.lr/100)*.25;
      const pr=clamp(.5+sc*.12+(W.gov.includes(pid)?.3:-.15),.03,.97);n+=Math.round(seats[pid]*clamp(pr+gauss()*.06,0,1))}cnt[ch]=n;if(n<need)ok=0}
  if(ok){P.pop=clamp(P.pop+(def>2?-2:1));ecoNews(`Het Congres keurt de ${nm.toLowerCase()} goed.`,1);return `Het Huis (${cnt.h} stemmen) en de Senaat (${cnt.s} stemmen) keuren de ${nm.toLowerCase()} goed.`}
  if(S.budPrev)Object.assign(b,S.budPrev);S.budPrev=null;setDefb(b.defensie);P.pop=clamp(P.pop-5);ecoNews('Het Congres stemt de begroting weg. De overheid gaat op slot.',1);hap(-3);
  return `Het Congres stemt tegen (Huis ${cnt.h}, Senaat ${cnt.s}). Er is geen geld meer: de federale overheid gaat op slot. Musea sluiten, ambtenaren worden naar huis gestuurd. Na drie weken komt er een noodbegroting waarin alles blijft zoals het was.`}
/* ---------- het scherm ---------- */
const US_HOW='De Verenigde Staten hebben een presidentieel stelsel met twee grote partijen: de Democraten en de Republikeinen. Je stemt niet op een lijst, maar op een persoon. Voor elke functie win je eerst de voorverkiezing binnen je eigen partij en daarna de echte verkiezing in je stad, district of staat.\n\nDe president wordt elke vier jaar gekozen en mag maximaal twee termijnen blijven. Het gaat niet om de meeste stemmen, maar om het kiescollege: elke staat levert kiesmannen, en wie er 270 haalt, wint. Daardoor draait de campagne om een handvol swing states.\n\nHet Congres maakt de wetten. Het Huis van Afgevaardigden (435 leden, elke twee jaar gekozen) en de Senaat (100 senatoren, voor zes jaar) moeten allebei instemmen. In de Senaat zijn voor de meeste wetten 60 stemmen nodig, anders blokkeert een filibuster het. De president kan een veto uitspreken; alleen een tweederdemeerderheid kan dat breken.\n\nDe president benoemt ministers en rechters, maar de Senaat moet ze goedkeuren. Het Huis kan een president aanklagen (impeachment). Met twee derde van de Senaat wordt een president afgezet.';
function usHowRow(el){const s=sec(el,'');row(s,{ic:'❓',t:'Hoe werkt de politiek hier?',s:'Het Amerikaanse stelsel in het kort',dots:true,on:()=>modal({title:'Politiek in de VS',em:'🇺🇸',cat:'Uitleg',text:US_HOW,choices:[{t:'Duidelijk',cls:'go',on:closeModal}]})})}
function usOffLbl(o){const y=usNextFor(o,year()-1)<=year()?usNextFor(o):usNextFor(o,year()-1);return y}
function usRunMenu(){const P=S.pol,a=ageY();const L_=['raad','burg','stl','kamer','ek','gov','mp'];
  modal({title:'Kandidaat stellen',em:'🗳️',cat:PTY(P.party).n,text:'Voor welke functie stel je je kandidaat? Je kunt maar voor één functie tegelijk meedoen.',choices:opts(L_.filter(o=>o!==P.lvl).map(o=>{const y=usNextFor(o);const age=a+(y-year());let why='';
    if(age<US_AGE[o])why=`Vanaf ${US_AGE[o]} jaar`;else if(o==='mp'&&!usNatBorn())why='Alleen wie in de VS is geboren';else if(o==='mp'&&POLO[P.lvl].r<3&&P.pop<40&&S.fame<55)why='Je bent nog te onbekend';
    return {t:`${POLO[o].t}${o==='kamer'?'':o==='ek'?` voor ${usMy().st[0]}`:''}`,s:why||`Verkiezingen in ${y} · ${o==='mp'?'voorverkiezingen, campagne, kiescollege':cap(US_ONM[o])}`,dis:!!why,on:()=>{closeModal();if(o==='kamer')return usDistMenu(y);usSetRun(o,y)}}}))})}
function usSetRun(o,y){const P=S.pol;P.run={o,y};if(o==='mp'){P.pop=clamp(P.pop+3);S.fame=clamp(S.fame+3);L(`Je maakt bekend dat je meedoet aan de presidentsverkiezingen van ${y}.`,'big');MS(`Stelde zich kandidaat voor het presidentschap`,2)}
  toast(`Je bent kandidaat voor ${US_ONM[o]||polTl(o)} (${y}).`);refreshSheet()}
function usDistMenu(y){const P=S.pol;const {st,cl}=usMy();const base=cl*.45+st[3]*.4;const ds=P.distO&&P.distO.y===y?P.distO.d:[base+14,base,base-14].map((l,i)=>({n:`${st[1]}-${ri(1,Math.max(3,Math.round(st[2]/2)))}`,lean:Math.round(l+gauss()*4)}));P.distO={y,d:ds};
  const sg=usSgn(P.party);modal({title:'Welk district?',em:'🗺️',cat:'Huis van Afgevaardigden',text:`In welk district van ${st[0]} doe je mee? Hoe meer kiezers van jouw partij, hoe makkelijker de verkiezing, maar ook hoe zwaarder de voorverkiezing.`,choices:opts(ds.map(d=>({t:`District ${d.n}`,s:sg?`${d.lean*sg>8?'Veilig voor jouw partij':d.lean*sg>-4?'Een swing district':'Lastig: de andere partij is hier sterk'} · ${d.lean>=0?'D':'R'}+${Math.abs(d.lean)}`:`${d.lean>=0?'D':'R'}+${Math.abs(d.lean)}`,on:()=>{closeModal();P.dist=d;usSetRun('kamer',y)}})))})}
function usFundRows(s,P){const o=P.run?P.run.o:P.lvl;if(!US_NEED[o])return;const cp=S.cpi||1;const need=US_NEED[o]*cp;
  row(s,{ic:'💵',t:'Geld inzamelen',s:`Campagnekas ${fmt(P.kas||0)} · ${(P.kas||0)>=need?'ruim genoeg':`voor ${US_ONM[o]||polTl(o)} is zo'n ${fmt(need)} nodig`}`,on:()=>doAct('Geld inzamelen',()=>{const m=use('usfund');const g=Math.round((2000+P.pop*P.pop*40)*US_MULT[o]*m*cp*(.7+R()*.6));P.kas=(P.kas||0)+g;P.risk=(P.risk||0)+(o==='mp'?1:0);
    return g?pick([`Een dinertje van ${fmt(Math.round(3300*cp))} per persoon in een villa. Opbrengst: ${fmt(g)}.`,`Je belt een middag lang donateurs. Je oor gloeit, maar er komt ${fmt(g)} binnen.`,`Een mail aan je achterban met "Laatste kans!" in de onderwerpregel levert ${fmt(g)} op aan kleine giften.`]):'Je donateurs zijn het een beetje zat. Probeer het volgend jaar weer.'},true,'💵')});
  row(s,{ic:'🏦',t:'Eigen geld in de campagne',s:'Niemand kan zeggen dat je gekocht bent',dis:S.money<=0,dots:true,on:()=>amountModal('Eigen geld',S.money,v=>doAct('Eigen geld',()=>{cash(-v);P.kas=(P.kas||0)+v;return `Je stort ${fmt(v)} van je eigen geld in de campagne.`},true,'🏦'))});
  if(P.run||(P.t&&P.t-year()<=1))row(s,{ic:'📣',t:'Campagne voeren',s:'Rally\'s, townhalls en handen schudden',on:()=>doAct('Campagne',()=>{const m=use('uscamp');P.camp=(P.camp||0)+Math.round(4*m);P.pop=clamp(P.pop+Math.round(2*m));return pick(['Je spreekt in een sporthal vol mensen met borden met jouw naam.','Je eet pannenkoeken in een diner en praat met iedereen aan de bar.','Een townhall in een school. De vragen zijn scherp, maar je houdt je staande.'])},true,'📣')});
  if(P.run&&P.run.o==='mp'&&year()<P.run.y)row(s,{ic:'🌽',t:'Alvast naar Iowa en New Hampshire',s:'Een voorsprong in de eerste staten',on:()=>doAct('Iowa',()=>{const m=use('usiowa');P.prim=Math.min(12,(P.prim||0)+Math.round(3*m));return pick(['Je bezoekt alle 99 county\'s van Iowa. Je hebt nu een mening over maïs.','Je staat op een kerkfeest in New Hampshire. Iemand vraagt om een selfie.','Je rijdt in een week twaalfhonderd kilometer langs boerderijen en diners.'])},true,'🌽')})}
const US_EO=[['🧱','Grensbewaking aanscherpen','pc',1],['🌱','Strengere klimaatregels voor bedrijven','pc',-1],['🎓','Studieschulden kwijtschelden','lr',-1,'debt'],['📦','Importheffingen op buitenlandse producten','pc',1,'tarief'],
 ['🔫','Strengere controles bij wapenverkoop','pc',-1],['🏭','Regels voor bedrijven schrappen','lr',1],['🛢️','Meer olie- en gasboringen toestaan','pc',1],['💊','Medicijnprijzen aan banden leggen','lr',-1]];
function usEOMenu(){const P=S.pol,W=S.pw;modal({title:'Presidentieel decreet',em:'📜',cat:'Executive order',text:`Met een decreet regel je iets zonder het Congres. Maar het Hooggerechtshof (${W.scotus.c} conservatief, ${W.scotus.l} progressief) kan het tegenhouden.`,choices:opts(US_EO.map(([e,t,ax,d,x])=>({t:`${e} ${t}`,s:(PTY(P.party)[ax]-50)*d>0?'Je achterban is voor':'Je achterban is tegen',on:()=>{closeModal();doAct('Decreet',()=>{S.acts.eo=(S.acts.eo||0)+1;const fit=(PTY(P.party)[ax]-50)*d>0;
    const blk=chance(clamp(.08+((d<0?W.scotus.c:W.scotus.l)-4.5)*.07,.03,.4));if(blk){P.pop=clamp(P.pop-2);return `${t}: je tekent het decreet, maar het Hooggerechtshof blokkeert het. "Daar gaat de president niet over."`}
    P.steun=clamp(P.steun+(fit?5:-6));P.pop=clamp(P.pop+ri(-2,3));const E_=ecoW();if(x==='debt')E_.debt=Math.round((E_.debt+1.5)*10)/10;if(x==='tarief'){E_.inf=(E_.inf||2)+.6;E_.g=(E_.g||1)-.3}
    return `${t}: je tekent het decreet aan je bureau in de Oval Office, met een dikke viltstift. De camera's klikken.${x==='tarief'?' Economen waarschuwen voor hogere prijzen.':x==='debt'?' Het kost de schatkist miljarden.':''}`},true,e)}})))})}
function usOfficeRows(f,P){const R_=(ic,t,s,fn,o={})=>row(f,{ic,t,s,dis:o.dis,dots:o.dots,on:fn});const D=(t,fn,ic)=>()=>doAct(t,fn,true,ic);const {st}=usMy();const lw=['kamer','ek','min','mp'].includes(P.lvl);
  if(P.lvl==='raad'){R_('📜','Voorstel indienen','Over iets in je eigen stad',motieMenu,{dots:true});R_('🚶','De wijk in','Luisteren naar bewoners',D('Wijkbezoek',()=>{const m=use('pwijk');P.pop=clamp(P.pop+Math.round(3*m));return pick(['Bewoners klagen over gaten in de weg. Je belooft er werk van te maken.','Je drinkt koffie in een buurthuis en hoort tien verhalen.'])},'🚶'))}
  if(P.lvl==='burg'){R_('🔑','De sleutel van de stad uitreiken','Aan een plaatselijke held',D('Sleutel',()=>{const m=use('ussl');P.pop=clamp(P.pop+Math.round(3*m));return `Je geeft de sleutel van ${S.p.city} aan ${pick(['een brandweerman die drie kinderen redde','een honkbalteam dat kampioen werd','een lerares die al veertig jaar lesgeeft'])}.`},'🔑'));
    R_('🚓','Politiebeleid','Meer agenten of meer preventie',()=>modal({title:'Politiebeleid',em:'🚓',cat:'Burgemeester',text:'Wat is jouw koers?',choices:opts([{t:'👮 Meer agenten op straat',on:()=>{closeModal();doAct('Politie',()=>{use('uspol');const g=PTY(P.party).pc>=50;P.steun=clamp(P.steun+(g?4:-4));P.pop=clamp(P.pop+(chance(.5)?3:-2));return 'Er komen honderd nieuwe agenten.'},true,'👮')}},{t:'🏀 Investeren in jongerenwerk',on:()=>{closeModal();doAct('Preventie',()=>{use('uspol');const g=PTY(P.party).pc<50;P.steun=clamp(P.steun+(g?4:-4));P.pop=clamp(P.pop+(chance(.5)?3:-2));return 'Er gaan twee nieuwe jongerencentra open.'},true,'🏀')}}])}),{dots:true});
    R_('🏗️','Groot project starten',S.acts.proj?'Al gestart dit jaar':'Woningen, een stadion of een metrolijn',projMenu,{dis:!!S.acts.proj,dots:true})}
  if(P.lvl==='stl'){R_('📜',`Een wet in ${st[0]}`,'In het Capitool van je staat',D('Staatswet',()=>{const m=use('usstl');if(chance(.5+(P.steun-50)/200)){P.pop=clamp(P.pop+Math.round(3*m));P.steun=clamp(P.steun+2);return `Je wet over ${pick(['betere bussen op het platteland','gratis schoolontbijt','strengere regels voor vrachtwagens'])} wordt aangenomen!`}P.pop=clamp(P.pop-1);return 'Je wet sneuvelt in de commissie.'},'📜'));
    R_('🎤','Debat in het staatsparlement','Minigame',()=>mgDebate('Debat',sc=>doAct('Debat',()=>{use('pkd');P.pop=clamp(P.pop+Math.round((sc-.45)*8));P.steun=clamp(P.steun+Math.round((sc-.4)*8));return sc>=.7?'Je speech gaat rond in de staat.':'Een rommelig debat.'},true,'🎤')),{dots:true})}
  if(P.lvl==='kamer'){R_('🔎','Hoorzitting in je commissie',"Een topman onder vuur",D('Hoorzitting',()=>{const m=use('ushz');if(chance(.55+(S.st.smarts-50)/250)){P.pop=clamp(P.pop+Math.round(4*m));return `Je ondervraagt de baas van ${pick(['een techbedrijf','een oliemaatschappij','een grote bank','een farmaceut'])}. Je filmpje gaat viraal.`}P.pop=clamp(P.pop-2);return 'Je vragen zijn slecht voorbereid. De topman glimlacht.'},'🔎'));
    R_('💰','Geld binnenhalen voor je district','Een nieuwe brug, een fabriek of een ziekenhuis',D('Geld voor je district',()=>{const m=use('usear');P.camp=(P.camp||0)+Math.round(4*m);P.pop=clamp(P.pop+Math.round(2*m));return `Je regelt ${pick(['geld voor een nieuwe brug','een legerorder voor een fabriek','een nieuwe vleugel voor het ziekenhuis'])} in ${usDist().n}. Dat onthouden je kiezers.`},'💰'));
    R_('🏫','Townhall in je district','Kiezers stellen vragen, live',D('Townhall',()=>{const m=use('ustow');if(chance(.65)){P.pop=clamp(P.pop+Math.round(4*m));return 'Een volle zaal. Je beantwoordt elke vraag. Applaus.'}P.pop=clamp(P.pop-3);return 'Een boze kiezer schreeuwt je de zaal uit. Het filmpje gaat rond.'},'🏫'));
    R_('🎤','Debat op de vloer van het Huis','Minigame',()=>mgDebate('Debat in het Huis',sc=>doAct('Debat',()=>{use('pkd');P.pop=clamp(P.pop+Math.round((sc-.45)*10));P.steun=clamp(P.steun+Math.round((sc-.4)*8));return sc>=.75?'Je speech komt op het journaal!':'Je speecht voor een halflege zaal.'},true,'🎤')),{dots:true})}
  if(P.lvl==='ek'){R_('🗣️','Een filibuster houden','Uren achter elkaar praten om een wet tegen te houden',D('Filibuster',()=>{if(S.acts.fil)return 'Je stem moet eerst herstellen. Volgend jaar weer.';S.acts.fil=1;const h=ri(4,24);P.steun=clamp(P.steun+5);P.pop=clamp(P.pop+(chance(.5)?3:-2));S.st.health=clamp(S.st.health-1);return `Je praat ${h} uur aan één stuk. Je leest zelfs voor uit een kookboek. ${h>15?'Je haalt het nieuws in het hele land.':'De wet wordt uitgesteld.'}`},'🗣️'));
    R_('🔎','Een benoeming kritisch ondervragen','Een kandidaat-minister of -rechter',D('Hoorzitting',()=>{const m=use('ushz');P.pop=clamp(P.pop+Math.round(3*m));return pick(['Je vragen zijn scherp. De kandidaat zweet.','Je stelt één vraag die de hele hoorzitting kantelt.'])},'🔎'));
    R_('🎤','Debat in de Senaat','Minigame',()=>mgDebate('Debat in de Senaat',sc=>doAct('Debat',()=>{use('pkd');P.pop=clamp(P.pop+Math.round((sc-.45)*10));P.steun=clamp(P.steun+Math.round((sc-.4)*8));return sc>=.75?'Een speech die in de geschiedenisboeken kan.':'Een degelijke speech.'},true,'🎤')),{dots:true})}
  if(P.lvl==='gov'){R_('📊','De staatsbegroting presenteren',`De financiën van ${st[0]}`,D('Staatsbegroting',()=>{if(S.acts.sbud)return 'De begroting van dit jaar is al gepresenteerd.';S.acts.sbud=1;if(chance(.6)){P.pop=clamp(P.pop+4);return 'Een sluitende begroting met geld voor scholen. Het staatsparlement stemt in.'}P.pop=clamp(P.pop-4);return 'Er zit een gat van een miljard in je begroting. De kranten smullen.'},'📊'));
    R_('🪖','De Nationale Garde inzetten','Bij een ramp of rellen',D('Nationale Garde',()=>{if(S.acts.garde)return 'De Garde is dit jaar al ingezet.';S.acts.garde=1;const w=pick(['een overstroming','bosbranden','een tornado','rellen in de hoofdstad']);if(chance(.65)){P.pop=clamp(P.pop+5);return `Na ${w} stuur je de Nationale Garde. Je staat zelf in de modder. Mensen zijn je dankbaar.`}P.pop=clamp(P.pop-4);return `Na ${w} komt de Garde te laat. De kritiek is fel.`},'🪖'));
    R_('⚖️','Een gratieverzoek','Een veroordeelde vraagt om genade',()=>modal({title:'Gratieverzoek',em:'⚖️',cat:'Gouverneur',text:'Een man zit al 25 jaar vast voor een overval. Hij heeft zijn leven gebeterd. Verleen je gratie?',choices:opts([{t:'🕊️ Gratie verlenen',on:()=>{closeModal();doAct('Gratie',()=>{use('usgr');kar(3);if(chance(.8)){P.pop=clamp(P.pop+1);return 'Hij komt vrij en omhelst zijn kleinkinderen. Een mooi verhaal in de krant.'}P.pop=clamp(P.pop-8);return 'Een half jaar later wordt hij opnieuw opgepakt. Je tegenstanders gebruiken het jarenlang tegen je.'},true,'🕊️')}},{t:'🚫 Afwijzen',on:()=>{closeModal();doAct('Gratie',()=>{use('usgr');return 'Je wijst het verzoek af.'},true,'🚫')}}])}),{dots:true});
    R_('🤝','Handelsmissie','Bedrijven naar je staat halen',D('Handelsmissie',()=>{const m=use('ushm');P.pop=clamp(P.pop+Math.round(3*m));return `Je reist naar ${pick(['Japan','Duitsland','Mexico','Zuid-Korea','Canada'])}. Een autofabrikant belooft een fabriek in ${st[0]}.`},'🤝'))}
  if(P.lvl==='vp'){R_('🔨','De Senaat voorzitten','Bij een gelijke stand beslis jij',D('Senaat',()=>{const m=use('usvps');P.steun=clamp(P.steun+Math.round(3*m));return pick(['Het staat 50–50. Jij brengt de beslissende stem uit. De zaal houdt de adem in.','Je zit drie uur voor in de Senaat. Er wordt vooral heel lang gepraat.'])},'🔨'));
    R_('✈️','Namens de president op reis','Begrafenissen, inhuldigingen en topconferenties',D('Reis',()=>{const m=use('usvpr');P.pop=clamp(P.pop+Math.round(2*m));return `Je reist naar ${pick(['een staatsbegrafenis in Japan','een inhuldiging in Brazilië','een top in Brussel','een vredesconferentie in Genève'])}.`},'✈️'));
    R_('📚','Je voorbereiden op het presidentschap','Je weet maar nooit',D('Voorbereiding',()=>{const m=use('usvpb');sma(Math.round(2*m));return 'Elke ochtend krijg je dezelfde inlichtingen als de president. Je slaapt er niet beter van.'},'📚'))}
  if(P.lvl==='min'){R_('🎙️','Persconferentie',`Over je ministerie (${US_PORT[P.port]||''})`,D('Persconferentie',()=>{use('ppc');if(chance(.55+(S.st.smarts-50)/250)){P.pop=clamp(P.pop+ri(3,6));return 'Je brengt je boodschap rustig en duidelijk.'}P.pop=clamp(P.pop-ri(3,6));return 'Een journalist stelt een vraag waar je niet op voorbereid bent.'},'🎙️'));
    R_('🏛️','Getuigen voor het Congres','Uren vragen van senatoren',D('Getuigen',()=>{const m=use('usget');if(chance(.55+(S.st.smarts-50)/250)){P.pop=clamp(P.pop+Math.round(3*m));return 'Je blijft kalm onder vuur. Zelfs de oppositie is onder de indruk.'}P.pop=clamp(P.pop-3);return 'Je raakt geïrriteerd bij een vraag. Het fragment gaat de hele dag rond.'},'🏛️'));
    if(P.port==='Buitenlandse Zaken'||P.port==='Defensie')R_('✈️','Buitenlandse reis','Overleg met bondgenoten',D('Buitenland',()=>{const m=use('pbr');P.pop=clamp(P.pop+Math.round(3*m));return `Je vliegt naar ${pick(['Londen','Brussel','Tokio','Seoel','Kyiv','Ottawa','Mexico-Stad'])}. Een productief overleg.`},'✈️'))}
  if(P.lvl==='cdk')R_('🥂','Een receptie op de ambassade',P.port||'',D('Receptie',()=>{const m=use('usamb');P.pop=clamp(P.pop+Math.round(2*m));hap(2);return `Je viert de Fourth of July in de ambassade in ${P.port}. Hamburgers, vuurwerk en heel veel handen schudden.`},'🥂'));
  if(P.lvl==='mp'){R_('📜','Presidentieel decreet',(S.acts.eo||0)>=2?'Al twee decreten dit jaar':'Regelen zonder het Congres',usEOMenu,{dis:(S.acts.eo||0)>=2,dots:true});
    R_('🏛️','Kabinetsvergadering','Twee ministers botsen',ministerraad,{dots:true,dis:!!S.acts.mr});
    R_('🎙️','Toespraak vanuit de Oval Office','Live op alle zenders',D('Toespraak',()=>{if(S.acts.oval)return 'Je hebt dit jaar al een toespraak gehouden.';S.acts.oval=1;if(chance(.55+S.sk.sociaal/300)){P.pop=clamp(P.pop+5);return 'Je toespraak raakt het land. Je populariteit schiet omhoog.'}P.pop=clamp(P.pop-2);return 'Je klinkt houterig. Na tien minuten zappen mensen weg.'},'🎙️'));
    R_('⛳','Golfen met senatoren','Goede banden met het Congres',D('Golf',()=>{const m=use('usgolf');P.cong=clamp((P.cong||40)+Math.round(8*m));hap(2);return pick(['Je slaat een hole-in-one. De senator van de andere partij moet erom lachen.','Vier uur golf en een akkoordje over wegen in Kentucky.'])},'⛳'));
    R_('✈️','Met Air Force One op staatsbezoek','Handelsdeals en banketten',D('Staatsbezoek',()=>{if(S.acts.stb)return 'Je bent dit jaar al op staatsbezoek geweest.';S.acts.stb=1;P.pop=clamp(P.pop+3);hap(4);return `Een staatsbezoek aan ${pick(['Japan','India','het Verenigd Koninkrijk','Frankrijk','Brazilië','Saoedi-Arabië','Nederland'])}. Overal staan mensen langs de weg.`},'✈️'));
    R_('🕊️','Gratie verlenen','Een omstreden beslissing',()=>modal({title:'Gratie verlenen',em:'🕊️',cat:'President',text:'Wie krijgt gratie?',choices:opts([{t:'👤 Een onschuldig veroordeelde',s:'Mensen vinden het rechtvaardig',on:()=>{closeModal();doAct('Gratie',()=>{use('usgr');kar(4);P.pop=clamp(P.pop+3);return 'Na twintig jaar komt hij vrij. Hij huilt op de stoep van de gevangenis.'},true,'👤')}},{t:'🤝 Een veroordeelde oud-medewerker',s:'Je achterban vindt het prima, de rest niet',on:()=>{closeModal();doAct('Gratie',()=>{use('usgr');kar(-4);P.steun=clamp(P.steun+3);P.pop=clamp(P.pop-6);P.risk=(P.risk||0)+8;return 'Je oude campagneleider is vrij. De kranten spreken van machtsmisbruik.'},true,'🤝')}}])}),{dots:true});
    if((P.terms||1)>=2)R_('📈','Een derde termijn','De grondwet staat het niet toe',()=>ask('De grondwet veranderen?','Voor een derde termijn moet de grondwet worden aangepast: twee derde van het Congres en driekwart van de staten moeten instemmen.','Proberen',()=>doAct('Derde termijn',()=>{const W=S.pw;const ok=(W.seats[P.party]||0)>=290&&(W.sen[P.party]||0)>=67&&chance(.25);if(ok){P.terms=1;S.flags.derde=1;P.pop=clamp(P.pop-10);MS('Veranderde de grondwet voor een derde termijn',3);return 'Het ongelooflijke gebeurt: de grondwet wordt aangepast. Je mag nog een keer meedoen.'}P.pop=clamp(P.pop-12);P.steun=clamp(P.steun-6);P.risk=(P.risk||0)+8;return 'Je voorstel strandt kansloos. Zelfs in je eigen partij noemen mensen je een gevaar voor de democratie.'},true,'📈'),'bad'),{dots:true})}
  if(lw&&!(P.lvl==='min'&&!['Financiën','Economische Zaken','Justitie en Veiligheid'].includes(P.port)))R_('✍️','Wetsvoorstel naar het Congres',S.acts.wet?'Al een voorstel ingediend dit jaar':P.lvl==='mp'?'Het Congres moet instemmen':'Huis en Senaat moeten allebei instemmen',lawMenu,{dis:!!S.acts.wet,dots:true});
  if(typeof budMine==='function'&&budMine())R_('👜','Begroting maken',S.acts.bud?'Al ingediend dit jaar':'Het Congres moet hem goedkeuren',()=>{S.budDraft=Object.assign({},budW());openSheet('Begroting',sheetBudget,true)},{dots:true});
  if(['kamer','ek'].includes(P.lvl)&&typeof weList==='function'&&weList().length)R_('🧭','Resolutie over de crisis',S.acts.wmot?'Al gedaan dit jaar':weList().map(e=>WEV[e.id].n).join(', '),weMotie,{dis:!!S.acts.wmot,dots:true})}
function sheetPres(el){const a=ageY(),P=S.pol,W=S.pw;const nx=`Congres ${W.nextTK} · president ${usNextFor('mp',year()-1)>=year()?usNextFor('mp',year()-1):usNextFor('mp')}`;
  if(!P){card(el,`<h3>🇺🇸 De politiek in</h3><span class="muted">Word lid van een partij, win een voorverkiezing en werk je op van de gemeenteraad naar het Witte Huis. Volgende verkiezingen: ${nx}.</span>`);usHowRow(el);
    if(a<16){empty(el,'Lid worden van een partij kan vanaf 16 jaar.');citizenSec(el);usWorldSec(el);return}
    const s=sec(el,'Kies een partij');for(const p of US_PARTIES)row(s,{ic:p.em,t:p.n,s:`${p.lbl} · ${p.d}`,on:()=>joinParty(p.id)});
    const o=sec(el,'');row(o,{ic:'🎗️',t:'Eigen partij oprichten',s:a<18?'Vanaf 18 jaar':`In een tweepartijenstelsel bijna kansloos · ${fmt(25000*(S.cpi||1))}`,dis:a<18,dots:true,on:foundParty});
    postSec(el);citizenSec(el);usWorldSec(el);return}
  const p=PTY(P.party);const term=US_TERM[P.lvl]&&P.t?`Termijn tot ${P.t}`:'';
  card(el,`<h3>${p.em} ${he(polTitle(P))}</h3><span class="muted">${he(p.n)}${p.lbl?` · <small>${p.lbl}</small>`:''} · ${P.yrs} jaar lid</span>${kv([['Salaris',POLO[P.lvl].sal?fmt(polSal())+' per jaar':'Onbetaald'],...(term?[['Termijn',term.replace('Termijn ','')]]:[]),['Campagnekas',fmt(P.kas||0)],['Kandidaat',P.run?`${cap(US_ONM[P.run.o]||polTl(P.run.o))} (${P.run.y})`:'Nergens voor'],['Verkiezingen',nx]])}<div class="stat"><span>Steun in de partij</span><span></span><span class="v">${Math.round(P.steun)}%</span>${bar(P.steun)}</div><div class="stat"><span>${P.lvl==='mp'?'Goedkeuring':'Populariteit'}</span><span></span><span class="v">${Math.round(P.pop)}%</span>${bar(P.pop,'var(--brand)')}</div>`);
  usHowRow(el);
  const v=sec(el,'Verkiezingen');
  if(P.run)row(v,{ic:'🗳️',t:`Kandidaat: ${US_ONM[P.run.o]||polTl(P.run.o)}`,s:`Verkiezingen in ${P.run.y}${P.run.o==='kamer'&&P.dist?` · district ${P.dist.n}`:''} · tik om je terug te trekken`,r:'✅',dots:true,on:()=>ask('Kandidatuur intrekken?','Je trekt je terug uit de race.','Terugtrekken',()=>{P.run=null;P.steun=clamp(P.steun-2);refreshSheet()})});
  else row(v,{ic:'🗳️',t:'Kandidaat stellen',s:a<18?'Vanaf 18 jaar':'Gemeente, staat, Congres, gouverneur of president',dis:a<18||(P.lvl==='mp'&&(P.terms||1)<2),dots:true,on:usRunMenu});
  if(US_TERM[P.lvl]&&P.lvl!=='vp'&&!(P.lvl==='mp'&&(P.terms||1)>=2))row(v,{ic:P.noRun?'🚪':'🔁',t:P.noRun?'Je stelt je niet herkiesbaar':'Je stelt je herkiesbaar',s:P.lvl==='mp'?`Herverkiezing in ${P.t} · tik om te wisselen`:`Verkiezingen in ${P.t} · tik om te wisselen`,dots:true,on:()=>{P.noRun=P.noRun?0:1;toast(P.noRun?'Je doet niet meer mee bij de volgende verkiezing.':'Je doet weer mee.');refreshSheet()}});
  if(P.lvl==='mp'&&(P.terms||1)>=2)card(v,`<span class="muted">Dit is je tweede termijn. De grondwet verbiedt een derde: in ${P.t} verlaat je het Witte Huis.</span>`);
  if(P.run||(P.t&&P.t-year()<=1&&!P.noRun)||P.lvl==='mp'){const c=sec(el,'Campagne');usFundRows(c,P)}
  const ps=sec(el,'Partij');
  row(ps,{ic:'🪑',t:'Partijbijeenkomst',s:'Laat je zien bij de partij in je county',on:()=>doAct('Partijbijeenkomst',()=>{const m=use('pvg');P.steun=clamp(P.steun+Math.round(5*m));return pick(['Een barbecue van de partij. Je bakt hamburgers en praat met iedereen.','Je spreekt een zaal vol vrijwilligers toe. Ze willen allemaal een foto.','Een saaie vergadering over de partijkas. Maar je wordt gezien.'])},true,'🪑')});
  row(ps,{ic:'🤝',t:'Netwerken',s:'Donateurs, lobbyisten en partijbonzen',on:()=>doAct('Netwerken',()=>{const m=use('pnet');P.steun=clamp(P.steun+Math.round(3*m));sk('sociaal',1);return pick(['Je drinkt een whiskey met de partijvoorzitter van je staat.','Je raakt aan de praat met een oud-senator. Hij geeft je zijn kaartje.','Een gala in een hotel. Je zit naast een grote donateur.'])},true,'🤝')});
  row(ps,{ic:'🎤',t:'Debatavond',s:'Minigame · de standpunten van je partij',dots:true,on:()=>mgDebate('Debatavond',sc=>doAct('Debatavond',()=>{use('pdeb');P.steun=clamp(P.steun+Math.round((sc-.4)*10));P.pop=clamp(P.pop+Math.round((sc-.5)*6));return sc>=.75?'Je kent de standpunten van je partij op je duimpje.':sc>=.5?'Redelijk, al twijfel je soms.':'Je zegt een paar keer precies het tegenovergestelde van je partij.'},true,'🎤'))});
  if(P.lvl!=='lid'){const f=sec(el,polTitle(P));usOfficeRows(f,P);if(P.lvl==='vn')polMore3(f,P);if(!f.querySelector('.mrow'))f.remove()}
  if(typeof coupRow==='function')coupRow(el);
  warPolSec(el,P);polPeopleSec(el);postSec(el);citizenSec(el);
  const o=sec(el,'Overig');
  if(P.party!=='own')row(o,{ic:'🔀',t:'Overstappen',s:'Naar een andere partij',dots:true,on:()=>modal({title:'Overstappen',em:'🔀',cat:'Politiek',text:'Naar welke partij stap je over?',choices:opts(US_PARTIES.filter(x=>x.id!==P.party).map(x=>({t:`${x.em} ${x.n}`,s:x.lbl,on:()=>{closeModal();joinParty(x.id)}})))})});
  if(P.party!=='own'&&a>=18)row(o,{ic:'🎗️',t:'Eigen partij oprichten',s:`Bijna kansloos in een tweepartijenstelsel · ${fmt(25000*(S.cpi||1))}`,dots:true,on:foundParty});
  row(o,{ic:'🚪',t:'Stoppen met politiek',dots:true,on:polStop});
  if(P.past.length){const h=sec(el,'Eerdere functies');for(const x of P.past.slice(-6).reverse())row(h,{ic:'📁',t:x.t,s:`Tot ${x.y}`})}
  usWorldSec(el)}
function usWorldSec(el){const W=S.pw;const s=sec(el,'Politiek in het land');warCard(s);const me=W.pm&&W.pm.n===myName();
  card(s,`<h3>🏛️ Het Witte Huis</h3>${kv([['President',`${me?'Jij':he(W.pm.n)} (${usPty(W.pm.p)}) · ${W.pm.t>=2?'tweede termijn':'eerste termijn'}`],['Vicepresident',`${W.vpn?(W.vpn.n===myName()?'Jij':he(W.vpn.n)):'?'}`],['Hooggerechtshof',`${W.scotus.c} conservatief · ${W.scotus.l} progressief`],...(W.stGov?[[`Gouverneur ${usMy().st[0]}`,`${W.stGov.n===myName()?'Jij':he(W.stGov.n)} (${usPty(W.stGov.p)})`]]:[])])}`);
  const hm=usHouseMaj(),sm=usSenMaj();
  card(s,`<h3>Huis van Afgevaardigden</h3><span class="muted">435 zetels · 218 voor een meerderheid</span>${seatsHtml(W.seats,hm?[hm]:[],hm?`Meerderheid: ${PTY(hm).n}`:'Geen meerderheid')}`);
  card(s,`<h3>Senaat</h3><span class="muted">100 senatoren · 60 nodig tegen een filibuster</span>${seatsHtml(W.sen,sm?[sm]:[],sm?`Meerderheid: ${PTY(sm).n}`:'Geen meerderheid')}`);
  lawsCard(s);if(typeof demCard==='function')demCard(s);
  const ids=Object.keys(W.sh).sort((a,b)=>W.sh[b]-W.sh[a]);card(s,`<h3>Peiling</h3><span class="muted">Op welke partij zouden mensen nu stemmen?</span>${usTbl(ids.map(k=>({ic:PTY(k).em,n:PTY(k).n,v:`${Math.round(W.sh[k])}%`})))}`)}
// na de politiek
function presPostRows(s,X,P,a){const c=S.cpi||1;
  if(X.expres||X.r>=6){row(s,{ic:'🎤',t:X.spk?'Stoppen met betaalde lezingen':'Betaalde lezingen geven',s:X.spk?`${fmt(polPostInc().find(x=>x[0]==='Lezingen')[1])} per jaar`:'Banken en bedrijven betalen een fortuin voor een uur met een oud-president',dots:true,on:()=>doAct('Lezingen',()=>{X.spk=X.spk?0:1;if(X.spk){S.fame=clamp(S.fame+2);return 'Je spreekt op een congres van een grote bank. Een uur praten, een flinke cheque.'}return 'Je stopt met de lezingen.'},true,'🎤')});
    row(s,{ic:'🏛️',t:'Een presidentiële bibliotheek bouwen',s:X.lib?'Al gebouwd':'Een museum over jouw jaren in het Witte Huis',dis:!!X.lib,dots:true,on:()=>doAct('Bibliotheek',()=>{X.lib=1;S.fame=clamp(S.fame+5);hap(8);MS('Opende een eigen presidentiële bibliotheek',2);return `In ${S.p.city} opent de ${S.p.last} Presidential Library. Donateurs betalen alles. Bij de opening staan vier oud-presidenten op het podium.`},true,'🏛️')})}
  if(X.r>=3&&a>=35&&P&&S.pw.gov[0]===P.party)row(s,{ic:'🌍',t:'Ambassadeur worden',s:'De president benoemt politieke vrienden graag op een mooie post',dis:!!S.acts.amb||P.lvl==='cdk',dots:true,on:()=>doAct('Benoeming',()=>{S.acts.amb=1;if(chance(.3+X.r*.06+P.steun/400)){const c=pick(['Japan','het Verenigd Koninkrijk','Frankrijk','Italië','Nederland','Canada','Mexico','Australië']);setOffice('cdk',c);P.term=year()+4;MS(`Werd ambassadeur in ${c}`,2);return `De president benoemt je tot ambassadeur in ${c}! De Senaat stemt in.`}return 'De president kiest iemand anders.'},true,'🌍')})}
/* ---------- extra gebeurtenissen in de VS ---------- */
const UE=(id,o)=>E(id,Object.assign({sys:1,pe:1,us:1},o));
UE('us_sotu',{c:polIn('mp'),cd:1,t:'State of the Union',x:'Je spreekt het Congres en het hele land toe. Half Washington zit in de zaal.',ch:[
 ['🤝 Verzoenend: de hand reiken',()=>{const P=S.pol;P.pop=clamp(P.pop+3);P.cong=clamp((P.cong||40)+6);P.steun=clamp(P.steun-2);return 'Je roept op tot samenwerking. Zelfs de andere kant klapt een paar keer.'}],
 ['✊ Strijdbaar: de oppositie aanvallen',()=>{const P=S.pol;P.steun=clamp(P.steun+6);P.cong=clamp((P.cong||40)-8);P.pop=clamp(P.pop+(chance(.5)?2:-2));return 'Jouw kant van de zaal staat twintig keer op. De andere kant blijft met de armen over elkaar zitten.'}]]});
UE('us_donor',{c:()=>polIn()()&&(S.pol.run||['kamer','ek','gov','mp'].includes(S.pol.lvl)),cd:4,t:'Een rijke donateur',x:()=>`Een miljardair wil ${fmt(Math.round(US_NEED[S.pol.run?S.pol.run.o:S.pol.lvl]*(S.cpi||1)*.8))} in een super PAC stoppen die jou steunt. Hij verwacht wel dat je "luistert" als hij belt.`,ch:[
 ['💰 Aannemen',()=>{const P=S.pol;P.kas=(P.kas||0)+Math.round(US_NEED[P.run?P.run.o:P.lvl]*(S.cpi||1)*.8);P.risk=(P.risk||0)+8;P.donor=1;kar(-2);return 'Er stroomt geld binnen voor reclamespotjes. Officieel heb je er niets mee te maken.'}],
 ['🙅 Afslaan',()=>{const P=S.pol;P.pop=clamp(P.pop+2);kar(3);return 'Je zegt dat je niet te koop bent. Een mooie zin voor je speeches.'}]]});
UE('us_donoreis',{c:()=>polIn('kamer','ek','gov','mp')()&&S.pol.donor,cd:3,t:'De donateur belt',x:'Je grote donateur belt. Hij wil dat je je inzet tegen nieuwe regels voor zijn bedrijven.',ch:[
 ['🫡 Doen wat hij vraagt',()=>{const P=S.pol;P.risk=(P.risk||0)+8;P.pop=clamp(P.pop-2);kar(-3);return 'Je doet wat hij vraagt. Een journalist begint vragen te stellen.'}],
 ['🚫 Weigeren',()=>{const P=S.pol;P.donor=0;P.steun=clamp(P.steun-4);kar(3);return '"Dan zoek ik wel iemand anders," zegt hij en hangt op. Het geld is weg.'}]]});
UE('us_wapen',{c:polIn('stl','kamer','ek'),cd:4,t:'De wapenlobby',x:'Na een schietpartij in een winkelcentrum wordt er gestemd over strengere wapenwetten. De wapenlobby belt: stem tegen, dan steunen ze je campagne.',ch:[
 ['🗳️ Voor strengere regels stemmen',()=>{const P=S.pol;const g=PTY(P.party).pc<50;P.steun=clamp(P.steun+(g?4:-8));P.pop=clamp(P.pop+3);return 'Je stemt voor. Je krijgt bedreigingen, maar ook duizenden bedankjes.'}],
 ['💵 Tegen stemmen en het geld aannemen',()=>{const P=S.pol;const g=PTY(P.party).pc>=50;P.steun=clamp(P.steun+(g?4:-8));P.kas=(P.kas||0)+Math.round(US_NEED[P.lvl]*(S.cpi||1)*.3);P.pop=clamp(P.pop-3);return 'Je stemt tegen. De lobby houdt woord: er komt geld binnen.'}]]});
UE('us_plafond',{c:()=>polIn('mp')()||(polIn('min')()&&S.pol.port==='Financiën'),cd:4,t:'Het schuldenplafond',x:'Het land heeft de wettelijke grens van zijn schuld bereikt. Zonder akkoord met het Congres kan de overheid over drie weken haar rekeningen niet meer betalen.',ch:[
 ['🤝 Een deal sluiten met de oppositie',()=>{const P=S.pol;P.steun=clamp(P.steun-5);P.pop=clamp(P.pop+2);return 'Na weken onderhandelen ligt er een deal. Je eigen partij moppert over de bezuinigingen.'}],
 ['🧊 Niet toegeven',()=>{const P=S.pol;if(chance(.55)){P.steun=clamp(P.steun+6);return 'Op de laatste dag geeft de oppositie toe. Jij wint het spelletje.'}P.pop=clamp(P.pop-8);ecoW().debt=Math.round((ecoW().debt+3)*10)/10;ecoNews('De VS betalen hun rekeningen een week niet. De kredietwaardigheid daalt.',1);return 'Niemand geeft toe. Een week lang betaalt de overheid niets. De beurs schrikt en de rente stijgt.'}]]});
UE('us_orkaan',{c:polIn('gov','mp','burg'),cd:5,t:'Een orkaan',x:()=>`Een zware orkaan treft ${S.pol.lvl==='mp'?'de Golfkust':S.pol.lvl==='gov'?usMy().st[0]:S.p.city}. Hele wijken staan onder water.`,ch:[
 ['🥾 Er zelf heen',()=>{const P=S.pol;P.pop=clamp(P.pop+5);return 'Je loopt in laarzen door het water en praat met mensen die alles kwijt zijn.'}],
 ['📋 Vanuit het crisiscentrum leiden',()=>{const P=S.pol;if(chance(.6)){P.pop=clamp(P.pop+2);return 'De hulp loopt goed. Niemand ziet je, maar het werkt.'}P.pop=clamp(P.pop-6);return 'De hulp komt traag op gang. Waar is de leider, vragen mensen.'}]]});
Object.assign(EVMETA,{us_sotu:['Politiek','🇺🇸'],us_donor:['Politiek','💰'],us_donoreis:['Politiek','📞'],us_wapen:['Politiek','🔫'],us_plafond:['Politiek','🧊'],us_orkaan:['Politiek','🌀']});
/* ---------- emigreren als politicus ---------- */
const o0bc=()=>S.flags.wereld?null:S.p.country;
function polEmig(k){if(k===S.p.country||S.dict)return;const P=S.pol;
  if(P){if(P.lvl!=='lid')loseOffice(`Je verhuist naar het buitenland en stopt als ${polTl(P.lvl)}.`);if(P.party==='own'&&S.pw&&S.pw.own)L(`${S.pw.own.n} gaat zonder jou verder.`);S.pol=null;L('Je politieke loopbaan stopt hier. In je nieuwe land begin je opnieuw.','sys')}
  S.pw=null}

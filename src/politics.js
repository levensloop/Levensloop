/* ================= POLITIEK (fase 1) ================= */
const PARTIES=[
 {id:'lib',n:'Liberaal Nederland',k:'LN',em:'🔵',c:'#1f6fd1',lr:72,pc:40,b:17,d:'Lage belastingen, ondernemers en vrijheid'},
 {id:'nv',n:'Nationaal Verbond',k:'NV',em:'🦁',c:'#26356f',lr:66,pc:88,b:14,d:'Eigen land eerst, streng en duidelijk'},
 {id:'sda',n:'Sociaal Appèl',k:'SA',em:'🌹',c:'#e0393e',lr:27,pc:42,b:16,d:'Eerlijk delen en sterke publieke zorg'},
 {id:'chm',n:'Christelijk Midden',k:'CM',em:'🕊️',c:'#13a0a0',lr:55,pc:74,b:10,d:'Gezin, gemeenschap, normen en waarden'},
 {id:'dn',n:'Democraten Nu',k:'DN',em:'🟣',c:'#8a4fd1',lr:50,pc:18,b:11,d:'Onderwijs, Europa en vernieuwing'},
 {id:'grn',n:'Groen Morgen',k:'GM',em:'🌿',c:'#2fa84f',lr:20,pc:14,b:11,d:'Klimaat voorop, een groene economie'},
 {id:'sf',n:'Socialistisch Front',k:'SF',em:'✊',c:'#b3122b',lr:8,pc:46,b:9,d:'Tegen de macht van het grote geld'},
 {id:'plp',n:'Plattelandspartij',k:'PLP',em:'🚜',c:'#86b83a',lr:62,pc:70,b:8,d:'Boeren, dorpen en de regio'}];
const POLO={
 lid:{t:'Partijlid',sal:0,fame:0,ft:0,r:0},
 raad:{t:'Gemeenteraadslid',sal:27,fame:6,ft:0,r:1},
 ek:{t:'Eerste Kamerlid',sal:39,fame:12,ft:0,r:2},
 weth:{t:'Wethouder',sal:118,fame:14,ft:1,r:2},
 burg:{t:'Burgemeester',sal:136,fame:24,ft:1,r:3},
 ep:{t:'Europarlementariër',sal:122,fame:20,ft:1,r:3},
 kamer:{t:'Tweede Kamerlid',sal:136,fame:30,ft:1,r:3},
 min:{t:'Minister',sal:190,fame:62,ft:1,r:4},
 mp:{t:'Minister-president',sal:212,fame:92,ft:1,r:5},
 stl:{t:'Lid Provinciale Staten',sal:12,fame:4,ft:0,r:1},
 gov:{t:'Gouverneur',sal:150,fame:40,ft:1,r:4},
 vp:{t:'Vicepresident',sal:200,fame:70,ft:1,r:4}};
// stelsel per land: ambten (titel, salaris, rang) worden bij een landwissel overschreven
const POLO_NL={};
function sysChk(){const cc=S&&S.p?S.p.country:'NL';if(POLO._cc===cc)return;for(const l in POLO){if(l==='_cc')continue;if(!POLO_NL[l])POLO_NL[l]=Object.assign({},POLO[l]);POLO[l]=Object.assign({},POLO_NL[l],((PSYS[cc]||{}).off||{})[l]||{})}POLO._cc=cc}
const PSYS={};
const psys=()=>PSYS[S.p.country]||{};
const isPres=()=>psys().type==='pres';
const ptys=()=>psys().parties||PARTIES;
const hseats=()=>{const W=S.pw;return W?Object.values(W.seats||{}).reduce((s,v)=>s+v,0)||150:150};
const hneed=()=>Math.floor(hseats()/2)+1;
const stellNow=()=>psys().stell||STELL;
const MPORT=['Financiën','Economische Zaken','Justitie en Veiligheid','Volksgezondheid','Onderwijs','Wonen','Klimaat en Energie','Sociale Zaken','Buitenlandse Zaken','Defensie','Infrastructuur','Landbouw'];
const WPORT=['Wonen','Verkeer','Onderwijs','Cultuur','Financiën','Sport','Zorg','Economie','Duurzaamheid'];
const OWNC=[['🟠','#f08a24'],['🟡','#e8b100'],['⚪','#7d8794'],['🟤','#8b5a2b'],['💗','#e8559a'],['🩵','#2bb8c9']];
// stellingen: [tekst, as, richting]  as lr: 0 links → 100 rechts · pc: 0 progressief → 100 behoudend
const STELL=[
 ['De belasting voor de hoogste inkomens moet omhoog.','lr',-1],['Het minimumloon moet flink omhoog.','lr',-1],['Bedrijven moeten van een hoop regels af.','lr',1],
 ['De AOW-leeftijd moet weer omlaag.','lr',-1],['De overheid moet veel meer sociale huurwoningen bouwen.','lr',-1],['De erfbelasting moet lager.','lr',1],
 ['Het eigen risico in de zorg moet worden afgeschaft.','lr',-1],['De winstbelasting voor bedrijven moet omlaag.','lr',1],['Studenten moeten een ruime basisbeurs krijgen.','lr',-1],
 ['De overheid moet bezuinigen in plaats van lenen.','lr',1],['Wiet moet volledig legaal worden.','pc',-1],['Criminelen moeten veel zwaardere straffen krijgen.','pc',1],
 ['Nederland moet sneller van het gas af, ook als dat geld kost.','pc',-1],['Boeren moeten meer ruimte krijgen.','pc',1],['De zondagsrust moet beter beschermd worden.','pc',1],
 ['Er moet meer geld naar kunst en cultuur.','pc',-1],['Thuiswerken moet een wettelijk recht worden.','pc',-1],['Defensie moet veel meer geld krijgen.','pc',1],
 ['Er moet betalen per gereden kilometer komen.','pc',-1],['Scholen moeten strenger zijn op orde en discipline.','pc',1]];
const PT=()=>psys().pt||(S.p.country==='NL'?{kamer:'de Tweede Kamer',kl:'Tweede Kamerlid',mp:'Minister-president'}:{kamer:'het parlement',kl:'Parlementslid',mp:'Premier'});
const polTl=l=>['kamer','ek'].includes(l)&&S.p.country==='NL'?polT(l):polT(l).toLowerCase();
const polTitle=P=>P&&P.lvl==='gov'&&P.regT&&!isPres()?P.regT:polT(P.lvl)+(P.port?({min:' van ',cdk:' in ',vn:' voor '}[P.lvl]||' ')+P.port:'');
const polT=l=>{sysChk();return l==='dict'?((S.dict&&S.dict.title)||'Leider'):isPres()?POLO[l].t:l==='kamer'?PT().kl:l==='mp'?PT().mp:POLO[l].t};
const lnm=()=>`${rname()} ${pick(NAMES[C().r].l)}`;
const myName=()=>`${S.p.first} ${S.p.last}`;
function nextY(m){let y=year()+1;while(y%4!==m)y++;return y}
function polW(){sysChk();if(S.pw&&!S.pw.cc){S.pw.cc=isPres()?'?':S.p.country}if(S.pw&&S.pw.cc!==S.p.country){const old=S.pw;S.pw=null;if(isPres()&&typeof usMigrate==='function'){usMigrate(old);return S.pw}}
  if(S.pw){if(!S.pw.v2&&typeof polRealMigrate==='function')polRealMigrate();if(presL()&&!S.pw.nextPR)prInit(S.pw);return S.pw}if(isPres()&&typeof usWorld==='function')return usWorld();const sh={},base={},lead={};for(const p of ptys()){base[p.id]=p.b;sh[p.id]=p.b*Math.exp(gauss()*.15);lead[p.id]=lnm()}
  S.pw={cc:S.p.country,v2:1,sh,base,lead,seats:{},gov:[],pm:null,own:null,nextTK:S.p.country==='NL'?nextY(1):year()+ri(1,cyc()),nextGR:nextY(2),nextEK:psys().ek===0?9999:nextY(3),nextEP:(()=>{let y=year()+1;while(y%5!==4)y++;return y})(),hist:[]};
  if(psys().eu===0)S.pw.nextEP=9999;normSh();S.pw.seats=natSeats(S.pw.sh);autoForm(S.pw.seats,NS());if(presL())prInit(S.pw);return S.pw}
const PTY=id=>id==='own'?S.pw&&S.pw.own:ptys().find(p=>p.id===id)||PARTIES.find(p=>p.id===id);
const pdist=(a,b)=>{const x=PTY(a),y=PTY(b);return Math.hypot(x.lr-y.lr,(x.pc-y.pc)*.8)};
function normSh(){const W=S.pw,t=Object.values(W.sh).reduce((s,v)=>s+v,0);for(const k in W.sh)W.sh[k]=W.sh[k]/t*100}
function seatsOf(sh,n){const t=Object.values(sh).reduce((s,v)=>s+v,0);const ids=Object.keys(sh).filter(k=>sh[k]/t*n>=1);const tt=ids.reduce((s,k)=>s+sh[k],0);
  const out={};let used=0;const rem=[];for(const k of ids){const q=sh[k]/tt*n;out[k]=Math.floor(q);used+=out[k];rem.push([k,q-out[k]])}
  rem.sort((a,b)=>b[1]-a[1]);for(let i=0;used<n;i++,used++)out[rem[i%rem.length][0]]++;return out}
// kabinet vormen: grootste partij + partners die het dichtst bij liggen
function autoForm(seats,n,lead,skip){const need=Math.floor(n/2)+1;const ids=Object.keys(seats).filter(k=>seats[k]>0&&k!==skip).sort((a,b)=>seats[b]-seats[a]);if(!ids.length)return[];
  const nat=n===NS(),cor=nat?(psys().cordon||[]):[];const first=lead&&seats[lead]?lead:(ids.find(k=>!cor.includes(k))||ids[0]);const co=[first];let tot=seats[first];
  const minor=nat&&['fptp','av'].includes(psys().sys)&&tot>=n*.44;
  while(tot<need&&!minor){const rest=ids.filter(k=>!co.includes(k)&&(!cor.includes(k)||cor.includes(first)));if(!rest.length)break;
    const sw=.6*150/n;rest.sort((a,b)=>(Math.min(...co.map(c=>pdist(a,c)))-seats[a]*sw)-(Math.min(...co.map(c=>pdist(b,c)))-seats[b]*sw));co.push(rest[0]);tot+=seats[rest[0]]}
  if(n===NS()){const W=S.pw;W.gov=co;W.pm={n:W.lead[first],p:first}}return co}
const seatSum=(co,seats)=>co.reduce((s,k)=>s+(seats[k]||0),0);
function polDrift(){const W=polW(),P=S.pol;for(const k in W.sh){let s=W.sh[k]*Math.exp(gauss()*.09);s+=(W.base[k]-s)*.12;
    if(W.gov.includes(k))s*=.965-(econ()==='recessie'?.035:0)+(econ()==='groei'?.012:0);
    if(P&&P.party===k&&(P.lvl!=='lid'||P.lead))s*=k==='own'?1+(P.pop-30)/500:1+(P.pop-50)/2500*(P.lead?3:1);W.sh[k]=Math.max(.15,s)}
  if(W.own)W.base.own=W.base.own*.6+W.sh.own*.4;normSh()}
const pollSeats=()=>natSeats(polW().sh);
/* ---------- speler ---------- */
function polMigrate(){if(S.job&&S.job.id==='politiek'){const l=['raad','weth','kamer','min','mp'][S.job.lvl]||'raad';polW();
    S.pol=mkPol(pick(ptys()).id);S.pol.lvl=l;S.pol.steun=60;S.pol.oy=S.job.yrs;S.pol.cand={gr:['raad','weth'].includes(l),tk:['kamer','min','mp'].includes(l)};if(l==='mp'){S.pol.lead=1;S.pw.gov=S.pw.gov.includes(S.pol.party)?S.pw.gov:[S.pol.party].concat(S.pw.gov.slice(1));S.pw.pm={n:myName(),p:S.pol.party}}
    if(l==='min'||l==='weth')S.pol.port=pick(l==='min'?MPORT:WPORT);
    S.jobs.push({t:jobTitle(),co:'',y:S.job.yrs});S.job=null;L(`Je politieke loopbaan gaat verder bij ${PTY(S.pol.party).n}.`,'sys')}
  if(S.pol)polW();
  if(S.pol&&!S.pex&&S.pol.lvl!=='lid'){const tl=[S.pol.lvl].concat((S.pol.past||[]).map(x=>Object.keys(POLO).find(k=>polT(k)===x.t)).filter(Boolean));const b=tl.sort((x,y)=>POLO[y].r-POLO[x].r)[0];S.pex={r:POLO[b].r,t:polT(b),pmN:S.pol.lvl==='mp'?1:0,laws:S.pol.laws||0}}}
function mkPol(party){return {party,lvl:'lid',steun:party==='own'?100:30,pop:clamp(Math.round(10+S.fame*.5)),yrs:0,oy:0,cand:{},lead:party==='own'?1:0,port:null,kas:0,camp:0,since:year(),past:[]}}
function polFameT(){const P=S.pol;if(!P||inJail())return 0;return Math.round(POLO[P.lvl].fame*(.75+P.pop/200))}
function polSal(){const P=S.pol;if(!P||inJail())return 0;return Math.round(POLO[P.lvl].sal*1000*(S.cpi||1))}
const polFull=()=>!!(S.pol&&POLO[S.pol.lvl].ft);
function polScore(){const P=S.pol;return P.steun*.55+Math.min(22,P.oy*2.5)+S.fame*.15+(S.st.smarts-50)*.12+POLO[P.lvl].r*3}
function listPos(kind){const P=S.pol;if(!P)return 99;if(P.lead)return 1;const sc=polScore();const top=kind==='tk'?Math.round(44*NS()/150):kind==='ep'?18:20;return Math.max(2,Math.min(top+15,Math.round(2+(100-sc)/100*top)))}
function grPos(){const P=S.pol;if(P.lead)return 1;return Math.max(1,Math.round(1+(100-P.steun)/100*9-Math.min(3,P.oy*.5)-(P.camp||0)*.08))}
function setOffice(l,port){const P=S.pol;if(P.lvl!=='lid'&&P.lvl!==l)P.past.push({t:polT(P.lvl),y:year()});P.lvl=l;P.port=port||null;
  if(POLO[l].ft&&S.mil)milLeave('Je verlaat Defensie voor de politiek.');
  if(POLO[l].ft&&S.job){L(`Je stopt als ${jobTitle().toLowerCase()} om je volledig op de politiek te richten.`);endJob()}
  if(l==='mp')S.flags[isPres()?'uspres':presL()?'wpres':'premier']=1;polRec(l)}
function loseOffice(why){const P=S.pol;if(!P||P.lvl==='lid')return;if(P.lvl==='dict'&&S.dict)return;if(P.lvl==='mp'&&S.pw&&S.pw.pm&&S.pw.pm.n===myName()){const ld=S.pw.lead&&S.pw.lead[P.party];S.pw.pm=Object.assign({},S.pw.pm,{n:ld&&ld!==myName()?ld:lnm(),y0:year(),t:1})}P.past.push({t:polT(P.lvl),y:year()});L(why||`Je bent geen ${polTl(P.lvl)} meer.`,'bad');P.lvl='lid';P.port=null}
function polJail(){const P=S.pol;if(!P)return;if(S.dict&&typeof dictEnd==='function')dictEnd();if(P.lvl!=='lid')loseOffice(`Na je veroordeling moet je stoppen als ${polTl(P.lvl)}.`);P.steun=clamp(P.steun-40);P.pop=clamp(P.pop-25);if(P.party!=='own')dropLead()}
function dropLead(){const P=S.pol;if(!P||!P.lead||P.party==='own')return;P.lead=0;if(S.pw)S.pw.lead[P.party]=lnm()}
/* ---------- jaarlijks ---------- */
function polYear(a){polMigrate();if(!S.pw&&!S.pol&&a<18)return;if(isPres()&&typeof presYear==='function'){presYear(a);return}const W=polW(),y=year(),P=S.pol;if(S.dict&&P&&P.lvl!=='dict')P.lvl='dict';if((typeof occHere==='function'&&occHere())||S.dict){W.nextTK=Math.max(W.nextTK,y+1);W.nextGR=Math.max(W.nextGR,y+1)}polDrift();
  if(P){P.yrs++;if(P.lvl!=='lid')P.oy++;
    const tgt=Math.max(P.lead?22:10,POLO[P.lvl].fame*.8+S.fame*.2);P.pop=clamp(Math.round(P.pop+(tgt-P.pop)*.2+ri(-3,3)));
    if(P.party!=='own')P.steun=clamp(Math.round(P.steun+(50-P.steun)*.06+ri(-2,3)+(P.lvl!=='lid'?1:0)));
    if(P.lvl==='burg'&&psys().mayor!=='elect'&&y>=P.term){if(chance(.6)&&P.pop>=35){P.term=y+6;L('Je bent herbenoemd als burgemeester voor zes jaar.','good')}else loseOffice('Je termijn als burgemeester zit erop.')}
    if(P.party!=='own'&&!P.lead&&y===W.nextTK-1&&P.steun>=75&&['kamer','min','weth','burg','ek','ep'].includes(P.lvl)&&chance(.45))Q.push({id:'pol_lijst'})}
  if(y>=W.nextGR){W.nextGR=y+4;if(P&&P.cand.gr)Q.push({id:'pol_gr'});else if(P&&['raad','weth'].includes(P.lvl))loseOffice('Je stond niet op de lijst. Je zit niet meer in de gemeenteraad.')}
  if(y>=W.nextEK){W.nextEK=y+4;if(P&&P.cand.ek)Q.push({id:'pol_ek'});else if(P&&P.lvl==='ek')loseOffice(`Je zetel als ${polTl('ek')} loopt af.`)}
  if(y>=W.nextEP){W.nextEP=y+5;if(P&&P.cand.ep)Q.push({id:'pol_ep'});else if(P&&P.lvl==='ep')loseOffice('Je termijn in het Europees Parlement zit erop.')}
  if(typeof prYear==='function')prYear(a);
  if(y>=W.nextTK){W.nextTK=y+cyc();if(a>=18&&!inJail()){Q.push({id:'pol_stem'});Q.push({id:'pol_tk'})}else if(a>=18||P){Q.push({id:'pol_tk'})}else{const r=runTK();if(presL())prGov(W);else autoForm(r.seats,NS());cabPolicy();L(r.news,'sys')}}
  if(P&&a>=16)polEvents();
  if(typeof regYear==='function')regYear(a);
  pol3Year();
}
/* ---------- verkiezingen ---------- */
function runTK(){const W=polW(),P=S.pol;const sh={};const old=Object.assign({},W.seats);
  for(const k in W.sh){let s=W.sh[k]*Math.exp(gauss()*.07);if(P&&P.party===k){if(P.lead)s*=1+(k==='own'?clamp((P.pop-25)/80,-.2,.6):clamp((P.pop-50)/220,-.15,.18))+Math.min(.3,Math.log10(1+(P.kas||0)/(40000*(S.cpi||1)))*.12)+(P.camp||0)*.012;else s*=1+(P.camp||0)*.004}sh[k]=s}
  const seats=natSeats(sh);W.seats=seats;const ids=Object.keys(seats).filter(k=>seats[k]>0).sort((a,b)=>seats[b]-seats[a]);
  W.hist.push({y:year(),s:Object.assign({},seats)});if(W.hist.length>8)W.hist.shift();
  for(const k in W.sh)W.sh[k]=W.sh[k]*.5+(psys().sys==='pr'||!psys().sys?(seats[k]||0)/NS()*100:sh[k]/Object.values(sh).reduce((a,b)=>a+b,0)*100)*.5;normSh();
  for(const k of Object.keys(W.lead))if(k!=='own'&&!(P&&P.lead&&P.party===k)&&(seats[k]||0)<(old[k]||0)*.75&&chance(.6))W.lead[k]=lnm();
  const top=ids.slice(0,3).map(k=>`${PTY(k).n} ${seats[k]}`).join(', ');
  const news=`Verkiezingen voor ${PT().kamer}: ${PTY(ids[0]).n} wordt de grootste met ${seats[ids[0]]} zetels (${top}).`;
  return {seats,old,ids,news}}
function partyLine(c){const P=S.pol,p=PTY(P.party),n=c.seats[P.party]||0,o=c.old[P.party]||0;return `${p.n} haalt ${n} ${n===1?'zetel':'zetels'}${o?` (was ${o})`:''}.`}
function tkOutcome(c){const W=S.pw,P=S.pol;const out=[];
  if(!P){if(presL())prGov(W);else autoForm(c.seats,NS());out.push(cabTxt()+cabPolicy());return out.join(' ')}
  out.push(partyLine(c));const n=c.seats[P.party]||0;if(P.party==='own'&&n>0)S.flags.eigenpartij=1;
  if(P.lead&&P.party!=='own'&&n<(c.old[P.party]||0)*.7&&n>0){dropLead();P.steun=clamp(P.steun-20);out.push('Na dit verlies treed je af als partijleider.')}
  const wasNat=(presL()?['kamer']:['kamer','min','mp']).includes(P.lvl);
  const dsys=['fptp','av'].includes(psys().sys);
  const isPr=presL()&&P.lvl==='mp';
  if(P.cand.tk&&dsys&&!isPr){const r=distWin();if(r.win){if(P.lvl!=='kamer')setOffice('kamer');out.push(`Je wint je district ${P.dist.n} met ${r.pct}% van de stemmen! Je zit in ${PT().kamer}.`);hap(10);MS(`Werd gekozen in ${PT().kamer}`,2);P.pop=clamp(P.pop+5)}else{if(wasNat)loseOffice();out.push(`Je verliest je district ${P.dist.n}: je haalt ${r.pct}% en ${PTY(r.top).n} wint.`);hap(-6)}}
  else if(P.cand.tk&&!isPr){const pos=listPos('tk');const vk=P.pop>=70&&n>0&&chance(.5+(P.pop-70)/60);
    if(pos<=n||vk){if(P.lvl!=='kamer')setOffice('kamer');out.push(pos<=n?`Je bent gekozen in ${PT().kamer} (plek ${pos}).`:`Je staat op plek ${pos}, maar je haalt genoeg voorkeursstemmen. Je bent gekozen!`);hap(10);MS(`Werd gekozen in ${PT().kamer}`,2);P.pop=clamp(P.pop+5)}
    else{if(wasNat)loseOffice();out.push(`Je stond op plek ${pos}. Dat is net niet genoeg voor een zetel.`);hap(-6)}}
  else if(wasNat)loseOffice();
  // formatie
  const big=c.ids[0];
  if(!presL()&&P.lead&&n>0&&big===P.party){Q.push({id:'pol_formatie'});out.push('Jouw partij is de grootste. Jij mag de formatie leiden!')}
  else{if(presL())prGov(W);else autoForm(c.seats,NS());out.push(cabTxt()+cabPolicy());if(W.gov.includes(P.party)&&P.lvl!=='lid'||W.gov.includes(P.party)&&P.lead)ministerOffer()}
  P.camp=0;P.kas=0;return out.join(' ')}
function cabTxt(){const W=S.pw;if(presL()){const s=seatSum(W.gov,W.seats);return `De coalitie rond president ${W.pm.n} heeft ${s} van de ${NS()} zetels${s>=NEED()?'':': geen meerderheid'}.${W.prem&&W.prem.co?` De president moet een premier van de oppositie benoemen: ${W.prem.n}.`:''}`}const names=W.gov.map(k=>PTY(k).n);const l=names.length>1?names.slice(0,-1).join(', ')+' en '+names[names.length-1]:names[0];return `Het nieuwe kabinet bestaat uit ${l} (${seatSum(W.gov,W.seats)} zetels). ${W.pm.n} wordt ${PT().mp.toLowerCase()}.`}
function ministerOffer(){const P=S.pol;if(!P||P.lvl==='mp')return;const ch=clamp((P.steun-45)/60+Math.min(.25,P.oy*.03)+(S.st.smarts-50)/300+(P.lead?.45:0),.02,.92);if(chance(ch))Q.push({id:'pol_minister',c:{port:pick(MPORT)}})}
function formation(){const W=S.pw,P=S.pol,my=P.party;const co=[my];const no=new Set();
  const step=()=>{const tot=seatSum(co,W.seats);if(tot>=NEED()){finishForm(co);return}
    const cands=Object.keys(W.seats).filter(k=>W.seats[k]>0&&!co.includes(k)&&!no.has(k)).sort((a,b)=>W.seats[b]-W.seats[a]);
    if(!cands.length||seatSum(co.concat(cands),W.seats)<NEED()){result('Formatie mislukt','Er is geen meerderheid meer te vinden met de partijen die nog willen praten. Een andere partij neemt de formatie over.','',()=>finishForm(null),{em:'🤝',cat:'Politiek'});return}
    modal({title:'Formatie',em:'🤝',cat:'Politiek',text:`Jouw coalitie heeft ${tot} van de ${NS()} zetels. Je hebt er minstens ${NEED()} nodig. Met welke partij ga je praten?`,choices:[...cands.map(k=>{const p=PTY(k),d=pdist(my,k);
      return {t:`${p.em} ${p.n} · ${W.seats[k]} zetels`,s:d<22?'Klikt goed':d<42?'Valt over te praten':'Ver uit elkaar',on:()=>{closeModal();
        const cor=psys().cordon||[];const ok=chance(clamp(1.08-d/65+(P.pop-50)/250,.06,.95)*((cor.includes(k)||cor.includes(my))?.15:1));
        if(ok){co.push(k);const cost=Math.round(d/5);P.steun=clamp(P.steun-cost);result('Akkoord!',`${p.n} doet mee.${cost>=6?` Je moet wel flink wat inleveren. Niet iedereen in je partij is daar blij mee.`:' Jullie zijn het snel eens.'}`,'',step,{em:'🤝',cat:'Formatie'})}
        else{no.add(k);result('Geen akkoord',`${p.n} wil niet met jullie in zee. ${pick(['De verschillen zijn te groot.','Ze willen liever in de oppositie.','De gesprekken klappen na drie weken.'])}`,'',step,{em:'🚪',cat:'Formatie'})}}}}),
      {t:'Opgeven en een ander laten formeren',cls:'ghost',on:()=>{closeModal();finishForm(null)}}]})};step()}
function finishForm(co){const W=S.pw,P=S.pol;
  if(co){W.gov=co;W.pm={n:myName(),p:P.party};W.lead[P.party]=myName();setOffice('mp');hap(15);MS(`Werd ${PT().mp.toLowerCase()}`,3);
    const t=`Het kabinet staat! Jij bent de nieuwe ${PT().mp.toLowerCase()}. ${cabTxt()}`;L(t,'good big');result(psys().seat||'Het Torentje',t,'',processQ,{em:'🏛️',cat:'Politiek'});return}
  autoForm(W.seats,NS(),null,P.party);if(!W.gov.length||seatSum(W.gov,W.seats)<NEED())autoForm(W.seats,NS(),Object.keys(W.seats).sort((a,b)=>W.seats[b]-W.seats[a]).find(k=>k!==P.party));
  const t=cabTxt()+cabPolicy()+(W.gov.includes(P.party)?' Jouw partij doet wel mee.':' Jouw partij gaat de oppositie in.');L(t);if(W.gov.includes(P.party))ministerOffer();result('Nieuw kabinet',t,'',processQ,{em:'🏛️',cat:'Politiek'})}
function runGR(){const W=polW(),P=S.pol;const n=['Amsterdam','Rotterdam','Den Haag','Berlijn','München','Hamburg'].includes(S.p.city)?45:39;
  const sh={};for(const k in W.sh){let s=W.sh[k]*Math.exp(gauss()*.25);if(k===P.party)s*=1+(P.pop-50)/220*(P.lead?2:1)+(P.camp||0)*.01;sh[k]=s}
  const seats=seatsOf(sh,n);const ids=Object.keys(seats).filter(k=>seats[k]>0).sort((a,b)=>seats[b]-seats[a]);const gov=autoForm(seats,n,null);
  const m=seats[P.party]||0;if(!['lid','raad','weth'].includes(P.lvl)){P.camp=0;return `Gemeenteraadsverkiezingen in ${S.p.city}: ${PTY(ids[0]).n} wint. ${PTY(P.party).n} haalt ${m} zetels. Jij blijft ${polTl(P.lvl)}.`}
  const out=[`Gemeenteraadsverkiezingen in ${S.p.city}: ${PTY(ids[0]).n} wint met ${seats[ids[0]]} van de ${n} zetels. ${PTY(P.party).n} haalt er ${m}.`];
  const pos=grPos();const vk=P.pop>=30&&m>0&&chance(.35+(P.pop-30)/80);
  if(pos<=m||vk){if(P.lvl!=='raad')setOffice('raad');out.push(pos<=m?`Je bent gekozen in de gemeenteraad (plek ${pos}).`:`Je stond op plek ${pos}, maar dankzij voorkeursstemmen zit je in de raad!`);hap(6);MS('Werd gekozen in de gemeenteraad',1);
    if(gov.includes(P.party)&&chance(clamp((P.steun-45)/55+Math.min(.2,P.oy*.03)+(P.lead?.4:0),.05,.9)))Q.push({id:'pol_weth',c:{port:pick(WPORT)}})}
  else{if(['raad','weth'].includes(P.lvl))loseOffice();out.push(`Je stond op plek ${pos}. Helaas, geen zetel.`);hap(-4)}
  if(psys().mayor==='elect'&&P.cand.burg){P.cand.burg=0;const rk=ids.indexOf(P.party);const ch=clamp(.12+(P.pop-30)/90-(rk<0?.3:rk*.12)+(P.camp||0)*.01+(P.lvl==='burg'?.3:0),.03,.85);
    if(chance(ch)){setOffice('burg');P.term=W.nextGR+0;MS(`Werd gekozen tot burgemeester van ${S.p.city}`,2);hap(10);out.push(`En: je wint de burgemeestersverkiezing! Je bent de nieuwe burgemeester van ${S.p.city}.`)}else{if(P.lvl==='burg')loseOffice('Je verliest de burgemeestersverkiezing.');out.push('De burgemeestersverkiezing win je niet.')}}
  P.camp=0;return out.join(' ')}
/* ---------- acties ---------- */
function partyLineOf(st,p){const v=p[st[1]];if(Math.abs(v-50)<12)return 'nuance';return (v-50)*st[2]>0?'eens':'oneens'}
function mgDebate(title,cb){const p=PTY(S.pol.party);const qs=stellNow().slice().sort(()=>R()-.5).slice(0,4);let i=0,ok=0,tk=0,left=0;
  const step=()=>{clearInterval(tk);if(i>=qs.length){closeModal();cb(ok/qs.length);return}const st=qs[i],right=partyLineOf(st,p);left=10;
    const pickA=a=>{clearInterval(tk);if(a===right){ok++;toast(pick(['Applaus in de zaal!','Sterk antwoord.','Die zit!']))}else toast(right==='nuance'?'Je partij ziet het genuanceerder.':`Je partij is het hier juist ${right==='eens'?'mee eens':'mee oneens'}.`);i++;step()};
    modal({title,em:'🎤',cat:`Stelling ${i+1} van ${qs.length} · ${p.k}`,text:st[0],html:'<div class="timer"><i id="qt" style="width:100%;transition:width 1s linear"></i></div>',choices:[{t:'👍 Eens',on:()=>pickA('eens')},{t:'👎 Oneens',on:()=>pickA('oneens')},{t:'⚖️ Het ligt genuanceerd',on:()=>pickA('nuance')}]});
    tk=setInterval(()=>{const t=$('#qt');if(!t){clearInterval(tk);return}left--;t.style.width=(left/10*100)+'%';if(left<=0){clearInterval(tk);toast('Te laat! Je staat te hakkelen.');i++;step()}},1000)};step()}
function joinParty(id){const p=PTY(id);modal({title:p.n,em:p.em,cat:p.lbl?cap(p.lbl):'Politiek',text:`${p.d}. Lid worden kost ${fmt(35*(S.cpi||1))} per jaar.`,choices:opts([{t:'Lid worden',cls:'go',on:()=>{closeModal();doAct('Lid worden',()=>{cash(-Math.round(35*(S.cpi||1)));const old=S.pol;
  if(old){dropLead();if(old.lvl!=='lid')loseOffice(`Je stapt over en geeft je zetel als ${polTl(old.lvl)} terug.`);S.pol=Object.assign(mkPol(id),{yrs:old.yrs,oy:old.oy,pop:clamp(old.pop-10),past:old.past,steun:20});return `Je stapt over naar ${p.n}. Je oude partij noemt je een verrader. Bij je nieuwe partij moet je je nog bewijzen.`}
  S.pol=mkPol(id);MS(`Werd lid van ${p.n}`,1);return `Je bent lid van ${p.n}. Je krijgt een welkomstpakket en een uitnodiging voor de ledenvergadering.`},true,p.em)}}])})}
function foundParty(){const cost=Math.round(25000*(S.cpi||1));const sp=[['Links en progressief',22,20],['Links en behoudend',25,70],['Midden',50,48],['Rechts en progressief',72,25],['Rechts en behoudend',75,80]];
  modal({title:'Eigen partij',em:'🎗️',cat:'Politiek',text:`Een eigen partij oprichten kost ${fmt(cost)} (notaris, registratie, eerste campagne). Waar staat jouw partij?`,html:'<div class="inrow"><input class="inp" id="pname" maxlength="28" placeholder="Naam van je partij"></div>',choices:opts(sp.map(([t,lr,pc])=>({t,on:()=>{const nm=($('#pname').value||'').trim()||`Partij ${S.p.last}`;closeModal();
    doAct('Partij opgericht',()=>{cash(-cost);const W=polW();const [em,c]=pick(OWNC);const k=nm.split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,4);
      W.own={id:'own',n:nm,k,em,c,lr,pc,b:1+S.fame*.06};W.sh.own=W.own.b;W.base.own=W.own.b;W.lead.own=myName();normSh();
      dropLead();const old=S.pol;if(old&&old.lvl!=='lid')loseOffice(`Je verlaat je oude partij en geeft je zetel als ${polTl(old.lvl)} terug.`);
      S.pol=Object.assign(mkPol('own'),old?{yrs:old.yrs,oy:old.oy,pop:old.pop,past:old.past}:{});S.pol.cand={tk:1,gr:1};MS(`Richtte ${nm} op`,2);
      return `${nm} is officieel opgericht! Jij bent de partijleider en lijsttrekker. De peiling: ${pollSeats().own||0} zetels. Tijd om bekend te worden.`},true,'🎗️')}})))})}
function polStop(){ask('Stoppen met politiek?','Je zegt je lidmaatschap op'+(S.pol.lvl!=='lid'?` en stopt als ${polTl(S.pol.lvl)}.`:'.'),'Stoppen',()=>{if(S.pol.lvl!=='lid')loseOffice(`Je stopt als ${polTl(S.pol.lvl)}.`);if(S.pol.party==='own'){L(`${S.pw.own.n} wordt opgeheven.`);delete S.pw.sh.own;delete S.pw.base.own;delete S.pw.seats.own;delete S.pw.lead.own;S.pw.own=null;S.pw.gov=S.pw.gov.filter(k=>k!=='own');normSh()}S.pol=null;L('Je bent gestopt met de politiek.');refreshSheet();render();saveLife()})}
const nextLbl=()=>{const W=polW();return `${presL()?`president ${W.nextPR} · `:''}${kName()} ${W.nextTK} · gemeente ${W.nextGR}`};
function seatsHtml(seats,gov,cap){const W=S.pw;const ids=Object.keys(seats).filter(k=>seats[k]>0).sort((a,b)=>seats[b]-seats[a]);const n=Object.values(seats).reduce((s,v)=>s+v,0);
  return `<div class="hemi">${ids.map(k=>`<i style="flex:${seats[k]};background:${PTY(k).c}"></i>`).join('')}</div><div class="plist">${ids.map(k=>{const p=PTY(k);return `<div class="prow${gov&&gov.includes(k)?' gov':''}"><span>${p.em}</span><b>${he(p.n)}</b><em>${seats[k]}</em></div>`}).join('')}</div><p class="muted" style="margin:6px 0 0;font-size:13px">${cap||''}${n?'':''}</p>`}
function sheetPol(el){polMigrate();const a=ageY(),P=S.pol;const W=polW();if(isPres()&&typeof sheetPres==='function'&&!(P&&P.lvl==='dict')){sheetPres(el);return}
  if(!P){card(el,`<h3>🏛️ De politiek in</h3><span class="muted">Word lid van een partij, verover een plek op de kandidatenlijst en werk je op van de gemeenteraad naar ${(psys().seat||'het Torentje').replace(/^Het /,'het ').replace(/^De /,'de ')}. Volgende verkiezingen: ${nextLbl()}.</span>`);polHowRow(el);
    if(a<16){empty(el,'Lid worden van een partij kan vanaf 16 jaar.');citizenSec(el);polWorld(el);return}
    const ps=pollSeats();const s=sec(el,'Kies een partij');for(const p of ptys().slice().sort((a,b)=>(ps[b.id]||0)-(ps[a.id]||0)))row(s,{ic:p.em,t:p.n,s:`${p.lbl?p.lbl+' · ':''}${p.d} · peiling ${ps[p.id]||0} zetels`,on:()=>joinParty(p.id)});
    const o=sec(el,'');row(o,{ic:'🎗️',t:'Eigen partij oprichten',s:a<18?'Vanaf 18 jaar':`Begin bij nul · ${fmt(25000*(S.cpi||1))}`,dis:a<18,dots:true,on:foundParty});
    postSec(el);citizenSec(el);polWorld(el);return}
  if(P.lvl==='dict'&&typeof sheetRegime==='function'){sheetRegime(el);return}
  const p=PTY(P.party);const ps=pollSeats();
  card(el,`<h3>${p.em} ${he(polTitle(P))}</h3><span class="muted">${he(p.n)}${P.lead?' · partijleider':''} · ${P.yrs} jaar lid</span>${kv([['Salaris',POLO[P.lvl].sal?fmt(polSal())+' per jaar':'Onbetaald'],['Peiling partij',`${ps[P.party]||0} zetels (nu ${W.seats[P.party]||0})`],['Verkiezingen',nextLbl()]])}<div class="stat"><span>Steun in de partij</span><span></span><span class="v">${Math.round(P.steun)}%</span>${bar(P.steun)}</div><div class="stat"><span>Populariteit</span><span></span><span class="v">${Math.round(P.pop)}%</span>${bar(P.pop,'var(--brand)')}</div>`);polHowRow(el);
  // verkiezingen en campagne
  const v=sec(el,'Verkiezingen');const camp=year()===W.nextTK-1||year()===W.nextGR-1;const nat=['kamer','min','mp'].includes(P.lvl);
  row(v,{ic:'🗳️',t:`Kandidaat voor ${PT().kamer}`,s:a<18?'Vanaf 18 jaar':['fptp','av'].includes(psys().sys)?(P.cand.tk?`Je bent kandidaat in je eigen district · verkiezingen ${W.nextTK}`:`Kandidaat worden in een district · verkiezingen ${W.nextTK}`):P.cand.tk?`Je staat op plek ${listPos('tk')} · verkiezingen ${W.nextTK}`:`Zet je op de lijst · verkiezingen ${W.nextTK}`,r:P.cand.tk?'✅':'',dis:a<18,on:()=>{P.cand.tk=P.cand.tk?0:1;toast(P.cand.tk?'Je staat op de kandidatenlijst.':'Je staat niet meer op de lijst.');refreshSheet()}});
  row(v,{ic:'🏘️',t:`Kandidaat gemeenteraad ${S.p.city}`,s:a<18?'Vanaf 18 jaar':nat?'Niet naast een landelijke functie':P.cand.gr?`Je staat op plek ${grPos()} · verkiezingen ${W.nextGR}`:`Zet je op de lijst · verkiezingen ${W.nextGR}`,r:P.cand.gr?'✅':'',dis:a<18||nat,on:()=>{P.cand.gr=P.cand.gr?0:1;toast(P.cand.gr?'Je staat op de kandidatenlijst.':'Je staat niet meer op de lijst.');refreshSheet()}});
  if(psys().ek!==0&&(P.oy>=2||P.steun>=60))row(v,{ic:'🏛️',t:`Kandidaat ${lcFn(POLO.ek.t)}`,s:`${S.p.country==='NL'?'Gekozen via de provincies':'Verkiezingen'} · ${W.nextEK}`,r:P.cand.ek?'✅':'',dis:a<25,on:()=>{P.cand.ek=P.cand.ek?0:1;refreshSheet()}});
  if(psys().eu!==0&&(P.oy>=2||P.pop>=40))row(v,{ic:'🇪🇺',t:'Kandidaat Europees Parlement',s:`Verkiezingen ${W.nextEP}`,r:P.cand.ep?'✅':'',dis:a<18,on:()=>{P.cand.ep=P.cand.ep?0:1;refreshSheet()}});
  if(typeof prSheetRows==='function')prSheetRows(v,P,a);if(typeof regSheetRows==='function')regSheetRows(v,P,a);
  if(!P.lead&&P.party!=='own'&&year()===W.nextTK-1&&P.steun>=60)row(v,{ic:'👑',t:'Lijsttrekker worden',s:P.lvl==='lid'||P.oy<2?'Je hebt eerst ervaring in een functie nodig':'Gooi je naam in de ring',dis:P.lvl==='lid'||P.oy<2||P.lt===W.nextTK,dots:true,on:()=>doAct('Lijsttrekker',()=>{P.lt=W.nextTK;if(chance(clamp((P.steun-68)/35+P.pop/300+Math.min(.2,P.oy*.025)+POLO[P.lvl].r*.04,.03,.85))){P.lead=1;P.cand.tk=1;W.lead[P.party]=myName();P.steun=clamp(P.steun+5);MS(`Werd lijsttrekker van ${p.n}`,2);return `De leden kiezen jou! Je bent de lijsttrekker van ${p.n}.`}P.steun=clamp(P.steun-6);return `${W.lead[P.party]} wint de interne verkiezing. Je staat er een beetje gekleed op.`},true,'👑')});
  if(camp){const c=sec(el,`Campagne · verkiezingen ${year()===W.nextTK-1?W.nextTK:W.nextGR}`);
    row(c,{ic:'📣',t:'Flyeren en de markt op',s:'Handen schudden, praatjes maken',on:()=>doAct('Flyeren',()=>{const m=use('pfly');P.camp+=m*2;P.pop=clamp(P.pop+Math.round(2*m));return pick(['Je deelt 400 flyers uit. Eén meneer wil vooral over zijn parkeerplek praten.','Je staat de hele zaterdag op de markt. Je krijgt drie stroopwafels en veel meningen.','Een oud schoolvriend herkent je. Hij stemt op je, zegt hij.'])},true,'📣')});
    row(c,{ic:'🎤',t:'Lijsttrekkersdebat',s:'Minigame · blijf bij de partijlijn',dots:true,on:()=>mgDebate('Debat',sc=>doAct('Debat',()=>{use('pdeb');P.camp+=Math.round(sc*6);P.pop=clamp(P.pop+Math.round((sc-.45)*14));P.steun=clamp(P.steun+Math.round((sc-.4)*8));return sc>=.75?'Je wint het debat volgens de peilers. Je filmpje gaat rond!':sc>=.5?'Een degelijk debat. Niemand valt om, jij ook niet.':'Je haalt de standpunten van je partij door elkaar. Pijnlijk.'},true,'🎤'))});
    row(c,{ic:'📺',t:'Interview geven',s:'Kans op een goede of een slechte avond',dots:true,on:()=>doAct('Interview',()=>{use('pint');if(chance(.5+(S.st.smarts-50)/200+S.sk.sociaal/400)){P.pop=clamp(P.pop+ri(3,7));P.camp+=3;return pick(['Je bent scherp en grappig. De presentator nodigt je meteen weer uit.','Je uitleg over de woningmarkt is helder. Je krijgt veel positieve reacties.'])}P.pop=clamp(P.pop-ri(2,5));return pick(['Je weet de prijs van een brood niet. Het fragment gaat viral.','Je raakt in de war bij een simpele rekenvraag. Au.'])},true,'📺')});
    row(c,{ic:'💶',t:'Geld in de campagnekas',s:P.kas?`Al ${fmt(P.kas)} gestort`:'Posters, advertenties, een campagnebus',dis:S.money<=0,dots:true,on:()=>amountModal('Campagnekas',S.money,v=>doAct('Campagnekas',()=>{cash(-v);P.kas=(P.kas||0)+v;const g=Math.round(Math.min(12,4*Math.log10(1+v/(2000*(S.cpi||1)))));P.pop=clamp(P.pop+g);P.camp+=g;return `Je stort ${fmt(v)} in de campagnekas. Er hangen posters met jouw hoofd in de hele stad.`},true,'💶'))})}
  // partij
  const s=sec(el,'Partij');
  row(s,{ic:'🪑',t:'Ledenvergadering',s:'Laat je zien bij de partij',on:()=>doAct('Ledenvergadering',()=>{const m=use('pvg');P.steun=clamp(P.steun+Math.round(5*m));return pick(['Je zit drie uur in een zaaltje met slechte koffie. Maar je stelt een goede vraag.','Je helpt met stoelen klaarzetten. De voorzitter onthoudt je naam.','Je motie over de partijkas wordt aangenomen.'])},true,'🪑')});
  row(s,{ic:'🤝',t:'Netwerken',s:'Borrels, etentjes, achterkamertjes',on:()=>doAct('Netwerken',()=>{const m=use('pnet');P.steun=clamp(P.steun+Math.round(3*m));sk('sociaal',1);return pick(['Je drinkt een biertje met de fractievoorzitter.','Je raakt aan de praat met een oud-minister. Hij geeft je zijn kaartje.','Je zit naast de partijvoorzitter op een verjaardag.'])},true,'🤝')});
  row(s,{ic:'🎤',t:'Debatavond',s:'Minigame · stellingen van je partij',dots:true,on:()=>mgDebate('Debatavond',sc=>doAct('Debatavond',()=>{use('pdeb');P.steun=clamp(P.steun+Math.round((sc-.4)*10));P.pop=clamp(P.pop+Math.round((sc-.5)*6));return sc>=.75?'Je kent de standpunten van je partij op je duimpje.':sc>=.5?'Redelijk, al twijfel je soms.':'Je zegt een paar keer precies het tegenovergestelde van je partij.'},true,'🎤'))});
  // functie
  const f=sec(el,polT(P.lvl));
  if(P.lvl==='raad'){row(f,{ic:'📜',t:'Motie indienen',s:'Over iets in je eigen stad',dots:true,on:motieMenu});row(f,{ic:'🚶',t:'De wijk in',s:'Luisteren naar bewoners',on:()=>doAct('Wijkbezoek',()=>{const m=use('pwijk');P.pop=clamp(P.pop+Math.round(3*m));return pick(['Bewoners klagen over te hard rijden. Je belooft het mee te nemen.','Je drinkt koffie in het buurthuis en hoort tien verhalen.'])},true,'🚶')})}
  if(P.lvl==='weth'){row(f,{ic:'✂️',t:'Lintje knippen',s:'Een nieuw project openen',on:()=>doAct('Opening',()=>{const m=use('popen');P.pop=clamp(P.pop+Math.round(4*m));return `Je opent ${pick(['een nieuwe speeltuin','een fietsbrug','een sporthal','een gezondheidscentrum'])}. De lokale krant maakt een foto.`},true,'✂️')});row(f,{ic:'📑',t:'Hard werken aan je dossier',s:P.port||'',on:()=>doAct('Dossier',()=>{const m=use('pdos');P.steun=clamp(P.steun+Math.round(3*m));sma(1);return 'Je leest je in tot diep in de nacht. Je ambtenaren zijn onder de indruk.'},true,'📑')})}
  if(['kamer','ek','ep'].includes(P.lvl)){row(f,{ic:'🎤',t:'Debat in de Kamer',s:'Minigame',dots:true,on:()=>mgDebate('Kamerdebat',sc=>doAct('Kamerdebat',()=>{use('pkd');P.pop=clamp(P.pop+Math.round((sc-.45)*10));P.steun=clamp(P.steun+Math.round((sc-.4)*8));return sc>=.75?'Je interruptie haalt het journaal!':'Je debatteert. De publieke tribune is half leeg.'},true,'🎤'))});
    row(f,{ic:'✍️',t:'Schriftelijke vragen stellen',s:'Aandacht voor een misstand',on:()=>doAct('Kamervragen',()=>{const m=use('pkv');P.pop=clamp(P.pop+Math.round(2*m));return `Je stelt vragen over ${pick(['lange wachtlijsten in de jeugdzorg','dure boodschappen','gaten in de dijken','het tekort aan leraren'])}. Een krant pikt het op.`},true,'✍️')})}
  if(['min','mp'].includes(P.lvl)){row(f,{ic:'🎙️',t:'Persconferentie',s:'Een kans of een risico',dots:true,on:()=>doAct('Persconferentie',()=>{use('ppc');if(chance(.55+(S.st.smarts-50)/250)){P.pop=clamp(P.pop+ri(3,6));return 'Je brengt je boodschap rustig en duidelijk. Een sterke week.'}P.pop=clamp(P.pop-ri(3,6));return 'Een journalist stelt een vraag waar je niet op voorbereid bent. Je klapt dicht.'},true,'🎙️')});
    row(f,{ic:'🚆',t:'Werkbezoek',s:'Het land in',on:()=>doAct('Werkbezoek',()=>{const m=use('pwb');P.pop=clamp(P.pop+Math.round(3*m));return `Je brengt een werkbezoek aan ${pick(['een ziekenhuis','een haven','een boerderij','een school','een fabriek'])} in ${pick(C().cities)}.`},true,'🚆')})}
  if(P.lvl==='burg'){row(f,{ic:'🎖️',t:'Lintjesregen',s:'Vrijwilligers in het zonnetje',on:()=>doAct('Lintjes',()=>{const m=use('plint');P.pop=clamp(P.pop+Math.round(3*m));return 'Je speldt twaalf lintjes op. Bij elke speech wordt iemand emotioneel.'},true,'🎖️')})}
  polMore(f,P);if(typeof coupRow==='function')coupRow(el);
  polMore3(f,P);if(typeof regRows==='function')regRows(f,P);
  if(psys().mayor==='elect'&&!['burg','min','mp','cdk','vn','kamer','ek','ep'].includes(P.lvl)&&a>=21)row(f.isConnected?f:el,{ic:'⛓️',t:'Kandidaat burgemeester',s:P.cand.burg?`Verkiezingen in ${W.nextGR}`:'Burgemeesters worden hier direct gekozen',r:P.cand.burg?'✅':'',on:()=>{P.cand.burg=P.cand.burg?0:1;toast(P.cand.burg?'Je doet mee aan de burgemeestersverkiezing.':'Je trekt je terug.');refreshSheet()}});
  if(psys().mayor!=='elect'&&!['burg','min','mp','cdk','vn'].includes(P.lvl)&&P.oy>=4&&a>=30)row(f,{ic:'⛓️',t:'Solliciteren als burgemeester',s:'Benoemd voor zes jaar',dots:true,on:()=>doAct('Sollicitatie',()=>{if(S.acts.burg)return 'Je hebt dit jaar al gesolliciteerd.';S.acts.burg=1;if((S.crim.rec||[]).length)return 'Je strafblad maakt een benoeming onmogelijk.';if(chance(clamp(.15+P.oy*.03+P.pop/250+(S.st.smarts-50)/250,.05,.75))){const c=pick(C().cities.filter(x=>x!==S.p.city))||S.p.city;setOffice('burg');P.term=year()+6;P.cand={};MS(`Werd burgemeester van ${c}`,2);hap(10);return `Je wordt benoemd tot burgemeester van ${c}! Je krijgt een ambtsketen.`}return 'De vertrouwenscommissie kiest een andere kandidaat.'},true,'⛓️')});
  if(!f.querySelector('.mrow'))f.remove();
  warPolSec(el,P);polPeopleSec(el);postSec(el);citizenSec(el);
  const o=sec(el,'Overig');
  if(P.party!=='own')row(o,{ic:'🔀',t:'Overstappen',s:'Naar een andere partij',dots:true,on:()=>modal({title:'Overstappen',em:'🔀',cat:'Politiek',text:'Naar welke partij stap je over?',choices:opts(ptys().filter(x=>x.id!==P.party).map(x=>({t:`${x.em} ${x.n}`,on:()=>{closeModal();joinParty(x.id)}})))})});
  if(P.party!=='own'&&a>=18)row(o,{ic:'🎗️',t:'Eigen partij oprichten',s:fmt(25000*(S.cpi||1)),dots:true,on:foundParty});
  row(o,{ic:'🚪',t:'Stoppen met politiek',dots:true,on:polStop});
  if(P.past.length){const h=sec(el,'Eerdere functies');for(const x of P.past.slice(-6).reverse())row(h,{ic:'📁',t:x.t,s:`Tot ${x.y}`})}
  polWorld(el)}
function motieMenu(){const P=S.pol;const ms=[['🚲','Meer fietsenstallingen bij het station','Klein, maar iedereen is blij',.8,2,1],['🏠','Huizen bouwen op een stuk park','Hard nodig, maar veel boze buren',.5,3,-1],['🎆','Vuurwerkverbod in de hele stad','Je wordt besproken op verjaardagen',.45,1,4],['🌳','Meer bomen in de wijken','Groene stad, weinig tegenstand',.75,2,1]];
  modal({title:'Motie indienen',em:'📜',cat:'Gemeenteraad',text:'Waar dien je een motie over in?',choices:opts(ms.map(([e,t,s,ch,st,pp])=>({t:`${e} ${t}`,s,dis:!!S.acts.motie,on:()=>{closeModal();doAct('Motie',()=>{S.acts.motie=1;if(chance(ch+(P.steun-50)/200)){P.steun=clamp(P.steun+st);P.pop=clamp(P.pop+Math.abs(pp)+1);return 'Je motie wordt aangenomen! Je naam staat in de krant.'}P.pop=clamp(P.pop+(pp<0?-2:1));return 'Je motie haalt het niet. Volgende keer beter.'},true,e)}})))})}
function polWorld(el){const W=polW();const s=sec(el,'Politiek in het land');warCard(s);if(presL()&&W.pm)card(s,`<h3>🏛️ ${psys().seat}</h3><span class="muted">${he(prTxt())} · termijn ${W.pm.t||1} · volgende verkiezing ${W.nextPR}</span>`);
  card(s,`<h3>${kName()}</h3><span class="muted">${W.hist.length?`Uitslag ${W.hist[W.hist.length-1].y}`:'Huidige zetelverdeling'}</span>${seatsHtml(W.seats,W.gov,`Kabinet: ${W.gov.map(k=>PTY(k).k).join(', ')} · ${PT().mp.toLowerCase()} ${he(W.pm?W.pm.n:'?')}`)}`);
  lawsCard(s);if(typeof demCard==='function')demCard(s);
  card(s,`<h3>Peiling</h3><span class="muted">Als er nu verkiezingen waren</span>${seatsHtml(pollSeats(),null,'')}`)}
/* ---------- events ---------- */
E('pol_stem',{sys:1,need:()=>!S.dict,t:'Verkiezingen',x:()=>`Het is verkiezingsdag voor ${PT().kamer}. Op wie stem je?`,ch:[]});
Object.defineProperty(EV.pol_stem,'ch',{get(){const W=polW();const ids=Object.keys(W.sh).sort((a,b)=>W.sh[b]-W.sh[a]);
  return ids.map(k=>[`${PTY(k).em} ${PTY(k).n}`,()=>{W.vote=k;L(`Je stemt op ${PTY(k).n}.`);return ''}]).concat([['🛋️ Niet stemmen',()=>{L('Je gaat niet stemmen.');return ''}]])}});
E('pol_tk',{sys:1,need:()=>!S.dict,t:'Uitslagavond',f:()=>{const c=runTK();return c.news+' '+tkOutcome(c)}});
E('pol_gr',{sys:1,need:()=>!S.dict,t:'Gemeenteraadsverkiezingen',f:()=>runGR()});
E('pol_formatie',{sys:1,need:()=>!S.dict,t:'Formatie',x:()=>`Jij bent de formateur. Ga op zoek naar een meerderheid van minstens ${NEED()} zetels.`,ch:[['🤝 Beginnen met de gesprekken',()=>({go:formation})]]});
E('pol_minister',{sys:1,need:()=>!S.dict&&S.pol&&S.pol.lvl!=='mp',t:'Minister worden?',x:c=>`${presL()?`President ${S.pw.pm.n} belt.`:'De formateur belt.'} Wil je minister van ${c.port} worden?${S.job?' Je moet dan stoppen met je baan.':''}`,ch:[
 ['✅ Ja, graag',c=>{setOffice('min',c.port);hap(12);S.pol.pop=clamp(S.pol.pop+10);MS(`Werd minister van ${c.port}`,3);return `Je wordt beëdigd op het bordes. Je bent minister van ${c.port}!`}],
 ['🙅 Nee, bedankt',()=>{S.pol.steun=clamp(S.pol.steun-4);return 'Je bedankt voor de eer. De formateur belt iemand anders.'}]]});
E('pol_weth',{sys:1,need:()=>!S.dict,t:'Wethouder worden?',x:c=>`Je partij komt in het college. Wil jij wethouder ${c.port} worden?${S.job?' Je moet dan stoppen met je baan.':''}`,ch:[
 ['✅ Ja',c=>{setOffice('weth',c.port);hap(8);MS(`Werd wethouder in ${S.p.city}`,2);return `Je bent wethouder ${c.port} in ${S.p.city}!`}],
 ['🙅 Nee, ik blijf raadslid',()=>'Je blijft in de raad.']]});
E('pol_lijst',{sys:1,need:()=>!S.dict,t:'Lijsttrekker?',x:()=>`Het partijbestuur van ${PTY(S.pol.party).n} vraagt of jij de lijsttrekker wilt worden bij de volgende verkiezingen.`,ch:[
 ['👑 Ja, ik ga ervoor',()=>{const P=S.pol;P.lead=1;P.cand.tk=1;S.pw.lead[P.party]=myName();MS(`Werd lijsttrekker van ${PTY(P.party).n}`,2);hap(6);return 'Je bent de lijsttrekker! Je gezicht komt op alle posters.'}],
 ['🙅 Nee, nog niet',()=>'Je houdt de boot af. Misschien later.']]});
E('pol_ek',{sys:1,need:()=>!S.dict,t:'Eerste Kamer',f:()=>{const P=S.pol,W=S.pw;if(['kamer','min','mp','weth','burg','ep'].includes(P.lvl))return 'Je staat op de lijst voor de Eerste Kamer, maar je hebt al een andere functie.';const n=Math.round((W.seats[P.party]||0)/2);
  if(n>0&&chance(clamp((P.steun-40)/60,.05,.9))){setOffice('ek');MS('Werd Eerste Kamerlid',1);return `Je bent gekozen in de Eerste Kamer! ${PTY(P.party).n} heeft daar ${n} zetels.`}if(P.lvl==='ek')loseOffice();return 'Je haalt geen zetel in de Eerste Kamer.'}});
E('pol_ep',{sys:1,need:()=>!S.dict,t:'Europese verkiezingen',f:()=>{const P=S.pol,W=S.pw;const n=Math.round((W.sh[P.party]||0)/100*31*Math.exp(gauss()*.2));const pos=Math.max(1,Math.round(listPos('ep')*.5));
  if(['kamer','min','mp'].includes(P.lvl))return `${PTY(P.party).n} haalt ${n} Europese zetels. Jij blijft in Den Haag.`;
  if(pos<=n||P.pop>=75&&n>0){setOffice('ep');MS('Werd Europarlementariër',2);return `${PTY(P.party).n} haalt ${n} zetels. Jij gaat naar Brussel en Straatsburg!`}if(P.lvl==='ep')loseOffice();return `${PTY(P.party).n} haalt ${n} zetels. Jij stond op plek ${pos}, net te laag.`}});
E('pol_fractie',{c:()=>S.pol&&['raad','kamer','ek','ep'].includes(S.pol.lvl)&&!inJail(),cd:3,t:'Fractiediscipline',x:()=>`De ${S.pol.lvl==='raad'?'fractievoorzitter':'fractieleider'} wil dat je voor een voorstel stemt waar je het eigenlijk niet mee eens bent.`,ch:[
 ['🫡 Netjes meestemmen',()=>{S.pol.steun=clamp(S.pol.steun+6);S.pol.pop=clamp(S.pol.pop-2);return 'Je stemt mee. De fractie waardeert het. Thuis voelt het minder goed.'}],
 ['✋ Tegen stemmen',()=>{S.pol.steun=clamp(S.pol.steun-10);S.pol.pop=clamp(S.pol.pop+5);return 'Je stemt tegen. De fractie is woest, maar kiezers vinden je principieel.'}]]});
E('pol_talkshow',{c:()=>S.pol&&S.pol.lvl!=='lid'&&!inJail(),cd:2,t:'Talkshow',x:()=>`Je wordt uitgenodigd aan tafel bij ${pick(['een late-night talkshow','een radioprogramma','een populaire podcast'])}.`,ch:[
 ['📺 Aanschuiven',()=>{if(chance(.55+(S.st.smarts-50)/200)){S.pol.pop=clamp(S.pol.pop+ri(4,8));S.fame=clamp(S.fame+2);return 'Je bent scherp en grappig. Het fragment wordt veel gedeeld.'}S.pol.pop=clamp(S.pol.pop-ri(3,6));return 'Een andere gast maakt je af. Je krijgt er geen woord tussen.'}],
 ['🙅 Afslaan',()=>'Je blijft liever thuis.']]});
E('pol_burger',{c:()=>S.pol&&['raad','weth','burg'].includes(S.pol.lvl)&&!inJail(),cd:3,t:'Boze buurtbewoner',x:'Een bewoner staat bij je voor de deur. Hij is woedend over een nieuw parkeerbeleid.',ch:[
 ['☕ Binnen laten en luisteren',()=>{S.pol.pop=clamp(S.pol.pop+3);return 'Na een uur en twee bakken koffie gaat hij tevreden weg.'}],
 ['🚪 Verwijzen naar het spreekuur',()=>{S.pol.pop=clamp(S.pol.pop-2);return 'Hij zet een boze post op Facebook over je.'}]]});
E('pol_tweet',{c:()=>S.pol&&S.pol.pop>=30&&!inJail(),cd:4,t:'Oude tweet',x:'Een journalist vindt een tweet van jou van jaren geleden. Niet je beste moment.',ch:[
 ['🙏 Excuses maken',()=>{S.pol.pop=clamp(S.pol.pop-2);return 'Je biedt je excuses aan. Na een dag is het over.'}],
 ['🤷 Ontkennen',()=>{if(chance(.4))return 'Het waait over.';S.pol.pop=clamp(S.pol.pop-8);S.pol.steun=clamp(S.pol.steun-5);return 'Er duiken screenshots op. Nu ben je ook nog een leugenaar.'}]]});
E('pol_crisis',{c:()=>S.pol&&S.pol.lvl==='mp'&&!inJail(),cd:2,t:'Nationale crisis',x:()=>pick(['Na dagen regen dreigen de rivieren te overstromen.','Een groot bedrijf dreigt duizenden banen te schrappen.','Een cyberaanval legt de overheid plat.']),ch:[
 ['🧭 Zelf het voortouw nemen',()=>{if(chance(.6)){S.pol.pop=clamp(S.pol.pop+8);return 'Je staat er. Het land ziet een leider.'}S.pol.pop=clamp(S.pol.pop-6);return 'Je pakt het aan, maar het gaat mis. De kritiek is fel.'}],
 ['🤝 Overlaten aan je ministers',()=>{S.pol.pop=clamp(S.pol.pop-2);return 'De crisis wordt bezworen. Waar was de premier, vragen mensen.'}]]});
Object.assign(EVMETA,{pol_stem:['Politiek','🗳️'],pol_tk:['Politiek','📊'],pol_gr:['Politiek','🏘️'],pol_formatie:['Politiek','🤝'],pol_minister:['Politiek','🏛️'],pol_weth:['Politiek','🏘️'],pol_lijst:['Politiek','👑'],pol_ek:['Politiek','🏛️'],pol_ep:['Politiek','🇪🇺'],pol_fractie:['Politiek','🫡'],pol_talkshow:['Politiek','📺'],pol_burger:['Politiek','😠'],pol_tweet:['Politiek','🐦'],pol_crisis:['Politiek','🚨']});
{const j=JOBS.find(x=>x.id==='politiek');if(j)j.hide=1}

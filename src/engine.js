/* ================= ENGINE ================= */
let S=null, Q=[], period={inc:0,exp:0,src:{},out:{}};
// BUY: 1 = de speler koopt iets (dan mag je niet rood komen), 2 = er is al geloot, dus wat volgt is een gevolg (boete, rekening)
let BUY=0;const NOMONEY={nomoney:1};
const R=()=>{if(BUY===1)BUY=2;return Math.random()}, ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)], clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)), chance=p=>R()<p;
const gauss=()=>{let u=0,v=0;while(!u)u=R();while(!v)v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-5);
const ageY=()=>Math.floor(S.m/12);
const C=()=>COUNTRIES[S.p.country];
const year=()=>S.p.by+Math.floor((S.p.bm-1+S.m)/12);
const monthIdx=()=>(S.p.bm-1+S.m)%12;
const he=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function fmt(v){const c=COUNTRIES[S?S.p.country:'NL'];let x=v*c.k;const neg=x<0;x=Math.abs(x);let s;
  const sc=(d,u)=>(Math.floor(x/d*100)/100).toLocaleString('nl-NL',{maximumFractionDigits:2,useGrouping:false})+u;
  if(x>=1e15)s=sc(1e15,' biljard');else if(x>=1e12)s=sc(1e12,' biljoen');else if(x>=1e9)s=sc(1e9,' miljard');else if(x>=1e6)s=sc(1e6,' miljoen');
  else s=Math.round(x).toLocaleString('nl-NL');
  return (neg?'-':'')+c.cur+' '+s}
function L(t,c){S.log.push({a:ageY(),y:year(),mo:S.settings.mode==='month'?monthIdx():null,t,c:c||''})}
function MS(t,w=1){S.ms.push({a:ageY(),y:year(),t,w})}
function st(k,d){S.st[k]=clamp(Math.round(S.st[k]+d))}
const hap=d=>st('happy',d), hea=d=>st('health',d), sma=d=>st('smarts',d), loo=d=>st('looks',d<0&&S.talent==='model'?d/2:d);
const kar=d=>{S.karma=clamp(Math.round(S.karma+d))}, cash=d=>{if(BUY===1&&d<0&&S.money+d<-.5)throw NOMONEY;S.money+=d};
function sk(k,d){if(d>0&&S.talent&&TAL(S.talent)[4]===k)d*=1.75;S.sk[k]=clamp(Math.round(S.sk[k]+d))}
const P=id=>S.rel.find(p=>p.id===id);
const pAge=p=>Math.floor((S.m-p.born)/12);
const people=role=>S.rel.filter(p=>p.born<=S.m&&(!role||(Array.isArray(role)?role.includes(p.role):p.role===role)));
const living=role=>people(role).filter(p=>p.alive);
const partner=()=>S.rel.find(p=>p.role==='partner'&&p.alive);
const pickLiving=role=>{const a=living(role);return a.length?pick(a):null};
function relAdj(role,d){const p=living(role)[0];if(p)p.rel=clamp(p.rel+d)}
function rname(g){const N=NAMES[C().r];return pick(N[g||pick(['m','v'])])}
function company(){return pick(COMPANIES)}
const isAdult=()=>ageY()>=18;
const inJail=()=>!!S.crim.jail;
function mkPerson(role,g,born,o={}){const N=NAMES[COUNTRIES[o.country||S.p.country].r];const gg=g==='x'?pick(['m','v']):g;if(role!=='huisdier'&&!o.ap&&typeof randAp==='function')o=Object.assign({ap:randAp(gg)},o);
  return Object.assign({id:uid(),role,g:gg,first:pick(N[gg]),last:pick(N.l),born,rel:ri(55,90),alive:true,looks:ri(20,95),smarts:ri(20,95),money:0,job:''},o)}
const relWord=p=>({moeder:'moeder',vader:'vader',broer:'broer',zus:'zus',partner:p.g==='v'?'vriendin':'vriend',kind:p.g==='v'?'dochter':'zoon',kleinkind:p.g==='v'?'kleindochter':'kleinzoon',vriend:p.g==='v'?'vriendin':'vriend',ex:'ex',huisdier:p.sp}[p.role]||p.role);
function partnerWord(p){if(!p)return'';if(p.st==='getrouwd')return p.g==='v'?'vrouw':'man';if(p.st==='verloofd')return p.g==='v'?'verloofde':'verloofde';return p.g==='v'?'vriendin':'vriend'}

/* ---------- nieuw leven ---------- */
function blankState(o){
  return {v:1,id:uid(),created:Date.now(),updated:Date.now(),gen:o.gen||1,fam:o.fam||uid(),settings:{mode:o.mode||'year',chaos:o.chaos??1,bigFam:o.bigFam??1},
    p:{first:o.first,last:o.last,g:o.g,country:o.country,bc:o.bc||o.country,city:o.city,by:o.by,bm:o.bm||ri(1,12)},
    m:0,alive:true,cause:'',st:{happy:ri(62,95),health:ri(75,100),smarts:ri(15,95),looks:ri(15,95)},karma:ri(40,70),fame:0,
    sk:{sport:ri(0,12),muziek:ri(0,8),koken:ri(0,8),tech:ri(0,8),zaken:ri(0,8),kunst:ri(0,12),sociaal:ri(5,22)},
    money:0,debt:0,loan:0,edu:{stage:'none',perf:ri(40,70),cur:null,deg:[],lvl:null,yrs:0,len:0},job:null,jobs:[],biz:[],home:{k:'ouders'},props:[],cars:[],
    inv:{spaar:0,index:0,aandelen:0,crypto:0},items:[],fights:{w:0,l:0},rel:[],crim:{rec:[],jail:null,wanted:false,heat:0,open:[]},lic:false,ill:[],flags:{pets:0,ingMig:1,salCpi:1},ms:[],log:[],acts:{},foll:0,pension:0,evLast:{},snaps:[],preg:null,hist:{happy:0,n:0,peakNW:0,topJob:''},gens:o.gens||[],q:[]};
}
function newLife(o){
  S=blankState(o);Q=[];
  const wealth=pick(['arm','midden','midden','midden','rijk']);S.flags.wealth=wealth;
  const momAge=ri(21,40),dadAge=clamp(momAge+ri(-3,7),18,60);
  const pm=wealth==='arm'?ri(1,15)*1000:wealth==='rijk'?ri(400,3000)*1000:ri(20,150)*1000;
  const mom=mkPerson('moeder','v',-momAge*12-ri(0,11),{money:pm/2,job:pick(PJOBS[wealth])});
  const dad=mkPerson('vader','m',-dadAge*12-ri(0,11),{last:o.last,money:pm/2,job:pick(PJOBS[wealth])});
  S.rel.push(mom,dad);
  S.ap=o.ap||randAp(o.g);S.talent=o.talent||'geen';const at=o.attr||{};for(const k of ['happy','health','smarts','looks'])if(at[k]!=null)S.st[k]=clamp(at[k]);if(at.karma!=null)S.karma=clamp(at.karma);S.disc=at.disc??ri(30,70);S.fert=at.fert??ri(45,90);if(o.pref)S.flags.pref=o.pref;mom.ap=apParentOf(S.ap,'v','eye');dad.ap=apParentOf(S.ap,'m','hc');
  {const tk=TAL(S.talent)[4];if(tk)S.sk[tk]=clamp(S.sk[tk]+15);if(S.talent==='model')S.st.looks=clamp(S.st.looks+8);if(S.talent==='acteren')S.sk.sociaal=clamp(S.sk.sociaal+5)}
  const ns=pick([0,0,1,1,1,2,2,3]);
  for(let i=0;i<ns;i++){const older=chance(.5);const off=older?-(ri(1,8)*12+ri(0,11)):ri(1,8)*12+ri(0,11);if(!older&&momAge+off/12>44)continue;const g=pick(['m','v']);S.rel.push(mkPerson(g==='m'?'broer':'zus',g,off,{last:o.last,ap:apMix(mom.ap,dad.ap,g)}))}
  L(`Je bent geboren in ${o.city}, ${C().n}. Je bent een ${o.g==='m'?'jongen':o.g==='v'?'meisje':'kindje'}: ${o.first} ${o.last}.`,'big');
  L(`Je moeder is ${mom.first} ${mom.last} (${momAge}), ${mom.job}. Je vader is ${dad.first} ${dad.last} (${dadAge}), ${dad.job}.`);
  const sib=living(['broer','zus']);if(sib.length)L(sib.length===1?`Je hebt een oudere ${relWord(sib[0])}: ${sib[0].first}.`:`Je hebt ${sib.length} oudere ${sib.every(x=>x.role==='broer')?'broers':sib.every(x=>x.role==='zus')?'zussen':'broers en zussen'}: ${sib.map(s=>`${relWord(s)} ${s.first}`).join(', ').replace(/, ([^,]*)$/,' en $1')}.`);
  MS(`Geboren in ${o.city}, ${C().n}`,0);
  S.cpi=1;S.econ={s:'normaal',y:0};
  snap();
  return S;
}

/* ---------- tijd ---------- */
function advance(){
  if(!S||!S.alive||Q.length)return;
  snap();
  const n=S.settings.mode==='month'?1:12;
  period={inc:0,exp:0,src:{},out:{}};
  let evc=0;const maxEv=n===12?(S.settings.chaos===2?4:3):1;
  for(let i=0;i<n&&S.alive;i++){
    S.m++;
    monthTick();
    if(!S.alive)break;
    if(S.m%12===0)birthday();
    if(S.m%12===0&&S.alive)debtYear();
    if(!S.alive)break;
    if(evc<maxEv){const e=rollEvent();if(e){Q.push(e);evc++}}
  }
  if(S.alive&&(period.inc>1||period.exp>1)&&ageY()>=16){
    const net=period.inc-period.exp;
    const parts=Object.entries(period.src).filter(([,v])=>v>=1).sort((x,y)=>y[1]-x[1]);
    const outs=Object.entries(period.out).filter(([,v])=>v>=1).sort((x,y)=>y[1]-x[1]).slice(0,4);
    if(Math.abs(net)>=1){L(`${n===12?'Dit jaar':'Deze maand'}: ${fmt(period.inc)} inkomsten${parts.length?' ('+parts.map(([k,v])=>`${k.toLowerCase()} ${fmt(v)}`).join(', ')+')':''}, ${fmt(period.exp)} uitgaven${outs.length?' ('+outs.map(([k,v])=>`${k.toLowerCase()} ${fmt(v)}`).join(', ')+')':''}.${period.lowFun?' Je hebt dit jaar weinig ontspanning gehad.':''}`,'sys');period.lowFun=0}
  }
  if(S.alive&&period.auto>=1){L(`Automatisch belegd ${n===12?'dit jaar':'deze maand'}: ${fmt(period.auto)} in ${destName(S.auto.to)}.`,'sys')}
  if(S.alive&&period.lowFun){L('Je hebt dit jaar weinig ontspanning gehad. Plan eens een uitje, vakantie of avond uit.','sys');period.lowFun=0}
  const nw=netWorth();if(nw>S.hist.peakNW)S.hist.peakNW=nw;
}
function snap(){
  if(S.m%12!==0||S.snaps.some(x=>x.m===S.m))return;
  const c=Object.assign({},S);delete c.snaps;delete c.log;if(c.flags&&c.flags.mk){c.flags=Object.assign({},c.flags);delete c.flags.mk}// huizenmarkt niet in de opname
  S.snaps.push({m:S.m,ll:S.log.length,d:JSON.stringify(c)});
  while(S.snaps.length>11)S.snaps.shift();
}
function rewindTarget(n){const t=S.m-12*n;let best=null;for(const x of S.snaps)if(x.m<=t&&(!best||x.m>best.m))best=x;return best}
function rewind(n){
  const sn=rewindTarget(n);if(!sn)return false;
  const snaps=S.snaps.filter(x=>x.m<=sn.m),log=S.log.slice(0,sn.ll),id=S.id;
  const d=JSON.parse(sn.d);d.snaps=snaps;d.log=log;d.id=id;d.alive=true;d.cause='';d.q=[];
  S=d;Q=[];
  L(`Teruggespoeld naar je ${ageY()}e.`,'sys');
  return true;
}
// lonen stijgen mee met de inflatie; mult is de reële loonsverhoging
function salary(){if(!S.job)return 0;const j=JOB(S.job.id);return j.sal[S.job.lvl]*1000*S.job.mult*(S.cpi||1)*(S.eco?S.eco.wr:1)*(j.sal[S.job.lvl]<=32?law('minloon'):1)}
const jsal=(j,l)=>Math.round(j.sal[l]*1000*(S.cpi||1));
// uitkering dekt levensonderhoud en huur tot een grens (met huurtoeslag), zodat wie niet werkt niet vanzelf steeds dieper rood komt te staan (zie verbeterplan 1.5)
function bijstand(){const c=S.cpi||1;return Math.round((livingCost()*c+Math.min(S.home.rent||0,16000*c))*law('minloon')*(typeof bijstandF==='function'?bijstandF():1))}
function livingCost(){const a=ageY();let c=13000;const pt=partner();if(pt&&pt.st==='getrouwd')c=9500;if(a>=aowAge())c*=.85;return c}
function netWorth(){let n=S.money-S.debt-S.loan+(S.trust||0)+(S.swiss||0);for(const k in S.inv)n+=S.inv[k];for(const p of S.props)n+=p.value-p.mort;for(const p of S.re||[])n+=p.value-p.mort;for(const c of S.cars)n+=c.value;for(const it of S.items||[])n+=it.value;for(const b of S.biz)n+=b.value*b.eq/100;if(typeof angelVal==='function')n+=angelVal();n+=(S.crim&&S.crim.dirty)||0;return Math.round(n)}
function sponsor(){if(S.foll<25000)return 0;const act=S.flags.postY!=null&&year()-S.flags.postY<=1;const eng=S.flags.eng??50;return Math.round(S.foll*.03*(eng/60)*(act?1:.25))}
function taxOn(g){if(g<=0||(typeof noTax==='function'&&noTax()))return 0;const c=S.cpi||1;g/=c;const t=g<=38000?g*.3697:38000*.3697+(g-38000)*law('ib');const cred=Math.max(0,8000-Math.max(0,g-25000)*.08);return Math.max(0,t-cred)*c}
function taxable(){let g=0;for(const [k,v] of incomeParts())if(['Salaris','Directeurssalaris','Militair salaris','Invaliditeitspensioen','Militaire uitkering','Werk voor de bezetter','WW-uitkering','Politieke functie','Lobbywerk','Commissariaten','Talkshowgast','Pensioen','Sponsordeals','Social media'].includes(k))g+=v;return g}
function econLabel(){const e=S.econ||{s:'normaal'};return {groei:'Hoogconjunctuur',normaal:'Stabiel',recessie:'Recessie'}[e.s]}
const econ=()=>(S.econ&&S.econ.s)||'normaal';
function incomeParts(){const a=S.m/12,out=[];
  if(!S.crim.jail&&S.job)out.push(['Salaris',salary()]);
  {const ds=S.biz.reduce((x,b)=>x+(b.ceo!==false&&b.sal?b.sal:0),0);if(ds&&!S.crim.jail)out.push(['Directeurssalaris',ds])}
  if(typeof polSal==='function'&&S.pol){const x=polSal();if(x)out.push(['Politieke functie',x])}
  if(typeof dictSal==='function'&&S.dict){const x=dictSal();if(x)out.push(['Salaris als leider',x])}
  if(typeof polPostInc==='function')for(const x of polPostInc())out.push(x);
  if(typeof milSal==='function'&&S.mil){const x=milSal();if(x)out.push(['Militair salaris',x])}
  if(typeof postMilInc==='function'&&!S.mil)for(const x of postMilInc())out.push(x);
  if(typeof occInc==='function')for(const x of occInc())out.push(x);
  if(typeof wwInc==='function')for(const x of wwInc())out.push(x);
  if(S.crim.jail&&S.crim.jail.work)out.push(['Gevangeniswerk',1500]);
  if(S.pension)out.push(['Pensioen',S.pension]);
  else if(a>=18&&!S.job&&!(S.pol&&S.pol.lvl!=='lid')&&!S.mil&&!(S.ww&&S.ww.left>0)&&!(S.pex&&(S.pex.lob||S.pex.com||S.pex.tv))&&!(S.pmil&&(S.pmil.inv||S.pmil.fpu&&a<aowAge()))&&!S.edu.cur&&!S.crim.jail&&!S.biz.length&&S.home.k!=='ouders')out.push(['Uitkering',bijstand()]);
  const rent=S.props.filter(p=>p.rentOut).reduce((x,p)=>x+pRent(p),0);if(rent)out.push(['Huurinkomsten',rent]);
  const sp=sponsor();if(sp)out.push(['Sponsordeals',sp]);
  {const pt=S.home&&S.home.samen&&partner();if(pt&&pt.id===S.home.samen&&pt.st!=='getrouwd'&&!S.crim.jail){const x=Math.round(Math.min(partnerInc(pt)*.3,(S.home.k==='huur'?S.home.rent/2:0)+3000*(S.cpi||1)));if(x>0)out.push(['Bijdrage '+pt.first,x])}}
  if(typeof smIncome==='function'){const x=smIncome();if(x)out.push(['Social media',x])}
  if(S.edu.cur&&S.edu.cur.fund==='lening'){if(law('beurs'))out.push(['Basisbeurs',3000]);out.push(['Studielening',law('beurs')?1800:4800])}
  return out}
function monthTick(){
  const a=S.m/12;let inc=0,exp=0;const ex=(k,v)=>{if(v<=0)return;exp+=v;period.out[k]=(period.out[k]||0)+v};
  for(const p of S.rel)if(p.born===S.m&&S.m>0&&(p.role==='broer'||p.role==='zus')){L(`Je ${p.role==='broer'?'broertje':'zusje'} ${p.first} is geboren!`,'good');hap(4)}
  if(S.preg&&S.m>=S.preg.due)birthChild();
  if(S.crim.jail){S.crim.jail.left--;if(S.crim.jail.left<=0)release()}
  for(const [k,v] of incomeParts()){inc+=v/12;period.src[k]=(period.src[k]||0)+v/12}
  ex('Belasting',taxOn(taxable())/12);
  if(a>=18&&S.home.k!=='ouders'&&!S.crim.jail){let lc=livingCost()*(S.cpi||1);
    // wie alleen van een uitkering leeft, leeft zuiniger: levensonderhoud past zich aan wat er na de huur overblijft (minstens 60%)
    const ip=incomeParts();if(ip.length&&ip.every(([k])=>k==='Uitkering')){const left=ip[0][1]-(S.home.k==='huur'?S.home.rent||0:0);lc=Math.min(lc,Math.max(lc*.6,left))}
    ex('Levensonderhoud',lc/12)}
  if(S.home.k==='huur')ex('Huur',S.home.rent/12);
  for(const pr of S.props){if(pr.mort>0){const rt=pr.rate??.04;const rep=pr.af==='mix'?(pr.mort>pr.mort0*.5?pr.mort0*.5/360:0):Math.min(pr.mort,pr.mort0/360);ex('Hypotheek',pr.mort*rt/12+rep);pr.mort=Math.max(0,pr.mort-rep)}ex('Onderhoud woning',pr.value*.0035/12);if(S.home.k==='eigen'&&S.home.pid===pr.id)ex('Energie',pr.value*.0022*((pr.lbl??3)+1)/4/12)}
  if(S.flags.bg&&!S.crim.jail)ex('Beveiliging',bgCost()/12);
  for(const c of S.cars)ex('Auto',(c.value*.03+1100)*(S.cpi||1)/12);
  {const nk=living('kind').filter(k=>pAge(k)<18).length;if(nk){if(S.cust==='ex')ex('Kinderalimentatie',nk*4200*(S.cpi||1)/12);else ex('Kinderen',nk*6500*(S.cpi||1)*(S.cust==='co'?.6:1)/12)}else if(S.cust)S.cust=null}
  for(const p of living('huisdier'))ex('Huisdieren',(p.cost||300)*.25/12);
  for(const it of S.items||[])if(it.up)ex('Onderhoud bezit',it.value*it.up/12);
  if(S.crim.jail){const J=S.crim.jail;J.resp=clamp(Math.round(J.resp??10));J.gb=clamp(Math.round(J.gb??50))}
  if(S.edu.cur){const c=S.edu.cur;if(c.fund==='lening'){S.debt+=(c.fee+(law('beurs')?1800:4800))/12}else if(c.fund==='zelf')ex('Collegegeld',c.fee/12);else if(c.fund==='ouders'){}}
  else if(S.debt>0&&a>=21){const pay=Math.min(S.debt,Math.max(45,S.debt/180));S.debt-=pay;ex('Studieschuld',pay)}
  if(S.loan>0){const pay=Math.min(S.loan,S.loan*.06/12+Math.max(80,S.loan/120));S.loan=Math.max(0,S.loan-(pay-S.loan*.06/12));ex('Leningen',pay)}
  if(S.debt>0&&S.edu.cur==null)S.debt*=1+.025/12;
  if(S.money<0&&a>=18&&!S.wsnp)ex('Rente rood staan',-S.money*.12/12);
  if(typeof insPrem==='function')for(const x of [...S.cars,...(S.items||[])])if(x.ins)ex('Verzekeringen',insPrem(x)/12);
  S.money+=inc-exp;period.inc+=inc;period.exp+=exp;
  if(S.auto&&S.auto.pct>0&&a>=18&&!S.crim.jail&&typeof autoInvest==='function')autoInvest(inc-exp);
  for(const il of S.ill)st('health',-il.sev/12);
  if(S.st.health<=0){const n=S.flags.zkh||0;if(a>=82||(n>=2&&chance(.35+n*.1))||(S.ill.some(i=>i.l)&&n>=1&&chance(.5)))return die(deathCause(a));hospital(a);return}
  if(chance(mortality(a,S.st.health)/12))die(deathCause(a));
}
function mortality(a,h){let b=a<1?.002:a<15?.0004:a<40?.0009:a<50?.0025:a<60?.006:a<70?.015:a<80?.04:a<90?.1:a<100?.24:.5;const f=h<10?6:h<25?3:h<45?1.6:h>80?.6:1;return b*f}
function hospital(a){S.flags.zkh=(S.flags.zkh||0)+1;S.st.health=15;const k=Math.round(ri(4,9)*100*(S.cpi||1)*law('er'));cash(-k);hap(-10);if(S.job&&!S.job.part)(S.job&&(S.job.perf=clamp(S.job.perf-15)));
  L(`Je bent met spoed opgenomen in het ziekenhuis. Je lichaam gaf het bijna op. Eigen bijdrage: ${fmt(k)}.`,'bad big');MS('Werd met spoed opgenomen in het ziekenhuis',1);Q.push({id:'s_zkh',c:{n:S.flags.zkh}})}
// kies een tekst die je recent niet hebt gezien
function pickF(key,arr){const F=S.flags.pf||(S.flags.pf={});const rec=F[key]||[];let opts=arr.map((_,i)=>i).filter(i=>!rec.includes(i));if(!opts.length)opts=arr.map((_,i)=>i);const i=pick(opts);F[key]=rec.concat(i).slice(-Math.min(arr.length-1,4));return arr[i]}
const causeTxt=c=>/^vredig|^in je slaap/.test(c)?'vredig in '+(S&&S.p.g==='v'?'haar':S&&S.p.g==='m'?'zijn':'diens')+' slaap':'aan '+c;
function deathCause(a){const le=S.ill.find(i=>i.l);if(le)return le.n;if(S.st.health<=5)return 'een slechte gezondheid';if(a<4)return pick(['een zeldzame aangeboren aandoening','een ernstige infectie']);if(a<30)return pick(['een verkeersongeluk','een ongeluk tijdens het klimmen','een zeldzame hartafwijking','een val van de trap']);if(a<60)return pick(['een hartaanval','een beroerte','een verkeersongeluk','kanker']);if(a<85)return pick(['een hartaanval','longontsteking','een beroerte','kanker','hartfalen','vredig in je slaap']);return pick(['ouderdom','een hartaanval','longontsteking','vredig in je slaap','een beroerte','ouderdom'])}
function die(cause){if(!S.alive)return;S.alive=false;S.cause=cause;S.died=ageY();const ct=/^vredig/.test(cause)?'vredig in je slaap':'aan '+cause;L(cause==='opgegeven'?`Je hebt het opgegeven, ${ageY()} jaar oud.`:`Je bent overleden ${ct}, ${ageY()} jaar oud.`,'bad big');MS(cause==='opgegeven'?'Gaf het op':`Overleden ${ct}`,0);Q=[];checkAch()}

function econYear(){if(S.eco)return;const e=S.econ||(S.econ={s:'normaal',y:0});e.y++;
  if(e.s==='normaal'&&e.y>=2){if(chance(.13)){e.s='recessie';e.y=0;L('De economie is in een recessie beland. Banen staan onder druk en de beurs daalt.','bad')}else if(chance(.12)){e.s='groei';e.y=0;L('De economie groeit hard. Bedrijven nemen volop mensen aan.','good')}}
  else if(e.s!=='normaal'&&e.y>=ri(1,3)){L(e.s==='recessie'?'De recessie is voorbij.':'De hoogconjunctuur koelt af.','sys');e.s='normaal';e.y=0}}
function birthday(){
  const a=ageY();const did=S.acts||{};S.lastActs=did;S.acts={};S.hist.happy+=S.st.happy;S.hist.n++;
  if(typeof ecoYear==='function')ecoYear();const infl=S.eco?S.eco.inf/100:.022+gauss()*.008;S.cpi=(S.cpi||1)*(1+infl);if(S.pension)S.pension=Math.round(S.pension*(1+infl));if(S.home.k==='huur'&&a>=19){const hb=law('huur');S.home.rent=Math.round(S.home.rent*(hb===-1?1:1+infl+hb))}
  econYear();if(typeof warYear==='function'){warYear();vetYear()}
  const h0=S.st.health;const sporty=['gym','run','klim','jsport','tapgym','taprun','spel','zorg','fiets','zwem','sp_'].some(k=>Object.keys(did).some(x=>x.startsWith(k)))||(S.sport&&['club','school','academie','uni','pro'].includes(S.sport.st));if(a>=25&&!sporty){hea(-ri(0,2));if(a>=45)hea(-ri(0,1));if(chance(.4))loo(-1)}if(sporty&&a>=16)hea(ri(0,2));
  if(a>=18&&!(typeof noTax==='function'&&noTax())){const base=Math.max(0,S.money)+Object.values(S.inv).reduce((x,y)=>x+y,0)+S.props.filter(p=>p.id!==S.home.pid).reduce((x,p)=>x+p.value-p.mort,0)-57000;if(base>0){const t=Math.round(base*law('verm'));cash(-t);period.out['Vermogensbelasting']=(period.out['Vermogensbelasting']||0)+t;period.exp+=t}}
  if(a>=45)hea(-ri(0,1));if(a>=60)hea(-ri(0,2));if(a>=75)hea(-ri(1,3));
  if(a>=35&&chance(.5))loo(-1);if(a>=55)loo(-ri(0,2));if(a<=18)sma(ri(0,2));
  // geluk zakt alleen door echte gebeurtenissen; zonder tegenslag drijft het alleen omhoog naar je basis
  {const hb=happyBase(),neg=happyParts().some(([v])=>v<0);if(hb>S.st.happy)hap(Math.round((hb-S.st.happy)/7)+ri(0,1));else if(neg)hap(Math.round((hb-S.st.happy)/7))}
  if(typeof circYear==='function')circYear();
  if(typeof addYear==='function')addYear();
  if(typeof prisonYear==='function'){prisonYear();postYear();loverJailYear()}
  if(typeof orgYear==='function')orgYear();
  if(typeof famYear==='function'){famYear(a);loveYear();kidYear()}
  relYear(a);eduYear(a);jobYear(a);if(typeof sportYear==='function')sportYear(a);bizYear();if(typeof polYear==='function')polYear(a);if(typeof milYear==='function'){milYear(a);if(S.mil&&!inJail())milYear2()}if(typeof dictYear==='function'){dictYear();coupYear()}assetYear();fameYear();illYear(a);
  if(S.crim.heat>0)S.crim.heat=Math.max(0,Math.round(S.crim.heat-15));
  S.crim.open=(S.crim.open||[]).filter(o=>a-o.a<=10);
  if(!inJail()&&S.crim.open.length&&chance(.06+(S.crim.heat||0)/400)){const o=S.crim.open.splice(ri(0,S.crim.open.length-1),1)[0];Q.push({id:'s_caught',c:{w:o.w,m:o.m}})}
  if(S.crim.wanted&&!inJail()&&chance(.25)){const m=ri(12,48);L(`De politie heeft je opgespoord. Je moet nog ${Math.round(m/12)} jaar zitten.`,'bad');jail(m,'ontsnapping')}
  if(a===18&&S.home.k==='ouders'&&!inJail())Q.push({id:'s_18'});
  if(a===aowAge()&&S.job&&!S.job.part)Q.push({id:'s_pensioen'});
  if(a>=aowAge()&&!S.pension)setPension();
  healthCheck(a,h0);
  if(a===18&&S.trust>0){cash(S.trust);L(`Je bent 18: het geld dat voor je vaststond (${fmt(S.trust)}) staat nu op je rekening.`,'good');S.trust=0}
  if(a===16&&S.flags.jeugd&&!S.job){setJob('voetbal',0);L('Je jeugdcontract gaat over in een profcontract!','good')}
  checkAch();
}
// waar je geluk op de lange termijn naartoe beweegt
function happyParts(){const o=[];const pa=partner();if(pa&&pa.rel>=50)o.push([pa.st==='getrouwd'?10:7,'Een fijne relatie']);
  const ks=living('kind').filter(k=>k.rel>=50).length;if(ks)o.push([Math.min(3,ks)*3,'Een goede band met je kinderen']);
  if(living('vriend').filter(f=>f.rel>=50).length>=2)o.push([4,'Goede vrienden']);if(living('huisdier').length)o.push([3,'Een huisdier']);
  if(S.job&&!S.job.part){if(S.job.perf>=60)o.push([4,'Het gaat goed op je werk']);if(typeof degSec==='function'&&degSec(JOB(S.job.id)))o.push([3,'Werk in je eigen vak'])}else if(ageY()>=67)o.push([4,'Genieten van je pensioen']);
  if(S.st.health>=70)o.push([4,'Een goede gezondheid']);else if(S.st.health<30)o.push([-6,'Een slechte gezondheid']);
  if(S.money>=0&&!S.flags.schuld)o.push([3,'Geen geldzorgen']);else o.push([-6,'Schulden']);if(S.home.k==='eigen')o.push([3,'Een eigen huis']);if(inJail())o.push([-15,'De gevangenis']);return o}
function happyBase(){return clamp(42+happyParts().reduce((x,[v])=>x+v,0),15,90)}
function healthCheck(a,h0){const h=S.st.health;const F=S.flags;
  if(S.alive&&!inJail()){if(h<20&&!F.hw20){F.hw20=F.hw40=1;Q.push({id:'s_gezond',c:{l:20}})}else if(h<40&&!F.hw40&&a>=12){F.hw40=1;Q.push({id:'s_gezond',c:{l:40}})}
    if(S.st.happy>=40)F.hapArm=1;if(S.st.happy<25&&a>=12&&(F.hapw==null||F.hapArm||a-F.hapw>=10)){F.hapw=a;F.hapArm=0;Q.push({id:'s_geluk'})}}
  F.hdown=h<h0-.5?(F.hdown||0)+1:0;if(F.hdown>=3&&F.hdown%3===0)L(`Je gezondheid gaat al ${F.hdown} jaar achteruit (nu ${Math.round(h)}%). Sporten of een check bij de dokter helpt.`,'bad')}
function relYear(a){
  for(const p of S.rel){if(!p.alive||p.born>S.m)continue;const pa=pAge(p);
    if((p.role==='moeder'||p.role==='vader')&&pa<67){const w=S.flags.wealth;p.money=(p.money||0)+(w==='rijk'?ri(15,60):w==='arm'?ri(0,2):ri(2,8))*1000*(S.cpi||1)}
    if(p.role==='huisdier'){if(pa>=p.life){p.alive=false;p.died=a;L(`Je ${p.sp} ${p.first} is overleden.`,'bad');hap(-8)}continue}
    if(chance(mortality(pa,p.hl??70))){p.alive=false;p.died=a;onDeath(p);continue}
    const met=Object.keys(S.lastActs||{}).some(k=>k.endsWith(p.id))||(S.lastActs||{}).tijd;
    if(!(p.role==='kind'&&pa<14)&&p.role!=='kleinkind'&&p.role!=='partner')p.rel=clamp(p.rel+(met?ri(0,2):-ri(0,3)));
    if(p.role==='kind'&&pa===18){L(`${p.first} is 18 en gaat op zichzelf wonen.`)}
    if((p.role==='kind'||p.role==='kleinkind')&&pa>=22&&!p.job&&chance(.35))p.job=p.study&&chance(.5+p.study*.15)?pick(GOODJOBS):pick(KIDJOBS);
    if(p.role==='partner'){const yrs=p.since!=null?a-p.since:0;p.rel=clamp(p.rel+(met?ri(0,3):-(p.st==='getrouwd'?ri(0,2):ri(1,3))-(yrs>=10&&!met&&chance(.3)?1:0)));if(p.rel<20&&chance(.35))Q.push({id:'s_weg',c:{id:p.id}})}
  }
}
function onDeath(p){if(typeof famOnDeath==='function')famOnDeath(p);
  const close=['moeder','vader','partner','kind'].includes(p.role);
  L(`Je ${relWord(p)} ${p.first} is overleden, ${pAge(p)} jaar oud.`,'bad');hap(close?-ri(12,25):-ri(3,8));
  if(close)MS(`Verloor ${p.role==='partner'?'je '+partnerWord(p):'je '+relWord(p)} ${p.first}`,1);
  if(p.role==='moeder'||p.role==='vader'){
    const other=living(p.role==='moeder'?'vader':'moeder')[0];
    let est=Math.max(0,p.money);if(other){other.money+=est*.6;est*=.4}
    const kids=1+living(['broer','zus']).length;const share=Math.round(est/kids*(1-.1));
    if(share>100){const sib=kids>1?` (verdeeld met ${kids-1} ${kids===2?'broer of zus':'broers en zussen'})`:'';if(ageY()<18){S.trust=(S.trust||0)+share;L(`Je erft ${fmt(share)} van je ${relWord(p)}${sib}. Het geld staat vast tot je 18 bent.`,'good')}else{cash(share);L(`Je erft ${fmt(share)} van je ${relWord(p)}${sib}.`,'good')}if(share>50000)MS(`Erfde ${fmt(share)}`,1)}
  }
  if(p.role==='partner'&&p.st==='getrouwd'){cash(Math.max(0,p.money));p.wid=1;}
  if(typeof uvAfterDeath==='function')uvAfterDeath(p);
  if(p.role==='partner')p.role='ex',p.lost=1;
}
/* ---------- onderwijs ---------- */
function eduYear(a){
  const E=S.edu;
  if(a===4&&E.stage==='none'){E.stage='basis';L('Je gaat naar de basisschool.');return}
  if(E.stage==='basis'||E.stage==='middel'){if(typeof gradesYear==='function')gradesYear(E);else E.perf=clamp(E.perf+(S.st.smarts-50)/10+ri(-6,6))}
  if(a===12&&E.stage==='basis'&&typeof setAdvice==='function'){if(!Q.some(q=>q.id==='sc_eindtoets'))Q.push({id:'sc_eindtoets'});return}
  if(a>=12&&E.stage==='basis'){
    const sc=S.st.smarts*.6+E.perf*.4;E.lvl=sc>=66?'vwo':sc>=47?'havo':'vmbo';E.stage='middel';E.yrs=0;E.len={vmbo:4,havo:5,vwo:6}[E.lvl];
    L(`Je basisschooladvies is ${E.lvl}. Je gaat naar de middelbare school.`,'big');MS(`Kreeg ${E.lvl}-advies`,0);return}
  if(E.stage==='middel'){
    const V=typeof verdict==='function'?verdict(E):[(E.fails||0)>=3?'zitten':'over',''];const rap=typeof rapportHtml==='function'&&E.yrs+1<E.len;
    let zit=V[0]==='zitten'||(V[0]==='bespreek'&&chance(.45));
    if(zit&&(E.stay||0)>=1&&E.lvl!=='vmbo'){const nl=E.lvl==='vwo'?'havo':'vmbo';const yr=E.yrs;E.lvl=nl;E.len={vmbo:4,havo:5}[nl];E.yrs=Math.min(yr,E.len-2);E.prof=nl==='vmbo'?null:E.prof;E.stay=0;if(E.gr)for(const k in E.gr)E.gr[k]=Math.min(10,E.gr[k]+1.2);L(`Je stroomt af naar het ${nl}.`,'bad big');MS(`Stroomde af naar het ${nl}`,0);hap(-6);if(rap)Q.push({id:'sc_rapport',c:{txt:`${Object.entries(E.gr).map(([k,v])=>`${k} ${nl1(v)}`).join(' · ')}. Je bent twee keer blijven zitten en gaat verder op het ${nl}.`}});return}
    if(zit&&(E.stay||0)<2){E.stay=(E.stay||0)+1;if(E.gr)for(const k in E.gr)E.gr[k]=Math.min(10,E.gr[k]+.8);L('Je bent blijven zitten.','bad');hap(-6);E.perf=clamp(E.perf+12);if(rap)Q.push({id:'sc_rapport',c:{txt:`${Object.entries(E.gr).map(([k,v])=>`${k} ${nl1(v-.8)}`).join(' · ')}. ${V[0]==='bespreek'?'De docentenvergadering vindt het niet genoeg. ':''}Je blijft zitten.`}});return}
    if(rap)Q.push({id:'sc_rapport',c:{txt:`${Object.entries(E.gr).map(([k,v])=>`${k} ${nl1(v)}`).join(' · ')}. ${V[0]==='bespreek'?'Je was een bespreekgeval, maar de docenten geven je een kans. ':''}Je gaat over naar jaar ${E.yrs+2}!`}});
    E.yrs++;
    if(E.lvl!=='vmbo'&&E.yrs===3&&!E.prof&&typeof PROF!=='undefined')Q.push({id:'sc_profiel'});
    if(E.lvl==='vmbo'&&E.yrs===2&&!E.sect&&typeof VSEC!=='undefined')Q.push({id:'sc_sector'});
    if(E.yrs>=E.len){E.yrs=E.len;if(!Q.some(q=>q.id==='eindexamen'))Q.push({id:'eindexamen',c:{l:E.lvl}})}
    return}
  if(E.cur){const c=E.cur;
    if(typeof studyYear==='function'){const r=studyYear(c);if(r===false)return;if(r==='skip')return}
    c.perf=clamp(c.perf+(S.st.smarts-50)/12+ri(-7,6)-(S.job&&!S.job.part?8:0)+((S.disc??50)-50)/15);
    const stu=STUDIES.find(s=>s.id===c.f);if(stu&&stu.sk)sk(stu.sk,ri(2,4));
    if(c.perf<20&&chance(.5)){if(chance(.4)){L(`Je bent gestopt met ${c.name}: je haalde je studiepunten niet.`,'bad');MS(`Stopte met ${c.name}`,0);E.cur=null;hap(-8);return}L('Je hebt dit studiejaar niet gehaald.','bad');hap(-4);return}
    c.y++;sma(ri(1,3));
    if(c.y===c.len-1&&c.ty!=='phd'&&c.f&&!c.stage){const p=pathOf(c.f,c.ty);if(p.length){c.stage=1;const [job,l]=p[0];Q.push({id:'s_stage',c:{job,lvl:Math.min(l,JOB(job).lad.length-1),co:company()}})}}
    if(c.y>=c.len){E.cur=null;E.deg.push({ty:c.ty,f:c.f});const nm=`${ENAME[c.ty]} ${STUDIES.find(s=>s.id===c.f)?.t||''}`.trim();
      L(`Afgestudeerd! Je hebt je diploma ${nm}.`,'good big');MS(`Studeerde af: ${nm}`,2);hap(10);if(c.offer)Q.push({id:'s_aanbod',c:c.offer});
      if(c.ty==='wo'&&c.f!=='geneeskunde')Q.push({id:'s_master',c:{f:c.f,fund:c.fund}});
      else if(c.ty==='master'||(c.ty==='wo'&&c.f==='geneeskunde'))Q.push({id:'s_phd',c:{f:c.f,fund:c.fund}});
    }
  }
}
function eduRank(){let r=S.edu.stage==='basis'||S.edu.stage==='middel'||S.edu.stage==='klaar'?1:0;for(const d of S.edu.deg)r=Math.max(r,ERANK[d.ty]||0);if(S.edu.deg.some(d=>d.f==='geneeskunde'))r=Math.max(r,7);return r}
const hasField=f=>S.edu.deg.some(d=>d.f===f);
function canEnter(ty){const d=S.edu.deg.map(x=>x.ty);if(S.edu.cur||ageY()<16)return false;
  if(ty==='mbo')return true;if(ty==='hbo')return d.some(x=>['havo','vwo','mbo','hbo','wo'].includes(x));
  if(ty==='wo')return d.some(x=>['vwo','hbo','wo'].includes(x));if(ty==='master')return d.some(x=>['wo','hbo'].includes(x));if(ty==='phd')return d.some(x=>x==='master')||hasField('geneeskunde');return false}
function enroll(ty,f,fund){if(S.job&&!S.job.part){L(`Je stopt als ${jobTitle().toLowerCase()} om te gaan studeren.`);endJob()}const stu=STUDIES.find(s=>s.id===f);const len=ty==='master'?(f==='techniek'||f==='informatica'?2:1):ty==='phd'?4:ty==='wo'?(stu&&stu.len)||3:ty==='hbo'?4:3;
  const fee=ty==='mbo'?1300:ty==='phd'?0:2600;
  const name=ty==='phd'?`promotieonderzoek ${stu?stu.t:''}`:`${ty==='master'?'de master':ty==='wo'?'de universitaire studie':'de '+ty+'-opleiding'} ${stu?stu.t:''}`;
  S.edu.cur={ty,f,y:0,len,fee,fund:ty==='phd'?'beurs':fund,perf:clamp(S.edu.perf+ri(-5,10)),name};
  if(ty==='phd'){S.edu.cur.stip=1}
  L(`Je begint aan ${name}.`,'big');MS(`Begon aan ${name}`,0)}
/* ---------- werk ---------- */
function jobReqs(j){const r=j.req,a=ageY(),out=[];
  if(a<r.age[0])out.push(`vanaf ${r.age[0]} jaar`);if(a>r.age[1])out.push(`tot ${r.age[1]} jaar`);
  if(j.np){if(!startFor(j))out.push(pathNeed(j))}
  const altOk=j.np||(j.alt&&S.sk[j.alt[0]]>=j.alt[1]);
  if(!altOk){if(r.e&&eduRank()<r.e)out.push(`opleiding: ${['','basisschool','middelbare school','havo','mbo','hbo','universiteit','master','promotie'][r.e]}`);
    if(r.f&&!r.f.some(hasField))out.push(`diploma ${r.f.map(f=>STUDIES.find(s=>s.id===f).t).join(' of ')}`)}
  if(r.sm&&S.st.smarts<r.sm)out.push('slimmer zijn');if(r.lk&&S.st.looks<r.lk)out.push('knapper zijn');
  if(r.sk&&S.sk[r.sk[0]]<r.sk[1])out.push(`${SKN[r.sk[0]]} ${r.sk[1]}+`);
  if(r.clean&&S.crim.rec.length)out.push('geen strafblad');if(r.lic&&!S.lic)out.push('rijbewijs');
  if(!j.part&&(S.edu.stage==='middel'||S.edu.stage==='basis'))out.push('eerst je school afmaken');
  if(!j.part&&S.edu.cur)out.push(`eerst je studie afronden (${S.edu.cur.ty==='havo'?'avondschool':S.edu.cur.ty})`);
  if(S.job&&S.job.id==='prosport'&&j.id!=='prosport')out.push('je bent profsporter: eerst stoppen met je sportcarrière');
  if(typeof needVOG==='function'&&needVOG(j)&&recentRec())out.push('een VOG (geen veroordeling in de laatste 5 jaar)');
  return out}
const overQ=j=>j.sec==='algemeen'&&!j.part&&eduRank()>=5;
function hireChance(j,bonus){let c=(typeof recentRec==='function'&&recentRec()?-.12:0)+(S.eco?clamp(.5+(5-S.eco.u)/22,.15,.72):econ()==='recessie'?.38:econ()==='groei'?.6:.5)+(S.st.smarts-50)/220+(S.st.looks-50)/320+(S.st.happy-50)/400;if(typeof degSec==='function'&&degSec(j))c+=.2;else if(j.bonus&&j.bonus.some(hasField))c+=.15;if(overQ(j))c-=.1;if(j.id==='muzikant'&&hasField('muziek'))c+=.35;if(S.talent&&S.talent!=='geen'&&{acteur:'acteren',model:'model',muzikant:'muziek',voetbal:'sport'}[j.id]===S.talent)c+=.3;if(j.sk)c+=(S.sk[j.sk]-30)/250;if(j.part)c+=.15;if(j.fame)c-=.25;if(j.pol)c-=.15;return clamp(c+(bonus||0),.05,.95)}
function setJob(id,lvl,co){const j=JOB(id);if(S.mil&&!j.part&&typeof milLeave==='function')milLeave('Je verlaat Defensie voor een nieuwe baan.');S.job={id,lvl:lvl||0,perf:ri(45,60)+(typeof degSec==='function'&&degSec(j)?5:0),yrs:0,lyrs:0,mult:1,co:j.fame||j.pol?'':co||company(),part:!!j.part};
  if(j.lad.length>1&&j.lad.length-1===S.job.lvl)S.flags.top=1;
  if(typeof collectCareer==='function')collectCareer(id);
  L(`Je bent begonnen als ${j.lad[S.job.lvl].toLowerCase()}${S.job.co?' bij '+S.job.co:''}.`,'good');MS(`Werd ${j.lad[S.job.lvl].toLowerCase()}`,j.part?0:1)}
function jobTitle(){if(!S.job)return'';if(S.job.id==='prosport'&&typeof sportTitle==='function')return sportTitle();return JOB(S.job.id).lad[S.job.lvl]}
function endJob(){if(!S.job)return;S.jobs.push({t:jobTitle(),co:S.job.co,y:S.job.yrs});S.job=null}
function jobYear(a){
  if(!S.job||inJail())return;const j=JOB(S.job.id);S.job.yrs++;S.job.lyrs++;if(S.job.id==='prosport')return;if(!S.job.part&&S.job.yrs>=1)Q.push({id:'w_review'});
  const hard=(S.lastActs||{}).werk||0;(S.job&&(S.job.perf=clamp(S.job.perf+(S.st.smarts-50)/25+ri(-7,5)-4+Math.min(10,hard*4)+(S.st.happy<25?-5:0)-(econ()==='recessie'?3:0)+(degSec(j)?2:0)+((S.disc??50)-50)/25)));
  if(j.sk)sk(j.sk,ri(1,3));
  S.job.mult*=S.job.perf>60?1.012:1;
  if(j.fame)S.fame=clamp(S.fame+S.job.lvl*ri(1,6));
  if(S.job.lvl<j.lad.length-1&&S.job.lyrs>=2&&S.job.perf>=68&&chance(.15+(S.job.perf-68)/90+(j.fame?(S.fame-40)/300:0)+(degSec(j)?.05:0))){promote();return}
  if(S.job.perf<16&&chance(.45)){L(`Je bent ontslagen als ${jobTitle().toLowerCase()} wegens slechte prestaties.`,'bad');MS('Werd ontslagen',0);hap(-12);endJob();return}
  if(j.id==='voetbal'&&a>=34){L('Je lichaam wil niet meer. Je stopt met profvoetbal.','big');MS('Stopte met profvoetbal',1);endJob();return}
  if(j.id==='model'&&a>=33&&chance(.4)){L('Het modellenbureau verlengt je contract niet meer.');endJob()}
}
function promote(){const j=JOB(S.job.id);S.job.lvl++;S.job.lyrs=0;S.job.mult=1;(S.job&&(S.job.perf=clamp(S.job.perf-12)));hap(8);
  const t=j.lad[S.job.lvl];L(`Promotie! Je bent nu ${t.toLowerCase()}.`,'good big');MS(`Werd ${t.toLowerCase()}`,S.job.lvl===j.lad.length-1?3:1);
  if(S.job.lvl===j.lad.length-1){S.flags.top=1;if(j.id==='politiek')S.flags.premier=1;if(j.id==='muzikant')S.flags.ster=1}
  if(j.id==='arts')S.flags.arts=1;S.hist.topJob=t}
function setPension(){const c=S.cpi||1;let p=17000*c;for(const h of S.jobs)p+=h.y*450*c;if(S.job)p+=S.job.yrs*450*c+salary()*.01*S.job.yrs;S.pension=Math.round(Math.min(p,90000*c))}
function retire(){setPension();const t=jobTitle();endJob();L(`Je gaat met pensioen. Je krijgt ${fmt(S.pension)} per jaar.`,'big');MS(`Ging met pensioen als ${t.toLowerCase()}`,1);hap(10)}
/* ---------- bedrijf ---------- */
function sellBiz(b,price){const share=Math.round(price*b.eq/100);cash(share);S.biz=S.biz.filter(x=>x!==b);L(`Je hebt ${b.name} verkocht voor ${fmt(price)}. Jouw deel: ${fmt(share)}.`,'good big');MS(`Verkocht ${b.name} voor ${fmt(price)}`,3);if(share>=1e6)S.flags.exit=1}
/* ---------- bezit ---------- */
function assetYear(){
  for(const k in INV){if(k==='aandelen'||k==='crypto')continue;if(S.inv[k]>0){let r=S.eco?(k==='spaar'?Math.max(0,S.eco.r-.8)/100:Math.max(-.85,S.eco.ret+gauss()*.03)):Math.max(-.85,INV[k][1]+gauss()*INV[k][2]);if(S.flags.rebound&&k!=='spaar')r+=k==='crypto'?.4:k==='aandelen'?.25:.18;const d=S.inv[k]*r;S.inv[k]+=d;if(Math.abs(d)>=250)L(`${INV[k][0]}: ${r>=0?'+':''}${Math.round(r*100)}% (${d>=0?'+':''}${fmt(d)}).`,d>=0?'good':'bad')}}
  if(typeof stockYear==='function')stockYear();
  if(S.flags.rebound)S.flags.rebound=0;
  const mk=S.eco?S.eco.hpg:.035+gauss()*.06+(econ()==='recessie'?-.08:econ()==='groei'?.03:0);for(const p of S.props)p.value=Math.round(p.value*(1+mk+gauss()*.02));
  for(const c of S.cars){c.value=Math.round(c.value*(1+(c.ap??(c.old?.04:-.14))+gauss()*.03));c.cond=Math.max(0,(c.cond??100)-ri(3,10))}
  for(const it of S.items||[]){it.value=Math.max(1,Math.round(it.value*(1+(it.ap??(it.art?.05:-.1))+gauss()*(it.vol??.03))));it.cond=Math.max(0,(it.cond??100)-ri(1,6))}
  if(typeof ownYear==='function')ownYear();
  houseYear();if(typeof reYear==='function')reYear();
  const cp=S.cpi||1;if(S.money<-30000*cp&&S.home.k==='huur'&&S.home.rent>11500*cp*1.05){L(`Je kunt de huur van je ${S.home.name.toLowerCase()} niet meer betalen. Je verhuist naar een kleine sociale huurwoning.`,'bad');S.home={k:'huur',name:'Sociale huurwoning',rent:Math.round(9500*cp)};hap(-5)}
  if(S.money<-25000&&!S.flags.schuld){S.flags.schuld=1;L('Je staat zwaar in het rood. De bank belt elke week.','bad');hap(-10)}
  if(S.money>=0)S.flags.schuld=0;
}
function partnerInc(p){if(!p)return 0;if(p.inc==null){const a=pAge(p);p.inc=a<22||/student|scholier/.test(p.job||'')?0:ri(24,58)*1000}return p.inc*(S.cpi||1)}
function maxMortgage(){const pa=partner();const inc=(S.job&&!inJail()?salary():0)+(S.pension||0)+S.biz.reduce((a,b)=>a+Math.max(0,b.profit)*b.eq/100,0)+(pa?partnerInc(pa)*(pa.st==='relatie'?.5:1):0);return Math.round(inc*5)}
function setRent(name,rent){if(S.home.k==='eigen'){}S.home={k:'huur',name,rent};L(`Je huurt nu een ${name.toLowerCase()} voor ${fmt(rent/12)} per maand.`)}
/* ---------- relaties ---------- */
function addFriend(n){if(living('vriend').length>=8)return null;const g=pick(['m','v']);const p=mkPerson('vriend',g,S.m-ri(-2,2)*12-ageY()*12,{rel:ri(55,80)});if(n)p.first=n;S.rel.push(p);L(`Je bent bevriend geraakt met ${p.first}.`,'good');return p}
const TRAITS={avontuurlijk:'reizen, festivals en spontane plannen',romantisch:'kaarslicht, bloemen en lange wandelingen',grappig:'stand-up comedy en flauwe woordgrappen',intellectueel:'boeken, musea en diepe gesprekken',sportief:'hardlopen, de sportschool en buiten zijn'};
function candidate(){const a=ageY();const pref=S.flags.pref||'beide';const g=pref==='mannen'?'m':pref==='vrouwen'?'v':pick(['m','v']);
  const age=clamp(a+ri(-5,5),a<18?Math.max(14,a-2):18,a<18?a+2:99);
  const p=mkPerson('partner',g,S.m-age*12-ri(0,11),{since:ageY(),rel:ri(45,70),st:'relatie',job:age>=22?pick(KIDJOBS):age>=18?'student':'scholier',money:age>=22?ri(2,80)*1000:0,tr:pick(Object.keys(TRAITS))});return p}
function addPartner(p){p=p||candidate();S.rel.push(p);L(`Je hebt een relatie met ${p.first} ${p.last}.`,'good');MS(`Kreeg een relatie met ${p.first}`,1);return p}
function breakUp(){const p=partner();if(!p)return;if(p.st==='getrouwd'){const half=p.prenup?0:Math.round(Math.max(0,S.money)/2);cash(-half);L(`Je bent gescheiden van ${p.first}.${p.prenup?' Dankzij jullie huwelijkse voorwaarden houd je je eigen geld.':` Je verliest ${fmt(half)}.`}`,'bad');MS(`Scheidde van ${p.first}`,1)}else L(`Je bent uit elkaar met ${p.first}.`,'bad');p.role='ex';p.st='';p.live=0;p.rel=clamp(p.rel-25);hap(-10);S.rel=S.rel.filter(x=>!(x.of===p.id&&['schoonmoeder','schoonvader','zwager','schoonzus'].includes(x.role)));if(living('kind').some(k=>pAge(k)<18&&(!k.op||k.op===p.id)))Q.push({id:'f_voogdij',c:{}})}
function fertile(){const p=partner();if(!p)return 0;const fa=S.p.g==='v'?ageY():p.g==='v'?pAge(p):null;if(fa===null)return 0;return (fa<30?.6:fa<35?.45:fa<40?.25:fa<45?.08:0)*Math.min(1.5,.4+(S.fert??65)/100*1.1)}
function tryBaby(){const f=fertile();if(S.preg)return'Er is al een baby onderweg!';if(!f)return partner()&&S.p.g!=='v'&&partner().g!=='v'?'Jullie kunnen samen geen kind krijgen. Adoptie is een optie.':'Het lukt niet om zwanger te worden.';
  if(chance(f)){S.preg={due:S.m+9,twins:chance(.03)};hap(6);return S.p.g==='v'?'Je bent zwanger!':`${partner().first} is zwanger!`}return 'Het is (nog) niet gelukt.'}
function birthChild(o){const pt=S.preg&&S.preg.op?(P(S.preg.op)||partner()):partner();const n=S.preg&&S.preg.twins?2:1;S.preg=null;for(let i=0;i<n;i++){const g=pick(['m','v']);
  const k=mkPerson('kind',g,S.m,{ap:apMix(S.ap,pt?apOf(pt):null,g),last:S.p.last,rel:95,op:pt?pt.id:null,opn:pt?pt.first:'',smarts:clamp(Math.round(((pt?pt.smarts:50)+S.st.smarts)/2+ri(-15,15))),looks:clamp(Math.round(((pt?pt.looks:50)+S.st.looks)/2+ri(-15,15)))});
  S.rel.push(k);Q.unshift({id:'s_baby',c:{id:k.id,adopt:o&&o.adopt}})}hap(15)}
function adopt(){const g=pick(['m','v']);const age=ri(0,6);const k=mkPerson('kind',g,S.m-age*12,{last:S.p.last,rel:75,op:partner()?.id||null,opn:partner()?.first||''});S.rel.push(k);cash(-15000);hap(12);Q.unshift({id:'s_baby',c:{id:k.id,adopt:1}});return k}
/* ---------- misdaad ---------- */
function jail(months,what){if(S.mil&&typeof milLeave==='function')milLeave('Na je veroordeling word je oneervol ontslagen uit Defensie.','bad');months=Math.max(1,Math.round(months*law('straf')));endJob();if(typeof polJail==='function')polJail();S.crim.jail={left:months,total:months,resp:10,gb:50,gang:null,work:false,tunnel:0,study:0,cell:null,contra:0};S.crim.heat=0;S.crim.rec.push({w:what,a:ageY()});S.flags.bajes=1;if(S.fame>=25){S.fame=clamp(S.fame-8);S.foll=Math.round(S.foll*.75);L('Je arrestatie is groot nieuws. Je verliest een kwart van je volgers.','bad')}L(`Je gaat ${months>=12?(months/12).toLocaleString('nl-NL',{maximumFractionDigits:1})+' jaar':months+' maanden'} de gevangenis in.`,'bad big');MS(`Zat vast voor ${what}`,2);hap(-20);const p=partner();if(p&&months>24&&chance(.4)){L(`${p.first} kan er niet meer tegen en maakt het uit.`,'bad');breakUp()}if(typeof prisonSetup==='function')prisonSetup(S.crim.jail,what,months)}
function release(how){const J=S.crim.jail;if(J&&J.gang)S.flags.gang=J.gang;S.crim.jail=null;L(how==='parole'?'Je bent voorwaardelijk vrijgelaten.':'Je bent vrijgelaten uit de gevangenis.','good big');hap(10);if(typeof afterPrison==='function')afterPrison(J,how)}
/* ---------- events ---------- */
function rollEvent(){
  const ch=S.settings.chaos;const rate=[.15,.18,.22][ch]*(inJail()?2.2:1);if(!chance(rate))return null;
  const a=ageY();const pool=[];let tot=0;
  for(const id in EV){const e=EV[id];if(e.sys)continue;if(!!e.jail!==inJail())continue;if(e.a&&(a<e.a[0]||a>e.a[1]))continue;if(e.once&&S.flags['e_'+id])continue;
    const last=S.evLast[id];if(last!=null&&S.m-last<(e.cd||9)*12)continue;
    if(e.c&&!safe(()=>e.c()))continue;let w=(typeof e.w==='function'?e.w():(e.w||1))*(e.chaos?[.12,1,3.2][ch]:1);if(w<=0)continue;pool.push([id,w]);tot+=w}
  if(!pool.length)return null;let r=R()*tot;
  for(const [id,w] of pool){r-=w;if(r<=0){const e=EV[id];let c={};if(e.ctx){c=safe(()=>e.ctx());if(!c)return null}S.evLast[id]=S.m;if(e.once)S.flags['e_'+id]=1;return{id,c}}}
  return null}
function safe(f){try{return f()}catch(e){console.warn(e);if(typeof errLog==='function')errLog(e,'opgevangen');return null}}
/* ---------- verhaal & score ---------- */
function checkAch(){const a=ageY(),nw=netWorth(),f=S.flags;const got=S.ach||(S.ach=[]);const add=k=>{if(!got.includes(k))got.push(k)};
  if(nw>=1e6)add('miljonair');if(nw>=1e7)add('multi');if(a>=100)add('eeuw');if(a>=90)add('negentig');if(f.getrouwd)add('getrouwd');if(people('kind').length>=4)add('gezin');if(people('kleinkind').length)add('opa');
  if(f.top)add('top');if(f.arts)add('arts');if(f.premier)add('premier');for(const [k,x] of [['kamerlid','po_kamer'],['wetgever','wet'],['eigenpartij','eigenpartij'],['premier3','premier3'],['overleefd','overleefd'],['burgemeester','po_burg'],['draaideur','draaideur'],['commando','mil_kct'],['piloot','mil_f35'],['generaal','generaal'],['cds','cds'],['willemsorde','med_mwo'],['veteraan','veteraan'],['oorlogsvet','oorlogsvet'],['vredestichter','vrede'],['verzet','vhk'],['bevrijd','bevrijd'],['dictator','dictator'],['dynastie','dynastie'],['aanslag','aanslag'],['vreedzaam','vreedzaam'],['gevlucht','gevlucht'],['veroveraar','veroveraar'],['wereldrijk','wereldrijk'],['uspres','uspres'],['pres2','pres2'],['ussen','ussen'],['usgov','po_gov'],['ecwin','ecwin'],['impeach','impeach'],['afgezet','afgezet'],['wpres','wpres']])if(f[x])add(k);if(f.ster)add('ster');if(f.ondernemer)add('ondernemer');if(f.exit)add('exit');if(f.beroemd)add('beroemd');
  if(S.edu.deg.some(d=>['wo','master','phd'].includes(d.ty)))add('academicus');if(S.edu.deg.some(d=>d.ty==='phd'))add('doctor');if(f.huis)add('huis');if(f.vastgoed)add('vastgoed');if(f.wereld)add('wereld');if(f.bajes)add('bajes');if(f.ontsnapt)add('ontsnapt');if(f.jackpot)add('jackpot');
  if(!S.alive&&S.karma>=85)add('heilig');if((f.pets||0)>=3)add('dieren');if(S.gen>=3)add('dynastie')}
function lifeScore(){const a=S.died??ageY();const avgH=S.hist.n?S.hist.happy/S.hist.n:S.st.happy;const nw=Math.max(netWorth(),S.hist.peakNW*.5);
  const wealth=clamp(Math.log10(Math.max(1,nw))/7*100);const ageS=clamp(a/90*100);const kids=people('kind').length;const pt=S.rel.some(p=>p.st==='getrouwd'||p.wid)?25:0;
  const fam=clamp(pt+kids*15+living('vriend').length*5);const career=S.flags.top?100:S.hist.topJob?60:S.jobs.length||S.job?35:10;
  return Math.round(clamp(avgH*.3+wealth*.15+ageS*.15+fam*.15+career*.15+S.karma*.1))}
function story(){
  const p=S.p,a=S.died??ageY(),hij=p.g==='v'?'ze':p.g==='m'?'hij':'die',zijn=p.g==='v'?'haar':p.g==='m'?'zijn':'diens',Hij=hij[0].toUpperCase()+hij.slice(1);
  const out=[];const N=p.first;
  const wealth={arm:'een arm gezin',midden:'een gewoon gezin',rijk:'een welgesteld gezin'}[S.flags.wealth]||'een gezin';
  out.push(`${N} ${p.last} werd in ${p.by} geboren in ${p.city}, in ${wealth}. ${a<4?`${Hij} werd maar ${a} jaar oud.`:pick([`Als kind was ${hij} ${S.st.smarts>65?'slim en nieuwsgierig':S.sk.sport>40?'altijd buiten aan het sporten':'een dromer'}.`,`${Hij} groeide op ${living(['broer','zus']).length||people(['broer','zus']).length?'met '+people(['broer','zus']).map(s=>s.first).join(' en '):'als enig kind'}.`])}`);
  const deg=S.edu.deg.filter(d=>d.f).map(d=>`${ENAME[d.ty]} ${STUDIES.find(s=>s.id===d.f).t}`);const sch=S.edu.deg.find(d=>['vmbo','havo','vwo'].includes(d.ty));
  const inSch=S.alive&&(S.edu.stage==='middel'||S.edu.stage==='basis');if(a>=12&&(sch||!inSch)){const cl=S.ms.some(m=>/^Haalde het .*-diploma cum laude/.test(m.t));let t=sch?`${Hij} haalde ${zijn} ${sch.ty}-diploma${cl?' cum laude':''}`:`${Hij} maakte de middelbare school niet af`;t+=deg.length?` en studeerde later ${deg.join(', daarna ')}.`:'.';out.push(t)}
  const hist=S.jobs.concat(S.job?[{t:jobTitle(),co:S.job.co,y:S.job.yrs}]:[]).filter(j=>j.y>=1&&!j.mil);
  if(hist.length){const best=S.hist.topJob||hist[hist.length-1].t;const ts=[...new Set(hist.map(j=>j.t.toLowerCase()))];out.push(ts.length>2?`${Hij} had ${hist.length} banen en bracht het tot ${best.toLowerCase()}${S.flags.top?', de top van het vak':''}.`:`${Hij} werkte als ${ts.join(' en later als ')}${S.flags.top?' en bereikte daarmee de top':''}.`)}
  else if(a>=25&&!(S.pex&&S.pex.r>=1)&&!S.mil&&!S.pmil)out.push(`Een vaste baan zat er nooit echt in.`);
  if(typeof polStory==='function'){const t=polStory(Hij);if(t)out.push(t)}
  if(typeof milStory==='function'){const t=milStory(Hij);if(t)out.push(t)}
  if(typeof occStory==='function'){const t=occStory(Hij);if(t)out.push(t)}
  if(typeof dictStory==='function'){const t=dictStory(Hij);if(t)out.push(t)}
  if(S.flags.ondernemer){const bz=S.ms.filter(m=>/^Richtte .* op$/.test(m.t)).map(m=>m.t.slice(8,-3));if(bz.length)out.push(`Als ondernemer richtte ${hij} ${bz.length>1?bz.slice(0,-1).join(', ')+' en '+bz[bz.length-1]:bz[0]} op${S.flags.exit?' en verkocht ' + hij + ' met groot succes een bedrijf':''}.`)}
  const sp=S.rel.find(x=>x.st==='getrouwd'||x.wid);const kids=people('kind');
  if(sp)out.push(`${Hij} trouwde met ${sp.first}${kids.length?` en kreeg ${kids.length===1?'één kind':kids.length+' kinderen'}: ${kids.map(k=>k.first).join(', ')}`:''}.`);
  else if(kids.length)out.push(`${Hij} kreeg ${kids.length===1?'een kind':kids.length+' kinderen'}: ${kids.map(k=>k.first).join(', ')}.`);
  else if(a>30)out.push(pick([`De grote liefde vond ${hij} nooit, maar ${hij} had ${living('vriend').length?'trouwe vrienden':'een rijk leven'}.`,`${Hij} bleef ${zijn} hele leven vrijgezel.`]));
  const seen=new Set();const notable=S.ms.filter(m=>m.w>=2&&!/^(Studeerde|Richtte|Werd|Kreeg een relatie|Verkocht|Trouwde|Kreeg een (zoon|dochter)|Adopteerde|Haalde het .*-diploma|Verliet school zonder diploma|Stopte zonder diploma)/.test(m.t)&&!seen.has(m.t.split(' ')[0]+m.t.split(' ')[1])&&seen.add(m.t.split(' ')[0]+m.t.split(' ')[1])).slice(-4);
  const vs=t=>{const i=t.indexOf(' ');return i<0?t.toLowerCase()+' '+hij:t.slice(0,i).toLowerCase()+' '+hij+t.slice(i)};
  if(notable.length)out.push(notable.map((m,i)=>`${i===0?'Op':pick(['Op','Rond'])} ${m.a}-jarige leeftijd ${vs(m.t)}.`).join(' '));
  const nw=netWorth();
  out.push(`${S.alive?`${Hij} is nu ${a} jaar`:(S.cause==='opgegeven'?`${Hij} gaf het op, ${a} jaar oud`:`${Hij} overleed op ${a}-jarige leeftijd ${causeTxt(S.cause)}`)}${nw>1e6?`, met een vermogen van ${fmt(nw)}`:nw<0?`, met ${fmt(-nw)} schuld`:''}. ${S.karma>75?`Mensen herinneren zich ${N} als een goed mens.`:S.karma<25?`Niet iedereen rouwde om ${N}.`:''}`.trim());
  return out}

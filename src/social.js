/* ================= SOCIAL MEDIA: platforms, niche, minigames, drama ================= */
const SMP={
 pic:{n:'InstaPic',em:'📸',d:'Foto\'s en stories',sk:'looks',speed:1,pct:.07,ad:0,adMin:0,deal:1.2,mg:'foto'},
 tik:{n:'TikTak',em:'🎵',d:'Korte video\'s',sk:'kunst',speed:1.8,pct:.1,vol:1.7,ad:.02,adMin:10000,deal:1,mg:'clip'},
 tube:{n:'VidTube',em:'▶️',d:'Lange video\'s',sk:'smarts',speed:.6,pct:.06,ad:.6,adMin:1000,deal:1.4,mg:'edit',gear:1},
 tjilp:{n:'Tjilp',em:'🐦',d:'Korte berichten en meningen',sk:'smarts',speed:.8,pct:.05,ad:0,adMin:0,deal:.5,mg:'tekst',contro:1.6},
 live:{n:'Streamz',em:'🎙️',d:'Livestreamen',sk:'sociaal',speed:.7,pct:.06,ad:.35,adMin:500,deal:.9,mg:'stream'}};
// [icoon, naam, skill, passend per platform, waarde voor merken]
const NICHES={humor:['😂','Humor','kunst',{tik:1.4,tube:1.1,tjilp:1.2,pic:.9,live:1},.9],gaming:['🎮','Gaming','tech',{live:1.6,tube:1.3,tik:1,pic:.6,tjilp:.8},1.1],
 fitness:['💪','Fitness','sport',{pic:1.4,tik:1.2,tube:1.1,live:.7,tjilp:.6},1.3],beauty:['💄','Beauty en mode','looks',{pic:1.5,tik:1.3,tube:1.1,live:.6,tjilp:.5},1.4],
 koken:['🍳','Koken','koken',{tik:1.3,tube:1.3,pic:1.2,live:.8,tjilp:.6},1],muziek:['🎤','Muziek','muziek',{tik:1.5,tube:1.2,live:1.1,pic:.9,tjilp:.6},.9],
 tech:['💻','Tech','tech',{tube:1.5,tjilp:1.1,tik:.9,pic:.7,live:1},1.3],educatie:['📚','Uitleg en weetjes','smarts',{tube:1.5,tik:1.2,tjilp:1,pic:.8,live:.8},.9],
 reizen:['✈️','Reizen','sociaal',{pic:1.5,tube:1.2,tik:1.1,live:.6,tjilp:.6},1.2],lifestyle:['🤳','Lifestyle','sociaal',{pic:1.3,tik:1.2,tube:1,live:.9,tjilp:.8},1.2],
 meningen:['🗣️','Meningen en nieuws','sociaal',{tjilp:1.6,tube:1.1,tik:1,live:.9,pic:.6},.6]};
const SMGEAR=[['📱','Alleen je telefoon',0,'Prima om te beginnen'],['💡','Ringlamp en microfoon',300,'Je ziet en hoort er beter uit'],['📷','Camera en montagesoftware',2500,'Echt mooie video\'s'],['🎛️','Eigen studio',25000,'Zoals de grote namen']];
const nf=n=>Math.round(n).toLocaleString('nl-NL');
const skV=k=>k==='looks'?S.st.looks:k==='smarts'?S.st.smarts:(S.sk[k]||0);
function smInit(){if(S.sm)return S.sm;S.sm={acc:{},niche:null,gear:0,contro:0,peers:[],tot:0};
  if(S.foll>0){const e=S.flags.eng??50;const sp=[['pic',.5],['tik',.35],['tube',.15]];for(const [k,f] of sp)S.sm.acc[k]={f:Math.round(S.foll*f),eng:e,since:year()}}
  S.sm.tot=smSum();smOut();return S.sm}
const smSum=()=>Object.values(S.sm.acc).reduce((s,a)=>s+a.f,0);
// volgers die van buitenaf zijn veranderd (roem, events) verdelen over je accounts
function smIn(){const sm=smInit();const sum=smSum();if(Math.round(S.foll)===Math.round(sm.tot)&&Math.round(sum)===Math.round(sm.tot))return;let d=S.foll-sum;
  const ks=Object.keys(sm.acc);if(!ks.length){if(d<=0){S.foll=0;sm.tot=0;return}sm.acc.pic={f:0,eng:S.flags.eng??50,since:year()};ks.push('pic')}
  const tot=sum||1;for(const k of ks){const a=sm.acc[k];a.f=Math.max(0,Math.round(a.f+d*(sum?a.f/tot:1/ks.length)))}smOut()}
function smOut(){const sm=S.sm;S.foll=smSum();sm.tot=S.foll;const ks=Object.values(sm.acc);const w=ks.reduce((s,a)=>s+a.f,0);S.flags.eng=ks.length?Math.round(w?ks.reduce((s,a)=>s+a.eng*a.f,0)/w:ks.reduce((s,a)=>s+a.eng,0)/ks.length):50}
const smAcc=k=>S.sm&&S.sm.acc[k];
function smIncome(){if(!S.sm||inJail())return 0;let x=0;for(const [k,a] of Object.entries(S.sm.acc)){const P=SMP[k];if(P.ad&&a.f>=P.adMin)x+=a.f*P.ad*(a.eng/60)*(S.cpi||1)*(a.active===false?.3:1)}if(S.sm.merch)x+=S.sm.merch;if(S.sm.amb&&S.sm.amb.y>0)x+=S.sm.amb.amt;return Math.round(x)}
const fitOf=k=>S.sm.niche?NICHES[S.sm.niche][3][k]:.8;
const engLbl=e=>e>=75?'heel hoog':e>=55?'goed':e>=35?'matig':'laag';

/* ---------- het overzicht ---------- */
function sheetSocial(el){if(inJail()){empty(el,'Je telefoon is ingenomen. Social media kan pas weer als je vrij bent.');return}smIn();smOut();const sm=S.sm;const inc=smIncome();
  const N=sm.niche&&NICHES[sm.niche];
  card(el,`<h3>👥 Social media</h3>${kv([['Volgers in totaal',nf(S.foll)],['Betrokkenheid',`${S.flags.eng}% · ${engLbl(S.flags.eng)}`],['Je niche',N?`${N[0]} ${N[1]}`:'nog geen'],['Uitrusting',SMGEAR[sm.gear][0]+' '+SMGEAR[sm.gear][1]],...(inc?[['Inkomsten uit platforms',fmt(inc)+' per jaar']]:[]),...(sponsor()?[['Sponsordeals',fmt(sponsor())+' per jaar']]:[])])}${sm.contro>=3?`<div class="bizwarn soft"><b>🔥 Je staat bekend als controversieel</b><span>Je schokt niemand meer: controversiële posts leveren bijna niets meer op.</span></div>`:''}<span class="muted">Goede posts in je niche, op het juiste platform, laten je groeien. Spammen werkt niet: na een paar posts per jaar per platform raken je volgers moe.</span>`);
  const s=sec(el,'Je accounts');
  for(const [k,P] of Object.entries(SMP)){const a=sm.acc[k];
    if(a)row(s,{ic:P.em,t:P.n,s:`${nf(a.f)} volgers · betrokkenheid ${Math.round(a.eng)}%${S.acts['smp'+k]?` · ${S.acts['smp'+k]} posts dit jaar`:''}${a.ver?' · ✔️':''}`,on:()=>openSheet(P.n,el=>sheetPlat(el,k),true)});
    else row(s,{ic:P.em,t:`${P.n} · account aanmaken`,s:`${P.d} · ${N?(N[3][k]>=1.3?'past heel goed bij je niche':N[3][k]>=1?'past bij je niche':'past minder goed bij je niche'):'kies eerst een niche'}`,dots:true,on:()=>doAct('Nieuw account',()=>{sm.acc[k]={f:Math.min(Math.round(S.foll*.05),2000),eng:55,since:year()};smOut();return `Je maakt een ${P.n}-account aan.${S.foll>1000?' Een paar van je volgers van andere platforms volgen je meteen.':''}`},true,P.em)})}
  const m=sec(el,'Jij als maker');
  row(m,{ic:N?N[0]:'🎯',t:'Je niche',s:N?`${N[1]} · hangt af van je ${{kunst:'creativiteit',tech:'techkennis',sport:'sportiviteit',looks:'uiterlijk',koken:'kookkunst',muziek:'muzikaliteit',smarts:'slimheid',sociaal:'sociale vaardigheden'}[N[2]]}`:'Kies waar je account over gaat. Zonder niche groei je langzamer.',dots:true,on:nichePick});
  row(m,{ic:SMGEAR[sm.gear][0],t:'Uitrusting',s:sm.gear<3?`Volgende: ${SMGEAR[sm.gear+1][1]} · ${fmt(SMGEAR[sm.gear+1][2]*(S.cpi||1))}`:'Je hebt alles al',dis:sm.gear>=3,dots:true,on:gearPick});
  row(m,{ic:'🤝',t:'Andere influencers',s:'Samenwerken, bevriend raken of ruzie zoeken',on:()=>openSheet('Influencers',sheetPeers,true)});
  if(S.foll>=100000)row(m,{ic:'👕',t:sm.merch?'Je merch':'Eigen merch lanceren',s:sm.merch?`${fmt(sm.merch)} per jaar`:`${fmt(20000*(S.cpi||1))} · hoodies, petten en mokken met jouw naam`,dis:!!sm.merch||S.money<20000*(S.cpi||1),dots:true,on:()=>doAct('Merch',()=>{cash(-20000*(S.cpi||1));const amt=Math.round(S.foll*.04*(S.flags.eng/60)*(S.cpi||1));sm.merch=amt;MS('Lanceerde een eigen merchlijn',2);return `Je merch is binnen een uur uitverkocht. Verwachte opbrengst: ${fmt(amt)} per jaar.`},true,'👕')});
  if(sm.amb&&sm.amb.y>0)card(el,`<span class="muted">🤝 Je bent ambassadeur van ${he(sm.amb.br)}: ${fmt(sm.amb.amt)} per jaar, nog ${sm.amb.y} jaar.</span>`)}
function nichePick(){const sm=S.sm;modal({title:'Je niche',em:'🎯',cat:'Social media',text:sm.niche?'Van niche wisselen kost je een deel van je betrokkenheid. Je volgers kwamen voor iets anders.':'Waar gaat je account over? Je eigen vaardigheden tellen mee.',choices:opts(Object.entries(NICHES).map(([k,[ic,n,skk,fit]])=>{const best=Object.entries(fit).sort((a,b)=>b[1]-a[1])[0][0];return {t:`${ic} ${n}`,s:`jouw niveau ${Math.round(skV(skk))}% · het beste op ${SMP[best].n}`,cls:sm.niche===k?'go':'',dis:sm.niche===k,on:()=>{closeModal();doAct('Niche',()=>{const old=sm.niche;sm.niche=k;if(old)for(const a of Object.values(sm.acc))a.eng=Math.max(10,Math.round(a.eng*.7));smOut();return old?`Je gaat voortaan over ${n.toLowerCase()}. Een deel van je volgers haakt af.`:`Vanaf nu gaat je account over ${n.toLowerCase()}.`},true,ic)}}}))})}
function gearPick(){const sm=S.sm;const nx=SMGEAR[sm.gear+1];const k=Math.round(nx[2]*(S.cpi||1));ask(`${nx[1]} kopen?`,`${nx[3]}. Kost ${fmt(k)}. Je posts worden er beter van.`,'Kopen',()=>{if(S.money<k){toast('Niet genoeg geld');return}doAct('Uitrusting',()=>{cash(-k);sm.gear++;return `Je hebt nu: ${nx[1].toLowerCase()}.`},true,nx[0])},'go',nx[0])}

/* ---------- per platform ---------- */
function sheetPlat(el,k){const P=SMP[k],sm=S.sm,a=sm&&sm.acc[k];if(!a){empty(el,'Je hebt hier geen account.');return}const np=S.acts['smp'+k]||0;const inc=P.ad&&a.f>=P.adMin?Math.round(a.f*P.ad*(a.eng/60)*(S.cpi||1)):0;
  card(el,`<h3>${P.em} ${P.n}${a.ver?' ✔️':''}</h3><span class="muted">${P.d}${sm.niche?` · ${NICHES[sm.niche][1].toLowerCase()} past hier ${fitOf(k)>=1.3?'heel goed':fitOf(k)>=1?'goed':'niet zo goed'}`:''}</span>${kv([['Volgers',nf(a.f)],['Betrokkenheid',`${Math.round(a.eng)}% · ${engLbl(a.eng)}`],['Posts dit jaar',`${np}${np>=5?' · je volgers worden moe':''}`],...(P.ad?[['Advertentie-inkomsten',a.f>=P.adMin?fmt(inc)+' per jaar':`vanaf ${nf(P.adMin)} volgers`]]:[])])}${P.gear&&!sm.gear?`<span class="muted">Op ${P.n} verwachten mensen meer dan een filmpje met je telefoon. Betere uitrusting helpt hier extra.</span>`:''}`);
  const s=sec(el,'Posten');
  row(s,{ic:'🎮',t:k==='live'?'Live gaan':'Een post maken',s:'Minigame · hoe beter je speelt, hoe beter je post',dots:true,on:()=>postPick(k,true)});
  row(s,{ic:'⚡',t:'Snel iets posten',s:'Zonder minigame, maar vaak minder goed',dots:true,on:()=>postPick(k,false)});
  const x=sec(el,'Je volgers');
  row(x,{ic:'💬',t:'Reacties lezen',on:()=>doAct('Reacties',()=>{const m=use('rc'+k);const good=chance(clamp(a.eng/100+.15,.2,.85));if(good){hap(Math.round(2*m));a.eng=clamp(a.eng+Math.round(2*m));return pickF('rcg',['"Jij maakt mijn dag elke keer weer goed!"','"Eindelijk iemand die het snapt."','"Hoe ben je zo grappig??"','"Dit is waarom ik je volg."','"Je hebt me geïnspireerd om zelf te beginnen."'])}hap(-2);return pickF('rcb',['"Wie vroeg hierom?"','"Vroeger was je beter."','"Cringe."','"Ontvolgd."','"Je bent echt nep."'])+' Je klapt je telefoon dicht.'},true,'💬')});
  row(x,{ic:'🙋',t:'Vragenronde met je volgers',s:'Goed voor je betrokkenheid',dis:!!S.acts['qa'+k],on:()=>doAct('Vragenronde',()=>{S.acts['qa'+k]=1;a.eng=clamp(a.eng+ri(4,9));smOut();return pickF('qa',['Je beantwoordt vragen over je leven. Je volgers voelen zich gezien.','Iemand vraagt wat je ontbijt is. Het wordt een discussie van duizend reacties.','Je vertelt eerlijk dat het soms zwaar is. De steun stroomt binnen.'])},true,'🙋')});
  if(a.f>=10000){const dl=Math.round(a.f*.02*P.deal*(a.eng/60)*(sm.niche?NICHES[sm.niche][4]:1)*(S.cpi||1));
    row(x,{ic:'🤝',t:'Merkdeal',s:S.acts['deal'+k]?'Dit jaar al gedaan':`± ${fmt(dl)} voor een gesponsorde post`,dis:!!S.acts['deal'+k],dots:true,on:()=>{const br=pick(sm.niche==='fitness'?['een eiwitshake','een sportschoolketen','een sportmerk']:sm.niche==='beauty'?['een make-upmerk','een haarverzorgingslijn','een kledingmerk']:sm.niche==='gaming'?['een gamestoel','een energiedrank','een nieuwe game']:sm.niche==='tech'?['een telefoonmerk','een VPN','een koptelefoon']:['een energiedrank','een kledingmerk','een gokapp','een maaltijdbox','een tandpasta','een fietsenmerk']);const amt=Math.round(dl*(.8+R()*.4));
      modal({title:'Merkdeal',em:'🤝',cat:P.n,text:`${cap(br)} biedt ${fmt(amt)} voor een gesponsorde post op ${P.n}. Te veel reclame vinden je volgers niet leuk.`,choices:opts([{t:'Accepteren',cls:'go',on:()=>{closeModal();doAct('Merkdeal',()=>{S.acts['deal'+k]=1;cash(amt);a.eng=Math.max(10,a.eng-ri(2,7));if(br==='een gokapp')kar(-4);smOut();return `Je post voor ${br}. Je krijgt ${fmt(amt)}.`},true,'🤝')}}])})}})}
  const z=sec(el,'');row(z,{ic:'🗑️',t:'Account verwijderen',dots:true,on:()=>ask('Account verwijderen?',`Je ${nf(a.f)} volgers op ${P.n} ben je dan kwijt.`,'Verwijderen',()=>{delete sm.acc[k];smOut();L(`Je hebt je ${P.n}-account verwijderd.`);backSheet();render()})})}
function postPick(k,game){const P=SMP[k],sm=smInit(),N=sm.niche&&NICHES[sm.niche];
  const types=[['niche',N?N[0]:'🎯',N?`Iets over ${N[1].toLowerCase()}`:'Iets over je eigen leven',N?'Je niche: hier zijn je volgers voor':'Zonder niche weten mensen niet goed waarom ze je volgen'],['trend','📈','Meedoen met een trend','Veilig: minder kans op een flop, minder kans op een hit'],['anders','🎲','Iets heel anders','Een gok: kan verrassen, of je volgers snappen er niks van'],['contro','🔥','Een controversiële mening',sm.contro>=3?'Niemand schrikt er nog van':sm.contro>=1?'Levert steeds minder op':'Veel aandacht, maar je kunt gecanceld worden']];
  modal({title:k==='live'?'Live gaan':'Wat post je?',em:P.em,cat:P.n,choices:opts(types.map(([t,ic,n,d])=>({t:`${ic} ${n}`,s:d,on:()=>{closeModal();if(!game)return doPost(k,t,R()*.45+.2);smMg(k,f=>doPost(k,t,f))}})))})}
function smMg(k,cb){const n=smInit().niche;const P=SMP[k];
  ({foto:()=>mgReact({title:'De perfecte foto',desc:'Druk af op het perfecte moment.',em:'📸',idle:n==='koken'?'🍽️':n==='reizen'?'🌥️':'🙂',go:n==='koken'?'🍝':n==='reizen'?'🌅':'😁',fake:'😵',goTxt:'Nu!',btn:'Klik!'},(h,t)=>cb(h/t)),
    clip:()=>mgRhythm({title:'Op de beat monteren',desc:'Knip je filmpje precies op de beat.',em:'🎵',notes:['✂️','🎵'],btn:'Knip!'},cb),
    edit:()=>mgCode({title:'Monteren',desc:'Onthoud de volgorde van je scènes en zet ze goed.',em:'🎬',len:S.sm.gear>=2?4:5,sym:['🎬','🎤','🎥','💡','🎞️','📝','🎧','⭐']},(h,t)=>cb(h/t)),
    tekst:()=>mgAim({title:'Raak de snaar',desc:'Mik je bericht precies op waar iedereen het over heeft.',em:'🐦',n:3,btn:'Posten!',c1:'#e8f4fd',c2:'#1d9bf0'},(p,m)=>cb(p/m)),
    stream:()=>mgDodge({title:'Live!',desc:'Ontwijk de trollen in je chat en hou de stream gezellig.',em:'🎙️',me:'🎙️',obs:['🤬','👹','💩','🤡'],secs:12},(l,t)=>cb(l/t))})[P.mg]()}
function doPost(k,type,sc){if(!S||!S.alive)return;const P=SMP[k],sm=smInit(),a=sm.acc[k];if(!a)return;
  doAct(P.n,()=>{smIn();const np=(S.acts['smp'+k]||0)+1;S.acts['smp'+k]=np;const m=np<=5?1:np<=8?.5:.15;S.flags.postY=year();a.active=true;
    const N=sm.niche&&NICHES[sm.niche];const fit=type==='niche'?fitOf(k)*(N?1:.85):type==='trend'?1:type==='anders'?.6+R()*.9:fitOf(k);
    const skill=(skV(P.sk)+(N?skV(N[2]):skV(P.sk)))/2;
    let q=clamp(Math.round(skill*.35+sc*45+sm.gear*(P.gear?7:4)+ri(0,12)+(type==='trend'?6:0)-(P.gear&&!sm.gear?8:0)-(np>8?10:0)));if(type==='trend')q=clamp(q,35,80);
    const em=.5+a.eng/100;let gain,msg='';
    if(q<40)gain=-Math.round(a.f*.012*(40-q)/20+ri(0,6));
    else gain=Math.round((ri(15,90)*P.speed*fit*(q/50)**2+a.f*P.pct*(q-45)/100*fit)*em*m);
    if(type==='contro'){const eff=1/(1+sm.contro*.6);sm.contro++;
      if(chance(.25)){gain=-Math.round(a.f*ri(6,14)/100+ri(0,20));a.eng=Math.max(5,a.eng-12);hap(-5);msg='Je wordt gecanceld. Mensen zijn woedend.'}
      else{gain=Math.round(Math.max(gain,ri(30,150)*P.speed)*2.5*eff*(P.contro||1)*m);a.eng=clamp(a.eng+Math.round(4*eff));msg=eff>.6?'Je mening zorgt voor ophef. Iedereen praat erover.':eff>.35?'Weer een rel. Mensen beginnen het een beetje te kennen van je.':'Niemand schrikt er nog van. Je bent "die van de meningen".'}}
    const vir=chance((.004+Math.max(0,q-65)/900)*(P.vol||1)*m*[.6,1,1.6][S.settings.chaos]);
    if(vir){gain+=Math.round(a.f*.3+ri(2000,40000)*P.speed);S.fame=Math.round(clamp(S.fame+3));a.eng=clamp(a.eng+10);if(!S.flags.viraal){S.flags.viraal=1;MS(`Ging viraal op ${P.n}`,2)}}
    if(gain>0&&typeof follMax==='function'){const sat=Math.max(.02,1-S.foll/follMax());gain=Math.round(gain*Math.pow(sat,1.5))}
    a.eng=Math.round(clamp(a.eng+(q-55)/7));a.f=Math.max(0,Math.round(a.f+gain));smOut();hap(vir?6:gain>0?1:gain<0?-2:0);if(type!=='trend')sk(N?N[2]:P.sk,1);
    const g=nf(Math.abs(gain)),qt=q>=80?'Een topper.':q>=65?'Een goede post.':q>=50?'Een prima post.':q>=40?'Een matige post.':'Een flop.';
    const tired=m<.5?' Je volgers worden een beetje moe van al je posts.':m<1?' Je post vaak, het effect wordt minder.':'';
    if(vir)return `Viraal! ${g} nieuwe volgers op ${P.n}.`;
    if(msg)return `${msg} ${gain>=0?'+':'-'}${g} volgers.${tired}`;
    return `${qt} ${gain>=0?'+':'-'}${g} volgers.${type==='anders'&&fit<.9?' Je volgers snappen niet goed wat dit was.':''}${tired}`},true,P.em)}

/* ---------- andere influencers ---------- */
function peerGen(){const sm=S.sm;const my=Math.max(500,S.foll);const ks=Object.keys(NICHES),ps=Object.keys(SMP);const g=pick(['m','v']);
  const p=mkPerson('influencer',g,S.m-ri(Math.max(15,ageY()-8),Math.max(18,ageY()+10))*12,{rel:ri(35,60)});p.niche=sm.niche&&chance(.6)?sm.niche:pick(ks);p.plat=pick(ps);
  p.f=Math.round(Math.exp(Math.log(Math.max(800,my*.3))+R()*(Math.log(my*5+50000)-Math.log(Math.max(800,my*.3)))));p.handle='@'+(p.first+pick(['','_','.'])+pick(['official','tv','x','life','',ri(1,99)])).toLowerCase();return p}
function smPeers(){const sm=smInit();sm.peers=(sm.peers||[]).filter(p=>p.role==='influencer');while(sm.peers.length<5)sm.peers.push(peerGen());return sm.peers}
function sheetPeers(el){const ps=smPeers();const s=sec(el,'Influencers die je kent');
  for(const p of [...ps].sort((a,b)=>b.f-a.f))row(s,{ic:faceOf(p),t:`${p.first} ${p.handle}`,s:`${SMP[p.plat].em} ${nf(p.f)} volgers · ${NICHES[p.niche][1].toLowerCase()}${p.niche===S.sm.niche?' · zelfde niche':''} · band ${Math.round(p.rel)}%`,on:()=>openSheet(p.first,el=>sheetPeer(el,p),true)});
  card(el,`<span class="muted">Een samenwerking met iemand die groter is dan jij levert de meeste volgers op, maar grote namen zeggen vaker nee. Elk jaar leer je nieuwe mensen kennen.</span>`)}
function sheetPeer(el,p){const sm=S.sm;if(!sm.peers.includes(p)){empty(el,`${p.first} ken je niet meer.`);return}const P=SMP[p.plat];const mine=smAcc(p.plat);
  card(el,`<h3>${faceOf(p)} ${he(p.first+' '+p.last)}</h3><span class="muted">${he(p.handle)} · ${pAge(p)} jaar · ${NICHES[p.niche][0]} ${NICHES[p.niche][1]}</span>${kv([['Platform',`${P.em} ${P.n}`],['Volgers',nf(p.f)]])}<div class="stat"><span>Band met jou</span><span></span><span class="v">${Math.round(p.rel)}%</span>${bar(p.rel)}</div>`);
  const s=sec(el,'');
  row(s,{ic:'🤝',t:'Samenwerking voorstellen',s:!mine?`Je hebt geen ${P.n}-account`:S.acts['col'+p.id]?'Dit jaar al gevraagd':`Samen iets maken op ${P.n} · minigame`,dis:!mine||!!S.acts['col'+p.id],dots:true,on:()=>{S.acts['col'+p.id]=1;const ok=chance(clamp(.2+(mine.f/Math.max(1,p.f))*.5+p.rel/200+(p.niche===sm.niche?.1:0),.05,.95));
    if(!ok){p.rel=clamp(p.rel-3);toast(`${p.first} laat je op gelezen staan.`);refreshSheet();return}
    smMg(p.plat,f=>doAct('Samenwerking',()=>{const q=f*60+skV(SMP[p.plat].sk)*.3+sm.gear*4;const g=Math.round(p.f*.03*(q/60)*(p.niche===sm.niche?1.3:.8)*(.5+mine.eng/100));mine.f+=g;p.f+=Math.round(mine.f*.02);p.rel=clamp(p.rel+(q>=55?10:2));mine.eng=clamp(mine.eng+3);smOut();if(p.f>S.foll*3&&!S.flags.collabBig){S.flags.collabBig=1;MS(`Maakte een video met influencer ${p.first}`,1)}
      return q>=55?`${p.first} zegt ja! Jullie video slaat aan. +${nf(g)} volgers.`:`${p.first} zegt ja, maar jullie video wordt niet zo goed. Toch +${nf(g)} volgers.`},true,'🤝'))}});
  row(s,{ic:'💬',t:'Berichtje sturen',on:()=>doAct('Bericht',()=>{const m=use('pm'+p.id);p.rel=clamp(p.rel+Math.round(ri(2,7)*m));return pickF('pm',[`${p.first} stuurt een hartje terug.`,`Jullie appen tot diep in de nacht over het algoritme.`,`${p.first} geeft je een tip over ${SMP[p.plat].n}.`])},true,'💬')});
  if(p.rel>=70)row(s,{ic:'🫂',t:'Vrienden worden',s:'Ook buiten social media',dots:true,on:()=>doAct('Vriendschap',()=>{sm.peers=sm.peers.filter(x=>x!==p);p.role='vriend';p.infl=1;S.rel.push(p);return `${p.first} en jij spreken af. Het klikt ook in het echt. Je vindt ${p.g==='v'?'haar':'hem'} nu bij je relaties.`},true,'🫂')});
  row(s,{ic:'🥊',t:'Ruzie zoeken',s:'Drama levert kijkers op, maar het kan je duur komen te staan',dots:true,on:()=>ask('Beef beginnen?',`Je gaat publiek de strijd aan met ${p.first}.`,'Doen',()=>doAct('Beef',()=>{const acc=mine||Object.values(sm.acc).sort((x,y)=>y.f-x.f)[0];if(!acc)return 'Je hebt geen account om op te reageren.';p.rel=clamp(p.rel-35);const win=chance(clamp(.35+(S.sk.sociaal-50)/200+(acc.f/Math.max(1,p.f))*.15,.1,.8));
      if(win){const g=Math.round(Math.max(200,p.f*.04));acc.f+=g;p.f=Math.round(p.f*.95);smOut();return `Jouw reactievideo is een hit. Het internet kiest jouw kant. +${nf(g)} volgers.`}const l=Math.round(acc.f*.05);acc.f=Math.max(0,acc.f-l);acc.eng=Math.max(5,acc.eng-8);smOut();hap(-4);return `${p.first} maakt gehakt van je. Iedereen deelt het. -${nf(l)} volgers.`},true,'🥊'),'bad','🥊')})}

/* ---------- jaarlijks ---------- */
function smYear(){if(!S.sm)return;smIn();const sm=S.sm,la=S.lastActs||{};
  for(const [k,a] of Object.entries(sm.acc)){const posted=la['smp'+k]||0;a.active=posted>0;
    if(!posted){a.f=Math.round(a.f*(.88+R()*.06));a.eng=Math.max(10,a.eng-6)}else a.f=Math.round(a.f*(.97+R()*.03));
    if(a.f>=100000&&!a.ver){a.ver=1;L(`Je krijgt een blauw vinkje op ${SMP[k].n}. Officieel een bekend gezicht.`,'good');MS(`Kreeg een blauw vinkje op ${SMP[k].n}`,1)}}
  if(sm.contro>0)sm.contro=Math.max(0,sm.contro-1);
  if(sm.merch)sm.merch=Math.round(sm.merch*(S.flags.postY!=null&&year()-S.flags.postY<=1?.95:.7));
  if(sm.amb&&sm.amb.y>0){sm.amb.y--;if(!sm.amb.y)L(`Je ambassadeurschap bij ${sm.amb.br} loopt af.`)}
  for(const p of sm.peers||[])p.f=Math.round(p.f*(.95+R()*.2));if(sm.peers&&sm.peers.length>=5&&chance(.6))sm.peers.splice(ri(0,sm.peers.length-1),1);
  smOut()}

/* ---------- events ---------- */
const smOk=(n=0)=>()=>S.sm&&ageY()>=13&&!inJail()&&S.foll>=n&&Object.keys(S.sm.acc).length>0;
const smBig=()=>{const e=Object.entries(S.sm.acc).sort((a,b)=>b[1].f-a[1].f)[0];return e?{k:e[0],a:e[1]}:null};
const peerCtx=f=>()=>{const ps=smPeers().filter(f||(()=>1));return ps.length?{id:pick(ps).id}:null};
const PR=c=>(S.sm.peers||[]).find(p=>p.id===c.id);
E('sm_haters',{c:smOk(5000),cd:3,t:'Haatreacties',x:()=>`Onder je laatste post staan ineens honderden boze reacties. ${pick(['Iemand heeft je post op een haatforum gedeeld.','Het begon met één reactie over je stem.','Mensen vinden dat je "veranderd" bent.'])}`,ch:[
 ['😂 Reageren met humor',()=>{const b=smBig();if(chance(.4+S.sk.sociaal/250)){b.a.f+=Math.round(b.a.f*.03);b.a.eng=clamp(b.a.eng+5);smOut();return 'Je reactie is zo droog dat de haters zelf gaan lachen. Je wint er volgers mee.'}hap(-4);return 'Het werkt averechts. Nu hebben ze nog meer munitie.'}],
 ['🙈 Negeren',()=>{hap(-2);return 'Je leest het niet. Na een week is het weg.'}],
 ['🔒 Account op privé',()=>{const b=smBig();b.a.eng=Math.max(5,b.a.eng-8);hap(2);smOut();return 'Rust in je hoofd. Wel minder bereik.'}]]});
E('sm_dm',{c:smOk(2000),cd:3,t:'Een DM',x:()=>pick(['Een fan stuurt je een lang bericht: jouw video\'s hielpen tijdens een zware tijd.','Een fan vraagt of je een keer wilt afspreken.','Iemand stuurt je elke dag een bericht. Al drie maanden.']),ch:[
 ['💌 Lief terugschrijven',()=>{const b=smBig();b.a.eng=clamp(b.a.eng+3);hap(3);kar(1);smOut();return 'Je fan maakt een screenshot en deelt het. Iedereen vindt je lief.'}],
 ['🙅 Niet op reageren',()=>'Je laat het liggen.'],
 ['⛔ Blokkeren',()=>'Geblokkeerd. Rust.']]});
E('sm_collab',{c:smOk(1000),cd:2,t:'Samenwerken?',ctx:peerCtx(p=>p.f<=Math.max(5000,S.foll*1.5)),x:c=>`${PR(c).first} (${nf(PR(c).f)} volgers op ${SMP[PR(c).plat].n}) vraagt of je samen een video wilt maken.`,ch:[
 ['🤝 Ja, leuk',c=>{const p=PR(c);const acc=smAcc(p.plat)||smBig().a;const g=Math.round(p.f*.02*(.5+acc.eng/100))+ri(20,200);acc.f+=g;p.rel=clamp(p.rel+12);p.f+=Math.round(acc.f*.02);smOut();return `Jullie video doet het goed. +${nf(g)} volgers, en ${p.first} vond het ook leuk.`}],
 ['❌ Nee, bedankt',c=>{const p=PR(c);p.rel=clamp(p.rel-6);return `${p.first} begrijpt het, maar het voelt een beetje ongemakkelijk.`}]]});
E('sm_beef',{c:smOk(10000),cd:4,t:'Een beef',ctx:peerCtx(),x:c=>`${PR(c).first} maakt een video over jou. Titel: "${pick(['Waarom niemand meer naar','De waarheid over','Ik moet het even hebben over'])} ${S.p.first}". Hij gaat rond.`,ch:[
 ['🥊 Terugslaan',c=>{const p=PR(c);const b=smBig();p.rel=clamp(p.rel-30);if(chance(.5+(S.sk.sociaal-50)/200)){const g=Math.round(b.a.f*.06+p.f*.02);b.a.f+=g;smOut();return `Je antwoord is genadeloos en grappig. Het internet kiest jouw kant. +${nf(g)} volgers.`}const l=Math.round(b.a.f*.06);b.a.f-=l;hap(-5);smOut();return `Het maakt alles erger. -${nf(l)} volgers.`}],
 ['🙈 Negeren',c=>{const b=smBig();b.a.f=Math.round(b.a.f*.98);smOut();return 'Je zegt niets. Het waait over, al kost het je een paar volgers.'}],
 ['☎️ Bellen en uitpraten',c=>{const p=PR(c);if(chance(.5)){p.rel=clamp(p.rel+20);return `Jullie praten het uit. Achteraf maken jullie er samen een grap over.`}return `${p.first} neemt niet op.`}]]});
E('sm_hack',{c:smOk(20000),cd:6,w:.5,t:'Gehackt!',x:()=>{const b=smBig();return `Je ${SMP[b.k].n}-account is gehackt. De hacker post nepreclame voor crypto en wil ${fmt(Math.round(2000*(S.cpi||1)))} om het terug te geven.`},ch:[
 ['💸 Betalen',()=>{cash(-Math.round(2000*(S.cpi||1)));if(chance(.6))return 'Je krijgt je account terug. Nu maar snel een ander wachtwoord.';const b=smBig();b.a.f=Math.round(b.a.f*.7);smOut();return 'De hacker neemt het geld en verkoopt je account toch door. Na weken krijg je het terug, met een stuk minder volgers.'}],
 ['📧 De helpdesk mailen',()=>{const b=smBig();if(chance(.55)){b.a.eng=Math.max(5,b.a.eng-5);smOut();return 'Na twee weken heb je je account terug.'}b.a.f=Math.round(b.a.f*.75);b.a.eng=Math.max(5,b.a.eng-10);smOut();return 'Het duurt maanden. Veel volgers zijn afgehaakt.'}]]});
E('sm_algo',{c:smOk(3000),cd:4,t:'Het algoritme',ctx:()=>{const ks=Object.keys(S.sm.acc);return ks.length?{k:pick(ks)}:null},x:c=>`${SMP[c.k].n} heeft het algoritme veranderd. Je bereik is gehalveerd en niemand weet waarom.`,ch:[
 ['💪 Doorzetten',c=>{const a=smAcc(c.k);a.eng=Math.max(5,a.eng-8);smOut();return 'Je blijft posten en wacht tot het beter wordt.'}],
 ['🔀 Volgers naar een ander platform halen',c=>{const a=smAcc(c.k);const others=Object.keys(SMP).filter(x=>x!==c.k);const t=pick(others.filter(x=>S.sm.acc[x]).concat(others).slice(0,3));if(!S.sm.acc[t])S.sm.acc[t]={f:0,eng:50,since:year()};const mv=Math.round(a.f*.12);S.sm.acc[t].f+=mv;a.f-=Math.round(mv*.6);smOut();return `Je roept je volgers op je ook op ${SMP[t].n} te volgen. ${nf(mv)} doen het.`}]]});
E('sm_oudpost',{c:()=>smOk(20000)()||S.sm&&S.sm.contro>0&&smOk(1000)(),cd:6,w:.5,t:'Een oude post',x:()=>`Iemand heeft een oude post van je opgegraven. ${S.sm.contro?'Je mening van toen valt nu nog slechter.':'Je was jong en dat merk je.'} Het gaat rond.`,ch:[
 ['🙏 Excuses aanbieden',()=>{const b=smBig();b.a.f=Math.round(b.a.f*.97);smOut();return 'Je biedt oprecht excuses aan. De meeste mensen accepteren het.'}],
 ['🤷 Negeren',()=>{const b=smBig();if(chance(.5))return 'Het waait over.';b.a.f=Math.round(b.a.f*.88);b.a.eng=Math.max(5,b.a.eng-10);smOut();hap(-4);return 'Het wordt groter en groter. Sponsors bellen bezorgd.'}],
 ['😂 Erom lachen',()=>{const b=smBig();if(chance(.5)){b.a.eng=clamp(b.a.eng+4);smOut();return 'Je reageert met zelfspot. Mensen waarderen het.'}b.a.f=Math.round(b.a.f*.93);smOut();return 'Niet iedereen kan erom lachen.'}]]});
E('sm_trend',{c:smOk(0),cd:2,t:'Een nieuwe trend',ctx:()=>{const ks=Object.keys(S.sm.acc);const k=ks.includes('tik')?'tik':pick(ks);return k?{k}:null},x:c=>`Op ${SMP[c.k].n} doet iedereen mee aan ${pick(['een nieuwe dans','een challenge met een emmer ijswater','een trend waarbij je je kindfoto laat zien','een geluidje dat overal te horen is'])}.`,ch:[
 ['🎮 Meedoen',c=>({go:()=>smMg(c.k,f=>{const a=smAcc(c.k);const g=Math.round((ri(50,300)*SMP[c.k].speed+a.f*.03)*(f+.3)*(.5+a.eng/100));a.f+=g;S.flags.postY=year();smOut();result('Een nieuwe trend',f>=.6?`Je versie is een van de beste. +${nf(g)} volgers.`:`Je doet mee. Niet de beste versie, maar +${nf(g)} volgers.`,[],processQ,{cat:'Social media',em:'📈'})})})],
 ['🙄 Overslaan',()=>'Je doet niet aan elke trend mee.']]});
E('sm_burnout',{c:()=>S.sm&&Object.keys(S.lastActs||{}).filter(x=>x.startsWith('smp')).reduce((s,x)=>s+S.lastActs[x],0)>=15,cd:3,t:'Op',x:'Je post al maanden elke dag. Je slaapt slecht en checkt je statistieken om 3 uur \'s nachts.',ch:[
 ['🌴 Een maand offline',()=>{hap(8);hea(3);for(const a of Object.values(S.sm.acc))a.eng=Math.max(10,a.eng-6);smOut();return 'Je legt je telefoon weg. Je voelt je een ander mens.'}],
 ['📱 Doorgaan',()=>{hap(-8);hea(-3);return 'Je gaat door. Het gaat ten koste van jezelf.'}]]});
E('sm_amb',{c:()=>smOk(50000)()&&!(S.sm.amb&&S.sm.amb.y>0),cd:4,t:'Ambassadeur worden',x:c=>{c.br=pick(['een sportmerk','een telecombedrijf','een autofabrikant','een kledingketen','een energiedrankje','een bank']);c.amt=Math.round(S.foll*.05*(S.flags.eng/60)*(S.cpi||1)*(S.sm.niche?NICHES[S.sm.niche][4]:1));return `${cap(c.br)} wil je drie jaar als ambassadeur: ${fmt(c.amt)} per jaar. Je mag dan niets voor de concurrent doen.`},ch:[
 ['✍️ Tekenen',c=>{S.sm.amb={br:c.br,amt:c.amt,y:3};MS(`Werd ambassadeur van ${c.br}`,1);return `Je bent het nieuwe gezicht van ${c.br}.`}],
 ['❌ Bedanken',()=>'Je wilt vrij blijven.']]});
Object.assign(EVMETA,{sm_haters:['Social media','😡'],sm_dm:['Social media','📩'],sm_collab:['Social media','🤝'],sm_beef:['Social media','🥊'],sm_hack:['Social media','🔓'],sm_algo:['Social media','📉'],sm_oudpost:['Social media','🗂️'],sm_trend:['Social media','📈'],sm_burnout:['Social media','😮‍💨'],sm_amb:['Social media','🤝']});

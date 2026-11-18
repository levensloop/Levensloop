/* ================= FASE 14: roem en social media =================
   Keuze Thijmen: echte namen waar het kan (prijzen, hitlijsten, modeweken); films, albums, boeken en programma's zijn verzonnen.
   14.1 carrière in projecten: acteur (audities, rollen, recensies), muzikant (nummers, album, hitlijst, tour), model (castings, shows, covers),
        schrijver (een boek, de bestsellerlijst) en presentator (nieuw beroep: een eigen programma, kijkcijfers)
   14.2 een manager; 14.3 een succes geeft promotie; 14.4 een eigen merk voor influencers en gecanceld worden; 14.5 prijzen als groot moment */

// ---------- nieuw beroep: presentator ----------
{const j={id:'presentator',lad:['Radiopresentator','Tv-presentator','Bekende tv-presentator','Showmaster'],sal:[30,70,220,900],req:{age:[18,99],sk:['sociaal',40]},sk:'sociaal',fame:1};
  if(!JOB('presentator')){JOBS.splice(JOBS.findIndex(x=>x.id==='politiek'),0,j);j.sec='media';j.via=[];JOBEM.presentator='🎙️';JGROUP.fame.push('presentator');FAMEJ.presentator=[6,30,65,90]}}
// ---------- prijzen en lijsten per land ----------
const AWARD={film:{NL:'Gouden Kalf',BE:'Ensor',UK:'BAFTA',FR:'César',ES:'Goya',IT:'David di Donatello',DE:'Deutscher Filmpreis',_:'Oscar'},
  serie:{NL:'Gouden Kalf voor beste serie',UK:'BAFTA TV Award',_:'Emmy'},muziek:{NL:'Edison',UK:'Brit Award',DE:'Echo',_:'Grammy'},
  boek:{NL:'Libris Literatuur Prijs',BE:'Boon-literatuurprijs',UK:'Booker Prize',US:'Pulitzer Prize',FR:'Prix Goncourt',ES:'Premio Planeta',_:'internationale literatuurprijs'},
  tv:{NL:'Gouden Televizier-Ring',BE:'Ultima',UK:'BAFTA TV Award',_:'Emmy'},mode:{_:'Model of the Year van de British Fashion Awards'}};
const awardN=k=>{const t=AWARD[k];const intl=S.fame>=80&&['film','muziek','serie','tv'].includes(k);return intl?{film:'Oscar',muziek:'Grammy',serie:'Emmy',tv:'Emmy'}[k]:(t[S.p.country]||t._)};
const CHART={NL:'de Top 40',BE:'de Ultratop',UK:'de UK Singles Chart',US:'de Billboard Hot 100',DE:'de Offizielle Deutsche Charts',FR:'de Top Singles',_:'de hitlijst'};
const BSL={NL:'de Bestseller 60',BE:'de Boekenbon Top 10',UK:'de Sunday Times-bestsellerlijst',US:'de New York Times-bestsellerlijst',_:'de bestsellerlijst'};
const ccL=t=>t[S.p.country]||t._;
const TITLEW=['Het','De','Een','Nacht','Zomer','Stilte','Vuur','Rood','Blauw','Licht','Storm','Huis','Weg','Laatste','Verloren','Wilde','Gouden','Stad','Zee','Hart','Schaduw','Spiegel'];
const mkTitle=()=>{const a=pick(['Het','De']),b=pick(['Laatste','Verloren','Wilde','Gouden','Stille','Rode','Blauwe','Lange','Zachte']),c=pick(['Zomer','Nacht','Stad','Zee','Storm','Weg','Spiegel','Hart','Schaduw','Brug','Rivier','Jas']);return `${a} ${b.toLowerCase()} ${c.toLowerCase()}`.replace(/^(\w)/,m=>m.toUpperCase())};
const P14=()=>S.p14||(S.p14={act:[],songs:[],alb:0,tour:0,book:null,show:null,hist:[]});
const fameJob=()=>S.job&&JOB(S.job.id)&&JOB(S.job.id).fame?S.job.id:null;
const mgrB=()=>S.p14&&S.p14.mgr?.15:0;
function star(q){const n=clamp(Math.round(q/20),1,5);return '⭐'.repeat(n)}
function hist14(t){const X=P14();X.hist.push([year(),t]);if(X.hist.length>12)X.hist.shift()}
// een succes: geld, roem en soms promotie; groot succes: kans op een prijs (groot moment)
function hit(q,kind,title,fee){const X=P14();const cp=S.cpi||1;cash(Math.round(fee));S.fame=Math.round(clamp((S.fame||0)+(q>=80?4:q>=60?2:q>=40?0:-1)));perfAdd(q>=60?6:q<40?-5:0);
  if(q>=75&&S.job&&S.job.lvl<JOB(S.job.id).lad.length-1&&chance(.45)){promote();L(`🌟 Door het succes van ${title} ben je nu ${jobTitle().toLowerCase()}!`,'good')}
  if(q>=88&&typeof fmFree==='function'&&fmFree()&&!inJail()){fmTake();Q.push({id:'f14_prijs',c:{k:kind,t:title}})}}
E('f14_prijs',{sys:1,need:()=>!inJail(),t:'Genomineerd!',x:c=>`${c.t} is genomineerd voor een ${awardN(c.k)}. De uitreiking is vanavond. Je zit in de zaal en je hart bonkt.`,ch:[
 ['📝 Een speech voorbereiden',c=>{if(chance(.35+(S.sk.sociaal||0)/300)){S.fame=clamp(S.fame+6);hap(10);MS(`Won een ${awardN(c.k)} voor ${c.t}`,3);S.flags.prijs14=(S.flags.prijs14||0)+1;return `"And the winner is..." Jij! Je speech is kort, ontroerend en gaat viraal.`}hap(-2);return 'Een ander wint. Je klapt beleefd en stopt je speech diep in je zak.'}],
 ['😎 Gewoon genieten',c=>{if(chance(.3)){S.fame=clamp(S.fame+6);hap(12);MS(`Won een ${awardN(c.k)} voor ${c.t}`,3);S.flags.prijs14=(S.flags.prijs14||0)+1;return 'Je wint! Je hebt niks voorbereid en bedankt je moeder, je kat en de catering.'}hap(1);return 'Je wint niet, maar het feest na afloop is legendarisch.'}]]});
EVMETA.f14_prijs=['Roem','🏆'];

// ---------- 14.1 acteur ----------
const ROLE={reclame:['📺','Een reclame',.08,30],serie:['🎞️','Een tv-serie',.35,45],film:['🎬','Een film',.6,60],theater:['🎭','Theater',.15,35]};
function audition(ty){const [e,n,f,min]=ROLE[ty];const X=P14();doAct('Auditie',()=>{S.acts['aud'+ty]=1;const p=clamp(.25+(S.st.looks-50)/200+(S.sk.kunst||0)/250+(S.fame||0)/300+mgrB()-(min-30)/200+(S.job?S.job.lvl*.08:0),.05,.9);
  if(!chance(p)){hap(-2);return pick(['"Dank je wel, we bellen je." Ze bellen niet.','Je bent te lang, zeggen ze. Of te kort. In elk geval niet goed.','Je hebt de rol bijna, maar een bekende naam gaat met de eer strijken.'])}
  const t=mkTitle();X.act.push({ty,t,y:year()});hap(5);hist14(`Kreeg een rol in ${ty==='reclame'?'een reclame':`"${t}"`}`);return `Je hebt de rol! ${ty==='reclame'?'Een reclame voor een groot merk.':`"${t}" komt volgend jaar uit.`}`},true,e)}
function releaseAct(){const X=P14();for(const a of X.act.filter(a=>a.y<year())){const [e,n,f]=ROLE[a.ty];const q=clamp(Math.round((S.sk.kunst||30)*.5+(S.job?S.job.perf:50)*.3+R()*40+(S.fame||0)*.1));const fee=salary()*f*(1+mgrB());
    if(a.ty==='reclame')L(`📺 Je reclame is overal te zien. Je verdient ${fmt(fee)}.`,'good');else{L(`${e} "${a.t}" komt uit. Recensies: ${star(q)}${q>=80?' · een enorm succes!':q<35?' · een flop.':''} Je verdient ${fmt(fee)}.`,q>=60?'good':q<35?'bad':'sys');hist14(`"${a.t}": ${star(q)}`)}
    hit(a.ty==='reclame'?50:q,a.ty==='serie'?'serie':'film',`"${a.t}"`,fee)}
  X.act=X.act.filter(a=>a.y>=year())}
// ---------- muzikant ----------
function writeSong(){const X=P14();doAct('Een nummer schrijven',()=>{const m=use('song');if(m<.3)return 'Je inspiratie is op voor dit jaar.';const q=clamp(Math.round((S.sk.muziek||30)*.6+R()*45));X.songs.push(q);sk('muziek',2);hap(2);
  return q>=75?'Je schrijft een nummer dat meteen blijft hangen. Dit wordt een hit, zeg je tegen jezelf.':q<35?'Het nummer klinkt als iets wat je al eens gehoord hebt. Weg ermee? Nee, het mag op het album.':'Een mooi nummer. Je zet het bij de rest.'},true,'🎼')}
function album(){const X=P14();if(X.songs.length<8){toast('Je hebt minstens 8 nummers nodig');return}
  doAct('Album',()=>{const songs=X.songs.splice(0,X.songs.length);const best=Math.max(...songs),avg=songs.reduce((a,b)=>a+b,0)/songs.length;const q=clamp(Math.round(avg*.6+best*.3+(S.fame||0)*.15+R()*10));const t=mkTitle();X.alb++;X.lastAlb=year();
    const pos=clamp(Math.round(101-q-((S.fame||0)*.4)-mgrB()*40+ri(-8,8)),1,100);const fee=salary()*.4*(1+mgrB())*(q/60);
    hist14(`Album "${t}": single op ${pos} in ${ccL(CHART)}`);MS(`Bracht het album "${t}" uit`,1);
    hit(q,'muziek',`het album "${t}"`,fee);
    return `Je album "${t}" is uit. De single komt binnen op nummer ${pos} in ${ccL(CHART)}${pos<=3?'. Een monsterhit!':pos<=20?'. Een hit!':'.'} Je verdient ${fmt(fee)}.`},true,'💿')}
function tour(){const X=P14();const cp=S.cpi||1;if(!X.alb){toast('Breng eerst een album uit');return}doAct('Tour',()=>{S.acts.tour=1;X.tour++;const sz=S.fame>=70?'stadions':S.fame>=40?'grote zalen':'kleine clubs';const rev=Math.round(salary()*(S.fame>=70?.8:S.fame>=40?.4:.15)*(1+mgrB()));cash(rev);hea(-ri(2,6));hap(6);S.fame=clamp(S.fame+2);
  hist14(`Tour langs ${sz}`);return `Je toert een maand langs ${sz}. ${pick(['Het publiek zingt elk woord mee.','Je stem is na drie weken op, maar je gaat door.','Elke avond is uitverkocht.'])} Opbrengst: ${fmt(rev)}.`},true,'🚌')}
// ---------- model ----------
function casting(kind){const cp=S.cpi||1;doAct('Casting',()=>{S.acts['cast'+kind]=1;const p=clamp(.2+(S.st.looks-60)/100+(S.fame||0)/300+mgrB()+(S.job?S.job.lvl*.12:0),.05,.9);if(!chance(p)){hap(-2);return pick(['Ze zoeken "iets anders". Niemand weet wat.','Je loopt prima, maar ze kiezen een ander.'])}
  const fw=pick(['Parijs','Milaan','New York','Londen']);const q=clamp(Math.round(S.st.looks*.6+R()*40+(S.fame||0)*.1));const fee=salary()*(kind==='show'?.15:kind==='cover'?.1:.3)*(1+mgrB());
  const txt=kind==='show'?`Je loopt op de Fashion Week van ${fw}.`:kind==='cover'?`Je staat op de cover van ${pick(['Vogue','Elle','Harper\'s Bazaar','Glamour'])}.`:`Je bent het gezicht van de nieuwe campagne van ${pick(['een groot parfummerk','een Italiaans modehuis','een sportmerk','een horlogemerk'])}.`;
  hist14(txt.replace(/^Je /,'').replace(/\.$/,''));hit(q,'mode',kind==='cover'?'je cover':'je werk',fee);return `${txt} Je verdient ${fmt(fee)}.`},true,'📸')}
// ---------- schrijver ----------
function writeBook(){const X=P14();doAct('Schrijven',()=>{const m=use('boek');X.book=X.book||{t:mkTitle(),p:0,q:0};const g=Math.round(ri(15,30)*Math.max(.3,m));X.book.p=Math.min(100,X.book.p+g);X.book.q+=Math.round((S.sk.kunst||30)*.3+R()*20);sk('kunst',2);
  return X.book.p>=100?`Je manuscript "${X.book.t}" is af! Tijd om het uit te geven.`:`Je werkt aan "${X.book.t}" (${X.book.p}% af).`},true,'✍️')}
function publish(){const X=P14();const b=X.book;if(!b||b.p<100)return;doAct('Uitgeven',()=>{const q=clamp(Math.round(b.q/Math.max(1,b.p/22)+(S.fame||0)*.2+R()*15));const fee=salary()*.5*(q/60)*(1+mgrB());X.book=null;X.books=(X.books||0)+1;
  const list=q>=70;hist14(`Boek "${b.t}": ${star(q)}${list?' · op '+ccL(BSL):''}`);MS(`Schreef het boek "${b.t}"`,1);hit(q,'boek',`"${b.t}"`,fee);
  return `"${b.t}" ligt in de winkel. Recensies: ${star(q)}.${list?` Het boek komt op ${ccL(BSL)}!`:''} Je verdient ${fmt(fee)}.`},true,'📚')}
// ---------- presentator ----------
const SHOWT=['een quizprogramma','een talkshow','een kookprogramma','een datingshow','een reisprogramma','een spelshow op zaterdagavond'];
function pitch(){const X=P14();doAct('Pitchen',()=>{S.acts.pitch=1;const p=clamp(.25+(S.sk.sociaal||0)/200+(S.fame||0)/250+mgrB(),.05,.85);if(!chance(p))return 'De zender vindt het idee "interessant". Dat betekent nee.';const ty=pick(SHOWT);X.show={ty,n:`${cap(mkTitle())}`,y:year(),k:0};hist14(`Kreeg ${ty}: "${X.show.n}"`);hap(6);return `Je krijgt ${ty}: "${X.show.n}". De opnames beginnen dit najaar.`},true,'🎙️')}
function showYear(){const X=P14();const s=X.show;if(!s||s.y>=year())return;if(fameJob()!=='presentator'){X.show=null;return}const q=clamp(Math.round((S.sk.sociaal||30)*.5+R()*45+(S.fame||0)*.15));s.k=q;const kijk=Math.round((q/100)*(S.p.country==='NL'?2:S.p.country==='US'?15:4)*10)/10;
  L(`📺 "${s.n}" trekt gemiddeld ${kijk.toLocaleString('nl-NL')} miljoen kijkers.${q<30?' De zender stopt ermee.':''}`,q>=60?'good':q<30?'bad':'sys');if(q<30){X.show=null;hist14(`"${s.n}" gestopt`)}hit(q,'tv',`"${s.n}"`,salary()*.2*(1+mgrB()))}

// ---------- 14.2 manager en de rijen ----------
function f14Rows(el){const id=fameJob();if(!id||inJail())return;const X=P14();const s=sec(el,'Projecten');
  if(id==='acteur')for(const [k,[e,n,,min]] of Object.entries(ROLE))row(s,{ic:e,t:`Auditie: ${n.toLowerCase()}`,s:S.acts['aud'+k]?'Dit jaar al gedaan':X.act.some(a=>a.ty===k)?'Je hebt al zo\'n rol, komt volgend jaar uit':`Kans hangt af van je uiterlijk, talent en bekendheid`,dis:!!S.acts['aud'+k]||X.act.some(a=>a.ty===k),dots:true,on:()=>audition(k)});
  if(id==='muzikant'){row(s,{ic:'🎼',t:'Een nummer schrijven',s:`${X.songs.length} nummers klaar voor een album`,on:writeSong});row(s,{ic:'💿',t:'Een album uitbrengen',s:X.songs.length<8?`Nog ${8-X.songs.length} nummers nodig`:`${X.songs.length} nummers · de single gaat naar ${ccL(CHART)}`,dis:X.songs.length<8,dots:true,on:album});
    row(s,{ic:'🚌',t:'Op tour gaan',s:!X.alb?'Breng eerst een album uit':S.acts.tour?'Dit jaar al gedaan':'Geld en fans, maar zwaar',dis:!X.alb||!!S.acts.tour,on:tour})}
  if(id==='model')for(const [k,e,n] of [['show','👠','Een modeshow'],['cover','📰','Een tijdschriftcover'],['camp','📸','Een campagne']])row(s,{ic:e,t:`Casting: ${n.toLowerCase()}`,s:S.acts['cast'+k]?'Dit jaar al gedaan':'',dis:!!S.acts['cast'+k],on:()=>casting(k)});
  if(id==='schrijver'){const b=X.book;row(s,{ic:'✍️',t:b?`Schrijven aan "${b.t}"`:'Een nieuw boek beginnen',s:b?`${b.p}% af`:'Elk jaar een stuk verder',dis:b&&b.p>=100,on:writeBook});if(b&&b.p>=100)row(s,{ic:'📚',t:'Je boek uitgeven',s:`De weg naar ${ccL(BSL)}`,dots:true,on:publish})}
  if(id==='presentator'){if(X.show)row(s,{ic:'📺',t:`"${X.show.n}"`,s:`${cap(X.show.ty)}${X.show.k?` · laatste seizoen ${star(X.show.k)}`:' · eerste seizoen in de maak'}`});else row(s,{ic:'💡',t:'Een programma pitchen',s:S.acts.pitch?'Dit jaar al gedaan':'Bij een tv-zender',dis:!!S.acts.pitch,dots:true,on:pitch})}
  row(s,{ic:'🤝',t:X.mgr?'Je manager':'Een manager nemen',s:X.mgr?'Krijgt 15% van je projecten · tik om te ontslaan':'Betere kansen, maar 15% van je inkomsten uit projecten',dots:true,on:()=>{X.mgr=X.mgr?0:1;toast(X.mgr?'Je hebt een manager':'Je manager vertrekt');refreshSheet()}});
  if(X.hist.length){const h=sec(el,'Je werk tot nu toe');for(const [y,t] of X.hist.slice().reverse())row(h,{ic:'•',t,s:String(y)})}}
// manager kost 15% van de projectinkomsten (verrekend in hit via mgrB: je krijgt +15% kansen en meer werk, maar betaalt 15%)
const _hit14=hit;hit=function(q,k,t,fee){const X=P14();if(X.mgr&&fee>0){const c=Math.round(fee*.15);fee-=c}return _hit14(q,k,t,fee)};
circRow=(f=>function(el,slot){if(slot==='work'&&fameJob()){safe(()=>f14Rows(el));return}return f.apply(this,arguments)})(circRow);
// fase 10-rijen (jaargesprek e.d.) niet voor bekende beroepen
f10JobRows=(f=>function(el){if(fameJob()||(S.job&&JOB(S.job.id)&&JOB(S.job.id).pol))return;return f.apply(this,arguments)})(f10JobRows);

// ---------- 14.4 influencers: eigen merk, gecanceld ----------
function brandRow(el){if(!S.sm||(S.foll||0)<1e5||inJail())return;const s=sec(el,'Je eigen merk');const B=S.brand14;
  if(B)row(s,{ic:'🏷️',t:B.n,s:`Sinds ${B.y} · ${B.ty}`});else{const k=Math.round(40000*(S.cpi||1));row(s,{ic:'🏷️',t:'Een eigen merk lanceren',s:`${fmt(k)} · je volgers zijn je klanten`,dis:S.money<k,dots:true,on:()=>modal({title:'Een eigen merk',em:'🏷️',cat:'Social media',text:'Wat ga je verkopen?',choices:opts(['Kleding','Make-up','Energiedrankjes','Sportkleding','Een kookboek en pannen'].map(ty=>({t:ty,on:()=>{closeModal();doAct('Eigen merk',()=>{cash(-k);S.brand14={n:`${S.p.first} ${pick(['Studio','Club','Label','& Co'])}`,ty:ty.toLowerCase(),y:year()};MS(`Lanceerde het merk ${S.brand14.n}`,2);hap(6);return `${S.brand14.n} is gelanceerd. De eerste voorraad is binnen een uur uitverkocht!`},true,'🏷️')}})))})})}}
sheetSocial=(f=>function(el){const r=f.apply(this,arguments);safe(()=>brandRow(el));return r})(sheetSocial);
function brandYear(){const B=S.brand14;if(!B)return;const rev=Math.round((S.foll||0)*ri(2,12)/100*(S.cpi||1));if(rev<500&&chance(.3)){L(`🏷️ ${B.n} verkoopt niet meer. Je stopt ermee.`,'bad');S.brand14=null;return}cash(rev);if(period&&period.src){period.src['Eigen merk']=(period.src['Eigen merk']||0)+rev;period.inc+=rev}}
E('f14_cancel',{sys:1,need:()=>(S.foll||0)>=1e5&&!inJail(),t:'Gecanceld',x:()=>`Een oude grap van jou duikt op. Het internet ontploft: #cancel${S.p.first} is trending.`,ch:[
 ['🙏 Oprecht sorry zeggen',()=>{if(chance(.65)){S.foll=Math.round(S.foll*.95);return 'Je excuses worden geaccepteerd. Na een week is het nieuws alweer vergeten.'}S.foll=Math.round(S.foll*.8);return 'Je excuses vallen verkeerd. Je verliest veel volgers.'}],
 ['😤 Ontkennen',()=>{if(chance(.3))return 'Je fans staan achter je. Het waait over.';S.foll=Math.round(S.foll*.6);S.fame=clamp(S.fame-8);return 'Het wordt alleen maar erger. Sponsors haken af.'}],
 ['🤐 Even offline gaan',()=>{S.foll=Math.round(S.foll*.85);hap(2);return 'Je verdwijnt een maand van internet. Rust in je hoofd, minder volgers.'}]]});
EVMETA.f14_cancel=['Social media','🔥'];

// ---------- jaarlijks ----------
F8.year.push(()=>{if(!S.alive||inJail())return;const id=fameJob();if(id==='acteur')releaseAct();showYear();brandYear();
  if((S.foll||0)>=1e5&&chance(.04)&&typeof fmFree==='function'&&fmFree()){fmTake();Q.push({id:'f14_cancel',c:{}})}
  if(S.p14&&!id){S.p14.act=[];S.p14.show=null}});
ACH.push(['prijs','In de prijzen','Win een grote prijs voor je werk']);F8.ach.push(add=>{if(S.flags.prijs14)add('prijs')});

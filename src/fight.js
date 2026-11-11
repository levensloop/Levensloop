// namen als "De overvaller" midden in een zin met kleine letter: "staat de overvaller" (verbeterplan 1.8)
const midNm=n=>/^(De|Het|Een) /.test(n||'')?n[0].toLowerCase()+n.slice(1):n;
// functienamen midden in een zin: eerste woord klein, behalve eigennamen als Eerste/Tweede Kamer, Senaat, Congres, Europees Parlement
function lcFn(t){if(!t||/^[A-Z]{2}/.test(t))return t;if(/^(Eerste|Tweede) Kamer|^(Senaat|Congres|Bundestag|Bundesrat|Europees|Staten)/.test(t))return t;return t[0].toLowerCase()+t.slice(1)}
/* ---------- vechten: aanvallen kiezen, vechtsporten trainen, nieuwe technieken leren ---------- */
const MOVES={
  stomp:{n:'Stomp',em:'👊',d:[6,11],acc:.75,st:'basis'},
  duw:{n:'Duwen',em:'🫸',d:[3,6],acc:.9,st:'basis',stun:.2},
  schop:{n:'Schoppen',em:'🦵',d:[7,13],acc:.62,st:'basis'},
  jab:{n:'Jab',em:'🥊',d:[6,10],acc:.88,st:'boksen',lv:0},
  hoek:{n:'Hoekstoot',em:'🥊',d:[10,16],acc:.74,st:'boksen',lv:30},
  upper:{n:'Uppercut',em:'💥',d:[15,24],acc:.6,st:'boksen',lv:65,stun:.25},
  lowkick:{n:'Low kick',em:'🦵',d:[8,13],acc:.82,st:'kickboksen',lv:0},
  knie:{n:'Knie',em:'🦿',d:[11,18],acc:.7,st:'kickboksen',lv:30},
  highkick:{n:'High kick',em:'🌪️',d:[17,28],acc:.5,st:'kickboksen',lv:65,stun:.3},
  veeg:{n:'Beenveeg',em:'🦶',d:[5,9],acc:.82,st:'judo',lv:0,stun:.4},
  worp:{n:'Heupworp',em:'🤼',d:[10,16],acc:.7,st:'judo',lv:30,stun:.3},
  schouder:{n:'Schouderworp',em:'🌀',d:[16,25],acc:.58,st:'judo',lv:65,stun:.35},
  handzwaard:{n:'Handzwaard',em:'🤚',d:[8,13],acc:.8,st:'karate',lv:0},
  voortrap:{n:'Voorwaartse trap',em:'🦵',d:[10,16],acc:.72,st:'karate',lv:30},
  draaitrap:{n:'Draaitrap',em:'🌀',d:[18,30],acc:.47,st:'karate',lv:65},
  takedown:{n:'Takedown',em:'🤼',d:[5,9],acc:.75,st:'mma',lv:0,stun:.45},
  gnp:{n:'Ground and pound',em:'🔨',d:[12,20],acc:.7,st:'mma',lv:30},
  wurg:{n:'Wurggreep',em:'🐍',d:[3,6],acc:.5,st:'mma',lv:65,sub:1},
  kopstoot:{n:'Kopstoot',em:'🤕',d:[12,20],acc:.6,st:'vies',self:[3,7]},
  bijten:{n:'Bijten',em:'🦷',d:[5,9],acc:.8,st:'vies'}};
const FSTYLES={boksen:{n:'Boksen',em:'🥊',a:10,les:30},kickboksen:{n:'Kickboksen',em:'🦵',a:12,les:35},judo:{n:'Judo',em:'🥋',a:6,les:25},karate:{n:'Karate',em:'🥋',a:6,les:25},mma:{n:'MMA',em:'🤼',a:16,les:45}};
function fx(){if(!S.fx)S.fx={sk:clamp(Math.round((S.sk.sport||0)*.3)),st:{},mv:['stomp','duw','schop']};if(!S.fights)S.fights={w:0,l:0};return S.fx}
// samenvatting voor beide knoppen (Activiteiten en Speciale carrières): zelfde scherm, zelfde voortgang
const fightSub=()=>{const F=fx();const best=Object.entries(F.st).sort((x,y)=>y[1]-x[1])[0];return `Vechtkunst ${F.sk}%${best&&best[1]?` · ${FSTYLES[best[0]].n} ${best[1]}%`:''} · ${S.fights.w} gewonnen`};
const myMoves=()=>{const F=fx();return F.mv.filter(id=>MOVES[id]).concat(ageY()>=12?['kopstoot','bijten']:[])};
// ---- het gevecht zelf ----
// o={foe:{first,face,sk,hp},title,cat,em,end:(res,info)=>tekst,next}
function fightFlow(o){const F=fx();const me={hp:Math.round(55+S.st.health*.45)},foe={hp:o.foe.hp||ri(70,100),max:0};me.max=me.hp;foe.max=foe.hp;
  const b=snapSt();let round=0,stunned=false,log=[],ko=null,dead=false;const foeMoves=['stomp','duw','schop'].concat(o.foe.sk>=40?['jab','lowkick']:[],o.foe.sk>=65?['hoek','knie']:[]);
  const hpBar=(n,v,mx,col)=>`<div class="fhp"><span>${he(n)}</span><i><b style="width:${clamp(v/mx*100)}%;background:${col}"></b></i><em>${Math.max(0,Math.round(v))}</em></div>`;
  const finish=res=>{if(dead)return killed(o,b);const lost=me.max-Math.max(0,me.hp);hea(-Math.round(lost/11));if(res==='win'){F.sk=clamp(F.sk+2);hap(4)}else if(res==='lose'){F.sk=clamp(F.sk+1)}
    if(res==='win')S.fights.w++;else if(res==='lose')S.fights.l++;
    const pre=ko==='foe'?'Knock-out! ':ko==='me'?'Je gaat knock-out. ':res==='flee'?'':(foe.hp>0&&me.hp>0?(res==='win'?'Na zeven rondes sta jij er het sterkst voor. ':`Na zeven rondes staat ${midNm(o.foe.first)} er beter voor. `):'');
    const txt=pre+(o.end(res,{rounds:round,myHp:me.hp,foeHp:foe.hp,ko})||'');if(txt)L(txt,res==='win'?'good':res==='lose'?'bad':'');
    result(o.title,txt,chipsFrom(b),()=>{refreshSheet();render();saveLife();o.next&&o.next()},{cat:o.cat,em:o.em||'🥊'})};
  const turn=()=>{round++;const mv=myMoves();
    modal({title:o.title,em:o.em||'🥊',cat:`Ronde ${round}`,html:`<div class="fbox">${hpBar('Jij',me.hp,me.max,'var(--good)')}${hpBar(o.foe.first,foe.hp,foe.max,'var(--bad)')}</div>${log.length?`<p class="flog">${log.slice(-2).map(he).join('<br>')}</p>`:''}<p class="muted" style="margin:4px 0 0;font-size:13px">Kies je aanval · schade · kans op raak · 💫 = kan verdoven</p>`,
      choices:mv.map(id=>{const M=MOVES[id];const hit=hitP(M.acc,F.sk,o.foe.sk);return {t:M.n,ic:M.em,s:`${M.sub?'Afkloppen':M.d[0]+'–'+M.d[1]} · ${Math.round(hit*100)}%${M.stun?' · 💫':''}`,on:()=>attack(id)}}).concat([{t:'🏃 Wegrennen',cls:'ghost',on:()=>{closeModal();if(chance(.6)){finish('flee')}else{log.push(`Je probeert weg te rennen, maar ${midNm(o.foe.first)} grijpt je.`);foeHit();check()}}}])})};
  const attack=id=>{closeModal();const M=MOVES[id];haptic(15);
    if(chance(hitP(M.acc,F.sk,o.foe.sk))){if(M.sub&&foe.hp<=foe.max*.5){foe.hp=0;log.push(`${M.n}! ${o.foe.first} tikt af.`)}else{const d=Math.round(ri(M.d[0],M.d[1])*(1+F.sk/120));foe.hp-=d;log.push(`${M.n} raak: −${d}.`);
      if(F.sk>=72&&M.d[1]>=18&&chance((F.sk-67)/33*.035*(foe.hp<=foe.max*.5?1.6:1))){dead=true;foe.hp=0}
      else if(foe.hp>0&&chance(koP(F.sk,o.foe.sk,d,foe))){ko='foe';foe.hp=0;log.push(`${o.foe.first} gaat neer!`)}if(M.stun&&chance(M.stun)){stunned=true;log.push(`${o.foe.first} is even van slag.`)}}}
    else log.push(`Je ${M.n.toLowerCase()} mist.`);
    if(M.self){const s=ri(M.self[0],M.self[1]);me.hp-=s}
    if(foe.hp>0){if(stunned){stunned=false}else foeHit()}check()};
  const foeHit=()=>{const M=MOVES[pick(foeMoves)];if(chance(hitP(M.acc,o.foe.sk,F.sk))){const d=Math.round(ri(M.d[0],M.d[1])*(1+o.foe.sk/120));me.hp-=d;log.push(`${o.foe.first}: ${M.n.toLowerCase()}, −${d}.`);if(me.hp>0&&chance(koP(o.foe.sk,F.sk,d,me,1))){ko='me';me.hp=0}}else log.push(`${o.foe.first} mist met een ${M.n.toLowerCase()}.`)};
  const check=()=>{if(foe.hp<=0)return finish('win');if(me.hp<=0)return finish('lose');if(round>=7)return finish(me.hp/me.max>=foe.hp/foe.max?'win':'lose');turn()};
  turn()}
const hitP=(acc,a,b)=>clamp(acc+(a-b)/250,.08,.97);
// knock-out: alleen als je sterk bent; hoe harder de klap en hoe zwakker de ander, hoe groter de kans
// speler: iets ruimer · tegenstander: de oorspronkelijke, zuinigere formule (zo heeft de speler een klein voordeel)
function koP(sk,osk,d,t,foe){if(foe){if(sk<40)return 0;return Math.max(0,Math.min(.55,(sk-40)/160+d/t.max*.6+(1-t.hp/t.max)*.25-osk/400))}
  if(sk<35)return 0;return Math.max(0,Math.min(.62,(sk-35)/140+d/t.max*.65+(1-t.hp/t.max)*.275-osk/425))}
// heel sterk + heftige aanval: per ongeluk iemand doden
function killed(o,b){const n=o.foe.first,a=ageY();if(o.kill)o.kill();kar(-25);hap(-20);S.fights.w++;MS(`Doodde per ongeluk ${midNm(n)}`,1);
  let t=`Je raakt ${n} met een verwoestende klap. ${n} komt niet meer overeind en overlijdt in het ziekenhuis.`;
  if(o.ring)t+=' Het onderzoek wijst uit dat het een ongeluk was. Je wordt niet vervolgd, maar je zult het nooit vergeten.';
  else if(a<12)t+=' Je bent te jong om vervolgd te worden, maar je komt onder toezicht van jeugdzorg.';
  else{t+=' De politie arresteert je voor dood door schuld.'}
  L(t,'bad big');const go=()=>{if(!o.ring&&a>=12&&!inJail())jail(a<18?ri(12,30):ri(36,96),'dood door schuld');refreshSheet();render();saveLife();o.next&&o.next()};
  result(o.title,t,chipsFrom(b),go,{cat:o.cat,em:'💀'})}
// ---- vechtsportschool ----
function sheetFight(el){const F=fx(),a=ageY();
  card(el,`<h3>🥊 Vechtkunst</h3><span class="muted">${S.fights.w} gevechten gewonnen, ${S.fights.l} verloren</span><div class="stat"><span>Vechtkunst</span><span></span><span class="v">${F.sk}%</span>${bar(F.sk,'var(--brand)')}</div>`);
  const s=sec(el,'Lessen volgen');
  for(const [k,T] of Object.entries(FSTYLES)){const lv=F.st[k]||0,nxt=Object.entries(MOVES).find(([id,M])=>M.st===k&&!F.mv.includes(id));
    row(s,{ic:T.em,t:T.n,s:a<T.a?`Vanaf ${T.a} jaar`:`Niveau ${lv}% · les ${fmt(T.les)}${nxt?(nxt[1].lv<=lv?' · nieuwe techniek bij je volgende les':` · volgende techniek bij ${nxt[1].lv}%`):' · alle technieken geleerd'}`,dis:a<T.a||S.money<T.les&&a>=18,on:()=>doAct('Les '+T.n,()=>train(k),true,T.em)})}
  const f=sec(el,'Gevechten');
  row(f,{ic:'🤜',t:'Sparren',s:'Oefengevecht op de club · je leert er veel van',dis:a<8,dots:true,on:()=>{if((S.acts.spar||0)>=3){toast('Je hebt dit jaar genoeg gespard');return}S.acts.spar=(S.acts.spar||0)+1;const foe=mkFoe(F.sk+ri(-10,10));
    fightFlow({foe,ring:1,title:'Sparren',cat:'Vechtsport',end:res=>{F.sk=clamp(F.sk+1);for(const k in F.st)if(F.st[k])bumpStyle(k,2);return res==='win'?`Je bent ${midNm(foe.first)} de baas in de training.`:res==='flee'?'Je stopt halverwege.':`${foe.first} is vandaag beter. Je leert ervan.`}})}});
  row(f,{ic:'🏆',t:'Amateurgevecht',s:a<16?'Vanaf 16 jaar':`Inschrijven ${fmt(50)} · winnaar krijgt ${fmt(prizeF())}`,dis:a<16||S.money<50,dots:true,on:fight});
  const m=sec(el,'Jouw aanvallen');for(const id of myMoves()){const M=MOVES[id];row(m,{ic:M.em,t:M.n,s:`${M.st==='basis'?'Basis':M.st==='vies'?'Vies':FSTYLES[M.st].n} · schade ${M.d[0]}–${M.d[1]} · ${Math.round(M.acc*100)}% raak`})}}
function bumpStyle(k,g){const F=fx();const was=F.st[k]||0;F.st[k]=clamp(was+g);const got=[];for(const [id,M] of Object.entries(MOVES))if(M.st===k&&!F.mv.includes(id)&&F.st[k]>=M.lv){F.mv.push(id);got.push(M.n)}return got}
function train(k){const F=fx(),T=FSTYLES[k];if(ageY()>=18)cash(-T.les);const m=use('fx'+k);if(!m)return 'Je traint hard, maar je merkt dit jaar geen verschil meer.';
  const got=bumpStyle(k,Math.round(ri(5,9)*m*(S.talent==='sport'?1.4:1)));F.sk=clamp(F.sk+Math.round(2*m));hea(Math.round(1*m));sk('sport',1);
  return got.length?`Je hebt een nieuwe aanval geleerd: ${got.join(' en ')}! 🎉`:pick([`Een zware les ${T.n.toLowerCase()}. Je techniek wordt beter.`,'Je trainer is tevreden.','Je bent kapot, maar je wordt sterker.'])}
function mkFoe(sk,o={}){const g=o.g||pick(['m','v','m']);const p=mkPerson('tegenstander',g,S.m-(o.age||ageY()+ri(-3,3))*12);return {first:o.first||p.first,face:faceOf(p),sk:clamp(sk),hp:ri(75,100)}}
const prizeF=()=>Math.round(300*(1+((S.fights&&S.fights.w)||0)/3)*(S.cpi||1));
function fight(){fx();if((S.acts.fight||0)>=2){toast('Je hebt dit jaar al genoeg gevochten');return}const prize=prizeF(),foe=mkFoe(fx().sk+ri(-12,15));
  modal({title:'Amateurgevecht',em:'🥊',cat:'Vechtsport',text:`Je tegenstander is ${midNm(foe.first)}${foe.sk>fx().sk+5?', een geduchte vechter':foe.sk<fx().sk-5?', die minder ervaring heeft dan jij':', ongeveer van jouw niveau'}. Inschrijven kost ${fmt(50)}. De winnaar krijgt ${fmt(prize)}.`,choices:opts([{t:'Vechten',cls:'go',on:()=>{closeModal();S.acts.fight=(S.acts.fight||0)+1;cash(-50);
    fightFlow({foe,ring:1,title:'Amateurgevecht',cat:'Vechtsport',end:res=>{if(res==='win'){cash(prize);sk('sport',3);if(S.fights.w>=5)S.fame=clamp(S.fame+3);return `Je wint van ${midNm(foe.first)}! Je krijgt ${fmt(prize)}. Record: ${S.fights.w}-${S.fights.l}.`}if(res==='flee')return 'Je geeft op. Het publiek fluit je uit.';return `${foe.first} wint. Record: ${S.fights.w}-${S.fights.l}.`}})}}])})}
// ---- pesten en ruzie: terugvechten ----
function bullyP(){const c=S.circ&&S.circ.school;if(!c||c.k!==circKey('school'))return null;return circPpl(c).find(p=>p.bully)||null}
E('pestkop',{a:[6,17],c:()=>S.edu.stage==='basis'||S.edu.stage==='middel',w:()=>bullyP()?3:1,t:'Je wordt gepest',
  ctx:()=>{let p=bullyP();if(!p){const c=circle('school');const ps=c?circPpl(c).filter(x=>!x.lead&&x.role!=='vriend'&&x.role!=='partner'):[];p=ps.length?pick(ps):null;if(p){p.bully=1;p.rel=clamp(p.rel-25)}}return p?{id:p.id,n:p.first,sk:ri(10,40)+Math.max(0,pAge(p)-8)*2}:{n:rname(),sk:ri(10,45)}},
  x:c=>pick([`${c.n} pest je al weken. Vandaag duwt ${c.n} je tegen de kluisjes.`,`${c.n} pakt je tas af en gooit hem in de prullenbak. De halve klas lacht.`,`${c.n} wacht je op na school en scheldt je uit.`]),ch:[
 ['👊 Terugvechten 🎮',c=>({go:()=>{const p=c.id?circPpl(circle('school')).find(x=>x.id===c.id):null;
   fightFlow({foe:{first:c.n,sk:c.sk,hp:ri(70,95)},title:`Gevecht met ${c.n}`,cat:'School',next:processQ,kill:()=>{if(p){p.alive=false;p.died=ageY()}},end:res=>{if(res==='win'){if(p){p.bully=0;p.rel=clamp(p.rel+5)}hap(4);const r=chance(.5)?report('school',2,'Een leraar heeft het gevecht gezien.'):'';return `Je wint! ${c.n} laat je voortaan met rust.${r}`}
     if(res==='flee')return `Je rent weg. ${c.n} roept je nog wat na.`;const r=chance(.35)?report('school',1,'Een leraar komt ertussen.'):'';return `${c.n} wint het gevecht. Je loopt rond met een blauw oog.${r}`}})}})],
 ['🙈 Negeren',()=>{hap(-2);return 'Je loopt door. Het blijft knagen.'}],
 ['🧑‍🏫 Melden bij een leraar',c=>{kar(1);if(chance(.6)){const p=c.id&&bullyP();if(p)p.bully=0;return `${c.n} moet bij de directeur komen en laat je voortaan met rust.`}return `${c.n} krijgt strafwerk, maar noemt je nu een klikspaan.`}],
 ['🤝 Vrienden proberen te worden',c=>{if(chance(.3)){const p=c.id&&bullyP();if(p){p.bully=0;p.rel=clamp(p.rel+30)}hap(4);return `Verrassend: ${c.n} blijkt best aardig als je het gesprek aangaat.`}hap(-1);return 'Je wordt uitgelachen.'}]]});
E('kroeg',{a:[18,60],c:()=>Object.keys(S.lastActs||{}).some(k=>/^(uit|feest|borrel)/.test(k))||chance(.3),w:.6,t:'Ruzie op straat',ctx:()=>({n:rname(),sk:ri(15,60)}),
  x:c=>pick([`Een dronken man duwt je opzij in de kroeg en zoekt ruzie.`,`Iemand stoot je drankje om en geeft jou de schuld. "Wat nou?"`,`Op weg naar huis valt een groepje je lastig. Eén van hen komt op je af.`]),ch:[
 ['👊 Vechten 🎮',c=>({go:()=>fightFlow({foe:{first:'De onbekende',sk:c.sk,hp:ri(70,100)},title:'Vechtpartij',cat:'Op straat',next:processQ,end:res=>{if(res==='win'){kar(-1);if(chance(.25)){const k=Math.round(400*(S.cpi||1));cash(-k);return `Je wint, maar de politie komt erbij. Boete: ${fmt(k)}.`}return 'Je wint. De ander druipt af.'}if(res==='flee')return 'Je weet weg te komen.';return 'Je gaat neer. Een omstander helpt je overeind.'}})})],
 ['🗣️ Kalmeren',()=>{if(chance(.55+S.sk.sociaal/250))return 'Je praat rustig. De situatie loopt met een sisser af.';hea(-ri(2,6));return 'Praten helpt niet. Je krijgt een klap voor je hoofd.'}],
 ['🚶 Weglopen',()=>'Je loopt weg. Verstandig.']]});
// ---- doping ----
const inBlood=()=>{const P=S.sport;return !!(P&&P.dopeM!=null&&S.m-P.dopeM<48)};
const banned=()=>{const P=S.sport;return !!(P&&P.ban&&P.ban>S.m)};
const DOPE=[['steroiden','💪','Anabole steroïden','Meer spierkracht: je niveau gaat flink omhoog',1500,()=>{S.sport.sk=clamp(S.sport.sk+ri(4,7));hea(-ri(4,8));return 'Je wordt sterker dan ooit. Je lichaam protesteert wel.'}],
  ['epo','🩸','EPO','Meer uithoudingsvermogen: dit seizoen presteer je veel beter',2500,()=>{S.sport.boost=(S.sport.boost||0)+14;hea(-ri(3,6));return 'Je bloed is dikker, je longen lijken eindeloos.'}],
  ['groei','🧬','Groeihormoon','Sneller herstel en meer kracht',4000,()=>{S.sport.sk=clamp(S.sport.sk+ri(3,5));if(S.sport.inj)S.sport.inj=0;hea(-ri(2,5));return 'Je herstelt razendsnel van elke training.'}]];
function dopeMenu(){const P=S.sport,cp=S.cpi||1;
  modal({title:'Doping',em:'💉',cat:SPORTS[P.id].n,text:`Doping maakt je beter, maar het blijft ongeveer 4 jaar aantoonbaar in je bloed. ${P.st==='pro'?'Profs worden vaak gecontroleerd.':'Ook amateurs worden soms gecontroleerd.'}`,choices:opts(DOPE.map(([id,em,t,s,k,fn])=>({t,ic:em,s:`${s} · ${fmt(k*cp)}`,dis:S.money<k*cp,on:()=>{closeModal();doAct('Doping',()=>{S.acts.dope=1;cash(-Math.round(k*cp));P.dopeM=S.m;P.doped=(P.doped||0)+1;kar(-3);return fn()},true,'💉')}})))})}
function caught(yrs,why){const P=S.sport,D=SPORTS[P.id];P.ban=S.m+yrs*12;P.caught=(P.caught||0)+1;S.fame=clamp(S.fame-15);kar(-8);hap(-10);let x='';
  if(P.st==='pro'&&S.job){const f=Math.round(salary()*.2);cash(-f);x=` ${P.team} ontbindt je contract en je krijgt een boete van ${fmt(f)}.`;endJob();P.st='club';P.lvl=0;P.team=`${cap(D.c)} ${S.p.city}`}
  MS(`Werd betrapt op doping`,1);return `Positief! ${why?cap(why)+'. ':''}Je wordt ${yrs} jaar geschorst.${x} Je naam staat in alle kranten.`}
function dopeCost(){return Math.round(Math.max(S.sport&&S.sport.st==='pro'?20000:4000,S.job&&S.job.id==='prosport'?salary()*.3:0)*(S.cpi||1)/100)*100}
E('sp_dope',{sys:1,need:()=>!!S.sport&&S.sport.st!=='gestopt'&&!banned(),t:'Dopingcontrole!',x:()=>`Na ${S.sport.st==='pro'?'de wedstrijd':'je training'} staat er een dopingcontroleur bij de kleedkamer. Je moet een urinemonster afgeven.${inBlood()?' Je weet wat er nog in je bloed zit...':''}`,ch:[
 ['🧪 Gewoon meewerken',()=>inBlood()?caught(2):'Je monster is schoon. Niets aan de hand.'],
 ['💰 De controleur omkopen',()=>{const k=dopeCost();cash(-k);if(chance(.55))return `Je stopt de controleur ${fmt(k)} toe. Je monster "raakt zoek".`;return `De controleur weigert je ${fmt(k)} en meldt je.`+' '+caught(4,'je probeerde de controleur om te kopen')},()=>S.money>=dopeCost()],
 ['🥤 Urine van iemand anders gebruiken',()=>{if(chance(.6))return 'Je ruilt het potje stiekem om. Niemand merkt iets.';return 'De controleur kijkt mee en ziet het gebeuren.'+' '+caught(4,'je knoeide met je monster')}]]});
// elk seizoen: kans op controle, geschorst = geen seizoen
function dopeYear(){const P=S.sport;if(!P||P.st==='gestopt')return false;
  if(banned()){P.sk=clamp(P.sk-ri(1,3));L(`Je bent nog ${Math.ceil((P.ban-S.m)/12)} jaar geschorst voor doping. Je mag niet spelen.`,'bad');return true}
  if(inBlood()&&chance(.3))hea(-ri(1,3));
  const pc={pro:.45,academie:.2,uni:.25,club:.06,school:.03}[P.st]||0;if(ageY()>=15&&chance(pc))Q.push({id:'sp_dope'});return false}

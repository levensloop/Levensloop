/* ================= POLITIEK (fase 2): wetten, mensen, meer acties en gebeurtenissen ================= */
const pc_=v=>(Math.round(v*1000)/10).toLocaleString('nl-NL')+'%';
// v: waarden per stap · d: standaard · ax/up: welke kant wil 'omhoog' (up=-1: links/progressief wil omhoog) · pp: populariteit bij kiezers van 'omhoog' · port: bijpassend ministerie
const LAWS={
 ib:{t:'Toptarief inkomstenbelasting',em:'💶',v:[.42,.465,.495,.53,.58],d:2,ax:'lr',up:-1,pp:0,port:'Financiën',f:pc_,w:['verlaagt','verhoogt']},
 verm:{t:'Vermogensbelasting',em:'🏦',v:[.008,.013,.018,.024,.03],d:2,ax:'lr',up:-1,pp:-1,port:'Financiën',f:pc_,w:['verlaagt','verhoogt']},
 vpb:{t:'Winstbelasting voor bedrijven',em:'🏢',v:[.2,.23,.258,.29,.32],d:2,ax:'lr',up:-1,pp:1,port:'Economische Zaken',f:pc_,w:['verlaagt','verhoogt']},
 erf:{t:'Erfbelasting',em:'📜',v:[0,.5,1,1.5,2],d:2,ax:'lr',up:-1,pp:-3,port:'Financiën',f:v=>v===0?'afgeschaft':v===1?'normaal':v<1?(v*100)+'% van normaal':(v*100)+'% van normaal',w:['verlaagt','verhoogt']},
 minloon:{t:'Minimumloon',em:'🧾',v:[.94,1,1.08,1.16,1.25],d:1,ax:'lr',up:-1,pp:3,port:'Sociale Zaken',f:v=>v===1?'normaal':(v>1?'+':'')+Math.round((v-1)*100)+'%',w:['verlaagt','verhoogt']},
 aow:{t:'AOW-leeftijd',em:'👵',v:[65,66,67,68,69,70],d:2,ax:'lr',up:1,pp:-4,port:'Sociale Zaken',f:v=>v+' jaar',w:['verlaagt','verhoogt']},
 huur:{t:'Bescherming huurders',em:'🏠',v:[.025,.012,.002,-.012,-1],d:2,ax:'lr',up:-1,pp:2,port:'Wonen',f:v=>v===-1?'huren bevroren':v<0?'streng':v<.005?'normaal':v<.02?'soepel':'vrije markt',w:['verzwakt','versterkt']},
 er:{t:'Eigen risico in de zorg',em:'🏥',v:[0,.5,1,1.5],d:2,ax:'lr',up:1,pp:-4,port:'Volksgezondheid',f:v=>v===0?'afgeschaft':v===1?'normaal':(v*100)+'% van normaal',w:['verlaagt','verhoogt']},
 beurs:{t:'Studiefinanciering',em:'🎓',v:[0,1],d:0,ax:'lr',up:-1,pp:2,port:'Onderwijs',f:v=>v?'basisbeurs':'leenstelsel',w:['schaft de basisbeurs af','voert de basisbeurs in']},
 wiet:{t:'Wiet',em:'🌿',v:[0,1],d:0,ax:'pc',up:-1,pp:0,port:'Justitie en Veiligheid',f:v=>v?'legaal':'gedoogd',w:['verbiedt wiet weer','legaliseert wiet']},
 straf:{t:'Straffen',em:'⚖️',v:[.8,1,1.25,1.5],d:1,ax:'pc',up:1,pp:2,port:'Justitie en Veiligheid',f:v=>v===1?'normaal':v<1?'milder':v<1.4?'zwaarder':'veel zwaarder',w:['verzacht','verzwaart']}};
function lawIdx(k){const W=S.pw;if(!W)return LAWS[k].d;W.law=W.law||{};return W.law[k]??LAWS[k].d}
function law(k){return LAWS[k].v[lawIdx(k)]}
const aowAge=()=>typeof law==='function'?law('aow'):67;
function lawTxt(k,dir){const L_=LAWS[k];return L_.v.length===2?L_.w[dir>0?1:0]:`${L_.w[dir>0?1:0]} ${L_.t.toLowerCase()} naar ${L_.f(L_.v[lawIdx(k)+dir])}`}
function setLaw(k,dir){const W=polW();W.law=W.law||{};W.law[k]=clamp(lawIdx(k)+dir,0,LAWS[k].v.length-1)}
// steun per partij voor een voorstel
function lawProb(k,dir,pid,o){const L_=LAWS[k],p=PTY(pid),W=S.pw,P=S.pol;const lean=(p[L_.ax]-50)*L_.up*dir;let pr=clamp(.5+lean/42,.04,.96);
  if(P&&pid===P.party)return isPres()?clamp(.5+lean/42+.3,.15,.97):.98;
  const govProp=P&&['min','mp'].includes(P.lvl);
  if(govProp){if(W.gov.includes(pid))pr=Math.min(.97,pr+.28);else pr-=.06}else if(W.gov.includes(pid)&&(!P||!W.gov.includes(P.party)))pr-=.12;
  const fr=(P&&P.ppl||[]).find(x=>x.kind==='fractie'&&x.party!==P.party&&x.pid===pid);if(fr&&fr.rel>=70)pr+=.08;
  if(o&&o.lob)pr+=.12;return clamp(pr,.02,.98)}
function lawExpect(k,dir,o){const W=S.pw;let e=0;for(const pid in W.seats)if(W.seats[pid]>0&&PTY(pid))e+=W.seats[pid]*lawProb(k,dir,pid,o);return Math.round(e)}
function lawMenu(){const P=S.pol;if(S.acts.wet){toast('Je hebt dit jaar al een wetsvoorstel ingediend.');return}
  const list=Object.keys(LAWS).filter(lawOk);modal({title:'Wetsvoorstel',em:'📜',cat:polT(P.lvl),text:'Welke wet wil je veranderen?',choices:opts(list.map(k=>({t:`${LAWS[k].em} ${LAWS[k].t}`,s:`Nu: ${LAWS[k].f(law(k))}${P.port&&LAWS[k].port===P.port?' · jouw ministerie':''}`,on:()=>{closeModal();lawDir(k)}})))})}
function lawDir(k){const L_=LAWS[k],i=lawIdx(k);const ch=[];if(i<L_.v.length-1)ch.push({t:cap(lawTxt(k,1)),s:`Verwachte steun: ${lawExpect(k,1)} van ${hseats()} zetels`,on:()=>{closeModal();lawPlan(k,1)}});
  if(i>0)ch.push({t:cap(lawTxt(k,-1)),s:`Verwachte steun: ${lawExpect(k,-1)} van ${hseats()} zetels`,on:()=>{closeModal();lawPlan(k,-1)}});
  modal({title:L_.t,em:L_.em,cat:'Wetsvoorstel',text:`Nu: ${L_.f(law(k))}. Wat stel je voor?`,choices:opts(ch)})}
function lawPlan(k,dir,o={}){const P=S.pol;if(isPres()&&typeof presLawPlan==='function'){presLawPlan(k,dir,o);return}const e=lawExpect(k,dir,o);
  modal({title:'Naar de Kamer',em:'🏛️',cat:'Wetsvoorstel',text:`Je voorstel: ${lawTxt(k,dir)}. Verwachte steun: ongeveer ${e} van de ${hseats()} zetels. Je hebt er ${hneed()} nodig.`,choices:opts([
    {t:'🗳️ In stemming brengen',cls:'go',on:()=>{closeModal();lawVote(k,dir,o)}},
    {t:'🤝 Eerst steun zoeken bij andere partijen',s:o.lob?'Al gedaan':'Kost wat steun in je eigen partij',dis:!!o.lob,on:()=>{closeModal();P.steun=clamp(P.steun-4);o.lob=1;toast('Je belt, lunchts en onderhandelt een week lang.');lawPlan(k,dir,o)}}])})}
function lawVote(k,dir,o){const P=S.pol,W=S.pw;if(isPres()&&typeof presLawVote==='function'){presLawVote(k,dir,o);return}S.acts.wet=1;const voor=[],tegen=[];let n=0;
  for(const pid of Object.keys(W.seats).filter(x=>W.seats[x]>0&&PTY(x)).sort((a,b)=>W.seats[b]-W.seats[a])){if(chance(lawProb(k,dir,pid,o))){voor.push(pid);n+=W.seats[pid]}else tegen.push(pid)}
  const ok=n>=hneed();const L_=LAWS[k];const fits=(PTY(P.party)[L_.ax]-50)*L_.up*dir>=0;
  const lst=ids=>ids.map(x=>`${PTY(x).k} ${W.seats[x]}`).join(', ')||'niemand';
  let txt=`Voor (${n}): ${lst(voor)}. Tegen (${hseats()-n}): ${lst(tegen)}. `;
  if(ok){setLaw(k,dir);P.laws=(P.laws||0)+1;P.pop=clamp(P.pop+Math.round(L_.pp*dir)+2);P.steun=clamp(P.steun+(fits?6:-8));hap(6);
    txt+=`Aangenomen! Vanaf nu: ${L_.t.toLowerCase()} ${L_.f(law(k))}.${fits?'':' Je eigen achterban is er niet blij mee.'}`;L(`Jouw wetsvoorstel is aangenomen: ${lawTxt(k,0).trim()||L_.t} → ${L_.f(law(k))}.`,'good big');S.flags.wet=1;S.pex&&(S.pex.laws=(S.pex.laws||0)+1);if(k==='vpb'&&dir<0&&S.biz.some(b=>b.eq>0&&!b.trust)){P.risk=(P.risk||0)+20;P.pop=clamp(P.pop-4);txt+=' Kranten wijzen erop dat jouw eigen bedrijf hier flink van profiteert.'}if(P.laws===1)MS(`Kreeg een eigen wet aangenomen (${L_.t.toLowerCase()})`,2)}
  else{P.pop=clamp(P.pop-2);P.steun=clamp(P.steun-2);hap(-3);txt+='Verworpen. Je voorstel haalt het niet.';L(`Je wetsvoorstel over ${L_.t.toLowerCase()} is verworpen.`,'bad')}
  result(ok?'Aangenomen!':'Verworpen',txt,'',()=>{refreshSheet();render();saveLife()},{em:ok?'✅':'❌',cat:'Kamerstemming'})}
// kabinetsbeleid: een nieuw kabinet past een paar wetten aan
function cabPolicy(){const W=S.pw,P=S.pol;if(P&&P.lvl==='mp')return'';const tot=seatSum(W.gov,W.seats)||1;const c={lr:0,pc:0};for(const g of W.gov){const p=PTY(g);if(!p)continue;c.lr+=p.lr*W.seats[g]/tot;c.pc+=p.pc*W.seats[g]/tot}
  const out=[];for(const k of Object.keys(LAWS).filter(lawOk).sort(()=>R()-.5)){if(out.length>=2)break;const L_=LAWS[k];const d=c[L_.ax]-50;if(Math.abs(d)<7)continue;const dir=Math.sign(d)*L_.up;const i=lawIdx(k)+dir;if(i<0||i>=L_.v.length)continue;
    const t=lawTxt(k,dir);setLaw(k,dir);out.push(t)}
  return out.length?` Het kabinet ${out.join(' en ')}.`:''}
/* ---------- mensen om je heen ---------- */
const MEDIA=['De Dagkrant','Het Ochtendblad','NOS-achtig journaal','Politieke podcast De Kamer','Nieuwsuur-achtig programma','Het Stadsnieuws'];
function mkPolP(kind,party){const age=kind==='pers'?ri(26,60):ri(28,64);const p=mkPerson('polit',pick(['m','v']),S.m-age*12-ri(0,11),{rel:kind==='rivaal'?ri(20,40):ri(40,60),smarts:ri(45,95)});p.kind=kind;p.party=party||S.pol.party;
  p.role={leider:isPres()?'partijvoorzitter':'partijleider',fractie:'partijgenoot',rivaal:'rivaal',pers:'journalist',lobby:'lobbyist',amb:'topambtenaar'}[kind];if(kind==='pers')p.media=pick(MEDIA);if(kind==='lobby')p.co=pick(['Big Oil Nederland','de bouwlobby','een tabaksfabrikant','een grote bank','de vliegbranche','een techgigant']);return p}
function polPpl(){const P=S.pol;if(!P)return[];P.ppl=(P.ppl||[]).filter(p=>p.alive!==false&&pAge(p)<82);const W=polW();const has=k=>P.ppl.some(p=>p.kind===k);
  const ld=P.ppl.find(p=>p.kind==='leider');if(P.lead){if(ld)P.ppl=P.ppl.filter(p=>p!==ld)}else{const nm=W.lead[P.party]||lnm();if(!ld||`${ld.first} ${ld.last}`!==nm||ld.party!==P.party){if(ld)P.ppl=P.ppl.filter(p=>p!==ld);const p=mkPolP('leider');const [f,...l]=nm.split(' ');p.first=f;p.last=l.join(' ');P.ppl.unshift(p)}}
  P.ppl=P.ppl.filter(p=>!(p.kind==='fractie'||p.kind==='rivaal')||p.party===P.party);
  while(P.ppl.filter(p=>p.kind==='fractie').length<2)P.ppl.push(mkPolP('fractie'));
  if(!has('rivaal'))P.ppl.push(mkPolP('rivaal'));
  if(P.lvl!=='lid'&&!has('pers'))P.ppl.push(mkPolP('pers'));
  if(['kamer','min','mp','weth','burg','ep','ek'].includes(P.lvl)&&!has('lobby'))P.ppl.push(mkPolP('lobby'));
  if(['min','mp'].includes(P.lvl)&&!has('amb'))P.ppl.push(mkPolP('amb'));
  if(!['min','mp'].includes(P.lvl))P.ppl=P.ppl.filter(p=>p.kind!=='amb');
  return P.ppl}
const polP=id=>S.pol&&(S.pol.ppl||[]).find(p=>p.id===id);
function polPeopleSec(el){const s=sec(el,'Mensen om je heen');for(const p of polPpl())row(s,{ic:faceOf(p),t:`${p.first} ${p.last}`,role:p.role,s:`${cap(p.role)}${p.media?' · '+p.media:p.co?' · '+p.co:''}`,bar:{l:'Relatie',v:p.rel,c:barCol(p.rel)},on:()=>openSheet(p.first,el=>sheetPolP(el,p),true)})}
function sheetPolP(el,p){const P=S.pol;if(!P||!polP(p.id)){empty(el,`${p.first} speelt geen rol meer in jouw politieke leven.`);return}
  card(el,`<h3>${faceOf(p)} ${he(p.first+' '+p.last)}</h3><span class="muted">${cap(p.role)} · ${pAge(p)} jaar${p.media?' · '+he(p.media):''}${p.co?' · werkt voor '+he(p.co):''}${p.party&&['leider','fractie','rivaal'].includes(p.kind)?' · '+he(PTY(p.party).n):''}</span><div class="stat"><span>Relatie</span><span></span><span class="v">${Math.round(p.rel)}%</span>${bar(p.rel)}</div>`);
  const s=sec(el,'Acties');const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,dots:o.dots,on:()=>doAct(t,fn,true,ic)});const rel=d=>{p.rel=clamp(p.rel+d)};
  A('☕','Koffie drinken',()=>{const m=use('pk'+p.id);rel(Math.round(ri(3,8)*m));return pick([`Jullie drinken koffie in de wandelgangen. ${p.first} vertelt de laatste roddels.`,`${p.first} blijkt ook gek op wielrennen. Jullie praten een uur.`,`Een kwartiertje bijpraten tussen twee vergaderingen door.`])});
  if(p.kind==='leider'){
    A('🙏','Om advies vragen',()=>{const m=use('pa'+p.id);rel(Math.round(4*m));P.steun=clamp(P.steun+Math.round(2*m));return `${p.first} neemt de tijd. "Kies je gevechten," zegt ${p.g==='v'?'ze':'hij'}.`});
    A('🫡','Loyaal achter de leider staan',()=>{use('pl'+p.id);rel(6);P.steun=clamp(P.steun+4);P.pop=clamp(P.pop-1);return `Je verdedigt ${p.first} in de media. Dat wordt onthouden.`});
    A('🗯️','Publiek kritiek leveren',()=>{use('pc'+p.id);rel(-14);P.steun=clamp(P.steun-6);P.pop=clamp(P.pop+4);return `Je zegt in een interview dat ${p.first} de partij de verkeerde kant op stuurt. De telefoon staat roodgloeiend.`});
    if(P.lvl!=='lid'&&P.oy>=3)row(s,{ic:'⚔️',t:'Het leiderschap opeisen',s:'Alles of niets',dots:true,on:()=>ask('Coup plegen?',`Je probeert ${p.first} opzij te zetten als partijleider. Mislukt het, dan ben je je steun kwijt.`,'Ervoor gaan',()=>doAct('Leiderschap',()=>{if(chance(clamp((P.steun-60)/40+(P.pop-p.rel)/200+.1,.05,.8))){P.lead=1;S.pw.lead[P.party]=myName();P.cand.tk=1;P.ppl=P.ppl.filter(x=>x!==p);P.steun=clamp(P.steun-8);MS(`Werd partijleider van ${PTY(P.party).n}`,2);return `Na een nacht vol telefoontjes is het zover: jij bent de nieuwe partijleider. ${p.first} trekt zich terug.`}P.steun=clamp(P.steun-25);rel(-30);return `Je coup mislukt. De fractie kiest voor ${p.first}. Jij ligt eruit bij de partijtop.`},true,'⚔️'),'bad')})}
  if(p.kind==='fractie'){
    A('📝','Samen iets op papier zetten',()=>{const m=use('ps'+p.id);rel(Math.round(5*m));P.pop=clamp(P.pop+Math.round(2*m));return `Jij en ${p.first} schrijven samen een plan over ${pick(['betaalbare kinderopvang','schonere lucht','veiliger fietspaden','kortere wachtlijsten'])}. Het haalt de krant.`});
    A('🤝','Bondgenoot maken',()=>{use('pb'+p.id);if(chance(p.rel/110)){rel(10);p.ally=1;P.steun=clamp(P.steun+3);return `${p.first} belooft je te steunen bij de kandidatenlijst.`}rel(-2);return `${p.first} houdt de boot af. "Ik zie wel."`},{s:p.ally?'Is al je bondgenoot':'',dis:!!p.ally});
    A('🍷','Borrelen na de vergadering',()=>{const m=use('pbo'+p.id);rel(Math.round(6*m));hap(2);return `Het wordt laat in het café tegenover het stadhuis.`})}
  if(p.kind==='rivaal'){
    A('🤝','Vrede sluiten',()=>{use('pv'+p.id);if(chance(.3+p.rel/200)){rel(15);return `Jullie spreken uit dat jullie elkaar niet in de weg zitten.`}rel(-3);return `${p.first} lacht je vriendelijk uit.`});
    A('🦶','Dwarszitten',()=>{use('pd'+p.id);rel(-12);if(chance(.55)){P.steun=clamp(P.steun+5);return `Je zorgt dat ${p.first} niet op de sprekerslijst van het congres komt. Jij wel.`}P.steun=clamp(P.steun-6);return `Het wordt doorzien. Iedereen vindt het kinderachtig.`});
    const j=P.ppl.find(x=>x.kind==='pers');if(j)A('🗞️',`Iets lekken via ${j.first}`,()=>{use('pl'+p.id);P.risk=(P.risk||0)+8;if(chance(j.rel/120)){rel(-20);P.steun=clamp(P.steun+8);return `${j.media} brengt een kritisch stuk over ${p.first}. Jouw naam staat er niet in.`}P.steun=clamp(P.steun-12);P.pop=clamp(P.pop-5);return `${j.first} zet erin dat het lek uit jouw hoek komt. Oeps.`},{s:'Riskant'})}
  if(p.kind==='pers'){
    A('🤫','Off the record praten',()=>{const m=use('po'+p.id);rel(Math.round(6*m));return `Je vertelt ${p.first} hoe het er achter de schermen aan toe gaat. Niet om te citeren.`});
    A('🎙️','Interview geven',()=>{use('pi'+p.id);if(chance(.35+p.rel/160+(S.st.smarts-50)/250)){P.pop=clamp(P.pop+ri(3,7));rel(3);return `Een mooi portret in ${p.media}. Veel mensen delen het.`}P.pop=clamp(P.pop-ri(2,5));return `${p.first} knipt je uitspraken net verkeerd. De kop is niet wat je bedoelde.`});
    A('📵','Weigeren te reageren',()=>{use('pw'+p.id);rel(-6);return `"Geen commentaar." ${p.first} schrijft het stuk toch.`})}
  if(p.kind==='lobby'){
    A('🍽️','Gaan lunchen',()=>{const m=use('pu'+p.id);rel(Math.round(6*m));P.risk=(P.risk||0)+3;return `${p.first} betaalt een lunch van ${fmt(180)} bij een sterrenrestaurant. Gezellig, maar het voelt wat ongemakkelijk.`});
    A('✉️','Een "adviesfee" aannemen',()=>{use('pf'+p.id);const g=Math.round(ri(15,60)*1000*(S.cpi||1));cash(g);rel(10);P.risk=(P.risk||0)+25;kar(-6);return `Er staat ineens ${fmt(g)} op je rekening voor "advieswerk". In ruil stem je mee met ${p.co}.`},{s:'Snel geld · groot risico',dots:true});
    A('🙅','De deur wijzen',()=>{use('pn'+p.id);rel(-15);kar(3);P.risk=Math.max(0,(P.risk||0)-5);return `Je zegt ${p.first} dat ${p.g==='v'?'ze':'hij'} niet meer welkom is. Je voelt je integer.`})}
  if(p.kind==='amb'){
    A('📑','Laten bijpraten over je dossier',()=>{const m=use('pab'+p.id);rel(Math.round(4*m));sma(1);P.pop=clamp(P.pop+Math.round(m));return `${p.first} legt in een uur uit waar ${p.g==='v'?'ze':'hij'} twintig jaar over heeft gedaan. Je bent beter voorbereid.`});
    A('🔥','Onder druk zetten',()=>{use('pod'+p.id);rel(-12);if(chance(.6)){P.pop=clamp(P.pop+3);return `Het beleid komt eindelijk op tempo.`}P.risk=(P.risk||0)+6;return `${p.first} meldt zich ziek. Er gaan verhalen rond over een angstcultuur.`})}
}
/* ---------- extra acties per functie ---------- */
function polMore(f,P){const R_=(ic,t,s,fn,o={})=>row(f,{ic,t,s,dis:o.dis,dots:o.dots,on:fn});const D=(t,fn,ic)=>()=>doAct(t,fn,true,ic);
  const lw=['kamer','min','mp'].includes(P.lvl);
  if(typeof budMine==='function'&&budMine())R_('👜','Begroting maken',S.acts.bud?'Al ingediend dit jaar':'Zorg, onderwijs, defensie, uitkeringen, infrastructuur',()=>{S.budDraft=Object.assign({},budW());openSheet('Begroting',sheetBudget,true)},{dots:true});
  if(lw)R_('📜','Wetsvoorstel indienen',S.acts.wet?'Al een voorstel ingediend dit jaar':P.lvl==='kamer'?'Initiatiefwet · lastig maar het kan':'Verander echt iets in het land',lawMenu,{dis:!!S.acts.wet,dots:true});
  if(P.lvl==='raad'){R_('🧮','Begrotingsdebat','Minigame · waar gaat het geld heen?',()=>mgDebate('Begrotingsdebat',sc=>doAct('Begroting',()=>{use('pbg');P.steun=clamp(P.steun+Math.round((sc-.4)*8));P.pop=clamp(P.pop+Math.round((sc-.45)*8));return sc>=.7?'Je amendement voor extra speeltuinen wordt aangenomen.':'Je verdwaalt in de cijfers.'},true,'🧮')),{dots:true});
    R_('🗣️','Inspraakavond','Bewoners laten hun zegje doen',D('Inspraakavond',()=>{const m=use('pin');if(chance(.7)){P.pop=clamp(P.pop+Math.round(4*m));return 'Je luistert drie uur. Een mevrouw bedankt je persoonlijk.'}P.pop=clamp(P.pop-2);hap(-2);return 'Het loopt uit de hand. Er wordt met stoelen gegooid.'},'🗣️'))}
  if(P.lvl==='weth'){R_('🏗️','Groot project starten',S.acts.proj?'Al gestart dit jaar':'Woningen, een zwembad of een brug',projMenu,{dis:!!S.acts.proj,dots:true});
    R_('🎤','Je beleid verdedigen in de raad','Minigame',()=>mgDebate('Raadsdebat',sc=>doAct('Raadsdebat',()=>{use('prd');P.steun=clamp(P.steun+Math.round((sc-.4)*8));P.pop=clamp(P.pop+Math.round((sc-.45)*8));return sc>=.7?'De raad steunt je plannen.':'De oppositie zet je flink onder druk.'},true,'🎤')),{dots:true})}
  if(['kamer','ek'].includes(P.lvl)&&typeof weList==='function'&&weList().length)R_('🧭','Motie over de crisis',S.acts.wmot?'Al gedaan dit jaar':weList().map(e=>WEV[e.id].n).join(', '),weMotie,{dis:!!S.acts.wmot,dots:true});
  if(P.lvl==='kamer'){R_('📋','Motie indienen','Vraag het kabinet iets te doen',D('Kamermotie',()=>{use('pkm');if(chance(.4+(P.steun-50)/200+(S.pw.gov.includes(P.party)?.25:0))){P.pop=clamp(P.pop+3);return `Je motie over ${pick(['de dijken','de jeugdzorg','de bereikbaarheid van het platteland','de boodschappenprijzen'])} wordt aangenomen!`}P.pop=clamp(P.pop-1);return 'Je motie wordt verworpen.'},'📋'));
    R_('📺','Aanschuiven bij een talkshow','Kans op een viral moment',D('Talkshow',()=>{use('pts');if(chance(.5+(S.st.smarts-50)/200)){P.pop=clamp(P.pop+ri(3,7));S.fame=clamp(S.fame+1);return 'Je oneliner gaat het hele land door.'}P.pop=clamp(P.pop-ri(2,5));return 'Je zit er wat ongemakkelijk bij. Niemand onthoudt wat je zei.'},'📺'))}
  if(['ek','ep'].includes(P.lvl))R_('🧳',P.lvl==='ep'?'Naar Straatsburg':'Een wet kritisch bekijken',P.lvl==='ep'?'Plenaire week in het Europees Parlement':'Wetgeving toetsen',D(P.lvl==='ep'?'Straatsburg':'Wetstoets',()=>{const m=use('pek');P.steun=clamp(P.steun+Math.round(3*m));sma(1);return P.lvl==='ep'?'Een week vergaderen, tolken en treinreizen. Je sluit vriendschap met een Fin.':'Je vindt een fout in een wetsvoorstel. De minister moet het repareren.'},'🧳'));
  if(P.lvl==='min'){R_('🎤','Je begroting verdedigen','Minigame in de Kamer',()=>mgDebate('Begrotingsdebat',sc=>doAct('Begroting',()=>{use('pmb');P.pop=clamp(P.pop+Math.round((sc-.45)*10));P.steun=clamp(P.steun+Math.round((sc-.4)*6));return sc>=.7?'De Kamer stemt in met je begroting.':'Je krijgt het zwaar. Er komen drie moties tegen je beleid.'},true,'🎤')),{dots:true});
    if(P.port==='Buitenlandse Zaken'||P.port==='Defensie')R_('✈️','Buitenlandse reis','Overleg met bondgenoten',D('Buitenland',()=>{const m=use('pbr');P.pop=clamp(P.pop+Math.round(3*m));return `Je vliegt naar ${pick(['Washington','Brussel','Tokio','Kaapstad','Kyiv','Ottawa'])}. Een productief overleg.`},'✈️'))}
  if(P.lvl==='mp'){R_('🏛️','Ministerraad voorzitten','Twee ministers botsen',ministerraad,{dots:true,dis:!!S.acts.mr});
    if(psys().eu!==0)R_('🇪🇺','EU-top in Brussel','Onderhandelen met 26 landen',D('EU-top',()=>{use('peu');if(chance(.55)){P.pop=clamp(P.pop+4);return `Je sleept een goede deal binnen voor ${C().n}.`}P.pop=clamp(P.pop-2);return 'Je komt met lege handen thuis. De oppositie smult.'},'🇪🇺'));
    R_('🌍','Staatsbezoek',hosTxt()?`Met ${hosTxt()} naar het buitenland`:'Handelsmissies en banketten',D('Staatsbezoek',()=>{if(S.acts.stb)return 'Je bent dit jaar al op staatsbezoek geweest.';S.acts.stb=1;P.pop=clamp(P.pop+3);hap(4);return `Een staatsbezoek aan ${pick(['Japan','Canada','Indonesië','Brazilië','Zweden','India'])}. Handelsmissie, banketten en heel veel handen schudden.`},'🌍'));
    if(hosTxt())R_('👑',`Wekelijks gesprek met ${hosTxt()}`,'Even bijpraten op het paleis',D('Paleis',()=>{use('pkg');hap(2);return pick(['Jullie praten over het weer, de formatie en een nieuwe hobby.',`${cap(hosTxt())} vraagt hoe het met je gaat. Echt.`,'Je krijgt thee uit een kopje van 200 jaar oud.'])},'👑'))}
  if(P.lvl==='burg'){R_('🔨','Raadsvergadering voorzitten','Orde houden',D('Voorzitten',()=>{const m=use('pvz');P.pop=clamp(P.pop+Math.round(2*m));return 'Je hamert drie keer. Eindelijk stilte.'},'🔨'));
    R_('🚨','Noodverordening','Bij onrust in de stad',D('Noodverordening',()=>{if(S.acts.nood)return 'Je hebt dit jaar al een noodverordening afgekondigd.';S.acts.nood=1;if(chance(.6)){P.pop=clamp(P.pop+4);return 'Je grijpt op tijd in bij rellen rond een voetbalwedstrijd. Rust keert terug.'}P.pop=clamp(P.pop-5);return 'Mensen vinden dat je overdrijft. Er komt een demonstratie tegen jou.'},'🚨'))}}
function projMenu(){const P=S.pol;const ps=[['🏘️','500 nieuwe woningen','Hard nodig, lange adem',.55,7],['🏊','Een nieuw zwembad','Leuk, maar duur',.6,5],['🌉','Een fietsbrug over de rivier','Prestigeproject',.5,8],['🌳','Een nieuw stadspark','Bijna iedereen blij',.75,4]];
  modal({title:'Groot project',em:'🏗️',cat:'Wethouder',text:'Welk project zet jij op de kaart?',choices:opts(ps.map(([e,t,s,ch,g])=>({t:`${e} ${t}`,s,on:()=>{closeModal();doAct('Project',()=>{S.acts.proj=1;if(chance(ch+(P.steun-50)/250)){P.pop=clamp(P.pop+g);P.steun=clamp(P.steun+3);MS(`Opende als wethouder: ${t.toLowerCase()}`,1);return `${t}: het project slaagt! Op de opening knip jij het lint.`}P.pop=clamp(P.pop-g);P.risk=(P.risk||0)+5;return `${t}: het project loopt uit. Twee jaar vertraging en miljoenen duurder. De raad wil uitleg.`},true,e)}})))})}
function ministerraad(){const P=S.pol;const pair=[pick(MPORT),pick(MPORT)];if(pair[0]===pair[1])pair[1]='Financiën';const iss=pick(['geld voor extra agenten','een nieuwe snelweg','meer geld voor de zorg','een verbod op vuurwerk','subsidie voor zonnepanelen']);
  modal({title:'Ministerraad',em:'🏛️',cat:PT().mp,text:`De minister van ${pair[0]} wil ${iss}. De minister van ${pair[1]} is fel tegen. Jij hakt de knoop door.`,choices:opts([
   {t:`Kant van ${pair[0]} kiezen`,on:()=>{closeModal();doAct('Ministerraad',()=>{S.acts.mr=1;P.pop=clamp(P.pop+2);P.steun=clamp(P.steun-2);return `Je kiest voor ${iss}. De minister van ${pair[1]} slaat de deur dicht.`},true,'🏛️')}},
   {t:`Kant van ${pair[1]} kiezen`,on:()=>{closeModal();doAct('Ministerraad',()=>{S.acts.mr=1;P.steun=clamp(P.steun+2);return 'Het voorstel gaat van tafel. Het kabinet blijft bij elkaar.'},true,'🏛️')}},
   {t:'Een compromis zoeken',on:()=>{closeModal();doAct('Ministerraad',()=>{S.acts.mr=1;if(chance(.6)){P.pop=clamp(P.pop+1);P.steun=clamp(P.steun+3);return 'Na vier uur vergaderen ligt er een compromis. Iedereen een beetje blij.'}P.pop=clamp(P.pop-3);return 'Het compromis lekt uit en wordt in de media afgebrand.'},true,'🏛️')}}])})}
/* ---------- extra gebeurtenissen ---------- */
const polIn=(...l)=>()=>S.pol&&!inJail()&&(!l.length||l.includes(S.pol.lvl));
const polPE=k=>()=>{const p=S.pol&&(S.pol.ppl||[]).find(x=>x.kind===k);return p?{id:p.id}:null};
const PPL=c=>polP(c.id)||{first:'Iemand',rel:50};
function polEvents(){const P=S.pol;if(!P||inJail()||P.lvl==='dict')return;polPpl();const n=P.lvl==='lid'?(chance(.45)?1:0):1+(chance(.5)?1:0);
  for(let i=0;i<n;i++){const pool=[];let tot=0;for(const id in EV){const e=EV[id];if(!e.pe)continue;if(e.nl&&S.p.country!=='NL')continue;if(e.parl&&presL())continue;if(e.us&&!isPres())continue;if(Q.some(q=>q.id===id))continue;const last=S.evLast[id];if(last!=null&&S.m-last<(e.cd||3)*12)continue;if(e.c&&!safe(()=>e.c()))continue;const w=typeof e.w==='function'?e.w():(e.w||1);if(w<=0)continue;pool.push([id,w]);tot+=w}
    if(!pool.length)return;let r=R()*tot;for(const [id,w] of pool){r-=w;if(r<=0){const e=EV[id];let c={};if(e.ctx){c=safe(()=>e.ctx());if(!c)break}S.evLast[id]=S.m;Q.push({id,c});break}}}}
// bestaande fase 1-events ook via deze route laten lopen
for(const k of ['pol_fractie','pol_talkshow','pol_burger','pol_tweet','pol_crisis'])if(EV[k]){EV[k].pe=1;EV[k].sys=1}
const PE=(id,o)=>E(id,Object.assign({sys:1,pe:1},o));
PE('pol_lobbycadeau',{c:polIn('kamer','min','mp','weth','burg','ep'),cd:3,ctx:polPE('lobby'),t:'Een cadeautje',x:c=>`${PPL(c).first} van ${PPL(c).co||'een lobbyclub'} nodigt je uit voor een weekend in een luxehotel in de Alpen. "Puur netwerken."`,ch:[
 ['⛷️ Gezellig, ik ga mee',c=>{S.pol.risk=(S.pol.risk||0)+15;hap(6);PPL(c).rel=clamp(PPL(c).rel+10);return 'Je skiet, je eet kreeft en je praat over regelgeving. Niemand hoeft het te weten.'}],
 ['🙅 Nee, dank je',c=>{kar(2);PPL(c).rel=clamp(PPL(c).rel-6);return 'Je slaat het netjes af en meldt het bij de integriteitscommissie.'}]]});
PE('pol_onderzoek',{c:()=>polIn()()&&(S.pol.risk||0)>=20,w:()=>(S.pol.risk||0)/15,cd:2,t:'Onderzoeksjournalisten',x:()=>`Journalisten hebben je declaraties en contacten met lobbyisten uitgeplozen. Morgen komt het verhaal naar buiten.`,ch:[
 ['🙏 Alles opbiechten',()=>{const P=S.pol;P.pop=clamp(P.pop-10);P.steun=clamp(P.steun-8);P.risk=Math.round((P.risk||0)*.3);return 'Je biedt je excuses aan en betaalt alles terug. Pijnlijk, maar je overleeft het.'}],
 ['🤥 Ontkennen',()=>{const P=S.pol;if(chance(.65-(P.risk||0)/250)){P.risk=Math.round((P.risk||0)*.7);return 'Het bewijs is te dun. Het verhaal waait over.'}P.pop=clamp(P.pop-20);P.steun=clamp(P.steun-25);P.risk=0;if(S.pex)S.pex.enq=year()+ri(1,3);if(P.lvl!=='lid')loseOffice(`Na een week vol onthullingen moet je aftreden als ${polTl(P.lvl)}.`);MS('Moest aftreden na een schandaal',1);if(chance(.25))Q.push({id:'s_trial',c:{w:'Corruptie',m:ri(6,24)}});return 'Er komen meer bewijzen boven. Je moet aftreden.'}],
 ['🚪 Zelf aftreden',()=>{const P=S.pol;P.pop=clamp(P.pop-6);P.risk=0;if(P.lvl!=='lid')loseOffice(`Je treedt af als ${polTl(P.lvl)} om de partij te beschermen.`);P.steun=clamp(P.steun+5);return 'Je stapt op. De partij waardeert dat je de eer aan jezelf houdt.'}]]});
PE('pol_coalitie',{c:polIn('min','mp'),cd:3,t:'Coalitie in de knel',x:()=>{const W=S.pw;const o=W.gov.filter(k=>k!==S.pol.party);return `${PTY(pick(o.length?o:W.gov)).n} dreigt uit het kabinet te stappen over ${pick(['de stikstofregels','de pensioenen','het asielbeleid','de begroting','een nieuwe snelweg'])}.`},ch:[
 ['🤝 Toegeven',()=>{const P=S.pol;P.steun=clamp(P.steun-7);return 'Je geeft toe. Het kabinet blijft zitten, maar je eigen partij morrt.'}],
 ['✊ Voet bij stuk houden',()=>{const P=S.pol;if(chance(.55)){P.steun=clamp(P.steun+6);P.pop=clamp(P.pop+3);return 'Ze bluffen. Na een nacht onderhandelen blijft iedereen zitten.'}return cabFall()}]]});
PE('pol_wantrouwen',{parl:1,c:()=>polIn('min')()&&S.pol.pop<45,cd:3,t:'Motie van wantrouwen',x:()=>`De oppositie dient een motie van wantrouwen tegen je in. ${pick(['Een fout op je ministerie heeft mensen geld gekost.','Je hebt de Kamer verkeerd geïnformeerd, vinden ze.','Je beleid loopt volledig vast.'])}`,ch:[
 ['🎤 Je verdedigen',()=>({go:()=>mgDebate('Je laatste kans',sc=>{const P=S.pol;const ok=chance(clamp(.25+sc*.6+(S.pw.gov.includes(P.party)?.15:0),.05,.95));if(ok){P.pop=clamp(P.pop+4);S.flags.overleefd=1;const t='De coalitie houdt je overeind. De motie haalt het niet.';L(t);result('Motie verworpen',t,'',processQ,{em:'🛡️',cat:'Politiek'})}else{loseOffice('De motie van wantrouwen wordt aangenomen. Je moet aftreden als minister.');P.pop=clamp(P.pop-8);MS('Viel door een motie van wantrouwen',1);result('Afgetreden','Een meerderheid zegt het vertrouwen in je op. Je levert je ministerspost in.','',processQ,{em:'📉',cat:'Politiek'})}})})],
 ['🚪 Aftreden',()=>{loseOffice('Je treedt af als minister.');S.pol.steun=clamp(S.pol.steun+3);return 'Je houdt de eer aan jezelf.'}]]});
PE('pol_lek',{c:()=>polIn('raad','kamer','weth','min')(),ctx:polPE('fractie'),cd:4,t:'Uitgelekt',x:c=>`Jouw plan staat ineens in de krant, voordat je het zelf kon presenteren. Alles wijst naar ${PPL(c).first}.`,ch:[
 ['😠 Confronteren',c=>{PPL(c).rel=clamp(PPL(c).rel-15);if(chance(.5))return `${PPL(c).first} geeft het toe en biedt excuses aan.`;return `${PPL(c).first} ontkent alles en is nu woest op jou.`}],
 ['🤐 Er niets van zeggen',c=>{S.pol.pop=clamp(S.pol.pop+1);return 'Je laat het gaan. Het plan krijgt in elk geval aandacht.'}]]});
PE('pol_rivaalaanval',{c:polIn(),ctx:polPE('rivaal'),cd:3,t:'Messen geslepen',x:c=>`${PPL(c).first} zegt op een ledenavond dat jij "te veel praat en te weinig doet".`,ch:[
 ['🗯️ Hard terugslaan',c=>{PPL(c).rel=clamp(PPL(c).rel-12);if(chance(.5)){S.pol.steun=clamp(S.pol.steun+4);return 'Je reactie is scherp en raak. De zaal klapt.'}S.pol.steun=clamp(S.pol.steun-5);return 'Het wordt een moddergevecht. Jullie verliezen allebei.'}],
 ['😌 Er boven staan',c=>{S.pol.steun=clamp(S.pol.steun+2);return 'Je reageert niet. Wie kaatst moet de bal verwachten.'}]]});
PE('pol_leidervraag',{c:()=>polIn()()&&!S.pol.lead,ctx:polPE('leider'),cd:3,t:'Een gunst',x:c=>`${PPL(c).first} vraagt je om in het openbaar een impopulair standpunt van de partij te verdedigen.`,ch:[
 ['🫡 Doen',c=>{PPL(c).rel=clamp(PPL(c).rel+10);S.pol.steun=clamp(S.pol.steun+5);S.pol.pop=clamp(S.pol.pop-3);return 'Je verdedigt het. De partijtop zal het niet vergeten.'}],
 ['🙅 Weigeren',c=>{PPL(c).rel=clamp(PPL(c).rel-10);S.pol.steun=clamp(S.pol.steun-4);return '"Dan zoek ik wel iemand anders." Het klinkt ijzig.'}]]});
PE('pol_prinsjesdag',{nl:1,c:polIn('min','mp','kamer','ek'),cd:2,t:'Prinsjesdag',x:'Het is Prinsjesdag. Iedereen trekt zijn mooiste kleren aan. Wat zet jij op?',ch:[
 ['🎩 Een gigantische hoed',()=>{S.pol.pop=clamp(S.pol.pop+ri(1,4));hap(3);return 'Je hoed haalt alle kranten. "Het hoedje van het jaar."'}],
 ['👔 Gewoon een net pak',()=>{hap(1);return 'Saai maar veilig.'}],
 ['🌈 Iets met een boodschap',()=>{if(chance(.6)){S.pol.pop=clamp(S.pol.pop+3);return 'Je outfit met een boodschap wordt veel gedeeld.'}S.pol.pop=clamp(S.pol.pop-2);return 'Mensen vinden het effectbejag.'}]]});
PE('pol_bedreiging',{c:()=>polIn()()&&S.pol.pop>=45&&S.pol.lvl!=='lid',cd:5,t:'Bedreigd',x:'Je krijgt een dreigbrief thuis. De politie neemt het serieus.',ch:[
 ['🛡️ Beveiliging accepteren',()=>{hap(-6);return 'Er staat een tijdje een agent voor je deur. Je went er nooit echt aan.'}],
 ['📢 Er openlijk over praten',()=>{hap(-3);S.pol.pop=clamp(S.pol.pop+4);return 'Je vertelt erover in een talkshow. Je krijgt veel steun.'}]]});
PE('pol_congres',{c:polIn(),cd:3,t:'Partijcongres',x:()=>`Het jaarlijkse congres van ${PTY(S.pol.party).n}. Je mag een kwartier spreken.`,ch:[
 ['🔥 Een vurige speech',()=>{if(chance(.45+S.sk.sociaal/250)){S.pol.steun=clamp(S.pol.steun+8);return 'Staande ovatie! Mensen scanderen je naam.'}S.pol.steun=clamp(S.pol.steun-2);return 'Je verspreekt je twee keer. Lauw applaus.'}],
 ['📊 Een inhoudelijk verhaal',()=>{S.pol.steun=clamp(S.pol.steun+3);return 'Degelijk. De denktank van de partij is enthousiast.'}],
 ['🍻 Vooral netwerken in de wandelgangen',()=>{S.pol.steun=clamp(S.pol.steun+2);sk('sociaal',2);return 'Je spreekt iedereen die ertoe doet.'}]]});
PE('pol_windmolens',{c:polIn('raad','weth','burg'),cd:4,t:'Windmolens',x:()=>`Er komen misschien windmolens aan de rand van ${S.p.city}. De buurt is in rep en roer.`,ch:[
 ['🌬️ Voor',()=>{const g=PTY(S.pol.party).pc<45;S.pol.steun=clamp(S.pol.steun+(g?4:-4));S.pol.pop=clamp(S.pol.pop-2);return 'De molens komen er. De omwonenden zijn boos, je partij '+(g?'is blij.':'snapt er niets van.')}],
 ['🚫 Tegen',()=>{const g=PTY(S.pol.party).pc>=45;S.pol.steun=clamp(S.pol.steun+(g?4:-4));S.pol.pop=clamp(S.pol.pop+3);return 'Het plan sneuvelt. De buurt hangt vlaggen uit.'}]]});
PE('pol_ministeriefout',{c:polIn('min'),ctx:polPE('amb'),cd:3,t:'Fout op je ministerie',x:c=>`Op je ministerie is iets flink misgegaan: ${pick(['duizenden mensen kregen een verkeerde brief','een ICT-project is 80 miljoen duurder','er lekten persoonsgegevens'])}. ${PPL(c).first} wist het al maanden.`,ch:[
 ['🧍 Zelf de verantwoordelijkheid nemen',()=>{S.pol.pop=clamp(S.pol.pop+1);S.pol.steun=clamp(S.pol.steun+2);return 'Je staat voor de camera\'s en zegt: "Dit is mijn verantwoordelijkheid." Mensen waarderen het.'}],
 ['👉 De ambtenaar de schuld geven',c=>{PPL(c).rel=clamp(PPL(c).rel-25);if(chance(.5)){return 'Het werkt, voorlopig.'}S.pol.pop=clamp(S.pol.pop-6);return 'De Kamer pikt het niet. "Een minister verschuilt zich niet achter ambtenaren."'}]]});
PE('pol_koningsdag',{nl:1,c:polIn('burg'),cd:4,t:'Koningsdag',x:()=>`De koninklijke familie komt op Koningsdag naar ${S.p.city}! Jij bent de gastheer.`,ch:[
 ['👑 Groots aanpakken',()=>{S.pol.pop=clamp(S.pol.pop+6);hap(6);return 'Alles loopt op rolletjes. De koning doet zelfs mee met zaklopen.'}],
 ['🙂 Sober en gezellig',()=>{S.pol.pop=clamp(S.pol.pop+3);return 'Een echte volksfeestdag. Iedereen is tevreden.'}]]});
function cabFall(){const W=S.pw,P=S.pol;if(presL()){prGov(W);if(P)P.pop=clamp(P.pop-4);return `Een partij stapt uit de coalitie. ${cabTxt()}`}W.nextTK=Math.min(W.nextTK,year()+1);W.fell=year();L('Het kabinet is gevallen. Er komen vervroegde verkiezingen.','bad big');MS('Maakte een kabinetsval mee',1);if(P&&P.lvl==='mp')P.pop=clamp(P.pop-6);return 'Het lukt niet meer. Het kabinet valt! Volgend jaar zijn er vervroegde verkiezingen. Tot die tijd regeer je demissionair.'}
Object.assign(EVMETA,{pol_lobbycadeau:['Politiek','🎁'],pol_onderzoek:['Politiek','🔎'],pol_coalitie:['Politiek','💥'],pol_wantrouwen:['Politiek','📉'],pol_lek:['Politiek','💧'],pol_rivaalaanval:['Politiek','🔪'],pol_leidervraag:['Politiek','🤝'],pol_prinsjesdag:['Politiek','🎩'],pol_bedreiging:['Politiek','✉️'],pol_congres:['Politiek','🎪'],pol_windmolens:['Politiek','🌬️'],pol_ministeriefout:['Politiek','🗂️'],pol_koningsdag:['Politiek','👑']});
function lawsCard(el){card(el,`<h3>Wetten nu</h3><span class="muted">Dit geldt nu in het spel</span>${kv(Object.keys(LAWS).map(k=>[`${LAWS[k].em} ${LAWS[k].t}`,he(LAWS[k].f(law(k)))]))}`)}

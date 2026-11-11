/* ================= ROOD STAAN (verbeterplan 1.5, gekozen: streng) =================
   - Rente: 12% per jaar op een negatief saldo (vanaf 18 jaar), zie monthTick in engine.js.
   - Elk jaar een logregel zolang je rood staat, met de grens.
   - Grens hangt af van inkomen en bezit (debtLimit). Daarboven komt de gebeurtenis "Schuldeisers":
     bezit verkopen, lening bij de bank, schuldsanering (3 jaar) of negeren.
   - Twee keer negeren of een mislukte schuldsanering = faillissement: alles wordt verkocht,
     de rest wordt afgeschreven, 10 jaar geen krediet en een flinke klap voor je geluk.
   - Negatieve kredietregistratie (S.flags.bkrTot): geen leningen en geen hypotheek. */
const RED_RATE=.12;
function bkr(){return !!S.wsnp||year()<(S.flags.bkrTot||0)}
function bkrWhy(){return S.wsnp?'Niet tijdens een schuldsanering':`Negatieve kredietregistratie tot ${S.flags.bkrTot}`}
function debtLimit(){const c=S.cpi||1;const inc=incomeParts().reduce((x,[,v])=>x+v,0);const assets=Math.max(0,netWorth()-S.money);return Math.round(Math.max(5000*c,inc*.3+assets*.1))}
function loanCapNow(){return Math.round(Math.max(0,salary()*.8+Math.max(0,netWorth())*.3-S.loan))}
// wat je bezit en kunt verkopen (na aftrek van hypotheek), zonder bedrijven
function sellableVal(){let v=0;for(const k in S.inv)v+=Math.max(0,S.inv[k]||0);for(const x of S.items||[])v+=x.value*.7;for(const c of S.cars)v+=c.value*.7;
  for(const p of S.props)v+=Math.max(0,p.value*.97-p.mort);for(const p of S.re||[])v+=Math.max(0,p.value*.97-p.mort);return Math.round(v)}
// verkoopt bezit tot je saldo weer niet negatief is (all=true: alles). Geeft een lijstje terug van wat er weg is.
function sellAssets(all){const out=[];const done=()=>!all&&S.money>=0;
  if(typeof stkSync==='function')stkSync();
  let inv=0;for(const id of Object.keys(S.stk||{})){inv+=divest(id,1e15)}for(const k of Object.keys(S.inv)){if((S.inv[k]||0)>0&&k!=='aandelen'&&k!=='crypto')inv+=divest(k,S.inv[k])}
  if(inv>=1){cash(Math.round(inv));out.push(`beleggingen (${fmt(inv)})`)}
  const sellThing=(list,label,f)=>{for(const x of list.slice().sort((a,b)=>b.value-a.value)){if(done())return;const v=Math.round(x.value*f);cash(v);out.push(`${label(x)} (${fmt(v)})`);list.splice(list.indexOf(x),1)}};
  if(!done())sellThing(S.items||[],x=>x.name||'bezit',.7);
  if(!done())sellThing(S.cars,x=>x.name||'auto',.7);
  const sellProp_=(p,list,home)=>{const get=Math.round(p.value*.97-p.mort);if(get<0)S.loan+=-get;else cash(get);list.splice(list.indexOf(p),1);out.push(`${(p.name||'pand').toLowerCase()} aan de ${(p.addr||'').split(',')[0]} (${fmt(Math.max(0,get))})`);
    if(home)S.home={k:'huur',name:'Appartement',rent:Math.round(14000*(S.cpi||1))}};
  for(const p of (S.re||[]).slice()){if(done())break;sellProp_(p,S.re,false)}
  for(const p of S.props.filter(p=>S.home.pid!==p.id)){if(done())break;sellProp_(p,S.props,false)}
  for(const p of S.props.filter(p=>S.home.pid===p.id)){if(done())break;sellProp_(p,S.props,true)}
  return out}
function bankrupt(why){S.flags.bg=0;const sold=sellAssets(true);const rest=Math.max(0,-S.money)+S.loan;S.money=0;S.loan=0;S.wsnp=null;S.flags.schuldN=0;
  S.flags.bkrTot=year()+10;S.flags.failliet=(S.flags.failliet||0)+1;hap(-25);MS('Ging failliet',0);
  return `${why} Je bent failliet verklaard.${sold.length?` Alles wordt verkocht: ${sold.join(', ')}.`:''}${rest?` De resterende schuld van ${fmt(rest)} wordt afgeschreven.`:''} Tien jaar lang krijg je geen lening of hypotheek meer.`}
function startWsnp(){const d=-S.money;S.flags.bg=0;S.wsnp={left:3,debt:d,paid:0};S.money=0;S.flags.wsnpY=year();S.flags.schuldN=0;hap(-12);MS('Begon aan een schuldsanering',1);
  return `De rechter zet je in de schuldsanering. Drie jaar lang leef je van ${fmt(3000*(S.cpi||1))} per jaar leefgeld en gaat alles daarboven naar je schuldeisers. Lenen kan niet. Houd je het vol, dan wordt de rest van je ${fmt(d)} schuld kwijtgescholden.`}
// één keer per jaar, op je verjaardag (vanaf 18)
function debtYear(){if(!S.alive||ageY()<18)return;const c=S.cpi||1;
  if(S.wsnp){const W=S.wsnp,keep=Math.round(3000*c);
    if(S.money<0){if(-S.money>debtLimit()){S.wsnp=null;Q.push({id:'s_failliet',c:{why:`Je hebt tijdens de schuldsanering nieuwe schulden gemaakt (${fmt(-S.money)}). De rechter stopt de regeling.`}});return}
      W.debt+=-S.money;S.money=0}
    if(S.money>keep){const af=Math.round(S.money-keep);cash(-af);W.paid+=af}
    W.left--;
    if(W.left<=0){S.wsnp=null;S.flags.bkrTot=year()+5;hap(10);MS('Rondde een schuldsanering af',1);
      L(`Je schuldsanering is klaar. ${W.paid>=1?`Je hebt ${fmt(W.paid)} afgelost. `:''}De rest van je schuld (${fmt(Math.max(0,W.debt-W.paid))}) wordt kwijtgescholden. Je kunt opnieuw beginnen, al blijf je nog vijf jaar geregistreerd bij de bank.`,'good big')}
    else{hap(-3);L(`Schuldsanering: nog ${W.left} jaar te gaan.${W.paid>=1?` Tot nu toe ${fmt(W.paid)} afgelost.`:''}`,'sys')}
    return}
  if(S.money>=0){S.flags.schuldN=0;return}
  const lim=debtLimit(),red=-S.money;
  // dure vaste lasten die je niet kunt betalen, stoppen vanzelf
  if(red>lim&&S.flags.bg){S.flags.bg=0;L('Je kunt je bodyguard niet meer betalen. Hij zoekt een andere klant.','bad')}
  if(red<=lim){L(`Je staat ${fmt(red)} rood. De bank rekent ${Math.round(RED_RATE*100)}% rente per jaar. Boven ${fmt(lim)} komen de schuldeisers.`,'sys');return}
  if((S.flags.schuldN||0)>=2){Q.push({id:'s_failliet',c:{why:'Je schuldeisers zijn naar de rechter gestapt.'}});return}
  // hooguit eens per twee jaar een pop-up; daartussen een logregel (tenzij de schuld intussen meer dan verdubbeld is)
  if(S.flags.schuldY&&year()-S.flags.schuldY<2&&red<=2*lim){L(`Je staat ${fmt(red)} rood, boven de grens van ${fmt(lim)}. Er komen steeds meer aanmaningen.`,'bad');return}
  if(!Q.some(q=>q.id==='s_schuld')){S.flags.schuldY=year();Q.push({id:'s_schuld',c:{}})}}
E('s_schuld',{sys:1,t:'Schuldeisers',x:()=>{const lim=debtLimit();return `Je staat ${fmt(-S.money)} rood, meer dan de bank toestaat (${fmt(lim)}). Er liggen aanmaningen op de mat en de deurwaarder belt.${S.flags.schuldN?' Dit is de laatste waarschuwing.':''} Wat doe je?`},ch:[
  ['🏷️ Bezit verkopen',()=>{const s=sellAssets(false);S.flags.schuldN=0;hap(-4);return s.length?`Je verkoopt ${s.join(', ')}.${S.money<0?` Je staat nog ${fmt(-S.money)} rood.`:' Je staat weer in de plus.'}`:'Er valt niets te verkopen.'},()=>sellableVal()>0],
  ['🏦 Lening bij de bank',()=>{const d=-S.money;S.loan+=d;S.money=0;S.flags.schuldN=0;return `De bank zet je ${fmt(d)} schuld om in een lening tegen 6% rente. Je betaalt hem elke maand af.`},()=>!bkr()&&loanCapNow()>=-S.money],
  ['📉 Schuldsanering (3 jaar)',()=>startWsnp(),()=>!(S.flags.wsnpY&&year()-S.flags.wsnpY<10)],
  ['🙈 Negeren',()=>{S.flags.schuldN=(S.flags.schuldN||0)+1;hap(-3);return S.flags.schuldN>=2?'Je legt de brieven op de stapel. Volgend jaar stappen je schuldeisers naar de rechter.':'Je stopt de brieven ongeopend in een la. Volgend jaar komen ze terug, strenger.'}]]});
E('s_failliet',{sys:1,t:'Failliet',f:c=>bankrupt(c.why||'')});
Object.assign(EVMETA,{s_schuld:['Geld','📬'],s_failliet:['Geld','⚖️']});

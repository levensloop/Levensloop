/* ================= GEKOZEN PRESIDENT naast een parlement (FR, TR, BR, MX, ID) ================= */
function prNextY(){const p=psys().pres;let y=year()+1;while((y-p.y0)%p.cyc!==0)y++;return y}
function prInit(W){const p=psys().pres;W.nextPR=prNextY();if(p.same)W.nextTK=W.nextPR;else if(S.p.country==='MX'){let y=year()+1;while(y%3!==0)y++;W.nextTK=y}
  const inc=PTY(p.inc)?p.inc:Object.keys(W.sh).sort((a,b)=>W.sh[b]-W.sh[a])[0];W.pm={n:lnm(),p:inc,y0:W.nextPR-p.cyc,t:p.lim>1&&chance(.5)?2:1};prGov(W)}
// de regering: de partij van de president plus partners in het parlement
function prGov(W){const pm=W.pm;autoForm(W.seats,NS(),pm.p);W.pm=pm;if(psys().pres.prem){const maj=seatSum(W.gov,W.seats)>=NEED();const big=Object.keys(W.seats).sort((a,b)=>W.seats[b]-W.seats[a])[0];
  W.prem=maj||big===pm.p?{n:lnm(),p:pm.p,co:0}:{n:W.lead[big]||lnm(),p:big,co:1}}}
const prTxt=()=>{const W=S.pw;if(!W||!W.pm)return '';return `President: ${W.pm.n===myName()?'jij':W.pm.n} (${PTY(W.pm.p)?PTY(W.pm.p).k:'?'})${W.prem?` · premier: ${W.prem.n===myName()?'jij':W.prem.n}${W.prem.co?' (cohabitation)':''}`:''}`};
// presidentsverkiezing (jaarlijks gecontroleerd vanuit polYear)
function prYear(a){const W=S.pw,P=S.pol,y=year();if(!presL()||!W.nextPR||y<W.nextPR)return;const p=psys().pres;W.nextPR+=p.cyc;
  if(P&&P.lvl==='mp'&&W.pm&&W.pm.n===myName()){if((P.terms||1)>=p.lim||P.noRun)P.lame=1;else P.cand.pres=1}
  if(a>=18&&!inJail())Q.push({id:'pr_stem'});Q.push({id:'pr_pres'});if(p.same)W.nextTK=y}
function prMyS(){const P=S.pol,W=S.pw;let s=18+P.pop*.45+P.steun*.1+(POLO[P.lvl].r||0)*2.5+Math.max(0,S.fame-40)*.08+Math.min(8,Math.log10(1+(P.kas||0)/(20000*(S.cpi||1)))*3)+(W.sh[P.party]||0)*.5;
  if(P.lvl==='mp')s+=6+prEco();return s}
const prEco=()=>({hoog:4,groei:2,stabiel:0,recessie:-5,depressie:-9,hyper:-8})[ecoW().ph]||0;
function prCands(){const W=S.pw,P=S.pol,p=psys().pres;const me=P&&P.cand.pres&&(P.lead||P.steun>=70||P.lvl==='mp'||P.party==='own')&&ageY()>=p.age;
  const ids=Object.keys(W.sh).filter(k=>k!=='own'||me).sort((a,b)=>W.sh[b]-W.sh[a]).slice(0,5);if(me&&!ids.includes(P.party))ids.push(P.party);
  return {me:!!me,C:ids.map(k=>{const isMe=me&&P.party===k;const inc=!isMe&&W.pm&&W.pm.p===k&&W.pm.n!==myName()&&(W.pm.t||1)<p.lim;
    const n=isMe?myName():inc?W.pm.n:(k==='own'?myName():W.lead[k]||lnm());return {k,n,me:isMe,inc,s:isMe?prMyS():(W.sh[k]||1)*1.6+ri(-4,8)+(inc?5+prEco():0)}})}}
function prShares(C){const w=C.map(c=>Math.exp(c.s/9));const t=w.reduce((a,b)=>a+b,0);return C.map((c,i)=>Math.round(w[i]/t*1000)/10)}
function prApply(win,pct){const W=S.pw,P=S.pol,y=year(),p=psys().pres;const re=W.pm&&W.pm.n===win.n;
  W.pm={n:win.n,p:win.k,y0:y,t:re?(W.pm.t||1)+1:1};const out=[];
  if(P){if(win.me){if(P.lvl==='mp'){P.terms=(P.terms||1)+1;if(S.pex)S.pex.pmN=(S.pex.pmN||0)+1;MS(`Werd herkozen als president van ${C().n}`,3)}else{setOffice('mp');P.terms=1;P.cand.tk=0;P.cand.gr=0;P.cand.ek=0;P.cand.ep=0;MS(`Werd gekozen tot president van ${C().n}`,3)}P.pop=clamp(Math.max(P.pop,55));hap(20);S.fame=clamp(S.fame+10);S.flags.wpres=1}
    else if(P.lvl==='mp'){if(S.pex)S.pex.expres=1;loseOffice(P.lame?`Je termijn zit erop. ${win.n} volgt je op als president.`:`Je verliest het presidentschap aan ${win.n}.`)}
    else if(P.lvl==='min'&&!re){loseOffice('Er komt een nieuwe president. Je ministerschap zit erop.')}
    P.cand.pres=0;P.lame=0;P.kas=Math.round((P.kas||0)*.2)}
  prGov(W);if(P&&!win.me&&W.gov.includes(P.party)&&P.lvl!=='mp'&&!re)ministerOffer();
  return out.join(' ')}
function prFlow(done){const W=S.pw,P=S.pol,p=psys().pres;const {C:Cs}=prCands();const me=Cs.find(c=>c.me);const cp=S.cpi||1;
  const tbl=rows=>`<div class="plist">${rows.map(r=>`<div class="prow${r.me?' gov':''}"><span>${PTY(r.k)?PTY(r.k).em:'👤'}</span><b>${he(r.n)} <small class="muted">${PTY(r.k)?PTY(r.k).k:''}</small></b><em>${r.v}</em></div>`).join('')}</div>`;
  const R1=()=>{const sh=prShares(Cs);Cs.forEach((c,i)=>c.r1=sh[i]);const srt=Cs.slice().sort((a,b)=>b.r1-a.r1);const top=srt[0];
    const win1=p.rounds===1||top.r1>50;const txt=win1?`${top.me?'Jij wint':top.n+' wint'} in de eerste ronde met ${String(top.r1).replace('.',',')}%.`:`Niemand haalt de helft. ${srt[0].me?'Jij':srt[0].n} en ${srt[1].me?'jij':srt[1].n} gaan door naar de tweede ronde.`;
    modal({title:p.rounds===1?'De uitslag':'De eerste ronde',em:'🗳️',cat:'Presidentsverkiezingen',text:txt,html:tbl(srt.map(c=>({k:c.k,n:c.n,me:c.me,v:`${String(c.r1).replace('.',',')}%`}))),choices:[{t:'Verder',cls:'go',on:()=>{closeModal();if(win1)return fin(top,top.r1);R2(srt[0],srt[1],srt.slice(2))}}]})};
  const R2=(a,b,out)=>{const meIn=a.me||b.me;
    const vote=()=>{const w1=Math.exp(a.s/8),w2=Math.exp(b.s/8);const pa=Math.round(clamp(w1/(w1+w2)*100+gauss()*2,8,92)*10)/10;const win=pa>50?a:b;const pct=pa>50?pa:Math.round((100-pa)*10)/10;
      modal({title:'De tweede ronde',em:'🗳️',cat:'Presidentsverkiezingen',text:`${win.me?'Jij wint':win.n+' wint'} de tweede ronde met ${String(pct).replace('.',',')}% van de stemmen.`,html:tbl([{k:a.k,n:a.n,me:a.me,v:`${String(pa).replace('.',',')}%`},{k:b.k,n:b.n,me:b.me,v:`${String(Math.round((100-pa)*10)/10).replace('.',',')}%`}]),choices:[{t:'Verder',cls:'go',on:()=>{closeModal();fin(win,pct)}}]})};
    if(!meIn){if(me&&out.includes(me)){const opp=[a,b];modal({title:'Je valt af',em:'😔',cat:'Presidentsverkiezingen',text:`Je haalt de tweede ronde niet. Spreek je steun uit voor een van de finalisten?`,choices:opts(opp.map(c=>({t:`🤝 ${c.n} (${PTY(c.k).k})`,s:PTY(c.k).lbl||'',on:()=>{closeModal();c.s+=me.s*.08;P.steun=clamp(P.steun+(Math.hypot(PTY(c.k).lr-PTY(P.party).lr,PTY(c.k).pc-PTY(P.party).pc)<30?4:-6));P.endorse=c.n;vote()}})).concat([{t:'🤐 Geen advies geven',cls:'ghost',on:()=>{closeModal();vote()}}]))});return}return vote()}
    const my=a.me?a:b,opp=a.me?b:a;const left=out.filter(c=>!c.me).sort((x,y)=>y.r1-x.r1).slice(0,3);
    modal({title:`Tweede ronde tegen ${opp.n}`,em:'🤝',cat:'Presidentsverkiezingen',text:`Twee weken tot de tweede ronde. Wiens steun probeer je te krijgen?`,choices:left.map(c=>{const d=Math.hypot(PTY(c.k).lr-PTY(my.k).lr,(PTY(c.k).pc-PTY(my.k).pc)*.8);return {t:`🤝 ${c.n} (${PTY(c.k).k}, ${String(c.r1).replace('.',',')}%)`,s:d<25?'Ligt dicht bij jou':d<45?'Valt over te praten':'Ver uit elkaar',on:()=>{closeModal();
        if(chance(clamp(1.05-d/60,.08,.92))){my.s+=c.r1*.25;P.steun=clamp(P.steun-Math.round(d/8));toast(`${c.n} steunt jou in de tweede ronde!`)}else{opp.s+=c.r1*.1;toast(`${c.n} weigert. Erger nog: een deel van de kiezers gaat naar ${opp.n}.`)}
        mgDebate('Het grote debat',sc=>{my.s+=(sc-.5)*12;vote()})}}}).concat([{t:'🎤 Geen deals, alleen het debat',on:()=>{closeModal();mgDebate('Het grote debat',sc=>{my.s+=(sc-.5)*12;vote()})}}])})};
  const fin=(win,pct)=>{const t=`${win.me?'Je hebt gewonnen! Je bent de nieuwe president van '+C().n+'.':win.n+' ('+PTY(win.k).n+') wordt president.'} ${prApply(win,pct)}`.trim();L(t,win.me?'good big':'');result(win.me?'President!':'De nieuwe president',t,'',done,{em:win.me?'🎉':'🏛️',cat:'Presidentsverkiezingen'})};
  // jouw campagne
  const fav=()=>Cs.filter(c=>!c.me).sort((a,b)=>b.s-a.s)[0];
  const camp=(n)=>{const f=fav();const kas=P.kas||0;const spend=Math.round(kas*.5);
    modal({title:n===0?'De campagne':'De laatste weken',em:'📣',cat:`Kandidaat voor het presidentschap`,text:n===0?`Jij doet mee namens ${PTY(P.party).n}. De favoriet in de peilingen is ${f.n} (${PTY(f.k).k}). Hoe voer je campagne?`:'De laatste weken voor de verkiezing. Waar zet je nog op in?',html:tbl(prShares(Cs).map((v,i)=>({k:Cs[i].k,n:Cs[i].n,me:Cs[i].me,v:`${String(v).replace('.',',')}%`})).sort((a,b)=>parseFloat(b.v)-parseFloat(a.v))),choices:[
      {t:'🎤 Het grote tv-debat',s:'Minigame',on:()=>{closeModal();mgDebate('Tv-debat',sc=>{me.s+=(sc-.5)*14;toast(sc>=.75?'Jij wint het debat!':sc>=.5?'Een degelijk debat.':'Dat ging niet goed.');n?R1():camp(1)})}},
      {t:'🚌 Het hele land rond',s:'Pleinen, markten en fabriekspoorten',on:()=>{closeModal();me.s+=3.5;P.pop=clamp(P.pop+2);n?R1():camp(1)}},
      {t:'📺 Een groot reclameoffensief',s:kas>0?`Kost ${fmt(spend)} uit je campagnekas`:'Je campagnekas is leeg',dis:!(kas>0),on:()=>{closeModal();P.kas-=spend;me.s+=Math.min(7,1.5*Math.log10(1+spend/(20000*cp)));n?R1():camp(1)}},
      {t:`🗡️ ${f.n} aanvallen`,s:'Kan ook jezelf raken',on:()=>{closeModal();if(chance(.6)){f.s-=ri(3,7);toast(`De aanval op ${f.n} komt hard aan.`)}else{me.s-=3;toast('Kiezers vinden het gemeen.')}n?R1():camp(1)}}]})};
  if(me)camp(0);else R1()}
E('pr_pres',{sys:1,need:()=>presL()&&!S.dict&&!(typeof occHere==='function'&&occHere()),t:'Presidentsverkiezingen',x:()=>{const {me,C:Cs}=prCands();const P=S.pol;return me?(P.lvl==='mp'?'Je bent kandidaat voor een nieuwe termijn.':`Je bent kandidaat voor het presidentschap van ${C().n}.`):`${C().n} kiest een nieuwe president. De kandidaten: ${Cs.slice(0,4).map(c=>c.n+' ('+PTY(c.k).k+')').join(', ')}.${P&&P.cand.pres?' Jouw partij heeft iemand anders genomineerd.':''}`},ch:[['🗳️ De verkiezingen volgen',()=>({go:()=>prFlow(processQ)})]]});
E('pr_stem',{sys:1,need:()=>presL()&&!S.dict,t:'Stemmen voor president',x:'Het is verkiezingsdag. Op wie stem je in de eerste ronde?',ch:[]});
Object.defineProperty(EV.pr_stem,'ch',{get(){if(!S.pw||!presL())return [['🛋️ Niet stemmen',()=>'']];const {C:Cs}=prCands();return Cs.map(c=>[`${PTY(c.k).em} ${c.me?'Op jezelf':c.n} (${PTY(c.k).k})`,()=>{S.pw.vote=c.k;return c.me?'Je stemt op jezelf.':`Je stemt op ${c.n}.`}]).concat([['🛋️ Niet stemmen',()=>'Je blijft thuis.']])}});
Object.assign(EVMETA,{pr_pres:['Verkiezingen','🏛️'],pr_stem:['Verkiezingen','🗳️']});
function prSheetRows(v,P,a){if(!presL())return;const W=S.pw,p=psys().pres;const yrs=W.nextPR;const age=a+(yrs-year());
  if(P.lvl==='mp'){row(v,{ic:P.noRun||(P.terms||1)>=p.lim?'🚪':'🔁',t:(P.terms||1)>=p.lim?'Geen nieuwe termijn mogelijk':P.noRun?'Je stelt je niet herkiesbaar':'Je stelt je herkiesbaar',s:(P.terms||1)>=p.lim?(p.lim===1?'De grondwet staat maar één termijn toe':'Je zit al je tweede termijn uit')+` · verkiezingen ${yrs}`:`Presidentsverkiezingen ${yrs} · tik om te wisselen`,dis:(P.terms||1)>=p.lim,on:()=>{P.noRun=P.noRun?0:1;refreshSheet()}});return}
  let why='';if(age<p.age)why=`Vanaf ${p.age} jaar`;else if(!(POLO[P.lvl].r>=3||P.pop>=45||S.fame>=55||P.lead))why='Je bent nog te onbekend';
  row(v,{ic:'🏛️',t:'Kandidaat voor het presidentschap',s:why||(P.cand.pres?`Verkiezingen ${yrs}${P.lead||P.steun>=70||P.party==='own'?'':' · je partij moet je nog nomineren (70% steun of partijleider)'}`:`Verkiezingen ${yrs} · ${p.rounds===2?'twee rondes':'één ronde'}, ${p.lim===1?'maar één termijn':'maximaal twee termijnen'}`),r:P.cand.pres?'✅':'',dis:!!why,on:()=>{P.cand.pres=P.cand.pres?0:1;if(P.cand.pres){P.pop=clamp(P.pop+2);L(`Je stelt je kandidaat voor het presidentschap van ${C().n}.`,'big')}refreshSheet()}})}

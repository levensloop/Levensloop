/* ================= DICTATOR: veroveringsoorlogen en een eigen rijk ================= */
const NATO=['NL','BE','DE','UK','US','CA','FR','IT','ES','TR'];
function cStr(c){const E_=ecoW();const stab=((E_.cs||{})[c]??60)/60;return Math.round((POPF[c]||1)*(NATO.includes(c)?2:1)*(.6+stab*.4)*10)/10}
function myPow(){const D=S.dict;const own=POPF[S.p.country]||1;const emp=(D.emp||[]).reduce((s,e)=>s+(POPF[e.c]||1)*.35,0);return Math.round((own+emp)*(D.army/50)*[.7,1,1.4][lawIdx('defb')]*(lawIdx('dienst')?1.3:1)*(D.kas<=0?.6:1)*10)/10}
const dWars=()=>S.dict.wars||(S.dict.wars=[]);const dEmp=()=>S.dict.emp||(S.dict.emp=[]);
const conquered=c=>!!(S.dict&&dEmp().some(e=>e.c===c));
function dictWarSec(el){const D=S.dict;const s=sec(el,'Oorlog en rijk');
  card(s,`<span class="muted">Militaire kracht: <b>${myPow()}</b>${lawIdx('dienst')?' · dienstplicht actief':''} · defensiebudget ${LAWS.defb.f(law('defb'))}</span>`);
  for(const w of dWars()){const t=w.str*(w.nato||1);row(s,{ic:'⚔️',t:`Oorlog met ${COUNTRIES[w.c].n}`,s:`Jaar ${w.y+1} · front ${w.front}% · ${S.acts['wo'+w.c]?S.acts['wo'+w.c]+'× aangevallen dit jaar · ':''}kost ±${Math.round(2+t*.8)} miljard per jaar${w.nato>1?' · de NAVO vecht mee':''}`,bar:{l:`Front ${COUNTRIES[w.c].n}`,v:w.front,c:barCol(w.front)},dots:true,on:()=>warMenu(w)})}
  if(dWars().length<3)row(s,{ic:'🎯',t:'Een land aanvallen',s:'Veroveren levert geld op, oorlog kost geld',dots:true,on:attackMenu});
  for(const e of dEmp())row(s,{ic:flag(e.c),t:`${COUNTRIES[e.c].n} (veroverd)`,s:`Sinds ${e.y} · schatting ${e.trib} miljard per jaar · onrust ${e.unr}%`,dots:true,on:()=>modal({title:COUNTRIES[e.c].n,em:flag(e.c),cat:'Jouw rijk',text:`Onrust: ${e.unr}%. Opbrengst: ${e.trib} miljard per jaar.`,choices:opts([
    {t:'🪖 Garnizoen versterken',s:'Kost 2 miljard, minder onrust',on:()=>{closeModal();doAct('Garnizoen',()=>{if(D.kas<2)return 'De staatskas is leeg.';D.kas-=2;e.unr=clamp(e.unr-20);return 'Extra troepen bezetten de steden. Het wordt stil, voor nu.'},true,'🪖')}},
    {t:'💰 Zwaarder belasten',s:'Meer geld, meer onrust',on:()=>{closeModal();doAct('Belasting',()=>{e.trib=Math.round(e.trib*1.4*10)/10;e.unr=clamp(e.unr+18);return 'De belastingen gaan omhoog. Er wordt gemord.'},true,'💰')}},
    {t:'🕊️ Onafhankelijkheid geven',s:'Minder internationale druk',on:()=>{closeModal();doAct('Onafhankelijkheid',()=>{S.dict.emp=dEmp().filter(x=>x!==e);D.intl=clamp(D.intl-12);delete ecoW().conq[e.c];return `${COUNTRIES[e.c].n} is weer vrij. De wereld is verrast.`},true,'🕊️')}}])})})}
function attackMenu(){const D=S.dict;const own=S.p.country;const list=Object.keys(COUNTRIES).filter(c=>c!==own&&!conquered(c)&&!dWars().some(w=>w.c===c)).sort((a,b)=>cStr(a)-cStr(b));const P=myPow();
  modal({title:'Welk land?',em:'🎯',cat:D.title,text:`Jouw militaire kracht: ${P}. Hoe sterker het doelwit, hoe duurder en riskanter.`,choices:opts(list.map(c=>{const st=cStr(c);const ch=P/(P+st);return {t:`${flag(c)} ${COUNTRIES[c].n}`,s:`Kracht ${st}${NATO.includes(c)?' · NAVO-lid':''} · ${ch>.6?'goede kans':ch>.45?'zwaar gevecht':ch>.3?'heel riskant':'kansloos'}`,on:()=>{closeModal();
    ask(`${COUNTRIES[c].n} aanvallen?`,`Een oorlog kost elk jaar miljarden en levens.${NATO.includes(c)?' Dit is een NAVO-land: de hele NAVO kan terugslaan.':''}`,'Aanvallen',()=>doAct('Oorlog',()=>{const w={c,y:0,front:40,str:st,nato:1,cas:0};dWars().push(w);D.intl=clamp(D.intl+(NATO.includes(c)?25:15));D.sup=clamp(D.sup+(chance(.5)?5:-5));if(typeof warW==='function')warW().ten=clamp(warW().ten+20);S.flags.agressor=1;MS(`Viel ${COUNTRIES[c].n} binnen`,2);ecoNews(`${C().n} valt ${COUNTRIES[c].n} binnen. De wereld veroordeelt de aanval.`,1);
      return `Om 04:00 uur steken jouw troepen de grens over. ${COUNTRIES[c].n} verdedigt zich.`},true,'⚔️'),'bad')}}}))})}
const opCost=(w,k)=>{const n=S.acts['wo'+w.c]||0;return Math.round([1,3,8][k]*Math.pow(1.5,n))};
function warMenu(w){const D=S.dict;const n=S.acts['wo'+w.c]||0;modal({title:`Oorlog met ${COUNTRIES[w.c].n}`,em:'⚔️',cat:D.title,text:`Front: ${w.front}%. Bij 100% is het land van jou. Gesneuveld: ${nf(w.cas)} militairen. Staatskas: ${D.kas} miljard.${n?` Je hebt dit jaar al ${n} ${n===1?'offensief':'offensieven'} gedaan: elk volgend offensief is duurder en je troepen raken vermoeid.`:''}`,choices:opts([
  {t:'🐢 Voorzichtig oprukken',s:`Kost ${opCost(w,0)} miljard · weinig verliezen, langzaam`,dis:D.kas<opCost(w,0),on:()=>{closeModal();dictOp(w,0)}},
  {t:'⚡ Groot offensief',s:`Kost ${opCost(w,1)} miljard · grote winst of zware verliezen`,dis:D.kas<opCost(w,1),on:()=>{closeModal();dictOp(w,1)}},
  {t:'☢️ Alles inzetten',s:`Kost ${opCost(w,2)} miljard · enorme internationale woede`,dis:D.kas<opCost(w,2),on:()=>{closeModal();dictOp(w,2)}},
  {t:'🤝 Vrede sluiten',s:w.front>=60?'Je dwingt herstelbetalingen af':'Een gelijkspel, of je betaalt zelf',on:()=>{closeModal();doAct('Vrede',()=>{S.dict.wars=dWars().filter(x=>x!==w);if(w.front>=60){const g=Math.round(w.str*3);D.kas+=g;D.sup=clamp(D.sup+6);return `${COUNTRIES[w.c].n} tekent. Je krijgt ${g} miljard aan herstelbetalingen.`}if(w.front>=35){D.sup=clamp(D.sup-4);return 'Een wapenstilstand. Niemand wint. Het volk vraagt zich af waar het allemaal voor was.'}const g=Math.min(D.kas,Math.round(w.str*2));D.kas-=g;D.sup=clamp(D.sup-12);return `Een vernederende vrede. Je betaalt ${g} miljard aan ${COUNTRIES[w.c].n}.`},true,'🤝')}}])})}
function dictOp(w,k){const D=S.dict;doAct('Offensief',()=>{const cost=opCost(w,k);if(D.kas<cost)return 'Daar is geen geld voor.';D.kas-=cost;const nOp=S.acts['wo'+w.c]||0;S.acts['wo'+w.c]=nOp+1;const tired=Math.pow(.85,nOp);const P=myPow(),St=w.str*w.nato;const base=(P/(P+St)-.5)*40;
  const d=Math.round((base*[.6,1.2,1.8][k]+[3,6,13][k])*tired+gauss()*[4,10,8][k]);if(nOp>=2)D.army=clamp(D.army-2);const cas=Math.round(ri(200,900)*[1,3,6][k]*(1+St/4));w.front=clamp(w.front+d);w.cas+=cas;
  if(k===2){D.intl=clamp(D.intl+20);kar(-10)}D.army=clamp(D.army+(d>0?2:-4));D.sup=clamp(D.sup+(d>5?3:d<-5?-6:-1));
  const r=d>8?`Een doorbraak! Het front schuift ${d}% op.`:d>0?`Langzame vooruitgang (+${d}%).`:`Het offensief loopt vast (${d}%).`;const t=`${r} Verliezen: ${nf(cas)} militairen.`;
  if(w.front>=100)return t+' '+conquer(w);return t},true,'⚔️')}
function conquer(w){const D=S.dict,E_=ecoW();S.dict.wars=dWars().filter(x=>x!==w);const loot=Math.round(w.str*8);const trib=Math.round(w.str*1.5*10)/10;D.kas+=loot;dEmp().push({c:w.c,y:year(),trib,unr:50});E_.conq=E_.conq||{};E_.conq[w.c]=S.p.last;
  D.intl=clamp(D.intl+10);D.sup=clamp(D.sup+8);S.flags.veroveraar=1;if(dEmp().length>=3)S.flags.wereldrijk=1;MS(`Veroverde ${COUNTRIES[w.c].n}`,3);ecoNews(`${COUNTRIES[w.c].n} is ingenomen door het regime van ${S.p.last}.`,1);
  return `${COUNTRIES[w.c].n} capituleert! De schatkist van het land is nu van jou: ${loot} miljard. Elk jaar levert het ${trib} miljard op.`}
function dictWarYear(){const D=S.dict;if(!D)return;
  for(const w of dWars().slice()){w.y++;const St=w.str*w.nato;const cost=Math.round(2+St*.8);D.kas-=cost;if(D.kas<0){ecoW().debt+=-D.kas*.8;D.kas=0;D.sup=clamp(D.sup-4)}
    if(NATO.includes(w.c)&&w.nato<3&&chance(.35)){w.nato+=1;w.front=clamp(w.front-15);Q.push({id:'dw_navo',c:{c:w.c}})}
    const P=myPow();const d=Math.round((P/(P+St)-.5)*16+gauss()*6);w.front=clamp(w.front+d);const cas=Math.round(ri(300,1500)*(1+St/5));w.cas+=cas;D.sup=clamp(D.sup-2);
    L(`Oorlog met ${COUNTRIES[w.c].n}, jaar ${w.y}: front ${w.front}%. Kosten: ${cost} miljard. Gesneuveld: ${nf(cas)}.`,'sys');
    if(w.front>=100){L(conquer(w),'big');continue}
    if(w.front<=0){S.dict.wars=dWars().filter(x=>x!==w);Q.push({id:'dw_nederlaag',c:{c:w.c,n:w.nato}});continue}
    if(chance(.25))Q.push({id:pick(['dw_verlies','dw_vredesbod','dw_held']),c:{c:w.c}})}
  for(const e of dEmp().slice()){D.kas=Math.round((D.kas+e.trib)*10)/10;e.unr=clamp(e.unr+ri(-3,6)+(D.fear<40?4:0));D.intl=clamp(D.intl+2);if(e.unr>=80&&chance(.4))Q.push({id:'dw_opstand',c:{c:e.c}})}
}
const DW=(id,o)=>E(id,Object.assign({sys:1,need:()=>!!S.dict},o));
DW('dw_navo',{t:'De NAVO grijpt in',x:c=>`De NAVO komt ${COUNTRIES[c.c].n} te hulp. Amerikaanse straaljagers verschijnen boven het front.`,ch:[
 ['⚔️ Doorvechten',()=>{S.dict.army=clamp(S.dict.army-5);return 'Je generaals kijken je bleek aan, maar je zet door.'}],
 ['🤝 Om een wapenstilstand vragen',c=>{const w=dWars().find(x=>x.c===c.c);if(w)S.dict.wars=dWars().filter(x=>x!==w);S.dict.sup=clamp(S.dict.sup-10);return 'De troepen trekken zich terug. Een pijnlijke aftocht.'}]]});
DW('dw_nederlaag',{t:'Nederlaag',x:c=>`Jouw leger is verslagen in ${COUNTRIES[c.c].n}. De vijand rukt op naar jouw grens.`,ch:[
 ['🏳️ Vrede tegen elke prijs',c=>{const D=S.dict;const g=Math.min(D.kas,ri(10,30));D.kas-=g;D.sup=clamp(D.sup-20);D.army=clamp(D.army-20);if(D.sup<15&&chance(.5))return {go:()=>dictFall('revolutie')};return `Je betaalt ${g} miljard en levert grondgebied in. Het volk is woedend.`}],
 ['🛡️ Je eigen land verdedigen',c=>{const D=S.dict;if(chance(c.n>1?.25:.55)){D.army=clamp(D.army+5);D.sup=clamp(D.sup+5);return 'Je houdt de grens. De vijand stopt. Maar je hebt niets gewonnen.'}return {go:()=>dictFall('revolutie')}}]]});
DW('dw_verlies',{t:'Zware verliezen',x:c=>`Een hele divisie is omsingeld in ${COUNTRIES[c.c].n}. Moeders demonstreren voor het paleis.`,ch:[
 ['📺 Het nieuws verbieden',()=>{S.dict.fear=clamp(S.dict.fear+6);S.dict.sup=clamp(S.dict.sup-3);return 'Op staats-tv gaat het alleen over overwinningen.'}],
 ['🕯️ Een dag van rouw',()=>{S.dict.sup=clamp(S.dict.sup+3);return 'Het land rouwt. Je staat met gebogen hoofd bij het monument.'}]]});
DW('dw_vredesbod',{t:'Vredesbod',x:c=>{const w=dWars().find(x=>x.c===c.c);return `${COUNTRIES[c.c].n} biedt vrede aan${w&&w.front>=50?' en wil ervoor betalen':''}.`},ch:[
 ['🤝 Accepteren',c=>{const D=S.dict,w=dWars().find(x=>x.c===c.c);if(!w)return 'De oorlog is al voorbij.';S.dict.wars=dWars().filter(x=>x!==w);const g=w.front>=50?Math.round(w.str*2.5):0;D.kas+=g;D.sup=clamp(D.sup+4);return g?`Vrede. Je ontvangt ${g} miljard.`:'Vrede. Iedereen gaat naar huis.'}],
 ['⚔️ Weigeren: we willen alles',()=>{S.dict.sup=clamp(S.dict.sup-2);return 'De oorlog gaat door.'}]]});
DW('dw_held',{t:'Een oorlogsheld',x:c=>`Een jonge generaal boekt grote successen in ${COUNTRIES[c.c].n}. Het volk is dol op hem. Te dol misschien.`,ch:[
 ['🎖️ Hem belonen',c=>{const w=dWars().find(x=>x.c===c.c);if(w)w.front=clamp(w.front+8);S.dict.army=clamp(S.dict.army+5);if(chance(.15))Q.push({id:'dict_paleiscoup'});return 'Hij krijgt een medaille en meer troepen.'}],
 ['🗡️ Hem laten verdwijnen',c=>{const w=dWars().find(x=>x.c===c.c);if(w)w.front=clamp(w.front-6);S.dict.fear=clamp(S.dict.fear+6);S.dict.army=clamp(S.dict.army-6);kar(-6);return 'Hij komt om bij een "helikopterongeluk". Het leger begrijpt de boodschap.'}]]});
DW('dw_opstand',{t:'Opstand',x:c=>`In ${COUNTRIES[c.c].n} is een volksopstand uitgebroken tegen jouw bezetting.`,ch:[
 ['💥 Neerslaan',c=>{const D=S.dict,e=dEmp().find(x=>x.c===c.c);if(!e)return '';if(chance(.6)){e.unr=clamp(e.unr-35);D.intl=clamp(D.intl+8);kar(-5);return 'De opstand wordt bloedig neergeslagen.'}S.dict.emp=dEmp().filter(x=>x!==e);delete ecoW().conq[e.c];D.sup=clamp(D.sup-8);return `De opstand slaagt. ${COUNTRIES[e.c].n} is weer vrij.`}],
 ['🤝 Autonomie geven',c=>{const e=dEmp().find(x=>x.c===c.c);if(e){e.unr=clamp(e.unr-25);e.trib=Math.round(e.trib*.6*10)/10}return 'Ze krijgen een eigen parlement. De opbrengst daalt, de rust keert terug.'}]]});
Object.assign(EVMETA,{dw_navo:['Oorlog','🛩️'],dw_nederlaag:['Oorlog','🏳️'],dw_verlies:['Oorlog','🕯️'],dw_vredesbod:['Oorlog','🤝'],dw_held:['Oorlog','🎖️'],dw_opstand:['Jouw rijk','🔥']});

/* ---------- roem: bekende beroepen, volgers, en het leven als celebrity ---------- */
// hoe bekend je wordt per niveau van je beroep
const FAMEJ={politiek:[8,20,45,75,95],muzikant:[3,15,60,92],acteur:[5,30,88],model:[25,70],voetbal:[30,55,90],schrijver:[10,50],kok:[0,0,0,5,35],journalist:[3,8,25],orkest:[0,5,25]};
function jobFameT(){const j=S.job;if(!j||inJail())return 0;if(j.id==='prosport'){const P=S.sport;if(!P)return 20;return Math.round([15,35,65,92][P.lvl||0]*(.4+sportPop(P.id)/100*.6))}const t=FAMEJ[j.id];return t?t[Math.min(j.lvl,t.length-1)]:0}
// volgers die bij je roem horen: 10 → ~2.000 · 30 → ~20.000 · 50 → ~300.000 · 70 → ~3,5 mln · 90 → ~45 mln
// realistische plafonds: hoeveel mensen kunnen je volgen in jouw land
const POPF={NL:1,BE:.7,DE:3.5,UK:3.5,US:12,CA:1.6,FR:3,IT:2.6,ES:2.2,AU:1.2,JP:5,BR:7,MX:5,ZA:1.4,TR:3.5,MA:1.4,ID:9};
const intlStar=()=>jobFameT()>=60;
const reachF=()=>(POPF[S.p.country]||1)*(intlStar()?20:1);
const follT=f=>f<=0?0:Math.round(Math.min(4e8,Math.pow(10,2.6+f*.042)*reachF()));
const follMax=()=>Math.round(Math.min(4e8,Math.max(follT(S.fame),5e6*reachF())));
const famous=()=>S.fame>=25;
function fameYear(){const act=S.flags.postY!=null&&year()-S.flags.postY<=1;
  if(typeof smYear==='function'&&S.sm)smYear();else if(S.foll>0)S.foll=Math.round(S.foll*(act?.94+R()*.06:.84+R()*.08));if(!act&&S.flags.eng)S.flags.eng=Math.max(20,S.flags.eng-8);
  const jt=Math.max(jobFameT(),typeof polFameT==='function'?polFameT():0,typeof milFameT==='function'?milFameT():0),ff=S.foll>0?clamp((Math.log10(S.foll)-2.7)/.055*.85):0;
  let f=S.fame-ri(1,3);if(jt>f)f+=Math.max(1,Math.round((jt-f)*.4));S.fame=Math.round(clamp(Math.max(ff,f)));
  // bekende mensen krijgen vanzelf volgers, ook zonder te posten
  // alleen wie actief post, profiteert van bekendheid; wie niets doet, krijgt niets
  if(S.fame>=5&&ageY()>=12&&act&&S.sm&&Object.keys(S.sm.acc).length){const t=follT(S.fame);if(S.foll<t){const g=Math.round((t-S.foll)*(.15+R()*.15));S.foll+=g;if(typeof smIn==='function')smIn();if(jt&&g>=1000)L(`Doordat je bekend bent en actief post, krijg je ${g.toLocaleString('nl-NL')} nieuwe volgers.`,'good')}}
  if(S.sm&&!S.flags.smfix){S.flags.smfix=1;const mx=Math.max(follT(S.fame)*1.5,Math.min(S.foll,5e5));if(S.foll>mx*1.3){const f=mx/S.foll;for(const a of Object.values(S.sm.acc))a.f=Math.round(a.f*f);smOut();L(`De platforms verwijderen miljoenen nep- en inactieve volgers. Je hebt er nu ${S.foll.toLocaleString('nl-NL')}.`,'sys')}}
  if(S.foll>=1e6)S.flags.beroemd=1;
  celebYear()}
// voordelen en problemen van bekend zijn
function celebYear(){if(!famous()||inJail()||ageY()<12)return;const f=S.fame,bg=!!S.flags.bg;
  if(chance(.5)){const v=Math.round(ri(5,40)*f*(S.cpi||1)/10)*10;S.flags.gifts=(S.flags.gifts||0)+v;hap(1);L(`Merken sturen je gratis spullen ter waarde van ${fmt(v)}.`,'good')}
  const pool=[['c_papa',f>=30?.35:0],['c_roddel',f>=35?.25:0],['c_haat',S.foll>=1e5?.25:0],['c_fans',f>=45&&!bg?.18:0],['c_stalker',f>=50?(bg?.03:.1):0],['c_hack',f>=45?.08:0],['c_afpers',f>=60?.06:0],
    ['c_gala',f>=30?.3:0],['c_ambassadeur',f>=40&&!S.acts.amb?.15:0],['c_deal',f>=50?.2:0],['c_herkend',.25]];
  let n=0;for(const [id,p] of pool.sort(()=>R()-.5)){if(n>=2)break;if(p&&chance(p)){const e=EV[id];Q.push({id,c:e.ctx?e.ctx():{}});n++}}}
const bgCost=()=>Math.round(65000*(S.cpi||1));
// --- problemen ---
E('c_papa',{sys:1,need:famous,t:'Paparazzi',x:()=>pick(['Fotografen springen uit de bosjes als je de supermarkt uitloopt.','Een paparazzo volgt je al de hele dag op een scooter.','Bij je ontbijt op een terras staan opeens tien camera\'s op je gericht.']),ch:[
 ['📸 Lachen en poseren',()=>{S.foll+=Math.round(S.foll*.02+ri(100,1000));return 'De foto\'s staan morgen in alle bladen. Goed voor je imago.'}],
 ['🧢 Wegduiken',()=>chance(.5)?'Je komt ongezien weg.':(S.foll+=Math.round(S.foll*.01),'Ze krijgen je toch op de foto, met je pet scheef. "Gezien: onherkenbaar"')],
 ['🤬 De camera afpakken',()=>{kar(-4);S.fame=clamp(S.fame+2);if(chance(.5)){const k=Math.round(ri(5,25)*1000*(S.cpi||1));cash(-k);return `Je gooit de camera op de grond. De fotograaf klaagt je aan: je moet ${fmt(k)} betalen.`}return 'Je pakt de camera af. Het filmpje ervan gaat viraal: "Ster flipt op fotograaf".'}]]});
E('c_roddel',{sys:1,need:famous,t:'Roddelblad',ctx:()=>({w:pick(['je een geheime relatie zou hebben','je failliet zou zijn','je in een afkickkliniek zou zitten','je ruzie hebt met je familie','je je tanden hebt laten bleken met kunstgebit'])}),x:c=>`Een roddelblad schrijft dat ${c.w}. Het is helemaal niet waar.`,ch:[
 ['⚖️ Het blad aanklagen',c=>{const k=Math.round(15000*(S.cpi||1));cash(-k);if(chance(.55)){const w=Math.round(ri(30,120)*1000*(S.cpi||1));cash(w);return `Je wint de rechtszaak. Het blad moet je ${fmt(w)} betalen en een rectificatie plaatsen.`}return `Je verliest de zaak en ${fmt(k)} aan advocaten.`},()=>S.money>=15000*(S.cpi||1)],
 ['📱 Reageren op social media',c=>{if(chance(.6)){S.foll+=Math.round(S.foll*.03);return 'Je reactie is grappig en scherp. Je fans staan achter je.'}S.flags.eng=Math.max(5,(S.flags.eng??50)-8);return 'Je reactie maakt het alleen maar erger.'}],
 ['🙄 Negeren',c=>{const p=partner();if(p&&/relatie/.test(c.w)){p.rel=clamp(p.rel-8);return `Het waait over, maar ${p.first} kijkt je wel even anders aan.`}return 'Volgende week schrijven ze over iemand anders.'}]]});
E('c_haat',{sys:1,t:'Online haat',x:()=>pick(['Onder je laatste post staan honderden haatberichten.','Een groep trollen heeft het op je gemunt.','Iemand maakt een spotfilmpje over je dat miljoenen keren bekeken wordt.']),ch:[
 ['📵 Even offline gaan',()=>{S.flags.eng=Math.max(5,(S.flags.eng??50)-6);hap(2);return 'Een week zonder telefoon. Het doet je goed.'}],
 ['💬 Terugslaan',()=>{if(chance(.4)){S.foll=Math.round(S.foll*.9);S.flags.eng=Math.max(5,(S.flags.eng??50)-10);hap(-2);return 'Je wordt gecanceld. "Kan niet tegen kritiek."'}S.foll+=Math.round(S.foll*.02);return 'Je antwoord wordt gedeeld als voorbeeld van hoe het moet.'}],
 ['😔 Het lezen',()=>{hap(-3);return 'Je leest alles. Dat had je beter niet kunnen doen.'}]]});
E('c_fans',{sys:1,need:famous,t:'Fans voor de deur',x:()=>'Er staan elke dag fans voor je huis. Ze bellen aan, maken foto\'s door je raam en volgen je naar de supermarkt.',ch:[
 ['✍️ Even naar buiten voor selfies',()=>{hap(1);S.foll+=ri(200,3000);return 'Je fans gaan dolgelukkig naar huis. Voor even.'}],
 ['🛡️ Een bodyguard inhuren',()=>{S.flags.bg=1;return `Je neemt een bodyguard in dienst voor ${fmt(bgCost())} per jaar. Je kunt weer rustig over straat.`}],
 ['🏡 Verhuizen naar een afgeschermde villawijk',()=>{S.flags.bg=1;hap(2);return `Je huurt een plek in een beveiligde wijk met eigen beveiliging (${fmt(bgCost())} per jaar).`}]]});
E('c_stalker',{sys:1,need:famous,t:'Een stalker',x:()=>'Iemand stuurt je al maanden brieven, staat bij je optredens en wist gisteren waar je at. Het voelt niet meer veilig.',ch:[
 ['👮 Aangifte doen',()=>{if(chance(.6))return 'De politie pakt de stalker op. Je krijgt een contactverbod.';hap(-4);return 'De politie kan nog niets doen. De brieven blijven komen.'}],
 ['🛡️ Bodyguard inhuren',()=>{S.flags.bg=1;hap(2);return `Je huurt beveiliging in voor ${fmt(bgCost())} per jaar.`}],
 ['🙈 Negeren',()=>{if(chance(.35)){hea(-ri(5,15));hap(-8);return 'De stalker staat op een avond in je tuin en valt je aan. Je komt met de schrik en een paar blauwe plekken vrij.'}hap(-3);return 'Je probeert het te vergeten, maar je slaapt slecht.'}]]});
E('c_hack',{sys:1,need:famous,t:'Gehackt',x:()=>'Iemand heeft je telefoon gehackt en dreigt privéfoto\'s online te zetten.',ch:[
 ['🧑‍💻 Experts inschakelen',()=>{const k=Math.round(8000*(S.cpi||1));cash(-k);if(chance(.7))return `Voor ${fmt(k)} krijgen experts je account terug. Niets gelekt.`;hap(-6);S.fame=clamp(S.fame+3);return 'Te laat: de foto\'s staan al online. Je wordt er wekenlang mee gepest.'}],
 ['🤷 Er zelf om lachen',()=>{if(chance(.5)){S.foll+=Math.round(S.foll*.04);hap(1);return 'Je post ze zelf, met een grap erbij. Iedereen vindt je geweldig.'}hap(-5);return 'De grap valt verkeerd. Het wordt een rel.'}]]});
E('c_afpers',{sys:1,need:famous,t:'Afpersing',ctx:()=>({k:Math.round(ri(50,250)*1000*(S.cpi||1))}),x:c=>`Een anonieme afzender zegt pijnlijke informatie over je te hebben en wil ${fmt(c.k)}, anders gaat het naar de pers.`,ch:[
 ['💶 Betalen',c=>{cash(-c.k);if(chance(.3)){hap(-6);return 'Je betaalt, maar een paar maanden later staat het toch in de krant.'}return 'Je betaalt. Je hoort er nooit meer iets van.'},c=>S.money>=c.k],
 ['👮 Naar de politie',c=>{if(chance(.55)){kar(2);return 'De politie pakt de afperser op bij de geldoverdracht.'}S.fame=clamp(S.fame-6);hap(-8);return 'Het verhaal komt naar buiten. Je imago krijgt een flinke deuk.'}],
 ['🗞️ Het zelf naar buiten brengen',()=>{if(chance(.6)){S.foll+=Math.round(S.foll*.05);kar(3);return 'Je vertelt het eerlijk in een interview. Mensen respecteren je ervoor.'}S.fame=clamp(S.fame-4);hap(-4);return 'Mensen zijn er minder vergevingsgezind over dan je hoopte.'}]]});
// --- voordelen ---
E('c_gala',{sys:1,need:famous,t:'Uitnodiging',ctx:()=>({w:pick(['de première van een grote film','een gala met prinsen en ministers','een modeshow in Parijs','een exclusief feest op een jacht','de uitreiking van de Edisons'])}),x:c=>`Je bent uitgenodigd voor ${c.w}.`,ch:[
 ['🥂 Gaan',c=>{hap(5);S.fame=clamp(S.fame+1);S.foll+=Math.round(S.foll*.02);if(!partner()&&ageY()>=18&&chance(.2)){const p=candidate();p.job=pick(['acteur','zanger','model','presentator']);p.looks=clamp(p.looks+20);addPartner(p);return `Een avond om nooit te vergeten. Je klikt met ${p.first}, ook bekend. Jullie hebben een relatie!`}return pick(['Je loopt over de rode loper en wordt overal gefotografeerd.','Je danst met mensen die je alleen van tv kende.','De goodiebag alleen al is duizenden euro\'s waard.'])}],
 ['🏠 Thuisblijven',()=>'Je kijkt het liever op tv.']]});
E('c_ambassadeur',{sys:1,need:famous,t:'Ambassadeur',ctx:()=>({w:pick(['een kinderziekenhuis','een dierenasiel','schoon drinkwater in Afrika','de voedselbank','onderzoek naar kanker'])}),x:c=>`Een goed doel voor ${c.w} vraagt of je ambassadeur wilt worden.`,ch:[
 ['❤️ Ja, graag',()=>{S.acts.amb=1;kar(8);hap(4);S.fame=clamp(S.fame+2);MS('Werd ambassadeur van een goed doel',1);return 'Je naam helpt het goede doel enorm. Je voelt je er goed bij.'}],
 ['🙅 Geen tijd',()=>'Je slaat het beleefd af.']]});
E('c_deal',{sys:1,need:famous,t:'Groot reclamecontract',ctx:()=>({b:pick(['een sportmerk','een automerk','een horlogemerk','een frisdrankmerk','een telefoonmerk']),k:Math.round(S.fame*S.fame*ri(15,40)*(S.cpi||1)/100)*100}),x:c=>`${cap(c.b)} wil jou als gezicht van hun nieuwe campagne. Ze bieden ${fmt(c.k)}.`,ch:[
 ['✍️ Tekenen',c=>{cash(c.k);S.foll+=Math.round(S.foll*.03);return `Je staat op billboards door het hele land. ${fmt(c.k)} rijker.`}],
 ['💬 Meer vragen',c=>{if(chance(.45)){const k=Math.round(c.k*1.4);cash(k);return `Ze gaan akkoord: ${fmt(k)}.`}return 'Ze kiezen iemand anders.'}],
 ['❌ Afslaan',()=>'Je wilt je naam niet aan dat merk verbinden.']]});
E('c_herkend',{sys:1,need:famous,t:'Herkend!',x:()=>pick(['In een restaurant krijg je de beste tafel en de chef komt persoonlijk langs.','Op het vliegveld word je naar de VIP-lounge gebracht.','Een fan vraagt huilend om een selfie.','Je krijgt een gratis upgrade naar de suite in je hotel.']),ch:[
 ['😊 Genieten',()=>{hap(3);return 'Soms is bekend zijn best fijn.'}],
 ['😐 Je ongemakkelijk voelen',()=>{hap(-1);return 'Je zou soms willen dat je gewoon even anoniem was.'}]]});

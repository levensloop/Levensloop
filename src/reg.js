/* ================= POLITIEK PER LAND (fase 3): regio's, staatshoofd, democratie en corruptie ================= */
// democratie (0-100) en corruptie (0-100) per land
const DEMS={NL:95,BE:92,DE:93,UK:91,US:80,CA:94,FR:88,IT:84,ES:88,AU:94,JP:90,BR:68,MX:58,ZA:70,TR:38,MA:35,ID:62};
const CORS={NL:10,BE:15,DE:12,UK:15,US:28,CA:12,FR:22,IT:42,ES:32,AU:14,JP:22,BR:62,MX:68,ZA:58,TR:62,MA:60,ID:65};
const demS=()=>DEMS[S.p.country]??80,corS=()=>CORS[S.p.country]??30;
const demLbl=()=>{const d=demS();return d>=85?'volwaardige democratie':d>=65?'democratie met gebreken':d>=45?'zwakke democratie':'half-autoritair'};
const corLbl=()=>{const c=corS();return c<20?'heel weinig corruptie':c<40?'af en toe corruptie':c<60?'veel corruptie':'corruptie is overal'};
/* ---------- regio's ---------- */
// stad → [regio, titel, onafhankelijkheidsbeweging (steun %)]
const REGS={
 NL:{t:'Gedeputeerde',m:{Amsterdam:'Noord-Holland',Haarlem:'Noord-Holland',Rotterdam:'Zuid-Holland','Den Haag':'Zuid-Holland',Utrecht:'Utrecht',Eindhoven:'Noord-Brabant',Breda:'Noord-Brabant',Tilburg:'Noord-Brabant',Groningen:'Groningen',Maastricht:'Limburg',Zwolle:'Overijssel',Nijmegen:'Gelderland'},f:r=>`Gedeputeerde van ${r}`},
 BE:{t:'Minister-president',m:{Antwerpen:'Vlaanderen',Gent:'Vlaanderen',Leuven:'Vlaanderen',Brugge:'Vlaanderen',Hasselt:'Vlaanderen',Brussel:'Brussel'},f:r=>`Minister-president van ${r}`,ind:{Vlaanderen:28}},
 DE:{t:'Minister-president',m:{Berlijn:'Berlijn',München:'Beieren',Hamburg:'Hamburg',Keulen:'Noordrijn-Westfalen',Düsseldorf:'Noordrijn-Westfalen',Aken:'Noordrijn-Westfalen'},f:r=>['Berlijn','Hamburg'].includes(r)?`Burgemeester-president van ${r}`:`Minister-president van ${r}`},
 UK:{t:'Regioleider',m:{Londen:'Londen',Manchester:'Greater Manchester',Liverpool:'Liverpool City Region',Edinburgh:'Schotland',Bristol:'West of England'},f:r=>r==='Schotland'?'Eerste minister van Schotland':r==='Londen'?'Burgemeester van Londen':`Burgemeester van ${r}`,ind:{Schotland:48}},
 CA:{t:'Premier van een provincie',m:{Toronto:'Ontario',Vancouver:'Brits-Columbia',Montreal:'Québec',Calgary:'Alberta'},f:r=>`Premier van ${r}`,ind:{'Québec':40,Alberta:22}},
 FR:{t:'Regiovoorzitter',m:{Parijs:'Île-de-France',Lyon:'Auvergne-Rhône-Alpes',Marseille:'Provence-Alpes-Côte d\'Azur',Nice:'Provence-Alpes-Côte d\'Azur',Bordeaux:'Nouvelle-Aquitaine'},f:r=>`Voorzitter van ${r}`},
 IT:{t:'Regiopresident',m:{Rome:'Lazio',Milaan:'Lombardije',Napels:'Campanië',Florence:'Toscane',Bologna:'Emilia-Romagna',Ancona:'Marche'},f:r=>`President van ${r}`},
 ES:{t:'Regiopresident',m:{Madrid:'Madrid',Barcelona:'Catalonië',Valencia:'Valencia',Sevilla:'Andalusië',Málaga:'Andalusië'},f:r=>r==='Catalonië'?'President van de Generalitat':`President van ${r}`,ind:{'Catalonië':45}},
 AU:{t:'Premier van een deelstaat',m:{Sydney:'Nieuw-Zuid-Wales',Melbourne:'Victoria',Brisbane:'Queensland',Perth:'West-Australië'},f:r=>`Premier van ${r}`},
 JP:{t:'Gouverneur',m:{Tokio:'Tokio',Osaka:'Osaka',Kyoto:'Kyoto',Sapporo:'Hokkaido',Fukuoka:'Fukuoka'},f:r=>`Gouverneur van ${r}`},
 BR:{t:'Gouverneur',m:{'São Paulo':'São Paulo','Rio de Janeiro':'Rio de Janeiro',Salvador:'Bahia','Brasília':'het Federaal District'},f:r=>`Gouverneur van ${r}`},
 MX:{t:'Gouverneur',m:{'Mexico-Stad':'Mexico-Stad',Guadalajara:'Jalisco',Monterrey:'Nuevo León','Cancún':'Quintana Roo'},f:r=>r==='Mexico-Stad'?'Regeringsleider van Mexico-Stad':`Gouverneur van ${r}`},
 ZA:{t:'Premier van een provincie',m:{Kaapstad:'West-Kaap',Johannesburg:'Gauteng',Durban:'KwaZulu-Natal'},f:r=>`Premier van ${r}`},
 ID:{t:'Gouverneur',m:{Jakarta:'Jakarta',Denpasar:'Bali',Surabaya:'Oost-Java',Bandung:'West-Java'},f:r=>`Gouverneur van ${r}`}};
const regC=()=>REGS[S.p.country];
const lc1=t=>t?t[0].toLowerCase()+t.slice(1):t;
const regName=()=>{const R_=regC();return R_&&(R_.m[S.p.city]||Object.values(R_.m)[0])};
// staatshoofden die gekozen worden door het parlement
const HOSE={DE:{t:'Bondspresident',age:40,term:5,how:'gekozen door de Bondsversammlung'},IT:{t:'President van de Republiek',age:50,term:7,how:'gekozen door het parlement en de regio\'s'}};
POLO.hos={t:'Staatshoofd',sal:254,fame:80,ft:1,r:5};
for(const k of Object.keys(REGS))if(PSYS[k]){PSYS[k].off=PSYS[k].off||{};PSYS[k].off.gov=Object.assign({},PSYS[k].off.gov,{t:REGS[k].t,sal:k==='NL'?120:160,fame:k==='NL'?18:45,r:k==='NL'?3:4})}
for(const k of Object.keys(HOSE))if(PSYS[k]){PSYS[k].off.hos={t:HOSE[k].t}}
/* ---------- jaarlijks ---------- */
function regYear(a){const P=S.pol,W=S.pw,y=year();if(!W||isPres()||S.dict)return;const R_=regC();
  if(R_){if(!W.nextRG)W.nextRG=y+ri(1,cyc());
    if(y>=W.nextRG){W.nextRG=y+cyc();if(P&&(P.cand.reg||P.lvl==='gov'))Q.push({id:'reg_vk'});else if(P&&P.lvl==='gov')loseOffice()}}
  if(P&&P.lvl==='hos'&&y>=(P.term||0))loseOffice(`Je termijn als ${polTl('hos')} zit erop.`);
  // de koning van Marokko bemoeit zich ermee
  if(P&&S.p.country==='MA'&&['mp','min'].includes(P.lvl)&&chance(.55))Q.push({id:'ma_koning',c:{k:pick(MAK.map((_,i)=>i))}});
  // democratie: massaprotest, fraude
  if(P&&['mp','gov','burg'].includes(P.lvl)&&chance(Math.max(0,(100-demS()))/320+(P.pop<30?.1:0)))Q.push({id:'dem_protest'});
  if(P&&P.lvl==='mp'&&demS()<65&&((W.nextTK===y+1)||(presL()&&W.nextPR===y+1))&&!P.fraud)Q.push({id:'dem_fraude'});
  if(P&&P.fraud&&P.fraud.y<y){const f=P.fraud;P.fraud=null;if(chance(.25+demS()/250))Q.push({id:'dem_fraudeuit'})}}
/* ---------- regionale verkiezing ---------- */
function regWin(){const P=S.pol,W=S.pw;const lean=P.regL??(P.regL=Math.round(gauss()*10));const loc={};for(const k in W.sh){let s=W.sh[k]*Math.exp(gauss()*.28);if(k===P.party)s*=1+lean/40+(P.pop-40)/110+(P.camp||0)*.01+(P.lvl==='gov'?.12:0);loc[k]=s}
  const srt=Object.keys(loc).sort((a,b)=>loc[b]-loc[a]);const t=Object.values(loc).reduce((a,b)=>a+b,0);return {win:srt[0]===P.party,pct:Math.round(loc[P.party]/t*100),top:srt[0]}}
E('reg_vk',{sys:1,need:()=>S.pol&&!S.dict&&!!regC(),t:'Regionale verkiezingen',f:()=>{const P=S.pol,R_=regC(),r=regName();const nom=P.lvl==='gov'||P.lead||P.steun>=62||P.party==='own';P.cand.reg=0;
  if(!nom){return `Bij de verkiezingen in ${r} kiest je partij iemand anders als lijsttrekker.`}
  const v=regWin();if(v.win){const was=P.lvl==='gov';if(!was){setOffice('gov',r);P.regT=R_.f(r);MS(`Werd ${lc1(R_.f(r))}`,2);hap(10)}P.pop=clamp(P.pop+4);
    return was?`${PTY(P.party).n} wint opnieuw in ${r} (${v.pct}%). Jij blijft ${lc1(P.regT)}.`:`${PTY(P.party).n} wordt de grootste in ${r} met ${v.pct}% van de stemmen. Jij wordt ${lc1(R_.f(r))}!`}
  if(P.lvl==='gov')loseOffice(`${PTY(v.top).n} wint de verkiezingen in ${r}. Je bent geen ${lc1(P.regT)} meer.`);return `${PTY(v.top).n} wint de verkiezingen in ${r}. Jouw partij haalt ${v.pct}%.`}});
/* ---------- acties in de regio ---------- */
function regRows(f,P){const R_=(ic,t,s,fn,o={})=>row(f,{ic,t,s,dis:o.dis,dots:o.dots,on:fn});const D=(t,fn,ic)=>()=>doAct(t,fn,true,ic);const r=P.port||regName();
  if(P.lvl==='gov'&&!isPres()){
    R_('📊','De regiobegroting',`Geld voor ${r}`,D('Regiobegroting',()=>{if(S.acts.rbud)return 'De begroting van dit jaar is al gepresenteerd.';S.acts.rbud=1;if(chance(.6)){P.pop=clamp(P.pop+4);return `Een begroting met geld voor ${pick(['nieuwe treinen','ziekenhuizen','scholen','wegen'])}. Het regioparlement stemt in.`}P.pop=clamp(P.pop-3);return 'De oppositie vindt gaten in je begroting. Er volgt een lang debat.'},'📊'));
    R_('🏗️','Investeren in de regio','Een groot project binnenhalen',D('Investering',()=>{const m=use('rinv');P.pop=clamp(P.pop+Math.round(4*m));return `Je haalt ${pick(['een nieuwe fabriek','een universiteitscampus','een snelle treinverbinding','een windpark'])} naar ${r}.`},'🏗️'));
    R_('⚔️','Ruzie met de hoofdstad','Meer geld en macht voor de regio eisen',D('Ruzie',()=>{if(S.acts.rruz)return 'Je hebt dit jaar al ruzie gemaakt met de regering.';S.acts.rruz=1;const gp=S.pw.gov.includes(P.party);if(chance(.5)){P.pop=clamp(P.pop+5);P.steun=clamp(P.steun+(gp?-4:3));return `Je eist meer geld voor ${r}. De regering geeft toe. In ${r} ben je een held.`}P.pop=clamp(P.pop+1);return 'De regering houdt voet bij stuk. Je inwoners waarderen dat je het probeert.'},'⚔️'));
    const ind=(regC().ind||{})[r];if(ind!=null)R_('🗳️','Een referendum over onafhankelijkheid',P.ref?'Al gehouden deze termijn':`Volgens peilingen wil ${ind}% van ${r} onafhankelijk worden`,()=>refMenu(r,ind),{dis:!!P.ref,dots:true})}
  if(P.lvl==='hos'){R_('🎄','De jaarlijkse toespraak','Het hele land kijkt',D('Toespraak',()=>{if(S.acts.htsp)return 'Je hebt dit jaar al gesproken.';S.acts.htsp=1;P.pop=clamp(P.pop+4);return 'Je spreekt over verbinding en hoop. Zelfs je oude politieke tegenstanders noemen het mooi.'},'🎄'));
    R_('🌍','Een staatsbezoek','Handelsmissie en banketten',D('Staatsbezoek',()=>{if(S.acts.stb)return 'Je bent dit jaar al op staatsbezoek geweest.';S.acts.stb=1;P.pop=clamp(P.pop+3);hap(4);return `Een staatsbezoek aan ${pick(['Japan','Canada','Brazilië','India','Zweden','Zuid-Afrika'])}. Overal word je met eer ontvangen.`},'🌍'));
    R_('✋','Weigeren een wet te tekenen','Je zwaarste wapen: gebruik het zelden',D('Weigeren',()=>{if(S.acts.hveto)return 'Dat heb je dit jaar al gedaan.';S.acts.hveto=1;if(chance(.5)){P.pop=clamp(P.pop+3);return 'Je vindt een wet in strijd met de grondwet en weigert te tekenen. De regering moet hem aanpassen. Juristen geven je gelijk.'}P.pop=clamp(P.pop-5);return 'Je weigert te tekenen. De regering noemt het een politieke daad. Het land is verdeeld.'},'✋'))}}
/* ---------- referendum over onafhankelijkheid ---------- */
function refMenu(r,ind){const P=S.pol,cc=S.p.country;const legal=cc==='CA'||cc==='UK';
  modal({title:`Onafhankelijk ${r}?`,em:'🗳️',cat:P.regT,text:legal?`De grondwet laat een referendum toe, maar je hebt de medewerking van de regering nodig. Volgens de peilingen is ${ind}% voor.`:`Volgens de grondwet van ${C().n} mag een regio niet zelf over onafhankelijkheid stemmen. Volgens de peilingen is ${ind}% voor.`,choices:opts([
   {t:'🤝 Onderhandelen met de regering',s:'Netjes, maar de regering kan nee zeggen',on:()=>{closeModal();doAct('Referendum',()=>{P.ref=1;if(!legal||!chance(.45)){P.pop=clamp(P.pop+3);return 'De regering weigert. Het referendum gaat niet door. In de straten van '+r+' wordt gedemonstreerd.'}return refVote(r,ind,1)},true,'🤝')}},
   {t:'🗳️ Toch organiseren, zonder toestemming',s:legal?'Juridisch twijfelachtig':'Illegaal. Je riskeert vervolging',on:()=>{closeModal();doAct('Referendum',()=>{P.ref=1;const t=refVote(r,ind,0);if(!legal){P.risk=(P.risk||0)+30;Q.push({id:'reg_justitie',c:{r}})}return t},true,'🗳️')}},
   {t:'⏳ Nog niet',cls:'ghost',on:closeModal}])})}
function refVote(r,ind,ok){const P=S.pol;const ja=Math.round(clamp(ind+(P.pop-50)/6+gauss()*5+(ok?0:12),15,92));const opk=ok?ri(70,85):ri(35,48);MS(`Hield een referendum over de onafhankelijkheid van ${r}`,2);
  if(ja>50){P.pop=clamp(P.pop+8);S.flags.referendum=1;hap(12);return ok?`${ja}% stemt voor onafhankelijkheid, bij een opkomst van ${opk}%. Er beginnen onderhandelingen over de afscheiding van ${r}. De wereld kijkt mee.`:`${ja}% stemt voor, maar maar ${opk}% ging stemmen: tegenstanders boycotten het. De regering erkent de uitslag niet.`}
  P.pop=clamp(P.pop-4);return `${100-ja}% stemt tegen onafhankelijkheid. ${r} blijft deel van ${C().n}.`}
E('reg_justitie',{sys:1,need:()=>S.pol&&!S.dict,t:'Het Openbaar Ministerie',x:c=>`De regering stuurt de politie naar het regiobestuur van ${c.r}. Er ligt een arrestatiebevel tegen jou klaar wegens opruiing.`,ch:[
 ['⚖️ Je laten arresteren',c=>{polJail();jail(ri(12,48),'opruiing');MS(`Werd veroordeeld voor het referendum in ${c.r}`,2);return 'Je wordt opgepakt voor de deur van het parlement. Je aanhangers noemen je een politiek gevangene.'}],
 ['✈️ Vluchten naar het buitenland',c=>{const to=S.p.country==='BE'?'NL':'BE';MS(`Vluchtte naar het buitenland na het referendum in ${c.r}`,2);hap(-10);emigrate(to);return `In de kofferbak van een auto steek je de grens over. Je begint een leven in ballingschap in ${S.p.city}.`}]]});
/* ---------- Marokko: het paleis heeft het laatste woord ---------- */
const MAK=[['De koning wil dat je een groot project van het paleis voorrang geeft: een hogesnelheidslijn naar het zuiden.','de lijn'],['De koning laat weten dat een kritische journalist "te ver gaat". Hij verwacht dat je regering iets doet.','de journalist'],['Het paleis wil dat je een minister ontslaat die publiekelijk kritiek had op de koninklijke holding.','de minister'],['De koning wil dat je de prijsstijgingen van brandstof terugdraait, ook al kost het de staat miljarden.','de prijzen']];
E('ma_koning',{sys:1,need:()=>S.pol&&S.p.country==='MA'&&['mp','min'].includes(S.pol.lvl),t:'Het paleis belt',x:c=>MAK[c.k][0],ch:[
 ['🙇 Gehoorzamen',c=>{const P=S.pol;P.steun=clamp(P.steun+3);P.pop=clamp(P.pop+(c.k===3?4:c.k===1?-4:0));if(c.k===1)kar(-5);return 'Je doet wat het paleis vraagt. "Zijne Majesteit is tevreden," laat de kabinetschef weten.'}],
 ['✋ Beleefd weigeren',c=>{const P=S.pol;if(chance(.45)){P.pop=clamp(P.pop+5);kar(3);return 'Het blijft lang stil. Dan laat het paleis weten dat de koning "begrip heeft". Je hebt geluk gehad.'}loseOffice('De koning ontslaat je. In een korte verklaring wordt je "bedankt voor je diensten".');P.pop=clamp(P.pop+6);MS('Werd ontslagen door de koning van Marokko',2);return 'Een dag later staat je naam niet meer op de website van de regering.'}]]});
/* ---------- democratie: fraude en protest ---------- */
E('dem_fraude',{sys:1,need:()=>S.pol&&S.pol.lvl==='mp'&&!S.dict,t:'Een handje helpen',x:()=>`Over een jaar zijn er verkiezingen. Je campagneleider stelt voor om "de uitslag een handje te helpen": stembussen in afgelegen gebieden, kiezers die betaald worden, tellers die een oogje dichtknijpen. In ${C().n} is dat niet ongewoon.`,ch:[
 ['🗳️ Laat ze hun gang gaan',()=>{const P=S.pol,W=S.pw;P.fraud={y:year()};if(W.sh[P.party])W.sh[P.party]*=1.18;P.pop=clamp(P.pop+3);P.risk=(P.risk||0)+15;kar(-10);normSh();return 'Je zegt niks. Dat is ook een antwoord. Overal in het land gaan mensen "aan het werk".'}],
 ['🙅 Nee, eerlijk winnen of eerlijk verliezen',()=>{kar(6);S.pol.steun=clamp(S.pol.steun-3);return 'Je campagneleider kijkt je aan alsof je gek bent. "Dan verliezen we," zegt hij.'}]]});
E('dem_fraudeuit',{sys:1,need:()=>!!S.pol&&!S.dict,t:'De fraude komt uit',x:'Een journalist publiceert video\'s van stembussen die vooraf gevuld worden. Onder de beelden: jouw campagnelogo.',ch:[
 ['🚫 Alles ontkennen',()=>{const P=S.pol;if(chance(.5-demS()/400)){P.pop=clamp(P.pop-4);return 'Je noemt het nepnieuws. Je aanhangers geloven je. De rest niet.'}P.pop=clamp(P.pop-15);Q.push({id:'dem_protest'});return 'Niemand gelooft je. De oppositie roept op tot massaprotest.'}],
 ['🙏 Een onderzoek beloven',()=>{const P=S.pol;P.pop=clamp(P.pop-8);P.risk=(P.risk||0)+10;if(S.pex)S.pex.enq=year()+ri(1,3);return 'Je belooft een onafhankelijk onderzoek. Je hoopt dat het traag gaat.'}]]});
E('dem_protest',{sys:1,need:()=>S.pol&&['mp','gov','burg'].includes(S.pol.lvl)&&!S.dict,t:'Massaprotest',x:()=>`Honderdduizenden mensen gaan de straat op in ${pick(C().cities)}. ${pick(['Ze protesteren tegen de hoge prijzen.','Ze eisen het vertrek van de regering.','Aanleiding is een corruptieschandaal.','Ze protesteren tegen een nieuwe belasting.'])}`,ch:[
 ['🗣️ Het gesprek aangaan',()=>{const P=S.pol;if(chance(.55)){P.pop=clamp(P.pop+5);return 'Je ontvangt de leiders van het protest. Er komt een akkoord. De pleinen lopen leeg.'}P.pop=clamp(P.pop-3);return 'De gesprekken lopen vast. Het protest gaat weken door.'}],
 ['🎁 Toegeven op een paar punten',()=>{const P=S.pol;P.pop=clamp(P.pop+3);P.steun=clamp(P.steun-4);if(typeof ecoW==='function'){ecoW().debt=Math.round((ecoW().debt+1)*10)/10}return 'Je schrapt de belasting en verhoogt de lonen van ambtenaren. Het kost geld, maar de rust keert terug.'}],
 ['🚓 De politie laten ingrijpen',()=>{const P=S.pol;const d=demS();if(d>=65){P.pop=clamp(P.pop-12);P.risk=(P.risk||0)+10;return 'Beelden van agenten die op demonstranten inslaan gaan de wereld over. Je eigen partij neemt afstand van je.'}P.pop=clamp(P.pop-6);if(S.coup)S.coup.unrest=Math.max(0,(S.coup.unrest||0)-10);return 'Traangas en waterkanonnen. Na drie dagen is het stil. Voorlopig.'}]]});
/* ---------- corruptie: de envelop ---------- */
PE('cor_envelop',{c:()=>polIn('raad','weth','burg','kamer','min','mp','gov')()&&corS()>=35,w:()=>corS()/30,cd:3,t:'Een envelop',x:()=>`Een ${pick(['aannemer','projectontwikkelaar','zakenman met een villa aan zee','directeur van een bouwbedrijf'])} schuift na een etentje een envelop over tafel. "Voor de moeite," zegt hij. Het gaat om een vergunning. In ${C().n} is dit hoe het werkt.`,ch:[
 ['💵 Aannemen',()=>{const P=S.pol;const g=Math.round(ri(20,120)*1000*(POLO[P.lvl].r+1)*(S.cpi||1));cash(g);kar(-8);P.risk=(P.risk||0)+Math.round(30*demS()/100);return `In de envelop zit ${fmt(g)}. De vergunning komt er.`}],
 ['🙅 Weigeren',()=>{const P=S.pol;kar(5);if(chance(corS()/150)){P.steun=clamp(P.steun-5);return 'Je weigert. Een week later ligt je vergunningsdossier "kwijt" en praat je partij niet meer met je.'}return 'Je schuift de envelop terug. Hij lacht. "Je went er wel aan."'}],
 ['📞 Aangifte doen',()=>{const P=S.pol;kar(8);if(chance(demS()/120)){P.pop=clamp(P.pop+6);return 'De man wordt opgepakt. Je staat in de krant als de politicus die nee zei.'}P.steun=clamp(P.steun-8);P.pop=clamp(P.pop+2);return 'Er gebeurt niets met je aangifte. Wel krijg je dreigtelefoontjes.'}]]});
Object.assign(EVMETA,{reg_vk:['Verkiezingen','🗺️'],reg_justitie:['Politiek','⚖️'],ma_koning:['Politiek','👑'],dem_fraude:['Politiek','🗳️'],dem_fraudeuit:['Politiek','📹'],dem_protest:['Politiek','✊'],cor_envelop:['Politiek','✉️']});
/* ---------- schermen ---------- */
function regSheetRows(v,P,a){const R_=regC(),r=regName();if(!R_||isPres())return;const W=S.pw;
  if(P.lvl!=='gov'&&P.lvl!=='hos'&&POLO[P.lvl].r>=1&&a>=25)row(v,{ic:'🗺️',t:`Kandidaat ${lc1(R_.f(r))}`,s:P.cand.reg?`Verkiezingen in ${W.nextRG||'?'} · je partij moet je wel als lijsttrekker kiezen`:`Regionale verkiezingen in ${W.nextRG||'?'}`,r:P.cand.reg?'✅':'',on:()=>{P.cand.reg=P.cand.reg?0:1;refreshSheet()}})}
function hosRow(s,X,P,a){const H=HOSE[S.p.country];if(!H||!P||X.r<4||a<H.age||P.lvl==='hos')return;
  row(s,{ic:'🏛️',t:`Kandidaat voor ${H.t.toLowerCase()}`,s:`Het hoogste ambt van het land, ${H.how}`,dis:!!S.acts.hos,dots:true,on:()=>doAct('Kandidatuur',()=>{S.acts.hos=1;const W=S.pw;const ch=clamp(.12+(W.gov.includes(P.party)?.25:0)+X.r*.04+P.pop/350+(X.pmN?.15:0),.05,.75);
    if(chance(ch)){setOffice('hos');P.term=year()+H.term;S.fame=clamp(S.fame+10);MS(`Werd gekozen tot ${H.t.toLowerCase()}`,3);return `Je wordt gekozen tot ${H.t.toLowerCase()}! ${H.term} jaar lang ben je het staatshoofd van ${C().n}.`}return 'Een andere kandidaat wordt gekozen. Het was een eer om mee te doen.'},true,'🏛️')})}
function demCard(s){if(isPres()&&S.p.country!=='US')return;card(s,`<h3>🗳️ Democratie en corruptie</h3>${kv([['Democratie',`${demS()}/100 · ${demLbl()}`],['Corruptie',`${corS()}/100 · ${corLbl()}`],...(regC()?[['Jouw regio',regName()]]:[])])}<span class="muted">${demS()<65?'Verkiezingsfraude, massaprotesten en een staatsgreep liggen hier dichter bij dan in een sterke democratie.':'Een sterke rechtsstaat: fraude en geweld vallen snel op.'}</span>`)}

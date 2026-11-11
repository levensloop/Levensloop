/* ================= GEBEURTENISSEN: echte mensen, passend bij je leven en leeftijd ================= */
const anyP=roles=>{const l=living(roles).filter(p=>p.born<=S.m);return l.length?pick(l):null};
function circFindId(id){for(const x of (S.pol&&S.pol.ppl)||[])if(x.id===id)return x;for(const x of (S.mil&&S.mil.ppl)||[])if(x.id===id)return x;if(S.nb&&S.nb.ppl)for(const x of S.nb.ppl)if(x.id===id)return x;if(S.sm&&S.sm.peers)for(const x of S.sm.peers)if(x.id===id)return x;for(const b of S.biz||[])for(const x of b.emp||[])if(x.id===id)return x;for(const k in (S.circ||{})){const c=S.circ[k];if(!c||!c.ppl)continue;for(const x of c.ppl)if(x.id===id)return x}return null}
const findAny=id=>id?(P(id)||circFindId(id)):null;
const Pe=c=>findAny(c.id)||{first:c.n||'Iemand',rel:50};
function circP(slot,lead){if(!S.circ)return null;const c=safe(()=>circle(slot));if(!c)return null;const ps=circPpl(c).filter(p=>lead==null||!!p.lead===!!lead);return ps.length?pick(ps):null}
const ctxP=p=>p?{id:p.id}:null;
const jg=()=>S.job&&S.job.id!=='prosport'?jobGroup(S.job.id):null;
const hz=p=>p.g==='v'?'ze':'hij',hz2=p=>p.g==='v'?'haar':'hem',zijn=p=>p.g==='v'?'haar':'zijn';
// minigame als keuze in een gebeurtenis: resultaat tonen en daarna verder met de wachtrij
function evMg(t,em,cat,run,res){return {go:()=>{const b=snapSt();run(sc=>{const txt=res(sc)||'';if(txt)L(`${t}: ${txt}`);result(t,txt,chipsFrom(b),processQ,{cat,em})})}}}
const rel_=(p,d)=>{if(p&&p.rel!=null)p.rel=clamp(p.rel+d)};
// ---- bestaande gebeurtenissen met echte mensen ----
E('ouderruzie',{a:[5,17],c:()=>living('moeder').length&&living('vader').length&&!S.flags.divorced&&!S.flags.oudersSch,t:'Ruzie thuis',ctx:()=>ctxP(anyP(['moeder','vader'])),x:c=>{const p=Pe(c),o=living(p.role==='moeder'?'vader':'moeder')[0];return `${p.first} en ${o?o.first:'je andere ouder'} hebben een flinke ruzie in de keuken. ${p.first} kijkt jou aan.`},ch:[
 ['🤝 Proberen te bemiddelen',c=>{if(chance(.5)){relAdj('moeder',4);relAdj('vader',4);return 'Je weet ze allebei te laten lachen. De ruzie is over.'}return 'Ze sturen je naar je kamer.'}],
 ['🎧 Koptelefoon op',()=>'Je zet de muziek hard. Het waait vanzelf over.'],
 ['🙋 Partij kiezen',c=>{const p=Pe(c);rel_(p,6);relAdj(p.role==='moeder'?'vader':'moeder',-8);return `Je kiest de kant van ${p.first}. De ander is gekwetst.`}]]});
E('verliefd',{a:[12,16],t:'Verliefd',ctx:()=>{const p=circP('school',false);return p?{id:p.id}:{n:rname()}},x:c=>`Je bent tot over je oren verliefd op ${Pe(c).first} uit je klas.`,ch:[
 ['💌 Een briefje geven',c=>{const p=findAny(c.id);if(chance(.4+(S.st.looks-50)/200)){if(p&&!partner()&&S.circ&&circle('school'))circLove('school',p);hap(8);return `${Pe(c).first} vindt jou ook leuk! Jullie hebben verkering.`}hap(-2);rel_(p,-3);return `${Pe(c).first} giechelt en laat het briefje aan iedereen zien.`}],
 ['🙈 Niks zeggen',c=>'Je kijkt vooral heel vaak naar de achterkant van een hoofd.'],
 ['👯 Een vriend laten vragen',c=>{if(chance(.3)){hap(5);return `Het werkt. ${Pe(c).first} wil wel met je naar de film.`}hap(-1);return 'Je vriend verpest het compleet.'}]]});
E('spieken',{a:[12,17],c:()=>S.edu.stage==='middel',t:'Spieken?',ctx:()=>ctxP(circP('school',false)),x:c=>`Morgen is een belangrijke toets en je hebt niks geleerd. ${Pe(c).first} heeft de antwoorden.`,ch:[
 ['📄 De antwoorden aannemen',c=>{kar(-2);if(chance(.25))return 'Betrapt! Je krijgt een 1 en moet bij de directeur komen.'+report('school',1,'');for(const k in (S.edu.gr||{}))S.edu.gr[k]=clampG(S.edu.gr[k]+.3);rel_(findAny(c.id),5);return 'Je haalt een 8. Niemand merkt iets.'}],
 ['📚 De hele nacht leren',()=>{sma(2);hea(-1);return 'Moe, maar je haalt een voldoende. Eerlijk verdiend.'}],
 ['🙅 Nee, en het tegen de leraar zeggen',c=>{kar(2);rel_(findAny(c.id),-20);return `${Pe(c).first} krijgt straf. In de klas word je voortaan "de klikspaan" genoemd.`}]]});
E('spijbelen',{a:[13,17],c:()=>S.edu.stage==='middel',t:'Spijbelen',ctx:()=>ctxP(anyP('vriend')||circP('school',false)),x:c=>`${Pe(c).first} wil het laatste uur spijbelen en naar het strand.`,ch:[
 ['🏖️ Mee',c=>{hap(4);rel_(findAny(c.id),5);for(const k in (S.edu.gr||{}))S.edu.gr[k]=clampG(S.edu.gr[k]-.15);if(chance(.3)){relAdj('moeder',-5);relAdj('vader',-5);return 'Een topmiddag, tot je ouders een mail van school krijgen.'}return 'Een heerlijke middag aan zee.'}],
 ['📚 Gewoon naar de les',c=>{rel_(findAny(c.id),-2);return `${Pe(c).first} noemt je saai. Je hebt wel een goed cijfer.`}]]});
E('onlinedrama',{a:[13,19],t:'Online drama',ctx:()=>ctxP(circP('school',false)),x:c=>`${Pe(c).first} heeft een gênante foto van je in de klassenapp gezet.`,ch:[
 ['😂 Er zelf om lachen',()=>{if(chance(.6)){hap(2);return 'Je reageert met een nog gekkere foto. Iedereen vindt je geweldig.'}hap(-3);return 'Het helpt niet. Het grapje gaat nog weken rond.'}],
 ['🤬 Terugpakken',c=>{rel_(findAny(c.id),-15);kar(-2);return `Je zet een nog ergere foto van ${Pe(c).first} online. Oorlog.`}],
 ['🧑‍🏫 Melden bij de mentor',c=>{kar(1);return 'De foto wordt verwijderd en de klas krijgt een les over online pesten.'}]]});
E('feestje',{a:[14,17],t:'Een feestje',ctx:()=>ctxP(anyP('vriend')||circP('school',false)),x:c=>`${Pe(c).first} geeft een feest en er is ook alcohol.`,ch:[
 ['🍻 Gaan en meedrinken',c=>{hap(4);addUp('alcohol',4);rel_(findAny(c.id),4);if(chance(.25)){hea(-3);relAdj('moeder',-6);return 'Je bent ontzettend misselijk en je ouders moeten je ophalen.'}return 'Het wordt een avond om nooit te vergeten.'}],
 ['🥤 Gaan, maar niet drinken',c=>{hap(3);rel_(findAny(c.id),3);return 'Je hebt het naar je zin en weet alles nog.'}],
 ['🏠 Thuisblijven',()=>'Je kijkt een serie. Morgen hoor je alle verhalen.']]});
E('overwerk',{a:[18,70],c:()=>S.job&&!S.job.part&&S.job.id!=='prosport',t:'Overwerken',ctx:()=>ctxP(circP('work',true)),x:c=>`${Pe(c).first}, je leidinggevende, vraagt of je dit weekend wilt overwerken.`,ch:[
 ['💪 Ja, natuurlijk',c=>{(S.job&&(S.job.perf=clamp(S.job.perf+5)));rel_(findAny(c.id),6);cash(Math.round(salary()/52));return 'Een zwaar weekend, maar je baas is je dankbaar en je verdient extra.'}],
 ['🙅 Nee, ik heb plannen',c=>{rel_(findAny(c.id),-4);return `${Pe(c).first} knikt, maar is duidelijk teleurgesteld.`}]]});
E('collegaflirt',{a:[18,65],c:()=>S.job&&!S.job.part&&S.job.id!=='prosport',t:'Een leuke collega',ctx:()=>{const ps=S.circ?circPpl(circle('work')||{ppl:[]}).filter(p=>!p.lead&&Math.abs(pAge(p)-ageY())<=12&&p.role!=='partner'):[];return ps.length?{id:pick(ps).id}:null},x:c=>`${Pe(c).first} flirt al weken met je.${partner()?` Je hebt wel een relatie met ${partner().first}.`:''}`,ch:[
 ['😏 Terugflirten',c=>{const p=findAny(c.id);rel_(p,10);if(p)p.into=1;const pt=partner();if(pt&&chance(.3)){pt.rel=clamp(pt.rel-15);return `Het is spannend. Te spannend: ${pt.first} ziet jullie berichtjes.`}return `De koffieautomaat is nog nooit zo gezellig geweest.`}],
 ['💘 Mee uit vragen',c=>{const p=findAny(c.id);if(partner())return 'Je bedenkt je op het laatste moment. Je hebt al iemand.';if(p&&chance(.6)){circLove('work',p);return `${p.first} zegt ja! Jullie hebben een relatie.`}return `${Pe(c).first} wil het toch liever collegiaal houden.`},c=>!partner()],
 ['🙅 Afstand houden',c=>{rel_(findAny(c.id),-3);return 'Je houdt het professioneel.'}]]});
E('tip',{a:[22,75],c:()=>S.job&&S.job.id!=='prosport',t:'Een beurstip',ctx:()=>ctxP(circP('work',false)),x:c=>`${Pe(c).first} fluistert dat de aandelen van een biotechbedrijf gaan exploderen. "Maar je hebt het niet van mij."`,ch:[
 ['📈 Instappen',()=>({go:()=>{amountModal('Hoeveel beleg je?',Math.max(0,S.money),v=>doAct('Beurstip',()=>{cash(-v);if(chance(.35)){const w=Math.round(v*ri(2,5));cash(w);hap(6);return `Het klopt! Je krijgt ${fmt(w)} terug.`}if(chance(.4))return 'De koers blijft gelijk. Je haalt je geld er weer uit.'+(cash(v),'');hap(-1);return 'Het bedrijf gaat failliet. Weg geld.'},true,'📈'))}}),()=>S.money>100],
 ['🙅 Niet doen',c=>'Je laat het aan je voorbij gaan.']]});
E('scheiding',{a:[4,17],once:1,w:.25,c:()=>!bigOn()&&living('moeder').length&&living('vader').length&&!S.flags.oudersSch,t:'Je ouders gaan scheiden',x:()=>`${living('moeder')[0].first} en ${living('vader')[0].first} vertellen dat ze uit elkaar gaan.`,ch:[
 ['🏠 Bij je moeder wonen',()=>{S.flags.oudersSch=1;S.flags.divorced=1;relAdj('moeder',8);relAdj('vader',-8);hap(-5);return 'Je verhuist met je moeder mee.'}],
 ['🏠 Bij je vader wonen',()=>{S.flags.oudersSch=1;S.flags.divorced=1;relAdj('vader',8);relAdj('moeder',-8);hap(-5);return 'Je blijft bij je vader.'}],
 ['🔁 Om en om',()=>{S.flags.oudersSch=1;S.flags.divorced=1;hap(-3);return 'De ene week hier, de andere week daar.'}]]});
// ---- kinderen (0-11) ----
E('k_stapjes',{a:[1,2],once:1,w:2,t:'Je eerste stapjes',ctx:()=>ctxP(anyP(['moeder','vader'])),x:c=>`${Pe(c).first} zit op de bank met de camera klaar. Je staat wiebelig op je beentjes...`,ch:[
 ['🚶 Lopen!',c=>{hea(2);rel_(findAny(c.id),5);return `Vier stapjes, dan plof je op je billen. ${Pe(c).first} juicht alsof je een marathon hebt gelopen.`}],
 ['🧸 Toch maar kruipen',()=>'Kruipen gaat sneller. Lopen komt later wel.']]});
E('k_nachtmerrie',{a:[3,8],t:'Een nachtmerrie',ctx:()=>ctxP(anyP(['moeder','vader'])),x:c=>`Je droomt dat er een monster onder je bed zit. Het is midden in de nacht.`,ch:[
 ['🛏️ Bij je ouders in bed kruipen',c=>{rel_(findAny(c.id),4);hap(2);return `${Pe(c).first} slaapt slecht, maar jij als een roos.`}],
 ['🔦 Zelf onder het bed kijken',()=>{hap(1);return 'Er ligt alleen een sok. Je bent een held.'}]]});
E('k_logeren',{a:[4,11],c:()=>bigOn()&&living(['opa','oma']).length,t:'Logeren bij opa en oma',ctx:()=>ctxP(anyP(['opa','oma'])),x:c=>`Je mag een weekend logeren bij ${Pe(c).first}.`,ch:[
 ['🍪 Koekjes bakken',c=>{rel_(findAny(c.id),10);sk('koken',2);hap(4);return `Jullie bakken drie bakplaten vol. ${Pe(c).first} laat je overal van proeven.`}],
 ['🃏 Kaartspelletjes',c=>{rel_(findAny(c.id),8);sma(1);return `${Pe(c).first} laat je winnen. Denk je.`}],
 ['📺 De hele dag tv kijken',c=>{rel_(findAny(c.id),3);hap(3);return 'Bij opa en oma mag alles.'}]]});
E('k_ruzie_sib',{a:[4,15],c:()=>living(['broer','zus']).some(p=>pAge(p)>=3),t:'Ruzie met je broer of zus',ctx:()=>ctxP(pick(living(['broer','zus']).filter(p=>pAge(p)>=3))),x:c=>`${Pe(c).first} wil per se de afstandsbediening. Jij was eerst.`,ch:[
 ['🤝 Om de beurt',c=>{rel_(findAny(c.id),4);kar(1);return 'Jullie spreken af om de beurt te kiezen. Wie had dat gedacht.'}],
 ['😤 Niet toegeven',c=>{rel_(findAny(c.id),-6);if(chance(.4)){relAdj('moeder',-3);return 'Het eindigt in een gevecht om de afstandsbediening. Jullie krijgen allebei straf.'}hap(1);return 'Je wint. Deze keer.'}],
 ['📣 Mama roepen',c=>{rel_(findAny(c.id),-3);return `${Pe(c).first} noemt je een klikspaan.`}]]});
E('k_kinderfeest',{a:[5,11],t:'Je verjaardagsfeest',x:'Je mag een feestje geven. Wat voor feest wordt het?',ch:[
 ['🏊 Zwemfeest',()=>{hap(5);if(chance(.5))addFriend();return 'Iedereen ligt de hele middag in het water. Fantastisch.'}],
 ['🎳 Bowlen',()=>{hap(5);if(chance(.5))addFriend();return 'Jij gooit de enige strike van de middag.'}],
 ['🏠 Thuis met taart',()=>{hap(3);relAdj('moeder',3);return 'Klein, maar gezellig.'}]]});
E('k_zwemles',{a:[5,8],once:1,t:'Afzwemmen',x:'Vandaag doe je examen voor je zwemdiploma A. Je moet door een gat in het zeil duiken.',ch:[
 ['🏊 Ervoor gaan 🎮',()=>evMg('Afzwemmen','🏊','Zwemles',f=>mgReact({title:'Afzwemmen',desc:'Duik precies op het fluitsignaal.',em:'🏊',idle:'🧍',go:'📣',goTxt:'Fluit!',btn:'Duiken!'},(h,n)=>f(h/n)),sc=>{if(sc>=.67){S.flags.zwem=1;hap(6);hea(2);return 'Geslaagd! Je krijgt je diploma en een patatje.'}hap(-1);return 'Je schrikt van het zeil. Volgende maand nog een keer.'})],
 ['😢 Je durft niet',()=>'Je blijft op de kant staan. Volgende keer beter.']]});
E('k_sint',{a:[6,9],once:1,c:()=>S.p.country==='NL'||S.p.country==='BE',t:'Sinterklaas',ctx:()=>ctxP(anyP(['broer','zus'])),x:c=>`${c.id?Pe(c).first:'Een klasgenoot'} zegt dat Sinterklaas niet bestaat.`,ch:[
 ['😮 Het je ouders vragen',()=>{relAdj('moeder',3);return 'Je ouders vertellen het voorzichtig. Je bent stiekem een beetje trots dat je het zelf doorhad.'}],
 ['🙉 Gewoon niet geloven',()=>{hap(2);return 'Je zet gewoon je schoen. Je krijgt chocoladeletters. Zie je wel.'}]]});
E('k_zakgeld',{a:[8,12],c:()=>living(['moeder','vader']).length,t:'Meer zakgeld?',ctx:()=>ctxP(anyP(['moeder','vader'])),x:c=>'Al je vrienden krijgen meer zakgeld dan jij.',ch:[
 ['📝 Een overtuigend plan presenteren',c=>{if(chance(.4+S.st.smarts/250)){rel_(findAny(c.id),3);cash(50);return `${Pe(c).first} is onder de indruk. Je krijgt meer zakgeld.`}return `${Pe(c).first} lacht en zegt nee.`}],
 ['🧹 Klusjes aanbieden',c=>{rel_(findAny(c.id),5);cash(30);return 'Voor elk klusje krijg je een euro. Je stofzuigt het hele huis.'}],
 ['😭 Zeuren',c=>{rel_(findAny(c.id),-3);return 'Zeuren werkt niet. Nooit.'}]]});
// ---- tieners ----
E('t_bijbaan',{a:[13,16],c:()=>!S.job,t:'Een klusje in de buurt',ctx:()=>({w:pick(['De buurvrouw zoekt een oppas voor vrijdagavond.','Iemand zoekt een krantenbezorger voor de zaterdag.','De buurman wil dat je zijn auto wast.'])}),x:c=>c.w,ch:[
 ['💪 Doen',()=>{const k=ri(15,60);cash(k);kar(1);return `Je verdient ${fmt(k)}. Je eerste eigen geld!`}],
 ['🛋️ Geen zin',()=>'Je blijft liever op de bank.']]});
E('t_avondklok',{a:[14,17],c:()=>living(['moeder','vader']).length,t:'Hoe laat thuis?',ctx:()=>ctxP(anyP(['moeder','vader'])),x:c=>`${Pe(c).first} wil dat je om 23.00 uur thuis bent. Je vrienden blijven tot 1 uur.`,ch:[
 ['🤝 Onderhandelen',c=>{if(chance(.5+(findAny(c.id)?.rel||50)/200)){rel_(findAny(c.id),2);hap(3);return `Je mag tot half 1 blijven. Deal.`}return `${Pe(c).first} geeft niet toe.`}],
 ['🌙 Stiekem later thuiskomen',c=>{hap(3);if(chance(.45)){rel_(findAny(c.id),-10);return `${Pe(c).first} zit op de bank te wachten. Twee weken huisarrest.`}return 'Je sluipt om 2 uur naar binnen. Niemand merkt iets.'}],
 ['🙂 Gewoon op tijd thuis',c=>{rel_(findAny(c.id),5);return 'Je ouders zijn trots. Je vrienden plagen je een beetje.'}]]});
E('t_vriendprobleem',{a:[12,25],c:()=>living('vriend').length,t:'Een vriend in de knoop',ctx:()=>ctxP(anyP('vriend')),x:c=>{const p=Pe(c);return `${p.first} vertrouwt je toe dat ${hz(p)} ${pick(['thuis veel ruzie heeft','zich al weken somber voelt','gepest wordt','een geheim heeft dat niemand mag weten'])}.`},ch:[
 ['🫂 Luisteren en steunen',c=>{rel_(findAny(c.id),12);kar(2);return `Je luistert een hele avond. ${Pe(c).first} is je ontzettend dankbaar.`}],
 ['🧑‍🏫 Iemand anders inschakelen',c=>{if(chance(.6)){rel_(findAny(c.id),6);kar(2);return `${Pe(c).first} krijgt de hulp die ${hz(Pe(c))} nodig heeft.`}rel_(findAny(c.id),-8);return `${Pe(c).first} voelt zich verraden.`}],
 ['🤷 Er niet op ingaan',c=>{rel_(findAny(c.id),-10);return `${Pe(c).first} trekt zich terug.`}]]});
E('t_eerstekus',{a:[13,17],once:1,c:()=>!!partner(),t:'De eerste kus',ctx:()=>ctxP(partner()),x:c=>`Je loopt met ${Pe(c).first} naar huis. Het is stil. Jullie kijken elkaar aan...`,ch:[
 ['💋 Kussen',c=>{rel_(findAny(c.id),12);hap(8);return 'Jullie botsen met jullie neuzen, maar het telt.'}],
 ['😳 Snel gedag zeggen',c=>{rel_(findAny(c.id),-3);return 'Je zwaait onhandig en rent naar binnen.'}]]});
// ---- studenten ----
E('s_tentamen',{a:[17,30],c:()=>!!S.edu.cur&&!['basis','middel'].includes(S.edu.stage),t:'Tentamenweek',ctx:()=>ctxP(circP('school',false)),x:c=>`Morgen is je zwaarste tentamen. ${Pe(c).first} vraagt of je meegaat naar een feest.`,ch:[
 ['📚 Blokken in de bieb 🎮',()=>evMg('Blokken','📚','Studie',f=>mgCode({title:'Blokken',desc:'Onthoud de formules voor morgen.',em:'📚',len:5},(h,n)=>f(h/n)),sc=>{const c=S.edu.cur;if(c)c.perf=clamp(c.perf+Math.round(sc*12));sma(Math.round(sc*2));return sc>=.8?'Je kent alles uit je hoofd. Een 8!':sc>=.4?'Je haalt een voldoende.':'Je zat te gapen. Herkansing in juli.'})],
 ['🍻 Toch naar het feest',c=>{hap(5);rel_(findAny(c.id),6);const s=S.edu.cur;if(s)s.perf=clamp(s.perf-8);return 'Een geweldig feest. Het tentamen ging een stuk minder.'}]]});
E('s_kamer',{a:[18,24],c:()=>!!S.edu.cur&&S.home.k==='ouders',t:'Op kamers?',x:'Er komt een studentenkamer vrij in de stad: €450 per maand, gedeelde badkamer met zeven huisgenoten.',ch:[
 ['🏠 Ja, op kamers!',()=>{setRent('Studentenkamer',Math.round(5400*(S.cpi||1)));hap(6);if(chance(.5))addFriend();return 'Je eigen plek. Met een koelkast vol etiketjes.'}],
 ['🛋️ Thuis blijven wonen',()=>{relAdj('moeder',2);return 'Je spaart een hoop geld. En je moeder kookt.'}]]});
// ---- werk, per soort baan ----
E('w_zorg',{a:[18,67],c:()=>jg()==='zorg',w:1.2,t:'Spoed op de afdeling',ctx:()=>ctxP(circP('work',false)),x:c=>`Een patiënt valt plotseling weg. ${Pe(c).first} is nog bij een andere patiënt.`,ch:[
 ['❤️ Zelf reanimeren 🎮',()=>evMg('Reanimeren','❤️','Werk',f=>mgRhythm({title:'Reanimeren',desc:'Druk op de maat: 100 tot 120 keer per minuut.',em:'❤️',n:12,notes:['💗'],btn:'Druk!',speed:1.1},f),sc=>{if(sc>=.6){(S.job&&(S.job.perf=clamp(S.job.perf+8)));kar(5);MS('Redde een leven op het werk',1);return 'Het hart slaat weer. Je collega\'s kijken je vol bewondering aan.'}(S.job&&(S.job.perf=clamp(S.job.perf+2)));return 'Je doet wat je kunt. Het reanimatieteam neemt het over.'})],
 ['📟 Het reanimatieteam oproepen',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+3)));return 'Binnen een minuut staat het team naast het bed. Goed gehandeld.'}]]});
E('w_horeca',{a:[16,67],c:()=>jg()==='horeca',w:1.2,t:'Volle bak',ctx:()=>ctxP(circP('work',false)),x:c=>`Het is zaterdagavond, het terras zit vol en ${Pe(c).first} heeft zich ziek gemeld.`,ch:[
 ['🏃 Alles zelf rennen 🎮',()=>evMg('Volle bak','🍽️','Werk',f=>mgDodge({title:'Bedienen',desc:'Loop met je dienblad tussen de tafels door zonder te botsen.',em:'🍽️',me:'🍽️',obs:['🪑','🧒','🐕','🛵'],secs:12},(l,t)=>f(l/t)),sc=>{const tip=Math.round(ri(40,160)*sc*(S.cpi||1));cash(tip);(S.job&&(S.job.perf=clamp(S.job.perf+Math.round(sc*8))));return sc>=.67?`Je vliegt over het terras. ${fmt(tip)} aan fooi!`:`Er sneuvelen een paar glazen, maar je overleeft de avond. ${fmt(tip)} fooi.`})],
 ['📞 Een invaller bellen',c=>{rel_(findAny(c.id),-2);return 'Na een uur komt er hulp. Het blijft een lange avond.'}]]});
E('w_tech',{a:[18,67],c:()=>jg()==='tech',w:1.2,t:'Alles ligt plat',ctx:()=>ctxP(circP('work',true)),x:c=>`Om 2 uur 's nachts belt ${Pe(c).first}: de website ligt plat en klanten kunnen niet betalen.`,ch:[
 ['💻 Inloggen en het oplossen 🎮',()=>evMg('Storing','💻','Werk',f=>mgCode({title:'Debuggen',desc:'Onthoud de foutcode uit de logs en voer de fix in.',em:'💻',len:5,sym:['0','1','2','3','4','5','6','7','8','9']},(h,n)=>f(h/n)),sc=>{if(sc>=.8){(S.job&&(S.job.perf=clamp(S.job.perf+8)));sk('tech',2);return 'Binnen twintig minuten draait alles weer. Je baas stuurt een bedankje met drie uitroeptekens.'}(S.job&&(S.job.perf=clamp(S.job.perf+2)));hea(-1);return 'Om 6 uur draait het weer. Je bent kapot.'})],
 ['😴 Telefoon op stil',c=>{(S.job&&(S.job.perf=clamp(S.job.perf-8)));rel_(findAny(c.id),-8);return 'De volgende ochtend heb je 23 gemiste oproepen.'}]]});
E('w_kantoor',{a:[18,67],c:()=>jg()==='kantoor',w:1.2,t:'Presentatie voor de directie',ctx:()=>ctxP(circP('work',true)),x:c=>`${Pe(c).first} wil dat jij morgen de cijfers presenteert aan de directie.`,ch:[
 ['📊 Ja, ik doe het 🎮',()=>evMg('Presentatie','📊','Werk',f=>mgCode({title:'Je presentatie',desc:'Onthoud de belangrijkste cijfers.',em:'📊',len:4},(h,n)=>f(h/n)),sc=>{if(!S.job)return 'Je werkt daar niet meer.';(S.job&&(S.job.perf=clamp(S.job.perf+Math.round((sc-.4)*20))));sk('sociaal',1);return sc>=.75?'Je weet alles uit je hoofd. De directeur vraagt naar je naam.':sc>=.5?'Een degelijke presentatie.':'Je haalt een paar cijfers door elkaar. Ongemakkelijk.'})],
 ['🙅 Iemand anders laten doen',c=>{rel_(findAny(c.id),-3);return 'Je collega doet het. En krijgt de complimenten.'}]]});
E('w_onderwijs',{a:[20,67],c:()=>jg()==='onderwijs',w:1.2,t:'Een onrustige klas',x:'Je klas is vandaag niet te houden. Er vliegt een propje papier door het lokaal.',ch:[
 ['📣 Streng optreden',()=>{if(chance(.6)){(S.job&&(S.job.perf=clamp(S.job.perf+4)));return 'Het is muisstil. Respect.'}hap(-1);return 'Het werkt averechts. De klas lacht.'}],
 ['🎲 Een spelletje inzetten',()=>{if(chance(.7)){(S.job&&(S.job.perf=clamp(S.job.perf+6)));hap(2);return 'Met een quiz krijg je de klas weer mee. Ze leren er zelfs iets van.'}return 'Het spel wordt een chaos.'}],
 ['🚪 De dader eruit sturen',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+2)));return 'De rest snapt het wel.'}]]});
E('w_handwerk',{a:[18,67],c:()=>jg()==='handwerk',w:1.1,t:'Gevaar op de bouw',ctx:()=>ctxP(circP('work',false)),x:c=>`${Pe(c).first} staat op een wankele steiger. Een plank schuift weg!`,ch:[
 ['🧍 Erheen rennen en vangen 🎮',()=>evMg('Op de bouw','🏗️','Werk',f=>mgReact({title:'Snel!',desc:'Grijp de plank op het moment dat hij valt.',em:'🏗️',idle:'🪵',go:'⬇️',goTxt:'Nu!',btn:'Grijpen!',win:550,rounds:1},(h,n)=>f(h/n)),sc=>{if(sc>=1){(S.job&&(S.job.perf=clamp(S.job.perf+6)));kar(3);return 'Je grijpt de plank op tijd. Je collega trakteert de hele week op koffie.'}hea(-ri(3,10));return 'Je bent net te laat. Gelukkig loopt het met een paar blauwe plekken af.'})],
 ['📣 Keihard waarschuwen',c=>{rel_(findAny(c.id),4);return `${Pe(c).first} springt op tijd opzij.`}]]});
E('w_ziekcollega',{a:[18,67],c:()=>S.job&&S.job.id!=='prosport',t:'Invallen?',ctx:()=>ctxP(circP('work',false)),x:c=>`${Pe(c).first} vraagt of je volgende week een paar diensten wilt overnemen.`,ch:[
 ['🤝 Natuurlijk',c=>{rel_(findAny(c.id),10);hap(-1);return `${Pe(c).first} is je ontzettend dankbaar.`}],
 ['🙅 Sorry, kan niet',c=>{rel_(findAny(c.id),-4);return 'Jammer, maar begrijpelijk.'}]]});
E('w_rivaal',{a:[20,65],c:()=>S.job&&!S.job.part&&S.job.id!=='prosport'&&S.job.lyrs>=1,t:'Concurrentie',ctx:()=>ctxP(circP('work',false)),x:c=>`${Pe(c).first} wil dezelfde promotie als jij en probeert bij de baas in een goed blaadje te komen.`,ch:[
 ['💪 Nog harder werken',()=>{(S.job&&(S.job.perf=clamp(S.job.perf+6)));hea(-1);return 'Je laat je werk spreken.'}],
 ['🗣️ Roddelen over je rivaal',c=>{kar(-3);if(chance(.6)){rel_(findAny(c.id),-15);(S.job&&(S.job.perf=clamp(S.job.perf+3)));return 'Het werkt. Voorlopig.'}return 'Het komt uit. Nu ben jij degene met een slechte naam.'+report('work',1,'')}],
 ['🤝 Samenwerken',c=>{rel_(findAny(c.id),8);(S.job&&(S.job.perf=clamp(S.job.perf+2)));return 'Jullie besluiten elkaar niet dwars te zitten.'}]]});
// ---- relaties en familie ----
E('r_partnerjarig',{a:[16,100],c:()=>!!partner(),cd:3,t:'Verjaardag',ctx:()=>ctxP(partner()),x:c=>`${Pe(c).first} is jarig. Wat geef je?`,ch:[
 ['🎁 Een groot cadeau',c=>{const k=Math.round(ri(150,600)*(S.cpi||1));cash(-k);rel_(findAny(c.id),12);return `Je geeft iets wat ${Pe(c).first} al jaren wil hebben. ${fmt(k)}, maar dat gezicht is onbetaalbaar.`},()=>S.money>=150],
 ['💌 Iets zelfgemaakts',c=>{rel_(findAny(c.id),chance(.6)?10:2);return 'Je maakt een fotoboek vol herinneringen.'}],
 ['😬 Vergeten',c=>{rel_(findAny(c.id),-15);return `${Pe(c).first} hoort het pas 's avonds van je. Ijzige sfeer.`}]]});
E('r_jubileum',{a:[25,100],c:()=>{const p=partner();return p&&p.st==='getrouwd'&&p.since!=null&&ageY()-p.since>=5},cd:5,t:'Trouwdag',ctx:()=>ctxP(partner()),x:c=>`Jij en ${Pe(c).first} zijn alweer ${ageY()-Pe(c).since} jaar samen.`,ch:[
 ['🍷 Uit eten in een sterrenrestaurant',c=>{cash(-Math.round(400*(S.cpi||1)));rel_(findAny(c.id),12);hap(5);return 'Negen gangen en een speech die je niet had voorbereid. Prachtig.'},()=>S.money>=400],
 ['🏡 Gezellig thuis',c=>{rel_(findAny(c.id),6);return 'Jullie kijken oude foto\'s terug.'}],
 ['💍 Opnieuw ja zeggen',c=>{cash(-Math.round(5000*(S.cpi||1)));rel_(findAny(c.id),20);hap(8);return 'Jullie vernieuwen jullie geloften op het strand.'},()=>S.money>=5000]]});
E('r_schoonmoeder',{a:[20,90],c:()=>bigOn()&&living('schoonmoeder').length&&!!partner(),t:'Op bezoek bij je schoonmoeder',ctx:()=>ctxP(living('schoonmoeder')[0]),x:c=>`${Pe(c).first} heeft gekookt en vindt dat je te weinig eet.`,ch:[
 ['🍽️ Twee keer opscheppen',c=>{rel_(findAny(c.id),10);hea(-1);const p=partner();if(p)p.rel=clamp(p.rel+3);return 'Je kunt niet meer bewegen, maar je schoonmoeder straalt.'}],
 ['🥗 Beleefd weigeren',c=>{rel_(findAny(c.id),-5);return `${Pe(c).first} vraagt of je ziek bent.`}]]});
E('r_verhuizen',{a:[18,70],c:()=>living('vriend').length,t:'Verhuishulp',ctx:()=>ctxP(anyP('vriend')),x:c=>`${Pe(c).first} gaat verhuizen en zoekt sterke armen voor zaterdag.`,ch:[
 ['📦 Helpen sjouwen',c=>{rel_(findAny(c.id),10);hea(chance(.2)?-3:1);return 'Een bank door een trappenhuis. Je hebt spierpijn, maar ook pizza.'}],
 ['🙈 Een smoes verzinnen',c=>{rel_(findAny(c.id),-6);return `${Pe(c).first} weet heus wel dat je niet "ziek" was.`}]]});
E('r_ouderziek',{a:[25,80],c:()=>living(['moeder','vader']).some(p=>pAge(p)>=60),t:'Slecht nieuws',ctx:()=>ctxP(pick(living(['moeder','vader']).filter(p=>pAge(p)>=60))),x:c=>`${Pe(c).first} belt: de dokter heeft iets gevonden. Er volgen onderzoeken.`,ch:[
 ['🚗 Meteen langsgaan',c=>{rel_(findAny(c.id),12);const p=findAny(c.id);if(p)p.hl=Math.min(100,(p.hl??70)+8);return `Je gaat mee naar elk onderzoek. ${Pe(c).first} is blij dat je er bent.`}],
 ['📞 Bellen als je tijd hebt',c=>{rel_(findAny(c.id),-4);return 'Je belt een paar keer. Het voelt niet genoeg.'}]]});
E('r_kinddiploma',{a:[35,90],c:()=>living('kind').some(k=>pAge(k)>=17&&pAge(k)<=19),cd:2,t:'Geslaagd!',ctx:()=>ctxP(pick(living('kind').filter(k=>pAge(k)>=17&&pAge(k)<=19))),x:c=>`${Pe(c).first} is geslaagd voor de middelbare school!`,ch:[
 ['🎉 Een groot feest geven',c=>{cash(-Math.round(800*(S.cpi||1)));rel_(findAny(c.id),10);hap(8);return 'De vlag met de schooltas hangt uit. Het hele huis staat vol.'}],
 ['🎁 Een mooi cadeau',c=>{cash(-Math.round(300*(S.cpi||1)));rel_(findAny(c.id),7);hap(5);return 'Je bent apetrots.'}]]});
E('r_kleinkinderen',{a:[55,100],c:()=>living('kleinkind').some(k=>pAge(k)>=3&&pAge(k)<=12),t:'De kleinkinderen logeren',ctx:()=>ctxP(pick(living('kleinkind').filter(k=>pAge(k)>=3&&pAge(k)<=12))),x:c=>`${Pe(c).first} komt een weekend logeren.`,ch:[
 ['🍪 Verwennen',c=>{rel_(findAny(c.id),12);hap(5);return 'Pannenkoeken als ontbijt, lunch én avondeten.'}],
 ['🌳 Naar de speeltuin',c=>{rel_(findAny(c.id),10);hea(1);return 'Je zit op de wip. Je knieën zijn het er niet mee eens.'}]]});
// ---- bezit, geld en status ----
E('b_kras',{a:[18,90],c:()=>S.cars.length>0,t:'Kras op je auto',ctx:()=>{const c=pick(S.cars);return {car:c.name}},x:c=>`Iemand heeft een lange kras over je ${c.car} gezet.`,ch:[
 ['🔧 Laten spuiten',c=>{const k=Math.round(ri(400,1400)*(S.cpi||1));cash(-k);return `Het kost ${fmt(k)}, maar hij is weer als nieuw.`}],
 ['🤷 Laten zitten',c=>{const x=S.cars.find(y=>y.name===c.car);if(x)x.value=Math.round(x.value*.97);return 'Het is maar een auto. Al doet het pijn.'}]]});
E('b_schutting',{a:[25,95],c:()=>S.home.k==='eigen',t:'Burenruzie',x:'Je buren beweren dat jouw schutting een halve meter op hun grond staat.',ch:[
 ['🤝 Samen uitmeten',()=>{if(chance(.6)){kar(2);return 'Het blijkt mee te vallen. Jullie drinken samen een biertje.'}cash(-Math.round(1500*(S.cpi||1)));return 'Ze hebben gelijk. Je zet de schutting een stukje terug.'}],
 ['⚖️ Een advocaat inschakelen',()=>{const k=Math.round(3000*(S.cpi||1));cash(-k);if(chance(.5))return `Je wint. Kosten: ${fmt(k)}. Gezellig wordt het nooit meer.`;return `Je verliest én betaalt ${fmt(k)}.`}],
 ['🙄 Negeren',()=>{hap(-1);return 'De buren groeten je niet meer.'}]]});
E('b_goeddoel',{a:[25,100],c:()=>netWorth()>=1e6,t:'Een goed doel klopt aan',ctx:()=>({w:pick(['een kinderziekenhuis','de dierenambulance','een school in Ghana','onderzoek naar Alzheimer'])}),x:c=>`Je bent bekend geworden als iemand met geld. ${cap(c.w)} vraagt om een donatie.`,ch:[
 ['💝 Royaal geven',c=>{const k=Math.round(Math.min(Math.max(0,S.money),(netWorth()-(S.swiss||0))*.02));cash(-k);kar(10);hap(5);S.fame=clamp(S.fame+2);MS(`Doneerde ${fmt(k)} aan ${c.w}`,1);return `Je geeft ${fmt(k)}. Er komt een bordje met jouw naam.`}],
 ['💶 Een klein bedrag',()=>{const k=Math.round(500*(S.cpi||1));cash(-k);kar(2);return `Je geeft ${fmt(k)}.`}],
 ['🙅 Nee',()=>{kar(-1);return 'Je hebt het geld zelf nodig. Zeg je.'}]]});
E('b_incasso',{a:[18,100],c:()=>S.money<-2000,cd:2,t:'Een brief van het incassobureau',x:()=>`Je staat ${fmt(-S.money)} rood en het incassobureau dreigt met beslag.`,ch:[
 ['📋 Een betalingsregeling treffen',()=>{kar(1);return 'Je betaalt het in kleine stukjes terug. Het wordt een paar zware jaren.'}],
 ['🏦 Lenen om het af te lossen',()=>{const k=Math.round(-S.money);S.loan+=k;cash(k);return `Je leent ${fmt(k)}. Het probleem schuift op.`}],
 ['🙈 De brief weggooien',()=>{const k=Math.round(500*(S.cpi||1));cash(-k);hap(-2);return `Er komen ${fmt(k)} aan extra kosten bij.`}]]});
E('b_storm',{a:[18,90],c:()=>(S.items||[]).some(i=>catOf(i)==='boten'),t:'Storm op zee',ctx:()=>({b:(S.items.find(i=>catOf(i)==='boten')||{}).name}),x:c=>`Je bent aan het varen met je ${c.b} als er plotseling een storm opsteekt.`,ch:[
 ['⚓ Zelf naar de haven sturen 🎮',c=>evMg('Storm op zee','🌊','Bezit',f=>mgDodge({title:'Storm!',desc:'Stuur je boot tussen de golven en rotsen door naar de haven.',em:'🌊',me:'⛵',obs:['🌊','🪨','🌊'],secs:12,speed:1.1},(l,t)=>f(l/t)),sc=>{const x=S.items.find(i=>i.name===c.b);if(sc>=.67){sk('sport',2);hap(4);return 'Je loodst je boot de haven in. Wat een avontuur.'}if(x)x.cond=Math.max(0,(x.cond??100)-ri(20,50));hea(-ri(2,8));return 'Je haalt het, maar je boot is flink beschadigd.'})],
 ['📻 De reddingsbrigade oproepen',()=>{kar(1);return 'Een uur later word je naar de haven gesleept. Je boot volgt.'}]]});
// ---- ouderen ----
E('o_keuring',{a:[75,100],c:()=>S.lic,cd:5,t:'Rijbewijskeuring',x:'Vanaf je 75e moet je laten keuren of je nog mag rijden.',ch:[
 ['🚗 De rijtest doen 🎮',()=>evMg('Rijtest','🚗','Keuring',f=>mgReact({title:'Reactietest',desc:'Rem zodra het stoplicht op rood springt.',em:'🚦',idle:'🟢',go:'🔴',fake:'🟡',goTxt:'REMMEN!',btn:'Rem!',win:800},(h,n)=>f(h/n)),sc=>{if(sc>=.67)return 'Prima reflexen. Je mag nog vijf jaar rijden.';S.lic=false;hap(-4);return 'Je bent te traag. Je rijbewijs wordt ingenomen.'})],
 ['🚌 Het rijbewijs inleveren',()=>{S.lic=false;kar(1);return 'Je kiest zelf voor de bus en de taxi. Verstandig.'}]]});
E('o_vergeten',{a:[70,105],t:'Waar zijn mijn sleutels?',ctx:()=>ctxP(anyP(['kind','partner'])),x:c=>`Je zoekt al een uur naar je sleutels. ${c.id?Pe(c).first+' vindt ze in de koelkast.':'Je vindt ze in de koelkast.'}`,ch:[
 ['😂 Erom lachen',()=>{hap(1);return 'Iedereen vergeet weleens iets.'}],
 ['🩺 Naar de huisarts',()=>{if(chance(.2)&&!S.ill.some(i=>i.n==='Alzheimer')){S.ill.push({n:'Alzheimer',sev:6,l:1});return 'De huisarts verwijst je door. Het nieuws is niet goed: beginnende Alzheimer.'}hea(1);return 'Gewoon ouderdom, zegt de dokter. Niets ernstigs.'}]]});
// ---- land en tijd van het jaar ----
E('l_koningsdag',{a:[6,90],c:()=>S.p.country==='NL',cd:4,t:'Koningsdag',x:'Het hele land is oranje. Wat doe je?',ch:[
 ['🧺 Spullen verkopen op de vrijmarkt',()=>{const k=ri(15,140);cash(k);hap(3);return `Je verkoopt je oude spullen voor ${fmt(k)}.`}],
 ['🎉 Feesten in de stad',()=>{hap(5);if(ageY()>=16)addUp('alcohol',3);if(chance(.15)){const f=addFriend();if(f)return `Je maakt een nieuwe vriend: ${f.first}.`}return 'Oranje van top tot teen.'}],
 ['🛋️ Thuisblijven',()=>'Je hoort de muziek tot diep in de nacht.']]});
E('l_fiets',{a:[8,80],c:()=>S.p.country==='NL',cd:3,t:'Fiets gestolen',x:'Je fiets is weg. Het slot ligt doorgeknipt op de grond.',ch:[
 ['🚲 Een nieuwe kopen',()=>{cash(-Math.round(ri(150,700)*(S.cpi||1)));return 'Een nieuwe fiets. Met twee sloten deze keer.'}],
 ['🕵️ Marktplaats afspeuren',()=>{if(chance(.2))return 'Je vindt je fiets terug in een advertentie. De politie haalt hem op.';return 'Geen spoor. Hij is weg.'}]]});
// ---- huisdieren ----
E('p_weggelopen',{a:[6,90],c:()=>living('huisdier').some(p=>['hond','kat'].includes(p.sp)),t:'Weggelopen',ctx:()=>ctxP(pick(living('huisdier').filter(p=>['hond','kat'].includes(p.sp)))),x:c=>`${Pe(c).first} is weggelopen en komt niet meer terug.`,ch:[
 ['🔦 Zelf gaan zoeken 🎮',c=>evMg('Zoeken','🔦','Huisdier',f=>mgReact({title:'Zoeken',desc:'Roep zodra je iets ziet bewegen in de bosjes.',em:'🔦',idle:'🌳',go:Pe(c).sp==='kat'?'🐈':'🐕',fake:'🐿️',goTxt:'Daar!',btn:'Roepen!'},(h,n)=>f(h/n)),sc=>{const p=findAny(c.id);if(sc>=.34){rel_(p,10);hap(4);return `Je vindt ${Pe(c).first} terug! Moe, maar blij.`}if(p){p.alive=false;p.gone=1}hap(-8);return `${Pe(c).first} komt nooit meer terug.`})],
 ['📄 Posters ophangen',c=>{if(chance(.6)){hap(3);return `Een buurvrouw belt: ${Pe(c).first} zit in haar schuur!`}const p=findAny(c.id);if(p){p.alive=false;p.gone=1}hap(-8);return 'Niemand heeft iets gezien.'}]]});
// ---- hobby's ----
E('h_kans',{a:[12,90],c:()=>Object.values(S.hob||{}).some(v=>v>=50),cd:3,t:'Je wordt opgemerkt',ctx:()=>{const k=pick(Object.keys(S.hob).filter(k=>S.hob[k]>=50));return {k}},x:c=>`Iemand heeft gezien hoe goed je bent in ${HOBBY[c.k][1].toLowerCase()} en wil je werk gebruiken.`,ch:[
 ['🤝 Ingaan op het aanbod',c=>{const g=Math.round(S.hob[c.k]*ri(10,40)*(S.cpi||1));cash(g);S.fame=clamp(S.fame+1);hap(5);return `Je verdient ${fmt(g)} met je hobby.`}],
 ['🙅 Het blijft een hobby',()=>'Je doet het voor je plezier.']]});
// ---- heldendaden: jij kiest of je de minigame doet ----
E('m_water',{a:[10,75],w:.5,t:'Iemand in het water',x:'Bij de gracht schreeuwt een kind om hulp. Het spartelt in het water.',ch:[
 ['🏊 Erin springen 🎮',()=>evMg('Redding','🏊','Heldendaad',f=>mgDodge({title:'Zwemmen!',desc:'Zwem naar het kind en ontwijk het drijvende afval.',em:'🏊',me:'🏊',obs:['🪵','🛢️','🚲'],secs:10},(l,t)=>f(l/t)),sc=>{if(sc>0){kar(15);hap(10);S.fame=clamp(S.fame+3);MS('Redde een kind uit het water',2);return 'Je trekt het kind op de kant. De ouders huilen van opluchting. Je staat morgen in de krant.'}hea(-ri(5,15));kar(5);return 'Je raakt zelf in de problemen. Gelukkig springt er nog iemand in en worden jullie allebei gered.'})],
 ['📞 Hulp roepen',()=>{kar(3);if(chance(.7))return 'Een voorbijganger springt erin. Het kind wordt gered.';hap(-6);return 'De hulp komt te laat. Dit laat je nooit meer los.'}],
 ['🚶 Doorlopen',()=>{kar(-15);return 'Je loopt door. Iemand anders redt het kind. Jij kijkt de rest van de dag naar je schoenen.'}]]});
E('m_reanimatie',{a:[14,85],w:.5,t:'Iemand valt neer',x:'In de supermarkt zakt een man voor je in elkaar. Hij ademt niet.',ch:[
 ['❤️ Reanimeren 🎮',()=>evMg('Reanimatie','❤️','Heldendaad',f=>mgRhythm({title:'Reanimeren',desc:'Druk op de maat, 100 tot 120 keer per minuut. Niet te snel, niet te langzaam.',em:'❤️',n:12,notes:['💗'],btn:'Druk!',speed:1.1},f),sc=>{if(sc>=.6){kar(15);hap(10);MS('Redde iemand met reanimatie',2);return 'Na een paar minuten slaat zijn hart weer. De ambulance neemt het over. Je hebt een leven gered.'}kar(6);return 'Je doet alles wat je kunt. Het ambulanceteam neemt het over. Je hoort nooit hoe het afliep.'})],
 ['📞 112 bellen',()=>{kar(3);return 'Je belt 112 en iemand anders begint te reanimeren.'}],
 ['🚶 Wegkijken',()=>{kar(-12);return 'Je loopt naar de kassa. Achter je klinkt geschreeuw.'}]]});
E('m_inbreker',{a:[16,95],w:.5,c:()=>S.home.k!=='ouders',t:'Een inbreker!',x:'Midden in de nacht hoor je beneden glas breken. Er is iemand in huis.',ch:[
 ['👊 Op hem af 🎮',()=>({go:()=>fightFlow({foe:{first:'De inbreker',sk:ri(20,55),hp:ri(70,95)},title:'Inbreker',cat:'Heldendaad',next:processQ,kill:()=>{},end:res=>{if(res==='win'){kar(5);S.fame=clamp(S.fame+1);return 'Je overmeestert de inbreker en houdt hem vast tot de politie er is.'}if(res==='flee')return 'Je vlucht naar boven en belt 112. De inbreker gaat er met je laptop vandoor.';const k=Math.round(ri(500,3000)*(S.cpi||1));cash(-k);return `De inbreker slaat je neer en neemt spullen ter waarde van ${fmt(k)} mee.`}})})],
 ['📞 De politie bellen',()=>{if(chance(.5)){kar(1);return 'De politie is er binnen vijf minuten en pakt de inbreker op.'}const k=Math.round(ri(300,2000)*(S.cpi||1));cash(-k);return `Voordat de politie er is, is hij al weg. Er mist voor ${fmt(k)} aan spullen.`}],
 ['🛏️ Onder de dekens blijven',()=>{const k=Math.round(ri(500,4000)*(S.cpi||1));cash(-k);hap(-3);return `De volgende ochtend is je tv weg, en voor ${fmt(k)} aan andere spullen.`}]]});
E('m_tasjesdief',{a:[12,75],w:.5,t:'Tasjesdief!',x:'Iemand rukt de tas uit de handen van een oudere vrouw en rent weg.',ch:[
 ['🏃 Erachteraan 🎮',()=>evMg('Achtervolging','🏃','Heldendaad',f=>mgDodge({title:'Achtervolging',desc:'Ren door de drukke straat zonder tegen mensen op te botsen.',em:'🏃',me:'🏃',obs:['🚶','🛒','🚲','🧍'],secs:10,speed:1.2},(l,t)=>f(l/t)),sc=>{if(sc>=.67){kar(8);hap(6);return 'Je haalt de dief in en grist de tas terug. De vrouw drukt je een tientje in je hand.'}kar(2);return 'De dief is te snel. De vrouw bedankt je toch.'})],
 ['📞 De politie bellen',()=>{kar(2);return 'Je geeft een goede beschrijving. Een week later wordt de dief opgepakt.'}],
 ['🚶 Je er niet mee bemoeien',()=>{kar(-4);return 'Het gaat je niet aan. Toch?'}]]});
E('m_brand',{a:[14,80],w:.4,t:'Brand!',x:'Er komt rook uit het huis van je buren. Je hoort een hond blaffen.',ch:[
 ['🔥 Naar binnen om de hond te redden 🎮',()=>evMg('Brand','🔥','Heldendaad',f=>mgDodge({title:'Door de rook',desc:'Ontwijk de vlammen en vallende balken.',em:'🔥',me:'🧍',obs:['🔥','🪵','🔥'],secs:10,speed:1.15},(l,t)=>f(l/t)),sc=>{if(sc>0){kar(10);hap(8);S.fame=clamp(S.fame+2);MS('Redde de hond van de buren uit een brand',1);return 'Je komt naar buiten met de hond in je armen. De buren vallen je om de hals.'}hea(-ri(15,30));return 'De rook is te dik. De brandweer haalt jou eruit. Je ligt een paar dagen in het ziekenhuis.'})],
 ['🚒 De brandweer bellen',()=>{kar(3);return 'De brandweer is snel ter plaatse. De hond wordt gered.'}]]});
E('m_kat',{a:[6,60],w:.4,t:'Kat in de boom',x:'Een klein meisje huilt: haar kat zit hoog in een boom en durft niet meer naar beneden.',ch:[
 ['🧗 Erin klimmen 🎮',()=>evMg('Klimmen','🧗','Heldendaad',f=>mgDial({title:'Klimmen',desc:'Pak de takken vast als de naald in het groene stuk staat.',em:'🧗',mid:'🐈',btn:'Vastpakken'},(h,n)=>f(h/n)),sc=>{if(sc>=.67){kar(5);hap(5);return 'Je komt naar beneden met de kat. Het meisje geeft je haar mooiste tekening.'}hea(-ri(3,10));return 'Je glijdt uit en valt. De kat springt intussen zelf naar beneden.'})],
 ['🚒 De brandweer bellen',()=>{kar(1);return 'De brandweer komt met een ladder. Iedereen klapt.'}],
 ['🐟 Lokken met eten',()=>chance(.5)?(kar(2),'Met een blikje tonijn komt de kat vanzelf naar beneden.'):'De kat kijkt je aan en blijft zitten.']]});
E('m_overval',{a:[16,70],w:.35,t:'Overval in de winkel',x:'Terwijl je boodschappen doet, stormt een gemaskerde man binnen en eist het geld uit de kassa.',ch:[
 ['👊 Ingrijpen 🎮',()=>({go:()=>fightFlow({foe:{first:'De overvaller',sk:ri(25,60),hp:ri(70,95)},title:'Overval',cat:'Heldendaad',next:processQ,kill:()=>{},end:res=>{if(res==='win'){kar(10);S.fame=clamp(S.fame+3);MS('Hield een overvaller tegen',2);return 'Je werkt de overvaller tegen de grond. De winkel en de politie noemen je een held.'}if(res==='flee')return 'Je deinst terug. De overvaller gaat ervandoor.';hea(-ri(5,15));return 'De overvaller slaat je neer en vlucht.'}})})],
 ['🧎 Plat op de grond',()=>'Je houdt je stil. Na een minuut is hij weg. Niemand gewond.'],
 ['📱 Stiekem 112 bellen',()=>{if(chance(.5)){kar(4);return 'Dankzij jou staat de politie al buiten als hij naar buiten komt.'}return 'De overvaller is al weg voordat de politie er is.'}]]});
// vervang de algemene "Ingebroken" door de nieuwe met keuze
if(EV.inbraakthuis)EV.inbraakthuis.c=()=>false;

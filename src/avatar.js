/* ---------- jouw uiterlijk: getekende avatar ---------- */
const SKINS=['#fbe3d0','#f6d2b8','#efc29f','#e6b48c','#d9a074','#c88a5e','#b0714a','#8f5838','#6e4129','#4d2c1c'];
const HAIRC=['#1f1a17','#3b2a1f','#5a3a24','#7a4a2a','#a0612f','#c98f4f','#e3c07a','#b3401f','#9aa0a8','#e9e9e6'];
const EYEC=['#4a2e1c','#6b4423','#8a6a3a','#6b7f3a','#3f8a4f','#3a7ca5','#5aa9e6','#7b8794','#2b2b2b','#8b5cf6'];
const HAIRN=['Kaal','Kort','Stekeltjes','Zijscheiding','Kuif','Krullen','Afro','Bob','Lang','Knot'];
const BEARDN=['Geen','Stoppels','Snor','Sik','Ringbaard','Korte baard','Volle baard','Kinbaard','Krulsnor','Lange baard'];
const SKINN=['Porselein','Licht','Licht-beige','Beige','Gebronsd','Olijf','Karamel','Bruin','Donkerbruin','Diep donker'];
const HAIRCN=['Zwart','Donkerbruin','Bruin','Kastanje','Koper','Donkerblond','Blond','Rood','Grijs','Wit'];
const EYECN=['Donkerbruin','Bruin','Hazelnoot','Olijf','Groen','Blauw','Lichtblauw','Grijs','Zwart','Violet'];
function randAp(g){return {skin:ri(0,9),eye:ri(0,9),hc:ri(0,7),hair:g==='v'?pick([7,8,9,5,3,6]):pick([1,2,3,4,5,6,0,1]),beard:g==='m'&&chance(.4)?ri(1,9):0}}
function mixHex(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
// tekent een gezicht; age bepaalt grijs haar, rimpels en of er een baard is
function avatarSvg(ap,age=30,g='m',o={}){ap=ap||{skin:2,eye:1,hc:2,hair:1,beard:0};
  const sk=SKINS[ap.skin]??SKINS[2],skd=shade(sk,-.18),grey=age>=55?Math.min(1,(age-50)/30):0;let hc=HAIRC[ap.hc]??HAIRC[2];if(grey)hc=mixHex(hc,'#d9dadb',grey);
  const hd=shade(hc,-.25),ec=EYEC[ap.eye]??EYEC[1],kid=age<13,baby=age<3,beard=!kid&&age>=16?ap.beard||0:0,hair=baby?-1:ap.hair??1;
  let s='';const shirt=o.shirt||'#4a7bd1';
  // haar achter het hoofd
  if(hair===7)s+=`<path d="M22 50C20 28 34 15 50 15S80 28 78 50L80 74C74 78 68 76 66 72L66 50H34V72C32 76 26 78 20 74Z" fill="${hc}"/>`;
  if(hair===8)s+=`<path d="M22 48C20 26 34 14 50 14S80 26 78 48L82 92C72 96 64 94 62 90L64 56H36L38 90C36 94 28 96 18 92Z" fill="${hc}"/>`;
  if(hair===6)s+=`<circle cx="50" cy="38" r="35" fill="${hc}"/>`+[...Array(14)].map((_,i)=>{const a=i/14*Math.PI*2;return `<circle cx="${(50+Math.cos(a)*33).toFixed(1)}" cy="${(38+Math.sin(a)*33).toFixed(1)}" r="5" fill="${hc}"/>`}).join('');
  if(hair===9)s+=`<circle cx="50" cy="12" r="10" fill="${hc}"/><circle cx="50" cy="12" r="10" fill="none" stroke="${hd}" stroke-width="1"/>`;
  // nek, schouders, oren, hoofd
  if(!o.head)s+=`<path d="M12 100C14 86 28 80 40 78H60C72 80 86 86 88 100Z" fill="${shirt}"/><path d="M40 70H60V82C56 86 44 86 40 82Z" fill="${skd}"/>`;
  else s+=`<path d="M42 70H58V80C55 83 45 83 42 80Z" fill="${skd}"/>`;
  s+=`<ellipse cx="24" cy="52" rx="5.5" ry="7" fill="${sk}"/><ellipse cx="76" cy="52" rx="5.5" ry="7" fill="${sk}"/><ellipse cx="24.5" cy="52" rx="2.5" ry="3.5" fill="${skd}"/><ellipse cx="75.5" cy="52" rx="2.5" ry="3.5" fill="${skd}"/>`;
  s+=`<ellipse cx="50" cy="50" rx="${kid?25:26}" ry="${kid?28:30}" fill="${sk}"/>`;
  // baard (onder de mond)
  const B={1:`<path d="M27 56C28 74 38 82 50 82S72 74 73 56C70 66 64 70 58 70H42C36 70 30 66 27 56Z" fill="${hc}" opacity=".28"/>`,
    2:`<path d="M39 64C43 61 47 61.5 50 63C53 61.5 57 61 61 64C57 65 53 64.8 50 65.6C47 64.8 43 65 39 64Z" fill="${hc}"/>`,
    3:`<path d="M44 72C45 79 48 83 50 83S55 79 56 72C53 74 47 74 44 72Z" fill="${hc}"/>`,
    4:`<path d="M39 64C43 61 47 61.5 50 63C53 61.5 57 61 61 64C61 70 59 76 50 79C41 76 39 70 39 64ZM43 68Q50 73 57 68L56 70Q50 74 44 70Z" fill="${hc}"/>`,
    5:`<path d="M26 54C27 74 37 82 50 82S73 74 74 54C71 64 65 67 59 67C56 64 44 64 41 67C35 67 29 64 26 54Z" fill="${hc}"/>`,
    6:`<path d="M25 50C25 76 36 88 50 88S75 76 75 50C72 63 66 66 60 66C56 62 44 62 40 66C34 66 28 63 25 50Z" fill="${hc}"/>`,
    7:`<path d="M26 54C28 74 37 82 50 82S72 74 74 54C72 66 64 76 50 77C36 76 28 66 26 54Z" fill="${hc}"/>`,
    8:`<path d="M37 66C40 61 46 61 50 63.5C54 61 60 61 63 66C64 63 66 62 67 64C66 67 63 68 61 66.5C57 65 53 65.5 50 66.5C47 65.5 43 65 39 66.5C37 68 34 67 33 64C34 62 36 63 37 66Z" fill="${hc}"/>`,
    9:`<path d="M25 50C25 80 38 98 50 98S75 80 75 50C72 63 66 66 60 66C56 62 44 62 40 66C34 66 28 63 25 50Z" fill="${hc}"/><path d="M45 84l2 8M55 84l-2 8M50 86v8" stroke="${hd}" stroke-width="1"/>`};
  if(beard&&B[beard])s+=B[beard];
  // ogen, wenkbrauwen, neus, mond
  const ey=kid?51:52,er=kid?6:5.4;
  for(const x of [39,61])s+=`<ellipse cx="${x}" cy="${ey}" rx="${er}" ry="${er*.72}" fill="#fff"/><circle cx="${x}" cy="${ey}" r="${er*.55}" fill="${ec}"/><circle cx="${x}" cy="${ey}" r="${er*.26}" fill="#111"/><circle cx="${x+1.2}" cy="${ey-1.2}" r="${er*.14}" fill="#fff"/>`;
  s+=`<path d="M32 ${ey-8}Q39 ${ey-11.5} 46 ${ey-8}M54 ${ey-8}Q61 ${ey-11.5} 68 ${ey-8}" stroke="${baby?shade(sk,-.12):hd}" stroke-width="${kid?2:2.6}" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M50 ${ey+3}Q47 ${ey+11} 50 ${ey+12}Q52.5 ${ey+12} 54 ${ey+10.5}" stroke="${skd}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  s+=beard===6||beard===9?`<path d="M43 68Q50 72 57 68" stroke="#7a3a2e" stroke-width="2" fill="none" stroke-linecap="round"/>`:`<path d="M42 67Q50 74 58 67Q50 71 42 67Z" fill="#fff" stroke="#9b4a3c" stroke-width="1.6" stroke-linejoin="round"/>`;
  if(o.sad)s=s.replace(/M42 67Q50 74 58 67Q50 71 42 67Z/,'M43 71Q50 66 57 71');
  if(age>=60)s+=`<path d="M30 44q3-1 5 0M65 44q3-1 5 0M33 60q-2 3-1 6M67 60q2 3 1 6" stroke="${skd}" stroke-width="1" fill="none" opacity=".7"/>`;
  if(!kid)s+=`<ellipse cx="34" cy="62" rx="4" ry="2.4" fill="#e88b84" opacity=".25"/><ellipse cx="66" cy="62" rx="4" ry="2.4" fill="#e88b84" opacity=".25"/>`;
  // haar voorkant
  const H={1:`<path d="M24 48C22 24 36 16 50 16S78 24 76 48C74 38 68 32 60 31C54 33 44 33 38 31C31 33 26 38 24 48Z" fill="${hc}"/>`,
    2:`<path d="M24 46C22 24 36 15 50 15S78 24 76 46L72 36L68 41L64 31L59 38L54 29L50 37L46 29L41 38L36 31L32 41L28 36Z" fill="${hc}"/>`,
    3:`<path d="M24 48C22 24 36 16 50 16S78 24 76 48C74 38 70 33 64 31C56 36 40 34 34 28C30 32 26 38 24 48Z" fill="${hc}"/><path d="M36 28C44 33 54 34 62 31" stroke="${hd}" stroke-width="1.2" fill="none"/>`,
    4:`<path d="M24 48C22 26 32 18 40 14C46 8 62 6 70 14C78 20 78 34 76 48C74 38 68 33 60 32C50 35 40 32 34 30C29 34 26 40 24 48Z" fill="${hc}"/><path d="M42 16C50 10 62 10 68 16" stroke="${shade(hc,.2)}" stroke-width="1.5" fill="none"/>`,
    5:[...Array(9)].map((_,i)=>{const a=Math.PI*(.95+i*.14);return `<circle cx="${(50+Math.cos(a)*24).toFixed(1)}" cy="${(40+Math.sin(a)*22).toFixed(1)}" r="8" fill="${hc}"/>`}).join('')+`<circle cx="50" cy="22" r="10" fill="${hc}"/>`,
    6:`<path d="M24 44C26 34 34 30 50 30S74 34 76 44C76 30 66 18 50 18S24 30 24 44Z" fill="${hc}"/>`,
    7:`<path d="M22 60C18 30 34 15 50 15S82 30 78 60C76 46 72 36 64 32C56 36 42 36 36 32C28 36 24 46 22 60Z" fill="${hc}"/>`,
    8:`<path d="M23 54C20 28 34 15 50 15S80 28 77 54C75 40 70 33 62 31C54 35 40 34 33 29C27 34 24 42 23 54Z" fill="${hc}"/>`,
    9:`<path d="M24 46C22 24 36 17 50 17S78 24 76 46C74 36 68 30 60 30C54 32 46 32 40 30C32 30 26 36 24 46Z" fill="${hc}"/>`};
  if(baby)s+=`<path d="M47 22q3-6 6 0q-3-3-6 0" fill="${hc}"/>`;else if(H[hair])s+=H[hair];
  if(o.head)return SVG_(s,'13 4 74 80').replace('class="ico"','class="ico hs"');
  return SVG_(s,'0 0 100 100')}
// erfelijkheid: kinderen lijken op hun ouders
function apMix(a,b,g){a=a||randAp('m');b=b||randAp('v');const r=randAp(g);r.skin=clamp(Math.round((a.skin+b.skin)/2+ri(-1,1)),0,9);r.eye=chance(.1)?ri(0,9):pick([a.eye,b.eye]);r.hc=chance(.1)?ri(0,7):pick([a.hc,b.hc]);return r}
// ouders afleiden van een kind (de speler kiest zelf zijn uiterlijk): de een geeft de ogen, de ander de haarkleur
function apParentOf(c,g,share){const x=randAp(g);x.skin=clamp(c.skin+ri(-1,1),0,9);if(share==='eye')x.eye=c.eye;if(share==='hc')x.hc=c.hc;return x}
// voor oude saves: personen zonder uiterlijk krijgen er alsnog een dat bij de familie past
function apOf(p){if(p.ap)return p.ap;const me=S.ap||randAp(S.p.g);const par=r=>(S.rel.find(x=>x.role===r)||{}).ap;
  if(p.role==='moeder'||p.role==='vader'){const o=S.rel.find(x=>x!==p&&(x.role==='moeder'||x.role==='vader')&&x.ap);p.ap=apParentOf(me,p.g,o&&o.ap.eye===me.eye?'hc':p.role==='moeder'?'eye':'hc')}
  else if(p.role==='broer'||p.role==='zus'){const m=par('moeder')||apOf(S.rel.find(x=>x.role==='moeder')||{role:'x',g:'v'}),d=par('vader');p.ap=apMix(m||me,d||me,p.g)}
  else if(p.role==='kind'){const o=p.op&&S.rel.find(x=>x.id===p.op);p.ap=apMix(me,o&&o.alive!==undefined?apOf(o):null,p.g)}
  else if(p.role==='kleinkind'){const k=S.rel.find(x=>x.id===p.par);p.ap=apMix(k?apOf(k):me,null,p.g)}
  else p.ap=randAp(p.g==='x'?pick(['m','v']):p.g);return p.ap}
const SHIRTS={partner:'#e0526e',ex:'#9aa2ac',moeder:'#3fa66b',vader:'#3fa66b',broer:'#2bb3a6',zus:'#2bb3a6',kind:'#f2a93b',kleinkind:'#f2a93b',vriend:'#8e6cf0',vijand:'#4a4d55'};
// de speler: avatar als die er is, anders emoji
function playerFace(o){if(!S)return '🙂';if(!S.alive)return'💀';return S.ap?avatarSvg(S.ap,ageY(),S.p.g,Object.assign({head:1},o)):faceEmoji()}

/* ---------- talenten ---------- */
const TALENTS=[['geen','😀','Geen','Een gewoon kind, alles staat nog open.',null],
 ['acteren','🎭','Acteren','Sneller beter in creatief werk en meer kans als acteur.','kunst'],
 ['misdaad','🔫','Misdaad','Minder kans om betrapt te worden bij misdrijven.',null],
 ['model','📸','Modellenwerk','Begint knapper, veroudert langzamer en meer kans als model.',null],
 ['muziek','🎵','Muziek','Leert muziek veel sneller en meer kans als artiest.','muziek'],
 ['sport','🏀','Sport','Leert sport veel sneller en wordt sneller beter in je sport.','sport'],
 ['koken','🍳','Koken','Leert koken veel sneller. Handig in de horeca.','koken'],
 ['techniek','🛠️','Techniek','Leert techniek veel sneller. Handig in ICT en techniek.','tech'],
 ['ondernemen','💼','Ondernemen','Leert ondernemen veel sneller. Bedrijven groeien beter.','zaken']];
const TAL=id=>TALENTS.find(t=>t[0]===id)||TALENTS[0];
const talentSk=()=>S&&S.talent?TAL(S.talent)[4]:null;

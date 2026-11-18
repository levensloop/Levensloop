/* ---------- jouw uiterlijk: getekende avatar ---------- */
const SKINS=['#fbe3d0','#f6d2b8','#efc29f','#e6b48c','#d9a074','#c88a5e','#b0714a','#8f5838','#6e4129','#4d2c1c'];
const HAIRC=['#1f1a17','#3b2a1f','#5a3a24','#7a4a2a','#a0612f','#c98f4f','#e3c07a','#b3401f','#9aa0a8','#e9e9e6'];
const EYEC=['#4a2e1c','#6b4423','#8a6a3a','#6b7f3a','#3f8a4f','#3a7ca5','#5aa9e6','#7b8794','#2b2b2b','#8b5cf6'];
const HAIRN=['Kaal','Kort','Stekeltjes','Zijscheiding','Kuif','Krullen','Afro','Bob','Lang','Knot','Paardenstaart','Lange krullen',
  'Millimeter','Undercut','Middenscheiding','Mannenknot','Hanenkam','Kalend','Dreadlocks','Halflang','Krullen met fade',
  'Lang met pony','Twee vlechten','Pixie','Golvend lang','Staartjes','Vlecht opzij','Bob met pony'];
const FHAIR=[7,8,9,10,11,21,22,23,24,25,26,27];
const MHAIR=[0,1,2,3,4,5,6,12,13,14,15,16,17,18,19,20];
const BEARDN=['Geen','Stoppels','Snor','Sik','Ringbaard','Korte baard','Volle baard','Kinbaard','Krulsnor','Lange baard','Hoefijzersnor','Snor en sik','Bakkebaarden','Ankerbaard','Kinlijn','Puntbaard','Stoppels en snor','Walrussnor'];
const SKINN=['Porselein','Licht','Licht-beige','Beige','Gebronsd','Olijf','Karamel','Bruin','Donkerbruin','Diep donker'];
const HAIRCN=['Zwart','Donkerbruin','Bruin','Kastanje','Koper','Donkerblond','Blond','Rood','Grijs','Wit'];
const EYECN=['Donkerbruin','Bruin','Hazelnoot','Olijf','Groen','Blauw','Lichtblauw','Grijs','Zwart','Violet'];
function randAp(g){return {skin:ri(0,9),eye:ri(0,9),hc:ri(0,7),hair:g==='v'?pick(FHAIR.concat([8,7])):pick(MHAIR.concat([1,3])),beard:g==='m'&&chance(.4)?ri(1,BEARDN.length-1):0}}
function mixHex(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
// tekent een gezicht; age bepaalt grijs haar, rimpels en of er een baard is
function avatarSvg(ap,age=30,g='m',o={}){ap=ap||{skin:2,eye:1,hc:2,hair:1,beard:0};
  const sk=SKINS[ap.skin]??SKINS[2],skd=shade(sk,-.18),grey=age>=55?Math.min(1,(age-50)/30):0;let hc=HAIRC[ap.hc]??HAIRC[2];if(grey)hc=mixHex(hc,'#d9dadb',grey);
  const hd=shade(hc,-.25),ec=EYEC[ap.eye]??EYEC[1],kid=age<13,baby=age<3,beard=!kid&&age>=16?ap.beard||0:0,hair=baby?-1:ap.hair===17&&age<35?1:ap.hair??1;
  let s='';const shirt=o.shirt||'#4a7bd1';
  // haar achter het hoofd
  if(hair===7)s+=`<path d="M22 50C20 28 34 15 50 15S80 28 78 50L80 74C74 78 68 76 66 72L66 50H34V72C32 76 26 78 20 74Z" fill="${hc}"/>`;
  if(hair===8)s+=`<path d="M22 48C20 26 34 14 50 14S80 26 78 48L82 92C72 96 64 94 62 90L64 56H36L38 90C36 94 28 96 18 92Z" fill="${hc}"/>`;
  if(hair===6)s+=`<circle cx="50" cy="38" r="35" fill="${hc}"/>`+[...Array(14)].map((_,i)=>{const a=i/14*Math.PI*2;return `<circle cx="${(50+Math.cos(a)*33).toFixed(1)}" cy="${(38+Math.sin(a)*33).toFixed(1)}" r="5" fill="${hc}"/>`}).join('');
  if(hair===9)s+=`<circle cx="50" cy="12" r="10" fill="${hc}"/><path d="M42 9Q50 4 58 9M41 14Q50 9 59 14" stroke="${hd}" stroke-width="1" fill="none" opacity=".6"/><ellipse cx="50" cy="20.5" rx="5.5" ry="2" fill="${shade(hc,-.45)}"/>`;
  if(hair===15)s+=`<circle cx="50" cy="14" r="7" fill="${hc}"/><ellipse cx="50" cy="20" rx="4" ry="1.6" fill="${shade(hc,-.45)}"/>`;
  if(hair===18)s+=`<path d="M22 46C20 26 34 15 50 15S80 26 78 46Z" fill="${hc}"/>`+[16,21,26,31,69,74,79,84].map((x,i)=>`<path d="M${x+(x<50?6:-6)} 34L${x} ${70+(i%3)*5}" stroke="${hc}" stroke-width="5" stroke-linecap="round"/>`).join('');
  if(hair===19)s+=`<path d="M23 50C21 28 34 15 50 15S79 28 77 50L77 62L72 60L69 63V52H31V63L28 60L23 62Z" fill="${hc}"/>`;
  if(hair===21||hair===24)s+=`<path d="M22 48C20 26 34 14 50 14S80 26 78 48L82 92C72 96 64 94 62 90L64 56H36L38 90C36 94 28 96 18 92Z" fill="${hc}"/>`;
  if(hair===24)s+=`<path d="M24 60q-4 6 0 12t0 12M76 60q4 6 0 12t0 12" stroke="${hd}" stroke-width="1.3" fill="none" opacity=".7"/>`;
  if(hair===27)s+=`<path d="M22 50C20 28 34 15 50 15S80 28 78 50L80 72C74 76 68 74 66 70L66 50H34V70C32 74 26 76 20 72Z" fill="${hc}"/>`;
  if(hair===22)s+=`<path d="M22 50C20 28 34 15 50 15S80 28 78 50L79 64H69V50H31V64H21Z" fill="${hc}"/>`+[20.5,79.5].map(x=>[64,71,78,85].map(y=>`<ellipse cx="${x}" cy="${y}" rx="4.8" ry="4.4" fill="${hc}" stroke="${hd}" stroke-width=".8"/>`).join('')+`<circle cx="${x}" cy="90" r="2.2" fill="#e05a7a"/>`).join('');
  if(hair===26)s+=`<path d="M50 15C66 15 80 28 78 50L80 64H69V50H50Z" fill="${hc}"/>`+[64,70,76,82,88].map((y,i)=>`<ellipse cx="${79-i*1.2}" cy="${y}" rx="4.8" ry="4" fill="${hc}" stroke="${hd}" stroke-width=".8"/>`).join('')+`<circle cx="73" cy="92" r="2.2" fill="#e05a7a"/>`;
  if(hair===25)s+=[-1,1].map(d=>`<ellipse cx="${50+d*36}" cy="46" rx="7" ry="12" transform="rotate(${d*-25} ${50+d*36} 46)" fill="${hc}"/><circle cx="${50+d*29}" cy="38" r="2.6" fill="#e05a7a"/>`).join('');
  if(hair===10)s+=`<path d="M62 20C80 14 90 28 86 44C84 56 88 66 81 78C79 66 74 56 72 46C70 36 68 28 62 20Z" fill="${hc}"/><path d="M76 30C80 40 80 52 82 64" stroke="${hd}" stroke-width="1.2" fill="none" opacity=".6"/><circle cx="66" cy="21" r="3.6" fill="${shade(hc,-.45)}"/>`;
  if(hair===11)s+=`<path d="M23 48C21 26 34 15 50 15S79 26 77 48L78 74C72 78 64 77 61 73L61 56H39V73C36 77 28 78 22 74Z" fill="${hc}"/>`+[[22,34],[19,44],[18,54],[19,64],[22,73],[29,77],[37,75]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="${hc}"/><circle cx="${100-x}" cy="${y}" r="6.5" fill="${hc}"/>`).join('');
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
    9:`<path d="M25 50C25 80 38 98 50 98S75 80 75 50C72 63 66 66 60 66C56 62 44 62 40 66C34 66 28 63 25 50Z" fill="${hc}"/><path d="M45 84l2 8M55 84l-2 8M50 86v8" stroke="${hd}" stroke-width="1"/>`,
    10:`<path d="M38 63C42 60 47 60.5 50 62C53 60.5 58 60 62 63L63.5 77C63.5 79 60.5 79 60.5 77L59.5 66C56 65 53 65 50 65.6C47 65 44 65 40.5 66L39.5 77C39.5 79 36.5 79 36.5 77Z" fill="${hc}"/>`,
    11:`<path d="M41 64C44 61.5 47 62 50 63.3C53 62 56 61.5 59 64C56 64.8 53 64.6 50 65.3C47 64.6 44 64.8 41 64Z" fill="${hc}"/><path d="M46 74C46.5 79 48.5 84 50 84.5S53.5 79 54 74C52 75 48 75 46 74Z" fill="${hc}"/>`,
    12:`<path d="M25 46C24.5 58 27 66 33 70C36 70 37 67 35 65C31 61 29.5 55 29.5 46ZM75 46C75.5 58 73 66 67 70C64 70 63 67 65 65C69 61 70.5 55 70.5 46Z" fill="${hc}"/>`,
    13:`<path d="M39 64C43 61 47 61.5 50 63C53 61.5 57 61 61 64C57 65 53 64.8 50 65.6C47 64.8 43 65 39 64Z" fill="${hc}"/><path d="M48.5 72.5H51.5V76H48.5ZM40 75C43 81 46.5 85 50 85S57 81 60 75C57 77.5 53.5 78.5 50 78.5S43 77.5 40 75Z" fill="${hc}"/>`,
    14:`<path d="M25.5 54C26.5 72 36 81 50 81S73.5 72 74.5 54" stroke="${hc}" stroke-width="3.6" fill="none"/>`,
    15:`<path d="M26 54C27 72 36 80 44 84L50 94L56 84C64 80 73 72 74 54C71 64 65 67 59 67C56 64 44 64 41 67C35 67 29 64 26 54Z" fill="${hc}"/>`,
    16:`<path d="M27 56C28 74 38 82 50 82S72 74 73 56C70 66 64 70 58 70H42C36 70 30 66 27 56Z" fill="${hc}" opacity=".28"/><path d="M39 64C43 61 47 61.5 50 63C53 61.5 57 61 61 64C57 65 53 64.8 50 65.6C47 64.8 43 65 39 64Z" fill="${hc}"/>`,
    17:`<path d="M35 67C37 59 45 59 50 62C55 59 63 59 65 67C63 71 59 72 57 70C55 71 52.5 71 50 70C47.5 71 45 71 43 70C41 72 37 71 35 67Z" fill="${hc}"/><path d="M44 66.5V69M50 66V69.5M56 66.5V69" stroke="${hd}" stroke-width=".8"/>`};
  if(beard&&B[beard])s+=B[beard];
  // ogen, wenkbrauwen, neus, mond
  const ey=kid?51:52,er=kid?6:5.4;
  for(const x of [39,61])s+=`<ellipse cx="${x}" cy="${ey}" rx="${er}" ry="${er*.72}" fill="#fff"/><circle cx="${x}" cy="${ey}" r="${er*.55}" fill="${ec}"/><circle cx="${x}" cy="${ey}" r="${er*.26}" fill="#111"/><circle cx="${x+1.2}" cy="${ey-1.2}" r="${er*.14}" fill="#fff"/>`;
  if(g==='v'&&!baby)for(const x of [39,61]){const d=x<50?-1:1,ox=x+d*er;s+=`<path d="M${x-er} ${ey}Q${x} ${ey-er*1.15} ${x+er} ${ey}" stroke="#2a1d17" stroke-width="1.3" fill="none"/><path d="M${ox} ${ey-.4}l${d*2.4} -1.6M${ox-d*1.6} ${ey-er*.62}l${d*1.8} -2.1" stroke="#2a1d17" stroke-width="1.1" stroke-linecap="round"/>`}
  s+=`<path d="M32 ${ey-8}Q39 ${ey-11.5} 46 ${ey-8}M54 ${ey-8}Q61 ${ey-11.5} 68 ${ey-8}" stroke="${baby?shade(sk,-.12):hd}" stroke-width="${kid?2:2.6}" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M50 ${ey+3}Q47 ${ey+11} 50 ${ey+12}Q52.5 ${ey+12} 54 ${ey+10.5}" stroke="${skd}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  s+=beard===6||beard===9||beard===17?`<path d="M43 68Q50 72 57 68" stroke="#7a3a2e" stroke-width="2" fill="none" stroke-linecap="round"/>`:`<path d="M42 67Q50 74 58 67Q50 71 42 67Z" fill="#fff" stroke="${g==='v'&&!kid?'#d24f6a':'#9b4a3c'}" stroke-width="${g==='v'&&!kid?2.2:1.6}" stroke-linejoin="round"/>`;
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
    9:`<path d="M24 47C22 24 36 16 50 16S78 24 76 47C74 37 69 31 61 29.5C55 28.5 45 28.5 39 29.5C31 31 26 37 24 47Z" fill="${hc}"/><path d="M38 21Q50 16 62 21M34 26Q50 20 66 26" stroke="${shade(hc,.18)}" stroke-width="1.1" fill="none"/><path d="M27.5 41Q25 50 28.5 58M72.5 41Q75 50 71.5 58" stroke="${hc}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    10:`<path d="M24 47C22 24 36 16 50 16S78 24 76 47C74 37 70 31 62 29C52 27 40 30 33 35C29 39 26 43 24 47Z" fill="${hc}"/><path d="M36 22C46 17 60 17 68 24" stroke="${shade(hc,.22)}" stroke-width="1.4" fill="none"/>`,
    11:[...Array(9)].map((_,i)=>{const a=Math.PI*(.98+i*.13);return `<circle cx="${(50+Math.cos(a)*25).toFixed(1)}" cy="${(41+Math.sin(a)*22).toFixed(1)}" r="7.5" fill="${hc}"/>`}).join('')+`<circle cx="24" cy="50" r="6.5" fill="${hc}"/><circle cx="76" cy="50" r="6.5" fill="${hc}"/><circle cx="23" cy="59" r="6" fill="${hc}"/><circle cx="77" cy="59" r="6" fill="${hc}"/>`,
    12:`<path d="M25 46C23 26 36 19 50 19S77 26 75 46C73 37 66 31 50 31S27 37 25 46Z" fill="${hc}" opacity=".55"/>`,
    13:`<path d="M25 47C23 30 33 22 50 22S77 30 75 47C73 40 68 36 50 36S27 40 25 47Z" fill="${hc}" opacity=".45"/><path d="M28 37C25 20 38 11 52 11C66 11 76 19 74 35C68 29 58 27 48 29C40 30 33 33 28 37Z" fill="${hc}"/><path d="M36 22C46 15 60 15 70 22M38 28C48 22 60 22 68 27" stroke="${shade(hc,.2)}" stroke-width="1.2" fill="none"/>`,
    14:`<path d="M24 48C22 26 34 16 50 16S78 26 76 48C74 40 70 34 62 33C56 32 52 28 50 24C48 28 44 32 38 33C30 34 26 40 24 48Z" fill="${hc}"/>`,
    15:`<path d="M24 47C22 24 36 16 50 16S78 24 76 47C74 37 69 31 61 29.5C55 28.5 45 28.5 39 29.5C31 31 26 37 24 47Z" fill="${hc}"/><path d="M38 21Q50 17 62 21" stroke="${shade(hc,.18)}" stroke-width="1.1" fill="none"/>`,
    16:`<path d="M25 46C23 26 36 19 50 19S77 26 75 46C73 37 66 31 50 31S27 37 25 46Z" fill="${hc}" opacity=".35"/><path d="M43 31L41 18L45 21L46 8L49 15L51 4L53 15L55 8L56 21L59 18L57 31C53 29 47 29 43 31Z" fill="${hc}"/>`,
    17:`<path d="M24 56C22 44 23 34 29 28C31 31 31 36 30 40C29 46 30 52 31 56ZM76 56C78 44 77 34 71 28C69 31 69 36 70 40C71 46 70 52 69 56Z" fill="${hc}"/><path d="M36 24Q50 19 64 24" stroke="${skd}" stroke-width="1" fill="none" opacity=".5"/>`,
    18:`<path d="M24 47C22 24 36 16 50 16S78 24 76 47C74 38 66 31 50 31S26 38 24 47Z" fill="${hc}"/>`+[30,38,46,54,62,70].map((x,i)=>`<path d="M${x} 22Q${x+(x<50?-6:6)} 30 ${x+(x<50?-9:9)} ${38+(i%2)*4}" stroke="${shade(hc,-.15)}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`).join(''),
    19:`<path d="M24 52C21 28 34 16 50 16S79 28 76 52C74 42 70 35 62 33C56 32 52 28 50 24C48 28 44 32 38 33C30 35 26 42 24 52Z" fill="${hc}"/>`,
    20:`<path d="M25 47C23 30 33 24 50 24S77 30 75 47C73 40 68 36 50 36S27 40 25 47Z" fill="${hc}" opacity=".45"/>`+[[32,30],[38,24],[45,20],[52,19],[59,21],[66,25],[70,31],[40,30],[48,27],[56,27],[63,31]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${hc}"/>`).join(''),
    21:`<path d="M23 60C20 28 34 15 50 15S80 28 77 60C76 50 74 44 72 41C64 42 36 42 28 41C26 44 24 50 23 60Z" fill="${hc}"/><path d="M33 41V35M41 42V34M50 42V34M59 42V34M67 41V35" stroke="${hd}" stroke-width=".9" opacity=".5"/>`,
    22:`<path d="M23 56C20 28 34 15 50 15S80 28 77 56C75 42 70 34 62 32C56 31 52 26 50 22C48 26 44 31 38 32C30 34 25 42 23 56Z" fill="${hc}"/>`,
    23:`<path d="M24 56C21 28 34 15 50 15S79 26 76 52C74 42 72 37 69 35C60 41 46 44 31 43C28 46 25 50 24 56Z" fill="${hc}"/><path d="M33 41C46 42 60 39 68 34M40 30C50 31 60 28 66 24" stroke="${hd}" stroke-width="1" fill="none" opacity=".6"/><path d="M25.5 46Q24.5 55 28 62Q28.5 53 30.5 46ZM74.5 46Q75.5 55 72 62Q71.5 53 69.5 46Z" fill="${hc}"/>`,
    24:`<path d="M23 56C20 28 34 15 50 15S80 28 77 56C75 42 70 34 62 31C54 35 40 34 33 29C27 34 24 42 23 56Z" fill="${hc}"/><path d="M36 22Q44 18 50 22T64 22" stroke="${shade(hc,.2)}" stroke-width="1.3" fill="none"/>`,
    25:`<path d="M24 48C22 26 34 16 50 16S78 26 76 48C74 40 70 34 62 33C56 32 52 28 50 24C48 28 44 32 38 33C30 34 26 40 24 48Z" fill="${hc}"/>`,
    26:`<path d="M24 52C21 28 34 15 50 15S80 28 77 54C75 42 70 34 60 31C52 33 42 31 34 29C28 34 25 42 24 52Z" fill="${hc}"/>`,
    27:`<path d="M22 62C18 30 34 15 50 15S82 30 78 62C77 52 75 44 72 41C64 42 36 42 28 41C25 44 23 52 22 62Z" fill="${hc}"/><path d="M33 41V35M41 42V34M50 42V34M59 42V34M67 41V35" stroke="${hd}" stroke-width=".9" opacity=".5"/>`};
  if(baby)s+=`<path d="M47 22q3-6 6 0q-3-3-6 0" fill="${hc}"/>`;else if(H[hair])s+=H[hair];
  if(o.head)return SVG_(s,'13 4 74 80').replace('class="ico"','class="ico hs"');
  return SVG_(s,'0 0 100 100')}
// erfelijkheid: kinderen lijken op hun ouders
function apMix(a,b,g){a=a||randAp('m');b=b||randAp('v');const r=randAp(g);r.skin=clamp(Math.round((a.skin+b.skin)/2+ri(-1,1)),0,9);r.eye=chance(.1)?ri(0,9):pick([a.eye,b.eye]);r.hc=chance(.1)?ri(0,7):pick([a.hc,b.hc]);return r}
// ouders afleiden van een kind (de speler kiest zelf zijn uiterlijk): de een geeft de ogen, de ander de haarkleur
function apParentOf(c,g,share){const x=randAp(g);x.skin=clamp(c.skin+ri(-1,1),0,9);if(share==='eye')x.eye=c.eye;if(share==='hc')x.hc=c.hc;return x}
// voor oude saves: personen zonder uiterlijk krijgen er alsnog een dat bij de familie past
function apOf(p){return fixHair(p,apOf0(p))}
// bestaande levens: vrouwen krijgen een duidelijk vrouwenkapsel, mannen geen lang haar (eenmalig per persoon)
function fixHair(p,a){if(!a||!p)return a;const h=String(p.id||p.first||'').split('').reduce((x,c)=>x+c.charCodeAt(0),0);
  if(!a.h12){a.h12=1;if(p.g==='v'&&!FHAIR.includes(a.hair))a.hair=a.hair===5||a.hair===6?11:[8,7,10,8,11][h%5];else if(p.g==='m'&&FHAIR.includes(a.hair))a.hair=[1,3,4][h%3]}
  // meer variatie (nieuwe kapsels en baarden): bestaande personen krijgen eenmalig een kans op een nieuw model
  if(!a.h13){a.h13=1;if(p.g==='v'||p.g==='m'){const L=p.g==='v'?FHAIR:MHAIR,n=L.filter(x=>x>=12);if(h%L.length<n.length)a.hair=n[h%n.length]}
    if(p.g==='m'&&a.beard&&h%2)a.beard=10+h%8}
  return a}
function apOf0(p){if(p.ap)return p.ap;const me=S.ap||randAp(S.p.g);const par=r=>(S.rel.find(x=>x.role===r)||{}).ap;
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

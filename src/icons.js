/* ---------- eigen iconen: elk te kopen ding herkenbaar zonder te lezen ---------- */
const SVG_=(b,vb='0 0 48 48')=>`<svg class="ico" viewBox="${vb}" aria-hidden="true">${b}</svg>`;
function shade(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const lum=h=>{const n=parseInt(h.slice(1),16);return ((n>>16)*.3+(n>>8&255)*.59+(n&255)*.11)/255};
const shadowE=(cx=24,cy=43,rx=16)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="1.6" fill="#000" opacity=".12"/>`;
const spark=(x,y,s=2.2,c='#fff')=>`<path d="M${x} ${y-s}L${x+s*.3} ${y-s*.3}L${x+s} ${y}L${x+s*.3} ${y+s*.3}L${x} ${y+s}L${x-s*.3} ${y+s*.3}L${x-s} ${y}L${x-s*.3} ${y-s*.3}Z" fill="${c}"/>`;
const gem=(x,y,s=2.4)=>`<path d="M${x-s} ${y-s*.3}L${x-s*.5} ${y-s}L${x+s*.5} ${y-s}L${x+s} ${y-s*.3}L${x} ${y+s}Z" fill="#dff3ff" stroke="#8fb8d6" stroke-width=".5"/><path d="M${x-s} ${y-s*.3}H${x+s}M${x-s*.5} ${y-s}L${x} ${y+s}L${x+s*.5} ${y-s}" stroke="#a9cbe3" stroke-width=".4" fill="none"/>`;

/* ---- horloges ---- */
const WM={Staal:['#d3d8de','#8b929b'],Zilverkleurig:['#d3d8de','#8b929b'],Platina:['#e8ecf1','#9ea8b4'],Geelgoud:['#e8c25a','#a7802a'],Goudkleurig:['#e8c25a','#a7802a'],Zwart:['#34373c','#141618'],'Bicolor (staal en goud)':['#d3d8de','#8b929b','#e8c25a']};
// model: [vorm, wijzerplaatdetail, kleur wijzerplaat, band, accent]
const WATCH={'G-Shock DW-5600':['gshock'],'F-91W':['f91'],'Edifice':['round','chrono','#1b1d22','br'],
 'Presage Cocktail Time':['round','dress','#3f9cc4','lt'],'Prospex Diver':['round','diver','#15171a','rb'],'Grand Seiko Snowflake':['round','dress','#f3f4f6','br'],
 'Aquaracer':['round','diver','#24447a','br'],'Carrera':['round','chrono','#17191d','br'],'Monaco':['square','chrono','#1f4f9a','lt'],
 'Seamaster Diver 300M':['round','diver','#2a4f8f','br'],'Speedmaster Moonwatch':['round','chrono','#141518','br'],'Constellation':['round','dress','#dfe2e6','br'],
 'Oyster Perpetual':['round','dress','#41b4ad','br'],'Datejust':['round','fluted','#c3cfdd','br'],'Submariner':['round','diver','#121316','br'],'GMT-Master II':['round','gmt','#121316','br'],'Daytona':['round','panda','#f2f2f0','br'],'Day-Date':['round','fluted','#d8c08a','br'],
 'Code 11.59':['round','dress','#1d2f5c','lt'],'Royal Oak':['oct','tapis','#25427c','br'],'Royal Oak Offshore':['oct','offshore','#1a1b1e','rb'],
 'Calatrava':['round','dress','#f4f4f2','lt'],'Aquanaut':['naut','tapis','#3a3d42','rb'],'Nautilus':['naut','stripes','#2a4a7c','br'],
 'RM 035':['tonneau','skel','#2a2a2d','rb','#d9dde2'],'RM 11-03':['tonneau','skel','#2a2a2d','rb','#f07c22']};
function icWatch(m,v){const W=WATCH[m]||['round','dress','#f2f2f2','br'];const [shape,deco,dial,strap,acc]=W;const M=WM[v]||WM.Staal;const c1=M[0],c2=M[1],gold=M[2];let s='';
  if(shape==='gshock'||shape==='f91'){const cc=v==='Zilverkleurig'?'#c9ced6':v==='Goudkleurig'?'#d9b04c':'#2a2c30',cd=shade(cc,-.35);const big=shape==='gshock';
    const [x,y,w,h]=big?[10,10,28,28]:[13,14,22,20];
    s+=`<rect x="${big?15:17}" y="1" width="${big?18:14}" height="12" rx="2" fill="${big?cc:'#3a3d42'}"/><rect x="${big?15:17}" y="35" width="${big?18:14}" height="12" rx="2" fill="${big?cc:'#3a3d42'}"/>`;
    if(!big)s+=`<path d="M17 4h14M17 8h14M17 40h14M17 44h14" stroke="#24262a" stroke-width=".8"/>`;
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${big?6:3}" fill="${cc}" stroke="${cd}" stroke-width="1"/>`;
    if(big)s+=`<rect x="8" y="16" width="3" height="4" rx="1" fill="${cd}"/><rect x="8" y="28" width="3" height="4" rx="1" fill="${cd}"/><rect x="37" y="16" width="3" height="4" rx="1" fill="${cd}"/><rect x="37" y="28" width="3" height="4" rx="1" fill="${cd}"/><rect x="14" y="14" width="20" height="20" rx="3" fill="#15171a"/>`;
    const lx=big?16:16,ly=big?19:18,lw=big?16:16,lh=big?11:9;
    s+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="1.5" fill="#b8c4a6"/><text x="24" y="${ly+lh-2.3}" font-size="${big?5.4:4.8}" font-family="ui-monospace,monospace" font-weight="700" text-anchor="middle" fill="#273024">10:08</text>`;
    if(!big)s+=`<rect x="16" y="29" width="16" height="2" rx="1" fill="${v==='Goudkleurig'?'#8a6b25':'#c9cdd2'}" opacity=".5"/>`;
    return SVG_(s)}
  const stc=strap==='br'?c1:strap==='rb'?'#1c1d20':'#6a4428';
  s+=`<path d="M16.5 2h15l-1 11h-13zM17.5 35h13l1 11h-15z" fill="${stc}"/>`;
  if(strap==='br'){s+=`<path d="M16.6 5.5h14.8M16.8 9.5h14.4M17 38.5h14M16.8 42.5h14.4" stroke="${c2}" stroke-width=".7"/><path d="M21.5 2v11M26.5 2v11M21.5 35v11M26.5 35v11" stroke="${c2}" stroke-width=".7"/>`;if(gold)s+=`<path d="M21.6 2h4.8v11h-4.8zM21.6 35h4.8v11h-4.8z" fill="${gold}"/>`}
  else if(strap==='lt')s+=`<path d="M18 4h12M18.5 44h11" stroke="#4a2e1a" stroke-width=".7" stroke-dasharray="1 1"/>`;
  const bez=gold||c1;
  if(shape==='round')s+=`<circle cx="24" cy="24" r="13.5" fill="${bez}" stroke="${c2}" stroke-width="1"/>`;
  else if(shape==='oct')s+=`<path d="M17.5 10.5h13l6 6v15l-6 6h-13l-6-6v-15z" fill="${bez}" stroke="${c2}" stroke-width="1"/>`+[[18,13],[30,13],[34.5,17.5],[34.5,30.5],[30,35],[18,35],[13.5,30.5],[13.5,17.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".9" fill="${c2}"/>`).join('');
  else if(shape==='naut')s+=`<path d="M10 22c0-5 2-7 3-8l2-2h18l2 2c1 1 3 3 3 8v4c0 5-2 7-3 8l-2 2H15l-2-2c-1-1-3-3-3-8z" fill="${bez}" stroke="${c2}" stroke-width="1"/>`;
  else if(shape==='tonneau')s+=`<path d="M14 10c3-2 17-2 20 0 3 3 4 9 4 14s-1 11-4 14c-3 2-17 2-20 0-3-3-4-9-4-14s1-11 4-14z" fill="${acc||c1}" stroke="${shade(acc||c1,-.35)}" stroke-width="1"/>`;
  else s+=`<rect x="10.5" y="10.5" width="27" height="27" rx="5" fill="${bez}" stroke="${c2}" stroke-width="1"/>`;
  s+=`<rect x="37.2" y="22" width="2.6" height="4" rx="1" fill="${c2}"/>`;
  if(deco==='diver'||deco==='gmt'){const bc=deco==='gmt'?null:(dial==='#24447a'||dial==='#2a4f8f'?dial:'#16181b');
    s+=deco==='gmt'?`<path d="M12.2 24a11.8 11.8 0 0 1 23.6 0z" fill="#c8262d"/><path d="M12.2 24a11.8 11.8 0 0 0 23.6 0z" fill="#20449a"/>`:`<circle cx="24" cy="24" r="11.8" fill="${bc}"/>`;
    for(let i=0;i<12;i++){const a=i*Math.PI/6,x1=24+Math.sin(a)*11,y1=24-Math.cos(a)*11,x2=24+Math.sin(a)*9.8,y2=24-Math.cos(a)*9.8;s+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#e8eaed" stroke-width=".8"/>`}
    s+=`<path d="M22.8 12.6h2.4L24 14.4z" fill="#f2f2f2"/>`}
  if(deco==='fluted'){s+=`<circle cx="24" cy="24" r="11.8" fill="${gold||c1}"/>`;for(let i=0;i<24;i++){const a=i*Math.PI/12;s+=`<path d="M${(24+Math.sin(a)*11.6).toFixed(1)} ${(24-Math.cos(a)*11.6).toFixed(1)}L${(24+Math.sin(a)*9.8).toFixed(1)} ${(24-Math.cos(a)*9.8).toFixed(1)}" stroke="${c2}" stroke-width=".6"/>`}}
  if(deco==='offshore')s+=`<path d="M18.5 13h11l4.5 4.5v13L29.5 35h-11L14 30.5v-13z" fill="#2b2d31"/>`;
  // wijzerplaat
  const dr=['diver','gmt','fluted'].includes(deco)?9.4:shape==='round'?11.2:9.6;
  if(shape==='oct'||shape==='naut')s+=`<path d="M19 15h10l4 4v10l-4 4H19l-4-4V19z" fill="${dial}"/>`;
  else if(shape==='square')s+=`<rect x="14" y="14" width="20" height="20" rx="3" fill="${dial}"/>`;
  else if(shape==='tonneau')s+=`<path d="M16.5 14c3-1.5 12-1.5 15 0 2 2 3 6 3 10s-1 8-3 10c-3 1.5-12 1.5-15 0-2-2-3-6-3-10s1-8 3-10z" fill="${dial}"/>`;
  else s+=`<circle cx="24" cy="24" r="${dr}" fill="${dial}"/>`;
  const light=lum(dial)>.6,hc=light?'#1d1f23':'#f4f5f7',mk=light?'#6b7078':'#d8dce1';
  if(deco==='tapis')for(let i=0;i<5;i++)s+=`<path d="M${17+i*3.5} 16v16M16 ${17+i*3.5}h16" stroke="${shade(dial,.18)}" stroke-width=".6"/>`;
  if(deco==='stripes')for(let i=0;i<6;i++)s+=`<path d="M16 ${17.5+i*2.6}h16" stroke="${shade(dial,.2)}" stroke-width=".7"/>`;
  if(deco==='skel'){s+=`<circle cx="21" cy="21" r="3.5" fill="none" stroke="#9aa2ac" stroke-width="1" stroke-dasharray="1 .8"/><circle cx="27.5" cy="27" r="4.2" fill="none" stroke="${acc==='#f07c22'?'#f07c22':'#c9ced6'}" stroke-width="1.1" stroke-dasharray="1.2 .8"/><path d="M17 31l14-15" stroke="#6b7078" stroke-width="1"/>`;for(const [x,y] of [[16,13],[32,13],[16,35],[32,35]])s+=`<circle cx="${x}" cy="${y}" r=".8" fill="#888"/>`}
  if(deco==='chrono'||deco==='panda'){const sc=deco==='panda'?'#1a1b1e':shade(dial,.15);for(const [x,y] of [[19.5,24],[28.5,24],[24,28.8]])s+=`<circle cx="${x}" cy="${y}" r="2.6" fill="${sc}" stroke="${deco==='panda'?'#9aa0a8':mk}" stroke-width=".4"/>`}
  if(['dress','diver','gmt','fluted','chrono','panda'].includes(deco)&&shape!=='square'){const r1=dr-.8,r2=dr-2.4;for(let i=0;i<12;i++){if(deco!=='dress'&&deco!=='fluted'&&i%3)continue;const a=i*Math.PI/6;s+=`<path d="M${(24+Math.sin(a)*r1).toFixed(1)} ${(24-Math.cos(a)*r1).toFixed(1)}L${(24+Math.sin(a)*r2).toFixed(1)} ${(24-Math.cos(a)*r2).toFixed(1)}" stroke="${deco==='diver'||deco==='gmt'?'#f3f3f0':mk}" stroke-width="${i%3?.7:1.3}" stroke-linecap="round"/>`}}
  s+=`<path d="M24 24L19.4 20.6" stroke="${hc}" stroke-width="1.7" stroke-linecap="round"/><path d="M24 24L29.6 17.2" stroke="${hc}" stroke-width="1.2" stroke-linecap="round"/><path d="M24 24L24 31" stroke="#d33" stroke-width=".5"/><circle cx="24" cy="24" r=".9" fill="${hc}"/>`;
  s+=`<path d="M15 16a12 12 0 0 1 9-4.5" stroke="#fff" stroke-width="1" opacity=".35" fill="none"/>`;
  return SVG_(s)}

/* ---- tassen ---- */
const BAG={'Jet Set':'tote','Mercer':'satchel','GG Marmont':'quilt','Dionysus':'flap','Jackie 1961':'hobo','Speedy 30':'barrel','Neverfull MM':'open','Capucines':'satchel','Boy Bag':'boxy','Classic Flap':'quilt','Kelly 28':'kelly','Birkin 30':'birkin'};
const BAGC={'Zwart':'#2a2c30','Zwart leer':'#2a2c30','Bruin':'#7a4b2a','Rood':'#b3262e','Gold leer':'#b47c42','Krokodillenleer':'#4b5a3c'};
function icBag(m,v){const t=BAG[m]||'tote',c=BAGC[v]||'#7a4b2a',d=shade(c,-.3),l=shade(c,.2),hw='#d9b45a';let s=shadowE(24,44,15);
  const croc=v==='Krokodillenleer';
  const chain=`<path d="M13 24C13 8 35 8 35 24" fill="none" stroke="${hw}" stroke-width="1.6" stroke-dasharray="2 1.2"/>`;
  if(t==='tote')s+=`<path d="M17 18c0-8 14-8 14 0" fill="none" stroke="${d}" stroke-width="2.2"/><path d="M10 18h28l-3 24H13z" fill="${c}"/><path d="M10 18h28l-.5 4h-27z" fill="${d}"/>`;
  else if(t==='open')s+=`<path d="M15 20c0-10 6-10 6 0M27 20c0-10 6-10 6 0" fill="none" stroke="${d}" stroke-width="1.8"/><path d="M8 18c6 3 26 3 32 0l-4 24H12z" fill="${c}"/><path d="M9 22l6 4M39 22l-6 4" stroke="${hw}" stroke-width="1"/>`;
  else if(t==='satchel')s+=`<path d="M18 17c0-7 12-7 12 0" fill="none" stroke="${d}" stroke-width="2.4"/><rect x="9" y="17" width="30" height="24" rx="4" fill="${c}"/><path d="M9 21h30v7c-6 3-24 3-30 0z" fill="${d}"/><rect x="21.5" y="26" width="5" height="4" rx="1" fill="${hw}"/>`;
  else if(t==='quilt'||t==='boxy'||t==='flap'){s+=chain+`<rect x="10" y="19" width="28" height="22" rx="${t==='boxy'?2:3}" fill="${c}"/><path d="M10 19h28v9c-8 3-20 3-28 0z" fill="${d}"/>`;
    if(t!=='flap'){s+=`<clipPath id="bq"><rect x="10" y="19" width="28" height="22"/></clipPath><g clip-path="url(#bq)">`;for(let i=-2;i<4;i++)s+=`<path d="M${10+i*7} 19l14 22M${24+i*7} 19l-14 22" stroke="${l}" stroke-width=".7" opacity=".7"/>`;s+='</g>'}
    s+=`<circle cx="24" cy="28" r="2.4" fill="${hw}"/>`}
  else if(t==='hobo')s+=`<path d="M18 16c0-8 12-8 12 0" fill="none" stroke="${d}" stroke-width="2"/><path d="M9 18c4 0 26 0 30 0 0 14-6 24-15 24S9 32 9 18z" fill="${c}"/><circle cx="34" cy="22" r="2" fill="${hw}"/>`;
  else if(t==='barrel')s+=`<path d="M16 20c0-9 6-9 6 0M26 20c0-9 6-9 6 0" fill="none" stroke="${d}" stroke-width="2"/><path d="M8 26c0-6 4-8 8-8h16c4 0 8 2 8 8v8c0 4-3 7-7 7H15c-4 0-7-3-7-7z" fill="${c}"/><path d="M8 24h32" stroke="${hw}" stroke-width="1.2"/>`+[13,19,25,31,35].map(x=>`<circle cx="${x}" cy="${32-(x%3)}" r=".9" fill="${l}"/>`).join('');
  else{const bk=t==='birkin';s+=bk?`<path d="M17 18c0-8 5-8 5 0M26 18c0-8 5-8 5 0" fill="none" stroke="${d}" stroke-width="2"/>`:`<path d="M19 18c0-9 10-9 10 0" fill="none" stroke="${d}" stroke-width="2.4"/>`;
    s+=`<path d="M12 18h24l3 23H9z" fill="${c}"/><path d="M12 18h24l1.6 11c-8 2-19 2-27.2 0z" fill="${d}"/><path d="M15 27h18" stroke="${l}" stroke-width="1.4"/><rect x="21.6" y="27" width="4.8" height="5" rx="1" fill="${hw}"/><path d="M22.8 27v-1.5a1.2 1.2 0 0 1 2.4 0V27" fill="none" stroke="${hw}" stroke-width=".9"/>`}
  if(croc){s+=`<clipPath id="bcr"><path d="M12 18h24l3 23H9z"/></clipPath><g clip-path="url(#bcr)">`;for(let y=30;y<41;y+=3)for(let x=10;x<38;x+=4)s+=`<rect x="${x+(y%2?2:0)}" y="${y}" width="3.2" height="2.3" rx=".8" fill="${shade(c,.12)}" opacity=".8"/>`;s+='</g>'}
  return SVG_(s)}

/* ---- sieraden ---- */
const JEW={'Bedelarmband':'charm','Ring':'band','Return to Tiffany-ketting':'heart','Solitaire-ring':'solitaire','T-armband':'bangle','Trinity-ring':'trinity','Love-armband':'love','Juste un Clou':'nail','Alhambra-ketting':'clover','Diamanten oorbellen':'studs','Diamanten halsketting':'riviere'};
const JM={'Zilver':'#cfd4da','Roségoud':'#e3a58c','Geelgoud':'#e6bf55','Witgoud':'#e9edf2','Met extra diamanten':'#e6bf55'};
function icJewel(m,v){const t=JEW[m]||'band',c=JM[v]||'#e6bf55',d=shade(c,-.32),l=shade(c,.45),extra=v==='Met extra diamanten';let s='';
  const ring=(cx,cy,rx,ry,col,w=3.4)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${shade(col,-.32)}" stroke-width="${w+1}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${col}" stroke-width="${w}"/><path d="M${cx-rx*.7} ${cy-ry*.7}a${rx} ${ry} 0 0 1 ${rx*.9} -${ry*.3}" stroke="${shade(col,.5)}" stroke-width="1" fill="none"/>`;
  if(t==='band')s+=ring(24,28,12,8,c);
  else if(t==='solitaire')s+=ring(24,30,11,7.5,c,2.6)+`<path d="M20 22l4 2 4-2" fill="none" stroke="${d}" stroke-width="1.2"/>`+gem(24,17,6);
  else if(t==='trinity')s+=ring(19,30,8,6,'#e6bf55',2.4)+ring(29,30,8,6,'#e3a58c',2.4)+ring(24,22,8,6,'#e9edf2',2.4);
  else if(t==='bangle'||t==='love'||t==='nail'){s+=ring(24,26,15,10,c,4);
    if(t==='love')for(const [x,y] of [[12,22],[18,17.5],[30,17.5],[36,22],[24,36]])s+=`<circle cx="${x}" cy="${y}" r="1.2" fill="${d}"/><path d="M${x-.7} ${y}h1.4" stroke="${l}" stroke-width=".4"/>`;
    if(t==='nail')s+=`<path d="M37 24l5-3 1 3-5 2z" fill="${c}" stroke="${d}" stroke-width=".6"/><circle cx="10" cy="29" r="2.3" fill="${c}" stroke="${d}" stroke-width=".6"/>`;
    if(t==='bangle')s+=`<path d="M20 34.5h8M24 34.5v2.5" stroke="${d}" stroke-width="1.6"/>`}
  else if(t==='charm'){s+=`<path d="M8 18c4 8 28 8 32 0" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="1.6 .8"/>`;const ch=[['#e46a8a','M12 23c-2-3 2-5 3-2 1-3 5-1 3 2l-3 3z'],['#6aa7e4',''],['#e6bf55',''],['#8fd16f','']];
    s+=`<path d="M14 23v3" stroke="${c}"/><path d="M11.5 27.5c-1.8-2.5 1.8-4 2.5-1.5.7-2.5 4.3-1 2.5 1.5L14 30z" fill="#e46a8a"/><path d="M21 25.5v3" stroke="${c}"/><circle cx="21" cy="31" r="2.4" fill="#6aa7e4"/><path d="M28 25.5v3" stroke="${c}"/><path d="M28 28.5l2.4 2.4-2.4 2.4-2.4-2.4z" fill="#8fd16f"/><path d="M34.5 23.5v3" stroke="${c}"/><circle cx="34.5" cy="29" r="2.2" fill="${c}" stroke="${d}" stroke-width=".6"/>`}
  else if(t==='heart'||t==='clover'||t==='riviere'){s+=`<path d="M9 8c2 16 28 16 30 0" fill="none" stroke="${c}" stroke-width="1.3" stroke-dasharray="1.4 .6"/>`;
    if(t==='heart')s+=`<path d="M24 24v2" stroke="${c}"/><path d="M24 39c-8-5-11-9-9-13 1.6-3 6-3 9 0 3-3 7.4-3 9 0 2 4-1 8-9 13z" fill="${c}" stroke="${d}" stroke-width=".8"/><path d="M18 28c1-2 3-2.4 4.5-1.4" stroke="${l}" stroke-width="1" fill="none"/>`;
    if(t==='clover')for(const [x,y,r] of [[15,19,3.2],[24,24.5,4.5],[33,19,3.2]]){s+=`<g fill="${c}" stroke="${d}" stroke-width=".6">${[[0,-1],[1,0],[0,1],[-1,0]].map(([a,b])=>`<circle cx="${x+a*r*.55}" cy="${y+b*r*.55}" r="${r*.55}"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="${r*.3}" fill="#fff" opacity=".8"/>`}
    if(t==='riviere')for(let i=0;i<9;i++){const a=(i-4)/4;s+=gem(24+a*14.5,9+(1-a*a)*11.5+(i===4?2:0),i===4?3.8:2.3)}}
  else if(t==='studs')s+=`<circle cx="15" cy="24" r="5.5" fill="${c}" stroke="${d}" stroke-width=".8"/>`+gem(15,24,4.6)+`<circle cx="33" cy="24" r="5.5" fill="${c}" stroke="${d}" stroke-width=".8"/>`+gem(33,24,4.6);
  if(extra||t==='studs'||t==='riviere'||t==='solitaire')s+=spark(38,9,2.4,'#ffd84a')+spark(9,36,1.8,'#ffd84a');
  if(extra&&!['studs','riviere','solitaire'].includes(t))s+=gem(24,12,3.2)+gem(17,13,2)+gem(31,13,2);
  return SVG_(s)}

/* ---- elektronica ---- */
function icTech(m){let s='';const al='#d3d8de',sg='#5d6168',scr='#151a24';
  const screen=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="url(#gscr)"/>`;
  const defs=`<defs><linearGradient id="gscr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b8def"/><stop offset=".55" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec6aa0"/></linearGradient></defs>`;
  s+=defs;
  if(m==='iPhone'||m==='Galaxy S'){s+=`<rect x="14" y="4" width="20" height="40" rx="5" fill="${m==='iPhone'?'#3b3f46':'#202328'}"/>`+screen(15.5,5.5,17,37);s+=m==='iPhone'?`<rect x="20.5" y="7.3" width="7" height="2.2" rx="1.1" fill="#0d0f12"/>`:`<circle cx="24" cy="8.4" r="1.1" fill="#0d0f12"/>`}
  else if(m==='iPad')s+=`<rect x="7" y="6" width="34" height="36" rx="4" fill="${sg}"/>`+screen(9,8,30,32);
  else if(m==='MacBook Air'||m==='MacBook Pro'){const c=m==='MacBook Pro'?sg:al;s+=shadowE(24,40,20)+`<rect x="9" y="9" width="30" height="21" rx="2" fill="${c}"/>`+screen(10.5,10.5,27,18)+`<path d="M4 32h40l-2.5 5.5h-35z" fill="${c}"/><path d="M4 32h40" stroke="${shade(c,-.25)}" stroke-width="1"/><rect x="20" y="32.3" width="8" height="1.3" rx=".6" fill="${shade(c,-.2)}"/>`}
  else if(m==='Apple Watch')s+=`<path d="M17 2h14l-1 10H18zM18 36h12l1 10H17z" fill="#f08a5d"/><rect x="12" y="10" width="24" height="28" rx="7" fill="#2a2d33"/><rect x="14" y="12" width="20" height="24" rx="5.5" fill="#000"/><circle cx="24" cy="24" r="7" fill="none" stroke="#ff2d55" stroke-width="2"/><circle cx="24" cy="24" r="4.6" fill="none" stroke="#a5f23a" stroke-width="1.8"/><circle cx="24" cy="24" r="2.4" fill="none" stroke="#3ad7f2" stroke-width="1.6"/><rect x="36" y="18" width="2" height="5" rx="1" fill="#555"/>`;
  else if(m==='AirPods Pro')s+=shadowE(24,42,13)+`<rect x="10" y="16" width="28" height="24" rx="9" fill="#f6f7f9" stroke="#cfd4da"/><path d="M10 25h28" stroke="#cfd4da"/><circle cx="24" cy="31" r="1" fill="#7ed957"/><path d="M15 9c3 0 5 2 5 5v3h-3v-3c0-1-1-2-2-2-2 0-3-1-3-1.5S13 9 15 9zM33 9c-3 0-5 2-5 5v3h3v-3c0-1 1-2 2-2 2 0 3-1 3-1.5S35 9 33 9z" fill="#fff" stroke="#cfd4da" stroke-width=".8"/>`;
  else if(m==='OLED-tv 65 inch')s+=shadowE(24,41,12)+`<rect x="3" y="8" width="42" height="26" rx="1.5" fill="#111"/>`+screen(4.5,9.5,39,23)+`<path d="M17 40l3-6h8l3 6z" fill="#3a3d42"/>`;
  else if(m==='PlayStation')s+=shadowE(24,43,17)+`<path d="M8 6c3 0 5 1 6 3l2 31c-3 1-6 1-8 0z" fill="#f4f5f7" stroke="#cfd4da" stroke-width=".8"/><path d="M14 9h4l-1 31h-1z" fill="#1d1f24"/><path d="M22 30c2-3 5-4 9-4h6c4 0 6 2 7 6l1 6c0 2-2 3-4 1l-3-3h-9l-3 3c-2 2-4 1-4-1z" fill="#f4f5f7" stroke="#cfd4da" stroke-width=".8"/><path d="M29 30h6" stroke="#1d1f24" stroke-width="2.4" stroke-linecap="round"/><circle cx="27.5" cy="33.5" r="1.2" fill="#3a3d42"/><circle cx="37" cy="33.5" r="1.2" fill="#3a3d42"/>`;
  else if(m==='Noise-cancelling koptelefoon')s+=`<path d="M10 28V22a14 14 0 0 1 28 0v6" fill="none" stroke="#2a2d33" stroke-width="3.4"/><rect x="6" y="24" width="10" height="16" rx="5" fill="#3a3d44"/><rect x="32" y="24" width="10" height="16" rx="5" fill="#3a3d44"/><rect x="8.5" y="27" width="5" height="10" rx="2.5" fill="#55595f"/><rect x="34.5" y="27" width="5" height="10" rx="2.5" fill="#55595f"/>`;
  else if(m==='Switch')s+=`<rect x="5" y="14" width="8" height="21" rx="4" fill="#00b8e6"/><rect x="35" y="14" width="8" height="21" rx="4" fill="#ff4b4b"/><rect x="12" y="14" width="24" height="21" rx="1" fill="#2a2d33"/>`+screen(13.5,15.5,21,18)+`<circle cx="9" cy="20" r="1.6" fill="#1d1f24"/><circle cx="39" cy="28" r="1.6" fill="#1d1f24"/>`;
  else s+=`<rect x="10" y="10" width="28" height="28" rx="6" fill="${sg}"/>`;
  return SVG_(s)}

/* ---- auto's ---- */
const CARB={
 city:{x0:6,x1:42,bot:34,rt:23,nt:25,belt:22,cr:9,cf:34,rr:11,rf:29,roof:12,w:[13,35],r:5},
 bubble:{x0:8,x1:40,bot:34,rt:25,nt:26,belt:24,cr:11,cf:33,rr:15,rf:28,roof:14,w:[14,34],r:4.6,rnd:1},
 hatch:{x0:4,x1:44,bot:34,rt:23,nt:26,belt:23,cr:7,cf:33,rr:10,rf:27,roof:13.5,w:[12,36],r:5},
 sedan:{x0:3,x1:45,bot:34,rt:24,nt:26,belt:23,cr:11,cf:33,rr:16,rf:28,roof:14,w:[11,37],r:5},
 wagon:{x0:3,x1:45,bot:34,rt:22,nt:26,belt:22.5,cr:5,cf:33,rr:7,rf:28,roof:14,w:[11,37],r:5},
 suv:{x0:4,x1:44,bot:32,rt:20,nt:22,belt:20,cr:7,cf:34,rr:9,rf:29,roof:10,w:[12,36],r:6},
 boxy:{x0:5,x1:43,bot:32,rt:18,nt:20,belt:19,cr:7,cf:36,rr:7.5,rf:34.5,roof:7.5,w:[12,36],r:6,box:1},
 coupe:{x0:3,x1:45,bot:34,rt:25,nt:28,belt:24,cr:9,cf:32,rr:17,rf:27,roof:16,w:[11,37],r:5},
 super:{x0:2,x1:46,bot:34,rt:26,nt:30.5,belt:26,cr:11,cf:31,rr:19,rf:26,roof:19.5,w:[11,38],r:5},
 roadster:{x0:3,x1:45,bot:34,rt:26,nt:27,belt:25,cr:16,cf:30,rr:17,rf:27,roof:19,w:[11,37],r:5,open:1},
 classic911:{x0:4,x1:44,bot:34,rt:27,nt:28,belt:25,cr:7,cf:31,rr:16,rf:26,roof:15.5,w:[12,36],r:4.8,rnd:1}};
const CARCOLS={Zwart:'#2b2e33',Wit:'#f2f3f5',Zilvergrijs:'#b8bec6',Donkerblauw:'#1f3a6b',Rood:'#cc262d',Racegroen:'#1f4d33',Matgrijs:'#6b7076'};
const CARM={'Panda':['city','#e8e2d0'],'500e':['bubble','#9fd3c7'],'Polo':['hatch','#2f6fd6'],'Golf':['hatch','#b8bec6'],'ID.4':['suv','#4a6fa5'],'Yaris':['city','#d0262d'],'RAV4 Hybrid':['suv','#7d8b78'],'Land Cruiser':['boxy','#e9e6dc'],
 'Model 3':['sedan','#f2f3f5'],'Model Y':['suv','#2b2e33'],'Model S Plaid':['sedan','#a31d24'],'3-serie':['sedan','#1f3a6b'],'X5':['suv','#2b2e33'],'M4':['coupe','#2f9e6b',{wing:0}],'C-Klasse':['sedan','#b8bec6'],'S-Klasse':['sedan','#1c1e22'],'G-Klasse':['boxy','#3b3f45'],
 'A4':['sedan','#7d8590'],'RS 6':['wagon','#5e6e7a'],'Macan':['suv','#a8331f'],'911 Carrera':['coupe','#c9ced6'],'911 GT3 RS':['coupe','#f2c230',{wing:1}],'Roma':['coupe','#cc1f24'],'SF90 Stradale':['super','#cc1f24'],'Huracán':['super','#9bc53d'],'Revuelto':['super','#f07c22'],
 'Fiat 500L (1971)':['bubble','#8fc1d4'],'Mercedes 280 SL (1969)':['roadster','#efe3c4'],'Porsche 911 (1973)':['classic911','#e07a24']};
function carSpec(name){if(!name)return ['hatch','#b8bec6'];for(const k of Object.keys(CARM).sort((a,b)=>b.length-a.length))if(name.includes(k))return CARM[k];
  return /Panda/.test(name)?CARM.Panda:/Golf/.test(name)?CARM.Golf:/RAV4/.test(name)?CARM['RAV4 Hybrid']:/Range Rover/.test(name)?['suv','#2f4a3a']:/5-serie/.test(name)?['sedan','#2b2e33']:/911/.test(name)?CARM['911 Carrera']:/Roma/.test(name)?CARM.Roma:/Fiat 500/.test(name)?CARM['Fiat 500L (1971)']:/SL/.test(name)?CARM['Mercedes 280 SL (1969)']:/Tesla/.test(name)?CARM['Model 3']:['hatch','#b8bec6']}
function icCar(name,col){const [type,def,o={}]=carSpec(name);const B=CARB[type];const c=CARCOLS[col]||col||def;const d=shade(c,-.28),l=shade(c,.3);
  const {x0,x1,bot,rt,nt,belt,cr,cf,rr,rf,roof,w,r}=B;let s=shadowE(24,bot+r+.6,20);
  const body=B.rnd?`M${x0} ${bot}C${x0} ${rt} ${x0+2} ${rt-1} ${cr} ${belt}L${cf} ${belt}C${x1-2} ${nt-1} ${x1} ${nt} ${x1} ${bot}Z`:`M${x0} ${bot}L${x0} ${rt+2}Q${x0} ${rt} ${x0+2.5} ${rt}L${cr} ${belt}L${cf} ${belt}L${x1-3} ${nt}Q${x1} ${nt+.5} ${x1} ${nt+3}L${x1} ${bot}Z`;
  const cab=B.box?`M${cr} ${belt}L${rr} ${roof}L${rf} ${roof}L${cf} ${belt}Z`:`M${cr} ${belt}L${rr} ${roof}Q${(rr+rf)/2} ${roof-1.2} ${rf} ${roof}L${cf} ${belt}Z`;
  if(!B.open)s+=`<path d="${cab}" fill="${c}" stroke="${d}" stroke-width=".6"/>`;
  s+=`<path d="${body}" fill="${c}" stroke="${d}" stroke-width=".7"/>`;
  if(!B.open){const m=(rr+rf)/2;s+=`<path d="M${cr+2.4} ${belt-.5}L${rr+1.1} ${roof+1.6}L${m-.7} ${roof+1.3}L${m-.7} ${belt-.5}Z" fill="#26303b"/><path d="M${m+.7} ${belt-.5}L${m+.7} ${roof+1.3}L${rf-1} ${roof+1.6}L${cf-2.8} ${belt-.5}Z" fill="#26303b"/><path d="M${rr+2} ${roof+2.4}L${rr+4} ${roof+2}" stroke="#fff" stroke-width=".8" opacity=".45"/>`}
  else s+=`<path d="M${cf} ${belt}L${cf-3} ${belt-5.5}" stroke="#2a3038" stroke-width="1.6" stroke-linecap="round"/><path d="M${cr+2} ${belt}q1-5 4-5q2 0 2 5z" fill="#6b4a33"/>`;
  s+=`<path d="M${x0+1} ${bot-3.5}H${x1-1}" stroke="${d}" stroke-width=".7" opacity=".7"/><path d="M${cr+1} ${belt+1.6}H${cf-1}" stroke="${l}" stroke-width="1" opacity=".55"/>`;
  s+=`<rect x="${x1-2.6}" y="${nt+1}" width="2.4" height="1.8" rx=".7" fill="#ffe9a8"/><rect x="${x0+.3}" y="${rt+1.2}" width="1.8" height="2" rx=".6" fill="#e23b3b"/>`;
  if(o.wing)s+=`<path d="M${x0+1} ${rt-.5}L${x0+2} ${rt-4}H${x0+9}L${x0+8} ${rt-2.5}" fill="#1d1f22"/>`;
  if(type==='super')s+=`<path d="M${cr+4} ${bot-6}L${cr+9} ${belt+2}L${cr+11} ${bot-6}Z" fill="#1d1f22" opacity=".8"/>`;
  if(B.box)s+=`<rect x="${x0-2.5}" y="${rt+3}" width="3" height="8" rx="1.4" fill="#2a2d31"/>`;
  for(const x of w)s+=`<circle cx="${x}" cy="${bot}" r="${r+1}" fill="${shade(c,-.55)}"/><circle cx="${x}" cy="${bot}" r="${r}" fill="#1d1f22"/><circle cx="${x}" cy="${bot}" r="${r*.55}" fill="#c9ced6"/><circle cx="${x}" cy="${bot}" r="${r*.18}" fill="#7b828b"/>`;
  return SVG_(s,'1 5 46 40')}

/* ---- boten, vliegtuigen, kunst ---- */
const water=`<path d="M2 38c4 2 6 2 10 0s6-2 10 0 6 2 10 0 6-2 10 0 4 2 4 2v6H2z" fill="#4aa3df"/><path d="M2 38c4 2 6 2 10 0s6-2 10 0 6 2 10 0 6-2 10 0" fill="none" stroke="#9fd6f5" stroke-width="1"/>`;
function icBoat(m){let s='';
  if(/Sloep/.test(m))s+=`<path d="M6 30h34l-5 8H11z" fill="#f2f3f5" stroke="#9aa2ac"/><path d="M8 30h30" stroke="#8a5a33" stroke-width="2"/><rect x="38" y="25" width="3" height="10" rx="1" fill="#2a2d31"/><path d="M14 27h14v3H14z" fill="#3b6ea5"/>`;
  else if(/Aquarama/.test(m))s+=`<path d="M4 31h38c-2 4-6 7-10 7H10z" fill="#7a3b1c"/><path d="M4 31h38" stroke="#f2f3f5" stroke-width="1.2"/><path d="M6 33h34M8 35.5h28" stroke="#a65a2c" stroke-width=".6"/><path d="M24 31l3-5h4l-1 5z" fill="#cfe8f5" stroke="#9aa2ac" stroke-width=".6"/><path d="M14 31v-2h6v2" fill="#f2efe6"/>`;
  else if(/Iseo/.test(m))s+=`<path d="M3 32h40c-3 3-7 6-12 6H9z" fill="#f2f3f5" stroke="#9aa2ac" stroke-width=".7"/><path d="M5 34h36" stroke="#1f3a6b" stroke-width="1.6"/><path d="M20 32l5-6h9l2 6z" fill="#26303b"/>`;
  else if(/Oceanis/.test(m))s+=`<path d="M23 4v28" stroke="#5d6168" stroke-width="1.2"/><path d="M24 6c8 6 12 16 13 24H24z" fill="#f4f5f7" stroke="#cfd4da" stroke-width=".6"/><path d="M22 9c-5 6-8 13-9 21h9z" fill="#e8ebef" stroke="#cfd4da" stroke-width=".6"/><path d="M6 32h36l-5 6H10z" fill="#f2f3f5" stroke="#9aa2ac" stroke-width=".7"/><path d="M8 34h32" stroke="#1f3a6b" stroke-width="1.2"/>`;
  else s+=`<path d="M2 30h44l-6 8H6z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".7"/><path d="M8 30l2-6h26l4 6z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".6"/><path d="M13 24l2-5h18l3 5z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".6"/><path d="M18 19l1.5-3h10l2 3z" fill="#e8ebef" stroke="#9aa2ac" stroke-width=".6"/><path d="M9 28h31M14 22h21M19 17.5h11" stroke="#26303b" stroke-width="1.4"/><path d="M4 33h40" stroke="#1f3a6b" stroke-width="1"/><path d="M24 16v-5" stroke="#5d6168"/>`;
  return SVG_(s+water)}
function icPlane(m){let s='';const sky=`<circle cx="24" cy="24" r="21" fill="#e4f1fb"/>`;s+=sky;
  if(/R44/.test(m))s+=`<path d="M6 13h36" stroke="#2a2d31" stroke-width="1.4"/><path d="M24 13v4" stroke="#2a2d31" stroke-width="1.6"/><path d="M14 26c0-6 4-9 9-9h3c4 0 6 3 6 7v2c0 3-2 4-5 4H18c-3 0-4-2-4-4z" fill="#d0262d"/><path d="M15 25c0-4 3-7 7-7h1v8z" fill="#bfe1f5"/><path d="M32 23h10l2-4h1v7H32z" fill="#d0262d"/><path d="M16 34h16M18 30v4M28 30v4" stroke="#2a2d31" stroke-width="1.2"/>`;
  else if(/172/.test(m))s+=`<path d="M6 20h34" stroke="#f2f3f5" stroke-width="3.2" stroke-linecap="round"/><path d="M6 20h34" stroke="#1f3a6b" stroke-width=".8"/><path d="M12 25c0-3 2-5 6-5h12c4 0 8 2 8 5s-3 4-8 4H17c-3 0-5-1-5-4z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".6"/><path d="M26 21h6l3 4h-9z" fill="#26303b"/><path d="M38 21v8" stroke="#555" stroke-width="1.6"/><path d="M12 24l-4-7h3l4 6z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".5"/><path d="M18 29l-1 5M30 29l1 5" stroke="#555"/>`;
  else if(/PC-12/.test(m))s+=`<path d="M10 25c0-3 3-5 7-5h16c5 0 9 2 9 5s-4 5-9 5H16c-4 0-6-2-6-5z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".6"/><path d="M10 25L6 15h4l5 8z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".5"/><path d="M14 29h24" stroke="#1f3a6b" stroke-width="1.2"/><path d="M18 27l14 0 4 6H22z" fill="#d9dde2" stroke="#9aa2ac" stroke-width=".5"/><path d="M37 22h4l1 2h-5z" fill="#26303b"/><path d="M43 19v12" stroke="#555" stroke-width="1.6"/>`+[20,24,28,32].map(x=>`<circle cx="${x}" cy="23.5" r=".9" fill="#26303b"/>`).join('');
  else s+=`<path d="M6 26c0-2 2-4 6-4h22c6 0 10 2 10 4s-4 4-10 4H12c-4 0-6-2-6-4z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".6"/><path d="M8 24L5 14h4l6 9z" fill="#f4f5f7" stroke="#9aa2ac" stroke-width=".5"/><path d="M20 28l10 0 6 9h-4z" fill="#d9dde2" stroke="#9aa2ac" stroke-width=".5"/><path d="M38 24h3l2 2h-5z" fill="#26303b"/><path d="M12 27h26" stroke="#b08a3e" stroke-width="1"/><rect x="11" y="21.5" width="6" height="3" rx="1.5" fill="#cfd4da"/>`+[20,23,26,29,32].map(x=>`<circle cx="${x}" cy="25" r=".7" fill="#26303b"/>`).join('');
  return SVG_(s)}
function icArt(m){const fr=(c,inner)=>`<rect x="5" y="7" width="38" height="32" rx="1" fill="${c}"/><rect x="8.5" y="10.5" width="31" height="25" fill="#fff"/>${inner}`;let s='';
  if(/lokale/.test(m))s+=fr('#9a6b3c',`<rect x="8.5" y="10.5" width="31" height="25" fill="#bfe3f7"/><circle cx="33" cy="16" r="3" fill="#ffd84a"/><path d="M8.5 30l8-9 7 7 5-4 11 8v3.5h-31z" fill="#5fa85b"/><path d="M8.5 33c8-3 18-3 31 0v2.5h-31z" fill="#3e7d3e"/>`);
  else if(/gerenommeerde/.test(m))s+=fr('#c49a3c',`<rect x="8.5" y="10.5" width="31" height="25" fill="#3a3324"/><ellipse cx="24" cy="21" rx="5" ry="6" fill="#e2c19a"/><path d="M14 35.5c1-7 5-9 10-9s9 2 10 9z" fill="#5a2e2a"/><path d="M19 17c1-4 9-4 10 0-2-1-8-1-10 0z" fill="#2a2018"/>`)+`<path d="M5 7h38v32H5z" fill="none" stroke="#8a6a24" stroke-width="1"/>`;
  else if(/Rembrandt|Ets/.test(m))s+=fr('#4a3828',`<rect x="8.5" y="10.5" width="31" height="25" fill="#efe4cc"/><path d="M12 33c3-6 6-9 10-9s7 2 9 6M18 18c2-3 6-3 8 0M15 25h4M28 22h5M12 29l4-2M33 29l3 2" stroke="#5a4630" stroke-width=".8" fill="none"/><ellipse cx="22" cy="20.5" rx="3" ry="3.6" fill="none" stroke="#5a4630" stroke-width=".8"/><path d="M10 14l28 0" stroke="#5a4630" stroke-width=".3" opacity=".5"/>`);
  else s+=fr('#f2f3f5',`<rect x="8.5" y="10.5" width="31" height="25" fill="#faf7f0"/><circle cx="18" cy="20" r="6" fill="#e04a3a"/><rect x="24" y="14" width="12" height="9" fill="#2f6fd6"/><path d="M12 33l12-9 6 9z" fill="#f2c230"/><path d="M30 26c3 2 6 1 8 4" stroke="#1d1f22" stroke-width="1.6" fill="none"/>`)+`<rect x="5" y="7" width="38" height="32" fill="none" stroke="#cfd4da"/>`;
  return SVG_(s)}

/* ---- winkel: eén ingang ---- */
function icShop(k,b,m,v){const c=CATALOG[k];if(!c)return '🛍️';v=v||c.vars(b)[0][0];
  try{if(k==='horloges')return icWatch(m,v);if(k==='tassen')return icBag(m,v);if(k==='sieraden')return icJewel(m,v);if(k==='elektronica')return icTech(m);
    if(k==='autos')return icCar(b==='Klassiekers'?m:`${b} ${m}`);if(k==='boten')return icBoat(m);if(k==='vliegtuigen')return icPlane(m);if(k==='kunst')return icArt(m)}catch(e){}
  return c.em}
const catIcon=k=>{const c=CATALOG[k];const R={horloges:['Rolex','Submariner'],tassen:['Hermès','Birkin 30'],sieraden:['Tiffany & Co.','Solitaire-ring'],elektronica:['Apple','iPhone'],autos:['Porsche','911 Carrera'],boten:['Riva','Iseo'],vliegtuigen:['Gulfstream','G650'],kunst:['Galerie om de hoek','Schilderij van een lokale kunstenaar']}[k];return R?icShop(k,R[0],R[1]):c.em};
const brandIcon=(k,b)=>icShop(k,b,CATALOG[k].brands[b][Math.min(CATALOG[k].brands[b].length-1,k==='horloges'&&b==='Rolex'?2:0)][0]);
// voor gekochte spullen (ook oude saves zonder icoon-info)
function itemIcon(it){if(it.ico)return icShop(...it.ico);for(const [k,c] of Object.entries(CATALOG))for(const [b,ms] of Object.entries(c.brands))for(const m of ms)if(it.name===`${b} ${m[0]}`)return icShop(k,b,m[0],it.variant);return it.em||'🛍️'}
const carIcon=c=>icCar(c.name,c.col);

/* ---- huisdieren ---- */
const COAT={bruin:['#8a5a33'],zwart:['#2f2f33'],gevlekt:['#f1ece4','#5a3c26','spots'],zandkleurig:['#d8b98a'],blond:['#ebcb8b'],chocoladebruin:['#5e3a22'],goud:['#d9a144'],'crème':['#efdfc0'],donkergoud:['#b97a2c'],'zwart met bruin':['#2f2f33','#b9763a','tan'],'helemaal zwart':['#2f2f33'],grijs:['#8d8f94'],fawn:['#d9ac77'],gestroomd:['#7a5236','#2e231b','brindle'],blauwgrijs:['#7c8796'],'zwart-wit':['#2f2f33','#f6f4ef','bi'],'bruin-wit':['#7a4b2a','#f6f4ef','bi'],merle:['#9aa2ad','#2f2f33','merle'],rood:['#bf6430'],abrikoos:['#e9b07c'],wit:['#f6f4ef'],'grijs-wit':['#8d8f94','#f6f4ef','bi'],'rood-wit':['#b5582a','#f6f4ef','bi'],chocolade:['#5e3a22'],'wit met bruin':['#f6f4ef','#8a5a33','patch'],'wit met zwart':['#f6f4ef','#2f2f33','patch'],driekleur:['#f6f4ef','#2f2f33','tri'],
 cyper:['#8c7b66','#4a3f33','tabby'],lapjes:['#f6f4ef','#d98a3d','calico'],schildpad:['#2f2f33','#b8652c','tortie'],zilver:['#c4c8cd','#6b7076','tabby'],'bruin getijgerd':['#9a7652','#4a3522','tabby'],'seal point':['#efe3cc','#4a3427','point'],'blue point':['#eef0f2','#7f8a98','point'],'lilac point':['#f3eef0','#b3a5ad','point'],'seal colorpoint':['#efe3cc','#4a3427','point'],'blue mitted':['#eef0f2','#7f8a98','point'],lilac:['#f3eef0','#b3a5ad','point'],roze:['#eab8ab'],
 wildkleur:['#8b6d4f'],goudbruin:['#d29a55'],groen:['#5fb548'],blauw:['#4a8fe0'],geel:['#f2d13a'],parelgrijs:['#b9bcc0'],'blauw-geel':['#2f7fd6','#f2c230'],'rood-groen':['#d0262d','#3c9a4a'],bont:['#f6f4ef','#6b4a2b','spots'],vos:['#a5532a'],schimmel:['#dfe2e5','#a7adb4','dapple']};
const MIR=b=>`${b}<g transform="matrix(-1 0 0 1 48 0)">${b}</g>`;
const eyes=(x,y,d,c='#1f1a17')=>`<circle cx="${x-d}" cy="${y}" r="1.8" fill="${c}"/><circle cx="${x+d}" cy="${y}" r="1.8" fill="${c}"/><circle cx="${x-d+.6}" cy="${y-.6}" r=".55" fill="#fff"/><circle cx="${x+d+.6}" cy="${y-.6}" r=".55" fill="#fff"/>`;
const DOGB={'Asielhond (vuilnisbakkie)':{ear:'semi'},'Labrador':{ear:'floppy'},'Golden retriever':{ear:'floppy',fluff:1},'Duitse herder':{ear:'pointy',pat:'saddle',snout:1},'Franse bulldog':{ear:'bat',flat:1},'Border collie':{ear:'semi',pat:'blaze'},'Teckel':{ear:'long',snout:1,narrow:1},'Jack Russell':{ear:'folded'},'Poedel':{ear:'poodle'},'Husky':{ear:'pointy',pat:'mask',eye:'#5aa9e6'},'Chihuahua':{ear:'huge',small:1}};
function icDog(br,col){const B=DOGB[br]||DOGB['Asielhond (vuilnisbakkie)'];let [a,b2,pat]=COAT[col]||['#b07a44'];
  if(b2&&B.pat==='mask')pat='mask';else if(b2&&B.pat==='blaze')pat='blaze';else if(B.pat==='saddle'&&pat==='tan')pat='saddle';
  const hx=24,hy=B.small?27:26,rx=B.flat?12.5:B.small?9.5:B.narrow?9.5:11,ry=B.flat?10.5:B.small?9.2:11.5,top=hy-ry;
  const head=pat==='saddle'?b2:a,earC=pat==='patch'||pat==='tri'?b2:pat==='saddle'?a:shade(a,-.16),pink='#e9a0a0';
  const cid=`dh${rx}${ry}${hy}`.replace(/\./g,'');let s=`<clipPath id="${cid}"><ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}"/></clipPath>`;
  const L=hx-rx;let back='',front='';
  if(B.ear==='pointy')back=MIR(`<path d="M${L+2} ${top+8}L${L+1.5} ${top-6}L${L+10.5} ${top+3}Z" fill="${earC}"/><path d="M${L+3.6} ${top+5.5}L${L+3.4} ${top-2}L${L+8.4} ${top+3}Z" fill="${pat==='mask'?'#f3d3cf':pink}" opacity=".85"/>`);
  if(B.ear==='bat')back=MIR(`<path d="M${L+2} ${top+6}C${L-3} ${top-7} ${L+5} ${top-10} ${L+10.5} ${top+2}Z" fill="${earC}"/><path d="M${L+3.5} ${top+4}C${L+.5} ${top-4} ${L+5} ${top-6} ${L+8.5} ${top+2}Z" fill="${pink}"/>`);
  if(B.ear==='huge')back=MIR(`<path d="M${L+2} ${top+6}L${L-7} ${top-7}L${L+8.5} ${top+1}Z" fill="${earC}"/><path d="M${L+1.5} ${top+4}L${L-4} ${top-3.5}L${L+6} ${top+1}Z" fill="${pink}"/>`);
  if(B.ear==='folded')back=MIR(`<path d="M${L+1} ${top+6}L${L+2} ${top-1}L${L+9.5} ${top+1}Z" fill="${earC}"/>`);
  if(B.ear==='poodle')back=`<circle cx="20" cy="${top+1}" r="4" fill="${a}"/><circle cx="24" cy="${top-1.5}" r="4.6" fill="${a}"/><circle cx="28" cy="${top+1}" r="4" fill="${a}"/>`;
  if(B.ear==='floppy'||B.ear==='long'){const len=B.ear==='long'?14:9;front=MIR(`<path d="M${L+3.5} ${top+3}C${L-5} ${top+2} ${L-5.5} ${hy+len-2} ${L-.5} ${hy+len}C${L+2.5} ${hy+len+.5} ${L+4} ${hy} ${L+6} ${top+4}Z" fill="${earC}"/>`+(B.fluff?`<path d="M${L-3.4} ${hy+3}l-1.2 1.4M${L-3} ${hy+6.5}l-1.4 1.2M${L-1.5} ${hy+9}l-.8 1.6" stroke="${shade(a,-.3)}" stroke-width=".8"/>`:''))}
  if(B.ear==='semi')back=MIR(`<path d="M${L+2} ${top+8}L${L+1} ${top-3}L${L+10} ${top+3}Z" fill="${earC}"/><path d="M${L+1} ${top-3}L${L+5.5} ${top}L${L+3.6} ${top+3.5}Z" fill="${shade(earC,-.25)}"/>`);
  if(B.ear==='poodle')front=MIR(`<circle cx="${L-1}" cy="${hy+1}" r="3.6" fill="${shade(a,-.08)}"/><circle cx="${L-1.6}" cy="${hy+6}" r="3.6" fill="${shade(a,-.08)}"/><circle cx="${L}" cy="${hy+10.4}" r="3" fill="${shade(a,-.08)}"/>`);
  s+=back+`<ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}" fill="${head}"/><g clip-path="url(#${cid})">`;
  if(pat==='spots')s+=`<circle cx="${hx-5}" cy="${hy-6}" r="3.4" fill="${b2}"/><circle cx="${hx+6}" cy="${hy+1}" r="2.6" fill="${b2}"/><circle cx="${hx-7}" cy="${hy+5}" r="1.8" fill="${b2}"/>`;
  if(pat==='brindle')for(let i=-3;i<4;i++)s+=`<path d="M${hx+i*3.4-4} ${top}l5 ${ry*2}" stroke="${b2}" stroke-width="1.1" opacity=".55"/>`;
  if(pat==='merle')s+=`<circle cx="${hx-6}" cy="${hy-5}" r="3.6" fill="${b2}"/><circle cx="${hx+6}" cy="${hy-2}" r="2.8" fill="${b2}"/><circle cx="${hx+3}" cy="${hy-9}" r="1.8" fill="${b2}"/><path d="M${hx-1.6} ${top}L${hx+1.6} ${top}L${hx+3.5} ${hy+2}L${hx-3.5} ${hy+2}Z" fill="#f6f4ef"/>`;
  if(pat==='mask')s+=`<path d="M${L} ${hy+1}Q${hx} ${hy-7} ${hx+rx} ${hy+1}V${hy+ry}H${L}Z" fill="${b2}"/><path d="M${hx-1.6} ${top}L${hx+1.6} ${top}L${hx+3} ${hy-2}L${hx-3} ${hy-2}Z" fill="${b2}"/><ellipse cx="${hx-4.5}" cy="${hy-4.6}" rx="1.8" ry="1" fill="${b2}"/><ellipse cx="${hx+4.5}" cy="${hy-4.6}" rx="1.8" ry="1" fill="${b2}"/>`;
  if(pat==='blaze'||pat==='bi')s+=`<path d="M${hx-1.4} ${top}L${hx+1.4} ${top}L${hx+(pat==='blaze'?4.5:3)} ${hy+3}L${hx-(pat==='blaze'?4.5:3)} ${hy+3}Z" fill="${b2}"/>`;
  if(pat==='patch'||pat==='tri')s+=`<circle cx="${hx+5}" cy="${hy-2}" r="4.4" fill="${b2}"/><path d="M${L} ${top}H${hx-3}C${hx-5} ${hy-4} ${hx-8} ${hy-3} ${L} ${hy-4}Z" fill="${b2}"/>`+(pat==='tri'?`<circle cx="${hx-4.2}" cy="${hy-4.3}" r="1" fill="#b9763a"/><circle cx="${hx+4.2}" cy="${hy-4.3}" r="1" fill="#b9763a"/>`:'');
  if(pat==='tan')s+=`<circle cx="${hx-4.2}" cy="${hy-4.4}" r="1.3" fill="${b2}"/><circle cx="${hx+4.2}" cy="${hy-4.4}" r="1.3" fill="${b2}"/>`;
  if(pat==='saddle')s+=`<path d="M${L} ${top}H${hx+rx}V${hy-5}Q${hx} ${hy-1} ${L} ${hy-5}Z" fill="${a}" opacity=".85"/>`;
  s+='</g>';
  const my=hy+(B.flat?4.5:B.snout?6:5.5),mz=['mask','blaze','bi'].includes(pat)?b2:pat==='tan'?b2:pat==='saddle'?a:pat==='patch'||pat==='tri'?'#f6f4ef':shade(head,.2);
  s+=`<ellipse cx="${hx}" cy="${my}" rx="${B.flat?7:B.snout?5.6:6.3}" ry="${B.flat?4.3:B.snout?5.8:4.8}" fill="${mz}"/>`;
  s+=front+eyes(hx,hy-1.5,B.flat?5:4,B.eye||'#1f1a17');if(B.eye)s+=`<circle cx="${hx-4}" cy="${hy-1.5}" r=".8" fill="#111"/><circle cx="${hx+4}" cy="${hy-1.5}" r=".8" fill="#111"/>`;
  const ny=my-(B.flat?1.4:B.snout?.6:1.6);s+=`<ellipse cx="${hx}" cy="${ny}" rx="2.6" ry="1.8" fill="#24201e"/><path d="M${hx} ${ny+1.6}v1.4m0 0q-1.6 1.8-3.2.5m3.2-.5q1.6 1.8 3.2.5" stroke="#24201e" stroke-width=".8" fill="none"/>`;
  return SVG_(s)}
const CATB={'Asielkat':{},'Brits korthaar':{wide:1,small:1,eye:'#e08a2c'},'Maine coon':{tuft:1,ruff:1,eye:'#9bbf3a'},'Siamees':{big:1,narrow:1,eye:'#5ab0f0'},'Ragdoll':{ruff:1,eye:'#5ab0f0'},'Sphynx':{big:1,bald:1,eye:'#9bbf3a'}};
function icCat(br,col){const B=CATB[br]||{};let [a,b2,pat]=COAT[col]||['#8c7b66','#4a3f33','tabby'];if(!pat&&(col==='rood'||col==='crème'))[b2,pat]=[shade(a,-.25),'tabby'];
  const hx=24,hy=27,rx=B.wide?13.5:B.narrow?10.5:12,ry=B.wide?11:10,top=hy-ry,L=hx-rx,eh=B.big?11:B.small?5:7.5,pink='#eaa2a6';
  const earC=pat==='point'?b2:pat==='calico'?b2:a;const cid=`ch${rx}${ry}`.replace(/\./g,'');let s=`<clipPath id="${cid}"><ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}"/></clipPath>`;
  s+=`<path d="M${L+1} ${hy-2}L${L+(B.big?-.5:1.5)} ${top-eh}L${hx-3} ${top+1.5}Z" fill="${earC}"/><path d="M${hx+rx-1} ${hy-2}L${hx+rx-(B.big?-.5:1.5)} ${top-eh}L${hx+3} ${top+1.5}Z" fill="${pat==='calico'?'#2f2f33':earC}"/>`;
  s+=MIR(`<path d="M${L+3} ${hy-3}L${L+(B.big?2:3)} ${top-eh+4}L${hx-5} ${top+2}Z" fill="${pink}" opacity=".8"/>`);
  if(B.tuft)s+=MIR(`<path d="M${L+1.5} ${top-eh}l-1 -3M${L+1.5} ${top-eh}l1 -3.2" stroke="${shade(a,-.3)}" stroke-width=".8"/>`);
  if(B.ruff)s+=`<path d="M${L-1} ${hy+1}l2 3-1 2.5 3 1-.5 3 3-.5 1 3 2.5-2 1 3 2-2.5 1.5 3 1.5-3 2 2.5 1-3 2.5 2 1-3 3 .5-.5-3 3-1-1-2.5 2-3z" fill="${pat==='point'?'#f6f4ef':shade(a,.15)}"/>`;
  s+=`<ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}" fill="${a}"/><g clip-path="url(#${cid})">`;
  if(pat==='tabby')s+=`<path d="M${hx-3} ${top}v4M${hx} ${top}v5M${hx+3} ${top}v4M${L} ${hy+1}h5M${L} ${hy+4}h4.5M${hx+rx} ${hy+1}h-5M${hx+rx} ${hy+4}h-4.5" stroke="${b2}" stroke-width="1.3" stroke-linecap="round"/>`;
  if(pat==='calico')s+=`<path d="M${L} ${top}H${hx-1}C${hx-2} ${hy-3} ${hx-6} ${hy} ${L} ${hy-1}Z" fill="${b2}"/><path d="M${hx+2} ${top}H${hx+rx}V${hy-2}C${hx+7} ${hy-3} ${hx+4} ${hy-5} ${hx+2} ${top}Z" fill="#2f2f33"/>`;
  if(pat==='spots')s+=`<circle cx="${hx-5}" cy="${hy-5}" r="2.6" fill="${b2}" opacity=".7"/><circle cx="${hx+6}" cy="${hy+2}" r="2" fill="${b2}" opacity=".7"/>`;
  if(pat==='tortie')s+=`<circle cx="${hx-6}" cy="${hy-4}" r="4" fill="${b2}"/><circle cx="${hx+5}" cy="${hy+4}" r="3" fill="${b2}"/><circle cx="${hx+3}" cy="${hy-7}" r="2" fill="${b2}"/>`;
  if(pat==='point')s+=`<ellipse cx="${hx}" cy="${hy+3}" rx="7.5" ry="6.5" fill="${b2}" opacity=".9"/>`;
  if(pat==='bi')s+=`<path d="M${hx-2} ${top+2}L${hx+2} ${top+2}L${hx+8} ${hy+ry}H${hx-8}Z" fill="${b2}"/>`;
  if(B.bald)s+=`<path d="M${hx-4} ${top+2.5}q4 -1.5 8 0M${hx-3} ${top+4.3}q3 -1 6 0" stroke="${shade(a,-.2)}" stroke-width=".7" fill="none"/>`;
  s+='</g>';
  if(col==='blue mitted')s+=`<ellipse cx="${hx}" cy="${hy+5.5}" rx="3.5" ry="3" fill="#f6f4ef"/>`;
  const ec=B.eye||(pat==='point'?'#5ab0f0':'#a7c73a');s+=MIR(`<ellipse cx="${hx-4.6}" cy="${hy-1}" rx="2.5" ry="1.9" fill="${ec}"/><ellipse cx="${hx-4.6}" cy="${hy-1}" rx=".6" ry="1.6" fill="#111"/>`);
  s+=`<path d="M${hx-1.6} ${hy+2.6}h3.2l-1.6 1.8z" fill="${pink}"/><path d="M${hx} ${hy+4.4}q-1.3 1.6-2.8.6M${hx} ${hy+4.4}q1.3 1.6 2.8.6" stroke="#4a3a35" stroke-width=".7" fill="none"/>`;
  s+=MIR(`<path d="M${hx-5} ${hy+3.5}l-9 -1.4M${hx-5} ${hy+4.6}l-9 .6" stroke="${lum(a)>.6?'#9aa0a8':'#e8e8e8'}" stroke-width=".45"/>`);
  return SVG_(s)}
function icRabbit(col){const [a,b2,pat]=COAT[col]||['#f6f4ef'];const ia=col==='wit'?'#f2c7c7':shade(a,.25);let s=`<clipPath id="rbh"><ellipse cx="24" cy="31" rx="11" ry="9.5"/></clipPath>`;
  s+=`<ellipse cx="19" cy="13" rx="3.6" ry="11" fill="${a}" transform="rotate(-8 19 13)"/><ellipse cx="29" cy="13" rx="3.6" ry="11" fill="${a}" transform="rotate(8 29 13)"/><ellipse cx="19" cy="14" rx="1.8" ry="8" fill="${pat==='spots'?'#f2c7c7':ia}" transform="rotate(-8 19 14)"/><ellipse cx="29" cy="14" rx="1.8" ry="8" fill="${pat==='spots'?'#f2c7c7':ia}" transform="rotate(8 29 14)"/>`;
  s+=`<ellipse cx="24" cy="31" rx="11" ry="9.5" fill="${a}"/>`;if(pat==='spots')s+=`<g clip-path="url(#rbh)"><circle cx="18" cy="27" r="4" fill="${b2}"/><circle cx="31" cy="34" r="3" fill="${b2}"/><path d="M22 22h4l-1 10h-2z" fill="${b2}" opacity=".7"/></g>`;
  s+=`<ellipse cx="24" cy="35" rx="5" ry="3.6" fill="${shade(a,.3)}"/>`+eyes(24,29,4.3,col==='wit'?'#c0394a':'#1f1a17')+`<path d="M22.8 33h2.4L24 34.4z" fill="#e48a9a"/><path d="M24 34.4v1.4" stroke="#4a3a35" stroke-width=".7"/>`;
  return SVG_(s)}
function icHamster(col){const [a,b2]=COAT[col]||['#d29a55'];const belly=b2||'#fbf6ee';let s=shadowE(24,42,14);
  s+=`<circle cx="15" cy="15" r="4" fill="${shade(a,-.1)}"/><circle cx="33" cy="15" r="4" fill="${shade(a,-.1)}"/><circle cx="15" cy="15" r="2" fill="#f0b7b7"/><circle cx="33" cy="15" r="2" fill="#f0b7b7"/><ellipse cx="24" cy="28" rx="15" ry="13.5" fill="${a}"/><ellipse cx="24" cy="32" rx="10" ry="9" fill="${belly}"/>`+eyes(24,23,5.5)+`<ellipse cx="24" cy="27" rx="1.4" ry="1" fill="#e48a9a"/><path d="M24 28v1.2m0 0q-1.3 1.3-2.6.4m2.6-.4q1.3 1.3 2.6.4" stroke="#4a3a35" stroke-width=".7" fill="none"/><ellipse cx="13.5" cy="28" rx="3" ry="2" fill="#f2a5a5" opacity=".5"/><ellipse cx="34.5" cy="28" rx="3" ry="2" fill="#f2a5a5" opacity=".5"/>`;
  return SVG_(s)}
function icBird(br,col){let s=`<path d="M8 40h32" stroke="#8a5a33" stroke-width="2.4" stroke-linecap="round"/>`;const B=br||'Grasparkiet';
  if(B==='Grasparkiet'){const c=COAT[col]?.[0]||'#5fb548',face=col==='blauw'?'#f4f5f7':'#f2d13a';s+=`<path d="M27 32l9 9 1.5-1-8-10z" fill="#2f5fb0"/><ellipse cx="23" cy="28" rx="8" ry="10" fill="${c}" transform="rotate(15 23 28)"/><path d="M24 22c4 3 6 8 5 14-4-2-7-6-7-11z" fill="${shade(c,-.25)}"/>`+[0,1,2].map(i=>`<path d="M25 ${25+i*3}q2 .8 4 0" stroke="#222" stroke-width=".6" fill="none"/>`).join('')+`<circle cx="20" cy="15" r="6.5" fill="${face}"/>`+[0,1,2].map(i=>`<path d="M${18+i*2.4} 9.5q1 .8 2 0" stroke="#333" stroke-width=".6" fill="none"/>`).join('')+`<path d="M14.5 15c-2 1-2 3.5.3 4l1.6-2z" fill="#e8b46a"/><circle cx="18.6" cy="14" r="1.2" fill="#111"/>`}
  else if(B==='Valkparkiet'){const c=COAT[col]?.[0]||'#9ea3a8';s+=`<path d="M27 32l10 9 1.4-1-9-10z" fill="${shade(c,-.2)}"/><ellipse cx="23" cy="28" rx="8" ry="10.5" fill="${c}" transform="rotate(15 23 28)"/><path d="M25 22c4 3 6 8 5 13-4-2-7-6-7-11z" fill="${col==='wit'?'#e8e2c8':'#f4f5f7'}"/><circle cx="20" cy="15" r="6.5" fill="${col==='grijs'?'#f2d13a':'#f6efc0'}"/><path d="M21 9c0-4 2-6 4-7-1 3-1 5 0 7zM19 9c-1-3 0-6 2-7 0 3 0 5 1 7z" fill="${col==='grijs'?'#f2d13a':'#f6efc0'}"/><circle cx="20.5" cy="17" r="2" fill="#f07c22"/><path d="M14.5 15c-2 1-2 3.5.3 4l1.6-2z" fill="#9a8a8a"/><circle cx="18.6" cy="14" r="1.2" fill="#111"/>`}
  else if(B==='Grijze roodstaart')s+=`<path d="M26 33l7 8 3-1.5-5-9z" fill="#d0262d"/><ellipse cx="23" cy="27" rx="9" ry="11.5" fill="#9ea3a8" transform="rotate(12 23 27)"/><path d="M24 20c5 3 7 9 6 15-5-2-8-7-8-12z" fill="#7b8086"/><circle cx="20" cy="14" r="7" fill="#b3b7bc"/><circle cx="18" cy="13.5" r="3" fill="#eef0f2"/><circle cx="17.8" cy="13.5" r="1.2" fill="#111"/><path d="M13.5 13c-3 1-3 5 0 6l2-3z" fill="#24262a"/>`;
  else if(B==='Ara'){const [c,c2]=col==='rood-groen'?['#d0262d','#2f7fd6']:['#2f7fd6','#f2c230'];s+=`<path d="M27 31l14 13 2-1.5-13-14z" fill="${col==='rood-groen'?'#d0262d':'#2f7fd6'}"/><ellipse cx="23" cy="26" rx="9" ry="12" fill="${col==='rood-groen'?c:c2}" transform="rotate(14 23 26)"/><path d="M24 18c5 3 8 9 7 16-5-2-9-7-9-12z" fill="${col==='rood-groen'?'#3c9a4a':c}"/><path d="M27 25c3 2 4 5 4 8" stroke="${col==='rood-groen'?c2:'#2560b0'}" stroke-width="2" fill="none"/><circle cx="20" cy="13" r="7" fill="${col==='rood-groen'?c:c}"/><ellipse cx="18" cy="13.5" rx="3.6" ry="3" fill="#f4f5f7"/><circle cx="17.8" cy="13" r="1.2" fill="#111"/><path d="M13 12c-3 1-3 6 0 7l2.4-3.6z" fill="#24262a"/>`}
  else{const c=col==='roze'?'#f2b8c6':'#f6f6f2',cr=col==='roze'?'#e8708e':'#f2d13a';s+=`<path d="M27 32l8 8 2-1.5-7-9z" fill="${shade(c,-.08)}"/><ellipse cx="23" cy="27" rx="9" ry="11.5" fill="${c}" transform="rotate(12 23 27)"/><path d="M24 20c5 3 7 9 6 15-5-2-8-7-8-12z" fill="${shade(c,-.07)}"/><path d="M22 9c2-6 6-8 9-8-2 2-4 5-4 9zM20 9c0-5 2-8 5-9-1 3-2 6-1 10z" fill="${cr}"/><circle cx="20" cy="14" r="7" fill="${c}"/><circle cx="18" cy="13.5" r="1.2" fill="#111"/><path d="M13.5 13c-3 1-3 5 0 6l2-3z" fill="#3a3d42"/>`}
  return SVG_(s)}
function icHorse(br,col){const B=br||'KWPN-sportpaard';let [a,b2,pat]=COAT[col]||(B==='Fries'?['#1f1f22']:B==='Haflinger'?['#b5652c']:['#7a4527']);
  const mane=B==='Haflinger'?'#f0dca0':col==='bruin'||!col&&B==='KWPN-sportpaard'?'#1f1f22':col==='schimmel'?'#c8ccd1':col==='vos'?'#8a3f1e':col==='bont'?'#6b4a2b':'#1f1f22';
  const sh=B==='Shetlandpony';let s=`<clipPath id="hhd"><path d="M9 46C9 31 13 21 21 14L23 7L26 12.5C31 13 37 20 41 27.5C43 31 41.5 34.5 38 34.5C35 34.5 33 32.5 30.5 31.5C28.5 34 27.5 39 28.5 46Z"/></clipPath>`;
  s+=`<g transform="${sh?'translate(2 3) scale(.92)':''}"><path d="M9 46C9 31 13 21 21 14L23 7L26 12.5C31 13 37 20 41 27.5C43 31 41.5 34.5 38 34.5C35 34.5 33 32.5 30.5 31.5C28.5 34 27.5 39 28.5 46Z" fill="${a}"/>`;
  if(pat==='spots')s+=`<g clip-path="url(#hhd)"><circle cx="14" cy="34" r="6" fill="${b2}"/><circle cx="31" cy="20" r="4" fill="${b2}"/><circle cx="22" cy="44" r="4" fill="${b2}"/></g>`;
  if(pat==='dapple')s+=`<g clip-path="url(#hhd)">${[[14,36],[18,28],[13,42],[22,38]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="${b2}" opacity=".6"/>`).join('')}</g>`;
  if(B==='KWPN-sportpaard'||B==='Arabier')s+=`<path d="M30 15c3 3 6 8 8.5 13l-2 .8c-2.6-4.6-5-8.8-7.6-12.4z" fill="#f6f4ef" opacity=".9"/>`;
  const long=B==='Fries';s+=`<path d="M21 14C16 18 11 26 9 ${long?44:38}c${sh?-3:-1.5} -2 ${long?-4:-2.5} -5 -2.5 -9 0 -6 5 -13 11 -19z" fill="${mane}"/><path d="M23.5 9c1 3 3 5 6 6-2 1-5 1-7-1z" fill="${mane}"/>`;
  if(long||sh)s+=`<path d="M10 30c-3 2-4 6-2 10M12 24c-3 2-4 5-3 8" stroke="${shade(mane,.2)}" stroke-width="1" fill="none"/>`;
  s+=`<path d="M23 7l1.5-4 2 6z" fill="${shade(a,-.2)}"/><circle cx="28.5" cy="20" r="1.5" fill="#1a1512"/><circle cx="29" cy="19.5" r=".45" fill="#fff"/><ellipse cx="38.5" cy="30" rx="1.2" ry=".8" fill="${shade(a,-.45)}"/><path d="M36 34c1 .6 2 .6 3 0" stroke="${shade(a,-.45)}" stroke-width=".7" fill="none"/></g>`;
  return SVG_(s)}
function icTurtle(br){const B=br||'Griekse landschildpad';const [sc,sk,h]=B.startsWith('Rood')?['#4f7d3a','#3f6630',8]:B.startsWith('Russ')?['#8a8448','#a69a6a',10]:['#c9a54a','#9a8a5a',13];let s=shadowE(24,41,17);
  s+=`<ellipse cx="13" cy="37" rx="3" ry="2.2" fill="${sk}"/><ellipse cx="33" cy="37" rx="3" ry="2.2" fill="${sk}"/><path d="M36 30c4-2 9-1 9 2s-4 4-8 3z" fill="${sk}"/><circle cx="42" cy="31" r=".9" fill="#111"/>`;
  if(B.startsWith('Rood'))s+=`<path d="M38 32.6h5" stroke="#d0262d" stroke-width="1.2"/>`;
  s+=`<path d="M7 36c0-${h} 7-${h+5} 15-${h+5}s15 5 15 ${h+5}z" fill="${sc}" stroke="${shade(sc,-.35)}" stroke-width=".8"/><path d="M7 36h30" stroke="${shade(sc,-.35)}" stroke-width="1.6"/>`;
  s+=`<path d="M17 ${36-h*.95}l5 4 5-4M15 ${36-h*.5}l7 1 7-1M22 ${36-h*.6}v${h*.55}M12 34l3-${h*.45}M32 34l-3-${h*.45}" stroke="${shade(sc,-.35)}" stroke-width=".8" fill="none"/>`;
  return SVG_(s)}
function icPet(sp,br,col){const d=PETBR[sp];if(!br&&d&&d.l)br=d.l[0][0];if(!col){const e=d&&d.l?(d.l.find(x=>x[0]===br)||d.l[0])[3]:d&&d.c;col=e?e[0]:''}
  try{if(sp==='hond')return icDog(br,col);if(sp==='kat')return icCat(br,col);if(sp==='konijn')return icRabbit(col);if(sp==='hamster')return icHamster(col);if(sp==='papegaai')return icBird(br,col);if(sp==='paard')return icHorse(br,col);if(sp==='schildpad')return icTurtle(br)}catch(e){}
  return PETEM[sp]||'🐾'}
const petIcon=p=>icPet(p.sp,p.br,p.col);

/* ---- huizen ---- */
const win=(x,y,w=4,h=5,lit)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".4" fill="${lit?'#ffd96a':'#cfe8f7'}" stroke="#fff" stroke-width=".7"/>`;
function icHouse(t){if(t==='Starterswoning')t='Rijtjeshuis';let s=`<path d="M1 42h46v3H1z" fill="#7cc06a"/>`;const tree=(x,y=42,r=5)=>`<path d="M${x} ${y}v-6" stroke="#7a5236" stroke-width="1.6"/><circle cx="${x}" cy="${y-9}" r="${r}" fill="#5fb548"/><circle cx="${x-1.6}" cy="${y-10.4}" r="${r*.45}" fill="#7fcb62"/>`;
  switch(t){
  case 'Studentenkamer':return SVG_(`<rect x="4" y="8" width="40" height="34" rx="2" fill="#f1ece4"/><rect x="28" y="12" width="12" height="9" fill="#cfe8f7" stroke="#fff"/><path d="M6 32h22v6H6z" fill="#7a8ba0"/><rect x="6" y="28" width="7" height="5" rx="2" fill="#f4f5f7"/><path d="M13 28h15v4H13z" fill="#5c7fae"/><path d="M6 38v3M28 38v3" stroke="#555" stroke-width="1.4"/><rect x="31" y="27" width="10" height="2" fill="#a0764c"/><path d="M32 29v12M40 29v12" stroke="#a0764c" stroke-width="1.4"/><rect x="33" y="23" width="6" height="4" rx=".5" fill="#3a3d42"/>`);
  case 'Studio':case 'Appartement':{const tall=t==='Appartement';s+=`<rect x="10" y="${tall?6:14}" width="28" height="${tall?36:28}" fill="#d9c7ae"/><rect x="10" y="${tall?6:14}" width="28" height="2.4" fill="#a8927a"/>`;const rows=tall?5:3;for(let r=0;r<rows;r++)for(let c=0;c<3;c++)s+=win(13+c*8.5,(tall?10:18)+r*6.6,5,4.4,!tall&&r===1&&c===1);if(tall)for(let r=0;r<4;r++)s+=`<path d="M12 ${15+r*6.6}h24" stroke="#8a7a68" stroke-width=".8"/>`;s+=`<rect x="21.5" y="36" width="5" height="6" fill="#4a3a2c"/>`;return SVG_(s)}
  case 'Benedenwoning':s+=`<rect x="8" y="12" width="32" height="30" fill="#b5583a"/><path d="M7 11h34v3H7z" fill="#e8e2d6"/><path d="M8 27h32" stroke="#e8e2d6" stroke-width="1.2"/>`+win(11,15,6,8)+win(21,15,6,8)+win(31,15,6,8)+win(11,30,6,8)+`<rect x="21" y="30" width="5" height="12" fill="#2f5a3a"/><rect x="31" y="30" width="5" height="12" fill="#6b3a2a"/>`;return SVG_(s);
  case 'Rijtjeshuis':for(let i=0;i<3;i++){const x=3+i*14,c=i===1?'#c8734f':'#a9583e';s+=`<rect x="${x}" y="20" width="14" height="22" fill="${c}" stroke="#8a3f2a" stroke-width=".4"/><path d="M${x-1} 21L${x+7} 11L${x+15} 21Z" fill="${i===1?'#5a4a42':'#4a3c36'}"/>`+win(x+2,24,4,5)+win(x+8,24,4,5)+`<rect x="${x+2.5}" y="33" width="4" height="9" fill="#2f4a5a"/>`+win(x+8,34,4,4)}return SVG_(s);
  case 'Twee-onder-een-kap':s+=`<path d="M4 22L24 7L44 22Z" fill="#4a3c36"/><rect x="6" y="21" width="18" height="21" fill="#c8734f"/><rect x="24" y="21" width="18" height="21" fill="#d08a63"/><path d="M24 21v21" stroke="#8a3f2a"/>`+win(9,25,5,5)+win(34,25,5,5)+`<rect x="16" y="32" width="5" height="10" fill="#2f4a5a"/><rect x="27" y="32" width="5" height="10" fill="#2f4a5a"/>`+win(9,33,5,5)+win(34,33,5,5)+`<rect x="33" y="10" width="3" height="6" fill="#6b4a3a"/>`;return SVG_(s);
  case 'Vrijstaande woning':s+=tree(41,42,4.6)+`<path d="M5 22L19 10L33 22Z" fill="#4a3c36"/><rect x="28" y="12" width="3" height="6" fill="#6b4a3a"/><rect x="7" y="21" width="24" height="21" fill="#e8e2d6"/>`+win(10,25,5,5)+win(23,25,5,5)+`<rect x="16.5" y="32" width="5" height="10" fill="#2f5a3a"/>`+win(10,33,5,5)+win(23,33,5,5);return SVG_(s);
  case 'Penthouse':s+=`<rect x="14" y="13" width="20" height="29" fill="#8c9aaa"/>`;for(let r=0;r<4;r++)for(let c=0;c<3;c++)s+=`<rect x="${16+c*6}" y="${17+r*6}" width="4" height="4" fill="#cfe8f7"/>`;s+=`<rect x="12" y="5" width="24" height="8" fill="#bfe1f5" stroke="#5d6b7a" stroke-width=".8"/><path d="M12 5h24M18 5v8M24 5v8M30 5v8" stroke="#5d6b7a" stroke-width=".6"/><path d="M10 13h28" stroke="#3a4450" stroke-width="1.2"/>`+spark(38,6,2,'#ffd84a');return SVG_(s);
  case 'Boerderij':s+=`<rect x="34" y="12" width="9" height="30" rx="4" fill="#cfd4da"/><path d="M34 16a4.5 4.5 0 0 1 9 0" fill="#9aa2ac"/><path d="M4 24L10 12h18l6 12z" fill="#7a3a2a"/><rect x="5" y="24" width="28" height="18" fill="#c0392b"/><path d="M5 24h28" stroke="#f4f5f7" stroke-width="1"/><rect x="13" y="29" width="12" height="13" fill="#f4f5f7"/><path d="M13 29l12 13M25 29l-12 13" stroke="#c0392b" stroke-width="1.2"/><rect x="16.5" y="16" width="5" height="5" fill="#f4f5f7"/>`;return SVG_(s);
  case 'Villa':s+=`<rect x="4" y="22" width="22" height="16" fill="#f4f5f7" stroke="#cfd4da" stroke-width=".6"/><rect x="18" y="14" width="26" height="12" fill="#f4f5f7" stroke="#cfd4da" stroke-width=".6"/><rect x="20" y="16" width="22" height="8" fill="#9fd0ec"/><path d="M27 16v8M34 16v8" stroke="#fff" stroke-width=".8"/><rect x="6" y="26" width="16" height="10" fill="#9fd0ec"/><path d="M14 26v10" stroke="#fff" stroke-width=".8"/><rect x="26" y="26" width="18" height="12" fill="#e8e2d6"/><path d="M3 13.6h42" stroke="#3a4450" stroke-width="1.4"/><rect x="4" y="40" width="26" height="3" rx="1" fill="#4ab0e8"/>`;return SVG_(s);
  case 'Grachtenpand':s=`<path d="M1 41h46v6H1z" fill="#4a8ec0"/><path d="M1 41c4 1.5 6 1.5 10 0s6-1.5 10 0 6 1.5 10 0 6-1.5 10 0 4 1.5 6 1" stroke="#9fd6f5" fill="none"/>`;s+=`<path d="M14 41V12h3V9h3V6h8v3h3v3h3v29z" fill="#8a3f2a"/><path d="M14 41V12h3V9h3V6h8v3h3v3h3v29" fill="none" stroke="#f1ece4" stroke-width=".8"/><path d="M24 6v-2.4M22 4h6" stroke="#2a2d31" stroke-width="1"/>`;for(let r=0;r<3;r++)s+=win(17,15+r*7.4,5,5.6)+win(26,15+r*7.4,5,5.6);s+=`<rect x="21.5" y="35" width="5" height="6" fill="#2f4a3a"/><circle cx="24" cy="9.5" r="1.4" fill="#cfe8f7"/>`;return SVG_(s);
  case 'Landgoed':s+=tree(5,42,4.4)+tree(43,42,4.4)+`<path d="M9 21L24 11L39 21Z" fill="#4a5560"/><rect x="10" y="20" width="28" height="22" fill="#efe6d4"/><path d="M19 20L24 15L29 20Z" fill="#efe6d4" stroke="#cfc3ab" stroke-width=".6"/>`;for(const x of [12,16,30,34])s+=win(x,23,3,5)+win(x,32,3,5);for(const x of [20,22.6,25.2,27.8])s+=`<rect x="${x}" y="21" width="1.2" height="21" fill="#fff" stroke="#cfc3ab" stroke-width=".3"/>`;s+=`<rect x="22" y="35" width="4" height="7" fill="#5a4030"/>`;return SVG_(s);
  default:return SVG_(s+`<path d="M8 22L24 9L40 22Z" fill="#4a3c36"/><rect x="11" y="21" width="26" height="21" fill="#e8e2d6"/>`)}}
const rentIcon=n=>icHouse({'Eengezinswoning':'Rijtjeshuis','Luxe penthouse':'Penthouse'}[n]||n);

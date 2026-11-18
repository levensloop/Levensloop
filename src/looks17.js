/* ================= Namen en uiterlijk kloppen bij het geslacht =================
   Oude levens: een naam die niet bij het geslacht past wordt rechtgezet.
   - Rol met vast geslacht (vader, zus, ...): het geslacht volgt de rol; de naam wordt een passende naam.
   - Andere personen (partner, vriend, politicus, ...): het geslacht en het gezicht volgen de naam.
   Kapsels: zie fixHair in avatar.js (vrouwen krijgen een vrouwenkapsel). */
const GROLE={m:['vader','opa','broer','oom','neef','neefje','schoonvader','zwager','stiefvader','stiefbroer','schoonzoon','halfbroer'],
  v:['moeder','oma','zus','tante','nicht','nichtje','schoonmoeder','schoonzus','stiefmoeder','stiefzus','schoondochter','halfzus']};
function looksFix(p,reg){if(!p||!p.first||p.role==='huisdier'||p.g==='x')return;const ng=nameG(p.first);if(!ng||ng===p.g)return;
  const want=GROLE.m.includes(p.role)?'m':GROLE.v.includes(p.role)?'v':null;
  if(want){p.g=want;const N=NAMES[reg]||NAMES.nl;p.first=pick(N[want]);if(p.ap)p.ap=Object.assign(randAp(want),{skin:p.ap.skin,eye:p.ap.eye,hc:p.ap.hc})}
  else{p.g=ng;if(p.ap)p.ap=Object.assign(randAp(ng),{skin:p.ap.skin,eye:p.ap.eye,hc:p.ap.hc})}}
function looksMigrate(s){if(!s||!s.p)return;const reg=(COUNTRIES[s.p.country]||COUNTRIES.NL).r;
  for(const p of s.rel||[])looksFix(p,reg);
  if(s.pol&&Array.isArray(s.pol.ppl))for(const p of s.pol.ppl)looksFix(p,reg);
  const gp=s.roy&&s.roy.gp;if(gp&&gp.first){const ng=nameG(gp.first);if(ng&&ng!==gp.g)gp.g=ng}
  const c=s.crim&&s.crim.jail&&s.crim.jail.cell;if(c&&c.first&&c.ap&&!c.lk17){c.lk17=1;const ng=nameG(c.first);if(ng){c.g=ng;c.ap=randAp(ng)}}}
migrate=(f=>function(s){f.apply(this,arguments);safe(()=>looksMigrate(s))})(migrate);

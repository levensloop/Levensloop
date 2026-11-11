/* ================= RESERVEKOPIE (verbeterplan 2.3) =================
   Menu → Reservekopie. Exporteren naar een bestand (deelknop van de iPhone, of downloaden),
   of als tekst kopiëren. Importeren uit een bestand of door te plakken. Importeren voegt levens toe;
   een leven dat al bestaat wordt alleen vervangen als de speler dat kiest. */
function backupText(){const lives={};
  for(const [id,l] of Object.entries(STORE.lives)){const c=Object.assign({},l);delete c.snaps;let pk=null;try{pk=l.done?null:snapPack(l,S&&S.id===id?0:3)}catch(e){}lives[id]={l:c,s:pk}}
  return JSON.stringify({app:'levensloop',v:2,versie:typeof APP_VERSION!=='undefined'?APP_VERSION:'claude.ai',gemaakt:new Date().toISOString(),last:STORE.last,meta:STORE.meta,lives})}
function backupName(){const d=new Date(),z=n=>String(n).padStart(2,'0');return `levensloop-reservekopie-${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}.json`}
async function backupShare(){if(S)saveLife();const txt=backupText();const name=backupName();
  try{const f=new File([txt],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Levensloop reservekopie'});toast('Reservekopie gedeeld');return 'share'}}catch(e){if(e&&e.name==='AbortError')return 'abort'}
  try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);toast('Reservekopie gedownload');return 'download'}catch(e){}
  toast('Delen lukte niet. Gebruik "Kopieer als tekst".');return 'fail'}
async function backupCopy(){if(S)saveLife();const txt=backupText();let ok=false;try{await navigator.clipboard.writeText(txt);ok=true}catch(e){}
  if(!ok){const t=document.createElement('textarea');t.value=txt;t.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(t);t.select();t.setSelectionRange(0,txt.length);try{ok=document.execCommand('copy')}catch(e){}t.remove()}
  toast(ok?`Gekopieerd (${Math.round(txt.length/1024)} KB). Plak het in Notities of een mail aan jezelf.`:'Kopiëren lukte niet');return ok}
// leest een reservekopie; geeft {lives:{id:leven}, meta, n} of gooit een fout met een leesbare uitleg
function backupParse(txt){let d;try{d=JSON.parse(String(txt).trim())}catch(e){throw new Error('Dit is geen reservekopie van Levensloop (geen geldige tekst).')}
  if(d&&d.lives&&!d.app&&!d.v)return {lives:d.lives,meta:d.meta,n:Object.keys(d.lives).length};// ook een oude levensloop.v1-opslag
  if(!d||d.app!=='levensloop'||!d.lives)throw new Error('Dit is geen reservekopie van Levensloop.');
  const lives={};for(const [id,x] of Object.entries(d.lives)){const l=x.l;if(!l)continue;if(!l.done)l.snaps=x.s?snapUnpack(l,x.s):[];lives[id]=l}
  return {lives,meta:d.meta,n:Object.keys(lives).length}}
function backupImport(txt){let B;try{B=backupParse(txt)}catch(e){toast(e.message);return}
  if(!B.n){toast('Er staan geen levens in deze reservekopie.');return}
  const clash=Object.keys(B.lives).filter(id=>STORE.lives[id]);const fresh=Object.keys(B.lives).filter(id=>!STORE.lives[id]);
  const finish=(mode)=>{let n=0;for(const id of fresh){STORE.lives[id]=B.lives[id];n++}
    for(const id of clash){if(mode==='skip')continue;const l=B.lives[id];if(mode==='copy'){const nid=uid();l.id=nid;STORE.lives[nid]=l}else{if(S&&S.id===id)continue;STORE.lives[id]=l}n++}
    if(B.meta){const M=meta();for(const c of B.meta.careers||[])if(!M.careers.includes(c))M.careers.push(c);for(const r of B.meta.ribbons||[])if(!M.ribbons.includes(r))M.ribbons.push(r)}
    const ok=lsSave();if(curScreen==='start')renderStart();refreshSheet&&!$('#sheet').hidden&&refreshSheet();
    toast(n?`${n} ${n===1?'leven':'levens'} toegevoegd${ok?'':' (maar opslaan lukte niet)'}`:'Niets toegevoegd')};
  if(!clash.length){finish('skip');return}
  const nm=id=>{const l=B.lives[id];return l.done?l.name:l.p.first+' '+l.p.last};
  modal({title:'Bestaat al',em:'📦',cat:'Reservekopie',text:`${clash.length===1?nm(clash[0])+' staat':clash.length+' levens staan'} al op dit toestel${fresh.length?`. ${fresh.length} nieuwe ${fresh.length===1?'leven wordt':'levens worden'} hoe dan ook toegevoegd`:''}. Wat wil je met ${clash.length===1?'dit leven':'deze levens'}?`,choices:opts([
    {t:'Overslaan (niets overschrijven)',cls:'go',on:()=>{closeModal();finish('skip')}},
    {t:'Als kopie toevoegen',on:()=>{closeModal();finish('copy')}},
    {t:'Vervangen door de reservekopie',cls:'bad',on:()=>{closeModal();finish('replace')}}])})}
function backupPickFile(){const i=document.createElement('input');i.type='file';i.accept='.json,application/json,text/plain';i.style.display='none';
  i.onchange=()=>{const f=i.files&&i.files[0];if(!f){i.remove();return}const r=new FileReader();r.onload=()=>{backupImport(r.result);i.remove()};r.onerror=()=>{toast('Het bestand kon niet worden gelezen');i.remove()};r.readAsText(f)};
  document.body.appendChild(i);i.click()}
function backupPaste(){modal({title:'Reservekopie plakken',em:'📋',cat:'Reservekopie',html:'<textarea id="bk-txt" class="inp" style="width:100%;height:140px;font-size:12px" placeholder="Plak hier de tekst van je reservekopie"></textarea>',
  choices:[{t:'Importeren',cls:'go',on:()=>{const v=$('#bk-txt').value;closeModal();backupImport(v)}},{t:'Annuleren',cls:'ghost',on:closeModal}]})}
function sheetBackup(el){const n=Object.keys(STORE.lives).length;
  card(el,`<span class="muted">Je levens staan alleen in deze app. Haal je de app van je beginscherm, dan ben je ze kwijt. Maak daarom af en toe een reservekopie en bewaar die bijvoorbeeld in Bestanden of iCloud Drive.</span>`);
  let s=sec(el,'Bewaren');
  row(s,{ic:'📤',t:'Reservekopie maken',s:`${n} ${n===1?'leven':'levens'} · via de deelknop of als download`,on:()=>backupShare()});
  row(s,{ic:'📋',t:'Kopieer als tekst',s:'Plak het in Notities of een mail aan jezelf',on:()=>backupCopy()});
  s=sec(el,'Terugzetten');
  row(s,{ic:'📥',t:'Bestand kiezen',s:'Levens uit een reservekopie toevoegen',on:()=>backupPickFile()});
  row(s,{ic:'📝',t:'Tekst plakken',s:'Als je de reservekopie als tekst hebt bewaard',dots:true,on:()=>backupPaste()})}
// vanaf het startscherm (ook als er nog geen leven is, bijvoorbeeld na opnieuw installeren)
function backupModal(){const n=Object.keys(STORE.lives).length;
  modal({title:'Reservekopie',em:'🛟',cat:'Mijn levens',text:n?`Bewaar je ${n} ${n===1?'leven':'levens'} buiten de app, of zet levens terug uit een reservekopie.`:'Zet je levens terug uit een reservekopie die je eerder hebt gemaakt.',choices:opts([
    ...(n?[{t:'📤 Reservekopie maken',cls:'go',on:()=>{closeModal();backupShare()}},{t:'📋 Kopieer als tekst',on:()=>{closeModal();backupCopy()}}]:[]),
    {t:'📥 Bestand kiezen',cls:n?'':'go',on:()=>{closeModal();backupPickFile()}},
    {t:'📝 Tekst plakken',on:()=>{closeModal();backupPaste()}},
    {t:'Annuleren',cls:'ghost',on:closeModal}])})}

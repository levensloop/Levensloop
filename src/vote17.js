/* ================= Stemmen als gewone burger =================
   Keuze Thijmen: verkiezingen alleen als pop-up als je met politiek bezig bent.
   Anders vraagt het spel één keer (als je 18 wordt) welke partij bij je past en stem je daarna automatisch.
   Oude levens: wie al eens stemde, stemt automatisch op die partij; wie nog niets koos, krijgt de vraag één keer. */
function voteParties(){const W=polW();if(isPres())return ['dem','rep','gpus'].filter(k=>PTY(k));return Object.keys(W.sh||{}).filter(k=>PTY(k)).sort((a,b)=>W.sh[b]-W.sh[a])}
function voteLabel(){const m=voteMode(),W=S.pw;if(m==='ask')return 'Elke keer vragen';if(m==='none')return 'Niet stemmen';return W&&W.vote&&PTY(W.vote)?`Automatisch op ${PTY(W.vote).n}`:'Automatisch (nog geen partij gekozen)'}
function voteChoices(after){const W=polW();return voteParties().map(k=>({t:`${PTY(k).em} ${PTY(k).n}`,s:PTY(k).k&&PTY(k).k!==PTY(k).n?PTY(k).k:'',cls:voteMode()==='same'&&W.vote===k?'go':'',on:()=>{closeModal();W.vote=k;S.settings.vote='same';after(`Je voorkeur: ${PTY(k).n}. Bij verkiezingen stem je voortaan automatisch op ${PTY(k).n}.`)}}))
  .concat([{t:'🛋️ Ik stem niet',cls:voteMode()==='none'?'go':'',on:()=>{closeModal();S.settings.vote='none';after('Je gaat niet stemmen.')}},
    {t:'🗳️ Vraag het me elke keer',s:'Bij elke verkiezing een pop-up',cls:voteMode()==='ask'?'go':'',on:()=>{closeModal();S.settings.vote='ask';after('Bij elke verkiezing vraagt het spel op wie je stemt.')}}])}
// vanuit het menu: altijd te wijzigen
function voteMenu(){if(S.dict){toast('In een dictatuur valt er niets te kiezen');return}modal({title:'Stemmen',em:'🗳️',cat:'Instellingen',text:'Welke partij past het best bij jou? Bij verkiezingen stem je daar automatisch op.',choices:opts(voteChoices(t=>{toast(t);refreshSheet();saveLife()}))})}
// de vraag bij 18 (één keer)
E('vote18',{sys:1,need:()=>!S.dict,t:'Je mag stemmen!',x:()=>ageY()<=18?'Je bent 18 en mag voortaan stemmen. Welke partij past het best bij jou? Bij verkiezingen stem je daarna automatisch. In het menu kun je dit altijd veranderen.':'Voortaan stem je automatisch bij verkiezingen. Welke partij past het best bij jou? In het menu kun je dit altijd veranderen.',ch:[]});
Object.defineProperty(EV.vote18,'ch',{get(){const W=polW();return voteParties().map(k=>[`${PTY(k).em} ${PTY(k).n}`,()=>{W.vote=k;S.settings.vote='same';return `Je voorkeur: ${PTY(k).n}. Bij verkiezingen stem je voortaan automatisch.`}])
  .concat([['🛋️ Ik stem niet',()=>{S.settings.vote='none';return 'Je gaat niet stemmen. In het menu kun je dit altijd veranderen.'}],['🗳️ Vraag het me elke keer',()=>{S.settings.vote='ask';return 'Bij elke verkiezing vraagt het spel op wie je stemt.'}]])}});
EVMETA.vote18=['Politiek','🗳️'];
F8.year.push(a=>{if(!S.alive||a<18||S.flags.vote18||S.dict||inJail())return;S.flags.vote18=1;if(S.settings.vote)return;// zelf al ingesteld
  const W=S.pw;if(W&&W.vote&&PTY(W.vote))return;// stemde al eens: daar gaat het automatisch op verder
  if(!voteParties().length)return;Q.push({id:'vote18'})});

/* Start het spel pas als alle bestanden geladen zijn (voorheen gebeurde dat halverwege, aan het eind van ui.js,
   waardoor gebeurtenissen uit latere bestanden bij het openen nog niet bestonden). */
window.claude?.hot?.ready?window.claude.hot.ready(boot):boot(window.claude?.hot?.data??{});

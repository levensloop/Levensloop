# Levensloop: projectcontext

Levensloop is een persoonlijke, Nederlandstalige BitLife-kloon van Thijmen. Eén HTML-bestand met inline CSS en JS, zonder framework en zonder server. Thijmen speelt het als offline app op zijn iPhone (PWA op GitHub Pages).

## Werkafspraken met Thijmen

- Antwoord altijd in het Nederlands, kort en in gewone taal. Thijmen is geen programmeur.
- Vaste werkwijze: Thijmen vraagt iets → jij schrijft een kort plan en stelt keuzevragen → Thijmen zegt "begin", "door" of "volgende" → jij voert uit → jij meldt per punt wat er veranderd is.
- Commit en push alleen als Thijmen erom vraagt. Online zetten = `deploy-app.sh`.
- Blijf van Levensloop v1 af (https://claude.ai/artifact/64NC1MwHRkii7p8YAjtP9e). Dat is een back-up.
- Ontwerp: indeling van v1 aanhouden, lichtblauw (`#2b9cf2` / `#1477c8`), luchtige BitLife-toon. Geen donkere modus.
- Bestaande levens op Thijmens iPhone mogen nooit stukgaan. Elke wijziging aan de opslag of aan de vorm van `S` krijgt een migratie die oude gegevens omzet.
- Thijmens e-mailadres is privé en gaat nooit naar externe diensten.

## Waar alles staat

| Wat | Waar |
|---|---|
| Live app | https://levensloop.github.io/Levensloop/ (hoofdletter L) |
| GitHub | `levensloop/Levensloop`, openbaar. Branch `main` = de gebouwde app (Pages vanaf de root, alleen via `deploy-app.sh`). Branch `bron` = deze broncode met tests en plannen. |
| Broncode | branch `bron` van `levensloop/Levensloop` (`git clone -b bron https://github.com/levensloop/levensloop`). Map `src/` is de enige bron; `index.html`, `pwa/index.html` en `pwa/sw.js` worden gebouwd en staan niet in git. |
| claude.ai-versie (v2) | https://claude.ai/artifact/Qo9ckapq8qJfpELC7tyW54. Thijmen speelt nu de iPhone-app; de artifact hoeft alleen bijgewerkt te worden als hij erom vraagt. |

## Bouwen, testen, online zetten

```bash
bash tests/run.sh                  # alles in één keer: bouwen, server, korte simulaties, migratietest; rood bij nieuwe JS-fouten
FULL=1 bash tests/run.sh           # volledige ronde (17 landen × 2 levens) voor het afsluiten van een fase
bash build.sh                      # maakt index.html (claude.ai-versie) en pwa/ (iPhone-app), draait node --check
cd pwa && python3 -m http.server 8765 &   # lokale testserver, nodig voor alle testscripts
cd tests/review
LIVES=2 PAR=4 MONKEY=0 OUT=passive.json node sim.js   # passieve speler: alleen ouder worden, willekeurige antwoorden
LIVES=2 PAR=4 MONKEY=1 OUT=monkey.json  node sim.js   # aap: klikt ook willekeurig door alle menu's
node stats.js passive.json monkey.json                # kerncijfers, vergelijk met tests/nulmeting/
bash deploy-app.sh                 # bouwt, kopieert pwa/ naar de GitHub-clone en pusht (alleen op verzoek)
```

- `sim.js` speelt hele levens via de echte knoppen (iPhone 13-viewport, tijd ×6 versneld). Omgevingsvariabelen: `WARP`, `LIVES` (per land), `PAR`, `MONKEY`, `CC` (landcodes), `OUT`. Het verzamelt JS-fouten, vastlopers, pop-uptitels, opslaggrootte en jaarcijfers.
- Overige scripts in `tests/review/`: `tour.js` en `tour2.js` (schermafbeeldingen van alle schermen, maak eerst een map `shots/`), `menus.js` (inventaris van menu's), `feat.js` (maandmodus, herladen, terugspoelen), `death.js`, `harvest.js` (teksten die je in het buitenland ziet), `perf.js` (snelheid en opslaglimiet), `logdump.js` (volledig logboek van één leven), `probe2.js`.
- `tests/auto.js` is de gedeelde autospeler (`window.AUTO`) die pop-ups en minigames afhandelt.
- `tests/nulmeting/` bevat de metingen van 11 november 2026 (vóór dit verbeterplan).
- `tests/fixtures/*.json`: ruwe `localStorage` van levens gemaakt met versie 20261105-2229 (kind, werkende van 40, gepensioneerde met huis en politiek, een afgesloten leven met erfgenaam, en `alles.json` met alles samen). `tests/review/migratie.js` laadt ze in de nieuwe versie en controleert dat elk leven opent, een jaar ouder kan worden en na herladen nog bestaat. Niet opnieuw maken: ze moeten oud blijven. `tests/review/fixtures.js` is het script waarmee ze gemaakt zijn.
- `tests/review/backup.test.js` (reservekopie: exporteren, wissen, importeren) en `perf.js` (snelheid; hoeveel levens van 60 jaar passen, doel 30) draaien in `run.sh` mee.
- `tests/review/regress.js`: per opgeloste fout een kleine controle in de echte app (`node regress.js 1.5` draait alleen de 1.5-tests). Voeg bij elke opgeloste fout een test toe.
- `build.sh` stopt bij dubbele gebeurtenis-ID's en bij `S.job.perf` zonder controle op `S.job`, en waarschuwt bij dubbele functienamen.
- `tests/bekende-fouten.txt`: JS-fouten die nog niet opgelost zijn en de test niet rood maken. Haal een regel weg zodra de fout is opgelost.
- `tests/review/check.js` telt de JS-fouten in de simulatie-uitvoer; uitvoer van `run.sh` staat in `tests/out/` (niet in git).
- `deploy-app.sh` verwacht een clone van branch `main` in `../levensloop-gh` (of zet `LEVENSLOOP_GH`); die maakt hij zelf aan als hij ontbreekt. Gebruik daarvoor nooit de map met de broncode (branch `bron`). Commit-attributie geef je mee via `COMMIT_TRAILER`.
- Playwright en Chromium zijn in de Claude-omgeving al geïnstalleerd. Niet opnieuw installeren.

## Opbouw van de code

`build.sh` plakt `src/head.html`, `src/theme.css`, `src/body.html` en alle JS-bestanden in vaste volgorde achter elkaar. Alles is globaal (ongeveer 800 functies), dus de volgorde in `build.sh` telt en namen mogen niet botsen.

Volgorde: data, events, engine, career, sectors, icons, avatar, house, choices, create, circle, fight, celeb, ui, store, backup, assets, finance, debt, family, minigames, crime2, health, leisure, acts, events2, prison, biz, social, realty, school, legacy, politics, polsys, prlite, politics2, politics3, pres, reg, mil, mil2, war, mil3, occ, eco, eco2, eco3, coup, coup2, diag, vangnet, boot. `boot.js` start het spel en moet altijd als laatste.

| Bestand | Inhoud |
|---|---|
| `data.js` | landen (`COUNTRIES`, 17 stuks), namen, banen, prestaties |
| `events.js`, `events2.js` | gebeurtenissen (ruim 390) |
| `engine.js` | toestand `S`, `advance()`, sterfte, belasting, momentopnames voor de tijdmachine |
| `ui.js` | schermen, pop-ups, `loadLife`, `boot`, doodscherm, startscherm |
| `store.js` | opslag v2: index `levensloop.v2`, per leven `levensloop.v2.l.<id>`, opnames `levensloop.v2.s.<id>` als verschillen (patches); `lsLoad`, `lsSave`, `saveLife`, migratie van `levensloop.v1`, melding bij volle opslag |
| `backup.js` | reservekopie: Menu → Reservekopie en de knop op het startscherm; exporteren (deelknop, download, tekst) en importeren (bestand, plakken) |
| `acts.js`, `leisure.js`, `health.js`, `assets.js`, `finance.js`, `house.js`, `realty.js` | activiteiten, casino, zorg, bezit, beleggen, wonen |
| `family.js`, `circle.js`, `legacy.js` | relaties, vrienden, erven en begrafenissen |
| `career.js`, `sectors.js`, `fight.js`, `celeb.js`, `social.js`, `biz.js` | werk, sport, roem, social media, eigen bedrijf |
| `school.js` | schoolsysteem, vakken, cijfers |
| `crime2.js`, `prison.js` | misdaad, gevangenis |
| `politics*.js`, `polsys.js`, `prlite.js`, `pres.js`, `reg.js` | politiek per land (parlementair, VS-systeem, presidenten, regio's, staatshoofd) |
| `mil*.js`, `war.js`, `occ.js` | leger, missies, oorlog, bezetting |
| `eco*.js` | economie, rente, staatsschuld, wereldnieuws |
| `coup.js`, `coup2.js` | staatsgreep en dictatuur |
| `debt.js` | rood staan (streng): 12% rente, jaarlijkse logregel, grens naar inkomen en bezit (`debtLimit`), gebeurtenis "Schuldeisers" (verkopen, lening, schuldsanering, negeren), faillissement, kredietregistratie (`bkr()`) |
| `vangnet.js` | vangt JS-fouten op: pop-up dicht, melding "Er ging iets mis. Je leven is bewaard.", laatste 20 fouten in `levensloop.errors`, te zien via Menu → Foutenlog. Ook fouten die `safe()` stil opvangt komen daarin. |
| `diag.js` | verborgen meetscherm (5× tikken op de versie onderaan het hoofdmenu): schermmaten, proefstanden A–E voor de indeling, hulplijnen. Stand bewaard onder `levensloop.layout`. |
| `src/pwa/` | iPhone-app: `meta.html`, `fix.css`, `pwa.js` (updatebalk), `sw.tpl.js` (service worker), manifest |

## Belangrijkste bouwstenen

- Toestand: `S` (huidig leven), `STORE` (alle levens, in het geheugen). Opslag: zie `store.js` (sinds fase 2; `levensloop.v1` wordt bij de eerste start omgezet). In het geheugen bevat `S.snaps` maximaal 11 jaaropnames `{m,ll,d}` voor de tijdmachine; niet-actieve levens bewaren er 3. De huizenmarkt (`flags.mk`) gaat niet mee in opnames.
- Gebeurtenissen: `E(id,{sys,need,c,w,cd,t,x,ch,f})`, politieke gebeurtenissen `PE(...)`, register `EV`, wachtrij `Q` met `processQ()`.
- Schermen: `modal`, `opts`, `result`, `doAct`, `openSheet`/`closeSheet`/`refreshSheet`, `row`, `sec`, `card`, `kv`, `amountModal`, `toast`.
- Spelwaarden: `hap`, `kar`, `sma`, `sk`, `cash`, `ageY()`, `year()`, `netWorth()`, `L(tekst,klasse)` voor het logboek, `use(k)` en `S.acts[...]` voor "één keer per jaar".
- Tijd: `advance()` → `onAge()`; dood via `die()` → `showDeath()` → `inherit()`.
- Politiek per land: `PSYS[cc]`, `psys()`, `isPres()`, `ptys()`, `natSeats()`.

## Valkuilen

- Geen `alert`, `confirm` of `prompt` gebruiken. Bevestigingen bouw je in het spel zelf.
- Sommige bestanden overschrijven functies uit eerdere bestanden (bijvoorbeeld `misRun` in `mil3.js` en wrappers om `EV.<id>.f`). Zoek op de functienaam in alle bestanden voordat je iets aanpast.
- Veel regels zijn erg lang (ruim 1000 regels boven de 300 tekens). Zoek met `grep -o` en een stuk context in plaats van hele regels te lezen.
- Bedragen worden als kommagetal bewaard. Rond af bij optellen.
- Gebeurtenissen in de wachtrij worden bij het tonen opnieuw gecontroleerd (`e.c`); een gebeurtenis die niet meer klopt (bijv. werk na ontslag) wordt overgeslagen.
- Wie alleen van een uitkering leeft, krijgt lager levensonderhoud (wat er na de huur overblijft, minstens 60%), en de uitkering dekt huur tot 16.000 × prijspeil. Zonder dat zakte een passieve speler elk jaar dieper in het rood.
- `build.sh` maakt ook `pwa/test.html`: dezelfde app met statusbalk `black-translucent`, naam "LL test" en een eigen opslagsleutel (`levensloop.test.v1`), zodat Thijmen die los op zijn beginscherm kan zetten zonder zijn echte levens te raken.
- De service worker cachet de app. Na een deploy ziet Thijmen een balk "Nieuwe versie · tik om bij te werken".

- Het energiesysteem is in fase 2 verwijderd (Thijmens keuze).
- Na openen toont de app meteen het laatst gespeelde leven; het startscherm zit in Menu → Startscherm.

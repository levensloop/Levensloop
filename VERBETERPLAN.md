# Levensloop: verbeterplan

Opgesteld op 11 november 2026 na een volledige controle van de offline iPhone-app (versie 20261105-2229, gelijk aan de broncode in dit pakket).

Dit plan is bedoeld om door Claude in een nieuwe chat te worden uitgevoerd. Lees eerst `CLAUDE.md` (context, bouwen, testen, werkafspraken) en daarna dit bestand.

## Voortgang

| Fase | Stand |
|---|---|
| 0 Veiligstellen | Klaar (11 nov 2026). Bron op branch `bron`, fixtures in `tests/fixtures/`, testcommando `bash tests/run.sh`. |
| 1 Fouten | Klaar (12 nov 2026). Alle 13 punten; regressietests in `tests/review/regress.js`. Rood staan: streng (`src/debt.js`). Uitkering dekt nu de kosten (anders zakte een passieve speler elk jaar dieper in het rood). |
| 2.1 Balk onderin | Klaar (11 nov 2026). Thijmen koos stand B (`100vh`, geen `position:fixed`), vast in `src/pwa/fix.css`. Meetscherm blijft (5× tikken op de versie). |

## Hoe je dit plan uitvoert

1. Werk fase voor fase, in de volgorde hieronder. Fase 0 is verplicht en komt eerst.
2. Begin elke fase met een kort plan voor Thijmen en stel alleen vragen waar in dit document "Keuze voor Thijmen" staat. Wacht op "begin".
3. Reproduceer een fout eerst (met `tests/review/sim.js` of een klein Playwright-script) en los hem dan op. Voeg voor elke opgeloste fout een controle toe aan `tests/` zodat hij niet terugkomt.
4. Sluit elke fase af met: `bash build.sh`, een passieve en een aap-simulatie (minstens 2 levens per land, alle 17 landen), `node stats.js` naast de nulmeting, en een verslag per punt in het Nederlands.
5. Zet pas iets online als Thijmen erom vraagt. Lever aan het eind van elke fase een nieuwe zip van de broncode aan Thijmen, zolang de bron niet op GitHub staat.
6. Verander niets aan bestaande opslag zonder migratie. Test elke opslagwijziging met een bewaard leven uit de oude versie (maak er in fase 0 een paar aan en bewaar de ruwe `localStorage`-inhoud in `tests/fixtures/`).

Wat "bevestigd", "gemeten" en "vermoeden" betekenen: bevestigd = in de code of in een test gezien; gemeten = cijfer uit de simulaties in `tests/nulmeting/`; vermoeden = nog niet aangetoond, eerst onderzoeken.

## Nulmeting (11 november 2026)

| Meting | Passieve speler (34 levens) | Aap (29 levens) |
|---|---|---|
| Sterfleeftijd, mediaan | 66 | 67 |
| Overleden vóór 60 | 13 van 34 | 4 van 29 |
| Gezondheid op 40 / 55 / 65 (mediaan) | 67 / 45 / 19 | 69 / 52 / 36 |
| Geluk op 40 / 55 / 65 (mediaan) | 49 / 37 / 25 | 59 / 49 / 45 |
| Pop-ups per jaar | 4,7 | 5,8 |
| JS-fouten | 0 | 3 (2 verschillende) |
| Meldingen "Maximaal -€ …" bij inzet | 0 | 46 |
| Time-outs van de autospeler | 0 | 9 (geen bevestigde echte vastloper) |

Meest herhaalde pop-ups per leven (passief): Verkiezingen 9,5 · Uitslagavond 9,5 · Afscheid 8,7 · Wereldnieuws 8,2 · Griep 7,6 · Gevonden portemonnee 6,0 · Geluk? 5,5 · Je rapport 5,2 · Op straat 4,9 · Stemmen voor president 4,9 · Vrijwilligers gezocht 4,7 · Nieuwe buren 4,6 · Tv-quiz 4,5. Bij werkenden komt Functioneringsgesprek op 16 per leven.

Opslag: een leven van 60 jaar is 450 tot 750 KB, waarvan ongeveer 80% tijdmachine-opnames. De limiet van `localStorage` (ongeveer 5 MB) is bereikt bij 8 tot 10 lopende levens.

Snelheid is in orde (met 3× vertraagde processor: laden 0,6 s, ouder worden 0,12 s). Daar hoeft niets aan te gebeuren.

---

## Fase 0: veiligstellen en opzetten

Doel: de broncode kan niet meer verloren gaan en de tests draaien.

- **0.1 Bouw controleren.** `bash build.sh` moet zonder fouten draaien. Start de testserver, draai één passief leven in NL en kijk of `stats.js` cijfers geeft.
- **0.2 Broncode op GitHub.** Keuze voor Thijmen: de bron in een aparte branch `bron` van `levensloop/Levensloop` zetten (aanbevolen; `main` blijft de gebouwde app) of bij zips blijven. De repo is openbaar; de gebouwde app is dat nu ook al en is niet verkleind, dus er komt niets nieuws op straat.
- **0.3 Testgegevens bewaren.** Maak met de huidige versie drie levens (kind, werkende van 40, gepensioneerde met bezit en politiek) en bewaar de ruwe opslag als `tests/fixtures/*.json`. Schrijf `tests/review/migratie.js` dat zo'n bestand in `localStorage` zet, de nieuwe versie laadt en controleert dat elk leven opent en een jaar ouder kan worden zonder fout.
- **0.4 Eén testcommando.** Maak `tests/run.sh` dat bouwt, de server start, een korte passieve en aap-simulatie draait, `migratie.js` draait en eindigt met een foutcode als er JS-fouten zijn.

Klaar als: `bash tests/run.sh` groen is op de ongewijzigde code, op de drie bekende fouten uit fase 1 na.

---

## Fase 1: fouten en vastlopers

| Nr | Probleem | Waar | Aanpak | Klaar als |
|---|---|---|---|---|
| 1.1 | **Crash bij zorgkosten onder de 18 in Nederland** (bevestigd): `Cannot read properties of undefined (reading 'used')`. `medCost` stopt bij `ageY()<18` voordat `S.er` is aangemaakt, `payMed` telt er daarna bij op. | `health.js` regel 19–20 | In `payMed` `S.er` aanmaken als het ontbreekt of niet van dit jaar is; alleen optellen als `c>0`. | Aap-simulatie NL met kinderen geeft deze fout niet meer. |
| 1.2 | **Crash in het schoolscherm** (bevestigd): `subs is not iterable` als het schoolscherm opnieuw getekend wordt nadat je van school bent. | `school.js`: `subjList`, `sheetSchool` | `subjList` geeft altijd een lijst terug; `sheetSchool` sluit of toont "Je zit niet meer op school" als er geen fase is. | Test: schoolscherm open, school eindigt, `refreshSheet()` geeft geen fout. |
| 1.3 | **Crash na werk-minigame zonder baan** (bevestigd): `Cannot read properties of null (reading 'perf')`. | `events2.js` regel 104–111 (en regel 38) | Elke `S.job.perf` in gebeurtenisresultaten afschermen met `if(S.job)`. Doorzoek alle bestanden op `S.job.` in callbacks die na een pop-up lopen. | Geen fout in 60 aap-levens. |
| 1.4 | **Inzet met negatief saldo** (gemeten, 46×): het bedragvenster toont "Maximaal -€ 50.475" en de rij is niet uitgeschakeld. | `amountModal` in `ui.js`, aanroepen in `leisure.js` (casino, poker, wedden) | Maximum nooit onder 0; rijen die geld kosten uitschakelen met de reden "Je staat rood". | `neg`-teller in `sim.js` is 0. |
| 1.5 | **Rood staan heeft geen gevolgen** (bevestigd): saldo kan onbeperkt negatief worden (tot −€ 8 miljoen gezien), zonder rente, melding of grens. | `cash()` in `engine.js`, jaarafrekening in `onAge()` | Roodstandsysteem: rente op negatief saldo, logregel per jaar, limiet afhankelijk van inkomen; daarboven een gebeurtenis "Schuldeisers" met keuzes (bezit verkopen, lening, schuldsanering met gevolgen voor geluk en krediet). Keuze voor Thijmen: streng (faillissement mogelijk) of mild (alleen rente en waarschuwing). | Passief leven eindigt nooit onder de gekozen limiet zonder dat het logboek het uitlegt. |
| 1.6 | "Regionale verkiezingen in ?" tot de eerste regionale ronde is berekend. | `reg.js` regel 98, `W.nextRG` | `W.nextRG` vullen bij het starten of migreren van een leven. | Tekst toont altijd een jaartal. |
| 1.7 | Dubbele logregels: de uitkomst van wereldnieuws staat er als grijze nieuwsregel en als zwarte resultaatregel. | `war.js`, `eco*.js` | Eén regel per gebeurtenis. | `logdump.js` toont geen opeenvolgende regels met dezelfde inhoud. |
| 1.8 | Hoofdletters: "Kandidaat eerste kamerlid", "staat De overvaller er beter voor". | `politics*.js`, `fight.js` | Functienamen met hoofdletter opslaan en alleen midden in een zin verkleinen; lidwoord meenemen in `lc1`-achtige hulpfunctie. | Zoek in `harvest.json`-achtige dump op deze patronen: 0 treffers. |
| 1.9 | Doodsverhaal noemt het diploma twee keer; "ouderdom" als doodsoorzaak op 62. | `showDeath` in `ui.js`, `deathCause` in `engine.js` regel 174 | Diplomazin ontdubbelen; "ouderdom" pas vanaf ongeveer 85, daaronder een concrete oorzaak. | `death.js` op 20 levens: geen dubbele zin, geen ouderdom onder 85. |
| 1.10 | Beroepsscherm is leeg van 0 tot 4 jaar. | `sheetJob` in `ui.js` regel 149 | Korte tekst met wat er later komt ("Vanaf 4 jaar ga je naar school"). | Schermafbeelding op leeftijd 2. |
| 1.11 | Na terugspoelen blijft het tijdmachinescherm open. | `rewind` in `engine.js` regel 102, aanroep in `ui.js` / `acts.js` | Scherm sluiten en logboek tonen. | `feat.js` controleert dat `#sheet` dicht is. |
| 1.12 | Dubbele gebeurtenis-ID's in `events.js` en `events2.js` (ouderruzie, scheiding, verliefd, feestje, spieken, spijbelen, onlinedrama, overwerk, collegaflirt, tip): de tweede overschrijft de eerste. | `events.js`, `events2.js` | Per paar beslissen: samenvoegen of de tweede een eigen ID geven zodat beide varianten voorkomen. Laat `E()` tijdens het bouwen waarschuwen bij een dubbel ID. | Bouwcontrole meldt 0 dubbele ID's. |
| 1.13 | Geen vangnet bij fouten: een crash in een keuze laat de pop-up hangen. | nieuw, in `ui.js` | Globale `error`- en `unhandledrejection`-afhandeling: pop-up sluiten, melding "Er ging iets mis. Je leven is bewaard.", fout met tijd en versie in een lijstje van de laatste 20 bewaren. Menu → "Foutenlog" toont die lijst, zodat Thijmen er een schermafbeelding van kan sturen. | Test: gooi bewust een fout in een keuze; het spel blijft bedienbaar en de fout staat in het log. |

---

## Fase 2: iPhone-app

### 2.1 Ongebruikte balk onderin (hoogste prioriteit, nog open)

Bevestigd met schermafbeeldingen van Thijmen, ook na opnieuw installeren: onder de tabbalk blijft een lege strook van ongeveer 59 punten, zo hoog als de statusbalk. Drie eerdere pogingen hielpen niet (padding weghalen; hoogte meten met JS, dat sneed inhoud af; statusbalk op `default`).

Huidige stand in `src/pwa/`: `viewport-fit=cover`, statusbalkstijl `default`, en in `fix.css`: `html{height:100%;overflow:hidden}`, `body{position:fixed;top:0;left:0;right:0;bottom:0}`, `#app{height:100%;padding-top:env(safe-area-inset-top)}`.

Vermoeden: in de zelfstandige modus van iOS is de hoogte die `100%` en `position:fixed` opleveren één statusbalk korter dan het scherm. Niet meer gokken, eerst meten:

1. **Meetscherm.** Bouw een verborgen diagnose: vijf keer tikken op het versienummer in het menu toont een laag met `innerHeight`, `documentElement.clientHeight`, `screen.height`, `visualViewport.height` en `.offsetTop`, de vier `env(safe-area-inset-*)`-waarden (uitlezen via een proefelement), `100vh`, `100dvh`, `100lvh` in pixels, `navigator.standalone` en de hoogte en positie van `#app` en de tabbalk. Met een knop "Kopieer".
2. **Proefstanden.** In hetzelfde meetscherm knoppen waarmee Thijmen ter plekke tussen vier indelingen wisselt, zonder nieuwe versie:
   - A: huidige indeling.
   - B: `html,body{height:100vh}` in plaats van `100%`, geen `position:fixed`.
   - C: `black-translucent` + `html{min-height:calc(100% + env(safe-area-inset-top))}` met `#app` op die hoogte en `padding-top:env(safe-area-inset-top)`. (De statusbalkstijl zelf staat vast per installatie; lever hiervoor zo nodig een aparte testpagina `test.html` mee die Thijmen los aan zijn beginscherm toevoegt.)
   - D: `#app{position:fixed;top:0;left:0;right:0;height:100dvh}`.
3. Thijmen stuurt een schermafbeelding van de cijfers en zegt welke stand goed is. Maak die stand definitief en haal de andere weg. Het meetscherm mag blijven.

Klaar als: op Thijmens iPhone loopt de tabbalk door tot aan de onderkant, met alleen de ruimte voor de thuisbalk eronder, en bovenin valt niets achter de statusbalk. Controleer ook het doodscherm (witte strook onder de grafsteen) en het startscherm.

### 2.2 Opslag

- **2.2.1 Stil gegevensverlies** (bevestigd). `lsSave` in `ui.js` vangt een volle opslag op door eerst de tijdmachine-opnames van andere levens weg te gooien en daarna stil te falen. De speler merkt niets tot een leven weg is.
- **Aanpak.**
  - Opslag splitsen: een kleine index (`levensloop.v2.index`), per leven een eigen sleutel, en de opnames per leven in een aparte sleutel. Opnames als object bewaren, niet als JSON-tekst binnen JSON (scheelt de dubbele aanhalingstekens).
  - Opnames kleiner maken: het logboek zit er al niet in; haal er ook grote, onveranderlijke stukken uit of bewaar per opname alleen het verschil met de vorige. Doel: een leven van 60 jaar onder 250 KB inclusief opnames.
  - Niet-actieve levens houden hooguit de 3 nieuwste opnames.
  - Als opslaan toch mislukt: duidelijke melding met de keuze om oude levens of opnames op te ruimen. Nooit stil falen.
  - `navigator.storage.persist()` aanvragen zodat iOS de gegevens minder snel opruimt.
  - Migratie van `levensloop.v1` naar de nieuwe indeling bij de eerste start; de oude sleutel pas weghalen als de nieuwe goed teruggelezen is.
- Klaar als: `perf.js` 30 lopende levens van 60 jaar kwijt kan; `migratie.js` slaagt op alle fixtures; een volle opslag geeft een zichtbare melding.

### 2.3 Reservekopie

Wie het app-icoon verwijdert, is nu alle levens kwijt (Thijmen heeft de app al eens opnieuw geïnstalleerd). Menu → "Reservekopie": exporteren naar een bestand (via de deelknop van iOS, `navigator.share` met een bestand, met een blob-link en "kopieer als tekst" als terugval) en importeren via een bestandskiezer of plakken. Importeren voegt levens toe en overschrijft niets zonder te vragen.

Klaar als: exporteren, app-gegevens wissen, importeren levert dezelfde levens op (test met Playwright; de deelknop zelf test Thijmen op zijn iPhone).

### 2.4 Kleinere punten

- **Verdergaan waar je was.** Na openen meteen het laatst gespeelde leven tonen (`STORE.last` bestaat al) in plaats van het startscherm. Het startscherm blijft bereikbaar via het menu.
- **Lettertypes.** `head.html` laadt vier lettertypes van Google. Op iOS worden Baloo 2 en Nunito nooit gebruikt (systeemlettertypes staan vooraan). Anton en Pacifico worden op een paar plekken gebruikt. Lever die twee mee als ingebed woff2 en haal de Google-koppeling uit de iPhone-versie, zodat de app ook bij de allereerste start zonder internet klopt.
- **Trillen.** `haptic()` gebruikt `navigator.vibrate`, dat op iOS niets doet. Weghalen of vervangen door een korte visuele terugkoppeling (knop veert in). Geen trucs met verborgen schakelaars.
- **Opstartbeeld.** `apple-touch-startup-image` toevoegen voor de gangbare iPhone-formaten, of in elk geval de achtergrondkleur gelijk aan het eerste scherm zodat er geen flits is.
- **Dode code.** Het energiesysteem staat uit (`hasE` en `spendE` geven altijd `true`). Weghalen, of zie fase 8.

---

## Fase 3: balans en realisme

Doel: wie alleen op "ouder worden" tikt, leeft een gewoon leven. Nu sterft die speler op 66 (mediaan), 13 van de 34 vóór hun zestigste, met gezondheid 19 en geluk 25 op 65.

| Nr | Wat | Waar | Richting | Doel (passieve simulatie, minstens 60 levens) |
|---|---|---|---|---|
| 3.1 | Gezondheid zakt te snel | jaarlijkse afname in `onAge()` (`ui.js`), ziektes in `health.js`, `events.js` | Afname na 40 afvlakken; gebeurtenissen die gezondheid kosten minder zwaar of zeldzamer; huisartsbezoek en sporten blijven lonen. | Mediaan op 55 ≥ 60, op 65 ≥ 45 |
| 3.2 | Sterfte | `mortality` en `deathCause` in `engine.js` | Basiskansen staan redelijk; het probleem is de vermenigvuldiger bij lage gezondheid in combinatie met 3.1. Na 3.1 opnieuw meten en dan pas de tabel bijstellen. | Mediaan sterfleeftijd 78–84, hooguit 10% vóór 60 |
| 3.3 | Geluk zakt weg | geluksverlies bij begrafenissen (`legacy.js`), jaarlijkse drift | Verlies per sterfgeval van verre familie beperken; langzaam herstel richting een basisniveau. | Mediaan op 65 ≥ 45 |
| 3.4 | Gebeurtenissen voor de verkeerde mensen | `fight.js` (Dopingcontrole 3,5× per leven, ook bij amateurs), `events.js`/`social.js` (Viraal! 3,7×), `celeb.js` (Herkend! 2,9×), `events.js` (Tv-quiz 4,5×) | Voorwaarden toevoegen: doping alleen bij profs, Herkend! pas vanaf een roemgrens, Viraal! alleen met een account, Tv-quiz met langere afkoeltijd. | Elk hooguit 1× per leven bij een speler zonder sport, roem of social media |
| 3.5 | Sportseizoen is bijna altijd "teleurstellend" | `career.js` | Uitkomst spreiden op basis van vaardigheid; ook middelmatige en goede seizoenen. | Verdeling ongeveer 30/40/30 bij gemiddelde vaardigheid |
| 3.6 | Staatsschuld en rentenieuws | `eco.js`, `eco2.js`, `eco3.js` (`S.eco.debt`) | Gemeten in 6 levens: de staatsschuld loopt alleen maar op (NL van 36–54% naar 100–130%, VS van 24% naar het plafond van 260%) en de startwaarden kloppen niet per land (Japan begint op 41%). Geef elk land een realistische startwaarde en laat de begroting reageren zodat de schuld rond dat niveau schommelt als de speler zelf niet regeert. Rente komt in ongeveer 3 van de 4 jaren in het logboek: alleen melden bij een echte verandering. De inkomstenbelasting is nagerekend en klopt (28% op € 50.000 in NL); daar niets aan doen. | Schuld blijft in een leven zonder eigen politiek binnen ±25 procentpunt van de startwaarde; rentenieuws hooguit 1× per 3 jaar |

---

## Fase 4: minder herhaling, rustiger logboek

Doel: van 4,7 naar hooguit 3 pop-ups per jaar voor de passieve speler, en geen titel vaker dan 3 keer per leven tenzij hieronder anders staat.

- **4.1 Verkiezingen voor gewone burgers.** Nu twee pop-ups per verkiezing (stemmen en uitslagavond) plus presidentsverkiezingen: samen ruim 24 per leven. Maak er één pop-up van met de uitslag in het resultaat, en geef in Menu → Instellingen de keuze "Stemmen: elke keer vragen / altijd dezelfde partij / niet stemmen". Bij de laatste twee komt alleen een logregel. Politici houden de volledige avond. (`politics.js`, `prlite.js`, `pres.js`, `reg.js`)
- **4.2 Begrafenissen.** "Afscheid" 8,7× per leven. Pop-up alleen voor partner, ouders, kinderen, broers, zussen en goede vrienden; ooms, tantes, neven en nichten krijgen een logregel. (`legacy.js`)
- **4.3 Wereldnieuws.** 8,2× per leven. Alleen als pop-up wanneer het de speler raakt (eigen land, dienstplicht, beleggingen); de rest als nieuwsregel. (`war.js`)
- **4.4 Vaste herhalers.** Griep, Gevonden portemonnee, Geluk?, Op straat, Vrijwilligers gezocht, Nieuwe buren, Feest bij de buren, Gevallen: afkoeltijd (`cd`) verhogen en per gebeurtenis 2 tot 3 tekstvarianten toevoegen zodat een herhaling anders leest.
- **4.5 Werk en school.** Functioneringsgesprek 16× per leven: eens per 3 jaar als pop-up, anders een logregel met de beoordeling. "Je rapport" alleen bij een opvallende verandering.
- **4.6 Nieuwe gebeurtenissen.** Wat door 4.1 tot 4.5 wegvalt, deels aanvullen met nieuwe, leeftijdsgebonden gebeurtenissen voor 30 tot 60 jaar en 60-plus (daar is het aanbod het dunst). Richtlijn: 40 nieuwe gebeurtenissen in de bestaande toon.
- **4.7 Logboek.**
  - Geen economie- en verkiezingsnieuws onder de 12 jaar.
  - Resultaatregels krijgen context: niet "Geluk: Je wast drie keer." maar de keuze erbij, zodat de regel los te begrijpen is. Pas `result()`/`L()` zo aan dat titel en keuze samen één leesbare zin vormen.
  - Nieuwsregels zijn klein en grijs en daardoor slecht leesbaar; iets groter en donkerder, of inklapbaar per jaar ("3 nieuwsberichten").

Klaar als: `stats.js` op de passieve simulatie ≤ 3,0 pop-ups per jaar geeft, geen titel boven 3× per leven behalve Verkiezingen (met de standaardinstelling), en het aantal verschillende titels niet daalt.

---

## Fase 5: gebruiksgemak en uiterlijk

- **5.1 Relaties.** Partner ("Liefde") staat onder ooms, tantes, neven en nichten. Volgorde: partner, kinderen, ouders, broers en zussen, vrienden, huisdieren, overige familie (ingeklapt). (`sheetRel` in `family.js`)
- **5.2 Activiteiten.** De standaard-Favorieten herhalen de eerste rijen; toon Favorieten alleen als de speler ze zelf heeft gekozen. De grote knop "Opgeven…" onderaan verhuist naar Menu. (`acts.js`)
- **5.3 Dubbele ingangen.** Tijdmachine staat op drie plekken, Winkelen, Financiën en Social media zowel onder Activiteiten als onder Bezit. Eén vaste plek per onderdeel: Tijdmachine in Menu; Winkelen en Financiën onder Bezit; Social media onder Activiteiten.
- **5.4 Afgekapte teksten.** Naam in de kop ("Thijmen de …") en schermtitels ("WERELD EN ECONO…"): lettergrootte laten meeschalen of korter formuleren; nooit afkappen op iPhone-breedte (375 tot 430 punten).
- **5.5 Startscherm.** Nu kaal. Toon het laatst gespeelde leven als grote kaart ("Verder met …"), daaronder lopende levens, begraafplaats en nieuw leven.
- **5.6 Eerste keer.** Korte uitleg in drie tikken bij het eerste leven (ouder worden, de vier tabbladen, het menu). Eén keer, overslaan mogelijk.
- **5.7 Doodscherm.** Witte strook onder de grafsteen wegwerken; achtergrond doorlopen tot de onderkant.
- **5.8 Details.** Partij-emoji's consequent (elke partij één vaste), bedragen overal via `fmt()`.

Controle: `tour.js` en `tour2.js` opnieuw draaien en de schermen op 375 en 430 breed nalopen; Thijmen krijgt vóór en na van de gewijzigde schermen.

---

## Fase 6: buitenland

Bevestigd met `harvest.js` in Japan, Brazilië, de VS en Turkije: het spel voelt daar als Nederland met een andere vlag.

| Onderdeel | Nu overal | Waar | Aanpak |
|---|---|---|---|
| School | eindtoets, vmbo/havo/vwo, vak "Nederlands", "Mbo, hbo of universiteit", quizvragen over Nederland, Rotterdam en de provincies | `school.js`, `engine.js`, `data.js`, `ui.js` | Per land een schoolprofiel: namen van de fasen, eindexamen, niveaus, de landstaal als vak. Quizvragen een label geven (`nl` of algemeen) en per land een eigen set van minstens 15 vragen. |
| Wetten en zorg | AOW-leeftijd, eigen risico, "kabinet" | `politics*.js`, `health.js`, `events.js` | Neutrale termen buiten NL (pensioenleeftijd, eigen bijdrage, regering); eigen risico alleen in NL. |
| Uitgaan | Pinkpop, Lowlands, Mysteryland, Ziggo Dome | `acts.js`, `leisure.js` | Per land 3 festivals en 1 grote zaal, met een algemene terugval. |
| Wedden | Feyenoord, Ajax, PSV, FC Utrecht | `leisure.js` | Per land 4 clubs in de populairste sport. |
| Beleggen | ASML, Shell, Heineken, Philips, Adyen, Ahold | `finance.js` | Per land 4 tot 6 bekende bedrijven, of één internationale lijst. |
| Leger | Koninklijke Landmacht, Marine, Luchtmacht, Marechaussee | `mil.js` | Per land de eigen namen; "Koninklijk" alleen in monarchieën. |
| Teksten | "een euro" in Japan, bedrijfsnamen als "Hollandia B.V." | `events*.js`, `data.js` | Munt altijd via `fmt()` of een muntwoord per land; bedrijfsnamen en rechtsvorm per land. |

Technisch: één tabel `LOC[cc]` in een nieuw bestand `loc.js` (direct na `data.js`) met een hulpfunctie `loc(sleutel)` die terugvalt op een algemene internationale variant. Nederland houdt exact de huidige teksten.

Volgorde: eerst de landen die Thijmen het meest speelt. Keuze voor Thijmen: welke 5 landen eerst.

Klaar als: `harvest.js` in elk aangepakt land 0 treffers geeft op de lijst Nederlandse termen (die lijst staat in het script; vul hem aan met alles uit deze tabel).

---

## Fase 7: code en onderhoud

- **7.1** Bouwcontrole uitbreiden in `build.sh`: dubbele gebeurtenis-ID's, dubbele functienamen (nu: `sheetTree` in `family.js` en `ui.js`), en `node --check`.
- **7.2** Ongebruikte functies weghalen: `startBiz`, `usOffLbl`, `reVal`, `foldSec`, `sheetInv`, `carPopup`, `itemPopup`, `sheetShop`. Eerst met `grep` bevestigen dat ze nergens worden aangeroepen, ook niet via een tekst in een `onclick`.
- **7.3** Geld als heel getal: afronden in `cash()` en bij het laden van een leven.
- **7.4** Overschrijvingen opruimen waar het weinig risico geeft: `misRun` uit `mil3.js` samenvoegen met het origineel in `mil*.js`, wrappers om `EV.<id>.f` vervangen door één definitie. Niet in één keer alles; per bestand, met een simulatie ertussen.
- **7.5** Lange regels (ruim 1000 boven 300 tekens, de langste 5654) opdelen bij bestanden die je toch aanraakt. Geen grote herindeling om de herindeling.
- **7.6** `README.md` voor Thijmen in gewone taal: hoe hij een nieuwe chat op weg helpt (zip of repo geven, "lees CLAUDE.md").

---

## Fase 8: nieuwe onderdelen (keuze voor Thijmen)

Niet uitvoeren zonder dat Thijmen kiest. Leg deze lijst voor en vraag welke hij wil en in welke volgorde.

Wat BitLife heeft en Levensloop nog niet:

1. Koningshuis en adel (geboren worden als prins of prinses, troonopvolging, schandalen).
2. Bijzondere loopbanen: astronaut, geheim agent, sekteleider, straathandel.
3. Schoolleven als systeem: populariteit, clubs, kliekjes, schoolfeest.
4. Identiteit: geaardheid en genderidentiteit (nu alleen naamswijziging).
5. Uitdagingen: levens met een opdracht ("word miljonair vóór je dertigste") met een eigen beloning.
6. Erfstukken en verzamelingen die van generatie op generatie gaan.
7. Spookhuizen en exotische huisdieren.
8. Personage-editor en "God-modus" (eigenschappen van anderen aanpassen).
9. Geluid en echte trilling zijn op een iPhone-webapp nauwelijks haalbaar; alleen korte geluidjes na een tik zijn mogelijk.

Nog open uit eerdere plannen:

- Politiek fase 4: wetten per land, prestaties voor wereldleiders, regels voor emigreren als politicus.
- Oude lijst: prestaties en opgeslagen levens overzichtelijker, profiel- en menuscherm.
- Energiesysteem: weer aanzetten als rem op onbeperkt herhalen van acties, of definitief verwijderen (zie 2.4).

Per gekozen onderdeel: eigen kort plan, keuzevragen, dan bouwen volgens de vaste werkwijze.

---

## Volgorde en omvang

| Fase | Omvang | Waarom deze plek |
|---|---|---|
| 0 Veiligstellen | klein | Zonder dit kan al het werk verloren gaan |
| 1 Fouten | middel | Crashes en geld dat niet klopt |
| 2 iPhone-app | middel tot groot | De balk onderin stoort bij elk gebruik; opslag kan levens kosten |
| 3 Balans | middel | Bepaalt of een gewoon leven leuk is |
| 4 Herhaling | middel | Grootste winst in speelplezier per uur werk |
| 5 Gebruiksgemak | klein tot middel | Afwerking |
| 6 Buitenland | groot | Veel tekstwerk, per land op te delen |
| 7 Code | klein, doorlopend | Meenemen bij bestanden die je toch aanraakt |
| 8 Nieuw | per onderdeel | Pas na de basis |

Fase 2.1 (balk onderin) kan los en direct na fase 0, omdat Thijmen daarvoor zelf op zijn iPhone moet meten en dat even kan duren.

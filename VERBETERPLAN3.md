# Levensloop: verbeterplan deel 3

Opgesteld op 18 november 2026, na fase 17 (namen en uiterlijk, automatisch stemmen, echte doodsoorzaken).
Werkwijze zoals in `VERBETERPLAN.md` en `VERBETERPLAN2.md`: per fase een kort plan, een test per oplossing, migratie bij elke wijziging aan `S`, bestaande levens mogen nooit kapotgaan, pop-ups blijven rond 2 schermen per jaar.

## Wat Thijmen koos (18 nov 2026, avond)

- Onderdelen: realisme-check, liefde en daten, wonen, minigames, huisdieren, eigen bedrijf.
- Volgorde: **grootste impact eerst**.
- Werkwijze: alles doorbouwen en testen. **Sinds 18 nov 21:57: elke fase online zodra die klaar en getest is** (Thijmen: "fase voor fase online").
- Realisme-check: duidelijke fouten meteen repareren, **twijfelgevallen eerst aan Thijmen vragen** (verzamelen en in één keer vragen).
- Liefde: datingapp, relatiefases (met **ring kopen** en alles rond verloven en trouwen), ruzie en uit elkaar. Je partner mag zelf initiatief nemen (aanzoek, vreemdgaan, het uitmaken), net als in het echt. Geen "dates als moment".
- Wonen: inrichten en verbouwen, buren als personen, verhuizen naar een andere stad (**steden dichtbij: op en neer reizen of thuiswerken**), studentenhuis.
- Minigames: rijexamen, sollicitatiegesprek, sportwedstrijd, examens per vak. **In het hoofdmenu aan en uit te zetten.**
- Huisdieren: verzorging, karakter en trucjes, meer soorten, jongen en afscheid.
- Eigen bedrijf: personeel als personen, concurrenten en crises, nieuwe producten, rechtszaken en overnames.
- Tussendoor: bezittingen in categorieën die je openklapt (geen lange lijst).

## Fases

| Fase | Inhoud |
|---|---|
| 18 Realisme-check | Het hele spel doorlopen op dingen die niet kloppen bij leeftijd, geld, geslacht, land, gevangenis, dood of buitenland (zoals de peuter-uitnodiging en vwo met een 1). Automatische speurtocht door alle gebeurtenissen, acties en berichten op elke leeftijd, plus teksten die iets noemen wat er niet is (je baas zonder baan, je auto zonder auto). |
| 19 Liefde en daten | Datingapp (profielen met gezicht, leeftijd, baan, hobby's; vegen; matches; berichtjes). Relatiefases: verkering, samenwonen, verloven (ring kopen bij de juwelier, aanzoek met plek en kans op nee), bruiloft plannen (locatie, gasten, kleding, ringen, huwelijksreis). Partner met eigen initiatief. Ruzies, vreemdgaan, relatietherapie, scheiding met huis verdelen, alimentatie en voogdij. |
| 20 Wonen | Inrichten en verbouwen (waarde en geluk), buren met naam en karakter, verhuizen naar een andere stad met afstand (forenzen of thuiswerken), studentenhuis met huisgenoten. |
| 21 Minigames | Instelling aan/uit in het menu. Rijexamen, sollicitatiegesprek, sport (penalty's, tennis, sprint, darts), examens per vak en niveau. |
| 22 Huisdieren | Verzorging, karakter, trucjes en shows, meer soorten, jongen, ouder worden en afscheid. |
| 23 Eigen bedrijf | Personeel als personen, concurrenten en crises, producten lanceren, rechtszaken en overnamebiedingen. |

## Voortgang

| Fase | Stand |
|---|---|
| Tussendoor | Bezittingen in categorieën: klaar (`ownGroups`, `sheetOwnCat` in assets.js; één ding in een categorie opent meteen). |
| 18 Realisme-check | Klaar. Speurtochten `tests/review/real18.js` (alle willekeurige gebeurtenissen × 15 levenssituaties), `real18b.js` (activiteiten per leeftijd), `real18c.js` (hele levens, logregels tegen de toestand), `real18d.js` (leeftijden van iedereen om je heen). Gerepareerd: fiets, bijen en tijdreiziger kosten een kind niets; geen collega's of partner die er niet zijn (marathon, verjaardag, midlifecrisis); overleden oma bij het debutantenbal; bruiloft zonder persoon. Keuzes Thijmen: ouders betalen tot 12 bij gewone activiteiten (`real18.js`: wrappers om `openSheet` en `doAct`), ouders beslissen over een huisdier (`petYes`), clubs vanaf 18. Eerder (fase 17): peuter-uitnodiging, vwo-advies. |
| 19 Liefde en daten | Gebouwd: `love19.js`. Datingapp (`S.dapp`: 12 swipes per jaar, Premium 30, superlike, matches met berichtjes en afspreken via `dateGame`; onder 18 de oude manier), ring kopen (`S.ring`, `RINGS`) en aanzoek met plek (`PLACE19`), partner doet zelf een aanzoek (`l19_aanzoek`), bruiloft plannen in vijf stappen (`weddingPlan`, `p.wed`), ruzie (`l19_ruzie`), scheiding met huis verdelen en partneralimentatie (`S.alim`, max 5 jaar). Bestond al: vreemdgaan (beide kanten), partner wil weg (`s_weg`), voogdij en kinderalimentatie, huwelijkse voorwaarden. |
| 19.5 Leeftijd bij daten | Klaar (`love19.js`): daten vanaf 10 binnen je groep (10–14, 14–16, 16–30, 30+, grensleeftijd in beide groepen), zelf leeftijd kiezen in de app (`S.flags.dage`, `dageMenu`), kindvriendelijke profielen en openingszinnen onder 18. Grens die Claude aanhoudt: minderjarigen alleen met minderjarigen, volwassenen alleen met volwassenen; intimiteit blijft 18+ voor beiden (`canIntim`). |
| 20 Wonen | Klaar en online (`home20.js`). Steden met echte afstand en prijsniveau (`CITY20`, `cityIdx` op huizen en huur), verhuizen naar een andere stad (`moveCity`: forenzen met reistijd en reiskosten `S.cmt`, thuiswerken `S.job.rem` voor kantoor- en techbanen, ontslag; huis verkopen of houden; vrienden en een partner op afstand), inrichten (`S.home.inr`), buren (schutting, oppassen, buurtapp), studentenhuis (hospiteeravond, afwas, huisfeest, huisoudste `S.sth`). Meting 34 levens: 1,9 pop-ups per jaar, geen fouten. |
| 21 Minigames | Klaar en online (`mg21.js`). Aan/uit in Menu (`S.settings.mg`; uit = uitslag op basis van vaardigheid via `MGAUTO`/`mgW` om alle vaardigheids-minigames), rijexamen in twee delen (`drivingExam`: theorie `TRAFQ`, praktijk rijden + inparkeren, herkansen 40/300), sollicitatiegesprek met vier vragen en slotvraag (`INT21`, `INTEND`), sportwedstrijd per sport (`sportMatch`, nieuwe `mgPenalty`), meer examenvragen per vak (`QB21`) en moeilijkere op havo/vwo/hoger (`QB21H` via `quizPool`). |
| 22 Huisdieren | Klaar en online (`pets22.js`). Gezondheid en band op de kaart (`p.hl`, `p.rel`), voer, borstelen, trimsalon, steriliseren/castreren (`p.fix`); verwaarlozing kost gezondheid en levensjaren. Karakter (`p.pkt`, `PKT`), trucjes per soort (`TRICK`, `p.tr22`), shows en wedstrijden met bekers (`SHOW`, `petShow`, `p.cups`). Nieuwe soorten: cavia, vissen, fret, rat, kip, geit, ezel (kip/geit/ezel alleen met eigen huis). Jongen (`p22_nest`, ook ongepland), senior-moment (`p22_oud`) en afscheid (`p22_afscheid`). Meting 34 levens: 2,0 pop-ups per jaar, geen fouten. |
| 23 Eigen bedrijf | Klaar en online (`biz23.js`). Bestond al veel (medewerkers als personen met eigen momenten, inspectie, rechtszaak, overnamebod, schandaal, staking, franchise, beurs). Nieuw: vaste concurrent per bedrijf (`b.rv`, zetten `b23_rival`, aanklagen, verslaan tot faillissement, overnemen `buyRival`; effect op de vraag `b.demand`), producten lanceren (`launchMenu`, `b.prods`, hit/prima/flop via `b.mkt`), medewerker van het jaar. |

Verbeterplan 3 is hiermee af (18 november 2026).

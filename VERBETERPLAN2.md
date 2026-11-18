# Levensloop: verbeterplan deel 2 (dieper en beter)

Opgesteld op 18 november 2026, na fase 8. Doel: wat er al is gedetailleerder en beter maken, in plaats van alleen nieuwe onderdelen toevoegen.

Lees eerst `CLAUDE.md` en de werkwijze in `VERBETERPLAN.md` (die blijft gelden: per fase een kort plan, vragen alleen bij "Keuze voor Thijmen", fouten eerst reproduceren, een test per oplossing, migratie bij elke wijziging aan `S`, afsluiten met bouwen, simulaties en cijfers).

## Voortgang

| Fase | Stand (18 nov 2026, nacht) |
|---|---|
| 9 Mensen | Gebouwd: `people9.js`, `family9.js`, `calm9.js`. Karakter en geheugen voor iedereen, eigen levens (familie, partner, goede vrienden), berichten bij Relaties, buitenland, kinderen per leeftijd, samen beslissen, vriendengroepen, één groot familiemoment per jaar, verder als kleinkind, getrouwd = samenwonen. Pop-ups 3,0 → 2,2 schermen per jaar (fase 9 alleen). |
| 10 Werk en school | Gebouwd: `work10.js`. 16 beroepen, 8 studies, werkdag, jaargesprek, werktijden, burn-out, verlof, sabbatical, docenten, klas overslaan, stage, buitenlandsemester. |
| 11 Gezondheid | Gebouwd: `health11.js` (mild; Alzheimer niet meer in nieuwe ziektes; geen levenseinde). |
| 12 Activiteiten | Gebouwd: `acts12.js`. |
| 13 Geld | Gebouwd: `money13.js` (geen nieuwe verzekeringen; de bestaande auto- en spullenverzekering bleef). |
| 14 Roem | Gebouwd: `fame14.js`. |
| 15 Sport | Gebouwd: `sport15.js`. |
| 16 Misdaad | Gebouwd: `crime16.js` (moord: doelwit vanaf 16 jaar). |

## Wat Thijmen al koos (18 nov 2026)

- Alles mag dieper: activiteiten, relaties en familie, werk en school, gezondheid en ouderdom, roem en social media, misdaad en gevangenis, geld en bezit en auto's, sport.
- Gevoel: **minder maar groter**. Kleine dingen worden een regel in het logboek, grote momenten blijven een pop-up.
- Pop-ups: **ongeveer 2 per jaar** (nu 3,0). Elke fase moet dit halen.
- Toon: **zoals nu**. Luchtig met een knipoog, wel realistisch.
- Mensen in je leven krijgen een **volledig eigen leven**: ze trouwen, krijgen werk en kinderen, verhuizen, worden ziek, bellen jou en onthouden wat jij deed.
- Volgorde: **grootste impact eerst** (zie hieronder).
- Online zetten: **na elke fase**, na een "ga door" van Thijmen.

## Keuzes voor alle fases (18 nov 2026, 00:50)

- Claude bouwt fase 9 tot en met 16 achter elkaar door, zonder op "begin" te wachten. **Niets online zetten** tot Thijmen "ga door" zegt; wel alles op branch `bron` en een zip.
- **Pop-ups: 2 schermen per jaar** (= ongeveer één moment met een keuze per jaar). Gemeten zoals `stats.js` het telt (vraag + uitslag = 2 schermen). Was 3,0.
- 9: herinneringen zichtbaar ("Samen meegemaakt"). **Erbij (9.10):** ben je getrouwd, dan woon je automatisch samen, ook na het kopen of huren van een ander huis.
- 10: nieuwe beroepen in alle vier de groepen: vervoer (piloot, steward(ess), buschauffeur, machinist), zorg en dieren (tandarts, apotheker, dierenarts, ambulancebroeder), overheid en veiligheid (ambtenaar, brandweer, rechercheur, douane), ambacht en buiten (boer, hovenier, timmerman, loodgieter, later een eigen zaak). Werkdag: meestal een logregel, soms een moment met een keuze uit je beroep.
- 11: ziektes **mild** (de meeste gaan over). **Geen dementie en geen keuzes over het levenseinde.**
- 12: alle vier de groepen nieuwe activiteiten: cultuur (museum, theater, musical, cabaret), buiten (kamperen, volkstuin, wandeltocht, vissen), sport kijken (stadion of kroeg), leren (taal, cursus, geloof en kerk of moskee).
- 13: **geen verzekeringen**. Beurs met ongeveer 20 verzonnen bedrijven.
- 14 en 15: **echte namen waar het kan** (echte clubs, competities en prijzen); spelers, films, albums en boeken blijven verzonnen. Roem: acteur, muzikant, model, schrijver en presentator als projecten. Sport: alle 16 sporten krijgen seizoenen of toernooien.
- 16: misdaad **milder** (meer kans om weg te komen), met verhoor, advocaat en rechtszaak als spel.
- 16 (00:52): **moord en huurmoord** erbij, zoals in BitLife: alleen als spelmechaniek (doelwit kiezen, een abstracte aanpak, kans op succes), zonder echte methodes of details. Zware gevolgen: karma, recherche-onderzoek, levenslang als je gepakt wordt, en het slachtoffer verdwijnt uit je leven. Doelwit: iedereen, zoals in BitLife (bij familie, partner en vrienden is de pakkans hoger).

## Volgorde en waarom

| Fase | Onderdeel | Waarom op deze plek |
|---|---|---|
| 9 | Mensen en familie, plus rustiger pop-ups | Komt in elk leven voor, elk jaar. De andere fases bouwen hierop voort (collega's, klasgenoten, mantelzorg, reisgenoten). |
| 10 | Werk en school | Daar ben je de meeste jaren van een leven mee bezig. |
| 11 | Gezondheid en ouderdom | Elk leven heeft een tweede helft. Nu zijn er maar 22 ziektes en weinig te doen na je 65e. |
| 12 | Activiteiten | Wat je zelf aantikt. Nu vaak één tik en één zin. |
| 13 | Geld, bezit en auto's | Bijna elk volwassen leven, maar minder vaak het hart van het spel. |
| 14 | Roem en social media | Alleen in levens waarin je bekend wordt. |
| 15 | Sport | Alleen in sportlevens. |
| 16 | Misdaad en gevangenis | Alleen in criminele levens, en nu al het meest uitgewerkt. |

Elke fase is ongeveer zo groot als fase 8. Thijmen kan de volgorde altijd nog omgooien.

## Regels die voor elke fase gelden

- **Pop-upbudget.** Meet na elke fase met 136 passieve levens. Gemiddeld 2 pop-ups per jaar (marge 1,8 tot 2,3). Nieuwe kleine gebeurtenissen worden een logregel (eventueel met een knop "Bekijk" die het scherm van die persoon opent), alleen grote momenten krijgen een pop-up.
- **Grote momenten** zijn één pop-up met 2 tot 4 keuzes die later gevolgen hebben. Liever één bruiloft met keuzes over gasten, plek en speech dan drie losse pop-ups.
- **Geheugen.** Wat je doet, wordt waar het past een herinnering bij een persoon (fase 9.1). Latere fases schrijven daar ook in.
- **Opslag.** Meer details per persoon betekent meer opslag. `perf.js` moet blijven halen: 30 levens van 60 jaar passen. Bewaar alleen wat nodig is (korte codes in plaats van zinnen, oude herinneringen samenvatten).
- **Buitenland.** Alles werkt in alle 17 landen (`loc.js`, `locText`, `harvest.js` 0 treffers).
- **Migratie.** Bestaande levens op de iPhone krijgen nette standaardwaarden (een volwassen kind van 30 krijgt bijvoorbeeld een passende baan en relatie bij de eerste keer laden). Test met `tests/fixtures/`.
- **Rondgang-test** zoals `f8tour.js` per fase: klik alle nieuwe rijen door en speel elke nieuwe gebeurtenis een paar keer.

---

## Fase 9: mensen met een eigen leven

Doel: de mensen om je heen voelen echt. Ze hebben een karakter, onthouden wat je deed en hebben hun eigen levensloop.

Nu: ouders verdienen geld, kinderen gaan op hun 18e het huis uit en krijgen rond hun 22e een baan. Verder gebeurt er weinig met ze.

- **9.1 Geheugen.** Elke persoon onthoudt de laatste 8 belangrijke dingen tussen jullie, zoals: kwam naar je bruiloft, je vergat zijn verjaardag, je leende €500 en betaalde het niet terug, je stond voor hem klaar toen hij ziek was. Ze komen erop terug in gesprekken en bij grote momenten ("Weet je nog dat je er niet was op mijn bruiloft?"). Wrok en dankbaarheid zakken langzaam weg. In het scherm van de persoon staat een kopje "Samen meegemaakt".
- **9.2 Karakter voor iedereen.** Iedereen krijgt een karakter (zorgzaam, jaloers, eerzuchtig, lui, grappig, kortaf, gul, gierig…) en twee interesses. Dat bepaalt hoe ze reageren op wat jij doet en welke gespreksonderwerpen werken. Het karakter van een kind hangt deels af van je opvoedstijl en van de ouders.
- **9.3 Eigen levensloop.** Elk jaar kan iemand:
  - een opleiding afmaken, een baan krijgen, promotie maken of ontslagen worden;
  - een relatie krijgen, gaan samenwonen, trouwen of scheiden;
  - kinderen krijgen (dan krijg jij neven, nichten of kleinkinderen);
  - verhuizen, ook naar het buitenland;
  - ziek worden, herstellen of met pensioen gaan;
  - rijk of arm worden.

  In hun scherm staat een korte tijdlijn "Leven van …". De partners van je kinderen en broers en zussen worden echte personen (schoonzoon, schoondochter, zwager).
- **9.4 Zij nemen initiatief.** Mensen bellen om hulp, nodigen je uit (verjaardag, bruiloft, babyshower), vragen om geld, vertellen slecht nieuws of komen onverwacht langs. Dit is meestal een logregel. Alleen als het groot is, wordt het een pop-up.
- **9.5 Kinderen die opgroeien.** Per leeftijd heb je andere acties:
  - baby: voeden, troosten, knuffelen;
  - peuter: spelen, voorlezen, naar de opvang;
  - schoolkind: rapport bekijken, ouderavond, een sport of muziekles kiezen;
  - puber: huisregels, uitgaan, het eerste vriendje of vriendinnetje, ruzie;
  - volwassen: helpen met een huis, studie betalen, oppassen op de kleinkinderen.

  Hun cijfers, karakter en keuzes volgen uit wat jij deed.
- **9.6 Partner.** Samen beslissen: verhuizen, kinderwens, geld (gezamenlijke rekening of niet), huishouden verdelen. Ook jubilea, je partner die vreemdgaat of een droom wil volgen (emigreren, eigen zaak), en relatietherapie die echt iets doet.
- **9.7 Vrienden.** Een beste vriend of vriendin, een vriendengroep (bijvoorbeeld "vrienden van de studie"), vrienden die uit beeld raken als je niets doet, en reünies. Vrienden krijgen ook een eigen leven (9.3).
- **9.8 Grote familiemomenten.** Eén keer per jaar hooguit één groot familiemoment. Voorbeelden: de bruiloft van je kind (speech houden, betalen of niet), een kleinkind geboren, ruzie aan het kerstdiner, een familiefeest, een ruzie om de erfenis tussen broers en zussen.
- **9.9 Rustiger pop-ups.** Ga alle bestaande gebeurtenissen langs en verdeel ze in klein (wordt een logregel) en groot (blijft een pop-up). Zet een pop-upbudget per jaar in `rollEvent`. Doel: 3,0 naar ongeveer 2.

**Keuzes van Thijmen (18 nov 2026):**

- Een volledig eigen leven krijgen familie, de partner en vrienden met een goede band. De rest (collega's, klasgenoten, exen, buren) blijft eenvoudiger.
- Familie en vrienden mogen emigreren. Bezoek kost dan een reis, bellen kan altijd.
- Verder spelen na je dood: met je kinderen zoals nu. Alleen als er geen levend kind meer is, kun je verder als kleinkind.
- Herinneringen: niet beantwoord. Aangenomen is een zichtbaar kopje "Samen meegemaakt" in het scherm van de persoon. Thijmen kan dit nog omzetten.

---

## Fase 10: werk en school

Doel: je baan en je school hebben gezichten, en elk beroep voelt anders.

- **10.1 Baas en collega's met een naam.** Je baas heeft een karakter, en jullie band telt mee voor opslag en promotie. Collega's kunnen vriend, rivaal, verliefd of vijand worden, en ze nemen ook ontslag of maken promotie (fase 9.3).
- **10.2 Werkdag per beroep.** De werkdag kiest situaties die bij je sector horen:
  - zorg: spoed op de afdeling;
  - onderwijs: een onrustige klas;
  - ICT: een storing;
  - bouw: veiligheid op de bouwplaats;
  - horeca: volle bak.

  Elke situatie heeft keuzes. Er bestaan er al een paar, die worden per sector uitgebreid.
- **10.3 Jaargesprek.** Eén groot moment per jaar met je beoordeling, en daarna onderhandelen over opslag of promotie (vragen, dreigen te vertrekken, of tevreden zijn).
- **10.4 Meer beroepen en langere ladders.** Bijvoorbeeld piloot en steward, boer, ambtenaar, rechercheur, brandweer, dierenarts, apotheker, tandarts, zelfstandig met een eigen praktijk (huisarts, advocaat, kapper). Ook overstappen naar een ander bedrijf in dezelfde sector.
- **10.5 Werk en privé.** Overuren of op tijd naar huis (gevolgen voor gezin en gezondheid), thuiswerken, parttime, ouderschapsverlof, burn-out als gevolg van te lang te hard werken, sabbatical.
- **10.6 School met gezichten.** Docenten en een mentor met een naam en karakter, klasgenoten als echte personen, cijfers per vak, toetsweek met keuzes (leren, spieken, gokken), blijven zitten of een klas overslaan, examens per vak.
- **10.7 Studie.** Stage (kan een baan opleveren), een bijbaan naast je studie, op kamers of thuis wonen, een semester in het buitenland, studieschuld die je later echt voelt.

**Keuze voor Thijmen:** welke nieuwe beroepen eerst, en of de werkdag altijd een keuze of minigame is of soms gewoon een logregel.

---

## Fase 11: gezondheid en ouderdom

Doel: ziek worden en ouder worden zijn een verhaal met keuzes, geen getal dat zakt.

- **11.1 Ziekte als verloop.** Het verloopt in stappen: klachten, dokter, onderzoek, uitslag, behandeling kiezen (met kans op succes en bijwerkingen), en dan herstel, chronisch of erger. Er komen ongeveer 30 ziektes, verdeeld naar leeftijd. Sommige zitten in de familie.
- **11.2 Leefstijl telt.** Roken, drinken, sporten, eten, stress en slaap bepalen samen je risico's. De check-up laat zien waar het misgaat.
- **11.3 Ziekenhuis als groot moment.** Een operatie met keuzes (welk ziekenhuis, wachten of betalen in het buitenland), bezoek van familie (dat telt mee voor je relaties), revalidatie.
- **11.4 Mentale gezondheid.** Burn-out, depressie en angst met een herstelpad: therapie, rust, steun van mensen om je heen. Alles respectvol en zonder details die schade kunnen doen.
- **11.5 Ouder worden.**
  - Pensioen kiezen: vervroegd, op tijd of doorwerken.
  - De rol als opa of oma: oppassen en verwennen.
  - Kleiner gaan wonen, een seniorenwoning of een verpleeghuis.
  - Mantelzorg: jij voor je ouders, en later je kinderen voor jou. Dit gebruikt de band uit fase 9.
  - Vergeetachtigheid en dementie als verloop.
  - Levenstestament, en een afscheid met familie aan het eind.
- **11.6 Lichaam.** De avatar krijgt nu al grijs haar en rimpels (vanaf 55 en 60). Dat wordt geleidelijker, en er komt fitheid als aparte waarde naast gezondheid.

**Keuze voor Thijmen:** hoe zwaar ziektes mogen zijn (mild of realistisch), en of onderwerpen als dementie en levenseinde erin mogen. Die worden dan per land volgens de wet en voorzichtig verwoord.

---

## Fase 12: activiteiten

Doel: elke activiteit is een klein moment met een keuze, en je kunt het samen met iemand doen.

- **12.1 Van één zin naar een moment.** Een activiteit wordt één pop-up met 2 of 3 keuzes:
  - uit eten: met wie, wat bestel je, wie betaalt;
  - bioscoop: welke film, en wat vond je ervan;
  - dierentuin: welk dier, souvenir of niet.

  Er komt een knop "Snel" voor wie alleen het resultaat wil.
- **12.2 Samen doen.** Kies wie meegaat (partner, kind, vriend). Dat telt voor jullie band en wordt een herinnering (9.1).
- **12.3 Hobby's met een doel.** Niveaus, wedstrijden, een expositie of optreden, je werk verkopen, en een hobby die een beroep wordt (fotograaf, kok, schrijver).
- **12.4 Reizen.** Ongeveer 30 bestemmingen per werelddeel, een reisgenoot, en gebeurtenissen onderweg zoals een vertraagde vlucht, een kwijtgeraakte koffer, een vakantieliefde of een voedselvergiftiging. Foto's en souvenirs worden herinneringen.
- **12.5 Uitgaan.** Met wie je gaat, hoeveel je drinkt (met kater en gevolgen), wie je tegenkomt.
- **12.6 Nieuwe activiteiten.** Bijvoorbeeld museum, theater of musical, een wedstrijd in het stadion, kamperen, een volkstuin, een taal leren, een cursus voor je plezier, geloof en kerk of moskee.

**Keuze voor Thijmen:** welke nieuwe activiteiten erbij komen.

---

## Fase 13: geld, bezit en auto's

Doel: bezit kost en leeft, en rijk zijn voelt anders.

- **13.1 Auto's als echt bezit.** Brandstof, onderhoud, verzekering en APK per jaar. De waarde daalt, maar oldtimers stijgen. Schade en ongelukken, met een kans die afhangt van rijbewijs, leeftijd en alcohol. Ook motor en boot (met ligplaats).
- **13.2 Beurs.** Een stuk of 20 verzonnen bedrijven in sectoren die meebewegen met de economie, met dividend, crashes en hypes.
- **13.3 Belastingaangifte.** Eén moment per jaar met een overzicht. Je kunt kiezen: netjes, slim aftrekken of sjoemelen (met kans op controle).
- **13.4 Verzekeringen.** Zorg, inboedel, auto, aansprakelijkheid en leven. Ze bepalen wat een tegenslag kost.
- **13.5 Rijk leven.** Personeel (kok, chauffeur, tuinman), jacht en privéjet echt gebruiken, een kunstcollectie, een eigen stichting voor een goed doel.
- **13.6 Pensioen opbouwen.** Lijfrente of zelf beleggen, en zien wat je later krijgt.

**Keuze voor Thijmen:** verzekeringen wel of niet (meer regelwerk), en hoeveel beursbedrijven.

---

## Fase 14: roem en social media

Doel: een echte carrière in de showbizz, met projecten.

- **14.1 Carrière in projecten.**
  - Acteur: audities, rollen in reclame, series en films, de rol kiezen, recensies.
  - Muzikant: nummers schrijven, een album, de hitlijst, een tour, een platenlabel.
  - Model: shows en campagnes.
  - Ook presentator en schrijver (de bestsellerlijst).
- **14.2 Manager en contracten.** Een manager neemt een deel van je inkomen en regelt betere kansen.
- **14.3 Roem werkt door.** Je wordt herkend, paparazzi volgen je, schandalen vragen om een keuze (sorry zeggen, ontkennen of zwijgen), en je roem zakt als je niets doet.
- **14.4 Social media.** Soorten posts, trends, viraal gaan, sponsors, gecanceld worden, influencer-burn-out, een eigen merk.
- **14.5 Prijzen.** Een verzonnen prijsuitreiking als groot moment (nominatie, speech).

**Keuze voor Thijmen:** prijzen, films en labels met verzonnen namen (aanbevolen) of op echte prijzen lijkend.

---

## Fase 15: sport

Doel: een sportcarrière met seizoenen en hoogtepunten.

- **15.1 Seizoen.** Wedstrijden in het kort, je plek op de ranglijst, je statistieken (doelpunten, overwinningen, records).
- **15.2 Grote momenten.** Bekerfinale, kampioenschap, EK of WK, Olympische Spelen om de 4 jaar, selectie voor het nationale team.
- **15.3 Lichaam en markt.** Blessures met herstel, leeftijd die gaat tellen, een transfermarkt met clubs per land, salaris en zaakwaarnemer.
- **15.4 Na je carrière.** Trainer, analist op tv of een eigen sportschool.
- **15.5 Individuele sporten.** Toernooien en een wereldranglijst (tennis, golf, wielrennen, schaatsen).

**Keuze voor Thijmen:** clubnamen verzonnen (aanbevolen) of herkenbaar.

---

## Fase 16: misdaad en gevangenis

Doel: pakkans, rechtszaak en terugkeer worden een verhaal. Alles blijft spelmechaniek zonder echte instructies.

- **16.1 Opsporing.** Bewijs, verdachte worden, een verhoor met keuzes (zwijgen, bekennen of liegen).
- **16.2 Rechtszaak als spel.** Een advocaat kiezen (pro deo of duur), een schikking, getuigen, een jury in de VS, het vonnis.
- **16.3 Meer misdrijven.** Fraudevormen, cybercrime, afpersing en heling.
- **16.4 Terug in de maatschappij.** Je strafblad maakt werk vinden lastig (VOG), mensen reageren anders (fase 9), en je kunt een nieuwe start maken.
- **16.5 Slachtoffer.** Aangifte doen, een rechtszaak als benadeelde, schadevergoeding.

**Keuze voor Thijmen:** hoe streng straffen en pakkans zijn.

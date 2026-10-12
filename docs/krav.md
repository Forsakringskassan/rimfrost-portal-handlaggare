# Krav — Handläggarportalen (PORT)

## Bakgrund och syfte

Handläggarportalen är Försäkringskassans handläggarportal inom Rimfrost-projektet. Den
tillhandahåller applikationsskalet — inloggning, uppgiftslista och navigering — och laddar dynamiskt in regelspecifika mikrofrontends när en handläggare öppnar en uppgift av en given typ. Portalen innehåller själv ingen ärende- eller beslutslogik; den ansvarar för att visa vilka uppgifter en handläggare har, låta handläggaren hämta nya uppgifter, och ge varje mikrofrontend den kontext den behöver för att kunna arbeta med en uppgift.

---

## Intressenter och aktörer

| Aktör                                                     | Roll                                                                                            |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Handläggare                                               | Den enda slutanvändarrollen; loggar in, ser sin uppgiftslista, öppnar och arbetar med uppgifter |
| Portal BFF                                                | Den enda bakomliggande tjänsten portalen anropar                                                |
| Regel-mikrofrontends (t.ex. RTF Manuell, Bekräfta Beslut) | Laddas in dynamiskt av portalen för att hantera en specifik uppgiftstyp                         |

---

## Funktionella krav

### PORT-FR-01 — Inloggning och sessionshantering

- **PORT-FR-01.1** En obehörig användare ska mötas av en startsida och inte se uppgiftslista
  eller navigering.
- **PORT-FR-01.2** Användaren ska kunna välja en handläggaridentitet och logga in.
- **PORT-FR-01.3** Vald handläggaridentitet ska bevaras mellan sessioner så att användaren inte
  behöver logga in på nytt vid varje sidladdning.
- **PORT-FR-01.4** Den inloggade handläggarens namn ska visas i applikationens sidhuvud
  tillsammans med en möjlighet att logga ut.

### PORT-FR-02 — Uppgiftslista

- **PORT-FR-02.1** Efter inloggning ska handläggarens tilldelade uppgifter listas i en
  navigeringspanel.
- **PORT-FR-02.2** Uppgiftslistan ska hämtas på nytt när handläggaridentiteten ändras.
- **PORT-FR-02.3** Handläggaren ska kunna hämta en ny, ännu inte tilldelad uppgift och direkt
  navigera till den.
- **PORT-FR-02.4** En uppgift som meddelas som slutförd av en inbäddad mikrofrontend ska tas
  bort från uppgiftslistan och en bekräftelse ska visas för handläggaren.
- **PORT-FR-02.5** Om ingen uppgift är vald ska ett tomt tillstånd visas som vägleder
  handläggaren att välja en uppgift i menyn.
- **PORT-FR-02.6** Om Portal BFF:s svar anger att en eller flera uppgifter har tagits bort ur
  listan på grund av bristande behörighet (t.ex. SID-behörighet) ska handläggaren informeras
  genom en meddelanderuta med texten "En eller flera uppgifter har tagits bort av
  behörighetsskäl". Meddelandet ska förbli synligt tills handläggaren själv stänger det — det
  ska inte försvinna automatiskt.

### PORT-FR-03 — Dynamisk inladdning av mikrofrontends

- **PORT-FR-03.1** Portalen ska, utifrån ett register hämtat från Portal BFF, avgöra vilken
  mikrofrontend som ska laddas för en given uppgift.
- **PORT-FR-03.2** Portalen ska förmedla uppgiftens identifierare till den inlästa
  mikrofrontenden.
- **PORT-FR-03.3** Om registret inte kan hämtas ska ett tydligt felmeddelande visas.
- **PORT-FR-03.4** Om den specifika mikrofrontend-modulen inte kan laddas ska ett felmeddelande
  som skiljer detta fall från ett registerfel visas.
- **PORT-FR-03.5** Registret ska kunna uppdateras utan att portalen behöver byggas om.

### PORT-FR-04 — Lämna tillbaka en uppgift

- **PORT-FR-04.1** Handläggaren ska kunna lämna tillbaka en tilldelad uppgift från den öppnade
  uppgiftens vy (t.ex. vid jäv).
- **PORT-FR-04.2** Innan en uppgift lämnas tillbaka ska handläggaren bekräfta handlingen i en
  dialog.
- **PORT-FR-04.3** Vid lyckad avtilldelning ska uppgiften omedelbart tas bort ur handläggarens
  uppgiftslista, utan att sidan behöver laddas om, och en bekräftelse ska visas.
- **PORT-FR-04.4** Åtgärden ska tillhandahållas av applikationsskalet och vara tillgänglig för
  samtliga uppgiftstyper, oberoende av vilken mikrofrontend som är inläst.
- **PORT-FR-04.5** Om avtilldelningen misslyckas ska uppgiften kvarstå i listan och ett
  begripligt felmeddelande visas (jfr PORT-NFR-01.1).
- **PORT-FR-04.6** Bekräftelsedialogen ska göra klart att åtgärden inte kan ångras — uppgiften
  kommer inte att erbjudas handläggaren igen vid hämtning av ny uppgift (jfr OUL-FR-20).
- **PORT-FR-04.7** Bekräftelsedialogen ska ange att återlämning är avsedd för jäv eller annat
  formellt hinder, och inte som ett sätt att välja bort enskilda uppgifter.

### PORT-FR-05 — Teamets uppgifter och övertagande

- **PORT-FR-05.1** Handläggaren ska kunna se en tabell över samtliga uppgifter tilldelade
  teammedlemmar, separat från egna tilldelade uppgifter.
- **PORT-FR-05.2** Varje rad i teamlistan ska visa vilken handläggare uppgiften för närvarande
  är tilldelad.
- **PORT-FR-05.3** Handläggaren ska kunna ta över (stjäla) en teammedlems uppgift, efter
  bekräftelse i en dialog.
- **PORT-FR-05.4** Om övertagandet nekas på grund av bristande SID-behörighet ska ett tydligt,
  specifikt felmeddelande visas, skilt från ett generellt fel.
- **PORT-FR-05.5** Vid lyckat övertagande ska uppgiften visas i handläggarens egen lista.

### PORT-FR-06 — Sök och tilldela uppgift

Vissa uppgifter, t.ex. kommuniceringsuppgifter, delas inte ut via kön ("Hämta ny uppgift").
Handläggaren tilldelar sig dem i stället manuellt, till exempel när en kund hör av sig om
ett brev från Försäkringskassan.

- **PORT-FR-06.1** Vänstermenyn ska visa en sekundär knapp "Sök uppgift" under "Hämta ny
  uppgift", med samma stil som "Teamvy".
- **PORT-FR-06.2** Ett klick på "Sök uppgift" ska visa en sökvy i huvudytan, på samma sätt
  som teamvyn visas.
- **PORT-FR-06.3** Sökvyn ska ha ett sökfält för personnummer och en "Sök"-knapp.
- **PORT-FR-06.4** Sökfältet ska godta personnummer med 12 siffror, med eller utan
  bindestreck (`ÅÅÅÅMMDDNNNN` / `ÅÅÅÅMMDD-NNNN`).
- **PORT-FR-06.5** Sökningen ska starta automatiskt (fördröjt) när fältet innehåller ett
  komplett, giltigt personnummer. "Sök"-knappen och Enter ska starta samma sökning.
- **PORT-FR-06.6** Om innehållet inte är ett giltigt personnummer ska ingen sökning göras.
  Om användaren trycker "Sök" ska en valideringstext visas.
- **PORT-FR-06.7** Sökningen ska bara visa uppgifter som inte delas ut via kön och har
  status Ny.
- **PORT-FR-06.8** Träffarna ska visas i en lista med beskrivning, regel och skapad. Det
  sökta personnumret ska visas en gång ovanför listan, inte på varje rad.
- **PORT-FR-06.9** Om sökningen inte ger några träffar ska ett tydligt meddelande om att inga
  uppgifter hittades visas.
- **PORT-FR-06.10** Varje rad ska ha en knapp "Tilldela uppgift". Knappen ska tilldela
  uppgiften till den inloggade handläggaren via samma tilldelningsflöde som teamvyn, utan
  bekräftelsedialog.
- **PORT-FR-06.11** När tilldelningen lyckas ska uppgiften läggas till i handläggarens egen
  lista och öppnas i portalen.
- **PORT-FR-06.12** Om tilldelningen nekas (403) eller uppgiften inte finns (404), till
  exempel för att någon annan hann före, ska ett tydligt felmeddelande visas och träfflistan
  hämtas på nytt.
- **PORT-FR-06.13** Om sökningen misslyckas tekniskt ska ett felmeddelande visas, och
  portalen i övrigt ska fortsätta fungera (jfr PORT-NFR-01).
- **PORT-FR-06.14** Vilken identitetstyp som motsvarar personnummer i sökningen mot
  bakomliggande tjänster ska vara konfigurerbar och inte hårdkodad. _Uppfylls av Portal BFF
  (PBFF-FR-05.7). Portalen skickar endast personnumret._

### PORT-FR-07 — Markering av SID-uppgift

- **PORT-FR-07.1** När en öppnad uppgift rör en person med skyddad identitet (SID) ska ytan
  med uppgiftens rubrik och mikrofrontend ha en röd kant (3 px) till vänster.
- **PORT-FR-07.2** Markeringen ska även framgå för skärmläsare, så att den inte förmedlas
  enbart med färg.
- **PORT-FR-07.3** Om uppgiften är SID-märkt ska avgöras av bakomliggande tjänster.
  _Portal BFF skickar ännu ingen sådan uppgift. Tills vidare finns en tillfällig mock som bara
  är aktiv i utvecklingsläge (FKPOC-1113)._

### PORT-FR-08 — Skapa uppgift: vy och navigering

När en kund ringer och inte har någon pågående uppgift som kan sökas fram med "Sök uppgift"
behöver handläggaren kunna skapa en ny uppgift av rätt typ, eller bara anteckna samtalet.
Gränssnittet finns, men att faktiskt skapa uppgifter och spara anteckningar kopplas in senare
(FKPOC-1141).

- **PORT-FR-08.1** Vänstermenyn ska visa en sekundär knapp "Skapa uppgift" i `nav-footer`, med
  samma stil som "Sök uppgift" och "Teamvy".
- **PORT-FR-08.2** Ett klick på "Skapa uppgift" ska visa vyn Skapa uppgift i huvudytan, på
  samma sätt som Teamvy och Sök uppgift visas.
- **PORT-FR-08.3** Vyn Sök uppgift ska ha en knapp "Skapa uppgift" längst ner som öppnar vyn
  Skapa uppgift.

### PORT-FR-09 — Hitta uppgiftstyp

- **PORT-FR-09.1** Vyn ska ha ett sökfält med platshållartexten "Sök uppgiftstyp" och en knapp
  "Sök".
- **PORT-FR-09.2** Sökningen ska uppdateras fördröjt medan handläggaren skriver, från första
  tecknet. "Sök"-knappen och Enter ska uppdatera sökningen direkt.
- **PORT-FR-09.3** Sökningen ska matcha skiftlägesokänsligt på delar av uppgiftstypens namn,
  kategorins namn och uppgiftstypens sökord (synonymer).
- **PORT-FR-09.4** När sökfältet innehåller text ska kategorivisningen ersättas av en platt
  träfflista. Varje träff ska visa uppgiftstypens namn och dess kategori. Antal träffar ska
  visas.
- **PORT-FR-09.5** Om sökningen inte ger några träffar ska ett meddelande om det visas, med en
  hänvisning till att bläddra bland kategorierna eller skapa en anteckning.
- **PORT-FR-09.6** När sökfältet är tomt ska vyn först visa "Senast använda", med de
  uppgiftstyper handläggaren senast valt (högst 8, senaste först). Avsnittet ska döljas om
  listan är tom.
- **PORT-FR-09.7** Under "Senast använda" ska varje kategori visas som en expanderbar panel
  (`FExpandablePanel`) med kategorinamn och antal uppgiftstyper. Panelerna ska vara stängda från
  början. En öppen panel ska lista kategorins uppgiftstyper i bokstavsordning.
- **PORT-FR-09.8** Kategorierna ska visas i bokstavsordning.
- **PORT-FR-09.9** "Senast använda" ska sparas per handläggare i webbläsarens `localStorage`.
  Om lagringen inte är tillgänglig ska vyn fungera ändå, bara utan "Senast använda".
- **PORT-FR-09.10** Katalogen med uppgiftstyper ska hämtas via en asynkron funktion med samma
  form som ett framtida BFF-anrop. _Tills vidare levereras den från en statisk mockkatalog i
  portalen med realistiska kategorier och minst cirka 100 uppgiftstyper._

### PORT-FR-10 — Välj uppgiftstyp och bekräfta

- **PORT-FR-10.1** När handläggaren väljer en uppgiftstyp, ur träfflistan, "Senast använda"
  eller en kategori, ska ett bekräftelsesteg visas. Steget visar uppgiftstypens namn och
  kategori, ett personnummerfält och knapparna "Skapa uppgift" och "Tillbaka".
- **PORT-FR-10.2** Personnummerfältet ska förifyllas om personnumret för pågående samtal är känt
  (PORT-FR-11.5).
- **PORT-FR-10.3** Personnumret ska valideras med samma regel som Sök uppgift: 12 siffror, med
  eller utan bindestreck. Om det är ogiltigt ska en valideringstext visas när handläggaren
  trycker "Skapa uppgift".
- **PORT-FR-10.4** "Skapa uppgift" med giltigt personnummer ska lägga uppgiftstypen först i
  "Senast använda" och visa ett informationsmeddelande (toast) om att skapande av uppgift inte
  är inkopplat än. _Ingen uppgift skapas ännu._
- **PORT-FR-10.5** "Tillbaka" ska återgå till sökning och bläddring och behålla söktexten.

### PORT-FR-11 — Skapa anteckning

- **PORT-FR-11.1** Överst i vyn, under rubriken och ingressen "Registrera en manuell uppgift
  antingen via uppgiftstyp eller som anteckning.", ska ett val "Vad vill du registrera?" med
  alternativen "Uppgift" och "Anteckning" visas (radioknappar i rad). "Uppgift" är förvalt.
- **PORT-FR-11.2** Valet "Anteckning" ska byta ut sök- och bläddringsytan mot ett
  anteckningsformulär med ett personnummerfält, ett flerradigt fält för anteckningen
  (`FTextareaField`) och knappen "Spara". Valet "Uppgift" ska visa sök- och bläddringsytan igen
  med söktexten kvar. Om sökningen inte ger några träffar ska meddelandet innehålla en länk
  "registrera som anteckning" som byter till "Anteckning".
- **PORT-FR-11.3** "Spara" ska kräva ett giltigt personnummer (samma regel som PORT-FR-10.3) och
  en anteckning som inte är tom. Annars ska valideringstexter visas.
- **PORT-FR-11.4** När formuläret är giltigt ska "Spara" visa ett meddelande (toast) om att
  anteckningen sparats och tömma anteckningsfältet. _Anteckningen sparas ännu inte någonstans._
- **PORT-FR-11.5** Portalen ska ha ett ställe i en store för personnumret i pågående samtal
  (`pagaendeSamtal.personnummer`, valfritt). Anteckningsformuläret och bekräftelsesteget ska
  förifylla personnumret därifrån. _Tills telefonin är integrerad är fältet alltid tomt._

---

## Icke-funktionella krav

### PORT-NFR-01 — Feltolerans

- **PORT-NFR-01.1** Fel vid hämtning av handläggare eller uppgifter ska visas som ett begripligt
  meddelande utan att applikationen kraschar.

### PORT-NFR-02 — Integrerbarhet

- **PORT-NFR-02.1** Applikationsskalet ska hålla sig inom en fast yta i webbläsarfönstret och
  inte orsaka att den inlästa mikrofrontendens innehåll får hela sidan att rulla oavsiktligt.

### PORT-NFR-03 — Sökning

- **PORT-NFR-03.1** Behörighet och SID-filtrering för sökträffar och tilldelning ska avgöras
  av bakomliggande tjänster. Portalen ska inte göra egna behörighetsbedömningar.
- **PORT-NFR-03.2** En automatisk sökning ska göras högst en gång per giltigt personnummer.
  Ett nytt anrop ska inte skickas medan ett tidigare anrop för samma värde pågår.

### PORT-NFR-04 — Skapa uppgift

- **PORT-NFR-04.1** Sökning och filtrering i katalogen ska kännas omedelbar (under 50 ms för 500
  uppgiftstyper) och får inte låsa gränssnittet medan handläggaren skriver.
- **PORT-NFR-04.2** Vyn ska gå att använda med bara tangentbordet: sökfält, paneler, listval,
  formulär och knappar ska nås med Tab och aktiveras med Enter eller mellanslag. FKUI:s
  tillgänglighetsstöd ska inte kringgås.
- **PORT-NFR-04.3** Fördröjd sökning, katalog och "Senast använda" ska ha enhetstester (Vitest).
  Flödena "sök → välj → bekräfta" och "skapa anteckning" ska ha e2e-tester (Playwright).
- **PORT-NFR-04.4** Texten i anteckningar och personnummer ska inte loggas till konsolen och
  inte sparas i `localStorage`. Endast id:n för uppgiftstyper sparas.

---

## API-gränssnitt (översikt)

| API                 | Målgrupp          | Specifikationsartefakt                                             |
| ------------------- | ----------------- | ------------------------------------------------------------------ |
| Portal BFF REST-API | Denna applikation | Definieras av Portal BFF (ingen extern OpenAPI-specifikation ännu) |

---

## Integration med Portal BFF

Handläggarportalen talar uteslutande med Portal BFF för handläggar- och uppgiftsdata samt för
mikrofrontend-registret. All kommunikation med enskilda regel-mikrofrontends sker genom att
portalen laddar in dem direkt i webbläsaren — portalen anropar inte deras respektive BFF:er
själv.

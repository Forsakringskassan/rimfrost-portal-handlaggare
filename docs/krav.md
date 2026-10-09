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

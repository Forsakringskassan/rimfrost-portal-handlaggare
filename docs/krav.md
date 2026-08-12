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

- **PORT-FR-02.1** Efter inloggning ska handläggarens tilldelade uppgifter listas i ett
  navigeringspanel.
- **PORT-FR-02.2** Uppgiftslistan ska hämtas på nytt när handläggaridentiteten ändras.
- **PORT-FR-02.3** Handläggaren ska kunna hämta en ny, ännu inte tilldelad uppgift och direkt
  navigera till den.
- **PORT-FR-02.4** En uppgift som meddelas som slutförd av en inbäddad mikrofrontend ska tas
  bort från uppgiftslistan och en bekräftelse ska visas för handläggaren.
- **PORT-FR-02.5** Om ingen uppgift är vald ska ett tomt tillstånd visas som vägleder
  handläggaren att välja en uppgift i menyn.

### PORT-FR-03 — Dynamisk inladdning av mikrofrontends

- **PORT-FR-03.1** Portalen ska, utifrån ett register hämtat från Portal BFF, avgöra vilken
  mikrofrontend som ska laddas för en given uppgift.
- **PORT-FR-03.2** Portalen ska förmedla uppgiftens identifierare till den inlästa
  mikrofrontenden.
- **PORT-FR-03.3** Om registret inte kan hämtas ska ett tydligt felmeddelande visas.
- **PORT-FR-03.4** Om den specifika mikrofrontend-modulen inte kan laddas ska ett felmeddelande
  som skiljer detta fall från ett registerfel visas.
- **PORT-FR-03.5** Registret ska kunna uppdateras utan att portalen behöver byggas om.

---

## Icke-funktionella krav

### PORT-NFR-01 — Feltolerans

- **PORT-NFR-01.1** Fel vid hämtning av handläggare eller uppgifter ska visas som ett begripligt
  meddelande utan att applikationen kraschar.

### PORT-NFR-02 — Integrerbarhet

- **PORT-NFR-02.1** Applikationsskalet ska hålla sig inom en fast yta i webbläsarfönstret och
  inte orsaka att den inlästa mikrofrontendens innehåll får hela sidan att rulla oavsiktligt.

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

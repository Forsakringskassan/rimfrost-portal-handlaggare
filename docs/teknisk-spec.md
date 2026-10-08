# Teknisk spec — Handläggarportalen (PORT)

## Översikt

Värd-SPA (Vue 3 + TypeScript, Pinia, Vue Router) som via modulfederation dynamiskt laddar in
regelspecifika mikrofrontends. Ingen egen affärslogik eller databas. All data hämtas via
`fetch` mot en enda BFF, ingen websocket/polling.

## Komponentstruktur

```text
src/
├── router/                    # "/" (tomt läge, teamtabell eller sökvy) och "/items/:id" (inbäddad mikrofrontend)
├── components/
│   ├── UppgiftOversikt.vue     # Visar teamtabellen, sökvyn eller tomt-läget via viewStore
│   ├── UppgiftLista.vue        # Egna uppgifter i navigeringspanelen, lyssnar på "task-done"
│   ├── TeamUppgiftLista.vue    # Tabell över teamets uppgifter i huvudytan
│   ├── SokUppgift.vue          # Sökning på personnummer efter uppgifter som inte delas ut via kön
│   ├── OppnadUppgift.vue       # Löser upp och monterar rätt mikrofrontend för :id
│   ├── LoginModal.vue          # Val av handläggaridentitet
│   └── ToastContainer.vue      # Renderar meddelanderutor (toasts), inkl. icke-avvisande varianten
├── stores/                    # Pinia: handläggare/session, uppgiftslistor, aktiv vy (viewStore)
├── config/remoteRegistry.ts    # Hämtar och cachar modulfederationsregistret
├── utils/useToast.ts           # Global toast-state; stödjer både självstängande och
│                                # kvarstående (persistent) meddelanden
└── utils/loadRemoteModule.ts   # Modulfederation-inladdning av fjärrkomponenter
```

## API-specifikationer

Ingen extern OpenAPI-specifikation — kontraktet definieras av Portal BFF.

| Metod | Sökväg                 | Beskrivning                           |
| ----- | ---------------------- | ------------------------------------- |
| GET   | `/handlaggare`         | Lista över handläggare                |
| POST  | `/tasks`               | Uppgifter tilldelade vald handläggare |
| POST  | `/tasks/getNext`       | Tilldela nästa tillgängliga uppgift   |
| POST  | `/tasks/search`        | Sök uppgifter på personnummer         |
| POST  | `/tasks/{id}/reassign` | Tilldela/ta över uppgift              |
| GET   | `/api/route-manifest`  | Modulfederationsregister              |

### Meddelande vid begränsad behörighet

Svaret från `/tasks` och `/tasks/team` innehåller fältet `borttagna_pga_behorighet` (antal
uppgifter som togs bort ur listan eftersom handläggaren saknar behörighet, t.ex.
SID-behörighet). Är värdet större än 0 visas en kvarstående (icke-avvisande) toast via
`useToast`/`ToastContainer.vue` med texten "En eller flera uppgifter har tagits bort av
behörighetsskäl". Till skillnad från övriga toasts, som självstängs efter en fast tid, stängs
denna endast genom att handläggaren klickar på dess stängningsknapp.

### Sök uppgift

Sökvyn (`SokUppgift.vue`) skickar personnumret i bodyn till `POST /tasks/search`
(`{ "personnummer": "ÅÅÅÅMMDD-NNNN" }`), aldrig i URL:en. Sökningen startar automatiskt 300 ms
efter att fältet innehåller ett giltigt personnummer (12 siffror, med eller utan bindestreck),
eller direkt vid "Sök"/Enter. Samma personnummer söks inte igen medan ett anrop pågår eller
efter att det redan sökts, och ett nytt giltigt värde avbryter en pågående sökning
(PORT-NFR-03.2). Portalen filtrerar inte själv på behörighet eller SID, utan visar det BFF:en
returnerar (PORT-NFR-03.1). Träffarna hålls lokalt i komponenten och försvinner när vyn lämnas.

"Tilldela uppgift" på en träff anropar `POST /tasks/{id}/reassign`, samma anrop som "Ta över"
i teamvyn men utan bekräftelsedialog. Vid lyckad tilldelning läggs uppgiften till i den egna
listan och öppnas (`/items/:id`). Vid 403 visas teamvyns behörighetsmeddelande. BFF:en skickar
inte med orsaken, så ett SID-nekande kan inte skiljas från andra 403. Vid 404 visas att
uppgiften inte längre kan tilldelas. I båda fallen hämtas träfflistan på nytt.

## Kafka-integration

Ingen. Applikationen har ingen meddelandeintegration.

## Konfiguration

| Egenskap                                                | Beskrivning                     | Standardvärde          |
| ------------------------------------------------------- | ------------------------------- | ---------------------- |
| `VITE_BFF_URL`                                          | BFF-url vid lokal utveckling    | Relativ sökväg (proxy) |
| `RUNTIME_BFF_URL` (`window.__PORTAL_HANDLAGGARE_ENV__`) | BFF-url vid körning i container | —                      |

## Liveness

Ingen egen hälsokontroll — statisk frontend, hälsa avgörs av webbservern som serverar den.

## Kända begränsningar och framtida arbete

| Begränsning                                                                                                                              | Föreslagen åtgärd                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Inloggning är en klientsidig utvecklingslösning utan verklig autentisering                                                               | Ersätt med riktig identitetsleverantör innan produktion |
| Funktioner för att hämta teamets uppgifter och att omtilldela en uppgift finns implementerade men är inte kopplade till något gränssnitt | Koppla in eller ta bort                                 |
| Dokumenterad `regeltyp`-prop skickas aldrig till mikrofrontends trots att det beskrivs i tidigare dokumentation                          | Uppdatera dokumentationen eller implementera propen     |
| Ingen ruttskyddslogik hindrar direktnavigering till en uppgift utan inloggning                                                           | Bedöm behov av ruttvakter                               |

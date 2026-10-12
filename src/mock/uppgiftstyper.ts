import type { Uppgiftstyp } from "../types";

// Static mock catalog of uppgiftstyper (PORT-FR-09.10). The real catalog and its
// source are not decided yet; until then hamtaUppgiftstyper() serves this.
// Each entry is [id, namn, sökord] grouped by kategori.
const KATALOG: Record<string, Array<[string, string, string[]]>> = {
  Aktivitetsersättning: [
    [
      "ae-ansokan",
      "Ansökan om aktivitetsersättning",
      ["ansökan", "ung", "nedsatt arbetsförmåga"],
    ],
    [
      "ae-forlangd-skolgang",
      "Aktivitetsersättning vid förlängd skolgång",
      ["gymnasiesärskola", "skola", "studier"],
    ],
    [
      "ae-aktiviteter",
      "Planering av aktiviteter",
      ["aktivitetsplan", "aktivitet", "samordnare"],
    ],
    [
      "ae-omprovning",
      "Omprövning av aktivitetsersättning",
      ["omprövning", "ändra beslut", "överklagan"],
    ],
    [
      "ae-vilande",
      "Vilande aktivitetsersättning",
      ["vilande", "prova arbete", "arbetsprövning"],
    ],
    [
      "ae-upphor",
      "Aktivitetsersättning upphör",
      ["upphöra", "avsluta", "19 år", "30 år"],
    ],
  ],
  Arbetsskadeersättning: [
    [
      "as-anmalan",
      "Anmälan om arbetsskada",
      ["arbetsskada", "olycka", "arbetsolycka", "anmälan"],
    ],
    [
      "as-livranta",
      "Ansökan om livränta",
      ["livränta", "inkomstförlust", "ersättning"],
    ],
    [
      "as-arbetssjukdom",
      "Utredning av arbetssjukdom",
      ["arbetssjukdom", "sjukdom", "utredning"],
    ],
    [
      "as-fardolycksfall",
      "Färdolycksfall",
      ["olycka", "på väg till jobbet", "resa"],
    ],
    [
      "as-sjukvardskostnad",
      "Ersättning för sjukvårdskostnader",
      ["sjukvård", "kostnad", "kvitto"],
    ],
  ],
  Assistansersättning: [
    [
      "ass-ansokan",
      "Ansökan om assistansersättning",
      ["personlig assistans", "assistans", "LSS"],
    ],
    [
      "ass-omprovning",
      "Omprövning av assistansersättning",
      ["omprövning", "ändra beslut"],
    ],
    [
      "ass-timmar",
      "Ändrat behov av assistanstimmar",
      ["timmar", "behov", "utökning"],
    ],
    [
      "ass-tidredovisning",
      "Tidredovisning för assistans",
      ["tidredovisning", "redovisning", "assistansanordnare"],
    ],
    [
      "ass-anordnare",
      "Byte av assistansanordnare",
      ["anordnare", "byte", "utförare"],
    ],
    [
      "ass-aterbetalning",
      "Återbetalning av assistansersättning",
      ["återbetalning", "skuld", "felaktig utbetalning"],
    ],
    [
      "ass-sjukhusvistelse",
      "Assistans vid sjukhusvistelse",
      ["sjukhus", "inläggning", "vård"],
    ],
  ],
  Barnbidrag: [
    [
      "bb-flerbarnstillagg",
      "Ansökan om flerbarnstillägg",
      ["flerbarnstillägg", "syskon", "barn"],
    ],
    [
      "bb-delning",
      "Delning av barnbidrag",
      ["dela", "växelvis boende", "separation"],
    ],
    [
      "bb-forlangt",
      "Förlängt barnbidrag",
      ["förlängt", "studier", "gymnasieskola", "16 år"],
    ],
    [
      "bb-mottagare",
      "Byte av bidragsmottagare",
      ["mottagare", "byta", "vårdnadshavare"],
    ],
    [
      "bb-utland",
      "Barnbidrag vid utlandsvistelse",
      ["utland", "flytt", "utomlands"],
    ],
    [
      "bb-utebliven",
      "Utebliven utbetalning av barnbidrag",
      ["utebliven", "pengar", "ingen utbetalning"],
    ],
  ],
  Bostadsbidrag: [
    ["bob-ansokan", "Ansökan om bostadsbidrag", ["ansökan", "hyra", "boende"]],
    ["bob-andrad-inkomst", "Ändrad inkomst", ["inkomst", "lön", "ändring"]],
    [
      "bob-andrad-bostad",
      "Ändrade bostadsuppgifter",
      ["flytt", "bostad", "hyra", "boendekostnad"],
    ],
    [
      "bob-slutlig",
      "Slutlig avstämning av bostadsbidrag",
      ["avstämning", "slutligt bostadsbidrag", "deklaration"],
    ],
    [
      "bob-umgange",
      "Bostadsbidrag för umgängesbarn",
      ["umgängesbarn", "umgänge", "barn"],
    ],
    [
      "bob-aterbetalning",
      "Återbetalning av bostadsbidrag",
      ["återbetalning", "återkrav", "skuld"],
    ],
    [
      "bob-ungdom",
      "Bostadsbidrag för unga utan barn",
      ["ung", "18 år", "29 år"],
    ],
  ],
  Bostadstillägg: [
    ["bt-ansokan", "Ansökan om bostadstillägg", ["ansökan", "pension", "hyra"]],
    [
      "bt-andrade-uppgifter",
      "Ändrade uppgifter för bostadstillägg",
      ["ändring", "inkomst", "boende"],
    ],
    [
      "bt-sarskilt-boende",
      "Bostadstillägg vid särskilt boende",
      ["äldreboende", "särskilt boende", "vårdhem"],
    ],
    [
      "bt-utland",
      "Bostadstillägg vid utlandsvistelse",
      ["utland", "utomlands", "vistelse"],
    ],
  ],
  Föräldrapenning: [
    [
      "fp-ansokan",
      "Ansökan om föräldrapenning",
      ["föräldraledig", "ledighet", "barn", "fp"],
    ],
    [
      "fp-overlatelse",
      "Överlåtelse av föräldrapenningdagar",
      ["överlåta", "dagar", "andra föräldern"],
    ],
    [
      "fp-sgi",
      "Sjukpenninggrundande inkomst för föräldrapenning",
      ["sgi", "inkomst", "lön"],
    ],
    [
      "fp-dubbeldagar",
      "Dubbeldagar",
      ["dubbeldagar", "samtidigt lediga", "båda föräldrarna"],
    ],
    [
      "fp-adoption",
      "Föräldrapenning vid adoption",
      ["adoption", "adoptivbarn"],
    ],
    [
      "fp-grundniva",
      "Föräldrapenning på grundnivå",
      ["grundnivå", "lägstanivå", "ingen inkomst"],
    ],
    [
      "fp-uttag-utland",
      "Föräldrapenning vid utlandsvistelse",
      ["utland", "utomlands", "resa"],
    ],
    [
      "fp-andra-uttag",
      "Ändring av planerat uttag",
      ["ändra", "avboka", "planering"],
    ],
  ],
  Graviditetspenning: [
    [
      "gp-ansokan",
      "Ansökan om graviditetspenning",
      ["gravid", "fysiskt ansträngande", "riskmiljö"],
    ],
    [
      "gp-arbetsgivarintyg",
      "Arbetsgivarintyg för graviditetspenning",
      ["arbetsgivare", "intyg", "omplacering"],
    ],
    [
      "gp-forlangning",
      "Förlängning av graviditetspenning",
      ["förlänga", "fler dagar"],
    ],
  ],
  "Intyg och underlag": [
    [
      "iu-lakarintyg",
      "Komplettering av läkarintyg",
      ["läkarintyg", "komplettering", "intyg"],
    ],
    [
      "iu-arbetsgivarintyg",
      "Begäran om arbetsgivarintyg",
      ["arbetsgivarintyg", "arbetsgivare", "anställning"],
    ],
    [
      "iu-inkomstuppgift",
      "Begäran om inkomstuppgift",
      ["inkomst", "lönespecifikation", "lönebesked"],
    ],
    ["iu-skolintyg", "Begäran om skolintyg", ["skola", "studieintyg", "intyg"]],
    [
      "iu-inkommen-handling",
      "Registrering av inkommen handling",
      ["handling", "post", "inkommen", "dokument"],
    ],
    [
      "iu-utlandsk-handling",
      "Översättning av utländsk handling",
      ["utländsk", "översättning", "handling"],
    ],
    [
      "iu-forsakringsmedicin",
      "Konsultation med försäkringsmedicinsk rådgivare",
      ["fmr", "läkare", "rådgivare", "försäkringsmedicin"],
    ],
  ],
  "Kontaktuppgifter och personuppgifter": [
    ["kp-adress", "Ändrad adress", ["adress", "flytt", "postadress"]],
    [
      "kp-telefon",
      "Ändrat telefonnummer",
      ["telefon", "mobilnummer", "nummer"],
    ],
    ["kp-epost", "Ändrad e-postadress", ["e-post", "mejl", "mail"]],
    ["kp-ombud", "Registrering av ombud", ["ombud", "fullmakt", "god man"]],
    [
      "kp-forvaltare",
      "Registrering av förvaltare eller god man",
      ["god man", "förvaltare", "ställföreträdare"],
    ],
    ["kp-tolk", "Behov av tolk", ["tolk", "språk", "översättning"]],
    [
      "kp-utdrag",
      "Registerutdrag",
      ["registerutdrag", "gdpr", "personuppgifter", "utdrag"],
    ],
    ["kp-avliden", "Dödsfall", ["avliden", "dödsbo", "dödsfall"]],
  ],
  Sjukersättning: [
    [
      "se-ansokan",
      "Ansökan om sjukersättning",
      ["sjukersättning", "stadigvarande", "förtidspension"],
    ],
    [
      "se-omprovning",
      "Omprövning av sjukersättning",
      ["omprövning", "ändra beslut"],
    ],
    [
      "se-vilande",
      "Vilande sjukersättning",
      ["vilande", "prova arbete", "arbetsprövning"],
    ],
    [
      "se-inkomst",
      "Anmälan om inkomst vid sjukersättning",
      ["inkomst", "arbete", "fribelopp"],
    ],
    [
      "se-garanti",
      "Garantiersättning",
      ["garantiersättning", "låg inkomst", "grundskydd"],
    ],
    ["se-upphor", "Sjukersättning upphör", ["upphöra", "avsluta", "pension"]],
  ],
  Sjukpenning: [
    [
      "sp-ansokan",
      "Ansökan om sjukpenning",
      ["sjuk", "sjukskriven", "sjukskrivning"],
    ],
    [
      "sp-forlangning",
      "Förlängd sjukskrivning",
      ["förlänga", "nytt läkarintyg", "fortsatt sjuk"],
    ],
    [
      "sp-sgi",
      "Utredning av sjukpenninggrundande inkomst",
      ["sgi", "inkomst", "lön"],
    ],
    [
      "sp-rehabilitering",
      "Rehabiliteringsplan",
      ["rehabilitering", "rehab", "återgång i arbete"],
    ],
    [
      "sp-avstamningsmote",
      "Avstämningsmöte",
      ["möte", "arbetsgivare", "läkare", "avstämning"],
    ],
    [
      "sp-forebyggande",
      "Förebyggande sjukpenning",
      ["förebyggande", "behandling", "undvika sjukskrivning"],
    ],
    [
      "sp-arbetslos",
      "Sjukpenning för arbetssökande",
      ["arbetslös", "arbetssökande", "a-kassa"],
    ],
    [
      "sp-karens",
      "Ersättning för karensavdrag",
      ["karens", "karensdag", "högriskskydd"],
    ],
    [
      "sp-dag-180",
      "Bedömning av arbetsförmåga dag 180",
      ["dag 180", "arbetsförmåga", "normalt förekommande arbete"],
    ],
    [
      "sp-narstaende",
      "Närståendepenning",
      ["närstående", "svårt sjuk", "anhörig"],
    ],
  ],
  "Tillfällig föräldrapenning": [
    ["tfp-vab", "Anmälan om vård av barn", ["vab", "vabb", "sjukt barn"]],
    [
      "tfp-intyg",
      "Intyg om barnets frånvaro",
      ["förskola", "skola", "frånvarointyg"],
    ],
    [
      "tfp-lakarintyg",
      "Läkarintyg vid vård av barn",
      ["läkarintyg", "åttonde dagen", "vab"],
    ],
    [
      "tfp-allvarligt-sjukt",
      "Vård av allvarligt sjukt barn",
      ["allvarligt sjukt", "svårt sjukt", "obegränsat antal dagar"],
    ],
    [
      "tfp-smittbarare",
      "Tillfällig föräldrapenning för smittbärare",
      ["smitta", "smittbärare", "smittskydd"],
    ],
    [
      "tfp-kontaktdagar",
      "Kontaktdagar för barn med funktionsnedsättning",
      ["kontaktdagar", "funktionsnedsättning", "LSS"],
    ],
    [
      "tfp-overlatelse",
      "Överlåtelse av tillfällig föräldrapenning",
      ["överlåta", "annan försäkrad", "mor- eller farförälder"],
    ],
    [
      "tfp-tio-dagar",
      "Tio dagar i samband med barns födelse",
      ["10 dagar", "pappadagar", "födsel", "förlossning"],
    ],
    [
      "tfp-sen-anmalan",
      "Sen anmälan om vård av barn",
      ["för sent", "anmälan", "90 dagar"],
    ],
  ],
  Underhållsstöd: [
    [
      "uh-ansokan",
      "Ansökan om underhållsstöd",
      ["underhåll", "separation", "barn"],
    ],
    [
      "uh-betalningsskyldig",
      "Fastställande av återbetalningsskyldighet",
      ["bidragsskyldig", "återbetalning", "betalningsskyldig"],
    ],
    [
      "uh-forlangt",
      "Förlängt underhållsstöd vid studier",
      ["studier", "förlängt", "18 år"],
    ],
    [
      "uh-vaxelvis",
      "Underhållsstöd vid växelvis boende",
      ["växelvis", "boende", "delad"],
    ],
    [
      "uh-anstand",
      "Anstånd med betalning",
      ["anstånd", "betalning", "uppskov"],
    ],
    [
      "uh-direktbetalning",
      "Betalning direkt mellan föräldrar",
      ["mellan föräldrarna", "direkt", "egen överenskommelse"],
    ],
    ["uh-upphor", "Underhållsstöd upphör", ["upphöra", "avsluta", "flytt"]],
  ],
  "Utbetalning och ekonomi": [
    ["ue-kontonummer", "Ändrat kontonummer", ["konto", "bank", "kontonummer"]],
    [
      "ue-utebliven",
      "Utebliven utbetalning",
      ["utebliven", "pengar", "ingen utbetalning"],
    ],
    [
      "ue-aterkrav",
      "Återkrav",
      ["återkrav", "skuld", "återbetala", "felaktig utbetalning"],
    ],
    [
      "ue-avbetalning",
      "Avbetalningsplan",
      ["avbetalning", "betalningsplan", "skuld"],
    ],
    ["ue-skatt", "Ändrat skatteavdrag", ["skatt", "skatteavdrag", "jämkning"]],
    [
      "ue-kontrolluppgift",
      "Fråga om kontrolluppgift",
      ["kontrolluppgift", "deklaration", "skatteverket"],
    ],
    [
      "ue-utmatning",
      "Utmätning av förmån",
      ["utmätning", "kronofogden", "kfm"],
    ],
    [
      "ue-utbetalningsdag",
      "Fråga om utbetalningsdag",
      ["utbetalningsdag", "när betalas", "datum"],
    ],
  ],
  "Ärende och handläggning": [
    [
      "ah-overklagan",
      "Begäran om omprövning",
      ["överklagan", "omprövning", "ändra beslut", "missnöjd"],
    ],
    [
      "ah-forvaltningsratt",
      "Överklagan till förvaltningsrätten",
      ["förvaltningsrätt", "domstol", "överklagan"],
    ],
    [
      "ah-klagomal",
      "Klagomål på bemötande",
      ["klagomål", "synpunkt", "bemötande"],
    ],
    [
      "ah-handlaggningstid",
      "Fråga om handläggningstid",
      ["handläggningstid", "väntetid", "status"],
    ],
    [
      "ah-aterkalla",
      "Återkallad ansökan",
      ["återkalla", "dra tillbaka", "ångra"],
    ],
    [
      "ah-kommunicering",
      "Kommunicering inför beslut",
      ["kommunicering", "brev", "yttrande"],
    ],
    [
      "ah-ratt-uppgifter",
      "Rättelse av uppgifter",
      ["rättelse", "fel uppgift", "korrigering"],
    ],
  ],
};

export const UPPGIFTSTYPER: Uppgiftstyp[] = Object.entries(KATALOG).flatMap(
  ([kategori, typer]) =>
    typer.map(([id, namn, sokord]) => ({ id, namn, kategori, sokord })),
);

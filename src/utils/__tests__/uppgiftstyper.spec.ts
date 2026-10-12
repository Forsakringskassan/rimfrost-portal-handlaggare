import { describe, expect, it } from "vitest";
import type { Uppgiftstyp } from "../../types";
import {
  byggSokindex,
  grupperaPerKategori,
  hamtaUppgiftstyper,
  sokUppgiftstyper,
} from "../uppgiftstyper";

const typer: Uppgiftstyp[] = [
  {
    id: "vab",
    namn: "Anmälan om vård av barn",
    kategori: "Tillfällig föräldrapenning",
    sokord: ["vabb", "sjukt barn"],
  },
  {
    id: "adress",
    namn: "Ändrad adress",
    kategori: "Kontaktuppgifter",
    sokord: ["flytt"],
  },
  {
    id: "bostad",
    namn: "Ändrade bostadsuppgifter",
    kategori: "Bostadsbidrag",
    sokord: ["flytt", "hyra"],
  },
  {
    id: "bob",
    namn: "Ansökan om bostadsbidrag",
    kategori: "Bostadsbidrag",
    sokord: [],
  },
];

describe("hamtaUppgiftstyper", () => {
  it("returns the mock catalog with at least about 100 types (PORT-FR-09.10)", async () => {
    const katalog = await hamtaUppgiftstyper();
    expect(katalog.length).toBeGreaterThanOrEqual(100);
    expect(new Set(katalog.map((typ) => typ.id)).size).toBe(katalog.length);
    expect(new Set(katalog.map((typ) => typ.kategori)).size).toBeGreaterThan(
      10,
    );
  });
});

describe("grupperaPerKategori", () => {
  it("sorts kategorier and the types within each alphabetically (PORT-FR-09.7, PORT-FR-09.8)", () => {
    const kategorier = grupperaPerKategori(typer);
    expect(kategorier.map((k) => k.namn)).toEqual([
      "Bostadsbidrag",
      "Kontaktuppgifter",
      "Tillfällig föräldrapenning",
    ]);
    expect(kategorier[0].typer.map((t) => t.id)).toEqual(["bob", "bostad"]);
  });

  it("sorts å, ä and ö after z", () => {
    const kategorier = grupperaPerKategori([
      { ...typer[0], kategori: "Ärende" },
      { ...typer[1], kategori: "Zeta" },
    ]);
    expect(kategorier.map((k) => k.namn)).toEqual(["Zeta", "Ärende"]);
  });
});

describe("sokUppgiftstyper (PORT-FR-09.3)", () => {
  const index = byggSokindex(typer);
  const sok = (text: string): string[] =>
    sokUppgiftstyper(index, text).map((typ) => typ.id);

  it("returns nothing for an empty or blank search", () => {
    expect(sok("")).toEqual([]);
    expect(sok("   ")).toEqual([]);
  });

  it("matches part of the namn case-insensitively", () => {
    expect(sok("VÅRD")).toEqual(["vab"]);
    expect(sok("ändr")).toEqual(["adress", "bostad"]);
  });

  it("matches the kategori", () => {
    expect(sok("föräldrap")).toEqual(["vab"]);
  });

  it("matches a sökord", () => {
    expect(sok("vabb")).toEqual(["vab"]);
    expect(sok("Flytt")).toEqual(["adress", "bostad"]);
  });

  it("matches from the first character", () => {
    expect(sok("h")).toContain("bostad");
  });

  it("lists namn matches before kategori and sökord matches", () => {
    const rankning = byggSokindex([
      { id: "sokord", namn: "Aaa", kategori: "K", sokord: ["hyra"] },
      { id: "namn", namn: "Öööhyra", kategori: "K", sokord: [] },
    ]);
    expect(sokUppgiftstyper(rankning, "hyra").map((t) => t.id)).toEqual([
      "namn",
      "sokord",
    ]);
  });

  it("returns nothing when no type matches", () => {
    expect(sok("xyz")).toEqual([]);
  });

  it("searches 500 types well under 50 ms (PORT-NFR-04.1)", () => {
    const manga = Array.from({ length: 500 }, (_, i) => ({
      ...typer[i % typer.length],
      id: `typ-${i}`,
    }));
    const storIndex = byggSokindex(manga);
    const start = performance.now();
    for (const text of ["a", "an", "ans", "ansö", "ansök"]) {
      sokUppgiftstyper(storIndex, text);
    }
    expect((performance.now() - start) / 5).toBeLessThan(50);
  });
});

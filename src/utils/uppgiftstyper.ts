import { UPPGIFTSTYPER } from "../mock/uppgiftstyper";
import type { Uppgiftstyp } from "../types";

export interface Kategori {
  namn: string;
  typer: Uppgiftstyp[];
}

const SORTERING = new Intl.Collator("sv");

/**
 * Fetches the catalog of uppgiftstyper. Shaped like the future BFF call, but
 * served from a static mock until the real source is decided.
 */
export async function hamtaUppgiftstyper(): Promise<Uppgiftstyp[]> {
  return Promise.resolve(UPPGIFTSTYPER.map((typ) => ({ ...typ })));
}

/**
 * Groups the catalog by kategori. Both kategorier and the types within each
 * are sorted alphabetically.
 */
export function grupperaPerKategori(typer: Uppgiftstyp[]): Kategori[] {
  const perKategori = new Map<string, Uppgiftstyp[]>();
  for (const typ of typer) {
    const lista = perKategori.get(typ.kategori) ?? [];
    lista.push(typ);
    perKategori.set(typ.kategori, lista);
  }
  return [...perKategori.entries()]
    .map(([namn, lista]) => ({
      namn,
      typer: [...lista].sort((a, b) => SORTERING.compare(a.namn, b.namn)),
    }))
    .sort((a, b) => SORTERING.compare(a.namn, b.namn));
}

export interface Sokindex {
  typ: Uppgiftstyp;
  namn: string;
  // namn, kategori and sökord, lowercased once so each keystroke only has to
  // do substring checks.
  falt: string[];
}

export function byggSokindex(typer: Uppgiftstyp[]): Sokindex[] {
  return typer.map((typ) => {
    const namn = typ.namn.toLocaleLowerCase("sv");
    return {
      typ,
      namn,
      falt: [
        namn,
        typ.kategori.toLocaleLowerCase("sv"),
        ...typ.sokord.map((ord) => ord.toLocaleLowerCase("sv")),
      ],
    };
  });
}

/**
 * Case-insensitive substring search on namn, kategori and sökord
 *. Types whose namn matches come first, then alphabetical.
 */
export function sokUppgiftstyper(
  index: Sokindex[],
  soktext: string,
): Uppgiftstyp[] {
  const fraga = soktext.trim().toLocaleLowerCase("sv");
  if (!fraga) {
    return [];
  }
  return index
    .filter((post) => post.falt.some((falt) => falt.includes(fraga)))
    .map((post) => ({ typ: post.typ, iNamn: post.namn.includes(fraga) }))
    .sort(
      (a, b) =>
        Number(b.iNamn) - Number(a.iNamn) ||
        SORTERING.compare(a.typ.namn, b.typ.namn),
    )
    .map((post) => post.typ);
}

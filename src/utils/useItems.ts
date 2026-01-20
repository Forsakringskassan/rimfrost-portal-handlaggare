import { env } from "../config/env";

const USE_API = env.useApi;
const API_BASE = env.apiBaseUrl;

export interface Uppgift {
  fornamn: string;
  efternamn: string;
  personnummer: number;
  anstalld: boolean;
  harHund: boolean;
  kundbehovsflodeId: number;
  uppgiftsTyp: string;
  uppgiftsStatus: string;
}

/*
Här behöver vi röja upp lite för att byta
*/

export async function listItems(): Promise<
  Array<Pick<Uppgift, "kundbehovsflodeId" | "fornamn">>
> {
  if (!USE_API) {
    const data: Uppgift[] = await import("../assets/uppgifter.json").then(
      (m) => m.default,
    );
    return data.map(({ kundbehovsflodeId, fornamn }) => ({
      kundbehovsflodeId,
      fornamn,
    }));
  }
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) {
    throw new Error("API error");
  }
  const data: Uppgift[] = await res.json();
  return data.map(({ kundbehovsflodeId, fornamn }) => ({
    kundbehovsflodeId,
    fornamn,
  }));
}

export async function getItemById(id: number): Promise<Uppgift | null> {
  if (!USE_API) {
    const data: Uppgift[] = await import("../assets/uppgifter.json").then(
      (m) => m.default,
    );
    return data.find((i) => i.kundbehovsflodeId === id) ?? null;
  }
  const res = await fetch(`${API_BASE}/items/${id}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("API error");
  }
  return res.json();
}

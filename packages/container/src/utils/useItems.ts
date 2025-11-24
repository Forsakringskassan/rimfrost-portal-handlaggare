const USE_API = false; // flip to true when backend is ready
const API_BASE = "https://api.example.com"; // future

export interface Uppgift {
  fornamn: string;
  efternamn: string;
  personnummer: number;
  anstalld: boolean;
  harHund: boolean;
  uppgiftId: number;
  uppgiftsTyp: string;
  uppgiftsStatus: string;
}

export async function listItems(): Promise<
  Array<Pick<Uppgift, "uppgiftId" | "fornamn">>
> {
  if (!USE_API) {
    const data: Uppgift[] = await import("../assets/uppgifter.json").then(
      (m) => m.default,
    );
    return data.map(({ uppgiftId, fornamn }) => ({ uppgiftId, fornamn }));
  }
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) {
    throw new Error("API error");
  }
  const data: Uppgift[] = await res.json();
  return data.map(({ uppgiftId, fornamn }) => ({ uppgiftId, fornamn }));
}

export async function getItemById(id: number): Promise<Uppgift | null> {
  if (!USE_API) {
    const data: Uppgift[] = await import("../assets/uppgifter.json").then(
      (m) => m.default,
    );
    return data.find((i) => i.uppgiftId === id) ?? null;
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

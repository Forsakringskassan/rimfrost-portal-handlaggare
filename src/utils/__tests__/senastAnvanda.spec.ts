import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_SENAST_ANVANDA,
  laggTillSenastAnvanda,
  lasSenastAnvanda,
} from "../senastAnvanda";

const ANNA = "196001011234";
const BJORN = "197002022345";

// An in-memory Storage: Node 25's own global localStorage shadows happy-dom's
// and is unusable without --localstorage-file.
function skapaLagring(): Storage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

describe("senastAnvanda (PORT-FR-09.6, PORT-FR-09.9)", () => {
  let lagring: ReturnType<typeof skapaLagring>;

  beforeEach(() => {
    lagring = skapaLagring();
    vi.stubGlobal("localStorage", lagring);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("is empty when nothing has been chosen", () => {
    expect(lasSenastAnvanda(ANNA)).toEqual([]);
  });

  it("puts the latest choice first and removes duplicates", () => {
    laggTillSenastAnvanda(ANNA, "a");
    laggTillSenastAnvanda(ANNA, "b");
    expect(laggTillSenastAnvanda(ANNA, "a")).toEqual(["a", "b"]);
    expect(lasSenastAnvanda(ANNA)).toEqual(["a", "b"]);
  });

  it(`keeps at most ${MAX_SENAST_ANVANDA}`, () => {
    for (let i = 1; i <= 10; i++) {
      laggTillSenastAnvanda(ANNA, `typ-${i}`);
    }
    const lista = lasSenastAnvanda(ANNA);
    expect(lista).toHaveLength(MAX_SENAST_ANVANDA);
    expect(lista[0]).toBe("typ-10");
    expect(lista).not.toContain("typ-2");
  });

  it("keeps a separate list per handläggare", () => {
    laggTillSenastAnvanda(ANNA, "a");
    laggTillSenastAnvanda(BJORN, "b");
    expect(lasSenastAnvanda(ANNA)).toEqual(["a"]);
    expect(lasSenastAnvanda(BJORN)).toEqual(["b"]);
  });

  it("stores only uppgiftstyp ids (PORT-NFR-04.4)", () => {
    laggTillSenastAnvanda(ANNA, "a");
    expect([...lagring.data.values()]).toEqual([JSON.stringify(["a"])]);
  });

  it("ignores stored data with an unexpected shape", () => {
    laggTillSenastAnvanda(ANNA, "a");
    const [nyckel] = lagring.data.keys();
    localStorage.setItem(nyckel, "{inte json");
    expect(lasSenastAnvanda(ANNA)).toEqual([]);
    localStorage.setItem(nyckel, JSON.stringify({ a: 1 }));
    expect(lasSenastAnvanda(ANNA)).toEqual([]);
    localStorage.setItem(nyckel, JSON.stringify(["a", 2, null, "b"]));
    expect(lasSenastAnvanda(ANNA)).toEqual(["a", "b"]);
  });

  it("works without storage when reading throws", () => {
    vi.spyOn(lagring, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(lasSenastAnvanda(ANNA)).toEqual([]);
  });

  it("returns the new list even when saving throws", () => {
    vi.spyOn(lagring, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(laggTillSenastAnvanda(ANNA, "a")).toEqual(["a"]);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OperativUppgiftItem } from "../../types";
import { MOCK_SID_STORAGE_KEY, isSidUppgift } from "../skyddadIdentitet";

function uppgift(
  handlaggningId: string,
  skyddadIdentitet?: boolean,
): OperativUppgiftItem {
  return {
    uppgiftId: "u1",
    handlaggningId,
    skapad: "",
    status: "",
    handlaggarId: { typId: "t", varde: "v" },
    planeradTill: "",
    utford: "",
    individer: [],
    regel: "",
    beskrivning: "",
    verksamhetslogik: "",
    roll: "",
    url: "",
    skyddadIdentitet,
  };
}

describe("isSidUppgift", () => {
  // Node's own (unconfigured) localStorage global shadows jsdom's, so stub a
  // working one.
  beforeEach(() => {
    const items = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => items.set(key, value),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is false when nothing marks the uppgift", () => {
    expect(isSidUppgift(uppgift("h1"))).toBe(false);
  });

  it("is true for a handläggning listed in the mock", () => {
    localStorage.setItem(MOCK_SID_STORAGE_KEY, JSON.stringify(["h0", "h1"]));
    expect(isSidUppgift(uppgift("h1"))).toBe(true);
    expect(isSidUppgift(uppgift("h2"))).toBe(false);
  });

  it("ignores a malformed mock value", () => {
    localStorage.setItem(MOCK_SID_STORAGE_KEY, "not json");
    expect(isSidUppgift(uppgift("h1"))).toBe(false);
  });

  it("prefers skyddadIdentitet from the BFF over the mock", () => {
    localStorage.setItem(MOCK_SID_STORAGE_KEY, JSON.stringify(["h1"]));
    expect(isSidUppgift(uppgift("h1", false))).toBe(false);
    expect(isSidUppgift(uppgift("h2", true))).toBe(true);
  });
});

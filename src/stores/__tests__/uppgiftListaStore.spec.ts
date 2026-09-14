import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import type { OperativUppgiftItem } from "../../types";
import { useProductStore } from "../uppgiftListaStore";

const mockUppgift: OperativUppgiftItem = {
  uppgiftId: "1",
  handlaggningId: "h1",
  skapad: "2024-01-01",
  status: "OPPNAD",
  handlaggarId: { typId: "HID", varde: "abc123" },
  planeradTill: "2024-01-10",
  utford: "",
  individer: [],
  regel: "regel-1",
  beskrivning: "Testuppgift",
  verksamhetslogik: "vab",
  roll: "handlaggare",
  url: "/uppgifter/1",
};

describe("uppgiftListaStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty list", () => {
    const store = useProductStore();
    expect(store.uppgiftLista).toEqual([]);
  });

  it("setUppgiftLista replaces the list", () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift]);
    expect(store.uppgiftLista).toHaveLength(1);
    expect(store.uppgiftLista[0].uppgiftId).toBe("1");
  });

  it("setUppgiftLista clears the list when called with empty array", () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift]);
    store.setUppgiftLista([]);
    expect(store.uppgiftLista).toEqual([]);
  });

  it("setError sets the error and marks the store as fetched", () => {
    const store = useProductStore();
    store.setError("Kunde inte hämta uppgiftslistan.");
    expect(store.error).toBe("Kunde inte hämta uppgiftslistan.");
    expect(store.hasFetched).toBe(true);
  });

  it("setUppgiftLista clears a previous error", () => {
    const store = useProductStore();
    store.setError("Kunde inte hämta uppgiftslistan.");
    store.setUppgiftLista([mockUppgift]);
    expect(store.error).toBeNull();
  });

  it("removeUppgift drops only the matching uppgift", () => {
    const store = useProductStore();
    const other = { ...mockUppgift, uppgiftId: "2", handlaggningId: "h2" };
    store.setUppgiftLista([mockUppgift, other]);

    store.removeUppgift(mockUppgift.uppgiftId);

    expect(store.uppgiftLista).toHaveLength(1);
    expect(store.uppgiftLista[0].uppgiftId).toBe("2");
  });

  it("removeUppgift leaves the list untouched for an unknown id", () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift]);

    store.removeUppgift("finns-inte");

    expect(store.uppgiftLista).toHaveLength(1);
  });
});

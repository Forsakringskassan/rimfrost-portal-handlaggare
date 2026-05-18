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
});

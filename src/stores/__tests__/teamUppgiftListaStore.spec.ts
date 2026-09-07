import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import type { OperativUppgiftItem } from "../../types";
import { useTeamUppgiftListaStore } from "../teamUppgiftListaStore";

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

describe("teamUppgiftListaStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty list", () => {
    const store = useTeamUppgiftListaStore();
    expect(store.teamUppgiftLista).toEqual([]);
  });

  it("setTeamUppgiftLista replaces the list", () => {
    const store = useTeamUppgiftListaStore();
    store.setTeamUppgiftLista([mockUppgift]);
    expect(store.teamUppgiftLista).toHaveLength(1);
    expect(store.teamUppgiftLista[0].uppgiftId).toBe("1");
  });

  it("setTeamUppgiftLista clears the list when called with empty array", () => {
    const store = useTeamUppgiftListaStore();
    store.setTeamUppgiftLista([mockUppgift]);
    store.setTeamUppgiftLista([]);
    expect(store.teamUppgiftLista).toEqual([]);
  });

  it("is independent from the own-uppgifter store", async () => {
    const { useProductStore } = await import("../uppgiftListaStore");
    const ownStore = useProductStore();
    const teamStore = useTeamUppgiftListaStore();

    ownStore.setUppgiftLista([mockUppgift]);
    expect(teamStore.teamUppgiftLista).toEqual([]);
  });
});

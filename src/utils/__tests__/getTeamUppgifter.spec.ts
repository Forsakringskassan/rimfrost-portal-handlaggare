import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTeamUppgiftListaStore } from "../../stores/teamUppgiftListaStore";
import { useProductStore } from "../../stores/uppgiftListaStore";
import { getTeamUppgifter } from "../getTeamUppgifter";
import { useToast } from "../useToast";

// Mirrors the BFF's raw (snake_case) wire format, so the mock body is passed as
// JSON text rather than a JS object literal.
function mockFetch(json: string, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: () => Promise.resolve(JSON.parse(json)),
    }),
  );
}

describe("getTeamUppgifter", () => {
  const { toasts } = useToast();

  beforeEach(() => {
    setActivePinia(createPinia());
    toasts.value.splice(0, toasts.value.length);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("populates the team store, not the own-uppgifter store", async () => {
    mockFetch(
      '{"operativa_uppgifter": [{"uppgift_id": "1", "handlaggning_id": "h1", "skapad": "2024-01-01", "status": "TILLDELAD", "handlaggar_id": {"typ_id": "card", "varde": "abc123"}, "planerad_till": null, "utford": null, "individer": [], "regel": "regel-1", "beskrivning": "Test", "verksamhetslogik": "vab", "roll": "handlaggare", "url": "/uppgifter/1"}], "borttagna_pga_behorighet": 0}',
    );

    await getTeamUppgifter();

    const teamStore = useTeamUppgiftListaStore();
    const ownStore = useProductStore();
    expect(teamStore.teamUppgiftLista).toHaveLength(1);
    expect(ownStore.uppgiftLista).toEqual([]);
  });

  it("shows no toast when borttagna_pga_behorighet is 0", async () => {
    mockFetch('{"operativa_uppgifter": [], "borttagna_pga_behorighet": 0}');
    await getTeamUppgifter();
    expect(toasts.value).toHaveLength(0);
  });

  it("shows a persistent toast when borttagna_pga_behorighet is greater than 0", async () => {
    mockFetch('{"operativa_uppgifter": [], "borttagna_pga_behorighet": 2}');
    await getTeamUppgifter();
    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].message).toBe(
      "En eller flera uppgifter har tagits bort av behörighetsskäl",
    );
    expect(toasts.value[0].persistent).toBe(true);
  });
});

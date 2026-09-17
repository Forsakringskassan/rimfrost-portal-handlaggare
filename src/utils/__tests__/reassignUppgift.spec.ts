import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHandlaggareStore } from "../../stores/handlaggareStore";
import { useProductStore } from "../../stores/uppgiftListaStore";
import type { OperativUppgiftItem } from "../../types";
import { reassignUppgift } from "../reassignUppgift";

const pushMock = vi.fn();
vi.mock("../../router/index.js", () => ({
  router: { push: (...args: unknown[]) => pushMock(...args) },
}));

function mockUppgift(uppgiftId: string): OperativUppgiftItem {
  return {
    uppgiftId,
    handlaggningId: `h-${uppgiftId}`,
    skapad: "2024-01-01",
    status: "TILLDELAD",
    handlaggarId: { typId: "card", varde: "abc123" },
    planeradTill: "2024-01-10",
    utford: "",
    individer: [],
    regel: "regel-1",
    beskrivning: "Testuppgift",
    verksamhetslogik: "vab",
    roll: "handlaggare",
    url: "/uppgifter/1",
  };
}

function mockFetch(status: number, body: unknown = {}) {
  const spy = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", spy);
  return spy;
}

describe("reassignUppgift", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    pushMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds the taken-over uppgift to the own list and navigates to it", async () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift("1")]);
    mockFetch(200, { uppgift: mockUppgift("2") });

    await reassignUppgift("2");

    expect(store.uppgiftLista.map((u) => u.uppgiftId)).toEqual(["1", "2"]);
    expect(pushMock).toHaveBeenCalledWith({
      name: "item",
      params: { uppgiftId: "2" },
    });
  });

  it("does not duplicate an uppgift already present in the own list", async () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift("1")]);
    mockFetch(200, { uppgift: mockUppgift("1") });

    await reassignUppgift("1");

    expect(store.uppgiftLista.map((u) => u.uppgiftId)).toEqual(["1"]);
    expect(pushMock).toHaveBeenCalledWith({
      name: "item",
      params: { uppgiftId: "1" },
    });
  });

  it("posts to the reassign endpoint and forwards the bearer token", async () => {
    // OUL identifies the calling handläggare from this token and reassigns to
    // them, so dropping it would make every takeover anonymous.
    useHandlaggareStore().bearerToken = "card:abc123";
    const spy = mockFetch(200, { uppgift: mockUppgift("1") });

    await reassignUppgift("1");

    const [url, options] = spy.mock.calls[0];
    expect(url).toContain("/tasks/1/reassign");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer card:abc123");
  });

  it("throws and does not navigate when the caller is not a team member", async () => {
    mockFetch(403);

    await expect(reassignUppgift("1")).rejects.toThrow("403");
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("throws when the backend response has no uppgift", async () => {
    mockFetch(200, {});

    await expect(reassignUppgift("1")).rejects.toThrow(
      "Ingen uppgift i svaret från backend",
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
});

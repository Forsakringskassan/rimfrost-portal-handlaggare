import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHandlaggareStore } from "../../stores/handlaggareStore";
import { useProductStore } from "../../stores/uppgiftListaStore";
import type { OperativUppgiftItem } from "../../types";
import { UppgiftGoneError, unassignUppgift } from "../unassignUppgift";

const replaceMock = vi.fn();
vi.mock("../../router/index.js", () => ({
  router: { replace: (...args: unknown[]) => replaceMock(...args) },
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

// The endpoint answers 204 with no body, so `json` deliberately rejects here —
// if the util ever starts parsing the response, these tests fail.
function mockFetch(status: number) {
  const spy = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.reject(new SyntaxError("Unexpected end of JSON input")),
  });
  vi.stubGlobal("fetch", spy);
  return spy;
}

describe("unassignUppgift", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    replaceMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("removes the uppgift from the list and navigates away on 204", async () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift("1"), mockUppgift("2")]);
    mockFetch(204);

    await unassignUppgift("1");

    expect(store.uppgiftLista.map((u) => u.uppgiftId)).toEqual(["2"]);
    expect(replaceMock).toHaveBeenCalledWith("/");
  });

  it("posts to the unassign endpoint and forwards the bearer token", async () => {
    // OUL identifies the handläggare from this token and uses it to check
    // ownership, so dropping it would make every call anonymous.
    useHandlaggareStore().bearerToken = "card:abc123";
    const spy = mockFetch(204);

    await unassignUppgift("uppgift-1");

    const [url, options] = spy.mock.calls[0];
    expect(url).toContain("/tasks/uppgift-1/unassign");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer card:abc123");
  });

  it("throws and leaves the list untouched when the caller is not the assignee", async () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift("1")]);
    mockFetch(403);

    await expect(unassignUppgift("1")).rejects.toThrow("403");
    expect(store.uppgiftLista).toHaveLength(1);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("drops the stale uppgift from the list on 404 instead of leaving it", async () => {
    const store = useProductStore();
    store.setUppgiftLista([mockUppgift("1"), mockUppgift("2")]);
    mockFetch(404);

    // A 404 proves OUL no longer has it, so the list is corrected rather than
    // leaving a button that can never succeed.
    await expect(unassignUppgift("1")).rejects.toThrow(UppgiftGoneError);
    expect(store.uppgiftLista.map((u) => u.uppgiftId)).toEqual(["2"]);
    expect(replaceMock).not.toHaveBeenCalled();
  });
});

import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTilldeladeUppgifter } from "../getTilldeladeUppgifter";
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

const handlaggarId = { typId: "card", varde: "abc123" };

describe("getTilldeladeUppgifter", () => {
  const { toasts } = useToast();

  beforeEach(() => {
    setActivePinia(createPinia());
    toasts.value.splice(0, toasts.value.length);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows no toast when borttagna_pga_behorighet is 0", async () => {
    mockFetch('{"operativa_uppgifter": [], "borttagna_pga_behorighet": 0}');
    await getTilldeladeUppgifter(handlaggarId);
    expect(toasts.value).toHaveLength(0);
  });

  it("shows a persistent toast when borttagna_pga_behorighet is greater than 0", async () => {
    mockFetch('{"operativa_uppgifter": [], "borttagna_pga_behorighet": 2}');
    await getTilldeladeUppgifter(handlaggarId);
    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].message).toBe(
      "En eller flera uppgifter har tagits bort av behörighetsskäl",
    );
    expect(toasts.value[0].persistent).toBe(true);
  });

  it("shows no toast when borttagna_pga_behorighet is absent", async () => {
    mockFetch('{"operativa_uppgifter": []}');
    await getTilldeladeUppgifter(handlaggarId);
    expect(toasts.value).toHaveLength(0);
  });
});

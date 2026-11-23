import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Handlaggare } from "../../types";
import { useHandlaggareStore } from "../handlaggareStore";

const mockHandlaggare: Handlaggare[] = [
  {
    handlaggarId: { typId: "abc123", varde: "Anna Svensson" },
    fornamn: "Anna",
    efternamn: "Svensson",
  },
  {
    handlaggarId: { typId: "def456", varde: "Bo Karlsson" },
    fornamn: "Bo",
    efternamn: "Karlsson",
  },
];

function mockFetch(data: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: () => Promise.resolve(data),
    }),
  );
}

// Node 25's own global localStorage shadows happy-dom's and lacks its methods.
function stubLocalStorage() {
  const items = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => items.set(key, value),
    removeItem: (key: string) => items.delete(key),
  });
}

describe("handlaggareStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts with no handlaggare and no selection", () => {
    const store = useHandlaggareStore();
    expect(store.handlaggare).toEqual([]);
    expect(store.selectedHandlaggare).toBeNull();
  });

  describe("fetchHandlaggare", () => {
    it("populates the list and selects the first entry", async () => {
      mockFetch({ handlaggare: mockHandlaggare });
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      expect(store.handlaggare).toHaveLength(2);
      expect(store.selectedHandlaggare?.handlaggarId.typId).toBe("abc123");
    });

    it("logs an error and leaves state unchanged on HTTP error", async () => {
      mockFetch({}, false);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      expect(store.handlaggare).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledOnce();
      consoleSpy.mockRestore();
    });

    it("logs an error when response is not an array", async () => {
      mockFetch({ handlaggare: "not-an-array" });
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      expect(store.handlaggare).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledOnce();
      consoleSpy.mockRestore();
    });
  });

  describe("setSelectedHandlaggare", () => {
    it("sets selectedHandlaggare to the matching entry", async () => {
      mockFetch({ handlaggare: mockHandlaggare });
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      store.setSelectedHandlaggare("Bo Karlsson");
      expect(store.selectedHandlaggare?.fornamn).toBe("Bo");
    });

    it("does nothing if varde is not found", async () => {
      mockFetch({ handlaggare: mockHandlaggare });
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      store.setSelectedHandlaggare("does-not-exist");
      expect(store.selectedHandlaggare?.handlaggarId.typId).toBe("abc123");
    });
  });

  describe("authorization", () => {
    beforeEach(() => {
      stubLocalStorage();
    });

    it("is null before login", () => {
      expect(useHandlaggareStore().authorization).toBeNull();
    });

    it("is the Authorization header value for the logged-in handläggare", async () => {
      mockFetch({ handlaggare: mockHandlaggare });
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      store.login("Anna Svensson");
      expect(store.authorization).toBe("Bearer abc123:Anna Svensson");
    });

    it("follows a switch of handläggare", async () => {
      mockFetch({ handlaggare: mockHandlaggare });
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      store.login("Anna Svensson");
      store.login("Bo Karlsson");
      expect(store.authorization).toBe("Bearer def456:Bo Karlsson");
    });

    it("is cleared on logout", async () => {
      mockFetch({ handlaggare: mockHandlaggare });
      const store = useHandlaggareStore();
      await store.fetchHandlaggare();
      store.login("Anna Svensson");
      store.logout();
      expect(store.authorization).toBeNull();
    });
  });
});

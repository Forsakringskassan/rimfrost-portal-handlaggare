import { vi } from "vitest";

/**
 * Stubs a working in-memory localStorage. Under Node 25 Node's own
 * (unconfigured) localStorage global shadows happy-dom's and lacks its
 * methods. Undo with `vi.unstubAllGlobals()`.
 */
export function stubLocalStorage(): void {
  const items = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => items.set(key, value),
    removeItem: (key: string) => items.delete(key),
  });
}

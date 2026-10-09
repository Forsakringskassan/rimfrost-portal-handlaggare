import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHandlaggareStore } from "../../stores/handlaggareStore";
import { searchUppgifter } from "../searchUppgifter";

function mockFetch(status: number, body: unknown = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("searchUppgifter", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the personnummer in the body, not the URL", async () => {
    // eslint-disable-next-line camelcase -- the API uses snake_case
    const fetchMock = mockFetch(200, { operativa_uppgifter: [] });

    await searchUppgifter("19900101-9999");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/tasks\/search$/);
    expect(url).not.toContain("19900101");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ personnummer: "19900101-9999" });
  });

  it("sends the bearer token when logged in", async () => {
    // eslint-disable-next-line camelcase -- the API uses snake_case
    const fetchMock = mockFetch(200, { operativa_uppgifter: [] });
    useHandlaggareStore().bearerToken = "test-token";

    await searchUppgifter("19900101-9999");

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer test-token",
    );
  });

  it("returns the uppgifter from the response", async () => {
    mockFetch(200, {
      // eslint-disable-next-line camelcase -- the API uses snake_case
      operativa_uppgifter: [{ uppgiftId: "sok-1" }],
    });

    const result = await searchUppgifter("19900101-9999");

    expect(result).toEqual([{ uppgiftId: "sok-1" }]);
  });

  it("returns an empty list when the response has no uppgifter", async () => {
    mockFetch(200, {});

    expect(await searchUppgifter("19900101-9999")).toEqual([]);
  });

  it("throws on an error response", async () => {
    mockFetch(500);

    await expect(searchUppgifter("19900101-9999")).rejects.toThrow("500");
  });
});

import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useViewStore } from "../viewStore";

describe("viewStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts on mina uppgifter", () => {
    const store = useViewStore();
    expect(store.uppgiftVy).toBe("mina");
  });

  it("setVy switches to team", () => {
    const store = useViewStore();
    store.setVy("team");
    expect(store.uppgiftVy).toBe("team");
  });

  it("setVy switches to sok", () => {
    const store = useViewStore();
    store.setVy("sok");
    expect(store.uppgiftVy).toBe("sok");
  });

  it("setVy switches to skapa", () => {
    const store = useViewStore();
    store.setVy("skapa");
    expect(store.uppgiftVy).toBe("skapa");
  });

  it("setVy switches back to mina", () => {
    const store = useViewStore();
    store.setVy("team");
    store.setVy("mina");
    expect(store.uppgiftVy).toBe("mina");
  });
});

import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHandlaggareStore } from "../../stores/handlaggareStore";
import { useSamtalStore } from "../../stores/samtalStore";
import type { Uppgiftstyp } from "../../types";
import { hamtaUppgiftstyper } from "../../utils/uppgiftstyper";
import { useToast } from "../../utils/useToast";
import SkapaUppgift from "../SkapaUppgift.vue";

vi.mock("../../utils/uppgiftstyper", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../utils/uppgiftstyper")>()),
  hamtaUppgiftstyper: vi.fn(),
}));

const hamtaMock = vi.mocked(hamtaUppgiftstyper);

const HANDLAGGAR_ID = "196001011234";

const katalog: Uppgiftstyp[] = [
  {
    id: "vab",
    namn: "Anmälan om vård av barn",
    kategori: "Tillfällig föräldrapenning",
    sokord: ["vabb"],
  },
  {
    id: "adress",
    namn: "Ändrad adress",
    kategori: "Kontaktuppgifter",
    sokord: ["flytt"],
  },
  {
    id: "bob",
    namn: "Ansökan om bostadsbidrag",
    kategori: "Bostadsbidrag",
    sokord: ["hyra"],
  },
  {
    id: "bostad",
    namn: "Ändrade bostadsuppgifter",
    kategori: "Bostadsbidrag",
    sokord: ["flytt"],
  },
];

// In-memory Storage: Node 25's own global localStorage shadows happy-dom's.
function skapaLagring(): Storage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

let lagring: ReturnType<typeof skapaLagring>;

async function mountView() {
  const wrapper = mount(SkapaUppgift, { attachTo: document.body });
  await flushPromises();
  return wrapper;
}

type Wrapper = Awaited<ReturnType<typeof mountView>>;

async function type(wrapper: Wrapper, value: string) {
  await wrapper.find("input#sok-uppgiftstyp").setValue(value);
}

function valbaraIds(wrapper: Wrapper, selector = ""): string[] {
  return wrapper
    .findAll(`${selector} [data-uppgiftstyp-id]`)
    .map((el) => el.attributes("data-uppgiftstyp-id") ?? "");
}

function knapp(wrapper: Wrapper, text: string) {
  const found = wrapper.findAll("button").find((b) => b.text() === text);
  if (!found) {
    throw new Error(`No button "${text}"`);
  }
  return found;
}

describe("SkapaUppgift", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    lagring = skapaLagring();
    vi.stubGlobal("localStorage", lagring);
    hamtaMock.mockReset();
    hamtaMock.mockResolvedValue(katalog);
    const handlaggareStore = useHandlaggareStore();
    handlaggareStore.selectedHandlaggare = {
      handlaggarId: { typId: "PERSONAL_ID", varde: HANDLAGGAR_ID },
      fornamn: "Anna",
      efternamn: "Andersson",
    };
    const { toasts } = useToast();
    toasts.value.splice(0, toasts.value.length);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  describe("bläddra (PORT-FR-09.6–09.8)", () => {
    it("shows every kategori alphabetically as a closed panel with its count", async () => {
      const wrapper = await mountView();
      const paneler = wrapper.findAll(".expandable-panel");
      expect(paneler.map((p) => p.find(".h3, h3").text())).toEqual([
        "Bostadsbidrag (2)",
        "Kontaktuppgifter (1)",
        "Tillfällig föräldrapenning (1)",
      ]);
      for (const panel of paneler) {
        expect(panel.find("button").attributes("aria-expanded")).toBe("false");
      }
    });

    it("opens a panel and lists its types alphabetically", async () => {
      const wrapper = await mountView();
      const panel = wrapper.findAll(".expandable-panel")[0];
      await panel.find("button").trigger("click");
      expect(panel.find("button").attributes("aria-expanded")).toBe("true");
      expect(
        panel
          .findAll("[data-uppgiftstyp-id]")
          .map((el) => el.attributes("data-uppgiftstyp-id")),
      ).toEqual(["bob", "bostad"]);
    });

    it("hides Senast använda when it is empty", async () => {
      const wrapper = await mountView();
      expect(wrapper.text()).not.toContain("Senast använda");
    });
  });

  describe("fördröjd sökning (PORT-FR-09.2–09.5)", () => {
    it("shows the hit list after the delay, from the first character", async () => {
      const wrapper = await mountView();
      await type(wrapper, "f");

      await vi.advanceTimersByTimeAsync(299);
      expect(wrapper.find(".traffar-antal").exists()).toBe(false);
      expect(wrapper.findAll(".expandable-panel")).toHaveLength(3);

      await vi.advanceTimersByTimeAsync(1);
      expect(wrapper.findAll(".expandable-panel")).toHaveLength(0);
      expect(wrapper.find(".traffar-antal").text()).toBe("3 träffar");
    });

    it("restarts the delay on each keystroke", async () => {
      const wrapper = await mountView();
      await type(wrapper, "fl");
      await vi.advanceTimersByTimeAsync(200);
      await type(wrapper, "vabb");
      await vi.advanceTimersByTimeAsync(200);
      expect(wrapper.find(".traffar-antal").exists()).toBe(false);

      await vi.advanceTimersByTimeAsync(100);
      expect(valbaraIds(wrapper)).toEqual(["vab"]);
      expect(wrapper.find(".traffar-antal").text()).toBe("1 träff");
    });

    it("searches at once on Sök without waiting for the delay", async () => {
      const wrapper = await mountView();
      await type(wrapper, "flytt");
      await wrapper.find("form").trigger("submit");
      expect(valbaraIds(wrapper)).toEqual(["adress", "bostad"]);
    });

    it("shows the kategori of each hit", async () => {
      const wrapper = await mountView();
      await type(wrapper, "vabb");
      await wrapper.find("form").trigger("submit");
      expect(wrapper.find(".uppgiftstyp-lista__kategori").text()).toBe(
        "Tillfällig föräldrapenning",
      );
    });

    it("shows a message pointing to the kategorier and notes when nothing matches", async () => {
      const wrapper = await mountView();
      await type(wrapper, "xyz");
      await wrapper.find("form").trigger("submit");
      const text = wrapper.find(".traffar-antal").text();
      expect(text).toContain('Inga uppgiftstyper matchar "xyz"');
      expect(text).toContain("kategorierna");
      expect(text).toContain("anteckning");
    });

    it("goes back to browsing at once when the field is emptied", async () => {
      const wrapper = await mountView();
      await type(wrapper, "flytt");
      await wrapper.find("form").trigger("submit");
      await type(wrapper, "");
      expect(wrapper.findAll(".expandable-panel")).toHaveLength(3);
    });

    it("switches to the note form from the no-hits message", async () => {
      const wrapper = await mountView();
      await type(wrapper, "xyz");
      await wrapper.find("form").trigger("submit");
      await wrapper.find(".registrera-anteckning-lank").trigger("click");
      expect(wrapper.find("input#anteckning-personnummer").exists()).toBe(true);
      expect(
        wrapper.find<HTMLInputElement>("input[value=anteckning]").element
          .checked,
      ).toBe(true);
    });
  });

  describe("bekräfta (PORT-FR-10)", () => {
    async function valjVab(wrapper: Wrapper) {
      await type(wrapper, "vabb");
      await wrapper.find("form").trigger("submit");
      await wrapper.find('[data-uppgiftstyp-id="vab"]').trigger("click");
    }

    it("shows the chosen type as heading, its kategori, a personnummer field and a note", async () => {
      const wrapper = await mountView();
      await valjVab(wrapper);
      const steg = wrapper.find(".bekrafta-uppgiftstyp");
      expect(steg.find("h2").text()).toBe("Anmälan om vård av barn");
      expect(steg.find("dl").text()).not.toContain("Anmälan om vård av barn");
      expect(steg.find("dl").text()).toContain("Tillfällig föräldrapenning");
      expect(steg.find("input#skapa-uppgift-personnummer").exists()).toBe(true);
      expect(steg.find("textarea").exists()).toBe(true);
    });

    it("prefills the personnummer from the ongoing call (PORT-FR-10.2)", async () => {
      useSamtalStore().setPagaendeSamtal({ personnummer: "19900101-9999" });
      const wrapper = await mountView();
      await valjVab(wrapper);
      const input = wrapper.find<HTMLInputElement>(
        "input#skapa-uppgift-personnummer",
      );
      expect(input.element.value).toBe("19900101-9999");
    });

    it("shows a validation text for an invalid personnummer", async () => {
      const wrapper = await mountView();
      await valjVab(wrapper);
      await wrapper.find("input#skapa-uppgift-personnummer").setValue("123");
      await wrapper.find("section form").trigger("submit");
      expect(wrapper.find(".label__message--error").text()).toContain(
        "12 siffror",
      );
      expect(useToast().toasts.value).toHaveLength(0);
      expect(lagring.data.size).toBe(0);
    });

    it("adds the type to Senast använda and shows an info toast for a valid personnummer", async () => {
      const wrapper = await mountView();
      await valjVab(wrapper);
      await wrapper
        .find("input#skapa-uppgift-personnummer")
        .setValue("199001019999");
      await wrapper.find("section form").trigger("submit");

      const { toasts } = useToast();
      expect(toasts.value).toHaveLength(1);
      expect(toasts.value[0].type).toBe("info");
      expect(toasts.value[0].message).toContain("inte inkopplat");
      // Only the id is stored, never the personnummer (PORT-NFR-04.4).
      expect([...lagring.data.values()]).toEqual([JSON.stringify(["vab"])]);
      expect([...lagring.data.keys()][0]).toContain(HANDLAGGAR_ID);
    });

    it("keeps the search text on Tillbaka (PORT-FR-10.5)", async () => {
      const wrapper = await mountView();
      await valjVab(wrapper);
      await knapp(wrapper, "Tillbaka").trigger("click");
      await flushPromises();
      const input = wrapper.find<HTMLInputElement>("input#sok-uppgiftstyp");
      expect(input.element.value).toBe("vabb");
      expect(valbaraIds(wrapper)).toEqual(["vab"]);
    });
  });

  describe("senast använda (PORT-FR-09.6, PORT-FR-09.9)", () => {
    it("lists stored types newest first above the kategorier", async () => {
      lagring.setItem(
        `rimfrost.senastAnvandaUppgiftstyper.${HANDLAGGAR_ID}`,
        JSON.stringify(["adress", "okand-typ", "vab"]),
      );
      const wrapper = await mountView();
      expect(wrapper.find(".senast-anvanda h2").text()).toBe("Senast använda");
      expect(valbaraIds(wrapper, ".senast-anvanda")).toEqual(["adress", "vab"]);
    });

    it("works without Senast använda when storage throws", async () => {
      vi.spyOn(lagring, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      vi.spyOn(lagring, "setItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      const wrapper = await mountView();
      expect(wrapper.find(".senast-anvanda").exists()).toBe(false);
      expect(wrapper.findAll(".expandable-panel")).toHaveLength(3);

      await type(wrapper, "vabb");
      await wrapper.find("form").trigger("submit");
      await wrapper.find('[data-uppgiftstyp-id="vab"]').trigger("click");
      await wrapper
        .find("input#skapa-uppgift-personnummer")
        .setValue("199001019999");
      await wrapper.find("section form").trigger("submit");

      expect(useToast().toasts.value[0].type).toBe("info");
    });
  });

  describe("skapa anteckning (PORT-FR-11)", () => {
    async function oppnaAnteckning(wrapper: Wrapper) {
      await wrapper.find("input[value=anteckning]").setValue(true);
    }

    it("starts on Uppgift with the choice at the top (PORT-FR-11.1)", async () => {
      const wrapper = await mountView();
      expect(wrapper.text()).toContain("Vad vill du registrera?");
      expect(
        wrapper.find<HTMLInputElement>("input[value=uppgift]").element.checked,
      ).toBe(true);
      expect(wrapper.find("input#sok-uppgiftstyp").exists()).toBe(true);
    });

    it("replaces search and browsing with the note form", async () => {
      const wrapper = await mountView();
      await oppnaAnteckning(wrapper);
      expect(wrapper.find("input#sok-uppgiftstyp").exists()).toBe(false);
      expect(wrapper.find("input#anteckning-personnummer").exists()).toBe(true);
      expect(wrapper.find("textarea").exists()).toBe(true);
    });

    it("requires a valid personnummer and a note", async () => {
      const wrapper = await mountView();
      await oppnaAnteckning(wrapper);
      await wrapper.find("section form").trigger("submit");
      const fel = wrapper
        .findAll(".label__message--error")
        .map((e) => e.text());
      expect(fel.some((t) => t.includes("12 siffror"))).toBe(true);
      expect(fel.some((t) => t.includes("Skriv en anteckning"))).toBe(true);
      expect(useToast().toasts.value).toHaveLength(0);
    });

    it("shows a toast and clears the note when valid, without storing anything", async () => {
      const log = vi.spyOn(console, "log");
      const wrapper = await mountView();
      await oppnaAnteckning(wrapper);
      await wrapper
        .find("input#anteckning-personnummer")
        .setValue("19900101-9999");
      await wrapper.find("textarea").setValue("Kunden ringde om sin VAB.");
      await wrapper.find("section form").trigger("submit");

      expect(useToast().toasts.value[0].type).toBe("success");
      expect(wrapper.find<HTMLTextAreaElement>("textarea").element.value).toBe(
        "",
      );
      expect(lagring.data.size).toBe(0);
      expect(log).not.toHaveBeenCalled();
    });

    it("prefills the personnummer from the ongoing call (PORT-FR-11.5)", async () => {
      useSamtalStore().setPagaendeSamtal({ personnummer: "19900101-9999" });
      const wrapper = await mountView();
      await oppnaAnteckning(wrapper);
      expect(
        wrapper.find<HTMLInputElement>("input#anteckning-personnummer").element
          .value,
      ).toBe("19900101-9999");
    });

    it("keeps the search when switching back to Uppgift", async () => {
      const wrapper = await mountView();
      await type(wrapper, "flytt");
      await oppnaAnteckning(wrapper);
      await wrapper.find("input[value=uppgift]").setValue(true);
      await flushPromises();
      expect(
        wrapper.find<HTMLInputElement>("input#sok-uppgiftstyp").element.value,
      ).toBe("flytt");
    });
  });

  it("shows an error when the catalog cannot be fetched", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    hamtaMock.mockRejectedValue(new Error("nätverksfel"));
    const wrapper = await mountView();
    expect(wrapper.find("[role=alert]").text()).toContain(
      "Kunde inte hämta uppgiftstyper",
    );
  });
});

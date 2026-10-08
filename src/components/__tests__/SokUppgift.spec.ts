import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OperativUppgiftItem } from "../../types";
import {
  NotTeamMemberError,
  UppgiftNotFoundError,
  reassignUppgift,
} from "../../utils/reassignUppgift";
import { searchUppgifter } from "../../utils/searchUppgifter";
import { useToast } from "../../utils/useToast";
import SokUppgift from "../SokUppgift.vue";

vi.mock("../../utils/searchUppgifter", () => ({
  searchUppgifter: vi.fn(),
}));

vi.mock("../../utils/reassignUppgift", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../utils/reassignUppgift")>()),
  reassignUppgift: vi.fn(),
}));

const searchMock = vi.mocked(searchUppgifter);
const reassignMock = vi.mocked(reassignUppgift);

const uppgift: OperativUppgiftItem = {
  uppgiftId: "sok-1",
  handlaggningId: "handl-1",
  skapad: "2026-10-01T10:00:00Z",
  status: "Ny",
  handlaggarId: { typId: "", varde: "" },
  planeradTill: "",
  utford: "",
  individer: [],
  regel: "REGEL_KOMMUNICERING",
  beskrivning: "Kommunicering av beslut",
  verksamhetslogik: "VL",
  roll: "HANDLAGGARE",
  url: "",
};

function mountView() {
  return mount(SokUppgift, { attachTo: document.body });
}

async function type(wrapper: ReturnType<typeof mountView>, value: string) {
  await wrapper.find("input#sok-personnummer").setValue(value);
}

describe("SokUppgift", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    searchMock.mockReset();
    searchMock.mockResolvedValue([]);
    reassignMock.mockReset();
    reassignMock.mockResolvedValue();
    const { toasts } = useToast();
    toasts.value.splice(0, toasts.value.length);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  describe("validering", () => {
    it("does not search an invalid personnummer while typing", async () => {
      const wrapper = mountView();
      await type(wrapper, "19900101");
      await vi.advanceTimersByTimeAsync(1000);

      expect(searchMock).not.toHaveBeenCalled();
      expect(wrapper.find(".label__message--error").exists()).toBe(false);
    });

    it("shows a validation text when Sök is clicked with an invalid personnummer", async () => {
      const wrapper = mountView();
      await type(wrapper, "900101-9999");
      await wrapper.find("form").trigger("submit");

      expect(searchMock).not.toHaveBeenCalled();
      expect(wrapper.find(".label__message--error").text()).toContain(
        "12 siffror",
      );
    });

    it("clears the validation text when the input changes", async () => {
      const wrapper = mountView();
      await wrapper.find("form").trigger("submit");
      expect(wrapper.find(".label__message--error").exists()).toBe(true);

      await type(wrapper, "1");

      expect(wrapper.find(".label__message--error").exists()).toBe(false);
    });
  });

  describe("automatisk sökning", () => {
    it.each(["199001019999", "19900101-9999"])(
      "searches %s after the delay, normalised",
      async (value) => {
        const wrapper = mountView();
        await type(wrapper, value);

        await vi.advanceTimersByTimeAsync(299);
        expect(searchMock).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1);
        expect(searchMock).toHaveBeenCalledTimes(1);
        expect(searchMock.mock.calls[0][0]).toBe("19900101-9999");
      },
    );

    it("restarts the delay on each keystroke", async () => {
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(200);
      await type(wrapper, "199001018888");
      await vi.advanceTimersByTimeAsync(200);

      expect(searchMock).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(100);
      expect(searchMock).toHaveBeenCalledTimes(1);
      expect(searchMock.mock.calls[0][0]).toBe("19900101-8888");
    });

    it("searches at once on Sök without waiting for the delay", async () => {
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await wrapper.find("form").trigger("submit");

      expect(searchMock).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1000);
      expect(searchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dubblettskydd", () => {
    it("does not search the same value again while the search is in flight", async () => {
      searchMock.mockReturnValue(new Promise(() => undefined));
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);

      await wrapper.find("form").trigger("submit");
      await type(wrapper, "19900101-9999");
      await vi.advanceTimersByTimeAsync(300);

      expect(searchMock).toHaveBeenCalledTimes(1);
    });

    it("does not search the same value again after it has been searched", async () => {
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      await wrapper.find("form").trigger("submit");

      expect(searchMock).toHaveBeenCalledTimes(1);
    });

    it("lets a new valid value replace a search in flight", async () => {
      let resolveFirst!: (value: OperativUppgiftItem[]) => void;
      searchMock
        .mockReturnValueOnce(
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
        )
        .mockResolvedValueOnce([]);
      const wrapper = mountView();

      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      const firstSignal = searchMock.mock.calls[0][1];

      await type(wrapper, "199001018888");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      expect(firstSignal?.aborted).toBe(true);
      expect(searchMock).toHaveBeenCalledTimes(2);

      // The stale answer must not overwrite the newer one.
      resolveFirst([uppgift]);
      await flushPromises();
      expect(wrapper.text()).toContain("Uppgifter för 19900101-8888");
      expect(wrapper.text()).toContain("Inga uppgifter hittades");
    });
  });

  describe("träfflista", () => {
    it("shows the hits with beskrivning, regel and skapad, and the personnummer once", async () => {
      searchMock.mockResolvedValue([
        uppgift,
        { ...uppgift, uppgiftId: "sok-2" },
      ]);
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      const text = wrapper.text();
      expect(text.split("19900101-9999")).toHaveLength(2);
      expect(wrapper.findAll("tbody tr")).toHaveLength(2);
      const headers = wrapper.findAll("thead th").map((th) => th.text());
      expect(headers).toEqual(
        expect.arrayContaining(["Beskrivning", "Regel", "Skapad"]),
      );
      expect(text).toContain("Kommunicering av beslut");
      expect(text).toContain("REGEL_KOMMUNICERING");
      expect(text).toContain("2026-10-01");
    });

    it("shows a message when nothing is found", async () => {
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      expect(wrapper.text()).toContain("Inga uppgifter hittades");
      expect(wrapper.find("table").exists()).toBe(false);
    });
  });

  describe("fel", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    it("shows an error message when the search fails", async () => {
      searchMock.mockRejectedValue(new Error("HTTP error! status: 502"));
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      expect(wrapper.text()).toContain("Kunde inte söka efter uppgifter");
      expect(wrapper.text()).not.toContain("Inga uppgifter hittades");
    });

    it("lets Sök retry the same personnummer after a failure", async () => {
      searchMock.mockRejectedValueOnce(new Error("HTTP error! status: 502"));
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      await wrapper.find("form").trigger("submit");
      await flushPromises();

      expect(searchMock).toHaveBeenCalledTimes(2);
      expect(wrapper.text()).not.toContain("Kunde inte söka efter uppgifter");
      expect(wrapper.text()).toContain("Inga uppgifter hittades");
    });
  });

  describe("tilldela uppgift", () => {
    async function mountWithHits() {
      searchMock.mockResolvedValue([uppgift]);
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();
      return wrapper;
    }

    function tilldelaButton(wrapper: ReturnType<typeof mountView>) {
      const button = wrapper
        .findAll("tbody button")
        .find((b) => b.text() === "Tilldela uppgift");
      if (!button) {
        throw new Error("Tilldela uppgift button not found");
      }
      return button;
    }

    function toastMessages(): string[] {
      return useToast().toasts.value.map((t) => t.message);
    }

    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    it("shows a Tilldela uppgift button on each row", async () => {
      searchMock.mockResolvedValue([
        uppgift,
        { ...uppgift, uppgiftId: "sok-2" },
      ]);
      const wrapper = mountView();
      await type(wrapper, "199001019999");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      const buttons = wrapper
        .findAll("tbody button")
        .filter((b) => b.text() === "Tilldela uppgift");
      expect(buttons).toHaveLength(2);
    });

    it("assigns the uppgift without a confirmation dialog", async () => {
      const wrapper = await mountWithHits();

      await tilldelaButton(wrapper).trigger("click");
      await flushPromises();

      expect(reassignMock).toHaveBeenCalledWith("sok-1");
      expect(document.querySelector("[role=dialog]")).toBeNull();
      expect(toastMessages()).toContain("Uppgiften har tilldelats dig.");
    });

    it("disables the button while the call is in flight", async () => {
      let resolveReassign!: () => void;
      reassignMock.mockReturnValue(
        new Promise((resolve) => {
          resolveReassign = resolve;
        }),
      );
      const wrapper = await mountWithHits();

      await tilldelaButton(wrapper).trigger("click");
      expect(tilldelaButton(wrapper).attributes("disabled")).toBeDefined();

      await tilldelaButton(wrapper).trigger("click");
      expect(reassignMock).toHaveBeenCalledTimes(1);

      resolveReassign();
      await flushPromises();
      expect(tilldelaButton(wrapper).attributes("disabled")).toBeUndefined();
    });

    it("shows the team view's message on 403 and fetches the hits again", async () => {
      reassignMock.mockRejectedValue(new NotTeamMemberError());
      const wrapper = await mountWithHits();

      await tilldelaButton(wrapper).trigger("click");
      await flushPromises();

      expect(toastMessages()).toContain(new NotTeamMemberError().message);
      expect(searchMock).toHaveBeenCalledTimes(2);
      expect(searchMock.mock.calls[1][0]).toBe("19900101-9999");
    });

    it("shows that the uppgift can no longer be assigned on 404 and fetches the hits again", async () => {
      reassignMock.mockRejectedValue(new UppgiftNotFoundError());
      const wrapper = await mountWithHits();
      searchMock.mockResolvedValue([]);

      await tilldelaButton(wrapper).trigger("click");
      await flushPromises();

      expect(toastMessages()).toContain(
        "Uppgiften kan inte längre tilldelas. Listan har uppdaterats.",
      );
      expect(searchMock).toHaveBeenCalledTimes(2);
      expect(wrapper.text()).toContain("Inga uppgifter hittades");
    });

    it("shows a general message on other errors and keeps the list", async () => {
      reassignMock.mockRejectedValue(new Error("HTTP error! status: 502"));
      const wrapper = await mountWithHits();

      await tilldelaButton(wrapper).trigger("click");
      await flushPromises();

      expect(toastMessages()).toContain(
        "Kunde inte tilldela uppgiften. Försök igen senare.",
      );
      expect(searchMock).toHaveBeenCalledTimes(1);
      expect(wrapper.text()).toContain("Kommunicering av beslut");
    });
  });
});

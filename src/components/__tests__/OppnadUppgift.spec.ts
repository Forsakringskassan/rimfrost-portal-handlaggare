import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProductStore } from "../../stores/uppgiftListaStore";
import type { OperativUppgiftItem } from "../../types";
import { loadRemoteModule } from "../../utils/loadRemoteModule";
import OppnadUppgift from "../OppnadUppgift.vue";

vi.mock("../../utils/loadRemoteModule", () => ({
  loadRemoteModule: vi.fn(),
}));

vi.mock("vue-router", () => ({
  useRoute: () => ({ params: { uppgiftId: "upg-1" } }),
  useRouter: () => ({ push: vi.fn() }),
}));

const loadMock = vi.mocked(loadRemoteModule);

const UppgiftMfe = defineComponent({
  props: { handlaggningId: String },
  setup: (props) => () =>
    h("div", { class: "uppgift-mfe" }, props.handlaggningId),
});

const ProcessMfe = defineComponent({
  props: { handlaggningId: String, aktivitetId: String },
  setup: (props) => () =>
    h(
      "div",
      { class: "process-mfe" },
      `${props.handlaggningId}/${props.aktivitetId}`,
    ),
});

const uppgift: OperativUppgiftItem = {
  uppgiftId: "upg-1",
  handlaggningId: "handl-1",
  skapad: "2026-10-01T10:00:00Z",
  status: "Tilldelad",
  handlaggarId: { typId: "", varde: "" },
  planeradTill: "",
  utford: "",
  individer: [],
  regel: "RTF",
  beskrivning: "Rätt till försäkring",
  verksamhetslogik: "VL",
  roll: "HANDLAGGARE",
  url: "/regel/rtf-manuell",
};

async function mountWith(item: OperativUppgiftItem) {
  useProductStore().setUppgiftLista([item]);
  const wrapper = mount(OppnadUppgift, {
    global: { stubs: { "f-loader": true } },
  });
  await flushPromises();
  return wrapper;
}

describe("OppnadUppgift — processvy", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    loadMock.mockReset();
    loadMock.mockImplementation(async (key: string) =>
      key === "vah" ? ProcessMfe : UppgiftMfe,
    );
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the process micro frontend above the uppgift's micro frontend", async () => {
    const wrapper = await mountWith({
      ...uppgift,
      aktivitetId: "akt-1",
      processvyUrl: "/process/vah",
    });

    expect(loadMock).toHaveBeenCalledWith("rtf-manuell");
    expect(loadMock).toHaveBeenCalledWith("vah");
    expect(wrapper.find(".process-mfe").text()).toBe("handl-1/akt-1");
    const html = wrapper.html();
    expect(html.indexOf("process-mfe")).toBeLessThan(
      html.indexOf("uppgift-mfe"),
    );
  });

  it("shows the uppgift's micro frontend as usual when the processvy fails to load", async () => {
    loadMock.mockImplementation(async (key: string) => {
      if (key === "vah") {
        throw new Error("No remote config found");
      }
      return UppgiftMfe;
    });
    const wrapper = await mountWith({
      ...uppgift,
      aktivitetId: "akt-1",
      processvyUrl: "/process/vah",
    });

    expect(wrapper.find(".process-mfe").exists()).toBe(false);
    expect(wrapper.find(".uppgift-mfe").text()).toBe("handl-1");
    expect(wrapper.find(".error-message").exists()).toBe(false);
  });

  it("loads no processvy for an uppgift without processvyUrl", async () => {
    const wrapper = await mountWith(uppgift);

    expect(loadMock).toHaveBeenCalledTimes(1);
    expect(loadMock).toHaveBeenCalledWith("rtf-manuell");
    expect(wrapper.find(".process-vy").exists()).toBe(false);
    expect(wrapper.find(".uppgift-mfe").exists()).toBe(true);
  });
});

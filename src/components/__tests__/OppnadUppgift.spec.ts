import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHandlaggareStore } from "../../stores/handlaggareStore";
import { useProductStore } from "../../stores/uppgiftListaStore";
import { stubLocalStorage } from "../../test-utils/stubLocalStorage";
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

describe("OppnadUppgift — handläggarens token till mikrofrontends", () => {
  let mounts: number;

  const TokenMfe = defineComponent({
    props: { handlaggningId: String, authorization: String },
    setup: (props) => {
      mounts++;
      return () => h("div", { class: "uppgift-mfe" }, props.authorization);
    },
  });

  const TokenProcessMfe = defineComponent({
    props: {
      handlaggningId: String,
      aktivitetId: String,
      authorization: String,
    },
    setup: (props) => () =>
      h("div", { class: "process-mfe" }, props.authorization),
  });

  function loginAs(typId: string, varde: string) {
    const handlaggareStore = useHandlaggareStore();
    handlaggareStore.handlaggare = [
      { handlaggarId: { typId, varde }, fornamn: varde, efternamn: "" },
    ];
    handlaggareStore.login(varde);
  }

  beforeEach(() => {
    setActivePinia(createPinia());
    stubLocalStorage();
    mounts = 0;
    loadMock.mockReset();
    loadMock.mockImplementation(async (key: string) =>
      key === "vah" ? TokenProcessMfe : TokenMfe,
    );
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("passes the logged-in handläggare's Authorization value to the uppgift's and the process's micro frontend", async () => {
    loginAs("kortnr", "1234");
    const wrapper = await mountWith({
      ...uppgift,
      aktivitetId: "akt-1",
      processvyUrl: "/process/vah",
    });

    expect(wrapper.find(".uppgift-mfe").text()).toBe("Bearer kortnr:1234");
    expect(wrapper.find(".process-mfe").text()).toBe("Bearer kortnr:1234");
  });

  it("remounts the micro frontend with the new token when the handläggare switches", async () => {
    loginAs("kortnr", "1234");
    const wrapper = await mountWith({
      ...uppgift,
      aktivitetId: "akt-1",
      processvyUrl: "/process/vah",
    });
    expect(mounts).toBe(1);

    loginAs("kortnr", "5678");
    await flushPromises();

    expect(wrapper.find(".uppgift-mfe").text()).toBe("Bearer kortnr:5678");
    expect(wrapper.find(".process-mfe").text()).toBe("Bearer kortnr:5678");
    expect(mounts).toBe(2);
    // The process module is not reloaded, only its component remounted.
    expect(loadMock.mock.calls.filter(([key]) => key === "vah")).toHaveLength(
      1,
    );
  });

  it("gives the micro frontend no token after logout", async () => {
    loginAs("kortnr", "1234");
    const wrapper = await mountWith({
      ...uppgift,
      aktivitetId: "akt-1",
      processvyUrl: "/process/vah",
    });

    useHandlaggareStore().logout();
    await flushPromises();

    expect(wrapper.find(".uppgift-mfe").text()).toBe("");
    expect(wrapper.find(".process-mfe").text()).toBe("");
    expect(wrapper.html()).not.toContain("1234");
  });

  it("does not leak the token into the DOM of a micro frontend that does not declare the prop", async () => {
    loadMock.mockImplementation(async () => UppgiftMfe);
    loginAs("kortnr", "1234");
    const wrapper = await mountWith(uppgift);

    expect(wrapper.find(".uppgift-mfe").text()).toBe("handl-1");
    expect(wrapper.html()).not.toContain("Bearer");
  });
});

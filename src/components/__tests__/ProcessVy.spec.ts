import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadRemoteModule } from "../../utils/loadRemoteModule";
import ProcessVy from "../ProcessVy.vue";

vi.mock("../../utils/loadRemoteModule", () => ({
  loadRemoteModule: vi.fn(),
}));

const loadMock = vi.mocked(loadRemoteModule);

const RemoteProcessVy = defineComponent({
  props: { handlaggningId: String, aktivitetId: String },
  setup: (props) => () =>
    h(
      "div",
      { class: "remote-processvy" },
      `${props.handlaggningId}/${props.aktivitetId}`,
    ),
});

const TrasigProcessVy = defineComponent({
  setup: () => () => {
    throw new Error("render failed");
  },
});

function mountVy(props: Record<string, string | undefined>) {
  return mount(ProcessVy, { props });
}

describe("ProcessVy", () => {
  beforeEach(() => {
    loadMock.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the process micro frontend by the last segment of processvyUrl", async () => {
    loadMock.mockResolvedValue(RemoteProcessVy);
    mountVy({ processvyUrl: "/process/vah" });
    await flushPromises();

    expect(loadMock).toHaveBeenCalledWith("vah");
  });

  it("passes handlaggningId and aktivitetId to the process micro frontend", async () => {
    loadMock.mockResolvedValue(RemoteProcessVy);
    const wrapper = mountVy({
      processvyUrl: "/process/vah",
      handlaggningId: "handl-1",
      aktivitetId: "akt-1",
    });
    await flushPromises();

    expect(wrapper.find(".remote-processvy").text()).toBe("handl-1/akt-1");
  });

  it("loads nothing when the uppgift has no processvyUrl", async () => {
    const wrapper = mountVy({ handlaggningId: "handl-1" });
    await flushPromises();

    expect(loadMock).not.toHaveBeenCalled();
    expect(wrapper.find(".process-vy").exists()).toBe(false);
  });

  it("renders nothing and shows no error when loading fails", async () => {
    loadMock.mockRejectedValue(new Error("No remote config found"));
    const wrapper = mountVy({ processvyUrl: "/process/vah" });
    await flushPromises();

    expect(wrapper.find(".process-vy").exists()).toBe(false);
    expect(wrapper.text()).toBe("");
  });

  it("hides itself when the process micro frontend throws while rendering", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    loadMock.mockResolvedValue(TrasigProcessVy);
    const wrapper = mountVy({ processvyUrl: "/process/vah" });
    await flushPromises();

    expect(wrapper.find(".process-vy").exists()).toBe(false);
  });

  it("ignores a slow load for a previous processvyUrl", async () => {
    const VabProcessVy = defineComponent({
      setup: () => () => h("div", { class: "vab-processvy" }),
    });
    let resolveVah!: (c: typeof RemoteProcessVy) => void;
    const vahLoad = new Promise<typeof RemoteProcessVy>((resolve) => {
      resolveVah = resolve;
    });
    loadMock.mockReturnValueOnce(vahLoad).mockResolvedValueOnce(VabProcessVy);
    const wrapper = mountVy({ processvyUrl: "/process/vah" });
    await wrapper.setProps({ processvyUrl: "/process/vab" });
    await flushPromises();
    resolveVah(RemoteProcessVy);
    await flushPromises();

    expect(wrapper.find(".vab-processvy").exists()).toBe(true);
    expect(wrapper.find(".remote-processvy").exists()).toBe(false);
  });
});

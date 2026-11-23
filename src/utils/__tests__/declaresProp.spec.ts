import { defineComponent } from "vue";
import { describe, expect, it } from "vitest";
import { declaresProp } from "../declaresProp";

describe("declaresProp", () => {
  it("finds a prop declared as an object", () => {
    const component = defineComponent({ props: { authorization: String } });
    expect(declaresProp(component, "authorization")).toBe(true);
  });

  it("finds a prop declared as an array", () => {
    const component = defineComponent({ props: ["authorization"] });
    expect(declaresProp(component, "authorization")).toBe(true);
  });

  it("is false for a component without the prop or without props", () => {
    expect(
      declaresProp(
        defineComponent({ props: { handlaggningId: String } }),
        "authorization",
      ),
    ).toBe(false);
    expect(declaresProp(defineComponent({}), "authorization")).toBe(false);
  });
});

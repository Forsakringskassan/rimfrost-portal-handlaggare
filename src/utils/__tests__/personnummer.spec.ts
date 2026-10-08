import { describe, expect, it } from "vitest";
import { normalizePersonnummer } from "../personnummer";

describe("normalizePersonnummer", () => {
  it.each([
    ["199001019999", "19900101-9999"],
    ["19900101-9999", "19900101-9999"],
    [" 19900101-9999 ", "19900101-9999"],
  ])("accepts %j as %s", (value, expected) => {
    expect(normalizePersonnummer(value)).toBe(expected);
  });

  it.each([
    "",
    "9001019999",
    "900101-9999",
    "1990010199999",
    "19900101--9999",
    "1990010a9999",
    "19900101+9999",
  ])("rejects %j", (value) => {
    expect(normalizePersonnummer(value)).toBeNull();
  });
});

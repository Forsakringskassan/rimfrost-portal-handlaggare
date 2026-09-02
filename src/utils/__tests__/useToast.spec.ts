import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useToast } from "../useToast";

describe("useToast", () => {
  const { toasts, success, error, dismiss } = useToast();

  beforeEach(() => {
    toasts.value.splice(0, toasts.value.length);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-dismisses a regular toast after the default duration", () => {
    vi.useFakeTimers();
    success("Uppgift slutförd");
    expect(toasts.value).toHaveLength(1);

    vi.advanceTimersByTime(3000);
    expect(toasts.value[0].removing).toBe(true);

    vi.advanceTimersByTime(300);
    expect(toasts.value).toHaveLength(0);
  });

  it("does not auto-dismiss a persistent toast", () => {
    vi.useFakeTimers();
    error("Persistent message", { persistent: true });

    vi.advanceTimersByTime(60_000);
    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].removing).toBe(false);
  });

  it("dismiss() manually removes a persistent toast", () => {
    vi.useFakeTimers();
    const id = error("Persistent message", { persistent: true });

    dismiss(id);
    expect(toasts.value[0].removing).toBe(true);

    vi.advanceTimersByTime(300);
    expect(toasts.value).toHaveLength(0);
  });
});

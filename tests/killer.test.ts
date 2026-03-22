import { describe, expect, it, vi } from "vitest";

import { killPid } from "../src/core/killer.js";

describe("killPid", () => {
  it("returns ok when kill succeeds", () => {
    const killFn = vi.fn();
    expect(killPid(42, "SIGTERM", killFn)).toEqual({ ok: true });
    expect(killFn).toHaveBeenCalledWith(42, "SIGTERM");
  });

  it("maps EPERM to permission denied", () => {
    const killFn = vi.fn(() => {
      const err = new Error("eprm");
      (err as NodeJS.ErrnoException).code = "EPERM";
      throw err;
    });
    expect(killPid(1, "SIGTERM", killFn)).toEqual({ ok: false, permissionDenied: true });
  });

  it("treats ESRCH as ok", () => {
    const killFn = vi.fn(() => {
      const err = new Error("esrch");
      (err as NodeJS.ErrnoException).code = "ESRCH";
      throw err;
    });
    expect(killPid(1, "SIGTERM", killFn)).toEqual({ ok: true });
  });
});

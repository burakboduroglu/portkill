import { describe, expect, it } from "vitest";

import { execErrorCode } from "../src/utils/exec-error.js";

describe("execErrorCode", () => {
  it("returns the numeric exit status of a child that ran and failed", () => {
    expect(execErrorCode(Object.assign(new Error("lsof"), { code: 1 }))).toBe(1);
  });

  it("returns the errno string of a spawn that never ran", () => {
    expect(execErrorCode(Object.assign(new Error("nope"), { code: "ENOENT" }))).toBe("ENOENT");
  });

  it("returns undefined for an error without a code", () => {
    expect(execErrorCode(new Error("plain"))).toBeUndefined();
  });

  it("returns undefined for a thrown non-object", () => {
    expect(execErrorCode("boom")).toBeUndefined();
    expect(execErrorCode(null)).toBeUndefined();
  });
});

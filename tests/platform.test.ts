import { describe, expect, it } from "vitest";

import { getSupportedPlatform, UnsupportedPlatformError } from "../src/utils/platform.js";

describe("getSupportedPlatform", () => {
  it("returns darwin or linux on supported OS", () => {
    const p = getSupportedPlatform();
    expect(p === "darwin" || p === "linux").toBe(true);
  });
});

describe("UnsupportedPlatformError", () => {
  it("carries platform id", () => {
    const e = new UnsupportedPlatformError("win32");
    expect(e.platform).toBe("win32");
    expect(e.message).toContain("win32");
  });
});

import { describe, expect, it } from "vitest";

import {
  expandPortToken,
  MAX_PORTS_PER_RANGE,
  parsePortArguments,
} from "../src/utils/parse-ports.js";

describe("expandPortToken", () => {
  it("parses single port", () => {
    expect(expandPortToken("3000")).toEqual([3000]);
  });

  it("parses inclusive range", () => {
    expect(expandPortToken("3000-3003")).toEqual([3000, 3001, 3002, 3003]);
  });

  it("parses same start and end", () => {
    expect(expandPortToken("80-80")).toEqual([80]);
  });

  it("trims whitespace", () => {
    expect(expandPortToken("  443  ")).toEqual([443]);
  });

  it("rejects start > end", () => {
    expect(() => expandPortToken("3005-3000")).toThrow(/start must be <= end/);
  });

  it("rejects out of range port", () => {
    expect(() => expandPortToken("0")).toThrow(/invalid port/);
    expect(() => expandPortToken("70000")).toThrow(/invalid port/);
  });

  it("rejects garbage", () => {
    expect(() => expandPortToken("abc")).toThrow(/invalid port/);
    expect(() => expandPortToken("30a0")).toThrow(/invalid port/);
  });

  it("rejects range larger than MAX_PORTS_PER_RANGE", () => {
    const start = 1;
    const end = start + MAX_PORTS_PER_RANGE;
    expect(() => expandPortToken(`${start}-${end}`)).toThrow(/too large/);
  });
});

describe("parsePortArguments", () => {
  it("merges singles and ranges", () => {
    expect(parsePortArguments(["3000", "3002-3004"])).toEqual([3000, 3002, 3003, 3004]);
  });

  it("dedupes preserving order", () => {
    expect(parsePortArguments(["3000", "3001", "3000-3002"])).toEqual([3000, 3001, 3002]);
  });
});

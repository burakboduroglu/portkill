import { describe, expect, it } from "vitest";

import { parseLsofListenLine } from "../src/core/lister.js";

describe("parseLsofListenLine", () => {
  it("parses typical lsof LISTEN line", () => {
    const line =
      "node    12345 user   23u  IPv6 0xabcdef      0t0  TCP *:3000 (LISTEN)";
    expect(parseLsofListenLine(line)).toEqual({
      port: 3000,
      pid: 12345,
      commandName: "node",
    });
  });

  it("parses 127.0.0.1 style", () => {
    const line =
      "nginx   99 root    6u  IPv4 0x123      0t0  TCP 127.0.0.1:8080 (LISTEN)";
    expect(parseLsofListenLine(line)).toEqual({
      port: 8080,
      pid: 99,
      commandName: "nginx",
    });
  });

  it("returns null for non-listen lines", () => {
    expect(parseLsofListenLine("something else")).toBeNull();
  });
});

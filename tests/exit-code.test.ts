import { describe, expect, it } from "vitest";

import type { PortOutcome } from "../src/types.js";
import { aggregateExitCode } from "../src/utils/exit-code.js";

describe("aggregateExitCode", () => {
  it("returns 0 for empty", () => {
    expect(aggregateExitCode([])).toBe(0);
  });

  it("returns 2 when every port has no process", () => {
    const outcomes: PortOutcome[] = [
      { kind: "notFound", port: 3000 },
      { kind: "notFound", port: 8080 },
    ];
    expect(aggregateExitCode(outcomes)).toBe(2);
  });

  it("returns 0 when mixed notFound and killed", () => {
    const outcomes: PortOutcome[] = [
      { kind: "notFound", port: 3000 },
      { kind: "killed", port: 8080, pid: 1, commandName: "node" },
    ];
    expect(aggregateExitCode(outcomes)).toBe(0);
  });

  it("returns 3 on permission denied", () => {
    const outcomes: PortOutcome[] = [
      { kind: "notFound", port: 3000 },
      { kind: "permissionDenied", port: 8080 },
    ];
    expect(aggregateExitCode(outcomes)).toBe(3);
  });

  it("returns 1 on error", () => {
    const outcomes: PortOutcome[] = [{ kind: "error", port: 3000, message: "oops" }];
    expect(aggregateExitCode(outcomes)).toBe(1);
  });

  it("prefers 3 over 1", () => {
    const outcomes: PortOutcome[] = [
      { kind: "error", port: 3000, message: "oops" },
      { kind: "permissionDenied", port: 8080 },
    ];
    expect(aggregateExitCode(outcomes)).toBe(3);
  });
});

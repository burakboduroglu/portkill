import { describe, expect, it } from "vitest";

import { formatOutcomeLine } from "../src/utils/output.js";

describe("formatOutcomeLine", () => {
  it("formats PRD examples", () => {
    expect(formatOutcomeLine({ kind: "killed", port: 3000, pid: 12345, commandName: "node" })).toBe(
      "✔ Port 3000 → killed (node, PID 12345)",
    );
    expect(formatOutcomeLine({ kind: "notFound", port: 8080 })).toBe("ℹ Port 8080 → no process found");
    expect(formatOutcomeLine({ kind: "permissionDenied", port: 5432 })).toBe(
      "✖ Port 5432 → permission denied (try with sudo)",
    );
  });
});

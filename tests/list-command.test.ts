import { beforeEach, describe, expect, it, vi } from "vitest";

import { runList } from "../src/commands/list.js";
import * as lister from "../src/core/lister.js";

vi.mock("../src/core/lister.js");

describe("runList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prints rows when listeners exist", async () => {
    vi.spyOn(lister, "listAllTcpListeners").mockResolvedValue({
      ok: true,
      rows: [
        { port: 3000, pid: 1, commandName: "node" },
        { port: 8080, pid: 2, commandName: "nginx" },
      ],
    });
    const r = await runList({ platform: "darwin", verbose: false });
    expect(r.exitCode).toBe(0);
    expect(r.lines).toHaveLength(2);
    expect(r.lines.join("\n")).toContain("3000");
    expect(r.lines.join("\n")).toContain("node");
  });

  it("prints info when empty", async () => {
    vi.spyOn(lister, "listAllTcpListeners").mockResolvedValue({ ok: true, rows: [] });
    const r = await runList({ platform: "darwin", verbose: false });
    expect(r.exitCode).toBe(0);
    expect(r.lines[0]).toContain("No TCP listeners");
  });

  it("returns error when lister fails", async () => {
    vi.spyOn(lister, "listAllTcpListeners").mockResolvedValue({
      ok: false,
      message: "lsof failed",
    });
    const r = await runList({ platform: "darwin", verbose: false });
    expect(r.exitCode).toBe(1);
    expect(r.lines[0]).toContain("lsof failed");
  });
});

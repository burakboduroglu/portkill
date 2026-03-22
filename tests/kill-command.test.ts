import { beforeEach, describe, expect, it, vi } from "vitest";

import { runKill } from "../src/commands/kill.js";
import * as finder from "../src/core/finder.js";

vi.mock("../src/core/finder.js");

const baseOpts = {
  ports: [3000],
  dryRun: false,
  force: true,
  verbose: false,
  signal: "SIGTERM" as const,
  platform: "darwin" as const,
};

describe("runKill", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns notFound when no listeners", async () => {
    vi.spyOn(finder, "findListeners").mockResolvedValue({ ok: true, processes: [] });
    const r = await runKill({ ...baseOpts });
    expect(r.exitCode).toBe(2);
    expect(r.lines.join("\n")).toContain("no process found");
  });

  it("returns error when finder fails", async () => {
    vi.spyOn(finder, "findListeners").mockResolvedValue({
      ok: false,
      message: "lsof missing",
    });
    const r = await runKill({ ...baseOpts });
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("lsof missing");
  });

  it("dry-run does not call kill", async () => {
    vi.spyOn(finder, "findListeners").mockResolvedValue({
      ok: true,
      processes: [{ pid: 42, commandName: "node" }],
    });
    const killFn = vi.fn();
    const r = await runKill({ ...baseOpts, dryRun: true, killFn });
    expect(killFn).not.toHaveBeenCalled();
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toContain("dry-run");
  });

  it("kills with force and no TTY prompt", async () => {
    vi.spyOn(finder, "findListeners").mockResolvedValue({
      ok: true,
      processes: [{ pid: 99, commandName: "node" }],
    });
    const killFn = vi.fn();
    const r = await runKill({ ...baseOpts, force: true, killFn });
    expect(killFn).toHaveBeenCalledWith(99, "SIGTERM");
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toContain("killed");
  });

  it("maps non-permission kill failure to error outcome", async () => {
    vi.spyOn(finder, "findListeners").mockResolvedValue({
      ok: true,
      processes: [{ pid: 1, commandName: "x" }],
    });
    const killFn = vi.fn(() => {
      throw new Error("boom");
    });
    const r = await runKill({ ...baseOpts, killFn });
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("failed to send signal");
  });

  it("maps EPERM to permissionDenied", async () => {
    vi.spyOn(finder, "findListeners").mockResolvedValue({
      ok: true,
      processes: [{ pid: 1, commandName: "rooty" }],
    });
    const killFn = vi.fn(() => {
      const e = new Error("nope");
      (e as NodeJS.ErrnoException).code = "EPERM";
      throw e;
    });
    const r = await runKill({ ...baseOpts, killFn });
    expect(r.exitCode).toBe(3);
    expect(r.lines.join("\n")).toContain("permission denied");
  });

  it("uses numeric signal from string", async () => {
    vi.spyOn(finder, "findListeners").mockResolvedValue({
      ok: true,
      processes: [{ pid: 7, commandName: "x" }],
    });
    const killFn = vi.fn();
    await runKill({ ...baseOpts, signal: "9", killFn });
    expect(killFn).toHaveBeenCalledWith(7, 9);
  });
});

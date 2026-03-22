import { describe, expect, it, vi } from "vitest";

import { findListeners, type ExecFile } from "../src/core/finder.js";

describe("findListeners", () => {
  it("parses lsof table output", async () => {
    const stdout = `COMMAND   PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    12345 user   21u  IPv6 0x1234567890      0t0  TCP *:3000 (LISTEN)
`;
    const execFile: ExecFile = vi.fn(async () => ({ stdout, stderr: "" }));
    const res = await findListeners(3000, "darwin", { execFile });
    expect(res).toEqual({
      ok: true,
      processes: [{ pid: 12345, commandName: "node" }],
    });
  });

  it("returns empty when lsof exits 1 (no matches)", async () => {
    const err = new Error("lsof");
    (err as NodeJS.ErrnoException).code = 1;
    const execFile: ExecFile = vi.fn(async () => {
      throw err;
    });
    const res = await findListeners(3000, "darwin", { execFile });
    expect(res).toEqual({ ok: true, processes: [] });
  });

  it("uses fuser on linux when lsof is missing", async () => {
    const enoent = new Error("nope");
    (enoent as NodeJS.ErrnoException).code = "ENOENT";
    const execFile: ExecFile = vi.fn(async (file) => {
      if (file === "lsof") throw enoent;
      if (file === "fuser") {
        return { stdout: "", stderr: "3000/tcp:            999\n" };
      }
      throw new Error(`unexpected ${file}`);
    });
    const res = await findListeners(3000, "linux", { execFile });
    expect(res).toEqual({ ok: true, processes: [{ pid: 999, commandName: null }] });
  });
});

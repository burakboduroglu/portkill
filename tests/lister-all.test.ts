import { describe, expect, it, vi } from "vitest";

import type { ExecFile } from "../src/core/finder.js";
import { listAllTcpListeners } from "../src/core/lister.js";

describe("listAllTcpListeners", () => {
  it("parses multiple lsof lines and dedupes port+pid", async () => {
    const stdout = `COMMAND   PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    100 user   21u  IPv6 0x1      0t0  TCP *:3000 (LISTEN)
node    100 user   22u  IPv6 0x2      0t0  TCP *:3000 (LISTEN)
nginx    50 root    6u  IPv4 0x3      0t0  TCP *:80 (LISTEN)
`;
    const execFile = vi.fn(async () => ({ stdout, stderr: "" })) as unknown as ExecFile;
    const res = await listAllTcpListeners("darwin", { execFile });
    expect(res).toEqual({
      ok: true,
      rows: [
        { port: 80, pid: 50, commandName: "nginx" },
        { port: 3000, pid: 100, commandName: "node" },
      ],
    });
  });

  it("returns empty on lsof exit 1", async () => {
    const err = new Error("none");
    (err as NodeJS.ErrnoException).code = 1;
    const execFile = vi.fn(async () => {
      throw err;
    }) as unknown as ExecFile;
    const res = await listAllTcpListeners("darwin", { execFile });
    expect(res).toEqual({ ok: true, rows: [] });
  });

  it("returns error when lsof is missing", async () => {
    const err = new Error("nope");
    (err as NodeJS.ErrnoException).code = "ENOENT";
    const execFile = vi.fn(async () => {
      throw err;
    }) as unknown as ExecFile;
    const res = await listAllTcpListeners("darwin", { execFile });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.message).toContain("lsof");
  });
});

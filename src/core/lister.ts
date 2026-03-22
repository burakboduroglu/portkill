import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { SupportedPlatform } from "../utils/platform.js";
import type { ExecFile } from "./finder.js";

const execFileAsync = promisify(execFile);

const defaultExecFile: ExecFile = (file, args, options) =>
  execFileAsync(file, args, options) as Promise<{ stdout: string; stderr: string }>;

export interface TcpListenerRow {
  port: number;
  pid: number;
  commandName: string;
}

/** Parse one `lsof -nP -iTCP -sTCP:LISTEN` output line. */
export function parseLsofListenLine(line: string): TcpListenerRow | null {
  if (!line.includes("(LISTEN)") || !line.includes("TCP")) return null;
  const portMatch = line.match(/TCP .+:(\d+) \(LISTEN\)/);
  if (!portMatch?.[1]) return null;
  const port = Number.parseInt(portMatch[1], 10);
  if (!Number.isFinite(port)) return null;
  const head = line.match(/^(\S+)\s+(\d+)\s+/);
  if (!head?.[1] || !head[2]) return null;
  const pid = Number.parseInt(head[2], 10);
  if (!Number.isFinite(pid)) return null;
  return { port, pid, commandName: head[1] };
}

export interface ListListenersOptions {
  execFile?: ExecFile;
}

export async function listAllTcpListeners(
  _platform: SupportedPlatform,
  options: ListListenersOptions = {},
): Promise<{ ok: true; rows: TcpListenerRow[] } | { ok: false; message: string }> {
  const execFileFn = options.execFile ?? defaultExecFile;
  try {
    const { stdout } = await execFileFn("lsof", ["-nP", "-iTCP", "-sTCP:LISTEN"], { encoding: "utf8" });
    const seen = new Set<string>();
    const rows: TcpListenerRow[] = [];
    for (const line of stdout.split(/\r?\n/)) {
      const row = parseLsofListenLine(line);
      if (!row) continue;
      const key = `${row.port}\0${row.pid}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(row);
    }
    rows.sort((a, b) => a.port - b.port || a.pid - b.pid);
    return { ok: true, rows };
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : undefined;
    if (code === 1) {
      return { ok: true, rows: [] };
    }
    return {
      ok: false,
      message:
        "Could not list listeners (`lsof` failed or is missing). Install `lsof` or check PATH.",
    };
  }
}

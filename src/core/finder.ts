import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { SupportedPlatform } from "../utils/platform.js";
import type { ListenerProcess } from "../types.js";

const execFileAsync = promisify(execFile);

export type ExecFile = (
  file: string,
  args: readonly string[],
  options: { encoding: "utf8" },
) => Promise<{ stdout: string; stderr: string }>;

const defaultExecFile: ExecFile = (file, args, options) =>
  execFileAsync(file, args, options) as Promise<{ stdout: string; stderr: string }>;

function parseLsofListenTable(stdout: string): ListenerProcess[] {
  const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const dataLines = lines[0]?.startsWith("COMMAND") ? lines.slice(1) : lines;
  const byPid = new Map<number, ListenerProcess>();

  for (const line of dataLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0] ?? null;
    const pidRaw = parts[1];
    const pid = pidRaw ? Number.parseInt(pidRaw, 10) : Number.NaN;
    if (!Number.isFinite(pid)) continue;
    if (!byPid.has(pid)) {
      byPid.set(pid, { pid, commandName: commandName ?? null });
    }
  }

  return [...byPid.values()].sort((a, b) => a.pid - b.pid);
}

function parseFuserCombined(output: string): number[] {
  const colonIdx = output.indexOf(":");
  const tail = colonIdx >= 0 ? output.slice(colonIdx + 1) : output;
  const pids = tail
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number.parseInt(s, 10))
    .filter((n) => Number.isFinite(n));
  return [...new Set(pids)].sort((a, b) => a - b);
}

async function findWithLsof(
  port: number,
  execFileFn: ExecFile,
): Promise<ListenerProcess[] | "empty" | "error"> {
  try {
    const { stdout } = await execFileFn("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"], {
      encoding: "utf8",
    });
    const list = parseLsofListenTable(stdout);
    return list.length === 0 ? "empty" : list;
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : undefined;
    if (code === 1) {
      return "empty";
    }
    if (code === "ENOENT") {
      return "error";
    }
    return "error";
  }
}

async function findWithFuser(port: number, execFileFn: ExecFile): Promise<ListenerProcess[] | "empty" | "error"> {
  try {
    const { stdout, stderr } = await execFileFn("fuser", ["-n", "tcp", String(port)], {
      encoding: "utf8",
    });
    const combined = `${stdout}\n${stderr}`;
    const pids = parseFuserCombined(combined);
    if (pids.length === 0) return "empty";
    return pids.map((pid) => ({ pid, commandName: null }));
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : undefined;
    if (code === 1) return "empty";
    if (code === "ENOENT") return "error";
    return "error";
  }
}

export interface FindListenersOptions {
  execFile?: ExecFile;
}

export async function findListeners(
  port: number,
  platform: SupportedPlatform,
  options: FindListenersOptions = {},
): Promise<{ ok: true; processes: ListenerProcess[] } | { ok: false; message: string }> {
  const execFileFn = options.execFile ?? defaultExecFile;

  const lsofResult = await findWithLsof(port, execFileFn);
  if (Array.isArray(lsofResult)) {
    return { ok: true, processes: lsofResult };
  }
  if (lsofResult === "empty") {
    return { ok: true, processes: [] };
  }

  if (platform === "linux") {
    const fuserResult = await findWithFuser(port, execFileFn);
    if (Array.isArray(fuserResult)) {
      return { ok: true, processes: fuserResult };
    }
    if (fuserResult === "empty") {
      return { ok: true, processes: [] };
    }
  }

  return {
    ok: false,
    message:
      platform === "linux"
        ? "Could not list listeners (install `lsof` or `fuser`, or check PATH)."
        : "Could not list listeners (`lsof` failed or is missing).",
  };
}

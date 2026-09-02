import process from "node:process";

import { execErrorCode } from "../utils/exec-error.js";

export type KillFn = (pid: number, signal?: NodeJS.Signals | number) => void;

const defaultKill: KillFn = (pid, signal) => {
  process.kill(pid, signal);
};

export type KillResult = { ok: true } | { ok: false; permissionDenied: boolean };

export function killPid(
  pid: number,
  signal: NodeJS.Signals | number = "SIGTERM",
  killFn: KillFn = defaultKill,
): KillResult {
  try {
    killFn(pid, signal);
    return { ok: true };
  } catch (err) {
    const code = String(execErrorCode(err) ?? "");
    if (code === "EPERM") {
      return { ok: false, permissionDenied: true };
    }
    if (code === "ESRCH") {
      return { ok: true };
    }
    return { ok: false, permissionDenied: false };
  }
}

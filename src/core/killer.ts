import process from "node:process";

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
    const code = err && typeof err === "object" && "code" in err ? String((err as NodeJS.ErrnoException).code) : "";
    if (code === "EPERM") {
      return { ok: false, permissionDenied: true };
    }
    if (code === "ESRCH") {
      return { ok: true };
    }
    return { ok: false, permissionDenied: false };
  }
}

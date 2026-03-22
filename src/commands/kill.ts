import * as readline from "node:readline/promises";
import process from "node:process";

import { findListeners } from "../core/finder.js";
import { killPid, type KillFn } from "../core/killer.js";
import type { ListenerProcess, PortOutcome } from "../types.js";
import { aggregateExitCode } from "../utils/exit-code.js";
import { formatOutcomeLine } from "../utils/output.js";
import type { SupportedPlatform } from "../utils/platform.js";

export interface KillCommandOptions {
  ports: number[];
  dryRun: boolean;
  force: boolean;
  verbose: boolean;
  signal: string | NodeJS.Signals | number;
  platform: SupportedPlatform;
  killFn?: KillFn;
}

function logVerbose(verbose: boolean, message: string): void {
  if (verbose) {
    process.stderr.write(`[verbose] ${message}\n`);
  }
}

async function confirmKill(summary: string): Promise<boolean> {
  if (!process.stdin.isTTY) {
    return false;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(`${summary} [y/N] `)).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

function normalizeSignal(signal: string | NodeJS.Signals | number): NodeJS.Signals | number {
  if (typeof signal === "number") return signal;
  if (typeof signal !== "string") return signal;
  const n = Number.parseInt(signal, 10);
  if (Number.isFinite(n)) return n;
  return signal as NodeJS.Signals;
}

type Phase =
  | { kind: "resolved"; outcome: PortOutcome }
  | { kind: "pendingKill"; port: number; processes: ListenerProcess[] };

export async function runKill(opts: KillCommandOptions): Promise<{ exitCode: number; lines: string[] }> {
  const signal = normalizeSignal(opts.signal);
  const phases: Phase[] = [];

  for (const port of opts.ports) {
    logVerbose(opts.verbose, `finding listeners on TCP ${port}`);
    const found = await findListeners(port, opts.platform);
    if (!found.ok) {
      phases.push({ kind: "resolved", outcome: { kind: "error", port, message: found.message } });
      continue;
    }
    if (found.processes.length === 0) {
      phases.push({ kind: "resolved", outcome: { kind: "notFound", port } });
      continue;
    }
    phases.push({ kind: "pendingKill", port, processes: found.processes });
  }

  const pending = phases.filter((p): p is Extract<Phase, { kind: "pendingKill" }> => p.kind === "pendingKill");

  const describe = (port: number, processes: ListenerProcess[]) => {
    const first = processes[0];
    const extra = processes.length > 1 ? ` (+${processes.length - 1} more)` : "";
    const name = first?.commandName ?? "unknown";
    const pid = first?.pid ?? 0;
    return `port ${port}: ${name} (PID ${pid})${extra}`;
  };

  if (!opts.dryRun && pending.length > 0 && !opts.force) {
    if (!process.stdin.isTTY) {
      process.stderr.write("Not a TTY: use --force to kill without confirmation, or use --dry-run.\n");
      return { exitCode: 1, lines: [] };
    }
    const lines = pending.map((p) => describe(p.port, p.processes));
    const summary = `Kill process(es)?\n${lines.map((l) => `  - ${l}`).join("\n")}\n`;
    const ok = await confirmKill(summary);
    if (!ok) {
      process.stderr.write("Aborted.\n");
      return { exitCode: 1, lines: [] };
    }
  }

  const outcomes: PortOutcome[] = [];

  for (const phase of phases) {
    if (phase.kind === "resolved") {
      outcomes.push(phase.outcome);
      continue;
    }

    const { port, processes } = phase;
    const display = processes[0];
    const displayPid = display?.pid ?? 0;
    const displayName = display?.commandName ?? null;

    if (opts.dryRun) {
      outcomes.push({
        kind: "dryRunWouldKill",
        port,
        pid: displayPid,
        commandName: displayName,
      });
      continue;
    }

    let denied = false;
    let otherError = false;
    for (const proc of processes) {
      logVerbose(opts.verbose, `sending ${String(signal)} to PID ${proc.pid}`);
      const result = killPid(proc.pid, signal, opts.killFn);
      if (!result.ok) {
        if (result.permissionDenied) denied = true;
        else otherError = true;
      }
    }

    if (denied) {
      outcomes.push({ kind: "permissionDenied", port });
    } else if (otherError) {
      outcomes.push({
        kind: "error",
        port,
        message: "failed to send signal to one or more processes",
      });
    } else {
      outcomes.push({
        kind: "killed",
        port,
        pid: displayPid,
        commandName: displayName,
      });
    }
  }

  const lines = outcomes.map(formatOutcomeLine);
  const exitCode = aggregateExitCode(outcomes);
  return { exitCode, lines };
}

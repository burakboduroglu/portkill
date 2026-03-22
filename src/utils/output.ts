import type { PortOutcome } from "../types.js";

export function formatOutcomeLine(outcome: PortOutcome): string {
  switch (outcome.kind) {
    case "notFound":
      return `ℹ Port ${outcome.port} → no process found`;
    case "killed":
      return `✔ Port ${outcome.port} → killed (${outcome.commandName ?? "unknown"}, PID ${outcome.pid})`;
    case "dryRunWouldKill":
      return `ℹ Port ${outcome.port} → ${outcome.commandName ?? "unknown"} (PID ${outcome.pid}) — dry-run (no signal sent)`;
    case "permissionDenied":
      return `✖ Port ${outcome.port} → permission denied (try with sudo)`;
    case "error":
      return `✖ Port ${outcome.port} → ${outcome.message}`;
    default: {
      const _exhaustive: never = outcome;
      return _exhaustive;
    }
  }
}

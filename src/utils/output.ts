import type { PortOutcome } from "../types.js";
import { style } from "./style.js";

export function formatOutcomeLine(outcome: PortOutcome): string {
  switch (outcome.kind) {
    case "notFound":
      return style.info(`ℹ Port ${outcome.port} → no process found`);
    case "killed":
      return style.success(
        `✔ Port ${outcome.port} → killed (${outcome.commandName ?? "unknown"}, PID ${outcome.pid})`,
      );
    case "dryRunWouldKill":
      return style.info(
        `ℹ Port ${outcome.port} → ${outcome.commandName ?? "unknown"} (PID ${outcome.pid}) — dry-run (no signal sent)`,
      );
    case "permissionDenied":
      return style.error(`✖ Port ${outcome.port} → permission denied (try with sudo)`);
    case "error":
      return style.error(`✖ Port ${outcome.port} → ${outcome.message}`);
    default: {
      const _exhaustive: never = outcome;
      return _exhaustive;
    }
  }
}

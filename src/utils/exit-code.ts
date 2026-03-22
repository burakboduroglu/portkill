import type { PortOutcome } from "../types.js";

/** Priority: permission (3) > general error (1) > no process (2) > success (0). */
export function aggregateExitCode(outcomes: PortOutcome[]): number {
  if (outcomes.length === 0) return 0;
  if (outcomes.some((o) => o.kind === "permissionDenied")) return 3;
  if (outcomes.some((o) => o.kind === "error")) return 1;
  if (outcomes.every((o) => o.kind === "notFound")) return 2;
  return 0;
}

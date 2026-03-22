export type PortOutcome =
  | { kind: "notFound"; port: number }
  | { kind: "killed"; port: number; pid: number; commandName: string | null }
  | { kind: "dryRunWouldKill"; port: number; pid: number; commandName: string | null }
  | { kind: "permissionDenied"; port: number }
  | { kind: "error"; port: number; message: string };

export interface ListenerProcess {
  pid: number;
  commandName: string | null;
}

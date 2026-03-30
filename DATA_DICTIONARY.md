# DATA_DICTIONARY — portkill

This document defines concepts, fields, and HTTP API payloads for the **`--gui`** server, plus CLI-related types. PRD: [PRD.md](./PRD.md).

---

## 1. CLI inputs

| Field | Type | Validation | Description |
| --- | --- | --- | --- |
| `ports` | `number[]` | Each value integer 1–65535 | Expanded from positional args: single `3000` or inclusive range `3000-3005` (max 4096 ports per range); deduped in order. |
| `force` | `boolean` | — | `--force` / `-f`. |
| `dryRun` | `boolean` | — | `--dry-run` / `-n`. |
| `signal` | `string` | Signal name or number accepted by Node/OS | `--signal` / `-s`; default `SIGTERM`. |
| `verbose` | `boolean` | — | `--verbose` / `-v`. |

---

## 2. Platform

| Field | Type | Values | Description |
| --- | --- | --- | --- |
| `platformId` | `string` | `darwin`, `linux` | From `process.platform`; other values unsupported (clear error). |

---

## 3. Process / port discovery (internal model)

| Field | Type | Description |
| --- | --- | --- |
| `port` | `number` | Target TCP port. |
| `pid` | `number` | Process ID; multiple listeners on one port possible (list). |
| `commandName` | `string \| null` | Short command name if known (e.g. `node`), derived from `lsof`/`ps`. |

**Note:** If several processes listen on the same port, `findListeners` returns all of them. The CLI kills each PID; the **stdout success/dry-run line** shows the **first** listener’s `pid` / `commandName` (confirmation prompt lists all, with `+N more` when needed). See `src/types.ts` (`PortOutcome`) and `src/commands/kill.ts`.

---

## 4. Per-port outcome (`PortOutcome`)

Suggested machine-facing discriminant for one port:

| `kind` | Meaning | CLI line (PRD §5.2) | Exit contribution |
| --- | --- | --- | --- |
| `killed` | Kill succeeded | `✔ Port … → killed (name, PID …)` | Success |
| `dryRunWouldKill` | Dry-run; process existed | Same info, no signal sent (wording in implementation) | Success |
| `notFound` | No listener | `ℹ Port … → no process found` | Count toward `2` |
| `permissionDenied` | `kill` / EPERM, etc. | `✖ Port … → permission denied (try with sudo)` | `3` |
| `error` | Unexpected failure | Appropriate error line | `1` |

Concrete fields match **`src/types.ts`**: e.g. `killed` / `dryRunWouldKill` carry `pid` and `commandName`; `error` carries `message`. There is no `pids[]` on `PortOutcome` — multiple listeners are handled in the kill command loop, but the reported line uses the first process for display.

---

## 5. Exit code (`ExitCode`)

| Constant | Value | Condition (PRD §5.4) |
| --- | --- | --- |
| `SUCCESS` | `0` | Run finished; all ports handled per PRD. |
| `GENERAL_ERROR` | `1` | Invalid args, internal error, unknown failure. |
| `NO_PROCESS_FOUND` | `2` | No process on any requested port (all empty). |
| `PERMISSION_DENIED` | `3` | At least one permission error. |

**Aggregation:** Same as `aggregateExitCode` in `src/utils/exit-code.ts`: permission (`3`) > any `error` outcome (`1`) > all ports `notFound` (`2`) > else success (`0`).

---

## 6. External command interfaces (reference)

Aligned with **`src/core/finder.ts`** (not an exhaustive shell guide):

| Step | Command | Expected use |
| --- | --- | --- |
| Primary (all platforms) | `lsof -nP -iTCP:<port> -sTCP:LISTEN` | Parse listen table → `ListenerProcess[]` (command name + PID). |
| Linux fallback if `lsof` fails | `fuser -n tcp <port>` | Combine stdout/stderr → PID list (`commandName` unknown). |

Raw stdout/stderr are not part of the persistent model; only `finder` / `lister` parse them.

---

## 7. HTTP API (local GUI, `portkill --gui`)

Served only when **`portkill --gui`** is running. Server binds **loopback** (`127.0.0.1` / `::1`). `/api/*` responses may include CORS headers so browser tabs using `localhost` vs `127.0.0.1` both work — the server is still not exposed off-loopback (see [security-notes.md](./docs/security-notes.md)).

### 7.1 `GET /api/listeners`

| Response | Description |
| --- | --- |
| `{ ok: true, rows: TcpListenerRow[] }` | Same shape as `listAllTcpListeners` (`port`, `pid`, `commandName`). |
| `{ ok: false, message: string }` | e.g. `lsof` missing. |

### 7.2 `POST /api/resolve`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tokens` | `string[]` | yes | Port args as strings (`"3000"`, `"3000-3005"`); parsed with `parsePortArguments`. |
| `dryRun` | `boolean` | no | Default `false`. |
| `force` | `boolean` | no | Must be `true` for real kill from GUI (no TTY); UI confirms in browser first. |
| `signal` | `string` | no | Default `SIGTERM`. |

### 7.3 `POST /api/resolve` response

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `boolean` | `true` on success path. |
| `exitCode` | `number` | Same aggregation as CLI. |
| `outcomes` | `PortOutcome[]` | One object per port (§4). |

**Security:** Loopback only; no auth (local single-user). Max JSON body 64 KiB.

---

## 8. Versioning

| Field | Location | Description |
| --- | --- | --- |
| `version` | `package.json` | `--version` output; aligned with npm release. |

---

*Aligned with current PRD and `package.json` version; cross-check `src/types.ts` and `src/gui/server.ts` when changing APIs.*

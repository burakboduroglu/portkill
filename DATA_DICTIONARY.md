# DATA_DICTIONARY — portkill

This document defines concepts, fields, and (planned) API payloads used across the app. PRD: [PRD.md](./PRD.md).

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

**Note:** If multiple PIDs share a port, the PRD line format may collapse to one line or one line per process; pick one behavior in code and cover with tests.

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

Optional extra fields: `pids`, `commandName`, `message` (verbose or error detail).

---

## 5. Exit code (`ExitCode`)

| Constant | Value | Condition (PRD §5.4) |
| --- | --- | --- |
| `SUCCESS` | `0` | Run finished; all ports handled per PRD. |
| `GENERAL_ERROR` | `1` | Invalid args, internal error, unknown failure. |
| `NO_PROCESS_FOUND` | `2` | No process on any requested port (all empty). |
| `PERMISSION_DENIED` | `3` | At least one permission error. |

**Aggregation (recommended):** Priority `3` > `1` > `2` > `0`; when ports differ, the worst code wins (document the rule in README until PRD spells it out).

---

## 6. External command interfaces (reference)

| Platform | Command | Expected use |
| --- | --- | --- |
| macOS | `lsof -ti tcp:<port>` | PID list on stdout, one per line. |
| Linux | `fuser -n tcp <port> 2>/dev/null` or equivalent | PID list; parse per distro. |

Raw stdout/stderr from these commands are not part of the persistent model; only `finder` parses them.

---

## 7. HTTP API (local GUI, v0.4+)

Served only when running `portkill --gui`. Server binds **`127.0.0.1`** (random port unless fixed). No CORS needed (same origin).

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
| `version` | `package.json` | `--version` output; aligned with npm/Homebrew. |

---

*Last aligned with PRD 0.1.0 (2026-03-22).*

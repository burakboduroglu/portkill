# CLI reference

Stdout lines are colorized with **chalk** when supported. Set `NO_COLOR=1` to disable.

## Usage

```bash
portkill <port> [port2] [range] ...
```

Each argument is either a single TCP port (`3000`) or an **inclusive range** (`3000-3005`). Ranges are capped at **4096** ports per token. Duplicates are dropped (first occurrence wins).

## Options

| Long             | Short             | Description                                                      |
| ---------------- | ----------------- | ---------------------------------------------------------------- |
| `--force`        | `-f`              | Kill without confirmation                                        |
| `--dry-run`      | `-n`              | Show targets only; do not send signals                           |
| `--signal <SIG>` | `-s`              | Signal (default: SIGTERM)                                        |
| `--verbose`      | `-v`              | Verbose stderr logs                                              |
| `--list`         | `-l`              | List all TCP listeners (uses `lsof`; do not pass ports)          |
| `--gui`          | —                 | Open local web UI on `127.0.0.1` (do not pass ports or `--list`) |
| `--version`      | `-V`, `--version` | Print version                                                    |
| `--help`         | `-h`              | Help                                                             |

## Sample output

```
✔ Port 3000 → killed (node, PID 12345)
ℹ Port 8080 → no process found
✖ Port 5432 → permission denied (try with sudo)
```

## Exit codes

| Code | Meaning                                                          |
| ---- | ---------------------------------------------------------------- |
| `0`  | All ports handled successfully                                   |
| `1`  | General error (invalid args, unexpected failure)                 |
| `2`  | No process found on any requested port                           |
| `3`  | Permission denied (e.g. another user’s process, privileged port) |

## Examples

```bash
portkill 3000
portkill 3000 8080
portkill 3000-3002
portkill 3000 --force
portkill 3000 --dry-run
portkill --list
portkill --gui
```

## Local GUI HTTP API

Served only while `portkill --gui` is running, on loopback (`127.0.0.1`, and
`::1` when available). `/api/*` carries permissive CORS so a tab on `localhost`
and one on `127.0.0.1` both work; that does not expose the server off loopback.
There is no authentication — see [SECURITY.md](../SECURITY.md). Request bodies
are capped at 64 KiB.

### `GET /api/listeners`

| Response                               | Description                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| `{ ok: true, rows: TcpListenerRow[] }` | `port`, `pid`, `commandName` — the same rows `--list` prints |
| `{ ok: false, message: string }`       | For example, `lsof` is missing                               |

### `POST /api/resolve`

| Field    | Type       | Required | Description                                                            |
| -------- | ---------- | -------- | ---------------------------------------------------------------------- |
| `tokens` | `string[]` | yes      | Port arguments as strings (`"3000"`, `"3000-3005"`)                    |
| `dryRun` | `boolean`  | no       | Default `false`                                                        |
| `force`  | `boolean`  | no       | Must be `true` to actually signal; there is no TTY, so the UI confirms |
| `signal` | `string`   | no       | Default `SIGTERM`                                                      |

| Response field | Type            | Description                     |
| -------------- | --------------- | ------------------------------- |
| `ok`           | `boolean`       | `true` on the success path      |
| `exitCode`     | `number`        | The same aggregation as the CLI |
| `outcomes`     | `PortOutcome[]` | One entry per port              |

`PortOutcome` is defined in `src/types.ts`; the kinds are `notFound`, `killed`,
`dryRunWouldKill`, `permissionDenied` and `error`.

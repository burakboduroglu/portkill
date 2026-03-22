# CLI reference

Same as [PRD.md](../PRD.md) §5; duplicated here for quick lookup.

Stdout lines are colorized with **chalk** when supported. Set `NO_COLOR=1` to disable.

## Usage

```bash
portkill <port> [port2] [range] ...
```

Each argument is either a single TCP port (`3000`) or an **inclusive range** (`3000-3005`). Ranges are capped at **4096** ports per token. Duplicates are dropped (first occurrence wins).

## Options

| Long | Short | Description |
| --- | --- | --- |
| `--force` | `-f` | Kill without confirmation |
| `--dry-run` | `-n` | Show targets only; do not send signals |
| `--signal <SIG>` | `-s` | Signal (default: SIGTERM) |
| `--verbose` | `-v` | Verbose stderr logs |
| `--list` | `-l` | List all TCP listeners (uses `lsof`; do not pass ports) |
| `--gui` | — | Open local web UI on `127.0.0.1` (do not pass ports or `--list`) |
| `--version` | `-V`, `--version` | Print version |
| `--help` | `-h` | Help |

## Sample output

```
✔ Port 3000 → killed (node, PID 12345)
ℹ Port 8080 → no process found
✖ Port 5432 → permission denied (try with sudo)
```

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | All ports handled successfully |
| `1` | General error (invalid args, unexpected failure) |
| `2` | No process found on any requested port |
| `3` | Permission denied (e.g. another user’s process, privileged port) |

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

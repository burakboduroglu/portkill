# CLI reference

Same as [PRD.md](../PRD.md) §5; duplicated here for quick lookup.

## Usage

```bash
portkill <port> [port2] [port3] ...
```

## Options

| Long | Short | Description |
| --- | --- | --- |
| `--force` | `-f` | Kill without confirmation |
| `--dry-run` | `-n` | Show targets only; do not send signals |
| `--signal <SIG>` | `-s` | Signal (default: SIGTERM) |
| `--verbose` | `-v` | Verbose stderr logs |
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
portkill 3000 --force
portkill 3000 --dry-run
```

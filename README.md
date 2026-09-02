<div align="center">

<img src="https://raw.githubusercontent.com/burakboduroglu/portkill/main/assets/portkill-logo.svg" alt="portkill logo" width="120">

# `.portkill`

**Free stuck TCP ports in one command — no `lsof` pipelines, no guessing PIDs.**

[**Install with Homebrew or npm →**](#install)

[![CI](https://img.shields.io/github/actions/workflow/status/burakboduroglu/portkill/ci.yml?branch=main&label=ci&style=flat-square)](https://github.com/burakboduroglu/portkill/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40burakboduroglu%2Fportkill?style=flat-square&logo=npm&label=npm)](https://www.npmjs.com/package/@burakboduroglu/portkill)
[![Release](https://img.shields.io/github/v/release/burakboduroglu/portkill?style=flat-square)](https://github.com/burakboduroglu/portkill/releases)
[![License](https://img.shields.io/github/license/burakboduroglu/portkill?style=flat-square)](https://github.com/burakboduroglu/portkill/blob/main/LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/burakboduroglu/portkill?style=flat-square)](https://github.com/burakboduroglu/portkill/commits)

![TypeScript](https://img.shields.io/badge/TypeScript-5-000?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-000?style=flat-square&logo=node.js)
![macOS](https://img.shields.io/badge/macOS-supported-000?style=flat-square&logo=apple)
![Linux](https://img.shields.io/badge/Linux-supported-000?style=flat-square&logo=linux&logoColor=white)
![Homebrew](https://img.shields.io/badge/Homebrew-tap-000?style=flat-square&logo=homebrew)
![Vitest](https://img.shields.io/badge/Vitest-tested-000?style=flat-square&logo=vitest)

</div>

---

Your dev server crashes, the port stays taken, and the next `npm run dev` greets you with `EADDRINUSE`. The fix is a pipeline you look up every time — `lsof -i :3000`, read the PID out of the table, `kill -9`, hope it was the right one.

`.portkill` is that pipeline as one command. It shows what owns the port, lets you preview before anything is signalled, and stops only what you meant to stop. Same logic from the terminal or from a local web UI.

> The name reads like **`.portkill`** — a small, local dev utility, `.env`-style prefix. The CLI binary is still `portkill`.

<div align="center">
  <img src="https://raw.githubusercontent.com/burakboduroglu/portkill/main/assets/demo.png" alt="portkill listing three TCP listeners, previewing two with --dry-run, then stopping the one on port 3000" width="760">
</div>

## What it is

Give it a port and it answers with the process that holds it, by name and PID. Give it several, or an inclusive range, and it walks them in order. Nothing is signalled until you confirm — or you pass `--dry-run` and nothing is signalled at all, so you can look first and decide after.

It sends `SIGTERM` by default, not `SIGKILL`, so a process gets the chance to shut down the way it wants to. It never escalates: if a listener belongs to another user, portkill says so and exits 3 rather than reaching for `sudo` on your behalf.

`portkill --gui` puts the same logic behind a small local web UI on loopback, for when a browser tab is closer to hand than a terminal.

## Highlights

|     | Feature                | How it works                                                                                                             |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 🔍  | **See before you act** | `--dry-run` resolves every port and prints what it would stop, without sending a single signal.                          |
| 🎯  | **Ports, not PIDs**    | `lsof` on both platforms, with `fuser` as the Linux fallback, so you never copy a PID out of a table again.              |
| 📚  | **Ranges**             | `portkill 9000-9002` expands inclusively, capped at 4096 ports per range token so a typo cannot expand into a fork bomb. |
| 🖥️  | **Local web UI**       | `--gui` serves the same resolve-and-kill logic on `127.0.0.1`, with a browser confirm. No Electron, no bundled runtime.  |
| 🧯  | **Polite by default**  | `SIGTERM` unless you ask otherwise, a confirmation prompt unless you pass `--force`, and never `sudo`.                   |
| 🚦  | **Scriptable**         | Exit codes distinguish success, nothing-found, and permission denied, so a shell script can branch on the outcome.       |
| 🎨  | **Readable output**    | Colour through chalk, and it steps aside for `NO_COLOR` or a non-TTY.                                                    |
| 🪶  | **Small**              | Roughly 1,500 lines of TypeScript with two runtime dependencies, published as a four-file tarball.                       |

## Install

**Homebrew** — [burakboduroglu/homebrew-portkill](https://github.com/burakboduroglu/homebrew-portkill)

```bash
brew install burakboduroglu/portkill/portkill
portkill --version
```

**npm** — [@burakboduroglu/portkill](https://www.npmjs.com/package/@burakboduroglu/portkill)

```bash
npm i -g @burakboduroglu/portkill
```

**No install at all**

```bash
npx @burakboduroglu/portkill --list
```

If Homebrew reports that `/opt/homebrew/bin/portkill` already exists, an older npm global install is in the way:

```bash
npm uninstall -g @burakboduroglu/portkill
brew link portkill
```

**From source**

```bash
git clone https://github.com/burakboduroglu/portkill.git && cd portkill
bun install && bun run build
bun link   # optional: puts `portkill` on PATH
```

## Quick start

```bash
# What is listening, everywhere?
portkill --list

# See what would happen — nothing is signalled
portkill 3000 8080 --dry-run

# Stop them (prompts unless --force)
portkill 3000 8080

# An inclusive range
portkill 9000-9002

# Something that will not die politely
portkill 3000 --signal SIGKILL

# The same logic in a browser tab
portkill --gui
```

## CLI reference

| Flag              | Meaning                                |
| ----------------- | -------------------------------------- |
| `-n`, `--dry-run` | Show targets only; do not send signals |
| `-f`, `--force`   | Skip the terminal confirmation         |
| `-s`, `--signal`  | Signal to send (default `SIGTERM`)     |
| `-l`, `--list`    | List all TCP listeners                 |
| `--gui`           | Open the local web UI                  |
| `-v`, `--verbose` | More detail on stderr                  |
| `-V`, `--version` | Print the version                      |

| Exit code | Meaning                                                          |
| --------- | ---------------------------------------------------------------- |
| `0`       | Every requested port was handled                                 |
| `1`       | General error — invalid arguments, unexpected failure            |
| `2`       | No process was listening on any requested port                   |
| `3`       | Permission denied — another user's process, or a privileged port |

Full reference: [docs/cli-reference.md](https://github.com/burakboduroglu/portkill/blob/main/docs/cli-reference.md).

## The local web UI

`portkill --gui` starts an HTTP server on loopback — `127.0.0.1`, and `::1` when it is available — prints the URL, and opens it. The page lists listeners, previews a kill, and asks the browser to confirm before it calls the API. **Ctrl+C** stops the server; nothing is left running behind you.

It has **no authentication**. It is bound to loopback, but while it runs, anything that can reach your loopback can call it. Treat it as local-only tooling and close it when you are done — [SECURITY.md](https://github.com/burakboduroglu/portkill/blob/main/SECURITY.md) is specific about what that means.

### Walkthrough

<div align="center">
  <a href="https://www.youtube.com/watch?v=_-Z6zwiEHmg" title="portkill --gui — watch on YouTube">
    <img src="https://img.youtube.com/vi/_-Z6zwiEHmg/hqdefault.jpg" alt="portkill --gui demo — click to watch on YouTube" width="560">
  </a>
  <br>
  <b><a href="https://www.youtube.com/watch?v=_-Z6zwiEHmg">Open on YouTube</a></b>
</div>

## How it works

Port arguments are matched against `^\d+$`, range-checked to 1–65535, expanded, and deduplicated before anything else happens — so what reaches the system is always a number.

Discovery runs `lsof -nP -iTCP:<port> -sTCP:LISTEN` through `execFile`, without a shell. On Linux, if `lsof` is missing, it falls back to `fuser -n tcp <port>`. `lsof` exiting 1 means "no matches", not failure, which is a distinction portkill makes rather than reporting an error you would have to interpret.

Stopping a listener is `process.kill(pid, signal)` — a syscall, not a shell command. `EPERM` becomes "permission denied" and exit 3. `ESRCH` means the process died between discovery and the signal, which is a success, not an error.

## Requirements

- **Node.js ≥ 18**
- **macOS** or **Linux**, with `lsof` available (`fuser` covers the Linux fallback)

## Project layout

```
src/
├─ index.ts              Commander wiring, flags, exit code
├─ commands/
│  ├─ kill.ts            Resolve ports → kill → outcomes
│  └─ list.ts            Every listener on the machine
├─ core/
│  ├─ finder.ts          lsof and fuser discovery for one port
│  ├─ lister.ts          One lsof pass for the whole table
│  └─ killer.ts          process.kill, EPERM and ESRCH handling
├─ gui/
│  ├─ server.ts          Loopback HTTP server and JSON API
│  ├─ index-html.ts      The single-page UI
│  └─ open-browser.ts    Opens the printed URL
└─ utils/                Port parsing, output, colour, exit codes, platform
```

`core/` never prints and never reads flags; it takes an injected `execFile` or `kill`, which is why the tests can cover it without touching a real process.

## Docs

| Doc                                                                                               | What it is                                                   |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [AGENTS](https://github.com/burakboduroglu/portkill/blob/main/AGENTS.md)                          | **Start here** — doc map for contributors and AI agents      |
| [Changelog](https://github.com/burakboduroglu/portkill/blob/main/CHANGELOG.md)                    | What changed in each release                                 |
| [PRD](https://github.com/burakboduroglu/portkill/blob/main/PRD.md)                                | Product requirements and shipped scope                       |
| [Implementation](https://github.com/burakboduroglu/portkill/blob/main/docs/implementation.md)     | Architecture and data flow                                   |
| [CLI reference](https://github.com/burakboduroglu/portkill/blob/main/docs/cli-reference.md)       | Every flag, exit code and outcome                            |
| [Testing strategy](https://github.com/burakboduroglu/portkill/blob/main/docs/testing-strategy.md) | Vitest mocks, coverage, test file map                        |
| [Data dictionary](https://github.com/burakboduroglu/portkill/blob/main/DATA_DICTIONARY.md)        | Types and GUI API shapes                                     |
| [Security policy](https://github.com/burakboduroglu/portkill/blob/main/SECURITY.md)               | What portkill touches, and private vulnerability reporting   |
| [Security notes](https://github.com/burakboduroglu/portkill/blob/main/docs/security-notes.md)     | GUI scope, dependency audit, published package contents      |
| [Release](https://github.com/burakboduroglu/portkill/blob/main/RELEASE.md)                        | Cutting a release: version, changelog, tag, Homebrew formula |
| [Contributing](https://github.com/burakboduroglu/portkill/blob/main/CONTRIBUTING.md)              | Fork, branch, tests, PR expectations                         |
| [Code of Conduct](https://github.com/burakboduroglu/portkill/blob/main/CODE_OF_CONDUCT.md)        | Community standards (Contributor Covenant 2.0)               |

## Development

```bash
bun install
bun run build
bun run test
bun run test:coverage
bun run lint
bun run typecheck
bun run format
```

CI runs the checks on every push and the suite across Node 18, 20 and 22 on both Linux and macOS. Terminal colour comes from [chalk](https://github.com/chalk/chalk); set `NO_COLOR=1` to turn it off ([no-color.org](https://no-color.org/)).

## Contributing

Bug reports and small, focused fixes are welcome. The tool is deliberately narrow — Windows support and long-running port monitors are out of scope — so open an issue before building anything substantial.

- [**Contributing guide**](https://github.com/burakboduroglu/portkill/blob/main/CONTRIBUTING.md) — setup, tests, commits, pull requests
- [**Code of Conduct**](https://github.com/burakboduroglu/portkill/blob/main/CODE_OF_CONDUCT.md) — how we treat each other here
- [**Security policy**](https://github.com/burakboduroglu/portkill/blob/main/SECURITY.md) — what the tool touches, and how to report a vulnerability privately

## License

MIT — see [LICENSE](https://github.com/burakboduroglu/portkill/blob/main/LICENSE).

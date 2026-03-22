# **`.portkill`**

**Free stuck TCP ports in one command** — without memorizing `lsof`, `fuser`, and `kill` pipelines.

[![npm](https://img.shields.io/npm/v/%40burakboduroglu%2Fportkill?style=flat-square&logo=npm&label=npm)](https://www.npmjs.com/package/@burakboduroglu/portkill)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/burakboduroglu/portkill/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D18-417E38?style=flat-square&logo=node.js&logoColor=white)](https://github.com/burakboduroglu/portkill/blob/main/package.json)

> The name reads like **`.portkill`** — a small, local dev utility (think `.env`-style prefix). The CLI binary is still `portkill`.

**Published on npm:** [`@burakboduroglu/portkill`](https://www.npmjs.com/package/@burakboduroglu/portkill) — install with `npm i -g @burakboduroglu/portkill` or `npx @burakboduroglu/portkill` (see [Install](#install)).

When Node or another stack prints `EADDRINUSE`, **`.portkill`** shows who owns the port, lets you **preview** (`--dry-run`), then stops only what you intend — or use the **local web UI** (`--gui` on loopback), same logic as the CLI.

---

## Why **`.portkill`**

| Instead of… | You get… |
| --- | --- |
| Copy-pasting `lsof` / `xargs` / `kill -9` | One tool, clear output, safe defaults |
| Guessing PIDs | Process name + PID per port |
| Accidentally nuking the wrong thing | `--dry-run` first; `--gui` with browser confirm |
| Another Electron app | Node only; `--gui` is a tiny HTTP server on **127.0.0.1** / **::1** |

---

## Install

Registry page: [npmjs.com/package/@burakboduroglu/portkill](https://www.npmjs.com/package/@burakboduroglu/portkill).

```bash
npm i -g @burakboduroglu/portkill
portkill --version
```

No global install:

```bash
npx @burakboduroglu/portkill --list
```

**From source**

```bash
git clone https://github.com/burakboduroglu/portkill.git && cd portkill
npm install && npm run build
npm link   # optional: puts `portkill` on PATH
```

---

## GUI demo

Introduction to **`portkill --gui`** (local web UI on loopback — list listeners, dry-run, kill with browser confirm):

**[Watch on YouTube](https://www.youtube.com/watch?v=_-Z6zwiEHmg)**

[![portkill --gui introduction (video)](https://img.youtube.com/vi/_-Z6zwiEHmg/hqdefault.jpg)](https://www.youtube.com/watch?v=_-Z6zwiEHmg)

---

## Quick start

```bash
# What is listening everywhere?
portkill --list

# See what would happen (no signals sent)
portkill 3000 8080 --dry-run

# Stop listeners on those ports (prompts unless --force)
portkill 3000 8080

# Range (inclusive, max 4096 ports per range token)
portkill 9000-9002

# Local web UI — same logic as the CLI
portkill --gui
```

Press **Ctrl+C** to stop the GUI server. The printed URL is loopback-only. **Video:** [GUI demo](#gui-demo).

---

## CLI flags (short)

| Flag | Meaning |
| --- | --- |
| `-n`, `--dry-run` | Show targets only; do not send signals |
| `-f`, `--force` | Skip the terminal confirmation |
| `-s`, `--signal` | Signal to send (default `SIGTERM`) |
| `-l`, `--list` | List all TCP listeners |
| `--gui` | Open the local web UI |
| `-v`, `--verbose` | More detail on stderr |

Full reference: [CLI reference](https://github.com/burakboduroglu/portkill/blob/main/docs/cli-reference.md) · Exit codes and outcomes: same doc.

---

## Requirements

- **Node.js ≥ 18**
- **macOS** or **Linux** — uses `lsof` (Linux may use `fuser` as fallback where applicable)

---

## Docs & product spec

| Doc | What it is |
| --- | --- |
| [PRD](https://github.com/burakboduroglu/portkill/blob/main/PRD.md) | Product requirements & shipped scope |
| [Implementation](https://github.com/burakboduroglu/portkill/blob/main/docs/implementation.md) | Architecture & data flow |
| [Data dictionary](https://github.com/burakboduroglu/portkill/blob/main/DATA_DICTIONARY.md) | Types, GUI API shapes |
| [Security notes](https://github.com/burakboduroglu/portkill/blob/main/docs/security-notes.md) | GUI scope, `npm audit`, reporting |
| [Release](https://github.com/burakboduroglu/portkill/blob/main/docs/RELEASE.md) | `npm publish` (2FA), tags, GitHub Release |

---

## Development

```bash
npm run build
npm test
npm run test:coverage
npm run lint
```

Terminal colors use [chalk](https://github.com/chalk/chalk); set `NO_COLOR=1` to disable ([no-color.org](https://no-color.org/)).

---

## License

MIT — see [LICENSE](https://github.com/burakboduroglu/portkill/blob/main/LICENSE).

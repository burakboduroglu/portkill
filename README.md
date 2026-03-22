# portkill

CLI to kill processes listening on given **TCP** ports. See [PRD.md](./PRD.md) for the full product spec.

## Requirements

- Node.js **≥ 18**
- macOS or Linux (`lsof`; on Linux, `fuser` as fallback if `lsof` is missing)

## Install

### From npm (after publish)

```bash
npm i -g portkill
portkill --version
```

Run without global install:

```bash
npx portkill --list
```

See [PRD.md](./PRD.md) §7 for release steps (`npm publish`, Homebrew tap).

### From source

```bash
npm install
npm run build
node dist/index.js --help
```

```bash
npm link
portkill --version
```

## Usage

```bash
portkill <port> [port2] ...
portkill 3000-3005
portkill 3000 8080 9000-9002 --dry-run
portkill --list
portkill --gui
portkill 3000 --force
```

### Web UI (`--gui`)

```bash
npm run build
node dist/index.js --gui
```

Opens a page on **127.0.0.1** (ephemeral port printed in the terminal). Use **Ctrl+C** to stop. The browser may open automatically (macOS `open`, Linux `xdg-open`).

Port arguments can be single numbers or **inclusive ranges** (`start-end`, max 4096 ports per range). Duplicates are removed while keeping order.

## Docs

| Document | Description |
| --- | --- |
| [docs/implementation.md](./docs/implementation.md) | Architecture, modules, data flow |
| [docs/cli-reference.md](./docs/cli-reference.md) | Flags, exit codes, examples |
| [DATA_DICTIONARY.md](./DATA_DICTIONARY.md) | Fields, outcomes, planned HTTP API |

Colors use [chalk](https://github.com/chalk/chalk); set `NO_COLOR=1` to disable (see [NO_COLOR](https://no-color.org/)).

## Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Bundle CLI with `tsup` |
| `npm test` | `vitest run` |
| `npm run test:coverage` | Vitest + v8 coverage (see `vitest.config.ts`; excludes `src/index.ts`, `src/types.ts`, `src/gui/**`) |
| `npm run lint` | ESLint |

## License

MIT

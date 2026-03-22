# portkill

CLI to kill processes listening on given **TCP** ports. See [PRD.md](./PRD.md) for the full product spec.

## Requirements

- Node.js **≥ 18**
- macOS or Linux (`lsof`; on Linux, `fuser` as fallback if `lsof` is missing)

## Install (from source)

```bash
npm install
npm run build
node dist/index.js --help
```

Link globally during development:

```bash
npm link
portkill --version
```

## Usage

```bash
portkill <port> [port2] ...
portkill --list
portkill 3000 --dry-run
portkill 3000 --force
```

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
| `npm run test:coverage` | Vitest + v8 coverage (see thresholds in `vitest.config.ts`; `src/index.ts` and `src/types.ts` excluded) |
| `npm run lint` | ESLint |

## License

MIT

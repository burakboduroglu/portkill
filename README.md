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
portkill 3000 --dry-run
portkill 3000 --force
```

## Docs

| Document | Description |
| --- | --- |
| [docs/implementation.md](./docs/implementation.md) | Architecture, modules, data flow |
| [docs/cli-reference.md](./docs/cli-reference.md) | Flags, exit codes, examples |
| [DATA_DICTIONARY.md](./DATA_DICTIONARY.md) | Fields, outcomes, planned HTTP API |

## Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Bundle CLI with `tsup` |
| `npm test` | `vitest run` |
| `npm run lint` | ESLint |

## License

MIT

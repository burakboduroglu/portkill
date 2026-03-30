# Agent & contributor context — start here

This file is the **single entry point** for humans and AI coding agents working on **portkill**. Read it first, then follow links depth-first as needed.

## What this project is

- **CLI:** `portkill` — kill processes listening on TCP ports (macOS/Linux), with `--dry-run`, ranges, `--list`, signals.
- **GUI:** `portkill --gui` — loopback-only web UI reusing the same core logic as the CLI.
- **Distribution:** npm package [`@burakboduroglu/portkill`](https://www.npmjs.com/package/@burakboduroglu/portkill). **No Windows** (out of scope).

## Source of truth (read order for new work)

| Order | Document | Purpose |
| --- | --- | --- |
| 1 | [PRD.md](PRD.md) | Product goals, CLI contract (§5), exit codes, out-of-scope, shipped capabilities |
| 2 | [DATA_DICTIONARY.md](DATA_DICTIONARY.md) | Types, `PortOutcome`, GUI HTTP API shapes |
| 3 | [docs/cli-reference.md](docs/cli-reference.md) | Flags and exit codes (quick reference) |
| 4 | [docs/implementation.md](docs/implementation.md) | Module map, mermaid diagram, data flow |
| 5 | [docs/testing-strategy.md](docs/testing-strategy.md) | Vitest layout, mocks, coverage expectation |

**Security / release:** [docs/security-notes.md](docs/security-notes.md) · [RELEASE.md](RELEASE.md)

**Human contribution process:** [CONTRIBUTING.md](CONTRIBUTING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Where code lives (see PRD §6.2)

- `src/index.ts` — Commander entry; dispatches kill / list / GUI.
- `src/commands/` — `kill.ts`, `list.ts`
- `src/core/` — `finder.ts`, `killer.ts`, `lister.ts`
- `src/utils/` — `parse-ports`, `platform`, `output`, `exit-code`, `style`
- `src/gui/` — HTTP server, embedded UI, browser open
- `tests/` — mirrors modules; see [docs/testing-strategy.md](docs/testing-strategy.md)

## Rules for agents

1. **Do not contradict the PRD.** If behavior should change, update PRD first (or in the same PR), then code.
2. **Do not add Windows-specific code.**
3. **Keep formatting out of `core/`** — terminal strings in `utils/output.ts` / `style.ts`; GUI in `gui/`.
4. **Follow** [.cursor/rules/workflow.mdc](.cursor/rules/workflow.mdc) for suggested implementation order.
5. **Tests:** mock `execFile` / shell at boundaries; see [docs/testing-strategy.md](docs/testing-strategy.md).
6. **Scoped rules:** [.cursor/rules/coding-style.mdc](.cursor/rules/coding-style.mdc) (`src/**/*.ts`), [.cursor/rules/testing.mdc](.cursor/rules/testing.mdc) (`tests/**/*.ts`).

## Quick commands

```bash
npm install && npm run build && npm test && npm run lint
```

---

*Last updated to align with repo layout and `package.json`.*

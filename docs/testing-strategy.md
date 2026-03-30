# Testing strategy (portkill)

Vitest is the test runner. **Goal:** keep `core/` honest with **mocked `child_process`**, and commands covered with **spies/mocks** on `finder` / `killer` where appropriate. PRD success criteria target **≥ 80% coverage on `src/`** excluding the thin CLI glue if measured that way — run `npm run test:coverage` locally.

## Layout

| Test file | Focus |
| --- | --- |
| `finder.test.ts` | `findListeners`; inject `ExecFile` mock; darwin table + linux `fuser` fallback |
| `killer.test.ts` | `killPid`, permission vs other errors |
| `lister.test.ts` / `lister-all.test.ts` | `listAllTcpListeners`, `lsof` LISTEN parsing |
| `parse-ports.test.ts` | Port args and inclusive ranges |
| `exit-code.test.ts` | `aggregateExitCode` priority (3 > 1 > 2 > 0) |
| `output.test.ts` | Line formatting |
| `platform.test.ts` | Unsupported platform errors |
| `kill-command.test.ts` | `runKill` with `vi.mock` / spy on `finder` |
| `list-command.test.ts` | `runList` |
| `gui-server.test.ts` | HTTP handlers on loopback (no real browser) |

## Mock patterns

### Injectable `ExecFile`

`finder` / `lister` accept `{ execFile }` options. In tests, pass `vi.fn()` returning fixed `{ stdout, stderr }` or throwing with `code` set — **do not** shell out to real `lsof` in unit tests unless you add a dedicated integration test (optional; can be flaky in CI).

### Command-level mocks

`kill-command.test.ts` uses `vi.mock("../src/core/finder.js")` and `vi.spyOn(finder, "findListeners")` to control outcomes without a real process on a port.

### Clear mocks between cases

Use `beforeEach(() => vi.clearAllMocks())` when spies are shared across examples.

## What to prioritize

1. **Permission vs not-found vs success** — exit code aggregation and PRD lines.
2. **Invalid args** — `parsePortArguments`, CLI early exit `1`.
3. **GUI API** — `gui-server.test.ts`: JSON bodies, loopback-only assumptions.

## What is out of scope for tests here

- **Windows** — unsupported; no Windows tests.
- **Long-running E2E** against real occupied ports — optional manual check; not required in CI by default.

## Related

- [docs/implementation.md](./implementation.md) — module responsibilities
- [DATA_DICTIONARY.md](../DATA_DICTIONARY.md) — outcome types
- [.cursor/rules/testing.mdc](../.cursor/rules/testing.mdc) — Cursor rule summary

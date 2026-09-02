# Contributing to portkill

Thanks for looking. portkill is a small CLI with a small surface: find what holds a TCP port, show it, stop it. The useful contributions are usually small too — a case `lsof` parsing gets wrong, a flag that behaves differently from the reference, a rough edge in the local web UI.

Before building anything substantial, open an issue and check the direction is wanted. **Windows support and long-running port monitors are out of scope.**

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Getting started

**Requirements:** Node.js ≥ 18 on macOS or Linux, and [bun](https://bun.com) for the toolchain.

```bash
git clone https://github.com/burakboduroglu/portkill.git
cd portkill
bun install
bun run build
node dist/index.js --list
```

| Command                 | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `bun run build`         | Bundles `src/index.ts` to `dist/index.js` (tsup) |
| `bun run test`          | Vitest, once                                     |
| `bun run test:watch`    | Vitest, watching                                 |
| `bun run test:coverage` | Vitest with the coverage thresholds enforced     |
| `bun run lint`          | eslint                                           |
| `bun run typecheck`     | `tsc --noEmit` — the build does not type-check   |
| `bun run format`        | Prettier, writing                                |

CI runs lint, types, formatting and the coverage gate once, then the suite across Node 18, 20 and 22 on Linux and macOS. Anything that fails there fails locally first.

## Where the code lives

```
src/
├─ index.ts     Commander wiring, flags, exit code
├─ commands/    kill.ts, list.ts — orchestration, no shell
├─ core/        finder.ts, lister.ts, killer.ts — the only shell and signal callers
├─ gui/         server.ts, index-html.ts, open-browser.ts
└─ utils/       parse-ports, output, style, exit-code, exec-error, platform
```

`core/` never prints and never reads flags. It takes an injected `execFile` or `kill`, which is what makes it testable — and what you should preserve when you change it.

## Tests

Vitest, with the shell mocked at the `core/` boundary. Pass a `vi.fn()` as `execFile` returning fixed `{ stdout, stderr }`, or throwing an error carrying a `code` — a number for a non-zero exit, a string for a failed spawn. Command-level tests mock `finder` instead. Nothing shells out to a real `lsof` and nothing signals a real process.

Add or update tests when behaviour changes. The coverage thresholds live in `vitest.config.ts` and are enforced in CI, so a change that adds an untested branch can fail on coverage even when every test passes.

Worth covering first: permission-denied versus not-found versus success, since that decides the exit code; invalid arguments; and the GUI API's JSON handling.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: expand inclusive port ranges
fix: handle an empty lsof line on Linux
docs: clarify that --gui has no authentication
chore: tooling, dependencies, release prep
```

Use the imperative mood, keep the subject under ~72 characters, and put the reasoning in the body when the change is not self-evident. No emoji.

## Pull requests

Branch from `main`, keep the change focused, and fill in the template. Say what changed, why, and how you verified it.

Update [`docs/cli-reference.md`](docs/cli-reference.md) when flags, exit codes or the GUI API change, and add a `CHANGELOG.md` entry under `Unreleased` for anything a user would notice. Keep CLI flags and exit codes backward compatible unless breaking them is the point of the change.

Do not commit secrets, tokens, or machine-specific paths.

## Reporting

- **Bugs and ideas:** [the issue tracker](https://github.com/burakboduroglu/portkill/issues)
- **Vulnerabilities:** privately, per [SECURITY.md](SECURITY.md) — never as a public issue

Thank you for contributing.

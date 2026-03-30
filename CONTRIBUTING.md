# Contributing to portkill

**Agents & doc map:** see **[AGENTS.md](AGENTS.md)** first (links PRD, implementation, testing strategy, and Cursor rules).

Thanks for helping improve **portkill** — a CLI plus a **local `--gui` web UI** (loopback) for freeing TCP ports on macOS and Linux.

Please read the **[Code of Conduct](CODE_OF_CONDUCT.md)** before participating.

## Table of Contents

- [What We’re Looking For](#what-were-looking-for)
- [Quick Start](#quick-start)
- [Pull Request Process](#pull-request-process)
- [Guidelines](#guidelines)

---

## What We’re Looking For

- **Bug reports** with steps to reproduce, OS, Node version, and `portkill --version`
- **Feature ideas** that fit the product scope in [PRD.md](PRD.md) (or propose a PRD update in the same PR)
- **Docs** fixes (README, `docs/`, [DATA_DICTIONARY.md](DATA_DICTIONARY.md) when types/APIs change, typos, clarity)
- **Code** that keeps CLI behavior, exit codes, and tests aligned with the PRD and [docs/cli-reference.md](docs/cli-reference.md)

Out of scope for this repo: Windows support and long-running port monitors (see PRD).

---

## Quick Start

**Requirements:** Node.js **≥ 18**

```bash
git clone https://github.com/burakboduroglu/portkill.git
cd portkill
npm install
npm run build
npm test
npm run lint
```

Before opening a PR:

- Add or update **tests** when behavior changes (`tests/`, Vitest; patterns in [docs/testing-strategy.md](docs/testing-strategy.md)).
- Run **`npm run format`** if you touch many files (Prettier).
- For GUI or HTTP API changes, update [DATA_DICTIONARY.md](DATA_DICTIONARY.md) §7 and see [docs/security-notes.md](docs/security-notes.md) and [docs/implementation.md](docs/implementation.md).

---

## Pull Request Process

### 1. Branch

Create a branch from `main`:

```bash
git checkout -b fix/your-topic
# or feat/your-topic, docs/your-topic
```

### 2. Title format

Use a short, imperative summary. Prefixes are welcome:

- `fix:` bug fix  
- `feat:` user-visible behavior  
- `docs:` documentation only  
- `chore:` tooling, deps, release prep  
- `test:` tests only  

Examples: `fix: handle empty lsof line on Linux`, `docs: clarify --gui loopback`.

### 3. Description

Include:

- **What** changed and **why**
- **How to verify** (commands you ran)
- Link **related issues** if any

### 4. Review

Maintainers will review when they can. Please keep feedback discussions respectful (see Code of Conduct).

---

## Guidelines

### Do

- Keep changes **focused** on one concern per PR when possible
- Match existing **TypeScript style** and layout in [PRD.md](PRD.md) §6.2 (`src/commands`, `src/core`, `src/utils`, `src/gui`, `src/types.ts`); keep [DATA_DICTIONARY.md](DATA_DICTIONARY.md) in sync when public shapes change
- Preserve **backward compatibility** for CLI flags and exit codes unless the PRD is updated intentionally

### Don’t

- Commit **secrets**, tokens, or machine-specific paths
- Land changes that **break tests** without updating expectations and docs
- Expand scope to **Windows** or unrelated features without discussion

---

## Questions?

- **Issues:** [github.com/burakboduroglu/portkill/issues](https://github.com/burakboduroglu/portkill/issues)
- **Security:** report sensitive issues per [docs/security-notes.md](docs/security-notes.md) if applicable

Thank you for contributing.

# Changelog

All notable changes to portkill are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.6] - 2026-09-02

### Fixed

- `portkill --version` reports the version of the build it came from. It read
  the nearest `package.json`, which the published tarball does not ship beside
  `dist/`, so an installed CLI could answer with whatever it found or fall back
  to `0.0.0`. The version is baked into the bundle at build time now.
- `tsc --noEmit` passes again. Three `code === 1` comparisons read the error of
  a failed child process through a cast that types `code` as a string, but Node
  puts the numeric exit status there when the child ran and exited non-zero —
  which is how `lsof` reports "no matches". The comparison worked only because
  the cast was wrong; one `execErrorCode` helper now returns the honest union.
- The GUI server test no longer hangs on Node 18. It called the server through
  global `fetch`, which does not work inside a vitest worker on that version.
- `--help` printed the default signal twice: the option description carried
  `(default: SIGTERM)` while commander appended its own.

### Added

- Continuous integration: lint, types and formatting on every push, and the
  test suite across Node 18, 20 and 22 on both Linux and macOS. The built CLI
  is asked for its version there, so a bump that lands only in `package.json`
  cannot ship a binary reporting the previous release.
- Homebrew install instructions in the README.
- A release workflow: pushing a version tag publishes to npm with provenance
  and creates the GitHub release from this changelog.
- `SECURITY.md`, issue forms and a pull request template. The security notes
  previously pointed people at the public issue tracker for vulnerabilities.
- A social preview card and a rewritten README, both showing the output the CLI
  actually prints.
- The coverage thresholds in `vitest.config.ts` now run in CI, where nothing
  had been enforcing them.

### Changed

- Prettier applied across the tree, with `format:check` wired into CI so the
  formatter stays authoritative.
- The toolchain moved to bun. `package-lock.json` is gone, `bun.lock` is the
  tracked lockfile, and the development commands in every document match what
  CI runs. Publishing stays with npm.
- Dependency updates closing 30 of the 32 advisories `bun audit` reported, all
  of them in development dependencies. What remains is one low advisory for an
  esbuild development server that this project never starts, on a platform it
  does not support.

### Removed

- The Cursor rules, the PRD, the data dictionary, the AGENTS hub and the
  implementation, testing-strategy and security-notes documents. Seven
  documents described a CLI with seven flags, cross-referencing each other more
  than the code, and drifted from it — the implementation guide still described
  `/proc/net/tcp` parsing that does not exist. What was load-bearing moved
  where it is checked: the GUI API contract into the CLI reference, the audit
  and body-cap notes into the security policy, and the module boundaries and
  mock patterns into the README and the contributing guide.

## [0.4.5] - 2026-03-22

### Added

- `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md` (Contributor Covenant 2.0).

### Changed

- `RELEASE.md` moved to the repository root and every link that pointed at its
  old location updated.
- Documentation consolidated: the redundant `docs/README.md` index removed, the
  PRD, implementation guide and data dictionary synced with the `src/` layout,
  and the GUI treated as shipped rather than deferred.

## [0.4.4] - 2026-03-22

### Fixed

- The npm badge and homepage pointed at the unscoped package name, which does
  not exist; both now resolve to `@burakboduroglu/portkill`.

## [0.4.3] - 2026-03-22

### Added

- A `prepublishOnly` guard that aborts the publish when the version is already
  on the registry, so a forgotten bump fails locally instead of at npm.
- A YouTube walkthrough of `portkill --gui` in the README.

## [0.4.2] - 2026-03-22

### Changed

- Distribution documented as npm-only: the Homebrew tap and every `brew`
  reference came out of the install instructions. The tap returned in 0.4.6.

## [0.4.1] - 2026-03-22

### Changed

- Published under the scoped name `@burakboduroglu/portkill`. npm blocks the
  unscoped `portkill` as too similar to an existing `port-kill`. The CLI binary
  is still `portkill`.

## [0.4.0] - 2026-03-22

### Added

- `--gui`: a local web UI on loopback with the same logic as the CLI, served
  over a dual-stack listener with CORS and a favicon.
- MIT license, a Homebrew formula and a lean npm tarball that ships only
  `dist/index.js`, the README and the license.

## [0.3.0] - 2026-03-22

### Added

- Inclusive port ranges (`portkill 9000-9002`), capped at 4096 ports per range
  token.
- The npm package layout the CLI ships in.

## [0.2.0] - 2026-03-22

### Added

- Coloured terminal output through chalk, a coverage gate, and tests for the
  kill, list and lister paths.

## [0.1.0] - 2026-03-22

### Added

- First release: find what is listening on a TCP port, show the process name
  and PID, and stop it — with `--dry-run` to preview and `--force` to skip the
  confirmation.

[Unreleased]: https://github.com/burakboduroglu/portkill/compare/v0.4.6...HEAD
[0.4.6]: https://github.com/burakboduroglu/portkill/compare/v0.4.5...v0.4.6
[0.4.5]: https://github.com/burakboduroglu/portkill/compare/v0.4.4...v0.4.5
[0.4.4]: https://github.com/burakboduroglu/portkill/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/burakboduroglu/portkill/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/burakboduroglu/portkill/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/burakboduroglu/portkill/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/burakboduroglu/portkill/releases/tag/v0.4.0
[0.3.0]: https://github.com/burakboduroglu/portkill/compare/e0ec647...2e87b1e
[0.2.0]: https://github.com/burakboduroglu/portkill/compare/6148021...e0ec647
[0.1.0]: https://github.com/burakboduroglu/portkill/commit/6148021

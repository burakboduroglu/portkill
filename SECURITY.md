# Security Policy

## Supported versions

Only the latest release is supported. There are no maintenance branches — a fix
ships in the next version rather than as a patch to an older one.

| Version | Status               |
| ------- | -------------------- |
| 0.4.x   | Supported            |
| < 0.4   | Unsupported, upgrade |

## What portkill touches

Worth knowing before you report, and before you install:

- **It sends signals to processes.** It runs as you and nothing more: it never
  invokes `sudo`, and `process.kill` fails with `EPERM` on anything your user
  does not own, which portkill reports rather than works around. The signal
  comes from `--signal` and is passed to `process.kill` as-is; an unrecognised
  name is rejected by Node.
- **It shells out to `lsof`, and to `fuser` on Linux.** Both go through
  `execFile` with a fixed argument list and no shell, and port arguments are
  matched against `^\d+$` and range-checked to 1–65535 before they reach it, so
  a port argument cannot become anything but a number.
- **`--gui` has no authentication.** The server binds loopback only (`127.0.0.1`
  and `::1` when available), but anything that can reach your loopback while it
  runs can call the API and kill a listener — including a page open in your
  browser, since CORS is permissive on `/api/*` so the UI works from both
  `localhost` and `127.0.0.1`. It is local-only tooling and it only exists for
  as long as you leave it running.
- **Distribution.** The npm package is published from a tagged GitHub Actions
  run with [provenance](https://docs.npmjs.com/generating-provenance-statements)
  from 0.4.6 on, so the registry records the commit and workflow that built the
  tarball. The Homebrew formula lives in a personal tap and installs that same
  release tarball, pinned by checksum.
- The published tarball ships `dist/index.js`, the README and the license — no
  source maps and no `package.json` scripts.
- Request bodies to the GUI API are capped at 64 KiB.
- Dependencies are audited with `bun audit`. The runtime dependencies are
  `chalk` and `commander`; everything else is development-only and never
  reaches the tarball.

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Report it privately in one of these ways:

1. **GitHub Security Advisories** — open a private draft advisory from the
   [Security tab](https://github.com/burakboduroglu/portkill/security/advisories/new).
   This is preferred.
2. **Email** — <info@burakboduroglu.com.tr>.

A useful report includes:

- What the issue is and where it lives (file, function, or dependency).
- Steps to reproduce, or a proof of concept.
- The impact you believe it has.
- Any suggested fix, if you have one.

## What to expect

This is a personal project maintained in spare time, so treat these as
intentions rather than guarantees: an acknowledgement within a few days, an
assessment of whether it is reproducible, and a fix in the next release if it
is. You will be credited in the release notes unless you would rather not be.

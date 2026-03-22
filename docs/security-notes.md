# Security notes (portkill)

## Dependency audit

Run periodically:

```bash
npm audit
```

## Published package contents

`package.json` `files` ships only `dist/index.js`, `README.md`, and `LICENSE` (no source maps in the registry tarball).

## Local GUI (`--gui`)

- HTTP server binds to **loopback only** (`127.0.0.1` and, when available, `::1`).
- No authentication: treat as **local-only** tooling; anyone who can open your machine’s browser session could call the API while the process runs.
- CORS is permissive for `/api/*` to avoid broken fetches when the tab uses `localhost` vs `127.0.0.1`; this does not expose the server beyond loopback.

## Secrets

Do not commit `.env` files (see `.gitignore`). The project does not require API keys.

## Reporting

Open a [GitHub issue](https://github.com/burakboduroglu/portkill/issues) for suspected vulnerabilities; update the URL if the repo moves.

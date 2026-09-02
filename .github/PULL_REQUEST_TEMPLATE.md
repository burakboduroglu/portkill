<!--
Keep the change focused, and read CONTRIBUTING.md first.
-->

## What changed

<!-- One or two sentences. What does this do, and why? -->

## Related issue

<!-- Closes #123 — or "none" for a trivial fix. -->

## Type of change

- [ ] Bug fix
- [ ] New feature or improvement
- [ ] Refactor (no behaviour change)
- [ ] Documentation
- [ ] Build, CI, or release tooling

## Checklist

- [ ] `bun run lint`, `bun run typecheck`, `bun run format:check` and `bun run test` pass
- [ ] Tests cover the change, or it is one that cannot be tested (say which)
- [ ] `CHANGELOG.md` has an entry under `Unreleased`, unless nothing user-visible changed
- [ ] Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, …)
- [ ] No new dependency, or the new one is justified below

## If this touches the CLI or the GUI API

- [ ] `docs/cli-reference.md` matches the flags and exit codes
- [ ] `DATA_DICTIONARY.md` §7 matches the request and response shapes
- [ ] I ran the built CLI by hand: `bun run build && node dist/index.js --list`

## Notes for the reviewer

<!-- Anything you are unsure about, or deliberately left out. -->

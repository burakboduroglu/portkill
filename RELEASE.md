# Releasing

Scoped package: **`@burakboduroglu/portkill`** (unscoped `portkill` is blocked by npm as too similar to `port-kill`). The CLI binary remains **`portkill`**.

Releases are cut from a tag. Pushing `vX.Y.Z` runs [`.github/workflows/release.yml`](.github/workflows/release.yml), which checks the release, publishes it to npm with provenance, creates the GitHub Release, and prints the two lines the Homebrew formula needs.

## 1. Prepare the release

Bump the version. npm never allows the same version to be published twice, so anything that needs a new tarball — code, README, docs — needs a bump.

```bash
bun run release:bump-patch   # 0.4.6 → 0.4.7 (fixes, docs)
bun run release:bump-minor   # 0.4.x → 0.5.0 (new behaviour)
```

Move the `Unreleased` entries in [`CHANGELOG.md`](CHANGELOG.md) under a new `## [X.Y.Z] - YYYY-MM-DD` heading and update the link definitions at the bottom. The workflow refuses a tag the changelog does not cover, because those entries become the release notes.

Commit both as `chore(release): vX.Y.Z` and merge into `main`.

## 2. Tag the merge commit

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
```

The workflow then, in order:

1. Refuses the tag if it disagrees with `package.json`, if the changelog has no section for it, or if the `NPM_TOKEN` secret is missing — all of it before anything is published, because npm never releases a version number back.
2. Runs lint, types, formatting, the test suite and the build, then asks the built CLI for its version.
3. Packs the tarball once and publishes that same file to npm with `--provenance`, so the registry records the commit and workflow it came from.
4. Creates the GitHub Release with the changelog section as its notes and the tarball attached as `portkill-X.Y.Z.tgz`, which is the file the Homebrew formula downloads.

`NPM_TOKEN` is a granular access token with **publish** permission on the package, stored under Settings → Secrets and variables → Actions. It replaces the interactive 2FA prompt; a classic automation token works too.

## 3. Update the Homebrew tap

The workflow's run summary prints the `url` and `sha256` for the new tarball. Put them in `Formula/portkill.rb` in [burakboduroglu/homebrew-portkill](https://github.com/burakboduroglu/homebrew-portkill), and update the `chalk` and `commander` resources if either dependency moved:

```bash
brew audit --strict --online burakboduroglu/portkill/portkill
brew install burakboduroglu/portkill/portkill
portkill --version
```

## 4. Verify

```bash
npm view @burakboduroglu/portkill version
npx @burakboduroglu/portkill@latest --version
```

## Publishing by hand

Only needed when the workflow itself is broken. `prepublishOnly` re-checks the version against the registry and re-runs the build and tests.

```bash
bun run lint && bun run typecheck && bun run test && bun run build
npm login
npm publish
gh release create vX.Y.Z --notes-file <(node scripts/changelog-section.mjs vX.Y.Z)
```

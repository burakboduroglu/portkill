# Homebrew distribution

The npm package must be **published first**; the formula installs from `registry.npmjs.org`.

## Official tap (this project)

Repository: **[github.com/burakboduroglu/homebrew-portkill](https://github.com/burakboduroglu/homebrew-portkill)**.

Users (after `@burakboduroglu/portkill` is on npm):

```bash
brew tap burakboduroglu/portkill
brew install portkill
```

Maintainers: update `Formula/portkill.rb` there after each npm release (`url`, `sha256`). The same checksum should match `packaging/homebrew/portkill.rb` in the main repo.

## Fork / your own tap

1. Create an empty repo, e.g. `homebrew-portkill`.
2. Add `Formula/portkill.rb` (copy from `packaging/homebrew/portkill.rb` in the main repo).
3. `brew tap YOUR_USER/portkill https://github.com/YOUR_USER/homebrew-portkill` then `brew install portkill`.

## Publish to npm

From the portkill repo (after `npm login`):

```bash
npm run build && npm test
npm publish
```

Confirm the published version: `npm view @burakboduroglu/portkill version`. The formula `url` must match the registry tarball, e.g. `npm view @burakboduroglu/portkill dist.tarball`.

## Update the formula after each release

1. Bump `version` in `package.json`, tag git, publish to npm.
2. Compute the registry tarball checksum (must match what npm serves):

   ```bash
   curl -sL "https://registry.npmjs.org/@burakboduroglu/portkill/-/portkill-X.Y.Z.tgz" | shasum -a 256
   ```

3. In `Formula/portkill.rb`, set `url` to that version’s `.tgz` URL and `sha256` to the output above.
4. Commit and push the tap repo.

**Note:** The `sha256` checked into this monorepo under `packaging/homebrew/portkill.rb` matches `npm pack` for the current `package.json` **files** layout. Re-run the `curl | shasum` step after `npm publish` in case the registry tarball differs slightly.

## Optional: homebrew-core

Submitting to [homebrew-core](https://github.com/Homebrew/homebrew-core) avoids maintaining a personal tap; follow their [Acceptable Formulae](https://docs.brew.sh/Acceptable-Formulae) and PR process.

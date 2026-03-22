# Homebrew distribution

The npm package must be **published first**; the formula installs from `registry.npmjs.org`.

## One-time: create a tap

1. On GitHub, create an empty repo, e.g. `homebrew-portkill` (name can be anything).
2. Clone it locally and add the formula:

   ```bash
   mkdir -p Formula
   cp /path/to/portkill/packaging/homebrew/portkill.rb Formula/portkill.rb
   git add Formula/portkill.rb && git commit -m "Add portkill formula" && git push
   ```

3. Users install with:

   ```bash
   brew tap burakboduroglu/portkill https://github.com/burakboduroglu/homebrew-portkill
   brew install portkill
   ```

   Replace `burakboduroglu` / URLs with your GitHub username and repo.

## Publish to npm

From the portkill repo (after `npm login`):

```bash
npm run build && npm test
npm publish --access public
```

Confirm the name is free: `npm view portkill version`. If the package name is taken, use a scoped name (`@yourscope/portkill`) and adjust the formula `url` to the scoped tarball URL from `npm view @yourscope/portkill dist.tarball`.

## Update the formula after each release

1. Bump `version` in `package.json`, tag git, publish to npm.
2. Compute the registry tarball checksum (must match what npm serves):

   ```bash
   curl -sL "https://registry.npmjs.org/portkill/-/portkill-X.Y.Z.tgz" | shasum -a 256
   ```

3. In `Formula/portkill.rb`, set `url` to that version’s `.tgz` URL and `sha256` to the output above.
4. Commit and push the tap repo.

**Note:** The `sha256` checked into this monorepo under `packaging/homebrew/portkill.rb` matches `npm pack` for the current `package.json` **files** layout. Re-run the `curl | shasum` step after `npm publish` in case the registry tarball differs slightly.

## Optional: homebrew-core

Submitting to [homebrew-core](https://github.com/Homebrew/homebrew-core) avoids maintaining a personal tap; follow their [Acceptable Formulae](https://docs.brew.sh/Acceptable-Formulae) and PR process.

# Release checklist

## 1. Pre-flight

```bash
npm run build && npm test && npm run lint
```

## 2. Publish to npm

Requires [2FA](https://docs.npmjs.com/configuring-two-factor-authentication) or a granular access token with **publish** permission.

```bash
npm login          # if needed
npm publish        # runs prepublishOnly (build + test)
```

If publish fails with **403** / two-factor: enable 2FA on npm or create a token at [npmjs.com](https://www.npmjs.com/) → Access Tokens (type **Publish**).

## 3. Verify registry

```bash
npm view portkill version
npm i -g portkill
portkill --version
```

## 4. Registry tarball checksum (Homebrew)

After publish, confirm the SHA-256 matches `packaging/homebrew/portkill.rb`:

```bash
curl -sL "https://registry.npmjs.org/portkill/-/portkill-$(npm view portkill version).tgz" | shasum -a 256
```

If it differs from the repo formula, update `sha256` in `packaging/homebrew/portkill.rb` and in the **tap** repo `Formula/portkill.rb`, then commit.

## 5. Git tag & GitHub Release

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
gh release create vX.Y.Z --generate-notes
```

## 6. Optional: npm link on GitHub “Website”

```bash
gh repo edit burakboduroglu/portkill --homepage "https://www.npmjs.com/package/portkill"
```

## 7. Tap repo

Tap: `github.com/burakboduroglu/homebrew-portkill` — install:

```bash
brew tap burakboduroglu/portkill
brew install portkill
```

Push formula updates to that repository after each npm release.

# Release checklist

Scoped package: **`@burakboduroglu/portkill`** (unscoped `portkill` is blocked by npm as too similar to `port-kill`). The CLI binary remains **`portkill`**.

## 1. Pre-flight

```bash
npm run build && npm test && npm run lint
```

## 2. Publish to npm

Requires [2FA](https://docs.npmjs.com/configuring-two-factor-authentication) or a granular access token with **publish** permission.

```bash
npm login          # if needed
npm publish        # runs prepublishOnly (build + test); publishConfig.access is public
```

If publish fails with **403** / two-factor: enable 2FA on npm or create a token at [npmjs.com](https://www.npmjs.com/) → Access Tokens (type **Publish**).

## 3. Verify registry

```bash
npm view @burakboduroglu/portkill version
npm i -g @burakboduroglu/portkill
portkill --version
```

## 4. Registry tarball checksum (Homebrew)

Run **after** `npm publish` so the registry tarball exists.

### 4.1 Compute SHA-256 from npm (source of truth)

**macOS:**

```bash
VERSION=$(npm view @burakboduroglu/portkill version)
curl -sL "https://registry.npmjs.org/@burakboduroglu/portkill/-/portkill-${VERSION}.tgz" | shasum -a 256
```

**Linux** (no `shasum`):

```bash
VERSION=$(npm view @burakboduroglu/portkill version)
curl -sL "https://registry.npmjs.org/@burakboduroglu/portkill/-/portkill-${VERSION}.tgz" | sha256sum
```

Tek satır çıktı: `abcdef...` (bazen dosya adı da yazılır; **ilk alan** SHA-256’dır).

### 4.2 Repodaki formülle karşılaştır

Ana repo kökünden:

```bash
grep -E '^\s*sha256 ' packaging/homebrew/portkill.rb
```

Üstteki `curl` çıktısındaki hash ile **aynı** olmalı.

### 4.3 Farklıysa güncelle

1. **`packaging/homebrew/portkill.rb`** içinde `sha256 "..."` satırını registry çıktısıyla değiştir.
2. **Tap** klonu: [homebrew-portkill](https://github.com/burakboduroglu/homebrew-portkill) → `Formula/portkill.rb` içinde aynı `sha256` (ve gerekiyorsa `url` içindeki sürüm numarası).
3. İki repoda commit + push:

   ```bash
   # portkill ana repo
   git add packaging/homebrew/portkill.rb && git commit -m "chore(homebrew): sync sha256 for v${VERSION}" && git push

   # tap (örnek yol)
   cd ../homebrew-portkill
   git add Formula/portkill.rb && git commit -m "chore: sync portkill sha256 for v${VERSION}" && git push
   ```

### 4.4 `brew install` doğrulama

```bash
brew update
brew reinstall portkill   # veya ilk kurulum: brew install portkill
portkill --version
```

## 5. Git tag & GitHub Release

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
gh release create vX.Y.Z --generate-notes
```

## 6. Optional: npm link on GitHub “Website”

```bash
gh repo edit burakboduroglu/portkill --homepage "https://www.npmjs.com/package/@burakboduroglu/portkill"
```

## 7. Tap repo

Tap: `github.com/burakboduroglu/homebrew-portkill` — install:

```bash
brew tap burakboduroglu/portkill
brew install portkill
```

Push formula updates to that repository after each npm release.

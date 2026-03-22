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

## 4. Git tag & GitHub Release

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
gh release create vX.Y.Z --generate-notes
```

## 5. Optional: npm link on GitHub “Website”

```bash
gh repo edit burakboduroglu/portkill --homepage "https://www.npmjs.com/package/@burakboduroglu/portkill"
```

# Release checklist

Scoped package: **`@burakboduroglu/portkill`** (unscoped `portkill` is blocked by npm as too similar to `port-kill`). The CLI binary remains **`portkill`**.

npm **does not allow** republishing the same version. Before every `npm publish` (README changes, docs, code — anything that needs a new tarball), **bump `package.json`** so it is **greater than** the latest on the registry.

## 1. Bump version (before publish)

Check what npm has:

```bash
npm view @burakboduroglu/portkill version
```

If it matches `package.json`, bump:

```bash
npm run release:bump-patch   # e.g. 0.4.5 → 0.4.6 (typical doc/readme fixes)
# or
npm run release:bump-minor   # 0.4.x → 0.5.0
```

Then commit the version change (and your other changes) before publishing.

`prepublishOnly` also runs a script that **aborts publish** if the current version is already on npm (when the registry is reachable).

## 2. Pre-flight

```bash
npm run build && npm test && npm run lint
```

## 3. Publish to npm

Requires [2FA](https://docs.npmjs.com/configuring-two-factor-authentication) or a granular access token with **publish** permission.

```bash
npm login          # if needed
npm publish        # prepublishOnly: version check, build, test
```

If publish fails with **403** / two-factor: enable 2FA on npm or create a token at [npmjs.com](https://www.npmjs.com/) → Access Tokens (type **Publish**).

## 4. Verify registry

```bash
npm view @burakboduroglu/portkill version
npm i -g @burakboduroglu/portkill
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

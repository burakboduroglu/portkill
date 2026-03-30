import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Set at build time in `dist/` (tsup `define`). */
declare const __PKG_VERSION__: string | undefined;

function readVersionFromNearestPackageJson(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = join(here, "..", "package.json");
    const raw = readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/** Set at build time in `dist/` (tsup); falls back to reading `package.json` for dev/tests. */
export function getPackageVersion(): string {
  if (typeof __PKG_VERSION__ === "string") return __PKG_VERSION__;
  return readVersionFromNearestPackageJson();
}

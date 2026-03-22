#!/usr/bin/env node
/**
 * Fail npm publish when package.json version already exists on the registry.
 * Skips (exit 0) if registry cannot be reached (e.g. offline).
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const { name, version: local } = pkg;

let remote;
try {
  remote = execSync(`npm view ${name} version`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
} catch {
  console.warn("assert-version-not-published: registry unreachable; skipping check.");
  process.exit(0);
}

if (remote === local) {
  console.error(
    `Version ${local} is already on npm. Bump first: npm run release:bump-patch`,
  );
  process.exit(1);
}

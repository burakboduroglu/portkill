#!/usr/bin/env node
/**
 * Print the CHANGELOG.md body for one version, without its heading.
 *
 * Usage:
 *   node scripts/changelog-section.mjs 0.4.6
 *
 * Exits non-zero when the version has no section, which is how the release
 * workflow catches a tag pushed before the changelog was updated.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const version = (process.argv[2] ?? "").replace(/^v/, "");

if (!version) {
  console.error("usage: changelog-section.mjs <version>");
  process.exit(1);
}

const lines = readFileSync(join(root, "CHANGELOG.md"), "utf8").split("\n");
const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));

if (start === -1) {
  console.error(`CHANGELOG.md has no entry for ${version}`);
  process.exit(1);
}

const rest = lines.slice(start + 1);
const end = rest.findIndex((line) => line.startsWith("## "));
const body = (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();

if (!body) {
  console.error(`The CHANGELOG.md entry for ${version} is empty`);
  process.exit(1);
}

console.log(body);

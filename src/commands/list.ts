import process from "node:process";

import { listAllTcpListeners } from "../core/lister.js";
import type { SupportedPlatform } from "../utils/platform.js";
import { style } from "../utils/style.js";

export interface ListCommandOptions {
  platform: SupportedPlatform;
  verbose: boolean;
}

export async function runList(opts: ListCommandOptions): Promise<{ exitCode: number; lines: string[] }> {
  if (opts.verbose) {
    process.stderr.write("[verbose] running lsof -nP -iTCP -sTCP:LISTEN\n");
  }
  const result = await listAllTcpListeners(opts.platform);
  if (!result.ok) {
    return { exitCode: 1, lines: [style.error(`✖ ${result.message}`)] };
  }
  if (result.rows.length === 0) {
    return { exitCode: 0, lines: [style.info("ℹ No TCP listeners found.")] };
  }
  const lines = result.rows.map((r) => style.listRow(r.port, r.commandName, r.pid));
  return { exitCode: 0, lines };
}

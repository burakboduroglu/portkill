import process from "node:process";

import { Command } from "commander";

import { runKill } from "./commands/kill.js";
import { runList } from "./commands/list.js";
import { attachGuiShutdown, startGuiServer } from "./gui/server.js";
import { parsePortArguments } from "./utils/parse-ports.js";
import { getSupportedPlatform, UnsupportedPlatformError } from "./utils/platform.js";
import { getPackageVersion } from "./version.js";

async function main(): Promise<void> {
  const program = new Command();

  program
    .name("portkill")
    .description("Kill processes listening on given TCP ports")
    .argument(
      "[ports...]",
      "TCP ports and/or ranges (e.g. 3000 8080 3000-3005); 1–65535, max 4096 ports per range",
    )
    .option("-f, --force", "do not prompt for confirmation", false)
    .option("-n, --dry-run", "show targets only; do not send signals", false)
    .option("-s, --signal <name>", "signal to send (default: SIGTERM)", "SIGTERM")
    .option("-v, --verbose", "verbose stderr logs", false)
    .option("-l, --list", "list all TCP listening ports and processes", false)
    .option("--gui", "open local web UI (127.0.0.1 only)", false)
    .configureHelp({ helpWidth: 88 })
    .action(async (portsArg: string[], options) => {
      const list = options.list as boolean;
      const gui = options.gui as boolean;

      if (gui && list) {
        process.stderr.write("error: do not combine --gui with --list\n");
        process.exitCode = 1;
        return;
      }
      if (gui && portsArg.length > 0) {
        process.stderr.write("error: do not pass ports together with --gui\n");
        process.exitCode = 1;
        return;
      }

      if (list && portsArg.length > 0) {
        process.stderr.write("error: do not pass ports together with --list\n");
        process.exitCode = 1;
        return;
      }

      if (list) {
        let platform;
        try {
          platform = getSupportedPlatform();
        } catch (e) {
          if (e instanceof UnsupportedPlatformError) {
            process.stderr.write(`${e.message}\n`);
            process.exitCode = 1;
            return;
          }
          throw e;
        }
        const { exitCode, lines } = await runList({
          platform,
          verbose: options.verbose as boolean,
        });
        for (const line of lines) {
          process.stdout.write(`${line}\n`);
        }
        process.exitCode = exitCode;
        return;
      }

      if (gui) {
        let platform;
        try {
          platform = getSupportedPlatform();
        } catch (e) {
          if (e instanceof UnsupportedPlatformError) {
            process.stderr.write(`${e.message}\n`);
            process.exitCode = 1;
            return;
          }
          throw e;
        }
        const { url, servers } = await startGuiServer({ platform });
        process.stdout.write(`portkill GUI: ${url}\n`);
        process.stdout.write("Press Ctrl+C to stop.\n");
        attachGuiShutdown(...servers);
        return;
      }

      if (portsArg.length === 0) {
        program.help({ error: true });
        return;
      }

      let ports: number[];
      try {
        ports = parsePortArguments(portsArg);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        process.stderr.write(`${msg}\n`);
        process.exitCode = 1;
        return;
      }

      let platform;
      try {
        platform = getSupportedPlatform();
      } catch (e) {
        if (e instanceof UnsupportedPlatformError) {
          process.stderr.write(`${e.message}\n`);
          process.exitCode = 1;
          return;
        }
        throw e;
      }

      const { exitCode, lines } = await runKill({
        ports,
        dryRun: options.dryRun as boolean,
        force: options.force as boolean,
        verbose: options.verbose as boolean,
        signal: options.signal as string,
        platform,
      });

      for (const line of lines) {
        process.stdout.write(`${line}\n`);
      }
      process.exitCode = exitCode;
    });

  program.version(getPackageVersion(), "-V, --version", "output version number");

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  process.stderr.write(err instanceof Error ? `${err.message}\n` : `${String(err)}\n`);
  process.exitCode = 1;
});

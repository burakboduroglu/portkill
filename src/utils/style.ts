import chalk from "chalk";

/** Chalk respects `NO_COLOR`, `FORCE_COLOR`, and TTY. */
export const style = {
  success: (text: string) => chalk.green(text),
  info: (text: string) => chalk.cyan(text),
  error: (text: string) => chalk.red(text),
  listRow: (port: number, commandName: string, pid: number) =>
    `${chalk.white("• Port ")}${chalk.bold.yellow(String(port))}${chalk.white(` → ${commandName} (PID ${pid})`)}`,
};

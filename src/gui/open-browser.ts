import { spawn } from "node:child_process";

/** Best-effort open default browser (macOS `open`, Linux `xdg-open`). */
export function openBrowser(url: string): void {
  try {
    if (process.platform === "darwin") {
      spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
    } else if (process.platform === "linux") {
      spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
    }
  } catch {
    /* ignore */
  }
}

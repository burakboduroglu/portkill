import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import process from "node:process";

import { runKill } from "../commands/kill.js";
import { listAllTcpListeners } from "../core/lister.js";
import { parsePortArguments } from "../utils/parse-ports.js";
import type { SupportedPlatform } from "../utils/platform.js";
import { getIndexHtml } from "./index-html.js";
import { openBrowser } from "./open-browser.js";

const HOST = "127.0.0.1";
const MAX_BODY = 64 * 1024;

function json(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > MAX_BODY) {
      throw new Error("request body too large");
    }
    chunks.push(buf);
  }
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw) as unknown;
}

export interface StartGuiServerOptions {
  platform: SupportedPlatform;
  /** Fixed port, or `0` for ephemeral (default). */
  port?: number;
  /** Default `true`. Set `false` in tests. */
  openBrowser?: boolean;
}

export function startGuiServer(opts: StartGuiServerOptions): Promise<{ url: string; server: Server }> {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${HOST}`);

      if (req.method === "GET" && url.pathname === "/") {
        const html = getIndexHtml();
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Length": Buffer.byteLength(html),
        });
        res.end(html);
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/listeners") {
        const result = await listAllTcpListeners(opts.platform);
        if (!result.ok) {
          json(res, 200, { ok: false, message: result.message });
          return;
        }
        json(res, 200, { ok: true, rows: result.rows });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/resolve") {
        let body: unknown;
        try {
          body = await readJsonBody(req);
        } catch {
          json(res, 400, { ok: false, message: "invalid JSON body" });
          return;
        }
        if (!body || typeof body !== "object") {
          json(res, 400, { ok: false, message: "expected JSON object" });
          return;
        }
        const b = body as Record<string, unknown>;
        const tokens = b.tokens;
        if (!Array.isArray(tokens) || !tokens.every((t) => typeof t === "string")) {
          json(res, 400, { ok: false, message: "tokens must be an array of strings" });
          return;
        }
        let ports: number[];
        try {
          ports = parsePortArguments(tokens);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          json(res, 400, { ok: false, message: msg });
          return;
        }
        if (ports.length === 0) {
          json(res, 400, { ok: false, message: "no valid ports after parsing" });
          return;
        }
        const dryRun = Boolean(b.dryRun);
        const force = Boolean(b.force);
        const signal = typeof b.signal === "string" ? b.signal : "SIGTERM";
        const { exitCode, outcomes } = await runKill({
          ports,
          dryRun,
          force,
          verbose: false,
          signal,
          platform: opts.platform,
        });
        json(res, 200, {
          ok: true,
          exitCode,
          outcomes,
        });
        return;
      }

      res.writeHead(404).end("not found");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      json(res, 500, { ok: false, message: msg });
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(opts.port ?? 0, HOST, () => {
      server.off("error", reject);
      const addr = server.address();
      const port =
        addr && typeof addr === "object" && "port" in addr ? (addr as { port: number }).port : 0;
      const baseUrl = `http://${HOST}:${port}`;
      if (opts.openBrowser !== false) {
        openBrowser(baseUrl);
      }
      resolve({ url: baseUrl, server });
    });
  });
}

export function attachGuiShutdown(server: Server): void {
  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

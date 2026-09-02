import http from "node:http";

import { describe, expect, it } from "vitest";

import { startGuiServer } from "../src/gui/server.js";

describe("GUI server", () => {
  it("serves index HTML on GET /", async () => {
    const { url, servers } = await startGuiServer({
      platform: "darwin",
      port: 0,
      openBrowser: false,
    });
    try {
      const html = await fetchText(`${url}/`);
      expect(html).toContain("portkill");
      expect(html).toContain("/api/listeners");
    } finally {
      await closeAllServers(servers);
    }
  });

  it("returns 400 for empty resolve tokens", async () => {
    const { url, servers } = await startGuiServer({
      platform: "darwin",
      port: 0,
      openBrowser: false,
    });
    try {
      const status = await postJsonStatus(`${url}/api/resolve`, {
        tokens: [],
        dryRun: true,
        force: true,
        signal: "SIGTERM",
      });
      expect(status).toBe(400);
    } finally {
      await closeAllServers(servers);
    }
  });
});

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

/**
 * Node 18's global fetch does not work inside vitest's worker environment: the
 * request hangs until the test times out, against any server. Node 18 is still
 * a supported target, so the request goes through node:http like the GET above.
 */
function postJsonStatus(url: string, body: unknown): Promise<number | undefined> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        res.resume();
        res.on("end", () => resolve(res.statusCode));
      },
    );
    req.on("error", reject);
    req.end(payload);
  });
}

function closeServer(server: http.Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

async function closeAllServers(servers: http.Server[]): Promise<void> {
  for (const s of servers) {
    await closeServer(s);
  }
}

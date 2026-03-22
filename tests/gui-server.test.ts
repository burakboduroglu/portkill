import http from "node:http";

import { describe, expect, it } from "vitest";

import { startGuiServer } from "../src/gui/server.js";

describe("GUI server", () => {
  it("serves index HTML on GET /", async () => {
    const { url, server } = await startGuiServer({ platform: "darwin", port: 0, openBrowser: false });
    try {
      const html = await fetchText(`${url}/`);
      expect(html).toContain("portkill");
      expect(html).toContain("/api/listeners");
    } finally {
      await closeServer(server);
    }
  });

  it("returns 400 for empty resolve tokens", async () => {
    const { url, server } = await startGuiServer({ platform: "darwin", port: 0, openBrowser: false });
    try {
      const res = await fetch(`${url}/api/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens: [], dryRun: true, force: true, signal: "SIGTERM" }),
      });
      expect(res.status).toBe(400);
    } finally {
      await closeServer(server);
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

function closeServer(server: http.Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

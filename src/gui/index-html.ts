/** Single-page UI for local GUI (no bundler). */
export function getIndexHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>portkill</title>
  <style>
    :root {
      color-scheme: dark light;
      --bg: #0f1419;
      --panel: #1a2332;
      --text: #e7ecf3;
      --muted: #8b9cb3;
      --accent: #3d8bfd;
      --ok: #3fb950;
      --warn: #d29922;
      --err: #f85149;
      --border: #30363d;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f6f8fa;
        --panel: #fff;
        --text: #1f2328;
        --muted: #656d76;
        --border: #d0d7de;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 1.5rem;
    }
    h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.25rem; }
    .sub { color: var(--muted); font-size: 0.875rem; margin-bottom: 1.5rem; }
    main {
      max-width: 40rem;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    label { display: block; font-size: 0.8rem; color: var(--muted); margin-bottom: 0.35rem; }
    input[type="text"], textarea {
      width: 100%;
      padding: 0.5rem 0.65rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      font-size: 0.9rem;
    }
    textarea { min-height: 4.5rem; resize: vertical; font-family: ui-monospace, monospace; }
    .row { margin-bottom: 1rem; }
    .checks { display: flex; flex-wrap: wrap; gap: 1rem; margin: 0.75rem 0 1rem; }
    .checks label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; margin: 0; color: var(--text); font-size: 0.9rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    button {
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--panel);
      color: var(--text);
      font-size: 0.875rem;
      cursor: pointer;
    }
    button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    button.danger { background: var(--err); border-color: var(--err); color: #fff; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    pre {
      margin: 0;
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--bg);
      border: 1px solid var(--border);
      font-size: 0.8rem;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .hint { font-size: 0.8rem; color: var(--muted); margin-top: 0.35rem; }
    .out-ok { color: var(--ok); }
    .out-warn { color: var(--warn); }
    .out-err { color: var(--err); }
  </style>
</head>
<body>
  <h1>portkill</h1>
  <p class="sub">Local only · this server listens on <code>127.0.0.1</code> only</p>
  <main>
    <div class="row">
      <label for="ports">Ports (space or comma-separated; ranges e.g. 3000-3003)</label>
      <textarea id="ports" placeholder="3000 8080"></textarea>
    </div>
    <div class="row">
      <label for="signal">Signal</label>
      <input type="text" id="signal" value="SIGTERM" />
    </div>
    <div class="checks">
      <label><input type="checkbox" id="dry" /> Dry-run (no signals)</label>
    </div>
    <div class="actions">
      <button type="button" class="primary" id="btn-list">List all TCP listeners</button>
      <button type="button" id="btn-run">Run on ports</button>
      <button type="button" class="danger" id="btn-kill">Kill on ports</button>
    </div>
    <p class="hint">Kill asks for confirmation in the browser, then sends the signal. Prefer dry-run first.</p>
    <label>Output</label>
    <pre id="out">Ready.</pre>
  </main>
  <script>
(function () {
  var out = document.getElementById("out");
  function setOut(html) { out.innerHTML = html; }
  function tokensFromInput() {
    var raw = document.getElementById("ports").value.trim();
    if (!raw) return [];
    return raw.split(/[\\s,]+/).filter(Boolean);
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function formatOutcome(o) {
    switch (o.kind) {
      case "notFound": return "Port " + o.port + " → no process found";
      case "killed": return "Port " + o.port + " → killed (" + (o.commandName || "unknown") + ", PID " + o.pid + ")";
      case "dryRunWouldKill":
        return "Port " + o.port + " → " + (o.commandName || "unknown") + " (PID " + o.pid + ") — dry-run (no signal)";
      case "permissionDenied": return "Port " + o.port + " → permission denied (try with sudo)";
      case "error": return "Port " + o.port + " → " + o.message;
      default: return JSON.stringify(o);
    }
  }
  function outcomeClass(k) {
    if (k === "killed" || k === "dryRunWouldKill") return "out-ok";
    if (k === "notFound") return "out-warn";
    return "out-err";
  }
  async function api(path, opts) {
    var r = await fetch(path, opts);
    var text = await r.text();
    var data;
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
    if (!r.ok) throw new Error(data.message || data.error || text || String(r.status));
    return data;
  }
  document.getElementById("btn-list").onclick = async function () {
    setOut("Loading…");
    try {
      var data = await api("/api/listeners");
      if (!data.ok) throw new Error(data.message || "failed");
      if (!data.rows.length) { setOut("No TCP listeners."); return; }
      var lines = data.rows.map(function (row) {
        return "Port " + row.port + " → " + row.commandName + " (PID " + row.pid + ")";
      });
      setOut(lines.map(function (l) {
        return '<span class="' + outcomeClass("killed") + '">' + escapeHtml(l) + "</span>";
      }).join("<br>"));
    } catch (e) {
      setOut('<span class="out-err">' + escapeHtml(String(e.message || e)) + "</span>");
    }
  };
  document.getElementById("btn-run").onclick = async function () {
    await resolvePorts(false);
  };
  document.getElementById("btn-kill").onclick = async function () {
    if (!confirm("Send signal to processes on these ports?")) return;
    document.getElementById("dry").checked = false;
    await resolvePorts(true);
  };
  async function resolvePorts(forceKill) {
    var tokens = tokensFromInput();
    if (!tokens.length) {
      setOut('<span class="out-err">Enter at least one port or range.</span>');
      return;
    }
    var dryRun = document.getElementById("dry").checked;
    var signal = document.getElementById("signal").value.trim() || "SIGTERM";
    var force = forceKill === true;
    setOut("Working…");
    try {
      var data = await api("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens: tokens, dryRun: dryRun, force: force, signal: signal }),
      });
      if (!data.ok) throw new Error(data.message || "failed");
      var html = (data.outcomes || []).map(function (o) {
        return '<span class="' + outcomeClass(o.kind) + '">' + escapeHtml(formatOutcome(o)) + "</span>";
      }).join("<br>");
      setOut(html || ("Done. exit " + data.exitCode));
    } catch (e) {
      setOut('<span class="out-err">' + escapeHtml(String(e.message || e)) + "</span>");
    }
  }
})();
  </script>
</body>
</html>`;
}

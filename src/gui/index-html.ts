/**
 * Local GUI — editorial layout (two columns, single shell), calm copy, signal picker.
 */
export function getIndexHtml(): string {
  const faviconSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">' +
    '<path fill="#F44336" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)"/>' +
    '<path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)"/>' +
    "</svg>";
  const faviconHref = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>.portkill</title>
  <link rel="icon" type="image/svg+xml" href="${faviconHref}" />
  <style>
    :root {
      --ink: #163300;
      --ink-secondary: #3a4d39;
      --muted: #687385;
      --surface: #ffffff;
      --canvas: #f2f5f0;
      --border: #d3dcd3;
      --border-strong: #b8c4b8;
      --focus: #163300;
      --primary: #9fe870;
      --primary-hover: #8fd960;
      --primary-ink: #163300;
      --danger: #b42318;
      --danger-surface: #fef3f2;
      --danger-border: #fecdca;
      --info-bg: #eef6ff;
      --info-border: #c7d9f5;
      --success-text: #0d532a;
      --warn-text: #7a5c00;
      --radius-lg: 16px;
      --radius-md: 12px;
      --radius-sm: 8px;
      --shadow: 0 1px 2px rgba(22, 51, 0, 0.06), 0 4px 16px rgba(22, 51, 0, 0.04);
      font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --ink: #e8f0e8;
        --ink-secondary: #c5d4c5;
        --muted: #9aa89a;
        --surface: #1c221c;
        --canvas: #121612;
        --border: #2e382e;
        --border-strong: #3d4a3d;
        --focus: #9fe870;
        --primary: #9fe870;
        --primary-hover: #b5f090;
        --primary-ink: #163300;
        --danger: #f97066;
        --danger-surface: #2a1816;
        --danger-border: #5c2f2a;
        --info-bg: #1a2430;
        --info-border: #3a4a62;
        --success-text: #7ee787;
        --warn-text: #f5d565;
        --shadow: 0 1px 2px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.25);
      }
    }
    * { box-sizing: border-box; }
    html {
      height: 100%;
      overflow-y: scroll;
      scrollbar-gutter: stable;
    }
    body {
      margin: 0;
      height: 100%;
      background: var(--canvas);
      color: var(--ink);
      line-height: 1.5;
      font-size: 14px;
      padding: clamp(0.65rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.25rem);
      overflow: hidden;
    }
    .wrap {
      max-width: 58rem;
      margin: 0 auto;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .masthead {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.25rem 1.25rem;
      flex-shrink: 0;
    }
    .masthead .page-title { margin: 0; }
    .page-title {
      font-size: clamp(1.35rem, 3vw, 1.65rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      margin: 0 0 0.35rem;
      color: var(--ink);
      line-height: 1.15;
    }
    .page-title .title-dot {
      color: var(--primary);
      font-weight: 800;
      margin-right: 0.02em;
      position: relative;
      top: 0.03em;
    }
    .lede {
      margin: 0;
      color: var(--muted);
      font-size: 0.8125rem;
      flex: 1;
      min-width: 14rem;
      max-width: 36rem;
    }
    .info-prompt {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      padding: 0.45rem 0.75rem;
      background: var(--info-bg);
      border: 1px solid var(--info-border);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      color: var(--ink-secondary);
      margin: 0;
      flex-shrink: 0;
    }
    .info-prompt strong { color: var(--ink); }
    .panel-unified {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .action-bar {
      flex-shrink: 0;
      padding: 0.75rem 1rem 0.85rem;
      border-bottom: 1px solid var(--border);
      background: var(--canvas);
    }
    .action-bar-title {
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
      margin: 0 0 0.5rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .action-bar .hint {
      font-size: 0.6875rem;
      color: var(--muted);
      margin: 0.5rem 0 0;
      line-height: 1.4;
    }
    .panel-split {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 0;
    }
    .col {
      padding: 0.85rem 1rem;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .col--controls {
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .col--results {
      border-left: 1px solid var(--border);
      background: var(--surface);
    }
    .panel-footer {
      flex-shrink: 0;
      border-top: 1px solid var(--border);
      padding: 0.4rem 0.75rem;
      text-align: center;
      font-size: 0.6875rem;
      color: var(--muted);
      line-height: 1.4;
    }
    .panel-footer .heart { color: #c41e3a; }
    .section-header {
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      margin: 0 0 0.3rem;
    }
    .section-title {
      font-size: 0.9375rem;
      font-weight: 600;
      margin: 0 0 0.35rem;
      color: var(--ink);
      letter-spacing: -0.01em;
    }
    .supporting {
      font-size: 0.75rem;
      color: var(--muted);
      margin: 0 0 0.45rem;
      line-height: 1.45;
    }
    .field { margin-bottom: 0.65rem; }
    .field:last-child { margin-bottom: 0; }
    .label {
      display: block;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ink);
      margin-bottom: 0.3rem;
    }
    .textarea, .input, .select {
      width: 100%;
      padding: 0.55rem 0.65rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-strong);
      background: var(--surface);
      color: var(--ink);
      font-size: 0.875rem;
      font-family: ui-monospace, "SF Mono", Consolas, monospace;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .textarea { min-height: 3.25rem; resize: none; line-height: 1.45; }
    .textarea:focus, .input:focus, .select:focus {
      outline: none;
      border-color: var(--focus);
      box-shadow: 0 0 0 3px rgba(159, 232, 112, 0.35);
    }
    .hint {
      font-size: 0.6875rem;
      color: var(--muted);
      margin: 0.35rem 0 0;
      line-height: 1.45;
    }
    .select { font-family: inherit; cursor: pointer; }
    .custom-signal-wrap { margin-top: 0.45rem; display: none; }
    .custom-signal-wrap.visible { display: block; }
    .checkbox-row {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
      padding: 0.1rem 0;
    }
    .checkbox-row input {
      width: 1.05rem;
      height: 1.05rem;
      margin-top: 0.15rem;
      accent-color: var(--primary-ink);
      cursor: pointer;
    }
    .checkbox-row label {
      font-size: 0.875rem;
      color: var(--ink);
      cursor: pointer;
      line-height: 1.45;
    }
    .checkbox-row .hint-inline {
      display: block;
      font-size: 0.6875rem;
      color: var(--muted);
      margin-top: 0.15rem;
    }
    .divider {
      height: 1px;
      background: var(--border);
      margin: 0.35rem 0 0.6rem;
      border: none;
      flex-shrink: 0;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.8125rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      border: 1px solid transparent;
      transition: background 0.15s, border-color 0.15s, transform 0.05s;
    }
    .btn:active { transform: scale(0.98); }
    .btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(159, 232, 112, 0.45);
    }
    .btn-primary {
      background: var(--primary);
      color: var(--primary-ink);
      border-color: var(--primary);
    }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-secondary {
      background: transparent;
      color: var(--ink);
      border-color: var(--border-strong);
    }
    .btn-secondary:hover { background: var(--canvas); }
    .btn-danger {
      background: var(--danger-surface);
      color: var(--danger);
      border-color: var(--danger-border);
    }
    .btn-danger:hover { filter: brightness(0.97); }
    .fine-print {
      font-size: 0.6875rem;
      color: var(--muted);
      margin: 0.45rem 0 0;
      line-height: 1.4;
    }
    .danger-callout {
      font-size: 0.6875rem;
      color: var(--danger);
      background: var(--danger-surface);
      border: 1px solid var(--danger-border);
      border-radius: var(--radius-sm);
      padding: 0.45rem 0.55rem;
      margin-top: 0.45rem;
      line-height: 1.4;
    }
    .output-panel {
      margin: 0;
      flex: 1;
      min-height: 5rem;
      padding: 0.65rem 0.75rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--canvas);
      font-size: 0.8125rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .out-ok { color: var(--success-text); }
    .out-warn { color: var(--warn-text); }
    .out-err { color: var(--danger); }
    @media (max-width: 720px) {
      html {
        height: auto;
        min-height: 100%;
        overflow-y: scroll;
        scrollbar-gutter: stable;
      }
      body {
        height: auto;
        min-height: 100%;
        overflow-x: hidden;
        overflow-y: visible;
      }
      .wrap {
        height: auto;
        max-height: none;
      }
      .panel-unified {
        min-height: min(85vh, 40rem);
      }
      .panel-split {
        grid-template-columns: 1fr;
      }
      .col--results {
        border-left: none;
        border-top: 1px solid var(--border);
        min-height: 14rem;
      }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="masthead">
      <h1 class="page-title" aria-label="portkill"><span class="title-dot" aria-hidden="true">.</span>portkill</h1>
      <p class="lede">TCP ports on <strong>this machine</strong> — preview first, then stop only what you mean to.</p>
    </header>

    <div class="info-prompt" role="note">
      <span aria-hidden="true">🔒</span>
      <div><strong>Local only.</strong> Server on <code>127.0.0.1</code> — not exposed by portkill.</div>
    </div>

    <main class="panel-unified">
      <div class="action-bar">
        <p class="action-bar-title">Actions</p>
        <div class="actions">
          <button type="button" class="btn btn-primary" id="btn-list">Show listening ports</button>
          <button type="button" class="btn btn-secondary" id="btn-run">Preview</button>
          <button type="button" class="btn btn-danger" id="btn-kill">Stop</button>
        </div>
        <p class="hint">Listening ports needs no input below. Preview / Stop use ports, signal, and dry-run.</p>
      </div>

      <div class="panel-split">
        <section class="col col--controls" aria-label="Controls">
          <div class="field">
            <p class="section-header">Ports</p>
            <h2 class="section-title">Targets</h2>
            <p class="supporting">Spaces, commas, or ranges (e.g. <code>3000-3003</code>).</p>
            <label class="label" for="ports">Port numbers</label>
            <textarea id="ports" class="textarea" placeholder="e.g. 3000 8080" aria-describedby="ports-hint"></textarea>
            <p id="ports-hint" class="hint">Use Show listening ports if unsure what is open.</p>
          </div>

          <hr class="divider" />

          <div class="field">
            <p class="section-header">Signal</p>
            <h2 class="section-title">Stop request</h2>
            <p class="supporting">Signals are OS messages — polite shutdown vs. force.</p>
            <label class="label" for="signal-preset">Signal</label>
            <select id="signal-preset" class="select" aria-describedby="signal-hint">
              <option value="SIGTERM">SIGTERM — polite (recommended)</option>
              <option value="SIGINT">SIGINT — like Ctrl+C</option>
              <option value="SIGKILL">SIGKILL — cannot be ignored</option>
              <option value="custom">Custom…</option>
            </select>
            <div id="custom-signal-wrap" class="custom-signal-wrap">
              <label class="label" for="signal-custom">Custom</label>
              <input type="text" id="signal-custom" class="input" placeholder="SIGUSR1 or 15" autocomplete="off" />
            </div>
            <p id="signal-hint" class="hint"><strong>SIGTERM</strong> for a clean exit; <strong>SIGKILL</strong> only if needed.</p>
          </div>

          <hr class="divider" />

          <div class="field">
            <div class="checkbox-row">
              <input type="checkbox" id="dry" checked />
              <label for="dry">
                Preview only (dry-run)
                <span class="hint-inline">No signal sent until you turn this off and choose Stop.</span>
              </label>
            </div>
          </div>

          <hr class="divider" />

          <p class="fine-print">Stop asks for confirmation. Some ports may need <code>sudo</code> in Terminal.</p>
          <div class="danger-callout" role="note"><strong>SIGKILL</strong> — possible data loss; last resort.</div>
        </section>

        <section class="col col--results" aria-label="Results">
          <p class="section-header">Results</p>
          <h2 class="section-title">Output</h2>
          <div id="out" class="output-panel" role="status" aria-live="polite">Ready when you are.</div>
        </section>
      </div>

      <footer class="panel-footer">Designed by Burak Boduroglu · Made with <span class="heart" aria-label="love">♥</span></footer>
    </main>
  </div>
  <script>
(function () {
  var out = document.getElementById("out");
  var presetEl = document.getElementById("signal-preset");
  var customWrap = document.getElementById("custom-signal-wrap");
  var customEl = document.getElementById("signal-custom");

  function setOut(html) { out.innerHTML = html; }
  function toggleCustom() {
    var show = presetEl.value === "custom";
    customWrap.classList.toggle("visible", show);
    customEl.disabled = !show;
  }
  presetEl.addEventListener("change", toggleCustom);
  toggleCustom();

  function getSignal() {
    if (presetEl.value === "custom") {
      return (customEl.value || "").trim() || "SIGTERM";
    }
    return presetEl.value;
  }

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
      case "notFound": return "Port " + o.port + " — nothing listening";
      case "killed": return "Port " + o.port + " — stopped (" + (o.commandName || "unknown") + ", PID " + o.pid + ")";
      case "dryRunWouldKill":
        return "Port " + o.port + " — would stop " + (o.commandName || "unknown") + " (PID " + o.pid + "); preview only";
      case "permissionDenied": return "Port " + o.port + " — permission denied (try sudo in Terminal)";
      case "error": return "Port " + o.port + " — " + o.message;
      default: return JSON.stringify(o);
    }
  }
  function outcomeClass(k) {
    if (k === "killed" || k === "dryRunWouldKill") return "out-ok";
    if (k === "notFound") return "out-warn";
    return "out-err";
  }
  function apiUrl(path) {
    return new URL(path, window.location.origin).href;
  }
  async function api(path, opts) {
    var r = await fetch(apiUrl(path), opts);
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
      if (!data.rows.length) { setOut("No TCP listeners right now."); return; }
      var lines = data.rows.map(function (row) {
        return "Port " + row.port + " — " + row.commandName + " (PID " + row.pid + ")";
      });
      setOut(lines.map(function (l) {
        return '<span class="' + outcomeClass("killed") + '">' + escapeHtml(l) + "</span>";
      }).join("<br>"));
    } catch (e) {
      setOut('<span class="out-err">' + escapeHtml(String(e.message || e)) + "</span>");
    }
  };
  document.getElementById("btn-run").onclick = async function () {
    document.getElementById("dry").checked = true;
    await resolvePorts(false);
  };
  document.getElementById("btn-kill").onclick = async function () {
    var msg = "Send a stop signal to processes on these ports? Unsaved work in those apps may be lost.";
    if (!confirm(msg)) return;
    document.getElementById("dry").checked = false;
    await resolvePorts(true);
  };
  async function resolvePorts(forceKill) {
    var tokens = tokensFromInput();
    if (!tokens.length) {
      setOut('<span class="out-err">Add at least one port or range in Targets.</span>');
      return;
    }
    var dryRun = document.getElementById("dry").checked;
    var signal = getSignal();
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
      setOut(html || ("Finished. Exit code " + data.exitCode + "."));
    } catch (e) {
      setOut('<span class="out-err">' + escapeHtml(String(e.message || e)) + "</span>");
    }
  }
})();
  </script>
</body>
</html>`;
}

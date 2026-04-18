import { useState } from "react";

function renderMarkdown(text) {
  const lines = text.split("\n");
  let html = "";
  let inCodeBlock = false;
  let codeLines = [];
  let codeLang = "";
  let inUl = false;
  let inOl = false;

  function closeLists() {
    if (inUl) { html += "</ul>"; inUl = false; }
    if (inOl) { html += "</ol>"; inOl = false; }
  }

  function formatInline(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        html += `<pre class="doc-code-block"><code>${codeLines.join("\n").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>`;
        codeLines = [];
        inCodeBlock = false;
        codeLang = "";
      } else {
        closeLists();
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      closeLists();
      html += `<h1 class="doc-h1">${formatInline(trimmed.slice(2))}</h1>`;
    } else if (trimmed.startsWith("## ")) {
      closeLists();
      html += `<h2 class="doc-h2">${formatInline(trimmed.slice(3))}</h2>`;
    } else if (trimmed.startsWith("### ")) {
      closeLists();
      html += `<h3 class="doc-h3">${formatInline(trimmed.slice(4))}</h3>`;
    } else if (trimmed.startsWith("#### ")) {
      closeLists();
      html += `<h4 class="doc-h4">${formatInline(trimmed.slice(5))}</h4>`;
    } else if (trimmed.startsWith("---")) {
      closeLists();
      html += `<hr class="doc-hr"/>`;
    } else if (trimmed.match(/^[-*]\s+(.+)$/)) {
      if (inOl) { html += "</ol>"; inOl = false; }
      if (!inUl) { html += "<ul class='doc-ul'>"; inUl = true; }
      html += `<li>${formatInline(trimmed.slice(2))}</li>`;
    } else if (trimmed.match(/^(\d+)\.\s+(.+)$/)) {
      const m = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (inUl) { html += "</ul>"; inUl = false; }
      if (!inOl) { html += "<ol class='doc-ol'>"; inOl = true; }
      html += `<li>${formatInline(m[2])}</li>`;
    } else if (trimmed === "") {
      closeLists();
      html += `<div class="doc-spacer"></div>`;
    } else {
      closeLists();
      html += `<p class="doc-p">${formatInline(trimmed)}</p>`;
    }
  }

  closeLists();
  return html;
}

export default function DocPanel({ docs, loading, error, format }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!docs) return;
    navigator.clipboard.writeText(docs).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    if (!docs) return;
    const ext = format === "markdown" ? "md" : format === "jsdoc" ? "js" : format === "docstring" ? "py" : "go";
    const blob = new Blob([docs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documentation.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="doc-panel">
      <div className="panel-header">
        <div className="panel-header-top">
          <h2 className="panel-title">Documentation</h2>
          {docs && (
            <div className="header-actions">
              <button className="btn-ghost" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button className="btn-ghost" onClick={handleDownload}>
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="doc-content">
        {loading && (
          <div className="state-center">
            <div className="generate-loader">
              <div className="loader-ring" />
              <div className="loader-ring delay1" />
              <div className="loader-ring delay2" />
            </div>
            <p className="state-msg">Analyzing code structure...</p>
            <p className="state-sub">CodeLore is reading your code semantically</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-center">
            <span className="state-icon error">⚠</span>
            <p className="state-msg">{error}</p>
          </div>
        )}

        {!docs && !loading && !error && (
          <div className="state-center">
            <div className="empty-illustration">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3 className="empty-title">No documentation yet</h3>
            <p className="state-msg">Paste your code on the left and click Generate docs to get professional documentation instantly.</p>
            <div className="feature-list">
              <div className="feature-item"><span className="feature-dot" />Function descriptions and parameter docs</div>
              <div className="feature-item"><span className="feature-dot" />Realistic usage examples</div>
              <div className="feature-item"><span className="feature-dot" />Edge cases and error handling</div>
              <div className="feature-item"><span className="feature-dot" />Architecture and design notes</div>
            </div>
          </div>
        )}

        {docs && !loading && (
          <div
            className="doc-rendered"
            dangerouslySetInnerHTML={{ __html: format === "markdown" ? renderMarkdown(docs) : `<pre class="doc-output">${docs.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>` }}
          />
        )}
      </div>
    </section>
  );
}

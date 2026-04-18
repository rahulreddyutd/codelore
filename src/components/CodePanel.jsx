import { useRef } from "react";
import { LANGUAGES, DOC_FORMATS, detectLanguage, SAMPLE_CODE } from "../utils/language";

export default function CodePanel({
  code,
  language,
  format,
  loading,
  onCodeChange,
  onLanguageChange,
  onFormatChange,
  onGenerate,
  onLoadSample,
  onClear,
}) {
  const fileInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      onCodeChange(text);
      if (language === "Auto-detect") {
        onLanguageChange(detectLanguage(text));
      }
    };
    reader.readAsText(file);
  }

  const detectedLang = language === "Auto-detect" ? detectLanguage(code) : language;

  return (
    <section className="code-panel">
      <div className="panel-header">
        <div className="panel-header-top">
          <h2 className="panel-title">Code input</h2>
          <div className="header-actions">
            <button className="btn-ghost" onClick={() => fileInputRef.current?.click()}>
              Upload file
            </button>
            <button className="btn-ghost" onClick={onLoadSample}>
              Load example
            </button>
            <button className="btn-ghost" onClick={onClear}>
              Clear
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".js,.jsx,.ts,.tsx,.py,.go,.java,.rs,.cpp,.php,.rb,.sql,.txt"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="panel-controls">
          <div className="control-group">
            <label className="control-label">Language</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="control-select"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {language === "Auto-detect" && code.trim().length > 10 && (
              <span className="detected-badge">Detected: {detectedLang}</span>
            )}
          </div>

          <div className="control-group">
            <label className="control-label">Output format</label>
            <div className="format-pills">
              {DOC_FORMATS.map((f) => (
                <button
                  key={f.id}
                  className={`format-pill ${format === f.id ? "active" : ""}`}
                  onClick={() => onFormatChange(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <textarea
        className="code-editor"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Paste your code here or click Upload file..."
        spellCheck={false}
      />

      <div className="panel-footer">
        <div className="footer-info">
          {code.trim() && (
            <span className="line-count">
              {code.split("\n").length} lines · {code.length} chars
            </span>
          )}
        </div>
        <button
          className="btn-generate"
          onClick={onGenerate}
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Generating...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Generate docs
            </>
          )}
        </button>
      </div>
    </section>
  );
}

import { useState } from "react";
import TopBar from "./components/TopBar";
import CodePanel from "./components/CodePanel";
import DocPanel from "./components/DocPanel";
import { generateDocs } from "./api/claude";
import { detectLanguage, SAMPLE_CODE } from "./utils/language";
import "./index.css";

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Auto-detect");
  const [format, setFormat] = useState("markdown");
  const [docs, setDocs] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setDocs("");

    const resolvedLang = language === "Auto-detect" ? detectLanguage(code) : language;

    try {
      const result = await generateDocs({
        code,
        language: resolvedLang,
        format,
      });
      setDocs(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setCode("");
    setDocs("");
    setError(null);
  }

  return (
    <div className="app">
      <TopBar />
      <div className="main">
        <CodePanel
          code={code}
          language={language}
          format={format}
          loading={loading}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
          onFormatChange={setFormat}
          onGenerate={handleGenerate}
          onLoadSample={() => setCode(SAMPLE_CODE)}
          onClear={handleClear}
        />
        <DocPanel
          docs={docs}
          loading={loading}
          error={error}
          format={format}
        />
      </div>
    </div>
  );
}

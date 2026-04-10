import { useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../services/api";
import { Loader2 } from "lucide-react";

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go"];

interface AnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  optimizedApproach: string;
  antiPatterns: string[];
  explanation: string;
}

export default function CodePage() {
  const [code, setCode] = useState("// Write your code here\n");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState<"analyze" | "explain" | null>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading("analyze");
    setError("");
    try {
      const { data } = await api.post("/code/analyze", { code, language });
      setResult(data.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(null);
    }
  };

  const explain = async () => {
    setLoading("explain");
    setError("");
    try {
      const { data } = await api.post("/code/explain", { code, language });
      setExplanation(data.data.explanation);
    } catch (e: any) {
      setError(e.response?.data?.message || "Explanation failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Code Intelligence</h2>
      <p className="text-gray-500 mb-6">Analyze complexity, detect anti-patterns, and get AI explanations.</p>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-black"
        >
          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button
          onClick={analyze}
          disabled={!!loading}
          className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {loading === "analyze" && <Loader2 size={14} className="animate-spin" />}
          Analyze
        </button>
        <button
          onClick={explain}
          disabled={!!loading}
          className="flex items-center gap-2 border border-black px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
        >
          {loading === "explain" && <Loader2 size={14} className="animate-spin" />}
          Explain
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <Editor
          height="360px"
          language={language}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="light"
          options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false }}
        />
      </div>

      {error && <p className="text-brand-red text-sm mb-4">{error}</p>}

      {result && (
        <div className="border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg">Analysis Result</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Time Complexity</p>
              <p className="font-mono font-semibold">{result.timeComplexity}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Space Complexity</p>
              <p className="font-mono font-semibold">{result.spaceComplexity}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Optimized Approach</p>
            <p className="text-sm">{result.optimizedApproach}</p>
          </div>
          {result.antiPatterns.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Anti-patterns Detected</p>
              <ul className="list-disc list-inside space-y-1">
                {result.antiPatterns.map((p, i) => (
                  <li key={i} className="text-sm text-brand-red">{p}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-1">Explanation</p>
            <p className="text-sm text-gray-700">{result.explanation}</p>
          </div>
        </div>
      )}

      {explanation && (
        <div className="border border-gray-200 rounded-xl p-6 mt-4">
          <h3 className="font-semibold mb-2">Simple Explanation</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{explanation}</p>
        </div>
      )}
    </div>
  );
}

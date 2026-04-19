import { useState, useEffect, useRef, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor as MEditor } from "monaco-editor";
import api from "../services/api";
import {
  Loader2, Trophy, RotateCcw, Play, Send,
  CheckCircle2, XCircle, AlertCircle, Menu, X, Lock,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PracticeQ {
  _id: string; title: string; description: string;
  difficulty: string; category: string;
  starterCode: Record<string, string>;
  testCases: { input: string; expectedOutput: string }[];
  hints?: string[];
  constraints?: string[];
  examples?: { input: string; output: string; explanation?: string }[];
}
interface TCResult  { input: string; expected: string; actual: string; passed: boolean; error?: string; }
interface RunResult { passed: boolean; results: TCResult[]; error?: string; runtime?: string; }
interface LeaderEntry { userId: string; totalScore: number; count: number; }

const DIFF: Record<string, string> = {
  easy:   "bg-green-50 text-green-700 border-green-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  hard:   "bg-red-50 text-red-700 border-red-200",
};

const LANGS = [
  { id: "javascript", label: "JS"   },
  { id: "typescript", label: "TS"   },
  { id: "python",     label: "Py"   },
  { id: "java",       label: "Java" },
  { id: "cpp",        label: "C++"  },
];

function boilerplate(lang: string, q: PracticeQ): string {
  if (q.starterCode?.[lang]) return q.starterCode[lang];
  const n = q.title.toLowerCase().replace(/\s+/g, "_");
  const t: Record<string, string> = {
    javascript: `/**\n * ${q.title}\n * @param {*} args\n * @return {*}\n */\nfunction ${n}() {\n  // your solution here\n}\n`,
    typescript: `/**\n * ${q.title}\n */\nfunction ${n}(): void {\n  // your solution here\n}\n`,
    python:     `# ${q.title}\n\ndef ${n}():\n    # your solution here\n    pass\n`,
    java:       `// ${q.title}\npublic class Solution {\n    public void ${n}() {\n        // your solution here\n    }\n}\n`,
    cpp:        `// ${q.title}\n#include <bits/stdc++.h>\nusing namespace std;\n\nvoid ${n}() {\n    // your solution here\n}\n`,
  };
  return t[lang] ?? `// ${q.title}\n// your solution here\n`;
}

// ── Stable Monaco wrapper ─────────────────────────────────────────────────────
// Mounts ONCE. Language + value changes go through the editor API imperatively.
interface StableEditorProps {
  language: string;
  initialValue: string;
  onCodeChange: (code: string) => void;
  onEditorReady: (editor: MEditor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) => void;
}

function StableEditor({ language, initialValue, onCodeChange, onEditorReady }: StableEditorProps) {
  const handleMount: OnMount = (editor, monaco) => {
    editor.setValue(initialValue);
    onEditorReady(editor, monaco);
    editor.onDidChangeModelContent(() => {
      onCodeChange(editor.getValue());
    });
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      defaultValue={initialValue}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        scrollBeyondLastLine: false,
        tabSize: 2,
        wordWrap: "on",
        lineNumbers: "on",
        automaticLayout: true,
        renderLineHighlight: "line",
        padding: { top: 8 },
      }}
    />
  );
}

// ── Problem list item ─────────────────────────────────────────────────────────
function ProblemItem({ q, active, solved, onClick }: {
  q: PracticeQ; active: boolean; solved: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl border transition ${
        active ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300"
      }`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug line-clamp-2">{q.title}</p>
        {solved && <CheckCircle2 size={13} className="text-green-500 shrink-0 mt-0.5" />}
      </div>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className={`text-xs border rounded-full px-2 py-0.5 ${DIFF[q.difficulty]}`}>{q.difficulty}</span>
        <span className="text-xs text-gray-400 capitalize">{q.category}</span>
      </div>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [questions, setQuestions]       = useState<PracticeQ[]>([]);
  const [solvedIds, setSolvedIds]       = useState<Set<string>>(new Set());
  const [selected, setSelected]         = useState<PracticeQ | null>(null);
  const [language, setLanguage]         = useState("javascript");
  const [runResult, setRunResult]       = useState<RunResult | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"accepted" | "wrong_answer" | "error" | null>(null);
  const [leaderboard, setLeaderboard]   = useState<LeaderEntry[]>([]);
  const [listTab, setListTab]           = useState<"all" | "solved" | "unsolved" | "leaderboard">("all");
  const [mobilePanel, setMobilePanel]   = useState<"problem" | "editor">("problem");
  const [running, setRunning]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  // Imperative refs — never cause re-renders
  const editorRef  = useRef<MEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef  = useRef<typeof import("monaco-editor") | null>(null);
  const codeRef    = useRef("");

  useEffect(() => {
    api.get("/practice/questions").then((r) => setQuestions(r.data.data));
    api.get("/practice/leaderboard").then((r) => setLeaderboard(r.data.data));
    api.get("/practice/submissions").then((r) => {
      const ids = new Set<string>(
        r.data.data
          .filter((s: any) => s.status === "accepted")
          .map((s: any) => {
            const q = s.questionId;
            return (typeof q === "object" && q ? q._id : q)?.toString() ?? "";
          })
          .filter(Boolean)
      );
      setSolvedIds(ids);
    }).catch(() => {});
  }, []);

  const handleEditorReady = useCallback((
    editor: MEditor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) => {
    editorRef.current  = editor;
    monacoRef.current  = monaco;
    codeRef.current    = editor.getValue();
  }, []);

  const handleCodeChange = useCallback((code: string) => {
    codeRef.current = code;
  }, []);

  // Switch language imperatively — no remount, no ERR Canceled
  const changeLanguage = (lang: string) => {
    if (!selected) return;
    const bp = boilerplate(lang, selected);
    setLanguage(lang);
    codeRef.current = bp;
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, lang);
        editorRef.current.setValue(bp);
      }
    }
    setRunResult(null);
    setSubmitStatus(null);
  };

  const selectQuestion = (q: PracticeQ) => {
    const bp = boilerplate(language, q);
    setSelected(q);
    codeRef.current = bp;
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
        editorRef.current.setValue(bp);
      }
    }
    setRunResult(null);
    setSubmitStatus(null);
    setSidebarOpen(false);
    setMobilePanel("editor");
  };

  const resetCode = () => {
    if (!selected) return;
    const bp = boilerplate(language, selected);
    codeRef.current = bp;
    editorRef.current?.setValue(bp);
    setRunResult(null);
    setSubmitStatus(null);
  };

  const run = async () => {
    if (!selected) return;
    setRunning(true); setRunResult(null); setSubmitStatus(null);
    try {
      const { data } = await api.post("/practice/run", {
        questionId: selected._id, code: codeRef.current, language,
      });
      setRunResult(data.data);
    } catch (e: any) {
      setRunResult({ passed: false, results: [], error: e.response?.data?.message || "Server error" });
    } finally { setRunning(false); }
  };

  const submit = async () => {
    if (!selected || !runResult?.passed) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/practice/submit", {
        questionId: selected._id, code: codeRef.current, language,
      });
      const status = data.data.submission.status;
      setSubmitStatus(status);
      if (status === "accepted") setSolvedIds((p) => new Set([...p, selected._id.toString()]));
    } catch { setSubmitStatus("error"); }
    finally { setSubmitting(false); }
  };

  const filtered = questions.filter((q) => {
    const id = q._id.toString();
    if (listTab === "solved")   return solvedIds.has(id);
    if (listTab === "unsolved") return !solvedIds.has(id);
    return true;
  });

  const passedCount = runResult?.results.filter((r) => r.passed).length ?? 0;
  const totalCount  = runResult?.results.length ?? 0;
  const solvedPct   = questions.length ? Math.round((solvedIds.size / questions.length) * 100) : 0;

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex gap-1 p-2 border-b border-gray-100 bg-gray-50 shrink-0">
        {(["all","solved","unsolved"] as const).map((t) => (
          <button key={t} onClick={() => setListTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              listTab === t ? "bg-black text-white" : "text-gray-500 hover:text-black"
            }`}>{t}</button>
        ))}
        <button onClick={() => setListTab("leaderboard")}
          className={`px-2.5 py-1.5 rounded-lg transition ${listTab === "leaderboard" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>
          <Trophy size={12} />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-gray-100 shrink-0">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span><span className="font-semibold text-green-600">{solvedIds.size}</span>/{questions.length} solved</span>
          <span>{solvedPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-green-500 transition-all" style={{ width: `${solvedPct}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {listTab === "leaderboard" ? (
          leaderboard.length === 0
            ? <p className="text-xs text-gray-400 p-2">No submissions yet.</p>
            : leaderboard.map((e, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-5 ${i===0?"text-yellow-500":i===1?"text-gray-400":i===2?"text-amber-600":"text-gray-300"}`}>#{i+1}</span>
                  <span className="text-xs font-medium truncate max-w-[110px]">{e.userId}</span>
                </div>
                <span className="text-xs font-semibold">{e.totalScore} pts</span>
              </div>
            ))
        ) : filtered.length === 0 ? (
          <p className="text-xs text-gray-400 p-2">
            {listTab === "solved" ? "No solved problems yet." : listTab === "unsolved" ? "All solved! 🎉" : "No problems."}
          </p>
        ) : (
          filtered.map((q) => (
            <ProblemItem key={q._id} q={q}
              active={selected?._id === q._id}
              solved={solvedIds.has(q._id.toString())}
              onClick={() => selectQuestion(q)} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-gray-200 bg-white">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 shrink-0 border-r border-gray-100">
        {Sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden absolute inset-0 z-30 flex">
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl z-40">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <span className="font-bold text-sm">Problems</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={15} /></button>
            </div>
            <div className="flex-1 min-h-0">{Sidebar}</div>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-white shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 shrink-0">
            <Menu size={16} />
          </button>
          {selected ? (
            <>
              <span className="text-sm font-semibold truncate">{selected.title}</span>
              <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${DIFF[selected.difficulty]}`}>{selected.difficulty}</span>
              {solvedIds.has(selected._id.toString()) && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold shrink-0">
                  <CheckCircle2 size={11} /> Solved
                </span>
              )}
              <div className="lg:hidden ml-auto flex gap-1">
                {(["problem","editor"] as const).map((p) => (
                  <button key={p} onClick={() => setMobilePanel(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      mobilePanel === p ? "bg-black text-white" : "text-gray-400 hover:text-black"
                    }`}>{p}</button>
                ))}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">Select a problem to start</span>
          )}
        </div>

        {selected ? (
          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* Problem description */}
            <div className={`lg:w-72 lg:shrink-0 lg:border-r lg:border-gray-100 overflow-y-auto p-4 space-y-4
              ${mobilePanel === "problem" ? "flex flex-col flex-1 lg:block" : "hidden lg:block"}`}>
              <div>
                <h3 className="font-bold text-base mb-1">{selected.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
              </div>
              {(selected.examples ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Examples</p>
                  <div className="space-y-2">
                    {selected.examples!.map((ex, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3 text-xs font-mono space-y-1 border border-gray-100">
                        <p><span className="text-gray-400">Input: </span>{ex.input}</p>
                        <p><span className="text-gray-400">Output: </span>{ex.output}</p>
                        {ex.explanation && <p className="text-gray-400 font-sans italic">{ex.explanation}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(selected.constraints ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Constraints</p>
                  <ul className="space-y-1">
                    {selected.constraints!.map((c, i) => (
                      <li key={i} className="text-xs text-gray-500 font-mono">· {c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(selected.hints ?? []).length > 0 && (
                <details>
                  <summary className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-black flex items-center gap-1 list-none">
                    <Lock size={11} /> Hints
                  </summary>
                  <ul className="mt-2 space-y-1.5">
                    {selected.hints!.map((h, i) => (
                      <li key={i} className="text-xs text-gray-600 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">💡 {h}</li>
                    ))}
                  </ul>
                </details>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Test Cases ({selected.testCases.length})
                </p>
                <div className="space-y-1.5">
                  {selected.testCases.slice(0, 3).map((tc, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono border border-gray-100">
                      <span className="text-gray-400">In: </span>{tc.input}
                      <span className="text-gray-400 mx-1">→</span>{tc.expectedOutput}
                    </div>
                  ))}
                  {selected.testCases.length > 3 && (
                    <p className="text-xs text-gray-400">+{selected.testCases.length - 3} hidden</p>
                  )}
                </div>
              </div>
            </div>

            {/* Editor column */}
            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden
              ${mobilePanel === "editor" ? "flex" : "hidden lg:flex"}`}>

              {/* Language bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 bg-gray-50 shrink-0 flex-wrap">
                {LANGS.map((l) => (
                  <button key={l.id} onClick={() => changeLanguage(l.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                      language === l.id ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
                    }`}>{l.label}</button>
                ))}
                <button onClick={resetCode}
                  className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-black transition">
                  <RotateCcw size={11} /> Reset
                </button>
              </div>

              {/* Monaco — single stable instance, never remounts */}
              <div className="flex-1 min-h-0">
                <StableEditor
                  language={language}
                  initialValue={boilerplate(language, selected)}
                  onCodeChange={handleCodeChange}
                  onEditorReady={handleEditorReady}
                />
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white shrink-0 flex-wrap">
                <button onClick={run} disabled={running}
                  className="flex items-center gap-1.5 bg-black text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
                  {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                  Run
                </button>
                <button onClick={submit} disabled={submitting || !runResult?.passed}
                  title={!runResult?.passed ? "Pass all test cases first" : ""}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold border transition ${
                    runResult?.passed ? "bg-green-600 text-white border-green-600 hover:bg-green-700" : "border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}>
                  {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Submit
                </button>
                {submitStatus === "accepted" && <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><CheckCircle2 size={13} /> Accepted! +100 pts</span>}
                {submitStatus === "wrong_answer" && <span className="flex items-center gap-1 text-red-500 text-xs font-semibold"><XCircle size={13} /> Wrong Answer</span>}
                {submitStatus === "error" && <span className="flex items-center gap-1 text-red-500 text-xs font-semibold"><AlertCircle size={13} /> Error</span>}
                {runResult?.runtime && <span className="ml-auto text-xs text-gray-300">{runResult.runtime}</span>}
              </div>

              {/* Test results */}
              {runResult && (
                <div className="border-t border-gray-100 overflow-y-auto shrink-0 max-h-52">
                  <div className={`flex items-center gap-2 px-4 py-2 border-b border-gray-100 sticky top-0 ${
                    runResult.error ? "bg-red-50" : runResult.passed ? "bg-green-50" : "bg-orange-50"
                  }`}>
                    {runResult.error ? <AlertCircle size={13} className="text-red-500" />
                      : runResult.passed ? <CheckCircle2 size={13} className="text-green-600" />
                      : <XCircle size={13} className="text-orange-500" />}
                    <span className="text-xs font-semibold">
                      {runResult.error ? "Compile / Runtime Error"
                        : runResult.passed ? `All ${totalCount} tests passed ✓`
                        : `${passedCount} / ${totalCount} tests passed`}
                    </span>
                  </div>
                  {runResult.error && (
                    <pre className="px-4 py-3 text-xs text-red-600 bg-red-50 overflow-x-auto whitespace-pre-wrap">{runResult.error}</pre>
                  )}
                  {runResult.results.map((r, i) => (
                    <div key={i} className={`px-4 py-2.5 border-b border-gray-50 last:border-0 ${r.passed ? "" : "bg-red-50/30"}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {r.passed ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-red-500" />}
                        <span className="text-xs font-semibold text-gray-500">Case {i + 1}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <div><p className="text-gray-400 mb-0.5">Input</p><p className="bg-gray-100 rounded px-2 py-1 truncate">{r.input}</p></div>
                        <div><p className="text-gray-400 mb-0.5">Expected</p><p className="bg-gray-100 rounded px-2 py-1 truncate">{r.expected}</p></div>
                        <div><p className="text-gray-400 mb-0.5">Got</p>
                          <p className={`rounded px-2 py-1 truncate ${r.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {r.error ? `Err: ${r.error}` : r.actual || "(empty)"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Trophy size={24} className="text-gray-300" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">Pick a problem to start</p>
              <p className="text-sm text-gray-400 mt-1">{questions.length === 0 ? "Loading..." : `${questions.length} problems available`}</p>
            </div>
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm font-semibold">
              <Menu size={14} /> Browse Problems
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

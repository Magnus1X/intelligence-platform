import { useState, useEffect } from "react";
import api from "../services/api";
import {
  CheckCircle2, Circle, Loader2, Sparkles, ChevronRight,
  BookOpen, Save, X, ArrowLeft, ExternalLink,
} from "lucide-react";

interface Topic   { title: string; description: string; resources: string[]; order: number; }
interface Roadmap { _id: string; title: string; type: string; topics: Topic[]; }
interface Progress { roadmapId: string; completedTopics: string[]; }

const TYPE_STYLE: Record<string, string> = {
  internship: "bg-blue-50 text-blue-700 border-blue-200",
  placement:  "bg-purple-50 text-purple-700 border-purple-200",
};

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps]         = useState<Roadmap[]>([]);
  const [selected, setSelected]         = useState<Roadmap | null>(null);
  const [completed, setCompleted]       = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState("");
  const [loadingRec, setLoadingRec]     = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  // mobile: show list or detail
  const [mobileView, setMobileView]     = useState<"list" | "detail">("list");

  useEffect(() => {
    api.get("/roadmaps").then((r) => setRoadmaps(r.data.data));
  }, []);

  const selectRoadmap = async (r: Roadmap) => {
    setSelected(r);
    setRecommendation("");
    setSaved(false);
    setLoadingRoadmap(true);
    setMobileView("detail");
    try {
      const { data } = await api.get("/roadmaps/progress/me");
      const p = (data.data as Progress[]).find((x) => x.roadmapId === r._id);
      setCompleted(p?.completedTopics ?? []);
    } catch {
      setCompleted([]);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const toggleTopic = (title: string) => {
    setSaved(false);
    setCompleted((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const saveProgress = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.post("/roadmaps/progress", {
        roadmapId: selected._id,
        completedTopics: completed,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const getRecommendation = async () => {
    if (!selected) return;
    setLoadingRec(true);
    try {
      const { data } = await api.get(`/roadmaps/${selected._id}/recommend`);
      setRecommendation(data.data.recommendation);
    } finally {
      setLoadingRec(false);
    }
  };

  const pct = selected
    ? Math.round((completed.length / (selected.topics.length || 1)) * 100)
    : 0;

  const sortedTopics = selected
    ? [...selected.topics].sort((a, b) => a.order - b.order)
    : [];

  // ── Roadmap list panel ────────────────────────────────────────────────────
  const ListPanel = (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-3">
        Choose a path
      </p>
      {roadmaps.length === 0 && (
        <p className="text-sm text-gray-400 px-1">No roadmaps seeded yet.</p>
      )}
      {roadmaps.map((r) => (
        <button
          key={r._id}
          onClick={() => selectRoadmap(r)}
          className={`w-full text-left border rounded-2xl px-4 py-4 transition group ${
            selected?._id === r._id
              ? "border-black bg-gray-50"
              : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">{r.title}</p>
              <span className={`inline-block mt-1.5 text-xs border rounded-full px-2 py-0.5 capitalize ${TYPE_STYLE[r.type] ?? "bg-gray-100 text-gray-500"}`}>
                {r.type}
              </span>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition mt-0.5 shrink-0" />
          </div>
        </button>
      ))}
    </div>
  );

  // ── Detail panel ──────────────────────────────────────────────────────────
  const DetailPanel = selected ? (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          {/* Mobile back button */}
          <button
            onClick={() => setMobileView("list")}
            className="lg:hidden flex items-center gap-1 text-xs text-gray-400 hover:text-black mb-2 transition"
          >
            <ArrowLeft size={13} /> All Roadmaps
          </button>
          <h3 className="font-bold text-xl">{selected.title}</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {completed.length} of {selected.topics.length} topics completed
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={getRecommendation}
            disabled={loadingRec}
            className="flex items-center gap-1.5 border border-gray-300 hover:border-black px-3 py-1.5 rounded-xl text-sm font-medium disabled:opacity-50 transition"
          >
            {loadingRec
              ? <Loader2 size={13} className="animate-spin" />
              : <Sparkles size={13} className="text-yellow-500" />}
            AI Tip
          </button>
          <button
            onClick={saveProgress}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition ${
              saved
                ? "bg-green-600 text-white"
                : "bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            }`}
          >
            {saving
              ? <Loader2 size={13} className="animate-spin" />
              : <Save size={13} />}
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-black">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* AI recommendation */}
      {recommendation && (
        <div className="border border-yellow-200 bg-yellow-50 rounded-2xl p-4 relative">
          <button
            onClick={() => setRecommendation("")}
            className="absolute top-3 right-3 text-gray-300 hover:text-black transition"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-yellow-500" />
            <p className="text-xs font-semibold text-yellow-700">AI Recommendation</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed pr-4">{recommendation}</p>
        </div>
      )}

      {/* Topics — timeline style */}
      {loadingRoadmap ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={22} className="animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gray-100 hidden sm:block" />

          <div className="space-y-3">
            {sortedTopics.map((topic, idx) => {
              const done = completed.includes(topic.title);
              const isLast = idx === sortedTopics.length - 1;

              return (
                <div
                  key={topic.title}
                  onClick={() => toggleTopic(topic.title)}
                  className={`relative flex gap-4 cursor-pointer group`}
                >
                  {/* Timeline dot */}
                  <div className="hidden sm:flex shrink-0 flex-col items-center" style={{ width: 44 }}>
                    <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                      done
                        ? "bg-green-500 border-green-500"
                        : "bg-white border-gray-300 group-hover:border-black"
                    }`}>
                      {done
                        ? <CheckCircle2 size={13} className="text-white" />
                        : <span className="text-[9px] font-bold text-gray-400">{idx + 1}</span>
                      }
                    </div>
                    {!isLast && <div className="flex-1 w-px bg-transparent" />}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 border rounded-2xl p-4 transition-all mb-1 ${
                    done
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Mobile-only circle */}
                        <div className={`sm:hidden shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          done ? "bg-green-500 border-green-500" : "border-gray-300"
                        }`}>
                          {done && <CheckCircle2 size={11} className="text-white" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold leading-snug ${done ? "text-green-800" : "text-gray-800"}`}>
                            {topic.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {done
                          ? <CheckCircle2 size={16} className="text-green-500" />
                          : <Circle size={16} className="text-gray-200 group-hover:text-gray-400 transition" />
                        }
                      </div>
                    </div>

                    {/* Resources */}
                    {topic.resources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {topic.resources.map((res, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-500 px-2.5 py-0.5 rounded-full"
                          >
                            <BookOpen size={10} />
                            {res}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion banner */}
          {pct === 100 && (
            <div className="mt-4 bg-black text-white rounded-2xl p-5 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-bold">Roadmap Complete!</p>
              <p className="text-sm text-gray-400 mt-1">You've finished all topics in this path.</p>
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="hidden lg:flex flex-1 items-center justify-center text-gray-300 text-sm flex-col gap-3">
      <ExternalLink size={32} className="text-gray-200" />
      <p>Select a roadmap to get started</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Roadmap Guidance</h2>
        <p className="text-gray-400 text-sm">Follow structured paths and track your progress.</p>
      </div>

      {/* ── Desktop: side-by-side | Mobile: toggle views ── */}
      <div className="flex-1 flex gap-6 min-h-0">

        {/* List — hidden on mobile when detail is open */}
        <div className={`
          lg:w-64 lg:shrink-0 lg:block lg:overflow-y-auto
          ${mobileView === "list" ? "block w-full" : "hidden"}
        `}>
          {ListPanel}
        </div>

        {/* Detail — full width on mobile */}
        <div className={`
          flex-1 overflow-y-auto
          ${mobileView === "detail" ? "block" : "hidden lg:block"}
        `}>
          {DetailPanel}
        </div>
      </div>
    </div>
  );
}

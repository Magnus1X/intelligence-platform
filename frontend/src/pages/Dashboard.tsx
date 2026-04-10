import { useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  Code2, Brain, BookOpen, Map, TrendingUp, CheckCircle2,
  Target, Flame, ArrowRight, Clock, X, ExternalLink,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SolvedQ   { _id: string; title: string; difficulty: string; category: string; tags?: string[] }
interface Submission { _id: string; questionId: { _id: string; title: string; difficulty: string } | null; status: string; language: string; runtime?: string; passedCases?: number; totalCases?: number; createdAt: string }
interface Session    { _id: string; role: string; status: string; createdAt: string }

interface Stats {
  isNew: boolean; userName: string;
  practice: {
    total: number; solved: number; attempted: number;
    diffBreakdown: { easy: number; medium: number; hard: number };
    categoryBreakdown: Record<string, number>;
    solvedQuestions: SolvedQ[];
    attemptedQuestions: SolvedQ[];
    allSubmissions: Submission[];
  };
  interview: {
    totalSessions: number; completedSessions: number; avgScore: number;
    allSessions: Session[]; weakAreas: string[];
  };
  roadmapProgress: { title: string; completed: number; total: number; pct: number }[];
  activity: { _id: string; count: number; accepted: number }[];
}

type DrawerType = "solved" | "attempted" | "submissions" | "interviews" | null;

// ── Drawer ────────────────────────────────────────────────────────────────────
function Drawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </>
  );
}

// ── Ring ──────────────────────────────────────────────────────────────────────
function Ring({ pct, size = 88, stroke = 9, color = "#16a34a" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray .6s ease" }} />
    </svg>
  );
}

// ── Activity bars ─────────────────────────────────────────────────────────────
function ActivityBar({ activity }: { activity: Stats["activity"] }) {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d   = new Date(Date.now() - (13 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const lbl = d.toLocaleDateString("en", { weekday: "short" }).slice(0, 1);
    const f   = activity.find((a) => a._id === key);
    return { key, lbl, count: f?.count || 0, accepted: f?.accepted || 0 };
  });
  const max = Math.max(...days.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {days.map((d) => (
        <div key={d.key} className="flex-1 flex flex-col items-center gap-0.5 group relative">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
            {d.key}: {d.count}
          </div>
          <div className="w-full rounded-sm transition-all"
            style={{ height: `${(d.count/max)*56}px`, minHeight: d.count ? "4px" : "2px",
              backgroundColor: d.accepted > 0 ? "#16a34a" : d.count > 0 ? "#d1d5db" : "#f3f4f6" }} />
          <span className="text-[9px] text-gray-300">{d.lbl}</span>
        </div>
      ))}
    </div>
  );
}

// ── Badges ────────────────────────────────────────────────────────────────────
const DIFF: Record<string, string> = {
  easy:   "bg-green-50 text-green-700 border-green-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  hard:   "bg-red-50 text-red-700 border-red-200",
};
const STATUS_COLOR: Record<string, string> = {
  accepted:    "text-green-600",
  wrong_answer:"text-red-500",
  error:       "text-orange-500",
};
const STATUS_LABEL: Record<string, string> = {
  accepted:    "Accepted",
  wrong_answer:"Wrong Answer",
  error:       "Error",
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, isNewUser } = useAuth();
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [drawer, setDrawer]   = useState<DrawerType>(null);

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((r) => {
        setStats(r.data.data);
        setError(null);
      })
      .catch((e: any) => {
        setError(e.response?.data?.message || "Unable to load dashboard stats right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "";
  const p  = stats?.practice;
  const iv = stats?.interview;
  const solvedPct = p ? Math.round((p.solved / (p.total || 1)) * 100) : 0;
  const topCats   = p ? Object.entries(p.categoryBreakdown).sort((a,b) => b[1]-a[1]).slice(0,4) : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="border border-red-200 bg-red-50 text-red-700 rounded-2xl px-5 py-4">
        <p className="text-sm font-medium">Couldn&apos;t load your dashboard stats.</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    </div>
  );

  // ── Drawer content ──────────────────────────────────────────────────────────
  const drawerContent: Record<NonNullable<DrawerType>, { title: string; node: ReactNode }> = {
    solved: {
      title: `Solved Problems (${p?.solved ?? 0})`,
      node: (
        <div className="space-y-2">
          {(p?.solvedQuestions ?? []).length === 0
            ? <p className="text-sm text-gray-400">No solved problems yet.</p>
            : (p?.solvedQuestions ?? []).map((q) => (
              <Link key={q._id} to="/practice"
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:border-black transition group">
                <div>
                  <p className="text-sm font-medium group-hover:underline">{q.title}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{q.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs border rounded-full px-2 py-0.5 ${DIFF[q.difficulty]}`}>{q.difficulty}</span>
                  <CheckCircle2 size={14} className="text-green-500" />
                </div>
              </Link>
            ))
          }
        </div>
      ),
    },
    attempted: {
      title: `Attempted (${p?.attempted ?? 0})`,
      node: (
        <div className="space-y-2">
          {(p?.attemptedQuestions ?? []).length === 0
            ? <p className="text-sm text-gray-400">All attempted problems are solved!</p>
            : (p?.attemptedQuestions ?? []).map((q) => (
              <Link key={q._id} to="/practice"
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:border-black transition group">
                <div>
                  <p className="text-sm font-medium group-hover:underline">{q.title}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{q.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs border rounded-full px-2 py-0.5 ${DIFF[q.difficulty]}`}>{q.difficulty}</span>
                  <ExternalLink size={13} className="text-gray-300" />
                </div>
              </Link>
            ))
          }
        </div>
      ),
    },
    submissions: {
      title: "All Submissions",
      node: (
        <div className="space-y-2">
          {(p?.allSubmissions ?? []).length === 0
            ? <p className="text-sm text-gray-400">No submissions yet.</p>
            : (p?.allSubmissions ?? []).map((s) => (
              <div key={s._id} className="border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.questionId?.title ?? "Unknown"}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-xs font-semibold ${STATUS_COLOR[s.status]}`}>
                        {s.status === "accepted" ? "✓" : "✗"} {STATUS_LABEL[s.status]}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{s.language}</span>
                      {s.runtime && <><span className="text-xs text-gray-300">·</span><span className="text-xs text-gray-400">{s.runtime}</span></>}
                      {s.passedCases !== undefined && (
                        <><span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{s.passedCases}/{s.totalCases} cases</span></>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {s.questionId?.difficulty && (
                      <span className={`text-xs border rounded-full px-2 py-0.5 ${DIFF[s.questionId.difficulty]}`}>
                        {s.questionId.difficulty}
                      </span>
                    )}
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(s.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      ),
    },
    interviews: {
      title: `Interview Sessions (${iv?.totalSessions ?? 0})`,
      node: (
        <div className="space-y-2">
          {(iv?.allSessions ?? []).length === 0
            ? <p className="text-sm text-gray-400">No sessions yet.</p>
            : (iv?.allSessions ?? []).map((s) => (
              <div key={s._id} className="border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(s.createdAt).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    s.status === "completed" ? "bg-green-50 text-green-700 border-green-200"
                    : s.status === "active"  ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}>{s.status}</span>
                </div>
              </div>
            ))
          }
        </div>
      ),
    },
  };

  return (
    <div className="space-y-6 pb-8">

      {/* ── Greeting ── */}
      <div>
        {isNewUser
          ? <h2 className="text-2xl font-bold mb-1">Welcome, <span className="text-black">{firstName}</span> 👋 <span className="text-sm font-normal text-gray-400 ml-2">First time here? Let's get started!</span></h2>
          : <h2 className="text-2xl font-bold mb-1">Welcome back, <span className="text-red-600">{firstName}</span> 👋</h2>
        }
        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>

      {/* ── Stat cards — clickable ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "solved",      label: "Problems Solved",     value: p?.solved ?? 0,             sub: `of ${p?.total ?? 0} total`,          icon: CheckCircle2, color: "text-green-600",  bg: "bg-green-50",  drawer: "solved"      as DrawerType },
          { key: "attempted",   label: "Attempted",           value: p?.attempted ?? 0,          sub: "unique problems",                    icon: Target,       color: "text-blue-600",   bg: "bg-blue-50",   drawer: "attempted"   as DrawerType },
          { key: "interviews",  label: "Interviews Done",     value: iv?.completedSessions ?? 0, sub: `${iv?.totalSessions ?? 0} started`,  icon: Brain,        color: "text-purple-600", bg: "bg-purple-50", drawer: "interviews"  as DrawerType },
          { key: "score",       label: "Avg Interview Score", value: `${iv?.avgScore ?? 0}`,     sub: "out of 100",                         icon: TrendingUp,   color: "text-orange-600", bg: "bg-orange-50", drawer: "submissions" as DrawerType },
        ].map(({ key, label, value, sub, icon: Icon, color, bg, drawer: d }) => (
          <button key={key} onClick={() => setDrawer(d)}
            className="border border-gray-200 rounded-2xl p-5 text-left hover:border-black hover:shadow-sm transition group cursor-pointer">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
            <p className="text-xs text-gray-300 mt-2 group-hover:text-gray-500 transition">Click to view →</p>
          </button>
        ))}
      </div>

      {/* ── Row 2: Ring + Activity + Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-2xl p-5">
          <p className="text-sm font-semibold mb-4">Problem Progress</p>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <Ring pct={solvedPct} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{solvedPct}%</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {(["easy","medium","hard"] as const).map((d) => {
                const val   = p?.diffBreakdown[d] ?? 0;
                const total = d === "easy" ? 10 : d === "medium" ? 8 : 4;
                return (
                  <div key={d}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="capitalize text-gray-500">{d}</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${d==="easy"?"bg-green-500":d==="medium"?"bg-yellow-400":"bg-red-500"}`}
                        style={{ width: `${Math.min((val/total)*100,100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">14-Day Activity</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block"/>Accepted</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-300 inline-block"/>Tried</span>
            </div>
          </div>
          <ActivityBar activity={stats?.activity ?? []} />
        </div>

        <div className="border border-gray-200 rounded-2xl p-5">
          <p className="text-sm font-semibold mb-4">Solved by Category</p>
          {topCats.length === 0
            ? <p className="text-xs text-gray-400">No solved problems yet.</p>
            : <div className="space-y-2.5">
                {topCats.map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="capitalize text-gray-600">{cat}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-black"
                        style={{ width: `${(count/(topCats[0][1]||1))*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* ── Row 3: Recent submissions + Recent interviews + Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent submissions */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Recent Submissions</p>
            <button onClick={() => setDrawer("submissions")}
              className="text-xs text-gray-400 hover:text-black flex items-center gap-1 transition">
              View all <ArrowRight size={11} />
            </button>
          </div>
          {(p?.allSubmissions ?? []).length === 0
            ? <p className="text-xs text-gray-400">No submissions yet. <Link to="/practice" className="underline">Start →</Link></p>
            : <div className="space-y-2">
                {(p?.allSubmissions ?? []).slice(0,6).map((s,i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs font-bold shrink-0 ${STATUS_COLOR[s.status]}`}>
                        {s.status === "accepted" ? "✓" : "✗"}
                      </span>
                      <span className="text-xs text-gray-700 truncate">{s.questionId?.title ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {s.questionId?.difficulty && (
                        <span className={`text-xs border rounded-full px-1.5 py-0.5 ${DIFF[s.questionId.difficulty]}`}>
                          {s.questionId.difficulty}
                        </span>
                      )}
                      <span className="text-xs text-gray-300">{s.language}</span>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Recent interviews */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Recent Interviews</p>
            <button onClick={() => setDrawer("interviews")}
              className="text-xs text-gray-400 hover:text-black flex items-center gap-1 transition">
              View all <ArrowRight size={11} />
            </button>
          </div>
          {(iv?.allSessions ?? []).length === 0
            ? <p className="text-xs text-gray-400">No sessions yet. <Link to="/interview" className="underline">Start one →</Link></p>
            : <div className="space-y-2">
                {(iv?.allSessions ?? []).slice(0,5).map((s,i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain size={13} className="text-gray-400 shrink-0"/>
                      <span className="text-xs text-gray-700">{s.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${s.status==="completed"?"text-green-600":"text-gray-400"}`}>{s.status}</span>
                      <span className="text-xs text-gray-300">{new Date(s.createdAt).toLocaleDateString("en",{month:"short",day:"numeric"})}</span>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Insights */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={15} className="text-orange-500"/>
            <p className="text-sm font-semibold">Insights & Focus Areas</p>
          </div>
          <div className="space-y-3">
            {(iv?.weakAreas ?? []).length > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-orange-600 mb-1">Work on these categories</p>
                <div className="flex flex-wrap gap-1">
                  {(iv?.weakAreas ?? []).map((w) => (
                    <span key={w} className="text-xs bg-white border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full capitalize">{w}</span>
                  ))}
                </div>
              </div>
            )}
            {iv && iv.completedSessions > 0 && (
              <div className={`rounded-xl p-3 border ${iv.avgScore>=70?"bg-green-50 border-green-100":"bg-yellow-50 border-yellow-100"}`}>
                <p className={`text-xs font-semibold mb-1 ${iv.avgScore>=70?"text-green-700":"text-yellow-700"}`}>Interview Performance</p>
                <p className="text-xs text-gray-600">
                  {iv.avgScore>=70 ? `Great job! Avg ${iv.avgScore}/100. Keep it up.` : `Avg ${iv.avgScore}/100. Focus on explaining your thought process clearly.`}
                </p>
              </div>
            )}
            {(stats?.roadmapProgress ?? []).map((r) => (
              <div key={r.title} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700 truncate">{r.title}</span>
                  <span className="text-gray-400 shrink-0 ml-2">{r.pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-black transition-all" style={{ width: `${r.pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{r.completed}/{r.total} topics done</p>
              </div>
            ))}
            {isNewUser && (
              <div className="bg-black text-white rounded-xl p-3">
                <p className="text-xs font-semibold mb-1">Where to start?</p>
                <p className="text-xs text-gray-300 mb-2">Try an easy problem first, then set up your roadmap.</p>
                <Link to="/practice" className="text-xs underline text-white flex items-center gap-1">Go to Practice <ArrowRight size={11}/></Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick nav ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { to:"/code",      icon:Code2,    label:"Code Intelligence", sub:"Analyze & explain"              },
          { to:"/interview", icon:Brain,    label:"Interview Prep",    sub:"Mock sessions"                  },
          { to:"/practice",  icon:BookOpen, label:"Practice",          sub:`${p?.solved??0}/${p?.total??0} solved` },
          { to:"/roadmap",   icon:Map,      label:"Roadmap",           sub:"Track progress"                 },
        ].map(({ to, icon:Icon, label, sub }) => (
          <Link key={to} to={to}
            className="border border-gray-200 rounded-2xl p-4 hover:border-black transition group flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition">
              <Icon size={16}/>
            </div>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
            <Clock size={13} className="ml-auto text-gray-200 group-hover:text-gray-400 transition"/>
          </Link>
        ))}
      </div>

      {/* ── Drawers ── */}
      {drawer && (
        <Drawer open={!!drawer} title={drawerContent[drawer].title} onClose={() => setDrawer(null)}>
          {drawerContent[drawer].node}
        </Drawer>
      )}

    </div>
  );
}

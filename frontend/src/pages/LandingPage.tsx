import { useNavigate } from "react-router-dom";
import { Code2, Brain, BookOpen, Map, ArrowRight, Zap, Shield, Users, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Code Intelligence",
    desc: "Paste any code and get instant AI analysis — time complexity, space complexity, anti-pattern detection, and plain-English explanations.",
    tag: "AI Powered",
  },
  {
    icon: Brain,
    title: "Interview Preparation",
    desc: "Role-specific mock interviews with a live timer. Get scored and receive detailed feedback on every answer from our AI evaluator.",
    tag: "Mock Sessions",
  },
  {
    icon: BookOpen,
    title: "Practice Platform",
    desc: "Curated coding problems across difficulty levels. Submit solutions, track your progress, and compete on the leaderboard.",
    tag: "Leaderboard",
  },
  {
    icon: Map,
    title: "Roadmap Guidance",
    desc: "Structured internship and placement roadmaps. Check off topics as you go and get personalized AI study tips for what's next.",
    tag: "Structured Path",
  },
];

const steps = [
  { num: "01", title: "Create your account", desc: "Sign up in seconds — no credit card required." },
  { num: "02", title: "Pick your goal", desc: "Crack an interview, sharpen your code, or follow a roadmap." },
  { num: "03", title: "Practice with AI", desc: "Get real-time feedback, scores, and recommendations." },
  { num: "04", title: "Track your growth", desc: "Watch your skills improve session by session." },
];

const stats = [
  { value: "4", label: "Core Modules" },
  { value: "AI", label: "Powered Analysis" },
  { value: "∞", label: "Practice Problems" },
  { value: "24/7", label: "Available" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Intelligence Platform</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="flex items-center gap-1.5 bg-black text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-800 transition"
            >
              Get Started <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-12">

          {/* Left — text */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Zap size={12} className="text-black" />
              AI-powered developer growth platform
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Go from learning
              <br />
              to <span className="underline decoration-4 underline-offset-4">landing the job</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mb-10">
              Analyze your code, ace mock interviews, solve practice problems, and follow
              structured roadmaps — all in one place, powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="flex items-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition text-sm"
              >
                Start for free <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/auth?mode=login")}
                className="flex items-center gap-2 border border-gray-300 font-semibold px-6 py-3 rounded-xl hover:border-black transition text-sm"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* Right — image slot */}
          <div className="hidden lg:flex w-[480px] shrink-0 h-[380px] rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center bg-gray-50 text-gray-300 text-sm select-none">
            Drop your image here
          </div>

        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-100 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Everything you need to level up</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Four focused modules, each backed by AI, designed to take you from beginner to job-ready.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, desc, tag }) => (
            <div
              key={title}
              className="group border border-gray-200 rounded-2xl p-7 hover:border-black transition cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-black text-white rounded-xl group-hover:bg-gray-800 transition">
                  <Icon size={20} />
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How it works</h2>
            <p className="text-gray-500 text-sm">Four simple steps to accelerate your career.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="bg-white border border-gray-200 rounded-2xl p-6">
                <p className="text-4xl font-extrabold text-gray-100 mb-3">{s.num}</p>
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature spotlight ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <Shield size={22} className="mb-4" />
            <h3 className="font-bold mb-2">Secure by default</h3>
            <p className="text-sm text-gray-500">JWT authentication, bcrypt-hashed passwords, and role-based access control.</p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6">
            <Zap size={22} className="mb-4" />
            <h3 className="font-bold mb-2">Multi-key AI</h3>
            <p className="text-sm text-gray-500">Load-balanced Gemini API keys with automatic fallback — zero downtime on AI features.</p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6">
            <Users size={22} className="mb-4" />
            <h3 className="font-bold mb-2">Leaderboard</h3>
            <p className="text-sm text-gray-500">Compete with other developers on the practice platform and track your rank in real time.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-black text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to get started?</h2>
        <p className="text-gray-400 mb-8 text-sm max-w-sm mx-auto">
          Join developers who are using AI to prepare smarter and land better roles.
        </p>
        <button
          onClick={() => navigate("/auth?mode=register")}
          className="inline-flex items-center gap-2 bg-white text-black font-semibold px-7 py-3 rounded-xl hover:bg-gray-100 transition text-sm"
        >
          Create free account <ArrowRight size={16} />
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-6 px-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Intelligence Platform. Built with React, Node.js & Gemini AI.
      </footer>
    </div>
  );
}

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
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-50" />
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left — text */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-4 py-2 rounded-full mb-8 border border-gray-200">
              <Zap size={14} className="text-yellow-500" />
              AI-powered developer growth platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
              Go from learning
              <br className="hidden lg:block" />
              to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">landing the job</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Analyze your code, ace mock interviews, solve practice problems, and follow
              structured roadmaps — all in one place, powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all text-sm shadow-xl shadow-black/10"
              >
                Start for free <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/auth?mode=login")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-gray-200 font-semibold px-8 py-4 rounded-xl hover:border-black hover:bg-gray-50 transition-all text-sm"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* Right — image slot */}
          <div className="w-full lg:w-[540px] shrink-0 flex justify-center">
            <div className="relative group w-full">
              <img 
                src="/assets/coding.png" 
                alt="Developer Coding" 
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-100 py-16 px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x divide-gray-200">
          {stats.map((s) => (
            <div key={s.label} className="px-4">
              <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">{s.value}</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Everything you need to level up</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Four focused modules, each backed by AI, designed to take you from beginner to job-ready.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map(({ icon: Icon, title, desc, tag }) => (
            <div
              key={title}
              className="group border border-gray-200 bg-white rounded-3xl p-8 hover:border-black hover:shadow-lg transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-gray-50 text-black rounded-2xl group-hover:bg-black group-hover:text-white transition-colors duration-300 border border-gray-100 group-hover:border-black">
                  <Icon size={24} />
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-semibold tracking-wide">
                  {tag}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-32 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">How it works</h2>
            <p className="text-gray-500 text-lg">Four simple steps to accelerate your career.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="bg-white border border-gray-200 rounded-3xl p-8 relative overflow-hidden group hover:border-black hover:shadow-md transition-all">
                <p className="text-6xl font-extrabold text-gray-50 absolute -top-4 -right-4 group-hover:text-gray-100 transition-colors select-none">{s.num}</p>
                <div className="relative z-10">
                  <p className="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase">Step {s.num}</p>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature spotlight ── */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="border-t-2 border-gray-900 pt-8">
            <Shield size={28} className="mb-6 text-gray-900" />
            <h3 className="font-bold text-xl mb-3">Secure by default</h3>
            <p className="text-gray-500 leading-relaxed">JWT authentication, bcrypt-hashed passwords, and role-based access control to keep your data completely safe.</p>
          </div>
          <div className="border-t-2 border-gray-200 pt-8">
            <Zap size={28} className="mb-6 text-gray-900" />
            <h3 className="font-bold text-xl mb-3">Multi-key AI</h3>
            <p className="text-gray-500 leading-relaxed">Load-balanced Gemini API keys with automatic fallback mechanisms. Enjoy zero downtime on critical AI features.</p>
          </div>
          <div className="border-t-2 border-gray-200 pt-8">
            <Users size={28} className="mb-6 text-gray-900" />
            <h3 className="font-bold text-xl mb-3">Leaderboard</h3>
            <p className="text-gray-500 leading-relaxed">Compete with other developers on the practice platform, earn points, and track your global rank in real time.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 bg-black text-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-900 rounded-full blur-3xl opacity-50" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to get started?</h2>
          <p className="text-gray-400 mb-10 text-lg max-w-lg mx-auto leading-relaxed">
            Join developers who are using AI to prepare smarter, code faster, and land better roles.
          </p>
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="inline-flex items-center gap-3 bg-white text-black font-bold px-10 py-5 rounded-2xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all text-base shadow-xl"
          >
            Create free account <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-10 px-6 text-center text-sm text-gray-400 bg-white">
        <p>© {new Date().getFullYear()} Intelligence Platform. Built with React, Node.js & Gemini AI.</p>
      </footer>
    </div>
  );
}

import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, token } = useAuth();
  const navigate = useNavigate();

  // If already logged in, skip straight to dashboard
  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  // Sync mode when URL param changes
  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "register" || m === "login") setMode(m);
  }, [searchParams]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password, college, yearOfStudy, address);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Your AI-powered<br />developer platform.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Analyze code, ace interviews, solve problems, and follow structured roadmaps — all in one place.
          </p>
          <div className="mt-10 space-y-3">
            {["Code Intelligence Engine", "AI Mock Interviews with Timer", "Practice & Leaderboard", "Internship Roadmaps"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} Intelligence Platform</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">

        {/* Mobile back link */}
        <div className="lg:hidden w-full max-w-sm mb-6">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {mode === "login"
              ? "Enter your credentials to continue."
              : "It's free — no credit card required."}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Full name</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition"
                    placeholder="Magnus"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">College</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition"
                    placeholder="University Name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Year of Study</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition"
                      placeholder="e.g. 3rd Year"
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Address</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition"
                      placeholder="City, Country"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 disabled:opacity-50 transition mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-black font-semibold hover:underline"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

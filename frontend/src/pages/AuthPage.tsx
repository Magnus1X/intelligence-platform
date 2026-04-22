import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";


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
  const [loading, setLoading] = useState(false);
  const { login, register, googleLogin, token } = useAuth();
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
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Logged in successfully");
      } else {
        await register(name, email, password, college, yearOfStudy, address);
        toast.success("Account created successfully");
      }
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-black text-white flex-col p-12 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        {/* Top: Back Link */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
        
        {/* Middle: Content */}
        <div className="relative z-10 my-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Your AI-powered<br />developer platform.
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm mb-12">
            Analyze code, ace interviews, solve problems, and follow structured roadmaps — all in one place.
          </p>
          <div className="space-y-5">
            {[
              "Code Intelligence Engine", 
              "AI Mock Interviews with Timer", 
              "Practice & Leaderboard", 
              "Internship Roadmaps"
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm font-medium text-white/80">
                <CheckCircle2 size={18} className="text-white/40" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="relative z-10">
          <p className="text-white/30 text-sm font-medium">© {new Date().getFullYear()} Intelligence Platform</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-20 relative overflow-y-auto">
        {/* Mobile back link */}
        <div className="absolute top-8 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <div className="w-full max-w-[400px] my-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-500 text-sm">
              {mode === "login"
                ? "Enter your credentials to access your account."
                : "It's free — no credit card required."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Full name</label>
                  <input
                    className="w-full border border-gray-300 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Magnus"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">College</label>
                  <input
                    className="w-full border border-gray-300 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="University Name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Year of Study</label>
                    <input
                      className="w-full border border-gray-300 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="e.g. 3rd Year"
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Address</label>
                    <input
                      className="w-full border border-gray-300 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="City, Country"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Email address</label>
              <input
                className="w-full border border-gray-300 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Password</label>
              <input
                className="w-full border border-gray-300 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
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
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all mt-6 shadow-md shadow-black/10"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
              Or continue with Google
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
                window.location.href = `${baseUrl}/api/auth/google`;
              }}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm mt-8 text-gray-500 font-medium">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-black font-bold hover:underline"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

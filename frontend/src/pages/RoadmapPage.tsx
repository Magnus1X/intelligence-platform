import { Map, Sparkles, Bell } from "lucide-react";
import { useState } from "react";

export default function RoadmapPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="flex items-center justify-center h-full w-full relative overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-sky-200/40 to-cyan-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        
        {/* Icon cluster */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
            <Map size={32} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles size={14} className="text-white" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Coming Soon
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-2">
          We're building personalized learning roadmaps powered by AI — tailored to your goals, skill level, and dream role.
        </p>
        <p className="text-xs text-gray-400 mb-8">
          Internship & Placement tracks · Progress tracking · Smart recommendations
        </p>

        {/* CTA */}
        <button
          onClick={() => setNotified(true)}
          disabled={notified}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md ${
            notified
              ? "bg-green-50 text-green-600 border border-green-200 cursor-default shadow-none"
              : "bg-black text-white hover:bg-gray-800 hover:scale-[1.03] active:scale-[0.97] shadow-black/15"
          }`}
        >
          <Bell size={15} className={notified ? "animate-none" : ""} />
          {notified ? "You'll be notified!" : "Notify me when it's ready"}
        </button>

        {/* Decorative dots */}
        <div className="flex items-center gap-1.5 mt-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-300"
              style={{
                animationName: "pulse",
                animationDuration: "1.5s",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

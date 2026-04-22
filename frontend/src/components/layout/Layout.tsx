import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Code2, Brain, BookOpen, Map, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard"        },
  { to: "/code",      icon: Code2,           label: "Code Intelligence" },
  { to: "/interview", icon: Brain,           label: "Interview Prep"    },
  { to: "/practice",  icon: BookOpen,        label: "Practice"          },
  { to: "/roadmap",   icon: Map,             label: "Roadmap"           },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isPractice = pathname.startsWith("/practice");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="shrink-0 border-b border-gray-200 md:flex md:h-full md:w-60 md:flex-col md:border-b-0 md:border-r">
        {/* Logo + mobile logout */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 md:block md:px-6 md:py-6">
          <h1 className="font-bold text-base leading-tight">
            Intelligence<span className="hidden md:inline"><br /></span>
            <span className="md:hidden"> </span>Platform
          </h1>
          <button onClick={logout}
            className="md:hidden rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-black transition">
            Logout
          </button>
        </div>

        {/* Nav */}
        <div className="overflow-x-auto scrollbar-hide border-b border-gray-100 md:flex-1 md:overflow-visible md:border-b-0">
          <nav className="flex min-w-max gap-1 px-3 py-2 md:min-w-0 md:flex-col md:p-3">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
                    isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                  }`
                }>
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
            
            {/* Mobile-only Profile Link */}
            <NavLink to="/profile"
              className={({ isActive }) =>
                `md:hidden flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
                  isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`
              }>
              <UserIcon size={15} />
              Profile
            </NavLink>
          </nav>
        </div>

        {/* Desktop user + logout */}
        <div className="mt-auto hidden border-t border-gray-200 p-4 md:block space-y-2">
          <NavLink to="/profile"
            className={({ isActive }) => 
              `flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                isActive ? "border-black bg-black text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-black"
              }`
            }>
            <UserIcon size={14} /> Profile
          </NavLink>
          <button onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="min-w-0 flex-1 overflow-hidden flex flex-col">
        {isPractice ? (
          /* Practice gets full height, no padding */
          <div className="flex-1 min-h-0 overflow-hidden p-3 md:p-4">
            <Outlet />
          </div>
        ) : (
          /* All other pages get padded scroll */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}

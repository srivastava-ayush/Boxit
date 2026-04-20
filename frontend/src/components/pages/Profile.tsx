import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import { Link } from "react-router";
import { logoutUser } from "../../services/auth";
import { Home, LogOut, KeyRound, Zap, BookOpen, ChevronRight, Sun, Moon } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      useAuthStore.getState().setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";
 
 
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center px-4 py-8 transition-colors duration-200">

      {/* Top bar */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <Link to="/">
          <button className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all">
            <Home size={14} /> Home
          </button>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          <span>{dark ? "Light" : "Dark"}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 hover:border-red-300 hover:text-red-500 transition-all"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-colors duration-200"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center py-7 px-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-[72px] h-[72px] rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-medium border border-neutral-200 dark:border-neutral-700 mb-3">
            {initials}
          </div>
          <p className="text-[17px] font-medium text-neutral-900 dark:text-neutral-100">{user?.username}</p>
          <p className="text-sm text-neutral-400 mt-1">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 divide-x divide-neutral-100 dark:divide-neutral-800 border-b border-neutral-100 dark:border-neutral-800">
          {[
            { label: "Level",  value: user?.level,        icon: "🎚️" },
            { label: "XP",     value: user?.xp,           icon: "⚡" },
            { label: "Streak", value: user?.streak,       icon: "🔥" },
            { label: "Awards", value: user?.achievements, icon: "⭐" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col items-center py-4 px-1">
              <span className="text-sm mb-0.5">{icon}</span>
              <span className="text-[17px] font-medium text-neutral-900 dark:text-neutral-100 leading-none mb-1">{value}</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Action rows */}
        {[
          { to: "/select", icon: <Zap size={14} />, iconClass: "bg-blue-50 dark:bg-blue-950 text-blue-500 dark:text-blue-400", label: "Start training", sub: "Pick a session" },
          { to: "/learn",  icon: <BookOpen size={14} />, iconClass: "bg-purple-50 dark:bg-purple-950 text-purple-500 dark:text-purple-400", label: "Go to learning", sub: "Continue where you left off" },
        ].map(({ to, icon, iconClass, label, sub }) => (
          <Link key={to} to={to} className="flex items-center justify-between px-5 py-[14px] border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center ${iconClass}`}>{icon}</div>
              <div>
                <p className="text-sm text-neutral-900 dark:text-neutral-100">{label}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-neutral-300 dark:text-neutral-600" />
          </Link>
        ))}

        <button className="w-full flex items-center justify-between px-5 py-[14px] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-950 text-amber-500 dark:text-amber-400">
              <KeyRound size={14} />
            </div>
            <div className="text-left">
              <p className="text-sm text-neutral-900 dark:text-neutral-100">Reset password</p>
              <p className="text-xs text-neutral-400 mt-0.5">Change your credentials</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-neutral-300 dark:text-neutral-600" />
        </button>
      </motion.div>
    </div>
  );
}
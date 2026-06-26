import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import { Link } from "react-router";
import { logoutUser } from "../../services/auth";
import {
  Home,
  LogOut,
  KeyRound,
  Zap,
  BookOpen,
  ChevronRight,
  Sun,
  Moon,
  Trophy,
  Flame,
  Star,
  Swords,
} from "lucide-react";
import paperTex from "../../../public/paper-texture.webp";

const XP_PER_LEVEL = 100;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [dark, setDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
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

  const level = Math.round(user?.level ?? 1);
  const xp = user?.xp ?? 0;
  const streak = user?.streak ?? 0;
  const xpInLevel = xp % XP_PER_LEVEL;
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;
  const totalXpForLevel = level * XP_PER_LEVEL;

  const stagger = 0.06;

  const statItems = [
    { label: "Level", value: level, icon: Trophy, color: "text-yellow-400 dark:text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "XP", value: xp, icon: Zap, color: "text-blue-400 dark:text-blue-400", bg: "bg-blue-500/10" },
    { label: "Streak", value: streak, icon: Flame, color: "text-orange-400 dark:text-orange-400", bg: "bg-orange-500/10" },
    { label: "Awards", value: user?.achievements?.length ?? 0, icon: Star, color: "text-purple-400 dark:text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#171717] flex flex-col items-center px-4 py-8 relative transition-colors duration-200">
      {/* Ambient glow — dark only */}
      <span className="absolute -z-1 blur-[400px] top-0 left-0 w-[50%] h-[40%] bg-[#46464661] hidden dark:block" />
      <span className="absolute -z-1 blur-[400px] top-0 right-0 w-[50%] h-[40%] bg-[#575cfa43] hidden dark:block" />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg flex justify-between items-center mb-6 relative z-10"
      >
        <Link to="/">
          <button className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-white/5 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2 hover:border-red-500/50 hover:text-neutral-900 dark:hover:text-white transition-all">
            <Home size={14} /> Home
          </button>
        </Link>

        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-white/5 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2 hover:border-red-500/50 hover:text-neutral-900 dark:hover:text-white transition-all"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          <span>{dark ? "Light" : "Dark"}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-white/5 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2 hover:border-red-500/50 hover:text-red-500 dark:hover:text-red-400 transition-all"
        >
          <LogOut size={14} /> Logout
        </button>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-white dark:bg-[#1a1a1a]/80 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl dark:shadow-black/40 transition-colors duration-200"
      >
        {/* Paper texture — dark only */}
        <img
          src={paperTex}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none hidden dark:block"
        />

        {/* Avatar section */}
        <div className="relative z-10 flex flex-col items-center py-8 px-6 border-b border-neutral-100 dark:border-white/5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
            className="relative mb-4"
          >
            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-red-500/20 to-red-800/20 flex items-center justify-center overflow-hidden border-2 border-red-500/40 dark:shadow-[0_0_20px_rgba(220,38,38,0.15)]">
              <img
                src="/user-default-1.webp"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-600 border-2 border-white dark:border-[#1a1a1a] flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">{level}</span>
            </div>
          </motion.div>
          <p className="text-lg font-semibold text-neutral-900 dark:text-white/90">{user?.username}</p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5">{user?.email}</p>

          {user?.isVerified === false && (
            <div className="mt-3 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-400 text-center">
              Email not verified — check your inbox for the verification link
            </div>
          )}

          {/* XP Bar */}
          <div className="w-full mt-5">
            <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-1.5">
              <span className="flex items-center gap-1">
                <Zap size={11} className="text-blue-500 dark:text-blue-400" />
                Level {level}
              </span>
              <span>{xp} / {totalXpForLevel} XP</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 dark:bg-white/5 rounded-full overflow-hidden border border-neutral-300 dark:border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer hidden dark:block" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-4 gap-px bg-neutral-200 dark:bg-white/5">
          {statItems.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * stagger, duration: 0.35 }}
              className="flex flex-col items-center py-4 px-1 bg-neutral-50 dark:bg-[#1a1a1a]"
            >
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-1.5`}>
                <Icon size={15} className={color} />
              </div>
              <span className="text-lg font-bold text-neutral-900 dark:text-white/90 leading-none">{value}</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mt-1">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* Action rows */}
        <div className="relative z-10 divide-y divide-neutral-100 dark:divide-white/5">
          {[
            { to: "/select", icon: Swords, color: "text-red-500 dark:text-red-400", bg: "bg-red-100 dark:bg-red-500/10", label: "Start Training", sub: "Pick a session and fight" },
            { to: "/learn", icon: BookOpen, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/10", label: "Go to Learning", sub: "Continue where you left off" },
          ].map(({ to, icon: Icon, color, bg, label, sub }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * stagger, duration: 0.35 }}
            >
              <Link
                to={to}
                className="flex items-center justify-between px-5 py-[14px] hover:bg-neutral-100 dark:hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-[34px] h-[34px] rounded-lg ${bg} flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-800 dark:text-white/80 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{label}</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{sub}</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors" />
              </Link>
            </motion.div>
          ))}

         <Link to="/reset-password">  
         <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.52, duration: 0.35 }}
           
          >
           <button className="w-full flex items-center justify-between px-5 py-[14px] hover:bg-neutral-100 dark:hover:bg-white/[0.03] transition-colors group ">
              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400">
                  <KeyRound size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm text-neutral-800 dark:text-white/80 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Reset Password</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Change your credentials</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors " />
            </button>
          </motion.div> </Link>
        </div>
      </motion.div> 
    </div> 
  );
}

"use client";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, type User } from "../../stores/authStore";
import {
  List,
  X,
  House,
  UserPlus,
  SignIn,
  BookOpenText,
  Sword,
  UserCircle,
  FireIcon,
} from "@phosphor-icons/react";

const mobileNavItems = (
  user: User | null,
  close: () => void,
) => {
  if (!user)
    return [
      { to: "/", label: "Home", icon: House, onClick: close },
      { to: "/signup", label: "Sign Up", icon: UserPlus, onClick: close },
      { to: "/login", label: "Login", icon: SignIn, onClick: close },
    ];
  return [
    { to: "/learn", label: "Learn", icon: BookOpenText, onClick: close },
    { to: "/select", label: "Train", icon: Sword, onClick: close },
    { to: "/profile", label: "Profile", icon: UserCircle, onClick: close },
  ];
};

const stagger = 0.07;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [glowHome, setGlowHome] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGlowHome(true);
      setTimeout(() => setGlowHome(false), 1000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ─── DESKTOP NAV ─────────────────────────────────────────── */}
      <nav className="w-full hidden fixed top-0 z-[50] md:flex justify-center items-center">
        <ul
          className={`py-8 px-20 w-full transition-all duration-300 flex gap-8 items-center justify-between
            ${scrolled ? "onScrollNav" : ""}`}
        >
          <li className="font-bold dark:text-white/80 russo text-2xl">Box'Lit</li>
          <li>
            <ul className="flex w-fit gap-4 justify-between items-center text-white/80 ">
              {!user && (
                <>
                  <Link
                    to="/"
                    className="hover:cursor-pointer font-medium navlink transition-all duration-300"
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="hover:cursor-pointer font-medium navlink transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`hover:cursor-pointer font-medium navlink transition-all duration-300 ${glowHome ? "drop-shadow-[0_0_12px_rgba(253,83,83,1.9)] text-red-500 tracking-widest " : ""}`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {user && (
                <Link to={"/learn"}
                  className="hover:cursor-pointer font-medium navlink transition-all duration-300"
                >
                  Learn
                </Link>
              )}
              {user && (
                <Link
                  to={"/select"}
                  className="hover:cursor-pointer font-medium navlink transition-all duration-300"
                >
                  Train
                </Link>
              )}
              {user && (
                <Link
                  to={"/profile"}
                  className="hover:cursor-pointer font-medium navlink transition-all duration-300 p-2"
                >
                  Profile
                </Link>

              )}
              {user && (
               <div className="flex justify-center items-center shadow-amber-300 shadow-2xl"><FireIcon className="text-orange-400" />{user.streak} </div>              
                
              )}
            </ul>
          </li>
        </ul>
      </nav>

      {/* ─── MOBILE HAMBURGER ──────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden !fixed top-5 !right-2 z-[60] p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white"
        aria-label="Open menu"
      >
        <List weight="bold" className="w-6 h-6" />
      </button>

      {/* ─── MOBILE OVERLAY MENU ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              key="mobile-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="md:hidden fixed top-0 right-0 z-[70] h-full w-[75vw] max-w-sm bg-[#1a1a1a] border-l border-white/10 shadow-2xl flex flex-col"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                <span className="font-bold text-white/90 russo text-xl">Box'Lit</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X weight="bold" className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 flex flex-col justify-center px-6 gap-2">
                {mobileNavItems(user, () => setMobileOpen(false)).map(
                  (item, i) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ delay: i * stagger, duration: 0.35 }}
                      >
                        <Link
                          to={item.to}
                          onClick={item.onClick}
                          className={`flex items-center gap-4 px-5 py-4 rounded-xl text-lg font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-red-500/15 text-red-400 border border-red-500/20"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon
                            weight={isActive ? "fill" : "regular"}
                            className="w-5 h-5"
                          />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  },
                )}
              </nav>

              {/* Footer */}
              <div className="px-6 pb-8 pt-4 border-t border-white/5">
                <p className="text-xs text-white/30 text-center">
                  &copy; {new Date().getFullYear()} Box'Lit
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

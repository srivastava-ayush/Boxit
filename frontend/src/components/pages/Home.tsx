import { motion } from "framer-motion";
import { useRef, lazy } from "react";
import heroImg from "../../../public/hero-img2.png";
import paperTex from "../../../public/paper-texture.webp";
import { Link } from "react-router";
import promo_1 from "../../../public/promo-1.png";
import GallerySection from "../ui/gallery";
import { useScroll, useTransform } from "framer-motion";
import promo_2 from "../../../public/promo-2.png";
import promo_3 from "../../../public/promo-3.jpeg";

// Phosphor Icons — much richer than Lucide
import {
  Sword,
  BookOpenText,
  YoutubeLogo,
  ArrowRight,
  Lightning,
  Target,
  Brain,
  Fire,
  Trophy,
  VideoCamera,
  CaretRight,
  Flame,
  ShieldStar,
  ChartLineUp,
  Copyright,
  Globe,
  HandFist,
} from "@phosphor-icons/react";

const ScrollImageSequence = lazy(() => import("../ui/AnimatedCanvas"));

function Home() {
  const lines = ["Built for Warriors.", "Forged in Fire."];
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section1Ref,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"],
  });

  const scale2 = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const scale1 = useTransform(scrollYProgress2, [0, 0.3], [0.9, 1]);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative px-8 flex flex-col md:flex-row items-center justify-between min-h-screen bg-[#202020] text-white overflow-hidden md:px-20">
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none"
        />
        <motion.img
          initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
          animate={{ x: 0, opacity: 0.55, filter: "" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:w-[70%] md:h-[100%] w-[100%] h-[59%] object-cover absolute top-[45vh] md:top-0 md:right-[-150px] -z-0 grayscale-100 select-none pointer-events-none"
          src={heroImg}
        />

        <div className="relative z-10 max-w-3xl py-20">
          {/* Badge */}
          {/* <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-red-500/40 bg-red-500/10 rounded-full text-red-400 text-xs font-semibold tracking-widest uppercase"
          >
            <Fire weight="fill" className="w-3.5 h-3.5" />
           Your Ultimate Boxing Coach
          </motion.div> */}

          <h1 className="overflow-hidden leading-tight russo font-extrabold text-5xl md:text-[5rem] tracking-tight">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block"
              >
                {line}
              </motion.div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-lg md:text-xl font-medium text-white/80 max-w-2xl"
          >
            Your Ultimate Boxing Guide – Train, Learn, and Fight! <br />
            The AI-powered coach built for warriors.
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-8">
            <Link to={"/select"}>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative overflow-hidden border p-4 px-10 font-bold bg-gradient-to-r from-[#fd5353] to-red-600 text-white hover:bg-black flex items-center gap-2"
              >
                <Sword weight="bold" className="w-5 h-5" />
                Train
                <motion.div
                  className="absolute top-0 left-[-50%] w-1/4 h-full bg-white opacity-50 blur-xl rounded-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
              </motion.button>
            </Link>

            <Link to={"/learn"}>
              <motion.button
                initial={{ opacity: 0, filter: "blur(1px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="border p-4 px-10 hover:bg-black font-bold flex items-center gap-2"
              >
                <BookOpenText weight="bold" className="w-5 h-5" />
                Learn
              </motion.button>
            </Link>
          </div>

          {/* Feature Pills */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {[
              { icon: <Lightning weight="fill" className="w-4 h-4 text-yellow-400" />, label: "Real-time Analysis" },
              { icon: <Target weight="fill" className="w-4 h-4 text-red-400" />, label: "Precision Training" },
              { icon: <Brain weight="fill" className="w-4 h-4 text-blue-400" />, label: "AI Coaching" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300 font-medium"
              >
                {icon}
                {label}
              </span>
            ))}
          </motion.div> */}
        </div>
      </section>

      {/* ─── SECTION 1 — Next-Level Training ─────────────────────── */}
      <motion.section
        ref={section1Ref}
        style={{ scale: scale2 }}
        className="w-full ease duration-100 relative flex flex-col items-center shadow-white shadow-lg justify-center bg-[#d4d3d3] rounded-t-[3.5rem] overflow-hidden py-20"
      >
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
        />
        <span className="absolute w-[40%] h-[190%] bg-[#ff00002e] blur-[200px] rotate-[-45deg] top-[-140px] left-130 z-0" />

        <div className="max-w-5xl w-full px-6 flex flex-col items-center gap-16">
          <motion.div
            className="flex flex-col items-center lg:items-start text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            

            <h2 className="text-4xl md:text-6xl font-extrabold text-black text-center russo tracking-tight relative">
              Experience{" "}
              <span className="bg-gradient-to-r animate-text drop-shadow-2xl animate-text">
                Next-Level Boxing
              </span>{" "}
              Training
            </h2>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-3 gap-4 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { icon: <HandFist weight="fill" className="w-6 h-6 text-red-600" />, label: "Technique Library", desc: "100+ punches & combos" },
              { icon: <ChartLineUp weight="fill" className="w-6 h-6 text-red-600" />, label: "Progress Tracking", desc: "Monitor every session" },
              { icon: <ShieldStar weight="fill" className="w-6 h-6 text-red-600" />, label: "Defense Drills", desc: "Guard like a pro" },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-2 bg-white/40 border border-black/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                  {icon}
                </div>
                <p className="font-bold text-black text-sm">{label}</p>
                <p className="text-xs text-black/50">{desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div className="w-full flex justify-center items-center">
            <div className="w-[100%] p-3 sticky top-10 rounded-3xl overflow-hidden bg-gradient-to-b from-[#ffffff00] to-black/50 backdrop-blur-2xl border border-white/50 shadow-2xl cursor-pointer">
              <picture>
                <source media="(min-width: 768px)" srcSet={promo_1} />
                <source media="(max-width: 767px)" srcSet={promo_2} />
                <img
                  className="rounded-2xl border border-black/50 w-full grayscale-100"
                  src={promo_1}
                  alt="Boxing Training"
                />
              </picture>
              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-white/0"
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            </div>
          </motion.div>

          <span className="flex w-full justify-center gap-4 z-10">
            <Link to="/learn">
              <button className="px-8 py-5 border-t-2 h-15 flex items-center justify-center gap-2 bg-gradient-to-r from-[#fd5353] to-red-600 hover:to-red-500 text-white rounded-sm font-semibold transition-all shadow-lg hover:shadow-xl">
                <BookOpenText weight="bold" className="w-5 h-5" />
                Learn to box
              </button>
            </Link>

            <a
              href="https://www.youtube.com/channel/UCiE7yqBDTQjtk1abuw92FQg"
              target="_blank"
              rel="noreferrer"
            >
              <button className="flex gap-2 justify-center items-center text-center cursor-pointer border border-black/30 bg-white/60 text-black rounded-sm px-8 py-5 h-15 font-semibold transition-all shadow-lg hover:shadow-xl hover:bg-white/10">
                <YoutubeLogo weight="fill" className="w-5 h-5 text-red-600" />
                Atiko's YT
                <CaretRight weight="bold" className="w-4 h-4" />
              </button>
            </a>
          </span>
        </div>

        <div className="w-full h-[50vh]" />
      </motion.section>

      {/* ─── SECTION 2 — AI Punch Analysis ───────────────────────── */}
      <motion.section
        ref={section2Ref}
        style={{ scale: scale1 }}
        className="w-full ease duration-100 relative -mt-[50vh] flex flex-col items-center shadow-black justify-center bg-[#171717] rounded-t-[3.5rem] overflow-hidden py-20"
      >
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 w-full ease-in h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
        />
        <span className="absolute w-[40%] h-[190%] bg-[#ffd8d852] blur-[200px] rotate-[-45deg] top-[-140px] right-130 z-0" />

        <div className="max-w-5xl w-full px-6 flex flex-col items-center gap-16">
          <motion.div
            className="flex flex-col items-center lg:items-start text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Section badge */}
        

            <h2 className="text-4xl md:text-6xl font-extrabold text-white text-left russo tracking-tight relative">
              Analyze{" "}
              <span className="bg-gradient-to-r animate-text drop-shadow-2xl animate-text">
                your punches
              </span>{" "}
              with AI
            </h2>
          </motion.div>

          {/* AI feature bullets */}
          <motion.div
            className="grid grid-cols-3 gap-4 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { icon: <VideoCamera weight="fill" className="w-6 h-6 text-red-400" />, label: "Video Analysis", desc: "Frame-by-frame review" },
              { icon: <Lightning weight="fill" className="w-6 h-6 text-red-400" />, label: "Speed Metrics", desc: "Measure punch velocity" },
              { icon: <Flame weight="fill" className="w-6 h-6 text-red-400" />, label: "Power Score", desc: "Rate your combinations" },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-grey-500/20 flex items-center justify-center">
                  {icon}
                </div>
                <p className="font-bold text-white text-sm">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div className="w-full flex justify-center items-center">
            <div className="w-[100%] p-3 sticky top-10 rounded-3xl overflow-hidden bg-gradient-to-b from-[#ffffff00] to-black/50 backdrop-blur-2xl border border-white/50 shadow-2xl cursor-pointer">
              <picture>
                <source media="(min-width: 768px)" srcSet={promo_3} />
                <source media="(max-width: 767px)" srcSet={promo_3} />
                <img
                  className="rounded-2xl border border-black/50 w-full grayscale-100"
                  src={promo_3}
                  alt="Boxing Training"
                />
              </picture>
              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-white/0"
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            </div>
          </motion.div>

          <span className="flex w-full justify-center gap-4 z-10">
            <Link to="/learn">
              <button className="px-8 py-5 border-t-2 h-15 flex items-center justify-center gap-2 bg-gradient-to-r from-[#fd5353] to-red-600 hover:to-red-500 text-white rounded-sm font-semibold transition-all shadow-lg hover:shadow-xl">
                <BookOpenText weight="bold" className="w-5 h-5" />
                Learn to box
              </button>
            </Link>

            <a
              href="https://www.youtube.com/channel/UCiE7yqBDTQjtk1abuw92FQg"
              target="_blank"
              rel="noreferrer"
            >
              <button className="flex gap-2 justify-center items-center text-center cursor-pointer border border-white/20 bg-white/10 text-white rounded-sm px-8 py-5 h-15 font-semibold transition-all shadow-lg hover:shadow-xl hover:bg-white/20">
                <YoutubeLogo weight="fill" className="w-5 h-5 text-red-500" />
                Atiko's YT
                <ArrowRight weight="bold" className="w-4 h-4" />
              </button>
            </a>
          </span>
        </div>

        <div className="w-full h-[50vh]" />
      </motion.section>

      {/* ─── GALLERY ──────────────────────────────────────────────── */}
      <section className="relative min-w-full min-h-screen -mt-[70vh] z-20 overflow-visible">
        <GallerySection />
      </section>

      {/* ─── SCROLL SEQUENCE ──────────────────────────────────────── */}
      <section className="relative h-[200vh] ease-in w-full">
        <ScrollImageSequence />
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="w-full relative px-8 bg-gray-900 shadow-white border-t border-white/50 rounded-t-4xl text-gray-400 text-sm">
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 rounded-t-4xl border shadow-2xl shadow-white w-full h-full object-cover opacity-90 mix-blend-overlay pointer-events-none"
        />
        <div className="max-w-6xl mx-auto py-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative">
          {/* Footer Glow */}
          <span className="absolute blur-[300px] -top-20 left-1/4 w-[30%] h-[60%] bg-red-600/40" />
          <span className="absolute blur-[300px] -top-20 right-1/4 w-[30%] h-[60%] bg-blue-500/40" />

          <div className="flex flex-col">
            {/* Brand + icon */}
            <div className="flex items-center gap-3 mb-2">
              <HandFist weight="fill" className="w-8 h-8 text-red-500" />
              <h1 className="text-6xl md:text-7xl text-stone-100 russo">
                BOX'LIT
              </h1>
            </div>

            {/* Social row */}
            <div className="flex items-center gap-3 mt-2 mb-4">
              <a
                href="https://www.youtube.com/channel/UCiE7yqBDTQjtk1abuw92FQg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition text-xs"
              >
                <YoutubeLogo weight="fill" className="w-5 h-5" />
                YouTube
              </a>
              <span className="text-gray-700">·</span>
              <a
                href="https://constayush.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition text-xs"
              >
                <Globe weight="fill" className="w-4 h-4" />
                Portfolio
              </a>
            </div>

            <div className="border-t border-gray-700 pt-6 flex items-center gap-2 text-gray-500">
              <Copyright className="w-4 h-4" />
              {new Date().getFullYear()} BOX'LIT. All rights reserved.
            </div>
          </div>

          {/* Legal / Credits */}
          <div className="mt-10 lg:mt-0 text-center lg:text-left max-w-sm">
            <p className="mb-2">
              Note – All video content featured in this app is the intellectual
              property of its respective owners. We do not claim ownership of
              any third-party videos.
            </p>
            <p>
              Built by –{" "}
              <a
                href="https://constayush.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-300 hover:text-red-600 transition"
              >
                Ayush
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
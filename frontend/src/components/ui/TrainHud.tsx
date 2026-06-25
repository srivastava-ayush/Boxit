import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Video,
  VideoOff,
  Zap,
  Swords,
  Maximize2,
  Minimize2,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router";

interface TrainHudProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraEnabled?: boolean;
  punchCount: number;
  countdown: number;
  isTraining: boolean;
  currentPunch: string;
  repsLeft: number;
  reps: number;
  currentIndex: number;
  punchTypes: Record<
    string,
    { name: string; color: string; icon: string; description: string }
  >;
  toggleCamera: () => void;
  isFullyLoaded: boolean;
  isModelLoaded: boolean;
  isAudioLoaded: boolean;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  reward?: { xpGained: number; levelGained: number , isNewLevel: boolean} | null;
}

function TrainHud({
  canvasRef,
  videoRef,
  cameraEnabled = true,
  punchCount,
  countdown,
  isTraining,
  currentPunch,
  repsLeft,
  reps,
  currentIndex,
  punchTypes,
  toggleCamera,
  isFullyLoaded,
  isModelLoaded,
  isAudioLoaded,
  toggleFullscreen,
  isFullscreen,
  reward,
}: TrainHudProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.1),inset_0_0_50px_rgba(0,0,0,0.5)]">
      {/* Inline Header Controls - Always Visible */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Camera Toggle - Always Visible */}
     
          {/* Hamburger Menu - Only on sm and md */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex items-center justify-center rounded-lg border-2 border-white/30 p-2 bg-black/50 backdrop-blur-sm hover:bg-white/20 transition-all"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Controls - lg and up */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/select"
              className="flex items-center justify-center rounded-lg border-2 border-white/30 p-2 bg-black/50 backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> change combo
            </Link>
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center rounded-lg border-2 border-white/30 p-2 bg-black/50 backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 rounded-lg border border-red-500 shadow-[0_0_10px_rgba(220,0,0,0.3)]">
            <span className="text-xs font-bold tracking-widest text-red-200">
              REPS
            </span>
            <span className="text-xl font-bold font-mono">{repsLeft}</span>
            <span className="text-xs text-red-300">/ {reps}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-lg border border-gray-600">
            <span className="text-xs font-bold tracking-widest text-gray-400">
              PUNCHES
            </span>
            <span className="text-xl font-bold font-mono">{punchCount}</span>
          </div>
        </div>
             <button
            onClick={toggleCamera}
            disabled={!isModelLoaded}
            className={`
            flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm
            transition-all hover:scale-105
            ${
              cameraEnabled
                ? "bg-green-600/90 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                : "bg-red-600/90 border-2 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            }
            ${!isModelLoaded ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            {cameraEnabled ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{cameraEnabled ? "CAM ON" : "CAM OFF"}</span>
          </button>

      </div>

      {/* Hamburger Menu Dropdown - sm and md only */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-4 z-50 lg:hidden"
          >
            <div className="bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 p-4 flex flex-col gap-3 min-w-[160px]">
              <Link
                to="/select"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">change combo</span>
              </Link>
              <button
                onClick={() => {
                  toggleFullscreen();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                <span className="font-medium">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Video feed */}
      {cameraEnabled && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          autoPlay
          playsInline
        />
      )}

      {/* Canvas overlay for skeleton */}
      {cameraEnabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* Game HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets - arcade style */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500" />
      </div>

      {/* Countdown display */}
      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0, rotate: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-30"
          >
            <div className="relative">
              <span className="text-[4rem] sm:text-[6rem] md:text-[10rem] font-black text-red-600 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse">
                {countdown}
              </span>
              <div className="absolute inset-0 blur-xl text-[4rem] sm:text-[6rem] md:text-[10rem] font-black text-red-400 opacity-50">
                {countdown}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current punch display */}
      <AnimatePresence mode="wait">
        {currentPunch && !countdown ? (
          <motion.div
            key={`${currentPunch}-${currentIndex}-${repsLeft}`}
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, y: -50 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            <div className="text-[4rem] sm:text-[6rem] md:text-[8rem] mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              {punchTypes[currentPunch]?.icon || "👊"}
            </div>
            <div
              className="text-[3rem] sm:text-[5rem] md:text-[7rem] font-black mb-2 uppercase tracking-wider drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
              style={{
                color: punchTypes[currentPunch]?.color || "#ffffff",
                textShadow: `0 0 40px ${punchTypes[currentPunch]?.color || "#ffffff"}`,
              }}
            >
              {currentPunch}
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white/80 uppercase tracking-widest">
              {punchTypes[currentPunch]?.name || currentPunch}
            </div>
          </motion.div>
        ) : !isTraining && !currentPunch ? (
          <motion.div
            key="idle-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/10 "
          >
            {!isFullyLoaded ? (
              <div className="flex flex-col justify-center items-center gap-6">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <div className="text-center space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-red-500 animate-pulse">
                    LOADING
                  </h2>
                  <div className="space-y-2 text-gray-400">
                    <p className="flex items-center gap-2 justify-center">
                      {isModelLoaded ? (
                        <span className="text-green-500">
                          <Zap className="w-5 h-5" />
                        </span>
                      ) : (
                        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                      )}
                      <span className="text-sm sm:text-base">
                        {isModelLoaded ? "AI READY" : "LOADING AI..."}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 justify-center">
                      {isAudioLoaded ? (
                        <span className="text-green-500">
                          <Zap className="w-5 h-5" />
                        </span>
                      ) : (
                        <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
                      )}
                      <span className="text-sm sm:text-base">
                        {isAudioLoaded ? "AUDIO READY" : "LOADING AUDIO..."}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center flex justify-center items-center flex-col">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="mb-4"
                >
                  <Swords className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 text-red-600 drop-shadow-[0_0_30px_rgba(239,68,68,0.2)]" />
                </motion.div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-wider">
                  Ready to Fight?
                </div>
                <div className="text-sm sm:text-lg text-gray-400 uppercase tracking-widest">
                  Press Start to Begin
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Game Over / Workout Complete */}
      {repsLeft === 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/80 z-30"
        >
          <div className="text-center">
            <div className="text-4xl sm:text-6xl md:text-8xl font-black text-green-500 mb-4 animate-pulse">
              COMPLETE!
            </div>
            <div className="text-xl sm:text-2xl text-white">
              Total Punches:{" "}
              <span className="text-amber-400 font-bold">{punchCount}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reward Toast */}
      <AnimatePresence>
        {reward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -40 }}
            transition={{ type: "spring", stiffness: 500, damping: 22, mass: 0.8 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none"
          >
            {/* XP Badge */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] px-5 py-2.5 rounded-lg border border-[#dc2626]/40 shadow-[0_0_25px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <motion.span
                  animate={{ rotate: [0, -15, 0, 15, 0] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-lg"
                >
                  ⚡
                </motion.span>
                <span className="font-black text-lg tracking-wide text-white/90">
                  <span className="text-[#dc2626] mr-1">+</span>
                  {reward.xpGained}
                  <span className="ml-1.5 text-xs font-semibold text-[#dc2626]/80 tracking-[0.15em] uppercase">XP</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 animate-shimmer" />
              </div>
            </motion.div>

            {/* Level Badge */}
            {reward.isNewLevel && ( <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] px-5 py-2.5 rounded-lg border border-[#dc2626]/40 shadow-[0_0_25px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <motion.span
                  animate={{ rotate: [0, -15, 0, 15, 0] }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="text-lg"
                >
                  🏆
                </motion.span>
                <span className="font-black text-lg tracking-wide text-white/90">
                  <span className="text-[#dc2626] mr-1">+</span>
                  {reward.levelGained}
                  <span className="ml-1.5 text-xs font-semibold text-[#dc2626]/80 tracking-[0.15em] uppercase">Level</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 animate-shimmer" />
              </div>
            </motion.div>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TrainHud;

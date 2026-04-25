import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Play, Repeat, RotateCcw, Settings, Square } from 'lucide-react'
import paperTex from "../../../public/paper-texture.webp";

function TrainControls({setShowSettings, showSettings, isTraining, startTraining, stopTraining, isPaused, togglePause, intervalTime, setIntervalTime, reps, setReps, setRepsLeft}: {
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>, 
  showSettings: boolean, 
  isTraining: boolean, 
  startTraining: () => void, 
  stopTraining: () => void, 
  isPaused: boolean, 
  togglePause: () => void, 
  intervalTime: number, 
  setIntervalTime: React.Dispatch<React.SetStateAction<number>>, 
  reps: number, 
  setReps: React.Dispatch<React.SetStateAction<number>>, 
  setRepsLeft: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <div className="">
      {/* Control buttons */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        >
          <Settings className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{showSettings ? "Hide Settings" : "Show Settings"}</span>
        </button>

        <div className="flex w-full md:w-auto gap-2">
          {!isTraining ? (
            <motion.button
              onClick={startTraining}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-2 border-green-400 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              <Play className="w-6 h-6" />
              <span className="text-lg uppercase tracking-wider">Start</span>
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={togglePause}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${
                  isPaused
                    ? "bg-gradient-to-r from-yellow-600 to-amber-600 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                } w-full md:w-auto text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5" />
                    <span className="uppercase">Resume</span>
                  </>
                ) : (
                  <>
                    <Square className="w-5 h-5" />
                    <span className="uppercase">Pause</span>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={stopTraining}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border-2 border-red-400 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="uppercase">Reset</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/14 backdrop-blur-xl rounded-xl p-4 md:p-6 mb-4 relative border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <img src={paperTex} alt="Paper texture overlay" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay pointer-events-none rounded-xl" />
  
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wider flex items-center gap-2 relative z-10">
                
                Settings
              </h3>

              <div className="space-y-6 relative z-10 text-white/70 ">
                {/* Interval control */}
                <div className="bg-white/10 shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="flex items-center gap-2 font-medium">
                      <Clock className="w-5 h-5 text-white/60" />
                      <span>Speed</span>
                    </label>
                    <span className="text-sm font-mono bg-black/50 px-2 py-1 rounded">
                      {intervalTime}ms
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIntervalTime(Math.max(300, intervalTime - 100))}
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
                      disabled={intervalTime <= 300}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <input
                      type="range"
                      min="300"
                      max="2000"
                      step="100"
                      value={intervalTime}
                      onChange={(e) => setIntervalTime(Number(e.target.value))}
                      className="flex-1 accent-red-500 h-2"
                    />
                    <button
                      onClick={() => setIntervalTime(Math.min(2000, intervalTime + 100))}
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
                      disabled={intervalTime >= 2000}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Reps control */}
                <div className="bg-white/10 shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="flex items-center gap-2 font-medium">
                      <Repeat className="w-5 h-5 text-white/60" />
                      <span>Repetitions</span>
                    </label>
                    <span className="text-sm text-amber-400 font-mono bg-black/50 px-2 py-1 rounded">
                      {reps}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReps(Math.max(1, reps - 1))}
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
                      disabled={reps <= 1}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={reps}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setReps(value);
                        if (!isTraining) setRepsLeft(value);
                      }}
                      className="flex-1 accent-red-500 h-2"
                    />
                    <button
                      onClick={() => setReps(Math.min(20, reps + 1))}
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
                      disabled={reps >= 20}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TrainControls
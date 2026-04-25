"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  ChevronRight,
  Dumbbell,
  X,
  Trash2,
  Play,
} from "lucide-react";
import ScrollToTop from "../ui/ScrollToTop";

import paperTex from "../../../public/paper-texture.webp";

const punchTypes = [
  { id: "1", name: "Jab", color: "#ef4444", description: "Lead hand straight" },
  {
    id: "2",
    name: "Cross",
    color: "#3b82f6",
    description: "Rear hand straight",
  },
  {
    id: "3",
    name: "Lead Hook",
    color: "#10b981",
    description: "Lead hand hook",
  },
  {
    id: "4",
    name: "Rear Hook",
    color: "#8b5cf6",
    description: "Rear hand hook",
  },
  {
    id: "5",
    name: "Lead Uppercut",
    color: "#f59e0b",
    description: "Lead hand uppercut",
  },
  {
    id: "6",
    name: "Rear Uppercut",
    color: "#ec4899",
    description: "Rear hand uppercut",
  },
  { id: "S", name: "Slip", color: "#6366f1", description: "Defensive slip" },
  { id: "R", name: "Roll", color: "#14b8a6", description: "Defensive roll" },
  { id: "D", name: "Duck", color: "#f97316", description: "Defensive duck" },
];

const boxingCombos = [
  { name: "Jab, Cross", code: "1-2" },
  { name: "Jab, Cross, Hook", code: "1-2-3" },
  { name: "Jab, Cross, Uppercut", code: "1-2-6" },
  { name: "Jab, Jab, Cross", code: "1-1-2" },
  { name: "Cross, Hook, Cross", code: "2-3-2" },
  { name: "Jab, Cross, Hook, Uppercut", code: "1-2-3-6" },
  { name: "Jab, Cross, Slip, Cross", code: "1-2-S-2" },
  { name: "Jab, Hook, Cross, Hook", code: "1-3-2-3" },
  { name: "Jab, Cross, Roll, Cross", code: "1-2-R-2" },
  { name: "Double Jab, Cross, Hook", code: "1-1-2-3" },
  { name: "Hook, Cross, Hook", code: "3-2-3" },
  { name: "Jab, Jab, Cross, Hook, Uppercut", code: "1-1-2-3-6" },
];

export default function Select() {
  const [customCombo, setCustomCombo] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropAreaRef = useRef(null);
  const navigate = useNavigate();

  const handleSelectCombo = (combo: string) => {
    navigate(`/train?combo=${encodeURIComponent(combo)}`);
  };

  const handleTrainCustomCombo = () => {
    if (customCombo.length > 0) {
      const comboString = customCombo.join("-");
      navigate(`/train?combo=${encodeURIComponent(comboString)}`);
    }
  };

  const addToCustomCombo = (punchId: string) => {
    setCustomCombo([...customCombo, punchId]);
  };

  const removeFromCustomCombo = (index: number) => {
    const newCombo = [...customCombo];
    newCombo.splice(index, 1);
    setCustomCombo(newCombo);
  };

  const clearCustomCombo = () => {
    setCustomCombo([]);
  };

  const handleDragStart = (e: React.DragEvent, punchId: string) => {
    e.dataTransfer.setData("punchId", punchId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const punchId = e.dataTransfer.getData("punchId");
    addToCustomCombo(punchId);
    setIsDragging(false);
  };

  // Get punch name from ID
  const getPunchName = (id: string) => {
    const punch = punchTypes.find((p) => p.id === id);
    return punch ? punch.name : id;
  };

  // Get punch color from ID
  const getPunchColor = (id: string) => {
    const punch = punchTypes.find((p) => p.id === id);
    return punch ? punch.color : "#6b7280";
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative w-full bg-black/20 text-white flex flex-col justify-center items-center px-4 pt-28 md:py-34 py-12 md:px-12"
    >  <span className="absolute -z-1 blur-[400px] top-0 left-0 w-[50%] h-[40%] bg-[#46464661]" />
         <span className="absolute -z-1 blur-[400px] top-0 right-0 w-[50%] h-[40%] bg-[#575cfa43] " />
      <ScrollToTop />
      <div className="absolute inset-0 h-full opacity-10 select-bg"></div>
      {/* Header with navigation */}
      <div className="w-full h-fit z-10 relative flex justify-center  items-center flex-col">
        <div className="container flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center justify-center rounded-full bg-black border-red-600 border-2 p-3 hover:bg-red-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-3xl md:text-6xl font-bold helvetica-font text-center">
            Select Your Combo
          </h1>

          <Link
            to="/train"
            className="flex items-center justify-center rounded-full bg-black border-red-600 border-2 p-3 hover:bg-red-600 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center">
          {/* Legend toggle button */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition-colors"
          >
            <Info className="w-5 h-5" />
            <span>
              {showLegend ? "Hide Combo Legend" : "Show Combo Legend"}
            </span>
          </button>

          {/* Legend */}
          {showLegend && (
            <div className="w-full max-w-2xl bg-[#f6f6f642] shadow-2xl rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Boxing Combo Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {punchTypes.map((punch) => (
                  <div key={punch.id} className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-white"
                      style={{ backgroundColor: punch.color }}
                    >
                      {punch.id}
                    </span>
                    <span>{punch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preset Combos */}
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Dumbbell className="w-6 h-6 mr-2 text-red-600" />
              Popular Combinations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {boxingCombos.map((combo, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCombo(combo.code)}
                  className="bg-white/10 relative  backdrop-blur-2xl shadow-2xl border border-[#ffffff9e] hover:border-red-500 hover:bg-black text-white p-5 rounded-xl transition-all duration-300 flex flex-col items-start h-full"
                >
                  <img
            src={paperTex}
            alt="Paper texture overlay"
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay pointer-events-none"
          />
                  <div className="bg-red-600/50 border border-black text-white  px-3 py-1 rounded-full text-sm font-mono mb-2">
                    {combo.code}
                  </div>
                  <span className="text-lg font-medium">{combo.name}</span>
                  <div className="mt-auto pt-2 w-full flex justify-end">
                    <ChevronRight className="w-5 h-5 text-gray-200" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Combo Builder */}
          <div className="w-full max-w-4xl bg-white/20 select-none backdrop-blur-2xl relative rounded-xl p-6 mb-12">
           
           <img src={paperTex} alt="Paper texture overlay" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none rounded-xl" />
         
            <h2 className="text-xl font-bold mb-4">Create Custom Combo</h2>

            {/* Drag and drop area */}
            <div
              ref={dropAreaRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`w-full min-h-24 bg-black/80 border-2 select-none  ${
                isDragging ? "border-red-500 bg-gray-900/50" : "border-gray-700"
              } rounded-lg p-4 mb-6 flex flex-wrap items-center text-center gap-2 transition-colors`}
            >
              {customCombo.length === 0 ? (
                <div className="w-full text-center text-gray-500 select-none py-4">
                  Drag punches here or click on them below to create your combo
                </div>
              ) : (
                <>
                  {customCombo.map((punchId, index) => (
                    <motion.div
                      key={`${punchId}-${index}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative group"
                    >
                      <div
                        className="flex flex-col items-center select-none  justify-center w-16 h-16 rounded-lg text-white font-bold text-lg m-1 cursor-move"
                        style={{ backgroundColor: getPunchColor(punchId) }}
                      >
                        <div className="text-xl font-bold">{punchId}</div>
                        <div className="text-xs">{getPunchName(punchId)}</div>
                      </div>
                      <button
                        onClick={() => removeFromCustomCombo(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index < customCombo.length - 1 && (
                        <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-500">
                          →
                        </div>
                      )}
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Punch palette */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Punch Palette</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9  gap-2">
                {punchTypes.map((punch) => (
                  <div
                    key={punch.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, punch.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => addToCustomCombo(punch.id)}
                    className="flex flex-col items-center text-center justify-center w-full aspect-square rounded-lg text-white font-bold cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: punch.color }}
                  >
                    <div className="text-xl font-bold">{punch.id}</div>
                    <div className="text-xs text-center px-1">{punch.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <button
                onClick={clearCustomCombo}
                disabled={customCombo.length === 0}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Combo</span>
              </button>

              <button
                onClick={handleTrainCustomCombo}
                disabled={customCombo.length === 0}
                className="bg-gradient-to-r from-[#fd5353] to-red-600 hover:to-red-500 border-t-2 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span>Train Custom Combo</span>
              </button>
            </div>

            {/* Current combo code display */}
            {customCombo.length > 0 && (
              <div className="mt-4 text-center">
                <span className="text-gray-400">Combo Code: </span>
                <span className="font-mono bg-black px-2 py-1 text-center rounded text-red-500">
                  {customCombo.join("-")}
                </span>
              </div>
            )}

            <p className="text-gray-400 text-sm mt-4">
              Tip: Drag and drop punches to create your combo, or click on them
              to add. Click the X to remove a punch.
            </p>
         
          </div>
        </div>

        {/* Footer */}
        <div className="container mx-auto px-4 py-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            Select a combination to begin your training session
          </p>
        </div>
      </div>
    </motion.div>
  );
}

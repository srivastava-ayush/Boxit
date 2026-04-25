import { List } from "lucide-react";
import paperTex from "../../../public/paper-texture.webp";

function ComboTray({combo, currentIndex, isTraining, isPaused, punchTypes, comboString}: {
  combo: string[],
  currentIndex: number,
  isTraining: boolean,
  isPaused: boolean,
  punchTypes: Record<string, {color: string; name: string}>,
  comboString: string
}) {
  return (
    <div className="bg-white/20 shadow-2xl rounded-xl p-6 mb-8 relative overflow-hidden">
      <img src={paperTex} alt="Paper texture overlay" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay pointer-events-none rounded-xl" />
      
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 relative z-10">
        <List className="w-5 h-5" />
        Current Combo
      </h2>
      
      <div className="flex flex-wrap gap-3 justify-center relative z-10">
        {combo.map((punch, idx) => (
          <div
            key={idx}
            className={`
              flex flex-col items-center justify-center 
              min-w-[3rem] sm:min-w-[4rem] md:min-w-[5rem] 
              px-2 py-2 sm:px-3 sm:py-3
              rounded-lg text-white font-bold text-xs sm:text-sm md:text-base
              transition-all duration-200
              ${currentIndex === idx && isTraining && !isPaused
                ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110"
                : ""
              }
              ${idx < currentIndex && isTraining ? "opacity-50 scale-95" : ""}
            `}
            style={{
              backgroundColor: punchTypes[punch]?.color || "#6b7280",
            }}
          >
            <span className="text-center leading-tight">
              {punchTypes[punch]?.name || punch}
            </span>
          </div>
        ))}
      </div>
      
      <p className="text-center mt-4 text-gray-400 relative z-10 font-mono text-sm">{comboString}</p>
    </div>
  );
}

export default ComboTray;
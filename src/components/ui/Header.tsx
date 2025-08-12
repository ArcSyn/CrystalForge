import { Menu, Sparkles, Activity, Cpu } from "lucide-react";
import { useCrystalStore } from "@/stores/crystalStore";
import { motion } from "framer-motion";

export function Header() {
  const { toggleSidebar, activeCrystal, crystals, ollamaConnected, lmstudioConnected } = useCrystalStore();
  const currentCrystal = crystals.find(c => c.id === activeCrystal);

  return (
    <header className="h-16 border-b border-zinc-800/50 bg-gradient-to-r from-zinc-900/80 via-purple-900/20 to-zinc-900/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <Menu className="size-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="size-6 text-purple-400" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Lucien's Crystal Forge
              </h1>
              <div className="text-xs text-zinc-500">Where Code Becomes Magic</div>
            </div>
          </div>
          
          {currentCrystal && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full"
            >
              <div className="size-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{currentCrystal.name}</span>
              <span className="text-xs text-zinc-400">({currentCrystal.crystal})</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-sm">
          <div className={`flex items-center gap-1 ${ollamaConnected ? 'text-emerald-400' : 'text-zinc-500'}`}>
            <Cpu className="size-4" />
            <span>Ollama</span>
          </div>
          <div className={`flex items-center gap-1 ${lmstudioConnected ? 'text-emerald-400' : 'text-zinc-500'}`}>
            <Activity className="size-4" />
            <span>LM Studio</span>
          </div>
        </div>
      </div>
    </header>
  );
}

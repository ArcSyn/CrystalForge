import { motion } from "framer-motion";
import { Scroll, Clock, Copy } from "lucide-react";
import { useCrystalStore } from "@/stores/crystalStore";

interface SpellMemory {
  id: string;
  spell: string;
  code: string;
  explanation: string;
  timestamp: Date;
  performance: {
    tokensPerSecond: number;
    responseTime: number;
  };
}

export function CrystalMemory() {
  const { crystalMemory, clearMemory } = useCrystalStore();

  const handleCopySpell = (memory: SpellMemory) => {
    navigator.clipboard.writeText(memory.code);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Scroll className="size-5 text-blue-400" />
          Crystal Memory
        </h3>
        {crystalMemory.length > 0 && (
          <button
            onClick={clearMemory}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {crystalMemory.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            <Scroll className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No spells cast yet</p>
            <p className="text-xs mt-1">Your magical creations will appear here</p>
          </div>
        ) : (
          crystalMemory.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/30 rounded-lg p-3 border border-blue-500/10 hover:border-blue-500/20 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{memory.spell}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {memory.timestamp.toLocaleTimeString()}
                    </span>
                    <span>{memory.performance.tokensPerSecond.toFixed(1)} tok/s</span>
                    <span>{memory.performance.responseTime}ms</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopySpell(memory)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-500/20 rounded transition-all"
                >
                  <Copy className="size-3 text-blue-400" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

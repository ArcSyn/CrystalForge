import { useCrystalStore } from "@/stores/crystalStore";
import { Settings, Zap, Users, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { CrystalMemory } from "@/components/CrystalMemory";

export function Sidebar() {
  const { crystals, activeCrystal, setActiveCrystal } = useCrystalStore();

  const getCrystalIcon = (crystal: string) => {
    switch (crystal) {
      case "amethyst": return "💜";
      case "quartz": return "🤍";
      case "obsidian": return "🖤";
      case "rose-quartz": return "💖";
      case "citrine": return "💛";
      default: return "💎";
    }
  };

  return (
    <aside className="w-80 h-full bg-gradient-to-b from-zinc-900/50 via-purple-900/10 to-zinc-900/50 border-r border-zinc-800/50 backdrop-blur-xl">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Gem className="size-4" />
            Active Crystals
          </h3>
          <div className="space-y-2">
            {crystals.map((crystal) => (
              <motion.button
                key={crystal.id}
                onClick={() => setActiveCrystal(crystal.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  activeCrystal === crystal.id
                    ? "bg-purple-500/20 border-purple-500/40"
                    : "bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCrystalIcon(crystal.crystal)}</span>
                    <div>
                      <h4 className="font-medium text-white">{crystal.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{crystal.element}</p>
                      <p className="text-xs text-zinc-500 mt-1">{crystal.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-400 font-medium">
                    {crystal.meta?.rarity || "common"}
                  </div>
                </div>
              </motion.button>
            ))}
            
            {crystals.length === 0 && (
              <div className="text-center text-zinc-500 py-8">
                <Gem className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No crystals found</p>
                <p className="text-xs mt-1">Check ~/.lucien/crystals/</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Crystal Tools
          </h3>
          <div className="space-y-2">
            {[
              { icon: Zap, label: "Scrying Pool", color: "purple" },
              { icon: Settings, label: "Crystal Settings", color: "blue" },
              { icon: Users, label: "Crystal Bazaar", color: "green" },
            ].map((tool) => (
              <button
                key={tool.label}
                className="w-full p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors text-left flex items-center gap-3"
              >
                <tool.icon className={`size-4 ${
                  tool.color === 'purple' ? 'text-purple-400' : 
                  tool.color === 'blue' ? 'text-blue-400' : 
                  'text-green-400'
                }`} />
                <span className="text-sm">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Crystal Memory */}
        <div className="mt-6">
          <CrystalMemory />
        </div>
      </div>
    </aside>
  );
}

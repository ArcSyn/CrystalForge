import { useState, useCallback, useEffect } from "react";
import { useCrystalStore } from "@/stores/crystalStore";
import { Sparkles, Zap, Clock, BarChart3, Copy, Wand2, Loader2, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Dashboard() {
  const { 
    crystals, 
    activeCrystal, 
    performance, 
    isGenerating, 
    lastGeneration,
    generateWithAmethyst,
    ollamaConnected,
    crystalMemory
  } = useCrystalStore();
  
  const [spellInput, setSpellInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentCrystal = crystals.find(c => c.id === activeCrystal);
  const crystalPerf = performance["amethyst.dev"] || {
    tokensPerSecond: 0,
    avgResponseTime: 0,
    totalCasts: 0,
    successRate: 100,
    lastUsed: new Date()
  };

  // Spell casting with error handling
  const handleCastSpell = useCallback(async () => {
    if (!spellInput.trim() || !ollamaConnected || isGenerating) return;
    
    setError(null);
    try {
      await generateWithAmethyst(spellInput);
      setSpellInput(""); // Clear input after successful generation
    } catch (error: any) {
      console.error('Spell casting failed:', error);
      setError(error.message || "Failed to cast spell. Check Ollama connection.");
    }
  }, [spellInput, ollamaConnected, isGenerating, generateWithAmethyst]);

  // Keyboard shortcut: Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCastSpell();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCastSpell]);

  const copyCode = useCallback(() => {
    if (lastGeneration?.code) {
      navigator.clipboard.writeText(lastGeneration.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [lastGeneration]);

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-purple-500/20"
        >
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Welcome to the Crystal Forge
          </h1>
          <p className="text-zinc-400 text-lg">
            Channel the mystical power of crystals to transform your ideas into production-ready code.
          </p>
        </motion.div>

        {/* Active Crystal Status */}
        {currentCrystal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <motion.div
                  animate={{ rotate: isGenerating ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
                >
                  <Sparkles className="size-5 text-purple-400" />
                </motion.div>
                Active Crystal
                {isGenerating && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-purple-400 ml-2 animate-pulse"
                  >
                    - Channeling Energy...
                  </motion.span>
                )}
              </h2>
              <div className="text-sm text-purple-400 font-medium px-3 py-1 bg-purple-500/10 rounded-full">
                {currentCrystal.meta?.rarity || "common"}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-2">{currentCrystal.name}</h3>
                <p className="text-zinc-400 mb-4">{currentCrystal.role}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500">Element:</span>
                    <span className="text-zinc-300">{currentCrystal.element}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500">Model:</span>
                    <span className="text-zinc-300">{currentCrystal.model}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500">Connection:</span>
                    <span className={`flex items-center gap-1.5 text-sm ${ollamaConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-emerald-500' : 'bg-red-500'}`}
                        animate={{ scale: ollamaConnected ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      {ollamaConnected ? 'Crystal Resonating' : 'Crystal Dormant'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Mystical Properties
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentCrystal.properties.map((prop) => (
                    <span
                      key={prop}
                      className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: Zap, 
              label: "Tokens/Second", 
              value: crystalPerf.tokensPerSecond.toFixed(1), 
              color: "purple",
              suffix: " tok/s"
            },
            { 
              icon: Clock, 
              label: "Avg Response", 
              value: formatResponseTime(crystalPerf.avgResponseTime), 
              color: "blue",
              suffix: ""
            },
            { 
              icon: BarChart3, 
              label: "Total Casts", 
              value: crystalPerf.totalCasts.toString(), 
              color: "emerald",
              suffix: " spells"
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-900/50 backdrop-blur-xl rounded-xl p-6 border border-zinc-800/50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`size-5 text-${stat.color}-400`} />
                <span className="text-sm text-zinc-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stat.value}
                {stat.suffix && <span className="text-base text-zinc-400 ml-1">{stat.suffix}</span>}
              </div>
              
              {/* Performance indicator bar */}
              {stat.label === "Tokens/Second" && (
                <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((crystalPerf.tokensPerSecond / 50) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full bg-${stat.color}-400`}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Spell Casting Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wand2 className="size-5 text-purple-400" />
            Cast Spell with Amethyst
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={spellInput}
                onChange={(e) => setSpellInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleCastSpell();
                  }
                }}
                placeholder="Describe the React component you wish to manifest..."
                className="w-full h-24 bg-black/50 border border-purple-500/20 rounded-lg p-4 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-purple-500/40 transition-colors"
                disabled={isGenerating || !ollamaConnected}
              />
              <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
                {spellInput.length}/500
              </div>
            </div>
            
            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                >
                  <AlertCircle className="size-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCastSpell}
                  disabled={!spellInput.trim() || !ollamaConnected || isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Channeling...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Cast Spell
                    </>
                  )}
                </button>
                
                {!ollamaConnected && (
                  <span className="text-sm text-red-400">
                    Crystal energy dormant - check Ollama connection
                  </span>
                )}
              </div>
              
              <span className="text-sm text-zinc-500">
                Press <kbd className="px-1.5 py-0.5 border border-zinc-600 rounded">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 border border-zinc-600 rounded">Enter</kbd> to cast
              </span>
            </div>
            
            {/* Quick Examples */}
            {!isGenerating && crystalMemory.length === 0 && (
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-sm text-zinc-500 mb-2">Quick spell examples:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Create a hero section with animated gradient",
                    "Build a modal dialog with backdrop blur",
                    "Design a card component with hover effects"
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setSpellInput(example)}
                      className="text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded transition-colors"
                    >
                      {example.split(' ').slice(0, 4).join(' ')}...
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Generated Code Display */}
        <AnimatePresence>
          {lastGeneration && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  Latest Spell Manifestation
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500">
                    {new Date(lastGeneration.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/50 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-700/50 bg-emerald-900/20">
                    <span className="text-xs text-emerald-300 font-medium">Generated Component</span>
                    <span className="text-xs text-zinc-500">TypeScript + React + Tailwind</span>
                  </div>
                  <pre className="p-4 text-sm text-emerald-300 whitespace-pre-wrap font-mono overflow-x-auto">
                    <code>{lastGeneration.code}</code>
                  </pre>
                </div>
                
                {lastGeneration.explanation && (
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <p className="text-sm text-purple-300">
                      <strong>Amethyst's Wisdom:</strong> {lastGeneration.explanation}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

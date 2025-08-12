import { useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { useCrystalStore } from "@/stores/crystalStore";
import { initializeCrystals } from "@/lib/crystals";
import { motion, AnimatePresence } from "framer-motion";
import { PreviewTest } from "@/components/preview/PreviewTest";

export default function App() {
  const { sidebarCollapsed, setCrystals, checkConnections } = useCrystalStore();
  const [showPreviewTest, setShowPreviewTest] = useState(false);

  useEffect(() => {
    // Initialize crystals on app start
    const loadCrystals = async () => {
      try {
        const crystals = await initializeCrystals();
        setCrystals(crystals);
      } catch (error) {
        console.error("Failed to initialize crystals:", error);
      }
    };

    // Initial load
    loadCrystals();
    checkConnections();

    // Check connections every 30 seconds
    const interval = setInterval(checkConnections, 30000);

    return () => clearInterval(interval);
  }, [setCrystals, checkConnections]);

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <Header />
        
        {/* Debug toggle button */}
        <div className="absolute top-20 right-4 z-50">
          <button
            onClick={() => setShowPreviewTest(!showPreviewTest)}
            className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-medium rounded-lg border border-purple-500/30 transition-colors"
          >
            {showPreviewTest ? 'Show Dashboard' : 'Test Preview'}
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>
          
          <main className="flex-1 overflow-hidden">
            {showPreviewTest ? <PreviewTest /> : <Dashboard />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

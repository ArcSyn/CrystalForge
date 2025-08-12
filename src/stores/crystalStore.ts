import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CrystalManifest, CrystalPerformance } from "@/types/crystal";
import { ollamaClient } from "@/services/ollama";
import { amethystAgent } from "@/services/amethyst";

interface CrystalState {
  // UI State
  activeCrystal: string | null;
  sidebarCollapsed: boolean;
  scryingPoolActive: boolean;
  
  // Crystal State
  crystals: CrystalManifest[];
  performance: Record<string, CrystalPerformance>;
  
  // Hardware State
  hardwareProfile: {
    cpu: string;
    ram: number;
    gpu: string | null;
    vram: number;
  } | null;
  
  // LLM Connection State
  ollamaConnected: boolean;
  lmstudioConnected: boolean;
  availableModels: string[];
  
  // Current Generation State
  isGenerating: boolean;
  lastGeneration: {
    code: string;
    explanation: string;
    timestamp: Date;
  } | null;
  
  // Crystal Memory
  crystalMemory: Array<{
    id: string;
    spell: string;
    code: string;
    explanation: string;
    timestamp: Date;
    performance: {
      tokensPerSecond: number;
      responseTime: number;
    };
  }>;
  
  // Actions
  setActiveCrystal: (crystalId: string) => void;
  toggleSidebar: () => void;
  toggleScryingPool: () => void;
  updateCrystalPerformance: (crystalId: string, performance: Partial<CrystalPerformance>) => void;
  setHardwareProfile: (profile: CrystalState["hardwareProfile"]) => void;
  setCrystals: (crystals: CrystalManifest[]) => void;
  setConnectionStatus: (service: "ollama" | "lmstudio", connected: boolean) => void;
  setAvailableModels: (models: string[]) => void;
  
  // Crystal Actions
  generateWithAmethyst: (description: string) => Promise<void>;
  refactorWithAmethyst: (code: string, improvements: string) => Promise<void>;
  checkConnections: () => Promise<void>;
  
  // Memory Actions
  addToMemory: (spell: string, code: string, explanation: string, performance: { tokensPerSecond: number; responseTime: number }) => void;
  clearMemory: () => void;
  setLastGeneration: (generation: any) => void;
}

export const useCrystalStore = create<CrystalState>()(
  devtools(
    (set, get) => ({
      // Initial State
      activeCrystal: "amethyst.dev",
      sidebarCollapsed: false,
      scryingPoolActive: false,
      crystals: [],
      performance: {},
      hardwareProfile: null,
      ollamaConnected: false,
      lmstudioConnected: false,
      availableModels: [],
      isGenerating: false,
      lastGeneration: null,
      crystalMemory: [],

      // Actions
      setActiveCrystal: (crystalId) =>
        set((state) => ({ ...state, activeCrystal: crystalId })),
      
      toggleSidebar: () =>
        set((state) => ({ ...state, sidebarCollapsed: !state.sidebarCollapsed })),
      
      toggleScryingPool: () =>
        set((state) => ({ ...state, scryingPoolActive: !state.scryingPoolActive })),
      
      updateCrystalPerformance: (crystalId, performance) =>
        set((state) => ({
          ...state,
          performance: {
            ...state.performance,
            [crystalId]: { ...state.performance[crystalId], ...performance }
          }
        })),
      
      setHardwareProfile: (profile) =>
        set((state) => ({ ...state, hardwareProfile: profile })),
      
      setCrystals: (crystals) =>
        set((state) => ({ ...state, crystals })),
      
      setConnectionStatus: (service, connected) =>
        set((state) => ({ 
          ...state, 
          [service === "ollama" ? "ollamaConnected" : "lmstudioConnected"]: connected 
        })),
      
      setAvailableModels: (models) =>
        set((state) => ({ ...state, availableModels: models })),

      // Crystal Actions
      generateWithAmethyst: async (description) => {
        set((state) => ({ ...state, isGenerating: true }));
        
        try {
          const result = await amethystAgent.generateComponent(description);
          
          // Update performance metrics
          get().updateCrystalPerformance("amethyst.dev", {
            tokensPerSecond: result.tokensPerSecond,
            avgResponseTime: result.responseTime,
            lastUsed: new Date(),
            totalCasts: (get().performance["amethyst.dev"]?.totalCasts || 0) + 1
          });
          
          // Store the generation result
          set((state) => ({ 
            ...state, 
            isGenerating: false,
            lastGeneration: {
              code: result.code,
              explanation: result.explanation,
              timestamp: new Date()
            }
          }));
          
          // Add to crystal memory
          get().addToMemory(
            description,
            result.code,
            result.explanation,
            {
              tokensPerSecond: result.tokensPerSecond,
              responseTime: result.responseTime
            }
          );
          
        } catch (error) {
          console.error('Amethyst generation failed:', error);
          set((state) => ({ ...state, isGenerating: false }));
          throw error;
        }
      },

      refactorWithAmethyst: async (code, improvements) => {
        set((state) => ({ ...state, isGenerating: true }));
        
        try {
          const result = await amethystAgent.refactorCode(code, improvements);
          
          get().updateCrystalPerformance("amethyst.dev", {
            tokensPerSecond: result.tokensPerSecond,
            avgResponseTime: result.responseTime,
            lastUsed: new Date(),
            totalCasts: (get().performance["amethyst.dev"]?.totalCasts || 0) + 1
          });
          
          set((state) => ({ 
            ...state, 
            isGenerating: false,
            lastGeneration: {
              code: result.code,
              explanation: result.explanation,
              timestamp: new Date()
            }
          }));
          
        } catch (error) {
          console.error('Amethyst refactoring failed:', error);
          set((state) => ({ ...state, isGenerating: false }));
          throw error;
        }
      },

      checkConnections: async () => {
        // Check Ollama
        try {
          const ollamaHealth = await ollamaClient.healthCheck();
          get().setConnectionStatus("ollama", ollamaHealth);
          
          if (ollamaHealth) {
            const models = await ollamaClient.listModels();
            get().setAvailableModels(models.map(m => m.name));
          }
        } catch (error) {
          console.error('Ollama connection check failed:', error);
          get().setConnectionStatus("ollama", false);
        }

        // Check LM Studio - Disabled to avoid console errors when not in use
        // Uncomment if you want to use LM Studio
        /*
        try {
          const lmstudioResponse = await fetch("http://localhost:1234/v1/models");
          get().setConnectionStatus("lmstudio", lmstudioResponse.ok);
        } catch {
          get().setConnectionStatus("lmstudio", false);
        }
        */
        get().setConnectionStatus("lmstudio", false);
      },
      
      addToMemory: (spell, code, explanation, performance) =>
        set((state) => ({
          ...state,
          crystalMemory: [
            {
              id: Date.now().toString(),
              spell,
              code,
              explanation,
              timestamp: new Date(),
              performance
            },
            ...state.crystalMemory.slice(0, 9) // Keep only last 10
          ]
        })),

      clearMemory: () =>
        set((state) => ({ ...state, crystalMemory: [] })),
        
      setLastGeneration: (generation) =>
        set((state) => ({ ...state, lastGeneration: generation })),
    }),
    { name: "crystal-forge-store" }
  )
);

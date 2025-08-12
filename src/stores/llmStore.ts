import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { llmService, ServerStatus, ModelInfo, PerformanceMetrics, GenerateResponse, Message } from "@/services/llmService";

interface LLMState {
  // Server Status
  serverStatus: ServerStatus | null;
  ollamaConnected: boolean;
  lmstudioConnected: boolean;
  
  // Available Models
  availableModels: ModelInfo[];
  activeModel: string | null;
  activeProvider: "Ollama" | "LMStudio" | null;
  
  // Real Performance Data
  performanceMetrics: Record<string, PerformanceMetrics>;
  lastGeneration: GenerateResponse | null;
  
  // Chat History
  chatHistory: Message[];
  
  // Loading states
  isLoadingServers: boolean;
  isLoadingModels: boolean;
  isGenerating: boolean;
  
  // Actions
  checkServerStatus: () => Promise<void>;
  loadModels: () => Promise<void>;
  generateWithModel: (prompt: string) => Promise<string>;
  switchModel: (modelId: string, provider: "Ollama" | "LMStudio") => Promise<void>;
  addToChatHistory: (message: Message) => void;
  clearChatHistory: () => void;
}

export const useLLMStore = create<LLMState>()(
  devtools(
    (set, get) => ({
      // Initial State
      serverStatus: null,
      ollamaConnected: false,
      lmstudioConnected: false,
      availableModels: [],
      activeModel: null,
      activeProvider: null,
      performanceMetrics: {},
      lastGeneration: null,
      chatHistory: [],
      isLoadingServers: false,
      isLoadingModels: false,
      isGenerating: false,

      // Check server status
      checkServerStatus: async () => {
        set({ isLoadingServers: true });
        try {
          const status = await llmService.detectServers();
          set({
            serverStatus: status,
            ollamaConnected: status.ollama.connected,
            lmstudioConnected: status.lmstudio.connected,
            isLoadingServers: false
          });
          
          // Auto-load models if servers are connected
          if (status.ollama.connected || status.lmstudio.connected) {
            await get().loadModels();
          }
        } catch (error) {
          console.error("Failed to check server status:", error);
          set({ isLoadingServers: false });
        }
      },

      // Load available models
      loadModels: async () => {
        set({ isLoadingModels: true });
        try {
          const models = await llmService.listModels();
          
          // Extract performance metrics
          const metrics: Record<string, PerformanceMetrics> = {};
          models.forEach(model => {
            if (model.performance) {
              metrics[model.id] = model.performance;
            }
          });
          
          // Set default active model if none selected
          const state = get();
          let activeModel = state.activeModel;
          let activeProvider = state.activeProvider;
          
          if (!activeModel && models.length > 0) {
            const firstModel = models[0];
            activeModel = firstModel.id;
            activeProvider = firstModel.provider as "Ollama" | "LMStudio";
          }
          
          set({
            availableModels: models,
            performanceMetrics: metrics,
            activeModel,
            activeProvider,
            isLoadingModels: false
          });
        } catch (error) {
          console.error("Failed to load models:", error);
          set({ isLoadingModels: false });
        }
      },

      // Generate with the active model
      generateWithModel: async (prompt: string) => {
        const state = get();
        if (!state.activeModel || !state.activeProvider) {
          throw new Error("No model selected");
        }
        
        set({ isGenerating: true });
        
        try {
          const response = await llmService.generate(
            state.activeProvider,
            state.activeModel,
            prompt,
            0.7
          );
          
          // Update performance metrics
          const metrics = {
            tokens_per_second: response.tokens_per_second,
            time_to_first_token: null,
            memory_usage: null,
            last_updated: new Date().toISOString()
          };
          
          set(state => ({
            lastGeneration: response,
            performanceMetrics: {
              ...state.performanceMetrics,
              [state.activeModel!]: metrics
            },
            isGenerating: false
          }));
          
          return response.text;
        } catch (error) {
          console.error("Generation failed:", error);
          set({ isGenerating: false });
          throw error;
        }
      },

      // Switch active model
      switchModel: async (modelId: string, provider: "Ollama" | "LMStudio") => {
        set({
          activeModel: modelId,
          activeProvider: provider
        });
      },

      // Add message to chat history
      addToChatHistory: (message: Message) => {
        set(state => ({
          chatHistory: [...state.chatHistory, message]
        }));
      },

      // Clear chat history
      clearChatHistory: () => {
        set({ chatHistory: [] });
      }
    }),
    { name: "llm-store" }
  )
);

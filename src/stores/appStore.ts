import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "standby" | "offline";
  model: string;
  performance: {
    tokensPerSecond: number;
    avgResponseTime: number;
  };
}

interface HardwareProfile {
  cpu: string;
  ram: number;
  gpu: string | null;
  vram: number;
}

interface AppState {
  // UI State
  activeAgent: string | null;
  sidebarCollapsed: boolean;
  
  // Agent State
  agents: Agent[];
  
  // Hardware State
  hardwareProfile: HardwareProfile | null;
  
  // Actions
  setActiveAgent: (agentId: string) => void;
  toggleSidebar: () => void;
  updateAgentPerformance: (agentId: string, performance: Partial<Agent["performance"]>) => void;
  setHardwareProfile: (profile: HardwareProfile) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial State
      activeAgent: "react-specialist",
      sidebarCollapsed: false,
      agents: [
        {
          id: "react-specialist",
          name: "React Specialist",
          description: "Expert in React, TypeScript, and modern frontend patterns",
          status: "active",
          model: "codellama-13b-instruct",
          performance: { tokensPerSecond: 47.2, avgResponseTime: 850 }
        },
        {
          id: "debug-detective",
          name: "Debug Detective",
          description: "Specialized in finding and fixing code issues",
          status: "standby",
          model: "claude-3-sonnet",
          performance: { tokensPerSecond: 0, avgResponseTime: 0 }
        },
        {
          id: "rust-engineer",
          name: "Rust Engineer",
          description: "Systems programming and Tauri backend expert",
          status: "offline",
          model: "deepseek-coder-33b",
          performance: { tokensPerSecond: 0, avgResponseTime: 0 }
        }
      ],
      hardwareProfile: null,

      // Actions
      setActiveAgent: (agentId) =>
        set((state) => ({ ...state, activeAgent: agentId })),
      
      toggleSidebar: () =>
        set((state) => ({ ...state, sidebarCollapsed: !state.sidebarCollapsed })),
      
      updateAgentPerformance: (agentId, performance) =>
        set((state) => ({
          ...state,
          agents: state.agents.map((agent) =>
            agent.id === agentId
              ? { ...agent, performance: { ...agent.performance, ...performance } }
              : agent
          ),
        })),
      
      setHardwareProfile: (profile) =>
        set((state) => ({ ...state, hardwareProfile: profile })),
    }),
    { name: "agentforge-store" }
  )
);

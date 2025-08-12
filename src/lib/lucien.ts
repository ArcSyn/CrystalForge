
export type LucienConfig = {
  brand: { name: string; product: string };
  theme: { 
    bg: string; 
    fg: string; 
    accent: string; 
    muted: string; 
    panel: string; 
    ring: string;
    crystal: string;
  };
  paths: { 
    root: string; 
    crystals: string; 
    queue: string; 
    results: string; 
    memory: string; 
    spells: string;
  };
};

const FALLBACK: LucienConfig = {
  brand: { name: "Lucien", product: "Crystal Forge" },
  theme: { 
    bg: "#0b0b11", 
    fg: "#e5e7eb", 
    accent: "#00ffa8", 
    muted: "#7c7f8a", 
    panel: "#111217", 
    ring: "#33ffbb",
    crystal: "#9333ea"
  },
  paths: { 
    root: "", 
    crystals: "", 
    queue: "", 
    results: "", 
    memory: "", 
    spells: ""
  }
};

// For now, we'll use localStorage in the browser and invoke Tauri commands for file system
export async function loadLucienConfig(): Promise<LucienConfig> {
  try {
    // Try to load from localStorage first
    const stored = localStorage.getItem('lucien-config');
    if (stored) {
      return JSON.parse(stored) as LucienConfig;
    }
    
    // Otherwise use default config
    const config = {
      ...FALLBACK,
      paths: {
        root: "~/.lucien",
        crystals: "~/.lucien/crystals", 
        queue: "~/.lucien/queue",
        results: "~/.lucien/results",
        memory: "~/.lucien/memory",
        spells: "~/.lucien/spells"
      }
    };
    
    // Save to localStorage
    localStorage.setItem('lucien-config', JSON.stringify(config));
    
    // Initialize with Amethyst crystal
    const amethyst = {
      id: "amethyst.dev",
      name: "Amethyst",
      crystal: "amethyst",
      element: "Code Generation",
      properties: ["Clarity", "Focus", "Spiritual Wisdom"],
      role: "Code generator & refactorer",
      model: "ollama:codellama-13b-instruct",
      permissions: ["read_project", "write_code", "run_checks"],
      entrypoints: {
        task: "codegen",
        spell: "spells/amethyst.codegen.md"
      },
      memory: "memory/amethyst.md",
      meta: {
        tags: ["code", "refactor", "react"],
        color: "#9333ea",
        rarity: "legendary"
      }
    };
    
    // Store initial crystal in localStorage
    const crystals = [amethyst];
    localStorage.setItem('lucien-crystals', JSON.stringify(crystals));
    
    return config;
  } catch (error) {
    console.error("Failed to load Lucien config:", error);
    return FALLBACK;
  }
}

export async function saveLucienConfig(config: LucienConfig): Promise<void> {
  localStorage.setItem('lucien-config', JSON.stringify(config));
}

export async function loadCrystals() {
  const stored = localStorage.getItem('lucien-crystals');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

// Export a default config instance
export const lucienConfig = {
  theme: {
    primary: '#a855f7',
    secondary: '#3b82f6',
    accent: '#10b981'
  }
};

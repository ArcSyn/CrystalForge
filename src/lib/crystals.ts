import type { CrystalManifest } from "@/types/crystal";

// Default Amethyst crystal
const DEFAULT_CRYSTALS: CrystalManifest[] = [
  {
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
  }
];

export async function loadCrystals(): Promise<CrystalManifest[]> {
  try {
    // Try to load from localStorage first
    const stored = localStorage.getItem('lucien-crystals');
    if (stored) {
      const crystals = JSON.parse(stored) as CrystalManifest[];
      if (crystals.length > 0) {
        return crystals;
      }
    }
    
    // If no stored crystals, use defaults
    localStorage.setItem('lucien-crystals', JSON.stringify(DEFAULT_CRYSTALS));
    return DEFAULT_CRYSTALS;
  } catch (error) {
    console.warn("Failed to load crystals:", error);
    return DEFAULT_CRYSTALS;
  }
}

export async function initializeCrystals(): Promise<CrystalManifest[]> {
  const crystals = await loadCrystals();
  console.log("🔮 Loaded crystals:", crystals);
  return crystals;
}

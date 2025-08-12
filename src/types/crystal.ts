export type CrystalType =
  | "amethyst" | "quartz" | "obsidian" | "rose-quartz" | "citrine"
  | "fluorite" | "labradorite" | "carnelian" | "moonstone";

export type CrystalElement = 
  | "Code Generation" | "Universal Router" | "Security" | "UI/UX"
  | "Business Logic" | "Analysis" | "Debugging" | "DevOps" | "Planning";

export interface CrystalManifest {
  id: string;
  name: string;
  crystal: CrystalType;
  element: CrystalElement;
  properties: string[];
  role: string;
  model: string;
  permissions: string[];
  entrypoints: { 
    task: string; 
    spell?: string; 
  };
  memory?: string;
  meta?: { 
    tags?: string[]; 
    color?: string;
    rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  };
}

export interface CrystalPerformance {
  tokensPerSecond: number;
  avgResponseTime: number;
  successRate: number;
  lastUsed: Date;
  totalCasts: number;
}

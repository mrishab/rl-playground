import type { RLAlgorithm } from "@/lib/rl/types";

export type SavedRLAgent = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  algorithm: RLAlgorithm;
  algorithmName: string;
  hyperparameters: {
    learningRate: number;
    discountFactor: number;
    explorationRate: number;
  };
  metrics: {
    totalEpisodes: number;
    successRate: number;
    finalReward: number;
    averageSteps: number;
  };
  gridConfig: {
    gridSize: number;
    startPos: [number, number];
    goalPos: [number, number];
    hazards: [number, number][];
    obstacles: [number, number][];
  };
  qTable: Record<string, [number, number, number, number]>;
};

export type SavedAgentsState = {
  agents: SavedRLAgent[];
  selectedAgent: SavedRLAgent | null;
  searchQuery: string;
};

export type SavedAgentsActions = {
  loadAgents: () => void;
  saveAgent: (
    agent: Omit<SavedRLAgent, "id" | "createdAt" | "updatedAt">,
  ) => SavedRLAgent;
  deleteAgent: (id: string) => void;
  renameAgent: (id: string, newName: string) => void;
  clearAll: () => void;
  importAgents: (rawJson: string) => number;
  exportAgents: () => string;
  setSelectedAgent: (agent: SavedRLAgent | null) => void;
  setSearchQuery: (query: string) => void;
};

export type SavedAgentsStore = SavedAgentsState & SavedAgentsActions;

import type {
  RLAlgorithm,
  QTable,
  SmartObstacle,
  RLEnvironmentRules,
} from "@/lib/rl/types";

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
    successCount?: number;
    successRate: number;
    finalReward: number;
    averageSteps: number;
  };
  gridConfig: {
    gridSize: number;
    gridWidth?: number;
    gridHeight?: number;
    startPos: [number, number];
    goalPos: [number, number];
    hazards: [number, number][];
    obstacles: [number, number][];
    muds?: [number, number][];
    ices?: [number, number][];
    smartObstacles?: SmartObstacle[];
    initialSmartObstacles?: SmartObstacle[];
  };
  rules?: RLEnvironmentRules;
  history?: {
    rewardHistory?: number[];
    stepsHistory?: number[];
    tdHistory?: number[];
  };
  qTable: QTable;
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

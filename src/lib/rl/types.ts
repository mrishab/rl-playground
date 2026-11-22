export type Action = 0 | 1 | 2 | 3; // 0: Up, 1: Right, 2: Down, 3: Left

export const ACTION_NAMES: Record<Action, string> = {
  0: "Up",
  1: "Right",
  2: "Down",
  3: "Left",
};

export const ACTION_ARROWS: Record<Action, string> = {
  0: "↑",
  1: "→",
  2: "↓",
  3: "←",
};

export const ACTION_DELTAS: Record<Action, [number, number]> = {
  0: [-1, 0],
  1: [0, 1],
  2: [1, 0],
  3: [0, -1],
};

export type ObstacleStrategy =
  | "patrol"
  | "chase"
  | "ambush"
  | "guard"
  | "random";

export type SmartObstacle = {
  id: string;
  r: number;
  c: number;
  strategy: ObstacleStrategy;
  patrolDir?: [number, number];
};

export type CellType =
  | "empty"
  | "start"
  | "goal"
  | "hazard"
  | "obstacle"
  | "smart-obstacle"
  | "mud"
  | "ice";

export type RLAlgorithm =
  | "q-learning"
  | "sarsa"
  | "expected-sarsa"
  | "double-q"
  | "monte-carlo"
  | "value-iteration"
  | "policy-iteration";

export type RLEnvironmentRules = {
  gridSize: number;
  gridWidth?: number;
  gridHeight?: number;
  stepReward: number;
  goalReward: number;
  hazardPenalty: number;
  mudPenalty?: number;
  slipProbability: number;
  hazardIsTerminal: boolean;
  smartObstaclePenalty?: number;
  smartObstacleIsTerminal?: boolean;
  cliffReset?: boolean;
};

export type RLHyperparameters = {
  learningRate: number; // alpha
  discountFactor: number; // gamma
  explorationRate: number; // epsilon
  algorithm: RLAlgorithm;
  epsilonDecay?: number; // per-episode multiplier (e.g. 0.995)
  minEpsilon?: number;
};

export type EpisodeResult = {
  episode: number;
  totalReward: number;
  steps: number;
  reachedGoal: boolean;
  caughtByObstacle?: boolean;
  tdError?: number;
};

export type TransitionLog = {
  state: [number, number];
  action: Action;
  reward: number;
  nextState: [number, number];
  qBefore: number;
  qAfter: number;
  targetQ: number;
  formula: string;
};

// Multi-Armed Bandit Types
export type BanditAlgorithm =
  | "epsilon-greedy"
  | "ucb1"
  | "optimistic-initial"
  | "thompson-sampling"
  | "pure-greedy";

export type BanditArm = {
  id: number;
  trueMean: number;
  variance: number;
  pulls: number;
  estimatedValue: number;
  successes?: number;
  failures?: number;
  ucbBonus?: number;
  ucbScore?: number;
  posteriorMean?: number;
  posteriorStd?: number;
};

export type BanditRunConfig = {
  numArms: number;
  algorithm: BanditAlgorithm;
  epsilon: number;
  c: number; // UCB parameter
  initialQ: number;
  alpha?: number; // Constant step-size parameter for optimistic & non-stationary
  estimator?: "sample-average" | "constant-alpha";
  lockTestbed?: boolean;
  isStationary: boolean;
  driftStdDev: number;
};
export type BanditConfig = BanditRunConfig;

export type BanditStepResult = {
  step: number;
  chosenArm: number;
  reward: number;
  isOptimal: boolean;
  cumulativeReward: number;
  averageReward: number;
};

// Dynamic Programming Types
export type DPAlgorithm = "value-iteration" | "policy-iteration";

export type GridCoordKey = `${number},${number}`;
export type StateKey = GridCoordKey | (string & {});
export type StateValueTable = Record<StateKey, number>;
export type StatePolicyTable = Record<StateKey, Action>;
export type StateVisitTable = Record<StateKey, number>;
export type QActionValues = [number, number, number, number];
export type QTable = Record<StateKey, QActionValues>;

export type DPSweepResult = {
  sweep: number;
  delta: number;
  converged: boolean;
  values: StateValueTable;
  policy: StatePolicyTable;
};

// Saved Agent Types
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
    gridWidth?: number;
    gridHeight?: number;
    startPos: [number, number];
    goalPos: [number, number];
    hazards: [number, number][];
    obstacles: [number, number][];
  };
  qTable: QTable;
};

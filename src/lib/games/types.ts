export type GameId =
  | "pong"
  | "pacman"
  | "chess"
  | "strategy"
  | "ice-maze"
  | "slot-machine"
  | "lemonade"
  | "continuous-car";

export type ControllerMode = "rl" | "search";

export type RLAlgorithm = "q-learning" | "sarsa";

export type GameHyperparameters = {
  learningRate: number; // alpha
  discountFactor: number; // gamma
  explorationRate: number; // epsilon
  epsilonDecay: number;
  algorithm: RLAlgorithm;
};

export type GameMetrics = {
  episodes: number;
  wins: number;
  losses: number;
  score: number;
  highScore: number;
  avgReward: number;
  recentRewards: number[];
  winRate: number;
  qTableSize: number;
};

// Pong Types
export type PongState = {
  ballX: number;
  ballY: number;
  ballVx: number;
  ballVy: number;
  agentY: number;
  opponentY: number;
  agentScore: number;
  opponentScore: number;
  rallyLength: number;
  maxRally: number;
  lastReward: number;
  isOver: boolean;
};

// Pac-Man Types
export type PacmanEntity = {
  row: number;
  col: number;
};

export type Ghost = {
  id: string;
  row: number;
  col: number;
  color: string;
  isFrightened: boolean;
};

export type PacmanState = {
  pacman: PacmanEntity;
  ghosts: Ghost[];
  pellets: Set<string>; // "r,c"
  powerPellets: Set<string>; // "r,c"
  frightenedTimer: number;
  score: number;
  pelletsRemaining: number;
  ghostsEaten: number;
  isOver: boolean;
  won: boolean;
  lastReward: number;
};

// Chess Types
export type ChessPieceType = "K" | "R" | "N" | "P" | "Q" | "B";
export type ChessPieceColor = "w" | "b";

export type ChessPiece = {
  type: ChessPieceType;
  color: ChessPieceColor;
};

export type ChessMove = {
  from: [number, number];
  to: [number, number];
  piece: ChessPiece;
  captured?: ChessPiece;
  isCheck?: boolean;
};

export type ChessState = {
  board: (ChessPiece | null)[][];
  turn: ChessPieceColor;
  moveCount: number;
  isOver: boolean;
  winner: ChessPieceColor | "draw" | null;
  lastMove: ChessMove | null;
  agentCaptures: ChessPieceType[];
  opponentCaptures: ChessPieceType[];
  lastReward: number;
};

// Strategy Game Types
export type TacticalNode = {
  id: string;
  row: number;
  col: number;
  owner: "agent" | "opponent" | "neutral";
};

export type StrategyUnit = {
  row: number;
  col: number;
  health: number;
  maxHealth: number;
};

export type StrategyState = {
  agent: StrategyUnit;
  opponent: StrategyUnit;
  nodes: TacticalNode[];
  obstacles: [number, number][];
  turn: number;
  score: number;
  isOver: boolean;
  winner: "agent" | "opponent" | "draw" | null;
  lastReward: number;
  lastActionDesc: string;
};

// Ice Maze Types
export type IceMazeState = {
  agentRow: number;
  agentCol: number;
  goalRow: number;
  goalCol: number;
  hazards: [number, number][];
  walls: [number, number][];
  slipRate: number;
  stepCount: number;
  isOver: boolean;
  won: boolean;
  lastReward: number;
  lastSlip: { intended: string; actual: string } | null;
  aStarPath: [number, number][];
  controller: ControllerMode;
  failedBySlip: boolean;
  visitedPath: [number, number][];
  policyArrows?: Record<string, number>;
};

// Slot Machine Bandit Types
export type SlotMachineArm = {
  id: number;
  name: string;
  symbol: string;
  color: string;
  winProb: number;
  payout: number;
  pulls: number;
  wins: number;
  estimatedQ: number;
  trueEV: number;
};

export type SlotMachineState = {
  machines: SlotMachineArm[];
  reels: [string, string, string];
  isSpinning: boolean;
  lastPullArm: number;
  lastPayout: number;
  bankroll: number;
  totalPulls: number;
  controller: ControllerMode;
  searchStrategyDesc: string;
  lastReward: number;
  isOver: boolean;
};

// Dynamic Inventory Management (Lemonade Stand) Types
export type WeatherType = "Sunny" | "Cloudy" | "Rainy" | "Heatwave";

export type LemonadeState = {
  day: number;
  weather: WeatherType;
  forecastTomorrow: WeatherType;
  cupsPrepped: number;
  customerDemand: number;
  cupsSold: number;
  cupsSpoiled: number;
  customersLost: number;
  dailyProfit: number;
  cashBalance: number;
  totalRevenue: number;
  totalSpoilageCost: number;
  totalStockoutLost: number;
  lastReward: number;
  isOver: boolean;
  controller: ControllerMode;
  learnedPolicy: Record<WeatherType, number>;
};

// Continuous Track Autonomous Car Types
export type VillainCar = {
  id: string;
  name: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  baseSpeed: number;
  color: string;
  targetRadius: number;
  lapProgress: number; // 0 to 1
  lapCount: number;
  totalProgress: number;
  isSkidding: boolean;
  isError: boolean;
  errorTimer: number;
};

export type BumpEvent = {
  type: "hit_by_villain" | "bumped_villain";
  villainId: string;
  villainName: string;
  description: string;
  timestamp: number;
};

export type NeuralNetworkApproximator = {
  weightsIn: number[][]; // 4 inputs x 8 hidden neurons
  biasHidden: number[]; // 8
  weightsOut: number[]; // 8 hidden x 1 output (steering)
  biasOut: number;
  hiddenActivations: number[];
  weightsThrottle?: number[]; // 8 hidden x 1 output (throttle)
  biasThrottle?: number;
};

export type ContinuousCarState = {
  x: number;
  y: number;
  angle: number; // in radians
  speed: number;
  sensorLeft: number;
  sensorRight: number;
  sensorForward: number;
  steering: number;
  throttle: number;
  isBoosting: boolean;
  boostMeter: number; // 0 to 100
  isSkidding: boolean;
  lossOfControl: number; // 0 (full grip) to 1 (full skid)
  racePosition: number; // 1, 2, 3
  villains: VillainCar[];
  villainErrorRate: number; // default 0.10 (10%)
  lastBump: BumpEvent | null;
  skidMarks: [number, number][];
  lapCount: number;
  lapProgress: number; // 0 to 1
  isCollided: boolean;
  isOver: boolean;
  lastReward: number;
  controller: ControllerMode;
  neuralNetwork: NeuralNetworkApproximator;
  trackPath: [number, number][];
};

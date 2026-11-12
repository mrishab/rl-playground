export type GameId = "pong" | "pacman" | "chess";

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
export type ChessPieceType = "K" | "R" | "N" | "P" | "Q";
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

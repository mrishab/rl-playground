import { create } from "zustand";
import { PongEngine } from "../lib/games/pongEngine";
import { PacmanEngine } from "../lib/games/pacmanEngine";
import { ChessEngine } from "../lib/games/chessEngine";
import { StrategyEngine } from "../lib/games/strategyEngine";
import type {
  GameHyperparameters,
  GameId,
  GameMetrics,
  PacmanState,
  PongState,
  ChessState,
  StrategyState,
} from "../lib/games/types";

const INITIAL_HYPERPARAMS: GameHyperparameters = {
  learningRate: 0.2,
  discountFactor: 0.95,
  explorationRate: 0.15,
  epsilonDecay: 0.996,
  algorithm: "q-learning",
};

const DEFAULT_METRIC: GameMetrics = {
  episodes: 0,
  wins: 0,
  losses: 0,
  score: 0,
  highScore: 0,
  avgReward: 0,
  recentRewards: [],
  winRate: 0,
  qTableSize: 0,
};

const pong = new PongEngine(INITIAL_HYPERPARAMS);
const pacman = new PacmanEngine(INITIAL_HYPERPARAMS);
const chess = new ChessEngine(INITIAL_HYPERPARAMS);
const strategy = new StrategyEngine(INITIAL_HYPERPARAMS);

export type GamesStoreState = {
  activeGame: GameId;
  isPlaying: boolean;
  speed: 1 | 2 | 5;
  hyperparams: GameHyperparameters;
  pongState: PongState;
  pacmanState: PacmanState;
  chessState: ChessState;
  strategyState: StrategyState;
  metrics: Record<GameId, GameMetrics>;

  setActiveGame: (game: GameId) => void;
  setHyperparams: (patch: Partial<GameHyperparameters>) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: 1 | 2 | 5) => void;
  stepSingle: () => void;
  trainBatch: (episodes: number) => void;
  resetEpisode: () => void;
  resetAll: () => void;
};

export const useGamesStore = create<GamesStoreState>((set, get) => ({
  activeGame: "pong",
  isPlaying: false,
  speed: 1,
  hyperparams: INITIAL_HYPERPARAMS,
  pongState: pong.state,
  pacmanState: pacman.state,
  chessState: chess.state,
  strategyState: strategy.state,
  metrics: {
    pong: { ...DEFAULT_METRIC },
    pacman: { ...DEFAULT_METRIC },
    chess: { ...DEFAULT_METRIC },
    strategy: { ...DEFAULT_METRIC },
  },

  setActiveGame: (activeGame) => {
    set({ activeGame, isPlaying: false });
  },

  setHyperparams: (patch) => {
    set((state) => {
      const next = { ...state.hyperparams, ...patch };
      pong.hyperparams = { ...next };
      pacman.hyperparams = { ...next };
      chess.hyperparams = { ...next };
      strategy.hyperparams = { ...next };
      return { hyperparams: next };
    });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setPlaying: (isPlaying) => {
    set({ isPlaying });
  },

  setSpeed: (speed) => {
    set({ speed });
  },

  stepSingle: () => {
    const { activeGame } = get();
    if (activeGame === "pong") {
      const { reward } = pong.step();
      set((s) => {
        const m = s.metrics.pong;
        const newScore = pong.state.agentScore;
        const highScore = Math.max(m.highScore, newScore);
        const wins = pong.state.agentScore;
        const total = pong.state.agentScore + pong.state.opponentScore;
        const winRate = total > 0 ? (wins / total) * 100 : 0;
        return {
          pongState: { ...pong.state },
          metrics: {
            ...s.metrics,
            pong: {
              ...m,
              score: newScore,
              highScore,
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: pong.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "pacman") {
      const { reward } = pacman.step();
      set((s) => {
        const m = s.metrics.pacman;
        const newScore = pacman.state.score;
        const highScore = Math.max(m.highScore, newScore);
        return {
          pacmanState: { ...pacman.state },
          metrics: {
            ...s.metrics,
            pacman: {
              ...m,
              score: newScore,
              highScore,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: pacman.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "chess") {
      const { reward } = chess.step();
      set((s) => {
        const m = s.metrics.chess;
        return {
          chessState: { ...chess.state },
          metrics: {
            ...s.metrics,
            chess: {
              ...m,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: chess.qTable.size,
            },
          },
        };
      });
    } else {
      const { reward } = strategy.step();
      set((s) => {
        const m = s.metrics.strategy;
        const newScore = strategy.state.score;
        const highScore = Math.max(m.highScore, newScore);
        return {
          strategyState: { ...strategy.state },
          metrics: {
            ...s.metrics,
            strategy: {
              ...m,
              score: newScore,
              highScore,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: strategy.qTable.size,
            },
          },
        };
      });
    }
  },

  trainBatch: (episodes) => {
    const { activeGame } = get();
    if (activeGame === "pong") {
      const res = pong.trainBatch(episodes);
      set((s) => {
        const m = s.metrics.pong;
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        return {
          pongState: { ...pong.state },
          metrics: {
            ...s.metrics,
            pong: {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: pong.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "pacman") {
      const res = pacman.trainBatch(episodes);
      set((s) => {
        const m = s.metrics.pacman;
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        return {
          pacmanState: { ...pacman.state },
          metrics: {
            ...s.metrics,
            pacman: {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: pacman.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "chess") {
      const res = chess.trainBatch(episodes);
      set((s) => {
        const m = s.metrics.chess;
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        const totalLosses = m.losses + res.losses;
        return {
          chessState: { ...chess.state },
          metrics: {
            ...s.metrics,
            chess: {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              losses: totalLosses,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: chess.qTable.size,
            },
          },
        };
      });
    } else {
      const res = strategy.trainBatch(episodes);
      set((s) => {
        const m = s.metrics.strategy;
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        const totalLosses = m.losses + res.losses;
        return {
          strategyState: { ...strategy.state },
          metrics: {
            ...s.metrics,
            strategy: {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              losses: totalLosses,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: strategy.qTable.size,
            },
          },
        };
      });
    }
  },

  resetEpisode: () => {
    const { activeGame } = get();
    if (activeGame === "pong") {
      pong.resetEpisode();
      set({ pongState: { ...pong.state } });
    } else if (activeGame === "pacman") {
      pacman.resetEpisode();
      set({ pacmanState: { ...pacman.state } });
    } else if (activeGame === "chess") {
      chess.resetEpisode();
      set({ chessState: { ...chess.state } });
    } else {
      strategy.resetEpisode();
      set({ strategyState: { ...strategy.state } });
    }
  },

  resetAll: () => {
    const { activeGame } = get();
    if (activeGame === "pong") {
      pong.resetAll();
      set((s) => ({
        pongState: { ...pong.state },
        metrics: { ...s.metrics, pong: { ...DEFAULT_METRIC } },
      }));
    } else if (activeGame === "pacman") {
      pacman.resetAll();
      set((s) => ({
        pacmanState: { ...pacman.state },
        metrics: { ...s.metrics, pacman: { ...DEFAULT_METRIC } },
      }));
    } else if (activeGame === "chess") {
      chess.resetAll();
      set((s) => ({
        chessState: { ...chess.state },
        metrics: { ...s.metrics, chess: { ...DEFAULT_METRIC } },
      }));
    } else {
      strategy.resetAll();
      set((s) => ({
        strategyState: { ...strategy.state },
        metrics: { ...s.metrics, strategy: { ...DEFAULT_METRIC } },
      }));
    }
  },
}));

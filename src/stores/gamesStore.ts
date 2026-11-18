import { create } from "zustand";
import { PongEngine } from "../lib/games/pongEngine";
import { PacmanEngine } from "../lib/games/pacmanEngine";
import { ChessEngine } from "../lib/games/chessEngine";
import { StrategyEngine } from "../lib/games/strategyEngine";
import { IceMazeEngine } from "../lib/games/iceMazeEngine";
import { SlotMachineEngine } from "../lib/games/slotMachineEngine";
import { LemonadeEngine } from "../lib/games/lemonadeEngine";
import { ContinuousCarEngine } from "../lib/games/continuousCarEngine";
import type {
  ContinuousCarState,
  ControllerMode,
  GameHyperparameters,
  GameId,
  GameMetrics,
  IceMazeState,
  LemonadeState,
  PacmanState,
  PongState,
  SlotMachineState,
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
const iceMaze = new IceMazeEngine(INITIAL_HYPERPARAMS);
const slotMachine = new SlotMachineEngine(INITIAL_HYPERPARAMS);
const lemonade = new LemonadeEngine(INITIAL_HYPERPARAMS);
const continuousCar = new ContinuousCarEngine(INITIAL_HYPERPARAMS);

export type GamesStoreState = {
  activeGame: GameId;
  isPlaying: boolean;
  speed: 1 | 2 | 5;
  controllerMode: ControllerMode;
  hyperparams: GameHyperparameters;
  pongState: PongState;
  pacmanState: PacmanState;
  chessState: ChessState;
  strategyState: StrategyState;
  iceMazeState: IceMazeState;
  slotMachineState: SlotMachineState;
  lemonadeState: LemonadeState;
  continuousCarState: ContinuousCarState;
  metrics: Record<GameId, GameMetrics>;

  setActiveGame: (game: GameId) => void;
  setControllerMode: (mode: ControllerMode) => void;
  setIceMazeSlipRate: (rate: number) => void;
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
  activeGame: "ice-maze",
  isPlaying: false,
  speed: 1,
  controllerMode: "rl",
  hyperparams: INITIAL_HYPERPARAMS,
  pongState: pong.state,
  pacmanState: pacman.state,
  chessState: chess.state,
  strategyState: strategy.state,
  iceMazeState: iceMaze.state,
  slotMachineState: slotMachine.state,
  lemonadeState: lemonade.state,
  continuousCarState: continuousCar.state,
  metrics: {
    pong: { ...DEFAULT_METRIC },
    pacman: { ...DEFAULT_METRIC },
    chess: { ...DEFAULT_METRIC },
    strategy: { ...DEFAULT_METRIC },
    "ice-maze": { ...DEFAULT_METRIC },
    "slot-machine": { ...DEFAULT_METRIC },
    lemonade: { ...DEFAULT_METRIC },
    "continuous-car": { ...DEFAULT_METRIC },
  },

  setActiveGame: (activeGame) => {
    set({ activeGame, isPlaying: false });
  },

  setControllerMode: (controllerMode) => {
    iceMaze.setController(controllerMode);
    slotMachine.setController(controllerMode);
    lemonade.setController(controllerMode);
    continuousCar.setController(controllerMode);
    set({
      controllerMode,
      iceMazeState: { ...iceMaze.state },
      slotMachineState: { ...slotMachine.state },
      lemonadeState: { ...lemonade.state },
      continuousCarState: { ...continuousCar.state },
    });
  },

  setIceMazeSlipRate: (rate) => {
    iceMaze.setSlipRate(rate);
    set({ iceMazeState: { ...iceMaze.state } });
  },

  setHyperparams: (patch) => {
    set((state) => {
      const next = { ...state.hyperparams, ...patch };
      pong.hyperparams = { ...next };
      pacman.hyperparams = { ...next };
      chess.hyperparams = { ...next };
      strategy.hyperparams = { ...next };
      iceMaze.hyperparams = { ...next };
      slotMachine.hyperparams = { ...next };
      lemonade.hyperparams = { ...next };
      continuousCar.hyperparams = { ...next };
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
      const { reward, done } = pong.step();
      set((s) => {
        const m = s.metrics.pong;
        const newScore = pong.state.agentScore;
        const highScore = Math.max(m.highScore, newScore);
        const newEpisodes = done ? m.episodes + 1 : m.episodes;
        const newWins = done && pong.state.ballX <= 0 ? m.wins + 1 : m.wins;
        const newLosses =
          done && pong.state.ballX >= pong.width ? m.losses + 1 : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        return {
          pongState: { ...pong.state },
          metrics: {
            ...s.metrics,
            pong: {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
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
      const { reward, done } = pacman.step();
      set((s) => {
        const m = s.metrics.pacman;
        const newScore = pacman.state.score;
        const highScore = Math.max(m.highScore, newScore);
        const newEpisodes = done ? m.episodes + 1 : m.episodes;
        const newWins = done && pacman.state.won ? m.wins + 1 : m.wins;
        const newLosses = done && !pacman.state.won ? m.losses + 1 : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        return {
          pacmanState: { ...pacman.state },
          metrics: {
            ...s.metrics,
            pacman: {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
              score: newScore,
              highScore,
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: pacman.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "chess") {
      const { reward, done } = chess.step();
      set((s) => {
        const m = s.metrics.chess;
        const newEpisodes = done ? m.episodes + 1 : m.episodes;
        const newWins =
          done && chess.state.winner === "w" ? m.wins + 1 : m.wins;
        const newLosses =
          done && chess.state.winner === "b" ? m.losses + 1 : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        const newScore =
          chess.state.agentCaptures.length * 15 +
          (chess.state.winner === "w" ? 100 : 0);
        const highScore = Math.max(m.highScore, newScore);
        return {
          chessState: { ...chess.state },
          metrics: {
            ...s.metrics,
            chess: {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
              score: newScore,
              highScore,
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: chess.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "strategy") {
      const { reward, done } = strategy.step();
      set((s) => {
        const m = s.metrics.strategy;
        const newScore = strategy.state.score;
        const highScore = Math.max(m.highScore, newScore);
        const newEpisodes = done ? m.episodes + 1 : m.episodes;
        const newWins =
          done && strategy.state.winner === "agent" ? m.wins + 1 : m.wins;
        const newLosses =
          done && strategy.state.winner === "opponent"
            ? m.losses + 1
            : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        return {
          strategyState: { ...strategy.state },
          metrics: {
            ...s.metrics,
            strategy: {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
              score: newScore,
              highScore,
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: strategy.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "ice-maze") {
      const { reward, done } = iceMaze.step();
      set((s) => {
        const m = s.metrics["ice-maze"];
        const newEpisodes = done ? m.episodes + 1 : m.episodes;
        const newWins = done && iceMaze.state.won ? m.wins + 1 : m.wins;
        const newLosses = done && !iceMaze.state.won ? m.losses + 1 : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        const newScore = iceMaze.state.won ? 100 : 0;
        return {
          iceMazeState: { ...iceMaze.state },
          metrics: {
            ...s.metrics,
            "ice-maze": {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
              score: newScore,
              highScore: Math.max(m.highScore, newScore),
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: iceMaze.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "slot-machine") {
      const { reward } = slotMachine.step();
      set((s) => {
        const m = s.metrics["slot-machine"];
        const newEpisodes = m.episodes + 1;
        const newWins = reward > 0 ? m.wins + 1 : m.wins;
        const newLosses = reward <= 0 ? m.losses + 1 : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        const newScore = Math.round(slotMachine.state.bankroll);
        return {
          slotMachineState: { ...slotMachine.state },
          metrics: {
            ...s.metrics,
            "slot-machine": {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
              score: newScore,
              highScore: Math.max(m.highScore, newScore),
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: 4,
            },
          },
        };
      });
    } else if (activeGame === "lemonade") {
      const { reward, done } = lemonade.step();
      set((s) => {
        const m = s.metrics.lemonade;
        const newEpisodes = done ? m.episodes + 1 : m.episodes;
        const won = lemonade.state.cashBalance > 150;
        const newWins = done && won ? m.wins + 1 : m.wins;
        const newLosses = done && !won ? m.losses + 1 : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        const newScore = Math.round(lemonade.state.cashBalance);
        return {
          lemonadeState: { ...lemonade.state },
          metrics: {
            ...s.metrics,
            lemonade: {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
              score: newScore,
              highScore: Math.max(m.highScore, newScore),
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: lemonade.qTable.size,
            },
          },
        };
      });
    } else {
      const { reward, done } = continuousCar.step();
      set((s) => {
        const m = s.metrics["continuous-car"];
        const newEpisodes = done ? m.episodes + 1 : m.episodes;
        const won =
          !continuousCar.state.isCollided && continuousCar.state.lapCount > 0;
        const newWins = done && won ? m.wins + 1 : m.wins;
        const newLosses =
          done && continuousCar.state.isCollided ? m.losses + 1 : m.losses;
        const winRate = newEpisodes > 0 ? (newWins / newEpisodes) * 100 : 0;
        const newScore = continuousCar.state.lapCount * 50;
        return {
          continuousCarState: { ...continuousCar.state },
          metrics: {
            ...s.metrics,
            "continuous-car": {
              ...m,
              episodes: newEpisodes,
              wins: newWins,
              losses: newLosses,
              score: newScore,
              highScore: Math.max(m.highScore, newScore),
              winRate,
              recentRewards: [...m.recentRewards.slice(-19), reward],
              qTableSize: 8,
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
              score: pong.state.agentScore,
              highScore: Math.max(m.highScore, pong.state.agentScore),
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
              score: pacman.state.score,
              highScore: Math.max(m.highScore, pacman.state.score),
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
        const latestScore =
          chess.state.agentCaptures.length * 15 +
          (chess.state.winner === "w" ? 100 : 0);
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
              score: latestScore,
              highScore: Math.max(m.highScore, latestScore),
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: chess.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "strategy") {
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
              score: strategy.state.score,
              highScore: Math.max(m.highScore, strategy.state.score),
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: strategy.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "ice-maze") {
      const res = iceMaze.trainBatch(episodes);
      set((s) => {
        const m = s.metrics["ice-maze"];
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        return {
          iceMazeState: { ...iceMaze.state },
          metrics: {
            ...s.metrics,
            "ice-maze": {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              score: iceMaze.state.won ? 100 : 0,
              highScore: Math.max(m.highScore, iceMaze.state.won ? 100 : 0),
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: iceMaze.qTable.size,
            },
          },
        };
      });
    } else if (activeGame === "slot-machine") {
      const res = slotMachine.trainBatch(episodes);
      set((s) => {
        const m = s.metrics["slot-machine"];
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        return {
          slotMachineState: { ...slotMachine.state },
          metrics: {
            ...s.metrics,
            "slot-machine": {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              score: Math.round(slotMachine.state.bankroll),
              highScore: Math.max(
                m.highScore,
                Math.round(slotMachine.state.bankroll),
              ),
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: 4,
            },
          },
        };
      });
    } else if (activeGame === "lemonade") {
      const res = lemonade.trainBatch(episodes);
      set((s) => {
        const m = s.metrics.lemonade;
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        return {
          lemonadeState: { ...lemonade.state },
          metrics: {
            ...s.metrics,
            lemonade: {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              score: Math.round(lemonade.state.cashBalance),
              highScore: Math.max(
                m.highScore,
                Math.round(lemonade.state.cashBalance),
              ),
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: lemonade.qTable.size,
            },
          },
        };
      });
    } else {
      const res = continuousCar.trainBatch(episodes);
      set((s) => {
        const m = s.metrics["continuous-car"];
        const totalEps = m.episodes + res.episodes;
        const totalWins = m.wins + res.wins;
        return {
          continuousCarState: { ...continuousCar.state },
          metrics: {
            ...s.metrics,
            "continuous-car": {
              ...m,
              episodes: totalEps,
              wins: totalWins,
              winRate: totalEps > 0 ? (totalWins / totalEps) * 100 : 0,
              score: continuousCar.state.lapCount * 50,
              highScore: Math.max(
                m.highScore,
                continuousCar.state.lapCount * 50,
              ),
              avgReward:
                (m.avgReward * m.episodes + res.avgReward * res.episodes) /
                totalEps,
              qTableSize: 8,
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
    } else if (activeGame === "strategy") {
      strategy.resetEpisode();
      set({ strategyState: { ...strategy.state } });
    } else if (activeGame === "ice-maze") {
      iceMaze.resetEpisode();
      set({ iceMazeState: { ...iceMaze.state } });
    } else if (activeGame === "slot-machine") {
      slotMachine.resetEpisode();
      set({ slotMachineState: { ...slotMachine.state } });
    } else if (activeGame === "lemonade") {
      lemonade.resetEpisode();
      set({ lemonadeState: { ...lemonade.state } });
    } else {
      continuousCar.resetEpisode();
      set({ continuousCarState: { ...continuousCar.state } });
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
    } else if (activeGame === "strategy") {
      strategy.resetAll();
      set((s) => ({
        strategyState: { ...strategy.state },
        metrics: { ...s.metrics, strategy: { ...DEFAULT_METRIC } },
      }));
    } else if (activeGame === "ice-maze") {
      iceMaze.resetAll();
      set((s) => ({
        iceMazeState: { ...iceMaze.state },
        metrics: { ...s.metrics, "ice-maze": { ...DEFAULT_METRIC } },
      }));
    } else if (activeGame === "slot-machine") {
      slotMachine.resetAll();
      set((s) => ({
        slotMachineState: { ...slotMachine.state },
        metrics: { ...s.metrics, "slot-machine": { ...DEFAULT_METRIC } },
      }));
    } else if (activeGame === "lemonade") {
      lemonade.resetAll();
      set((s) => ({
        lemonadeState: { ...lemonade.state },
        metrics: { ...s.metrics, lemonade: { ...DEFAULT_METRIC } },
      }));
    } else {
      continuousCar.resetAll();
      set((s) => ({
        continuousCarState: { ...continuousCar.state },
        metrics: { ...s.metrics, "continuous-car": { ...DEFAULT_METRIC } },
      }));
    }
  },
}));

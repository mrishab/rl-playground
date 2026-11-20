import type { GameId } from "@/lib/games/types";

export interface SearchComparison {
  search: string;
  rl: string;
}

export const SEARCH_COMPARISONS: Record<GameId, SearchComparison> = {
  "ice-maze": {
    search: "A* assumes deterministic moves. Ice slip causes pit falls.",
    rl: "RL learns stochastic returns, maintaining safety buffers.",
  },
  "slot-machine": {
    search: "Static heuristics stall on suboptimal payout arms.",
    rl: "RL balances explore-exploit to find maximum EV.",
  },
  lemonade: {
    search: "Fixed prep causes rain spoilage and heatwave stockouts.",
    rl: "RL tunes prep to weather shifts to protect margin.",
  },
  "continuous-car": {
    search: "Discrete trees cannot handle continuous steering physics.",
    rl: "RL balances slip angles, speed, and clean overtaking.",
  },
  pong: {
    search: "Trajectory math breaks under frame rate drops or jitter.",
    rl: "RL policy maps ball vectors to paddle velocity directly.",
  },
  pacman: {
    search: "Deterministic paths trap the agent when ghosts corner it.",
    rl: "RL weighs ghost distance risks against pellet rewards.",
  },
  chess: {
    search: "Minimax trees explode exponentially without deep evaluations.",
    rl: "RL bootstraps board values directly from match results.",
  },
  strategy: {
    search: "Greedy search targets closest nodes, ignoring tactical trades.",
    rl: "RL learns node control value, range spacing, and retreat timing.",
  },
};

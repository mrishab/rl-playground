export const SEARCH_COMPARISONS: Record<
  string,
  { search: string; rl: string }
> = {
  "ice-maze": {
    search:
      "A* assumes deterministic transitions. With ice slip (30%), its edge path slips into pits and crashes.",
    rl: "RL factors expected returns over stochastic slips, learning to keep a 1-2 tile safety buffer around pits.",
  },
  "slot-machine": {
    search:
      "Search/CSPs require a static transition graph. Without graph paths, static heuristics get stuck on suboptimal arms.",
    rl: "RL balances exploration (gathering payout evidence) and exploitation to discover the true highest-EV machine.",
  },
  lemonade: {
    search:
      "Static planning assumes fixed average demand (30 cups), causing massive spoilage on rain days and stockouts on heatwaves.",
    rl: "RL learns state-dependent prep policies (Rainy: 10, Heatwave: 60), maximizing profit across weather shifts.",
  },
  "continuous-car": {
    search:
      "Discrete search trees cannot handle continuous floating-point state-actions, causing jerky oscillations into walls and losing cornering grip.",
    rl: "RL balances speed, throttle, and steering, managing tire grip around turns while overtaking and racing villain cars.",
  },
  pong: {
    search:
      "Exact trajectory search requires forward physics simulation at high FPS. Any frame drop or latency breaks paddle tracking.",
    rl: "RL learns an instant reactive policy mapping ball position and velocity directly to paddle velocity in constant time.",
  },
  pacman: {
    search:
      "Deterministic BFS finds the shortest path to pellets but gets trapped in dead ends by dynamic hunting ghosts.",
    rl: "RL balances long-term ghost avoidance penalties with pellet reward accumulation under stochastic ghost moves.",
  },
  chess: {
    search:
      "Alpha-Beta / Minimax search trees suffer exponential branching factor explosion without deep position evaluation.",
    rl: "RL policy bootstraps positional advantage directly from game outcomes, developing tactical piece synergy.",
  },
  strategy: {
    search:
      "Simultaneous-move combat trees grow exponentially with unit combinations and partial fog of war.",
    rl: "Multi-agent RL discovers emergent flanking, focus fire, and tactical retreat heuristics.",
  },
};

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
      "Discrete search trees cannot handle continuous floating-point state-actions, causing jerky oscillations into walls.",
    rl: "Deep RL / Function approximation maps continuous wall-distance sensors to smooth steering angles.",
  },
};

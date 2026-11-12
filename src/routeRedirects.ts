export const REDIRECTS = [
  { path: "rl", to: "/gridworld" },
  { path: "reinforcement-learning", to: "/gridworld" },
  { path: "models", to: "/agents" },
  { path: "manage-models", to: "/agents" },
  { path: "data", to: "/gridworld" },
  { path: "data/*", to: "/gridworld" },
  { path: "pretrain", to: "/gridworld" },
  { path: "pretrain/*", to: "/gridworld" },
  { path: "train", to: "/gridworld" },
  { path: "train/*", to: "/gridworld" },
] as const;

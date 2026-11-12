export const BREADCRUMB_MAP = {
  gridworld: "GridWorld Lab",
  rl: "GridWorld Lab",
  games: "Competitive Games",
  pong: "Pong",
  pacman: "Pac-Man",
  chess: "Grid Chess",
  bandits: "Multi-Armed Bandits",
  dp: "Dynamic Programming",
  agents: "Saved Policies & Agents",
  models: "Saved Policies & Agents",
  theory: "Theory & Undergrad Guide",
} as const satisfies Record<string, string>;

export type BreadcrumbSegment = keyof typeof BREADCRUMB_MAP;

export function getBreadcrumbLabel(segment: string): string {
  if (segment in BREADCRUMB_MAP) {
    return BREADCRUMB_MAP[segment as BreadcrumbSegment];
  }
  return segment;
}

import {
  Grid3X3,
  Target,
  GitCommit,
  Gamepad2,
  Cpu,
  BookOpen,
} from "lucide-react";

export const NAV_LINKS = [
  {
    to: "/gridworld",
    label: "GridWorld",
    icon: Grid3X3,
    match: (p: string) =>
      p === "/" || p.startsWith("/gridworld") || p.startsWith("/rl"),
  },
  {
    to: "/games",
    label: "Games",
    icon: Gamepad2,
    match: (p: string) =>
      p.startsWith("/games") ||
      p.startsWith("/pong") ||
      p.startsWith("/pacman") ||
      p.startsWith("/chess"),
  },
  {
    to: "/bandits",
    label: "Bandits",
    icon: Target,
    match: (p: string) => p.startsWith("/bandits"),
  },
  {
    to: "/dp",
    label: "Dynamic Prog",
    icon: GitCommit,
    match: (p: string) => p.startsWith("/dp"),
  },
  {
    to: "/agents",
    label: "Agents",
    icon: Cpu,
    match: (p: string) => p.startsWith("/agents") || p.startsWith("/models"),
  },
  {
    to: "/theory",
    label: "Theory & Quiz",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/theory"),
  },
];

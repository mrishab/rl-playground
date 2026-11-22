import { Compass, BrainCircuit, PlayCircle } from "lucide-react";

export const ONBOARDING_STEPS = [
  {
    icon: Compass,
    iconClass: "text-primary",
    title: "1. Pick a Domain",
    description:
      "Explore 8 arcade & decision environments across grid, continuous, and adversarial tasks.",
  },
  {
    icon: BrainCircuit,
    iconClass: "text-warning",
    title: "2. Contrast Control",
    description:
      "Toggle between Classical Search/Heuristic and Tabular RL (Q-Learning & SARSA).",
  },
  {
    icon: PlayCircle,
    iconClass: "text-success",
    title: "3. Step & Train",
    description:
      "Use Step 1 to inspect Bellman updates or Train 20 to observe emergent winning strategies.",
  },
];

import {
  Bot,
  Trophy,
  Flame,
  Square,
  Ghost,
  Eraser,
  Droplets,
  Snowflake,
  Search,
} from "lucide-react";

export type EditTool =
  | "agent"
  | "goal"
  | "hazard"
  | "obstacle"
  | "smart-obstacle"
  | "mud"
  | "ice"
  | "inspect"
  | "clear";

export const RL_TOOLS: { tool: EditTool; label: string; icon: typeof Bot }[] = [
  { tool: "agent", label: "Agent", icon: Bot },
  { tool: "goal", label: "Goal", icon: Trophy },
  { tool: "hazard", label: "Pit", icon: Flame },
  { tool: "obstacle", label: "Wall", icon: Square },
  { tool: "mud", label: "Mud", icon: Droplets },
  { tool: "ice", label: "Ice", icon: Snowflake },
  { tool: "smart-obstacle", label: "Villain", icon: Ghost },
  { tool: "inspect", label: "Inspect", icon: Search },
  { tool: "clear", label: "Clear", icon: Eraser },
];

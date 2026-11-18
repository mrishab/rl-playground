import { Bot, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ControllerMode } from "@/lib/games/types";

interface Props {
  mode: ControllerMode;
  onChange: (mode: ControllerMode) => void;
}

export function GameControllerToggle({ mode, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-0.5 bg-muted/60 rounded-md border border-border/50">
      <Button
        size="sm"
        variant={mode === "rl" ? "default" : "ghost"}
        className={`h-7 px-2 text-[11px] gap-1 font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out ${
          mode === "rl" ? "shadow-xs font-semibold" : "text-muted-foreground"
        }`}
        onClick={() => onChange("rl")}
        title="Control agent via learned RL policy"
      >
        <Bot className="h-3 w-3" /> Run RL
      </Button>
      <Button
        size="sm"
        variant={mode === "search" ? "destructive" : "ghost"}
        className={`h-7 px-2 text-[11px] gap-1 font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out ${
          mode === "search"
            ? "shadow-xs font-semibold"
            : "text-muted-foreground"
        }`}
        onClick={() => onChange("search")}
        title="Try deterministic search heuristics"
      >
        <Compass className="h-3 w-3" /> Run Search
      </Button>
    </div>
  );
}

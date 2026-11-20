import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { GameAlgoToggle } from "./GameAlgoToggle";
import type { ControllerMode, GameHyperparameters } from "@/lib/games/types";

type Props = {
  params: GameHyperparameters;
  onChange: (patch: Partial<GameHyperparameters>) => void;
  controllerMode?: ControllerMode;
};

export function GameHyperparamsCard({
  params,
  onChange,
  controllerMode = "rl",
}: Props) {
  const isSearch = controllerMode === "search";

  return (
    <Card className="p-3">
      {isSearch ? (
        <CardContent className="p-0 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="italic">
            Search mode active — RL policy updates, hyperparameters (α, ε, γ),
            and Q-table training are disabled.
          </span>
        </CardContent>
      ) : (
        <CardContent className="p-0 flex flex-wrap items-center justify-between gap-3 text-xs">
          <GameAlgoToggle
            algorithm={params.algorithm}
            onSelect={(algo) => onChange({ algorithm: algo })}
          />

          <div className="flex items-center gap-2 min-w-[130px]">
            <span className="text-muted-foreground font-mono">
              α {params.learningRate.toFixed(2)}
            </span>
            <Slider
              min={0.05}
              max={0.8}
              step={0.05}
              value={[params.learningRate]}
              onValueChange={([val]) => onChange({ learningRate: val })}
              className="w-16"
            />
          </div>

          <div className="flex items-center gap-2 min-w-[130px]">
            <span className="text-muted-foreground font-mono">
              γ {params.discountFactor.toFixed(2)}
            </span>
            <Slider
              min={0.0}
              max={0.99}
              step={0.05}
              value={[params.discountFactor]}
              onValueChange={([val]) => onChange({ discountFactor: val })}
              className="w-16"
            />
          </div>

          <div className="flex items-center gap-2 min-w-[130px]">
            <span className="text-muted-foreground font-mono">
              ε {params.explorationRate.toFixed(2)}
            </span>
            <Slider
              min={0.01}
              max={0.5}
              step={0.02}
              value={[params.explorationRate]}
              onValueChange={([val]) => onChange({ explorationRate: val })}
              className="w-16"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

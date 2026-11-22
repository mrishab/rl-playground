import { Card, CardContent } from "@/components/ui/card";
import { GameAlgoToggle } from "./GameAlgoToggle";
import { GameHyperparamsSliders } from "./GameHyperparamsSliders";
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
          <GameHyperparamsSliders params={params} onChange={onChange} />
        </CardContent>
      )}
    </Card>
  );
}

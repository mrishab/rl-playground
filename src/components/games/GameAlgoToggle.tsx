import { Button } from "@/components/ui/button";
import type { RLAlgorithm } from "@/lib/games/types";

type Props = {
  algorithm: RLAlgorithm;
  onSelect: (algo: RLAlgorithm) => void;
};

export function GameAlgoToggle({ algorithm, onSelect }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-medium text-muted-foreground">Algo:</span>
      {(["q-learning", "sarsa"] as const).map((algo) => (
        <Button
          key={algo}
          size="sm"
          variant={algorithm === algo ? "secondary" : "ghost"}
          className="h-6 px-2 text-[11px] font-mono capitalize"
          onClick={() => onSelect(algo)}
        >
          {algo}
        </Button>
      ))}
    </div>
  );
}

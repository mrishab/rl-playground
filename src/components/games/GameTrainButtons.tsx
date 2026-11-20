import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onTrain: (count: number) => void;
  disabled?: boolean;
}

export function GameTrainButtons({ onTrain, disabled }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant="secondary"
        className="h-8 text-xs font-mono gap-1"
        disabled={disabled}
        onClick={() => onTrain(50)}
        title={disabled ? "RL training disabled in Search mode" : undefined}
      >
        <Zap className="h-3.5 w-3.5 text-warning" /> Train 50
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="h-8 text-xs font-mono gap-1"
        disabled={disabled}
        onClick={() => onTrain(200)}
        title={disabled ? "RL training disabled in Search mode" : undefined}
      >
        <Zap className="h-3.5 w-3.5 text-warning" /> Train 200
      </Button>
    </div>
  );
}

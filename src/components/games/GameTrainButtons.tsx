import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onTrain: (count: number) => void;
};

export function GameTrainButtons({ onTrain }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant="secondary"
        className="h-8 text-xs font-mono gap-1"
        onClick={() => onTrain(50)}
      >
        <Zap className="h-3.5 w-3.5 text-amber-500" /> +50
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="h-8 text-xs font-mono gap-1"
        onClick={() => onTrain(200)}
      >
        <Zap className="h-3.5 w-3.5 text-amber-500" /> +200
      </Button>
    </div>
  );
}

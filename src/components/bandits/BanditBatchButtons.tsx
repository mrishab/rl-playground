import { FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onStep: () => void;
  onStepBatch: (n: number) => void;
}

export function BanditBatchButtons({ onStep, onStepBatch }: Props) {
  return (
    <>
      <Button size="sm" className="h-8 text-xs gap-1" onClick={onStep}>
        Step 1
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        onClick={() => onStepBatch(50)}
      >
        <FastForward className="h-3 w-3" /> Step 50
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        onClick={() => onStepBatch(200)}
      >
        <FastForward className="h-3 w-3" /> Step 200
      </Button>
    </>
  );
}

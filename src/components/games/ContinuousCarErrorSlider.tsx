import { AlertTriangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Props {
  errorRate: number;
  onChange: (rate: number) => void;
}

export function ContinuousCarErrorSlider({ errorRate, onChange }: Props) {
  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
          <AlertTriangle className="h-3 w-3 text-warning" />
          <span>Villain Error Rate:</span>
        </span>
        <span className="font-semibold text-warning text-[11px]">
          {Math.round(errorRate * 100)}%
        </span>
      </div>
      <Slider
        min={0}
        max={50}
        step={5}
        value={[Math.round(errorRate * 100)]}
        onValueChange={([val]) => onChange((val ?? 0) / 100)}
        aria-label="Villain Error Rate"
        className="w-full"
      />
    </div>
  );
}

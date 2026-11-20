import { Trophy } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Props {
  targetLaps: number;
  onChange: (laps: number) => void;
}

export function ContinuousCarLapSlider({ targetLaps, onChange }: Props) {
  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
          <Trophy className="h-3 w-3 text-primary" />
          <span>Laps to Win:</span>
        </span>
        <span className="font-semibold text-primary text-[11px]">
          {targetLaps} {targetLaps === 1 ? "Lap" : "Laps"}
        </span>
      </div>
      <Slider
        min={1}
        max={10}
        step={1}
        value={[targetLaps]}
        onValueChange={([val]) => onChange(val ?? 3)}
        aria-label="Laps to Win"
        className="w-full"
      />
    </div>
  );
}

import { Button } from "@/components/ui/button";

type Props = {
  speed: 1 | 2 | 5;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
};

export function GameSpeedSelector({ speed, onSetSpeed }: Props) {
  const speeds: (1 | 2 | 5)[] = [1, 2, 5];
  return (
    <div className="flex items-center gap-1 bg-muted/30 p-0.5 rounded-md border border-border/40">
      {speeds.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={speed === s ? "default" : "ghost"}
          className="h-7 px-2 text-[11px] font-mono"
          onClick={() => onSetSpeed(s)}
        >
          {s}x
        </Button>
      ))}
    </div>
  );
}

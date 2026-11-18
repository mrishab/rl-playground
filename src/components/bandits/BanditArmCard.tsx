import type { BanditArm } from "@/lib/rl/types";

interface Props {
  arm: BanditArm;
  isOptimal: boolean;
}

export function BanditArmCard({ arm, isOptimal }: Props) {
  const meanPct = Math.max(5, Math.min(95, ((arm.trueMean + 3) / 6) * 100));
  const scaleY = Math.max(0.04, Math.min(1, (arm.estimatedValue + 3) / 6));

  return (
    <div
      className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center space-y-1.5 transition-[color,background-color,border-color] duration-150 ease-out ${
        isOptimal
          ? "bg-primary/5 border-primary/40"
          : "bg-muted/30 border-border/70"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-bold font-mono">#{arm.id + 1}</span>
        {isOptimal && (
          <span className="text-[9px] bg-primary text-primary-foreground px-1 rounded font-semibold">
            ★
          </span>
        )}
      </div>
      <div className="h-16 w-8 bg-muted/60 rounded border flex items-end justify-center p-0.5 relative overflow-hidden">
        <div
          className="absolute w-full border-t border-dashed border-destructive z-10"
          style={{ bottom: `${meanPct}%` }}
          title={`True Mean: ${arm.trueMean.toFixed(2)}`}
        />
        <div
          className="w-full h-full bg-primary rounded-xs origin-bottom transition-transform duration-150 ease-out"
          style={{ transform: `scaleY(${scaleY})` }}
        />
      </div>
      <div className="space-y-0.5 text-[10px] font-mono">
        <div>
          Q:{" "}
          <span className="font-semibold">{arm.estimatedValue.toFixed(2)}</span>
        </div>
        <div className="text-muted-foreground">
          μ: {arm.trueMean.toFixed(2)}
        </div>
        <div className="text-muted-foreground/80">N: {arm.pulls}</div>
      </div>
    </div>
  );
}

import type { BanditArm } from "@/lib/rl/types";
import { formatNum } from "@/lib/rl/rlEngine";

interface Props {
  arm: BanditArm;
  domainMax?: number;
}

export function BanditArmBar({ arm, domainMax = 3 }: Props) {
  const maxRange = Math.max(
    domainMax,
    Math.abs(arm.estimatedValue),
    Math.abs(arm.trueMean),
  );
  const meanPct = Math.max(
    4,
    Math.min(96, 50 + (arm.trueMean / maxRange) * 50),
  );
  const isPos = arm.estimatedValue >= 0;
  const barHeight = Math.min(
    50,
    (Math.abs(arm.estimatedValue) / maxRange) * 50,
  );

  return (
    <div className="h-16 w-8 bg-muted/60 rounded border relative overflow-hidden select-none">
      <div
        className="absolute w-full top-1/2 border-t border-border/80 z-10"
        title="0.00 Baseline"
      />
      <div
        className="absolute w-full border-t border-dashed border-warning z-20"
        style={{ bottom: `${meanPct}%` }}
        title={`True Mean μ: ${formatNum(arm.trueMean, 2)}`}
      />
      <div
        className={`absolute w-full rounded-xs transition-opacity duration-150 ease-out ${
          isPos ? "bottom-1/2 bg-primary" : "top-1/2 bg-destructive/80"
        }`}
        style={{ height: `${barHeight}%` }}
      />
    </div>
  );
}

import type { BanditArm } from "@/lib/rl/types";
import { formatNum } from "@/lib/rl/rlEngine";

interface Props {
  arm: BanditArm;
  algorithm?: string;
}

export function BanditArmStats({ arm, algorithm }: Props) {
  return (
    <div className="space-y-0.5 text-[10px] font-mono w-full">
      <div>
        Q:{" "}
        <span className="font-semibold">
          {formatNum(arm.estimatedValue, 2)}
        </span>
      </div>
      {algorithm === "ucb1" && (
        <div className="text-info text-[9px]">
          Bonus:{" "}
          {arm.ucbBonus === Infinity
            ? "∞"
            : `+${formatNum(arm.ucbBonus ?? 0, 2)}`}
        </div>
      )}
      {algorithm === "thompson-sampling" && (
        <div className="text-warning text-[9px]">
          σ: ±{formatNum(arm.posteriorStd ?? 0, 2)}
        </div>
      )}
      <div className="text-muted-foreground">
        μ: {formatNum(arm.trueMean, 2)}
      </div>
      <div className="text-muted-foreground/80">N: {arm.pulls}</div>
    </div>
  );
}

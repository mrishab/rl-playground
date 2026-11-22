import type { BanditArm } from "@/lib/rl/types";
import { formatNum } from "@/lib/rl/rlEngine";
import { BanditArmBar } from "./BanditArmBar";
import { BanditArmStats } from "./BanditArmStats";

interface Props {
  arm: BanditArm;
  isOptimal: boolean;
  algorithm?: string;
  domainMax?: number;
  onPull?: (id: number) => void;
}

export function BanditArmCard({
  arm,
  isOptimal,
  algorithm,
  domainMax,
  onPull,
}: Props) {
  const optCls = isOptimal
    ? "bg-primary/5 border-primary/40 shadow-xs"
    : "bg-muted/30 border-border/70";
  return (
    <button
      type="button"
      onClick={() => onPull?.(arm.id)}
      title={`Arm #${arm.id + 1}: Q=${formatNum(arm.estimatedValue, 2)}, μ=${formatNum(arm.trueMean, 2)}`}
      className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center space-y-1.5 transition-[color,background-color,border-color,transform] duration-150 ease-out cursor-pointer hover:border-primary/60 hover:scale-[1.02] active:scale-[0.98] ${optCls}`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-bold font-mono">#{arm.id + 1}</span>
        {isOptimal && (
          <span className="text-[9px] bg-primary text-primary-foreground px-1 rounded font-semibold">
            ★
          </span>
        )}
      </div>
      <BanditArmBar arm={arm} domainMax={domainMax} />
      <BanditArmStats arm={arm} algorithm={algorithm} />
    </button>
  );
}

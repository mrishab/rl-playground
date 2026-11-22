import { ACTION_ARROWS, type Action } from "@/lib/rl/types";
import { getDPCellStyles, getDPValueBg } from "./dpCellUtils";

interface Props {
  r: number;
  c: number;
  v: number;
  policyAction: Action;
  isSelected: boolean;
  onClick: () => void;
}

export function DPCellButton({
  r,
  c,
  v,
  policyAction,
  isSelected,
  onClick,
}: Props) {
  const { isGoal, isObstacle, isHazard, role, select } = getDPCellStyles(
    r,
    c,
    isSelected,
  );
  const bg = getDPValueBg(v, isObstacle || isGoal || isHazard);
  const label = isGoal
    ? "GOAL"
    : isObstacle
      ? "WALL"
      : isHazard
        ? "PIT"
        : Math.abs(v) < 0.005
          ? "0.00"
          : v.toFixed(2);

  return (
    <button
      type="button"
      data-testid={`dp-cell-${r}-${c}`}
      onClick={onClick}
      className={`relative aspect-square rounded-md border flex flex-col items-center justify-center p-1 text-xs transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer ${select} ${role}`}
      style={{ backgroundColor: bg }}
    >
      <span className="text-[9px] font-mono font-semibold text-foreground/80">
        {label}
      </span>
      {!isGoal && !isObstacle && !isHazard && (
        <span className="text-xs font-bold text-primary mt-0.5">
          {ACTION_ARROWS[policyAction]}
        </span>
      )}
    </button>
  );
}

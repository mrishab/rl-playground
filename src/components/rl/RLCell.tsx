import { cn } from "@/lib/utils";
import { getBgStyle, type RLCellProps } from "./rlCellUtils";
import { RLCellContent } from "./RLCellContent";

type Props = RLCellProps & {
  onClick: () => void;
};

export function RLCell(props: Props) {
  const {
    r,
    c,
    isObstacle,
    isHazard,
    isGoal,
    isMud,
    isIce,
    smartObstacle,
    isBFSPath,
    isInspected,
    maxQ,
    showHeatmap,
    onClick,
  } = props;
  const isBlocked = isObstacle || isHazard || isGoal || !!smartObstacle;

  return (
    <button
      type="button"
      data-testid={`grid-cell-${r}-${c}`}
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-md border flex items-center justify-center transition-all cursor-pointer select-none",
        isObstacle &&
          "bg-muted text-muted-foreground border-border cursor-not-allowed",
        isHazard && "bg-destructive/20 border-destructive/50 text-destructive",
        isGoal && "bg-primary/20 border-primary/50 text-primary",
        isMud && "bg-amber-500/15 border-amber-500/30 text-amber-600",
        isIce && "bg-cyan-500/15 border-cyan-500/30 text-cyan-600",
        smartObstacle &&
          "bg-destructive/15 border-destructive/40 text-destructive",
        isBFSPath && "ring-1 ring-ring",
        isInspected && "ring-2 ring-primary ring-offset-1",
        !isBlocked && "border-border/60 hover:bg-muted/40",
      )}
      style={getBgStyle(isBlocked, maxQ, showHeatmap, isInspected)}
    >
      <RLCellContent {...props} />
    </button>
  );
}

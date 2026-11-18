import { cn } from "@/lib/utils";
import { getBgStyle, type RLCellProps } from "./rlCellUtils";
import { RLCellContent } from "./RLCellContent";

const BASE_CELL_CLS = cn(
  "relative aspect-square rounded-md border flex items-center justify-center cursor-pointer select-none",
  "transition-[color,background-color,border-color,box-shadow] duration-150 ease-out",
);

interface Props extends RLCellProps {
  onClick: () => void;
}

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
        BASE_CELL_CLS,
        isObstacle &&
          "bg-muted text-muted-foreground border-border cursor-not-allowed",
        isHazard && "bg-destructive/20 border-destructive/50 text-destructive",
        isGoal && "bg-primary/20 border-primary/50 text-primary",
        isMud && "bg-warning/15 border-warning/30 text-warning",
        isIce && "bg-info/15 border-info/30 text-info",
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

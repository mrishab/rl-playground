export function getDPCellStyles(r: number, c: number, isSelected: boolean) {
  const isGoal = r === 4 && c === 4;
  const isObstacle = (r === 2 && c === 1) || (r === 2 && c === 3);
  const isHazard =
    (r === 1 && c === 2) || (r === 2 && c === 2) || (r === 3 && c === 2);
  const role = isGoal
    ? "bg-primary/20 border-primary text-primary font-bold"
    : isObstacle
      ? "bg-muted text-muted-foreground cursor-not-allowed"
      : isHazard
        ? "bg-destructive/20 border-destructive text-destructive"
        : "border-border/60";
  const select = isSelected
    ? "ring-2 ring-primary ring-offset-1"
    : "hover:bg-muted/40";
  return { isGoal, isObstacle, isHazard, role, select };
}

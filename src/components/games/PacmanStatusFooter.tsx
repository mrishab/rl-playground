interface Props {
  score: number;
  status: string;
  isFrightened: boolean;
  ghostsEaten: number;
}

export function PacmanStatusFooter({
  score,
  status,
  isFrightened,
  ghostsEaten,
}: Props) {
  const statusColor = isFrightened
    ? "text-primary font-semibold animate-pulse"
    : "text-muted-foreground";

  return (
    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/90 pt-1 border-t border-border/40 px-1">
      <span className="text-warning">Score: {score}</span>
      <span
        className={`text-[9px] text-center truncate max-w-[140px] ${statusColor}`}
      >
        {status}
      </span>
      <span className="text-info">Eaten: {ghostsEaten}</span>
    </div>
  );
}

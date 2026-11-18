interface Props {
  showVisits?: boolean;
  visits?: number;
  showQRose?: boolean;
  qValues?: [number, number, number, number];
  isBFSPath?: boolean;
  isGoal?: boolean;
}

export function RLCellOverlay({
  showVisits,
  visits,
  showQRose,
  qValues,
  isBFSPath,
  isGoal,
}: Props) {
  return (
    <>
      {showVisits && visits !== undefined && visits > 0 && (
        <span className="absolute bottom-0.5 left-0.5 text-[8px] font-mono text-muted-foreground/90 bg-muted/70 px-0.5 rounded">
          v:{visits}
        </span>
      )}
      {showQRose && qValues && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-[7px] font-mono pointer-events-none p-0.5 text-muted-foreground/80">
          <span className="col-start-2 row-start-1 text-center leading-none">
            {qValues[0].toFixed(0)}
          </span>
          <span className="col-start-1 row-start-2 text-left leading-none">
            {qValues[3].toFixed(0)}
          </span>
          <span className="col-start-3 row-start-2 text-right leading-none">
            {qValues[1].toFixed(0)}
          </span>
          <span className="col-start-2 row-start-3 text-center leading-none">
            {qValues[2].toFixed(0)}
          </span>
        </div>
      )}
      {isBFSPath && !isGoal && (
        <span
          className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"
          title="BFS Path Step"
        />
      )}
    </>
  );
}

interface Props {
  showVisits?: boolean;
  visits?: number;
  showQRose?: boolean;
  qValues?: [number, number, number, number];
  isBFSPath?: boolean;
  isGoal?: boolean;
}

const fmt = (v: number) => (Math.abs(v) < 0.5 ? "0" : v.toFixed(0));

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
        <span className="absolute bottom-0.5 left-0.5 text-[8px] font-mono text-muted-foreground bg-muted/80 px-0.5 rounded">
          v:{visits}
        </span>
      )}
      {showQRose && qValues && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-[7px] font-mono pointer-events-none p-0.5 text-foreground font-semibold">
          <span className="col-start-2 row-start-1 text-center leading-none">
            {fmt(qValues[0])}
          </span>
          <span className="col-start-1 row-start-2 text-left leading-none">
            {fmt(qValues[3])}
          </span>
          <span className="col-start-3 row-start-2 text-right leading-none">
            {fmt(qValues[1])}
          </span>
          <span className="col-start-2 row-start-3 text-center leading-none">
            {fmt(qValues[2])}
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

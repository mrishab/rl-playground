interface Props {
  sweepCount: number;
  maxDelta: number;
  isConverged: boolean;
  theta: number;
}

export function DPControlsStatus({
  sweepCount,
  maxDelta,
  isConverged,
  theta,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-muted/40 p-2 rounded border">
          <div className="text-[10px] text-muted-foreground uppercase font-semibold">
            Sweeps
          </div>
          <div className="text-base font-bold font-mono">{sweepCount}</div>
        </div>
        <div className="bg-muted/40 p-2 rounded border">
          <div className="text-[10px] text-muted-foreground uppercase font-semibold">
            Max Δ
          </div>
          <div className="text-base font-bold font-mono">
            {maxDelta.toFixed(4)}
          </div>
        </div>
      </div>
      <div className="p-2 rounded bg-muted/30 border text-xs">
        Status:{" "}
        {isConverged ? (
          <span className="font-semibold text-success">
            Converged (Δ &lt; {theta})
          </span>
        ) : sweepCount > 0 ? (
          <span className="font-semibold text-warning">Iterating...</span>
        ) : (
          <span className="text-muted-foreground">Ready</span>
        )}
      </div>
    </>
  );
}

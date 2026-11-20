interface Props {
  algorithm?: "value-iteration" | "policy-iteration";
  sweepCount: number;
  maxDelta: number;
  isConverged: boolean;
  theta: number;
}

export function DPControlsStatus({
  algorithm = "value-iteration",
  sweepCount,
  maxDelta,
  isConverged,
  theta,
}: Props) {
  const isPI = algorithm === "policy-iteration";

  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-muted/40 p-2 rounded border">
          <div className="text-[10px] text-muted-foreground uppercase font-semibold">
            {isPI ? "Iterations" : "Sweeps"}
          </div>
          <div className="text-base font-bold font-mono">{sweepCount}</div>
        </div>
        <div className="bg-muted/40 p-2 rounded border">
          <div className="text-[10px] text-muted-foreground uppercase font-semibold">
            {isPI ? "Policy Changes" : "Max Δ"}
          </div>
          <div className="text-base font-bold font-mono">
            {isPI
              ? maxDelta
              : isConverged && maxDelta > 0 && maxDelta < 0.001
                ? maxDelta.toFixed(5)
                : maxDelta.toFixed(4)}
          </div>
        </div>
      </div>
      <div className="p-2 rounded bg-muted/30 border text-xs">
        Status:{" "}
        {isConverged ? (
          <span className="font-semibold text-success">
            {isPI ? "Policy Stable (Converged)" : `Converged (Δ < ${theta})`}
          </span>
        ) : sweepCount > 0 ? (
          <span className="font-semibold text-warning">
            {isPI ? "Improving Policy..." : "Iterating..."}
          </span>
        ) : (
          <span className="text-muted-foreground">Ready</span>
        )}
      </div>
    </>
  );
}

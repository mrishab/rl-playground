export function DPHeatmapLegend() {
  return (
    <div className="flex items-center justify-center gap-3 pt-3 text-[10px] font-mono text-muted-foreground border-t border-border/40 w-full">
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded bg-destructive/30 border border-destructive/50" />
        <span>Negative (Penalty)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded bg-muted border border-border" />
        <span>0.00</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded bg-success/30 border border-success/50" />
        <span>Positive (Reward)</span>
      </div>
    </div>
  );
}

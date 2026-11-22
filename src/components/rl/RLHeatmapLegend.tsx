export function RLHeatmapLegend() {
  return (
    <div className="flex items-center justify-center gap-3 pt-1 text-[10px] font-mono text-muted-foreground border-t border-border/40 w-full">
      <span className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded bg-destructive/30 border border-destructive/50" />
        Negative Q(s,a)
      </span>
      <span className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded bg-muted border border-border" />
        0.00
      </span>
      <span className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded bg-success/30 border border-success/50" />
        Positive Q(s,a)
      </span>
    </div>
  );
}

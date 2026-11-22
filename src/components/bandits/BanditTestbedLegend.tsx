export function BanditTestbedLegend() {
  return (
    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-xs bg-primary" /> Q(a) ≥ 0
      </span>
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-xs bg-destructive/80" /> Q(a) &lt; 0
      </span>
      <span className="flex items-center gap-1">
        <span className="w-2 border-t border-dashed border-warning" /> μ(a)
      </span>
      <span>★ Optimal</span>
    </div>
  );
}

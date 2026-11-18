interface Props {
  left: number;
  forward: number;
  right: number;
}

export function ContinuousCarSensorReadouts({ left, forward, right }: Props) {
  return (
    <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
      <div className="bg-card p-1 rounded border border-border/40">
        <span className="text-muted-foreground">dL: </span>
        <span className="text-primary font-semibold">{left}px</span>
      </div>
      <div className="bg-card p-1 rounded border border-border/40">
        <span className="text-muted-foreground">dF: </span>
        <span className="text-warning font-semibold">{forward}px</span>
      </div>
      <div className="bg-card p-1 rounded border border-border/40">
        <span className="text-muted-foreground">dR: </span>
        <span className="text-primary font-semibold">{right}px</span>
      </div>
    </div>
  );
}

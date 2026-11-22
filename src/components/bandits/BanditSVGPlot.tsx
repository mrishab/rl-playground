interface Props {
  points: string[];
  min: number;
  max: number;
  mid: number;
  totalCount: number;
}

export function BanditSVGPlot({ points, min, max, mid, totalCount }: Props) {
  return (
    <div className="h-32 w-full bg-muted/20 rounded border border-border/40 p-2 relative flex flex-col justify-between">
      <div className="flex h-24 w-full gap-2 items-center">
        <div className="flex flex-col justify-between h-full text-[9px] font-mono text-muted-foreground/80 shrink-0 text-right w-10 select-none">
          <span>{max.toFixed(2)}</span>
          <span>{mid.toFixed(2)}</span>
          <span>{min.toFixed(2)}</span>
        </div>
        <div className="relative flex-1 h-full border-l border-b border-border/60">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {[8, 50, 92].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path
              d={`M ${points.join(" L ")}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="text-primary"
            />
          </svg>
        </div>
      </div>
      <div className="flex justify-between pl-12 pr-1 text-[9px] font-mono text-muted-foreground/80 select-none">
        <span>Step 1</span>
        <span>Step {Math.round(totalCount / 2)}</span>
        <span>Step {totalCount}</span>
      </div>
    </div>
  );
}

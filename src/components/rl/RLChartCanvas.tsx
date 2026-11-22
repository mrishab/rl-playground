interface Props {
  pathD: string;
  strokeClass: string;
}

export function RLChartCanvas({ pathD, strokeClass }: Props) {
  return (
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
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className={strokeClass}
        />
      </svg>
    </div>
  );
}

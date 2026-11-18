interface Props {
  cx: number;
  cy: number;
  rIn: number;
  rOut: number;
}

export function ContinuousCarTrackGeometry({ cx, cy, rIn, rOut }: Props) {
  const midR = (rOut + rIn) / 2;
  const trackWidth = rOut - rIn;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={rOut}
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      <circle
        cx={cx}
        cy={cy}
        r={midR}
        fill="none"
        stroke="hsl(var(--card))"
        strokeWidth={trackWidth}
      />
      <circle
        cx={cx}
        cy={cy}
        r={midR}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <circle
        cx={cx}
        cy={cy}
        r={rIn}
        fill="hsl(var(--background))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      <line
        x1={cx}
        y1={cy - rOut}
        x2={cx}
        y2={cy - rIn}
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeDasharray="2 2"
      />
    </g>
  );
}

type Props = {
  cx: number;
  cy: number;
  rIn: number;
  rOut: number;
};

export function ContinuousCarTrackGeometry({ cx, cy, rIn, rOut }: Props) {
  const midR = (rOut + rIn) / 2;
  const trackWidth = rOut - rIn;

  return (
    <g>
      {/* Outer barrier */}
      <circle
        cx={cx}
        cy={cy}
        r={rOut}
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="2"
      />
      {/* Track asphalt */}
      <circle
        cx={cx}
        cy={cy}
        r={midR}
        fill="none"
        stroke="#0f172a"
        strokeWidth={trackWidth}
      />
      {/* Dashed centerline */}
      <circle
        cx={cx}
        cy={cy}
        r={midR}
        fill="none"
        stroke="#64748b"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {/* Inner barrier / grass */}
      <circle
        cx={cx}
        cy={cy}
        r={rIn}
        fill="#090d16"
        stroke="#475569"
        strokeWidth="2"
      />
      {/* Start / Finish line */}
      <line
        x1={cx}
        y1={cy - rOut}
        x2={cx}
        y2={cy - rIn}
        stroke="#e2e8f0"
        strokeWidth="2"
        strokeDasharray="2 2"
      />
    </g>
  );
}

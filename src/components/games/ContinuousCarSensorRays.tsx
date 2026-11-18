type Props = {
  x: number;
  y: number;
  angle: number;
  sensorLeft: number;
  sensorRight: number;
  sensorForward: number;
};

export function ContinuousCarSensorRays({
  x,
  y,
  angle,
  sensorLeft,
  sensorRight,
  sensorForward,
}: Props) {
  const leftAngle = angle - Math.PI / 4;
  const rightAngle = angle + Math.PI / 4;
  const lx = x + Math.cos(leftAngle) * sensorLeft;
  const ly = y + Math.sin(leftAngle) * sensorLeft;
  const rx = x + Math.cos(rightAngle) * sensorRight;
  const ry = y + Math.sin(rightAngle) * sensorRight;
  const fx = x + Math.cos(angle) * sensorForward;
  const fy = y + Math.sin(angle) * sensorForward;

  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={lx}
        y2={ly}
        stroke="#38bdf8"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
      <line
        x1={x}
        y1={y}
        x2={rx}
        y2={ry}
        stroke="#38bdf8"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
      <line
        x1={x}
        y1={y}
        x2={fx}
        y2={fy}
        stroke="#eab308"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
    </g>
  );
}

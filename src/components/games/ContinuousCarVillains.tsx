import type { VillainCar } from "@/lib/games/types";

type Props = {
  villains: VillainCar[];
};

export function ContinuousCarVillains({ villains }: Props) {
  return (
    <g>
      {villains.map((v, idx) => {
        const vDeg = (v.angle * 180) / Math.PI;
        return (
          <g key={v.id} transform={`translate(${v.x}, ${v.y}) rotate(${vDeg})`}>
            <rect
              x="-6"
              y="-3.5"
              width="12"
              height="7"
              rx="1.5"
              fill={v.color}
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <line
              x1="2"
              y1="0"
              x2="6"
              y2="0"
              stroke="#fef08a"
              strokeWidth="1.2"
            />
            <text
              x="-1"
              y="2"
              fill="#ffffff"
              fontSize="4.5"
              fontWeight="bold"
              textAnchor="middle"
            >
              {idx + 1}
            </text>
            {v.isError && (
              <circle
                cx="0"
                cy="-6"
                r="2.5"
                fill="#eab308"
                stroke="#000"
                strokeWidth="0.5"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

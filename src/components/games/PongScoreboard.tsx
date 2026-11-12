type Props = {
  opponentScore: number;
  agentScore: number;
  rallyLength: number;
  maxRally: number;
};

export function PongScoreboard({
  opponentScore,
  agentScore,
  rallyLength,
  maxRally,
}: Props) {
  return (
    <>
      <text
        x="90"
        y="24"
        fill="#94a3b8"
        fontSize="16"
        fontFamily="monospace"
        textAnchor="middle"
        fontWeight="bold"
      >
        {opponentScore}
      </text>
      <text
        x="150"
        y="24"
        fill="#38bdf8"
        fontSize="16"
        fontFamily="monospace"
        textAnchor="middle"
        fontWeight="bold"
      >
        {agentScore}
      </text>
      <text
        x="120"
        y="38"
        fill="#64748b"
        fontSize="8"
        fontFamily="monospace"
        textAnchor="middle"
      >
        Rally: {rallyLength} (Max: {maxRally})
      </text>
    </>
  );
}

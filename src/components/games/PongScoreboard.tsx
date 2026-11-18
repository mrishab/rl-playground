interface Props {
  opponentScore: number;
  agentScore: number;
  rallyLength: number;
  maxRally: number;
}

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
        fill="hsl(var(--muted-foreground))"
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
        fill="hsl(var(--primary))"
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
        fill="hsl(var(--muted-foreground))"
        fontSize="8"
        fontFamily="monospace"
        textAnchor="middle"
      >
        Rally: {rallyLength} (Max: {maxRally})
      </text>
    </>
  );
}

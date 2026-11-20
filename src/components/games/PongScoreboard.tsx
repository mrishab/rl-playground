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
      <rect
        x="60"
        y="29"
        width="120"
        height="12"
        fill="hsl(var(--card))"
        opacity="0.9"
        rx="2"
      />
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

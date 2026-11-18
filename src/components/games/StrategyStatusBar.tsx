interface Props {
  agentHp: number;
  oppHp: number;
  lastActionDesc: string;
}

export function StrategyStatusBar({ agentHp, oppHp, lastActionDesc }: Props) {
  return (
    <div className="absolute bottom-1.5 left-2.5 right-2.5 flex justify-between items-center text-[10px] font-mono text-muted-foreground/90">
      <span className="text-primary">Agent HP: {agentHp}</span>
      <span className="truncate max-w-[140px] text-center text-[9px] text-muted-foreground">
        {lastActionDesc}
      </span>
      <span className="text-destructive">Opp HP: {oppHp}</span>
    </div>
  );
}

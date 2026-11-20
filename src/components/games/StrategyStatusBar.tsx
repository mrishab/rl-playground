interface Props {
  agentHp: number;
  oppHp: number;
  lastActionDesc: string;
}

export function StrategyStatusBar({ agentHp, oppHp, lastActionDesc }: Props) {
  return (
    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/90 px-1 pt-1 border-t border-border/40">
      <span className="text-primary font-semibold shrink-0">
        Agent HP: {agentHp}
      </span>
      <span className="text-center text-[10px] text-muted-foreground px-2 flex-1">
        {lastActionDesc}
      </span>
      <span className="text-destructive font-semibold shrink-0">
        Opp HP: {oppHp}
      </span>
    </div>
  );
}

import type { SavedRLAgent } from "@/types/savedAgent";

interface Props {
  agent: SavedRLAgent;
}

export function AgentCardStats({ agent }: Props) {
  return (
    <>
      <div className="flex flex-wrap gap-1 text-[10px] font-mono text-muted-foreground">
        <span className="bg-muted px-1.5 py-0.5 rounded">
          α: {agent.hyperparameters.learningRate}
        </span>
        <span className="bg-muted px-1.5 py-0.5 rounded">
          γ: {agent.hyperparameters.discountFactor}
        </span>
        <span className="bg-muted px-1.5 py-0.5 rounded">
          ε: {agent.hyperparameters.explorationRate}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-center text-xs bg-muted/30 p-2 rounded border font-mono">
        <div>
          <div className="text-[9px] text-muted-foreground uppercase">
            Episodes
          </div>
          <div className="font-bold">{agent.metrics.totalEpisodes}</div>
        </div>
        <div>
          <div className="text-[9px] text-muted-foreground uppercase">
            Success Rate
          </div>
          <div className="font-bold text-primary">
            {agent.metrics.successRate.toFixed(1)}%
          </div>
        </div>
      </div>
    </>
  );
}

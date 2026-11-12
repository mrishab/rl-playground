import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";
import { useSavedAgentsStore } from "@/stores/savedAgentsStore";

export function AgentsStat() {
  const agents = useSavedAgentsStore((s) => s.agents);

  return (
    <Link
      to="/agents"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
      title="Saved RL Policies & Agents"
    >
      <Cpu className="h-3.5 w-3.5 text-primary" />
      <span className="hidden sm:inline">Agents:</span>
      <span className="font-semibold text-foreground">{agents.length}</span>
    </Link>
  );
}

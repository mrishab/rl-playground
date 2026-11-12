import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  Trash2,
  Download,
  Upload,
  Play,
  Edit2,
  Search,
  Check,
  X,
  PlusCircle,
} from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSavedAgentsStore } from "@/stores/savedAgentsStore";
import { useRLStore } from "@/stores/rlStore";
import type { SavedRLAgent } from "@/types/savedAgent";

export function SavedAgentsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    agents,
    searchQuery,
    deleteAgent,
    renameAgent,
    clearAll,
    importAgents,
    exportAgents,
    setSearchQuery,
  } = useSavedAgentsStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.algorithm.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleStartRename = (agent: SavedRLAgent) => {
    setEditingId(agent.id);
    setEditingName(agent.name);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      renameAgent(id, editingName.trim());
    }
    setEditingId(null);
  };

  const handleExport = () => {
    const json = exportAgents();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rl-agents-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const count = importAgents(text);
        alert(`Successfully imported ${count} RL agent(s)!`);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleLoadIntoGridWorld = (agent: SavedRLAgent) => {
    // Load agent Q-table into rlStore
    const rlState = useRLStore.getState();
    rlState.setGridSize(agent.gridConfig.gridSize);
    useRLStore.setState({
      qTable: agent.qTable,
      totalEpisodes: agent.metrics.totalEpisodes,
      params: {
        ...rlState.params,
        ...agent.hyperparameters,
        algorithm: agent.algorithm as any,
      },
    });
    navigate("/gridworld");
  };

  return (
    <PageLayout
      icon={Cpu}
      title="Saved Policies & Agents"
      subtitle="Manage, inspect, export, and load trained reinforcement learning policies"
      hideActionGate
    >
      <div className="space-y-4 max-w-6xl mx-auto w-full">
        {/* Top Actions & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-muted/30 p-3 rounded-lg border">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search agents by name or algorithm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" /> Import JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1"
              onClick={handleExport}
              disabled={agents.length === 0}
            >
              <Download className="h-3.5 w-3.5" /> Export All
            </Button>
            {agents.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm("Are you sure you want to delete all saved agents?")) {
                    clearAll();
                  }
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 ? (
          <Card className="border-dashed p-8 text-center space-y-3">
            <Cpu className="h-10 w-10 text-muted-foreground mx-auto" />
            <CardTitle className="text-base">No Saved Agents Found</CardTitle>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Train a policy in the GridWorld lab and click the &quot;Save&quot; button in Policy Controls to store snapshots here, or import a pre-trained JSON policy.
            </p>
            <Button
              size="sm"
              className="h-8 text-xs gap-1"
              onClick={() => navigate("/gridworld")}
            >
              <PlusCircle className="h-3.5 w-3.5" /> Go to GridWorld Lab
            </Button>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => {
              const isEditing = editingId === agent.id;
              return (
                <Card
                  key={agent.id}
                  className="flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="pb-2 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1 w-full">
                          <Input
                            size={1}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-7 text-xs"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => handleSaveRename(agent.id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-semibold text-sm">
                          <span>{agent.name}</span>
                          <button
                            type="button"
                            onClick={() => handleStartRename(agent)}
                            className="text-muted-foreground hover:text-foreground"
                            title="Rename"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                        {agent.algorithm}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Created: {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    {/* Hyperparameters tags */}
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

                    {/* Metrics grid */}
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

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t">
                      <Button
                        size="sm"
                        className="h-7 text-xs flex-1 gap-1"
                        onClick={() => handleLoadIntoGridWorld(agent)}
                      >
                        <Play className="h-3 w-3" /> Load in GridWorld
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteAgent(agent.id)}
                        title="Delete Agent"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

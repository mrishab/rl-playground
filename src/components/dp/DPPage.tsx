import { useState } from "react";
import { GitCommit, Play, FastForward, RotateCcw, HelpCircle } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useDPStore } from "@/stores/dpStore";
import { stateKey } from "@/lib/rl/rlEngine";
import { ACTION_ARROWS, ACTION_NAMES, type Action } from "@/lib/rl/types";

export function DPPage() {
  const store = useDPStore();
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([1, 1]);

  const gridSize = store.rules.gridSize;

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell([r, c]);
    store.inspectCell(r, c);
  };

  const inspected = store.inspectedState;

  return (
    <PageLayout
      icon={GitCommit}
      title="Dynamic Programming (Value Iteration) Lab"
      subtitle="Model-Based Planning: Compute optimal state-value functions V*(s) via exact Bellman optimality backups"
      hideActionGate
    >
      <div className="space-y-4 max-w-6xl mx-auto w-full">
        {/* Info Callout */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-foreground">
              Undergraduate RL Concept: Model-Based Planning & Bellman Optimality Equation
            </span>
            <p>
              Unlike model-free RL (Q-learning, SARSA) which must sample transitions from trial and error, <strong>Dynamic Programming</strong> assumes complete knowledge of the environment model: transition probabilities P(s'|s, a) and rewards R(s, a).
              Value Iteration guarantees convergence to the unique optimal value function V*(s).
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Controls Column */}
          <Card className="space-y-4 p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-base">Value Iteration Controls</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Discount Factor (γ):</span>
                  <span className="font-mono">{store.gamma.toFixed(2)}</span>
                </div>
                <Slider
                  value={[store.gamma]}
                  min={0.1}
                  max={0.99}
                  step={0.01}
                  onValueChange={([val]) => store.setGamma(val)}
                />
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-muted/40 p-2 rounded border">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Sweeps
                  </div>
                  <div className="text-base font-bold font-mono">
                    {store.sweepCount}
                  </div>
                </div>
                <div className="bg-muted/40 p-2 rounded border">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Max Δ
                  </div>
                  <div className="text-base font-bold font-mono">
                    {store.maxDelta.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-muted/30 border text-xs">
                Status:{" "}
                {store.isConverged ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Converged (Δ &lt; {store.theta})
                  </span>
                ) : store.sweepCount > 0 ? (
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    Iterating...
                  </span>
                ) : (
                  <span className="text-muted-foreground">Ready</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs gap-1"
                  onClick={store.stepSweep}
                >
                  <Play className="h-3 w-3" /> Step 1 Sweep
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1"
                  onClick={store.runToConvergence}
                >
                  <FastForward className="h-3 w-3" /> Run to Convergence
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs px-2 text-muted-foreground"
                  onClick={store.reset}
                  title="Reset DP Values"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Grid Canvas Column */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                State Values V*(s) & Derived Greedy Policy π*(s)
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                Click any cell to inspect its Bellman optimality backup equation.
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div
                className="grid gap-1.5 w-full max-w-sm mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                  const r = Math.floor(idx / gridSize);
                  const c = idx % gridSize;
                  const key = stateKey(r, c);
                  const isGoal = r === 4 && c === 4;
                  const isObstacle = (r === 2 && c === 1) || (r === 2 && c === 3);
                  const isHazard = (r === 1 && c === 2) || (r === 2 && c === 2) || (r === 3 && c === 2);
                  const isSelected =
                    selectedCell && selectedCell[0] === r && selectedCell[1] === c;

                  const v = store.values[key] || 0;
                  const policyAction = store.policy[key] ?? 0;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCellClick(r, c)}
                      className={`relative aspect-square rounded-md border flex flex-col items-center justify-center p-1 text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-primary ring-offset-1"
                          : "hover:bg-muted/40"
                      } ${
                        isGoal
                          ? "bg-primary/20 border-primary text-primary font-bold"
                          : isObstacle
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : isHazard
                              ? "bg-destructive/20 border-destructive text-destructive"
                              : "border-border/60"
                      }`}
                      style={{
                        backgroundColor:
                          !isObstacle && !isGoal && !isHazard && v !== 0
                            ? `hsl(var(--primary) / ${Math.min(0.3, Math.abs(v) / 15)})`
                            : undefined,
                      }}
                    >
                      <span className="text-[9px] font-mono font-semibold text-foreground/80">
                        {isGoal
                          ? "GOAL"
                          : isObstacle
                            ? "WALL"
                            : isHazard
                              ? "PIT"
                              : v.toFixed(2)}
                      </span>
                      {!isGoal && !isObstacle && (
                        <span className="text-xs font-bold text-primary mt-0.5">
                          {ACTION_ARROWS[policyAction]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* State Inspector Card */}
        {inspected && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Mathematical Inspector: State ({inspected.state[0]}, {inspected.state[1]})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/30 border rounded p-2 text-xs font-mono">
                {inspected.formula}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {[0, 1, 2, 3].map((a) => {
                  const act = a as Action;
                  const actionData = inspected.actionValues[act];
                  const isBest = act === inspected.bestAction;

                  return (
                    <div
                      key={act}
                      className={`p-2.5 rounded-lg border space-y-1.5 ${
                        isBest
                          ? "bg-primary/5 border-primary font-medium"
                          : "bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          Action: {ACTION_NAMES[act]} {ACTION_ARROWS[act]}
                        </span>
                        <span className="font-mono text-primary font-bold">
                          {actionData.expectedValue.toFixed(3)}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground space-y-0.5">
                        {actionData.transitions.map((t, i) => (
                          <div key={i} className="font-mono">
                            P={t.prob.toFixed(2)} → ({t.nextState[0]},{t.nextState[1]}), R={t.reward}, V={t.nextV.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

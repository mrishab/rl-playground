import { useState, useEffect } from "react";
import {
  Target,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBanditStore } from "@/stores/banditStore";
import type { BanditAlgorithm } from "@/lib/rl/types";

export function BanditsPage() {
  const store = useBanditStore();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!animating) return;
    const interval = setInterval(() => {
      store.step();
    }, 80);
    return () => clearInterval(interval);
  }, [animating, store]);

  const optimalIdx = store.arms.reduce(
    (maxIdx, arm, idx, arr) =>
      arm.trueMean > arr[maxIdx].trueMean ? idx : maxIdx,
    0,
  );

  return (
    <PageLayout
      icon={Target}
      title="Multi-Armed Bandits Lab"
      subtitle="Explore the fundamental Exploration-Exploitation trade-off from Sutton & Barto Chapter 2"
      hideActionGate
    >
      <div className="space-y-4 max-w-6xl mx-auto w-full">
        {/* Info Callout */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-foreground">
              Undergraduate RL Concept: The Exploration vs. Exploitation Dilemma
            </span>
            <p>
              In a k-armed bandit problem, an agent chooses among 10 discrete
              actions with unknown reward distributions. To maximize cumulative
              reward, the agent must balance <strong>exploiting</strong> what is
              already known to yield high payoff with <strong>exploring</strong>{" "}
              untested arms that could be even better.
            </p>
          </div>
        </div>

        {/* Controls and Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Algorithm Config */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Bandit Strategy & Parameters
              </CardTitle>
              <select
                id="bandit-algorithm-select"
                value={store.config.algorithm}
                onChange={(e) =>
                  store.setAlgorithm(e.target.value as BanditAlgorithm)
                }
                className="text-xs rounded-md border border-input bg-background px-2 py-1 shadow-xs font-medium"
              >
                <option value="epsilon-greedy">ε-Greedy</option>
                <option value="ucb1">Upper Confidence Bound (UCB1)</option>
                <option value="optimistic-initial">
                  Optimistic Initial Values
                </option>
                <option value="thompson-sampling">
                  Thompson Sampling (Bayesian)
                </option>
                <option value="pure-greedy">Pure Greedy (ε=0)</option>
              </select>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conditional Sliders based on algorithm */}
              {store.config.algorithm === "epsilon-greedy" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Exploration Rate (ε):</span>
                    <span className="font-mono">
                      {store.config.epsilon.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[store.config.epsilon]}
                    min={0}
                    max={0.5}
                    step={0.01}
                    onValueChange={([val]) => store.setConfig({ epsilon: val })}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Probability of taking a random action instead of the greedy
                    action.
                  </span>
                </div>
              )}

              {store.config.algorithm === "ucb1" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">
                      UCB Exploration Confidence (c):
                    </span>
                    <span className="font-mono">
                      {store.config.c.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[store.config.c]}
                    min={0.5}
                    max={4.0}
                    step={0.1}
                    onValueChange={([val]) => store.setConfig({ c: val })}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Determines weight given to uncertainty: A_t = argmax [Q(a) +
                    c √(ln t / N(a))].
                  </span>
                </div>
              )}

              {store.config.algorithm === "optimistic-initial" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Initial Q-Value (Q₀):</span>
                    <span className="font-mono">
                      {store.config.initialQ.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[store.config.initialQ || 5.0]}
                    min={1.0}
                    max={10.0}
                    step={0.5}
                    onValueChange={([val]) =>
                      store.setConfig({ initialQ: val })
                    }
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Initial bias encourages early systematic exploration without
                    randomness.
                  </span>
                </div>
              )}

              {/* Stationary Toggle */}
              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="stationary-switch"
                    className="text-xs font-medium"
                  >
                    Stationary Bandit
                  </Label>
                  <div className="text-[10px] text-muted-foreground">
                    {store.config.isStationary
                      ? "Arm true reward means remain fixed."
                      : "Arm means slowly drift via random walk."}
                  </div>
                </div>
                <Switch
                  id="stationary-switch"
                  checked={store.config.isStationary}
                  onCheckedChange={(checked) =>
                    store.setConfig({ isStationary: checked })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => store.step()}
                >
                  Step 1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1"
                  onClick={() => store.stepBatch(50)}
                >
                  <FastForward className="h-3 w-3" /> Step 50
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1"
                  onClick={() => store.stepBatch(200)}
                >
                  <FastForward className="h-3 w-3" /> Step 200
                </Button>
                <Button
                  size="sm"
                  variant={animating ? "default" : "secondary"}
                  className="h-8 text-xs gap-1"
                  onClick={() => setAnimating(!animating)}
                >
                  {animating ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  {animating ? "Pause" : "Auto-Run"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs px-2 text-muted-foreground ml-auto"
                  onClick={() => {
                    setAnimating(false);
                    store.reset();
                  }}
                  title="Reset Simulation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Metrics summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-muted/40 p-2.5 rounded-lg border">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Steps
                  </div>
                  <div className="text-lg font-bold font-mono">
                    {store.stepCount}
                  </div>
                </div>
                <div className="bg-muted/40 p-2.5 rounded-lg border">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Optimal Arm %
                  </div>
                  <div className="text-lg font-bold font-mono text-primary">
                    {store.optimalRate.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-muted/40 p-2.5 rounded-lg border">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Avg Reward
                  </div>
                  <div className="text-lg font-bold font-mono">
                    {store.averageReward.toFixed(2)}
                  </div>
                </div>
                <div className="bg-muted/40 p-2.5 rounded-lg border">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Total Reward
                  </div>
                  <div className="text-lg font-bold font-mono">
                    {store.cumulativeReward.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground pt-1 border-t space-y-1">
                <div>
                  Optimal Arm:{" "}
                  <span className="font-semibold text-foreground font-mono">
                    Arm #{optimalIdx + 1}
                  </span>{" "}
                  (μ = {store.arms[optimalIdx]?.trueMean.toFixed(2)})
                </div>
                <div>
                  Update Rule:{" "}
                  <code className="text-[10px] bg-muted px-1 py-0.5 rounded">
                    Q(a) ← Q(a) + 1/N [R - Q(a)]
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 10 Arms Visualizer */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              10-Armed Testbed: Estimated Value Q(a) vs True Mean μ(a)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {store.arms.map((arm) => {
                const isOptimal = arm.id === optimalIdx;
                return (
                  <div
                    key={arm.id}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center space-y-1.5 transition-colors ${
                      isOptimal
                        ? "bg-primary/5 border-primary/40"
                        : "bg-muted/30 border-border/70"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-mono">
                        #{arm.id + 1}
                      </span>
                      {isOptimal && (
                        <span className="text-[9px] bg-primary text-primary-foreground px-1 rounded font-semibold">
                          ★
                        </span>
                      )}
                    </div>

                    {/* Value Bars */}
                    <div className="h-16 w-8 bg-muted/60 rounded border flex items-end justify-center p-0.5 relative overflow-hidden">
                      {/* True Mean indicator */}
                      <div
                        className="absolute w-full border-t border-dashed border-destructive z-10"
                        style={{
                          bottom: `${Math.max(5, Math.min(95, ((arm.trueMean + 3) / 6) * 100))}%`,
                        }}
                        title={`True Mean: ${arm.trueMean.toFixed(2)}`}
                      />
                      {/* Estimated Q-value bar */}
                      <div
                        className="w-full bg-primary rounded-xs transition-all duration-150"
                        style={{
                          height: `${Math.max(4, Math.min(100, ((arm.estimatedValue + 3) / 6) * 100))}%`,
                        }}
                      />
                    </div>

                    <div className="space-y-0.5 text-[10px] font-mono">
                      <div>
                        Q:{" "}
                        <span className="font-semibold text-foreground">
                          {arm.estimatedValue.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        μ: {arm.trueMean.toFixed(2)}
                      </div>
                      <div className="text-muted-foreground/80">
                        N: {arm.pulls}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* History Chart */}
        {store.history.length > 2 && (
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-xs font-medium">
                Average Reward Learning Curve
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="h-28 w-full bg-muted/20 rounded border border-border/40 overflow-hidden p-1">
                {(() => {
                  const data = store.history.map((h) => h.averageReward);
                  const min = Math.min(...data);
                  const max = Math.max(...data);
                  const range = Math.max(1e-4, max - min);
                  const points = data.map((v, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 92 - ((v - min) / range) * 84;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  });
                  return (
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d={`M ${points.join(" L ")}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                    </svg>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

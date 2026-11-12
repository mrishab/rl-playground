import { Play, Pause, FastForward, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { useBanditStore } from "@/stores/banditStore";
import type { BanditAlgorithm } from "@/lib/rl/types";

type Props = {
  store: ReturnType<typeof useBanditStore.getState>;
  animating: boolean;
  onToggleAnimate: () => void;
  onReset: () => void;
};

export function BanditStrategyCard({
  store,
  animating,
  onToggleAnimate,
  onReset,
}: Props) {
  const { config, setAlgorithm, setConfig, step, stepBatch } = store;

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Strategy & Parameters</CardTitle>
        <select
          id="bandit-algorithm-select"
          value={config.algorithm}
          onChange={(e) => setAlgorithm(e.target.value as BanditAlgorithm)}
          className="text-xs rounded-md border border-input bg-background px-2 py-1 shadow-xs font-medium"
        >
          <option value="epsilon-greedy">ε-Greedy</option>
          <option value="ucb1">Upper Confidence Bound (UCB1)</option>
          <option value="optimistic-initial">Optimistic Initial Values</option>
          <option value="thompson-sampling">
            Thompson Sampling (Bayesian)
          </option>
          <option value="pure-greedy">Pure Greedy (ε=0)</option>
        </select>
      </CardHeader>
      <CardContent className="space-y-4">
        {config.algorithm === "epsilon-greedy" && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium">Exploration Rate (ε):</span>
              <span className="font-mono">{config.epsilon.toFixed(2)}</span>
            </div>
            <Slider
              value={[config.epsilon]}
              min={0}
              max={0.5}
              step={0.01}
              onValueChange={([val]) => setConfig({ epsilon: val })}
            />
          </div>
        )}

        {config.algorithm === "ucb1" && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium">
                UCB Exploration Confidence (c):
              </span>
              <span className="font-mono">{config.c.toFixed(2)}</span>
            </div>
            <Slider
              value={[config.c]}
              min={0.5}
              max={4.0}
              step={0.1}
              onValueChange={([val]) => setConfig({ c: val })}
            />
          </div>
        )}

        {config.algorithm === "optimistic-initial" && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium">Initial Q-Value (Q₀):</span>
              <span className="font-mono">
                {(config.initialQ || 5.0).toFixed(1)}
              </span>
            </div>
            <Slider
              value={[config.initialQ || 5.0]}
              min={1.0}
              max={10.0}
              step={0.5}
              onValueChange={([val]) => setConfig({ initialQ: val })}
            />
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-3">
          <Label htmlFor="stationary-switch" className="text-xs font-medium">
            Stationary Bandit
          </Label>
          <Switch
            id="stationary-switch"
            checked={config.isStationary}
            onCheckedChange={(checked) => setConfig({ isStationary: checked })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <Button
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => step()}
          >
            Step 1
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1"
            onClick={() => stepBatch(50)}
          >
            <FastForward className="h-3 w-3" /> Step 50
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1"
            onClick={() => stepBatch(200)}
          >
            <FastForward className="h-3 w-3" /> Step 200
          </Button>
          <Button
            size="sm"
            variant={animating ? "default" : "secondary"}
            className="h-8 text-xs gap-1"
            onClick={onToggleAnimate}
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
            onClick={onReset}
            title="Reset Simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

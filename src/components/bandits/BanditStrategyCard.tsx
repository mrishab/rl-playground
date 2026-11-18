import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { useBanditStore } from "@/stores/banditStore";
import type { BanditAlgorithm } from "@/lib/rl/types";
import { BanditStrategySliders } from "./BanditStrategySliders";
import { BanditStrategyActions } from "./BanditStrategyActions";

interface Props {
  store: ReturnType<typeof useBanditStore.getState>;
  animating: boolean;
  onToggleAnimate: () => void;
  onReset: () => void;
}

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
        <BanditStrategySliders config={config} onUpdate={setConfig} />
        <BanditStrategyActions
          animating={animating}
          onStep={step}
          onStepBatch={stepBatch}
          onToggleAnimate={onToggleAnimate}
          onReset={onReset}
        />
      </CardContent>
    </Card>
  );
}

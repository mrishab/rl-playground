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

const FORMULAS: Record<BanditAlgorithm, string> = {
  "epsilon-greedy":
    "Action selection: a* = argmax Q(a) with prob 1-ε, random exploratory arm with prob ε. Incremental average: Q(a) ← Q(a) + (1/N)[R - Q(a)].",
  ucb1: "Upper Confidence Bound: A_t = argmax [ Q_t(a) + c √(ln t / N_t(a)) ]. Unpulled arms have infinite bonus.",
  "optimistic-initial":
    "Initial optimism: Q₀ = Q_init. Constant step-size update: Q_{t+1}(a) = Q_t(a) + α [R_t - Q_t(a)]. Prevents instant wipeout of optimism.",
  "thompson-sampling":
    "Bayesian posterior: sample θ_a ~ N(μ_a, 1/√N_a), A_t = argmax θ_a. Probability of selecting arm equals its probability of being optimal.",
  "pure-greedy":
    "Pure exploitation: A_t = argmax Q_t(a). Ties broken uniformly at random. No exploratory mechanism.",
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
        <div className="bg-muted/20 border border-dashed rounded p-2 text-[11px] font-mono text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Formula: </span>
          {FORMULAS[config.algorithm]}
        </div>
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

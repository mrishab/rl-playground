import type { BanditAlgorithm } from "@/lib/rl/types";

export const BANDIT_FORMULAS: Record<BanditAlgorithm, string> = {
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

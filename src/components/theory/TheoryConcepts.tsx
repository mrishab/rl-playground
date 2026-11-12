import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TheoryConcepts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            1. Markov Decision Processes (MDP)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>Sequential decision making formalized as a 5-tuple:</p>
          <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
            (S, A, P, R, γ)
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>S:</strong> Environment states.
            </li>
            <li>
              <strong>A:</strong> Available actions.
            </li>
            <li>
              <strong>P(s&apos;|s, a):</strong> Transition probability model.
            </li>
            <li>
              <strong>R(s, a, s&apos;):</strong> Scalar reward signal.
            </li>
            <li>
              <strong>γ ∈ [0, 1):</strong> Discount factor for future returns.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            2. Bellman Equations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>Recursive decomposition of state and action values:</p>
          <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground space-y-1">
            <div>V*(s) = max_a Σ P(s&apos;|s, a) [R + γ V*(s&apos;)]</div>
            <div>
              Q*(s, a) = Σ P(s&apos;|s, a) [R + γ max_a&apos; Q*(s&apos;,
              a&apos;)]
            </div>
          </div>
          <p>
            Solved iteratively via Dynamic Programming or sampled Temporal
            Difference learning.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            3. Q-Learning vs. SARSA
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>Model-free TD control methods with distinct update targets:</p>
          <div className="space-y-1.5">
            <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
              <strong>Q-Learning (Off-Policy):</strong>
              <div>
                Q(s, a) ← Q(s, a) + α [R + γ max_a&apos; Q(s&apos;, a&apos;) -
                Q(s, a)]
              </div>
            </div>
            <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
              <strong>SARSA (On-Policy):</strong>
              <div>
                Q(s, a) ← Q(s, a) + α [R + γ Q(s&apos;, a&apos;) - Q(s, a)]
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            4. Multi-Armed Bandits &amp; UCB
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>Balancing sample reward means with uncertainty bonuses:</p>
          <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
            A_t = argmax_a [ Q_t(a) + c √(ln t / N_t(a)) ]
          </div>
          <p>
            Uncertain arms receive an exploration bonus, ensuring asymptotic
            convergence to the optimal action.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

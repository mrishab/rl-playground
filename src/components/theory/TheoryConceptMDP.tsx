import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TheoryConceptMDP() {
  return (
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
            <strong>S:</strong> States.
          </li>
          <li>
            <strong>A:</strong> Actions.
          </li>
          <li>
            <strong>P(s&apos;|s, a):</strong> Transition probability.
          </li>
          <li>
            <strong>R(s, a, s&apos;):</strong> Scalar reward.
          </li>
          <li>
            <strong>γ ∈ [0, 1):</strong> Discount factor.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

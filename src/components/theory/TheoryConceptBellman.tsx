import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TheoryConceptBellman() {
  return (
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
          Solved iteratively via Dynamic Programming or sampled TD learning.
        </p>
      </CardContent>
    </Card>
  );
}

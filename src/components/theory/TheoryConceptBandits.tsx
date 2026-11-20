import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TheoryConceptBandits() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          4. Multi-Armed Bandits &amp; UCB
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-2">
        <p>Balancing sample reward means with uncertainty bonuses:</p>
        <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground space-y-1">
          <div>
            A_t = argmax<sub>a</sub> [ Q_t(a) + c √(ln t / N_t(a)) ]
          </div>
          <div className="text-[10px] text-muted-foreground font-sans">
            Edge case: If N_t(a) = 0, arm a has infinite uncertainty bonus (+∞)
            and is prioritized for immediate selection.
          </div>
        </div>
        <p>
          Uncertain arms receive exploration bonuses for asymptotic convergence
          and regret minimization.
        </p>
      </CardContent>
    </Card>
  );
}

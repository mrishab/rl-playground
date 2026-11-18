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
        <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
          A_t = argmax_a [ Q_t(a) + c √(ln t / N_t(a)) ]
        </div>
        <p>
          Uncertain arms receive exploration bonuses for asymptotic convergence.
        </p>
      </CardContent>
    </Card>
  );
}

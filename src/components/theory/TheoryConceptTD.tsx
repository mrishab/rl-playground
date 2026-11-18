import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TheoryConceptTD() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          3. Q-Learning vs. SARSA
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-2">
        <p>Model-free TD control methods with distinct update targets:</p>
        <div className="space-y-1.5 font-mono text-[11px] text-foreground">
          <div className="p-2 bg-muted/40 rounded">
            <strong>Q-Learning (Off-Policy):</strong>
            <div>Q(s, a) ← Q(s, a) + α [R + γ max Q(s&apos;, a&apos;) - Q]</div>
          </div>
          <div className="p-2 bg-muted/40 rounded">
            <strong>SARSA (On-Policy):</strong>
            <div>Q(s, a) ← Q(s, a) + α [R + γ Q(s&apos;, a&apos;) - Q]</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TheoryConceptTD() {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">
          3. Q-Learning vs. SARSA
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-6 text-[11px] gap-1 px-1.5 text-primary"
          >
            <Link to="/gridworld">
              GridWorld <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-6 text-[11px] gap-1 px-1.5 text-primary"
          >
            <Link to="/games">
              Games <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
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

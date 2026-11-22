import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TheoryConceptMDP() {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">
          1. Markov Decision Processes (MDP)
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-6 text-[11px] gap-1 px-2 text-primary"
        >
          <Link to="/dp">
            Try Lab <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
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
            <strong>R(s, a, s&apos;):</strong> Expected scalar reward.
          </li>
          <li>
            <strong>γ ∈ [0, 1):</strong> Discount factor.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

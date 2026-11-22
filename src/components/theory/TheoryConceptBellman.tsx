import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellmanEquationsDisplay } from "./BellmanEquationsDisplay";

export function TheoryConceptBellman() {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">
          2. Bellman Equations
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
      <CardContent className="text-xs text-muted-foreground space-y-2.5">
        <p>Recursive decomposition of state and action values:</p>
        <BellmanEquationsDisplay />
        <p>
          Solved iteratively via Dynamic Programming sweeps or sampled TD
          bootstrapping.
        </p>
      </CardContent>
    </Card>
  );
}

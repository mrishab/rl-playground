import { PlusCircle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  onGoToGridWorld: () => void;
};

export function AgentsEmptyState({ onGoToGridWorld }: Props) {
  return (
    <Card className="border-dashed p-8 text-center space-y-3">
      <CardTitle className="text-base">No saved agents</CardTitle>
      <p className="text-xs text-muted-foreground max-w-md mx-auto">
        Train a policy in GridWorld and click Save, or import a JSON backup.
      </p>
      <Button size="sm" className="h-8 text-xs gap-1" onClick={onGoToGridWorld}>
        <PlusCircle className="h-3.5 w-3.5" /> Go to GridWorld Lab
      </Button>
    </Card>
  );
}

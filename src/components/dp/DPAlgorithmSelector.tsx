import { Button } from "@/components/ui/button";

interface Props {
  algorithm: "value-iteration" | "policy-iteration";
  onSelect: (algo: "value-iteration" | "policy-iteration") => void;
}

export function DPAlgorithmSelector({ algorithm, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/40 rounded-lg border text-xs">
      <Button
        size="sm"
        variant={algorithm === "value-iteration" ? "default" : "ghost"}
        className="h-7 text-xs font-medium"
        onClick={() => onSelect("value-iteration")}
      >
        Value Iteration
      </Button>
      <Button
        size="sm"
        variant={algorithm === "policy-iteration" ? "default" : "ghost"}
        className="h-7 text-xs font-medium"
        onClick={() => onSelect("policy-iteration")}
      >
        Policy Iteration
      </Button>
    </div>
  );
}

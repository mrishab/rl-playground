import { ACTION_NAMES } from "@/lib/rl/types";

interface Props {
  inspected: [number, number];
  inspectedQ: [number, number, number, number];
}

export function RLInspectedCellPanel({ inspected, inspectedQ }: Props) {
  const maxQ = Math.max(...inspectedQ);
  const bestActionIdx = inspectedQ.indexOf(maxQ);

  return (
    <div className="w-full bg-muted/40 border rounded-lg p-2.5 text-xs space-y-1.5">
      <div className="flex items-center justify-between font-medium">
        <span>
          State ({inspected[0]}, {inspected[1]}): V*(s) ={" "}
          <span className="font-mono text-primary">{maxQ.toFixed(2)}</span>
        </span>
        <span className="text-[11px] text-muted-foreground">
          Best:{" "}
          <span className="font-semibold text-foreground">
            {ACTION_NAMES[bestActionIdx as 0 | 1 | 2 | 3]}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1 font-mono text-[11px]">
        {[0, 1, 2, 3].map((a) => (
          <div
            key={a}
            className={`p-1 rounded text-center border ${
              a === bestActionIdx
                ? "bg-primary/10 border-primary font-bold text-primary"
                : "bg-background/60"
            }`}
          >
            <div className="text-[9px] text-muted-foreground">
              {ACTION_NAMES[a as 0 | 1 | 2 | 3]}
            </div>
            <div>{inspectedQ[a]?.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stateKey } from "@/lib/rl/rlEngine";
import { ACTION_ARROWS } from "@/lib/rl/types";
import type { useDPStore } from "@/stores/dpStore";

type Props = {
  store: ReturnType<typeof useDPStore.getState>;
  selectedCell: [number, number] | null;
  onCellClick: (r: number, c: number) => void;
};

export function DPGridCard({ store, selectedCell, onCellClick }: Props) {
  const gridSize = store.rules.gridSize;

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          State Values V*(s) &amp; Derived Greedy Policy π*(s)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div
          data-testid="dp-grid-cells"
          className="grid gap-1.5 w-full max-w-sm mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const r = Math.floor(idx / gridSize);
            const c = idx % gridSize;
            const key = stateKey(r, c);
            const isGoal = r === 4 && c === 4;
            const isObstacle = (r === 2 && c === 1) || (r === 2 && c === 3);
            const isHazard =
              (r === 1 && c === 2) ||
              (r === 2 && c === 2) ||
              (r === 3 && c === 2);
            const isSelected =
              selectedCell && selectedCell[0] === r && selectedCell[1] === c;

            const v = store.values[key] || 0;
            const policyAction = store.policy[key] ?? 0;

            return (
              <button
                key={key}
                type="button"
                data-testid={`dp-cell-${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className={`relative aspect-square rounded-md border flex flex-col items-center justify-center p-1 text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-1"
                    : "hover:bg-muted/40"
                } ${
                  isGoal
                    ? "bg-primary/20 border-primary text-primary font-bold"
                    : isObstacle
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : isHazard
                        ? "bg-destructive/20 border-destructive text-destructive"
                        : "border-border/60"
                }`}
                style={{
                  backgroundColor:
                    !isObstacle && !isGoal && !isHazard && v !== 0
                      ? `hsl(var(--primary) / ${Math.min(0.3, Math.abs(v) / 15)})`
                      : undefined,
                }}
              >
                <span className="text-[9px] font-mono font-semibold text-foreground/80">
                  {isGoal
                    ? "GOAL"
                    : isObstacle
                      ? "WALL"
                      : isHazard
                        ? "PIT"
                        : v.toFixed(2)}
                </span>
                {!isGoal && !isObstacle && (
                  <span className="text-xs font-bold text-primary mt-0.5">
                    {ACTION_ARROWS[policyAction]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

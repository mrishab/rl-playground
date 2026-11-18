import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stateKey } from "@/lib/rl/rlEngine";
import type { useDPStore } from "@/stores/dpStore";
import { DPCellButton } from "./DPCellButton";

interface Props {
  store: ReturnType<typeof useDPStore.getState>;
  selectedCell: [number, number] | null;
  onCellClick: (r: number, c: number) => void;
}

export function DPGridCard({ store, selectedCell, onCellClick }: Props) {
  const gridSize = store.rules.gridSize;

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          State Values & Greedy Policy
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
            const isSelected =
              selectedCell !== null &&
              selectedCell[0] === r &&
              selectedCell[1] === c;
            const v = store.values[key] || 0;
            const policyAction = store.policy[key] ?? 0;

            return (
              <DPCellButton
                key={key}
                r={r}
                c={c}
                v={v}
                policyAction={policyAction}
                isSelected={isSelected}
                onClick={() => onCellClick(r, c)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

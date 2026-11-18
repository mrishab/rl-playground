import { getGridLookups } from "./rlCellUtils";
import type { useRLStore } from "@/stores/rlStore";
import type { EditTool } from "./rlTools";
import { RLGridCellItem } from "./RLGridCellItem";

interface Props {
  store: ReturnType<typeof useRLStore.getState>;
  tool: EditTool;
}

export function RLGridCells({ store, tool }: Props) {
  const { gridSize } = store;
  const lookups = getGridLookups(store);

  return (
    <div
      data-testid="grid-canvas-cells"
      className="grid gap-1.5 w-full max-w-md mx-auto"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
        const r = Math.floor(idx / gridSize);
        const c = idx % gridSize;
        return (
          <RLGridCellItem
            key={`${r}-${c}`}
            r={r}
            c={c}
            store={store}
            lookups={lookups}
            tool={tool}
          />
        );
      })}
    </div>
  );
}

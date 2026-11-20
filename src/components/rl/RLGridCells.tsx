import { getGridLookups } from "./rlCellUtils";
import type { useRLStore } from "@/stores/rlStore";
import type { EditTool } from "./rlTools";
import { RLGridCellItem } from "./RLGridCellItem";

interface Props {
  store: ReturnType<typeof useRLStore.getState>;
  tool: EditTool;
}

export function RLGridCells({ store, tool }: Props) {
  const gridWidth = store.gridWidth ?? store.gridSize;
  const gridHeight = store.gridHeight ?? store.gridSize;
  const lookups = getGridLookups(store);
  const maxWidthClass = gridWidth > 8 ? "max-w-2xl" : "max-w-md";

  return (
    <div
      data-testid="grid-canvas-cells"
      className={`grid gap-1.5 w-full ${maxWidthClass} mx-auto`}
      style={{ gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: gridHeight * gridWidth }).map((_, idx) => {
        const r = Math.floor(idx / gridWidth);
        const c = idx % gridWidth;
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

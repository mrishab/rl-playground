import { useState } from "react";
import { GitCommit } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { useDPStore } from "@/stores/dpStore";
import { DPControlsCard } from "./DPControlsCard";
import { DPGridCard } from "./DPGridCard";
import { DPInspectorCard } from "./DPInspectorCard";

export function DPPage() {
  const store = useDPStore();
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([
    1, 1,
  ]);

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell([r, c]);
    store.inspectCell(r, c);
  };

  return (
    <PageLayout icon={GitCommit} title="Dynamic Programming" hideActionGate>
      <div className="space-y-3 max-w-6xl mx-auto w-full">
        <div className="grid gap-3 lg:grid-cols-3">
          <DPControlsCard store={store} />
          <DPGridCard
            store={store}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
        </div>
        {store.inspectedState && (
          <DPInspectorCard inspected={store.inspectedState} />
        )}
      </div>
    </PageLayout>
  );
}

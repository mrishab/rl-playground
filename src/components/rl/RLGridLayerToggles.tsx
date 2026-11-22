import { Button } from "@/components/ui/button";
import type { useRLStore } from "@/stores/rlStore";

interface Props {
  store: ReturnType<typeof useRLStore.getState>;
}

export function RLGridLayerToggles({ store }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Button
        size="sm"
        variant={store.showValueHeatmap ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={() => store.toggleLayer("heatmap")}
        title="Toggle state-value V(s) heatmap shading"
      >
        Heatmap
      </Button>
      <Button
        size="sm"
        variant={store.showPolicyArrows ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={() => store.toggleLayer("arrows")}
        title="Toggle optimal policy direction arrows"
      >
        Arrows
      </Button>
      <Button
        size="sm"
        variant={store.showQRose ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={() => store.toggleLayer("qrose")}
        title="Toggle 4-direction action-values Q(s, a)"
      >
        Q-Values
      </Button>
      <Button
        size="sm"
        variant={store.showVisitHeatmap ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={() => store.toggleLayer("visits")}
        title="Toggle state visitation counters"
      >
        Visits
      </Button>
      <Button
        size="sm"
        variant={store.showBFSPath ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={store.toggleShowBFSPath}
        title="Toggle BFS shortest safe path"
      >
        BFS Path
      </Button>
    </div>
  );
}

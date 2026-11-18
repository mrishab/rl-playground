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
      >
        Heatmap
      </Button>
      <Button
        size="sm"
        variant={store.showPolicyArrows ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={() => store.toggleLayer("arrows")}
      >
        Arrows
      </Button>
      <Button
        size="sm"
        variant={store.showQRose ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={() => store.toggleLayer("qrose")}
      >
        Q-Values
      </Button>
      <Button
        size="sm"
        variant={store.showVisitHeatmap ? "default" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={() => store.toggleLayer("visits")}
      >
        Visits
      </Button>
      <Button
        size="sm"
        variant={store.showBFSPath ? "secondary" : "outline"}
        className="h-6 text-[10px] px-1.5"
        onClick={store.toggleShowBFSPath}
      >
        BFS Path
      </Button>
    </div>
  );
}

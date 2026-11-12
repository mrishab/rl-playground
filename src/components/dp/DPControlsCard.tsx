import { Play, FastForward, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { useDPStore } from "@/stores/dpStore";

type Props = {
  store: ReturnType<typeof useDPStore.getState>;
};

export function DPControlsCard({ store }: Props) {
  return (
    <Card className="space-y-4 p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-base">Value Iteration Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium">Discount Factor (γ):</span>
            <span className="font-mono">{store.gamma.toFixed(2)}</span>
          </div>
          <Slider
            value={[store.gamma]}
            min={0.1}
            max={0.99}
            step={0.01}
            onValueChange={([val]) => store.setGamma(val)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-muted/40 p-2 rounded border">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Sweeps
            </div>
            <div className="text-base font-bold font-mono">
              {store.sweepCount}
            </div>
          </div>
          <div className="bg-muted/40 p-2 rounded border">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Max Δ
            </div>
            <div className="text-base font-bold font-mono">
              {store.maxDelta.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="p-2 rounded bg-muted/30 border text-xs">
          Status:{" "}
          {store.isConverged ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Converged (Δ &lt; {store.theta})
            </span>
          ) : store.sweepCount > 0 ? (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Iterating...
            </span>
          ) : (
            <span className="text-muted-foreground">Ready</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs gap-1"
            onClick={store.stepSweep}
          >
            <Play className="h-3 w-3" /> Step 1 Sweep
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1"
            onClick={store.runToConvergence}
          >
            <FastForward className="h-3 w-3" /> Run to Convergence
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs px-2 text-muted-foreground"
            onClick={store.reset}
            title="Reset DP Values"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

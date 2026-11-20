import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { useDPStore } from "@/stores/dpStore";
import { DPAlgorithmSelector } from "./DPAlgorithmSelector";
import { DPControlsStatus } from "./DPControlsStatus";
import { DPControlsButtons } from "./DPControlsButtons";

interface Props {
  store: ReturnType<typeof useDPStore.getState>;
}

export function DPControlsCard({ store }: Props) {
  return (
    <Card className="space-y-4 p-4">
      <CardHeader className="p-0 pb-1">
        <CardTitle className="text-base">DP Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-3.5">
        <DPAlgorithmSelector
          algorithm={store.algorithm}
          onSelect={store.setAlgorithm}
        />
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
            onValueChange={([val]) => store.setGamma(val ?? store.gamma)}
          />
        </div>
        <DPControlsStatus
          algorithm={store.algorithm}
          sweepCount={store.sweepCount}
          maxDelta={store.maxDelta}
          isConverged={store.isConverged}
          theta={store.theta}
        />
        <DPControlsButtons
          algorithm={store.algorithm}
          onStep={store.stepSweep}
          onRunConvergence={store.runToConvergence}
          onReset={store.reset}
        />
      </CardContent>
    </Card>
  );
}

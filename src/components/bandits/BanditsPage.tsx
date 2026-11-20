import { useState, useEffect } from "react";
import { Target } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { useBanditStore } from "@/stores/banditStore";
import { BanditStrategyCard } from "./BanditStrategyCard";
import { BanditMetricsCard } from "./BanditMetricsCard";
import { BanditTestbedCard } from "./BanditTestbedCard";
import { BanditChartCard } from "./BanditChartCard";

export function BanditsPage() {
  const store = useBanditStore();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!animating) return;
    const interval = setInterval(() => {
      useBanditStore.getState().step();
    }, 80);
    return () => clearInterval(interval);
  }, [animating]);

  const optimalIdx = store.arms.reduce(
    (maxIdx, arm, idx, arr) =>
      arm.trueMean > arr[maxIdx].trueMean ? idx : maxIdx,
    0,
  );

  return (
    <PageLayout icon={Target} title="Multi-Armed Bandits Lab" hideActionGate>
      <div className="space-y-3 max-w-6xl mx-auto w-full">
        <div className="grid gap-3 md:grid-cols-3">
          <BanditStrategyCard
            store={store}
            animating={animating}
            onToggleAnimate={() => setAnimating(!animating)}
            onReset={() => {
              setAnimating(false);
              store.reset();
            }}
          />
          <BanditMetricsCard
            stepCount={store.stepCount}
            optimalRate={store.optimalRate}
            averageReward={store.averageReward}
            cumulativeReward={store.cumulativeReward}
            optimalIdx={optimalIdx}
            optimalArm={store.arms[optimalIdx]}
          />
        </div>
        <BanditTestbedCard arms={store.arms} optimalIdx={optimalIdx} />
        <BanditChartCard history={store.history} />
      </div>
    </PageLayout>
  );
}

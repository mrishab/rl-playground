import { Bot } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { RLGridCanvas } from "./RLGridCanvas";
import { RLConfigColumn } from "./RLConfigColumn";
import { RLMetricsCard } from "./RLMetricsCard";
import { RLRewardChart } from "./RLRewardChart";
import { useRLPage } from "./useRLPage";

export function RLPage() {
  const p = useRLPage();

  return (
    <PageLayout
      icon={Bot}
      title="Reinforcement Learning GridWorld Lab"
      hideActionGate
    >
      <div className="space-y-3 max-w-6xl mx-auto w-full">
        <div className="grid gap-3 lg:grid-cols-2">
          <RLConfigColumn store={p} />
          <RLGridCanvas store={p} />
        </div>
        <RLMetricsCard
          totalEpisodes={p.totalEpisodes}
          successCount={p.successCount}
          rewardHistory={p.rewardHistory}
          stepsHistory={p.stepsHistory}
        />
        <RLRewardChart
          rewards={p.rewardHistory}
          steps={p.stepsHistory}
          tdErrors={p.tdHistory}
        />
      </div>
    </PageLayout>
  );
}

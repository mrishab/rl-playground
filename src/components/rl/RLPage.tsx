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
      subtitle="Interactive Bellman updates, Q-learning, SARSA, Double Q, and Dynamic Programming in the browser"
      hideActionGate
    >
      <div className="space-y-4 max-w-6xl mx-auto w-full">
        <div className="grid gap-4 lg:grid-cols-2">
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

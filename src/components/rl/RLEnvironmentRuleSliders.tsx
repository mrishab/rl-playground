import type { RLEnvironmentRules } from "@/lib/rl/types";
import { RLRuleSliderRow } from "./RLRuleSliderRow";

type Props = {
  rules: RLEnvironmentRules;
  onChange: (patch: Partial<RLEnvironmentRules>) => void;
};

export function RLEnvironmentRuleSliders({ rules, onChange }: Props) {
  const slip = Math.round(rules.slipProbability * 100);
  const obsPen = rules.smartObstaclePenalty ?? -40;

  return (
    <div className="space-y-3.5">
      <RLRuleSliderRow
        label={`Goal Reward (+${rules.goalReward})`}
        val={rules.goalReward}
        min={10}
        max={100}
        step={5}
        onChange={(v) => onChange({ goalReward: v })}
      />
      <RLRuleSliderRow
        label={`Step Cost (${rules.stepReward})`}
        val={rules.stepReward}
        min={-3}
        max={0}
        step={0.5}
        onChange={(v) => onChange({ stepReward: v })}
      />
      <RLRuleSliderRow
        label={`Hazard Penalty (${rules.hazardPenalty})`}
        val={rules.hazardPenalty}
        min={-100}
        max={-10}
        step={5}
        onChange={(v) => onChange({ hazardPenalty: v })}
      />
      <RLRuleSliderRow
        label={`Villain Penalty (${obsPen})`}
        val={obsPen}
        min={-100}
        max={-10}
        step={5}
        onChange={(v) => onChange({ smartObstaclePenalty: v })}
      />
      <RLRuleSliderRow
        label={`Floor Slip (${slip}%)`}
        val={slip}
        min={0}
        max={30}
        step={5}
        onChange={(v) => onChange({ slipProbability: v / 100 })}
      />
    </div>
  );
}

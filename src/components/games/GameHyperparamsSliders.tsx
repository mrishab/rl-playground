import { Slider } from "@/components/ui/slider";
import type { GameHyperparameters } from "@/lib/games/types";

interface Props {
  params: GameHyperparameters;
  onChange: (patch: Partial<GameHyperparameters>) => void;
}

export function GameHyperparamsSliders({ params, onChange }: Props) {
  const sliders = [
    {
      label: `α ${params.learningRate.toFixed(2)}`,
      title: "Learning Rate α: step size for updates",
      min: 0.05,
      max: 0.8,
      step: 0.05,
      val: params.learningRate,
      change: (v: number) => onChange({ learningRate: v }),
    },
    {
      label: `γ ${params.discountFactor.toFixed(2)}`,
      title: "Discount Factor γ: future reward horizon",
      min: 0.0,
      max: 0.99,
      step: 0.05,
      val: params.discountFactor,
      change: (v: number) => onChange({ discountFactor: v }),
    },
    {
      label: `ε ${params.explorationRate.toFixed(2)}`,
      title: "Exploration Rate ε: probability of random action",
      min: 0.01,
      max: 0.5,
      step: 0.02,
      val: params.explorationRate,
      change: (v: number) => onChange({ explorationRate: v }),
    },
  ];

  return (
    <>
      {sliders.map((s) => (
        <div key={s.title} className="flex items-center gap-2 min-w-[130px]">
          <span className="text-muted-foreground font-mono" title={s.title}>
            {s.label}
          </span>
          <Slider
            min={s.min}
            max={s.max}
            step={s.step}
            value={[s.val]}
            onValueChange={([val]) => s.change(val)}
            className="w-16"
          />
        </div>
      ))}
    </>
  );
}

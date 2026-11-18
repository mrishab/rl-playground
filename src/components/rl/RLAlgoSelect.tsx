import type { RLAlgorithm } from "@/lib/rl/types";

interface Props {
  algorithm: RLAlgorithm;
  onChange: (algo: RLAlgorithm) => void;
}

const ALGORITHMS: { id: RLAlgorithm; label: string }[] = [
  { id: "q-learning", label: "Q-Learning" },
  { id: "sarsa", label: "SARSA" },
  { id: "expected-sarsa", label: "Expected SARSA" },
  { id: "double-q", label: "Double Q-Learning" },
  { id: "monte-carlo", label: "Monte Carlo" },
  { id: "value-iteration", label: "Value Iteration (DP)" },
];

export function RLAlgoSelect({ algorithm, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <label
        htmlFor="rl-algorithm-select"
        className="text-xs text-muted-foreground"
      >
        Algo:
      </label>
      <select
        id="rl-algorithm-select"
        value={algorithm}
        onChange={(e) => onChange(e.target.value as RLAlgorithm)}
        className="text-xs rounded-md border border-input bg-background px-2 py-1 shadow-xs font-medium"
      >
        {ALGORITHMS.map((algo) => (
          <option key={algo.id} value={algo.id}>
            {algo.label}
          </option>
        ))}
      </select>
    </div>
  );
}

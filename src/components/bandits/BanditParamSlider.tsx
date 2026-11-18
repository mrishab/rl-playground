import { Slider } from "@/components/ui/slider";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  precision?: number;
  onChange: (v: number) => void;
}

export function BanditParamSlider({
  label,
  value,
  min,
  max,
  step,
  precision = 2,
  onChange,
}: Props) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="font-medium">{label}:</span>
        <span className="font-mono">{value.toFixed(precision)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([val]) => onChange(val ?? value)}
      />
    </div>
  );
}

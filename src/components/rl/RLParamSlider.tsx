import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type Props = {
  label: string;
  value: number;
  disabled?: boolean;
  onChange: (val: number) => void;
};

export function RLParamSlider({ label, value, disabled, onChange }: Props) {
  return (
    <div className="space-y-1">
      <Label className={`text-xs ${disabled ? "text-muted-foreground" : ""}`}>
        {label}
      </Label>
      <Slider
        disabled={disabled}
        min={0}
        max={100}
        step={1}
        value={[Math.round(value * 100)]}
        onValueChange={([val]) => onChange(val / 100)}
      />
    </div>
  );
}

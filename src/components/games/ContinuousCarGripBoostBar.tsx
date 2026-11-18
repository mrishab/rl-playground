type Props = {
  boostMeter: number;
  lossOfControl: number;
};

export function ContinuousCarGripBoostBar({
  boostMeter,
  lossOfControl,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-1 text-[9px] text-muted-foreground">
      <span>Boost: {Math.round(boostMeter)}%</span>
      <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden max-w-[120px]">
        <div
          className="h-full bg-orange-500 transition-all"
          style={{ width: `${boostMeter}%` }}
        />
      </div>
      <span
        className={
          lossOfControl > 0
            ? "text-amber-400 font-semibold"
            : "text-emerald-400"
        }
      >
        {lossOfControl > 0
          ? `Grip: ${Math.round((1 - lossOfControl) * 100)}%`
          : "Grip: 100%"}
      </span>
    </div>
  );
}

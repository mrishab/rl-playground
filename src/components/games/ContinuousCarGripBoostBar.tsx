interface Props {
  boostMeter: number;
  lossOfControl: number;
}

export function ContinuousCarGripBoostBar({
  boostMeter,
  lossOfControl,
}: Props) {
  const scaleX = Math.max(0, Math.min(1, boostMeter / 100));

  return (
    <div className="flex items-center justify-between gap-1 text-[9px] text-muted-foreground">
      <span>Boost: {Math.round(boostMeter)}%</span>
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-[120px]">
        <div
          className="w-full h-full bg-warning origin-left transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${scaleX})` }}
        />
      </div>
      <span
        className={
          lossOfControl > 0 ? "text-warning font-semibold" : "text-success"
        }
      >
        {lossOfControl > 0
          ? `Grip: ${Math.round((1 - lossOfControl) * 100)}%`
          : "Grip: 100%"}
      </span>
    </div>
  );
}

interface Props {
  prepped: number;
  demand: number;
  sold: number;
  spoiled: number;
}

export function LemonadeFinancialSummary({
  prepped,
  demand,
  sold,
  spoiled,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 text-[11px] bg-muted/40 p-2 rounded-lg border border-border/40">
      <div>
        Prepped: <span className="text-warning">{prepped} cups</span>
      </div>
      <div>
        Demand: <span className="text-primary">{demand} cups</span>
      </div>
      <div>
        Sold: <span className="text-success">{sold} cups</span>
      </div>
      <div>
        Spoiled: <span className="text-destructive">{spoiled} cups</span>
      </div>
    </div>
  );
}

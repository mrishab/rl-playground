type Props = {
  prepped: number;
  demand: number;
  sold: number;
  spoiled: number;
};

export function LemonadeFinancialSummary({
  prepped,
  demand,
  sold,
  spoiled,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-950/60 p-2 rounded-lg border border-border/40">
      <div>
        Prepped: <span className="text-amber-400">{prepped} cups</span>
      </div>
      <div>
        Demand: <span className="text-sky-400">{demand} cups</span>
      </div>
      <div>
        Sold: <span className="text-emerald-400">{sold} cups</span>
      </div>
      <div>
        Spoiled: <span className="text-red-400">{spoiled} cups</span>
      </div>
    </div>
  );
}

interface Props {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export function BanditMetricTile({ label, value, highlight }: Props) {
  return (
    <div className="bg-muted/40 p-2.5 rounded-lg">
      <div className="text-[10px] text-muted-foreground uppercase font-semibold">
        {label}
      </div>
      <div
        className={`text-lg font-bold font-mono ${highlight ? "text-primary" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

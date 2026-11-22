interface Props {
  label: string;
  value: string | number;
  highlight?: boolean;
  title?: string;
}

export function BanditMetricTile({ label, value, highlight, title }: Props) {
  return (
    <div className="bg-muted/40 p-2.5 rounded-lg" title={title}>
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

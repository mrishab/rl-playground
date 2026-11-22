import type { SlotMachineArm } from "@/lib/games/types";

interface Props {
  machines: SlotMachineArm[];
  lastArm: number;
}

function formatVal(val: number): string {
  if (Math.abs(val) < 0.005) return "$0.00";
  return `${val > 0 ? "+" : ""}$${val.toFixed(2)}`;
}

export function SlotMachineArmCard({ machines, lastArm }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {machines.map((m) => {
        const isSelected = lastArm === m.id;
        const winPct = m.pulls > 0 ? Math.round((m.wins / m.pulls) * 100) : 0;
        const netEV = m.trueEV - 1.0;
        return (
          <div
            key={m.id}
            className={`p-2 rounded-lg border text-xs space-y-1 overflow-hidden transition-[color,background-color,border-color,box-shadow] duration-150 ease-out ${
              isSelected
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/50 bg-card/40"
            }`}
          >
            <div className="flex items-start justify-between gap-1 font-medium">
              <span className="flex items-center gap-1 min-w-0" title={m.name}>
                <span className="shrink-0">{m.symbol}</span>
                <span className="text-[11px] font-semibold leading-tight break-words">
                  {m.name}
                </span>
              </span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-warning/15 text-warning font-mono font-medium shrink-0 whitespace-nowrap">
                ${m.payout}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>Pulls: {m.pulls}</span>
              <span>Win: {winPct}%</span>
            </div>
            <div className="text-[10px] flex justify-between font-mono pt-0.5 border-t border-border/30">
              <span className="text-primary" title="Learned Net Profit Q-value">
                Q̂: {formatVal(m.estimatedQ)}
              </span>
              <span className="text-success" title="True Net Profit EV">
                EV: {formatVal(netEV)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

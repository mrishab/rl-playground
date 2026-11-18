import type { SlotMachineArm } from "@/lib/games/types";

interface Props {
  machines: SlotMachineArm[];
  lastArm: number;
}

export function SlotMachineArmCard({ machines, lastArm }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {machines.map((m) => {
        const isSelected = lastArm === m.id;
        const winPct = m.pulls > 0 ? Math.round((m.wins / m.pulls) * 100) : 0;
        return (
          <div
            key={m.id}
            className={`p-2 rounded-lg border text-xs space-y-1 transition-[color,background-color,border-color,box-shadow] duration-150 ease-out ${
              isSelected
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/50 bg-card/40"
            }`}
          >
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center gap-1">
                <span>{m.symbol}</span>
                <span className="truncate max-w-[65px]">{m.name}</span>
              </span>
              <span className="text-[10px] text-warning font-mono">
                ${m.payout}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>Pulls: {m.pulls}</span>
              <span>Win: {winPct}%</span>
            </div>
            <div className="text-[10px] flex justify-between font-mono pt-0.5 border-t border-border/30">
              <span className="text-primary">Q̂: ${m.estimatedQ}</span>
              <span className="text-success">EV: ${m.trueEV}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

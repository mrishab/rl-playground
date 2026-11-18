import type { WeatherType } from "@/lib/games/types";

type Props = {
  policy: Record<WeatherType, number>;
  activeWeather: WeatherType;
};

const WEATHERS: { type: WeatherType; icon: string }[] = [
  { type: "Rainy", icon: "🌧️" },
  { type: "Cloudy", icon: "⛅" },
  { type: "Sunny", icon: "☀️" },
  { type: "Heatwave", icon: "🔥" },
];

export function LemonadePolicyTable({ policy, activeWeather }: Props) {
  return (
    <div className="p-2.5 rounded-lg border border-border/50 bg-card/40 space-y-1.5 text-xs">
      <div className="flex justify-between items-center text-[11px] font-semibold text-muted-foreground">
        <span>Weather State</span>
        <span>RL Policy (Cups)</span>
        <span className="text-[10px] text-amber-500 font-mono">Static CSP</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
        {WEATHERS.map(({ type, icon }) => {
          const isActive = activeWeather === type;
          const prepped = policy[type] ?? 30;
          return (
            <div
              key={type}
              className={`p-1.5 rounded border text-[11px] space-y-0.5 ${
                isActive
                  ? "border-primary bg-primary/10 shadow-xs"
                  : "border-border/40 bg-neutral-950/40"
              }`}
            >
              <div>{icon}</div>
              <div className="font-semibold text-foreground text-[10px]">
                {type}
              </div>
              <div className="text-emerald-400 font-bold">{prepped}c</div>
              <div className="text-[9px] text-muted-foreground">30c</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

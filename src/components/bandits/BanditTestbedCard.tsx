import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditArm } from "@/lib/rl/types";

type Props = {
  arms: BanditArm[];
  optimalIdx: number;
};

export function BanditTestbedCard({ arms, optimalIdx }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          10-Armed Testbed: Estimated Value Q(a) vs True Mean μ(a)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {arms.map((arm) => {
            const isOptimal = arm.id === optimalIdx;
            return (
              <div
                key={arm.id}
                className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center space-y-1.5 transition-colors ${
                  isOptimal
                    ? "bg-primary/5 border-primary/40"
                    : "bg-muted/30 border-border/70"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold font-mono">
                    #{arm.id + 1}
                  </span>
                  {isOptimal && (
                    <span className="text-[9px] bg-primary text-primary-foreground px-1 rounded font-semibold">
                      ★
                    </span>
                  )}
                </div>

                <div className="h-16 w-8 bg-muted/60 rounded border flex items-end justify-center p-0.5 relative overflow-hidden">
                  <div
                    className="absolute w-full border-t border-dashed border-destructive z-10"
                    style={{
                      bottom: `${Math.max(5, Math.min(95, ((arm.trueMean + 3) / 6) * 100))}%`,
                    }}
                    title={`True Mean: ${arm.trueMean.toFixed(2)}`}
                  />
                  <div
                    className="w-full bg-primary rounded-xs transition-all duration-150"
                    style={{
                      height: `${Math.max(4, Math.min(100, ((arm.estimatedValue + 3) / 6) * 100))}%`,
                    }}
                  />
                </div>

                <div className="space-y-0.5 text-[10px] font-mono">
                  <div>
                    Q:{" "}
                    <span className="font-semibold text-foreground">
                      {arm.estimatedValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    μ: {arm.trueMean.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground/80">N: {arm.pulls}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

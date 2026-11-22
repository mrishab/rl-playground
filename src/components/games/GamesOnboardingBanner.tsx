import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GamesOnboardingStep } from "./GamesOnboardingStep";
import { ONBOARDING_STEPS } from "./gamesOnboardingData";

const STORAGE_KEY = "rl_games_onboarding_dismissed";

export function GamesOnboardingBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs space-y-2">
      <div className="flex items-center justify-between font-semibold text-primary">
        <span className="flex items-center gap-1.5 text-xs font-bold">
          <Sparkles className="h-4 w-4" /> RL Games Sandbox
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
          title="Dismiss guide"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
        {ONBOARDING_STEPS.map((s) => (
          <GamesOnboardingStep key={s.title} {...s} />
        ))}
      </div>
    </div>
  );
}

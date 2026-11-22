import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  description: string;
}

export function GamesOnboardingStep({
  icon: Icon,
  iconClass,
  title,
  description,
}: Props) {
  return (
    <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-card/60 border border-border/40">
      <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${iconClass}`} />
      <span>
        <strong>{title}:</strong> {description}
      </span>
    </div>
  );
}

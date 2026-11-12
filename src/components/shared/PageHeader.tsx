import { isValidElement } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  icon?: LucideIcon | ReactNode;
  title: string;
  subtitle?: string;
};

export function PageHeader({ icon: Icon, title, subtitle }: PageHeaderProps) {
  let iconNode: ReactNode = null;
  if (Icon) {
    if (isValidElement(Icon)) {
      iconNode = Icon;
    } else if (typeof Icon === "function" || typeof Icon === "object") {
      const IconComponent = Icon as LucideIcon;
      iconNode = <IconComponent className="h-5 w-5 text-primary" />;
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      {iconNode}
      <div className="min-w-0">
        <h1 className="text-base font-semibold sm:text-lg leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

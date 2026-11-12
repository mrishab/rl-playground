import { PageHeader } from "./PageHeader";
import type { PageLayoutProps } from "./page-layout/types";

export type { PageLayoutProps };

export function PageLayout({
  title,
  subtitle,
  icon,
  children,
  actions,
  className = "",
}: PageLayoutProps) {
  return (
    <div className={`flex min-h-full flex-1 flex-col ${className}`}>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeader icon={icon} title={title} subtitle={subtitle} />
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

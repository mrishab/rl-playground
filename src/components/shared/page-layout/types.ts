import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type PageLayoutProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  hideActionGate?: boolean;
};

import { Link, useLocation } from "react-router-dom";
import { Grid3X3, Target, GitCommit, Cpu, BookOpen } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthorLink } from "./site-header/AuthorLink";
import { SponsorButton } from "./site-header/SponsorButton";
import { HeaderBreadcrumbs } from "./site-header/HeaderBreadcrumbs";
import { AgentsStat } from "./site-header/AgentsStat";

export function SiteHeader() {
  const { pathname } = useLocation();

  const navLinks = [
    {
      to: "/gridworld",
      label: "GridWorld",
      icon: Grid3X3,
      match: (p: string) =>
        p === "/" || p.startsWith("/gridworld") || p.startsWith("/rl"),
    },
    {
      to: "/bandits",
      label: "Bandits",
      icon: Target,
      match: (p: string) => p.startsWith("/bandits"),
    },
    {
      to: "/dp",
      label: "Dynamic Prog",
      icon: GitCommit,
      match: (p: string) => p.startsWith("/dp"),
    },
    {
      to: "/agents",
      label: "Agents",
      icon: Cpu,
      match: (p: string) => p.startsWith("/agents") || p.startsWith("/models"),
    },
    {
      to: "/theory",
      label: "Theory & Quiz",
      icon: BookOpen,
      match: (p: string) => p.startsWith("/theory"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 flex w-full flex-col border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-[env(safe-area-inset-top,0px)]">
      <div className="flex h-14 w-full items-center gap-2.5 px-3 sm:gap-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-semibold transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] hover:opacity-85 shrink-0"
        >
          <Logo className="size-8 rounded-lg shadow-sm" size={32} />
          <span className="text-sm font-semibold tracking-tight">
            RL Playground
          </span>
        </Link>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <HeaderBreadcrumbs />

        {/* Center Nav */}
        <nav
          className="hidden md:flex items-center gap-1 ml-4"
          aria-label="Main Navigation"
        >
          {navLinks.map(({ to, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          <AgentsStat />
          <AuthorLink />
          <SponsorButton />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden items-center justify-around border-t px-2 py-1 bg-muted/40 overflow-x-auto">
        {navLinks.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
                active
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

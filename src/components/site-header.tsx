import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthorLink } from "./site-header/AuthorLink";
import { SponsorButton } from "./site-header/SponsorButton";
import { HeaderBreadcrumbs } from "./site-header/HeaderBreadcrumbs";
import { AgentsStat } from "./site-header/AgentsStat";
import { NavLinksDesktop } from "./site-header/NavLinksDesktop";
import { NavLinksMobile } from "./site-header/NavLinksMobile";

export function SiteHeader() {
  const { pathname } = useLocation();

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
        <NavLinksDesktop pathname={pathname} />

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          <AgentsStat />
          <AuthorLink />
          <SponsorButton />
          <ThemeToggle />
        </div>
      </div>

      <NavLinksMobile pathname={pathname} />
    </header>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";
import { NavLinksDesktop } from "./site-header/NavLinksDesktop";
import { NavLinksMobile } from "./site-header/NavLinksMobile";

const HEADER_CLS = cn(
  "sticky top-0 z-40 flex w-full flex-col border-b",
  "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  "pt-[env(safe-area-inset-top,0px)]",
);

const BRAND_CLS = cn(
  "flex items-center gap-2 font-semibold shrink-0",
  "transition-[transform,opacity] duration-150 ease-out",
  "active:scale-[0.98] hover:opacity-80",
);

export function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className={HEADER_CLS}>
      <div className="flex h-12 w-full items-center gap-3 px-3 sm:px-5">
        <Link to="/" className={BRAND_CLS}>
          <Logo className="size-7 rounded-md shadow-sm" size={28} />
          <span className="text-sm font-semibold tracking-tight hidden sm:block">
            RL Playground
          </span>
        </Link>
        <NavLinksDesktop pathname={pathname} />
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <ThemeToggle />
        </div>
      </div>
      <NavLinksMobile pathname={pathname} />
    </header>
  );
}

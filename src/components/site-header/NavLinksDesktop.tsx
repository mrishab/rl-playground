import { Link } from "react-router-dom";
import { NAV_LINKS } from "./navLinks";

type Props = {
  pathname: string;
};

export function NavLinksDesktop({ pathname }: Props) {
  return (
    <nav
      className="hidden md:flex items-center gap-1 ml-4"
      aria-label="Main Navigation"
    >
      {NAV_LINKS.map(({ to, label, icon: Icon, match }) => {
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
  );
}

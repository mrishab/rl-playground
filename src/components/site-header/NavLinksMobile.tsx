import { Link } from "react-router-dom";
import { NAV_LINKS } from "./navLinks";

type Props = {
  pathname: string;
};

export function NavLinksMobile({ pathname }: Props) {
  return (
    <div className="flex md:hidden items-center justify-around border-t px-2 py-1 bg-muted/40 overflow-x-auto">
      {NAV_LINKS.map(({ to, label, icon: Icon, match }) => {
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
  );
}

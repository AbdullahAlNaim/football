import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

export function SideNav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-24 hidden flex-col gap-3 self-start rounded-full bg-card p-3 lg:flex"
    >
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          title={label}
          className={({ isActive }) =>
            `flex h-12 w-12 items-center justify-center rounded-full transition ${
              isActive
                ? "bg-accent text-white shadow-lg shadow-accent/30"
                : "text-slate-400 hover:bg-card-hi hover:text-white"
            }`
          }
        >
          <Icon className="h-6 w-6" />
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

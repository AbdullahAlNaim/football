import type { ComponentType } from "react";
import { CalendarIcon, GridIcon, SearchIcon, ShieldIcon } from "../icons";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: GridIcon },
  { to: "/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/clubs", label: "Clubs", icon: SearchIcon },
  { to: "/teams", label: "Teams", icon: ShieldIcon },
];

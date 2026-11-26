import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Team } from "../api/types";

// Wrap any crest or club name in this to make it open that club's results page.
export function TeamLink({
  team,
  className = "",
  children,
}: {
  team: Team;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={`/clubs/${team.id}`}
      title={`${team.name}: results and stats`}
      className={`transition hover:opacity-80 ${className}`}
    >
      {children}
    </Link>
  );
}

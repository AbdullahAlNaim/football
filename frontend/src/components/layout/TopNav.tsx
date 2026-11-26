import { Link } from "react-router-dom";
import { BallIcon } from "../icons";
import { HealthDot } from "./HealthDot";

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 rounded-full bg-card py-1.5 pl-1.5 pr-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
            <BallIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold">Matchday</span>
        </Link>
        <HealthDot />
      </div>
    </header>
  );
}

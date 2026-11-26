import type { Match } from "../../api/types";
import { kickoffLabel, timeLabel } from "../../lib/dates";

// Compact "crest TLA v TLA crest / time" chip for a month-grid cell.
export function CalendarMatchChip({ match }: { match: Match }) {
  const { home_team: home, away_team: away } = match;

  return (
    <div
      className="rounded-lg bg-card px-1.5 py-1 text-[11px] leading-tight"
      title={`${home.name} vs ${away.name} · ${kickoffLabel(match.kickoff_utc)}`}
    >
      <div className="flex items-center gap-1">
        <img src={home.crest_url} alt="" className="h-4 w-4 shrink-0 object-contain" />
        <span className="hidden font-semibold text-white lg:inline">{home.tla}</span>
        <span className="text-slate-500">v</span>
        <span className="hidden font-semibold text-white lg:inline">{away.tla}</span>
        <img src={away.crest_url} alt="" className="h-4 w-4 shrink-0 object-contain" />
        <span className="sr-only">
          {home.name} vs {away.name}
        </span>
      </div>
      <div className="mt-0.5 text-slate-400">{timeLabel(match.kickoff_utc)}</div>
    </div>
  );
}

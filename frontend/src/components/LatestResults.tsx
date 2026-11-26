import { format, subDays } from "date-fns";
import type { Match, Team } from "../api/types";
import { useMatches } from "../hooks/useMatches";
import { toApiDate } from "../lib/dates";
import { stageLabel } from "../lib/labels";

const RESULTS_WINDOW_DAYS = 30;
const RESULTS_SHOWN = 5;

export function LatestResults() {
  const today = new Date();
  const { data = [], isPending, isError } = useMatches(
    toApiDate(subDays(today, RESULTS_WINDOW_DAYS)),
    toApiDate(today),
  );

  const results = data
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => b.kickoff_utc.localeCompare(a.kickoff_utc))
    .slice(0, RESULTS_SHOWN);

  return (
    <section className="space-y-4 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Latest Results</h2>

      {isPending &&
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-card-hi" />
        ))}

      {isError && <p className="py-6 text-center text-loss">Couldn't load results.</p>}

      {!isPending && !isError && results.length === 0 && (
        <p className="py-6 text-center text-slate-400">
          No results for your teams in the last {RESULTS_WINDOW_DAYS} days.
        </p>
      )}

      {results.map((match) => (
        <ResultCard key={match.id} match={match} />
      ))}
    </section>
  );
}

function ResultCard({ match }: { match: Match }) {
  const home = match.home_score ?? 0;
  const away = match.away_score ?? 0;

  return (
    <article className="rounded-2xl bg-card-hi/60 p-4 ring-1 ring-white/5">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{stageLabel(match.stage, match.matchday)}</span>
        <time dateTime={match.kickoff_utc}>{format(new Date(match.kickoff_utc), "EEE d MMM")}</time>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <ResultTeam team={match.home_team} won={home > away} />
        <span className="rounded-xl bg-card px-4 py-2 text-lg font-bold tabular-nums text-white">
          {home} - {away}
        </span>
        <ResultTeam team={match.away_team} won={away > home} />
      </div>
    </article>
  );
}

function ResultTeam({ team, won }: { team: Team; won: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <img src={team.crest_url} alt="" loading="lazy" className="h-12 w-12 object-contain" />
      <span className={`max-w-full truncate text-sm ${won ? "font-semibold text-white" : "text-slate-400"}`}>
        {team.short_name}
      </span>
    </div>
  );
}

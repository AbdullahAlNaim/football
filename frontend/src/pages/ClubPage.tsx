import { format } from "date-fns";
import { useParams, useSearchParams } from "react-router-dom";
import type { ClubMatch, ClubStats, FormResult, Team } from "../api/types";
import { ClubPicker } from "../components/club/ClubPicker";
import { FormDots } from "../components/FormDots";
import { TeamLink } from "../components/TeamLink";
import { useClubResults, useSeasons } from "../hooks/useClubs";
import { useFollowTeam } from "../hooks/useTeams";
import { seasonLabel, stageLabel } from "../lib/labels";

export function ClubPage() {
  const { teamId } = useParams();
  const [params, setParams] = useSearchParams();
  const { data: seasons } = useSeasons();

  const id = teamId ? Number(teamId) : undefined;
  const season = Number(params.get("season")) || seasons?.current;
  const { data, isPending, isError, error } = useClubResults(id, season);

  const setSeason = (value: number) =>
    setParams(value === seasons?.current ? {} : { season: String(value) });

  return (
    <div className="space-y-6">
      <ClubPicker currentId={id} />

      {id === undefined && (
        <p className="rounded-3xl bg-card p-10 text-center text-slate-400">
          Search for a club, or pick one of your teams, to see its results and stats.
        </p>
      )}

      {id !== undefined && isError && (
        <p className="rounded-3xl bg-card p-10 text-center text-loss">{error.message}</p>
      )}

      {id !== undefined && isPending && <div className="h-96 animate-pulse rounded-3xl bg-card" />}

      {data && (
        <>
          <ClubHeader
            team={data.team}
            season={data.season}
            seasons={seasons?.seasons ?? [data.season]}
            onSeasonChange={setSeason}
          />
          <StatsGrid stats={data.stats} />
          {data.upcoming.length > 0 && <Upcoming matches={data.upcoming} teamId={data.team.id} />}
          <Results matches={data.results} teamId={data.team.id} season={data.season} />
        </>
      )}
    </div>
  );
}

function ClubHeader({
  team,
  season,
  seasons,
  onSeasonChange,
}: {
  team: Team;
  season: number;
  seasons: number[];
  onSeasonChange: (season: number) => void;
}) {
  const follow = useFollowTeam();

  return (
    <section className="flex flex-wrap items-center gap-4 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
      <img src={team.crest_url} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold text-white sm:text-3xl">{team.short_name}</h1>
        <p className="truncate text-sm text-slate-400">{team.name} · UEFA Champions League</p>
      </div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="season">
          Season
        </label>
        <select
          id="season"
          value={season}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          className="rounded-full bg-card-hi px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {seasons.map((s) => (
            <option key={s} value={s}>
              {seasonLabel(s)}
            </option>
          ))}
        </select>
        <button
          onClick={() => follow.mutate({ id: team.id, isFollowed: !team.is_followed })}
          disabled={follow.isPending}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
            team.is_followed ? "bg-card-hi text-slate-200 hover:text-loss" : "bg-accent text-white hover:bg-accent/80"
          }`}
        >
          {team.is_followed ? "Following" : "Follow"}
        </button>
      </div>
    </section>
  );
}

function StatsGrid({ stats }: { stats: ClubStats }) {
  const cards: [string, string | number][] = [
    ["Played", stats.played],
    ["Won", stats.won],
    ["Drawn", stats.drawn],
    ["Lost", stats.lost],
    ["Goals", `${stats.goals_for}–${stats.goals_against}`],
    ["Goal diff.", stats.goal_difference > 0 ? `+${stats.goal_difference}` : stats.goal_difference],
    ["Clean sheets", stats.clean_sheets],
    ["Win rate", `${stats.win_rate}%`],
  ];

  return (
    <section className="space-y-4 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-card-hi/60 p-4 ring-1 ring-white/5">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">Last 5:</span>
        <FormDots form={stats.form} />
      </div>
    </section>
  );
}

function Upcoming({ matches, teamId }: { matches: ClubMatch[]; teamId: number }) {
  return (
    <section className="space-y-3 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Upcoming</h2>
      <ul className="space-y-2">
        {matches.map((m) => {
          const { opponent, isHome } = sides(m, teamId);
          return (
            <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-card-hi/60 p-3 ring-1 ring-white/5">
              <Opponent team={opponent} isHome={isHome} />
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {format(new Date(m.kickoff_utc), "EEE d MMM · h:mm a")}
                </p>
                <p className="text-xs text-slate-400">{stageLabel(m.stage, m.matchday)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Results({ matches, teamId, season }: { matches: ClubMatch[]; teamId: number; season: number }) {
  return (
    <section className="space-y-3 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
      <h2 className="text-lg font-semibold text-white">
        Results <span className="text-sm font-normal text-slate-400">· newest first</span>
      </h2>
      {matches.length === 0 ? (
        <p className="py-6 text-center text-slate-400">No results yet in {seasonLabel(season)}.</p>
      ) : (
        <ul className="space-y-2">
          {matches.map((m) => {
            const { opponent, isHome } = sides(m, teamId);
            const scored = isHome ? m.home_score : m.away_score;
            const conceded = isHome ? m.away_score : m.home_score;
            return (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-card-hi/60 p-3 ring-1 ring-white/5">
                <ResultBadge result={m.result} />
                <div className="min-w-0 flex-1">
                  <Opponent team={opponent} isHome={isHome} />
                  <p className="mt-0.5 text-xs text-slate-400">
                    {format(new Date(m.kickoff_utc), "EEE d MMM yyyy")} · {stageLabel(m.stage, m.matchday)}
                  </p>
                </div>
                <span className="text-lg font-bold tabular-nums text-white">
                  {scored} - {conceded}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Opponent({ team, isHome }: { team: Team; isHome: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
      <span className="w-5 shrink-0 text-slate-500">{isHome ? "vs" : "at"}</span>
      <TeamLink team={team} className="flex min-w-0 items-center gap-2">
        <img src={team.crest_url} alt="" className="h-6 w-6 shrink-0 object-contain" />
        <span className="truncate font-semibold text-white">{team.short_name}</span>
      </TeamLink>
    </div>
  );
}

const badgeStyles: Record<FormResult, string> = {
  W: "bg-win text-white",
  D: "bg-draw text-slate-900",
  L: "bg-loss text-white",
};

function ResultBadge({ result }: { result: FormResult | null }) {
  if (!result) return <span className="h-9 w-9 shrink-0" />;
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${badgeStyles[result]}`}
    >
      {result}
    </span>
  );
}

function sides(match: ClubMatch, teamId: number) {
  const isHome = match.home_team.id === teamId;
  return { isHome, opponent: isHome ? match.away_team : match.home_team };
}

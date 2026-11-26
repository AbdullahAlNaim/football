import type { Match, Team } from "../api/types";
import { useCountdown } from "../hooks/useCountdown";
import { kickoffLabel } from "../lib/dates";
import { stageLabel } from "../lib/labels";

export function FeaturedMatch({ match }: { match: Match }) {
  const upcoming = match.status === "SCHEDULED" || match.status === "TIMED";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
      <TeamSide team={match.home_team} />

      <div className="flex flex-col items-center gap-2 text-center sm:gap-3">
        <p className="text-sm font-semibold text-white sm:text-xl">UEFA Champions League</p>
        <p className="text-xs text-slate-400 sm:text-sm">{stageLabel(match.stage, match.matchday)}</p>
        <p className="text-xs text-slate-400 sm:text-sm">{kickoffLabel(match.kickoff_utc)}</p>
        {upcoming && <Countdown target={new Date(match.kickoff_utc)} />}
        <ScorePill match={match} upcoming={upcoming} />
      </div>

      <TeamSide team={match.away_team} />
    </div>
  );
}

function TeamSide({ team }: { team: Team }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center sm:gap-4">
      <img src={team.crest_url} alt="" className="h-14 w-14 object-contain sm:h-28 sm:w-28" />
      <span className="text-sm font-semibold text-white sm:text-2xl">
        <span className="sm:hidden">{team.tla}</span>
        <span className="hidden sm:inline">{team.short_name}</span>
      </span>
    </div>
  );
}

function Countdown({ target }: { target: Date }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  const pad = (n: number) => String(n).padStart(2, "0");
  const parts: [number, string][] = [
    [days, "Days"],
    [hours, "Hours"],
    [minutes, "Mins"],
    [seconds, "Sec"],
  ];

  return (
    <div
      className="flex gap-2 font-semibold tabular-nums text-white sm:gap-3 sm:text-lg"
      aria-label="Time until kickoff"
    >
      {parts.map(([value, label]) => (
        <div key={label} className="flex flex-col items-center">
          <span>{pad(value)}</span>
          <span className="text-[10px] font-normal text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  );
}

function ScorePill({ match, upcoming }: { match: Match; upcoming: boolean }) {
  let content: string;
  if (upcoming) content = "vs";
  else if (match.status === "POSTPONED" || match.status === "CANCELLED") content = "Postponed";
  else content = `${match.home_score ?? 0} - ${match.away_score ?? 0}`;

  return (
    <span className="rounded-2xl bg-card-hi px-6 py-2 text-xl font-bold text-white sm:px-8 sm:text-3xl">
      {content}
    </span>
  );
}

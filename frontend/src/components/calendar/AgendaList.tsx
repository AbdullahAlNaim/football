import { format, isSameMonth, isToday } from "date-fns";
import type { Match } from "../../api/types";
import { timeLabel, toApiDate } from "../../lib/dates";
import { stageLabel } from "../../lib/labels";

type Props = {
  days: Date[];
  month: Date;
  byDay: Map<string, Match[]>;
};

// Mobile version of the calendar: only the days that have matches, as a list.
export function AgendaList({ days, month, byDay }: Props) {
  const matchDays = days.filter((d) => isSameMonth(d, month) && byDay.has(toApiDate(d)));

  if (matchDays.length === 0) {
    return (
      <p className="rounded-3xl bg-card p-6 text-center text-slate-400">
        No matches for your teams this month.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {matchDays.map((day) => (
        <section key={toApiDate(day)} className="rounded-3xl bg-card p-4">
          <h2 className={`mb-3 text-sm font-semibold ${isToday(day) ? "text-accent" : "text-slate-300"}`}>
            {format(day, "EEEE d MMMM")}
            {isToday(day) && " · Today"}
          </h2>
          <div className="space-y-2">
            {(byDay.get(toApiDate(day)) ?? []).map((m) => (
              <AgendaRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AgendaRow({ match }: { match: Match }) {
  const { home_team: home, away_team: away } = match;
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-card-hi px-3 py-3">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <img src={home.crest_url} alt="" className="h-6 w-6 shrink-0 object-contain" />
        <span className="truncate font-semibold text-white">
          {home.short_name} <span className="font-normal text-slate-500">v</span> {away.short_name}
        </span>
        <img src={away.crest_url} alt="" className="h-6 w-6 shrink-0 object-contain" />
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-white">{timeLabel(match.kickoff_utc)}</p>
        <p className="text-[11px] text-slate-400">{stageLabel(match.stage, match.matchday)}</p>
      </div>
    </div>
  );
}

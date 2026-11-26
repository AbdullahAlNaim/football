import { addWeeks, endOfDay, isSameDay, isWithinInterval } from "date-fns";
import { useState } from "react";
import type { Match } from "../api/types";
import { useMatches } from "../hooks/useMatches";
import { kickoffLabel, startOfMatchWeek, toApiDate, weekDays } from "../lib/dates";
import { FeaturedMatch } from "./FeaturedMatch";
import { WeekStrip } from "./WeekStrip";

export function MatchdayCard() {
  const [weekStart, setWeekStart] = useState(() => startOfMatchWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = weekDays(weekStart);
  const { data: matches = [], isPending, isError } = useMatches(
    toApiDate(days[0]),
    toApiDate(days[6]),
  );

  const matchDays = new Set(matches.map((m) => toApiDate(new Date(m.kickoff_utc))));
  const day = selectedDay ?? pickDefaultDay(days, matches);
  const dayMatches = matches.filter((m) => isSameDay(new Date(m.kickoff_utc), day));

  const changeWeek = (offset: number) => {
    setWeekStart((current) => addWeeks(current, offset));
    setSelectedDay(null);
  };

  return (
    <section className="space-y-6 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
      <WeekStrip
        days={days}
        selected={day}
        matchDays={matchDays}
        onSelect={setSelectedDay}
        onPrev={() => changeWeek(-1)}
        onNext={() => changeWeek(1)}
      />

      {isPending && <div className="h-56 animate-pulse rounded-2xl bg-card-hi" />}

      {isError && <p className="py-10 text-center text-loss">Couldn't load matches.</p>}

      {!isPending && !isError && dayMatches.length === 0 && (
        <p className="py-10 text-center text-slate-400">
          {matchDays.size > 0
            ? "No match on this day. Pick a day with a blue dot."
            : "No matches for your teams this week."}
        </p>
      )}

      {dayMatches.length > 0 && (
        <>
          <FeaturedMatch match={dayMatches[0]} />
          {dayMatches.length > 1 && <AlsoToday matches={dayMatches.slice(1)} />}
        </>
      )}
    </section>
  );
}

function pickDefaultDay(days: Date[], matches: Match[]): Date {
  const today = new Date();
  const inThisWeek = isWithinInterval(today, { start: days[0], end: endOfDay(days[6]) });
  const matchDates = matches.map((m) => new Date(m.kickoff_utc));

  const nextMatch = matchDates.find((d) => d >= today) ?? matchDates[0];
  if (nextMatch) return nextMatch;
  return inThisWeek ? today : days[0];
}

function AlsoToday({ matches }: { matches: Match[] }) {
  return (
    <div className="space-y-2 border-t border-white/5 pt-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">Also on this day</p>
      {matches.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between rounded-xl bg-card-hi px-4 py-3 text-sm"
        >
          <span className="text-white">
            {m.home_team.short_name} v {m.away_team.short_name}
          </span>
          <span className="text-slate-400">{kickoffLabel(m.kickoff_utc)}</span>
        </div>
      ))}
    </div>
  );
}

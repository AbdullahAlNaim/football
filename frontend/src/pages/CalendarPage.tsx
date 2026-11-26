import { addMonths, format, startOfMonth } from "date-fns";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Team } from "../api/types";
import { AgendaList } from "../components/calendar/AgendaList";
import { MonthGrid } from "../components/calendar/MonthGrid";
import { TeamLink } from "../components/TeamLink";
import { useMatches } from "../hooks/useMatches";
import { useTeams } from "../hooks/useTeams";
import { monthGridDays, toApiDate } from "../lib/dates";
import { groupMatchesByDay } from "../lib/matches";

export function CalendarPage() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const days = monthGridDays(month);
  const { data: matches = [], isPending, isError } = useMatches(
    toApiDate(days[0]),
    toApiDate(days[days.length - 1]),
  );
  const { data: followed = [], isPending: teamsPending } = useTeams(true);
  const byDay = groupMatchesByDay(matches);

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-3 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
        <h1 className="text-xl font-semibold text-white sm:text-2xl">{format(month, "MMMM yyyy")}</h1>
        <div className="flex items-center gap-2">
          <NavButton label="Previous month" onClick={() => setMonth((m) => addMonths(m, -1))}>‹</NavButton>
          <button
            onClick={() => setMonth(startOfMonth(new Date()))}
            className="rounded-full bg-card-hi px-4 py-2 text-sm text-slate-200 hover:text-white"
          >
            Today
          </button>
          <NavButton label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))}>›</NavButton>
        </div>
      </section>

      <FollowedBar teams={followed} />

      {!teamsPending && followed.length === 0 ? null : (
        <>
          {isError && <p className="text-center text-loss">Couldn't load matches.</p>}
          {isPending && <div className="h-96 animate-pulse rounded-3xl bg-card" />}
          {!isPending && !isError && (
            <>
              <div className="hidden md:block">
                <MonthGrid days={days} month={month} byDay={byDay} />
              </div>
              <div className="md:hidden">
                <AgendaList days={days} month={month} byDay={byDay} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function FollowedBar({ teams }: { teams: Team[] }) {
  return (
    <section className="flex flex-wrap items-center gap-2 rounded-3xl bg-card p-4">
      {teams.length === 0 ? (
        <span className="text-sm text-slate-400">
          You're not following any teams yet, so there's nothing to show.
        </span>
      ) : (
        <>
          <span className="mr-1 text-sm text-slate-400">Showing:</span>
          {teams.map((t) => (
            <TeamLink
              key={t.id}
              team={t}
              className="flex items-center gap-2 rounded-full bg-card-hi py-1 pl-1 pr-3 text-sm text-white"
            >
              <img src={t.crest_url} alt="" className="h-6 w-6 object-contain" />
              {t.short_name}
            </TeamLink>
          ))}
        </>
      )}
      <Link
        to="/teams"
        className="ml-auto rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/80"
      >
        {teams.length === 0 ? "Pick teams" : "Manage teams"}
      </Link>
    </section>
  );
}

function NavButton({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-card-hi text-xl text-slate-300 hover:text-white"
    >
      {children}
    </button>
  );
}

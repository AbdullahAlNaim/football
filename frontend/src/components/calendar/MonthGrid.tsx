import { format, isSameMonth, isToday } from "date-fns";
import type { Match } from "../../api/types";
import { toApiDate } from "../../lib/dates";
import { CalendarMatchChip } from "./CalendarMatchChip";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  days: Date[];
  month: Date;
  byDay: Map<string, Match[]>;
};

export function MonthGrid({ days, month, byDay }: Props) {
  return (
    <section className="rounded-3xl bg-card p-4 shadow-lg shadow-black/30">
      <div className="grid grid-cols-7 gap-2 pb-2 text-center text-xs font-medium text-slate-400">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = toApiDate(day);
          const dayMatches = byDay.get(key) ?? [];
          const inMonth = isSameMonth(day, month);
          const today = isToday(day);

          return (
            <div
              key={key}
              className={`min-h-28 rounded-2xl p-2 ${inMonth ? "bg-card-hi/50" : "opacity-40"} ${
                dayMatches.length > 0 ? "ring-1 ring-accent/40" : ""
              }`}
            >
              <div
                className={`mb-1 text-xs font-semibold ${
                  today
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"
                    : "text-slate-400"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayMatches.map((m) => (
                  <CalendarMatchChip key={m.id} match={m} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

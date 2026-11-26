import { format, isSameDay } from "date-fns";
import { toApiDate } from "../lib/dates";

type Props = {
  days: Date[];
  selected: Date;
  matchDays: Set<string>;
  onSelect: (day: Date) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function WeekStrip({ days, selected, matchDays, onSelect, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center gap-2">
      <ArrowButton label="Previous week" onClick={onPrev}>‹</ArrowButton>

      <div className="grid flex-1 grid-cols-7 gap-1">
        {days.map((day) => {
          const active = isSameDay(day, selected);
          const hasMatch = matchDays.has(toApiDate(day));
          return (
            <button
              key={toApiDate(day)}
              onClick={() => onSelect(day)}
              aria-pressed={active}
              className={`flex flex-col items-center rounded-2xl py-2 text-xs transition sm:text-sm ${
                active ? "bg-card-hi text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{format(day, "EEE")}</span>
              <span className="font-semibold sm:hidden">{format(day, "d")}</span>
              <span className="hidden font-semibold sm:inline">{format(day, "d MMM")}</span>
              <span
                className={`mt-1 h-1.5 w-1.5 rounded-full ${hasMatch ? "bg-accent" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>

      <ArrowButton label="Next week" onClick={onNext}>›</ArrowButton>
    </div>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card-hi text-xl text-slate-300 hover:text-white"
    >
      {children}
    </button>
  );
}

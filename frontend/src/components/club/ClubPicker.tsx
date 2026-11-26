import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Team } from "../../api/types";
import { useTeams } from "../../hooks/useTeams";
import { TeamLink } from "../TeamLink";

const MAX_SUGGESTIONS = 8;

// Search box with suggestions, plus one-click chips for the teams you follow.
export function ClubPicker({ currentId }: { currentId?: number }) {
  const { data: teams = [] } = useTeams();
  const { data: followed = [] } = useTeams(true);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const suggestions = q
    ? teams
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.short_name.toLowerCase().includes(q) ||
            t.tla.toLowerCase().includes(q),
        )
        .slice(0, MAX_SUGGESTIONS)
    : [];

  const pick = (team: Team) => {
    setQuery("");
    setOpen(false);
    navigate(`/clubs/${team.id}`);
  };

  return (
    <section className="space-y-4 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
      <div className="relative">
        <input
          type="search"
          role="combobox"
          aria-expanded={open && q.length > 0}
          aria-controls="club-suggestions"
          aria-label="Search for a club"
          placeholder="Search for a club…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions[0]) pick(suggestions[0]);
            if (e.key === "Escape") setOpen(false);
          }}
          className="w-full rounded-2xl bg-card-hi px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {open && q && (
          <ul
            id="club-suggestions"
            role="listbox"
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-card-hi shadow-xl ring-1 ring-white/10"
          >
            {suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400">No clubs found.</li>
            ) : (
              suggestions.map((t) => (
                <li key={t.id} role="option" aria-selected={false}>
                  <button
                    // preventDefault keeps the input focused, so the list doesn't close before the click lands.
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(t)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-card"
                  >
                    <img src={t.crest_url} alt="" className="h-7 w-7 object-contain" />
                    <span className="font-semibold text-white">{t.short_name}</span>
                    <span className="truncate text-sm text-slate-400">{t.name}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {followed.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-slate-400">Your teams:</span>
          {followed.map((t) => (
            <TeamLink
              key={t.id}
              team={t}
              className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm ${
                t.id === currentId ? "bg-accent text-white" : "bg-card-hi text-white"
              }`}
            >
              <img src={t.crest_url} alt="" className="h-6 w-6 object-contain" />
              {t.short_name}
            </TeamLink>
          ))}
        </div>
      )}
    </section>
  );
}

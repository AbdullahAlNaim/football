import { useState } from "react";
import type { Team } from "../api/types";
import { useFollowTeam, useTeams } from "../hooks/useTeams";

export function TeamsPage() {
  const { data: teams = [], isPending, isError } = useTeams();
  const follow = useFollowTeam();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = teams.filter(
    (t) =>
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.short_name.toLowerCase().includes(q) ||
      t.tla.toLowerCase().includes(q),
  );
  const followed = visible.filter((t) => t.is_followed);
  const others = visible.filter((t) => !t.is_followed);
  const pendingId = follow.isPending ? follow.variables?.id : undefined;

  const toggle = (team: Team) => follow.mutate({ id: team.id, isFollowed: !team.is_followed });

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-3xl bg-card p-4 shadow-lg shadow-black/30 sm:p-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Teams</h1>
          <p className="mt-1 text-sm text-slate-400">
            Follow the clubs you want on your calendar and dashboard.
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clubs…"
          aria-label="Search clubs"
          className="w-full rounded-2xl bg-card-hi px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {follow.isError && (
          <p className="text-sm text-loss">{follow.error.message}. Is the backend running?</p>
        )}
      </section>

      {isPending && <div className="h-64 animate-pulse rounded-3xl bg-card" />}
      {isError && <p className="text-center text-loss">Couldn't load teams.</p>}

      {!isPending && !isError && (
        <>
          <TeamGroup
            title={`Following (${followed.length})`}
            empty="You're not following any teams yet. Pick some below."
            teams={followed}
            pendingId={pendingId}
            onToggle={toggle}
          />
          <TeamGroup
            title="All Champions League clubs"
            empty={q ? "No clubs match your search." : "No clubs yet. Run sync_fixtures."}
            teams={others}
            pendingId={pendingId}
            onToggle={toggle}
          />
        </>
      )}
    </div>
  );
}

type GroupProps = {
  title: string;
  empty: string;
  teams: Team[];
  pendingId: number | undefined;
  onToggle: (team: Team) => void;
};

function TeamGroup({ title, empty, teams, pendingId, onToggle }: GroupProps) {
  return (
    <section className="space-y-3">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
      {teams.length === 0 ? (
        <p className="rounded-3xl bg-card p-6 text-center text-slate-400">{empty}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              pending={pendingId === team.id}
              onToggle={() => onToggle(team)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TeamCard({ team, pending, onToggle }: { team: Team; pending: boolean; onToggle: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 ring-1 transition ${
        team.is_followed ? "bg-accent/10 ring-accent/40" : "bg-card ring-white/5"
      }`}
    >
      <img src={team.crest_url} alt="" loading="lazy" className="h-10 w-10 shrink-0 object-contain" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{team.short_name}</p>
        <p className="truncate text-xs text-slate-400">{team.name}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={pending}
        aria-pressed={team.is_followed}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
          team.is_followed
            ? "bg-card-hi text-slate-200 hover:bg-loss/20 hover:text-loss"
            : "bg-accent text-white hover:bg-accent/80"
        }`}
      >
        {pending ? "…" : team.is_followed ? "Following" : "Follow"}
      </button>
    </div>
  );
}

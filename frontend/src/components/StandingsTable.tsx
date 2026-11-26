import { useStandings } from "../hooks/useStandings";
import { FormDots } from "./FormDots";

export function StandingsTable() {
  const { data, isPending, isError, error } = useStandings();

  return (
    <section className="rounded-3xl bg-card p-4 sm:p-6 shadow-lg shadow-black/30">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Champions League Table</h2>
        <span className="rounded-full bg-card-hi px-4 py-1.5 text-sm text-slate-300">
          2026/27
        </span>
      </header>

      {isPending && <TableSkeleton />}

      {isError && (
        <p className="py-8 text-center text-loss">Couldn't load the table: {error.message}</p>
      )}

      {data && data.length === 0 && (
        <p className="py-8 text-center text-slate-400">No standings yet. Run sync_fixtures.</p>
      )}

      {data && data.length > 0 && (
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-sm tabular-nums">
            <thead className="sticky top-0 bg-card text-left text-slate-400">
              <tr>
                <th className="py-3 pr-2 font-medium">#</th>
                <th className="py-3 pr-2 font-medium">Club</th>
                <th className="py-3 px-2 text-center font-medium">Pts</th>
                <th className="hidden py-3 px-2 text-center font-medium sm:table-cell">W</th>
                <th className="hidden py-3 px-2 text-center font-medium sm:table-cell">D</th>
                <th className="hidden py-3 px-2 text-center font-medium sm:table-cell">L</th>
                <th className="hidden py-3 px-2 text-center font-medium md:table-cell">GF</th>
                <th className="hidden py-3 px-2 text-center font-medium md:table-cell">GA</th>
                <th className="py-3 pl-2 font-medium">Last 3</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.team.id}
                  className={`border-t border-white/5 ${row.team.is_followed ? "bg-accent/10" : ""}`}
                >
                  <td className="py-3 pr-2 text-slate-300">{row.position}</td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.team.crest_url}
                        alt=""
                        loading="lazy"
                        className="h-7 w-7 object-contain"
                      />
                      <span className="text-white">
                        <span className="sm:hidden">{row.team.tla}</span>
                        <span className="hidden sm:inline">{row.team.short_name}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-white">{row.points}</td>
                  <td className="hidden py-3 px-2 text-center text-slate-300 sm:table-cell">{row.won}</td>
                  <td className="hidden py-3 px-2 text-center text-slate-300 sm:table-cell">{row.draw}</td>
                  <td className="hidden py-3 px-2 text-center text-slate-300 sm:table-cell">{row.lost}</td>
                  <td className="hidden py-3 px-2 text-center text-slate-300 md:table-cell">{row.goals_for}</td>
                  <td className="hidden py-3 px-2 text-center text-slate-300 md:table-cell">{row.goals_against}</td>
                  <td className="py-3 pl-2">
                    <FormDots form={row.form} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-card-hi" />
      ))}
    </div>
  );
}
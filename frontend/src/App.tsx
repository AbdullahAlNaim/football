import { useHealth } from "./hooks/useHealth";
import { StandingsTable } from "./components/StandingsTable";
import { MatchdayCard } from "./components/MatchdayCard";

export default function App() {
  const { data, isPending, isError, error } = useHealth();

  return (
    <main className="min-h-screen bg-bg p-4 text-white sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-card p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Matchday</h1>

          {isPending && <p>Checking backend…</p>}

          {isError && (
            <p className="text-red-600">Backend unreachable: {error.message}</p>
          )}

          {data && (
            <p className="text-green-600">
              API: {data.status} · Database: {data.database ? "connected" : "down"}
            </p>
          )}

        </div>

        <MatchdayCard />
        <StandingsTable />
      </div>
    </main>
  );
}
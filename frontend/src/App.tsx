import { useHealth } from "./hooks/useHealth";

export default function App() {
  const { data, isPending, isError, error } = useHealth();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-xl border p-6 text-center">
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
    </main>
  );
}
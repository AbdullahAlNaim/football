export type HealthResponse = {
  status: "ok" | "degraded";
  database: boolean;
  time: string;
};

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch("/api/v1/health/");
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json();
}
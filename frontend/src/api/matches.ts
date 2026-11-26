import type { Match } from "./types";

export async function fetchMatches(from: string, to: string, followed = true): Promise<Match[]> {
  const params = new URLSearchParams({ from, to });
  if (followed) params.set("followed", "true");

  const res = await fetch(`/api/v1/matches/?${params}`);
  if (!res.ok) {
    throw new Error(`Matches request failed: ${res.status}`);
  }
  return res.json();
}

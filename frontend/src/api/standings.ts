import type { Standing } from "./types";

export async function fetchStandings(): Promise<Standing[]> {
  const res = await fetch("/api/v1/standings/");
  if (!res.ok) {
    throw new Error(`Standings request failed: ${res.status}`);
  }
  return res.json();
}
import type { ClubResults, Seasons } from "./types";

export async function fetchClubResults(teamId: number, season: number): Promise<ClubResults> {
  const res = await fetch(`/api/v1/teams/${teamId}/results/?season=${season}`);
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Club not found" : `Club request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchSeasons(): Promise<Seasons> {
  const res = await fetch("/api/v1/seasons/");
  if (!res.ok) {
    throw new Error(`Seasons request failed: ${res.status}`);
  }
  return res.json();
}

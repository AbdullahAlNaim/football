import type { Team } from "./types";

export async function fetchTeams(followedOnly = false): Promise<Team[]> {
  const res = await fetch(`/api/v1/teams/${followedOnly ? "?followed=true" : ""}`);
  if (!res.ok) {
    throw new Error(`Teams request failed: ${res.status}`);
  }
  return res.json();
}

export async function setTeamFollowed(id: number, isFollowed: boolean): Promise<Team> {
  const res = await fetch(`/api/v1/teams/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_followed: isFollowed }),
  });
  if (!res.ok) {
    throw new Error(`Couldn't update team: ${res.status}`);
  }
  return res.json();
}

import type { Team } from "./types";

export async function fetchTeams(followedOnly = false, currentSeasonOnly = false): Promise<Team[]> {
  const params = new URLSearchParams();
  if (followedOnly) params.set("followed", "true");
  if (currentSeasonOnly) params.set("season", "current");
  const query = params.toString();

  const res = await fetch(`/api/v1/teams/${query ? `?${query}` : ""}`);
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

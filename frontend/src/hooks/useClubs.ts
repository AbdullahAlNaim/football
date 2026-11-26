import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchClubResults, fetchSeasons } from "../api/clubs";

export function useClubResults(teamId: number | undefined, season: number | undefined) {
  return useQuery({
    queryKey: ["club", teamId, season],
    queryFn: () => fetchClubResults(teamId!, season!),
    enabled: teamId !== undefined && season !== undefined,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useSeasons() {
  return useQuery({
    queryKey: ["seasons"],
    queryFn: fetchSeasons,
    staleTime: 60 * 60 * 1000,
  });
}

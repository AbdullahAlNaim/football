import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMatches } from "../api/matches";

export function useMatches(from: string, to: string, followed = true) {
  return useQuery({
    queryKey: ["matches", { from, to, followed }],
    queryFn: () => fetchMatches(from, to, followed),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

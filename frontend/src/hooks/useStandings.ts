import { useQuery } from "@tanstack/react-query";
import { fetchStandings } from "../api/standings";

export function useStandings() {
  return useQuery({
    queryKey: ["standings"],
    queryFn: fetchStandings,
    staleTime: 5 * 60 * 1000,
  });
}
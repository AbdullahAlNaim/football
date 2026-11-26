import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTeams, setTeamFollowed } from "../api/teams";

export function useTeams(followedOnly = false, currentSeasonOnly = false) {
  return useQuery({
    queryKey: ["teams", { followedOnly, currentSeasonOnly }],
    queryFn: () => fetchTeams(followedOnly, currentSeasonOnly),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFollowTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFollowed }: { id: number; isFollowed: boolean }) =>
      setTeamFollowed(id, isFollowed),
    // Following a team changes which matches and highlights every page shows,
    // so mark all of that cached data as stale and let it refetch.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      queryClient.invalidateQueries({ queryKey: ["club"] });
    },
  });
}

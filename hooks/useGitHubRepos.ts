import { useQuery } from "@tanstack/react-query";
import { fetchUserRepos } from "../lib/github/api";
import { useAuthStore } from "../stores/authStore";

export function useGitHubRepos() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["github-repos", accessToken],
    queryFn: () => fetchUserRepos(accessToken!),
    enabled: !!accessToken,
    staleTime: 60_000,
  });
}

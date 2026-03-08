import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { MediaCardData } from "@/types/cinematch";

export function useWatchlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user!.id)
        .order("added_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: async (movie: MediaCardData) => {
      const { error } = await supabase.from("watchlist").insert({
        user_id: user!.id,
        imdb_id: movie.imdbID,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
        rating: movie.rating,
        genres: movie.genres,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (imdbId: string) => {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user!.id)
        .eq("imdb_id", imdbId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });

  const isInWatchlist = (imdbId: string) =>
    watchlistQuery.data?.some((item) => item.imdb_id === imdbId) ?? false;

  return {
    watchlist: watchlistQuery.data ?? [],
    isLoading: watchlistQuery.isLoading,
    addToWatchlist: addMutation.mutate,
    removeFromWatchlist: removeMutation.mutate,
    isInWatchlist,
    isAdding: addMutation.isPending,
  };
}

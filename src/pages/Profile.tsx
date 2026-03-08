import { useQuery } from "@tanstack/react-query";
import { Bookmark, Clock, LogOut, Trash2, User } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useWatchlist } from "@/hooks/use-watchlist";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { user, signOut, loading: authLoading } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(user),
  });

  const quizQuery = useQuery({
    queryKey: ["quiz-results", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: Boolean(user),
  });

  const { watchlist, removeFromWatchlist } = useWatchlist();

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  const profile = profileQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container space-y-8 pt-14 pb-12 sm:pt-16 lg:pt-18">
        {/* Profile header */}
        <section className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/20">
              <User className="size-7 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-foreground">{profile?.display_name || "Movie Fan"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button onClick={signOut} variant="heroSecondary" size="sm" className="ml-auto">
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </section>

        {/* Quiz results */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Your Quiz History</h2>
          </div>
          {quizQuery.data?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quizQuery.data.map((result) => (
                <div key={result.id} className="rounded-lg bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.created_at).toLocaleDateString()}
                    </span>
                    {result.match_score && (
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                        {result.match_score}% Match
                      </span>
                    )}
                  </div>
                  {result.top_movie_poster && (
                    <img src={result.top_movie_poster} alt="" className="w-full aspect-[2/3] object-cover rounded" />
                  )}
                  <p className="text-sm font-semibold text-foreground">{result.top_movie_title || "Quiz completed"}</p>
                  {result.top_movie_imdb_id && (
                    <Link to={`/movie/${result.top_movie_imdb_id}`} className="text-xs text-primary hover:underline">
                      View Details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">No quiz results yet.</p>
              <Button asChild variant="hero" size="sm" className="mt-3">
                <Link to="/quiz">Take the Quiz</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Watchlist */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bookmark className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Your Watchlist</h2>
          </div>
          {watchlist.length ? (
            <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {watchlist.map((item) => (
                <div key={item.id} className="relative group">
                  <CineMovieCard
                    item={{
                      imdbID: item.imdb_id,
                      title: item.title,
                      poster: item.poster || "/placeholder.svg",
                      year: item.year || "",
                      rating: item.rating || "N/A",
                      genres: item.genres || [],
                      overview: "",
                      language: "en",
                      type: "movie",
                    }}
                  />
                  <button
                    onClick={() => removeFromWatchlist(item.imdb_id)}
                    className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1.5 text-destructive opacity-0 transition group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Remove"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">Your watchlist is empty.</p>
              <Button asChild variant="hero" size="sm" className="mt-3">
                <Link to="/browse">Browse Movies</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
      <DNAFooter />
    </div>
  );
};

export default ProfilePage;

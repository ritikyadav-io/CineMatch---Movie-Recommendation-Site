import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { TMDB_ACTRESSES } from "@/pages/Actresses";

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
}

async function fetchActressMovies(id: number): Promise<{ name: string; profile_path: string | null; movies: MovieItem[] }> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-proxy`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint: `/person/${id}`, params: { append_to_response: "movie_credits" } }),
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  const movies = (data.movie_credits?.cast || [])
    .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 12)
    .map((m: any) => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      release_date: m.release_date,
      vote_average: m.vote_average,
    }));
  return { name: data.name, profile_path: data.profile_path, movies };
}

const ActressDetailPage = () => {
  const { actressId } = useParams();
  const navigate = useNavigate();
  const numId = Number(actressId);
  const staticData = TMDB_ACTRESSES.find((a) => a.id === numId);

  const query = useQuery({
    queryKey: ["actress-detail", numId],
    queryFn: () => fetchActressMovies(numId),
    staleTime: 1000 * 60 * 60,
    enabled: !!numId,
  });

  const name = query.data?.name || staticData?.name || "Actress";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      <main className="container pt-16 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/actresses")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Back to Actresses
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {(query.data?.profile_path || staticData?.img) && (
            <div className="size-16 sm:size-20 overflow-hidden rounded-full bg-muted shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w185${query.data?.profile_path || staticData?.img}`}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Filmography</span>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground">{name}</h1>
            <p className="text-xs text-muted-foreground">Top movies sorted by popularity</p>
          </div>
        </div>

        {query.isLoading ? (
          <div className="flex items-center gap-2 py-16 text-muted-foreground text-xs">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading movies...
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {(query.data?.movies || []).map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/tmdb-${movie.id}`}
                className="group relative overflow-hidden rounded-md bg-card transition-all duration-200 hover:scale-[1.03] hover:ring-1 hover:ring-muted-foreground/30"
              >
                <div className="aspect-[2/3] bg-muted">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground text-[10px]">No Poster</div>
                  )}
                </div>
                <div className="p-1.5 sm:p-2 space-y-0.5">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-foreground line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] text-muted-foreground">
                    {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
                    {movie.vote_average ? <span>⭐ {movie.vote_average.toFixed(1)}</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default ActressDetailPage;

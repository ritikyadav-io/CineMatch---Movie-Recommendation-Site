import { useQuery } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";

const TMDB_ACTRESSES = [
  { id: 90633, name: "Gal Gadot" },
  { id: 1245, name: "Scarlett Johansson" },
  { id: 224513, name: "Ana de Armas" },
  { id: 1397778, name: "Zendaya" },
  { id: 115440, name: "Sydney Sweeney" },
  { id: 71580, name: "Florence Pugh" },
  { id: 54693, name: "Emma Stone" },
  { id: 1813, name: "Anne Hathaway" },
  { id: 6885, name: "Charlize Theron" },
  { id: 18050, name: "Natalie Portman" },
  { id: 112, name: "Cate Blanchett" },
  { id: 1245982, name: "Margot Robbie" },
  { id: 5064, name: "Meryl Streep" },
  { id: 8691, name: "Zoe Saldana" },
  { id: 17018, name: "Angelina Jolie" },
  { id: 72129, name: "Jennifer Lawrence" },
  { id: 9780, name: "Dakota Johnson" },
  { id: 234352, name: "Margot Robbie" },
  { id: 1283, name: "Helena Bonham Carter" },
  { id: 205, name: "Kirsten Dunst" },
  { id: 36662, name: "Emilia Clarke" },
  { id: 1373737, name: "Florence Pugh" },
  { id: 974169, name: "Jenna Ortega" },
  { id: 1903874, name: "Anya Taylor-Joy" },
].filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)
  .sort((a, b) => a.name.localeCompare(b.name));

interface ActressDetail {
  id: number;
  name: string;
  profile_path: string | null;
  known_for: { id: number; title?: string; name?: string; poster_path: string | null; media_type: string }[];
}

async function fetchActressDetails(id: number): Promise<ActressDetail | null> {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-proxy?path=/person/${id}&append_to_response=movie_credits`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const topMovies = (data.movie_credits?.cast || [])
      .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6)
      .map((m: any) => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        media_type: "movie",
      }));
    return {
      id: data.id,
      name: data.name,
      profile_path: data.profile_path,
      known_for: topMovies,
    };
  } catch {
    return null;
  }
}

const ActressesPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const allQuery = useQuery({
    queryKey: ["actresses-list"],
    queryFn: async () => {
      const results = await Promise.all(TMDB_ACTRESSES.map((a) => fetchActressDetails(a.id)));
      return results.filter(Boolean) as ActressDetail[];
    },
    staleTime: 1000 * 60 * 60,
  });

  const selected = allQuery.data?.find((a) => a.id === selectedId) || null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      <main className="container pt-16 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6">
        <div className="space-y-1 mb-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">A to Z</span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground">Famous Actresses</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Tap an actress to see her top movies.</p>
        </div>

        {allQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground text-xs">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading actresses...
          </div>
        ) : (
          <>
            {/* Actress Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {allQuery.data?.map((actress) => (
                <button
                  key={actress.id}
                  onClick={() => setSelectedId(actress.id === selectedId ? null : actress.id)}
                  className={[
                    "group relative flex flex-col items-center gap-1.5 rounded-lg p-2 sm:p-3 transition-all duration-200",
                    selectedId === actress.id
                      ? "bg-primary/20 ring-1 ring-primary"
                      : "bg-card hover:bg-muted",
                  ].join(" ")}
                >
                  <div className="relative size-16 sm:size-20 md:size-24 overflow-hidden rounded-full bg-muted">
                    {actress.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actress.profile_path}`}
                        alt={actress.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Star className="size-6" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center line-clamp-2 leading-tight">
                    {actress.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Actress Movies */}
            {selected && (
              <section className="mt-6 space-y-3 animate-fade-in">
                <h2 className="text-sm sm:text-lg font-bold text-foreground">
                  Top Movies by <span className="text-primary">{selected.name}</span>
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {selected.known_for.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/tmdb-${movie.id}`}
                      className="group relative overflow-hidden rounded-md bg-card transition-all duration-200 hover:scale-[1.03] hover:ring-1 hover:ring-muted-foreground/30"
                    >
                      <div className="aspect-[2/3] bg-muted">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                            alt={movie.title || movie.name || ""}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">No Poster</div>
                        )}
                      </div>
                      <div className="p-1.5 sm:p-2">
                        <h3 className="text-[10px] sm:text-xs font-semibold text-foreground line-clamp-2">
                          {movie.title || movie.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default ActressesPage;

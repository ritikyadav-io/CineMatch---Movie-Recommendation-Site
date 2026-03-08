import { useQuery } from "@tanstack/react-query";
import { Loader2, Star, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";

const TMDB_ACTRESSES = [
  { id: 90633, name: "Gal Gadot", img: "/fBJducGBcmrcIOQdhm4t0A2nEMj.jpg" },
  { id: 1245, name: "Scarlett Johansson", img: "/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg" },
  { id: 224513, name: "Ana de Armas", img: "/3vxvsmYLTf4jnr163SUlBIw51ee.jpg" },
  { id: 1397778, name: "Zendaya", img: "/bGlpMpESnMOGiQIlIGGaoSMaHSH.jpg" },
  { id: 115440, name: "Sydney Sweeney", img: "/qYiaSl0Eb7G3VaxOg8PQe5RMkFe.jpg" },
  { id: 71580, name: "Florence Pugh", img: "/6FBy4YNQB3pKEHx4F0bSAGasMH0.jpg" },
  { id: 54693, name: "Emma Stone", img: "/2hwXbPW2ffnXUe1Um0WXHG0cTwb.jpg" },
  { id: 1813, name: "Anne Hathaway", img: "/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg" },
  { id: 6885, name: "Charlize Theron", img: "/1HroTIIuk0Eo0DSLo5DXKM7BXjP.jpg" },
  { id: 18050, name: "Natalie Portman", img: "/edPU5HxncLWa1YkgRPNkSd0ydTe.jpg" },
  { id: 112, name: "Cate Blanchett", img: "/vUuoHy7Ht2JOFtGjFyRaJyP7FPj.jpg" },
  { id: 1245982, name: "Margot Robbie", img: "/euDPyqLnuwaWMHR6JN0sWUiV2LH.jpg" },
  { id: 5064, name: "Meryl Streep", img: "/emAAzyK1LmzdN8EMEpx0Bqp2tOo.jpg" },
  { id: 8691, name: "Zoe Saldana", img: "/iOVbUH20il632nj2v01NCtYYeSg.jpg" },
  { id: 17018, name: "Angelina Jolie", img: "/gEEFaMaIPiJdNdXJERMiWnCilHn.jpg" },
  { id: 72129, name: "Jennifer Lawrence", img: "/mDLDCKaEhDCMFBquThPHRE3oTqN.jpg" },
  { id: 9780, name: "Dakota Johnson", img: "/pHBhEkXWhXgFKMRGEPa1uJQJIZr.jpg" },
  { id: 1283, name: "Helena Bonham Carter", img: "/mSmMKIFCCvPJJyEmWiDVRVbpHbO.jpg" },
  { id: 205, name: "Kirsten Dunst", img: "/5EaylWJNhBOhVPHtCwPT7v7z1Cu.jpg" },
  { id: 36662, name: "Emilia Clarke", img: "/j7d083zIMAALMXMgjkVGgHGif0C.jpg" },
  { id: 974169, name: "Jenna Ortega", img: "/q1NRzyZQlYkjXjhgnc2UGAmwIOC.jpg" },
  { id: 1903874, name: "Anya Taylor-Joy", img: "/yZpghhtSim0VIHJlAIBhtYpBxef.jpg" },
].sort((a, b) => a.name.localeCompare(b.name));

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;
}

async function fetchActressMovies(id: number): Promise<MovieItem[]> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-proxy`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint: `/person/${id}`, params: { append_to_response: "movie_credits" } }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.movie_credits?.cast || [])
    .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 8)
    .map((m: any) => ({ id: m.id, title: m.title, poster_path: m.poster_path }));
}

const ActressesPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const moviesQuery = useQuery({
    queryKey: ["actress-movies", selectedId],
    queryFn: () => fetchActressMovies(selectedId!),
    enabled: !!selectedId,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      <main className="container pt-16 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6">
        <div className="space-y-1 mb-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">A to Z</span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground">Famous Actresses</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Tap an actress to see her top movies.</p>
        </div>

        {/* Actress Grid — instant, no loading */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {TMDB_ACTRESSES.map((actress) => (
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
                <img
                  src={`https://image.tmdb.org/t/p/w185${actress.img}`}
                  alt={actress.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center line-clamp-2 leading-tight">
                {actress.name}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Actress Movies — fetched on click */}
        {selectedId && (
          <section className="mt-6 space-y-3 animate-fade-in">
            <h2 className="text-sm sm:text-lg font-bold text-foreground">
              Top Movies by <span className="text-primary">{TMDB_ACTRESSES.find((a) => a.id === selectedId)?.name}</span>
            </h2>
            {moviesQuery.isLoading ? (
              <div className="flex items-center gap-2 py-8 text-muted-foreground text-xs">
                <Loader2 className="size-4 animate-spin text-primary" />
                Loading movies...
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {(moviesQuery.data || []).map((movie) => (
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
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">No Poster</div>
                      )}
                    </div>
                    <div className="p-1.5 sm:p-2">
                      <h3 className="text-[10px] sm:text-xs font-semibold text-foreground line-clamp-2">
                        {movie.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default ActressesPage;

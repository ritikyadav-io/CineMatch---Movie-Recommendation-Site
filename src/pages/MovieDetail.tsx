import { useQuery } from "@tanstack/react-query";
import { Loader2, PlayCircle, Tv } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import { getRelatedCatalogEntries } from "@/data/cinematchCatalog";
import { fetchOmdbBatch, fetchOmdbTitle, getTrailerSearchUrl, getWatchSearchUrl } from "@/lib/omdb";

const MovieDetailPage = () => {
  const { imdbID = "" } = useParams();
  const detailQuery = useQuery({ queryKey: ["movie", imdbID], queryFn: () => fetchOmdbTitle(imdbID), enabled: Boolean(imdbID), staleTime: 1000 * 60 * 60 });
  const relatedIds = getRelatedCatalogEntries(imdbID, 5).map((item) => item.imdbID);
  const relatedQuery = useQuery({ queryKey: ["movie", imdbID, "related"], queryFn: () => fetchOmdbBatch(relatedIds), enabled: relatedIds.length > 0, staleTime: 1000 * 60 * 60 });

  if (detailQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <CineMatchNav />
        <main className="container py-24">
          <div className="section-shell flex items-center justify-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            Loading movie details...
          </div>
        </main>
      </div>
    );
  }

  if (!detailQuery.data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <CineMatchNav />
        <main className="container py-24">
          <div className="section-shell py-16 text-center text-muted-foreground">We couldn’t load that title right now.</div>
        </main>
      </div>
    );
  }

  const movie = detailQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CineMatchNav />
      <main className="container space-y-10 py-12 lg:space-y-14 lg:py-16">
        <section className="grid gap-8 section-shell lg:grid-cols-[0.38fr_0.62fr]">
          <img src={movie.poster} alt={`${movie.title} poster`} className="w-full rounded-[1.8rem] border border-border/70 object-cover shadow-poster" loading="eager" />
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-primary">{movie.type === "series" ? "Series detail" : "Movie detail"}</p>
              <h1 className="font-display text-5xl uppercase tracking-[0.08em] sm:text-6xl">{movie.title}</h1>
              <p className="max-w-3xl text-muted-foreground">{movie.overview}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-border bg-secondary px-4 py-2">{movie.year}</span>
              <span className="rounded-full border border-border bg-secondary px-4 py-2">IMDb {movie.rating}</span>
              {movie.runtime && <span className="rounded-full border border-border bg-secondary px-4 py-2">{movie.runtime}</span>}
              <span className="rounded-full border border-border bg-secondary px-4 py-2">{movie.language}</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Genres</h2>
              <div className="flex flex-wrap gap-3">
                {movie.genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">{genre}</span>
                ))}
              </div>
            </div>

            {movie.actors?.length ? (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Cast</h2>
                <p className="text-muted-foreground">{movie.actors.join(" • ")}</p>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <a href={getTrailerSearchUrl(movie.title, movie.year)} target="_blank" rel="noreferrer" className="section-shell flex items-center justify-between gap-4 p-5 transition duration-300 hover:border-primary/40 hover:bg-secondary/70">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-primary">Trailer</p>
                  <p className="mt-2 text-lg font-semibold">Watch trailer</p>
                </div>
                <PlayCircle className="size-6 text-primary" />
              </a>
              <a href={getWatchSearchUrl(movie.title, movie.year)} target="_blank" rel="noreferrer" className="section-shell flex items-center justify-between gap-4 p-5 transition duration-300 hover:border-primary/40 hover:bg-secondary/70">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-primary">Where to Watch</p>
                  <p className="mt-2 text-lg font-semibold">Find streaming options</p>
                </div>
                <Tv className="size-6 text-primary" />
              </a>
            </div>

            <Button asChild variant="heroSecondary" size="xl">
              <Link to="/discover">Back to Discover</Link>
            </Button>
          </div>
        </section>

        {relatedQuery.data?.length ? (
          <section className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">You May Also Like</p>
              <h2 className="font-display text-4xl uppercase tracking-[0.08em]">More cinematic picks</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {relatedQuery.data.map((item) => (
                <CineMovieCard key={item.imdbID} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <CineFooter />
    </div>
  );
};

export default MovieDetailPage;

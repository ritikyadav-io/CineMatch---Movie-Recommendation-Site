import { useQuery } from "@tanstack/react-query";
import { Loader2, PlayCircle, Tv, X } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import { getRelatedCatalogEntries } from "@/data/cinematchCatalog";
import { fetchOmdbBatch, fetchOmdbTitle, fetchYouTubeTrailerId, getYouTubeEmbedUrl, getTrailerSearchUrl, getWatchSearchUrl } from "@/lib/omdb";

const MovieDetailPage = () => {
  const { imdbID = "" } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);

  const detailQuery = useQuery({ queryKey: ["movie", imdbID], queryFn: () => fetchOmdbTitle(imdbID), enabled: Boolean(imdbID), staleTime: 1000 * 60 * 60 });
  const relatedIds = getRelatedCatalogEntries(imdbID, 5).map((item) => item.imdbID);
  const relatedQuery = useQuery({ queryKey: ["movie", imdbID, "related"], queryFn: () => fetchOmdbBatch(relatedIds), enabled: relatedIds.length > 0, staleTime: 1000 * 60 * 60 });

  const movie = detailQuery.data;
  const trailerQuery = useQuery({
    queryKey: ["youtube-trailer", movie?.title, movie?.year],
    queryFn: () => fetchYouTubeTrailerId(movie!.title, movie!.year),
    enabled: Boolean(movie),
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (detailQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DNANav />
        <main className="container pt-24 pb-12">
          <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            Loading movie details...
          </div>
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DNANav />
        <main className="container pt-24 pb-12">
          <div className="py-16 text-center text-muted-foreground">We couldn't load that title right now.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container space-y-8 pt-24 pb-12 lg:pt-28 lg:pb-16">
        <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
          <img src={movie.poster} alt={`${movie.title} poster`} className="w-full rounded-lg object-cover" loading="eager" />
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {movie.type === "series" ? "Series" : "Movie"} Detail
              </span>
              <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl mt-1">{movie.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{movie.overview}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-secondary px-3 py-1 text-secondary-foreground">{movie.year}</span>
              <span className="rounded bg-secondary px-3 py-1 text-secondary-foreground">IMDb {movie.rating}</span>
              {movie.runtime && <span className="rounded bg-secondary px-3 py-1 text-secondary-foreground">{movie.runtime}</span>}
              <span className="rounded bg-secondary px-3 py-1 text-secondary-foreground">{movie.language}</span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-foreground mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre} className="rounded bg-card px-3 py-1 text-xs text-foreground border border-border">{genre}</span>
                ))}
              </div>
            </div>

            {movie.actors?.length ? (
              <div>
                <h2 className="text-sm font-bold text-foreground mb-1">Cast</h2>
                <p className="text-xs text-muted-foreground">{movie.actors.join(" • ")}</p>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              {trailerQuery.data ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-between rounded-lg bg-card p-4 transition hover:bg-secondary"
                >
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Trailer</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">Watch Trailer</p>
                  </div>
                  <PlayCircle className="size-5 text-primary" />
                </button>
              ) : (
                <a href={getTrailerSearchUrl(movie.title, movie.year)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg bg-card p-4 transition hover:bg-secondary">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Trailer</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">Watch Trailer</p>
                  </div>
                  <PlayCircle className="size-5 text-primary" />
                </a>
              )}
              <a href={getWatchSearchUrl(movie.title, movie.year)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg bg-card p-4 transition hover:bg-secondary">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Streaming</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">Find Where to Watch</p>
                </div>
                <Tv className="size-5 text-primary" />
              </a>
            </div>

            {trailerQuery.data && (
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="relative aspect-video">
                  <img src={`https://img.youtube.com/vi/${trailerQuery.data}/hqdefault.jpg`} alt={`${movie.title} trailer`} className="h-full w-full object-cover" />
                  <button onClick={() => setShowTrailer(true)} className="absolute inset-0 flex items-center justify-center bg-background/30 transition hover:bg-background/10">
                    <div className="flex size-14 items-center justify-center rounded-full bg-background/80 text-foreground transition hover:bg-primary hover:text-primary-foreground">
                      <PlayCircle className="size-7" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            <Button asChild variant="heroSecondary">
              <Link to="/discover">Back to Discover</Link>
            </Button>
          </div>
        </section>

        {relatedQuery.data?.length ? (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">More Like This</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {relatedQuery.data.map((item) => (
                <CineMovieCard key={item.imdbID} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <DNAFooter />

      {showTrailer && trailerQuery.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm" onClick={() => setShowTrailer(false)}>
          <button onClick={() => setShowTrailer(false)} className="absolute right-4 top-4 z-50 rounded-full bg-secondary p-2 text-foreground hover:bg-muted" aria-label="Close">
            <X className="size-5" />
          </button>
          <div className="w-full max-w-5xl px-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe src={getYouTubeEmbedUrl(trailerQuery.data)} className="h-full w-full" allowFullScreen allow="autoplay; encrypted-media" title={`${movie.title} trailer`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;

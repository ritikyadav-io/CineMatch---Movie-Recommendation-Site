import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  DollarSign,
  Eye,
  Flame,
  Loader2,
  PlayCircle,
  Share2,
  Star,
  Tv,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { Button } from "@/components/ui/button";
import { WatchlistButton } from "@/components/moviedna/WatchlistButton";
import { fetchTmdbFullDetail, TmdbFullDetail } from "@/lib/tmdb-detail";
import { fetchTmdbSimilar } from "@/lib/tmdb";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { getWatchSearchUrl } from "@/lib/omdb";

const MovieDetailPage = () => {
  const { imdbID = "" } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);

  // Extract tmdb id from "tmdb-123" format or use as-is for imdb ids
  const tmdbId = imdbID.startsWith("tmdb-") ? Number(imdbID.replace("tmdb-", "")) : null;

  const detailQuery = useQuery({
    queryKey: ["movie-detail", imdbID],
    queryFn: () => fetchTmdbFullDetail(tmdbId!),
    enabled: Boolean(tmdbId),
    staleTime: 1000 * 60 * 60,
  });

  const movie = detailQuery.data;

  const similarQuery = useQuery({
    queryKey: ["movie-similar", tmdbId],
    queryFn: () => fetchTmdbSimilar(tmdbId!),
    enabled: Boolean(tmdbId),
    staleTime: 1000 * 60 * 60,
  });

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out "${movie?.title}" on Movie DNA!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: movie?.title, text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

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
        <main className="container pt-24 pb-12 text-center space-y-4">
          <div className="py-16 text-muted-foreground">We couldn't load that title right now.</div>
          <Button asChild variant="heroSecondary">
            <Link to="/">
              <ArrowLeft className="size-4" /> Back Home
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  const formatMoney = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
    if (n > 0) return `$${n.toLocaleString()}`;
    return "N/A";
  };

  // Content level estimation based on certification
  const certLevels: Record<string, { nudity: string; action: string }> = {
    G: { nudity: "None", action: "Low" },
    PG: { nudity: "None", action: "Mild" },
    "PG-13": { nudity: "Mild", action: "Moderate" },
    R: { nudity: "Moderate", action: "High" },
    "NC-17": { nudity: "High", action: "High" },
    U: { nudity: "None", action: "Low" },
    UA: { nudity: "Mild", action: "Moderate" },
    A: { nudity: "Moderate–High", action: "High" },
  };
  const levels = certLevels[movie.certification] || { nudity: "Unknown", action: "Unknown" };

  // Flatten watch providers
  const allProviders = [
    ...(movie.watch_providers_us?.flatrate || []),
    ...(movie.watch_providers_in?.flatrate || []),
    ...(movie.watch_providers_us?.rent || []),
    ...(movie.watch_providers_in?.rent || []),
  ];
  const uniqueProviders = allProviders.filter(
    (p, i, arr) => arr.findIndex((x) => x.provider_id === p.provider_id) === i
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-[30vh] sm:h-[40vh] lg:h-[50vh] overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>
      )}

      <main className={`container px-3 sm:px-4 lg:px-8 space-y-6 sm:space-y-8 pb-8 sm:pb-12 ${movie.backdrop_path ? "-mt-24 sm:-mt-40 relative z-10" : "pt-20 sm:pt-24"}`}>
        {/* Top section: Poster + Info */}
        <section className="grid gap-4 sm:gap-6 grid-cols-[120px_1fr] sm:grid-cols-[180px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="w-full rounded-xl shadow-2xl"
              loading="eager"
            />
            <WatchlistButton
              movie={{
                imdbID: movie.imdbID,
                title: movie.title,
                year: movie.year,
                rating: movie.rating,
                genres: movie.genres,
                poster: movie.poster,
                overview: movie.overview,
                language: movie.language,
                type: "movie",
              }}
            />
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Movie Detail</span>
              <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-foreground mt-1">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm italic text-muted-foreground mt-1">"{movie.tagline}"</p>
              )}
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-secondary-foreground max-w-3xl line-clamp-4 sm:line-clamp-none">
                {movie.overview}
              </p>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-secondary px-3 py-1.5 text-secondary-foreground font-medium">{movie.year}</span>
              <span className="flex items-center gap-1 rounded bg-secondary px-3 py-1.5 text-secondary-foreground font-medium">
                <Star className="size-3 fill-yellow-500 text-yellow-500" /> {movie.rating}
              </span>
              {movie.runtime && (
                <span className="rounded bg-secondary px-3 py-1.5 text-secondary-foreground font-medium">{movie.runtime}</span>
              )}
              {movie.certification && (
                <span className="rounded bg-primary/20 px-3 py-1.5 text-primary font-bold">{movie.certification}</span>
              )}
              {movie.director && (
                <span className="rounded bg-secondary px-3 py-1.5 text-secondary-foreground font-medium">🎬 {movie.director}</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">{g}</span>
              ))}
            </div>

            {/* Budget & Earnings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-card p-3 border border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <DollarSign className="size-3" /> Budget
                </div>
                <p className="text-sm font-bold text-foreground">{formatMoney(movie.budget)}</p>
              </div>
              <div className="rounded-lg bg-card p-3 border border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <DollarSign className="size-3" /> Revenue
                </div>
                <p className="text-sm font-bold text-foreground">{formatMoney(movie.revenue)}</p>
              </div>
              <div className="rounded-lg bg-card p-3 border border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Eye className="size-3" /> Nudity Level
                </div>
                <p className="text-sm font-bold text-foreground">{levels.nudity}</p>
              </div>
              <div className="rounded-lg bg-card p-3 border border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Flame className="size-3" /> Action Level
                </div>
                <p className="text-sm font-bold text-foreground">{levels.action}</p>
              </div>
            </div>

            {/* Trailer + Where to Watch buttons */}
            <div className="grid gap-3 sm:grid-cols-2">
              {movie.trailer ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-between rounded-lg bg-primary p-4 text-primary-foreground transition hover:opacity-90"
                >
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">Trailer</p>
                    <p className="text-sm font-semibold mt-0.5">Watch Trailer</p>
                  </div>
                  <PlayCircle className="size-5" />
                </button>
              ) : null}
              <a
                href={getWatchSearchUrl(movie.title, movie.year)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg bg-card border border-border p-4 transition hover:bg-secondary"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Streaming</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">Find Where to Watch</p>
                </div>
                <Tv className="size-5 text-primary" />
              </a>
              {/* Share button */}
              <button
                onClick={handleShare}
                className="flex items-center justify-between rounded-lg bg-card border border-border p-4 transition hover:bg-secondary"
              >
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Share</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">Share with Friends</p>
                </div>
                <Share2 className="size-5 text-primary" />
              </button>
            </div>
          </div>
        </section>

        {/* Watch Providers */}
        {uniqueProviders.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">📺 Available On</h2>
            <div className="flex flex-wrap gap-3">
              {uniqueProviders.map((p) => (
                <div key={p.provider_id} className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2">
                  {p.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      className="size-8 rounded"
                    />
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded bg-muted">
                      <Tv className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-foreground">{p.provider_name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {movie.cast.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">🎭 Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {movie.cast.map((actor) => (
                <div key={actor.id} className="flex items-center gap-3 rounded-lg bg-card border border-border p-3">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="size-12 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{actor.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailer thumbnail */}
        {movie.trailer && !showTrailer && (
          <section>
            <div className="overflow-hidden rounded-xl border border-border cursor-pointer" onClick={() => setShowTrailer(true)}>
              <div className="relative aspect-video">
                <img
                  src={`https://img.youtube.com/vi/${movie.trailer}/maxresdefault.jpg`}
                  alt={`${movie.title} trailer`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/30 transition hover:bg-background/10">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <PlayCircle className="size-8" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {(similarQuery.data?.length ?? 0) > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">🎬 Similar Movies</h2>
            <div className="grid gap-2 sm:gap-3 grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {similarQuery.data!.slice(0, 10).map((item) => (
                <CineMovieCard key={item.imdbID} item={item} />
              ))}
            </div>
          </section>
        )}

        <Button asChild variant="heroSecondary">
          <Link to="/">
            <ArrowLeft className="size-4" /> Back Home
          </Link>
        </Button>
      </main>

      <DNAFooter />

      {/* Trailer Modal — YouTube-style top layout */}
      {showTrailer && movie.trailer && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
          onClick={() => setShowTrailer(false)}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 bg-black/80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 min-w-0">
              <PlayCircle className="size-4 sm:size-5 text-primary shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{movie.title} — Trailer</h3>
            </div>
            <button
              onClick={() => setShowTrailer(false)}
              className="shrink-0 rounded-full bg-white/10 p-1.5 sm:p-2 text-white hover:bg-white/20 transition"
              aria-label="Close"
            >
              <X className="size-4 sm:size-5" />
            </button>
          </div>

          {/* Video */}
          <div className="flex-1 flex items-start justify-center pt-0 sm:pt-4 px-0 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-5xl">
              <div className="relative aspect-video overflow-hidden sm:rounded-lg bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1&rel=0&modestbranding=1`}
                  className="h-full w-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  title={`${movie.title} trailer`}
                />
              </div>
              {/* Info below video */}
              <div className="px-3 sm:px-0 py-3 space-y-1">
                <h4 className="text-sm sm:text-lg font-bold text-white">{movie.title}</h4>
                <p className="text-[10px] sm:text-xs text-white/60">
                  {movie.year} • {movie.genres?.join(", ")} • IMDb {movie.rating}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;

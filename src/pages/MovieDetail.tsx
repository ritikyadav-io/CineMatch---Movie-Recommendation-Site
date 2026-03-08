import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  DollarSign,
  Eye,
  ExternalLink,
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
import { CastBioModal } from "@/components/moviedna/CastBioModal";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { MovieDetailSkeleton } from "@/components/moviedna/MovieDetailSkeleton";
import { Button } from "@/components/ui/button";
import { WatchlistButton } from "@/components/moviedna/WatchlistButton";
import { fetchTmdbFullDetail, fetchTmdbFullDetailByImdb, TmdbFullDetail } from "@/lib/tmdb-detail";
import { fetchTmdbSimilar } from "@/lib/tmdb";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { getWatchSearchUrl } from "@/lib/omdb";
import { supabase } from "@/integrations/supabase/client";

const WATCH_LINKS = [
  { name: "JioCinema", url: (t: string) => `https://www.jiocinema.com/search/${encodeURIComponent(t)}`, color: "bg-pink-600" },
  { name: "Netflix", url: (t: string) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`, color: "bg-red-600" },
  { name: "Prime Video", url: (t: string) => `https://www.primevideo.com/search?phrase=${encodeURIComponent(t)}`, color: "bg-blue-500" },
  { name: "Hotstar", url: (t: string) => `https://www.hotstar.com/in/search?q=${encodeURIComponent(t)}`, color: "bg-blue-700" },
];

const MovieDetailPage = () => {
  const { imdbID = "" } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);
  const [summaryLang, setSummaryLang] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const tmdbId = imdbID.startsWith("tmdb-") ? Number(imdbID.replace("tmdb-", "")) : null;
  const isImdbId = imdbID.startsWith("tt");

  const detailQuery = useQuery({
    queryKey: ["movie-detail", imdbID],
    queryFn: () => tmdbId ? fetchTmdbFullDetail(tmdbId) : fetchTmdbFullDetailByImdb(imdbID),
    enabled: Boolean(tmdbId || isImdbId),
    staleTime: 1000 * 60 * 60,
  });

  const movie = detailQuery.data;

  const resolvedTmdbId = movie?.tmdbId || tmdbId;

  const similarQuery = useQuery({
    queryKey: ["movie-similar", resolvedTmdbId],
    queryFn: () => fetchTmdbSimilar(resolvedTmdbId!),
    enabled: Boolean(resolvedTmdbId),
    staleTime: 1000 * 60 * 60,
  });

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out "${movie?.title}" on Movies DNA!`;
    if (navigator.share) {
      try { await navigator.share({ title: movie?.title, text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const fetchSummary = async (lang: string) => {
    setSummaryLang(lang);
    setSummary("");
    setSummaryLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("movie-summary", {
        body: { title: movie?.title, overview: movie?.overview, language: lang },
      });
      if (error) throw error;
      setSummary(data.summary);
    } catch {
      setSummary("Failed to load summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DNANav />
        <MovieDetailSkeleton />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DNANav />
        <main className="container pt-20 pb-8 text-center space-y-3">
          <div className="py-12 text-muted-foreground text-xs">We couldn't load that title.</div>
          <Button asChild variant="heroSecondary" size="sm">
            <Link to="/"><ArrowLeft className="size-3.5" /> Back Home</Link>
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

      {/* Backdrop — compact */}
      {movie.backdrop_path && (
        <div className="relative h-[25vh] sm:h-[35vh] lg:h-[45vh] overflow-hidden animate-fade-in">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>
      )}

      <main className={`animate-fade-in container px-3 sm:px-4 lg:px-8 space-y-4 sm:space-y-6 pb-6 sm:pb-10 ${movie.backdrop_path ? "-mt-20 sm:-mt-32 relative z-10" : "pt-16 sm:pt-20"}`}>
        {/* Poster + Info */}
        <section className="grid gap-3 sm:gap-5 grid-cols-[100px_1fr] sm:grid-cols-[160px_1fr] lg:grid-cols-[240px_1fr]">
          <div className="space-y-2">
            <img src={movie.poster} alt={`${movie.title} poster`} className="w-full rounded-lg shadow-xl" loading="eager" />
            <WatchlistButton
              movie={{
                imdbID: movie.imdbID, title: movie.title, year: movie.year,
                rating: movie.rating, genres: movie.genres, poster: movie.poster,
                overview: movie.overview, language: movie.language, type: "movie",
              }}
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <span className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-primary">Movie Detail</span>
              <h1 className="text-base sm:text-2xl lg:text-4xl font-black tracking-tight text-foreground mt-0.5">{movie.title}</h1>
              {movie.tagline && <p className="text-[10px] sm:text-sm italic text-muted-foreground">"{movie.tagline}"</p>}
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs leading-relaxed text-secondary-foreground max-w-3xl line-clamp-3 sm:line-clamp-none">{movie.overview}</p>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-1 sm:gap-2 text-[8px] sm:text-xs">
              <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground font-medium">{movie.year}</span>
              <span className="flex items-center gap-0.5 rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground font-medium">
                <Star className="size-2 sm:size-3 fill-yellow-500 text-yellow-500" /> {movie.rating}
              </span>
              {movie.runtime && <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground font-medium">{movie.runtime}</span>}
              {movie.certification && <span className="rounded bg-primary/20 px-1.5 sm:px-3 py-0.5 sm:py-1 text-primary font-bold">{movie.certification}</span>}
              {movie.director && <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground font-medium">🎬 {movie.director}</span>}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1">
              {movie.genres.map((g) => (
                <span key={g} className="rounded-full border border-border bg-card px-2 py-0.5 text-[8px] sm:text-xs text-foreground">{g}</span>
              ))}
            </div>

            {/* Budget & Earnings — compact */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { icon: DollarSign, label: "Budget", value: formatMoney(movie.budget) },
                { icon: DollarSign, label: "Revenue", value: formatMoney(movie.revenue) },
                { icon: Eye, label: "Nudity", value: levels.nudity },
                { icon: Flame, label: "Action", value: levels.action },
              ].map((s) => (
                <div key={s.label} className="rounded-md bg-card p-2 border border-border">
                  <div className="flex items-center gap-1 text-[8px] sm:text-xs text-muted-foreground">
                    <s.icon className="size-2.5 sm:size-3" /> {s.label}
                  </div>
                  <p className="text-[10px] sm:text-sm font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="grid gap-1.5 sm:gap-2 grid-cols-3">
              {movie.trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-center gap-1.5 rounded-md bg-primary p-2 sm:p-3 text-primary-foreground transition hover:opacity-90"
                >
                  <PlayCircle className="size-3.5 sm:size-4" />
                  <span className="text-[9px] sm:text-xs font-bold">Trailer</span>
                </button>
              )}
              <a
                href={getWatchSearchUrl(movie.title, movie.year)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-md bg-card border border-border p-2 sm:p-3 transition hover:bg-secondary"
              >
                <Tv className="size-3.5 sm:size-4 text-primary" />
                <span className="text-[9px] sm:text-xs font-bold text-foreground">Stream</span>
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-md bg-card border border-border p-2 sm:p-3 transition hover:bg-secondary"
              >
                <Share2 className="size-3.5 sm:size-4 text-primary" />
                <span className="text-[9px] sm:text-xs font-bold text-foreground">Share</span>
              </button>
            </div>
          </div>
        </section>


        {/* ═══ Watch Online Links ═══ */}
        <section className="space-y-2 sm:space-y-3">
          <h2 className="text-sm sm:text-lg font-bold text-foreground">🔗 Watch Online</h2>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {WATCH_LINKS.map((w) => (
              <a
                key={w.name}
                href={w.url(movie.title)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${w.color} rounded-md p-1.5 sm:p-2 text-center text-white transition hover:opacity-80`}
              >
                <ExternalLink className="size-2.5 sm:size-3 mx-auto mb-0.5" />
                <p className="text-[7px] sm:text-[10px] font-bold">{w.name}</p>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ Movie Summary ═══ */}
        <section className="space-y-2 sm:space-y-3">
          <h2 className="text-sm sm:text-lg font-bold text-foreground">📖 Full Story Summary</h2>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {[
              { code: "en", label: "English" },
              { code: "hi", label: "हिंदी" },
              { code: "es", label: "Español" },
              { code: "fr", label: "Français" },
              { code: "de", label: "Deutsch" },
              { code: "ja", label: "日本語" },
              { code: "ko", label: "한국어" },
              { code: "pt", label: "Português" },
              { code: "ar", label: "العربية" },
              { code: "zh", label: "中文" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => fetchSummary(lang.code)}
                className={`rounded-md px-2 py-1 text-[8px] sm:text-[10px] font-bold transition ${
                  summaryLang === lang.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-secondary"
                }`}
              >
                <BookOpen className="size-2.5 sm:size-3 inline mr-0.5" />
                {lang.label}
              </button>
            ))}
          </div>
          {summaryLoading && (
            <div className="flex items-center gap-2 py-4 text-muted-foreground text-xs">
              <Loader2 className="size-3.5 animate-spin text-primary" /> Generating summary...
            </div>
          )}
          {summary && !summaryLoading && (
            <div className="rounded-lg bg-card border border-border p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs leading-relaxed text-secondary-foreground whitespace-pre-line">{summary}</p>
            </div>
          )}
        </section>

        {uniqueProviders.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm sm:text-lg font-bold text-foreground">📺 Available On</h2>
            <div className="flex flex-wrap gap-2">
              {uniqueProviders.map((p) => (
                <div key={p.provider_id} className="flex items-center gap-1.5 rounded-md bg-card border border-border px-2 py-1.5">
                  {p.logo_path ? (
                    <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} className="size-6 rounded" />
                  ) : (
                    <div className="flex size-6 items-center justify-center rounded bg-muted"><Tv className="size-3 text-muted-foreground" /></div>
                  )}
                  <span className="text-[10px] font-medium text-foreground">{p.provider_name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailer thumbnail */}
        {movie.trailer && !showTrailer && (
          <section>
            <div className="overflow-hidden rounded-lg border border-border cursor-pointer" onClick={() => setShowTrailer(true)}>
              <div className="relative aspect-video">
                <img src={`https://img.youtube.com/vi/${movie.trailer}/maxresdefault.jpg`} alt={`${movie.title} trailer`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-background/30 transition hover:bg-background/10">
                  <div className="flex size-12 sm:size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <PlayCircle className="size-6 sm:size-8" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cast */}
        {movie.cast.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm sm:text-lg font-bold text-foreground">🎭 Cast</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {movie.cast.map((actor) => (
                <button
                  key={actor.id}
                  onClick={() => setSelectedActorId(actor.id)}
                  className="shrink-0 flex items-center gap-2 rounded-md bg-card border border-border p-2 w-[140px] sm:w-[180px] text-left transition hover:border-primary hover:bg-secondary cursor-pointer"
                >
                  {actor.profile_path ? (
                    <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="size-8 sm:size-10 rounded-full object-cover shrink-0" loading="lazy" />
                  ) : (
                    <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full bg-muted"><User className="size-3.5 text-muted-foreground" /></div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-foreground truncate">{actor.name}</p>
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate">{actor.character}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {(similarQuery.data?.length ?? 0) > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm sm:text-lg font-bold text-foreground">🎬 Similar Movies</h2>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {similarQuery.data!.slice(0, 12).map((item) => (
                <div key={item.imdbID} className="shrink-0 w-[80px] sm:w-[120px] lg:w-[140px]">
                  <CineMovieCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <DNAFooter />

      {/* Trailer Modal — YouTube-style */}
      {showTrailer && movie.trailer && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col" onClick={() => setShowTrailer(false)}>
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 bg-black/80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 min-w-0">
              <PlayCircle className="size-4 sm:size-5 text-primary shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{movie.title} — Trailer</h3>
            </div>
            <button onClick={() => setShowTrailer(false)} className="shrink-0 rounded-full bg-white/10 p-1.5 sm:p-2 text-white hover:bg-white/20 transition" aria-label="Close">
              <X className="size-4 sm:size-5" />
            </button>
          </div>
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
              <div className="px-3 sm:px-0 py-2 space-y-0.5">
                <h4 className="text-sm sm:text-lg font-bold text-white">{movie.title}</h4>
                <p className="text-[10px] sm:text-xs text-white/60">{movie.year} • {movie.genres?.join(", ")} • IMDb {movie.rating}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cast Bio Modal */}
      {selectedActorId && (
        <CastBioModal actorId={selectedActorId} onClose={() => setSelectedActorId(null)} />
      )}
    </div>
  );
};

export default MovieDetailPage;

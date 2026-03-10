import { useQuery } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck, Loader2, RefreshCw, Shuffle, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import heroDiscover from "@/assets/hero-discover.jpg";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { WatchlistButton } from "@/components/moviedna/WatchlistButton";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import { defaultQuizAnswers, sectionMap } from "@/data/cinematchCatalog";
import { fetchOmdbBatch } from "@/lib/omdb";
import { fetchQuizRecommendations } from "@/lib/tmdb-quiz";
import { fetchTmdbTrending, fetchTmdbTopRated } from "@/lib/tmdb";
import { fetchTmdbFullDetail, TmdbFullDetail } from "@/lib/tmdb-detail";
import { DiscoverSectionKey, MediaCardData, QuizAnswers } from "@/types/cinematch";

/* ── Helper: pick one random movie and fetch full details ── */
async function fetchSuggestion(seed: number): Promise<{ detail: TmdbFullDetail; similar: any[] }> {
  const page = (seed % 5) + 1;
  const trending = await fetchTmdbTrending(page);
  const topRated = await fetchTmdbTopRated(page);
  const pool = [...trending, ...topRated];
  if (!pool.length) throw new Error("No movies found");

  const pick = pool[seed % pool.length];
  // imdbID is "tmdb-{id}" or "tmdb-tv-{id}"
  const idStr = pick.imdbID.replace("tmdb-tv-", "").replace("tmdb-", "");
  const tmdbId = parseInt(idStr, 10);
  const mediaType = pick.type === "series" ? "tv" : "movie";

  const detail = await fetchTmdbFullDetail(tmdbId, mediaType as "movie" | "tv");

  // Rest as "similar" suggestions
  const similar = pool.filter((m) => m.imdbID !== pick.imdbID).slice(0, 10);

  return { detail, similar };
}

const DiscoverPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const section = searchParams.get("section") as DiscoverSectionKey | null;
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000));

  const quizAnswers: QuizAnswers = {
    contentType: (searchParams.get("contentType") as QuizAnswers["contentType"]) || defaultQuizAnswers.contentType,
    genre: searchParams.get("genre") || defaultQuizAnswers.genre,
    language: searchParams.get("language") || defaultQuizAnswers.language,
    mood: (searchParams.get("mood") as QuizAnswers["mood"]) || defaultQuizAnswers.mood,
    violence: (searchParams.get("violence") as QuizAnswers["violence"]) || defaultQuizAnswers.violence,
    nudity: (searchParams.get("nudity") as QuizAnswers["nudity"]) || defaultQuizAnswers.nudity,
    releasePeriod: (searchParams.get("releasePeriod") as QuizAnswers["releasePeriod"]) || defaultQuizAnswers.releasePeriod,
    runtime: (searchParams.get("runtime") as QuizAnswers["runtime"]) || defaultQuizAnswers.runtime,
    complexity: (searchParams.get("complexity") as QuizAnswers["complexity"]) || defaultQuizAnswers.complexity,
    bollywoodVibe: (searchParams.get("bollywoodVibe") as QuizAnswers["bollywoodVibe"]) || defaultQuizAnswers.bollywoodVibe,
    superheroPreference: (searchParams.get("superheroPreference") as QuizAnswers["superheroPreference"]) || defaultQuizAnswers.superheroPreference,
    animeStyle: (searchParams.get("animeStyle") as QuizAnswers["animeStyle"]) || defaultQuizAnswers.animeStyle,
  };

  const isQuizMode = mode === "quiz";
  const isSectionMode = !isQuizMode && mode !== "random" && !!section;
  const isSuggestionMode = !isQuizMode && !isSectionMode;

  // Quiz mode
  const quizQuery = useQuery({
    queryKey: ["quiz-discover", quizAnswers.contentType, quizAnswers.genre, quizAnswers.language, quizAnswers.mood, quizAnswers.violence, quizAnswers.releasePeriod, quizAnswers.runtime],
    queryFn: () => fetchQuizRecommendations(quizAnswers),
    staleTime: 1000 * 60 * 5,
    enabled: isQuizMode,
  });

  // Section mode
  const sectionIds = section && sectionMap[section] ? sectionMap[section].ids.slice(0, 12) : [];
  const sectionQuery = useQuery({
    queryKey: ["discover-section", section, sectionIds.join("|")],
    queryFn: () => fetchOmdbBatch(sectionIds),
    staleTime: 1000 * 60 * 60,
    enabled: isSectionMode && sectionIds.length > 0,
  });

  // Suggestion mode: one movie with full details
  const suggestionQuery = useQuery({
    queryKey: ["my-suggestion", seed],
    queryFn: () => fetchSuggestion(seed),
    staleTime: 0,
    gcTime: 0,
    enabled: isSuggestionMode,
  });

  // Existing quiz/section logic
  const recommendations = isQuizMode ? (quizQuery.data || []) : isSectionMode ? (sectionQuery.data || []) : [];
  const isLoading = isQuizMode ? quizQuery.isLoading : isSectionMode ? sectionQuery.isLoading : suggestionQuery.isLoading;

  const headline = isQuizMode
    ? `${quizAnswers.genre} ${quizAnswers.contentType === "series" ? "Series" : "Movies"} — ${quizAnswers.mood}`
    : isSectionMode && section && sectionMap[section]
      ? sectionMap[section].title
      : "My Suggestion";

  const description = isQuizMode
    ? `${quizAnswers.language !== "Any" ? quizAnswers.language + " " : ""}${quizAnswers.releasePeriod} • ${quizAnswers.runtime} • ${quizAnswers.complexity}`
    : isSectionMode && section && sectionMap[section]
      ? sectionMap[section].description
      : "A hand-picked movie just for you — with full details.";

  const topPick = recommendations[0] || null;
  const moreLikeThis = recommendations.slice(1);

  const suggestion = suggestionQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      {/* Hero Banner */}
      <div className="relative mt-14 sm:mt-16 h-36 sm:h-44 lg:h-52 overflow-hidden">
        <img
          src={isSuggestionMode && suggestion?.detail.backdrop_path ? `https://image.tmdb.org/t/p/w1280${suggestion.detail.backdrop_path}` : heroDiscover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="container relative flex items-end h-full pb-5 sm:pb-6 px-4 sm:px-6">
          <section className="flex flex-col gap-1.5 sm:gap-2 lg:flex-row lg:items-end lg:justify-between w-full">
            <div>
              <span className="text-xs sm:text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                <Star className="size-3" /> {isSuggestionMode ? "My Suggestion" : "Discover"}
              </span>
              <h1 className="text-xl sm:text-4xl font-black tracking-tight text-foreground">{headline}</h1>
              <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="flex gap-2 self-start">
              {isSuggestionMode && (
                <Button
                  variant="hero"
                  size="default"
                  className="text-xs"
                  onClick={() => setSeed(Math.floor(Math.random() * 10000))}
                  disabled={suggestionQuery.isFetching}
                >
                  <RefreshCw className={`size-3.5 ${suggestionQuery.isFetching ? "animate-spin" : ""}`} />
                  {suggestionQuery.isFetching ? "Loading..." : "New Suggestion"}
                </Button>
              )}
              {isQuizMode && (
                <Button asChild variant="heroSecondary" size="default" className="text-xs">
                  <Link to="/quiz">Retake Quiz</Link>
                </Button>
              )}
              <Button asChild variant="heroSecondary" size="default" className="text-xs">
                <Link to="/browse">
                  <Shuffle className="size-3.5" />
                  Browse All
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>

      <main className="container space-y-4 sm:space-y-8 pt-4 pb-8 sm:pt-6 sm:pb-12 lg:pb-16 px-4 sm:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground text-xs">
            <Loader2 className="size-4 animate-spin text-primary" />
            Finding the perfect movie for you...
          </div>
        ) : isSuggestionMode && suggestion ? (
          <>
            {/* ── Full detail card for the suggested movie ── */}
            <section className="grid gap-4 sm:gap-6 grid-cols-[0.35fr_0.65fr] sm:grid-cols-[0.3fr_0.7fr] rounded-lg bg-card overflow-hidden">
              <img
                src={suggestion.detail.poster}
                alt={`${suggestion.detail.title} poster`}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="p-3 sm:p-6 lg:p-8 space-y-2 sm:space-y-3 flex flex-col justify-center">
                <span className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                  🎬 Today's Pick For You
                </span>
                <h2 className="text-lg sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                  {suggestion.detail.title}
                </h2>
                {suggestion.detail.tagline && (
                  <p className="text-[9px] sm:text-sm italic text-muted-foreground">"{suggestion.detail.tagline}"</p>
                )}
                <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-4 sm:line-clamp-none">
                  {suggestion.detail.overview}
                </p>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-1 sm:gap-2 text-[8px] sm:text-xs">
                  <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">{suggestion.detail.year}</span>
                  {suggestion.detail.rating !== "—" && suggestion.detail.rating !== "N/A" && (
                    <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">⭐ {suggestion.detail.rating}</span>
                  )}
                  {suggestion.detail.runtime && (
                    <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">⏱ {suggestion.detail.runtime}</span>
                  )}
                  {suggestion.detail.certification && (
                    <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">{suggestion.detail.certification}</span>
                  )}
                  <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">
                    {suggestion.detail.genres.slice(0, 3).join(" • ")}
                  </span>
                </div>

                {/* Director & Budget */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] sm:text-xs text-muted-foreground">
                  {suggestion.detail.director && (
                    <span>🎥 <strong className="text-foreground">{suggestion.detail.director}</strong></span>
                  )}
                  {suggestion.detail.budget > 0 && (
                    <span>💰 Budget: <strong className="text-foreground">${(suggestion.detail.budget / 1_000_000).toFixed(0)}M</strong></span>
                  )}
                  {suggestion.detail.revenue > 0 && (
                    <span>📈 Revenue: <strong className="text-foreground">${(suggestion.detail.revenue / 1_000_000).toFixed(0)}M</strong></span>
                  )}
                </div>

                {/* Cast */}
                {suggestion.detail.cast.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {suggestion.detail.cast.slice(0, 5).map((c) => (
                      <span key={c.id} className="rounded bg-muted px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] text-foreground">
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 sm:pt-2">
                  <Button asChild variant="hero" size="sm" className="text-[10px] sm:text-sm !h-7 sm:!h-9 !px-3 sm:!px-4">
                    <Link to={`/movie/${suggestion.detail.imdbID}`}>View Full Details</Link>
                  </Button>
                  {suggestion.detail.trailer && (
                    <Button asChild variant="heroSecondary" size="sm" className="text-[10px] sm:text-sm !h-7 sm:!h-9 !px-3 sm:!px-4">
                      <a href={`https://www.youtube.com/watch?v=${suggestion.detail.trailer}`} target="_blank" rel="noopener noreferrer">
                        ▶ Trailer
                      </a>
                    </Button>
                  )}
                  <WatchlistButton
                    movie={{
                      imdbID: suggestion.detail.imdbID,
                      title: suggestion.detail.title,
                      year: suggestion.detail.year,
                      rating: suggestion.detail.rating,
                      genres: suggestion.detail.genres,
                      poster: suggestion.detail.poster,
                      overview: suggestion.detail.overview,
                      language: suggestion.detail.language,
                      type: "movie",
                    }}
                    className="!p-2"
                  />
                </div>
              </div>
            </section>

            {/* Similar picks */}
            {suggestion.similar.length > 0 && (
              <section className="space-y-2 sm:space-y-4">
                <h2 className="text-sm sm:text-xl font-bold text-foreground">You May Also Like</h2>
                <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                  {suggestion.similar.map((item) => (
                    <CineMovieCard key={item.imdbID} item={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : topPick ? (
          <>
            <section className="grid gap-3 sm:gap-6 grid-cols-[0.35fr_0.65fr] sm:grid-cols-[0.4fr_0.6fr] rounded-lg bg-card overflow-hidden">
              <img src={topPick.poster} alt={`${topPick.title} poster`} className="w-full h-full object-cover" loading="eager" />
              <div className="p-3 sm:p-6 lg:p-8 space-y-2 sm:space-y-4 flex flex-col justify-center">
                <span className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                  Top {topPick.type === "series" ? "Series" : "Movie"} Pick
                </span>
                <h2 className="text-base sm:text-3xl font-black tracking-tight text-foreground">{topPick.title}</h2>
                <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-none">{topPick.overview}</p>
                <div className="flex flex-wrap gap-1 sm:gap-2 text-[8px] sm:text-xs">
                  <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">{topPick.year}</span>
                  {topPick.rating !== "—" && topPick.rating !== "N/A" && (
                    <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">⭐ {topPick.rating}</span>
                  )}
                  <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">{topPick.genres.slice(0, 2).join(" • ")}</span>
                </div>
                <div className="flex gap-2 pt-1 sm:pt-2">
                  <Button asChild variant="hero" size="sm" className="text-[10px] sm:text-sm !h-7 sm:!h-9 !px-3 sm:!px-4">
                    <Link to={`/movie/${topPick.imdbID}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </section>

            {moreLikeThis.length > 0 && (
              <section className="space-y-2 sm:space-y-4">
                <h2 className="text-sm sm:text-xl font-bold text-foreground">You May Also Like</h2>
                <div className="grid gap-2 grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                  {moreLikeThis.map((item) => (
                    <CineMovieCard key={item.imdbID} item={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground text-xs">No results matched. Try a broader genre or language.</div>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default DiscoverPage;

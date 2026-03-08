import { useQuery } from "@tanstack/react-query";
import { Loader2, Shuffle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { Button } from "@/components/ui/button";
import { defaultQuizAnswers, filterCatalogByQuiz, getRandomCatalogPick, sectionMap } from "@/data/cinematchCatalog";
import { fetchOmdbBatch, fetchOmdbTitle } from "@/lib/omdb";
import { DiscoverSectionKey, QuizAnswers } from "@/types/cinematch";

const DiscoverPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const section = searchParams.get("section") as DiscoverSectionKey | null;

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

  const selectedIds = (() => {
    if (mode === "random") return [getRandomCatalogPick().imdbID];
    if (mode === "quiz") return filterCatalogByQuiz(quizAnswers).slice(0, 6).map((entry) => entry.imdbID);
    if (section && sectionMap[section]) return sectionMap[section].ids;
    return sectionMap.trending.ids;
  })();

  const recommendationsQuery = useQuery({
    queryKey: ["discover", mode, section, selectedIds.join("|")],
    queryFn: () => fetchOmdbBatch(selectedIds),
    staleTime: 1000 * 60 * 60,
  });

  const surpriseQuery = useQuery({
    queryKey: ["discover", "surprise", selectedIds[0]],
    queryFn: () => fetchOmdbTitle(getRandomCatalogPick().imdbID),
    staleTime: 1000 * 60 * 60,
  });

  const headline = mode === "quiz"
    ? "Your Results"
    : mode === "random"
      ? "Surprise Me"
      : section && sectionMap[section]
        ? sectionMap[section].title
        : "Discover";

  const description = mode === "quiz"
    ? "A top recommendation plus supporting picks tuned to your taste."
    : mode === "random"
      ? "A wildcard pick for instant movie-night energy."
      : section && sectionMap[section]
        ? sectionMap[section].description
        : "Explore hand-picked movies and series.";

  const topPick = recommendationsQuery.data?.[0];
  const moreLikeThis = recommendationsQuery.data?.slice(1) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container space-y-4 sm:space-y-8 pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-16 px-3 sm:px-6">
        <section className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Discover</span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">{headline}</h1>
            <p className="max-w-2xl text-[10px] sm:text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
          <Button asChild variant="heroSecondary" size="sm" className="self-start text-xs">
            <Link to="/discover?mode=random">
              <Shuffle className="size-3.5" />
              Surprise Me
            </Link>
          </Button>
        </section>

        {recommendationsQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground text-xs">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading recommendations...
          </div>
        ) : topPick ? (
          <>
            <section className="grid gap-3 sm:gap-6 grid-cols-[0.35fr_0.65fr] sm:grid-cols-[0.4fr_0.6fr] rounded-lg bg-card overflow-hidden">
              <img src={topPick.poster} alt={`${topPick.title} poster`} className="w-full h-full object-cover" loading="eager" />
              <div className="p-3 sm:p-6 lg:p-8 space-y-2 sm:space-y-4 flex flex-col justify-center">
                <span className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                  Top {topPick.type === "series" ? "Series" : "Movie"}
                </span>
                <h2 className="text-base sm:text-3xl font-black tracking-tight text-foreground">{topPick.title}</h2>
                <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-none">{topPick.overview}</p>
                <div className="flex flex-wrap gap-1 sm:gap-2 text-[8px] sm:text-xs">
                  <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">{topPick.year}</span>
                  <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">IMDb {topPick.rating}</span>
                  <span className="rounded bg-secondary px-1.5 sm:px-3 py-0.5 sm:py-1 text-secondary-foreground">{topPick.genres.slice(0, 2).join(" • ")}</span>
                </div>
                <div className="flex gap-2 pt-1 sm:pt-2">
                  <Button asChild variant="hero" size="sm" className="text-[10px] sm:text-sm !h-7 sm:!h-9 !px-3 sm:!px-4">
                    <Link to={`/movie/${topPick.imdbID}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="heroSecondary" size="sm" className="text-[10px] sm:text-sm !h-7 sm:!h-9 !px-3 sm:!px-4">
                    <Link to="/quiz">Retake Quiz</Link>
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

        {surpriseQuery.data && (
          <section className="flex flex-col gap-2 sm:gap-3 rounded-lg bg-card p-3 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-primary">Wildcard</span>
              <h2 className="text-sm sm:text-lg font-bold text-foreground">Tonight's Surprise</h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{surpriseQuery.data.title} is standing by.</p>
            </div>
            <Button asChild variant="heroSecondary" size="sm" className="self-start text-xs">
              <Link to={`/movie/${surpriseQuery.data.imdbID}`}>View Pick</Link>
            </Button>
          </section>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default DiscoverPage;

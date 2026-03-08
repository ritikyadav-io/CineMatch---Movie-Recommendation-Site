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
    ? "Your CineMatch Results"
    : mode === "random"
      ? "Surprise Me"
      : section && sectionMap[section]
        ? sectionMap[section].title
        : "Discover";

  const description = mode === "quiz"
    ? "A top recommendation plus supporting picks tuned to your selected taste profile."
    : mode === "random"
      ? "A wildcard pick for when you want instant movie-night energy."
      : section && sectionMap[section]
        ? sectionMap[section].description
        : "Explore hand-picked movies and series.";

  const topPick = recommendationsQuery.data?.[0];
  const moreLikeThis = recommendationsQuery.data?.slice(1) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container space-y-10 py-12 lg:space-y-14 lg:py-16">
        <section className="section-shell flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Discover mode</p>
            <h1 className="font-display text-5xl uppercase tracking-[0.08em] sm:text-6xl">{headline}</h1>
            <p className="max-w-3xl text-muted-foreground">{description}</p>
          </div>
          <Button asChild variant="heroSecondary" size="sm">
            <Link to="/discover?mode=random">
              <Shuffle className="size-4" />
              Surprise Me
            </Link>
          </Button>
        </section>

        {recommendationsQuery.isLoading ? (
          <div className="section-shell flex items-center justify-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            Loading recommendations...
          </div>
        ) : topPick ? (
          <>
            <section className="grid gap-8 section-shell lg:grid-cols-[0.42fr_0.58fr]">
              <img src={topPick.poster} alt={`${topPick.title} poster`} className="w-full rounded-[1.8rem] border border-border/70 object-cover shadow-poster" loading="eager" />
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary">Top Recommended {topPick.type === "series" ? "Series" : "Movie"}</p>
                  <h2 className="font-display text-4xl uppercase tracking-[0.08em] sm:text-5xl">{topPick.title}</h2>
                  <p className="text-muted-foreground">{topPick.overview}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-foreground">
                  <span className="rounded-full border border-border bg-secondary px-4 py-2">{topPick.year}</span>
                  <span className="rounded-full border border-border bg-secondary px-4 py-2">IMDb {topPick.rating}</span>
                  <span className="rounded-full border border-border bg-secondary px-4 py-2">{topPick.genres.slice(0, 2).join(" • ")}</span>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild variant="hero" size="xl">
                    <Link to={`/movie/${topPick.imdbID}`}>Open Detail Page</Link>
                  </Button>
                  <Button asChild variant="heroSecondary" size="xl">
                    <Link to="/quiz">Retake Quiz</Link>
                  </Button>
                </div>
              </div>
            </section>

            {moreLikeThis.length > 0 && (
              <section className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-primary">You May Also Like</p>
                  <h2 className="font-display text-4xl uppercase tracking-[0.08em]">Backup picks</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                  {moreLikeThis.map((item) => (
                    <CineMovieCard key={item.imdbID} item={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="section-shell py-16 text-center text-muted-foreground">No results matched that exact taste profile. Try a broader genre or language choice.</div>
        )}

        {surpriseQuery.data && (
          <section className="section-shell flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Random Movie Button</p>
              <h2 className="font-display text-3xl uppercase tracking-[0.08em]">Tonight’s wildcard</h2>
              <p className="text-muted-foreground">{surpriseQuery.data.title} is standing by if you want a fresh curveball.</p>
            </div>
            <Button asChild variant="ghostGold" size="sm">
              <Link to={`/movie/${surpriseQuery.data.imdbID}`}>View surprise pick</Link>
            </Button>
          </section>
        )}
      </main>
      <DNAFooter />
    </div>
  );
};

export default DiscoverPage;

import { useQuery } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { CineFooter } from "@/components/cinematch/CineFooter";
import { CineHeroSection } from "@/components/cinematch/CineHeroSection";
import { CineMatchNav } from "@/components/cinematch/CineMatchNav";
import { CinePosterRow } from "@/components/cinematch/CinePosterRow";
import { Button } from "@/components/ui/button";
import { sectionMap } from "@/data/cinematchCatalog";
import { fetchOmdbBatch } from "@/lib/omdb";

const sectionEntries = Object.entries(sectionMap);

const Index = () => {
  const trendingQuery = useQuery({ queryKey: ["home", "trending"], queryFn: () => fetchOmdbBatch(sectionMap.trending.ids), staleTime: 1000 * 60 * 60 });
  const topRatedQuery = useQuery({ queryKey: ["home", "top-rated"], queryFn: () => fetchOmdbBatch(sectionMap["top-rated"].ids), staleTime: 1000 * 60 * 60 });
  const hiddenGemsQuery = useQuery({ queryKey: ["home", "hidden-gems"], queryFn: () => fetchOmdbBatch(sectionMap["hidden-gems"].ids), staleTime: 1000 * 60 * 60 });
  const seriesQuery = useQuery({ queryKey: ["home", "series"], queryFn: () => fetchOmdbBatch(sectionMap.series.ids), staleTime: 1000 * 60 * 60 });

  const isLoading = [trendingQuery, topRatedQuery, hiddenGemsQuery, seriesQuery].some((query) => query.isLoading);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CineMatchNav />
      <main>
        <CineHeroSection />

        <section className="container space-y-14 py-14 lg:space-y-20 lg:py-20">
          <div className="section-shell flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Your next obsession</p>
              <h2 className="font-display text-4xl uppercase tracking-[0.08em]">Quiz-powered picks, trending lists, and hidden gems.</h2>
              <p className="max-w-2xl text-muted-foreground">CineMatch blends taste matching with poster-first discovery so finding the right movie feels instant and cinematic.</p>
            </div>
            <Button asChild variant="hero" size="xl">
              <Link to="/quiz">
                <Sparkles className="size-4" />
                Start Movie Quiz
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="section-shell flex items-center justify-center gap-3 py-20 text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />
              Loading spotlight selections...
            </div>
          ) : (
            <div className="space-y-14 lg:space-y-20">
              {trendingQuery.data && <CinePosterRow title={sectionMap.trending.title} description={sectionMap.trending.description} items={trendingQuery.data} actionLabel="See all trending" actionHref="/discover?section=trending" />}
              {topRatedQuery.data && <CinePosterRow title={sectionMap["top-rated"].title} description={sectionMap["top-rated"].description} items={topRatedQuery.data} actionLabel="Explore top rated" actionHref="/discover?section=top-rated" />}
              {hiddenGemsQuery.data && <CinePosterRow title={sectionMap["hidden-gems"].title} description={sectionMap["hidden-gems"].description} items={hiddenGemsQuery.data} actionLabel="Uncover hidden gems" actionHref="/discover?section=hidden-gems" />}
              {seriesQuery.data && <CinePosterRow title={sectionMap.series.title} description={sectionMap.series.description} items={seriesQuery.data} actionLabel="Browse series" actionHref="/discover?section=series" />}
            </div>
          )}
        </section>
      </main>
      <CineFooter />
    </div>
  );
};

export default Index;

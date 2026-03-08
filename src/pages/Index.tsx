import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Info, Loader2, Play } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/moviedna-hero.jpg";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { CTASection } from "@/components/moviedna/CTASection";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import { MoviePersonality } from "@/components/moviedna/MoviePersonality";
import { Button } from "@/components/ui/button";
import {
  fetchTmdbTrending,
  fetchTmdbBollywood,
  fetchTmdbSuperhero,
  fetchTmdbAnime,
  fetchTmdbNowPlaying,
  fetchTmdbTopRated,
  fetchTmdbHorror,
  fetchTmdbSciFi,
} from "@/lib/tmdb";

const Index = () => {
  const trending = useQuery({ queryKey: ["home-trending"], queryFn: () => fetchTmdbTrending(1), staleTime: 1000 * 60 * 30 });
  const nowPlaying = useQuery({ queryKey: ["home-nowplaying"], queryFn: () => fetchTmdbNowPlaying(1), staleTime: 1000 * 60 * 30 });
  const topRated = useQuery({ queryKey: ["home-toprated"], queryFn: () => fetchTmdbTopRated(1), staleTime: 1000 * 60 * 30 });
  const bollywood = useQuery({ queryKey: ["home-bollywood"], queryFn: () => fetchTmdbBollywood(1), staleTime: 1000 * 60 * 30 });
  const superhero = useQuery({ queryKey: ["home-superhero"], queryFn: () => fetchTmdbSuperhero(1), staleTime: 1000 * 60 * 30 });
  const anime = useQuery({ queryKey: ["home-anime"], queryFn: () => fetchTmdbAnime(1), staleTime: 1000 * 60 * 30 });
  const scifi = useQuery({ queryKey: ["home-scifi"], queryFn: () => fetchTmdbSciFi(1), staleTime: 1000 * 60 * 30 });
  const horror = useQuery({ queryKey: ["home-horror"], queryFn: () => fetchTmdbHorror(1), staleTime: 1000 * 60 * 30 });

  const sections = [
    { title: "🔥 Trending Now", data: trending.data, loading: trending.isLoading, link: "/browse?cat=trending" },
    { title: "🎬 Now Playing", data: nowPlaying.data, loading: nowPlaying.isLoading, link: "/browse?cat=nowplaying" },
    { title: "⭐ Top Rated", data: topRated.data, loading: topRated.isLoading, link: "/browse?cat=toprated" },
    { title: "🇮🇳 Bollywood", data: bollywood.data, loading: bollywood.isLoading, link: "/browse?cat=bollywood" },
    { title: "🦸 Superhero", data: superhero.data, loading: superhero.isLoading, link: "/browse?cat=superhero" },
    { title: "🌸 Anime", data: anime.data, loading: anime.isLoading, link: "/browse?cat=anime" },
    { title: "🚀 Sci-Fi", data: scifi.data, loading: scifi.isLoading, link: "/browse?cat=scifi" },
    { title: "👻 Horror", data: horror.data, loading: horror.isLoading, link: "/browse?cat=horror" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container px-3 sm:px-4 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12 space-y-6 sm:space-y-10 lg:space-y-12">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-xl h-[240px] sm:h-[340px] lg:h-[400px]">
          <img src={heroImage} alt="Movie DNA" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-4 sm:p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded bg-primary/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary w-fit mb-2 sm:mb-3">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Now Streaming
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Discover Your <span className="text-primary">Movie DNA</span>
            </h1>
            <p className="mt-1 sm:mt-2 max-w-lg text-xs sm:text-sm text-secondary-foreground line-clamp-2">
              Personalized movie recommendations from Hollywood, Bollywood, Superhero & Anime universes.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <Button asChild variant="hero" size="sm" className="sm:!h-10 sm:!px-5">
                <Link to="/quiz"><Play className="size-3.5 sm:size-4 fill-current" /> Start Quiz</Link>
              </Button>
              <Button asChild variant="heroSecondary" size="sm" className="sm:!h-10 sm:!px-5">
                <Link to="/browse"><Info className="size-3.5 sm:size-4" /> Browse All</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Movie Sections */}
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-foreground">{section.title}</h2>
              <Link to={section.link} className="flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition">
                See All <ChevronRight className="size-4" />
              </Link>
            </div>
            {section.loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary mr-2" /> Loading...
              </div>
            ) : section.data?.length ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {section.data.slice(0, 8).map((item) => (
                  <CineMovieCard key={item.imdbID} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {/* Personality Types */}
        <MoviePersonality />
      </main>
      <CTASection />
      <DNAFooter />
    </div>
  );
};

export default Index;

import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Info, Loader2, Play } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/moviedna-hero.jpg";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { CategoryBar } from "@/components/moviedna/CategoryBar";
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

      {/* Hero Section — inline to avoid layout collapse */}
      <section className="relative overflow-hidden" style={{ height: '75vh', minHeight: 500 }}>
        <div className="absolute inset-0">
          <img src={heroImage} alt="Movie DNA hero" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="container relative flex h-full items-end pb-16 lg:items-center lg:pb-0">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Now Streaming
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Discover Your<br />
              <span className="text-primary">Movie DNA</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-secondary-foreground sm:text-lg">
              Answer a few questions and find movies perfectly matched to your taste —
              from Hollywood blockbusters to Bollywood epics, superhero sagas to anime adventures.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button asChild variant="hero" size="xl">
                <Link to="/quiz"><Play className="size-5 fill-current" /> Start Quiz</Link>
              </Button>
              <Button
                variant="heroSecondary"
                size="xl"
                onClick={() => {
                  const cats = ["trending", "toprated", "bollywood", "superhero", "anime", "scifi", "horror", "nowplaying"];
                  window.location.href = `/browse?cat=${cats[Math.floor(Math.random() * cats.length)]}`;
                }}
              >
                <Info className="size-5" /> Explore
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content — outside of hero to avoid collapse */}
      <main className="container space-y-12 py-10 lg:py-14">
        {/* Category Bar */}
        <CategoryBar />

        {/* Movie Sections */}
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              <Link to={section.link} className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition">
                See All <ChevronRight className="size-4" />
              </Link>
            </div>
            {section.loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary mr-2" /> Loading...
              </div>
            ) : section.data?.length ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {section.data.slice(0, 10).map((item) => (
                  <CineMovieCard key={item.imdbID} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </main>

      <MoviePersonality />
      <CTASection />
      <DNAFooter />
    </div>
  );
};

export default Index;

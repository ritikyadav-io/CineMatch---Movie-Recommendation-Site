import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";
import {
  fetchTmdbTrending,
  fetchTmdbBollywood,
  fetchTmdbSuperhero,
  fetchTmdbAnime,
  fetchTmdbNowPlaying,
} from "@/lib/tmdb";

const Index = () => {
  const trending = useQuery({ queryKey: ["home-trending"], queryFn: () => fetchTmdbTrending(1), staleTime: 1000 * 60 * 30 });
  const nowPlaying = useQuery({ queryKey: ["home-nowplaying"], queryFn: () => fetchTmdbNowPlaying(1), staleTime: 1000 * 60 * 30 });
  const bollywood = useQuery({ queryKey: ["home-bollywood"], queryFn: () => fetchTmdbBollywood(1), staleTime: 1000 * 60 * 30 });
  const superhero = useQuery({ queryKey: ["home-superhero"], queryFn: () => fetchTmdbSuperhero(1), staleTime: 1000 * 60 * 30 });
  const anime = useQuery({ queryKey: ["home-anime"], queryFn: () => fetchTmdbAnime(1), staleTime: 1000 * 60 * 30 });

  const sections = [
    { title: "🔥 Trending Now", data: trending.data, loading: trending.isLoading, link: "/browse?cat=trending" },
    { title: "🎬 Now Playing", data: nowPlaying.data, loading: nowPlaying.isLoading, link: "/browse?cat=nowplaying" },
    { title: "🇮🇳 Bollywood", data: bollywood.data, loading: bollywood.isLoading, link: "/browse?cat=bollywood" },
    { title: "🦸 Superhero", data: superhero.data, loading: superhero.isLoading, link: "/browse?cat=superhero" },
    { title: "🌸 Anime", data: anime.data, loading: anime.isLoading, link: "/browse?cat=anime" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <main className="container pt-24 pb-12 space-y-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Discover Your <span className="text-primary">Movie DNA</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Explore movies across Hollywood, Bollywood, Superhero, and Anime universes.</p>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              <Link to={section.link} className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
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
      <DNAFooter />
    </div>
  );
};

export default Index;

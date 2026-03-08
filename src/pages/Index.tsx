import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { CategoryBar } from "@/components/moviedna/CategoryBar";
import { CTASection } from "@/components/moviedna/CTASection";
import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNAHero } from "@/components/moviedna/DNAHero";
import { DNANav } from "@/components/moviedna/DNANav";
import { MoviePersonality } from "@/components/moviedna/MoviePersonality";
import { CineMovieCard } from "@/components/cinematch/CineMovieCard";
import {
  fetchTmdbTrending,
  fetchTmdbBollywood,
  fetchTmdbSuperhero,
  fetchTmdbAnime,
  fetchTmdbSciFi,
  fetchTmdbTopRated,
  fetchTmdbHorror,
  fetchTmdbSeries,
  fetchTmdbNowPlaying,
} from "@/lib/tmdb";
import type { MediaCardData } from "@/types/cinematch";

const movieSections = [
  { title: "🔥 Trending Now", key: "tmdb-trending", fetcher: fetchTmdbTrending, link: "/browse?cat=trending" },
  { title: "🎬 Now Playing", key: "tmdb-nowplaying", fetcher: fetchTmdbNowPlaying, link: "/browse?cat=nowplaying" },
  { title: "⭐ Top Rated", key: "tmdb-toprated", fetcher: fetchTmdbTopRated, link: "/browse?cat=toprated" },
  { title: "🇮🇳 Bollywood", key: "tmdb-bollywood", fetcher: fetchTmdbBollywood, link: "/browse?cat=bollywood" },
  { title: "🦸 Superhero", key: "tmdb-superhero", fetcher: fetchTmdbSuperhero, link: "/browse?cat=superhero" },
  { title: "🌸 Anime", key: "tmdb-anime", fetcher: fetchTmdbAnime, link: "/browse?cat=anime" },
  { title: "🚀 Sci-Fi", key: "tmdb-scifi", fetcher: fetchTmdbSciFi, link: "/browse?cat=scifi" },
  { title: "👻 Horror", key: "tmdb-horror", fetcher: fetchTmdbHorror, link: "/browse?cat=horror" },
  { title: "📺 Trending Series", key: "tmdb-series", fetcher: fetchTmdbSeries, link: "/browse?cat=series" },
];

function HomeMovieRow({ title, queryKey, fetcher, link }: { title: string; queryKey: string; fetcher: (p?: number) => Promise<MediaCardData[]>; link: string }) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetcher(1),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <Link to={link} className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
          See All <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {data.slice(0, 5).map((item) => (
          <CineMovieCard key={item.imdbID} item={item} />
        ))}
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />
      <DNAHero />
      <CategoryBar />

      <div className="container py-10 space-y-10">
        {movieSections.map((s) => (
          <HomeMovieRow key={s.key} title={s.title} queryKey={s.key} fetcher={s.fetcher} link={s.link} />
        ))}
      </div>

      <MoviePersonality />
      <CTASection />
      <DNAFooter />
    </div>
  );
};

export default Index;
